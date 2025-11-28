import QuestionsManager from './question-manager/QuestionManager';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Assessment({
    assessment_id,
}: {
    assessment_id: number;
}) {
    // console.log(assessment_id);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex-1">
                    <QuestionsManager assessmentId={assessment_id} />
                </div>
            </div>
        </AppLayout>
    );
}
