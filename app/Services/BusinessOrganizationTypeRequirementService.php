<?php

namespace App\Services;

use App\Models\BusinessOrganizationTypeRequirement;
use Illuminate\Http\Request;

class BusinessOrganizationTypeRequirementService
{
    /**
     * Get all requirements for a given business organization type ID.
     *
     * @param  int  $id
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getOrgTypeRequirements(int $id)
    {
        return BusinessOrganizationTypeRequirement::where('business_organization_type_id', $id)
            ->get();
    }

    /**
     * Create a new requirement for a business organization type.
     *
     * @param  array  $data
     * @return BusinessOrganizationTypeRequirement
     */
    public function create(array $data)
    {
        return BusinessOrganizationTypeRequirement::create($data);
    }

    /**
     * Update an existing requirement.
     *
     * @param  BusinessOrganizationTypeRequirement  $requirement
     * @param  array  $data
     * @return BusinessOrganizationTypeRequirement
     */
    public function update(BusinessOrganizationTypeRequirement $requirement, array $data)
    {
        $requirement->update($data);
        return $requirement;
    }

    /**
     * Delete the specified requirement.
     *
     * @param  BusinessOrganizationTypeRequirement  $requirement
     * @return bool|null
     */
    public function delete(BusinessOrganizationTypeRequirement $requirement)
    {
        return $requirement->delete();
    }

    public function deleteMultipleByIds(array $ids)
    {
        return BusinessOrganizationTypeRequirement::whereIn('id', $ids)->delete();
    }
}