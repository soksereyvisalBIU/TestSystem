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
        <Card className="overflow-hidden rounded-[2rem] border-none bg-white shadow-xl shadow-slate-200/50">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-6">
                <div className="space-y-1">
                    <CardTitle className="text-xl font-black tracking-tight text-slate-900">
                        {title}
                    </CardTitle>
                    <CardDescription className="text-sm font-medium text-slate-500">
                        {description}
                    </CardDescription>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-blue-600">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-xs font-black uppercase tracking-wider">+4.2%</span>
                </div>
            </CardHeader>

            <CardContent>
                <div className="relative pt-10">
                    {/* Background Grid Lines for context */}
                    <div className="absolute inset-0 flex flex-col justify-between pb-10 pt-10 opacity-[0.03]">
                        {[0, 25, 50, 75, 100].map((line) => (
                            <div key={line} className="w-full border-t-2 border-slate-900" />
                        ))}
                    </div>

                    <div className="relative flex h-64 w-full items-end justify-between gap-2 px-2 sm:gap-4">
                        {data.map((h, i) => (
                            <div key={i} className="group relative flex h-full w-full flex-col justify-end">
                                {/* Tooltip / Value on Hover */}
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    whileHover={{ opacity: 1, y: 0 }}
                                    className="absolute -top-8 left-1/2 z-20 -translate-x-1/2 rounded-lg bg-slate-900 px-2 py-1 shadow-xl shadow-slate-900/20"
                                >
                                    <span className="text-xs font-black text-white">{h}%</span>
                                    <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-slate-900" />
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
                                    className={`relative w-full min-w-[12px] rounded-t-xl transition-all duration-300 group-hover:brightness-110 ${
                                        h < 60 
                                            ? 'bg-gradient-to-t from-rose-500 to-rose-400' 
                                            : 'bg-gradient-to-t from-blue-600 to-indigo-400'
                                    }`}
                                >
                                    {/* Glass reflection effect inside the bar */}
                                    <div className="absolute inset-x-0 top-0 h-1/2 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
                                </motion.div>

                                {/* Label */}
                                <div className="mt-4 text-center">
                                    <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400 transition-colors group-hover:text-slate-900">
                                        Activity {i + 1}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Legend / Info Footer */}
                <div className="mt-8 flex items-center justify-between border-t border-slate-50 pt-6">
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-blue-500" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Average</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-rose-500" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">At Risk</span>
                        </div>
                    </div>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300">
                                    <Info className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="text-xs">Based on latest LMS sync data</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </CardContent>
        </Card>
    );
}