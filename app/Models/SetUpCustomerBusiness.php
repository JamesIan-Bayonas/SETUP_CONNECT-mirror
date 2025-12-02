<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\SetUpCustomer;

class SetUpCustomerBusiness extends Model
{
    protected $table = 'setup_customer_businesses';

    protected $fillable = [
        'setup_customer_id',
        'name_of_agency_firm',
        'business_of_the_firm',
        'product_line',
        'type_of_organization',
        'date_established',
        'name_of_head_of_agency_firm',
        'business_address'
    ];

    /**
     * The customer that owns this business.
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(SetUpCustomer::class, 'setup_customer_id');
    }
}
