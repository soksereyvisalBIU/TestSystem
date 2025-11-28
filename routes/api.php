<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
    
})->middleware('auth:sanctum');



Route::prefix('v1')->scopeBindings()->group(function () {

    Route::apiResource('assessments.questions', App\Http\Controllers\Api\V1\QuestionController::class);

});