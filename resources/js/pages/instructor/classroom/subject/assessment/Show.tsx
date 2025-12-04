import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { route } from 'ziggy-js';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { UserInfo } from '@/components/user-info';
import AppLayout from '@/layouts/app-layout';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    LabelList,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

import {
    BarChart3,
    BookOpen,
    ClipboardList,
    FileText,
    Star,
    Tag,
    Timer,
    Users,
} from 'lucide-react';

import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Class', href: '/' },
    { title: 'Subjects', href: '/subjects' },
    { title: 'Assessments', href: '/assessments' },
];

export default function AssessmentDetail({
    assessment,
    classId,
    subjectId,
}: {
    assessment: any;
    classId: number;
    subjectId: number;
}) {
    const id = assessment.id;
    const role = 'editor';

    const [studentSearch, setStudentSearch] = useState('');
    const [studentFilter, setStudentFilter] = useState<
        'all' | 'draft' | 'submitted' | 'checked'
    >('all');

    const totalQuestions = assessment.questions?.length ?? 0;

    const totalMarks = useMemo(() => {
        return assessment.questions?.reduce(
            (a: number, q: any) => a + Number(q.point || 0),
            0,
        );
    }, [assessment.questions]);

    const students = assessment?.students ?? [];

    // Filtering
    const filteredStudents = students.filter((s: any) => {
        const status = s.pivot?.status ?? s.status ?? 'draft';
        const matchFilter = studentFilter === 'all' || status === studentFilter;
        const matchSearch = s.name
            ?.toLowerCase()
            .includes(studentSearch.toLowerCase());
        return matchFilter && matchSearch;
    });

    const safeDate = (value: string | null) =>
        value ? new Date(value).toLocaleString() : '-';

    const chartData = useMemo(() => {
        return students.map((s: any) => ({
            name: s.name.split(' ')[0], // short name
            score: Number(s.pivot.score ?? 0),
        }));
    }, [students]);

    const averageScore =
        chartData.length > 0
            ? chartData.reduce((sum, s) => sum + s.score, 0) / chartData.length
            : 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Assessment: ${assessment.title}`} />

            <div className="flex flex-col gap-6 p-4">
                {/* Header */}
                <motion.div layoutId={`assessment-card-${id}`}>
                    <Card className="overflow-hidden rounded-2xl shadow-lg">
                        <CardContent className="flex-col gap-3 px-6">
                            <div className="flex w-full items-center justify-between">
                                <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                                    <ClipboardList className="h-5 w-5" />
                                    {assessment.title}
                                </CardTitle>

                                {/* Status Badge */}
                                {/* <Badge variant={statusVariant}>
                                    {statusLabel}
                                </Badge> */}
                            </div>

                            {/* Quick Stats Row */}
                            <div className="mt-2 grid grid-cols-2 gap-3 text-sm text-muted-foreground md:grid-cols-4">
                                <div className="flex items-center gap-2">
                                    <BookOpen className="h-4 w-4" />
                                    <span>{totalQuestions} Questions</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Star className="h-4 w-4" />
                                    <span>{totalMarks} Marks</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Timer className="h-4 w-4" />
                                    <span>{assessment?.duration} mins</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Tag className="h-4 w-4" />
                                    <span>{assessment.type}</span>
                                </div>
                            </div>

                            {/* Time Progress / Countdown */}
                            <div className="mt-3 text-sm font-medium text-slate-600">
                                {/* {timeStatusLabel} */}
                            </div>

                            {/* Editor Buttons */}
                            {/* {role === 'editor' && (
                                <div className="mt-3 flex gap-2 self-end">
                                    <Button variant="outline" size="sm">
                                        <Pencil className="h-4 w-4" /> Edit
                                    </Button>
                                    <Button variant="destructive" size="sm">
                                        <Trash className="h-4 w-4" /> Delete
                                    </Button>
                                </div>
                            )} */}
                        </CardContent>
                    </Card>
                </motion.div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    {/* Students */}
                    <motion.div className="space-y-4 lg:col-span-2">
                        <Card className="rounded-2xl">
                            <CardHeader className="flex-row items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" /> Students
                                </CardTitle>

                                <Input
                                    placeholder="Search student..."
                                    value={studentSearch}
                                    onChange={(e) =>
                                        setStudentSearch(e.target.value)
                                    }
                                    className="w-48"
                                />
                            </CardHeader>

                            <CardContent>
                                {/* Filters */}
                                <div className="mb-4 flex gap-2">
                                    {[
                                        'all',
                                        'draft',
                                        'submitted',
                                        'checked',
                                    ].map((f) => (
                                        <Badge
                                            key={f}
                                            className={`cursor-pointer ${
                                                studentFilter === f
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-200 text-gray-800'
                                            }`}
                                            onClick={() =>
                                                setStudentFilter(f as any)
                                            }
                                        >
                                            {f.charAt(0).toUpperCase() +
                                                f.slice(1)}
                                        </Badge>
                                    ))}
                                </div>

                                {/* Student Table */}
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Student</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Score</TableHead>
                                            <TableHead className="text-right">
                                                Action
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody>
                                        {filteredStudents.length > 0 ? (
                                            filteredStudents.map(
                                                (s: any, index: number) => (
                                                    <TableRow key={index}>
                                                        <TableCell className="flex gap-2">
                                                            <UserInfo
                                                                user={s}
                                                                showEmail
                                                            />
                                                        </TableCell>

                                                        <TableCell>
                                                            {s.pivot?.status ??
                                                                'draft'}
                                                        </TableCell>

                                                        <TableCell>
                                                            {s.pivot?.score ??
                                                                0}
                                                        </TableCell>

                                                        <TableCell className="text-right">
                                                            <Link
                                                                className="text-blue-600 underline"
                                                                href={route(
                                                                    'instructor.classes.subjects.assessments.students.show',
                                                                    {
                                                                        class: classId,
                                                                        subject: subjectId,
                                                                        assessment: assessment.id,
                                                                        student:
                                                                            s?.id,
                                                                    },
                                                                )}
                                                                // href={route(
                                                                //     'instructor.classes.subjects.assessments.student.attempt',
                                                                //     [
                                                                //         classId,
                                                                //         subjectId,
                                                                //         assessment.id,
                                                                //         s.id
                                                                //     ],
                                                                // )}
                                                            >
                                                                View
                                                            </Link>
                                                        </TableCell>
                                                    </TableRow>
                                                ),
                                            )
                                        ) : (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={4}
                                                    className="py-4 text-center text-sm text-gray-500"
                                                >
                                                    No students found.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        {/* Questions */}
                        <Card className="rounded-2xl">
                            <CardHeader className="flex-row items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <ClipboardList className="h-5 w-5" />
                                    Questions
                                </CardTitle>

                                <Link
                                    href={route(
                                        'instructor.classes.subjects.assessments.questions.index',
                                        [classId, subjectId, assessment.id],
                                    )}
                                >
                                    see more
                                </Link>
                            </CardHeader>

                            <CardContent className="space-y-3">
                                {assessment.questions.map((q: any) => (
                                    <div
                                        key={q.id}
                                        className="flex flex-col rounded-xl border p-4"
                                    >
                                        <div className="mb-2 flex items-center justify-between">
                                            <span className="font-semibold">
                                                {q.question_text}
                                            </span>
                                            <Badge className="bg-gray-200 text-gray-800">
                                                {q.point} pts
                                            </Badge>
                                        </div>

                                        {/* <Badge className="mb-2 bg-blue-600 text-white capitalize">
                                            {q.type}
                                        </Badge> */}

                                        <div className="text-sm">
                                            {q.type === 'true_false' && (
                                                <p>
                                                    <span className="font-semibold">
                                                        Answer:
                                                    </span>{' '}
                                                    {q.answer
                                                        ? 'True'
                                                        : 'False'}
                                                </p>
                                            )}

                                            {q.type === 'multiple_choice' &&
                                                q.options?.map((opt: any) => (
                                                    <p
                                                        key={opt.label}
                                                        className={
                                                            opt.correct
                                                                ? 'font-semibold text-green-600'
                                                                : ''
                                                        }
                                                    >
                                                        {opt.label}. {opt.text}
                                                    </p>
                                                ))}

                                            {q.type === 'matching' &&
                                                q.pairs?.map(
                                                    (pair: any, i: number) => (
                                                        <p key={i}>
                                                            <strong>
                                                                {pair.left}
                                                            </strong>{' '}
                                                            → {pair.right}
                                                        </p>
                                                    ),
                                                )}
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Charts & Reports */}
                    <motion.div className="space-y-4">
                        <Card className="rounded-2xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart3 className="h-5 w-5" />
                                    Performance Chart
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-60 w-full">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <BarChart data={chartData} barSize={40}>
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                opacity={0.3}
                                            />

                                            <XAxis dataKey="name" />
                                            <YAxis />

                                            <Tooltip />

                                            {/* Average Line */}
                                            <ReferenceLine
                                                y={averageScore}
                                                stroke="red"
                                                strokeDasharray="5 5"
                                                label={{
                                                    value: `Avg: ${averageScore.toFixed(1)}`,
                                                    position: 'insideTopRight',
                                                    fill: 'red',
                                                }}
                                            />

                                            <Bar
                                                dataKey="score"
                                                radius={[8, 8, 0, 0]}
                                            >
                                                {chartData.map(
                                                    (entry, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={
                                                                entry.score >=
                                                                averageScore
                                                                    ? '#3b82f6' // blue-500
                                                                    : '#94a3b8' // slate-400
                                                            }
                                                        />
                                                    ),
                                                )}

                                                <LabelList
                                                    dataKey="score"
                                                    position="top"
                                                    fill="#000"
                                                    fontSize={12}
                                                />
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Reports
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-2 space-x-2 text-sm">
                                <Link href="#" className="text-blue-600">
                                    Overall Report
                                </Link>
                                <Link href="#" className="text-blue-600">
                                    Attendance Report
                                </Link>
                                <Link href="#" className="text-blue-600">
                                    Score by Topic
                                </Link>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </AppLayout>
    );
}
