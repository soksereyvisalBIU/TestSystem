import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LayoutList, ListOrdered, SquareStack, CheckCircle2 } from 'lucide-react';

interface SidebarProps {
    questions: any[];
    answers: Record<string, any>;
    viewMode: 'scroll' | 'single';
    setViewMode: (mode: 'scroll' | 'single') => void;
    currentIdx: number;
    activeId: number | null;
    onNavigate: (id: number, index: number) => void;
}

export const AssessmentSidebar = ({
    questions,
    answers,
    viewMode,
    setViewMode,
    currentIdx,
    activeId,
    onNavigate,
}: SidebarProps) => {
    // Calculate progress for a mini-indicator in the sidebar header
    const answeredCount = Object.keys(answers).length;
    const totalCount = questions.length;

    return (
        <aside className="sticky top-24 hidden h-fit w-72 lg:block">
            {/* View Mode Toggler - Modern Pill Design */}
            <div className="mb-6 flex justify-center">
                <div className="inline-flex gap-1 rounded-2xl bg-slate-200/50 p-1.5 backdrop-blur-sm dark:bg-zinc-800/50">
                    <Button
                        variant={viewMode === 'scroll' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('scroll')}
                        className={cn(
                            "rounded-xl font-bold transition-all",
                            viewMode === 'scroll' && "shadow-sm"
                        )}
                    >
                        <LayoutList className="mr-2 h-4 w-4" /> Scrolling
                    </Button>
                    <Button
                        variant={viewMode === 'single' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('single')}
                        className={cn(
                            "rounded-xl font-bold transition-all",
                            viewMode === 'single' && "shadow-sm"
                        )}
                    >
                        <SquareStack className="mr-2 h-4 w-4" /> 1-by-1
                    </Button>
                </div>
            </div>

            {/* Navigation Card */}
            <div className="rounded-[2.5rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
                <div className="mb-6 flex items-center justify-between">
                    <h3 className="flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                        <ListOrdered className="h-4 w-4" /> Navigation
                    </h3>
                    <span className="text-[10px] font-bold text-slate-400">
                        {Math.round((answeredCount / totalCount) * 100)}% Done
                    </span>
                </div>

                <div className="grid grid-cols-4 gap-3">
                    {questions.map((q: any, i: number) => {
                        const isAnswered = !!answers[q.id];
                        const isActive = viewMode === 'single' 
                            ? currentIdx === i 
                            : activeId === q.id;

                        return (
                            <button
                                key={q.id}
                                onClick={() => onNavigate(q.id, i)}
                                className={cn(
                                    'group relative flex h-12 w-full items-center justify-center rounded-2xl border-2 text-sm font-bold transition-all duration-300 active:scale-95',
                                    isActive
                                        ? 'scale-105 border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none'
                                        : isAnswered
                                          ? 'border-emerald-100 bg-emerald-50 text-emerald-600 dark:border-emerald-900/30 dark:bg-emerald-900/20'
                                          : 'border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200 hover:bg-white dark:border-zinc-800 dark:bg-zinc-800/50'
                                )}
                            >
                                {i + 1}
                                
                                {/* Status Indicator Dot */}
                                {isAnswered && !isActive && (
                                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[8px] text-white ring-2 ring-white dark:ring-zinc-900">
                                        <CheckCircle2 className="h-2.5 w-2.5" />
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Legend for UX Clarity */}
                <div className="mt-8 flex flex-col gap-2 border-t border-slate-100 pt-4 dark:border-zinc-800">
                    <div className="flex items-center gap-2 text-[10px] font-medium text-slate-500">
                        <div className="h-2 w-2 rounded-full bg-indigo-600" /> Current Question
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-medium text-slate-500">
                        <div className="h-2 w-2 rounded-full bg-emerald-500" /> Answered
                    </div>
                </div>
            </div>
        </aside>
    );
};