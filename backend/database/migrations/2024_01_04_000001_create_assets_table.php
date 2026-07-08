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
        Schema::create('assets', function (Blueprint $table) {
            $table->id();

            $table->foreignId('category_id')
                ->constrained('categories')
                ->restrictOnDelete(); // a category with assets can't be deleted directly

            $table->string('name');
            $table->string('serial_number')->unique();
            $table->string('barcode')->nullable()->unique(); // QR/barcode-ready, optional at creation time
            $table->string('model')->nullable();
            $table->date('purchase_date')->nullable();
            $table->decimal('purchase_cost', 12, 2)->nullable();
            $table->string('vendor')->nullable();
            $table->date('warranty_expiry')->nullable();

            // Tracks the asset's current lifecycle state.
            // available   -> sitting in inventory, can be assigned or requested
            // assigned    -> currently held by a user
            // reserved    -> earmarked, not yet dispatched
            // damaged     -> reported damaged, pending review/repair
            // scrapped    -> permanently retired, kept for historical record only
            $table->enum('status', ['available', 'assigned', 'reserved', 'damaged', 'scrapped'])
                ->default('available');

            $table->timestamps();
            $table->softDeletes(); // preserves full lifecycle history even if an asset record is "deleted"

            $table->index('status'); // dashboards filter/count by status constantly
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assets');
    }
};