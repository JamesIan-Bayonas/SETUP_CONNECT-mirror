import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { BusinessOrganizationType } from "@/types";

interface Props {
    orgType: BusinessOrganizationType;
}

export default function Show({ orgType }: Props) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Business Organization Type Details
                    </h2>
                    <div className="flex space-x-4">
                        <Link
                            href={`/org-types/${orgType.id}/edit`}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Edit Business Organization Type
                        </Link>
                        <Link
                            href="/org-types"
                            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Back to Business Organization Types
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Business Organization Type Details" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Organization Type Info */}
                    <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Organization Type Information
                        </h3>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <dt className="text-sm font-medium text-gray-500">
                                    Name
                                </dt>
                                <dd className="mt-1 text-lg text-gray-900">
                                    {orgType.name}
                                </dd>
                            </div>
                        </div>
                    </div>

                    {/* Colored Requirements List */}
                    <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Requirements
                        </h3>

                        {orgType.requirements?.length ? (
                            <ul className="space-y-4">
                                {orgType.requirements.map((req) => (
                                    <li
                                        key={req.id}
                                        className="border-l-4 border-indigo-500 bg-indigo-50 p-4 rounded-md"
                                    >
                                        <div className="flex justify-between items-center">
                                            <p className="text-md font-semibold text-gray-800">
                                                {req.description}
                                            </p>
                                            <span
                                                className={
                                                    req.require_attachment
                                                        ? "text-xs font-semibold bg-green-500 text-white px-2 py-1 rounded-full"
                                                        : ""
                                                }
                                            >
                                                {req.require_attachment ? "Attachment Required" : ""}
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500 italic">
                                No requirements defined for this type.
                            </p>
                        )}
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
