<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

/** @typescript */
class Tag extends Model
{
    public string $name;
    public string $slug;
    public string $created_at;
    public string $updated_at;

    protected $fillable = ['name', 'slug'];


    public function setNameAttribute($value)
    {
        $this->attributes['name'] = $value;
        $this->attributes['slug'] = Str::slug($value);
        $this->attributes['created_at'] = now();
        $this->attributes['updated_at'] = now();
    }

    public function purchases()
    {
        return $this->hasMany(Purchase::class);
    }
}
