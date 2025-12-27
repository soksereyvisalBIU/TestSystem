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
    
    // Animation variant for content entrance
    const containerVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
    };

    const renderContent = () => {
        switch (currentStatus) {
            case 'UPCOMING':
                return (
                    <div className="rounded-3xl bg-amber-50/30 p-2 dark:bg-amber-900/5">
                        <CountdownTimer
                            targetDate={assessment.start_time}
                            label="Assessment Starts In"
                            onZero={onTimerZero}
                            variant="upcoming" // You can pass variants to your timer for different colors
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
                    <div className="space-y-6">
                        {hasPreviousAttempt && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <SubmittedNoticeCard />
                            </motion.div>
                        )}
                        <div className="relative overflow-hidden rounded-3xl bg-blue-50/50 p-1 dark:bg-blue-900/10">
                            <CountdownTimer
                                targetDate={assessment.end_time}
                                label="Time Remaining to Join"
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