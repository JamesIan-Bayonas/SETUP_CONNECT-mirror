# Email Approval – Manifestation of Intent (MOI)

## Purpose

When an application is approved, this system automatically sends an email to the applicant with the Manifestation of Intent PDF attached.

---

## Quick Start

### Step 1: Set Queue to Sync

Add to your `.env` file:

```env
QUEUE_CONNECTION=sync
```

**Why?** This ensures emails send immediately during development without needing a queue worker.

⚠️ **Important:** Don't use `php artisan queue:work` in local development - Resend limits dev accounts to 100 emails/day.

### Step 2: Add the PDF File

Place the MOI PDF here:
```
storage/app/app-templates/manifestation_of_intent.pdf
```

### Step 3: Configure Resend (if not done)

Add to your `.env` file:

```env
MAIL_MAILER=resend
MAIL_FROM_ADDRESS=no-reply@resend.dev
MAIL_FROM_NAME="Setup Connect"
RESEND_KEY=your_api_key_here
```

After any `.env` changes, run:
```bash
php artisan optimize:clear
```

---

## Usage

### In Your Controller

```php
use App\Events\CustomerApplicationApproved;

public function approve(int $id)
{
    $application = Customer::findOrFail($id);

    // Mark as approved
    $application->approved_by = auth()->id();
    $application->approved_at = now();
    $application->status = 'approved';
    $application->save();

    // Send email
    CustomerApplicationApproved::dispatch(
        $application->contact_name ?? $application->name ?? 'Applicant',
        $application->website_email_address ?? $application->email,
        $application->id,
        auth()->id(),
        now()->toIso8601String()
    );

    return back()->with('success', 'Application approved and MOI email sent.');
}
```

---

## Testing

### Option 1: Test UI
Visit: `http://127.0.0.1:8000/dev/mail-test`

Enter an email address and click "Send (Queued)".

### Option 2: Test Route
Visit: `http://127.0.0.1:8000/dev/test-approval-mail?to=your-email@example.com`

### Option 3: Using Tinker
```bash
php artisan tinker
```

```php
use App\Events\CustomerApplicationApproved;
CustomerApplicationApproved::dispatch('Test User', 'your@email.com', 1, 1, now()->toIso8601String());
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| No email sent | Check `.env` has `QUEUE_CONNECTION=sync`, run `php artisan optimize:clear` |
| 403 error in Resend | You're sending to non-owner email without verified domain |
| Missing attachment | Ensure PDF exists at `storage/app/app-templates/manifestation_of_intent.pdf` |
| Duplicate emails | Ensure you're on latest code - this was fixed on Nov 5, 2025 |

Check logs: `storage/logs/laravel.log`

---

## Change Log

### Nov 5, 2025 - Fixed Duplicate Emails (Branch: `fix/duplicate-email-issue`)
**Problem:** Emails were being sent twice per approval.

**Fix:** Removed duplicate listener registration. Laravel 11 auto-discovers listeners - we don't need to register them manually.

**Files Changed:**
- `app/Providers/EventServiceProvider.php` - Removed manual registration
- `app/Listeners/SendManifestationOfIntentListener.php` - Added `#[ListensTo]` attribute

### Oct 31, 2025 - Initial Implementation (Branch: `feature/email-approval-moi`)
- Created email approval system with Resend integration
- Added test routes for development
- Added queue sync configuration
- Consolidated all documentation

---

## Technical Details

### What's Implemented
- **Event:** `App\Events\CustomerApplicationApproved`
- **Listener:** `App\Listeners\SendManifestationOfIntentListener`
- **Mailable:** `App\Mail\ManifestationOfIntentMail`
- **Email View:** `resources/views/emails/manifestation_of_intent.blade.php`

### Notes
- Test routes only work in local environment
- Resend requires verified domain for non-owner emails
- Listener is queued and runs after database commits
