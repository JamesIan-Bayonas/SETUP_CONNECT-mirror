<?php

namespace App\Http\Controllers;

use App\Enums\UserType;
use App\Models\ManifestationOfIntent;
use App\Models\SetUpCustomer;
use App\Models\User;
use App\Services\ManifestationOfIntentService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ManifestationOfIntentController extends Controller
{
    public function __construct(protected ManifestationOfIntentService $service) {}

    // ─── Cooperator ───────────────────────────────────────────────────────────

    /**
     * Render the cooperator My MOI page.
     */
    public function myMoi()
    {
        $user = auth()->user();

        $setupCustomer = SetUpCustomer::with([
            'businesses.moi.tnaSchedule',
            'businesses.moi.acknowledgedByUser',
            'businesses.moi.tnaSchedule.conductedByUser',
        ])->where('user_id', $user->id)->first();

        $businesses = [];

        if ($setupCustomer) {
            $businesses = $setupCustomer->businesses->map(function ($business) {
                $moi = $business->moi;

                return [
                    'id'                   => $business->id,
                    'name_of_agency_firm'  => $business->name_of_agency_firm,
                    'moi'                  => $moi ? $this->service->format($moi) : null,
                ];
            })->values();
        }

        return Inertia::render('Documents/MyMOI', [
            'businesses' => $businesses,
        ]);
    }

    /**
     * Upload the signed MOI form with proponent data.
     * Cooperators can only upload to their own MOI records.
     * Staff / Admin can upload on behalf of any cooperator.
     */
    public function upload(Request $request, ManifestationOfIntent $moi)
    {
        $user = auth()->user();

        if ($user->user_type === UserType::COOPERATOR) {
            // Cooperators may only touch their own record
            $setupCustomer = SetUpCustomer::where('user_id', $user->id)->first();
            if (! $setupCustomer || $setupCustomer->id !== $moi->setup_customer_id) {
                return response()->json(['message' => 'Forbidden.'], 403);
            }
        } elseif (
            $user->user_type !== UserType::ADMIN &&
            $user->user_type !== UserType::PSTO_STAFF
        ) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $validated = $request->validate([
            'signed_form'        => 'required|file|mimes:pdf,jpg,jpeg,png|max:10240',
            'interventions'      => 'nullable|array',
            'interventions.*'    => 'string',
            'other_intervention' => 'nullable|string|max:500',
            'training_specify'   => 'nullable|string|max:500',
            'proponent_name'     => 'nullable|string|max:255',
            'proponent_date'     => 'nullable|date',
            'proponent_address'  => 'nullable|string|max:500',
            'proponent_contact'  => 'nullable|string|max:100',
        ]);

        $this->service->upload($moi, $request->file('signed_form'), $validated);

        return response()->json(['message' => 'MOI uploaded successfully.']);
    }

    // ─── Staff / Admin ────────────────────────────────────────────────────────

    /**
     * Staff acknowledges the uploaded MOI.
     */
    public function acknowledge(ManifestationOfIntent $moi)
    {
        $this->authorizeStaff();

        if ($moi->status !== 'uploaded') {
            return response()->json(['message' => 'MOI is not in an uploaded state.'], 422);
        }

        $this->service->acknowledge($moi, auth()->id());

        return response()->json(['message' => 'MOI acknowledged.']);
    }

    /**
     * Staff schedules a TNA session for an acknowledged MOI.
     */
    public function scheduleTna(Request $request, ManifestationOfIntent $moi)
    {
        $this->authorizeStaff();

        $validated = $request->validate([
            'scheduled_date' => 'required|date',
            'location'       => 'required|string|max:500',
            'conducted_by'   => 'nullable|exists:users,id',
            'status'         => 'nullable|in:scheduled,completed,cancelled',
            'notes'          => 'nullable|string|max:1000',
        ]);

        $schedule = $this->service->scheduleTna($moi, $validated);

        return response()->json([
            'message'  => 'TNA scheduled.',
            'schedule' => [
                'id'                => $schedule->id,
                'scheduled_date'    => $schedule->scheduled_date->toIso8601String(),
                'location'          => $schedule->location,
                'conducted_by_name' => $schedule->conductedByUser?->name,
                'status'            => $schedule->status,
                'notes'             => $schedule->notes,
            ],
        ]);
    }

    /**
     * List staff users for the TNA "conducted by" dropdown.
     */
    public function staffList()
    {
        $this->authorizeStaff();

        $staff = User::whereIn('user_type', [UserType::ADMIN->value, UserType::PSTO_STAFF->value])
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        return response()->json($staff);
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    private function authorizeStaff(): void
    {
        $user = auth()->user();
        if (
            $user->user_type !== UserType::ADMIN &&
            $user->user_type !== UserType::PSTO_STAFF
        ) {
            abort(403);
        }
    }
}
