import { useState } from "react";

interface Message {
  id: number;
  sender: string;
  recipient: string;
  subject: string;
  date: string;
  isRead: boolean;
}

const FAKE_MESSAGES: Message[] = [
  { 
    id: 1, 
    sender: "John Smith", 
    recipient: "Sarah Johnson", 
    subject: "Permit Application Inquiry – Follow-up on submitted documents",
    date: "2024-01-15 10:30 AM", 
    isRead: true 
  },
  { 
    id: 2, 
    sender: "Emily Davis", 
    recipient: "Michael Brown", 
    subject: "Missing Requirements – Attached updated files",
    date: "2024-01-15 09:45 AM", 
    isRead: false 
  },
  { 
    id: 3, 
    sender: "Robert Wilson", 
    recipient: "Jennifer Lee", 
    subject: "System Maintenance Notice – Scheduled downtime",
    date: "2024-01-15 08:20 AM", 
    isRead: true 
  },
];

export default function SetupMessageUI() {
  const [messages] = useState(FAKE_MESSAGES);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "read" | "unread">("all");

  const filteredMessages = messages.filter((msg) => {
    const matchesSearch =
      msg.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "read" && msg.isRead) ||
      (filter === "unread" && !msg.isRead);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Setup Message Management</h2>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
          Add Setup Message
        </button>
      </div>

      {/* Search Label */}
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Search
      </label>

      {/* Search Input with Icon */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search by sender, subject, or recipient..."
          className="border rounded w-64 px-3 py-2 pl-10 focus:outline-none"
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Search Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-400 absolute left-3 top-2.5 pointer-events-none"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
          />
        </svg>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sender</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date Sent</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recipient</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {filteredMessages.map((msg) => (
              <tr key={msg.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{msg.sender}</td>

                {/* SUBJECT COLUMN */}
                <td className="px-6 py-4 text-sm text-gray-900">
                  {msg.subject}
                </td>

                <td className="px-6 py-4 text-sm text-gray-500">{msg.date}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{msg.recipient}</td>

                {/* Status */}
                <td className="px-6 py-4 text-center">
                  <span
                    className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                      msg.isRead
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {msg.isRead ? "Read" : "Unread"}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-center space-x-3">
                  <a href={`/messages/${msg.id}`} className="text-indigo-600 hover:underline">
                    View
                  </a>
                  <a href={`/messages/${msg.id}/edit`} className="text-indigo-600 hover:underline">
                    Edit
                  </a>
                  <a href={`/messages/${msg.id}/delete`} className="text-red-600 hover:underline">
                    Delete
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-gray-600">
          Showing 1 to {filteredMessages.length} of {messages.length} results
        </span>
        <div className="space-x-2">
          <button className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">Previous</button>
          <button className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">1</button>
          <button className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">2</button>
          <button className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">Next</button>
        </div>
      </div>
    </div>
  );
}
