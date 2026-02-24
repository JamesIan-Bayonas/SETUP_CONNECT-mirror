<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\CustomerApprovalController;
use App\Http\Controllers\SetUpCustomerController;
use App\Http\Controllers\CustomerBusinessDocumentController;
use App\Http\Controllers\ManifestationOfIntentController;
use App\Http\Controllers\Web\BusinessOrganizationTypeController;
use App\Http\Controllers\Web\DocumentTypeController;
use App\Events\CustomerApplicationApproved;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Redirect root to login
Route::get('/', function () {
    return auth()->check() ? redirect('/dashboard') : redirect('/login');
});

// Application success page (public)
Route::get('/application-success', function () {
    return inertia('CustomerApplications/ApplicationSuccess');
})->name('application.success');

// Authentication routes
Route::middleware('guest')->group(function () {
    Route::get('/login', [LoginController::class, 'create'])->name('login');
    Route::post('/login', [LoginController::class, 'store']);

    // Password Reset Routes
    Route::get('/forgot-password', function () {
        return inertia('Auth/ForgotPassword');
    })->name('password.request');

    Route::post('/forgot-password', function (\Illuminate\Http\Request $request) {
        $request->validate(['email' => 'required|email']);
        $status = \Illuminate\Support\Facades\Password::sendResetLink($request->only('email'));
        return $status === \Illuminate\Support\Facades\Password::RESET_LINK_SENT
            ? back()->with(['status' => __($status)])
            : back()->withErrors(['email' => __($status)]);
    })->name('password.email');

    Route::get('/reset-password/{token}', function (string $token) {
        return inertia('Auth/ResetPassword', ['token' => $token, 'email' => request('email')]);
    })->name('password.reset');

    Route::post('/reset-password', function (\Illuminate\Http\Request $request) {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);

        $status = \Illuminate\Support\Facades\Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill(['password' => \Illuminate\Support\Facades\Hash::make($password)])->save();
            }
        );

        return $status === \Illuminate\Support\Facades\Password::PASSWORD_RESET
            ? redirect()->route('login')->with('status', __($status))
            : back()->withErrors(['email' => [__($status)]]);
    })->name('password.update');
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // User management (only for admin and PSTO staff)
    Route::middleware('can:manage-users')->group(function () {
        Route::resource('users', UserController::class);
    });

    // Business Organization Type Management (only for admin)
    Route::middleware('can:manage-org-types')->group(function () {
        Route::resource('org-types', BusinessOrganizationTypeController::class);
    });

    // Document Type Management (admin and psto_staff)
    Route::middleware('can:manage-document-types')->group(function () {
        Route::resource('document-types', DocumentTypeController::class)->except(['show']);
    });
});


// Public application form (no auth required)
Route::get('/application-form', [CustomerController::class, 'index'])->name('customer.form');

// Customer Approval Management (authenticated users only)
Route::middleware('auth')->group(function () {
    Route::get('/customerapprovalform', [CustomerApprovalController::class, 'index'])
        ->name('customerapprovalform');
    Route::get('/customerapprovalform/{id}', [CustomerApprovalController::class, 'show'])
        ->name('customer.show');
    Route::post('/customerapprovalform/{id}/approve', [CustomerApprovalController::class, 'approve'])
        ->name('customer.approve');
    Route::post('/customerapprovalform/{id}/decline', [CustomerApprovalController::class, 'decline'])
        ->name('customer.decline');
    Route::delete('/customerapprovalform/{id}', [CustomerApprovalController::class, 'destroy'])
        ->name('customer.destroy');

    // Setup Customer Management

    Route::get('/setupcustomers', [SetUpCustomerController::class, 'index'])
        ->name('setupcustomers'); // Fixed: removed the stray 'a'
    Route::get('/setupcustomers/{id}', [SetUpCustomerController::class, 'show'])
        ->name('setupcustomers.show');
    Route::put('/setupcustomers/{id}', [SetUpCustomerController::class, 'update'])
        ->name('setupcustomers.update');
    Route::post('/setupcustomers/{id}/toggle-active', [SetUpCustomerController::class, 'toggleActive'])
        ->name('setupcustomers.toggle');
    Route::post('/setupcustomer', [SetUpCustomerController::class, 'store'])
        ->name('customer.add');

    // Customer Business Document Management
    Route::post('/customer-documents/{document}/upload', [CustomerBusinessDocumentController::class, 'upload'])
        ->name('customer-documents.upload');
    Route::post('/customer-documents/{document}/verify', [CustomerBusinessDocumentController::class, 'verify'])
        ->name('customer-documents.verify');
    Route::post('/customer-documents/{document}/reject', [CustomerBusinessDocumentController::class, 'reject'])
        ->name('customer-documents.reject');
    Route::get('/my-documents', [CustomerBusinessDocumentController::class, 'myDocuments'])
        ->name('my-documents');

    // Manifestation of Intent
    Route::get('/my-moi', [ManifestationOfIntentController::class, 'myMoi'])
        ->name('my-moi');
    Route::post('/moi/{moi}/upload', [ManifestationOfIntentController::class, 'upload'])
        ->name('moi.upload');
    Route::post('/moi/{moi}/acknowledge', [ManifestationOfIntentController::class, 'acknowledge'])
        ->name('moi.acknowledge');
    Route::post('/moi/{moi}/schedule-tna', [ManifestationOfIntentController::class, 'scheduleTna'])
        ->name('moi.schedule-tna');
    Route::get('/moi/staff-list', [ManifestationOfIntentController::class, 'staffList'])
        ->name('moi.staff-list');
});

// Message Route
Route::middleware('auth')->group(function () {

    Route::get('/messages', function () {
        
        return inertia('Message/Index', [
            'initialMessages' => [], 
        ]);
    })->name('messages');
});

// Document Route
Route::middleware('auth')->group(function () {
    Route::get('/upload', function () {
        return Inertia::render('Document/Upload');
    })->name('document.upload');
});

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

// Document view route
Route::get('/Files/view', function () {
    return Inertia::render('Files/View');
});

Route::get('/files/view', function () {
    return Inertia::render('Files/ViewFile'); // will be removed later
})->name('files.view');