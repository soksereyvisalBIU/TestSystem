<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');





Route::middleware(['auth', 'verified'])->group(function () {


    // ========================================================
    //              Admin
    // ========================================================
    Route::prefix('instructor')->as('instructor.')->group(function () {

        Route::apiResource('classes', App\Http\Controllers\Instructor\ClassroomController::class);
        //         Route::apiResource('classes.subjects', App\Http\Controllers\Api\V1\Instructor\SubjectController::class);
        // Route::apiResource('subjects.assessments', App\Http\Controllers\Api\V1\Instructor\AssessmentController::class);

        
    });

    // ========================================================
    //              Instructor
    // ========================================================


    // ========================================================
    //              Student
    // ========================================================



    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__ . '/settings.php';
