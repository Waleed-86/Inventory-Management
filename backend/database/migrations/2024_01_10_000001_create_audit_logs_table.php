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
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();

            // Deliberately NOT a foreign key constraint — if a user is later
            // deleted, their past actions must still remain in the log.
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('user_name')->nullable(); // snapshot at time of action, survives user deletion

            $table->string('action'); // e.g. 'asset.created', 'user.login', 'request.approved'

            // Polymorphic reference to whatever was acted on (asset, user, request, etc.)
            $table->string('subject_type')->nullable();
            $table->unsignedBigInteger('subject_id')->nullable();

            $table->json('changes')->nullable(); // what changed (old/new values), when relevant
            $table->string('ip_address')->nullable();

            // created_at only — no updated_at, no soft deletes.
            // This table is append-only by design; rows are never edited.
            $table->timestamp('created_at')->useCurrent();

            $table->index(['subject_type', 'subject_id']);
            $table->index('action');
            $table->index('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};