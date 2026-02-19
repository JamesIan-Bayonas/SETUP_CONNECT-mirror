<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CustomerBusinessDocument extends Model
{
    protected $table = 'customer_business_documents';

    protected $fillable = [
        'setup_customer_business_id',
        'requirement_id',
        'file_path',
        'original_filename',
        'status',
        'remarks',
        'uploaded_by',
        'verified_by',
        'verified_at',
    ];

    protected $casts = [
        'verified_at' => 'datetime',
    ];

    public function business(): BelongsTo
    {
        return $this->belongsTo(SetUpCustomerBusiness::class, 'setup_customer_business_id');
    }

    public function requirement(): BelongsTo
    {
        return $this->belongsTo(BusinessOrganizationTypeRequirement::class, 'requirement_id');
    }

    public function uploadedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function verifiedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function auditLogs(): HasMany
    {
        return $this->hasMany(CustomerDocumentAuditLog::class, 'customer_business_document_id')
                    ->with('performedByUser')
                    ->orderBy('created_at', 'asc');
    }
}
