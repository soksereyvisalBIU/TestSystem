import QuestionRenderer from '@/components/student/assessment/QuestionRenderer';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { route } from 'ziggy-js';

interface AttemptProps {
    assessment: any;
    questions: any;
    studentAssessment: any;
    studentAssessmentAttempt: any;
    student_assessment_attempt_id: any;
}

export default function Attempt({ assessment, questions, studentAssessment , student_assessment_attempt_id }: AttemptProps) {
    const { props } = usePage();
    const subject = assessment.subjects[0];
    console.log(student_assessment_attempt_id)

    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [openConfirm, setOpenConfirm] = useState(false);
    const [openSecondConfirm, setOpenSecondConfirm] = useState(false);
    const [unanswered, setUnanswered] = useState<any[]>([]);

    const form = useForm({
        answers: {},
        user_id: props?.auth?.user?.id,
    });

    const updateAnswer = (questionId: string, value: any) => {
        setAnswers((prev) => ({ ...prev, [questionId]: value }));
    };

    const doSubmit = () => {
        form.transform((data) => ({
            ...data,
            answers: answers,
        }));

        form.post(
            route('student.classes.subjects.assessments.attempt.store', {
                class_id: subject.class_id,
                subject_id: subject.id,
                assessment_id: assessment.id,
                student_assessment_attempt_id: studentAssessmentAttempt.id,
            }),
        );
    };

    const handleSubmit = () => {
        const missing = questions.data.filter(
            (q) => answers[q.id] === undefined || answers[q.id] === null,
        );

        setUnanswered(missing);

        if (missing.length > 0) {
            setOpenSecondConfirm(true);
            return;
        }

        doSubmit();
    };

    return (
        <div className="mx-auto max-w-4xl space-y-2 px-4 py-10">
            <header className="space-y-2 text-center">
                <h1 className="text-3xl font-semibold">{assessment.title}</h1>
                <p className="text-muted-foreground">{assessment.description}</p>

                <p className="text-sm text-muted-foreground">
                    Duration: {assessment.duration ?? 'N/A'} mins • Max Attempts:{' '}
                    {assessment.max_attempts}
                </p>
            </header>

            {/* QUESTIONS */}
            <div className="space-y-4">
                {questions?.data?.map((q, index) => (
                    <QuestionRenderer
                        key={q.id}
                        question={q}
                        index={index}
                        answer={answers[q.id]}
                        onAnswerChange={updateAnswer}
                    />
                ))}
            </div>

            {/* SUBMIT BUTTON */}
            <div className="flex justify-end">
                <Button
                    onClick={() => setOpenConfirm(true)}
                    size="lg"
                    className="px-6"
                >
                    Submit Assessment
                </Button>
            </div>

            {/* FIRST CONFIRMATION DIALOG */}
            <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
                <DialogContent className="max-w-lg">
                    <DialogHeader className="justify-center sm:text-center">
                        <img
                            className="mx-auto max-w-32 rounded-full p-2"
                            src="/assets/img/assessment/submit.gif"
                            alt="Confirm Submit"
                        />

                        <DialogTitle>Confirm Submission</DialogTitle>
                        <p className="text-sm text-muted-foreground">
                            Review your answers before submitting.
                        </p>
                    </DialogHeader>

                    <div className="max-h-64 overflow-y-auto rounded-md border bg-muted/30 p-3">
                        {questions?.data?.map((q, index) => (
                            <div key={q.id} className="mb-4">
                                <p className="text-xs font-medium opacity-75">
                                    {index + 1}. {q.question}
                                </p>

                                <div className="text-sm text-muted-foreground">
                                    {answers[q.id] ? (
                                        <pre className="mt-1 rounded bg-muted p-2 text-xs whitespace-pre-wrap">
                                            {JSON.stringify(answers[q.id], null, 2)}
                                        </pre>
                                    ) : (
                                        <span className="text-red-500">No answer</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setOpenConfirm(false)}
                        >
                            Cancel
                        </Button>

                        <Button
                            onClick={() => {
                                setOpenConfirm(false);
                                handleSubmit();
                            }}
                        >
                            Yes, Submit
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* SECOND CONFIRMATION (UNANSWERED QUESTIONS) */}
            <Dialog open={openSecondConfirm} onOpenChange={setOpenSecondConfirm}>
                <DialogContent className="max-w-lg">
                    <DialogHeader className="justify-center sm:text-center">
                        <img
                            className="mx-auto max-w-32 rounded-full p-2"
                            src="/assets/img/assessment/wanted.gif"
                            alt="Warning"
                        />

                        <DialogTitle>Unanswered Questions Found</DialogTitle>
                        <p className="text-sm text-muted-foreground">
                            Some questions are still unanswered. Submitting now may affect your results.
                        </p>
                    </DialogHeader>

                    <div className="max-h-64 overflow-y-auto rounded-md border bg-muted/30 p-3">
                        {unanswered.map((q, index) => (
                            <div key={q.id} className="mb-4">
                                <p className="text-xs font-medium opacity-75">
                                    {index + 1}. {q.question}
                                </p>

                                <p className="text-sm font-semibold text-red-500">
                                    ⚠ No answer provided
                                </p>
                            </div>
                        ))}
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setOpenSecondConfirm(false)}
                        >
                            Go Back
                        </Button>

                        <Button
                            className="bg-red-600 text-white hover:bg-red-700"
                            onClick={() => {
                                setOpenSecondConfirm(false);
                                doSubmit();
                            }}
                        >
                            Submit Anyway
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
