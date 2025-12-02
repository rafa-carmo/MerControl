<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Revenue extends Model
{
    protected $table = 'revenues';
    protected $fillable = [
        'financial_launch_id',
        'revenue_type_id',
        'payment_method_id',
        'value',
        'description',
    ];
    public function financialLaunch()
    {
        return $this->belongsTo(FinancialLaunch::class, 'financial_launch_id');
    }
    public function revenueType()
    {
        return $this->belongsTo(RevenueType::class, 'revenue_type_id');
    }
    public function paymentMethod()
    {
        return $this->belongsTo(PaymentMethod::class, 'payment_method_id');
    }
}
