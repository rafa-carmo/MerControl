<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\CreatePurchaseRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PurchasesApiController extends Controller
{
    public function store(CreatePurchaseRequest $request)
    {
        $validated = $request->validated();
        DB::beginTransaction();
        try {
            $place = \App\Models\Place::where(['name' => $validated['place'], 'slug' => Str::slug($validated['place'])])->firstOrCreate([
                'name' => $validated['place'],
            ]);
            $purchase = \App\Models\Purchase::create([
                'date' => $validated['date'],
                'place_id' => $place->id,
            ]);

            $tagIds = [];
            foreach ($validated['tags'] as $tagName) {
                $tag = \App\Models\Tag::where(['name' => $tagName, 'slug' => Str::slug($tagName)])->firstOrCreate([
                    'name' => $tagName,
                ]);
                $tagIds[] = $tag->id;
            }
            $purchase->tags()->sync($tagIds);

            foreach ($validated['products'] as $item) {

                $unityType = \App\Models\UnityType::where('abbreviation', $item['unit'])->first();

                $product = \App\Models\Product::where('slug', Str::slug($item['name']))->firstOrCreate([
                    'name' => $item['name'],
                    'unity_type_id' => $unityType->id,
                ]);

                \App\Models\PurchaseProduct::create([
                    'purchase_id' => $purchase->id,
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'unity_price' => $item['unit_price'],
                    'total_price' => $item['total_price'],
                ]);
            }
            DB::commit();
            return response()->json(['message' => 'Store purchase'], 201, [
                'Location' => route('purchases.show', ['purchase' => $purchase->id]),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
