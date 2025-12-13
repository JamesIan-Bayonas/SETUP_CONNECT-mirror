<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BusinessOrganizationType extends Model 
{
    protected $table = "business_organization_types";

    protected $fillable = [
        'name',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean'
    ];

    public function requirements(): HasMany
    {
        return $this->hasMany(
            BusinessOrganizationTypeRequirement::class, 
            'business_organization_type_id'
        );
    }
}