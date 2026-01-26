<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\AttendanceSession;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

use function Pest\Laravel\json;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('instructor/attendance/Index');
    }

    public function request(Request $request)
    {
        return response()->json([
            'session' => [
                'id' => (string) Str::uuid(),
                'qr_token' => 'beltei-' . Str::random(32),
                'class_code' => random_int(100, 999),
                'expires_in' => 60, // seconds
            ],
        ]);
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
            'checked_in_at'=> Carbon::now(),
        ]);

        return response()->json([
            'status' => 'success'
        ]);
    }
}
