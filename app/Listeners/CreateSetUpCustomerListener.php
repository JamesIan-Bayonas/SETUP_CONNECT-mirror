<?php

namespace App\Listeners;

use App\Events\CustomerApplicationApproved;
use App\Models\Customer;
use App\Models\SetUpCustomer;
use App\Models\SetUpCustomerBusiness;
use App\Models\User;
use Illuminate\Events\Attributes\ListensTo;

#[ListensTo(CustomerApplicationApproved::class)]
class CreateSetUpCustomerListener
{
    /**
     * Handle the CustomerApplicationApproved event.
     * 
     * Creates SetUpCustomer and SetUpCustomerBusiness records from the approved application.
     */
    public function handle(CustomerApplicationApproved $event): void
    {
        \Log::info('CreateSetUpCustomerListener: Starting', [
            'application_id' => $event->applicationId,
            'applicant_email' => $event->applicantEmail,
        ]);

        if (!$event->applicationId) {
            \Log::warning('CreateSetUpCustomerListener: No application ID provided');
            return;
        }

        // Get the customer application
        $application = Customer::find($event->applicationId);
        
        if (!$application) {
            \Log::error('CreateSetUpCustomerListener: Application not found', [
                'application_id' => $event->applicationId,
            ]);
            return;
        }

        // Get the user (should be created by CreateCooperatorUserListener)
        $user = User::where('email', $event->applicantEmail)->first();
        
        if (!$user) {
            \Log::error('CreateSetUpCustomerListener: User not found', [
                'email' => $event->applicantEmail,
            ]);
            return;
        }

        // Check if SetUpCustomer already exists for this application
        $existingSetupCustomer = SetUpCustomer::where('customer_application_id', $application->id)->first();
        
        if ($existingSetupCustomer) {
            \Log::info('CreateSetUpCustomerListener: SetUpCustomer already exists', [
                'setup_customer_id' => $existingSetupCustomer->id,
            ]);
            return;
        }

        // Create SetUpCustomer with personal information
        $setupCustomer = SetUpCustomer::create([
            'first_name' => $application->first_name,
            'middle_name' => $application->middle_name,
            'last_name' => $application->last_name,
            'suffix' => $application->suffix,
            'designation_position' => $application->designation_position,
            'residential_address' => $application->residential_address,
            'user_id' => $user->id,
            'customer_application_id' => $application->id,
            'is_active' => true,
        ]);

        \Log::info('CreateSetUpCustomerListener: SetUpCustomer created', [
            'setup_customer_id' => $setupCustomer->id,
            'user_id' => $user->id,
        ]);

        // Create SetUpCustomerBusiness with business information
        $setupBusiness = SetUpCustomerBusiness::create([
            'setup_customer_id' => $setupCustomer->id,
            'name_of_agency_firm' => $application->name_of_agency_firm,
            'business_of_the_firm' => $application->business_of_the_firm,
            'product_line' => $application->product_line,
            'type_of_organization' => $application->type_of_organization,
            'date_established' => $application->date_established,
            'name_of_head_of_agency_firm' => $application->name_of_head_of_agency_firm,
            'business_address' => $application->business_address,
            'contact_nos' => $application->contact_nos,
            'email_address' => $application->email_address,
            'website' => $application->website,
            'is_active' => true,
        ]);

        \Log::info('CreateSetUpCustomerListener: SetUpCustomerBusiness created', [
            'setup_business_id' => $setupBusiness->id,
            'setup_customer_id' => $setupCustomer->id,
        ]);

        \Log::info('CreateSetUpCustomerListener: Completed successfully');
    }
}
