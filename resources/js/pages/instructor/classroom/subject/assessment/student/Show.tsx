import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { 
    CheckCircle2, 
    ChevronLeft, 
    Info, 
    Loader2, 
    Save, 
    AlertCircle, 
    FileText, 
    LayoutList, 
    Eye, 
    Filter, 
    ArrowRight, 
    ArrowLeft 
} from 'lucide-react';
import { useMemo, useState, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';
import { route } from 'ziggy-js';

// ShadCN components
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

import { QuestionRenderer } from './component/questions/QuestionRenderer';
import { calculateAutoScore } from './component/questions/calculateAutoScore';

export default function StudentAssessmentAttemptScoring({ assessment, attempt }) {
    // --- STATE ---
    const [answersState, setAnswersState] = useState(attempt?.answers || []);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeQuestionId, setActiveQuestionId] = useState(null);
    
    // View Customization States
    const [viewMode, setViewMode] = useState('list'); // 'list' | 'single'
    const [filterMode, setFilterMode] = useState('all'); // 'all' | 'needs_review'
    const [currentIndex, setCurrentIndex] = useState(0);

    // --- DATA MAPPING ---
    const answersByQuestionId = useMemo(() => {
        const map = new Map();
        answersState.forEach(a => {
            if (!map.has(a.question_id)) map.set(a.question_id, []);
            map.get(a.question_id).push(a);
        });
        return map;
    }, [answersState]);

    // --- FILTER LOGIC ---
    const visibleQuestions = useMemo(() => {
        let qs = assessment.questions.map((q, index) => ({ ...q, originalIndex: index }));
        
        if (filterMode === 'needs_review') {
            qs = qs.filter(q => {
                // const qAnswers = answersByQuestionId.get(q.id) || [];
                // const hasManual = qAnswers[0]?.manual_score !== undefined && qAnswers[0]?.manual_score !== null && qAnswers[0]?.manual_score !== '';
                // // Filter: Only short answers that haven't been graded yet
                // return q.type === 'short_answer' && !hasManual;
                return q.type === 'short_answer' || 'fill_blank';
            });
        }
        return qs;
    }, [assessment.questions, filterMode, answersByQuestionId]);

    // --- STATS CALCULATION ---
    const stats = useMemo(() => {
        let earned = 0;
        let max = 0;
        let gradedCount = 0;

        assessment.questions.forEach((q) => {
            const qMax = parseFloat(q.point || 0);
            max += qMax;
            
            const qAnswers = answersByQuestionId.get(q.id) || [];
            const manual = qAnswers[0]?.manual_score;
            const hasManual = manual !== undefined && manual !== null && manual !== '';

            if (hasManual) {
                earned += parseFloat(manual);
                gradedCount++;
            } else {
                const auto = calculateAutoScore(q, qAnswers);
                earned += auto.earnedPoints;
                if (q.type !== 'essay') gradedCount++;
            }
        });

        return {
            earned,
            max,
            percentage: max > 0 ? ((earned / max) * 100).toFixed(1) : 0,
            progress: (gradedCount / assessment.questions.length) * 100,
            isComplete: gradedCount === assessment.questions.length
        };
    }, [assessment.questions, answersByQuestionId]);

    // --- EFFECTS ---
    // Keyboard Navigation for Single View
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (viewMode !== 'single') return;
            if (e.key === 'ArrowLeft') setCurrentIndex(prev => Math.max(0, prev - 1));
            if (e.key === 'ArrowRight') setCurrentIndex(prev => Math.min(visibleQuestions.length - 1, prev + 1));
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [viewMode, visibleQuestions.length]);

    // Scroll Spy for List View
    useEffect(() => {
        if (viewMode !== 'list') return;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActiveQuestionId(entry.target.id);
                });
            },
            { threshold: 0.5, rootMargin: "-10% 0px -70% 0px" }
        );

        assessment.questions.forEach((q) => {
            const el = document.getElementById(`q-${q.id}`);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [assessment.questions, viewMode]);

    // --- HANDLERS ---
    const handleTeacherScore = useCallback((questionId, score) => {
        setAnswersState((prev) =>
            prev.map((a) =>
                a.question_id === questionId ? { ...a, manual_score: score } : a
            )
        );
    }, []);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        const answersPayload = assessment.questions.map((q) => {
            const qAnswers = answersByQuestionId.get(q.id) || [];
            const manual = qAnswers[0]?.manual_score;
            const score = (manual !== undefined && manual !== null && manual !== '')
                ? parseFloat(manual)
                : calculateAutoScore(q, qAnswers).earnedPoints;
            return { question_id: q.id, score };
        });

        try {
            await fetch(route('instructor.classes.subjects.assessments.students.store', {
                class: 1, subject: 1, assessment: assessment.id, student: attempt.student_id,
            }), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ student_assessment_attempt_id: attempt?.id, answers: answersPayload }),
            });
            toast.success('Grades synchronized successfully');
        } catch (err) {
            toast.error('Connection error. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
<AppLayout breadcrumbs={[{ title: 'Assessments', href: '/assessments' }, { title: 'Grading' }]}>
    <Head title={`Grading: ${attempt?.student?.name}`} />

    {/* Use bg-background instead of bg-slate-50 */}
    <div className="h-screen absolute top-0 left-0 w-full bg-background pb-32 scroll-smooth overflow-y-scroll">
        
        {/* Hero Header: bg-card and border-border */}
        <div className="border-b border-border bg-card sticky top-0 z-30">
            <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-row items-center gap-4">
                        {/* Muted foreground for secondary text/actions */}
                        <Button variant="ghost" size="sm" className="-ml-2 h-8 gap-1 text-muted-foreground hover:text-foreground" onClick={() => window.history.back()}>
                            <ChevronLeft className="h-4 w-4" /> Back
                        </Button>
                        <h1 className="text-2xl font-black tracking-tight text-title">{attempt.student?.name}</h1>
                        <p className="flex items-center gap-2 text-sm font-medium text-description">
                            <FileText className="h-4 w-4 text-muted-foreground" /> {assessment.title}
                        </p>
                    </div>

                    {/* VIEW CONTROLS: bg-muted for the container */}
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex rounded-xl border border-border bg-muted p-1 shadow-sm">
                            <Button 
                                variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
                                size="sm" 
                                className={`h-8 px-3 rounded-lg ${viewMode === 'list' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}
                                onClick={() => setViewMode('list')}
                            >
                                <LayoutList className="mr-2 h-4 w-4" /> List
                            </Button>
                            <Button 
                                variant={viewMode === 'single' ? 'secondary' : 'ghost'} 
                                size="sm" 
                                className={`h-8 px-3 rounded-lg ${viewMode === 'single' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}
                                onClick={() => setViewMode('single')}
                            >
                                <Eye className="mr-2 h-4 w-4" /> One by One
                            </Button>
                        </div>

                        <div className="flex rounded-xl border border-border bg-muted p-1 shadow-sm">
                            <Button 
                                variant={filterMode === 'all' ? 'secondary' : 'ghost'} 
                                size="sm" 
                                className={`h-8 px-3 rounded-lg ${filterMode === 'all' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}
                                onClick={() => setFilterMode('all')}
                            >
                                All
                            </Button>
                            <Button 
                                variant={filterMode === 'needs_review' ? 'secondary' : 'ghost'} 
                                size="sm" 
                                className={`h-8 px-3 rounded-lg ${filterMode === 'needs_review' ? 'bg-card shadow-sm text-amber-500' : 'text-muted-foreground'}`}
                                onClick={() => setFilterMode('needs_review')}
                            >
                                <Filter className="mr-2 h-3 w-3" /> Needs Review
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="mx-auto mt-8 max-w-6xl px-4 sm:px-6">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                
                {/* SIDEBAR NAVIGATION */}
                <aside className="hidden lg:col-span-3 lg:block">
                    <div className="sticky top-32 space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                <span>Grading Progress</span>
                                <span>{Math.round(stats.progress)}%</span>
                            </div>
                            {/* Progress component usually tracks theme automatically, but bg-muted ensures visibility */}
                            <Progress value={stats.progress} className="h-2 bg-muted" />
                        </div>

                        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                            <p className="mb-4 text-[10px] font-bold uppercase tracking-wider text-description">Question Map</p>
                            <nav className="grid grid-cols-4 gap-2">
                                {assessment.questions.map((q, i) => {
                                    const qAnswers = answersByQuestionId.get(q.id) || [];
                                    const isManual = qAnswers[0]?.manual_score != null;
                                    const isEssay = q.type === 'essay';
                                    
                                    const isActive = viewMode === 'list' 
                                        ? activeQuestionId === `q-${q.id}`
                                        : visibleQuestions[currentIndex]?.id === q.id;

                                    return (
                                        <button 
                                            key={q.id} 
                                            onClick={() => {
                                                if (viewMode === 'single') {
                                                    const idx = visibleQuestions.findIndex(vq => vq.id === q.id);
                                                    if (idx !== -1) setCurrentIndex(idx);
                                                } else {
                                                    document.getElementById(`q-${q.id}`)?.scrollIntoView({ behavior: 'smooth' });
                                                }
                                            }}
                                            className={`relative flex h-10 w-full items-center justify-center rounded-lg border-2 text-xs font-bold transition-all
                                                ${isActive ? 'scale-110 ring-2 ring-primary/20 ring-offset-2 z-10' : 'hover:border-primary/50'}
                                                ${isManual ? 'border-primary/20 bg-primary/10 text-primary' : 
                                                  isEssay ? 'border-amber-500/20 bg-amber-500/10 text-amber-500' : 
                                                  'border-muted bg-muted text-muted-foreground'}`}
                                        >
                                            {i + 1}
                                            {isActive && <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary" />}
                                        </button>
                                    );
                                })}
                            </nav>
                            
                            <div className="mt-6 space-y-2 border-t border-border pt-4">
                                <LegendItem color="bg-primary" label="Graded" />
                                <LegendItem color="bg-amber-500" label="Essay (Needs Review)" />
                                <LegendItem color="bg-muted-foreground" label="Auto-graded" />
                            </div>
                        </div>
                    </div>
                </aside>

                {/* MAIN CONTENT AREA */}
                <div className="space-y-8 lg:col-span-9">
                    {visibleQuestions.length === 0 ? (
                        <Card className="flex flex-col items-center justify-center py-20 text-center border-dashed border-2 bg-card border-border">
                            <div className="rounded-full bg-success/10 p-4 mb-4">
                                <CheckCircle2 className="h-10 w-10 text-success" />
                            </div>
                            <h3 className="text-xl font-bold text-title">All caught up!</h3>
                            <p className="text-description max-w-xs mt-2">There are no questions that match your current filter.</p>
                            <Button variant="outline" className="mt-6 border-border" onClick={() => setFilterMode('all')}>
                                Show All Questions
                            </Button>
                        </Card>
                    ) : (
                        <>
                            {viewMode === 'list' ? (
                                <div className="space-y-8">
                                    {visibleQuestions.map((question) => (
                                        <QuestionCard 
                                            key={question.id} 
                                            question={question} 
                                            index={question.originalIndex}
                                            answers={answersByQuestionId.get(question.id) || []}
                                            onTeacherScore={handleTeacherScore}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <QuestionCard 
                                        question={visibleQuestions[currentIndex]} 
                                        index={visibleQuestions[currentIndex].originalIndex}
                                        answers={answersByQuestionId.get(visibleQuestions[currentIndex].id) || []}
                                        onTeacherScore={handleTeacherScore}
                                    />
                                    
                                    {/* Pager Controls */}
                                    <div className="flex items-center justify-between rounded-2xl bg-card p-4 border border-border shadow-sm">
                                        <Button 
                                            variant="ghost" 
                                            className="font-bold text-body"
                                            disabled={currentIndex === 0}
                                            onClick={() => setCurrentIndex(prev => prev - 1)}
                                        >
                                            <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                                        </Button>
                                        
                                        <div className="flex items-center gap-2">
                                            {visibleQuestions.map((_, i) => (
                                                <div 
                                                    key={i} 
                                                    className={`h-1.5 rounded-full transition-all ${i === currentIndex ? 'w-8 bg-primary' : 'w-2 bg-muted'}`} 
                                                />
                                            ))}
                                        </div>

                                        <Button 
                                            variant="ghost" 
                                            className="font-bold text-primary"
                                            disabled={currentIndex === visibleQuestions.length - 1}
                                            onClick={() => setCurrentIndex(prev => prev + 1)}
                                        >
                                            Next <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>

        {/* FLOATING ACTION FOOTER */}
        <div className="fixed bottom-6 left-1/2 z-50 w-full max-w-3xl -translate-x-1/2 px-4">
            <div className="flex items-center justify-between rounded-2xl border border-border bg-card/90 p-3 shadow-2xl backdrop-blur-md">
                <div className="flex items-center gap-6 pl-4">
                    <div>
                        <p className="text-[10px] font-black tracking-widest text-description uppercase">Current Total</p>
                        <p className="text-lg font-black text-title">{stats.earned} <span className="text-description text-sm font-normal">/ {stats.max}</span></p>
                    </div>
                    <Separator orientation="vertical" className="h-10 bg-border" />
                    <div className="hidden sm:block">
                        {stats.isComplete ? (
                            <Badge className="bg-success/10 text-success hover:bg-success/20 border-none px-3 py-1">
                                <CheckCircle2 className="mr-1 h-3 w-3" /> Fully Graded
                            </Badge>
                        ) : (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger className="flex items-center gap-1 text-xs font-bold text-amber-500">
                                        <AlertCircle className="h-4 w-4" /> Needs Manual Scoring
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-popover text-popover-foreground border-border">Ensure all essay questions have a score.</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button 
                        onClick={handleSubmit} 
                        disabled={isSubmitting} 
                        className={`rounded-xl px-8 font-black transition-all shadow-lg ${stats.isComplete ? 'bg-primary text-primary-foreground hover:opacity-90' : 'bg-secondary text-secondary-foreground'}`}
                    >
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Finalize Grade
                    </Button>
                </div>
            </div>
        </div>
    </div>
</AppLayout>
    );
}

/**
 * Question Card Sub-component
 */
function QuestionCard({ question, index, answers, onTeacherScore }) {
    return (
        <section id={`q-${question.id}`} className="scroll-mt-32">
            <Card className="overflow-hidden border-none shadow-sm ring-1 ring-border transition-all focus-within:ring-2 focus-within:ring-primary hover:shadow-md bg-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-border px-6 py-4">
                    <div className="flex items-center gap-3">
                        {/* Use primary or title background for the index circle */}
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-title text-sm font-bold text-card shadow-sm">
                            {index + 1}
                        </span>
                        <CardTitle className="text-sm font-bold text-subtitle capitalize">
                            {question.type.replace('_', ' ')}
                        </CardTitle>
                    </div>
                    <Badge variant="secondary" className="bg-muted text-muted-foreground font-bold uppercase tracking-tight">
                        {question.point} Points
                    </Badge>
                </CardHeader>
                <CardContent className="p-6">
                    <QuestionRenderer
                        question={question}
                        answers={answers}
                        onTeacherScore={onTeacherScore}
                    />
                </CardContent>
            </Card>
        </section>
    );
}

function LegendItem({ color, label }) {
    return (
        <div className="flex items-center gap-2 text-[11px] font-medium text-description">
            <div className={`h-2 w-2 rounded-full ${color}`} />
            <span>{label}</span>
        </div>
    );
}