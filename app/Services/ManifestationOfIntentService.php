<?php

namespace App\Services;

use App\Mail\TnaScheduledMail;
use App\Models\ManifestationOfIntent;
use App\Models\TnaSchedule;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

class ManifestationOfIntentService
{
    /**
     * Create a pending MOI record for a newly created business.
     * Uses firstOrCreate so it is safe to call multiple times.
     */
    public function createForBusiness(int $setupCustomerId, int $setupCustomerBusinessId): ManifestationOfIntent
    {
        return ManifestationOfIntent::firstOrCreate(
            [
                'setup_customer_id'          => $setupCustomerId,
                'setup_customer_business_id' => $setupCustomerBusinessId,
            ],
            ['status' => 'pending_upload']
        );
    }

    /**
     * Cooperator uploads the signed MOI form along with proponent details.
     */
    public function upload(
        ManifestationOfIntent $moi,
        UploadedFile $file,
        array $data
    ): ManifestationOfIntent {
        // Delete previous file if it exists
        if ($moi->signed_file_path) {
            Storage::disk('public')->delete($moi->signed_file_path);
        }

        $path = $file->store("moi/{$moi->setup_customer_id}", 'public');

        $moi->update([
            'signed_file_path'    => $path,
            'original_filename'   => $file->getClientOriginalName(),
            'uploaded_at'         => now(),
            'status'              => 'uploaded',
            'interventions'       => $data['interventions'] ?? [],
            'other_intervention'  => $data['other_intervention'] ?? null,
            'training_specify'    => $data['training_specify'] ?? null,
            'proponent_name'      => $data['proponent_name'] ?? null,
            'proponent_date'      => $data['proponent_date'] ?? null,
            'proponent_address'   => $data['proponent_address'] ?? null,
            'proponent_contact'   => $data['proponent_contact'] ?? null,
        ]);

        return $moi->fresh();
    }

    /**
     * Staff acknowledges the uploaded MOI.
     */
    public function acknowledge(ManifestationOfIntent $moi, int $staffUserId): ManifestationOfIntent
    {
        $moi->update([
            'status'           => 'acknowledged',
            'acknowledged_by'  => $staffUserId,
            'acknowledged_at'  => now(),
        ]);

        return $moi->fresh();
    }

    /**
     * Staff schedules a TNA session for an acknowledged MOI.
     */
    public function scheduleTna(ManifestationOfIntent $moi, array $data): TnaSchedule
    {
        // If a schedule already exists, update it
        if ($moi->tnaSchedule) {
            $moi->tnaSchedule->update([
                'scheduled_date' => $data['scheduled_date'],
                'location'       => $data['location'],
                'conducted_by'   => $data['conducted_by'] ?? null,
                'status'         => $data['status'] ?? 'scheduled',
                'notes'          => $data['notes'] ?? null,
            ]);

            $schedule = $moi->tnaSchedule->fresh(['conductedByUser']);
        } else {
            $schedule = TnaSchedule::create([
                'manifestation_of_intent_id' => $moi->id,
                'setup_customer_id'          => $moi->setup_customer_id,
                'scheduled_date'             => $data['scheduled_date'],
                'location'                   => $data['location'],
                'conducted_by'               => $data['conducted_by'] ?? null,
                'status'                     => $data['status'] ?? 'scheduled',
                'notes'                      => $data['notes'] ?? null,
            ]);
            $schedule->load('conductedByUser');
        }

        $this->sendTnaEmail($moi, $schedule);

        return $schedule;
    }

    private function sendTnaEmail(ManifestationOfIntent $moi, TnaSchedule $schedule): void
    {
        try {
            // Load the cooperator email through the SetUpCustomer → User relation
            $moi->loadMissing(['setupCustomer.user', 'business']);

            $cooperatorEmail = $moi->setupCustomer?->user?->email;
            $cooperatorName  = $moi->setupCustomer?->full_name
                ?? $moi->setupCustomer?->user?->name
                ?? 'Cooperator';
            $businessName    = $moi->business?->name_of_agency_firm ?? 'your business';

            if (! $cooperatorEmail) {
                Log::warning('TnaScheduledMail: no cooperator email found', ['moi_id' => $moi->id]);
                return;
            }

            Mail::to($cooperatorEmail)->send(new TnaScheduledMail(
                cooperatorName:  $cooperatorName,
                businessName:    $businessName,
                scheduledDate:   $schedule->scheduled_date->format('F j, Y \a\t g:i A'),
                location:        $schedule->location,
                conductedByName: $schedule->conductedByUser?->name,
                notes:           $schedule->notes,
            ));
        } catch (\Throwable $e) {
            Log::error('TnaScheduledMail: failed to send', [
                'moi_id' => $moi->id,
                'error'  => $e->getMessage(),
            ]);
        }
    }

    /**
     * Serialize an MOI (with optional eagerly loaded tnaSchedule) to an array.
     */
    public function format(ManifestationOfIntent $moi): array
    {
        $tna = $moi->relationLoaded('tnaSchedule') ? $moi->tnaSchedule : null;

        return [
            'id'                 => $moi->id,
            'status'             => $moi->status,
            'interventions'      => $moi->interventions ?? [],
            'other_intervention' => $moi->other_intervention,
            'training_specify'   => $moi->training_specify,
            'proponent_name'     => $moi->proponent_name,
            'proponent_date'     => $moi->proponent_date?->format('Y-m-d'),
            'proponent_address'  => $moi->proponent_address,
            'proponent_contact'  => $moi->proponent_contact,
            'signed_file_path'   => $moi->signed_file_path,
            'original_filename'  => $moi->original_filename,
            'uploaded_at'        => $moi->uploaded_at?->toIso8601String(),
            'acknowledged_by_name' => $moi->acknowledgedByUser?->name,
            'acknowledged_at'    => $moi->acknowledged_at?->toIso8601String(),
            'tna_schedule'       => $tna ? [
                'id'               => $tna->id,
                'scheduled_date'   => $tna->scheduled_date->toIso8601String(),
                'location'         => $tna->location,
                'conducted_by_name' => $tna->conductedByUser?->name,
                'status'           => $tna->status,
                'notes'            => $tna->notes,
            ] : null,
        ];
    }
}
