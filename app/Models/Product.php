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
    public UnityType $unity_type;

    protected $fillable = [
        'barcode',
        'name',
        'unity_type_id',
        'product_group_id',
    ];

    public function setNameAttribute($value)
    {
        $this->attributes['name'] = $value;
        $this->attributes['slug'] = Str::slug($value);
    }



    public function purchases()
    {
        return $this->hasMany(PurchaseProduct::class);
    }

    public function unityType()
    {
        return $this->belongsTo(UnityType::class);
    }
}
