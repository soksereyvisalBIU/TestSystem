import React, { useMemo, useState } from 'react';
import { Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { ArrowRight, Search, FileText, Filter, MoreHorizontal } from 'lucide-react';
import { route } from 'ziggy-js';

// UI Components
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
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

    // Performance: Filtered list is memoized
    const filteredStudents = useMemo(() => {
        return students.filter(s =>
            s.name?.toLowerCase().includes(search.toLowerCase()) ||
            s.email?.toLowerCase().includes(search.toLowerCase())
        );
    }, [students, search]);

    return (
        <Card className="border-none shadow-sm ring-1 ring-slate-200/60 overflow-hidden">
            <CardHeader className="flex flex-col gap-4 space-y-0 border-b border-slate-50 bg-slate-50/30 pb-6 md:flex-row md:items-center md:justify-between">
                <div>
                    <CardTitle className="text-xl font-bold text-slate-900">Student Performance</CardTitle>
                    <CardDescription className="text-slate-500">
                        {students.length} students enrolled in this assessment
                    </CardDescription>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                            placeholder="Filter by name or email..."
                            className="h-10 pl-10 bg-white ring-offset-transparent focus-visible:ring-blue-500 transition-all"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" size="icon" className="h-10 w-10 shrink-0 bg-white">
                        <Filter className="h-4 w-4 text-slate-600" />
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="p-0">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow className="hover:bg-transparent uppercase">
                            <TableHead className="w-[300px] text-[11px] font-bold tracking-wider text-slate-500">Student</TableHead>
                            <TableHead className="text-[11px] font-bold tracking-wider text-slate-500">Status</TableHead>
                            <TableHead className="text-[11px] font-bold tracking-wider text-slate-500">Submission Date</TableHead>
                            <TableHead className="text-[11px] font-bold tracking-wider text-slate-500">Performance</TableHead>
                            <TableHead className="text-right text-[11px] font-bold tracking-wider text-slate-500">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {filteredStudents.length > 0 ? (
                            filteredStudents.map(s => {
                                const score = Number(s.pivot?.score ?? 0);
                                const percentage = totalMarks > 0 ? (score / totalMarks) * 100 : 0;
                                const isPending = s.pivot?.status === 'submitted';

                                return (
                                    <TableRow 
                                        key={s.id} 
                                        className={`group transition-colors hover:bg-slate-50/80 ${isPending ? 'bg-amber-50/30' : ''}`}
                                    >
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9 border border-slate-200">
                                                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${s.name}`} />
                                                    <AvatarFallback className="bg-blue-100 text-[10px] font-bold text-blue-700">
                                                        {s.name?.substring(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-slate-900 leading-none">{s.name}</span>
                                                    <span className="text-xs text-slate-400 mt-1">{s.email}</span>
                                                </div>
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <StatusBadge status={s.pivot?.status} />
                                        </TableCell>

                                        <TableCell className="text-sm text-slate-600 font-medium">
                                            {s.pivot?.submitted_at ? (
                                                <div className="flex flex-col">
                                                    <span>{format(new Date(s.pivot.submitted_at), 'MMM d, yyyy')}</span>
                                                    <span className="text-[10px] text-slate-400">{format(new Date(s.pivot.submitted_at), 'h:mm a')}</span>
                                                </div>
                                            ) : (
                                                <span className="text-slate-300 italic">Not submitted</span>
                                            )}
                                        </TableCell>

                                        <TableCell>
                                            <div className="flex flex-col w-32 gap-1.5">
                                                <div className="flex justify-between text-[11px] font-bold">
                                                    <span className={percentage >= 70 ? 'text-emerald-600' : 'text-slate-600'}>
                                                        {s.pivot?.score ?? '0'} / {totalMarks}
                                                    </span>
                                                    <span className="text-slate-400">{Math.round(percentage)}%</span>
                                                </div>
                                                <Progress 
                                                    value={percentage} 
                                                    className={`h-1.5 ${percentage >= 70 ? '[&>div]:bg-emerald-500' : '[&>div]:bg-blue-500'}`} 
                                                />
                                            </div>
                                        </TableCell>

                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button asChild size="sm" className="h-8 px-3 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-none transition-all active:scale-95">
                                                    <Link
                                                        href={route('instructor.classes.subjects.assessments.students.show', {
                                                            class: classId,
                                                            subject: subjectId,
                                                            assessment: assessmentId,
                                                            student: s.id,
                                                        })}
                                                    >
                                                        {isPending ? 'Grade' : 'View'} 
                                                        <ArrowRight className="ml-1.5 h-3 w-3 text-slate-400 group-hover:text-blue-500 transition-colors" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-64 text-center">
                                    <div className="flex flex-col items-center justify-center space-y-2">
                                        <div className="rounded-full bg-slate-100 p-3 text-slate-400">
                                            <Search className="h-6 w-6" />
                                        </div>
                                        <p className="text-sm font-medium text-slate-900">No students found</p>
                                        <p className="text-xs text-slate-500">Try adjusting your search terms</p>
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