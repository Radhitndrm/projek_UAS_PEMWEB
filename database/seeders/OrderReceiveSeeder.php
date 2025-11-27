<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class PermissionOrderReceiveSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        collect([
            'order-receives-data',
            'order-receives-create',
            'order-receives-update',
            'order-receives-delete',
            'order-receives-show',
            'order-receives-verification'
        ])->each(function ($permission) {
            Permission::create([
                'name' => $permission,
            ]);
        });

        collect([
            'order-receives-full-access',
            'order-receives-data-verification'
        ])->each(function ($role) {
            $role = Role::create([
                'name' => $role
            ]);

            if ($role->name === 'order-receives-full-access')
                $role->givePermissionTo([
                    'order-receives-data',
                    'order-receives-create',
                    'order-receives-update',
                    'order-receives-delete',
                    'order-receives-show',
                    'order-receives-verification'
                ]);
            else
                $role->givePermissionTo([
                    'order-receives-data',
                    'order-receives-verification'
                ]);
        });
    }
}
