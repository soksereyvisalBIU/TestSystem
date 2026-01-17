import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    AlertCircle,
    ArrowRight,
    GraduationCap,
    Plus,
    Timer,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import EmptyStateView from './dashboard/student/EmptyStateView';
import SubjectCard from './dashboard/student/subject-card';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface Assessment {
    id: number;
    title: string;
    type: string;
    start_time: string;
    end_time: string;
}

interface Subject {
    id: number;
    name: string;
    assessments: Assessment[];
}

interface Classroom {
    id: number;
    name: string;
    year: number;
    semester: number;
    subjects: Subject[];
}

interface Submission {
    assessment_id: number;
    status: 'draft' | 'submitted' | 'scored';
    score?: number;
}

interface Student {
    id: number;
    name: string;
    email: string;
    student_classrooms?: Classroom[];
    student_assessment?: Submission[];
}

interface LiveMission extends Assessment {
    subjectName: string;
    classId: number;
    subjectId: number;
    submission?: Submission;
}

interface GlobalStats {
    avg: string;
    completed: number;
    peak: number;
}

interface DashboardData {
    globalStats: GlobalStats;
    liveMissions: LiveMission[];
}

interface StudentDashboardProps {
    student: Student;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const ANIMATION_VARIANTS = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
} as const;

const STATUS_STYLES = {
    draft: 'RESUME',
    default: 'START NOW',
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Calculates global statistics from scored submissions
 */
const calculateGlobalStats = (submissions: Submission[]): GlobalStats => {
    const scoredSubmissions = submissions.filter((s) => s.status === 'scored');
    
    if (scoredSubmissions.length === 0) {
        return { avg: '0.0', completed: 0, peak: 0 };
    }

    const scores = scoredSubmissions.map((s) => parseFloat(s.score?.toString() ?? '0'));
    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const peak = Math.max(...scores);

    return {
        avg: average.toFixed(1),
        completed: scoredSubmissions.length,
        peak,
    };
};

/**
 * Identifies live assessments that are currently active and incomplete
 */
const findLiveMissions = (
    classrooms: Classroom[],
    submissions: Submission[]
): LiveMission[] => {
    const now = new Date();
    const missions: LiveMission[] = [];

    classrooms.forEach((classroom) => {
        classroom.subjects.forEach((subject) => {
            subject.assessments.forEach((assessment) => {
                const startTime = new Date(assessment.start_time);
                const endTime = new Date(assessment.end_time);
                const submission = submissions.find(
                    (s) => s.assessment_id === assessment.id
                );

                const isActive = now >= startTime && now <= endTime;
                const isIncomplete = !submission || submission.status !== 'scored';

                if (isActive && isIncomplete) {
                    missions.push({
                        ...assessment,
                        subjectName: subject.name,
                        classId: classroom.id,
                        subjectId: subject.id,
                        submission,
                    });
                }
            });
        });
    });

    return missions;
};

/**
 * Formats date string to locale date string
 */
const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
};

/**
 * Formats date string to locale date time string
 */
const formatDateTime = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
};

// ============================================================================
// COMPONENT: LiveMissionCard
// ============================================================================

interface LiveMissionCardProps {
    mission: LiveMission;
}

const LiveMissionCard = ({ mission }: LiveMissionCardProps) => {
    const actionText = mission.submission?.status === 'draft' 
        ? STATUS_STYLES.draft 
        : STATUS_STYLES.default;

    return (
        <Link
            href={`/student/classes/${mission.classId}/subjects/${mission.subjectId}/assessment/${mission.id}`}
            className="group relative flex flex-col items-center justify-between rounded-[2rem] border-2 border-rose-100 bg-rose-50 p-6 transition-all duration-300 hover:border-rose-300 hover:bg-rose-100 md:flex-row"
        >
            <div className="space-y-1">
                <div className="flex items-center gap-2">
                    <span className="rounded bg-rose-500 px-2 py-0.5 text-[9px] font-black text-white uppercase">
                        {mission.type}
                    </span>
                    <span className="text-xs font-bold text-rose-700 underline decoration-rose-200">
                        {mission.subjectName}
                    </span>
                </div>
                <h4 className="text-xl font-black text-rose-950">
                    {mission.title}
                </h4>
                <p className="flex items-center gap-1 text-[10px] font-bold text-rose-600 uppercase">
                    <Timer size={12} />
                    Deadline: {formatDateTime(mission.end_time)}
                </p>
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-rose-500 px-8 py-3 text-sm font-black text-white transition-all group-hover:bg-rose-600">
                {actionText} <ArrowRight size={18} />
            </div>
        </Link>
    );
};

// ============================================================================
// COMPONENT: ClassroomNavigator
// ============================================================================

interface ClassroomNavigatorProps {
    classrooms: Classroom[];
    activeIndex: number;
    onClassChange: (index: number) => void;
}

const ClassroomNavigator = ({
    classrooms,
    activeIndex,
    onClassChange,
}: ClassroomNavigatorProps) => (
    <section className="space-y-6">
        <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-black tracking-widest text-muted-foreground uppercase">
                Classroom Navigator
            </h3>
            <Link
                href="/student/classes"
                className="text-xs font-bold text-primary hover:underline"
            >
                View All Classes
            </Link>
        </div>
        <div className="no-scrollbar flex items-center gap-4 overflow-x-auto p-3">
            {classrooms.map((classroom, index) => (
                <button
                    key={classroom.id}
                    onClick={() => onClassChange(index)}
                    className={`flex flex-shrink-0 flex-col items-start rounded-[2.5rem] border-2 px-8 py-3 transition-all duration-300 ${
                        activeIndex === index
                            ? 'scale-105 border-primary bg-primary text-white shadow-2xl shadow-primary/30'
                            : 'border-border bg-card text-title hover:border-primary/50'
                    }`}
                >
                    <span className="text-[10px] font-black uppercase opacity-60">
                        Year {classroom.year} • Sem {classroom.semester}
                    </span>
                    <span className="text-lg font-black whitespace-nowrap">
                        {classroom.name}
                    </span>
                </button>
            ))}
            <Link
                href="/student/classes"
                className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full border-2 border-dashed border-border text-muted-foreground transition-all hover:border-primary hover:text-primary"
            >
                <Plus size={24} />
            </Link>
        </div>
    </section>
);

// ============================================================================
// COMPONENT: StatsDisplay
// ============================================================================

interface StatsDisplayProps {
    globalStats: GlobalStats;
}

const StatsDisplay = ({ globalStats }: StatsDisplayProps) => (
    <div className="flex items-center gap-4 rounded-3xl border border-border bg-card/50 p-2 shadow-xl backdrop-blur-xl">
        <div className="border-r border-border px-6 py-2 text-center">
            <p className="text-[10px] font-black text-muted-foreground uppercase">
                Global GPA
            </p>
            <p className="text-2xl font-black text-primary">
                {globalStats.avg}%
            </p>
        </div>
        <div className="px-6 py-2 text-center">
            <p className="text-[10px] font-black text-muted-foreground uppercase">
                Peak Score
            </p>
            <p className="text-2xl font-black text-emerald-500">
                {globalStats.peak}%
            </p>
        </div>
    </div>
);

// ============================================================================
// COMPONENT: StudentIdentityCard
// ============================================================================

interface StudentIdentityCardProps {
    student: Student;
}

const StudentIdentityCard = ({ student }: StudentIdentityCardProps) => (
    <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-600 to-violet-800 p-8 text-white shadow-2xl">
        <div className="absolute top-0 right-0 p-4 opacity-10">
            <GraduationCap size={120} />
        </div>
        <div className="relative z-10 space-y-12">
            <div className="flex justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 font-black backdrop-blur-md">
                    {student.name.charAt(0)}
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black tracking-widest uppercase opacity-50">
                        Scholar ID
                    </p>
                    <p className="font-mono text-sm">#{student.id}992026</p>
                </div>
            </div>
            <div>
                <p className="text-[10px] font-black uppercase opacity-50">
                    Student Name
                </p>
                <h3 className="text-3xl font-black tracking-tight">
                    {student.name}
                </h3>
                <p className="mt-1 text-xs font-bold tracking-tighter uppercase opacity-60">
                    {student.email}
                </p>
            </div>
            <div className="flex items-center justify-between border-t border-white/10 pt-6">
                <div>
                    <p className="text-[10px] font-bold opacity-50">COMPLETED</p>
                </div>
                <div>
                    <p className="text-right text-[10px] font-bold opacity-50">
                        PEAK SCORE
                    </p>
                </div>
            </div>
        </div>
    </div>
);

// ============================================================================
// COMPONENT: UpcomingTasks
// ============================================================================

interface UpcomingTasksProps {
    classroom: Classroom;
    submissions: Submission[];
}

const UpcomingTasks = ({ classroom, submissions }: UpcomingTasksProps) => {
    const allAssessments = classroom.subjects.flatMap((s) => s.assessments);
    const taskCount = allAssessments.length;
    const displayTasks = allAssessments.slice(0, 4);

    return (
        <div className="space-y-8 rounded-[2.5rem] border border-border bg-card p-8 shadow-sm">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-title italic">
                    Upcoming
                </h3>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-black">
                    {taskCount}
                </div>
            </div>
            <div className="space-y-6">
                {taskCount > 0 ? (
                    displayTasks.map((task, index) => {
                        const submission = submissions.find(
                            (s) => s.assessment_id === task.id
                        );

                        return (
                            <div key={task.id} className="group flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div
                                        className={`h-3 w-3 rounded-full border-2 ${
                                            submission
                                                ? 'border-emerald-500 bg-emerald-500'
                                                : 'border-primary'
                                        }`}
                                    />
                                    {index < displayTasks.length - 1 && (
                                        <div className="mt-2 h-full w-px bg-border" />
                                    )}
                                </div>
                                <div className="pb-4">
                                    <p className="text-[10px] font-black text-muted-foreground uppercase">
                                        {formatDate(task.end_time)}
                                    </p>
                                    <h4 className="text-sm font-bold text-title transition-colors group-hover:text-primary">
                                        {task.title}
                                    </h4>
                                    <span className="text-[9px] font-black text-primary/60 uppercase">
                                        {task.type}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
                        <div className="flex flex-col items-center gap-3">
                            <div className="text-4xl">📝</div>
                            <h4 className="text-sm font-black text-title">
                                No tasks yet
                            </h4>
                            <p className="max-w-xs text-xs text-muted-foreground">
                                This classroom doesn't have any assignments,
                                quizzes, or exams yet. They will appear here once
                                your teacher adds them.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// ============================================================================
// MAIN COMPONENT: StudentDashboard
// ============================================================================

export default function StudentDashboard({ student }: StudentDashboardProps) {
    // Data initialization
    const classrooms = student?.student_classrooms ?? [];
    const submissions = student?.student_assessment ?? [];
    const isNewUser = classrooms.length === 0;

    // UI state
    const [activeClassIndex, setActiveClassIndex] = useState(0);
    const activeClass = classrooms[activeClassIndex];

    // Computed data
    const { globalStats, liveMissions } = useMemo<DashboardData>(() => {
        return {
            globalStats: calculateGlobalStats(submissions),
            liveMissions: findLiveMissions(classrooms, submissions),
        };
    }, [classrooms, submissions]);

    // Derived data
    const firstName = student.name.split(' ')[0];
    const greetingText = isNewUser ? 'Begin,' : 'Hello,';
    const statusText = isNewUser ? 'System Standby' : 'Academic Session Active';

    return (
        <AppLayout>
            <Head title="Scholar Dashboard | Mission Control" />

            <div className="relative container mx-auto space-y-10 p-4 md:p-8 lg:p-12">
                {/* Header Section */}
                <header className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                            </span>
                            <p className="text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase">
                                {statusText}
                            </p>
                        </div>
                        <h1 className="flex items-center gap-4 text-5xl leading-none font-[1000] tracking-tighter text-title md:text-7xl">
                            {greetingText}{' '}
                            <span className="relative text-primary italic">
                                {firstName}
                                <svg
                                    className="absolute -bottom-2 left-0 w-full"
                                    viewBox="0 0 100 10"
                                    preserveAspectRatio="none"
                                >
                                    <path
                                        d="M0 5 Q 25 0, 50 5 T 100 5"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        fill="none"
                                        className="opacity-30"
                                    />
                                </svg>
                            </span>
                        </h1>
                    </div>

                    {!isNewUser && <StatsDisplay globalStats={globalStats} />}
                </header>

                {/* Main Content */}
                {isNewUser ? (
                    <EmptyStateView />
                ) : (
                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
                        {/* Left Column */}
                        <div className="space-y-12 lg:col-span-8">
                            {/* Live Missions Section */}
                            {liveMissions.length > 0 && (
                                <section className="space-y-4">
                                    <div className="flex items-center gap-2 px-1">
                                        <AlertCircle
                                            size={16}
                                            className="animate-pulse text-rose-500"
                                        />
                                        <h3 className="text-sm font-black tracking-widest text-rose-500 uppercase">
                                            Live Missions Due Soon
                                        </h3>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        {liveMissions.map((mission) => (
                                            <LiveMissionCard
                                                key={mission.id}
                                                mission={mission}
                                            />
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Classroom Navigator */}
                            <ClassroomNavigator
                                classrooms={classrooms}
                                activeIndex={activeClassIndex}
                                onClassChange={setActiveClassIndex}
                            />

                            {/* Subjects Grid */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeClass.id}
                                    initial={ANIMATION_VARIANTS.initial}
                                    animate={ANIMATION_VARIANTS.animate}
                                    exit={ANIMATION_VARIANTS.exit}
                                    className="grid grid-cols-1 gap-6 md:grid-cols-2"
                                >
                                    {activeClass.subjects.length > 0 ? (
                                        activeClass.subjects.map((subject) => (
                                            <SubjectCard
                                                key={subject.id}
                                                subject={subject}
                                                classId={activeClass.id}
                                                submissions={submissions}
                                            />
                                        ))
                                    ) : (
                                        <div className="col-span-full">
                                            <motion.div
                                                initial={{ scale: 0.95, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                className="w-full rounded-3xl border border-dashed border-border bg-card p-12 text-center shadow-sm"
                                            >
                                                <div className="flex flex-col items-center gap-4">
                                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                        📚
                                                    </div>
                                                    <h3 className="text-xl font-black text-title">
                                                        No subjects yet
                                                    </h3>
                                                    <p className="max-w-md text-sm text-muted-foreground">
                                                        This classroom doesn't have any
                                                        subjects assigned yet. Once your
                                                        teacher adds them, they will appear
                                                        here.
                                                    </p>
                                                </div>
                                            </motion.div>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-8 lg:col-span-4">
                            <StudentIdentityCard student={student} />
                            <UpcomingTasks
                                classroom={activeClass}
                                submissions={submissions}
                            />
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}