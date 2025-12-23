import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, ChevronRight } from 'lucide-react';

interface QuickActionsCardProps {
    actions: Array<{
        icon: React.ComponentType<{ className?: string }>;
        label: string;
        onClick: () => void;
    }>;
}

export function QuickActionsCard({ actions }: QuickActionsCardProps) {
    return (
        <Card className="overflow-hidden rounded-[2rem] border-none shadow-xl shadow-slate-200/50 bg-white">
            <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                        <Zap className="h-4 w-4 fill-current" />
                    </div>
                    <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-800">
                        Quick Actions
                    </CardTitle>
                </div>
            </CardHeader>

            <CardContent className="flex flex-col gap-3">
                {actions.map((action, index) => (
                    <motion.div
                        key={index}
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Button
                            variant="ghost"
                            onClick={action.onClick}
                            className="group relative h-14 w-full justify-between overflow-hidden rounded-2xl bg-slate-50 px-4 transition-all hover:bg-blue-600 hover:text-white"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                    <action.icon className="h-5 w-5" />
                                </div>
                                <span className="font-bold tracking-tight">{action.label}</span>
                            </div>
                            
                            <ChevronRight className="h-4 w-4 opacity-30 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                            
                            {/* Subtle background glow effect on hover */}
                            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Button>
                    </motion.div>
                ))}
            </CardContent>
            
            {/* Footer Tip */}
            <div className="bg-slate-50/50 px-6 py-3 border-t border-slate-100">
                <p className="text-[10px] text-center font-medium text-slate-400">
                    Need help? <span className="text-blue-600 cursor-pointer hover:underline">Contact Support</span>
                </p>
            </div>
        </Card>
    );
}