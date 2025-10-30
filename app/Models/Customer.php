<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'designation_position',
        'residential_address',
        'agency_firm',
        'business_of_firm',
        'product_line',
        'type_of_organization',
        'date_established',
        'head_of_agency_firm',
        'business_address',
        'contact_nos',
        'website_email',
        'project_fund_setup_gia_rd',
        'consultancy_services',
        'packaging',
        'labeling',
        'laboratory_services',
        'technical_training',
        'other_services',
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
            'accomplished_date' => 'date',
            'handled_date' => 'date',
            'noted_date' => 'date',
            'project_fund_setup_gia_rd' => 'boolean',
            'consultancy_services' => 'boolean',
            'packaging' => 'boolean',
            'labeling' => 'boolean',
            'laboratory_services' => 'boolean',
            'technical_training' => 'boolean',
        ];
    }
}
