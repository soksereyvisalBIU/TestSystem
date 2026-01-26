<?php

use App\Http\Controllers\Admin\SystemAdministratorController;
use App\Http\Controllers\Admin\UserManagementController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\Auth\GoogleController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

// Route::get('/test-https', function () {
//     return [
//         'scheme' => request()->getScheme(),
//         'secure' => request()->isSecure(),
//         'url'    => url()->current(),
//     ];
// });
// Route::get('/debug-proxy', function () {
//     return [
//         'X-Forwarded-Proto' => request()->header('x-forwarded-proto'),
//         'X-Forwarded-For'   => request()->header('x-forwarded-for'),
//         'scheme'            => request()->getScheme(),
//         'secure'            => request()->isSecure(),
//         'server_https'      => $_SERVER['HTTPS'] ?? null,
//     ];
// });


Route::get('/auth/google', [GoogleController::class, 'redirect'])->name('google.login');
Route::get('/auth/google/callback', [GoogleController::class, 'callback']);

Route::post('auth/google/callback', [GoogleController::class, 'handleCredential'])
    ->name('google.callback');


Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/dashboard', [App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');

    Route::get('/force-password', [GoogleController::class, 'showForcePassword'])->name('password.force');
    Route::post('/force-password', [GoogleController::class, 'storeForcePassword']);


    // ========================================================
    //              Student
    // ========================================================

    Route::prefix('student')->as('student.')->group(function () {

        Route::resource('classes', App\Http\Controllers\Student\ClassroomController::class)
            ->names('classes');
        Route::post('join-class', [App\Http\Controllers\Student\ClassroomController::class, 'join'])
            ->name('class.join');

        Route::resource('classes.subjects', App\Http\Controllers\Student\SubjectController::class)
            ->names('classes.subjects');

        Route::resource('classes.subjects.assessment', App\Http\Controllers\Student\AssessmentController::class)
            ->names('classes.subjects.assessments');

        // ---- Add this (REST compliant) ----
        Route::post(
            'classes/{class_id}/subjects/{subject_id}/assessment/{assessment_id}/request',
            [App\Http\Controllers\Student\AssessmentController::class, 'request']
        )->name('classes.subjects.assessments.request');
        Route::get(
            'classes/{class_id}/subjects/{subject_id}/assessment/{assessment_id}/review',
            [App\Http\Controllers\Student\AttemptController::class, 'review']
        )->name('classes.subjects.assessments.attempt.review');
        Route::get(
            'classes/{class_id}/subjects/{subject_id}/assessment/{assessment_id}/attempt',
            [App\Http\Controllers\Student\AttemptController::class, 'attempt']
        )->name('classes.subjects.assessments.attempt');
        Route::post(
            'classes/{class_id}/subjects/{subject_id}/assessment/{assessment_id}/attempt/store',
            [App\Http\Controllers\Student\AttemptController::class, 'store']
        )->name('classes.subjects.assessments.attempt.store');

        // In your routes file
        Route::post('/upload-chunk', [App\Http\Controllers\Student\AttemptController::class, 'uploadChunk'])
            ->name('classes.subjects.assessments.attempt.upload-chunk');



        Route::resource('attendance' , App\Http\Controllers\Student\AttendanceController::class)
            ->names('attendance');
    });

    // =======================================================



    // ========================================================
    //              Instructor
    // ========================================================

    Route::prefix('instructor')
        ->as('instructor.')
        ->middleware(['can:access-instructor-page'])
        ->group(function () {
            Route::resource('classes', App\Http\Controllers\Instructor\ClassroomController::class)->names('classes');
            Route::resource('classes.subjects', App\Http\Controllers\Instructor\SubjectController::class)->names('classes.subjects');
            Route::post('classes/{class}/subjects/{subject}/copy', [App\Http\Controllers\Instructor\SubjectController::class, 'copy'])->name('classes.subjects.copy');
            Route::resource('classes.subjects.assessment', App\Http\Controllers\Instructor\AssessmentController::class)->names('classes.subjects.assessments');
            Route::post('classes/subjects/assessment/{assessment}/copy', [App\Http\Controllers\Instructor\AssessmentController::class, 'copy'])->name('classes.subjects.assessments.copy');
            Route::resource('classes.subjects.assessment.question', App\Http\Controllers\Instructor\QuestionController::class)->names('classes.subjects.assessments.questions');
            Route::resource('classes.subjects.assessment.student', App\Http\Controllers\Instructor\StudentController::class)->names('classes.subjects.assessments.students');



            Route::get(
                'classes/{class}/subject/{subject}/assessment/{assessment}/student/{student}/check',
                [App\Http\Controllers\Instructor\StudentController::class, 'check']
            )->name('classes.subjects.assessments.students.check');


            // Teacher
            Route::get('attendance', [App\Http\Controllers\Instructor\AttendanceController::class, 'index'])->name('attendance.index');
            Route::get('/attendance/request', [App\Http\Controllers\Instructor\AttendanceController::class, 'request'])->name('attendance.qr');
            Route::get('/attendance/session/{session}', [App\Http\Controllers\Instructor\AttendanceController::class, 'show']);

            // Route::resource('attendance', App\Http\Controllers\Instructor\AttendanceController::class)
            //     ->names('attendance');

        });

    // ========================================================


    // ========================================================
    //              Administrator
    // ========================================================
    Route::prefix('admin')
        ->as('admin.')
        ->middleware([
            'auth',
            'verified',
            'password.confirm',
            'can:access-admin-page',
            // 'throttle:5,1',
        ])
        ->group(function () {

            /*
            |--------------------------------------------------------------------------
            | User Management
            |--------------------------------------------------------------------------
            */
            Route::resource('user-management', UserManagementController::class);
            Route::post('users/bulk-delete', [UserManagementController::class, 'bulkDestroy'])
                ->name('user-management.bulk-destroy');
            Route::patch('users/{user}/role', [UserManagementController::class, 'updateRole'])
                ->name('users.role');

            /*
            |--------------------------------------------------------------------------
            | System & Telemetry (READ / SAFE)
            |--------------------------------------------------------------------------
            */
            Route::controller(SystemAdministratorController::class)->group(function () {
                // Health
                Route::get('health/storage', 'getStorageHealth')->name('health.storage');
                Route::get('health/database', 'getDatabaseHealth')->name('health.database');

                // Telemetry
                Route::get('telemetry/system', 'getSystemInfo')->name('telemetry.system');
                Route::get('telemetry/database', 'getDatabaseHealth')->name('telemetry.db');
                Route::get('telemetry/storage', 'getStorageHealth')->name('telemetry.storage');

                // Logs
                Route::post('logs/clear', 'clearLogs')->name('logs.clear');

                // Artisan (WHITELISTED)
                Route::post('artisan/{command}', 'runArtisan')->name('artisan.run');
            });

            /*
            |--------------------------------------------------------------------------
            | Maintenance Mode
            |--------------------------------------------------------------------------
            */
            Route::post('maintenance/on', function () {
                Artisan::call('down', ['--secret' => 'admin-access']);
                return response()->json(['status' => 'Maintenance mode ON']);
            });

            Route::post('maintenance/off', function () {
                Artisan::call('up');
                return response()->json(['status' => 'Maintenance mode OFF']);
            });

            /*
            |--------------------------------------------------------------------------
            | Queue Management
            |--------------------------------------------------------------------------
            */
            Route::post('queue/restart', fn() => Artisan::call('queue:restart'))
                ->name('queue.restart');

            Route::get(
                'queue/failed',
                fn() =>
                DB::table('failed_jobs')->latest()->limit(50)->get()
            )->name('queue.failed');

            Route::post('queue/flush', fn() => Artisan::call('queue:flush'))
                ->name('queue.flush');

            /*
        |--------------------------------------------------------------------------
        | Logs (READ)
        |--------------------------------------------------------------------------
        */
            Route::get('logs/size', function () {
                $log = storage_path('logs/laravel.log');

                return file_exists($log)
                    ? number_format(filesize($log) / 1024 / 1024, 2) . ' MB'
                    : 'Log file not found';
            })->name('logs.size');
        });
    // ========================================================



    Route::get(
        '/files/{path}',
        [\App\Http\Controllers\FileAccessController::class, 'show']
    )->where('path', '.*')
        ->middleware('auth')
        ->name('files.show');
});

require __DIR__ . '/settings.php';
