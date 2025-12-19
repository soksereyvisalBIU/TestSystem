import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import dayjs from 'dayjs';
import { CheckCircle2, ChevronLeft, Info, Loader2, Save } from 'lucide-react';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { route } from 'ziggy-js';

// ShadCN components
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    const [answersState, setAnswersState] = useState(attempt.answers || []);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const answersByQuestionId = useMemo(() => {
        return answersState.reduce((acc, a) => {
            acc[a.question_id] = acc[a.question_id] || [];
            acc[a.question_id].push(a);
            return acc;
        }, {});
    }, [answersState]);

    const handleTeacherScore = (questionId, score) => {
        setAnswersState((prev) =>
            prev.map((a) =>
                a.question_id === questionId
                    ? { ...a, manual_score: score }
                    : a,
            ),
        );
    };

    const calculateTotals = () => {
        let earned = 0;
        let max = 0;
        assessment.questions.forEach((q) => {
            max += parseFloat(q.point || 0);
            const qAnswers = answersByQuestionId[q.id];
            const manual = qAnswers?.[0]?.manual_score;
            if (manual !== undefined && manual !== null && manual !== '') {
                earned += parseFloat(manual);
            } else {
                earned += calculateAutoScore(q, qAnswers).earnedPoints;
            }
        });
        return { earned, max };
    };

    const { earned: totalEarned, max: totalMax } = calculateTotals();
    const percentage = ((totalEarned / totalMax) * 100).toFixed(1);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        const answersPayload = assessment.questions.map((question) => {
            const questionAnswers = answersState.filter(
                (a) => a.question_id === question.id,
            );
            const manualOverride = questionAnswers[0]?.manual_score;
            let finalScoreToSend =
                manualOverride !== undefined &&
                manualOverride !== null &&
                manualOverride !== ''
                    ? parseFloat(manualOverride)
                    : calculateAutoScore(question, questionAnswers)
                          .earnedPoints;

            return { question_id: question.id, score: finalScoreToSend };
        });

        const payload = {
            student_assessment_attempt_id: attempt?.id,
            answers: answersPayload,
        };

        try {
            await fetch(
                route(
                    'instructor.classes.subjects.assessments.students.store',
                    {
                        class: 1,
                        subject: 1,
                        assessment: assessment.id,
                        student: attempt.student_id,
                    },
                ),
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        'X-CSRF-TOKEN':
                            document
                                .querySelector('meta[name="csrf-token"]')
                                ?.getAttribute('content') || '',
                    },
                    body: JSON.stringify(payload),
                },
            );
            toast.success('Grades synchronized successfully');
        } catch (err) {
            toast.error('Connection error. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Assessments', href: '/assessments' },
                { title: 'Grading' },
            ]}
        >
            <Head title={`Grading: ${attempt.student?.name}`} />

            <div className="min-h-screen bg-slate-50/50 pb-32">
                {/* Modern Hero Header */}
                <div className="border-b bg-white">
                    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
                        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                            <div className="space-y-1">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="-ml-2 h-8 gap-1 text-slate-500 hover:text-slate-900"
                                    onClick={() => window.history.back()}
                                >
                                    <ChevronLeft className="h-4 w-4" /> Back to
                                    List
                                </Button>
                                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                                    {attempt.student?.name || 'Unknown Student'}
                                </h1>
                                <p className="font-medium text-slate-500">
                                    {assessment.title} •{' '}
                                    <span className="font-normal text-slate-400 underline decoration-dotted">
                                        {dayjs(attempt.updated_at).format(
                                            'MMM D, YYYY',
                                        )}
                                    </span>
                                </p>
                            </div>

                            {/* Score Display Card */}
                            <div className="flex items-center gap-4 rounded-2xl bg-slate-900 p-1 pl-6 text-white shadow-xl shadow-slate-200">
                                <div className="py-2">
                                    <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                                        Current Grade
                                    </p>
                                    <p className="text-2xl font-black">
                                        {totalEarned}{' '}
                                        <span className="text-lg text-slate-500">
                                            / {totalMax}
                                        </span>
                                    </p>
                                </div>
                                <div className="min-w-[80px] rounded-xl bg-slate-800 px-4 py-3 text-center">
                                    <p className="text-xs font-bold text-emerald-400">
                                        {percentage}%
                                    </p>
                                    <p className="text-[10px] text-slate-400 uppercase">
                                        Score
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mx-auto mt-8 max-w-5xl px-4 sm:px-6">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                        {/* Sidebar Navigation (Sticky) */}
                        <div className="hidden lg:col-span-3 lg:block">
                            <div className="sticky top-8 space-y-4">
                                <p className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                                    Questions
                                </p>
                                <nav className="flex flex-col gap-1">
                                    {assessment.questions.map((q, i) => {
                                        const hasScore =
                                            answersByQuestionId[q.id]?.[0]
                                                ?.manual_score != null;
                                        return (
                                            <a
                                                key={q.id}
                                                href={`#q-${q.id}`}
                                                className="group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-white hover:shadow-sm"
                                            >
                                                <span className="text-slate-500 group-hover:text-primary">
                                                    Q{i + 1}
                                                </span>
                                                {hasScore ? (
                                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                                ) : (
                                                    <div className="h-2 w-2 rounded-full bg-slate-200" />
                                                )}
                                            </a>
                                        );
                                    })}
                                </nav>
                            </div>
                        </div>

                        {/* Main Questions Area */}
                        <div className="space-y-8 lg:col-span-9">
                            {assessment.questions.map((question, index) => (
                                <section
                                    key={question.id}
                                    id={`#q-${question.id}`}
                                    className="scroll-mt-8"
                                >
                                    <Card className="overflow-hidden border-none shadow-sm ring-1 ring-slate-200 transition-all focus-within:ring-2 focus-within:ring-primary">
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-slate-50 bg-white px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white shadow-sm">
                                                    {index + 1}
                                                </span>
                                                <div>
                                                    <CardTitle className="text-sm font-bold text-slate-700 capitalize">
                                                        {question.type.replace(
                                                            '_',
                                                            ' ',
                                                        )}
                                                    </CardTitle>
                                                </div>
                                            </div>
                                            <Badge
                                                variant="secondary"
                                                className="bg-slate-100 font-bold text-slate-600"
                                            >
                                                Max: {question.point} pts
                                            </Badge>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            <QuestionRenderer
                                                question={question}
                                                answers={
                                                    answersByQuestionId[
                                                        question.id
                                                    ] || []
                                                }
                                                onTeacherScore={
                                                    handleTeacherScore
                                                }
                                            />
                                        </CardContent>
                                    </Card>
                                </section>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Floating Action Footer */}
                <div className="fixed bottom-6 left-1/2 z-50 w-full max-w-2xl -translate-x-1/2 px-4">
                    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white/80 p-3 shadow-2xl backdrop-blur-md">
                        <div className="flex items-center gap-4 pl-4">
                            <div className="hidden sm:block">
                                <p className="text-[10px] font-bold tracking-tighter text-slate-400 uppercase">
                                    Progress
                                </p>
                                <p className="text-sm font-bold text-slate-700">
                                    {totalEarned} pts
                                </p>
                            </div>
                            <Separator orientation="vertical" className="h-8" />
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Info className="h-4 w-4 text-slate-400" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Manual scores override auto-grading.
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                variant="ghost"
                                className="rounded-xl font-semibold text-slate-600"
                                onClick={() => window.history.back()}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="rounded-xl px-8 font-bold shadow-lg shadow-primary/20"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="mr-2 h-4 w-4" />
                                )}
                                Finalize Grades
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
