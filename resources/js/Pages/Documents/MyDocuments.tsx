import { Head, router, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useState } from "react";
import { CustomerDocumentSlot, CustomerDocumentAuditLog } from "@/types";

interface BusinessDoc {
    id: number;
    name: string;
    org_type: string | null;
    doc_count: number;
    verified_count: number;
    documents: CustomerDocumentSlot[];
}

interface SetUpCustomerData {
    id: number;
    full_name: string;
    businesses: BusinessDoc[];
}

interface Props {
    setupCustomer: SetUpCustomerData | null;
}

export default function MyDocuments({ setupCustomer }: Props) {
    const { props: pageProps } = usePage();
    const flash = pageProps?.flash as { success?: string; error?: string } | undefined;

    const [uploadingId, setUploadingId] = useState<number | null>(null);

    const getCsrf = () =>
        document.head
            .querySelector<HTMLMetaElement>('meta[name="csrf-token"]')
            ?.content ?? '';

    const handleUpload = async (docId: number, file?: File) => {
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        setUploadingId(docId);
        try {
            const res = await fetch(`/customer-documents/${docId}/upload`, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': getCsrf(),
                },
                body: formData,
            });
            if (res.ok) {
                router.reload();
            } else {
                alert('Upload failed. Please try again.');
            }
        } catch {
            alert('Upload failed. Please try again.');
        } finally {
            setUploadingId(null);
        }
    };

    const statusBadge = (status: CustomerDocumentSlot['status']) => {
        const cls: Record<string, string> = {
            pending:   'bg-yellow-100 text-yellow-800',
            submitted: 'bg-blue-100 text-blue-800',
            verified:  'bg-green-100 text-green-800',
            rejected:  'bg-red-100 text-red-800',
        };
        const label: Record<string, string> = {
            pending:   'Pending Upload',
            submitted: 'Under Review',
            verified:  'Verified',
            rejected:  'Rejected — Please Re-upload',
        };
        return (
            <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${cls[status] ?? 'bg-gray-100 text-gray-800'}`}>
                {label[status] ?? status}
            </span>
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    My Documents
                </h2>
            }
        >
            <Head title="My Documents" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* Flash messages */}
                    {flash?.success && (
                        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-green-800 text-sm">
                            {flash.success}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-800 text-sm">
                            {flash.error}
                        </div>
                    )}

                    {!setupCustomer ? (
                        <div className="bg-white shadow-sm rounded-lg p-8 text-center text-gray-500">
                            <svg className="h-12 w-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className="font-medium">No setup customer record found.</p>
                            <p className="text-sm mt-1">Your account has not been linked to a SETUP customer profile yet.</p>
                        </div>
                    ) : (
                        <>
                            <div className="bg-white shadow-sm rounded-lg p-4">
                                <p className="text-sm text-gray-600">
                                    Welcome, <span className="font-semibold text-gray-900">{setupCustomer.full_name}</span>.
                                    Please upload the required documents for each of your businesses below.
                                </p>
                            </div>

                            {setupCustomer.businesses.map((business) => (
                                <div key={business.id} className="bg-white shadow-sm rounded-lg overflow-hidden">
                                    {/* Business header */}
                                    <div className="bg-indigo-50 px-6 py-4 flex justify-between items-center">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{business.name}</h3>
                                            {business.org_type && (
                                                <p className="text-xs text-gray-500 mt-0.5">{business.org_type}</p>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${
                                                business.verified_count === business.doc_count
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {business.verified_count}/{business.doc_count} verified
                                            </span>
                                        </div>
                                    </div>

                                    {/* Document list */}
                                    <div className="divide-y divide-gray-100">
                                        {business.documents.length === 0 ? (
                                            <p className="px-6 py-4 text-sm text-gray-500">No document requirements found.</p>
                                        ) : (
                                            business.documents.map((doc) => (
                                                <div key={doc.id} className="px-6 py-4">
                                                    <div className="flex justify-between items-start gap-4 flex-wrap">
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-medium text-gray-900 text-sm">{doc.document_type_name}</p>
                                                            <div className="mt-1">{statusBadge(doc.status)}</div>
                                                            {doc.original_filename && (
                                                                <p className="text-xs text-gray-500 mt-1 truncate">
                                                                    Submitted:{' '}
                                                                    <a
                                                                        href={`/storage/${doc.file_path}`}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-blue-600 hover:underline"
                                                                    >
                                                                        {doc.original_filename}
                                                                    </a>
                                                                    {' · '}
                                                                    <a
                                                                        href={`/storage/${doc.file_path}`}
                                                                        download={doc.original_filename}
                                                                        className="text-indigo-600 hover:underline"
                                                                    >
                                                                        Download
                                                                    </a>
                                                                </p>
                                                            )}
                                                            {doc.remarks && (
                                                                <p className="text-xs text-red-600 mt-1 bg-red-50 border border-red-100 rounded px-2 py-1">
                                                                    <strong>Staff remarks:</strong> {doc.remarks}
                                                                </p>
                                                            )}
                                                            {doc.verified_by_name && doc.verified_at && doc.status === 'verified' && (
                                                                <p className="text-xs text-green-700 mt-1">
                                                                    Verified by {doc.verified_by_name} on {doc.verified_at}
                                                                </p>
                                                            )}
                                                            {/* Audit Trail */}
                                                            {doc.audit_logs && doc.audit_logs.length > 0 && (
                                                                <div className="mt-2 pt-2 border-t border-gray-100">
                                                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">History</p>
                                                                    <div className="space-y-0.5">
                                                                        {doc.audit_logs.map((log: CustomerDocumentAuditLog, i: number) => (
                                                                            <div key={i} className="flex items-start gap-1.5 text-xs text-gray-500">
                                                                                <span className="w-1 h-1 rounded-full bg-gray-300 flex-shrink-0 mt-1.5"></span>
                                                                                <span>
                                                                                    <span className="font-medium">{log.created_at}</span>
                                                                                    {' — '}
                                                                                    <span className={`font-semibold ${
                                                                                        log.action === 'verified' ? 'text-green-600' :
                                                                                        log.action === 'rejected' ? 'text-red-600' :
                                                                                        'text-blue-600'
                                                                                    }`}>
                                                                                        {log.action === 're_uploaded' ? 'Re-uploaded' : log.action.charAt(0).toUpperCase() + log.action.slice(1)}
                                                                                    </span>
                                                                                    {log.original_filename && <span> ({log.original_filename})</span>}
                                                                                    {log.remarks && log.action === 'rejected' && <span className="text-red-500"> — "{log.remarks}"</span>}
                                                                                </span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Upload button (visible unless verified) */}
                                                        {doc.status !== 'verified' && (
                                                            <label className={`flex-shrink-0 cursor-pointer inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg border transition ${
                                                                uploadingId === doc.id
                                                                    ? 'bg-gray-100 text-gray-400 cursor-wait border-gray-200'
                                                                    : doc.status === 'rejected'
                                                                        ? 'bg-red-600 text-white border-red-600 hover:bg-red-700'
                                                                        : 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700'
                                                            }`}>
                                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                                                </svg>
                                                                {uploadingId === doc.id
                                                                    ? 'Uploading…'
                                                                    : doc.status === 'pending'
                                                                        ? 'Upload'
                                                                        : doc.status === 'rejected'
                                                                            ? 'Re-upload'
                                                                            : 'Replace'}
                                                                <input
                                                                    type="file"
                                                                    className="hidden"
                                                                    disabled={uploadingId === doc.id}
                                                                    onChange={(e) => handleUpload(doc.id, e.target.files?.[0])}
                                                                />
                                                            </label>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
