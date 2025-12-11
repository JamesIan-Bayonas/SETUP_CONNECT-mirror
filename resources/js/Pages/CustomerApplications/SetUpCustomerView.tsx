import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useState } from "react";
import AddCustomerModal from "@/Pages/CustomerApplications/AddCutomerModal";
import { usePage } from "@inertiajs/react";
import { useEffect } from "react";

interface SetUpCustomer {
    id: number;
    customerName: string;
    email: string;
    designation: string;
    businessCount: number;
    isActive: boolean;
    createdAt: string;
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
                                            className="w-full py-[11px] px-4 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm rounded-lg"
                                        >
                                            Add SetUp Customer
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
