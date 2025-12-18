import AppearanceTabsHeader from '@/components/appearance-tabs-header';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen,
    ShieldCheck,
    Zap,
    LayoutDashboard,
    ArrowRight,
    CheckCircle2,
    Sparkles,
    MousePointer2,
    Lock
} from 'lucide-react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    const steps = [
        { title: 'Secure Login', desc: 'Single sign-on with your BIU Student ID.', icon: Lock },
        { title: 'Select Exam', desc: 'Browse scheduled quizzes or final exams.', icon: BookOpen },
        { title: 'Instant Result', desc: 'Review your performance score immediately.', icon: Sparkles },
    ];

    return (
        <>
            <Head title="BIU Online Testing - Modern Academic Portal" />

            <div className="selection:bg-cyan-500/30 font-sans min-h-screen bg-[#fafafa] text-slate-900 dark:bg-[#050505] dark:text-slate-50 transition-colors duration-500 overflow-x-hidden">
                
                {/* --- TRANSITIONAL BACKGROUND --- */}
                <div className="fixed inset-0 z-0 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] h-[700px] w-[700px] rounded-full bg-cyan-500/10 blur-[120px] dark:bg-cyan-500/5" />
                    <div className="absolute bottom-[10%] right-[-5%] h-[600px] w-[600px] rounded-full bg-indigo-500/10 blur-[120px] dark:bg-indigo-500/5" />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
                </div>

                {/* --- NAVIGATION --- */}
                <nav className="fixed inset-x-0 top-0 z-50 px-6 py-4">
                    <div className="mx-auto max-w-7xl flex items-center justify-between bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl px-6 py-3 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="bg-cyan-500 p-1.5 rounded-lg shadow-lg shadow-cyan-500/20">
                                <img className="h-7 w-auto brightness-0 invert" src="https://belteigroup.com.kh/images/beltei_international_university_in_cambodia.png" alt="BIU" />
                            </div>
                            <span className="font-bold tracking-tight text-lg">BIU <span className="text-cyan-600 dark:text-cyan-400">OS</span></span>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex gap-6 mr-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                                <a href="#" className="hover:text-cyan-500 transition">Resources</a>
                                <a href="#" className="hover:text-cyan-500 transition">Schedule</a>
                                <a href="#" className="hover:text-cyan-500 transition">Help</a>
                            </div>
                            <AppearanceTabsHeader />
                            <div className="h-6 w-px bg-slate-200 dark:bg-white/10" />
                            {auth.user ? (
                                <Link href="/dashboard" className="bg-slate-900 dark:bg-white text-white dark:text-black px-5 py-2 rounded-xl text-sm font-bold hover:scale-105 transition active:scale-95">
                                    Dashboard
                                </Link>
                            ) : (
                                <Link href="/login" className="bg-cyan-500 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-lg shadow-cyan-500/30 hover:bg-cyan-600 transition">
                                    Sign In
                                </Link>
                            )}
                        </div>
                    </div>
                </nav>

                {/* --- HERO SECTION --- */}
                <main className="relative z-10 mx-auto max-w-7xl px-6 pt-32 pb-20">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-bold mb-6">
                                <Sparkles size={14} />
                                <span>NEW: AI PROCTORING V2.0</span>
                            </div>
                            <h1 className="text-6xl md:text-7xl font-black tracking-tight leading-[1.1] mb-8">
                                Academic <br />
                                <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 bg-clip-text text-transparent italic">Integrity</span> <br />
                                Redefined.
                            </h1>
                            <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 leading-relaxed max-w-lg">
                                The next generation of online testing for Beltei University. 
                                Secure, fast, and designed to let you focus on what matters: 
                                <strong> your knowledge.</strong>
                            </p>
                            
                            <div className="flex flex-wrap gap-4">
                                <Link href="/login" className="group relative flex items-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-black px-8 py-4 rounded-2xl font-bold overflow-hidden transition-all hover:pr-10">
                                    <span className="relative z-10">Start Exam Now</span>
                                    <ArrowRight className="transition-all group-hover:translate-x-2" size={20} />
                                    <div className="absolute inset-0 bg-cyan-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                </Link>
                                <div className="flex items-center gap-3 px-4">
                                    <div className="flex -space-x-3">
                                        {[1,2,3].map(i => (
                                            <div key={i} className="h-10 w-10 rounded-full border-2 border-white dark:border-[#050505] bg-slate-200 overflow-hidden">
                                                <img src={`https://i.pravatar.cc/150?u=${i+10}`} alt="user" />
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-xs font-medium text-slate-500">Joined by 12k+ students</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Interactive UI Mockup */}
                        <motion.div 
                            className="relative"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, delay: 0.2 }}
                        >
                            <div className="relative z-10 bg-white/40 dark:bg-white/5 backdrop-blur-2xl border border-white/40 dark:border-white/10 rounded-[2.5rem] p-4 shadow-2xl">
                                <div className="bg-white dark:bg-[#0B0B0B] rounded-[2rem] overflow-hidden shadow-inner border border-slate-200 dark:border-white/5">
                                    <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                                        <div className="flex gap-1.5">
                                            <div className="h-3 w-3 rounded-full bg-red-400/20 border border-red-400/40" />
                                            <div className="h-3 w-3 rounded-full bg-amber-400/20 border border-amber-400/40" />
                                            <div className="h-3 w-3 rounded-full bg-emerald-400/20 border border-emerald-400/40" />
                                        </div>
                                        <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Question 14/50</div>
                                    </div>
                                    <div className="p-8">
                                        <div className="h-4 w-1/3 bg-slate-100 dark:bg-white/5 rounded-full mb-4" />
                                        <div className="h-8 w-full bg-slate-100 dark:bg-white/5 rounded-xl mb-8" />
                                        <div className="space-y-3">
                                            {[1,2,3].map(i => (
                                                <div key={i} className={`p-4 rounded-xl border ${i === 2 ? 'border-cyan-500 bg-cyan-500/5' : 'border-slate-100 dark:border-white/5'}`}>
                                                    <div className="h-3 w-1/2 bg-slate-200 dark:bg-white/10 rounded-full" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Decorative Floating Elements */}
                            <motion.div 
                                animate={{ y: [0, -15, 0] }} 
                                transition={{ repeat: Infinity, duration: 4 }}
                                className="absolute -top-10 -right-10 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-white/10 z-20"
                            >
                                <CheckCircle2 className="text-emerald-500" size={32} />
                            </motion.div>
                            <motion.div 
                                animate={{ y: [0, 15, 0] }} 
                                transition={{ repeat: Infinity, duration: 5, delay: 1 }}
                                className="absolute -bottom-6 -left-10 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-white/10 z-20"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-500">
                                        <Zap size={20} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] uppercase text-slate-400 font-bold">Time Remaining</div>
                                        <div className="text-sm font-black tracking-tight">00:45:12</div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* --- FEATURES GRID --- */}
                    <div className="mt-32">
                        <h2 className="text-center text-3xl font-bold mb-16">Designed for modern learning</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            {steps.map((step, idx) => (
                                <motion.div 
                                    key={idx}
                                    whileHover={{ y: -5 }}
                                    className="group p-8 rounded-[2rem] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 transition-all hover:shadow-2xl hover:shadow-cyan-500/10"
                                >
                                    <div className="h-14 w-14 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center mb-6 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                                        <step.icon size={28} />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </main>

                {/* --- FOOTER --- */}
                <footer className="py-12 border-t border-slate-200 dark:border-white/10">
                    <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-2 opacity-50">
                            <img className="h-6 grayscale" src="https://belteigroup.com.kh/images/beltei_international_university_in_cambodia.png" alt="" />
                            <span className="text-xs font-bold uppercase tracking-widest">BIU Online Testing</span>
                        </div>
                        <p className="text-xs text-slate-400">© {new Date().getFullYear()} Beltei International University. Education for the digital age.</p>
                        <div className="flex gap-4">
                            <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center hover:bg-cyan-500 hover:text-white transition-colors cursor-pointer"><MousePointer2 size={14} /></div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}