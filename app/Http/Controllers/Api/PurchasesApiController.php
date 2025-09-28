<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\CreatePurchaseRequest;
use App\Http\Resources\PurchaseResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PurchasesApiController extends Controller
{
    public function index(Request $request)
    {
        $purchases = \App\Models\Purchase::query()->with(['place', 'products']);

        return response()->json(PurchaseResource::collection($purchases->get()));

    }
    public function store(CreatePurchaseRequest $request)
    {
        $validated = $request->validated();
        DB::beginTransaction();
        try {
            $place = \App\Models\Place::where(['cnpj' => $validated['cnpj']])->orWhere(['slug' => Str::slug($validated['place'])])->firstOrCreate([
                'cnpj' => $validated['cnpj'] ?? null,
                'business_name' => $validated['place'],
                'name' => $validated['place'],
            ]);

            if (\App\Models\Purchase::where(['key' => $validated['key']])->first()) {
                \App\Models\PendingScraping::where('key', $validated['key'])->update(['processed' => true]);
                DB::commit();
                return response()->json(['message' => 'This purchase key already exists.'], 200);
            }

            $purchase = \App\Models\Purchase::create([
                'key' => $validated['key'] ?? null,
                'date' => $validated['date'],
                'total_tax' => $validated['total_tax'] ?? 0,
                'total_discount' => $validated['total_discount'] ?? 0,
                'place_id' => $place->id,
            ]);
            $tagIds = [];
            foreach ($validated['tags'] as $tagName) {
                $tag = \App\Models\Tag::where(['name' => $tagName, 'slug' => Str::slug($tagName)])->first();
                if (!$tag) {
                    $tag = \App\Models\Tag::create([
                        'name' => $tagName,
                        'slug' => Str::slug($tagName),
                    ]);
                }
                $tagIds[] = $tag->id;
            }
            $purchase->tags()->sync($tagIds);

            foreach ($validated['products'] as $item) {
                $unityType = \App\Models\UnityType::where('abbreviation', $item['unit'])->first();
                if (!$unityType) {
                    $unityType = \App\Models\UnityType::create([
                        'name' => $item['unit'],
                        'abbreviation' => $item['unit'],
                        'type' => 'unit',
                    ]);
                }


                $product = \App\Models\Product::where('slug', Str::slug($item['name']))->first();
                if (!$product) {
                    $product = \App\Models\Product::create([
                        'name' => $item['name'],
                        'unity_type_id' => $unityType->id,
                    ]);
                }

                \App\Models\PurchaseProduct::create([
                    'purchase_id' => $purchase->id,
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'unity_price' => $item['unit_price'],
                    'total_price' => $item['total_price'],
                ]);

                \App\Models\PendingScraping::where('key', $validated['key'] ?? null)->update(['processed' => true]);
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
