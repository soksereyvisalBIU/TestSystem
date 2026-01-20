<?php

use App\Http\Controllers\Auth\GoogleController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');



Route::get('/auth/google', [GoogleController::class, 'redirect']);
Route::get('/auth/google/callback', [GoogleController::class, 'callback']);


Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/dashboard', [App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');
    // Route::get('dashboard', function () {
    //     return Inertia::render('dashboard');
    // })->name('dashboard');

    // Route::get('/admin/dashboard', AdminDashboardController::class)->name('admin.dashboard');
    // Route::get('/instructor/dashboard', InstructorDashboardController::class)->name('instructor.dashboard');
    // Route::get('/student/dashboard', StudentDashboardController::class)->name('student.dashboard');


    // ========================================================
    //              Admin
    // ========================================================

    // Route::prefix('admin')
    //     ->as('admin.')
    //     ->middleware(['can:access-admin-page'])
    //     ->group(function () {
    //         Route::get('/run-artisan/{command}', function ($command) {
    //             switch ($command) {
    //                 case 'migrate':
    //                     Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]); // avoid confirmation
    //                     return 'Migration done!';

    //                 case 'optimize':
    //                     Illuminate\Support\Facades\Artisan::call('optimize');
    //                     return 'Optimized!';
    //                 case 'optimize-clear':
    //                     Illuminate\Support\Facades\Artisan::call('optimize:clear');
    //                     return 'Optimized!';

    //                 case 'cache-clear':
    //                     Illuminate\Support\Facades\Artisan::call('cache:clear');
    //                     return 'Cache cleared!';

    //                 case 'config-clear':
    //                     Illuminate\Support\Facades\Artisan::call('config:clear');
    //                     return 'Config cleared!';

    //                 case 'config-cache':
    //                     Illuminate\Support\Facades\Artisan::call('config:cache');
    //                     return 'Config cached!';

    //                 case 'route-cache':
    //                     Illuminate\Support\Facades\Artisan::call('route:cache');
    //                     return 'Routes cached!';

    //                 case 'view-clear':
    //                     Illuminate\Support\Facades\Artisan::call('view:clear');
    //                     return 'Views cleared!';

    //                 default:
    //                     return 'Unknown command.';
    //             }
    //         });
    //         // link folder
    //         Route::get('/storage-link-to-root', function () {
    //             $targetFolder = storage_path('app/public');
    //             $linkFolder = $_SERVER['DOCUMENT_ROOT'] . '/storage';
    //             symlink($targetFolder, $linkFolder);
    //         });
    //         Route::get('/storage-link', function () {
    //             $targetFolder = storage_path('app/public');
    //             $linkFolder = $_SERVER['DOCUMENT_ROOT'] . '/storage';
    //             // echo 'Target Folder: ' . $targetFolder . '<br>';
    //             // echo 'Link Folder: ' . $linkFolder . '<br>';
    //             symlink($targetFolder, $linkFolder);
    //         });

    //         Route::get('/asset-link', function () {
    //             $targetFolder = public_path('asset');
    //             $linkFolder = $_SERVER['DOCUMENT_ROOT'] . '/asset';

    //             try {
    //                 // Check if the symlink already exists
    //                 if (!file_exists($linkFolder)) {
    //                     // Create the symbolic link
    //                     symlink($targetFolder, $linkFolder);
    //                     return 'Symbolic link created successfully.';
    //                 } else {
    //                     return 'Symbolic link already exists.';
    //                 }
    //             } catch (\Throwable $e) {
    //                 return 'Error creating symbolic link: ' . $e->getMessage();
    //             }
    //         });

    //         Route::get('/uploaded-link', function () {
    //             $targetFolder = public_path('uploaded');
    //             $linkFolder = $_SERVER['DOCUMENT_ROOT'] . '/uploaded';

    //             try {
    //                 // Check if the symlink already exists
    //                 if (!file_exists($linkFolder)) {
    //                     // Create the symbolic link
    //                     symlink($targetFolder, $linkFolder);
    //                     return 'Symbolic link created successfully.';
    //                 } else {
    //                     return 'Symbolic link already exists.';
    //                 }
    //             } catch (\Throwable $e) {
    //                 return 'Error creating symbolic link: ' . $e->getMessage();
    //             }
    //         });
    //     });




    Route::prefix('admin')
        ->as('admin.')
        ->middleware([
            'auth',
            // 'verified',              // Email verified
            // 'password.confirm',      // Re-enter password
            'can:access-admin-page', // Policy / Gate
            // 'throttle:5,1',          // Anti brute-force
        ])
        ->group(function () {

            /*
        |--------------------------------------------------------------------------
        | Artisan Utilities (SAFE WHITELIST)
        |--------------------------------------------------------------------------
        */
            Route::get('/artisan/{command}', function ($command) {

                Log::info('Admin artisan command', [
                    'user_id' => auth()->id(),
                    'command' => $command,
                    'ip' => request()->ip(),
                ]);

                return match ($command) {
                    'migrate' => tap(Artisan::call('migrate', ['--force' => true]), fn() => 'Migration done!'),
                    'optimize' => tap(Artisan::call('optimize'), fn() => 'Optimized!'),
                    'optimize-clear' => tap(Artisan::call('optimize:clear'), fn() => 'Optimization cleared!'),
                    'cache-clear' => tap(Artisan::call('cache:clear'), fn() => 'Cache cleared!'),
                    'config-clear' => tap(Artisan::call('config:clear'), fn() => 'Config cleared!'),
                    'config-cache' => tap(Artisan::call('config:cache'), fn() => 'Config cached!'),
                    'route-cache' => tap(Artisan::call('route:cache'), fn() => 'Routes cached!'),
                    'view-clear' => tap(Artisan::call('view:clear'), fn() => 'Views cleared!'),
                    default => abort(404, 'Unknown command'),
                };
            });

            /*
        |--------------------------------------------------------------------------
        | Maintenance Mode
        |--------------------------------------------------------------------------
        */
            Route::get('/maintenance/on', function () {
                Artisan::call('down', ['--secret' => 'admin-access']);
                return 'Maintenance mode ON';
            });

            Route::get('/maintenance/off', function () {
                Artisan::call('up');
                return 'Maintenance mode OFF';
            });

            /*
        |--------------------------------------------------------------------------
        | Storage & Asset Links
        |--------------------------------------------------------------------------
        */
            Route::get('/link/storage', function () {
                $target = storage_path('app/public');
                $link = $_SERVER['DOCUMENT_ROOT'] . '/storage';

                if (!file_exists($link)) {
                    symlink($target, $link);
                    return 'Storage link created';
                }

                return 'Storage link already exists';
            });

            Route::get('/link/asset', function () {
                $target = public_path('asset');
                $link = $_SERVER['DOCUMENT_ROOT'] . '/asset';

                if (!file_exists($link)) {
                    symlink($target, $link);
                    return 'Asset link created';
                }

                return 'Asset link already exists';
            });

            Route::get('/link/uploaded', function () {
                $target = public_path('uploaded');
                $link = $_SERVER['DOCUMENT_ROOT'] . '/uploaded';

                if (!file_exists($link)) {
                    symlink($target, $link);
                    return 'Uploaded link created';
                }

                return 'Uploaded link already exists';
            });

            /*
        |--------------------------------------------------------------------------
        | System Diagnostics (READ ONLY)
        |--------------------------------------------------------------------------
        */
            Route::get('/system-info', function () {
                return response()->json([
                    'app' => [
                        'name' => config('app.name'),
                        'env' => app()->environment(),
                        'debug' => config('app.debug'),
                    ],
                    'laravel' => app()->version(),
                    'php' => [
                        'version' => phpversion(),
                        'memory_limit' => ini_get('memory_limit'),
                        'max_execution_time' => ini_get('max_execution_time'),
                    ],
                    'server' => [
                        'os' => PHP_OS,
                        'document_root' => $_SERVER['DOCUMENT_ROOT'] ?? null,
                    ],
                ]);
            });

            /*
        |--------------------------------------------------------------------------
        | Storage Health Check
        |--------------------------------------------------------------------------
        */
            Route::get('/health/storage', function () {
                $paths = [
                    'storage' => storage_path(),
                    'cache' => base_path('bootstrap/cache'),
                    'public_storage' => storage_path('app/public'),
                ];

                return collect($paths)->map(fn($path) => [
                    'exists' => file_exists($path),
                    'writable' => is_writable($path),
                    'realpath' => realpath($path),
                ]);
            });

            /*
        |--------------------------------------------------------------------------
        | Queue Management
        |--------------------------------------------------------------------------
        */
            Route::get('/queue/restart', function () {
                Artisan::call('queue:restart');
                return 'Queue restarted';
            });

            Route::get('/queue/failed', function () {
                return DB::table('failed_jobs')->latest()->limit(50)->get();
            });

            Route::get('/queue/flush', function () {
                Artisan::call('queue:flush');
                return 'Failed jobs cleared';
            });

            /*
        |--------------------------------------------------------------------------
        | Logs
        |--------------------------------------------------------------------------
        */
            Route::get('/logs/size', function () {
                $log = storage_path('logs/laravel.log');
                return file_exists($log)
                    ? number_format(filesize($log) / 1024 / 1024, 2) . ' MB'
                    : 'Log file not found';
            });

            Route::get('/logs/clear', function () {
                file_put_contents(storage_path('logs/laravel.log'), '');
                return 'Logs cleared';
            });
        });


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
            // Route::get('classes/{class}/subjects/{subject}/assessment/{assessment}/question', [App\Http\Controllers\Instructor\QuestionController::class, 'show'])->name('classes.subjects.assessments.questions.index-show');
            Route::resource('classes.subjects.assessment.question', App\Http\Controllers\Instructor\QuestionController::class)->names('classes.subjects.assessments.questions');
            Route::resource('classes.subjects.assessment.student', App\Http\Controllers\Instructor\StudentController::class)->names('classes.subjects.assessments.students');



            Route::get(
                'classes/{class}/subject/{subject}/assessment/{assessment}/student/{student}/check',
                [App\Http\Controllers\Instructor\StudentController::class, 'check']
            )->name('classes.subjects.assessments.students.check');


            // Route::resource('assessments.questions', App\Http\Controllers\Instructor\QuestionController::class)->names('classes.subjects.assessments.questions');
            // Route::resource('classes', ClassroomController::class);
            // Route::resource('classes.subjects', SubjectController::class)->shallow();
            // Route::resource('subjects.assessments', AssessmentController::class)->shallow();
            // Route::resource('assessments.questions', QuestionController::class)->shallow();
            // Route::resource('assessments.students', StudentController::class)->shallow();
            // Route::post(
            //     'students/{student}/check',
            //     [StudentController::class, 'check']
            // )->name('students.check');
        });


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
    });
});

require __DIR__ . '/settings.php';
