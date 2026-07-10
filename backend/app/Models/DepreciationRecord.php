<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DepreciationRecord extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'asset_id',
        'purchase_value',
        'current_value',
        'depreciation_amount',
        'depreciation_rate',
        'calculated_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'purchase_value' => 'decimal:2',
            'current_value' => 'decimal:2',
            'depreciation_amount' => 'decimal:2',
            'depreciation_rate' => 'decimal:2',
            'calculated_at' => 'date',
        ];
    }

    /**
     * The asset this valuation record belongs to.
     */
    public function asset(): BelongsTo
    {
        return $this->belongsTo(Asset::class);
    }
}