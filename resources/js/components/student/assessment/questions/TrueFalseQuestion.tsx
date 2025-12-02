import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function TrueFalseQuestion({ question, answer, onChange }) {
    return (
        <RadioGroup
            onValueChange={val => onChange(question.id, val)}
            value={answer || ""}
            className="space-y-2"
        >
            {question.options.map((opt, i) => (
                <div className="flex items-center gap-2" key={opt.id}>
                    <RadioGroupItem id={`${question.id}-${opt.id}`} value={opt.text} />
                    <Label htmlFor={`${question.id}-${opt.id}`}>{opt.text}</Label>
                </div>
            ))}
        </RadioGroup>
    );
}
