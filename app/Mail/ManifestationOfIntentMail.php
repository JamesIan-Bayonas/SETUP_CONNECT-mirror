<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ManifestationOfIntentMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $applicantName;

    public function __construct(string $applicantName)
    {
        $this->applicantName = $applicantName;
    }

    public function build(): self
    {
        $pdfPath = storage_path('app/app-templates/manifestation_of_intent.pdf');

        return $this->subject('SETUP Application Approved — Manifestation of Intent')
            ->view('emails.manifestation_of_intent')
            ->attach($pdfPath, [
                'as' => 'Manifestation_of_Intent.pdf',
                'mime' => 'application/pdf',
            ]);
    }
}


