<?php

use App\Http\Controllers\Auth\GoogleController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

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

    Route::prefix('admin')
        ->as('admin.')
        ->middleware(['can:access-admin-page'])
        ->group(function () {
            Route::get('/run-artisan/{command}', function ($command) {
                switch ($command) {
                    // case 'migrate':
                    //     Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]); // avoid confirmation
                    //     return 'Migration done!';

                    case 'optimize':
                        Illuminate\Support\Facades\Artisan::call('optimize');
                        return 'Optimized!';
                    case 'optimize-clear':
                        Illuminate\Support\Facades\Artisan::call('optimize:clear');
                        return 'Optimized!';

                    case 'cache-clear':
                        Illuminate\Support\Facades\Artisan::call('cache:clear');
                        return 'Cache cleared!';

                    case 'config-clear':
                        Illuminate\Support\Facades\Artisan::call('config:clear');
                        return 'Config cleared!';

                    case 'config-cache':
                        Illuminate\Support\Facades\Artisan::call('config:cache');
                        return 'Config cached!';

                    case 'route-cache':
                        Illuminate\Support\Facades\Artisan::call('route:cache');
                        return 'Routes cached!';

                    case 'view-clear':
                        Illuminate\Support\Facades\Artisan::call('view:clear');
                        return 'Views cleared!';

                    default:
                        return 'Unknown command.';
                }
            });
            // link folder
            Route::get('/storage-link-to-root', function () {
                $targetFolder = storage_path('app/public');
                $linkFolder = $_SERVER['DOCUMENT_ROOT'] . '/storage';
                symlink($targetFolder, $linkFolder);
            });
            Route::get('/storage-link', function () {
                $targetFolder = storage_path('app/public');
                $linkFolder = $_SERVER['DOCUMENT_ROOT'] . '/storage';
                // echo 'Target Folder: ' . $targetFolder . '<br>';
                // echo 'Link Folder: ' . $linkFolder . '<br>';
                symlink($targetFolder, $linkFolder);
            });

            Route::get('/asset-link', function () {
                $targetFolder = public_path('asset');
                $linkFolder = $_SERVER['DOCUMENT_ROOT'] . '/asset';

                try {
                    // Check if the symlink already exists
                    if (!file_exists($linkFolder)) {
                        // Create the symbolic link
                        symlink($targetFolder, $linkFolder);
                        return 'Symbolic link created successfully.';
                    } else {
                        return 'Symbolic link already exists.';
                    }
                } catch (\Throwable $e) {
                    return 'Error creating symbolic link: ' . $e->getMessage();
                }
            });

            Route::get('/uploaded-link', function () {
                $targetFolder = public_path('uploaded');
                $linkFolder = $_SERVER['DOCUMENT_ROOT'] . '/uploaded';

                try {
                    // Check if the symlink already exists
                    if (!file_exists($linkFolder)) {
                        // Create the symbolic link
                        symlink($targetFolder, $linkFolder);
                        return 'Symbolic link created successfully.';
                    } else {
                        return 'Symbolic link already exists.';
                    }
                } catch (\Throwable $e) {
                    return 'Error creating symbolic link: ' . $e->getMessage();
                }
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
