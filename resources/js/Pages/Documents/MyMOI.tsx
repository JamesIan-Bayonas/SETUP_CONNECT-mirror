import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import type { ManifestationOfIntent } from '@/types';

interface BusinessMoi {
    id: number;
    name_of_agency_firm: string;
    moi: ManifestationOfIntent | null;
}

interface Props {
    businesses: BusinessMoi[];
}

const INTERVENTION_OPTIONS = [
    { key: 'technology_transfer', label: 'Technology Transfer' },
    { key: 'training', label: 'Training / Seminar / Workshop' },
    { key: 'consultancy', label: 'Consultancy / Technical Assistance' },
    { key: 'equipment', label: 'Equipment / Machinery Provision' },
    { key: 'product_development', label: 'Product Development' },
    { key: 'packaging_labeling', label: 'Packaging & Labeling' },
    { key: 'quality_standards', label: 'Quality & Standards Compliance' },
    { key: 'market_linkage', label: 'Market Linkage / Trade Fair' },
    { key: 'other', label: 'Other' },
];

const statusBadge = (status: ManifestationOfIntent['status']) => {
    const cls: Record<string, string> = {
        pending_upload: 'bg-yellow-100 text-yellow-800',
        uploaded:       'bg-blue-100 text-blue-800',
        acknowledged:   'bg-green-100 text-green-800',
    };
    const label: Record<string, string> = {
        pending_upload: 'Pending Upload',
        uploaded:       'Uploaded — Awaiting Acknowledgement',
        acknowledged:   'Acknowledged',
    };
    return (
        <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${cls[status] ?? 'bg-gray-100 text-gray-800'}`}>
            {label[status] ?? status}
        </span>
    );
};

const tnaBadge = (status: string) => {
    const cls: Record<string, string> = {
        scheduled:  'bg-blue-100 text-blue-800',
        completed:  'bg-green-100 text-green-800',
        cancelled:  'bg-gray-100 text-gray-600',
    };
    return (
        <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${cls[status] ?? 'bg-gray-100 text-gray-800'}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};

export default function MyMOI({ businesses }: Props) {
    const [uploadingId, setUploadingId] = useState<number | null>(null);
    const [expandedId, setExpandedId] = useState<number | null>(null);

    // Per-business upload form state
    const [forms, setForms] = useState<Record<number, {
        interventions: string[];
        other_intervention: string;
        training_specify: string;
        proponent_name: string;
        proponent_date: string;
        proponent_address: string;
        proponent_contact: string;
        file: File | null;
    }>>(() => {
        const init: Record<number, any> = {};
        businesses.forEach(b => {
            if (b.moi) {
                init[b.moi.id] = {
                    interventions: b.moi.interventions ?? [],
                    other_intervention: b.moi.other_intervention ?? '',
                    training_specify: b.moi.training_specify ?? '',
                    proponent_name: b.moi.proponent_name ?? '',
                    proponent_date: b.moi.proponent_date ?? '',
                    proponent_address: b.moi.proponent_address ?? '',
                    proponent_contact: b.moi.proponent_contact ?? '',
                    file: null,
                };
            }
        });
        return init;
    });

    const getForm = (moiId: number) => forms[moiId] ?? {
        interventions: [],
        other_intervention: '',
        training_specify: '',
        proponent_name: '',
        proponent_date: '',
        proponent_address: '',
        proponent_contact: '',
        file: null,
    };

    const setFormField = (moiId: number, field: string, value: any) => {
        setForms(prev => ({
            ...prev,
            [moiId]: { ...getForm(moiId), ...prev[moiId], [field]: value },
        }));
    };

    const toggleIntervention = (moiId: number, key: string) => {
        const current = getForm(moiId).interventions;
        const updated = current.includes(key)
            ? current.filter(k => k !== key)
            : [...current, key];
        setFormField(moiId, 'interventions', updated);
    };

    const getCsrf = () =>
        document.head.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '';

    const handleUpload = async (moiId: number) => {
        const form = getForm(moiId);
        if (!form.file) { alert('Please attach the signed MOI form.'); return; }

        setUploadingId(moiId);
        try {
            const fd = new FormData();
            fd.append('signed_form', form.file);
            form.interventions.forEach(v => fd.append('interventions[]', v));
            if (form.other_intervention) fd.append('other_intervention', form.other_intervention);
            if (form.training_specify)   fd.append('training_specify', form.training_specify);
            if (form.proponent_name)     fd.append('proponent_name', form.proponent_name);
            if (form.proponent_date)     fd.append('proponent_date', form.proponent_date);
            if (form.proponent_address)  fd.append('proponent_address', form.proponent_address);
            if (form.proponent_contact)  fd.append('proponent_contact', form.proponent_contact);

            const res = await fetch(`/moi/${moiId}/upload`, {
                method: 'POST',
                headers: { 'X-CSRF-TOKEN': getCsrf() },
                body: fd,
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                alert(data.message ?? 'Upload failed. Please try again.');
                return;
            }
            // Reload via Inertia to refresh props
            window.location.reload();
        } finally {
            setUploadingId(null);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Manifestation of Intent
                </h2>
            }
        >
            <Head title="My MOI" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* Intro card */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                        <h3 className="text-blue-800 font-semibold mb-1">What is the MOI?</h3>
                        <p className="text-sm text-blue-700">
                            The Manifestation of Intent (MOI) is your declaration of the SETUP interventions
                            you are applying for. Please fill in the form below, download/print the signed
                            copy, and upload it for staff review. Once acknowledged, a Training Needs
                            Assessment (TNA) will be scheduled.
                        </p>
                    </div>

                    {businesses.length === 0 && (
                        <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
                            No business record found. Please contact the PSTO office.
                        </div>
                    )}

                    {businesses.map(biz => {
                        const moi = biz.moi;
                        if (!moi) return null;

                        const form = getForm(moi.id);
                        const isExpanded = expandedId === moi.id;
                        const canEdit = moi.status !== 'acknowledged';

                        return (
                            <div key={biz.id} className="bg-white overflow-hidden shadow-sm rounded-xl border">
                                {/* Card header */}
                                <div className="flex items-center justify-between p-5 border-b cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : moi.id)}>
                                    <div>
                                        <p className="font-semibold text-gray-800">{biz.name_of_agency_firm}</p>
                                        <div className="mt-1">{statusBadge(moi.status)}</div>
                                    </div>
                                    <svg className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>

                                {isExpanded && (
                                    <div className="p-5 space-y-5">
                                        {/* Already uploaded info */}
                                        {moi.signed_file_path && (
                                            <div className="bg-gray-50 rounded-lg p-3 text-sm">
                                                <p className="font-medium text-gray-700 mb-1">Currently uploaded form:</p>
                                                <a href={`/storage/${moi.signed_file_path}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{moi.original_filename}</a>
                                                {' · '}
                                                <a href={`/storage/${moi.signed_file_path}`} download={moi.original_filename ?? undefined} className="text-indigo-600 hover:underline">Download</a>
                                                {moi.uploaded_at && <span className="text-gray-400 ml-2">· Uploaded {new Date(moi.uploaded_at).toLocaleDateString()}</span>}
                                            </div>
                                        )}

                                        {/* MOI form */}
                                        {canEdit && (
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                                                    {moi.status === 'pending_upload' ? 'Fill out & upload your MOI' : 'Update MOI Upload'}
                                                </h4>

                                                {/* Interventions */}
                                                <div className="mb-4">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Requested Interventions <span className="text-gray-400 text-xs">(check all that apply)</span>
                                                    </label>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                                        {INTERVENTION_OPTIONS.map(opt => (
                                                            <label key={opt.key} className="flex items-center gap-2 text-sm cursor-pointer">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={form.interventions.includes(opt.key)}
                                                                    onChange={() => toggleIntervention(moi.id, opt.key)}
                                                                    className="rounded border-gray-300 text-blue-600"
                                                                />
                                                                <span>{opt.label}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                    {form.interventions.includes('other') && (
                                                        <input
                                                            type="text"
                                                            value={form.other_intervention}
                                                            onChange={e => setFormField(moi.id, 'other_intervention', e.target.value)}
                                                            placeholder="Please specify other intervention…"
                                                            className="mt-2 w-full text-sm border rounded p-2"
                                                        />
                                                    )}
                                                    {form.interventions.includes('training') && (
                                                        <input
                                                            type="text"
                                                            value={form.training_specify}
                                                            onChange={e => setFormField(moi.id, 'training_specify', e.target.value)}
                                                            placeholder="Specify training topic…"
                                                            className="mt-2 w-full text-sm border rounded p-2"
                                                        />
                                                    )}
                                                </div>

                                                {/* Proponent details */}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-600 mb-1">Proponent Name</label>
                                                        <input type="text" value={form.proponent_name} onChange={e => setFormField(moi.id, 'proponent_name', e.target.value)} className="w-full text-sm border rounded p-2" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-600 mb-1">Date</label>
                                                        <input type="date" value={form.proponent_date} onChange={e => setFormField(moi.id, 'proponent_date', e.target.value)} className="w-full text-sm border rounded p-2" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-600 mb-1">Address</label>
                                                        <input type="text" value={form.proponent_address} onChange={e => setFormField(moi.id, 'proponent_address', e.target.value)} className="w-full text-sm border rounded p-2" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-600 mb-1">Contact Number</label>
                                                        <input type="text" value={form.proponent_contact} onChange={e => setFormField(moi.id, 'proponent_contact', e.target.value)} className="w-full text-sm border rounded p-2" />
                                                    </div>
                                                </div>

                                                {/* File upload */}
                                                <div className="mb-4">
                                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                                        Signed MOI Form <span className="text-red-500">*</span>
                                                        <span className="text-gray-400 ml-1">(PDF / JPG / PNG, max 10 MB)</span>
                                                    </label>
                                                    <input
                                                        type="file"
                                                        accept=".pdf,.jpg,.jpeg,.png"
                                                        onChange={e => setFormField(moi.id, 'file', e.target.files?.[0] ?? null)}
                                                        className="block text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border file:border-gray-300 file:text-sm file:bg-white hover:file:bg-gray-50"
                                                    />
                                                    {form.file && <p className="text-xs text-gray-500 mt-1">Selected: {form.file.name}</p>}
                                                </div>

                                                <button
                                                    onClick={() => handleUpload(moi.id)}
                                                    disabled={uploadingId === moi.id}
                                                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold px-6 py-2 rounded-lg transition"
                                                >
                                                    {uploadingId === moi.id ? 'Uploading…' : moi.status === 'pending_upload' ? 'Submit MOI' : 'Re-submit MOI'}
                                                </button>
                                            </div>
                                        )}

                                        {/* Acknowledged notice */}
                                        {moi.status === 'acknowledged' && (
                                            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800">
                                                <p className="font-semibold">MOI Acknowledged</p>
                                                {moi.acknowledged_by_name && (
                                                    <p className="mt-0.5 text-xs">Acknowledged by {moi.acknowledged_by_name} on {moi.acknowledged_at ? new Date(moi.acknowledged_at).toLocaleDateString() : ''}</p>
                                                )}
                                            </div>
                                        )}

                                        {/* TNA Schedule */}
                                        {moi.tna_schedule ? (
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <p className="font-semibold text-blue-800 text-sm">Training Needs Assessment (TNA) Schedule</p>
                                                    {tnaBadge(moi.tna_schedule.status)}
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
                                                    <div>
                                                        <span className="font-medium">Date & Time: </span>
                                                        {new Date(moi.tna_schedule.scheduled_date).toLocaleString()}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Location: </span>
                                                        {moi.tna_schedule.location}
                                                    </div>
                                                    {moi.tna_schedule.conducted_by_name && (
                                                        <div>
                                                            <span className="font-medium">Facilitated by: </span>
                                                            {moi.tna_schedule.conducted_by_name}
                                                        </div>
                                                    )}
                                                </div>
                                                {moi.tna_schedule.notes && (
                                                    <p className="mt-2 text-xs text-gray-600">{moi.tna_schedule.notes}</p>
                                                )}
                                            </div>
                                        ) : (
                                            moi.status === 'acknowledged' && (
                                                <p className="text-sm text-gray-500 italic">TNA scheduling is pending. You will be notified once a schedule is set.</p>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
