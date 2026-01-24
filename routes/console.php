<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// $schedule->call(function () {
//     AttendanceSession::where('is_active', true)
//         ->where('qr_expires_at', '<', now())
//         ->each(function ($session) {
//             $session->update([
//                 'qr_token' => Str::random(40),
//                 'class_code' => rand(10, 99),
//                 'qr_expires_at' => now()->addSeconds(30),
//             ]);
//         });
// })->everyThirtySeconds();
