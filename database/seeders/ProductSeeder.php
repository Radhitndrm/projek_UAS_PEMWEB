<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('products')->insert([
            [
                'sku' => 'ELC-001',
                'name' => 'Smartphone 6.5-inch',
                'category_id' => 1, // Electronics
                'description' => 'Smartphone dengan layar besar dan baterai tahan lama.',
                'image' => null,
                'created_at' => now(),
                'updated_at' => now(),
                'deleted_by' => null,
            ],
            [
                'sku' => 'FNB-001',
                'name' => 'Kopi Arabica 1kg',
                'category_id' => 2, // Food & Beverage
                'description' => 'Biji kopi arabika kualitas premium.',
                'image' => null,
                'created_at' => now(),
                'updated_at' => now(),
                'deleted_by' => null,
            ],
            [
                'sku' => 'FSH-001',
                'name' => 'Kaos Polos Hitam L',
                'category_id' => 3, // Fashion
                'description' => 'Kaos polos bahan cotton combed 30s.',
                'image' => null,
                'created_at' => now(),
                'updated_at' => now(),
                'deleted_by' => null,
            ],
            [
                'sku' => 'HHD-001',
                'name' => 'Panci Stainless 24cm',
                'category_id' => 4, // Household
                'description' => 'Panci stainless steel ukuran 24cm.',
                'image' => null,
                'created_at' => now(),
                'updated_at' => now(),
                'deleted_by' => null,
            ],
        ]);
    }
}
