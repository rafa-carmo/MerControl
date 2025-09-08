<?php

use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    // return response()->json([
    //     'message' => 'API is working',
    // ]);
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('v1')->group(function () {
    // Future API routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('purchases/store', [\App\Http\Controllers\Api\PurchasesApiController::class, 'store'])->name('api.purchases.store');
    });

});
