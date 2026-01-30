import AppLayout from '@/layouts/app-layout'
import { AnimatePresence, motion } from 'framer-motion'
import {
    CheckCircle2,
    Clock,
    ExternalLink,
    MapPin,
    RefreshCw,
    ShieldCheck,
    User,
    Users,
    Maximize2,
    Minimize2,
} from 'lucide-react'
import { QRCodeCanvas } from 'qrcode.react'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { route } from 'ziggy-js'

/* ---------------- TYPES ---------------- */

interface Student {
    id: number
    name: string
    checked_in_at: string
    distance: string
    avatar?: string | null
}

interface QrSession {
    id: string
    qr_token: string
    class_code: string
    expires_in: number
}

/* ---------------- GPS HELPER ---------------- */

const getLocation = (): Promise<{ latitude: number; longitude: number }> =>
    new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            pos =>
                resolve({
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                }),
            err => reject(err),
            { enableHighAccuracy: true, timeout: 10000 }
        )
    })

/* ---------------- STUDENT CARD ---------------- */

const StudentCard = React.memo(
    ({ student, isNewest }: { student: Student; isNewest: boolean }) => (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                boxShadow: isNewest ? '0 0 0 2px #3b82f6' : 'none',
            }}
            className={`flex items-center gap-3 rounded-xl border bg-card p-3 shadow-sm ${
                isNewest ? 'bg-blue-500/5 border-blue-500/30' : ''
            }`}
        >
            <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-muted">
                {student.avatar ? (
                    <img src={student.avatar} className="h-full w-full rounded-full object-cover" />
                ) : (
                    <User size={18} />
                )}
            </div>

            <div className="flex-1 min-w-0">
                <h4 className="truncate font-bold text-sm">{student.name}</h4>
                <div className="flex gap-2 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <Clock size={10} />
                        {new Date(student.checked_in_at).toLocaleTimeString()}
                    </span>
                    <span className="flex items-center gap-1">
                        <MapPin size={10} />
                        {student.distance.slice(0, 3)}m
                    </span>
                </div>
            </div>

            <CheckCircle2 size={16} className="text-green-500" />
        </motion.div>
    )
)

/* ---------------- MAIN PAGE ---------------- */

export default function AttendanceDashboard({
    students: initialStudents,
}: {
    students: Student[]
}) {
    const [students, setStudents] = useState<Student[]>(initialStudents)
    const [qrValue, setQrValue] = useState('')
    const [securityCode, setSecurityCode] = useState('')
    const [timeLeft, setTimeLeft] = useState(60)
    const [isFocusMode, setIsFocusMode] = useState(false)

    /* ---- Fetch QR + GPS ---- */

    const fetchQrSession = useCallback(async () => {
        try {
            const location = await getLocation()

            const res = await fetch(route('instructor.attendance.qr'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': (
                        document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement
                    ).content,
                },
                body: JSON.stringify(location),
            })

            const data: { session: QrSession } = await res.json()

            setQrValue(data.session.qr_token)
            setSecurityCode(data.session.class_code)
            setTimeLeft(60)
        } catch (err) {
            alert('Location permission is required to start attendance.')
            console.error(err)
        }
    }, [])

    /* ---- Poll Students ---- */

    const fetchStudents = useCallback(async () => {
        const res = await fetch(route('instructor.attendance.request-student'))
        const data = await res.json()
        setStudents(data)
    }, [])

    /* ---- Effects ---- */

    useEffect(() => {
        fetchQrSession()
        const poll = setInterval(fetchStudents, 5000)
        return () => clearInterval(poll)
    }, [fetchQrSession, fetchStudents])

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    fetchQrSession()
                    return 60
                }
                return t - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [fetchQrSession])

    /* ---- Render Students ---- */

    const renderedStudents = useMemo(
        () =>
            [...students]
                .sort(
                    (a, b) =>
                        new Date(b.checked_in_at).getTime() -
                        new Date(a.checked_in_at).getTime()
                )
                .map((s, i) => (
                    <StudentCard
                        key={`${s.id}-${s.checked_in_at}`}
                        student={s}
                        isNewest={i === 0}
                    />
                )),
        [students]
    )

    return (
        <AppLayout>
            <div className="container mx-auto p-6 max-w-[1800px]">
                <div className="grid lg:grid-cols-12 gap-6">

                    {/* QR SIDE */}
                    <section className={isFocusMode ? 'lg:col-span-12' : 'lg:col-span-4'}>
                        <div className="relative rounded-3xl border bg-card p-8 shadow-xl text-center">

                            <button
                                onClick={() => setIsFocusMode(!isFocusMode)}
                                className="absolute right-6 top-6 rounded-full bg-muted p-2"
                            >
                                {isFocusMode ? <Minimize2 /> : <Maximize2 />}
                            </button>

                            <h2 className="text-2xl font-black mb-6 flex items-center justify-center gap-2">
                                <ShieldCheck className="text-primary" /> Scan Attendance
                            </h2>

                            <div className="inline-block bg-white p-6 rounded-2xl shadow-xl">
                                {qrValue && (
                                    <QRCodeCanvas
                                        value={qrValue}
                                        size={isFocusMode ? 600 : 380}
                                        level="L"
                                    />
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-8">
                                <div className="rounded-xl border p-4">
                                    <div className="text-4xl font-black text-primary tracking-widest">
                                        {securityCode}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        Rotation Code
                                    </div>
                                </div>

                                <div className="rounded-xl border p-4">
                                    <div className="text-2xl font-bold">{timeLeft}s</div>
                                    <div className="text-xs text-muted-foreground">
                                        Refresh
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* STUDENT LOG */}
                    {!isFocusMode && (
                        <section className="lg:col-span-8 flex flex-col">
                            <div className="flex justify-between mb-4">
                                <h2 className="text-2xl font-bold">Live Attendance</h2>
                                <div className="flex items-center gap-2">
                                    <Users />
                                    <span className="font-black">{students.length}</span>
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3 overflow-y-auto h-[700px] p-2">
                                <AnimatePresence>
                                    {students.length ? (
                                        renderedStudents
                                    ) : (
                                        <div className="col-span-full text-center text-muted-foreground">
                                            Waiting for first scan...
                                        </div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </AppLayout>
    )
}
