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
import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Edit2Icon, GridIcon, ListIcon, PlusIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Class', href: '/' },
    { title: 'Subjects', href: '/subjects' },
    { title: 'Assessments', href: '/assessments' },
];

export default function AssessmentPage({ subject }: { subject: any }) {
    const role = 'editor'; // simulate role
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
    const [statusFilter, setStatusFilter] = useState<'all' | string>('all');

    const [openAssessmentModal, setOpenAssessmentModal] = useState(false);

    const { flash } = usePage().props as {
        flash?: { success?: string; error?: string };
    };

    const classId = subject.class_id;
    const subjectId = subject.id;

    console.log('Subject Data:', subject);

    // Show flash messages
    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    // ---- REAL BACKEND DATA ----
    const assessments = subject.assessments || [];

    // If you want to compute statuses automatically, you can enhance here.
    // For now we assume status is included or fallback to 'active'.
    const filtered =
        statusFilter === 'all'
            ? assessments
            : assessments.filter((a: any) => a.status === statusFilter);

    const isLoading = false;

    const onEdit = (a: any) => {
        toast.info('Edit mode not implemented yet: ' + a.title);
    };

    const getAssessmentStatus = (start: string | null, end: string | null) => {
        const now = new Date();

        const startTime = start ? new Date(start) : null;
        const endTime = end ? new Date(end) : null;

        if (startTime && now < startTime) return 'upcoming';
        if (startTime && endTime && now >= startTime && now <= endTime)
            return 'ongoing';
        if (endTime && now > endTime) return 'closed';

        return 'unknown';
    };
    const statusColors: Record<string, string> = {
        upcoming: 'bg-blue-500',
        ongoing: 'bg-green-500',
        closed: 'bg-red-500',
        unknown: 'bg-gray-500',
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Assessments" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="rounded-xl border p-5 shadow-sm">
                    {/* Header */}
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <h2 className="text-xl font-bold">Assessments</h2>

                        <div className="flex items-center gap-3">
                            {/* Status Filter */}
                            <Select
                                value={statusFilter}
                                onValueChange={(v) => setStatusFilter(v)}
                            >
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="Filter status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">
                                        Active
                                    </SelectItem>
                                    <SelectItem value="upcoming">
                                        Upcoming
                                    </SelectItem>
                                    <SelectItem value="closed">
                                        Closed
                                    </SelectItem>
                                    <SelectItem value="all">All</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Switch View */}
                            <ToggleGroup
                                type="single"
                                value={viewMode}
                                onValueChange={(v) => v && setViewMode(v)}
                            >
                                <ToggleGroupItem
                                    value="list"
                                    aria-label="List view"
                                >
                                    <ListIcon className="h-4 w-4" />
                                </ToggleGroupItem>

                                <ToggleGroupItem
                                    value="grid"
                                    aria-label="Grid view"
                                >
                                    <GridIcon className="h-4 w-4" />
                                </ToggleGroupItem>
                            </ToggleGroup>

                            {role === 'editor' && (
                                <Button
                                    onClick={() => setOpenAssessmentModal(true)}
                                    className="gap-2"
                                >
                                    <PlusIcon className="h-4 w-4" /> New
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Loading */}
                    {isLoading && (
                        <p className="py-6 text-center text-sm text-gray-500">
                            Loading assessments...
                        </p>
                    )}

                    {/* Content */}
                    {!isLoading && filtered.length > 0 ? (
                        <motion.div
                            initial="hidden"
                            animate="show"
                            variants={{
                                hidden: {},
                                show: { transition: { staggerChildren: 0.1 } },
                            }}
                            className={
                                viewMode === 'grid'
                                    ? 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'
                                    : 'space-y-3'
                            }
                        >
                            {filtered.map((a: any) => {
                                const status = getAssessmentStatus(
                                    a.start_time,
                                    a.end_time,
                                );

                                return (
                                    <motion.div
                                        key={a.id}
                                        variants={{
                                            hidden: { opacity: 0, y: 20 },
                                            show: {
                                                opacity: 1,
                                                y: 0,
                                                transition: { duration: 0.35 },
                                            },
                                        }}
                                        className={`group relative block rounded-lg border p-4 transition hover:shadow-md ${
                                            viewMode === 'list'
                                                ? 'flex items-start justify-between'
                                                : ''
                                        }`}
                                    >
                                        <Link
                                            href={route(
                                                'instructor.classes.subjects.assessments.show',
                                                [classId, subjectId, a.id],
                                            )}
                                            className={
                                                viewMode === 'list'
                                                    ? 'flex-1'
                                                    : ''
                                            }
                                        >
                                            <div className="space-y-1">
                                                <h3 className="text-base leading-tight font-semibold">
                                                    {a.title}{' '}
                                                    {/* NEW: STATUS BADGE */}
                                                    <Badge
                                                        className={`text-white capitalize ${statusColors[status]}`}
                                                    >
                                                        {status}
                                                    </Badge>
                                                </h3>

                                                <p className="text-xs text-gray-500">
                                                    {a.start_time
                                                        ? new Date(
                                                              a.start_time,
                                                          ).toLocaleString()
                                                        : ''}{' '}
                                                    –{' '}
                                                    {a.end_time
                                                        ? new Date(
                                                              a.end_time,
                                                          ).toLocaleString()
                                                        : ''}
                                                </p>
                                            </div>

                                            <span className="mt-1 text-xs text-gray-400">
                                                {a.questions_count ?? 0}{' '}
                                                Questions
                                            </span>
                                        </Link>

                                        {role === 'editor' && (
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                onClick={() => onEdit(a)}
                                                className="absolute top-2 right-2 p-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                                            >
                                                <Edit2Icon className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    ) : (
                        !isLoading && (
                            <p className="py-6 text-center text-sm text-gray-500">
                                No assessments found.
                            </p>
                        )
                    )}
                </div>
            </div>

            {/* Create Modal */}
            <AssessmentModal
                isOpen={openAssessmentModal}
                setIsOpen={setOpenAssessmentModal}
                classId={classId}
                subjectId={subjectId}
                mode="create"
            />
        </AppLayout>
    );
}
