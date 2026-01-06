// components/student/confirm/InfoGrid.tsx
import { memo } from 'react';
import { Clock, Layers, RefreshCw } from 'lucide-react';
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
        group relative flex flex-1 items-center gap-3 rounded-xl border p-2.5 sm:flex-col sm:justify-center sm:p-5 sm:gap-0 transition-all duration-300
        ${highlight 
            ? 'border-blue-100 bg-blue-50/40 shadow-sm dark:border-blue-900/20 dark:bg-blue-900/10' 
            : 'border-gray-100 bg-white hover:border-gray-200 dark:border-gray-800 dark:bg-gray-800/40'
        }
    `}>
        {/* Icon: Smaller and side-aligned on XS */}
        <div className={`
            flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors sm:mb-3 sm:h-10 sm:w-10 sm:rounded-xl
            ${highlight 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
            }
        `}>
            <Icon size={16} className="sm:w-5 sm:h-5" strokeWidth={2.5} />
        </div>

        <div className="flex flex-col sm:items-center min-w-0">
            <span className="text-[9px] font-black uppercase tracking-wider text-gray-400 dark:text-gray-500 sm:mb-1 sm:tracking-[0.15em]">
                {label}
            </span>
            
            <div className="flex items-baseline gap-1.5 sm:flex-col sm:items-center sm:gap-0">
                <span className={`text-xs font-bold sm:text-base truncate ${
                    highlight ? 'text-blue-700 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'
                }`}>
                    {value}
                </span>
                {subValue && (
                    <span className="hidden xs:block text-[9px] font-medium text-gray-400 sm:text-[10px]">
                        {subValue}
                    </span>
                )}
            </div>
        </div>
    </div>
);

interface InfoGridProps {
    assessment: Assessment;
    attemptsUsed: number;
    highlightAttempts: boolean;
}

export const InfoGrid = memo(({ assessment, attemptsUsed, highlightAttempts }: InfoGridProps) => {
    const isUnlimited = assessment.max_attempts === 0;
    const isLastAttempt = !isUnlimited && attemptsUsed === (assessment.max_attempts - 1);

    return (
        /* UX FIX: 
           - Change from vertical stack to 1 column on tiny screens, 
           - BUT we use flex-row or grid-cols-3 to keep it thin.
           - We use grid-cols-1 (stack) but let InfoItem handle the row layout internally for mobile.
        */
        <div className="flex flex-col gap-2 sm:grid sm:grid-cols-3 sm:gap-4">
            <InfoItem 
                label="Format" 
                value={assessment.type || 'Standard'} 
                icon={Layers} 
            />

            <InfoItem 
                label="Duration" 
                value={`${assessment.duration}m`} 
                subValue="Time"
                icon={Clock} 
            />

            <InfoItem
                label="Attempts"
                value={`${attemptsUsed}/${isUnlimited ? '∞' : assessment.max_attempts}`}
                subValue={isLastAttempt ? "Last!" : "Used"}
                icon={RefreshCw}
                highlight={highlightAttempts || isLastAttempt}
            />
        </div>
    );
});

InfoGrid.displayName = 'InfoGrid';