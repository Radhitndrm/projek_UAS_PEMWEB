<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SaleDetailSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('sale_details')->insert([
            [
                'sale_id'         => 1,
                'product_unit_id' => 1, // contoh item
                'quantity'        => 2,
                'price'           => 750000, // harga per pcs
                'created_at'      => now(),
                'updated_at'      => now(),
            ],
            [
                'sale_id'         => 1,
                'product_unit_id' => 4,
                'quantity'        => 1,
                'price'           => 200000,
                'created_at'      => now(),
                'updated_at'      => now(),
            ],
            [
                'sale_id'         => 2,
                'product_unit_id' => 2,
                'quantity'        => 5,
                'price'           => 120000,
                'created_at'      => now(),
                'updated_at'      => now(),
            ],
            [
                'sale_id'         => 3,
                'product_unit_id' => 3,
                'quantity'        => 3,
                'price'           => 65000,
                'created_at'      => now(),
                'updated_at'      => now(),
            ],
        ]);
    }
}
