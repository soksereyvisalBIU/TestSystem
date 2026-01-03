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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 transition-colors">
            <MetricCard
                label="Submission Rate"
                value={`${Math.round(stats.rate)}%`}
                subtext={`${stats.submitted}/${students.length} students`}
                icon={CheckCircle2}
                // Uses semantic success variant
                variant={stats.rate === 100 ? "success" : "default"}
            />

            <MetricCard
                label="Average Score"
                value={stats.average.toFixed(1)}
                subtext={`Out of ${totalMarks} pts`}
                icon={BarChart3}
                // Logical trending based on 70% pass mark
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
                // UX: Replaced amber-600 with chart-4 (often used for warnings/pending) 
                // and slate-400 with description (muted theme text)
                color={stats.pending > 0 ? "text-chart-4" : "text-description"}
                className={stats.pending > 0 ? "ring-2 ring-chart-4/20 bg-chart-4/5" : "opacity-80"}
            />
        </div>
    );
}