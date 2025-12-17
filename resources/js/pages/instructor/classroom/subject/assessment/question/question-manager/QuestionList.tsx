import { DndContext, closestCenter } from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Badge } from '@/components/ui/badge';
import { FileQuestion, Calculator, Layers } from 'lucide-react';
import SortableItem from './SortableItem';
import QuestionCard from './QuestionCard';

interface QuestionListProps {
    questions: any[];
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
            <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-slate-100 p-12 text-center">
                <div className="bg-slate-50 p-4 rounded-full">
                    <FileQuestion className="w-8 h-8 text-slate-300" />
                </div>
                <div className="space-y-1">
                    <p className="text-slate-500 font-medium">No questions added yet</p>
                    <p className="text-xs text-slate-400">Click the button above to start building your quiz.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Summary Dashboard */}
            <div className="flex items-center gap-4 p-1">
                <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-xl shadow-sm">
                    <Layers className="w-4 h-4 text-violet-500" />
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">{totalQuestions} Questions</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-xl shadow-sm">
                    <Calculator className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">{totalScore} Total Points</span>
                </div>
            </div>

            {/* Draggable question list */}
            <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
                <SortableContext
                    items={questions.map((q) => q.id || q.tempId!)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="flex flex-col gap-3">
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