import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { route } from 'ziggy-js';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/' }];

type DashboardProps = {
    assessment: any;
    class_id: number;
    subject_id: number;
};

export default function Dashboard({
    assessment,
    class_id,
    subject_id,
}: DashboardProps) {
    if (!assessment) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Assessment" />
                <div className="flex flex-1 items-center justify-center">
                    <p className="text-center text-red-600">
                        Assessment not found.
                    </p>
                </div>
            </AppLayout>
        );
    }

    console.log(assessment);
    // {
    //     "id": 1,
    //     "title": "Week I Quizz",
    //     "description": "Good luck everyone",
    //     "type": "final",
    //     "start_time": "2025-11-30 06:34:00",
    //     "end_time": "2025-12-01 04:19:00",
    //     "duration": null,
    //     "max_attempts": 3,
    //     "created_by": null,
    //     "created_at": "2025-12-01T02:46:17.000000Z",
    //     "updated_at": "2025-12-01T02:46:17.000000Z"
    // }

    // ===============================
    // Server Time Fetch
    // ===============================
    const [serverNow, setServerNow] = useState<dayjs.Dayjs | null>(null);

    useEffect(() => {
        fetch('/api/server-time')
            .then((res) => res.json())
            .then((data) => {
                setServerNow(dayjs.utc(data.now).tz('Asia/Phnom_Penh'));
            });
    }, []);

    if (!serverNow) return;

    console.log('Server Time:', serverNow.format());

    // ===============================
    // Time Calculations
    // ===============================
    const start = dayjs.utc(assessment.start_time).tz('Asia/Phnom_Penh');
    const end = dayjs.utc(assessment.end_time).tz('Asia/Phnom_Penh');

    const now = serverNow;
    const isWithinTime = now.isAfter(start) && now.isBefore(end);
    const isBeforeStart = now.isBefore(start);
    const isAfterEnd = now.isAfter(end);

    // ===============================
    // Attempt Logic
    // ===============================
    const maxAttempts = assessment.max_attempts ?? 3;
    // const hasRemainingAttempts = maxAttempts === 0 || attempts < maxAttempts;

    // const canAttemptNow = isWithinTime && hasRemainingAttempts;

    // const attempt = useAssessmentScore(studentAssessment);

    // ===============================
    // Type Mapping
    // ===============================
    const typeMap: Record<string, string> = {
        quiz: 'Quiz',
        exam: 'Exam',
        homework: 'Homework',
        midterm: 'Midterm',
        final: 'Final',
    };

    const assessmentType = typeMap[assessment.type] || 'Assessment';

    // ===============================
    // UI
    // ===============================
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={assessment.title || 'Assessment'} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="relative flex flex-1 items-center justify-center rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <div className="w-full max-w-xl p-4 text-center">
                        <h1 className="text-3xl font-bold">
                            {assessment.title}
                        </h1>
                        <p className="text-muted-foreground">
                            {assessment.description}
                        </p>

                        {/* Score */}
                        {/* {attempt?.score && (
                            <div className="my-6">
                                <h1 className="text-4xl font-black">
                                    {attempt.score}{" "}
                                    <span className="font-normal italic">pts</span>
                                </h1>
                            </div>
                        )} */}

                        {/* Meta Info */}
                        <div className="space-y-1 text-sm">
                            <p>
                                <span className="font-semibold">Type:</span>{' '}
                                {assessmentType}
                            </p>

                            <p>
                                <span className="font-semibold">
                                    Time Window:
                                </span>{' '}
                                {start.format('YYYY-MM-DD HH:mm')} →{' '}
                                {end.format('YYYY-MM-DD HH:mm')}
                            </p>

                            {isWithinTime && (
                                <p className="text-green-600">
                                    Ends in: <strong>{end.from(now)}</strong>
                                </p>
                            )}

                            <p>
                                <span className="font-semibold">Duration:</span>{' '}
                                {assessment.duration ?? 'N/A'} minutes
                            </p>

                            {/* <p>
                                <span className="font-semibold">Attempts:</span>{" "}
                                {maxAttempts === 0
                                    ? `${attempts} (Unlimited)`
                                    : `${attempts} / ${maxAttempts}`}
                            </p> */}
                        </div>

                        {/* Instructions */}
                        {assessment.instructions && (
                            <div className="my-4 rounded bg-gray-100 p-3 text-left dark:bg-gray-800">
                                <p className="font-semibold">Instructions:</p>
                                <div className="text-sm whitespace-pre-line">
                                    {assessment.instructions}
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="space-x-2">
                            <div className="mt-4 space-y-2 text-sm text-red-600">
                                {isBeforeStart && (
                                    <p>
                                        Starts at{' '}
                                        <strong>
                                            {start.format('YYYY-MM-DD HH:mm')}
                                        </strong>
                                    </p>
                                )}
                                {isAfterEnd && <p>Assessment has ended.</p>}

                                <div>
                                    <p>
                                        You have exceeded the{' '}
                                        <strong>{maxAttempts}</strong> attempts.
                                    </p>

                                    <Button variant="default" disabled>
                                        Attempt Limited
                                    </Button>

                                    <Link
                                        href={route(
                                            'student.classes.subjects.assessments.request',
                                            {
                                                class_id: class_id,
                                                subject_id: subject_id,
                                                assessment_id: assessment.id,
                                            },
                                        )}
                                        method="post"
                                        as={Button}
                                        variant="default"
                                        className="mt-4"
                                    >
                                        Start Assessment
                                    </Link>
                                </div>
                            </div>

                            {/* {canAttemptNow ? (
                                <Link
                                    href={route("student.attempt.start", {
                                        assessment: assessment.id,
                                        course: assessment.course_id,
                                    })}
                                    method="post"
                                    as={Button}
                                    variant="default"
                                    className="mt-4"
                                >
                                    Start Assessment
                                </Link>
                            ) : (
                                <div className="mt-4 space-y-2 text-sm text-red-600">
                                    {isBeforeStart && (
                                        <p>
                                            Starts at{" "}
                                            <strong>{start.format("YYYY-MM-DD HH:mm")}</strong>
                                        </p>
                                    )}
                                    {isAfterEnd && <p>Assessment has ended.</p>}

                                    {maxAttempts !== 0 && attempts >= maxAttempts && (
                                        <div>
                                            <p>
                                                You have exceeded the{" "}
                                                <strong>{maxAttempts}</strong> attempts.
                                            </p>

                                            <Button variant="default" disabled>
                                                Attempt Limited
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )} */}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
