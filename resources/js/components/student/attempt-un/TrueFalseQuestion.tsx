import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function TrueFalseQuestion({ q, value, onChange }: any) {
    return (
        <div className="space-y-2">
            {['true', 'false'].map((val) => (
                <Label key={val} className="flex items-center gap-2">
                    <Input
                        type="radio"
                        name={`q_${q.id}`}
                        checked={value === val}
                        onChange={() => onChange(q.id, val)}
                        className="h-4 w-4"
                    />
                    {val.charAt(0).toUpperCase() + val.slice(1)}
                </Label>
            ))}
        </div>
    );
}
