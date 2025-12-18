import AppLayout from '@/layouts/app-layout';
import { Activity, Database, Server, Shield, Users } from 'lucide-react';

const AdminDashboard = () => {
    return (
        <div className="flex flex-col gap-6 p-6">
            {/* --- ADMIN HEADER --- */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-6 dark:border-slate-800">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-900 text-white shadow-xl">
                        <Shield size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-[900] tracking-tight uppercase">
                            System Administration
                        </h1>
                        <div className="mt-1 flex w-fit items-center gap-2 rounded bg-emerald-50 px-2 py-0.5 font-mono text-xs font-bold text-emerald-600">
                            <Activity size={12} /> ALL SYSTEMS OPERATIONAL
                        </div>
                    </div>
                </div>
                <div className="hidden text-right sm:block">
                    <div className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                        Server Uptime
                    </div>
                    <div className="font-mono text-xl font-black">
                        14d 22h 10m
                    </div>
                </div>
            </div>

            {/* --- INFRASTRUCTURE GRID --- */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                {[
                    {
                        label: 'Active Users',
                        val: '2,409',
                        icon: Users,
                        color: 'text-indigo-500',
                    },
                    {
                        label: 'Server Load',
                        val: '12%',
                        icon: Server,
                        color: 'text-emerald-500',
                    },
                    {
                        label: 'Database Size',
                        val: '4.2 GB',
                        icon: Database,
                        color: 'text-slate-500',
                    },
                    {
                        label: 'Security Flags',
                        val: '0',
                        icon: Shield,
                        color: 'text-indigo-500',
                    },
                ].map((item, i) => (
                    <div
                        key={i}
                        className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#09090b]"
                    >
                        <div>
                            <div className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                                {item.label}
                            </div>
                            <div className="mt-1 font-mono text-2xl font-[900]">
                                {item.val}
                            </div>
                        </div>
                        <item.icon className={item.color} size={20} />
                    </div>
                ))}
            </div>

            {/* --- MAIN ADMIN CONTENT --- */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* SYSTEM LOGS CONSOLE */}
                <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-6 font-mono text-xs text-slate-200">
                    <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-4">
                        <span className="flex items-center gap-2 font-bold text-white">
                            <Server size={14} /> LIVE_LOGS_STREAM
                        </span>
                        <span className="animate-pulse text-emerald-500">
                            ● Live
                        </span>
                    </div>
                    <div className="space-y-3 opacity-80">
                        <div className="flex gap-4">
                            <span className="text-slate-500">10:42:01</span>{' '}
                            <span className="text-emerald-400">INFO</span> User
                            [B202401] logged in successfully.
                        </div>
                        <div className="flex gap-4">
                            <span className="text-slate-500">10:41:55</span>{' '}
                            <span className="text-indigo-400">POST</span>{' '}
                            /api/submit-assignment [200 OK]
                        </div>
                        <div className="flex gap-4">
                            <span className="text-slate-500">10:40:12</span>{' '}
                            <span className="text-amber-400">WARN</span> High
                            memory usage detected on Node-04.
                        </div>
                        <div className="flex gap-4">
                            <span className="text-slate-500">10:38:00</span>{' '}
                            <span className="text-emerald-400">INFO</span> Daily
                            backup completed (4.2s).
                        </div>
                    </div>
                </div>

                {/* USER REGISTRATION STATS */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#09090b]">
                    <h3 className="mb-4 text-lg font-black">
                        Faculty Enrollment
                    </h3>
                    <div className="space-y-4">
                        {[
                            {
                                faculty: 'Computer Science',
                                count: 840,
                                width: '80%',
                            },
                            {
                                faculty: 'Network Engineering',
                                count: 420,
                                width: '40%',
                            },
                            {
                                faculty: 'Software Engineering',
                                count: 650,
                                width: '60%',
                            },
                            {
                                faculty: 'Data Science',
                                count: 200,
                                width: '20%',
                            },
                        ].map((fac, i) => (
                            <div key={i}>
                                <div className="mb-1 flex justify-between text-xs font-bold">
                                    <span>{fac.faculty}</span>
                                    <span>{fac.count} Students</span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                    <div
                                        className="h-full rounded-full bg-indigo-600"
                                        style={{ width: fac.width }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- MAIN EXPORT WRAPPER ---
export default function Dashboard() {
    // In a real app, usePage() to get user role
    // const { auth } = usePage().props;
    // const role = auth.user.role;

    // FOR DEMO: Change this to 'admin' to see the other view
    const role = 'lecturer';

    return (
        <AppLayout>
            {/* <Head title="Dashboard" /> */}
            {/* <div className="p-6 max-w-7xl mx-auto w-full">
                {role === 'lecturer' ? <LectureDashboard /> : <AdminDashboard />}
            </div> */}
            <AdminDashboard />
        </AppLayout>
    );
}
