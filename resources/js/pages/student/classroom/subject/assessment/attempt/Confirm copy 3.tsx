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
import { AlertCircle, ArrowRight, CheckCircle2, Clock, FileCheck, Play } from 'lucide-react';
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
    duration: number; // in minutes
    max_attempts: number; // 0 = unlimited
    max_score?: number;
}

interface StudentAssessment {
    score: number | null;
    status: string; // 'enrolled', 'scored', etc.
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

// --- Logic Helpers ---

/**
 * pure function to determine the exact state of the UI
 */
const getAssessmentStatus = (
    now: dayjs.Dayjs,
    assessment: Assessment,
    summary: StudentAssessment | null,
    attempt: AssessmentAttempt | null
): AssessmentStatus => {
    if (!now) return 'LOADING';

    const start = dayjs(assessment.start_time);
    const end = dayjs(assessment.end_time);
    
    // 1. Check Specific Attempt Status first
    if (attempt?.status === 'submitted' && attempt.score === undefined) return 'PENDING_GRADING';
    if (attempt?.status === 'draft') return 'RESUME';
    
    // 2. Check Aggregate Status (if graded previously)
    // We check this before time limits because a student can view results after expiration
    const hasScore = attempt?.score !== undefined || summary?.score !== null;
    if (hasScore && (summary?.status === 'scored' || attempt?.status === 'graded')) {
        return 'GRADED';
    }

    // 3. Time Gates
    if (now.isBefore(start)) return 'UPCOMING';
    if (now.isAfter(end)) return 'EXPIRED';

    // 4. Attempt Limits
    const attemptsUsed = summary?.attempted_amount ?? 0;
    const maxAttempts = assessment.max_attempts;
    if (maxAttempts > 0 && attemptsUsed >= maxAttempts) {
        return 'NO_ATTEMPTS_LEFT';
    }

    // 5. Default to Active (Ready to Start)
    return 'ACTIVE';
};

// --- Sub-Components (Performance Optimization) ---

/**
 * Isolated Countdown Component
 * Prevents the entire parent page from re-rendering every second.
 */
const CountdownTimer = memo(({ targetDate, label, onZero }: { targetDate: string, label: string, onZero?: () => void }) => {
    const [timeLeft, setTimeLeft] = useState<dayjs.Duration | null>(null);

    useEffect(() => {
        const target = dayjs(targetDate);
        
        const tick = () => {
            const now = dayjs();
            const diff = target.diff(now);

            if (diff <= 0) {
                setTimeLeft(dayjs.duration(0));
                if (onZero) onZero();
                return;
            }
            setTimeLeft(dayjs.duration(diff));
        };

        tick(); // Immediate tick
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [targetDate, onZero]);

    if (!timeLeft || timeLeft.asSeconds() <= 0) return null;

    const units = [
        { label: 'Days', value: Math.floor(timeLeft.asDays()) },
        { label: 'Hours', value: timeLeft.hours() },
        { label: 'Minutes', value: timeLeft.minutes() },
        { label: 'Seconds', value: timeLeft.seconds() },
    ];

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
        >
            <p className="mb-4 text-center text-xs font-bold tracking-widest text-blue-600 uppercase dark:text-blue-400">
                {label}
            </p>
            <div className="flex justify-center gap-3 sm:gap-4">
                {units.map((unit) => (
                    (unit.label !== 'Days' || unit.value > 0) && (
                        <div key={unit.label} className="flex min-w-[72px] flex-col items-center rounded-xl border border-gray-100 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <span className="font-mono text-2xl font-bold text-gray-900 dark:text-white">
                                {String(unit.value).padStart(2, '0')}
                            </span>
                            <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                                {unit.label}
                            </span>
                        </div>
                    )
                ))}
            </div>
        </motion.div>
    );
});

const InfoGrid = memo(({ assessment, attemptsUsed, highlightAttempts }: { assessment: Assessment, attemptsUsed: number, highlightAttempts: boolean }) => (
    <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <InfoItem label="Format" value={assessment.type} />
        <InfoItem label="Duration" value={`${assessment.duration} min`} />
        <InfoItem 
            label="Attempts" 
            value={`${attemptsUsed} / ${assessment.max_attempts === 0 ? '∞' : assessment.max_attempts}`}
            highlight={highlightAttempts}
        />
    </div>
));

const InfoItem = ({ label, value, highlight }: { label: string, value: string, highlight?: boolean }) => (
    <div className="flex flex-col items-center justify-center rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
        <span className="mb-1 text-[10px] font-bold tracking-wider text-gray-400 uppercase">{label}</span>
        <span className={`text-sm font-bold ${highlight ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'}`}>
            {value}
        </span>
    </div>
);

// --- Main Component ---

export default function AssessmentConfirmPage({
    assessment,
    class_id,
    subject_id,
    studentAssessment,
    studentAssessmentAttempt,
}: DashboardProps) {
    // We only need 'now' for the initial state calculation to avoid hydration mismatch.
    // Real-time updates are handled by the Countdown sub-component.
    const [now, setNow] = useState<dayjs.Dayjs | null>(null);

    useEffect(() => {
        setNow(dayjs());
    }, []);

    // Derived State
    const currentStatus = useMemo(() => 
        getAssessmentStatus(now!, assessment, studentAssessment, studentAssessmentAttempt), 
    [now, assessment, studentAssessment, studentAssessmentAttempt]);

    const attemptsUsed = studentAssessment?.attempted_amount ?? 0;
    
    // Callbacks
    const handleTimerExpire = useCallback(() => {
        // Trigger a re-evaluation of time
        setNow(dayjs());
    }, []);

    // --- Render Logic ---

    if (!now) {
        return (
            <AppLayout breadcrumbs={[{ title: 'Assessments', href: '#' }]}>
                <div className="flex min-h-[80vh] items-center justify-center p-4">
                    <AssessmentSkeleton />
                </div>
            </AppLayout>
        );
    }

    const renderMainContent = () => {
        switch (currentStatus) {
            case 'PENDING_GRADING':
                return (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center rounded-2xl bg-amber-50 p-8 text-center ring-1 ring-amber-100 dark:bg-amber-900/10 dark:ring-amber-800"
                    >
                        <div className="mb-4 rounded-full bg-amber-100 p-3 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                            <Clock className="h-8 w-8" />
                        </div>
                        <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">Submission Under Review</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Your assessment has been submitted successfully. Scores will be available once the teacher completes grading.
                        </p>
                    </motion.div>
                );

            case 'GRADED':
                const score = studentAssessmentAttempt?.score ?? studentAssessment?.score ?? 0;
                const maxScore = assessment.max_score ?? 100;
                const pct = (score / maxScore) * 100;
                
                return (
                    <AssessmentResultCard
                        score={pct}
                        maxScore={100}
                        isPassing={pct >= 50}
                        completedAt={studentAssessmentAttempt?.completed_at}
                    />
                );

            case 'UPCOMING':
                return (
                    <CountdownTimer 
                        targetDate={assessment.start_time} 
                        label="Assessment Starts In" 
                        onZero={handleTimerExpire}
                    />
                );

            case 'ACTIVE':
            case 'RESUME':
            case 'NO_ATTEMPTS_LEFT':
                // Show countdown to end time if active
                if (dayjs().isBefore(dayjs(assessment.end_time))) {
                    return (
                        <CountdownTimer 
                            targetDate={assessment.end_time} 
                            label="Time Remaining" 
                            onZero={handleTimerExpire}
                        />
                    );
                }
                return null;
                
            case 'EXPIRED':
                return (
                    <div className="mb-6 flex flex-col items-center justify-center rounded-xl bg-gray-100 py-8 text-center dark:bg-gray-800">
                         <div className="mb-3 rounded-full bg-gray-200 p-3 text-gray-500 dark:bg-gray-700">
                            <AlertCircle className="h-6 w-6" />
                        </div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">Assessment Closed</h4>
                        <p className="text-sm text-gray-500">The deadline for this assessment has passed.</p>
                    </div>
                );

            default:
                return null;
        }
    };

    const renderActionButton = () => {
        const canStart = currentStatus === 'ACTIVE';
        const canResume = currentStatus === 'RESUME';

        if (!canStart && !canResume) return null;

        return (
            <Link
                href={route('student.classes.subjects.assessments.request', {
                    class_id,
                    subject_id,
                    assessment_id: assessment.id,
                    student_assessment_attempt_id: studentAssessmentAttempt?.id ?? null,
                })}
                method="post"
                as="button"
                className="group relative w-full overflow-hidden rounded-xl bg-blue-600 py-4 text-lg font-bold text-white shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl dark:shadow-none"
            >
                <span className="flex items-center justify-center gap-2">
                    {canResume ? (
                        <>
                            <Play className="h-5 w-5 fill-current" /> Resume Attempt
                        </>
                    ) : (
                        <>
                            Start Assessment <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </>
                    )}
                </span>
            </Link>
        );
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Assessments', href: '#' }]}>
            <Head title={assessment.title} />

            <div className="flex min-h-[85vh] flex-col items-center justify-center p-4 md:p-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="w-full max-w-2xl"
                >
                    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
                        {/* Header */}
                        <div className="border-b border-gray-100 bg-gray-50/80 p-8 text-center backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/80">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-md ring-1 ring-gray-100 dark:bg-gray-700 dark:ring-gray-600">
                                <FileCheck className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                                {assessment.title}
                            </h1>
                            {assessment.description && (
                                <p className="mx-auto mt-3 max-w-lg text-base text-gray-500 dark:text-gray-400">
                                    {assessment.description}
                                </p>
                            )}
                        </div>

                        {/* Content Body */}
                        <div className="p-6 sm:p-8">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentStatus}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {renderMainContent()}
                                </motion.div>
                            </AnimatePresence>

                            {/* Meta Data Grid */}
                            <InfoGrid 
                                assessment={assessment} 
                                attemptsUsed={attemptsUsed} 
                                highlightAttempts={currentStatus === 'ACTIVE'}
                            />

                            {/* Action Buttons */}
                            <div className="mt-8 space-y-3">
                                {renderActionButton()}

                                {/* Review Button (Only if Graded) */}
                                {currentStatus === 'GRADED' && studentAssessmentAttempt?.id && (
                                    <Link
                                        href={route('student.classes.subjects.assessments.attempt.review', {
                                            class_id,
                                            subject_id,
                                            assessment_id: assessment.id,
                                            student_assessment_attempt_id: studentAssessmentAttempt.id,
                                        })}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3.5 font-semibold text-gray-700 transition-colors hover:bg-gray-50 hover:text-blue-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                    >
                                        <CheckCircle2 className="h-4 w-4" />
                                        Review Answers
                                    </Link>
                                )}
                                
                                <div className="mt-4 flex justify-center">
                                    <Link 
                                        href={route('student.classes.show', class_id)}
                                        className="text-sm font-medium text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
                                    >
                                        Cancel and return to class
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

