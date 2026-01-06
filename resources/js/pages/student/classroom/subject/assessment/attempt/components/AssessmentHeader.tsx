import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { AttemptStats } from '@/types/student/assessment';
import { Clock, Cloud, Loader2, WifiOff } from 'lucide-react'; // Added icons
import { formatTime } from './function/formatTime';

interface AssessmentHeaderProps {
    stats: AttemptStats;
    isOnline: boolean;
    isSaving: boolean; // New prop from parent
    timeLeft: number;
    onSubmit: () => void;
    disableSubmit?: boolean;
}

export function AssessmentHeader({
    stats,
    isOnline,
    isSaving,
    timeLeft,
    onSubmit,
    disableSubmit = false,
}: AssessmentHeaderProps) {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/90 shadow-sm backdrop-blur-md dark:bg-zinc-900/90">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2 sm:px-4 sm:py-3">
                
                {/* 1. Left: Progress (Hidden on mobile to save space) */}
                <div className="hidden md:flex flex-1 items-center gap-6">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                            Progress
                        </span>
                        <div className="flex items-center gap-3">
                            <Progress value={stats.progress} className="h-2 w-32 lg:w-48" />
                            <span className="text-sm font-bold tabular-nums">
                                {stats.answered}/{stats.total}
                            </span>
                        </div>
                    </div>
                </div>

                {/* 2. Center: Sync & Timer (Primary focus for XS) */}
                <div className="flex items-center gap-2 sm:gap-4">
                    <SyncStatus isOnline={isOnline} isSaving={isSaving} />
                    
                    {/* Vertical Divider - hidden on very small screens */}
                    <div className="hidden h-6 w-px bg-slate-200 xs:block dark:bg-zinc-800" />
                    
                    <TimerDisplay timeLeft={timeLeft} />
                </div>

                {/* 3. Right: Submit Action */}
                <div className="flex flex-1 items-center justify-end">
                    <Button
                        onClick={onSubmit}
                        disabled={!isOnline || disableSubmit}
                        size="sm"
                        variant={stats.progress === 100 ? 'default' : 'outline'}
                        className={cn(
                            'h-9 rounded-lg px-4 font-bold transition-all sm:h-10 sm:rounded-xl sm:px-6',
                            stats.progress === 100
                                ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700'
                                : 'text-xs sm:text-sm',
                        )}
                    >
                        {/* Shorter text for XS */}
                        <span className="xs:hidden">Finish</span>
                        <span className="hidden xs:inline">Finish Assessment</span>
                    </Button>
                </div>
            </div>

            {/* 4. Bottom Progress Bar (Mobile Only) */}
            {/* We show a full-width slim progress bar at the very bottom of the header for XS */}
            <div className="md:hidden h-1 w-full bg-slate-100 dark:bg-zinc-800">
                <div 
                    className="h-full bg-indigo-500 transition-all duration-500" 
                    style={{ width: `${stats.progress}%` }}
                />
            </div>
        </header>
    );
}

function SyncStatus({ isOnline, isSaving }: { isOnline: boolean; isSaving: boolean }) {
    if (!isOnline) {
        return (
            <div className="flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-red-600 dark:bg-red-900/20">
                <WifiOff className="h-3 w-3 animate-pulse" />
                <span className="text-[9px] font-black uppercase">Offline</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-1.5 px-1">
            {isSaving ? (
                <Loader2 className="h-3 w-3 animate-spin text-indigo-500" />
            ) : (
                <Cloud className="h-3 w-3 text-emerald-500" />
            )}
            {/* Label hidden on XS, visible on SM+ */}
            <span className="hidden sm:inline text-[10px] font-bold uppercase text-slate-500">
                {isSaving ? 'Saving' : 'Synced'}
            </span>
        </div>
    );
}

function TimerDisplay({ timeLeft }: { timeLeft: number }) {
    const isUrgent = timeLeft < 300;

    return (
        <div className={cn(
            'flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-mono text-xs sm:text-sm font-bold',
            isUrgent 
                ? 'bg-red-50 text-red-600 animate-pulse' 
                : 'bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300'
        )}>
            <Clock className="h-3.5 w-3.5" />
            <span className="tabular-nums">{formatTime(timeLeft)}</span>
        </div>
    );
}
// // ============================================================================
// // SUB-COMPONENTS (Internal for cleaner code)
// // ============================================================================

// function SyncStatus({
//     isOnline,
//     isSaving,
// }: {
//     isOnline: boolean;
//     isSaving: boolean;
// }) {
//     if (!isOnline) {
//         return (
//             <div className="flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-red-600 dark:bg-red-900/20">
//                 <WifiOff className="h-3.5 w-3.5 animate-pulse" />
//                 <span className="text-[10px] font-bold uppercase">Offline</span>
//             </div>
//         );
//     }

//     return (
//         <div className="flex items-center gap-2 px-2 text-slate-500">
//             {isSaving ? (
//                 <>
//                     <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-500" />
//                     <span className="text-[10px] font-bold tracking-tight uppercase">
//                         Saving...
//                     </span>
//                 </>
//             ) : (
//                 <>
//                     <Cloud className="h-3.5 w-3.5 text-emerald-500" />
//                     <span className="text-[10px] font-bold tracking-tight uppercase opacity-60">
//                         Synced
//                     </span>
//                 </>
//             )}
//         </div>
//     );
// }

// function TimerDisplay({ timeLeft }: { timeLeft: number }) {
//     const isUrgent = timeLeft < 300; // 5 minutes

//     return (
//         <div
//             className={cn(
//                 'flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-sm font-bold transition-colors',
//                 isUrgent
//                     ? 'animate-pulse bg-red-50 text-red-600 dark:bg-red-900/30'
//                     : 'bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300',
//             )}
//         >
//             <Clock className={cn('h-4 w-4', isUrgent && 'text-red-500')} />
//             <span className="tabular-nums">{formatTime(timeLeft)}</span>
//         </div>
//     );
// }
