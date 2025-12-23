import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { PencilLine, AlertCircle } from 'lucide-react';

export default function ShortAnswerQuestion({ question, answer, onChange }) {
    // 1. Data Mapping: Use 'question.question' based on your console logs
    const textToProcess = question.question || ""; 
    const charLimit = question.char_limit || 500; // Default limit if not provided
    
    // 2. Split by underscores (handles 3 or more underscores)
    const parts = textToProcess.split(/_{3,}/); 
    const hasPlaceholder = parts.length > 1;

    // 3. Validation Logic
    const isOverLimit = answer?.length > charLimit;
    const isNearLimit = answer?.length > charLimit * 0.9;

    return (
        <div className="w-full space-y-6">
            {/* INTERACTIVE PREVIEW BOX */}
            {hasPlaceholder && (
                <div className={cn(
                    "rounded-2xl px-6 py-4 border-2 border-dashed transition-colors duration-300",
                    isOverLimit 
                        ? "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900/30" 
                        : "bg-indigo-50/50 border-indigo-100 dark:bg-indigo-900/10 dark:border-indigo-900/30"
                )}>
                    <p className={cn(
                        "text-[10px] font-black uppercase tracking-[0.2em] mb-3 flex items-center gap-2",
                        isOverLimit ? "text-red-500" : "text-indigo-400"
                    )}>
                        <PencilLine className="h-3 w-3" /> Live Context Preview
                    </p>
                    
                    <div className=" font-medium leading-relaxed text-slate-700 dark:text-zinc-300">
                        {parts[0]}
                        <span className={cn(
                            "mx-1 px-2 py-0.5 rounded-md transition-all duration-300 underline decoration-2 underline-offset-4 break-words",
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
            <div className="space-y-3">
                <div className="flex justify-between items-end">
                    <Label 
                        htmlFor={`${question.id}-answer`} 
                        className="text-[10px] font-black uppercase tracking-widest text-slate-400"
                    >
                        Your Response
                    </Label>
                    
                    {isOverLimit && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-red-500 animate-pulse">
                            <AlertCircle className="h-3 w-3" /> Exceeds limit
                        </span>
                    )}
                </div>

                <Textarea
                    id={`${question.id}-answer`}
                    rows={3}
                    value={answer || ""}
                    onChange={(e) => onChange(question.id, e.target.value)}
                    placeholder="Type your answer here..."
                    className={cn(
                        "min-h-[120px] resize-none p-4 text-base rounded-2xl border-2 transition-all duration-200 shadow-sm",
                        "bg-white dark:bg-zinc-900 focus-visible:ring-0 focus-visible:ring-offset-0",
                        isOverLimit 
                            ? "border-red-500 focus-visible:border-red-500" 
                            : "border-slate-200 dark:border-zinc-800 focus-visible:border-indigo-500"
                    )}
                />
                
                {/* FOOTER: Character Count & Auto-save status */}
                <div className="flex justify-between items-center px-1">
                    <div className="flex items-center gap-2">
                         <div className={cn(
                            "h-2 w-2 rounded-full animate-pulse",
                            answer?.length > 0 ? "bg-emerald-500" : "bg-slate-300"
                         )} />
                         <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                            {answer?.length > 0 ? "Syncing to cloud" : "Awaiting input"}
                         </span>
                    </div>

                    <p className={cn(
                        "text-[10px] font-mono font-black px-2 py-1 rounded-md border",
                        isOverLimit 
                            ? "bg-red-50 text-red-600 border-red-200" 
                            : isNearLimit 
                                ? "bg-amber-50 text-amber-600 border-amber-200"
                                : "bg-slate-50 text-slate-500 border-slate-100 dark:bg-zinc-800 dark:border-zinc-700"
                    )}>
                        {answer?.length || 0} / {charLimit}
                    </p>
                </div>
            </div>
        </div>
    );
}