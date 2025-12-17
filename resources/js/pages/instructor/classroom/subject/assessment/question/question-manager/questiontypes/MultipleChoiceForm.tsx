import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Trash2, Plus, CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  data: any;
  onChange: (data: any) => void;
}

export default function MultipleChoiceForm({ data, onChange }: Props) {
  const [options, setOptions] = useState<string[]>(data.options || ["", ""]);

  const updateOption = (index: number, value: string) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
    
    // If we're updating the text of the currently selected correct answer, 
    // we need to update the answer value in the parent state too.
    const isCurrentCorrect = data.answer === options[index];
    onChange({ 
      ...data, 
      options: updated, 
      answer: isCurrentCorrect ? value : data.answer 
    });
  };

  const addOption = () => {
    if (options.length >= 6) return; // UX choice: prevent overwhelming lists
    const updated = [...options, ""];
    setOptions(updated);
    onChange({ ...data, options: updated });
  };

  const removeOption = (index: number) => {
    if (options.length <= 2) return; // Pedagogy: MCQs usually need at least 2 options
    const updated = options.filter((_, i) => i !== index);
    const wasCorrect = data.answer === options[index];
    
    setOptions(updated);
    onChange({ 
      ...data, 
      options: updated, 
      answer: wasCorrect ? "" : data.answer 
    });
  };

  const setCorrectAnswer = (value: string) => {
    onChange({ ...data, answer: value });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-2 duration-500">
      {/* Question Textarea */}
      <div className="space-y-3">
        <Label htmlFor="question" className="text-sm font-semibold text-slate-700 ml-1">
          Question Stem
        </Label>
        <Textarea
          id="question"
          required
          placeholder="e.g., Which of the following is a primary color?"
          className="min-h-[100px] bg-white border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all resize-none text-lg"
          value={data.question || ""}
          onChange={(e) => onChange({ ...data, question: e.target.value })}
        />
      </div>

      {/* Options Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <Label className="text-sm font-semibold text-slate-700">Answer Options</Label>
          <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">
            Mark one as correct
          </span>
        </div>

        <div className="space-y-3">
          {options.map((opt, i) => {
            const isCorrect = data.answer === opt && opt !== "";
            
            return (
              <div 
                key={i} 
                className={cn(
                  "group flex items-center gap-3 p-2 rounded-xl border transition-all duration-200",
                  isCorrect 
                    ? "bg-emerald-50/50 border-emerald-200 shadow-sm" 
                    : "bg-white border-slate-100 hover:border-slate-200"
                )}
              >
                {/* Correct Answer Toggle */}
                <button
                  type="button"
                  onClick={() => setCorrectAnswer(opt)}
                  disabled={!opt.trim()}
                  className={cn(
                    "flex-shrink-0 ml-2 transition-transform active:scale-90 disabled:opacity-30",
                    isCorrect ? "text-emerald-500" : "text-slate-300 hover:text-slate-400"
                  )}
                >
                  {isCorrect ? (
                    <CheckCircle2 className="w-6 h-6 fill-emerald-50" />
                  ) : (
                    <Circle className="w-6 h-6" />
                  )}
                </button>

                {/* Input Field */}
                <Input
                  required
                  type="text"
                  placeholder={`Option ${i + 1}`}
                  value={opt}
                  onChange={(e) => updateOption(i, e.target.value)}
                  className={cn(
                    "flex-1 border-none bg-transparent shadow-none focus-visible:ring-0 text-base font-medium",
                    isCorrect ? "text-emerald-900" : "text-slate-700"
                  )}
                />

                {/* Delete Button */}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeOption(i)}
                  className={cn(
                    "opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-500 hover:bg-red-50",
                    options.length <= 2 && "hidden"
                  )}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            );
          })}
        </div>

        {/* Add Option Button */}
        <Button
          type="button"
          variant="outline"
          disabled={options.length >= 6}
          onClick={addOption}
          className="w-full py-6 border-dashed border-2 border-slate-200 text-slate-500 hover:text-primary hover:border-primary hover:bg-primary/5 transition-all group rounded-xl"
        >
          <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" />
          Add Choice
        </Button>
      </div>
    </div>
  );
}