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
// ============================================================================
// 1. VIEW MODE SWITCHER (Refined Interaction)
// ============================================================================
interface ViewModeSwitcherProps {
    viewMode: 'scroll' | 'single';
    onViewModeChange: (mode: 'scroll' | 'single') => void;
}

// export function ViewModeSwitcher({ viewMode, onViewModeChange }: ViewModeSwitcherProps) {
//     return (
//         <div className="inline-flex items-center gap-1 rounded-2xl bg-slate-200/50 p-1.5 backdrop-blur-sm dark:bg-zinc-800/50">
//             {[
//                 { id: 'scroll', icon: LayoutList, label: 'Scrolling' },
//                 { id: 'single', icon: SquareStack, label: '1-by-1' },
//             ].map((mode) => (
//                 <Button
//                     key={mode.id}
//                     variant={viewMode === mode.id ? 'default' : 'ghost'}
//                     size="sm"
//                     onClick={() => onViewModeChange(mode.id as any)}
//                     className={cn(
//                         "rounded-xl font-bold transition-all duration-300",
//                         viewMode === mode.id
//                             ? "bg-white text-primary shadow-sm hover:bg-white dark:bg-zinc-700 dark:text-white"
//                             : "text-slate-500 hover:text-slate-900"
//                     )}
//                 >
//                     <mode.icon className="mr-2 h-4 w-4" />
//                     {mode.label}
//                 </Button>
//             ))}
//         </div>
//     );
// }

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

// export function QuestionNavigator({
//     questions,
//     answers,
//     activeQuestionId,
//     currentQuestionIndex,
//     viewMode,
//     onNavigate,
// }: QuestionNavigatorProps) {
//     const answeredCount = Object.keys(answers).length;

//     return (
//         <div className="overflow-hidden rounded-2xl lg:rounded-[2.5rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/40 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
//             {/* Nav Header with Mini Progress */}
//             <div className="border-b border-slate-50 bg-slate-50/50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-800/30">
//                 <div className="flex items-center justify-between">
//                     <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
//                         <ListOrdered className="h-3.5 w-3.5" />
//                         Navigation
//                     </h3>
//                     <span className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400">
//                         {answeredCount}/{questions.length} Done
//                     </span>
//                 </div>
//             </div>

//             <div className="p-6">
//                 <div className="grid grid-cols-4 gap-2.5">
//                     {questions.map((q, i) => {
//                         const isAnswered = !!answers[q.id];
//                         const isActive = viewMode === 'single'
//                             ? currentQuestionIndex === i
//                             : activeQuestionId === q.id;

//                         return (
//                             <button
//                                 key={q.id}
//                                 onClick={() => onNavigate(q.id, i)}
//                                 className={cn(
//                                     'group relative flex h-12 w-full items-center justify-center rounded-2xl border-2 text-sm font-bold transition-all duration-200 active:scale-90',
//                                     isActive
//                                         ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none'
//                                         : isAnswered
//                                           ? 'border-emerald-100 bg-emerald-50 text-emerald-600 dark:border-emerald-900/30 dark:bg-emerald-900/20'
//                                           : 'border-slate-100 bg-white text-slate-400 hover:border-slate-300 dark:border-zinc-800 dark:bg-zinc-800/50'
//                                 )}
//                             >
//                                 {i + 1}
//                                 {/* Subtle indicator for answered questions when NOT active */}
//                                 {isAnswered && !isActive && (
//                                     <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-900" />
//                                 )}
//                             </button>
//                         );
//                     })}
//                 </div>

//                 {/* Legend: Critical for UX Clarity */}
//                 <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-5 dark:border-zinc-800">
//                     <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
//                         <div className="h-2 w-2 rounded-full bg-indigo-600" />
//                         Current
//                     </div>
//                     <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
//                         <div className="h-2 w-2 rounded-full bg-emerald-500" />
//                         Answered
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// ============================================================================
// 3. MAIN SIDEBAR EXPORT
// ============================================================================

export function NavigationSidebar(props: NavigationSidebarProps) {
    const answeredCount = Object.keys(props.answers).length;
    const progress = (answeredCount / props.questions.length) * 100;

    return (
        <aside className="relative lg:col-span-4 xl:col-span-3">
            <div className="sticky top-24 space-y-4 self-start">
                {/* Optional Back Button if in Grading Context */}
                <Button
                    variant="ghost"
                    size="sm"
                    className="mb-2 -ml-2 h-8 text-muted-foreground hover:text-foreground"
                    onClick={() => window.history.back()}
                >
                    <ChevronLeft className="mr-1 h-4 w-4" /> Back to List
                </Button>

                <Card className="overflow-hidden border-none shadow-lg ring-1 ring-slate-200 dark:ring-border">
                    {/* Header: Progress Section */}
                    <div className="border-b bg-slate-50/50 p-4 dark:bg-card">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h4 className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                    Overall Progress
                                </h4>
                                <Badge
                                    variant={
                                        progress === 100
                                            ? 'success'
                                            : 'secondary'
                                    }
                                    className="font-mono"
                                >
                                    {Math.round(progress)}%
                                </Badge>
                            </div>
                            <Progress
                                value={progress}
                                className="h-2 bg-slate-200 dark:bg-muted"
                            />
                        </div>
                    </div>

                    <div className="space-y-6 p-4">
                        {/* Display Options */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                View Mode
                            </label>
                            <ViewModeSwitcher
                                viewMode={props.viewMode}
                                onViewModeChange={props.onViewModeChange}
                            />
                        </div>

                        {/* Question Map */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                    Question Map
                                </label>
                                <span className="text-[10px] font-medium text-muted-foreground">
                                    {answeredCount}/{props.questions.length}{' '}
                                    Questions
                                </span>
                            </div>
                            <QuestionNavigator {...props} />
                        </div>

                        {/* Legend */}
                        <div className="space-y-2 border-t pt-4 dark:border-border">
                            <LegendItem
                                color="bg-primary"
                                label="Current / Active"
                            />
                            <LegendItem
                                color="bg-emerald-500"
                                label="Completed"
                            />
                            <LegendItem
                                color="bg-slate-200 dark:bg-muted"
                                label="Remaining"
                            />
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

// export function QuestionNavigator({
//     questions,
//     answers,
//     activeQuestionId,
//     currentQuestionIndex,
//     viewMode,
//     onNavigate,
// }: QuestionNavigatorProps) {
//     const answeredCount = Object.keys(answers).length;

//     return (
//         <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900 sm:rounded-[2.5rem]">
//             {/* Condensed Header for XS */}
//             <div className="border-b border-slate-50 bg-slate-50/50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-800/30 sm:px-6 sm:py-4">
//                 <div className="flex items-center justify-between">
//                     <h3 className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400">
//                         <ListOrdered className="h-3 w-3" />
//                         Navigation
//                     </h3>
//                     <span className="text-[10px] font-bold text-indigo-500">
//                         {answeredCount}/{questions.length} <span className="hidden xs:inline">Completed</span>
//                     </span>
//                 </div>
//             </div>

//             {/* Grid Area: Responsive columns */}
//             <div className="p-4 sm:p-6">
//                 <div className="grid grid-cols-5 gap-2 xs:grid-cols-6 sm:grid-cols-4 sm:gap-2.5">
//                     {questions.map((q, i) => {
//                         const isAnswered = !!answers[q.id];
//                         const isActive = viewMode === 'single'
//                             ? currentQuestionIndex === i
//                             : activeQuestionId === q.id;

//                         return (
//                             <button
//                                 key={q.id}
//                                 onClick={() => onNavigate(q.id, i)}
//                                 className={cn(
//                                     'group relative flex aspect-square w-full items-center justify-center rounded-xl border-2 text-xs font-black transition-all active:scale-95',
//                                     isActive
//                                         ? 'border-indigo-600 bg-indigo-600 text-white shadow-md'
//                                         : isAnswered
//                                           ? 'border-emerald-100 bg-emerald-50 text-emerald-600 dark:border-emerald-900/30 dark:bg-emerald-900/20'
//                                           : 'border-slate-50 bg-slate-50 text-slate-400 dark:border-zinc-800 dark:bg-zinc-800/50'
//                                 )}
//                             >
//                                 {i + 1}
//                                 {isAnswered && !isActive && (
//                                     <div className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-900" />
//                                 )}
//                             </button>
//                         );
//                     })}
//                 </div>

//                 {/* Legend - Row layout on mobile to save vertical space */}
//                 <div className="mt-4 flex flex-row items-center justify-around gap-2 border-t border-slate-50 pt-4 dark:border-zinc-800 sm:mt-8 sm:flex-col sm:items-start sm:gap-3 sm:pt-5">
//                     <div className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-wider text-slate-400 sm:text-[10px]">
//                         <div className="h-2 w-2 rounded-full bg-indigo-600" />
//                         Current
//                     </div>
//                     <div className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-wider text-slate-400 sm:text-[10px]">
//                         <div className="h-2 w-2 rounded-full bg-emerald-500" />
//                         Done
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export function NavigationSidebar(props: NavigationSidebarProps) {
//     return (
//         <aside className="w-full space-y-4 lg:sticky lg:top-24 lg:h-fit lg:w-72 lg:space-y-6">
//             <ViewModeSwitcher
//                 viewMode={props.viewMode}
//                 onViewModeChange={props.onViewModeChange}
//             />
//             <QuestionNavigator {...props} />
//         </aside>
//     );
// }
