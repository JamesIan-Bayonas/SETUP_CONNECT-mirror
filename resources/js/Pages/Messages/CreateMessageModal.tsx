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
    // Logic to be implemented by team
    if (!isOpen) return null;

    return (
        <div>{/* Placeholder for team implementation */}</div>
    );
};

export default CreateMessageModal;