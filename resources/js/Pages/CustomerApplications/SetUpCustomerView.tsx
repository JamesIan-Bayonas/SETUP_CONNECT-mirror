// resources/js/Pages/SetUpCustomerView.tsx
import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useState } from "react";
import AddCustomerModal from "@/Pages/CustomerApplications/AddCustomerModal";

interface SetUpCustomerBusiness {
  id?: number;
  name_of_agency_firm?: string;
  business_of_the_firm?: string;
  product_line?: string;
  type_of_organization?: string;
  date_established?: string;
  name_of_head_of_agency_firm?: string;
  business_address?: string;
  contact_nos?: string;
  email_address?: string;
  website?: string;
  // Add fields Task49 will create here as needed
}

interface SetUpCustomer {
  id: number;
  customer_name: string;
  created_at: string;
  status?: "Pending" | "Active" | "Inactive" | "Approved" | "Declined" | string;
  // Minimal public fields for table; details fetched separately
}

interface CustomerDetails extends SetUpCustomer {
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  suffix?: string;
  designation_position?: string;
  residential_address?: string;
  // Relationship
  business?: SetUpCustomerBusiness | null;
  // contact fields
  contact_nos?: string;
  email_address?: string;
  website?: string;
  // timestamps, etc.
}

/**
 * Note: This component expects Task 49 to create the SetUpCustomerBusiness model and related API payload.
 * The details view gracefully handles missing business data until Task 49 is delivered.
 */
export default function SetUpCustomerView({ customers }: { customers: SetUpCustomer[] }) {
  const [processing, setProcessing] = useState<number | null>(null);
  const [viewing, setViewing] = useState<CustomerDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");

  // Helper to access nested fields from different payload shapes
  const getField = (obj: any, paths: Array<string | Array<string>>): string => {
    for (const p of paths) {
      if (Array.isArray(p)) {
        let cur: any = obj;
        for (const key of p) {
          if (cur && key in cur) cur = cur[key];
          else {
            cur = undefined;
            break;
          }
        }
        if (cur !== undefined && cur !== null && cur !== "") return String(cur);
      } else {
        const val = obj?.[p];
        if (val !== undefined && val !== null && val !== "") return String(val);
      }
    }
    return "—";
  };

  const normalizeStatus = (s: string | undefined | null): "Pending" | "Active" | "Inactive" | "Approved" | "Declined" | "Unknown" => {
    if (!s) return "Pending";
    const v = String(s).trim().toLowerCase();
    if (v === "pending") return "Pending";
    if (v === "active" || v === "approved") return "Active";
    if (v === "inactive" || v === "declined" || v === "rejected") return "Inactive";
    return "Unknown";
  };

  // Filter customers list
  const filtered = customers.filter((c) => {
    const st = normalizeStatus(c.status);
    const matchesStatus = statusFilter === "All" || st === statusFilter;
    const matchesSearch =
      c.customer_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate = !dateFilter || c.created_at.startsWith(dateFilter); // created_at assumed ISO
    return matchesStatus && matchesSearch && matchesDate;
  });

  const statusCounts = {
    All: customers.length,
    Pending: customers.filter(c => normalizeStatus(c.status) === "Pending").length,
    Active: customers.filter(c => normalizeStatus(c.status) === "Active").length,
    Inactive: customers.filter(c => normalizeStatus(c.status) === "Inactive").length,
  };

  // Fetch details for modal
  const handleView = async (id: number) => {
    setLoadingDetails(true);
    try {
      const res = await fetch(`/setupcustomer/${id}`);
      const data = await res.json();
      // possible shapes: {data}, {customer}, or raw object
      const normalized = data?.data || data?.customer || data || null;
      setViewing(normalized);
    } catch (err) {
      console.error("Failed to load SetUpCustomer details", err);
      alert("Failed to load details.");
    } finally {
      setLoadingDetails(false);
    }
  };

  const closeModal = () => setViewing(null);

  const handleEdit = (id: number) => {
    router.visit(`/setupcustomer/${id}/edit`);
  };

  const handleDelete = (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) return;
    setProcessing(id);
    router.delete(
      `/setupcustomer/${id}`,
      {
        preserveScroll: true,
        onSuccess: () => setProcessing(null),
        onError: () => {
          setProcessing(null);
          alert("Failed to delete. Try again.");
        },
      }
    );
  };

  return (
    <AuthenticatedLayout
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 leading-tight">SetUp Customer Management</h2>
        </div>
      }
    >
      <Head title="SetUp Customer Management" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              {/* Filters */}
              <div className="mb-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-[repeat(3,_1fr)_auto] gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                      <option value="All">All ({statusCounts.All})</option>
                      <option value="Pending">Pending ({statusCounts.Pending})</option>
                      <option value="Active">Active ({statusCounts.Active})</option>
                      <option value="Inactive">Inactive ({statusCounts.Inactive})</option>
                    </select>
                   </div>                  

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                    <div className="relative">
                      <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by customer or business..." className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg" />
                      <svg className="absolute left-3 top-3 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Date</label>
                    <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                  </div>

                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-2">&nbsp;</label>
                    <button
                      onClick={() => setShowModal(true)}
                      className="w-full py-[11px] px-4 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm rounded-lg">
                      Add Customer
                    </button>
                  </div>
                </div>

                {(searchQuery || dateFilter || statusFilter !== "All") && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-gray-600">Active filters:</span>
                    {statusFilter !== "All" && <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">Status: {statusFilter}<button onClick={() => setStatusFilter("All")} className="ml-2">×</button></span>}
                    {searchQuery && <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">Search: "{searchQuery}"<button onClick={() => setSearchQuery("")} className="ml-2">×</button></span>}
                    {dateFilter && <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">Date: {new Date(dateFilter).toLocaleDateString()}<button onClick={() => setDateFilter("")} className="ml-2">×</button></span>}
                    <button onClick={() => { setStatusFilter("All"); setSearchQuery(""); setDateFilter(""); }} className="text-sm text-blue-600 hover:text-blue-800 underline">Clear all filters</button>
                  </div>
                )}
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">View</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Delete</th>
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-gray-200">
                    {filtered.length > 0 ? (
                      filtered.map((c) => (
                        <tr key={c.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.customer_name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{/* business name might not be present in table payload */} { /* attempt to show if passed via array shape */ } —</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(c.created_at).toLocaleDateString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {(() => {
                              const s = normalizeStatus(c.status);
                              const cls = s === "Active" ? "bg-green-100 text-green-800" : s === "Inactive" ? "bg-red-100 text-red-800" : s === "Pending" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800";
                              return <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${cls}`}>{s}</span>;
                            })()}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                            <button onClick={() => handleView(c.id)} className="text-blue-600 hover:text-blue-900 font-medium">
                              <svg className="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            </button>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                            <div className="flex space-x-2 justify-center">
                              <button onClick={() => handleEdit(c.id)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded">Edit</button>
                              <button onClick={() => handleView(c.id)} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-3 rounded">Details</button>
                            </div>
                          </td>                         

                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                            <button onClick={() => handleDelete(c.id, c.customer_name)} disabled={processing === c.id} className="text-red-600 hover:text-red-900 font-medium disabled:opacity-50">
                              <svg className="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">No customers found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Footer info */}
              <div className="flex justify-between items-center border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
                <p className="text-sm text-gray-700">Showing {filtered.length} of {customers.length} result{customers.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {viewing && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" onClick={closeModal}>
          <div className="relative top-20 mx-auto p-8 border w-11/12 max-w-4xl shadow-2xl rounded-xl bg-white" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b pb-4 mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Customer Details</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-3xl font-bold">&times;</button>
            </div>

            <div className="space-y-6">
              {/* Personal */}
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Full Name</label>
                    <p className="text-gray-900">{`${getField(viewing, ["first_name", "customer_name"])} ${viewing.middle_name || ""} ${viewing.last_name || ""} ${viewing.suffix || ""}`.trim()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Designation</label>
                    <p className="text-gray-900">{viewing.designation_position || "—"}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-gray-600">Residential Address</label>
                    <p className="text-gray-900">{viewing.residential_address || "—"}</p>
                  </div>
                </div>
              </div>

              {/* Business */}
              <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Business Information</h4>
                {loadingDetails ? (
                  <div className="text-sm text-gray-600">Loading details…</div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Agency/Firm</label>
                      <p className="text-gray-900">{getField(viewing, ["business.name_of_agency_firm", ["business","name_of_agency_firm"], "business", "name_of_agency_firm"]) || "—"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Business of the Firm</label>
                      <p className="text-gray-900">{getField(viewing, ["business.business_of_the_firm", ["business","business_of_the_firm"], "business_of_the_firm"]) || "—"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Product Line</label>
                      <p className="text-gray-900">{getField(viewing, ["business.product_line", "product_line"]) || "—"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Organization Type</label>
                      <p className="text-gray-900">{getField(viewing, ["business.type_of_organization", "type_of_organization"]) || "—"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Date Established</label>
                      <p className="text-gray-900">{(() => {
                        const dateStr = getField(viewing, ["business.date_established", "date_established"]);
                        if (dateStr === "—") return "—";
                        const d = new Date(dateStr);
                        return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString();
                      })()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Head of Agency/Firm</label>
                      <p className="text-gray-900">{getField(viewing, ["business.name_of_head_of_agency_firm", "name_of_head_of_agency_firm"])}</p>
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-gray-600">Business Address</label>
                      <p className="text-gray-900">{getField(viewing, ["business.business_address", "business_address"])}</p>
                    </div>
                  </div>
                )}
                {/* If business relationship is missing because Task49 isn't finished, show a hint */}
                {!viewing.business && !loadingDetails && (
                  <div className="mt-4 text-sm text-yellow-700 bg-yellow-100 px-4 py-2 rounded">
                    Business information is not yet available. (Waiting on Task 49)
                  </div>
                )}
              </div>

              {/* Contact */}
              <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Contact Number</label>
                    <p className="text-gray-900">{viewing.contact_nos || getField(viewing, ["business.contact_nos", "contact_nos"]) || "—"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email Address</label>
                    <p className="text-gray-900">{viewing.email_address || getField(viewing, ["business.email_address", "email_address"]) || "—"}</p>
                  </div>
                  { (viewing.website || getField(viewing, ["business.website", "website"])) && (
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-gray-600">Website</label>
                      <p className="text-gray-900">
                        <a href={viewing.website || getField(viewing, ["business.website", "website"])} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {viewing.website || getField(viewing, ["business.website", "website"])}
                        </a>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Status */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Status</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Status</label>
                    <p>
                      {(() => {
                        const s = normalizeStatus(viewing.status);
                        const cls = s === "Active" ? "bg-green-100 text-green-800" : s === "Inactive" ? "bg-red-100 text-red-800" : s === "Pending" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800";
                        return <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${cls}`}>{s}</span>;
                      })()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Created</label>
                    <p className="text-gray-900">{new Date(viewing.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-6 pt-4 border-t">
              <div>
                <button onClick={() => { handleDelete(viewing.id, `${viewing.first_name || viewing.customer_name || ""} ${viewing.last_name || ""}`.trim()); closeModal(); }} className="bg-gray-200 hover:bg-red-100 text-red-600 font-bold py-2 px-6 rounded-lg border border-red-300 hover:border-red-500">Delete Customer</button>
              </div>

              <div>
                <button onClick={() => { handleEdit(viewing.id); closeModal(); }} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg mr-2">Edit</button>
                <button onClick={closeModal} className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-bold py-2 px-6 rounded-lg">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <AddCustomerModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </AuthenticatedLayout>
  );
}
