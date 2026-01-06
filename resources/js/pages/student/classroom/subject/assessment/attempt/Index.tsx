import { cn } from '@/lib/utils';
import { useForm, usePage } from '@inertiajs/react';
import { debounce } from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { route } from 'ziggy-js';

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

    // STATE
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [isSaving, setIsSaving] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFocusMode, setIsFocusMode] = useState(false);
    const [fontSize, setFontSize] = useState(16);
    const [activeQuestionId, setActiveQuestionId] = useState<number | null>(
        null,
    );
    const [viewMode, setViewMode] = useState<'scroll' | 'single'>('scroll');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);

    // Timer State
    const [timeLeft, setTimeLeft] = useState(() =>
        calculateRemainingTime(
            studentAssessmentAttempt.started_at,
            assessment.duration,
        ),
    );

    const questionRefs = useRef<Record<number, HTMLDivElement | null>>({});
    const form = useForm({ answers: {}, user_id: props?.auth?.user?.id });

    // SUBMISSION LOGIC
    const handleFinalSubmit = useCallback(() => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        form.transform((data) => ({ ...data, answers }));
        form.post(
            route('student.classes.subjects.assessments.attempt.store', {
                class_id: subject.class_id,
                subject_id: subject.id,
                assessment_id: assessment.id,
                student_assessment_attempt_id,
            }),
            {
                onFinish: () => setIsSubmitting(false),
                onSuccess: () => {
                    localStorage.removeItem(STORAGE_KEY);
                    persistAnswers.cancel();
                },
            },
        );
    }, [
        answers,
        isSubmitting,
        subject,
        assessment.id,
        student_assessment_attempt_id,
    ]);

    // TIMER EFFECT
    useEffect(() => {
        if (isCompleted || isSubmitting) return;

        const timer = setInterval(() => {
            const remaining = calculateRemainingTime(
                studentAssessmentAttempt.started_at,
                assessment.duration,
            );

            if (remaining <= 0) {
                setTimeLeft(0);
                clearInterval(timer);
                // Auto-submit when time runs out
                handleFinalSubmit();
            } else {
                setTimeLeft(remaining);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [
        studentAssessmentAttempt.started_at,
        assessment.duration,
        isCompleted,
        isSubmitting,
        handleFinalSubmit,
    ]);

    // ONLINE STATUS MONITOR
    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // SCROLL SPY LOGIC
    useEffect(() => {
        if (viewMode !== 'scroll') return;

        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -60% 0px',
            threshold: 0,
        };

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('data-q-id');
                    if (id) setActiveQuestionId(parseInt(id));
                }
            });
        };

        const observer = new IntersectionObserver(
            observerCallback,
            observerOptions,
        );
        const elements = document.querySelectorAll('[data-q-id]');
        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, [viewMode, questions.data]);

    // RESTORE ANSWERS
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                setAnswers(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse local answers', e);
            }
        }
    }, [STORAGE_KEY]);

    const goToNext = useCallback(() => {
        if (currentQuestionIndex < questions.data.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [currentQuestionIndex, questions.data.length]);

    const goToPrev = useCallback(() => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prev) => prev - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [currentQuestionIndex]);

    const persistAnswers = useMemo(
        () =>
            debounce((data: Record<string, any>) => {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
                setIsSaving(false);
            }, 1000),
        [STORAGE_KEY],
    );

    const updateAnswer = useCallback(
        (id: string, value: any) => {
            if (isCompleted || isSubmitting) return;
            setIsSaving(true);
            setAnswers((prev) => {
                const updated = { ...prev, [id]: value };
                persistAnswers(updated);
                return updated;
            });
        },
        [isCompleted, isSubmitting, persistAnswers],
    );

    const stats = useMemo(
        () => calculateStats(answers, questions.data.length),
        [answers, questions.data],
    );

    if (isCompleted)
        return (
            <CompletionScreen
                onReturnToDashboard={() => (window.location.href = '/')}
            />
        );

    return (
        <div
            className={cn(
                'min-h-screen bg-background text-body transition-colors duration-500',
            )}
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

            <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8">
                <main
                    className={cn(
                        'flex-1 space-y-4 pb-32 transition-all',
                        isFocusMode && 'mx-auto max-w-3xl',
                    )}
                >
                    {(currentQuestionIndex === 0 || viewMode === 'scroll') && (
                        <AssessmentTitleCard
                            title={assessment.title}
                            questionCount={questions.data.length}
                        />
                    )}

                    <div className="space-y-12">
                        {questions.data.map((q, index) => {
                            if (
                                viewMode === 'single' &&
                                index !== currentQuestionIndex
                            )
                                return null;
                            return (
                                <div
                                    key={q.id}
                                    data-q-id={q.id}
                                    ref={(el) =>
                                        (questionRefs.current[q.id] = el)
                                    }
                                    onClick={() => setActiveQuestionId(q.id)}
                                >
                                    <QuestionCard
                                        question={q}
                                        index={index}
                                        answer={answers[q.id]}
                                        isActive={
                                            activeQuestionId === q.id ||
                                            viewMode === 'single'
                                        }
                                        isCompleted={isSubmitting}
                                        viewMode={viewMode}
                                        onAnswerChange={updateAnswer}
                                        renderQuestion={(
                                            question,
                                            idx,
                                            ans,
                                            onChange,
                                            disabled,
                                        ) => (
                                            <QuestionRenderer
                                                question={question}
                                                index={idx}
                                                answer={ans}
                                                onAnswerChange={onChange}
                                                disabled={disabled}
                                            />
                                        )}
                                    />
                                    {viewMode === 'single' && (
                                        <SingleViewNavigation
                                            currentIndex={currentQuestionIndex}
                                            totalQuestions={
                                                questions.data.length
                                            }
                                            onPrevious={goToPrev}
                                            onNext={goToNext}
                                            onSubmit={() =>
                                                setShowSubmitModal(true)
                                            }
                                            isFirstQuestion={
                                                currentQuestionIndex === 0
                                            }
                                            isLastQuestion={
                                                currentQuestionIndex ===
                                                questions.data.length - 1
                                            }
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {viewMode === 'scroll' && (
                        <ScrollViewEndSection
                            onReview={() => setShowReviewModal(true)}
                            onSubmit={() => setShowSubmitModal(true)}
                        />
                    )}
                </main>

                {!isFocusMode && (
                    <aside className="sticky top-24 h-[calc(100vh-8rem)] w-64 shrink-0">
                        <NavigationSidebar
                            questions={questions.data}
                            answers={answers}
                            activeQuestionId={activeQuestionId}
                            currentQuestionIndex={currentQuestionIndex}
                            viewMode={viewMode}
                            onNavigate={(id, index) => {
                                setActiveQuestionId(id);
                                if (viewMode === 'single') {
                                    setCurrentQuestionIndex(index);
                                    window.scrollTo({
                                        top: 0,
                                        behavior: 'smooth',
                                    });
                                } else {
                                    questionRefs.current[id]?.scrollIntoView({
                                        behavior: 'smooth',
                                        block: 'center',
                                    });
                                }
                            }}
                            onViewModeChange={setViewMode}
                        />
                    </aside>
                )}
            </div>

            <FloatingTools
                fontSize={fontSize}
                isFocusMode={isFocusMode}
                onFontSizeIncrease={() =>
                    setFontSize((s) => Math.min(s + 2, 24))
                }
                onFontSizeDecrease={() =>
                    setFontSize((s) => Math.max(s - 2, 12))
                }
                onToggleFocusMode={() => setIsFocusMode(!isFocusMode)}
            />

            <SubmitConfirmationDialog
                isOpen={showSubmitModal}
                onOpenChange={setShowSubmitModal}
                stats={stats}
                onConfirm={handleFinalSubmit}
            />

            <ReviewSummaryDialog
                isOpen={showReviewModal}
                onOpenChange={setShowReviewModal}
                questions={questions.data}
                answers={answers}
                onNavigateToQuestion={(id, index) => {
                    setActiveQuestionId(id);
                    if (viewMode === 'single') setCurrentQuestionIndex(index);
                    else
                        questionRefs.current[id]?.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center',
                        });
                    setShowReviewModal(false);
                }}
                onSubmit={() => {
                    setShowReviewModal(false);
                    setShowSubmitModal(true);
                }}
            />
        </div>
    );
}
