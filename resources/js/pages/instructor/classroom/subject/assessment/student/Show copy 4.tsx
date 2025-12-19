import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import dayjs from 'dayjs';
import { ChevronLeft, History, Loader2, Save } from 'lucide-react';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

import { QuestionRenderer } from './component/questions/QuestionRenderer';
import { calculateAutoScore } from './component/questions/calculateAutoScore';

import { cn } from '@/lib/utils';

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

    // Calculate detailed stats for the UI
    const stats = useMemo(() => {
        let earned = 0;
        let max = 0;
        let gradedCount = 0;

        const details = assessment.questions.map((q) => {
            const qAnswers = answersByQuestionId[q.id];
            const manual = qAnswers?.[0]?.manual_score;
            const auto = calculateAutoScore(q, qAnswers);
            const qMax = parseFloat(q.point || 0);

            let qEarned =
                manual !== undefined && manual !== null && manual !== ''
                    ? parseFloat(manual)
                    : (qAnswers?.[0]?.point_earned ?? auto.earnedPoints);

            earned += qEarned;
            max += qMax;
            if (
                qAnswers?.[0]?.manual_score != null ||
                qAnswers?.[0]?.point_earned != null
            )
                gradedCount++;

            return {
                id: q.id,
                earned: qEarned,
                max: qMax,
                isManual: manual != null,
            };
        });

        return { totalEarned: earned, totalMax: max, gradedCount, details };
    }, [assessment.questions, answersByQuestionId]);

    const percentage =
        stats.totalMax > 0
            ? ((stats.totalEarned / stats.totalMax) * 100).toFixed(1)
            : 0;

    const handleSubmit = async () => {
        setIsSubmitting(true);
        const answersPayload = assessment.questions.map((question) => {
            const qAnswers = answersByQuestionId[question.id];
            const manualOverride = qAnswers[0]?.manual_score;
            const finalScore =
                manualOverride !== undefined &&
                manualOverride !== null &&
                manualOverride !== ''
                    ? parseFloat(manualOverride)
                    : (qAnswers[0]?.point_earned ??
                      calculateAutoScore(question, qAnswers).earnedPoints);

            return { question_id: question.id, score: finalScore };
        });

        try {
            // Replace with your actual Inertia or Fetch call
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Mocking API
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

            <div className="min-h-screen bg-[#f8fafc] pb-40">
                {/* 1. Header Section */}
                <div className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-md">
                    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-9 w-9 rounded-full"
                                    onClick={() => window.history.back()}
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </Button>
                                <div>
                                    <h1 className="text-xl font-black tracking-tight text-slate-900">
                                        {attempt.student?.name}
                                    </h1>
                                    <p className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                                        {assessment.title} •{' '}
                                        {dayjs(attempt.updated_at).format(
                                            'MMM D',
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="hidden text-right md:block">
                                    <p className="text-[10px] font-black tracking-tighter text-slate-400 uppercase">
                                        Completion
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold">
                                            {stats.gradedCount}/
                                            {assessment.questions.length}
                                        </span>
                                        <Progress
                                            value={
                                                (stats.gradedCount /
                                                    assessment.questions
                                                        .length) *
                                                100
                                            }
                                            className="h-1.5 w-20"
                                        />
                                    </div>
                                </div>
                                <div className="flex h-12 items-center gap-4 rounded-2xl bg-slate-900 px-6 py-2 text-white shadow-2xl shadow-slate-200">
                                    <div className="border-r border-slate-700 pr-4">
                                        <span className="mb-1 block text-[10px] leading-none font-bold text-slate-500 uppercase">
                                            Grade
                                        </span>
                                        <span className="text-xl font-black">
                                            {stats.totalEarned}
                                            <span className="ml-1 text-sm text-slate-500">
                                                /{stats.totalMax}
                                            </span>
                                        </span>
                                    </div>
                                    <div className="text-center">
                                        <span className="text-lg font-black text-emerald-400">
                                            {percentage}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mx-auto mt-8 max-w-7xl px-4 sm:px-6">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                        {/* 2. Enhanced Sidebar Scoreboard */}
                        <aside className="sticky top-24  hidden lg:col-span-3 lg:block">
                            <div className="sticky top-28 space-y-6">
                                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                    <div className="mb-4 flex items-center justify-between">
                                        <h3 className="text-xs font-black tracking-widest text-slate-400 uppercase">
                                            Question Map
                                        </h3>
                                        <Badge
                                            variant="outline"
                                            className="text-[10px]"
                                        >
                                            {assessment.questions.length} Total
                                        </Badge>
                                    </div>
                                    <div className="grid grid-cols-1 gap-2">
                                        {stats.details.map((item, i) => (
                                            <a
                                                key={item.id}
                                                href={`#q-${item.id}`}
                                                className={cn(
                                                    'group flex items-center justify-between rounded-xl px-3 py-2.5 transition-all hover:scale-[1.02]',
                                                    item.isManual
                                                        ? 'bg-indigo-50 ring-1 ring-indigo-200 ring-inset'
                                                        : 'bg-slate-50 hover:bg-white hover:shadow-md',
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span
                                                        className={cn(
                                                            'text-[10px] font-black',
                                                            item.isManual
                                                                ? 'text-indigo-600'
                                                                : 'text-slate-400',
                                                        )}
                                                    >
                                                        {i + 1}
                                                    </span>
                                                    <span className="text-xs font-bold text-slate-700">
                                                        Question
                                                    </span>
                                                </div>
                                                <span
                                                    className={cn(
                                                        'text-xs font-black',
                                                        item.earned === item.max
                                                            ? 'text-emerald-600'
                                                            : item.earned > 0
                                                              ? 'text-amber-600'
                                                              : 'text-slate-400',
                                                    )}
                                                >
                                                    {item.earned}/{item.max}
                                                </span>
                                            </a>
                                        ))}
                                    </div>
                                </div>

                                <div className="rounded-2xl bg-indigo-600 p-5 text-white shadow-xl shadow-indigo-200">
                                    <div className="mb-2 flex items-center gap-2 text-indigo-200">
                                        <History className="h-4 w-4" />
                                        <span className="text-[10px] font-bold tracking-widest uppercase">
                                            Grading Note
                                        </span>
                                    </div>
                                    <p className="text-xs leading-relaxed opacity-90">
                                        Auto-grading handles objective
                                        questions. Manual overrides are
                                        highlighted in{' '}
                                        <span className="font-bold underline">
                                            blue
                                        </span>
                                        .
                                    </p>
                                </div>
                            </div>
                        </aside>

                        {/* 3. Main Content Feed */}
                        <main className="space-y-10 lg:col-span-9">
                            {assessment.questions.map((question, index) => (
                                <section
                                    key={question.id}
                                    id={`q-${question.id}`}
                                    className="scroll-mt-28"
                                >
                                    <Card className="overflow-hidden border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-200 transition-all focus-within:ring-2 focus-within:ring-indigo-500">
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-slate-50 bg-white px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-sm font-black text-white shadow-lg">
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <CardTitle className="text-sm font-black tracking-tight text-slate-800 uppercase">
                                                        {question.type.replace(
                                                            '_',
                                                            ' ',
                                                        )}
                                                    </CardTitle>
                                                    <p className="text-[10px] font-bold tracking-tighter text-slate-400 uppercase">
                                                        Section Point:{' '}
                                                        {question.point}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {answersByQuestionId[
                                                    question.id
                                                ]?.[0]?.manual_score !=
                                                    null && (
                                                    <Badge className="border-none bg-indigo-100 text-indigo-700 hover:bg-indigo-100">
                                                        Modified
                                                    </Badge>
                                                )}
                                                <Badge
                                                    variant="outline"
                                                    className="border-slate-200 text-[10px] font-black text-slate-400 uppercase"
                                                >
                                                    Reference #{question.id}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-8">
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
                        </main>
                    </div>
                </div>

                {/* 4. Floating Interaction Bar */}
                <div className="fixed bottom-8 left-1/2 z-50 w-full max-w-3xl -translate-x-1/2 px-4">
                    <div className="flex items-center justify-between rounded-3xl border border-white/20 bg-slate-900/90 p-3 shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-xl">
                        <div className="flex items-center gap-6 pl-6 text-white">
                            <div>
                                <p className="text-[10px] font-black tracking-tighter text-slate-500 uppercase">
                                    Session Grade
                                </p>
                                <p className="text-lg leading-none font-black">
                                    {stats.totalEarned}{' '}
                                    <span className="text-xs text-slate-500">
                                        / {stats.totalMax}
                                    </span>
                                </p>
                            </div>
                            <Separator
                                orientation="vertical"
                                className="h-10 bg-slate-700"
                            />
                            <div className="hidden sm:block">
                                <p className="text-[10px] font-black tracking-tighter text-slate-500 uppercase">
                                    Final Percent
                                </p>
                                <p className="text-lg leading-none font-black text-emerald-400">
                                    {percentage}%
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                variant="ghost"
                                className="rounded-2xl font-bold text-slate-400 hover:bg-slate-800 hover:text-white"
                                onClick={() => window.history.back()}
                            >
                                Discard
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="rounded-2xl bg-indigo-500 px-10 font-black shadow-xl shadow-indigo-500/20 transition-all hover:bg-indigo-400 active:scale-95"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="mr-2 h-4 w-4" />
                                )}
                                Finalize All Grades
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
