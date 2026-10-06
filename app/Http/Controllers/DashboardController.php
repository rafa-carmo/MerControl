<?php

namespace App\Http\Controllers;

use App\Models\CreditCardBill;
use App\Models\Expense;
use App\Models\FinancialFlow;
use App\Models\FinancialLaunch;
use App\Models\PaymentInstallment;
use App\Models\Revenue;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'month' => ['nullable', 'integer', 'between:1,12'],
            'year' => ['nullable', 'integer', 'between:1900,9999'],
        ]);
        $year = (int) ($filters['year'] ?? now()->year);
        $month = (int) ($filters['month'] ?? now()->month);
        $start = Carbon::create($year, 1, 1)->startOfDay();
        $selected = Carbon::create($year, $month, 1)->startOfDay();
        $expenses = Expense::with(['expenseType:id,name', 'paymentMethod:id,name'])
            ->whereDoesntHave('paymentInstallments')
            ->whereBetween('date_expense', [$start->toDateString(), $start->copy()->endOfYear()->toDateString()])->get();
        // Use the persisted bill date, as the financial launch totals do.
        // A purchase from a previous month or year can belong to this year's bills.
        $installments = PaymentInstallment::with(['expense.expenseType:id,name', 'expense.paymentMethod:id,name', 'creditCardBill'])
            ->whereHas('expense')
            ->whereHas('creditCardBill', fn ($query) => $query->whereBetween('reference_date', [
                $start->toDateString(), $start->copy()->endOfYear()->toDateString(),
            ]))
            ->get();
        foreach ($installments as $installment) {
            $expense = clone $installment->expense;
            $expense->date_expense = Carbon::parse($installment->creditCardBill->reference_date)->toDateString();
            $expense->value = $installment->installment_value;
            $expenses->push($expense);
        }
        $revenues = Revenue::with('financialLaunch:id,month')->whereHas('financialLaunch', fn ($query) => $query->whereBetween('month', [$start->toDateString(), $start->copy()->endOfYear()->toDateString()]))->get();
        // Sum integer cents to keep all groupings consistent.
        $cents = fn ($value) => (int) round((float) $value * 100);
        $monthly = collect(range(1, 12))->map(fn ($number) => [
            'month' => $number,
            'expenses' => $expenses->filter(fn ($expense) => Carbon::parse($expense->date_expense)->month === $number)
                ->sum(fn ($expense) => $cents($expense->value)) / 100,
            'revenues' => $revenues->filter(fn ($revenue) => Carbon::parse($revenue->financialLaunch->month)->month === $number)
                ->sum(fn ($revenue) => $cents($revenue->value)) / 100,
        ]);
        $monthExpenses = $expenses->filter(fn ($expense) => Carbon::parse($expense->date_expense)->month === $month);
        $byDate = $monthExpenses->groupBy(fn ($expense) => Carbon::parse($expense->date_expense)->toDateString());
        $daily = collect(range(1, $selected->daysInMonth))->map(function ($day) use ($selected, $byDate, $cents) {
            $date = $selected->copy()->day($day);

            return [
                'date' => $date->toDateString(),
                'label' => $date->format('d/m'),
                'value' => $byDate->get($date->toDateString(), collect())->sum(fn ($expense) => $cents($expense->value)) / 100,
            ];
        });
        $weekly = $daily->groupBy(fn ($day) => Carbon::parse($day['date'])->startOfWeek(Carbon::MONDAY)->toDateString())
            ->map(fn ($days) => [
                'label' => $days->first()['label'].' – '.$days->last()['label'],
                'value' => $days->sum(fn ($day) => $cents($day['value'])) / 100,
            ])->values();
        $group = fn ($relation, $foreignKey) => $monthExpenses->groupBy($foreignKey)->map(fn ($items) => [
            'label' => $items->first()->{$relation}?->name ?? 'Sem classificação',
            'value' => $items->sum(fn ($expense) => $cents($expense->value)) / 100,
        ])->sortByDesc('value')->values();
        $totals = $monthly->firstWhere('month', $month);
        $years = FinancialFlow::pluck('year')->merge(FinancialLaunch::pluck('month')->map(fn ($date) => Carbon::parse($date)->year))
            ->merge(CreditCardBill::pluck('reference_date')->filter()->map(fn ($date) => Carbon::parse($date)->year))
            ->merge(Expense::select('date_expense')->distinct()->pluck('date_expense')->filter()->map(fn ($date) => Carbon::parse($date)->year))
            ->push(now()->year, $year)->map(fn ($value) => (int) $value)->unique()->sortDesc()->values();

        return Inertia::render('dashboard', [
            'filters' => compact('month', 'year'),
            'years' => $years,
            'summary' => [
                'expenses' => $totals['expenses'],
                'revenues' => $totals['revenues'],
                'balance' => round($totals['revenues'] - $totals['expenses'], 2),
                'dailyAverage' => round($totals['expenses'] / $selected->daysInMonth, 2),
            ],
            'daily' => $daily,
            'weekly' => $weekly,
            'monthly' => $monthly,
            'byExpenseType' => $group('expenseType', 'expense_type_id'),
            'byPaymentMethod' => $group('paymentMethod', 'payment_method_id'),
        ]);
    }
}
