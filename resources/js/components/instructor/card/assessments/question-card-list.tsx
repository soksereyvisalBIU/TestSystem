import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { CheckCircle2, ChevronRight } from 'lucide-react';
import { route } from 'ziggy-js';

export default function QuestionCardList({ assessment, classId, subjectId }: any) {
    return (
        <Card className="border-none shadow-sm">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Assessment Content</CardTitle>
                    <Link
                        href={route(
                            'instructor.classes.subjects.assessments.questions.index',
                            {
                                class: classId,
                                subject: subjectId,
                                assessment: assessment.id,
                            },
                        )}
                        className=""
                    >
                        <Button
                            size="sm"
                            className="cursor-pointer shadow-lg transition-shadow hover:shadow-xl"
                        >
                            Question Detail
                            <ChevronRight />
                        </Button>
                    </Link>
                </div>
                <CardDescription>
                    There are {assessment.questions?.length} questions in this assessment.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion
                    type="single"
                    collapsible
                    className="w-full space-y-2"
                >
                    {assessment.questions?.map((q: any, index: number) => (
                        <AccordionItem
                            key={q.id}
                            value={`item-${q.id}`}
                            className="rounded-lg border border-slate-200 px-4 data-[state=open]:bg-slate-50"
                        >
                            <AccordionTrigger className="py-4 hover:no-underline">
                                <div className="flex flex-1 items-center gap-4 text-left">
                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                                        {index + 1}
                                    </span>
                                    <span className="line-clamp-1 flex-1 font-medium text-slate-900">
                                        {q.question_text}
                                    </span>
                                    <Badge variant="secondary" className="mr-2">
                                        {q.point} pts
                                    </Badge>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-1 pb-4 pl-10">
                                {/* Logic to display question types nicely */}
                                <div className="rounded-md border border-slate-100 bg-white p-4 text-sm text-slate-700 shadow-sm">
                                    {q.type === 'multiple_choice' && (
                                        <ul className="space-y-2">
                                            {q.options?.map(
                                                (opt: any, i: number) => (
                                                    <li
                                                        key={i}
                                                        className={`flex items-center gap-2 ${opt.correct ? 'font-medium text-green-700' : ''}`}
                                                    >
                                                        <div
                                                            className={`h-4 w-4 rounded-full border ${opt.correct ? 'border-green-600 bg-green-100' : 'border-slate-300'}`}
                                                        />
                                                        {opt.label}. {opt.text}
                                                        {opt.correct && (
                                                            <CheckCircle2 className="h-3 w-3" />
                                                        )}
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                    )}
                                    {/* Add other types as needed */}
                                    {q.type === 'true_false' && (
                                        <div className="flex gap-4">
                                            <Badge
                                                variant={
                                                    q.answer
                                                        ? 'success'
                                                        : 'outline'
                                                }
                                            >
                                                True
                                            </Badge>
                                            <Badge
                                                variant={
                                                    !q.answer
                                                        ? 'success'
                                                        : 'outline'
                                                }
                                            >
                                                False
                                            </Badge>
                                        </div>
                                    )}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
    );
}
