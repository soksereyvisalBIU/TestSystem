import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { type BreadcrumbItem } from '@/types';
import { motion } from 'framer-motion';
import {
    BarChart3,
    ClipboardList,
    FileText,
    Pencil,
    Search,
    Trash,
    Users,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Class', href: '/' },
    { title: 'Subjects', href: '/subjects' },
    { title: 'Assessments', href: '/assessments' },
];

export default function AssessmentDetail({ assessment , classId, subjectId }: { assessment: any }) {
    
    const role = 'editor';
    const id = assessment.id;

    const [showQuestions, setShowQuestions] = useState(true);
    const [studentSearch, setStudentSearch] = useState('');
    const [studentFilter, setStudentFilter] = useState<
        'all' | 'draft' | 'submitted' | 'checked'
    >('all');

    // Compute total questions & marks from DB data
    const totalQuestions = assessment.questions?.length ?? 0;
    const totalMarks = useMemo(() => {
        return assessment.questions?.reduce(
            (sum: number, q: any) => sum + Number(q.point || 0),
            0,
        );
    }, [assessment.questions]);

    // Dummy student list (replace with DB students later)
    const students = [
        { name: 'Sok Dara', status: 'submitted', score: 80 },
        { name: 'Chan Lisa', status: 'checked', score: 92 },
        { name: 'Kim Vuthy', status: 'draft', score: null },
        { name: 'Srey Neang', status: 'submitted', score: 78 },
    ];

    // Filter logic
    const filteredStudents = students.filter((s) => {
        const matchFilter =
            studentFilter === 'all' || s.status === studentFilter;
        const matchSearch = s.name
            .toLowerCase()
            .includes(studentSearch.toLowerCase());
        return matchFilter && matchSearch;
    });

    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        show: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.35, ease: 'easeOut' },
        },
    };

    // Safe date format
    const safeDate = (value: string | null) =>
        value ? new Date(value).toLocaleString() : '-';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Assessment: ${assessment.title}`} />

            <div className="flex flex-col gap-6 p-4">
                {/* Header */}
                <motion.div
                    layoutId={`assessment-card-${id}`}
                    className="relative"
                >
                    <Card className="overflow-hidden rounded-2xl shadow-lg">
                        <CardHeader className="flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <ClipboardList className="h-5 w-5" />
                                {assessment.title}
                            </CardTitle>

                            {role === 'editor' && (
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm">
                                        <Pencil className="h-4 w-4" /> Edit
                                    </Button>
                                    <Button variant="destructive" size="sm">
                                        <Trash className="h-4 w-4" /> Delete
                                    </Button>
                                </div>
                            )}
                        </CardHeader>

                        <CardContent className="space-y-2 text-sm">
                            <p>
                                <span className="font-semibold">Type:</span>{' '}
                                {assessment.type}
                            </p>
                            <p>
                                <span className="font-semibold">Start:</span>{' '}
                                {safeDate(assessment.start_time)}
                            </p>
                            <p>
                                <span className="font-semibold">End:</span>{' '}
                                {safeDate(assessment.end_time)}
                            </p>
                            <p>
                                <span className="font-semibold">
                                    Total Questions:
                                </span>{' '}
                                {totalQuestions}
                            </p>
                            <p>
                                <span className="font-semibold">
                                    Total Marks:
                                </span>{' '}
                                {totalMarks}
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Students & Questions */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="space-y-4 lg:col-span-2"
                    >
                        {/* Students */}
                        <motion.div variants={cardVariants}>
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
                                        // leadingIcon={
                                        //     <Search className="h-4 w-4" />
                                        // }
                                    />
                                </CardHeader>

                                <CardContent className="space-y-2">
                                    {/* Filters */}
                                    <div className="mb-2 flex gap-2">
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

                                    {/* Student List */}
                                    {filteredStudents.length > 0 ? (
                                        filteredStudents.map((s, i) => (
                                            <div
                                                key={i}
                                                className="flex items-center justify-between rounded-xl border p-3 transition hover:bg-gray-50"
                                            >
                                                <span>{s.name}</span>
                                                <Badge
                                                    className={
                                                        s.status === 'draft'
                                                            ? 'bg-gray-500 text-white'
                                                            : s.status ===
                                                                'submitted'
                                                              ? 'bg-blue-500 text-white'
                                                              : 'bg-green-500 text-white'
                                                    }
                                                >
                                                    {s.status
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        s.status.slice(1)}
                                                </Badge>
                                                <span>
                                                    {s.score !== null
                                                        ? `${s.score}%`
                                                        : '-'}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="py-4 text-center text-sm text-gray-500">
                                            No students found.
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Questions */}
                        <motion.div variants={cardVariants}>
                            <Card className="rounded-2xl">
                                <CardHeader className="flex-row items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <ClipboardList className="h-5 w-5" />{' '}
                                        Questions
                                    </CardTitle>

                                    {/* <Button
                                        size="sm"
                                        onClick={() =>
                                            setShowQuestions(!showQuestions)
                                        }
                                    >
                                        {showQuestions ? 'Hide' : 'Show'}
                                    </Button> */}

                                    <Link
                                        href={route(
                                            'instructor.classes.subjects.assessments.questions.index' , [classId, subjectId, assessment.id]
                                        )}
                                    >
                                        see more
                                    </Link>
                                </CardHeader>

                                {showQuestions && (
                                    <CardContent className="space-y-3">
                                        {assessment.questions.map((q: any) => (
                                            <div
                                                key={q.id}
                                                className="flex flex-col rounded-xl border p-4 transition hover:bg-gray-50"
                                            >
                                                <div className="mb-2 flex items-center justify-between">
                                                    <span className="font-semibold">
                                                        {q.question_text}
                                                    </span>
                                                    <Badge className="bg-gray-200 text-gray-800">
                                                        {q.point} pts
                                                    </Badge>
                                                </div>

                                                <Badge className="mb-2 bg-blue-600 text-white capitalize">
                                                    {q.type}
                                                </Badge>

                                                {/* True/False */}
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

                                                {/* Multiple Choice */}
                                                {q.type === 'multiple_choice' &&
                                                    q.options &&
                                                    q.options.map(
                                                        (opt: any) => (
                                                            <p
                                                                key={opt.label}
                                                                className={
                                                                    opt.correct
                                                                        ? 'font-semibold text-green-600'
                                                                        : ''
                                                                }
                                                            >
                                                                {opt.label}.{' '}
                                                                {opt.text}
                                                            </p>
                                                        ),
                                                    )}

                                                {/* Matching */}
                                                {q.type === 'matching' &&
                                                    q.pairs &&
                                                    q.pairs.map(
                                                        (
                                                            pair: any,
                                                            i: number,
                                                        ) => (
                                                            <p key={i}>
                                                                <span className="font-semibold">
                                                                    {pair.left}
                                                                </span>{' '}
                                                                → {pair.right}
                                                            </p>
                                                        ),
                                                    )}
                                            </div>
                                        ))}
                                    </CardContent>
                                )}
                            </Card>
                        </motion.div>
                    </motion.div>

                    {/* Chart & Reports */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="space-y-4"
                    >
                        <motion.div variants={cardVariants}>
                            <Card className="rounded-2xl">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BarChart3 className="h-5 w-5" />
                                        Performance Chart
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex h-52 w-full items-center justify-center rounded-xl bg-gray-100 text-muted-foreground">
                                        Chart Placeholder
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div variants={cardVariants}>
                            <Card className="rounded-2xl">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="h-5 w-5" />
                                        Reports
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2 text-sm">
                                    <Link
                                        href="#"
                                        className="text-blue-600 hover:underline"
                                    >
                                        Overall Report
                                    </Link>
                                    <Link
                                        href="#"
                                        className="text-blue-600 hover:underline"
                                    >
                                        Attendance Report
                                    </Link>
                                    <Link
                                        href="#"
                                        className="text-blue-600 hover:underline"
                                    >
                                        Score by Topic
                                    </Link>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </AppLayout>
    );
}
