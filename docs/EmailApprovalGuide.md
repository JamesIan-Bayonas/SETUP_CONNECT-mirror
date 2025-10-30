# Email Approval – Manifestation of Intent (MOI)

Purpose
- When an application is approved, the system must email the applicant with the Manifestation of Intent PDF attached.
- This is implemented via a domain event so feature teams only need to dispatch one line.

What's already implemented
- Event: `App\Events\CustomerApplicationApproved`
- Listener: `App\Listeners\SendManifestationOfIntentListener` (queued)
- Mailable: `App\Mail\ManifestationOfIntentMail` (attaches MOI PDF)
- Email view: `resources/views/emails/manifestation_of_intent.blade.php`
- MOI PDF location: `storage/app/app-templates/manifestation_of_intent.pdf`

How to integrate in your Approve action
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

Example (controller method)
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

Environment configuration (Resend)
- Local/dev (`.env`):
```
MAIL_MAILER=resend
MAIL_FROM_ADDRESS=no-reply@resend.dev
MAIL_FROM_NAME="Setup Connect"
RESEND_KEY=YOUR_RESEND_API_KEY
```
- Clear cache after changes:
```
php artisan optimize:clear
```
- Note: Until a sending domain is verified in Resend, emails only deliver to the account owner address of the API key. For production recipients, verify a domain and update `MAIL_FROM_ADDRESS` to that domain.

Queues
- The listener implements `ShouldQueue`.
- In development, either run a worker:
```
php artisan queue:work
```
- Or set synchronous processing for immediate sends:
```
QUEUE_CONNECTION=sync
```

Testing locally (dev-only routes exist)
- Event-based (queued):
  - `GET /dev/test-approval-mail?to=you@example.com`
- Immediate (no queue/CSRF):
  - `GET /dev/send-mail-now?to=you@example.com`
- These routes are guarded by `app()->environment('local')` and should not be used in production.

Troubleshooting
- 403 in Resend logs: You are sending to a non-owner email without a verified domain.
- No email: Verify `.env` values, run `php artisan optimize:clear`, and check `storage/logs/laravel.log`.
- Missing attachment: Ensure the PDF exists at `storage/app/app-templates/manifestation_of_intent.pdf`.

Ownership
- This guide documents how feature teams should trigger the MOI email. The mail sending implementation is maintained under the Email Approval feature in this repository.
