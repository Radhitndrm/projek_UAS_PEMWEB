<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    protected $fillable = [
        'sku',
        'name',
        'category_id',
        'description',
        'deleted_by',
    ];

    public function scopeSearch()
    {
        return $this->when(request('search'), function ($search) {
            return $search->whereAny(['name', 'sku'], 'like', '%' . request('search') . '%');
        })->when(request('category'), function ($category) {
            return request('category') !== 'all' ? $category->where('category_id', request('category')) : $category;
        });
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function product_units()
    {
        return $this->hasMany(related: ProductUnit::class);
    }
}
