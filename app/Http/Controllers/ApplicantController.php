<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Applicant;
use App\Models\Customer;

class ApplicantController extends Controller
{
    public function store(Request $request)
    {
        // Validate inputs (you can adjust required fields)
        $validated = $request->validate([
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'designationPosition' => 'required|string|max:255',
            'residentialAddress' => 'required|string',
            'agencyFirm' => 'required|string|max:255',
            'businessOfFirm' => 'required|string|max:255',
            'productLine' => 'required|string|max:255',
            'orgType' => 'required|string|max:255',
            'dateEstablished' => 'required|date',
            'nameOfHeadOfAgency' => 'required|string|max:255',
            'businessAddress' => 'required|string',
            'contactNumbers' => 'required|string|max:50',
            'webEmailAddress' => 'required|string|max:255',
        ]);

        // Save to database
        $applicant = Customer::create($validated);

        return response()->json([
            'message' => 'Applicant saved successfully!',
            'data' => $applicant
        ], 201);
    }
}