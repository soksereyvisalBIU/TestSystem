import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, UserPlus, ShieldCheck } from 'lucide-react';
import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';

interface JoinClassModalProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    classroomName: string;
    code: string | number; // Pass the ID directly to the modal
}

export default function ConfirmJoinClassModal({ 
    isOpen, 
    setIsOpen, 
    classroomName, 
    code, 
}: JoinClassModalProps) {
    
    // We initialize the form with the classroom ID if your backend requires it
    const { post, processing, reset } = useForm({
        code: code,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('student.class.join'), {
            onSuccess: () => {
                setIsOpen(false);
                reset();
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[400px] overflow-hidden p-0 border-none">
                <form onSubmit={handleSubmit}>
                    {/* Visual Header Accent */}
                    <div className="bg-blue-600 h-2 w-full" />
                    
                    <div className="p-6">
                        <DialogHeader className="flex flex-col items-center text-center">
                            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/20">
                                <ShieldCheck className="size-8" />
                            </div>
                            <DialogTitle className="text-2xl font-bold">
                                Join Classroom?
                            </DialogTitle>
                            {/* <DialogDescription className="text-balance pt-2"> */}
                            <DialogDescription className="pt-2">
                                You are about to enroll in <span className="font-semibold text-slate-900 dark:text-white">{classroomName}</span>. 
                                This will give you access to all course materials and assignments.
                            </DialogDescription>
                        </DialogHeader>

                        <DialogFooter className="mt-8 flex-col gap-2 sm:flex-col">
                            <Button 
                                type="submit" 
                                className="w-full bg-blue-600 hover:bg-blue-700 py-6" 
                                disabled={processing}
                            >
                                {processing ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <UserPlus className="mr-2 h-4 w-4" />
                                )}
                                Confirm Enrollment
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                className="w-full"
                                onClick={() => setIsOpen(false)}
                                disabled={processing}
                            >
                                Not now
                            </Button>
                        </DialogFooter>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}