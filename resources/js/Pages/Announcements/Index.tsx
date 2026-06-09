import React, { useState, useMemo, useRef, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router, useForm } from '@inertiajs/react';

// Production TypeScript contracts matching our real Eloquent schema
interface AnnouncementUser {
    id: number;
    name: string;
}

interface Announcement {
    id: string; // Changed to string for secure UUID management
    title: string;
    content: string;
    priority: 'low' | 'normal' | 'high' | 'critical';
    target_role: 'all' | 'admin' | 'cooperator' | 'applicant';
    is_pinned: boolean;
    expires_at: string | null;
    created_at: string;
    user?: AnnouncementUser; // Linked database author object
}

interface PaginatedAnnouncements {
    data: Announcement[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface PageProps {
    announcements: PaginatedAnnouncements;
    auth: {
        user: {
            id: number;
            name: string;
            role?: string;
        };
    };
    flash: {
        success?: string;
        error?: string;
    };
}

export default function AnnouncementIndex() {
    // Read directly from real, server-side database records pushed by Laravel
    const { announcements, auth, flash } = usePage<any>().props as unknown as PageProps;
    
    const [searchTerm, setSearchTerm] = useState('');
    const [priorityFilter, setPriorityFilter] = useState<string>('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewingAnnouncement, setViewingAnnouncement] = useState<Announcement | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);

    const editorRef = useRef<HTMLDivElement>(null);

    // Inertia high-performance form handler hook
    const { data, setData, post, put, processing, reset, errors } = useForm({
        title: '',
        content: '',
        priority: 'normal',
        target_role: 'all',
        is_pinned: false,
        expires_at: '',
    });

    // Frontend searching logic across active server results
    const filteredAnnouncements = useMemo(() => {
        return announcements.data.filter(item => {
            const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.content.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesPriority = priorityFilter === 'All' || item.priority === priorityFilter;
            return matchesSearch && matchesPriority;
        });
    }, [announcements.data, searchTerm, priorityFilter]);

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
            priority: item.priority,
            target_role: item.target_role,
            is_pinned: item.is_pinned,
            expires_at: item.expires_at ? item.expires_at.split('T')[0] : '',
        });
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to permanently delete this announcement from the database?')) {
            router.delete(`/announcements/${id}`, {
                onSuccess: () => alert('Deleted successfully from the server!')
            });
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Grab the content directly from your custom rich text editor div
        const finalContent = editorRef.current ? editorRef.current.innerHTML : data.content;
        
        if (!data.title.trim() || !finalContent.trim()) {
            alert("Title and Content are required fields!");
            return;
        }

        // Synchronize data model attributes before submission
        data.content = finalContent;

        if (editingId) {
            put(`/announcements/${editingId}`, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                }
            });
        } else {
            post('/announcements', {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                }
            });
        }
    };

    const execCommand = (command: string) => document.execCommand(command, false);

    // Sync content state safely when modal triggers
    useEffect(() => {
        if (isModalOpen && editorRef.current) {
            editorRef.current.innerHTML = data.content || '';
        }
    }, [isModalOpen, editingId]);

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Announcements System</h2>}>
            <Head title="Announcements Management" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* Status Alert feedback banner */}
                    {flash?.success && (
                        <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-medium">
                            ✅ {flash.success}
                        </div>
                    )}

                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-800">Operational Notices Feed</h3>
                        {/* Access security check rule layer: Only administrative accounts can create */}
                        {auth.user.role === 'admin' && (
                            <button onClick={openCreateModal} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg text-sm transition">
                                + Create Announcement
                            </button>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                        <input 
                            type="text" 
                            placeholder="Search title or keywords..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                            className="w-full sm:max-w-md bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                        />
                        <div className="flex gap-2 items-center bg-white border p-1.5 rounded-lg border-gray-300 text-sm">
                            <span className="text-gray-500 pl-2">Priority Filter:</span>
                            {['All', 'low', 'normal', 'high', 'critical'].map(p => (
                                <button 
                                    key={p} 
                                    onClick={() => setPriorityFilter(p)} 
                                    className={`px-3 py-1 font-medium rounded-md capitalize transition ${priorityFilter === p ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Main UI Data table component representation */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <table className="w-full whitespace-nowrap">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50/50 text-left text-xs uppercase tracking-wider font-semibold text-gray-600">
                                    <th className="py-4 px-6 w-32">Priority</th>
                                    <th className="py-4 px-6">Announcement Info</th>
                                    <th className="py-4 px-6 w-40">Target Audience</th>
                                    <th className="py-4 px-6 text-center w-28">View</th>
                                    {auth.user.role === 'admin' && <th className="py-4 px-6 text-right w-40">Actions</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredAnnouncements.length > 0 ? filteredAnnouncements.map(item => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition">
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold uppercase ${
                                                item.priority === 'critical' ? 'bg-red-50 text-red-700 border border-red-200' :
                                                item.priority === 'high' ? 'bg-orange-50 text-orange-700 border border-orange-200' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {item.is_pinned ? '📌 ' : ''}{item.priority}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="font-semibold text-gray-900">{item.title}</div>
                                            <div className="text-xs text-gray-400 mt-1">
                                                By: {item.user?.name || 'Administrator'} • Published: {new Date(item.created_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-600 capitalize">
                                            🎯 {item.target_role}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <button onClick={() => setViewingAnnouncement(item)} className="text-blue-500 hover:text-blue-700">
                                                👁️ View Notice
                                            </button>
                                        </td>
                                        {auth.user.role === 'admin' && (
                                            <td className="py-4 px-6 text-right space-x-3">
                                                <button onClick={() => openEditModal(item)} className="text-blue-600 hover:text-blue-900 font-medium text-sm">Edit</button>
                                                <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900 font-medium text-sm">Delete</button>
                                            </td>
                                        )}
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-gray-400">
                                            No database records match your active search filter properties.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Read Modal Window */}
            {viewingAnnouncement && (
                <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 relative">
                        <button onClick={() => setViewingAnnouncement(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl">×</button>
                        <h3 className="font-bold text-xl mb-2">{viewingAnnouncement.title}</h3>
                        <div className="text-xs text-gray-400 mb-4">Published: {new Date(viewingAnnouncement.created_at).toLocaleString()}</div>
                        <div className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: viewingAnnouncement.content }} />
                        <div className="mt-6 flex justify-end">
                            <button onClick={() => setViewingAnnouncement(null)} className="bg-blue-600 text-white px-6 py-2 rounded-lg">Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create & Edit Admin Modal Composer */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <form onSubmit={handleFormSubmit} className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">
                        <div className="px-6 py-4 border-b flex justify-between items-center bg-white sticky top-0">
                            <h3 className="font-bold text-xl text-gray-900">{editingId ? 'Modify Announcement Data' : 'Compose Live Announcement'}</h3>
                            <button type="button" onClick={() => setIsModalOpen(false)} className="text-3xl text-gray-400 hover:text-gray-600">×</button>
                        </div>
                        
                        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input type="text" value={data.title} onChange={e => setData('title', e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none" required placeholder="Enter announcement header title..." />
                                {errors.title && <div className="text-red-500 text-xs mt-1">{errors.title}</div>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Message Content Editor</label>
                                <div className="border border-gray-300 rounded-2xl overflow-hidden focus-within:border-blue-500">
                                    <div className="bg-gray-50 border-b px-4 py-3 flex gap-2 items-center">
                                        <button type="button" onClick={() => execCommand('bold')} className="font-bold px-3 py-1 hover:bg-gray-200 rounded">B</button>
                                        <button type="button" onClick={() => execCommand('italic')} className="italic px-3 py-1 hover:bg-gray-200 rounded">I</button>
                                        <button type="button" onClick={() => execCommand('underline')} className="underline px-3 py-1 hover:bg-gray-200 rounded">U</button>
                                    </div>
                                    <div ref={editorRef} contentEditable className="min-h-[200px] max-h-[320px] px-5 py-4 text-gray-700 focus:outline-none leading-relaxed overflow-y-auto" style={{ whiteSpace: 'pre-wrap' }} />
                                </div>
                                {errors.content && <div className="text-red-500 text-xs mt-1">{errors.content}</div>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Role Audience</label>
                                    <select value={data.target_role} onChange={e => setData('target_role', e.target.value as any)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5">
                                        <option value="all">All Users</option>
                                        <option value="admin">System Administrators Only</option>
                                        <option value="cooperator">Partners / Cooperators</option>
                                        <option value="applicant">New Applicants</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Threat Level Priority</label>
                                    <select value={data.priority} onChange={e => setData('priority', e.target.value as any)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5">
                                        <option value="low">Low Priority</option>
                                        <option value="normal">Normal Priority</option>
                                        <option value="high">High Urgency</option>
                                        <option value="critical">🚨 Critical Flash Alert</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <input type="checkbox" id="is_pinned" checked={data.is_pinned} onChange={e => setData('is_pinned', e.target.checked)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4" />
                                <label htmlFor="is_pinned" className="text-sm font-medium text-gray-700 select-none">Pin this announcement at the absolute top of user feeds</label>
                            </div>
                        </div>

                        <div className="px-6 py-5 bg-gray-50 border-t flex justify-end gap-3 sticky bottom-0">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-gray-700 hover:bg-gray-100 rounded-xl transition">Cancel</button>
                            <button type="submit" disabled={processing} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium disabled:opacity-50">
                                {editingId ? 'Apply Update' : 'Broadcast Now'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </AuthenticatedLayout>
    );
}