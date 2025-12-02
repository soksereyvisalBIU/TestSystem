import { Button } from '@/components/ui/button';
import LogoLoader from '@/components/ui/LogoLoader';
import { useShowAssessment } from '@/hooks/course/assessment/useAssessments';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
// import Swal from 'sweetalert2';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
// import { useAttemptAssessment } from '@/hooks/student/course/assessment/useAttemptAssessment';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    const { props } = usePage();
    const courseId = props?.course_id;
    const assessmentId = props?.assessment_id;

    // console.log(props)

    // const startAttempt = useAttemptAssessment( courseId, assessmentId )

    const {
        data: assessment,
        isLoading,
        isError,
    } = useShowAssessment(courseId, assessmentId);

    const [timeLeft, setTimeLeft] = useState<string | null>(null);
    const [status, setStatus] = useState<
        'upcoming' | 'active' | 'ended' | null
    >(null);

    useEffect(() => {
        if (!assessment?.start_time || !assessment?.end_time) return;

        const start = new Date(assessment.start_time).getTime();
        const end = new Date(assessment.end_time).getTime();

        const interval = setInterval(() => {
            const now = Date.now();

            if (now < start) {
                setStatus('upcoming');
                const diff = start - now;
                setTimeLeft(formatDuration(diff));
            } else if (now >= start && now <= end) {
                setStatus('active');
                const diff = end - now;
                setTimeLeft(formatDuration(diff));
            } else {
                setStatus('ended');
                setTimeLeft(null);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [assessment]);

    // Helper: format ms into hh:mm:ss
    const formatDuration = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return [
            hours.toString().padStart(2, '0'),
            minutes.toString().padStart(2, '0'),
            seconds.toString().padStart(2, '0'),
        ].join(':');
    };

    // Basic guards
    if (isLoading) return <LogoLoader />;
    if (isError)
        return (
            <div className="p-4 text-center text-red-500">
                Error loading assessment.
            </div>
        );
    if (!assessment)
        return (
            <div className="p-4 text-center text-muted-foreground">
                No assessment found.
            </div>
        );

    const formatDate = (dateString?: string) => {
        if (!dateString) return '—';
        return format(new Date(dateString), 'PPpp');
    };

    const canStart = status === 'active';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={assessment?.title || 'Dashboard'} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="relative flex min-h-[80vh] flex-1 flex-col items-center justify-center overflow-hidden rounded-xl border border-sidebar-border/70 p-6 text-center dark:border-sidebar-border">
                    <div className="w-full max-w-2xl">
                        {/* Assessment Header */}
                        <div className="mb-6">
                            <h1 className="text-4xl font-bold text-foreground">
                                {assessment.title}
                            </h1>
                            {assessment.description && (
                                <p className="mt-2 text-muted-foreground">
                                    {assessment.description}
                                </p>
                            )}
                        </div>

                        {/* Countdown Display */}
                        {status === 'upcoming' && (
                            <div className="my-4 text-lg font-semibold text-blue-600 dark:text-blue-400">
                                Starts in: {timeLeft}
                            </div>
                        )}
                        {status === 'active' && (
                            <div className="my-4 text-lg font-semibold text-green-600 dark:text-green-400">
                                Time remaining: {timeLeft}
                            </div>
                        )}
                        {status === 'ended' && (
                            <div className="my-4 text-lg font-semibold text-red-500">
                                Assessment ended
                            </div>
                        )}

                        {/* Assessment Details */}
                        <div className="mt-6 grid grid-cols-1 gap-1 text-center text-sm">
                            <div className="flex justify-center">
                                <div className="border-e-2 border-white px-2">
                                    <span>Type:</span>{' '}
                                    <span className="font-semibold">
                                        {assessment.type || '—'}
                                    </span>
                                </div>
                                <div className="border-e-2 border-white px-2">
                                    <span>Duration:</span>{' '}
                                    <span className="font-semibold">
                                        {assessment.duration
                                            ? `${assessment.duration} mins`
                                            : '—'}
                                    </span>
                                </div>
                                <div className="border-white px-2">
                                    <span>Max Attempts:</span>{' '}
                                    <span className="font-semibold">
                                        {assessment.max_attempts || '—'}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col justify-center">
                                <div className="flex justify-center">
                                    <span className="w-28 font-semibold">
                                        Start Time :
                                    </span>{' '}
                                    {formatDate(assessment.start_time)}
                                </div>
                                <div className="flex justify-center">
                                    <span className="w-28 font-semibold">
                                        End Time :
                                    </span>{' '}
                                    {formatDate(assessment.end_time)}
                                </div>
                            </div>
                        </div>

                        {/* Action Button */}

                        {/* Action Button using alert-dialog */}
                        <div className="my-6">
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        size="lg"
                                        disabled={!canStart}
                                        className="w-full cursor-pointer md:w-auto"
                                    >
                                        {status === 'upcoming'
                                            ? 'Not Yet Started'
                                            : status === 'active'
                                              ? 'Start Attempt Now'
                                              : 'Assessment Closed'}
                                    </Button>
                                </AlertDialogTrigger>

                                <AlertDialogContent>
                                    <AlertDialogHeader className="text-center">
                                        <AlertDialogTitle className="flex flex-col items-center justify-center gap-4 text-center">
                                            <img
                                                className="max-w-24 rounded-full p-2"
                                                src="/assets/img/assessment/checklist.gif"
                                                alt=""
                                            />
                                            <span className="text-xl">
                                                Start Assessment
                                            </span>
                                        </AlertDialogTitle>
                                        <AlertDialogDescription className="text-center">
                                            Are you sure you want to start this
                                            assessment? Once started, your
                                            attempt will be recorded and timed.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>

                                    <AlertDialogFooter className="justify-center text-center sm:justify-center">
                                        <AlertDialogCancel>
                                            Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() =>
                                                startAttempt.mutate()
                                            }
                                            disabled={startAttempt.isPending}
                                        >
                                            {startAttempt.isPending
                                                ? 'Starting...'
                                                : 'Start Attempt'}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>

                        {/* Action Button using sweet alert */}
                        {/* <div className="my-6">
                            <Button
                                onClick={async () => {
                                    if (!canStart) return;

                                    const result = await Swal.fire({
                                        title: 'Start Assessment?',
                                        text: 'Once started, your attempt will be recorded and timed.',
                                        icon: 'question',
                                        showCancelButton: true,
                                        confirmButtonText: 'Yes, start now',
                                        cancelButtonText: 'Cancel',
                                        reverseButtons: true,
                                        confirmButtonColor: '#16a34a', // green
                                        cancelButtonColor: '#d33', // red
                                        background: '#1e1e1e', // optional dark mode look
                                        color: '#fff', // text color for dark theme
                                    });

                                    if (result.isConfirmed) {
                                        try {
                                            // Optional: show loading modal while starting
                                            Swal.fire({
                                                title: 'Starting...',
                                                text: 'Please wait while we prepare your assessment.',
                                                allowOutsideClick: false,
                                                didOpen: () => {
                                                    Swal.showLoading();
                                                },
                                            });

                                            const response = await fetch(
                                                route(
                                                    'student.assessment.attempt.start',
                                                    {
                                                        course: courseId,
                                                        assessment:
                                                            assessmentId,
                                                    },
                                                ),
                                                {
                                                    method: 'POST',
                                                    headers: {
                                                        'Content-Type':
                                                            'application/json',
                                                        'X-CSRF-TOKEN': (
                                                            document.querySelector(
                                                                'meta[name="csrf-token"]',
                                                            ) as HTMLMetaElement
                                                        )?.content,
                                                    },
                                                    body: JSON.stringify({
                                                        action: 'start_attempt',
                                                    }),
                                                },
                                            );

                                            if (!response.ok)
                                                throw new Error(
                                                    'Failed to start attempt',
                                                );

                                            const data = await response.json();

                                            Swal.close();

                                            // Success message before redirect
                                            await Swal.fire({
                                                title: 'Assessment Started!',
                                                text: 'Good luck — redirecting you now...',
                                                icon: 'success',
                                                timer: 1500,
                                                showConfirmButton: false,
                                            });

                                            window.location.href = route(
                                                'student.assessment.attempt.show',
                                                {
                                                    course: courseId,
                                                    assessment: assessmentId,
                                                    token: data.token, // token returned from backend
                                                },
                                            );
                                        } catch (err) {
                                            console.error(err);
                                            Swal.fire({
                                                title: 'Error',
                                                text: 'Something went wrong while starting your attempt. Please try again.',
                                                icon: 'error',
                                            });
                                        }
                                    }
                                }}
                                size={'lg'}
                                disabled={!canStart}
                                className="w-full cursor-pointer md:w-auto"
                            >
                                {status === 'upcoming'
                                    ? 'Not Yet Started'
                                    : status === 'active'
                                      ? 'Start Attempt Now'
                                      : 'Assessment Closed'}
                            </Button>
                        </div> */}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
