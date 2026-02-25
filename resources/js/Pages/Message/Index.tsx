import { useState, useEffect } from "react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { 
  Search, 
  Trash2, 
  Archive, 
  ChevronLeft,  
  ChevronRight 
} from 'lucide-react';
import CreateMessageModal from '../Messages/CreateMessageModal';

interface Message {
  id: number;
  recipient: string;
  subject: string;
  date: string; // ISO format: "YYYY-MM-DDTHH:mm:ss"
  isRead: boolean;
}

// 🔶 Highlight matching search text
function HighlightText({
  text,
  highlight,
}: {
  text: string;
  highlight: string;
}) {
  if (!highlight.trim()) return <span>{text}</span>;

  const regex = new RegExp(`(${highlight})`, "gi");
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-yellow-200 rounded px-0.5">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}

// --- DUMMY DATA (30 ITEMS) ---
const FAKE_MESSAGES: Message[] = [
  { id: 1, recipient: "Sarah Johnson", subject: "Permit Application Inquiry – Follow-up", date: "2026-02-24 10:30 AM", isRead: true },
  { id: 2, recipient: "Michael Brown", subject: "Missing Requirements – Attached updated files", date: "2024-01-15 09:45 AM", isRead: false },
  { id: 3, recipient: "Jennifer Lee", subject: "System Maintenance Notice – Scheduled downtime", date: "2024-01-15 08:20 AM", isRead: true },
  { id: 4, recipient: "Jenni", subject: "UI Design Feedback - Requesting changes", date: "2024-01-16 11:00 AM", isRead: true },
  { id: 5, recipient: "nifer Le", subject: "System Maintenance Notice – Phase 2", date: "2024-01-16 02:20 PM", isRead: true },
  { id: 6, recipient: "ifer Lee", subject: "Project Proposal – Final Review", date: "2024-01-17 09:00 AM", isRead: true },
  { id: 7, recipient: "Jennr Lee", subject: "New Assignment: Database Schema", date: "2024-01-18 04:30 PM", isRead: true },
  { id: 8, recipient: "Jennifer e", subject: "Meeting Reminder: Sprint Planning", date: "2024-01-19 08:00 AM", isRead: true },
  { id: 9, recipient: "Jeer Lee", subject: "Holiday Schedule Update", date: "2024-01-20 01:20 PM", isRead: true },
  { id: 10, recipient: "Jeer Lee", subject: "Account Verification Required", date: "2024-01-21 11:45 AM", isRead: false },
  { id: 11, recipient: "Jeer Lee", subject: "Inquiry regarding Permit #9920", date: "2024-01-22 03:20 PM", isRead: false },
  { id: 12, recipient: "Ivan Paul Benedict Intong", subject: "Creating a Design - UI Engagement", date: "2024-01-23 11:44 AM", isRead: true },
  { id: 13, recipient: "Zein Bernard Aliswag", subject: "Creating Our Project Proposal", date: "2024-01-24 03:00 AM", isRead: false },
  { id: 14, recipient: "Sarah Johnson", subject: "Updated Contract - Please Sign", date: "2024-01-25 09:15 AM", isRead: true },
  { id: 15, recipient: "Michael Brown", subject: "Weekly Report – Sales Dept", date: "2024-01-26 05:00 PM", isRead: true },
  { id: 16, recipient: "Jennifer Lee", subject: "Onboarding Materials", date: "2024-01-27 10:20 AM", isRead: false },
  { id: 17, recipient: "Ivan Paul Benedict Intong", subject: "Design Iteration #2", date: "2024-01-28 11:44 AM", isRead: true },
  { id: 18, recipient: "Zein Bernard Aliswag", subject: "Proposal Draft - Version B", date: "2024-01-29 03:00 AM", isRead: true },
  { id: 19, recipient: "Alice Wonderland", subject: "Welcome to the Platform", date: "2024-01-30 08:30 AM", isRead: true },
  { id: 20, recipient: "Bob Builder", subject: "Maintenance Completed", date: "2024-01-31 12:00 PM", isRead: false },
  { id: 21, recipient: "Charlie Day", subject: "Nightman Cometh Schedule", date: "2024-02-01 07:00 PM", isRead: true },
  { id: 22, recipient: "Diana Prince", subject: "Security Training Module", date: "2024-02-02 11:00 AM", isRead: true },
  { id: 23, recipient: "Edward Elric", subject: "Alchemy Project Updates", date: "2024-02-03 09:45 AM", isRead: false },
  { id: 24, recipient: "Fiona Apple", subject: "Music License Agreement", date: "2024-02-04 02:20 PM", isRead: true },
  { id: 25, recipient: "George Miller", subject: "Fury Road Logistics", date: "2024-02-05 04:30 PM", isRead: true },
  { id: 26, recipient: "Hank Pym", subject: "Particle Research Data", date: "2024-02-06 10:00 AM", isRead: false },
  { id: 27, recipient: "Iris West", subject: "Article Submission Draft", date: "2024-02-07 01:15 PM", isRead: true },
  { id: 28, recipient: "John Wick", subject: "Supply Order: Continental", date: "2024-02-08 12:45 AM", isRead: true },
  { id: 29, recipient: "Kathy Bates", subject: "Fan Letter - Misery", date: "2024-02-09 03:50 PM", isRead: true },
  { id: 30, recipient: "Leo Messi", subject: "Training Schedule Adjustment", date: "2024-02-10 08:20 AM", isRead: false },
];

// --- DATE HELPER FUNCTION ---
const formatMessageDate = (dateString: string) => {
  const messageDate = new Date(dateString);
  const now = new Date();
  const isToday = messageDate.toDateString() === now.toDateString();

  if (isToday) {
    return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else {
    return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
};

export default function SetupMessageUI() {
  const [messages, setMessages] = useState<Message[]>(FAKE_MESSAGES);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "read" | "unread">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; 

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleViewMessage = (id: number) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, isRead: true } : m));
  };

  const filteredMessages = messages.filter((msg) => {
    const matchesSearch = !searchTerm || 
      msg.recipient.toLowerCase().includes(searchTerm.toLowerCase()) || 
      msg.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || (filter === "read" && msg.isRead) || (filter === "unread" && !msg.isRead);
    return matchesSearch && matchesFilter;
  });

  const totalResults = filteredMessages.length;
  const totalPages = Math.ceil(totalResults / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalResults);
  const paginatedMessages = filteredMessages.slice(startIndex, endIndex);

  useEffect(() => { setCurrentPage(1); }, [filter, searchTerm]);

  return (
    <AuthenticatedLayout>
      <Head title="Inbox" />

      <div className="min-h-screen bg-[#F9FAFB] p-2 md:p-4 font-sans"> 
        <div className="max-w-full mx-auto bg-white rounded-xl shadow-sm min-h-[90vh] p-6 flex flex-col">
          
          <div className="flex-1">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                Inbox <span className="text-gray-400 font-medium">({totalResults})</span>
              </h1>
              
              {/* ACTIVE + SEARCH BAR */}
              <div className="flex items-center gap-3 w-full max-w-xl">

                {/* Active Status */}
                <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-full shadow-sm whitespace-nowrap">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  <span className="text-xs font-semibold text-gray-700">
                    Active
                  </span>
                </div>

                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 z-10" />
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#F3F4F6] text-gray-700 border-none rounded-full focus:outline-none focus:ring-0 focus:bg-white focus:shadow-md transition-all duration-200 text-sm"
                  />
                </div>

              </div>
            </div>

            {/* ACTION BAR */}
            <div className="flex items-center gap-3 mb-6">
             <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-[#5156E5] hover:bg-[#4348C8] text-white px-6 py-2 rounded-lg font-bold text-sm transition-all"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth={2} 
                  stroke="currentColor" 
                  className="w-4 h-4"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                </svg>
                Compose 
              </button>
              <div className="flex bg-[#F3F4F6] p-1 rounded-lg">
                {(["all", "read", "unread"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-5 py-1.5 rounded-md text-xs font-bold transition-all ${
                      filter === f ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* MESSAGE LIST */}
            <div className="border-t border-gray-100"> 
              {paginatedMessages.map((msg) => {
                const isSelected = selectedIds.includes(msg.id);
                return (
                  <div 
                    key={msg.id}
                    onClick={() => handleViewMessage(msg.id)}
                    className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-200 cursor-pointer border-b border-gray-100 relative
                      ${isSelected 
                        ? "bg-[#DDE0FF] border-indigo-200 shadow-sm" 
                        : !msg.isRead 
                          ? "bg-gray-100 border-gray-200 rounded-lg p-4"
                          : "bg-white hover:bg-gray-50"
                      }
                      hover:shadow-lg hover:z-10
                    `}
                  >
                    <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                      <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={() => toggleSelect(msg.id)}
                        className="w-5 h-5 rounded border-gray-300 text-[#5156E5] focus:ring-[#5156E5]" 
                      />
                    </div>

                    <div className="flex-1 grid grid-cols-12 items-center gap-2">
                      <div className={`col-span-3 truncate text-sm ${!msg.isRead ? "font-bold text-black" : "font-medium text-gray-700"}`}>
                       <HighlightText text={msg.recipient} highlight={searchTerm} />
                      </div>
                      <div className="col-span-7 flex items-baseline gap-2 overflow-hidden">
                        <span className={`text-sm whitespace-nowrap ${!msg.isRead ? "font-bold text-black" : "font-semibold text-gray-800"}`}>
                          <HighlightText text={msg.subject} highlight={searchTerm} />
                        </span>
                        <span className="text-gray-500 text-xs truncate">
                          - I created this design to make the UI more engaging...
                        </span>
                      </div>
                      <div className="col-span-2 text-right flex flex-col items-end min-w-[80px]">
                        <div className="text-[10px] font-bold text-gray-900">
                          {formatMessageDate(msg.date)}
                        </div>
                        <div className={`flex gap-1 mt-1 transition-opacity ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                          <button className="p-1 hover:bg-gray-100 rounded text-gray-600"><Archive size={14}/></button>
                          <button className="p-1 hover:bg-gray-100 rounded text-red-500"><Trash2 size={14}/></button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* FOOTER */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
              <div className="text-xs text-gray-600">
                {totalResults > 0 ? `${startIndex + 1}-${endIndex} of ${totalResults} results` : "0 results"}
              </div>

              <div className="flex gap-2">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="p-2 rounded-lg bg-[#F3F4F6] hover:bg-gray-200 disabled:opacity-40 transition-colors"
                >
                  <ChevronLeft size={20} className="text-gray-700" />
                </button>
                
                <button 
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="p-2 rounded-lg bg-[#F3F4F6] hover:bg-gray-200 disabled:opacity-40 transition-colors"
                >
                  <ChevronRight size={20} className="text-gray-700" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      <CreateMessageModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </AuthenticatedLayout>
  );
}