import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { FormEventHandler } from "react";
import { Head, Link, useForm } from "@inertiajs/react";

interface DocumentTypeForm {
    name: string;
    description: string;
}

export default function Create() {
    const { data, setData, post, processing, errors } = useForm<DocumentTypeForm>({
        name: "",
        description: "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post("/document-types");
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Create New Document Type
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
            <Head title="Create Document Type" />

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
                                        placeholder="e.g. Business Permit, SEC Registration"
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
                                        placeholder="Brief description of what this document type is..."
                                    />
                                    {errors.description && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.description}
                                        </p>
                                    )}
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
                                        {processing ? "Creating..." : "Create Document Type"}
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
