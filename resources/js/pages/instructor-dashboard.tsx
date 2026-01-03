import AppLayout from '@/layouts/app-layout';
import {
    AlertTriangle,
    ArrowRight,
    Calendar,
    Clock,
    FileText,
    MoreVertical,
    Plus,
    TrendingUp,
    Users,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function LectureDashboard() {
    const stats = [
        { label: 'Total Students', value: '142', icon: Users, color: 'text-sky-500', bg: 'bg-sky-500/10' },
        { label: 'Pending Grading', value: '28', icon: FileText, color: 'text-amber-500', bg: 'bg-amber-500/10', alert: true },
        { label: 'Avg. Attendance', value: '88%', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    ];

    return (
        <AppLayout title="Lecturer Dashboard">
            <div className="flex flex-col gap-8 p-6 lg:p-10 ">
                
                {/* --- HEADER --- */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-foreground">
                            Academic Control
                        </h1>
                        <p className="text-muted-foreground font-medium">
                            Manage curriculum, track performance, and grade submissions.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border bg-card hover:bg-muted transition-colors font-bold text-sm shadow-sm">
                            <Calendar size={18} /> Schedule
                        </button>
                        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-all font-bold text-sm shadow-lg shadow-primary/20 active:scale-95">
                            <Plus size={18} strokeWidth={3} /> Create Assignment
                        </button>
                    </div>
                </header>

                {/* --- STATS GRID --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="group flex items-center p-5 rounded-2xl border bg-card hover:border-primary/50 transition-all shadow-sm"
                        >
                            <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", stat.bg, stat.color)}>
                                <stat.icon size={24} />
                            </div>
                            <div className="ml-4 flex-1">
                                <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                    {stat.label}
                                </p>
                                <div className="flex items-center justify-between">
                                    <h3 className="text-2xl font-black text-foreground">{stat.value}</h3>
                                    {stat.alert && (
                                        <span className="relative flex h-3 w-3">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                                        </span>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* --- MAIN CONTENT (LEFT) --- */}
                    <div className="lg:col-span-8 space-y-8">
                        
                        {/* SCHEDULE SECTION */}
                        <section className="p-6 rounded-3xl border bg-card shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="flex items-center gap-2 text-lg font-black">
                                    <Clock className="text-primary" size={20} /> Today's Schedule
                                </h3>
                                <span className="text-xs font-bold text-muted-foreground bg-muted px-3 py-1 rounded-full uppercase tracking-tighter">
                                    18 Dec 2025
                                </span>
                            </div>

                            <div className="grid gap-4">
                                {/* Example of a Live Class Card */}
                                <div className="relative overflow-hidden group rounded-2xl border-2 border-primary bg-primary/5 p-5 shadow-xl shadow-primary/10">
                                    <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                                        <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-primary text-primary-foreground font-black text-sm">
                                            Hall B
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-[10px] font-black tracking-widest text-primary uppercase">WE-201 • Live Now</div>
                                            <h4 className="text-xl font-bold">Web Engineering II</h4>
                                            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mt-1">
                                                <Clock size={14} /> 14:00 - 17:00
                                            </div>
                                        </div>
                                        <button className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary text-primary-foreground font-black text-sm hover:scale-105 transition-transform shadow-md">
                                            Resume Class
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* SUBMISSIONS SECTION */}
                        <section className="overflow-hidden rounded-3xl border bg-card shadow-sm">
                            <div className="p-6 border-b bg-muted/30 flex items-center justify-between">
                                <h3 className="text-lg font-black">Recent Submissions</h3>
                                <button className="text-sm font-bold text-primary hover:underline">View All</button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="text-[10px] text-muted-foreground uppercase bg-muted/50 font-black">
                                        <tr>
                                            <th className="px-6 py-4">Student</th>
                                            <th className="px-6 py-4">Assignment</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {[1, 2, 3].map((_, i) => (
                                            <tr key={i} className="hover:bg-muted/30 transition-colors group">
                                                <td className="px-6 py-4 font-bold">Sokha Vatanak</td>
                                                <td className="px-6 py-4 text-muted-foreground">Database Schema</td>
                                                <td className="px-6 py-4">
                                                    <span className="text-[10px] font-bold py-1 px-2 bg-emerald-500/10 text-emerald-600 rounded">Submitted</span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-black hover:bg-primary hover:text-white transition-all">
                                                        Grade
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>

                    {/* --- SIDEBAR (RIGHT) --- */}
                    <aside className="lg:col-span-4 space-y-8">
                        {/* INTERVENTION CARD */}
                        <div className="p-6 rounded-3xl border bg-card shadow-sm">
                            <div className="flex items-center gap-2 text-amber-500 mb-6">
                                <AlertTriangle size={20} />
                                <h3 className="text-lg font-black text-foreground">Needs Attention</h3>
                            </div>
                            <div className="space-y-4">
                                {[1, 2].map((_, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-transparent hover:border-border transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-bold border">L</div>
                                            <div>
                                                <p className="text-sm font-bold">Ly Mony</p>
                                                <p className="text-[10px] font-black text-destructive uppercase tracking-tighter">Missed 3 Classes</p>
                                            </div>
                                        </div>
                                        <button className="p-2 hover:bg-background rounded-lg text-muted-foreground">
                                            <MoreVertical size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button className="mt-6 w-full py-3 rounded-xl border-2 border-dashed border-muted-foreground/20 text-muted-foreground text-xs font-bold hover:bg-muted/30 transition-all">
                                View Performance Analytics
                            </button>
                        </div>

                        {/* TOOLS CARD */}
                        <div className="p-6 rounded-3xl bg-slate-950 text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[80px] group-hover:bg-primary/40 transition-all" />
                            <h3 className="text-lg font-black mb-4 relative z-10">Faculty Tools</h3>
                            <div className="grid gap-2 relative z-10">
                                {['Attendance Report', 'Email Students', 'Curriculum Settings'].map((tool, i) => (
                                    <button key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-xs font-bold text-slate-300">
                                        {tool}
                                        <ArrowRight size={14} className="text-primary" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </AppLayout>
    );
}