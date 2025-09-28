<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/** @typescript */
class Purchase extends Model
{
    protected $fillable = [
        'date',
        'key',
        'place_id',
        'total_tax',
        'total_discount',
    ];

    public function products()
    {
        return $this->hasMany(PurchaseProduct::class);
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'tags_purchase');
    }

    public function place()
    {
        return $this->belongsTo(Place::class);
    }
}
