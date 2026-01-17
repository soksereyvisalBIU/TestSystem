import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Question } from '@/types/student/assessment';
import { AlertCircle, CheckCircle2, ListFilter, ArrowRight } from 'lucide-react';

interface ReviewSummaryDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    questions: Question[];
    answers: Record<string, any>;
    onNavigateToQuestion: (id: number, index: number) => void;
    onSubmit: () => void;
}

export function ReviewSummaryDialog({
    isOpen,
    onOpenChange,
    questions,
    answers,
    onNavigateToQuestion,
    onSubmit,
}: ReviewSummaryDialogProps) {
    // Memoize calculations to prevent unnecessary logic on re-renders
    const { answeredCount, missingCount, totalQuestions } = useMemo(() => {
        const total = questions.length;
        const answered = Object.keys(answers).length;
        return {
            totalQuestions: total,
            answeredCount: answered,
            missingCount: total - answered,
        };
    }, [questions, answers]);

    const isComplete = missingCount === 0;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl overflow-hidden border-none bg-background p-0 shadow-2xl sm:rounded-[2rem]">
                {/* Header Section: High Contrast for quick status reading */}
                <div className="bg-slate-900 p-6 text-white dark:bg-zinc-950 sm:p-8">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black tracking-tight sm:text-3xl">
                            Review Summary
                        </DialogTitle>
                    </DialogHeader>
                    
                    <div className="mt-6 flex items-center gap-8">
                        <StatusStat label="Answered" count={answeredCount} colorClass="text-emerald-400" />
                        <div className="h-10 w-px bg-slate-800" aria-hidden="true" />
                        <StatusStat 
                            label="Remaining" 
                            count={missingCount} 
                            colorClass={missingCount > 0 ? "text-orange-400" : "text-slate-500"} 
                        />
                    </div>
                </div>

                <div className="p-6 sm:p-8">
                    <div className="mb-4 flex items-center justify-between">
                        <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                            <ListFilter className="h-3 w-3" /> Question Status
                        </h4>
                        <span className="text-[10px] font-medium text-muted-foreground">
                            Click a number to jump to question
                        </span>
                    </div>
                    
                    {/* Navigation Grid: Optimized for touch and scroll */}
                    <div className="custom-scrollbar grid max-h-[35vh] grid-cols-4 gap-3 overflow-y-auto pr-2 sm:grid-cols-5 md:grid-cols-6">
                        {questions.map((q, i) => (
                            <QuestionStatusButton
                                key={q.id}
                                index={i}
                                isAnswered={!!answers[q.id]}
                                onClick={() => {
                                    onOpenChange(false);
                                    onNavigateToQuestion(q.id, i);
                                }}
                            />
                        ))}
                    </div>

                    <DialogFooter className="mt-8 flex-col gap-3 sm:flex-row">
                        <Button
                            variant="outline"
                            className="h-14 flex-1 rounded-xl font-bold border-slate-200 hover:bg-slate-50 dark:border-slate-800"
                            onClick={() => onOpenChange(false)}
                        >
                            Back to Exam
                        </Button>
                        <Button
                            className={cn(
                                "h-14 flex-[2] rounded-xl font-black text-lg shadow-lg transition-all active:scale-[0.98]",
                                isComplete 
                                    ? "bg-indigo-600 hover:bg-indigo-700 text-white" 
                                    : "bg-slate-100 text-slate-400 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
                            )}
                            onClick={onSubmit}
                        >
                            {isComplete ? "Submit Final Exam" : "Finish Anyway"}
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </DialogFooter>
                    
                    {missingCount > 0 && (
                        <div className="mt-4 flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-1">
                            <AlertCircle className="h-3 w-3 text-orange-500" />
                            <p className="text-[10px] font-bold uppercase tracking-widest text-orange-500">
                                {missingCount} questions require your attention
                            </p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

/** * Sub-components to keep the main render clean 
 */

function StatusStat({ label, count, colorClass }: { label: string; count: number; colorClass: string }) {
    return (
        <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</span>
            <span className={cn("text-2xl font-black sm:text-3xl", colorClass)}>{count}</span>
        </div>
    );
}

function QuestionStatusButton({ 
    index, 
    isAnswered, 
    onClick 
}: { 
    index: number; 
    isAnswered: boolean; 
    onClick: () => void 
}) {
    return (
        <button
            onClick={onClick}
            aria-label={`Go to question ${index + 1}`}
            className={cn(
                'group relative flex h-14 flex-col items-center justify-center rounded-xl border-2 transition-all duration-200 hover:shadow-md active:scale-95',
                isAnswered
                    ? 'border-emerald-100 bg-emerald-50/50 hover:border-emerald-500 dark:border-emerald-900/30 dark:bg-emerald-900/10'
                    : 'border-orange-100 bg-orange-50/30 hover:border-orange-500 dark:border-orange-900/30 dark:bg-orange-900/10'
            )}
        >
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                {index + 1}
            </span>
            {isAnswered ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />
            ) : (
                <AlertCircle className="h-4 w-4 text-orange-500 animate-pulse" />
            )}
        </button>
    );
}