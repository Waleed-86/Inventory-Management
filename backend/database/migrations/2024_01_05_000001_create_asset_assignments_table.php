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
        Schema::create('asset_assignments', function (Blueprint $table) {
            $table->id();

            $table->foreignId('asset_id')
                ->constrained('assets')
                ->cascadeOnDelete(); // if the asset record is hard-deleted, its assignment history goes with it

            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->foreignId('assigned_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete(); // admin who made the assignment — kept for audit trail

            $table->date('assigned_date');
            $table->date('returned_date')->nullable();
            $table->boolean('acknowledged')->default(false); // user has confirmed receipt
            $table->timestamp('acknowledged_at')->nullable();

            // active    -> currently held by the user
            // returned  -> user has given it back
            $table->enum('status', ['active', 'returned'])->default('active');

            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('asset_assignments');
    }
};