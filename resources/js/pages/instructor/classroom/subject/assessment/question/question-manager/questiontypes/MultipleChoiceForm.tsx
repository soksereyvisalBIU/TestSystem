import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Trash2 } from "lucide-react";

interface Props {
  data: any;
  onChange: (data: any) => void;
}

export default function MultipleChoiceForm({ data, onChange }: Props) {
  const [options, setOptions] = useState<string[]>(data.options || [""]);

  const updateOption = (index: number, value: string) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
    onChange({ ...data, options: updated });
  };

  const addOption = () => {
    const updated = [...options, ""];
    setOptions(updated);
    onChange({ ...data, options: updated });
  };

  const removeOption = (index: number) => {
    const updated = options.filter((_, i) => i !== index);
    setOptions(updated);

    // If the removed option was the correct answer, clear it
    const newAnswer = data.answer === options[index] ? "" : data.answer;
    onChange({ ...data, options: updated, answer: newAnswer });
  };

  const setCorrectAnswer = (index: number) => {
    onChange({ ...data, answer: options[index] });
  };

  return (
    <div className="space-y-4">
      {/* Question Field */}
      <div className="space-y-2">
        <Label htmlFor="question">Question</Label>
        <Textarea
          id="question"
          required
          placeholder="Enter question..."
          value={data.question || ""}
          onChange={(e) => onChange({ ...data, question: e.target.value })}
        />
      </div>

      {/* Options Section */}
      <div className="space-y-3">
        <Label>Options</Label>

        {options.map((opt, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="radio"
              name={`correct-answer-${data.id || "new"}`}
              checked={data.answer === opt}
              onChange={() => setCorrectAnswer(i)}
              className="accent-blue-600 mt-1"
            />
            <Input
              required
              type="text"
              placeholder={`Option ${i + 1}`}
              value={opt}
              onChange={(e) => updateOption(i, e.target.value)}
              className="flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeOption(i)}
              className="text-red-500 hover:text-red-600"
            >
              <Trash2 />
              {/* ✕ */}
            </Button>
              
          </div>
        ))}

        <Button
          type="button"
          variant="link"
          className="text-blue-600"
          onClick={addOption}
        >
          + Add Option
        </Button>
      </div>
    </div>
  );
}
