import QuestionRenderer from '@/components/student/assessment/QuestionRenderer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useForm, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Clock,
    Contrast,
    Info,
    LayoutDashboard,
    LayoutList,
    ListOrdered,
    Maximize2,
    Minimize2,
    Save,
    Search,
    SquareStack,
    Type,
    Wifi,
    WifiOff,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { route } from 'ziggy-js';

// --- HELPER: TIME FORMATTER ---
const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [h, m, s].map((v) => v.toString().padStart(2, '0')).join(':');
};

export default function AssessmentAttempt({
    assessment,
    questions,
    student_assessment_attempt_id,
    studentAssessmentAttempt,
}: any) {
    const { props } = usePage();
    const subject = assessment.subjects[0];
    const isCompleted = studentAssessmentAttempt.status !== 'draft';
    const STORAGE_KEY = `exam_draft_${student_assessment_attempt_id}`;

    // --- UX & PERSISTENCE STATES ---
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [isOnline, setIsOnline] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isFocusMode, setIsFocusMode] = useState(false);
    const [fontSize, setFontSize] = useState(16);
    const [highContrast, setHighContrast] = useState(false);
    const [activeQuestionId, setActiveQuestionId] = useState<number | null>(null);

    // --- NEW VIEW STATES ---
    const [viewMode, setViewMode] = useState<'scroll' | 'single'>('scroll');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    // --- DIALOG STATES ---
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);

    const questionRefs = useRef<Record<number, HTMLDivElement | null>>({});
    const form = useForm({ answers: {}, user_id: props?.auth?.user?.id });

    // --- 1. INITIALIZATION & NETWORK MONITOR ---
    useEffect(() => {
        const updateStatus = () => setIsOnline(navigator.onLine);
        window.addEventListener('online', updateStatus);
        window.addEventListener('offline', updateStatus);

        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                setAnswers(JSON.parse(saved));
            } catch (e) {
                console.error('Sync error', e);
            }
        }

        const warn = (e: BeforeUnloadEvent) => {
            if (!isCompleted) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', warn);

        return () => {
            window.removeEventListener('online', updateStatus);
            window.removeEventListener('offline', updateStatus);
            window.removeEventListener('beforeunload', warn);
        };
    }, [STORAGE_KEY, isCompleted]);

    // --- 2. TIMER LOGIC ---
    const calculateTime = () => {
        if (isCompleted || !assessment.duration) return 0;
        const start = new Date(studentAssessmentAttempt.started_at).getTime();
        const durationSec = assessment.duration * 60;
        return Math.max(0, durationSec - Math.floor((Date.now() - start) / 1000));
    };
    const [timeLeft, setTimeLeft] = useState(calculateTime());

    useEffect(() => {
        if (isCompleted) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleFinalSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [isCompleted]);

    // --- 3. ACTIONS ---
    const updateAnswer = (id: string, value: any) => {
        if (isCompleted) return;
        setIsSaving(true);
        const newAnswers = { ...answers, [id]: value };
        setAnswers(newAnswers);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newAnswers));
        setTimeout(() => setIsSaving(false), 500);
    };

    const handleFinalSubmit = () => {
        form.transform((data) => ({ ...data, answers }));
        form.post(
            route('student.classes.subjects.assessments.attempt.store', {
                class_id: subject.class_id,
                subject_id: subject.id,
                assessment_id: assessment.id,
                student_assessment_attempt_id,
            }),
            {
                onSuccess: () => localStorage.removeItem(STORAGE_KEY),
            },
        );
    };

    const handleNavigateToQuestion = (id: number, index: number) => {
        if (viewMode === 'single') {
            setCurrentQuestionIndex(index);
        } else {
            questionRefs.current[id]?.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }
        setActiveQuestionId(id);
    };

    const nextQuestion = () => {
        if (currentQuestionIndex < questions.data.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const prevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prev) => prev - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // --- 4. DATA MEMOIZATION ---
    const stats = useMemo(() => {
        const total = questions.data.length;
        const answered = Object.keys(answers).filter(
            (id) => answers[id] !== null && answers[id] !== '',
        ).length;
        return {
            total,
            answered,
            progress: (answered / total) * 100,
            remaining: total - answered,
        };
    }, [answers, questions.data]);

    if (isCompleted) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
                <div className="w-full max-w-md rounded-[3rem] border bg-white p-12 text-center shadow-2xl">
                    <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle className="h-12 w-12 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900">Submitted!</h1>
                    <p className="mt-4 font-medium text-slate-500">Your assessment has been recorded.</p>
                    <Button className="mt-8 w-full rounded-2xl py-7 text-lg">
                        <LayoutDashboard className="mr-2 h-5 w-5" /> Return to Dashboard
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div
            className={cn(
                'min-h-screen transition-all duration-500',
                highContrast ? 'bg-zinc-950 text-white' : 'bg-slate-50/50 text-slate-900',
            )}
            style={{ fontSize: `${fontSize}px` }}
        >
            <header className="sticky top-0 z-50 w-full border-b bg-white/90 shadow-sm backdrop-blur-xl dark:bg-zinc-900/90">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-6">
                        <div className="hidden md:block">
                            <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Progress</span>
                            <div className="flex items-center gap-3">
                                <Progress value={stats.progress} className="h-2.5 w-32 md:w-48" />
                                <span className="text-sm font-bold">{stats.answered}/{stats.total}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-2xl bg-slate-100 px-4 py-2 dark:bg-zinc-800">
                        {isOnline ? (
                            <div className="flex items-center gap-2 text-green-600">
                                <Wifi className="h-4 w-4" />
                                <span className="hidden text-[10px] font-black uppercase md:inline">Online</span>
                            </div>
                        ) : (
                            <div className="flex animate-pulse items-center gap-2 text-red-500">
                                <WifiOff className="h-4 w-4" />
                                <span className="text-[10px] font-black uppercase">Offline</span>
                            </div>
                        )}
                        <div className="h-4 w-px bg-slate-300 dark:bg-zinc-700" />
                        <div className={cn('flex items-center gap-2 font-mono font-bold', timeLeft < 300 ? 'animate-pulse text-red-500' : 'text-slate-700 dark:text-zinc-300')}>
                            <Clock className="h-4 w-4" /> {formatTime(timeLeft)}
                        </div>
                    </div>

                    <Button onClick={() => setShowSubmitModal(true)} disabled={!isOnline} className="rounded-xl px-6 font-bold shadow-lg shadow-primary/20">
                        Finish
                    </Button>
                </div>
            </header>

            <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8">
                {!isFocusMode && (
                    <aside className="sticky top-24 hidden h-fit w-72 lg:block">
                        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                            <h3 className="mb-4 flex items-center gap-2 text-xs font-black tracking-widest text-slate-400 uppercase">
                                <ListOrdered className="h-4 w-4" /> Navigation
                            </h3>
                            <div className="grid grid-cols-4 gap-2">
                                {questions.data.map((q: any, i: number) => (
                                    <button
                                        key={q.id}
                                        onClick={() => handleNavigateToQuestion(q.id, i)}
                                        className={cn(
                                            'flex h-12 items-center justify-center rounded-xl border text-sm font-bold transition-all',
                                            (viewMode === 'single' ? currentQuestionIndex === i : activeQuestionId === q.id)
                                                ? 'scale-110 border-primary bg-primary text-white shadow-lg shadow-primary/30'
                                                : answers[q.id]
                                                ? 'border-green-100 bg-green-50 text-green-600 dark:border-green-800 dark:bg-green-900/20'
                                                : 'border-slate-100 bg-white text-slate-400 dark:border-zinc-700 dark:bg-zinc-800',
                                        )}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </aside>
                )}

                <main className={cn('flex-1 space-y-10 pb-32 transition-all duration-700', isFocusMode ? 'mx-auto max-w-3xl' : '')}>
                    {/* VIEW MODE TOGGLE */}
                    <div className="flex justify-end">
                        <div className="flex gap-1 rounded-2xl bg-slate-200 p-1.5 dark:bg-zinc-800">
                            <Button
                                variant={viewMode === 'scroll' ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setViewMode('scroll')}
                                className="rounded-xl font-bold"
                            >
                                <LayoutList className="mr-2 h-4 w-4" /> Scrolling
                            </Button>
                            <Button
                                variant={viewMode === 'single' ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setViewMode('single')}
                                className="rounded-xl font-bold"
                            >
                                <SquareStack className="mr-2 h-4 w-4" /> 1-by-1
                            </Button>
                        </div>
                    </div>

                    <div className="rounded-[2.5rem] border border-slate-100 bg-white p-10 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                        <h1 className="text-4xl font-black tracking-tight">{assessment.title}</h1>
                        <div className="mt-4 flex flex-wrap gap-3">
                            <Badge variant="secondary" className="rounded-lg px-3 py-1 font-bold">
                                <Info className="mr-1.5 h-3.5 w-3.5" /> {questions.data.length} Questions
                            </Badge>
                        </div>
                    </div>

                    <div className="space-y-12">
                        {questions.data.map((q: any, index: number) => {
                            if (viewMode === 'single' && index !== currentQuestionIndex) return null;

                            return (
                                <section
                                    key={q.id}
                                    ref={(el) => (questionRefs.current[q.id] = el)}
                                    className={cn(
                                        'relative rounded-[3rem] border p-10 transition-all duration-500',
                                        activeQuestionId === q.id || viewMode === 'single'
                                            ? 'border-primary bg-white shadow-2xl ring-8 ring-primary/5 dark:bg-zinc-900'
                                            : 'border-slate-200 bg-white/60 dark:border-zinc-800 dark:bg-zinc-900/50',
                                    )}
                                >
                                    <div className="mb-8 flex items-center justify-between">
                                        <Badge className="rounded-full bg-slate-900 px-5 py-1.5 text-xs font-black uppercase shadow-lg">
                                            Question {index + 1}
                                        </Badge>
                                        {answers[q.id] && (
                                            <div className="flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-[10px] font-black text-green-600 uppercase dark:bg-green-900/30">
                                                <CheckCircle className="h-3 w-3" /> Recorded
                                            </div>
                                        )}
                                    </div>

                                    <QuestionRenderer
                                        question={q}
                                        index={index}
                                        answer={answers[q.id]}
                                        onAnswerChange={updateAnswer}
                                        disabled={isCompleted}
                                    />

                                    {/* NAVIGATION FOR SINGLE VIEW */}
                                    {viewMode === 'single' && (
                                        <div className="mt-12 flex items-center justify-between border-t border-slate-100 pt-8 dark:border-zinc-800">
                                            <Button
                                                variant="outline"
                                                onClick={prevQuestion}
                                                disabled={currentQuestionIndex === 0}
                                                className="h-14 rounded-2xl px-6 font-bold"
                                            >
                                                <ChevronLeft className="mr-2 h-5 w-5" /> Previous
                                            </Button>
                                            <div className="text-sm font-black text-slate-300">
                                                {currentQuestionIndex + 1} / {questions.data.length}
                                            </div>
                                            {currentQuestionIndex === questions.data.length - 1 ? (
                                                <Button onClick={() => setShowSubmitModal(true)} className="h-14 rounded-2xl bg-green-600 px-8 font-bold hover:bg-green-700">
                                                    Review & Submit
                                                </Button>
                                            ) : (
                                                <Button onClick={nextQuestion} className="h-14 rounded-2xl px-8 font-bold">
                                                    Next <ChevronRight className="ml-2 h-5 w-5" />
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </section>
                            );
                        })}
                    </div>

                    {viewMode === 'scroll' && (
                        <div className="rounded-[3rem] border-4 border-dashed border-slate-200 p-16 text-center dark:border-zinc-800">
                            <h2 className="text-3xl font-black text-slate-800 dark:text-zinc-200">All set?</h2>
                            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                                <Button variant="outline" size="lg" onClick={() => setShowReviewModal(true)} className="h-16 rounded-2xl border-2 px-8 text-lg font-bold">
                                    <Search className="mr-2 h-5 w-5" /> Review Summary
                                </Button>
                                <Button size="lg" onClick={() => setShowSubmitModal(true)} className="h-16 rounded-2xl px-12 text-lg font-black shadow-xl">
                                    Final Submit <ChevronRight className="ml-2 h-6 w-6" />
                                </Button>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* FLOATING TOOLS */}
            <div className="fixed right-8 bottom-8 z-50 flex flex-col gap-3">
                <div className="flex flex-col gap-2 rounded-3xl border border-slate-200 bg-white/80 p-2 shadow-2xl backdrop-blur-xl dark:border-zinc-700 dark:bg-zinc-800/80">
                    <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl" onClick={() => setFontSize((s) => Math.min(s + 2, 24))}>
                        <Type className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl" onClick={() => setHighContrast(!highContrast)}>
                        <Contrast className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className={cn('h-12 w-12 rounded-2xl', isFocusMode && 'bg-primary text-white')} onClick={() => setIsFocusMode(!isFocusMode)}>
                        {isFocusMode ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                    </Button>
                </div>
            </div>

            {/* DIALOGS */}
            <Dialog open={showSubmitModal} onOpenChange={setShowSubmitModal}>
                <DialogContent className="rounded-[2.5rem] p-10">
                    <DialogHeader className="text-center">
                        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                            <Save className="h-10 w-10 text-primary" />
                        </div>
                        <DialogTitle className="text-3xl font-black">Ready to finish?</DialogTitle>
                        <DialogDescription className="pt-2 text-lg">
                            {stats.remaining > 0 ? `Careful! You still have ${stats.remaining} unanswered questions.` : "You've answered everything. Ready to submit?"}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-8 gap-3 sm:justify-center">
                        <Button variant="outline" className="h-14 rounded-xl px-8 font-bold" onClick={() => setShowSubmitModal(false)}>Keep Working</Button>
                        <Button className="h-14 rounded-xl px-8 font-bold" onClick={handleFinalSubmit}>Yes, Submit Now</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
                <DialogContent className="max-w-2xl rounded-[2.5rem] p-10">
                    <DialogHeader><DialogTitle className="text-2xl font-black">Review Summary</DialogTitle></DialogHeader>
                    <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                        {questions.data.map((q: any, i: number) => (
                            <button
                                key={q.id}
                                onClick={() => { setShowReviewModal(false); handleNavigateToQuestion(q.id, i); }}
                                className={cn('flex flex-col items-center gap-1 rounded-2xl border-2 p-4 transition-all', answers[q.id] ? 'border-green-500 bg-green-50/50' : 'border-red-200 bg-red-50/50')}
                            >
                                <span className="text-xs font-black text-slate-400 uppercase">Q.{i + 1}</span>
                                {answers[q.id] ? <CheckCircle className="h-5 w-5 text-green-600" /> : <AlertTriangle className="h-5 w-5 text-red-500" />}
                            </button>
                        ))}
                    </div>
                    <DialogFooter className="mt-8">
                        <Button className="h-14 w-full rounded-xl font-bold" onClick={() => setShowReviewModal(false)}>Return to Test</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}