import { cn } from '@/lib/utils';
import { Check, X, ArrowRight, CornerDownRight } from 'lucide-react';

export default function MatchingQuestion({ question, answers }) {
    return (
        <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            {/* Table Header: Using bg-muted/80 and text-description */}
            <div className="grid grid-cols-12 bg-muted/80 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-description border-b border-border">
                <div className="col-span-5">Term / Prompt</div>
                <div className="col-span-1 flex justify-center text-muted-foreground/40">
                    <ArrowRight className="h-3 w-3" />
                </div>
                <div className="col-span-6 pl-2">Student Connection</div>
            </div>

            <div className="divide-y divide-border">
                {question.options?.map((option) => {
                    const answer = answers.find((a) => a.option_id === option.id);
                    const studentSelection = answer?.answer_text;
                    // const isCorrect = studentSelection === option.match_key;
                    const isCorrect = studentSelection === option.option_text;

                    // console.log(option);

                    return (
                        <div
                            key={option.id}
                            className={cn(
                                'grid grid-cols-12 items-center px-4 py-3.5 transition-colors',
                                // Correct rows stay clean, incorrect rows get a subtle destructive tint
                                isCorrect ? 'bg-card' : 'bg-destructive/5'
                            )}
                        >
                            {/* Left Side: The Question Option */}
                            <div className="col-span-5">
                                <span className="text-sm font-semibold text-body">
                                    {option.match_key}
                                    {/* {option.option_text} */}
                                </span>
                            </div>

                            {/* Middle: Connector Icon */}
                            <div className="col-span-1 flex justify-center">
                                {isCorrect ? (
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success/20">
                                        <Check className="h-3.5 w-3.5 text-success" />
                                    </div>
                                ) : (
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-destructive/20">
                                        <X className="h-3.5 w-3.5 text-destructive" />
                                    </div>
                                )}
                            </div>

                            {/* Right Side: Student Selection vs Key */}
                            <div className="col-span-6 flex flex-col pl-2">
                                <div className="flex items-center gap-2">
                                    <span
                                        className={cn(
                                            'text-sm font-medium',
                                            isCorrect ? 'text-body' : 'text-destructive line-through decoration-destructive/30'
                                        )}
                                    >
                                        {studentSelection || (
                                            <span className="italic text-description/60">No match selected</span>
                                        )}
                                    </span>
                                </div>

                                {/* Correction Logic: Emerald replaced with Success */}
                                {!isCorrect && (
                                    <div className="mt-1 flex items-center gap-1.5 text-[11px] font-bold text-success">
                                        <CornerDownRight className="h-3 w-3" />
                                        <span>Correct Key: {option.match_key}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}