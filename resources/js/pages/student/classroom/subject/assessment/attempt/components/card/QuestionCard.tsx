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
                'relative overflow-hidden rounded-[3rem] border p-8 transition-all duration-500 ease-in-out md:p-12',
                // Theme-aware states
                isActive || viewMode === 'single'
                    ? 'border-primary/30 bg-card shadow-2xl shadow-primary/5 ring-1 ring-primary/5'
                    : 'border-border bg-card/40 opacity-60 grayscale-[0.3] hover:opacity-100 hover:grayscale-0',
                // Submitted/Disabled state
                isCompleted && 'pointer-events-none opacity-90'
            )}
        >
            {/* Top Indicator Line */}
            {(isActive || viewMode === 'single') && (
                <div className="absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
            )}

            <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Badge className={cn(
                        "rounded-xl px-4 py-1.5 text-xs font-black uppercase transition-all duration-300",
                        isActive || viewMode === 'single' 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-muted text-description"
                    )}>
                        Qustion {index + 1}
                    </Badge>
                    
                    {/* Visual Progress Dot */}
                    <div className="hidden items-center gap-1.5 md:flex">
                        <div className={cn(
                            "h-2 w-2 rounded-full transition-colors", 
                            hasAnswer ? "bg-emerald-500" : "bg-muted-foreground/30"
                        )} />
                        <span className="text-[10px] font-bold text-description uppercase tracking-wider">
                            {hasAnswer ? 'Ready' : 'Pending'}
                        </span>
                    </div>
                </div>

                {/* Response Status Indicator */}
                <div className={cn(
                    "flex items-center gap-2 rounded-2xl px-4 py-2 text-[10px] font-black uppercase transition-all duration-500",
                    hasAnswer 
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                        : "bg-muted text-description/70"
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

            {/* Question Content */}
            <div className={cn(
                "transition-transform duration-500",
                isActive ? "scale-100" : "scale-[0.99]"
            )}>
                {renderQuestion(
                    question,
                    index,
                    answer,
                    onAnswerChange,
                    isCompleted,
                )}
            </div>

            {/* Inactive Overlay for Scroll View */}
            {!isActive && viewMode === 'scroll' && (
                <div className="absolute inset-0 z-10 cursor-pointer" />
            )}
        </section>
    );
}