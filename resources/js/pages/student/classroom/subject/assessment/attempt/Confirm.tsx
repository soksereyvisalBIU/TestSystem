import { useEffect, useMemo, useState } from 'react';

// External modules
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Button } from '@headlessui/react';
import { Head, Link } from '@inertiajs/react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { route } from 'ziggy-js';

// Enable all necessary dayjs plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.extend(duration);

// --- MOCK COMPONENTS (If AppLayout/Button are not actually available in your env) ---
// If you have these components in your project, remove these mocks.

const SimpleLayout = ({ children, title }: { children: React.ReactNode; title: string }) => (
    <div className="min-h-screen bg-gray-100 p-4 text-gray-900 sm:p-8 dark:bg-gray-900">
        <main className="mx-auto max-w-7xl">{children}</main>
    </div>
);

const TailwindButton = ({
    children,
    disabled,
    className = '',
    variant = 'default',
    ...props
}: any) => {
    const baseStyle =
        'px-6 py-2 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-4 w-full flex items-center justify-center';
    const disabledStyle = 'opacity-50 cursor-not-allowed';
    
    let variantStyle = 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500/50';
    if (variant === 'default') {
        variantStyle = 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500/50';
    }

    return (
        <button
            className={`${baseStyle} ${variantStyle} ${disabled ? disabledStyle : ''} ${className}`}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
};
// ----------------------------------------------------------------------------------

type DashboardProps = {
    assessment: {
        id: number;
        title: string;
        description: string | null;
        type: string;
        start_time: string;
        end_time: string;
        duration: number;
        max_attempts: number;
        instructions?: string;
        [key: string]: any;
    };
    class_id: number;
    subject_id: number;
    studentAssessment: {
        id: number;
        attempted_amount: number;
        score: number;
        [key: string]: any;
    } | null;
    studentAssessmentAttempt: {
        id: number;
        status: string | null; // e.g., 'in_progress', 'completed'
        [key: string]: any;
    } | null;
};

export default function Confirm({
    assessment,
    class_id,
    subject_id,
    studentAssessment,
    studentAssessmentAttempt,
}: DashboardProps) {
    
    // 1. Server Time Synchronization
    const [serverNow, setServerNow] = useState<dayjs.Dayjs | null>(null);

    useEffect(() => {
        // Simulating fetching server time. In production, replace with actual API call.
        const fetchServerTime = () => {
            return new Promise<{ now: string }>((resolve) => {
                setTimeout(() => {
                    resolve({ now: dayjs.utc().toISOString() });
                }, 100);
            });
        };

        fetchServerTime()
            .then((data) => {
                setServerNow(dayjs.utc(data.now).tz('Asia/Phnom_Penh'));
            })
            .catch((error) => {
                console.error('Error fetching server time:', error);
                setServerNow(dayjs().tz('Asia/Phnom_Penh'));
            });
    }, []);

    // 2. Countdown Ticker
    useEffect(() => {
        if (!serverNow) return;
        const timer = setInterval(() => {
            setServerNow((prev) => (prev ? prev.add(1, 'second') : prev));
        }, 1000);
        return () => clearInterval(timer);
    }, [serverNow]);

    // 3. Time & Status Logic
    const {
        start,
        end,
        now,
        isWithinTime,
        isBeforeStart,
        isAfterEnd,
        countdown,
    } = useMemo(() => {
        if (!assessment || !serverNow) {
            return {
                start: null,
                end: null,
                now: serverNow,
                isWithinTime: false,
                isBeforeStart: false,
                isAfterEnd: false,
                countdown: null,
            };
        }

        const start = dayjs.utc(assessment.start_time).tz('Asia/Phnom_Penh');
        const end = dayjs.utc(assessment.end_time).tz('Asia/Phnom_Penh');
        const now = serverNow;

        const isWithinTime = now.isAfter(start) && now.isBefore(end);
        const isBeforeStart = now.isBefore(start);
        const isAfterEnd = now.isAfter(end);

        const getCountdown = (target: dayjs.Dayjs) => {
            const diff = target.diff(now);
            if (diff <= 0) return null;
            const timeDuration = dayjs.duration(diff);
            return {
                days: Math.floor(timeDuration.asDays()),
                hours: timeDuration.hours(),
                minutes: timeDuration.minutes(),
                seconds: timeDuration.seconds(),
            };
        };

        const countdown = isBeforeStart
            ? getCountdown(start)
            : isWithinTime
              ? getCountdown(end)
              : null;

        return { start, end, now, isWithinTime, isBeforeStart, isAfterEnd, countdown };
    }, [assessment, serverNow]);

    // 4. Early Returns
    if (!assessment) return <div>Assessment not found</div>;
    
    if (!serverNow) {
        return (
            <SimpleLayout title="Loading...">
                 <div className="flex h-[50vh] flex-1 items-center justify-center">
                    <div className="animate-pulse text-xl text-gray-500">Syncing server time...</div>
                </div>
            </SimpleLayout>
        );
    }

    // 5. Attempt Calculation
    const attemptsUsed = studentAssessment?.attempted_amount ?? 0;
    const maxAttempts = assessment.max_attempts ?? 0;
    const hasRemainingAttempts = maxAttempts === 0 || attemptsUsed < maxAttempts;
    
    // Check if there is an active attempt we should resume
    const isResuming = studentAssessmentAttempt && studentAssessmentAttempt.status !== 'completed';
    
    // Can we start/continue?
    // We can start if we are within time AND (we have attempts left OR we are resuming an unfinished one)
    const canAttemptNow = isWithinTime && (hasRemainingAttempts || isResuming);

    // Can we review?
    // We can review if user has taken it at least once.
    const canReview = attemptsUsed > 0 && studentAssessmentAttempt?.id;

    // Type Mapping
    const typeMap: Record<string, string> = {
        quiz: 'Quiz',
        exam: 'Exam',
        homework: 'Homework',
        midterm: 'Midterm',
        final: 'Final',
    };
    const assessmentType = typeMap[assessment.type] || 'Assessment';

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Class', href: '#' },
        { title: 'Subjects', href: '#' },
        { title: 'Assessments', href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={assessment.title} />

            <SimpleLayout title={assessment.title}>
                <div className="flex flex-col items-center justify-center py-6">
                    <div className="relative flex w-full max-w-2xl flex-col rounded-xl border border-gray-300 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
                        
                        {/* HEADER */}
                        <div className="p-8 text-center">
                            <h1 className="mb-2 text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
                                {assessment.title}
                            </h1>
                            <p className="text-lg text-gray-500 dark:text-gray-400">
                                {assessment.description || 'No description provided.'}
                            </p>

                            {/* COUNTDOWN */}
                            {countdown && start && end && (
                                <div className={`mt-6 rounded-xl border-2 p-4 shadow-inner transition-colors duration-300 ${
                                    isBeforeStart 
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                                        : 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                }`}>
                                    <p className={`text-sm font-bold uppercase tracking-wider ${
                                        isBeforeStart ? 'text-blue-700 dark:text-blue-300' : 'text-green-700 dark:text-green-300'
                                    }`}>
                                        {isBeforeStart ? 'Assessment Starts In' : 'Time Remaining'}
                                    </p>
                                    <div className="mt-2 flex justify-center space-x-2 font-mono text-4xl font-extrabold text-gray-800 dark:text-gray-100 sm:text-5xl">
                                        {['days', 'hours', 'minutes', 'seconds'].map((unit, idx) => {
                                            const val = countdown[unit as keyof typeof countdown];
                                            if (unit === 'days' && val === 0) return null;
                                            return (
                                                <div key={unit} className="flex items-baseline">
                                                    <span>{String(val).padStart(2, '0')}</span>
                                                    <span className="ml-1 text-sm font-medium text-gray-500">{unit.charAt(0)}</span>
                                                    {idx < 3 && (unit !== 'days' || val > 0) && <span className="mx-1 opacity-50">:</span>}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* DETAILS TABLE */}
                            <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-700/30">
                                <div className="grid divide-y divide-gray-200 dark:divide-gray-600">
                                    <div className="flex justify-between p-4">
                                        <span className="font-semibold text-gray-700 dark:text-gray-300">Type</span>
                                        <span className="font-bold text-indigo-600 dark:text-indigo-400">{assessmentType}</span>
                                    </div>
                                    {start && end && (
                                        <div className="flex justify-between p-4">
                                            <span className="font-semibold text-gray-700 dark:text-gray-300">Window</span>
                                            <div className="text-right text-sm">
                                                <div className="text-gray-900 dark:text-white">{start.format('MMM D, HH:mm')}</div>
                                                <div className="text-gray-500">to</div>
                                                <div className="text-gray-900 dark:text-white">{end.format('MMM D, HH:mm')}</div>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex justify-between p-4">
                                        <span className="font-semibold text-gray-700 dark:text-gray-300">Duration</span>
                                        <span className="text-gray-900 dark:text-white">{assessment.duration ? `${assessment.duration} mins` : 'No Limit'}</span>
                                    </div>
                                    <div className="flex justify-between p-4">
                                        <span className="font-semibold text-gray-700 dark:text-gray-300">Attempts</span>
                                        <span className={`${!hasRemainingAttempts ? 'text-red-600' : 'text-gray-900'} font-medium dark:text-white`}>
                                            {attemptsUsed} / {maxAttempts === 0 ? '∞' : maxAttempts}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* INSTRUCTIONS */}
                            {assessment.instructions && (
                                <div className="mt-6 rounded-lg border-l-4 border-yellow-400 bg-yellow-50 p-4 text-left dark:bg-yellow-900/20">
                                    <h3 className="text-sm font-bold text-yellow-800 dark:text-yellow-200">Instructions</h3>
                                    <p className="mt-1 whitespace-pre-line text-sm text-yellow-700 dark:text-yellow-300">{assessment.instructions}</p>
                                </div>
                            )}

                            {/* ACTION BUTTONS AREA */}
                            <div className="mt-8 flex flex-col gap-4">
                                {canAttemptNow ? (
                                    <Link
                                        href={route('student.classes.subjects.assessments.request', {
                                            class_id,
                                            subject_id,
                                            assessment_id: assessment.id,
                                            // Pass the ID if resuming, otherwise it might be null or handled by backend
                                            student_assessment_attempt_id: studentAssessmentAttempt?.id ?? null,
                                        })}
                                        method="post"
                                        as="button"
                                        className="w-full transform rounded-lg bg-indigo-600 py-4 text-xl font-bold text-white shadow-lg transition-all duration-200 hover:-translate-y-1 hover:bg-indigo-700 hover:shadow-indigo-500/30 focus:ring-4 focus:ring-indigo-500/50"
                                    >
                                        {isResuming ? 'Resume Assessment' : 'Start Assessment Now'}
                                    </Link>
                                ) : (
                                    /* RESTRICTED MESSAGE */
                                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center dark:border-red-900 dark:bg-red-900/20">
                                        <h3 className="text-lg font-bold text-red-600 dark:text-red-400">Access Restricted</h3>
                                        <p className="mt-1 text-sm text-red-500">
                                            {isBeforeStart 
                                                ? `Assessment is locked until ${start?.format('MMM D, HH:mm')}`
                                                : isAfterEnd 
                                                    ? "This assessment has closed."
                                                    : !hasRemainingAttempts 
                                                        ? "You have used all allowed attempts." 
                                                        : "Assessment unavailable."}
                                        </p>
                                    </div>
                                )}

                                {/* REVIEW BUTTON (Secondary Action) */}
                                {/* Only show review if we can't start, or if we want to allow review anytime history exists */}
                                {canReview && (
                                    <div className="mt-2">
                                        <Link
                                            href={route('student.classes.subjects.assessments.attempt.review', {
                                                class_id,
                                                subject_id,
                                                assessment_id: assessment.id,
                                                // Default to the last attempt ID or handle specifically
                                                student_assessment_attempt_id: studentAssessmentAttempt?.id
                                            })}
                                            className="inline-flex w-full items-center justify-center rounded-lg border-2 border-gray-200 bg-white px-6 py-3 font-semibold text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                                        >
                                            Review Past Attempts
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </SimpleLayout>
        </AppLayout>
    );
}