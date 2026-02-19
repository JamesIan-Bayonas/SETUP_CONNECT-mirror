<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CustomerDocumentAuditLog extends Model
{
    protected $table = 'customer_document_audit_logs';

    protected $fillable = [
        'customer_business_document_id',
        'action',
        'status_before',
        'status_after',
        'file_path',
        'original_filename',
        'remarks',
        'performed_by',
    ];

    public function document(): BelongsTo
    {
        return $this->belongsTo(CustomerBusinessDocument::class, 'customer_business_document_id');
    }

    public function performedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'performed_by');
    }
}
