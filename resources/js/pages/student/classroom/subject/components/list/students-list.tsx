import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Mail, Search, UserPlus, Users } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

interface Student {
    id: number;
    name: string;
    email: string;
    avatar?: string | null;
}

interface StudentListProps {
    students: Student[];
}

export function StudentList({ students = [] }: StudentListProps) {
    const [searchQuery, setSearchQuery] = useState('');

    // Performance: Only re-filter when query or data changes
    const filteredStudents = useMemo(() => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return students;

        return students.filter(
            (s) =>
                s.name.toLowerCase().includes(query) ||
                s.email.toLowerCase().includes(query),
        );
    }, [students, searchQuery]);

    const handleSearchChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setSearchQuery(e.target.value);
        },
        [],
    );

    return (
        <Card className="gap-0 overflow-hidden rounded-[2.5rem] border-none bg-card/50 shadow-2xl shadow-black/5 backdrop-blur-md">
            <CardHeader className="flex flex-col gap-4 space-y-0 p-8 py-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                    <CardTitle className="text-2xl font-black tracking-tight text-title">
                        Classmates
                    </CardTitle>
                    <CardDescription className="text-sm font-medium text-description">
                        {students.length} active students in this classroom.
                    </CardDescription>
                </div>

                <div className="flex items-center gap-3">
                    <div className="group relative">
                        <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-description transition-colors group-focus-within:text-primary" />
                        <input
                            type="text"
                            placeholder="Find a student..."
                            autoComplete="off"
                            className="h-11 w-full rounded-2xl border-none bg-muted/50 pr-4 pl-11 text-sm font-bold text-title placeholder:text-description focus:ring-2 focus:ring-primary/20 sm:w-max-64"
                            onChange={handleSearchChange}
                        />
                    </div>
                    <Button
                        size="icon"
                        className="h-11 w-11 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                    >
                        <UserPlus className="h-5 w-5" />
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="p-8 pt-0">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <AnimatePresence mode="popLayout" initial={false}>
                        {filteredStudents.map((student, i) => (
                            <StudentCard
                                key={student.id}
                                student={student}
                                index={i}
                            />
                        ))}
                    </AnimatePresence>
                </div>

                {filteredStudents.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-24 text-center"
                    >
                        <div className="mb-6 rounded-[2rem] bg-muted/50 p-6">
                            <Users className="h-10 w-10 text-muted-foreground/40" />
                        </div>
                        <h3 className="text-lg font-black text-title">
                            No classmates found
                        </h3>
                        <p className="max-w-[240px] text-sm font-medium text-description">
                            We couldn't find any student matching "{searchQuery}
                            "
                        </p>
                    </motion.div>
                )}
            </CardContent>
        </Card>
    );
}

// Sub-component optimized for high-frequency list rendering
function StudentCard({ student, index }: { student: Student; index: number }) {
    // Performance: Memoize initials to avoid re-splitting strings on every hover/render
    const initials = useMemo(() => {
        return student.name
            .split(' ')
            .slice(0, 2)
            .map((n) => n[0])
            .join('')
            .toUpperCase();
    }, [student.name]);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
                type: 'spring',
                stiffness: 260,
                damping: 20,
            }}
            className="group relative flex transform-gpu items-center gap-4 rounded-3xl bg-muted/20 p-4 transition-all duration-300 hover:bg-muted/40"
        >
            {/* Avatar Section with Optimized Sizing */}
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border-2 border-background bg-background shadow-sm">
                {student.avatar ? (
                    <img
                        src={student.avatar}
                        alt={student.name}
                        loading="lazy" // Performance: Native lazy loading
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-primary/10 font-black text-primary">
                        <span className="text-sm tracking-tighter">
                            {initials}
                        </span>
                    </div>
                )}
            </div>

            <div className="min-w-0 flex-1 space-y-0.5">
                <h4 className="truncate text-sm font-black tracking-tight text-title transition-colors group-hover:text-primary">
                    {student.name}
                </h4>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-description/80">
                    <Mail className="h-3 w-3" />
                    <span className="truncate">{student.email}</span>
                </div>
            </div>

            {/* Micro-interaction: Animated Action Button */}
            <div className="flex h-8 w-8 shrink-0 translate-x-2 items-center justify-center rounded-xl bg-background text-title opacity-0 shadow-sm transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                <ArrowUpRight className="h-4 w-4" />
            </div>
        </motion.div>
    );
}

// import { Button } from '@/components/ui/button';
// import { Student } from '@/types/student/assessment';
// import { Users, UserPlus, Search, ArrowUpDown } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';

// import {
//     Card,
//     CardContent,
//     CardDescription,
//     CardHeader,
//     CardTitle,
// } from '@/components/ui/card';
// import { StudentCard } from '../card/student-card';

// interface StudentsListProps {
//     students: Student[];
//     onAddStudent?: () => void;
//     onStudentMenuClick?: (studentId: number) => void;
// }

// export function StudentsList({
//     students,
//     onAddStudent,
//     onStudentMenuClick,
// }: StudentsListProps) {
//     // Calculate class average for the summary footer
//     const classAverage = students.length
//         ? Math.round(students.reduce((acc, curr) => acc + curr.progress, 0) / students.length)
//         : 0;

//     return (
//         <Card className="overflow-hidden rounded-[2rem] border-none bg-white shadow-xl shadow-slate-200/50">
//             <CardHeader className="flex flex-col gap-6 border-b border-slate-50 p-8 sm:flex-row sm:items-center sm:justify-between">
//                 <div className="space-y-1">
//                     <div className="flex items-center gap-2 text-indigo-600">
//                         <Users className="h-5 w-5" />
//                         <CardTitle className="text-2xl font-black tracking-tight text-slate-900">
//                             Class Roster
//                         </CardTitle>
//                     </div>
//                     <CardDescription className="text-sm font-medium text-slate-500">
//                         Monitoring {students.length} active students in this cohort.
//                     </CardDescription>
//                 </div>

//                 <div className="flex items-center gap-2">
//                     <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-slate-200 text-slate-500">
//                         <Search className="h-4 w-4" />
//                     </Button>
//                     <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-slate-200 text-slate-500">
//                         <ArrowUpDown className="h-4 w-4" />
//                     </Button>

//                     {onAddStudent && (
//                         <Button
//                             onClick={onAddStudent}
//                             className="h-10 rounded-xl bg-indigo-600 px-5 font-bold shadow-lg shadow-indigo-100 transition-all hover:bg-indigo-700 active:scale-95"
//                         >
//                             <UserPlus className="mr-2 h-4 w-4" />
//                             Enroll
//                         </Button>
//                     )}
//                 </div>
//             </CardHeader>

//             <CardContent className="p-6">
//                 <div className="grid gap-2">
//                     <AnimatePresence mode="popLayout">
//                         {students.length > 0 ? (
//                             students.map((student, index) => (
//                                 <motion.div
//                                     key={student.id}
//                                     initial={{ opacity: 0, y: 10 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     transition={{ delay: index * 0.04 }}
//                                 >
//                                     <StudentCard
//                                         student={student}
//                                         onMenuClick={onStudentMenuClick}
//                                     />
//                                 </motion.div>
//                             ))
//                         ) : (
//                             <div className="flex flex-col items-center justify-center py-12 text-center">
//                                 <div className="mb-4 rounded-full bg-slate-50 p-4">
//                                     <Users className="h-8 w-8 text-slate-300" />
//                                 </div>
//                                 <p className="text-sm font-bold text-slate-500">No students enrolled yet.</p>
//                             </div>
//                         )}
//                     </AnimatePresence>
//                 </div>
//             </CardContent>

//             {/* Performance Summary Footer */}
//             {students.length > 0 && (
//                 <div className="flex items-center justify-between border-t border-slate-50 bg-slate-50/30 px-8 py-4">
//                     <div className="flex items-center gap-4">
//                         <div className="flex flex-col">
//                             <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Class Average</span>
//                             <span className="text-sm font-bold text-slate-900">{classAverage}%</span>
//                         </div>
//                         <div className="h-8 w-[1px] bg-slate-200" />
//                         <div className="flex flex-col">
//                             <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status</span>
//                             <span className="text-sm font-bold text-emerald-600 italic">On Track</span>
//                         </div>
//                     </div>
//                     <Button variant="link" className="text-xs font-bold text-indigo-600">
//                         View Analytics Report
//                     </Button>
//                 </div>
//             )}
//         </Card>
//     );
// }
