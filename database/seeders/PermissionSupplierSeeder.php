<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class PermissionSupplierSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        collect([
            'suppliers-data',
            'suppliers-create',
            'suppliers-update',
            'suppliers-delete',
        ])->each(function ($permission) {
            Permission::create([
                'name' => $permission,
            ]);
        });

        collect([
            'suppliers-full-access',
        ])->each(function ($role) {
            $role = Role::create([
                'name' => $role
            ]);

            $role->givePermissionTo([
                'suppliers-data',
                'suppliers-create',
                'suppliers-update',
                'suppliers-delete',
            ]);
        });
    }
}
