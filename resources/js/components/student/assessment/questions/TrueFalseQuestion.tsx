import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CheckCircle2, Circle, HelpCircle, XCircle } from 'lucide-react';

export default function TrueFalseQuestion({ question, answer, onChange }) {
    const getOptionVisuals = (optionText: string, isChecked: boolean) => {
        const lowerText = optionText.toLowerCase();

        if (lowerText === 'true') {
            return {
                icon: <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6" />,
                activeClasses: 'border-success bg-success/10 text-success ring-success/20',
                iconColor: isChecked ? 'text-success' : 'text-muted-foreground',
            };
        }
        if (lowerText === 'false') {
            return {
                icon: <XCircle className="h-5 w-5 sm:h-6 sm:w-6" />,
                activeClasses: 'border-destructive bg-destructive/10 text-destructive ring-destructive/20',
                iconColor: isChecked ? 'text-destructive' : 'text-muted-foreground',
            };
        }
        return {
            icon: <Circle className="h-5 w-5 sm:h-6 sm:w-6" />,
            activeClasses: 'border-primary bg-primary/10 text-primary ring-ring/20',
            iconColor: isChecked ? 'text-primary' : 'text-muted-foreground',
        };
    };

    return (
        <div className="w-full   rounded-xl bg-card transition-all duration-300">
            {/* Radio Group - Using a tight gap for xs screens */}
            <RadioGroup
                onValueChange={(val) => onChange(question.id, val)}
                value={answer || ''}
                className="grid grid-cols-2 gap-3 sm:gap-4"
            >
                {question.options.map((opt) => {
                    const isChecked = answer === opt.text;
                    const { icon, activeClasses, iconColor } = getOptionVisuals(
                        opt.text,
                        isChecked,
                    );

                    return (
                        <Label
                            key={opt.id}
                            htmlFor={`${question.id}-${opt.id}`}
                            className={`relative flex cursor-pointer flex-col items-center justify-center space-y-2 rounded-xl border-2 px-2 py-4 sm:py-6 text-sm font-semibold shadow-sm transition-all duration-200 active:scale-95 ${
                                isChecked
                                    ? `ring-2 sm:ring-4 ${activeClasses}`
                                    : 'border-border bg-card text-body hover:border-muted-foreground/40'
                            }`}
                            data-state={isChecked ? 'checked' : 'unchecked'}
                        >
                            {/* Selected Badge - Smaller for XS */}
                            {isChecked && (
                                <div className="absolute -top-2 right-1/2 translate-x-1/2 sm:translate-x-0 sm:-right-2 rounded-full bg-blue-500 px-1.5 py-0.5 text-[8px] sm:text-[10px] font-black tracking-tighter text-white uppercase shadow-sm">
                                    Selected
                                </div>
                            )}

                            <RadioGroupItem
                                id={`${question.id}-${opt.id}`}
                                value={opt.text}
                                className="sr-only"
                            />

                            {/* Icon - Scaled for mobile */}
                            <div className={`transition-transform duration-200 ${
                                    isChecked ? 'scale-110 ' + iconColor : 'text-muted-foreground'
                                }`}
                            >
                                {icon}
                            </div>

                            {/* Option Text */}
                            <span className="text-[10px] sm:text-xs font-black tracking-widest uppercase">
                                {opt.text}
                            </span>
                        </Label>
                    );
                })}
            </RadioGroup>

            {/* Footer Instruction - Minimalist for XS */}
            <div className="mt-3 flex items-center justify-center gap-1.5 text-muted-foreground/50">
                <HelpCircle className="h-2.5 w-2.5" />
                <span className="text-[9px] font-bold tracking-widest uppercase">
                    Tap to select
                </span>
            </div>
        </div>
    );
}