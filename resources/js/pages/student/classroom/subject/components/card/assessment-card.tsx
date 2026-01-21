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
    
    // Performance: Memoize instructor check to avoid string regex on every render
    const accessInstructorPage = useMemo(() => 
        useCan('access-instructor-page') && url.includes('/instructor'),
    [url]);

    const studentData = assessment?.student_assessment;
    const isScored = studentData?.status === 'scored';
    const isSubmitted = studentData?.status === 'submitted';

    // Performance: Consolidate Date parsing to avoid multiple 'new Date' objects
    const timeData = useMemo(() => {
        const now = Date.now();
        const start = new Date(assessment.start_time).getTime();
        const end = new Date(assessment.end_time).getTime();
        const status = studentData?.status;
        
        const isLive = now >= start && now <= end;
        const isInProgress = status === 'in_progress';
        
        return {
            isUrgent: (isInProgress || (!status && isLive)) && !isSubmitted && !isScored,
            endDate: new Date(assessment.end_time).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
            }),
        };
    }, [assessment.start_time, assessment.end_time, studentData?.status, isSubmitted, isScored]);

    const statusDetails = useMemo(() => getAssessmentStatusDetails(assessment), [assessment]);

    const assessmentRoute = useMemo(() => route(
        accessInstructorPage
            ? 'instructor.classes.subjects.assessments.show'
            : 'student.classes.subjects.assessments.show',
        [classId, assessment.pivot.subject_id, assessment.id],
    ), [accessInstructorPage, classId, assessment.pivot.subject_id, assessment.id]);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            className="group relative transform-gpu" // GPU acceleration
        >
            <Link
                href={assessmentRoute}
                className="absolute inset-0 z-30 cursor-pointer"
                prefetch // Faster navigation on click
            />

            {/* URGENT INDICATOR */}
            <AnimatePresence>
                {timeData.isUrgent && !isSubmitted && (
                    <div className="absolute -top-2 -right-2 z-50 flex h-8 w-8 items-center justify-center">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-40" />
                        <div className="relative flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground shadow-lg">
                            <span className="text-[10px] font-black">!</span>
                        </div>
                    </div>
                )}
            </AnimatePresence>

            <div
                className={cn(
                    'relative z-10 overflow-hidden rounded-2xl p-[1.5px] transition-all duration-500',
                    timeData.isUrgent
                        ? 'animate-border-loop bg-[conic-gradient(from_var(--border-angle),transparent_70%,theme(colors.primary.DEFAULT))] shadow-md shadow-primary/20'
                        : 'bg-border/60 hover:bg-primary/30',
                )}
            >
                <div
                    className={cn(
                        'relative z-20 flex h-full w-full flex-col items-start justify-between rounded-[calc(1rem-1.5px)] bg-card p-4 xs:p-5 sm:flex-row sm:items-center',
                        isScored && 'border-2 border-success/30', 
                        isSubmitted && 'bg-primary/5 border-primary/20',
                    )}
                >
                    {/* LEFT SECTION */}
                    <div className="flex w-full items-center gap-3 xs:gap-5 sm:w-auto">
                        <div
                            className={cn(
                                'flex h-10 w-10 xs:h-14 xs:w-14 shrink-0 items-center justify-center rounded-xl transition-all duration-500 group-hover:scale-105 group-hover:rotate-3',
                                isScored ? 'bg-success/10 text-success' :
                                isSubmitted ? 'bg-primary/10 text-primary' :
                                timeData.isUrgent ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30' : 
                                'bg-muted text-muted-foreground',
                            )}
                        >
                            {isScored || isSubmitted ? (
                                <CheckCircle2 className="h-6 w-6 xs:h-7 xs:w-7" />
                            ) : assessment.type === 'exam' ? (
                                <Target className="h-6 w-6 xs:h-7 xs:w-7" />
                            ) : (
                                <FileText className="h-6 w-6 xs:h-7 xs:w-7" />
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
                                {isScored ? 'Performance' : timeData.isUrgent ? 'Closes' : 'Deadline'}
                            </p>

                            {isScored ? (
                                <div className="flex items-baseline gap-0.5">
                                    <span className="text-xl font-black text-success">{studentData?.score}</span>
                                    <span className="text-xs font-bold text-success/70">%</span>
                                </div>
                            ) : (
                                <div className={cn('flex items-center gap-1.5 font-semibold', timeData.isUrgent ? 'text-primary' : 'text-body')}>
                                    {timeData.isUrgent ? (
                                        <AlertCircle className="h-3.5 w-3.5 animate-pulse" />
                                    ) : (
                                        <Calendar className="h-3.5 w-3.5 opacity-50" />
                                    )}
                                    <span className="text-sm">{timeData.endDate}</span>
                                </div>
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