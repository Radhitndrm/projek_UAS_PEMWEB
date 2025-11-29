<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    protected $fillable = [
        'sale_code',
        'customer',
        'sale_date',
        'total_amount',
        'payment_method',
        'created_by',
    ];

    public function sale_details()
    {
        return $this->hasMany(SaleDetail::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Scope untuk memfilter query berdasarkan keyword pencarian
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string|null $search
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeSearch($query, $search = null)
    {
        // Ambil keyword pencarian dari query string 'search'
        $search = $search ?? request('search');

        if ($search) {
            $query->where('sale_code', 'like', '%' . $search . '%')
                ->orWhere('customer', 'like', '%' . $search . '%');
        }

        return $query;
    }
}