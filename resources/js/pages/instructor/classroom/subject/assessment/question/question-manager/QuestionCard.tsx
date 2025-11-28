import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit2Icon, Trash2Icon } from 'lucide-react';
import { renderAnswers } from './function/renderAnswer';

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
    return (
        <div
            onDoubleClick={onEdit}
            className="group relative rounded-md border p-3  transition-shadow hover:shadow-sm"
        >
            <div className="absolute end-2 top-2 flex space-x-1 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                    
                    className="z-20"
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(index)}
                >
                    <Edit2Icon className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(index)}
                >
                    <Trash2Icon className="h-4 w-4" />
                </Button>
            </div>

            <h3 className="text-sm font-medium">
                {question.order ?? index + 1}{". "}{question.question || question.question_text}{' '}
                <Badge variant="secondary" className='opacity-50'>{question?.type}</Badge>
            </h3>

            <div className="text-xs opacity-90">{renderAnswers(question)}</div>
            <div className="absolute end-2 bottom-2">
               <Badge variant={'secondary'}>{question?.point} pts</Badge>
            </div>
        </div>
    );
}
