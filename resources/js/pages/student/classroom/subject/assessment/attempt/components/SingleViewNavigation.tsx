import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
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
        <div className="mt-12 flex items-center justify-between border-t border-border pt-8 transition-colors">
            {/* Previous Button */}

            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        onClick={onPrevious}
                        disabled={isFirstQuestion}
                        className="h-12 rounded-2xl px-3 sm:px-6 font-bold text-description hover:bg-accent hover:text-accent-foreground disabled:opacity-30"
                    >
                        <ChevronLeft className="mr-2 h-5 w-5" /> <span className='hidden sm:block'>Previous</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent
                    side="bottom"
                    className="border-none bg-slate-900 text-[10px] text-white"
                >
                    Shortcut:{' '}
                    <kbd className="ml-1 rounded bg-slate-700 px-1">
                        Alt + ←
                    </kbd>
                </TooltipContent>
            </Tooltip>

            {/* Central Counter: Progress Indicator */}
            <div className="flex flex-col items-center gap-2">
                <div className="rounded-full bg-muted px-4 py-1.5 text-[10px] font-black tracking-widest text-description uppercase flex gap-2">
                    <span className='hidden sm:block'>Question</span> <span>{currentIndex + 1} of {totalQuestions}</span>
                </div>
                <div className="flex gap-1">
                    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-primary/10">
                        <div
                            className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
                            style={{
                                width: `${((currentIndex + 1) / totalQuestions) * 100}%`,
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Action Button: Dynamic Content */}
            {isLastQuestion ? (
                <Button
                    onClick={onSubmit}
                    className="h-12  rounded-2xl bg-emerald-600 px-4 sm:px-8 font-black text-white shadow-none transition-transform hover:bg-emerald-700 active:scale-95 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                >
                    <CheckCircle2 className=" sm:mr-2 h-5 w-5" /> <span className='hidden sm:block'>Finish &</span> Submit
                </Button>
            ) : (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            onClick={onNext}
                            className="h-12 rounded-2xl bg-title px-10 font-black text-background transition-all hover:opacity-90 active:scale-95"
                        >
                            Next <span className='hidden :block'>Question</span>
                            <ChevronRight className="ml-2 h-5 w-5" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent
                        side="bottom"
                        className="border-none bg-slate-900 text-[10px] text-white"
                    >
                        Shortcut:{' '}
                        <kbd className="ml-1 rounded bg-slate-700 px-1">
                            Alt + →
                        </kbd>
                    </TooltipContent>
                </Tooltip>
            )}
        </div>
    );
}
