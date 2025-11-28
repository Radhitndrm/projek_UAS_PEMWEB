<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UnitRequest extends FormRequest
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
            $validation = 'required|string|max:255|unique:units';
        elseif($method === 'PUT')
            $validation = 'required|string|max:255|unique:units,name,' . $this->unit->id;

        return [
            'name' => $validation,
            'description' => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Kolom nama unit tidak boleh kosong.',
            'name.string' => 'Kolom nama unit harus berupa string.',
            'name.max' => 'Kolom nama unit tidak boleh lebih dari 255 karakter.',
            'name.unique' => 'Kolom nama unit sudah digunakan oleh unit lain.',
            'description.string' => 'Kolom deskripsi unit harus berupa string.',
        ];
    }
}