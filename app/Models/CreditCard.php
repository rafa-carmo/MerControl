<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CreditCard extends Model
{
    protected $table = 'credit_cards';

    // cartão de crédito
    protected $fillable = [
        'name',
        'expiration_date',
        'invoice_closing_date',
    ];

    public function bills()
    {
        return $this->hasMany(CreditCardBill::class, 'credit_card_id');
    }

    public function installmentDate(string $purchaseDate, int $installmentNumber): \Illuminate\Support\Carbon
    {
        $purchase = \Illuminate\Support\Carbon::parse($purchaseDate);
        $dueDay = \Illuminate\Support\Carbon::parse($this->expiration_date)->day;
        $month = $purchase->copy()->startOfMonth()->addMonthsNoOverflow(
            ($purchase->day > $dueDay ? 1 : 0) + $installmentNumber - 1
        );

        return $month->day(min($dueDay, $month->daysInMonth));
    }
}
