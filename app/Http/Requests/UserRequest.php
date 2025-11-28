<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserRequest extends FormRequest
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
                'username' => 'required|string|max:255|unique:users',
                'name' => 'required|string|max:255',
                'email' => 'required|unique:users',
                'password' => 'required|min:4|confirmed',
                'selectedRoles' => 'required|array|min:1',
            ];
        elseif ($method === 'PUT')
            $validate = [
                'username' => 'required|string|max:255|unique:users',
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email,' . $this->user->id,
                'password' => 'nullable|min:4|confirmed',
                'selectedRoles' =>  'required|array|min:4',
            ];
        return $validate;
    }

    public function messages(): array
    {
        return [
            'username.required' => 'Kolom username tidak boleh kosong.',
            'username.max' => 'Kolom username maksimal 255 karakter.',
            'username.unique' => 'Username sudah ada, silahkan gunakan username lainnya.',
            'name.required' => 'Kolom nama akses group tidak boleh kosong.',
            'name.max' => 'Kolom nama akses group maksimal 255 karakter.',
            'email.required' => 'Kolom email tidak boleh kosong.',
            'email.unique' => 'Email sudah ada, silahkan gunakan email lainnya.',
            'password.min' => 'Kolom password minimal 4 karakter.',
            'password.confirmed' => 'Kolom password dan password confirmation tidak sesuai.',
            'selectedRoles.required' => 'Kolom akses group tidak boleh kosong.',
            'selectedRoles.min' => 'Kolom akses group minimal 1 data',
        ];
    }
}
