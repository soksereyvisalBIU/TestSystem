import { useMemo } from 'react';
import { AlertCircle, BarChart3, BookOpen, CheckCircle2 } from 'lucide-react';
import { MetricCard } from '@/pages/instructor/classroom/subject/assessment/function/assessment-show';

interface Props {
    students: any[];
    totalMarks: number;
    totalQuestions: number;
}

export default function AssessmentMetrics({
    students,
    totalMarks,
    totalQuestions,
}: Props) {
    // Optimized: Calculate everything in a single memoized pass
    const stats = useMemo(() => {
        const total = students.length;
        if (total === 0) return { submitted: 0, average: 0, pending: 0, rate: 0 };

        let submitted = 0;
        let pending = 0;
        let totalScore = 0;

        students.forEach(s => {
            const status = s.pivot?.status;
            if (status === 'submitted' || status === 'checked') submitted++;
            if (status === 'submitted') pending++;
            totalScore += Number(s.pivot?.score ?? 0);
        });

        return {
            submitted,
            pending,
            average: totalScore / total,
            rate: (submitted / total) * 100
        };
    }, [students]);

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 ">
            <MetricCard
                label="Submission Rate"
                value={`${Math.round(stats.rate)}%`}
                subtext={`${stats.submitted}/${students.length} students`}
                icon={CheckCircle2}
                // High-performance hint: UI changes based on data thresholds
                variant={stats.rate === 100 ? "success" : "default"}
            />

            <MetricCard
                label="Average Score"
                value={stats.average.toFixed(1)}
                subtext={`Out of ${totalMarks} pts`}
                icon={BarChart3}
                trend={stats.average > totalMarks * 0.7 ? 'up' : 'down'}
            />

            <MetricCard
                label="Questions"
                value={totalQuestions}
                subtext="Total items in exam"
                icon={BookOpen}
            />

            <MetricCard
                label="Pending Review"
                value={stats.pending}
                subtext={stats.pending > 0 ? "Requires action" : "All caught up"}
                icon={AlertCircle}
                // UX: Use amber only when there's actual work to do
                color={stats.pending > 0 ? "text-amber-600" : "text-slate-400"}
                className={stats.pending > 0 ? "ring-2 ring-amber-500/20" : ""}
            />
        </div>
    );
}