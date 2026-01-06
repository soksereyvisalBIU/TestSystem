import { memo } from 'react';
import { Clock, Layers, RefreshCw, HelpCircle } from 'lucide-react';
import type { Assessment } from '@/types/student/confirm';

interface InfoItemProps {
    label: string;
    value: string;
    icon: React.ElementType;
    highlight?: boolean;
    subValue?: string;
}

const InfoItem = ({ label, value, icon: Icon, highlight, subValue }: InfoItemProps) => (
    <div className={`
        group relative flex flex-col items-center justify-center rounded-2xl border p-5 transition-all duration-300
        ${highlight 
            ? 'border-blue-100 bg-blue-50/30 shadow-sm dark:border-blue-900/20 dark:bg-blue-900/10' 
            : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-800/40 dark:hover:border-gray-700'
        }
    `}>
        {/* Icon Accent */}
        <div className={`
            mb-3 flex h-10 w-10 items-center justify-center rounded-xl transition-colors
            ${highlight 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400'
            }
        `}>
            <Icon size={20} strokeWidth={2.5} />
        </div>

        <span className="mb-1 text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 dark:text-gray-500">
            {label}
        </span>
        
        <div className="flex flex-col items-center">
            <span className={`text-base font-bold tracking-tight ${
                highlight ? 'text-blue-700 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'
            }`}>
                {value}
            </span>
            {subValue && (
                <span className="text-[10px] font-medium text-gray-400">
                    {subValue}
                </span>
            )}
        </div>
    </div>
);

interface InfoGridProps {
    assessment: Assessment;
    attemptsUsed: number;
    highlightAttempts: boolean;
}

export const InfoGrid = memo(({ assessment, attemptsUsed, highlightAttempts }: InfoGridProps) => {
    const maxAttempts = assessment.max_attempts === 0 ? 'Unlimited' : assessment.max_attempts;
    const isUnlimited = assessment.max_attempts === 0;
    
    // Logic for "Attempts" color
    const isLastAttempt = !isUnlimited && attemptsUsed === (assessment.max_attempts - 1);

    return (
        // <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Assessment Type */}
            <InfoItem 
                label="Format" 
                value={assessment.type || 'Standard'} 
                icon={Layers} 
            />

            {/* Assessment Duration */}
            <InfoItem 
                label="Duration" 
                value={`${assessment.duration} min`} 
                subValue="Allotted Time"
                icon={Clock} 
            />

            {/* Attempts Management */}
            <InfoItem
                label="Attempts"
                value={`${attemptsUsed} / ${isUnlimited ? '∞' : assessment.max_attempts}`}
                subValue={isLastAttempt ? "Last chance!" : "Used so far"}
                icon={RefreshCw}
                highlight={highlightAttempts || isLastAttempt}
            />
        </div>
    );
});

InfoGrid.displayName = 'InfoGrid';