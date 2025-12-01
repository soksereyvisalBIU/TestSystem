import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { BarChart3, ClipboardList, FileBarChart, Users } from 'lucide-react';

import StudentPerformanceChart from '@/components/instructor/chart/StudentPerformanceChart';
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { GridIcon, ListIcon } from 'lucide-react';
import { useState } from 'react';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Class', href: '/' },
    { title: 'Subjects', href: '/subjects' },
];

export default function SubjectDetail({ subject }: { subject: any }) {
    const id = subject?.id;

    const [statusFilter, setStatusFilter] = useState<'all' | string>('all');
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');

    const assessments = subject?.assessments || [];

    console.log('assessments', assessments);

    const filtered =
        statusFilter === 'all'
            ? assessments
            : assessments.filter((a: any) => a.status === statusFilter);

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
    function getTimeLabel(start: string, end: string) {
        const now = new Date();
        const s = new Date(start);
        const e = new Date(end);

        // Closed
        if (now > e) {
            const diff = now.getTime() - e.getTime();
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            return `Closed ${days === 0 ? 'today' : `${days} day(s) ago`}`;
        }

        // Ongoing
        if (now >= s && now <= e) {
            const diff = e.getTime() - now.getTime();
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

            if (days > 0) return `Will end in ${days} day(s)`;
            return `Will end in ${hours} hour(s)`;
        }

        // Upcoming
        const diff = s.getTime() - now.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

        if (days > 0) return `Will start in ${days} day(s)`;
        return `Will start in ${hours} hour(s)`;
    }

    const statusColors: Record<string, string> = {
        upcoming: 'bg-blue-500',
        ongoing: 'bg-green-500',
        closed: 'bg-red-500',
        unknown: 'bg-gray-500',
    };

    const students = ['Sok Dara', 'Chan Lisa', 'Kim Vuthy', 'Srey Neang'];

    const reports = [
        'Overall Report',
        'Attendance Report',
        'Performance by Topic',
    ];

    const TestData = [
        { name: 'Sok Dara', score: 85, status: 'Good' },
        { name: 'Chan Lisa', score: 92, status: 'Excellent' },
        { name: 'Kim Vuthy', score: 76, status: 'Fair' },
    ];

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
                        className="h-56 w-full bg-cover bg-center"
                        style={{
                            backgroundImage: `url(${
                                subject?.cover
                                    ? '/storage/' + subject.cover
                                    : '/assets/img/class/class.jpg'
                            })`,
                        }}
                    />

                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent p-6 text-white">
                        <motion.div layoutId={`subject-meta-${id}`}>
                            <h3 className="text-lg opacity-90">
                                {subject?.year} — Semester {subject?.semester}
                            </h3>
                        </motion.div>

                        <motion.div
                            layoutId={`subject-title-${id}`}
                            className="mt-2 max-w-xl"
                        >
                            <h1 className="text-4xl font-semibold">
                                {subject?.name}
                            </h1>
                            <p className="mt-2 max-w-md text-sm opacity-80">
                                {subject?.description}
                            </p>
                        </motion.div>
                    </div>
                </motion.div>

                {/* INFO + STATS */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Card className="rounded-2xl">
                        <CardHeader>
                            <CardTitle>Subject Info</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <p>
                                <span className="font-semibold">
                                    Instructor:
                                </span>{' '}
                                Dr. Sok Visal
                            </p>
                            <p>
                                <span className="font-semibold">Credits:</span>{' '}
                                3
                            </p>
                            <p>
                                <span className="font-semibold">Schedule:</span>{' '}
                                Monday & Wednesday — 8:00 AM
                            </p>
                            <p>
                                <span className="font-semibold">
                                    Classroom:
                                </span>{' '}
                                B102
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="rounded-2xl">
                        <CardHeader>
                            <CardTitle>Quick Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <p>
                                <span className="font-semibold">
                                    Total Students:
                                </span>{' '}
                                {students.length}
                            </p>
                            <p>
                                <span className="font-semibold">
                                    Assessments:
                                </span>{' '}
                                {assessments.length}
                            </p>
                            <p>
                                <span className="font-semibold">
                                    Avg Score:
                                </span>{' '}
                                83%
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="rounded-2xl">
                        <CardHeader>
                            <CardTitle>Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <p>
                                Use the buttons below to add assessments,
                                students, or generate reports.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* MAIN CONTENT */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* ASSESSMENTS */}
                    <Card className="rounded-2xl lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <ClipboardList className="h-5 w-5" />
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
                                        <SelectTrigger className="w-[140px]">
                                            <SelectValue placeholder="Filter status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">
                                                Active
                                            </SelectItem>
                                            <SelectItem value="upcoming">
                                                Upcoming
                                            </SelectItem>
                                            <SelectItem value="closed">
                                                Closed
                                            </SelectItem>
                                            <SelectItem value="all">
                                                All
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>

                                    {/* List / Grid */}
                                    <ToggleGroup
                                        type="single"
                                        value={viewMode}
                                        onValueChange={(v) =>
                                            v && setViewMode(v)
                                        }
                                    >
                                        <ToggleGroupItem value="list">
                                            <ListIcon className="h-4 w-4" />
                                        </ToggleGroupItem>
                                        <ToggleGroupItem value="grid">
                                            <GridIcon className="h-4 w-4" />
                                        </ToggleGroupItem>
                                    </ToggleGroup>
                                </div>
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            {/* ASSESSMENT LIST / GRID */}
                            {filtered.length === 0 ? (
                                <div className="flex h-40 items-center justify-center rounded-xl border text-muted-foreground">
                                    No assessments found.
                                </div>
                            ) : viewMode === 'list' ? (
                                // --- LIST VIEW ---
                                <div className="space-y-3">
                                    {filtered.map((a: any) => {
                                        const status = getAssessmentStatus(
                                            a.start_time,
                                            a.end_time,
                                        );
                                        return (
                                            <div
                                                key={a.id}
                                                className="flex items-center justify-between rounded-xl border p-4 transition hover:bg-gray-50"
                                            >
                                                <div>
                                                    <h3 className="font-semibold">
                                                        {a.title}{' '}
                                                        <Badge
                                                            className={
                                                                statusColors[
                                                                    status
                                                                ]
                                                            }
                                                        >
                                                            {status}
                                                        </Badge>
                                                    </h3>

                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        {getTimeLabel(
                                                            a.start_time,
                                                            a.end_time,
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
                                                        ],
                                                    )}
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    View
                                                </Link>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                // --- GRID VIEW ---
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                    {filtered.map((a: any) => {
                                        const status = getAssessmentStatus(
                                            a.start_time,
                                            a.end_time,
                                        );
                                        return (
                                            <Link
                                                key={a.id}
                                                className="rounded-2xl border p-4 transition hover:shadow-lg"
                                                href={route(
                                                    'student.classes.subjects.assessments.show',
                                                    [
                                                        subject.class_id,
                                                        subject.id,
                                                        a.id,
                                                    ],
                                                )}
                                            >
                                                <h3 className="text-lg font-semibold">
                                                    {a.title}{' '}
                                                    <Badge
                                                        className={
                                                            statusColors[status]
                                                        }
                                                    >
                                                        {status}
                                                    </Badge>
                                                </h3>

                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    {a.description}
                                                </p>

                                                <div className="mt-1 space-y-1 text-xs text-muted-foreground">
                                                    <p>
                                                        Type:{' '}
                                                        <span className="font-medium">
                                                            {a.type?.toUpperCase()}
                                                        </span>
                                                    </p>
                                                    <div className="mt-1 space-y-1 text-xs text-muted-foreground">
                                                        <p>
                                                            {getTimeLabel(
                                                                a.start_time,
                                                                a.end_time,
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* STUDENTS */}
                    <Card className="rounded-2xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" /> Students
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {students.map((s, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between rounded-xl border p-3 hover:bg-gray-50"
                                >
                                    <span>{s}</span>
                                    <Link
                                        href="#"
                                        className="text-blue-600 hover:underline"
                                    >
                                        View
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
                            <CardTitle className="flex items-center gap-2">
                                <FileBarChart className="h-5 w-5" /> Reports
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {reports.map((r, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between rounded-xl border p-4 hover:bg-gray-50"
                                >
                                    <span>{r}</span>
                                    <Link
                                        href="#"
                                        className="text-blue-600 hover:underline"
                                    >
                                        View
                                    </Link>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* CHART PLACEHOLDER */}
                    <Card className="rounded-2xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5" /> Performance
                                Chart
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <StudentPerformanceChart data={TestData} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
