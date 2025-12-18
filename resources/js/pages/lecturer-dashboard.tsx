import App from '@/actions/App';
import AppLayout from '@/layouts/app-layout';
import appLayout from '@/layouts/app-layout';
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
 
export default function LectureDashboard() {
    // Mock Data for Lecturers
    const stats = [
        {
            label: 'Total Students',
            value: '142',
            icon: Users,
            color: 'text-sky-600',
            bg: 'bg-sky-50',
        },
        {
            label: 'Pending Grading',
            value: '28',
            icon: FileText,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
            alert: true,
        },
        {
            label: 'Avg. Attendance',
            value: '88%',
            icon: TrendingUp,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
        },
    ];

    const todayClasses = [
        {
            time: '08:00 - 11:00',
            code: 'CS-402',
            name: 'Advanced Database',
            room: 'Lab 402',
            status: 'Completed',
        },
        {
            time: '14:00 - 17:00',
            code: 'WE-201',
            name: 'Web Engineering II',
            room: 'Hall B',
            status: 'Live Now',
            active: true,
        },
    ];

    const needsAttention = [
        {
            name: 'Sokha Vatanak',
            id: 'B202401',
            issue: 'Missed 3 Classes',
            risk: 'High',
        },
        {
            name: 'Ly Mony',
            id: 'B202402',
            issue: 'Failed Midterm',
            risk: 'Medium',
        },
    ];

    return (
        <AppLayout title="Dashboard - Lecturer" layout={appLayout}>
        <div className="flex flex-col gap-6 p-6">
            {/* --- LECTURER HEADER --- */}
            <div className="flex flex-col items-end justify-between gap-4 border-b border-slate-200 pb-6 md:flex-row dark:border-slate-800">
                <div>
                    <h1 className="text-3xl font-[900] tracking-tight text-slate-900 dark:text-white">
                        Academic Control
                    </h1>
                    <p className="mt-1 font-medium text-slate-500">
                        Manage curriculum, track performance, and grade
                        submissions.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                        <Calendar size={16} /> Schedule
                    </button>
                    <button className="flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-sky-500/30 transition-all hover:bg-sky-700 active:scale-95">
                        <Plus size={16} strokeWidth={3} /> Create Assignment
                    </button>
                </div>
            </div>

            {/* --- QUICK STATS ROW --- */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {stats.map((stat, i) => (
                    <div
                        key={i}
                        className="flex items-center rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#09090b]"
                    >
                        <div
                            className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}
                        >
                            <stat.icon size={24} />
                        </div>
                        <div className="ml-4 flex-1">
                            <p className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                                {stat.label}
                            </p>
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-[900] text-slate-900 dark:text-white">
                                    {stat.value}
                                </h3>
                                {stat.alert && (
                                    <span className="flex h-2 w-2 animate-pulse rounded-full bg-amber-500" />
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                {/* --- LEFT: ACTIVE SCHEDULE (Span 8) --- */}
                <div className="flex flex-col gap-6 lg:col-span-8">
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#09090b]">
                        <div className="mb-6 flex items-center justify-between">
                            <h3 className="flex items-center gap-2 text-lg font-black text-slate-900 dark:text-white">
                                <Clock className="text-sky-500" size={18} />{' '}
                                Today's Schedule
                            </h3>
                            <span className="rounded bg-slate-100 px-2 py-1 text-xs font-bold text-slate-400 dark:bg-white/5">
                                18 DEC 2025
                            </span>
                        </div>

                        <div className="space-y-4">
                            {todayClasses.map((cls, i) => (
                                <div
                                    key={i}
                                    className={`group relative rounded-2xl border p-5 transition-all ${cls.active ? 'border-sky-500 bg-sky-600 shadow-xl shadow-sky-500/20' : 'border-transparent bg-slate-50 hover:border-slate-200 dark:bg-white/5'}`}
                                >
                                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                        <div className="flex items-start gap-4">
                                            <div
                                                className={`min-w-[80px] rounded-xl p-3 text-center font-bold ${cls.active ? 'bg-white/20 text-white' : 'bg-white text-slate-900 dark:bg-slate-800 dark:text-white'}`}
                                            >
                                                <div className="text-xs opacity-70">
                                                    Room
                                                </div>
                                                <div>{cls.room}</div>
                                            </div>
                                            <div>
                                                <div
                                                    className={`text-xs font-black tracking-widest uppercase ${cls.active ? 'text-sky-200' : 'text-slate-400'}`}
                                                >
                                                    {cls.code}
                                                </div>
                                                <h4
                                                    className={`text-xl font-bold ${cls.active ? 'text-white' : 'text-slate-900 dark:text-white'}`}
                                                >
                                                    {cls.name}
                                                </h4>
                                                <div
                                                    className={`mt-1 flex items-center gap-2 text-sm font-medium ${cls.active ? 'text-sky-100' : 'text-slate-500'}`}
                                                >
                                                    <Clock size={14} />{' '}
                                                    {cls.time}
                                                </div>
                                            </div>
                                        </div>

                                        {cls.active ? (
                                            <button className="rounded-xl bg-white px-6 py-3 text-sm font-black text-sky-600 shadow-lg transition-colors hover:bg-sky-50">
                                                Resume Class
                                            </button>
                                        ) : (
                                            <div className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-400 dark:border-slate-700 dark:bg-slate-800">
                                                {cls.status}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* --- RECENT SUBMISSIONS TABLE --- */}
                    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#09090b]">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-black text-slate-900 dark:text-white">
                                Recent Submissions
                            </h3>
                            <a
                                href="#"
                                className="text-sm font-bold text-sky-600 hover:underline"
                            >
                                View All
                            </a>
                        </div>
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-xs text-slate-400 uppercase dark:bg-white/5">
                                <tr>
                                    <th className="rounded-l-lg px-4 py-3">
                                        Student
                                    </th>
                                    <th className="px-4 py-3">Assignment</th>
                                    <th className="px-4 py-3">Submitted</th>
                                    <th className="rounded-r-lg px-4 py-3">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                {[1, 2, 3].map((_, i) => (
                                    <tr
                                        key={i}
                                        className="transition-colors hover:bg-slate-50 dark:hover:bg-white/5"
                                    >
                                        <td className="px-4 py-4 font-bold text-slate-700 dark:text-slate-200">
                                            Sokha Vatanak
                                        </td>
                                        <td className="px-4 py-4 text-slate-500">
                                            Database Schema Design
                                        </td>
                                        <td className="px-4 py-4 font-mono text-xs text-slate-400">
                                            Today, 10:42 AM
                                        </td>
                                        <td className="px-4 py-4">
                                            <button className="rounded border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-bold text-sky-600 hover:bg-sky-100 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-400">
                                                Grade
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* --- RIGHT: INSIGHTS & RISKS (Span 4) --- */}
                <div className="flex flex-col gap-6 lg:col-span-4">
                    {/* AT RISK STUDENTS CARD */}
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#09090b]">
                        <div className="mb-6 flex items-center gap-2 text-amber-600">
                            <AlertTriangle size={20} />
                            <h3 className="text-lg font-black text-slate-900 dark:text-white">
                                Intervention Needed
                            </h3>
                        </div>
                        <div className="space-y-3">
                            {needsAttention.map((student, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-white/5"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-500">
                                            {student.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-slate-900 dark:text-white">
                                                {student.name}
                                            </div>
                                            <div className="text-[10px] font-bold text-red-500 uppercase">
                                                {student.issue}
                                            </div>
                                        </div>
                                    </div>
                                    <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-all hover:bg-white hover:text-sky-600 hover:shadow">
                                        <MoreVertical size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button className="mt-4 w-full rounded-xl border border-slate-200 py-3 text-sm font-bold text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-white/5">
                            View All Risks
                        </button>
                    </div>

                    {/* QUICK ACTIONS */}
                    <div className="relative overflow-hidden rounded-3xl bg-sky-900 p-6 text-white">
                        <div className="absolute top-0 right-0 -mt-8 -mr-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
                        <h3 className="relative z-10 text-lg font-bold">
                            Faculty Tools
                        </h3>
                        <div className="relative z-10 mt-4 space-y-2">
                            {[
                                'Generate Attendance Report',
                                'Email All Students',
                                'Curriculum Settings',
                            ].map((action, i) => (
                                <button
                                    key={i}
                                    className="flex w-full items-center justify-between rounded-xl bg-white/10 p-3 text-xs font-bold text-sky-100 transition-colors hover:bg-white/20"
                                >
                                    {action}
                                    <ArrowRight size={14} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </AppLayout>
    );
};
