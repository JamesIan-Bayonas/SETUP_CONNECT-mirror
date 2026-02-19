<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TnaSchedule extends Model
{
    protected $table = 'tna_schedules';

    protected $fillable = [
        'manifestation_of_intent_id',
        'setup_customer_id',
        'scheduled_date',
        'location',
        'conducted_by',
        'status',
        'notes',
    ];

    protected $casts = [
        'scheduled_date' => 'datetime',
    ];

    public function manifestationOfIntent()
    {
        return $this->belongsTo(ManifestationOfIntent::class, 'manifestation_of_intent_id');
    }

    public function setupCustomer()
    {
        return $this->belongsTo(SetUpCustomer::class, 'setup_customer_id');
    }

    public function conductedByUser()
    {
        return $this->belongsTo(User::class, 'conducted_by');
    }
}
