import QuestionRenderer from '@/components/student/assessment/QuestionRenderer';
import { Button } from '@/components/ui/button';
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

export default function AttemptAssessment({ assessment }: { assesment: any }) {

    console.log(assessment);
    
    
    const { props } = usePage();
    const attempt = props?.attempt;
    const questions = assessment?.questions ?? [];

    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [openConfirm, setOpenConfirm] = useState(false);
    const [openSecondConfirm, setOpenSecondConfirm] = useState(false);
    const [unanswered, setUnanswered] = useState<any[]>([]);

    /** -------------------------
     *  FIX: useForm must be here
     * ------------------------- */
    const form = useForm({
        answers: {},
        attempt_id: props?.attempt?.id,
        user_id: props?.auth?.user?.id,
    });

    const updateAnswer = (questionId: string, value: any) => {
        setAnswers((prev) => ({ ...prev, [questionId]: value }));
    };

    const doSubmit = () => {
        form.setData('answers', answers);

        form.post(
            route('student.course.assessment.attempt.store', {
                assessment_id: props?.assessment_id,
                course_id: props?.course_id,
            }),
        );
    };

    const handleSubmit = () => {
        const missing = questions.filter((q) => !answers[q.id]);
        setUnanswered(missing);

        if (missing.length > 0) {
            setOpenSecondConfirm(true);
            return;
        }

        // No missing answers → submit normally
        doSubmit();
    };

    // const assessment = assessment;

    return (
        <div className="mx-auto max-w-4xl space-y-2 px-4 py-10">
            <header className="space-y-2 text-center">
                <h1 className="text-3xl font-semibold">{assessment.title}</h1>
                <p className="text-muted-foreground">
                    {assessment.description}
                </p>

                <p className="text-sm text-muted-foreground">
                    Duration: {assessment.duration} mins • Max Attempts:{' '}
                    {assessment.max_attempts}
                </p>
            </header>

            <div className="space-y-4">
                {questions.map((q, index) => (
                    <QuestionRenderer
                        key={q.id}
                        question={q}
                        index={index}
                        answer={answers[q.id]}
                        onAnswerChange={updateAnswer}
                    />
                ))}
            </div>

            <div className="flex justify-end">
                <Button
                    onClick={() => setOpenConfirm(true)}
                    size="lg"
                    className="px-6"
                >
                    Submit Assessment
                </Button>
            </div>

            {/* FIRST CONFIRM */}
            <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
                <DialogContent className="max-w-lg">
                    <DialogHeader className="justify-center sm:text-center">
                        <img
                            className="mx-auto max-w-32 rounded-full p-2"
                            src="/assets/img/assessment/submit.gif"
                            alt=""
                        />
                        <DialogTitle>Confirm Submission</DialogTitle>
                        <p className="text-sm text-muted-foreground">
                            Review your answers before submitting.
                        </p>
                    </DialogHeader>

                    <div className="max-h-64 overflow-y-auto rounded-md border bg-muted/30 p-3">
                        {questions.map((q, index) => (
                            <div key={q.id} className="mb-4">
                                <p className="text-xs font-medium opacity-75">
                                    {index + 1}. {q.question}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {answers[q.id] ? (
                                        <pre className="mt-1 rounded bg-muted p-2 text-xs">
                                            {JSON.stringify(
                                                answers[q.id],
                                                null,
                                                2,
                                            )}
                                        </pre>
                                    ) : (
                                        <span className="text-red-500">
                                            No answer
                                        </span>
                                    )}
                                </p>
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

            {/* SECOND CONFIRM */}
            <Dialog
                open={openSecondConfirm}
                onOpenChange={setOpenSecondConfirm}
            >
                <DialogContent className="max-w-lg">
                    <DialogHeader className="justify-center sm:text-center">
                        <img
                            className="mx-auto max-w-32 rounded-full p-2"
                            src="/assets/img/assessment/wanted.gif"
                            alt=""
                        />
                        <DialogTitle>Unanswered Questions Found</DialogTitle>
                        <p className="text-sm text-muted-foreground">
                            Several questions have not been answered. Submitting
                            now may affect your results. Are you absolutely sure
                            you want to continue?
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
                                doSubmit(); // FIX: real submit
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
