<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StockMovementSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('stock_movements')->insert([
            [
                'product_unit_id' => 1,
                'type'            => 'in',
                'quantity'        => 50,
                'price'           => 35000,
                'description'     => 'Initial stock purchase',
                'movement_date'   => now()->subDays(10)->format('Y-m-d'),
                'created_at'      => now(),
                'updated_at'      => now(),
                'deleted_by'      => null,
            ],
            [
                'product_unit_id' => 1,
                'type'            => 'out',
                'quantity'        => 5,
                'price'           => 35000,
                'description'     => 'Sale transaction',
                'movement_date'   => now()->subDays(5)->format('Y-m-d'),
                'created_at'      => now(),
                'updated_at'      => now(),
                'deleted_by'      => null,
            ],
            [
                'product_unit_id' => 2,
                'type'            => 'in',
                'quantity'        => 30,
                'price'           => 120000,
                'description'     => 'Supplier restock',
                'movement_date'   => now()->subDays(3)->format('Y-m-d'),
                'created_at'      => now(),
                'updated_at'      => now(),
                'deleted_by'      => null,
            ],
            [
                'product_unit_id' => 3,
                'type'            => 'out',
                'quantity'        => 2,
                'price'           => 65000,
                'description'     => 'Customer sale',
                'movement_date'   => now()->subDays(1)->format('Y-m-d'),
                'created_at'      => now(),
                'updated_at'      => now(),
                'deleted_by'      => null,
            ],
        ]);
    }
}
