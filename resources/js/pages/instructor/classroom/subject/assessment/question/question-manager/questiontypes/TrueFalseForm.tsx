import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Props {
  data: any;
  onChange: (data: any) => void;
}

export default function TrueFalseForm({ data, onChange }: Props) {
  return (
    <div className="space-y-3">
      {/* Question Field */}
      <Label>Question</Label>
      <Textarea
        required
        placeholder="Enter question..."
        value={data.question || ''}
        onChange={(e) => onChange({ ...data, question: e.target.value })}
      />

      {/* Answer Field */}
      <Label>Answer</Label>
      <Select
        value={data.answer || 'true'}
        onValueChange={(value) => onChange({ ...data, answer: value })} // ✅ FIXED
      >
        <SelectTrigger>
          <SelectValue placeholder="Select answer" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="true">True</SelectItem>
          <SelectItem value="false">False</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
