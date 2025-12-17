import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Plus, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function QuestionActions({
    onAdd,
    onSave,
    hasChanges,
}: {
    onAdd: () => void;
    onSave: () => void;
    hasChanges: boolean;
}) {
    return (
        <TooltipProvider>
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                <div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">Quiz Content</h2>
                    <p className="text-xs  text-slate-400 mt-1 uppercase ">Construct and sequence your assessment</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button 
                                onClick={onAdd}
                                className="h-10 px-4 bg-white text-slate-900 border-slate-200 hover:bg-slate-50 hover:text-primary transition-all shadow-sm gap-2"
                                variant="outline"
                            >
                                <Plus className="w-4 h-4 text-primary" />
                                <span className="font-bold">Add Question</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="bg-slate-900 text-white border-none text-[10px]">
                            Shortcut: <kbd className="ml-1 px-1 bg-slate-700 rounded">Ctrl + Q</kbd>
                        </TooltipContent>
                    </Tooltip>

                    <Button
                        onClick={onSave}
                        disabled={!hasChanges}
                        className={cn(
                            "h-10 px-6 transition-all duration-300 gap-2 font-bold shadow-md",
                            hasChanges 
                                ? "bg-primary hover:bg-primary/90 text-white scale-100" 
                                : "bg-emerald-50 text-emerald-600 border border-emerald-100 opacity-100 cursor-default"
                        )}
                    >
                        {hasChanges ? (
                            <>
                                <Save className="w-4 h-4" />
                                Save Changes
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="w-4 h-4" />
                                All Saved
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </TooltipProvider>
    );
}