import { Check, X, CheckCircle2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export default function ChoiceQuestion({ question, answers }) {
    const studentSelection = answers[0]?.answer_text;

    return (
        <div className=" grid grid-cols-1 gap-3">
            {question.options?.map((option, idx) => {
                const isSelected = studentSelection === option.option_text;
                const isCorrect = option.is_correct === 1;
                
                const isTruePositive = isSelected && isCorrect;    // Right answer selected
                const isFalsePositive = isSelected && !isCorrect;  // Wrong answer selected
                const isFalseNegative = !isSelected && isCorrect;  // Correct answer missed

                // Generate A, B, C, D labels
                const label = String.fromCharCode(65 + idx);

                return (
                    <div
                        key={option.id}
                        className={cn(
                            'group relative flex items-center gap-4 rounded-2xl border p-4 transition-all duration-300',
                            // Base State
                            'border-border bg-card/50 hover:bg-muted/30 hover:shadow-md',
                            // Success State (Glassy Green)
                            isTruePositive && 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 ring-1 ring-emerald-500/50 shadow-emerald-100',
                            // Error State (Glassy Red)
                            isFalsePositive && 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 ring-1 ring-rose-500/50 shadow-rose-100',
                            // Correct-but-missed (Indicated via border style)
                            isFalseNegative && 'border-emerald-500/40 bg-emerald-50/20 border-dashed'
                        )}
                    >
                        {/* Letter Indicator (A, B, C, D) */}
                        <div className={cn(
                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-black transition-all",
                            "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary",
                            isTruePositive && "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30",
                            isFalsePositive && "bg-rose-500 text-white shadow-lg shadow-rose-500/30",
                            isFalseNegative && "bg-emerald-100 text-emerald-600 border border-emerald-500/30"
                        )}>
                            {label}
                        </div>

                        {/* Option Text Content */}
                        <div className="flex flex-1 items-center justify-between gap-4">
                            <span className={cn(
                                'text-sm transition-all',
                                isSelected ? 'font-bold text-foreground' : 'font-medium text-muted-foreground',
                                isFalseNegative && 'text-emerald-600 dark:text-emerald-400 font-semibold italic'
                            )}>
                                {option.option_text}
                            </span>

                            {/* Status Icons & Badges */}
                            <div className="flex items-center shrink-0 gap-3">
                                {isTruePositive && (
                                    <div className="flex items-center gap-2">
                                        <Badge className="bg-emerald-500 hover:bg-emerald-600 text-[10px] font-black uppercase tracking-tighter py-0 h-5">
                                            <Sparkles className="mr-1 h-3 w-3" /> Correct
                                        </Badge>
                                        <Check className="h-5 w-5 text-emerald-500 stroke-[3px]" />
                                    </div>
                                )}

                                {isFalsePositive && (
                                    <div className="flex items-center gap-2">
                                        <Badge variant="destructive" className="text-[10px] font-black uppercase tracking-tighter py-0 h-5">
                                            Incorrect
                                        </Badge>
                                        <X className="h-5 w-5 text-rose-500 stroke-[3px]" />
                                    </div>
                                )}

                                {isFalseNegative && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-tight opacity-70">
                                            Should have picked this
                                        </span>
                                        <CheckCircle2 className="h-5 w-5 text-emerald-500/60" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Visual Highlighting for Selection */}
                        {isSelected && (
                            <div className={cn(
                                "absolute left-0 top-1/4 h-1/2 w-1 rounded-r-full",
                                isTruePositive ? "bg-emerald-500" : "bg-rose-500"
                            )} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}