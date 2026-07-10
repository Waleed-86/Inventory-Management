<?php

namespace App\Notifications;

use App\Models\Category;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class LowStockAlertNotification extends Notification
{
    use Queueable;

    public function __construct(
        private Category $category,
        private int $availableCount,
        private int $threshold
    ) {
    }

    /**
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("Low stock alert: {$this->category->name}")
            ->greeting("Hello {$notifiable->name},")
            ->line("The '{$this->category->name}' category is running low on available assets.")
            ->line("Available: {$this->availableCount} (threshold: {$this->threshold})")
            ->line('Consider reordering or reallocating assets from other categories.')
            ->action('View Inventory', url('/assets'));
    }
}