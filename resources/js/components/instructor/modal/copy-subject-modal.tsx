// src/components/instructor/modal/copy-assessment-modal.tsx

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge'; // Assuming you have a Badge component
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
    subject_ids: string[]; // Array of selected subject IDs within that class (as strings)
}

// Defines the structure of an available class from the props
interface AvailableClass {
    id: number;
    name: string;
    subjects: { id: number; name: string }[];
}

interface CopyAssessmentModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    assessmentToCopy: { id: number; title: string }; 
    availableClasses: AvailableClass[];
}

export default function CopyAssessmentModal({
    isOpen,
    setIsOpen,
    assessmentToCopy,
    availableClasses,
}: CopyAssessmentModalProps) {
    
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

    // Helper to calculate total selected subjects
    const totalSubjectsSelected = data.targets.reduce(
        (count, target) => count + target.subject_ids.length,
        0
    );

    // Derived state for Badges (Memoized for performance)
    const selectedBadges = useMemo(() => {
        return data.targets.flatMap(target => {
            // 1. Find the Class object
            const classObject = availableClasses.find(
                cls => cls.id.toString() === target.class_id
            );

            if (!classObject) return [];

            // 2. Map the selected subject IDs to their actual names, prepending the class name
            return target.subject_ids.map(subId => {
                const subjectObject = classObject.subjects.find(
                    sub => sub.id.toString() === subId
                );
                
                if (!subjectObject) return null;

                // Return a key/label object for the Badge
                return {
                    key: `${target.class_id}-${subId}`,
                    label: `${classObject.name}: ${subjectObject.name}`,
                    classId: target.class_id,
                    subjectId: subId,
                };
            }).filter(badge => badge !== null);
        });
    }, [data.targets, availableClasses]);


    // --- Core Logic for Subject/Class Toggling ---

    // Toggles the entire class target entry in the form data
    const toggleClass = (classId: string, classSelected: boolean) => {
        if (classSelected) {
            // Remove the entire class target
            const updatedTargets = data.targets.filter(
                (t) => t.class_id !== classId
            );
            setData('targets', updatedTargets);
        } else {
            // Add the class with no subjects selected (subjects are selected inside the expanded view)
            setData('targets', [
                ...data.targets,
                {
                    class_id: classId,
                    subject_ids: [],
                },
            ]);
        }
    };

    // Toggles a single subject within its class target
    const toggleSubject = (classId: string, subId: string, classSelected: boolean) => {
        let updatedTargets: DestinationTarget[];

        if (!classSelected) {
            // Case 1: Class was NOT selected yet (it was implicitly selected by clicking a subject)
            updatedTargets = [
                ...data.targets,
                {
                    class_id: classId,
                    subject_ids: [subId],
                },
            ];
        } else {
            // Case 2: Class IS selected, update its subject list
            updatedTargets = data.targets.map(
                (t) => {
                    if (t.class_id !== classId)
                        return t;

                    const exists = t.subject_ids.includes(subId);
                    return {
                        ...t,
                        subject_ids: exists
                            ? t.subject_ids.filter((id) => id !== subId)
                            : [...t.subject_ids, subId],
                    };
                }
            );
        }
        
        // Cleanup: Remove the class target entry if its subject_ids array becomes empty
        const cleanedTargets = updatedTargets.filter(
            (t) => t.subject_ids.length > 0
        );

        setData('targets', cleanedTargets);
    };


    // --- Form Submission ---

    const handleCopy = (e: React.FormEvent) => {
        e.preventDefault();

        // Validation checks the 'targets' array for selected subjects
        const hasValidTarget = data.targets.some(
            (t) => t.subject_ids.length > 0
        );

        if (data.targets.length === 0 || !hasValidTarget) {
            toast.error(
                'Please select at least one Class and one Subject.'
            );
            return;
        }

        post(
            // "targets" => array:2 [▼
            //     0 => array:2 [▼
            //       "class_id" => "1"
            //       "subject_ids" => array:1 [▼
            //         0 => "1"
            //       ]
            //     ]
            //     1 => array:2 [▼
            //       "class_id" => "2"
            //       "subject_ids" => array:1 [▼
            //         0 => "2"
            //       ]
            //     ]
            //   ]
            //   "assessment" => "1"
            route('instructor.classes.subjects.assessments.copy', {
                assessment: assessmentToCopy.id,
            }),
            {
                data,
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(
                        `Assessment "${assessmentToCopy.title}" copied successfully to ${data.targets.length} class(es)!`
                    );
                    setIsOpen(false);
                },
                onError: (error) => {
                    // Log or display specific Inertia errors if present
                    console.error('Inertia Errors:', errors);
                    toast.error('Failed to copy assessment. Please try again.');
                },
            }
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Copy Assessment</DialogTitle>
                    <DialogDescription>
                        Duplicate <strong>"{assessmentToCopy.title}"</strong> to
                        another Subject/Classroom.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleCopy}>
                    {/* Telegram-Style Multi-Class + Multi-Subject Selector */}
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
                                        {/* Removal button that triggers toggleSubject logic */}
                                        <button 
                                            type="button" 
                                            onClick={() => {
                                                // We simulate unselecting the subject. ClassSelected is true here.
                                                toggleSubject(badge.classId, badge.subjectId, true);
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
                                    {data.targets.length === 0
                                        ? 'Select Classes & Subjects'
                                        : `${data.targets.length} Class${
                                              data.targets.length > 1 ? 'es' : ''
                                          } (${totalSubjectsSelected} Subject${
                                              totalSubjectsSelected > 1
                                                  ? 's'
                                                  : ''
                                          } Selected)`}
                                </Button>
                            </PopoverTrigger>

                            <PopoverContent className="max-h-80 w-full overflow-hidden p-0">
                                <Command>
                                    <div className="border-b px-3 py-2">
                                        <CommandInput placeholder="Search class or subject..." />
                                    </div>

                                    <CommandList className="max-h-72 overflow-y-auto">
                                        <CommandEmpty className="p-3 text-sm">
                                            No results found.
                                        </CommandEmpty>

                                        <CommandGroup>
                                            {availableClasses.map((cls) => {
                                                const classId = cls.id.toString();
                                                
                                                // Check if this class is currently represented in the form data
                                                const classSelected = data.targets.some(
                                                    (t) => t.class_id === classId
                                                );

                                                // Get the current subject IDs selected for this class
                                                const classData = data.targets.find(
                                                    (t) => t.class_id === classId
                                                ) ?? {
                                                    class_id: classId,
                                                    subject_ids: [],
                                                };
                                                
                                                return (
                                                    <div
                                                        key={classId}
                                                        className="border-b"
                                                    >
                                                        {/* CLASS ROW */}
                                                        <CommandItem
                                                            value={`class-${cls.name}-${classId}`} 
                                                            className="flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-accent"
                                                            // We deliberately avoid using onSelect here to keep the popover open
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-800 font-bold">
                                                                    {cls.name.charAt(
                                                                        0
                                                                    )}
                                                                </div>
                                                                <span className="font-semibold">
                                                                    {cls.name}
                                                                </span>
                                                            </div>

                                                            {/* Checkbox for Class Selection */}
                                                            <div
                                                                onClick={() => toggleClass(classId, classSelected)}
                                                                className={`flex h-5 w-5 items-center justify-center rounded-full border cursor-pointer ${
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

                                                        {/* SUBJECTS INSIDE CLASS (Only shown if class is active/selected) */}
                                                        {classSelected && (
                                                            <div className="space-y-1 bg-muted/40 py-2 pl-12">
                                                                {cls.subjects.map(
                                                                    (sub) => {
                                                                        const subId = sub.id.toString();
                                                                        const selected = classData.subject_ids.includes(subId);

                                                                        return (
                                                                            <CommandItem
                                                                                key={subId}
                                                                                onSelect={() => toggleSubject(classId, subId, classSelected)}
                                                                                value={`subject-${cls.name}-${sub.name}-${subId}`} 
                                                                                className="flex cursor-pointer items-center justify-between rounded px-2 py-1 hover:bg-accent"
                                                                            >
                                                                                <span>
                                                                                    {sub.name}
                                                                                </span>

                                                                                <div
                                                                                    className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                                                                                        selected
                                                                                            ? 'border-blue-600 bg-blue-600 text-white'
                                                                                            : 'border-gray-400'
                                                                                    } `}
                                                                                >
                                                                                    {selected && (
                                                                                        <Check className="h-3 w-3" />
                                                                                    )}
                                                                                </div>
                                                                            </CommandItem>
                                                                        );
                                                                    }
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
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
                            // Disable if processing or if no subjects have been selected across all targets
                            disabled={processing || totalSubjectsSelected === 0}
                        >
                            {processing ? 'Copying...' : 'Copy Assessment'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}