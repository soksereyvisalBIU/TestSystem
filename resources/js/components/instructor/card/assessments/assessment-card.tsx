// --- ASSESSMENT PAGE ---
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { CalendarIcon, ClockIcon, FileTextIcon } from 'lucide-react';
import { route } from 'ziggy-js';
import AssessmentActions from './assessment-action';

// --- ASSESSMENT CARD ---
export default function AssessmentCard({
    assessment,
    viewMode,
    classId,
    subjectId,
    getStatus,
    availableClasses,
    setSelectedAssessment,
    setOpenAssessmentModal,
}: any) {
    const status = getStatus(assessment.start_time, assessment.end_time);

    const statusStyles: Record<string, string> = {
        upcoming: 'bg-blue-50 text-blue-700 border-blue-200',
        ongoing: 'bg-green-50 text-green-700 border-green-200 animate-pulse',
        closed: 'bg-slate-100 text-slate-700 border-slate-200',
        draft: 'bg-amber-50 text-amber-700 border-amber-200',
    };

    const StatusBadge = () => (
        <Badge
            variant="outline"
            className={`gap-1.5 font-medium capitalize ${statusStyles[status]}`}
        >
            <span
                className={`h-1.5 w-1.5 rounded-full ${status === 'ongoing' ? 'bg-green-600' : 'bg-current'}`}
            />
            {status}
        </Badge>
    );

    if (viewMode === 'list') {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Card className="flex items-center justify-between p-4 transition-all hover:border-blue-300 hover:shadow-md">
                    <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                            <FileTextIcon className="h-5 w-5" />
                        </div>
                        <div>
                            <Link
                                href={route(
                                    'instructor.classes.subjects.assessments.show',
                                    [classId, subjectId, assessment.id],
                                )}
                                className="font-semibold text-slate-900 hover:text-blue-600 hover:underline"
                            >
                                {assessment.title}
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <StatusBadge />
                        <AssessmentActions
                            assessment={assessment}
                            availableClasses={availableClasses}
                            classId={classId}
                            subjectId={subjectId}
                            setSelectedAssessment={setSelectedAssessment}
                            setOpenAssessmentModal={setOpenAssessmentModal}
                        />
                    </div>
                </Card>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
        >
            <Card className="group relative overflow-hidden border-slate-200 transition-all hover:border-blue-300 hover:shadow-lg">
                {/* Status line */}
                <div
                    className={`absolute top-0 left-0 h-1 w-full ${status === 'ongoing' ? 'bg-green-500' : status === 'upcoming' ? 'bg-blue-500' : 'bg-slate-300'}`}
                />
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600">
                        <FileTextIcon className="h-5 w-5" />
                    </div>
                    {/* FIXED: Added availableClasses + classId + subjectId */}
                    <AssessmentActions
                        assessment={assessment}
                        availableClasses={availableClasses}
                        classId={classId}
                        subjectId={subjectId}
                        setSelectedAssessment={setSelectedAssessment}
                        setOpenAssessmentModal={setOpenAssessmentModal}
                    />
                </CardHeader>
                <CardContent className="pb-3">
                    <Link
                        href={route(
                            'instructor.classes.subjects.assessments.show',
                            [classId, subjectId, assessment.id],
                        )}
                    >
                        <CardTitle className="line-clamp-1 text-lg font-bold group-hover:text-blue-700">
                            <motion.div
                                layoutId={`assessment-title-${assessment.id}`}
                            >
                                {assessment.title}
                            </motion.div>
                        </CardTitle>
                        <CardDescription className="mt-1 line-clamp-2 text-xs">
                            Description goes here if available...
                        </CardDescription>
                    </Link>
                    <div className="mt-4 space-y-2">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <CalendarIcon className="h-4 w-4 text-slate-400" />
                            <span className="text-xs font-medium">
                                {assessment.start_time
                                    ? format(
                                          new Date(assessment.start_time),
                                          'MMM d',
                                      )
                                    : 'TBA'}
                                -
                                {assessment.end_time
                                    ? format(
                                          new Date(assessment.end_time),
                                          'MMM d, yyyy',
                                      )
                                    : ''}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <ClockIcon className="h-4 w-4 text-slate-400" />
                            <span className="text-xs font-medium">
                                {assessment.start_time
                                    ? format(
                                          new Date(assessment.start_time),
                                          'h:mm a',
                                      )
                                    : '--:--'}
                            </span>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between border-t bg-slate-50/50 px-4 py-3">
                    <StatusBadge />
                    <span className="text-xs font-medium text-slate-500">
                        {assessment.questions_count || 0} Qs
                    </span>
                </CardFooter>
            </Card>
        </motion.div>
    );
}
