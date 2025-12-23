import { Button } from '@/components/ui/button';
import { Student } from '@/types/student/assessment';
import { Users, UserPlus, Search, ArrowUpDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { StudentCard } from '../card/student-card';

interface StudentsListProps {
    students: Student[];
    onAddStudent?: () => void;
    onStudentMenuClick?: (studentId: number) => void;
}

export function StudentsList({
    students,
    onAddStudent,
    onStudentMenuClick,
}: StudentsListProps) {
    // Calculate class average for the summary footer
    const classAverage = students.length 
        ? Math.round(students.reduce((acc, curr) => acc + curr.progress, 0) / students.length)
        : 0;

    return (
        <Card className="overflow-hidden rounded-[2rem] border-none bg-white shadow-xl shadow-slate-200/50">
            <CardHeader className="flex flex-col gap-6 border-b border-slate-50 p-8 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-indigo-600">
                        <Users className="h-5 w-5" />
                        <CardTitle className="text-2xl font-black tracking-tight text-slate-900">
                            Class Roster
                        </CardTitle>
                    </div>
                    <CardDescription className="text-sm font-medium text-slate-500">
                        Monitoring {students.length} active students in this cohort.
                    </CardDescription>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-slate-200 text-slate-500">
                        <Search className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-slate-200 text-slate-500">
                        <ArrowUpDown className="h-4 w-4" />
                    </Button>
                    
                    {onAddStudent && (
                        <Button 
                            onClick={onAddStudent}
                            className="h-10 rounded-xl bg-indigo-600 px-5 font-bold shadow-lg shadow-indigo-100 transition-all hover:bg-indigo-700 active:scale-95"
                        >
                            <UserPlus className="mr-2 h-4 w-4" />
                            Enroll
                        </Button>
                    )}
                </div>
            </CardHeader>

            <CardContent className="p-6">
                <div className="grid gap-2">
                    <AnimatePresence mode="popLayout">
                        {students.length > 0 ? (
                            students.map((student, index) => (
                                <motion.div
                                    key={student.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.04 }}
                                >
                                    <StudentCard
                                        student={student}
                                        onMenuClick={onStudentMenuClick}
                                    />
                                </motion.div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="mb-4 rounded-full bg-slate-50 p-4">
                                    <Users className="h-8 w-8 text-slate-300" />
                                </div>
                                <p className="text-sm font-bold text-slate-500">No students enrolled yet.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </CardContent>

            {/* Performance Summary Footer */}
            {students.length > 0 && (
                <div className="flex items-center justify-between border-t border-slate-50 bg-slate-50/30 px-8 py-4">
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Class Average</span>
                            <span className="text-sm font-bold text-slate-900">{classAverage}%</span>
                        </div>
                        <div className="h-8 w-[1px] bg-slate-200" />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status</span>
                            <span className="text-sm font-bold text-emerald-600 italic">On Track</span>
                        </div>
                    </div>
                    <Button variant="link" className="text-xs font-bold text-indigo-600">
                        View Analytics Report
                    </Button>
                </div>
            )}
        </Card>
    );
}