<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SaleDetail extends Model
{
    protected $fillable = [
        'sale_id',
        'product_unit_id',
        'quantity',
        'price',
    ];

    public function product_unit()
    {
        return $this->belongsTo(ProductUnit::class);
    }

    public function sale()
    {
        return $this->belongsTo(Sale::class);
    }
}
