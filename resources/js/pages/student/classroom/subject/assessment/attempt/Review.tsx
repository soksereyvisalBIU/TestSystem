import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import type { Answer, Attempt, Question } from '@/types/assessment';
import { Head } from '@inertiajs/react';

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

import { CheckCircle, Clock, XCircle, ArrowRight } from 'lucide-react';
import { useMemo } from 'react';

// ====================
//   Types
// ====================

interface DetailedQuestion extends Question {
    options?: any;
}

interface DetailedAttempt extends Attempt {
    assessment: {
        title: string;
        description: string;
        questions: DetailedQuestion[];
    };
    answers: Answer[];
    started_at: string;
    completed_at: string | null;
    sub_score: number | null;
}

// ====================
//   Breadcrumbs
// ====================

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Review Attempt', href: dashboard().url },
];

// ====================
//   Status Helper
// ====================

// Updated to return a border color class
const getQuestionStatus = (question: DetailedQuestion, answers: Answer[]) => {
    if (!answers.length) {
        return {
            status: 'Not Answered',
            badgeVariant: 'secondary',
            icon: <Clock className="h-4 w-4 text-gray-500" />,
            pointsDisplay: `0 / ${question.point}`,
            pointsColor: 'text-gray-500',
            borderColor: 'border-l-gray-300', // New: Neutral border for Not Answered
        };
    }

    if (['short_answer', 'essay'].includes(question.type)) {
        const graded = answers.some((a) => a.points_earned !== null);

        if (!graded) {
            return {
                status: 'Pending Grading',
                badgeVariant: 'default',
                icon: <Clock className="h-4 w-4 text-amber-500" />,
                pointsDisplay: `- / ${question.point}`,
                pointsColor: 'text-amber-500',
                borderColor: 'border-l-amber-500', // New: Amber border for Pending
            };
        }
    }

    const earned = Number(answers[0]?.points_earned ?? 0);
    const max = Number(question.point);

    if (earned === max) {
        return {
            status: 'Correct',
            badgeVariant: 'default',
            icon: <CheckCircle className="h-4 w-4 text-green-600" />,
            pointsDisplay: `${earned} / ${max}`,
            pointsColor: 'text-green-600',
            borderColor: 'border-l-green-600', // New: Green border for Correct
        };
    }

    if (earned > 0) {
        return {
            status: 'Partial',
            badgeVariant: 'default',
            icon: <CheckCircle className="h-4 w-4 text-yellow-500" />,
            pointsDisplay: `${earned} / ${max}`,
            pointsColor: 'text-yellow-600',
            borderColor: 'border-l-yellow-600', // New: Yellow border for Partial
        };
    }

    return {
        status: 'Incorrect',
        badgeVariant: 'destructive',
        icon: <XCircle className="h-4 w-4 text-red-600" />,
        pointsDisplay: `${earned} / ${max}`,
        pointsColor: 'text-red-600',
        borderColor: 'border-l-red-600', // New: Red border for Incorrect
    };
};

// ====================
//   Component
// ====================

export default function AttemptReview({
    assessmentAttemptResource,
}: {
    assessmentAttemptResource: any;
}) {
    const { assessment, answers, started_at, completed_at, sub_score } =
        assessmentAttemptResource.data;

    const groupedAnswers = useMemo(() => {
        const map: Record<number, Answer[]> = {};
        answers.forEach((a) => {
            if (!map[a.question_id]) map[a.question_id] = [];
            map[a.question_id].push(a);
        });
        return map;
    }, [answers]);

    const timeTaken = completed_at
        ? dayjs.duration(dayjs(completed_at).diff(dayjs(started_at))).humanize()
        : 'Incomplete';

    const maxScore = assessment.questions.reduce(
        (sum: number, q: DetailedQuestion) => sum + (Number(q.point) || 0),
        0
    );
    const percentage = maxScore > 0 ? ((Number(sub_score) / maxScore) * 100).toFixed(1) : '0';

    const completionStatus = completed_at ? 'Completed' : 'In Progress';
    const completionBadgeVariant = completed_at ? 'default' : 'secondary';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Review Attempt" />

            <div className="space-y-6 p-8">
                {/* =============================== */}
                {/* Assessment Header and Summary */}
                {/* =============================== */}
                <Card className="shadow-lg border-t-4 border-t-indigo-600">
                    <CardHeader className="p-6 border-b">
                        <CardTitle className="text-3xl font-bold text-gray-900">
                            {assessment.title}
                        </CardTitle>
                        <p className="mt-1 text-base text-gray-500">
                            {assessment.description}
                        </p>
                    </CardHeader>
                    
                    <CardContent className="p-6 grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
                        <StatItem label="Status">
                            <Badge variant={completionBadgeVariant} className="text-sm font-semibold">
                                {completionStatus}
                            </Badge>
                        </StatItem>
                        <StatItem label="Started">
                            <p className="text-gray-700 font-medium">
                                {dayjs(started_at).format('MMM DD, YYYY')}
                            </p>
                            <p className="text-xs text-gray-500">
                                {dayjs(started_at).format('HH:mm A')}
                            </p>
                        </StatItem>
                        <StatItem label="Completed">
                            <Badge variant="outline" className="text-sm font-medium">
                                {completed_at
                                    ? dayjs(completed_at).format('MMM DD, YYYY HH:mm A')
                                    : 'N/A'}
                            </Badge>
                        </StatItem>
                        <StatItem label="Time Taken">
                            <Badge variant="outline" className="text-sm font-medium text-indigo-700 bg-indigo-50 border-indigo-200">
                                {timeTaken}
                            </Badge>
                        </StatItem>
                        <StatItem label="Final Score">
                            <p className="text-3xl font-extrabold text-indigo-600">
                                {sub_score ?? '-'}
                            </p>
                            <p className="text-sm text-gray-500">
                                out of {maxScore} ({percentage}%)
                            </p>
                        </StatItem>
                    </CardContent>
                </Card>

                {/* =============================== */}
                {/* Questions List */}
                {/* =============================== */}
                <h2 className="text-2xl font-semibold text-gray-800 pt-4">Question Breakdown</h2>
                <div className="space-y-4">
                    {assessment.questions.map(
                        (question: DetailedQuestion, index: number) => {
                            const qAnswers = groupedAnswers[question.id] || [];
                            const status = getQuestionStatus(question, qAnswers);

                            return (
                                <Card
                                    key={question.id}
                                    className={`shadow-md hover:shadow-lg transition-all duration-300 border-l-8 ${status.borderColor} rounded-xl`}
                                >
                                    <CardHeader className="flex flex-row items-start justify-between p-4 sm:p-5 border-b">
                                        <CardTitle className="text-lg font-medium pr-4 flex-1">
                                            <span className="text-indigo-600 font-bold mr-2">{index + 1}.</span>
                                            {question.question_text ?? question.question}
                                        </CardTitle>

                                        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                                            <div className="flex items-center gap-2">
                                                <Badge variant={status.badgeVariant} className={`py-1 px-3 text-sm font-medium bg-opacity-10 ${status.pointsColor.replace('text-', 'text-')}`}>
                                                    {status.status}
                                                </Badge>
                                                {status.icon}
                                                <p
                                                    className={`${status.pointsColor} font-bold text-lg min-w-[50px] text-right`}
                                                >
                                                    {status.pointsDisplay}
                                                </p>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-4 p-4 sm:p-5 text-base">
                                        <div className="text-gray-700">
                                            <p className="mb-2 text-sm font-semibold text-gray-500 uppercase">Your Answer</p>

                                            {/* TRUE / FALSE + MULTIPLE CHOICE */}
                                            {['true_false', 'multiple_choice'].includes(question.type) && (
                                                <p className="font-medium bg-indigo-50 p-2 rounded-md border border-indigo-100">
                                                    {qAnswers[0]?.answer_text || '— No answer provided'}
                                                </p>
                                            )}

                                            {/* MATCHING */}
                                            {question.type === 'matching' && (
                                                <ul className="space-y-2 p-3 bg-gray-50 rounded-lg border">
                                                    {qAnswers.map((a, idx) => (
                                                        <li key={idx} className="flex items-center text-sm">
                                                            <strong className="text-gray-900 mr-2 min-w-[100px]">
                                                                {a.option_id}
                                                            </strong> 
                                                            <ArrowRight className="h-4 w-4 text-indigo-400 mr-2" />
                                                            <span className="text-gray-700">{a.answer_text}</span>
                                                        </li>
                                                    ))}
                                                    {qAnswers.length === 0 && <li className="text-gray-500">— No answer provided</li>}
                                                </ul>
                                            )}

                                            {/* SHORT ANSWER / ESSAY */}
                                            {['short_answer', 'essay'].includes(question.type) && (
                                                <div className="rounded-lg border bg-gray-50 p-4 text-base min-h-[50px]">
                                                    {qAnswers[0]?.answer_text || '— No answer provided'}
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        },
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

// Helper component for cleaner stat layout
const StatItem = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="flex flex-col space-y-1">
        <p className="text-xs font-medium uppercase text-gray-500 tracking-wider">{label}</p>
        <div className="flex items-center justify-center h-full">{children}</div>
    </div>
);