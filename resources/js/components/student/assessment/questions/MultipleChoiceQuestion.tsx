import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CheckCircle, HelpCircle } from 'lucide-react'; // Icon for selected state

// Utility function to generate sequential labels (A, B, C, ...)
const getOptionLabel = (index) => String.fromCharCode(65 + index);

export default function MultipleChoiceQuestion({ question, answer, onChange }) {
    // Assuming 'answer' is the selected option value (e.g., opt.id or opt.text)
    const answerValue = answer || '';

    return (
        <div className="w-full rounded-2xl border border-border bg-card p-6 shadow-md transition-shadow duration-300 hover:shadow-lg">
            {/* Radio Group */}
            <RadioGroup
                onValueChange={(val) => onChange(question.id, val)}
                value={answerValue}
                className="space-y-3"
            >
                {question.options.map((opt, index) => {
                    const optionValue = opt.text;
                    const isSelected = answerValue === optionValue;
                    const optionLabel = getOptionLabel(index);

                    return (
                        <Label
                            key={opt.id}
                            htmlFor={`${question.id}-${opt.id}`}
                            className={`flex cursor-pointer items-center justify-between gap-4 rounded-xl border-2 bg-card p-4 text-base font-medium shadow-sm transition-all duration-200 ease-in-out ${
                                isSelected
                                    ? 'border-primary bg-primary/5 text-primary shadow-lg ring-4 ring-ring/20'
                                    : 'border-border text-body hover:border-muted-foreground/30 hover:bg-muted/50'
                            } `}
                        >
                            {/* Left side: Option Letter and Text */}
                            <div className="flex flex-grow items-center gap-4">
                                <span
                                    className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm font-bold transition-colors ${
                                        isSelected
                                            ? 'border-primary bg-primary text-primary-foreground'
                                            : 'border-border bg-muted text-muted-foreground'
                                    } `}
                                >
                                    {optionLabel}
                                </span>
                                <span
                                    className={`flex-grow ${isSelected ? 'font-semibold text-title' : 'text-body'}`}
                                >
                                    {opt.text}
                                </span>
                            </div>

                            {/* Right side: Radio Button and Check Icon */}
                            <div className="relative">
                                <RadioGroupItem
                                    id={`${question.id}-${opt.id}`}
                                    value={optionValue}
                                    className="sr-only"
                                />

                                {isSelected && (
                                    <CheckCircle className="h-6 w-6 animate-in text-primary duration-200 zoom-in" />
                                )}
                            </div>
                        </Label>
                    );
                })}
            </RadioGroup>

            {/* Footer Instruction */}
            <div className="flex items-center mt-3 justify-center gap-2 text-muted-foreground/60">
                <HelpCircle className="h-3 w-3" />
                <span className="text-[10px] font-medium tracking-widest uppercase">
                    Select an correct option
                </span>
            </div>
        </div>
    );
}
