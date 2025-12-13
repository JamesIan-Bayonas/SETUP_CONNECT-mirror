<?php

namespace App\Http\Controllers\Api;

use App\Services\BusinessOrganizationTypeService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\BusinessOrganizationType;

class BusinessOrganizationTypeApiController extends Controller 
{
    protected BusinessOrganizationTypeService $businessOrganizationTypeService;

    public function __construct(BusinessOrganizationTypeService $businessOrganizationTypeService) {
        $this->businessOrganizationTypeService = $businessOrganizationTypeService;
    }

    /**
     * Return a JSON response of all active business organization types.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $businessOrgTypes = $this->businessOrganizationTypeService->getActiveBusinessOrgTypes();

        return response()->json($businessOrgTypes);
    }
}