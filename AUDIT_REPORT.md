# Gerona Library System Audit Report

Date: 2026-06-02

## Executive Summary

This pass focused on the highest-risk areas found in the Laravel/Inertia codebase: catalog duplication, kiosk scanner lifecycle, report export failures, authorization gaps, auth/test mismatches, and operational indexing. The codebase is compact and mostly convention-following, but several modules had schema/code drift and uneven role protection.

## Issues Fixed

### Catalog Duplication

- `BookController::store()` always created a new master book record, even when ISBN or title/author already existed.
- CSV import deduplicated only by exact title plus ISBN and generated additional copies on repeated imports without accession numbers.
- ISBN and accession values were not normalized consistently.

Fixes:

- Added ISBN normalization.
- Added duplicate lookup by ISBN first, then normalized title/author.
- Reuses/restores existing book records and adds copies instead of creating repeated master records.
- Prevents updates that collide with another book's ISBN or title/author pair.
- Normalizes imported accession numbers.
- For imports without accession numbers, creates only the missing number of copies relative to `copies total`.

Remaining recommendation:

- After cleaning existing duplicate rows, add database-level unique constraints for normalized ISBN and normalized title/author identity. The current migration adds safe indexes only, because strict unique constraints could fail against existing production duplicates.

### QR Kiosk Lifecycle

- Purpose-selection dialog had no expiry and could leave the scanner paused with `isProcessingScan` stuck.
- Resume timers were not tracked, allowing stale callbacks after scanner cleanup.
- Scanner settings were conservative for speed.

Fixes:

- Added a 30-second pending-purpose timeout.
- Added tracked scanner resume timers.
- Clears scanner, modal, pending QR, and timers on unmount or mode switch.
- Improved scanner config with higher FPS and remembered camera.

### Donation And Report Exports

- `DonationsExport` referenced non-existent fields and relationship names: `user`, `donor_name`, `items_donated`, `donation_date`.
- `BooksExport` referenced `published_year` instead of `year_published` and used accessor counts that caused extra queries.
- `CirculationExport` referenced `due_date` instead of `due_at`.

Fixes:

- Donation export now maps the actual `donations` schema and `receiver` relationship.
- Book export now eager-counts total and available copies.
- Circulation export now uses `due_at`.

### Authorization

- Several admin controllers were protected only by `auth` and `verified` route middleware.
- Dashboard and kiosk routes allowed any verified user into privileged surfaces.
- Copy update method existed but had no route.

Fixes:

- Added `role:Librarian` middleware to Dashboard, Donation, Circulation, and BookCopy controllers.
- Added `role:Librarian|Kiosk` middleware to the kiosk dashboard.
- Registered `copies.update`.

Remaining recommendation:

- Decide whether staff self-registration should exist. In a municipal LAN system, seeded/admin-created staff accounts are safer than open `/register` staff accounts.

### Authentication And QA

- `users.username` is required, but the factory and registration flow did not provide it.
- Auth tests posted `email` while the app logs in with `username`.
- Shared Inertia props queried donations globally even though no frontend code used `recentDonations`.

Fixes:

- Added username to user factory, registration validation, registration persistence, and the registration form.
- Updated auth tests to use username.
- Removed unused global `recentDonations` shared prop.

## Database Review

Current strengths:

- Foreign keys exist for major relationships.
- Accession numbers are unique.
- Borrow and return flows use transactions and row locks for copy checkout/return.

Issues and recommendations:

- `books.isbn` has no unique constraint and existing data may already contain duplicates.
- No normalized identity columns exist for duplicate-resistant title/author matching.
- Several high-use filters lacked indexes.
- Soft-deleted `book_copies.accession_number` cannot be reused because the unique index includes soft-deleted rows; this is usually good for auditability, but it should be intentional.

Implemented:

- Added operational indexes for books, book copies, borrow transactions, visitor logs, and donations.

## Security Report

Fixed:

- Missing role middleware on key admin modules.
- Global donation data exposure through Inertia shared props.
- Username registration/schema mismatch.

Remaining risks:

- Open staff registration should be reviewed or disabled.
- Public print active-visitors endpoint exposes active visitor names to unauthenticated users.
- File upload allows large documents and office formats; keep storage private and consider antivirus scanning before production.
- Export endpoints load entire datasets into memory; this is acceptable for small LAN data but should use queued/chunked exports for large archives.

## Functional Bug Report

Fixed:

- Repeated catalog book creation.
- Repeated import copy creation when rows lack accession numbers.
- Donation export failure.
- Book and circulation report field mismatches.
- Kiosk purpose modal stale state.
- Copy update route missing.
- Auth registration failed against current schema.

Remaining:

- Add feature tests for catalog duplicate prevention, donation export, and kiosk smart-scan state transitions.
- Consider a duplicate cleanup command for existing production records.

## Performance Report

Fixed:

- Added operational indexes for frequent filters and reports.
- Reduced export N+1 risk in book copy counts.
- Removed unused global donation query from every Inertia response.

Remaining:

- Dashboard circulation chart runs separate count queries per day; consolidate with grouped aggregate queries for larger data.
- Export classes still materialize all rows; use query/chunk exports for large datasets.
- Frontend build warns about large chunks; code-split large public/home/dashboard assets.

## Refactoring Summary

- Added catalog normalization helpers.
- Centralized generated copy creation in `BookController`.
- Tightened copy validation.
- Aligned auth UI, backend validation, factory, and tests.
- Added explicit controller middleware for sensitive modules.

## Production Readiness Score

- Security: 7/10
- Maintainability: 7/10
- Scalability: 6/10
- Reliability: 7/10
- Performance: 6/10
- Code Quality: 7/10

Overall: 6.8/10. The system is viable for controlled LAN use after these fixes, but should complete duplicate cleanup, staff registration policy, export chunking, and focused feature tests before broader production deployment.

## Verification

- `php artisan test`: 25 passed, 61 assertions.
- `npm run build`: passed. Vite still reports large chunk warnings and an upstream `lottie-web` eval warning.
