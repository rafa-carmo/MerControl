<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    protected $table = 'expenses';
    protected $fillable = [
        'financial_launch_id',
        'expense_type_id',
        'payment_method_id',
        'value',
        'description',
    ];
    public function financialLaunch()
    {
        return $this->belongsTo(FinancialLaunch::class, 'financial_launch_id');
    }
    public function expenseType()
    {
        return $this->belongsTo(ExpenseType::class, 'expense_type_id');
    }
    public function paymentMethod()
    {
        return $this->belongsTo(PaymentMethod::class, 'payment_method_id');
    }
    
}
