<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PendingScraping extends Model
{
    protected $fillable = ['url', 'key', 'processed'];
}
