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
        Route::resource('classes', App\Http\Controllers\Instructor\ClassroomController::class)->names('classes');
        Route::resource('classes.subject', App\Http\Controllers\Instructor\SubjectController::class)->names('classes.subjects');
        Route::resource('classes.subject.assessment', App\Http\Controllers\Instructor\AssessmentController::class)->names('classes.subjects.assessments');
        Route::resource('classes.subject.assessment.question', App\Http\Controllers\Instructor\QuestionController::class)->names('classes.subjects.assessments.questions');
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
