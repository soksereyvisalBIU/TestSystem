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
    Clock9, // New icon for 'Not Started'
} from 'lucide-react';
import { route } from 'ziggy-js';

// --- MOCK DATA & UTILITIES FOR PROFESSIONAL UX ---

interface Assessment {
    id: number;
    title: string;
    description: string;
    type: 'quiz' | 'exam' | 'assignment';
    start_time: string;
    end_time: string;
    status: 'completed' | 'ongoing' | 'upcoming';
    // Data merged from the controller
    student_status: 'scored' | 'attempted' | 'not_attempted' | 'missed';
    student_score: number | null; 
    class_id: number; 
    score?: number; // Class average
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

// UX Utility Function: Determine display details, prioritizing the user's state.
function getAssessmentStatusDetails(assessment: Assessment) {
    const studentStatus = assessment.student_status;
    const now = new Date();
    const endTime = new Date(assessment.end_time);
    const startTime = new Date(assessment.start_time);
    
    let badgeColorClass = 'text-slate-500 border-slate-300 bg-white';
    let icon: React.ReactNode = null;
    let subtitle = '';
    let mainLabel = '';
    let isUrgent = false;

    // 1. SCORED / COMPLETED (Student has a definitive result)
    if (studentStatus === 'scored') {
        mainLabel = 'SCORED';
        badgeColorClass = 'bg-emerald-100 text-emerald-700 border-emerald-200 font-bold';
        icon = <CheckCircle className="h-3 w-3" />;
        subtitle = `Your Score: ${assessment.student_score}%`;

    // 2. ATTEMPTED (Student is waiting for grade)
    } else if (studentStatus === 'attempted') {
        mainLabel = 'GRADING';
        badgeColorClass = 'bg-indigo-100 text-indigo-700 border-indigo-200 font-bold';
        icon = <Hourglass className="h-3 w-3" />;
        subtitle = `Waiting for Instructor Review`;

    // 3. MISSED (Student failed to attempt before due date)
    } else if (studentStatus === 'missed') {
        mainLabel = 'MISSED';
        badgeColorClass = 'bg-red-100 text-red-700 border-red-200 font-bold';
        icon = <XOctagon className="h-3 w-3" />;
        subtitle = `Deadline was ${endTime.toLocaleDateString()}`;

    // 4. ONGOING (Student has NOT attempted but window is open)
    } else if (assessment.status === 'ongoing') {
        mainLabel = 'START NOW';
        badgeColorClass = 'bg-amber-100 text-amber-700 border-amber-300 ring-2 ring-amber-200 font-bold';
        icon = <AlertTriangle className="h-3 w-3" />;
        const diffInHours = Math.floor((endTime.getTime() - now.getTime()) / (1000 * 60 * 60));
        subtitle = `Closes in ${diffInHours} hours!`;
        isUrgent = true;

    // 5. UPCOMING (Window not yet open)
    } else if (assessment.status === 'upcoming' && studentStatus === 'not_attempted') {
        mainLabel = 'UPCOMING';
        badgeColorClass = 'bg-blue-50 text-blue-600 border-blue-100 font-semibold';
        icon = <Calendar className="h-3 w-3" />;
        subtitle = `Starts ${startTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;

    // 6. NOT ATTEMPTED & CLOSED (The window passed, and the system missed status change or grading needed)
    } else { 
        mainLabel = 'NOT STARTED';
        badgeColorClass = 'bg-slate-50 text-slate-500 border-slate-200 font-semibold';
        icon = <Clock9 className="h-3 w-3" />;
        subtitle = `Deadline passed. Status: Closed`;
    }

    return { badgeColorClass, icon, subtitle, mainLabel, isUrgent };
}


const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Class', href: '/' },
    { title: 'Subjects', href: '/subjects' },
];

export default function SubjectDetail({ subject }: { subject: SubjectData }) {
    const id = subject?.id;
    const assessments = subject?.assessments || [];
    
    // Mock Data for Students and Resources (Unchanged)
    const students: any[] = [
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
                {/* HERO SECTION */}
                <motion.div
                    layoutId={`subject-card-${id}`}
                    className="group relative overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-300/50 ring-1 ring-slate-900/5"
                >
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

                            {/* ASSESSMENTS TAB - Enhanced Status Display */}
                            <TabsContent value="assessments" className="pt-2">
                                <Card className="border-none shadow-md rounded-2xl">
                                    <CardHeader className="flex flex-row items-center justify-between bg-white/50 border-b p-6">
                                        <div>
                                            <CardTitle>Subject Assessments</CardTitle>
                                            <CardDescription>Your personal status and scores for each assessment.</CardDescription>
                                        </div>
                                        {/* Placeholder button for instructor role */}
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
                                                    <motion.div
                                                        layoutId={`assessment-card-${assessment.id}`}
                                                        key={assessment.id}
                                                            initial={{ opacity: 0, y: 15 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ duration: 0.35, ease: "easeOut" }}
                                                            className={`group flex items-center justify-between rounded-xl border p-4 transition-all duration-300 cursor-pointer ${
                                                                statusDetails.isUrgent
                                                                    ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-200 shadow-md hover:shadow-lg'
                                                                    : assessment.student_status === 'scored'
                                                                    ? 'bg-emerald-50 border-emerald-100 hover:border-emerald-200 shadow-sm'
                                                                    : 'bg-white border-slate-100 hover:border-blue-100 hover:shadow-sm'
                                                            }`}
                                                    >
                                                        <Link className="flex items-start gap-4" href={assessmentRoute}>
                                                        
                                                            {/* Assessment Icon */}
                                                            <div className={`mt-1 flex h-10 w-10 items-center justify-center rounded-lg ${assessment.type === 'exam' ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600'}`}>
                                                                <FileText className="h-5 w-5" />
                                                            </div>
                                                            <div className='flex flex-col justify-center'>
                                                                <h4 className="font-semibold text-slate-900">{assessment.title}</h4>
                                                                <div className="flex items-center gap-3 text-sm text-slate-500 mt-0.5">
                                                                    {/* Student Status Badge */}
                                                                    <Badge 
                                                                        variant="default" // Using default since we control the color fully
                                                                        className={`h-5 px-2 text-[10px] uppercase flex items-center gap-1 ${statusDetails.badgeColorClass}`}
                                                                    >
                                                                        {statusDetails.icon}
                                                                        {statusDetails.mainLabel}
                                                                    </Badge>
                                                                    <span className="text-xs">{statusDetails.subtitle}</span>
                                                                </div>
                                                            </div>
                                                        </Link>

                                                        <div className="flex items-center gap-4">
                                                            {/* Score or Due Date */}
                                                            <div className="text-right">
                                                                <p className="text-xs font-medium text-slate-500">
                                                                    {assessment.student_status === 'scored' ? 'YOUR SCORE' : 'DUE DATE'}
                                                                </p>
                                                                <p className={`font-bold ${assessment.student_status === 'scored' && assessment.student_score !== null && assessment.student_score < 60 ? 'text-red-600' : 'text-slate-900'}`}>
                                                                    {assessment.student_status === 'scored' && assessment.student_score !== null
                                                                        ? <span className='text-lg'>{assessment.student_score}%</span>
                                                                        : assessment.end_time.split(' ')[0]
                                                                    }
                                                                </p>
                                                            </div>
                                                            {/* Action Button */}
                                                            <Button variant="ghost" size="icon" asChild className='group-hover:bg-slate-100'>
                                                                <Link href={assessmentRoute}>
                                                                    <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                                                                </Link>
                                                            </Button>
                                                        </div>
                                                    </motion.div>
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

                            {/* OTHER TABS (Overview, Students, Resources) - Snipped for brevity */}
                            <TabsContent value="overview" className="space-y-6 pt-4">{/* ... */}</TabsContent>
                            <TabsContent value="students" className="pt-2">{/* ... */}</TabsContent>
                            <TabsContent value="resources" className="pt-2">{/* ... */}</TabsContent>

                        </Tabs>
                    </div>

                    {/* RIGHT COLUMN (Sidebar Info) - Snipped for brevity */}
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