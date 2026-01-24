import { useState } from "react";
import { QrReader } from "react-qr-reader"; // Install: npm install react-qr-reader

export default function StudentScanner() {
  const [status, setStatus] = useState("Ready to Scan");

  const handleScan = async (result) => {
    if (result) {
      setStatus("Verifying location...");
      
      // High Security: Get student coordinates
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const response = await fetch("/api/attendance/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: result?.text,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            student_id: "STU_123" // Get from auth session
          }),
        });

        const data = await response.json();
        setStatus(data.success ? "✅ Attendance Marked!" : "❌ " + data.message);
      });
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-black h-screen text-white">
      <h1 className="text-xl font-bold mb-4">Scan Teacher's QR</h1>
      <div className="w-full max-w-sm overflow-hidden rounded-3xl border-4 border-blue-500">
        <QrReader
          onResult={handleScan}
          constraints={{ facingMode: "environment" }}
          style={{ width: "100%" }}
        />
      </div>
      <p className="mt-6 text-lg">{status}</p>
    </div>
  );
}