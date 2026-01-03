import { Button } from '@/components/ui/button';
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
import {
    BarChart3,
    FileText,
    Info,
    Sparkles,
    Target,
    TrendingUp,
    Users,
} from 'lucide-react';
import { useMemo } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

export default function AnalyticsTab({ students }: { students: any[] }) {
    const stats = useMemo(() => {
        const data = students
            .map((s) => ({
                name: s.name.split(' ')[0],
                fullName: s.name,
                score: Number(s.pivot?.score ?? 0),
                status: s.pivot?.status,
            }))
            .sort((a, b) => b.score - a.score);

        const totalScore = data.reduce((sum, s) => sum + s.score, 0);
        const avg = totalScore / (data.length || 1);
        const highest = data.length > 0 ? data[0].score : 0;

        // Calculate pass rate (assuming 50% is pass)
        const passedCount = data.filter((s) => s.score >= 50).length;
        const passRate =
            data.length > 0 ? (passedCount / data.length) * 100 : 0;

        return { data, avg, highest, passRate };
    }, [students]);

    return (
        <div className="space-y-6">
            {/* 1. Quick Insights Row */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <InsightMiniCard
                    title="Class Average"
                    value={`${stats.avg.toFixed(1)}%`}
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
                    title="Pass Rate"
                    value={`${Math.round(stats.passRate)}%`}
                    icon={BarChart3}
                    color="text-orange-600"
                    bg="bg-orange-50"
                />
                <InsightMiniCard
                    title="Participation"
                    value={students.length.toString()}
                    icon={Users}
                    color="text-purple-600"
                    bg="bg-purple-50"
                />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* 2. Main Chart */}
                <Card className="overflow-hidden rounded-[2rem] border-none py-0 shadow-sm ring-1 ring-border/60 lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 bg-muted/20 px-8 py-6">
                        <div>
                            <CardTitle className="text-xl font-black tracking-tight text-title uppercase">
                                Score Distribution
                            </CardTitle>
                            <CardDescription className="font-medium">
                                Student performance ranked from highest to
                                lowest
                            </CardDescription>
                        </div>
                        <div className="hidden items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-[10px] font-black tracking-widest text-description uppercase md:flex">
                            <Info className="h-3.5 w-3.5 text-primary" />
                            Live Analytics
                        </div>
                    </CardHeader>

                    <CardContent className="h-[400px] pl-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={stats.data}
                                margin={{
                                    top: 10,
                                    right: 10,
                                    left: 0,
                                    bottom: 20,
                                }}
                            >
                                <defs>
                                    <linearGradient
                                        id="barGradient"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="#3b82f6"
                                            stopOpacity={0.8}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="#3b82f6"
                                            stopOpacity={0.3}
                                        />
                                    </linearGradient>
                                    <linearGradient
                                        id="lowGradient"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="#94a3b8"
                                            stopOpacity={0.8}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="#94a3b8"
                                            stopOpacity={0.3}
                                        />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke="#f1f5f9"
                                />
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
                                    label={{
                                        position: 'right',
                                        value: 'Avg',
                                        fill: '#3b82f6',
                                        fontSize: 12,
                                        fontWeight: 'bold',
                                    }}
                                />
                                <Bar
                                    dataKey="score"
                                    radius={[4, 4, 0, 0]}
                                    barSize={32}
                                >
                                    {stats.data.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={
                                                entry.score >= stats.avg
                                                    ? 'url(#barGradient)'
                                                    : 'url(#lowGradient)'
                                            }
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* 3. Reports & AI Sidebar */}
                <div className="flex flex-col gap-6">
                    <Card className="overflow-hidden rounded-[2rem] border-none shadow-sm ring-1 ring-border/60">
                        <CardHeader className="border-b border-border/50 bg-muted/20">
                            <CardTitle className="text-lg font-black tracking-tight uppercase">
                                Reports
                            </CardTitle>
                            <CardDescription className="font-medium">
                                Analysis and data exports
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 p-6">
                            <ReportLink
                                icon={FileText}
                                title="Full Gradebook"
                                desc="CSV / Excel format"
                            />
                            <ReportLink
                                icon={Users}
                                title="Late Submissions"
                                desc="Follow-up list"
                            />
                            <ReportLink
                                icon={BarChart3}
                                title="Item Analysis"
                                desc="Per-question accuracy"
                            />
                        </CardContent>
                    </Card>

                    <Card className="group relative overflow-hidden rounded-[2rem] border-none bg-primary text-primary-foreground shadow-xl shadow-primary/20">
                        <div className="absolute top-0 right-0 p-8 opacity-10 transition-transform group-hover:scale-110">
                            <Sparkles className="h-24 w-24" />
                        </div>
                        <CardContent className="relative z-10 flex flex-col gap-6 p-8">
                            <div className="flex flex-col gap-2">
                                <div className="w-fit rounded-xl bg-white/20 p-2 backdrop-blur-md">
                                    <Sparkles className="h-5 w-5 text-white" />
                                </div>
                                <h3 className="text-xl leading-tight font-black">
                                    AI Academic Assistant
                                </h3>
                                <p className="text-sm font-medium text-primary-foreground/80">
                                    Get an instant summary of class performance,
                                    identifying learning gaps and top
                                    performers.
                                </p>
                            </div>
                            <Button className="h-12 w-full rounded-xl bg-white font-black text-primary shadow-lg transition-all hover:bg-white/90 active:scale-95">
                                Generate Insights
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function InsightMiniCard({ title, value, icon: Icon, color, bg }: any) {
    return (
        <Card className="overflow-hidden rounded-2xl border-none shadow-sm ring-1 ring-border/60">
            <CardContent className="flex items-center gap-4 p-5">
                <div className={`rounded-2xl p-3 ${bg} ${color} shadow-inner`}>
                    <Icon className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                    <p className="text-[10px] font-black tracking-[0.1em] text-description uppercase">
                        {title}
                    </p>
                    <p className="mt-1 text-2xl leading-none font-black tracking-tighter text-title">
                        {value}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
