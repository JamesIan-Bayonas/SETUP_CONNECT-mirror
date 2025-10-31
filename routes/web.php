<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\CustomerApprovalController;
use App\Events\CustomerApplicationApproved;
use Illuminate\Support\Facades\Route;

// Redirect root to login
Route::get('/', function () {
    return auth()->check() ? redirect('/dashboard') : redirect('/login');
});

// Authentication routes
Route::middleware('guest')->group(function () {
    Route::get('/login', [LoginController::class, 'create'])->name('login');
    Route::post('/login', [LoginController::class, 'store']);
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');
    
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // User management (only for admin and PSTO staff)
    Route::middleware('can:manage-users')->group(function () {
        Route::resource('users', UserController::class);
    });
});

  // Customer Approval Form
  Route::get('/customerapprovalform', [CustomerApprovalController::class, 'index'])
        ->name('customerapprovalform');

Route::get('/application-form', [CustomerController::class, 'index'])->name('customer.form');


// Local dev route to test approval email dispatch
if (app()->environment('local')) {
    // Simple form UI to trigger a test send
    Route::get('/dev/mail-test', function () {
        return response(<<<HTML
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>Mail Test</title></head>
<body style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial; padding: 24px;">
  <h1>Mail Test</h1>
  <p>Send the Manifestation of Intent email to a specific address.</p>
  <form method="GET" action="/dev/test-approval-mail" style="margin-bottom:16px;">
    <label>Email (queued via event): <input type="email" name="to" required style="width:320px;"></label>
    <button type="submit">Send (Queued)</button>
  </form>
  <p style="margin-top:24px; color:#555">Note: Without a verified domain, Resend only delivers to your account email.</p>
</body>
</html>
HTML);
    });

    Route::get('/dev/test-approval-mail', function () {
        $to = request('to');
        if (!$to) {
            return 'Missing recipient (?to=you@example.com)';
        }
        // Use positional arguments because Dispatchable::dispatch doesn't support named args
        CustomerApplicationApproved::dispatch(
            'Test Applicant',
            $to,
            1,
            optional(auth()->user())->id,
            now()->toIso8601String(),
        );
        return 'Dispatched test approval event to ' . $to;
    });
}
