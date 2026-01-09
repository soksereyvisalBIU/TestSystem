import { cn } from '@/lib/utils';
import { useForm, usePage } from '@inertiajs/react';
import { debounce } from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { route } from 'ziggy-js';
import { AnimatePresence, motion } from 'framer-motion';
import { LayoutGrid, X } from 'lucide-react';

// Components
import QuestionRenderer from '@/components/student/assessment/QuestionRenderer';
import {
    AssessmentAttemptData,
    Question,
    StudentAttemptData,
} from '@/types/student/assessment';
import { AssessmentHeader } from './components/AssessmentHeader';
import { CompletionScreen } from './components/CompletionScreen';
import { FloatingTools } from './components/FloatingTools';
import { NavigationSidebar } from './components/Navigator';
import { ScrollViewEndSection } from './components/ScrollViewEndSection';
import { SingleViewNavigation } from './components/SingleViewNavigation';
import { AssessmentTitleCard } from './components/card/AssessmentTitleCard';
import { QuestionCard } from './components/card/QuestionCard';
import { ReviewSummaryDialog } from './components/dialog/ReviewSummaryDialog';
import { SubmitConfirmationDialog } from './components/dialog/SubmitConfirmationDialog';
import {
    calculateRemainingTime,
    calculateStats,
} from './components/function/formatTime';

interface AssessmentAttemptProps {
    assessment: AssessmentAttemptData;
    questions: { data: Question[] };
    student_assessment_attempt_id: number;
    studentAssessmentAttempt: StudentAttemptData;
}

export default function AssessmentAttempt({
    assessment,
    questions,
    student_assessment_attempt_id,
    studentAssessmentAttempt,
}: AssessmentAttemptProps) {
    const { props } = usePage();
    const subject = assessment.subjects[0];
    const isCompleted = studentAssessmentAttempt.status !== 'draft';
    const STORAGE_KEY = `exam_draft_${student_assessment_attempt_id}`;

    // --- STATE ---
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [isSaving, setIsSaving] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFocusMode, setIsFocusMode] = useState(false);
    const [fontSize, setFontSize] = useState(16);
    const [activeQuestionId, setActiveQuestionId] = useState<number | null>(null);
    const [viewMode, setViewMode] = useState<'scroll' | 'single'>('scroll');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

    // --- REFS & TIMER ---
    const questionRefs = useRef<Record<number, HTMLDivElement | null>>({});
    const [timeLeft, setTimeLeft] = useState(() =>
        calculateRemainingTime(studentAssessmentAttempt.started_at, assessment.duration)
    );

    const form = useForm({ answers: {}, user_id: props?.auth?.user?.id });

    // --- NAVIGATION LOGIC ---
    const handleNavigate = useCallback((id: number, index: number) => {
        setActiveQuestionId(id);
        if (viewMode === 'single') {
            setCurrentQuestionIndex(index);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            const element = questionRefs.current[id];
            if (element) {
                const offset = 100; // Header offset
                const bodyRect = document.body.getBoundingClientRect().top;
                const elementRect = element.getBoundingClientRect().top;
                const elementPosition = elementRect - bodyRect;
                const offsetPosition = elementPosition - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }
        setIsMobileNavOpen(false); // Close mobile drawer after jumping
    }, [viewMode]);

    const goToNext = useCallback(() => {
        if (currentQuestionIndex < questions.data.length - 1) {
            handleNavigate(questions.data[currentQuestionIndex + 1].id, currentQuestionIndex + 1);
        }
    }, [currentQuestionIndex, questions.data, handleNavigate]);

    const goToPrev = useCallback(() => {
        if (currentQuestionIndex > 0) {
            handleNavigate(questions.data[currentQuestionIndex - 1].id, currentQuestionIndex - 1);
        }
    }, [currentQuestionIndex, questions.data, handleNavigate]);

    // --- SUBMISSION & PERSISTENCE ---
    const handleFinalSubmit = useCallback(() => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        form.transform((data) => ({ ...data, answers }));
        form.post(route('student.classes.subjects.assessments.attempt.store', {
            class_id: subject.class_id,
            subject_id: subject.id,
            assessment_id: assessment.id,
            student_assessment_attempt_id,
        }), {
            onFinish: () => setIsSubmitting(false),
            onSuccess: () => {
                localStorage.removeItem(STORAGE_KEY);
                persistAnswers.cancel();
            },
        });
    }, [answers, isSubmitting, subject, assessment.id, student_assessment_attempt_id, form, STORAGE_KEY]);

    const persistAnswers = useMemo(() => debounce((data: Record<string, any>) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        setIsSaving(false);
    }, 1000), [STORAGE_KEY]);

    const updateAnswer = useCallback((id: string, value: any) => {
        if (isCompleted || isSubmitting) return;
        setIsSaving(true);
        setAnswers((prev) => {
            const updated = { ...prev, [id]: value };
            persistAnswers(updated);
            return updated;
        });
    }, [isCompleted, isSubmitting, persistAnswers]);

    // --- EFFECTS ---
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) { setAnswers(JSON.parse(saved)); }
    }, [STORAGE_KEY]);

    useEffect(() => {
        if (isCompleted || isSubmitting) return;
        const timer = setInterval(() => {
            const remaining = calculateRemainingTime(studentAssessmentAttempt.started_at, assessment.duration);
            if (remaining <= 0) {
                setTimeLeft(0);
                clearInterval(timer);
                handleFinalSubmit();
            } else { setTimeLeft(remaining); }
        }, 1000);
        return () => clearInterval(timer);
    }, [studentAssessmentAttempt.started_at, assessment.duration, isCompleted, isSubmitting, handleFinalSubmit]);

    const stats = useMemo(() => calculateStats(answers, questions.data.length), [answers, questions.data]);

    if (isCompleted) return <CompletionScreen onReturnToDashboard={() => (window.location.href = '/')} />;

    return (
        <div 
            className="min-h-screen bg-background text-body transition-colors duration-500 pb-24 lg:pb-0" 
            style={{ fontSize: `${fontSize}px` }}
        >
            <AssessmentHeader
                stats={stats}
                isOnline={isOnline}
                isSaving={isSaving || isSubmitting}
                timeLeft={timeLeft}
                onSubmit={() => setShowSubmitModal(true)}
                disableSubmit={!isOnline || isSubmitting}
            />

            <div className="mx-auto flex max-w-7xl gap-8 px-4 py-4 sm:py-8">
                <main className={cn('flex-1 space-y-4 transition-all', isFocusMode && 'mx-auto max-w-3xl')}>
                    {(currentQuestionIndex === 0 || viewMode === 'scroll') && (
                        <AssessmentTitleCard title={assessment.title} questionCount={questions.data.length} />
                    )}

                    <div className="space-y-12">
                        {questions.data.map((q, index) => {
                            if (viewMode === 'single' && index !== currentQuestionIndex) return null;
                            return (
                                <div key={q.id} data-q-id={q.id} ref={(el) => (questionRefs.current[q.id] = el)}>
                                    <QuestionCard
                                        question={q}
                                        index={index}
                                        answer={answers[q.id]}
                                        isActive={activeQuestionId === q.id || viewMode === 'single'}
                                        onAnswerChange={updateAnswer}
                                        renderQuestion={(question, idx, ans, onChange, disabled) => (
                                            <QuestionRenderer question={question} index={idx} answer={ans} onAnswerChange={onChange} disabled={disabled} />
                                        )}
                                    />
                                    {viewMode === 'single' && (
                                        <SingleViewNavigation
                                            currentIndex={currentQuestionIndex}
                                            totalQuestions={questions.data.length}
                                            onPrevious={goToPrev}
                                            onNext={goToNext}
                                            onSubmit={() => setShowSubmitModal(true)}
                                            isFirstQuestion={currentQuestionIndex === 0}
                                            isLastQuestion={currentQuestionIndex === questions.data.length - 1}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {viewMode === 'scroll' && (
                        <ScrollViewEndSection onReview={() => setShowReviewModal(true)} onSubmit={() => setShowSubmitModal(true)} />
                    )}
                </main>

                {/* DESKTOP SIDEBAR */}
                {!isFocusMode && (
                    <aside className="hidden lg:block sticky top-24 h-[calc(100vh-8rem)] w-64 shrink-0">
                        <NavigationSidebar
                            questions={questions.data}
                            answers={answers}
                            activeQuestionId={activeQuestionId}
                            currentQuestionIndex={currentQuestionIndex}
                            viewMode={viewMode}
                            onNavigate={handleNavigate}
                            onViewModeChange={setViewMode}
                        />
                    </aside>
                )}
            </div>


            {/* MOBILE NAVIGATION DRAWER */}
            <AnimatePresence>
                {isMobileNavOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileNavOpen(false)}
                            className="fixed inset-0 z-[50] bg-black/60 backdrop-blur-sm lg:hidden"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 right-0 z-[51] w-full max-w-[320px] bg-white p-6 shadow-xl dark:bg-gray-900 lg:hidden"
                        >
                            <div className="flex flex-col h-full">
                                <div className="flex items-center justify-between border-b pb-4 mb-4 dark:border-gray-800">
                                    <h2 className="text-lg font-bold">Exam Navigator</h2>
                                    <button onClick={() => setIsMobileNavOpen(false)} className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                                        <X size={20} />
                                    </button>
                                </div>
                                <div className="flex-1 overflow-y-auto">
                                    <NavigationSidebar
                                        questions={questions.data}
                                        answers={answers}
                                        activeQuestionId={activeQuestionId}
                                        currentQuestionIndex={currentQuestionIndex}
                                        viewMode={viewMode}
                                        onNavigate={handleNavigate}
                                        onViewModeChange={setViewMode}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <FloatingTools
                fontSize={fontSize}
                isFocusMode={isFocusMode}
                onFontSizeIncrease={() => setFontSize((s) => Math.min(s + 2, 24))}
                onFontSizeDecrease={() => setFontSize((s) => Math.max(s - 2, 12))}
                onToggleFocusMode={() => setIsFocusMode(!isFocusMode)}
                onOpenNavigator={() => setIsMobileNavOpen(true)}
            />

            <SubmitConfirmationDialog isOpen={showSubmitModal} onOpenChange={setShowSubmitModal} stats={stats} onConfirm={handleFinalSubmit} />

            <ReviewSummaryDialog
                isOpen={showReviewModal}
                onOpenChange={setShowReviewModal}
                questions={questions.data}
                answers={answers}
                onNavigateToQuestion={handleNavigate}
                onSubmit={() => { setShowReviewModal(false); setShowSubmitModal(true); }}
            />
        </div>
    );
}