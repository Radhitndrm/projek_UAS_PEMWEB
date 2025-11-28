<?php

namespace App\Http\Controllers\Apps;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserRequest;
use App\Models\User;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public static function middleware()
    {
        return [
            new Middleware('permission:users-data', only: ['index']),
            new Middleware('permission:users-create', only: ['create', 'store']),
            new Middleware('permission:users-update', only: ['update', 'edit']),
            new Middleware('permission:users-destroy', only: ['destroy']),
            new Middleware('permission:users-show', only: ['show']),

        ];
    }
    public function index(Request $request)
    {
        $currentPage = $request->input('page', 1);
        $perPage = $request->input('per_page', 10);

        $users = User::query()
            ->with(['roles' => function ($query) {
                $query->with(['permissions' => function ($query) {
                    $query->select('id', 'name');
                }])->select('id', 'name');
            }])
            ->select('id', 'name', 'username', 'email', 'avatar')
            ->when($request->search, fn($search) => $search->where('name', 'like', '%' . $request->search . '%'))
            ->latest()
            ->paginate($perPage, ['*'], 'page',  $currentPage)->withQueryString();

        return inertia('apps/users/index', [
            'users' => $users,
            'currentPage' => $currentPage,
            'perPage' => $perPage,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $roles = Role::query()->with('permissions')
            ->select('id', 'name')
            ->where('name', '!=', 'super-admin')
            ->get();

        return inertia('apps/users/create', ['roles' => $roles]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UserRequest $request)
    {

        $user = User::create([
            'name' => $request->name,
            'username' => $request->username,
            'email' => $request->email,
            'password' => bcrypt($request->password),
        ]);
        $user->assignRole($request->selectedRoles);

        return to_route('apps.users.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        $user->load('roles', 'roles.permissions');

        return inertia('apps/users/show', ['user' => $user]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        $roles = Role::query()
            ->with('permissions')
            ->select('id', 'name')
            ->where('name', '!=', 'super-admin')
            ->get();

        // load relationship
        $user->load(['roles' => fn($query) => $query->select('id', 'name'), 'roles.permissions' => fn($query) => $query->select('id', 'name')]);

        // render view
        return inertia('apps/users/edit', [
            'roles' => $roles,
            'user' => $user
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UserRequest $request, User $user)
    {
        if ($request->password)
            $user->update([
                'password' => bcrypt($request->password),
            ]);

        $user->update([
            'username' => $request->username,
            'name' => $request->name,
        ]);

        $user->syncRoles($request->selectedRoles);

        return to_route('apps.users.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();

        return back();
    }
}
