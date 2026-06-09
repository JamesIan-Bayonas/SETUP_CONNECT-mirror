<?php

namespace App\Actions\Announcements;

use App\Models\Announcement;
use Illuminate\Support\Facades\Auth;

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
        $announcement = Announcement::create([
            'user_id'     => Auth::id(), // Automatically bind authenticated creator context
            'title'       => $data['title'],
            'content'     => $data['content'],
            'priority'    => $data['priority'] ?? 'normal',
            'target_role' => $data['target_role'] ?? 'all',
            'is_pinned'   => $data['is_pinned'] ?? false,
            'expires_at'  => $data['expires_at'] ?? null,
        ]);

        // Future Bridge Note: On Day 4, we will dispatch an asynchronous event here
        // (e.g., event(new AnnouncementPublished($announcement))) so Group 4's 
        // Notification module can catch it without touching our code slice.

        return $announcement;
    }
}