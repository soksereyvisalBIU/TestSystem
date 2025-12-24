// --- SUB-COMPONENTS for cleaner code ---

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { TabsTrigger } from '@/components/ui/tabs';
import { Link } from '@inertiajs/react';

// export function TabTrigger({
//     value,
//     children,
// }: {
//     value: string;
//     children: React.ReactNode;
// }) {
//     return (
//         <TabsTrigger
//             value={value}
//             className="rounded-none border-b-2 border-transparent px-6 py-3 text-slate-500 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:shadow-none"
//         >
//             {children}
//         </TabsTrigger>
//     );
// }

// export function MetricCard({
//     label,
//     value,
//     subtext,
//     icon: Icon,
//     trend,
//     color,
// }: any) {
//     return (
//         <Card className="border-none shadow-sm">
//             <CardContent className="p-6">
//                 <div className="flex items-center justify-between">
//                     <div>
//                         <p className="text-sm font-medium text-slate-500">
//                             {label}
//                         </p>
//                         <h3
//                             className={`mt-2 text-2xl font-bold ${color || 'text-slate-900'}`}
//                         >
//                             {value}
//                         </h3>
//                         <p className="mt-1 text-xs text-slate-400">{subtext}</p>
//                     </div>
//                     <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50">
//                         <Icon className="h-6 w-6 text-slate-500" />
//                     </div>
//                 </div>
//             </CardContent>
//         </Card>
//     );
// }

// export function StatusBadge({ status }: { status: string }) {
//     const styles: Record<string, string> = {
//         submitted: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
//         checked: 'bg-green-100 text-green-700 hover:bg-green-200',
//         draft: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
//         late: 'bg-red-100 text-red-700 hover:bg-red-200',
//     };

//     const label = status
//         ? status.charAt(0).toUpperCase() + status.slice(1)
//         : 'Pending';

//     return (
//         <Badge
//             variant="secondary"
//             className={`${styles[status] || styles.draft} font-normal`}
//         >
//             {label}
//         </Badge>
//     );
// }

export function ReportLink({ icon: Icon, title, desc }: any) {
    return (
        <Link
            href="#"
            className="flex items-start gap-3 rounded-lg border border-slate-100 bg-white p-3 transition hover:border-blue-200 hover:shadow-sm"
        >
            <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                <Icon className="h-4 w-4" />
            </div>
            <div>
                <p className="font-medium text-slate-900">{title}</p>
                <p className="text-xs text-slate-500">{desc}</p>
            </div>
        </Link>
    );
}

export const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-lg">
                <p className="font-semibold text-slate-900">
                    {payload[0].payload.fullName}
                </p>
                <p className="text-sm text-blue-600">
                    Score: {payload[0].value}
                </p>
                <p className="text-xs text-slate-500 capitalize">
                    Status: {payload[0].payload.status || 'Draft'}
                </p>
            </div>
        );
    }
    return null;
};


// --- REUSABLE SUB-COMPONENTS (Best Practice: Atomic Design) ---

export function MetaItem({ icon: Icon, label, value, variant = "default" }: any) {
    const variants: any = {
        default: "bg-slate-100 text-slate-500",
        blue: "bg-blue-50 text-blue-500"
    };
    return (
        <div className="flex items-center gap-3">
            <div className={`rounded-lg p-2 ${variants[variant]}`}>
                <Icon className="h-4 w-4" />
            </div>
            <div className="flex flex-col leading-tight">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">{label}</span>
                <span className="text-slate-900 font-semibold">{value}</span>
            </div>
        </div>
    );
}

export function MetricCard({ label, value, subtext, icon: Icon, variant = "default" }: any) {
    const styles: any = {
        default: "bg-slate-50 text-slate-400",
        blue: "bg-blue-50 text-blue-500",
        green: "bg-emerald-50 text-emerald-500",
        amber: "bg-amber-50 text-amber-500 animate-pulse-subtle"
    };
    return (
        <Card className="group border-none shadow-sm transition-all hover:shadow-md hover:-translate-y-1 overflow-hidden">
            <CardContent className="p-6 py-0">
                <div className="flex items-center justify-between relative z-10">
                    <div className="space-y-1">
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{label}</p>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
                        <p className="text-xs font-medium text-slate-500">{subtext}</p>
                    </div>
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12 ${styles[variant]}`}>
                        <Icon className="h-6 w-6" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export function TabTrigger({ value, children }: { value: string; children: React.ReactNode }) {
    return (
        <TabsTrigger
            value={value}
            className="relative h-12 rounded-none border-b-2 border-transparent bg-transparent px-2 pb-3 pt-2 text-sm font-semibold text-slate-500 transition-none data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:shadow-none"
        >
            {children}
        </TabsTrigger>
    );
}

export function StatusBadge({ status }: { status: string }) {
    const config: Record<string, string> = {
        submitted: 'bg-blue-50 text-blue-700 border-blue-100',
        checked: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        late: 'bg-red-50 text-red-700 border-red-100',
        draft: 'bg-slate-50 text-slate-600 border-slate-200',
    };
    return (
        <Badge variant="outline" className={`${config[status] || config.draft} font-medium px-2.5 py-0.5 capitalize`}>
            {status || 'Pending'}
        </Badge>
    );
}