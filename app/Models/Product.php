<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

/** @typescript */
class Product extends Model
{
    public string $barcode;
    public string $name;
    public string $slug;
    public PurchaseProduct $purchases;

    protected $fillable = [
        'barcode',
        'name',
        'unity_type_id',
    ];

    public function setNameAttribute($value)
    {
        $this->attributes['name'] = $value;
        $this->attributes['slug'] = Str::slug($value);
        $this->attributes['created_at'] = now();
        $this->attributes['updated_at'] = now();
    }



    public function purchases()
    {
        return $this->hasMany(PurchaseProduct::class);
    }
}
