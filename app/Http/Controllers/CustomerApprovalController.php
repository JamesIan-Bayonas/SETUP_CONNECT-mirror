<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerApprovalController extends Controller
{
     public function index()
    {    
          $applications = \App\Models\Customer::select(
              'id',
              'first_name',
              'middle_name',
              'last_name',
              'name_of_agency_firm',
              'status',
              'created_at',
              'decision_date'
          )
          ->orderBy('created_at', 'desc')
          ->get()
          ->map(function ($app) {
              return [
                  'id' => $app->id,
                  'customerName' => trim("{$app->first_name} {$app->middle_name} {$app->last_name}"),
                  'agencyFirm' => $app->name_of_agency_firm,
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
        $application = \App\Models\Customer::findOrFail($id);
        
        return response()->json($application);
    }

    public function approve($id)
    {
        $application = \App\Models\Customer::findOrFail($id);
        
        $application->update([
            'status' => 'Approved',
            'decision_date' => now(),
            'decided_by' => auth()->id(),
        ]);

        // Build applicant full name
        $applicantName = trim("{$application->first_name} {$application->middle_name} {$application->last_name} {$application->suffix}");

        // Log for debugging
        \Log::info('Dispatching CustomerApplicationApproved event', [
            'application_id' => $application->id,
            'applicant_name' => $applicantName,
            'applicant_email' => $application->email_address,
        ]);

        // Dispatch event to trigger user creation and email sending
        \App\Events\CustomerApplicationApproved::dispatch(
            $applicantName,
            $application->email_address,
            $application->id,
            auth()->id(),
            now()->toIso8601String()
        );

        return redirect()->back()->with('success', 'Application approved successfully!');
    }

    public function decline($id)
    {
        $application = \App\Models\Customer::findOrFail($id);
        
        $application->update([
            'status' => 'Declined',
            'decision_date' => now(),
            'decided_by' => auth()->id(),
        ]);

        return redirect()->back()->with('success', 'Application declined.');
    }

    public function destroy($id)
    {
        $application = \App\Models\Customer::findOrFail($id);
        $application->delete();

        return redirect()->back()->with('success', 'Application deleted successfully.');
    }
}
