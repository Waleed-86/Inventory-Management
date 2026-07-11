<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategoryTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private User $employee;

    protected function setUp(): void
    {
        parent::setUp();

        $adminRole = Role::create(['name' => 'Super Admin', 'slug' => 'super-admin']);
        $employeeRole = Role::create(['name' => 'Employee', 'slug' => 'employee']);

        $this->admin = User::factory()->create(['role_id' => $adminRole->id]);
        $this->employee = User::factory()->create(['role_id' => $employeeRole->id]);
    }

    public function test_admin_can_create_a_category(): void
    {
        $response = $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/admin/categories', ['name' => 'Electronics']);

        $response->assertStatus(201)
            ->assertJson(['name' => 'Electronics', 'slug' => 'electronics']);

        $this->assertDatabaseHas('categories', ['name' => 'Electronics']);
    }

    public function test_employee_cannot_create_a_category(): void
    {
        $response = $this->actingAs($this->employee, 'sanctum')
            ->postJson('/api/admin/categories', ['name' => 'Electronics']);

        $response->assertStatus(403);
    }

    public function test_category_name_is_required(): void
    {
        $response = $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/admin/categories', ['name' => '']);

        $response->assertStatus(422)->assertJsonValidationErrors(['name']);
    }

    public function test_category_with_assets_cannot_be_deleted(): void
    {
        $category = Category::create(['name' => 'Electronics', 'slug' => 'electronics']);
        $category->assets()->create([
            'name' => 'Test Laptop',
            'serial_number' => 'SN-001',
            'status' => 'available',
        ]);

        $response = $this->actingAs($this->admin, 'sanctum')
            ->deleteJson("/api/admin/categories/{$category->id}");

        $response->assertStatus(409);
        $this->assertDatabaseHas('categories', ['id' => $category->id]); // not deleted
    }

    public function test_category_without_assets_can_be_deleted(): void
    {
        $category = Category::create(['name' => 'Furniture', 'slug' => 'furniture']);

        $response = $this->actingAs($this->admin, 'sanctum')
            ->deleteJson("/api/admin/categories/{$category->id}");

        $response->assertStatus(200);
        $this->assertSoftDeleted('categories', ['id' => $category->id]);
    }
}