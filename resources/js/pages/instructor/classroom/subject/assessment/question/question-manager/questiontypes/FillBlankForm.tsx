import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Props {
  data: any;
  onChange: (data: any) => void;
}

export default function FillBlankForm({ data, onChange }: Props) {
  return (
    <div className="space-y-4">
      {/* Question field */}
      <div className="space-y-2">
        <Label htmlFor="question">Question</Label>
        <Textarea
          id="question"
          required
          placeholder="Enter question (use ____ for blank)"
          value={data.question || ''}
          onChange={(e) => onChange({ ...data, question: e.target.value })}
        />
        
      </div>

      {/* Answer field */}
      <div className="space-y-2">
        <Label htmlFor="answer">Answer</Label>
        <Input
          id="answer"
          type="text"
          required
          placeholder="Enter correct answer"
          value={data.answer || ''}
          onChange={(e) => onChange({ ...data, answer: e.target.value })}
        />
      </div>
    </div>
  );
}
