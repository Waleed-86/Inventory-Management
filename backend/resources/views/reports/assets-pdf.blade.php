<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: 'DejaVu Sans', sans-serif; font-size: 11px; color: #10182B; }
        h1 { font-size: 18px; margin-bottom: 2px; }
        p.subtitle { color: #5B6472; margin-top: 0; margin-bottom: 16px; }
        table { width: 100%; border-collapse: collapse; }
        th { text-align: left; background: #10182B; color: #EDEEF0; padding: 6px 8px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.03em; }
        td { padding: 6px 8px; border-bottom: 1px solid #E2E4E8; }
        tr:nth-child(even) td { background: #F7F8F9; }
        .status { text-transform: capitalize; }
        .footer { margin-top: 20px; font-size: 9px; color: #8891A3; }
    </style>
</head>
<body>
    <h1>Asset Inventory Report</h1>
    <p class="subtitle">Generated on {{ now()->format('F j, Y') }} &middot; {{ $assets->count() }} asset(s)</p>

    <table>
        <thead>
            <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Serial Number</th>
                <th>Status</th>
                <th>Purchase Date</th>
                <th>Purchase Cost</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($assets as $asset)
                <tr>
                    <td>{{ $asset->name }}</td>
                    <td>{{ $asset->category?->name ?? '—' }}</td>
                    <td>{{ $asset->serial_number }}</td>
                    <td class="status">{{ $asset->status }}</td>
                    <td>{{ $asset->purchase_date?->format('Y-m-d') ?? '—' }}</td>
                    <td>{{ $asset->purchase_cost ? number_format($asset->purchase_cost, 2) : '—' }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <p class="footer">Asset &amp; Inventory Management System — Internal Report</p>
</body>
</html>