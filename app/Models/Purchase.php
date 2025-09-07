<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/** @typescript */
class Purchase extends Model
{
    public string $date;
    /** @var PurchaseProduct[] */
    public array $products;
    public Place $place;
    public Tag $tags;

    protected $fillable = [
        'date',
        'place_id',
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
