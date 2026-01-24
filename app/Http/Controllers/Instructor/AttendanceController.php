<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\AttendanceSession;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    public function index(Request $request){
        return Inertia::render('instructor/attendance/Index');
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
}
