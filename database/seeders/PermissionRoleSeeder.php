<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class PermissionRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        collect([
            'roles-data',
            'roles-create',
            'roles-update',
            'roles-delete',
        ])->each(function ($permission) {
            Permission::create([
                'name' => $permission,
            ]);
        });

        collect([
            'roles-full-access',
        ])->each(function ($role) {
            $role = Role::create([
                'name' => $role
            ]);

            $role->givePermissionTo([
                'roles-data',
                'roles-create',
                'roles-update',
                'roles-delete',
            ]);
        });
    }
}
