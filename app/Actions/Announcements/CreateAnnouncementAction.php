<?php

namespace App\Actions\Announcements;

use App\Models\Announcement;
use Illuminate\Support\Facades\Auth; // ✅ Ensure this facade import is present

class CreateAnnouncementAction
{
    /**
     * Execute the solo transaction to create a targeted system announcement.
     *
     * @param array $data Validated request parameters
     * @return Announcement
     */
    public function execute(array $data): Announcement
    {
        return Announcement::create([
            'title'       => $data['title'],
            'content'     => $data['content'],
            'priority'    => $data['priority'],
            'target_role' => $data['target_role'],
            'is_pinned'   => $data['is_pinned'] ?? false,
            'expires_at'  => $data['expires_at'] ?? null,
            'user_id'     => Auth::id(), // ✅ Use the Facade directly here
            'status'      => $data['status'] ?? 'Draft', 
        ]);
    }
}