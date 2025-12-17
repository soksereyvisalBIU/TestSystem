import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle } from 'lucide-react';

interface Props {
  data: any;
  onChange: (data: any) => void;
}

export default function TrueFalseForm({ data, onChange }: Props) {
  // Ensure we have a default value if none exists
  const currentAnswer = data.answer ?? 'true';

  const handleSelect = (val: string) => {
    onChange({ ...data, answer: val });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-2 duration-500">
      {/* Question Input */}
      <div className="space-y-3">
        <Label htmlFor="question" className="text-sm font-semibold text-slate-700 ml-1">
          Statement
        </Label>
        <Textarea
          id="question"
          required
          placeholder="e.g., The Earth is the third planet from the Sun."
          className="min-h-[120px] bg-white border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all resize-none text-lg leading-relaxed shadow-sm"
          value={data.question || ''}
          onChange={(e) => onChange({ ...data, question: e.target.value })}
        />
        <p className="text-xs text-slate-400 ml-1">
          Write a clear statement that can be proven true or false.
        </p>
      </div>

      {/* Answer Toggle Section */}
      <div className="space-y-4">
        <Label className="text-sm font-semibold text-slate-700 ml-1">
          Correct Answer
        </Label>
        
        <div className="grid grid-cols-2 gap-4">
          {/* True Option */}
          <button
            type="button"
            onClick={() => handleSelect('true')}
            className={cn(
              "relative flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 transition-all duration-200 group",
              currentAnswer === 'true'
                ? "border-sky-500 bg-sky-50/50 shadow-md shadow-sky-100"
                : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50"
            )}
          >
            <div className={cn(
              "p-2 rounded-full transition-colors",
              currentAnswer === 'true' ? "bg-sky-500 text-white" : "bg-slate-100 text-slate-400 group-hover:text-slate-500"
            )}>
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <span className={cn(
              "font-bold text-lg",
              currentAnswer === 'true' ? "text-sky-700" : "text-slate-500"
            )}>
              True
            </span>
            
            {currentAnswer === 'true' && (
              <div className="absolute -top-2 -right-2 bg-sky-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-sm">
                Selected
              </div>
            )}
          </button>

          {/* False Option */}
          <button
            type="button"
            onClick={() => handleSelect('false')}
            className={cn(
              "relative flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 transition-all duration-200 group",
              currentAnswer === 'false'
                ? "border-rose-500 bg-rose-50/50 shadow-md shadow-rose-100"
                : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50"
            )}
          >
            <div className={cn(
              "p-2 rounded-full transition-colors",
              currentAnswer === 'false' ? "bg-rose-500 text-white" : "bg-slate-100 text-slate-400 group-hover:text-slate-500"
            )}>
              <XCircle className="w-6 h-6" />
            </div>
            <span className={cn(
              "font-bold text-lg",
              currentAnswer === 'false' ? "text-rose-700" : "text-slate-500"
            )}>
              False
            </span>

            {currentAnswer === 'false' && (
              <div className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-sm">
                Selected
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}