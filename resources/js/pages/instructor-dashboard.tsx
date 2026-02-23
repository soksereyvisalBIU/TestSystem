import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    AlertTriangle,
    Calendar,
    FileText,
    MoreVertical,
    Plus,
    TrendingUp,
    Users,
    Inbox,
    CheckCircle2
} from 'lucide-react';
import { useMemo } from 'react';
import { route } from 'ziggy-js';

/* ----------------------------------------
 * TYPES (ALIGNED WITH OPTIMIZED CONTROLLER)
 * ------------------------------------- */

interface Student {
    id: number;
    name: string;
    email: string;
    avatar: string | null;
}

interface AttemptLastDetails {
    id: number;
    completed_at: string;
    status: string;
}

interface AssessmentAttempt {
    id: number;
    assessment_id: number;
    status: string;
    score: number;
    student: Student;
    last_attempt: AttemptLastDetails | null;
}

interface Assessment {
    id: number;
    title: string;
    type: string;
    student_assessment_attempts: AssessmentAttempt[];
}

interface Subject {
    id: number;
    class_id: number;
    name: string;
    assessments: Assessment[];
}

interface Classroom {
    id: number;
    name: string;
    code: string;
    subjects: Subject[];
    students: Student[];
}

interface Props {
    classrooms: Classroom[];
}

interface NormalizedSubmission {
    id: number;
    student: Student;
    classId: number;
    subjectId: number;
    assessmentId: number;
    classroomName: string;
    subjectName: string;
    assignment: string;
    status: string;
    score: number;
    completedAt: string | null;
}

/* ----------------------------------------
 * PERFORMANCE UTILITIES
 * ------------------------------------- */

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
});

/* ----------------------------------------
 * COMPONENT
 * ------------------------------------- */

export default function LectureDashboard({ classrooms }: Props) {
    /* ----------------------------------------
     * DATA NORMALIZATION (HIGH SPEED)
     * ------------------------------------- */

    const {
        totalStudents,
        submissions,
        pendingGrading,
        engagementRate,
        needsAttention,
    } = useMemo(() => {
        const uniqueStudents = new Map<number, Student>();
        const activeStudentIds = new Set<number>();
        const allSubmissions: NormalizedSubmission[] = [];

        // O(N) traversal using for...of for engine optimization
        for (const cls of classrooms || []) {
            const classId = cls.id;
            const className = cls.name;

            for (const student of cls.students || []) {
                uniqueStudents.set(student.id, student);
            }

            for (const subject of cls.subjects || []) {
                const subjectId = subject.id;
                const subjectName = subject.name;

                for (const assessment of subject.assessments || []) {
                    const assessmentId = assessment.id;
                    const assessmentTitle = assessment.title;

                    for (const attempt of assessment.student_assessment_attempts || []) {
                        if (attempt.student) {
                            activeStudentIds.add(attempt.student.id);
                            
                            allSubmissions.push({
                                id: attempt.id,
                                student: attempt.student,
                                classId,
                                subjectId,
                                assessmentId,
                                classroomName: className,
                                subjectName: subjectName,
                                assignment: assessmentTitle,
                                status: attempt.status,
                                score: attempt.score,
                                completedAt: attempt.last_attempt?.completed_at ?? null,
                            });
                        }
                    }
                }
            }
        }

        const pending = allSubmissions.filter(s => s.status !== 'scored');
        
        const attendance = uniqueStudents.size === 0 
            ? 0 
            : Math.round((activeStudentIds.size / uniqueStudents.size) * 100);

        const sorted = allSubmissions.sort((a, b) => {
            const dateA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
            const dateB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
            return dateB - dateA;
        });

        return {
            totalStudents: uniqueStudents.size,
            submissions: sorted.slice(0, 6),
            pendingGrading: pending.length,
            engagementRate: attendance,
            needsAttention: pending.slice(0, 4),
        };
    }, [classrooms]);

    const stats = useMemo(() => [
        {
            label: 'Total Students',
            value: totalStudents,
            icon: Users,
            color: 'text-sky-600 dark:text-sky-400',
            bg: 'bg-sky-500/10',
        },
        {
            label: 'Pending Grading',
            value: pendingGrading,
            icon: FileText,
            color: 'text-amber-600 dark:text-amber-400',
            bg: 'bg-amber-500/10',
            alert: pendingGrading > 0,
        },
        {
            label: 'Engagement Rate',
            value: `${engagementRate}%`,
            icon: TrendingUp,
            color: 'text-emerald-600 dark:text-emerald-400',
            bg: 'bg-emerald-500/10',
        },
    ], [totalStudents, pendingGrading, engagementRate]);

    return (
        <AppLayout title="Lecturer Dashboard">
            <div className="flex flex-col gap-8 p-4 sm:p-6 lg:p-10 max-w-[1600px] mx-auto w-full">
                
                {/* HEADER */}
                <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black tracking-tight">Academic Control</h1>
                        <p className="font-medium text-muted-foreground">Manage classrooms and grade assessment attempts.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="rounded-xl gap-2 font-bold shadow-sm">
                            <Calendar size={16} /> Schedule
                        </Button>
                        <Button asChild className="rounded-xl gap-2 font-bold shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5">
                            <Link href={route('instructor.classes.index')}>
                                <Plus size={16} /> My Classrooms
                            </Link>
                        </Button>
                    </div>
                </header>

                {/* STATS */}
                <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center rounded-2xl border bg-card p-5 shadow-sm"
                        >
                            <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', stat.bg, stat.color)}>
                                <stat.icon size={24} />
                            </div>
                            <div className="ml-4 flex-1">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                                <div className="flex items-center justify-between">
                                    <h3 className="text-2xl font-black">{stat.value}</h3>
                                    {stat.alert && (
                                        <span className="relative flex h-2 w-2">
                                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                                            <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
                                        </span>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    
                    {/* RECENT SUBMISSIONS */}
                    <section className="overflow-hidden rounded-3xl border bg-card lg:col-span-8 shadow-sm">
                        <div className="flex items-center justify-between border-b p-6 bg-muted/10">
                            <h3 className="text-lg font-black tracking-tight text-foreground">Recent Submissions</h3>
                            <Button variant="ghost" size="sm" className="font-bold text-primary">View All</Button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/30 text-[10px] font-black text-muted-foreground uppercase">
                                    <tr>
                                        <th className="px-6 py-4 text-left">Student</th>
                                        <th className="px-6 py-4 text-left">Assessment</th>
                                        <th className="px-6 py-4 text-left">Status</th>
                                        <th className="px-6 py-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {submissions.length > 0 ? (
                                        submissions.map((s) => (
                                            <tr key={s.id} className="hover:bg-muted/20 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="font-bold">{s.student.name}</div>
                                                    <div className="text-[10px] text-muted-foreground">{s.classroomName}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-muted-foreground">{s.assignment}</div>
                                                    <div className="text-[10px] font-bold text-primary/70">{s.subjectName}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={cn(
                                                        'rounded-md px-2 py-1 text-[10px] font-black uppercase ring-1 ring-inset',
                                                        s.status === 'scored' 
                                                            ? 'bg-emerald-500/10 text-emerald-600 ring-emerald-500/20' 
                                                            : 'bg-amber-500/10 text-amber-600 ring-amber-500/20'
                                                    )}>
                                                        {s.status === 'scored' ? `Graded: ${s.score}%` : 'Pending'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <Button asChild size="sm" variant={s.status === 'scored' ? "ghost" : "default"} className="font-bold rounded-lg transition-all group-hover:scale-105">
                                                        <Link href={route('instructor.classes.subjects.assessments.students.show', { 
                                                            class: s.classId, 
                                                            subject: s.subjectId, 
                                                            assessment: s.assessmentId, 
                                                            student: s.student.id 
                                                        })}>
                                                            {s.status === 'scored' ? 'View' : 'Grade'}
                                                        </Link>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground italic">No submissions found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* ACTION ITEMS */}
                    <aside className="lg:col-span-4 flex flex-col gap-6">
                        <div className="rounded-3xl border bg-card p-6 shadow-sm">
                            <div className="mb-6 flex items-center gap-2 text-amber-500">
                                <AlertTriangle size={20} strokeWidth={3} />
                                <h3 className="text-lg font-black text-foreground">Needs Attention</h3>
                            </div>

                            <div className="space-y-3">
                                {needsAttention.map((s) => (
                                    <div key={`attn-${s.id}`} className="flex items-center justify-between rounded-2xl bg-muted/40 p-4 border border-border/50">
                                        <div>
                                            <p className="text-sm font-bold">{s.student.name}</p>
                                            <p className="text-[10px] font-black text-destructive uppercase tracking-tighter">Review Pending</p>
                                        </div>
                                        <Button asChild variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                            <Link href={route('instructor.classes.subjects.assessments.students.show', { 
                                                class: s.classId, subject: s.subjectId, assessment: s.assessmentId, student: s.student.id 
                                            })}>
                                                <MoreVertical size={16} />
                                            </Link>
                                        </Button>
                                    </div>
                                ))}
                                {needsAttention.length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-6 text-center">
                                        <CheckCircle2 className="text-emerald-500 mb-2 opacity-20" size={32} />
                                        <p className="text-xs font-bold text-muted-foreground">Clear for now!</p>
                                    </div>
                                )}
                            </div>

                            <Button variant="outline" className="mt-6 w-full rounded-xl border-dashed border-2 py-6 text-xs font-bold text-muted-foreground hover:bg-muted/50 transition-colors">
                                Full Performance Analytics
                            </Button>
                        </div>
                    </aside>

                </div>
            </div>
        </AppLayout>
    );
}