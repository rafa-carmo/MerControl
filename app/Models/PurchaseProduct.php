<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/** @typescript */
class PurchaseProduct extends Model
{
    protected $fillable = [
        'purchase_id',
        'product_id',
        'quantity',
        'unity_price',
        'total_price',
    ];

    public function purchase()
    {
        return $this->belongsTo(Purchase::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
