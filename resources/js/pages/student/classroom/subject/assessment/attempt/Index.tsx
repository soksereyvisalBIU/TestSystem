import QuestionRenderer from '@/components/student/assessment/QuestionRenderer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock, ListOrdered, CheckCircle } from 'lucide-react'; // Added icons
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { useForm, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState, useRef } from 'react';
import { route } from 'ziggy-js';
// Assuming useToast is available for notifications (e.g., from Shadcn UI)
// import { useToast } from '@/components/ui/use-toast'; 

// --- TYPES AND INTERFACES ---

interface StudentAssessmentAttempt {
    id: number;
    student_assesment_id: number;
    status: 'draft' | 'completed' | 'graded';
    started_at: string; // ISO 8601 timestamp
    completed_at: string | null;
    sub_score: number;
    created_at: string;
    updated_at: string;
}

interface Assessment {
    id: number;
    title: string;
    description: string;
    duration: number; // Duration in minutes
    subjects: { id: number; class_id: number }[];
    // ... other assessment props
}

interface Question {
    id: number;
    question: string;
    // ... other question props
}

interface QuestionsPagination {
    data: Question[];
    // ... other pagination props
}

interface AttemptProps {
    assessment: Assessment;
    questions: QuestionsPagination;
    studentAssessment: any; // Keep generic if structure is complex
    studentAssessmentAttempt: StudentAssessmentAttempt;
    student_assessment_attempt_id: number;
}

interface QuestionStatus {
    id: number;
    index: number;
    isAnswered: boolean;
    questionText: string;
}

// --- HELPER FUNCTION: FORMAT TIME ---
const formatTime = (totalSeconds: number) => {
    if (totalSeconds < 0) return '00:00:00';
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [hours, minutes, seconds]
        .map((v) => v.toString().padStart(2, '0'))
        .join(':');
};

// --- COMPONENT START ---
export default function Attempt({
    assessment,
    questions,
    // studentAssessment, // Not directly used in render/logic here
    studentAssessmentAttempt,
    student_assessment_attempt_id,
}: AttemptProps) {
    const { props } = usePage();
    const subject = assessment.subjects[0];
    const attemptStatus = studentAssessmentAttempt.status;
    const isCompleted = attemptStatus !== 'draft';
    // const { toast } = useToast(); // Placeholder

    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [openConfirm, setOpenConfirm] = useState(false);
    const [openSecondConfirm, setOpenSecondConfirm] = useState(false);
    const [unanswered, setUnanswered] = useState<Question[]>([]);
    const [activeQuestionId, setActiveQuestionId] = useState<number | null>(null);

    // Refs for Intersection Observer
    const questionRefs = useRef<Record<number, HTMLDivElement | null>>({});

    // --- TIME CALCULATION & STATE ---
    const calculateInitialTimeLeft = () => {
        if (isCompleted || !assessment.duration) return 0;

        const durationInSeconds = assessment.duration * 60;
        const startedAt = new Date(studentAssessmentAttempt.started_at).getTime();
        const currentTime = Date.now();
        const elapsedSeconds = Math.floor((currentTime - startedAt) / 1000);
        
        return Math.max(0, durationInSeconds - elapsedSeconds);
    };

    const initialTimeLeft = useMemo(calculateInitialTimeLeft, [
        assessment.duration,
        studentAssessmentAttempt.started_at,
        isCompleted,
    ]);
    
    const [timeLeft, setTimeLeft] = useState(initialTimeLeft);
    const [isTimeUp, setIsTimeUp] = useState(timeLeft === 0 && assessment.duration > 0);

    // Effect for the countdown timer
    useEffect(() => {
        if (assessment.duration === 0 || isCompleted) return;

        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    setIsTimeUp(true);
                    doSubmit(); // Auto-submit when time is up
                    // toast({ title: "Time's Up!", description: "Your assessment has been automatically submitted.", variant: "destructive" });
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [assessment.duration, isCompleted]); // Reruns if duration or completion status changes

    const timeDisplay = formatTime(timeLeft);
    const timerColor =
        timeLeft <= 300 && timeLeft > 0
            ? 'bg-red-500 text-white' // Less than 5 mins remaining
            : timeLeft > 0 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-red-700 text-white'; // Time is up

    // --- FORM SETUP ---
    const form = useForm({
        answers: {},
        user_id: props?.auth?.user?.id,
    });

    // --- UTILITY FUNCTIONS ---

    // Function to scroll to a specific question element
    const scrollToQuestion = (questionId: number) => {
        const element = document.getElementById(`question-${questionId}`);
        if (element) {
            // Check if dialogs are open and close them before scrolling
            setOpenConfirm(false); 
            setOpenSecondConfirm(false);
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const updateAnswer = (questionId: string, value: any) => {
        // Prevent changes if the assessment is completed
        if (isCompleted) return;
        setAnswers((prev) => ({ ...prev, [questionId]: value }));
    };

    const doSubmit = () => {
        if (form.processing || isCompleted) return; 

        form.transform((data) => ({
            ...data,
            answers: answers,
        }));

        form.post(
            route('student.classes.subjects.assessments.attempt.store', {
                class_id: subject.class_id,
                subject_id: subject.id,
                assessment_id: assessment.id,
                student_assessment_attempt_id: student_assessment_attempt_id,
            }),
            {
                // onSuccess: () => toast({ title: "Submission Successful!", description: "Your assessment has been recorded." }),
                onError: (errors) => {
                    console.error("Submission Error:", errors);
                    // toast({ title: "Submission Failed", description: "Please try again or contact support.", variant: "destructive" });
                },
            }
        );
    };

    const handleSubmit = () => {
        // Prevent submission if already processing or completed
        if (form.processing || isCompleted) {
            // toast({ title: "Action Blocked", description: isCompleted ? "Assessment is already completed." : "Submission is already in progress.", variant: "warning" });
            return;
        }

        const missing = questions.data.filter(
            (q: any) => answers[q.id] === undefined || answers[q.id] === null || answers[q.id] === '',
        );

        setUnanswered(missing);

        if (missing.length > 0) {
            // Open the second confirmation dialog showing the unanswered questions list
            setOpenConfirm(false); // Close first dialog if it was open
            setOpenSecondConfirm(true);
            return;
        }

        setOpenConfirm(false); // Close first dialog
        doSubmit();
    };
    
    // --- INTERSECTION OBSERVER FOR ACTIVE QUESTION HIGHLIGHTING ---
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const questionId = parseInt(entry.target.id.replace('question-', ''), 10);
                    if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                        setActiveQuestionId(questionId);
                    }
                });
            },
            {
                root: null, // viewport
                rootMargin: '0px',
                threshold: 0.5, // Trigger when 50% of the item is visible
            }
        );

        questions.data.forEach((q) => {
            const ref = questionRefs.current[q.id];
            if (ref) {
                observer.observe(ref);
            }
        });

        return () => {
            questions.data.forEach((q) => {
                const ref = questionRefs.current[q.id];
                if (ref) {
                    observer.unobserve(ref);
                }
            });
        };
    }, [questions.data]);


    // --- MEMOIZED QUESTION STATUSES FOR SIDEBAR AND DIALOGS ---
    const questionStatuses: QuestionStatus[] = useMemo(() => {
        return questions.data.map((q, index) => ({
            id: q.id,
            index: index,
            isAnswered: answers[q.id] !== undefined && answers[q.id] !== null && answers[q.id] !== '',
            questionText: q.question, 
        }));
    }, [questions.data, answers]);

    const unansweredCount = questionStatuses.filter((q) => !q.isAnswered).length;


    // If the assessment is completed, redirect or show a different view
    if (isCompleted) {
        return (
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="max-w-md rounded-lg border bg-card p-8 text-center shadow-lg">
                    <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
                    <h1 className="mt-4 text-2xl font-bold">Assessment Completed</h1>
                    <p className="mt-2 text-muted-foreground">
                        Your submission has been recorded on **{new Date(studentAssessmentAttempt.updated_at).toLocaleDateString()}** at **{new Date(studentAssessmentAttempt.updated_at).toLocaleTimeString()}**.
                    </p>
                    <Button 
                        asChild 
                        className="mt-6"
                        // Assuming you have a route to view the results
                        // href={route('student.assessments.results', student_assessment_attempt_id)} 
                    >
                        {/* <Link>View Results</Link> */}
                        <span>View Results (Link Placeholder)</span>
                    </Button>
                </div>
            </div>
        );
    }


    return (
        // <AppLayout title={assessment.title} className="flex min-h-screen">
        <div className="relative flex min-h-screen">
            {/* --- 1. FIXED QUESTION NAVIGATOR SIDEBAR --- */}
            <div className="fixed top-0 left-0 hidden h-full w-64 overflow-y-auto border-r bg-card pt-20 lg:block z-20">
                <div className="space-y-4 p-4">
                    <h3 className="flex items-center gap-2 border-b pb-2 text-lg font-semibold">
                        <ListOrdered className='h-5 w-5 text-primary'/>
                        Questions ({questions.data.length})
                    </h3>
                    
                    {/* Status Legend */}
                    <div className='flex justify-around text-xs text-muted-foreground'>
                        <span className='flex items-center gap-1'><span className='h-2 w-2 rounded-full bg-green-500'></span> Answered</span>
                        <span className='flex items-center gap-1'><span className='h-2 w-2 rounded-full bg-primary'></span> Current</span>
                        <span className='flex items-center gap-1'><span className='h-2 w-2 border border-input rounded-full bg-white'></span> Unanswered</span>
                    </div>

                    <div className="grid grid-cols-5 gap-2">
                        {questionStatuses.map((q) => (
                            <Button
                                key={q.id}
                                // Determine the appearance
                                variant={activeQuestionId === q.id ? 'default' : q.isAnswered ? 'secondary' : 'outline'}
                                size="icon"
                                className={cn(
                                    'h-10 w-10 transition-colors text-sm font-semibold',
                                    activeQuestionId === q.id 
                                        ? 'bg-primary text-primary-foreground shadow-lg' // Current Question
                                        : q.isAnswered
                                            ? 'bg-green-500 text-white hover:bg-green-600' // Answered
                                            : 'hover:bg-accent/80', // Unanswered
                                )}
                                onClick={() => scrollToQuestion(q.id)}
                                title={`Question ${q.index + 1}: ${q.isAnswered ? 'Answered' : 'Unanswered'}`}
                            >
                                {q.index + 1}
                            </Button>
                        ))}
                    </div>

                    <div className="border-t pt-4">
                        <Button
                            onClick={() => setOpenConfirm(true)}
                            className="w-full h-10 text-lg font-bold"
                            disabled={isTimeUp || form.processing || isCompleted}
                            variant={unansweredCount > 0 ? 'outline' : 'default'}
                        >
                            {form.processing
                                ? 'Submitting...'
                                : 'End Assessment'}
                        </Button>
                    </div>
                </div>
            </div>

            {/* --- MAIN CONTENT AREA --- */}
            <div className="flex-1 lg:ml-64 pb-24"> {/* Added pb-24 for padding above the floating timer */}
                <div className="mx-auto max-w-4xl space-y-6 px-4 py-10">
                    <header className="space-y-2 text-center border-b pb-4">
                        <h1 className="text-4xl font-extrabold tracking-tight">
                            {assessment.title}
                        </h1>
                        <p className="text-md text-muted-foreground">
                            {assessment.description}
                        </p>
                    </header>

                    {/* QUESTIONS */}
                    <div className="space-y-8">
                        {questions?.data?.map((q: Question, index: number) => (
                            <div
                                key={q.id}
                                id={`question-${q.id}`}
                                // Assign the ref for the Intersection Observer
                                ref={(el: HTMLDivElement | null) => (questionRefs.current[q.id] = el)}
                                className={cn(
                                    "rounded-xl border bg-card p-6 shadow-xl transition-all duration-300",
                                    activeQuestionId === q.id ? "border-primary shadow-2xl scale-[1.005]" : ""
                                )}
                            >
                                <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold border-b pb-2 text-primary">
                                    <span className='w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-mono'>{index + 1}</span>
                                    Question {index + 1}
                                </h2>
                                <QuestionRenderer
                                    key={q.id}
                                    question={q}
                                    index={index}
                                    answer={answers[q.id]}
                                    onAnswerChange={updateAnswer}
                                    disabled={isCompleted || isTimeUp}
                                />
                                <div className="flex justify-end pt-4">
                                    <Badge
                                        variant={
                                            answers[q.id]
                                                ? 'default'
                                                : 'secondary'
                                        }
                                        className={cn(
                                            'text-sm px-3 py-1',
                                            answers[q.id]
                                                ? 'bg-green-100 text-green-700 hover:bg-green-100'
                                                : 'bg-muted text-muted-foreground',
                                        )}
                                    >
                                        {answers[q.id]
                                            ? 'Answered'
                                            : 'Unanswered'}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* SUBMIT BUTTON (at the bottom of the main content) */}
                    <div className="flex justify-end py-10">
                        <Button
                            onClick={() => setOpenConfirm(true)}
                            size="lg"
                            className="px-8 h-12 text-lg"
                            disabled={isTimeUp || form.processing || isCompleted}
                            variant={unansweredCount > 0 ? 'outline' : 'default'}
                        >
                            {form.processing
                                ? 'Submitting...'
                                : 'Submit Assessment'}
                        </Button>
                    </div>
                </div>
            </div>

            {/* --- 2. FIXED DURATION COUNTDOWN TIMER (BOTTOM RIGHT) --- */}
            {assessment.duration > 0 && (
                <div
                    className={cn(
                        'fixed right-4 bottom-4 z-50 rounded-xl p-4 text-center shadow-2xl transition-all duration-500 border-4 border-white transform hover:scale-[1.02] cursor-default',
                        timerColor,
                    )}
                >
                    <div className="flex items-center justify-center gap-2 mb-1 text-xs font-medium uppercase opacity-90">
                        <Clock className='h-4 w-4' />
                        <span>Time Remaining</span>
                    </div>
                    <div className="font-mono text-4xl font-bold tracking-wider">
                        {timeDisplay}
                    </div>
                    {isTimeUp && (
                        <p className="mt-1 text-sm font-bold animate-pulse">TIME IS UP! Auto-Submitting...</p>
                    )}
                </div>
            )}

            {/* --- DIALOGS (FIRST CONFIRMATION) --- */}
            <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
                <DialogContent className="max-w-lg">
                    <DialogHeader className="justify-center sm:text-center">
                        <img
                            className="mx-auto max-w-32 rounded-full p-2"
                            src="/assets/img/assessment/submit.gif" // Keep original GIF
                            alt="Confirm Submit"
                        />
                        <DialogTitle className='text-2xl font-bold'>Confirm Submission</DialogTitle>
                        <DialogDescription className='text-base text-muted-foreground pt-2'>
                            You are about to submit your assessment. Please review the summary below.
                        </DialogDescription>
                    </DialogHeader>

                    <p className="text-center font-semibold text-lg">
                        You have **
                        <span className={cn('font-extrabold', unansweredCount > 0 ? 'text-red-600' : 'text-green-600')}>
                            {unansweredCount}
                        </span>
                        ** unanswered questions.
                    </p>

                    <div className="max-h-64 overflow-y-auto rounded-md border bg-muted/30 p-4">
                        <h4 className="mb-3 flex items-center gap-2 font-bold text-lg border-b pb-2">
                            <ListOrdered className='h-5 w-5'/> Review Summary:
                        </h4>
                        {questionStatuses.map((q) => (
                            <div
                                key={q.id}
                                className="mb-2 flex items-center justify-between text-sm transition-colors duration-200 hover:bg-muted/50 p-1 rounded"
                            >
                                <p className="truncate text-xs font-medium opacity-90">
                                    {q.index + 1}. {q.questionText}
                                </p>
                                <Badge
                                    className={cn(
                                        'ml-2 flex min-w-20 justify-center',
                                        q.isAnswered
                                            ? 'bg-green-500 text-white hover:bg-green-600'
                                            : 'bg-red-500 text-white hover:bg-red-600',
                                    )}
                                >
                                    {q.isAnswered ? 'Answered' : 'Skipped'}
                                </Badge>
                            </div>
                        ))}
                    </div>

                    <DialogFooter className='pt-4'>
                        <Button
                            variant="outline"
                            onClick={() => setOpenConfirm(false)}
                        >
                            Cancel
                        </Button>

                        <Button
                            onClick={() => {
                                handleSubmit();
                            }}
                            disabled={form.processing}
                            variant={unansweredCount > 0 ? 'outline' : 'default'}
                        >
                            {form.processing ? 'Submitting...' : 'Yes, Submit Anyway'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* --- DIALOGS (SECOND CONFIRMATION / UNANSWERED QUESTIONS LIST) --- */}
            <Dialog
                open={openSecondConfirm}
                onOpenChange={setOpenSecondConfirm}
            >
                <DialogContent className="max-w-lg">
                    <DialogHeader className="justify-center sm:text-center">
                        <img
                            className="mx-auto max-w-32 rounded-full p-2"
                            src="/assets/img/assessment/wanted.gif" // Keep original GIF
                            alt="Warning"
                        />
                        <DialogTitle className='text-2xl font-bold text-red-600'>
                            <AlertTriangle className='inline-block h-6 w-6 mr-2'/> Unanswered Questions Found
                        </DialogTitle>
                        <DialogDescription className='text-base text-muted-foreground pt-2'>
                            You have unanswered questions. It is recommended to go back and complete them.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="max-h-64 overflow-y-auto rounded-md border bg-muted/30 p-4">
                        <h4 className="mb-3 font-bold text-lg border-b pb-2 text-red-700">Unanswered List ({unanswered.length}):</h4>
                        {unanswered.map((q) => {
                            const qIndex = questions.data.findIndex(
                                (item: any) => item.id === q.id,
                            );
                            return (
                                <div key={q.id} className="mb-2">
                                    <Button
                                        variant="link"
                                        className="h-auto justify-start p-0 text-left text-sm font-medium text-red-600 hover:text-red-700 hover:no-underline transition-colors duration-200"
                                        onClick={() => {
                                            setOpenSecondConfirm(false);
                                            scrollToQuestion(q.id);
                                        }}
                                    >
                                        <span className="mr-2 font-extrabold underline">
                                            Q{qIndex + 1}:
                                        </span>
                                        <span className='truncate max-w-[85%]'>
                                            {q.question.length > 80
                                                ? q.question.substring(0, 77) + '...'
                                                : q.question}
                                        </span>
                                    </Button>
                                </div>
                            );
                        })}
                    </div>

                    <DialogFooter className='pt-4'>
                        <Button
                            variant="outline"
                            onClick={() => setOpenSecondConfirm(false)}
                            className='font-semibold'
                        >
                            Go Back to Questions
                        </Button>

                        <Button
                            className="bg-red-600 text-white hover:bg-red-700 font-semibold"
                            onClick={() => {
                                setOpenSecondConfirm(false);
                                doSubmit();
                            }}
                            disabled={form.processing}
                        >
                            {form.processing
                                ? 'Submitting...'
                                : 'Submit Anyway'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
        // </AppLayout>
    );
}