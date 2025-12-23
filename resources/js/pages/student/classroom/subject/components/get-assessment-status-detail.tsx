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

/**
 * getAssessmentStatusDetails
 * Determines the visual state of an assessment based on the current time 
 * and the specific student's progress.
 */
export function getAssessmentStatusDetails(assessment: Assessment): AssessmentStatusDetails {
    // 1. Initialize Dates
    const now = new Date();
    const start = new Date(assessment.start_time);
    const end = new Date(assessment.end_time);
    
    // 2. Determine Temporal State (Dynamic calculation)
    const isUpcoming = now < start;
    const isExpired = now > end;
    const isOngoing = now >= start && now <= end;

    // 3. Extract Student Specifics (Handle potential nulls from backend)
    const studentStatus = assessment.student_status; // 'scored' | 'attempted' | 'missed' | null
    const studentScore = assessment.student_score;

    // Default "Unknown" state
    const defaults: AssessmentStatusDetails = {
        badgeVariant: 'outline',
        badgeColorClass: 'bg-slate-50 text-slate-500 border-slate-200',
        icon: <Clock className="h-3 w-3" />,
        subtitle: 'View Details',
        label: 'STATUS',
        isUrgent: false,
    };

    // ==========================================================
    // PRIORITY 1: PERSONAL PROGRESS (What the student did)
    // ==========================================================
    
    if (studentStatus === 'scored') {
        return {
            ...defaults,
            label: 'COMPLETED',
            badgeColorClass: 'bg-emerald-500 text-white border-transparent shadow-sm shadow-emerald-100',
            icon: <CheckCircle className="h-3 w-3" />,
            subtitle: `Score: ${studentScore}%`,
        };
    }

    if (studentStatus === 'attempted') {
        return {
            ...defaults,
            label: 'SUBMITTED',
            badgeColorClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
            icon: <Hourglass className="h-3 w-3" />,
            subtitle: 'Awaiting Grade',
        };
    }

    // A student only "misses" an assessment if the time has actually expired
    if (studentStatus === 'missed' || (isExpired && !studentStatus)) {
        return {
            ...defaults,
            label: 'MISSED',
            badgeColorClass: 'bg-rose-50 text-rose-700 border-rose-200',
            icon: <XOctagon className="h-3 w-3" />,
            subtitle: `Closed ${end.toLocaleDateString([], { month: 'short', day: 'numeric' })}`,
        };
    }

    // ==========================================================
    // PRIORITY 2: ACTIVE STATES (What is happening now)
    // ==========================================================

    if (isOngoing) {
        const diffMs = end.getTime() - now.getTime();
        const diffInHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffInMinutes = Math.floor(diffMs / (1000 * 60));
        const diffInDays = Math.floor(diffInHours / 24);

        let timeLabel = "";
        if (diffInDays > 0) timeLabel = `${diffInDays}d left`;
        else if (diffInHours > 0) timeLabel = `${diffInHours}h left`;
        else timeLabel = `${diffInMinutes}m left`;

        return {
            ...defaults,
            label: 'ACTIVE',
            badgeColorClass: 'bg-amber-100 text-amber-700 border-amber-300 shadow-sm animate-pulse',
            icon: <AlertTriangle className="h-3 w-3" />,
            subtitle: timeLabel,
            isUrgent: diffInHours < 24,
        };
    }

    if (isUpcoming) {
        return {
            ...defaults,
            label: 'UPCOMING',
            badgeColorClass: 'bg-blue-50 text-blue-700 border-blue-200',
            icon: <Calendar className="h-3 w-3" />,
            subtitle: `Starts ${start.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`,
        };
    }

    // ==========================================================
    // PRIORITY 3: FALLBACK (Generic Closed state)
    // ==========================================================

    return {
        ...defaults,
        label: 'CLOSED',
        badgeColorClass: 'bg-slate-100 text-slate-600 border-slate-200',
        icon: <CheckCircle className="h-3 w-3" />,
        subtitle: assessment.score ? `Class Avg: ${assessment.score}%` : 'Past Due',
    };
}