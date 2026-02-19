<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BusinessOrganizationTypeRequirement extends Model
{
    protected $table = "business_organization_type_requirements";

    protected $fillable = [
        'business_organization_type_id',
        'document_type_id',
        'require_attachment',
        'is_active',
    ];

    protected $casts = [
        'require_attachment' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function orgType(): BelongsTo
    {
        return $this->belongsTo(
            BusinessOrganizationType::class,
            'business_organization_type_id'
        );
    }

    public function documentType(): BelongsTo
    {
        return $this->belongsTo(\App\Models\DocumentType::class, 'document_type_id');
    }
}