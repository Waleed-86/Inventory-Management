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
        Schema::create('repairs', function (Blueprint $table) {
            $table->id();

            $table->foreignId('damage_report_id')
                ->constrained('damage_reports')
                ->cascadeOnDelete();

            $table->text('repair_notes')->nullable();
            $table->decimal('repair_cost', 12, 2)->nullable();
            $table->date('completed_date')->nullable();

            // in_progress -> repair started, not finished
            // completed   -> repair finished successfully (asset goes back to 'available')
            // failed      -> repair attempted but unsuccessful (asset likely gets scrapped)
            $table->enum('outcome', ['in_progress', 'completed', 'failed'])->default('in_progress');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('repairs');
    }
};