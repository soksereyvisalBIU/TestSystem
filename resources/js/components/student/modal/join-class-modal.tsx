import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { route } from 'ziggy-js';

interface JoinClassModalProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

export default function JoinClassModal({ isOpen, setIsOpen }: JoinClassModalProps) {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        code: '',
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

    const handleClose = () => {
        setIsOpen(false);
        reset();
        clearErrors();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Join a Class</DialogTitle>
                        <DialogDescription>
                            Enter the class code provided by your instructor to enroll in the classroom.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="code">Class Code</Label>
                            <Input
                                id="code"
                                placeholder="e.g. ABC-123"
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value)}
                                className={errors.code ? 'border-destructive' : ''}
                                autoFocus
                            />
                            {errors.code && (
                                <p className="text-sm font-medium text-destructive">
                                    {errors.code}
                                </p>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={handleClose}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing || !data.code}>
                            {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Join Class
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}