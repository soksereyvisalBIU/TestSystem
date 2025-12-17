import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit3, Trash2, GripVertical, Star } from 'lucide-react';
import { renderAnswers } from './function/renderAnswer';
import { cn } from '@/lib/utils';

export default function QuestionCard({
    question,
    index,
    onEdit,
    onDelete,
}: {
    question: any;
    index: number;
    onEdit: (index: number) => void;
    onDelete: (index: number) => void;
}) {
    // Format the type label for better reading
    const typeLabel = question?.type?.split('_').join(' ') || 'Question';

    return (
        <div
            onDoubleClick={onEdit}
            className="group relative flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-4 transition-all hover:border-primary/20 hover:shadow-md hover:shadow-slate-200/50 cursor-default"
        >
            {/* Drag Handle Indicator */}
            <div className="mt-1 text-slate-300 group-hover:text-slate-400 transition-colors cursor-grab active:cursor-grabbing">
                <GripVertical className="w-5 h-5" />
            </div>

            <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between pr-20">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-slate-300">#{index + 1}</span>
                            <Badge variant="outline" className="capitalize bg-slate-50 text-[10px] font-bold border-slate-100 text-slate-500 py-0 px-2 h-5">
                                {typeLabel}
                            </Badge>
                        </div>
                        <h3 className="text-sm font-bold text-slate-800 leading-snug pr-4">
                            {question.question || question.question_text || "Untitled Question"}
                        </h3>
                    </div>
                </div>

                {/* Answer Preview Area */}
                <div className="rounded-lg bg-slate-50/50 p-3 border border-slate-50">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Answer Preview</div>
                    <div className="text-xs text-slate-600 leading-relaxed font-medium">
                        {renderAnswers(question)}
                    </div>
                </div>
            </div>

            {/* Absolute Positioned Score & Actions */}
            <div className="absolute top-4 right-4 flex flex-col items-end gap-4">
                {/* Actions Menu */}
                <div className="flex items-center bg-slate-50 rounded-lg p-0.5 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-500 hover:text-primary hover:bg-white rounded-md shadow-none"
                        onClick={(e) => { e.stopPropagation(); onEdit(index); }}
                    >
                        <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-white rounded-md shadow-none"
                        onClick={(e) => { e.stopPropagation(); onDelete(index); }}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>

                {/* Point Badge */}
                <div className="flex items-center gap-1.5 px-3 py-1 bg-violet-50 text-violet-600 rounded-full border border-violet-100">
                    <Star className="w-3 h-3 fill-violet-600" />
                    <span className="text-[11px] font-black">{question?.point || 0} PTS</span>
                </div>
            </div>
        </div>
    );
}