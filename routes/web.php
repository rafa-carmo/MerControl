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


    // Start Purchases Routes
    Route::resource('purchases', \App\Http\Controllers\PurchaseController::class);
    Route::post('tags/create/fetch', [\App\Http\Controllers\TagController::class, 'fetch_create'])->name('tags.create.fetch');
    Route::post('schedule-scraping', [\App\Http\Controllers\PurchaseController::class, 'scheduleScraping'])->name('schedule-scraping');
    // End Purchases Routes

    // Start Places Routes
    Route::resource('places', \App\Http\Controllers\PlaceController::class);
    // End Places Routes

    Route::post('/tokens/create', [\App\Http\Controllers\Auth\RegisteredUserController::class, 'generateToken'])->name('tokens.create');
    Route::delete('/tokens/{tokenId}', [\App\Http\Controllers\Auth\RegisteredUserController::class, 'revokeToken'])->name('tokens.revoke');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
