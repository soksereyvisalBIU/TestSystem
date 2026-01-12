import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    BookOpen,
    GraduationCap,
    ArrowRight,
    Compass,
    Rocket,
    CheckCircle2,
    ChevronRight,
    Clock,
    Target,
    LayoutGrid,
    TrendingUp,
    Zap,
    MapPin,
    ArrowUpRight
} from 'lucide-react';
import { useState, useMemo } from 'react';

export default function StudentDashboard({ student }) {
    // --- 1. DATA INITIALIZATION ---
    const classrooms = student?.student_classrooms || [];
    const submissions = student?.student_assessment || [];
    const isNewUser = classrooms.length === 0;
    
    // UI State for Active Classroom
    const [activeClassIndex, setActiveClassIndex] = useState(0);
    const activeClass = classrooms[activeClassIndex];

    // --- 2. ANALYTICS CALCULATIONS ---
    const stats = useMemo(() => {
        const scored = submissions.filter(s => s.status === 'scored');
        const avg = scored.length > 0 
            ? scored.reduce((acc, curr) => acc + parseFloat(curr.score), 0) / scored.length 
            : 0;
        
        const totalTasks = classrooms.reduce((acc, cls) => 
            acc + cls.subjects.reduce((sAcc, sub) => sAcc + sub.assessments.length, 0), 0);
            
        return { 
            avg: avg.toFixed(1), 
            completed: scored.length, 
            totalTasks,
            highest: scored.length > 0 ? Math.max(...scored.map(s => parseFloat(s.score))) : 0
        };
    }, [submissions, classrooms]);

    return (
        <AppLayout>
            <Head title="Scholar OS | Mission Control" />

            {/* Background Aesthetic Blur */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px]" />
            </div>

            <div className="relative mx-auto max-w-7xl p-4 md:p-8 lg:p-12 space-y-10">
                
                {/* --- HEADER SECTION --- */}
                <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            <p className="text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase">
                                {isNewUser ? 'System Initialization' : 'Academic Session Active'}
                            </p>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-[1000] tracking-tighter text-title leading-none">
                            {isNewUser ? "Begin," : "Hello,"} <span className="text-primary italic">{student.name.split(' ')[0]}</span>
                        </h1>
                    </div>

                    {!isNewUser && (
                        <div className="flex items-center gap-4 bg-card/50 backdrop-blur-xl border border-border p-2 rounded-3xl shadow-xl">
                            <div className="px-6 py-2 border-r border-border text-center">
                                <p className="text-[10px] font-black text-muted-foreground uppercase">Avg Score</p>
                                <p className="text-2xl font-black text-primary">{stats.avg}%</p>
                            </div>
                            <div className="px-6 py-2">
                                <p className="text-[10px] font-black text-muted-foreground uppercase">Ranking</p>
                                <p className="text-2xl font-black text-title">Top 5%</p>
                            </div>
                        </div>
                    )}
                </header>

                {isNewUser ? (
                    /* --- SCENARIO A: NEW USER ONBOARDING --- */
                    <EmptyStateView />
                ) : (
                    /* --- SCENARIO B: ACTIVE STUDENT DASHBOARD --- */
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        
                        {/* LEFT COLUMN: CLASSES & SUBJECTS */}
                        <div className="lg:col-span-8 space-y-8">
                            
                            {/* CLASS SWITCHER */}
                            <div className="flex items-center gap-4 overflow-x-auto pb-4 no-scrollbar">
                                {classrooms.map((cls, idx) => (
                                    <button 
                                        key={cls.id}
                                        onClick={() => setActiveClassIndex(idx)}
                                        className={`flex-shrink-0 flex flex-col items-start px-6 py-4 rounded-[2rem] border transition-all duration-300 ${
                                            activeClassIndex === idx 
                                            ? 'bg-primary border-primary text-white shadow-2xl shadow-primary/30' 
                                            : 'bg-card border-border text-title hover:border-primary/50'
                                        }`}
                                    >
                                        <span className="text-[10px] font-black uppercase opacity-60">Year {cls.year} • Sem {cls.semester}</span>
                                        <span className="font-bold text-lg whitespace-nowrap">{cls.name}</span>
                                    </button>
                                ))}
                                <Link href="/student/classes" className="flex-shrink-0 w-16 h-16 rounded-full border-2 border-dashed border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-all">
                                    <Plus size={24} />
                                </Link>
                            </div>

                            {/* ACTIVE CLASS BENTO */}
                            <motion.div 
                                key={activeClass.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="relative group overflow-hidden rounded-[3.5rem] bg-slate-900 p-10 text-white"
                            >
                                <div className="absolute top-0 right-0 -mt-20 -mr-20 h-80 w-80 bg-primary/20 rounded-full blur-[100px]" />
                                <div className="relative z-10 space-y-8">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-2">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest">
                                                <Zap size={12} className="text-yellow-400 fill-yellow-400" /> Current Focus
                                            </div>
                                            <h2 className="text-4xl text-primary font-black">{activeClass.name}</h2>
                                        </div>
                                        <Link 
                                            href={`/student/classes/${activeClass.id}`}
                                            className="h-14 w-14 bg-white text-slate-900 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                                        >
                                            <ArrowUpRight size={24} />
                                        </Link>
                                    </div>
                                    <div className="flex flex-wrap gap-6 text-sm font-bold text-white/50">
                                        <div className="flex items-center gap-2"><MapPin size={16} /> Campus {activeClass.campus}</div>
                                        <div className="flex items-center gap-2"><LayoutGrid size={16} /> {activeClass.subjects.length} Subjects</div>
                                        <div className="flex items-center gap-2"><Clock size={16} /> Batch {activeClass.batch}</div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* SUBJECTS GRID */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {activeClass.subjects.map((subject) => (
                                    <SubjectCard 
                                        key={subject.id} 
                                        subject={subject} 
                                        classId={activeClass.id} 
                                        submissions={submissions} 
                                    />
                                ))}
                            </div>
                        </div>

                        {/* RIGHT COLUMN: PROFILE & ACTION ITEMS */}
                        <div className="lg:col-span-4 space-y-8">
                            {/* SCHOLAR ID CARD */}
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
                                            <p className="text-xl font-black">{stats.completed} Tasks</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold opacity-50 text-right">PEAK SCORE</p>
                                            <p className="text-xl font-black text-emerald-400">{stats.highest}%</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* PRIORITY QUEUE */}
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

/**
 * Subject Card Component
 * Handles the deep-linking to Subjects and individual Assessments
 */
function SubjectCard({ subject, classId, submissions }) {
    return (
        <div className="group bg-card border border-border rounded-[2.5rem] p-6 hover:border-primary/40 transition-all hover:shadow-2xl">
            <div className="flex justify-between items-start mb-6">
                <div className="h-16 w-16 rounded-2xl overflow-hidden border-2 border-border shadow-inner">
                    <img 
                        src={`/storage/${subject.cover}`} 
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        onError={(e) => e.target.src = `https://ui-avatars.com/api/?name=${subject.name}&background=6366f1&color=fff`}
                    />
                </div>
                <Link 
                    href={`/student/classes/${classId}/subjects/${subject.id}`}
                    className="p-3 rounded-xl bg-muted text-muted-foreground hover:bg-primary hover:text-white transition-all"
                >
                    <ChevronRight size={20} />
                </Link>
            </div>
            
            <h4 className="text-2xl font-[1000] text-title tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
                {subject.name}
            </h4>
            
            <div className="mt-8 space-y-3">
                {subject.assessments.slice(0, 3).map(assess => {
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
                            <div className="text-right">
                                {sub?.status === 'scored' ? (
                                    <span className="text-xs font-black text-emerald-600">{sub.score}%</span>
                                ) : (
                                    <ArrowUpRight size={14} className="opacity-0 group-hover/task:opacity-100 transition-all" />
                                )}
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

/**
 * Empty State / Onboarding View
 */
function EmptyStateView() {
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 py-10"
        >
            <div className="bg-slate-900 rounded-[4rem] p-12 text-white flex flex-col justify-between items-start relative overflow-hidden min-h-[450px]">
                <div className="absolute -bottom-10 -right-10 opacity-10">
                    <Rocket size={300} />
                </div>
                <div className="relative z-10 space-y-8">
                    <div className="h-16 w-16 bg-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/40">
                        <Plus size={32} strokeWidth={3} />
                    </div>
                    <h2 className="text-5xl font-black leading-[0.9] tracking-tighter">Your Desk is <br/> Empty.</h2>
                    <p className="text-slate-400 text-lg font-medium max-w-xs leading-relaxed">
                        Join a classroom to access your subjects, assessments, and study roadmap.
                    </p>
                    <Link 
                        href="/student/classes" 
                        className="inline-flex items-center gap-4 bg-white text-slate-900 px-10 py-5 rounded-[2rem] font-black group transition-all hover:bg-primary hover:text-white"
                    >
                        Browse Classrooms <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                    </Link>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-card border border-border rounded-[3rem] p-8 flex gap-8 items-center">
                    <div className="h-20 w-20 flex-shrink-0 rounded-[2rem] bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                        <Compass size={32} />
                    </div>
                    <div>
                        <h4 className="font-black text-title text-2xl tracking-tight">Curriculum Sync</h4>
                        <p className="text-muted-foreground mt-1 text-sm font-medium leading-relaxed">Once enrolled, your subjects will automatically sync with your major and year.</p>
                    </div>
                </div>
                <div className="bg-card border border-border rounded-[3rem] p-8 flex gap-8 items-center">
                    <div className="h-20 w-20 flex-shrink-0 rounded-[2rem] bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        <Target size={32} />
                    </div>
                    <div>
                        <h4 className="font-black text-title text-2xl tracking-tight">Performance Tracking</h4>
                        <p className="text-muted-foreground mt-1 text-sm font-medium leading-relaxed">Visual analytics will appear as you complete quizzes and homework.</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}