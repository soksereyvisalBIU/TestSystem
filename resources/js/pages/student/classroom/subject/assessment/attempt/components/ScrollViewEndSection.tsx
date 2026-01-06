import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Search, SendHorizontal } from 'lucide-react';

export function ScrollViewEndSection({
    onReview,
    onSubmit,
}: {
    onReview: () => void;
    onSubmit: () => void;
}) {
    return (
        <div className="group relative mt-8 sm:mt-16 overflow-hidden rounded-[3rem] border-2 border-dashed border-border bg-muted/30 p-8 sm:p-12 text-center transition-all hover:border-primary/40">
            {/* Visual Flourish - Uses primary theme color with low opacity */}
            <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-colors" />
            
            <div className="relative z-10">
                <h2 className="text-xl sm:text-3xl font-black tracking-tight text-title">
                    You've reached the end!
                </h2>
                <p className="mx-auto mt-2 max-w-xs font-medium text-description">
                    Take a moment to review your answers before finalizing your submission.
                </p>

                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={onReview}
                        className="h-16 w-full rounded-2xl border-2 bg-background px-8 text-sm sm:text-lg font-bold transition-all hover:bg-accent sm:w-auto"
                    >
                        <Search className="mr-2 h-5 w-5 text-primary" /> 
                        Review Answers
                    </Button>
                    
                    <Button
                        size="lg"
                        onClick={onSubmit}
                        className="h-16 w-full rounded-2xl bg-primary px-12 text-sm sm:text-lg font-black text-primary-foreground transition-all hover:scale-105 active:scale-95 sm:w-auto shadow-none"
                    >
                        Submit Assessment
                        <SendHorizontal className="ml-3 h-5 w-5" />
                    </Button>
                </div>
                
                <p className="mt-6 text-[10px] font-bold uppercase tracking-widest text-description/70">
                    Double-check everything. This action is final.
                </p>
            </div>
        </div>
    );
}