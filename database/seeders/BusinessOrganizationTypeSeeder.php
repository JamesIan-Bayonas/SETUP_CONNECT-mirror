<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BusinessOrganizationTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $organizationTypes = [
            "Sole Proprietorship",
            "Partnership",
            "Corporation",
            "Cooperative",
            "Franchise",
            "Limited Liability Company (LLC)",
            "Joint Venture",
            "Holding Company",
            "Branch Office",
            "Subsidiary",
        ];

        foreach ($organizationTypes as $typeName) {
            DB::table('business_organization_types')->insert([
                'name' => $typeName,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
