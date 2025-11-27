<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class PermissionProductVariantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        collect([
            'product-variants-data',
            'product-variants-create',
            'product-variants-update',
            'product-variants-delete',
            'product-variants-show'
        ])->each(function ($permission) {
            Permission::create([
                'name' => $permission,
            ]);
        });

        collect([
            'product-variants-full-access',
            'product-variants-show'
        ])->each(function ($role) {
            $role = Role::create([
                'name' => $role
            ]);

            if ($role->name === 'product-variants-full-access')
                $role->givePermissionTo([
                    'product-variants-data',
                    'product-variants-create',
                    'product-variants-update',
                    'product-variants-delete',
                    'product-variants-show'
                ]);
            else
                $role->givePermissionTo([
                    'product-variants-data',
                    'product-variants-show'
                ]);
        });
    }
}
