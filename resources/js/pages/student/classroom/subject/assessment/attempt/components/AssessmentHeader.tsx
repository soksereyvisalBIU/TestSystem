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
        <header className="sticky top-0 z-50 w-full border-b bg-white/80 shadow-sm backdrop-blur-md dark:bg-zinc-900/80">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                {/* Progress Section */}
                <div className="flex flex-1 items-center gap-6 hidden md:block">
                    <div className="hidden md:block">
                        <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                                    Progress
                                </span>
                                <div className="flex items-center gap-3">
                                    <Progress
                                        value={stats.progress}
                                        className="h-2 w-32 md:w-48"
                                    />
                                    <span className="text-sm font-bold tabular-nums">
                                        {stats.answered}/{stats.total}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Center: Sync & Timer Status */}
                <div className="flex items-center gap-3">
                    <SyncStatus isOnline={isOnline} isSaving={isSaving} />
                    <div className="hidden h-8 w-px bg-slate-200 sm:block dark:bg-zinc-800" />
                    <TimerDisplay timeLeft={timeLeft} />
                </div>

                {/* Actions Section */}
                <div className="flex flex-1 items-center justify-end gap-4">
                    <Button
                        onClick={onSubmit}
                        disabled={!isOnline || disableSubmit}
                        variant={stats.progress === 100 ? 'default' : 'outline'}
                        className={cn(
                            'rounded-xl px-6 font-bold transition-all duration-300',
                            stats.progress === 100
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700'
                                : '',
                        )}
                    >
                        {/* Finish Assessment */}
                        Finish
                    </Button>
                </div>
            </div>
        </header>
    );
}

// ============================================================================
// SUB-COMPONENTS (Internal for cleaner code)
// ============================================================================

function SyncStatus({
    isOnline,
    isSaving,
}: {
    isOnline: boolean;
    isSaving: boolean;
}) {
    if (!isOnline) {
        return (
            <div className="flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-red-600 dark:bg-red-900/20">
                <WifiOff className="h-3.5 w-3.5 animate-pulse" />
                <span className="text-[10px] font-bold uppercase">Offline</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2 px-2 text-slate-500">
            {isSaving ? (
                <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-500" />
                    <span className="text-[10px] font-bold tracking-tight uppercase">
                        Saving...
                    </span>
                </>
            ) : (
                <>
                    <Cloud className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="text-[10px] font-bold tracking-tight uppercase opacity-60">
                        Synced
                    </span>
                </>
            )}
        </div>
    );
}

function TimerDisplay({ timeLeft }: { timeLeft: number }) {
    const isUrgent = timeLeft < 300; // 5 minutes

    return (
        <div
            className={cn(
                'flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-sm font-bold transition-colors',
                isUrgent
                    ? 'animate-pulse bg-red-50 text-red-600 dark:bg-red-900/30'
                    : 'bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300',
            )}
        >
            <Clock className={cn('h-4 w-4', isUrgent && 'text-red-500')} />
            <span className="tabular-nums">{formatTime(timeLeft)}</span>
        </div>
    );
}
