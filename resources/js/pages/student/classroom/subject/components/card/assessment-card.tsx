import { Badge } from '@/components/ui/badge';
import { useCan } from '@/hooks/permission/useCan';
import { Assessment } from '@/types/student/assessment';
import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Calendar,
    CheckCircle2,
    ChevronRight,
    Clock,
    FileText,
    RefreshCcw,
    Target,
} from 'lucide-react';
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

    // Data Mapping
    const studentData = assessment?.student_assessment;
    const isScored = studentData?.status === 'scored';
    const isSubmitted = studentData?.status === 'submitted'; // Added Submitted Check

    const statusDetails = getAssessmentStatusDetails(assessment);

    const attemptsUsed = studentData?.attempted_amount || 0;
    const maxAttempts = assessment?.max_attempts;

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
            <Link
                href={assessmentRoute}
                className="absolute inset-0 z-20 cursor-pointer"
            />

            <div
                className={`flex flex-col items-start justify-between rounded-[1.5rem] border p-5 transition-all duration-300 sm:flex-row sm:items-center ${
                    statusDetails.isUrgent
                        ? 'border-accent bg-gradient-to-r from-accent/40 to-transparent shadow-md shadow-accent/30'
                        : isScored
                          ? 'border-success/30 bg-success/10'
                          : isSubmitted
                            ? 'border-primary/30 bg-primary/10'
                            : 'border-border bg-card hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10'
                } `}
            >
                <div className="flex w-full items-center gap-4 sm:w-auto">
                    {/* Icon */}
                    <div
                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-transform duration-500 group-hover:rotate-[10deg] ${
                            isScored
                                ? 'bg-success/20 text-success'
                                : isSubmitted
                                  ? 'bg-primary/20 text-primary'
                                  : assessment.type === 'exam'
                                    ? 'bg-destructive/20 text-destructive'
                                    : 'bg-secondary text-secondary-foreground'
                        } `}
                    >
                        {isScored || isSubmitted ? (
                            <CheckCircle2 className="h-7 w-7" />
                        ) : assessment.type === 'exam' ? (
                            <Target className="h-7 w-7" />
                        ) : (
                            <FileText className="h-7 w-7" />
                        )}
                    </div>

                    {/* Title + Meta */}
                    <div className="flex flex-col gap-1 overflow-hidden">
                        <h4 className="truncate font-extrabold text-title group-hover:text-primary">
                            {assessment.title}
                        </h4>

                        <div className="flex flex-wrap items-center gap-2">
                            <Badge
                                className={`rounded-lg px-2 py-0.5 text-[10px] font-bold ${statusDetails.badgeColorClass}`}
                            >
                                {statusDetails.label}
                            </Badge>

                            {maxAttempts > 0 && (
                                <span className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground">
                                    <RefreshCcw className="h-3 w-3" />
                                    {attemptsUsed}/{maxAttempts} Attempts
                                </span>
                            )}

                            <span className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {assessment.duration}m
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right Section */}
                <div className="mt-4 flex w-full items-center justify-between gap-8 border-t border-border pt-4 sm:mt-0 sm:w-auto sm:justify-end sm:border-t-0 sm:pt-0">
                    <div className="flex flex-col items-start sm:items-end">
                        <p className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                            {isScored
                                ? 'Performance'
                                : isSubmitted
                                  ? 'Status'
                                  : 'Deadline'}
                        </p>

                        {isScored ? (
                            <div className="flex flex-col items-end leading-tight">
                                <span className="text-xl font-black text-success">
                                    {studentData?.score}%
                                </span>
                                <span className="text-[10px] font-bold text-success/70 uppercase">
                                    Achieved
                                </span>
                            </div>
                        ) : isSubmitted ? (
                            <div className="flex flex-col items-end leading-tight">
                                <span className="text-sm font-black text-primary">
                                    Waiting for Grade
                                </span>
                                <span className="text-[10px] font-bold text-primary/70 uppercase">
                                    Submitted
                                </span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-1.5 font-bold text-body">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">
                                    {assessment.end_time
                                        ? new Date(
                                              assessment.end_time,
                                          ).toLocaleDateString(undefined, {
                                              month: 'short',
                                              day: 'numeric',
                                          })
                                        : 'No Date'}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Arrow */}
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground transition-all group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-lg group-hover:shadow-primary/30">
                        <ChevronRight className="h-5 w-5" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
