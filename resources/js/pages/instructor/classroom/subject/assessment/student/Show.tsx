import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    ChevronLeft,
    Eye,
    Filter,
    LayoutList,
    Loader2,
    Save,
} from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { route } from 'ziggy-js';

// ShadCN components
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

import { QuestionRenderer } from './component/questions/QuestionRenderer';
import { calculateAutoScore } from './component/questions/calculateAutoScore';

export default function StudentAssessmentAttemptScoring({
    assessment,
    attempt,
}) {
    const [answersState, setAnswersState] = useState(attempt?.answers || []);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [viewMode, setViewMode] = useState('list'); // 'list' | 'single'
    const [filterMode, setFilterMode] = useState('all'); // 'all' | 'needs_review'
    const [currentIndex, setCurrentIndex] = useState(0);

    // --- DATA MAPPING ---
    const answersByQuestionId = useMemo(() => {
        const map = new Map();
        answersState.forEach((a) => {
            if (!map.has(a.question_id)) map.set(a.question_id, []);
            map.get(a.question_id).push(a);
        });
        return map;
    }, [answersState]);

    const visibleQuestions = useMemo(() => {
        let qs = assessment.questions.map((q, index) => ({
            ...q,
            originalIndex: index,
        }));

        if (filterMode === 'needs_review') {
            qs = qs.filter((q) => {
                const qAnswers = answersByQuestionId.get(q.id) || [];
                const manual = qAnswers[0]?.manual_score;
                const hasManual =
                    manual !== undefined && manual !== null && manual !== '';

                return (
                    (q.type === 'fill_blank' ||
                        q.type === 'short_answer' ||
                        q.type === 'fileupload') &&
                    !hasManual
                );
            });
        }
        return qs;
    }, [assessment.questions, filterMode, answersByQuestionId]);

    // --- STATS ---
    const stats = useMemo(() => {
        let earned = 0;
        let max = 0;
        let gradedCount = 0;

        assessment.questions.forEach((q) => {
            const qMax = parseFloat(q.point || 0);
            max += qMax;
            const qAnswers = answersByQuestionId.get(q.id) || [];
            const manual = qAnswers[0]?.manual_score;
            const hasManual =
                manual !== undefined && manual !== null && manual !== '';

            if (hasManual) {
                earned += parseFloat(manual);
                gradedCount++;
            } else {
                const auto = calculateAutoScore(q, qAnswers);
                earned += auto.earnedPoints;
                if (q.type !== 'essay') gradedCount++;
            }
        });

        return {
            earned: earned.toFixed(1),
            max,
            progress: (gradedCount / assessment.questions.length) * 100,
            isComplete: gradedCount === assessment.questions.length,
        };
    }, [assessment.questions, answersByQuestionId]);

    const handleTeacherScore = useCallback((questionId, score) => {
        setAnswersState((prev) =>
            prev.map((a) =>
                a.question_id === questionId
                    ? { ...a, manual_score: score }
                    : a,
            ),
        );
    }, []);

    const handleSubmit = () => {
        setIsSubmitting(true);
        const answersPayload = assessment.questions.map((q) => {
            const qAnswers = answersByQuestionId.get(q.id) || [];
            const manual = qAnswers[0]?.manual_score;
            const score =
                manual !== undefined && manual !== null && manual !== ''
                    ? parseFloat(manual)
                    : calculateAutoScore(q, qAnswers).earnedPoints;
            return { question_id: q.id, score };
        });

        router.post(
            route('instructor.classes.subjects.assessments.students.store', {
                class: 1,
                subject: 1,
                assessment: assessment.id,
                student: attempt.student_id,
            }),
            {
                student_assessment_attempt_id: attempt?.id,
                answers: answersPayload,
            },
            {
                onSuccess: () => toast.success('Grades updated'),
                onFinish: () => setIsSubmitting(false),
            },
        );
    };

    return (
        <AppLayout>
            <Head title={`Grading: ${attempt?.student?.name}`} />

            <div className="relative max-h-[90vh] bg-slate-50/50 dark:bg-background">
                <div className="relative mx-auto mt-8 max-w-7xl px-4 sm:px-6">
                    <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-12">
                        {/* MAIN CONTENT AREA */}
                        <div className="pb-36 lg:col-span-8 xl:col-span-9">
                            {visibleQuestions.length === 0 ? (
                                <Card className="flex flex-col items-center justify-center border-dashed py-24 text-center">
                                    <div className="mb-4 rounded-full bg-green-100 p-4 dark:bg-green-900/30">
                                        <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-title">
                                        Review Complete
                                    </h3>
                                    <p className="mt-2 text-muted-foreground">
                                        No questions matching your current
                                        filter.
                                    </p>
                                    <Button
                                        variant="link"
                                        onClick={() => setFilterMode('all')}
                                    >
                                        Show all questions
                                    </Button>
                                </Card>
                            ) : (
                                <div className="space-y-8">
                                    {viewMode === 'list' ? (
                                        visibleQuestions.map((question) => (
                                            <div
                                                key={question.id}
                                                id={`q-${question.id}`}
                                                className="scroll-mt-24"
                                            >
                                                <QuestionRenderer
                                                    question={question}
                                                    index={
                                                        question.originalIndex
                                                    }
                                                    answers={
                                                        answersByQuestionId.get(
                                                            question.id,
                                                        ) || []
                                                    }
                                                    onTeacherScore={
                                                        handleTeacherScore
                                                    }
                                                />
                                            </div>
                                        ))
                                    ) : (
                                        <div className="animate-in duration-300 fade-in slide-in-from-bottom-4">
                                            <QuestionRenderer
                                                question={
                                                    visibleQuestions[
                                                        currentIndex
                                                    ]
                                                }
                                                index={
                                                    visibleQuestions[
                                                        currentIndex
                                                    ].originalIndex
                                                }
                                                answers={
                                                    answersByQuestionId.get(
                                                        visibleQuestions[
                                                            currentIndex
                                                        ].id,
                                                    ) || []
                                                }
                                                onTeacherScore={
                                                    handleTeacherScore
                                                }
                                            />
                                            <div className="mt-8 flex items-center justify-between rounded-2xl border bg-card p-4 shadow-sm">
                                                <Button
                                                    variant="outline"
                                                    disabled={
                                                        currentIndex === 0
                                                    }
                                                    onClick={() =>
                                                        setCurrentIndex(
                                                            (prev) => prev - 1,
                                                        )
                                                    }
                                                >
                                                    <ArrowLeft className="mr-2 h-4 w-4" />{' '}
                                                    Previous
                                                </Button>
                                                <span className="text-sm font-medium text-muted-foreground">
                                                    Question {currentIndex + 1}{' '}
                                                    of {visibleQuestions.length}
                                                </span>
                                                <Button
                                                    variant="outline"
                                                    disabled={
                                                        currentIndex ===
                                                        visibleQuestions.length -
                                                            1
                                                    }
                                                    onClick={() =>
                                                        setCurrentIndex(
                                                            (prev) => prev + 1,
                                                        )
                                                    }
                                                >
                                                    Next{' '}
                                                    <ArrowRight className="ml-2 h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* STICKY SIDEBAR NAVIGATION */}
                        <aside className="relative lg:col-span-4 xl:col-span-3">
                            <div className="sticky top-0 self-start">
                                <Card className="gap-0 overflow-hidden border-none py-0 shadow-lg ring-1 ring-slate-200 dark:ring-border">
                                    {/* Header: Context & Progress */}
                                    <div className="border-b bg-slate-50 p-4 dark:bg-card">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="mb-2 -ml-2 h-8 text-muted-foreground hover:text-foreground"
                                            onClick={() =>
                                                router.get(
                                                    route(
                                                        'instructor.classes.subjects.assessments.students.index',
                                                        {
                                                            class: 1,
                                                            subject: 1,
                                                            assessment:
                                                                assessment.id,
                                                        },
                                                    ),
                                                )
                                            }
                                        >
                                            <ChevronLeft className="mr-1 h-4 w-4" />{' '}
                                            Back to Students
                                        </Button>

                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-sm font-bold text-title">
                                                    Grading Progress
                                                </h4>
                                                <Badge
                                                    variant={
                                                        stats.isComplete
                                                            ? 'success'
                                                            : 'secondary'
                                                    }
                                                    className="font-mono"
                                                >
                                                    {Math.round(stats.progress)}
                                                    %
                                                </Badge>
                                            </div>
                                            <Progress
                                                value={stats.progress}
                                                className="h-2 bg-slate-200 dark:bg-muted"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-6 p-4">
                                        {/* View & Filter Toggles */}
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                Display Options
                                            </label>
                                            <div className="grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-1 dark:bg-muted">
                                                <button
                                                    onClick={() =>
                                                        setViewMode('list')
                                                    }
                                                    className={`flex items-center justify-center gap-2 rounded-md py-1.5 text-xs font-semibold transition-all ${viewMode === 'list' ? 'bg-white text-primary shadow-sm dark:bg-card' : 'text-slate-500 hover:text-slate-700 dark:text-muted-foreground dark:hover:text-foreground'}`}
                                                >
                                                    <LayoutList className="h-3.5 w-3.5" />{' '}
                                                    List
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        setViewMode('single')
                                                    }
                                                    className={`flex items-center justify-center gap-2 rounded-md py-1.5 text-xs font-semibold transition-all ${viewMode === 'single' ? 'bg-white text-primary shadow-sm dark:bg-card' : 'text-slate-500 hover:text-slate-700 dark:text-muted-foreground dark:hover:text-foreground'}`}
                                                >
                                                    <Eye className="h-3.5 w-3.5" />{' '}
                                                    Focus
                                                </button>
                                            </div>

                                            <Button
                                                variant={
                                                    filterMode ===
                                                    'needs_review'
                                                        ? 'secondary'
                                                        : 'outline'
                                                }
                                                size="sm"
                                                className={`w-full justify-start text-xs ${filterMode === 'needs_review' ? 'ring-1 ring-amber-500/20 dark:ring-amber-400/30' : ''}`}
                                                onClick={() =>
                                                    setFilterMode(
                                                        filterMode ===
                                                            'needs_review'
                                                            ? 'all'
                                                            : 'needs_review',
                                                    )
                                                }
                                            >
                                                <Filter
                                                    className={`mr-2 h-3.5 w-3.5 ${filterMode === 'needs_review' ? 'text-amber-600 dark:text-amber-400' : ''}`}
                                                />
                                                {filterMode === 'needs_review'
                                                    ? 'Showing Needs Review'
                                                    : 'Filter: Needs Review'}
                                            </Button>
                                        </div>

                                        {/* Question Grid */}
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                Question Map
                                            </label>
                                            <div className="grid grid-cols-5 gap-1.5">
                                                {assessment.questions.map(
                                                    (q, i) => {
                                                        const qAnswers =
                                                            answersByQuestionId.get(
                                                                q.id,
                                                            ) || [];
                                                        const isManual =
                                                            qAnswers[0]
                                                                ?.manual_score !=
                                                            null;
                                                        const needReviewQuestion =
                                                            q.type ===
                                                                'fill_blank' ||
                                                            q.type ===
                                                                'short_answer' ||
                                                            q.type ===
                                                                'fileupload';
                                                        const isActive =
                                                            viewMode === 'list'
                                                                ? false
                                                                : visibleQuestions[
                                                                      currentIndex
                                                                  ]?.id ===
                                                                  q.id;

                                                        return (
                                                            <TooltipProvider
                                                                key={q.id}
                                                            >
                                                                <Tooltip>
                                                                    <TooltipTrigger
                                                                        asChild
                                                                    >
                                                                        <button
                                                                            onClick={() => {
                                                                                if (
                                                                                    viewMode ===
                                                                                    'single'
                                                                                ) {
                                                                                    const idx =
                                                                                        visibleQuestions.findIndex(
                                                                                            (
                                                                                                vq,
                                                                                            ) =>
                                                                                                vq.id ===
                                                                                                q.id,
                                                                                        );
                                                                                    if (
                                                                                        idx !==
                                                                                        -1
                                                                                    )
                                                                                        setCurrentIndex(
                                                                                            idx,
                                                                                        );
                                                                                } else {
                                                                                    document
                                                                                        .getElementById(
                                                                                            `q-${q.id}`,
                                                                                        )
                                                                                        ?.scrollIntoView(
                                                                                            {
                                                                                                behavior:
                                                                                                    'smooth',
                                                                                            },
                                                                                        );
                                                                                }
                                                                            }}
                                                                            className={`flex aspect-square w-full items-center justify-center rounded-md border text-[11px] font-bold transition-all ${
                                                                                isActive
                                                                                    ? 'border-primary bg-primary/10 text-primary ring-2 ring-primary ring-offset-1 dark:ring-offset-background'
                                                                                    : isManual
                                                                                      ? 'border-primary bg-primary text-primary-foreground'
                                                                                      : needReviewQuestion
                                                                                        ? 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400 dark:hover:bg-amber-900'
                                                                                        : 'border-slate-200 bg-white text-slate-400 hover:border-slate-300 dark:border-border dark:bg-card dark:text-muted-foreground dark:hover:border-slate-600'
                                                                            }`}
                                                                        >
                                                                            {i +
                                                                                1}
                                                                        </button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent side="top">
                                                                        <p className="text-xs">
                                                                            {needReviewQuestion
                                                                                ? 'Requires Manual Grade'
                                                                                : 'Auto-graded'}
                                                                        </p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        );
                                                    },
                                                )}
                                            </div>
                                        </div>

                                        {/* Legend */}
                                        <div className="space-y-2 border-t pt-4 dark:border-border">
                                            <LegendItem
                                                color="bg-primary"
                                                label="Manually Graded"
                                            />
                                            <LegendItem
                                                color="bg-amber-400 dark:bg-amber-500"
                                                label="Pending Review"
                                            />
                                            <LegendItem
                                                color="bg-slate-200 dark:bg-muted"
                                                label="Auto-scored"
                                            />
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </aside>
                    </div>
                </div>

                {/* FLOATING ACTION FOOTER */}
                <div className="fixed bottom-8 left-1/2 z-50 w-full max-w-4xl -translate-x-1/2 px-4">
                    <div className="flex items-center justify-between rounded-2xl border bg-background/90 p-4 shadow-2xl backdrop-blur-lg dark:border-border dark:bg-card/90">
                        <div className="flex items-center gap-8 pl-4">
                            <div>
                                <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                    Current Total
                                </p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-black text-primary">
                                        {stats.earned}
                                    </span>
                                    <span className="text-sm font-medium text-muted-foreground">
                                        / {stats.max} pts
                                    </span>
                                </div>
                            </div>

                            <Separator
                                orientation="vertical"
                                className="h-10"
                            />

                            <div className="hidden md:block">
                                {stats.isComplete ? (
                                    <Badge className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700">
                                        <CheckCircle2 className="mr-1 h-3 w-3" />{' '}
                                        Ready to Finalize
                                    </Badge>
                                ) : (
                                    <div className="flex items-center gap-2 text-sm font-semibold text-amber-600 dark:text-amber-400">
                                        <AlertCircle className="h-4 w-4" />{' '}
                                        Pending Review
                                    </div>
                                )}
                            </div>
                        </div>

                        <Button
                            size="lg"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className={`rounded-xl px-10 font-bold transition-all ${stats.isComplete ? 'bg-primary hover:bg-primary/90' : 'bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600'}`}
                        >
                            {isSubmitting ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Save className="mr-2 h-4 w-4" />
                            )}
                            Update Grade
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function LegendItem({ color, label }) {
    return (
        <div className="flex items-center gap-2 text-[10px] font-bold tracking-tight text-muted-foreground/80 uppercase">
            <div className={`h-2.5 w-2.5 rounded-full ${color}`} />
            <span>{label}</span>
        </div>
    );
}
