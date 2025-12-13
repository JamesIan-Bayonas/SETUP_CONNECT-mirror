<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'customer_applications';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'first_name',
        'middle_name',
        'last_name',
        'suffix',
        'designation_position',
        'residential_address',
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
        'status',
        'decision_date',
        'decided_by',
        'user_id',
        'accomplished_by',
        'accomplished_date',
        'remarks_action_taken',
        'handled_by',
        'handled_date',
        'remarks_by_cpstd',
        'noted_by',
        'noted_date',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'date_established' => 'date',
            'decision_date' => 'datetime',
            'accomplished_date' => 'date',
            'handled_date' => 'date',
            'noted_date' => 'date',
        ];
    }

    /**
     * Get the user (cooperator) associated with this application.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the admin who decided on this application.
     */
    public function decidedByUser()
    {
        return $this->belongsTo(User::class, 'decided_by');
    }

    /*
        Get the type of organization of the specified business.
    */
    public function businessOrgType()
    {
        return $this->belongsTo(
            BusinessOrganizationType::class, 
            'business_organization_type_id'
        );
    }
}
