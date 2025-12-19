import { cn } from '@/lib/utils';
import { Check, X, ArrowRight, CornerDownRight } from 'lucide-react';

export default function MatchingQuestion({ question, answers }) {
    return (
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            {/* Table Header */}
            <div className="grid grid-cols-12 bg-slate-50/80 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b">
                <div className="col-span-5">Term / Prompt</div>
                <div className="col-span-1 flex justify-center text-slate-300">
                    <ArrowRight className="h-3 w-3" />
                </div>
                <div className="col-span-6 pl-2">Student Connection</div>
            </div>

            <div className="divide-y divide-slate-100">
                {question.options?.map((option) => {
                    const answer = answers.find((a) => a.option_id === option.id);
                    const studentSelection = answer?.answer_text;
                    const isUnanswered = !studentSelection;
                    const isCorrect = studentSelection === option.match_key;

                    return (
                        <div
                            key={option.id}
                            className={cn(
                                'grid grid-cols-12 items-center px-4 py-3.5 transition-colors',
                                isCorrect ? 'bg-white' : 'bg-rose-50/30'
                            )}
                        >
                            {/* Left Side: The Question Option */}
                            <div className="col-span-5">
                                <span className="text-sm font-semibold text-slate-700">
                                    {option.option_text}
                                </span>
                            </div>

                            {/* Middle: Connector Icon */}
                            <div className="col-span-1 flex justify-center">
                                {isCorrect ? (
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100">
                                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                                    </div>
                                ) : (
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-100">
                                        <X className="h-3.5 w-3.5 text-rose-600" />
                                    </div>
                                )}
                            </div>

                            {/* Right Side: Student Selection vs Key */}
                            <div className="col-span-6 flex flex-col pl-2">
                                <div className="flex items-center gap-2">
                                    <span
                                        className={cn(
                                            'text-sm font-medium',
                                            isCorrect ? 'text-slate-600' : 'text-rose-700 line-through decoration-rose-300/50'
                                        )}
                                    >
                                        {studentSelection || (
                                            <span className="italic text-slate-400">No match selected</span>
                                        )}
                                    </span>
                                </div>

                                {/* Correction Logic */}
                                {!isCorrect && (
                                    <div className="mt-1 flex items-center gap-1.5 text-[11px] font-bold text-emerald-600">
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