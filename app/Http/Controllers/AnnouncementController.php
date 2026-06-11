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
    
    // 1. Capture the frontend tab selection parameter (defaults to 'All')
    $statusFilter = $request->input('status', 'All');

    $announcements = Announcement::with('user:id,name')
        // Filter by targeted user role audience
        ->where(function ($query) use ($user) {
            $query->where('target_role', 'all');
            if ($user) {
                $query->orWhere('target_role', $user->user_type?->value ?? $user->user_type ?? 'applicant');
            }
        })
        // 2. Add structural database layer status scoping
        ->when($statusFilter !== 'All', function ($query) use ($statusFilter) {
            return $query->where('status', $statusFilter);
        })
        ->orderByDesc('created_at')
        ->paginate(10)
        ->withQueryString(); // Retains active tab state during pagination transitions

    return Inertia::render('Announcements/Index', [
        'announcements' => $announcements,
        'currentStatusFilter' => $statusFilter, // Send it back to synchronize state flags
        'auth' => [
            'user' => $user ? [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'user_type' => $user->user_type?->value ?? $user->user_type ?? 'applicant', 
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
            'status'      => 'required|string|in:Active,Draft',
            'is_pinned'   => 'boolean',
            'expires_at'  => 'nullable|date|after:today',
        ]);

        $action->execute($validated);

        return redirect()->route('announcements.index')
            ->with('success', 'Announcement published successfully!');
    }

    /**
     * Bulk archive selected announcements.
     */
    public function bulkArchive(Request $request): RedirectResponse
    {
        // 1. Strict input validation ensuring data array properties match database tracking states
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'required|exists:announcements,id',
        ]);

        // 2. Perform mass status mutation update query sequence
        Announcement::whereIn('id', $validated['ids'])
            ->update(['status' => 'Archived']);

        // 3. Return back seamlessly to the Inertia view layer with updated state values
        return redirect()->route('announcements.index')
            ->with('success', 'Selected announcements have been archived successfully.');
    }
    /**
     * Update an existing announcement in database storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Announcement  $announcement
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, Announcement $announcement): RedirectResponse
    {
        // 1. Strict input validation matching your data entry criteria
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'content'     => 'required|string',
            'priority'    => 'required|string|in:low,normal,high,critical',
            'target_role' => 'required|string|in:all,admin,cooperator,applicant',
            'status'      => 'required|string|in:Active,Draft', // Crucial to catch the transition status
            'is_pinned'   => 'boolean',
            'expires_at'  => 'nullable|date|after:today',
        ]);

        // 2. Perform the database update transaction on the bound model instance
        $announcement->update($validated);

        // 3. Return back to the plural Inertia list view with flash alerts
        return redirect()->route('announcements.index')
            ->with('success', 'Announcement updated and processed successfully!');
    }
}