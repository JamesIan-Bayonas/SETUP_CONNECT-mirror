<?php

namespace App\Services;

use App\Models\BusinessOrganizationTypeRequirement;
use App\Models\CustomerBusinessDocument;
use App\Models\CustomerDocumentAuditLog;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class CustomerBusinessDocumentService
{
    /**
     * Auto-create a pending document slot for every requirement of an org type.
     * Uses firstOrCreate so it is safe to call multiple times.
     */
    public function createPendingForBusiness(int $businessId, ?int $orgTypeId): void
    {
        if (!$orgTypeId) {
            return;
        }

        $requirements = BusinessOrganizationTypeRequirement::where(
            'business_organization_type_id', $orgTypeId
        )->get();

        foreach ($requirements as $requirement) {
            CustomerBusinessDocument::firstOrCreate([
                'setup_customer_business_id' => $businessId,
                'requirement_id'             => $requirement->id,
            ], [
                'status' => 'pending',
            ]);
        }
    }

    /**
     * Upload a file and mark the slot as submitted.
     */
    public function upload(CustomerBusinessDocument $document, UploadedFile $file, int $uploadedBy): CustomerBusinessDocument
    {
        $statusBefore = $document->status;
        $action = $statusBefore === 'pending' ? 'uploaded' : 're_uploaded';

        if ($document->file_path) {
            Storage::disk('public')->delete($document->file_path);
        }

        $path = $file->store(
            'customer-documents/' . $document->setup_customer_business_id,
            'public'
        );

        $document->update([
            'file_path'         => $path,
            'original_filename' => $file->getClientOriginalName(),
            'status'            => 'submitted',
            'uploaded_by'       => $uploadedBy,
            'remarks'           => null,
        ]);

        CustomerDocumentAuditLog::create([
            'customer_business_document_id' => $document->id,
            'action'            => $action,
            'status_before'     => $statusBefore,
            'status_after'      => 'submitted',
            'file_path'         => $path,
            'original_filename' => $file->getClientOriginalName(),
            'performed_by'      => $uploadedBy,
        ]);

        return $document->fresh(['uploadedByUser', 'verifiedByUser', 'requirement.documentType']);
    }

    /**
     * Mark a document slot as verified.
     */
    public function verify(CustomerBusinessDocument $document, int $verifiedBy, ?string $remarks = null): CustomerBusinessDocument
    {
        $statusBefore = $document->status;

        $document->update([
            'status'      => 'verified',
            'remarks'     => $remarks,
            'verified_by' => $verifiedBy,
            'verified_at' => now(),
        ]);

        CustomerDocumentAuditLog::create([
            'customer_business_document_id' => $document->id,
            'action'        => 'verified',
            'status_before' => $statusBefore,
            'status_after'  => 'verified',
            'remarks'       => $remarks,
            'performed_by'  => $verifiedBy,
        ]);

        return $document->fresh(['uploadedByUser', 'verifiedByUser', 'requirement.documentType']);
    }

    /**
     * Mark a document slot as rejected with required remarks.
     */
    public function reject(CustomerBusinessDocument $document, int $rejectedBy, string $remarks): CustomerBusinessDocument
    {
        $statusBefore = $document->status;

        $document->update([
            'status'      => 'rejected',
            'remarks'     => $remarks,
            'verified_by' => $rejectedBy,
            'verified_at' => now(),
        ]);

        CustomerDocumentAuditLog::create([
            'customer_business_document_id' => $document->id,
            'action'        => 'rejected',
            'status_before' => $statusBefore,
            'status_after'  => 'rejected',
            'remarks'       => $remarks,
            'performed_by'  => $rejectedBy,
        ]);

        return $document->fresh(['uploadedByUser', 'verifiedByUser', 'requirement.documentType']);
    }

    /**
     * Format a document record for JSON/frontend consumption.
     */
    public function format(CustomerBusinessDocument $doc): array
    {
        return [
            'id'                 => $doc->id,
            'requirement_id'     => $doc->requirement_id,
            'document_type_name' => $doc->requirement?->documentType?->name ?? 'Unknown',
            'require_attachment' => $doc->requirement?->require_attachment ?? false,
            'status'             => $doc->status,
            'file_path'          => $doc->file_path,
            'original_filename'  => $doc->original_filename,
            'remarks'            => $doc->remarks,
            'uploaded_by_name'   => $doc->uploadedByUser?->name,
            'verified_by_name'   => $doc->verifiedByUser?->name,
            'verified_at'        => $doc->verified_at?->format('Y-m-d H:i'),
            'audit_logs'         => $doc->relationLoaded('auditLogs')
                ? $doc->auditLogs->map(fn($log) => [
                    'action'            => $log->action,
                    'status_before'     => $log->status_before,
                    'status_after'      => $log->status_after,
                    'original_filename' => $log->original_filename,
                    'remarks'           => $log->remarks,
                    'performed_by_name' => $log->performedByUser?->name,
                    'created_at'        => $log->created_at->format('Y-m-d H:i'),
                ])->values()->toArray()
                : [],
        ];
    }
}
