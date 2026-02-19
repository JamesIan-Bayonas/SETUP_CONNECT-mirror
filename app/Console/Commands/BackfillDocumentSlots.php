<?php

namespace App\Console\Commands;

use App\Models\SetUpCustomerBusiness;
use App\Services\CustomerBusinessDocumentService;
use Illuminate\Console\Command;

class BackfillDocumentSlots extends Command
{
    protected $signature = 'documents:backfill';
    protected $description = 'Create pending document slots for all existing setup customer businesses';

    public function handle(CustomerBusinessDocumentService $service): void
    {
        $businesses = SetUpCustomerBusiness::all();
        $count = 0;

        foreach ($businesses as $business) {
            if ($business->business_organization_type_id) {
                $service->createPendingForBusiness($business->id, $business->business_organization_type_id);
                $count++;
            }
        }

        $this->info("Backfilled document slots for {$count} businesses.");
    }
}
