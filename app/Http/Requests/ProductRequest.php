<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $method = $this->method();

        if ($method === 'POST') {
            $validateSku = 'required|string|max:255|unique:products,sku';
            $validateImage = 'required|image|mimes:jpg,jpeg,png,webp|max:2048';
        } elseif ($method === 'PUT') {
            $validateSku = 'required|string|max:255|unique:products,sku,' . $this->product->id;
            $validateImage = 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048';
        } else {
            $validateSku = 'required|string|max:255';
            $validateImage = 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048';
        }

        return [
            'name'         => 'required|string|max:255',
            'sku'          => $validateSku,
            'category_id'  => 'required',
            'description'  => 'nullable|string',
            'image'        => $validateImage,
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Kolom nama produk tidak boleh kosong',
            'name.string' => 'Kolom nama produk harus berupa string',
            'name.max' => 'Kolom nama produk maksimal 255 karaketer',

            'sku.required' => 'Kolom sku tidak boleh kosong',
            'sku.string' => 'Kolom sku harus berupa string',
            'sku.max' => 'Kolom sku maksimal 255 karakter',
            'sku.unique' => 'Kolom sku sudah digunakan oleh produk lain',

            'category_id.required' => 'Kolom kategori produk tidak boleh kosong',
            'description.string' => 'Kolom deskripsi produk harus berupa string',

            'image.required' => 'Kolom gambar tidak boleh kosong',
            'image.image' => 'File harus berupa gambar',
            'image.mimes' => 'Gambar harus berformat: jpg, jpeg, png, atau webp',
            'image.max' => 'Ukuran gambar maksimal 2MB',
        ];
    }
}
