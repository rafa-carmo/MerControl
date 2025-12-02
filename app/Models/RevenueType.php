<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RevenueType extends Model
{
    protected $table = 'revenue_types';
    protected $fillable = [
        'name',
    ];

    public function revenues()
    {
        return $this->hasMany(Revenue::class);
    }
}
