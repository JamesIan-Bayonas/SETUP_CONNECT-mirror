<?php

namespace App\Console\Commands;

use App\Models\SetUpCustomerBusiness;
use App\Services\ManifestationOfIntentService;
use Illuminate\Console\Command;

class BackfillMoiSlots extends Command
{
    protected $signature = 'moi:backfill';
    protected $description = 'Create pending MOI records for businesses that are missing one.';

    public function handle(ManifestationOfIntentService $service): void
    {
        $businesses = SetUpCustomerBusiness::with('moi')->get();
        $created = 0;

        foreach ($businesses as $business) {
            if (! $business->moi) {
                $service->createForBusiness($business->setup_customer_id, $business->id);
                $this->line("Created MOI for business #{$business->id} — {$business->name_of_agency_firm}");
                $created++;
            }
        }

        $this->info($created > 0 ? "Done. Created {$created} MOI record(s)." : 'All businesses already have an MOI record.');
    }
}
