import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle } from 'lucide-react'; // Icon for selected state

// Utility function to generate sequential labels (A, B, C, ...)
const getOptionLabel = (index) => String.fromCharCode(65 + index);

export default function MultipleChoiceQuestion({ question, answer, onChange }) {
    // Assuming 'answer' is the selected option value (e.g., opt.id or opt.text)
    const answerValue = answer || "";

return (
    <div className="w-full p-6 border border-border rounded-2xl bg-card shadow-md transition-shadow duration-300 hover:shadow-lg">
        {/* Question Text with title hierarchy */}
        <h3 className="text-xl font-bold text-title mb-5 leading-snug">
            {question.text}
        </h3>

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
                        className={`
                            flex items-center justify-between gap-4 
                            p-4 rounded-xl border-2 cursor-pointer 
                            text-base font-medium 
                            transition-all duration-200 ease-in-out
                            bg-card shadow-sm
                            ${
                                isSelected
                                    ? 'border-primary bg-primary/5 text-primary shadow-lg ring-4 ring-ring/20'
                                    : 'border-border text-body hover:bg-muted/50 hover:border-muted-foreground/30'
                            }
                        `}
                    >
                        {/* Left side: Option Letter and Text */}
                        <div className="flex items-center gap-4 flex-grow">
                            <span className={`
                                flex items-center justify-center 
                                w-8 h-8 rounded-full border 
                                text-sm font-bold transition-colors
                                ${isSelected 
                                    ? 'bg-primary text-primary-foreground border-primary' 
                                    : 'bg-muted text-muted-foreground border-border'}
                            `}>
                                {optionLabel}
                            </span>
                            <span className={`flex-grow ${isSelected ? 'text-title font-semibold' : 'text-body'}`}>
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
                                <CheckCircle className="w-6 h-6 text-primary animate-in zoom-in duration-200" />
                            )}
                        </div>
                    </Label>
                );
            })}
        </RadioGroup>
    </div>
);
}