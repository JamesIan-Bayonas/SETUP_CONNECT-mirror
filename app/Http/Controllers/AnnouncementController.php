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
        
        $announcements = Announcement::with('user:id,name,photo')
            ->where(function ($query) use ($user) {
                $query->where('target_role', 'all');
                if ($user) {
                    $query->orWhere('target_role', $user->role ?? 'applicant');
                }
            })
            ->where(function ($query) {
                $query->whereNull('expires_at')
                      ->orWhere('expires_at', '>', now());
            })
            ->orderByDesc('is_pinned')
            ->orderByDesc('created_at')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Announcements/Index', [
            'announcements' => $announcements,
            'filters' => $request->only(['search', 'priority'])
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