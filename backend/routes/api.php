<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\Api\AuthController;

/*
|--------------------------------------------------------------------------
| Public routes (no auth)
|--------------------------------------------------------------------------
*/

// Articles (read-only)
Route::get('/articles', [ArticleController::class, 'index']);
Route::get('/articles/{id}', [ArticleController::class, 'show']);

/*
|--------------------------------------------------------------------------
| Auth routes (Sanctum SPA cookie-mode)
| IMPORTANT: needs "web" middleware (session + csrf)
|--------------------------------------------------------------------------
*/

Route::middleware('web')->group(function () {
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login',    [AuthController::class, 'login']);
    Route::post('/auth/logout',   [AuthController::class, 'logout']);
});

/*
|--------------------------------------------------------------------------
| Protected routes (cookie auth)
| NOTE: cookie auth requires "web" + "auth:sanctum"
|--------------------------------------------------------------------------
*/

Route::middleware(['web', 'auth:sanctum'])->group(function () {

    // Auth
    Route::get('/auth/me', function (Request $request) {
        return response()->json($request->user());
    });

    // Articles (write)
    Route::post('/articles', [ArticleController::class, 'store']);

    // Comments
    Route::post('/articles/{id}/comments', [ArticleController::class, 'storeComment']);
});
