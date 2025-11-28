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
import { useState } from 'react';
import Modal from './Modal';

interface ClassModalProps {
    isOpen: any;
    // setIsOpen: (v: boolean) => void;
    setIsOpen: any;
}

export default function ClassModal({ isOpen, setIsOpen }: ClassModalProps) {
    const [preview, setPreview] = useState<string | null>(null);

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setPreview(URL.createObjectURL(file));
    };

    return (
        <Modal
            size="lg"
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="Sample Class Form"
        >
            <form className="space-y-4">
                {/* Name */}
                <div>
                    <Label>Name</Label>
                    <Input placeholder="Class name" />
                </div>

                {/* Description */}
                <div>
                    <Label>Description</Label>
                    <Textarea placeholder="Short description" />
                </div>

                {/* Batch */}
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <Label>Campus</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Select batch" />
                            </SelectTrigger>
                            <SelectContent>
                                {[1 ,2 ].map((b) => (
                                    <SelectItem key={b} value={String(b)}>
                                        {b}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Major</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Select batch" />
                            </SelectTrigger>
                            <SelectContent>
                                {["Software Engineering" , "Computer Networking" , "Multimedia Design"].map((b , i) => (
                                    <SelectItem key={i} value={String(b)}>
                                        {b}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Batch</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Select batch" />
                            </SelectTrigger>
                            <SelectContent>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((b) => (
                                    <SelectItem key={b} value={String(b)}>
                                        {b}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Year / Semester / Shift */}
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <Label>Year</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Year" />
                            </SelectTrigger>
                            <SelectContent>
                                {[1, 2, 3, 4].map((y) => (
                                    <SelectItem key={y} value={String(y)}>
                                        {y}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Semester</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Semester" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">1</SelectItem>
                                <SelectItem value="2">2</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Shift</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Shift" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Morning">Morning</SelectItem>
                                <SelectItem value="Afternoon">
                                    Afternoon
                                </SelectItem>
                                <SelectItem value="Evening">Evening</SelectItem>
                                <SelectItem value="Weekend">Weekend</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Cover Image */}
                <div>
                    <Label>Class Cover</Label>
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImage}
                    />

                    {preview && (
                        <img
                            src={preview}
                            className="mt-2 h-32 w-full rounded border object-cover"
                        />
                    )}
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
