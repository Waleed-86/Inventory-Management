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
        Schema::create('asset_requests', function (Blueprint $table) {
            $table->id();

            $table->foreignId('asset_id')
                ->nullable() // request may be for a category/type rather than one specific unit
                ->constrained('assets')
                ->nullOnDelete();

            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->foreignId('reviewed_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->unsignedInteger('quantity')->default(1);
            $table->text('justification');
            $table->text('admin_comment')->nullable();

            // pending    -> awaiting admin review
            // approved   -> admin approved, awaiting dispatch
            // rejected   -> admin rejected
            // dispatched -> asset physically handed over
            $table->enum('status', ['pending', 'approved', 'rejected', 'dispatched'])
                ->default('pending');

            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();

            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('asset_requests');
    }
};