<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SupplierRequest extends FormRequest
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

        if($method === 'POST')
            $validation = 'required|string|max:255|unique:suppliers';
        elseif($method === 'PUT')
            $validation = 'required|string|max:255|unique:suppliers,code,' . $this->supplier->id;

        return [
            'code' => $validation,
            'name' => 'required|string|max:255',
            'address' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'code.required' => 'Kolom kode supplier tidak boleh kosong.',
            'code.string' => 'Kolom kode supplier harus berupa string.',
            'code.max' => 'Kolom kode supplier tidak boleh lebih dari 255 karakter.',
            'code.unique' => 'Kolom kode supplier sudah digunakan oleh supplier lain.',
            'name.required' => 'Kolom nama supplier tidak boleh kosong.',
            'name.string' => 'Kolom nama supplier harus berupa string.',
            'name.max' => 'Kolom nama supplier tidak boleh lebih dari 255 karakter.',
            'address.string' => 'Kolom alamat supplier harus berupa string.',
            'address.max' => 'Kolom alamat supplier tidak boleh lebih dari 255 karakter.',
            'phone.string' => 'Kolom telepon supplier harus berupa string.',
            'phone.max' => 'Kolom telepon supplier tidak boleh lebih dari 255 karakter.',
            'email.email' => 'Kolom email supplier harus berupa email.',
            'email.max' => 'Kolom email supplier tidak boleh lebih dari 255 karakter.',
        ];
    }
}