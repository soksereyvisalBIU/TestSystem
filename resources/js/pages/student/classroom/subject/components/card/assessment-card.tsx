import { Badge } from '@/components/ui/badge';
import { useCan } from '@/hooks/permission/useCan';
import { cn } from '@/lib/utils';
import { Assessment } from '@/types/student/assessment';
import { Link, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    AlertCircle,
    Calendar,
    CheckCircle2,
    ChevronRight,
    Clock,
    FileText,
    RefreshCcw,
    Target,
} from 'lucide-react';
import { useMemo } from 'react';
import { route } from 'ziggy-js';
import { getAssessmentStatusDetails } from '../get-assessment-status-detail';

interface AssessmentCardProps {
    assessment: Assessment;
    classId: number;
}

export function AssessmentCard({ assessment, classId }: AssessmentCardProps) {
    const { url } = usePage();
    const accessInstructorPage =
        useCan('access-instructor-page') && url.includes('/instructor');

    const studentData = assessment?.student_assessment;
    const isScored = studentData?.status === 'scored';
    const isSubmitted = studentData?.status === 'submitted';

    const now = new Date();
    const startTime = new Date(assessment.start_time);
    const endTime = new Date(assessment.end_time);

    const isUrgent = useMemo(() => {
        const isLive = now >= startTime && now <= endTime;
        const isInProgress = studentData?.status === 'in_progress';
        return (isInProgress || (!studentData?.status && isLive)) && !isSubmitted && !isScored;
    }, [now, startTime, endTime, studentData, isSubmitted, isScored]);

    const statusDetails = getAssessmentStatusDetails(assessment);

    const assessmentRoute = route(
        accessInstructorPage
            ? 'instructor.classes.subjects.assessments.show'
            : 'student.classes.subjects.assessments.show',
        [classId, assessment.pivot.subject_id, assessment.id],
    );

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            className="group relative"
        >
            <Link href={assessmentRoute} className="absolute inset-0 z-30 cursor-pointer" />

            {/* URGENT INDICATOR */}
            <AnimatePresence>
                {isUrgent && (
                    <div className="absolute z-50 -top-2 -right-2 flex h-8 w-8 items-center justify-center">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-40" />
                        <div className="relative flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground shadow-lg">
                            <span className="text-[10px] font-black">!</span>
                        </div>
                    </div>
                )}
            </AnimatePresence>

            {/* BORDER WRAPPER */}
            <div
                className={cn(
                    'relative z-10 overflow-hidden rounded-2xl p-[2px] transition-all duration-500',
                    isUrgent 
                        ? 'animate-border-loop bg-[conic-gradient(from_var(--border-angle),transparent_70%,theme(colors.primary.DEFAULT))] shadow-md shadow-primary/20' 
                        : 'bg-border/60 hover:bg-primary/30'
                )}
            >
                {/* MAIN CARD CONTENT */}
                <div className={cn("flex flex-col items-start justify-between rounded-[calc(1rem-1.5px)] bg-card p-5 sm:flex-row sm:items-center relative z-20 h-full w-full" , isScored
                                    ? 'border-2 border-success/30 ' : '')}>
                    
                    {/* LEFT SECTION */}
                    <div className="flex w-full items-center gap-5 sm:w-auto">
                        <div
                            className={cn(
                                'flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-all duration-500 group-hover:scale-105 group-hover:rotate-6',
                                isScored
                                    ? 'bg-success/10 text-success'
                                    : isSubmitted
                                      ? 'bg-primary/10 text-primary'
                                      : isUrgent
                                        ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/30'
                                        : 'bg-muted text-muted-foreground'
                            )}
                        >
                            {isScored || isSubmitted ? (
                                <CheckCircle2 className="h-7 w-7" />
                            ) : assessment.type === 'exam' ? (
                                <Target className="h-7 w-7" />
                            ) : (
                                <FileText className="h-7 w-7" />
                            )}
                        </div>

                        <div className="flex flex-col gap-1 overflow-hidden">
                            <h4 className="truncate text-base font-bold tracking-tight text-title transition-colors group-hover:text-primary">
                                {assessment.title}
                            </h4>

                            <div className="flex flex-wrap items-center gap-2">
                                <Badge
                                    variant="secondary"
                                    className={cn('rounded-md px-2 py-0 text-[10px] font-bold', statusDetails.badgeColorClass)}
                                >
                                    {statusDetails.label}
                                </Badge>

                                <div className="flex items-center gap-3 text-[11px] font-medium text-description">
                                    {assessment.max_attempts > 0 && (
                                        <span className="flex items-center gap-1">
                                            <RefreshCcw className="h-3 w-3" />
                                            {studentData?.attempted_amount || 0}/{assessment.max_attempts}
                                        </span>
                                    )}
                                    <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {assessment.duration}m
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SECTION */}
                    <div className="mt-4 flex w-full items-center justify-between gap-6 border-t border-border/40 pt-4 sm:mt-0 sm:w-auto sm:justify-end sm:border-t-0 sm:pt-0">
                        <div className="flex flex-col items-start sm:items-end">
                            <p className="text-[10px] font-bold tracking-wider text-description uppercase">
                                {isScored ? 'Performance' : isUrgent ? 'Closes' : 'Deadline'}
                            </p>

                            {isScored ? (
                                <div className="flex items-baseline gap-0.5">
                                    <span className="text-xl font-black text-success">
                                        {studentData?.score}
                                    </span>
                                    <span className="text-xs font-bold text-success/70">%</span>
                                </div>
                            ) : (
                                <div className={cn('flex items-center gap-1.5 font-semibold', isUrgent ? 'text-primary' : 'text-body')}>
                                    {isUrgent ? (
                                        <AlertCircle className="h-3.5 w-3.5 animate-bounce" />
                                    ) : (
                                        <Calendar className="h-3.5 w-3.5 opacity-50" />
                                    )}
                                    <span className="text-sm">
                                        {endTime.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </span>
                                </div>
                            )}


                            {isScored && (
                                <span className="text-[8px] font-bold tracking-wider text-description uppercase">Achieved</span>
                            )}
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:bg-primary group-hover:text-primary-foreground">
                            <ChevronRight className="h-5 w-5" />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}