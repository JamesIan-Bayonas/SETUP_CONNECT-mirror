<?php

namespace App\Listeners;

use App\Events\CustomerApplicationApproved;
use App\Mail\ManifestationOfIntentMail;
use Illuminate\Contracts\Events\ShouldHandleEventsAfterCommit;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Events\Attributes\ListensTo;
use Illuminate\Support\Facades\Mail;

#[ListensTo(CustomerApplicationApproved::class)]
class SendManifestationOfIntentListener implements ShouldQueue, ShouldHandleEventsAfterCommit
{
    /**
     * Handle the CustomerApplicationApproved event.
     * 
     * Sends the Manifestation of Intent email to the approved applicant.
     */
    public function handle(CustomerApplicationApproved $event): void
    {
        Mail::to($event->applicantEmail)
            ->send(new ManifestationOfIntentMail($event->applicantName));
    }
}


