<?php

use App\Models\User;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('guests are redirected to the login page', function () {
    $this->get(route('dashboard'))->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    $this->actingAs($user = User::factory()->create());

    $this->get(route('dashboard'))->assertOk();
});
test('dashboard groups non-card expenses and revenues by launch month', function () {
    $this->actingAs(User::factory()->create());
    $db = \Illuminate\Support\Facades\DB::class;
    $flow = $db::table('financial_flows')->insertGetId(['year' => 2024]);
    $launch = $db::table('financial_launches')->insertGetId(['financial_flow_id' => $flow, 'month' => '2024-02-01']);
    $type = $db::table('expense_types')->insertGetId(['name' => 'Alimentação']);
    $payment = $db::table('payment_methods')->insertGetId(['name' => 'Pix']);
    $revenueType = $db::table('revenue_types')->insertGetId(['name' => 'Salário']);
    $db::table('revenues')->insert(['financial_launch_id' => $launch, 'revenue_type_id' => $revenueType, 'value' => 1000]);
    foreach ([['2024-02-01', 10.10], ['2024-02-04', 20.20], ['2024-02-05', 30.30], ['2024-02-29', 40.40], ['2024-03-01', 50], ['2023-02-01', 900]] as [$date, $value]) {
        $expenseLaunch = $launch;
        if (substr($date, 0, 7) !== '2024-02') {
            $expenseLaunch = $db::table('financial_launches')->insertGetId([
                'financial_flow_id' => $flow, 'month' => substr($date, 0, 7).'-01',
            ]);
        }
        $db::table('expenses')->insert([
            'financial_launch_id' => $expenseLaunch, 'expense_type_id' => $type,
            'payment_method_id' => $payment, 'date_expense' => $date, 'value' => $value,
        ]);
    }
    $this->get(route('dashboard', ['month' => 2, 'year' => 2024]))->assertOk()
        ->assertInertia(fn (\Inertia\Testing\AssertableInertia $page) => $page
            ->component('dashboard')->where('filters.month', 2)->where('filters.year', 2024)
            ->where('summary.expenses', 101)->where('summary.revenues', 1000)
            ->where('summary.balance', 899)->where('summary.dailyAverage', 3.48)
            ->has('daily', 29)->where('daily.28.value', 40.4)
            ->has('weekly', 5)->where('weekly.0.value', 30.3)->where('weekly.1.value', 30.3)
            ->has('monthly', 12)->where('monthly.2.expenses', 50)
            ->where('byExpenseType.0.label', 'Alimentação')->where('byExpenseType.0.value', 101)
            ->where('byPaymentMethod.0.value', 101));
});

test('dashboard returns complete zero series for an empty month', function () {
    $this->actingAs(User::factory()->create());
    $this->get(route('dashboard', ['month' => 2, 'year' => 2025]))
        ->assertInertia(fn (\Inertia\Testing\AssertableInertia $page) => $page
            ->component('dashboard')->where('summary.expenses', 0)->where('summary.revenues', 0)
            ->has('daily', 28)->has('monthly', 12)->has('byExpenseType', 0)->has('byPaymentMethod', 0));
});

test('dashboard rejects invalid periods', function () {
    $this->actingAs(User::factory()->create());
    $this->get(route('dashboard', ['month' => 13, 'year' => 0]))->assertSessionHasErrors(['month', 'year']);
});

test('card expenses follow registered bill dates across years', function () {
    $this->actingAs(User::factory()->create());
    $db = \Illuminate\Support\Facades\DB::class;
    $flow = $db::table('financial_flows')->insertGetId(['year' => 2024]);
    $launch = $db::table('financial_launches')->insertGetId(['financial_flow_id' => $flow, 'month' => '2024-12-01']);
    $type = $db::table('expense_types')->insertGetId(['name' => 'Compras']);
    $method = $db::table('payment_methods')->insertGetId(['name' => 'Cartão de Crédito']);
    foreach ([10, 20] as $dueDay) {
        $card = $db::table('credit_cards')->insertGetId(['name' => 'Cartão '.$dueDay, 'expiration_date' => '2024-01-'.$dueDay, 'invoice_closing_date' => '2024-01-05']);
        $expense = $db::table('expenses')->insertGetId(['financial_launch_id' => $launch, 'expense_type_id' => $type, 'payment_method_id' => $method, 'date_expense' => '2024-12-15', 'value' => 200]);
        foreach ([1, 2] as $number) {
            // The saved bill date determines the month, independently of the current card settings.
            $bill = $db::table('credit_card_bills')->insertGetId(['credit_card_id' => $card, 'reference_date' => (new \App\Models\CreditCard(['expiration_date' => '2024-01-'.$dueDay]))->installmentDate('2024-12-15', $number)->toDateString()]);
            $db::table('payment_installments')->insert(['expense_id' => $expense, 'credit_card_bill_id' => $bill, 'installment_number' => $number, 'installment_value' => 100]);
        }
    }
    $this->get(route('dashboard', ['month' => 12, 'year' => 2024]))
        ->assertInertia(fn (\Inertia\Testing\AssertableInertia $page) => $page
            ->where('summary.expenses', 100)->where('daily.19.value', 100));
    $this->get(route('dashboard', ['month' => 1, 'year' => 2025]))
        ->assertInertia(fn (\Inertia\Testing\AssertableInertia $page) => $page
            ->where('summary.expenses', 200)->where('daily.9.value', 100)->where('daily.19.value', 100)
            ->where('monthly.1.expenses', 100)->where('byExpenseType.0.value', 200)
            ->where('byPaymentMethod.0.value', 200));
});

test('card due dates clamp to the last day of short months and keep the due day in the current month', function () {
    $card = new \App\Models\CreditCard(['expiration_date' => '2024-01-31']);
    expect($card->installmentDate('2024-01-31', 1)->toDateString())->toBe('2024-01-31');
    expect($card->installmentDate('2024-01-31', 2)->toDateString())->toBe('2024-02-29');
    expect($card->installmentDate('2025-01-31', 2)->toDateString())->toBe('2025-02-28');
});

test('july includes a june credit purchase billed in july and agrees with financial launches', function () {
    $this->actingAs(User::factory()->create());
    $db = \Illuminate\Support\Facades\DB::class;
    $flow = $db::table('financial_flows')->insertGetId(['year' => 2026]);
    $june = $db::table('financial_launches')->insertGetId(['financial_flow_id' => $flow, 'month' => '2026-06-01']);
    $july = $db::table('financial_launches')->insertGetId(['financial_flow_id' => $flow, 'month' => '2026-07-01']);
    $type = $db::table('expense_types')->insertGetId(['name' => 'Compras']);
    $credit = $db::table('payment_methods')->insertGetId(['name' => 'Cartão de Crédito']);
    $cash = $db::table('payment_methods')->insertGetId(['name' => 'Pix']);
    // Current due day would incorrectly move this purchase into June if recomputed.
    $card = $db::table('credit_cards')->insertGetId(['name' => 'Cartão', 'expiration_date' => '2026-06-23', 'invoice_closing_date' => '2026-06-10']);
    $expense = $db::table('expenses')->insertGetId(['financial_launch_id' => $june, 'expense_type_id' => $type, 'payment_method_id' => $credit, 'date_expense' => '2026-06-15', 'value' => 100]);
    $bill = $db::table('credit_card_bills')->insertGetId(['credit_card_id' => $card, 'reference_date' => '2026-07-23']);
    $db::table('payment_installments')->insert(['expense_id' => $expense, 'credit_card_bill_id' => $bill, 'installment_number' => 1, 'installment_value' => 100]);
    // The launch month takes precedence over the purchase date for non-card expenses.
    $db::table('expenses')->insert(['financial_launch_id' => $july, 'expense_type_id' => $type, 'payment_method_id' => $cash, 'date_expense' => '2025-06-23', 'value' => 100]);
    // A credit purchase without installments must not count as a non-card expense.
    $db::table('expenses')->insert(['financial_launch_id' => $july, 'expense_type_id' => $type, 'payment_method_id' => $credit, 'date_expense' => '2026-07-23', 'value' => 500]);
    $this->get(route('dashboard', ['month' => 7, 'year' => 2026]))
        ->assertInertia(fn (\Inertia\Testing\AssertableInertia $page) => $page
            ->where('summary.expenses', 200)->where('summary.balance', -200)
            ->where('daily.22.value', 200)->where('weekly.3.value', 200)
            ->where('monthly.5.expenses', 0)->where('monthly.6.expenses', 200)
            ->where('byExpenseType.0.value', 200)
            ->where('byPaymentMethod', fn ($items) => collect($items)->sum('value') == 200));
    $this->get(route('financial-launches.index', ['financial_flow' => $flow]))
        ->assertInertia(fn (\Inertia\Testing\AssertableInertia $page) => $page
            ->where('financialLaunches.data.0.totalExpenses', 200));
});
