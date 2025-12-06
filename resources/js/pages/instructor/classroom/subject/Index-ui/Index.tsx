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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
    Search,
    Users,
} from 'lucide-react';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Class', href: '/' },
    { title: 'Subjects', href: '/subjects' },
];

export default function SubjectDetail({ subject }: { subject: any }) {
    const id = subject?.id;
    const assessments = subject?.assessments || [];
    // Mocking some extra data for UI demonstration
    const students = [
        { id: 1, name: 'Sok Dara', email: 'dara@school.com', attendance: 92 },
        { id: 2, name: 'Chan Lisa', email: 'lisa@school.com', attendance: 85 },
        { id: 3, name: 'Kim Vuthy', email: 'vuthy@school.com', attendance: 78 },
        { id: 4, name: 'Srey Neang', email: 'neang@school.com', attendance: 95 },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${subject?.name || 'Subject'} - Detail`} />

            <div className="flex flex-col gap-8 p-6 lg:p-8 max-w-7xl mx-auto">
                {/* HERO SECTION */}
                <motion.div
                    layoutId={`subject-card-${id}`}
                    className="group relative overflow-hidden rounded-3xl bg-slate-900 shadow-2xl"
                >
                    {/* Background Image with Overlay */}
                    <motion.div
                        layoutId={`subject-bg-${id}`}
                        className="absolute inset-0 z-0 h-full w-full bg-cover bg-center opacity-60 transition-transform duration-700 group-hover:scale-105"
                        style={{
                            backgroundImage: `url(${
                                subject?.cover
                                    ? '/storage/' + subject.cover
                                    : '/assets/img/class/class.jpg'
                            })`,
                        }}
                    />
                    <div className="absolute inset-0 z-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />

                    {/* Content */}
                    <div className="relative z-10 flex flex-col justify-end p-8 md:h-72 lg:h-80">
                        <motion.div layoutId={`subject-meta-${id}`} className="flex flex-wrap items-center gap-3 mb-4">
                            <Badge variant="secondary" className="bg-blue-500/20 text-blue-100 hover:bg-blue-500/30 border-0">
                                {subject?.year || '2025'}
                            </Badge>
                            <Badge variant="outline" className="text-slate-300 border-slate-600">
                                Semester {subject?.semester || '1'}
                            </Badge>
                            <Badge variant="outline" className="text-slate-300 border-slate-600 flex items-center gap-1">
                                <Clock className="h-3 w-3" /> Mon & Wed • 8:00 AM
                            </Badge>
                        </motion.div>

                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <motion.div layoutId={`subject-title-${id}`} className="space-y-2">
                                <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
                                    {subject?.name || 'Subject Name'}
                                </h1>
                                <p className="max-w-2xl text-lg text-slate-300 line-clamp-2">
                                    {subject?.description || 'Advanced concepts in software engineering and system design patterns.'}
                                </p>
                            </motion.div>

                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 backdrop-blur-md border border-white/10">
                                    <Avatar className="h-10 w-10 border-2 border-white/20">
                                        <AvatarFallback className="bg-blue-600 text-white font-bold">SV</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Instructor</span>
                                        <span className="text-sm font-medium text-white">Dr. Sok Visal</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* MAIN CONTENT TABS */}
                <Tabs defaultValue="overview" className="w-full space-y-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <TabsList className="grid h-auto w-full grid-cols-4 gap-4 bg-transparent p-0 sm:w-auto sm:gap-6">
                            {['Overview', 'Assessments', 'Students', 'Reports'].map((tab) => (
                                <TabsTrigger
                                    key={tab}
                                    value={tab.toLowerCase()}
                                    className="rounded-full border border-transparent px-4 py-2 data-[state=active]:border-slate-200 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                                >
                                    {tab}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="hidden sm:flex">
                                <Download className="mr-2 h-4 w-4" /> Syllabus
                            </Button>
                            <Link href="#" className="w-full sm:w-auto">
                                <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                                    <Plus className="mr-2 h-4 w-4" /> Create Assessment
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* --- TAB: OVERVIEW --- */}
                    <TabsContent value="overview" className="space-y-6">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <StatsCard 
                                title="Total Students" 
                                value={students.length} 
                                icon={Users} 
                                trend="+2 this week" 
                            />
                            <StatsCard 
                                title="Assessments" 
                                value={assessments.length} 
                                icon={BookOpen} 
                                subtext="2 Active"
                            />
                            <StatsCard 
                                title="Avg. Attendance" 
                                value="87.5%" 
                                icon={Calendar} 
                                color="text-green-600"
                            />
                             <StatsCard 
                                title="Class Average" 
                                value="83%" 
                                icon={GraduationCap} 
                                color="text-blue-600"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                            <Card className="col-span-1 lg:col-span-2 border-slate-100 shadow-sm">
                                <CardHeader>
                                    <CardTitle>Recent Activity</CardTitle>
                                    <CardDescription>Latest updates from assessments and students.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex h-[300px] items-center justify-center rounded-xl bg-slate-50 border border-dashed border-slate-200">
                                        <div className="text-center text-slate-400">
                                            <BarChart3 className="mx-auto h-10 w-10 mb-2 opacity-50" />
                                            <p>Performance Chart Placeholder</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="col-span-1 border-slate-100 shadow-sm">
                                <CardHeader>
                                    <CardTitle>Upcoming Deadlines</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {assessments.slice(0, 3).map((a: any, i: number) => (
                                        <div key={i} className="flex items-start gap-3 rounded-lg border p-3 bg-slate-50/50">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                                                <Clock className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <p className="text-sm font-medium leading-none">{a.title}</p>
                                                <p className="text-xs text-muted-foreground">Due: {a.due}</p>
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-slate-400" />
                                        </div>
                                    ))}
                                    {assessments.length === 0 && (
                                        <p className="text-sm text-muted-foreground text-center py-4">No upcoming deadlines.</p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* --- TAB: ASSESSMENTS --- */}
                    <TabsContent value="assessments">
                        <Card className="border-slate-100 shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
                                <div>
                                    <CardTitle>Assessments</CardTitle>
                                    <CardDescription>Manage quizzes, assignments, and exams.</CardDescription>
                                </div>
                                <div className="flex gap-2">
                                     <Button variant="outline" size="sm"><Search className="h-4 w-4 mr-2"/> Search</Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {assessments.map((a: any) => (
                                    <div key={a.id} className="group flex flex-col md:flex-row md:items-center justify-between rounded-xl border p-4 transition-all hover:border-blue-200 hover:bg-blue-50/30 hover:shadow-sm">
                                        <div className="flex items-start gap-4 mb-4 md:mb-0">
                                            <div className="mt-1 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                                <FileText className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg text-slate-800 group-hover:text-blue-700">{a.title}</h3>
                                                <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                                                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3"/> Due {a.due}</span>
                                                    <Separator orientation="vertical" className="h-3" />
                                                    <span>100 Points</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="text-right hidden md:block mr-4">
                                                <div className="text-sm font-medium text-slate-900">24/30 Submitted</div>
                                                <Progress value={80} className="h-1.5 w-24 mt-1" />
                                            </div>
                                            <Link href={route('instructor.classes.subjects.assessments.show', [subject?.class_id, subject?.id, a.id])}>
                                                <Button variant="secondary" className="group-hover:bg-white">View Details</Button>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                                {assessments.length === 0 && (
                                    <div className="text-center py-12 text-muted-foreground">
                                        No assessments created yet.
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* --- TAB: STUDENTS --- */}
                    <TabsContent value="students">
                        <Card className="border-slate-100 shadow-sm">
                             <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                <div>
                                    <CardTitle>Enrolled Students</CardTitle>
                                    <CardDescription>Total: {students.length} Students</CardDescription>
                                </div>
                                <Button variant="outline" className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700">
                                    <Plus className="mr-2 h-4 w-4" /> Add Student
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {students.map((student, i) => (
                                        <div key={student.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition">
                                            <div className="flex items-center gap-4">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarFallback className="bg-slate-200 text-slate-600">
                                                        {student.name.split(' ').map(n => n[0]).join('')}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium text-sm text-slate-900">{student.name}</p>
                                                    <p className="text-xs text-slate-500">{student.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                 <div className="text-right hidden sm:block">
                                                    <span className="text-xs text-slate-500 block">Attendance</span>
                                                    <span className={`text-sm font-semibold ${student.attendance < 80 ? 'text-red-500' : 'text-green-600'}`}>
                                                        {student.attendance}%
                                                    </span>
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                                                        <DropdownMenuItem>Message</DropdownMenuItem>
                                                        <DropdownMenuItem className="text-red-600">Remove</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* --- TAB: REPORTS --- */}
                    <TabsContent value="reports">
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                             {['Overall Report', 'Attendance Log', 'Topic Performance', 'Student Risk Analysis'].map((report, i) => (
                                 <Card key={i} className="hover:shadow-md transition cursor-pointer border-slate-200">
                                     <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-4">
                                        <div className="h-12 w-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                                            <FileText className="h-6 w-6"/>
                                        </div>
                                        <h3 className="font-semibold">{report}</h3>
                                        <Button variant="ghost" className="text-blue-600 hover:text-blue-700">Generate PDF</Button>
                                     </CardContent>
                                 </Card>
                             ))}
                         </div>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}

// Sub-component for clean stats
function StatsCard({ title, value, icon: Icon, subtext, color, trend }: any) {
    return (
        <Card className="border-slate-100 shadow-sm">
            <CardContent className="p-6">
                <div className="flex items-center justify-between space-y-0 pb-2">
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <Icon className={`h-4 w-4 ${color || 'text-slate-500'}`} />
                </div>
                <div className="flex flex-col gap-1">
                    <div className="text-2xl font-bold">{value}</div>
                    {(subtext || trend) && (
                        <p className="text-xs text-muted-foreground">
                            {trend && <span className="text-green-600 mr-1">{trend}</span>}
                            {subtext}
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}