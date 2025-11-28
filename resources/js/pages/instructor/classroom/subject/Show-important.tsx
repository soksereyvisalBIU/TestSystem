import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { type BreadcrumbItem } from '@/types';
import { BarChart3, Users, ClipboardList, FileBarChart } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Class', href: '/' },
    { title: 'Subjects', href: '/subjects' },
];

export default function SubjectDetail() {
    const id = 1; // subject ID (static for now)

    const assessments = [
        { id: 1, title: 'Quiz 1', due: '02/01/2025' },
        { id: 2, title: 'Quiz 2', due: '04/01/2025' },
        { id: 3, title: 'Midterm Exam', due: '06/01/2025' },
        { id: 4, title: 'Project', due: '08/01/2025' },
        { id: 5, title: 'Final Exam', due: '10/01/2025' },
    ];

    const students = ['Sok Dara', 'Chan Lisa', 'Kim Vuthy', 'Srey Neang'];

    const reports = ['Overall Report', 'Attendance Report', 'Performance by Topic'];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Subject Detail" />

            <div className="flex flex-col gap-6 p-4">
                {/* HEADER - Morphing Animation */}
                <motion.div
                    layoutId={`subject-card-${id}`}
                    className="relative overflow-hidden rounded-3xl shadow-xl"
                >
                    <motion.div
                        layoutId={`subject-bg-${id}`}
                        className="h-56 w-full bg-center bg-cover"
                        style={{ backgroundImage: "url('/assets/img/subject/default.jpg')" }}
                    />

                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-transparent p-6 text-white">
                        <motion.div layoutId={`subject-meta-${id}`}>
                            <h3 className="text-lg opacity-90">Semester 1 — Year 2025</h3>
                        </motion.div>

                        <motion.div layoutId={`subject-title-${id}`} className="mt-2 max-w-xl">
                            <h1 className="text-4xl font-semibold">Advanced Algorithms</h1>
                            <p className="mt-2 max-w-md text-sm opacity-80">
                                In-depth study of algorithm design techniques, complexity analysis, and problem-solving strategies.
                            </p>
                        </motion.div>
                    </div>
                </motion.div>

                {/* ACTION BUTTONS */}
                <div className="flex flex-wrap gap-3">
                    <Link
                        href="#"
                        className="rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
                    >
                        Add Assessment
                    </Link>
                    <Link
                        href="#"
                        className="rounded-xl bg-green-600 px-4 py-2 text-white hover:bg-green-700 transition"
                    >
                        Add Student
                    </Link>
                    <Link
                        href="#"
                        className="rounded-xl bg-slate-700 px-4 py-2 text-white hover:bg-slate-800 transition"
                    >
                        Generate Report
                    </Link>
                </div>

                {/* INFO + STATS GRID */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Card className="rounded-2xl">
                        <CardHeader>
                            <CardTitle>Subject Info</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <p><span className="font-semibold">Instructor:</span> Dr. Sok Visal</p>
                            <p><span className="font-semibold">Credits:</span> 3</p>
                            <p><span className="font-semibold">Schedule:</span> Monday & Wednesday — 8:00 AM</p>
                            <p><span className="font-semibold">Classroom:</span> B102</p>
                        </CardContent>
                    </Card>

                    <Card className="rounded-2xl">
                        <CardHeader>
                            <CardTitle>Quick Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <p><span className="font-semibold">Total Students:</span> {students.length}</p>
                            <p><span className="font-semibold">Assessments:</span> {assessments.length}</p>
                            <p><span className="font-semibold">Avg Score:</span> 83%</p>
                        </CardContent>
                    </Card>

                    <Card className="rounded-2xl">
                        <CardHeader>
                            <CardTitle>Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <p>Use the buttons above to add assessments, students, or generate reports.</p>
                        </CardContent>
                    </Card>
                </div>

                {/* MAIN CONTENT GRID */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* ASSESSMENTS */}
                    <Card className="rounded-2xl lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ClipboardList className="h-5 w-5" /> Assessments
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {assessments.map((a) => (
                                <div key={a.id} className="flex justify-between rounded-xl border p-4 hover:bg-gray-50 transition">
                                    <div>
                                        <h3 className="font-semibold">{a.title}</h3>
                                        <p className="text-sm text-muted-foreground">Due: {a.due}</p>
                                    </div>
                                    <Link href="#" className="text-blue-600 hover:underline">View</Link>
                                </div>
                            ))}
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
                                <div key={i} className="flex items-center justify-between rounded-xl border p-3 hover:bg-gray-50 transition">
                                    <span>{s}</span>
                                    <Link href="#" className="text-blue-600 hover:underline">View</Link>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* REPORTS + CHARTS */}
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
                                <div key={i} className="flex items-center justify-between rounded-xl border p-4 hover:bg-gray-50 transition">
                                    <span>{r}</span>
                                    <Link href="#" className="text-blue-600 hover:underline">View</Link>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* PERFORMANCE CHART */}
                    <Card className="rounded-2xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5" /> Performance Chart
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-60 w-full rounded-xl bg-gray-100 flex items-center justify-center text-muted-foreground">
                                Chart Placeholder
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
