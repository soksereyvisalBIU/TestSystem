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

import { CheckCircle, Clock, XCircle } from 'lucide-react';
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
//  Status Helper
// ====================

const getQuestionStatus = (question: DetailedQuestion, answers: Answer[]) => {
    if (!answers.length) {
        return {
            status: 'Not Answered',
            badgeVariant: 'secondary',
            icon: <Clock className="h-4 w-4 text-muted-foreground" />,
            pointsDisplay: `0 / ${question.point}`,
            pointsColor: 'text-muted-foreground',
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
            };
        }
    }

    const earned = Number(answers[0]?.points_earned ?? 0);
    const max = Number(question.point);

    if (earned === max) {
        return {
            status: 'Correct',
            badgeVariant: 'default',
            icon: <CheckCircle className="h-4 w-4 text-green-500" />,
            pointsDisplay: `${earned} / ${max}`,
            pointsColor: 'text-green-500',
        };
    }

    if (earned > 0) {
        return {
            status: 'Partially Correct',
            badgeVariant: 'default',
            icon: <CheckCircle className="h-4 w-4 text-yellow-500" />,
            pointsDisplay: `${earned} / ${max}`,
            pointsColor: 'text-yellow-500',
        };
    }

    return {
        status: 'Incorrect',
        badgeVariant: 'destructive',
        icon: <XCircle className="h-4 w-4 text-red-500" />,
        pointsDisplay: `${earned} / ${max}`,
        pointsColor: 'text-red-500',
    };
};

// ====================
//   Component
// ====================

export default function AttemptReview({
    // assessmentAttempt,
    assessmentAttemptResource,
}: {
    // assessmentAttempt: DetailedAttempt;
    assessmentAttemptResource: any;
}) {
    const { assessment, answers, started_at, completed_at } =
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Review Attempt" />

            <div className="space-y-2 p-8">
                {/* =============================== */}
                {/* Assessment Header */}
                {/* =============================== */}
                <Card>
                    {/* <CardHeader >
                        <CardTitle className="text-xl font-semibold">
                            {assessment.title}
                        </CardTitle>
                        <p className="mt-1 text-muted-foreground">
                            {assessment.description}
                        </p>
                    </CardHeader> */}

                    <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Started
                            </p>
                            <p>
                                {dayjs(started_at).format(
                                    'MMM DD, YYYY HH:mm A',
                                )}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                Completed
                            </p>
                            <Badge>
                                {completed_at
                                    ? dayjs(completed_at).format(
                                          'MMM DD, YYYY HH:mm A',
                                      )
                                    : 'Not Completed'}
                            </Badge>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                Time Taken
                            </p>
                            <Badge>{timeTaken}</Badge>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                Total Score
                            </p>
                            <p className="font-semibold">
                                {assessmentAttemptResource.data.sub_score}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* =============================== */}
                {/* Questions List */}
                {/* =============================== */}
                {assessment.questions.map(
                    (question: DetailedQuestion, index: number) => {
                        const qAnswers = groupedAnswers[question.id] || [];
                        const status = getQuestionStatus(question, qAnswers);

                        return (
                            <Card
                                key={question.id}
                                className="gap-2 border shadow-sm border-l-8 py-4 border-l-amber-600"
                            >
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="text-md">
                                        {index + 1}.{' '}
                                        {question.question_text ??
                                            question.question}
                                    </CardTitle>

                                    <div className="flex items-center gap-2">
                                        <Badge variant={status.badgeVariant}>
                                            {status.status}
                                        </Badge>
                                        {status.icon}
                                        <p
                                            className={`${status.pointsColor} font-medium`}
                                        >
                                            {status.pointsDisplay}
                                        </p>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-3 text-sm">
                                    <div>
                                        {/* <p className="mb-1 text-sm text-muted-foreground">
                                            Your Answer:
                                        </p> */}

                                        {/* TRUE / FALSE + MULTIPLE CHOICE */}
                                        {[
                                            'true_false',
                                            'multiple_choice',
                                        ].includes(question.type) && (
                                            <p>
                                                {qAnswers[0]?.answer_text ||
                                                    '—'}
                                            </p>
                                        )}

                                        {/* MATCHING */}
                                        {question.type === 'matching' && (
                                            <ul className="ml-5 list-disc space-y-1">
                                                {qAnswers.map((a, idx) => (
                                                    <li key={idx}>
                                                        <strong>
                                                            {a.option_id}
                                                        </strong>{' '}
                                                        → {a.answer_text}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}

                                        {/* SHORT ANSWER / ESSAY */}
                                        {['short_answer', 'essay'].includes(
                                            question.type,
                                        ) && (
                                            <div className="rounded-md border bg-muted p-3 text-sm">
                                                {qAnswers[0]?.answer_text ||
                                                    '—'}
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    },
                )}
            </div>
        </AppLayout>
    );
}
