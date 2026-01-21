import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { Loader2, UserPlus } from 'lucide-react';
import { useCallback, useEffect } from 'react';
import { route } from 'ziggy-js';

interface JoinClassModalProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

export default function JoinClassModal({
    isOpen,
    setIsOpen,
}: JoinClassModalProps) {
    // Standardizing the form with Inertia's useForm
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            code: '',
        });

    // Clean up form state when modal visibility changes
    useEffect(() => {
        if (!isOpen) {
            const timer = setTimeout(() => {
                reset();
                clearErrors();
            }, 200); // Small delay to allow close animation to finish
            return () => clearTimeout(timer);
        }
    }, [isOpen, reset, clearErrors]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Prevent concurrent submissions
        if (processing || !data.code.trim()) return;

        post(route('student.class.join'), {
            preserveScroll: true,
            onSuccess: () => {
                setIsOpen(false);
            },
        });
    };

    const handleClose = useCallback(() => {
        if (processing) return;
        setIsOpen(false);
    }, [processing, setIsOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="overflow-hidden rounded-[1.5rem] border-none shadow-2xl sm:max-w-[400px]">
                {/* Visual Accent */}
                <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-primary/50 via-primary to-primary/50" />

                <form onSubmit={handleSubmit} className="space-y-6">
                    <DialogHeader className="flex flex-col items-center">
                        <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <UserPlus className="h-8 w-8" />
                        </div>
                        <DialogTitle className="text-xl font-bold">
                            Join a Class
                        </DialogTitle>
                        <DialogDescription className="text-center text-sm leading-relaxed">
                            Enter the unique class code to instantly enroll in
                            your learning environment.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <div className="grid gap-2">
                            <Label
                                htmlFor="code"
                                className="text-xs font-bold tracking-wider text-muted-foreground uppercase"
                            >
                                Class Code
                            </Label>
                            <Input
                                id="code"
                                placeholder="e.g. ABC-123"
                                value={data.code}
                                onChange={(e) =>
                                    setData(
                                        'code',
                                        e.target.value.toUpperCase(),
                                    )
                                }
                                className={`h-12 rounded-xl bg-muted/50 font-mono text-lg tracking-widest transition-all focus:ring-2 ${
                                    errors.code
                                        ? 'border-destructive ring-destructive/20'
                                        : 'border-transparent focus:border-primary'
                                }`}
                                autoComplete="off"
                                autoFocus
                                disabled={processing}
                            />
                            {errors.code && (
                                <p className="animate-in text-xs font-medium text-destructive fade-in slide-in-from-top-1">
                                    {errors.code}
                                </p>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="flex-col gap-2 sm:flex-row">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={handleClose}
                            disabled={processing}
                            className="rounded-xl"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing || !data.code.trim()}
                            className="relative rounded-xl bg-primary px-8 shadow-lg shadow-primary/20 transition-all active:scale-95"
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Joining...
                                </>
                            ) : (
                                'Join Class'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
