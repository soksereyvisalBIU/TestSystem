import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
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
import { ScrollArea } from '@/components/ui/scroll-area';
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
    student,
    classId, // Retained in case you need them for dynamic routing later
    subjectId,
}) {

    console.log(attempt);
    
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
                    ['fill_blank', 'short_answer', 'fileupload'].includes(q.type) &&
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
            const hasManual = manual !== undefined && manual !== null && manual !== '';

            if (hasManual) {
                earned += parseFloat(manual);
                gradedCount++;
            } else {
                const auto = calculateAutoScore(q, qAnswers);
                earned += auto.earnedPoints;
                if (q.type !== 'essay') gradedCount++;
            }
        });

        const totalQuestions = assessment.questions.length;
        return {
            earned: earned.toFixed(1),
            max,
            progress: totalQuestions === 0 ? 0 : (gradedCount / totalQuestions) * 100,
            isComplete: gradedCount === totalQuestions && totalQuestions > 0,
        };
    }, [assessment.questions, answersByQuestionId]);

    // --- HANDLERS ---
    const handleTeacherScore = useCallback((questionId, score) => {
        setAnswersState((prev) =>
            prev.map((a) =>
                a.question_id === questionId ? { ...a, manual_score: score } : a
            )
        );
    }, []);

    const handleSubmit = useCallback(() => {
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
                class: 1, // Consider using classId if dynamic
                subject: 1, // Consider using subjectId if dynamic
                assessment: assessment.id,
                student: attempt.student_id,
            }),
            {
                student_assessment_attempt_id: attempt?.id,
                answers: answersPayload,
            },
            {
                onSuccess: () => toast.success('Grades updated successfully.'),
                onError: () => toast.error('Failed to update grades.'),
                onFinish: () => setIsSubmitting(false),
            }
        );
    }, [assessment.id, assessment.questions, answersByQuestionId, attempt?.id, attempt?.student_id]);

    return (
        <AppLayout>
            <Head title={`Grading: ${student?.name || 'Student'}`} />

            <div className="min-h-screen bg-slate-50/50 dark:bg-background pb-32">
                <div className="mx-auto mt-8 max-w-7xl px-4 sm:px-6">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 relative items-start">
                        
                        {/* MAIN CONTENT AREA */}
                        <main className="lg:col-span-8 xl:col-span-9">
                            {visibleQuestions.length === 0 ? (
                                <Card className="flex flex-col items-center justify-center border-dashed py-24 text-center animate-in fade-in duration-500">
                                    <div className="mb-4 rounded-full bg-green-100 p-4 dark:bg-green-900/30">
                                        <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-title">
                                        Review Complete
                                    </h3>
                                    <p className="mt-2 text-muted-foreground">
                                        There are no questions matching your current filter.
                                    </p>
                                    <Button
                                        variant="link"
                                        onClick={() => setFilterMode('all')}
                                        className="mt-2"
                                    >
                                        Show all questions
                                    </Button>
                                </Card>
                            ) : (
                                <ScrollArea className="h-[calc(100vh-10rem)] pr-3">
                                    {viewMode === 'list' ? (
                                        visibleQuestions.map((question) => (
                                            <div
                                                key={question.id}
                                                id={`q-${question.id}`}
                                                className="scroll-mt-28 my-6"
                                            >
                                                <QuestionRenderer
                                                    question={question}
                                                    index={question.originalIndex}
                                                    answers={answersByQuestionId.get(question.id) || []}
                                                    onTeacherScore={handleTeacherScore}
                                                />
                                            </div>
                                        ))
                                    ) : (
                                        <div className="animate-in duration-300 fade-in slide-in-from-bottom-4">
                                            <QuestionRenderer
                                                question={visibleQuestions[currentIndex]}
                                                index={visibleQuestions[currentIndex].originalIndex}
                                                answers={answersByQuestionId.get(visibleQuestions[currentIndex].id) || []}
                                                onTeacherScore={handleTeacherScore}
                                            />
                                            <div className="mt-8 flex items-center justify-between rounded-2xl border bg-card p-4 shadow-sm">
                                                <Button
                                                    variant="outline"
                                                    disabled={currentIndex === 0}
                                                    onClick={() => setCurrentIndex((prev) => prev - 1)}
                                                >
                                                    <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                                                </Button>
                                                <span className="text-sm font-medium text-muted-foreground">
                                                    Question {currentIndex + 1} of {visibleQuestions.length}
                                                </span>
                                                <Button
                                                    variant="outline"
                                                    disabled={currentIndex === visibleQuestions.length - 1}
                                                    onClick={() => setCurrentIndex((prev) => prev + 1)}
                                                >
                                                    Next <ArrowRight className="ml-2 h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </ScrollArea>
                            )}
                        </main>

                        {/* STICKY SIDEBAR NAVIGATION */}
                        <aside className="sticky top-8 lg:col-span-4 xl:col-span-3">
                            <Card className="overflow-hidden border-none shadow-lg ring-1 ring-slate-200 dark:ring-border gap-0 pt-0">
                                {/* Header: Context & Progress */}
                                <div className="border-b bg-slate-50 p-5 pb-2 dark:bg-card">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="mb-4 -ml-2 h-8 text-muted-foreground hover:text-foreground"
                                        asChild
                                    >
                                        <Link
                                            href={route('instructor.classes.subjects.assessments.students.index', {
                                                class: 1, // Consider dynamic if needed
                                                subject: 1, // Consider dynamic if needed
                                                assessment: assessment.id,
                                            })}
                                        >
                                            <ChevronLeft className="mr-1 h-4 w-4" />
                                            Back to Students
                                        </Link>
                                    </Button>

                                    <div className="mb-6">
                                        <h2 className="text-xl font-bold line-clamp-1" title={student?.name}>
                                            {student?.name}
                                        </h2>
                                        <p className="text-sm text-muted-foreground truncate" title={student?.email}>
                                            {student?.email}
                                        </p>
                                    </div>

                                    {/* <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-bold text-title">
                                                Grading Progress
                                            </h4>
                                            <Badge
                                                variant={stats.isComplete ? 'success' : 'secondary'}
                                                className="font-mono transition-colors"
                                            >
                                                {Math.round(stats.progress)}%
                                            </Badge>
                                        </div>
                                        <Progress
                                            value={stats.progress}
                                            className="h-2 bg-slate-200 dark:bg-muted"
                                        />
                                    </div> */}
                                </div>

                                <ScrollArea className="max-h-[calc(100vh-22rem)] p-5">
                                    <div className="space-y-6">
                                        {/* View & Filter Toggles */}
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                Display Options
                                            </label>
                                            <div className="grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-1 dark:bg-muted">
                                                <button
                                                    onClick={() => setViewMode('list')}
                                                    className={`flex items-center justify-center gap-2 rounded-md py-1.5 text-xs font-semibold transition-all ${
                                                        viewMode === 'list'
                                                            ? 'bg-white text-primary shadow-sm dark:bg-card'
                                                            : 'text-slate-500 hover:text-slate-700 dark:text-muted-foreground dark:hover:text-foreground'
                                                    }`}
                                                >
                                                    <LayoutList className="h-3.5 w-3.5" /> List
                                                </button>
                                                <button
                                                    onClick={() => setViewMode('single')}
                                                    className={`flex items-center justify-center gap-2 rounded-md py-1.5 text-xs font-semibold transition-all ${
                                                        viewMode === 'single'
                                                            ? 'bg-white text-primary shadow-sm dark:bg-card'
                                                            : 'text-slate-500 hover:text-slate-700 dark:text-muted-foreground dark:hover:text-foreground'
                                                    }`}
                                                >
                                                    <Eye className="h-3.5 w-3.5" /> Focus
                                                </button>
                                            </div>

                                            <Button
                                                variant={filterMode === 'needs_review' ? 'secondary' : 'outline'}
                                                size="sm"
                                                className={`w-full justify-start text-xs transition-colors ${
                                                    filterMode === 'needs_review' ? 'ring-1 ring-amber-500/20 dark:ring-amber-400/30' : ''
                                                }`}
                                                onClick={() => setFilterMode(filterMode === 'needs_review' ? 'all' : 'needs_review')}
                                            >
                                                <Filter className={`mr-2 h-3.5 w-3.5 ${filterMode === 'needs_review' ? 'text-amber-600 dark:text-amber-400' : ''}`} />
                                                {filterMode === 'needs_review' ? 'Showing Needs Review' : 'Filter: Needs Review'}
                                            </Button>
                                        </div>

                                        {/* Question Grid Map */}
                                        <div className="space-y-3 px-1">
                                            <label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                Question Map
                                            </label>
                                            <TooltipProvider delayDuration={200}>
                                                <div className="grid grid-cols-5 gap-1.5">
                                                    {assessment.questions.map((q, i) => {
                                                        const qAnswers = answersByQuestionId.get(q.id) || [];
                                                        const isManual = qAnswers[0]?.manual_score != null;
                                                        const needReviewQuestion = ['fill_blank', 'short_answer', 'fileupload'].includes(q.type);
                                                        const isActive = viewMode === 'list' ? false : visibleQuestions[currentIndex]?.id === q.id;

                                                        return (
                                                            <Tooltip key={q.id}>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        onClick={() => {
                                                                            if (viewMode === 'single') {
                                                                                const idx = visibleQuestions.findIndex((vq) => vq.id === q.id);
                                                                                if (idx !== -1) setCurrentIndex(idx);
                                                                            } else {
                                                                                document.getElementById(`q-${q.id}`)?.scrollIntoView({ behavior: 'smooth' });
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
                                                                        {i + 1}
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent side="top">
                                                                    <p className="text-xs">
                                                                        {needReviewQuestion ? 'Requires Manual Grade' : 'Auto-graded'}
                                                                    </p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        );
                                                    })}
                                                </div>
                                            </TooltipProvider>
                                        </div>

                                        {/* Legend */}
                                        {/* <div className="space-y-2 border-t pt-4 dark:border-border">
                                            <LegendItem color="bg-primary" label="Manually Graded" />
                                            <LegendItem color="bg-amber-400 dark:bg-amber-500" label="Pending Review" />
                                            <LegendItem color="bg-slate-200 dark:bg-muted" label="Auto-scored" />
                                        </div> */}

                                                                        {/* Footer: Totals & Action */}
                                <div className="border-t bg-slate-50/50 p-5 dark:bg-card/30">
                                    <div className="mb-4 flex items-end justify-between">
                                        <div>
                                            <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                Score Summary
                                            </p>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-3xl font-black text-primary">
                                                    {stats.earned}
                                                </span>
                                                <span className="text-sm font-bold text-muted-foreground">
                                                    / {stats.max} pts
                                                </span>
                                            </div>
                                        </div>
                                        {/* <div className="text-right">
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase">
                                                Weighted
                                            </p>
                                            <p className="text-sm font-black text-foreground">
                                                {(
                                                    (stats.earned / stats.max) *
                                                    100
                                                ).toFixed(1)}
                                                %
                                            </p>
                                        </div> */}
                                    </div>

                                    {
                                        (attempt.status !== "scored" && attempt.sub_score !== stats.earned) ? (
                                            <Badge variant="warning" className="mb-4 font-bold">
                                                Unsaved Changes
                                            </Badge>
                                        ) : (
                                            <Badge variant="success" className="mb-4 font-bold">
                                                All Changes Saved
                                            </Badge>
                                        )
                                    }

                                    <Button
                                        size="lg"
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        className={`w-full rounded-xl font-bold shadow-lg transition-all active:scale-[0.98] ${
                                            stats.isComplete
                                                ? 'bg-primary shadow-primary/20 hover:bg-primary/90'
                                                : 'bg-slate-900 hover:bg-slate-800 dark:bg-slate-700'
                                        }`}
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
                                </ScrollArea>
                                
                            </Card>
                        </aside>
                    </div>
                </div>

                {/* FLOATING ACTION FOOTER */}
                {/* <div className="fixed bottom-6 left-0 right-0 z-50 mx-auto w-full max-w-4xl px-4 animate-in slide-in-from-bottom-6">
                    <div className="flex items-center justify-between rounded-2xl border bg-background/95 p-4 shadow-2xl backdrop-blur-md dark:border-border dark:bg-card/95">
                        <div className="flex items-center gap-6 md:gap-8 pl-4">
                            <div>
                                <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                    Current Total
                                </p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl md:text-3xl font-black text-primary transition-all">
                                        {stats.earned}
                                    </span>
                                    <span className="text-sm font-medium text-muted-foreground">
                                        / {stats.max} pts
                                    </span>
                                </div>
                            </div>

                            <Separator orientation="vertical" className="h-10 hidden sm:block" />

                            <div className="hidden sm:block">
                                {stats.isComplete ? (
                                    <Badge className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 py-1">
                                        <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> 
                                        Ready to Finalize
                                    </Badge>
                                ) : (
                                    <div className="flex items-center gap-2 text-sm font-semibold text-amber-600 dark:text-amber-400">
                                        <AlertCircle className="h-4 w-4" /> 
                                        Pending Review
                                    </div>
                                )}
                            </div>
                        </div>

                        <Button
                            size="lg"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className={`rounded-xl px-8 md:px-10 font-bold transition-all ${
                                stats.isComplete 
                                ? 'bg-primary hover:bg-primary/90 shadow-md shadow-primary/20' 
                                : 'bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600'
                            }`}
                        >
                            {isSubmitting ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Save className="mr-2 h-4 w-4" />
                            )}
                            Update Grade
                        </Button>
                    </div>
                </div> */}
            </div>
        </AppLayout>
    );
}

function LegendItem({ color, label }: { color: string; label: string }) {
    return (
        <div className="flex items-center gap-2 text-[10px] font-bold tracking-tight text-muted-foreground/80 uppercase">
            <div className={`h-2.5 w-2.5 rounded-full ${color}`} />
            <span>{label}</span>
        </div>
    );
}