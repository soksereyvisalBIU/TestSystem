import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
    const { props, url } = usePage();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Access authorization from Inertia shared props
    const accessInstructorPage =
        props.auth.can['access-instructor-page'] && url.includes('/instructor');
    // Memoized filtering for performance
    const filteredAssessments = useMemo(() => {
        return assessments.filter((assessment) =>
            assessment.title.toLowerCase().includes(searchQuery.toLowerCase()),
        );
    }, [assessments, searchQuery]);

    return (
        <Card className="overflow-hidden rounded-[2rem] border-none bg-white shadow-xl shadow-slate-200/50">
            <CardHeader className="space-y-6 border-b border-slate-50 p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                        <CardTitle className="text-2xl font-black tracking-tight text-slate-900">
                            Subject Assessments
                        </CardTitle>
                        <CardDescription className="text-sm font-medium text-slate-500">
                            Manage your upcoming tasks and review your
                            performance.
                        </CardDescription>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Search Toggle */}
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                                setIsSearchOpen(!isSearchOpen);
                                if (isSearchOpen) setSearchQuery('');
                            }}
                            className={`h-10 w-10 rounded-xl border-slate-200 transition-all ${
                                isSearchOpen
                                    ? 'bg-slate-100 text-slate-900'
                                    : 'text-slate-500'
                            }`}
                        >
                            {isSearchOpen ? (
                                <X className="h-4 w-4" />
                            ) : (
                                <Search className="h-4 w-4" />
                            )}
                        </Button>

                        {/* Instructor Management Link */}
                        {accessInstructorPage && (
                            <Link
                                href={route(
                                    'instructor.classes.subjects.assessments.index',
                                    {
                                        class: classId,
                                        subject: subjectId,
                                    },
                                )}
                            >
                                <Button
                                    variant="secondary"
                                    className="h-10 rounded-xl border border-slate-200 bg-white font-bold text-slate-700 shadow-sm hover:bg-slate-50"
                                >
                                    <LayoutGrid className="mr-2 h-4 w-4 text-slate-400" />
                                    Manage
                                </Button>
                            </Link>
                        )}

                        {/* Primary Action */}
                        {onAddNew && (
                            <Button
                                onClick={onAddNew}
                                className="h-10 rounded-xl bg-blue-600 px-5 font-bold shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 hover:shadow-blue-300 active:scale-95"
                            >
                                <Plus className="mr-2 h-4 w-4 stroke-[3px]" />
                                Schedule
                            </Button>
                        )}
                    </div>
                </div>

                {/* Inline Search Input */}
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
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <Input
                                    placeholder="Search assessments by title..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="h-11 rounded-xl border-slate-100 bg-slate-50/50 pl-10 focus-visible:ring-blue-500"
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
                        <div className="grid gap-4">
                            {filteredAssessments.map((assessment, index) => (
                                <motion.div
                                    key={assessment.id}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    transition={{
                                        duration: 0.2,
                                        delay: Math.min(index * 0.05, 0.3),
                                    }}
                                >
                                    <AssessmentCard
                                        assessment={assessment}
                                        classId={classId}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center rounded-[1.5rem] border-2 border-dashed border-slate-100 bg-slate-50/50 py-16 text-center"
                        >
                            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-sm ring-1 ring-slate-200/50">
                                <BookOpen className="h-10 w-10 text-slate-300" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">
                                {searchQuery
                                    ? 'No matches found'
                                    : 'Clear Horizon'}
                            </h3>
                            <p className="mx-auto mt-1 max-w-[240px] text-sm font-medium text-slate-400">
                                {searchQuery
                                    ? `We couldn't find anything matching "${searchQuery}"`
                                    : 'No assessments found for this subject. Enjoy the break!'}
                            </p>
                            {onAddNew && !searchQuery && (
                                <Button
                                    variant="link"
                                    className="mt-4 font-bold text-blue-600"
                                    onClick={onAddNew}
                                >
                                    Create first assessment
                                </Button>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardContent>

            {/* List Footer Info */}
            {filteredAssessments.length > 0 && (
                <div className="bg-slate-50/50 px-8 py-4">
                    <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                        Showing {filteredAssessments.length} of{' '}
                        {assessments.length} activities
                    </p>
                </div>
            )}
        </Card>
    );
}
