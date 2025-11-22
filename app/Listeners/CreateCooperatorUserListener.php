<?php

namespace App\Listeners;

use App\Enums\UserType;
use App\Events\CustomerApplicationApproved;
use App\Models\Customer;
use App\Models\User;
use Illuminate\Contracts\Events\ShouldHandleEventsAfterCommit;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Events\Attributes\ListensTo;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

#[ListensTo(CustomerApplicationApproved::class)]
class CreateCooperatorUserListener
{
    /**
     * Handle the CustomerApplicationApproved event.
     * 
     * Creates a Cooperator user account and sends password reset link.
     */
    public function handle(CustomerApplicationApproved $event): void
    {
        \Log::info('CreateCooperatorUserListener: Starting', [
            'applicant_name' => $event->applicantName,
            'applicant_email' => $event->applicantEmail,
            'application_id' => $event->applicationId,
        ]);

        // Check if user already exists
        $existingUser = User::where('email', $event->applicantEmail)->first();
        
        if ($existingUser) {
            \Log::info('CreateCooperatorUserListener: User already exists', [
                'user_id' => $existingUser->id,
                'email' => $existingUser->email,
            ]);
            
            // If user exists, just link it to the application
            if ($event->applicationId) {
                Customer::where('id', $event->applicationId)->update(['user_id' => $existingUser->id]);
            }
            return;
        }

        // Create new user with temporary password
        $user = User::create([
            'name' => $event->applicantName,
            'email' => $event->applicantEmail,
            'password' => Hash::make(Str::random(32)), // Random password that user won't know
            'user_type' => UserType::COOPERATOR,
            'is_active' => true,
        ]);

        \Log::info('CreateCooperatorUserListener: User created successfully', [
            'user_id' => $user->id,
            'email' => $user->email,
            'user_type' => $user->user_type->value,
        ]);

        // Link user to the customer application
        if ($event->applicationId) {
            Customer::where('id', $event->applicationId)->update(['user_id' => $user->id]);
            \Log::info('CreateCooperatorUserListener: User linked to application', [
                'user_id' => $user->id,
                'application_id' => $event->applicationId,
            ]);
        }

        \Log::info('CreateCooperatorUserListener: Completed - password reset link will be sent via ManifestationOfIntentMail');
    }
}
