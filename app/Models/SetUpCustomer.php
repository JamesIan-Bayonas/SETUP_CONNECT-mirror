<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SetUpCustomer extends Model
{
    use HasFactory;

    protected $table = 'setup_customers';

    protected $fillable = [
        'first_name',
        'middle_name',
        'last_name',
        'suffix',
        'designation_position',
        'residential_address',
        'user_id',
        'customer_application_id',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Get the user (cooperator) associated with this setup customer.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the original customer application.
     */
    public function customerApplication()
    {
        return $this->belongsTo(Customer::class, 'customer_application_id');
    }

    /**
     * Get all businesses for this setup customer.
     */
    public function businesses()
    {
        return $this->hasMany(SetUpCustomerBusiness::class, 'setup_customer_id');
    }

    /**
     * Get full name attribute.
     */
    public function getFullNameAttribute()
    {
        return trim("{$this->first_name} {$this->middle_name} {$this->last_name} {$this->suffix}");
    }
}
