import { Check, X, Circle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export default function ChoiceQuestion({ question, answers }) {
    const studentSelection = answers[0]?.answer_text;

    return (
        <div className="mt-4 space-y-3">
            {question.options?.map((option) => {
                const isSelected = studentSelection === option.option_text;
                const isCorrect = option.is_correct === 1;
                
                // Logic-driven styling
                const isTruePositive = isSelected && isCorrect;    // Student got it right
                const isFalsePositive = isSelected && !isCorrect;  // Student picked wrong one
                const isFalseNegative = !isSelected && isCorrect;  // Student missed this one

                return (
                    <div
                        key={option.id}
                        className={cn(
                            'relative flex items-center gap-4 rounded-xl border p-4 transition-all duration-200',
                            // Base State
                            'border-slate-200 bg-white shadow-sm hover:border-slate-300',
                            // Success State
                            isTruePositive && 'border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500 shadow-emerald-100',
                            // Error State
                            isFalsePositive && 'border-rose-300 bg-rose-50/30 ring-1 ring-rose-200',
                            // Correct-but-missed State
                            isFalseNegative && 'border-emerald-200 bg-emerald-50/20 border-dashed'
                        )}
                    >
                        {/* Status Icon Indicator */}
                        <div className={cn(
                            'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-transform',
                            isSelected ? 'scale-110 shadow-sm' : 'scale-100',
                            
                            isTruePositive && 'border-emerald-600 bg-emerald-600 text-white',
                            isFalsePositive && 'border-rose-500 bg-rose-500 text-white',
                            isFalseNegative && 'border-emerald-400 bg-transparent text-emerald-500',
                            !isSelected && !isCorrect && 'border-slate-300 bg-slate-50 text-transparent'
                        )}>
                            {isTruePositive && <Check className="h-4 w-4 stroke-[3px]" />}
                            {isFalsePositive && <X className="h-4 w-4 stroke-[3px]" />}
                            {isFalseNegative && <CheckCircle2 className="h-4 w-4" />}
                            {!isSelected && !isCorrect && <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />}
                        </div>

                        {/* Option Text */}
                        <div className="flex flex-1 items-center justify-between gap-4">
                            <span className={cn(
                                'text-sm transition-colors',
                                isSelected ? 'font-bold text-slate-900' : 'font-medium text-slate-600',
                                isFalseNegative && 'text-emerald-700 font-semibold'
                            )}>
                                {option.option_text}
                            </span>

                            {/* Contextual Badges */}
                            <div className="flex shrink-0 gap-2">
                                {isFalsePositive && (
                                    <Badge variant="outline" className="border-rose-200 bg-white text-rose-600 text-[10px] font-bold uppercase tracking-tight">
                                        Incorrect Choice
                                    </Badge>
                                )}
                                {isFalseNegative && (
                                    <Badge variant="outline" className="border-emerald-200 bg-emerald-100/50 text-emerald-700 text-[10px] font-bold uppercase tracking-tight">
                                        The Right Answer
                                    </Badge>
                                )}
                                {isTruePositive && (
                                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-tight">
                                        Perfect
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}