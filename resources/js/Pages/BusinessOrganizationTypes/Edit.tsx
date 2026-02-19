import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { FormEventHandler, useState } from "react";
import { Head, Link, useForm, router } from "@inertiajs/react";
import { BusinessOrganizationType, DocumentType } from "@/types";

interface Props {
    orgType: BusinessOrganizationType;
    documentTypes: DocumentType[];
}

interface RequirementForm {
    id?: number;
    document_type_id: number | null;
    require_attachment: boolean;
}

interface BusinessOrganizationTypeForm {
    name: string;
}

export default function Edit({ orgType, documentTypes }: Props) {
    const { data, setData, processing, errors } = useForm<BusinessOrganizationTypeForm>({
        name: orgType.name,
    });

    const [requirements, setRequirements] = useState<RequirementForm[]>(
        orgType.requirements.map((r) => ({
            id: r.id,
            document_type_id: r.document_type_id,
            require_attachment: r.require_attachment,
        }))
    );

    const addRequirement = () => {
        setRequirements((prev) => [
            ...prev,
            { document_type_id: null, require_attachment: false },
        ]);
    };

    const updateDocumentType = (index: number, value: number | null) => {
        setRequirements((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], document_type_id: value };
            return updated;
        });
    };

    const toggleRequireAttachment = (index: number) => {
        setRequirements((prev) => {
            const updated = [...prev];
            updated[index] = {
                ...updated[index],
                require_attachment: !updated[index].require_attachment,
            };
            return updated;
        });
    };

    const removeRequirement = (index: number) => {
        setRequirements((prev) => prev.filter((_, i) => i !== index));
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("_method", "PUT");
        formData.append("name", data.name);

        requirements.forEach((req, index) => {
            if (req.id) {
                formData.append(`requirements[${index}][id]`, req.id.toString());
            }
            formData.append(
                `requirements[${index}][document_type_id]`,
                req.document_type_id?.toString() ?? ""
            );
            formData.append(
                `requirements[${index}][require_attachment]`,
                req.require_attachment ? "1" : "0"
            );
        });

        router.post(`/org-types/${orgType.id}`, formData, {
            onSuccess: () => router.visit("/org-types"),
            onError: (errs) => console.error("Error updating:", errs),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Edit Business Organization Type: {orgType.name}
                    </h2>
                    <div className="flex space-x-4">
                        <Link
                            href={`/org-types/${orgType.id}`}
                            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                        >
                            View
                        </Link>
                        <Link
                            href="/org-types"
                            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Back
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Edit Business Organization Type" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={submit} className="space-y-6">

                                {/* Name Field */}
                                <div>
                                    <label htmlFor="name" className="block text-md font-medium text-gray-700">
                                        Name
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

                                {/* Requirements List */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-lg text-gray-700">Requirements (Optional)</h3>
                                        <button
                                            type="button"
                                            onClick={addRequirement}
                                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded"
                                        >
                                            Add Requirement
                                        </button>
                                    </div>

                                    {documentTypes.length === 0 && (
                                        <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded p-3 mb-2">
                                            No active document types available.
                                        </p>
                                    )}

                                    {requirements.length === 0 && (
                                        <p className="text-sm text-gray-500 mt-2">No requirements added.</p>
                                    )}

                                    {requirements.map((req, index) => (
                                        <div key={index} className="flex flex-col gap-2 mt-3 p-3 border rounded-md">
                                            {/* Document Type Dropdown */}
                                            <select
                                                value={req.document_type_id ?? ""}
                                                onChange={(e) =>
                                                    updateDocumentType(
                                                        index,
                                                        e.target.value ? Number(e.target.value) : null
                                                    )
                                                }
                                                className="p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                required
                                            >
                                                <option value="" disabled>
                                                    — Select a document type —
                                                </option>
                                                {documentTypes.map((dt) => (
                                                    <option key={dt.id} value={dt.id}>
                                                        {dt.name}
                                                    </option>
                                                ))}
                                            </select>

                                            <div className="flex items-center justify-between">
                                                <label className="flex items-center gap-2 text-sm text-gray-700">
                                                    <input
                                                        type="checkbox"
                                                        checked={req.require_attachment}
                                                        onChange={() => toggleRequireAttachment(index)}
                                                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                    />
                                                    Attachment required
                                                </label>

                                                <button
                                                    type="button"
                                                    onClick={() => removeRequirement(index)}
                                                    className="bg-red-500 hover:bg-red-600 text-white font-bold p-2 rounded-md"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth={1.5}
                                                        stroke="currentColor"
                                                        className="w-5 h-5"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21
                                                            c.342.052.682.107 1.022.166m-1.022-.165
                                                            L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077
                                                            H8.084a2.25 2.25 0 0 1-2.244-2.077
                                                            L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397
                                                            m-12 .562c.34-.059.68-.114 1.022-.165m0 0
                                                            a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916
                                                            c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0
                                                            c-1.18.037-2.09 1.022-2.09 2.201v.916"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex items-center justify-end space-x-4">
                                    <Link
                                        href={`/org-types/${orgType.id}`}
                                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                                    >
                                        {processing ? "Updating..." : "Update Business Organization Type"}
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
