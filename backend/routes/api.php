<?php

use App\Http\Controllers\Api\Admin\AssetController;
use App\Http\Controllers\Api\Admin\AssignmentController;
use App\Http\Controllers\Api\Admin\AuditLogController;
use App\Http\Controllers\Api\Admin\CategoryController;
use App\Http\Controllers\Api\Admin\DepreciationController;
use App\Http\Controllers\Api\Admin\ReportController;
use App\Http\Controllers\Api\Admin\RoleController;
use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\DamageReportController;
use App\Http\Controllers\Api\RequestController;
use Illuminate\Support\Facades\Route;

// ---------------------------------------------------------------------
// Public
// ---------------------------------------------------------------------
Route::post('/login', [AuthController::class, 'login']);

// ---------------------------------------------------------------------
// Authenticated — any logged-in user, regardless of role
// ---------------------------------------------------------------------
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Asset requisitions: any user can submit/view their own;
    // RequestController::index() internally shows all requests to admins.
    Route::get('requests', [RequestController::class, 'index']);
    Route::post('requests', [RequestController::class, 'store']);

    // Damage reports: any user can submit/view their own;
    // DamageReportController::index() internally shows all reports to admins.
    Route::get('damage-reports', [DamageReportController::class, 'index']);
    Route::post('damage-reports', [DamageReportController::class, 'store']);
    Route::get('damage-reports/{report}/image', [DamageReportController::class, 'imageUrl']);

    // A user acknowledging receipt of their own assigned asset.
    Route::post('assignments/{assignment}/acknowledge', [AssignmentController::class, 'acknowledge']);
});

// ---------------------------------------------------------------------
// Admin — Super Admin or Inventory Manager only
// ---------------------------------------------------------------------
Route::middleware(['auth:sanctum', 'role:super-admin,inventory-manager'])
    ->prefix('admin')
    ->group(function () {
        Route::apiResource('categories', CategoryController::class);

        Route::apiResource('assets', AssetController::class);
        Route::get('assets-summary', [AssetController::class, 'summary']);

        Route::apiResource('assignments', AssignmentController::class)->only(['index', 'store']);
        Route::post('assignments/{assignment}/return', [AssignmentController::class, 'returnAsset']);

        Route::get('roles', [RoleController::class, 'index']);

        Route::apiResource('users', UserController::class)->except(['destroy']);
        Route::post('users/{user}/deactivate', [UserController::class, 'deactivate']);
        Route::post('users/{user}/reactivate', [UserController::class, 'reactivate']);
    });

// ---------------------------------------------------------------------
// Admin — permission-gated (approve-requests)
// ---------------------------------------------------------------------
Route::middleware(['auth:sanctum', 'permission:approve-requests'])->group(function () {
    Route::post('requests/{requisition}/approve', [RequestController::class, 'approve']);
    Route::post('requests/{requisition}/reject', [RequestController::class, 'reject']);
    Route::post('requests/{requisition}/dispatch', [RequestController::class, 'dispatch']);

    Route::patch('damage-reports/{report}/status', [DamageReportController::class, 'updateStatus']);
});

// ---------------------------------------------------------------------
// Admin — permission-gated (view-financial-reports)
// ---------------------------------------------------------------------
Route::middleware(['auth:sanctum', 'permission:view-financial-reports'])->group(function () {
    Route::get('depreciation', [DepreciationController::class, 'index']);
    Route::post('depreciation/assets/{asset}/calculate', [DepreciationController::class, 'calculateForAsset']);
    Route::post('depreciation/calculate-all', [DepreciationController::class, 'calculateForAll']);
});

// ---------------------------------------------------------------------
// Admin — permission-gated (export-reports)
// ---------------------------------------------------------------------
Route::middleware(['auth:sanctum', 'permission:export-reports'])->group(function () {
    Route::get('admin/reports/assets/pdf', [ReportController::class, 'assetsPdf']);
    Route::get('admin/reports/assets/csv', [ReportController::class, 'assetsCsv']);
});

// ---------------------------------------------------------------------
// Admin — Super Admin only
// ---------------------------------------------------------------------
Route::middleware(['auth:sanctum', 'role:super-admin'])->group(function () {
    Route::get('admin/audit-logs', [AuditLogController::class, 'index']);
});