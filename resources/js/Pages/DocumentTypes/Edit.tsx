import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { FormEventHandler } from "react";
import { Head, Link, useForm, router } from "@inertiajs/react";
import { DocumentType } from "@/types";

interface Props {
    documentType: DocumentType;
}

interface DocumentTypeForm {
    name: string;
    description: string;
    is_active: boolean;
}

export default function Edit({ documentType }: Props) {
    const { data, setData, processing, errors } = useForm<DocumentTypeForm>({
        name: documentType.name,
        description: documentType.description ?? "",
        is_active: documentType.is_active,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("_method", "PUT");
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("is_active", data.is_active ? "1" : "0");

        router.post(`/document-types/${documentType.id}`, formData, {
            onSuccess: () => router.visit("/document-types"),
            onError: (errs) => console.error(errs),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Edit Document Type: {documentType.name}
                    </h2>
                    <Link
                        href="/document-types"
                        className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Back to Document Types
                    </Link>
                </div>
            }
        >
            <Head title="Edit Document Type" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={submit} className="space-y-6">
                                {/* Name */}
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData("name", e.target.value)}
                                        className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        required
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                    )}
                                </div>

                                {/* Description */}
                                <div>
                                    <label
                                        htmlFor="description"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Description{" "}
                                        <span className="text-gray-400 font-normal">(optional)</span>
                                    </label>
                                    <textarea
                                        id="description"
                                        rows={3}
                                        value={data.description}
                                        onChange={(e) => setData("description", e.target.value)}
                                        className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                    {errors.description && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.description}
                                        </p>
                                    )}
                                </div>

                                {/* Active toggle */}
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        role="switch"
                                        aria-checked={data.is_active}
                                        onClick={() => setData("is_active", !data.is_active)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                                            data.is_active ? "bg-indigo-600" : "bg-gray-200"
                                        }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                                                data.is_active ? "translate-x-6" : "translate-x-1"
                                            }`}
                                        />
                                    </button>
                                    <label className="text-sm font-medium text-gray-700">
                                        {data.is_active ? "Active" : "Inactive"}
                                    </label>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-end space-x-4">
                                    <Link
                                        href="/document-types"
                                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                                    >
                                        {processing ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
