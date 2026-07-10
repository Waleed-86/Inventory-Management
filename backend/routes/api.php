<?php
use App\Http\Controllers\Api\Admin\AssignmentController;
use App\Http\Controllers\Api\Admin\CategoryController;
use App\Http\Controllers\Api\Auth\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Admin\AssetController;
use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\RequestController;
use App\Http\Controllers\Api\DamageReportController;
use App\Http\Controllers\Api\Admin\DepreciationController;
use App\Http\Controllers\Api\Admin\ReportController;
use App\Http\Controllers\Api\Admin\RoleController;
use App\Http\Controllers\Api\Admin\AuditLogController;

 
// Public route — no auth required to log in
    Route::post('/login', [AuthController::class, 'login']);

// Authenticated routes — any logged-in user (any role)
    Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('requests', [RequestController::class, 'index']);
    Route::post('requests', [RequestController::class, 'store']);
    Route::get('damage-reports', [DamageReportController::class, 'index']);
    Route::post('damage-reports', [DamageReportController::class, 'store']);
    Route::get('damage-reports/{report}/image', [DamageReportController::class, 'imageUrl']);
    Route::post('assignments/{assignment}/acknowledge', [AssignmentController::class, 'acknowledge']);
});

// Admin-only routes — restricted to Super Admin and Inventory Manager
    Route::middleware(['auth:sanctum', 'role:super-admin,inventory-manager'])
    ->prefix('admin')
    ->group(function () {
    Route::apiResource('categories', CategoryController::class);});
    Route::get('roles', [RoleController::class, 'index']);
    Route::middleware(['auth:sanctum', 'role:super-admin'])->group(function () {
    Route::get('audit-logs', [AuditLogController::class, 'index']);
});
    Route::apiResource('users', UserController::class)->except(['destroy']); 
    Route::post('users/{user}/deactivate', [UserController::class, 'deactivate']);
    Route::post('users/{user}/reactivate', [UserController::class, 'reactivate']);
    Route::get('users', [UserController::class, 'index']);
    Route::middleware(['auth:sanctum', 'permission:approve-requests'])->group(function () {
    Route::post('requests/{requisition}/approve', [RequestController::class, 'approve']);
    Route::post('requests/{requisition}/reject', [RequestController::class, 'reject']);
    Route::post('requests/{requisition}/dispatch', [RequestController::class, 'dispatch']);
    Route::middleware(['auth:sanctum', 'permission:export-reports'])->group(function () {
    Route::get('reports/assets/pdf', [ReportController::class, 'assetsPdf']);
    Route::get('reports/assets/csv', [ReportController::class, 'assetsCsv']);
});
});
    Route::middleware(['auth:sanctum', 'permission:view-financial-reports'])->group(function () {
    Route::get('depreciation', [DepreciationController::class, 'index']);
    Route::post('depreciation/assets/{asset}/calculate', [DepreciationController::class, 'calculateForAsset']);
    Route::post('depreciation/calculate-all', [DepreciationController::class, 'calculateForAll']);
});
    Route::apiResource('assignments', AssignmentController::class)->only(['index', 'store']);
   Route::post('assignments/{assignment}/return', [AssignmentController::class, 'returnAsset']);
   Route::apiResource('assets', AssetController::class);
   Route::get('assets-summary', [AssetController::class, 'summary']);
   Route::middleware(['auth:sanctum', 'permission:approve-requests'])->group(function () {
    Route::patch('damage-reports/{report}/status', [DamageReportController::class, 'updateStatus']);
});





