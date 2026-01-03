import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CheckCircle2, Circle, HelpCircle, XCircle } from 'lucide-react';

export default function TrueFalseQuestion({ question, answer, onChange }) {
    const getOptionVisuals = (optionText: string, isChecked: boolean) => {
        const lowerText = optionText.toLowerCase();

        if (lowerText === 'true') {
            return {
                icon: <CheckCircle2 className="h-6 w-6" />,
                // Use success variables for True
                // activeClasses: "border-primary bg-primary/10 text-primary ring-primary/20",
                // iconColor: isChecked ? "text-primary" : "text-muted-foreground"
                activeClasses:
                    'border-success bg-success/10 text-success ring-success/20',
                iconColor: isChecked ? 'text-success' : 'text-muted-foreground',
            };
        }
        if (lowerText === 'false') {
            return {
                icon: <XCircle className="h-6 w-6" />,
                // Use destructive (Logo Crimson) for False
                // activeClasses: "border-primary bg-primary/10 text-primary ring-primary/20",
                // iconColor: isChecked ? "text-primary" : "text-muted-foreground"
                activeClasses:
                    'border-destructive bg-destructive/10 text-destructive ring-destructive/20',
                iconColor: isChecked
                    ? 'text-destructive'
                    : 'text-muted-foreground',
            };
        }
        return {
            icon: <Circle className="h-6 w-6" />,
            activeClasses:
                'border-primary bg-primary/10 text-primary ring-ring/20',
            iconColor: isChecked ? 'text-primary' : 'text-muted-foreground',
        };
    };

    return (
        <div className="w-full rounded-2xl bg-card transition-all duration-300">
            {/* Radio Group */}
            <RadioGroup
                onValueChange={(val) => onChange(question.id, val)}
                value={answer || ''}
                className="grid grid-cols-2 gap-4"
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
                            className={`flex cursor-pointer flex-col items-center justify-center space-y-3 rounded-xl border-2 px-4 py-6 text-base font-semibold shadow-sm transition-all duration-200 active:scale-95 ${
                                isChecked
                                    ? `ring-4 ${activeClasses}`
                                    : 'border-border bg-card text-body hover:border-muted-foreground/40 hover:bg-muted/30'
                            } `}
                            data-state={isChecked ? 'checked' : 'unchecked'}
                        >
                            <RadioGroupItem
                                id={`${question.id}-${opt.id}`}
                                value={opt.text}
                                className="sr-only"
                            />

                            {/* Icon with dynamic theme coloring */}
                            <div
                                className={`transition-transform duration-200 ${isChecked ? 'scale-110 ' + iconColor : 'text-muted-foreground'}`}
                            >
                                {icon}
                            </div>

                            {/* Option Text */}
                            <span className="text-xs font-black tracking-wide uppercase">
                                {opt.text}
                            </span>
                        </Label>
                    );
                })}
            </RadioGroup>
            {/* Footer Instruction */}
            <div className="flex items-center justify-center gap-2 text-muted-foreground/60 mt-3">
                <HelpCircle className="h-3 w-3" />
                <span className="text-[10px] font-medium tracking-widest uppercase">
                    Select one to proceed
                </span>
            </div>{' '}
        </div>
    );
}
