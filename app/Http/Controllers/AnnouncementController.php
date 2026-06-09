<?php

namespace App\Http\Controllers; // FIXED: Added the missing backslash here

use App\Http\Controllers\Controller; // Explicitly pull in the base controller
use App\Actions\Announcements\CreateAnnouncementAction;
use App\Models\Announcement;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class AnnouncementController extends Controller
{
    /**
     * Display the announcement feed dashboard.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        
        $announcements = Announcement::with('user:id,name')
            ->where(function ($query) use ($user) {
                $query->where('target_role', 'all');
                if ($user) {
                    $query->orWhere('target_role', $user->role ?? 'applicant');
                }
            })
            ->orderByDesc('created_at')
            ->paginate(10);

        return Inertia::render('Announcements/Index', [
            'announcements' => $announcements,
            // FORCE CONTRACT: Explicitly push user permissions and roles into the frontend view instance
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role ?? 'applicant',
                    'user_type' => $user->role ?? 'applicant', // Keeps standard layout matching active
                ] : null,
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
            ]
        ]);
    }

    /**
     * Store a newly created announcement in storage.
     */
    public function store(Request $request, CreateAnnouncementAction $action): RedirectResponse
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'content'     => 'required|string',
            'priority'    => 'required|string|in:low,normal,high,critical',
            'target_role' => 'required|string|in:all,admin,cooperator,applicant',
            'is_pinned'   => 'boolean',
            'expires_at'  => 'nullable|date|after:today',
        ]);

        $action->execute($validated);

        return redirect()->route('announcements.index')
            ->with('success', 'Announcement published successfully!');
    }
}