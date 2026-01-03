import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, Clock, Download, Edit3, Trophy } from 'lucide-react';
import { useState } from 'react';
import AssessmentModal from '../modal/assessment-modal';

interface Props {
    assessment: {
        id: string | number;
        title: string;
        type?: string;
        status?: string;
        due_date?: string;
        duration: number | string;
    };
    totalMarks: number;
    role?: 'editor' | 'viewer';
}

export default function AssessmentHeader({
    assessment,
    totalMarks,
    role = 'viewer',
}: Props) {
    const [openAssessmentModal, setOpenAssessmentModal] = useState(false);
    const [selectedAssessment, setSelectedAssessment] = useState<any | null>(null);

    return (
        <div className="relative flex flex-col gap-6 border-b border-border pb-6 md:flex-row md:items-end md:justify-between transition-colors">
            <div className="space-y-4">
                <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                        <AnimatePresence>
                            {assessment.status === 'published' && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                >
                                    <Badge
                                        variant="secondary"
                                        className="border-success/20 bg-success/10 px-2.5 py-0.5 text-success transition-colors hover:bg-success/20"
                                    >
                                        <span className="mr-1.5 flex h-1.5 w-1.5 items-center justify-center rounded-full bg-success animate-pulse" />
                                        Published
                                    </Badge>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <motion.h1
                        layoutId={`assessment-title-${assessment.id}`}
                        className="text-4xl font-black tracking-tight text-title md:text-5xl uppercase"
                    >
                        {assessment.title}
                    </motion.h1>
                </div>

                {/* Metadata: Using adaptive muted surfaces */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-4 text-sm font-bold text-body">
                    <div className="flex items-center gap-2">
                        <div className="rounded-xl bg-muted p-2 text-muted-foreground transition-colors">
                            <Calendar className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-description uppercase tracking-wider">
                                Due Date
                            </span>
                            <span className="text-title">
                                {assessment.due_date
                                    ? format(new Date(assessment.due_date), 'PPP')
                                    : 'Open Ended'}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="rounded-xl bg-muted p-2 text-muted-foreground transition-colors">
                            <Clock className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-description uppercase tracking-wider">
                                Duration
                            </span>
                            <span className="text-title">{assessment.duration} Minutes</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="rounded-xl bg-primary/10 p-2 text-primary transition-colors">
                            <Trophy className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-primary uppercase tracking-wider">
                                Weightage
                            </span>
                            <span className="text-primary font-black">
                                {totalMarks} Points
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions: Refined for Theme Consistency */}
            <div className="flex items-center gap-3">
                <Button
                    variant="outline"
                    className="h-12 px-6 font-bold border-border bg-card hover:bg-muted transition-all"
                >
                    <Download className="mr-2 h-4 w-4" />
                    Export
                </Button>

                {role === 'editor' && (
                    <Button
                        onClick={() => {
                            setSelectedAssessment(assessment);
                            setOpenAssessmentModal(true);
                        }}
                        className="h-12 bg-primary text-primary-foreground px-6 font-black shadow-lg shadow-primary/20 transition-all hover:opacity-90 active:scale-95"
                    >
                        <Edit3 className="mr-2 h-4 w-4" />
                        Edit Assessment
                    </Button>
                )}
            </div>

            <AssessmentModal
                isOpen={openAssessmentModal}
                setIsOpen={(v) => {
                    setOpenAssessmentModal(v);
                    if (!v) setSelectedAssessment(null);
                }}
                classId={1}
                subjectId={1}
                assessment={assessment ?? undefined}
            />
        </div>
    );
}