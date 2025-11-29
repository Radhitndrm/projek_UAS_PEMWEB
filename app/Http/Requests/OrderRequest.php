<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OrderRequest extends FormRequest
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
        $method = $this->method();

        if ($method === 'POST')
            $purchaseCodeRules = 'required|string|max:255|unique:orders';
        elseif ($method === 'PUT')
            $purchaseCodeRules = 'required|string|max:255|unique:orders,order_code,' . $this->order->id;

        return [
            'order_code' => $purchaseCodeRules,
            'supplier_id' => 'required',
            'order_date' => 'required',
            'items' => 'required|array|min:1',
            'items.*.product' => 'required',
            'items.*.product_unit' => 'required',
            'items.*.quantity' => 'required|min:1',
            'items.*.price' => 'required|min:1',
        ];
    }

    public function messages(): array
    {
        return [
            'order_code.required' => 'Kolom kode pembelian tidak boleh kosong',
            'order_code.string' => 'Kolom kode pembelian harus berupa string',
            'order_code.max' => 'Kolom kode pembelian maksimal 255 karakter',
            'order_code.unique' => 'Kode pembelian sudah digunakan',
            'supplier_id.required' => 'Kolom supplier tidak boleh kosong',
            'order_date.required' => 'Kolom tanggal pembelian tidak boleh kosong',
            'items.required' => 'Kolom produk tidak boleh kosong',
            'items.array' => 'Kolom produk harus berupa array',
            'items.min' => 'Kolom produk harus memiliki setidaknya satu item',
            'items.*.product.required' => 'Kolom produk tidak boleh kosong',
            'items.*.product_unit.required' => 'Kolom variant produk tidak boleh kosong',
            'items.*.quantity.required' => 'Kolom jumlah produk tidak boleh kosong',
            'items.*.quantity.min' => 'Kolom jumlah produk harus lebih besar dari 0',
            'items.*.price.required' => 'Kolom harga produk tidak boleh kosong',
            'items.*.price.min' => 'Kolom harga produk harus lebih besar dari 0',
        ];
    }
}
