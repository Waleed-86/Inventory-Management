<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            ['name' => 'Create Asset', 'slug' => 'create-asset'],
            ['name' => 'Update Asset', 'slug' => 'update-asset'],
            ['name' => 'Delete Asset', 'slug' => 'delete-asset'],
            ['name' => 'Assign Asset', 'slug' => 'assign-asset'],
            ['name' => 'Approve Requests', 'slug' => 'approve-requests'],
            ['name' => 'View Financial Reports', 'slug' => 'view-financial-reports'],
            ['name' => 'Manage Users', 'slug' => 'manage-users'],
            ['name' => 'Manage Roles', 'slug' => 'manage-roles'],
            ['name' => 'Export Reports', 'slug' => 'export-reports'],
        ];

        foreach ($permissions as $permission) {
            DB::table('permissions')->updateOrInsert(
                ['slug' => $permission['slug']],
                [
                    'name' => $permission['name'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}