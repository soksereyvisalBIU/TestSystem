import { AlertCircle, Clock, CheckCircle2, Hourglass, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * PENDING_GRADING: Used when the student has finished everything 
 * and is just waiting for the human element (the teacher).
 */
export const PendingGradingCard = () => (
    <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2rem] border border-amber-100 bg-gradient-to-b from-amber-50/50 to-white p-8 text-center dark:border-amber-900/30 dark:from-amber-900/10 dark:to-gray-900"
    >
        <motion.div 
            animate={{ scale: [1, 1.05, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-500"
        >
            <Hourglass className="h-8 w-8" />
        </motion.div>
        
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Awaiting Teacher Review</h3>
        <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            Great job! You've completed your attempts. Your final grade will appear here once your instructor finishes grading.
        </p>
    </motion.div>
);

/**
 * EXPIRED: Used when the window has closed. 
 * Needs to look "disabled" but clear.
 */
export const ExpiredCard = () => (
    <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-gray-200 bg-gray-50/50 py-12 px-6 text-center dark:border-gray-700 dark:bg-gray-800/30">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <ShieldAlert className="h-7 w-7 text-gray-400" />
        </div>
        <h4 className="text-lg font-bold text-gray-900 dark:text-white">Assessment Closed</h4>
        <p className="mt-2 max-w-xs text-sm text-gray-500 dark:text-gray-400">
            The deadline for this assessment passed on the scheduled date. Access is no longer available.
        </p>
    </div>
);

/**
 * SUBMITTED_NOTICE: A smaller "Toast-style" card that appears 
 * alongside the timer if a new attempt is still possible.
 */
export const SubmittedNoticeCard = () => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-4 rounded-2xl border border-blue-100 bg-blue-50/50 p-4 text-left dark:border-blue-900/30 dark:bg-blue-900/10"
    >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
            <CheckCircle2 className="h-6 w-6" />
        </div>
        <div className="space-y-1">
            <h3 className="text-sm font-bold text-blue-900 dark:text-blue-300">
                Attempt Received
            </h3>
            <p className="text-xs text-blue-700/70 dark:text-blue-400/70">
                Your previous answers are safe. You can still use remaining attempts until the deadline.
            </p>
        </div>
    </motion.div>
);