<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\AttendanceLog;
use App\Models\AttendanceSession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Exception;

class AttendanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('student/attendance/Index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        Log::info('Attendance Store Request:', $request->all());

        $request->validate([
            'qr_content' => 'required|string',
            'verification_code' => 'required|numeric',
            'ts' => 'nullable|numeric',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        $session = AttendanceSession::where([
            ['qr_token', '=', $request->qr_content],
            ['class_code', '=', $request->verification_code]
        ])->firstOrFail();

        AttendanceLog::create([
            'session_id' => $session->id,
            'student_id' => auth()->id(),
            'checked_in_at' => now(),

            // location stored properly
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,

            'distance' => $request->ts,

            'meta_data' => json_encode([
                'device_ts' => $request->ts,
                'user_agent' => request()->userAgent(),
            ]),
        ]);

        return back()->with('success', 'Attendance recorded successfully.');
    }




    // public function store(Request $request)
    // {
    //     // Log the incoming attempt immediately for security auditing
    //     Log::info('Attendance Attempt Started', [
    //         'student_id' => auth()->id(),
    //         'ip' => $request->ip(),
    //         'coords' => ['lat' => $request->latitude, 'lng' => $request->longitude]
    //     ]);

    //     $request->validate([
    //         'qr_content' => 'required|string',
    //         'verification_code' => 'required|numeric',
    //         'latitude' => 'required|numeric',
    //         'longitude' => 'required|numeric',
    //         'ts' => 'nullable|numeric',
    //     ]);

    //     try {
    //         // Start a transaction for data integrity and speed
    //         return DB::transaction(function () use ($request) {

    //             // 1. Fetch Session
    //             $session = AttendanceSession::where('qr_token', $request->qr_content)
    //                 ->where('class_code', $request->verification_code)
    //                 ->first();

    //             if (!$session) {
    //                 Log::warning('Attendance Failed: Invalid Credentials', [
    //                     'student_id' => auth()->id(),
    //                     'input_token' => $request->qr_content,
    //                     'input_code' => $request->verification_code
    //                 ]);
    //                 return back()->withErrors(['qr_content' => 'Invalid or expired QR code/PIN.']);
    //             }

    //             // 2. Geofencing Logic
    //             // Ensure session has location data to compare against
    //             if (!$session->latitude || !$session->longitude) {
    //                 Log::error('Attendance Failed: Session Missing Coordinates', ['session_id' => $session->id]);
    //                 return back()->withErrors(['qr_content' => 'Classroom location not set by instructor.']);
    //             }

    //             $distance = $this->calculateDistance(
    //                 (float) $request->latitude,
    //                 (float) $request->longitude,
    //                 (float) $session->latitude,
    //                 (float) $session->longitude
    //             );

    //             $maxRadius = 50; // meters

    //             if ($distance > $maxRadius) {
    //                 Log::notice('Attendance Denied: Out of Bounds', [
    //                     'student_id' => auth()->id(),
    //                     'distance_m' => $distance,
    //                     'max_allowed' => $maxRadius
    //                 ]);
    //                 return back()->withErrors([
    //                     'qr_content' => "Location mismatch. You are approximately {$distance}m away."
    //                 ]);
    //             }

    //             // 3. Record Attendance
    //             // updateOrCreate is used to handle re-scans gracefully
    //             $log = AttendanceLog::updateOrCreate(
    //                 [
    //                     'session_id' => $session->id,
    //                     'student_id' => auth()->id(),
    //                 ],
    //                 [
    //                     'checked_in_at' => now(),
    //                     'distance' => $distance,
    //                     'meta_data' => json_encode([
    //                         'device_ts' => $request->ts,
    //                         'user_agent' => request()->userAgent()
    //                     ]),
    //                 ]
    //             );

    //             Log::info('Attendance Recorded Successfully', [
    //                 'log_id' => $log->id,
    //                 'student_id' => auth()->id(),
    //                 'distance' => $distance
    //             ]);

    //             return back()->with('success', 'Attendance recorded successfully.');
    //         });
    //     } catch (Exception $e) {
    //         // Log the exact error for the developer
    //         Log::critical('Attendance Store Exception', [
    //             'error' => $e->getMessage(),
    //             'student_id' => auth()->id(),
    //             'file' => $e->getFile(),
    //             'line' => $e->getLine()
    //         ]);

    //         return back()->withErrors([
    //             'qr_content' => 'A system error occurred. Please try again or contact your instructor.'
    //         ]);
    //     }
    // }

    // /**
    //  * Calculates distance using Haversine formula (Optimized for PHP)
    //  */
    // private function calculateDistance($lat1, $lon1, $lat2, $lon2)
    // {
    //     $earthRadius = 6371000; // Meters

    //     $dLat = deg2rad($lat2 - $lat1);
    //     $dLon = deg2rad($lon2 - $lon1);

    //     $a = sin($dLat / 2) * sin($dLat / 2) +
    //         cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
    //         sin($dLon / 2) * sin($dLon / 2);

    //     $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

    //     return round($earthRadius * $c);
    // }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
