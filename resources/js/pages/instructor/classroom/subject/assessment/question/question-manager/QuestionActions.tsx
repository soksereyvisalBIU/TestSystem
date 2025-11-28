// /components/question-manager/QuestionActions.tsx
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

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
        <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Questions</h2>
            <div className="flex items-center gap-2">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button size={'sm'} onClick={onAdd}>Add Question</Button>
                    </TooltipTrigger>
                    <TooltipContent className="text-xs">
                        <span>Shortcut: Ctrl + Q</span>
                    </TooltipContent>
                </Tooltip>

                <Button
                    size="sm"
                    onClick={onSave}
                    disabled={!hasChanges}
                    variant={hasChanges ? 'default' : 'secondary'}
                >
                    {hasChanges ? 'Save Changes' : 'All Changes Saved'}
                </Button>
            </div>
        </div>
    );
}
