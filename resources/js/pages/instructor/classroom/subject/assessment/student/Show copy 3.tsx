import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import dayjs from 'dayjs';
import {
    CheckCircle2,
    ChevronLeft,
    Loader2,
    MousePointer2,
    Zap,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import { cn } from '@/lib/utils';

import { QuestionRenderer } from './component/questions/QuestionRenderer';
import { calculateAutoScore } from './component/questions/calculateAutoScore';

export default function StudentAssessmentAttemptScoring({
    assessment,
    attempt,
}) {
    const [answersState, setAnswersState] = useState(attempt.answers || []);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);

    // 1. Group answers by question ID so the loop can find them easily
    const answersByQuestionId = useMemo(() => {
        return answersState.reduce((acc, a) => {
            acc[a.question_id] = acc[a.question_id] || [];
            acc[a.question_id].push(a);
            return acc;
        }, {});
    }, [answersState]);

    // 1. ADVANCED ANALYTICS ENGINE
    const stats = useMemo(() => {
        let earned = 0;
        let max = 0;
        let autoCorrectCount = 0;
        let manualOverrideCount = 0;

        const details = assessment.questions.map((q) => {
            const qAnswers = answersState.filter((a) => a.question_id === q.id);
            const manual = qAnswers?.[0]?.manual_score;
            const auto = calculateAutoScore(q, qAnswers);
            const qMax = parseFloat(q.point || 0);

            let qEarned =
                manual !== undefined && manual !== null && manual !== ''
                    ? parseFloat(manual)
                    : (qAnswers?.[0]?.point_earned ?? auto.earnedPoints);

            earned += qEarned;
            max += qMax;

            if (manual != null) manualOverrideCount++;
            if (auto.status === 'correct' && manual == null) autoCorrectCount++;

            return {
                id: q.id,
                earned: qEarned,
                max: qMax,
                isManual: manual != null,
                status: auto.status,
            };
        });

        return {
            totalEarned: earned,
            totalMax: max,
            autoCorrectCount,
            manualOverrideCount,
            details,
        };
    }, [assessment.questions, answersState]);

    const percentage =
        stats.totalMax > 0
            ? ((stats.totalEarned / stats.totalMax) * 100).toFixed(1)
            : 0;

    const handleTeacherScore = (questionId, score) => {
        setAnswersState((prev) =>
            prev.map((a) =>
                a.question_id === questionId
                    ? { ...a, manual_score: score }
                    : a,
            ),
        );
        // Visual feedback that change is pending
        setLastSaved('pending');
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        // (Payload logic from previous response remains the same...)
        try {
            await new Promise((res) => setTimeout(res, 800)); // Mock API
            toast.success('All grades finalized');
            setLastSaved(new Date());
        } catch (err) {
            toast.error('Sync failed');
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

            <div className="min-h-screen bg-[#FBFBFE] pb-40">
                {/* --- 2. THE COMMAND CENTER (HEADER) --- */}
                <header className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur-xl">
                    <div className="mx-auto max-w-[1400px] px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-5">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="group h-10 w-10 rounded-xl bg-slate-50 hover:bg-slate-100"
                                    onClick={() => window.history.back()}
                                >
                                    <ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                                </Button>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h1 className="text-xl font-black tracking-tight text-slate-900">
                                            {attempt.student?.name}
                                        </h1>
                                        <Badge
                                            variant="outline"
                                            className="h-5 px-1.5 text-[9px] font-black tracking-widest text-slate-400 uppercase"
                                        >
                                            Student ID: {attempt.student_id}
                                        </Badge>
                                    </div>
                                    <p className="flex items-center gap-2 text-xs font-bold tracking-tight text-slate-500 uppercase">
                                        {assessment.title}
                                        <span className="h-1 w-1 rounded-full bg-slate-300" />
                                        <Zap className="h-3 w-3 fill-amber-500 text-amber-500" />
                                        Live Grading Session
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-8">
                                {/* Auto-Correct Analytics */}
                                <div className="hidden gap-10 border-r border-slate-100 pr-10 xl:flex">
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">
                                            Auto-Points
                                        </p>
                                        <p className="text-sm font-black text-slate-700">
                                            {stats.autoCorrectCount} Items
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">
                                            Manual Adjust
                                        </p>
                                        <p className="text-sm font-black text-indigo-600">
                                            {stats.manualOverrideCount} Items
                                        </p>
                                    </div>
                                </div>

                                {/* Grade Progress Circle/Bar Preview */}
                                <div className="flex items-center gap-5 rounded-[22px] bg-slate-950 p-1.5 pl-6 text-white shadow-2xl shadow-slate-200">
                                    <div>
                                        <p className="text-[9px] font-black tracking-[0.2em] text-slate-500 uppercase">
                                            Current Score
                                        </p>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-2xl font-black text-white">
                                                {stats.totalEarned}
                                            </span>
                                            <span className="text-xs font-bold text-slate-500">
                                                / {stats.totalMax}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex h-12 w-20 flex-col items-center justify-center rounded-[18px] bg-emerald-500">
                                        <span className="text-sm leading-none font-black">
                                            {percentage}%
                                        </span>
                                        <span className="mt-0.5 text-[8px] font-bold tracking-tighter uppercase opacity-80">
                                            Grade
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="mx-auto mt-10 max-w-[1400px] px-6">
                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
                        {/* --- 3. THE INTERACTIVE SIDEBAR --- */}
                        <aside className="hidden lg:col-span-3 lg:block">
                            <div className="sticky top-28 space-y-6">
                                <Card className="overflow-hidden rounded-[24px] border-none shadow-[0_4px_20px_rgba(0,0,0,0.03)] ring-1 ring-slate-200/60">
                                    <div className="p-5">
                                        <div className="mb-5 flex items-center justify-between">
                                            <h3 className="text-[11px] font-black tracking-widest text-slate-400 uppercase">
                                                Assessment Navigator
                                            </h3>
                                            {lastSaved === 'pending' && (
                                                <span className="flex h-2 w-2 animate-ping rounded-full bg-indigo-500" />
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            {stats.details.map((item, i) => (
                                                <a
                                                    key={item.id}
                                                    href={`#q-${item.id}`}
                                                    className={cn(
                                                        'group flex items-center justify-between rounded-xl p-3 transition-all',
                                                        item.isManual
                                                            ? 'bg-indigo-50/80 ring-1 ring-indigo-200'
                                                            : 'border border-transparent bg-white hover:border-slate-200 hover:bg-slate-50',
                                                    )}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className={cn(
                                                                'flex h-6 w-6 items-center justify-center rounded-lg text-[10px] font-black',
                                                                item.isManual
                                                                    ? 'bg-indigo-600 text-white'
                                                                    : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200',
                                                            )}
                                                        >
                                                            {i + 1}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-[11px] font-bold text-slate-700">
                                                                Question
                                                            </span>
                                                            {item.isManual && (
                                                                <span className="text-[8px] leading-none font-black text-indigo-400 uppercase">
                                                                    Edited
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <span
                                                            className={cn(
                                                                'text-xs font-black',
                                                                item.earned ===
                                                                    item.max
                                                                    ? 'text-emerald-500'
                                                                    : item.earned >
                                                                        0
                                                                      ? 'text-amber-500'
                                                                      : 'text-slate-300',
                                                            )}
                                                        >
                                                            {item.earned}
                                                            <span className="text-[9px] opacity-40">
                                                                /{item.max}
                                                            </span>
                                                        </span>
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="border-t border-slate-100 bg-slate-50 px-5 py-4">
                                        <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase">
                                            <span>Session Sync</span>
                                            <span>
                                                {lastSaved instanceof Date
                                                    ? dayjs(lastSaved).format(
                                                          'HH:mm:ss',
                                                      )
                                                    : 'Ready'}
                                            </span>
                                        </div>
                                    </div>
                                </Card>

                                {/* Keyboard Shortcut Hint */}
                                <div className="rounded-2xl border border-dashed border-slate-200 p-4">
                                    <div className="mb-2 flex items-center gap-2">
                                        <MousePointer2 className="h-3 w-3 text-slate-400" />
                                        <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                                            Pro Tips
                                        </span>
                                    </div>
                                    <p className="text-[10px] leading-relaxed text-slate-500">
                                        Use{' '}
                                        <kbd className="rounded border bg-white px-1 py-0.5 text-[9px] font-bold">
                                            MAX
                                        </kbd>{' '}
                                        buttons for full-credit speed grading.
                                        Manual overrides are saved as drafts
                                        until final sync.
                                    </p>
                                </div>
                            </div>
                        </aside>

                        {/* --- 4. THE MAIN FEED --- */}
                        <main className="space-y-12 lg:col-span-9">
                            {assessment.questions.map((question, index) => (
                                <section
                                    key={question.id}
                                    id={`q-${question.id}`}
                                    className="scroll-mt-32"
                                >
                                    <Card className="group relative overflow-hidden rounded-[32px] border-none shadow-[0_10px_40px_rgba(0,0,0,0.02)] ring-1 ring-slate-200/70 transition-all hover:ring-slate-300">
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-slate-50/50 bg-white px-10 py-6">
                                            <div className="flex items-center gap-5">
                                                <div className="relative">
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-base font-black text-white shadow-xl shadow-slate-200">
                                                        {index + 1}
                                                    </div>
                                                    <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                                                </div>
                                                <div>
                                                    <CardTitle className="text-xs font-black tracking-[0.15em] text-slate-400 uppercase">
                                                        Question Category:{' '}
                                                        {question.type.replace(
                                                            '_',
                                                            ' ',
                                                        )}
                                                    </CardTitle>
                                                    <h4 className="mt-0.5 text-sm font-bold text-slate-800">
                                                        Learning Objective
                                                        Reference
                                                    </h4>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Badge
                                                    variant="outline"
                                                    className="h-7 border-slate-200 px-3 text-[10px] font-black text-slate-500"
                                                >
                                                    WEIGHT: {question.point} PTS
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-10">
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

                {/* --- 5. THE FLOATING MULTI-ACTION BAR --- */}
                <div className="fixed bottom-10 left-1/2 z-[60] w-full max-w-4xl -translate-x-1/2 px-6">
                    <div className="flex items-center justify-between rounded-[32px] border border-white/20 bg-slate-950/95 p-4 pl-10 shadow-[0_30px_100px_rgba(0,0,0,0.4)] ring-1 ring-white/10 backdrop-blur-2xl">
                        <div className="flex items-center gap-10">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
                                    Live Aggregate
                                </span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-black text-white">
                                        {stats.totalEarned}
                                    </span>
                                    <span className="text-xs font-bold text-slate-500">
                                        / {stats.totalMax}
                                    </span>
                                </div>
                            </div>
                            <Separator
                                orientation="vertical"
                                className="h-10 bg-slate-800"
                            />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
                                    Total Adjusted
                                </span>
                                <span className="text-lg font-black text-indigo-400">
                                    {stats.manualOverrideCount}{' '}
                                    <span className="text-[10px] text-slate-600">
                                        Items
                                    </span>
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                className="h-14 rounded-2xl px-8 font-black text-slate-400 transition-colors hover:bg-slate-900 hover:text-white"
                                onClick={() => window.history.back()}
                            >
                                Discard Session
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="h-14 rounded-[22px] bg-white px-12 text-sm font-black text-slate-950 shadow-xl transition-all hover:bg-emerald-400 hover:text-slate-950 active:scale-95"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                ) : (
                                    <CheckCircle2 className="mr-2 h-5 w-5" />
                                )}
                                SYNC & FINALIZE GRADE
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
