import { useEffect, useMemo, useState } from 'react';

// External modules
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { motion } from 'framer-motion';
import { route } from 'ziggy-js';
// Import Confetti
import confetti from 'canvas-confetti';

// Enable dayjs plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.extend(duration);

const SimpleLayout = ({
    children,
    title,
}: {
    children: React.ReactNode;
    title: string;
}) => (
    <div className="min-h-screen bg-gray-50 p-4 text-gray-900 sm:p-8 dark:bg-gray-900">
        <main className="mx-auto max-w-5xl">{children}</main>
    </div>
);

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
        max_score?: number;
        [key: string]: any;
    };
    class_id: number;
    subject_id: number;
    studentAssessment: {
        id: number;
        attempted_amount: number;
        score: number | null;
        status?: string;
        [key: string]: any;
    } | null;
    studentAssessmentAttempt: {
        id: number;
        status: string | null;
        score?: number;
        completed_at?: string;
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
    // --- STATE & HOOKS ---
    const [serverNow, setServerNow] = useState<dayjs.Dayjs | null>(null);
    const [animatedScore, setAnimatedScore] = useState(0); // For the count-up effect
    const [showContent, setShowContent] = useState(false); // For fade-in transition

    // 1. Server Time Sync
    useEffect(() => {
        const fetchServerTime = () =>
            new Promise<{ now: string }>((resolve) => {
                setTimeout(
                    () => resolve({ now: dayjs.utc().toISOString() }),
                    100,
                );
            });

        fetchServerTime()
            .then((data) =>
                setServerNow(dayjs.utc(data.now).tz('Asia/Phnom_Penh')),
            )
            .catch(() => setServerNow(dayjs().tz('Asia/Phnom_Penh')));

        // Trigger generic fade-in on mount
        setShowContent(true);
    }, []);

    useEffect(() => {
        if (!serverNow) return;
        const timer = setInterval(
            () => setServerNow((prev) => (prev ? prev.add(1, 'second') : prev)),
            1000,
        );
        return () => clearInterval(timer);
    }, [serverNow]);

    // 2. Logic Calculation
    const { start, end, now, isWithinTime, isBeforeStart, countdown } =
        useMemo(() => {
            if (!assessment || !serverNow)
                return {
                    start: null,
                    end: null,
                    now: serverNow,
                    isWithinTime: false,
                    isBeforeStart: false,
                    countdown: null,
                };

            const start = dayjs
                .utc(assessment.start_time)
                .tz('Asia/Phnom_Penh');
            const end = dayjs.utc(assessment.end_time).tz('Asia/Phnom_Penh');
            const now = serverNow;
            const isWithinTime = now.isAfter(start) && now.isBefore(end);
            const isBeforeStart = now.isBefore(start);

            const diff = isBeforeStart
                ? start.diff(now)
                : isWithinTime
                  ? end.diff(now)
                  : 0;
            let countdown = null;
            if (diff > 0) {
                const d = dayjs.duration(diff);
                countdown = {
                    days: Math.floor(d.asDays()),
                    hours: d.hours(),
                    minutes: d.minutes(),
                    seconds: d.seconds(),
                };
            }
            return { start, end, now, isWithinTime, isBeforeStart, countdown };
        }, [assessment, serverNow]);

    // 3. Status Determination
    const attemptsUsed = studentAssessment?.attempted_amount ?? 0;
    const maxAttempts = assessment.max_attempts ?? 0;
    const isAttemptCompleted = studentAssessmentAttempt?.status === 'completed';
    const hasRecordedScore =
        studentAssessment?.score !== null &&
        studentAssessment?.score !== undefined;

    // DECISION: Show Result?
    const showResult =
        isAttemptCompleted || (hasRecordedScore && attemptsUsed > 0);

    const hasRemainingAttempts =
        maxAttempts === 0 || attemptsUsed < maxAttempts;
    const isResuming =
        studentAssessmentAttempt &&
        studentAssessmentAttempt.status !== 'completed';
    const canAttemptNow =
        !showResult && isWithinTime && (hasRemainingAttempts || isResuming);

    // Score Data
    const rawScore =
        studentAssessmentAttempt?.score ?? studentAssessment?.score ?? 0;
    const maxScore = assessment.max_score ?? 100;
    const scorePercentage = Math.round((rawScore / maxScore) * 100);
    const isPassing = scorePercentage >= 50;

    // --- ANIMATION EFFECTS ---

    // Effect A: Count Up Animation
    useEffect(() => {
        if (showResult) {
            let start = 0;
            const end = rawScore;
            if (start === end) return;

            // Duration based on score (max 1.5 seconds)
            const duration = 1500;
            const incrementTime = (duration / end) * 1.5;

            const timer = setInterval(
                () => {
                    start += 1;
                    setAnimatedScore(start);
                    if (start === end) clearInterval(timer);
                },
                Math.max(incrementTime, 10),
            ); // Ensure at least 10ms per frame

            return () => clearInterval(timer);
        }
    }, [showResult, rawScore]);

    // Effect B: Confetti Celebration (Only if passing and showing result)
    useEffect(() => {
        if (showResult && isPassing) {
            // Fire confetti from left and right edges
            const duration = 3000;
            const animationEnd = Date.now() + duration;
            const defaults = {
                startVelocity: 30,
                spread: 360,
                ticks: 60,
                zIndex: 0,
            };

            const randomInRange = (min: number, max: number) =>
                Math.random() * (max - min) + min;

            const interval: any = setInterval(function () {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);

                // Since particles fall down, start a bit higher than random
                confetti({
                    ...defaults,
                    particleCount,
                    origin: {
                        x: randomInRange(0.1, 0.3),
                        y: Math.random() - 0.2,
                    },
                });
                confetti({
                    ...defaults,
                    particleCount,
                    origin: {
                        x: randomInRange(0.7, 0.9),
                        y: Math.random() - 0.2,
                    },
                });
            }, 250);

            return () => clearInterval(interval);
        }
    }, [showResult, isPassing]);

    if (!assessment || !serverNow)
        return (
            <SimpleLayout title="Loading...">
                <div className="p-10 text-center text-gray-400">Loading...</div>
            </SimpleLayout>
        );

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Class', href: '#' },
        { title: 'Subjects', href: '#' },
        { title: 'Assessments', href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={assessment.title} />

            <SimpleLayout title={assessment.title}>
                {/* Main Container with Entrance Animation */}
                <div
                    className={`flex flex-col items-center justify-center py-6 transition-all duration-700 ease-out ${
                        showContent
                            ? 'translate-y-0 opacity-100'
                            : 'translate-y-10 opacity-0'
                    }`}
                >
                    <motion.div
                        layoutId={`assessment-card-${assessment.id}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="flex flex-col items-center justify-center py-6"
                    >
                        <div className="relative flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-800">
                            {/* Header */}
                            <div className="bg-gray-50/50 p-8 text-center dark:bg-gray-800/50">
                                <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
                                    {assessment.title}
                                </h1>
                                <p className="text-lg text-gray-500 dark:text-gray-400">
                                    {assessment.description}
                                </p>
                            </div>

                            <div className="px-8 pb-8">
                                {/* === RESULT CARD === */}
                                {showResult ? (
                                    <div className="perspective-1000 mt-2 transform">
                                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-50 to-white py-12 text-center shadow-inner ring-1 ring-indigo-100 transition-all duration-500 hover:shadow-lg dark:from-gray-700 dark:to-gray-800 dark:ring-gray-600">
                                            {/* Background Blobs (Animated) */}
                                            <div className="absolute -top-10 -right-10 h-40 w-40 animate-pulse rounded-full bg-indigo-500/10 blur-3xl"></div>
                                            <div className="absolute -bottom-10 -left-10 h-40 w-40 animate-pulse rounded-full bg-blue-500/10 blur-3xl delay-700"></div>

                                            <p className="text-sm font-bold tracking-widest text-gray-500 uppercase dark:text-gray-400">
                                                Assessment Completed
                                            </p>

                                            {/* Animated Score */}
                                            <div className="mt-6 flex flex-col items-center justify-center">
                                                <div className="relative">
                                                    <span
                                                        className={`text-8xl font-black tracking-tighter sm:text-9xl ${
                                                            isPassing
                                                                ? 'bg-gradient-to-r from-green-500 to-emerald-700 bg-clip-text text-transparent'
                                                                : 'text-red-500'
                                                        } px-3`}
                                                    >
                                                        {animatedScore}
                                                    </span>
                                                    {/* Percentage Sign */}
                                                    <span className="absolute top-4 -right-6 text-2xl font-bold text-gray-400">
                                                        %
                                                    </span>
                                                </div>

                                                <div className="mt-2 flex items-center space-x-2 text-gray-400">
                                                    <span className="text-lg font-medium">
                                                        Final Score ({rawScore}/
                                                        {maxScore})
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Animated Badge */}
                                            <div
                                                className={`mt-8 flex justify-center transition-all duration-700 ${animatedScore === rawScore ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}
                                            >
                                                <span
                                                    className={`inline-flex items-center gap-2 rounded-full px-6 py-2 text-base font-bold shadow-sm ${
                                                        isPassing
                                                            ? 'bg-green-100 text-green-700 ring-2 ring-green-500/20 dark:bg-green-900/30 dark:text-green-300'
                                                            : 'bg-red-100 text-red-700 ring-2 ring-red-500/20 dark:bg-red-900/30 dark:text-red-300'
                                                    }`}
                                                >
                                                    {isPassing ? (
                                                        <>
                                                            <svg
                                                                className="h-5 w-5"
                                                                fill="currentColor"
                                                                viewBox="0 0 20 20"
                                                            >
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                            PASSED
                                                        </>
                                                    ) : (
                                                        <>
                                                            <svg
                                                                className="h-5 w-5"
                                                                fill="currentColor"
                                                                viewBox="0 0 20 20"
                                                            >
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                            NEEDS IMPROVEMENT
                                                        </>
                                                    )}
                                                </span>
                                            </div>

                                            {studentAssessmentAttempt?.completed_at && (
                                                <p className="mt-6 text-xs text-gray-400">
                                                    Submitted{' '}
                                                    {dayjs(
                                                        studentAssessmentAttempt.completed_at,
                                                    ).fromNow()}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    // === COUNTDOWN ===
                                    countdown &&
                                    start && (
                                        <div className="mt-6 rounded-xl border-2 border-indigo-50 bg-indigo-50/50 p-6 text-center dark:border-indigo-900/30 dark:bg-indigo-900/20">
                                            <p className="text-sm font-bold tracking-wider text-indigo-700 uppercase dark:text-indigo-300">
                                                {isBeforeStart
                                                    ? 'Assessment Starts In'
                                                    : 'Time Remaining'}
                                            </p>
                                            <div className="mt-4 flex justify-center gap-4">
                                                {[
                                                    'days',
                                                    'hours',
                                                    'minutes',
                                                    'seconds',
                                                ].map((unit) => {
                                                    const val =
                                                        countdown[
                                                            unit as keyof typeof countdown
                                                        ];
                                                    if (
                                                        unit === 'days' &&
                                                        val === 0
                                                    )
                                                        return null;
                                                    return (
                                                        <div
                                                            key={unit}
                                                            className="flex flex-col items-center rounded-lg bg-white p-3 shadow-sm dark:bg-gray-700"
                                                        >
                                                            <span className="text-3xl font-black text-gray-800 dark:text-white">
                                                                {String(
                                                                    val,
                                                                ).padStart(
                                                                    2,
                                                                    '0',
                                                                )}
                                                            </span>
                                                            <span className="text-[10px] font-bold text-gray-400 uppercase">
                                                                {unit}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )
                                )}

                                {/* Info Grid */}
                                <div className="mt-8 grid grid-cols-2 gap-4 text-center sm:grid-cols-4">
                                    {[
                                        {
                                            label: 'Type',
                                            value: assessment.type.toUpperCase(),
                                        },
                                        {
                                            label: 'Duration',
                                            value: `${assessment.duration}m`,
                                        },
                                        {
                                            label: 'Attempts',
                                            value: `${attemptsUsed}/${maxAttempts === 0 ? '∞' : maxAttempts}`,
                                        },
                                        {
                                            label: 'Status',
                                            value: showResult
                                                ? 'Done'
                                                : 'Active',
                                        },
                                    ].map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700/30"
                                        >
                                            <div className="text-[10px] font-bold text-gray-400 uppercase">
                                                {item.label}
                                            </div>
                                            <div className="font-bold text-gray-700 dark:text-gray-200">
                                                {item.value}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Buttons */}
                                <div className="mt-8 flex flex-col gap-3">
                                    {canAttemptNow ? (
                                        <Link
                                            href={route(
                                                'student.classes.subjects.assessments.request',
                                                {
                                                    class_id,
                                                    subject_id,
                                                    assessment_id:
                                                        assessment.id,
                                                    student_assessment_attempt_id:
                                                        studentAssessmentAttempt?.id ??
                                                        null,
                                                },
                                            )}
                                            method="post"
                                            as="button"
                                            className="group relative w-full overflow-hidden rounded-xl bg-indigo-600 py-4 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-indigo-700 hover:shadow-indigo-500/40"
                                        >
                                            <span className="relative z-10 flex items-center justify-center gap-2">
                                                {isResuming
                                                    ? 'Resume Assessment'
                                                    : 'Start Assessment'}
                                            </span>
                                        </Link>
                                    ) : !showResult ? (
                                        <div className="rounded-xl bg-red-50 p-4 text-center text-red-600 dark:bg-red-900/20 dark:text-red-400">
                                            {isBeforeStart
                                                ? 'Starts Soon'
                                                : 'Unavailable'}
                                        </div>
                                    ) : null}

                                    {/* Review Button - Only shows if assessment is done */}
                                    {studentAssessmentAttempt?.id && (
                                        <Link
                                            href={route(
                                                'student.classes.subjects.assessments.attempt.review',
                                                {
                                                    class_id,
                                                    subject_id,
                                                    assessment_id:
                                                        assessment.id,
                                                    student_assessment_attempt_id:
                                                        studentAssessmentAttempt.id,
                                                },
                                            )}
                                            className={`flex w-full items-center justify-center rounded-xl border-2 border-gray-100 py-3 font-semibold text-gray-600 transition-all hover:border-indigo-100 hover:bg-indigo-50 hover:text-indigo-600 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 ${
                                                showResult ? 'mt-2' : ''
                                            }`}
                                        >
                                            Review Answers
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </SimpleLayout>
        </AppLayout>
    );
}
