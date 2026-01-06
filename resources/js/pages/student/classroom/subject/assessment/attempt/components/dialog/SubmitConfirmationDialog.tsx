import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { AttemptStats } from '@/types/student/assessment';
import { Save, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

interface SubmitConfirmationDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    stats: AttemptStats;
    onConfirm: () => void;
}

export function SubmitConfirmationDialog({
    isOpen,
    onOpenChange,
    stats,
    onConfirm,
}: SubmitConfirmationDialogProps) {
    const isIncomplete = stats.remaining > 0;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="  max-w-md overflow-hidden rounded-[3rem] border-none p-0 shadow-3xl">
                {/* Visual Header - Dynamic Color based on completion */}
                <div className={cn(
                    "flex flex-col items-center justify-center p-10 text-center transition-colors duration-500",
                    isIncomplete 
                        ? "bg-amber-50 dark:bg-amber-900/20" 
                        : "bg-indigo-50 dark:bg-indigo-900/20"
                )}>
                    <div className={cn(
                        "mb-6 flex h-16 w-16 sm:h-24 sm:w-24 items-center justify-center rounded-full shadow-inner",
                        isIncomplete ? "bg-amber-100 text-amber-600" : "bg-indigo-100 text-indigo-600"
                    )}>
                        {isIncomplete ? (
                            <AlertCircle className="h-8 w-8 sm:h-12 sm:w-12 animate-pulse" />
                        ) : (
                            <CheckCircle2 className="h-8 w-8 sm:h-12 sm:w-12" />
                        )}
                    </div>
                    
                    <DialogTitle className="text-xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                        {isIncomplete ? "Hold on a second!" : "All set to finish?"}
                    </DialogTitle>
                    
                    <DialogDescription className={cn(
                        "mt-4 text-balance text-md sm:text-lg font-medium",
                        isIncomplete ? "text-amber-700/80" : "text-indigo-700/80"
                    )}>
                        {isIncomplete
                            ? `You still have ${stats.remaining} questions left unanswered. Submitting now might affect your final score.`
                            : "You've completed all questions! Your hard work is ready to be graded."}
                    </DialogDescription>
                </div>

                <div className="bg-white p-8 dark:bg-zinc-900">
                    {/* Progress Breakdown */}
                    <div className="mb-4 sm:mb-8 flex justify-center gap-8">
                        <div className="text-center">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Completed</p>
                            <p className="text-2xl font-black text-slate-900 dark:text-white">{stats.total - stats.remaining}</p>
                        </div>
                        <div className="h-10 w-px bg-slate-100 dark:bg-zinc-800" />
                        <div className="text-center">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total</p>
                            <p className="text-2xl font-black text-slate-900 dark:text-white">{stats.total}</p>
                        </div>
                    </div>

                    <DialogFooter className="flex flex-col gap-3 sm:flex-col">
                        <Button
                            className={cn(
                                "h-16 w-full rounded-2xl text-md sm:text-lg font-black transition-all active:scale-95",
                                isIncomplete 
                                    ? "bg-slate-900 text-white hover:bg-slate-800" 
                                    : "bg-indigo-600 text-white shadow-xl shadow-indigo-200 hover:bg-indigo-700 dark:shadow-none"
                            )}
                            onClick={onConfirm}
                        >
                            Confirm Submission <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        
                        <Button
                            variant="ghost"
                            className="h-14 w-full rounded-2xl font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-zinc-800"
                            onClick={() => onOpenChange(false)}
                        >
                            Go Back & Review
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}