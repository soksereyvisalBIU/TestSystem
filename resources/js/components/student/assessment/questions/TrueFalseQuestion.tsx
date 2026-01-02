import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle, Circle } from 'lucide-react'; 

export default function TrueFalseQuestion({ question, answer, onChange }) {
    
    const getOptionVisuals = (optionText: string, isChecked: boolean) => {
        const lowerText = optionText.toLowerCase();
        
        if (lowerText === "true") {
            return {
                icon: <CheckCircle2 className="w-6 h-6" />,
                // Use success variables for True
                activeClasses: "border-success bg-success/10 text-success ring-success/20",
                iconColor: isChecked ? "text-success" : "text-muted-foreground"
            };
        }
        if (lowerText === "false") {
            return {
                icon: <XCircle className="w-6 h-6" />,
                // Use destructive (Logo Crimson) for False
                activeClasses: "border-destructive bg-destructive/10 text-destructive ring-destructive/20",
                iconColor: isChecked ? "text-destructive" : "text-muted-foreground"
            };
        }
        return {
            icon: <Circle className="w-6 h-6" />,
            activeClasses: "border-primary bg-primary/10 text-primary ring-ring/20",
            iconColor: isChecked ? "text-primary" : "text-muted-foreground"
        };
    };

    return (
        <div className="w-full p-5 border border-border rounded-2xl bg-card shadow-md transition-all duration-300 hover:shadow-lg">
            {/* Question Text */}
            <p className="font-bold text-lg text-title mb-5 leading-snug">
                {question.text}
            </p>

            {/* Radio Group */}
            <RadioGroup
                onValueChange={(val) => onChange(question.id, val)}
                value={answer || ""}
                className="grid grid-cols-2 gap-4"
            >
                {question.options.map((opt) => {
                    const isChecked = answer === opt.text;
                    const { icon, activeClasses, iconColor } = getOptionVisuals(opt.text, isChecked);

                    return (
                        <Label
                            key={opt.id}
                            htmlFor={`${question.id}-${opt.id}`}
                            className={`
                                flex flex-col items-center justify-center space-y-3 
                                border-2 rounded-xl py-6 px-4 cursor-pointer 
                                text-base font-semibold transition-all duration-200 
                                shadow-sm active:scale-95
                                ${isChecked 
                                    ? `ring-4 ${activeClasses}` 
                                    : 'border-border bg-card text-body hover:border-muted-foreground/40 hover:bg-muted/30'}
                            `}
                            data-state={isChecked ? "checked" : "unchecked"}
                        >
                            <RadioGroupItem
                                id={`${question.id}-${opt.id}`}
                                value={opt.text}
                                className="sr-only" 
                            />
                            
                            {/* Icon with dynamic theme coloring */}
                            <div className={`transition-transform duration-200 ${isChecked ? 'scale-110 ' + iconColor : 'text-muted-foreground'}`}>
                                {icon}
                            </div>
                            
                            {/* Option Text */}
                            <span className="tracking-wide uppercase text-xs font-black">
                                {opt.text}
                            </span>
                        </Label>
                    );
                })}
            </RadioGroup>
        </div>
    );
}