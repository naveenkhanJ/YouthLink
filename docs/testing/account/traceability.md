# Requirement traceability — Account Management and own profile

For each requirement of the module, every acceptance criterion in [`docs/requirements.md`](../../requirements.md) (including the criteria added by dated amendments), and where it was tested:

- **E2E** — the manual end-to-end rounds on the Android emulator ([`README.md`](README.md) §3). `R1 B3` means round 1, item B3 of [`e2e-report-2026-10-02.md`](e2e-reports/e2e-report-2026-10-02.md); `R2 3A` is item 3A of the round 2 report; `R5 B2` is Part B item B2 of the round 5 (final) report. Findings are E2E-nn.
- **Unit** — the Jest unit tests in `backend/src/modules/account/test/` and `backend/src/modules/profile/test/` ([`README.md`](README.md) §6), named by file (`account.login` = `account.login.test.js`).
- **API** — the database-backed suite `account.api.integration.test.js` ([`README.md`](README.md) §7), named by its `describe` block.

A criterion that concerns a screen (what is shown, highlighted, reachable) can only be checked on the device, so its automated column says so. "Not tested" means exactly that.

Written 4 October 2026, against `develop` `4433ba9` plus the test commits on `feature/account-management-afham`.

## FR-ACC-01 — Account registration

| Acceptance criterion | E2E | Automated |
| --- | --- | --- |
| Phone OTP not verified → account cannot be created | R2 3A, R5 B2 (Firebase test numbers) | Unit `account.register` (token Firebase rejects → 401, nothing created); API registration ("a phone that did not pass verification cannot register") |
| Under 18 → declined | R2 3A, R5 B2 | Unit `account.register` (one day short of 18 refused, 18 today accepted); API registration (under 18, nothing stored) |
| Terms checkbox unchecked → blocked | R2 3A, R5 B2 | Unit `account.register` (refused before the phone is checked) |
| Email given but not confirmed → unverified, registration not blocked | R2 3A, R1 A7 | API registration (created with `emailVerified: false`; link confirms once, then dead) |
| One atomic submission → exactly one ACTIVE `User` row | R2 3A, R2 3B | Unit `account.register` (fields stored, ACTIVE); API registration (row, phone verified, terms time, NIC ciphertext, bcrypt) |
| Amendment E3: legal name blocked at 100 characters | R1 A4 (server), R5 A1, R6 C1 (99 characters, counter) | Unit `account.register` (100 accepted, 101 refused) |
| Amendment E4: the app's own 5-minute window on Firebase codes | R2 3A (code step) | Not automated (a mobile-app timer); the server's 10-minute token-age check is not reachable with the stand-in |

## FR-ACC-02 — Employer posting-as type

| Acceptance criterion | E2E | Automated |
| --- | --- | --- |
| Business → business name required, bio available | R2 3B, R5 B2 | Unit `account.register` (an employer starts as Individual); API Settings (Business needs a name, bio capped at 300) |
| Individual/Household → neither field shown or required | R2 3B, R5 B2 | API Settings (Individual accepted with no name) |
| Switch in Settings: Business adds the fields; switching back removes them from display | R1 D8, R5 B5 | API Settings (back to Individual clears name and bio; profile shows the legal name, then the business name again) |

## FR-ACC-03 — Age gate

| Acceptance criterion | E2E | Automated |
| --- | --- | --- |
| Under 18 → declined, no exception or override | R2 3A, R5 B2 | Unit `account.register` (boundary: one day short refused); API registration |

## FR-ACC-04 — NIC field handling

| Acceptance criterion | E2E | Automated |
| --- | --- | --- |
| No external verification call on the NIC | Not observable on the device | Not asserted by a test. By reading the code: `register()` passes the NIC only to `encryptNic`/`getNicLast4` and to the duplicate lookup in the database |
| The age gate uses only the birthdate, never the NIC | R2 3A | Unit `account.register` ("one day short of 18" is refused although its NIC `200012345678` implies a birth year of 2000) |
| Amendment A1: shape 12 digits, or 9 digits and V/X (case-insensitive); the normalised value stored | R1 D5, R2 3A, R5 B5 | Unit `account.register` (accepted and refused shapes); unit `account.nicCrypto` (normalised, stored as ciphertext); API Settings (NIC correction) |

## FR-ACC-05 — Duplicate account prevention

| Acceptance criterion | E2E | Automated |
| --- | --- | --- |
| An NIC, verified phone or verified email already on an account → blocked for that field | R1 A2, R2 3A, R5 B2 | Unit `account.register` (each of the three, field-level 409); unit `account.nicCrypto` (deterministic ciphertext, case-insensitive); API registration (each of the three, lower-case `v`, and the partial unique index refusing a duplicate NIC when the service is bypassed) |
| Amendment E1: a taken phone is reported at entry, before an SMS | R1 A2 | API registration (availability check reports a taken phone and email) |
| Amendment E2: a taken email is reported at entry | R2 3A (E2E-30 copy) | API registration (availability check) |

## FR-ACC-06 — Incomplete signup expiry

Superseded by FR-ACC-08's 2026-08-15 amendment and FR-ACC-01's atomic registration: no row exists before the account is complete, so there is nothing to expire (amendment of 2026-08-17). **Not tested, by design.**

## FR-ACC-07 — Login

| Acceptance criterion | E2E | Automated |
| --- | --- | --- |
| Forgotten password → code login works without it | R1 B4, R5 B3 | Unit `account.login` (code login, including during a lockout); API login (code login lifts the pause) |
| SMS failing → password login works regardless | R1 B1, R5 B3 | Unit `account.login`; API login |
| Amendment A32: 30-day tokens; one redirect to login for expiry, password change and suspension (`SESSION_ENDED`) | R1 B5, B6 (E2E-02), R2 §2, R4 §3 (launch state 7), R5 B3 | Unit `account.session` (30 days; forged and expired refused; every ending answers `SESSION_ENDED`); API login and password change |

## FR-ACC-08 — OTP mechanism

| Acceptance criterion | E2E | Automated |
| --- | --- | --- |
| System-generated code (phone change, reset, admin login) expires after 5 minutes | Not tested by waiting | Unit `account.reset` (codes stored with a 5-minute expiry; only an unexpired code matches). The expiry is checked as the stored time and the query's condition, not by letting 5 minutes pass |
| A used system code is rejected the second time | R1 C3 (single-use link) | Unit `account.reset` (conditional update matches once); API password reset (the same SMS code refused the second time) |
| Firebase ID token → phone verified only after server-side validation | R2 3A, 3C, R5 B2, B3 | Unit `account.register`, `account.login` (rejected token → 401); API registration. The real Firebase verification itself is exercised only on the device |

## FR-ACC-09 — Password security

| Acceptance criterion | E2E | Automated |
| --- | --- | --- |
| 5 consecutive failures → password path blocked 15 minutes | R1 B3, R5 B3, R6 C3 | Unit `account.login` (5th → 423, 15 minutes, refused while paused, fresh count after); API login (real database; open sessions unaffected; the decision waits on the row lock) |
| No plaintext or reversible password in the database | R1 A7 | Unit `account.passwordHash` (bcrypt cost 12, salted); API registration (stored hash) and security (no hash in any response) |
| Added: remaining attempts shown | R5 B3, R6 C3 (E2E-50) | Unit `account.login` (shown at 2 and 1 left, where amendment E6 and frame 1.6bnr2 place it) |
| Added: the lockout message names the code path | R5 B3 | Unit `account.login` (exact message) |
| 8 to 64 characters, spaces allowed | R1 D3, R2 §3 | Unit `account.register` (7 and 65 refused, 8 and 64 with spaces accepted); unit `account.passwordHash` (spaces kept) |

## FR-ACC-10 — Password reset

| Acceptance criterion | E2E | Automated |
| --- | --- | --- |
| Working phone → code reset available | R1 C2, R5 B4 | Unit `account.reset`; API password reset (SMS end to end, old sessions ended) |
| Verified email → email link available | R1 C3, R5 B4 | Unit `account.reset` (masked address, link stored as a hash, 15 minutes); API password reset (form once, then "Link no longer valid") |
| Neither reachable → no automated path succeeds | R1 C1 | Unit `account.reset` (no channel offered, nothing sent) |
| Added: identity details submitted for review | R2 §2 (E2E-01), R5 B4 | API recovery (request, pending, approved, used, rejected, device isolation) |
| Added: a Moderator or Admin reviews the case queue | — | **Not built.** The Admin dashboard queue is out of this module's scope (YL-176 user side only); `node backend/prisma/review-recovery.js` stands in, and the API suite does what it does |
| Amendments A3/A5: a reset ends every earlier session | R1 C4, R2 §2 (E2E-02) | Unit `account.session` (older token refused); API password reset |

## FR-ACC-11 — Password change

| Acceptance criterion | E2E | Automated |
| --- | --- | --- |
| Correct current password → updated immediately | R1 D3, R5 B5 | API password change (this device stays in, every other session ended, old password dead); unit `account.session` |
| Behaviour beyond the criterion: a wrong current password is a field error, not a sign-out; attempts are limited | R1 D3 | API password change (400 field error, 429 on the 6th) |

## FR-ACC-12 — Phone number change

| Acceptance criterion | E2E | Automated |
| --- | --- | --- |
| No password re-entry → blocked | R2 3C | API Settings (wrong password → field error) |
| New number not yet verified → old number still holds the uniqueness slot | R2 3C | Partly: API Settings (a number already registered is refused, and the old number works until the change). The "not yet verified" state lives in the app and Firebase and cannot be produced with the token stand-in |
| Verified → swap is atomic, old number released | R2 3C, R5 B5 | API Settings (old number no longer logs in, new one does). Atomicity is a single `UPDATE`; it is not separately raced |

## FR-ACC-13 — NIC correction

| Acceptance criterion | E2E | Automated |
| --- | --- | --- |
| NIC + password → updated immediately, no further verification | R1 D5, R5 B5 | API Settings (needs the password, refuses another account's NIC, updates the last four) |

## FR-ACC-14 — Email add/change

| Acceptance criterion | E2E | Automated |
| --- | --- | --- |
| Link not clicked → the old email stays the active recovery channel | R1 D6, R5 B5 | API Settings (old address kept, pending shown) |
| Link clicked → the new email replaces the old, verified | R1 D6, R2 §2 (E2E-05), R5 B5 | API Settings (replaced and verified; a cancelled link dead; an address on another account refused) |

## FR-ACC-15 — Display name editing

| Acceptance criterion | E2E | Automated |
| --- | --- | --- |
| Within 100 characters → reflected everywhere it is shown | R1 D7, R5 B5 | API Settings (100-character limit; the profile shows the new name at once). Other modules' surfaces read the same column; they are not part of this suite |

## FR-ACC-16 — Posting-as type change

| Acceptance criterion | E2E | Automated |
| --- | --- | --- |
| Change saved → future postings use the new type, existing postings unchanged | R1 D8 (account side) | API Settings (the account changes). The posting side belongs to the Gig Posting module and is not tested here |

## FR-ACC-17 — Account deletion

| Acceptance criterion | E2E | Automated |
| --- | --- | --- |
| An active engagement → deletion blocked | R1 D9, R5 B6 | API deletion (blocked, engagement named, nothing changed) |
| No active engagement + password → identifying data removed, ratings and engagements kept under an anonymised reference | R1 D9, R2 3D, R5 B6 | API deletion (anonymised columns including the birthdate, ratings and engagements counted before and after, token rejected, the number and NIC can register again) |

## FR-ACC-18 — Unified Settings screen

| Acceptance criterion | E2E | Automated |
| --- | --- | --- |
| Password, contact details, notification preferences, posting-as (Employer) and deletion reachable from one screen | R1 D1, R5 B5 | Screen only: not automated. (Notification preferences belong to another module and show a "not available" message.) |

## FR-ACC-19 — Terms of Service and Privacy Policy acceptance

| Acceptance criterion | E2E | Automated |
| --- | --- | --- |
| Unchecked → registration blocked, checkbox highlighted | R2 3A, R5 B2 | Unit `account.register` (blocked). The highlighting is screen only |

## FR-PROF-01 — Profile display identity

| Acceptance criterion | E2E | Automated |
| --- | --- | --- |
| Identity shown as the full legal name (or as edited), never a handle | R1 E1–E6, R5 B8 (own profile) | Unit `profile.ownProfile`; API profile and Settings. Other people's profiles (1.19, applicant lists) belong to other modules and are not tested here |

## FR-PROF-02 — Verification badges

| Acceptance criterion | E2E | Automated |
| --- | --- | --- |
| "Phone verified" on every profile | R1 E5, R5 B8 | Unit `profile.ownProfile`; API profile |
| Business employer → business name shown | R1 E3, R5 B8 | Unit `profile.ownProfile`; API Settings (profile shows the business name) |
| No badge or label implies NIC verification | R1 E5, R5 B8 | Unit `profile.ownProfile` and API profile (no NIC field in the profile at all) |

## FR-PROF-06 — Trust-signal display on profile

| Acceptance criterion | E2E | Automated |
| --- | --- | --- |
| Rated history → average rating and completion rate shown | R1 E2, E3, R5 B8 | Unit `profile.ownProfile` (prototype 1.18n 92% and 1.18nc 80%, revealed ratings only); API profile (compared with SQL over the tables) |
| Zero history with an active endorsement → "New to YouthLink" and the endorsement badge | R1 E1, R5 B8 | Unit `profile.ownProfile` (zero-history tier; endorsement and endorser returned). The wording and badge are screen only |

## Gaps, in one place

- **Device-only behaviour** is covered only by the manual rounds: every screen, copy, layout, keyboard and navigation check, and the app's own 5-minute code window (FR-ACC-01 E4).
- **Real Firebase verification** is covered only by the manual rounds, with Firebase test numbers.
- **The 5-minute expiry of system codes** is checked as the stored expiry and the query condition, not by waiting 5 minutes.
- **The Admin review queue** for recovery is not built (`review-recovery.js` stands in).
- **Other modules' surfaces** (other people's profiles, postings showing the posting type) are not tested here.
- **E2E-45** (the resend countdown in the accessibility tree) is the one finding still open; it needs TalkBack on a real phone.
