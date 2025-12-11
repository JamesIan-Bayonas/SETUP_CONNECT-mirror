<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Customer;
use App\Models\SetUpCustomer;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Mail;
use App\Mail\CustomerApplicationApprovedMail;
use Illuminate\Support\Facades\Password;
use App\Models\SetUpCustomerBusiness;
use App\Events\CustomerApplicationApproved;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash; 

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

    /**
     * Add new customer (with authenticated user ID)
     */
    /**
     * Add new customer (creates User, Customer Application, Setup Customer, and Business)
     */
   public function store(Request $request)
{
    if (!auth()->check()) {
        return response()->json(['message' => 'Unauthenticated.'], 401);
    }

    try {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'required|string|max:255',
            'suffix' => 'nullable|string|max:50',
            'designation_position' => 'required|string|max:255',
            'residential_address' => 'required|string',
            // removed customer_application_id rule as it's no longer used
            'name_of_agency_firm' => 'required|string|max:255',
            'business_of_the_firm' => 'required|string',
            'product_line' => 'required|string',
            'type_of_organization' => 'required|string|max:100',
            'date_established' => 'nullable|date',
            'name_of_head_of_agency_firm' => 'required|string|max:255',
            'business_address' => 'required|string',
            'contact_nos' => 'required|string|max:255',
            'email_address' => 'required|email|max:255',
            'website' => 'nullable|url|max:255',
        ]);

        DB::beginTransaction();

        $adminId = auth()->id();

        // 1) Create or reuse user by email
        $user = User::where('email', $validated['email_address'])->first();
        $createdNewUser = false;

        if (!$user) {
            $randomPassword = Str::random(16);
            $user = User::create([
                'name' => trim("{$validated['first_name']} {$validated['middle_name']} {$validated['last_name']}"),
                'email' => $validated['email_address'],
                'password' => Hash::make($randomPassword),
                'user_type' => 'cooperator',
                'is_active' => true,
            ]);
            $createdNewUser = true;
        }

        // 2) Create SetUpCustomer (customer_application_id always null)
        $setupCustomer = SetUpCustomer::create([
            'first_name' => $validated['first_name'],
            'middle_name' => $validated['middle_name'] ?? null,
            'last_name' => $validated['last_name'],
            'suffix' => $validated['suffix'] ?? null,
            'designation_position' => $validated['designation_position'],
            'residential_address' => $validated['residential_address'],
            'user_id' => $user->id,
            'customer_application_id' => null,
            'is_active' => true,
        ]);

        // 3) Create business record (use relation if available)
        if (method_exists($setupCustomer, 'businesses')) {
            $business = $setupCustomer->businesses()->create([
                'name_of_agency_firm' => $validated['name_of_agency_firm'],
                'business_of_the_firm' => $validated['business_of_the_firm'],
                'product_line' => $validated['product_line'],
                'type_of_organization' => $validated['type_of_organization'],
                'date_established' => $validated['date_established'] ?? null,
                'name_of_head_of_agency_firm' => $validated['name_of_head_of_agency_firm'],
                'business_address' => $validated['business_address'],
                'contact_nos' => $validated['contact_nos'],
                'email_address' => $validated['email_address'],
                'website' => $validated['website'] ?? null,
                'is_active' => true,
            ]);
        } else {
            $business = SetUpCustomerBusiness::create([
                'setup_customer_id' => $setupCustomer->id,
                'name_of_agency_firm' => $validated['name_of_agency_firm'],
                'business_of_the_firm' => $validated['business_of_the_firm'],
                'product_line' => $validated['product_line'],
                'type_of_organization' => $validated['type_of_organization'],
                'date_established' => $validated['date_established'] ?? null,
                'name_of_head_of_agency_firm' => $validated['name_of_head_of_agency_firm'],
                'business_address' => $validated['business_address'],
                'contact_nos' => $validated['contact_nos'],
                'email_address' => $validated['email_address'],
                'website' => $validated['website'] ?? null,
                'is_active' => true,
            ]);
        }

        // Prepare applicant name (neat formatting)
        $applicantName = trim("{$validated['first_name']} {$validated['middle_name']} {$validated['last_name']} {$validated['suffix']}");

        // Dispatch email after commit — ONLY send the new email
        DB::afterCommit(function () use ($applicantName, $validated, $adminId, $user) {      

            // Generate reset password link
            try {
                $token = Password::broker()->createToken($user);
                $resetPasswordUrl = url(route('password.reset', [
                    'token' => $token,
                    'email' => $user->email,
                ], false));
            } catch (\Throwable $ex) {
                $resetPasswordUrl = '#';
                Log::warning('Failed creating reset token', ['error' => $ex->getMessage()]);
            }

            // Send ONLY the new cleaned email
            try {
                Mail::to($validated['email_address'])
                    ->send(new CustomerApplicationApprovedMail($applicantName, $resetPasswordUrl));
            } catch (\Throwable $ex) {
                Log::error('Failed sending CustomerApplicationApprovedMail', [
                    'error' => $ex->getMessage(),
                    'email' => $validated['email_address'],
                ]);
            }
        });

        DB::commit();

        // eager load relations for response
        $setupCustomer->load('businesses', 'user');

        /*
         * Return JSON for XHR/API and redirect back with flash for browser/Inertia.
         * Also consider X-Inertia header as a non-JSON browser request (so we treat it like a redirect).
         */
        // detect Inertia requests (they send X-Inertia header)
        $isInertia = $request->header('X-Inertia') !== null;

        $isJson = $request->wantsJson()
            || $request->ajax()
            || $request->header('X-Requested-With') === 'XMLHttpRequest';

        // If it's a JSON/XHR request and NOT an Inertia request, return JSON
        if ($isJson && ! $isInertia) {
            return response()->json([
                'message' => 'Customer, user and business created successfully',
                'user' => $user,
                'setup_customer' => $setupCustomer,
                'business' => $business,
                'created_new_user' => $createdNewUser,
            ], 201);
        }

        // Otherwise (browser/Inertia) redirect back with flash so view gets props.flash.success
        return redirect()->back()->with('success', 'SetUp Customer created successfully.');


        } catch (ValidationException $ve) {
            return response()->json(['message' => 'Validation failed', 'errors' => $ve->errors()], 422);
        } catch (\Illuminate\Database\QueryException $qe) {
            DB::rollBack();
            Log::error('DB error creating setup customer', ['error' => $qe->getMessage(), 'payload' => $request->all()]);
            return response()->json(['message' => 'Database error', 'error' => $qe->getMessage()], 500);
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Error creating setup customer', ['error' => $e->getMessage(), 'payload' => $request->all()]);
            return response()->json(['message' => 'Failed to add setup customer', 'error' => $e->getMessage()], 500);
        }
            
    }

}
