// components/student/confirm/AssessmentStatusContent.tsx
import { AssessmentResultCard } from '@/components/student/confirm/AssessmentResultCard';
import { ExpiredCard, PendingGradingCard, SubmittedNoticeCard } from './StatusCards';
import type { Assessment, AssessmentAttempt, AssessmentStatus, StudentAssessment } from '@/types/student/confirm';
import { CountdownTimer } from './CountdownTimer';
import { motion } from 'framer-motion';

interface AssessmentStatusContentProps {
    currentStatus: AssessmentStatus;
    assessment: Assessment;
    studentAssessment: StudentAssessment | null;
    studentAssessmentAttempt: AssessmentAttempt | null;
    onTimerZero: () => void;
}

export const AssessmentStatusContent = ({
    currentStatus,
    assessment,
    studentAssessment,
    studentAssessmentAttempt,
    onTimerZero,
}: AssessmentStatusContentProps) => {
    
    const containerVariants = {
        hidden: { opacity: 0, y: 5 }, // Reduced y offset for faster-feeling load
        visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } }
    };

    const renderContent = () => {
        switch (currentStatus) {
            case 'UPCOMING':
                return (
                    /* UX Fix: Reduced padding and smaller radius on mobile */
                    <div className="rounded-2xl bg-amber-50/30 p-1 dark:bg-amber-900/5 sm:rounded-3xl sm:p-2">
                        <CountdownTimer
                            targetDate={assessment.start_time}
                            label="Starts In" // Shortened label for XS
                            onZero={onTimerZero}
                            variant="upcoming"
                        />
                    </div>
                );

            case 'PENDING_GRADING':
                return <PendingGradingCard />;

            case 'GRADED': {
                const score = studentAssessmentAttempt?.score ?? studentAssessment?.score ?? 0;
                const maxScore = assessment.max_score ?? 100;
                const percentage = (score / maxScore) * 100;
                
                return (
                    <AssessmentResultCard
                        score={percentage}
                        maxScore={100}
                        isPassing={percentage >= 50}
                        completedAt={studentAssessmentAttempt?.completed_at || studentAssessment?.updated_at}
                    />
                );
            }

            case 'EXPIRED':
                return <ExpiredCard />;

            case 'ACTIVE':
            case 'RESUME':
                const hasPreviousAttempt = studentAssessmentAttempt?.status === 'submitted' || (studentAssessment?.attempted_amount ?? 0) > 0;
                
                return (
                    /* UX Fix: space-y-3 instead of space-y-6 to bring buttons up */
                    <div className="space-y-3 sm:space-y-6">
                        {hasPreviousAttempt && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <SubmittedNoticeCard />
                            </motion.div>
                        )}
                        <div className="relative overflow-hidden rounded-2xl bg-blue-50/50 p-1 dark:bg-blue-900/10 sm:rounded-3xl">
                            <CountdownTimer
                                targetDate={assessment.end_time}
                                label="Join Period Ends" // More concise label
                                onZero={onTimerZero}
                                variant="active"
                            />
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full"
        >
            {renderContent()}
        </motion.div>
    );
};