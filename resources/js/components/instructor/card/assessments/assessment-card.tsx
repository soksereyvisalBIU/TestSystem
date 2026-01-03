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
import { cn } from '@/lib/utils';

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

    // Mapped to your semantic colors: primary, success, muted, and warning (amber)
    const statusStyles: Record<string, string> = {
        upcoming: 'bg-primary/10 text-primary border-primary/20',
        ongoing: 'bg-success/10 text-success border-success/20 animate-pulse',
        closed: 'bg-muted text-description border-border',
        draft: 'bg-orange-500/10 text-orange-600 border-orange-500/20', // Warning state
    };

    const StatusBadge = () => (
        <Badge
            variant="outline"
            className={cn('gap-1.5 font-bold uppercase text-[10px] tracking-tight', statusStyles[status])}
        >
            <span
                className={cn(
                    'h-1.5 w-1.5 rounded-full',
                    status === 'ongoing' ? 'bg-success' : 'bg-current'
                )}
            />
            {status}
        </Badge>
    );

    if (viewMode === 'list') {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Card className="flex items-center justify-between p-4 transition-all hover:border-primary/50 hover:shadow-md bg-card">
                    <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <FileTextIcon className="h-5 w-5" />
                        </div>
                        <div>
                            <Link
                                href={route(
                                    'instructor.classes.subjects.assessments.show',
                                    [classId, subjectId, assessment.id],
                                )}
                                className="font-bold text-title hover:text-primary transition-colors"
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
            <Card className="group pb-0 relative overflow-hidden border-border bg-card transition-all hover:border-primary/40 hover:shadow-lg">
                {/* Status line - using fixed colors that work in dark mode */}
                <div
                    className={cn(
                        'absolute top-0 left-0 h-1 w-full',
                        status === 'ongoing' ? 'bg-success' : 
                        status === 'upcoming' ? 'bg-primary' : 'bg-muted-foreground/30'
                    )}
                />
                
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-description group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <FileTextIcon className="h-5 w-5" />
                    </div>
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
                        <CardTitle className="line-clamp-1 text-lg font-bold text-title group-hover:text-primary transition-colors">
                            <motion.div layoutId={`assessment-title-${assessment.id}`}>
                                {assessment.title}
                            </motion.div>
                        </CardTitle>
                        <CardDescription className="mt-1 line-clamp-2 text-xs text-description">
                            {assessment.description || "No description provided."}
                        </CardDescription>
                    </Link>

                    <div className="mt-4 space-y-2">
                        <div className="flex items-center gap-2 text-body">
                            <CalendarIcon className="h-4 w-4 text-description/50" />
                            <span className="text-xs font-medium">
                                {assessment.start_time
                                    ? format(new Date(assessment.start_time), 'MMM d')
                                    : 'TBA'}
                                {' - '}
                                {assessment.end_time
                                    ? format(new Date(assessment.end_time), 'MMM d, yyyy')
                                    : ''}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-body">
                            <ClockIcon className="h-4 w-4 text-description/50" />
                            <span className="text-xs font-medium">
                                {assessment.start_time
                                    ? format(new Date(assessment.start_time), 'h:mm a')
                                    : '--:--'}
                            </span>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="flex items-center justify-between border-t border-border bg-muted/30 px-4 py-3">
                    <StatusBadge />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-description/70">
                        {assessment.questions_count || 0} Questions
                    </span>
                </CardFooter>
            </Card>
        </motion.div>
    );
}