<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class PermissionUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        collect([
            'users-data',
            'users-create',
            'users-update',
            'users-delete',
            'users-show'
        ])->each(function ($permission) {
            Permission::create([
                'name' => $permission,
            ]);
        });

        collect([
            'users-full-access',
            'users-data-show'
        ])->each(function ($role) {
            $role = Role::create([
                'name' => $role
            ]);

            if ($role->name === 'users-full-access')
                $role->givePermissionTo([
                    'users-data',
                    'users-create',
                    'users-update',
                    'users-delete',
                    'users-show'
                ]);
            else
                $role->givePermissionTo([
                    'users-data',
                    'users-show'
                ]);
        });
    }
}
