import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity,
    ArrowUpRight,
    BookOpen,
    CheckCircle2,
    Clock,
    GraduationCap,
    Layout,
    Layers,
    MoreHorizontal,
    Star,
    TrendingUp,
    Zap,
    Calendar,
    ChevronRight,
    Target
} from 'lucide-react';
import { useState } from 'react';

export default function StudentDashboard({ student }) {
    // 1. DATA PROCESSING & ANALYTICS
    const [activeClassIndex, setActiveClassIndex] = useState(0);
    const classrooms = student.student_classrooms || [];
    const submissions = student.student_assessment || [];
    const activeClass = classrooms[activeClassIndex];

    // Calculate Global GPA from "scored" assessments
    const scoredSubmissions = submissions.filter(s => s.status === 'scored');
    const globalAvg = scoredSubmissions.length > 0 
        ? scoredSubmissions.reduce((acc, curr) => acc + parseFloat(curr.score), 0) / scoredSubmissions.length 
        : 0;

    // Identify Pending Tasks for Callie (Status null or draft)
    const pendingTasks = classrooms.flatMap(cls => 
        cls.subjects.flatMap(sub => 
            sub.assessments.filter(assess => {
                const submiss = submissions.find(s => s.assessment_id === assess.id);
                return !submiss || submiss.status !== 'scored';
            }).map(a => ({ ...a, subjectName: sub.name, className: cls.name }))
        )
    );

    return (
        <AppLayout>
            <Head title="Scholar OS | Dashboard" />

            <div className="mx-auto max-w-[1600px] p-4 md:p-10 space-y-10">
                
                {/* --- TOP HUD: GLOBAL INTELLIGENCE --- */}
                <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">Academic Session 2026 Live</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-[1000] tracking-tighter text-title">
                            Welcome back, <span className="text-primary italic">{student.name.split(' ')[0]}</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-4 bg-card border border-border p-3 rounded-[2rem] shadow-sm">
                        <div className="px-6 border-r border-border text-center">
                            <p className="text-[10px] font-black text-muted-foreground uppercase">Global GPA</p>
                            <p className="text-2xl font-black text-primary">{globalAvg.toFixed(1)}%</p>
                        </div>
                        <div className="px-6 text-center">
                            <p className="text-[10px] font-black text-muted-foreground uppercase">Classrooms</p>
                            <p className="text-2xl font-black text-title">{classrooms.length}</p>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    
                    {/* --- LEFT: CLASSROOM SELECTOR & SUBJECTS --- */}
                    <div className="lg:col-span-8 space-y-8">
                        
                        {/* CLASSROOM SWITCHER (Horizontal Scroll) */}
                        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                            {classrooms.map((cls, idx) => (
                                <button 
                                    key={cls.id}
                                    onClick={() => setActiveClassIndex(idx)}
                                    className={`flex-shrink-0 flex items-center gap-4 px-6 py-4 rounded-2xl border transition-all ${
                                        activeClassIndex === idx 
                                        ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                                        : 'bg-card border-border text-title hover:border-primary/50'
                                    }`}
                                >
                                    <div className={`p-2 rounded-lg ${activeClassIndex === idx ? 'bg-white/20' : 'bg-muted'}`}>
                                        <Layers size={18} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] font-black uppercase opacity-60">Year {cls.year}</p>
                                        <p className="font-bold whitespace-nowrap">{cls.name}</p>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* ACTIVE CLASSROOM FOCUS */}
                        <AnimatePresence mode="wait">
                            <motion.div 
                                key={activeClass.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="relative overflow-hidden rounded-[3rem] bg-slate-900 p-8 md:p-12 text-white"
                            >
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <Target size={200} />
                                </div>
                                <div className="relative z-10 space-y-6">
                                    <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-black uppercase tracking-widest">
                                        Active Selection
                                    </div>
                                    <h2 className="text-4xl md:text-5xl font-black leading-tight">{activeClass.name}</h2>
                                    <div className="flex flex-wrap gap-6 text-sm font-bold text-white/60">
                                        <div className="flex items-center gap-2"><Clock size={16} className="text-primary"/> Semester {activeClass.semester}</div>
                                        <div className="flex items-center gap-2"><Layout size={16} className="text-primary"/> Batch {activeClass.batch}</div>
                                        <div className="flex items-center gap-2"><BookOpen size={16} className="text-primary"/> {activeClass.subjects.length} Subjects</div>
                                    </div>
                                    <div className="pt-4">
                                        <button className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-sm hover:scale-105 active:scale-95 transition-transform">
                                            Open Learning Hub
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* SUBJECTS GRID */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {activeClass.subjects.map((subject) => (
                                <SubjectCard key={subject.id} subject={subject} submissions={submissions} />
                            ))}
                        </div>
                    </div>

                    {/* --- RIGHT: TASKS & SCHOLAR PROFILE --- */}
                    <div className="lg:col-span-4 space-y-10">
                        
                        {/* THE SCHOLAR ID */}
                        <div className="relative group overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-600 to-violet-700 p-8 text-white shadow-xl">
                            <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all" />
                            <div className="relative z-10 flex flex-col justify-between h-full space-y-8">
                                <div className="flex justify-between items-start">
                                    <GraduationCap size={40} className="text-white/80" />
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-white/40 uppercase">Verified Scholar</p>
                                        <p className="font-mono text-sm">ID: 000{student.id}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Full Name</p>
                                    <h3 className="text-2xl font-black">{student.name}</h3>
                                </div>
                                <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-md flex items-center justify-between border border-white/10">
                                    <div>
                                        <p className="text-[10px] font-bold text-white/60">HIGHEST SCORE</p>
                                        <p className="text-xl font-black">{Math.max(...scoredSubmissions.map(s => s.score))}%</p>
                                    </div>
                                    <TrendingUp className="text-emerald-400" />
                                </div>
                            </div>
                        </div>

                        {/* UPCOMING TASKS */}
                        <div className="bg-card border border-border rounded-[2.5rem] p-8 space-y-8 shadow-sm">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-black text-title">Action Items</h3>
                                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold">{pendingTasks.length}</div>
                            </div>
                            <div className="space-y-6">
                                {pendingTasks.slice(0, 4).map((task, i) => (
                                    <div key={i} className="group flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className="h-3 w-3 rounded-full border-2 border-primary bg-background group-hover:bg-primary transition-colors" />
                                            <div className="w-px h-full bg-border mt-2" />
                                        </div>
                                        <div className="pb-4">
                                            <p className="text-[10px] font-black text-primary uppercase">{task.type}</p>
                                            <h4 className="font-bold text-title text-sm group-hover:text-primary transition-colors">{task.title}</h4>
                                            <p className="text-[10px] font-medium text-muted-foreground mt-1">Due {new Date(task.end_time).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function SubjectCard({ subject, submissions }) {
    // Check if this subject has a scored assessment
    const subjectAssessments = subject.assessments.map(a => a.id);
    const completed = submissions.find(s => subjectAssessments.includes(s.assessment_id) && s.status === 'scored');

    return (
        <div className="group bg-card border border-border rounded-[2.5rem] p-6 hover:border-primary/50 transition-all hover:shadow-xl">
            <div className="flex justify-between items-start mb-6">
                <div className="h-14 w-14 rounded-2xl overflow-hidden border border-border">
                    <img 
                        src={`/storage/${subject.cover}`} 
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform" 
                        onError={(e) => e.target.src = 'https://ui-avatars.com/api/?name=' + subject.name}
                    />
                </div>
                {completed ? (
                    <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                        <CheckCircle2 size={12} /> {completed.score}%
                    </div>
                ) : (
                    <div className="bg-amber-500/10 text-amber-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                        Pending
                    </div>
                )}
            </div>
            
            <h4 className="text-xl font-black text-title line-clamp-1 group-hover:text-primary transition-colors">{subject.name}</h4>
            <p className="text-xs font-medium text-muted-foreground mt-2 line-clamp-2 leading-relaxed">{subject.description}</p>
            
            <div className="mt-6 flex items-center justify-between">
                <span className="text-[10px] font-black text-muted-foreground uppercase">{subject.assessments.length} Assessments</span>
                <Link className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-title group-hover:bg-primary group-hover:text-white transition-all">
                    <ChevronRight size={18} />
                </Link>
            </div>
        </div>
    );
}