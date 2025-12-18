import AppearanceTabsHeader from '@/components/appearance-tabs-header';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    BookOpen,
    Calculator,
    CheckCircle,
    GraduationCap,
    ShieldCheck,
    Zap,
} from 'lucide-react';
import { useMemo } from 'react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    // useMemo prevents icons from jumping on every re-render
    const backgroundElements = useMemo(() => {
        const dots = Array.from({ length: 15 }).map((_, i) => ({
            id: i,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            delay: Math.random() * 5,
            size: Math.random() * 3 + 2,
        }));
        return { dots };
    }, []);

    return (
        <div className="selection:bg-indigo-500/30 selection:text-indigo-900 dark:selection:text-indigo-100">
            <Head title="BIU Online Testing - Excellence in Education" />

            <div className="relative min-h-screen overflow-hidden bg-slate-50 font-sans text-slate-900 transition-colors duration-500 dark:bg-[#0a0f1d] dark:text-slate-100">
                {/* --- ENHANCED BACKGROUND --- */}
                <div className="pointer-events-none absolute inset-0 z-0">
                    {/* Grid Pattern */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
                    <div className="absolute inset-0 [background-image:linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] [background-size:24px_24px]"></div>

                    {/* Animated Mesh Blobs */}
                    <motion.div
                        animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                        className="absolute -top-[10%] -left-[10%] h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[120px] dark:bg-indigo-500/20"
                    />
                    <motion.div
                        animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
                        transition={{
                            duration: 15,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                        className="absolute top-[20%] -right-[10%] h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-[100px] dark:bg-cyan-500/20"
                    />

                    {/* Interactive Dots */}
                    {backgroundElements.dots.map((dot) => (
                        <motion.div
                            key={dot.id}
                            className="absolute rounded-full bg-indigo-500/40 dark:bg-indigo-400/20"
                            style={{
                                top: dot.top,
                                left: dot.left,
                                width: dot.size,
                                height: dot.size,
                            }}
                            animate={{
                                opacity: [0.2, 0.8, 0.2],
                                scale: [1, 1.5, 1],
                            }}
                            transition={{
                                duration: 4,
                                delay: dot.delay,
                                repeat: Infinity,
                            }}
                        />
                    ))}
                </div>

                {/* --- PREMIUM NAVBAR --- */}
                <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b border-slate-200/50 bg-white/70 px-6 py-3 backdrop-blur-xl md:px-12 dark:border-slate-800/50 dark:bg-[#0a0f1d]/70">
                    <div className="flex items-center gap-3">
                        <img
                            className="h-10 w-auto"
                            src="https://belteigroup.com.kh/images/beltei_international_university_in_cambodia.png"
                            alt="BIU Logo"
                        />
                        <span className="hidden text-lg font-bold tracking-tight md:block">
                            BIU{' '}
                            <span className="text-indigo-600 dark:text-indigo-400">
                                TESTING
                            </span>
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        {auth.user ? (
                            <Link
                                href="/dashboard"
                                className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white transition-all hover:bg-slate-800 dark:bg-white dark:text-slate-900"
                            >
                                <span className="relative z-10">
                                    Go to Dashboard
                                </span>
                                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-indigo-500 to-cyan-500 transition-transform duration-300 group-hover:translate-x-0"></div>
                            </Link>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link
                                    href="/login"
                                    className="px-4 py-2 text-sm font-medium transition hover:text-indigo-600"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-700 hover:shadow-indigo-500/40"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                        <div className="ml-2 h-6 w-[1px] bg-slate-200 dark:bg-slate-800" />
                        <AppearanceTabsHeader />
                    </div>
                </header>

                {/* --- HERO SECTION --- */}
                <main className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 pt-20">
                    <div className="grid items-center gap-12 lg:grid-cols-2">
                        {/* Text Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300">
                                <Zap size={14} className="fill-current" />
                                <span>Now live for Semester 1 Exams</span>
                            </div>

                            <h1 className="mb-6 text-5xl leading-[1.1] font-extrabold tracking-tight md:text-6xl lg:text-7xl">
                                Learn, Test, and <br />
                                <span className="bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                                    Achieve Greatness.
                                </span>
                            </h1>

                            <p className="mb-8 max-w-lg text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                                Experience a seamless, secure, and modern
                                examination environment. Built specifically for
                                BIU students to excel in their academic journey.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <Link
                                    href="/login"
                                    className="flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-4 font-bold text-white shadow-xl shadow-indigo-500/20 transition-all hover:scale-105 hover:bg-indigo-700 active:scale-95"
                                >
                                    Get Started Now
                                    <CheckCircle size={20} />
                                </Link>
                                <button className="rounded-xl border border-slate-200 bg-white px-8 py-4 font-bold transition-all hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800">
                                    System Status
                                </button>
                            </div>

                            {/* Trust Badge */}
                            <div className="mt-12 flex items-center gap-6 opacity-60 grayscale dark:invert">
                                <p className="text-sm font-semibold tracking-widest text-slate-500 uppercase">
                                    Powered by BIU Tech
                                </p>
                            </div>
                        </motion.div>

                        {/* Visual Side */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="relative lg:ml-auto"
                        >
                            <div className="relative z-10 overflow-hidden rounded-3xl border border-white/20 bg-slate-200 shadow-2xl dark:bg-slate-800">
                                <img
                                    src="/assets/img/t.png"
                                    alt="Student Portal"
                                    className="w-full object-cover transition-transform duration-700 hover:scale-105"
                                />
                                {/* Floating Overlay Card */}
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                    }}
                                    className="absolute bottom-6 -left-6 hidden rounded-2xl bg-white p-4 shadow-2xl md:block dark:bg-slate-900"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg bg-green-100 p-2 text-green-600 dark:bg-green-500/20">
                                            <ShieldCheck size={24} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-500 uppercase">
                                                Security
                                            </p>
                                            <p className="text-sm font-bold">
                                                Proctoring Enabled
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Background Glow */}
                            <div className="absolute -inset-4 z-0 rotate-6 rounded-[3rem] bg-gradient-to-br from-indigo-500 to-cyan-400 opacity-20 blur-3xl" />
                        </motion.div>
                    </div>

                    {/* --- FEATURES GRID (NEW) --- */}
                    <div className="mt-24 grid gap-8 pb-20 md:grid-cols-3">
                        {[
                            {
                                icon: BookOpen,
                                title: 'Smart Quizzes',
                                desc: 'Adaptive testing that helps you learn as you go.',
                            },
                            {
                                icon: Calculator,
                                title: 'Instant Results',
                                desc: 'Get your scores and feedback immediately after submission.',
                            },
                            {
                                icon: GraduationCap,
                                title: 'Official Certification',
                                desc: 'Integrates directly with your BIU academic record.',
                            },
                        ].map((f, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group rounded-2xl border border-slate-200 bg-white/50 p-6 backdrop-blur-sm transition-all hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-indigo-500/50"
                            >
                                <div className="mb-4 inline-block rounded-xl bg-white p-3 shadow-sm group-hover:bg-indigo-600 group-hover:text-white dark:bg-slate-800">
                                    <f.icon size={24} />
                                </div>
                                <h3 className="mb-2 text-xl font-bold">
                                    {f.title}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400">
                                    {f.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}
