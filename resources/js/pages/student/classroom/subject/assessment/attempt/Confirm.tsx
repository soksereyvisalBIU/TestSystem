import { useEffect, useMemo, useState } from 'react';

// External modules that are assumed to be available or in the global scope
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
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

// Since we cannot use external components like AppLayout, Head, Link, or custom Button,
// we will replace them with functional equivalents (divs, standard buttons, etc.)

// Mock components to replace unresolvable imports like AppLayout and Button
const SimpleLayout = ({ children, title }) => (
    <div className="p-4 text-gray-900 sm:p-8">
        {/* <header className="mb-6">
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
                Dashboard / Assessment View
            </p>
        </header> */}
        <main className="h-full">{children}</main>
    </div>
);

// Styled Button replacement using standard HTML button and Tailwind classes
const TailwindButton = ({
    children,
    disabled,
    className,
    variant = 'default',
    ...props
}) => {
    const baseStyle =
        'px-6 py-2 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-4 w-full';
    const disabledStyle = 'opacity-50 cursor-not-allowed';

    let variantStyle =
        'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500/50';
    if (variant === 'default') {
        variantStyle =
            'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500/50';
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

type DashboardProps = {
    assessment: any;
    class_id: number;
    subject_id: number;
    studentAssessment: any;
    studentAssessmentAttempt: any;
};

// Removed the unresolvable 'route' and 'BreadcrumbItem' dependencies

export default function Comfirm({
    assessment,
    class_id,
    subject_id,
    studentAssessment,
    studentAssessmentAttempt,
}: DashboardProps) {
    // ===================================
    // ALL HOOKS DEFINED AT THE TOP LEVEL
    // This ensures consistent hook order on every render.
    // ===================================
    const [serverNow, setServerNow] = useState<dayjs.Dayjs | null>(null);

    // 1. Fetch server time on mount
    useEffect(() => {
        // Mock fetch, as the actual API endpoint is unavailable in this environment
        // In a real environment, this would ensure time synchronization.
        const mockFetchServerTime = () => {
            return new Promise<{ now: string }>((resolve) => {
                // Simulate a small network delay and provide the current client time as "server" time
                setTimeout(() => {
                    resolve({ now: dayjs.utc().toISOString() });
                }, 100);
            });
        };

        mockFetchServerTime()
            .then((data) => {
                // Initialize server time, setting the time zone for display/comparison
                setServerNow(dayjs.utc(data.now).tz('Asia/Phnom_Penh'));
            })
            .catch((error) => {
                console.error('Error fetching server time:', error);
                // Fallback to client time
                setServerNow(dayjs().tz('Asia/Phnom_Penh'));
            });
    }, []);

    // 2. Countdown tick - Increment server time state every second
    useEffect(() => {
        if (!serverNow) return;

        const timer = setInterval(() => {
            // Safely update state, ensuring we use the previous state value
            setServerNow((prev) => (prev ? prev.add(1, 'second') : prev));
        }, 1000);

        return () => clearInterval(timer);
    }, [serverNow]);

    // 3. Time Logic (useMemo to prevent unnecessary recalculations)
    // Now defined before conditional returns to maintain hook order.
    const {
        start,
        end,
        now,
        isWithinTime,
        isBeforeStart,
        isAfterEnd,
        countdown,
    } = useMemo(() => {
        // Defensive check: If assessment or server time is not available yet, return safe defaults
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

        // Countdown Helper
        const getCountdown = (target: dayjs.Dayjs) => {
            const diff = target.diff(now);

            if (diff <= 0) return null;

            const timeDuration = dayjs.duration(diff);

            return {
                days: timeDuration.days(),
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

        return {
            start,
            end,
            now,
            isWithinTime,
            isBeforeStart,
            isAfterEnd,
            countdown,
        };
    }, [assessment, serverNow]); // Depend on the whole assessment object and serverNow

    // ===================================
    // CONDITIONAL RETURNS
    // ===================================

    // Replaced AppLayout with SimpleLayout
    if (!assessment) {
        return (
            <SimpleLayout title="Assessment">
                <div className="flex h-full flex-1 items-center justify-center">
                    <p className="text-center font-medium text-red-600">
                        Assessment not found.
                    </p>
                </div>
            </SimpleLayout>
        );
    }

    // Render nothing until server time is initialized
    if (!serverNow) {
        return (
            <SimpleLayout title="Assessment">
                <div className="flex h-full flex-1 items-center justify-center">
                    <div className="animate-pulse text-xl">
                        Loading assessment clock...
                    </div>
                </div>
            </SimpleLayout>
        );
    }

    // =======================
    // Attempts Logic
    // =======================
    const attempts = studentAssessment?.attempted_amount ?? 0;
    const maxAttempts = assessment.max_attempts ?? 0;
    const hasRemainingAttempts = maxAttempts === 0 || attempts < maxAttempts;
    const canAttemptNow = isWithinTime && hasRemainingAttempts;

    // =======================
    // Type Mapping
    // =======================
    const typeMap: Record<string, string> = {
        quiz: 'Quiz',
        exam: 'Exam',
        homework: 'Homework',
        midterm: 'Midterm',
        final: 'Final',
    };

    const assessmentType = typeMap[assessment.type] || 'Assessment';

    // Simulate navigation/link action
    const handleStartAssessment = () => {
        console.log(
            `Intending to navigate/POST to start assessment ID: ${assessment.id} for Class ID: ${class_id}, Subject ID: ${subject_id}`,
        );
        // IMPORTANT: Replaced alert() with console.log as alerts are forbidden
        // Since we cannot use custom modals, we'll log the intended action.
        console.log('Action: The assessment would now be initiated.');
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Class', href: '/' },
        { title: 'Subjects', href: '/subjects' },
        { title: 'Assessments', href: '/assessments' },
    ];

    // Replaced AppLayout with SimpleLayout
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Subject Detail" />

            <SimpleLayout title={assessment.title || 'Assessment'}>
                {/* Removed <Head title={...} /> as it relies on Inertia/React components */}

                <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl">
                    <div className="relative flex flex-1 items-center justify-center rounded-xl border border-gray-300 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
                        <div className="w-full max-w-xl p-8 text-center">
                            <h1 className="mb-2 text-4xl font-extrabold text-gray-900 dark:text-white">
                                {assessment.title}
                            </h1>
                            <p className="mb-6 text-lg text-gray-500 dark:text-gray-400">
                                {assessment.description}
                            </p>

                            {/* COUNTDOWN DISPLAY ===================== */}
                            {/* We use start/end from useMemo which handles null checks defensively */}
                            {countdown && start && end && (
                                <div
                                    className={`mt-4 rounded-xl border-2 p-4 shadow-inner ${isBeforeStart ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-green-500 bg-green-50 dark:bg-green-900/20'} transition-all duration-300`}
                                >
                                    <p
                                        className={`text-lg font-semibold ${isBeforeStart ? 'text-blue-700 dark:text-blue-300' : 'text-green-700 dark:text-green-300'}`}
                                    >
                                        {isBeforeStart
                                            ? 'Assessment Starts In:'
                                            : 'Assessment Ends In:'}
                                    </p>
                                    <div className="tabular-lining mt-2 font-mono text-5xl font-extrabold text-gray-800 dark:text-gray-100">
                                        <span className="mx-1">
                                            {countdown.days}
                                            <span className="ml-1 text-xl font-medium">
                                                d
                                            </span>
                                        </span>
                                        <span className="mx-1">:</span>
                                        <span className="mx-1">
                                            {countdown.hours
                                                .toString()
                                                .padStart(2, '0')}
                                            <span className="ml-1 text-xl font-medium">
                                                h
                                            </span>
                                        </span>
                                        <span className="mx-1">:</span>
                                        <span className="mx-1">
                                            {countdown.minutes
                                                .toString()
                                                .padStart(2, '0')}
                                            <span className="ml-1 text-xl font-medium">
                                                m
                                            </span>
                                        </span>
                                        <span className="mx-1">:</span>
                                        <span className="mx-1">
                                            {countdown.seconds
                                                .toString()
                                                .padStart(2, '0')}
                                            <span className="ml-1 text-xl font-medium">
                                                s
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* ===================== */}
                            {/* Meta Info */}
                            {/* ===================== */}
                            <div className="mt-8 space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-5 text-base text-gray-700 dark:border-gray-700 dark:bg-gray-700/50 dark:text-gray-300">
                                {/* Type */}
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-gray-900 dark:text-white">
                                        Assessment Type:
                                    </span>
                                    <span className="text-indigo-600 dark:text-indigo-400">
                                        {assessmentType}
                                    </span>
                                </div>

                                {/* Time Window */}
                                {start && end && (
                                    <div className="flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-600">
                                        <span className="font-bold text-gray-900 dark:text-white">
                                            Time Window (ICT):
                                        </span>
                                        <span className="text-right">
                                            {start.format('MMM D, YYYY HH:mm')}
                                            <span className="mx-1">→</span>
                                            {end.format('MMM D, YYYY HH:mm')}
                                        </span>
                                    </div>
                                )}

                                {/* Current Status */}
                                {isWithinTime && end && now && (
                                    <div className="flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-600">
                                        <span className="font-bold text-gray-900 dark:text-white">
                                            Current Status:
                                        </span>
                                        <span className="font-extrabold text-green-600 dark:text-green-400">
                                            ACTIVE (Ends {end.from(now)})
                                        </span>
                                    </div>
                                )}

                                {/* Duration */}
                                <div className="flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-600">
                                    <span className="font-bold text-gray-900 dark:text-white">
                                        Allowed Duration:
                                    </span>
                                    <span>
                                        {assessment.duration ?? 'N/A'} minutes
                                    </span>
                                </div>

                                {/* Attempts */}
                                <div className="flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-600">
                                    <span className="font-bold text-gray-900 dark:text-white">
                                        Attempts Used:
                                    </span>
                                    <span>
                                        {maxAttempts === 0
                                            ? `${attempts} / Unlimited`
                                            : `${attempts} / ${maxAttempts}`}
                                    </span>
                                </div>
                            </div>

                            {/* INSTRUCTIONS */}
                            {assessment.instructions && (
                                <div className="mt-6 rounded-xl border-2 border-yellow-500 bg-yellow-50 p-4 text-left shadow-lg dark:bg-yellow-950">
                                    <p className="mb-2 text-lg font-extrabold text-yellow-800 dark:text-yellow-300">
                                        Important Instructions:
                                    </p>
                                    <div className="text-sm whitespace-pre-line text-gray-700 dark:text-gray-200">
                                        {assessment.instructions}
                                    </div>
                                </div>
                            )}

                            {/* BUTTON / STATUS MESSAGE */}
                            <div className="mt-10">
                                {canAttemptNow ? (
                                    // Replaced Inertia Link with a styled button and simulated action

                                    <TailwindButton
                                        // onClick={handleStartAssessment}
                                        className="w-full py-3 text-xl shadow-2xl hover:shadow-indigo-500/50"
                                        variant="default"
                                    >
                                        <Link
                                            href={route(
                                                'student.classes.subjects.assessments.request',
                                                {
                                                    class_id: class_id,
                                                    subject_id: subject_id,
                                                    assessment_id:
                                                        assessment.id,
                                                    student_assessment_attempt_id: studentAssessmentAttempt.id
                                                },
                                            )}
                                            method="post"
                                        >
                                            Start Assessment Now
                                        </Link>
                                    </TailwindButton>
                                ) : (
                                    <div className="space-y-4 rounded-xl border-2 border-red-500 bg-red-50 p-5 text-sm shadow-inner dark:border-red-700 dark:bg-red-950">
                                        <p className="text-lg font-extrabold text-red-700 dark:text-red-400">
                                            Access Restricted
                                        </p>

                                        {isBeforeStart && start && (
                                            <p>
                                                This assessment is locked until
                                                the start time of{' '}
                                                <strong className="text-red-800 dark:text-red-300">
                                                    {start.format(
                                                        'MMM D, HH:mm',
                                                    )}
                                                </strong>
                                                .
                                            </p>
                                        )}

                                        {isAfterEnd && (
                                            <p>
                                                This assessment window has
                                                officially closed. You can no
                                                longer start the exam.
                                            </p>
                                        )}

                                        {!hasRemainingAttempts &&
                                            maxAttempts > 0 && (
                                                <p>
                                                    You have used all{' '}
                                                    <strong className="text-red-800 dark:text-red-300">
                                                        {maxAttempts}
                                                    </strong>{' '}
                                                    allowed attempts.
                                                </p>
                                            )}

                                        {/* Replaced Button with TailwindButton */}
                                        <TailwindButton
                                            disabled
                                            className="mt-3 bg-red-400/50 text-white/70 dark:bg-red-900/50"
                                        >
                                            Start Assessment (Unavailable)
                                        </TailwindButton>
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
