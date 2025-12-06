import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    BarChart3,
    ClipboardList,
    Users,
    FileBarChart,
    GridIcon,
    ListIcon,
    Calendar,
    FlaskConical,
    CreditCard,
    Building2,
    Clock,
    User,
    Pencil,
    PlusCircle,
    Eye,
} from 'lucide-react';
import StudentPerformanceChart from '@/components/instructor/chart/StudentPerformanceChart';
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useState } from 'react';
import { route } from 'ziggy-js';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils'; // Assuming you have a utility for merging Tailwind classes

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Class', href: '/' },
    { title: 'Subjects', href: '/subjects' },
];

// Helper components for the enhanced UI

// A Stat component for the Quick Stats card
const StatCard = ({ title, value, icon: Icon }: any) => (
    <div className="flex items-center justify-between rounded-xl border p-4 shadow-sm">
        <div className="flex flex-col">
            <span className="text-2xl font-bold text-primary">{value}</span>
            <span className="text-sm text-muted-foreground">{title}</span>
        </div>
        <Icon className="h-8 w-8 text-muted-foreground opacity-50" />
    </div>
);

// A helper for status dots/borders
const StatusDot = ({ status }: { status: string }) => {
    const colorClass: Record<string, string> = {
        upcoming: 'bg-blue-500',
        ongoing: 'bg-green-500',
        closed: 'bg-red-500',
        unknown: 'bg-gray-500',
    };
    return (
        <span
            className={cn(
                'absolute -left-1.5 h-3 w-3 rounded-full',
                colorClass[status]
            )}
        />
    );
};

export default function SubjectDetail({ subject }: { subject: any }) {
    const id = subject?.id;

    const [statusFilter, setStatusFilter] = useState<'all' | string>('all');
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');

    // MOCK DATA (kept the same)
    const assessments = subject?.assessments || [
        {
            id: 1,
            title: 'Midterm Exam',
            description: 'Covers Chapters 1-5.',
            type: 'Exam',
            start_time: '2025-12-01T08:00:00Z',
            end_time: '2025-12-01T10:00:00Z',
        },
        {
            id: 2,
            title: 'Quiz 3 - Functions',
            description: 'Focus on advanced function concepts.',
            type: 'Quiz',
            start_time: '2025-12-07T14:00:00Z', // Upcoming
            end_time: '2025-12-07T15:00:00Z',
        },
        {
            id: 3,
            title: 'Project Proposal',
            description: 'Initial project idea submission.',
            type: 'Project',
            start_time: '2025-12-05T09:00:00Z', // Ongoing (Mock)
            end_time: '2025-12-10T17:00:00Z',
        },
    ];
    const students = ['Sok Dara', 'Chan Lisa', 'Kim Vuthy', 'Srey Neang'];
    const TestData = [
        { name: 'Sok Dara', score: 85, status: 'Good' },
        { name: 'Chan Lisa', score: 92, status: 'Excellent' },
        { name: 'Kim Vuthy', score: 76, status: 'Fair' },
    ];
    const reports = [
        { title: 'Overall Performance Report', icon: BarChart3 },
        { title: 'Student Attendance Report', icon: Calendar },
        { title: 'Performance by Topic', icon: FlaskConical },
    ];

    const getAssessmentStatus = (start: string | null, end: string | null) => {
        const now = new Date();
        const startTime = start ? new Date(start) : null;
        const endTime = end ? new Date(end) : null;

        if (startTime && now < startTime) return 'upcoming';
        if (startTime && endTime && now >= startTime && now <= endTime)
            return 'ongoing';
        if (endTime && now > endTime) return 'closed';

        return 'unknown';
    };

    const getTimeLabel = (start: string, end: string) => {
        const now = new Date().getTime();
        const s = new Date(start).getTime();
        const e = new Date(end).getTime();

        if (now > e) {
            const diff = now - e;
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            return `Closed ${days === 0 ? 'today' : `${days} day(s) ago`}`;
        }

        if (now >= s && now <= e) {
            const diff = e - now;
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

            if (days > 0) return `Ends in ${days} day(s)`;
            return `Ends in ${hours} hour(s)`;
        }

        const diff = s - now;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

        if (days > 0) return `Starts in ${days} day(s)`;
        return `Starts in ${hours} hour(s)`;
    };

    const statusColors: Record<string, string> = {
        upcoming: 'bg-blue-500 hover:bg-blue-600 border-blue-200',
        ongoing: 'bg-green-500 hover:bg-green-600 border-green-200',
        closed: 'bg-red-500 hover:bg-red-600 border-red-200',
        unknown: 'bg-gray-500 hover:bg-gray-600 border-gray-200',
    };

    const filteredAssessments = assessments.filter((a) => {
        const status = getAssessmentStatus(a.start_time, a.end_time);
        if (statusFilter === 'all') return true;
        // The original code was filtering by a.status, which isn't computed in the object,
        // so we use the computed status here. Assuming 'active' means 'ongoing'.
        if (statusFilter === 'active') return status === 'ongoing';
        return status === statusFilter;
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Subject Detail" />

            <div className="flex flex-col gap-6 p-4">
                {/* HEADER — MORPH ANIMATION */}
                <motion.div
                    layoutId={`subject-card-${id}`}
                    className="relative overflow-hidden rounded-3xl shadow-xl"
                >
                    <motion.div
                        layoutId={`subject-bg-${id}`}
                        className="h-64 w-full bg-cover bg-center"
                        style={{
                            backgroundImage: `url(${
                                subject?.cover
                                    ? '/storage/' + subject.cover
                                    : '/assets/img/class/class.jpg'
                            })`,
                        }}
                    />

                    {/* Enhanced Gradient for better text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-8 text-white">
                        <motion.div layoutId={`subject-meta-${id}`}>
                            <h3 className="text-lg opacity-90">
                                {subject?.year} — Semester {subject?.semester}
                            </h3>
                        </motion.div>

                        <motion.div
                            layoutId={`subject-title-${id}`}
                            className="mt-4 max-w-2xl"
                        >
                            <h1 className="text-5xl font-extrabold tracking-tight">
                                {subject?.name}
                            </h1>
                            <p className="mt-3 max-w-md text-base opacity-80">
                                {subject?.description}
                            </p>
                        </motion.div>

                        {/* Primary Action Button */}
                        <div className="absolute bottom-8 right-8">
                            <Button className="bg-white text-black hover:bg-gray-200 flex items-center gap-2 rounded-full px-6 py-3 shadow-lg">
                                <PlusCircle className="h-5 w-5" />
                                New Assessment
                            </Button>
                        </div>
                    </div>
                </motion.div>

                {/* INFO + STATS + ACTIONS (Redesigned) */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {/* Subject Info Card with Icons */}
                    <Card className="rounded-2xl">
                        <CardHeader>
                            <CardTitle className="text-xl">
                                Subject Info
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex items-center gap-3">
                                <User className="h-4 w-4 text-primary" />
                                <p>
                                    <span className="font-semibold">
                                        Instructor:
                                    </span>{' '}
                                    Dr. Sok Visal
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <CreditCard className="h-4 w-4 text-primary" />
                                <p>
                                    <span className="font-semibold">
                                        Credits:
                                    </span>{' '}
                                    3
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Clock className="h-4 w-4 text-primary" />
                                <p>
                                    <span className="font-semibold">
                                        Schedule:
                                    </span>{' '}
                                    Mon & Wed — 8:00 AM
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Building2 className="h-4 w-4 text-primary" />
                                <p>
                                    <span className="font-semibold">
                                        Classroom:
                                    </span>{' '}
                                    B102
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Stats (Redesigned with StatCard helper) */}
                    <Card className="rounded-2xl md:col-span-1">
                        <CardHeader>
                            <CardTitle className="text-xl">
                                Quick Stats
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4">
                            <StatCard
                                title="Students"
                                value={students.length}
                                icon={Users}
                            />
                            <StatCard
                                title="Assessments"
                                value={assessments.length}
                                icon={ClipboardList}
                            />
                            <div className="col-span-2">
                                <StatCard
                                    title="Avg. Score"
                                    value="83%"
                                    icon={BarChart3}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions Card (Redesigned with explicit buttons) */}
                    <Card className="rounded-2xl md:col-span-1">
                        <CardHeader>
                            <CardTitle className="text-xl">
                                Action Center
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Link
                                href={route(
                                    'instructor.classes.subjects.assessments.create',
                                    [subject.class_id, subject.id]
                                )}
                            >
                                <Button className="w-full flex justify-start items-center gap-3 bg-blue-600 hover:bg-blue-700">
                                    <Pencil className="h-5 w-5" />
                                    Create New Assessment
                                </Button>
                            </Link>

                            <Link
                                // href={route('instructor.students.index', [
                                //     subject.class_id,
                                // ])}
                            >
                                <Button
                                    variant="outline"
                                    className="w-full flex justify-start items-center gap-3"
                                >
                                    <Users className="h-5 w-5" />
                                    Manage Students
                                </Button>
                            </Link>

                            <Link href="#">
                                <Button
                                    variant="outline"
                                    className="w-full flex justify-start items-center gap-3"
                                >
                                    <FileBarChart className="h-5 w-5" />
                                    Generate Report
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>

                {/* MAIN CONTENT */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* ASSESSMENTS */}
                    <Card className="rounded-2xl lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between gap-2 text-xl">
                                <div className="flex items-center gap-2">
                                    <ClipboardList className="h-5 w-5 text-primary" />
                                    Assessments
                                </div>

                                <div className="flex items-center gap-3">
                                    {/* Filter */}
                                    <Select
                                        value={statusFilter}
                                        onValueChange={(v) =>
                                            setStatusFilter(v)
                                        }
                                    >
                                        <SelectTrigger className="w-[140px] rounded-lg">
                                            <SelectValue placeholder="Filter status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                All
                                            </SelectItem>
                                            <SelectItem value="ongoing">
                                                Ongoing (Active)
                                            </SelectItem>
                                            <SelectItem value="upcoming">
                                                Upcoming
                                            </SelectItem>
                                            <SelectItem value="closed">
                                                Closed
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>

                                    {/* List / Grid Toggle */}
                                    <ToggleGroup
                                        type="single"
                                        value={viewMode}
                                        onValueChange={(v) =>
                                            v && setViewMode(v as 'list' | 'grid')
                                        }
                                        className="rounded-lg border"
                                    >
                                        <ToggleGroupItem
                                            value="list"
                                            aria-label="Toggle list view"
                                        >
                                            <ListIcon className="h-4 w-4" />
                                        </ToggleGroupItem>
                                        <ToggleGroupItem
                                            value="grid"
                                            aria-label="Toggle grid view"
                                        >
                                            <GridIcon className="h-4 w-4" />
                                        </ToggleGroupItem>
                                    </ToggleGroup>
                                </div>
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            {/* ASSESSMENT LIST / GRID */}
                            {filteredAssessments.length === 0 ? (
                                <div className="flex h-40 flex-col items-center justify-center space-y-2 rounded-xl border border-dashed text-muted-foreground">
                                    <ClipboardList className="h-8 w-8 opacity-50" />
                                    <p>
                                        No{' '}
                                        {statusFilter !== 'all' &&
                                            `'${statusFilter}'`}{' '}
                                        assessments found.
                                    </p>
                                </div>
                            ) : viewMode === 'list' ? (
                                // --- LIST VIEW ---
                                <div className="space-y-3">
                                    {filteredAssessments.map((a: any) => {
                                        const status = getAssessmentStatus(
                                            a.start_time,
                                            a.end_time
                                        );
                                        return (
                                            <div
                                                key={a.id}
                                                className="relative flex items-center justify-between rounded-xl border p-4 pl-8 transition hover:bg-gray-50"
                                            >
                                                <StatusDot status={status} />
                                                <div>
                                                    <h3 className="font-semibold">
                                                        {a.title}{' '}
                                                        <Badge
                                                            className={cn(
                                                                'ml-2 min-w-16 justify-center',
                                                                statusColors[
                                                                    status
                                                                ]
                                                            )}
                                                        >
                                                            {status}
                                                        </Badge>
                                                    </h3>

                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        {getTimeLabel(
                                                            a.start_time,
                                                            a.end_time
                                                        )}
                                                    </p>
                                                </div>

                                                <Link
                                                    href={route(
                                                        'student.classes.subjects.assessments.show',
                                                        [
                                                            subject.class_id,
                                                            subject.id,
                                                            a.id,
                                                        ]
                                                    )}
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    <Button variant="ghost" size="sm" className='flex items-center gap-1'>
                                                        <Eye className='h-4 w-4'/> View
                                                    </Button>
                                                </Link>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                // --- GRID VIEW (Enhanced) ---
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {filteredAssessments.map((a: any) => {
                                        const status = getAssessmentStatus(
                                            a.start_time,
                                            a.end_time
                                        );
                                        return (
                                            <Link
                                                key={a.id}
                                                className={cn(
                                                    'relative flex flex-col justify-between rounded-2xl border-l-4 border p-4 transition hover:shadow-lg hover:border-l-primary/70 h-full',
                                                    status === 'ongoing' &&
                                                        'border-l-green-500/70',
                                                    status === 'upcoming' &&
                                                        'border-l-blue-500/70',
                                                    status === 'closed' &&
                                                        'border-l-red-500/70'
                                                )}
                                                href={route(
                                                    'student.classes.subjects.assessments.show',
                                                    [
                                                        subject.class_id,
                                                        subject.id,
                                                        a.id,
                                                    ]
                                                )}
                                            >
                                                <h3 className="text-lg font-semibold mb-1">
                                                    {a.title}
                                                </h3>

                                                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                                                    {a.description}
                                                </p>

                                                <div className="mt-3 flex items-end justify-between border-t pt-2 text-xs text-muted-foreground">
                                                    <div className="space-y-1">
                                                        <p>
                                                            Type:{' '}
                                                            <span className="font-medium text-foreground">
                                                                {a.type?.toUpperCase()}
                                                            </span>
                                                        </p>
                                                        <p>
                                                            <Clock className='h-3 w-3 inline-block mr-1'/>
                                                            {getTimeLabel(
                                                                a.start_time,
                                                                a.end_time
                                                            )}
                                                        </p>
                                                    </div>
                                                    <Badge
                                                        className={
                                                            statusColors[status]
                                                        }
                                                    >
                                                        {status}
                                                    </Badge>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* STUDENTS */}
                    <Card className="rounded-2xl lg:col-span-1">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <Users className="h-5 w-5 text-primary" />{' '}
                                Student Roster
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 max-h-96 overflow-y-auto pr-2">
                            {students.map((s, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between rounded-xl border p-3 transition hover:bg-gray-50"
                                >
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback className='bg-blue-100 text-blue-600 font-semibold text-sm'>
                                                {s.split(' ')[0][0]}
                                                {s.split(' ')[1][0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium">{s}</span>
                                    </div>
                                    <Link
                                        href="#"
                                        className="text-blue-600 hover:underline"
                                    >
                                        <Button variant="link" size="sm">
                                            View Profile
                                        </Button>
                                    </Link>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* REPORTS + CHART */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* REPORTS */}
                    <Card className="rounded-2xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <FileBarChart className="h-5 w-5 text-primary" />{' '}
                                Generate Reports
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {reports.map((r, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between rounded-xl border p-4 transition hover:bg-gray-50"
                                >
                                    <div className="flex items-center gap-3">
                                        <r.icon className="h-5 w-5 text-muted-foreground" />
                                        <span className="font-medium">
                                            {r.title}
                                        </span>
                                    </div>
                                    <Link href="#">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className="flex items-center gap-2"
                                        >
                                            <Eye className="h-4 w-4" /> View
                                        </Button>
                                    </Link>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* CHART PLACEHOLDER */}
                    <Card className="rounded-2xl">
                        <CardHeader className='pb-3'>
                            <CardTitle className="flex items-center justify-between gap-2 text-xl">
                                <div className="flex items-center gap-2">
                                    <BarChart3 className="h-5 w-5 text-primary" />{' '}
                                    Performance Chart
                                </div>
                                <Select defaultValue="overall">
                                    <SelectTrigger className="w-[120px] rounded-lg text-sm h-9">
                                        <SelectValue placeholder="Filter" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="overall">Overall</SelectItem>
                                        <SelectItem value="last_month">Last 30 Days</SelectItem>
                                        <SelectItem value="midterm">Midterm</SelectItem>
                                    </SelectContent>
                                </Select>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className='pt-0'>
                            <StudentPerformanceChart data={TestData} />
                            <p className='text-xs text-center text-muted-foreground mt-4'>
                                Average scores across recent assessments.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}