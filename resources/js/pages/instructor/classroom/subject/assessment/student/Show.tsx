import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { clsx } from 'clsx';
import dayjs from 'dayjs';
import {
    AlertCircle,
    CheckCircle2,
    HelpCircle,
    Loader2,
    Save,
    XCircle,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { twMerge } from 'tailwind-merge';
import { route } from 'ziggy-js';

// ShadCN components
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

// --- UTILS ---
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

// Pure function to calculate the "System" score
const calculateAutoScore = (question, answers = []) => {
    const maxPoints = parseFloat(question.point || 0);
    let earnedPoints = 0;
    let status = 'unanswered';

    if (!answers || answers.length === 0)
        return { earnedPoints, maxPoints, status };

    // Common normalization
    const normalize = (str) => (str || '').toString().trim().toLowerCase();

    switch (question.type) {
        case 'true_false':
        case 'multiple_choice': {
            const answer = answers[0];
            const correctOption = question.options?.find(
                (opt) => opt.is_correct === 1,
            );
            if (
                correctOption &&
                answer.answer_text === correctOption.option_text
            ) {
                earnedPoints = maxPoints;
                status = 'correct';
            } else {
                status = 'incorrect';
            }
            break;
        }
        case 'fill_blank':
        case 'short_answer': {
            const answer = answers[0];
            const correctOption = question.options?.find(
                (opt) =>
                    normalize(opt.option_text) ===
                    normalize(answer.answer_text),
            );
            if (correctOption) {
                earnedPoints = maxPoints;
                status = 'correct';
            } else {
                status = 'review'; // Short answers usually default to review if not exact match
            }
            break;
        }
        case 'matching': {
            const totalPairs = question.options?.length || 0;
            if (totalPairs === 0) break;

            const pointPerPair = maxPoints / totalPairs;
            let correctCount = 0;

            question.options.forEach((opt) => {
                const ans = answers.find((a) => a.option_id === opt.id);
                if (ans && ans.answer_text === opt.match_key) correctCount++;
            });

            earnedPoints = correctCount * pointPerPair;

            
            status =
                correctCount === totalPairs
                    ? 'correct'
                    : correctCount === 0
                      ? 'incorrect'
                      : 'partial';
            break;
        }
        default:
            break;
    }

    return {
        earnedPoints: parseFloat(earnedPoints.toFixed(2)),
        maxPoints: parseFloat(maxPoints.toFixed(2)),
        status,
    };
};

const StatusBadge = ({ status }) => {
    const config = {
        correct: {
            color: 'bg-green-100 text-green-700 border-green-200',
            icon: CheckCircle2,
            label: 'Correct',
        },
        incorrect: {
            color: 'bg-red-100 text-red-700 border-red-200',
            icon: XCircle,
            label: 'Incorrect',
        },
        partial: {
            color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            icon: AlertCircle,
            label: 'Partial',
        },
        review: {
            color: 'bg-orange-100 text-orange-800 border-orange-200',
            icon: HelpCircle,
            label: 'Needs Review',
        },
        unanswered: {
            color: 'bg-gray-100 text-gray-600 border-gray-200',
            icon: HelpCircle,
            label: 'No Answer',
        },
    };

    const current = config[status] || config.unanswered;
    const Icon = current.icon;

    return (
        <Badge
            variant="outline"
            className={cn('gap-1.5 py-1 pr-2.5 pl-1.5', current.color)}
        >
            <Icon className="h-3.5 w-3.5" />
            {current.label}
        </Badge>
    );
};

// --- SUB-COMPONENTS ---

const MatchingQuestion = ({ question, answers }) => (
    <div className="mt-4 grid gap-3">
        {question.options?.map((option) => {
            const answer = answers.find((a) => a.option_id === option.id);
            const studentSelection = answer?.answer_text || '—';
            const isCorrect = studentSelection === option.match_key;

            // console.log('answer' , answer);
            // console.log('studentSelection' , studentSelection);
            // console.log('isCorrect' , isCorrect);

            return (
                <div
                    key={option.id}
                    className={cn(
                        'flex flex-col items-start justify-between rounded-lg border p-3 text-sm transition-colors sm:flex-row sm:items-center',
                        isCorrect
                            ? 'border-green-200 bg-green-50/50'
                            : 'border-red-200 bg-red-50/50',
                    )}
                >
                    <span className="w-full font-medium text-gray-700 sm:w-1/2">
                        {option.option_text}
                    </span>
                    <span className="mx-2 hidden text-gray-300 sm:block">
                        →
                    </span>
                    <div className="mt-2 flex w-full flex-col gap-1 sm:mt-0 sm:w-1/2 sm:items-end">
                        <div className="flex items-center gap-2">
                            <span
                                className={cn(
                                    'font-semibold',
                                    isCorrect
                                        ? 'text-green-700'
                                        : 'text-red-700',
                                )}
                            >
                                {studentSelection}
                            </span>
                        </div>
                        {!isCorrect && (
                            <span className="rounded bg-green-100 px-1.5 py-0.5 text-xs text-green-600">
                                Expected: {option.match_key}
                            </span>
                        )}
                    </div>
                </div>
            );
        })}
    </div>
);

const ChoiceQuestion = ({ question, answers }) => {
    const studentSelection = answers[0]?.answer_text;

    return (
        <div className="mt-4 space-y-2.5">
            {question.options?.map((option) => {
                const isSelected = studentSelection === option.option_text;
                const isCorrect = option.is_correct === 1;

                let stateStyles = 'border-gray-200 hover:bg-gray-50';
                if (isSelected && isCorrect)
                    stateStyles =
                        'border-green-500 bg-green-50 ring-1 ring-green-500';
                else if (isSelected && !isCorrect)
                    stateStyles =
                        'border-red-500 bg-red-50 ring-1 ring-red-500';
                else if (!isSelected && isCorrect)
                    stateStyles =
                        'border-green-500 bg-white ring-1 ring-green-500 border-dashed';

                return (
                    <div
                        key={option.id}
                        className={cn(
                            'relative flex items-center gap-3 rounded-lg border p-3.5 transition-all',
                            stateStyles,
                        )}
                    >
                        <div
                            className={cn(
                                'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border',
                                isSelected
                                    ? isCorrect
                                        ? 'border-green-600 bg-green-600 text-white'
                                        : 'border-red-600 bg-red-600 text-white'
                                    : 'border-gray-400',
                            )}
                        >
                            {isSelected && (
                                <CheckCircle2 className="h-3.5 w-3.5" />
                            )}
                        </div>
                        <span
                            className={cn(
                                'flex-1 text-sm',
                                isCorrect
                                    ? 'font-semibold text-gray-900'
                                    : 'text-gray-700',
                            )}
                        >
                            {option.option_text}
                        </span>
                        {isCorrect && !isSelected && (
                            <span className="rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-600">
                                Correct Answer
                            </span>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

const TextQuestion = ({ question, answers, onTeacherScore }) => {
    const studentText = answers[0]?.answer_text || '';
    const correctOptions = question.options?.map((o) => o.option_text) || [];
    const isAutoCorrect = correctOptions.some(
        (opt) => opt.trim().toLowerCase() === studentText.trim().toLowerCase(),
    );

    // Initialize with manual score if exists, otherwise empty
    const currentManualScore = answers[0]?.manual_score;
    const maxPoints = parseFloat(question.point || 0);

    const handleScoreChange = (e) => {
        let val = e.target.value;
        if (val === '') {
            onTeacherScore(question.id, '');
            return;
        }
        let numVal = parseFloat(val);
        if (numVal < 0) numVal = 0;
        if (numVal > maxPoints) numVal = maxPoints;
        onTeacherScore(question.id, numVal);
    };

    return (
        <div className="mt-4 space-y-6">
            <div className="space-y-1.5">
                <Label className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    Student Response
                </Label>
                <div
                    className={cn(
                        'rounded-md border p-4 text-sm leading-relaxed',
                        isAutoCorrect
                            ? 'border-green-200 bg-green-50/50 text-green-900'
                            : 'border-gray-200 bg-gray-50 text-gray-900',
                    )}
                >
                    {studentText || (
                        <em className="text-gray-400">No answer submitted</em>
                    )}
                </div>
            </div>

            {!isAutoCorrect && correctOptions.length > 0 && (
                <div className="space-y-1.5">
                    <Label className="text-xs font-semibold tracking-wider text-green-600 uppercase">
                        Expected Answer(s)
                    </Label>
                    <div className="rounded-md border border-green-100 bg-green-50/30 p-3">
                        <ul className="list-inside list-disc text-sm text-green-800">
                            {correctOptions.map((opt, i) => (
                                <li key={i}>{opt}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            <div className="flex items-center gap-4 rounded-lg border border-gray-100 bg-gray-50 p-4">
                <div className="flex-1">
                    <Label
                        htmlFor={`score-${question.id}`}
                        className="font-medium"
                    >
                        Override / Manual Score
                    </Label>
                    <p className="mt-0.5 text-xs text-gray-500">
                        Max possible: {maxPoints} points
                    </p>
                </div>
                <div className="relative w-32">
                    <Input
                        id={`score-${question.id}`}
                        type="number"
                        min="0"
                        max={maxPoints}
                        step="0.25"
                        value={currentManualScore ?? ''}
                        onChange={handleScoreChange}
                        className={cn(
                            'pr-8 text-right font-mono font-medium',
                            currentManualScore !== undefined &&
                                currentManualScore !== null
                                ? 'border-blue-500 ring-1 ring-blue-500'
                                : '',
                        )}
                        placeholder="-"
                    />
                    <span className="absolute top-2.5 right-3 text-xs text-gray-400">
                        pts
                    </span>
                </div>
            </div>
        </div>
    );
};

const QuestionRenderer = ({ question, answers, onTeacherScore }) => {
    // Determine scores and status
    const autoResult = calculateAutoScore(question, answers);
    const manualScore = answers[0]?.manual_score;

    // Use manual score if present, otherwise auto earned points
    const finalScore =
        manualScore !== undefined && manualScore !== null && manualScore !== ''
            ? parseFloat(manualScore)
            : autoResult.earnedPoints;

    // If there is a manual score, force status to 'Review/Graded', otherwise use auto status
    const displayStatus =
        manualScore !== undefined && manualScore !== null && manualScore !== ''
            ? 'review'
            : autoResult.status;

    return (
        <div className="flex h-full flex-col">
            <div className="prose prose-sm mb-2 max-w-none text-gray-800">
                {/* ideally use DOMPurify here */}
                <div
                    dangerouslySetInnerHTML={{ __html: question.question_text }}
                />
            </div>

            <div className="flex-grow">
                {question.type === 'matching' && (
                    <MatchingQuestion question={question} answers={answers} />
                )}
                {(question.type === 'multiple_choice' ||
                    question.type === 'true_false') && (
                    <ChoiceQuestion question={question} answers={answers} />
                )}
                {(question.type === 'short_answer' ||
                    question.type === 'fill_blank') && (
                    <TextQuestion
                        question={question}
                        answers={answers}
                        onTeacherScore={onTeacherScore}
                    />
                )}
            </div>

            <Separator className="my-6" />

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <StatusBadge status={displayStatus} />
                    {manualScore !== undefined &&
                        manualScore !== null &&
                        manualScore !== '' && (
                            <span className="rounded bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
                                Manually Modified
                            </span>
                        )}
                </div>
                <div className="text-sm">
                    <span className="mr-2 text-gray-500">Score:</span>
                    <span
                        className={cn(
                            'text-lg font-bold',
                            finalScore > 0 ? 'text-gray-900' : 'text-gray-400',
                        )}
                    >
                        {finalScore}
                    </span>
                    <span className="mx-1 text-gray-400">/</span>
                    <span className="font-medium text-gray-600">
                        {autoResult.maxPoints}
                    </span>
                </div>
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---
export default function StudentAssessmentAttemptScoring({
    assessment,
    attempt,
    classId = 1, // Pass these as props from parent
    subjectId = 1,
}) {
    // console.log(assessment);
    // console.log(attempt);

    console.log({ assessment, attempt });

    const [answersState, setAnswersState] = useState(attempt.answers || []);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Group answers once
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

    const handleSubmit = async () => {
        setIsSubmitting(true);

        console.log(assessment.questions)

        console.log('attempt answer' , attempt.answers)
        
        // 1. Iterate over ALL questions in the assessment
        // We do this to ensure we capture scores for every question, even unanswered ones.
        const answersPayload = assessment.questions.map((question) => {
            const questionAnswers = answersState.filter(
                (a) => a.question_id === question.id,
            );

            const manualOverride = questionAnswers[0]?.manual_score;
            let finalScoreToSend;

            if (
                manualOverride !== undefined &&
                manualOverride !== null &&
                manualOverride !== ''
            ) {
                finalScoreToSend = parseFloat(manualOverride);
            } else {
                const autoResult = calculateAutoScore(
                    question,
                    questionAnswers,
                );
                finalScoreToSend = autoResult.earnedPoints;
            }

            return {
                question_id: question.id,
                score: finalScoreToSend,
            };
        });

        const payload = {
            student_assessment_attempt_id: attempt?.id,
            answers: answersPayload,
        };

        // Debug: Check the console to see exactly what is being sent
        console.log('Submitting Payload:', payload);

        try {
            await fetch(
                route(
                    'instructor.classes.subjects.assessments.students.store',
                    {
                        class: classId,
                        subject: subjectId,
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
                    // Update the body key to match your backend controller validation
                    // e.g., if your backend expects 'items', change 'scores' to 'items'
                    body: JSON.stringify(payload),
                    // body: JSON.stringify({ scores: payload }),
                },
            );

            toast.success('Grades saved successfully');
        } catch (err) {
            console.error(err);
            toast.error('Failed to save scores.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Assessments', href: '/assessments' },
        { title: assessment.title, href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Grading: ${assessment.title}`} />

            <div className="relative pb-24">
                <div className="mx-auto mt-6 max-w-5xl space-y-8 px-4 sm:px-6">
                    {/* Header Card */}
                    <Card className="border-l-4 border-l-primary shadow-sm">
                        <CardContent className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:justify-between">
                            <div className="space-y-2">
                                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                                    {assessment.title}
                                </h1>
                                <p className="max-w-2xl text-gray-500">
                                    {assessment.description}
                                </p>
                                <div className="flex flex-wrap items-center gap-4 pt-2">
                                    <Badge
                                        variant="secondary"
                                        className="px-3 py-1 text-sm font-normal"
                                    >
                                        Student:{' '}
                                        <span className="ml-1 font-semibold">
                                            {attempt.student?.name || 'Unknown'}
                                        </span>
                                    </Badge>
                                    <Badge
                                        variant="outline"
                                        className="font-normal text-gray-500"
                                    >
                                        Submitted:{' '}
                                        {attempt.updated_at
                                            ? dayjs(attempt.updated_at).format(
                                                  'MMM D, YYYY h:mm A',
                                              )
                                            : 'N/A'}
                                    </Badge>
                                </div>
                            </div>

                            <Card className="min-w-[200px] border-slate-200 bg-slate-50">
                                <CardContent className="p-4 text-center">
                                    <p className="mb-1 text-xs font-bold tracking-wider text-slate-500 uppercase">
                                        Total Score
                                    </p>
                                    <div className="flex items-baseline justify-center gap-1 text-slate-900">
                                        <span className="text-4xl font-extrabold">
                                            {totalEarned.toFixed(2)}
                                        </span>
                                        <span className="text-xl font-medium text-slate-400">
                                            / {totalMax}
                                        </span>
                                    </div>
                                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                                        <div
                                            className="h-full bg-slate-800 transition-all duration-500 ease-out"
                                            style={{
                                                width: `${Math.min((totalEarned / totalMax) * 100, 100)}%`,
                                            }}
                                        />
                                    </div>
                                    <p className="mt-1.5 text-xs font-medium text-slate-500">
                                        {(
                                            (totalEarned / totalMax) *
                                            100
                                        ).toFixed(1)}
                                        %
                                    </p>
                                </CardContent>
                            </Card>
                        </CardContent>
                    </Card>

                    {/* Questions List */}
                    <div className="space-y-6">
                        {assessment.questions.map((question, index) => (
                            <Card
                                key={question.id}
                                className="overflow-hidden border-slate-200 shadow-sm transition-all hover:shadow-md"
                            >
                                <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-3">
                                    <div className="flex items-center gap-2">
                                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-700">
                                            {index + 1}
                                        </span>
                                        <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                                            {question.type.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className="bg-white text-slate-500"
                                    >
                                        {question.point} pts
                                    </Badge>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <QuestionRenderer
                                        question={question}
                                        answers={
                                            answersByQuestionId[question.id] ||
                                            []
                                        }
                                        onTeacherScore={handleTeacherScore}
                                    />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Sticky Action Bar */}
                <div className="fixed right-0 bottom-0 left-0 z-50 border-t bg-white p-4 shadow-lg">
                    <div className="mx-auto flex max-w-5xl items-center justify-between">
                        <div className="hidden sm:block">
                            <p className="text-sm font-medium text-gray-600">
                                Grading{' '}
                                <span className="text-gray-900">
                                    {attempt.student?.name || 'Student'}
                                </span>
                            </p>
                            <p className="text-xs text-gray-400">
                                Current Total: {totalEarned} / {totalMax}
                            </p>
                        </div>
                        <div className="flex w-full gap-4 sm:w-auto">
                            <Button
                                variant="outline"
                                className="flex-1 sm:flex-none"
                                onClick={() => window.history.back()}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="min-w-[140px] flex-1 sm:flex-none"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Submit Grades
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
