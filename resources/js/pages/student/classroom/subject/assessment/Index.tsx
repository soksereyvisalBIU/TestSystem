import AssessmentModal from '@/components/instructor/modal/assessment-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Edit2Icon, GridIcon, ListIcon, PlusIcon } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Class', href: '/' },
    { title: 'Subjects', href: '/subjects' },
    { title: 'Assessments', href: '/assessments' },
];

const STATUS_COLORS: Record<string, string> = {
    upcoming: 'bg-blue-600 shadow-blue-500/20',
    ongoing: 'bg-emerald-600 shadow-emerald-500/20',
    closed: 'bg-rose-600 shadow-rose-500/20',
    unknown: 'bg-slate-500',
};

export default function AssessmentPage({ subject }: { subject: any }) {
    const role = 'editor';
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [openAssessmentModal, setOpenAssessmentModal] = useState(false);

    const classId = subject?.class_id;
    const subjectId = subject?.id;

    // PERFORMANCE: Memoize the status calculation for the entire list at once
    const assessmentsWithStatus = useMemo(() => {
        const now = Date.now();
        return (subject?.assessments || []).map((a: any) => {
            const start = a.start_time
                ? new Date(a.start_time).getTime()
                : null;
            const end = a.end_time ? new Date(a.end_time).getTime() : null;

            let status = 'unknown';
            if (start && now < start) status = 'upcoming';
            else if (start && end && now >= start && now <= end)
                status = 'ongoing';
            else if (end && now > end) status = 'closed';

            return { ...a, computedStatus: status };
        });
    }, [subject?.assessments]);

    // PERFORMANCE: Memoize filtering to avoid expensive re-renders
    const filtered = useMemo(() => {
        if (statusFilter === 'all') return assessmentsWithStatus;
        return assessmentsWithStatus.filter(
            (a: any) => a.computedStatus === statusFilter,
        );
    }, [assessmentsWithStatus, statusFilter]);

    const onEdit = useCallback((a: any) => {
        toast.info(`Edit mode for: ${a.title}`);
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${subject?.name || 'Assessments'} - Dashboard`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="overflow-hidden rounded-[2rem] border bg-card p-6 shadow-sm">
                    {/* Header Section */}
                    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h2 className="text-3xl font-black tracking-tight text-title">
                                Assessments
                            </h2>
                            <p className="text-sm font-medium text-description">
                                Manage and monitor student examinations.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <Select
                                value={statusFilter}
                                onValueChange={setStatusFilter}
                            >
                                <SelectTrigger className="w-[160px] rounded-xl font-bold">
                                    <SelectValue placeholder="Filter status" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="all">
                                        All Statuses
                                    </SelectItem>
                                    <SelectItem value="ongoing">
                                        Active Now
                                    </SelectItem>
                                    <SelectItem value="upcoming">
                                        Upcoming
                                    </SelectItem>
                                    <SelectItem value="closed">
                                        Closed
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            <ToggleGroup
                                type="single"
                                value={viewMode}
                                onValueChange={(v) =>
                                    v && setViewMode(v as 'list' | 'grid')
                                }
                                className="rounded-xl bg-muted/50 p-1"
                            >
                                <ToggleGroupItem
                                    value="list"
                                    className="rounded-lg px-3"
                                >
                                    <ListIcon className="h-4 w-4" />
                                </ToggleGroupItem>
                                <ToggleGroupItem
                                    value="grid"
                                    className="rounded-lg px-3"
                                >
                                    <GridIcon className="h-4 w-4" />
                                </ToggleGroupItem>
                            </ToggleGroup>

                            {role === 'editor' && (
                                <Button
                                    onClick={() => setOpenAssessmentModal(true)}
                                    className="gap-2 rounded-xl bg-primary px-5 font-bold shadow-lg shadow-primary/20 transition-transform hover:scale-105"
                                >
                                    <PlusIcon className="h-4 w-4" /> New Exam
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Content Grid/List */}
                    <AnimatePresence mode="popLayout">
                        {filtered.length > 0 ? (
                            <motion.div
                                layout
                                className={
                                    viewMode === 'grid'
                                        ? 'grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'
                                        : 'flex flex-col gap-3'
                                }
                            >
                                {filtered.map((a: any) => (
                                    <motion.div
                                        key={a.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className={`group relative rounded-2xl border bg-muted/10 p-5 transition-all hover:bg-muted/30 hover:shadow-xl ${
                                            viewMode === 'list'
                                                ? 'flex items-center justify-between'
                                                : ''
                                        }`}
                                    >
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                                <Badge
                                                    className={`${STATUS_COLORS[a.computedStatus]} border-none text-[10px] font-black tracking-wider text-white uppercase shadow-sm`}
                                                >
                                                    {a.computedStatus}
                                                </Badge>
                                            </div>

                                            <div>
                                                <h3 className="text-lg font-black tracking-tight text-title transition-colors group-hover:text-primary">
                                                    {a.title}
                                                </h3>
                                                <p className="text-xs font-bold text-description/80">
                                                    {new Date(
                                                        a.start_time,
                                                    ).toLocaleDateString()}{' '}
                                                    • {a.questions_count ?? 0}{' '}
                                                    Questions
                                                </p>
                                            </div>

                                            <Link
                                                href={route(
                                                    'instructor.classes.subjects.assessments.show',
                                                    [classId, subjectId, a.id],
                                                )}
                                                className="inline-flex text-xs font-black tracking-widest text-primary uppercase underline-offset-4 hover:underline"
                                            >
                                                View Details
                                            </Link>
                                        </div>

                                        {role === 'editor' && (
                                            <Button
                                                variant="secondary"
                                                size="icon"
                                                onClick={() => onEdit(a)}
                                                className="absolute top-4 right-4 h-9 w-9 rounded-xl opacity-0 shadow-sm transition-all group-hover:opacity-100"
                                            >
                                                <Edit2Icon className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center py-20 text-center"
                            >
                                <div className="mb-4 rounded-full bg-muted p-4">
                                    <GridIcon className="h-8 w-8 text-muted-foreground/40" />
                                </div>
                                <p className="font-black text-title">
                                    No assessments found
                                </p>
                                <p className="text-sm text-description">
                                    Adjust your filters or create a new
                                    assessment.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <AssessmentModal
                isOpen={openAssessmentModal}
                setIsOpen={setOpenAssessmentModal}
                classId={classId}
                subjectId={subjectId}
            />
        </AppLayout>
    );
}
