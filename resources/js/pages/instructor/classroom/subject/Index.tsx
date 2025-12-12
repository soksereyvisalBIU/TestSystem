import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    BarChart3,
    BookOpen,
    Calendar,
    ChevronRight,
    Clock,
    Download,
    FileText,
    GraduationCap,
    MoreVertical,
    Plus,
    Users,
} from 'lucide-react';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Class', href: '/' },
    { title: 'Subjects', href: '/subjects' },
];

export default function SubjectDetail({ subject }: { subject: any }) {
    console.log(subject);

    const id = subject?.id;
    const assessments = subject?.assessments || [
        // Mock data for UI demonstration if empty
        {
            id: 1,
            title: 'Midterm Exam',
            type: 'Exam',
            due: 'Oct 12, 2025',
            status: 'completed',
            score: 85,
        },
        {
            id: 2,
            title: 'Chapter 1 Quiz',
            type: 'Quiz',
            due: 'Nov 05, 2025',
            status: 'upcoming',
            score: null,
        },
    ];

    const students = [
        { name: 'Sok Dara', id: 1, avatar: 'SD', progress: 92 },
        { name: 'Chan Lisa', id: 2, avatar: 'CL', progress: 88 },
        { name: 'Kim Vuthy', id: 3, avatar: 'KV', progress: 74 },
        { name: 'Srey Neang', id: 4, avatar: 'SN', progress: 95 },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${subject?.name || 'Subject'} - Detail`} />

            <div className="min-h-screen space-y-6 bg-slate-50/50 p-4 pb-20 md:p-8">
                {/* HERO SECTION */}
                <motion.div
                    layoutId={`subject-card-${id}`}
                    className="group relative overflow-hidden rounded-[2rem] bg-white shadow-xl ring-1 shadow-slate-200/50 ring-slate-900/5"
                >
                    {/* Background Image with Overlay */}
                    <div className="absolute inset-0 z-0">
                        <motion.div
                            layoutId={`subject-bg-${id}`}
                            className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                            style={{
                                backgroundImage: `url(${
                                    subject?.cover
                                        ? '/storage/' + subject.cover
                                        : 'https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=2070&auto=format&fit=crop' // Better fallback image
                                })`,
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 flex flex-col justify-end p-6 md:p-10 md:pt-32">
                        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                            <div className="space-y-2">
                                <motion.div
                                    layoutId={`subject-meta-${id}`}
                                    className="flex items-center gap-2 text-blue-200"
                                >
                                    <Badge
                                        variant="secondary"
                                        className="bg-blue-500/20 text-blue-100 hover:bg-blue-500/30"
                                    >
                                        {subject?.year || '2025'}
                                    </Badge>
                                    <span>•</span>
                                    <span className="font-medium tracking-wide">
                                        Semester {subject?.semester || '1'}
                                    </span>
                                </motion.div>

                                <motion.div layoutId={`subject-title-${id}`}>
                                    <h1 className="text-3xl font-bold text-white md:text-5xl lg:tracking-tight">
                                        {subject?.name ||
                                            'Advanced Mathematics'}
                                    </h1>
                                    <p className="mt-2 max-w-2xl text-lg text-slate-300">
                                        {subject?.description ||
                                            'Deep dive into calculus, algebra, and statistical models for engineering.'}
                                    </p>
                                </motion.div>
                            </div>

                            <div className="flex gap-3">
                                <Link
                                    href={route(
                                        'instructor.classes.subjects.assessments.index',
                                        {
                                            class: subject.class_id,
                                            subject: subject.id,
                                        },
                                    )}
                                >
                                    <Button
                                        size="lg"
                                        className="rounded-xl bg-white text-slate-900 shadow-lg hover:bg-slate-100"
                                    >
                                        <Plus className="mr-2 h-4 w-4" /> New
                                        Assessment
                                    </Button>
                                </Link>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="rounded-xl border-white/20 bg-white/10 text-white backdrop-blur-md hover:bg-white/20 hover:text-white"
                                >
                                    <FileText className="mr-2 h-4 w-4" />{' '}
                                    Reports
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* MAIN CONTENT GRID */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    {/* LEFT COLUMN (Main Content) - Spans 8 cols */}
                    <div className="lg:col-span-8">
                        <Tabs
                            defaultValue="overview"
                            className="w-full space-y-6"
                        >
                            <TabsList className="h-auto w-full justify-start gap-2 rounded-none border-b bg-transparent p-0 pb-1">
                                <TabTrigger value="overview">
                                    Overview
                                </TabTrigger>
                                <TabTrigger value="assessments">
                                    Assessments
                                </TabTrigger>
                                <TabTrigger value="students">
                                    Students
                                </TabTrigger>
                                <TabTrigger value="resources">
                                    Resources
                                </TabTrigger>
                            </TabsList>

                            {/* OVERVIEW TAB */}
                            <TabsContent
                                value="overview"
                                className="space-y-6 pt-4"
                            >
                                {/* Stats Row */}
                                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                    <StatCard
                                        icon={Users}
                                        label="Students"
                                        value={students.length}
                                        color="text-blue-600"
                                        bg="bg-blue-50"
                                    />
                                    <StatCard
                                        icon={BookOpen}
                                        label="Assessments"
                                        value={assessments.length}
                                        color="text-purple-600"
                                        bg="bg-purple-50"
                                    />
                                    <StatCard
                                        icon={Clock}
                                        label="Hours"
                                        value="48"
                                        color="text-amber-600"
                                        bg="bg-amber-50"
                                    />
                                    <StatCard
                                        icon={BarChart3}
                                        label="Avg Score"
                                        value="83%"
                                        color="text-emerald-600"
                                        bg="bg-emerald-50"
                                    />
                                </div>

                                {/* Chart Section */}
                                <Card className="overflow-hidden rounded-2xl border-none shadow-sm">
                                    <CardHeader className="bg-white pb-2">
                                        <CardTitle className="text-lg">
                                            Class Performance
                                        </CardTitle>
                                        <CardDescription>
                                            Average scores over the last
                                            semester
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="bg-white pt-4">
                                        <div className="flex h-64 w-full items-end justify-between gap-2 rounded-xl bg-slate-50 p-6">
                                            {/* Mock Chart Bars */}
                                            {[40, 65, 55, 80, 72, 90, 83].map(
                                                (h, i) => (
                                                    <div
                                                        key={i}
                                                        className="group relative w-full"
                                                    >
                                                        <div
                                                            className="mx-auto w-full max-w-[40px] rounded-t-lg bg-blue-500 opacity-80 transition-all duration-500 group-hover:bg-blue-600 hover:opacity-100"
                                                            style={{
                                                                height: `${h}%`,
                                                            }}
                                                        />
                                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 transition-opacity group-hover:opacity-100">
                                                            <span className="text-xs font-bold text-slate-700">
                                                                {h}%
                                                            </span>
                                                        </div>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* ASSESSMENTS TAB */}
                            <TabsContent value="assessments" className="pt-2">
                                <Card className="border-none shadow-sm">
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <div>
                                            <CardTitle>Assessments</CardTitle>
                                            <CardDescription>
                                                Manage quizzes, exams, and
                                                assignments.
                                            </CardDescription>
                                        </div>
                                        {/* <Button size="sm">Create New</Button> */}
                                        <Link
                                            href={route(
                                                'instructor.classes.subjects.assessments.index',
                                                {
                                                    class: subject.class_id,
                                                    subject: subject.id,
                                                },
                                            )}
                                        >
                                            Assessment detail
                                        </Link>
                                    </CardHeader>
                                    <CardContent className="grid gap-4">
                                        {assessments.map((assessment) => (
                                            <div
                                                key={assessment.id}
                                                className="group flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4 transition-all hover:border-blue-100 hover:shadow-md"
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div
                                                        className={`mt-1 flex h-10 w-10 items-center justify-center rounded-lg ${assessment.type === 'Exam' ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600'}`}
                                                    >
                                                        <FileText className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <motion.div layoutId={`assessment-title-${assessment.id}`}>
                                                            <h4 className="font-semibold text-slate-900">
                                                                {
                                                                    assessment.title
                                                                }
                                                            </h4>
                                                        </motion.div>
                                                        <div className="flex items-center gap-3 text-sm text-slate-500">
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="h-3 w-3" />{' '}
                                                                {assessment.due}
                                                            </span>
                                                            <Separator
                                                                orientation="vertical"
                                                                className="h-3"
                                                            />
                                                            <Badge
                                                                variant={
                                                                    assessment.status ===
                                                                    'completed'
                                                                        ? 'default'
                                                                        : 'outline'
                                                                }
                                                                className="h-5 px-1.5 text-[10px] uppercase"
                                                            >
                                                                {
                                                                    assessment.status
                                                                }
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="text-right">
                                                        <p className="text-xs font-medium text-slate-500">
                                                            Avg. Score
                                                        </p>
                                                        <p className="font-bold text-slate-900">
                                                            {assessment.score
                                                                ? assessment.score +
                                                                  '%'
                                                                : '-'}
                                                        </p>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={route(
                                                                'instructor.classes.subjects.assessments.show',
                                                                [
                                                                    subject?.class_id,
                                                                    id,
                                                                    assessment.id,
                                                                ],
                                                            )}
                                                        >
                                                            <ChevronRight className="h-5 w-5 text-slate-400" />
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* STUDENTS TAB */}
                            <TabsContent value="students" className="pt-2">
                                <Card className="border-none shadow-sm">
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <div>
                                            <CardTitle>
                                                Enrolled Students
                                            </CardTitle>
                                            <CardDescription>
                                                {students.length} students
                                                currently active.
                                            </CardDescription>
                                        </div>
                                        <Button variant="outline" size="sm">
                                            Add Student
                                        </Button>
                                    </CardHeader>
                                    <CardContent className="grid gap-4">
                                        {students.map((student) => (
                                            <div
                                                key={student.id}
                                                className="flex items-center justify-between rounded-xl p-2 transition hover:bg-slate-50"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                                                        <AvatarImage
                                                            src={`https://api.dicebear.com/7.x/initials/svg?seed=${student.name}`}
                                                        />
                                                        <AvatarFallback>
                                                            {student.avatar}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium text-slate-900">
                                                            {student.name}
                                                        </p>
                                                        <p className="text-xs text-slate-500">
                                                            ID: 2024-
                                                            {student.id}00
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <div className="hidden w-32 flex-col items-end gap-1 sm:flex">
                                                        <span className="text-xs font-medium text-slate-500">
                                                            Progress
                                                        </span>
                                                        <Progress
                                                            value={
                                                                student.progress
                                                            }
                                                            className="h-2 w-full"
                                                        />
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                    >
                                                        <MoreVertical className="h-4 w-4 text-slate-400" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* RIGHT COLUMN (Sidebar Info) - Spans 4 cols */}
                    <div className="space-y-6 lg:col-span-4">
                        {/* Instructor Card */}
                        <Card className="rounded-2xl border-none shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Instructor
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex items-center gap-4">
                                <Avatar className="h-12 w-12 rounded-xl">
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback>SV</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-slate-900">
                                        Dr. Sok Visal
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        PhD in Mathematics
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Details Card */}
                        <Card className="rounded-2xl border-none shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Class Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <DetailItem
                                    icon={Clock}
                                    label="Schedule"
                                    value="Mon & Wed • 8:00 AM"
                                />
                                <DetailItem
                                    icon={GraduationCap}
                                    label="Room"
                                    value="Building B, Room 102"
                                />
                                <DetailItem
                                    icon={BookOpen}
                                    label="Credits"
                                    value="3.0 Credit Hours"
                                />
                            </CardContent>
                        </Card>

                        {/* Quick Reports */}
                        <Card className="rounded-2xl border-none bg-blue-600 text-white shadow-lg shadow-blue-200">
                            <CardHeader>
                                <CardTitle className="text-base text-white">
                                    Quick Actions
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-2">
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start text-blue-50 hover:bg-blue-500 hover:text-white"
                                >
                                    <Download className="mr-2 h-4 w-4" />{' '}
                                    Download Syllabus
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start text-blue-50 hover:bg-blue-500 hover:text-white"
                                >
                                    <BarChart3 className="mr-2 h-4 w-4" />{' '}
                                    Attendance Report
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

// --- SUB-COMPONENTS for cleanliness ---

function TabTrigger({
    value,
    children,
}: {
    value: string;
    children: React.ReactNode;
}) {
    return (
        <TabsTrigger
            value={value}
            className="rounded-none border-b-2 border-transparent px-4 py-3 text-slate-500 hover:text-slate-700 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 data-[state=active]:shadow-none"
        >
            {children}
        </TabsTrigger>
    );
}

function StatCard({ icon: Icon, label, value, color, bg }: any) {
    return (
        <Card className="border-none shadow-sm">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <div
                    className={`mb-3 flex h-12 w-12 items-center justify-center rounded-full ${bg} ${color}`}
                >
                    <Icon className="h-6 w-6" />
                </div>
                <div className="text-2xl font-bold text-slate-900">{value}</div>
                <div className="text-xs font-medium tracking-wide text-slate-500 uppercase">
                    {label}
                </div>
            </CardContent>
        </Card>
    );
}

function DetailItem({ icon: Icon, label, value }: any) {
    return (
        <div className="flex items-start gap-3">
            <Icon className="mt-0.5 h-4 w-4 text-slate-400" />
            <div>
                <p className="text-xs font-medium text-slate-500">{label}</p>
                <p className="text-sm font-medium text-slate-900">{value}</p>
            </div>
        </div>
    );
}
