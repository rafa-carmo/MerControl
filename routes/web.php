<?php

use Illuminate\Http\Request;
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

    Route::post('tags/create/fetch', [\App\Http\Controllers\TagController::class, 'fetch_create'])->name('tags.create.fetch');

    Route::get('/tokens/create', function (Request $request) {
        $token =  $request->user()->createToken("api");
        return 'Token created - ' . $token->plainTextToken;

    })->name('tokens.create');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
