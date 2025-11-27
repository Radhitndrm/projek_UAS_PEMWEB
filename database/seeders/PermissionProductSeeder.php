<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class PermissionProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        collect([
            'products-data',
            'products-create',
            'products-update',
            'products-delete',
            'products-show'
        ])->each(function ($permission) {
            Permission::create([
                'name' => $permission,
            ]);
        });

        collect([
            'products-full-access',
            'products-data-show'
        ])->each(function ($role) {
            $role = Role::create([
                'name' => $role
            ]);

            if ($role->name === 'products-full-access')
                $role->givePermissionTo([
                    'products-data',
                    'products-create',
                    'products-update',
                    'products-delete',
                    'products-show',
                ]);
            else
                $role->givePermissionTo([
                    'products-data',
                    'products-show'
                ]);
        });
    }
}
