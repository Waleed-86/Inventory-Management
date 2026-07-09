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
        Schema::create('damage_reports', function (Blueprint $table) {
            $table->id();

            $table->foreignId('asset_id')
                ->constrained('assets')
                ->cascadeOnDelete();

            $table->foreignId('user_id') // who reported it
                ->constrained('users')
                ->cascadeOnDelete();

            $table->foreignId('reviewed_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->string('image_path')->nullable();
            $table->text('description');

            // pending_review -> just reported, awaiting admin triage
            // in_repair      -> sent for repair
            // repaired       -> fixed, back in service
            // replaced       -> asset replaced with a new one
            // scrapped       -> beyond repair, retired
            $table->enum('status', ['pending_review', 'in_repair', 'repaired', 'replaced', 'scrapped'])
                ->default('pending_review');

            $table->timestamps();

            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('damage_reports');
    }
};