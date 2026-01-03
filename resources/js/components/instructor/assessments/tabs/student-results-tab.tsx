import { Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { ArrowRight, Filter, Search, UserCheck } from 'lucide-react';
import { useMemo, useState } from 'react';
import { route } from 'ziggy-js';

// UI Components
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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
import { StatusBadge } from '@/pages/instructor/classroom/subject/assessment/function/assessment-show';

interface Props {
    students: any[];
    totalMarks: number;
    classId: number;
    subjectId: number;
    assessmentId: number;
}

export default function StudentResultsTab({
    students,
    totalMarks,
    classId,
    subjectId,
    assessmentId,
}: Props) {
    const [search, setSearch] = useState('');

    const filteredStudents = useMemo(() => {
        return students.filter(
            (s) =>
                s.name?.toLowerCase().includes(search.toLowerCase()) ||
                s.email?.toLowerCase().includes(search.toLowerCase()),
        );
    }, [students, search]);

    return (
        <Card className="overflow-hidden py-0 border-none bg-card shadow-sm ring-1 ring-border/60 rounded-[2rem]">
            <CardHeader className="flex flex-col pt-4 gap-4 space-y-0 border-b border-border/50 bg-muted/20 pb-6 md:flex-row md:items-center md:justify-between px-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <UserCheck className="h-5 w-5 text-primary" />
                        <CardTitle className="text-xl font-black tracking-tight text-title">
                            Student Performance
                        </CardTitle>
                    </div>
                    <CardDescription className="font-medium text-description">
                        {students.length} students enrolled in this assessment
                    </CardDescription>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative w-full md:w-72">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-description" />
                        <Input
                            placeholder="Search name or email..."
                            className="h-11 rounded-xl border-border bg-background pl-10 transition-all focus-visible:ring-primary/20"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <Button
                        variant="outline"
                        size="icon"
                        className="h-11 w-11 shrink-0 rounded-xl border-border bg-background hover:bg-muted"
                    >
                        <Filter className="h-4 w-4 text-description" />
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="p-0">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow className="hover:bg-transparent border-b-border/50">
                            <TableHead className="py-4 pl-6 text-[10px] font-black uppercase tracking-[0.15em] text-description">
                                Student Info
                            </TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-[0.15em] text-description">
                                Status
                            </TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-[0.15em] text-description">
                                Submitted Date
                            </TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-[0.15em] text-description">
                                Results
                            </TableHead>
                            <TableHead className="text-right pr-6 text-[10px] font-black uppercase tracking-[0.15em] text-description">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {filteredStudents.length > 0 ? (
                            filteredStudents.map((s) => {
                                const score = Number(s.pivot?.score ?? 0);
                                const percentage = totalMarks > 0 ? (score / totalMarks) * 100 : 0;
                                const isPending = s.pivot?.status === 'submitted';

                                return (
                                    <TableRow
                                        key={s.id}
                                        className={`group transition-colors hover:bg-muted/40 border-b-border/40 ${isPending ? 'bg-primary/5' : ''}`}
                                    >
                                        <TableCell className="pl-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                                                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${s.name}`} />
                                                    <AvatarFallback className="bg-primary/10 text-xs font-black text-primary">
                                                        {s.name?.substring(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-title tracking-tight">
                                                        {s.name}
                                                    </span>
                                                    <span className="text-[11px] font-medium text-description">
                                                        {s.email}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <StatusBadge status={s.pivot?.status} />
                                        </TableCell>

                                        <TableCell className="text-sm font-bold text-title">
                                            {s.pivot?.submitted_at ? (
                                                <div className="flex flex-col">
                                                    <span>{format(new Date(s.pivot.submitted_at), 'MMM d, yyyy')}</span>
                                                    <span className="text-[10px] font-medium text-description uppercase tracking-wider">
                                                        {format(new Date(s.pivot.submitted_at), 'h:mm a')}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-description/40 italic font-medium">No record</span>
                                            )}
                                        </TableCell>

                                        <TableCell>
                                            <div className="flex w-36 flex-col gap-1.5">
                                                <div className="flex justify-between text-[11px] font-black tracking-tight">
                                                    <span className={percentage >= 70 ? 'text-success' : 'text-primary'}>
                                                        {s.pivot?.score ?? '0'} / {totalMarks}
                                                    </span>
                                                    <span className="text-description">{Math.round(percentage)}%</span>
                                                </div>
                                                <Progress
                                                    value={percentage}
                                                    className={`h-2 rounded-full bg-muted ${
                                                        percentage >= 70 ? '[&>div]:bg-success' : '[&>div]:bg-primary'
                                                    }`}
                                                />
                                            </div>
                                        </TableCell>

                                        <TableCell className="text-right pr-6">
                                            <Button
                                                asChild
                                                size="sm"
                                                className={`h-9 px-4 rounded-xl font-bold transition-all active:scale-95 ${
                                                    isPending 
                                                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:opacity-90' 
                                                    : 'bg-background border border-border text-title hover:bg-muted shadow-none '
                                                }`}
                                            >
                                                <Link
                                                    href={route('instructor.classes.subjects.assessments.students.show', {
                                                        class: classId,
                                                        subject: subjectId,
                                                        assessment: assessmentId,
                                                        student: s.id,
                                                    })}
                                                >
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
                                        <div className="rounded-2xl bg-muted/50 p-4 text-description/50">
                                            <Search className="h-8 w-8" />
                                        </div>
                                        <p className="font-bold text-title">No matching students found</p>
                                        <p className="text-xs text-description max-w-[200px] mx-auto">
                                            Try searching by full name or specific BELTEI student email.
                                        </p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}