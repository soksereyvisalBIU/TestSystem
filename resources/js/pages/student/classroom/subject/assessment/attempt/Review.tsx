import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import type { Answer, Question } from '@/types/assessment';
import { Head, Link } from '@inertiajs/react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { ArrowLeft, ArrowRight, CheckCircle, Clock, HelpCircle, XCircle, Trophy } from 'lucide-react';
import { useMemo } from 'react';

dayjs.extend(duration);

// ====================
//   Types & Status Helper
// ====================

interface DetailedQuestion extends Question {
    options?: any;
    correct_answer_text?: string; 
    explanation?: string;
}

const getQuestionStatus = (question: DetailedQuestion, answers: Answer[]) => {
    const max = Number(question.point);

    if (!answers.length) {
        return {
            status: 'Skipped',
            badgeVariant: 'secondary' as const,
            icon: <HelpCircle className="h-5 w-5 text-slate-400" />,
            pointsDisplay: `0 / ${max}`,
            bgClass: 'bg-slate-50 dark:bg-slate-900/50',
            borderClass: 'border-slate-200 dark:border-slate-800',
            textClass: 'text-slate-600 dark:text-slate-400',
            accentBorder: 'border-l-slate-400'
        };
    }

    if (['short_answer', 'essay'].includes(question.type)) {
        const graded = answers.some((a) => a.points_earned !== null);
        if (!graded) {
            return {
                status: 'Pending Grading',
                badgeVariant: 'outline' as const,
                icon: <Clock className="h-5 w-5 text-amber-500" />,
                pointsDisplay: `- / ${max}`,
                bgClass: 'bg-amber-50/50 dark:bg-amber-900/10',
                borderClass: 'border-amber-200 dark:border-amber-900/30',
                textClass: 'text-amber-700 dark:text-amber-400',
                accentBorder: 'border-l-amber-400'
            };
        }
    }

    const earned = Number(answers[0]?.points_earned ?? 0);

    if (earned === max) {
        return {
            status: 'Correct',
            badgeVariant: 'default' as const,
            icon: <CheckCircle className="h-5 w-5 text-emerald-500" />,
            pointsDisplay: `${earned} / ${max}`,
            bgClass: 'bg-emerald-50/50 dark:bg-emerald-900/10',
            borderClass: 'border-emerald-200 dark:border-emerald-900/30',
            textClass: 'text-emerald-700 dark:text-emerald-400',
            accentBorder: 'border-l-emerald-500'
        };
    }

    if (earned > 0) {
        return {
            status: 'Partial',
            badgeVariant: 'secondary' as const,
            icon: <CheckCircle className="h-5 w-5 text-orange-500" />,
            pointsDisplay: `${earned} / ${max}`,
            bgClass: 'bg-orange-50/50 dark:bg-orange-900/10',
            borderClass: 'border-orange-200 dark:border-orange-900/30',
            textClass: 'text-orange-700 dark:text-orange-400',
            accentBorder: 'border-l-orange-400'
        };
    }

    return {
        status: 'Incorrect',
        badgeVariant: 'destructive' as const,
        icon: <XCircle className="h-5 w-5 text-red-500" />,
        pointsDisplay: `${earned} / ${max}`,
        bgClass: 'bg-red-50/50 dark:bg-red-900/10',
        borderClass: 'border-red-200 dark:border-red-900/30',
        textClass: 'text-red-700 dark:text-red-400',
        accentBorder: 'border-l-red-500'
    };
};

export default function AttemptReview({ assessmentAttemptResource }: { assessmentAttemptResource: any }) {
    const { assessment, answers, started_at, completed_at, sub_score } = assessmentAttemptResource.data;

    const groupedAnswers = useMemo(() => {
        const map: Record<number, Answer[]> = {};
        answers.forEach((a: Answer) => {
            if (!map[a.question_id]) map[a.question_id] = [];
            map[a.question_id].push(a);
        });
        return map;
    }, [answers]);

    const formattedTime = useMemo(() => {
        if (!completed_at || !started_at) return 'N/A';
        const diff = dayjs(completed_at).diff(dayjs(started_at));
        const dur = dayjs.duration(diff);
        const mins = Math.floor(dur.asMinutes());
        const secs = dur.seconds();
        return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
    }, [started_at, completed_at]);

    const maxScore = assessment.questions.reduce((sum: number, q: DetailedQuestion) => sum + (Number(q.point) || 0), 0);
    const rawPercentage = maxScore > 0 ? (Number(sub_score) / maxScore) * 100 : 0;
    const scoreColor = rawPercentage >= 80 ? 'text-emerald-600' : rawPercentage >= 50 ? 'text-amber-600' : 'text-red-600';

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: dashboard().url }, { title: 'Review', href: '#' }]}>
            <Head title={`Review: ${assessment.title}`} />

            <div className="mx-auto max-w-4xl space-y-8 p-6 md:p-10">
                
                {/* 1. Summary Card */}
                <Card className="overflow-hidden border-none shadow-xl ring-1 ring-slate-200 dark:ring-slate-800">
                    <div className="bg-indigo-600 px-6 py-2 text-center text-[10px] font-black uppercase tracking-[0.2em] text-white">
                        Official Result
                    </div>
                    <CardHeader className="bg-slate-50/50 pb-8 text-center dark:bg-slate-900/20">
                        <CardTitle className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                            {assessment.title}
                        </CardTitle>
                        <p className="mx-auto mt-2 max-w-xl text-sm font-medium text-slate-500">
                            {assessment.description || 'Review your performance and correct answers below.'}
                        </p>
                    </CardHeader>

                    <CardContent className="grid grid-cols-2 divide-x divide-slate-100 border-t border-slate-100 p-0 dark:divide-slate-800 dark:border-slate-800 md:grid-cols-4">
                        <SummaryStat label="Score" value={`${sub_score ?? 0}`} subValue={`/ ${maxScore}`} color={scoreColor} />
                        <SummaryStat label="Percentage" value={`${rawPercentage.toFixed(1)}%`} color={scoreColor} />
                        <SummaryStat label="Time Taken" value={formattedTime} />
                        <SummaryStat label="Date" value={dayjs(completed_at).format('MMM D')} subValue={dayjs(completed_at).format('h:mm A')} />
                    </CardContent>
                </Card>

                {/* 2. Question Navigation Helper */}
                <div className="flex flex-wrap gap-2 rounded-xl bg-slate-100 p-3 dark:bg-slate-900">
                    {assessment.questions.map((q: any, i: number) => {
                        const status = getQuestionStatus(q, groupedAnswers[q.id] || []);
                        return (
                            <a 
                                key={q.id} 
                                href={`#q-${q.id}`}
                                className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold transition-all hover:scale-110 ${status.bgClass} ${status.textClass} border ${status.borderClass}`}
                            >
                                {i + 1}
                            </a>
                        );
                    })}
                </div>

                {/* 3. Questions List */}
                <div className="space-y-6">
                    {assessment.questions.map((question: DetailedQuestion, index: number) => {
                        const qAnswers = groupedAnswers[question.id] || [];
                        const status = getQuestionStatus(question, qAnswers);
                        
                        return (
                            <Card
                                id={`q-${question.id}`}
                                key={question.id}
                                className={`group overflow-hidden border-none transition-all shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 ${status.accentBorder} border-l-4`}
                            >
                                <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-black text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <CardTitle className="text-lg font-bold leading-snug text-slate-900 dark:text-slate-100">
                                            {question.question_text ?? question.question}
                                        </CardTitle>
                                        <div className="flex items-center gap-3">
                                            <Badge variant={status.badgeVariant} className="px-2 py-0 uppercase text-[10px] font-black tracking-wider">
                                                {status.status}
                                            </Badge>
                                            <span className="text-xs font-bold text-slate-400">
                                                {status.pointsDisplay} PTS
                                            </span>
                                        </div>
                                    </div>
                                    <div className="shrink-0">{status.icon}</div>
                                </CardHeader>

                                <CardContent className="pl-14 pr-6 pb-6 pt-0">
                                    <div className="space-y-4">
                                        {/* Your Answer */}
                                        <div className="space-y-2">
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Your Submission</h4>
                                            <div className={`rounded-xl border p-4 text-sm font-medium ${status.bgClass} ${status.borderClass} ${status.textClass}`}>
                                                {question.type === 'matching' ? (
                                                    <div className="grid gap-2">
                                                        {qAnswers.map((a, idx) => (
                                                            <div key={idx} className="flex items-center gap-2">
                                                                <span className="opacity-60">{a.option_id}</span>
                                                                <ArrowRight className="h-3 w-3 opacity-30" />
                                                                <span>{a.answer_text}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    qAnswers[0]?.answer_text || <span className="italic opacity-50">No answer provided</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Feedback Section */}
                                        {(status.status !== 'Correct' && question.correct_answer_text) && (
                                            <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-4 dark:border-emerald-900/30 dark:bg-emerald-900/10">
                                                <h4 className="mb-1 text-[10px] font-black uppercase tracking-widest text-emerald-600">Correct Answer</h4>
                                                <p className="text-sm font-bold text-emerald-900 dark:text-emerald-100">{question.correct_answer_text}</p>
                                            </div>
                                        )}

                                        {question.explanation && (
                                            <div className="flex gap-3 rounded-xl bg-indigo-50/50 p-4 text-sm text-indigo-900 dark:bg-indigo-900/10 dark:text-indigo-200">
                                                <HelpCircle className="h-5 w-5 shrink-0 text-indigo-400" />
                                                <div>
                                                    <span className="font-black uppercase text-[10px] tracking-wider block mb-1">Explanation</span>
                                                    {question.explanation}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <div className="flex justify-center pt-8">
                    <Link href={dashboard().url}>
                        <Button variant="outline" className="h-12 px-8 font-bold rounded-xl shadow-sm hover:bg-slate-50 transition-all active:scale-95">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Dashboard
                        </Button>
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}

function SummaryStat({ label, value, subValue, color }: { label: string; value: string; subValue?: string; color?: string }) {
    return (
        <div className="p-6 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400">{label}</p>
            <div className={`mt-2 text-2xl font-black tracking-tight ${color || 'text-slate-900 dark:text-white'}`}>
                {value} {subValue && <span className="text-sm font-bold text-slate-400">{subValue}</span>}
            </div>
        </div>
    );
}