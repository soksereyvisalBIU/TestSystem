import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { MoreVertical, Mail, ShieldCheck } from 'lucide-react';
import { Student } from '@/types/student/assessment';
import { motion } from 'framer-motion';

interface StudentCardProps {
    student: Student;
    onMenuClick?: (studentId: number) => void;
}

export function StudentCard({ student, onMenuClick }: StudentCardProps) {
    // Determine progress color for semantic feedback
    const getProgressColor = (val: number) => {
        if (val >= 90) return 'bg-emerald-500';
        if (val >= 70) return 'bg-blue-500';
        if (val >= 50) return 'bg-amber-500';
        return 'bg-rose-500';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ x: 4 }}
            className="group flex items-center justify-between rounded-2xl border border-transparent p-4 transition-all hover:bg-white hover:shadow-md hover:shadow-slate-200/50"
        >
            <div className="flex items-center gap-4">
                {/* Avatar with Status Ring */}
                <div className="relative">
                    <Avatar className="h-12 w-12 rounded-xl border-2 border-white shadow-sm ring-1 ring-slate-100 transition-transform group-hover:scale-105">
                        <AvatarImage
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`}
                            alt={student.name}
                            className="object-cover"
                        />
                        <AvatarFallback className="bg-slate-100 font-bold text-slate-600">
                            {student.avatar}
                        </AvatarFallback>
                    </Avatar>
                    {student.progress > 90 && (
                        <div className="absolute -right-1 -top-1 rounded-full bg-white p-0.5">
                            <ShieldCheck className="h-4 w-4 fill-emerald-500 text-white" />
                        </div>
                    )}
                </div>

                <div>
                    <p className="font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                        {student.name}
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            STU-{student.id.toString().padStart(4, '0')}
                        </span>
                        <span className="h-1 w-1 rounded-full bg-slate-200" />
                        <span className="text-[10px] font-bold text-slate-400">Class of 2025</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-8">
                {/* Visual Progress Section */}
                <div className="hidden w-48 flex-col gap-1.5 sm:flex">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-tighter">
                        <span className="text-slate-400">Subject Mastery</span>
                        <span className={student.progress >= 90 ? 'text-emerald-600' : 'text-slate-600'}>
                            {student.progress}%
                        </span>
                    </div>
                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-100">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${student.progress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={`h-full rounded-full ${getProgressColor(student.progress)}`}
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-9 w-9 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-50 hover:text-blue-600"
                        onClick={() => window.location.href = 'mailto:student@example.com'}
                    >
                        <Mail className="h-4 w-4" />
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-9 w-9 rounded-lg text-slate-300 hover:text-slate-600"
                        onClick={() => onMenuClick?.(student.id)}
                    >
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}