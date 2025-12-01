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

    // ========================================================
    //              Instructor
    // ========================================================
    Route::prefix('instructor')->as('instructor.')->group(function () {
        Route::resource('classes', App\Http\Controllers\Instructor\ClassroomController::class)->names('classes');
        Route::resource('classes.subject', App\Http\Controllers\Instructor\SubjectController::class)->names('classes.subjects');
        Route::resource('classes.subject.assessment', App\Http\Controllers\Instructor\AssessmentController::class)->names('classes.subjects.assessments');
        Route::resource('classes.subject.assessment.question', App\Http\Controllers\Instructor\QuestionController::class)->names('classes.subjects.assessments.questions');
    });


    // ========================================================
    //              Student
    // ========================================================
    Route::prefix('student')->as('student.')->group(function () {
        Route::resource('classes', App\Http\Controllers\Student\ClassroomController::class)->names('classes');
        Route::resource('classes.subject', App\Http\Controllers\Student\SubjectController::class)->names('classes.subjects');
        Route::resource('classes.subject.assessment', App\Http\Controllers\Student\AssessmentController::class)->names('classes.subjects.assessments');
        // Route::resource('classes.subject.assessment.question', App\Http\Controllers\Instructor\QuestionController::class)->names('classes.subjects.assessments.questions');
    });

    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__ . '/settings.php';
