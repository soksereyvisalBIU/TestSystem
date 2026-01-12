import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    GraduationCap,
    ArrowRight,
    Rocket,
    CheckCircle2,
    ChevronRight,
    Clock,
    Target,
    Zap,
    ArrowUpRight,
    AlertCircle,
    Timer,
    LayoutGrid,
    TrendingUp,
    Compass
} from 'lucide-react';
import { useState, useMemo } from 'react';

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
        const scored = submissions.filter(s => s.status === 'scored');
        
        // Calculate Global GPA
        const avg = scored.length > 0 
            ? scored.reduce((acc, curr) => acc + parseFloat(curr.score), 0) / scored.length 
            : 0;

        // Scan all classrooms for time-sensitive "Live" assessments
        classrooms.forEach(cls => {
            cls.subjects.forEach(sub => {
                sub.assessments.forEach(assess => {
                    const start = new Date(assess.start_time);
                    const end = new Date(assess.end_time);
                    const submission = submissions.find(s => s.assessment_id === assess.id);

                    if (now >= start && now <= end && (!submission || submission.status !== 'scored')) {
                        missions.push({
                            ...assess,
                            subjectName: sub.name,
                            classId: cls.id,
                            subjectId: sub.id,
                            submission: submission
                        });
                    }
                });
            });
        });

        return {
            globalStats: {
                avg: avg.toFixed(1),
                completed: scored.length,
                peak: scored.length > 0 ? Math.max(...scored.map(s => parseFloat(s.score))) : 0
            },
            liveMissions: missions
        };
    }, [classrooms, submissions]);

    return (
        <AppLayout>
            <Head title="Scholar Dashboard | Mission Control" />

            <div className="relative mx-auto max-w-7xl p-4 md:p-8 lg:p-12 space-y-10">
                
                {/* --- HEADER: IDENTITY & GLOBAL STATS --- */}
                <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            <p className="text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase">
                                {isNewUser ? 'System Standby' : 'Academic Session Active'}
                            </p>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-[1000] tracking-tighter text-title leading-none">
                            {isNewUser ? "Begin," : "Hello,"} <span className="text-primary italic">{student.name.split(' ')[0]}</span>
                        </h1>
                    </div>

                    {!isNewUser && (
                        <div className="flex items-center gap-4 bg-card/50 backdrop-blur-xl border border-border p-2 rounded-3xl shadow-xl">
                            <div className="px-6 py-2 border-r border-border text-center">
                                <p className="text-[10px] font-black text-muted-foreground uppercase">Global GPA</p>
                                <p className="text-2xl font-black text-primary">{globalStats.avg}%</p>
                            </div>
                            <div className="px-6 py-2 text-center">
                                <p className="text-[10px] font-black text-muted-foreground uppercase">Peak Score</p>
                                <p className="text-2xl font-black text-emerald-500">{globalStats.peak}%</p>
                            </div>
                        </div>
                    )}
                </header>

                {isNewUser ? (
                    /* --- SCENARIO A: THE ONBOARDING EXPERIENCE --- */
                    <EmptyStateView />
                ) : (
                    /* --- SCENARIO B: THE FULL POWER DASHBOARD --- */
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        
                        {/* LEFT COLUMN: LIVE TASKS & CLASSROOM EXPLORER */}
                        <div className="lg:col-span-8 space-y-12">
                            
                            {/* 1. LIVE MISSIONS (URGENT) */}
                            {liveMissions.length > 0 && (
                                <section className="space-y-4">
                                    <div className="flex items-center gap-2 px-1">
                                        <AlertCircle size={16} className="text-rose-500 animate-pulse" />
                                        <h3 className="text-sm font-black uppercase tracking-widest text-rose-500">Live Missions Due Soon</h3>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        {liveMissions.map((task) => (
                                            <Link 
                                                key={task.id}
                                                href={`/student/classes/${task.classId}/subjects/${task.subjectId}/assessment/${task.id}`}
                                                className="group relative bg-rose-50 border-2 border-rose-100 rounded-[2rem] p-6 flex flex-col md:flex-row justify-between items-center hover:bg-rose-100 hover:border-rose-300 transition-all duration-300"
                                            >
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="bg-rose-500 text-white text-[9px] font-black px-2 py-0.5 rounded uppercase">{task.type}</span>
                                                        <span className="text-xs font-bold text-rose-700 underline decoration-rose-200">{task.subjectName}</span>
                                                    </div>
                                                    <h4 className="text-xl font-black text-rose-950">{task.title}</h4>
                                                    <p className="text-[10px] font-bold text-rose-600 flex items-center gap-1 uppercase">
                                                        <Timer size={12} /> Deadline: {new Date(task.end_time).toLocaleString()}
                                                    </p>
                                                </div>
                                                <div className="bg-rose-500 text-white px-8 py-3 rounded-2xl font-black text-sm flex items-center gap-2 group-hover:bg-rose-600 transition-all">
                                                    {task.submission?.status === 'draft' ? 'RESUME' : 'START NOW'} <ArrowRight size={18} />
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* 2. CLASSROOM NAVIGATOR */}
                            <section className="space-y-6">
                                <div className="flex items-center justify-between px-1">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Classroom Navigator</h3>
                                    <Link href="/student/classes" className="text-xs font-bold text-primary hover:underline">View All Classes</Link>
                                </div>
                                <div className="flex items-center gap-4 overflow-x-auto pb-4 no-scrollbar">
                                    {classrooms.map((cls, idx) => (
                                        <button 
                                            key={cls.id}
                                            onClick={() => setActiveClassIndex(idx)}
                                            className={`flex-shrink-0 flex flex-col items-start px-8 py-5 rounded-[2.5rem] border-2 transition-all duration-300 ${
                                                activeClassIndex === idx 
                                                ? 'bg-primary border-primary text-white shadow-2xl shadow-primary/30 scale-105' 
                                                : 'bg-card border-border text-title hover:border-primary/50'
                                            }`}
                                        >
                                            <span className="text-[10px] font-black uppercase opacity-60">Year {cls.year} • Sem {cls.semester}</span>
                                            <span className="font-black text-xl whitespace-nowrap">{cls.name}</span>
                                        </button>
                                    ))}
                                    <Link href="/student/classes" className="flex-shrink-0 w-20 h-20 rounded-full border-2 border-dashed border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-all">
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
                                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
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
                            </AnimatePresence>
                        </div>

                        {/* RIGHT COLUMN: IDENTITY & ANALYTICS */}
                        <div className="lg:col-span-4 space-y-8">
                            
                            {/* DIGITAL SCHOLAR ID */}
                            {/* <div className="bg-slate-950 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-primary/20 rounded-full blur-[80px]" />
                                <div className="relative z-10 space-y-12">
                                    <div className="flex justify-between items-start">
                                        <div className="h-14 w-14 bg-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/40">
                                            <GraduationCap size={32} />
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black opacity-40 uppercase tracking-widest">Enrollment Code</p>
                                            <p className="font-mono text-xl font-black text-primary tracking-tighter">{activeClass.code}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black opacity-40 uppercase tracking-widest">Full Name</p>
                                        <h3 className="text-3xl font-[1000] tracking-tight leading-none mt-1">{student.name}</h3>
                                        <p className="text-xs font-bold text-muted-foreground mt-2">{student.email}</p>
                                    </div>
                                    <Link 
                                        href={`/student/classes/${activeClass.id}`}
                                        className="w-full bg-white text-slate-950 py-5 rounded-[2rem] font-black flex items-center justify-center gap-3 hover:bg-primary hover:text-white transition-all group-hover:shadow-2xl shadow-primary/20"
                                    >
                                        ENTER CLASSROOM <ArrowUpRight size={20} />
                                    </Link>
                                </div>
                            </div> */}

                            <div className="bg-gradient-to-br from-indigo-600 to-violet-800 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <GraduationCap size={120} />
                                </div>
                                <div className="relative z-10 space-y-12">
                                    <div className="flex justify-between">
                                        <div className="h-12 w-12 bg-white/20 rounded-xl backdrop-blur-md flex items-center justify-center font-black">
                                            {student.name.charAt(0)}
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black opacity-50 uppercase tracking-widest">Scholar ID</p>
                                            <p className="font-mono text-sm">#{student.id}992026</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black opacity-50 uppercase">Student Name</p>
                                        <h3 className="text-3xl font-black tracking-tight">{student.name}</h3>
                                        <p className="text-xs font-bold opacity-60 mt-1 uppercase tracking-tighter">{student.email}</p>
                                    </div>
                                    <div className="flex justify-between items-center pt-6 border-t border-white/10">
                                        <div>
                                            <p className="text-[10px] font-bold opacity-50">COMPLETED</p>
                                            {/* <p className="text-xl font-black">{stats.completed} Tasks</p> */}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold opacity-50 text-right">PEAK SCORE</p>
                                            {/* <p className="text-xl font-black text-emerald-400">{stats.highest}%</p> */}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* PROGRESS PULSE */}
                            <div className="bg-card border border-border rounded-[3rem] p-8 space-y-6">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Quick Stats</h4>
                                    <TrendingUp size={18} className="text-primary" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-muted/40 p-4 rounded-3xl">
                                        <p className="text-[10px] font-black text-muted-foreground uppercase">Subjects</p>
                                        <p className="text-2xl font-black text-title">{activeClass.subjects.length}</p>
                                    </div>
                                    <div className="bg-muted/40 p-4 rounded-3xl">
                                        <p className="text-[10px] font-black text-muted-foreground uppercase">Tasks Done</p>
                                        <p className="text-2xl font-black text-title">{globalStats.completed}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-card border border-border rounded-[2.5rem] p-8 space-y-8 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-black text-title italic">Up Comming</h3>
                                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-black">
                                        {activeClass.subjects.flatMap(s => s.assessments).length}
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    {activeClass.subjects.flatMap(s => s.assessments).slice(0, 4).map((task, i) => {
                                        const sub = submissions.find(s => s.assessment_id === task.id);
                                        return (
                                            <div key={i} className="flex gap-4 group">
                                                <div className="flex flex-col items-center">
                                                    <div className={`h-3 w-3 rounded-full border-2 ${sub ? 'bg-emerald-500 border-emerald-500' : 'border-primary'}`} />
                                                    <div className="w-px h-full bg-border mt-2" />
                                                </div>
                                                <div className="pb-4">
                                                    <p className="text-[10px] font-black text-muted-foreground uppercase">{new Date(task.end_time).toLocaleDateString()}</p>
                                                    <h4 className="font-bold text-title text-sm group-hover:text-primary transition-colors">{task.title}</h4>
                                                    <span className="text-[9px] font-black uppercase text-primary/60">{task.type}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
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
        <div className="group bg-card border border-border rounded-[2.5rem] p-7 hover:border-primary/50 transition-all hover:shadow-2xl flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start mb-6">
                    <div className="h-16 w-16 rounded-[1.25rem] overflow-hidden border-2 border-border shadow-inner">
                        <img 
                            src={`/storage/${subject.cover}`} 
                            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" 
                            onError={(e) => e.target.src = `https://ui-avatars.com/api/?name=${subject.name}&background=6366f1&color=fff&bold=true`}
                        />
                    </div>
                    <Link 
                        href={`/student/classes/${classId}/subjects/${subject.id}`}
                        className="p-3 rounded-2xl bg-muted text-muted-foreground hover:bg-primary hover:text-white transition-all shadow-sm"
                    >
                        <ChevronRight size={20} />
                    </Link>
                </div>
                <h4 className="text-2xl font-black text-title tracking-tight leading-none mb-2">{subject.name}</h4>
                <p className="text-sm font-medium text-muted-foreground line-clamp-2 leading-relaxed">{subject.description}</p>
            </div>
            
            <div className="mt-8 space-y-3">
                {subject.assessments.slice(0, 2).map(assess => {
                    const sub = submissions.find(s => s.assessment_id === assess.id);
                    return (
                        <Link 
                            key={assess.id}
                            href={`/student/classes/${classId}/subjects/${subject.id}/assessment/${assess.id}`}
                            className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 hover:bg-muted transition-all group/task"
                        >
                            <div className="flex items-center gap-3">
                                {sub?.status === 'scored' 
                                    ? <CheckCircle2 size={16} className="text-emerald-500" /> 
                                    : <Clock size={16} className="text-amber-500" />
                                }
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-title">{assess.title}</span>
                                    <span className="text-[9px] font-black uppercase opacity-40">{assess.type}</span>
                                </div>
                            </div>
                            {sub?.status === 'scored' ? (
                                <span className="text-xs font-black text-emerald-600">{sub.score}%</span>
                            ) : (
                                <ArrowUpRight size={14} className="opacity-0 group-hover/task:opacity-100 transition-all" />
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
            className="grid grid-cols-1 md:grid-cols-2 gap-8 py-10"
        >
            <div className="bg-slate-950 rounded-[4rem] p-12 md:p-16 text-white flex flex-col justify-between items-start min-h-[500px] relative overflow-hidden">
                <Rocket className="absolute -bottom-10 -right-10 text-primary/10 w-80 h-80 -rotate-12" />
                <div className="relative z-10 space-y-8">
                    <div className="h-20 w-20 bg-primary rounded-[2rem] flex items-center justify-center shadow-2xl shadow-primary/40">
                        <Plus size={40} strokeWidth={3} />
                    </div>
                    <h2 className="text-6xl font-[1000] tracking-tighter leading-[0.9]">Ready to <br/> Launch?</h2>
                    <p className="text-slate-400 text-lg font-medium max-w-xs leading-relaxed">
                        Join your first classroom to access personalized subjects, track your GPA, and unlock your scholar roadmap.
                    </p>
                    <Link 
                        href="/student/classes" 
                        className="inline-flex items-center gap-4 bg-white text-slate-950 px-10 py-5 rounded-[2rem] font-black group transition-all hover:bg-primary hover:text-white"
                    >
                        Browse Classrooms <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
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
        <div className="bg-card border border-border rounded-[3rem] p-8 flex gap-8 items-center transition-all hover:border-primary/30">
            <div className={`h-20 w-20 flex-shrink-0 rounded-[2rem] ${bg} flex items-center justify-center ${color}`}>
                <Icon size={32} />
            </div>
            <div>
                <h4 className="font-black text-title text-2xl tracking-tight">{title}</h4>
                <p className="text-muted-foreground mt-1 text-sm font-medium leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}