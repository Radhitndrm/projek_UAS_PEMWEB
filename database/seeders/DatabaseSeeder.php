<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            PermissionTableSeeder::class,
            PermissionCategorySeeder::class,
            PermissionOrderReceiveSeeder::class,
            PermissionOrderSeeder::class,
            PermissionProductSeeder::class,
            PermissionProductVariantSeeder::class,
            PermissionReportSeeder::class,
            PermissionRoleSeeder::class,
            PermissionSaleSeeder::class,
            PermissionStockSeeder::class,
            PermissionSupplierSeeder::class,
            PermissionUnitSeeder::class,
            PermissionUserSeeder::class,
            RoleTableSeeder::class,
            UserTableSeeder::class,
        ]);
    }
}
