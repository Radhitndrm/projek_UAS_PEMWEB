<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OrderReceiveRequest extends FormRequest
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
            $receiveCode = 'required|string|max:255|unique:order_receives';
        elseif($method === 'PUT')
            $receiveCode = 'required|string|max:255|unique:order_receives,receive_code,' . $this->orderReceive->id;

        return [
            'order_id' => 'required',
            'receive_code' => $receiveCode,
            'receive_date' => 'required|date',
        ];
    }

    public function messages(): array
    {
        return [
            'order_id.required' => 'Kolom nama kategori tidak boleh kosong.',
            'receive_code.required' => 'Kolom nomor penerimaan tidak boleh kosong.',
            'receive_code.string' => 'Kolom nomor penerimaan harus berupa string.',
            'receive_code.max' => 'Kolom nomor penerimaan maksimal 255 karakter.',
            'receive_code.unique' => 'Kolom nomor penerimaan sudah ada, silahkan gunakan nomor lainnya',
            'receive_date.required' => 'Kolom tanggal penerimaan tidak boleh kosong.',
            'receive_date.date' => 'Kolom tanggal penerimaan harus berupa date.',
        ];
    }
}