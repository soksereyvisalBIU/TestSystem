<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\AttendanceSession;
use App\Models\Schedule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;

use function Pest\Laravel\json;

class AttendanceController extends Controller
{
    public $teacher_subject_id = 1;
    public function index(Request $request)
    {

        $students = DB::table('attendance_logs')->where('session_id', $this->teacher_subject_id)->leftJoin('users', 'attendance_logs.student_id', '=', 'users.id')->get();
        return Inertia::render('instructor/attendance/Index', compact('students'));
    }

    // public function requestStudent(Request $request)
    // {
    //     $students = DB::table('attendance_logs')->where('session_id', $this->teacher_subject_id)->leftJoin('users', 'attendance_logs.student_id', '=', 'users.id')->orderBy('attendance_logs.created_at', 'desc')
    //         ->get();

    //     return response()->json($students);
    // }

    public function requestStudent(Request $request)
    {
        // 1. Select only required columns to reduce memory & network payload
        // 2. Use a specific ID from the request if possible to avoid fetching all sessions
        $students = DB::table('attendance_logs')
            ->where('session_id', $this->teacher_subject_id)
            ->leftJoin('users', 'attendance_logs.student_id', '=', 'users.id')
            ->select(
                'users.id',
                'users.name',
                'users.avatar', // Assuming you have this
                'users.latitude', // Assuming you have this
                'users.longitude', // Assuming you have this
                'attendance_logs.created_at as joined_at'
            )
            ->orderBy('attendance_logs.created_at', 'desc')
            ->get();

        return response()->json($students);
    }

    public function request(Request $request)
    {

        $attendanceSession = AttendanceSession::updateOrCreate(
            ['teacher_subject_id' => $this->teacher_subject_id],
            [
                'qr_token' => 'beltei-' . Str::random(32),
                'class_code' => random_int(100, 999),
                'qr_expires_at' => now()->addSeconds(60),
                'started_at' => now(),
                'ended_at' => now()->addSeconds(60),
                'is_active' => true,

                // 📍 Teacher QR location
                'latitude' => $request->latitude,
                'longitude' => $request->longitude,
            ]
        );

        return response()->json([
            'session' => $attendanceSession,
        ]);
    }


    // public function request(Request $request)
    // {

    //     $teacher_subject_id = 1; // Example teacher_subject_id

    //     $attendanceSession = AttendanceSession::updateOrCreate(
    //         ['teacher_subject_id' => $teacher_subject_id],
    //         [
    //             'teacher_subject_id' => $teacher_subject_id,
    //             'qr_token' => 'beltei-' . Str::random(32),
    //             'class_code' => random_int(100, 999),
    //             'qr_expires_at' => now()->addSeconds(60),
    //             'started_at' => now(),
    //             'ended_at' => now()->addSeconds(60),
    //             'is_active' => true,
    //         ]
    //     );


    //     return response()->json([
    //         'session' => $attendanceSession,
    //     ]);
    // }



    // AttendanceController.php

    public function generateQR($scheduleId)
    {
        $schedule = Schedule::findOrFail($scheduleId);

        // Generate a secure, random token
        $token = bin2hex(random_bytes(16));

        $schedule->update([
            'qr_token' => $token,
            'qr_expires_at' => now()->addMinutes(5) // Token valid for 5 mins
        ]);

        // Return this token to be rendered as a QR code on the frontend
        return response()->json(['token' => $token]);
    }

    // app/Http/Controllers/AttendanceController.php

    public function getQrSession(Request $request)
    {
        // Assuming you have a way to identify the active class session
        // For this example, we'll find the schedule for 'today' and 'session 1'
        $schedule = Schedule::where('class_date', now()->toDateString())
            ->where('session_no', 1)
            ->firstOrFail();

        // Create or update the dynamic token
        $token = Str::random(32);
        $expiresAt = now()->addSeconds(60);

        $schedule->update([
            'qr_token' => $token,
            'qr_expires_at' => $expiresAt,
        ]);

        return response()->json([
            'session' => [
                'id' => $schedule->id,
                'qr_token' => $token,
                'class_code' => $schedule->course->code, // e.g., "SPM"
                'expires_in' => 60,
            ]
        ]);
    }
    public function scanQR(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'schedule_id' => 'required'
        ]);

        $schedule = Schedule::where('id', $request->schedule_id)
            ->where('qr_token', $request->token)
            ->first();

        // 1. Check if token exists and matches
        if (!$schedule) {
            return response()->json(['message' => 'Invalid QR Code'], 403);
        }

        // 2. Check if token is expired
        if (now()->gt($schedule->qr_expires_at)) {
            return response()->json(['message' => 'QR Code has expired'], 403);
        }

        // 3. Check if student already checked in
        $exists = Attendance::where('student_id', auth()->id())
            ->where('schedule_id', $schedule->id)
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'Already checked in!'], 200);
        }

        // 4. Record the Attendance
        Attendance::create([
            'student_id' => auth()->id(), // Assuming student is logged in
            'schedule_id' => $schedule->id,
            'check_in_time' => now(),
            'status' => 'Present',
            'method' => 'QR_SCAN',
            'ip_address' => $request->ip()
        ]);

        return response()->json(['message' => 'Attendance recorded successfully!']);
    }

    public function start(Request $request)
    {
        abort_unless(auth()->user()->role === 'teacher', 403);

        $request->validate([
            'teacher_subject_id' => 'required|exists:teacher_subjects,id',
        ]);

        $session = AttendanceSession::create([
            'teacher_subject_id' => $request->teacher_subject_id,
            'qr_token' => Str::random(40),
            'class_code' => rand(10, 99),
            'qr_expires_at' => now()->addSeconds(30),
            'started_at' => now(),
        ]);

        return redirect()->to("/attendance/session/{$session->id}");
    }

    public function show(string $sessionId)
    // public function show(AttendanceSession $session)
    {
        // abort_unless(auth()->user()->role === 'teacher', 403);

        // return Inertia::render('instructor/attendance/Index', [
        //     'session' => $session->only([
        //         'id',
        //         'qr_token',
        //         'class_code',
        //         'qr_expires_at',
        //     ]),
        // ]);
        return Inertia::render('instructor/attendance/Index');
    }

    // public function request(AttendanceSession $session)


    public function verify(Request $request)
    {
        $data = $request->validate([
            'qr_token' => 'required|string',
            'code'     => 'required|digits:3',
        ]);

        $session = AttendanceSession::where('qr_token', $data['qr_token'])
            ->where('expires_at', '>', now())
            ->first();

        if (! $session) {
            return response()->json([
                'message' => 'QR session expired or invalid'
            ], 422);
        }

        if ($session->class_code !== $data['code']) {
            return response()->json([
                'message' => 'Invalid security code'
            ], 422);
        }

        AttendanceLog::create([
            'session_id'   => $session->id,
            'student_id'   => auth()->id(),
            'checked_in_at' => Carbon::now(),
        ]);

        return response()->json([
            'status' => 'success'
        ]);
    }
}
