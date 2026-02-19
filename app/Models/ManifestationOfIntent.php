<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ManifestationOfIntent extends Model
{
    protected $table = 'manifestation_of_intents';

    protected $fillable = [
        'setup_customer_id',
        'setup_customer_business_id',
        'status',
        'interventions',
        'other_intervention',
        'training_specify',
        'proponent_name',
        'proponent_date',
        'proponent_address',
        'proponent_contact',
        'signed_file_path',
        'original_filename',
        'uploaded_at',
        'acknowledged_by',
        'acknowledged_at',
    ];

    protected $casts = [
        'interventions'   => 'array',
        'proponent_date'  => 'date',
        'uploaded_at'     => 'datetime',
        'acknowledged_at' => 'datetime',
    ];

    public function setupCustomer()
    {
        return $this->belongsTo(SetUpCustomer::class, 'setup_customer_id');
    }

    public function business()
    {
        return $this->belongsTo(SetUpCustomerBusiness::class, 'setup_customer_business_id');
    }

    public function acknowledgedByUser()
    {
        return $this->belongsTo(User::class, 'acknowledged_by');
    }

    public function tnaSchedule()
    {
        return $this->hasOne(TnaSchedule::class, 'manifestation_of_intent_id');
    }
}
