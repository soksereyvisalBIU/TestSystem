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
    const [selectedAssessment, setSelectedAssessment] = useState<any | null>(
        null,
    );

    console.log(assessment);

    return (
        <div className="relative flex flex-col gap-6 border-b border-slate-100 pb-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-4">
                {/* 1. Breadcrumb/Category Line
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-400">
                    <span>Assessments</span>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-blue-600">{assessment.type || 'Exam'}</span>
                </div> */}

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
                                        className="border-emerald-100 bg-emerald-50 px-2.5 py-0.5 text-emerald-700 transition-colors hover:bg-emerald-100"
                                    >
                                        <span className="mr-1.5 flex h-1.5 w-1.5 items-center justify-center rounded-full bg-emerald-500" />
                                        Published
                                    </Badge>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <motion.h1
                        layoutId={`assessment-title-${assessment.id}`}
                        className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl"
                    >
                        {assessment.title}
                    </motion.h1>
                </div>

                {/* 2. Metadata: Refined for better scannability */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-slate-600">
                    <div className="flex items-center gap-2">
                        <div className="rounded-md bg-slate-100 p-1.5 text-slate-500">
                            <Calendar className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">
                                Due Date
                            </span>
                            <span>
                                {assessment.due_date
                                    ? format(
                                          new Date(assessment.due_date),
                                          'PPP',
                                      )
                                    : 'Open Ended'}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="rounded-md bg-slate-100 p-1.5 text-slate-500">
                            <Clock className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">
                                Duration
                            </span>
                            <span>{assessment.duration} Minutes</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="rounded-md bg-blue-50 p-1.5 text-blue-500">
                            <Trophy className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-blue-400 uppercase">
                                Weightage
                            </span>
                            <span className="text-blue-700">
                                {totalMarks} Points
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Actions: Visual Priority */}
            <div className="flex items-center gap-3">
                <Button
                    variant="ghost"
                    className="h-11 px-6 text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-900"
                >
                    <Download className="mr-2 h-4 w-4" />
                    Export
                </Button>

                {role === 'editor' && (
                    <Button
                        onClick={() => {
                            setSelectedAssessment(assessment); // edit mode
                            setOpenAssessmentModal(true);
                        }}
                        className="h-11 bg-blue-600 px-6 shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700 active:scale-95"
                    >
                        <Edit3 className="mr-2 h-4 w-4" />
                        Edit Assessment
                    </Button>
                )}
            </div>

            {/* CREATE / EDIT MODAL */}
            <AssessmentModal
                isOpen={openAssessmentModal}
                setIsOpen={(v) => {
                    setOpenAssessmentModal(v);
                    if (!v) setSelectedAssessment(null); // reset when closing
                }}
                classId={1}
                subjectId={1}
                // Mode prop removed. The Modal now detects "Edit" mode if assessment object exists.
                assessment={assessment ?? undefined}
            />
        </div>
    );
}
