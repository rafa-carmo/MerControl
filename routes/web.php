<?php

use GuzzleHttp\Client;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');


    // Purchases
    Route::resource('purchases', \App\Http\Controllers\PurchaseController::class);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
