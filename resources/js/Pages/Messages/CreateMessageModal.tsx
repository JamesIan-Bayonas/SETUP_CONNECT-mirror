import React, { useState, useRef } from "react";
import axios from "axios";

// Mock data for users
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-1/2">
        <h2 className="text-xl mb-4">New Message</h2>
        
        {/* --- BAGUNBON ADDED FORM HERE --- */}
        <form id="message-form" className="space-y-4">
          <input 
            value={recipientId} 
            onChange={(e) => setRecipientId(e.target.value)} 
            placeholder="To (User ID)" 
            className="w-full border p-2 rounded"
          />
          <input 
            value={subject} 
            onChange={(e) => setSubject(e.target.value)} 
            placeholder="Subject" 
            className="w-full border p-2 rounded"
          />
          <textarea 
            value={body} 
            onChange={(e) => setBody(e.target.value)} 
            placeholder="Type your message..." 
            className="w-full border p-2 rounded"
          />
          <button type="button" onClick={onClose}>Close</button>
        </form>

      </div>
    </div>
  );
};

export default CreateMessageModal;