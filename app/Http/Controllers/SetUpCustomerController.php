<?php

namespace App\Http\Controllers;

use App\Models\SetUpCustomer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SetUpCustomerController extends Controller
{
    /**
     * Display a listing of setup customers for the index table view.
     */
    public function index(Request $request)
    {
        $customers = SetUpCustomer::with('businesses')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($c) {
                return [
                    'id' => $c->id,
                    'customer_name' => trim("{$c->first_name} {$c->middle_name} {$c->last_name}"),
                    'created_at' => optional($c->created_at)->toIso8601String(),
                    'status' => $c->status,
                ];
            });

        return Inertia::render('CustomerApplications/SetUpCustomerView', [
            'customers' => $customers,
        ]);
    }

    /**
     * Show the specified setup customer details as JSON for the modal.
     */
    public function show($id)
    {
        $c = SetUpCustomer::with('businesses')->findOrFail($id);
        $business = $c->businesses->first();

        // Normalize business payload(s) so date fields are predictable for the frontend
        $businessArr = null;
        if ($business) {
            $businessArr = $business->toArray();
            $businessArr['date_established'] = optional($business->date_established)->format('Y-m-d');
        }

        $businessesArr = $c->businesses->map(function ($b) {
            $arr = $b->toArray();
            $arr['date_established'] = optional($b->date_established)->format('Y-m-d');
            return $arr;
        })->toArray();

        $payload = [
            'id' => $c->id,
            'customer_name' => trim("{$c->first_name} {$c->middle_name} {$c->last_name} {$c->suffix}"),
            'first_name' => $c->first_name,
            'middle_name' => $c->middle_name,
            'last_name' => $c->last_name,
            'suffix' => $c->suffix,
            'designation_position' => $c->designation_position,
            'residential_address' => $c->residential_address,
            'contact_nos' => $c->contact_nos,
            'email_address' => $c->email_address,
            'website' => $c->website,
            'status' => $c->status,
            'decision_date' => optional($c->decision_date)->toIso8601String(),
            'decided_by' => $c->decided_by ?? null,
            'created_at' => optional($c->created_at)->toIso8601String(),
            // provide both first business and full collection for flexibility
            'business' => $businessArr,
            'businesses' => $businessesArr,
            // also expose common business fields at top-level for older UI shapes
            'name_of_agency_firm' => $business?->name_of_agency_firm ?? null,
            'business_of_the_firm' => $business?->business_of_the_firm ?? null,
            'product_line' => $business?->product_line ?? null,
            'type_of_organization' => $business?->type_of_organization ?? null,
            'date_established' => $business ? optional($business->date_established)->format('Y-m-d') : null,
            'name_of_head_of_agency_firm' => $business?->name_of_head_of_agency_firm ?? null,
            'business_address' => $business?->business_address ?? null,
            // linked user (cooperator) if present
            'user' => $c->user ? [
                'id' => $c->user->id,
                'name' => $c->user->name ?? null,
                'email' => $c->user->email ?? null,
            ] : null,
        ];

        return response()->json($payload);
    }

    /**
     * Show edit form (Inertia) if an edit page exists; otherwise redirect back.
     */
    public function edit($id)
    {
        $c = SetUpCustomer::with('businesses')->findOrFail($id);
        return Inertia::render('CustomerApplications/SetUpCustomerEdit', [
            'customer' => $c,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $c = SetUpCustomer::findOrFail($id);
        $c->delete();

        return redirect()->back()->with('success', 'Customer deleted successfully.');
    }
}
