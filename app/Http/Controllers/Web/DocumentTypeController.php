<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\DocumentType;
use App\Services\DocumentTypeService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DocumentTypeController extends Controller
{
    protected DocumentTypeService $documentTypeService;

    public function __construct(DocumentTypeService $documentTypeService)
    {
        $this->documentTypeService = $documentTypeService;
    }

    public function index()
    {
        $documentTypes = $this->documentTypeService->getPaginatedDocumentTypes();

        return Inertia::render('DocumentTypes/Index', [
            'documentTypes' => $documentTypes,
        ]);
    }

    public function create()
    {
        return Inertia::render('DocumentTypes/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255|unique:document_types,name',
            'description' => 'nullable|string|max:1000',
        ]);

        $this->documentTypeService->create($validated);

        return redirect()->route('document-types.index')
            ->with('success', 'Document type created successfully.');
    }

    public function edit(DocumentType $documentType)
    {
        return Inertia::render('DocumentTypes/Edit', [
            'documentType' => $documentType,
        ]);
    }

    public function update(Request $request, DocumentType $documentType)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255|unique:document_types,name,' . $documentType->id,
            'description' => 'nullable|string|max:1000',
            'is_active'   => 'boolean',
        ]);

        $this->documentTypeService->update($documentType, $validated);

        return redirect()->route('document-types.index')
            ->with('success', 'Document type updated successfully.');
    }

    public function destroy(DocumentType $documentType)
    {
        $requirementCount = $documentType->requirements()->count();
        $this->documentTypeService->delete($documentType);

        $extra = $requirementCount > 0
            ? " {$requirementCount} linked requirement(s) were also removed."
            : '';

        return redirect()->route('document-types.index')
            ->with('success', 'Document type deleted successfully.' . $extra);
    }
}
