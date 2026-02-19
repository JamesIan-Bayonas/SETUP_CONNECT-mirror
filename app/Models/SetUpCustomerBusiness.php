<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SetUpCustomerBusiness extends Model
{
    use HasFactory;

    protected $table = 'setup_customer_businesses';

    protected $fillable = [
        'setup_customer_id',
        'name_of_agency_firm',
        'business_of_the_firm',
        'product_line',
        'business_organization_type_id',
        'date_established',
        'name_of_head_of_agency_firm',
        'business_address',
        'contact_nos',
        'email_address',
        'website',
        'is_active',
    ];

    protected $casts = [
        'date_established' => 'date',
        'is_active' => 'boolean',
    ];

    /**
     * Get the setup customer that owns this business.
     */
    public function setupCustomer()
    {
        return $this->belongsTo(SetUpCustomer::class, 'setup_customer_id');
    }

    /*
        Get the type of organization of this business.
    */
    public function orgType()
    {
        return $this->belongsTo(
            BusinessOrganizationType::class, 
            'business_organization_type_id'
        );
    }

    /**
     * Get the document requirement slots for this business.
     */
    public function documents(): HasMany
    {
        return $this->hasMany(\App\Models\CustomerBusinessDocument::class, 'setup_customer_business_id');
    }

    /**
     * Get the Manifestation of Intent for this business.
     */
    public function moi()
    {
        return $this->hasOne(\App\Models\ManifestationOfIntent::class, 'setup_customer_business_id');
    }
}
