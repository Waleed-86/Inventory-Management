<?php

namespace App\Notifications;

use App\Models\AssetAssignment;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AssetAssignedNotification extends Notification
{
    use Queueable;

    public function __construct(private AssetAssignment $assignment)
    {
    }

    /**
     * The channels this notification is delivered through.
     *
     * To add WhatsApp later: create a WhatsAppChannel implementing the
     * ShouldQueue-compatible send() contract, register it in a service
     * provider, then add 'whatsapp' to this array — no other code here
     * needs to change, since the message content is defined once below
     * and each channel method (toMail, toWhatsApp, etc.) is independent.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * The email representation of this notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $asset = $this->assignment->asset;

        return (new MailMessage)
            ->subject('An asset has been assigned to you')
            ->greeting("Hello {$notifiable->name},")
            ->line("The following asset has been assigned to you:")
            ->line("**{$asset->name}** (Serial: {$asset->serial_number})")
            ->line("Assigned on: {$this->assignment->assigned_date->format('F j, Y')}")
            ->line('Please acknowledge receipt of this asset in the system.')
            ->action('View in Dashboard', url('/dashboard'))
            ->line('Thank you for using the Asset & Inventory Management System.');
    }
}