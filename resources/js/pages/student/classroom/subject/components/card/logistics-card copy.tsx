import { motion } from 'framer-motion';
import { Clock, MapPin, Star, CalendarDays, ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LogisticsCardProps {
    schedule: string;
    location: string;
    credits: string;
}

export function LogisticsCard({
    schedule,
    location,
    credits,
}: LogisticsCardProps) {
    return (
        <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
        >
            <Card className="overflow-hidden rounded-[2rem] border-none shadow-xl shadow-slate-200/50 bg-white">
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-black uppercase tracking-[0.15em] text-slate-400">
                            Course Details
                        </CardTitle>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400">
                            <CalendarDays className="h-4 w-4" />
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-5 pt-2">
                    {/* Schedule Block - Highlighted */}
                    <div className="group relative rounded-2xl bg-slate-50 p-4 transition-colors hover:bg-blue-50/50">
                        <div className="flex items-start gap-3">
                            <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm text-blue-600">
                                <Clock className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Schedule</p>
                                <p className="text-sm font-bold text-slate-900 leading-tight">
                                    {schedule}
                                </p>
                                <div className="mt-2 flex items-center gap-1.5">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </span>
                                    <span className="text-[10px] font-bold text-emerald-600 uppercase">Live Session</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Location & Credits Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1 px-1">
                            <div className="flex items-center gap-2 text-slate-400">
                                <MapPin className="h-3.5 w-3.5" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Location</span>
                            </div>
                            <p className="text-sm font-bold text-slate-900 truncate" title={location}>
                                {location}
                            </p>
                        </div>

                        <div className="space-y-1 border-l border-slate-100 pl-4">
                            <div className="flex items-center gap-2 text-slate-400">
                                <Star className="h-3.5 w-3.5" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Credits</span>
                            </div>
                            <p className="text-sm font-bold text-slate-900">
                                {credits}
                            </p>
                        </div>
                    </div>

                    {/* Interactive "Find Room" Button (UX Bonus) */}
                    <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 py-3 text-xs font-bold text-slate-500 transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600">
                        View Campus Map
                        <ArrowUpRight className="h-3 w-3" />
                    </button>
                </CardContent>
            </Card>
        </motion.div>
    );
}