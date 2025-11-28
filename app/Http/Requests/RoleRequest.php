<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RoleRequest extends FormRequest
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
            $validate = [
                'name' => 'required|string|max:255|unique:roles',
                'selectedPermissions' => 'required|array|min:1',
            ];
        elseif ($method === 'PUT')
            $validate = [
                'name' => 'required|string|max:255|unique:roles,name,' . $this->role->id,
                'selectedPermissions' => 'required|array|min:1',
            ];

        return $validate;
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Kolom nama akses group tidak boleh kosong.',
            'name.max' => 'Kolom nama akses group maksimal 255 karakter.',
            'name.unique' => 'Nama akses group sudah ada, silahkan gunakan nama lainnya.',
            'selectedPermissions.required' => 'Kolom hak akses tidak boleh kosong.',
            'selectedPermissions.min' => 'Kolom hak akses minimal 1 data',
        ];
    }
}
