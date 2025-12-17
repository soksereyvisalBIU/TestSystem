import { Button } from '@/components/ui/button';
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useEffect, useMemo, useState } from 'react';
import SortableItem from '../SortableItem';
import { GripHorizontal, GripVertical, Save, LayoutList, Hash } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function OrderQuestionByTypeSetting({
    questions,
    onSave,
}: {
    questions: any[];
    onSave: (newOrder: any[]) => void;
}) {
    const grouped = useMemo(() => {
        const map = new Map<string, any[]>();
        questions.forEach((q) => {
            if (!map.has(q.type)) map.set(q.type, []);
            map.get(q.type)!.push(q);
        });
        return Array.from(map.entries()).map(([type, list]) => ({
            type,
            questions: [...list].sort((a, b) => a.order - b.order),
        }));
    }, [questions]);

    const [orderedGroups, setOrderedGroups] = useState(grouped);

    useEffect(() => {
        setOrderedGroups(grouped);
    }, [grouped]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 5 },
        }),
    );

    const handleGroupDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const activeType = active.id.toString().split(':')[1];
        const overType = over.id.toString().split(':')[1];

        const oldIndex = orderedGroups.findIndex((g) => g.type === activeType);
        const newIndex = orderedGroups.findIndex((g) => g.type === overType);
        if (oldIndex === -1 || newIndex === -1) return;

        setOrderedGroups((prev) => arrayMove(prev, oldIndex, newIndex));
    };

    const handleQuestionDragEnd = (groupType: string, event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const activeId = active.id.toString().split(':')[1];
        const overId = over.id.toString().split(':')[1];

        setOrderedGroups((prev) =>
            prev.map((group) => {
                if (group.type !== groupType) return group;
                const oldIndex = group.questions.findIndex((q) => q.id.toString() === activeId);
                const newIndex = group.questions.findIndex((q) => q.id.toString() === overId);
                if (oldIndex === -1 || newIndex === -1) return group;
                return {
                    ...group,
                    questions: arrayMove(group.questions, oldIndex, newIndex),
                };
            }),
        );
    };

    const handleSaveOrder = () => {
        const reordered = orderedGroups.flatMap((g) => g.questions);
        const updatedQuestions = reordered.map((q, i) => ({
            ...q,
            order: i + 1,
            updated: true,
        }));
        onSave(updatedQuestions);
    };

    return (
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            {/* Header Section */}
            <div className="bg-slate-50/80 px-5 py-4 flex items-center justify-between border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-primary/10 rounded-lg">
                        <LayoutList className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-800">Quiz Structure</h3>
                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Grouped by Type</p>
                    </div>
                </div>
                <Button 
                    variant="default" 
                    size="sm" 
                    onClick={handleSaveOrder}
                    className="h-8 gap-2 bg-primary hover:bg-primary/90 shadow-sm transition-all active:scale-95"
                >
                    <Save className="w-3.5 h-3.5" />
                    Save Order
                </Button>
            </div>

            <div className="p-4 overflow-y-auto max-h-[60vh] custom-scrollbar">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleGroupDragEnd}
                >
                    <SortableContext
                        items={orderedGroups.map((g) => `group:${g.type}`)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-4">
                            {orderedGroups.map((group) => (
                                <SortableItem
                                    key={`group:${group.type}`}
                                    id={`group:${group.type}`}
                                >
                                    <div className="group/parent relative rounded-xl border border-slate-200 bg-white p-1 transition-all hover:border-primary/30 hover:shadow-md">
                                        {/* Group Label / Drag Handle */}
                                        <div className="flex items-center justify-between px-3 py-2 bg-slate-50/50 rounded-t-lg border-b border-slate-50 cursor-grab active:cursor-grabbing">
                                            <div className="flex items-center gap-2">
                                                <GripHorizontal className="w-4 h-4 text-slate-300 group-hover/parent:text-primary transition-colors" />
                                                <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                                                    {group.type.replaceAll('_', ' ')}
                                                </span>
                                            </div>
                                            <span className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded-full font-bold text-slate-400">
                                                {group.questions.length} Items
                                            </span>
                                        </div>

                                        <div className="p-2">
                                            <DndContext
                                                sensors={sensors}
                                                collisionDetection={closestCenter}
                                                onDragEnd={(e) => handleQuestionDragEnd(group.type, e)}
                                            >
                                                <SortableContext
                                                    items={group.questions.map((q) => `${group.type}:${q.id}`)}
                                                    strategy={verticalListSortingStrategy}
                                                >
                                                    <div className="space-y-1">
                                                        {group.questions.map((q, index) => (
                                                            <SortableItem
                                                                key={`${group.type}:${q.id}`}
                                                                id={`${group.type}:${q.id}`}
                                                            >
                                                                <div className="group/item flex items-center gap-3 rounded-lg border border-transparent hover:border-slate-100 hover:bg-slate-50/50 px-3 py-2 cursor-grab active:cursor-grabbing transition-all">
                                                                    <GripVertical className="w-3.5 h-3.5 text-slate-200 group-hover/item:text-slate-400" />
                                                                    <div className="flex items-center gap-2 overflow-hidden">
                                                                        <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-md bg-white border border-slate-100 text-[10px] font-black text-slate-400">
                                                                            {index + 1}
                                                                        </span>
                                                                        <span className="text-xs text-slate-600 font-medium truncate">
                                                                            {q.question_text || q.question}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </SortableItem>
                                                        ))}
                                                    </div>
                                                </SortableContext>
                                            </DndContext>
                                        </div>
                                    </div>
                                </SortableItem>
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100">
                <p className="text-[10px] text-center text-slate-400 font-medium">
                    Drag blocks to reorder types, or items to reorder questions.
                </p>
            </div>
        </div>
    );
}