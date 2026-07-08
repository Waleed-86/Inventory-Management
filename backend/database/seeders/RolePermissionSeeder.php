<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $allPermissionSlugs = DB::table('permissions')->pluck('id', 'slug');

        $rolePermissionMap = [
            'super-admin' => $allPermissionSlugs->keys()->all(), // gets every permission that exists

            'inventory-manager' => [
                'create-asset',
                'update-asset',
                'assign-asset',
                'approve-requests',
                'export-reports',
            ],

            'employee' => [
                // Employees have no elevated permissions — their actions
                // (submitting requests, reporting damage) only require
                // being authenticated, not a specific permission check.
            ],
        ];

        foreach ($rolePermissionMap as $roleSlug => $permissionSlugs) {
            $roleId = DB::table('roles')->where('slug', $roleSlug)->value('id');

            if (! $roleId) {
                continue; // role wasn't found/seeded yet, skip safely
            }

            foreach ($permissionSlugs as $slug) {
                $permissionId = $allPermissionSlugs[$slug] ?? null;

                if (! $permissionId) {
                    continue;
                }

                DB::table('role_permissions')->updateOrInsert(
                    ['role_id' => $roleId, 'permission_id' => $permissionId],
                    ['created_at' => now(), 'updated_at' => now()]
                );
            }
        }
    }
}