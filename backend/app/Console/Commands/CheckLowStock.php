<?php

namespace App\Console\Commands;

use App\Models\Category;
use App\Models\User;
use App\Notifications\LowStockAlertNotification;
use Illuminate\Console\Command;

class CheckLowStock extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'inventory:check-low-stock';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check each category\'s available asset count and notify admins if it falls at or below the threshold.';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $categories = Category::withCount([
            'assets as available_count' => fn ($query) => $query->where('status', 'available'),
        ])->get();

        $lowStockCategories = $categories->filter(
            fn ($category) => $category->available_count <= $category->low_stock_threshold
        );

        if ($lowStockCategories->isEmpty()) {
            $this->info('No categories are low on stock.');

            return self::SUCCESS;
        }

        // Notify every admin-capable user (Super Admin + Inventory Manager)
        // once per low-stock category, rather than spamming per-asset.
        $admins = User::whereHas('role', fn ($q) => $q->whereIn('slug', ['super-admin', 'inventory-manager']))
            ->where('is_active', true)
            ->get();

        foreach ($lowStockCategories as $category) {
            foreach ($admins as $admin) {
                $admin->notify(new LowStockAlertNotification(
                    $category,
                    $category->available_count,
                    $category->low_stock_threshold
                ));
            }

            $this->warn("Low stock: {$category->name} ({$category->available_count}/{$category->low_stock_threshold})");
        }

        $this->info("Checked {$categories->count()} categories, {$lowStockCategories->count()} low on stock, {$admins->count()} admin(s) notified.");

        return self::SUCCESS;
    }
}