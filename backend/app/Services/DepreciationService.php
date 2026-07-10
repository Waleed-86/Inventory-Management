<?php

namespace App\Services;

use App\Models\Asset;
use App\Models\DepreciationRecord;
use Carbon\Carbon;

class DepreciationService
{
    /**
     * Default annual depreciation rate (%) used when an asset/category
     * doesn't specify its own. 20%/year approximates a 5-year useful life —
     * a common default for IT equipment.
     */
    private const DEFAULT_ANNUAL_RATE = 20.0;

    /**
     * Calculate current value using straight-line depreciation:
     *   annual depreciation = purchase_cost * (rate / 100)
     *   elapsed years        = time since purchase_date (fractional)
     *   current value        = purchase_cost - (annual depreciation * elapsed years)
     * Value is floored at 0 — an asset's book value never goes negative.
     */
    public function calculateForAsset(Asset $asset, ?float $annualRatePercent = null): DepreciationRecord
    {
        $rate = $annualRatePercent ?? self::DEFAULT_ANNUAL_RATE;

        $purchaseValue = (float) ($asset->purchase_cost ?? 0);
        $purchaseDate = $asset->purchase_date ? Carbon::parse($asset->purchase_date) : now();

        $elapsedYears = $purchaseDate->floatDiffInYears(now());
        $annualDepreciation = $purchaseValue * ($rate / 100);
        $totalDepreciation = $annualDepreciation * $elapsedYears;

        $currentValue = max(0, $purchaseValue - $totalDepreciation);
        $depreciationAmount = $purchaseValue - $currentValue;

        return DepreciationRecord::create([
            'asset_id' => $asset->id,
            'purchase_value' => $purchaseValue,
            'current_value' => round($currentValue, 2),
            'depreciation_amount' => round($depreciationAmount, 2),
            'depreciation_rate' => $rate,
            'calculated_at' => now()->toDateString(),
        ]);
    }

    /**
     * Calculate and store depreciation for every asset that has a purchase
     * cost and date (skips assets missing that data — can't depreciate
     * something with no known purchase value).
     */
    public function calculateForAllAssets(?float $annualRatePercent = null): int
    {
        $count = 0;

        Asset::whereNotNull('purchase_cost')
            ->whereNotNull('purchase_date')
            ->chunk(100, function ($assets) use ($annualRatePercent, &$count) {
                foreach ($assets as $asset) {
                    $this->calculateForAsset($asset, $annualRatePercent);
                    $count++;
                }
            });

        return $count;
    }
}