<?php

namespace App\Services;

use App\Models\BusinessOrganizationType;
use Illuminate\Http\Request;

class BusinessOrganizationTypeService
{
    /**
     * Get paginated list of business organization types.
     *
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getPaginatedBusinessOrgTypes(int $perPage = 10)
    {
        $paginatedOrgTypes = BusinessOrganizationType::with('requirements')
            ->orderBy('created_at','desc')
            ->paginate($perPage);
        
        return $paginatedOrgTypes;
    }

    /**
     * Get all active business organization types.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getActiveBusinessOrgTypes()
    {
        $activeOrgTypes = BusinessOrganizationType::with('requirements')
            ->where('is_active', true)
            ->get();

        return $activeOrgTypes;
    }

    /**
     * Find a business organization type by ID or throw an exception.
     *
     * @param  int  $id
     * @return BusinessOrganizationType
     */
    public function getById(int $id): BusinessOrganizationType
    {
        return BusinessOrganizationType::with('requirements')->findOrFail($id);
    }

    /**
     * Create a new business organization type.
     *
     * @param  array  $data
     * @return BusinessOrganizationType
     */
    public function create(array $data)
    {
        return BusinessOrganizationType::create($data);
    }

    /**
     * Update an existing business organization type.
     *
     * @param  BusinessOrganizationType  $orgType
     * @param  array  $data
     * @return BusinessOrganizationType
     */
    public function update(BusinessOrganizationType $orgType, array $data): BusinessOrganizationType
    {
        $orgType->update($data);
        return $orgType;
    }

    /**
     * Delete a business organization type.
     *
     * @param  BusinessOrganizationType  $orgType
     * @return bool|null
     */
    public function delete(BusinessOrganizationType $orgType): ?bool
    {
        return $orgType->delete();
    }
}