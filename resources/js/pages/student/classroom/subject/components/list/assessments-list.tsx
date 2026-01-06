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
import { BookOpen, LayoutGrid, Newspaper, Plus, Search, X } from 'lucide-react';
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
                    if (status === 'in_progress') return 1; // Resume (Highest Priority)
                    if (!status && now >= startTime && now <= endTime) return 2; // Active
                    if (status === 'submitted' || status === 'scored') return 3; // Completed
                    return 5;
                };

                const priorityA = getPriority(a);
                const priorityB = getPriority(b);

                if (priorityA !== priorityB) return priorityA - priorityB;
                return (
                    new Date(b.start_time).getTime() -
                    new Date(a.start_time).getTime()
                );
            });
    }, [assessments, searchQuery]);

    return (
        <Card className="overflow-hidden rounded-[2.5rem] border border-border bg-card/50 py-0 shadow-2xl shadow-black/5 backdrop-blur-sm">
            <CardHeader className="space-y-4 border-b border-border/50 p-8 py-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                        <CardTitle className="flex items-center gap-3 text-2xl font-black tracking-tight text-title">
                            <div className="rounded-xl bg-primary/10 p-2">
                                <Newspaper className="h-6 w-6 text-primary" />
                            </div>
                            Subject Assessments
                        </CardTitle>
                        <CardDescription className="text-sm font-medium text-description">
                            Track your progress and upcoming deadlines.
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
                            className={`h-11 w-11 rounded-2xl border-border transition-all ${
                                isSearchOpen
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-card'
                            }`}
                        >
                            {isSearchOpen ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Search className="h-5 w-5" />
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
                                    className="h-11 rounded-2xl border border-border bg-card font-bold"
                                >
                                    <LayoutGrid className="mr-2 h-4 w-4" />
                                    Manage
                                </Button>
                            </Link>
                        )}

                        {onAddNew && (
                            <Button
                                onClick={onAddNew}
                                className="h-11 rounded-2xl bg-primary px-6 font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
                            >
                                <Plus className="mr-2 h-5 w-5 stroke-[3px]" />
                                New
                            </Button>
                        )}
                    </div>
                </div>

                <AnimatePresence>
                    {isSearchOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="relative pt-2">
                                <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search by title..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="h-12 rounded-2xl border-none bg-muted/50 pl-11 focus-visible:ring-2 focus-visible:ring-primary"
                                    autoFocus
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardHeader>

            <CardContent className="p-8 pt-0">
                <div className="grid gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredAssessments.length > 0 ? (
                            filteredAssessments.map((assessment) => (
                                <AssessmentCard
                                    key={assessment.id}
                                    assessment={assessment}
                                    classId={classId}
                                />
                            ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center py-20 text-center"
                            >
                                <div className="mb-4 rounded-[2rem] bg-muted p-6">
                                    <BookOpen className="h-12 w-12 text-muted-foreground/50" />
                                </div>
                                <h3 className="text-xl font-bold text-title">
                                    No Assessments Found
                                </h3>
                                <p className="max-w-[280px] text-description">
                                    Try adjusting your search or check back
                                    later.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </CardContent>
        </Card>
    );
}
