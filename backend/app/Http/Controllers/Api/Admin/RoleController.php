<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Role;
use Illuminate\Http\JsonResponse;

class RoleController extends Controller
{
    /**
     * List all roles — used to populate role-assignment dropdowns.
     * Full role/permission management (creating new roles, editing
     * permission sets) is a future module; this just exposes the
     * existing seeded roles for selection.
     */
    public function index(): JsonResponse
    {
        return response()->json(Role::orderBy('name')->get(['id', 'name', 'slug']));
    }
}