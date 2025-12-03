import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import useAssessmentScore from '@/hooks/student/useAssessmentScore';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

import {
    CheckCircle2,
    CircleFadingArrowUp,
    HelpCircle,
    XCircle,
    Square, // Used for unselected options
    CheckSquare, // Used for selected options
} from 'lucide-react';

import { useMemo } from 'react';

// ========================
// Types
// ========================
// NOTE: Reusing the original types for consistency
interface Option {
    id: number;
    question_id: number;
    option_text: string;
    answer_text: string;
    is_correct: boolean | number; // 1 or 0 for true/false;
    side?: number; // For matching questions (1 or 2)
}

interface Question {
    id: number;
    question_text: string;
    type: 'multiple_choice' | 'true_false' | 'short_answer' | 'matching';
    points: number | string;
    options?: Option[];
}

interface Answer {
    id: number;
    question_id: number;
    option_id: number | null;
    matching_id: number | null; // For matching, this is the ID of the Option it was matched to
    answer_text: string | null;
    points_earned: number | string | null;

    // The backend may not include these, so mark as optional:
    question?: Question | null;
    option?: Option | null; // The selected Option (for MC/T/F) or the left side (for Matching)
}

interface Assessment {
    id: number;
    title: string;
    description: string;
    questions?: Question[];
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

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Review Attempt', href: dashboard().url },
];

// ======================================================
// Helper Components for Question Types
// ======================================================

/**
 * Renders the score status (icon + color)
 */
const ScoreStatus: React.FC<{
    pointsEarned: number | string | null;
    maxPoints: number;
}> = ({ pointsEarned, maxPoints }) => {
    const earned = Number(pointsEarned);

    if (isNaN(earned) || pointsEarned === null) {
        // Pending grading (usually for Q/A)
        return (
            <div className="flex items-center space-x-1 text-yellow-500">
                <CircleFadingArrowUp className="h-4 w-4" />
                <span>Pending Review</span>
            </div>
        );
    }

    if (earned === maxPoints) {
        return (
            <div className="flex items-center space-x-1 text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                <span>Correct</span>
            </div>
        );
    }

    if (earned > 0) {
        return (
            <div className="flex items-center space-x-1 text-orange-500">
                <HelpCircle className="h-4 w-4" />
                <span>Partially Correct</span>
            </div>
        );
    }

    // Earned 0 points
    return (
        <div className="flex items-center space-x-1 text-red-600">
            <XCircle className="h-4 w-4" />
            <span>Incorrect</span>
        </div>
    );
};

// --- Multiple Choice / True/False Review ---
const MultipleChoiceReview: React.FC<{
    question: Question;
    answer: Answer;
}> = ({ question, answer }) => {
    const isCorrect = Number(answer.points_earned) === Number(question.points);

    return (
        <div className="space-y-3">
            <div className="font-semibold text-base">Your Answer:</div>
            <div className="p-3 border rounded-lg bg-background space-y-2">
                {/* Options List */}
                {question.options?.map((option) => {
                    const isStudentSelected = option.id === answer.option_id;
                    const isTheCorrectAnswer =
                        option.is_correct === true || option.is_correct === 1;

                    let classes =
                        'flex items-center gap-3 p-2 rounded-md transition-colors';
                    let Icon = Square; // Default icon
                    let textClass = 'text-muted-foreground';

                    if (isStudentSelected) {
                        // Student's selection
                        Icon = CheckSquare;
                        if (isCorrect) {
                            classes += ' border-green-200 bg-green-50/50';
                            textClass = 'text-green-700 font-medium';
                        } else {
                            classes += ' border-red-200 bg-red-50/50';
                            textClass = 'text-red-700 font-medium';
                        }
                    } else if (isTheCorrectAnswer) {
                        // Correct answer (if not selected by student)
                        Icon = CheckCircle2;
                        classes += ' border-green-200 bg-green-50/50';
                        textClass = 'text-green-700 font-medium';
                    } else {
                        // Unselected, incorrect option
                        classes += ' hover:bg-muted/50';
                    }

                    return (
                        <div key={option.id} className={classes}>
                            <Icon className={`h-4 w-4 ${textClass}`} />
                            <span className={textClass}>
                                {option.option_text}
                                {option.answer_text}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// --- Question/Answer Review ---
const QaReview: React.FC<{ question: Question; answer: Answer }> = ({
    question,
    answer,
}) => {
    return (
        <div className="space-y-3">
            <div className="font-semibold text-base">Your Answer:</div>
            <div className="p-3 border rounded-lg bg-muted">
                {/* Use pre-wrap to respect original formatting/newlines */}
                <div className="whitespace-pre-wrap text-base">
                    {answer.answer_text || (
                        <span className="italic text-muted-foreground">
                            No Answer Provided
                        </span>
                    )}
                </div>
            </div>
            {/* Note: Correct answer/Rubric would go here if available */}
        </div>
    );
};

// --- Matching Review ---
const MatchingReview: React.FC<{
    question: Question;
    answers: Answer[];
}> = ({ question, answers }) => {
    // 1. Separate options into left (side=1) and right (side=2) columns
    const leftOptions = question.options
        ?.filter((o) => o.side === 1)
        .sort((a, b) => a.id - b.id);
    const rightOptions = question.options
        ?.filter((o) => o.side === 2)
        .sort((a, b) => a.id - b.id);

    // 2. Map answers: left_option_id -> right_option_text
    const studentMatches = answers.reduce<Record<number, string>>((acc, ans) => {
        if (ans.option_id && ans.matching_id) {
            const matchedOption = rightOptions?.find(
                (o) => o.id === ans.matching_id,
            );
            acc[ans.option_id] = matchedOption?.option_text ?? 'Unknown Match';
        }
        return acc;
    }, {});

    // 3. Map correct matches: left_option_id -> correct_right_option_text
    // Assumes is_correct holds the ID of the matching option for the left side option
    const correctMatches = (leftOptions || []).reduce<Record<number, string>>(
        (acc, leftOpt) => {
            if (leftOpt.is_correct) {
                const correctOption = rightOptions?.find(
                    (o) => o.id === leftOpt.is_correct,
                );
                acc[leftOpt.id] = correctOption?.option_text ?? 'Unknown Correct';
            }
            return acc;
        },
        {},
    );

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center border-b pb-2 font-bold text-lg">
                <span>Left Side</span>
                <span>Your Match</span>
            </div>

            <div className="space-y-2">
                {(leftOptions || []).map((leftOpt) => {
                    const studentMatchText = studentMatches[leftOpt.id] || (
                        <span className="italic text-muted-foreground">
                            No Match
                        </span>
                    );
                    const correctMatchText = correctMatches[leftOpt.id];
                    const isCorrect = correctMatchText === studentMatchText;

                    const MatchIcon = isCorrect ? CheckCircle2 : XCircle;
                    const iconColor = isCorrect ? 'text-green-600' : 'text-red-600';
                    const badgeVariant = isCorrect ? 'default' : 'destructive';

                    return (
                        <div
                            key={leftOpt.id}
                            className={`p-3 rounded-lg border flex flex-col sm:flex-row justify-between items-center gap-2 ${
                                isCorrect ? 'bg-green-50/30 border-green-200' : 'bg-red-50/30 border-red-200'
                            }`}
                        >
                            {/* Left Side (Question Part) */}
                            <div className="font-medium flex-1 text-left">
                                {leftOpt.option_text}
                            </div>

                            {/* Student's Match */}
                            <div className="flex-1 flex items-center justify-end sm:justify-center gap-2 text-right sm:text-center">
                                <MatchIcon className={`h-4 w-4 ${iconColor} flex-shrink-0`} />
                                <span className="font-semibold">{studentMatchText}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Total Points for Matching is handled by the main QuestionReview wrapper */}
        </div>
    );
};

/**
 * Wrapper for all question types
 */
const QuestionReview: React.FC<{
    question: Question;
    qAnswers: Answer[];
    index: number;
}> = ({ question, qAnswers, index }) => {
    const maxPoints = Number(question.points ?? 0);
    // Sum points earned from all answers for this question
    const pointsEarned = qAnswers.reduce(
        (sum, ans) => sum + Number(ans.points_earned ?? 0),
        0,
    );

    const isPendingReview =
        question.type === 'short_answer' &&
        qAnswers.some((ans) => ans.points_earned === null);

    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 p-4 sm:p-6">
                <CardTitle className="text-lg">
                    Q{index + 1}. {question.question_text}
                </CardTitle>
                <div className="flex flex-col items-end gap-2 text-sm font-semibold whitespace-nowrap">
                    {/* Points Earned / Max Points */}
                    <Badge variant="secondary">
                        {pointsEarned} / {maxPoints} pts
                    </Badge>
                    {/* Status Icon */}
                    <ScoreStatus
                        pointsEarned={isPendingReview ? null : pointsEarned}
                        maxPoints={maxPoints}
                    />
                </div>
            </CardHeader>

            <CardContent className="pt-0 p-4 sm:px-6 sm:pb-6">
                {/* Dispatch to appropriate review component */}
                {question.type === 'multiple_choice' ||
                question.type === 'true_false' ? (
                    // For MC/T/F, we only consider the first answer (should only be one)
                    <MultipleChoiceReview
                        question={question}
                        answer={qAnswers[0] ?? {}}
                    />
                ) : question.type === 'short_answer' ? (
                    <QaReview question={question} answer={qAnswers[0] ?? {}} />
                ) : question.type === 'matching' ? (
                    // Matching uses all answers in qAnswers
                    <MatchingReview question={question} answers={qAnswers} />
                ) : (
                    <div className="text-muted-foreground italic">
                        Review not supported for type: {question.type}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

// ======================================================
// Main Component
// ======================================================
export default function AttemptReview({
    assessmentAttempt,
}: {
    assessmentAttempt: Attempt;
}) {
    // 1. Use the custom hook to load state
    const studentAssessmentAttempt = useAssessmentScore(assessmentAttempt);

    const { assessment, answers = [] } = studentAssessmentAttempt;

    // ======================================================
    // 1. Group answers by question ID (supports matching/multiple answers)
    // PERFORMANCE: UseMemo ensures this calculation runs only when `answers` changes.
    // ======================================================
    const groupedAnswers = useMemo(() => {
        return answers.reduce<Record<number, Answer[]>>((acc, ans) => {
            const qid = ans.question_id;
            if (!acc[qid]) acc[qid] = [];
            acc[qid].push(ans);
            return acc;
        }, {});
    }, [answers]);

    // ======================================================
    // 2. Calculate total points from assessment.questions
    // PERFORMANCE: UseMemo ensures this calculation runs only when `assessment` changes.
    // ======================================================
    const totalPoints = useMemo(() => {
        if (!assessment?.questions) return 0;

        // Use nullish coalescing to safely access points
        return assessment.questions.reduce(
            (sum, q) => sum + Number(q.points ?? 0),
            0,
        );
    }, [assessment]);

    // ======================================================
    // Score + Time Taken
    // ======================================================
    const scoreEarned = studentAssessmentAttempt.score ?? 'Not Graded';
    const startTime = dayjs(studentAssessmentAttempt.started_at);
    const submitTime = dayjs(studentAssessmentAttempt.submitted_at);
    // Use the duration format H:mm:ss for better scannability
    const timeTaken = dayjs
        .duration(submitTime.diff(startTime))
        .format('H[h] m[m] s[s]');

    // ======================================================
    // Render
    // ======================================================
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Review: ${assessment.title}`} />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-y-auto p-4 sm:p-6 lg:p-8">
                {/* ======================================================
                    Summary Card
                ====================================================== */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">
                            Reviewing: {assessment.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                            {dayjs(studentAssessmentAttempt.submitted_at).format(
                                'MMMM D, YYYY [at] h:mm A',
                            )}
                        </p>
                    </CardHeader>

                    <CardContent className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        {/* Score */}
                        <div className="text-center p-2 border rounded-lg">
                            <div className="text-sm font-medium text-muted-foreground">
                                Score
                            </div>
                            <div className="text-3xl font-extrabold text-primary">
                                {scoreEarned} / {totalPoints}
                            </div>
                        </div>

                        {/* Status */}
                        <div className="text-center p-2 border rounded-lg">
                            <div className="text-sm font-medium text-muted-foreground">
                                Status
                            </div>
                            <div className="mt-1">
                                <Badge
                                    variant={
                                        studentAssessmentAttempt.status ===
                                        'submitted'
                                            ? 'default'
                                            : 'secondary'
                                    }
                                    className="uppercase tracking-wider"
                                >
                                    {studentAssessmentAttempt.status}
                                </Badge>
                            </div>
                        </div>

                        {/* Time Taken */}
                        <div className="text-center p-2 border rounded-lg">
                            <div className="text-sm font-medium text-muted-foreground">
                                Time Taken
                            </div>
                            <div className="text-xl font-bold mt-1">
                                {timeTaken}
                            </div>
                        </div>

                        {/* Total Questions */}
                        <div className="text-center p-2 border rounded-lg">
                            <div className="text-sm font-medium text-muted-foreground">
                                Questions
                            </div>
                            <div className="text-xl font-bold mt-1">
                                {assessment.questions?.length ?? 0}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* ======================================================
                    Render each question + answers
                ====================================================== */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold border-b pb-2">
                        Question Breakdown
                    </h2>
                    {assessment.questions?.map((question, index) => {
                        const qAnswers = groupedAnswers[question.id] ?? [];
                        return (
                            <QuestionReview
                                key={question.id}
                                question={question}
                                qAnswers={qAnswers}
                                index={index}
                            />
                        );
                    })}
                </div>
            </div>
        </AppLayout>
    );
}