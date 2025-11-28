import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useEffect } from 'react';

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
    questionTypes: { type: string; count: number }[]; // 👈 updated
    autoPoints: boolean;
    setAutoPoints: (val: boolean) => void;
}) {
    // =======================================================
    // 🔹 Step 1: Auto-distribute percentages equally (only once when loading)
    // =======================================================
    // useEffect(() => {
    //     if (
    //         questionTypes.length > 0 &&
    //         Object.keys(typePercentages).length === 0
    //     ) {
    //         console.log(questionTypes);
    //         const equalShare = parseFloat(
    //             (100 / questionTypes.length).toFixed(2),
    //         );
    //         const distributed = questionTypes.reduce(
    //             (acc, type, i) => {
    //                 // =======================================================
    //                 // Last item adjusts to ensure total = 100%
    //                 // =======================================================
    //                 if (i === questionTypes.length - 1) {
    //                     const remainder =
    //                         100 - equalShare * (questionTypes.length - 1);
    //                     acc[type] = parseFloat(remainder.toFixed(2));
    //                 } else {
    //                     acc[type] = equalShare;
    //                 }
    //                 return acc;
    //             },
    //             {} as Record<string, number>,
    //         );
    //         setTypePercentages(distributed);
    //     }
    // }, [questionTypes, typePercentages, setTypePercentages]);
    useEffect(() => {
        if (
            questionTypes.length > 0 &&
            Object.keys(typePercentages).length === 0
        ) {
            const equalShare = parseFloat(
                (100 / questionTypes.length).toFixed(2),
            );
            const distributed = questionTypes.reduce(
                (acc, { type }, i) => {
                    if (i === questionTypes.length - 1) {
                        const remainder =
                            100 - equalShare * (questionTypes.length - 1);
                        acc[type] = parseFloat(remainder.toFixed(2));
                    } else {
                        acc[type] = equalShare;
                    }
                    return acc;
                },
                {} as Record<string, number>,
            );
            setTypePercentages(distributed);
        }
    }, [questionTypes, typePercentages, setTypePercentages]);

    // =======================================================
    // 🔹 Step 2: Handle user changing individual percentage
    // =======================================================
    const handlePercentageChange = (type: string, value: string) => {
        const val = Math.min(100, Math.max(0, Number(value)));
        setTypePercentages((prev) => ({ ...prev, [type]: val }));
    };

    // =======================================================
    // 🔹 Step 3: Calculate total & color
    // =======================================================
    const totalPct = Object.values(typePercentages).reduce((a, b) => a + b, 0);
    const pctColor = totalPct === 100 ? 'text-green-600' : 'text-red-500';

    return (
        <>
            <Card className="gap-4">
                <CardHeader>
                    <CardTitle>Score Settings</CardTitle>
                    {/* <CardDescription>Card Description</CardDescription>
                    <CardAction className="flex items-center gap-2">
                        <Label htmlFor="auto">Set</Label>
                        <Switch
                            id="auto"
                            checked={autoPoints}
                            onCheckedChange={setAutoPoints}
                        />
                    </CardAction> */}
                </CardHeader>
                <CardContent>
                    {/* Total Score Input */}
                    <div className="mt-3 mb-3">
                        <Label>Total Score</Label>
                        <Input
                            type="number"
                            min={1}
                            value={totalScore}
                            onChange={(e) =>
                                setTotalScore(Number(e.target.value))
                            }
                        />
                    </div>

                    {/* Percentage by Question Type */}
                    <div className="space-y-2">
                        <Label>Percentage by Question Type</Label>
                        {questionTypes.map(({ type, count }) => (
                            <div
                                key={type}
                                className="flex items-center justify-between gap-2 text-sm"
                            >
                                <span className=" text-xs capitalize">
                                    {type.replace('_', ' ')} ({count})
                                </span>
                                <div className='flex items-center gap-2'>
                                    <Input
                                        type="number"
                                        min={0}
                                        max={100}
                                        value={typePercentages[type] ?? 0}
                                        onChange={(e) =>
                                            handlePercentageChange(
                                                type,
                                                e.target.value,
                                            )
                                        }
                                        className="w-20"
                                    />
                                    <span>%</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <p className={`mt-2 text-xs font-medium ${pctColor}`}>
                        Total: {totalPct}% (must equal 100%)
                    </p>
                </CardContent>
                <CardFooter className="flex items-center gap-2">
                    <Label htmlFor="auto">Auto Points</Label>
                    <Switch
                        id="auto"
                        checked={autoPoints}
                        onCheckedChange={setAutoPoints}
                    />
                </CardFooter>
            </Card>
        </>
    );
}
