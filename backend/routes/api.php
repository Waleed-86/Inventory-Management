<?php

use App\Http\Controllers\Api\Admin\CategoryController;
use App\Http\Controllers\Api\Auth\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Admin\AssetController;

// Public route — no auth required to log in
Route::post('/login', [AuthController::class, 'login']);

// Authenticated routes — any logged-in user (any role)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
});

// Admin-only routes — restricted to Super Admin and Inventory Manager
Route::middleware(['auth:sanctum', 'role:super-admin,inventory-manager'])
    ->prefix('admin')
    ->group(function () {
        Route::apiResource('categories', CategoryController::class);
    });
    Route::apiResource('assets', AssetController::class);
Route::get('assets-summary', [AssetController::class, 'summary']);