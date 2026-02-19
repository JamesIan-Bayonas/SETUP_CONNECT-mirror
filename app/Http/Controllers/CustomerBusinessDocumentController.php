<?php

namespace App\Http\Controllers;

use App\Models\CustomerBusinessDocument;
use App\Models\SetUpCustomer;
use App\Services\CustomerBusinessDocumentService;
use App\Enums\UserType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerBusinessDocumentController extends Controller
{
    protected CustomerBusinessDocumentService $service;

    public function __construct(CustomerBusinessDocumentService $service)
    {
        $this->service = $service;
    }

    /**
     * Upload a document file.
     * Accessible by: admin, psto_staff (any document) and cooperator (own documents only).
     */
    public function upload(Request $request, CustomerBusinessDocument $document)
    {
        $user = auth()->user();

        // Cooperators can only upload for their own businesses
        if ($user->user_type === UserType::COOPERATOR) {
            $setupCustomer = $document->business->setupCustomer;
            if (!$setupCustomer || $setupCustomer->user_id !== $user->id) {
                return response()->json(['message' => 'Unauthorized.'], 403);
            }
        }

        $request->validate([
            'file' => 'required|file|max:10240', // 10 MB
        ]);

        $updated = $this->service->upload($document, $request->file('file'), $user->id);

        // Inertia requests (cooperator portal) → redirect back with flash
        if ($request->header('X-Inertia')) {
            return redirect()->back()->with('success', 'Document uploaded successfully.');
        }

        return response()->json([
            'message'  => 'Document uploaded successfully.',
            'document' => $this->service->format($updated),
        ]);
    }

    /**
     * Verify a document slot (admin / psto_staff only).
     */
    public function verify(Request $request, CustomerBusinessDocument $document)
    {
        $this->authorizeStaff();

        $request->validate([
            'remarks' => 'nullable|string|max:1000',
        ]);

        $updated = $this->service->verify($document, auth()->id(), $request->remarks);

        return response()->json([
            'message'  => 'Document verified.',
            'document' => $this->service->format($updated),
        ]);
    }

    /**
     * Reject a document slot (admin / psto_staff only).
     */
    public function reject(Request $request, CustomerBusinessDocument $document)
    {
        $this->authorizeStaff();

        $request->validate([
            'remarks' => 'required|string|max:1000',
        ]);

        $updated = $this->service->reject($document, auth()->id(), $request->remarks);

        return response()->json([
            'message'  => 'Document rejected.',
            'document' => $this->service->format($updated),
        ]);
    }

    /**
     * Cooperator's document portal — shows their own document requirements.
     */
    public function myDocuments()
    {
        $user = auth()->user();

        $setupCustomer = SetUpCustomer::with([
            'businesses.orgType',
            'businesses.documents.requirement.documentType',
            'businesses.documents.uploadedByUser',
            'businesses.documents.verifiedByUser',
            'businesses.documents.auditLogs',
        ])->where('user_id', $user->id)->first();

        $data = null;

        if ($setupCustomer) {
            $data = [
                'id'         => $setupCustomer->id,
                'full_name'  => $setupCustomer->full_name,
                'businesses' => $setupCustomer->businesses->map(function ($business) {
                    $docs = $business->documents;
                    return [
                        'id'           => $business->id,
                        'name'         => $business->name_of_agency_firm,
                        'org_type'     => $business->orgType?->name,
                        'doc_count'    => $docs->count(),
                        'verified_count' => $docs->where('status', 'verified')->count(),
                        'documents'    => $docs->map(fn($d) => $this->service->format($d))->values(),
                    ];
                }),
            ];
        }

        return Inertia::render('Documents/MyDocuments', [
            'setupCustomer' => $data,
        ]);
    }

    private function authorizeStaff(): void
    {
        $user = auth()->user();
        if ($user->user_type !== UserType::ADMIN && $user->user_type !== UserType::PSTO_STAFF) {
            abort(403, 'Only staff can perform this action.');
        }
    }
}
