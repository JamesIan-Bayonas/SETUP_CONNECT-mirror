<?php

namespace App\Services;

use App\Models\DocumentType;

class DocumentTypeService
{
    public function getPaginatedDocumentTypes(int $perPage = 10)
    {
        return DocumentType::withCount('requirements')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    public function getActiveDocumentTypes()
    {
        return DocumentType::where('is_active', true)
            ->orderBy('name')
            ->get();
    }

    public function getById(int $id): DocumentType
    {
        return DocumentType::findOrFail($id);
    }

    public function create(array $data): DocumentType
    {
        return DocumentType::create($data);
    }

    public function update(DocumentType $documentType, array $data): DocumentType
    {
        $documentType->update($data);
        return $documentType;
    }

    public function delete(DocumentType $documentType): ?bool
    {
        return $documentType->delete();
    }
}
