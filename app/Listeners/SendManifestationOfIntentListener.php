<?php

namespace App\Listeners;

use App\Events\CustomerApplicationApproved;
use App\Mail\ManifestationOfIntentMail;
use Illuminate\Contracts\Events\ShouldHandleEventsAfterCommit;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Events\Attributes\ListensTo;
use Illuminate\Support\Facades\Mail;

#[ListensTo(CustomerApplicationApproved::class)]
class SendManifestationOfIntentListener
{
    /**
     * Handle the CustomerApplicationApproved event.
     * 
     * Sends the Manifestation of Intent email to the approved applicant.
     */
    public function handle(CustomerApplicationApproved $event): void
    {
        \Log::info('SendManifestationOfIntentListener: Starting', [
            'applicant_name' => $event->applicantName,
            'applicant_email' => $event->applicantEmail,
        ]);

        // Find the user (should be created by CreateCooperatorUserListener first)
        $user = \App\Models\User::where('email', $event->applicantEmail)->first();
        
        if (!$user) {
            \Log::error('SendManifestationOfIntentListener: User not found', [
                'email' => $event->applicantEmail,
            ]);
            return;
        }

        // Generate password reset token and URL
        $token = \Illuminate\Support\Facades\Password::createToken($user);
        
        $resetPasswordUrl = url(route('password.reset', [
            'token' => $token,
            'email' => $event->applicantEmail,
        ], false));

        \Log::info('SendManifestationOfIntentListener: Password reset URL generated', [
            'url' => $resetPasswordUrl,
        ]);

        Mail::to($event->applicantEmail)
            ->send(new ManifestationOfIntentMail($event->applicantName, $resetPasswordUrl));

        \Log::info('SendManifestationOfIntentListener: Email sent successfully', [
            'recipient' => $event->applicantEmail,
        ]);
    }
}


