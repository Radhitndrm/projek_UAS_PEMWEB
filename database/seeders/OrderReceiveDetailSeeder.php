<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OrderReceiveDetailSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('order_receive_details')->insert([
            [
                'order_receive_id' => 1,
                'order_detail_id' => 1, // Order 1 → Detail 1
                'created_at' => now(),
                'updated_at' => now(),
                'deleted_by' => null,
            ],
            [
                'order_receive_id' => 1,
                'order_detail_id' => 2, // Order 1 → Detail 2
                'created_at' => now(),
                'updated_at' => now(),
                'deleted_by' => null,
            ],
            [
                'order_receive_id' => 2,
                'order_detail_id' => 3, // Order 2 → Detail 3
                'created_at' => now(),
                'updated_at' => now(),
                'deleted_by' => null,
            ],
            [
                'order_receive_id' => 3,
                'order_detail_id' => 4, // Order 3 → Detail 4
                'created_at' => now(),
                'updated_at' => now(),
                'deleted_by' => null,
            ],
        ]);
    }
}
