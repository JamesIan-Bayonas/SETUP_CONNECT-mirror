<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SetUpCustomer;

class ApplicantController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'required|string|max:255',
            'suffix' => 'nullable|string|max:255',
            'designation_position' => 'required|string|max:255',
            'residential_address' => 'required|string|max:255',
            'name_of_agency_firm' => 'required|string|max:255',
            'business_of_the_firm' => 'required|string|max:255',
            'product_line' => 'required|string|max:255',
            'type_of_organization' => 'required|string|max:255',
            'date_established' => 'required|date',
            'name_of_head_of_agency_firm' => 'required|string|max:255',
            'business_address' => 'required|string|max:255',
            'contact_nos' => 'required|string|max:255',
            'email_address' => 'required|email|max:255|unique:setup_customers,email_address',
            'website' => 'nullable|url|max:255',
        ]);

        // 1. Create SetUpCustomer
        $applicant = SetUpCustomer::create([
            'first_name' => $validated['first_name'],
            'middle_name' => $validated['middle_name'],
            'last_name' => $validated['last_name'],
            'suffix' => $validated['suffix'],
            'designation_position' => $validated['designation_position'],
            'residential_address' => $validated['residential_address'],
            'contact_nos' => $validated['contact_nos'],
            'email_address' => $validated['email_address'],
            'website' => $validated['website'],
        ]);

        // 2. Create SetUpCustomerBusiness
        $applicant->businesses()->create([
            'name_of_agency_firm' => $validated['name_of_agency_firm'],
            'business_of_the_firm' => $validated['business_of_the_firm'],
            'product_line' => $validated['product_line'],
            'type_of_organization' => $validated['type_of_organization'],
            'date_established' => $validated['date_established'],
            'name_of_head_of_agency_firm' => $validated['name_of_head_of_agency_firm'],
            'business_address' => $validated['business_address'],
        ]);

        return response()->json([
            'message' => 'Applicant saved successfully!',
            'data' => $applicant
        ], 201);
    }

    public function index()
    {
        return response()->json([
            'message' => 'Applicants list endpoint working!'
        ]);
    }
}
