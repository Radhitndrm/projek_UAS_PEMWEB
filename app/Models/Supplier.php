<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    protected $fillable = ['code', 'name', 'email', 'phone', 'address'];

    public function scopeGenerateCode($query, $prefix = 'SPR')
    {
        $lastCode = $query->where('code', 'like', "$prefix-%")
            ->orderBy('code', 'desc')
            ->first();
        if (!$lastCode)
            return $prefix . '-01';

        $lastNumber = (int) substr($lastCode->code, strlen($prefix) + 1);

        $newNumber = $lastNumber + 1;

        return $prefix . '-' . str_pad($newNumber, 2, '0', STR_PAD_LEFT);
    }

    public function scopeSearch($query)
    {
        return $this->when(
            request('search'),
            fn($query) => $query->whereAny(['name', 'code'], 'like', '%' . request('search') . '%')
        );
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}
