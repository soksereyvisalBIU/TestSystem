import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, BadgeCheck } from 'lucide-react';

interface InstructorCardProps {
    name: string;
    title: string;
    avatar?: string;
}

export function InstructorCard({ name, title, avatar }: InstructorCardProps) {
    return (
        <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
        >
            <Card className="overflow-hidden rounded-[2rem] border-none bg-card shadow-xl shadow-black/5 transition-colors duration-300 py-0">
                {/* Visual Header Decoration - Using Primary Brand Color */}
                <div className="h-20 w-full bg-gradient-to-r from-primary to-primary/80 p-6 relative">
                    <div className="absolute top-0 right-0 p-4 opacity-20">
                        <BadgeCheck className="h-16 w-16 text-white rotate-12" />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-widest text-white/80">
                        Lead Instructor
                    </p>
                </div>

                <CardContent className="relative px-6 pb-6 pt-0">
                    <div className="flex flex-col items-center">
                        {/* Overlapping Avatar - border matches card background for "cutout" effect */}
                        <div className="-mt-10 mb-4 rounded-full border-4 border-card shadow-lg transition-colors duration-300">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src={avatar} alt={name} className="object-cover" />
                                <AvatarFallback className="bg-muted text-xl font-bold text-primary">
                                    {name.split(' ').map((n) => n[0]).join('')}
                                </AvatarFallback>
                            </Avatar>
                        </div>

                        {/* Text Info */}
                        <div className="text-center space-y-1">
                            <h3 className="text-xl font-black text-title tracking-tight">
                                {name}
                            </h3>
                            <p className="text-sm font-semibold text-primary">
                                {title}
                            </p>
                        </div>

                        {/* Quick Actions */}
                        <div className="mt-6 flex w-full gap-2">
                            <Button 
                                variant="outline" 
                                className="flex-1 rounded-xl border-border font-bold hover:bg-primary/10 hover:text-primary transition-colors"
                                onClick={() => window.location.href = `mailto:instructor@beltei.edu.kh`}
                            >
                                <Mail className="mr-2 h-4 w-4" />
                                Email
                            </Button>
                            <Button 
                                className="flex-1 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-all shadow-md active:scale-95"
                                onClick={() => console.log('Open Chat')}
                            >
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Chat
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}