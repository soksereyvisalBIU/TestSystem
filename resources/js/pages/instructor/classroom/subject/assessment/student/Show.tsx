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
    classId,
    subjectId,
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
            earned: Math.round(earned * 10) / 10, // Keep as a number for accurate comparison
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
                class: classId,
                subject: subjectId,
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
    }, [assessment.id, assessment.questions, answersByQuestionId, attempt?.id, attempt?.student_id, classId, subjectId]);

    // Check if there are unsaved changes
    const hasUnsavedChanges = attempt?.status !== "scored" || attempt?.sub_score !== stats.earned;

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
                            <Card className="flex flex-col overflow-hidden border-none shadow-lg ring-1 ring-slate-200 dark:ring-border gap-0 pt-0">
                                
                                {/* Header: Context */}
                                <div className="border-b bg-slate-50 p-5 pb-4 dark:bg-card shrink-0">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="mb-4 -ml-2 h-8 text-muted-foreground hover:text-foreground"
                                        asChild
                                    >
                                        <Link
                                            href={route('instructor.classes.subjects.assessments.students.index', {
                                                class: classId,
                                                subject: subjectId,
                                                assessment: assessment.id,
                                            })}
                                        >
                                            <ChevronLeft className="mr-1 h-4 w-4" />
                                            Back to Students
                                        </Link>
                                    </Button>

                                    <div>
                                        <h2 className="text-xl font-bold line-clamp-1" title={student?.name}>
                                            {student?.name}
                                        </h2>
                                        <p className="text-sm text-muted-foreground truncate" title={student?.email}>
                                            {student?.email}
                                        </p>
                                    </div>
                                </div>

                                {/* Scrollable Middle Section */}
                                <ScrollArea className="flex-1 p-5">
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
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            if (viewMode === 'single') {
                                                                                const idx = visibleQuestions.findIndex((vq) => vq.id === q.id);
                                                                                if (idx !== -1) setCurrentIndex(idx);
                                                                            } else {
                                                                                document.getElementById(`q-${q.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
                                                                    </button>
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
                                    </div>
                                </ScrollArea>

                                {/* Footer: Totals & Action */}
                                <div className="border-t bg-slate-50/50 p-5 dark:bg-card/30 shrink-0">
                                    <div className="mb-4 flex items-end justify-between">
                                        <div>
                                            <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                Score Summary
                                            </p>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-3xl font-black text-primary">
                                                    {stats.earned.toFixed(1)}
                                                </span>
                                                <span className="text-sm font-bold text-muted-foreground">
                                                    / {stats.max} pts
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {hasUnsavedChanges ? (
                                        <Badge variant="outline" className="mb-4 font-bold border-amber-500 text-amber-600 bg-amber-50 dark:bg-amber-950/50 dark:text-amber-400">
                                            <AlertCircle className="w-3 h-3 mr-1" /> Unsaved Changes
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="mb-4 font-bold border-green-500 text-green-600 bg-green-50 dark:bg-green-950/50 dark:text-green-400">
                                            <CheckCircle2 className="w-3 h-3 mr-1" /> All Changes Saved
                                        </Badge>
                                    )}

                                    <Button
                                        size="lg"
                                        onClick={handleSubmit}
                                        disabled={isSubmitting || !hasUnsavedChanges}
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
                            </Card>
                        </aside>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}