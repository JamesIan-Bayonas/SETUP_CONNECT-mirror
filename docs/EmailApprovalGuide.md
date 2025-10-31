# Email Approval – Manifestation of Intent (MOI)

## Purpose
- When an application is approved, the system must email the applicant with the Manifestation of Intent PDF attached.
- This is implemented via a domain event so feature teams only need to dispatch one line.

---

## Setup

**⚠️ IMPORTANT: The code doesn't work without these steps completed.**

### Step 1: Configure Queue Connection (REQUIRED)

Set the queue connection to synchronous in your `.env` file:

```env
QUEUE_CONNECTION=sync
```

**Why this is required:** The listener implements `ShouldQueue`. Without `QUEUE_CONNECTION=sync`, emails will be queued but won't be processed unless a queue worker is running. In development, synchronous processing ensures immediate sends without requiring a separate worker process.

**⚠️ Critical:** The code will **NOT work** without this setting. Do not use `php artisan queue:work` in local development (see warning in Queues section below).

### Step 2: Add Manifestation of Intent PDF (REQUIRED)

Download the Manifestation of Intent PDF and place it in the following directory:

```
storage/app/app-templates/manifestation_of_intent.pdf
```

**Important:** This file must exist at this exact location. If the PDF is missing, email sends will fail with a missing attachment error.

---

## What's already implemented
- Event: `App\Events\CustomerApplicationApproved`
- Listener: `App\Listeners\SendManifestationOfIntentListener` (queued)
- Mailable: `App\Mail\ManifestationOfIntentMail` (attaches MOI PDF)
- Email view: `resources/views/emails/manifestation_of_intent.blade.php`
- MOI PDF location: `storage/app/app-templates/manifestation_of_intent.pdf`

---

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

---

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

---

## Queues

The listener implements `ShouldQueue`. For local development, **always use** `QUEUE_CONNECTION=sync` (see Step 1 above) to ensure emails are sent immediately without requiring a queue worker.

**⚠️ WARNING:** Do **NOT** run `php artisan queue:work` in local development. Resend limits dev accounts to 100 emails per day, and queued jobs will consume these limited emails unnecessarily. Always use `QUEUE_CONNECTION=sync` instead (see Step 1).

---

## Testing locally (dev-only routes)

- Event-based (queued):
  - `GET /dev/test-approval-mail?to=you@example.com`

These routes are guarded by `app()->environment('local')` and should not be used in production.

**Tip:** You can also visit `/dev/mail-test` for a simple UI form to test email sends.

---

## Troubleshooting

- **403 in Resend logs:** You are sending to a non-owner email without a verified domain.
- **No email:** Verify `.env` values, ensure `QUEUE_CONNECTION=sync` is set, run `php artisan optimize:clear`, and check `storage/logs/laravel.log`.
- **Missing attachment:** Ensure the PDF exists at `storage/app/app-templates/manifestation_of_intent.pdf` (see Step 2 above).

---

## Implementation Changes - PR Feedback

This section documents all changes made based on PR review feedback.

### Overview
**Branch:** `feature/email-approval-moi`  
**Date:** October 31, 2025  
**Status:** ✅ All tests passing

### Changes Implemented

#### ✅ Change 1: Removed Immediate Route
**Request:** "Remove 'Immediate' from docs along with its route."

**Implementation:**
- Removed `/dev/send-mail-now` route from `routes/web.php`
- Removed "Immediate (no queue/CSRF)" documentation
- Removed immediate send form from `/dev/mail-test` UI
- Removed unused imports (`ManifestationOfIntentMail`, `Mail` facade)

**Verification:**
- Route `/dev/send-mail-now` returns 404 Not Found ✅
- Documentation no longer references immediate route ✅
- UI shows only one form (no immediate option) ✅

---

#### ✅ Change 2: Event Route Accepts URL Parameter
**Request:** "Make 'Event-based (queued)' route work by accepting the 'to' URL parameter."

**Implementation:**
- Updated `/dev/test-approval-mail` to accept and validate `to` URL parameter
- Removed hardcoded email fallback (`admin@setupconnect.com`)
- Added parameter validation (shows error if missing)

**Code Changes:**

**Before:**
```php
Route::get('/dev/test-approval-mail', function () {
    CustomerApplicationApproved::dispatch(
        'Test Applicant',
        'admin@setupconnect.com', // Hardcoded
        ...
    );
});
```

**After:**
```php
Route::get('/dev/test-approval-mail', function () {
    $to = request('to');
    if (!$to) {
        return 'Missing recipient (?to=you@example.com)';
    }
    CustomerApplicationApproved::dispatch(
        'Test Applicant',
        $to, // Uses parameter
        ...
    );
});
```

**Verification:**
- Route accepts `?to=email@example.com` parameter ✅
- Route shows error without parameter ✅
- No hardcoded email in code ✅

---

#### ✅ Change 3: QUEUE_CONNECTION=sync as Step 1
**Request:** "Emphasize the importance of 'QUEUE_CONNECTION=sync' by making it step 1, the code doesn't work without that set in .env."

**Implementation:**
- Created new "Setup" section at beginning of documentation
- Made `QUEUE_CONNECTION=sync` the first step (Step 1)
- Added warning: "The code will NOT work without this setting"
- Added critical note about not using `php artisan queue:work`

**Verification:**
- Step 1 is now Queue Connection setup ✅
- Warning about code not working without it ✅
- Clear emphasis on requirement ✅

---

#### ✅ Change 4: MOI File Setup as Step 2
**Request:** "Make downloading and adding the MOI file in the app/app-templates directory an emphasized step 2 instead of just existing in your 'TROUBLESHOOTING' section."

**Implementation:**
- Moved MOI file setup from Troubleshooting to Setup section
- Made it Step 2 (prominently displayed)
- Marked as REQUIRED
- Kept reference in Troubleshooting for quick lookup

**Verification:**
- Step 2 is MOI file setup ✅
- Prominently displayed in Setup section ✅
- Still referenced in Troubleshooting ✅

---

#### ✅ Change 5: Warning About php artisan queue:work
**Request:** "Either remove or add a warning to the 'php artisan queue:work' command so no dev email sends are wasted, there are only 100 per day."

**Implementation:**
- Added prominent warning in Queues section
- Warning mentions 100 email/day limit
- Explicitly states "Do NOT run php artisan queue:work"
- References Step 1 for correct setup

**Verification:**
- Clear warning about queue:work ✅
- Mentions 100 email/day limit ✅
- Directs to correct setup (Step 1) ✅

---

### Code Changes Summary

#### File: `routes/web.php`

**Lines Removed:**
- Route `/dev/send-mail-now` (entire route definition)
- Unused imports: `ManifestationOfIntentMail`, `Mail` facade

**Lines Modified:**
- Route `/dev/test-approval-mail`: Now accepts and validates `to` parameter
- UI form: Removed immediate send option

**Net Change:**
- ~30 lines removed (immediate route + unused code)
- ~10 lines modified (parameter handling)

---

#### File: `docs/EmailApprovalGuide.md`

**Sections Added:**
- New "Setup" section at beginning
- Step 1: Configure Queue Connection (REQUIRED)
- Step 2: Add Manifestation of Intent PDF (REQUIRED)

**Sections Modified:**
- Queues section: Added prominent warning
- Testing section: Removed immediate route reference

**Sections Removed:**
- "Immediate (no queue/CSRF)" route documentation

**Net Change:**
- ~40 lines added (Setup section)
- ~15 lines modified (warnings, emphasis)
- ~5 lines removed (immediate route docs)

---

### Testing Results

All implementation changes have been tested and verified:

| Test | Requirement | Status | Result |
|------|------------|--------|--------|
| TEST 1 | Removed route returns 404 | ✅ PASS | `/dev/send-mail-now` returns 404 |
| TEST 2 | Route accepts parameter | ✅ PASS | Email sent successfully with `?to=` param |
| TEST 3 | Parameter validation | ✅ PASS | Shows error without parameter |
| TEST 4 | UI shows one form | ✅ PASS | Only "Send (Queued)" button visible |
| Documentation | Step 1 & Step 2 correct | ✅ PASS | Setup section properly structured |
| Warning | queue:work warning exists | ✅ PASS | Clear warning with limit mentioned |

---

### Files Changed

```
M  docs/EmailApprovalGuide.md
M  routes/web.php
```

**Total Files Modified:** 2  
**Lines Added:** ~40  
**Lines Removed:** ~35  
**Net Change:** +5 lines

---

### Migration Notes

#### For Developers
1. Ensure `.env` has `QUEUE_CONNECTION=sync` set
2. Ensure MOI PDF exists at `storage/app/app-templates/manifestation_of_intent.pdf`
3. Run `php artisan optimize:clear` after pulling changes

#### Breaking Changes
- ❌ None - Only dev routes were modified

#### Backward Compatibility
- ✅ Fully compatible - No production code affected
- ✅ All existing email functionality unchanged

---

### Review Checklist

- [x] All requirements from PR feedback implemented
- [x] Code follows Laravel best practices
- [x] Documentation updated and clear
- [x] All tests passing
- [x] No breaking changes
- [x] Environment configuration documented

---

## Ownership

This guide documents how feature teams should trigger the MOI email. The mail sending implementation is maintained under the Email Approval feature in this repository.
