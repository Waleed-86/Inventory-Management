<?php

namespace App\Services;

use App\Models\AuditLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

class AuditService
{
    /**
     * Record an audit log entry.
     *
     * Usage:
     *   app(AuditService::class)->log('asset.created', $asset);
     *   app(AuditService::class)->log('asset.updated', $asset, ['status' => ['available', 'assigned']]);
     *   app(AuditService::class)->log('user.login');
     *
     * @param string $action e.g. 'asset.created', 'user.login', 'request.approved'
     * @param Model|null $subject the model the action was performed on, if any
     * @param array|null $changes optional details about what changed
     */
    public function log(string $action, ?Model $subject = null, ?array $changes = null): AuditLog
    {
        $user = Auth::user();

        return AuditLog::create([
            'user_id' => $user?->id,
            'user_name' => $user?->name,
            'action' => $action,
            'subject_type' => $subject ? get_class($subject) : null,
            'subject_id' => $subject?->id,
            'changes' => $changes,
            'ip_address' => Request::ip(),
        ]);
    }
}