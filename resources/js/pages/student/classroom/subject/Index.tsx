import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

// Types & Icons
import { SubjectData } from '@/types/student/assessment';
import {
    BarChart3,
    BookOpen,
    Clock,
    Download,
    Info,
    ShieldCheck,
    Users,
} from 'lucide-react';

// Sub-components
import { InstructorCard } from './components/card/instructor-card';
import { LogisticsCard } from './components/card/logistics-card';
import { QuickActionsCard } from './components/card/quick-actions-card';
import { StatCard } from './components/card/stat-card';
import { PerformanceChart } from './components/chart/performance-chart';
import { AssessmentsList } from './components/list/assessments-list';
import { SubjectHero } from './components/subject-hero';

// const breadcrumbs: BreadcrumbItem[] = [
//     { title: 'Dashboard', href: '/dashboard' },
//     { title: 'Class', href: '/classes' },
//     { title: 'Subject Detail', href: '#' },
// ];

export default function SubjectDetail({ subject }: { subject: SubjectData }) {
    // Shared State for Animations
    const [activeTab, setActiveTab] = React.useState('assessments');

    // console.log(subject)
    // {
    // "id": 1,
    // "name": "Recusandae Labore c",
    // "description": "Ut est id dolores s",
    // "class_id": 1,
    // "visibility": "private",
    // "cover": "subjects/GyG64W3cPfmuMsWCO9YcQQLsb7WlUotutxgcSiOO.png",
    // "created_at": "2025-12-26T10:23:33.000000Z",
    // "updated_at": "2025-12-27T05:02:13.000000Z",
    // "assessments": [
    //     {
    //     "id": 1,
    //     "title": "Tempora soluta assum",
    //     "description": "Impedit harum exerc",
    //     "type": "quiz",
    //     "start_time": "2025-12-25 15:00:00",
    //     "end_time": "2025-12-27 05:00:00",
    //     "duration": 90,
    //     "max_attempts": 5,
    //     "created_by": null,
    //     "created_at": "2025-12-26T10:23:59.000000Z",
    //     "updated_at": "2025-12-26T10:23:59.000000Z",
    //     "pivot": {
    //         "subject_id": 1,
    //         "assessment_id": 1
    //     },
    //     "student_assessment": {
    //         "id": 1,
    //         "user_id": 2,
    //         "assessment_id": 1,
    //         "status": "scored",
    //         "score": "78.55",
    //         "attempted_amount": 2,
    //         "created_at": "2025-12-26T10:26:36.000000Z",
    //         "updated_at": "2025-12-26T10:45:52.000000Z"
    //     }
    //     }
    // ]
    // }

    const performanceData = [40, 65, 55, 80, 72, 90, 83];

    const quickActions = [
        {
            icon: Download,
            label: 'Syllabus PDF',
            onClick: () => console.log('Syllabus'),
        },
        {
            icon: ShieldCheck,
            label: 'Course Progress',
            onClick: () => console.log('Progress'),
        },
    ];

    return (
        <AppLayout>
            <Head title={`${subject?.name} | Student Portal`} />

            <div className="mx-auto min-h-screen max-w-7xl space-y-8 p-4 pb-20 md:p-8">
                {/* 1. Hero Section - Elevated with subtle entrance animation */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <SubjectHero
                        {...subject}
                        onViewReports={() => setActiveTab('overview')}
                    />
                </motion.div>

                <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
                    {/* Left Column: Interactive Content */}
                    <div className="space-y-6 lg:col-span-8">
                        <Tabs
                            defaultValue="assessments"
                            value={activeTab}
                            onValueChange={setActiveTab}
                            className="w-full"
                        >
                            <div className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur-md">
                                <TabsList className="h-auto w-full justify-start gap-1 bg-transparent p-0">
                                    <CustomTabTrigger
                                        value="assessments"
                                        label="Assessments"
                                        count={subject.assessments.length}
                                    />
                                    <CustomTabTrigger
                                        value="overview"
                                        label="Overview"
                                    />
                                    <CustomTabTrigger
                                        value="students"
                                        label="Classmates"
                                    />
                                    <CustomTabTrigger
                                        value="resources"
                                        label="Library"
                                    />
                                </TabsList>
                            </div>

                            {/* Animated Tab Content Wrapper */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, x: 5 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -5 }}
                                    transition={{ duration: 0.2 }}
                                    className="mt-6"
                                >
                                    <TabsContent
                                        value="assessments"
                                        className="m-0 focus-visible:outline-none"
                                    >
                                        <AssessmentsList
                                            assessments={subject.assessments}
                                            classId={subject.class_id}
                                        />
                                    </TabsContent>

                                    <TabsContent
                                        value="overview"
                                        className="m-0 space-y-6 focus-visible:outline-none"
                                    >
                                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                            <StatCard
                                                icon={Users}
                                                label="Total Students"
                                                value="24"
                                                color="text-blue-600"
                                                bg="bg-blue-50"
                                            />
                                            <StatCard
                                                icon={BookOpen}
                                                label="Total Work"
                                                value={
                                                    subject.assessments.length
                                                }
                                                color="text-purple-600"
                                                bg="bg-purple-50"
                                            />
                                            <StatCard
                                                icon={Clock}
                                                label="Credit Hours"
                                                value="48h"
                                                color="text-amber-600"
                                                bg="bg-amber-50"
                                            />
                                            <StatCard
                                                icon={BarChart3}
                                                label="Current GPA"
                                                value="3.8"
                                                color="text-emerald-600"
                                                bg="bg-emerald-50"
                                            />
                                        </div>
                                        <PerformanceChart
                                            data={performanceData}
                                        />
                                    </TabsContent>

                                    {/* Other TabContents go here... */}
                                </motion.div>
                            </AnimatePresence>
                        </Tabs>
                    </div>

                    {/* Right Column: Sidebar - Sticky for better UX on long lists */}
                    <aside className="space-y-6 lg:sticky lg:top-8 lg:col-span-4">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-6"
                        >
                            <InstructorCard
                                name="Mr. Sok Sereyvisal"
                                title="Senior Lecturer"
                                avatar="https://images.unsplash.com/photo-1535713875002-d1d0cf3795b2?w=200&h=200&fit=crop"
                            />

                            <LogisticsCard
                                schedule="Mon & Wed • 08:00 - 10:00"
                                location="Main Campus, Lab 4"
                                credits="3.0 Credits"
                            />

                            <QuickActionsCard actions={quickActions} />

                            <div className="flex gap-3 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
                                <Info className="h-5 w-5 shrink-0 text-blue-500" />
                                <p className="text-xs leading-relaxed text-blue-700">
                                    Upcoming: Final Exam starts in 12 days.
                                    Ensure all assignments are submitted.
                                </p>
                            </div>
                        </motion.div>
                    </aside>
                </div>
            </div>
        </AppLayout>
    );
}

/**
 * Enhanced Tab Trigger with Active Indicator Motion
 */
function CustomTabTrigger({
    value,
    label,
    count,
}: {
    value: string;
    label: string;
    count?: number;
}) {
    return (
        <TabsTrigger
            value={value}
            className="group relative flex h-14 items-center justify-center rounded-none border-b-2 border-transparent bg-transparent px-5 font-medium text-slate-500 transition-all data-[state=active]:text-blue-600"
        >
            <span className="relative z-10 flex items-center gap-2">
                {label}
                {count !== undefined && (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-500 transition-colors group-data-[state=active]:bg-blue-100 group-data-[state=active]:text-blue-600">
                        {count}
                    </span>
                )}
            </span>
            {/* The Active Line underline animation */}
            <TabsTriggerIndicator value={value} />
        </TabsTrigger>
    );
}

function TabsTriggerIndicator({ value }: { value: string }) {
    return (
        <div className="absolute right-0 bottom-[-2px] left-0 h-0.5 w-full scale-x-0 bg-blue-600 transition-transform duration-300 group-data-[state=active]:scale-x-100" />
    );
}
