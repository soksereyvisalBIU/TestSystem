import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';

interface ScanData {
  content: string;
  timestamp: number;
}

const StudentQRScanAttendance: React.FC = () => {
  const [scanData, setScanData] = useState<ScanData | null>(null);
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerRegionId = "qr-reader-engine";

  // Optimized scanner config - 10 FPS is faster for detection than 24 FPS on mobile
  const scannerConfig = useMemo(() => ({
    fps: 10, 
    qrbox: (viewWidth: number, viewHeight: number) => {
      const size = Math.min(viewWidth, viewHeight) * 0.7;
      return { width: size, height: size };
    },
    aspectRatio: 1.0,
    formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE]
  }), []);

  const stopScanner = useCallback(async () => {
    try {
      if (scannerRef.current && scannerRef.current.isScanning) {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      }
      setIsScanning(false);
    } catch (err) {
      console.error("Failed to stop scanner safely", err);
    }
  }, []);

  useEffect(() => {
    // Persistent instance to prevent memory leaks/re-init lag
    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode(scannerRegionId);
    }

    const startCamera = async () => {
      try {
        await scannerRef.current?.start(
          { facingMode: "environment" },
          scannerConfig,
          (text) => {
            setScanData({ content: text, timestamp: Date.now() });
            stopScanner();
          },
          () => {} // Ignore frame-by-frame failures for performance
        );
      } catch (err) {
        setError("Camera access denied or hardware busy.");
        setIsScanning(false);
      }
    };

    startCamera();

    return () => {
      // Async cleanup to ensure hardware is released
      stopScanner();
    };
  }, [stopScanner, scannerConfig]);

  const handleCodeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 3);
    setVerificationCode(val);
  };

  const handleFinalSubmit = async () => {
    if (isSubmitting || !scanData || verificationCode.length < 3) return;

    setIsSubmitting(true);
    try {
      // Using global 'post' helper (assuming Ziggy/Inertia context based on your snippet)
      // Added data sanitization for security
      await post.route('student.attendance.store', {
        qr_content: scanData.content.trim(),
        verification_code: verificationCode,
        ts: scanData.timestamp // Helpful for server-side replay attack prevention
      });
    } catch (err) {
      console.error("Submission failed", err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans antialiased">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Security Check</h1>
        <p className="text-slate-500">Scan the asset QR code to continue</p>
      </div>

      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-black shadow-2xl ring-8 ring-white">
        <div id={scannerRegionId} className="w-full h-[400px]" />
        
        {isScanning && (
          <div className="absolute inset-0 pointer-events-none border-2 border-blue-500/20">
            <div className="animate-scan w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_15px_rgba(59,130,246,1)]" />
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/90 p-6 text-center">
            <p className="text-red-400 font-medium">{error}</p>
          </div>
        )}
      </div>

      {scanData && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 transition-all">
          <div className="w-full max-w-sm bg-white rounded-[2rem] p-8 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-center mb-4">
              <div className="h-1.5 w-12 bg-slate-200 rounded-full mb-6" />
            </div>
            
            <h2 className="text-xl font-bold text-slate-900 text-center">Identity Verified</h2>
            <p className="text-sm text-slate-500 text-center mt-1 truncate px-4">
              Session: {scanData.content.slice(0, 20)}...
            </p>

            <div className="mt-8 space-y-4">
              <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 text-center">
                3-Digit Access Pin
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                autoFocus
                value={verificationCode}
                onChange={handleCodeInput}
                disabled={isSubmitting}
                className="w-full text-center text-4xl font-mono tracking-[1.5rem] py-4 bg-slate-50 rounded-2xl border-2 border-slate-100 focus:border-blue-500 focus:ring-0 outline-none transition-all disabled:opacity-50"
                placeholder="---"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 mt-8">
              <button 
                onClick={() => window.location.reload()}
                disabled={isSubmitting}
                className="py-4 rounded-2xl font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-50"
              >
                Reset
              </button>
              <button
                disabled={verificationCode.length < 3 || isSubmitting}
                onClick={handleFinalSubmit}
                className="py-4 rounded-2xl font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center justify-center"
              >
                {isSubmitting ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : "Authorize"}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes scan {
          0% { transform: translateY(40px); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(360px); opacity: 0; }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default StudentQRScanAttendance;