<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\DamageReport\StoreDamageReportRequest;
use App\Models\DamageReport;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class DamageReportController extends Controller
{
    /**
     * List damage reports. Admins (with 'approve-requests' permission, reused
     * here as the general "can triage" permission) see everyone's; employees
     * only see their own.
     */
    public function index(Request $request): JsonResponse
    {
        $query = DamageReport::with(['asset', 'user', 'reviewer']);

        if (! $request->user()->hasPermission('approve-requests')) {
            $query->where('user_id', $request->user()->id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        $reports = $query->latest()->paginate(15);

        return response()->json($reports);
    }

    /**
     * Submit a new damage report. Stores the image (if provided) and flips
     * the asset's status to 'damaged' so it can no longer be assigned/requested.
     */
    public function store(StoreDamageReportRequest $request): JsonResponse
    {
        $imagePath = null;

        if ($request->hasFile('image')) {
            // Stored under storage/app/public/damage-reports — run
            // `php artisan storage:link` once so these are web-accessible.
            $imagePath = $request->file('image')->store('damage-reports', 'public');
        }

        $report = DB::transaction(function () use ($request, $imagePath) {
            $report = DamageReport::create([
                'asset_id' => $request->input('asset_id'),
                'user_id' => $request->user()->id,
                'description' => $request->input('description'),
                'image_path' => $imagePath,
                'status' => 'pending_review',
            ]);

            $report->asset()->update(['status' => 'damaged']);

            return $report;
        });

        return response()->json($report->load('asset'), 201);
    }

    /**
     * Update a damage report's status (admin triage/repair workflow).
     * When marked 'repaired', the asset automatically returns to 'available'.
     * When marked 'scrapped', the asset is permanently retired.
     */
    public function updateStatus(Request $request, DamageReport $report): JsonResponse
    {
        $request->validate([
            'status' => ['required', Rule::in(['in_repair', 'repaired', 'replaced', 'scrapped'])],
        ]);

        $newStatus = $request->input('status');

        DB::transaction(function () use ($report, $newStatus, $request) {
            $report->update([
                'status' => $newStatus,
                'reviewed_by' => $request->user()->id,
            ]);

            // Sync the asset's own status to match the resolution.
            $assetStatus = match ($newStatus) {
                'repaired' => 'available',
                'scrapped', 'replaced' => 'scrapped',
                default => 'damaged', // still in_repair
            };

            $report->asset()->update(['status' => $assetStatus]);
        });

        return response()->json($report->fresh(['asset', 'reviewer']));
    }

    /**
     * Return the stored image URL for a damage report (helper for the frontend).
     */
    public function imageUrl(DamageReport $report): JsonResponse
    {
        if (! $report->image_path) {
            return response()->json(['url' => null]);
        }

        return response()->json(['url' => Storage::disk('public')->url($report->image_path)]);
    }
}