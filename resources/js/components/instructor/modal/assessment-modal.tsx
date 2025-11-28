import Modal from '@/components/instructor/modal/Modal';
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

interface AssessmentModalProps {
    isOpen: boolean;
    setIsOpen: (v: boolean) => void;
}

export default function AssessmentModal({ isOpen, setIsOpen }: AssessmentModalProps) {
    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Sample Assessment Form">
            <form className="space-y-4">
                <div>
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" placeholder="Sample title" />
                </div>

                <div>
                    <Label>Description</Label>
                    <Textarea placeholder="Sample description" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>Type</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="quiz">Quiz</SelectItem>
                                <SelectItem value="exam">Exam</SelectItem>
                                <SelectItem value="homework">Homework</SelectItem>
                                <SelectItem value="midterm">Midterm</SelectItem>
                                <SelectItem value="final">Final</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Max Attempts</Label>
                        <Input type="number" placeholder="1" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>Start Time</Label>
                        <Input type="datetime-local" />
                    </div>
                    <div>
                        <Label>Deadline</Label>
                        <Input type="datetime-local" />
                    </div>
                </div>

                <div>
                    <Label>Duration (minutes)</Label>
                    <Input type="number" placeholder="30" />
                </div>

                <div className="mt-6 flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                        Cancel
                    </Button>
                    <Button type="submit">Submit</Button>
                </div>
            </form>
        </Modal>
    );
}
