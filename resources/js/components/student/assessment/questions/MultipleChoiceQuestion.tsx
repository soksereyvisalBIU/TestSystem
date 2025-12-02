import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function MultipleChoiceQuestion({ question, answer, onChange }) {
    return (
        <RadioGroup
            onValueChange={(val) => onChange(question.id, val)}
            value={answer || ""}
            className="space-y-2"
        >
            {question.options.map((opt, i) => (
                <div key={opt.id} className="flex items-center gap-2">
                    <RadioGroupItem value={opt} id={`${question.id}-${opt.id}`} />
                    <Label htmlFor={`${question.id}-${opt.id}`}>{opt.text}</Label>
                </div>
            ))}
        </RadioGroup>
    );
}
