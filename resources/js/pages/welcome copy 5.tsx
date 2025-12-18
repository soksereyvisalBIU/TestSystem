import AppearanceTabsHeader from '@/components/appearance-tabs-header';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    LayoutDashboard,
    ArrowRight,
    Sparkles,
    Timer,
    Fingerprint,
    Activity,
    ChevronRight,
    ShieldCheck,
    Zap
} from 'lucide-react';
import { useRef } from 'react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    
    // 1. Initialize the ref correctly
    const containerRef = useRef<HTMLDivElement>(null);

    // 2. Pass the ref to useScroll
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

    return (
        <>
            <Head title="BIU | The Future of Online Testing" />

            <div className="font-sans min-h-screen bg-white text-slate-900 dark:bg-[#020617] dark:text-slate-50 selection:bg-indigo-500 selection:text-white">
                
                {/* BACKGROUND LAYER */}
                <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
                </div>

                {/* STATUS BAR */}
                <div className="relative z-[60] bg-slate-900 px-4 py-1.5 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:bg-white/5">
                    <div className="flex items-center justify-center gap-4">
                        <span className="flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            System Live: 99.9% Uptime
                        </span>
                    </div>
                </div>

                {/* NAVIGATION */}
                <nav className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-md dark:border-white/5 dark:bg-[#020617]/80">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                        <Link href="/" className="flex items-center gap-2">
                            <img className="h-9" src="https://belteigroup.com.kh/images/beltei_international_university_in_cambodia.png" alt="Logo" />
                            <span className="text-xl font-black tracking-tighter">BIU EXAM</span>
                        </Link>

                        <div className="flex items-center gap-4">
                            <AppearanceTabsHeader />
                            {auth.user ? (
                                <Link href="/dashboard" className="rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700">
                                    Dashboard
                                </Link>
                            ) : (
                                <Link href="/login" className="rounded-full bg-slate-900 dark:bg-white text-white dark:text-black px-6 py-2.5 text-sm font-bold transition hover:opacity-90">
                                    Sign In
                                </Link>
                            )}
                        </div>
                    </div>
                </nav>

                {/* --- FIX: Attached containerRef here --- */}
                <motion.section 
                    ref={containerRef} 
                    style={{ opacity, scale }}
                    className="relative z-10 mx-auto max-w-7xl px-6 pt-20 lg:pt-32 pb-24 text-center"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-1.5 text-sm font-semibold text-indigo-600 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300">
                            <Fingerprint size={16} />
                            Verified Academic Environment
                        </div>
                        <h1 className="mx-auto max-w-4xl text-5xl font-[900] leading-[1.05] tracking-tight sm:text-7xl lg:text-8xl">
                            Master your finals with <span className="bg-gradient-to-br from-indigo-600 via-blue-500 to-teal-400 bg-clip-text text-transparent">Zero Friction.</span>
                        </h1>
                        
                        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Link href="/login" className="group flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-indigo-600 px-10 text-lg font-bold text-white shadow-2xl shadow-indigo-500/40 transition hover:bg-indigo-700 sm:w-auto">
                                Launch Assessment
                                <ChevronRight />
                            </Link>
                        </div>
                    </motion.div>

                    {/* DASHBOARD PREVIEW */}
                    <div className="mt-24 relative group">
                         <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-slate-900">
                            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
                                <div className="flex gap-2">
                                    <div className="h-3 w-3 rounded-full bg-red-400" />
                                    <div className="h-3 w-3 rounded-full bg-amber-400" />
                                    <div className="h-3 w-3 rounded-full bg-emerald-400" />
                                </div>
                                <Activity size={16} className="text-indigo-500" />
                            </div>
                            <div className="p-4">
                                <div className="aspect-video w-full rounded-xl bg-slate-100 dark:bg-white/5 animate-pulse flex items-center justify-center">
                                     {/* <span className="text-slate-400 text-sm font-mono">Loading System Mockup...</span> */}
                                     <img src="/assets/img/dashboard-preview.png" alt="Dashboard Preview" className="w-full h-full object-cover" />
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* BENTO GRID */}
                <section className="relative z-10 mx-auto max-w-7xl px-6 pb-32">
                    <div className="grid gap-6 md:grid-cols-3">
                        {[
                            { icon: Timer, title: "Smart Timing", desc: "Auto-save ensures no data loss during exams.", color: "text-blue-500" },
                            { icon: ShieldCheck, title: "Proctor-AI", desc: "Tab-lock and environment monitoring.", color: "text-emerald-500" },
                            { icon: Zap, title: "Edge Speed", desc: "Instant question loading with local-first caching.", color: "text-amber-500" }
                        ].map((item, i) => (
                            <div key={i} className="p-10 rounded-[2.5rem] border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5 hover:border-indigo-500 transition-colors">
                                <item.icon className={`mb-6 ${item.color}`} size={32} />
                                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                                <p className="text-slate-500 dark:text-slate-400">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </>
    );
}