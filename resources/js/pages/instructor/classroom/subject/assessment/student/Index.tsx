import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { saveAs } from 'file-saver';
import {
    ArrowRight,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    Clock,
    FileSpreadsheet,
    FileText,
    Filter,
    LucideIcon,
    Search,
    Share2,
    Trophy,
    UserCheck,
    Users,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import * as XLSX from 'xlsx';

// UI Components
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { route } from 'ziggy-js';
import { StatusBadge } from '../function/assessment-show';
import { useDebounce } from '@/hooks/admin/user-management/useDebounce';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Student {
    name: string;
    email: string;
    avatar?: string;
}

interface Attempt {
    id: number;
    status: 'pending' | 'submitted' | 'scored' | 'checked';
    score: number | string;
    updated_at: string;
    student: Student;
}

interface Props {
    assessment: {
        id: number;
        title: string;
        duration: number;
        student_assessment_attempts: Attempt[];
    };
}

export default function StudentAssessmentAttemptShow({ assessment, classId, subjectId }: Props & { classId: number; subjectId: number }) {
    const attempts = assessment.student_assessment_attempts || [];
    const totalMarks = 100;

    // --- State Management ---
    const [searchInput, setSearchInput] = useState('');
    const debouncedSearch = useDebounce(searchInput, 300); // 300ms debounce for performance
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15; // Controls DOM bloat

    // --- 1. High-Performance Analytics Memoization ---
    const stats = useMemo(() => {
        const total = attempts.length;
        if (total === 0) return { total: 0, submitted: 0, avgScore: '0', completionRate: 0 };

        let submittedCount = 0, totalScore = 0, scoredCount = 0;

        for (let i = 0; i < total; i++) { // Standard for-loop is marginally faster than for-of for massive arrays
            const a = attempts[i];
            if (['submitted', 'scored', 'checked'].includes(a.status)) submittedCount++;
            if (['scored', 'checked'].includes(a.status)) {
                totalScore += Number(a.score || 0);
                scoredCount++;
            }
        }

        return {
            total,
            submitted: submittedCount,
            avgScore: scoredCount ? (totalScore / scoredCount).toFixed(1) : '0',
            completionRate: Math.round((submittedCount / total) * 100),
        };
    }, [attempts]);

    // --- 2. Multi-stage Pipeline: Filter -> Sort -> Paginate ---
    const processedAttempts = useMemo(() => {
        let result = attempts;

        // A. Filter by Search (using debounced value to save CPU cycles)
        if (debouncedSearch) {
            const query = debouncedSearch.toLowerCase().trim();
            result = result.filter(a =>
                a.student?.name?.toLowerCase().includes(query) ||
                a.student?.email?.toLowerCase().includes(query)
            );
        }

        // B. Filter by Status
        if (statusFilter !== 'all') {
            result = result.filter(a => 
                statusFilter === 'pending' ? a.status === 'submitted' : 
                statusFilter === 'completed' ? ['scored', 'checked'].includes(a.status) :
                a.status === statusFilter
            );
        }

        // C. Sort
        if (sortConfig) {
            result = [...result].sort((a, b) => {
                let aVal: any = a, bVal: any = b;
                if (sortConfig.key === 'name') {
                    aVal = a.student?.name || ''; bVal = b.student?.name || '';
                } else if (sortConfig.key === 'score') {
                    aVal = Number(a.score || 0); bVal = Number(b.score || 0);
                } else if (sortConfig.key === 'status') {
                    aVal = a.status; bVal = b.status;
                } else if (sortConfig.key === 'date') {
                    aVal = new Date(a.last_attempt?.completed_at || 0).getTime(); 
                    bVal = new Date(b.last_attempt?.completed_at || 0).getTime();
                }

                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [attempts, debouncedSearch, statusFilter, sortConfig]);

    // D. Paginate (Slices the array so we don't render 1000 items in the DOM at once)
    const totalPages = Math.ceil(processedAttempts.length / itemsPerPage);
    const paginatedAttempts = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return processedAttempts.slice(start, start + itemsPerPage);
    }, [processedAttempts, currentPage, itemsPerPage]);

    // Reset pagination when filters change
    useEffect(() => { setCurrentPage(1); }, [debouncedSearch, statusFilter]);

    // --- 3. Dynamic Export (Saves initial bundle latency) ---
    const handleExport = useCallback(async (type: 'xlsx' | 'csv') => {
        // Dynamically load heavy Excel libraries ONLY when needed
        const [XLSX, { saveAs }] = await Promise.all([
            import('xlsx'),
            import('file-saver')
        ]);

        const dataToExport = processedAttempts.map((attempt) => ({
            'Student Name': attempt.student?.name || 'N/A',
            'Email': attempt.student?.email || 'N/A',
            'Status': attempt.status.toUpperCase(),
            'Score': attempt.score || 0,
            'Max Score': totalMarks,
            'Percentage': `${((Number(attempt.score) / totalMarks) * 100).toFixed(2)}%`,
            'Completion Date': attempt.last_attempt?.completed_at 
                ? format(new Date(attempt.last_attempt.completed_at), 'yyyy-MM-dd HH:mm:ss') 
                : 'Not Completed',
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Results');

        if (type === 'xlsx') {
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            saveAs(new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), `${assessment.title}_Report.xlsx`);
        } else {
            const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
            saveAs(new Blob([csvOutput], { type: 'text/csv;charset=utf-8' }), `${assessment.title}_Report.csv`);
        }
    }, [processedAttempts, assessment.title]);

    const handleSort = (key: SortConfig['key']) => {
        setSortConfig(current => ({
            key, direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const SortIcon = ({ columnKey }: { columnKey: SortConfig['key'] }) => {
        if (sortConfig?.key !== columnKey) return <ChevronDown className="ml-1 h-3 w-3 opacity-20 transition-opacity group-hover:opacity-50" />;
        return sortConfig.direction === 'asc' 
            ? <ChevronUp className="ml-1 h-3 w-3 text-primary" /> 
            : <ChevronDown className="ml-1 h-3 w-3 text-primary" />;
    };

    return (
        <AppLayout>
            <Head title={`${assessment.title} | Analytics`} />

            <div className="container mx-auto max-w-7xl animate-in space-y-6 p-6 duration-500 fade-in">
                {/* Header Section */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-black tracking-tight text-foreground">
                            <FileText className="h-6 w-6 text-primary" />
                            {assessment.title}
                        </h1>
                        <p className="font-medium text-muted-foreground">Classroom performance overview.</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleExport('xlsx')} className="rounded-xl border-emerald-600/20 text-emerald-700 hover:bg-emerald-50">
                            <FileSpreadsheet className="mr-2 h-4 w-4" /> Export Excel
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleExport('csv')} className="rounded-xl border-blue-600/20 text-blue-700 hover:bg-blue-50">
                            <Share2 className="mr-2 h-4 w-4" /> Export CSV
                        </Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard icon={Users} label="Total Students" value={stats.total} color="text-blue-500" />
                    <StatCard icon={UserCheck} label="Submitted" value={stats.submitted} subValue={`${stats.completionRate}%`} color="text-emerald-500" />
                    <StatCard icon={Trophy} label="Average Score" value={`${stats.avgScore}%`} color="text-amber-500" />
                    <StatCard icon={Clock} label="Time Limit" value={`${assessment.duration}m`} color="text-violet-500" />
                </div>

                {/* Toolbar & Table Section */}
                <Card className="overflow-hidden rounded-3xl border-none bg-card shadow-sm ring-1 ring-border/60 gap-0 pt-0">
                    <CardHeader className="flex flex-col md:flex-row gap-4 border-b border-border/50 bg-muted/5 px-6 py-4 justify-between items-center">
                        {/* Search Input */}
                        <div className="relative w-full md:w-96">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search students by name or email..."
                                className="h-10 rounded-xl pl-10 focus-visible:ring-primary shadow-sm"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <Filter className="h-4 w-4 text-muted-foreground" />
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-full md:w-[180px] rounded-xl h-10 shadow-sm">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="pending">Pending Grading</SelectItem>
                                    <SelectItem value="completed">Scored</SelectItem>
                                    <SelectItem value="abandoned">Not Completed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-muted/30">
                                <TableRow className="border-b-border/50">
                                    <TableHead className="group cursor-pointer py-4 pl-6 text-[10px] font-black tracking-[0.15em] text-description uppercase transition-colors hover:text-foreground" onClick={() => handleSort('name')}>
                                        <div className="flex items-center">Student Info <SortIcon columnKey="name" /></div>
                                    </TableHead>
                                    <TableHead className="group cursor-pointer text-[10px] font-black tracking-[0.15em] text-description uppercase transition-colors hover:text-foreground" onClick={() => handleSort('status')}>
                                        <div className="flex items-center">Status <SortIcon columnKey="status" /></div>
                                    </TableHead>
                                    <TableHead className="group cursor-pointer text-[10px] font-black tracking-[0.15em] text-description uppercase transition-colors hover:text-foreground" onClick={() => handleSort('date')}>
                                        <div className="flex items-center">Completed Date <SortIcon columnKey="date" /></div>
                                    </TableHead>
                                    <TableHead className="group cursor-pointer text-[10px] font-black tracking-[0.15em] text-description uppercase transition-colors hover:text-foreground" onClick={() => handleSort('score')}>
                                        <div className="flex items-center">Results <SortIcon columnKey="score" /></div>
                                    </TableHead>
                                    <TableHead className="pr-6 text-right text-[10px] font-black tracking-[0.15em] text-description uppercase">Actions</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {paginatedAttempts.length > 0 ? (
                                    paginatedAttempts.map((s) => {
                                        const score = Number(s.score ?? 0);
                                        const percentage = totalMarks > 0 ? (score / totalMarks) * 100 : 0;
                                        const isPending = s.status === 'submitted';
                                        const completionDate = s.last_attempt?.completed_at;

                                        return (
                                            <TableRow key={s.id} className={`group border-b-border/40 transition-colors hover:bg-muted/40 ${isPending ? 'bg-primary/5' : ''}`}>
                                                {/* Student Info */}
                                                <TableCell className="py-4 pl-6">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                                                            <AvatarImage src={s.student?.avatar ?? `https://api.dicebear.com/7.x/initials/svg?seed=${s.student?.name}`} />
                                                            <AvatarFallback className="bg-primary/10 text-xs font-black text-primary">
                                                                {s.student?.name?.substring(0, 2).toUpperCase()}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex flex-col">
                                                            <span className="font-bold tracking-tight text-title">{s.student?.name}</span>
                                                            <span className="text-[11px] font-medium text-description">{s.student?.email}</span>
                                                        </div>
                                                    </div>
                                                </TableCell>

                                                {/* Status */}
                                                <TableCell><StatusBadge status={s.status} /></TableCell>

                                                {/* Date */}
                                                <TableCell className="text-sm font-bold text-title">
                                                    {completionDate ? (
                                                        <div className="flex flex-col">
                                                            <span>{format(new Date(completionDate), 'MMM d, yyyy')}</span>
                                                            <span className="text-[10px] font-medium tracking-wider text-description uppercase">{format(new Date(completionDate), 'h:mm a')}</span>
                                                        </div>
                                                    ) : (<span className="font-medium text-description/40 italic">Not completed</span>)}
                                                </TableCell>

                                                {/* Results */}
                                                <TableCell>
                                                    <div className="flex w-36 flex-col gap-1.5">
                                                        <div className="flex justify-between text-[11px] font-black tracking-tight">
                                                            <span className={percentage >= 70 ? 'text-success' : 'text-primary'}>{score} / {totalMarks}</span>
                                                            <span className="text-description">{Math.round(percentage)}%</span>
                                                        </div>
                                                        <Progress value={percentage} className={`h-2 rounded-full bg-muted ${percentage >= 70 ? '[&>div]:bg-success' : '[&>div]:bg-primary'}`} />
                                                    </div>
                                                </TableCell>

                                                {/* Actions */}
                                                <TableCell className="pr-6 text-right">
                                                    <Button asChild size="sm" className={`h-9 rounded-xl px-4 font-bold transition-all active:scale-95 ${isPending ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:opacity-90' : 'border border-border bg-background text-title shadow-none hover:bg-muted'}`}>
                                                        <Link href={route('instructor.classes.subjects.assessments.students.show', { class: classId, subject: subjectId, assessment: s.assessment_id, student: s.student.id })}>
                                                            {isPending ? 'Review Exam' : 'View Results'}
                                                            <ArrowRight className={`ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-1 ${isPending ? 'text-primary-foreground' : 'text-description'}`} />
                                                        </Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-72 text-center">
                                            <div className="flex flex-col items-center justify-center space-y-3">
                                                <div className="rounded-2xl bg-muted/50 p-4 text-description/50"><Search className="h-8 w-8" /></div>
                                                <p className="font-bold text-title">No matching records found</p>
                                                <p className="mx-auto text-xs text-description">Adjust your search or filter criteria.</p>
                                                {searchInput && (
                                                    <Button variant="link" onClick={() => {setSearchInput(''); setStatusFilter('all');}} className="mt-2 text-primary">Clear all filters</Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        
                        {/* Pagination Footer */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between border-t border-border/50 px-6 py-4 bg-muted/5">
                                <span className="text-xs font-medium text-muted-foreground">
                                    Showing <span className="font-bold text-foreground">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-foreground">{Math.min(currentPage * itemsPerPage, processedAttempts.length)}</span> of <span className="font-bold text-foreground">{processedAttempts.length}</span> students
                                </span>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

// Sub-component for Stats to keep the main tree clean
function StatCard({
    icon: Icon,
    label,
    value,
    subValue,
    color,
}: {
    icon: LucideIcon;
    label: string;
    value: string | number;
    subValue?: string;
    color: string;
}) {
    return (
        <Card className="py-0 border-none shadow-sm ring-1 ring-border/60 transition-all duration-300 hover:ring-primary/20">
            <CardContent className="flex items-center gap-4 p-5">
                <div
                    className={`rounded-2xl bg-muted/50 p-3 ${color} bg-opacity-10`}
                >
                    <Icon className="h-6 w-6" />
                </div>
                <div>
                    <p className="text-sm font-semibold tracking-tight text-muted-foreground">
                        {label}
                    </p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-2xl font-black tracking-tighter">
                            {value}
                        </h3>
                        {subValue && (
                            <span className="rounded bg-emerald-50 px-1.5 text-xs font-bold text-emerald-600">
                                {subValue}
                            </span>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
