import { Assessment } from '@/types/student/assessment';
import { motion } from 'framer-motion';
import { route } from 'ziggy-js';
import { getAssessmentStatusDetails } from '../get-assessment-status-detail';
import { ChevronRight, FileText, Calendar, Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

interface AssessmentCardProps {
    assessment: Assessment;
    classId: number;
}

export function AssessmentCard({ assessment, classId }: AssessmentCardProps) {
    const statusDetails = getAssessmentStatusDetails(assessment);
    
    // Fixed: Removed the duplicate assessment.id parameter
    const assessmentRoute = route('student.classes.subjects.assessments.show', [
        classId,
        assessment.id,
        assessment.id,
    ]);

    const isScored = assessment.student_status === 'scored';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ duration: 0.2 }}
            className="relative group"
        >
            {/* THE CLICKABLE OVERLAY - Keeps the entire card interactive */}
            <Link 
                href={assessmentRoute} 
                className="absolute inset-0 z-20 cursor-pointer" 
                aria-label={`View ${assessment.title}`}
            />

            <div
                className={`flex items-center justify-between rounded-2xl border p-5 transition-all duration-300 shadow-sm ${
                    statusDetails.isUrgent
                        ? 'border-amber-200 bg-amber-50/50 shadow-amber-100 ring-1 ring-amber-200'
                        : isScored
                        ? 'border-emerald-100 bg-emerald-50/30'
                        : 'border-slate-100 bg-white hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5'
                }`}
            >
                <div className="flex items-center gap-5">
                    {/* Icon Container */}
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors ${
                        assessment.type === 'exam' 
                            ? 'bg-red-100 text-red-600 group-hover:bg-red-600 group-hover:text-white' 
                            : 'bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white'
                    }`}>
                        <FileText className="h-6 w-6" />
                    </div>
                    
                    <div className="flex flex-col gap-1.5">
                        <h4 className="font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                            {assessment.title}
                        </h4>
                        <div className="flex items-center gap-2">
                            <Badge 
                                variant={statusDetails.badgeVariant} 
                                className={`px-2 py-0 text-[10px] uppercase tracking-wider font-black ${statusDetails.badgeColorClass}`}
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
                    <div className="hidden sm:flex flex-col items-end gap-0.5">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            {isScored ? 'Result' : 'Deadline'}
                        </p>
                        <div className="flex items-center gap-1.5 font-bold text-slate-900">
                            {!isScored && <Calendar className="h-3.5 w-3.5 text-slate-400" />}
                            <span className={isScored ? 'text-lg text-emerald-700' : 'text-sm'}>
                                {isScored 
                                    ? `${assessment.student_score}%` 
                                    : assessment.end_time.split(' ')[0]}
                            </span>
                        </div>
                    </div>

                    {/* Action Visual */}
                    <Button 
                        variant="secondary" 
                        size="icon" 
                        className="h-10 w-10 rounded-full bg-slate-50 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 pointer-events-none"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}