import React, { useState, useCallback } from 'react';
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
import { AlertCircle, CheckCircle2, ArrowRight, Loader2, AlertTriangle } from 'lucide-react';

interface SubmitConfirmationDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    stats: AttemptStats;
    onConfirm: () => Promise<void> | void;
    isLoading?: boolean; // Prop-driven loading state from parent (e.g. Inertia processing)
}

export function SubmitConfirmationDialog({
    isOpen,
    onOpenChange,
    stats,
    onConfirm,
    isLoading: externalLoading = false,
}: SubmitConfirmationDialogProps) {
    const [internalSubmitting, setInternalSubmitting] = useState(false);
    const [hasError, setHasError] = useState(false);

    const isSubmitting = internalSubmitting || externalLoading;
    const isIncomplete = stats.remaining > 0;
    const answeredCount = stats.total - stats.remaining;

    const handleSubmit = useCallback(async () => {
        if (isSubmitting) return;

        setHasError(false);
        setInternalSubmitting(true);
        
        try {
            await onConfirm();
            // Note: If onConfirm triggers a page redirect (Inertia), 
            // the component unmounts naturally.
        } catch (error) {
            setHasError(true);
            console.error('[AssessmentSubmitError]:', error);
        } finally {
            setInternalSubmitting(false);
        }
    }, [isSubmitting, onConfirm]);

    return (
        <Dialog  open={isOpen} onOpenChange={(open) => !isSubmitting && onOpenChange(open)}>
            <DialogContent className="max-w-md overflow-hidden border-none p-0 shadow-2xl sm:rounded-[2.5rem]">
                
                {/* Visual Header: Context-aware styling */}
                <div
                    className={cn(
                        "flex flex-col items-center justify-center p-8 text-center transition-colors duration-500 sm:p-10",
                        isIncomplete
                            ? "bg-amber-50 dark:bg-amber-950/30"
                            : "bg-indigo-50 dark:bg-indigo-950/30"
                    )}
                >
                    <div
                        className={cn(
                            "mb-6 flex h-20 w-20 items-center justify-center rounded-full shadow-sm ring-8",
                            isIncomplete
                                ? "bg-amber-100 text-amber-600 ring-amber-50 dark:bg-amber-900/50 dark:ring-amber-900/20"
                                : "bg-indigo-100 text-indigo-600 ring-indigo-50 dark:bg-indigo-900/50 dark:ring-indigo-900/20"
                        )}
                    >
                        {isIncomplete ? (
                            <AlertCircle className="h-10 w-10 animate-pulse" />
                        ) : (
                            <CheckCircle2 className="h-10 w-10" />
                        )}
                    </div>

                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                            {isIncomplete ? "Finish anyway?" : "Ready to submit?"}
                        </DialogTitle>
                    </DialogHeader>

                    <DialogDescription
                        className={cn(
                            "mt-4 px-2 text-pretty text-base font-medium",
                            isIncomplete ? "text-amber-800/80 dark:text-amber-200/60" : "text-indigo-800/80 dark:text-indigo-200/60"
                        )}
                    >
                        {isIncomplete
                            ? `You have ${stats.remaining} unanswered questions. Your score may be significantly lower if you submit now.`
                            : "Excellent! You've tackled every question. Once you submit, you won't be able to change your answers."}
                    </DialogDescription>
                </div>

                {/* Content Body */}
                <div className="bg-white px-8 py-8 dark:bg-zinc-900">
                    
                    {/* Simplified Stats Grid */}
                    <div className="mb-8 flex items-center justify-center gap-12">
                        <StatItem label="Answered" value={answeredCount} />
                        <div className="h-8 w-px bg-slate-100 dark:bg-zinc-800" aria-hidden="true" />
                        <StatItem label="Total Questions" value={stats.total} />
                    </div>

                    {/* Submit Actions */}
                    <div className="space-y-3">
                        {hasError && (
                            <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-600 dark:bg-red-900/20">
                                <AlertTriangle className="h-4 w-4" />
                                Submission failed. Please check your connection and try again.
                            </div>
                        )}

                        <Button
                            disabled={isSubmitting}
                            onClick={handleSubmit}
                            className={cn(
                                "group h-16 w-full rounded-2xl text-lg font-black transition-all active:scale-[0.98]",
                                isIncomplete
                                    ? "bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900"
                                    : "bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 dark:shadow-none"
                            )}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Finalizing...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    Confirm Submission
                                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </span>
                            )}
                        </Button>

                        <Button
                            variant="ghost"
                            disabled={isSubmitting}
                            className="h-14 w-full rounded-2xl font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-zinc-800"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

/** * Scoped sub-component for statistics 
 */
function StatItem({ label, value }: { label: string; value: number }) {
    return (
        <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-tighter text-slate-400">
                {label}
            </p>
            <p className="text-3xl font-black text-slate-900 dark:text-white">
                {value}
            </p>
        </div>
    );
}