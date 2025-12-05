import React, { useMemo, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import {route} from 'ziggy-js';
import dayjs from 'dayjs';
import AppLayout from '@/layouts/app-layout';
import { Badge, Card, CardContent, CardHeader } from './component/Card';

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
            const correctOption = question.options.find(
                opt => opt.option_text.trim().toLowerCase() === (answer.answer_text || '').trim().toLowerCase()
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
            status = correctCount === totalPairs ? 'correct' : correctCount === 0 ? 'incorrect' : 'partial';
            break;
        }
        default:
            break;
    }

    return { earnedPoints: parseFloat(earnedPoints.toFixed(2)), maxPoints: parseFloat(maxPoints.toFixed(2)), status };
};

// --- BADGES ---
const getStatusBadge = (status) => {
    switch (status) {
        case 'correct': return <Badge className="border border-green-200 bg-green-100 text-green-700">Correct</Badge>;
        case 'incorrect': return <Badge className="border border-red-200 bg-red-100 text-red-700">Incorrect</Badge>;
        case 'partial': return <Badge className="border border-yellow-200 bg-yellow-100 text-yellow-800">Partially Correct</Badge>;
        case 'review': return <Badge className="border border-orange-200 bg-orange-100 text-orange-800">Needs Review</Badge>;
        default: return <Badge className="border border-gray-200 bg-gray-100 text-gray-600">No Answer</Badge>;
    }
};

// --- QUESTION COMPONENTS ---
const MatchingQuestion = ({ question, answers }) => (
    <div className="mt-4 grid gap-3">
        {question.options.map(option => {
            const answer = answers.find(a => a.option_id === option.id);
            const studentSelection = answer?.answer_text || '—';
            const isPairCorrect = studentSelection === option.match_key;

            return (
                <div
                    key={option.id}
                    className={`flex flex-col items-start justify-between rounded-lg border p-3 sm:flex-row sm:items-center ${
                        isPairCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                    }`}
                >
                    <div className="mb-2 w-full font-medium text-gray-700 sm:mb-0 sm:w-1/2">{option.option_text}</div>
                    <div className="mx-4 hidden text-gray-400 sm:block">→</div>
                    <div className="flex w-full flex-col items-end gap-1 sm:w-1/2">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase">Student:</span>
                            <span className={`font-medium ${isPairCorrect ? 'text-green-700' : 'text-red-700'}`}>{studentSelection}</span>
                        </div>
                        {!isPairCorrect && <div className="rounded bg-green-100 px-2 py-1 text-xs text-green-700">Correct: {option.match_key}</div>}
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
                let styleClass = 'border-gray-200 bg-white hover:bg-gray-50';
                if (isSelected && isCorrectOption) styleClass = 'border-green-300 bg-green-50 ring-1 ring-green-300';
                else if (isSelected && !isCorrectOption) styleClass = 'border-red-300 bg-red-50 ring-1 ring-red-300';
                else if (!isSelected && isCorrectOption) styleClass = 'border-green-300 bg-white ring-1 ring-green-300 border-dashed';

                return (
                    <div key={option.id} className={`flex items-center rounded-lg border p-3 transition-all ${styleClass}`}>
                        <div className={`mr-3 flex h-5 w-5 items-center justify-center rounded-full border ${
                            isSelected ? (isCorrectOption ? 'border-green-500 bg-green-500 text-white' : 'border-red-500 bg-red-500 text-white') : 'border-gray-300'
                        }`}>
                            {isSelected && (
                                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                                </svg>
                            )}
                        </div>
                        <span className={`flex-1 ${isCorrectOption ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>{option.option_text}</span>
                        {isCorrectOption && !isSelected && <span className="px-2 text-xs font-medium text-green-600">Correct Answer</span>}
                    </div>
                );
            })}
        </div>
    );
};

const TextQuestion = ({ question, answers, onTeacherScore }) => {
    const answer = answers[0] || {};
    const studentText = answer.answer_text || '';
    const correctOptions = question.options.map(o => o.option_text);
    const isAutoCorrect = correctOptions.some(opt => opt.trim().toLowerCase() === studentText.trim().toLowerCase());
    const [manualScore, setManualScore] = useState(answer.manual_score ?? '');
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
                <label className="mb-1 block text-sm font-medium text-gray-500">Your Answer</label>
                <div className={`rounded-md border p-3 ${isAutoCorrect ? 'border-green-200 bg-green-50 text-green-800' : 'border-red-200 bg-red-50 text-red-800'}`}>
                    {studentText || <span className="text-gray-400 italic">No answer submitted</span>}
                </div>
            </div>
            {!isAutoCorrect && correctOptions.length > 0 && (
                <div>
                    <label className="mb-1 block text-sm font-medium text-green-700">Expected Answer(s)</label>
                    <div className="rounded-md border border-green-200 bg-white p-3 text-gray-700">
                        <ul className="list-inside list-disc">{correctOptions.map((opt, i) => <li key={i}>{opt}</li>)}</ul>
                    </div>
                </div>
            )}
            <div className="border-t border-gray-100 pt-4">
                <label className="mb-2 block text-sm font-semibold text-gray-800">Teacher Score (0 - {maxPoints})</label>
                <input type="number" min="0" max={maxPoints} step="0.25" value={manualScore} onChange={e => handleScoreInput(e.target.value)} className="w-32 rounded-md border bg-white p-2 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500" placeholder="Enter score" />
                {manualScore !== '' && <p className="mt-1 text-xs text-green-600">Score saved: {manualScore} / {maxPoints}</p>}
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

    return (
        <div className="h-full flex flex-col">
            <div className="mb-4 text-lg leading-relaxed font-medium text-gray-900" dangerouslySetInnerHTML={{ __html: question.question_text }} />
            <div className="flex-grow">
                {question.type === 'matching' && <MatchingQuestion question={question} answers={answers} />}
                {(question.type === 'multiple_choice' || question.type === 'true_false') && <ChoiceQuestion question={question} answers={answers} />}
                {(question.type === 'short_answer' || question.type === 'fill_blank') && <TextQuestion question={question} answers={answers} onTeacherScore={onTeacherScore} />}
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                <div className="flex items-center gap-3">
                    {getStatusBadge(finalStatus)}
                    <span className="text-sm text-gray-500">
                        Score: <span className="font-bold text-gray-900">{finalScore}</span> / {baseScore.maxPoints}
                    </span>
                </div>
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---
export default function StudentAssessmentAttemptScoring({ assessment, attempt }) {
    const { data, setData, post, processing } = useForm({
        scores: attempt.answers.map(a => ({ question_id: a.question_id, manual_score: a.manual_score ?? 0 })),
    });

    const handleTeacherScore = (questionId, score) => {
        setData('scores', prev => prev.map(s => s.question_id === questionId ? { ...s, manual_score: score } : s));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('instructor.classes.subjects.assessments.students.store', {
            class: 1,
            subject: 1,
            assessment: assessment.id,
            student: attempt.student_id,
        }), {
            onSuccess: () => alert('Scores submitted successfully!'),
            onError: () => alert('Failed to submit scores.'),
        });
    };

    const answersByQuestionId = useMemo(() => {
        return data.scores.reduce((acc, s) => {
            acc[s.question_id] = [{ question_id: s.question_id, manual_score: s.manual_score }];
            return acc;
        }, {});
    }, [data.scores]);

    const totalMaxScore = assessment.questions.reduce((sum, q) => sum + parseFloat(q.point), 0);
    const totalEarnedScore = assessment.questions.reduce((sum, q) => {
        const ans = answersByQuestionId[q.id] || [];
        return sum + (ans[0]?.manual_score ?? 0);
    }, 0);

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Assessments', href: '/assessments' },
        { title: assessment.title, href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Results: ${assessment.title}`} />
            <form onSubmit={handleSubmit} className="mx-auto max-w-5xl space-y-8 pb-12 mt-6">
                {/* Summary */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-900">{assessment.title}</h1>
                            <p className="mt-2 max-w-2xl text-gray-500">{assessment.description}</p>
                            <div className="mt-4 flex flex-wrap gap-4">
                                <div className="flex items-center text-sm text-gray-600">
                                    <span className="mr-2 font-medium">Status:</span>
                                    <span className="rounded-md bg-blue-100 px-2 py-0.5 text-xs font-bold tracking-wide text-blue-700 uppercase">{attempt.status}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <span className="mr-2 font-medium">Submitted:</span>
                                    {attempt.updated_at ? dayjs(attempt.updated_at).format('MMM D, YYYY h:mm A') : 'N/A'}
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="sticky bottom-6 z-50 flex min-w-[140px] flex-col items-center rounded-xl border border-gray-100 bg-gray-50 p-4 shadow-lg transition-all duration-500 ease-in-out">
                                <span className="mb-1 text-xs font-semibold tracking-wider text-gray-500 uppercase">Total Score</span>
                                <div className="text-4xl font-black text-gray-900">
                                    {totalEarnedScore.toFixed(0)}
                                    <span className="text-lg font-medium text-gray-400">/{totalMaxScore.toFixed(0)}</span>
                                </div>
                                <div className="mt-1 text-xs font-medium text-green-600">{((totalEarnedScore / totalMaxScore) * 100).toFixed(1)}%</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Questions */}
                <div className="space-y-6">
                    <h3 className="px-2 text-xl font-bold text-gray-900">Detailed Breakdown</h3>
                    {assessment.questions.map((q, index) => (
                        <Card key={q.id} className="transition-shadow hover:shadow-md">
                            <CardHeader className="flex items-center justify-between py-3">
                                <span className="font-bold text-gray-500">Question {index + 1}</span>
                                <span className="rounded border bg-white px-2 py-1 font-mono text-xs text-gray-400">{q.type.replace('_', ' ').toUpperCase()}</span>
                            </CardHeader>
                            <CardContent>
                                <QuestionRenderer question={q} answers={answersByQuestionId[q.id] || []} onTeacherScore={handleTeacherScore} />
                            </CardContent>
                        </Card>
                    ))}

                    <div className="flex justify-end">
                        <button type="submit" disabled={processing} className="rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 transition-colors disabled:opacity-50">
                            Submit Scores
                        </button>
                    </div>
                </div>
            </form>
        </AppLayout>
    );
}
