import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Question } from '@/types/student/assessment';
import { ChevronLeft, Eye, LayoutList } from 'lucide-react';

import { CheckCircle2, Flag, Keyboard } from 'lucide-react';
// ... other imports

interface NavigationSidebarProps extends QuestionNavigatorProps {
    onViewModeChange: (mode: 'scroll' | 'single') => void;
    flags?: number[]; // IDs of flagged questions
    timeLeft?: string; // Optional: "10:00"
}

// ============================================================================
// 1. VIEW MODE SWITCHER (Refined Interaction)
// ============================================================================
interface ViewModeSwitcherProps {
    viewMode: 'scroll' | 'single';
    onViewModeChange: (mode: 'scroll' | 'single') => void;
}

// ============================================================================
// 2. QUESTION NAVIGATOR (Status-Aware Grid)
// ============================================================================
interface QuestionNavigatorProps {
    questions: Question[];
    answers: Record<string, any>;
    activeQuestionId: number | null;
    currentQuestionIndex: number;
    viewMode: 'scroll' | 'single';
    onNavigate: (id: number, index: number) => void;
}

// ============================================================================
// 3. MAIN SIDEBAR EXPORT
// ============================================================================

export function NavigationSidebar(props: NavigationSidebarProps) {
    const {
        questions,
        answers,
        flags = [],
        viewMode,
        onViewModeChange,
    } = props;
    const answeredCount = Object.keys(answers).length;
    const flaggedCount = flags.length;
    const progress = (answeredCount / questions.length) * 100;

    return (
        <aside className="relative lg:col-span-4 xl:col-span-3">
            <div className="sticky top-24 space-y-4 self-start">
                {/* 1. Contextual Header: Keyboard & Exit */}
                <div className="flex items-center justify-between px-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="group h-8 text-muted-foreground"
                    >
                        <ChevronLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        Exit
                    </Button>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="flex items-center gap-1.5 rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold text-muted-foreground dark:bg-muted">
                                    <Keyboard className="h-3 w-3" />
                                    <span>SHORTCUTS</span>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent side="left">
                                Use ← / → to navigate
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>

                <Card className="overflow-hidden border-none shadow-xl ring-1 ring-slate-200 dark:ring-border">
                    {/* 2. Enhanced Progress Section */}
                    <div className="relative border-b bg-slate-50/50 p-5 dark:bg-card">
                        <div className="mb-3 flex items-center justify-between">
                            <div className="space-y-0.5">
                                <h4 className="text-[10px] font-black tracking-widest text-primary uppercase">
                                    Current Progress
                                </h4>
                                <p className="text-xs font-medium text-muted-foreground">
                                    {answeredCount} of {questions.length}{' '}
                                    complete
                                </p>
                            </div>
                            <div className="text-right">
                                <span className="font-mono text-xl font-black tracking-tighter">
                                    {Math.round(progress)}%
                                </span>
                            </div>
                        </div>
                        <Progress value={progress} className="h-2 shadow-sm" />

                        {/* Summary Stats Pill Box */}
                        <div className="mt-4 flex flex-wrap gap-2">
                            <Badge
                                variant="outline"
                                className="gap-1 border-emerald-100 bg-emerald-50/50 px-1.5 py-0 text-emerald-700"
                            >
                                <CheckCircle2 className="h-3 w-3" />{' '}
                                {answeredCount}
                            </Badge>
                            {flaggedCount > 0 && (
                                <Badge
                                    variant="outline"
                                    className="gap-1 border-amber-100 bg-amber-50/50 px-1.5 py-0 text-amber-700"
                                >
                                    <Flag className="h-3 w-3 fill-current" />{' '}
                                    {flaggedCount}
                                </Badge>
                            )}
                        </div>
                    </div>

                    <div className="space-y-6 p-4">
                        {/* View Mode */}
                        <div className="space-y-2.5">
                            <label className="ml-1 text-[10px] font-bold text-muted-foreground uppercase">
                                View Mode
                            </label>
                            <ViewModeSwitcher
                                viewMode={viewMode}
                                onViewModeChange={onViewModeChange}
                            />
                        </div>

                        {/* Question Grid */}
                        <div className="space-y-2.5">
                            <label className="ml-1 text-[10px] font-bold text-muted-foreground uppercase">
                                Question Map
                            </label>
                            <QuestionNavigator {...props} />
                        </div>

                        {/* 3. Improved Interactive Legend */}
                        <div className="grid grid-cols-2 gap-y-3 border-t pt-5">
                            <LegendItem color="bg-primary" label="Active" />
                            <LegendItem color="bg-emerald-500" label="Done" />
                            <LegendItem color="bg-amber-500" label="Flagged" />
                            <LegendItem color="bg-slate-200" label="Empty" />
                        </div>
                    </div>
                </Card>

            </div>
        </aside>
    );
}

function ViewModeSwitcher({
    viewMode,
    onViewModeChange,
}: ViewModeSwitcherProps) {
    const modes = [
        { id: 'scroll', icon: LayoutList, label: 'List' },
        { id: 'single', icon: Eye, label: 'Focus' },
    ];

    return (
        <div className="grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-1 dark:bg-muted">
            {modes.map((mode) => (
                <button
                    key={mode.id}
                    onClick={() => onViewModeChange(mode.id as any)}
                    className={cn(
                        'flex items-center justify-center gap-2 rounded-md py-1.5 text-xs font-semibold transition-all',
                        viewMode === mode.id
                            ? 'bg-white text-primary shadow-sm dark:bg-card'
                            : 'text-slate-500 hover:text-slate-700 dark:text-muted-foreground',
                    )}
                >
                    <mode.icon className="h-3.5 w-3.5" />
                    {mode.label}
                </button>
            ))}
        </div>
    );
}

function QuestionNavigator({
    questions,
    answers,
    activeQuestionId,
    currentQuestionIndex,
    viewMode,
    onNavigate,
}: QuestionNavigatorProps) {
    return (
        <TooltipProvider>
            <div className="grid grid-cols-5 gap-1.5">
                {questions.map((q, i) => {
                    const isAnswered = !!answers[q.id];
                    const isActive =
                        viewMode === 'single'
                            ? currentQuestionIndex === i
                            : activeQuestionId === q.id;

                    return (
                        <Tooltip key={q.id}>
                            <TooltipTrigger asChild>
                                <button
                                    onClick={() => onNavigate(q.id, i)}
                                    className={cn(
                                        'flex aspect-square w-full items-center justify-center rounded-md border text-[11px] font-bold transition-all',
                                        isActive
                                            ? 'border-primary bg-primary/10 text-primary ring-2 ring-primary ring-offset-1 dark:ring-offset-background'
                                            : isAnswered
                                              ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/50 dark:text-emerald-400'
                                              : 'border-slate-200 bg-white text-slate-400 hover:border-slate-300 dark:border-border dark:bg-card dark:text-muted-foreground',
                                    )}
                                >
                                    {i + 1}
                                </button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                                <p className="text-xs">
                                    {isAnswered ? 'Answered' : 'Not started'}
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    );
                })}
            </div>
        </TooltipProvider>
    );
}

function LegendItem({ color, label }: { color: string; label: string }) {
    return (
        <div className="flex items-center gap-2">
            <div className={cn('h-2 w-2 rounded-full', color)} />
            <span className="text-[10px] font-medium tracking-tight text-muted-foreground uppercase">
                {label}
            </span>
        </div>
    );
}
