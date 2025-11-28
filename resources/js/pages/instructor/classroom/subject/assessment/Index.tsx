// import { Badge, Button } from '@/components/ui/card';
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
import { motion } from 'framer-motion';
import { Edit2Icon, GridIcon, ListIcon, PlusIcon } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Class', href: '/' },
    { title: 'Subjects', href: '/subjects' },
    { title: 'Assessments', href: '/assessments' },
];
    
export default function AssessmentPage() {
    const role = 'editor'; // simulate role
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
    const [statusFilter, setStatusFilter] = useState('all');

    const assessments = [
        {
            id: 1,
            title: 'Quiz 1',
            status: 'active',
            start_time: '2025-01-02',
            end_time: '2025-01-03',
            total_questions: 10,
        },
        {
            id: 2,
            title: 'Quiz 2',
            status: 'upcoming',
            start_time: '2025-01-04',
            end_time: '2025-01-05',
            total_questions: 15,
        },
        {
            id: 3,
            title: 'Midterm Exam',
            status: 'closed',
            start_time: '2025-01-06',
            end_time: '2025-01-06',
            total_questions: 20,
        },
    ];

    const statusColors: Record<string, string> = {
        active: 'bg-green-500',
        upcoming: 'bg-blue-500',
        closed: 'bg-red-500',
    };

    const isLoading = false; // simulate loading

    const filtered = assessments.filter(
        (a) => statusFilter === 'all' || a.status === statusFilter,
    );

    const onNew = () => alert('Open new assessment modal');
    const onEdit = (assessment: any) => alert('Edit ' + assessment.title);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Assessments" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="rounded-xl border p-5 shadow-sm">
                    {/* Header */}
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <h2 className="text-xl font-bold">Assessments</h2>
                        <div className="flex items-center gap-3">
                            <Select
                                value={statusFilter}
                                onValueChange={setStatusFilter}
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
                                <Button onClick={onNew} className="gap-2">
                                    <PlusIcon className="h-4 w-4" /> New
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Loading state */}
                    {isLoading && (
                        <p className="py-6 text-center text-sm text-gray-500">
                            Loading assessments...
                        </p>
                    )}

                    {/* Content */}
                    {!isLoading && filtered.length > 0 ? (
                        <motion.div
                            // Stagger container
                            initial="hidden"
                            animate="show"
                            variants={{
                                hidden: {},
                                show: {
                                    transition: { staggerChildren: 0.1 },
                                }, // stagger 0.1s between cards
                            }}
                            className={
                                viewMode === 'grid'
                                    ? 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'
                                    : 'space-y-3'
                            }
                        >
                            {filtered.map((a) => (
                                <motion.div
                                    key={a.id}
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        show: {
                                            opacity: 1,
                                            y: 0,
                                            transition: {
                                                duration: 0.35,
                                                // ease: 'easeOut',
                                            },
                                        },
                                    }}
                                    className={`group relative block rounded-lg border p-4 transition hover:shadow-md ${
                                        viewMode === 'list'
                                            ? 'flex items-start justify-between'
                                            : ''
                                    }`}
                                >
                                    <Link
                                        // href={route('instructor.classes.subjects.assessments.index' ,  a.id)}
                                        className={
                                            viewMode === 'list' ? 'flex-1' : ''
                                        }
                                    >
                                        <div className="space-y-1">
                                            <h3 className="text-base leading-tight font-semibold">
                                                {a.title}{' '}
                                                <Badge
                                                    className={`${statusColors[a.status]} text-white capitalize`}
                                                >
                                                    {a.status}
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
                                            {a.total_questions} Questions
                                        </span>
                                    </Link>

                                    {role === 'editor' && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onEdit(a)}
                                            className="absolute top-2 right-2 p-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                                        >
                                            <Edit2Icon className="h-4 w-4" />
                                        </Button>
                                    )}
                                </motion.div>
                            ))}
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
        </AppLayout>
    );
}
