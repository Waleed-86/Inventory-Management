<?php

namespace App\Http\Requests\AssetRequisition;

use Illuminate\Foundation\Http\FormRequest;

class StoreRequisitionRequest extends FormRequest
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
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'asset_id' => ['nullable', 'exists:assets,id'],
            'quantity' => ['required', 'integer', 'min:1'],
            'justification' => ['required', 'string', 'max:2000'],
        ];
    }
}