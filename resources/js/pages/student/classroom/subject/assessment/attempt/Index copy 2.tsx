import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { cn } from '@/lib/utils';

// UI Components
import QuestionRenderer from '@/components/student/assessment/QuestionRenderer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from "@/components/ui/progress";
import { 
    AlertTriangle, Clock, ListOrdered, CheckCircle, 
    ChevronRight, ChevronLeft, Upload, GripVertical, 
    Save, ImageIcon
} from 'lucide-react';
import {
    Dialog, DialogContent, DialogFooter, DialogHeader,
    DialogTitle, DialogDescription,
} from '@/components/ui/dialog';

// --- TYPES ---
interface Question {
    id: number;
    question: string;
    type: 'multiple_choice' | 'fill_blank' | 'file_upload' | 'ordering';
    image_url?: string; // Support for images
    options?: any[]; 
}

interface AttemptProps {
    assessment: {
        id: number;
        title: string;
        description: string;
        duration: number;
        subjects: { id: number; class_id: number }[];
    };
    questions: { data: Question[] };
    student_assessment_attempt_id: number;
    studentAssessmentAttempt: {
        status: string;
        started_at: string;
        updated_at: string;
    };
}

// --- HELPERS ---
const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

export default function Attempt({
    assessment,
    questions,
    studentAssessmentAttempt,
    student_assessment_attempt_id,
}: AttemptProps) {
    const { props } = usePage();
    const subject = assessment.subjects[0];
    const isCompleted = studentAssessmentAttempt.status !== 'draft';

    // --- STATE ---
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [activeQuestionId, setActiveQuestionId] = useState<number | null>(null);
    const [isConfirming, setIsConfirming] = useState(false);
    const [showUnansweredWarning, setShowUnansweredWarning] = useState(false);
    
    const questionRefs = useRef<Record<number, HTMLDivElement | null>>({});
    const form = useForm({ answers: {}, user_id: props?.auth?.user?.id });

    // --- TIMER LOGIC ---
    const [timeLeft, setTimeLeft] = useState(() => {
        if (isCompleted || !assessment.duration) return 0;
        const start = new Date(studentAssessmentAttempt.started_at).getTime();
        const elapsed = Math.floor((Date.now() - start) / 1000);
        return Math.max(0, (assessment.duration * 60) - elapsed);
    });

    useEffect(() => {
        if (isCompleted || timeLeft <= 0) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    doSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [isCompleted]);

    // --- INTERSECTION OBSERVER (Active Question Highlight) ---
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const id = parseInt(entry.target.id.replace('q-', ''));
                        setActiveQuestionId(id);
                    }
                });
            },
            { threshold: 0.6, rootMargin: "-10% 0px -70% 0px" }
        );

        Object.values(questionRefs.current).forEach(ref => ref && observer.observe(ref));
        return () => observer.disconnect();
    }, [questions.data]);

    // --- COMPUTED ---
    const stats = useMemo(() => {
        const total = questions.data.length;
        const answeredCount = questions.data.filter(q => {
            const val = answers[q.id];
            return val !== undefined && val !== null && val !== '' && (!Array.isArray(val) || val.length > 0);
        }).length;
        const progress = (answeredCount / total) * 100;
        return { total, answeredCount, progress };
    }, [answers, questions.data]);

    // --- ACTIONS ---
    const updateAnswer = (id: string, value: any) => {
        if (isCompleted) return;
        setAnswers(prev => ({ ...prev, [id]: value }));
    };

    const doSubmit = () => {
        form.transform((data) => ({ ...data, answers }));
        form.post(route('student.classes.subjects.assessments.attempt.store', {
            class_id: subject.class_id,
            subject_id: subject.id,
            assessment_id: assessment.id,
            student_assessment_attempt_id,
        }));
    };

    const handlePreSubmit = () => {
        const unanswered = questions.data.filter(q => !answers[q.id]);
        if (unanswered.length > 0) {
            setShowUnansweredWarning(true);
        } else {
            setIsConfirming(true);
        }
    };

    if (isCompleted) return <CompletionView date={studentAssessmentAttempt.updated_at} />;

    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
            {/* Top Sticky Progress Bar */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b dark:bg-slate-900/80">
                <div className="flex items-center justify-between px-6 py-3 max-w-[1600px] mx-auto">
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-bold text-primary">Progress</span>
                        <Progress value={stats.progress} className="w-40 h-2" />
                        <span className="text-xs font-medium text-muted-foreground">
                            {stats.answeredCount} / {stats.total} Answered
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="hidden sm:flex bg-white">
                            Draft Saved <Save className="ml-2 h-3 w-3 text-green-500" />
                        </Badge>
                    </div>
                </div>
            </div>

            <div className="flex pt-14">
                {/* --- LEFT SIDEBAR NAVIGATOR --- */}
                <aside className="fixed left-0 top-14 hidden h-[calc(100vh-3.5rem)] w-72 overflow-y-auto border-r bg-white p-6 lg:block dark:bg-slate-900">
                    <div className="mb-6">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Navigator</h3>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                        {questions.data.map((q, i) => (
                            <button
                                key={q.id}
                                onClick={() => document.getElementById(`q-${q.id}`)?.scrollIntoView({ behavior: 'smooth' })}
                                className={cn(
                                    "flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-bold transition-all",
                                    activeQuestionId === q.id ? "border-primary bg-primary text-white ring-4 ring-primary/10" : 
                                    answers[q.id] ? "bg-green-100 border-green-200 text-green-700 dark:bg-green-900/30" : "bg-slate-50 hover:bg-slate-100"
                                )}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                    
                    <div className="mt-10 border-t pt-6">
                        <Button className="w-full shadow-lg" onClick={handlePreSubmit}>
                            Finish Assessment
                        </Button>
                    </div>
                </aside>

                {/* --- MAIN CONTENT --- */}
                <main className="flex-1 lg:ml-72 pb-32">
                    <div className="mx-auto max-w-3xl px-6 py-12">
                        <div className="mb-12 text-center">
                            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                                {assessment.title}
                            </h1>
                            <p className="mt-4 text-lg text-slate-500">{assessment.description}</p>
                        </div>

                        <div className="space-y-12">
                            {questions.data.map((q, index) => (
                                <section
                                    key={q.id}
                                    id={`q-${q.id}`}
                                    ref={(el) => (questionRefs.current[q.id] = el)}
                                    className={cn(
                                        "group relative rounded-3xl border bg-white p-8 shadow-sm transition-all duration-500 dark:bg-slate-900",
                                        activeQuestionId === q.id ? "border-primary shadow-2xl ring-1 ring-primary/5" : "border-slate-200"
                                    )}
                                >
                                    <div className="mb-6 flex items-center justify-between">
                                        <Badge variant="secondary" className="px-3 py-1 text-xs font-bold uppercase">
                                            Question {index + 1}
                                        </Badge>
                                        {answers[q.id] && <CheckCircle className="h-5 w-5 text-green-500" />}
                                    </div>

                                    {/* Support for Question Images */}
                                    {q.image_url && (
                                        <div className="mb-6 overflow-hidden rounded-xl border bg-slate-100">
                                            <img src={q.image_url} alt="Question visual" className="max-h-80 w-full object-contain" />
                                        </div>
                                    )}

                                    <div className="prose prose-slate mb-8 dark:prose-invert">
                                        <h2 className="text-xl font-semibold leading-relaxed text-slate-800 dark:text-slate-100">
                                            {q.question}
                                        </h2>
                                    </div>

                                    <div className="rounded-2xl bg-slate-50/50 p-4 dark:bg-slate-800/50">
                                        <QuestionRenderer
                                            question={q}
                                            answer={answers[q.id]}
                                            onAnswerChange={updateAnswer}
                                            disabled={isCompleted}
                                        />
                                    </div>
                                </section>
                            ))}
                        </div>
                    </div>
                </main>

                {/* --- FLOATING TIMER --- */}
                <div className={cn(
                    "fixed bottom-6 right-6 z-50 flex flex-col items-center rounded-2xl border-4 border-white bg-white/90 p-4 shadow-2xl backdrop-blur transition-all dark:bg-slate-900/90 dark:border-slate-800",
                    timeLeft < 300 ? "text-red-600 animate-pulse" : "text-slate-900 dark:text-white"
                )}>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-60">
                        <Clock className="h-3 w-3" /> Time Remaining
                    </div>
                    <div className="font-mono text-3xl font-black">
                        {formatTime(timeLeft)}
                    </div>
                </div>
            </div>

            {/* --- SUBMISSION DIALOGS --- */}
            <SubmissionModal 
                isOpen={isConfirming} 
                onClose={() => setIsConfirming(false)} 
                onConfirm={doSubmit} 
                stats={stats}
            />
            
            <UnansweredWarningModal 
                isOpen={showUnansweredWarning} 
                onClose={() => setShowUnansweredWarning(false)} 
                onConfirm={() => { setShowUnansweredWarning(false); setIsConfirming(true); }}
                unansweredCount={stats.total - stats.answeredCount}
            />
        </div>
    );
}

// --- SUB-COMPONENTS FOR CLEANER CODE ---

function CompletionView({ date }: { date: string }) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-md rounded-3xl bg-white p-10 text-center shadow-xl">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900">Assessment Submitted</h1>
                <p className="mt-3 text-slate-500">
                    Recorded on {new Date(date).toLocaleDateString()} at {new Date(date).toLocaleTimeString()}
                </p>
                <Button className="mt-8 w-full" variant="outline">Back to Dashboard</Button>
            </div>
        </div>
    );
}

function SubmissionModal({ isOpen, onClose, onConfirm, stats }: any) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Submit Assessment?</DialogTitle>
                    <DialogDescription>
                        You have answered {stats.answeredCount} out of {stats.total} questions. Once submitted, you cannot change your answers.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="ghost" onClick={onClose}>Review Answers</Button>
                    <Button onClick={onConfirm}>Confirm Submission</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function UnansweredWarningModal({ isOpen, onClose, onConfirm, unansweredCount }: any) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="border-red-100">
                <DialogHeader>
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                    <DialogTitle className="text-center text-red-600">Incomplete Assessment</DialogTitle>
                    <DialogDescription className="text-center">
                        You still have <strong>{unansweredCount}</strong> questions without answers. Are you sure you want to proceed?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex-col gap-2 sm:flex-row">
                    <Button variant="outline" onClick={onClose} className="w-full">Go Back</Button>
                    <Button variant="destructive" onClick={onConfirm} className="w-full">Submit Anyway</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}