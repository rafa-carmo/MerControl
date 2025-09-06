<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/** @typescript */
class Place extends Model
{
    public string $id;
    public string $name;
    public string $slug;
    public string $created_at;
    public string $updated_at;

    protected $fillable = ['name', 'slug'];

    public function purchases()
    {
        return $this->hasMany(Purchase::class);
    }
}
