<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductUnit extends Model
{
    protected $fillable = [
        'barcode',
        'name',
        'product_id',
        'unit_id',
        'quantity',
        'price',
        'image',
        'deleted_by'
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }

    public function stock_movements()
    {
        return $this->hasMany(StockMovement::class);
    }
}
