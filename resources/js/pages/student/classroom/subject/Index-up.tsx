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
import { StatCard } from './components/card/stat-card';
import { PerformanceChart } from './components/chart/performance-chart';
import { AssessmentsList } from './components/list/assessments-list';
import { StudentList } from './components/list/students-list';
import { SubjectHero } from './components/subject-hero';

export default function SubjectDetail({
    subject,
    classmates,
}: {
    subject: SubjectData;
    classmates: any[];
}) {
    const [activeTab, setActiveTab] = React.useState('assessments');

    // Dynamically calculate performance (using average score of assessments if available)
    // Fallback to placeholder if no scores exist yet
    const performanceData = subject.assessments?.map(a => a.score || 0).length > 0 
        ? subject.assessments.map(a => a.score || 0) 
        : [0, 0, 0, 0];

    return (
        <AppLayout>
            <Head title={`${subject?.name || 'Subject'} | Student Portal`} />

            <div className="mx-auto min-h-screen max-w-7xl space-y-6 bg-background p-4 pb-20 text-body transition-colors duration-300 md:space-y-8 md:p-8">
                {/* 1. Hero Section - Dynamic */}
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
                            value={activeTab}
                            onValueChange={setActiveTab}
                            className="w-full"
                        >
                            <div className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md">
                                <TabsList className="no-scrollbar scrollbar-hide h-auto w-full flex-nowrap justify-start gap-1 overflow-x-auto bg-transparent p-0">
                                    <CustomTabTrigger
                                        value="assessments"
                                        label="Assessments"
                                        count={subject.assessments?.length || 0}
                                    />
                                    <CustomTabTrigger
                                        value="students"
                                        label="Classmates"
                                        count={classmates?.length || 0}
                                    />
                                    <CustomTabTrigger
                                        value="overview"
                                        label="Overview"
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
                                        <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-4">
                                            <StatCard
                                                icon={Users}
                                                label="Total Students"
                                                value={classmates.length}
                                                color="text-primary"
                                                bg="bg-primary/10"
                                            />
                                            <StatCard
                                                icon={BookOpen}
                                                label="Total Assessments"
                                                value={subject.assessments.length}
                                                color="text-chart-3"
                                                bg="bg-chart-3/10"
                                            />
                                            <StatCard
                                                icon={Clock}
                                                label="Credit Hours"
                                                value={`${subject.credit_hours || '0'}h`}
                                                color="text-chart-2"
                                                bg="bg-chart-2/10"
                                            />
                                            <StatCard
                                                icon={BarChart3}
                                                label="Grade"
                                                value={subject.grade || 'N/A'}
                                                color="text-success"
                                                bg="bg-success/10"
                                            />
                                        </div>
                                        <PerformanceChart data={performanceData} />
                                    </TabsContent>

                                    <TabsContent value="students" className="m-0 focus-visible:outline-none">
                                        <StudentList students={classmates} />
                                    </TabsContent>

                                    <TabsContent value="resources" className="m-0 focus-visible:outline-none">
                                        <div className="rounded-lg border border-border p-6 text-center text-sm text-slate-500">
                                            <BookOpen className="mx-auto mb-4 size-12 text-slate-400" />
                                            Library resources for {subject.name} are coming soon!
                                        </div>
                                    </TabsContent>
                                </motion.div>
                            </AnimatePresence>
                        </Tabs>
                    </div>

                    {/* Right Column: Sidebar - Dynamic */}
                    <aside className="space-y-6 lg:sticky lg:top-8 lg:col-span-4">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-6"
                        >
                            <InstructorCard
                                name={subject.teacher?.name || "Unassigned"}
                                title={subject.teacher?.title || "Lecturer"}
                                avatar={subject.teacher?.avatar || "/assets/img/profile/default.jpg"}
                            />

                            <LogisticsCard
                                schedule={subject.schedule || "Schedule TBD"}
                                location={subject.room || "Room TBD"}
                                credits={`${subject.credit || '0.0'} Credits`}
                            />

                            {/* Dynamic Alert for next due date */}
                            {subject.upcoming_assessment && (
                                <div className="flex gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
                                    <Info className="h-5 w-5 shrink-0 text-primary" />
                                    <p className="text-xs leading-relaxed text-body">
                                        <span className="font-semibold text-title">
                                            Upcoming:
                                        </span>{' '}
                                        {subject.upcoming_assessment.name} is due on {subject.upcoming_assessment.due_date}.
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    </aside>
                </div>
            </div>
        </AppLayout>
    );
}

// ... CustomTabTrigger and TabsTriggerIndicator remain the same

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
            // Use whitespace-nowrap and smaller px for xs screens
            className="group relative flex h-14 items-center justify-center rounded-none border-b-2 border-transparent bg-transparent px-3 font-medium whitespace-nowrap text-muted-foreground transition-all data-[state=active]:text-primary xs:px-4 md:px-5"
        >
            <span className="relative z-10 flex items-center gap-2 text-sm md:text-base">
                {label}
                {count !== undefined && (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground transition-colors group-data-[state=active]:bg-primary/10 group-data-[state=active]:text-primary md:text-[11px]">
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
