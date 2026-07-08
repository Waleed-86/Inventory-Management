<?php

namespace App\Http\Requests\Asset;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AssetRequest extends FormRequest
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
        // On update, ignore this asset's own serial/barcode when checking uniqueness.
        $assetId = $this->route('asset')?->id;

        return [
            'category_id' => ['required', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:255'],
            'serial_number' => [
                'required', 'string', 'max:255',
                Rule::unique('assets', 'serial_number')->ignore($assetId),
            ],
            'barcode' => [
                'nullable', 'string', 'max:255',
                Rule::unique('assets', 'barcode')->ignore($assetId),
            ],
            'model' => ['nullable', 'string', 'max:255'],
            'purchase_date' => ['nullable', 'date'],
            'purchase_cost' => ['nullable', 'numeric', 'min:0'],
            'vendor' => ['nullable', 'string', 'max:255'],
            'warranty_expiry' => ['nullable', 'date', 'after_or_equal:purchase_date'],
            'status' => ['sometimes', Rule::in(['available', 'assigned', 'reserved', 'damaged', 'scrapped'])],
        ];
    }
}