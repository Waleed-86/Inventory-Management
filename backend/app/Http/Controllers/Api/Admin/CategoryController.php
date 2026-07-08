<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Category\CategoryRequest;
use App\Models\Category;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    /**
     * List all categories (paginated).
     */
    public function index(): JsonResponse
    {
        $categories = Category::withCount('assets')
            ->orderBy('name')
            ->paginate(15);

        return response()->json($categories);
    }

    /**
     * Create a new category.
     */
    public function store(CategoryRequest $request): JsonResponse
    {
        $category = Category::create($request->validated());

        return response()->json($category, 201);
    }

    /**
     * Show a single category with its asset count.
     */
    public function show(Category $category): JsonResponse
    {
        $category->loadCount('assets');

        return response()->json($category);
    }

    /**
     * Update an existing category.
     */
    public function update(CategoryRequest $request, Category $category): JsonResponse
    {
        $category->update($request->validated());

        return response()->json($category);
    }

    /**
     * Soft-delete a category. Blocked if assets still reference it,
     * so category deletion never silently orphans asset records.
     */
    public function destroy(Category $category): JsonResponse
    {
        if ($category->assets()->exists()) {
            return response()->json([
                'message' => 'This category still has assets assigned to it and cannot be deleted. Reassign or remove those assets first.',
            ], 409);
        }

        $category->delete();

        return response()->json(['message' => 'Category deleted successfully.']);
    }
}