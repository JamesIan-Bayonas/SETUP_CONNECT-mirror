# Email Approval – Manifestation of Intent (MOI)

## Purpose
- When an application is approved, the system must email the applicant with the Manifestation of Intent PDF attached.
- This is implemented via a domain event so feature teams only need to dispatch one line.

## Setup

**⚠️ IMPORTANT: The code doesn't work without these steps completed.**

### Step 1: Configure Queue Connection (REQUIRED)

Set the queue connection to synchronous in your `.env` file:

```env
QUEUE_CONNECTION=sync
```

**Why this is required:** The listener implements `ShouldQueue`. Without `QUEUE_CONNECTION=sync`, emails will be queued but won't be processed unless a queue worker is running. In development, synchronous processing ensures immediate sends without requiring a separate worker process.

**Note:** Running `php artisan queue:work` is not recommended for local development as Resend has a limit of 100 dev emails per day, and queued jobs may waste these limited emails.

### Step 2: Add Manifestation of Intent PDF (REQUIRED)

Download the Manifestation of Intent PDF and place it in the following directory:

```
storage/app/app-templates/manifestation_of_intent.pdf
```

**Important:** This file must exist at this exact location. If the PDF is missing, email sends will fail with a missing attachment error.

## What's already implemented
- Event: `App\Events\CustomerApplicationApproved`
- Listener: `App\Listeners\SendManifestationOfIntentListener` (queued)
- Mailable: `App\Mail\ManifestationOfIntentMail` (attaches MOI PDF)
- Email view: `resources/views/emails/manifestation_of_intent.blade.php`
- MOI PDF location: `storage/app/app-templates/manifestation_of_intent.pdf`

## How to integrate in your Approve action

1. Import the event in your controller/service
```php
use App\Events\CustomerApplicationApproved;
```

2. After you successfully mark the application as approved, dispatch the event
```php
CustomerApplicationApproved::dispatch(
    $name,            // Applicant display name used in greeting
    $email,           // Recipient email
    $applicationId,   // Approved application ID
    auth()->id(),     // Approver user id
    now()->toIso8601String(),
);
```

### Example (controller method)
```php
public function approve(int $id)
{
    $application = Customer::findOrFail($id);

    // Mark approved (example, adjust to your model/columns)
    $application->approved_by = auth()->id();
    $application->approved_at = now();
    $application->status = 'approved';
    $application->save();

    // Send MOI email
    CustomerApplicationApproved::dispatch(
        $application->contact_name ?? $application->name ?? 'Applicant',
        $application->website_email_address ?? $application->email,
        $application->id,
        auth()->id(),
        now()->toIso8601String(),
    );

    return back()->with('success', 'Application approved and MOI email sent.');
}
```

## Environment configuration (Resend)

Local/dev (`.env`):
```env
MAIL_MAILER=resend
MAIL_FROM_ADDRESS=no-reply@resend.dev
MAIL_FROM_NAME="Setup Connect"
RESEND_KEY=YOUR_RESEND_API_KEY
```

Clear cache after changes:
```bash
php artisan optimize:clear
```

**Note:** Until a sending domain is verified in Resend, emails only deliver to the account owner address of the API key. For production recipients, verify a domain and update `MAIL_FROM_ADDRESS` to that domain.

## Queues

The listener implements `ShouldQueue`. For local development, **always use** `QUEUE_CONNECTION=sync` (see Step 1 above) to ensure emails are sent immediately without requiring a queue worker.

**Not recommended for local development:** Running `php artisan queue:work` is not recommended as Resend limits dev emails to 100 per day, and queued jobs may consume these emails unnecessarily.

## Testing locally (dev-only routes)

- Event-based (queued):
  - `GET /dev/test-approval-mail?to=you@example.com`

These routes are guarded by `app()->environment('local')` and should not be used in production.

**Tip:** You can also visit `/dev/mail-test` for a simple UI form to test email sends.

## Troubleshooting

- **403 in Resend logs:** You are sending to a non-owner email without a verified domain.
- **No email:** Verify `.env` values, ensure `QUEUE_CONNECTION=sync` is set, run `php artisan optimize:clear`, and check `storage/logs/laravel.log`.
- **Missing attachment:** Ensure the PDF exists at `storage/app/app-templates/manifestation_of_intent.pdf` (see Step 2 above).

## Ownership

This guide documents how feature teams should trigger the MOI email. The mail sending implementation is maintained under the Email Approval feature in this repository.
