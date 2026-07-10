<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Asset;
use App\Models\DepreciationRecord;
use App\Services\DepreciationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DepreciationController extends Controller
{
    public function __construct(private DepreciationService $depreciationService)
    {
    }

    /**
     * List the latest depreciation record per asset (the financial report view).
     */
    public function index(): JsonResponse
    {
        // Get the most recent record per asset_id.
        $latestIds = DepreciationRecord::selectRaw('MAX(id) as id')
            ->groupBy('asset_id');

        $records = DepreciationRecord::with('asset')
            ->whereIn('id', $latestIds)
            ->get();

        return response()->json([
            'data' => $records,
            'total_purchase_value' => $records->sum('purchase_value'),
            'total_current_value' => $records->sum('current_value'),
            'total_depreciation' => $records->sum('depreciation_amount'),
        ]);
    }

    /**
     * Trigger a fresh depreciation calculation for one asset.
     */
    public function calculateForAsset(Request $request, Asset $asset): JsonResponse
    {
        $rate = $request->input('annual_rate'); // optional override

        $record = $this->depreciationService->calculateForAsset($asset, $rate ? (float) $rate : null);

        return response()->json($record);
    }

    /**
     * Trigger a fresh depreciation calculation for every eligible asset.
     */
    public function calculateForAll(Request $request): JsonResponse
    {
        $rate = $request->input('annual_rate');

        $count = $this->depreciationService->calculateForAllAssets($rate ? (float) $rate : null);

        return response()->json(['message' => "Depreciation calculated for {$count} asset(s)."]);
    }
}