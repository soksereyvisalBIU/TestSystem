import { Badge } from '@/components/ui/badge';
import { Info, BookOpen, Clock, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AssessmentTitleCardProps {
    title: string;
    questionCount: number;
    duration?: string;
    className?: string;
}

export function AssessmentTitleCard({
    title,
    questionCount,
    duration = "60 mins",
    className
}: AssessmentTitleCardProps) {
    return (
        <div className={cn(
            "relative overflow-hidden rounded-[2rem] xs:rounded-[3rem] border border-border/50 bg-card p-6 xs:p-10 shadow-2xl transition-all md:p-14",
            "bg-gradient-to-br from-white via-white to-slate-50/50 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800/50",
            className
        )}>
            {/* Design Accents: Mesh Gradient Blobs */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/5 blur-[80px] dark:bg-indigo-500/10" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-emerald-500/5 blur-[80px] dark:bg-emerald-500/10" />
            
            <div className="relative z-10">
                {/* Status Indicator */}
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-indigo-600 dark:text-indigo-400">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500"></span>
                        </span>
                        In Progress
                    </div>
                </div>
                
                {/* Title: Using text-balance for better line breaks */}
                <h1 className="mt-4 max-w-4xl text-balance text-2xl font-black leading-tight tracking-tight text-foreground xs:text-3xl md:text-5xl lg:text-6xl">
                    {title}
                </h1>
                
                {/* Metadata Row */}
                <div className="mt-6 flex flex-wrap items-center gap-3">
                    <Badge 
                        variant="secondary" 
                        className="h-10 px-4 rounded-xl border-none bg-slate-100/80 text-slate-600 backdrop-blur-sm dark:bg-zinc-800 dark:text-zinc-300"
                    >
                        <BookOpen className="mr-2 h-4 w-4 text-indigo-500" /> 
                        <span className="font-bold">{questionCount} Questions</span>
                    </Badge>
                    
                    <Badge 
                        variant="secondary" 
                        className="h-10 px-4 rounded-xl border-none bg-slate-100/80 text-slate-600 backdrop-blur-sm dark:bg-zinc-800 dark:text-zinc-300"
                    >
                        <Clock className="mr-2 h-4 w-4 text-emerald-500" /> 
                        <span className="font-bold">{duration}</span>
                    </Badge>

                    <div className="ml-auto hidden items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground md:flex">
                        <Sparkles className="h-3 w-3" /> Auto-saving enabled
                    </div>
                </div>
            </div>
        </div>
    );
}