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

export default function SubjectDetail({ subject }: { subject: SubjectData }) {
    const [activeTab, setActiveTab] = React.useState('assessments');

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

            <div className="mx-auto min-h-screen max-w-7xl space-y-6 p-4 pb-20 md:p-8 md:space-y-8 bg-background text-body transition-colors duration-300">
                {/* 1. Hero Section */}
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
                            {/* Improved sticky header with horizontal scroll for xs screens */}
                            <div className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md">
                                <TabsList className="h-auto w-full justify-start gap-1 bg-transparent p-0 overflow-x-auto no-scrollbar scrollbar-hide flex-nowrap">
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

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, x: 5 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -5 }}
                                    transition={{ duration: 0.2 }}
                                    className="mt-4 md:mt-6"
                                >
                                    <TabsContent value="assessments" className="m-0 focus-visible:outline-none">
                                        <AssessmentsList
                                            assessments={subject.assessments}
                                            classId={subject.class_id}
                                        />
                                    </TabsContent>

                                    <TabsContent value="overview" className="m-0 space-y-6 focus-visible:outline-none">
                                        {/* Adjusted grid to stack on very small screens (xs) */}
                                        <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-4">
                                            <StatCard
                                                icon={Users}
                                                label="Total Students"
                                                value="24"
                                                color="text-primary"
                                                bg="bg-primary/10"
                                            />
                                            <StatCard
                                                icon={BookOpen}
                                                label="Total Work"
                                                value={subject.assessments.length}
                                                color="text-chart-3"
                                                bg="bg-chart-3/10"
                                            />
                                            <StatCard
                                                icon={Clock}
                                                label="Credit Hours"
                                                value="48h"
                                                color="text-chart-2"
                                                bg="bg-chart-2/10"
                                            />
                                            <StatCard
                                                icon={BarChart3}
                                                label="Current GPA"
                                                value="3.8"
                                                color="text-success"
                                                bg="bg-success/10"
                                            />
                                        </div>
                                        <PerformanceChart data={performanceData} />
                                    </TabsContent>
                                </motion.div>
                            </AnimatePresence>
                        </Tabs>
                    </div>

                    {/* Right Column: Sidebar */}
                    <aside className="space-y-6 lg:sticky lg:top-8 lg:col-span-4">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-6"
                        >
                            <InstructorCard
                                name="Mr. RIN CHETRA"
                                title="Lecturer"
                                avatar="/assets/img/profile/rinchetra.jpg"
                            />

                            <LogisticsCard
                                schedule="Mon & Wed • 08:00 - 10:00"
                                location="Main Campus, Lab 4"
                                credits="3.0 Credits"
                            />

                            <QuickActionsCard actions={quickActions} />

                            <div className="flex gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
                                <Info className="h-5 w-5 shrink-0 text-primary" />
                                <p className="text-xs leading-relaxed text-body">
                                    <span className="font-semibold text-title">Upcoming:</span> Final Exam starts in 12 days.
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

function CustomTabTrigger({ value, label, count }: { value: string; label: string; count?: number }) {
    return (
        <TabsTrigger
            value={value}
            // Use whitespace-nowrap and smaller px for xs screens
            className="group relative flex h-14 items-center justify-center rounded-none border-b-2 border-transparent bg-transparent px-3 xs:px-4 md:px-5 font-medium text-muted-foreground transition-all data-[state=active]:text-primary whitespace-nowrap"
        >
            <span className="relative z-10 flex items-center gap-2 text-sm md:text-base">
                {label}
                {count !== undefined && (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] md:text-[11px] font-bold text-muted-foreground transition-colors group-data-[state=active]:bg-primary/10 group-data-[state=active]:text-primary">
                        {count}
                    </span>
                )}
            </span>
            <TabsTriggerIndicator />
        </TabsTrigger>
    );
}

function TabsTriggerIndicator() {
    return (
        <div className="absolute right-0 bottom-[-2px] left-0 h-0.5 w-full scale-x-0 bg-primary transition-transform duration-300 group-data-[state=active]:scale-x-100" />
    );
}