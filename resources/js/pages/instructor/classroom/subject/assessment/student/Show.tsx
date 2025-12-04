import { Head } from "@inertiajs/react";
import dayjs from "dayjs";
import React from 'react';

// --- MOCK UI COMPONENTS ---
const Card = ({ children, className = '' }) => <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${className}`}>{children}</div>;
const CardHeader = ({ children, className = '' }) => <div className={`px-6 py-4 border-b border-gray-100 bg-gray-50/50 ${className}`}>{children}</div>;
const CardTitle = ({ children, className = '' }) => <h2 className={`text-xl font-bold text-gray-800 ${className}`}>{children}</h2>;
const CardContent = ({ children, className = '' }) => <div className={`p-6 ${className}`}>{children}</div>;
const Badge = ({ children, className = '' }) => <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>{children}</span>;

const AppLayout = ({ breadcrumbs, children }) => (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans">
        <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
            {breadcrumbs.map((item, index) => (
                <React.Fragment key={index}>
                    <a href={item.href} className="text-blue-600 hover:text-blue-800 transition-colors">{item.title}</a>
                    {index < breadcrumbs.length - 1 && <span className="text-gray-400">/</span>}
                </React.Fragment>
            ))}
        </nav>
        {children}
    </div>
);

// --- SCORING UTILITIES ---
const calculateQuestionScore = (question, answers) => {
    const maxPoints = parseFloat(question.point || 0);
    let earnedPoints = 0;
    let status = 'unanswered';
    if (!answers || answers.length === 0) return { earnedPoints, maxPoints, status };

    switch (question.type) {
        case 'true_false':
        case 'multiple_choice': {
            const answer = answers[0];
            const correctOption = question.options.find(opt => opt.is_correct === 1);
            if (correctOption && answer.answer_text === correctOption.option_text) {
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
            const correctOption = question.options.find(opt =>
                opt.option_text.trim().toLowerCase() === (answer.answer_text || '').trim().toLowerCase()
            );
            if (correctOption) {
                earnedPoints = maxPoints;
                status = 'correct';
            } else {
                status = 'review';
            }
            break;
        }
        case 'matching': {
            const totalPairs = question.options.length;
            const pointPerPair = totalPairs > 0 ? maxPoints / totalPairs : 0;
            let correctCount = 0;
            question.options.forEach(opt => {
                const answer = answers.find(a => a.option_id === opt.id);
                if (answer && answer.answer_text === opt.match_key) correctCount++;
            });
            earnedPoints = correctCount * pointPerPair;
            status = correctCount === totalPairs ? 'correct' : (correctCount === 0 ? 'incorrect' : 'partial');
            break;
        }
        default: break;
    }

    return { earnedPoints: parseFloat(earnedPoints.toFixed(2)), maxPoints: parseFloat(maxPoints.toFixed(2)), status };
};

const getStatusBadge = (status) => {
    switch (status) {
        case 'correct': return <Badge className="bg-green-100 text-green-700 border border-green-200">Correct</Badge>;
        case 'incorrect': return <Badge className="bg-red-100 text-red-700 border border-red-200">Incorrect</Badge>;
        case 'partial': return <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-200">Partially Correct</Badge>;
        case 'review': return <Badge className="bg-orange-100 text-orange-800 border border-orange-200">Needs Review</Badge>;
        default: return <Badge className="bg-gray-100 text-gray-600 border border-gray-200">No Answer</Badge>;
    }
};

// --- QUESTION COMPONENTS ---
const MatchingQuestion = ({ question, answers }) => (
    <div className="grid gap-3 mt-4">
        {question.options.map(option => {
            const answer = answers.find(a => a.option_id === option.id);
            const studentSelection = answer?.answer_text || "—";
            const isPairCorrect = studentSelection === option.match_key;

            return (
                <div key={option.id} className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 rounded-lg border ${isPairCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="w-full sm:w-1/2 font-medium text-gray-700 mb-2 sm:mb-0">{option.option_text}</div>
                    <div className="hidden sm:block text-gray-400 mx-4">→</div>
                    <div className="w-full sm:w-1/2 flex flex-col items-end gap-1">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 ">Student:</span>
                            <span className={`font-medium ${isPairCorrect ? 'text-green-700' : 'text-red-700'}`}>{studentSelection}</span>
                        </div>
                        {!isPairCorrect && <div className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded">Correct: {option.match_key}</div>}
                    </div>
                </div>
            );
        })}
    </div>
);

const ChoiceQuestion = ({ question, answers }) => {
    const answer = answers[0] || {};
    const studentSelection = answer.answer_text;
    return (
        <div className="mt-4 space-y-2">
            {question.options.map(option => {
                const isSelected = studentSelection === option.option_text;
                const isCorrectOption = option.is_correct === 1;
                let styleClass = "border-gray-200 bg-white hover:bg-gray-50";
                if (isSelected && isCorrectOption) styleClass = "border-green-300 bg-green-50 ring-1 ring-green-300";
                else if (isSelected && !isCorrectOption) styleClass = "border-red-300 bg-red-50 ring-1 ring-red-300";
                else if (!isSelected && isCorrectOption) styleClass = "border-green-300 bg-white ring-1 ring-green-300 border-dashed";

                return (
                    <div key={option.id} className={`flex items-center p-3 rounded-lg border transition-all ${styleClass}`}>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${isSelected ? (isCorrectOption ? 'border-green-500 bg-green-500 text-white' : 'border-red-500 bg-red-500 text-white') : 'border-gray-300'}`}>
                            {isSelected && <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                        </div>
                        <span className={`flex-1 ${isCorrectOption ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>{option.option_text}</span>
                        {isCorrectOption && !isSelected && <span className="text-xs text-green-600 font-medium px-2">Correct Answer</span>}
                    </div>
                );
            })}
        </div>
    );
};

// --- TEXT QUESTION WITH TEACHER MANUAL SCORE ---
const TextQuestion = ({ question, answers, onTeacherScore }) => {
    const answer = answers[0] || {};
    const studentText = answer.answer_text || "";
    const correctOptions = question.options.map(o => o.option_text);
    const isAutoCorrect = correctOptions.some(opt => opt.trim().toLowerCase() === studentText.trim().toLowerCase());

    const [manualScore, setManualScore] = React.useState(answer.manual_score ?? '');

    const maxPoints = parseFloat(question.point || 0);

    const handleScoreInput = (value) => {
        let v = parseFloat(value);
        if (isNaN(v)) v = '';
        if (v > maxPoints) v = maxPoints;
        if (v < 0) v = 0;
        setManualScore(v);
        onTeacherScore?.(question.id, v);
    };

    return (
        <div className="mt-4 space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Your Answer</label>
                <div className={`p-3 rounded-md border ${isAutoCorrect ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                    {studentText || <span className="italic text-gray-400">No answer submitted</span>}
                </div>
            </div>
            {!isAutoCorrect && correctOptions.length > 0 && (
                <div>
                    <label className="block text-sm font-medium text-green-700 mb-1">Expected Answer(s)</label>
                    <div className="p-3 rounded-md border border-green-200 bg-white text-gray-700">
                        <ul className="list-disc list-inside">
                            {correctOptions.map((opt, i) => <li key={i}>{opt}</li>)}
                        </ul>
                    </div>
                </div>
            )}
            <div className="pt-4 border-t border-gray-100">
                <label className="block text-sm font-semibold text-gray-800 mb-2">Teacher Score (0 - {maxPoints})</label>
                <input
                    type="number"
                    min="0"
                    max={maxPoints}
                    step="0.25"
                    value={manualScore}
                    onChange={(e) => handleScoreInput(e.target.value)}
                    className="w-32 p-2 border rounded-md bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter score"
                />
                {manualScore !== '' && (
                    <p className="text-xs text-green-600 mt-1">Score saved: {manualScore} / {maxPoints}</p>
                )}
            </div>
        </div>
    );
};

// --- QUESTION RENDERER ---
const QuestionRenderer = ({ question, answers, onTeacherScore }) => {
    const baseScore = calculateQuestionScore(question, answers);
    const manualScore = answers[0]?.manual_score;
    const finalScore = manualScore != null ? manualScore : baseScore.earnedPoints;
    const finalStatus = manualScore != null ? 'review' : baseScore.status;

    const questionHtml = { __html: question.question_text };

    return (
        <div className="h-full">
            <div className="flex flex-col h-full">
                <div className="mb-4 text-gray-900 font-medium text-lg leading-relaxed" dangerouslySetInnerHTML={questionHtml} />
                <div className="flex-grow">
                    {question.type === 'matching' && <MatchingQuestion question={question} answers={answers} />}
                    {(question.type === 'multiple_choice' || question.type === 'true_false') && <ChoiceQuestion question={question} answers={answers} />}
                    {(question.type === 'short_answer' || question.type === 'fill_blank') &&
                        <TextQuestion question={question} answers={answers} onTeacherScore={onTeacherScore} />
                    }
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {getStatusBadge(finalStatus)}
                        <span className="text-sm text-gray-500">
                            Score: <span className="font-bold text-gray-900">{finalScore}</span> / {baseScore.maxPoints}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- MAIN PAGE COMPONENT ---
export default function StudentAssessmentAttemptScoring({ assessment, attempt }) {
    const [answersState, setAnswersState] = React.useState(attempt.answers);

    const answersByQuestionId = React.useMemo(() => {
        return answersState.reduce((acc, answer) => {
            if (!acc[answer.question_id]) acc[answer.question_id] = [];
            acc[answer.question_id].push(answer);
            return acc;
        }, {});
    }, [answersState]);

    const handleTeacherScore = (questionId, score) => {
        setAnswersState(prev => prev.map(a => a.question_id === questionId ? { ...a, manual_score: score } : a));
    };

    const totalMaxScore = assessment.questions.reduce((sum, q) => sum + parseFloat(q.point), 0);
    const totalEarnedScore = assessment.questions.reduce((sum, q) => {
        const ans = answersByQuestionId[q.id] || [];
        const manual = ans[0]?.manual_score;
        if (manual != null) return sum + manual;
        return sum + calculateQuestionScore(q, ans).earnedPoints;
    }, 0);

    const breadcrumbs = [
        { title: "Dashboard", href: "/dashboard" },
        { title: "Assessments", href: "/assessments" },
        { title: assessment.title, href: "#" },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Results: ${assessment.title}`} />
            <div className="max-w-5xl mx-auto space-y-8 pb-12">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-900">{assessment.title}</h1>
                            <p className="text-gray-500 mt-2 max-w-2xl">{assessment.description}</p>
                            <div className="flex flex-wrap gap-4 mt-4">
                                <div className="flex items-center text-sm text-gray-600">
                                    <span className="font-medium mr-2">Status:</span>
                                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wide">{attempt.status}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <span className="font-medium mr-2">Submitted:</span>
                                    {attempt.updated_at ? dayjs(attempt.updated_at).format('MMM D, YYYY h:mm A') : 'N/A'}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-center bg-gray-50 p-4 rounded-xl border border-gray-100 min-w-[140px]">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Score</span>
                            <div className="text-4xl font-black text-gray-900">
                                {totalEarnedScore.toFixed(0)}<span className="text-lg text-gray-400 font-medium">/{totalMaxScore.toFixed(0)}</span>
                            </div>
                            <div className="text-xs font-medium text-green-600 mt-1">
                                {((totalEarnedScore / totalMaxScore) * 100).toFixed(1)}%
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 px-2">Detailed Breakdown</h3>
                    {assessment.questions.map((question, index) => (
                        <Card key={question.id} className="transition-shadow hover:shadow-md">
                            <CardHeader className="flex justify-between items-center py-3">
                                <span className="font-bold text-gray-500">Question {index + 1}</span>
                                <span className="text-xs font-mono text-gray-400 bg-white px-2 py-1 border rounded">{question.type.replace('_', ' ').toUpperCase()}</span>
                            </CardHeader>
                            <CardContent>
                                <QuestionRenderer
                                    question={question}
                                    answers={answersByQuestionId[question.id] || []}
                                    onTeacherScore={handleTeacherScore}
                                />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
