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
import {
    AlertCircle,
    ArrowRight,
    CheckCircle2,
    Clock,
    FileCheck,
    Play,
    PlusCircle,
} from 'lucide-react';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { route } from 'ziggy-js';

// --- Configuration ---
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.extend(duration);

// --- Types ---
interface Assessment {
    id: number;
    title: string;
    description: string | null;
    type: string;
    start_time: string;
    end_time: string;
    duration: number;
    max_attempts: number; // 0 = unlimited
    max_score?: number;
}

interface StudentAssessment {
    score: number | null;
    status: string;
    attempted_amount: number;
}

interface AssessmentAttempt {
    id: number;
    status: 'draft' | 'submitted' | 'graded' | string | null;
    score?: number;
    completed_at?: string;
}

interface DashboardProps {
    assessment: Assessment;
    class_id: number;
    subject_id: number;
    studentAssessment: StudentAssessment | null;
    studentAssessmentAttempt: AssessmentAttempt | null;
}

type AssessmentStatus =
    | 'LOADING'
    | 'UPCOMING'
    | 'ACTIVE'
    | 'EXPIRED'
    | 'RESUME'
    | 'PENDING_GRADING'
    | 'GRADED'
    | 'NO_ATTEMPTS_LEFT';

// --- Reusable Sub-Components ---

const AssessmentHeader = memo(
    ({ title, description }: { title: string; description: string | null }) => (
        <div className="border-b border-gray-100 bg-gray-50/80 p-8 text-center backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/80">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-md ring-1 ring-gray-100 dark:bg-gray-700 dark:ring-gray-600">
                <FileCheck className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                {title}
            </h1>
            {description && (
                <p className="mx-auto mt-3 max-w-lg text-base text-gray-500 dark:text-gray-400">
                    {description}
                </p>
            )}
        </div>
    ),
);

const InfoItem = ({
    label,
    value,
    highlight,
}: {
    label: string;
    value: string;
    highlight?: boolean;
}) => (
    <div className="flex flex-col items-center justify-center rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
        <span className="mb-1 text-[10px] font-bold tracking-wider text-gray-400 uppercase">
            {label}
        </span>
        <span
            className={`text-sm font-bold ${highlight ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'}`}
        >
            {value}
        </span>
    </div>
);

const InfoGrid = memo(
    ({
        assessment,
        attemptsUsed,
        highlightAttempts,
    }: {
        assessment: Assessment;
        attemptsUsed: number;
        highlightAttempts: boolean;
    }) => (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <InfoItem label="Format" value={assessment.type} />
            <InfoItem label="Duration" value={`${assessment.duration} min`} />
            <InfoItem
                label="Attempts"
                value={`${attemptsUsed} / ${assessment.max_attempts === 0 ? '∞' : assessment.max_attempts}`}
                highlight={highlightAttempts}
            />
        </div>
    ),
);

const CountdownTimer = memo(
    ({
        targetDate,
        label,
        onZero,
    }: {
        targetDate: string;
        label: string;
        onZero?: () => void;
    }) => {
        const [timeLeft, setTimeLeft] = useState<dayjs.Duration | null>(null);

        useEffect(() => {
            const tick = () => {
                const diff = dayjs(targetDate).diff(dayjs());
                if (diff <= 0) {
                    setTimeLeft(dayjs.duration(0));
                    onZero?.();
                    return;
                }
                setTimeLeft(dayjs.duration(diff));
            };
            tick();
            const interval = setInterval(tick, 1000);
            return () => clearInterval(interval);
        }, [targetDate, onZero]);

        if (!timeLeft || timeLeft.asSeconds() <= 0) return null;

        const units = [
            { label: 'Days', value: Math.floor(timeLeft.asDays()) },
            { label: 'Hrs', value: timeLeft.hours() },
            { label: 'Min', value: timeLeft.minutes() },
            { label: 'Sec', value: timeLeft.seconds() },
        ];

        return (
            <div className="mb-6">
                {/* <p className="mb-4 text-center text-xs font-bold tracking-widest text-blue-600 uppercase dark:text-blue-400">
                    {label}
                </p> */}
                <div className="flex justify-center gap-3">
                    {units.map(
                        (unit) =>
                            (unit.label !== 'Days' || unit.value > 0) && (
                                <div
                                    key={unit.label}
                                    className="flex min-w-[64px] flex-col items-center rounded-xl border border-gray-100 bg-white p-2 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                                >
                                    <span className="font-mono text-xl font-bold text-gray-900 dark:text-white">
                                        {String(unit.value).padStart(2, '0')}
                                    </span>
                                    <span className="text-[9px] font-bold text-gray-400 uppercase">
                                        {unit.label}
                                    </span>
                                </div>
                            ),
                    )}
                </div>
            </div>
        );
    },
);

// --- Main Logic Helper ---

const getAssessmentStatus = (
    now: dayjs.Dayjs,
    assessment: Assessment,
    summary: StudentAssessment | null,
    attempt: AssessmentAttempt | null,
): AssessmentStatus => {
    if (!now) return 'LOADING';

    const start = dayjs(assessment.start_time);
    const end = dayjs(assessment.end_time);
    const attemptsUsed = summary?.attempted_amount ?? 0;
    const maxAttempts = assessment.max_attempts;
    const hasAttemptsLeft = maxAttempts === 0 || attemptsUsed < maxAttempts;

    // 1. Resume Draft (High priority)
    if (attempt?.status === 'draft') return 'RESUME';

    // 2. Time Gates
    if (now.isBefore(start)) return 'UPCOMING';
    if (now.isAfter(end)) return 'EXPIRED';

    // 3. Active Check: If user has attempts left, they can start another even if one is pending/graded
    if (hasAttemptsLeft) return 'ACTIVE';

    // 4. No attempts left: Determine if they are waiting for grades or finished
    if (attempt?.status === 'submitted' && attempt.score === undefined)
        return 'PENDING_GRADING';
    if (summary?.status === 'scored' || attempt?.status === 'graded')
        return 'GRADED';

    return 'NO_ATTEMPTS_LEFT';
};

// --- Main Component ---

export default function AssessmentConfirmPage({
    assessment,
    class_id,
    subject_id,
    studentAssessment,
    studentAssessmentAttempt,
}: DashboardProps) {
    const [now, setNow] = useState<dayjs.Dayjs | null>(null);
    useEffect(() => setNow(dayjs()), []);

    const currentStatus = useMemo(
        () =>
            getAssessmentStatus(
                now!,
                assessment,
                studentAssessment,
                studentAssessmentAttempt,
            ),
        [now, assessment, studentAssessment, studentAssessmentAttempt],
    );

    const handleRefresh = useCallback(() => setNow(dayjs()), []);

    if (!now)
        return (
            <AppLayout breadcrumbs={[{ title: 'Assessments', href: '#' }]}>
                <div className="flex min-h-[80vh] items-center justify-center p-4">
                    <AssessmentSkeleton />
                </div>
            </AppLayout>
        );

    const renderStatusContent = () => {
        switch (currentStatus) {
            case 'UPCOMING':
                return (
                    <CountdownTimer
                        targetDate={assessment.start_time}
                        label="Starts In"
                        onZero={handleRefresh}
                    />
                );

            case 'PENDING_GRADING':
                return (
                    <div className="flex flex-col items-center rounded-2xl bg-amber-50 p-6 text-center ring-1 ring-amber-100 dark:bg-amber-900/10 dark:ring-amber-800">
                        <Clock className="mb-3 h-8 w-8 text-amber-600" />
                        <h3 className="font-bold text-gray-900 dark:text-white">
                            Submission Under Review
                        </h3>
                        <p className="text-xs text-gray-500">
                            You have used all available attempts. Waiting for
                            teacher grading.
                        </p>
                    </div>
                );

            case 'GRADED':
                const score =
                    studentAssessmentAttempt?.score ??
                    studentAssessment?.score ??
                    0;
                const pct = (score / (assessment.max_score ?? 100)) * 100;
                return (
                    <AssessmentResultCard
                        score={pct}
                        maxScore={100}
                        isPassing={pct >= 50}
                        completedAt={studentAssessmentAttempt?.completed_at}
                    />
                );

            case 'EXPIRED':
                return (
                    <div className="flex flex-col items-center justify-center rounded-xl bg-gray-50 py-8 dark:bg-gray-800/50">
                        <AlertCircle className="mb-2 h-8 w-8 text-gray-400" />
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                            Deadline Passed
                        </h4>
                        <p className="text-xs text-gray-500">
                            This assessment is no longer accepting submissions.
                        </p>
                    </div>
                );

            case 'ACTIVE':
            case 'RESUME':
                return (
                    <>
                        {/* Notice if they have a pending attempt but can still try again */}
                        {studentAssessmentAttempt?.status === 'submitted' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center rounded-2xl bg-amber-50 p-8 text-center ring-1 ring-amber-100 dark:bg-amber-900/10 dark:ring-amber-800"
                            >
                                <div className="mb-4 rounded-full bg-amber-100 p-3 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                                    <Clock className="h-8 w-8" />
                                </div>
                                <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                                    Submission Under Review
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Your assessment has been submitted
                                    successfully. Scores will be available once
                                    the teacher completes grading.
                                </p>
                                {/* <div className="mb-6 flex items-center gap-3 rounded-lg border border-blue-100 bg-blue-50/50 p-3 dark:border-blue-900/30 dark:bg-blue-900/10">
                                    <Clock className="h-4 w-4 text-blue-600" />
                                    <p className="text-xs font-medium text-blue-700 dark:text-blue-400">
                                        Previous attempt submitted. You may
                                        start a new attempt.
                                    </p>
                                </div> */}
                            </motion.div>
                        )}
                        <CountdownTimer
                            targetDate={assessment.end_time}
                            label="Closing In"
                            onZero={handleRefresh}
                        />
                    </>
                );

            default:
                return null;
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Assessments', href: '#' }]}>
            <Head title={assessment.title} />

            <div className="flex min-h-[85vh] flex-col items-center justify-center p-4 md:p-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-2xl"
                >
                    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-800">
                        <AssessmentHeader
                            title={assessment.title}
                            description={assessment.description}
                        />

                        <div className="p-6 sm:p-10">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentStatus}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    {renderStatusContent()}
                                </motion.div>
                            </AnimatePresence>

                            <InfoGrid
                                assessment={assessment}
                                attemptsUsed={
                                    studentAssessment?.attempted_amount ?? 0
                                }
                                highlightAttempts={currentStatus === 'ACTIVE'}
                            />

                            <div className="mt-10 space-y-4">
                                {/* ... inside the mt-10 space-y-4 div ... */}

                                {(currentStatus === 'ACTIVE' ||
                                    currentStatus === 'RESUME') && (
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
                                        className={`group flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-lg font-bold transition-all hover:shadow-lg ${
                                            currentStatus === 'RESUME'
                                                ? 'bg-blue-600 text-white hover:bg-blue-700' // Resume Style
                                                : studentAssessmentAttempt?.status ===
                                                    'submitted'
                                                  ? 'border-2 border-blue-600 bg-transparent text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10' // "Start Another" Style
                                                  : 'bg-blue-600 text-white hover:bg-blue-700' // First Attempt Style
                                        }`}
                                    >
                                        {currentStatus === 'RESUME' ? (
                                            <>
                                                <Play className="h-5 w-5 fill-current" />
                                                Resume Attempt
                                            </>
                                        ) : studentAssessmentAttempt?.status ===
                                          'submitted' ? (
                                            <>
                                                Start New Attempt
                                                <PlusCircle className="h-5 w-5 transition-transform group-hover:rotate-90" />
                                            </>
                                        ) : (
                                            <>
                                                Start Assessment
                                                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                            </>
                                        )}
                                    </Link>
                                )}

                                {currentStatus === 'GRADED' &&
                                    studentAssessmentAttempt?.id && (
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
                                            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white py-4 font-bold text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                                        >
                                            <CheckCircle2 className="h-5 w-5" />{' '}
                                            Review Answers
                                        </Link>
                                    )}

                                <div className="text-center">
                                    <Link
                                        href={route(
                                            'student.classes.show',
                                            class_id,
                                        )}
                                        className="text-sm font-medium text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    >
                                        Back to Classroom
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AppLayout>
    );
}
