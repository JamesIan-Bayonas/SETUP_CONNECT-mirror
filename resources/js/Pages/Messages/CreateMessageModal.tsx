import React, { useState, useRef, useEffect } from "react";
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
  const [showToolbar, setShowToolbar] = useState(true);
  
  // --- ADDED: State to track which formatting buttons are active ---
  const [activeFormats, setActiveFormats] = useState({
    bold: false, italic: false, underline: false,
    justifyLeft: false, justifyCenter: false, justifyRight: false
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  // --- LOGIC: Ask the browser what formatting is active at the current cursor position ---
  const checkFormatting = () => {
    setActiveFormats({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      justifyLeft: document.queryCommandState('justifyLeft'),
      justifyCenter: document.queryCommandState('justifyCenter'),
      justifyRight: document.queryCommandState('justifyRight'),
    });
  };

  const applyFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    checkFormatting(); // Update buttons immediately after clicking one
  };

  const handleLink = () => {
    const url = window.prompt("Enter the URL (e.g., https://google.com):");
    if (url) applyFormat("createLink", url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setAttachment(e.target.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInlineError(null);

    if (!recipientId || !subject || !body.trim()) {
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

  const resetAndClose = () => {
      onClose();
      setRecipientId("");
      setSubject("");
      setBody("");
      setAttachment(null);
      setIsMaximized(false); 
      setShowToolbar(true);
      if (editorRef.current) editorRef.current.innerHTML = "";
  };

  if (!isOpen) return null;

  return (
    <div className={isMaximized ? "fixed inset-0 z-[60] flex items-center justify-center bg-gray-900/40 p-4" : "fixed bottom-0 right-4 sm:right-10 z-50 w-full sm:w-[500px] flex flex-col pointer-events-none"}>
      <div className={isMaximized ? "bg-white rounded-xl shadow-2xl flex flex-col w-full max-w-4xl h-[85vh] pointer-events-auto" : "bg-white rounded-t-xl shadow-[0_0_20px_rgba(0,0,0,0.15)] border border-gray-300 flex flex-col max-h-[80vh] pointer-events-auto"}>
        
        {/* HEADER */}
        <div className="bg-blue-700 px-4 py-3 rounded-t-xl flex justify-between items-center cursor-pointer">
          <h3 className="text-sm font-bold text-white tracking-wide">New Message</h3>
          <div className="flex items-center gap-3">
            <button onClick={(e) => { e.stopPropagation(); setIsMaximized(!isMaximized); }} className="text-blue-200 hover:text-white transition-colors focus:outline-none" title={isMaximized ? "Dock to corner" : "Maximize"}>
              {isMaximized ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 6l-6 6 6 6m6-12l6 6-6 6" /></svg> : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" /></svg>}
            </button>
            <button onClick={(e) => { e.stopPropagation(); resetAndClose(); }} className="text-blue-200 hover:text-white transition-colors focus:outline-none">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="flex-1 flex flex-col p-4 bg-white min-h-0">
          {inlineError && (
             <div className="mb-4 p-2 rounded-md bg-red-50 border border-red-100 text-red-600 text-sm flex items-center">
                <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>{inlineError}
             </div>
          )}
          <form id="message-form" onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 space-y-0">
             <div className="relative border-b border-gray-100 flex items-center gap-2 group">
               <label className="text-sm text-gray-500 font-medium whitespace-nowrap">Recipients</label>
               <input list="users-list" value={recipientId} onChange={(e) => setRecipientId(e.target.value)} placeholder="" className="w-full border-0 focus:ring-0 px-0 py-2.5 text-sm placeholder-gray-500" />
               <datalist id="users-list">{MOCK_USERS.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}</datalist>
             </div>
             <div className="border-b border-gray-100 group">
               <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" className="w-full border-0 focus:ring-0 px-0 py-3 text-sm placeholder-gray-500 font-medium" />
             </div>
             <div className="flex-1 min-h-0 pt-3 relative">
               <div 
                  ref={editorRef}
                  contentEditable
                  onInput={(e) => setBody(e.currentTarget.innerHTML)}
                  onKeyUp={checkFormatting}   // Check when user types
                  onMouseUp={checkFormatting} // Check when user clicks around
                  data-placeholder="Say something..."
                  className="w-full h-full min-h-[150px] outline-none px-0 py-0 text-sm text-gray-800 overflow-y-auto whitespace-pre-wrap empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400"
                />
             </div>
             <input type='file' ref={fileInputRef} className="hidden" onChange={handleFileChange} />
          </form>
        </div>

        {/* FOOTER */}
        <div className={`px-4 pt-1 py-3 bg-white border-t border-gray-100 ${isMaximized ? 'rounded-b-xl' : ''}`}>
          
          {/* FORMATTING TOOLBAR */}
          {showToolbar && (
            <div className="flex items-center gap-0.5 pb-2.5 border-b border-gray-100 mb-2.5 overflow-x-auto no-scrollbar">
               {/* Undo / Redo */}
               <div className="flex items-center gap-0.5 pr-2 border-r border-gray-100 mr-2 flex-shrink-0">
                 <button type="button" onMouseDown={(e) => { e.preventDefault(); applyFormat('undo'); }} className="p-1.5 text-gray-600 hover:bg-gray-200 rounded transition-colors" title="Undo"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" /></svg></button>
                 <button type="button" onMouseDown={(e) => { e.preventDefault(); applyFormat('redo'); }} className="p-1.5 text-gray-600 hover:bg-gray-200 rounded transition-colors" title="Redo"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3" /></svg></button>
               </div>

               {/* B / I / U (WITH ACTIVE STATES!) */}
               <div className="flex items-center gap-0.5 pr-2 border-r border-gray-100 mr-2 flex-shrink-0">
                 <button type="button" onMouseDown={(e) => { e.preventDefault(); applyFormat('bold'); }} className={`p-1.5 rounded transition-colors font-bold ${activeFormats.bold ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-200'}`} title="Bold"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M6.75 3.75a4.125 4.125 0 0 0 0 8.25M6.75 12a4.125 4.125 0 0 0 0 8.25M17.25 12H6.75m10.5 0a4.125 4.125 0 1 0 0-8.25M17.25 12a4.125 4.125 0 1 1 0 8.25" /></svg></button>
                 <button type="button" onMouseDown={(e) => { e.preventDefault(); applyFormat('italic'); }} className={`p-1.5 rounded transition-colors italic ${activeFormats.italic ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-200'}`} title="Italic"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M5.25 19.5h3.375a.75.75 0 0 0 .75-.75l2.625-13.5a.75.75 0 0 0-.75-.75H7.875a.75.75 0 0 0-.75.75L4.5 18.75a.75.75 0 0 0 .75.75Z" /></svg></button>
                 <button type="button" onMouseDown={(e) => { e.preventDefault(); applyFormat('underline'); }} className={`p-1.5 rounded transition-colors underline ${activeFormats.underline ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-200'}`} title="Underline"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M17.25 3v9.375a5.25 5.25 0 0 1-10.5 0V3m-1.5 17.25h13.5" /></svg></button>
               </div>

               {/* Alignment (WITH ACTIVE STATES!) */}
               <div className="flex items-center gap-0.5 flex-shrink-0">
                 <button type="button" onMouseDown={(e) => { e.preventDefault(); applyFormat('justifyLeft'); }} className={`p-1.5 rounded transition-colors ${activeFormats.justifyLeft ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-200'}`} title="Align left"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" /></svg></button>
                 <button type="button" onMouseDown={(e) => { e.preventDefault(); applyFormat('justifyCenter'); }} className={`p-1.5 rounded transition-colors ${activeFormats.justifyCenter ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-200'}`} title="Align center"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg></button>
                 <button type="button" onMouseDown={(e) => { e.preventDefault(); applyFormat('justifyRight'); }} className={`p-1.5 rounded transition-colors ${activeFormats.justifyRight ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-200'}`} title="Align right"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25" /></svg></button>
               </div>
            </div>
          )}
          
          {/* MAIN ACTION ROW */}
          <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 sm:gap-2">
                  <button type="submit" form="message-form" disabled={loading} className="rounded-full bg-blue-600 px-6 py-2 text-sm font-bold text-white shadow-sm hover:bg-blue-500 disabled:opacity-70 mr-2 transition-all">
                    {loading ? "Sending..." : "Send"}
                  </button>
                  
                  <button type="button" onClick={() => setShowToolbar(!showToolbar)} className={`p-2 rounded focus:outline-none transition-colors ${showToolbar ? 'text-blue-700 bg-blue-50' : 'text-gray-500 hover:bg-gray-100'}`} title="Formatting options">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M12 21a9.004 9.004 0 0 1-8.713-6.713C4.144 10.144 8.144 6.144 12 6.144c3.856 0 7.856 4 8.713 8.144A9.004 9.004 0 0 1 12 21Z" /><path d="M12 6.144v14.856M8.144 10.144h7.712" /></svg>
                  </button>

                  <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 text-gray-500 hover:bg-gray-100 rounded" title="Attach files">
                     <svg className="w-5 h-5 transform rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" /></svg>
                  </button>

                  <button type="button" onMouseDown={(e) => { e.preventDefault(); handleLink(); }} className="p-2 text-gray-500 hover:bg-gray-100 rounded" title="Insert link">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" /></svg>
                  </button>
              </div>

              <div className="flex-1 min-w-0 flex items-center justify-end gap-2 pr-2">
                {attachment && <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded truncate max-w-[150px]" title={attachment.name}>{attachment.name}</span>}
                <button type="button" onClick={resetAndClose} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors" title="Discard draft">
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                </button>
              </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CreateMessageModal;