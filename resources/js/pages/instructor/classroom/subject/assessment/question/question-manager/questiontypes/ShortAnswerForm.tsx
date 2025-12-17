import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlignLeft, Lightbulb, MessageSquareQuote } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  data: any;
  onChange: (data: any) => void;
}

export default function ShortAnswerForm({ data, onChange }: Props) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-2 duration-500">
      
      {/* Question Prompt Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <MessageSquareQuote className="w-4 h-4 text-primary" />
          <Label htmlFor="question" className="text-sm font-semibold text-slate-700">
            Question Prompt
          </Label>
        </div>
        <Textarea
          id="question"
          required
          placeholder="e.g., Briefly explain the significance of the Magna Carta in modern law."
          className="min-h-[140px] bg-white border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all resize-none text-lg leading-relaxed shadow-sm rounded-xl"
          value={data.question || ''}
          onChange={(e) => onChange({ ...data, question: e.target.value })}
        />
      </div>

      {/* Reference Answer Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <Label htmlFor="answer" className="text-sm font-semibold text-slate-700">
              Reference / Sample Answer
            </Label>
          </div>
          <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 uppercase font-bold tracking-tight">
            For Grading Reference
          </span>
        </div>

        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <AlignLeft className="w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
          </div>
          <Input
            id="answer"
            type="text"
            required
            placeholder="Enter the ideal response..."
            className="pl-11 h-12 bg-slate-50 border-slate-200 focus:bg-white focus:border-primary transition-all rounded-xl font-mono text-sm"
            value={data.answer || ''}
            onChange={(e) => onChange({ ...data, answer: e.target.value })}
          />
        </div>
        
        <div className="flex items-start gap-3 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
          <div className="mt-0.5">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          </div>
          <p className="text-xs text-blue-700 leading-normal">
            <strong>Pro-tip:</strong> Short answer questions are typically manually graded. Your reference answer helps ensure consistent evaluation later.
          </p>
        </div>
      </div>
    </div>
  );
}