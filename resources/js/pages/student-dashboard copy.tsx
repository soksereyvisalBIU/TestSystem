import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Activity,
    AlertCircle,
    ArrowUpRight,
    BookOpen,
    CheckCircle2,
    Clock,
    GraduationCap,
    MapPin,
    TrendingUp,
    Zap,
    Calendar,
    ChevronRight
} from 'lucide-react';

export default function StudentDashboard({ student }) {
    // --- 1. DATA INTELLIGENCE LAYER ---
    const classrooms = student.student_classrooms || [];
    const submissions = student.student_assessment || [];
    
    // Extract all assessments across all subjects
    const allTasks = classrooms.flatMap(cls => 
        cls.subjects.flatMap(sub => 
            sub.assessments.map(assess => ({
                ...assess,
                subjectName: sub.name,
                classroomName: cls.name,
                // Check if this specific assessment ID exists in the student's submissions
                submission: submissions.find(s => s.assessment_id === assess.id)
            }))
        )
    );

    const pendingTasks = allTasks.filter(t => !t.submission || t.submission.status === 'draft');
    const completedTasks = allTasks.filter(t => t.submission?.status === 'scored' || t.submission?.status === 'submitted');
    
    // Calculate GPA based on scores
    const scoredAssessments = submissions.filter(s => s.status === 'scored');
    const avgScore = scoredAssessments.length > 0 
        ? scoredAssessments.reduce((acc, curr) => acc + parseFloat(curr.score), 0) / scoredAssessments.length 
        : 0;

    return (
        <AppLayout>
            <Head title="Student Mission Control" />

            <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 p-4 md:p-8">
                
                {/* --- HEADER: Contextual Greeting --- */}
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                            </span>
                            <p className="text-[10px] font-black tracking-[0.2em] text-description uppercase">Academic Status: Active</p>
                        </div>
                        <h1 className="text-4xl font-[1000] tracking-tight text-title">
                            Welcome, {student.name.split(' ')[0]}
                        </h1>
                        <p className="mt-1 font-medium text-description">
                            You've completed <span className="text-primary font-bold">{completedTasks.length} tasks</span> this semester. {pendingTasks.length > 0 ? "Keep it up!" : "All clear!"}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 rounded-2xl bg-card border border-border px-5 py-3 text-sm font-bold text-title shadow-sm transition-all hover:bg-muted/50">
                            <Calendar size={18} className="text-primary" />
                            Schedule
                        </button>
                    </div>
                </div>

                {/* --- STATS: Real-time Metrics --- */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard label="Avg Score" value={`${avgScore.toFixed(1)}%`} icon={TrendingUp} trend="+2.4%" color="text-success" bg="bg-success/10" />
                    <StatCard label="Submissions" value={submissions.length} icon={CheckCircle2} trend="Live" color="text-primary" bg="bg-primary/10" />
                    <StatCard label="Pending" value={pendingTasks.length} icon={AlertCircle} trend="Urgent" color="text-destructive" bg="bg-destructive/10" />
                    <StatCard label="Classrooms" value={classrooms.length} icon={BookOpen} trend="Joined" color="text-blue-500" bg="bg-blue-500/10" />
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    {/* LEFT SIDE: Primary Content */}
                    <div className="flex flex-col gap-8 lg:col-span-8">
                        
                        {/* FEATURED: Active Classroom Bento Box */}
                        {classrooms[0] && (
                            <div className="group relative overflow-hidden rounded-[3rem] bg-slate-900 p-8 text-white shadow-2xl transition-all hover:shadow-primary/20">
                                <div className="absolute top-0 right-0 -mt-20 -mr-20 h-80 w-80 rounded-full bg-primary/20 blur-[100px] transition-all group-hover:bg-primary/30" />
                                
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-full bg-white/10 px-4 py-1 text-[10px] font-black tracking-widest uppercase backdrop-blur-md">
                                            Current Hub
                                        </div>
                                        <span className="text-xs font-bold text-white/40">{classrooms[0].code}</span>
                                    </div>
                                    
                                    <h2 className="mt-6 text-3xl font-[1000] leading-tight md:text-5xl">
                                        {classrooms[0].name}
                                    </h2>
                                    
                                    <div className="mt-8 flex flex-wrap gap-6 text-sm font-bold text-white/70">
                                        <div className="flex items-center gap-2"><MapPin size={18} className="text-primary" /> Campus {classrooms[0].campus}</div>
                                        <div className="flex items-center gap-2"><Clock size={18} className="text-primary" /> Semester {classrooms[0].semester}</div>
                                        <div className="flex items-center gap-2"><Zap size={18} className="text-primary" /> Batch {classrooms[0].batch}</div>
                                    </div>
                                    
                                    <div className="mt-10 flex gap-4">
                                        <button className="flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-sm font-black text-slate-900 transition-all hover:scale-105 active:scale-95">
                                            Enter Classroom <ArrowUpRight size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* SUBJECTS GRID */}
                        <div>
                            <h3 className="mb-6 text-xl font-black text-title italic underline decoration-primary/30 decoration-4 underline-offset-8">Academic Portfolio</h3>
                            <div className="grid gap-6 md:grid-cols-2">
                                {classrooms[0]?.subjects.map((subject) => (
                                    <SubjectCard key={subject.id} subject={subject} />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE: Timeline & ID */}
                    <div className="flex flex-col gap-8 lg:col-span-4">
                        {/* THE DYNAMIC TIMELINE */}
                        <div className="rounded-[2.5rem] border border-border bg-card p-8 shadow-xl">
                            <div className="mb-8 flex items-center justify-between">
                                <h3 className="text-xl font-black text-title">Upcoming</h3>
                                <div className="rounded-full bg-muted px-3 py-1 text-[10px] font-bold text-muted-foreground">{pendingTasks.length} Total</div>
                            </div>
                            
                            <div className="space-y-8">
                                {pendingTasks.length > 0 ? pendingTasks.slice(0, 4).map((task) => (
                                    <div key={task.id} className="group relative flex gap-6">
                                        <div className="flex flex-col items-center">
                                            <div className="z-10 h-4 w-4 rounded-full border-4 border-card bg-primary transition-transform group-hover:scale-125" />
                                            <div className="h-full w-0.5 bg-border" />
                                        </div>
                                        <div className="pb-2">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-destructive">Due {new Date(task.end_time).toLocaleDateString()}</p>
                                            <h4 className="mt-1 font-bold leading-tight text-title">{task.title}</h4>
                                            <p className="mt-1 text-xs font-bold text-primary">{task.subjectName}</p>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="flex flex-col items-center justify-center py-10 text-center">
                                        <CheckCircle2 size={40} className="mb-4 text-success/30" />
                                        <p className="text-sm font-bold text-description italic">No pending tasks!</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* STUDENT ID CARD (Framer Motion Enhanced) */}
                        <motion.div 
                            whileHover={{ scale: 1.02, rotate: -1 }}
                            className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary to-indigo-700 p-8 text-white shadow-2xl"
                        >
                            <div className="relative z-10 flex h-full flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <GraduationCap size={32} />
                                    <div className="text-right">
                                        <p className="text-[10px] font-black opacity-50">STUDENT ID</p>
                                        <p className="font-mono text-sm font-bold">#{student.id}2026</p>
                                    </div>
                                </div>
                                <div className="mt-12">
                                    <p className="text-[10px] font-black tracking-[0.2em] opacity-60 uppercase">Scholar Name</p>
                                    <h4 className="text-2xl font-black">{student.name}</h4>
                                </div>
                                <div className="mt-6 flex items-center justify-between border-t border-white/20 pt-6">
                                    <div>
                                        <p className="text-[10px] font-bold opacity-50">LEVEL</p>
                                        <p className="text-sm font-black">Year {classrooms[0]?.year || 1}</p>
                                    </div>
                                    <div className="h-10 w-10 rounded-lg bg-white/10 p-2">
                                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${student.id}`} alt="qr" className="invert" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function StatCard({ label, value, icon: Icon, trend, color, bg }) {
    return (
        <div className="group rounded-3xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg">
            <div className="flex items-center justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${bg} ${color} transition-transform group-hover:scale-110`}>
                    <Icon size={24} />
                </div>
                <span className={`text-[10px] font-black px-2 py-1 rounded-lg bg-muted ${color}`}>{trend}</span>
            </div>
            <h3 className="mt-6 text-3xl font-[1000] text-title">{value}</h3>
            <p className="text-xs font-bold text-description uppercase tracking-widest">{label}</p>
        </div>
    );
}

function SubjectCard({ subject }) {
    return (
        <div className="group flex flex-col justify-between rounded-[2rem] border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-xl">
            <div className="flex items-start justify-between">
                <div className="h-14 w-14 overflow-hidden rounded-2xl bg-muted border border-border">
                    <img 
                        src={`/storage/${subject.cover}`} 
                        className="h-full w-full object-cover transition-transform group-hover:scale-110" 
                        alt={subject.name}
                        onError={(e) => e.target.src = 'https://ui-avatars.com/api/?name=' + subject.name}
                    />
                </div>
                <button className="rounded-full p-2 text-description hover:bg-muted hover:text-primary">
                    <ChevronRight size={20} />
                </button>
            </div>
            
            <div className="mt-6">
                <h4 className="text-xl font-bold text-title group-hover:text-primary transition-colors">{subject.name}</h4>
                <p className="mt-1 text-xs font-medium text-description line-clamp-2">{subject.description}</p>
            </div>
            
            <div className="mt-6 border-t border-border pt-6">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-description">Assigned Tasks</span>
                    <span className="text-title">{subject.assessments.length} Units</span>
                </div>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        className="h-full bg-primary"
                    />
                </div>
            </div>
        </div>
    );
}