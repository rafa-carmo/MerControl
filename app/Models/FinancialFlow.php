<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FinancialFlow extends Model
{
   protected $table = 'financial_flows';
   protected $fillable = [
       'year',
   ];

    /**
     * Cast attributes to proper types.
     */
    protected $casts = [
        'year' => 'date',
    ];

    public function financialLaunches()
    {
         return $this->hasMany(FinancialLaunch::class, 'financial_flow_id');
    }


}
