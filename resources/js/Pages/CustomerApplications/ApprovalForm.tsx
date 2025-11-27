import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useState } from "react";

interface CustomerApplication {
  id: number;
  customerName: string;
  agencyFirm: string;
  dateOfApplication: string;
  status: "Pending" | "Approved" | "Declined";
  decisionDate?: string;
}

interface ApplicationDetails {
  id: number;
  first_name: string;
  middle_name?: string;
  last_name: string;
  suffix?: string;
  designation_position: string;
  residential_address: string;
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
  status: string;
  created_at: string;
  decision_date?: string;
}

interface Props {
  applications: CustomerApplication[];
}

export default function ApprovalForm({ applications }: Props) {
  const [processing, setProcessing] = useState<number | null>(null);
  const [viewingApplication, setViewingApplication] = useState<ApplicationDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>("Approved");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");

  // Filtered applications
  const filteredApplications = applications.filter((app) => {
    const matchesStatus = statusFilter === "All" || app.status === statusFilter;
    const matchesSearch = 
      app.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.agencyFirm.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate = !dateFilter || app.dateOfApplication === dateFilter;
    
    return matchesStatus && matchesSearch && matchesDate;
  });

  // Status counts
  const statusCounts = {
    All: applications.length,
    Pending: applications.filter(app => app.status === "Pending").length,
    Approved: applications.filter(app => app.status === "Approved").length,
    Declined: applications.filter(app => app.status === "Declined").length,
  };

  const handleViewDetails = async (id: number) => {
    setLoadingDetails(true);
    try {
      const response = await fetch(`/customerapprovalform/${id}`);
      const data = await response.json();
      setViewingApplication(data);
    } catch (error) {
      console.error("Failed to fetch application details:", error);
      alert("Failed to load application details");
    } finally {
      setLoadingDetails(false);
    }
  };

  const closeModal = () => {
    setViewingApplication(null);
  };

  const handleDecision = (id: number, decision: "Approved" | "Declined") => {
    if (!confirm(`Are you sure you want to ${decision.toLowerCase()} this application?`)) {
      return;
    }

    setProcessing(id);
    
    const action = decision === "Approved" ? "approve" : "decline";
    
    router.post(
      `/customerapprovalform/${id}/${action}`,
      {},
      {
        preserveScroll: true,
        onSuccess: () => {
          setProcessing(null);
        },
        onError: () => {
          setProcessing(null);
          alert("Failed to update application status. Please try again.");
        },
      }
    );
  };

  const handleDelete = (id: number, customerName: string) => {
    if (!confirm(`Are you sure you want to delete the application from "${customerName}"? This action cannot be undone.`)) {
      return;
    }

    setProcessing(id);
    
    router.delete(
      `/customerapprovalform/${id}`,
      {
        preserveScroll: true,
        onSuccess: () => {
          setProcessing(null);
        },
        onError: () => {
          setProcessing(null);
          alert("Failed to delete application. Please try again.");
        },
      }
    );
  };

  return (
    <AuthenticatedLayout
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 leading-tight">
            Customer Approval Management
          </h2>
        </div>
      }
    >
      <Head title="Customer Approval Management" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              {/* Filters Section */}
              <div className="mb-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filter by Status
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="All">All Applications ({statusCounts.All})</option>
                      <option value="Pending">Pending ({statusCounts.Pending})</option>
                      <option value="Approved">Approved ({statusCounts.Approved})</option>
                      <option value="Declined">Declined ({statusCounts.Declined})</option>
                    </select>
                  </div>

                  {/* Search Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Search
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name or company..."
                        className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <svg
                        className="absolute left-3 top-3 h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Date Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filter by Date
                    </label>
                    <input
                      type="date"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Active Filters Display */}
                {(searchQuery || dateFilter || statusFilter !== "Approved") && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-gray-600">Active filters:</span>
                    {statusFilter !== "Approved" && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        Status: {statusFilter}
                        <button
                          onClick={() => setStatusFilter("Approved")}
                          className="hover:text-blue-900"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {searchQuery && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        Search: "{searchQuery}"
                        <button
                          onClick={() => setSearchQuery("")}
                          className="hover:text-blue-900"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {dateFilter && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        Date: {new Date(dateFilter).toLocaleDateString()}
                        <button
                          onClick={() => setDateFilter("")}
                          className="hover:text-blue-900"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    <button
                      onClick={() => {
                        setStatusFilter("Approved");
                        setSearchQuery("");
                        setDateFilter("");
                      }}
                      className="text-sm text-blue-600 hover:text-blue-800 underline"
                    >
                      Clear all filters
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
                        Company
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date of Application
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        View
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Delete
                      </th>
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredApplications.length > 0 ? (
                      filteredApplications.map((app) => (
                        <tr key={app.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {app.customerName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {app.agencyFirm}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(app.dateOfApplication).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                app.status === "Approved"
                                  ? "bg-green-100 text-green-800"
                                  : app.status === "Declined"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {app.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                            <button
                              onClick={() => handleViewDetails(app.id)}
                              className="text-blue-600 hover:text-blue-900 font-medium"
                            >
                              <svg className="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                            {app.status === "Pending" ? (
                              <div className="flex space-x-2 justify-center">
                                <button 
                                  onClick={() => handleDecision(app.id, "Approved")}
                                  disabled={processing === app.id}
                                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {processing === app.id ? "Processing..." : "Approve"}
                                </button>
                                <button 
                                  onClick={() => handleDecision(app.id, "Declined")}
                                  disabled={processing === app.id}
                                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {processing === app.id ? "Processing..." : "Decline"}
                                </button>
                              </div>
                            ) : (
                              <div className="text-gray-500 text-xs">
                                {app.decisionDate && (
                                  <span>{new Date(app.decisionDate).toLocaleDateString()}</span>
                                )}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                            <button
                              onClick={() => handleDelete(app.id, app.customerName)}
                              disabled={processing === app.id}
                              className="text-red-600 hover:text-red-900 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Delete application"
                            >
                              <svg className="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-6 py-4 text-center text-sm text-gray-500"
                        >
                          No customer applications found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Results Counter */}
              <div className="flex justify-between items-center border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
                <p className="text-sm text-gray-700">
                  Showing {filteredApplications.length} of {applications.length} result{applications.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* View Details Modal */}
      {viewingApplication && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" onClick={closeModal}>
          <div className="relative top-20 mx-auto p-8 border w-11/12 max-w-4xl shadow-2xl rounded-xl bg-white" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b pb-4 mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Application Details</h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 text-3xl font-bold"
              >
                &times;
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-6">
              {/* Personal Information */}
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Personal Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Full Name</label>
                    <p className="text-gray-900">{`${viewingApplication.first_name} ${viewingApplication.middle_name || ''} ${viewingApplication.last_name} ${viewingApplication.suffix || ''}`.trim()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Designation/Position</label>
                    <p className="text-gray-900">{viewingApplication.designation_position}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-gray-600">Residential Address</label>
                    <p className="text-gray-900">{viewingApplication.residential_address}</p>
                  </div>
                </div>
              </div>

              {/* Business Information */}
              <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Business Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Agency/Firm</label>
                    <p className="text-gray-900">{viewingApplication.name_of_agency_firm}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Business of the Firm</label>
                    <p className="text-gray-900">{viewingApplication.business_of_the_firm}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Product Line</label>
                    <p className="text-gray-900">{viewingApplication.product_line}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Organization Type</label>
                    <p className="text-gray-900">{viewingApplication.type_of_organization}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Date Established</label>
                    <p className="text-gray-900">{new Date(viewingApplication.date_established).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Head of Agency/Firm</label>
                    <p className="text-gray-900">{viewingApplication.name_of_head_of_agency_firm}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-gray-600">Business Address</label>
                    <p className="text-gray-900">{viewingApplication.business_address}</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contact Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Contact Number</label>
                    <p className="text-gray-900">{viewingApplication.contact_nos}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email Address</label>
                    <p className="text-gray-900">{viewingApplication.email_address}</p>
                  </div>
                  {viewingApplication.website && (
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-gray-600">Website</label>
                      <p className="text-gray-900">
                        <a href={viewingApplication.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {viewingApplication.website}
                        </a>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Application Status */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Application Status</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Status</label>
                    <p>
                      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                        viewingApplication.status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : viewingApplication.status === "Declined"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {viewingApplication.status}
                      </span>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Date Applied</label>
                    <p className="text-gray-900">{new Date(viewingApplication.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer with Actions */}
            <div className="flex justify-between items-center mt-6 pt-4 border-t">
              <button
                onClick={() => {
                  const customerName = `${viewingApplication.first_name} ${viewingApplication.last_name}`;
                  handleDelete(viewingApplication.id, customerName);
                  closeModal();
                }}
                className="bg-gray-200 hover:bg-red-100 text-red-600 font-bold py-2 px-6 rounded-lg border border-red-300 hover:border-red-500 transition"
              >
                Delete Application
              </button>
              
              {viewingApplication.status === "Pending" && (
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      handleDecision(viewingApplication.id, "Approved");
                      closeModal();
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      handleDecision(viewingApplication.id, "Declined");
                      closeModal();
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg"
                  >
                    Decline
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AuthenticatedLayout>
  );
}
