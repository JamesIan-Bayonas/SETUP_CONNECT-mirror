import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useState } from "react";
import AddCustomerModal from "@/Pages/CustomerApplications/AddCutomerModal";
import { usePage } from "@inertiajs/react";
import { useEffect } from "react";
import type { ManifestationOfIntent } from "@/types";

const INTERVENTION_OPTIONS = [
    { key: 'technology_transfer', label: 'Technology Transfer' },
    { key: 'training',            label: 'Training / Seminar / Workshop' },
    { key: 'consultancy',         label: 'Consultancy / Technical Assistance' },
    { key: 'equipment',           label: 'Equipment / Machinery Provision' },
    { key: 'product_development', label: 'Product Development' },
    { key: 'packaging_labeling',  label: 'Packaging & Labeling' },
    { key: 'quality_standards',   label: 'Quality & Standards Compliance' },
    { key: 'market_linkage',      label: 'Market Linkage / Trade Fair' },
    { key: 'other',               label: 'Other' },
] as const;

interface SetUpCustomer {
    id: number;
    customerName: string;
    email: string;
    designation: string;
    businessCount: number;
    isActive: boolean;
    createdAt: string;
}

interface DocumentSlot {
    id: number;
    requirement_id: number;
    document_type_name: string;
    require_attachment: boolean;
    status: 'pending' | 'submitted' | 'verified' | 'rejected';
    file_path: string | null;
    original_filename: string | null;
    remarks: string | null;
    uploaded_by_name: string | null;
    verified_by_name: string | null;
    verified_at: string | null;
    audit_logs: {
        action: string;
        status_before: string | null;
        status_after: string;
        original_filename: string | null;
        remarks: string | null;
        performed_by_name: string | null;
        created_at: string;
    }[];
}

interface Business {
    id: number;
    name_of_agency_firm: string;
    business_of_the_firm: string;
    product_line: string;
    type_of_organization: string;
    date_established: string;
    name_of_head_of_agency_firm: string;
    business_address: string;
    contact_nos: string;
    email_address: string;
    website?: string;
    is_active: boolean;
    created_at: string;
    documents: DocumentSlot[];
    moi: ManifestationOfIntent | null;
}

interface CustomerDetails {
    id: number;
    first_name: string;
    middle_name?: string;
    last_name: string;
    suffix?: string;
    full_name: string;
    designation_position: string;
    residential_address: string;
    is_active: boolean;
    created_at: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
    businesses: Business[];
}

interface Props {
    customers: SetUpCustomer[];
}

export default function SetUpCustomerView({ customers }: Props) {
    const [viewingCustomer, setViewingCustomer] =
        useState<CustomerDetails | null>(null);
    const [loadingDetails, setLoadingDetails] = useState(false);

    const { props: pageProps } = usePage();
    const flash = pageProps?.flash as {
        success?: string;
        duplicate?: string;
        error?: string;
    };

    // success modal state
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // duplicate-email modal state
    const [showDuplicate, setShowDuplicate] = useState(false);
    const [duplicateMessage, setDuplicateMessage] = useState<string | null>(
        null
    );

    // show success modal when server sent flash via Inertia redirect
    useEffect(() => {
        if (flash?.success) {
            setSuccessMessage(flash.success);
            setShowSuccess(true);
        }
    }, [flash?.success]);

    // show duplicate modal if backend set a specific flash key (optional)
    useEffect(() => {
        // If backend sets flash.duplicate use that, else if flash.error contains "duplicate" or "email" show fallback.
        if (flash?.duplicate) {
            setDuplicateMessage(flash.duplicate);
            setShowDuplicate(true);
        } else if (
            flash?.error &&
            /duplicate|already.*exist|email/i.test(flash.error)
        ) {
            setDuplicateMessage(flash.error);
            setShowDuplicate(true);
        }
    }, [flash?.duplicate, flash?.error]);

    // Listen for custom events dispatched by AddCustomerModal (success)
    useEffect(() => {
        function onCreated(e: any) {
            const msg = e?.detail?.message ?? "Customer added successfully";
            setSuccessMessage(msg);
            setShowSuccess(true);
        }

        function onDuplicate(e: any) {
            const msg =
                e?.detail?.message ??
                "The email address you entered is already associated with an existing customer.";
            setDuplicateMessage(msg);
            setShowDuplicate(true);
        }

        window.addEventListener("setupcustomer:created", onCreated);
        window.addEventListener("setupcustomer:duplicate", onDuplicate);

        return () => {
            window.removeEventListener("setupcustomer:created", onCreated);
            window.removeEventListener("setupcustomer:duplicate", onDuplicate);
        };
    }, []);

    // ADDED: modal state for Add Customer button
    const [showModal, setShowModal] = useState(false);
    // Document upload & review states
    const [uploadingDocId, setUploadingDocId] = useState<number | null>(null);
    const [rejectingDocId, setRejectingDocId] = useState<number | null>(null);
    const [rejectRemarks, setRejectRemarks] = useState('');
    // MOI states
    const [moiSchedulingId, setMoiSchedulingId] = useState<number | null>(null);
    const [moiSubmitting, setMoiSubmitting] = useState(false);
    const [moiAcknowledging, setMoiAcknowledging] = useState<number | null>(null);
    const [moiUploadingId, setMoiUploadingId] = useState<number | null>(null);
    const [tnaForm, setTnaForm] = useState({ scheduled_date: '', location: '', conducted_by: '', notes: '' });
    // Staff MOI entry form (per-moi id)
    const [staffMoiForms, setStaffMoiForms] = useState<Record<number, {
        interventions: string[];
        other_intervention: string;
        training_specify: string;
        proponent_name: string;
        proponent_date: string;
        proponent_address: string;
        proponent_contact: string;
        file: File | null;
    }>>({});
    const [staffMoiFormOpen, setStaffMoiFormOpen] = useState<Record<number, boolean>>({});

    const getStaffMoiForm = (moiId: number) => staffMoiForms[moiId] ?? {
        interventions: [], other_intervention: '', training_specify: '',
        proponent_name: '', proponent_date: '', proponent_address: '',
        proponent_contact: '', file: null,
    };
    const setStaffMoiField = (moiId: number, field: string, value: unknown) =>
        setStaffMoiForms(prev => ({ ...prev, [moiId]: { ...getStaffMoiForm(moiId), [field]: value } }));
    const toggleStaffIntervention = (moiId: number, key: string) => {
        const cur = getStaffMoiForm(moiId).interventions;
        setStaffMoiField(moiId, 'interventions', cur.includes(key) ? cur.filter(k => k !== key) : [...cur, key]);
    };
    // Filter states
    const [statusFilter, setStatusFilter] = useState<string>("All");
    const [searchQuery, setSearchQuery] = useState<string>("");

    // Filtered customers
    const filteredCustomers = customers.filter((customer) => {
        const matchesStatus =
            statusFilter === "All" ||
            (statusFilter === "Active" && customer.isActive) ||
            (statusFilter === "Inactive" && !customer.isActive);
        const matchesSearch =
            customer.customerName
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customer.designation
                .toLowerCase()
                .includes(searchQuery.toLowerCase());

        return matchesStatus && matchesSearch;
    });

    // Status counts
    const statusCounts = {
        All: customers.length,
        Active: customers.filter((c) => c.isActive).length,
        Inactive: customers.filter((c) => !c.isActive).length,
    };

    const handleViewDetails = async (id: number) => {
        setLoadingDetails(true);
        try {
            const response = await fetch(`/setupcustomers/${id}`);
            const data = await response.json();
            setViewingCustomer(data);
        } catch (error) {
            console.error("Failed to fetch customer details:", error);
            alert("Failed to load customer details");
        } finally {
            setLoadingDetails(false);
        }
    };

    const closeModal = () => {
        setViewingCustomer(null);
    };

    const getCsrf = () =>
        document.head
            .querySelector<HTMLMetaElement>('meta[name="csrf-token"]')
            ?.content ?? '';

    const refreshCustomer = async (id: number) => {
        const res = await fetch(`/setupcustomers/${id}`);
        const data = await res.json();
        setViewingCustomer(data);
    };

    const handleDocUpload = async (docId: number, file?: File) => {
        if (!file || !viewingCustomer) return;
        const formData = new FormData();
        formData.append('file', file);
        setUploadingDocId(docId);
        try {
            const res = await fetch(`/customer-documents/${docId}/upload`, {
                method: 'POST',
                headers: { 'X-CSRF-TOKEN': getCsrf() },
                body: formData,
            });
            if (!res.ok) throw new Error('Upload failed');
            await refreshCustomer(viewingCustomer.id);
        } catch {
            alert('Upload failed. Please try again.');
        } finally {
            setUploadingDocId(null);
        }
    };

    const handleVerify = async (docId: number) => {
        if (!viewingCustomer) return;
        const res = await fetch(`/customer-documents/${docId}/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': getCsrf(),
            },
            body: JSON.stringify({}),
        });
        if (!res.ok) { alert('Failed to verify document.'); return; }
        await refreshCustomer(viewingCustomer.id);
    };

    const handleReject = async (docId: number) => {
        if (!rejectRemarks.trim()) { alert('Please enter rejection remarks.'); return; }
        if (!viewingCustomer) return;
        const res = await fetch(`/customer-documents/${docId}/reject`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': getCsrf(),
            },
            body: JSON.stringify({ remarks: rejectRemarks }),
        });
        if (!res.ok) { alert('Failed to reject document.'); return; }
        setRejectingDocId(null);
        setRejectRemarks('');
        await refreshCustomer(viewingCustomer.id);
    };

    const handleMoiAcknowledge = async (moiId: number) => {
        if (!viewingCustomer) return;
        setMoiAcknowledging(moiId);
        try {
            const res = await fetch(`/moi/${moiId}/acknowledge`, {
                method: 'POST',
                headers: { 'X-CSRF-TOKEN': getCsrf() },
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                alert(data.message ?? 'Failed to acknowledge MOI.');
                // Refresh so the UI reflects the actual current state
                await refreshCustomer(viewingCustomer.id);
                return;
            }
            await refreshCustomer(viewingCustomer.id);
        } finally {
            setMoiAcknowledging(null);
        }
    };

    const handleScheduleTna = async (moiId: number) => {
        if (!tnaForm.scheduled_date || !tnaForm.location) {
            alert('Please fill in the date and location.');
            return;
        }
        setMoiSubmitting(true);
        try {
            const res = await fetch(`/moi/${moiId}/schedule-tna`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': getCsrf() },
                body: JSON.stringify(tnaForm),
            });
            if (!res.ok) { alert('Failed to schedule TNA.'); return; }
            setMoiSchedulingId(null);
            setTnaForm({ scheduled_date: '', location: '', conducted_by: '', notes: '' });
            await refreshCustomer(viewingCustomer!.id);
        } finally {
            setMoiSubmitting(false);
        }
    };

    const handleStaffMoiUpload = async (moiId: number) => {
        const form = getStaffMoiForm(moiId);
        if (!form.file || !viewingCustomer) return;
        setMoiUploadingId(moiId);
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
            const data = await res.json().catch(() => ({}));
            if (!res.ok) { alert(data.message ?? 'Upload failed.'); return; }
            setStaffMoiFormOpen(prev => ({ ...prev, [moiId]: false }));
            setStaffMoiForms(prev => { const next = { ...prev }; delete next[moiId]; return next; });
            await refreshCustomer(viewingCustomer.id);
        } finally {
            setMoiUploadingId(null);
        }
    };

    const moiStatusBadge = (status: ManifestationOfIntent['status']) => {
        const cls: Record<string, string> = {
            pending_upload: 'bg-yellow-100 text-yellow-800',
            uploaded:       'bg-blue-100 text-blue-800',
            acknowledged:   'bg-green-100 text-green-800',
        };
        const label: Record<string, string> = {
            pending_upload: 'Pending Upload',
            uploaded:       'Uploaded',
            acknowledged:   'Acknowledged',
        };
        return (
            <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${cls[status] ?? 'bg-gray-100 text-gray-800'}`}>
                {label[status] ?? status}
            </span>
        );
    };

    const statusBadge = (status: DocumentSlot['status']) => {
        const cls: Record<string, string> = {
            pending:   'bg-yellow-100 text-yellow-800',
            submitted: 'bg-blue-100 text-blue-800',
            verified:  'bg-green-100 text-green-800',
            rejected:  'bg-red-100 text-red-800',
        };
        return (
            <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${cls[status] ?? 'bg-gray-100 text-gray-800'}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Setup Customer Management
                    </h2>
                </div>
            }
        >
            <Head title="Setup Customer Management" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Filters Section */}
                            <div className="mb-6 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 items-end">
                                    {/* Status Filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Filter by Status
                                        </label>
                                        <div className="flex gap-2">
                                            {Object.entries(statusCounts).map(
                                                ([status, count]) => (
                                                    <button
                                                        key={status}
                                                        onClick={() =>
                                                            setStatusFilter(
                                                                status
                                                            )
                                                        }
                                                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                                            statusFilter ===
                                                            status
                                                                ? "bg-blue-600 text-white"
                                                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                                        }`}
                                                    >
                                                        {status} ({count})
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    </div>

                                    {/* Search Filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Search
                                        </label>
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) =>
                                                setSearchQuery(e.target.value)
                                            }
                                            placeholder="Search by name, email, or designation..."
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div className="w-full">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            &nbsp;
                                        </label>
                                        <button
                                            onClick={() => setShowModal(true)}
                                            className="w-full inline-flex items-center justify-center gap-1 py-[11px] px-4 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm rounded-lg"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                            </svg>
                                            SetUp Customer
                                        </button>
                                    </div>
                                </div>

                                {/* Active Filters Display */}
                                {(statusFilter !== "All" || searchQuery) && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="text-gray-600">
                                            Active filters:
                                        </span>
                                        {statusFilter !== "All" && (
                                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                                                Status: {statusFilter}
                                            </span>
                                        )}
                                        {searchQuery && (
                                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                                                Search: "{searchQuery}"
                                            </span>
                                        )}
                                        <button
                                            onClick={() => {
                                                setStatusFilter("All");
                                                setSearchQuery("");
                                            }}
                                            className="text-blue-600 hover:text-blue-800 font-medium"
                                        >
                                            Clear all
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Customer Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Email
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Designation
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Businesses
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Created Date
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredCustomers.length > 0 ? (
                                            filteredCustomers.map(
                                                (customer) => (
                                                    <tr
                                                        key={customer.id}
                                                        className="hover:bg-gray-50"
                                                    >
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {
                                                                    customer.customerName
                                                                }
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900">
                                                                {customer.email}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900">
                                                                {
                                                                    customer.designation
                                                                }
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                                                {
                                                                    customer.businessCount
                                                                }
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span
                                                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                                    customer.isActive
                                                                        ? "bg-green-100 text-green-800"
                                                                        : "bg-gray-100 text-gray-800"
                                                                }`}
                                                            >
                                                                {customer.isActive
                                                                    ? "Active"
                                                                    : "Inactive"}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {new Date(
                                                                customer.createdAt
                                                            ).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                                                            <button
                                                                onClick={() =>
                                                                    handleViewDetails(
                                                                        customer.id
                                                                    )
                                                                }
                                                                className="text-blue-600 hover:text-blue-900 font-medium"
                                                            >
                                                                <svg
                                                                    className="w-5 h-5 inline"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={
                                                                            2
                                                                        }
                                                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                                    />
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={
                                                                            2
                                                                        }
                                                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                                    />
                                                                </svg>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            )
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan={7}
                                                    className="px-6 py-4 text-center text-sm text-gray-500"
                                                >
                                                    No setup customers found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Results Counter */}
                            <div className="flex justify-between items-center border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
                                <p className="text-sm text-gray-700">
                                    Showing {filteredCustomers.length} of{" "}
                                    {customers.length} result
                                    {customers.length !== 1 ? "s" : ""}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* View Details Modal */}
            {viewingCustomer && (
                <div
                    className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
                    onClick={closeModal}
                >
                    <div
                        className="relative top-20 mx-auto p-8 border w-11/12 max-w-6xl shadow-2xl rounded-xl bg-white"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex justify-between items-center border-b pb-4 mb-6">
                            <h3 className="text-2xl font-bold text-gray-900">
                                Customer Details
                            </h3>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600 text-3xl font-bold"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Customer Information */}
                        <div className="mb-6">
                            <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                                Personal Information
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-sm font-medium text-gray-600">
                                        Full Name
                                    </label>
                                    <p className="text-gray-900">
                                        {viewingCustomer.full_name}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">
                                        Designation/Position
                                    </label>
                                    <p className="text-gray-900">
                                        {viewingCustomer.designation_position}
                                    </p>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-sm font-medium text-gray-600">
                                        Residential Address
                                    </label>
                                    <p className="text-gray-900">
                                        {viewingCustomer.residential_address}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">
                                        Email
                                    </label>
                                    <p className="text-gray-900">
                                        {viewingCustomer.user.email}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">
                                        Status
                                    </label>
                                    <p>
                                        <span
                                            className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                                                viewingCustomer.is_active
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-gray-100 text-gray-800"
                                            }`}
                                        >
                                            {viewingCustomer.is_active
                                                ? "Active"
                                                : "Inactive"}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Businesses Section */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">
                                    Business Information (
                                    {viewingCustomer.businesses.length})
                                </h4>
                            </div>

                            {viewingCustomer.businesses.length > 0 ? (
                                <div className="space-y-4">
                                    {viewingCustomer.businesses.map(
                                        (business, index) => (
                                            <div
                                                key={business.id}
                                                className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition"
                                            >
                                                <div className="flex justify-between items-start mb-3">
                                                    <h5 className="text-md font-semibold text-blue-600">
                                                        Business #{index + 1}:{" "}
                                                        {
                                                            business.name_of_agency_firm
                                                        }
                                                    </h5>
                                                    <span
                                                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                            business.is_active
                                                                ? "bg-green-100 text-green-800"
                                                                : "bg-gray-100 text-gray-800"
                                                        }`}
                                                    >
                                                        {business.is_active
                                                            ? "Active"
                                                            : "Inactive"}
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <label className="font-medium text-gray-600">
                                                            Business Type
                                                        </label>
                                                        <p className="text-gray-900">
                                                            {
                                                                business.business_of_the_firm
                                                            }
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <label className="font-medium text-gray-600">
                                                            Product Line
                                                        </label>
                                                        <p className="text-gray-900">
                                                            {
                                                                business.product_line
                                                            }
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <label className="font-medium text-gray-600">
                                                            Organization Type
                                                        </label>
                                                        <p className="text-gray-900">
                                                            {
                                                                business.type_of_organization
                                                            }
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <label className="font-medium text-gray-600">
                                                            Date Established
                                                        </label>
                                                        <p className="text-gray-900">
                                                            {new Date(
                                                                business.date_established
                                                            ).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <label className="font-medium text-gray-600">
                                                            Head of Agency
                                                        </label>
                                                        <p className="text-gray-900">
                                                            {
                                                                business.name_of_head_of_agency_firm
                                                            }
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <label className="font-medium text-gray-600">
                                                            Contact Numbers
                                                        </label>
                                                        <p className="text-gray-900">
                                                            {
                                                                business.contact_nos
                                                            }
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <label className="font-medium text-gray-600">
                                                            Email
                                                        </label>
                                                        <p className="text-gray-900">
                                                            {
                                                                business.email_address
                                                            }
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <label className="font-medium text-gray-600">
                                                            Website
                                                        </label>
                                                        <p className="text-gray-900">
                                                            {business.website ? (
                                                                <a
                                                                    href={
                                                                        business.website
                                                                    }
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-blue-600 hover:underline"
                                                                >
                                                                    {
                                                                        business.website
                                                                    }
                                                                </a>
                                                            ) : (
                                                                "N/A"
                                                            )}
                                                        </p>
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <label className="font-medium text-gray-600">
                                                            Business Address
                                                        </label>
                                                        <p className="text-gray-900">
                                                            {
                                                                business.business_address
                                                            }
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* MOI Section — shown first */}
                                                <div className="mt-4 pt-4 border-t">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h6 className="text-sm font-semibold text-gray-700">Manifestation of Intent</h6>
                                                        {business.moi && moiStatusBadge(business.moi.status)}
                                                    </div>
                                                    {!business.moi ? (
                                                        <p className="text-sm text-gray-400">No MOI record found.</p>
                                                    ) : (
                                                        <div className="bg-white border rounded-lg p-3 text-sm">
                                                            {business.moi.signed_file_path ? (
                                                                <div className="mb-2">
                                                                    <span className="text-gray-600 font-medium">Signed Form: </span>
                                                                    <a href={`/storage/${business.moi.signed_file_path}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{business.moi.original_filename}</a>
                                                                    {' · '}
                                                                    <a href={`/storage/${business.moi.signed_file_path}`} download={business.moi.original_filename ?? undefined} className="text-indigo-600 hover:underline">Download</a>
                                                                </div>
                                                            ) : (
                                                                <p className="text-gray-500 italic mb-2">No signed form uploaded yet.</p>
                                                            )}
                                                            {/* Staff upload / re-upload — full form */}
                                                            <button
                                                                onClick={() => setStaffMoiFormOpen(prev => ({ ...prev, [business.moi!.id]: !prev[business.moi!.id] }))}
                                                                className="text-xs px-2 py-1 rounded border font-medium transition mb-2 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                                                            >
                                                                {staffMoiFormOpen[business.moi.id] ? 'Cancel Entry' : business.moi.signed_file_path ? 'Re-enter / Update MOI' : 'Enter MOI Details'}
                                                            </button>
                                                            {staffMoiFormOpen[business.moi.id] && (() => {
                                                                const sf = getStaffMoiForm(business.moi!.id);
                                                                const moiId = business.moi!.id;
                                                                return (
                                                                    <div className="mb-3 p-3 bg-gray-50 rounded border border-gray-200 space-y-3">
                                                                        <p className="text-xs font-semibold text-gray-700">MOI Details</p>
                                                                        {/* Interventions */}
                                                                        <div>
                                                                            <p className="text-xs font-medium text-gray-600 mb-1">Intervention(s)</p>
                                                                            <div className="grid grid-cols-2 gap-1">
                                                                                {INTERVENTION_OPTIONS.map(opt => (
                                                                                    <label key={opt.key} className="flex items-center gap-1.5 text-xs cursor-pointer">
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            checked={sf.interventions.includes(opt.key)}
                                                                                            onChange={() => toggleStaffIntervention(moiId, opt.key)}
                                                                                            className="rounded"
                                                                                        />
                                                                                        {opt.label}
                                                                                    </label>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                        {/* Other intervention */}
                                                                        {sf.interventions.includes('other') && (
                                                                            <div>
                                                                                <label className="text-xs text-gray-600">Please specify (Other)</label>
                                                                                <input
                                                                                    type="text"
                                                                                    value={sf.other_intervention}
                                                                                    onChange={e => setStaffMoiField(moiId, 'other_intervention', e.target.value)}
                                                                                    placeholder="Describe the other intervention…"
                                                                                    className="w-full text-xs border rounded p-1 mt-0.5"
                                                                                />
                                                                            </div>
                                                                        )}
                                                                        {/* Training specify */}
                                                                        {sf.interventions.includes('training') && (
                                                                            <div>
                                                                                <label className="text-xs text-gray-600">Training / Seminar topic</label>
                                                                                <input
                                                                                    type="text"
                                                                                    value={sf.training_specify}
                                                                                    onChange={e => setStaffMoiField(moiId, 'training_specify', e.target.value)}
                                                                                    placeholder="e.g. Food Safety, GMP…"
                                                                                    className="w-full text-xs border rounded p-1 mt-0.5"
                                                                                />
                                                                            </div>
                                                                        )}
                                                                        {/* Proponent fields */}
                                                                        <div className="grid grid-cols-2 gap-2">
                                                                            <div>
                                                                                <label className="text-xs text-gray-600">Proponent Name</label>
                                                                                <input
                                                                                    type="text"
                                                                                    value={sf.proponent_name}
                                                                                    onChange={e => setStaffMoiField(moiId, 'proponent_name', e.target.value)}
                                                                                    placeholder="Full name"
                                                                                    className="w-full text-xs border rounded p-1 mt-0.5"
                                                                                />
                                                                            </div>
                                                                            <div>
                                                                                <label className="text-xs text-gray-600">Date Signed</label>
                                                                                <input
                                                                                    type="date"
                                                                                    value={sf.proponent_date}
                                                                                    onChange={e => setStaffMoiField(moiId, 'proponent_date', e.target.value)}
                                                                                    className="w-full text-xs border rounded p-1 mt-0.5"
                                                                                />
                                                                            </div>
                                                                            <div>
                                                                                <label className="text-xs text-gray-600">Address</label>
                                                                                <input
                                                                                    type="text"
                                                                                    value={sf.proponent_address}
                                                                                    onChange={e => setStaffMoiField(moiId, 'proponent_address', e.target.value)}
                                                                                    placeholder="Business address"
                                                                                    className="w-full text-xs border rounded p-1 mt-0.5"
                                                                                />
                                                                            </div>
                                                                            <div>
                                                                                <label className="text-xs text-gray-600">Contact Number</label>
                                                                                <input
                                                                                    type="text"
                                                                                    value={sf.proponent_contact}
                                                                                    onChange={e => setStaffMoiField(moiId, 'proponent_contact', e.target.value)}
                                                                                    placeholder="e.g. 09XXXXXXXXX"
                                                                                    className="w-full text-xs border rounded p-1 mt-0.5"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        {/* Signed file */}
                                                                        <div>
                                                                            <label className="text-xs font-medium text-gray-600">Signed MOI Form *</label>
                                                                            <div className="mt-0.5">
                                                                                <label className="inline-flex items-center gap-1 cursor-pointer text-xs px-2 py-1 rounded border border-gray-300 bg-white hover:bg-gray-50 font-medium">
                                                                                    {sf.file ? sf.file.name : 'Choose file…'}
                                                                                    <input
                                                                                        type="file"
                                                                                        accept=".pdf,.jpg,.jpeg,.png"
                                                                                        className="hidden"
                                                                                        onChange={e => setStaffMoiField(moiId, 'file', e.target.files?.[0] ?? null)}
                                                                                    />
                                                                                </label>
                                                                            </div>
                                                                        </div>
                                                                        {/* Submit */}
                                                                        <div className="flex gap-2">
                                                                            <button
                                                                                onClick={() => handleStaffMoiUpload(moiId)}
                                                                                disabled={!sf.file || moiUploadingId === moiId}
                                                                                className="text-xs px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                                                                            >
                                                                                {moiUploadingId === moiId ? 'Saving…' : 'Save MOI'}
                                                                            </button>
                                                                            <button
                                                                                onClick={() => setStaffMoiFormOpen(prev => ({ ...prev, [moiId]: false }))}
                                                                                className="text-xs px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                                                                            >
                                                                                Cancel
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })()}
                                                            {business.moi.interventions && business.moi.interventions.length > 0 && (
                                                                <div className="mt-1">
                                                                    <span className="font-medium text-gray-600">Interventions: </span>
                                                                    <span className="text-gray-800">{business.moi.interventions.join(', ')}</span>
                                                                    {business.moi.other_intervention && <span className="text-gray-600"> (Other: {business.moi.other_intervention})</span>}
                                                                </div>
                                                            )}
                                                            {business.moi.proponent_name && (
                                                                <div className="mt-1 grid grid-cols-2 gap-1 text-xs text-gray-600">
                                                                    <span><span className="font-medium">Proponent:</span> {business.moi.proponent_name}</span>
                                                                    {business.moi.proponent_date && <span><span className="font-medium">Date:</span> {business.moi.proponent_date}</span>}
                                                                    {business.moi.proponent_address && <span><span className="font-medium">Address:</span> {business.moi.proponent_address}</span>}
                                                                    {business.moi.proponent_contact && <span><span className="font-medium">Contact:</span> {business.moi.proponent_contact}</span>}
                                                                </div>
                                                            )}
                                                            {business.moi.acknowledged_by_name && (
                                                                <p className="text-xs text-green-700 mt-1">Acknowledged by {business.moi.acknowledged_by_name} on {business.moi.acknowledged_at ? new Date(business.moi.acknowledged_at).toLocaleDateString() : ''}</p>
                                                            )}
                                                            {/* Acknowledge button */}
                                                            {business.moi.status === 'uploaded' && (
                                                                <button
                                                                    onClick={() => handleMoiAcknowledge(business.moi!.id)}
                                                                    disabled={moiAcknowledging === business.moi.id}
                                                                    className="mt-2 text-xs px-3 py-1 rounded border bg-green-50 text-green-700 border-green-200 hover:bg-green-100 font-medium disabled:opacity-50 disabled:cursor-wait"
                                                                >
                                                                    {moiAcknowledging === business.moi.id ? 'Acknowledging…' : 'Acknowledge MOI'}
                                                                </button>
                                                            )}
                                                            {/* TNA Schedule */}
                                                            {business.moi.tna_schedule ? (
                                                                <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-100">
                                                                    <p className="text-xs font-semibold text-blue-700 mb-1">TNA Schedule</p>
                                                                    <div className="grid grid-cols-2 gap-1 text-xs text-gray-700">
                                                                        <span><span className="font-medium">Date:</span> {new Date(business.moi.tna_schedule.scheduled_date).toLocaleString()}</span>
                                                                        <span><span className="font-medium">Location:</span> {business.moi.tna_schedule.location}</span>
                                                                        {business.moi.tna_schedule.conducted_by_name && <span><span className="font-medium">Conducted by:</span> {business.moi.tna_schedule.conducted_by_name}</span>}
                                                                        <span><span className="font-medium">Status:</span> {business.moi.tna_schedule.status}</span>
                                                                    </div>
                                                                    {business.moi.tna_schedule.notes && <p className="text-xs text-gray-500 mt-1">{business.moi.tna_schedule.notes}</p>}
                                                                    <button
                                                                        onClick={() => { setMoiSchedulingId(business.moi!.id); setTnaForm({ scheduled_date: '', location: '', conducted_by: '', notes: '' }); }}
                                                                        className="mt-1 text-xs text-blue-600 underline hover:no-underline"
                                                                    >Edit Schedule</button>
                                                                </div>
                                                            ) : (
                                                                business.moi.status === 'acknowledged' && moiSchedulingId !== business.moi.id && (
                                                                    <button
                                                                        onClick={() => setMoiSchedulingId(business.moi!.id)}
                                                                        className="mt-2 text-xs px-3 py-1 rounded border bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 font-medium"
                                                                    >
                                                                        Schedule TNA
                                                                    </button>
                                                                )
                                                            )}
                                                            {/* TNA scheduling form */}
                                                            {moiSchedulingId === business.moi.id && (
                                                                <div className="mt-3 p-3 bg-gray-50 rounded border border-gray-200 space-y-2">
                                                                    <p className="text-xs font-semibold text-gray-700">Schedule TNA Session</p>
                                                                    <div className="grid grid-cols-2 gap-2">
                                                                        <div>
                                                                            <label className="text-xs text-gray-600">Date &amp; Time *</label>
                                                                            <input type="datetime-local" value={tnaForm.scheduled_date} onChange={e => setTnaForm(f => ({ ...f, scheduled_date: e.target.value }))} className="w-full text-xs border rounded p-1 mt-0.5" />
                                                                        </div>
                                                                        <div>
                                                                            <label className="text-xs text-gray-600">Location *</label>
                                                                            <input type="text" value={tnaForm.location} onChange={e => setTnaForm(f => ({ ...f, location: e.target.value }))} placeholder="e.g. DOST Conference Room" className="w-full text-xs border rounded p-1 mt-0.5" />
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <label className="text-xs text-gray-600">Notes</label>
                                                                        <textarea value={tnaForm.notes} onChange={e => setTnaForm(f => ({ ...f, notes: e.target.value }))} rows={2} className="w-full text-xs border rounded p-1 mt-0.5" placeholder="Optional notes…" />
                                                                    </div>
                                                                    <div className="flex gap-2">
                                                                        <button onClick={() => handleScheduleTna(business.moi!.id)} disabled={moiSubmitting} className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50">
                                                                            {moiSubmitting ? 'Saving…' : 'Save Schedule'}
                                                                        </button>
                                                                        <button onClick={() => setMoiSchedulingId(null)} className="text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300">Cancel</button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Documents Section */}
                                                <div className="mt-4 pt-4 border-t">
                                                    <h6 className="text-sm font-semibold text-gray-700 mb-3">
                                                        Required Documents ({(business.documents ?? []).filter(d => d.status === 'verified').length}/{(business.documents ?? []).length} verified)
                                                    </h6>
                                                    {(!business.documents || business.documents.length === 0) ? (
                                                        <p className="text-sm text-gray-500">No document requirements configured for this organization type.</p>
                                                    ) : (
                                                    <div className="space-y-2">
                                                            {business.documents.map((doc) => (
                                                                <div key={doc.id} className="bg-white border rounded-lg p-3">
                                                                    <div className="flex justify-between items-start gap-2 flex-wrap">
                                                                        <div>
                                                                            <p className="text-sm font-medium text-gray-800">{doc.document_type_name}</p>
                                                                            <div className="mt-0.5">{statusBadge(doc.status)}</div>
                                                                        </div>
                                                                        <div className="flex gap-2 items-center flex-shrink-0">
                                                                            {/* Upload / Re-upload */}
                                                                            <label className={`cursor-pointer text-xs px-2 py-1 rounded border font-medium transition ${uploadingDocId === doc.id ? 'bg-gray-100 text-gray-400 cursor-wait' : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'}`}>
                                                                                {uploadingDocId === doc.id ? 'Uploading…' : doc.status === 'pending' ? 'Upload' : 'Re-upload'}
                                                                                <input
                                                                                    type="file"
                                                                                    className="hidden"
                                                                                    disabled={uploadingDocId === doc.id}
                                                                                    onChange={(e) => handleDocUpload(doc.id, e.target.files?.[0])}
                                                                                />
                                                                            </label>
                                                                            {/* Verify */}
                                                                            {doc.status === 'submitted' && (
                                                                                <>
                                                                                    <button
                                                                                        onClick={() => handleVerify(doc.id)}
                                                                                        className="text-xs px-2 py-1 rounded border bg-green-50 text-green-700 border-green-200 hover:bg-green-100 font-medium"
                                                                                    >
                                                                                        Verify
                                                                                    </button>
                                                                                    <button
                                                                                        onClick={() => { setRejectingDocId(doc.id); setRejectRemarks(''); }}
                                                                                        className="text-xs px-2 py-1 rounded border bg-red-50 text-red-700 border-red-200 hover:bg-red-100 font-medium"
                                                                                    >
                                                                                        Reject
                                                                                    </button>
                                                                                </>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    {doc.original_filename && (
                                                                        <p className="text-xs text-gray-500 mt-1">
                                                                            File:{' '}
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
                                                                        <p className="text-xs text-red-600 mt-1">Remarks: {doc.remarks}</p>
                                                                    )}
                                                                    {doc.verified_by_name && doc.verified_at && (
                                                                        <p className="text-xs text-gray-500 mt-1">
                                                                            {doc.status === 'verified' ? 'Verified' : 'Reviewed'} by {doc.verified_by_name} on {doc.verified_at}
                                                                        </p>
                                                                    )}
                                                                    {/* Inline reject form */}
                                                                    {rejectingDocId === doc.id && (
                                                                        <div className="mt-2 p-2 bg-red-50 rounded border border-red-200">
                                                                            <textarea
                                                                                value={rejectRemarks}
                                                                                onChange={(e) => setRejectRemarks(e.target.value)}
                                                                                placeholder="Enter rejection reason…"
                                                                                className="w-full text-sm border border-red-200 rounded p-2 focus:ring-red-300 focus:border-red-400"
                                                                                rows={2}
                                                                            />
                                                                            <div className="flex gap-2 mt-1">
                                                                                <button
                                                                                    onClick={() => handleReject(doc.id)}
                                                                                    className="text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                                                                                >
                                                                                    Confirm Reject
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => { setRejectingDocId(null); setRejectRemarks(''); }}
                                                                                    className="text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300"
                                                                                >
                                                                                    Cancel
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                    {/* Audit Trail */}
                                                                    {doc.audit_logs && doc.audit_logs.length > 0 && (
                                                                        <div className="mt-2 pt-2 border-t border-gray-100">
                                                                            <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Audit Trail</p>
                                                                            <div className="space-y-1">
                                                                                {doc.audit_logs.map((log, i) => (
                                                                                    <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
                                                                                        <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0 mt-1.5"></span>
                                                                                        <span>
                                                                                            <span className="font-medium">{log.created_at}</span>
                                                                                            {' — '}
                                                                                            <span className={`font-semibold ${
                                                                                                log.action === 'verified' ? 'text-green-700' :
                                                                                                log.action === 'rejected' ? 'text-red-700' :
                                                                                                'text-blue-700'
                                                                                            }`}>
                                                                                                {log.action === 're_uploaded' ? 'Re-uploaded' : log.action.charAt(0).toUpperCase() + log.action.slice(1)}
                                                                                            </span>
                                                                                            {log.performed_by_name && <span> by {log.performed_by_name}</span>}
                                                                                            {log.original_filename && <span className="text-gray-500"> ({log.original_filename})</span>}
                                                                                            {log.remarks && <span className="text-gray-500"> — "{log.remarks}"</span>}
                                                                                        </span>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                            </div>
                                        )
                                    )}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-4">
                                    No businesses found for this customer.
                                </p>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="flex justify-end items-center mt-6 pt-4 border-t">
                            <button
                                onClick={closeModal}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <AddCustomerModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
            />

            {/* Success modal (custom, improved UI only) */}
            {showSuccess && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 p-4">
                    <div
                        role="dialog"
                        aria-modal="true"
                        className="w-full max-w-md bg-white rounded-2xl shadow-2xl ring-1 ring-black ring-opacity-5 overflow-hidden transform transition-all duration-300 scale-100"
                    >
                        {/* Header with gradient and icon */}
                        <div className="flex items-center gap-4 px-6 py-6 bg-gradient-to-r from-green-50 to-green-100">
                            <div className="flex-shrink-0">
                                <div className="h-12 w-12 rounded-full bg-white/80 flex items-center justify-center shadow-sm">
                                    <svg
                                        className="h-7 w-7 text-green-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Success
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {successMessage ?? flash?.success}
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setShowSuccess(false);
                                }}
                                aria-label="Close"
                                className="ml-auto -mr-2 p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                            >
                                <svg
                                    className="w-5 h-5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M6.28 5.22a.75.75 0 011.06 0L10 7.94l2.66-2.72a.75.75 0 111.06 1.06L11.06 9l2.72 2.66a.75.75 0 11-1.06 1.06L10 10.06l-2.66 2.72a.75.75 0 11-1.06-1.06L8.94 9 6.22 6.34a.75.75 0 010-1.06z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Body */}
                        <div className="px-6 py-6">
                            <p className="text-sm text-gray-700">
                                Your changes were saved successfully. You can
                                continue managing customers.
                            </p>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 bg-gray-50 flex items-center justify-end">
                            <button
                                onClick={() => {
                                    setShowSuccess(false);
                                    router.reload();
                                }}
                                className="px-5 py-2 bg-green-600 text-white rounded-md text-sm font-semibold hover:bg-green-700 shadow"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Duplicate-email modal */}
            {showDuplicate && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 p-4">
    <div
      role="dialog"
      aria-modal="true"
      className="w-full max-w-md bg-white rounded-2xl shadow-2xl ring-1 ring-black ring-opacity-5 overflow-hidden transform transition-all duration-300 scale-100"
    >
      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-6 bg-gradient-to-r from-red-50 to-red-100">
        <div className="flex-shrink-0">
          <div className="h-12 w-12 rounded-full bg-white/80 flex items-center justify-center shadow-sm">
            <svg
              className="h-7 w-7 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728"
              />
            </svg>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Duplicate User
          </h3>
          <p className="text-sm text-gray-600">
            {duplicateMessage ?? "A user with this email already exists in the system."}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-6">
        <p className="text-sm text-gray-700">
          This user is already registered. Please use a different email to create a new user.
        </p>
      </div>

      {/* Footer – OK button aligned right */}
      <div className="px-6 py-4 bg-gray-50 flex items-center justify-end">
        <button
          onClick={() => setShowDuplicate(false)}
          className="px-6 py-2 bg-red-600 text-white rounded-md text-sm font-semibold hover:bg-red-700 shadow"
        >
          OK
        </button>
      </div>
    </div>
  </div>
)}

        </AuthenticatedLayout>
    );
}
