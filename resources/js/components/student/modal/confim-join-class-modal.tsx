import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useForm } from '@inertiajs/react';
import { Loader2, ShieldCheck, UserPlus } from 'lucide-react';
import { useCallback, useEffect } from 'react';
import { route } from 'ziggy-js';

interface JoinClassModalProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    classroomName: string;
    code: string | number;
}

export default function ConfirmJoinClassModal({
    isOpen,
    setIsOpen,
    classroomName,
    code,
}: JoinClassModalProps) {
    const { post, processing, reset, setData } = useForm({
        code: code,
    });

    // Sync form data if the classroom prop changes while the modal is alive
    useEffect(() => {
        setData('code', code);
    }, [code, setData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (processing) return; // Prevent double-submission

        post(route('student.class.join'), {
            preserveScroll: true,
            onSuccess: () => {
                setIsOpen(false);
                reset();
            },
        });
    };

    const handleOpenChange = useCallback(
        (open: boolean) => {
            if (processing) return; // Lock modal if communicating with server
            setIsOpen(open);
        },
        [processing, setIsOpen],
    );

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="overflow-hidden rounded-[2rem] border-none p-0 shadow-2xl sm:max-w-[400px]">
                <form onSubmit={handleSubmit} className="relative">
                    {/* High-Performance Visual Header */}
                    <div className="h-1.5 w-full bg-blue-600 transition-all duration-500" />

                    <div className="p-8">
                        <DialogHeader className="flex flex-col items-center text-center">
                            <div className="mb-5 flex size-20 transform-gpu animate-in items-center justify-center rounded-3xl bg-blue-50 text-blue-600 duration-300 zoom-in-50 dark:bg-blue-900/20">
                                <ShieldCheck className="size-10" />
                            </div>

                            <DialogTitle className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                                Join Classroom?
                            </DialogTitle>

                            <DialogDescription className="pt-3 text-base leading-relaxed text-center">
                                You are about to enroll in
                                <span className="font-bold text-blue-600 dark:text-blue-400">
                                    {' '}{classroomName}
                                </span>
                                .
                                <p className="mt-2 text-sm text-slate-500">
                                    This gives you immediate access to
                                    curriculum modules, assignments, and peer
                                    discussions.
                                </p>
                            </DialogDescription>
                        </DialogHeader>

                        <DialogFooter className="mt-10 flex flex-col gap-3 sm:flex-col">
                            <Button
                                type="submit"
                                className="h-14 w-full rounded-2xl bg-blue-600 font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-[0.98]"
                                disabled={processing}
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="mr-2 h-5 w-5" />
                                        Confirm Enrollment
                                    </>
                                )}
                            </Button>

                            <Button
                                type="button"
                                variant="ghost"
                                className="h-12 w-full rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                                onClick={() => handleOpenChange(false)}
                                disabled={processing}
                            >
                                Not now, go back
                            </Button>
                        </DialogFooter>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
