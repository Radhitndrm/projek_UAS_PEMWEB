<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Order extends Model
{
    protected $fillable = [
        'order_code',
        'supplier_id',
        'order_date',
        'end_order_date',
        'total_amount',
        'status',
        'created_by',
        'status_changed_by',
        'status_changed_at',
        'deleted_by'
    ];

    public function scopeNotReceived()
    {
        $orderReceiveIds = OrderReceive::select('order_id')->pluck('order_id')->toArray();

        return $this->whereNotIn('id', $orderReceiveIds);
    }

    public function scopeSuccess()
    {
        return $this->where('status', 'success');
    }

    public function scopeSearch()
    {
        return $this->when(request('search'), function ($search) {
            return $search->where('order_code', 'like', '%' . request('search') . '%');
        })->when(request('supplier'), function ($supplier) {
            return request('supplier') !== 'all' ? $supplier->where('supplier_id', request('supplier')) : $supplier;
        });
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function order_details()
    {
        return $this->hasMany(OrderDetail::class);
    }

    public function order_receives()
    {
        return $this->hasMany(OrderReceive::class);
    }
}
