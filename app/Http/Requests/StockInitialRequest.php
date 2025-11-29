<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StockInitialRequest extends FormRequest
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
            'product' => 'required',
            'quantity' => 'required|min:1',
            'price' => 'required|min:1',
            'product_unit' => 'required',
        ];
    }

    public function messages(): array
    {
        return [
            'product.required' => 'Kolom produk tidak boleh kosong',
            'quantity.required' => 'Kolom jumlah stok tidak boleh kosong',
            'quantity.min' => 'Jumlah stok minimal adalah 1',
            'price.required' => 'Kolom harga beli produk tidak boleh kosong',
            'price.min' => 'Kolom harga beli produk minimal adalah 1',
            'product_unit.required' => 'Kolom satuan produk tidak boleh kosong'
        ];
    }
}