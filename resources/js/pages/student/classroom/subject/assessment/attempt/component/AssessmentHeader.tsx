import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Clock, Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export const AssessmentHeader = ({ stats, timeLeft, isOnline, formatTime, onFinish }: any) => {
    const timeLeftLow = timeLeft < 300;

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/90 shadow-sm backdrop-blur-xl dark:bg-zinc-900/90">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                <div className="flex items-center gap-6">
                    <div className="hidden md:block">
                        <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Progress</span>
                        <div className="flex items-center gap-3">
                            <Progress value={stats.progress} className="h-2.5 w-32 md:w-48" />
                            <span className="text-sm font-bold">{stats.answered}/{stats.total}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl bg-slate-100 px-4 py-2 dark:bg-zinc-800">
                    <div className={cn("flex items-center gap-2", isOnline ? "text-green-600" : "text-red-500 animate-pulse")}>
                        {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
                        <span className="hidden text-[10px] font-black uppercase md:inline">{isOnline ? 'Online' : 'Offline'}</span>
                    </div>
                    <div className="h-4 w-px bg-slate-300 dark:bg-zinc-700" />
                    <div className={cn('flex items-center gap-2 font-mono font-bold', timeLeftLow ? 'animate-pulse text-red-500' : 'text-slate-700 dark:text-zinc-300')}>
                        <Clock className="h-4 w-4" /> {formatTime(timeLeft)}
                    </div>
                </div>

                <button 
                    onClick={onFinish} 
                    disabled={!isOnline} 
                    className="rounded-xl bg-primary px-6 py-2 text-white font-bold shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                    Finish
                </button>
            </div>
        </header>
    );
};