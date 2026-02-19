import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { DocumentType, PaginatedData, PageProps } from "@/types";

interface Props extends PageProps {
    documentTypes: PaginatedData<DocumentType>;
}

export default function Index({ documentTypes }: Props) {
    const { props } = usePage<Props>();
    const flash = props as any;

    const handleDelete = (docType: DocumentType) => {
        if (
            confirm(
                `Are you sure you want to delete "${docType.name}"?` +
                    (docType.requirements_count && docType.requirements_count > 0
                        ? `\n\nWarning: ${docType.requirements_count} requirement(s) will also be removed.`
                        : "")
            )
        ) {
            router.delete(`/document-types/${docType.id}`);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Document Type Management
                    </h2>
                    <Link
                        href="/document-types/create"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Create Document Type
                    </Link>
                </div>
            }
        >
            <Head title="Document Type Management" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* Flash messages */}
                    {flash.success && (
                        <div className="mb-4 p-4 bg-green-100 border border-green-300 text-green-800 rounded-lg">
                            {flash.success}
                        </div>
                    )}

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Description
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                In Use
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Created
                                            </th>
                                            <th className="relative px-6 py-3">
                                                <span className="sr-only">Actions</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {documentTypes.data.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan={6}
                                                    className="px-6 py-8 text-center text-sm text-gray-500 italic"
                                                >
                                                    No document types found. Create one to get started.
                                                </td>
                                            </tr>
                                        )}
                                        {documentTypes.data.map((docType) => (
                                            <tr key={docType.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {docType.name}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 max-w-xs">
                                                    <span className="text-sm text-gray-500 line-clamp-2">
                                                        {docType.description ?? (
                                                            <em className="text-gray-400">—</em>
                                                        )}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                                        {docType.requirements_count ?? 0}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                            docType.is_active
                                                                ? "bg-green-100 text-green-800"
                                                                : "bg-red-100 text-red-800"
                                                        }`}
                                                    >
                                                        {docType.is_active ? "Active" : "Inactive"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(docType.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex space-x-2 justify-end">
                                                        <Link
                                                            href={`/document-types/${docType.id}/edit`}
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(docType)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {documentTypes.links && documentTypes.total > documentTypes.per_page && (
                                <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
                                    <div className="flex flex-1 justify-between sm:hidden">
                                        {documentTypes.prev_page_url && (
                                            <Link
                                                href={documentTypes.prev_page_url}
                                                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                            >
                                                Previous
                                            </Link>
                                        )}
                                        {documentTypes.next_page_url && (
                                            <Link
                                                href={documentTypes.next_page_url}
                                                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                            >
                                                Next
                                            </Link>
                                        )}
                                    </div>
                                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                        <p className="text-sm text-gray-700">
                                            Showing{" "}
                                            <span className="font-medium">{documentTypes.from}</span>{" "}
                                            to{" "}
                                            <span className="font-medium">{documentTypes.to}</span>{" "}
                                            of{" "}
                                            <span className="font-medium">{documentTypes.total}</span>{" "}
                                            results
                                        </p>
                                        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                                            {documentTypes.links.map((link, index) => (
                                                <Link
                                                    key={index}
                                                    href={link.url || "#"}
                                                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                                                        link.active
                                                            ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                                                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                                    } ${index === 0 ? "rounded-l-md" : ""} ${
                                                        index === documentTypes.links.length - 1
                                                            ? "rounded-r-md"
                                                            : ""
                                                    }`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ))}
                                        </nav>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
