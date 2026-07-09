<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Repair extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'damage_report_id',
        'repair_notes',
        'repair_cost',
        'completed_date',
        'outcome',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'completed_date' => 'date',
            'repair_cost' => 'decimal:2',
        ];
    }

    /**
     * The damage report this repair record belongs to.
     */
    public function damageReport(): BelongsTo
    {
        return $this->belongsTo(DamageReport::class);
    }
}