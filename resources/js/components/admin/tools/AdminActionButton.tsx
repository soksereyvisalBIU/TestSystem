import React, { useState, useCallback, useRef } from 'react';
import axios from 'axios';
import { Loader2, AlertTriangle, Zap, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
// import { Button } from '@headlessui/react';
// import { Button } from '@headlessui/react';

interface Props {
    label: string;
    endpoint: string; // Now expects a Ziggy route() string
    danger?: boolean;
    onSuccess?: () => void;
}

const AdminActionButton = ({ label, endpoint, danger, onSuccess }: Props) => {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const lastExecuted = useRef<number>(0);

    const handleAction = useCallback(async () => {
        // PERFORMANCE: Throttle clicks to 2 seconds to prevent redundant server load
        const now = Date.now();
        if (now - lastExecuted.current < 2000 || status === 'loading') return;
        
        // SECURITY: Confirmation for high-risk operations
        if (danger && !window.confirm(`Critical Operation: Are you sure you want to ${label}?`)) return;

        setStatus('loading');
        lastExecuted.current = now;

        try {
            // SECURITY: Use POST for state-changing operations (Artisan commands)
            const { data } = await axios.post(endpoint, {}, { 
                timeout: 15000 // 15s for heavy tasks like migrations
            });
            
            setStatus('success');
            toast.success(data?.message || `${label} executed successfully`);
            onSuccess?.();

            // Reset icon after success animation
            setTimeout(() => setStatus('idle'), 2000);
        } catch (error: any) {
            setStatus('error');
            const msg = error.response?.data?.message || 'Execution failed';
            toast.error(msg, {
                description: "Check Laravel logs for kernel details."
            });
            setTimeout(() => setStatus('idle'), 3000);
        }
    }, [endpoint, label, danger, onSuccess, status]);

    // UI: Dynamic Styling Logic
    const getStyles = () => {
        if (danger) {
            return 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500 hover:text-white hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]';
        }
        if (status === 'success') {
            return 'bg-emerald-500 text-white border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]';
        }
        return 'bg-slate-900/5 text-slate-700 border-slate-200 hover:bg-slate-900 hover:text-white hover:border-slate-900';
    };

    return (
        <Button
            onClick={handleAction}
            disabled={status === 'loading'}
            className={`
                group relative flex w-full items-center justify-between gap-3 overflow-hidden 
                rounded-2xl border px-5 py-6 text-xs font-black uppercase tracking-widest 
                transition-all duration-300 active:scale-[0.97] disabled:cursor-not-allowed
                ${getStyles()}
            `}
        >
            {/* Background "Processing" Fill */}
            {status === 'loading' && (
                <div className="absolute inset-0 bg-current opacity-10 animate-pulse" />
            )}

            <div className="flex items-center gap-3">
                {status === 'loading' ? (
                    <Loader2 size={16} className="animate-spin" />
                ) : status === 'success' ? (
                    <CheckCircle size={16} className="animate-in zoom-in" />
                ) : danger ? (
                    <AlertTriangle size={16} className="transition-transform group-hover:scale-110" />
                ) : (
                    <Zap size={16} className="text-indigo-500 transition-transform group-hover:rotate-12" />
                )}
                <span className="relative z-10">{label}</span>
            </div>

            {/* Micro-Interaction Arrow */}
            <div className={`transition-transform duration-300 ${status === 'loading' ? 'translate-x-4 opacity-0' : 'group-hover:translate-x-1'}`}>
                <div className="h-1 w-1 rounded-full bg-current opacity-50" />
            </div>
        </Button>
    );
};

export default React.memo(AdminActionButton);