import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowRight,
    ArrowUpRight,
    BookOpen,
    CheckCircle2,
    ChevronRight,
    Compass,
    GraduationCap,
    Plus,
    Rocket,
    Sparkles,
    Target,
    Timer,
    TrendingUp,
    Zap,
} from 'lucide-react';
import { useMemo, useState } from 'react';

export default function StudentDashboard({ student }) {
    // --- 1. CORE DATA & TIME LOGIC ---
    const classrooms = student?.student_classrooms || [];
    const submissions = student?.student_assessment || [];
    const isNewUser = classrooms.length === 0;
    const [activeClassIndex, setActiveClassIndex] = useState(0);
    const activeClass = classrooms[activeClassIndex];

    const greeting = useMemo(() => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    }, []);

    // --- 2. INTELLIGENT ANALYTICS ENGINE ---
    const { globalStats, liveMissions } = useMemo(() => {
        const now = new Date();
        const missions = [];
        const scored = submissions.filter((s) => s.status === 'scored');

        const avg =
            scored.length > 0
                ? scored.reduce(
                      (acc, curr) => acc + parseFloat(curr.score),
                      0,
                  ) / scored.length
                : 0;

        classrooms.forEach((cls) => {
            cls.subjects?.forEach((sub) => {
                sub.assessments?.forEach((assess) => {
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
                avg: Math.round(avg),
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
            <Head title="Scholar Dashboard | Intel" />

            <div className="relative mx-auto max-w-[1400px] space-y-12 p-4 md:p-8 lg:p-10">
                {/* --- 0. BACKGROUND DECOR --- */}
                <div className="absolute top-0 left-1/2 -z-10 h-[500px] w-full -translate-x-1/2 bg-gradient-to-b from-primary/5 to-transparent opacity-50" />

                {/* --- 1. PREMIUM HEADER --- */}
                <header className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-3"
                    >
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1">
                            <Sparkles
                                size={14}
                                className="animate-pulse text-primary"
                            />
                            <span className="text-[10px] font-bold tracking-widest text-primary uppercase">
                                {isNewUser
                                    ? 'System Initialization'
                                    : 'Performance Optimized'}
                            </span>
                        </div>
                        <h1 className="text-6xl leading-[0.85] font-[1000] tracking-tight text-slate-900 md:text-7xl">
                            {greeting}, <br />
                            <span className="relative font-serif text-primary italic">
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
                    </motion.div>

                    {!isNewUser && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-1 rounded-[2.5rem] border border-slate-200 bg-white/50 p-1.5 shadow-2xl backdrop-blur-2xl"
                        >
                            <StatPill
                                label="Avg Score"
                                value={`${globalStats.avg}%`}
                                color="text-primary"
                            />
                            <div className="mx-2 h-10 w-px bg-slate-200" />
                            <StatPill
                                label="Peak"
                                value={`${globalStats.peak}%`}
                                color="text-emerald-500"
                            />
                        </motion.div>
                    )}
                </header>

                {isNewUser ? (
                    <EmptyStateView />
                ) : (
                    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
                        {/* LEFT: MISSIONS & CLASSES (8 COLS) */}
                        <div className="space-y-12 lg:col-span-8">
                            {/* LIVE MISSIONS: HIGH URGENCY */}
                            <AnimatePresence>
                                {liveMissions.length > 0 && (
                                    <section className="group relative">
                                        <div className="mb-6 flex items-center gap-3 px-2">
                                            <div className="h-2 w-2 animate-ping rounded-full bg-rose-500" />
                                            <h3 className="text-xs font-black tracking-[0.3em] text-rose-500 uppercase">
                                                Urgent Objectives
                                            </h3>
                                        </div>
                                        <div className="grid grid-cols-1 gap-4">
                                            {liveMissions.map((task, idx) => (
                                                <LiveMissionCard
                                                    key={task.id}
                                                    task={task}
                                                    index={idx}
                                                />
                                            ))}
                                        </div>
                                    </section>
                                )}
                            </AnimatePresence>

                            {/* CLASSROOM SELECTOR */}
                            <section className="space-y-6">
                                <div className="flex items-center justify-between px-2">
                                    <h3 className="text-xs font-black tracking-[0.3em] text-slate-400 uppercase">
                                        Classroom Intel
                                    </h3>
                                    <Link
                                        href="/student/classes"
                                        className="group flex items-center gap-1 text-xs font-bold text-primary italic"
                                    >
                                        Directory{' '}
                                        <ChevronRight
                                            size={14}
                                            className="transition-transform group-hover:translate-x-1"
                                        />
                                    </Link>
                                </div>
                                <div className="no-scrollbar mask-fade-right flex items-center gap-4 overflow-x-auto pb-6">
                                    {classrooms.map((cls, idx) => (
                                        <button
                                            key={cls.id}
                                            onClick={() =>
                                                setActiveClassIndex(idx)
                                            }
                                            className={`group relative flex-shrink-0 rounded-[2rem] border-2 px-10 py-6 transition-all duration-500 ${
                                                activeClassIndex === idx
                                                    ? 'scale-[1.02] border-slate-900 bg-slate-900 text-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)]'
                                                    : 'border-slate-100 bg-white text-slate-600 hover:border-primary/30'
                                            }`}
                                        >
                                            <p
                                                className={`mb-1 text-[10px] font-black uppercase opacity-50 ${activeClassIndex === idx ? 'text-primary' : ''}`}
                                            >
                                                Level {cls.year} • S
                                                {cls.semester}
                                            </p>
                                            <p className="text-xl font-black tracking-tight">
                                                {cls.name}
                                            </p>
                                            {activeClassIndex === idx && (
                                                <motion.div
                                                    layoutId="activeDot"
                                                    className="absolute -top-1 -right-1 h-4 w-4 rounded-full border-4 border-white bg-primary"
                                                />
                                            )}
                                        </button>
                                    ))}
                                    <Link
                                        href="/student/classes"
                                        className="flex h-[88px] w-[88px] flex-shrink-0 items-center justify-center rounded-full border-2 border-dashed border-slate-200 text-slate-300 transition-all hover:rotate-90 hover:border-primary hover:text-primary"
                                    >
                                        <Plus size={28} />
                                    </Link>
                                </div>
                            </section>

                            {/* SUBJECTS BENTO GRID */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeClass?.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="grid grid-cols-1 gap-6 md:grid-cols-2"
                                >
                                    {activeClass?.subjects?.map((subject) => (
                                        <SubjectCard
                                            key={subject.id}
                                            subject={subject}
                                            classId={activeClass.id}
                                            submissions={submissions}
                                        />
                                    ))}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* RIGHT: SCHOLAR PROFILE & ANALYTICS (4 COLS) */}
                        <aside className="sticky top-8 space-y-8 lg:col-span-4">
                            {/* THE MODERN IDENTITY CARD */}
                            <div className="overflow-hidden rounded-[3rem] border border-slate-200 bg-white p-1 shadow-xl">
                                <div className="relative rounded-[2.8rem] bg-slate-900 p-8 text-white">
                                    <div className="absolute top-0 right-0 rotate-12 p-6 opacity-20">
                                        <GraduationCap size={100} />
                                    </div>
                                    <div className="relative z-10 flex h-full flex-col justify-between gap-12">
                                        <div className="flex items-center justify-between">
                                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-2xl font-black shadow-lg shadow-primary/20">
                                                {student.name.charAt(0)}
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[9px] font-black text-slate-500 uppercase">
                                                    Verification
                                                </p>
                                                <p className="font-mono text-xs text-primary">
                                                    SC-{student.id}•2026
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-3xl leading-none font-black tracking-tighter">
                                                {student.name}
                                            </h3>
                                            <p className="mt-2 text-sm font-medium text-slate-400 lowercase">
                                                {student.email}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
                                            <div>
                                                <p className="text-[9px] font-black text-slate-500 uppercase">
                                                    Rank Index
                                                </p>
                                                <p className="text-lg font-black text-emerald-400">
                                                    Elite Scholar
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[9px] font-black text-slate-500 uppercase">
                                                    Credits
                                                </p>
                                                <p className="text-lg font-black">
                                                    124.5
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ANALYTICS HUD */}
                            <div className="space-y-8 rounded-[3rem] border border-slate-200 bg-white p-8 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-black tracking-[0.2em] text-slate-400 uppercase">
                                        Activity Pulse
                                    </h4>
                                    <TrendingUp
                                        size={18}
                                        className="text-primary"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <ProgressItem
                                        label="Syllabus Progress"
                                        percent={68}
                                        color="bg-primary"
                                    />
                                    <ProgressItem
                                        label="Attendance"
                                        percent={94}
                                        color="bg-emerald-500"
                                    />
                                    <ProgressItem
                                        label="Task Velocity"
                                        percent={45}
                                        color="bg-amber-500"
                                    />
                                </div>
                            </div>

                            {/* UPCOMING TIMELINE */}
                            <div className="space-y-6 rounded-[3rem] bg-slate-50 p-8">
                                <h4 className="text-xl font-black text-slate-900 italic">
                                    Timeline
                                </h4>
                                <div className="space-y-6">
                                    {activeClass?.subjects
                                        ?.flatMap((s) => s.assessments)
                                        .slice(0, 3)
                                        .map((task, i) => (
                                            <TimelineItem key={i} task={task} />
                                        ))}
                                </div>
                            </div>
                        </aside>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

// --- REFINED SUB-COMPONENTS ---

function StatPill({ label, value, color }) {
    return (
        <div className="px-6 py-3 text-center">
            <p className="mb-0.5 text-[9px] font-black tracking-tighter text-slate-400 uppercase">
                {label}
            </p>
            <p className={`text-2xl font-black ${color} tracking-tight`}>
                {value}
            </p>
        </div>
    );
}

function LiveMissionCard({ task, index }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
        >
            <Link
                href={`/student/classes/${task.classId}/subjects/${task.subjectId}/assessment/${task.id}`}
                className="group relative flex flex-col items-center justify-between overflow-hidden rounded-[2.5rem] border border-rose-100 bg-white p-2 transition-all duration-500 hover:shadow-[0_20px_50px_-20px_rgba(244,63,94,0.3)] md:flex-row"
            >
                <div className="flex items-center gap-6 p-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-[1.8rem] bg-rose-50 text-rose-500 transition-transform group-hover:scale-110">
                        <Zap size={30} fill="currentColor" />
                    </div>
                    <div>
                        <div className="mb-1 flex items-center gap-2">
                            <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[9px] font-black text-white uppercase">
                                {task.type}
                            </span>
                            <span className="text-xs font-bold text-slate-400">
                                {task.subjectName}
                            </span>
                        </div>
                        <h4 className="text-xl font-black text-slate-900 transition-colors group-hover:text-rose-600">
                            {task.title}
                        </h4>
                        <div className="mt-2 flex items-center gap-4">
                            <span className="flex items-center gap-1 text-[10px] font-bold tracking-tighter text-rose-500 uppercase">
                                <Timer size={12} /> Ends{' '}
                                {new Date(task.end_time).toLocaleTimeString(
                                    [],
                                    { hour: '2-digit', minute: '2-digit' },
                                )}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="m-2 flex items-center gap-2 rounded-[2rem] bg-slate-900 px-10 py-5 text-sm font-black text-white shadow-xl transition-all group-hover:bg-rose-500">
                    ENGAGE <ArrowRight size={18} />
                </div>
            </Link>
        </motion.div>
    );
}

function SubjectCard({ subject, classId, submissions }) {
    return (
        <div className="group flex flex-col rounded-[3rem] border border-slate-100 bg-white p-8 transition-all duration-500 hover:border-primary/20 hover:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.1)]">
            <div className="mb-8 flex items-start justify-between">
                <div className="relative">
                    <div className="h-20 w-20 overflow-hidden rounded-[2rem] border border-slate-100 bg-slate-50 p-1">
                        <img
                            src={`/storage/${subject.cover}`}
                            className="h-full w-full rounded-[1.8rem] object-cover transition-transform duration-700 group-hover:scale-110"
                            onError={(e) =>
                                (e.target.src = `https://ui-avatars.com/api/?name=${subject.name}&background=6366f1&color=fff&bold=true`)
                            }
                            alt={subject.name}
                        />
                    </div>
                </div>
                <Link
                    href={`/student/classes/${classId}/subjects/${subject.id}`}
                    className="rounded-full bg-slate-50 p-4 text-slate-400 shadow-sm transition-all hover:bg-primary hover:text-white"
                >
                    <ArrowUpRight size={24} />
                </Link>
            </div>

            <h4 className="mb-3 text-3xl leading-none font-[1000] tracking-tight text-slate-900 transition-colors group-hover:text-primary">
                {subject.name}
            </h4>
            <p className="mb-8 line-clamp-2 text-sm leading-relaxed font-medium text-slate-400">
                {subject.description}
            </p>

            <div className="mt-auto space-y-3">
                {subject.assessments?.slice(0, 2).map((assess) => {
                    const sub = submissions.find(
                        (s) => s.assessment_id === assess.id,
                    );
                    return (
                        <Link
                            key={assess.id}
                            href={`/student/classes/${classId}/subjects/${subject.id}/assessment/${assess.id}`}
                            className="group/task flex items-center justify-between rounded-[1.5rem] border border-transparent bg-slate-50/50 p-5 transition-all hover:border-slate-200 hover:bg-white"
                        >
                            <div className="flex items-center gap-4">
                                <div
                                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${sub?.status === 'scored' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}
                                >
                                    {sub?.status === 'scored' ? (
                                        <CheckCircle2 size={18} />
                                    ) : (
                                        <BookOpen size={18} />
                                    )}
                                </div>
                                <div>
                                    <p className="text-[10px] font-black tracking-tighter text-slate-400 uppercase">
                                        {assess.type}
                                    </p>
                                    <p className="text-sm font-black text-slate-900">
                                        {assess.title}
                                    </p>
                                </div>
                            </div>
                            {sub?.status === 'scored' ? (
                                <span className="rounded-lg bg-primary/10 px-3 py-1 text-sm font-black text-primary">
                                    {sub.score}%
                                </span>
                            ) : (
                                <ChevronRight
                                    size={18}
                                    className="text-slate-300 transition-transform group-hover/task:translate-x-1"
                                />
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

function ProgressItem({ label, percent, color }) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-black tracking-widest text-slate-500 uppercase">
                <span>{label}</span>
                <span>{percent}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={`h-full ${color} rounded-full`}
                />
            </div>
        </div>
    );
}

function TimelineItem({ task }) {
    return (
        <div className="group flex gap-4">
            <div className="flex flex-col items-center">
                <div className="h-3 w-3 rounded-full border-2 border-primary transition-transform group-hover:scale-125" />
                <div className="mt-2 h-full w-px bg-slate-200" />
            </div>
            <div className="pb-4">
                <p className="text-[10px] font-black text-primary uppercase">
                    {new Date(task.end_time).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                    })}
                </p>
                <h4 className="text-sm font-bold text-slate-900 transition-colors group-hover:text-primary">
                    {task.title}
                </h4>
            </div>
        </div>
    );
}

function EmptyStateView() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 gap-8 py-10 md:grid-cols-2"
        >
            <div className="relative flex min-h-[600px] flex-col items-start justify-between overflow-hidden rounded-[4rem] bg-slate-950 p-12 text-white shadow-2xl md:p-16">
                <Rocket className="absolute -right-20 -bottom-20 h-96 w-96 -rotate-12 text-primary/20" />
                <div className="relative z-10 space-y-8">
                    <div className="flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-primary shadow-[0_20px_40px_rgba(99,102,241,0.4)]">
                        <Plus size={48} strokeWidth={3} />
                    </div>
                    <h2 className="text-7xl leading-[0.85] font-[1000] tracking-tighter">
                        Next Gen <br /> Learning.
                    </h2>
                    <p className="max-w-sm text-xl leading-relaxed font-medium text-slate-400">
                        The dashboard is currently in standby. Connect to a
                        classroom to initialize your academic telemetry and
                        track real-time GPA growth.
                    </p>
                    <Link
                        href="/student/classes"
                        className="group inline-flex items-center gap-4 rounded-[2.5rem] bg-white px-12 py-6 text-lg font-[1000] text-slate-950 transition-all hover:scale-105 hover:bg-primary hover:text-white"
                    >
                        Search Classes{' '}
                        <ArrowRight
                            size={24}
                            className="transition-transform group-hover:translate-x-2"
                        />
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <OnboardingCard
                    icon={Compass}
                    title="Smart Curriculum"
                    desc="2026 standardized learning paths tailored to your current degree progress."
                    color="text-indigo-500"
                    bg="bg-indigo-500/10"
                />
                <OnboardingCard
                    icon={Target}
                    title="Live Analytics"
                    desc="Visual performance tracking across all subjects with weekly benchmark comparisons."
                    color="text-emerald-500"
                    bg="bg-emerald-500/10"
                />
                <OnboardingCard
                    icon={Zap}
                    title="Instant Missions"
                    desc="Never miss a deadline with push notifications and high-priority mission alerts."
                    color="text-amber-500"
                    bg="bg-amber-500/10"
                />
            </div>
        </motion.div>
    );
}

function OnboardingCard({ icon: Icon, title, desc, color, bg }) {
    return (
        <div className="group flex items-center gap-8 rounded-[3.5rem] border border-slate-100 bg-white p-10 transition-all hover:border-primary/30 hover:shadow-xl">
            <div
                className={`h-24 w-24 flex-shrink-0 rounded-[2.5rem] ${bg} flex items-center justify-center ${color} transition-transform group-hover:scale-110`}
            >
                <Icon size={40} />
            </div>
            <div>
                <h4 className="text-2xl font-black tracking-tight text-slate-900">
                    {title}
                </h4>
                <p className="mt-2 text-base leading-relaxed font-medium text-slate-500">
                    {desc}
                </p>
            </div>
        </div>
    );
}
