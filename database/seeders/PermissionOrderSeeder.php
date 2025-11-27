<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class PermissionOrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        collect([
            'orders-data',
            'orders-create',
            'orders-update',
            'orders-delete',
            'orders-verification',
            'orders-show'
        ])->each(function ($permission) {
            Permission::create([
                'name' => $permission,
            ]);
        });

        collect([
            'orders-full-access',
            'orders-data-verification'
        ])->each(function ($role) {
            $role = Role::create([
                'name' => $role
            ]);

            if ($role->name === 'orders-full-access')
                $role->givePermissionTo([
                    'orders-data',
                    'orders-create',
                    'orders-update',
                    'orders-delete',
                    'orders-verification',
                    'orders-show'
                ]);
            else
                $role->givePermissionTo([
                    'orders-data',
                    'orders-show'
                ]);
        });
    }
}
