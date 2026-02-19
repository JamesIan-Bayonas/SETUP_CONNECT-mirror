import { useState,useEffect } from "react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'; 
import { Head } from '@inertiajs/react';

interface Message {
  id: number;
  recipient: string;
  subject: string;
  date: string;
  isRead: boolean;
}



const FAKE_MESSAGES: Message[] = [
  { id: 1, recipient: "Sarah Johnson", subject: "Permit Application Inquiry – Follow-up on submitted documents", date: "2024-01-15 10:30 AM", isRead: true },
  { id: 2, recipient: "Michael Brown", subject: "Missing Requirements – Attached updated files", date: "2024-01-15 09:45 AM", isRead: false },
  { id: 3, recipient: "Jennifer Lee", subject: "System Maintenance Notice – Scheduled downtime", date: "2024-01-15 08:20 AM", isRead: true },
  { id: 4, recipient: "Jenni", subject: "System Maintenance Notice – Scheduled downtime", date: "2024-01-15 08:20 AM", isRead: true },
  { id: 5, recipient: "nifer Le", subject: "System Maintenance Notice – Scheduled downtime", date: "2024-01-15 08:20 AM", isRead: true },
  { id: 6, recipient: "ifer Lee", subject: "System Maintenance Notice – Scheduled downtime", date: "2024-01-15 08:20 AM", isRead: true },
  { id: 7, recipient: "Jennr Lee", subject: "System Maintenance Notice – Scheduled downtime", date: "2024-01-15 08:20 AM", isRead: true },
  { id: 8, recipient: "Jennifer e", subject: "System Maintenance Notice – Scheduled downtime", date: "2024-01-15 08:20 AM", isRead: true },
  { id: 9, recipient: "Jeer Lee", subject: "System Maintenance Notice – Scheduled downtime", date: "2024-01-15 08:20 AM", isRead: true },
  { id: 10, recipient: "Jeer Lee", subject: "System Maintenance Notice – Scheduled downtime", date: "2024-01-15 08:20 AM", isRead: false },
  { id: 11, recipient: "Jeer Lee", subject: "System Maintenance Notice – Scheduled downtime", date: "2024-01-15 08:20 AM", isRead: false },
  
];


export default function SetupMessageUI() {
  const [messages] = useState<Message[]>(FAKE_MESSAGES);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "read" | "unread">("all");

  const trimmedSearch = searchTerm.trim().toLowerCase();

  const filteredMessages = messages.filter((msg) => {
    const matchesSearch =
      !trimmedSearch ||
      msg.recipient.toLowerCase().includes(trimmedSearch) ||
      msg.subject.toLowerCase().includes(trimmedSearch);

    const matchesFilter =
      filter === "all" ||
      (filter === "read" && msg.isRead) ||
      (filter === "unread" && !msg.isRead);

    return matchesSearch && matchesFilter;
  });

  const clearSearch = () => setSearchTerm("");

  // Highlight helper
  const highlightText = (text: string) => {
    if (!trimmedSearch) return text;

    const regex = new RegExp(`(${trimmedSearch})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, i) =>
      part.toLowerCase() === trimmedSearch ? (
        <mark key={i} className="bg-yellow-200 text-black rounded px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  useEffect(() => {
  setCurrentPage(1);
}, [filter, searchTerm]);

  // Pagination settings
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(filteredMessages.length / itemsPerPage);

  const paginatedMessages = filteredMessages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


return (
    <AuthenticatedLayout
        header={
            <div className="flex justify-between items-center">
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">Messages</h2>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition">
                    + New Message
                </button>
            </div>
        }
    >
      <Head title="Messages" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
          <div className="p-5 bg-white rounded-xl shadow-sm border border-gray-200">
            {/* Controls row */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-5">
              {/* Search */}
              <div className="relative flex-1 min-w-0">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.6-5.4a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search recipient, subject..."
                  className="w-full sm:w-[60%] pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400/40 focus:border-indigo-400 bg-gray-50/70 transition"
                />
                {searchTerm && (
                  <button onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700" title="Clear search">
                    ✕
                  </button>
                )}
              </div>

              {/* Filter buttons */}
              <div className="flex gap-2 flex-shrink-0">
                {(["all", "unread", "read"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition
                      ${filter === f
                        ? "bg-indigo-100 text-indigo-700 border border-indigo-300"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"}`}
                  >
                    {f === "all" ? "All" : f === "unread" ? "Unread" : "Read"}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Recipient</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Subject</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date Sent</th>
                    <th className="px-6 py-3.5 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3.5 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filteredMessages.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-16 text-center text-gray-500">
                        {searchTerm || filter !== "all"
                          ? "No messages match your filter or search"
                          : "No messages yet"}
                      </td>
                    </tr>
                  ) : (
                    paginatedMessages.map((msg) => (
                      <tr
                        key={msg.id}
                        className={`hover:bg-indigo-50/40 transition-colors ${!msg.isRead ? "bg-indigo-50/20" : ""}`}
                      >
                        <td className="px-6 py-4 text-sm text-gray-900">{highlightText(msg.recipient)}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{highlightText(msg.subject)}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{msg.date}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${msg.isRead ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800 font-medium"}`}>
                            {msg.isRead ? "Read" : "Unread"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center text-sm space-x-4">
                          <a href={`/messages/${msg.id}`} className="text-indigo-600 hover:text-indigo-800 hover:underline">View</a>
                          <a href={`/messages/${msg.id}/edit`} className="text-indigo-600 hover:text-indigo-800 hover:underline">Edit</a>
                          <button className="text-red-600 hover:text-red-800 hover:underline">Delete</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 mt-4">
               <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredMessages.length)}</span> of <span className="font-medium">{filteredMessages.length}</span> results
                    </p>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                        <button onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className={`relative inline-flex items-center px-4 py-2 text-sm font-medium border rounded-l-md ${currentPage === 1 ? "text-gray-300 cursor-not-allowed bg-white border-gray-300" : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"}`}>« Previous</button>
                        <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium border z-10 bg-indigo-50 border-indigo-500 text-indigo-600">{currentPage}</span>
                        <button onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} className={`relative inline-flex items-center px-4 py-2 text-sm font-medium border rounded-r-md ${currentPage === totalPages ? "text-gray-300 cursor-not-allowed bg-white border-gray-300" : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"}`}>Next »</button>
                    </nav>
               </div>
            </div>

          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
