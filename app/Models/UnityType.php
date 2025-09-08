<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/** @typescript */
class UnityType extends Model
{
    public string $name;
    public string $abbreviation;
    public string $type;
    public string $created_at;
    public string $updated_at;

    protected $fillable = ['name', 'abbreviation', 'type'];
}
