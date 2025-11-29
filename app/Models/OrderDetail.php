<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderDetail extends Model
{
    protected $fillable = ['order_id', 'product_unit_id', 'quantity', 'price', 'deleted_by'];

    /**
     * RELASI PENTING: Ini yang menyebabkan error.
     * Menghubungkan Detail Order dengan Product Unit.
     */
    public function product_unit()
    {
        return $this->belongsTo(ProductUnit::class);
    }

    /**
     * Opsional: Relasi balik ke Order (bagus untuk dimiliki).
     */
    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
