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
import { route } from 'ziggy-js';

/* ---------------- TYPES ---------------- */

interface Student {
    id: string;
    name: string;
    time: string;
    distance: string;
    status: 'verified' | 'pending';
}

interface QrSession {
    id: string;
    qr_token: string;
    class_code: string;
    expires_in: number;
}

/* ---------------- MOCK STUDENTS ---------------- */

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

/* ---------------- STUDENT ROW ---------------- */

const StudentRow = ({ student }: { student: Student }) => (
    <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between rounded-2xl border bg-card p-4 shadow-sm"
    >
        <div className="flex items-center gap-4">
            <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border bg-muted">
                    <User size={20} />
                </div>
                {student.status === 'verified' && (
                    <div className="absolute -bottom-1 -right-1 rounded-full bg-success p-0.5 text-white">
                        <CheckCircle2 size={12} />
                    </div>
                )}
            </div>

            <div>
                <h4 className="font-bold">{student.name}</h4>
                <div className="mt-1 flex gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <Clock size={12} /> {student.time}
                    </span>
                    <span className="flex items-center gap-1">
                        <MapPin size={12} /> {student.distance}
                    </span>
                </div>
            </div>
        </div>

        <button className="rounded-xl bg-primary px-5 py-2 text-xs font-bold text-white">
            Verify
        </button>
    </motion.div>
);

/* ---------------- PAGE ---------------- */

export default function AttendanceDashboard() {
    const [qrValue, setQrValue] = useState('');
    const [securityCode, setSecurityCode] = useState('');
    const [timeLeft, setTimeLeft] = useState(60);

    /* ---- Fetch QR Session ---- */
    const fetchQrSession = useCallback(async () => {
        const res = await fetch(route('instructor.attendance.qr'));
        const data: { session: QrSession } = await res.json();

        setQrValue(data.session.qr_token);
        setSecurityCode(data.session.class_code);
        setTimeLeft(data.session.expires_in);
    }, []);

    /* ---- Initial Load ---- */
    useEffect(() => {
        fetchQrSession();
    }, [fetchQrSession]);

    /* ---- Countdown ---- */
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    fetchQrSession(); // 🔁 rotate QR
                    return 60;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [fetchQrSession]);

    return (
        <AppLayout>
            <div className="container mx-auto grid max-w-7xl grid-cols-1 gap-8 p-4 lg:grid-cols-12">

                {/* LEFT: QR */}
                <section className="lg:col-span-6 flex flex-col items-center">
                    <ShieldCheck size={32} className="mb-4 text-primary" />

                    <motion.div
                        key={qrValue}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="rounded-3xl border bg-white p-5 shadow-xl"
                    >
                        {qrValue && (
                            <QRCodeCanvas
                                value={qrValue}
                                size={240}
                                level="H"
                            />
                        )}
                    </motion.div>

                    <div className="mt-6 text-xs font-bold">
                        Rotation Code: {securityCode}
                    </div>

                    <div className="mt-2 text-xs text-muted-foreground">
                        Expires in {timeLeft}s
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-xs">
                        <RefreshCw size={14} className="animate-spin" />
                        Dynamic Authentication Active
                    </div>
                </section>

                {/* RIGHT: LOG */}
                <section className="lg:col-span-6 flex h-[650px] flex-col rounded-3xl border bg-card">
                    <div className="border-b p-6">
                        <h2 className="text-2xl font-bold">Attendance Log</h2>
                        <p className="text-xs text-muted-foreground">
                            Live student check-in
                        </p>
                    </div>

                    <div className="flex-1 space-y-4 overflow-y-auto p-6">
                        <AnimatePresence>
                            {MOCK_STUDENTS.map((s) => (
                                <StudentRow key={s.id} student={s} />
                            ))}
                        </AnimatePresence>
                    </div>

                    <div className="border-t p-4">
                        <button className="flex w-full items-center justify-center gap-2 text-xs font-bold">
                            View History <ExternalLink size={14} />
                        </button>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}
