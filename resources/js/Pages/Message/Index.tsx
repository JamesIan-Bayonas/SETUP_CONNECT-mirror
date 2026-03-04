import { useState, useEffect } from "react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { 
  Search, 
  Trash2, 
  Archive, 
  ChevronLeft,  
  ChevronRight,
  PenSquare,
  Paperclip,
  FileText,
  Image,
  File,
  FileSpreadsheet,
  FileArchive,
  FileCode,
  Eye,
  EyeOff
} from 'lucide-react';
import CreateMessageModal from '../Messages/CreateMessageModal';

interface Attachment {
  name: string;
  size: string;
  type: 'pdf' | 'image' | 'doc' | 'spreadsheet' | 'archive' | 'code' | 'other';
}

interface Message {
  id: number;
  recipient: string;
  subject: string;
  date: string;
  isRead: boolean;
  hasAttachments?: boolean;
  attachments?: Attachment[];
  body: string;
}

// 🔶 Highlight matching search text
function HighlightText({ text, highlight }: { text: string; highlight: string }) {
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

// Helper function to get badge styling based on file type
const getFileBadgeStyle = (type: string) => {
  switch (type) {
    case 'pdf':
      return {
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-200',
        icon: <FileText size={12} className="text-red-500" />,
      };
    case 'image':
      return {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        icon: <Image size={12} className="text-blue-500" />,
      };
    case 'doc':
      return {
        bg: 'bg-indigo-50',
        text: 'text-indigo-700',
        border: 'border-indigo-200',
        icon: <FileText size={12} className="text-indigo-500" />,
      };
    case 'spreadsheet':
      return {
        bg: 'bg-green-50',
        text: 'text-green-700',
        border: 'border-green-200',
        icon: <FileSpreadsheet size={12} className="text-green-500" />,
      };
    case 'archive':
      return {
        bg: 'bg-cyan-50',
        text: 'text-cyan-700',
        border: 'border-cyan-200',
        icon: <FileArchive size={12} className="text-cyan-500" />,
      };
    case 'code':
      return {
        bg: 'bg-purple-50',
        text: 'text-purple-700',
        border: 'border-purple-200',
        icon: <FileCode size={12} className="text-purple-500" />,
      };
    default:
      return {
        bg: 'bg-gray-50',
        text: 'text-gray-700',
        border: 'border-gray-200',
        icon: <File size={12} className="text-gray-500" />,
      };
  }
};

// --- DUMMY DATA WITH ATTACHMENTS AND MESSAGE BODIES (31 ITEMS) ---
const FAKE_MESSAGES: Message[] = [
  { id: 1, recipient: "Sarah Johnson", subject: "Permit Application Inquiry – Follow-up", date: "2026-02-26 10:30 AM", isRead: true, hasAttachments: true, attachments: [{ name: "application.pdf", size: "2.4 MB", type: "pdf" }, { name: "blueprint.jpg", size: "1.8 MB", type: "image" }], body: "Hi, I'm following up on the permit application I submitted last week. Could you please let me know if there are any additional requirements or documents needed?" },
  { id: 2, recipient: "Michael Brown", subject: "Missing Requirements – Attached updated files", date: "2026-01-15 09:45 AM", isRead: false, hasAttachments: true, attachments: [{ name: "requirements.docx", size: "856 KB", type: "doc" }, { name: "budget.xlsx", size: "1.2 MB", type: "spreadsheet" }, { name: "signed_forms.pdf", size: "3.1 MB", type: "pdf" }], body: "I've attached the missing requirements as requested. Please review the updated documents and let me know if you need anything else." },
  { id: 3, recipient: "Jennifer Lee", subject: "System Maintenance Notice – Scheduled downtime", date: "2024-01-15 08:20 AM", isRead: true, hasAttachments: false, body: "We will be performing scheduled maintenance this weekend. The system will be unavailable from Saturday 10 PM to Sunday 2 AM." },
  { id: 4, recipient: "Jenni", subject: "UI Design Feedback - Requesting changes", date: "2024-01-16 11:00 AM", isRead: true, hasAttachments: true, attachments: [{ name: "mockups.fig", size: "5.7 MB", type: "other" }], body: "The latest design looks great! Just a few minor changes needed on the home page. The color scheme is perfect but we need to adjust the spacing." },
  { id: 5, recipient: "nifer Le", subject: "System Maintenance Notice – Phase 2", date: "2024-01-16 02:20 PM", isRead: true, hasAttachments: false, body: "Phase 2 of the system maintenance will begin next week. Please ensure all your work is saved and backed up." },
  { id: 6, recipient: "ifer Lee", subject: "Project Proposal – Final Review", date: "2024-01-17 09:00 AM", isRead: true, hasAttachments: true, attachments: [{ name: "proposal.pdf", size: "4.2 MB", type: "pdf" }, { name: "presentation.pptx", size: "8.1 MB", type: "other" }], body: "Please review the final project proposal and let me know your thoughts by Friday. The client is expecting feedback early next week." },
  { id: 7, recipient: "Jennr Lee", subject: "New Assignment: Database Schema", date: "2024-01-18 04:30 PM", isRead: true, hasAttachments: true, attachments: [{ name: "schema.sql", size: "245 KB", type: "code" }, { name: "diagram.pdf", size: "1.2 MB", type: "pdf" }], body: "I've assigned you to work on the new database schema design. Check the attachments for requirements and the current diagram." },
  { id: 8, recipient: "Jennifer e", subject: "Meeting Reminder: Sprint Planning", date: "2024-01-19 08:00 AM", isRead: true, hasAttachments: false, body: "Reminder: Sprint planning meeting tomorrow at 10 AM in the conference room. Please come prepared with your updates." },
  { id: 9, recipient: "Jeer Lee", subject: "Holiday Schedule Update", date: "2024-01-20 01:20 PM", isRead: true, hasAttachments: true, attachments: [{ name: "schedule.pdf", size: "1.1 MB", type: "pdf" }], body: "Please review the updated holiday schedule for Q2 attached. We've made some changes to accommodate the new company events." },
  { id: 10, recipient: "Jeer Lee", subject: "Account Verification Required", date: "2024-01-21 11:45 AM", isRead: false, hasAttachments: false, body: "Please verify your account to continue using our services. Click the link below to verify your email address." },
  { id: 11, recipient: "Jeer Lee", subject: "Inquiry regarding Permit #9920", date: "2024-01-22 03:20 PM", isRead: false, hasAttachments: true, attachments: [{ name: "permit_docs.zip", size: "12.5 MB", type: "archive" }], body: "I'm following up on permit #9920 that was submitted last month. Can you provide an update on the status?" },
  { id: 12, recipient: "Ivan Paul Benedict Intong", subject: "Creating a Design - UI Engagement", date: "2024-01-23 11:44 AM", isRead: true, hasAttachments: true, attachments: [{ name: "design_system.fig", size: "6.3 MB", type: "other" }, { name: "assets.zip", size: "15.2 MB", type: "archive" }], body: "Let's work on the UI engagement strategy for the new dashboard. I've attached the design system files for reference." },
  { id: 13, recipient: "Zein Bernard Aliswag", subject: "Creating Our Project Proposal", date: "2024-01-24 03:00 AM", isRead: false, hasAttachments: false, body: "I've started drafting the project proposal for the client meeting next week. Let's schedule a time to review it together." },
  { id: 14, recipient: "Sarah Johnson", subject: "Updated Contract - Please Sign", date: "2024-01-25 09:15 AM", isRead: true, hasAttachments: true, attachments: [{ name: "contract_v2.pdf", size: "3.4 MB", type: "pdf" }, { name: "signature_page.pdf", size: "1.2 MB", type: "pdf" }], body: "Please review and sign the updated contract at your earliest convenience. The changes reflect the new terms we discussed." },
  { id: 15, recipient: "Michael Brown", subject: "Weekly Report – Sales Dept", date: "2024-01-26 05:00 PM", isRead: true, hasAttachments: true, attachments: [{ name: "sales_q1.xlsx", size: "2.8 MB", type: "spreadsheet" }, { name: "charts.pptx", size: "5.4 MB", type: "other" }], body: "Here's the weekly sales report with Q1 projections. Numbers are looking good this week with a 15% increase." },
  { id: 16, recipient: "Jennifer Lee", subject: "Onboarding Materials", date: "2024-01-27 10:20 AM", isRead: false, hasAttachments: true, attachments: [{ name: "handbook.pdf", size: "4.7 MB", type: "pdf" }, { name: "welcome.jpg", size: "2.1 MB", type: "image" }, { name: "forms.docx", size: "956 KB", type: "doc" }], body: "Welcome to the team! Here are your onboarding materials to help you get started. Let me know if you have any questions." },
  { id: 17, recipient: "Ivan Paul Benedict Intong", subject: "Design Iteration #2", date: "2024-01-28 11:44 AM", isRead: true, hasAttachments: true, attachments: [{ name: "iteration2.fig", size: "7.8 MB", type: "other" }], body: "Here's the second iteration of the design based on your feedback. I've made the changes to the navigation and color scheme." },
  { id: 18, recipient: "Zein Bernard Aliswag", subject: "Proposal Draft - Version B", date: "2024-01-29 03:00 AM", isRead: true, hasAttachments: false, body: "I've updated the proposal with the new requirements from the client. Can you review the changes when you have a chance?" },
  { id: 19, recipient: "Alice Wonderland", subject: "Welcome to the Platform", date: "2024-01-30 08:30 AM", isRead: true, hasAttachments: false, body: "Welcome! We're excited to have you on board. Get started by completing your profile and exploring the features." },
  { id: 20, recipient: "Bob Builder", subject: "Maintenance Completed", date: "2024-01-31 12:00 PM", isRead: false, hasAttachments: true, attachments: [{ name: "report.pdf", size: "2.3 MB", type: "pdf" }], body: "The scheduled maintenance has been completed successfully. All systems are now back online. See attached report for details." },
  { id: 21, recipient: "Charlie Day", subject: "Nightman Cometh Schedule", date: "2024-02-01 07:00 PM", isRead: true, hasAttachments: false, body: "Here's the rehearsal schedule for the upcoming show. Please arrive 15 minutes early to warm up." },
  { id: 22, recipient: "Diana Prince", subject: "Security Training Module", date: "2024-02-02 11:00 AM", isRead: true, hasAttachments: true, attachments: [{ name: "training.mp4", size: "45.2 MB", type: "other" }, { name: "certificate.pdf", size: "1.5 MB", type: "pdf" }], body: "Please complete the new security training module by Friday. The training takes about 30 minutes to complete." },
  { id: 23, recipient: "Edward Elric", subject: "Alchemy Project Updates", date: "2024-02-03 09:45 AM", isRead: false, hasAttachments: false, body: "Latest updates on the alchemy research project. We've made significant progress on the transmutation circle." },
  { id: 24, recipient: "Fiona Apple", subject: "Music License Agreement", date: "2024-02-04 02:20 PM", isRead: true, hasAttachments: true, attachments: [{ name: "license.pdf", size: "2.8 MB", type: "pdf" }], body: "Please review the attached music license agreement for the upcoming tour. Let me know if you have any questions." },
  { id: 25, recipient: "George Miller", subject: "Fury Road Logistics", date: "2024-02-05 04:30 PM", isRead: true, hasAttachments: false, body: "Logistics plan for the Fury Road production is ready for review. We'll need to confirm vehicle availability by Friday." },
  { id: 26, recipient: "Hank Pym", subject: "Particle Research Data", date: "2024-02-06 10:00 AM", isRead: false, hasAttachments: true, attachments: [{ name: "experiment_results.xlsx", size: "3.7 MB", type: "spreadsheet" }, { name: "charts.pdf", size: "4.2 MB", type: "pdf" }, { name: "data.zip", size: "22.1 MB", type: "archive" }], body: "Latest findings from the particle research lab. The results are promising and could lead to a breakthrough." },
  { id: 27, recipient: "Iris West", subject: "Article Submission Draft", date: "2024-02-07 01:15 PM", isRead: true, hasAttachments: false, body: "Here's the draft article for your review. Let me know if you have any feedback or suggestions for improvement." },
  { id: 28, recipient: "John Wick", subject: "Supply Order: Continental", date: "2024-02-08 12:45 AM", isRead: true, hasAttachments: true, attachments: [{ name: "order_form.pdf", size: "1.9 MB", type: "pdf" }], body: "Supply order for the Continental has been processed and should arrive by the end of the week." },
  { id: 29, recipient: "Kathy Bates", subject: "Fan Letter - Misery", date: "2024-02-09 03:50 PM", isRead: true, hasAttachments: false, body: "Thank you for your wonderful performance in Misery. You truly captured the essence of the character." },
  { id: 30, recipient: "Leo Messi", subject: "Training Schedule Adjustment", date: "2024-02-10 08:20 AM", isRead: false, hasAttachments: true, attachments: [{ name: "new_schedule.pdf", size: "1.2 MB", type: "pdf" }], body: "Training schedule has been adjusted for the upcoming match. Please review the attached document for the new times." },
  { id: 31, recipient: "Jeer Lee", subject: "Holiday Schedule Update", date: "2024-01-20 01:20 PM", isRead: false, hasAttachments: true, attachments: [{ name: "schedule.pdf", size: "1.1 MB", type: "pdf" }], body: "Please review the updated holiday schedule for Q2 attached. We've made some changes to accommodate the new company events." }
];

// --- DATE HELPER FUNCTION ---
const formatMessageDate = (dateString: string) => {
  const messageDate = new Date(dateString);
  const now = new Date();
  const isToday = messageDate.toDateString() === now.toDateString();
  const isThisYear = messageDate.getFullYear() === now.getFullYear();

  if (isToday) {
    return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (isThisYear) {
    return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
  } else {
    return messageDate.toLocaleDateString([], { month: '2-digit', day: '2-digit', year: 'numeric' });
  }
};

// 🔥 Group messages by recipient (Messenger-style conversation list)
const groupMessagesByRecipient = (messages: Message[]) => {
  const grouped: Record<string, Message[]> = {};

  messages.forEach((msg) => {
    if (!grouped[msg.recipient]) grouped[msg.recipient] = [];
    grouped[msg.recipient].push(msg);
  });

  return Object.keys(grouped).map((recipient) => {
    const conversation = grouped[recipient];
    const sorted = [...conversation].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const latestMessage = sorted[0];
    const unreadCount = conversation.filter((m) => !m.isRead).length;

    return {
      ...latestMessage,
      unreadCount,
      conversation,
    } as Message & { unreadCount: number; conversation: Message[] };
  });
};

export default function SetupMessageUI() {
  // Keep messages session-scoped (per-tab). Read from `sessionStorage`
  // if available so changes persist while the tab is open, but are cleared
  // when the tab/browser is closed.
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const raw = sessionStorage.getItem('inbox_messages_v1');
      return raw ? (JSON.parse(raw) as Message[]) : FAKE_MESSAGES;
    } catch (e) {
      return FAKE_MESSAGES;
    }
  });
  // track state locally only — we no longer auto-mark messages read on mount

  // Note: removed the development `resetInbox` helper to keep inbox state
  // persistent. Use the UI actions to toggle read/unread states instead.
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "read" | "unread">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  // When the user returns to the inbox in the same tab, we may want the
  // header to show 0 (so it appears 'seen') while keeping messages' actual
  // `isRead` flags unchanged. This state suppresses the header unread
  // indicator until the user interacts (clicks a message or uses actions).
  const [suppressHeaderCount, setSuppressHeaderCount] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  // Clicking an unread message will mark it read. Clicking a read message does nothing.
  const handleViewMessage = (id: number) => {
    // once the user views a message, reveal the actual unread counts
    // (stop suppressing the header count)
    setSuppressHeaderCount(false);
    try {
      sessionStorage.setItem('inbox_modified', 'true');
    } catch {}
    setMessages((prev) => {
      const newMessages = prev.map((m) => {
        if (m.id === id && !m.isRead) {
          return { ...m, isRead: true };
        }
        return m;
      });
      try {
        const changed = newMessages.find((m) => m.id === id && m.isRead);
        if (typeof window !== 'undefined' && changed) {
          window.dispatchEvent(new CustomEvent('message:read-status-changed', { detail: { id: changed.id, isRead: changed.isRead } }));
        }
      } catch (e) {
        // ignore dispatch errors
      }
      return newMessages;
    });
  };

  // Toggle message read/unread status
  const toggleMessageReadStatus = (id: number) => {
    setSuppressHeaderCount(false);
    try {
      sessionStorage.setItem('inbox_modified', 'true');
    } catch {}
    setMessages((prev) => {
      const newMessages = prev.map((m) => {
        if (m.id === id) {
          return { ...m, isRead: !m.isRead };
        }
        return m;
      });
      try {
        const changed = newMessages.find((m) => m.id === id);
        if (typeof window !== 'undefined' && changed) {
          window.dispatchEvent(new CustomEvent('message:read-status-changed', { detail: { id: changed.id, isRead: changed.isRead } }));
        }
      } catch (e) {
        // ignore dispatch errors
      }
      return newMessages;
    });
  };

  // 1️⃣ First filter normally
  const filteredMessagesRaw = messages.filter((msg) => {
    const matchesSearch =
      !searchTerm ||
      msg.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.body.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filter === 'all' || (filter === 'read' && msg.isRead) || (filter === 'unread' && !msg.isRead);

    return matchesSearch && matchesFilter;
  });

  // 2️⃣ Then group by recipient
  const filteredMessages = groupMessagesByRecipient(filteredMessagesRaw as Message[]);

  const totalResults = filteredMessages.length;
  // (removed inboxCount) header should show unread count instead
  const totalPages = Math.ceil(totalResults / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalResults);
  const paginatedMessages = filteredMessages.slice(startIndex, endIndex) as (Message & { unreadCount: number; conversation: Message[] })[];
  const allCount = messages.length;
  const readCount = messages.filter((m) => m.isRead).length;
  const unreadCount = messages.filter((m) => !m.isRead).length;

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchTerm]);

  // Persist messages to sessionStorage so state is kept while the tab is open.
  useEffect(() => {
    try {
      sessionStorage.setItem('inbox_messages_v1', JSON.stringify(messages));
    } catch (e) {
      // ignore
    }
  }, [messages]);

  // No automatic marking on mount — messages remain in their saved read/unread mix.
  // However, use a session-only flag so that if the user returns to the
  // inbox within the same browser tab (navigates away then back), the inbox
  // will be auto-marked as read on the second visit. Because messages are
  // in-memory only, closing the tab/browser resets unread counts to the
  // original `FAKE_MESSAGES` values.
  useEffect(() => {
    try {
      const seen = sessionStorage.getItem('inbox_seen_session');
      if (seen) {
        // On revisit within the same tab, always suppress the header count
        // so the inbox appears 'seen' (shows 0) until the user interacts.
        setSuppressHeaderCount(true);
      } else {
        sessionStorage.setItem('inbox_seen_session', 'true');
      }
    } catch (e) {
      // ignore sessionStorage errors
    }
  }, []);

  // Expose an explicit action to mark all messages read (user-initiated)
  const markAllAsRead = () => {
    setMessages((prev) => {
      const newMessages = prev.map((m) => ({ ...m, isRead: true }));
      try {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('message:all-read-status-changed', { detail: { allRead: true, ids: newMessages.map((m) => m.id) } }));
        }
      } catch (e) {
        // ignore
      }

      // reveal counts when user triggers this action
      setSuppressHeaderCount(false);
      try {
        sessionStorage.setItem('inbox_modified', 'true');
      } catch {}

      return newMessages;
    });
  };

  // Expose an action to mark all messages unread (user-initiated)
  const markAllAsUnread = () => {
    setMessages((prev) => {
      const newMessages = prev.map((m) => ({ ...m, isRead: false }));
      try {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('message:all-read-status-changed', { detail: { allRead: false, ids: newMessages.map((m) => m.id) } }));
        }
      } catch (e) {
        // ignore
      }

      // reveal counts when user triggers this action
      setSuppressHeaderCount(false);
      try {
        sessionStorage.setItem('inbox_modified', 'true');
      } catch {}

      return newMessages;
    });
  };

  return (
    <AuthenticatedLayout>
      <Head title="Inbox" />

      <div className="min-h-screen bg-[#F9FAFB] p-2 md:p-4 font-sans">
        <div className="max-w-full mx-auto bg-white rounded-xl shadow-sm min-h-[90vh] p-4 md:p-6 flex flex-col">
          <div className="flex-1">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                Inbox <span className="text-gray-400 font-medium">({suppressHeaderCount ? 0 : unreadCount})</span>
              </h1>

              {/* ACTIVE + SEARCH BAR */}
              <div className="flex items-center gap-3 w-full md:max-w-xl">
                {/* Active Status */}
                <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-full shadow-sm whitespace-nowrap">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  <span className="text-xs font-semibold text-gray-700 hidden sm:inline">Active</span>
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

            {/* ACTION BAR - Mobile Full Width Filters */}
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
              {/* Desktop Compose Button - Hidden on mobile */}
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 bg-[#5156E5] hover:bg-[#4348C8] text-white px-4 py-2 rounded-lg font-bold text-sm transition-all"
                >
                  <PenSquare size={18} />
                  Compose
                </button>

                <button
                  onClick={unreadCount === 0 ? markAllAsUnread : markAllAsRead}
                  className="flex items-center gap-2 border border-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-50"
                >
                  {unreadCount === 0 ? 'Mark all unread' : 'Mark all read'}
                </button>
                
              </div>

              {/* Filter Buttons - Full width on mobile */}
              <div className="flex bg-[#F3F4F6] p-1 rounded-lg w-full md:w-auto">
                {( ['all','read','unread'] as const ).map((f) => {
                  const unreadCnt = messages.filter((m) => !m.isRead).length;
                  return (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`flex-1 px-3 py-2 md:py-1.5 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                        filter === f ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <span>{f.charAt(0).toUpperCase() + f.slice(1)}</span>
                      {f === 'unread' && unreadCnt > 0 && (
                        <span className={`text-[10px] min-w-[18px] text-center px-1.5 py-0.5 rounded-full font-bold ${filter === f ? 'bg-[#5156E5] text-white' : 'bg-gray-300 text-gray-700'}`}>
                          {unreadCnt}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* MESSAGE LIST CONTAINER */}
            <div className="relative border-t border-gray-100">
              {/* Message List */}
              <div className="max-h-[60vh] overflow-y-auto pb-16">
                {paginatedMessages.map((msg) => {
                  const isSelected = selectedIds.includes(msg.id);
                  return (
                    <div
                      key={msg.id}
                      onClick={() => handleViewMessage(msg.id)}
                      className={`flex items-start gap-3 p-3 md:p-4 rounded-xl transition-all duration-200 cursor-pointer border-b border-gray-100 relative group ${
                        isSelected ? 'bg-[#DDE0FF] border-indigo-200 shadow-sm' : !msg.isRead ? 'bg-gray-100 border-gray-200 rounded-lg' : 'bg-white hover:bg-gray-50'
                      } hover:shadow-lg hover:z-10`}
                    >
                      <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(msg.id)} className="w-4 h-4 md:w-5 md:h-5 rounded border-gray-300 text-[#5156E5] focus:ring-[#5156E5]" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="grid grid-cols-12 items-start gap-1 md:gap-2">
                          <div className={`col-span-12 md:col-span-3 truncate text-xs md:text-sm ${!msg.isRead ? 'font-bold text-black' : 'font-medium text-gray-700'}`}>
                            <HighlightText text={msg.recipient} highlight={searchTerm} />
                          </div>

                          <div className="col-span-10 md:col-span-7 flex flex-col">
                            <div className="flex items-baseline gap-2 overflow-hidden">
                              {msg.unreadCount >= 2 ? (
                                <span className="ml-2 text-[10px] md:text-xs font-bold text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full whitespace-nowrap">{msg.unreadCount} new messages</span>
                              ) : (
                                <>
                                  <span className={`text-xs md:text-sm whitespace-nowrap ${!msg.isRead ? 'font-bold text-black' : 'font-semibold text-gray-800'}`}>
                                    <HighlightText text={msg.subject} highlight={searchTerm} />
                                  </span>

                                  {msg.unreadCount === 0 && (
                                    <span className="text-gray-500 text-[10px] md:text-xs truncate">- <HighlightText text={msg.body.substring(0, 60)} highlight={searchTerm} /></span>
                                  )}
                                </>
                              )}
                            </div>

                            {msg.unreadCount < 2 && msg.hasAttachments && msg.attachments && msg.attachments.length > 0 && (
                              <div onClick={(e) => e.stopPropagation()} className="flex items-center gap-1 mt-1 overflow-x-auto pb-1 scrollbar-hide">
                                {msg.attachments.slice(0, 3).map((att, idx) => {
                                  const style = getFileBadgeStyle(att.type);
                                  return (
                                    <div key={idx} className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[8px] md:text-[10px] font-medium ${style.bg} ${style.text} ${style.border} border whitespace-nowrap`} title={att.name}>
                                      {style.icon}
                                      <span className="max-w-[50px] md:max-w-[80px] truncate">{att.name}</span>
                                    </div>
                                  );
                                })}

                                {msg.attachments.length > 3 && (
                                  <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[8px] md:text-[10px] font-medium bg-gray-100 text-gray-600 border border-gray-200 whitespace-nowrap">
                                    <Paperclip size={8} className="md:w-[10px] md:h-[10px]" />
                                    <span>+{msg.attachments.length - 3}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="col-span-2 text-right flex flex-col items-end min-w-[60px] md:min-w-[80px]">
                            <div className={`text-[9px] md:text-[10px] ${!msg.isRead ? 'font-bold text-gray-900' : 'text-gray-700'} whitespace-nowrap`}>{formatMessageDate(msg.date)}</div>

                            <div className="flex gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={(e) => { e.stopPropagation(); toggleMessageReadStatus(msg.id); }} className="p-1 hover:bg-gray-200 rounded text-gray-600" title={msg.isRead ? "Mark as unread" : "Mark as read"}>{msg.isRead ? <EyeOff size={12} className="md:w-[14px] md:h-[14px]" /> : <Eye size={12} className="md:w-[14px] md:h-[14px]" />}</button>
                              <button onClick={(e) => e.stopPropagation()} className="p-1 hover:bg-gray-200 rounded text-blue-600"><Archive size={12} className="md:w-[14px] md:h-[14px]" /></button>
                              <button onClick={(e) => e.stopPropagation()} className="p-1 hover:bg-gray-200 rounded text-red-500"><Trash2 size={12} className="md:w-[14px] md:h-[14px]" /></button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Mobile Floating Compose Button - Icon only */}
              <div className="absolute bottom-8 right-4 z-20 md:hidden">
                <button onClick={() => setIsModalOpen(true)} className="bg-[#5156E5] hover:bg-[#4348C8] text-white shadow-xl hover:shadow-2xl transition-all rounded-full w-14 h-14 flex items-center justify-center">
                  <PenSquare size={24} />
                </button>
              </div>
            </div>

            {/* FOOTER */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
              <div className="text-xs text-gray-600">{totalResults > 0 ? `${startIndex + 1}-${endIndex} of ${totalResults} results` : '0 results'}</div>

              <div className="flex gap-2">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)} className="p-2 rounded-lg bg-[#F3F4F6] hover:bg-gray-200 disabled:opacity-40 transition-colors"><ChevronLeft size={20} className="text-gray-700" /></button>
                <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage((prev) => prev + 1)} className="p-2 rounded-lg bg-[#F3F4F6] hover:bg-gray-200 disabled:opacity-40 transition-colors"><ChevronRight size={20} className="text-gray-700" /></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CreateMessageModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </AuthenticatedLayout>
  );
}
