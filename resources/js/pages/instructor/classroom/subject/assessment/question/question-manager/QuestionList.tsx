import { DndContext, closestCenter } from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Badge } from '@/components/ui/badge';
import SortableItem from './SortableItem';
import QuestionCard from './QuestionCard';


interface QuestionListProps {
    questions: Question[];
    onEdit: (index: number) => void;
    onDelete: (index: number) => void;
    onDragEnd: (event: any) => void;
}

export default function QuestionList({
    questions,
    onEdit,
    onDelete,
    onDragEnd,
}: QuestionListProps) {
    const totalQuestions = questions.length;
    const totalScore = questions.reduce(
        (sum, q) => sum + (Number(q.point) || 0),
        0,
    );

    if (!questions.length) {
        return (
            <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed p-6 text-center text-muted-foreground">
                <p className="text-sm">No questions added yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Summary badges */}
            <div className="grid grid-cols-2 gap-2 rounded-2xl border p-4">
                <Badge variant="secondary" className="flex justify-between mx-auto">
                    <span>Questions:</span>
                    <span className="font-semibold">{totalQuestions}</span>
                </Badge>
                <Badge variant="secondary" className="flex justify-between mx-auto">
                    <span>Total Score:</span>
                    <span className="font-semibold">{totalScore}</span>
                </Badge>
            </div>

            {/* Draggable question list */}
            <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
                <SortableContext
                    items={questions.map((q) => q.id || q.tempId!)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="grid gap-2">
                        {questions.map((question, index) => (
                            <SortableItem key={question.id || question.tempId} id={question.id || question.tempId!}>
                                <QuestionCard
                                    question={question}
                                    index={index}
                                    onEdit={() => onEdit(index)}
                                    onDelete={() => onDelete(index)}
                                />
                            </SortableItem>
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
}
