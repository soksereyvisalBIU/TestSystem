import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useMemo, useCallback } from 'react';

// Types & Icons
import { SubjectData } from '@/types/student/assessment';
import {
    BarChart3,
    BookOpen,
    Clock,
    Info,
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

    // Memoize static data to prevent re-calculations
    const performanceData = useMemo(() => [40, 65, 55, 80, 72, 90, 83], []);
    
    const handleViewReports = useCallback(() => {
        setActiveTab('overview');
    }, []);

    return (
        <AppLayout>
            <Head title={`${subject?.name} | Student Portal`} />

            <div className="mx-auto min-h-screen max-w-7xl space-y-6 bg-background p-4 pb-20 transition-colors duration-300 md:space-y-8 md:p-8">
                
                {/* 1. Hero Section - Hardware Accelerated */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="transform-gpu"
                >
                    <SubjectHero
                        {...subject}
                        onViewReports={handleViewReports}
                    />
                </motion.div>

                <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
                    {/* Left Column: Content */}
                    <div className="space-y-6 lg:col-span-8">
                        <Tabs
                            value={activeTab}
                            onValueChange={setActiveTab}
                            className="w-full"
                        >
                            <div className="sticky top-0 z-40 border-b border-border bg-background/60 backdrop-blur-xl">
                                <TabsList className="no-scrollbar flex h-auto w-full justify-start gap-1 overflow-x-auto bg-transparent p-0">
                                    <CustomTabTrigger
                                        value="assessments"
                                        label="Assessments"
                                        count={subject.assessments.length}
                                    />
                                    <CustomTabTrigger
                                        value="students"
                                        label="Classmates"
                                        count={classmates.length}
                                    />
                                    <CustomTabTrigger
                                        value="overview"
                                        label="Performance"
                                    />
                                    <CustomTabTrigger
                                        value="resources"
                                        label="Library"
                                    />
                                </TabsList>
                            </div>

                            <AnimatePresence mode="wait" initial={false}>
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2, ease: "easeInOut" }}
                                    className="mt-6 transform-gpu will-change-transform"
                                >
                                    <TabsContent value="assessments" className="m-0 border-none p-0">
                                        <AssessmentsList
                                            assessments={subject.assessments}
                                            classId={subject.class_id}
                                        />
                                    </TabsContent>

                                    <TabsContent value="overview" className="m-0 space-y-8 border-none p-0">
                                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                            <StatCard icon={Users} label="Students" value={classmates.length} color="text-primary" bg="bg-primary/10" />
                                            <StatCard icon={BookOpen} label="Tasks" value={subject.assessments.length} color="text-blue-500" bg="bg-blue-500/10" />
                                            <StatCard icon={Clock} label="Credits" value="3.0" color="text-amber-500" bg="bg-amber-500/10" />
                                            <StatCard icon={BarChart3} label="GPA" value="3.8" color="text-emerald-500" bg="bg-emerald-500/10" />
                                        </div>
                                        <PerformanceChart data={performanceData} />
                                    </TabsContent>

                                    <TabsContent value="students" className="m-0 border-none p-0">
                                        <StudentList students={classmates} />
                                    </TabsContent>

                                    <TabsContent value="resources" className="m-0 border-none p-0">
                                        <div className="flex flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-border py-20 text-center">
                                            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
                                                <BookOpen className="size-8 text-muted-foreground" />
                                            </div>
                                            <h3 className="text-lg font-bold">Library Coming Soon</h3>
                                            <p className="text-sm text-muted-foreground">Digital textbooks and resources are being indexed.</p>
                                        </div>
                                    </TabsContent>
                                </motion.div>
                            </AnimatePresence>
                        </Tabs>
                    </div>

                    {/* Right Column: Sticky Sidebar */}
                    <aside className="space-y-6 lg:sticky lg:top-8 lg:col-span-4">
                        <motion.div
                            layout
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.15, duration: 0.4 }}
                            className="space-y-6"
                        >
                            <InstructorCard
                                name="Mr. RIN CHETRA"
                                title="Lead Lecturer"
                                avatar="/assets/img/profile/rinchetra.jpg"
                            />

                            <LogisticsCard
                                schedule="Mon & Wed • 08:00 - 10:00"
                                location="Lab 4, Innovation Center"
                                credits="3.0 Credits"
                            />

                            <div className="group flex gap-4 rounded-[2rem] border border-primary/10 bg-primary/5 p-6 transition-all hover:bg-primary/[0.08]">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary">
                                    <Info className="size-5" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-primary uppercase tracking-wider">Upcoming</p>
                                    <p className="text-sm leading-relaxed text-muted-foreground">
                                        <span className="font-bold text-foreground">Final Exam</span> starts in 12 days. Complete your lab submissions by Friday.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </aside>
                </div>
            </div>
        </AppLayout>
    );
}

// Optimized Tab Trigger with Layout Projection
const CustomTabTrigger = React.memo(({
    value,
    label,
    count,
}: {
    value: string;
    label: string;
    count?: number;
}) => (
    <TabsTrigger
        value={value}
        className="group relative flex h-14 items-center justify-center rounded-none border-b-2 border-transparent bg-transparent px-4 font-bold whitespace-nowrap text-muted-foreground transition-all data-[state=active]:text-primary"
    >
        <span className="relative z-10 flex items-center gap-2 text-sm tracking-tight">
            {label}
            {count !== undefined && (
                <span className="rounded-lg bg-muted px-2 py-0.5 text-[10px] font-black transition-colors group-data-[state=active]:bg-primary group-data-[state=active]:text-white">
                    {count}
                </span>
            )}
        </span>
        <div className="absolute bottom-[-2px] left-0 h-0.5 w-full scale-x-0 bg-primary transition-transform duration-300 ease-out group-data-[state=active]:scale-x-100" />
    </TabsTrigger>
));

CustomTabTrigger.displayName = 'CustomTabTrigger';