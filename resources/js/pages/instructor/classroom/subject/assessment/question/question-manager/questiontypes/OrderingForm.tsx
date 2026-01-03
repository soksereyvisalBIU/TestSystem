import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
    Trash2, 
    ChevronUp, 
    ChevronDown, 
    Plus, 
    ListOrdered, 
    Info 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
    data: any;
    onChange: (data: any) => void;
}

export default function OrderingForm({ data, onChange }: Props) {
    const items = data.items || [
        { id: '1', content: '' },
        { id: '2', content: '' }
    ];

    const updateItems = (newItems: any[]) => {
        onChange({ ...data, items: newItems });
    };

    const addItem = () => {
        const newItem = { id: Math.random().toString(36).substr(2, 9), content: '' };
        updateItems([...items, newItem]);
    };

    const removeItem = (index: number) => {
        if (items.length <= 2) return;
        const filtered = items.filter((_, i) => i !== index);
        updateItems(filtered);
    };

    const handleItemChange = (index: number, value: string) => {
        const updated = [...items];
        updated[index].content = value;
        updateItems(updated);
    };

    const moveItem = (index: number, direction: 'up' | 'down') => {
        const newItems = [...items];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= newItems.length) return;
        
        [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
        updateItems(newItems);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-top-2 duration-500">
            {/* Question Textarea */}
            <div className="space-y-3">
                <Label htmlFor="question" className="text-sm font-semibold text-subtitle ml-1">
                    Instruction / Question
                </Label>
                <Textarea
                    id="question"
                    required
                    placeholder="e.g., Arrange the steps of the water cycle in the correct order."
                    className="min-h-[100px] bg-background border-input focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all resize-none text-base shadow-sm text-body"
                    value={data.question || ""}
                    onChange={(e) => onChange({ ...data, question: e.target.value })}
                />
            </div>

            {/* List Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <ListOrdered className="w-4 h-4 text-primary" />
                    <Label className="text-sm font-semibold text-subtitle">Correct Sequence</Label>
                </div>

                <div className="space-y-3 relative">
                    {/* Visual Vertical Line Connector */}
                    <div className="absolute left-[51px] top-6 bottom-6 w-[2px] bg-border -z-0" />

                    {items.map((item, index) => (
                        <div 
                            key={item.id} 
                            className="group relative flex items-center gap-4 animate-in zoom-in-95 duration-200"
                        >
                            {/* Sequence Number & Move Controls */}
                            <div className="flex flex-col items-center gap-1 z-10">
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-6 w-6 rounded-full hover:bg-primary/10 hover:text-primary disabled:opacity-0"
                                    onClick={() => moveItem(index, 'up')} 
                                    disabled={index === 0}
                                >
                                    <ChevronUp className="h-4 w-4" />
                                </Button>
                                
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shadow-sm border-2 transition-colors",
                                    "bg-background border-border text-description group-hover:border-primary group-hover:text-primary"
                                )}>
                                    {index + 1}
                                </div>

                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-6 w-6 rounded-full hover:bg-primary/10 hover:text-primary disabled:opacity-0"
                                    onClick={() => moveItem(index, 'down')} 
                                    disabled={index === items.length - 1}
                                >
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </div>
                            
                            {/* Content Input */}
                            <div className="flex-1 bg-background p-1 rounded-xl border border-border group-hover:border-primary/30 group-hover:shadow-md transition-all">
                                <Input
                                    value={item.content}
                                    placeholder={`Step ${index + 1} description...`}
                                    onChange={(e) => handleItemChange(index, e.target.value)}
                                    className="border-none shadow-none focus-visible:ring-0 text-body font-medium bg-transparent"
                                />
                            </div>

                            {/* Delete Button */}
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => removeItem(index)}
                                disabled={items.length <= 2}
                                className="opacity-0 group-hover:opacity-100 text-description/60 hover:text-destructive hover:bg-destructive/10 transition-all rounded-full"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>

                {/* Add Step Button */}
                <div className="pl-[42px] mt-4">
                    <Button 
                        variant="outline" 
                        onClick={addItem} 
                        className="w-full py-6 border-dashed border-2 border-border text-description hover:text-primary hover:border-primary hover:bg-primary/5 transition-all group rounded-xl bg-transparent"
                    >
                        <Plus className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" /> 
                        Add Next Sequence Step
                    </Button>
                </div>
            </div>

            {/* User Note */}
            <div className="flex gap-3 p-4 bg-muted/30 rounded-xl border border-border items-start">
                <Info className="w-4 h-4 text-description/60 mt-0.5" />
                <p className="text-xs text-description leading-relaxed italic">
                    <strong className="text-subtitle not-italic">Note:</strong> Define the items in their <strong className="text-subtitle not-italic">absolute correct order</strong>. The system will automatically randomize these for students.
                </p>
            </div>
        </div>
    );
}