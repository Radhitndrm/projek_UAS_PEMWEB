<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SaleSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('sales')->insert([
            [
                'sale_code'      => 'SL-001',
                'customer'       => 'Budi Santoso',
                'sale_date'      => '2025-01-10',
                'total_amount'   => 1500000,
                'payment_method' => 'cash',
                'created_by'     => 1,
                'created_at'     => now(),
                'updated_at'     => now(),
            ],
            [
                'sale_code'      => 'SL-002',
                'customer'       => 'PT Amanah Sejahtera',
                'sale_date'      => '2025-01-11',
                'total_amount'   => 2300000,
                'payment_method' => 'transfer',
                'created_by'     => 1,
                'created_at'     => now(),
                'updated_at'     => now(),
            ],
            [
                'sale_code'      => 'SL-003',
                'customer'       => 'Joko Widodo',
                'sale_date'      => '2025-01-12',
                'total_amount'   => 870000,
                'payment_method' => 'cash',
                'created_by'     => 1,
                'created_at'     => now(),
                'updated_at'     => now(),
            ],
        ]);
    }
}
