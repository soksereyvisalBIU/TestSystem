import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function ShortAnswerQuestion({ question, answer, onChange }) {
    return (
        <div className="space-y-2">
            <Label>Your Answer</Label>
            <Textarea
                rows={4}
                value={answer || ""}
                onChange={(e) => onChange(question.id, e.target.value)}
                placeholder="Type your answer..."
            />
        </div>
    );
}
