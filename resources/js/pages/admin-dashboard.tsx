import React, { useMemo, memo } from 'react';
import AdminActionButton from '@/components/admin/tools/AdminActionButton';
import AppLayout from '@/layouts/app-layout';
import { useQueries, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import {
    CheckCircle2,
    Cpu,
    Database,
    HardDrive,
    RefreshCw,
    Server,
    Shield,
    Terminal,
    Activity,
    Zap
} from 'lucide-react';

// --- PERFORMANCE OPTIMIZED SUB-COMPONENTS ---

const MetricCard = memo(({ title, value, sub, icon: Icon, color, trend }: any) => (
    <div className="group relative overflow-hidden rounded-[2rem] border border-white/40 bg-white/80 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:border-indigo-200">
        <div className="absolute -right-4 -top-4 opacity-[0.03] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12">
            <Icon size={120} />
        </div>
        <div className="relative z-10 flex flex-col gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${color} bg-opacity-10 shadow-inner`}>
                <Icon size={24} className={color.replace('bg-', 'text-')} />
            </div>
            <div>
                <p className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">
                    {title}
                </p>
                <div className="mt-1 flex items-baseline gap-2">
                    <h2 className="text-3xl font-black tracking-tight text-slate-900">
                        {value}
                    </h2>
                    {trend && <span className="text-[10px] font-bold text-emerald-500">{trend}</span>}
                </div>
                <p className="mt-1 text-xs font-medium text-slate-500/80 italic">{sub}</p>
            </div>
        </div>
    </div>
));

const AdminDashboard = () => {
    const queryClient = useQueryClient();

    const results = useQueries({
        queries: [
            {
                queryKey: ['admin', 'sys'],
                queryFn: () => axios.get('/admin/telemetry/system').then((res) => res.data),
                refetchInterval: 30000, // Auto-sync every 30s
            },
            {
                queryKey: ['admin', 'db'],
                queryFn: () => axios.get('/admin/telemetry/database').then((res) => res.data),
            },
            {
                queryKey: ['admin', 'storage'],
                queryFn: () => axios.get('/admin/telemetry/storage').then((res) => res.data),
            },
        ],
    });

    const [sys, db, storage] = results;
    const isLoading = results.some((r) => r.isFetching);

    const refreshAll = () => queryClient.invalidateQueries({ queryKey: ['admin'] });

    return (
        <AppLayout>
            <div className="min-h-screen container mx-auto bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-50 via-white to-indigo-50/30 p-6 lg:p-10">
                <div className="mx-auto max-w-[1600px] animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    
                    {/* 2026 CYBER-HUD HEADER */}
                    <header className="relative mb-10 overflow-hidden rounded-[3rem] bg-slate-950 p-1px shadow-2xl transition-all">
                        {/* Animated Gradient Border Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 opacity-20" />
                        
                        <div className="relative flex flex-col justify-between gap-6 bg-slate-950/90 p-8 backdrop-blur-3xl md:flex-row md:items-center">
                            <div className="flex items-center gap-6">
                                <div className="group relative">
                                    <div className="absolute -inset-1 animate-pulse rounded-2xl bg-indigo-500 opacity-20 blur-lg transition group-hover:opacity-50" />
                                    <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 shadow-2xl">
                                        <Shield size={38} className="text-white" />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h1 className="text-4xl font-black tracking-tighter text-white uppercase sm:text-5xl">
                                            Nexus<span className="text-indigo-500">OS</span>
                                        </h1>
                                        <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-[10px] font-black text-indigo-400 border border-indigo-500/20">v4.0.2</span>
                                    </div>
                                    <div className="mt-2 flex items-center gap-4">
                                        <div className="flex items-center gap-2 font-mono text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                                            <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                                            System Optimized
                                        </div>
                                        <div className="h-1 w-1 rounded-full bg-slate-700" />
                                        <div className="font-mono text-[10px] font-bold text-slate-500 uppercase">
                                            Node: primary-cluster-01
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={refreshAll}
                                disabled={isLoading}
                                className="group relative flex items-center gap-3 overflow-hidden rounded-2xl bg-white px-8 py-4 text-sm font-black uppercase tracking-tighter text-slate-950 transition-all hover:pr-10 active:scale-95 disabled:opacity-50"
                            >
                                <RefreshCw size={18} className={`${isLoading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                                <span>{isLoading ? 'Syncing...' : 'Sync Telemetry'}</span>
                            </button>
                        </div>
                    </header>

                    {/* MAIN HUD CONTENT */}
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                        
                        {/* LEFT WING: COMMAND & CONTROL */}
                        <div className="space-y-8 lg:col-span-8">
                            {/* METRICS ROW */}
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                                <MetricCard
                                    title="Core Load"
                                    value={sys.data?.hardware?.load[0] || '0.00'}
                                    sub={`PHP ${sys.data?.engine?.php} Runtime`}
                                    icon={Cpu}
                                    color="bg-blue-500"
                                    trend="+2.1%"
                                />
                                <MetricCard
                                    title="Data Density"
                                    value={`${db.data?.size_mb || 0} MB`}
                                    sub={`${db.data?.open_connections} Active Sockets`}
                                    icon={Database}
                                    color="bg-indigo-500"
                                />
                                <MetricCard
                                    title="Memory Map"
                                    value={sys.data?.hardware?.memory_usage || '0 B'}
                                    sub={sys.data?.engine?.opcache ? 'L2 Cache Optimized' : 'Cache Bypassed'}
                                    icon={Zap}
                                    color="bg-amber-500"
                                />
                            </div>

                            {/* ARTISAN TERMINAL UI */}
                            <section className="group rounded-[3rem] border border-slate-200 bg-white p-10 shadow-xl transition-all hover:border-indigo-100">
                                <div className="mb-10 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                                            <Terminal size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black tracking-tight text-slate-900">Artisan Control</h3>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Kernel Operations</p>
                                        </div>
                                    </div>
                                    <div className="hidden h-px flex-1 bg-slate-100 mx-8 lg:block" />
                                </div>
                                
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    <AdminActionButton label="Optimize" endpoint="/admin/artisan/optimize" />
                                    <AdminActionButton label="Rebuild Routes" endpoint="/admin/artisan/route-cache" />
                                    <AdminActionButton label="Refresh Config" endpoint="/admin/artisan/config-cache" />
                                    <AdminActionButton label="Purge Cache" endpoint="/admin/artisan/cache-clear" danger />
                                    <AdminActionButton label="Run Migrations" endpoint="/admin/artisan/migrate" danger />
                                    <AdminActionButton label="Flush Logs" endpoint="/admin/logs/clear" danger />
                                </div>
                            </section>
                        </div>

                        {/* RIGHT WING: HARDWARE & QUEUE */}
                        <div className="space-y-8 lg:col-span-4">
                            {/* STORAGE NODES GLASS CARD */}
                            <div className="rounded-[3rem] border border-white bg-slate-50/50 p-8 shadow-sm backdrop-blur-md">
                                <div className="mb-8 flex items-center gap-3">
                                    <HardDrive size={22} className="text-slate-400" />
                                    <h3 className="text-xl font-black tracking-tight">Storage Nodes</h3>
                                </div>
                                <div className="space-y-4">
                                    {storage.data && Object.entries(storage.data).map(([key, info]: any) => (
                                        <div key={key} className="group flex items-center justify-between rounded-3xl border border-slate-200 bg-white p-5 transition-all hover:scale-[1.02] hover:shadow-md">
                                            <div className="flex items-center gap-4">
                                                <div className={`h-2 w-2 rounded-full ${info.writable ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500'}`} />
                                                <div>
                                                    <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">{info.path}</p>
                                                    <p className="font-mono text-lg font-bold text-slate-800">{info.size}</p>
                                                </div>
                                            </div>
                                            {info.writable ? (
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                                                    <CheckCircle2 size={20} />
                                                </div>
                                            ) : (
                                                <Activity size={20} className="animate-pulse text-red-500" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* QUEUE MONITOR */}
                            <div className="rounded-[3rem] bg-indigo-600 p-8 text-white shadow-2xl shadow-indigo-200">
                                <h3 className="mb-6 text-xl font-black">Queue Telemetry</h3>
                                <div className="flex flex-col gap-3">
                                    <AdminActionButton 
                                        label="Restart Cluster" 
                                        endpoint="/admin/artisan/queue-restart"
                                        className="!bg-white/10 !border-white/20 !text-white hover:!bg-white/20" 
                                    />
                                    <AdminActionButton 
                                        label="Flush Failures" 
                                        endpoint="/admin/artisan/queue-flush" 
                                        danger 
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default AdminDashboard;