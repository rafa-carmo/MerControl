<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FinancialLaunch extends Model
{
    protected $table = 'financial_launches';
    protected $fillable = [
         'month',
         'financial_flow_id',
    ];
    
     public function financialFlow()
     {
            return $this->belongsTo(FinancialFlow::class, 'financial_flow_id');
     }
}
