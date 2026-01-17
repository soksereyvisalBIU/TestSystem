import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { debounce } from 'lodash';
import { X, AlertCircle } from 'lucide-react';
import { route } from 'ziggy-js';
import { cn } from '@/lib/utils';

// Components & Types
import QuestionRenderer from '@/components/student/assessment/QuestionRenderer';
import { AssessmentAttemptProps, Stats } from '@/types/student/assessment';
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
import { calculateRemainingTime, calculateStats } from './components/function/formatTime';

export default function AssessmentAttempt({
    assessment,
    questions,
    student_assessment_attempt_id,
    studentAssessmentAttempt,
}: AssessmentAttemptProps) {
    const { props } = usePage();
    const STORAGE_KEY = useMemo(() => `exam_draft_${student_assessment_attempt_id}`, [student_assessment_attempt_id]);
    const subject = assessment.subjects[0];
    const isCompleted = studentAssessmentAttempt.status !== 'draft';

    // --- 1. STATE MANAGEMENT ---
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
    const [isSaving, setIsSaving] = useState(false);
    const [viewSettings, setViewSettings] = useState({
        mode: 'scroll' as 'scroll' | 'single',
        focusMode: false,
        fontSize: 16,
    });
    const [navigation, setNavigation] = useState({
        activeId: null as number | null,
        currentIndex: 0,
        isMobileOpen: false,
    });
    const [modals, setModals] = useState({
        submit: false,
        review: false,
    });

    const questionRefs = useRef<Record<number, HTMLDivElement | null>>({});
    const form = useForm({ answers: {}, user_id: props?.auth?.user?.id });

    // --- 2. PERSISTENCE & SYNC ---
    const persistAnswers = useMemo(
        () => debounce((data: Record<string, any>) => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            setIsSaving(false);
        }, 1500),
        [STORAGE_KEY]
    );

    const updateAnswer = useCallback((id: string, value: any) => {
        if (isCompleted || form.processing) return;
        setIsSaving(true);
        setAnswers((prev) => {
            const updated = { ...prev, [id]: value };
            persistAnswers(updated);
            return updated;
        });
    }, [isCompleted, form.processing, persistAnswers]);

    // --- 3. SUBMISSION LOGIC ---
    const handleFinalSubmit = useCallback(() => {
        if (form.processing) return;

        form.transform(() => ({ answers, user_id: props?.auth?.user?.id }));
        form.post(
            route('student.classes.subjects.assessments.attempt.store', {
                class_id: subject.class_id,
                subject_id: subject.id,
                assessment_id: assessment.id,
                student_assessment_attempt_id,
            }),
            {
                onSuccess: () => {
                    localStorage.removeItem(STORAGE_KEY);
                    persistAnswers.cancel();
                },
                preserveScroll: true,
            }
        );
    }, [answers, subject, assessment.id, student_assessment_attempt_id, form, STORAGE_KEY, persistAnswers]);

    // --- 4. TIMER & NETWORK EFFECTS ---
    const [timeLeft, setTimeLeft] = useState(() => 
        calculateRemainingTime(studentAssessmentAttempt.started_at, assessment.duration)
    );

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (!isCompleted) e.preventDefault();
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        window.addEventListener('beforeunload', handleBeforeUnload);

        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) setAnswers(JSON.parse(saved));

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [STORAGE_KEY, isCompleted]);

    useEffect(() => {
        if (isCompleted || form.processing) return;

        const timer = setInterval(() => {
            const remaining = calculateRemainingTime(studentAssessmentAttempt.started_at, assessment.duration);
            if (remaining <= 0) {
                setTimeLeft(0);
                clearInterval(timer);
                handleFinalSubmit(); // Auto-submit on expiry
            } else {
                setTimeLeft(remaining);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [studentAssessmentAttempt.started_at, assessment.duration, isCompleted, form.processing, handleFinalSubmit]);

    // --- 5. NAVIGATION HANDLERS ---
    const handleNavigate = useCallback((id: number, index: number) => {
        setNavigation(prev => ({ ...prev, activeId: id, currentIndex: index, isMobileOpen: false }));
        
        const scrollTarget = viewSettings.mode === 'single' ? window : questionRefs.current[id];
        if (scrollTarget) {
            const offset = 100;
            const top = viewSettings.mode === 'single' ? 0 : 
                (questionRefs.current[id]?.getBoundingClientRect().top ?? 0) + window.scrollY - offset;
            
            window.scrollTo({ top, behavior: 'smooth' });
        }
    }, [viewSettings.mode]);

    const stats: Stats = useMemo(() => calculateStats(answers, questions.data.length), [answers, questions.data]);

    if (isCompleted) return <CompletionScreen onReturnToDashboard={() => window.location.href = '/'} />;

    return (
        <div 
            className="min-h-screen bg-slate-50/50 dark:bg-slate-950 transition-all duration-300"
            style={{ fontSize: `${viewSettings.fontSize}px` }}
        >
            <AssessmentHeader
                stats={stats}
                isOnline={isOnline}
                isSaving={isSaving || form.processing}
                timeLeft={timeLeft}
                onSubmit={() => setModals(m => ({ ...m, submit: true }))}
                disableSubmit={!isOnline || form.processing}
            />

            {!isOnline && (
                <div className="bg-destructive/10 text-destructive text-sm py-2 px-4 flex items-center justify-center gap-2 sticky top-16 z-40 backdrop-blur-md">
                    <AlertCircle size={16} />
                    Connection lost. Progress is being saved locally.
                </div>
            )}

            <div className="mx-auto flex max-w-7xl gap-8 px-4 py-6 sm:py-10">
                <main className={cn('flex-1 space-y-6', viewSettings.focusMode && 'mx-auto max-w-3xl')}>
                    {(navigation.currentIndex === 0 || viewSettings.mode === 'scroll') && (
                        <AssessmentTitleCard title={assessment.title} questionCount={questions.data.length} />
                    )}

                    <div className="space-y-10">
                        {questions.data.map((q, index) => {
                            if (viewSettings.mode === 'single' && index !== navigation.currentIndex) return null;
                            return (
                                <div key={q.id} ref={(el) => (questionRefs.current[q.id] = el)}>
                                    <QuestionCard
                                        question={q}
                                        index={index}
                                        answer={answers[q.id]}
                                        isActive={navigation.activeId === q.id || viewSettings.mode === 'single'}
                                        onAnswerChange={updateAnswer}
                                        renderQuestion={(question, idx, ans, onChange, disabled) => (
                                            <QuestionRenderer
                                                question={question}
                                                index={idx}
                                                answer={ans}
                                                onAnswerChange={onChange}
                                                disabled={disabled || form.processing}
                                            />
                                        )}
                                    />
                                    {viewSettings.mode === 'single' && (
                                        <SingleViewNavigation
                                            currentIndex={navigation.currentIndex}
                                            totalQuestions={questions.data.length}
                                            onPrevious={() => handleNavigate(questions.data[index - 1].id, index - 1)}
                                            onNext={() => handleNavigate(questions.data[index + 1].id, index + 1)}
                                            onSubmit={() => setModals(m => ({ ...m, submit: true }))}
                                            isFirstQuestion={index === 0}
                                            isLastQuestion={index === questions.data.length - 1}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {viewSettings.mode === 'scroll' && (
                        <ScrollViewEndSection 
                            onReview={() => setModals(m => ({ ...m, review: true }))} 
                            onSubmit={() => setModals(m => ({ ...m, submit: true }))} 
                        />
                    )}
                </main>

                {!viewSettings.focusMode && (
                    <aside className="sticky top-24 hidden h-fit w-72 shrink-0 lg:block">
                        <NavigationSidebar
                            questions={questions.data}
                            answers={answers}
                            activeQuestionId={navigation.activeId}
                            currentQuestionIndex={navigation.currentIndex}
                            viewMode={viewSettings.mode}
                            onNavigate={handleNavigate}
                            onViewModeChange={(mode) => setViewSettings(v => ({ ...v, mode }))}
                        />
                    </aside>
                )}
            </div>

            {/* Mobile Navigation & Dialogs */}
            <MobileDrawer 
                isOpen={navigation.isMobileOpen} 
                onClose={() => setNavigation(n => ({ ...n, isMobileOpen: false }))}
            >
                <NavigationSidebar
                    questions={questions.data}
                    answers={answers}
                    activeQuestionId={navigation.activeId}
                    currentQuestionIndex={navigation.currentIndex}
                    viewMode={viewSettings.mode}
                    onNavigate={handleNavigate}
                    onViewModeChange={(mode) => setViewSettings(v => ({ ...v, mode }))}
                />
            </MobileDrawer>

            <FloatingTools
                fontSize={viewSettings.fontSize}
                isFocusMode={viewSettings.focusMode}
                onFontSizeIncrease={() => setViewSettings(v => ({ ...v, fontSize: Math.min(v.fontSize + 2, 24) }))}
                onFontSizeDecrease={() => setViewSettings(v => ({ ...v, fontSize: Math.max(v.fontSize - 2, 12) }))}
                onToggleFocusMode={() => setViewSettings(v => ({ ...v, focusMode: !v.focusMode }))}
                onOpenNavigator={() => setNavigation(n => ({ ...n, isMobileOpen: true }))}
            />

            <SubmitConfirmationDialog
                isOpen={modals.submit}
                onOpenChange={(open) => setModals(m => ({ ...m, submit: open }))}
                stats={stats}
                onConfirm={handleFinalSubmit}
                isLoading={form.processing}
            />

            <ReviewSummaryDialog
                isOpen={modals.review}
                onOpenChange={(open) => setModals(m => ({ ...m, review: open }))}
                questions={questions.data}
                answers={answers}
                onNavigateToQuestion={handleNavigate}
                onSubmit={() => setModals({ review: false, submit: true })}
            />
        </div>
    );
}

// Sub-component for clean mobile view
function MobileDrawer({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm lg:hidden"
                    />
                    <motion.div
                        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 z-[51] w-full max-w-xs bg-white dark:bg-slate-900 p-6 shadow-2xl lg:hidden"
                    >
                        <div className="flex flex-col h-full">
                            <div className="flex items-center justify-between mb-6 border-b pb-4 dark:border-slate-800">
                                <h2 className="text-lg font-semibold tracking-tight">Navigator</h2>
                                <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto px-1">{children}</div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}