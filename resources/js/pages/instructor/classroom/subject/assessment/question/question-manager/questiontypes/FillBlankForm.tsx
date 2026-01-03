import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, CheckCircle2, Eye, Type } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  data: {
    sentence?: string;
    answer?: string;
    question?: string;
  };
  onChange: (data: any) => void;
}

export default function FillBlankForm({ data, onChange }: Props) {
  const sentence = data.sentence || '';
  const answer = data.answer || '';

  const isAnswerValid = 
    answer.trim().length > 0 && 
    sentence.toLowerCase().includes(answer.toLowerCase());

  const showWarning = answer.length > 0 && !isAnswerValid;

  const generateQuestion = (fullText: string, phrase: string) => {
    if (!phrase || !fullText.toLowerCase().includes(phrase.toLowerCase())) {
      return fullText;
    }
    const regex = new RegExp(`(${phrase})`, 'gi');
    return fullText.replace(regex, '__________');
  };

  const handleChange = (field: string, value: string) => {
    const newData = { ...data, [field]: value };
    const updatedSentence = field === 'sentence' ? value : sentence;
    const updatedAnswer = field === 'answer' ? value : answer;
    
    newData.question = generateQuestion(updatedSentence, updatedAnswer);
    onChange(newData);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-2 duration-500">
      
      {/* Input Section */}
      <div className="space-y-6 bg-muted/30 p-5 rounded-2xl border border-border shadow-sm">
        
        {/* Full Sentence */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <Type className="w-4 h-4 text-description/60" />
            <Label htmlFor="sentence" className="text-sm font-semibold text-subtitle">
              Full Statement
            </Label>
          </div>
          <Textarea
            id="sentence"
            required
            placeholder="e.g., The capital of France is Paris."
            value={sentence}
            onChange={(e) => handleChange('sentence', e.target.value)}
            className={cn(
              "min-h-[100px] bg-background border-input text-body transition-all resize-none text-base",
              showWarning && "border-destructive ring-destructive/10 focus-visible:ring-destructive/20"
            )}
          />
        </div>

        {/* Phrase to Blank Out */}
        <div className="space-y-2">
          <Label htmlFor="answer" className="text-sm font-semibold text-subtitle ml-1">
            Target Word or Phrase
          </Label>
          <div className="relative group">
            <Input
              id="answer"
              type="text"
              required
              placeholder="e.g., Paris"
              value={answer}
              onChange={(e) => handleChange('answer', e.target.value)}
              className={cn(
                "h-11 bg-background border-input text-body pr-10 transition-all font-medium",
                isAnswerValid && "border-success/50 bg-success/5 focus-visible:ring-success/10",
                showWarning && "border-destructive pr-10 focus-visible:ring-destructive/20"
              )}
            />
            <div className="absolute inset-y-0 right-3 flex items-center">
              {isAnswerValid ? (
                <CheckCircle2 className="h-5 w-5 text-success animate-in zoom-in" />
              ) : showWarning ? (
                <AlertCircle className="h-5 w-5 text-destructive animate-in shake-x" />
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Question Preview Card */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <Eye className="w-4 h-4 text-primary" />
          <Label className="text-sm font-semibold text-description uppercase tracking-wider text-[11px]">
            Student View Preview
          </Label>
        </div>

        <div className={cn(
          "relative min-h-[80px] p-6 rounded-2xl border-2 border-dashed flex items-center justify-center transition-all duration-300",
          isAnswerValid 
            ? "bg-card border-primary/30 shadow-sm" 
            : "bg-muted/20 border-border"
        )}>
          {isAnswerValid ? (
            <p className="text-lg text-title text-center leading-relaxed">
              {data.question}
            </p>
          ) : (
            <div className="flex flex-col items-center gap-2 text-description">
              {showWarning ? (
                <p className="text-sm font-medium text-destructive flex items-center gap-2 px-4 py-2 bg-destructive/10 rounded-full">
                  <AlertCircle className="h-4 w-4" />
                  Phrase not found in the statement
                </p>
              ) : (
                <p className="text-sm italic opacity-70">Waiting for a valid statement and target phrase...</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}