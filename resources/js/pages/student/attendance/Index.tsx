import FlashMessage from '@/components/notifications/FlashMessage';
import { useForm } from '@inertiajs/react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Toaster as HotToast } from 'react-hot-toast';
import { route } from 'ziggy-js';

const StudentQRScanAttendance: React.FC = () => {
    const [scanData, setScanData] = useState<any>(null);
    const [isScanning, setIsScanning] = useState<boolean>(true);
    const [locationStatus, setLocationStatus] = useState<'searching' | 'locked' | 'error'>('searching');

    const scannerRef = useRef<Html5Qrcode | null>(null);
    const scannerRegionId = 'qr-reader-engine';

    const { data, setData, post, processing, reset, errors } = useForm({
        qr_content: '',
        verification_code: '',
        ts: 0,
        latitude: null as number | null,
        longitude: null as number | null,
    });

    // Strategy: Warm up GPS immediately on mount for zero-latency scanning
    useEffect(() => {
        if (!navigator.geolocation) {
            setLocationStatus('error');
            return;
        }

        const watchId = navigator.geolocation.watchPosition(
            (pos) => {
                setData((prev) => ({
                    ...prev,
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                }));
                setLocationStatus('locked');
            },
            () => setLocationStatus('error'),
            { enableHighAccuracy: true, maximumAge: 10000 }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    const stopScanner = useCallback(async () => {
        if (scannerRef.current?.isScanning) {
            await scannerRef.current.stop();
            scannerRef.current.clear();
            setIsScanning(false);
        }
    }, []);

    const scannerConfig = useMemo(() => ({
        fps: 20, // Increased for snappier detection
        qrbox: (w: number, h: number) => ({ width: Math.min(w, h) * 0.7, height: Math.min(w, h) * 0.7 }),
        aspectRatio: 1.0,
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
    }), []);

    useEffect(() => {
        scannerRef.current = new Html5Qrcode(scannerRegionId);
        scannerRef.current.start(
            { facingMode: 'environment' },
            scannerConfig,
            (text) => {
                const ts = Date.now();
                setScanData({ text, ts });
                setData((prev) => ({ ...prev, qr_content: text.trim(), ts }));
                stopScanner();
            },
            () => {}
        ).catch(() => setIsScanning(false));

        return () => { stopScanner(); };
    }, [stopScanner, scannerConfig]);

    const handleFinalSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Secure check: Don't submit if we don't have location yet
        if (processing || !data.latitude || data.verification_code.length < 3) return;

        post(route('student.attendance.store'), {
            preserveScroll: true,
            onFinish: () => reset('verification_code'),
        });
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4 antialiased">
            <HotToast position="bottom-right" />
            <FlashMessage />

            {/* Status Indicators */}
            <div className="mb-6 flex gap-3">
                <div className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider shadow-sm ${
                    locationStatus === 'locked' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                    <span className={`h-2 w-2 rounded-full ${locationStatus === 'locked' ? 'animate-pulse bg-emerald-500' : 'bg-amber-500'}`} />
                    {locationStatus === 'locked' ? 'GPS Locked' : 'Locating...'}
                </div>
            </div>

            <div className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] bg-black shadow-2xl ring-8 ring-white">
                <div id={scannerRegionId} className="h-[400px] w-full" />
                {isScanning && (
                    <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-12">
                         <div className="animate-scan h-1 w-full bg-blue-400 shadow-[0_0_20px_#60a5fa]" />
                    </div>
                )}
            </div>

            {scanData && (
                <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 p-4 backdrop-blur-sm sm:items-center">
                    <form onSubmit={handleFinalSubmit} className="w-full max-w-sm rounded-[2.5rem] bg-white p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
                        <h2 className="text-center text-xl font-bold text-slate-900">Verify Identity</h2>
                        <p className="mt-2 text-center text-xs text-slate-400">Please enter the 3-digit pin shown in class</p>

                        <div className="mt-8">
                            <input
                                type="text"
                                inputMode="numeric"
                                autoFocus
                                value={data.verification_code}
                                onChange={(e) => setData('verification_code', e.target.value.replace(/\D/g, '').slice(0, 3))}
                                className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 py-5 text-center font-mono text-4xl tracking-[1rem] outline-none focus:border-blue-500"
                                placeholder="000"
                            />
                            {errors.latitude && <p className="mt-2 text-center text-[10px] text-red-500 font-bold">Location Permission Required!</p>}
                        </div>

                        <div className="mt-8 grid grid-cols-2 gap-3">
                            <button type="button" onClick={() => window.location.reload()} className="rounded-2xl bg-slate-100 py-4 font-bold text-slate-500">Cancel</button>
                            <button 
                                type="submit" 
                                disabled={processing || !data.latitude || data.verification_code.length < 3}
                                className="rounded-2xl bg-blue-600 py-4 font-bold text-white shadow-lg shadow-blue-200 disabled:opacity-50"
                            >
                                {processing ? 'Verifying...' : 'Submit'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <style>{`
                @keyframes scan { 0% { transform: translateY(0); } 100% { transform: translateY(300px); } }
                .animate-scan { animation: scan 2s linear infinite; }
            `}</style>
        </div>
    );
};

export default StudentQRScanAttendance;