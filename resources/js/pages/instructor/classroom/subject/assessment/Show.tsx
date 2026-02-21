import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useMemo } from 'react';

// Layout & UI
import { Tabs, TabsContent, TabsList } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';

// Feature Components
import AssessmentHeader from '@/components/instructor/assessments/assessment-header';
import AssessmentMetrics from '@/components/instructor/assessments/assessment-metrics';
import AnalyticsTab from '@/components/instructor/assessments/tabs/analytics-tab';
import StudentResultsTab from '@/components/instructor/assessments/tabs/student-results-tab';
import QuestionCardList from '@/components/instructor/card/assessments/question-card-list';
import { TabTrigger } from './function/assessment-show';

interface Props {
    assessment: {
        id: number;
        title: string;
        questions: Array<{ point: string | number }>;
        student_assessment_attempts: any[];
    };
    classId: number;
    subjectId: number;
}

export default function AssessmentDetail({
    assessment,
    classId,
    subjectId,
}: Props) {
    
    // 1. Core Logic: Centralized point calculation (Performance Optimized)
    const totalMarks = useMemo(
        () =>
            assessment.questions.reduce(
                (acc: number, q: any) => acc + Number(q.point || 0),
                0,
            ),
        [assessment.questions],
    );

    return (
        <AppLayout>
            <Head title={`Assessment | ${assessment.title}`} />

            <div className="min-h-screen bg-background/60">
                {/* 1. Hero Section */}
                <div className="border-b border-border bg-card shadow-sm">
                    <div className="mx-auto max-w-7xl px-6 py-6">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className="space-y-4"
                        >
                            <AssessmentHeader
                                assessment={assessment}
                                totalMarks={totalMarks}
                                role="editor"
                            />

                            <AssessmentMetrics
                                attempts={assessment.student_assessment_attempts}
                                totalMarks={totalMarks}
                                totalQuestions={assessment.questions.length}
                            />
                        </motion.div>
                    </div>
                </div>

                {/* 2. Content Section */}
                <div className="mx-auto max-w-7xl p-6">
                    <Tabs defaultValue="students" className="w-full space-y-2">
                        {/* Sticky Tabs with Glassmorphism for Speed/Perception */}
                        <div className="sticky top-[64px] z-30 -mx-2 border-b border-transparent bg-background/80 px-2 py-3 backdrop-blur-md transition-all">
                            <TabsList className="inline-flex h-12 w-full items-center justify-start gap-8 rounded-none border-b border-border bg-transparent p-0">
                                <TabTrigger
                                    value="students"
                                    className="text-sm font-semibold tracking-tight text-body data-[state=active]:text-primary"
                                >
                                    Student Results
                                </TabTrigger>

                                <TabTrigger
                                    value="questions"
                                    className="text-sm font-semibold tracking-tight text-body data-[state=active]:text-primary"
                                >
                                    Question Bank
                                </TabTrigger>

                                <TabTrigger
                                    value="analytics"
                                    className="text-sm font-semibold tracking-tight text-body data-[state=active]:text-primary"
                                >
                                    Class Analytics
                                </TabTrigger>
                            </TabsList>
                        </div>

                        {/* 3. Tab Content - Optimized with min-height to prevent layout jumps */}
                        <div className="relative mt-4 min-h-[500px]">
                            <TabsContent
                                value="students"
                                className="mt-0 focus-visible:outline-none"
                            >
                                <StudentResultsTab
                                    students={assessment.student_assessment_attempts}
                                    totalMarks={totalMarks}
                                    classId={classId}
                                    subjectId={subjectId}
                                    assessmentId={assessment.id}
                                />
                            </TabsContent>

                            <TabsContent
                                value="questions"
                                className="mt-0 focus-visible:outline-none"
                            >
                                <QuestionCardList
                                    assessment={assessment}
                                    classId={classId}
                                    subjectId={subjectId}
                                />
                            </TabsContent>

                            <TabsContent
                                value="analytics"
                                className="mt-0 focus-visible:outline-none"
                            >
                                <AnalyticsTab 
                                    students={assessment.student_assessment_attempts} 
                                />
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>
            </div>
        </AppLayout>
    );
}