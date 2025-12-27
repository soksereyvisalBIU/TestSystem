import { AssessmentStatus } from '@/types/student/confirm';
import { Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Play, PlusCircle, Loader2 } from 'lucide-react';
import { route } from 'ziggy-js';

interface ActionButtonsProps {
    currentStatus: AssessmentStatus;
    classId: number;
    subjectId: number;
    assessmentId: number;
    attemptId?: number;
    attemptStatus?: string | null;
}

export const ActionButtons = ({
    currentStatus,
    classId,
    subjectId,
    assessmentId,
    attemptId,
    attemptStatus,
}: ActionButtonsProps) => {
    // Inertia form hook to track processing state
    const { processing } = useForm();

    const isResume = currentStatus === 'RESUME';
    const isNewAttempt = attemptStatus === 'submitted' && currentStatus === 'ACTIVE';
    const isPrimaryActive = currentStatus === 'ACTIVE' || isResume;

    // Define the primary button styles to keep the JSX clean
    const primaryStyles = isResume
        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-200 dark:shadow-blue-900/20"
        : isNewAttempt
        ? "border-2 border-dashed border-blue-500 bg-blue-50/50 text-blue-700 dark:bg-blue-900/10 dark:text-blue-400"
        : "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-emerald-200 dark:shadow-emerald-900/20";

    return (
        <div className="mt-2 space-y-4">
            {/* Start/Resume Assessment Button */}
            {isPrimaryActive && (
                <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Link
                        href={route('student.classes.subjects.assessments.request', {
                            class_id: classId,
                            subject_id: subjectId,
                            assessment_id: assessmentId,
                            student_assessment_attempt_id: attemptId ?? null,
                        })}
                        method="post"
                        as="button"
                        disabled={processing}
                        className={`group relative flex w-full items-center justify-center gap-3 rounded-2xl py-5 text-xl font-bold tracking-tight transition-all hover:shadow-2xl disabled:opacity-70 ${primaryStyles}`}
                    >
                        {processing ? (
                            <Loader2 className="h-6 w-6 animate-spin" />
                        ) : isResume ? (
                            <>
                                <Play className="h-6 w-6 fill-current" />
                                <span>Continue Assessment</span>
                            </>
                        ) : isNewAttempt ? (
                            <>
                                <PlusCircle className="h-6 w-6 transition-transform group-hover:rotate-90" />
                                <span>Start New Attempt</span>
                            </>
                        ) : (
                            <>
                                <span>Begin Assessment</span>
                                <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
                            </>
                        )}
                        
                        {/* Subtle inner glow for depth */}
                        <div className="absolute inset-0 rounded-2xl border border-white/20 pointer-events-none" />
                    </Link>
                </motion.div>
            )}

            {/* Review Answers Button (Secondary Action) */}
            {currentStatus === 'GRADED' && attemptId && (
                <motion.div whileHover={{ y: -2 }}>
                    <Link
                        href={route('student.classes.subjects.assessments.attempt.review', {
                            class_id: classId,
                            subject_id: subjectId,
                            assessment_id: assessmentId,
                            student_assessment_attempt_id: attemptId,
                        })}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white/50 py-4 text-lg font-semibold text-gray-700 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:text-blue-600 hover:shadow-md dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-300 dark:hover:text-blue-400"
                    >
                        <CheckCircle2 className="h-5 w-5" /> 
                        Review My Performance
                    </Link>
                </motion.div>
            )}

            {/* Navigation Footer */}
            <div className="flex items-center justify-center pt-2">
                <Link
                    href={route('student.classes.show', classId)}
                    className="group flex items-center gap-2 text-sm font-medium text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
                >
                    <div className="h-px w-4 bg-gray-300 transition-all group-hover:w-8 dark:bg-gray-600" />
                    Exit to Classroom
                </Link>
            </div>
        </div>
    );
};