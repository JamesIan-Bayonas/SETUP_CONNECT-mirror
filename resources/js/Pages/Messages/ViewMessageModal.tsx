import React, { useState } from "react";

export interface MessageData {
  id: number;
  sender_name: string;
  sender_email: string;
  recipient_id: number;
  subject: string;
  body: string;
  created_at: string;
  attachment_name?: string | null;
}

interface ViewMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: MessageData | null;
  isShifted?: boolean; 
}

const ViewMessageModal: React.FC<ViewMessageModalProps> = ({ isOpen, onClose, message, isShifted = false }) => {
  const [isMaximized, setIsMaximized] = useState(false);

  if (!isOpen || !message) return null;

  const dateObj = new Date(message.created_at);
  const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const formattedTime = dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  // Only apply the shift if we are currently docked. If maximized, stay centered.
  const rightPositionClass = (isShifted && !isMaximized) ? "sm:right-[530px]" : "sm:right-10";

  const wrapperClasses = isMaximized 
    ? "fixed inset-0 z-[60] flex items-center justify-center bg-gray-900/40 p-4" 
    : `fixed bottom-0 right-4 ${rightPositionClass} z-50 w-full sm:w-[500px] flex flex-col pointer-events-none`;

  const containerClasses = isMaximized
    ? "bg-white rounded-xl shadow-2xl flex flex-col w-full max-w-4xl h-[85vh] pointer-events-auto"
    : "bg-white rounded-t-xl shadow-[0_0_20px_rgba(0,0,0,0.15)] border border-gray-300 flex flex-col max-h-[80vh] pointer-events-auto";

  return (
    <div className={wrapperClasses}>
      <div className={containerClasses}>
        
        {/* HEADER */}
        <div className="bg-blue-700 px-4 py-3 rounded-t-xl flex justify-between items-center cursor-pointer">
          <h3 className="text-sm font-bold text-white tracking-wide truncate max-w-[80%]">
            {message.subject || "No Subject"}
          </h3>
          <div className="flex items-center gap-3">
            
            {/* Expand/Compress Button */}
            <button 
              onClick={() => setIsMaximized(!isMaximized)} 
              className="text-blue-200 hover:text-white transition-colors focus:outline-none"
              title={isMaximized ? "Dock to corner" : "Maximize"}
            >
              {isMaximized ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l-6 6 6 6m6-12l6 6-6 6" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                </svg>
              )}
            </button>

            {/* Close Button */}
            <button onClick={() => { setIsMaximized(false); onClose(); }} className="text-blue-200 hover:text-white transition-colors focus:outline-none">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="p-5 overflow-y-auto bg-white flex-1 text-sm text-gray-800">
           <div className="flex justify-between items-start mb-5 border-b border-gray-100 pb-4">
              <div>
                <p className="font-bold text-base">{message.sender_name}</p>
                <p className="text-xs text-gray-500 mt-0.5">&lt;{message.sender_email}&gt;</p>
              </div>
              <div className="text-xs text-gray-500 text-right">
                 <p className="font-medium">{formattedDate}</p>
                 <p>{formattedTime}</p>
              </div>
           </div>
           <div className="whitespace-pre-wrap leading-relaxed text-gray-700">
             {message.body}
           </div>
        </div>

        {/* FOOTER */}
        <div className={`px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between ${isMaximized ? 'rounded-b-xl' : 'rounded-b-lg'}`}>
           <div>
             {message.attachment_name ? (
                <div className="flex items-center gap-2 text-sm text-blue-700 bg-blue-100 px-3 py-1.5 rounded-full border border-blue-200 cursor-pointer hover:bg-blue-200 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 transform rotate-45">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                  </svg>
                  <span className="truncate max-w-[200px] font-medium">{message.attachment_name}</span>
                </div>
             ) : (
                <span className="text-xs text-gray-400 italic">No attachments</span>
             )}
           </div>
           <button onClick={() => { setIsMaximized(false); onClose(); }} className="px-4 py-1.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-100 hover:text-gray-900 transition shadow-sm">
             Close
           </button>
        </div>

      </div>
    </div>
  );
};

export default ViewMessageModal;