import AppLayout from '@/layouts/app-layout';
import { AnimatePresence, motion } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
    LocateFixed, Map as MapIcon, Maximize2, Minimize2,
    Navigation, RefreshCw, ShieldCheck, X,
} from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { route } from 'ziggy-js';
import { ChangeView, LocationMarker } from './map-helper';
import { ProgressRing } from './progress-ring';

// --- Sub-Component: Optimized Student Card ---
const StudentItem = React.memo(({ student }: { student: any }) => (
    <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="flex items-center gap-4 rounded-3xl border border-border bg-card p-4 shadow-sm transition-all hover:shadow-md"
    >
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/10 font-black text-primary">
            {student.name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
            <h4 className="truncate text-sm font-black text-title">{student.name}</h4>
            <p className="text-[10px] font-bold text-description uppercase tracking-tight">
                Joined {new Date(student.joined_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
        </div>
    </motion.div>
));

const CAMPUSES = [
    { name: 'BIU Campus 1', lat: 11.547644, lng: 104.916862 },
    { name: 'BIU Campus 2', lat: 11.524727, lng: 104.823482 },
    { name: 'BIU Campus 3', lat: 11.560301, lng: 104.907224 },
];

const DefaultIcon = L.icon({
    iconUrl: '/assets/img/map/marker-icon.png',
    shadowUrl: '/assets/img/map/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function AttendanceDashboard({ students: initialStudents }: { students: any[] }) {
    const [students, setStudents] = useState(initialStudents);
    const [qrData, setQrData] = useState({ token: '', code: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(60);
    const [isFocusMode, setIsFocusMode] = useState(false);
    const [showMapPicker, setShowMapPicker] = useState(false);
    const [coords, setCoords] = useState<[number, number]>([11.5563, 104.9181]);
    const [locationLabel, setLocationLabel] = useState('Auto-Detecting');
    const [isManual, setIsManual] = useState(false);
    
    const watchIdRef = useRef<number | null>(null);
    const isInitialMount = useRef(true);

    // --- API: Fetch QR Session ---
    const fetchQrSession = useCallback(async (currentCoords: [number, number]) => {
        try {
            const token = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content;
            const res = await fetch(route('instructor.attendance.qr'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': token },
                body: JSON.stringify({ lat: currentCoords[0], lng: currentCoords[1] }),
            });
            const data = await res.json();
            setQrData({ token: data.session.qr_token, code: data.session.class_code });
            setTimeLeft(60);
            setIsLoading(false);
        } catch (err) {
            console.error('Session Refresh Failed:', err);
        }
    }, []);

    // --- Effect: Initial Load ---
    useEffect(() => {
        if (isInitialMount.current) {
            fetchQrSession(coords);
            isInitialMount.current = false;
        }
    }, [fetchQrSession, coords]);

    // --- Effect: Polling Students ---
    useEffect(() => {
        const controller = new AbortController();
        const poll = async () => {
            try {
                const res = await fetch(route('instructor.attendance.request-student'), { signal: controller.signal });
                const data = await res.json();
                setStudents(data);
            } catch (e: any) { if (e.name !== 'AbortError') console.error(e); }
        };

        const interval = setInterval(poll, 4000);
        return () => { clearInterval(interval); controller.abort(); };
    }, []);

    // --- Effect: Timer ---
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    fetchQrSession(coords);
                    return 60;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [fetchQrSession, coords]);

    // --- GPS Logic ---
    const initGPS = useCallback(() => {
        if (!navigator.geolocation) return;
        if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = navigator.geolocation.watchPosition(
            (pos) => {
                if (!isManual) {
                    setCoords([pos.coords.latitude, pos.coords.longitude]);
                    setLocationLabel('Current Location');
                }
            },
            (err) => console.error(err),
            { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 },
        );
    }, [isManual]);

    useEffect(() => {
        initGPS();
        return () => { if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current); };
    }, [initGPS]);

    return (
        <AppLayout>
            <div className="min-h-screen bg-background p-4 lg:p-8">
                <div className="mx-auto max-w-[1600px]">
                    
                    {/* Header */}
                    <header className="sticky top-4 z-[50] mb-8 flex flex-wrap items-center justify-between gap-4 rounded-[2.5rem] border border-border bg-card/80 p-4 pl-6 shadow-sm backdrop-blur-md">
                        <div className="flex items-center gap-5">
                            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-all ${isManual ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'}`}>
                                {isManual ? <LocateFixed size={28} /> : <Navigation className="animate-pulse" size={28} />}
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-title">{locationLabel}</h2>
                                <p className="font-mono text-xs font-bold text-description uppercase">{coords[0].toFixed(6)}° N, {coords[1].toFixed(6)}° E</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={() => setShowMapPicker(!showMapPicker)} className="bg-primary text-primary-foreground flex items-center gap-2 rounded-[1.2rem] px-6 py-3.5 text-sm font-black transition-all active:scale-95 shadow-lg shadow-primary/20">
                                {showMapPicker ? <X size={20} /> : <MapIcon size={20} />} {showMapPicker ? 'Close' : 'Location'}
                            </button>
                        </div>
                    </header>

                    {/* Map Picker */}
                    <AnimatePresence>
                        {showMapPicker && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1, marginBottom: 32 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                <div className="grid gap-4 rounded-[2.5rem] border border-border bg-card p-4 shadow-xl lg:grid-cols-4">
                                    <div className="relative h-[450px] overflow-hidden rounded-[2rem] bg-muted lg:col-span-3">
                                        <MapContainer center={coords} zoom={17} style={{ height: '100%', width: '100%' }}>
                                            <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                                            <ChangeView center={coords} />
                                            <LocationMarker position={coords} setPosition={(p) => { setCoords(p); setIsManual(true); setLocationLabel('Pinned'); }} />
                                        </MapContainer>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        {CAMPUSES.map((campus) => (
                                            <button key={campus.name} onClick={() => { setCoords([campus.lat, campus.lng]); setIsManual(true); setLocationLabel(campus.name); }}
                                                className={`rounded-2xl border-2 p-4 text-left transition-all ${locationLabel === campus.name ? 'border-primary bg-primary/5' : 'border-border bg-muted hover:bg-card'}`}>
                                                <span className="text-sm font-black">{campus.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="grid gap-8 lg:grid-cols-12">
                        {/* QR Code Section */}
                        <section className={isFocusMode ? 'lg:col-span-12' : 'lg:col-span-5'}>
                            <div className="relative rounded-[3.5rem] border border-border bg-card p-10 text-center shadow-2xl">
                                <button onClick={() => setIsFocusMode(!isFocusMode)} className="absolute top-8 right-8 p-4 text-muted-foreground hover:text-primary transition-colors">
                                    {isFocusMode ? <Minimize2 size={28} /> : <Maximize2 size={28} />}
                                </button>
                                <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-green-500/10 px-5 py-2 text-green-600">
                                    <ShieldCheck size={20} /> <span className="text-sm font-black uppercase">Secure Live Session</span>
                                </div>
                                
                                <div className="flex justify-center">
                                    <motion.div layout className="mb-10 inline-block rounded-[3rem] bg-white p-8 shadow-2xl ring-1 ring-black/5">
                                        {isLoading ? (
                                            <div className={`flex items-center justify-center bg-muted animate-pulse rounded-2xl ${isFocusMode ? 'h-[520px] w-[520px]' : 'h-[340px] w-[340px]'}`}>
                                                <RefreshCw className="animate-spin text-primary/20" size={48} />
                                            </div>
                                        ) : (
                                            <QRCodeCanvas value={qrData.token || 'loading'} size={isFocusMode ? 520 : 340} level="H" />
                                        )}
                                    </motion.div>
                                </div>

                                <div className={`grid gap-6 ${isFocusMode ? 'mx-auto max-w-2xl grid-cols-2' : 'grid-cols-2'}`}>
                                    <div className="rounded-[2rem] bg-muted p-6">
                                        <div className="text-4xl font-black text-primary">{qrData.code || '---'}</div>
                                        <p className="mt-2 text-[11px] font-bold text-description uppercase tracking-wider">Entry Code</p>
                                    </div>
                                    <div className="relative flex flex-col items-center justify-center rounded-[2rem] bg-muted p-6">
                                        <div className="absolute top-4 right-4"><ProgressRing progress={timeLeft} /></div>
                                        <div className="text-4xl font-black text-title">{timeLeft}s</div>
                                        <p className="mt-2 text-[11px] font-bold text-description uppercase tracking-wider">Refresh</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Arrivals Section */}
                        {!isFocusMode && (
                            <section className="lg:col-span-7 flex flex-col">
                                <div className="mb-6 flex items-end justify-between px-4">
                                    <div>
                                        <h3 className="text-4xl font-black text-title tracking-tight">Arrivals</h3>
                                        <p className="text-sm font-bold text-description uppercase">Real-time Stream</p>
                                    </div>
                                    <div className="flex items-center gap-3 rounded-[1.5rem] bg-card border border-border px-6 py-4 shadow-sm">
                                        <span className="text-2xl font-black text-primary">{students.length}</span>
                                        <span className="text-[10px] font-black uppercase">Present</span>
                                    </div>
                                </div>
                                
                                <div className="custom-scrollbar h-[700px] overflow-y-auto p-1">
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                        <AnimatePresence mode="popLayout">
                                            {students.map((student) => (
                                                <StudentItem key={student.id} student={student} />
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                    {students.length === 0 && (
                                        <div className="flex h-64 flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-border text-description">
                                            <RefreshCw className="mb-4 animate-spin-slow opacity-20" size={48} />
                                            <p className="font-black uppercase tracking-widest text-xs">Waiting for students...</p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}