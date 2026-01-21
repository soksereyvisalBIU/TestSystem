import { Assessment } from "@/types/student/assessment";
import { AlertTriangle, Calendar, CheckCircle, Hourglass, XOctagon, Clock, LucideIcon } from "lucide-react";

export type AssessmentStatusDetails = {
    badgeVariant: 'default' | 'outline' | 'secondary';
    badgeColorClass: string;
    icon: LucideIcon; // Performance: Pass the component reference, not the rendered JSX
    subtitle: string;
    label: string;
    isUrgent: boolean;
};

export function getAssessmentStatusDetails(assessment: Assessment): AssessmentStatusDetails {
    // 1. PERFORMANCE: Cache current timestamp and parse dates once
    const nowMs = Date.now();
    const startMs = new Date(assessment.start_time).getTime();
    const endMs = new Date(assessment.end_time).getTime();
    
    const isUpcoming = nowMs < startMs;
    const isExpired = nowMs > endMs;
    const isOngoing = !isUpcoming && !isExpired;

    const studentData = assessment?.student_assessment;
    const studentStatus = studentData?.status; 
    const studentScore = studentData?.score;
    const attemptedAmount = studentData?.attempted_amount ?? 0;

    // Default configuration (Safe Fallback)
    const defaults: AssessmentStatusDetails = {
        badgeVariant: 'outline',
        badgeColorClass: 'bg-muted text-muted-foreground border-border',
        icon: Clock,
        subtitle: 'View Details',
        label: 'STATUS',
        isUrgent: false,
    };

    // 2. HIGH PRIORITY: SCORED (Final State)
    if (studentStatus === 'scored') {
        return {
            ...defaults,
            label: 'COMPLETED',
            badgeColorClass: 'bg-success text-white border-transparent shadow-sm',
            icon: CheckCircle,
            subtitle: `Score: ${studentScore}%`,
        };
    }

    // 3. SUBMITTED / ATTEMPTED
    if (studentStatus === 'attempted' || attemptedAmount > 0) {
        return {
            ...defaults,
            label: 'SUBMITTED',
            badgeColorClass: 'bg-primary/10 text-primary border-primary/20',
            icon: Hourglass,
            subtitle: 'Awaiting Grade',
        };
    }

    // 4. MISSED (Expired without submission)
    if (studentStatus === 'missed' || (isExpired && !studentStatus)) {
        return {
            ...defaults,
            label: 'MISSED',
            badgeColorClass: 'bg-destructive/10 text-destructive border-destructive/20',
            icon: XOctagon,
            subtitle: `Closed ${new Date(endMs).toLocaleDateString([], { month: 'short', day: 'numeric' })}`,
        };
    }

    // 5. ACTIVE / ONGOING (Requires time calculation)
    if (isOngoing) {
        const diffMs = endMs - nowMs;
        const diffInMinutes = (diffMs / 60000) | 0; // Performance: Bitwise floor
        const diffInHours = (diffInMinutes / 60) | 0;
        const diffInDays = (diffInHours / 24) | 0;

        const timeLabel = diffInDays > 0 
            ? `${diffInDays}d left` 
            : diffInHours > 0 
                ? `${diffInHours}h left` 
                : `${diffInMinutes}m left`;

        return {
            ...defaults,
            label: 'ACTIVE',
            badgeColorClass: 'bg-amber-500/10 text-amber-600 border-amber-500/30 shadow-sm animate-pulse dark:text-amber-400',
            icon: AlertTriangle,
            subtitle: timeLabel,
            isUrgent: diffInHours < 24, // Business logic: Urgent if less than 24h
        };
    }

    // 6. UPCOMING
    if (isUpcoming) {
        return {
            ...defaults,
            label: 'UPCOMING',
            badgeColorClass: 'bg-secondary text-secondary-foreground border-border',
            icon: Calendar,
            subtitle: `Starts ${new Date(startMs).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`,
        };
    }

    // 7. FALLBACK / CLOSED (Past events with no student data)
    return {
        ...defaults,
        label: 'CLOSED',
        badgeColorClass: 'bg-muted text-muted-foreground border-border',
        icon: CheckCircle,
        subtitle: assessment.score ? `Class Avg: ${assessment.score}%` : 'Past Due',
    };
}