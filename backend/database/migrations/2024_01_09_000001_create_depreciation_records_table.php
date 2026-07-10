<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('depreciation_records', function (Blueprint $table) {
            $table->id();

            $table->foreignId('asset_id')
                ->constrained('assets')
                ->cascadeOnDelete();

            $table->decimal('purchase_value', 12, 2);
            $table->decimal('current_value', 12, 2);
            $table->decimal('depreciation_amount', 12, 2);
            $table->decimal('depreciation_rate', 5, 2); // annual % used for this calculation, kept for transparency
            $table->date('calculated_at');

            $table->timestamps();

            $table->index('asset_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('depreciation_records');
    }
};