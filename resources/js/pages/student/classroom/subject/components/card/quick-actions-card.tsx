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
        <Card className="overflow-hidden py-0 rounded-[2rem] border-none bg-card shadow-xl shadow-black/5 transition-colors duration-300">
            <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                    {/* Replaced amber with primary/success logic or brand-neutral warning */}
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-4/10 text-chart-4">
                        <Zap className="h-4 w-4 fill-current" />
                    </div>
                    <CardTitle className="text-sm font-black uppercase tracking-widest text-title">
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
                            className="group relative h-14 w-full justify-between overflow-hidden rounded-2xl bg-muted/50 px-4 transition-all hover:bg-primary hover:text-primary-foreground"
                        >
                            <div className="flex items-center gap-3">
                                {/* Inner icon box adapts to hover */}
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-card text-muted-foreground shadow-sm group-hover:bg-primary-foreground/20 group-hover:text-primary-foreground transition-colors">
                                    <action.icon className="h-5 w-5" />
                                </div>
                                <span className="font-bold tracking-tight">{action.label}</span>
                            </div>
                            
                            <ChevronRight className="h-4 w-4 opacity-30 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                            
                            {/* Brand gradient glow on hover */}
                            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Button>
                    </motion.div>
                ))}
            </CardContent>
            
            {/* Footer Tip - Adaptive Background */}
            <div className="bg-muted/30 px-6 py-3 border-t border-border">
                <p className="text-[10px] text-center font-medium text-description">
                    Need help? <span className="text-primary cursor-pointer hover:underline">Contact Support</span>
                </p>
            </div>
        </Card>
    );
}