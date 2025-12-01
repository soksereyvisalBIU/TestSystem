import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import useAssessmentScore from '@/hooks/student/useAssessmentScore';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { CheckCircle2, CircleFadingArrowUp, HelpCircle, XCircle } from 'lucide-react';
import { useMemo } from 'react';

dayjs.extend(duration);

// --- Types updated for matching questions ---
interface Option {
    id: number;
    question_id: number;
    option_text: string;
    is_correct: boolean | number; // boolean for MC/TF, number (ID) for matching
    side?: number;
}

interface Question {
    id: number;
    question_text: string;
    question_type: 'multiple' | 'truefalse' | 'qa' | 'matching'; // Added 'matching'
    points: number | string;
    options?: Option[];
}

interface Answer {
    id: number;
    question_id: number;
    option_id: number | null;
    matching_id: number | null; // Added for matching questions
    answer_text: string | null;
    points_earned: number | string | null;
    question?: Question | null;
    option?: Option | null;
}

interface Assessment {
    id: number;
    title: string;
    description: string;
}

interface Attempt {
    id: number;
    started_at: string;
    submitted_at: string;
    score: number | string | null;
    status: string;
    assessment: Assessment;
    answers: Answer[];
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Review Attempt', href: dashboard().url }];

export default function AttemptReview({ assessmentAttempt }: { assessmentAttempt: Attempt }) {
    const studentAssessmentAttempt = useAssessmentScore(assessmentAttempt);
    const { assessment, answers = [] } = studentAssessmentAttempt;

    // --- 1. Group answers by question to handle matching questions correctly ---
    const groupedAnswers = useMemo(() => {
        return answers.reduce<Record<number, Answer[]>>((acc, answer) => {
            if (!answer.question) return acc;
            const questionId = answer.question.id;
            if (!acc[questionId]) {
                acc[questionId] = [];
            }
            acc[questionId].push(answer);
            return acc;
        }, {});
    }, [answers]);

    // --- 2. Calculate total points from UNIQUE questions ---
    const totalPoints = useMemo(() => {
        const uniqueQuestions = [...new Map(answers.map((a) => [a.question?.id, a.question])).values()].filter(Boolean);
        return uniqueQuestions.reduce((sum, q) => sum + Number(q!.points), 0);
    }, [answers]);

    const scoreEarned = studentAssessmentAttempt.score ?? 'Not Graded';
    const startTime = dayjs(studentAssessmentAttempt.started_at);
    const submitTime = dayjs(studentAssessmentAttempt.submitted_at);
    const timeTaken = dayjs.duration(submitTime.diff(startTime)).format('H[h] m[m] s[s]');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Review: ${assessment.title}`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-y-auto rounded-xl p-4">
                {/* --- Summary Card --- */}
                <Card>
                    <CardHeader>
                        <CardTitle>Reviewing: {assessment.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        <div className="text-center">
                            <div className="text-sm font-medium text-muted-foreground">Score</div>
                            <div className="text-2xl font-bold">
                                {scoreEarned} / {totalPoints}
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-sm font-medium text-muted-foreground">Status</div>
                            <Badge variant={studentAssessmentAttempt.status === 'submitted' ? 'default' : 'secondary'}>
                                {studentAssessmentAttempt.status}
                            </Badge>
                        </div>
                        <div className="text-center">
                            <div className="text-sm font-medium text-muted-foreground">Time Taken</div>
                            <div className="text-2xl font-bold">{timeTaken}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-sm font-medium text-muted-foreground">Submitted</div>
                            <div className="text-lg font-semibold">{submitTime.format('DD MMM YYYY, HH:mm')}</div>
                        </div>
                    </CardContent>
                </Card>

                {/* --- 3. Render questions based on the grouped answers --- */}
                <div className="space-y-4">
                    {Object.values(groupedAnswers).map((questionAnswers, index) => {
                        const firstAnswer = questionAnswers[0];
                        const question = firstAnswer.question;
                        if (!question) return null; // Should not happen with grouping logic

                        // Calculate status for the entire question
                        const earnedForQuestion = questionAnswers.reduce((sum, ans) => sum + Number(ans.points_earned ?? 0), 0);
                        const totalForQuestion = Number(question.points);
                        const isPending = firstAnswer.points_earned === null;
                        const isPerfect = !isPending && earnedForQuestion === totalForQuestion;
                        const isPartial = !isPending && earnedForQuestion > 0 && earnedForQuestion < totalForQuestion;
                        const isIncorrect = !isPending && earnedForQuestion === 0;

                        const { icon, borderColor } = isPending
                            ? { icon: <HelpCircle className="text-blue-500" />, borderColor: 'border-blue-500' }
                            : isPerfect
                              ? { icon: <CheckCircle2 className="text-green-500" />, borderColor: 'border-green-500 dark:bg-green-900/20' }
                              : isPartial
                                ? {
                                      icon: <CircleFadingArrowUp className="text-orange-500" />,
                                      borderColor: 'border-orange-500 dark:bg-orange-900/20',
                                  }
                                : { icon: <XCircle className="text-red-500" />, borderColor: 'border-red-500 dark:bg-red-900/20' };

                        return (
                            <Card key={question.id} className={`border-l-4 ${borderColor}`}>
                                <CardHeader>
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                        <div className="flex-1 space-y-2">
                                            <h3 className="font-semibold">
                                                Question {index + 1}: {question.question_text}
                                            </h3>
                                            <div className="text-sm">
                                                <span className="text-xs text-muted-foreground">Your Answer:</span>
                                                <div className="mt-1 rounded-md border bg-muted/30 p-3 italic">
                                                    {question.question_type === 'matching' ? (
                                                        <ul className="space-y-1 not-italic">
                                                            {questionAnswers.map((pairAnswer) => {
                                                                const side1Option = question.options?.find((o) => o.id === pairAnswer.matching_id);
                                                                const isPairCorrect = Number(pairAnswer.points_earned ?? 0) > 0;
                                                                return (
                                                                    <li
                                                                        key={pairAnswer.id}
                                                                        className={isPairCorrect ? 'text-green-600' : 'text-red-500'}
                                                                    >
                                                                        <span className="font-semibold">{side1Option?.option_text ?? 'N/A'}</span>
                                                                        {' → '}
                                                                        <span>{pairAnswer.option?.option_text ?? 'N/A'}</span>
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>
                                                    ) : (
                                                        <div
                                                            dangerouslySetInnerHTML={{
                                                                __html:
                                                                    firstAnswer.option?.option_text ?? firstAnswer.answer_text ?? 'Not Answered'
                                                            }}
                                                        />

                                                        // <span className="font-semibold">{firstAnswer.option?.option_text ?? firstAnswer.answer_text ?? 'Not Answered'}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex min-w-40 items-center justify-end gap-2 text-sm font-medium">
                                            {icon}
                                            <span>
                                                ({earnedForQuestion.toFixed(2)} / {totalForQuestion.toFixed(2)} Pts)
                                            </span>
                                        </div>
                                    </div>
                                </CardHeader>
                                {(isIncorrect || isPartial) && question.question_type != 'qa' && (
                                    <CardContent>
                                        <div className="mt-2 rounded-md border border-green-300 bg-green-50 p-3 dark:bg-green-900/30">
                                            <p className="text-sm font-semibold text-green-700 dark:text-green-300">Correct Answer(s):</p>
                                            {question.question_type === 'matching' ? (
                                                <ul className="mt-1 space-y-1 text-sm text-green-800 dark:text-green-200">
                                                    {question.options
                                                        ?.filter((o) => o.side === 2)
                                                        .map((side2Opt) => {
                                                            const side1Opt = question.options?.find((o) => o.id === side2Opt.is_correct);
                                                            return (
                                                                <li key={side2Opt.id}>
                                                                    <span className="font-semibold">{side1Opt?.option_text}</span>
                                                                    {' → '}
                                                                    <span>{side2Opt.option_text}</span>
                                                                </li>
                                                            );
                                                        })}
                                                </ul>
                                            ) : (
                                                <p className="text-base font-semibold text-green-800 dark:text-green-200">
                                                    {question.options?.find((o) => o.is_correct)?.option_text}
                                                </p>
                                            )}
                                        </div>
                                    </CardContent>
                                )}
                            </Card>
                        );
                    })}
                </div>
            </div>
        </AppLayout>
    );
}
