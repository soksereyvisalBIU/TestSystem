import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';

// Types for better maintainability
interface ScanData {
  content: string;
  timestamp: number;
}

const QRScannerPro: React.FC = () => {
  const [scanData, setScanData] = useState<ScanData | null>(null);
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerRegionId = "qr-reader-engine";

  // Performance-optimized cleanup
  const stopScanner = useCallback(async () => {
    if (scannerRef.current?.isScanning) {
      await scannerRef.current.stop();
      scannerRef.current.clear();
      setIsScanning(false);
    }
  }, []);

  useEffect(() => {
    scannerRef.current = new Html5Qrcode(scannerRegionId);

    const startCamera = async () => {
      try {
        await scannerRef.current?.start(
          { facingMode: "environment" },
          {
            fps: 24, // Cinematographic smoothness for pro feel
            qrbox: (viewWidth, viewHeight) => {
               const size = Math.min(viewWidth, viewHeight) * 0.7;
               return { width: size, height: size };
            },
            aspectRatio: 1.0,
            formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE]
          },
          (text) => {
            setScanData({ content: text, timestamp: Date.now() });
            stopScanner();
          },
          () => {} // Silent failure for frame drops to keep CPU usage low
        );
      } catch (err) {
        setError("Camera access denied or not found.");
        setIsScanning(false);
      }
    };

    startCamera();
    return () => { stopScanner(); };
  }, [stopScanner]);

  const handleCodeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 3);
    setVerificationCode(val);
  };

  const handleFinalSubmit = async () => {
    // Latency-sensitive submission logic
    console.log("Transmitting...", { ...scanData, code: verificationCode });
    // Add your API call here
    alert("Verification Successful");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans antialiased">
      {/* Header Section */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Security Check</h1>
        <p className="text-slate-500">Scan the asset QR code to continue</p>
      </div>

      {/* Professional Scanner Frame */}
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-black shadow-2xl ring-8 ring-white">
        <div id={scannerRegionId} className="w-full h-[400px]" />
        
        {/* Overlay scanning animation */}
        {isScanning && (
          <div className="absolute inset-0 pointer-events-none border-2 border-blue-500 opacity-20 animate-pulse">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-scan" />
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/90 p-6 text-center">
            <p className="text-red-400 font-medium">{error}</p>
          </div>
        )}
      </div>

      {/* Modern Modal / Bottom Sheet Interface */}
      {scanData && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 transition-opacity">
          <div className="w-full max-w-sm bg-white rounded-[2rem] p-8 shadow-2xl transform transition-all animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-center mb-4">
              <div className="h-1.5 w-12 bg-slate-200 rounded-full mb-6" />
            </div>
            
            <h2 className="text-xl font-bold text-slate-900 text-center">Identity Verified</h2>
            <p className="text-sm text-slate-500 text-center mt-1 truncate px-4">
              Source: {scanData.content}
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
                className="w-full text-center text-4xl font-mono tracking-[1.5rem] py-4 bg-slate-50 rounded-2xl border-2 border-slate-100 focus:border-blue-500 focus:ring-0 outline-none transition-all"
                placeholder="---"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 mt-8">
              <button 
                onClick={() => window.location.reload()}
                className="py-4 rounded-2xl font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Reset
              </button>
              <button
                disabled={verificationCode.length < 3}
                onClick={handleFinalSubmit}
                className="py-4 rounded-2xl font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200 transition-all active:scale-95"
              >
                Authorize
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Extra CSS for the scanning line */}
      <style>{`
        @keyframes scan {
          0% { top: 10%; }
          100% { top: 90%; }
        }
        .animate-scan {
          position: absolute;
          animation: scan 2s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default QRScannerPro;