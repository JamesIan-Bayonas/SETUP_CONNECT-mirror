<?php

namespace App\Http\Controllers;

use App\Models\SetUpCustomer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class CustomerApprovalController extends Controller
{
    public function index()
    {
        $applications = SetUpCustomer::with('businesses')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($app) {
                return [
                    'id' => $app->id,
                    'customerName' => trim("{$app->first_name} {$app->middle_name} {$app->last_name}"),
                    'agencyFirm' => $app->businesses->first()?->name_of_agency_firm ?? '-',
                    'dateOfApplication' => $app->created_at->format('Y-m-d'),
                    'status' => $app->status,
                    'decisionDate' => $app->decision_date?->format('Y-m-d'),
                ];
            });

        return Inertia::render('CustomerApplications/ApprovalForm', [
            'applications' => $applications
        ]);
    }

    public function show($id)
    {
        $application = \App\Models\SetUpCustomer::with('businesses')->findOrFail($id);

        // Flatten the first business record into top-level keys for UI compatibility
        $business = $application->businesses->first();
        $payload = [
            'id' => $application->id,
            'first_name' => $application->first_name,
            'middle_name' => $application->middle_name,
            'last_name' => $application->last_name,
            'suffix' => $application->suffix,
            'designation_position' => $application->designation_position,
            'residential_address' => $application->residential_address,
            'contact_nos' => $application->contact_nos,
            'email_address' => $application->email_address,
            'website' => $application->website,
            'status' => $application->status,
            'created_at' => optional($application->created_at)->toIso8601String(),
            'decision_date' => optional($application->decision_date)->toIso8601String(),
            // Business info (fallback to null if missing)
            'name_of_agency_firm' => $business?->name_of_agency_firm,
            'business_of_the_firm' => $business?->business_of_the_firm,
            'product_line' => $business?->product_line,
            'type_of_organization' => $business?->type_of_organization,
            'date_established' => optional($business?->date_established)->format('Y-m-d'),
            'name_of_head_of_agency_firm' => $business?->name_of_head_of_agency_firm,
            'business_address' => $business?->business_address,
        ];

        return response()->json($payload);
    }

    public function approve($id)
    {
        $application = \App\Models\SetUpCustomer::findOrFail($id);

        // For testing: only update DB, skip user creation and emails
        $application->update([
            'status' => 'Approved',
            'decision_date' => now(),
            'decided_by' => Auth::id(),
        ]);

        return redirect()->back()->with('success', 'Application approved successfully (DB updated).');
    }


    public function decline($id)
    {
        $application = \App\Models\SetUpCustomer::findOrFail($id);

        // For testing: only update DB
        $application->update([
            'status' => 'Declined',
            'decision_date' => now(),
            'decided_by' => Auth::id(),
        ]);

        return redirect()->back()->with('success', 'Application declined (DB updated).');
    }

    public function destroy($id)
    {
        $application = \App\Models\SetUpCustomer::findOrFail($id);
        $application->delete();

        return redirect()->back()->with('success', 'Application deleted successfully.');
    }
}
