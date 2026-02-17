import { useState } from 'react';

// 1. Define the data structure (Optional but good for TypeScript)
interface Message {
    id: number;
    sender: string;
    subject: string;
    preview: string;
    date: string;
    isRead: boolean;
}

// 2. Create the "Fake Database"
const FAKE_MESSAGES: Message[] = [
    {
        id: 1,
        sender: "Juan Dela Cruz",
        subject: "Permit Application Inquiry",
        preview: "Good morning, I would like to follow up on my...",
        date: "2024-02-17",
        isRead: false,
    },
    {
        id: 2,
        sender: "Maria Santos",
        subject: "Missing Requirements",
        preview: "I have attached the missing documents for...",
        date: "2024-02-16",
        isRead: true,
    },
    {
        id: 3,
        sender: "System Admin",
        subject: "System Maintenance Schedule",
        preview: "The system will undergo maintenance on...",
        date: "2024-02-15",
        isRead: true,
    },
];

export default function MessageList() { // No props needed!
    // 3. (Optional) Use state if you want to be able to "delete" or "read" messages
    const [messages, setMessages] = useState(FAKE_MESSAGES);
    const [searchTerm, setSearchTerm] = useState("");

    // Filter logic (Client-side search)
    const filteredMessages = messages.filter(msg => 
        msg.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
                
                {/* Search Bar */}
                <div className="mb-4">
                    <input 
                        type="text" 
                        placeholder="Search messages..." 
                        className="w-full border rounded px-3 py-2"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* The Table */}
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sender</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredMessages.map((msg) => (
                            <tr key={msg.id} className="hover:bg-gray-50 cursor-pointer">
                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                    {msg.sender}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-900 font-semibold">{msg.subject}</div>
                                    <div className="text-sm text-gray-500 truncate max-w-xs">{msg.preview}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {msg.date}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        msg.isRead ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                                    }`}>
                                        {msg.isRead ? 'Read' : 'New'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredMessages.length === 0 && (
                    <div className="text-center py-10 text-gray-500">
                        No messages found.
                    </div>
                )}
            </div>
        </div>
    );
}