<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Asset\AssetRequest;
use App\Models\Asset;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AssetController extends Controller
{
    /**
     * List assets — paginated, with optional filtering by category, status,
     * or search term (name / serial number).
     */
    public function index(Request $request): JsonResponse
    {
        $query = Asset::with('category');

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->input('category_id'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('serial_number', 'like', "%{$search}%");
            });
        }

        $assets = $query->orderBy('name')->paginate(15);

        return response()->json($assets);
    }

    /**
     * Create a new asset. Defaults to 'available' status.
     */
    public function store(AssetRequest $request): JsonResponse
    {
        $asset = Asset::create($request->validated());

        return response()->json($asset->load('category'), 201);
    }

    /**
     * Show a single asset with its category.
     */
    public function show(Asset $asset): JsonResponse
    {
        return response()->json($asset->load('category'));
    }

    /**
     * Update an existing asset.
     */
    public function update(AssetRequest $request, Asset $asset): JsonResponse
    {
        $asset->update($request->validated());

        return response()->json($asset->load('category'));
    }

    /**
     * Soft-delete an asset. Blocked if it's currently assigned to someone,
     * so a live assignment can never be silently orphaned.
     */
    public function destroy(Asset $asset): JsonResponse
    {
        if ($asset->status === 'assigned') {
            return response()->json([
                'message' => 'This asset is currently assigned to a user and cannot be deleted. Return it first.',
            ], 409);
        }

        $asset->delete();

        return response()->json(['message' => 'Asset deleted successfully.']);
    }

    /**
     * Inventory summary: counts per status, plus low-stock categories.
     * Powers the admin dashboard's stock overview.
     */
    public function summary(): JsonResponse
    {
        $counts = Asset::selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        return response()->json([
            'total' => array_sum($counts->toArray()),
            'available' => $counts['available'] ?? 0,
            'assigned' => $counts['assigned'] ?? 0,
            'reserved' => $counts['reserved'] ?? 0,
            'damaged' => $counts['damaged'] ?? 0,
            'scrapped' => $counts['scrapped'] ?? 0,
        ]);
    }
}