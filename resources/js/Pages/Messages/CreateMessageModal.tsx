import React, { useState, useRef } from "react";
import axios from "axios";

const MOCK_USERS = [
  { id: 1, name: "Juan Dela Cruz" },
  { id: 2, name: "Maria Clara" },
  { id: 3, name: "Jose Rizal" },
  { id: 4, name: "Admin User" },
];

interface CreateMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateMessageModal: React.FC<CreateMessageModalProps> = ({ isOpen, onClose }) => {
  const [recipientId, setRecipientId] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  //ALBERT ADDED LOADING 
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0]);
    }
  };

  // ADDED SUBMIT LOGIC 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("recipient_id", recipientId);
    formData.append("subject", subject);
    formData.append("body", body);
    formData.append("created_at", new Date().toISOString()); 
    
    if (attachment) {
      formData.append("attachment", attachment);
    }

    try {
      await axios.post("/messages/send", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      window.dispatchEvent(
        new CustomEvent("message:sent", { detail: { message: "Message sent successfully!" } })
      );
      // We will add reset logic in the next phase
    } catch (err: any) {
        console.warn("Backend error, simulating UI success.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 right-4 sm:right-10 z-50 w-full sm:w-[500px] flex flex-col pointer-events-none">
      <div className="pointer-events-auto bg-white rounded-t-xl shadow-[0_0_20px_rgba(0,0,0,0.15)] border border-gray-300 flex flex-col max-h-[80vh]">
        <div className="bg-blue-900 px-4 py-3 rounded-t-xl flex justify-between items-center cursor-pointer">
          <h3 className="text-sm font-bold text-white tracking-wide">New Message</h3>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="text-blue-200 hover:text-white transition-colors">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
          </div>
        </div>

        <div className="p-4 overflow-y-auto bg-white flex-1">
          {/* CONNECTED THE FORM TO ONSUBMIT */}
          <form id="message-form" onSubmit={handleSubmit} className="space-y-4">
             <div className="relative">
               <input
                list="users-list"
                value={recipientId}
                onChange={(e) => setRecipientId(e.target.value)}
                placeholder="To"
                className="w-full border-0 border-b border-gray-200 focus:border-blue-500 focus:ring-0 px-0 py-2 text-sm placeholder-gray-500"
              />
              <datalist id="users-list">
                {MOCK_USERS.map((user) => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </datalist>
            </div>
            <div>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject"
                className="w-full border-0 border-b border-gray-200 focus:border-blue-500 focus:ring-0 px-0 py-2 text-sm placeholder-gray-500 font-medium"
              />
            </div>
            <div>
              <textarea
                rows={8}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full border-0 focus:ring-0 px-0 py-2 text-sm resize-none"
                placeholder="Type your message..."
              />
            </div>
            <input type='file' ref={fileInputRef} className="hidden" onChange={handleFileChange} />
          </form>
        </div>

        <div className="px-4 py-3 bg-white border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
              {/* CONNECTED THE BUTTON TO LOADING STATE */}
              <button
                type="submit"
                form="message-form"
                disabled={loading}
                className="rounded-full bg-blue-600 px-6 py-2 text-sm font-bold text-white shadow-sm hover:bg-blue-500 disabled:opacity-70"
              >
                {loading ? "Sending..." : "Send"}
              </button>
              <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 transform rotate-45">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                </svg>
              </button>
          </div>
          {attachment && <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">{attachment.name}</span>}
        </div>
      </div>
    </div>
  );
};

export default CreateMessageModal;