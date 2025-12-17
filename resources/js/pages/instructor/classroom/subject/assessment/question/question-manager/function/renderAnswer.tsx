import { ArrowRight, CheckCircle2, FileUp, ListOrdered } from 'lucide-react';
import { cn } from '@/lib/utils';

export const renderAnswers = (q: any) => {
    // Utility for letter indexing (A, B, C...)
    const getLetter = (i: number) => String.fromCharCode(65 + i);

    switch (q.type) {
        case 'true_false':
            return (
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-slate-400">Correct Answer:</span>
                    <span className={cn(
                        "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider",
                        q.answer === 'true' || q.answer === true 
                            ? "bg-emerald-100 text-emerald-700" 
                            : "bg-rose-100 text-rose-700"
                    )}>
                        {String(q.answer)}
                    </span>
                </div>
            );

        case 'multiple_choice':
            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 mt-2">
                    {q?.options?.map((opt: any, i: number) => {
                        const text = typeof opt === 'string' ? opt : opt.option_text;
                        const isCorrect = text === q?.answer;
                        return (
                            <div key={i} className="flex items-center gap-2 group/opt">
                                <span className="text-[10px] font-bold text-slate-300 w-4">{getLetter(i)}.</span>
                                <span className={cn(
                                    "text-xs truncate transition-colors",
                                    isCorrect ? "text-emerald-600 font-bold" : "text-slate-500"
                                )}>
                                    {text}
                                </span>
                                {isCorrect && <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />}
                            </div>
                        );
                    })}
                </div>
            );

        case 'matching':
            return (
                <div className="space-y-1.5 mt-2">
                    {q?.answer?.map((pair: any, i: number) => (
                        <div key={i} className="flex items-center gap-3 text-xs">
                            <div className="flex items-center gap-2 bg-white border border-slate-100 px-2 py-1 rounded shadow-sm font-medium text-slate-600">
                                <span className="text-[10px] text-slate-300 font-black">{i + 1}</span>
                                {pair.left}
                            </div>
                            <ArrowRight className="w-3 h-3 text-slate-300" />
                            <div className="px-2 py-1 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-100">
                                {pair.right}
                            </div>
                        </div>
                    ))}
                </div>
            );

        case 'ordering':
            const steps = q?.data?.items || [];
            return (
                <div className="flex flex-wrap gap-2 mt-2">
                    {steps.map((step: any, i: number) => (
                        <div key={step.id} className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded text-xs font-bold text-slate-600 border border-slate-200">
                                <span className="text-[10px] text-slate-400">{i + 1}</span>
                                {step.content}
                            </div>
                            {i < steps.length - 1 && <ArrowRight className="w-3 h-3 text-slate-300" />}
                        </div>
                    ))}
                </div>
            );

        case 'file_upload':
            return (
                <div className="flex items-center gap-4 mt-1 bg-slate-50/50 p-2 rounded-lg border border-slate-100 border-dashed">
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase">
                        <FileUp className="w-3 h-3" />
                        Type: {q?.data?.fileType || 'PDF'}
                    </div>
                    <div className="w-px h-3 bg-slate-200" />
                    <div className="text-[10px] font-black text-slate-500 uppercase">
                        Max: {q?.data?.maxSize || '10'} MB
                    </div>
                </div>
            );

        default:
            return (
                <div className="mt-1 text-[11px] text-slate-400 italic flex gap-2 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                    Correct answer is defined within the question data.
                </div>
            );
    }
};