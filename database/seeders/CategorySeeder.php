<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('categories')->insert([
            [
                'name' => 'Electronics',
                'description' => 'Kategori untuk barang elektronik',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Food & Beverage',
                'description' => 'Kategori untuk makanan dan minuman',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Fashion',
                'description' => 'Kategori untuk pakaian dan aksesoris',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Household',
                'description' => 'Kategori untuk perlengkapan rumah tangga',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
