<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AssetRequisition\StoreRequisitionRequest;
use App\Models\AssetRequisition;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RequestController extends Controller
{
    /**
     * List requisitions. Admins (with the 'approve-requests' permission)
     * see everyone's; regular employees only see their own.
     */
    public function index(Request $request): JsonResponse
    {
        $query = AssetRequisition::with(['asset', 'user', 'reviewer']);

        if (! $request->user()->hasPermission('approve-requests')) {
            $query->where('user_id', $request->user()->id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        $requisitions = $query->latest()->paginate(15);

        return response()->json($requisitions);
    }

    /**
     * Submit a new asset requisition (any authenticated employee).
     */
    public function store(StoreRequisitionRequest $request): JsonResponse
    {
        $requisition = AssetRequisition::create([
            ...$request->validated(),
            'user_id' => $request->user()->id,
            'status' => 'pending',
        ]);

        return response()->json($requisition->load('asset'), 201);
    }

    /**
     * Approve a pending requisition.
     */
    public function approve(Request $request, AssetRequisition $requisition): JsonResponse
    {
        if ($requisition->status !== 'pending') {
            return response()->json(['message' => 'Only pending requests can be approved.'], 409);
        }

        $requisition->update([
            'status' => 'approved',
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
            'admin_comment' => $request->input('admin_comment'),
        ]);

        return response()->json($requisition->fresh(['asset', 'user']));
    }

    /**
     * Reject a pending requisition. Requires a comment explaining why.
     */
    public function reject(Request $request, AssetRequisition $requisition): JsonResponse
    {
        $request->validate([
            'admin_comment' => ['required', 'string', 'max:1000'],
        ]);

        if ($requisition->status !== 'pending') {
            return response()->json(['message' => 'Only pending requests can be rejected.'], 409);
        }

        $requisition->update([
            'status' => 'rejected',
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
            'admin_comment' => $request->input('admin_comment'),
        ]);

        return response()->json($requisition->fresh(['asset', 'user']));
    }

    /**
     * Mark an approved requisition as dispatched (physically handed over).
     */
    public function dispatch(AssetRequisition $requisition): JsonResponse
    {
        if ($requisition->status !== 'approved') {
            return response()->json(['message' => 'Only approved requests can be dispatched.'], 409);
        }

        $requisition->update(['status' => 'dispatched']);

        return response()->json($requisition->fresh(['asset', 'user']));
    }
}