import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TextQuestion({ question, answers, onTeacherScore }) {
    const ans = answers[0] || {};
    const studentText = ans.answer_text || '';
    const correctOptions = question.options?.map((o) => o.option_text) || [];
    const maxPoints = parseFloat(question.point || 0);

    const isAutoCorrect = correctOptions.some(
        (opt) => opt.trim().toLowerCase() === studentText.trim().toLowerCase(),
    );

    const handleScoreChange = (e) => {
        let val = e.target.value;
        if (val === '') return onTeacherScore(question.id, '');
        let numVal = Math.min(maxPoints, Math.max(0, parseFloat(val)));
        onTeacherScore(question.id, numVal);
    };

    return (
        <div className="space-y-6">
            {/* Student Response Box */}
            <div className="rounded-2xl border-2 border-border bg-card p-5 shadow-sm">
                <Label className="mb-2 block text-[10px] font-bold tracking-widest text-description uppercase">
                    Student Response
                </Label>
                <p className="text-sm font-medium text-body italic">
                    {studentText ? `"${studentText}"` : 'No response provided.'}
                </p>
            </div>

            {/* Accepted Keys (Success/Emerald state) */}
            {!isAutoCorrect && correctOptions.length > 0 && (
                <div className="rounded-xl bg-success/10 p-4 ring-1 ring-success/20">
                    <span className="text-[10px] font-bold tracking-wider text-success uppercase">
                        Accepted Keys
                    </span>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {correctOptions.map((opt, i) => (
                            <Badge
                                key={i}
                                variant="outline"
                                className="border-success/30 bg-card text-success"
                            >
                                {opt}
                            </Badge>
                        ))}
                    </div>
                </div>
            )}

            {/* Grading Action Box (Primary/Indigo state) */}
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-5 sm:flex-row">
                <div className="flex flex-1 items-center gap-3">
                    <div className="rounded-lg bg-primary p-2 text-primary-foreground">
                        < GraduationCap className="h-5 w-5" />
                    </div>
                    <div>
                        <Label className="text-sm font-bold text-title">
                            Assign Grade
                        </Label>
                        <p className="text-xs text-description">
                            Max Points: {maxPoints}
                        </p>
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Input
                            type="number"
                            step="0.5"
                            value={ans.manual_score ?? ans.points_earned ?? ''}
                            onChange={handleScoreChange}
                            className="w-28 border-primary/30 bg-card pr-8 text-right font-mono font-bold focus:ring-primary"
                        />
                        <span className="absolute top-2.5 right-3 text-[10px] font-bold text-description">
                            PTS
                        </span>
                    </div>
                    <Button
                        size="sm"
                        variant="outline"
                        className="text-[10px] font-bold border-primary/30 hover:bg-primary hover:text-primary-foreground"
                        onClick={() => onTeacherScore(question.id, maxPoints)}
                    >
                        MAX
                    </Button>
                </div>
            </div>
        </div>
    );
}