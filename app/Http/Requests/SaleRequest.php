<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SaleRequest extends FormRequest
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
            'sale_code' => 'required|string|max:255|unique:sales',
            'customer' => 'required',
            'sale_date' => 'required',
            'payment_method' => 'required',
            'items' => 'required|array|min:1',
            'items.*.product' => 'required',
            'items.*.product_unit' => 'required',
            'items.*.quantity' => 'required|numeric|min:1',
            'items.*.price' => 'required|numeric|min:1',
        ];
    }


    public function messages(): array
    {
        return [
            'sale_code.required' => 'Kolom nomor invoice tidak boleh kosong',
            'sale_code.string' => 'Kolom nomor invoice harus berupa string',
            'sale_code.max' => 'Kolom nomor invoice maksimal 255 karakter',
            'sale_code.unique' => 'nomor invoice sudah digunakan',
            'customer.required' => 'Kolom pelanggan tidak boleh kosong',
            'sale_date.required' => 'Kolom tanggal penjualan tidak boleh kosong',
            'payment_method.required' => 'Kolom metode pembayaran tidak boleh kosong',
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