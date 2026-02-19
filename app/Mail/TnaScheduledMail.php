<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class TnaScheduledMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $cooperatorName,
        public string $businessName,
        public string $scheduledDate,
        public string $location,
        public ?string $conductedByName,
        public ?string $notes,
    ) {}

    public function build(): self
    {
        return $this->subject('📅 Your TNA Session Has Been Scheduled — SETUP Connect')
                    ->view('emails.customer.tna_scheduled');
    }
}
