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
    onSubmit: () => void; // Added for a direct finish path
}

export function ReviewSummaryDialog({
    isOpen,
    onOpenChange,
    questions,
    answers,
    onNavigateToQuestion,
    onSubmit
}: ReviewSummaryDialogProps) {
    const totalQuestions = questions.length;
    const answeredCount = Object.keys(answers).length;
    const missingCount = totalQuestions - answeredCount;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl overflow-hidden rounded-[3rem] p-0 border-none shadow-2xl">
                {/* Header Section with Stats */}
                <div className="bg-slate-900 p-8 text-white dark:bg-zinc-950">
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-black tracking-tight">
                            Review Summary
                        </DialogTitle>
                    </DialogHeader>
                    
                    <div className="mt-6 flex items-center gap-6">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Answered</span>
                            <span className="text-2xl font-black text-emerald-400">{answeredCount}</span>
                        </div>
                        <div className="h-10 w-px bg-slate-800" />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Missing</span>
                            <span className={cn(
                                "text-2xl font-black",
                                missingCount > 0 ? "text-orange-400" : "text-slate-500"
                            )}>
                                {missingCount}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    <h4 className="mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        <ListFilter className="h-3 w-3" /> Question Status
                    </h4>
                    
                    {/* Navigation Grid */}
                    <div className="grid max-h-[40vh] grid-cols-4 gap-3 overflow-y-auto pr-2 sm:grid-cols-5 md:grid-cols-6 custom-scrollbar">
                        {questions.map((q, i) => {
                            const isAnswered = !!answers[q.id];
                            
                            return (
                                <button
                                    key={q.id}
                                    onClick={() => {
                                        onOpenChange(false);
                                        onNavigateToQuestion(q.id, i);
                                    }}
                                    className={cn(
                                        'group relative flex h-14 flex-col items-center justify-center rounded-2xl border-2 transition-all duration-200 active:scale-90',
                                        isAnswered
                                            ? 'border-emerald-100 bg-emerald-50/50 hover:border-emerald-500'
                                            : 'border-orange-100 bg-orange-50/30 hover:border-orange-500'
                                    )}
                                >
                                    <span className="text-[10px] font-bold text-slate-400">
                                        {i + 1}
                                    </span>
                                    {isAnswered ? (
                                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                    ) : (
                                        <AlertCircle className="h-4 w-4 text-orange-500 animate-pulse" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    <DialogFooter className="mt-10 flex-col gap-3 sm:flex-row">
                        <Button
                            variant="ghost"
                            className="h-14 flex-1 rounded-2xl font-bold text-slate-500"
                            onClick={() => onOpenChange(false)}
                        >
                            Keep Editing
                        </Button>
                        <Button
                            className={cn(
                                "h-14 flex-[2] rounded-2xl font-black text-lg shadow-xl transition-all",
                                missingCount === 0 
                                    ? "bg-indigo-600 hover:bg-indigo-700 text-white" 
                                    : "bg-slate-200 text-slate-400"
                            )}
                            disabled={missingCount > 0}
                            onClick={onSubmit}
                        >
                            {missingCount === 0 ? "Submit Final Answers" : "Complete All Questions"}
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </DialogFooter>
                    
                    {missingCount > 0 && (
                        <p className="mt-4 text-center text-[10px] font-bold uppercase tracking-widest text-orange-500">
                            You have {missingCount} unanswered questions remaining
                        </p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}