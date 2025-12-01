import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { route } from 'ziggy-js';
import type { BreadcrumbItem } from '@/types';
import QuestionRenderer from '@/components/student/attempt/QuestionRenderer';


const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: dashboard().url }];

interface AttemptProps {
    studentCourse: any;
    assessment: any;
    studentAssessment: any;
}

export default function Attempt({ studentCourse, assessment }: AttemptProps) {
    const { data, setData, post, processing, errors } = useForm<{ answers: Record<number, any> }>({
        answers: {},
    });

    const handleChange = (qId: number, value: any, isMultiple = false) => {
        if (isMultiple) {
            const prev = data.answers[qId] || [];
            const updated = prev.includes(value) ? prev.filter((v: any) => v !== value) : [...prev, value];
            setData('answers', { ...data.answers, [qId]: updated });
        } else {
            setData('answers', { ...data.answers, [qId]: value });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('student.attempt.store', { assessment: assessment.id, course: studentCourse.course_id }), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Attempt: ${assessment.title}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="relative flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border">
                    <div className="mb-6">
                        <h1 className="text-2xl font-semibold">{assessment.title}</h1>
                        {assessment.description && <p className="text-muted-foreground">{assessment.description}</p>}
                        <div className="mt-2 text-sm text-muted-foreground">
                            <p>Duration: {assessment.duration} mins</p>
                            <p>
                                Attempts Allowed: {assessment.max_attempts} | Start: {assessment.start_at} | End:{' '}
                                {assessment.end_at}
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {assessment.questions.map((q: any, index: number) => (
                            <QuestionRenderer
                                key={q.id}
                                question={q}
                                index={index}
                                value={data.answers[q.id]}
                                onChange={handleChange}
                                answers={data.answers}
                                setData={setData}
                            />
                        ))}

                        {errors.answers && <div className="text-sm text-red-500">{errors.answers}</div>}
                        <div className="pt-4">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Submitting...' : 'Submit Attempt'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
