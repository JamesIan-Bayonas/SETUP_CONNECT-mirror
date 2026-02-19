import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Upload() {
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploadComplete, setIsUploadComplete] = useState(false);
    const [documentId, setDocumentId] = useState('');
    const [category, setCategory] = useState('billing');

    const handleUploadClick = () => {
        setDocumentId(`DOC-${Date.now()}`);
        setIsUploadComplete(true);
    };

    const handleCloseUploadComplete = () => {
        setIsUploadComplete(false);
    };

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

                    {/* If no file selected → show upload box */}
                    {!file && (
                        <div
                        onDragOver={(e) => {
                            e.preventDefault();
                            setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(e) => {
                            e.preventDefault();
                            setIsDragging(false);

                            const droppedFile = e.dataTransfer.files[0];
                            if (droppedFile) {
                            setFile(droppedFile);
                            }
                        }}
                        className={`group flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-7 transition 
                            ${
                            isDragging
                                ? "border-blue-500 bg-blue-50"
                                : "border-slate-200 bg-slate-50 hover:border-blue-400 hover:bg-blue-50"
                            }`}
                        >
                        <label className="flex w-full cursor-pointer flex-col items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-slate-400"
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
                            <p className="text-sm font-medium text-slate-600">
                                Click to browse or drag & drop
                            </p>
                            <p className="mt-0.5 text-xs text-slate-400">
                                PDF, DOCX, XLSX, DOC, XLS — Max 20 MB
                            </p>
                            </div>

                            <input
                            type="file"
                            className="hidden"
                            onChange={(e) => {
                                const selectedFile = e.target.files?.[0];
                                if (selectedFile) {
                                setFile(selectedFile);
                                }
                            }}
                            />
                        </label>
                        </div>
                    )}

                    {/* If file selected → show file preview */}
                    {file && (
                        <div className="mt-4 relative flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                        {/* Remove Button */}
                        <button
                            type="button"
                            onClick={() => setFile(null)}
                            className="absolute right-3 top-3 text-slate-400 hover:text-red-500"
                        >
                            ✕
                        </button>

                        {/* File Icon */}
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600 text-xl">
                            {(() => {
                            const extension = file.name.split(".").pop()?.toLowerCase();
                            if (extension === "pdf") return "📄";
                            if (extension === "doc" || extension === "docx") return "📝";
                            if (extension === "xls" || extension === "xlsx") return "📊";
                            return "📁";
                            })()}
                        </div>

                        {/* File Name */}
                        <div className="text-sm font-medium text-slate-700">
                            {file.name}
                        </div>
                        </div>
                    )}
                    </div>

                            {/* Two-column row: Category + Audience */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                        Category{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                    >
                                        <option value="billing">Billing</option>
                                        <option value="legal">Legal</option>
                                        <option value="hr">HR</option>
                                        <option value="other">Other</option>
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
                        <button
                            type="button"
                            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                            onClick={() => {
                                setFile(null);
                                setCategory('billing');
                            }}
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={handleUploadClick}
                            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                        >
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

            {isUploadComplete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="relative w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
                        <button
                            type="button"
                            onClick={handleCloseUploadComplete}
                            className="absolute right-4 top-3 text-xl leading-none text-slate-500 hover:text-slate-700"
                        >
                            ×
                        </button>

                        <div className="mt-6 flex justify-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-emerald-500">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-10 w-10 text-emerald-500"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </div>
                        </div>

                        <h3 className="mt-5 text-center text-3xl font-semibold text-slate-900">Upload Complete!</h3>

                        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-700">
                            <p className="text-base"><span className="font-semibold">Document ID:</span> {documentId}</p>
                            <p className="mt-1 text-base"><span className="font-semibold">File Name:</span> {file?.name ?? 'N/A'}</p>
                            <p className="mt-1 text-base"><span className="font-semibold">Category:</span> {category}</p>
                        
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                type="button"
                                onClick={handleCloseUploadComplete}
                                className="rounded-lg bg-slate-900 px-5 py-2 text-base font-medium text-white hover:bg-slate-800"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}