import { useState, useEffect } from "react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Search, Trash2, Archive } from 'lucide-react';// Optional: for icons
import CreateMessageModal from '../Messages/CreateMessageModal';
interface Message {
  id: number;
  recipient: string;
  subject: string;
  date: string;
  isRead: boolean;
}

// --- EXPANDED DUMMY DATA (30 ITEMS) ---
const FAKE_MESSAGES: Message[] = [
  { id: 1, recipient: "Sarah Johnson", subject: "Permit Application Inquiry – Follow-up", date: "2024-01-15 10:30 AM", isRead: true },
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

export default function SetupMessageUI() {
  const [messages] = useState<Message[]>(FAKE_MESSAGES);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "read" | "unread">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Set to 6 to match the visual density of the screenshot

  const trimmedSearch = searchTerm.trim().toLowerCase();

  const filteredMessages = messages.filter((msg) => {
    const matchesSearch = !trimmedSearch || 
      msg.recipient.toLowerCase().includes(trimmedSearch) || 
      msg.subject.toLowerCase().includes(trimmedSearch);
    const matchesFilter = filter === "all" || (filter === "read" && msg.isRead) || (filter === "unread" && !msg.isRead);
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredMessages.length / itemsPerPage);
  const paginatedMessages = filteredMessages.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => { setCurrentPage(1); }, [filter, searchTerm]);

  return (
    <AuthenticatedLayout>
      <Head title="Inbox" />

      <div className="min-h-screen bg-[#F8F9FA] p-8">
        <div className="max-w-6xl mx-auto">
          
          {/* HEADER SECTION */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Inbox <span className="text-gray-400">({filteredMessages.length})</span>
            </h1>
            
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border-none rounded-full shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* ACTION BAR */}
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#5156E5] hover:bg-[#4348C8] text-white px-8 py-2.5 rounded-xl font-semibold transition-all shadow-md"
            >
              Compose +
            </button>

            <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100">
              {(["all", "read", "unread"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                    filter === f ? "bg-[#5156E5] text-white shadow-inner" : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* MESSAGE LIST */}
          <div className="space-y-3">
            {paginatedMessages.map((msg) => (
              <div 
                key={msg.id}
                className={`group flex items-center gap-6 p-5 rounded-2xl transition-all border border-transparent hover:border-indigo-100 ${
                  !msg.isRead ? "bg-[#E0E2FF]" : "bg-[#F1F1F1]"
                }`}
              >
                <div className="flex items-center gap-4">
                   <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-[#5156E5] focus:ring-[#5156E5]" />
                </div>

                <div className="flex-1 grid grid-cols-12 items-center gap-4">
                  <div className="col-span-3 font-bold text-gray-900 truncate">
                    {msg.recipient}
                  </div>
                  
                  <div className="col-span-7 flex items-baseline gap-2 overflow-hidden">
                    <span className="font-bold text-gray-900 whitespace-nowrap">{msg.subject}</span>
                    <span className="text-gray-500 text-sm truncate opacity-80">
                      - So I created this design to make the UI more engaging and to make the user feel like its easy to navigate...
                    </span>
                  </div>

                  <div className="col-span-2 text-right">
                    <div className="text-xs font-bold text-gray-900 mb-1">11:44 AM</div>
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1 hover:bg-white rounded text-gray-600"><Archive size={16}/></button>
                      <button className="p-1 hover:bg-white rounded text-red-500"><Trash2 size={16}/></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="p-2 rounded-full bg-white shadow-sm border border-gray-200 disabled:opacity-30"
              >
                ←
              </button>
              <span className="text-sm font-bold text-gray-600">Page {currentPage} of {totalPages}</span>
              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="p-2 rounded-full bg-white shadow-sm border border-gray-200 disabled:opacity-30"
              >
                →
              </button>
            </div>
          )}
        </div>
      </div>

      <CreateMessageModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </AuthenticatedLayout>
  );
}