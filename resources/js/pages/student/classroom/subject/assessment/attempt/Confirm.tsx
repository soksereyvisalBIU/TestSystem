// pages/AssessmentConfirmPage.tsx
import { AssessmentSkeleton } from '@/components/student/confirm/AssessmentSkeleton';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import dayjs from 'dayjs';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActionButtons } from './Confirm/ActionButtons';
import { AssessmentHeader } from './Confirm/AssessmentHeader';
import { getAssessmentStatus } from './Confirm/assessmentStatus';
import { AssessmentStatusContent } from './Confirm/AssessmentStatusContent';
import { InfoGrid } from './Confirm/InfoGrid';
import type { DashboardProps } from './Confirm/types';

import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.extend(duration);

export default function AssessmentConfirmPage({
    assessment,
    class_id,
    subject_id,
    studentAssessment,
    studentAssessmentAttempt,
}: DashboardProps) {
    const [now, setNow] = useState<dayjs.Dayjs | null>(null);

    useEffect(() => {
        setNow(dayjs());
        // Auto-refresh every minute to keep timers/status accurate
        const interval = setInterval(() => setNow(dayjs()), 60000);
        return () => clearInterval(interval);
    }, []);

    const currentStatus = useMemo(() => {
        if (!now) return null;
        return getAssessmentStatus(now, assessment, studentAssessment, studentAssessmentAttempt);
    }, [now, assessment, studentAssessment, studentAssessmentAttempt]);

    const handleRefresh = useCallback(() => setNow(dayjs()), []);

    if (!now || !currentStatus) {
        return (
            <AppLayout breadcrumbs={[{ title: 'Assessments', href: '#' }]}>
                <div className="flex min-h-[80vh] items-center justify-center p-4">
                    <AssessmentSkeleton />
                </div>
            </AppLayout>
        );
    }

    // Dynamic background glow based on status
    const statusColors: Record<string, string> = {
        ACTIVE: 'from-emerald-500/10 via-transparent to-transparent',
        UPCOMING: 'from-amber-500/10 via-transparent to-transparent',
        COMPLETED: 'from-blue-500/10 via-transparent to-transparent',
        EXPIRED: 'from-red-500/10 via-transparent to-transparent',
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Assessments', href: '#' }]}>
            <Head title={assessment.title} />

            <div className={`relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-4 py-12 transition-colors duration-1000 bg-gradient-to-br ${statusColors[currentStatus] || ''}`}>
                
                {/* Decorative background elements */}
                <div className="absolute top-0 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]" />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 120 }}
                    className="relative w-full max-w-2xl"
                >
                    <div className="group overflow-hidden rounded-[2.5rem] border border-white/20 bg-white/80 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] backdrop-blur-xl dark:border-gray-700/50 dark:bg-gray-900/80">
                        
                        {/* Interactive Header Section */}
                        <div className="relative overflow-hidden bg-gray-50/50 p-1 dark:bg-gray-800/50">
                             <AssessmentHeader
                                title={assessment.title}
                                description={assessment.description}
                            />
                        </div>

                        <div className="space-y-2 p-8 sm:p-8 sm:pt-2">
                            {/* Status Section with scale effect */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentStatus}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.05 }}
                                    transition={{ duration: 0.3 }}
                                    className="relative z-10"
                                >
                                    <AssessmentStatusContent
                                        currentStatus={currentStatus}
                                        assessment={assessment}
                                        studentAssessment={studentAssessment}
                                        studentAssessmentAttempt={studentAssessmentAttempt}
                                        onTimerZero={handleRefresh}
                                    />
                                </motion.div>
                            </AnimatePresence>

                            {/* Separator with dynamic width */}
                            <div className="relative ">
                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                    <div className="w-full border-t border-gray-100 dark:border-gray-800" />
                                </div>
                                <div className="relative flex justify-center">
                                    <span className="bg-white px-3 text-xs font-medium uppercase tracking-widest text-gray-400 dark:bg-gray-900">
                                        Details
                                    </span>
                                </div>
                            </div>

                            {/* Information Grid with improved spacing */}
                            <div className="rounded-2xl bg-gray-50/50 p-4  dark:bg-gray-800/30">
                                <InfoGrid
                                    assessment={assessment}
                                    attemptsUsed={studentAssessment?.attempted_amount ?? 0}
                                    highlightAttempts={currentStatus === 'ACTIVE'}
                                />
                            </div>

                            {/* Primary Actions with emphasis */}
                            <motion.div 
                                layout
                                // className="pt-2"
                            >
                                <ActionButtons
                                    currentStatus={currentStatus}
                                    classId={class_id}
                                    subjectId={subject_id}
                                    assessmentId={assessment.id}
                                    attemptId={studentAssessmentAttempt?.id}
                                    attemptStatus={studentAssessmentAttempt?.status}
                                />
                            </motion.div>
                        </div>
                    </div>

                    {/* Footer Hint */}
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400"
                    >
                        Make sure you have a stable internet connection before starting.
                    </motion.p>
                </motion.div>
            </div>
        </AppLayout>
    );
}