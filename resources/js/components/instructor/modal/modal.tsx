import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { ReactNode } from 'react';

interface ModalProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    title: string;
    children: ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl'; // 🔹 new size prop
    primaryAction?: {
        label: string;
        onClick: () => void;
    };
    secondaryAction?: {
        label: string;
        onClick: () => void;
    };
}

export default function Modal({
    isOpen,
    setIsOpen,
    title,
    children,
    size = 'md', // 🔹 default size
    primaryAction,
    secondaryAction,
}: ModalProps) {
    // 🔹 Tailwind width classes by size
    const sizeClasses = {
        sm: 'sm:max-w-sm',
        md: 'sm:max-w-lg',
        lg: 'sm:max-w-2xl',
        xl: 'sm:max-w-3xl',
    }[size];

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className={`${sizeClasses} w-full`}>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>

                <div className="mt-2">{children}</div>

                {(primaryAction || secondaryAction) && (
                    <div className="mt-4 flex justify-end gap-2">
                        {secondaryAction && (
                            <Button
                                variant="secondary"
                                onClick={secondaryAction.onClick}
                            >
                                {secondaryAction.label}
                            </Button>
                        )}
                        {primaryAction && (
                            <Button onClick={primaryAction.onClick}>
                                {primaryAction.label}
                            </Button>
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
