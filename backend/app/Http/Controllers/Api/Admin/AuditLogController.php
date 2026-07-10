<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuditLogController extends Controller
{
    /**
     * List audit log entries — paginated, filterable by action, user, and date range.
     * Read-only by design: no store/update/destroy methods exist here, since
     * the AuditLog model itself blocks updates and deletes.
     */
    public function index(Request $request): JsonResponse
    {
        $query = AuditLog::query();

        if ($request->filled('action')) {
            $query->where('action', 'like', $request->input('action').'%');
        }

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->input('user_id'));
        }

        if ($request->filled('from')) {
            $query->whereDate('created_at', '>=', $request->input('from'));
        }

        if ($request->filled('to')) {
            $query->whereDate('created_at', '<=', $request->input('to'));
        }

        $logs = $query->latest()->paginate(25);

        return response()->json($logs);
    }
}