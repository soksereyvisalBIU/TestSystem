// --- ASSESSMENT PAGE ---
import AssessmentModal from '@/components/instructor/modal/assessment-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import {
    CalendarIcon,
    ClockIcon,
    Copy,
    FileTextIcon,
    FilterIcon,
    GridIcon,
    LayoutListIcon,
    MoreHorizontalIcon,
    PencilIcon,
    PlusIcon,
    SearchIcon,
    TrashIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { route } from 'ziggy-js';
import CopyAssessmentModal from './modal/copy-assessment-modal';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Class', href: '/' },
    { title: 'Subjects', href: '/subjects' },
    { title: 'Assessments', href: '/assessments' },
];

export default function AssessmentPage({
    subject,
    availableClasses,
}: {
    subject: any;
    availableClasses: any;
}) {
    const id = subject?.id;

    const role = 'editor';
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
    const [statusFilter, setStatusFilter] = useState<'all' | string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [openAssessmentModal, setOpenAssessmentModal] = useState(false);
    const [selectedAssessment, setSelectedAssessment] = useState<any | null>(
        null,
    );

    const { flash } = usePage().props as {
        flash?: { success?: string; error?: string };
    };

    const classId = subject.class_id;
    const subjectId = subject.id;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const assessments = subject.assessments || [];

    const getAssessmentStatus = (start: string | null, end: string | null) => {
        const now = new Date();
        const startTime = start ? new Date(start) : null;
        const endTime = end ? new Date(end) : null;

        if (startTime && now < startTime) return 'upcoming';
        if (startTime && endTime && now >= startTime && now <= endTime)
            return 'ongoing';
        if (endTime && now > endTime) return 'closed';
        return 'draft';
    };

    const filtered = assessments.filter((a: any) => {
        const status = getAssessmentStatus(a.start_time, a.end_time);
        const matchesStatus = statusFilter === 'all' || status === statusFilter;
        const matchesSearch = a.title
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Assessments" />

            <div className="flex h-full min-h-screen w-full flex-col space-y-6 bg-slate-50/50 p-6 md:p-8">
                {/* PAGE HEADER */}
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                            Assessments
                        </h1>
                        <motion.div layoutId={`subject-title-${id}`}>
                            <p className="text-muted-foreground">
                                Manage quizzes, exams, and assignments for
                                <span className="font-medium text-slate-700">
                                    {subject.name}
                                </span>
                                .
                            </p>
                        </motion.div>
                    </div>

                    {role === 'editor' && (
                        <Button
                            onClick={() => {
                                setSelectedAssessment(null); // create mode
                                setOpenAssessmentModal(true);
                            }}
                            size="lg"
                            className="shadow-lg shadow-blue-500/20"
                        >
                            <PlusIcon className="mr-2 h-4 w-4" /> Create
                            Assessment
                        </Button>
                    )}
                </div>

                <Separator />

                {/* FILTERS & CONTROLS */}
                <div className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-900/5 md:flex-row md:items-center md:justify-between">
                    <div className="relative flex-1 md:max-w-md">
                        <SearchIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search assessments..."
                            className="border-slate-200 bg-slate-50 pl-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Select
                            value={statusFilter}
                            onValueChange={setStatusFilter}
                        >
                            <SelectTrigger className="w-[160px] bg-slate-50">
                                <div className="flex items-center gap-2">
                                    <FilterIcon className="h-3.5 w-3.5 text-muted-foreground" />
                                    <SelectValue placeholder="Filter status" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    All Statuses
                                </SelectItem>
                                <SelectItem value="upcoming">
                                    Upcoming
                                </SelectItem>
                                <SelectItem value="ongoing">Ongoing</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                        </Select>

                        <div className="hidden h-8 w-px bg-slate-200 md:block" />

                        <ToggleGroup
                            type="single"
                            value={viewMode}
                            onValueChange={(v) => v && setViewMode(v)}
                        >
                            <ToggleGroupItem
                                value="list"
                                aria-label="List view"
                                size="sm"
                            >
                                <LayoutListIcon className="h-4 w-4" />
                            </ToggleGroupItem>
                            <ToggleGroupItem
                                value="grid"
                                aria-label="Grid view"
                                size="sm"
                            >
                                <GridIcon className="h-4 w-4" />
                            </ToggleGroupItem>
                        </ToggleGroup>
                    </div>
                </div>

                {/* GRID / LIST CONTENT */}
                <motion.div
                    layout
                    className={
                        viewMode === 'grid'
                            ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                            : 'space-y-4'
                    }
                >
                    {filtered.length > 0 ? (
                        filtered.map((assessment: any) => (
                            <AssessmentCard
                                key={assessment.id}
                                assessment={assessment}
                                viewMode={viewMode}
                                classId={classId}
                                subjectId={subjectId}
                                getStatus={getAssessmentStatus}
                                availableClasses={availableClasses}
                                setSelectedAssessment={setSelectedAssessment}
                                setOpenAssessmentModal={setOpenAssessmentModal}
                            />
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 py-16 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                                <FileTextIcon className="h-8 w-8 text-slate-400" />
                            </div>
                            <h3 className="mt-4 text-lg font-semibold text-slate-900">
                                No assessments found
                            </h3>
                            <p className="mt-2 max-w-sm text-sm text-slate-500">
                                {searchQuery
                                    ? `No results found for "${searchQuery}". Try adjusting your filters.`
                                    : 'Get started by creating a new assessment for your students.'}
                            </p>
                            {!searchQuery && (
                                <Button
                                    variant="link"
                                    onClick={() => {
                                        setSelectedAssessment(null);
                                        setOpenAssessmentModal(true);
                                    }}
                                    className="mt-4 text-blue-600"
                                >
                                    Create your first assessment
                                </Button>
                            )}
                        </div>
                    )}
                </motion.div>
            </div>

            {/* CREATE / EDIT MODAL */}
            <AssessmentModal
                isOpen={openAssessmentModal}
                setIsOpen={(v) => {
                    setOpenAssessmentModal(v);
                    if (!v) setSelectedAssessment(null); // reset when closing
                }}
                classId={classId}
                subjectId={subjectId}
                mode={selectedAssessment ? 'edit' : 'create'}
                assessment={selectedAssessment ?? undefined}
            />
        </AppLayout>
    );
}

// --- ASSESSMENT CARD ---
function AssessmentCard({
    assessment,
    viewMode,
    classId,
    subjectId,
    getStatus,
    availableClasses,
    setSelectedAssessment,
    setOpenAssessmentModal,
}: any) {
    const status = getStatus(assessment.start_time, assessment.end_time);

    const statusStyles: Record<string, string> = {
        upcoming: 'bg-blue-50 text-blue-700 border-blue-200',
        ongoing: 'bg-green-50 text-green-700 border-green-200 animate-pulse',
        closed: 'bg-slate-100 text-slate-700 border-slate-200',
        draft: 'bg-amber-50 text-amber-700 border-amber-200',
    };

    const StatusBadge = () => (
        <Badge
            variant="outline"
            className={`gap-1.5 font-medium capitalize ${statusStyles[status]}`}
        >
            <span
                className={`h-1.5 w-1.5 rounded-full ${status === 'ongoing' ? 'bg-green-600' : 'bg-current'}`}
            />
            {status}
        </Badge>
    );

    if (viewMode === 'list') {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Card className="flex items-center justify-between p-4 transition-all hover:border-blue-300 hover:shadow-md">
                    <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                            <FileTextIcon className="h-5 w-5" />
                        </div>
                        <div>
                            <Link
                                href={route(
                                    'instructor.classes.subjects.assessments.show',
                                    [classId, subjectId, assessment.id],
                                )}
                                className="font-semibold text-slate-900 hover:text-blue-600 hover:underline"
                            >
                                {assessment.title}
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <StatusBadge />
                        <AssessmentActions
                            assessment={assessment}
                            availableClasses={availableClasses}
                            classId={classId}
                            subjectId={subjectId}
                            setSelectedAssessment={setSelectedAssessment}
                            setOpenAssessmentModal={setOpenAssessmentModal}
                        />
                    </div>
                </Card>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
        >
            <Card className="group relative overflow-hidden border-slate-200 transition-all hover:border-blue-300 hover:shadow-lg">
                {/* Status line */}
                <div
                    className={`absolute top-0 left-0 h-1 w-full ${status === 'ongoing' ? 'bg-green-500' : status === 'upcoming' ? 'bg-blue-500' : 'bg-slate-300'}`}
                />
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pt-5 pb-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600">
                        <FileTextIcon className="h-5 w-5" />
                    </div>
                    {/* FIXED: Added availableClasses + classId + subjectId */}
                    <AssessmentActions
                        assessment={assessment}
                        availableClasses={availableClasses}
                        classId={classId}
                        subjectId={subjectId}
                    />
                </CardHeader>
                <CardContent className="pb-3">
                    <Link
                        href={route(
                            'instructor.classes.subjects.assessments.show',
                            [classId, subjectId, assessment.id],
                        )}
                    >
                        <CardTitle className="line-clamp-1 text-lg font-bold group-hover:text-blue-700">
                            <motion.div layoutId={`assessment-title-${assessment.id}`}>{assessment.title}</motion.div>
                        </CardTitle>
                        <CardDescription className="mt-1 line-clamp-2 text-xs">
                            Description goes here if available...
                        </CardDescription>
                    </Link>
                    <div className="mt-4 space-y-2">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <CalendarIcon className="h-4 w-4 text-slate-400" />
                            <span className="text-xs font-medium">
                                {assessment.start_time
                                    ? format(
                                          new Date(assessment.start_time),
                                          'MMM d',
                                      )
                                    : 'TBA'}
                                -
                                {assessment.end_time
                                    ? format(
                                          new Date(assessment.end_time),
                                          'MMM d, yyyy',
                                      )
                                    : ''}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <ClockIcon className="h-4 w-4 text-slate-400" />
                            <span className="text-xs font-medium">
                                {assessment.start_time
                                    ? format(
                                          new Date(assessment.start_time),
                                          'h:mm a',
                                      )
                                    : '--:--'}
                            </span>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between border-t bg-slate-50/50 px-4 py-3">
                    <StatusBadge />
                    <span className="text-xs font-medium text-slate-500">
                        {assessment.questions_count || 0} Qs
                    </span>
                </CardFooter>
            </Card>
        </motion.div>
    );
}

// --- ASSESSMENT ACTIONS ---
function AssessmentActions({
    assessment,
    availableClasses,
    classId,
    subjectId,
    setSelectedAssessment,
    setOpenAssessmentModal,
}: any) {
    const [openCopyModal, setOpenCopyModal] = useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 text-slate-400 hover:text-slate-900"
                    >
                        <MoreHorizontalIcon className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>

                    <DropdownMenuItem
                        onClick={() => {
                            setSelectedAssessment(assessment); // edit mode
                            setOpenAssessmentModal(true);
                        }}
                    >
                        <PencilIcon className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => setOpenCopyModal(true)}>
                        <Copy className="mr-2 h-4 w-4" /> Copy to...
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem className="text-red-600 focus:bg-red-50 focus:text-red-600">
                        <TrashIcon className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <CopyAssessmentModal
                isOpen={openCopyModal}
                setIsOpen={setOpenCopyModal}
                assessmentToCopy={assessment}
                availableClasses={availableClasses}
                sourceClassId={classId}
                sourceSubjectId={subjectId}
            />
        </>
    );
}
