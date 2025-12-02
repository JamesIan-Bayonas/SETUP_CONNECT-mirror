<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\User;
use App\Models\SetUpCustomerBusiness;

class SetUpCustomer extends Model
{
    protected $table = 'setup_customers';

    protected $fillable = [
        'first_name',
        'middle_name',
        'last_name',
        'suffix',
        'designation_position',
        'residential_address',
        'contact_nos',
        'email_address',
        'website',
        'status',
        'decision_date',
        'decided_by',
        'user_id'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'decision_date' => 'datetime',
    ];

    /**
     * The user associated with this customer.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * The businesses associated with this customer.
     */
    public function businesses(): HasMany
    {
        return $this->hasMany(SetUpCustomerBusiness::class, 'setup_customer_id');
    }
}
