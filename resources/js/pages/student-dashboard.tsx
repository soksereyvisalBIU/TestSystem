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
    MoreHorizontal,
    TrendingUp,
    Video,
} from 'lucide-react';

const stats = [
    {
        label: 'Current GPA',
        value: '3.8',
        trend: '+0.2',
        icon: TrendingUp,
        color: 'text-success',
        bg: 'bg-success/10',
    },
    {
        label: 'Attendance',
        value: '94%',
        trend: 'Good',
        icon: CheckCircle2,
        color: 'text-primary',
        bg: 'bg-primary/10',
    },
    {
        label: 'Pending Tasks',
        value: '4',
        trend: 'Urgent',
        icon: AlertCircle,
        color: 'text-destructive',
        bg: 'bg-destructive/10',
    },
];

const nextClass = {
    title: 'Advanced Database Systems',
    code: 'CS-402',
    time: '14:00 - 16:00',
    location: 'Lab 402 (Building B)',
    instructor: 'Mr. Sok Sereyvisal',
    status: 'Starting in 15m',
};

const timeline = [
    {
        id: 1,
        title: 'Database Design Quiz',
        course: 'CS-402',
        time: 'Today, 11:59 PM',
        type: 'deadline',
    },
    {
        id: 2,
        title: 'Network Security Lab',
        course: 'IT-301',
        time: 'Tomorrow, 08:00 AM',
        type: 'class',
    },
    {
        id: 3,
        title: 'Midterm Project Submission',
        course: 'SE-202',
        time: 'Fri, 12 Oct',
        type: 'exam',
    },
];

const courses = [
    {
        name: 'Data Structures',
        code: 'CS-201',
        progress: 75,
        color: 'bg-chart-1',
    },
    {
        name: 'Web Development',
        code: 'WD-102',
        progress: 45,
        color: 'bg-chart-3',
    },
    { 
        name: 'Calculus II', 
        code: 'MA-202', 
        progress: 90, 
        color: 'bg-chart-4' 
    },
];

export default function Dashboard() {
    return (
        <AppLayout>
            <Head title="Mission Control" />

            <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 p-4 md:p-8">
                {/* --- 1. WELCOME HEADER --- */}
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-3xl font-[1000] tracking-tight text-title">
                            Mission Control
                        </h1>
                        <p className="mt-1 font-medium text-description">
                            Welcome back,{' '}
                            <span className="font-bold text-primary">
                                Student
                            </span>
                            . System is optimal.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="hidden rounded-full bg-muted px-3 py-1 font-mono text-xs font-bold text-muted-foreground md:inline-flex">
                            SEM_1_2025
                        </span>
                        <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:opacity-90 active:scale-95">
                            <BookOpen size={16} />
                            <span>My Schedule</span>
                        </button>
                    </div>
                </div>

                {/* --- 2. STATS GRID --- */}
                <div className="grid gap-4 md:grid-cols-3">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-bold tracking-wide text-description uppercase">
                                        {stat.label}
                                    </p>
                                    <h3 className="mt-2 text-3xl font-[900] text-title">
                                        {stat.value}
                                    </h3>
                                </div>
                                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.bg} ${stat.color}`}>
                                    <stat.icon size={24} />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-2 text-xs font-bold">
                                <span className={`${stat.color} rounded-md bg-background px-2 py-0.5`}>
                                    {stat.trend}
                                </span>
                                <span className="text-description">
                                    vs last semester
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* --- 3. MAIN CONTENT GRID (Bento Style) --- */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
                    {/* LEFT COL: Next Class & Courses */}
                    <div className="flex flex-col gap-6 md:col-span-8">
                        {/* FEATURED: NEXT CLASS CARD */}
                        <div className="relative overflow-hidden rounded-[2.5rem] bg-primary p-8 text-primary-foreground shadow-2xl shadow-primary/30">
                            {/* Decorative Background Pattern */}
                            <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                            
                            <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
                                <div>
                                    <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/20 px-3 py-1 text-[10px] font-black tracking-widest uppercase backdrop-blur-md">
                                        <Activity size={12} className="animate-pulse" />
                                        Up Next
                                    </div>
                                    <h2 className="mt-4 text-3xl leading-tight font-[900] md:text-4xl text-primary-foreground">
                                        {nextClass.title}
                                    </h2>
                                    <div className="mt-2 text-lg font-medium opacity-90">
                                        {nextClass.code} • {nextClass.instructor}
                                    </div>

                                    <div className="mt-8 flex flex-wrap gap-4">
                                        <div className="flex items-center gap-2 rounded-lg border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1.5 text-sm font-bold">
                                            <Clock size={16} />
                                            {nextClass.time}
                                        </div>
                                        <div className="flex items-center gap-2 rounded-lg border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1.5 text-sm font-bold">
                                            <MapPin size={16} />
                                            {nextClass.location}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex min-w-[140px] flex-col gap-3">
                                    <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-4 text-sm font-black text-primary shadow-xl transition-all hover:bg-opacity-90 active:scale-95">
                                        <ArrowUpRight size={18} />
                                        Check In
                                    </button>
                                    <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-primary-foreground/20 bg-primary-foreground/10 py-3 text-sm font-bold text-primary-foreground transition-all hover:bg-primary-foreground/20">
                                        <Video size={16} />
                                        Join Online
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* ACTIVE COURSES GRID */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {courses.map((course, i) => (
                                <div key={i} className="group flex flex-col justify-between rounded-3xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg">
                                    <div className="flex items-start justify-between">
                                        <div className={`h-10 w-10 rounded-xl ${course.color} bg-opacity-10 flex items-center justify-center`}>
                                            <GraduationCap className={`size-5 ${course.color.replace('bg-', 'text-')}`} />
                                        </div>
                                        <button className="text-muted-foreground hover:text-primary">
                                            <MoreHorizontal size={20} />
                                        </button>
                                    </div>
                                    <div className="mt-6">
                                        <h4 className="text-lg font-bold text-title">{course.name}</h4>
                                        <p className="text-xs font-bold text-description">{course.code}</p>
                                    </div>
                                    <div className="mt-6">
                                        <div className="mb-2 flex justify-between text-xs font-bold">
                                            <span className="text-description">Progress</span>
                                            <span className="text-title">{course.progress}%</span>
                                        </div>
                                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                                            <div 
                                                className={`h-full rounded-full ${course.color} transition-all duration-1000`}
                                                style={{ width: `${course.progress}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border bg-muted/50 p-6 text-description transition-all hover:border-primary hover:text-primary">
                                <div className="rounded-full bg-card p-3 shadow-sm">
                                    <ArrowUpRight size={24} />
                                </div>
                                <span className="mt-3 text-xs font-black tracking-widest uppercase">
                                    Register Course
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* RIGHT COL: Timeline & Tasks */}
                    <div className="flex flex-col gap-6 md:col-span-4">
                        <div className="rounded-3xl border border-border bg-card p-6">
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="text-lg font-[900] text-title">Timeline</h3>
                                <Link href="#" className="text-xs font-bold text-link hover:underline">
                                    View All
                                </Link>
                            </div>

                            <div className="space-y-6">
                                {timeline.map((item) => (
                                    <div key={item.id} className="relative border-l-2 border-border pl-6 last:border-0">
                                        <div className={`absolute top-1 -left-[5px] h-2.5 w-2.5 rounded-full ring-4 ring-card ${item.type === 'deadline' ? 'bg-destructive' : item.type === 'exam' ? 'bg-chart-3' : 'bg-primary'}`} />
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black tracking-widest text-description uppercase">
                                                {item.type}
                                            </span>
                                            <span className="mt-0.5 leading-tight font-bold text-title">
                                                {item.title}
                                            </span>
                                            <div className="mt-1.5 flex items-center gap-2">
                                                <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground">
                                                    {item.course}
                                                </span>
                                                <span className="text-xs text-description">{item.time}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* STUDENT ID MINIATURE */}
                        <div className="relative overflow-hidden rounded-3xl bg-primary p-6 text-primary-foreground">
                            <div className="flex items-start justify-between">
                                <div className="flex h-8 w-8 items-center justify-center rounded bg-white/10">
                                    <GraduationCap size={16} />
                                </div>
                                <span className="font-mono text-[10px] font-bold opacity-50">ID: B2025-4092</span>
                            </div>
                            <div className="mt-8">
                                <div className="text-[10px] font-black tracking-widest uppercase opacity-60">Computer Science</div>
                                <div className="mt-1 text-xl font-bold">Sokha Vatanak</div>
                            </div>
                            <div className="mt-6 flex gap-1">
                                {[...Array(12)].map((_, i) => (
                                    <div key={i} className={`h-1 flex-1 rounded-full ${i < 8 ? 'bg-white' : 'bg-white/20'}`} />
                                ))}
                            </div>
                            <div className="mt-2 text-right text-[10px] font-bold opacity-60">Level 4 Scholar</div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}