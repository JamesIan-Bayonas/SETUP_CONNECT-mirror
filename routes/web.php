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
    Route::get('/dev/test-approval-mail', function () {
        // Use positional arguments because Dispatchable::dispatch doesn't support named args
        CustomerApplicationApproved::dispatch(
            'Test Applicant',
            'admin@setupconnect.com',
            1,
            optional(auth()->user())->id,
            now()->toIso8601String(),
        );
        return 'Dispatched test approval event.';
    });
}
