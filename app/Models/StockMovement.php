<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StockMovement extends Model
{
    protected $fillable = [
        'product_unit_id',
        'quantity',
        'description',
        'type',
        'movement_date',
        'expired_date',
        'price',
    ];

    public function product_unit()
    {
        return $this->belongsTo(ProductUnit::class);
    }
}
