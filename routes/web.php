<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::get('pending-scraping', [\App\Http\Controllers\PurchaseController::class, 'pendingScraping'])->name('pending-scraping');


    // Start Purchases Routes
    Route::resource('purchases', \App\Http\Controllers\PurchaseController::class);
    Route::post('tags/create/fetch', [\App\Http\Controllers\TagController::class, 'fetch_create'])->name('tags.create.fetch');
    Route::post('schedule-scraping', [\App\Http\Controllers\PurchaseController::class, 'scheduleScraping'])->name('schedule-scraping');
    // End Purchases Routes

    // Start Places Routes
    Route::resource('places', \App\Http\Controllers\PlaceController::class);
    // End Places Routes

    // Start Products Routes
    Route::resource('products', \App\Http\Controllers\ProductController::class);
    // End Products Routes

    // Start Financial Flows Routes
    Route::resource('financial-flows', \App\Http\Controllers\FinancialFlowController::class);
    Route::resource('financial-launches', \App\Http\Controllers\FinancialLaunchController::class);
    Route::resource('expenses', \App\Http\Controllers\ExpenseController::class);
    Route::resource('revenues', \App\Http\Controllers\RevenueController::class);
    Route::resource('expense-types', \App\Http\Controllers\ExpenseTypeController::class);
    Route::resource('revenue-types', \App\Http\Controllers\RevenueTypeController::class);
    Route::resource('payment-methods', \App\Http\Controllers\PaymentMethodController::class);

    Route::post('/tokens/create', [\App\Http\Controllers\Auth\RegisteredUserController::class, 'generateToken'])->name('tokens.create');
    Route::delete('/tokens/{tokenId}', [\App\Http\Controllers\Auth\RegisteredUserController::class, 'revokeToken'])->name('tokens.revoke');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
