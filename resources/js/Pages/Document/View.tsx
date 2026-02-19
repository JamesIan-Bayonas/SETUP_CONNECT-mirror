import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';

export default function ViewDocuments() {
  const [page, setPage] = useState(1);
  const totalPages = 2;
  const totalItems = 10;
  const itemsPerPage = 5;

  const startItem = (page - 1) * itemsPerPage + 1;
  const endItem = Math.min(page * itemsPerPage, totalItems);

  return (
    <AuthenticatedLayout>
      <div className="py-6 px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Documents</h1>
        </div>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-1.5 text-sm font-medium rounded-md bg-blue-600 text-white">
              All (5)
            </button>
            <button className="px-4 py-1.5 text-sm font-medium rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300">
              Recent
            </button>
            <button className="px-4 py-1.5 text-sm font-medium rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300">
              Oldest
            </button>
          </div>

          {/* Search + Create button */}
          <div className="flex flex-1 sm:flex-none items-center gap-3">
            <input
              type="text"
              placeholder="Search by name, type, cooperator..."
              className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <button className="whitespace-nowrap rounded-md bg-green-600 px-5 py-2 text-sm font-medium text-white hover:bg-green-700">
              + Create New Document
            </button>
          </div>
        </div>

        {/* Table container */}
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                    Document Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                    Cooperator
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                    Added
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                <tr className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">Payslip</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">Seth Lawrence Omandam</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">Feb 17, 2026</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <div className="flex items-center gap-4">
                      <button className="text-blue-600 hover:text-blue-800">View</button>
                      <button className="text-green-600 hover:text-green-800">Edit</button>
                      <button className="text-red-600 hover:text-red-800">Delete</button>
                    </div>
                  </td>
                </tr>

                <tr className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">Community Tax Certificate (Cedula)</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">Kristian Lloyd Pague</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">Feb 16, 2026</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <div className="flex items-center gap-4">
                      <button className="text-blue-600 hover:text-blue-800">View</button>
                      <button className="text-green-600 hover:text-green-800">Edit</button>
                      <button className="text-red-600 hover:text-red-800">Delete</button>
                    </div>
                  </td>
                </tr>

                <tr className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">Utility Bills</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">Libertine Valdehueza</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">Feb 15, 2026</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <div className="flex items-center gap-4">
                      <button className="text-blue-600 hover:text-blue-800">View</button>
                      <button className="text-green-600 hover:text-green-800">Edit</button>
                      <button className="text-red-600 hover:text-red-800">Delete</button>
                    </div>
                  </td>
                </tr>

                <tr className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">Employer Income Certificate</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">Jeevon Ricafort</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">Feb 14, 2026</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <div className="flex items-center gap-4">
                      <button className="text-blue-600 hover:text-blue-800">View</button>
                      <button className="text-green-600 hover:text-green-800">Edit</button>
                      <button className="text-red-600 hover:text-red-800">Delete</button>
                    </div>
                  </td>
                </tr>

                <tr className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">Tax Returns</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">Neo Echavez</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">Feb 13, 2026</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <div className="flex items-center gap-4">
                      <button className="text-blue-600 hover:text-blue-800">View</button>
                      <button className="text-green-600 hover:text-green-800">Edit</button>
                      <button className="text-red-600 hover:text-red-800">Delete</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Footer - simple showing text like first photo */}
          <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-6 py-3 text-sm text-gray-600">
            <div>
              Showing {startItem} to {endItem} of {totalItems} results
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}