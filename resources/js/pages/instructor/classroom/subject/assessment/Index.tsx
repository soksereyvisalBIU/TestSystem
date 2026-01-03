// --- ASSESSMENT PAGE ---
import AssessmentCard from '@/components/instructor/card/assessments/assessment-card';
import AssessmentModal from '@/components/instructor/modal/assessment-modal';
import { Button } from '@/components/ui/button';
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
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    FileTextIcon,
    FilterIcon,
    GridIcon,
    LayoutListIcon,
    PlusIcon,
    SearchIcon,
} from 'lucide-react';
import { useState } from 'react';

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
    const [selectedAssessment, setSelectedAssessment] = useState<any | null>(null);

    const classId = subject.class_id;
    const subjectId = subject.id;
    const assessments = subject.assessments || [];

    const getAssessmentStatus = (start: string | null, end: string | null) => {
        const now = new Date();
        const startTime = start ? new Date(start) : null;
        const endTime = end ? new Date(end) : null;

        if (startTime && now < startTime) return 'upcoming';
        if (startTime && endTime && now >= startTime && now <= endTime) return 'ongoing';
        if (endTime && now > endTime) return 'closed';
        return 'draft';
    };

    const filtered = assessments.filter((a: any) => {
        const status = getAssessmentStatus(a.start_time, a.end_time);
        const matchesStatus = statusFilter === 'all' || status === statusFilter;
        const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Assessments" />

            <div className="flex h-full min-h-screen w-full flex-col space-y-6 p-6 md:p-8 bg-background">
                {/* PAGE HEADER */}
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-title">
                            Assessments
                        </h1>
                        <motion.div layoutId={`subject-title-${id}`}>
                            <p className="text-description">
                                Manage quizzes, exams, and assignments for{' '}
                                <span className="font-semibold text-body">
                                    {subject.name}
                                </span>
                                .
                            </p>
                        </motion.div>
                    </div>

                    {role === 'editor' && (
                        <Button
                            onClick={() => {
                                setSelectedAssessment(null);
                                setOpenAssessmentModal(true);
                            }}
                            size="lg"
                            className="shadow-lg shadow-primary/20"
                        >
                            <PlusIcon className="mr-2 h-4 w-4" /> Create Assessment
                        </Button>
                    )}
                </div>

                <Separator className="bg-border" />

                {/* FILTERS & CONTROLS */}
                <div className="flex flex-col gap-4 rounded-xl bg-card p-4 shadow-sm border border-border md:flex-row md:items-center md:justify-between">
                    <div className="relative flex-1 md:max-w-md">
                        <SearchIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search assessments..."
                            className="border-border bg-muted/50 pl-9 focus-visible:ring-primary"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[160px] bg-muted/50 border-border">
                                <div className="flex items-center gap-2">
                                    <FilterIcon className="h-3.5 w-3.5 text-muted-foreground" />
                                    <SelectValue placeholder="Filter status" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="upcoming">Upcoming</SelectItem>
                                <SelectItem value="ongoing">Ongoing</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                        </Select>

                        <div className="hidden h-8 w-px bg-border md:block" />

                        <ToggleGroup
                            variant="outline"
                            type="single"
                            value={viewMode}
                            onValueChange={(v) => v && setViewMode(v as 'list' | 'grid')}
                            className="border border-border rounded-lg p-1 bg-muted/30"
                        >
                            <ToggleGroupItem value="list" size="sm" className="data-[state=on]:bg-card">
                                <LayoutListIcon className="h-4 w-4" />
                            </ToggleGroupItem>
                            <ToggleGroupItem value="grid" size="sm" className="data-[state=on]:bg-card">
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
                            : 'flex flex-col gap-4'
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
                        <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 py-16 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                                <FileTextIcon className="h-8 w-8 text-description/50" />
                            </div>
                            <h3 className="mt-4 text-lg font-semibold text-title">
                                No assessments found
                            </h3>
                            <p className="mt-2 max-w-sm text-sm text-description">
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
                                    className="mt-4 text-primary font-bold"
                                >
                                    Create your first assessment
                                </Button>
                            )}
                        </div>
                    )}
                </motion.div>
            </div>

            <AssessmentModal
                isOpen={openAssessmentModal}
                setIsOpen={(v) => {
                    setOpenAssessmentModal(v);
                    if (!v) setSelectedAssessment(null);
                }}
                classId={classId}
                subjectId={subjectId}
                assessment={selectedAssessment ?? undefined}
            />
        </AppLayout>
    );
}