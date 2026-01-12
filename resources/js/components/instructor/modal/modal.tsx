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
    title: ReactNode; // Changed to ReactNode to support icons in the title
    children: ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'; 
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
    size = 'md',
    primaryAction,
    secondaryAction,
}: ModalProps) {
    const sizeClasses = {
        sm: 'sm:max-w-sm',
        md: 'sm:max-w-lg',
        lg: 'sm:max-w-2xl',
        xl: 'sm:max-w-4xl',
        '2xl': 'sm:max-w-6xl',
    }[size];

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {/* 1. added flex flex-col and max-h
               2. h-fit ensures it doesn't take full height if content is small 
            */}
            <DialogContent 
                className={`${sizeClasses} w-[95vw] max-h-[95vh] flex flex-col p-0 overflow-hidden gap-0`}
            >
                <DialogHeader className="p-6 pb-2 border-b border-slate-50">
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>

                {/* 3. This is the scrollable body. 
                   flex-1 allows it to grow/shrink, overflow-y-auto enables the scroll 
                */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    {children}
                </div>

                {/* 4. Footer stays fixed at the bottom because it's outside the scroll div */}
                {(primaryAction || secondaryAction) && (
                    <div className="p-4 border-t border-slate-50 flex justify-end gap-2 bg-slate-50/30">
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