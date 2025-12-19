import dayjs from 'dayjs';
// We are removing the explicit import for Head from "@inertiajs/react" and using a mock/dummy component.
import React from 'react';

// --- MOCK/DUMMY COMPONENTS AND TYPES FOR SELF-CONTAINED FILE ---
// In a real project, these would be imported from your component library.

// Dummy types based on the structure provided
/** @typedef {{ id: number, title: string, description: string, type: 'quiz' | 'exam', start_time: string, end_time: string, duration: number, max_attempts: number, questions: any[] }} Assessment */
/** @typedef {{ id: number, student_assessment_id: number, status: 'submitted' | 'completed', started_at: string, completed_at: string, sub_score: number, answers: any[] }} Attempt */
/** @typedef {{ title: string, href: string }} BreadcrumbItem */

// Minimal functional mock components for UI elements
const Card = ({ children, className = '' }) => (
    <div className={`rounded-xl bg-white shadow-lg ${className}`}>
        {children}
    </div>
);
const CardHeader = ({ children, className = '' }) => (
    <div className={`border-b border-gray-100 p-6 ${className}`}>
        {children}
    </div>
);
const CardTitle = ({ children, className = '' }) => (
    <h2 className={`text-2xl font-bold text-gray-800 ${className}`}>
        {children}
    </h2>
);
const CardContent = ({ children, className = '' }) => (
    <div className={`p-6 ${className}`}>{children}</div>
);
const Separator = ({ className = 'my-4' }) => (
    <div className={`h-px bg-gray-200 ${className}`} />
);

// Mock for AppLayout - provides general structure
const AppLayout = ({ breadcrumbs, children }) => (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
        <nav className="mb-6 text-sm text-gray-500">
            {breadcrumbs.map((item, index) => (
                <React.Fragment key={index}>
                    <a
                        href={item.href}
                        className="text-blue-600 hover:text-blue-800"
                    >
                        {item.title}
                    </a>
                    {index < breadcrumbs.length - 1 && (
                        <span className="mx-2">/</span>
                    )}
                </React.Fragment>
            ))}
        </nav>
        {children}
    </div>
);

// Mock for Head component from @inertiajs/react
const Head = ({ title }) => {
    // In a self-contained component, we can't modify the document title,
    // so this component essentially does nothing but fulfill the React component requirement.
    return null;
};

const dashboard = () => ({ url: '#' });
// --- END MOCK COMPONENTS ---

const breadcrumbs = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Assessment Scoring', href: '#' },
];

/**
 * Helper to display key details in a consistent layout.
 */
const DetailItem = ({ label, value }) => (
    <div className="flex items-center justify-between border-b border-gray-100 py-2 last:border-b-0">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        <span className="text-base font-semibold text-gray-700">{value}</span>
    </div>
);

/**
 * Renders the content, student answer, and correct answer for a single question.
 */
const QuestionRenderer = ({ question, answers }) => {
    // Shared styling classes
    const textBase = 'text-base font-semibold';
    const highlightCorrect = 'bg-green-100 text-green-800 border-green-300';
    const highlightIncorrect = 'bg-red-100 text-red-800 border-red-300';
    const highlightNeutral = 'bg-gray-100 text-gray-800 border-gray-300';

    // Use dangerouslySetInnerHTML for question text if it contains HTML/Markdown
    const questionTextHtml = { __html: question.question_text };

    switch (question.type) {
        case 'fill_blank':
        case 'short_answer':
            // Fill-in-the-blank and short answer are treated similarly in terms of display
            const answer = answers[0] || {};
            const studentText = answer.answer_text || 'No answer provided';
            // Ensure points are parsed correctly
            const pointsEarned =
                answer.points_earned !== null
                    ? parseFloat(answer.points_earned).toFixed(2)
                    : 'N/A';
            const maxPoint = parseFloat(question.point);

            // Check if points were earned to determine scoring status
            const isScored = pointsEarned !== 'N/A';
            const isCorrect = isScored && parseFloat(pointsEarned) > 0;

            // For 'fill_blank', the correct answer is the option_text of the first option
            const correctAnswerOption =
                question.options[0]?.option_text || 'N/A';

            // Determine label for the scoring badge
            let scoreLabel = 'Unscored (Manual)';
            let scoreClass = highlightIncorrect; // Default to incorrect look if N/A or 0
            if (isScored) {
                scoreLabel = isCorrect
                    ? 'Scored (Correct)'
                    : 'Scored (Incorrect)';
                scoreClass = isCorrect ? highlightCorrect : highlightIncorrect;
            } else if (
                question.type === 'fill_blank' &&
                correctAnswerOption !== 'N/A'
            ) {
                // For automated types, if unscored, it's generally incorrect or awaiting auto-grading run
                scoreLabel = 'Awaiting Auto-Score';
                scoreClass = highlightNeutral;
            } else if (question.type === 'short_answer') {
                scoreLabel = 'Needs Manual Review';
                scoreClass = 'bg-yellow-100 text-yellow-800 border-yellow-300';
            }

            return (
                <div className="space-y-4">
                    <p
                        className={`${textBase} mb-2`}
                        dangerouslySetInnerHTML={questionTextHtml}
                    ></p>

                    <Card className="border border-gray-200 shadow-none">
                        <CardContent className="space-y-3 p-4">
                            <div className="flex items-start justify-between">
                                <span className="text-sm font-medium text-gray-500">
                                    Points:{' '}
                                    {isScored
                                        ? `${pointsEarned} / ${maxPoint.toFixed(2)}`
                                        : 'N/A'}
                                </span>
                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${scoreClass}`}
                                >
                                    {scoreLabel}
                                </span>
                            </div>

                            <Separator className="my-2" />

                            {/* Student Answer */}
                            <div className="space-y-1">
                                <p className="text-sm font-semibold text-gray-700">
                                    Your Submission:
                                </p>
                                <div
                                    className={`rounded-lg border p-3 ${highlightNeutral} whitespace-pre-wrap`}
                                >
                                    {studentText}
                                </div>
                            </div>

                            {/* Correct Answer (Only show for fill_blank/auto-scored types) */}
                            {question.type === 'fill_blank' &&
                                correctAnswerOption !== 'N/A' && (
                                    <div className="space-y-1">
                                        <p className="text-sm font-semibold text-green-700">
                                            Expected Answer:
                                        </p>
                                        <div
                                            className={`rounded-lg border p-3 ${highlightCorrect} whitespace-pre-wrap`}
                                        >
                                            {correctAnswerOption}
                                        </div>
                                    </div>
                                )}
                        </CardContent>
                    </Card>
                </div>
            );

        case 'matching':
            // Matching question involves a list of student-submitted pairings.

            // 1. Map: Left Side Text -> Correct Right Side Match Text
            const correctPairings = question.options.reduce((acc, opt) => {
                // Use match_key as the correct match for the option_text
                acc[opt.option_text] = opt.match_key;
                return acc;
            }, {});

            // 2. Map: Left Side Text -> {submitted: string, correct: string}
            const studentPairings = answers
                .map((answer) => {
                    const leftOption = question.options.find(
                        (opt) => opt.id === answer.option_id,
                    );
                    if (leftOption) {
                        const leftText = leftOption.option_text;
                        const submitted = answer.answer_text;
                        const correct = correctPairings[leftText];
                        const isMatchCorrect = submitted === correct;

                        return {
                            leftText,
                            submitted,
                            correct,
                            isMatchCorrect,
                        };
                    }
                    return null;
                })
                .filter((p) => p !== null);

            // Calculate scoring details
            const totalMatchingPoints = parseFloat(question.point);
            const matchesCorrect = studentPairings.filter(
                (p) => p.isMatchCorrect,
            ).length;
            const matchesTotal = studentPairings.length;
            const pointsPerMatch =
                matchesTotal > 0 ? totalMatchingPoints / matchesTotal : 0;
            const matchingPointsEarned = matchesCorrect * pointsPerMatch; // Calculate earned points

            // Determine scoring status badge
            const isMatchingScored = answers.some(
                (a) => a.points_earned !== null,
            ); // Check if any part was scored
            let matchingScoreLabel = 'Awaiting Auto-Score';
            let matchingScoreClass = highlightNeutral;
            if (isMatchingScored || matchesTotal > 0) {
                // Assume scored if we have answers and can calculate matches
                if (matchesCorrect === matchesTotal) {
                    matchingScoreLabel = 'Fully Correct';
                    matchingScoreClass = highlightCorrect;
                } else if (matchesCorrect > 0) {
                    matchingScoreLabel = 'Partially Correct';
                    matchingScoreClass =
                        'bg-yellow-100 text-yellow-800 border-yellow-300';
                } else {
                    matchingScoreLabel = 'Incorrect';
                    matchingScoreClass = highlightIncorrect;
                }
            }

            return (
                <div className="space-y-4">
                    <p
                        className={`${textBase} mb-2`}
                        dangerouslySetInnerHTML={questionTextHtml}
                    ></p>

                    <Card className="border border-gray-200 shadow-none">
                        <CardContent className="space-y-4 p-4">
                            <div className="flex items-start justify-between">
                                <span className="text-sm font-medium text-gray-500">
                                    Points: {matchingPointsEarned.toFixed(2)} /{' '}
                                    {totalMatchingPoints.toFixed(2)}
                                </span>
                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${matchingScoreClass}`}
                                >
                                    {matchingScoreLabel}
                                </span>
                            </div>

                            <Separator className="my-2" />

                            <div className="mb-2 text-sm font-semibold text-gray-700">
                                Submitted Matches ({matchesCorrect}/
                                {matchesTotal} correct):
                            </div>
                            <div className="grid gap-3">
                                {studentPairings.map((pairing, index) => (
                                    <div
                                        key={index}
                                        // Highlight the container based on correctness
                                        className={`flex flex-col justify-between rounded-lg border p-4 shadow-sm transition duration-150 sm:flex-row ${pairing.isMatchCorrect ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}`}
                                    >
                                        {/* Left Side (Question Part) */}
                                        <div className="mb-2 min-w-0 flex-1 pr-4 sm:mb-0">
                                            <p className="truncate font-medium text-gray-800">
                                                {pairing.leftText}
                                            </p>
                                        </div>

                                        {/* Right Side (Submitted/Correct Answer) */}
                                        <div className="flex-shrink-0 space-y-1 text-right">
                                            <div
                                                className={`rounded-md border p-1 text-left font-mono text-sm ${pairing.isMatchCorrect ? highlightCorrect : highlightIncorrect}`}
                                            >
                                                <span className="mr-2 font-bold">
                                                    Submitted:
                                                </span>{' '}
                                                {pairing.submitted}
                                            </div>
                                            {!pairing.isMatchCorrect && (
                                                <div
                                                    className={`rounded-md border p-1 text-left text-xs ${highlightCorrect} mt-1 opacity-80`}
                                                >
                                                    <span className="mr-2 font-bold text-green-700">
                                                        Correct:
                                                    </span>{' '}
                                                    {pairing.correct}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            );

        default:
            return (
                <p className="text-red-500">
                    Unsupported question type: {question.type}
                </p>
            );
    }
};

/**
 * Main component for scoring the student assessment attempt.
 * @param {{ assessment: Assessment, attempt: Attempt }} props
 */
export default function StudentAssessmentAttemptScoring({
    assessment,
    attempt,
}) {
    // 1. Calculate Total Max Score
    const totalMaxScore = assessment.questions.reduce(
        (sum, q) => sum + parseFloat(q.point),
        0,
    );
    const attemptScore = parseFloat(attempt.sub_score).toFixed(2);

    // 2. Map answers by question_id for easy lookup
    const answersByQuestionId = attempt.answers.reduce((acc, answer) => {
        const qId = answer.question_id;
        if (!acc[qId]) {
            acc[qId] = [];
        }
        acc[qId].push(answer);
        return acc;
    }, {});

    const formatDate = (date) =>
        date ? dayjs(date).format('YYYY-MM-DD HH:mm') : '—';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Scoring: ${assessment.title}`} />

            <div className="mx-auto max-w-4xl space-y-8 p-4">
                {/* --- Assessment & Attempt Summary Card --- */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            {assessment.title}
                            <span className="rounded-full bg-blue-100 px-3 py-1 text-lg font-bold text-blue-600 shadow-md">
                                {attempt.status.toUpperCase()}
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-x-12 gap-y-4 sm:grid-cols-2">
                            <DetailItem
                                label="Assessment Type"
                                value={
                                    assessment.type.charAt(0).toUpperCase() +
                                    assessment.type.slice(1)
                                }
                            />
                            <DetailItem
                                label="Total Questions"
                                value={assessment.questions.length}
                            />
                            <DetailItem
                                label="Total Max Points"
                                value={totalMaxScore.toFixed(2)}
                            />
                            <DetailItem
                                label="Attempt Score"
                                value={`${attemptScore} / ${totalMaxScore.toFixed(2)}`}
                            />
                            <DetailItem
                                label="Start Time"
                                value={formatDate(attempt.started_at)}
                            />
                            <DetailItem
                                label="Completion Time"
                                value={formatDate(attempt.completed_at)}
                            />
                        </div>
                    </CardContent>
                </Card>

                <h3 className="pt-6 text-2xl font-extrabold text-gray-900">
                    Question Breakdown
                </h3>

                {/* --- Questions and Answers Section --- */}
                <div className="space-y-10">
                    {assessment.questions.map((question, index) => {
                        const questionAnswers =
                            answersByQuestionId[question.id] || [];
                        const displayIndex = index + 1;

                        return (
                            <Card
                                key={question.id}
                                className="border-l-4 border-blue-500 shadow-xl"
                            >
                                <CardHeader className="flex flex-row items-center justify-between rounded-t-xl bg-gray-50">
                                    <h4 className="text-lg font-bold text-gray-800">
                                        Question {displayIndex}:
                                    </h4>
                                    <div className="text-sm font-medium text-gray-600">
                                        Max Points:{' '}
                                        <span className="font-semibold text-blue-700">
                                            {parseFloat(question.point).toFixed(
                                                2,
                                            )}
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <QuestionRenderer
                                        question={question}
                                        answers={questionAnswers}
                                    />
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </AppLayout>
    );
}
