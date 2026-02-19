<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\DocumentTypeService;

class DocumentTypeApiController extends Controller
{
    protected DocumentTypeService $documentTypeService;

    public function __construct(DocumentTypeService $documentTypeService)
    {
        $this->documentTypeService = $documentTypeService;
    }

    /**
     * Return all active document types for use in dropdowns.
     */
    public function index()
    {
        return response()->json(
            $this->documentTypeService->getActiveDocumentTypes()
        );
    }
}
