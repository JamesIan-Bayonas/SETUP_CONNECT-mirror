<?php

namespace App\Listeners;

use App\Events\CustomerApplicationApproved;
use App\Mail\ManifestationOfIntentMail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Mail;

class SendManifestationOfIntentListener implements ShouldQueue
{
    public function handle(CustomerApplicationApproved $event): void
    {
        Mail::to($event->applicantEmail)
            ->send(new ManifestationOfIntentMail($event->applicantName));
    }
}


