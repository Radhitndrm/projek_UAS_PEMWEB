<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PermissionRequest extends FormRequest
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
                'name' => 'required|string|max:255|unique:permissions',
            ];
        elseif ($method === 'PUT')
            $validate = [
                'name' => 'required|string|max:255|unique:permissions,name,' . $this->permission->id,
            ];

        return $validate;
    }

    public function messages()
    {
        return [
            'name.required' => 'Kolom nama hak akses tidak boleh kosong.',
            'name.string' => 'Kolom nama hak akses harus berupa string.',
            'name.unique' => 'Nama hak akses sudah ada, silahkan gunakan nama lainnya.',
        ];
    }
}
