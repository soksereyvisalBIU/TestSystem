import { Check, X, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export default function ChoiceQuestion({ question, answers }) {
    const studentSelection = answers[0]?.answer_text;

    return (
        <div className="mt-4 space-y-3">
            {question.options?.map((option) => {
                const isSelected = studentSelection === option.option_text;
                const isCorrect = option.is_correct === 1;
                
                const isTruePositive = isSelected && isCorrect;    // Right answer selected
                const isFalsePositive = isSelected && !isCorrect;  // Wrong answer selected
                const isFalseNegative = !isSelected && isCorrect;  // Correct answer missed

                return (
                    <div
                        key={option.id}
                        className={cn(
                            'relative flex items-center gap-4 rounded-xl border p-4 transition-all duration-200',
                            // Base State: Card background with standard borders
                            'border-border bg-card shadow-sm hover:border-description/30',
                            // Success State: Using semantic success with alpha
                            isTruePositive && 'border-success bg-success/10 ring-1 ring-success shadow-sm',
                            // Error State: Using semantic destructive with alpha
                            isFalsePositive && 'border-destructive bg-destructive/10 ring-1 ring-destructive/50',
                            // Correct-but-missed: Dashed border to indicate it "should" have been picked
                            isFalseNegative && 'border-success/50 bg-success/5 border-dashed'
                        )}
                    >
                        {/* Status Icon Indicator */}
                        <div className={cn(
                            'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-transform',
                            isSelected ? 'scale-110 shadow-sm' : 'scale-100',
                            
                            isTruePositive && 'border-success bg-success text-white',
                            isFalsePositive && 'border-destructive bg-destructive text-white',
                            isFalseNegative && 'border-success bg-transparent text-success',
                            !isSelected && !isCorrect && 'border-border bg-muted text-transparent'
                        )}>
                            {isTruePositive && <Check className="h-4 w-4 stroke-[3px]" />}
                            {isFalsePositive && <X className="h-4 w-4 stroke-[3px]" />}
                            {isFalseNegative && <CheckCircle2 className="h-4 w-4" />}
                            {!isSelected && !isCorrect && <div className="h-1.5 w-1.5 rounded-full bg-border" />}
                        </div>

                        {/* Option Text */}
                        <div className="flex flex-1 items-center justify-between gap-4">
                            <span className={cn(
                                'text-sm transition-colors',
                                isSelected ? 'font-bold text-title' : 'font-medium text-body',
                                isFalseNegative && 'text-success font-semibold'
                            )}>
                                {option.option_text}
                            </span>

                            {/* Contextual Badges */}
                            <div className="flex shrink-0 gap-2">
                                {isFalsePositive && (
                                    <Badge variant="outline" className="border-destructive/20 bg-card text-destructive text-[10px] font-bold uppercase tracking-tight">
                                        Incorrect Choice
                                    </Badge>
                                )}
                                {isFalseNegative && (
                                    <Badge variant="outline" className="border-success/20 bg-success/10 text-success text-[10px] font-bold uppercase tracking-tight">
                                        The Right Answer
                                    </Badge>
                                )}
                                {isTruePositive && (
                                    <Badge variant="secondary" className="bg-success text-white border-none text-[10px] font-bold uppercase tracking-tight">
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