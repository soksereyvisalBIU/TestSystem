import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function MultipleChoiceQuestion({ q, value, onChange }: any) {    
    return (
        <div className="space-y-2">
            {q.options.map((opt: any) => (
                <Label key={opt.id} className="flex items-center gap-2">
                    <Input
                        type="radio"
                        name={`q_${q.id}`}
                        checked={value === opt.id}
                        onChange={() => onChange(q.id, opt.id)}
                        className="h-4 w-4"
                    />
                    {opt.option_text}
                </Label>
            ))}
        </div>
    );
}
