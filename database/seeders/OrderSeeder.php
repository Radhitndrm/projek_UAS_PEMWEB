<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('orders')->insert([
            [
                'order_code' => 'ORD-1001',
                'supplier_id' => 1,
                'order_date' => now()->subDays(5),
                'total_amount' => 3500000,
                'status' => 'success',
                'created_at' => now()->subDays(5),
                'updated_at' => now()->subDays(2),
                'created_by' => 1,
                'status_changed_at' => now()->subDays(2),
                'status_changed_by' => 1,
                'deleted_by' => null,
            ],
            [
                'order_code' => 'ORD-1002',
                'supplier_id' => 2,
                'order_date' => now()->subDays(3),
                'total_amount' => 1200000,
                'status' => 'pending',
                'created_at' => now()->subDays(3),
                'updated_at' => now()->subDays(1),
                'created_by' => 1,
                'status_changed_at' => null,
                'status_changed_by' => 1,
                'deleted_by' => null,
            ],
            [
                'order_code' => 'ORD-1003',
                'supplier_id' => 3,
                'order_date' => now()->subDays(2),
                'total_amount' => 650000,
                'status' => 'cancel',
                'created_at' => now()->subDays(2),
                'updated_at' => now(),
                'created_by' => 1,
                'status_changed_at' => now(),
                'status_changed_by' => 1,
                'deleted_by' => null,
            ],
        ]);
    }
}
