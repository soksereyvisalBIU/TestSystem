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
import { useState } from 'react';

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

    const filtered = students.filter(
        (s) =>
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.email.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return (
        <Card className="overflow-hidden gap-0 rounded-[2rem] bg-card shadow-none">
            <CardHeader className="flex flex-col gap-4 space-y-0 pb-8 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                    <CardTitle className="text-2xl font-black tracking-tight text-title">
                        Classmates
                    </CardTitle>
                    <CardDescription className="text-sm font-medium text-description">
                        Managing {students.length} active students in this
                        classroom.
                    </CardDescription>
                </div>

                {/* Action & Search Area */}
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-description" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="h-10 rounded-full border-none bg-muted/50 pr-4 pl-10 text-sm font-bold text-title placeholder:text-description focus:ring-2 focus:ring-primary/20"
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button
                        size="icon"
                        className="h-10 w-10 rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105"
                    >
                        <UserPlus className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>

            <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <AnimatePresence mode="popLayout">
                        {filtered.map((student, i) => (
                            <StudentCard
                                key={student.id}
                                student={student}
                                index={i}
                            />
                        ))}
                    </AnimatePresence>
                </div>

                {filtered.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="mb-4 rounded-full bg-muted p-4">
                            <Users className="h-8 w-8 text-description" />
                        </div>
                        <p className="font-black text-title">
                            No classmates found
                        </p>
                        <p className="text-sm font-medium text-description">
                            Try a different search term.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function StudentCard({ student, index }: { student: Student; index: number }) {
    const initials = student.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{
                delay: index * 0.05,
                type: 'spring',
                stiffness: 100,
                damping: 15,
            }}
            className="group relative flex items-center gap-4 rounded-[1.5rem] bg-muted/30 p-4 transition-all duration-300 hover:bg-muted/60"
        >
            {/* Avatar Container */}
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border-2 border-background shadow-sm">
                {student.avatar ? (
                    <img
                        src={student.avatar}
                        alt={student.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-primary text-sm font-black text-primary-foreground">
                        {initials}
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
                <h4 className="truncate text-sm font-black tracking-tight text-title">
                    {student.name}
                </h4>
                <div className="flex items-center gap-1.5 text-xs font-bold text-description">
                    <Mail className="h-3 w-3" />
                    <span className="truncate">{student.email}</span>
                </div>
            </div>

            {/* Hover Arrow Action */}
            <div className="opacity-0 transition-opacity group-hover:opacity-100">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background text-title shadow-sm">
                    <ArrowUpRight className="h-4 w-4" />
                </div>
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
