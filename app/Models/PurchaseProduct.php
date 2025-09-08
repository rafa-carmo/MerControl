<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/** @typescript */
class PurchaseProduct extends Model
{
    public int $quantity;
    public string $unity_price;
    public string $total_price;
    public Purchase $purchase;
    public Product $product;

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
