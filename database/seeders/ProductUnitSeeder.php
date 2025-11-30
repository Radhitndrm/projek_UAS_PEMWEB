<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductUnitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('product_units')->insert([
            [
                'barcode' => 'PU-1001',
                'name' => 'Smartphone – Box',
                'product_id' => 1, // Pastikan data product id=1 ada
                'unit_id' => 3,    // Unit: Pack
                'price' => 3500000,
                'image' => null,
                'created_at' => now(),
                'updated_at' => now(),
                'deleted_by' => null,
            ],
            [
                'barcode' => 'PU-1002',
                'name' => 'Kopi Arabica – 1 Kg',
                'product_id' => 2, // Pastikan data product id=2 ada
                'unit_id' => 1,    // Unit: Kilogram
                'price' => 120000,
                'image' => null,
                'created_at' => now(),
                'updated_at' => now(),
                'deleted_by' => null,
            ],
            [
                'barcode' => 'PU-1003',
                'name' => 'Kaos Polos – Piece',
                'product_id' => 3, // Pastikan data product id=3 ada
                'unit_id' => 4,    // Unit: Piece
                'price' => 65000,
                'image' => null,
                'created_at' => now(),
                'updated_at' => now(),
                'deleted_by' => null,
            ],
            [
                'barcode' => 'PU-1004',
                'name' => 'Panci Stainless – Box',
                'product_id' => 4, // Pastikan data product id=4 ada
                'unit_id' => 3,    // Unit: Pack / Box
                'price' => 240000,
                'image' => null,
                'created_at' => now(),
                'updated_at' => now(),
                'deleted_by' => null,
            ],
        ]);
    }
}
