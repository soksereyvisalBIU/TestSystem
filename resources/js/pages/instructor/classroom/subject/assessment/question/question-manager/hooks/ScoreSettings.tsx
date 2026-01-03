import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { useEffect } from 'react';
import { Target, Percent, Sparkles, AlertCircle, CheckCircle2, Hash } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ScoreSettings({
    totalScore,
    setTotalScore,
    typePercentages,
    setTypePercentages,
    questionTypes,
    autoPoints,
    setAutoPoints,
}: {
    totalScore: number;
    setTotalScore: (val: number) => void;
    typePercentages: Record<string, number>;
    setTypePercentages: (val: Record<string, number>) => void;
    questionTypes: { type: string; count: number }[];
    autoPoints: boolean;
    setAutoPoints: (val: boolean) => void;
}) {
    useEffect(() => {
        if (questionTypes.length > 0 && Object.keys(typePercentages).length === 0) {
            const equalShare = parseFloat((100 / questionTypes.length).toFixed(2));
            const distributed = questionTypes.reduce((acc, { type }, i) => {
                if (i === questionTypes.length - 1) {
                    const remainder = 100 - equalShare * (questionTypes.length - 1);
                    acc[type] = parseFloat(remainder.toFixed(2));
                } else {
                    acc[type] = equalShare;
                }
                return acc;
            }, {} as Record<string, number>);
            setTypePercentages(distributed);
        }
    }, [questionTypes, typePercentages, setTypePercentages]);

    const handlePercentageChange = (type: string, value: string) => {
        const val = Math.min(100, Math.max(0, Number(value)));
        setTypePercentages((prev) => ({ ...prev, [type]: val }));
    };

    const totalPct = Object.values(typePercentages).reduce((a, b) => a + b, 0);
    const isError = totalPct !== 100;

    return (
        <Card className="border-border bg-card text-card-foreground shadow-xl shadow-primary/5 overflow-hidden py-0">
            <CardHeader className="bg-muted/30 border-b border-border py-4">
                <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    <CardTitle className="text-lg text-title">Scoring Logic</CardTitle>
                </div>
                <CardDescription className="text-description">
                    Define how points are distributed across your quiz.
                </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
                {/* Total Score Input */}
                <div className="space-y-2">
                    <Label className="text-sm font-bold text-subtitle">Quiz Total Points</Label>
                    <div className="relative">
                        <Input
                            type="number"
                            min={1}
                            className="h-12 text-lg font-black pl-10 bg-background border-input focus:ring-ring"
                            value={totalScore}
                            onChange={(e) => setTotalScore(Number(e.target.value))}
                        />
                        <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    </div>
                </div>

                <hr className="border-border" />

                {/* Percentage Distribution */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm font-bold text-subtitle">Weighting by Type</Label>
                        <div className={cn(
                            "flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter transition-colors",
                            isError 
                                ? "bg-destructive/10 text-destructive" 
                                : "bg-success/10 text-success"
                        )}>
                            {isError ? <AlertCircle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                            {totalPct}% / 100%
                        </div>
                    </div>

                    <div className="space-y-3 bg-muted/20 p-4 rounded-xl border border-border">
                        {questionTypes.map(({ type, count }) => (
                            <div key={type} className="flex items-center justify-between gap-4 group">
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-body capitalize">
                                        {type.replace('_', ' ')}
                                    </span>
                                    <span className="text-[10px] text-description font-medium italic">
                                        {count} {count === 1 ? 'Question' : 'Questions'}
                                    </span>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <div className="relative">
                                        <Input
                                            type="number"
                                            min={0}
                                            max={100}
                                            value={typePercentages[type] ?? 0}
                                            onChange={(e) => handlePercentageChange(type, e.target.value)}
                                            className="w-20 h-9 pr-7 text-right font-bold bg-background border-input text-body focus:ring-ring"
                                        />
                                        <Percent className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Progress Bar Visualization */}
                    <div className="space-y-1.5 px-1">
                        <Progress 
                            value={totalPct} 
                            className={cn(
                                "h-1.5 transition-all bg-muted", 
                                isError ? "[&>div]:bg-destructive" : "[&>div]:bg-success"
                            )} 
                        />
                        <p className={cn(
                            "text-[10px] font-medium text-center",
                            isError ? "text-destructive italic" : "text-success"
                        )}>
                            {isError 
                                ? `Error: Total weighting must equal 100% (currently ${totalPct}%)` 
                                : "Weighting is balanced perfectly!"}
                        </p>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="bg-muted/30 border-t border-border p-6 flex items-center justify-between">
                <div className="space-y-0.5">
                    <Label htmlFor="auto" className="text-sm font-bold text-subtitle cursor-pointer">
                        Smart Point Allocation
                    </Label>
                    <p className="text-[10px] text-description font-medium">
                        Automatically divide total score by type weights.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "p-1.5 rounded-lg transition-colors",
                        autoPoints ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                    )}>
                        <Sparkles className="w-4 h-4" />
                    </div>
                    <Switch
                        id="auto"
                        checked={autoPoints}
                        onCheckedChange={setAutoPoints}
                        className="data-[state=checked]:bg-primary"
                    />
                </div>
            </CardFooter>
        </Card>
    );
}