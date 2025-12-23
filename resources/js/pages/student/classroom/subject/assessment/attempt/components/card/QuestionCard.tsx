import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Question } from '@/types/student/assessment';
import { CheckCircle2, Circle } from 'lucide-react';

interface QuestionCardProps {
    question: Question;
    index: number;
    answer: any;
    isActive: boolean;
    isCompleted: boolean;
    viewMode: 'scroll' | 'single';
    onAnswerChange: (id: string, value: any) => void;
    questionRef?: (el: HTMLDivElement | null) => void;
    renderQuestion: (
        question: Question,
        index: number,
        answer: any,
        onAnswerChange: (id: string, value: any) => void,
        disabled: boolean,
    ) => React.ReactNode;
}

export function QuestionCard({
    question,
    index,
    answer,
    isActive,
    isCompleted,
    viewMode,
    onAnswerChange,
    questionRef,
    renderQuestion,
}: QuestionCardProps) {
    const hasAnswer = !!answer;

    return (
        <section
            ref={questionRef}
            className={cn(
                'relative overflow-hidden rounded-[3rem] border p-8 transition-all duration-700 ease-in-out md:p-12',
                // Active State: High focus, shadow, and ring
                isActive || viewMode === 'single'
                    ? 'border-indigo-200 bg-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] ring-1 ring-indigo-500/10 dark:border-indigo-900 dark:bg-zinc-900'
                    : 'border-slate-200 bg-white/40 opacity-60 grayscale-[0.5] hover:opacity-100 hover:grayscale-0 dark:border-zinc-800 dark:bg-zinc-900/50',
                // Completed/Submitted state
                isCompleted && 'pointer-events-none opacity-90'
            )}
        >
            {/* Subtle Gradient Glow for Active Question */}
            {(isActive || viewMode === 'single') && (
                <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
            )}

            <div className="mb-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Badge className={cn(
                        "rounded-xl px-4 py-1.5 text-xs font-black uppercase transition-colors duration-300",
                        isActive || viewMode === 'single' 
                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" 
                            : "bg-slate-200 text-slate-500"
                    )}>
                        Item {index + 1}
                    </Badge>
                    
                    {/* Visual Progress Dot */}
                    <div className="hidden items-center gap-1 md:flex">
                        <div className={cn("h-1.5 w-1.5 rounded-full", hasAnswer ? "bg-emerald-500" : "bg-slate-200")} />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                            {hasAnswer ? 'Ready' : 'Pending'}
                        </span>
                    </div>
                </div>

                {/* Response Status Indicator */}
                <div className={cn(
                    "flex items-center gap-2 rounded-2xl px-4 py-2 text-[10px] font-black uppercase transition-all duration-500",
                    hasAnswer 
                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20" 
                        : "bg-slate-50 text-slate-400 dark:bg-zinc-800"
                )}>
                    {hasAnswer ? (
                        <>
                            <CheckCircle2 className="h-3.5 w-3.5" /> 
                            <span>Selection Saved</span>
                        </>
                    ) : (
                        <>
                            <Circle className="h-3.5 w-3.5" />
                            <span>Unanswered</span>
                        </>
                    )}
                </div>
            </div>

            {/* Question Content Injection */}
            <div className={cn(
                "transition-transform duration-500",
                isActive ? "scale-100" : "scale-[0.98]"
            )}>
                {renderQuestion(
                    question,
                    index,
                    answer,
                    onAnswerChange,
                    isCompleted,
                )}
            </div>

            {/* Subtle Focus Overlay for Non-active cards */}
            {!isActive && viewMode === 'scroll' && (
                <div className="absolute inset-0 z-10 cursor-pointer" />
            )}
        </section>
    );
}