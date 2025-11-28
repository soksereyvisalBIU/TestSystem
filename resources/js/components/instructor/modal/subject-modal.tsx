// components/Modal/ClassModal/SubjectModal.tsx

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import Modal from './Modal';

interface SubjectModalProps {
    isOpen: boolean;
    setIsOpen: (v: boolean) => void;
}

export default function SubjectModal({ isOpen, setIsOpen }: SubjectModalProps) {
    return (
        <Modal
            size="lg"
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="Sample Subject Form"
        >
            <form className="space-y-4">
                {/* Subject Name */}
                <div>
                    <Label>Name</Label>
                    <Input placeholder="Enter subject name" />
                </div>

                {/* Description */}
                <div>
                    <Label>Description</Label>
                    <Textarea placeholder="Enter a short description" />
                </div>

                {/* Visibility */}
                <div>
                    <Label>Visibility</Label>
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="public">Public</SelectItem>
                            <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Sample Cover Upload */}
                <div>
                    <Label>Cover Image</Label>
                    <Input type="file" accept="image/*" />
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-2">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setIsOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button type="submit">Submit</Button>
                </div>
            </form>
        </Modal>
    );
}
