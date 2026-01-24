    import AppLayout from '@/layouts/app-layout';
    import { AnimatePresence, motion } from 'framer-motion';
    import {
        CheckCircle2,
        Clock,
        ExternalLink,
        History,
        MapPin,
        RefreshCw,
        ShieldCheck,
        User,
    } from 'lucide-react';
    import { QRCodeCanvas } from 'qrcode.react';
    import { useCallback, useEffect, useState } from 'react';

    // --- Types ---
    interface Student {
        id: string;
        name: string;
        time: string;
        distance: string;
        status: 'verified' | 'pending';
    }

    const MOCK_STUDENTS: Student[] = [
        {
            id: '1',
            name: 'Alex Johnson',
            time: '10:45 AM',
            distance: '0.8 km',
            status: 'verified',
        },
        {
            id: '2',
            name: 'Sarah Williams',
            time: '10:42 AM',
            distance: '1.2 km',
            status: 'verified',
        },
        {
            id: '3',
            name: 'Michael Chen',
            time: '10:38 AM',
            distance: '2.5 km',
            status: 'pending',
        },
    ];

    const StudentRow = ({ student }: { student: Student }) => (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="group flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-sm transition-all duration-300 hover:border-primary/40"
        >
            <div className="flex items-center gap-4">
                <div className="relative">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-muted transition-colors group-hover:bg-primary/5">
                        <User
                            size={20}
                            className="text-description group-hover:text-primary"
                        />
                    </div>
                    {student.status === 'verified' && (
                        <div className="absolute -right-1 -bottom-1 rounded-full border-2 border-card bg-success p-0.5 text-primary-foreground">
                            <CheckCircle2 size={12} />
                        </div>
                    )}
                </div>
                <div>
                    <h4 className="font-bold text-title">{student.name}</h4>
                    <div className="mt-1 flex gap-4 text-[11px] font-medium text-description">
                        <span className="flex items-center gap-1">
                            <Clock size={12} className="text-primary/70" />{' '}
                            {student.time}
                        </span>
                        <span className="flex items-center gap-1">
                            <MapPin size={12} className="text-destructive/70" />{' '}
                            {student.distance}
                        </span>
                    </div>
                </div>
            </div>
            <button className="rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:opacity-90 active:scale-95">
                Verify
            </button>
        </motion.div>
    );

    export default function AttendanceDashboard() {
        const [qrValue, setQrValue] = useState<string>(`beltei-auth-${Date.now()}`);
        const [securityCode, setSecurityCode] = useState<string>('000');
        const [timeLeft, setTimeLeft] = useState<number>(60);

        const refreshSecurity = useCallback(() => {
            setQrValue(`beltei-${Math.random().toString(36).substring(2, 10)}`);
            setSecurityCode(Math.floor(100 + Math.random() * 900).toString());
        }, []);

        useEffect(() => {
            const timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        refreshSecurity();
                        return 60;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }, [refreshSecurity]);

        return (
            <AppLayout>
                <div className="container mx-auto grid max-w-7xl grid-cols-1 items-start gap-8 p-4 lg:grid-cols-12">
                    {/* LEFT: QR TERMINAL */}
                    <section className="flex flex-col items-center lg:col-span-6">
                        <div className="mb-8 flex flex-col items-center text-center">
                            <div className="mb-4 rounded-2xl bg-primary/10 p-3">
                                <ShieldCheck className="text-primary" size={32} />
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight text-title">
                                Security Terminal
                            </h1>
                            <p className="text-sm text-description">
                                BELTEI International School
                            </p>
                        </div>

                        <div className="animate-border-loop relative rounded-[3rem] bg-[conic-gradient(from_var(--border-angle),transparent_20%,var(--color-primary),var(--color-success),transparent_80%)] p-1.5 shadow-2xl">
                            <div className="relative flex min-h-[460px] flex-col items-center justify-center overflow-hidden rounded-[2.8rem] bg-card p-10">
                                {/* THE GHOST CODE LAYER */}
                                <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.03] select-none dark:opacity-[0.07]">
                                    <span className="text-[240px] font-black tracking-tighter text-title italic">
                                        {securityCode}
                                    </span>
                                </div>

                                {/* QR CODE */}
                                <motion.div
                                    key={qrValue}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="relative z-10 rounded-3xl border border-border bg-white p-5 shadow-xl"
                                >
                                    <QRCodeCanvas
                                        value={qrValue}
                                        size={240}
                                        level="H"
                                        imageSettings={{
                                            src: '/logo.png', // Replace with actual logo if needed
                                            height: 40,
                                            width: 40,
                                            excavate: true,
                                        }}
                                    />
                                </motion.div>

                                {/* PROGRESS BAR */}
                                <div className="relative z-10 mt-10 w-full max-w-[240px]">
                                    <div className="mb-2 flex items-center justify-between">
                                        <span className="text-[10px] font-black tracking-widest text-description uppercase">
                                            Rotation Key: {securityCode}
                                        </span>
                                        <span
                                            className={`font-mono text-xs font-bold ${timeLeft < 10 ? 'animate-pulse text-destructive' : 'text-primary'}`}
                                        >
                                            {timeLeft}s
                                        </span>
                                    </div>
                                    <div className="h-2 w-full overflow-hidden rounded-full border border-border bg-muted">
                                        <motion.div
                                            initial={false}
                                            animate={{
                                                width: `${(timeLeft / 60) * 100}%`,
                                            }}
                                            className="h-full bg-primary transition-colors duration-500"
                                            style={{
                                                backgroundColor:
                                                    timeLeft < 10
                                                        ? 'var(--color-destructive)'
                                                        : 'var(--color-primary)',
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <p className="mt-8 flex items-center gap-2 text-xs font-medium text-description">
                            <RefreshCw
                                size={14}
                                className="animate-spin text-success"
                                style={{ animationDuration: '4s' }}
                            />
                            Dynamic Authentication Active
                        </p>
                    </section>

                    {/* RIGHT: STUDENT LOG */}
                    <section className="flex h-[650px] flex-col overflow-hidden rounded-[2.5rem] border border-border bg-card shadow-xl lg:col-span-6">
                        <div className="flex items-center justify-between border-b border-border bg-muted/30 p-8">
                            <div>
                                <h2 className="text-2xl font-bold text-title">
                                    Attendance Log
                                </h2>
                                <p className="mt-0.5 text-xs font-medium text-description">
                                    Live check-in stream
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="rounded-full border border-success/20 bg-success/10 px-3 py-1 text-[10px] font-bold tracking-tighter text-success">
                                    ACTIVE
                                </div>
                                <button className="rounded-full p-2 transition-colors hover:bg-muted">
                                    <History
                                        size={18}
                                        className="text-description"
                                    />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 space-y-4 overflow-y-auto p-6">
                            <AnimatePresence mode="popLayout">
                                {MOCK_STUDENTS.map((student) => (
                                    <StudentRow
                                        key={student.id}
                                        student={student}
                                    />
                                ))}
                            </AnimatePresence>
                        </div>

                        <div className="border-t border-border bg-muted/20 p-5">
                            <button className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold text-link transition-all hover:bg-primary/5">
                                View Detailed History <ExternalLink size={14} />
                            </button>
                        </div>
                    </section>
                </div>
            </AppLayout>
        );
    }
