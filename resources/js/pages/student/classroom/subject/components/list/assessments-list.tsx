import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useCan } from '@/hooks/permission/useCan';
import { Assessment } from '@/types/student/assessment';
import { Link, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, LayoutGrid, Plus, Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { route } from 'ziggy-js';
import { AssessmentCard } from '../card/assessment-card';

interface AssessmentsListProps {
    assessments: Assessment[];
    classId: number;
    onAddNew?: () => void;
    onNavigate?: (url: string) => void;
    subjectId?: number;
}

export function AssessmentsList({
    assessments,
    classId,
    onAddNew,
    subjectId,
}: AssessmentsListProps) {
    const { url } = usePage();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const accessInstructorPage =
        useCan('access-instructor-page') && url.includes('/instructor');

    /**
     * Priority Logic & Filtering
     * 1. Resume (in_progress)
     * 2. Active (time is now and no status)
     * 3. Completed (submitted/scored)
     * 4. Closed (end_time passed)
     */
    const filteredAssessments = useMemo(() => {
        const now = new Date();

        return assessments
            .filter((assessment) =>
                assessment.title
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()),
            )
            .sort((a, b) => {
                const getPriority = (item: Assessment) => {
                    const status = item.student_assessment?.status;
                    const endTime = new Date(item.end_time);
                    const startTime = new Date(item.start_time);

                    if (now > endTime) return 4; // Closed
                    if (status === 'in_progress') return 1; // Resume
                    if (!status && now >= startTime && now <= endTime) return 2; // Active
                    if (status === 'submitted' || status === 'scored') return 3; // Completed
                    return 5; // Default/Upcoming
                };

                const priorityA = getPriority(a);
                const priorityB = getPriority(b);

                if (priorityA !== priorityB) {
                    return priorityA - priorityB;
                }

                // Secondary sort: Newest first
                return (
                    new Date(b.start_time).getTime() -
                    new Date(a.start_time).getTime()
                );
            });
    }, [assessments, searchQuery]);

    // Helper to check if item should have "Eye Catching" effects
    const isPriorityActive = (assessment: Assessment) => {
        const now = new Date();
        const startTime = new Date(assessment.start_time);
        const endTime = new Date(assessment.end_time);
        const status = assessment.student_assessment?.status;

        const isActive = now >= startTime && now <= endTime && !status;
        const isResume = status === 'in_progress';

        return isActive || isResume;
    };

    return (
        <Card className="gap-0 overflow-hidden rounded-[2rem] border border-border bg-card text-card-foreground shadow-xl shadow-black/5 dark:shadow-black/40">
            <CardHeader className="space-y-2 border-b border-border p-8 py-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                        <CardTitle className="text-2xl font-black tracking-tight text-title">
                            Subject Assessments
                        </CardTitle>
                        <CardDescription className="text-sm font-medium text-description">
                            Manage your upcoming tasks and review your
                            performance.
                        </CardDescription>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                                setIsSearchOpen(!isSearchOpen);
                                if (isSearchOpen) setSearchQuery('');
                            }}
                            className={`h-10 w-10 rounded-xl border-border transition-all ${
                                isSearchOpen
                                    ? 'bg-muted text-foreground'
                                    : 'text-muted-foreground'
                            }`}
                        >
                            {isSearchOpen ? (
                                <X className="h-4 w-4" />
                            ) : (
                                <Search className="h-4 w-4" />
                            )}
                        </Button>

                        {accessInstructorPage && (
                            <Link
                                href={route(
                                    'instructor.classes.subjects.assessments.index',
                                    { class: classId, subject: subjectId },
                                )}
                            >
                                <Button
                                    variant="secondary"
                                    className="h-10 rounded-xl border border-border bg-card font-bold text-secondary-foreground hover:bg-muted"
                                >
                                    <LayoutGrid className="mr-2 h-4 w-4 text-muted-foreground" />
                                    Manage
                                </Button>
                            </Link>
                        )}

                        {onAddNew && (
                            <Button
                                onClick={onAddNew}
                                className="h-10 rounded-xl bg-primary px-5 font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:opacity-90 active:scale-95"
                            >
                                <Plus className="mr-2 h-4 w-4 stroke-[3px]" />
                                Schedule
                            </Button>
                        )}
                    </div>
                </div>

                <AnimatePresence>
                    {isSearchOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0, marginTop: 0 }}
                            animate={{
                                height: 'auto',
                                opacity: 1,
                                marginTop: 16,
                            }}
                            exit={{ height: 0, opacity: 0, marginTop: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="relative">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search assessments by title..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="h-11 rounded-xl border-input bg-muted pl-10 focus-visible:ring-ring"
                                    autoFocus
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardHeader>

            <CardContent className="p-6">
                <AnimatePresence mode="popLayout">
                    {filteredAssessments.length > 0 ? (
                        <div className="grid gap-6">
                            {filteredAssessments.map((assessment, index) => {
                                const isUrgent = isPriorityActive(assessment);

                                return (
                                    <motion.div
                                        key={assessment.id}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                            scale: isUrgent ? [1, 1.01, 1] : 1,
                                        }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                        transition={{
                                            scale: isUrgent
                                                ? {
                                                      repeat: Infinity,
                                                      duration: 3,
                                                      ease: 'easeInOut',
                                                  }
                                                : { duration: 0.2 },
                                            delay: Math.min(index * 0.05, 0.3),
                                        }}
                                        className="relative"
                                    >
                                        {isUrgent && (
                                            <div className="absolute -inset-1.5 animate-pulse rounded-[2.2rem] bg-gradient-to-r from-primary/30 to-primary/10 blur-xl" />
                                        )}

                                        <AssessmentCard
                                            assessment={assessment}
                                            classId={classId}
                                        />

                                        {isUrgent && (
                                            <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center">
                                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-40" />
                                                <div className="relative flex h-6 w-6 items-center justify-center rounded-full border-2 border-card bg-primary text-primary-foreground shadow-lg">
                                                    <span className="text-[10px] font-black">
                                                        !
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center rounded-[1.5rem] border-2 border-dashed border-border bg-muted py-16 text-center"
                        >
                            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-card shadow-sm ring-1 ring-border">
                                <BookOpen className="h-10 w-10 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-bold text-title">
                                {searchQuery
                                    ? 'No matches found'
                                    : 'Clear Horizon'}
                            </h3>
                            <p className="mx-auto mt-1 max-w-[240px] text-sm font-medium text-description">
                                {searchQuery
                                    ? `We couldn't find anything matching "${searchQuery}"`
                                    : 'No assessments found for this subject. Enjoy the break!'}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardContent>

            {filteredAssessments.length > 0 && (
                <div className="bg-muted px-8 py-4">
                    <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                        Showing {filteredAssessments.length} of{' '}
                        {assessments.length} activities
                    </p>
                </div>
            )}
        </Card>
    );
}
