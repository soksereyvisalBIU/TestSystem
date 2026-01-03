import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

interface StatCardProps {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string | number;
    color: string; // Should be "text-primary", "text-success", etc.
    bg: string;    // Should be "bg-primary/10", "bg-success/10", etc.
    trend?: string; 
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
            {/* 1. Replaced shadow-slate-200 with a theme-aware shadow or subtle border */}
            <Card className="relative overflow-hidden rounded-3xl border border-border bg-card transition-colors duration-300 group">
                
                {/* 2. Decorative background element - Using the dynamic bg class */}
                <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-10 transition-transform group-hover:scale-150 ${bg}`} />

                <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                        {/* 3. Icon Container - Removed shadow-inner for better dark mode visibility */}
                        <div
                            className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-colors duration-500 ${bg} ${color}`}
                        >
                            <Icon className="h-6 w-6" />
                        </div>

                        {/* 4. Trend Badge - Using success variables */}
                        {trend && (
                            <div className="flex items-center gap-1 rounded-full bg-success/10 px-2 py-1 text-[10px] font-bold text-success">
                                <TrendingUp className="h-3 w-3" />
                                {trend}
                            </div>
                        )}
                    </div>

                    <div className="mt-5 space-y-0.5">
                        {/* 5. Label - Replaced slate-400 with description color */}
                        <p className="text-[10px] font-black uppercase tracking-[0.1em] text-description">
                            {label}
                        </p>
                        {/* 6. Value - Replaced slate-900 with title color */}
                        <h3 className="text-3xl font-black tracking-tight text-title leading-none">
                            {value}
                        </h3>
                    </div>

                    {/* 7. Progress Bar - Replaced slate-100 with muted background */}
                    <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: "70%" }}
                            transition={{ duration: 1, delay: 0.5 }}
                            // 8. Color logic: dynamically switches text-X to bg-X for the bar
                            className={`h-full rounded-full opacity-80 ${color.replace('text-', 'bg-')}`}
                        />
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}