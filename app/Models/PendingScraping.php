<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/** @typescript */
class PendingScraping extends Model
{
    public string $url;
    public string $key;
    public bool $processed;

    protected $fillable = ['url', 'key', 'processed'];

    public function setProcessedAttribute()
    {
        $this->attributes['processed'] = false;
    }
    public function scopeUnprocessed($query)
    {
        return $query->where('processed', false);
    }
}
