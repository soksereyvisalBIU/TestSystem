import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    AlertCircle,
    ArrowRight,
    ArrowUpRight,
    CheckCircle2,
    ChevronRight,
    Clock,
    Compass,
    GraduationCap,
    Plus,
    Rocket,
    Target,
    Timer,
    TrendingUp,
    Zap,
} from 'lucide-react';
import { useMemo, useState } from 'react';

export default function StudentDashboard({ student }) {
    // --- 1. CORE DATA INITIALIZATION ---
    const classrooms = student?.student_classrooms || [];
    const submissions = student?.student_assessment || [];
    const isNewUser = classrooms.length === 0;

    // UI State
    const [activeClassIndex, setActiveClassIndex] = useState(0);
    const activeClass = classrooms[activeClassIndex];

    // --- 2. INTELLIGENT DATA CALCULATIONS ---
    const { globalStats, liveMissions } = useMemo(() => {
        const now = new Date();
        const missions = [];
        const scored = submissions.filter((s) => s.status === 'scored');

        // Calculate Global GPA
        const avg =
            scored.length > 0
                ? scored.reduce(
                      (acc, curr) => acc + parseFloat(curr.score),
                      0,
                  ) / scored.length
                : 0;

        // Scan all classrooms for time-sensitive "Live" assessments
        classrooms.forEach((cls) => {
            cls.subjects.forEach((sub) => {
                sub.assessments.forEach((assess) => {
                    const start = new Date(assess.start_time);
                    const end = new Date(assess.end_time);
                    const submission = submissions.find(
                        (s) => s.assessment_id === assess.id,
                    );

                    if (
                        now >= start &&
                        now <= end &&
                        (!submission || submission.status !== 'scored')
                    ) {
                        missions.push({
                            ...assess,
                            subjectName: sub.name,
                            classId: cls.id,
                            subjectId: sub.id,
                            submission: submission,
                        });
                    }
                });
            });
        });

        return {
            globalStats: {
                avg: avg.toFixed(1),
                completed: scored.length,
                peak:
                    scored.length > 0
                        ? Math.max(...scored.map((s) => parseFloat(s.score)))
                        : 0,
            },
            liveMissions: missions,
        };
    }, [classrooms, submissions]);

    return (
        <AppLayout>
            <Head title="Scholar Dashboard | Mission Control" />

            <div className="relative container mx-auto space-y-10 p-4 md:p-8 lg:p-12">
                {/* --- HEADER: IDENTITY & GLOBAL STATS --- */}
                <header className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
                            </span>
                            <p className="text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase">
                                {isNewUser
                                    ? 'System Standby'
                                    : 'Academic Session Active'}
                            </p>
                        </div>
                        <h1 className="text-5xl leading-none font-[1000] tracking-tighter text-title md:text-7xl">
                            {isNewUser ? 'Begin,' : 'Hello,'}{' '}
                            <span className="relative text-primary italic">
                                {student.name.split(' ')[0]}
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

                    {!isNewUser && (
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
                    )}
                </header>

                {isNewUser ? (
                    /* --- SCENARIO A: THE ONBOARDING EXPERIENCE --- */
                    <EmptyStateView />
                ) : (
                    /* --- SCENARIO B: THE FULL POWER DASHBOARD --- */
                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
                        {/* LEFT COLUMN: LIVE TASKS & CLASSROOM EXPLORER */}
                        <div className="space-y-12 lg:col-span-8">
                            {/* 1. LIVE MISSIONS (URGENT) */}
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
                                        {liveMissions.map((task) => (
                                            <Link
                                                key={task.id}
                                                href={`/student/classes/${task.classId}/subjects/${task.subjectId}/assessment/${task.id}`}
                                                className="group relative flex flex-col items-center justify-between rounded-[2rem] border-2 border-rose-100 bg-rose-50 p-6 transition-all duration-300 hover:border-rose-300 hover:bg-rose-100 md:flex-row"
                                            >
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="rounded bg-rose-500 px-2 py-0.5 text-[9px] font-black text-white uppercase">
                                                            {task.type}
                                                        </span>
                                                        <span className="text-xs font-bold text-rose-700 underline decoration-rose-200">
                                                            {task.subjectName}
                                                        </span>
                                                    </div>
                                                    <h4 className="text-xl font-black text-rose-950">
                                                        {task.title}
                                                    </h4>
                                                    <p className="flex items-center gap-1 text-[10px] font-bold text-rose-600 uppercase">
                                                        <Timer size={12} />{' '}
                                                        Deadline:{' '}
                                                        {new Date(
                                                            task.end_time,
                                                        ).toLocaleString()}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2 rounded-2xl bg-rose-500 px-8 py-3 text-sm font-black text-white transition-all group-hover:bg-rose-600">
                                                    {task.submission?.status ===
                                                    'draft'
                                                        ? 'RESUME'
                                                        : 'START NOW'}{' '}
                                                    <ArrowRight size={18} />
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* 2. CLASSROOM NAVIGATOR */}
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
                                    {classrooms.map((cls, idx) => (
                                        <button
                                            key={cls.id}
                                            onClick={() =>
                                                setActiveClassIndex(idx)
                                            }
                                            className={`flex flex-shrink-0 flex-col items-start rounded-[2.5rem] border-2 px-8 py-5 transition-all duration-300 ${
                                                activeClassIndex === idx
                                                    ? 'scale-105 border-primary bg-primary text-white shadow-2xl shadow-primary/30'
                                                    : 'border-border bg-card text-title hover:border-primary/50'
                                            }`}
                                        >
                                            <span className="text-[10px] font-black uppercase opacity-60">
                                                Year {cls.year} • Sem{' '}
                                                {cls.semester}
                                            </span>
                                            <span className="text-xl font-black whitespace-nowrap">
                                                {cls.name}
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

                            {/* 3. SUBJECTS GRID */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeClass.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
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
                                                initial={{
                                                    scale: 0.95,
                                                    opacity: 0,
                                                }}
                                                animate={{
                                                    scale: 1,
                                                    opacity: 1,
                                                }}
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
                                                        This classroom doesn’t
                                                        have any subjects
                                                        assigned yet. Once your
                                                        teacher adds them, they
                                                        will appear here.
                                                    </p>
                                                </div>
                                            </motion.div>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* RIGHT COLUMN: IDENTITY & ANALYTICS */}
                        <div className="space-y-8 lg:col-span-4">
                            {/* DIGITAL SCHOLAR ID */}
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
                                            <p className="font-mono text-sm">
                                                #{student.id}992026
                                            </p>
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
                                            <p className="text-[10px] font-bold opacity-50">
                                                COMPLETED
                                            </p>
                                            {/* <p className="text-xl font-black">{stats.completed} Tasks</p> */}
                                        </div>
                                        <div>
                                            <p className="text-right text-[10px] font-bold opacity-50">
                                                PEAK SCORE
                                            </p>
                                            {/* <p className="text-xl font-black text-emerald-400">{stats.highest}%</p> */}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* PROGRESS PULSE */}
                            <div className="space-y-6 rounded-[3rem] border border-border bg-card p-8">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-black tracking-widest text-muted-foreground uppercase">
                                        Quick Stats
                                    </h4>
                                    <TrendingUp
                                        size={18}
                                        className="text-primary"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="rounded-3xl bg-muted/40 p-4">
                                        <p className="text-[10px] font-black text-muted-foreground uppercase">
                                            Subjects
                                        </p>
                                        <p className="text-2xl font-black text-title">
                                            {activeClass.subjects.length}
                                        </p>
                                    </div>
                                    <div className="rounded-3xl bg-muted/40 p-4">
                                        <p className="text-[10px] font-black text-muted-foreground uppercase">
                                            Tasks Done
                                        </p>
                                        <p className="text-2xl font-black text-title">
                                            {globalStats.completed}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-8 rounded-[2.5rem] border border-border bg-card p-8 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-black text-title italic">
                                        Up Comming
                                    </h3>
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-black">
                                        {
                                            activeClass.subjects.flatMap(
                                                (s) => s.assessments,
                                            ).length
                                        }
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    {activeClass.subjects.flatMap(
                                        (s) => s.assessments,
                                    ).length > 0 ? (
                                        activeClass.subjects
                                            .flatMap((s) => s.assessments)
                                            .slice(0, 4)
                                            .map((task, i) => {
                                                const sub = submissions.find(
                                                    (s) =>
                                                        s.assessment_id ===
                                                        task.id,
                                                );

                                                return (
                                                    <div
                                                        key={i}
                                                        className="group flex gap-4"
                                                    >
                                                        <div className="flex flex-col items-center">
                                                            <div
                                                                className={`h-3 w-3 rounded-full border-2 ${
                                                                    sub
                                                                        ? 'border-emerald-500 bg-emerald-500'
                                                                        : 'border-primary'
                                                                }`}
                                                            />
                                                            <div className="mt-2 h-full w-px bg-border" />
                                                        </div>

                                                        <div className="pb-4">
                                                            <p className="text-[10px] font-black text-muted-foreground uppercase">
                                                                {new Date(
                                                                    task.end_time,
                                                                ).toLocaleDateString()}
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
                                                <div className="text-4xl">
                                                    📝
                                                </div>
                                                <h4 className="text-sm font-black text-title">
                                                    No tasks yet
                                                </h4>
                                                <p className="max-w-xs text-xs text-muted-foreground">
                                                    This classroom doesn’t have
                                                    any assignments, quizzes, or
                                                    exams yet. They will appear
                                                    here once your teacher adds
                                                    them.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

// --- SUB-COMPONENTS ---

function SubjectCard({ subject, classId, submissions }) {
    return (
        <div className="group flex flex-col justify-between rounded-[2.5rem] border border-border bg-card p-7 transition-all hover:border-primary/50 hover:shadow-2xl">
            <div>
                <div className="mb-6 flex items-start justify-between">
                    <div className="h-16 w-16 overflow-hidden rounded-[1.25rem] border-2 border-border shadow-inner">
                        <img
                            src={`/storage/${subject.cover}`}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                            onError={(e) =>
                                (e.target.src = `https://ui-avatars.com/api/?name=${subject.name}&background=6366f1&color=fff&bold=true`)
                            }
                        />
                    </div>
                    <Link
                        href={`/student/classes/${classId}/subjects/${subject.id}`}
                        className="rounded-2xl bg-muted p-3 text-muted-foreground shadow-sm transition-all hover:bg-primary hover:text-white"
                    >
                        <ChevronRight size={20} />
                    </Link>
                </div>
                <h4 className="mb-2 text-2xl leading-none font-black tracking-tight text-title">
                    {subject.name}
                </h4>
                <p className="line-clamp-2 text-sm leading-relaxed font-medium text-muted-foreground">
                    {subject.description}
                </p>
            </div>

            <div className="mt-8 space-y-3">
                {subject.assessments.slice(0, 2).map((assess) => {
                    const sub = submissions.find(
                        (s) => s.assessment_id === assess.id,
                    );
                    return (
                        <Link
                            key={assess.id}
                            href={`/student/classes/${classId}/subjects/${subject.id}/assessment/${assess.id}`}
                            className="group/task flex items-center justify-between rounded-2xl bg-muted/30 p-4 transition-all hover:bg-muted"
                        >
                            <div className="flex items-center gap-3">
                                {sub?.status === 'scored' ? (
                                    <CheckCircle2
                                        size={16}
                                        className="text-emerald-500"
                                    />
                                ) : (
                                    <Clock
                                        size={16}
                                        className="text-amber-500"
                                    />
                                )}
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-title">
                                        {assess.title}
                                    </span>
                                    <span className="text-[9px] font-black uppercase opacity-40">
                                        {assess.type}
                                    </span>
                                </div>
                            </div>
                            {sub?.status === 'scored' ? (
                                <span className="text-xs font-black text-emerald-600">
                                    {sub.score}%
                                </span>
                            ) : (
                                <ArrowUpRight
                                    size={14}
                                    className="opacity-0 transition-all group-hover/task:opacity-100"
                                />
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

function EmptyStateView() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 gap-8 py-10 md:grid-cols-2"
        >
            <div className="relative flex min-h-[500px] flex-col items-start justify-between overflow-hidden rounded-[4rem] bg-slate-950 p-12 text-white md:p-16">
                <Rocket className="absolute -right-10 -bottom-10 h-80 w-80 -rotate-12 text-primary/10" />
                <div className="relative z-10 space-y-8">
                    <div className="flex h-20 w-20 items-center justify-center rounded-[2rem] bg-primary shadow-2xl shadow-primary/40">
                        <Plus size={40} strokeWidth={3} />
                    </div>
                    <h2 className="text-6xl leading-[0.9] font-[1000] tracking-tighter text-primary">
                        Ready to <br /> Launch?
                    </h2>
                    <p className="max-w-xs text-lg leading-relaxed font-medium text-slate-400">
                        Join your first classroom to access personalized
                        subjects, track your GPA, and unlock your scholar
                        roadmap.
                    </p>
                    <Link
                        href="/student/classes"
                        className="group inline-flex items-center gap-4 rounded-[2rem] bg-white px-10 py-5 font-black text-slate-950 transition-all hover:bg-primary hover:text-white"
                    >
                        Browse Classrooms{' '}
                        <ArrowRight
                            size={22}
                            className="transition-transform group-hover:translate-x-2"
                        />
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <OnboardingCard
                    icon={Compass}
                    title="Explore Curriculum"
                    desc="Join classes to sync your subjects with the latest 2026 semester requirements."
                    color="text-indigo-500"
                    bg="bg-indigo-500/10"
                />
                <OnboardingCard
                    icon={Target}
                    title="Track Performance"
                    desc="Real-time analytics will appear here as you complete assessments and quizzes."
                    color="text-emerald-500"
                    bg="bg-emerald-500/10"
                />
                <OnboardingCard
                    icon={Zap}
                    title="Live Missions"
                    desc="Get instant notifications for time-sensitive exams and homework assignments."
                    color="text-amber-500"
                    bg="bg-amber-500/10"
                />
            </div>
        </motion.div>
    );
}

function OnboardingCard({ icon: Icon, title, desc, color, bg }) {
    return (
        <div className="flex items-center gap-8 rounded-[3rem] border border-border bg-card p-8 transition-all hover:border-primary/30">
            <div
                className={`h-20 w-20 flex-shrink-0 rounded-[2rem] ${bg} flex items-center justify-center ${color}`}
            >
                <Icon size={32} />
            </div>
            <div>
                <h4 className="text-2xl font-black tracking-tight text-title">
                    {title}
                </h4>
                <p className="mt-1 text-sm leading-relaxed font-medium text-muted-foreground">
                    {desc}
                </p>
            </div>
        </div>
    );
}
