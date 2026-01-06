import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { PencilLine, AlertCircle } from 'lucide-react';

export default function ShortAnswerQuestion({ question, answer, onChange }) {
    const textToProcess = question.question || ""; 
    const charLimit = question.char_limit || 500; 
    
    const parts = textToProcess.split(/_{3,}/); 
    const hasPlaceholder = parts.length > 1;

    const isOverLimit = answer?.length > charLimit;
    const isNearLimit = answer?.length > charLimit * 0.9;

    return (
        <div className="w-full space-y-4 sm:space-y-6">
            {/* INTERACTIVE PREVIEW BOX - Tightened for XS */}
            {hasPlaceholder && (
                <div className={cn(
                    "rounded-xl px-4 py-3 sm:px-6 sm:py-4 border-2 border-dashed transition-colors duration-300",
                    isOverLimit 
                        ? "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900/30" 
                        : "bg-indigo-50/50 border-indigo-100 dark:bg-indigo-900/10 dark:border-indigo-900/30"
                )}>
                    <p className={cn(
                        "text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] mb-2 sm:mb-3 flex items-center gap-1.5",
                        isOverLimit ? "text-red-500" : "text-indigo-400"
                    )}>
                        <PencilLine className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> Live Context
                    </p>
                    
                    <div className="text-sm sm:text-base font-medium leading-relaxed text-slate-700 dark:text-zinc-300">
                        {parts[0]}
                        <span className={cn(
                            "mx-1 px-1.5 py-0.5 rounded transition-all duration-300 underline decoration-1 underline-offset-4 break-words",
                            answer 
                                ? (isOverLimit ? "text-red-600 bg-red-100" : "text-indigo-600 bg-indigo-100 dark:bg-indigo-900/60 dark:text-indigo-300 font-bold") 
                                : "text-slate-300 italic"
                        )}>
                            {answer || "................"}
                        </span>
                        {parts[1]}
                    </div>
                </div>
            )}

            {/* INPUT SECTION */}
            <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between items-end px-0.5">
                    <Label 
                        htmlFor={`${question.id}-answer`} 
                        className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400"
                    >
                        Your Response
                    </Label>
                    
                    {isOverLimit && (
                        <span className="flex items-center gap-1 text-[9px] sm:text-[10px] font-bold text-red-500 animate-pulse">
                            <AlertCircle className="h-2.5 w-2.5" /> Over Limit
                        </span>
                    )}
                </div>

                <Textarea
                    id={`${question.id}-answer`}
                    rows={2}
                    value={answer || ""}
                    onChange={(e) => onChange(question.id, e.target.value)}
                    placeholder="Type your answer here..."
                    className={cn(
                        "min-h-[80px] sm:min-h-[120px] resize-none p-3 sm:p-4 text-sm sm:text-base rounded-xl sm:rounded-2xl border-2 transition-all duration-200 shadow-sm",
                        "bg-white dark:bg-zinc-900 focus-visible:ring-0 focus-visible:ring-offset-0",
                        isOverLimit 
                            ? "border-red-500 focus-visible:border-red-500" 
                            : "border-slate-200 dark:border-zinc-800 focus-visible:border-indigo-500"
                    )}
                />
                
                {/* FOOTER: Character Count & Auto-save status */}
                <div className="flex justify-between items-center px-0.5">
                    <div className="flex items-center gap-1.5">
                         <div className={cn(
                            "h-1.5 w-1.5 rounded-full animate-pulse",
                            answer?.length > 0 ? "bg-emerald-500" : "bg-slate-300"
                         )} />
                         <span className="text-[8px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                            {answer?.length > 0 ? "Syncing" : "Awaiting"}
                         </span>
                    </div>

                    <p className={cn(
                        "text-[9px] sm:text-[10px] font-mono font-black px-1.5 py-0.5 rounded border",
                        isOverLimit 
                            ? "bg-red-50 text-red-600 border-red-200" 
                            : isNearLimit 
                                ? "bg-amber-50 text-amber-600 border-amber-200"
                                : "bg-slate-50 text-slate-500 border-slate-100 dark:bg-zinc-800 dark:border-zinc-700"
                    )}>
                        {answer?.length || 0}/{charLimit}
                    </p>
                </div>
            </div>
        </div>
    );
}