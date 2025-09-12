<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/** @typescript */
class Place extends Model
{
    public string $name;
    public string $slug;
    public ?string $cnpj;
    public ?string $business_name;
    public string $created_at;
    public string $updated_at;

    protected $fillable = ['name', 'cnpj', 'business_name', 'slug'];

    public function setNameAttribute($value)
    {
        $this->attributes['name'] = $value;
        $this->attributes['slug'] = \Illuminate\Support\Str::slug($value);
        $this->attributes['created_at'] = now();
        $this->attributes['updated_at'] = now();

    }

    public function purchases()
    {
        return $this->hasMany(Purchase::class);
    }
}
