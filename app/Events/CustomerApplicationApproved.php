<?php

namespace App\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CustomerApplicationApproved
{
    use Dispatchable, SerializesModels;

    public string $applicantName;
    public string $applicantEmail;
    public ?int $applicationId;
    public ?int $approvedByUserId;
    public ?string $approvedAtIso;

    public function __construct(
        string $applicantName,
        string $applicantEmail,
        ?int $applicationId = null,
        ?int $approvedByUserId = null,
        ?string $approvedAtIso = null,
    ) {
        $this->applicantName = $applicantName;
        $this->applicantEmail = $applicantEmail;
        $this->applicationId = $applicationId;
        $this->approvedByUserId = $approvedByUserId;
        $this->approvedAtIso = $approvedAtIso;
    }
}


