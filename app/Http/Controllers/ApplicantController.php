<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Models\Applicant;
use App\Models\Customer;

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
            'business_organization_type_id' => [
                'required',
                'integer',
                Rule::exists('business_organization_types', 'id')
            ],
            'date_established' => 'required|date',
            'name_of_head_of_agency_firm' => 'required|string|max:255',
            'business_address' => 'required|string|max:255',
            'contact_nos' => 'required|string|max:255',
            'email_address' => 'required|email|max:255|unique:users,email',
            'website' => 'nullable|url|max:255',
        ]);

        $applicant = Customer::create($validated);

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