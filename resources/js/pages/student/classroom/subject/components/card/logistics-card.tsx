// Logistics Card Component

import { BookOpen, Clock, GraduationCap } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DetailItem } from '../list/detail-item';

interface LogisticsCardProps {
    schedule: string;
    location: string;
    credits: string;
}

export function LogisticsCard({
    schedule,
    location,
    credits,
}: LogisticsCardProps) {
    return (
        <Card className="rounded-2xl border-none shadow-md">
            <CardHeader>
                <CardTitle className="text-base font-semibold">
                    Logistics
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <DetailItem icon={Clock} label="Schedule" value={schedule} />
                <DetailItem
                    icon={GraduationCap}
                    label="Location"
                    value={location}
                />
                <DetailItem icon={BookOpen} label="Weight" value={credits} />
            </CardContent>
        </Card>
    );
}
