import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LayoutList, ListOrdered, SquareStack, CheckCircle2, Circle } from 'lucide-react';
import { Question } from '@/types/student/assessment';

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

export function QuestionNavigator({
    questions,
    answers,
    activeQuestionId,
    currentQuestionIndex,
    viewMode,
    onNavigate,
}: QuestionNavigatorProps) {
    const answeredCount = Object.keys(answers).length;

    return (
        <div className="overflow-hidden rounded-2xl lg:rounded-[2.5rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/40 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
            {/* Nav Header with Mini Progress */}
            <div className="border-b border-slate-50 bg-slate-50/50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-800/30">
                <div className="flex items-center justify-between">
                    <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        <ListOrdered className="h-3.5 w-3.5" /> 
                        Navigation
                    </h3>
                    <span className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400">
                        {answeredCount}/{questions.length} Done
                    </span>
                </div>
            </div>

            <div className="p-6">
                <div className="grid grid-cols-4 gap-2.5">
                    {questions.map((q, i) => {
                        const isAnswered = !!answers[q.id];
                        const isActive = viewMode === 'single' 
                            ? currentQuestionIndex === i 
                            : activeQuestionId === q.id;

                        return (
                            <button
                                key={q.id}
                                onClick={() => onNavigate(q.id, i)}
                                className={cn(
                                    'group relative flex h-12 w-full items-center justify-center rounded-2xl border-2 text-sm font-bold transition-all duration-200 active:scale-90',
                                    isActive
                                        ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none'
                                        : isAnswered
                                          ? 'border-emerald-100 bg-emerald-50 text-emerald-600 dark:border-emerald-900/30 dark:bg-emerald-900/20'
                                          : 'border-slate-100 bg-white text-slate-400 hover:border-slate-300 dark:border-zinc-800 dark:bg-zinc-800/50'
                                )}
                            >
                                {i + 1}
                                {/* Subtle indicator for answered questions when NOT active */}
                                {isAnswered && !isActive && (
                                    <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-900" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Legend: Critical for UX Clarity */}
                <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-5 dark:border-zinc-800">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        <div className="h-2 w-2 rounded-full bg-indigo-600" /> 
                        Current
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        <div className="h-2 w-2 rounded-full bg-emerald-500" /> 
                        Answered
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// 3. MAIN SIDEBAR EXPORT
// ============================================================================
export function NavigationSidebar(props: NavigationSidebarProps) {
    return (
        <aside className="sticky w-full space-y-4 lg:space-y-0 lg:top-24 lg:h-fit lg:w-72 flex-col gap-6 lg:flex ">
            <div className="flex justify-center">
                <ViewModeSwitcher
                    viewMode={props.viewMode}
                    onViewModeChange={props.onViewModeChange}
                />
            </div>

            <QuestionNavigator {...props} />
        </aside>
    );
}


export function ViewModeSwitcher({ viewMode, onViewModeChange }: ViewModeSwitcherProps) {
    return (
        <div className="inline-flex w-full items-center gap-1 rounded-xl bg-slate-200/50 p-1 backdrop-blur-sm dark:bg-zinc-800/50 sm:w-auto">
            {[
                { id: 'scroll', icon: LayoutList, label: 'Scrolling' },
                { id: 'single', icon: SquareStack, label: '1-by-1' },
            ].map((mode) => (
                <Button
                    key={mode.id}
                    variant={viewMode === mode.id ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => onViewModeChange(mode.id as any)}
                    className={cn(
                        "flex-1 rounded-lg font-bold transition-all sm:flex-none",
                        viewMode === mode.id 
                            ? "bg-white text-primary shadow-sm hover:bg-white dark:bg-zinc-700 dark:text-white" 
                            : "text-slate-500 hover:text-slate-900"
                    )}
                >
                    <mode.icon className="mr-2 h-3.5 w-3.5" />
                    <span className="text-xs">{mode.label}</span>
                </Button>
            ))}
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