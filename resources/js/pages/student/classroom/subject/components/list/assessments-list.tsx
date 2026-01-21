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
import { useMemo, useState, useCallback } from 'react';
import { route } from 'ziggy-js';
import { AssessmentCard } from '../card/assessment-card';

interface AssessmentsListProps {
    assessments: Assessment[];
    classId: number;
    onAddNew?: () => void;
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

    const accessInstructorPage = useCan('access-instructor-page') && url.includes('/instructor');

    // Optimization: High-performance sorting and filtering
    const filteredAssessments = useMemo(() => {
        const nowMs = Date.now(); // Use timestamp for faster comparison
        const query = searchQuery.toLowerCase().trim();

        return assessments
            .filter((a) => !query || a.title.toLowerCase().includes(query))
            .sort((a, b) => {
                const getPriority = (item: Assessment) => {
                    const status = item.student_assessment?.status;
                    const startMs = new Date(item.start_time).getTime();
                    const endMs = new Date(item.end_time).getTime();

                    if (nowMs > endMs) return 4; // Closed
                    if (status === 'in_progress') return 1; // Resume (Highest Priority)
                    if (!status && nowMs >= startMs && nowMs <= endMs) return 2; // Active
                    if (status === 'submitted' || status === 'scored') return 3; // Completed
                    return 5;
                };

                const priorityA = getPriority(a);
                const priorityB = getPriority(b);

                if (priorityA !== priorityB) return priorityA - priorityB;
                
                // Secondary sort: Newest first
                return new Date(b.start_time).getTime() - new Date(a.start_time).getTime();
            });
    }, [assessments, searchQuery]);

    const toggleSearch = useCallback(() => {
        setIsSearchOpen((prev) => !prev);
        if (isSearchOpen) setSearchQuery('');
    }, [isSearchOpen]);

    return (
        <Card className="overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] border-border/60 bg-card/40 shadow-2xl shadow-black/5 backdrop-blur-md gap-0 py-0">
            <CardHeader className="space-y-4 border-b border-border/40 p-6 py-3 sm:p-8 sm:py-6">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="hidden rounded-2xl bg-primary/10 p-3 sm:block">
                            <Newspaper className="h-6 w-6 text-primary" />
                        </div>
                        <div className="space-y-0.5">
                            <CardTitle className="text-xl font-black tracking-tight text-title sm:text-2xl">
                                Assessments
                            </CardTitle>
                            <CardDescription className="hidden text-xs font-medium text-description sm:block">
                                Manage assignments and upcoming deadlines.
                            </CardDescription>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={toggleSearch}
                            className={`h-10 w-10 rounded-xl border-border/80 transition-all sm:h-12 sm:w-12 sm:rounded-2xl ${
                                isSearchOpen ? 'bg-primary text-primary-foreground' : 'bg-background'
                            }`}
                        >
                            {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
                        </Button>

                        {accessInstructorPage && (
                            <Link href={route('instructor.classes.subjects.assessments.index', { class: classId, subject: subjectId })}>
                                <Button variant="secondary" className="h-10 rounded-xl border border-border/50 bg-background font-bold sm:h-12 sm:rounded-2xl">
                                    <LayoutGrid className="mr-2 h-4 w-4" />
                                    Manage
                                </Button>
                            </Link>
                        )}

                        {onAddNew && (
                            <Button
                                onClick={onAddNew}
                                className="h-10 rounded-xl bg-primary px-4 font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-transform active:scale-95 sm:h-12 sm:rounded-2xl sm:px-6"
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
                            initial={{ height: 0, opacity: 0, marginTop: 0 }}
                            animate={{ height: 'auto', opacity: 1, marginTop: 8 }}
                            exit={{ height: 0, opacity: 0, marginTop: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="relative">
                                <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search by title..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="h-12 rounded-xl border-none bg-muted/40 pl-11 font-medium focus-visible:ring-2 focus-visible:ring-primary sm:rounded-2xl"
                                    autoFocus
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardHeader>

            <CardContent className="p-4 sm:p-8">
                <div className="grid gap-4 sm:gap-6">
                    <AnimatePresence mode="popLayout" initial={false}>
                        {filteredAssessments.length > 0 ? (
                            filteredAssessments.map((assessment) => (
                                <motion.div
                                    key={assessment.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    transition={{ duration: 0.2 }}
                                    className="transform-gpu"
                                >
                                    <AssessmentCard
                                        assessment={assessment}
                                        classId={classId}
                                    />
                                </motion.div>
                            ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center py-16 text-center"
                            >
                                <div className="mb-4 flex size-20 items-center justify-center rounded-[2rem] bg-muted/50">
                                    <BookOpen className="h-10 w-10 text-muted-foreground/40" />
                                </div>
                                <h3 className="text-lg font-bold text-title">No matching assessments</h3>
                                <p className="text-sm text-description">Adjust your search to find what you're looking for.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </CardContent>
        </Card>
    );
}