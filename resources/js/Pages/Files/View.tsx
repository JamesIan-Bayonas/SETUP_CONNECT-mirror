import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function ViewDocuments() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // NEW: toggle between 'grid' and 'list'
  const itemsPerPage = 5;

  const documents = [
  { id: 1, type: 'Payslip.pdf', cooperator: 'Seth Lawrence Omandam', added: 'Feb 17, 2026', thumbnail: '/images/thumbnails/Payslip.jpg' },
  { id: 2, type: 'Cedula.jpeg', cooperator: 'Kristian Lloyd Pague', added: 'Feb 16, 2026' , thumbnail: '/images/thumbnails/Cedula.jpg'},
  { id: 3, type: 'Utility_Bills.xlsx', cooperator: 'Libertine Valdehueza', added: 'Feb 15, 2026', thumbnail: '/images/thumbnails/Utility Bill.png' },
  { id: 4, type: 'Salary_Slip.docx', cooperator: 'Jeevon Ricafort', added: 'Feb 14, 2026', thumbnail: '/images/thumbnails/Salary Slip.png' },
  { id: 5, type: 'Cedula.jpg', cooperator: 'Neo Echavez', added: 'Feb 13, 2026', thumbnail: '/images/thumbnails/Cedula.jpg' },
  ];

  const filteredDocuments = documents.filter((d) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return d.type.toLowerCase().includes(q) || d.cooperator.toLowerCase().includes(q);
  });

  const totalItems = filteredDocuments.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startItem = totalItems === 0 ? 0 : (page - 1) * itemsPerPage + 1;
  const endItem = Math.min(page * itemsPerPage, totalItems);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [query, totalPages]);

  return (
    <AuthenticatedLayout>
  {/* Top Filters */}
  <div className="border-b border-gray-200 bg-gray-50 px-6 py-3">
    <h2 className="text-lg font-semibold mb-4">Documents</h2>
    <nav className="flex gap-3">
      <button className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium">
        All Documents ({documents.length})
      </button>
      <button className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 text-sm font-medium">
        Recent
      </button>
      <button className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 text-sm font-medium">
        Oldest
      </button>
    </nav>
  </div>

  {/* Main content */}
  <div className="flex h-screen flex-col">
    <main className="flex-1 flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
        <div className="relative flex-1 max-w-xl">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Documents"
            className="w-full rounded-md border border-gray-300 pl-10 pr-10 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 relative">
          <Link
            href="/Files/Upload"
            className="whitespace-nowrap rounded-md bg-green-600 px-5 py-2 text-sm font-medium text-white hover:bg-green-700"
          >
            + New Document
          </Link>

          {/* Dropdown toggle */}
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 text-sm font-medium flex items-center gap-2"
          >
            {viewMode === 'list' ? 'List View' : 'Grid View'}
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white border border-gray-200 z-10">
              <button
                onClick={() => {
                  setViewMode('list');
                  setShowDropdown(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                List View
              </button>
              <button
                onClick={() => {
                  setViewMode('grid');
                  setShowDropdown(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                Grid View
              </button>
            </div>
          )}
        </div>
      </div>

          {/* Conditional rendering */}
          {viewMode === 'list' ? (
            // LIST VIEW
            <div className="flex-1 overflow-y-auto bg-gray-50">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Document</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Owner</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Date Added</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Last Edited</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredDocuments.slice((page - 1) * itemsPerPage, page * itemsPerPage).map((doc, idx) => (
                    <tr className="hover:bg-gray-100" key={`${doc.cooperator}-${idx}`}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{doc.type}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 flex items-center justify-between">
                        <span>{doc.cooperator}</span>
                        <button className="text-blue-600 hover:text-blue-800" title="View Document">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{doc.added}</td>
                      <td className="px-6 py-4 text-xs text-gray-500 italic">Last edited: Feb 20, 2026 by Admin</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            // GRID VIEW
            <div className="flex-1 overflow-y-auto bg-gray-50 p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDocuments.slice((page - 1) * itemsPerPage, page * itemsPerPage).map((doc, idx) => (
                <div
                  key={`${doc.cooperator}-${idx}`}
                  className="group rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 shadow hover:shadow-lg hover:border-blue-400 transition transform hover:-translate-y-1"
                >
                  {/* Document Info */}
                  <div className="flex items-center justify-between px-4 pt-4">
                    <span className="font-semibold text-gray-900 truncate">{doc.type}</span>
                    <span className="text-xs text-gray-500">{doc.added}</span>
                  </div>

                  {/* Owner + Eye Icon */}
                  <div className="flex items-center justify-between px-4 py-3 text-sm text-gray-600">
                    <p className="truncate">Owner: {doc.cooperator}</p>
                    <button className="text-blue-600 hover:text-blue-800" title="View Document">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>

                  {/* Audit Log */}
                  <div className="px-4 pb-3 text-xs text-gray-500 italic">
                    Last edited: Feb 20, 2026 by Admin
                  </div>

                  {/* Thumbnail with fallback */}
                  <div className="w-full h-40 bg-gray-100 flex items-center justify-center overflow-hidden rounded-b-xl">
                    {doc.thumbnail ? (
                      <img src={doc.thumbnail} alt={doc.type} className="object-cover w-full h-full" />
                    ) : (
                      <div className="flex items-center justify-center h-full w-full text-4xl text-gray-400">
                        📄
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="border-t border-gray-200 bg-white px-6 py-3 text-sm text-gray-600">
            Showing {startItem} to {endItem} of {totalItems} results
          </div>
        </main>
      </div>
    </AuthenticatedLayout>
  );
}