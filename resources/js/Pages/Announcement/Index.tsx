import React, { useState, useMemo } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

// 1. Updated Interface: Added 'Draft' status and schedule dates
interface Announcement {
    id: number;
    title: string;
    content: string;
    date: string;
    publishDate?: string; // For scheduling
    department: string; // Renamed from author for clarity
    status: 'Active' | 'Archived' | 'Draft';
    icon: string;
}

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
    { id: 1, title: 'Call for Proposals: DOST GIA 2026', content: 'Researchers and institutions are invited to submit proposals under the Grants-in-Aid Program. Deadline: March 31, 2026.', date: '2026-02-25', department: 'DOST Grants Management', status: 'Active', icon: '📋' },
    { id: 2, title: 'SEI Scholarship Application Now Open', content: 'Undergraduate and graduate scholarship applications for AY 2026-2027 are now being accepted.', date: '2026-02-23', department: 'DOST-SEI', status: 'Active', icon: '🎓' },
    { id: 3, title: 'Draft: Upcoming Science Fair', content: 'Details for the upcoming provincial science fair...', date: '2026-02-22', department: 'Regional Operations', status: 'Draft', icon: '🚀' },
    { id: 4, title: 'Technology Transfer Training Workshop', content: 'TAPI will conduct a 2-day workshop on Technology Commercialization and Licensing.', date: '2026-02-18', department: 'DOST-TAPI', status: 'Archived', icon: '🔬' },
    { id: 5, title: 'PSTO Monthly Assembly', content: 'Mandatory assembly for all PSTO staff to discuss Q1 targets.', date: '2026-02-15', department: 'PSTO', status: 'Active', icon: '📢' },
];

export default function AnnouncementIndex() {
    const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Archived' | 'Draft'>('All');
    
    // Modal & Selection States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewingAnnouncement, setViewingAnnouncement] = useState<Announcement | null>(null); // State for View Modal
    const [editingId, setEditingId] = useState<number | null>(null);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    
    // Pagination States
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    // Form State
    const initialFormState = {
        title: '',
        content: '',
        department: 'DOST Central Office',
        publishDate: '',
        icon: '📢'
    };
    const [formData, setFormData] = useState(initialFormState);

    // --- LOGIC: Filtering & Pagination ---
    const filteredAnnouncements = useMemo(() => {
        let filtered = announcements.filter(item => {
            const matchesSearch = 
                item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.department.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
            return matchesSearch && matchesStatus;
        }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        return filtered;
    }, [announcements, searchTerm, statusFilter]);

    // Calculate Pagination
    const totalPages = Math.ceil(filteredAnnouncements.length / itemsPerPage);
    const paginatedAnnouncements = filteredAnnouncements.slice(
        (currentPage - 1) * itemsPerPage, 
        currentPage * itemsPerPage
    );

    // --- LOGIC: Handlers ---
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(paginatedAnnouncements.map(item => item.id));
        } else {
            setSelectedIds([]);
        }
    };

    const toggleSelection = (id: number) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
    };

    const handleBulkArchive = () => {
        if (confirm(`Archive ${selectedIds.length} announcements?`)) {
            setAnnouncements(prev => prev.map(item => 
                selectedIds.includes(item.id) ? { ...item, status: 'Archived' } : item
            ));
            setSelectedIds([]);
        }
    };

    const openCreateModal = () => {
        setEditingId(null);
        setFormData(initialFormState);
        setIsModalOpen(true);
    };

    const openEditModal = (item: Announcement) => {
        setEditingId(item.id);
        setFormData({
            title: item.title,
            content: item.content,
            department: item.department,
            publishDate: item.publishDate || '',
            icon: item.icon
        });
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this announcement?')) {
            setAnnouncements(prev => prev.filter(item => item.id !== id));
            setSelectedIds(prev => prev.filter(itemId => itemId !== id));
        }
    };

    const handleFormSubmit = (e: React.FormEvent, status: 'Active' | 'Draft') => {
        e.preventDefault();
        if (!formData.title.trim() || !formData.content.trim()) {
            alert("Title and Content are required!");
            return;
        }

        const today = new Date().toISOString().split('T')[0];

        if (editingId) {
            // Update existing
            setAnnouncements(prev => prev.map(item => 
                item.id === editingId 
                ? { ...item, ...formData, status: status } 
                : item
            ));
        } else {
            // Create new
            const newAnnouncement: Announcement = {
                id: Date.now(),
                ...formData,
                date: formData.publishDate || today,
                status: status,
            };
            setAnnouncements(prev => [newAnnouncement, ...prev]);
        }
        
        setIsModalOpen(false);
    };

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Announcements</h2>}>
            <Head title="Announcements" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* Header + New Button */}
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-800">Latest Updates</h3>
                        <button 
                            onClick={openCreateModal}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg text-sm flex items-center gap-2 transition shadow-sm"
                        >
                            + New Announcement
                        </button>
                    </div>

                    {/* Search, Filters & Bulk Actions */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                        <div className="flex flex-1 gap-4 w-full">
                            <input
                                type="text"
                                placeholder="Search announcements..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full sm:max-w-md bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                            <div className="flex gap-1 bg-white border border-gray-300 p-1 rounded-lg">
                                {(['All', 'Active', 'Draft', 'Archived'] as const).map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => { setStatusFilter(f); setCurrentPage(1); }}
                                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition ${
                                            statusFilter === f ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Bulk Action Trigger */}
                        {selectedIds.length > 0 && (
                            <button 
                                onClick={handleBulkArchive}
                                className="bg-gray-800 text-white text-sm font-medium py-2 px-4 rounded-lg hover:bg-gray-700 transition"
                            >
                                Archive Selected ({selectedIds.length})
                            </button>
                        )}
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <table className="w-full whitespace-nowrap">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50/50">
                                    <th className="text-left py-4 px-6 w-12">
                                        <input 
                                            type="checkbox" 
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            checked={selectedIds.length === paginatedAnnouncements.length && paginatedAnnouncements.length > 0}
                                            onChange={handleSelectAll}
                                        />
                                    </th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-600 text-xs uppercase tracking-wider w-32">Date</th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-600 text-xs uppercase tracking-wider">Title</th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-600 text-xs uppercase tracking-wider">Department</th>
                                    <th className="text-center py-4 px-6 font-semibold text-gray-600 text-xs uppercase tracking-wider w-28">View</th>
                                    <th className="text-right py-4 px-6 font-semibold text-gray-600 text-xs uppercase tracking-wider w-40">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {paginatedAnnouncements.length > 0 ? (
                                    paginatedAnnouncements.map((item) => (
                                        <tr key={item.id} className={`transition-colors ${selectedIds.includes(item.id) ? 'bg-blue-50/30' : 'hover:bg-gray-50'}`}>
                                            <td className="py-4 px-6">
                                                <input 
                                                    type="checkbox" 
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    checked={selectedIds.includes(item.id)}
                                                    onChange={() => toggleSelection(item.id)}
                                                />
                                            </td>
                                            <td className="py-4 px-6 text-sm text-gray-600">{item.date}</td>
                                            <td className="py-4 px-6">
                                                <div className="font-medium text-gray-900 flex items-center gap-2">
                                                    <span>{item.icon}</span> {item.title}
                                                </div>
                                                <div className="text-sm text-gray-500 truncate max-w-md mt-0.5">{item.content}</div>
                                            </td>
                                            <td className="py-4 px-6 text-sm text-gray-600">{item.department}</td>
                                            
                                            {/* Replaced Status column with View Button */}
                                            <td className="py-4 px-6 text-center">
                                                <button 
                                                    onClick={() => setViewingAnnouncement(item)}
                                                    className="text-blue-500 hover:text-blue-700 transition"
                                                    title="View Announcement"
                                                >
                                                    <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </button>
                                            </td>

                                            <td className="py-4 px-6 text-right space-x-4">
                                                <button onClick={() => openEditModal(item)} className="text-blue-600 hover:text-blue-900 font-medium text-sm">Edit</button>
                                                <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900 font-medium text-sm">Delete</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-gray-400">
                                            <div className="flex flex-col items-center justify-center">
                                                <span className="text-4xl mb-3">📭</span>
                                                <p>No announcements found.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        
                        {/* Pagination Footer */}
                        {totalPages > 1 && (
                            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                                <span className="text-sm text-gray-700">
                                    Showing <span className="font-semibold">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-semibold">{Math.min(currentPage * itemsPerPage, filteredAnnouncements.length)}</span> of <span className="font-semibold">{filteredAnnouncements.length}</span> entries
                                </span>
                                <div className="flex gap-2">
                                    <button 
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(prev => prev - 1)}
                                        className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Previous
                                    </button>
                                    <button 
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(prev => prev + 1)}
                                        className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Read-Only View Modal */}
            {viewingAnnouncement && (
                <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 relative">
                        <button 
                            onClick={() => setViewingAnnouncement(null)} 
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                        
                        <div className="flex items-start gap-4 mb-4 mt-2">
                            <span className="text-4xl bg-gray-50 p-3 rounded-full">{viewingAnnouncement.icon}</span>
                            <div>
                                <h3 className="font-bold text-xl text-gray-900 leading-tight">{viewingAnnouncement.title}</h3>
                                <div className="flex gap-3 text-sm text-gray-500 mt-2">
                                    <span>🗓️ {viewingAnnouncement.date}</span>
                                    <span>🏢 {viewingAnnouncement.department}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="text-gray-700 whitespace-pre-wrap leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100 mt-6 min-h-[100px]">
                            {viewingAnnouncement.content}
                        </div>
                        
                        <div className="mt-8 flex justify-end">
                            <button 
                                onClick={() => setViewingAnnouncement(null)}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h3 className="font-bold text-lg text-gray-900">{editingId ? 'Edit Announcement' : 'New Announcement'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Announcement Title</label>
                                <input 
                                    type="text" name="title" 
                                    value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} 
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                                    placeholder="e.g. Call for Proposals 2026" 
                                    required 
                                />
                            </div>

                            {/* Simulated Rich Text Editor */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                                <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                                    {/* RTE Fake Toolbar */}
                                    <div className="bg-gray-50 border-b border-gray-300 px-3 py-2 flex gap-2 text-gray-600">
                                        <button className="p-1 hover:bg-gray-200 rounded font-bold">B</button>
                                        <button className="p-1 hover:bg-gray-200 rounded italic">I</button>
                                        <button className="p-1 hover:bg-gray-200 rounded underline">U</button>
                                        <div className="w-px h-6 bg-gray-300 mx-1"></div>
                                        <button className="p-1 hover:bg-gray-200 rounded">🔗</button>
                                        <button className="p-1 hover:bg-gray-200 rounded">📷</button>
                                    </div>
                                    <textarea 
                                        name="content" 
                                        value={formData.content} 
                                        onChange={(e) => setFormData({...formData, content: e.target.value})} 
                                        rows={6} 
                                        className="w-full border-0 px-4 py-3 focus:ring-0 resize-y" 
                                        placeholder="Write announcement details here..." 
                                        required 
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                    <select 
                                        name="department" 
                                        value={formData.department} 
                                        onChange={(e) => setFormData({...formData, department: e.target.value})} 
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="DOST Central Office">DOST Central Office</option>
                                        <option value="DOST-SEI">DOST-SEI</option>
                                        <option value="DOST-TAPI">DOST-TAPI</option>
                                        <option value="Grants Management">Grants Management</option>
                                        <option value="Regional Operations">Regional Operations</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Icon Theme</label>
                                    <select 
                                        name="icon" 
                                        value={formData.icon} 
                                        onChange={(e) => setFormData({...formData, icon: e.target.value})} 
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="📢">📢 General</option>
                                        <option value="📋">📋 Proposal</option>
                                        <option value="🎓">🎓 Education/Scholarship</option>
                                        <option value="🚀">🚀 Launch/Program</option>
                                        <option value="🔬">🔬 Research/Training</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Schedule Publish</label>
                                    <input 
                                        type="date" 
                                        value={formData.publishDate}
                                        onChange={(e) => setFormData({...formData, publishDate: e.target.value})}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 text-gray-600"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3 sticky bottom-0">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition">Cancel</button>
                            <button 
                                type="button" 
                                onClick={(e) => handleFormSubmit(e, 'Draft')}
                                className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition shadow-sm"
                            >
                                Save as Draft
                            </button>
                            <button 
                                type="button" 
                                onClick={(e) => handleFormSubmit(e, 'Active')}
                                className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-sm"
                            >
                                {editingId ? 'Update Announcement' : 'Publish Now'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}