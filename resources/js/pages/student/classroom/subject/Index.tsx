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
// Assuming '@/types' contains BreadcrumbItem
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
    Paperclip,
    ArrowDown,
    Hourglass,
    CheckCircle,
    XOctagon,
    AlertTriangle,
} from 'lucide-react';
import { route } from 'ziggy-js';

// --- MOCK DATA & UTILITIES FOR PROFESSIONAL UX ---

// UPDATED INTERFACE to match the controller's merged data
interface Assessment {
    id: number;
    title: string;
    description: string;
    type: 'quiz' | 'exam' | 'assignment';
    start_time: string; // YYYY-MM-DD HH:MM:SS format
    end_time: string; // YYYY-MM-DD HH:MM:SS format
    // General class status (from Subject model or derived)
    status: 'completed' | 'ongoing' | 'upcoming';
    // NEW: Student-specific data merged in the controller
    student_status: 'scored' | 'attempted' | 'not_attempted' | 'missed';
    student_score: number | null; 
    class_id: number; // Added for routing
    // Class average score (if available)
    score?: number; 
}

interface SubjectData {
    id: number;
    name: string;
    description: string;
    cover: string;
    year: string;
    semester: string;
    class_id: number;
    assessments: Assessment[];
}

interface Student {
    id: number;
    name: string;
    avatar: string;
    progress: number;
}


// UX Utility Function: Determine display details for assessment status
function getAssessmentStatusDetails(assessment: Assessment) {
    const studentStatus = assessment.student_status;
    const now = new Date();
    const endTime = new Date(assessment.end_time);
    
    let badgeVariant: 'default' | 'outline' | 'secondary' = 'outline';
    let badgeColorClass = 'text-slate-500 border-slate-300 bg-white';
    let icon: React.ReactNode = null;
    let subtitle = '';
    let mainLabel = '';
    let isUrgent = false;

    // --- PRIORITIZE STUDENT STATUS ---
    if (studentStatus === 'scored') {
        mainLabel = 'SCORED';
        badgeColorClass = 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm';
        icon = <CheckCircle className="h-3 w-3" />;
        subtitle = `Your Score: ${assessment.student_score}%`;
    } else if (studentStatus === 'attempted') {
        mainLabel = 'ATTEMPTED';
        badgeColorClass = 'bg-indigo-50 text-indigo-600 border-indigo-100';
        icon = <Hourglass className="h-3 w-3" />;
        subtitle = `Waiting for Grade`;
    } else if (studentStatus === 'missed') {
        mainLabel = 'MISSED';
        badgeColorClass = 'bg-red-50 text-red-600 border-red-100';
        icon = <XOctagon className="h-3 w-3" />;
        subtitle = `Due: ${endTime.toLocaleDateString()}`;
    } 
    // --- FALLBACK TO GENERAL CLASS STATUS ---
    else if (assessment.status === 'ongoing') {
        mainLabel = 'ONGOING';
        badgeColorClass = 'bg-amber-100 text-amber-600 border-amber-200';
        icon = <AlertTriangle className="h-3 w-3" />;
        const diffInHours = Math.floor((endTime.getTime() - now.getTime()) / (1000 * 60 * 60));
        subtitle = `Closes in ${diffInHours}h`;
        isUrgent = true;
    } else if (assessment.status === 'upcoming') {
        mainLabel = 'UPCOMING';
        badgeColorClass = 'bg-blue-50 text-blue-600 border-blue-100';
        icon = <Calendar className="h-3 w-3" />;
        subtitle = `Starts ${new Date(assessment.start_time).toLocaleDateString()}`;
    } else { // status === 'completed' or 'not_attempted' but closed
        mainLabel = 'CLOSED';
        badgeColorClass = 'bg-slate-50 text-slate-500 border-slate-200';
        icon = <CheckCircle className="h-3 w-3" />;
        subtitle = assessment.score ? `Class Avg: ${assessment.score}%` : 'View Details';
    }

    return { badgeVariant, badgeColorClass, icon, subtitle, label: mainLabel, isUrgent };
}


const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Class', href: '/' },
    { title: 'Subjects', href: '/subjects' },
];

export default function SubjectDetail({ subject }: { subject: SubjectData }) {
    const id = subject?.id;
    const assessments = subject?.assessments || [];
    const students: Student[] = [
        { name: 'Sok Dara', id: 1, avatar: 'SD', progress: 92 },
        { name: 'Chan Lisa', id: 2, avatar: 'CL', progress: 88 },
        { name: 'Kim Vuthy', id: 3, avatar: 'KV', progress: 74 },
        { name: 'Srey Neang', id: 4, avatar: 'SN', progress: 95 },
    ];
    const resources = [
        { id: 1, name: 'Module 1: Foundations of Calculus', type: 'PDF', size: '1.2MB' },
        { id: 2, name: 'Lecture Notes: Week 3 - Algebra', type: 'DOCX', size: '0.5MB' },
        { id: 3, name: 'Practice Sheet: Statistical Models', type: 'XLSX', size: '0.8MB' },
    ];


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${subject?.name || 'Subject'} - Detail`} />

            <div className="min-h-screen space-y-8 bg-slate-50/50 p-4 pb-20 md:p-8">
                {/* HERO SECTION - Subject Header (Kept for design consistency) */}
                <motion.div
                    layoutId={`subject-card-${id}`}
                    className="group relative overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-300/50 ring-1 ring-slate-900/5"
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
                                        : 'https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=2070&auto=format&fit=crop'
                                })`,
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 flex flex-col justify-end p-8 md:p-12 md:pt-36">
                        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                            <div className="space-y-2">
                                <motion.div layoutId={`subject-meta-${id}`} className="flex items-center gap-2 text-blue-200">
                                    <Badge variant="secondary" className="bg-blue-500/30 text-blue-100 font-semibold hover:bg-blue-500/40">
                                        {subject?.year || '2025'}
                                    </Badge>
                                    <span>•</span>
                                    <span className="font-medium tracking-wide">Semester {subject?.semester || '1'}</span>
                                </motion.div>

                                <motion.div layoutId={`subject-title-${id}`}>
                                    <h1 className="text-4xl font-extrabold text-white md:text-6xl lg:tracking-tighter">
                                        {subject?.name || 'C++ Programming Language I'}
                                    </h1>
                                    <p className="mt-2 max-w-3xl text-lg text-slate-300">
                                        {subject?.description || 'Learn foundational concepts of C++ and object-oriented programming.'}
                                    </p>
                                </motion.div>
                            </div>

                            <div className="flex gap-3">
                                <Button size="lg" variant="outline" className="rounded-xl border-white/30 bg-white/15 text-white backdrop-blur-sm hover:bg-white/25 hover:text-white shadow-xl shadow-slate-900/10">
                                    <FileText className="mr-2 h-4 w-4" /> View Reports
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* MAIN CONTENT GRID */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    
                    {/* LEFT COLUMN (Main Content) - Spans 8 cols */}
                    <div className="lg:col-span-8">
                        <Tabs defaultValue="assessments" className="w-full space-y-6">
                            <TabsList className="h-auto w-full justify-start gap-4 rounded-none border-b bg-transparent p-0 pb-1">
                                <TabTrigger value="assessments">Assessments ({assessments.length})</TabTrigger>
                                <TabTrigger value="overview">Overview</TabTrigger>
                                <TabTrigger value="students">Students ({students.length})</TabTrigger>
                                <TabTrigger value="resources">Resources ({resources.length})</TabTrigger>
                            </TabsList>

                            {/* ASSESSMENTS TAB - UX Refinement */}
                            <TabsContent value="assessments" className="pt-2">
                                <Card className="border-none shadow-md rounded-2xl">
                                    <CardHeader className="flex flex-row items-center justify-between bg-white/50 border-b p-6">
                                        <div>
                                            <CardTitle>Subject Assessments</CardTitle>
                                            <CardDescription>Upcoming tests and your recorded scores.</CardDescription>
                                        </div>
                                        {/* This button should likely only be visible to instructors/admins */}
                                        <Button size="sm" className='shadow-lg hover:shadow-xl transition-shadow'>
                                            <Plus className="mr-2 h-4 w-4" /> Schedule New
                                        </Button>
                                    </CardHeader>
                                    <CardContent className="grid gap-3 p-6">
                                        {assessments.length > 0 ? (
                                            assessments.map((assessment) => {
                                                const statusDetails = getAssessmentStatusDetails(assessment);
                                                const assessmentRoute = route('student.classes.subjects.assessments.show', [subject.class_id, assessment.id, assessment.id]);

                                                return (
                                                    <div
                                                        key={assessment.id}
                                                        className={`group flex items-center justify-between rounded-xl border p-4 transition-all duration-300 cursor-pointer ${
                                                            statusDetails.isUrgent
                                                                ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-200 shadow-md hover:shadow-lg' // Ongoing/Urgent
                                                                : assessment.student_status === 'scored'
                                                                ? 'bg-emerald-50 border-emerald-100 hover:border-emerald-200 shadow-sm' // Scored
                                                                : 'bg-white border-slate-100 hover:border-blue-100 hover:shadow-sm' // Default
                                                        }`}
                                                    >
                                                        <div className="flex items-start gap-4">
                                                            {/* Icon based on type */}
                                                            <div className={`mt-1 flex h-10 w-10 items-center justify-center rounded-lg ${assessment.type === 'exam' ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600'}`}>
                                                                <FileText className="h-5 w-5" />
                                                            </div>
                                                            <div className='flex flex-col justify-center'>
                                                                <h4 className="font-semibold text-slate-900">{assessment.title}</h4>
                                                                <div className="flex items-center gap-3 text-sm text-slate-500 mt-0.5">
                                                                    <Badge 
                                                                        variant={statusDetails.badgeVariant} 
                                                                        className={`h-5 px-2 text-[10px] font-bold uppercase ${statusDetails.badgeColorClass} flex items-center gap-1`}
                                                                    >
                                                                        {statusDetails.icon}
                                                                        {statusDetails.label}
                                                                    </Badge>
                                                                    <span className="text-xs">{statusDetails.subtitle}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            {/* Score or CTA area */}
                                                            <div className="text-right">
                                                                <p className="text-xs font-medium text-slate-500">
                                                                    {assessment.student_status === 'scored' ? 'Your Score' : 'Due Date'}
                                                                </p>
                                                                <p className={`font-bold ${assessment.student_status === 'scored' && assessment.student_score !== null && assessment.student_score < 60 ? 'text-red-600' : 'text-slate-900'}`}>
                                                                    {assessment.student_status === 'scored' 
                                                                        ? `${assessment.student_score}%`
                                                                        : assessment.end_time.split(' ')[0]
                                                                    }
                                                                </p>
                                                            </div>
                                                            <Button variant="ghost" size="icon" asChild className='group-hover:bg-slate-100'>
                                                                {/* Use the dynamically calculated assessment route */}
                                                                <Link href={assessmentRoute}>
                                                                    <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                                                                </Link>
                                                            </Button>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                                                <BookOpen className="h-8 w-8 mx-auto mb-3 text-slate-400" />
                                                <p className="font-semibold">No assessments scheduled yet.</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* OTHER TABS (Overview, Students, Resources) remain largely unchanged */}
                            <TabsContent value="overview" className="space-y-6 pt-4">
                                {/* ... Overview Content ... */}
                                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                    <StatCard icon={Users} label="Students" value={students.length} color="text-blue-600" bg="bg-blue-50" />
                                    <StatCard icon={BookOpen} label="Assessments" value={assessments.length} color="text-purple-600" bg="bg-purple-50" />
                                    <StatCard icon={Clock} label="Hours" value="48" color="text-amber-600" bg="bg-amber-50" />
                                    <StatCard icon={BarChart3} label="Avg Score" value="83%" color="text-emerald-600" bg="bg-emerald-50" />
                                </div>
                                <Card className="overflow-hidden rounded-2xl border-none shadow-md">
                                    <CardHeader className="bg-white pb-2">
                                        <CardTitle className="text-lg">Overall Class Performance</CardTitle>
                                        <CardDescription>Average scores over the last seven graded activities.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="bg-white pt-4">
                                        <div className="flex h-64 w-full items-end justify-between gap-4 rounded-xl border border-slate-100 bg-white p-6">
                                            {[40, 65, 55, 80, 72, 90, 83].map((h, i) => (
                                                <div key={i} className="group relative w-full h-full">
                                                    <div 
                                                        className={`mx-auto w-full max-w-[32px] rounded-t-lg transition-all duration-500 hover:scale-y-105 ${h < 60 ? 'bg-red-400' : 'bg-blue-500 hover:bg-blue-600'}`}
                                                        style={{ height: `${h}%` }}
                                                    />
                                                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-center text-sm opacity-0 transition-opacity group-hover:opacity-100 bg-slate-800 text-white rounded-md px-2 py-1 whitespace-nowrap shadow-lg">
                                                        <span className="font-bold text-sm">{h}%</span>
                                                    </div>
                                                    <span className='absolute bottom-0 left-1/2 -translate-x-1/2 text-[10px] text-slate-500 mt-2 font-medium'>W{i+1}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            
                            <TabsContent value="students" className="pt-2">
                                <Card className="border-none shadow-md rounded-2xl">
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <div>
                                            <CardTitle>Enrolled Students</CardTitle>
                                            <CardDescription>Manage individual student performance and progress.</CardDescription>
                                        </div>
                                        <Button variant="outline" size="sm">Add Student</Button>
                                    </CardHeader>
                                    <CardContent className="grid gap-3 p-6">
                                        {students.map((student) => (
                                            <div key={student.id} className="flex items-center justify-between rounded-xl p-3 transition hover:bg-slate-50 border border-transparent hover:border-slate-100">
                                                <div className="flex items-center gap-4">
                                                    <Avatar className="h-11 w-11 rounded-lg ring-1 ring-slate-200 shadow-sm">
                                                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${student.name}`} alt={student.name} />
                                                        <AvatarFallback>{student.avatar}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-semibold text-slate-900">{student.name}</p>
                                                        <p className="text-xs text-slate-500">ID: 2024-{student.id}00</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <div className="hidden w-40 flex-col items-end gap-1 sm:flex">
                                                        <span className="text-xs font-medium text-slate-500">Overall Progress: {student.progress}%</span>
                                                        <Progress value={student.progress} className="h-2 w-full" indicatorClassName='bg-blue-500' />
                                                    </div>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVertical className="h-4 w-4 text-slate-400 hover:text-slate-600" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="resources" className="pt-2">
                                <Card className="border-none shadow-md rounded-2xl">
                                    <CardHeader>
                                        <CardTitle>Course Resources</CardTitle>
                                        <CardDescription>Documents, presentations, and readings for this subject.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="grid gap-3 p-6">
                                        {resources.map((resource) => (
                                            <div key={resource.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-3 transition hover:border-blue-200 hover:bg-blue-50/50">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                                                        <Paperclip className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-slate-900">{resource.name}</p>
                                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                                            <Badge variant="secondary" className='text-[10px]'>{resource.type}</Badge>
                                                            <Separator orientation="vertical" className="h-2" />
                                                            <span>{resource.size}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Button variant="ghost" size="icon" className='hover:bg-blue-200/50'>
                                                    <ArrowDown className="h-4 w-4 text-blue-600" />
                                                </Button>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                        </Tabs>
                    </div>

                    {/* RIGHT COLUMN (Sidebar Info) */}
                    <div className="space-y-6 lg:col-span-4">
                        
                        {/* Instructor Card */}
                        <Card className="rounded-2xl border-none shadow-md">
                            <CardHeader>
                                <CardTitle className="text-base font-semibold">Course Instructor</CardTitle>
                            </CardHeader>
                            <CardContent className="flex items-center gap-4">
                                <Avatar className="h-14 w-14 rounded-xl ring-2 ring-blue-500/50 shadow-md">
                                    <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf3795b2?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Instructor" />
                                    <AvatarFallback>SV</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-lg font-bold text-slate-900">Dr. Sok Visal</p>
                                    <p className="text-sm text-blue-600 font-medium">PhD in Mathematics</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Details Card */}
                        <Card className="rounded-2xl border-none shadow-md">
                            <CardHeader>
                                <CardTitle className="text-base font-semibold">Logistics</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <DetailItem icon={Clock} label="Schedule" value="Mon & Wed • 8:00 AM - 10:00 AM" />
                                <DetailItem icon={GraduationCap} label="Location" value="Building B, Room 102" />
                                <DetailItem icon={BookOpen} label="Weight" value="3.0 Credit Hours" />
                            </CardContent>
                        </Card>

                        {/* Quick Reports Card */}
                        <Card className="rounded-2xl border-none bg-blue-600 text-white shadow-xl shadow-blue-400/50 transition-transform hover:scale-[1.01] duration-300">
                            <CardHeader>
                                <CardTitle className="text-base text-white">Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-2">
                                <Button variant="ghost" className="w-full justify-start text-blue-50 hover:bg-blue-500 hover:text-white transition-colors font-semibold">
                                    <Download className="mr-3 h-4 w-4" /> Download Syllabus
                                </Button>
                                <Button variant="ghost" className="w-full justify-start text-blue-50 hover:bg-blue-500 hover:text-white transition-colors font-semibold">
                                    <BarChart3 className="mr-3 h-4 w-4" /> Attendance Report
                                </Button>
                            </CardContent>
                        </Card>

                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

// --- SUB-COMPONENTS (Unchanged) ---

function TabTrigger({ value, children }: { value: string; children: React.ReactNode }) {
    return (
        <TabsTrigger
            value={value}
            className="rounded-none border-b-2 border-transparent px-4 py-3 font-semibold text-slate-600 transition-colors hover:text-blue-700 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 data-[state=active]:shadow-none"
        >
            {children}
        </TabsTrigger>
    );
}

function StatCard({ icon: Icon, label, value, color, bg }: any) {
    return (
        <Card className="border-none shadow-sm transition-shadow hover:shadow-lg rounded-xl">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <div className={`mb-3 flex h-14 w-14 items-center justify-center rounded-xl ${bg} ${color}`}>
                    <Icon className="h-7 w-7" />
                </div>
                <div className="text-3xl font-extrabold text-slate-900">{value}</div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mt-1">{label}</div>
            </CardContent>
        </Card>
    );
}

function DetailItem({ icon: Icon, label, value }: any) {
    return (
        <div className="flex items-start gap-4 p-1">
            <Icon className="mt-1 h-4 w-4 text-blue-500 flex-shrink-0" />
            <div>
                <p className="text-xs font-medium text-slate-500">{label}</p>
                <p className="text-sm font-semibold text-slate-900">{value}</p>
            </div>
        </div>
    );
}