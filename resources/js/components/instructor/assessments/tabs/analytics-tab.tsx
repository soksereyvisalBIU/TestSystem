import React, { useMemo } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    ReferenceLine,
} from 'recharts';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    CustomTooltip,
    ReportLink,
} from '@/pages/instructor/classroom/subject/assessment/function/assessment-show';
import { BarChart3, FileText, Users, TrendingUp, Target, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AnalyticsTab({ students }: { students: any[] }) {
    const stats = useMemo(() => {
        const data = students
            .map(s => ({
                name: s.name.split(' ')[0],
                fullName: s.name,
                score: Number(s.pivot?.score ?? 0),
                status: s.pivot?.status,
            }))
            .sort((a, b) => b.score - a.score);

        const avg = data.reduce((sum, s) => sum + s.score, 0) / (data.length || 1);
        const highest = data.length > 0 ? data[0].score : 0;

        return { data, avg, highest };
    }, [students]);

    return (
        <div className="space-y-6">
            {/* 1. Quick Insights Row */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <InsightMiniCard 
                    title="Class Average" 
                    value={stats.avg.toFixed(1)} 
                    icon={TrendingUp} 
                    color="text-blue-600" 
                    bg="bg-blue-50" 
                />
                <InsightMiniCard 
                    title="Highest Score" 
                    value={stats.highest.toString()} 
                    icon={Target} 
                    color="text-emerald-600" 
                    bg="bg-emerald-50" 
                />
                <InsightMiniCard 
                    title="Participation" 
                    value={`${students.length} Students`} 
                    icon={Users} 
                    color="text-purple-600" 
                    bg="bg-purple-50" 
                />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* 2. Main Chart */}
                <Card className="border-none shadow-sm ring-1 ring-slate-200/60 lg:col-span-2">
                    <CardHeader className="flex flex-row items-start justify-between">
                        <div>
                            <CardTitle className="text-xl font-bold">Score Distribution</CardTitle>
                            <CardDescription>Individual student performance comparison</CardDescription>
                        </div>
                        <div className="hidden items-center gap-2 rounded-lg bg-slate-50 px-3 py-1 text-[10px] font-bold uppercase text-slate-500 md:flex">
                            <Info className="h-3.5 w-3.5" />
                            Sorted by Rank
                        </div>
                    </CardHeader>

                    <CardContent className="h-[400px] pl-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                                <defs>
                                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                    </linearGradient>
                                    <linearGradient id="lowGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.3}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#64748b', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#64748b', fontSize: 12 }}
                                />
                                <Tooltip 
                                    content={<CustomTooltip />} 
                                    cursor={{ fill: '#f8fafc' }}
                                />
                                <ReferenceLine 
                                    y={stats.avg} 
                                    stroke="#3b82f6" 
                                    strokeDasharray="5 5" 
                                    label={{ position: 'right', value: 'Avg', fill: '#3b82f6', fontSize: 12, fontWeight: 'bold' }} 
                                />
                                <Bar dataKey="score" radius={[4, 4, 0, 0]} barSize={32}>
                                    {stats.data.map((entry, index) => (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={entry.score >= stats.avg ? "url(#barGradient)" : "url(#lowGradient)"} 
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* 3. Reports Sidebar */}
                <div className="space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-200/60">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold">Quick Reports</CardTitle>
                            <CardDescription>Export and analyze data</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <ReportLink icon={FileText} title="Full Gradebook" desc="Complete results in CSV format" />
                            <ReportLink icon={Users} title="Late Submissions" desc="Identify students who missed" />
                            <ReportLink icon={BarChart3} title="Item Analysis" desc="Performance per question" />
                        </CardContent>
                    </Card>

                    <Card className="bg-blue-600 text-white shadow-lg shadow-blue-500/20">
                        <CardContent className="p-6">
                            <div className="flex flex-col gap-4">
                                <div className="rounded-lg bg-blue-500/30 p-2 w-fit">
                                    <BarChart3 className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-bold">Need deeper insights?</p>
                                    <p className="text-xs text-blue-100 mt-1">Generate an AI-powered summary of class strengths and weaknesses.</p>
                                </div>
                                <Button className="bg-white text-blue-600 hover:bg-blue-50 w-full font-bold shadow-none">
                                    Generate AI Insight
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

// Sub-component for mini stats
function InsightMiniCard({ title, value, icon: Icon, color, bg }: any) {
    return (
        <Card className="border-none shadow-sm ring-1 ring-slate-200/60">
            <CardContent className="p-4 flex items-center gap-4">
                <div className={`p-2 rounded-xl ${bg} ${color}`}>
                    <Icon className="h-5 w-5" />
                </div>
                <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</p>
                    <p className="text-xl font-black text-slate-900 leading-none mt-1">{value}</p>
                </div>
            </CardContent>
        </Card>
    );
}