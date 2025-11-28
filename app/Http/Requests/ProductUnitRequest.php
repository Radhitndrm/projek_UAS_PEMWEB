<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductUnitRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $method = $this->method();

        if ($method === 'POST') {
            $validate = [
                'items' => ['required', 'array', 'min:1'],
                'items.*.barcode' => ['required', 'string', 'max:255'],
                'items.*.name' => ['required', 'string', 'max:255'],
                'items.*.unit' => ['required'],
                'items.*.price' => ['required', 'numeric', 'min:1'],
                'items.*.image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            ];
        } elseif ($method === 'PUT') {
            $validate = [
                'barcode' => ['required', 'string', 'max:255'],
                'name' => ['required', 'string', 'max:255'],
                'unit_id' => ['required'],
                'price' => ['required', 'numeric', 'min:1'],
                'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            ];
        }

        return $validate;
    }

    public function messages(): array
    {
        $method = $this->method();

        if ($method === 'POST') {
            $validate = [
                'items.required' => 'Kolom variant produk tidak boleh kosong',
                'items.array' => 'Kolom variant produk harus berupa array',
                'items.min' => 'Kolom variant produk harus memiliki setidaknya satu item',
                'items.*.barcode.required' => 'Kolom barcode produk tidak boleh kosong',
                'items.*.barcode.string' => 'Kolom barcode produk harus berupa string',
                'items.*.barcode.max' => 'Kolom barcode produk maksimal 255 karakter',
                'items.*.name.required' => 'Kolom nama variant produk tidak boleh kosong',
                'items.*.name.string' => 'Kolom nama variant produk harus berupa string',
                'items.*.name.max' => 'Kolom nama variant produk maksimal 255 karakter',
                'items.*.unit.required' => 'Kolom satuan produk tidak boleh kosong',
                'items.*.price.required' => 'Kolom harga produk tidak boleh kosong',
                'items.*.price.numeric' => 'Kolom harga produk harus berupa angka',
                'items.*.price.min' => 'Kolom harga produk minimal 1',
                'items.*.image.image' => 'File gambar varian tidak valid',
                'items.*.image.mimes' => 'Format gambar varian harus jpg, jpeg, png, atau webp',
                'items.*.image.max' => 'Ukuran gambar varian maksimal 2MB',
            ];
        } elseif ($method === 'PUT') {
            $validate = [
                'barcode.required' => 'Kolom barcode tidak boleh kosong',
                'barcode.string' => 'Kolom barcode harus berupa string',
                'barcode.max' => 'Kolom barcode maksimal 255 karakter',
                'name.required' => 'Kolom nama produk tidak boleh kosong',
                'name.string' => 'Kolom nama produk harus berupa string',
                'name.max' => 'Kolom nama produk maksimal 255 karakter',
                'unit_id.required' => 'Kolom satuan tidak boleh kosong',
                'price.required' => 'Kolom harga tidak boleh kosong',
                'price.numeric' => 'Kolom harga harus berupa angka',
                'price.min' => 'Kolom harga minimal 1',
                'image.image' => 'File gambar tidak valid',
                'image.mimes' => 'Format gambar harus jpg, jpeg, png, atau webp',
                'image.max' => 'Ukuran gambar maksimal 2MB',
            ];
        }

        return $validate;
    }
}
