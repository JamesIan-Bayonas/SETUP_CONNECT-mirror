import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useEffect, useState } from 'react';

export default function ViewDocuments() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const itemsPerPage = 5;

  // sample data (extracted from the table rows)
  const documents = [
    { type: 'Payslip', cooperator: 'Seth Lawrence Omandam', added: 'Feb 17, 2026' },
    { type: 'Community Tax Certificate (Cedula)', cooperator: 'Kristian Lloyd Pague', added: 'Feb 16, 2026' },
    { type: 'Utility Bills', cooperator: 'Libertine Valdehueza', added: 'Feb 15, 2026' },
    { type: 'Employee Salary Slip', cooperator: 'Jeevon Ricafort', added: 'Feb 14, 2026' },
    { type: 'Community Tax Certificate (Cedula)', cooperator: 'Neo Echavez', added: 'Feb 13, 2026' },
  ];

  // filter documents by query (searches type or cooperator)
  const filteredDocuments = documents.filter((d) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      d.type.toLowerCase().includes(q) ||
      d.cooperator.toLowerCase().includes(q)
    );
  });

  const totalItems = filteredDocuments.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startItem = totalItems === 0 ? 0 : (page - 1) * itemsPerPage + 1;
  const endItem = Math.min(page * itemsPerPage, totalItems);

  // Reset page if filtering reduces number of pages
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [query, totalPages]);

  return (
    <AuthenticatedLayout>
      <div>
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Documents</h1>
          </div>

          {/* Main card with filters + table */}
          <div className="mx-12">
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-6">
            {/* Filters + Search + Add Button */}
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
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none sm:max-w-xl">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                  </svg>
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by document type or cooperator"
                  className="w-full rounded-md border border-gray-300 pl-10 pr-10 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-500 hover:text-gray-700"
                    aria-label="Clear search"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6.225 4.811a1 1 0 011.414 0L10 7.172l2.361-2.361a1 1 0 111.414 1.414L11.414 8.586l2.361 2.361a1 1 0 01-1.414 1.414L10 10l-2.361 2.361a1 1 0 01-1.414-1.414L8.586 8.586 6.225 6.225a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>

              <button className="whitespace-nowrap rounded-md bg-green-600 px-5 py-2 text-sm font-medium text-white hover:bg-green-700">
                + Create New Document
              </button>
            </div>
            </div>

          {/* Table container */}
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
                      
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredDocuments.slice((page - 1) * itemsPerPage, page * itemsPerPage).map((doc, idx) => (
                    <tr className="hover:bg-gray-50" key={`${doc.cooperator}-${idx}`}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{doc.type}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{doc.cooperator}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{doc.added}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-4">
                          <button className="text-blue-600 hover:text-blue-800">View</button>
                          <button className="text-green-600 hover:text-green-800">Edit</button>
                          <button className="text-red-600 hover:text-red-800">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
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
      </div>
    </AuthenticatedLayout>
  );
}