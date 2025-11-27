<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = ['name', 'description'];

    public function scopeSearch()
    {
        return $this->when(request('search'), fn($query) => $query->where('name', 'like', '%' . request('search') . '%'));
    }
}
