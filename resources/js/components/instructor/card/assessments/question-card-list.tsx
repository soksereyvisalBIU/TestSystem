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
import { CheckCircle2, ChevronRight, ListOrdered } from 'lucide-react';
import { route } from 'ziggy-js';

export default function QuestionCardList({ assessment, classId, subjectId }: any) {
    return (
        <Card className="border-none bg-card shadow-sm transition-colors rounded-[2rem] overflow-hidden">
            <CardHeader className="pb-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-primary">
                            <ListOrdered className="h-5 w-5" />
                            <CardTitle className="text-xl font-black uppercase tracking-tight">
                                Assessment Content
                            </CardTitle>
                        </div>
                        <CardDescription className="font-medium text-description">
                            There are {assessment.questions?.length} questions in this assessment.
                        </CardDescription>
                    </div>
                    <Link
                        href={route(
                            'instructor.classes.subjects.assessments.questions.index',
                            {
                                class: classId,
                                subject: subjectId,
                                assessment: assessment.id,
                            },
                        )}
                    >
                        <Button
                            size="sm"
                            className="group h-10 rounded-xl bg-primary px-4 font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:opacity-90 active:scale-95"
                        >
                            Question Detail
                            <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </Link>
                </div>
            </CardHeader>

            <CardContent>
                <Accordion
                    type="single"
                    collapsible
                    className="w-full space-y-3"
                >
                    {assessment.questions?.map((q: any, index: number) => (
                        <AccordionItem
                            key={q.id}
                            value={`item-${q.id}`}
                            className="overflow-hidden rounded-2xl border border-border px-4 transition-all data-[state=open]:border-primary/30 data-[state=open]:bg-primary/5"
                        >
                            <AccordionTrigger className="py-5 hover:no-underline">
                                <div className="flex flex-1 items-center gap-4 text-left">
                                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-black text-primary transition-colors">
                                        {index + 1}
                                    </span>
                                    <span className="line-clamp-1 flex-1 font-bold text-title">
                                        {q.question_text}
                                    </span>
                                    <Badge variant="secondary" className="mr-2 rounded-md bg-muted font-bold text-muted-foreground border-none">
                                        {q.point} PTS
                                    </Badge>
                                </div>
                            </AccordionTrigger>
                            
                            <AccordionContent className="pb-5 pl-11 pr-2">
                                <div className="rounded-xl border border-border bg-card p-5 shadow-inner">
                                    {q.type === 'multiple_choice' && (
                                        <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                            {q.options?.map((opt: any, i: number) => (
                                                <li
                                                    key={i}
                                                    className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${
                                                        opt.correct 
                                                        ? 'border-success/30 bg-success/5 text-success' 
                                                        : 'border-border bg-muted/30 text-description'
                                                    }`}
                                                >
                                                    <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                                                        opt.correct ? 'border-success bg-success text-white' : 'border-description/30'
                                                    }`}>
                                                        {opt.correct && <CheckCircle2 className="h-3 w-3" />}
                                                    </div>
                                                    <span className="text-sm font-bold">
                                                        <span className="mr-1 opacity-60">{opt.label}.</span> {opt.text}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    {q.type === 'true_false' && (
                                        <div className="flex gap-3">
                                            <Badge className={`h-10 px-6 rounded-lg font-black tracking-widest ${q.answer ? 'bg-success text-white' : 'bg-muted text-description'}`}>
                                                TRUE
                                            </Badge>
                                            <Badge className={`h-10 px-6 rounded-lg font-black tracking-widest ${!q.answer ? 'bg-success text-white' : 'bg-muted text-description'}`}>
                                                FALSE
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