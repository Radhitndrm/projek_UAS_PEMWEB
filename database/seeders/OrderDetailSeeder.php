<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OrderDetailSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('order_details')->insert([
            [
                'order_id' => 1,
                'product_unit_id' => 1,   // Smartphone – Box
                'quantity' => 2,
                'price' => 3500000,
                'created_at' => now(),
                'updated_at' => now(),
                'deleted_by' => null,
            ],
            [
                'order_id' => 1,
                'product_unit_id' => 4,   // Panci Stainless – Box
                'quantity' => 3,
                'price' => 240000,
                'created_at' => now(),
                'updated_at' => now(),
                'deleted_by' => null,
            ],
            [
                'order_id' => 2,
                'product_unit_id' => 2,   // Kopi Arabica – 1 Kg
                'quantity' => 10,
                'price' => 120000,
                'created_at' => now(),
                'updated_at' => now(),
                'deleted_by' => null,
            ],
            [
                'order_id' => 3,
                'product_unit_id' => 3,   // Kaos Polos – Piece
                'quantity' => 5,
                'price' => 65000,
                'created_at' => now(),
                'updated_at' => now(),
                'deleted_by' => null,
            ],
        ]);
    }
}
