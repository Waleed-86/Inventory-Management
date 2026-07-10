<?php

namespace App\Exports;

use App\Models\Asset;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class AssetsExport implements FromCollection, WithHeadings, WithMapping
{
    /**
     * The rows to export — all assets with their category eager-loaded
     * so we don't run one query per row.
     */
    public function collection()
    {
        return Asset::with('category')->orderBy('name')->get();
    }

    /**
     * Column headers for the CSV/XLSX file.
     *
     * @return array<int, string>
     */
    public function headings(): array
    {
        return [
            'Name',
            'Category',
            'Serial Number',
            'Barcode',
            'Model',
            'Status',
            'Purchase Date',
            'Purchase Cost',
            'Vendor',
        ];
    }

    /**
     * Map each Asset model to a row of plain values (avoids exporting
     * raw model objects/relationships directly).
     *
     * @return array<int, mixed>
     */
    public function map($asset): array
    {
        return [
            $asset->name,
            $asset->category?->name,
            $asset->serial_number,
            $asset->barcode,
            $asset->model,
            $asset->status,
            $asset->purchase_date?->format('Y-m-d'),
            $asset->purchase_cost,
            $asset->vendor,
        ];
    }
}