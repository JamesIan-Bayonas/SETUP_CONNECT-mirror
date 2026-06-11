export type AnnouncementPriority = 'low' | 'normal' | 'high' | 'critical';
export type AnnouncementTargetRole = 'all' | 'admin' | 'cooperator' | 'applicant';

    export interface AnnouncementAuthor {
    id: number;
    name: string;
    photo?: string | null;
}

export interface Announcement {
    id: string;
    user_id: number;
    title: string;
    content: string;
    priority: AnnouncementPriority;
    target_role: AnnouncementTargetRole;
    is_pinned: boolean;
    expires_at: string | null;
    created_at: string;
    updated_at: string;
    user?: AnnouncementAuthor; // Populated via eager loading context
}   

export interface PaginatedAnnouncements {
    data: Announcement[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}