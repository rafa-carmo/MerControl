<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/** @typescript */
class UnityType extends Model
{
    public string $name;
    public string $abbreviation;
    public string $type;

    protected $fillable = ['name', 'abbreviation', 'type'];
}
