import { AssessmentResultCard } from '@/components/student/confirm/AssessmentResultCard';
import { AssessmentSkeleton } from '@/components/student/confirm/AssessmentSkeleton';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { route } from 'ziggy-js';

// Enable dayjs plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.extend(duration);

// --- Types ---
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
        max_score?: number;
        [key: string]: any;
    };
    class_id: number;
    subject_id: number;
    studentAssessment: {
        attempted_amount: number;
        score: number | null;
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

// const useServerTime = () => {
//     const [now, setNow] = useState<dayjs.Dayjs | null>(null);

//     useEffect(() => {
//         const fetchTime = async () => {
//             await new Promise((r) => setTimeout(r, 50));
//             setNow(dayjs.utc().tz('Asia/Phnom_Penh'));
//         };
//         fetchTime();
//     }, []);

//     useEffect(() => {
//         if (!now) return;
//         const timer = setInterval(() => {
//             setNow((prev) => (prev ? prev.add(1, 'second') : prev));
//         }, 1000);
//         return () => clearInterval(timer);
//     }, [!!now]); // Depend on the existence of now

//     return now;
// };
const useServerTime = () => {
    const [now, setNow] = useState<dayjs.Dayjs | null>(null);

    useEffect(() => {
        setNow(dayjs()); // use local time directly
    }, []);

    useEffect(() => {
        if (!now) return;
        const timer = setInterval(() => {
            setNow((prev) => (prev ? prev.add(1, 'second') : prev));
        }, 1000);
        return () => clearInterval(timer);
    }, [!!now]);

    return now;
};

export default function AssessmentConfirmPage({
    assessment,
    class_id,
    subject_id,
    studentAssessment,
    studentAssessmentAttempt,
}: DashboardProps) {
    const serverNow = useServerTime();

    // 1. Move logic calculation into useMemo and handle null serverNow
    const { logic, countdown } = useMemo(() => {
        if (!assessment || !serverNow) {
            return { logic: null, countdown: null };
        }

        const start = dayjs(assessment.start_time);
        const end = dayjs(assessment.end_time);

        const isBeforeStart = serverNow.isBefore(start);
        const isWithinTime =
            serverNow.isAfter(start) && serverNow.isBefore(end);
        const isEnded = serverNow.isAfter(end);

        const target = isBeforeStart ? start : end;
        const diff = target.diff(serverNow);
        const d = dayjs.duration(diff > 0 ? diff : 0);

        return {
            logic: { start, end, isBeforeStart, isWithinTime, isEnded },
            countdown: {
                days: Math.floor(d.asDays()),
                hours: d.hours(),
                minutes: d.minutes(),
                seconds: d.seconds(),
            },
        };
    }, [assessment, serverNow]);

    // 2. Early return for loading state (Must be after all Hooks)
    if (!serverNow || !logic) {
        return (
            <AppLayout breadcrumbs={[{ title: 'Assessments', href: '#' }]}>
                <div className="flex min-h-[80vh] items-center justify-center p-4">
                    <AssessmentSkeleton />
                </div>
            </AppLayout>
        );
    }

    // 3. Derived State
    const attemptsUsed = studentAssessment?.attempted_amount ?? 0;
    const maxAttempts = assessment.max_attempts ?? 0;
    const isCompleted = studentAssessmentAttempt?.status === 'completed';
    const hasScore =
        studentAssessment?.score !== null &&
        studentAssessment?.score !== undefined;

    const showResult = isCompleted || (hasScore && attemptsUsed > 0);
    const hasRemainingAttempts =
        maxAttempts === 0 || attemptsUsed < maxAttempts;
    const isResuming =
        studentAssessmentAttempt &&
        studentAssessmentAttempt.status !== 'completed';

    // logic is guaranteed to exist here due to early return above
    const canAttemptNow =
        !showResult &&
        logic.isWithinTime &&
        (hasRemainingAttempts || isResuming);

    const rawScore =
        studentAssessmentAttempt?.score ?? studentAssessment?.score ?? 0;
    const maxScore = assessment.max_score ?? 100;
    const scorePercentage = (rawScore / maxScore) * 100;
    const isPassing = scorePercentage >= 50;

    return (
        <AppLayout breadcrumbs={[{ title: 'Assessments', href: '#' }]}>
            <Head title={assessment.title} />

            <div className="flex min-h-[80vh] flex-col items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="w-full max-w-3xl"
                >
                    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
                        <div className="border-b border-gray-100 bg-gray-50/50 p-8 text-center dark:border-gray-700 dark:bg-gray-800/50">
                            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
                                {assessment.title}
                            </h1>
                            <p className="mt-3 text-lg text-gray-500 dark:text-gray-400">
                                {assessment.description ||
                                    'Please review the details below before starting.'}
                            </p>
                        </div>

                        <div className="p-8">
                            <AnimatePresence mode="wait">
                                {showResult ? (
                                    <motion.div
                                        key="result"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <AssessmentResultCard
                                            score={scorePercentage}
                                            maxScore={100}
                                            isPassing={isPassing}
                                            completedAt={
                                                studentAssessmentAttempt?.completed_at
                                            }
                                        />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="countdown"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        {countdown && !logic.isEnded && (
                                            <div className="mb-8 rounded-xl bg-blue-50/50 p-6 ring-1 ring-blue-100 dark:bg-blue-900/10 dark:ring-blue-800">
                                                <p className="mb-4 text-center text-xs font-bold tracking-widest text-blue-600 uppercase dark:text-blue-400">
                                                    {logic.isBeforeStart
                                                        ? 'Starting In'
                                                        : 'Time Remaining'}
                                                </p>
                                                <div className="flex justify-center gap-3 sm:gap-6">
                                                    {Object.entries(
                                                        countdown,
                                                    ).map(
                                                        ([unit, val]) =>
                                                            (unit !== 'days' ||
                                                                (val as number) >
                                                                    0) && (
                                                                <div
                                                                    key={unit}
                                                                    className="flex min-w-[70px] flex-col items-center rounded-lg bg-white p-3 shadow-sm ring-1 ring-gray-100 dark:bg-gray-700 dark:ring-gray-600"
                                                                >
                                                                    <span className="text-2xl font-bold text-gray-800 dark:text-white">
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
                                                            ),
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                                <InfoItem
                                    label="Type"
                                    value={assessment.type}
                                />
                                <InfoItem
                                    label="Duration"
                                    value={`${assessment.duration} min`}
                                />
                                <InfoItem
                                    label="Attempts"
                                    value={`${attemptsUsed} / ${maxAttempts === 0 ? '∞' : maxAttempts}`}
                                    highlight={hasRemainingAttempts}
                                />
                                <InfoItem
                                    label="Status"
                                    value={showResult ? 'Completed' : 'Pending'}
                                    className={
                                        showResult
                                            ? 'bg-green-50 text-green-600 dark:bg-green-900/20'
                                            : ''
                                    }
                                />
                            </div>

                            <div className="mt-8 space-y-3">
                                {canAttemptNow ? (
                                    <Link
                                        href={route(
                                            'student.classes.subjects.assessments.request',
                                            {
                                                class_id,
                                                subject_id,
                                                assessment_id: assessment.id,
                                                student_assessment_attempt_id:
                                                    studentAssessmentAttempt?.id ??
                                                    null,
                                            },
                                        )}
                                        method="post"
                                        as="button"
                                        className="relative w-full overflow-hidden rounded-xl bg-blue-600 py-4 text-lg font-bold text-white shadow-lg shadow-blue-200 transition-all hover:translate-y-[-2px] hover:bg-blue-700 hover:shadow-xl dark:shadow-none"
                                    >
                                        {isResuming
                                            ? 'Resume Assessment'
                                            : 'Start Assessment'}
                                    </Link>
                                ) : !showResult ? (
                                    <div className="w-full rounded-xl bg-gray-100 py-4 text-center font-medium text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                                        {logic.isBeforeStart
                                            ? 'Please wait for start time'
                                            : 'Assessment Unavailable'}
                                    </div>
                                ) : null}

                                {studentAssessmentAttempt?.id && showResult && (
                                    <Link
                                        href={route(
                                            'student.classes.subjects.assessments.attempt.review',
                                            {
                                                class_id,
                                                subject_id,
                                                assessment_id: assessment.id,
                                                student_assessment_attempt_id:
                                                    studentAssessmentAttempt.id,
                                            },
                                        )}
                                        className="flex w-full items-center justify-center rounded-xl border border-gray-200 bg-white py-3.5 font-semibold text-gray-700 transition-colors hover:bg-gray-50 hover:text-blue-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                    >
                                        Review Answers
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AppLayout>
    );
}

const InfoItem = ({
    label,
    value,
    highlight,
    className,
}: {
    label: string;
    value: string;
    highlight?: boolean;
    className?: string;
}) => (
    <div
        className={`flex flex-col items-center justify-center rounded-xl bg-gray-50 p-4 transition-colors dark:bg-gray-700/50 ${className}`}
    >
        <span className="mb-1 text-[10px] font-bold tracking-wider text-gray-400 uppercase">
            {label}
        </span>
        <span
            className={`font-bold ${highlight ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}
        >
            {value}
        </span>
    </div>
);
