import { Button } from '@/components/ui/button';
import { Search, SendHorizontal, ChevronRight } from 'lucide-react';

export function ScrollViewEndSection({
    onReview,
    onSubmit,
}: {
    onReview: () => void;
    onSubmit: () => void;
}) {
    return (
        <div className="group relative mt-20 overflow-hidden rounded-[3rem] border-2 border-dashed border-slate-200 bg-slate-50/50 p-12 text-center transition-colors hover:border-primary/30 dark:border-zinc-800 dark:bg-zinc-900/50">
            {/* Visual Flourish */}
            <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-primary/5 blur-3xl group-hover:bg-primary/10" />
            
            <div className="relative z-10">
                <h2 className="text-3xl font-black tracking-tight text-slate-800 dark:text-zinc-100">
                    You've reached the end!
                </h2>
                <p className="mx-auto mt-2 max-w-xs font-medium text-slate-500 dark:text-zinc-400">
                    Take a moment to review your answers before finalizing your submission.
                </p>

                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={onReview}
                        className="h-16 w-full rounded-2xl border-2 bg-white px-8 text-lg font-bold shadow-sm transition-all hover:bg-slate-50 sm:w-auto dark:bg-zinc-800"
                    >
                        <Search className="mr-2 h-5 w-5 text-primary" /> 
                        Review Answers
                    </Button>
                    
                    <Button
                        size="lg"
                        onClick={onSubmit}
                        className="h-16 w-full rounded-2xl bg-indigo-600 px-12 text-lg font-black text-white shadow-[0_20px_40px_-10px_rgba(79,70,229,0.4)] transition-all hover:scale-105 hover:bg-indigo-700 sm:w-auto dark:shadow-none"
                    >
                        Submit Assessment
                        <SendHorizontal className="ml-3 h-5 w-5" />
                    </Button>
                </div>
                
                <p className="mt-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Double-check everything. This action is final.
                </p>
            </div>
        </div>
    );
}