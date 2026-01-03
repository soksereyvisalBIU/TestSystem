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
            className="flex items-start gap-3 rounded-lg border border-border bg-card p-3 transition-all hover:border-primary/50 hover:bg-muted/50 hover:shadow-sm"
        >
            <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Icon className="h-4 w-4" />
            </div>
            <div>
                <p className="font-bold text-title text-sm">{title}</p>
                <p className="text-xs text-description line-clamp-1">{desc}</p>
            </div>
        </Link>
    );
}

export const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-xl border border-border bg-card p-3 shadow-2xl backdrop-blur-md">
                <p className="font-black text-title">
                    {payload[0].payload.fullName}
                </p>
                <p className="text-sm font-bold text-primary">
                    Score: {payload[0].value}
                </p>
                <p className="text-[10px] font-black uppercase tracking-widest text-description">
                    Status: {payload[0].payload.status || 'Draft'}
                </p>
            </div>
        );
    }
    return null;
};
export function MetaItem({ icon: Icon, label, value, variant = "default" }: any) {
    const variants: any = {
        default: "bg-muted text-muted-foreground",
        blue: "bg-primary/10 text-primary"
    };
    return (
        <div className="flex items-center gap-3">
            <div className={`rounded-xl p-2 ${variants[variant]}`}>
                <Icon className="h-4 w-4" />
            </div>
            <div className="flex flex-col leading-tight">
                <span className="text-[10px] uppercase tracking-[0.15em] text-description font-black">{label}</span>
                <span className="text-title font-bold">{value}</span>
            </div>
        </div>
    );
}

export function MetricCard({ label, value, subtext, icon: Icon, variant = "default" }: any) {
    const styles: any = {
        default: "bg-muted text-muted-foreground",
        blue: "bg-primary/10 text-primary",
        green: "bg-success/10 text-success",
        amber: "bg-chart-4/10 text-chart-4 animate-pulse-subtle"
    };
    return (
        <Card className="group border-none bg-card shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 overflow-hidden rounded-3xl">
            <CardContent className="p-6">
                <div className="flex items-center justify-between relative z-10">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-description">{label}</p>
                        <h3 className="text-3xl font-[1000] text-title tracking-tighter">{value}</h3>
                        <p className="text-xs font-bold text-description/80">{subtext}</p>
                    </div>
                    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12 group-hover:scale-110 ${styles[variant]}`}>
                        <Icon className="h-7 w-7" />
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
            className="relative h-12 rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-2 text-sm font-bold text-description transition-all data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none hover:text-title"
        >
            {children}
        </TabsTrigger>
    );
}

export function StatusBadge({ status }: { status: string }) {
    const config: Record<string, string> = {
        submitted: 'bg-primary/10 text-primary border-primary/20',
        checked: 'bg-success/10 text-success border-success/20',
        late: 'bg-destructive/10 text-destructive border-destructive/20',
        draft: 'bg-muted text-muted-foreground border-border',
    };
    return (
        <Badge variant="outline" className={`${config[status] || config.draft} font-black px-3 py-1 uppercase text-[10px] tracking-widest rounded-md`}>
            {status || 'Pending'}
        </Badge>
    );
}