<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\UserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\AuditService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * List users — paginated, with optional search and active/inactive filter.
     */
    public function index(Request $request): JsonResponse
    {
        $query = User::with('role');

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->filled('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        $users = $query->orderBy('name')->paginate(15);

        // Transform the paginated collection's items through UserResource
        // while keeping the pagination metadata (current_page, total, etc.) intact.
        $users->getCollection()->transform(fn ($user) => new UserResource($user));

        return response()->json($users);
    }

    /**
     * Create a new user with a hashed password and assigned role.
     */
    public function store(UserRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['password'] = Hash::make($data['password']);

        $user = User::create($data);

        app(AuditService::class)->log('user.created', $user);

        return response()->json(new UserResource($user->load('role')), 201);
    }

    /**
     * Show a single user.
     */
    public function show(User $user): JsonResponse
    {
        return response()->json(new UserResource($user->load('role')));
    }

    /**
     * Update an existing user. Password is only changed if provided.
     */
    public function update(UserRequest $request, User $user): JsonResponse
    {
        $data = $request->validated();

        if (! empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $oldRoleId = $user->role_id;
        $user->update($data);

        if ($oldRoleId !== $user->role_id) {
            app(AuditService::class)->log('user.role_changed', $user, [
                'old_role_id' => $oldRoleId,
                'new_role_id' => $user->role_id,
            ]);
        }

        app(AuditService::class)->log('user.updated', $user);

        return response()->json(new UserResource($user->load('role')));
    }

    /**
     * Deactivate a user (soft — preserves their history/assignments,
     * just prevents them from logging in and removes them from
     * assignable/requestable dropdowns).
     */
    public function deactivate(User $user): JsonResponse
    {
        $user->update(['is_active' => false]);
        $user->tokens()->delete(); // immediately invalidate any active sessions

        app(AuditService::class)->log('user.deactivated', $user);

        return response()->json(['message' => 'User deactivated successfully.']);
    }

    /**
     * Reactivate a previously deactivated user.
     */
    public function reactivate(User $user): JsonResponse
    {
        $user->update(['is_active' => true]);

        app(AuditService::class)->log('user.reactivated', $user);

        return response()->json(['message' => 'User reactivated successfully.']);
    }
}