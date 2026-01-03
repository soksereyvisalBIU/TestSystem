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
                <Label htmlFor="question" className="text-sm font-semibold text-subtitle ml-1">
                    Statement
                </Label>
                <Textarea
                    id="question"
                    required
                    placeholder="e.g., The Earth is the third planet from the Sun."
                    className="min-h-[120px] bg-background border-input focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all resize-none text-lg leading-relaxed shadow-sm text-body"
                    value={data.question || ''}
                    onChange={(e) => onChange({ ...data, question: e.target.value })}
                />
                <p className="text-xs text-description ml-1 opacity-70">
                    Write a clear statement that can be proven true or false.
                </p>
            </div>

            {/* Answer Toggle Section */}
            <div className="space-y-4">
                <Label className="text-sm font-semibold text-subtitle ml-1">
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
                                ? "border-blue-500 bg-blue-500/10 shadow-md shadow-blue-500/5"
                                : "border-border bg-card hover:border-border hover:bg-muted/50"
                        )}
                    >
                        <div className={cn(
                            "p-2 rounded-full transition-colors",
                            currentAnswer === 'true' ? "bg-blue-500 text-white" : "bg-muted text-description/60 group-hover:text-description"
                        )}>
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <span className={cn(
                            "font-bold text-lg",
                            currentAnswer === 'true' ? "text-blue-600 dark:text-blue-400" : "text-description"
                        )}>
                            True
                        </span>
                        
                        {currentAnswer === 'true' && (
                            <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-sm">
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
                                ? "border-destructive bg-destructive/10 shadow-md shadow-destructive/5"
                                : "border-border bg-card hover:border-border hover:bg-muted/50"
                        )}
                    >
                        <div className={cn(
                            "p-2 rounded-full transition-colors",
                            currentAnswer === 'false' ? "bg-destructive text-destructive-foreground" : "bg-muted text-description/60 group-hover:text-description"
                        )}>
                            <XCircle className="w-6 h-6" />
                        </div>
                        <span className={cn(
                            "font-bold text-lg",
                            currentAnswer === 'false' ? "text-destructive" : "text-description"
                        )}>
                            False
                        </span>

                        {currentAnswer === 'false' && (
                            <div className="absolute -top-2 -right-2 bg-destructive text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-sm">
                                Selected
                            </div>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}