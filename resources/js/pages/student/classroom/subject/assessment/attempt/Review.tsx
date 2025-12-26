import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button'; // Assuming you have this
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator'; // Optional, for visual break
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import type { Answer, Attempt, Question } from '@/types/assessment';
import { Head, Link } from '@inertiajs/react';

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

import {
    ArrowLeft,
    ArrowRight,
    CheckCircle,
    Clock,
    HelpCircle,
    XCircle,
} from 'lucide-react';
import { useMemo } from 'react';

// ====================
//   Types
// ====================

interface DetailedQuestion extends Question {
    options?: any;
    // Add this if your API returns the correct answer for review
    correct_answer_text?: string; 
    explanation?: string;
}

// ... (Other types remain the same)

// ====================
//   Breadcrumbs
// ====================
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Review Attempt', href: '#' },
];

// ====================
//   Status Helper & Styles
// ====================

const getQuestionStatus = (question: DetailedQuestion, answers: Answer[]) => {
    // 1. Not Answered
    if (!answers.length) {
        return {
            status: 'Skipped',
            badgeVariant: 'secondary' as const,
            icon: <HelpCircle className="h-5 w-5 text-gray-400" />,
            pointsDisplay: `0 / ${question.point}`,
            colorClass: 'gray',
            borderColor: 'border-l-gray-300',
            bgClass: 'bg-gray-50',
            textClass: 'text-gray-600',
        };
    }

    // 2. Pending Grading (Essay/Short Answer)
    if (['short_answer', 'essay'].includes(question.type)) {
        const graded = answers.some((a) => a.points_earned !== null);
        if (!graded) {
            return {
                status: 'Pending Grading',
                badgeVariant: 'secondary' as const, // Changed to secondary for neutrality
                icon: <Clock className="h-5 w-5 text-amber-500" />,
                pointsDisplay: `- / ${question.point}`,
                colorClass: 'amber',
                borderColor: 'border-l-amber-400',
                bgClass: 'bg-amber-50',
                textClass: 'text-amber-800',
            };
        }
    }

    const earned = Number(answers[0]?.points_earned ?? 0);
    const max = Number(question.point);

    // 3. Correct
    if (earned === max) {
        return {
            status: 'Correct',
            badgeVariant: 'default' as const, // usually black/dark in shadcn
            icon: <CheckCircle className="h-5 w-5 text-green-600" />,
            pointsDisplay: `${earned} / ${max}`,
            colorClass: 'green',
            borderColor: 'border-l-green-500',
            bgClass: 'bg-green-50',
            textClass: 'text-green-900',
        };
    }

    // 4. Partial
    if (earned > 0) {
        return {
            status: 'Partial',
            badgeVariant: 'secondary' as const,
            icon: <CheckCircle className="h-5 w-5 text-yellow-500" />,
            pointsDisplay: `${earned} / ${max}`,
            colorClass: 'yellow',
            borderColor: 'border-l-yellow-500',
            bgClass: 'bg-yellow-50',
            textClass: 'text-yellow-900',
        };
    }

    // 5. Incorrect
    return {
        status: 'Incorrect',
        badgeVariant: 'destructive' as const,
        icon: <XCircle className="h-5 w-5 text-red-500" />,
        pointsDisplay: `${earned} / ${max}`,
        colorClass: 'red',
        borderColor: 'border-l-red-500',
        bgClass: 'bg-red-50',
        textClass: 'text-red-900',
    };
};

// ====================
//   Main Component
// ====================

export default function AttemptReview({ assessmentAttemptResource }: { assessmentAttemptResource: any }) {
    const { assessment, answers, started_at, completed_at, sub_score } = assessmentAttemptResource.data;

    // Group answers
    const groupedAnswers = useMemo(() => {
        const map: Record<number, Answer[]> = {};
        answers.forEach((a: Answer) => {
            if (!map[a.question_id]) map[a.question_id] = [];
            map[a.question_id].push(a);
        });
        return map;
    }, [answers]);

    // Stats Calculation
    const timeTaken = completed_at;
    // const timeTaken = completed_at
    //     ? dayjs.duration(dayjs(completed_at).diff(dayjs(started_at))).humanize()
    //     : 'Incomplete';

    const maxScore = assessment.questions.reduce((sum: number, q: DetailedQuestion) => sum + (Number(q.point) || 0), 0);
    const rawPercentage = maxScore > 0 ? (Number(sub_score) / maxScore) * 100 : 0;
    
    // Color code the score
    const scoreColor = rawPercentage >= 80 ? 'text-green-600' : rawPercentage >= 50 ? 'text-amber-600' : 'text-red-600';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Review: ${assessment.title}`} />

            <div className="mx-auto max-w-5xl space-y-8 p-6 md:p-10">
                
                {/* 1. Summary Card */}
                <Card className="overflow-hidden border-t-4 border-t-indigo-600 shadow-lg">
                    <CardHeader className="bg-gray-50/50 pb-8 text-center dark:bg-gray-800/50">
                        <Badge variant="outline" className="mx-auto mb-3 w-fit uppercase tracking-widest opacity-60">
                            Assessment Result
                        </Badge>
                        <CardTitle className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            {assessment.title}
                        </CardTitle>
                        {assessment.description && (
                            <p className="mx-auto mt-2 max-w-2xl text-gray-500 dark:text-gray-400">
                                {assessment.description}
                            </p>
                        )}
                    </CardHeader>

                    <CardContent className="grid grid-cols-2 divide-x divide-gray-100 border-t border-gray-100 p-0 dark:divide-gray-700 dark:border-gray-700 md:grid-cols-4">
                        <div className="p-6 text-center">
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total Score</p>
                            <div className={`mt-2 text-3xl font-black ${scoreColor}`}>
                                {sub_score ?? 0} <span className="text-lg font-medium text-gray-400">/ {maxScore}</span>
                            </div>
                        </div>
                        <div className="p-6 text-center">
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Percentage</p>
                            <div className={`mt-2 text-3xl font-black ${scoreColor}`}>
                                {rawPercentage.toFixed(1)}%
                            </div>
                        </div>
                        <div className="p-6 text-center">
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Time Taken</p>
                            <div className="mt-2 text-xl font-medium text-gray-700 dark:text-gray-300">
                                {timeTaken}
                            </div>
                        </div>
                        <div className="p-6 text-center">
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Completed On</p>
                            <div className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                {completed_at ? dayjs(completed_at).format('MMM D, YYYY') : '-'}
                                <br />
                                <span className="text-xs text-gray-400">
                                    {completed_at ? dayjs(completed_at).format('h:mm A') : ''}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 2. Questions List */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Detailed Breakdown</h2>
                        <span className="text-sm text-gray-500">{assessment.questions.length} Questions</span>
                    </div>

                    {assessment.questions.map((question: DetailedQuestion, index: number) => {
                        const qAnswers = groupedAnswers[question.id] || [];
                        const status = getQuestionStatus(question, qAnswers);
                        
                        return (
                            <Card
                                key={question.id}
                                className={`group overflow-hidden transition-all hover:shadow-md ${status.borderColor} border-l-4`}
                            >
                                <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-3">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <CardTitle className="text-lg font-medium leading-normal text-gray-900 dark:text-gray-100">
                                            {question.question_text ?? question.question}
                                        </CardTitle>
                                        <div className="flex items-center gap-2">
                                            <Badge variant={status.badgeVariant} className="rounded-sm px-2 py-0.5 text-xs font-semibold">
                                                {status.status}
                                            </Badge>
                                            <span className="text-xs text-gray-400">
                                                ({status.pointsDisplay} Points)
                                            </span>
                                        </div>
                                    </div>
                                    <div className="shrink-0">{status.icon}</div>
                                </CardHeader>

                                <CardContent className="pl-16 pr-6 pb-6 pt-0">
                                    <div className="mt-3 space-y-4">
                                        
                                        {/* YOUR ANSWER SECTION */}
                                        <div className="space-y-1.5">
                                            <p className="text-xs font-semibold uppercase text-gray-400">Your Answer</p>
                                            
                                            {/* WRAPPER: Color-coded box based on correctness */}
                                            <div className={`rounded-md border p-4 ${status.bgClass} ${status.textClass} border-${status.colorClass}-200`}>
                                                
                                                {/* Text / MC Answer */}
                                                {['true_false', 'fill_blank' , 'multiple_choice', 'short_answer', ].includes(question.type) && (
                                                    <p className="text-sm font-medium leading-relaxed">
                                                        {qAnswers[0]?.answer_text || <span className="italic opacity-70">No answer provided</span>}
                                                    </p>
                                                )}

                                                {/* Matching Answer */}
                                                {question.type === 'matching' && (
                                                    <div className="flex flex-wrap gap-2">

                                                        
                                                        
                                                        {qAnswers.length > 0 ? (
                                                            qAnswers.map((a, idx) => (
                                                                <div key={idx} className="flex items-center rounded bg-white/60 px-3 py-1.5 text-sm font-medium shadow-sm ring-1 ring-inset ring-black/5 dark:bg-black/20">
                                                                    <span className="opacity-70">{a.option_id}</span>
                                                                    <ArrowRight className="mx-2 h-3 w-3 opacity-40" />
                                                                    <span>{a.answer_text}</span>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <span className="italic opacity-70">No pairs matched</span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* OPTIONAL: CORRECT ANSWER SECTION 
                                            Only show this if (1) it's wrong/partial AND (2) you have the data 
                                        */}
                                        {status.status === 'Incorrect' && question.correct_answer_text && (
                                            <div className="space-y-1.5 pt-2">
                                                <p className="flex items-center gap-2 text-xs font-semibold uppercase text-green-600">
                                                    <CheckCircle className="h-3 w-3" /> Correct Answer
                                                </p>
                                                <div className="rounded-md border border-green-100 bg-green-50/50 p-3 text-sm text-green-900 dark:border-green-900/30 dark:bg-green-900/10 dark:text-green-100">
                                                    {question.correct_answer_text}
                                                </div>
                                            </div>
                                        )}

                                        {/* OPTIONAL: EXPLANATION */}
                                        {question.explanation && (
                                            <div className="mt-4 rounded-lg bg-indigo-50 p-3 text-sm text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-200">
                                                <span className="font-bold">Explanation:</span> {question.explanation}
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
                        <Button variant="outline" className="gap-2 pl-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Dashboard
                        </Button>
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}