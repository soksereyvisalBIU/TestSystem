import { Badge } from '@/components/ui/badge';
import { Assessment } from '@/types/student/assessment';
import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Calendar, ChevronRight, FileText, Target, RefreshCcw, Clock, CheckCircle2 } from 'lucide-react';
import { route } from 'ziggy-js';
import { getAssessmentStatusDetails } from '../get-assessment-status-detail';
import { useCan } from '@/hooks/permission/useCan';

interface AssessmentCardProps {
    assessment: Assessment;
    classId: number;
}

export function AssessmentCard({ assessment, classId }: AssessmentCardProps) {
    const { url } = usePage();
    const accessInstructorPage = useCan('access-instructor-page') && url.includes('/instructor');

    // Data Mapping
    const studentData = assessment?.student_assessment;
    const isScored = studentData?.status === 'scored';
    const isSubmitted = studentData?.status === 'submitted'; // Added Submitted Check
    
    const statusDetails = getAssessmentStatusDetails(assessment);
    
    const attemptsUsed = studentData?.attempted_amount || 0;
    const maxAttempts = assessment?.max_attempts;

    const assessmentRoute = route(
        accessInstructorPage ? 'instructor.classes.subjects.assessments.show' : 'student.classes.subjects.assessments.show',
        [classId, assessment.pivot.subject_id, assessment.id]
    );

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            className="group relative"
        >
            <Link href={assessmentRoute} className="absolute inset-0 z-20 cursor-pointer" />

            <div className={`
                flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-[1.5rem] border p-5 transition-all duration-300
                ${statusDetails.isUrgent 
                    ? 'border-amber-200 bg-gradient-to-r from-amber-50/80 to-transparent shadow-md shadow-amber-100/50' 
                    : isScored 
                        ? 'border-emerald-100 bg-emerald-50/20' 
                        : isSubmitted
                            ? 'border-blue-100 bg-blue-50/30' // Visual for Submitted state
                            : 'border-slate-100 bg-white hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5'}
            `}>
                
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    {/* Icon Container */}
                    <div className={`
                        flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-transform duration-500 group-hover:rotate-[10deg]
                        ${isScored ? 'bg-emerald-100 text-emerald-600' : 
                          isSubmitted ? 'bg-blue-100 text-blue-600' :
                          assessment.type === 'exam' ? 'bg-rose-100 text-rose-600' : 'bg-indigo-100 text-indigo-600'}
                    `}>
                        {isScored || isSubmitted ? <CheckCircle2 className="h-7 w-7" /> : 
                         assessment.type === 'exam' ? <Target className="h-7 w-7" /> : <FileText className="h-7 w-7" />}
                    </div>

                    <div className="flex flex-col gap-1 overflow-hidden">
                        <h4 className="font-extrabold text-slate-900 group-hover:text-blue-600 truncate">
                            {assessment.title}
                        </h4>
                        
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge className={`px-2 py-0.5 text-[10px] font-bold rounded-lg ${statusDetails.badgeColorClass}`}>
                                {statusDetails.label}
                            </Badge>
                            
                            {maxAttempts > 0 && (
                                <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
                                    <RefreshCcw className="h-3 w-3" />
                                    {attemptsUsed}/{maxAttempts} Attempts
                                </span>
                            )}

                            <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
                                <Clock className="h-3 w-3" />
                                {assessment.duration}m
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mt-4 sm:mt-0 flex items-center justify-between sm:justify-end gap-8 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0">
                    <div className="flex flex-col items-start sm:items-end">
                        <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                            {isScored ? 'Performance' : isSubmitted ? 'Status' : 'Deadline'}
                        </p>
                        
                        {isScored ? (
                            <div className="flex flex-col items-end leading-tight">
                                <span className="text-xl font-black text-emerald-600">
                                    {studentData?.score}%
                                </span>
                                <span className="text-[10px] font-bold text-emerald-500/70 uppercase">Achieved</span>
                            </div>
                        ) : isSubmitted ? (
                            <div className="flex flex-col items-end leading-tight">
                                <span className="text-sm font-black text-blue-600">Waiting for Grade</span>
                                <span className="text-[10px] font-bold text-blue-400 uppercase">Submitted</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-1.5 font-bold text-slate-700">
                                <Calendar className="h-4 w-4 text-slate-400" />
                                <span className="text-sm">
                                    {assessment.end_time ? new Date(assessment.end_time).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'No Date'}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-200 transition-all">
                        <ChevronRight className="h-5 w-5" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}