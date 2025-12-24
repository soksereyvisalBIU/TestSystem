import React, { useMemo } from 'react';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';

// Layout & UI
import AppLayout from '@/layouts/app-layout';
import { Tabs, TabsContent, TabsList } from '@/components/ui/tabs';

// Feature Components
import AssessmentHeader from '@/components/instructor/assessments/assessment-header';
import AssessmentMetrics from '@/components/instructor/assessments/assessment-metrics';
import QuestionCardList from '@/components/instructor/card/assessments/question-card-list';
import AnalyticsTab from '@/components/instructor/assessments/tabs/analytics-tab';
import StudentResultsTab from '@/components/instructor/assessments/tabs/student-results-tab';
import { TabTrigger } from './function/assessment-show';

interface Props {
    assessment: any;
    classId: number;
    subjectId: number;
}

export default function AssessmentDetail({
    assessment,
    classId,
    subjectId,
}: Props) {
    // 1. Core Logic: Centralized point calculation
    const totalMarks = useMemo(
        () => assessment.questions.reduce((a: number, q: any) => a + Number(q.point || 0), 0),
        [assessment.questions],
    );

    return (
        <AppLayout>
            <Head title={`Assessment | ${assessment.title}`} />

            <div className="min-h-screen bg-[#f8fafc]/50">
                {/* 1. Hero Section: Unified Header and Stats */}
                <div className="bg-white border-b border-slate-200 shadow-sm">
                    <div className="mx-auto max-w-7xl px-6 py-6">
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                        >
                            <AssessmentHeader
                                assessment={assessment}
                                totalMarks={totalMarks}
                                role="editor"
                            />
                            
                            <AssessmentMetrics
                                students={assessment.students}
                                totalMarks={totalMarks}
                                totalQuestions={assessment.questions.length}
                            />
                        </motion.div>
                    </div>
                </div>

                {/* 2. Content Section: Sticky Navigation */}
                <div className="mx-auto max-w-7xl p-6">
                    <Tabs defaultValue="students" className="w-full space-y-2">
                        <div className="sticky top-[64px] z-30 -mx-2 px-2 py-3 bg-[#f8fafc]/80 backdrop-blur-md border-b border-transparent data-[stuck]:border-slate-200 transition-colors">
                            <TabsList className="inline-flex h-12 items-center justify-start rounded-none border-b border-slate-200 bg-transparent p-0 w-full gap-8">
                                <TabTrigger value="students" className="text-sm font-semibold tracking-tight">
                                    Student Results
                                </TabTrigger>
                                <TabTrigger value="questions" className="text-sm font-semibold tracking-tight">
                                    Question Bank
                                </TabTrigger>
                                <TabTrigger value="analytics" className="text-sm font-semibold tracking-tight">
                                    Class Analytics
                                </TabTrigger>
                            </TabsList>
                        </div>

                        {/* 3. Tab Views with Framer Motion transitions */}
                        <div className="relative min-h-[500px]">
                            <TabsContent value="students" className="mt-0 focus-visible:outline-none">
                                <StudentResultsTab
                                    students={assessment.students}
                                    totalMarks={totalMarks}
                                    classId={classId}
                                    subjectId={subjectId}
                                    assessmentId={assessment.id}
                                />
                            </TabsContent>

                            <TabsContent value="questions" className="mt-0 focus-visible:outline-none">
                                <QuestionCardList
                                    assessment={assessment}
                                    classId={classId}
                                    subjectId={subjectId}
                                />
                            </TabsContent>

                            <TabsContent value="analytics" className="mt-0 focus-visible:outline-none">
                                <AnalyticsTab students={assessment.students} />
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>
            </div>
        </AppLayout>
    );
}