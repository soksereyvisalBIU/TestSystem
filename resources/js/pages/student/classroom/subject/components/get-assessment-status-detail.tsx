import { Assessment } from "@/types/student/assessment";
import { AlertTriangle, Calendar, CheckCircle, Hourglass, XOctagon, Clock } from "lucide-react";

export type AssessmentStatusDetails = {
    badgeVariant: 'default' | 'outline' | 'secondary';
    badgeColorClass: string;
    icon: React.ReactNode;
    subtitle: string;
    label: string;
    isUrgent: boolean;
};

export function getAssessmentStatusDetails(assessment: Assessment): AssessmentStatusDetails {
    const now = new Date();
    const start = new Date(assessment.start_time);
    const end = new Date(assessment.end_time);
    
    const isUpcoming = now < start;
    const isExpired = now > end;
    const isOngoing = now >= start && now <= end;

    const studentStatus = assessment?.student_assessment?.status; 
    const studentScore = assessment?.student_assessment?.score;

    // Default "Unknown" state using your new theme variables
    const defaults: AssessmentStatusDetails = {
        badgeVariant: 'outline',
        badgeColorClass: 'bg-muted text-muted-foreground border-border',
        icon: <Clock className="h-3 w-3" />,
        subtitle: 'View Details',
        label: 'STATUS',
        isUrgent: false,
    };

    // 1. COMPLETED / SCORED
    if (studentStatus === 'scored') {
        return {
            ...defaults,
            label: 'COMPLETED',
            // Using your semantic --success color
            badgeColorClass: 'bg-success text-white border-transparent shadow-sm',
            icon: <CheckCircle className="h-3 w-3" />,
            subtitle: `Score: ${studentScore}%`,
        };
    }

    // 2. SUBMITTED / AWAITING GRADE
    if (studentStatus === 'attempted' || (assessment?.student_assessment?.attempted_amount ?? 0) > 0) {
        return {
            ...defaults,
            label: 'SUBMITTED',
            // Using your primary (BELTEI Navy) but as a subtle outline/soft background
            badgeColorClass: 'bg-primary/10 text-primary border-primary/20',
            icon: <Hourglass className="h-3 w-3" />,
            subtitle: 'Awaiting Grade',
        };
    }

    // 3. MISSED
    if (studentStatus === 'missed' || (isExpired && !studentStatus)) {
        return {
            ...defaults,
            label: 'MISSED',
            // Using your --destructive (Logo Crimson) color
            badgeColorClass: 'bg-destructive/10 text-destructive border-destructive/20',
            icon: <XOctagon className="h-3 w-3" />,
            subtitle: `Closed ${end.toLocaleDateString([], { month: 'short', day: 'numeric' })}`,
        };
    }

    // 4. ACTIVE / ONGOING
    if (isOngoing) {
        const diffMs = end.getTime() - now.getTime();
        const diffInHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffInMinutes = Math.floor(diffMs / (1000 * 60));
        const diffInDays = Math.floor(diffInHours / 24);

        let timeLabel = diffInDays > 0 ? `${diffInDays}d left` : diffInHours > 0 ? `${diffInHours}h left` : `${diffInMinutes}m left`;

        return {
            ...defaults,
            label: 'ACTIVE',
            // Using a custom amber logic or your --accent color
            badgeColorClass: 'bg-amber-500/10 text-amber-600 border-amber-500/30 shadow-sm animate-pulse dark:text-amber-400',
            icon: <AlertTriangle className="h-3 w-3" />,
            subtitle: timeLabel,
            isUrgent: diffInHours < 24,
        };
    }

    // 5. UPCOMING
    if (isUpcoming) {
        return {
            ...defaults,
            label: 'UPCOMING',
            badgeColorClass: 'bg-secondary text-secondary-foreground border-border',
            icon: <Calendar className="h-3 w-3" />,
            subtitle: `Starts ${start.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`,
        };
    }

    // 6. FALLBACK
    return {
        ...defaults,
        label: 'CLOSED',
        badgeColorClass: 'bg-muted text-muted-foreground border-border',
        icon: <CheckCircle className="h-3 w-3" />,
        subtitle: assessment.score ? `Class Avg: ${assessment.score}%` : 'Past Due',
    };
}