<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PurchaseResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'local' => new PlaceResource($this->whenLoaded('place')),
            'taxes' => $this->total_tax,
            'quantity' => $this->whenLoaded('products') ? $this->products->count() : 0,
            'total' => $this->whenLoaded('products') ? $this->products->sum(function ($item) {
                return $item->total_price - $item->discount;
            }) : 0,
        ];
    }
}
