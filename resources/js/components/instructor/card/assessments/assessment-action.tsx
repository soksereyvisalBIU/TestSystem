// --- ASSESSMENT PAGE ---
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Copy, MoreHorizontalIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';
// import CopyAssessmentModal from '../modal/copy-assessment-modal';
import CopyAssessmentModal from '@/components/instructor/modal/copy-assessment-modal';

// --- ASSESSMENT ACTIONS ---
export default function AssessmentActions({
    assessment,
    availableClasses,
    classId,
    subjectId,
    setSelectedAssessment,
    setOpenAssessmentModal,
}: any) {
    const [openCopyModal, setOpenCopyModal] = useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 text-slate-400 hover:text-slate-900"
                    >
                        <MoreHorizontalIcon className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>

                    <DropdownMenuItem
                        onClick={() => {
                            setSelectedAssessment(assessment); // edit mode
                            setOpenAssessmentModal(true);
                        }}
                    >
                        <PencilIcon className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => setOpenCopyModal(true)}>
                        <Copy className="mr-2 h-4 w-4" /> Copy to...
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem className="text-red-600 focus:bg-red-50 focus:text-red-600">
                        <TrashIcon className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <CopyAssessmentModal
                isOpen={openCopyModal}
                setIsOpen={setOpenCopyModal}
                assessmentToCopy={assessment}
                availableClasses={availableClasses}
                sourceClassId={classId}
                sourceSubjectId={subjectId}
            />
        </>
    );
}
