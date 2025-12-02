<?php

namespace App\Listeners;

use App\Events\CustomerApplicationApproved;
use App\Models\SetUpCustomer;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use App\Mail\CustomerApprovedMail;

class HandleCustomerApplicationApproval
{
    /**
     * Handle the event.
     */
    public function handle(CustomerApplicationApproved $event): void
    {
        // 1. Fetch application
        $application = SetUpCustomer::find($event->applicationId);
        if (!$application) return;

        // 2. Create user if not exists
        if (!$application->user_id) {
            $password = Str::random(10);

            $user = User::create([
                'name' => trim("{$application->first_name} {$application->middle_name} {$application->last_name} {$application->suffix}"),
                'email' => $application->email_address,
                'password' => bcrypt($password),
            ]);

            // 3. Update application with user_id
            $application->update(['user_id' => $user->id]);

            // 4. Send email with credentials + Manifestation of Intent
            Mail::to($application->email_address)
                ->send(new CustomerApprovedMail($user, $password, $application));
        }
    }
}
