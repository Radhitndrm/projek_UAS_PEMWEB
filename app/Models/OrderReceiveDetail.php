<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderReceiveDetail extends Model
{
    protected $fillable = ['order_receive_id', 'order_detail_id', 'expired_date', 'deleted_by'];

    public function order_receive()
    {
        return $this->belongsTo(OrderReceive::class);
    }

    public function order_detail()
    {
        return $this->belongsTo(OrderDetail::class);
    }
}
