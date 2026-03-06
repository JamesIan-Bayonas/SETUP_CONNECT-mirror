import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

type DocumentData = {
  name: string;
  category: string;
  format: string;
  size: string;
  uploadedBy: string;
  uploadDate: string;
  fileUrl: string;
};

const DocumentViewerModal = ({
  document,
  onClose,
}: {
  document: DocumentData;
  onClose: () => void;
}) => {
  const isPDF = document.format.toLowerCase() === "pdf";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-lg">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Document Viewer
            </h2>
            <p className="text-sm text-gray-500">
              Viewing: {document.name}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Metadata */}
        <div className="px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-400">Category</p>
            <span className="inline-block mt-1 px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
              {document.category}
            </span>
          </div>

          <div>
            <p className="text-gray-400">Format</p>
            <p className="font-medium text-gray-700">{document.format}</p>
          </div>

          <div>
            <p className="text-gray-400">Size</p>
            <p className="font-medium text-gray-700">{document.size}</p>
          </div>

          <div>
            <p className="text-gray-400">Uploaded By</p>
            <p className="font-medium text-gray-700">{document.uploadedBy}</p>
          </div>

          <div className="col-span-2">
            <p className="text-gray-400">Upload Date</p>
            <p className="font-medium text-gray-700">{document.uploadDate}</p>
          </div>
        </div>

        {/* Preview */}
        <div className="px-6 pb-4">
          <div className="border rounded-lg h-[420px] bg-gray-100 flex items-center justify-center overflow-hidden">
            {isPDF ? (
              <iframe
                src={document.fileUrl}
                className="w-full h-full"
                title="preview"
              />
            ) : (
              <img
                src={document.fileUrl}
                className="object-contain h-full"
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-50"
          >
            Close
          </button>

          <a
            href={document.fileUrl}
            download
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Download Document
          </a>
        </div>
      </div>
    </div>
  );
};

export default function DocumentView({ documents }: { documents?: DocumentData[] }) {
  const [open, setOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fallback hardcoded values for fields not available from HEAD request
  const fallbackCategory = "billing";
  const fallbackUploadedBy = "Admin User";

  // Sample file URL
  const sampleFileUrl = "/docs/SETUP-CONNECT-Complete-Project-Documentation.pdf";

  const fetchMetadata = async (fileUrl: string): Promise<DocumentData> => {
    try {
      const response = await fetch(fileUrl, { method: 'HEAD' });

      if (!response.ok) {
        throw new Error(`Failed to fetch metadata: ${response.statusText}`);
      }

      // Extract name from URL
      const name = fileUrl.split('/').pop() || 'Unknown';

      // Extract format from extension or Content-Type
      const extension = name.split('.').pop()?.toUpperCase() || '';
      const contentType = response.headers.get('Content-Type') || '';
      const format = extension || contentType.split('/').pop()?.toUpperCase() || 'UNKNOWN';

      // Get size in bytes, convert to KB
      const sizeBytes = parseInt(response.headers.get('Content-Length') || '0', 10);
      const size = `${(sizeBytes / 1024).toFixed(2)} KB`;

      // Get last modified date as upload date
      const lastModified = response.headers.get('Last-Modified');
      const uploadDate = lastModified ? new Date(lastModified).toLocaleString() : 'Unknown';

      return {
        name,
        category: fallbackCategory, // Not available from HEAD; use fallback or backend
        format,
        size,
        uploadedBy: fallbackUploadedBy, // Not available from HEAD; use fallback or backend
        uploadDate,
        fileUrl,
      };
    } catch (err) {
      throw err;
    }
  };

  const openDocument = async () => {
    setLoading(true);
    setError(null);
    try {
      const metadata = await fetchMetadata(sampleFileUrl);
      setSelectedDoc(metadata);
      setOpen(true);
    } catch (err) {
      setError('Failed to load document metadata.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // If documents prop is provided, use it; else use fetched sample
  const doc = documents?.[0] || null; // For now, assuming documents have metadata; adjust as needed

  return (
    <AuthenticatedLayout header="Documents">
      <div className="p-6">
        <button
          onClick={openDocument}
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Open Document'}
        </button>

        {error && <p className="text-red-500 mt-2">{error}</p>}

        {open && selectedDoc && (
          <DocumentViewerModal
            document={selectedDoc}
            onClose={() => setOpen(false)}
          />
        )}
      </div>
    </AuthenticatedLayout>
  );
}

/* export default function DocumentView({ documents }: { documents?: DocumentData[] }) {
  const [open, setOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<DocumentData | null>(null);

//use sample
  const sampleDoc: DocumentData = {
    name: "RESUME_CABRERA-JENJADE.pdf",
    category: "billing",
    format: "PDF",
    size: "112 KB",
    uploadedBy: "Admin User",
    uploadDate: "2/23/2026, 7:15 PM",
    fileUrl: "/docs/SETUP-CONNECT-Complete-Project-Documentation.pdf",
  };

  const doc = documents?.[0] || sampleDoc;

  const openDocument = (document: DocumentData) => {
    setSelectedDoc(document);
    setOpen(true);
  };

  return (
    <AuthenticatedLayout header="Documents">
      <div className="p-6">
        <button
          onClick={() => openDocument(doc)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
        >
          Open Document
        </button>

        {open && selectedDoc && (
          <DocumentViewerModal
            document={selectedDoc}
            onClose={() => setOpen(false)}
          />
        )}
      </div>
    </AuthenticatedLayout>
  );
} */