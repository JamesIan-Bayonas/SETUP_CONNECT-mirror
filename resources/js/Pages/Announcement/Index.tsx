import React, { useState, useMemo, useRef, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

interface Announcement {
    id: number;
    title: string;
    content: string;
    date: string;
    publishDate?: string;
    department: string;
    status: 'Active' | 'Archived' | 'Draft';
    icon: string;
}

type AnnouncementType = 'general' | 'system_update' | 'about_setup';

interface FormDataType {
    title: string;
    content: string;
    type: AnnouncementType;
    publishDate: string;
    department: string;
    icon: string;
}

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
    { id: 1, title: 'Welcome to Setup Connect', content: 'Thank you for joining the new DOST Setup Connect platform. We are excited to serve you better.', date: '2026-03-01', department: 'DOST Central Office', status: 'Active', icon: '📢' },
    { id: 2, title: 'New File Sharing Feature Released', content: 'System Update: You can now easily upload and share files with your team.', date: '2026-03-02', department: 'DOST-SEI', status: 'Active', icon: '⚙️' },
    { id: 3, title: 'Setup Connect Version 1.0 Launch', content: 'About Setup: Official release of Setup Connect with improved dashboard and notifications.', date: '2026-03-03', department: 'DOST-TAPI', status: 'Active', icon: '🔬' },
    { id: 4, title: 'Holiday Schedule Reminder', content: 'General Announcement: Please take note of the upcoming DOST holidays and office schedule.', date: '2026-03-04', department: 'DOST Central Office', status: 'Active', icon: '📢' },
    { id: 5, title: 'System Maintenance Scheduled', content: 'System Update: Brief maintenance on March 10, 2026 from 2:00 AM to 4:00 AM. Please save your work.', date: '2026-03-05', department: 'DOST-SEI', status: 'Active', icon: '⚙️' },
    { id: 6, title: 'Q1 2026 Project Reports Submission', content: 'General Announcement: Please be reminded that all Q1 project progress reports and liquidation documents must be submitted on or before March 31, 2026.', date: '2026-03-08', department: 'DOST Central Office', status: 'Active', icon: '📢' },
];

export default function AnnouncementIndex() {
    const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Archived' | 'Draft'>('All');
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewingAnnouncement, setViewingAnnouncement] = useState<Announcement | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const announcementTypes = [
        { type: 'general' as const, label: 'General', department: 'DOST Central Office', icon: '📢' },
        { type: 'system_update' as const, label: 'System Update', department: 'DOST-SEI', icon: '⚙️' },
        { type: 'about_setup' as const, label: 'About Setup', department: 'DOST-TAPI', icon: '🔬' },
    ];

    const initialFormState: FormDataType = { 
        title: '', 
        content: '', 
        type: 'general', 
        publishDate: '', 
        department: announcementTypes[0].department, 
        icon: announcementTypes[0].icon 
    };
    const [formData, setFormData] = useState<FormDataType>(initialFormState);

    const editorRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const filteredAnnouncements = useMemo(() => {
        let filtered = announcements.filter(item => {
            const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.department.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
            return matchesSearch && matchesStatus;
        }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        return filtered;
    }, [announcements, searchTerm, statusFilter]);

    const totalPages = Math.ceil(filteredAnnouncements.length / itemsPerPage);
    const paginatedAnnouncements = filteredAnnouncements.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) setSelectedIds(paginatedAnnouncements.map(item => item.id));
        else setSelectedIds([]);
    };

    const toggleSelection = (id: number) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
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
        const initialType = announcementTypes.find(t => t.icon === item.icon)?.type || 'general';
        setFormData({ 
            title: item.title, 
            content: item.content, 
            type: initialType, 
            publishDate: item.publishDate || '', 
            department: item.department, 
            icon: item.icon 
        });
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this announcement?')) {
            setAnnouncements(prev => prev.filter(item => item.id !== id));
            setSelectedIds(prev => prev.filter(i => i !== id));
        }
    };

    const handleFormSubmit = (e: React.FormEvent, status: 'Active' | 'Draft') => {
        e.preventDefault();
        if (!formData.title.trim()) { 
            alert("Title and Content are required!"); 
            return; 
        }
        const finalContent = editorRef.current ? editorRef.current.innerHTML : formData.content;
        const today = new Date().toISOString().split('T')[0];

        if (editingId) {
            setAnnouncements(prev => prev.map(item => 
                item.id === editingId 
                ? { ...item, title: formData.title, content: finalContent, status, department: formData.department, icon: formData.icon } 
                : item
            ));
        } else {
            const newAnnouncement: Announcement = { 
                id: Date.now(), 
                title: formData.title, 
                content: finalContent, 
                date: formData.publishDate || today, 
                department: formData.department, 
                icon: formData.icon, 
                status 
            };
            setAnnouncements(prev => [newAnnouncement, ...prev]);
        }
        setIsModalOpen(false);
    };

    const execCommand = (command: string) => document.execCommand(command, false);

    const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !editorRef.current) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            if (!event.target?.result) return;
            let html = '';
            if (file.type.startsWith('image/')) {
                html = `<img src="${event.target.result}" style="max-width:100%; height:auto; border-radius:8px; margin:8px 0;" />`;
            } else {
                html = `<a href="${event.target.result}" download="${file.name}" style="color:#3b82f6; text-decoration:underline; font-weight:500;">📄 ${file.name}</a><br>`;
            }
            editorRef.current!.innerHTML += html;
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    useEffect(() => {
        if (isModalOpen && editorRef.current) {
            editorRef.current.innerHTML = formData.content || '';
        }
    }, [isModalOpen, editingId]);

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Announcements</h2>}>
            <Head title="Announcements" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-800">Latest Updates</h3>
                        <button onClick={openCreateModal} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg text-sm flex items-center gap-2">
                            + New Announcement
                        </button>
                    </div>

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
                                {(['All', 'Active', 'Draft', 'Archived'] as const).map(f => (
                                    <button 
                                        key={f} 
                                        onClick={() => { setStatusFilter(f); setCurrentPage(1); }} 
                                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition ${statusFilter === f ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {selectedIds.length > 0 && (
                            <button 
                                onClick={handleBulkArchive}
                                className="bg-gray-800 text-white text-sm font-medium py-2 px-4 rounded-lg hover:bg-gray-700 transition"
                            >
                                Archive Selected ({selectedIds.length})
                            </button>
                        )}
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <table className="w-full whitespace-nowrap">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50/50">
                                    <th className="text-left py-4 px-6 w-12"><input type="checkbox" className="rounded border-gray-300 text-blue-600" checked={selectedIds.length === paginatedAnnouncements.length && paginatedAnnouncements.length > 0} onChange={handleSelectAll} /></th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-600 text-xs uppercase tracking-wider w-32">Date</th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-600 text-xs uppercase tracking-wider">Title</th>
                                    <th className="text-center py-4 px-6 font-semibold text-gray-600 text-xs uppercase tracking-wider w-28">View</th>
                                    <th className="text-right py-4 px-6 font-semibold text-gray-600 text-xs uppercase tracking-wider w-40">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {paginatedAnnouncements.length > 0 ? paginatedAnnouncements.map(item => (
                                    <tr key={item.id} className={`transition-colors ${selectedIds.includes(item.id) ? 'bg-blue-50/30' : 'hover:bg-gray-50'}`}>
                                        <td className="py-4 px-6"><input type="checkbox" className="rounded border-gray-300 text-blue-600" checked={selectedIds.includes(item.id)} onChange={() => toggleSelection(item.id)} /></td>
                                        <td className="py-4 px-6 text-sm text-gray-600">{item.date}</td>
                                        <td className="py-4 px-6">
                                            <div className="font-medium text-gray-900 flex items-center gap-2">
                                                <span>{item.icon}</span> {item.title}
                                            </div>
                                            <div className="text-sm text-gray-500 truncate max-w-md mt-0.5" dangerouslySetInnerHTML={{ __html: item.content }} />
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <button onClick={() => setViewingAnnouncement(item)} className="text-blue-500 hover:text-blue-700">
                                                <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                            </button>
                                        </td>
                                        <td className="py-4 px-6 text-right space-x-4">
                                            <button onClick={() => openEditModal(item)} className="text-blue-600 hover:text-blue-900 font-medium text-sm">Edit</button>
                                            <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900 font-medium text-sm">Delete</button>
                                        </td>
                                    </tr>
                                )) : <tr><td colSpan={5} className="py-12 text-center text-gray-400">No announcements found.</td></tr>}
                            </tbody>
                        </table>

                        {totalPages > 1 && (
                            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                                <span className="text-sm text-gray-700">
                                    Showing <span className="font-semibold">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-semibold">{Math.min(currentPage * itemsPerPage, filteredAnnouncements.length)}</span> of <span className="font-semibold">{filteredAnnouncements.length}</span> results
                                </span>
                                <div className="flex gap-2">
                                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 disabled:opacity-50">Previous</button>
                                    <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 disabled:opacity-50">Next</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {viewingAnnouncement && (
                <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 relative">
                        <button onClick={() => setViewingAnnouncement(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl">×</button>
                        <div className="flex items-start gap-4 mb-4">
                            <span className="text-4xl bg-gray-50 p-3 rounded-full">{viewingAnnouncement.icon}</span>
                            <div>
                                <h3 className="font-bold text-xl">{viewingAnnouncement.title}</h3>
                                <div className="flex gap-3 text-sm text-gray-500 mt-2">
                                    <span>🗓️ {viewingAnnouncement.date}</span>
                                    {viewingAnnouncement.department !== 'DOST Central Office' && (
                                        <span>🏢 {viewingAnnouncement.department}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: viewingAnnouncement.content }} />
                        <div className="mt-8 flex justify-end"><button onClick={() => setViewingAnnouncement(null)} className="bg-blue-600 text-white px-6 py-2 rounded-lg">Close</button></div>
                    </div>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">
                        <div className="px-6 py-4 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                            <h3 className="font-bold text-xl text-gray-900">{editingId ? 'Edit Announcement' : 'New Announcement'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-3xl text-gray-400 hover:text-gray-600">×</button>
                        </div>
                        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Announcement Title</label>
                                <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500" placeholder="e.g. Call for Proposals 2026" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                                <div className="border border-gray-300 rounded-2xl overflow-hidden focus-within:border-blue-500">
                                    <div className="bg-gray-50 border-b px-4 py-3 flex gap-2 items-center">
                                        <button type="button" onClick={() => execCommand('bold')} className="font-bold px-3 py-1 hover:bg-gray-200 rounded">B</button>
                                        <button type="button" onClick={() => execCommand('italic')} className="italic px-3 py-1 hover:bg-gray-200 rounded">I</button>
                                        <button type="button" onClick={() => execCommand('underline')} className="underline px-3 py-1 hover:bg-gray-200 rounded">U</button>
                                        <div className="w-px h-6 bg-gray-300 mx-2"></div>
                                        <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-1 hover:bg-gray-200 rounded flex items-center gap-1 font-medium">📎 Attach File</button>
                                    </div>
                                    <div ref={editorRef} contentEditable className="min-h-[200px] max-h-[320px] px-5 py-4 text-gray-700 focus:outline-none leading-relaxed overflow-y-auto" style={{ whiteSpace: 'pre-wrap' }} />
                                </div>
                                <input type="file" ref={fileInputRef} onChange={handleFileAttach} className="hidden" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Announcement Type</label>
                                    <select 
                                        value={formData.type} 
                                        onChange={e => {
                                            const typeValue = e.target.value as AnnouncementType;
                                            const selected = announcementTypes.find(t => t.type === typeValue);
                                            setFormData({
                                                ...formData, 
                                                type: typeValue, 
                                                department: selected?.department || '', 
                                                icon: selected?.icon || ''
                                            });
                                        }} 
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        {announcementTypes.map(t => (
                                            <option key={t.type} value={t.type}>
                                                {t.icon} {t.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Schedule Publish</label>
                                    <input type="date" value={formData.publishDate} onChange={e => setFormData({...formData, publishDate: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-5 bg-gray-50 border-t flex justify-end gap-3 sticky bottom-0">
                            <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-gray-700 hover:bg-gray-100 rounded-xl transition">Cancel</button>
                            <button onClick={e => handleFormSubmit(e, 'Draft')} className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition">Save as Draft</button>
                            <button onClick={e => handleFormSubmit(e, 'Active')} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">Publish Now</button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}