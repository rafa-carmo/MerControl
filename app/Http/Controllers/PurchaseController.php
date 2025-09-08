<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreatePurchaseRequest;
use App\Models\Product;
use App\Models\Purchase;
use App\Models\PurchaseProduct;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class PurchaseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $purchases = Purchase::with(['products.product', 'place', 'tags'])->get();
        return inertia('Purchases/Index', [
            'purchases' => $purchases,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $tags = \App\Models\Tag::all();
        $places = \App\Models\Place::all();
        $unityTypes = \App\Models\UnityType::all();



        return inertia('Purchases/Create', compact('tags', 'places', 'unityTypes'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreatePurchaseRequest $request)
    {
        $validated = $request->validated();
        // dd($validated);

        DB::beginTransaction();
        try {
            $purchase = Purchase::create([
                'date' => Carbon::create($validated['date'])->format('Y-m-d'),
                'place_id' => $validated['place'],
            ]);

            $purchase->tags()->attach($validated['tag']);
            foreach ($validated['items'] as $item) {
                $product = Product::where('slug', Str::slug($item['name']))->firstOrCreate([
                    'name' => $item['name'],
                    'unity_type_id' => $item['unity'],
                ]);

                PurchaseProduct::create([
                    'purchase_id' => $purchase->id,
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'unity_price' => $item['price'],
                    'total_price' => $item['quantity'] * $item['price'],
                ]);

            }
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error fetching data for purchase creation: ' . $e->getMessage());
            return redirect()->back()->withErrors(__('An error occurred while preparing the purchase creation form.'));
        }

    }

    /**
     * Display the specified resource.
     */
    public function show(Purchase $purchase)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Purchase $purchase)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Purchase $purchase)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Purchase $purchase)
    {
        //
    }


    public function scheduleScraping(Request $request)
    {
        $request->validate([
            'url' => 'required|string',
            'key' => 'nullable|string',
        ]);

        try {
            \App\Models\PendingScraping::create([
                'url' => $request->input('url'),
                'key' => $request->input('key'),
            ]);

            return response()->json(['message' => 'Scraping scheduled successfully.'], 200);
        } catch (\Exception $e) {
            Log::error('Error scheduling scraping: ' . $e->getMessage());
            return response()->json(['error' => 'An error occurred while scheduling the scraping.'], 500);
        }
    }
}
