import React, { useState, useMemo, useRef, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, useForm, router } from '@inertiajs/react';

interface Announcement {
    id: string; 
    title: string;
    content: string;
    created_at: string; 
    priority: 'low' | 'normal' | 'high' | 'critical';
    target_role: 'all' | 'admin' | 'cooperator' | 'applicant';
    status?: 'Active' | 'Archived' | 'Draft'; 
    user?: {
        name: string;
    };
}

interface PageProps {
    announcements: {
        data: Announcement[];
    };
    flash: {
        success?: string;
        error?: string;
    };
}

export default function AnnouncementIndex() {
    // 1. FIXED: Correctly grab props from Inertia without duplicate parameters in the function signature
    const { announcements, flash } = usePage<any>().props as unknown as PageProps;
    
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Archived' | 'Draft'>('All');
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewingAnnouncement, setViewingAnnouncement] = useState<Announcement | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    
    const { data, setData, post, put, reset } = useForm({
        title: '',
        content: '',
        priority: 'normal',
        target_role: 'all',
        is_pinned: false,
        expires_at: '',
    });

    const editorRef = useRef<HTMLDivElement>(null);

    const filteredAnnouncements = useMemo(() => {
        return (announcements?.data || []).filter((item: Announcement) => {
            const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.content.toLowerCase().includes(searchTerm.toLowerCase());
            
            const currentStatus = item.status || 'Active';
            const matchesStatus = statusFilter === 'All' || currentStatus === statusFilter;
            
            return matchesSearch && matchesStatus;
        }).sort((a: Announcement, b: Announcement) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }, [announcements, searchTerm, statusFilter]);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) setSelectedIds(filteredAnnouncements.map((item: Announcement) => item.id));
        else setSelectedIds([]);
    };

    const toggleSelection = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleBulkArchive = () => {
        if (confirm(`Are you sure you want to archive the ${selectedIds.length} selected notices?`)) {
            router.post('/announcements/bulk-archive', { ids: selectedIds }, {
                onSuccess: () => setSelectedIds([])
            });
        }
    };

    const openCreateModal = () => {
        setEditingId(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (item: Announcement) => {
        setEditingId(item.id);
        setData({
            title: item.title,
            content: item.content,
            priority: item.priority || 'normal',
            target_role: item.target_role || 'all',
            is_pinned: false,
            expires_at: '',
        });
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to permanently delete this record from the system database?')) {
            router.delete(`/announcements/${id}`);
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalContent = editorRef.current ? editorRef.current.innerHTML : data.content;

        if (!data.title.trim() || !finalContent.trim()) {
            alert("Title and Content fields are strictly required!");
            return;
        }

        data.content = finalContent;

        if (editingId) {
            put(`/announcements/${editingId}`, {
                onSuccess: () => setIsModalOpen(false)
            });
        } else {
            post('/announcements', {
                onSuccess: () => setIsModalOpen(false)
            });
        }
    };

    const execCommand = (command: string) => document.execCommand(command, false);

    useEffect(() => {
        if (isModalOpen && editorRef.current) {
            editorRef.current.innerHTML = data.content || '';
        }
    }, [isModalOpen, editingId]);

    // 2. FIXED: Removed user={auth.user} because AuthenticatedLayout fetches it internally.
    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Announcements</h2>}>
            <Head title="Announcements Management" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {flash?.success && (
                        <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-medium">
                            {flash.success}
                        </div>
                    )}

                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-800">Latest Updates</h3>
                        <button onClick={openCreateModal} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg text-sm flex items-center gap-2 transition">
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
                                className="w-full sm:max-w-md bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none" 
                            />
                            <div className="flex gap-1 bg-white border border-gray-300 p-1 rounded-lg shadow-sm">
                                {(['All', 'Active', 'Draft', 'Archived'] as const).map(f => (
                                    <button 
                                        key={f} 
                                        onClick={() => setStatusFilter(f)} 
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
                                <tr className="border-b border-gray-200 bg-gray-50/50 text-left">
                                    <th className="py-4 px-6 w-12">
                                        <input 
                                            type="checkbox" 
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                                            checked={selectedIds.length === filteredAnnouncements.length && filteredAnnouncements.length > 0} 
                                            onChange={handleSelectAll} 
                                        />
                                    </th>
                                    <th className="py-4 px-6 font-semibold text-gray-600 text-xs uppercase tracking-wider w-32">Date</th>
                                    <th className="py-4 px-6 font-semibold text-gray-600 text-xs uppercase tracking-wider">Title</th>
                                    <th className="py-4 px-6 font-semibold text-gray-600 text-xs uppercase tracking-wider text-center w-28">View</th>
                                    <th className="py-4 px-6 font-semibold text-gray-600 text-xs uppercase tracking-wider text-right w-40">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredAnnouncements.length > 0 ? filteredAnnouncements.map((item: Announcement) => (
                                    <tr key={item.id} className={`transition-colors ${selectedIds.includes(item.id) ? 'bg-blue-50/30' : 'hover:bg-gray-50'}`}>
                                        <td className="py-4 px-6">
                                            <input 
                                                type="checkbox" 
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                                                checked={selectedIds.includes(item.id)} 
                                                onChange={() => toggleSelection(item.id)} 
                                            />
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-600">
                                            {new Date(item.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="font-medium text-gray-900 flex items-center gap-2">
                                                <span>📢</span> {item.title}
                                            </div>
                                            <div className="text-sm text-gray-500 truncate max-w-md mt-0.5" dangerouslySetInnerHTML={{ __html: item.content }} />
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <button onClick={() => setViewingAnnouncement(item)} className="text-blue-500 hover:text-blue-700 transition">
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
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-gray-400">No announcements found in database tracking options.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {viewingAnnouncement && (
                <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 relative">
                        <button onClick={() => setViewingAnnouncement(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl">×</button>
                        <div className="flex items-start gap-4 mb-4">
                            <span className="text-4xl bg-gray-50 p-3 rounded-full">📢</span>
                            <div>
                                <h3 className="font-bold text-xl">{viewingAnnouncement.title}</h3>
                                <div className="text-xs text-gray-400 mt-1">Published: {new Date(viewingAnnouncement.created_at).toLocaleString()}</div>
                            </div>
                        </div>
                        <div className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: viewingAnnouncement.content }} />
                        <div className="mt-6 flex justify-end">
                            <button onClick={() => setViewingAnnouncement(null)} className="bg-blue-600 text-white px-6 py-2 rounded-lg">Close</button>
                        </div>
                    </div>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <form onSubmit={handleFormSubmit} className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">
                        <div className="px-6 py-4 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                            <h3 className="font-bold text-xl text-gray-900">{editingId ? 'Edit Announcement' : 'New Announcement'}</h3>
                            <button type="button" onClick={() => setIsModalOpen(false)} className="text-3xl text-gray-400 hover:text-gray-600">×</button>
                        </div>
                        
                        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Announcement Title</label>
                                <input type="text" value={data.title} onChange={e => setData('title', e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="e.g. Call for Proposals 2026" />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                                <div className="border border-gray-300 rounded-2xl overflow-hidden focus-within:border-blue-500">
                                    <div className="bg-gray-50 border-b px-4 py-3 flex gap-2 items-center">
                                        <button type="button" onClick={() => execCommand('bold')} className="font-bold px-3 py-1 hover:bg-gray-200 rounded">B</button>
                                        <button type="button" onClick={() => execCommand('italic')} className="italic px-3 py-1 hover:bg-gray-200 rounded">I</button>
                                        <button type="button" onClick={() => execCommand('underline')} className="underline px-3 py-1 hover:bg-gray-200 rounded">U</button>
                                    </div>
                                    <div ref={editorRef} contentEditable className="min-h-[200px] max-h-[320px] px-5 py-4 text-gray-700 focus:outline-none leading-relaxed overflow-y-auto" style={{ whiteSpace: 'pre-wrap' }} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience Group</label>
                                    <select value={data.target_role} onChange={e => setData('target_role', e.target.value as any)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white">
                                        <option value="all">All Users</option>
                                        <option value="admin">Administrators Only</option>
                                        <option value="cooperator">Partners / Cooperators</option>
                                        <option value="applicant">New Applicants</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Urgency Priority</label>
                                    <select value={data.priority} onChange={e => setData('priority', e.target.value as any)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white">
                                        <option value="low">Low Priority</option>
                                        <option value="normal">Normal</option>
                                        <option value="high">High Urgency</option>
                                        <option value="critical">🚨 Critical Alert</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-5 bg-gray-50 border-t flex justify-end gap-3 sticky bottom-0">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-gray-700 hover:bg-gray-100 rounded-xl transition">Cancel</button>
                            <button type="submit" className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium">Publish Now</button>
                        </div>
                    </form>
                </div>
            )}
        </AuthenticatedLayout>
    );
}