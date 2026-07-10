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
        Schema::table('categories', function (Blueprint $table) {
            // How many 'available' assets in this category triggers a low-stock
            // alert. Nullable + default 5 so existing categories don't break;
            // admins can tune this per category later via the Categories UI.
            $table->unsignedInteger('low_stock_threshold')->default(5)->after('description');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->dropColumn('low_stock_threshold');
        });
    }
};