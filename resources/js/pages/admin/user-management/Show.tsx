import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import {
    Activity,
    ArrowLeft,
    BookOpen,
    Calendar,
    CheckCircle2,
    Clock,
    ExternalLink,
    GraduationCap,
    Layers,
    Mail,
    ShieldCheck,
    Trophy,
} from 'lucide-react';
import { route } from 'ziggy-js';

export default function Show({ user }: any) {
    const roles: any = {
        1: {
            label: 'Student',
            icon: GraduationCap,
            color: 'text-blue-600 bg-blue-50 border-blue-200',
        },
        2: {
            label: 'Instructor',
            icon: BookOpen,
            color: 'text-purple-600 bg-purple-50 border-purple-200',
        },
        3: {
            label: 'Admin',
            icon: ShieldCheck,
            color: 'text-rose-600 bg-rose-50 border-rose-200',
        },
    };

    const roleData = roles[user.role];
    const RoleIcon = roleData.icon;

    // Helper to determine which classroom array to use based on role
    const classroomList =
        user.role === 2 ? user.own_classrooms : user.classrooms;

    const securityItems = [
        {
            label: '2FA',
            status: user.two_factor_confirmed_at,
            trueText: '2FA Enabled',
            falseText: '2FA Disabled',
        },
        {
            label: 'Email',
            status: user.email_verified_at,
            trueText: 'Email Verified',
            falseText: 'Email Not Verified',
        },
        {
            label: 'Google',
            status: user.google_id,
            trueText: 'Google Verified',
            falseText: 'Google Not Verified',
        },
    ];

    return (
        <AppLayout>
            <Head title={`User Profile - ${user.name}`} />

            <div className="container mx-auto max-w-7xl space-y-8 p-4 md:p-8">
                {/* Header: Professional Navigation */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={route('admin.user-management.index')}>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-9 w-9 rounded-full p-0"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                User Record
                            </h1>
                            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                Account Management{' '}
                                <span className="text-xs opacity-50">/</span>{' '}
                                {user.name}
                            </p>
                        </div>
                    </div>
                    <div className="hidden gap-2 md:flex">
                        <Button variant="outline" size="sm">
                            Download Report
                        </Button>
                        <Button size="sm">Edit Account</Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    {/* Left: Identity Card (3 cols) */}
                    <aside className="space-y-6 lg:col-span-4">
                        <Card className="overflow-hidden border-border/60 py-0 shadow-sm">
                            <div className="h-24 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900" />
                            <CardContent className="-mt-12 flex flex-col items-center pt-0 pb-6 text-center">
                                <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                                    <AvatarImage
                                        src={user.avatar}
                                        className="object-cover"
                                    />
                                    <AvatarFallback className="text-2xl font-bold">
                                        {user.name[0]}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="mt-4 space-y-1">
                                    <h2 className="text-xl font-bold tracking-tight">
                                        {user.name}
                                    </h2>
                                    <p className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
                                        <Mail className="h-3.5 w-3.5" />{' '}
                                        {user.email}
                                    </p>
                                </div>

                                <Badge
                                    variant="outline"
                                    className={`${roleData.color} mt-4 rounded-full px-3 py-1 font-semibold`}
                                >
                                    <RoleIcon className="mr-1.5 h-3.5 w-3.5" />
                                    {roleData.label}
                                </Badge>
                            </CardContent>
                            <Separator />
                            <div className="space-y-4 bg-slate-50/30 p-5">
                                {/* Joined */}
                                <div className="flex items-center justify-between text-sm">
                                    <span className="flex items-center gap-2 text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        Joined
                                    </span>
                                    <span className="font-medium">
                                        {new Date(
                                            user.created_at,
                                        ).toLocaleDateString(undefined, {
                                            dateStyle: 'medium',
                                        })}
                                    </span>
                                </div>

                                {/* Security Items */}
                                {securityItems.map((item) => (
                                    <div
                                        key={item.label}
                                        className="flex items-center justify-between text-sm"
                                    >
                                        <span className="flex items-center gap-2 text-muted-foreground">
                                            <ShieldCheck className="h-4 w-4" />
                                            {item.label}
                                        </span>

                                        <span
                                            className={`rounded px-2 py-0.5 text-xs font-medium italic ${
                                                item.status
                                                    ? 'bg-emerald-50 text-emerald-600'
                                                    : 'bg-rose-50 text-rose-600'
                                            }`}
                                        >
                                            {item.status
                                                ? item.trueText
                                                : item.falseText}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </aside>

                    {/* Right: Insights & Activities (8 cols) */}
                    <main className="space-y-6 lg:col-span-8">
                        {/* KPI Metrics */}
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                            <Card className="border-dashed bg-blue-50/20 shadow-none">
                                <CardContent className="flex flex-col items-center justify-center p-4">
                                    <Layers className="mb-2 h-5 w-5 text-blue-500" />
                                    <span className="text-2xl font-black text-blue-700">
                                        {user.classrooms_count}
                                    </span>
                                    <p className="text-[10px] font-bold tracking-tighter text-blue-600/70 uppercase">
                                        Total Classrooms
                                    </p>
                                </CardContent>
                            </Card>

                            {user.role === 1 && (
                                <Card className="border-dashed bg-orange-50/20 shadow-none">
                                    <CardContent className="flex flex-col items-center justify-center p-4">
                                        <Trophy className="mb-2 h-5 w-5 text-orange-500" />
                                        <span className="text-2xl font-black text-orange-700">
                                            {user.student_assessment_count}
                                        </span>
                                        <p className="text-[10px] font-bold tracking-tighter text-orange-600/70 uppercase">
                                            Submissions
                                        </p>
                                    </CardContent>
                                </Card>
                            )}

                            <Card className="border-dashed bg-emerald-50/20 shadow-none">
                                <CardContent className="flex flex-col items-center justify-center p-4">
                                    <Activity className="mb-2 h-5 w-5 text-emerald-500" />
                                    <span className="text-2xl font-black text-emerald-700">
                                        Active
                                    </span>
                                    <p className="text-[10px] font-bold tracking-tighter text-emerald-600/70 uppercase">
                                        User Status
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Detail Tabs */}
                        <Tabs defaultValue="overview" className="w-full">
                            <TabsList className="mb-6 h-auto w-full justify-start rounded-none border-b bg-transparent p-0">
                                <TabsTrigger
                                    value="overview"
                                    className="rounded-none border-b-2 border-transparent px-6 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent"
                                >
                                    Overview
                                </TabsTrigger>
                                {user.role === 1 && (
                                    <TabsTrigger
                                        value="assessments"
                                        className="rounded-none border-b-2 border-transparent px-6 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent"
                                    >
                                        Academic Progress
                                    </TabsTrigger>
                                )}
                            </TabsList>

                            <TabsContent value="overview">
                                <Card className="border-none bg-transparent shadow-none">
                                    <CardHeader className="flex flex-row items-center justify-between px-0 pt-0">
                                        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                                            {user.role === 2
                                                ? 'Managed Classrooms'
                                                : 'Enrolled Classrooms'}
                                            <Badge
                                                variant="secondary"
                                                className="rounded-full"
                                            >
                                                {classroomList?.length || 0}
                                            </Badge>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="px-0">
                                        <div className="grid gap-3">
                                            {classroomList?.length ? (
                                                classroomList.map((c: any) => (
                                                    <div
                                                        key={c.id}
                                                        className="group flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm transition-all hover:border-primary/50"
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 transition-colors group-hover:bg-primary/10">
                                                                <Layers className="h-5 w-5 text-slate-500 group-hover:text-primary" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-semibold">
                                                                    {c.name}
                                                                </p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    {c.description ||
                                                                        'No description provided'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <Link
                                                            href={route(
                                                                'instructor.classes.show',
                                                                { class: c.id },
                                                            )}
                                                            as="button"
                                                            className="inline-flex h-8 items-center justify-center rounded-md bg-transparent px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                                                        >
                                                            Manage{' '}
                                                            <ExternalLink className="ml-2 h-3 w-3" />
                                                        </Link>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="rounded-xl border border-dashed py-12 text-center">
                                                    <p className="text-sm text-muted-foreground">
                                                        No classroom data
                                                        available for this user.
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="assessments">
                                <div className="space-y-4">
                                    {user.student_assessment?.length ? (
                                        user.student_assessment.map(
                                            (sa: any) => (
                                                <Card
                                                    key={sa.id}
                                                    className="border-border/60 transition-shadow hover:shadow-md"
                                                >
                                                    <CardContent className="flex flex-col justify-between gap-4 p-5 md:flex-row md:items-center">
                                                        <div className="space-y-1">
                                                            <h4 className="font-bold text-slate-900">
                                                                {
                                                                    sa
                                                                        .assessment
                                                                        .title
                                                                }
                                                            </h4>
                                                            <div className="flex items-center gap-3 text-xs">
                                                                <span className="flex items-center gap-1 font-medium">
                                                                    <Clock className="h-3 w-3" />{' '}
                                                                    {
                                                                        sa
                                                                            .attempts
                                                                            .length
                                                                    }{' '}
                                                                    Attempt(s)
                                                                </span>
                                                                <Separator
                                                                    orientation="vertical"
                                                                    className="h-3"
                                                                />
                                                                <span className="text-[10px] tracking-widest text-muted-foreground uppercase">
                                                                    ID: {sa.id}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-6">
                                                            <div className="text-right">
                                                                <p className="mb-1 text-[10px] font-bold text-muted-foreground uppercase">
                                                                    Final Score
                                                                </p>
                                                                <p
                                                                    className={`text-xl font-black ${parseFloat(sa.score) > 0 ? 'text-emerald-600' : 'text-slate-400'}`}
                                                                >
                                                                    {sa.score}
                                                                </p>
                                                            </div>
                                                            <div className="hidden h-10 w-px bg-border md:block" />
                                                            <Badge
                                                                className={
                                                                    sa.status ===
                                                                    'submitted'
                                                                        ? 'border-none bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                                                                        : 'border-none bg-orange-100 text-orange-700 hover:bg-orange-100'
                                                                }
                                                            >
                                                                {sa.status ===
                                                                    'submitted' && (
                                                                    <CheckCircle2 className="mr-1 h-3 w-3" />
                                                                )}
                                                                {sa.status}
                                                            </Badge>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ),
                                        )
                                    ) : (
                                        <div className="rounded-2xl bg-slate-50 py-20 text-center">
                                            <Trophy className="mx-auto mb-4 h-12 w-12 text-slate-200" />
                                            <p className="font-medium text-muted-foreground">
                                                No assessments completed yet.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </main>
                </div>
            </div>
        </AppLayout>
    );
}
