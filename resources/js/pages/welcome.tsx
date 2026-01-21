import AppearanceTabsHeader from '@/components/appearance-tabs-header';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    ArrowRight,
    ClipboardCheck,
    Cpu,
    GraduationCap,
    ShieldCheck,
    Users,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// Static data defined outside to prevent re-allocation on render
const ASSESSMENT_TAGS = ['Attendance', 'Quizzes', 'E-Grading', 'Scheduling'];

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const containerRef = useRef<HTMLDivElement>(null);

    // Performance: Only update time once per minute to reduce main-thread activity
    const [currentTime, setCurrentTime] = useState('');

    useEffect(() => {
        const updateClock = () => {
            setCurrentTime(
                new Date().toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                }),
            );
        };
        updateClock();
        const timer = setInterval(updateClock, 60000);
        return () => clearInterval(timer);
    }, []);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    });

    // GPU-accelerated transforms
    const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

    return (
        <>
            <Head title="BIU | Faculty of IT Assessment Portal" />

            <div
                ref={containerRef}
                className="relative min-h-screen bg-[#fdfdfd] font-sans text-slate-900 transition-colors duration-500 selection:bg-indigo-500 selection:text-white dark:bg-[#030712] dark:text-slate-50"
            >
                {/* --- BACKGROUND ENGINE (Optimized Grid) --- */}
                <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_0%,#000_70%,transparent_100%)] bg-[size:32px_32px] will-change-transform" />
                </div>

                {/* --- SYSTEM BAR --- */}
                <div className="relative z-[60] border-b border-slate-200/50 bg-white/50 px-6 py-1.5 backdrop-blur-md dark:border-white/5 dark:bg-black/20">
                    <div className="mx-auto flex max-w-7xl items-center justify-between text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                        <div className="flex items-center gap-6">
                            <span className="flex items-center gap-2 text-indigo-500">
                                <Cpu size={12} />
                                Engineered by Faculty of IT & Digital
                            </span>
                            <span className="hidden sm:inline">
                                Server Time: {currentTime}
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="hidden md:inline">
                                Academic OS v5.0
                            </span>
                            <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                        </div>
                    </div>
                </div>

                {/* --- NAVIGATION --- */}
                <nav className="sticky top-4 z-50 mx-auto max-w-6xl px-4">
                    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/40 bg-white/60 p-2 shadow-md backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/60">
                        <Link
                            href="/"
                            className="group flex items-center gap-3 sm:pl-3"
                        >
                            <img
                                className="hidden h-10 w-auto object-contain sm:block"
                                src="/assets/logo/BIU.png"
                                alt="BIU Logo"
                                loading="eager"
                            />
                            <img
                                className="h-10 w-auto object-contain sm:hidden"
                                src="/assets/logo/beltei.svg"
                                alt="BIU Logo"
                                loading="eager"
                            />
                        </Link>

                        <div className="flex items-center gap-2">
                            <AppearanceTabsHeader />
                            <Link
                                prefetch
                                href="/login"
                                className="rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-black text-white shadow-lg shadow-indigo-500/30 transition-all hover:bg-indigo-700 active:scale-95"
                            >
                                {auth.user ? 'MY DASHBOARD' : 'STUDENT LOGIN'}
                            </Link>
                        </div>
                    </div>
                </nav>

                {/* --- HERO SECTION --- */}
                <motion.main
                    style={{ opacity: heroOpacity, scale: heroScale }}
                    className="relative z-10 mx-auto max-w-7xl px-6 pt-12 text-center will-change-transform sm:pt-24"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="mb-8 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-[10px] font-black tracking-[0.2em] text-indigo-600 uppercase dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300"
                    >
                        <GraduationCap size={14} />
                        BELTEI International University
                    </motion.div>

                    <h1 className="mx-auto max-w-5xl text-6xl leading-[0.95] font-[1000] tracking-tight sm:text-8xl lg:text-9xl">
                        BELTEI IU <br />
                        <span className="bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
                            Testing System.
                        </span>
                    </h1>

                    <p className="text-md mx-auto mt-10 max-w-3xl leading-relaxed font-medium text-slate-500 sm:text-lg md:text-xl dark:text-slate-400">
                        The complete digital ecosystem for Online Testing,
                        Scoring, and Student Life. Developed by the <br />
                        <span className="text-lg font-bold text-slate-900 underline decoration-indigo-500 decoration-2 underline-offset-4 xs:text-2xl dark:text-white">
                            Faculty of Information Technology and Science.
                        </span>
                    </p>

                    <div className="mt-8 flex flex-col items-center justify-center gap-4 pb-24 sm:mt-12 sm:flex-row">
                        <Link
                            prefetch
                            href="/login"
                            className="group text-md flex h-14 w-full items-center justify-center gap-4 rounded-2xl bg-indigo-600 px-10 font-black text-white shadow-2xl shadow-indigo-500/40 transition-all hover:bg-indigo-700 sm:h-16 sm:w-auto"
                        >
                            Access Student Portal
                            <ArrowRight className="transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </motion.main>

                {/* --- BENTO GRID --- */}
                <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
                        {/* Card 1 */}
                        <div className="flex flex-col justify-between overflow-hidden rounded-[3rem] border border-slate-200 bg-white p-10 shadow-2xl md:col-span-7 dark:border-white/10 dark:bg-slate-900">
                            <div>
                                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10">
                                    <ClipboardCheck size={28} />
                                </div>
                                <h3 className="mb-4 text-3xl font-black">
                                    Unified Assessment
                                </h3>
                                <p className="max-w-md leading-relaxed text-slate-500 dark:text-slate-400">
                                    A singular platform for all academic needs:
                                    Homework, Exams, and real-time Automated
                                    Scoring.
                                </p>
                            </div>
                            <div className="mt-8 flex flex-wrap gap-2">
                                {ASSESSMENT_TAGS.map((tag) => (
                                    <span
                                        key={tag}
                                        className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold text-slate-500 uppercase dark:bg-white/5"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="flex flex-col justify-between rounded-[3rem] bg-slate-900 p-10 text-white shadow-xl md:col-span-5 dark:bg-indigo-950">
                            <Cpu size={28} className="mb-6 text-indigo-400" />
                            <div>
                                <h3 className="text-2xl font-black text-pretty">
                                    Faculty of IT and Science
                                </h3>
                                <p className="mt-4 text-sm leading-relaxed text-slate-300">
                                    Purpose-built for a secure, lag-free, and
                                    high-performance digital environment.
                                </p>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="flex flex-col justify-between rounded-[3rem] border border-slate-200 bg-white p-10 md:col-span-5 dark:border-white/10 dark:bg-slate-900">
                            <Users size={32} className="text-indigo-500" />
                            <div>
                                <h3 className="mt-8 text-2xl font-black">
                                    Student Insights
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                                    Track attendance and performance history
                                    with our data dashboard.
                                </p>
                            </div>
                        </div>

                        {/* Card 4 */}
                        <div className="flex items-center justify-between rounded-[3rem] border border-slate-200 bg-white p-10 md:col-span-7 dark:border-white/10 dark:bg-slate-900">
                            <div className="flex flex-col gap-2">
                                <div className="text-4xl font-[1000] text-indigo-600">
                                    Enterprise Grade
                                </div>
                                <div className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                                    Security Protocols
                                </div>
                            </div>
                            <ShieldCheck
                                size={40}
                                className="text-indigo-500"
                            />
                        </div>
                    </div>
                </section>

                <footer className="relative z-10 border-t border-slate-200 px-6 py-12 dark:border-white/5">
                    <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 md:flex-row">
                        <div className="flex flex-col gap-2 text-center md:text-left">
                            <span className="text-xs font-black tracking-widest text-slate-400">
                                FACULTY OF IT & SCIENCE
                            </span>
                            <p className="text-xs text-slate-500">
                                BELTEI International University © 2026
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
