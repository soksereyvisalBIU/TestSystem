import { Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { ArrowRight, Filter, Search } from 'lucide-react';
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

    // Performance: Filtered list is memoized
    const filteredStudents = useMemo(() => {
        return students.filter(
            (s) =>
                s.name?.toLowerCase().includes(search.toLowerCase()) ||
                s.email?.toLowerCase().includes(search.toLowerCase()),
        );
    }, [students, search]);

    return (
        <Card className="overflow-hidden border border-border bg-card shadow-sm ring-1 ring-border/60">
            <CardHeader className="flex flex-col gap-4 space-y-0 border-b border-border bg-muted/40 pb-6 md:flex-row md:items-center md:justify-between">
                <div>
                    <CardTitle className="text-xl font-bold text-title">
                        Student Performance
                    </CardTitle>
                    <CardDescription className="text-description">
                        {students.length} students enrolled in this assessment
                    </CardDescription>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative w-full md:w-72">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Filter by name or email..."
                            className="h-10 border-input bg-card pl-10 transition-all focus-visible:ring-ring"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 shrink-0 border-border bg-card"
                    >
                        <Filter className="h-4 w-4 text-muted-foreground" />
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="p-0">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow className="uppercase hover:bg-transparent">
                            <TableHead className="w-[300px] text-[11px] font-bold tracking-wider text-muted-foreground">
                                Student
                            </TableHead>
                            <TableHead className="text-[11px] font-bold tracking-wider text-muted-foreground">
                                Status
                            </TableHead>
                            <TableHead className="text-[11px] font-bold tracking-wider text-muted-foreground">
                                Submission Date
                            </TableHead>
                            <TableHead className="text-[11px] font-bold tracking-wider text-muted-foreground">
                                Performance
                            </TableHead>
                            <TableHead className="text-right text-[11px] font-bold tracking-wider text-muted-foreground">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {filteredStudents.length > 0 ? (
                            filteredStudents.map((s) => {
                                const score = Number(s.pivot?.score ?? 0);
                                const percentage =
                                    totalMarks > 0
                                        ? (score / totalMarks) * 100
                                        : 0;
                                const isPending =
                                    s.pivot?.status === 'submitted';

                                return (
                                    <TableRow
                                        key={s.id}
                                        className={`group transition-colors hover:bg-muted/60 ${isPending ? 'bg-accent/30' : ''} `}
                                    >
                                        {/* Student */}
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9 border border-border">
                                                    <AvatarImage
                                                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${s.name}`}
                                                    />
                                                    <AvatarFallback className="bg-primary/15 text-[10px] font-bold text-primary">
                                                        {s.name
                                                            ?.substring(0, 2)
                                                            .toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>

                                                <div className="flex flex-col">
                                                    <span className="leading-none font-semibold text-title">
                                                        {s.name}
                                                    </span>
                                                    <span className="mt-1 text-xs text-description">
                                                        {s.email}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* Status */}
                                        <TableCell>
                                            <StatusBadge
                                                status={s.pivot?.status}
                                            />
                                        </TableCell>

                                        {/* Submitted At */}
                                        <TableCell className="text-sm font-medium text-body">
                                            {s.pivot?.submitted_at ? (
                                                <div className="flex flex-col">
                                                    <span>
                                                        {format(
                                                            new Date(
                                                                s.pivot.submitted_at,
                                                            ),
                                                            'MMM d, yyyy',
                                                        )}
                                                    </span>
                                                    <span className="text-[10px] text-muted-foreground">
                                                        {format(
                                                            new Date(
                                                                s.pivot.submitted_at,
                                                            ),
                                                            'h:mm a',
                                                        )}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground italic">
                                                    Not submitted
                                                </span>
                                            )}
                                        </TableCell>

                                        {/* Performance */}
                                        <TableCell>
                                            <div className="flex w-32 flex-col gap-1.5">
                                                <div className="flex justify-between text-[11px] font-bold">
                                                    <span
                                                        className={
                                                            percentage >= 70
                                                                ? 'text-success'
                                                                : 'text-body'
                                                        }
                                                    >
                                                        {s.pivot?.score ?? '0'}{' '}
                                                        / {totalMarks}
                                                    </span>
                                                    <span className="text-muted-foreground">
                                                        {Math.round(percentage)}
                                                        %
                                                    </span>
                                                </div>

                                                <Progress
                                                    value={percentage}
                                                    className={`h-1.5 ${
                                                        percentage >= 70
                                                            ? '[&>div]:bg-success'
                                                            : '[&>div]:bg-primary'
                                                    }`}
                                                />
                                            </div>
                                        </TableCell>

                                        {/* Actions */}
                                        <TableCell className="text-right">
                                            <Button
                                                asChild
                                                size="sm"
                                                className="h-8 border border-border bg-card px-3 text-body shadow-none transition-all hover:bg-muted active:scale-95"
                                            >
                                                <Link
                                                    href={route(
                                                        'instructor.classes.subjects.assessments.students.show',
                                                        {
                                                            class: classId,
                                                            subject: subjectId,
                                                            assessment:
                                                                assessmentId,
                                                            student: s.id,
                                                        },
                                                    )}
                                                >
                                                    {isPending
                                                        ? 'Grade'
                                                        : 'View'}
                                                    <ArrowRight className="ml-1.5 h-3 w-3 text-muted-foreground transition-colors group-hover:text-primary" />
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="h-64 text-center"
                                >
                                    <div className="flex flex-col items-center justify-center space-y-2">
                                        <div className="rounded-full bg-muted p-3 text-muted-foreground">
                                            <Search className="h-6 w-6" />
                                        </div>
                                        <p className="text-sm font-medium text-title">
                                            No students found
                                        </p>
                                        <p className="text-xs text-description">
                                            Try adjusting your search terms
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
