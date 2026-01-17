import { cn } from '@/lib/utils';
import { Question } from '@/types/student/assessment';
import { motion, AnimatePresence } from 'framer-motion';
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
            // Animate entry and layout changes
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className={cn(
                'relative grid grid-cols-1 overflow-hidden transition-all duration-500',
                'rounded-3xl border shadow-sm',
                'md:grid-cols-[180px_1fr] lg:grid-cols-[220px_1fr]',
                isActive 
                    ? 'border-primary/40 bg-card shadow-2xl ring-1 ring-primary/20 scale-[1.01] z-10' 
                    : 'border-border/60 bg-muted/10 opacity-90'
            )}
        >
            {/* LEFT SIDEBAR / TOP HEADER */}
            <div
                className={cn(
                    'relative flex flex-row md:flex-col justify-between items-center md:items-start p-5 md:p-10 gap-4 transition-colors',
                    isActive ? 'bg-primary/[0.04]' : 'bg-transparent',
                    'border-b md:border-b-0 md:border-r border-border/50'
                )}
            >
                <div className="flex md:flex-col items-center md:items-start gap-4 md:gap-8 w-full">
                    {/* Index Square: Dynamic color based on status */}
                    <div className={cn(
                        "shrink-0 inline-flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-2xl text-2xl font-black shadow-lg transition-all",
                        hasAnswer 
                            ? "bg-emerald-600 text-white shadow-emerald-200 dark:shadow-none" 
                            : isActive ? "bg-foreground text-background" : "bg-muted-foreground/20 text-muted-foreground"
                    )}>
                        {index + 1}
                    </div>

                    <div className="flex flex-col gap-1 md:gap-4 overflow-hidden">
                        <h4 className="text-[10px] font-black tracking-[0.2em] text-primary/70 uppercase truncate">
                            {question?.type?.replace('_', ' ')}
                        </h4>
                        
                        <div className="flex md:flex-col gap-3 text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Target className="h-4 w-4 text-primary/60" />
                                <span className="text-sm font-bold">{question?.point} pts</span>
                            </div>
                            <div className="hidden md:flex items-center gap-2">
                                <Layers className="h-4 w-4 text-primary/60" />
                                <span className="text-sm font-bold uppercase tracking-tighter">
                                    {question?.difficulty || 'Standard'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Pill */}
                <div
                    className={cn(
                        'flex items-center gap-2 rounded-full px-4 py-2 transition-all shrink-0',
                        hasAnswer
                            ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                            : 'bg-slate-100 text-slate-400 dark:bg-zinc-800',
                    )}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={hasAnswer ? 'done' : 'open'}
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                        >
                            {hasAnswer ? (
                                <CheckCircle2 className="h-4 w-4" />
                            ) : (
                                <Circle className="h-4 w-4" />
                            )}
                        </motion.div>
                    </AnimatePresence>
                    <span className="text-[10px] font-black tracking-widest uppercase">
                        {hasAnswer ? 'Saved' : 'Open'}
                    </span>
                </div>
            </div>

            {/* RIGHT SIDE: Content Area */}
            <div className="relative flex flex-col bg-background p-6 sm:p-10 md:p-14">
                <div className="min-h-[120px]">
                    {renderQuestion(
                        question,
                        index,
                        answer,
                        onAnswerChange,
                        isCompleted,
                    )}
                </div>

                {/* Info Bar */}
                <div className="mt-8 flex items-center justify-between border-t border-border/40 pt-6">
                    <div className="flex items-center gap-2 text-muted-foreground/60">
                        <Info className="h-3.5 w-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.1em]">
                            {isActive ? "Your progress is saved automatically" : "Click to focus"}
                        </span>
                    </div>
                    
                    {/* Visual progress indicator for mobile */}
                    {!isActive && !hasAnswer && (
                        <span className="flex h-2 w-2 animate-pulse rounded-full bg-orange-400 md:hidden" />
                    )}
                </div>
            </div>

            {/* Focused Accent Line */}
            {isActive && (
                <motion.div
                    layoutId="accent-line"
                    className="absolute left-0 top-0 hidden h-full w-2 bg-primary md:block"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
            )}
        </motion.section>
    );
}