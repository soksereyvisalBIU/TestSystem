import {
    closestCenter,
    DndContext,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { useState } from 'react';

import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { CSS } from '@dnd-kit/utilities';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { GripVertical } from 'lucide-react';
interface Question {
    id: number;
    text: string;
    type: 'true_false' | 'multiple_choice' | 'matching' | 'qa';
    answers: any;
}

export default function QuestionManager() {
    const [questions, setQuestions] = useState<Question[]>([
        {
            id: 1,
            text: 'Which planet is known as the Red Planet?',
            type: 'multiple_choice',
            answers: {
                options: ['Earth', 'Mars', 'Venus'],
                correct: 'Mars',
            },
        },
        {
            id: 2,
            text: 'The sky is blue. (True or False)',
            type: 'true_false',
            answers: { correct: 'True' },
        },
        {
            id: 3,
            text: 'Match country → capital',
            type: 'matching',
            answers: {
                pairs: [
                    { left: 'Japan', right: 'Tokyo' },
                    { left: 'France', right: 'Paris' },
                ],
            },
        },
    ]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 },
        }),
    );

    function handleDragEnd(event: any) {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = questions.findIndex((q) => q.id === active.id);
            const newIndex = questions.findIndex((q) => q.id === over.id);

            setQuestions((prev) => arrayMove(prev, oldIndex, newIndex));
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Assessments" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold">Manage Questions</h1>
                        <Button>Add Question</Button>
                    </div>

                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                        modifiers={[restrictToVerticalAxis]}
                    >
                        <SortableContext
                            items={questions.map((q) => q.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            {questions.map((question) => (
                                <SortableQuestionCard
                                    key={question.id}
                                    question={question}
                                />
                            ))}
                        </SortableContext>
                    </DndContext>
                </div>
            </div>
        </AppLayout>
    );
}
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Class', href: '/' },
    { title: 'Subjects', href: '/subjects' },
    { title: 'Assessments', href: '/assessments' },
];

function SortableQuestionCard({ question }: { question: Question }) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: question.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <Card
            ref={setNodeRef}
            style={style}
            className="relative cursor-grab rounded-2xl border shadow-sm transition hover:shadow-md"
        >
            <CardContent className="">
                {/* Drag Handle */}
                <button
                    {...attributes}
                    {...listeners}
                    className="absolute inset-0 top-3 left-1 text-gray-400 hover:text-gray-600"
                >
                    <GripVertical size={20} />
                </button>

                {/* Question Text */}
                <div className="pl-2">
                    <h2 className="text-lg font-medium">{question.text}</h2>
                    {/* <Badge className="mt-2 capitalize">
                        {question.type.replace('_', ' ')}
                    </Badge> */}
                </div>

                {/* Answers Preview */}
                <div className="rounded-xl pl-2">
                    {question.type === 'multiple_choice' && (
                        <div>
                            {/* <p className="mb-2 font-semibold">Options:</p> */}
                            <ul className="ml-6 list-disc space-y-1 text-sm">
                                {question.answers.options.map(
                                    (opt: string, idx: number) => (
                                        <li
                                            key={idx}
                                            className={
                                                opt === question.answers.correct
                                                    ? 'font-bold text-green-600'
                                                    : ''
                                            }
                                        >
                                            {opt}
                                        </li>
                                    ),
                                )}
                            </ul>
                        </div>
                    )}

                    {question.type === 'true_false' && (
                        <p className="text-sm">
                            Correct Answer:{' '}
                            <span className="font-bold text-blue-600">
                                {question.answers.correct}
                            </span>
                        </p>
                    )}

                    {question.type === 'matching' && (
                        <div>
                            {/* <p className="mb-2 font-semibold">Pairs:</p> */}
                            <ul className="space-y-1 text-sm">
                                {question.answers.pairs.map(
                                    (p: any, idx: number) => (
                                        <li key={idx}>
                                            <b>{p.left}</b> →{' '}
                                            <span className="text-blue-600">
                                                {p.right}
                                            </span>
                                        </li>
                                    ),
                                )}
                            </ul>
                        </div>
                    )}

                    {question.type === 'qa' && (
                        <p className="text-sm">
                            Answer:{' '}
                            <span className="italic">
                                {question.answers.text}
                            </span>
                        </p>
                    )}
                </div>

                {/* Actions */}
                {/* <div className="flex justify-end space-x-3">
                    <Button variant="outline" size="sm">
                        <Pencil size={16} className="mr-1" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm">
                        <Trash2 size={16} className="mr-1" /> Delete
                    </Button>
                </div> */}
            </CardContent>
        </Card>
    );
}
