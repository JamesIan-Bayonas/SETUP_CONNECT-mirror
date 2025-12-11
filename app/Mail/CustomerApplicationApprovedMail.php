<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CustomerApplicationApprovedMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $applicantName;
    public string $resetPasswordUrl;

    /**
     * Create a new message instance.
     */
    public function __construct(string $applicantName, string $resetPasswordUrl)
    {
        $this->applicantName = $applicantName;
        $this->resetPasswordUrl = $resetPasswordUrl;
    }

    /**
     * Build the message.
     */
    public function build(): self
    {
        return $this->subject('🎉 SETUP Application Approved')
                    ->view('emails.customer.approved');
    }
}
