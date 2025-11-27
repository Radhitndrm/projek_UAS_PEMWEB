<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class PermissionUnitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        collect([
            'units-data',
            'units-create',
            'units-update',
            'units-delete',
        ])->each(function ($permission) {
            Permission::create([
                'name' => $permission,
            ]);
        });

        collect([
            'units-full-access',
        ])->each(function ($role) {
            $role = Role::create([
                'name' => $role
            ]);

            $role->givePermissionTo([
                'units-data',
                'units-create',
                'units-update',
                'units-delete',
            ]);
        });
    }
}
