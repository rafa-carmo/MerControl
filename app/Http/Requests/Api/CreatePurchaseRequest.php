<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class CreatePurchaseRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'date' => ['required', 'date'],
            'place' => ['required', 'string', 'max:255'],
            'total_tax' => ['sometimes', 'numeric', 'min:0'],
            'total_discount' => ['sometimes', 'numeric', 'min:0'],
            'cnpj' => ['sometimes', 'string', 'max:255'],
            'key' => ['sometimes', 'string', 'max:255', 'unique:purchases,key'],
            'products' => ['required', 'array', 'min:1'],
            'products.*.name' => ['required', 'string', 'max:255'],
            'products.*.description' => ['nullable', 'string', 'max:255'],
            'products.*.quantity' => ['required', 'numeric', 'min:0.01'],
            'products.*.unit' => ['required', 'string', 'max:255'],
            'products.*.unit_price' => ['required', 'numeric', 'min:0'],
            'products.*.total_price' => ['required', 'numeric', 'min:0'],
            'tags' => ['sometimes', 'array'],
            'tags.*' => ['string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'key.unique' => __('validation.key_unique'),
        ];
    }
}
