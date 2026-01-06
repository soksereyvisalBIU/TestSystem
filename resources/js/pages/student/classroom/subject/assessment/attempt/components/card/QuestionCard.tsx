import { cn } from '@/lib/utils';
import { Question } from '@/types/student/assessment';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Info, Layers, Target } from 'lucide-react';
import React from 'react';

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
    onAnswerChange,
    questionRef,
    renderQuestion,
}: QuestionCardProps) {
    const hasAnswer = !!answer;

    return (
        <motion.section
            ref={questionRef}
            initial={false}
            className={cn(
                'relative grid grid-cols-1 overflow-hidden transition-all duration-500',
                'rounded-2xl xs:rounded-[2.5rem] border',
                'md:grid-cols-[200px_1fr]',
                'border-primary/30 bg-card shadow-xl ring-1 ring-primary/10' 
                // isActive 
                //     ? 'border-primary/30 bg-card shadow-xl ring-1 ring-primary/10' 
                //     : 'border-border/50 bg-muted/20 opacity-80'
            )}
        >
            {/* LEFT SIDEBAR / TOP HEADER (Responsive) */}
            <div
                className={cn(
                    'relative flex flex-row md:flex-col justify-between items-center md:items-start p-4 xs:p-6 md:p-10 gap-4',
                    'bg-primary/[0.03]',
                    // isActive ? 'bg-primary/[0.03]' : 'bg-transparent',
                    'border-b md:border-b-0 md:border-r border-border/50'
                )}
            >
                {/* ID & Info Group */}
                <div className="flex md:flex-col items-center md:items-start gap-3 md:gap-8 w-full md:w-auto">
                    {/* Index Square */}
                    <div className="shrink-0 inline-flex h-10 w-10 xs:h-12 xs:w-12 md:h-14 md:w-14 items-center justify-center rounded-xl bg-foreground text-xl md:text-2xl font-black text-background shadow-lg">
                        {index + 1}
                    </div>

                    {/* Metadata - Hidden or condensed on very small screens */}
                    <div className="flex flex-col gap-1 md:gap-4 overflow-hidden">
                        <h4 className="text-[9px] md:text-[10px] font-black tracking-[0.2em] text-primary uppercase truncate">
                            {question?.type?.replace('_', ' ')}
                        </h4>
                        
                        <div className="hidden xs:flex md:flex-col gap-2 md:gap-3 text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Target className="h-3 w-3" />
                                <span className="text-[10px] font-bold">{question?.point} pts</span>
                            </div>
                            <div className="hidden md:flex items-center gap-2">
                                <Layers className="h-3 w-3" />
                                <span className="text-[10px] font-bold uppercase tracking-tighter">Medium</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Pill - Mobile Optimized */}
                <div
                    className={cn(
                        'flex items-center gap-2 rounded-full md:rounded-2xl px-3 md:px-4 py-1.5 md:py-2 transition-all shrink-0',
                        hasAnswer
                            ? 'bg-emerald-500/10 text-emerald-600'
                            : 'bg-muted text-muted-foreground/60',
                    )}
                >
                    {hasAnswer ? (
                        <CheckCircle2 className="h-3.5 w-3.5 md:h-5 md:w-5" />
                    ) : (
                        <Circle className="h-3.5 w-3.5 md:h-5 md:w-5" />
                    )}
                    <span className="text-[9px] md:text-[10px] font-black tracking-widest uppercase">
                        {hasAnswer ? 'Done' : 'Open'}
                    </span>
                </div>
            </div>

            {/* RIGHT SIDE: Content Area */}
            <div className="relative flex flex-col bg-background p-5 xs:p-8 md:p-12">
                <div className="min-h-[100px] md:min-h-[150px]">
                    {renderQuestion(
                        question,
                        index,
                        answer,
                        onAnswerChange,
                        isCompleted,
                    )}
                </div>

                {/* Mobile Info Bar (Visible only when inactive or XS) */}
                <div className="mt-4 flex md:hidden items-center justify-between border-t border-border/50 pt-4 opacity-50">
                     <div className="flex items-center gap-2">
                        <Info className="h-3 w-3" />
                        <span className="text-[8px] font-bold uppercase tracking-widest">Auto-saving...</span>
                     </div>
                </div>
            </div>

            {/* Accent Line - Only visible on Tablet/Desktop for cleaner mobile UI */}
            {isActive && (
                <motion.div
                    layoutId="accent"
                    className="absolute left-0 top-0 hidden h-full w-1.5 bg-primary md:block"
                />
            )}
        </motion.section>
    );
}
