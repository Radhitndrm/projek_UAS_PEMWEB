<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderReceive extends Model
{
    protected $fillable = [
        'order_id',
        'receive_code',
        'receive_date',
        'status',
        'status_changed_at',
        'status_changed_by',
        'created_by',
        'deleted_by'
    ];

    public function scopeSearch()
    {
        return $this->when(request('search'), function ($search) {
            return $search->where('receive_code', 'like', '%' . request('search') . '%');
        });
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function order_receive_details()
    {
        return $this->hasMany(OrderReceiveDetail::class);
    }
}
