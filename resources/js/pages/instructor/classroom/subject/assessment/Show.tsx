import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
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
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import {
    AlertCircle,
    ArrowRight,
    BarChart3,
    BookOpen,
    Calendar,
    CheckCircle2,
    Clock,
    Download,
    FileText,
    Search,
    Trophy,
    Users,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { route } from 'ziggy-js';

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
    const role = 'editor';
    const [studentSearch, setStudentSearch] = useState('');
    const [activeTab, setActiveTab] = useState('students');

    // Stats Computation
    const totalQuestions = assessment.questions?.length ?? 0;
    const totalMarks = useMemo(
        () =>
            assessment.questions?.reduce(
                (a: number, q: any) => a + Number(q.point || 0),
                0,
            ),
        [assessment.questions],
    );

    const students = assessment?.students ?? [];

    // Filter Logic
    const filteredStudents = useMemo(() => {
        return students.filter((s: any) =>
            s.name?.toLowerCase().includes(studentSearch.toLowerCase()),
        );
    }, [students, studentSearch]);

    // Chart Data Preparation
    const chartData = useMemo(() => {
        return students
            .map((s: any) => ({
                name: s.name.split(' ')[0],
                fullName: s.name,
                score: Number(s.pivot.score ?? 0),
                status: s.pivot.status,
            }))
            .sort((a: any, b: any) => b.score - a.score); // Sort by highest score
    }, [students]);

    const averageScore =
        chartData.length > 0
            ? chartData.reduce((sum: number, s: any) => sum + s.score, 0) /
              chartData.length
            : 0;

    const submittedCount = students.filter(
        (s: any) =>
            s.pivot?.status === 'submitted' || s.pivot?.status === 'checked',
    ).length;
    const submissionRate =
        students.length > 0 ? (submittedCount / students.length) * 100 : 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Assessment: ${assessment.title}`} />

            <div className="min-h-screen space-y-6 bg-slate-50/50 p-4 pb-20 md:p-8">
                {/* HERO SECTION */}
                <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Badge
                                variant="outline"
                                className="border-blue-200 bg-blue-50 text-blue-700"
                            >
                                {assessment.type || 'Exam'}
                            </Badge>
                            {assessment.status === 'published' && (
                                <Badge
                                    variant="outline"
                                    className="border-green-200 bg-green-50 text-green-700"
                                >
                                    Published
                                </Badge>
                            )}
                        </div>
                        <motion.div
                            layoutId={`assessment-title-${assessment.id}`}
                        >
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                                {assessment.title}
                            </h1>
                        </motion.div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                            <span className="flex items-center gap-1.5">
                                <Calendar className="h-4 w-4" />
                                {assessment.due_date
                                    ? format(
                                          new Date(assessment.due_date),
                                          'PPP',
                                      )
                                    : 'No due date'}
                            </span>
                            <Separator orientation="vertical" className="h-4" />
                            <span className="flex items-center gap-1.5">
                                <Clock className="h-4 w-4" />
                                {assessment.duration} mins
                            </span>
                            <Separator orientation="vertical" className="h-4" />
                            <span className="flex items-center gap-1.5">
                                <Trophy className="h-4 w-4" />
                                {totalMarks} Total Points
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="bg-white">
                            <Download className="mr-2 h-4 w-4" /> Export
                        </Button>
                        {role === 'editor' && (
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                Edit Assessment
                            </Button>
                        )}
                    </div>
                </div>

                {/* KEY METRICS */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <MetricCard
                        label="Submission Rate"
                        value={`${Math.round(submissionRate)}%`}
                        subtext={`${submittedCount}/${students.length} students`}
                        icon={CheckCircle2}
                        trend="neutral"
                    />
                    <MetricCard
                        label="Average Score"
                        value={averageScore.toFixed(1)}
                        subtext={`Out of ${totalMarks}`}
                        icon={BarChart3}
                        trend={averageScore > totalMarks * 0.7 ? 'up' : 'down'}
                    />
                    <MetricCard
                        label="Questions"
                        value={totalQuestions}
                        subtext="Total Items"
                        icon={BookOpen}
                        trend="neutral"
                    />
                    <MetricCard
                        label="Pending Review"
                        value={
                            students.filter(
                                (s: any) => s.pivot?.status === 'submitted',
                            ).length
                        }
                        subtext="Need grading"
                        icon={AlertCircle}
                        trend="neutral"
                        color="text-amber-600"
                    />
                </div>

                {/* TABS CONTENT */}
                <Tabs
                    defaultValue="students"
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="space-y-6"
                >
                    <div className="flex items-center justify-between border-b border-slate-200">
                        <TabsList className="h-auto bg-transparent p-0">
                            <TabTrigger value="students">
                                Student Results
                            </TabTrigger>
                            <TabTrigger value="questions">
                                Questions & Content
                            </TabTrigger>
                            <TabTrigger value="analytics">Analytics</TabTrigger>
                        </TabsList>
                    </div>

                    {/* --- TAB 1: STUDENTS --- */}
                    <TabsContent value="students" className="space-y-4">
                        <Card className="border-none shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between px-6 pt-6">
                                <div>
                                    <CardTitle>Student Performance</CardTitle>
                                    <CardDescription>
                                        View attempts, grade submissions, and
                                        provide feedback.
                                    </CardDescription>
                                </div>
                                <div className="relative w-64">
                                    <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-slate-500" />
                                    <Input
                                        placeholder="Search student..."
                                        className="bg-slate-50 pl-9"
                                        value={studentSearch}
                                        onChange={(e) =>
                                            setStudentSearch(e.target.value)
                                        }
                                    />
                                </div>
                            </CardHeader>
                            <CardContent className="px-0">
                                <Table>
                                    <TableHeader className="bg-slate-50">
                                        <TableRow>
                                            <TableHead className="pl-6">
                                                Student
                                            </TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Submitted At</TableHead>
                                            <TableHead>Score</TableHead>
                                            <TableHead className="pr-6 text-right">
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredStudents.length > 0 ? (
                                            filteredStudents.map((s: any) => (
                                                <TableRow
                                                    key={s.id}
                                                    className="group hover:bg-slate-50/50"
                                                >
                                                    <TableCell className="pl-6">
                                                        <div className="flex items-center gap-3">
                                                            <Avatar className="h-9 w-9 border border-slate-200">
                                                                <AvatarImage
                                                                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${s.name}`}
                                                                />
                                                                <AvatarFallback>
                                                                    ST
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <p className="font-medium text-slate-900">
                                                                    {s.name}
                                                                </p>
                                                                <p className="text-xs text-slate-500">
                                                                    {s.email}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <StatusBadge
                                                            status={
                                                                s.pivot?.status
                                                            }
                                                        />
                                                    </TableCell>
                                                    <TableCell className="text-sm text-slate-500">
                                                        {s.pivot?.submitted_at
                                                            ? format(
                                                                  new Date(
                                                                      s.pivot.submitted_at,
                                                                  ),
                                                                  'MMM d, h:mm a',
                                                              )
                                                            : '-'}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <span
                                                                className={`font-bold ${Number(s.pivot?.score) >= totalMarks / 2 ? 'text-slate-900' : 'text-red-600'}`}
                                                            >
                                                                {s.pivot
                                                                    ?.score ??
                                                                    '-'}
                                                            </span>
                                                            <span className="text-slate-400">
                                                                / {totalMarks}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="pr-6 text-right">
                                                        <Button
                                                            asChild
                                                            size="sm"
                                                            variant="ghost"
                                                            className="text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                                                        >
                                                            <Link
                                                                href={route(
                                                                    'instructor.classes.subjects.assessments.students.show',
                                                                    {
                                                                        class: classId,
                                                                        subject:
                                                                            subjectId,
                                                                        assessment:
                                                                            assessment.id,
                                                                        student:
                                                                            s.id,
                                                                    },
                                                                )}
                                                            >
                                                                Grade{' '}
                                                                <ArrowRight className="ml-1 h-3 w-3" />
                                                            </Link>
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={5}
                                                    className="h-24 text-center text-slate-500"
                                                >
                                                    No students found matching
                                                    your search.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* --- TAB 2: QUESTIONS --- */}
                    <TabsContent value="questions" className="space-y-4">
                        <Card className="border-none shadow-sm">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Assessment Content</CardTitle>
                                    <Link
                                        href={route(
                                            'instructor.classes.subjects.assessments.questions.index',
                                            {
                                                class: classId,
                                                subject: subjectId,
                                                assessment: assessment.id,
                                            },
                                        )}
                                        className=""
                                    >
                                        Question
                                    </Link>
                                </div>
                                <CardDescription>
                                    There are {totalQuestions} questions in this
                                    assessment.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Accordion
                                    type="single"
                                    collapsible
                                    className="w-full space-y-2"
                                >
                                    {assessment.questions?.map(
                                        (q: any, index: number) => (
                                            <AccordionItem
                                                key={q.id}
                                                value={`item-${q.id}`}
                                                className="rounded-lg border border-slate-200 px-4 data-[state=open]:bg-slate-50"
                                            >
                                                <AccordionTrigger className="py-4 hover:no-underline">
                                                    <div className="flex flex-1 items-center gap-4 text-left">
                                                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                                                            {index + 1}
                                                        </span>
                                                        <span className="line-clamp-1 flex-1 font-medium text-slate-900">
                                                            {q.question_text}
                                                        </span>
                                                        <Badge
                                                            variant="secondary"
                                                            className="mr-2"
                                                        >
                                                            {q.point} pts
                                                        </Badge>
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent className="pt-1 pb-4 pl-10">
                                                    {/* Logic to display question types nicely */}
                                                    <div className="rounded-md border border-slate-100 bg-white p-4 text-sm text-slate-700 shadow-sm">
                                                        {q.type ===
                                                            'multiple_choice' && (
                                                            <ul className="space-y-2">
                                                                {q.options?.map(
                                                                    (
                                                                        opt: any,
                                                                        i: number,
                                                                    ) => (
                                                                        <li
                                                                            key={
                                                                                i
                                                                            }
                                                                            className={`flex items-center gap-2 ${opt.correct ? 'font-medium text-green-700' : ''}`}
                                                                        >
                                                                            <div
                                                                                className={`h-4 w-4 rounded-full border ${opt.correct ? 'border-green-600 bg-green-100' : 'border-slate-300'}`}
                                                                            />
                                                                            {
                                                                                opt.label
                                                                            }
                                                                            .{' '}
                                                                            {
                                                                                opt.text
                                                                            }
                                                                            {opt.correct && (
                                                                                <CheckCircle2 className="h-3 w-3" />
                                                                            )}
                                                                        </li>
                                                                    ),
                                                                )}
                                                            </ul>
                                                        )}
                                                        {/* Add other types as needed */}
                                                        {q.type ===
                                                            'true_false' && (
                                                            <div className="flex gap-4">
                                                                <Badge
                                                                    variant={
                                                                        q.answer
                                                                            ? 'success'
                                                                            : 'outline'
                                                                    }
                                                                >
                                                                    True
                                                                </Badge>
                                                                <Badge
                                                                    variant={
                                                                        !q.answer
                                                                            ? 'success'
                                                                            : 'outline'
                                                                    }
                                                                >
                                                                    False
                                                                </Badge>
                                                            </div>
                                                        )}
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        ),
                                    )}
                                </Accordion>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* --- TAB 3: ANALYTICS --- */}
                    <TabsContent value="analytics" className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                            <Card className="border-none shadow-sm lg:col-span-2">
                                <CardHeader>
                                    <CardTitle>Score Distribution</CardTitle>
                                    <CardDescription>
                                        How students performed relative to the
                                        class average. [Image of normal
                                        distribution curve]
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[350px] w-full">
                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >
                                            <BarChart
                                                data={chartData}
                                                margin={{
                                                    top: 20,
                                                    right: 30,
                                                    left: 0,
                                                    bottom: 5,
                                                }}
                                            >
                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                    vertical={false}
                                                    stroke="#e2e8f0"
                                                />
                                                <XAxis
                                                    dataKey="name"
                                                    tick={{
                                                        fill: '#64748b',
                                                        fontSize: 12,
                                                    }}
                                                    axisLine={false}
                                                    tickLine={false}
                                                    dy={10}
                                                />
                                                <YAxis
                                                    tick={{
                                                        fill: '#64748b',
                                                        fontSize: 12,
                                                    }}
                                                    axisLine={false}
                                                    tickLine={false}
                                                />
                                                <Tooltip
                                                    content={<CustomTooltip />}
                                                    cursor={{ fill: '#f1f5f9' }}
                                                />
                                                <Bar
                                                    dataKey="score"
                                                    radius={[4, 4, 0, 0]}
                                                >
                                                    {chartData.map(
                                                        (
                                                            entry: any,
                                                            index: number,
                                                        ) => (
                                                            <Cell
                                                                key={`cell-${index}`}
                                                                fill={
                                                                    entry.score >=
                                                                    averageScore
                                                                        ? '#3b82f6'
                                                                        : '#94a3b8'
                                                                }
                                                            />
                                                        ),
                                                    )}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-sm">
                                <CardHeader>
                                    <CardTitle>Available Reports</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <ReportLink
                                        icon={FileText}
                                        title="Full Gradebook"
                                        desc="Export all scores as CSV"
                                    />
                                    <ReportLink
                                        icon={Users}
                                        title="Attendance Report"
                                        desc="See who missed the deadline"
                                    />
                                    <ReportLink
                                        icon={BarChart3}
                                        title="Item Analysis"
                                        desc="Breakdown by specific question"
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}

// --- SUB-COMPONENTS for cleaner code ---

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
            className="rounded-none border-b-2 border-transparent px-6 py-3 text-slate-500 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:shadow-none"
        >
            {children}
        </TabsTrigger>
    );
}

function MetricCard({ label, value, subtext, icon: Icon, trend, color }: any) {
    return (
        <Card className="border-none shadow-sm">
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500">
                            {label}
                        </p>
                        <h3
                            className={`mt-2 text-2xl font-bold ${color || 'text-slate-900'}`}
                        >
                            {value}
                        </h3>
                        <p className="mt-1 text-xs text-slate-400">{subtext}</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50">
                        <Icon className="h-6 w-6 text-slate-500" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        submitted: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
        checked: 'bg-green-100 text-green-700 hover:bg-green-200',
        draft: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
        late: 'bg-red-100 text-red-700 hover:bg-red-200',
    };

    const label = status
        ? status.charAt(0).toUpperCase() + status.slice(1)
        : 'Pending';

    return (
        <Badge
            variant="secondary"
            className={`${styles[status] || styles.draft} font-normal`}
        >
            {label}
        </Badge>
    );
}

function ReportLink({ icon: Icon, title, desc }: any) {
    return (
        <Link
            href="#"
            className="flex items-start gap-3 rounded-lg border border-slate-100 bg-white p-3 transition hover:border-blue-200 hover:shadow-sm"
        >
            <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                <Icon className="h-4 w-4" />
            </div>
            <div>
                <p className="font-medium text-slate-900">{title}</p>
                <p className="text-xs text-slate-500">{desc}</p>
            </div>
        </Link>
    );
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-lg">
                <p className="font-semibold text-slate-900">
                    {payload[0].payload.fullName}
                </p>
                <p className="text-sm text-blue-600">
                    Score: {payload[0].value}
                </p>
                <p className="text-xs text-slate-500 capitalize">
                    Status: {payload[0].payload.status || 'Draft'}
                </p>
            </div>
        );
    }
    return null;
};
