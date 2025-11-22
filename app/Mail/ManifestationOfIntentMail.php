<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ManifestationOfIntentMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $applicantName;
    public string $resetPasswordUrl;

    public function __construct(string $applicantName, string $resetPasswordUrl)
    {
        $this->applicantName = $applicantName;
        $this->resetPasswordUrl = $resetPasswordUrl;
    }

    public function build(): self
    {
        $pdfPath = storage_path('app/app-templates/manifestation_of_intent.pdf');

        $mail = $this->subject('🎉 SETUP Application Approved — Next Steps')
            ->view('emails.manifestation_of_intent');

        // Only attach PDF if it exists
        if (file_exists($pdfPath)) {
            $mail->attach($pdfPath, [
                'as' => 'Manifestation_of_Intent.pdf',
                'mime' => 'application/pdf',
            ]);
        }

        return $mail;
    }
}


