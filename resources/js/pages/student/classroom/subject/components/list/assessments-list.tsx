import { Button } from '@/components/ui/button';
import { Assessment } from '@/types/student/assessment';
import { BookOpen, Plus, Search, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { AssessmentCard } from '../card/assessment-card';

interface AssessmentsListProps {
    assessments: Assessment[];
    classId: number;
    onAddNew?: () => void;
    onNavigate?: (url: string) => void;
}

export function AssessmentsList({
    assessments,
    classId,
    onAddNew,
    onNavigate,
}: AssessmentsListProps) {
    return (
        <Card className="overflow-hidden rounded-[2rem] border-none bg-white shadow-xl shadow-slate-200/50">
            <CardHeader className="flex flex-col gap-4 border-b border-slate-50 p-8 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                    <CardTitle className="text-2xl font-black tracking-tight text-slate-900">
                        Subject Assessments
                    </CardTitle>
                    <CardDescription className="text-sm font-medium text-slate-500">
                        Manage your upcoming tasks and review your performance.
                    </CardDescription>
                </div>
                
                <div className="flex items-center gap-2">
                    {/* Secondary Actions: Search/Filter for Pro UX */}
                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-slate-200 text-slate-500 hover:bg-slate-50">
                        <Search className="h-4 w-4" />
                    </Button>
                    
                    {onAddNew && (
                        <Button
                            onClick={onAddNew}
                            className="h-10 rounded-xl bg-blue-600 px-5 font-bold shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 hover:shadow-blue-300 active:scale-95"
                        >
                            <Plus className="mr-2 h-4 w-4 stroke-[3px]" /> 
                            Schedule
                        </Button>
                    )}
                </div>
            </CardHeader>

            <CardContent className="p-6">
                <AnimatePresence mode="popLayout">
                    {assessments.length > 0 ? (
                        <div className="grid gap-4">
                            {assessments.map((assessment, index) => (
                                <motion.div
                                    key={assessment.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <AssessmentCard
                                        assessment={assessment}
                                        classId={classId}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center rounded-[1.5rem] border-2 border-dashed border-slate-100 bg-slate-50/50 py-16 text-center"
                        >
                            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-sm ring-1 ring-slate-200/50">
                                <BookOpen className="h-10 w-10 text-slate-300" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">Clear Horizon</h3>
                            <p className="mx-auto mt-1 max-w-[240px] text-sm font-medium text-slate-400">
                                No assessments found for this subject. Enjoy the break or schedule a self-study session.
                            </p>
                            {onAddNew && (
                                <Button 
                                    variant="link" 
                                    className="mt-4 font-bold text-blue-600"
                                    onClick={onAddNew}
                                >
                                    Create first assessment
                                </Button>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardContent>
            
            {/* List Footer Info */}
            {assessments.length > 0 && (
                <div className="bg-slate-50/50 px-8 py-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Showing {assessments.length} total activities
                    </p>
                </div>
            )}
        </Card>
    );
}