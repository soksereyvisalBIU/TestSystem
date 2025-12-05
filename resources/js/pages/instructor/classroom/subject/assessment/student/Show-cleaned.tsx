import React, { useMemo, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { route } from 'ziggy-js';

// ShadCN components (assumes you have these exports available)
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// --- SCORING UTILITIES ---
const calculateQuestionScore = (question, answers = []) => {
  const maxPoints = parseFloat(question.point || 0);
  let earnedPoints = 0;
  let status = 'unanswered';

  if (answers.length === 0) return { earnedPoints, maxPoints, status };
  const answer = answers[0];

  switch (question.type) {
    case 'true_false':
    case 'multiple_choice': {
      const correctOption = question.options.find((opt) => opt.is_correct === 1);
      if (correctOption && answer.answer_text === correctOption.option_text) {
        earnedPoints = maxPoints;
        status = 'correct';
      } else status = 'incorrect';
      break;
    }
    case 'fill_blank':
    case 'short_answer': {
      const correctOption = question.options.find(
        (opt) => opt.option_text.trim().toLowerCase() === (answer.answer_text || '').trim().toLowerCase(),
      );
      if (correctOption) {
        earnedPoints = maxPoints;
        status = 'correct';
      } else status = 'review';
      break;
    }
    case 'matching': {
      const totalPairs = question.options.length;
      const pointPerPair = totalPairs ? maxPoints / totalPairs : 0;
      let correctCount = 0;
      question.options.forEach((opt) => {
        const ans = answers.find((a) => a.option_id === opt.id);
        if (ans && ans.answer_text === opt.match_key) correctCount++;
      });
      earnedPoints = correctCount * pointPerPair;
      status =
        correctCount === totalPairs ? 'correct' : correctCount === 0 ? 'incorrect' : 'partial';
      break;
    }
    default:
      break;
  }

  return {
    earnedPoints: +earnedPoints.toFixed(2),
    maxPoints: +maxPoints.toFixed(2),
    status,
  };
};

const getStatusBadge = (status) => {
  const text = {
    correct: 'Correct',
    incorrect: 'Incorrect',
    partial: 'Partially Correct',
    review: 'Needs Review',
    default: 'No Answer',
  };

  const variant = status === 'correct' ? 'default' : status === 'incorrect' ? 'destructive' : status === 'partial' ? 'warning' : 'secondary';

  // Using Badge but styling/variants depend on your ShadCN setup
  return <Badge>{text[status] || text.default}</Badge>;
};

// --- QUESTION COMPONENTS ---
const MatchingQuestion = ({ question, answers }) => (
  <div className="mt-4 grid gap-3">
    {question.options.map((option) => {
      const answer = answers.find((a) => a.option_id === option.id);
      const studentSelection = answer?.answer_text || '—';
      const isCorrect = studentSelection === option.match_key;
      return (
        <Card key={option.id} className={`overflow-hidden ${isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
          <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="w-full sm:w-1/2 font-medium text-gray-700">{option.option_text}</div>
            <div className="hidden sm:block text-gray-400">→</div>
            <div className="flex w-full sm:w-1/2 flex-col items-end gap-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase">Student:</span>
                <span className={`font-medium ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>{studentSelection}</span>
              </div>
              {!isCorrect && (
                <div className="rounded bg-green-100 px-2 py-1 text-xs text-green-700">Correct: {option.match_key}</div>
              )}
            </div>
          </CardContent>
        </Card>
      );
    })}
  </div>
);

const ChoiceQuestion = ({ question, answers }) => {
  const studentSelection = answers[0]?.answer_text;
  return (
    <div className="mt-4 space-y-2">
      {question.options.map((option) => {
        const isSelected = studentSelection === option.option_text;
        const isCorrect = option.is_correct === 1;
        let borderClass = 'border-gray-200 bg-white';
        if (isSelected && isCorrect) borderClass = 'border-green-300 bg-green-50 ring-1 ring-green-300';
        else if (isSelected && !isCorrect) borderClass = 'border-red-300 bg-red-50 ring-1 ring-red-300';
        else if (!isSelected && isCorrect) borderClass = 'border-green-300 bg-white ring-1 ring-green-300 border-dashed';

        return (
          <Card key={option.id} className={`p-3 transition-all ${borderClass}`}>
            <CardContent className="flex items-center gap-3">
              <div className={`mr-3 flex h-5 w-5 items-center justify-center rounded-full border ${isSelected ? (isCorrect ? 'border-green-500 bg-green-500 text-white' : 'border-red-500 bg-red-500 text-white') : 'border-gray-300'}`}>
                {isSelected && (
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div className={`flex-1 ${isCorrect ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>{option.option_text}</div>
              {isCorrect && !isSelected && <div className="px-2 text-xs font-medium text-green-600">Correct Answer</div>}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

const TextQuestion = ({ question, answers, onTeacherScore }) => {
  const studentText = answers[0]?.answer_text || '';
  const correctOptions = question.options.map((o) => o.option_text);
  const isAutoCorrect = correctOptions.some((opt) => opt.trim().toLowerCase() === studentText.trim().toLowerCase());

  const [manualScore, setManualScore] = useState(answers[0]?.manual_score ?? '');
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
        <Label className="mb-1">Your Answer</Label>
        <div className={`rounded-md border p-3 ${isAutoCorrect ? 'border-green-200 bg-green-50 text-green-800' : 'border-red-200 bg-red-50 text-red-800'}`}>
          {studentText || <em className="text-gray-400">No answer submitted</em>}
        </div>
      </div>

      {!isAutoCorrect && correctOptions.length > 0 && (
        <div>
          <Label className="mb-1 text-green-700">Expected Answer(s)</Label>
          <Card className="rounded-md border-green-200 bg-white">
            <CardContent>
              <ul className="list-inside list-disc">
                {correctOptions.map((opt, i) => (
                  <li key={i}>{opt}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}

      <Separator />

      <div>
        <Label className="mb-2">Teacher Score (0 - {maxPoints})</Label>
        <Input
          type="number"
          min={0}
          max={maxPoints}
          step={0.25}
          value={manualScore}
          onChange={(e) => handleScoreInput((e.target as HTMLInputElement).value)}
          className="w-32"
          placeholder="Enter score"
        />
        {manualScore !== '' && (
          <p className="mt-1 text-xs text-green-600">Score saved: {manualScore} / {maxPoints}</p>
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

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 text-lg leading-relaxed font-medium text-gray-900" dangerouslySetInnerHTML={{ __html: question.question_text }} />
      <div className="flex-grow">
        {question.type === 'matching' && <MatchingQuestion question={question} answers={answers} />}
        {(question.type === 'multiple_choice' || question.type === 'true_false') && <ChoiceQuestion question={question} answers={answers} />}
        {(question.type === 'short_answer' || question.type === 'fill_blank') && (
          <TextQuestion question={question} answers={answers} onTeacherScore={onTeacherScore} />
        )}
      </div>

      <Separator />

      <div className="mt-6 flex items-center justify-between pt-4">
        <div className="flex items-center gap-3">
          {getStatusBadge(finalStatus)}
          <div className="text-sm text-gray-500">Score: <span className="font-bold text-gray-900">{finalScore}</span> / {baseScore.maxPoints}</div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---
export default function StudentAssessmentAttemptScoring({ assessment, attempt }) {
  const [answersState, setAnswersState] = useState(attempt.answers || []);

  const answersByQuestionId = useMemo(() => {
    return answersState.reduce((acc, a) => {
      acc[a.question_id] = acc[a.question_id] || [];
      acc[a.question_id].push(a);
      return acc;
    }, {});
  }, [answersState]);

  const handleTeacherScore = (questionId, score) => {
    setAnswersState((prev) => prev.map((a) => (a.question_id === questionId ? { ...a, manual_score: score } : a)));
  };

  const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

  const handleSubmit = async () => {
    const payload = answersState.map((a) => ({ question_id: a.question_id, manual_score: a.manual_score ?? 0 }));

    try {
      await fetch(
        route('instructor.classes.subjects.assessments.students.store', {
          class: 1,
          subject: 1,
          assessment: assessment.id,
          student: attempt.student_id,
        }),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-CSRF-TOKEN': token || '',
          },
          body: JSON.stringify({ scores: payload }),
        },
      );

      toast.success('Scores submitted successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit scores.');
    }
  };

  const totalMaxScore = assessment.questions.reduce((sum, q) => sum + parseFloat(q.point || 0), 0);
  const totalEarnedScore = assessment.questions.reduce((sum, q) => {
    const ans = answersByQuestionId[q.id] || [];
    const manual = ans[0]?.manual_score;
    return sum + (manual != null ? manual : calculateQuestionScore(q, ans).earnedPoints);
  }, 0);

  const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Assessments', href: '/assessments' },
    { title: assessment.title, href: '#' },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Results: ${assessment.title}`} />

      <div className="mx-auto mt-6 max-w-5xl space-y-8 pb-12">
        {/* Summary Card */}
        <Card className="rounded-2xl border bg-white p-6 shadow-sm">
          <CardContent className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">{assessment.title}</h1>
              <p className="mt-2 max-w-2xl text-gray-500">{assessment.description}</p>

              <div className="mt-4 flex flex-wrap gap-4">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="mr-2 font-medium">Status:</span>
                  <Badge className="uppercase">{attempt.status}</Badge>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="mr-2 font-medium">Submitted:</span>
                  <span>{attempt.updated_at ? dayjs(attempt.updated_at).format('MMM D, YYYY h:mm A') : 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="sticky bottom-6 z-50 flex min-w-[140px] flex-col items-center rounded-xl border bg-gray-50 p-4 shadow-lg">
                <span className="mb-1 text-xs font-semibold tracking-wider text-gray-500 uppercase">Total Score</span>
                <div className="text-4xl font-black text-gray-900">
                  {totalEarnedScore.toFixed(0)}
                  <span className="text-lg font-medium text-gray-400">/{totalMaxScore.toFixed(0)}</span>
                </div>
                <div className="mt-1 text-xs font-medium text-green-600">{((totalEarnedScore / totalMaxScore) * 100).toFixed(1)}%</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions */}
        <div className="space-y-6">
          <h3 className="px-2 text-xl font-bold text-gray-900">Detailed Breakdown</h3>

          {assessment.questions.map((question, index) => (
            <Card key={question.id} className="transition-shadow hover:shadow-md">
              <CardHeader className="flex items-center justify-between py-3">
                <div className="font-bold text-gray-500">Question {index + 1}</div>
                <div className="rounded border bg-white px-2 py-1 font-mono text-xs text-gray-400">{question.type.replace('_', ' ').toUpperCase()}</div>
              </CardHeader>

              <CardContent>
                <QuestionRenderer question={question} answers={answersByQuestionId[question.id] || []} onTeacherScore={handleTeacherScore} />
              </CardContent>

              <CardFooter className="flex justify-end">
                {/* footer intentionally left minimal — teacher actions could go here */}
              </CardFooter>
            </Card>
          ))}

          <div className="flex justify-end">
            <Button onClick={handleSubmit}>Submit Scores</Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
