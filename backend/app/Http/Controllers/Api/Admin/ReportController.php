<?php

namespace App\Http\Controllers\Api\Admin;

use App\Exports\AssetsExport;
use App\Http\Controllers\Controller;
use App\Models\Asset;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Response;
use Maatwebsite\Excel\Facades\Excel;

class ReportController extends Controller
{
    /**
     * Download the full asset inventory as a PDF.
     */
    public function assetsPdf(): Response
    {
        $assets = Asset::with('category')->orderBy('name')->get();

        $pdf = Pdf::loadView('reports.assets-pdf', ['assets' => $assets])
            ->setPaper('a4', 'landscape');

        return $pdf->download('asset-inventory-'.now()->format('Y-m-d').'.pdf');
    }

    /**
     * Download the full asset inventory as a CSV/XLSX file.
     */
    public function assetsCsv()
    {
        return Excel::download(new AssetsExport, 'asset-inventory-'.now()->format('Y-m-d').'.csv');
    }
}