import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { TrendingUp, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

interface PerformanceChartProps {
    data: number[];
    title?: string;
    description?: string;
}

export function PerformanceChart({
    data,
    title = 'Overall Class Performance',
    description = 'Average scores over the last seven graded activities.',
}: PerformanceChartProps) {
    return (
        <Card className="overflow-hidden rounded-[2rem] border-none bg-card transition-colors duration-300">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-6">
                <div className="space-y-1">
                    <CardTitle className="text-xl font-black tracking-tight text-title">
                        {title}
                    </CardTitle>
                    <CardDescription className="text-sm font-medium text-description">
                        {description}
                    </CardDescription>
                </div>
                {/* Trend Badge */}
                <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-primary">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-xs font-black uppercase tracking-wider">+4.2%</span>
                </div>
            </CardHeader>

            <CardContent>
                <div className="relative pt-10">
                    {/* Background Grid Lines - Adaptive Opacity */}
                    <div className="absolute inset-0 flex flex-col justify-between pb-10 pt-10 opacity-10">
                        {[0, 25, 50, 75, 100].map((line) => (
                            <div key={line} className="w-full border-t border-border" />
                        ))}
                    </div>

                    <div className="relative flex h-64 w-full items-end justify-between gap-2 px-2 sm:gap-4">
                        {data.map((h, i) => (
                            <div key={i} className="group relative flex h-full w-full flex-col justify-end">
                                {/* Tooltip / Value on Hover */}
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    whileHover={{ opacity: 1, y: 0 }}
                                    className="absolute -top-8 left-1/2 z-20 -translate-x-1/2 rounded-lg bg-title px-2 py-1 shadow-xl shadow-black/20"
                                >
                                    <span className="text-xs font-black text-background">{h}%</span>
                                    <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-title" />
                                </motion.div>

                                {/* The Animated Bar */}
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ 
                                        type: "spring", 
                                        stiffness: 60, 
                                        damping: 15,
                                        delay: i * 0.1 
                                    }}
                                    // Gradient logic: Destructive for low scores, Primary for high
                                    className={`relative w-full min-w-[12px] rounded-t-xl transition-all duration-300 group-hover:brightness-125 ${
                                        h < 60 
                                            ? 'bg-gradient-to-t from-destructive to-destructive/60' 
                                            : 'bg-gradient-to-t from-primary to-primary/60'
                                    }`}
                                >
                                    <div className="absolute inset-x-0 top-0 h-1/2 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
                                </motion.div>

                                {/* Label */}
                                <div className="mt-4 text-center">
                                    <span className="text-[10px] font-black uppercase tracking-tighter text-description transition-colors group-hover:text-title">
                                        Act {i + 1}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Legend / Info Footer */}
                <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-primary" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-description">Average</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-destructive" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-description">At Risk</span>
                        </div>
                    </div>
                    
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-muted">
                                    <Info className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="bg-popover text-popover-foreground">
                                <p className="text-xs">Based on latest LMS sync data</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </CardContent>
        </Card>
    );
}