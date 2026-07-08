<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Assignment\StoreAssignmentRequest;
use App\Models\Asset;
use App\Models\AssetAssignment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AssignmentController extends Controller
{
    /**
     * List all assignments (paginated), optionally filtered by asset or user.
     */
    public function index(Request $request): JsonResponse
    {
        $query = AssetAssignment::with(['asset', 'user', 'assignedBy']);

        if ($request->filled('asset_id')) {
            $query->where('asset_id', $request->input('asset_id'));
        }

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->input('user_id'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        $assignments = $query->latest('assigned_date')->paginate(15);

        return response()->json($assignments);
    }

    /**
     * Assign an asset to a user. Fails if the asset isn't currently available,
     * so two people can never be assigned the same physical asset.
     */
    public function store(StoreAssignmentRequest $request): JsonResponse
    {
        $asset = Asset::findOrFail($request->input('asset_id'));

        if ($asset->status !== 'available') {
            return response()->json([
                'message' => "This asset is currently '{$asset->status}' and cannot be assigned.",
            ], 409);
        }

        $assignment = DB::transaction(function () use ($request, $asset) {
            $assignment = AssetAssignment::create([
                'asset_id' => $asset->id,
                'user_id' => $request->input('user_id'),
                'assigned_by' => $request->user()->id,
                'assigned_date' => $request->input('assigned_date'),
                'notes' => $request->input('notes'),
                'status' => 'active',
            ]);

            $asset->update(['status' => 'assigned']);

            return $assignment;
        });

        return response()->json($assignment->load(['asset', 'user']), 201);
    }

    /**
     * Mark an assignment as returned. Sets the asset back to 'available'.
     */
    public function returnAsset(AssetAssignment $assignment): JsonResponse
    {
        if ($assignment->status === 'returned') {
            return response()->json([
                'message' => 'This assignment has already been marked as returned.',
            ], 409);
        }

        DB::transaction(function () use ($assignment) {
            $assignment->update([
                'status' => 'returned',
                'returned_date' => now()->toDateString(),
            ]);

            $assignment->asset->update(['status' => 'available']);
        });

        return response()->json($assignment->fresh(['asset', 'user']));
    }

    /**
     * User confirms they've received the asset (acknowledgement).
     */
    public function acknowledge(AssetAssignment $assignment): JsonResponse
    {
        $assignment->update([
            'acknowledged' => true,
            'acknowledged_at' => now(),
        ]);

        return response()->json($assignment->fresh());
    }
}