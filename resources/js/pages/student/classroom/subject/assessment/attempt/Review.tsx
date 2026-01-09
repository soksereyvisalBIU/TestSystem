import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { Answer, Question } from '@/types/assessment';
import { Head, Link } from '@inertiajs/react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import {
    ArrowLeft,
    CheckCircle2,
    Clock,
    HelpCircle,
    Info,
    LayoutDashboard,
    Trophy,
    XCircle,
} from 'lucide-react';
import { useMemo } from 'react';

dayjs.extend(duration);

interface DetailedQuestion extends Question {
    options?: any;
    correct_answer_text?: string;
    explanation?: string;
}

const getStatusConfig = (question: DetailedQuestion, answers: Answer[]) => {
    const max = Number(question.point);
    const earned = Number(answers[0]?.points_earned ?? 0);
    
    if (!answers.length) return {
        label: 'Skipped',
        variant: 'secondary',
        icon: HelpCircle,
        colorClass: 'text-slate-500',
        borderClass: 'border-l-slate-400',
        bgClass: 'bg-slate-50/50 dark:bg-slate-900/40'
    };

    if (['short_answer', 'essay'].includes(question.type) && answers.some(a => a.points_earned === null)) {
        return {
            label: 'Pending',
            variant: 'outline',
            icon: Clock,
            colorClass: 'text-amber-500',
            borderClass: 'border-l-amber-400',
            bgClass: 'bg-amber-50/30 dark:bg-amber-900/10'
        };
    }

    if (earned === max) return {
        label: 'Correct',
        variant: 'default',
        icon: CheckCircle2,
        colorClass: 'text-emerald-500',
        borderClass: 'border-l-emerald-500',
        bgClass: 'bg-emerald-50/30 dark:bg-emerald-900/10'
    };

    if (earned > 0) return {
        label: 'Partial',
        variant: 'secondary',
        icon: CheckCircle2,
        colorClass: 'text-orange-500',
        borderClass: 'border-l-orange-400',
        bgClass: 'bg-orange-50/30 dark:bg-orange-900/10'
    };

    return {
        label: 'Incorrect',
        variant: 'destructive',
        icon: XCircle,
        colorClass: 'text-red-500',
        borderClass: 'border-l-red-500',
        bgClass: 'bg-red-50/30 dark:bg-red-900/10'
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

    const stats = useMemo(() => {
        const maxScore = assessment.questions.reduce((sum: number, q: any) => sum + (Number(q.point) || 0), 0);
        const percentage = maxScore > 0 ? (Number(sub_score) / maxScore) * 100 : 0;
        const diff = completed_at && started_at ? dayjs(completed_at).diff(dayjs(started_at)) : 0;
        const dur = dayjs.duration(diff);
        
        return {
            maxScore,
            percentage,
            time: `${Math.floor(dur.asMinutes())}m ${dur.seconds()}s`,
            color: percentage >= 80 ? 'emerald' : percentage >= 50 ? 'amber' : 'red'
        };
    }, [assessment, sub_score, started_at, completed_at]);

    return (
        <AppLayout breadcrumbs={[{ title: 'Assessments', href: '#' }, { title: 'Review' }]}>
            <Head title={`Review | ${assessment.title}`} />

            <div className="mx-auto max-w-6xl p-4 lg:p-10">
                {/* Header Section */}
                <header className="mb-10 flex flex-col items-center justify-between gap-6 md:flex-row">
                    <div>
                        <Link href={dashboard().url} className="group flex items-center text-sm font-medium text-slate-500 transition-colors hover:text-indigo-600">
                            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                            Back to Dashboard
                        </Link>
                        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-white md:text-4xl">
                            {assessment.title}
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Final Score</p>
                            <p className={`text-3xl font-black text-${stats.color}-600`}>
                                {sub_score} <span className="text-lg text-slate-400">/ {stats.maxScore}</span>
                            </p>
                        </div>
                        <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-${stats.color}-50 dark:bg-${stats.color}-900/20`}>
                            <Trophy className={`h-8 w-8 text-${stats.color}-600`} />
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    {/* Sidebar Navigation - Sticky */}
                    <aside className="lg:col-span-3">
                        <div className="sticky top-24 space-y-6">
                            <Card className="overflow-hidden border-none shadow-sm ring-1 ring-slate-200 dark:ring-slate-800">
                                <CardHeader className="p-4">
                                    <CardTitle className="text-sm font-bold">Question Navigator</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 pt-0">
                                    <div className="grid grid-cols-5 gap-2">
                                        {assessment.questions.map((q: any, i: number) => {
                                            const cfg = getStatusConfig(q, groupedAnswers[q.id] || []);
                                            return (
                                                <a
                                                    key={q.id}
                                                    href={`#q-${q.id}`}
                                                    className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold ring-offset-2 transition-all hover:ring-2 ${cfg.bgClass} ${cfg.colorClass} border border-slate-200 dark:border-slate-800`}
                                                >
                                                    {i + 1}
                                                </a>
                                            );
                                        })}
                                    </div>
                                    <div className="mt-6 space-y-3">
                                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                            <div className="h-2 w-2 rounded-full bg-emerald-500" /> Correct
                                            <div className="ml-auto font-bold text-slate-900 dark:text-slate-100">
                                                {Object.values(groupedAnswers).filter(ans => ans[0]?.points_earned === assessment.questions.find((q:any) => q.id === ans[0].question_id)?.point).length}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                            <div className="h-2 w-2 rounded-full bg-red-500" /> Incorrect
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            
                            <Card className="bg-indigo-600 p-4 text-white shadow-lg shadow-indigo-200 dark:shadow-none">
                                <div className="flex items-center gap-3">
                                    <Clock className="h-5 w-5 opacity-80" />
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Duration</p>
                                        <p className="font-bold">{stats.time}</p>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </aside>

                    {/* Main Questions List */}
                    <main className="lg:col-span-9">
                        <div className="space-y-8">
                            {assessment.questions.map((question: DetailedQuestion, index: number) => {
                                const qAnswers = groupedAnswers[question.id] || [];
                                const cfg = getStatusConfig(question, qAnswers);
                                const StatusIcon = cfg.icon;

                                return (
                                    <section key={question.id} id={`q-${question.id}`} className="scroll-mt-24">
                                        <Card className={`overflow-hidden border-none shadow-md ring-1 ring-slate-200 transition-all dark:ring-slate-800 border-l-4 ${cfg.borderClass}`}>
                                            <CardHeader className="flex flex-row items-start justify-between bg-slate-50/50 p-6 dark:bg-slate-900/40">
                                                <div className="flex gap-4">
                                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-sm font-black text-slate-900 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:text-white dark:ring-slate-700">
                                                        {index + 1}
                                                    </span>
                                                    <div className="space-y-1">
                                                        <div 
                                                            className="prose prose-slate dark:prose-invert max-w-none font-semibold leading-tight text-slate-900 dark:text-slate-100"
                                                            dangerouslySetInnerHTML={{ __html: question.question_text || question.question }}
                                                        />
                                                        <div className="flex items-center gap-3 pt-2">
                                                            <Badge variant={cfg.variant as any} className="rounded-md px-2 py-0 text-[10px] font-black uppercase tracking-tighter">
                                                                {cfg.label}
                                                            </Badge>
                                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                                Worth {question.point} Points
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <StatusIcon className={`h-6 w-6 shrink-0 ${cfg.colorClass}`} />
                                            </CardHeader>

                                            <CardContent className="p-6 space-y-6">
                                                {/* Answer Comparison Grid */}
                                                <div className="grid gap-4 md:grid-cols-2">
                                                    {/* User Answer */}
                                                    <div className="space-y-3">
                                                        <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                            Your Response
                                                        </h4>
                                                        <div className={`rounded-xl border p-4 text-sm font-medium ${cfg.bgClass} ${cfg.colorClass} border-dashed`}>
                                                            {qAnswers[0]?.answer_text ? (
                                                                <div dangerouslySetInnerHTML={{ __html: qAnswers[0].answer_text }} />
                                                            ) : (
                                                                <span className="italic opacity-60">No response provided</span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Correct Answer */}
                                                    {cfg.label !== 'Correct' && question.correct_answer_text && (
                                                        <div className="space-y-3">
                                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-500">
                                                                Expected Answer
                                                            </h4>
                                                            <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 text-sm font-bold text-emerald-800 dark:border-emerald-900/30 dark:bg-emerald-900/20 dark:text-emerald-200">
                                                                {question.correct_answer_text}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Explanation Box */}
                                                {question.explanation && (
                                                    <div className="flex gap-4 rounded-2xl bg-indigo-50/50 p-5 dark:bg-indigo-900/10">
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm dark:bg-slate-800">
                                                            <Info className="h-5 w-5 text-indigo-500" />
                                                        </div>
                                                        <div>
                                                            <h5 className="mb-1 text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                                                                Explanation
                                                            </h5>
                                                            <p className="text-sm leading-relaxed text-slate-600 dark:text-indigo-200/80">
                                                                {question.explanation}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </section>
                                );
                            })}
                        </div>

                        {/* Footer Action */}
                        <footer className="mt-12 flex items-center justify-center border-t border-slate-100 py-10 dark:border-slate-800">
                            <Link href={dashboard().url}>
                                <Button size="lg" className="rounded-2xl bg-slate-900 px-10 font-bold hover:bg-slate-800 dark:bg-white dark:text-slate-900">
                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                    Return to Dashboard
                                </Button>
                            </Link>
                        </footer>
                    </main>
                </div>
            </div>
        </AppLayout>
    );
}