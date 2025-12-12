// src/components/instructor/modal/copy-subject-modal.tsx

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandList,
    CommandItem,
} from '@/components/ui/command';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { useForm } from '@inertiajs/react';
import { useEffect, useState, useMemo } from 'react';
import { toast } from 'sonner';
import { route } from 'ziggy-js';
import { Check, X } from 'lucide-react';

// --- Type Definitions ---

// Defines the structure for a selected target (to be sent in the POST request)
interface DestinationTarget {
    class_id: string; // The ID of the class (as string)
}

// Defines the structure of an available class from the props
interface AvailableClass {
    id: number;
    name: string;
}

interface CopySubjectModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    subjectToCopy: { id: number; name: string }; // The subject being copied
    availableClasses: AvailableClass[]; // List of classes to copy to
    sourceClassId: number; // The class the subject currently belongs to (to prevent copying to self)
}

export default function CopySubjectModal({
    isOpen,
    setIsOpen,
    subjectToCopy,
    availableClasses,
    sourceClassId,
}: CopySubjectModalProps) {
    
    // Filter out the source class from the available list for selection
    const availableTargets = useMemo(() => {
        return availableClasses.filter(
            (cls) => cls.id !== sourceClassId
        );
    }, [availableClasses, sourceClassId]);

    const { data, setData, post, processing, errors, reset } = useForm<{
        targets: DestinationTarget[];
    }>({
        targets: [],
    });

    // Reset targets when the modal opens/closes
    useEffect(() => {
        if (isOpen) {
            reset('targets');
        }
    }, [isOpen]);

    // Helper to calculate total selected classes
    const totalClassesSelected = data.targets.length;

    // Derived state for Badges (Memoized for performance)
    const selectedBadges = useMemo(() => {
        return data.targets.map(target => {
            // 1. Find the Class object
            const classObject = availableClasses.find(
                cls => cls.id.toString() === target.class_id
            );

            if (!classObject) return null;

            // Return a key/label object for the Badge
            return {
                key: target.class_id,
                label: classObject.name,
                classId: target.class_id,
            };
        }).filter(badge => badge !== null);
    }, [data.targets, availableClasses]);


    // --- Core Logic for Class Toggling ---

    // Toggles a class target entry in the form data
    const toggleClass = (classId: string, classSelected: boolean) => {
        if (classSelected) {
            // Remove the class target
            const updatedTargets = data.targets.filter(
                (t) => t.class_id !== classId
            );
            setData('targets', updatedTargets);
        } else {
            // Add the class target
            setData('targets', [
                ...data.targets,
                { class_id: classId },
            ]);
        }
    };


    // --- Form Submission ---

    const handleCopy = (e: React.FormEvent) => {
        e.preventDefault();

        if (data.targets.length === 0) {
            toast.error(
                'Please select at least one Class to copy the subject to.'
            );
            return;
        }

        // The POST route signature is: 
        // /instructor/classes/{class}/subjects/{subject}/copy
        post(
            route('instructor.classes.subjects.copy', {
                class: sourceClassId, 
                subject: subjectToCopy.id, 
            }),
            {
                data,
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(
                        `Subject "${subjectToCopy.name}" copied successfully to ${totalClassesSelected} class(es)!`
                    );
                    setIsOpen(false);
                },
                onError: (error) => {
                    console.error('Inertia Errors:', errors);
                    toast.error('Failed to copy subject. Please try again.');
                },
            }
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Copy Subject</DialogTitle>
                    <DialogDescription>
                        Duplicate <strong>"{subjectToCopy.name}"</strong> to
                        another Classroom. (The original class is excluded).
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleCopy}>
                    {/* Class Selector */}
                    <div className="grid gap-2">
                        <Label className="font-semibold">Copy To</Label>

                        {/* Display Selected Badges */}
                        {selectedBadges.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-1">
                                {selectedBadges.map((badge) => (
                                    <Badge 
                                        key={badge.key}
                                        variant="secondary" 
                                        className="flex items-center space-x-1 pr-1"
                                    >
                                        {badge.label}
                                        {/* Removal button that triggers toggleClass logic */}
                                        <button 
                                            type="button" 
                                            onClick={() => {
                                                // We simulate unselecting the class. ClassSelected is true here.
                                                toggleClass(badge.classId, true);
                                            }}
                                            className="p-0.5 rounded-full hover:bg-red-500/20 transition-colors"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        )}

                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full justify-between"
                                    disabled={processing}
                                >
                                    {/* Display Summary Count */}
                                    {totalClassesSelected === 0
                                        ? 'Select Target Classes'
                                        : `${totalClassesSelected} Class${
                                              totalClassesSelected > 1 ? 'es' : ''
                                          } Selected`}
                                </Button>
                            </PopoverTrigger>

                            <PopoverContent className="max-h-80 w-full overflow-hidden p-0">
                                <Command>
                                    <div className="border-b px-3 py-2">
                                        <CommandInput placeholder="Search class..." />
                                    </div>

                                    <CommandList className="max-h-72 overflow-y-auto">
                                        <CommandEmpty className="p-3 text-sm">
                                            No other classes found.
                                        </CommandEmpty>

                                        <CommandGroup>
                                            {availableTargets.map((cls) => {
                                                const classId = cls.id.toString();
                                                
                                                // Check if this class is currently selected
                                                const classSelected = data.targets.some(
                                                    (t) => t.class_id === classId
                                                );
                                                
                                                return (
                                                    <CommandItem
                                                        key={classId}
                                                        onSelect={() => toggleClass(classId, classSelected)}
                                                        value={`class-${cls.name}-${classId}`}
                                                        className="flex cursor-pointer items-center justify-between px-3 py-2"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-800 font-bold">
                                                                {cls.name.charAt(0)}
                                                            </div>
                                                            <span className="font-semibold">
                                                                {cls.name}
                                                            </span>
                                                        </div>

                                                        {/* Checkbox for Class Selection */}
                                                        <div
                                                            className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                                                                classSelected
                                                                    ? 'border-blue-600 bg-blue-600 text-white'
                                                                    : 'border-gray-400'
                                                            }`}
                                                        >
                                                            {classSelected && (
                                                                <Check className="h-3 w-3" />
                                                            )}
                                                        </div>
                                                    </CommandItem>
                                                );
                                            })}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-4">
                        <Button
                            type="submit"
                            // Disable if processing or if no classes have been selected
                            disabled={processing || totalClassesSelected === 0}
                        >
                            {processing ? 'Copying...' : 'Copy Subject'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}