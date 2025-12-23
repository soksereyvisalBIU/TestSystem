import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

interface SingleViewNavigationProps {
    currentIndex: number;
    totalQuestions: number;
    onPrevious: () => void;
    onNext: () => void;
    onSubmit: () => void;
    isFirstQuestion: boolean;
    isLastQuestion: boolean;
}

export function SingleViewNavigation({
    currentIndex,
    totalQuestions,
    onPrevious,
    onNext,
    onSubmit,
    isFirstQuestion,
    isLastQuestion,
}: SingleViewNavigationProps) {
    return (
        <div className="mt-12 flex items-center justify-between border-t border-slate-100 pt-8 dark:border-zinc-800">
            {/* Previous Button: Subtle but accessible */}
            <Button
                variant="ghost"
                onClick={onPrevious}
                disabled={isFirstQuestion}
                className="h-14 rounded-2xl px-6 font-bold text-slate-500 hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-zinc-800"
            >
                <ChevronLeft className="mr-2 h-5 w-5" /> Previous
            </Button>

            {/* Central Counter: Progress Indicator */}
            <div className="flex flex-col items-center gap-1">
                <div className="rounded-full bg-slate-100 px-4 py-1.5 text-[10px] font-black tracking-widest text-slate-500 uppercase dark:bg-zinc-800">
                    Question {currentIndex + 1} of {totalQuestions}
                </div>
                <div className="flex gap-1">
                    {/* Optional: Tiny dot indicator for quick visual context */}
                    <div className="h-1 w-12 rounded-full bg-primary/20">
                        <div 
                            className="h-full rounded-full bg-primary transition-all duration-300" 
                            style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Action Button: Dynamic Color Shift */}
            {isLastQuestion ? (
                <Button
                    onClick={onSubmit}
                    className="h-14 rounded-2xl bg-emerald-600 px-8 font-black text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700 dark:shadow-none"
                >
                    <CheckCircle2 className="mr-2 h-5 w-5" /> Finish & Submit
                </Button>
            ) : (
                <Button
                    onClick={onNext}
                    className="h-14 rounded-2xl bg-slate-900 px-10 font-black text-white shadow-xl shadow-slate-200 transition-all hover:-translate-x-1 hover:bg-slate-800 dark:bg-white dark:text-black dark:shadow-none"
                >
                    Next Question <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
            )}
        </div>
    );
}