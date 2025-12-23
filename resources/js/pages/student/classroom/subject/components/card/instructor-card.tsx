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
            <Card className="overflow-hidden rounded-[2rem] border-none shadow-xl shadow-slate-200/50">
                {/* Visual Header Decoration */}
                <div className="h-20 w-full bg-gradient-to-r from-blue-600 to-indigo-700 p-6 relative">
                    <div className="absolute top-0 right-0 p-4 opacity-20">
                        <BadgeCheck className="h-16 w-16 text-white rotate-12" />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-widest text-blue-100/80">
                        Lead Instructor
                    </p>
                </div>

                <CardContent className="relative px-6 pb-6 pt-0">
                    <div className="flex flex-col items-center">
                        {/* Overlapping Avatar */}
                        <div className="-mt-10 mb-4 rounded-full border-4 border-white shadow-lg">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src={avatar} alt={name} className="object-cover" />
                                <AvatarFallback className="bg-slate-100 text-xl font-bold text-blue-600">
                                    {name.split(' ').map((n) => n[0]).join('')}
                                </AvatarFallback>
                            </Avatar>
                        </div>

                        {/* Text Info */}
                        <div className="text-center space-y-1">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">
                                {name}
                            </h3>
                            <p className="text-sm font-semibold text-blue-600">
                                {title}
                            </p>
                        </div>

                        {/* Quick Actions for Students */}
                        <div className="mt-6 flex w-full gap-2">
                            <Button 
                                variant="outline" 
                                className="flex-1 rounded-xl border-slate-200 font-bold hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                onClick={() => window.location.href = `mailto:instructor@university.edu`}
                            >
                                <Mail className="mr-2 h-4 w-4" />
                                Email
                            </Button>
                            <Button 
                                className="flex-1 rounded-xl bg-slate-900 font-bold hover:bg-blue-600 transition-all shadow-md active:scale-95"
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