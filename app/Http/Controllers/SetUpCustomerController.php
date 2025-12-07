<?php

namespace App\Http\Controllers;

use App\Models\SetUpCustomer;
use App\Models\SetUpCustomerBusiness;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SetUpCustomerController extends Controller
{
    /**
     * Display a listing of setup customers.
     */
    public function index()
    {
        $customers = SetUpCustomer::with(['user', 'businesses'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($customer) {
                return [
                    'id' => $customer->id,
                    'customerName' => $customer->full_name,
                    'email' => $customer->user->email ?? 'N/A',
                    'designation' => $customer->designation_position,
                    'businessCount' => $customer->businesses->count(),
                    'isActive' => $customer->is_active,
                    'createdAt' => $customer->created_at->format('Y-m-d'),
                ];
            });

        return Inertia::render('CustomerApplications/SetUpCustomerView', [
            'customers' => $customers
        ]);
    }

    /**
     * Display the specified setup customer with their businesses.
     */
    public function show($id)
    {
        $customer = SetUpCustomer::with(['user', 'businesses', 'customerApplication'])
            ->findOrFail($id);

        return response()->json([
            'id' => $customer->id,
            'first_name' => $customer->first_name,
            'middle_name' => $customer->middle_name,
            'last_name' => $customer->last_name,
            'suffix' => $customer->suffix,
            'full_name' => $customer->full_name,
            'designation_position' => $customer->designation_position,
            'residential_address' => $customer->residential_address,
            'is_active' => $customer->is_active,
            'created_at' => $customer->created_at,
            'user' => [
                'id' => $customer->user->id,
                'name' => $customer->user->name,
                'email' => $customer->user->email,
            ],
            'businesses' => $customer->businesses->map(function ($business) {
                return [
                    'id' => $business->id,
                    'name_of_agency_firm' => $business->name_of_agency_firm,
                    'business_of_the_firm' => $business->business_of_the_firm,
                    'product_line' => $business->product_line,
                    'type_of_organization' => $business->type_of_organization,
                    'date_established' => $business->date_established->format('Y-m-d'),
                    'name_of_head_of_agency_firm' => $business->name_of_head_of_agency_firm,
                    'business_address' => $business->business_address,
                    'contact_nos' => $business->contact_nos,
                    'email_address' => $business->email_address,
                    'website' => $business->website,
                    'is_active' => $business->is_active,
                    'created_at' => $business->created_at->format('Y-m-d'),
                ];
            }),
        ]);
    }

    /**
     * Update the specified setup customer.
     */
    public function update(Request $request, $id)
    {
        $customer = SetUpCustomer::findOrFail($id);

        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'required|string|max:255',
            'suffix' => 'nullable|string|max:255',
            'designation_position' => 'required|string|max:255',
            'residential_address' => 'required|string',
            'is_active' => 'boolean',
        ]);

        $customer->update($validated);

        return redirect()->back()->with('success', 'Setup customer updated successfully.');
    }

    /**
     * Toggle active status of the specified setup customer.
     */
    public function toggleActive($id)
    {
        $customer = SetUpCustomer::findOrFail($id);
        $customer->update(['is_active' => !$customer->is_active]);

        return redirect()->back()->with('success', 'Customer status updated successfully.');
    }
}
