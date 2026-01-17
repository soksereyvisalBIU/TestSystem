import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { 
    ArrowRight, 
    Filter, 
    Search, 
    UserCheck, 
    Users, 
    Trophy, 
    Clock, 
    FileText,
    ArrowUpDown
} from 'lucide-react';
import { useMemo, useState } from 'react';

import AppLayout from '@/layouts/app-layout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { 
    Badge 
} from '@/components/ui/badge'; // Assuming you have a standard Badge component

interface Props {
    assessment: any;
}

export default function StudentAssessmentAttemptShow({ assessment }: Props) {
    const students = assessment.students || [];
    const totalMarks = 100; // This should ideally come from props: assessment.total_marks
    const [search, setSearch] = useState('');

    // --- Analytics Logic ---
    const stats = useMemo(() => {
        const attempted = students.filter((s: any) => Number(s.pivot?.attempted_amount) > 0);
        const scores = attempted.map((s: any) => Number(s.pivot?.score));
        const avgScore = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : 0;
        
        return {
            total: students.length,
            completed: attempted.length,
            avgScore: avgScore,
            completionRate: students.length ? Math.round((attempted.length / students.length) * 100) : 0
        };
    }, [students]);

    const filteredStudents = useMemo(() => {
        return students.filter(
            (s: any) =>
                s.name?.toLowerCase().includes(search.toLowerCase()) ||
                s.email?.toLowerCase().includes(search.toLowerCase()),
        );
    }, [students, search]);

    return (
        <AppLayout>
            <Head title={`${assessment.title} | Performance`} />

            <div className="container mx-auto max-w-7xl space-y-6 p-6">
                {/* Header Section */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
                            <FileText className="h-6 w-6 text-primary" />
                            {assessment.title}
                        </h1>
                        <p className="text-muted-foreground font-medium">
                            Review student submissions and overall performance metrics.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">Export CSV</Button>
                        <Button size="sm">Message All Students</Button>
                    </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard icon={Users} label="Total Students" value={stats.total} color="text-blue-500" />
                    <StatCard icon={UserCheck} label="Submissions" value={stats.completed} subValue={`${stats.completionRate}% rate`} color="text-green-500" />
                    <StatCard icon={Trophy} label="Average Score" value={`${stats.avgScore}%`} color="text-yellow-500" />
                    <StatCard icon={Clock} label="Time Limit" value={`${assessment.duration}m`} color="text-purple-500" />
                </div>

                {/* Main Content Card */}
                <Card className="overflow-hidden rounded-3xl border-none bg-card shadow-sm ring-1 ring-border/60">
                    <CardHeader className="border-b border-border/50 bg-muted/10 px-6 py-4">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name or email..."
                                    className="h-10 rounded-xl pl-10 focus-visible:ring-primary/20"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <Button variant="ghost" className="rounded-xl font-semibold">
                                <Filter className="mr-2 h-4 w-4" />
                                Filter Status
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-muted/30">
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="w-[300px] pl-6 text-[11px] font-bold uppercase tracking-wider">Student Details</TableHead>
                                    <TableHead className="text-[11px] font-bold uppercase tracking-wider">Status</TableHead>
                                    <TableHead className="text-[11px] font-bold uppercase tracking-wider">
                                        <div className="flex items-center gap-1 cursor-pointer hover:text-primary">
                                            Score <ArrowUpDown className="h-3 w-3" />
                                        </div>
                                    </TableHead>
                                    <TableHead className="text-[11px] font-bold uppercase tracking-wider">Last Activity</TableHead>
                                    <TableHead className="pr-6 text-right text-[11px] font-bold uppercase tracking-wider">Actions</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {filteredStudents.length > 0 ? (
                                    filteredStudents.map((s: any) => {
                                        const score = Number(s.pivot?.score ?? 0);
                                        const percentage = totalMarks > 0 ? (score / totalMarks) * 100 : 0;
                                        const hasAttempt = Number(s.pivot?.attempted_amount ?? 0) > 0;

                                        return (
                                            <TableRow key={s.id} className="group transition-colors hover:bg-muted/20">
                                                <TableCell className="pl-6">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-10 w-10 ring-2 ring-background transition-all group-hover:ring-primary/10">
                                                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${s.name}`} />
                                                            <AvatarFallback className="font-bold">{s.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-foreground">{s.name}</span>
                                                            <span className="text-xs text-muted-foreground">{s.email}</span>
                                                        </div>
                                                    </div>
                                                </TableCell>

                                                <TableCell>
                                                    {hasAttempt ? (
                                                        <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-none px-2.5 py-0.5 rounded-full">
                                                            Submitted
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="text-muted-foreground border-dashed px-2.5 py-0.5 rounded-full">
                                                            Not Started
                                                        </Badge>
                                                    )}
                                                </TableCell>

                                                <TableCell>
                                                    <div className="w-32 space-y-1.5">
                                                        <div className="flex justify-between text-[11px] font-bold">
                                                            <span className={percentage >= 50 ? "text-primary" : "text-destructive"}>
                                                                {score} / {totalMarks}
                                                            </span>
                                                            <span className="text-muted-foreground">{Math.round(percentage)}%</span>
                                                        </div>
                                                        <Progress 
                                                            value={percentage} 
                                                            className="h-1.5" 
                                                        />
                                                    </div>
                                                </TableCell>

                                                <TableCell className="text-sm font-medium text-muted-foreground">
                                                    {s.pivot?.updated_at ? (
                                                        <div className="flex flex-col">
                                                            <span>{format(new Date(s.pivot.updated_at), 'MMM d, yyyy')}</span>
                                                            <span className="text-[10px] opacity-70">{format(new Date(s.pivot.updated_at), 'h:mm a')}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="italic opacity-30 text-xs">No activity</span>
                                                    )}
                                                </TableCell>

                                                <TableCell className="pr-6 text-right">
                                                    <Button 
                                                        variant={hasAttempt ? "default" : "secondary"} 
                                                        size="sm" 
                                                        className="h-8 rounded-lg text-xs"
                                                        asChild
                                                    >
                                                        <Link href="#">
                                                            {hasAttempt ? 'Results' : 'Details'}
                                                            <ArrowRight className="ml-2 h-3.5 w-3.5" />
                                                        </Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-72 text-center">
                                            <div className="flex flex-col items-center justify-center space-y-2">
                                                <div className="rounded-full bg-muted p-4">
                                                    <Search className="h-8 w-8 text-muted-foreground" />
                                                </div>
                                                <p className="text-lg font-bold">No results found</p>
                                                <p className="text-sm text-muted-foreground">Try adjusting your search or filters to find what you're looking for.</p>
                                                <Button variant="outline" onClick={() => setSearch('')} className="mt-2">Clear Search</Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

/** * Reusable Stat Card Component for consistent UI 
 */
function StatCard({ icon: Icon, label, value, subValue, color }: any) {
    return (
        <Card className="border-none shadow-sm ring-1 ring-border/60">
            <CardContent className="flex items-center gap-4 p-5">
                <div className={`rounded-2xl bg-muted/50 p-3 ${color}`}>
                    <Icon className="h-6 w-6" />
                </div>
                <div>
                    <p className="text-sm font-medium text-muted-foreground">{label}</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-2xl font-black">{value}</h3>
                        {subValue && <span className="text-[10px] font-bold text-green-500 uppercase tracking-tighter">{subValue}</span>}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}