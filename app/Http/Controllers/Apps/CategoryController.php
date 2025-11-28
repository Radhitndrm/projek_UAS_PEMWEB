<?php

namespace App\Http\Controllers\Apps;

use App\Models\Category;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\CategoryRequest;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;

class CategoryController extends Controller implements HasMiddleware
{
    /**
     * Define middleware for the CategoryController.
     *
     * @return array
     */
    public static function middleware()
    {
        return [
            new Middleware('permission:categories-data', only: ['index']),
            new Middleware('permission:categories-create', only: ['create', 'store']),
            new Middleware('permission:categories-update', only: ['edit', 'update']),
            new Middleware('permission:categories-destroy', only: ['destroy']),
        ];
    }

    /**
     * Display a listing of the resource.
    */
    public function index(Request $request)
    {
        // request page data
        $currentPage = $request->input('page', 1);
        $perPage = $request->input('per_page', 10);

        // get all category data
        $categories = Category::search()->latest()->paginate($perPage, ['*'], 'page', $currentPage)->withQueryString();

        // render view
        return inertia('apps/categories/index', [
            'categories' => $categories,
            'currentPage' => $currentPage,
            'perPage' => $perPage
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // render view
        return inertia('apps/categories/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CategoryRequest $request)
    {
        // create new category
        Category::create([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        // render view
        return to_route('apps.categories.index');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Category $category)
    {
        // render view
        return inertia('apps/categories/edit', ['category' => $category]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CategoryRequest $request, Category $category)
    {
        // update category data
        $category->update([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        // render view
        return to_route('apps.categories.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        // delete category data
        $category->delete();

        // render view
        return back();
    }
}