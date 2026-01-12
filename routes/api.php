<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
    
})->middleware('auth:sanctum');



Route::get('server-time', [App\Http\Controllers\Api\V1\ServerTimeController::class, 'index']);
Route::prefix('v1')->scopeBindings()->group(function () {
    Route::apiResource('assessments.questions', App\Http\Controllers\Api\V1\QuestionController::class);
});