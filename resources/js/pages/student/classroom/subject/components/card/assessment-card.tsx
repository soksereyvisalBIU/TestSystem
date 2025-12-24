import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Assessment } from '@/types/student/assessment';
import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Calendar, ChevronRight, FileText, Target } from 'lucide-react';
import { route } from 'ziggy-js';
import { getAssessmentStatusDetails } from '../get-assessment-status-detail';

interface AssessmentCardProps {
    assessment: Assessment;
    classId: number;
}

export function AssessmentCard({ assessment, classId }: AssessmentCardProps) {
    const { auth } = usePage().props as any;

    const { props, url } = usePage();

    const accessInstructorPage =
        props.auth.can['access-instructor-page'] && url.includes('/instructor');

    const statusDetails = getAssessmentStatusDetails(assessment);
    const isScored = assessment.student_status === 'scored';

    /** * FIX 1: Move route logic outside of the if/else scope
     * FIX 2: Correct the route parameter array [class, subject, assessment]
     */

    console.log('Assessment Subject ID:', assessment);

    const assessmentRoute = accessInstructorPage
        ? route('instructor.classes.subjects.assessments.show', [
              classId,
              assessment.pivot.subject_id, // Ensure your type includes subject_id
              assessment.id,
          ])
        : route('student.classes.subjects.assessments.show', [
              classId,
              assessment.pivot.subject_id,
              assessment.id,
          ]);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ duration: 0.2 }}
            className="group relative"
        >
            {/* THE CLICKABLE OVERLAY */}
            <Link
                href={assessmentRoute}
                className="absolute inset-0 z-20 cursor-pointer"
                aria-label={`View ${assessment.title}`}
            />

            <div
                className={`flex items-center justify-between rounded-2xl border p-5 shadow-sm transition-all duration-300 ${
                    statusDetails.isUrgent
                        ? 'border-amber-200 bg-amber-50/50 ring-1 shadow-amber-100 ring-amber-200'
                        : isScored
                          ? 'border-emerald-100 bg-emerald-50/30'
                          : 'border-slate-100 bg-white hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5'
                }`}
            >
                <div className="flex items-center gap-5">
                    {/* Icon Container */}
                    <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors ${
                            assessment.type === 'exam'
                                ? 'bg-red-100 text-red-600 group-hover:bg-red-600 group-hover:text-white'
                                : 'bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white'
                        }`}
                    >
                        <FileText className="h-6 w-6" />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <h4 className="font-bold tracking-tight text-slate-900 transition-colors group-hover:text-blue-600">
                            {assessment.title}
                        </h4>
                        <div className="flex items-center gap-2">
                            <Badge
                                variant={statusDetails.badgeVariant}
                                className={`px-2 py-0 text-[10px] font-black tracking-wider uppercase ${statusDetails.badgeColorClass}`}
                            >
                                {statusDetails.label}
                            </Badge>
                            {isScored && (
                                <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                                    <Target className="h-3 w-3" /> Graded
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    {/* Stats Display */}
                    <div className="hidden flex-col items-end gap-0.5 sm:flex">
                        <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                            {isScored ? 'Result' : 'end_time'}
                        </p>
                        <div className="flex items-center gap-1.5 font-bold text-slate-900">
                            {!isScored && (
                                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                            )}
                            <span
                                className={
                                    isScored
                                        ? 'text-lg text-emerald-700'
                                        : 'text-sm'
                                }
                            >
                                {isScored
                                    ? `${assessment.student_score}%`
                                    : assessment.end_time?.split(' ')[0] ||
                                      'N/A'}
                            </span>
                        </div>
                    </div>

                    {/* Action Visual */}
                    <Button
                        variant="secondary"
                        size="icon"
                        className="pointer-events-none h-10 w-10 rounded-full bg-slate-50 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}
