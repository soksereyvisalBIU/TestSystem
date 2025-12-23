import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

interface StatCardProps {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string | number;
    color: string;
    bg: string;
    trend?: string; // Optional: e.g. "+12%"
}

export function StatCard({
    icon: Icon,
    label,
    value,
    color,
    bg,
    trend
}: StatCardProps) {
    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
        >
            <Card className="relative overflow-hidden rounded-3xl border-none shadow-xl shadow-slate-200/60 bg-white group">
                {/* Decorative background element */}
                <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-5 transition-transform group-hover:scale-150 ${bg}`} />

                <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                        {/* Icon Container with Glass Effect */}
                        <div
                            className={`flex h-12 w-12 items-center justify-center rounded-2xl shadow-inner transition-colors duration-500 ${bg} ${color}`}
                        >
                            <Icon className="h-6 w-6" />
                        </div>

                        {/* Trend Badge (UX Bonus) */}
                        {trend && (
                            <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-600">
                                <TrendingUp className="h-3 w-3" />
                                {trend}
                            </div>
                        )}
                    </div>

                    <div className="mt-5 space-y-0.5">
                        <p className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400">
                            {label}
                        </p>
                        <h3 className="text-3xl font-black tracking-tight text-slate-900 leading-none">
                            {value}
                        </h3>
                    </div>

                    {/* Progress Bar (Visual Detail) */}
                    <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: "70%" }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className={`h-full rounded-full opacity-60 ${color.replace('text', 'bg')}`}
                        />
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}