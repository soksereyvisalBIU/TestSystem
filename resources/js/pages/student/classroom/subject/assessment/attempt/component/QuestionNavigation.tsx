import { ListOrdered } from 'lucide-react';
import { cn } from '@/lib/utils';

export const QuestionNavigation = ({ questions, answers, currentIdx, activeId, viewMode, onNavigate }: any) => (
    <aside className="sticky top-24 hidden h-fit w-72 lg:block">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="mb-4 flex items-center gap-2 text-xs font-black tracking-widest text-slate-400 uppercase">
                <ListOrdered className="h-4 w-4" /> Navigation
            </h3>
            <div className="grid grid-cols-4 gap-2">
                {questions.map((q: any, i: number) => (
                    <button
                        key={q.id}
                        onClick={() => onNavigate(q.id, i)}
                        className={cn(
                            'flex h-12 items-center justify-center rounded-xl border text-sm font-bold transition-all',
                            (viewMode === 'single' ? currentIdx === i : activeId === q.id)
                                ? 'scale-110 border-primary bg-primary text-white shadow-lg shadow-primary/30'
                                : answers[q.id]
                                ? 'border-green-100 bg-green-50 text-green-600 dark:border-green-800 dark:bg-green-900/20'
                                : 'border-slate-100 bg-white text-slate-400 dark:border-zinc-700 dark:bg-zinc-800',
                        )}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    </aside>
);