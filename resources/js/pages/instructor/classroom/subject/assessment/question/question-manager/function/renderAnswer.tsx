import { cn } from '@/lib/utils';
import { ArrowRight, CheckCircle2, FileUp, Images } from 'lucide-react';

export const renderAnswers = (q: any) => {
    // Utility for letter indexing (A, B, C...)
    const getLetter = (i: number) => String.fromCharCode(65 + i);

    console.log(q);

    switch (q.type) {
        case 'true_false':
            return (
                <div className="mt-1 flex items-center gap-2">
                    <span className="text-slate-400">Correct Answer:</span>
                    <span
                        className={cn(
                            'rounded px-2 py-0.5 text-[10px] font-black tracking-wider uppercase',
                            q.answer === 'true' || q.answer === true
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-rose-100 text-rose-700',
                        )}
                    >
                        {String(q.answer)}
                    </span>
                </div>
            );

        case 'multiple_choice':
            return (
                <div className="mt-2 grid grid-cols-1 gap-x-4 gap-y-1.5 sm:grid-cols-2">
                    {q?.options?.map((opt: any, i: number) => {
                        const text =
                            typeof opt === 'string' ? opt : opt.option_text;
                        const isCorrect = text === q?.answer;
                        return (
                            <div
                                key={i}
                                className="group/opt flex items-center gap-2"
                            >
                                <span className="w-4 text-[10px] font-bold text-slate-300">
                                    {getLetter(i)}.
                                </span>
                                <span
                                    className={cn(
                                        'truncate text-xs transition-colors',
                                        isCorrect
                                            ? 'font-bold text-emerald-600'
                                            : 'text-slate-500',
                                    )}
                                >
                                    {text}
                                </span>
                                {isCorrect && (
                                    <CheckCircle2 className="h-3 w-3 shrink-0 text-emerald-500" />
                                )}
                            </div>
                        );
                    })}
                </div>
            );

        case 'matching':
            return (
                <div className="mt-2 space-y-1.5">
                    {q?.answer?.map((pair: any, i: number) => (
                        <div
                            key={i}
                            className="flex items-center gap-3 text-xs"
                        >
                            <div className="flex items-center gap-2 rounded border border-slate-100 bg-white px-2 py-1 font-medium text-slate-600 shadow-sm">
                                <span className="text-[10px] font-black text-slate-300">
                                    {i + 1}
                                </span>
                                {pair.left}
                            </div>
                            <ArrowRight className="h-3 w-3 text-slate-300" />
                            <div className="rounded border border-emerald-100 bg-emerald-50 px-2 py-1 font-bold text-emerald-700">
                                {pair.right}
                            </div>
                        </div>
                    ))}
                </div>
            );

        case 'ordering':
            const steps = q?.items || []; // Removed .data since items are top-level in your payload
            return (
                <div className="mt-2 flex flex-wrap gap-2">
                    {steps.map((step: any, i: number) => (
                        <div
                            key={step.id || i}
                            className="flex items-center gap-2"
                        >
                            <div className="flex items-center gap-1.5 rounded border border-slate-200 bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">
                                <span className="text-[10px] text-slate-400">
                                    {i + 1}
                                </span>
                                {step.content}
                            </div>
                            {i < steps.length - 1 && (
                                <ArrowRight className="h-3 w-3 text-slate-300" />
                            )}
                        </div>
                    ))}
                </div>
            );

        // Updated to match 'fileupload' key from QuestionFormModal
        case 'fileupload':
            // Map the media array from your API to the expected refImages
            const refImages = q?.media || [];

            return (
                <div className="mt-2 space-y-3">
                    {/* Constraints Header */}
                    <div className="flex w-fit items-center gap-4 rounded-lg border border-dashed border-slate-100 bg-slate-50/50 p-2">
                        <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase">
                            <FileUp className="h-3 w-3 text-amber-500" />
                            Format:{' '}
                            <span className="text-slate-700">
                                {/* Match the API key 'accepted_file_types' */}
                                {q?.accepted_file_types?.toUpperCase() || 'ANY'}
                            </span>
                        </div>
                        <div className="h-3 w-px bg-slate-200" />
                        <div className="text-[10px] font-black text-slate-500 uppercase">
                            {/* Match the API key 'max_file_size' */}
                            Limit:{' '}
                            <span className="text-slate-700">
                                {q?.max_file_size || '10'} MB
                            </span>
                        </div>
                    </div>

                    {/* Reference Images Preview */}
                    {refImages.length > 0 && (
                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-1 text-[10px] font-bold tracking-tight text-slate-400 uppercase">
                                <Images className="h-3 w-3" />
                                Instructor Reference Images:
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {refImages.map((img, idx) => (
                                    <div
                                        key={img.id || idx}
                                        className="group relative h-12 w-12 overflow-hidden rounded border border-slate-200 bg-white p-0.5 shadow-sm transition-transform hover:scale-110"
                                    >
                                        <img
                                            // Ensure path is prefixed with your storage URL
                                            src={`/storage/${img.path}`}
                                            alt={`Reference ${idx + 1}`}
                                            className="h-full w-full rounded-[1px] object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            );
        default:
            return (
                <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400 italic">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-200" />
                    Details are defined within the question properties.
                </div>
            );
    }
};
