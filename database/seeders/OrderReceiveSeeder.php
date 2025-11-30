<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OrderReceiveSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('order_receives')->insert([
            [
                'order_id' => 1,
                'receive_code' => 'REC-1001',
                'receive_date' => now()->subDays(3),
                'status' => 'success',
                'created_at' => now()->subDays(3),
                'updated_at' => now()->subDays(1),
                'created_by' => 1,
                'status_changed_at' => now()->subDays(1),
                'status_changed_by' => 1,
                'deleted_by' => null,
            ],
            [
                'order_id' => 2,
                'receive_code' => 'REC-1002',
                'receive_date' => now()->subDays(1),
                'status' => 'pending',
                'created_at' => now()->subDays(1),
                'updated_at' => now()->subHours(6),
                'created_by' => 1,
                'status_changed_at' => null,
                'status_changed_by' => null,
                'deleted_by' => null,
            ],
            [
                'order_id' => 3,
                'receive_code' => 'REC-1003',
                'receive_date' => now(),
                'status' => 'success',
                'created_at' => now(),
                'updated_at' => now(),
                'created_by' => 1,
                'status_changed_at' => now(),
                'status_changed_by' => 1,
                'deleted_by' => null,
            ],
        ]);
    }
}
