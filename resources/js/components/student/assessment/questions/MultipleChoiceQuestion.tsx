import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CheckCircle, HelpCircle } from 'lucide-react';

const getOptionLabel = (index) => String.fromCharCode(65 + index);

export default function MultipleChoiceQuestion({ question, answer, onChange }) {
    const answerValue = answer || '';

    return (
        <div className="w-full rounded-xl border border-border bg-card p-3 sm:p-6 shadow-sm transition-shadow duration-300">
            <RadioGroup
                onValueChange={(val) => onChange(question.id, val)}
                value={answerValue}
                className="space-y-2 sm:space-y-3"
            >
                {question.options.map((opt, index) => {
                    const optionValue = opt.text;
                    const isSelected = answerValue === optionValue;
                    const optionLabel = getOptionLabel(index);

                    return (
                        <Label
                            key={opt.id}
                            htmlFor={`${question.id}-${opt.id}`}
                            className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border-2 bg-card p-3 sm:p-4 text-sm sm:text-base font-medium transition-all duration-200 active:scale-[0.98] ${
                                isSelected
                                    ? 'border-primary bg-primary/5 text-primary ring-2 sm:ring-4 ring-ring/20'
                                    : 'border-border text-body hover:border-muted-foreground/30'
                            }`}
                        >
                            <div className="flex flex-1 items-center gap-3 min-w-0">
                                {/* Letter Indicator - Scaled for XS */}
                                <span
                                    className={`flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full border text-xs sm:text-sm font-bold transition-colors ${
                                        isSelected
                                            ? 'border-primary bg-primary text-primary-foreground'
                                            : 'border-border bg-muted text-muted-foreground'
                                    }`}
                                >
                                    {optionLabel}
                                </span>

                                {/* Option Text - Truncation prevention */}
                                <span className={`leading-snug break-words ${isSelected ? 'font-semibold text-title' : 'text-body'}`}>
                                    {opt.text}
                                </span>
                            </div>

                            <div className="flex shrink-0 items-center justify-center w-6">
                                <RadioGroupItem
                                    id={`${question.id}-${opt.id}`}
                                    value={optionValue}
                                    className="sr-only"
                                />
                                {isSelected && (
                                    <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 animate-in fade-in zoom-in duration-200 text-primary" />
                                )}
                            </div>
                        </Label>
                    );
                })}
            </RadioGroup>

            <div className="flex items-center mt-3 justify-center gap-1.5 text-muted-foreground/50">
                <HelpCircle className="h-2.5 w-2.5" />
                <span className="text-[9px] font-bold tracking-widest uppercase">
                    Tap an option
                </span>
            </div>
        </div>
    );
}