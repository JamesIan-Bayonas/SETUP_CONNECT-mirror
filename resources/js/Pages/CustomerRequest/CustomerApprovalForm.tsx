import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

interface CustomerApplication {
  id: number;
  customerName: string;
  agencyFirm: string;
  dateOfApplication: string;
  status: "Pending" | "Approved" | "Declined";
}

export default function CustomerApprovalForm() {
  // Dummy data for visualization (commented out – ready for backend integration)
  /*
  const applications: CustomerApplication[] = [
    {
      id: 1,
      customerName: "Juan Dela Cruz",
      agencyFirm: "ABC Manufacturing",
      dateOfApplication: "2025-10-25",
      status: "Pending",
    },
    {
      id: 2,
      customerName: "Maria Santos",
      agencyFirm: "XYZ Trading",
      dateOfApplication: "2025-10-27",
      status: "Approved",
    },
    {
      id: 3,
      customerName: "Jose Ramos",
      agencyFirm: "Techno Builders",
      dateOfApplication: "2025-10-29",
      status: "Declined",
    },
  ];
  */

  // Placeholder until real data is fetched
  const applications: CustomerApplication[] = [];

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
                      <th className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-gray-200">
                    {applications.length > 0 ? (
                      applications.map((app) => (
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
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {app.status === "Pending" ? (
                              <div className="flex space-x-2 justify-end">
                                <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded">
                                  Approve
                                </button>
                                <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded">
                                  Decline
                                </button>
                              </div>
                            ) : (
                              <span className="text-gray-400 italic">No actions</span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-4 text-center text-sm text-gray-500"
                        >
                          No customer applications found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Placeholder */}
              <div className="flex justify-between items-center border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
                <p className="text-sm text-gray-700">Showing 0 results</p>
                <div className="flex space-x-1">
                  <button className="px-3 py-1 border border-gray-300 text-sm rounded hover:bg-gray-50">
                    Previous
                  </button>
                  <button className="px-3 py-1 border border-gray-300 text-sm rounded hover:bg-gray-50">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
