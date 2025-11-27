<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class PermissionStockSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        collect([
            'stocks-data',
            'stocks-create',
        ])->each(function ($permission) {
            Permission::create([
                'name' => $permission,
            ]);
        });

        collect([
            'stocks-full-access',
        ])->each(function ($role) {
            $role = Role::create([
                'name' => $role
            ]);

            $role->givePermissionTo([
                'stocks-data',
                'stocks-create',
            ]);
        });
    }
}
