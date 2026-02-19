import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Upload() {
    return (
        <AuthenticatedLayout>
            <div className="p-6">
                {/* Card */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 max-w-2xl">
                    {/* Card Header */}
                    <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-blue-600"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="17 8 12 3 7 8" />
                                <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-slate-800">
                                Upload New Document
                            </h3>
                            <p className="text-xs text-slate-400">
                                Fill in the details below to upload a new document
                            </p>
                        </div>
                    </div>

                    {/* Card Body */}
                    <div className="px-6 py-5">
                        <form className="space-y-5">
                            {/* File Upload */}
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                    Select File{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <label className="group flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 py-7 transition hover:border-blue-400 hover:bg-blue-50">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm group-hover:shadow-blue-100">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 text-slate-400 group-hover:text-blue-500"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                            <polyline points="17 8 12 3 7 8" />
                                            <line x1="12" y1="3" x2="12" y2="15" />
                                        </svg>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-medium text-slate-600 group-hover:text-blue-600">
                                            Click to browse or drag &amp; drop
                                        </p>
                                        <p className="mt-0.5 text-xs text-slate-400">
                                            PDF, DOCX, XLSX, DOC, XLS &mdash; Max 20 MB
                                        </p>
                                    </div>
                                    <input type="file" className="hidden" />
                                </label>
                            </div>

                            {/* Two-column row: Category + Audience */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                        Category{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <select className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100">
                                        <option>Billing</option>
                                        <option>Legal</option>
                                        <option>HR</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                        Target Audience
                                    </label>
                                    <select className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100">
                                        <option>Administrators</option>
                                        <option>Cooperators</option>
                                        <option>PTSO</option>
                                    </select>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                    Description{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    placeholder="Provide a brief description of the document…"
                                    rows={3}
                                    className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 shadow-sm placeholder:text-slate-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                />
                            </div>
                        </form>
                    </div>

                    {/* Card Footer */}
                    <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-6 py-4">
                        <button className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
                            Cancel
                        </button>
                        <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="17 8 12 3 7 8" />
                                <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                            Upload Document
                        </button>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}