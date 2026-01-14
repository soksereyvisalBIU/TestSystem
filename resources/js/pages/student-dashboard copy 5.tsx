import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowRight,
    ChevronRight,
    GraduationCap,
    Plus,
    Target,
    Timer,
    Zap,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import EmptyStateView from './dashboard/student/EmptyStateView';
import SubjectCard from './dashboard/student/subject-card';

// --- ANIMATION VARIANTS ---
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: 'spring', stiffness: 300, damping: 24 },
    },
};

export default function StudentDashboard({ student }) {
    // --- 1. CORE DATA & CALCULATIONS ---
    const classrooms = student?.student_classrooms || [];
    const submissions = student?.student_assessment || [];
    const isNewUser = classrooms.length === 0;

    const [activeClassIndex, setActiveClassIndex] = useState(0);
    const activeClass = classrooms[activeClassIndex];

    const { stats, liveMissions, upcomingEvents, levelInfo } = useMemo(() => {
        const now = new Date();
        const missions = [];
        const events = [];
        const scored = submissions.filter((s) => s.status === 'scored');

        // Calculate GPA & Leveling (Gamification)
        const avg =
            scored.length > 0
                ? scored.reduce(
                      (acc, curr) => acc + parseFloat(curr.score),
                      0,
                  ) / scored.length
                : 0;

        // Level logic: Every 5 completed tasks = 1 Level
        const currentLevel = Math.floor(scored.length / 5) + 1;
        const progressToNextLevel = (scored.length % 5) * 20; // Percentage

        classrooms.forEach((cls) => {
            cls.subjects.forEach((sub) => {
                sub.assessments.forEach((assess) => {
                    const start = new Date(assess.start_time);
                    const end = new Date(assess.end_time);
                    const submission = submissions.find(
                        (s) => s.assessment_id === assess.id,
                    );

                    // 1. Live Missions (Current & Unfinished)
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
                            urgency: (end - now) / (1000 * 60 * 60), // hours left
                        });
                    }
                    // 2. Upcoming Events (Future)
                    else if (now < start) {
                        events.push({
                            ...assess,
                            subjectName: sub.name,
                            start,
                        });
                    }
                });
            });
        });

        return {
            stats: {
                avg: avg.toFixed(1),
                completed: scored.length,
                peak:
                    scored.length > 0
                        ? Math.max(...scored.map((s) => parseFloat(s.score)))
                        : 0,
            },
            liveMissions: missions.sort((a, b) => a.urgency - b.urgency),
            upcomingEvents: events
                .sort((a, b) => a.start - b.start)
                .slice(0, 3),
            levelInfo: { currentLevel, progressToNextLevel },
        };
    }, [classrooms, submissions]);

    // Dynamic Greeting
    const greeting = useMemo(() => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    }, []);

    if (isNewUser)
        return (
            <AppLayout>
                <EmptyStateView greeting={greeting} itemVariants={itemVariants} levelInfo={levelInfo} student={student}/>
            </AppLayout>
        );

    return (
        <AppLayout>
            <Head title="Scholar Dashboard" />

            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="container mx-auto space-y-12 p-6 md:p-10 lg:p-14"
            >
                {/* --- SECTION 1: SMART HEADER --- */}
                <header className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
                    <motion.div variants={itemVariants} className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 items-center gap-2 rounded-full bg-primary/10 px-3 py-1">
                                <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
                                </span>
                                <span className="text-[10px] font-black tracking-widest text-primary uppercase">
                                    System Online • Level{' '}
                                    {levelInfo.currentLevel}
                                </span>
                            </div>
                        </div>
                        <h1 className="text-5xl font-[1000] tracking-tighter text-slate-900 md:text-7xl">
                            {greeting},{' '}
                            <span className="text-primary italic">
                                {student.name.split(' ')[0]}
                            </span>
                        </h1>
                    </motion.div>

                    <motion.div variants={itemVariants} className="flex gap-4">
                        <div className="group relative overflow-hidden rounded-3xl border border-border bg-white p-6 shadow-sm transition-all hover:shadow-md">
                            <p className="text-[10px] font-black text-muted-foreground uppercase">
                                Global Average
                            </p>
                            <p className="text-3xl font-black text-slate-900">
                                {stats.avg}%
                            </p>
                            <div className="mt-2 h-1 w-full rounded-full bg-slate-100">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${stats.avg}%` }}
                                    className="h-full bg-primary"
                                />
                            </div>
                        </div>
                    </motion.div>
                </header>

                <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
                    {/* --- LEFT COLUMN: CORE ACADEMICS --- */}
                    <div className="space-y-12 lg:col-span-8">
                        {/* 1. URGENT MISSIONS (Glass-morphism) */}
                        <AnimatePresence>
                            {liveMissions.length > 0 && (
                                <motion.section
                                    variants={itemVariants}
                                    className="relative space-y-6"
                                >
                                    <div className="flex items-center gap-2">
                                        <Zap
                                            size={20}
                                            className="fill-amber-400 text-amber-400"
                                        />
                                        <h3 className="text-sm font-black tracking-widest text-slate-400 uppercase">
                                            Active Missions
                                        </h3>
                                    </div>
                                    <div className="grid gap-4">
                                        {liveMissions.map((task) => (
                                            <Link
                                                key={task.id}
                                                href={`/student/classes/${task.classId}/subjects/${task.subjectId}/assessment/${task.id}`}
                                                className="group relative flex flex-col items-center justify-between overflow-hidden rounded-[2.5rem] border border-rose-200 bg-white p-8 transition-all hover:border-rose-400 hover:shadow-2xl hover:shadow-rose-100 md:flex-row"
                                            >
                                                <div className="relative z-10 space-y-2">
                                                    <div className="flex items-center gap-3">
                                                        <span className="rounded-lg bg-rose-100 px-3 py-1 text-[10px] font-black text-rose-600 uppercase">
                                                            {task.type}
                                                        </span>
                                                        <span className="text-xs font-bold text-slate-400">
                                                            {task.subjectName}
                                                        </span>
                                                    </div>
                                                    <h4 className="text-2xl font-black text-slate-900">
                                                        {task.title}
                                                    </h4>
                                                    <p className="flex items-center gap-2 text-xs font-bold text-rose-500">
                                                        <Timer size={14} />
                                                        Ends in{' '}
                                                        {task.urgency.toFixed(
                                                            1,
                                                        )}{' '}
                                                        hours
                                                    </p>
                                                </div>
                                                <div className="relative z-10 mt-6 md:mt-0">
                                                    <div className="flex items-center gap-3 rounded-2xl bg-slate-900 px-8 py-4 text-sm font-black text-white transition-all group-hover:scale-105 group-hover:bg-primary">
                                                        {task.submission
                                                            ?.status === 'draft'
                                                            ? 'RESUME'
                                                            : 'INITIALIZE'}
                                                        <ArrowRight size={18} />
                                                    </div>
                                                </div>
                                                {/* Decorative background glow */}
                                                <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-rose-50 opacity-0 transition-opacity group-hover:opacity-100" />
                                            </Link>
                                        ))}
                                    </div>
                                </motion.section>
                            )}
                        </AnimatePresence>

                        {/* 2. CLASSROOM NAVIGATOR */}
                        <section className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-black tracking-widest text-slate-400 uppercase">
                                    Classrooms
                                </h3>
                                <Link
                                    href="/student/classes"
                                    className="flex items-center gap-1 text-xs font-bold text-primary transition-all hover:gap-2"
                                >
                                    Browse All <ChevronRight size={14} />
                                </Link>
                            </div>
                            <div className="no-scrollbar flex items-center gap-6 overflow-x-auto pb-4">
                                {classrooms.map((cls, idx) => (
                                    <button
                                        key={cls.id}
                                        onClick={() => setActiveClassIndex(idx)}
                                        className={`relative flex min-w-[240px] flex-col rounded-[2rem] border-2 p-6 transition-all duration-500 ${
                                            activeClassIndex === idx
                                                ? 'scale-100 border-primary bg-primary text-white shadow-xl shadow-primary/20'
                                                : 'scale-95 border-slate-100 bg-white text-slate-900 hover:border-slate-300'
                                        }`}
                                    >
                                        <span
                                            className={`text-[10px] font-black uppercase ${activeClassIndex === idx ? 'text-white/70' : 'text-slate-400'}`}
                                        >
                                            Year {cls.year} • Sem {cls.semester}
                                        </span>
                                        <span className="mt-1 text-xl font-black">
                                            {cls.name}
                                        </span>
                                        {activeClassIndex === idx && (
                                            <motion.div
                                                layoutId="activeDot"
                                                className="absolute right-6 bottom-4 h-2 w-2 rounded-full bg-white"
                                            />
                                        )}
                                    </button>
                                ))}
                                <Link
                                    href="/student/classes"
                                    className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full border-2 border-dashed border-slate-200 text-slate-400 transition-colors hover:border-primary hover:text-primary"
                                >
                                    <Plus size={24} />
                                </Link>
                            </div>
                        </section>

                        {/* 3. SUBJECT GRID */}
                        <motion.div
                            key={activeClass.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="grid gap-6 md:grid-cols-2"
                        >
                            {activeClass.subjects.map((subject) => (
                                <SubjectCard
                                    key={subject.id}
                                    subject={subject}
                                    classId={activeClass.id}
                                    submissions={submissions}
                                />
                            ))}
                        </motion.div>
                    </div>

                    {/* --- RIGHT COLUMN: SCHOLAR IDENTITY & ANALYTICS --- */}
                    <div className="space-y-8 lg:col-span-4">
                        {/* DIGITAL ID CARD (High Polish) */}
                        <motion.div
                            variants={itemVariants}
                            className="group relative overflow-hidden rounded-[3rem] bg-slate-900 p-8 text-white shadow-2xl transition-all hover:-translate-y-1"
                        >
                            <div className="absolute -top-4 -right-4 text-white/5 transition-transform group-hover:scale-110 group-hover:rotate-12">
                                <GraduationCap size={200} />
                            </div>

                            <div className="relative z-10 flex flex-col gap-12">
                                <div className="flex items-start justify-between">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-indigo-400 text-2xl font-black shadow-lg">
                                        {student.name.charAt(0)}
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black uppercase opacity-40">
                                            Scholar ID
                                        </p>
                                        <p className="font-mono text-xs text-primary">
                                            #{student.id}•2026
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-3xl font-black tracking-tight">
                                        {student.name}
                                    </h3>
                                    <p className="text-xs font-bold tracking-widest text-white/40 uppercase">
                                        {student.email}
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between text-[10px] font-black uppercase">
                                        <span>
                                            Level {levelInfo.currentLevel}{' '}
                                            Progress
                                        </span>
                                        <span>
                                            {levelInfo.progressToNextLevel}%
                                        </span>
                                    </div>
                                    <div className="h-2 w-full rounded-full bg-white/10">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{
                                                width: `${levelInfo.progressToNextLevel}%`,
                                            }}
                                            className="h-full rounded-full bg-primary shadow-[0_0_15px_rgba(var(--primary),0.5)]"
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* ANALYTICS HUD */}
                        <motion.div
                            variants={itemVariants}
                            className="space-y-8 rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm"
                        >
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-black tracking-widest text-slate-400 uppercase">
                                    Quick HUD
                                </h4>
                                <Target size={18} className="text-primary" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="rounded-3xl bg-slate-50 p-5 text-center transition-colors hover:bg-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase">
                                        Rank
                                    </p>
                                    <p className="text-2xl font-black text-slate-900">
                                        Top 5%
                                    </p>
                                </div>
                                <div className="rounded-3xl bg-slate-50 p-5 text-center transition-colors hover:bg-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase">
                                        Streak
                                    </p>
                                    <p className="text-2xl font-black text-slate-900">
                                        12 Days
                                    </p>
                                </div>
                            </div>

                            {/* UPCOMING TIMELINE */}
                            <div className="space-y-6 pt-4">
                                <h5 className="text-xs font-black text-slate-900 uppercase italic">
                                    Upcoming Sequence
                                </h5>
                                <div className="ml-2 space-y-6 border-l-2 border-slate-50 pl-6">
                                    {upcomingEvents.length > 0 ? (
                                        upcomingEvents.map((event, i) => (
                                            <div
                                                key={i}
                                                className="group relative"
                                            >
                                                <div className="absolute top-1 -left-[31px] h-3 w-3 rounded-full border-2 border-white bg-slate-200 transition-colors group-hover:bg-primary" />
                                                <p className="text-[10px] font-black text-slate-400 uppercase">
                                                    {event.start.toLocaleDateString(
                                                        'en-US',
                                                        {
                                                            month: 'short',
                                                            day: 'numeric',
                                                        },
                                                    )}
                                                </p>
                                                <h6 className="text-sm font-bold text-slate-900">
                                                    {event.title}
                                                </h6>
                                                <span className="text-[9px] font-bold text-primary/60 uppercase">
                                                    {event.subjectName}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-slate-400 italic">
                                            No scheduled events
                                        </p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </AppLayout>
    );
}
