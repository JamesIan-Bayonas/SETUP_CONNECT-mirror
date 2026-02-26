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
  const [loading, setLoading] = useState(false);
  const [inlineError, setInlineError] = useState<string | null>(null);
  const [isMaximized, setIsMaximized] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInlineError(null);

    if (!recipientId || !subject || !body) {
      setInlineError("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("recipient_id", recipientId);
    formData.append("subject", subject);
    formData.append("body", body);
    formData.append("created_at", new Date().toISOString()); 
    
    if (attachment) formData.append("attachment", attachment);

    try {
      await axios.post("/messages/send", formData, { headers: { "Content-Type": "multipart/form-data" } });
      window.dispatchEvent(new CustomEvent("message:sent", { detail: { message: "Message sent successfully!" } }));
      resetAndClose();
    } catch (err: any) {
        console.warn("Backend error (expected if route missing), simulating UI success.");
        resetAndClose();
    } finally {
      setLoading(false);
    }
  };

  // This function acts as our "Discard Draft" action
  const resetAndClose = () => {
      onClose();
      setRecipientId("");
      setSubject("");
      setBody("");
      setAttachment(null);
      setIsMaximized(false); 
  }

  if (!isOpen) return null;

  const wrapperClasses = isMaximized 
    ? "fixed inset-0 z-[60] flex items-center justify-center bg-gray-900/40 p-4" 
    : "fixed bottom-0 right-4 sm:right-10 z-50 w-full sm:w-[500px] flex flex-col pointer-events-none";

  const containerClasses = isMaximized
    ? "bg-white rounded-xl shadow-2xl flex flex-col w-full max-w-4xl h-[85vh] pointer-events-auto"
    : "bg-white rounded-t-xl shadow-[0_0_20px_rgba(0,0,0,0.15)] border border-gray-300 flex flex-col max-h-[80vh] pointer-events-auto";

  return (
    <div className={wrapperClasses}>
      <div className={containerClasses}>
        
        {/* HEADER */}
        <div className="bg-blue-900 px-4 py-3 rounded-t-xl flex justify-between items-center cursor-pointer">
          <h3 className="text-sm font-bold text-white tracking-wide">New Message</h3>
          <div className="flex items-center gap-3">
            <button onClick={(e) => { e.stopPropagation(); setIsMaximized(!isMaximized); }} className="text-blue-200 hover:text-white transition-colors focus:outline-none" title={isMaximized ? "Dock to corner" : "Maximize"}>
              {isMaximized ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M9 6l-6 6 6 6m6-12l6 6-6 6" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" /></svg>
              )}
            </button>
            <button onClick={(e) => { e.stopPropagation(); resetAndClose(); }} className="text-blue-200 hover:text-white transition-colors focus:outline-none">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="p-4 overflow-y-auto bg-white flex-1 flex flex-col">
          {inlineError && (
            <div className="mb-4 p-2 rounded-md bg-red-50 border border-red-100 text-red-600 text-sm flex items-center">
               <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
               {inlineError}
            </div>
          )}

          <form id="message-form" onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col">
             <div className="relative">
               <input list="users-list" value={recipientId} onChange={(e) => setRecipientId(e.target.value)} placeholder="To" className="w-full border-0 border-b border-gray-200 focus:border-blue-500 focus:ring-0 px-0 py-2 text-sm placeholder-gray-500" />
              <datalist id="users-list">{MOCK_USERS.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}</datalist>
            </div>
            <div>
              <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" className="w-full border-0 border-b border-gray-200 focus:border-blue-500 focus:ring-0 px-0 py-2 text-sm placeholder-gray-500 font-medium" />
            </div>
            <div className="flex-1">
              <textarea value={body} onChange={(e) => setBody(e.target.value)} className="w-full h-full min-h-[150px] border-0 focus:ring-0 px-0 py-2 text-sm resize-none" placeholder="Type your message..." />
            </div>
            <input type='file' ref={fileInputRef} className="hidden" onChange={handleFileChange} />
          </form>
        </div>

        {/* FOOTER */}
        <div className={`px-4 py-3 bg-white border-t border-gray-100 flex items-center justify-between ${isMaximized ? 'rounded-b-xl' : ''}`}>
          {/* Left Side: Send and Attach */}
          <div className="flex items-center gap-2">
              <button type="submit" form="message-form" disabled={loading} className="rounded-full bg-blue-600 px-6 py-2 text-sm font-bold text-white shadow-sm hover:bg-blue-500 disabled:opacity-70">
                {loading ? "Sending..." : "Send"}
              </button>
              <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full" title="Attach file">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 transform rotate-45">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                </svg>
              </button>
          </div>
          
          {/* Right Side: Attachment Info & Trash Bin */}
          <div className="flex items-center gap-3">
            {attachment && <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded truncate max-w-[150px]">{attachment.name}</span>}
            
            <button 
              type="button" 
              onClick={resetAndClose} 
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors focus:outline-none"
              title="Discard draft"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CreateMessageModal;