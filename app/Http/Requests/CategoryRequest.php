<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CategoryRequest extends FormRequest
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
            $validation = 'required|string|max:255|unique:categories';
        elseif ($method === 'PUT')
            $validation = 'required|string|max:255|unique:categories,name,' . $this->category->id;

        return [
            'name' => $validation,
            'description' => 'nullable|string',
        ];
    }
    public function messages(): array
    {
        return [
            'name.required' => 'Kolom nama kategori tidak boleh kosong.',
            'name.string' => 'Kolom nama kategori harus berupa string.',
            'name.max' => 'Kolom nama kategori tidak boleh lebih dari 255 karakter.',
            'name.unique' => 'Kolom nama kategori sudah digunakan oleh kategori lain.',
            'description.string' => 'Kolom deskripsi kategori harus berupa string.',
        ];
    }
}
