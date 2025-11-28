<?php

namespace App\Http\Controllers\Apps;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\PermissionRequest;
use Spatie\Permission\Models\Permission;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;

class PermissionController extends Controller implements HasMiddleware
{
    /**
     * Define middleware for the PermissionController.
     *
     * @return array
     */
    public static function middleware()
    {
        return [
            new Middleware('permission:permissions-data', only: ['index']),
            new Middleware('permission:permissions-create', only: ['store']),
            new Middleware('permission:permissions-update', only: ['update']),
            new Middleware('permission:permissions-destroy', only: ['destroy']),
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // get all permission data
        $permissions = Permission::query()
            ->select('id', 'name')
            ->when($request->search, fn($search) => $search->where('name', 'like', '%' . $request->search . '%'))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        // render view
        return inertia('apps/permissions/index', [
            'permissions' => $permissions
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(PermissionRequest $request)
    {
        // create new permission
        Permission::create(['name' => $request->name]);

        // render view
        return back();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(PermissionRequest $request, Permission $permission)
    {
        // update permission data
        $permission->update(['name' => $request->name]);

        // render view
        return back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Permission $permission)
    {
        // delete permission data
        $permission->delete();

        // render view
        return back();
    }
}
