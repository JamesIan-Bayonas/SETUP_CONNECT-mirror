<?php

namespace App\Http\Controllers\Web;

use App\Services\BusinessOrganizationTypeRequirementService;
use App\Services\BusinessOrganizationTypeService;
use App\Http\Controllers\Controller;
use App\Models\BusinessOrganizationTypeRequirement;
use App\Models\BusinessOrganizationType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BusinessOrganizationTypeController extends Controller 
{
    protected BusinessOrganizationTypeService $businessOrganizationTypeService;
    protected BusinessOrganizationTypeRequirementService $businessOrganizationTypeRequirementService;

    public function __construct(BusinessOrganizationTypeService $businessOrganizationTypeService, BusinessOrganizationTypeRequirementService $businessOrganizationTypeRequirementService) {
        $this->businessOrganizationTypeService = $businessOrganizationTypeService;
        $this->businessOrganizationTypeRequirementService = $businessOrganizationTypeRequirementService;
    }

    /**
     * Display a paginated list of business organization types.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $businessOrgTypes = $this->businessOrganizationTypeService->getPaginatedBusinessOrgTypes();

        return Inertia::render('BusinessOrganizationTypes/Index', [
            'orgTypes' => $businessOrgTypes,
        ]);
    }

    /**
     * Show the details of a specific business organization type.
     *
     * @param BusinessOrganizationType $orgType
     * @return \Inertia\Response
     */
    public function show(BusinessOrganizationType $orgType)
    {
        $orgType->load('requirements');

        return Inertia::render('BusinessOrganizationTypes/Show', [
            'orgType' => $orgType,
        ]);
    }

    /**
     * Show the form to create a new business organization type.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        return Inertia::render('BusinessOrganizationTypes/Create');
    }

    /**
     * Store a newly created business organization type.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'requirements' => 'array',
            'requirements.*.description' => 'required|string',
            'requirements.*.require_attachment' => 'boolean',
        ]); 

        $orgType = $this->businessOrganizationTypeService->create([
            'name' => $validated['name'],
        ]);

        if (!empty($validated['requirements'])) {
            foreach ($validated['requirements'] as $req) {
                $this->businessOrganizationTypeRequirementService->create([
                    'business_organization_type_id' => $orgType->id,
                    'description' => $req['description'],
                    'require_attachment' => $req['require_attachment'],
                ]);
            }
        }

        return redirect()->route('org-types.index')
            ->with('success', 'Business organization type created successfully.');
    }

    /**
     * Show the form for editing the specified organization type.
     */
    public function edit(BusinessOrganizationType $orgType)
    {
        $orgType->load('requirements');

        return Inertia::render('BusinessOrganizationTypes/Edit', [
            'orgType' => $orgType,
        ]);
    }

    /**
     * Update the specified organization type.
     */
    public function update(Request $request, BusinessOrganizationType $orgType)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'requirements' => 'array',
            'requirements.*.id' => 'nullable|integer|exists:business_organization_type_requirements,id',
            'requirements.*.description' => 'required|string',
            'requirements.*.require_attachment' => 'boolean',
        ]); 

        $this->businessOrganizationTypeService->update($orgType, [
            'name' => $validated['name'],
        ]);

        $submitted = $validated['requirements'] ?? [];

        $existingIds = $orgType->requirements()->pluck('id')->toArray();
        $submittedIds = [];

        foreach ($submitted as $reqData) {
            // If this requirement has an ID, update
            if (!empty($reqData['id'])) {
                $submittedIds[] = $reqData['id'];

                $requirement = $orgType->requirements()->find($reqData['id']);

                if ($requirement) {
                    $this->businessOrganizationTypeRequirementService->update($requirement, [
                        'description' => $reqData['description'],
                        'require_attachment' => $reqData['require_attachment'],
                    ]);
                }
            }
            else {
                // Otherwise, create a new requirement
                $new = $this->businessOrganizationTypeRequirementService->create([
                    'business_organization_type_id' => $orgType->id,
                    'description' => $reqData['description'],
                    'require_attachment' => $reqData['require_attachment'],
                ]);

                $submittedIds[] = $new->id;
            }
        }

         $toDelete = array_diff($existingIds, $submittedIds);
        if (!empty($toDelete)) {
            $this->businessOrganizationTypeRequirementService
                ->deleteMultipleByIds($toDelete);
        }

        return redirect()->route('org-types.index')
            ->with('success', 'Business organization type updated successfully.');
    }

    /**
     * Remove the specified organization type.
     */
    public function destroy(BusinessOrganizationType $orgType)
    {
        $this->businessOrganizationTypeService->delete($orgType);

        return redirect()->route('org-types.index')
            ->with('success', 'Business organization type deleted successfully.');
    }
}