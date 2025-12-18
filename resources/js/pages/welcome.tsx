import AppearanceTabsHeader from '@/components/appearance-tabs-header';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    ArrowRight,
    Sparkles,
    ShieldCheck,
    Zap,
    Fingerprint,
    Activity,
    ChevronRight,
    Globe,
    Lock,
    Cpu,
    CheckCircle2,
    GraduationCap,
    Users,
    ClipboardCheck
} from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const containerRef = useRef<HTMLDivElement>(null);
    const [currentTime, setCurrentTime] = useState('');

    useEffect(() => {
        setCurrentTime(new Date().toLocaleTimeString());
        const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
        return () => clearInterval(timer);
    }, []);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

    return (
        <>
            <Head title="BIU | Faculty of IT Assessment Portal" />

            <div ref={containerRef} className="relative font-sans min-h-screen bg-[#fdfdfd] text-slate-900 dark:bg-[#030712] dark:text-slate-50 selection:bg-indigo-500 selection:text-white transition-colors duration-500">
                
                {/* --- BACKGROUND ENGINE --- */}
                <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
                </div>

                {/* --- SYSTEM BAR --- */}
                <div className="relative z-[60] bg-white/50 border-b border-slate-200/50 px-6 py-1.5 backdrop-blur-md dark:bg-black/20 dark:border-white/5">
                    <div className="mx-auto flex max-w-7xl items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        <div className="flex items-center gap-6">
                            <span className="flex items-center gap-2 text-indigo-500">
                                <Cpu size={12} />
                                Engineered by Faculty of IT & Science
                            </span>
                            <span className="hidden sm:inline">Server: {currentTime}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="hidden md:inline">Academic OS v5.0</span>
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        </div>
                    </div>
                </div>

                {/* --- NAVIGATION --- */}
                <nav className="sticky top-4 z-50 mx-auto max-w-6xl px-4">
                    <div className="flex items-center justify-between rounded-2xl border border-white/40 bg-white/60 p-2 shadow-2xl shadow-indigo-500/5 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/60">
                        <Link href="/" className="flex items-center gap-3 pl-3 group">
                            <img className="h-9 w-auto" src="https://belteigroup.com.kh/images/beltei_international_university_in_cambodia.png" alt="BIU" />
                            <div className="flex flex-col">
                                <span className="text-xl font-[1000] tracking-tighter leading-none">BIU <span className="text-indigo-600">SYSTEM</span></span>
                                {/* <span className="text-xl font-[1000] tracking-tighter leading-none">BIU <span className="text-indigo-600">CLOUD</span></span> */}
                                <span className="text-[7px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-0.5">Academic Assessment Portal</span>
                            </div>
                        </Link>

                        <div className="flex items-center gap-2">
                            <AppearanceTabsHeader />
                            <Link href="/login" className="rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-black text-white shadow-lg shadow-indigo-500/30 transition-all hover:bg-indigo-700 active:scale-95">
                                {auth.user ? 'MY DASHBOARD' : 'STUDENT LOGIN'}
                            </Link>
                        </div>
                    </div>
                </nav>

                {/* --- HERO SECTION --- */}
                <motion.main style={{ opacity: heroOpacity, scale: heroScale }} className="relative z-10 mx-auto max-w-7xl px-6 pt-24 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300 mb-8">
                        <GraduationCap size={14} />
                        BELTEI International University
                    </motion.div>
                    
                    <h1 className="mx-auto max-w-5xl text-6xl font-[1000] leading-[0.95] tracking-tight sm:text-8xl lg:text-9xl">
                        The Future of <br />
                        <span className="bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-400 bg-clip-text text-transparent">Assessment.</span>
                    </h1>

                    <p className="mx-auto mt-10 max-w-3xl text-lg font-medium leading-relaxed text-slate-500 dark:text-slate-400 md:text-xl">
                        The complete digital ecosystem for Online Testing, Scoring, and Student Life. 
                        Proudly developed and maintained by the <span className="text-slate-900 dark:text-white font-bold underline decoration-indigo-500 decoration-2 underline-offset-4">Faculty of Information Technology and Science.</span>
                    </p>

                    <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row pb-24">
                        <Link href="/login" className="group flex h-16 w-full items-center justify-center gap-4 rounded-2xl bg-indigo-600 px-10 text-lg font-black text-white shadow-2xl shadow-indigo-500/40 transition-all hover:bg-indigo-700 sm:w-auto">
                            Access Student Portal
                            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </motion.main>

                {/* --- BENTO PRODUCTION GRID --- */}
                <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        {/* 1. Assessment Scope */}
                        <div className="md:col-span-7 overflow-hidden rounded-[3rem] border border-slate-200 bg-white p-10 shadow-2xl dark:border-white/10 dark:bg-slate-900 flex flex-col justify-between">
                            <div>
                                <div className="h-14 w-14 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 mb-6">
                                    <ClipboardCheck size={28} />
                                </div>
                                <h3 className="text-3xl font-black mb-4">Unified Assessment</h3>
                                <p className="text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">
                                    A singular platform for all your academic needs: Homework submissions, Midterm & Final Exams, and real-time Automated Scoring.
                                </p>
                            </div>
                            <div className="mt-8 flex flex-wrap gap-2">
                                {['Attendance', 'Quizzes', 'E-Grading', 'Scheduling'].map(tag => (
                                    <span key={tag} className="px-3 py-1 bg-slate-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-slate-500 uppercase">{tag}</span>
                                ))}
                            </div>
                        </div>

                        {/* 2. Engineering Credit */}
                        <div className="md:col-span-5 rounded-[3rem] bg-slate-900 p-10 text-white shadow-xl dark:bg-indigo-950 flex flex-col justify-between">
                            <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                                <Cpu size={28} className="text-indigo-400" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black">Faculty of Information Technology and Science</h3>
                                <p className="mt-4 text-slate-300 text-sm leading-relaxed">
                                    Purpose-built by our Faculty of IT & Science experts to provide students with a secure, lag-free, and high-performance digital environment.
                                </p>
                            </div>
                        </div>

                        {/* 3. Student Data */}
                        <div className="md:col-span-5 rounded-[3rem] border border-slate-200 bg-white p-10 dark:border-white/10 dark:bg-slate-900 flex flex-col justify-between">
                            <Users size={32} className="text-indigo-500" />
                            <div>
                                <h3 className="text-2xl font-black mt-8">Student Insights</h3>
                                <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                                    Track your attendance, performance history, and study progress with our integrated user data dashboard.
                                </p>
                            </div>
                        </div>

                        {/* 4. Security */}
                        <div className="md:col-span-7 rounded-[3rem] border border-slate-200 bg-white p-10 dark:border-white/10 dark:bg-slate-900 flex items-center justify-between">
                            <div className="flex flex-col gap-2">
                                <div className="text-4xl font-[1000] text-indigo-600">Enterprise Grade</div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Security & Integrity protocols</div>
                            </div>
                            <div className="h-20 w-20 rounded-full border border-indigo-500/20 flex items-center justify-center">
                                <ShieldCheck size={40} className="text-indigo-500" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- FOOTER --- */}
                <footer className="relative z-10 border-t border-slate-200 dark:border-white/5 px-6 py-12">
                    <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex flex-col gap-2">
                            <span className="text-xs font-black tracking-widest text-slate-400">FACULTY OF INFORMATION TECHNOLOGY & SCIENCE</span>
                            <p className="text-xs text-slate-500">BELTEI International University © 2025</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}