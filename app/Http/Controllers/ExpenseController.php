<?php

namespace App\Http\Controllers;

use App\Models\CreditCard;
use App\Models\CreditCardBill;
use App\Models\Expense;
use App\Models\ExpenseType;
use App\Models\FinancialFlow;
use App\Models\FinancialLaunch;
use App\Models\PaymentInstallment;
use App\Models\PaymentMethod;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class ExpenseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, FinancialFlow $financialFlow, FinancialLaunch $financialLaunch)
    {
        $perPage = $request->input('perPage', 20);

        $paymentMethods = PaymentMethod::orderBy('name')->get();
        $expenseTypes = ExpenseType::orderBy('name')->get();

        $query = Expense::query();
        if ($financialLaunch) {
            $query->where('financial_launch_id', $financialLaunch->id);
        }
         if ($request->filled('description')) {
            $query->where('description', 'like', "%{$request->input('description')}%");
        }
        if ($request->filled('payment_method_id') && strtolower((string) $request->input('payment_method_id')) !== 'todos') {
            $query->where('payment_method_id', $request->input('payment_method_id'));
        }
         if ($request->filled('expense_type_id') && strtolower((string) $request->input('expense_type_id')) !== 'todos') {
            $query->where('expense_type_id', $request->input('expense_type_id'));
        }

   

        $expenses = $query->with(['expenseType', 'paymentMethod'])->orderBy('id', 'desc')
            ->paginate($perPage)
            ->withQueryString();

            // dd($expenses->toArray());

        return inertia('Expenses/Index', [
            'expenses' => $expenses,
            'financial_launch_id' => $financialLaunch ? $financialLaunch->id : null,
            'financial_flow_id' => $financialFlow ? $financialFlow->id : null,
            'filters' => $request->only(['description', 'payment_method_id']),
            'paymentMethods' => $paymentMethods,
            'expenseTypes' => $expenseTypes,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request, FinancialFlow $financialFlow, FinancialLaunch $financialLaunch)
    {
        $expenseTypes = ExpenseType::orderBy('name')->get();
        $paymentMethods = PaymentMethod::orderBy('name')->get();
        $creditCards = CreditCard::orderBy('name')->get();
        return inertia('Expenses/Create', [
            'expense_types' => $expenseTypes,
            'pay_methods' => $paymentMethods,
            'credit_cards' => $creditCards,
            'financial_launch_id' => $financialLaunch->id,
            'financial_flow_id' => $financialFlow->id,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, FinancialFlow $financialFlow, FinancialLaunch $financialLaunch)
    {
        $request->validate([
            'expenseType' => 'required|exists:expense_types,id',
            'value' => 'required|numeric',
            'description' => 'nullable|string',
            'paymentMethod' => 'required|exists:payment_methods,id',
            'date_expense' => 'required|date',
            'credit_card_id' => 'nullable|exists:credit_cards,id',
            'installments_quantity' => 'nullable|integer|min:1',
        ]);

        $paymentMethod = PaymentMethod::find($request->paymentMethod);
        $isCreditCard = $paymentMethod && $paymentMethod->name === 'Cartão de Crédito';

        if ($isCreditCard) {
            $request->validate([
                'credit_card_id' => 'required|exists:credit_cards,id',
                'installments_quantity' => 'required|integer|min:1',
            ]);
        }

        $data = $request->only(['value', 'description', 'payment_method_id', 'date_expense']);
        $data['financial_launch_id'] = $financialLaunch->id;
        $data['expense_type_id'] = $request->expenseType;
        $data['payment_method_id'] = $request->paymentMethod;

        $expense = Expense::create($data);

        if ($isCreditCard) {
            $creditCard = CreditCard::findOrFail($request->credit_card_id);
            $this->createCreditCardInstallments($expense, $creditCard, $data['date_expense'], $request->installments_quantity);
        }

        return redirect()->route('expenses.index', ['financial_flow' => $financialFlow->id, 'financial_launch' => $financialLaunch->id])->with('success', trans('Expense created successfully.'));
    }

    private function createCreditCardInstallments(Expense $expense, CreditCard $creditCard, string $dateExpense, int $installmentsQuantity): void
    {
        $expenseDate = Carbon::parse($dateExpense);
        $valuePerInstallment = round($expense->value / $installmentsQuantity, 2);
        $remaining = $expense->value - ($valuePerInstallment * $installmentsQuantity);
        $affectedMonths = [];

        if ($expense->date_expense >= $creditCard->invoice_closing_date) {
            // code...
        
        for ($i = 1; $i <= $installmentsQuantity; $i++) {
            $billDate = $expenseDate->copy()->addDays(30 * $i);

            $bill = CreditCardBill::create([
                'credit_card_id' => $creditCard->id,
                'reference_date' => $billDate->toDateString(),
            ]);

            $installmentValue = $valuePerInstallment;
            if ($i === $installmentsQuantity) {
                $installmentValue += $remaining;
            }

            PaymentInstallment::create([
                'expense_id' => $expense->id,
                'installment_number' => $i,
                'installment_value' => $installmentValue,
                'credit_card_bill_id' => $bill->id,
            ]);

            // collect affected month (YYYY-MM-01) to recalculate launches later
            $monthKey = $billDate->copy()->startOfMonth()->toDateString();
            $affectedMonths[$monthKey] = $monthKey;
        }
        } else {
            // if expense date is before closing date, first installment goes to current month bill, others to next months
        
            for ($i = 1; $i <= $installmentsQuantity; $i++) {
                for ($i = 1; $i <= $installmentsQuantity; $i++) {
            $billDate = $expenseDate->copy()->addDays(1 * $i);

            $bill = CreditCardBill::create([
                'credit_card_id' => $creditCard->id,
                'reference_date' => $billDate->toDateString(),
            ]);

            $installmentValue = $valuePerInstallment;
            if ($i === $installmentsQuantity) {
                $installmentValue += $remaining;
            }

            PaymentInstallment::create([
                'expense_id' => $expense->id,
                'installment_number' => $i,
                'installment_value' => $installmentValue,
                'credit_card_bill_id' => $bill->id,
            ]);

            // collect affected month (YYYY-MM-01) to recalculate launches later
            $monthKey = $billDate->copy()->startOfMonth()->toDateString();
            $affectedMonths[$monthKey] = $monthKey;
            }
            }
        }

        // trigger recalculation for each affected FinancialLaunch (if exists)
        try {
            $flowId = null;
            if ($expense->financial_launch_id) {
                $launch = FinancialLaunch::find($expense->financial_launch_id);
                if ($launch) $flowId = $launch->financial_flow_id;
            }

            if ($flowId) {
                foreach ($affectedMonths as $monthKey) {
                    $targetLaunch = FinancialLaunch::where('financial_flow_id', $flowId)
                        ->where('month', $monthKey)
                        ->first();

                    if ($targetLaunch) {
                        $targetLaunch->recalculateNetWorthAndCascade();
                    }
                }
            }
        } catch (\Throwable $e) {
            // don't break the main flow if recalculation fails; log if needed
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Expense $expense)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(FinancialFlow $financialFlow, FinancialLaunch $financialLaunch, Expense $expense)
    {
        $expenseTypes = ExpenseType::orderBy('name')->get();
        $paymentMethods = PaymentMethod::orderBy('name')->get();
        $creditCards = CreditCard::orderBy('name')->get();

        return inertia('Expenses/Edit', [
            'expense' => $expense->load(['expenseType', 'paymentMethod']),
            'expense_types' => $expenseTypes,
            'payment_methods' => $paymentMethods,
            'credit_cards' => $creditCards,
            'financial_launch_id' => $financialLaunch->id,
            'financial_flow_id' => $financialFlow->id,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, FinancialFlow $financialFlow, FinancialLaunch $financialLaunch, Expense $expense)
    {
        $request->validate([
            'expense_type_id' => 'required|exists:expense_types,id',
            'value' => 'required|numeric',
            'description' => 'nullable|string',
            'payment_method_id' => 'required|exists:payment_methods,id',
            'date_expense' => 'required|date',
            'credit_card_id' => 'nullable|exists:credit_cards,id',
            'installments_quantity' => 'nullable|integer|min:1',
        ]);

        $paymentMethod = PaymentMethod::find($request->payment_method_id);
        $isCreditCard = $paymentMethod && $paymentMethod->name === 'Cartão de Crédito';

        if ($isCreditCard) {
            $request->validate([
                'credit_card_id' => 'required|exists:credit_cards,id',
                'installments_quantity' => 'required|integer|min:1',
            ]);

        }

        $data = $request->only(['expense_type_id', 'value', 'description', 'payment_method_id', 'date_expense']);

        // Se for cartão de crédito, atualizar parcelas e faturas
        if ($isCreditCard) {
            // Deletar parcelas e faturas antigas
            $oldInstallments = PaymentInstallment::where('expense_id', $expense->id)->get();
            $billIds = $oldInstallments->pluck('credit_card_bill_id')->unique();
            
            PaymentInstallment::where('expense_id', $expense->id)->delete();
            CreditCardBill::whereIn('id', $billIds)->delete();

            // Criar novas parcelas e faturas
            $creditCard = CreditCard::findOrFail($request->credit_card_id);
            $this->createCreditCardInstallments($expense, $creditCard, $data['date_expense'], $request->installments_quantity);
        } else {
            // Se não é cartão de crédito, deletar parcelas e faturas existentes
            $oldInstallments = PaymentInstallment::where('expense_id', $expense->id)->get();
            $billIds = $oldInstallments->pluck('credit_card_bill_id')->unique();
            
            PaymentInstallment::where('expense_id', $expense->id)->delete();
            CreditCardBill::whereIn('id', $billIds)->delete();
        }

        $expense->update($data);

        return redirect()->route('expenses.index', ['financial_flow' => $financialFlow->id, 'financial_launch' => $financialLaunch->id])->with('success', trans('Expense updated successfully.'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, FinancialFlow $financialFlow, FinancialLaunch $financialLaunch, Expense $expense)
    {
        try {
            // Deletar parcelas associadas
            $installments = PaymentInstallment::where('expense_id', $expense->id)->get();
            $billIds = $installments->pluck('credit_card_bill_id')->unique();

            PaymentInstallment::where('expense_id', $expense->id)->delete();
            CreditCardBill::whereIn('id', $billIds)->delete();

            // Deletar a despesa
            $expense->delete();

            $message = trans('Expense deleted successfully.');
            if ($request->wantsJson()) {
                return response()->json(['message' => $message], 200);
            }

            return to_route('expenses.index', ['financial_flow' => $financialFlow->id, 'financial_launch' => $financialLaunch->id])->with('success', $message);
        } catch (\Throwable $e) {
            $msg = $e->getMessage() ?: trans('Delete failed.');
            if ($request->wantsJson()) {
                return response()->json(['message' => $msg], 500);
            }
            return redirect()->back()->with('error', $msg);
        }
    }
}
