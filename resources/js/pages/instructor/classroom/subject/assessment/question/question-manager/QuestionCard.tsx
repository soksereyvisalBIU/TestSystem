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
            className="group relative flex items-start gap-4 rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-md cursor-default"
        >
            {/* Drag Handle Indicator */}
            <div className="mt-1 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors cursor-grab active:cursor-grabbing">
                <GripVertical className="w-5 h-5" />
            </div>

            <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between pr-20">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-muted-foreground/40">#{index + 1}</span>
                            <Badge variant="outline" className="capitalize bg-muted/50 text-[10px] font-bold border-border text-subtitle py-0 px-2 h-5">
                                {typeLabel}
                            </Badge>
                        </div>

                        <div className="text-sm font-bold text-title leading-snug pr-4"  dangerouslySetInnerHTML={{ __html: question.question || question.question_text || "Untitled Question" }} />
                        {/* <h3 className="text-sm font-bold text-title leading-snug pr-4">
                            {question.question || question.question_text || "Untitled Question"}
                        </h3> */}
                    </div>
                </div>

                {/* Answer Preview Area */}
                <div className="rounded-lg bg-muted/30 p-3 border border-border/50">
                    <div className="text-[11px] font-bold text-description uppercase tracking-widest mb-1">Answer Preview</div>
                    <div className="text-xs text-body leading-relaxed font-medium">
                        {renderAnswers(question)}
                    </div>
                </div>
            </div>

            {/* Absolute Positioned Score & Actions */}
            <div className="absolute top-4 right-4 flex items-center gap-4">
                {/* Actions Menu */}
                <div className="flex items-center bg-muted rounded-lg p-0.5 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 border border-border/50 shadow-sm">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-subtitle hover:text-primary hover:bg-card rounded-md transition-colors"
                        onClick={(e) => { e.stopPropagation(); onEdit(index); }}
                    >
                        <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground/60 hover:text-destructive hover:bg-card rounded-md transition-colors"
                        onClick={(e) => { e.stopPropagation(); onDelete(index); }}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>

                {/* Point Badge */}
                <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full border border-primary/20">
                    <Star className="w-3 h-3 fill-primary" />
                    <span className="text-[11px] font-black">{question?.point || 0} PTS</span>
                </div>
            </div>
        </div>
    );
}