<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class PermissionReportSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        collect([
            'report-card-stocks',
            'report-stocks',
            'report-orders',
            'report-pending-order-receives',
            'report-sales',
            'report-best-selling-products'
        ])->each(function ($permission) {
            Permission::create([
                'name' => $permission,
            ]);
        });

        collect([
            'reports-full-access',
        ])->each(function ($role) {
            $role = Role::create([
                'name' => $role
            ]);

            $role->givePermissionTo([
                'report-card-stocks',
                'report-stocks',
                'report-orders',
                'report-pending-order-receives',
                'report-sales',
                'report-best-selling-products'
            ]);
        });
    }
}
