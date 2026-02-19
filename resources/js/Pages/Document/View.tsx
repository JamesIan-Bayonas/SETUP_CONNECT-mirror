import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';

export default function ViewDocuments() {
  const [page, setPage] = useState(1);
  const totalPages = 2; // static for now

  return (
    <AuthenticatedLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Documents</h1>
          {/* Create New Document Button */}
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
            + Create New Document
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-4 flex justify-between items-center">
          <input
            type="text"
            placeholder="Search documents..."
            className="border rounded-lg px-3 py-2 w-1/3 focus:outline-none focus:ring focus:border-indigo-300"
          />
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
            Search
          </button>
        </div>

        {/* Table */}
        <div className="bg-white shadow rounded-lg p-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Document Type</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Cooperator</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Added</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {/* Dummy Data Rows */}
              <tr>
                <td className="px-4 py-2">Payslip</td>
                <td className="px-4 py-2">Seth Lawrence Omandam</td>
                <td className="px-4 py-2">Feb 17, 2026</td>
                <td className="px-4 py-2">
                  <button className="text-blue-600 hover:underline">View</button>
                  <button className="ml-2 text-green-600 hover:underline">Edit</button>
                  <button className="ml-2 text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2">Community Tax Certificate (Cedula)</td>
                <td className="px-4 py-2">Kristian Lloyd Pague</td>
                <td className="px-4 py-2">Feb 16, 2026</td>
                <td className="px-4 py-2">
                  <button className="text-blue-600 hover:underline">View</button>
                  <button className="ml-2 text-green-600 hover:underline">Edit</button>
                  <button className="ml-2 text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2">Utility Bills</td>
                <td className="px-4 py-2">Libertine Valdehueza</td>
                <td className="px-4 py-2">Feb 15, 2026</td>
                <td className="px-4 py-2">
                  <button className="text-blue-600 hover:underline">View</button>
                  <button className="ml-2 text-green-600 hover:underline">Edit</button>
                  <button className="ml-2 text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2">Employer Income Certificate</td>
                <td className="px-4 py-2">Jeevon Ricafort</td>
                <td className="px-4 py-2">Feb 14, 2026</td>
                <td className="px-4 py-2">
                  <button className="text-blue-600 hover:underline">View</button>
                  <button className="ml-2 text-green-600 hover:underline">Edit</button>
                  <button className="ml-2 text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2">Tax Returns</td>
                <td className="px-4 py-2">Neo Echavez</td>
                <td className="px-4 py-2">Feb 13, 2026</td>
                <td className="px-4 py-2">
                  <button className="text-blue-600 hover:underline">View</button>
                  <button className="ml-2 text-green-600 hover:underline">Edit</button>
                  <button className="ml-2 text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-between items-center">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className={`px-3 py-2 rounded-lg ${
              page === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            Prev
          </button>

          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className={`px-3 py-2 rounded-lg ${
              page === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}