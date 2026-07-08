<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Asset extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'category_id',
        'name',
        'serial_number',
        'barcode',
        'model',
        'purchase_date',
        'purchase_cost',
        'vendor',
        'warranty_expiry',
        'status',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'purchase_date' => 'date',
            'warranty_expiry' => 'date',
            'purchase_cost' => 'decimal:2',
        ];
    }

    /**
     * The category this asset belongs to.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Scope: only assets currently available for assignment/request.
     * Usage: Asset::available()->get()
     */
    public function scopeAvailable(Builder $query): Builder
    {
        return $query->where('status', 'available');
    }

    /**
     * Scope: only assets currently assigned to a user.
     */
    public function scopeAssigned(Builder $query): Builder
    {
        return $query->where('status', 'assigned');
    }

    /**
     * Scope: only assets marked damaged.
     */
    public function scopeDamaged(Builder $query): Builder
    {
        return $query->where('status', 'damaged');
    }

    /**
     * Scope: only assets permanently retired.
     */
    public function scopeScrapped(Builder $query): Builder
    {
        return $query->where('status', 'scrapped');
    }

    public function assignments(): \Illuminate\Database\Eloquent\Relations\HasMany
{
    return $this->hasMany(AssetAssignment::class);
}
}