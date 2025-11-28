import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Trash2 } from 'lucide-react';

interface Pair {
  left: string;
  right: string;
}

interface Props {
  data: any;
  onChange: (data: any) => void;
}

export default function MatchingForm({ data, onChange }: Props) {
  const [pairs, setPairs] = useState<Pair[]>(data?.answer || [{ left: '', right: '' }]);

  const updatePair = (index: number, key: keyof Pair, value: string) => {
    const updated = [...pairs];
    updated[index][key] = value;
    setPairs(updated);
    onChange({ ...data, answer: updated });
  };

  const addPair = () => {
    const updated = [...pairs, { left: '', right: '' }];
    setPairs(updated);
    onChange({ ...data, answer: updated });
  };

  const removePair = (index: number) => {
    const updated = pairs.filter((_, i) => i !== index);
    setPairs(updated);
    onChange({ ...data, answer: updated });
  };

  return (
    <div className="space-y-4">
      {/* Question */}
      <div className="space-y-2">
        <Label htmlFor="question">Question</Label>
        <Textarea
          id="question"
          required
          placeholder="Enter matching question..."
          value={data.question || ''}
          onChange={(e) => onChange({ ...data, question: e.target.value })}
        />
      </div>

      {/* Pairs */}
      <div className="space-y-3">
        <Label>Matching Pairs</Label>
        {pairs?.map((p, i) => (
          <div key={i} className="flex items-center gap-2">
            <Input
              required
              type="text"
              className="flex-1"
              placeholder={`Left ${i + 1}`}
              value={p.left}
              onChange={(e) => updatePair(i, 'left', e.target.value)}
            />
            <Input
              required
              type="text"
              className="flex-1"
              placeholder={`Right ${i + 1}`}
              value={p.right}
              onChange={(e) => updatePair(i, 'right', e.target.value)}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removePair(i)}
              className="text-red-500 hover:text-red-600"
            >
              {/* ✕ */}
              <Trash2 />
            </Button>
          </div>
        ))}

        <Button
          type="button"
          variant="link"
          className="text-blue-600"
          onClick={addPair}
        >
          + Add Pair
        </Button>
      </div>
    </div>
  );
}
