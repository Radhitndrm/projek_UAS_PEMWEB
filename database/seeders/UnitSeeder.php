<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UnitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('units')->insert([
            [
                'name' => 'Kilogram',
                'description' => 'Satuan berat (kg)',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Liter',
                'description' => 'Satuan volume (L)',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Pack',
                'description' => 'Satuan bungkus / kemasan',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Piece',
                'description' => 'Satuan per item (pcs)',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
