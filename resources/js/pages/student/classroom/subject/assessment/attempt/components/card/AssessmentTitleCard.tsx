import { Badge } from '@/components/ui/badge';
import { Info, BookOpen, Clock } from 'lucide-react';

interface AssessmentTitleCardProps {
    title: string;
    questionCount: number;
    duration?: string; // Added for better UX
}

export function AssessmentTitleCard({
    title,
    questionCount,
    duration = "60 mins"
}: AssessmentTitleCardProps) {
    return (
        <div className="relative overflow-hidden rounded-[3rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50 md:p-12 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-slate-50 dark:bg-zinc-800/50" />
            
            <div className="relative z-10">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-500 dark:text-indigo-400">
                    <BookOpen className="h-3.5 w-3.5" /> Assessment Active
                </div>
                
                <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 md:text-3xl dark:text-white">
                    {title}
                </h1>
                
                <div className="mt-4 flex flex-wrap gap-3">
                    <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-100 dark:bg-zinc-800 dark:text-zinc-300">
                        <Info className="mr-2 h-3.5 w-3.5" /> 
                        {questionCount} Questions
                    </Badge>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-100 dark:bg-zinc-800 dark:text-zinc-300">
                        <Clock className="mr-2 h-3.5 w-3.5" /> 
                        {duration}
                    </Badge>
                </div>
            </div>
        </div>
    );
}