<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SupplierSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('suppliers')->insert([
            [
                'code' => 'SUP-001',
                'name' => 'PT Sumber Makmur',
                'address' => 'Jl. Pelita No. 12, Jakarta',
                'phone' => '081234567890',
                'email' => 'contact@sumbermakmur.co.id',
                'created_at' => now(),
                'updated_at' => now(),
                'deleted_by' => null,
            ],
            [
                'code' => 'SUP-002',
                'name' => 'CV Maju Bersama',
                'address' => 'Jl. Kenangan No. 45, Bandung',
                'phone' => '089876543210',
                'email' => 'info@majubersama.com',
                'created_at' => now(),
                'updated_at' => now(),
                'deleted_by' => null,
            ],
            [
                'code' => 'SUP-003',
                'name' => 'UD Bahagia Sentosa',
                'address' => 'Jl. Merpati No. 6, Surabaya',
                'phone' => '082233445566',
                'email' => 'sales@bahagiasentosa.id',
                'created_at' => now(),
                'updated_at' => now(),
                'deleted_by' => null,
            ],
            [
                'code' => 'SUP-004',
                'name' => 'PT Mandiri Elektronik',
                'address' => 'Jl. Mawar No. 78, Medan',
                'phone' => '081122334455',
                'email' => 'support@mandirielektronik.com',
                'created_at' => now(),
                'updated_at' => now(),
                'deleted_by' => null,
            ],
        ]);
    }
}
