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
            // animate={{
            //     opacity: isActive ? 1 : 0.4,
            //     scale: isActive ? 1 : 0.98,
            //     // filter: isActive ? 'blur(0px)' : 'blur(1px)',
            // }}
            // className={cn(
            //     'relative grid grid-cols-1 overflow-hidden rounded-[2.5rem] border transition-all duration-700 md:grid-cols-[280px_1fr]',
            //     isActive
            //         ? 'border-primary/30 bg-card shadow-[0_0_80px_-20px_rgba(0,0,0,0.12)]'
            //         : 'border-transparent bg-muted/20',
            // )}
            className={cn(
                'relative grid grid-cols-1 overflow-hidden rounded-[2.5rem] border border-primary/30 bg-card shadow-[0_0_80px_-20px_rgba(0,0,0,0.12)] transition-all duration-700 md:grid-cols-[280px_1fr]',
                // isActive ? '' : 'border-transparent bg-muted/20',
            )}
        >
            {/* LEFT SIDEBAR: Meta Information */}
            <div
                className={cn(
                    'relative flex flex-col justify-between p-8 md:p-10',
                    isActive ? 'bg-primary/[0.03]' : 'bg-transparent',
                )}
            >
                <div className="space-y-8">
                    {/* Index & Type */}
                    <div className="space-y-4">
                        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-foreground text-2xl font-black text-background shadow-xl">
                            {index + 1}
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-[10px] font-black tracking-[0.2em] text-primary uppercase">
                                Question Meta
                            </h4>
                            <p className="text-sm leading-relaxed font-medium text-muted-foreground">
                                Subjective analysis of the provided text.
                            </p>
                        </div>
                    </div>

                    {/* Stats/Tags List */}
                    <div className="space-y-4 pt-4">
                        <div className="flex items-center gap-3 text-muted-foreground">
                            <Target className="h-4 w-4" />
                            <span className="text-xs font-semibold">
                                10 Points
                            </span>
                        </div>
                        <div className="flex items-center gap-3 text-muted-foreground">
                            <Layers className="h-4 w-4" />
                            <span className="text-xs font-semibold tracking-tighter uppercase">
                                Medium Difficulty
                            </span>
                        </div>
                    </div>
                </div>

                {/* Status Pill at Bottom */}
                <div
                    className={cn(
                        'mt-8 flex items-center gap-3 rounded-2xl p-4 transition-colors',
                        hasAnswer
                            ? 'bg-emerald-500/10 text-emerald-600'
                            : 'bg-muted text-muted-foreground/60',
                    )}
                >
                    {hasAnswer ? (
                        <CheckCircle2 className="h-5 w-5" />
                    ) : (
                        <Circle className="h-5 w-5" />
                    )}
                    <span className="text-[10px] font-bold tracking-widest uppercase">
                        {hasAnswer ? 'Captured' : 'Pending'}
                    </span>
                </div>
            </div>

            {/* RIGHT SIDE: Content Area */}
            <div className="relative flex flex-col bg-background p-8 md:p-12">
                {/* Subtle Progress Header */}
                {/* <div className="mb-8 flex items-center justify-between">
                    <Badge
                        variant="outline"
                        className="rounded-full border-dashed px-4 py-1 font-mono text-[10px]"
                    >
                        ID: {question.id.slice(0, 8)}
                    </Badge>
                    {isActive && (
                        <div className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" />
                            <span className="text-[10px] font-bold tracking-widest text-primary uppercase">
                                Live
                            </span>
                        </div>
                    )}
                </div> */}

                {/* Main Render Area */}
                <div className="min-h-[200px]">
                    {renderQuestion(
                        question,
                        index,
                        answer,
                        onAnswerChange,
                        isCompleted,
                    )}
                </div>

                {/* Footer Auto-save */}
                <div className="mt-12 flex items-center gap-2 opacity-30 transition-opacity hover:opacity-100">
                    <Info className="h-3 w-3" />
                    <span className="text-[9px] font-bold tracking-[0.2em] uppercase">
                        Syncing to local storage in real-time
                    </span>
                </div>
            </div>

            {/* Accent Line */}
            {isActive && (
                <motion.div
                    layoutId="accent"
                    className="absolute top-0 left-0 h-full w-1 bg-primary"
                />
            )}
        </motion.section>
    );
}
