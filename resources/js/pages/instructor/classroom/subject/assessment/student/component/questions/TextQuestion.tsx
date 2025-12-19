import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GraduationCap } from 'lucide-react';

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
            <div className="rounded-2xl border-2 border-slate-100 bg-white p-5 shadow-sm">
                <Label className="mb-2 block text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                    Student Response
                </Label>
                <p className="text-sm font-medium text-slate-700 italic">
                    {studentText ? `"${studentText}"` : 'No response provided.'}
                </p>
            </div>

            {!isAutoCorrect && correctOptions.length > 0 && (
                <div className="rounded-xl bg-emerald-50/50 p-4 ring-1 ring-emerald-100">
                    <span className="text-[10px] font-bold tracking-wider text-emerald-700 uppercase">
                        Accepted Keys
                    </span>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {correctOptions.map((opt, i) => (
                            <Badge
                                key={i}
                                variant="outline"
                                className="border-emerald-200 bg-white text-emerald-700"
                            >
                                {opt}
                            </Badge>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex flex-col items-center gap-4 rounded-2xl border border-indigo-100 bg-indigo-50/30 p-5 sm:flex-row">
                <div className="flex flex-1 items-center gap-3">
                    <div className="rounded-lg bg-indigo-600 p-2 text-white">
                        <GraduationCap className="h-5 w-5" />
                    </div>
                    <div>
                        <Label className="text-sm font-bold text-slate-800">
                            Assign Grade
                        </Label>
                        <p className="text-xs text-slate-500">
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
                            className="w-28 border-indigo-200 pr-8 text-right font-mono font-bold focus:ring-indigo-500"
                        />
                        <span className="absolute top-2.5 right-3 text-[10px] font-bold text-slate-400">
                            PTS
                        </span>
                    </div>
                    <Button
                        size="sm"
                        variant="outline"
                        className="text-[10px] font-bold"
                        onClick={() => onTeacherScore(question.id, maxPoints)}
                    >
                        MAX
                    </Button>
                </div>
            </div>
        </div>
    );
}
