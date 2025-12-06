import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import QuestionsManager from './question-manager/QuestionManager';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Assessment({
    class_id,
    subject_id,
    assessment_id,
}: {
    class_id: number;
    subject_id: number;
    assessment_id: number;
}) {
    
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <QuestionsManager assessmentId={assessment_id} />
            </div>
        </AppLayout>
    );
}
