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

export default function OrderQuestionByTypeSetting({
    questions,
    onSave,
}: {
    questions: any[];
    onSave: (newOrder: any[]) => void;
}) {
    // ===========================
    // 🧩 Group questions by type
    // ===========================
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

    // ==============================
    // ⚙️ Sensors setup (NEW)
    // ==============================
    // 🟢 UPDATED / IMPORTANT:
    // Using PointerSensor with activationConstraint makes drag smoother and avoids accidental drags.
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 5 }, // drag only starts after moving 5px
        }),
    );

    // ==============================
    // 🔹 Handle group-level drag end
    // ==============================
    // 🟢 UPDATED / IMPORTANT:
    // This only manages top-level group reordering (no interference with inner drags)
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

    // ==============================
    // 🔹 Handle question-level drag end
    // ==============================
    // 🟢 UPDATED / IMPORTANT:
    // Each group has its own inner DnD context, so this handler is called per-group.
    // Prevents parent group flickering when moving inner items.
    const handleQuestionDragEnd = (groupType: string, event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const activeId = active.id.toString().split(':')[1];
        const overId = over.id.toString().split(':')[1];

        setOrderedGroups((prev) =>
            prev.map((group) => {
                if (group.type !== groupType) return group;

                const oldIndex = group.questions.findIndex(
                    (q) => q.id.toString() === activeId,
                );
                const newIndex = group.questions.findIndex(
                    (q) => q.id.toString() === overId,
                );

                if (oldIndex === -1 || newIndex === -1) return group;

                return {
                    ...group,
                    questions: arrayMove(group.questions, oldIndex, newIndex),
                };
            }),
        );
    };

    // ✅ Save Order (flatten + update order numbers)
    const handleSaveOrder = () => {
        const reordered = orderedGroups.flatMap((g) => g.questions);
        const updatedQuestions = reordered.map((q, i) => ({
            ...q,
            order: i + 1,
            updated: true,
        }));
        onSave(updatedQuestions);
        console.log('Updated nested order:', updatedQuestions);
    };

    return (
        <div className="min-w-[20rem] rounded-xl border border-sidebar-border/70 bg-card p-4 shadow-sm dark:border-sidebar-border">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Order Questions</h3>
                <Button variant="default" size="sm" onClick={handleSaveOrder}>
                    Save Order
                </Button>
            </div>

            <hr className="mb-4 border-sidebar-border/50" />

            {/* ================== */}
            {/* 🌐 Group DnD Context */}
            {/* ================== */}
            {/* 🟢 UPDATED / IMPORTANT:
                - Outer DndContext manages only group-level drags.
                - Each group is a SortableItem.
                - Inner contexts (questions) have their own DndContext to prevent conflicts.
            */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleGroupDragEnd}
            >
                <SortableContext
                    items={orderedGroups.map((g) => `group:${g.type}`)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-3">
                        {orderedGroups.map((group) => (
                            <SortableItem
                                key={`group:${group.type}`}
                                id={`group:${group.type}`}
                            >
                                <div className="cursor-move rounded-md border border-muted/30 bg-muted/10 p-3 hover:bg-muted/20">
                                    <div className="mb-2 text-sm font-medium">
                                        {group.type
                                            .replaceAll('_', ' ')
                                            .toUpperCase()}
                                    </div>

                                    {/* 🧩 Nested question DnD Context */}
                                    {/* 🟢 UPDATED / IMPORTANT:
                                        Each group has its own DndContext and SortableContext.
                                        This completely isolates child dragging from parent dragging.
                                    */}
                                    <DndContext
                                        sensors={sensors}
                                        collisionDetection={closestCenter}
                                        onDragEnd={(e) =>
                                            handleQuestionDragEnd(group.type, e)
                                        }
                                    >
                                        <SortableContext
                                            items={group.questions.map(
                                                (q) => `${group.type}:${q.id}`,
                                            )}
                                            strategy={
                                                verticalListSortingStrategy
                                            }
                                        >
                                            <ul className="space-y-1 pl-2 text-xs text-muted-foreground">
                                                {group.questions.map(
                                                    (q, index) => (
                                                        <SortableItem
                                                            key={`${group.type}:${q.id}`}
                                                            id={`${group.type}:${q.id}`}
                                                        >
                                                            <li className="rounded border border-border/40 bg-muted/20 px-2 py-1 text-[13px] hover:bg-muted/30">
                                                                {q.order+'. ' ||
                                                                    index +
                                                                        1 +
                                                                        '. '}
                                                                {q.question_text?.slice(
                                                                    0,
                                                                    60,
                                                                ) ||
                                                                    q.question}
                                                                {q.question
                                                                    ?.length >
                                                                    60 && '...'}
                                                            </li>
                                                        </SortableItem>
                                                    ),
                                                )}
                                            </ul>
                                        </SortableContext>
                                    </DndContext>
                                </div>
                            </SortableItem>
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
}
