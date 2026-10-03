# Manual end-to-end checklist — Account module

A repeatable version of the six tester rounds ([`tester-prompts.md`](tester-prompts.md)), for running the Account module and the own profile on an Android emulator or phone. It combines round 1's full pass, round 4's launch states and round 5's smoke pass, with the expected results updated to the behaviour the last rounds confirmed. Expected wording is quoted from the prompts and reports; where a screen is specified, [`docs/prototype/M1-account.md`](../../prototype/M1-account.md) is the reference.

Record each row as PASS, FAIL or NOT RUN, with a screenshot name for every FAIL. The last full run of this content was round 5 (2026-10-03) plus round 6 for three rows; see [`README.md`](README.md).

## 0. Setup

1. `git status` clean, on the commit to test; note `git log --oneline -1`, `node -v`, `npm -v`.
2. Backend (`backend/`): `.env` from `.env.example` with real keys; `PUBLIC_BASE_URL=http://10.0.2.2:3000` so the emulator can open the email links. Then `npm ci`, `npx prisma generate`, `npx prisma migrate deploy`, `npx prisma db seed` (local database only: the seed empties every table). Start the API and keep its console visible: SMS codes and email links are printed there as `[Mock SMS] for <phone>: <code>` and `[Mock Email] for <address>: <link>`.
3. Mobile (`mobile/`): `npm ci`; `mobile/.env` `EXPO_PUBLIC_API_URL=http://10.0.2.2:3000`; a development build installed (rebuild with `npx expo prebuild --clean --platform android` and `npx expo run:android` when `app.json` or a native package changed); `npx expo start --dev-client --clear`. After any reload, force-stop and reopen the app.
4. Use an emulator image **with Google Play** (Firebase phone verification fails without it, E2E-41). Check at 360 dp (`adb shell wm density 480`, reset with `adb shell wm density reset`) and at the default width; note the width on every result.
5. Firebase test numbers, the ONLY numbers to use for anything that sends an SMS: **+94 77 000 0091 code 111222** and **+94 77 000 0092 code 333444**. Seeded accounts (password `Password123!`): +94770000001 Amal Perera (worker, verified email, active engagement), +94770000002 Kamal Silva (employer, Business), +94770000003 Sunil Teacher (verifier), +94770000005 Nimali Fernando (worker), +94770000006 Dilrukshi Herath (employer, Individual).
6. Reseed (`npx prisma db seed`) before a full run and after destructive checks.

## A. First run and registration

| # | Check | Expected |
| --- | --- | --- |
| A1 | Clear app data, launch | Splash (blue, mark, then wordmark under it, about 2 s), then three onboarding cards with pager dots; Skip on cards 1 and 2, "Create account" on card 3, both reach role selection; force-stop mid-cards → cards again |
| A2 | Role selection → phone step | "Step N of 4" (employer "of 5"); +94 fixed, 9 digits only, typed digits grouped "77 123 4567"; back chevron one step back, ✕ to role selection, hardware Back like the chevron |
| A3 | Phone +94770000001 | "This number is already registered. Log in instead — you can reset your password from there." under the field |
| A4 | Phone 0091 → code step | Wrong code: "That code doesn't match. Check the 6 digits and try again." on all six boxes; resend countdown 30 s then "Resend code"; "Change number" returns to the phone step; paste of six digits and Backspace work; any box opens the keyboard |
| A5 | Details step validations | Password 8 to 64 ("Password must be 8 to 64 characters."); confirm must match; email optional, format checked, an address on another account refused; NIC 12 digits or 9 + V/X; an existing NIC → "This NIC is already registered. You can log in instead, or check the number for a typo."; under 18 → "YouthLink is for people aged 18 and over. Please check your birthdate is right."; legal name "N / 100" counter from 90; errors clear as soon as the field is edited |
| A6 | Terms unticked → Create account | Button stays enabled; "Please accept the Terms of Service and Privacy Policy to continue."; the underlined links open Terms & Privacy (1.20) and Back returns with the form intact |
| A7 | Keyboard on step 4 at 360 dp | Focus Password, Email, NIC, Birthdate, Legal name in turn: each field and its helper or counter fully visible above the pinned "Create account" bar (E2E-48) |
| A8 | Create account (worker) | Signed in, lands on the home shell (not a login screen); database: phone verified time set, NIC stored as ciphertext, email lower-cased, a confirmation link printed if an email was given |
| A9 | Employer registration (after deleting the first test account, or with 0092) | Step 5: Individual/Household or Business; Business needs a name (≤100), bio optional (≤300); Continue saves and enters the app |
| A10 | Verifier registration | Completes; profile reads "Community Verifier" |

## B. Login and session

| # | Check | Expected |
| --- | --- | --- |
| B1 | Password login, each role | Home shell (an employer opens on My postings once the posting module's screens are present) |
| B2 | Wrong password; unregistered number | "We couldn't log you in with those details. Check your number and password, or reset your password." for both |
| B3 | Five wrong passwords on one account, phone not edited | 1–2: plain message; 3rd: "2 attempts left before password login is paused for 15 minutes." and Log in stays active (E2E-50); 5th: "Too many attempts — password login is paused for 15 minutes. You can log in with a code instead." with Log in disabled; editing the number re-enables it; the right password is refused while paused |
| B4 | Code login on the paused account (Firebase number) | Works and clears the pause; wrong code (999999) with the keyboard open: the whole error line visible above the bar |
| B5 | Suspend a seeded account in the database (`accountStatus='SUSPENDED'`, `suspendedAt=now()`) while it is signed in | Its next request returns it to Log in; both login paths show the suspended message naming the other path; fields disabled, a back chevron; restore afterwards |
| B6 | Change the signed-in account's password elsewhere (another device or a reset) | Next request → Log in with "You were signed out — your session ended, or your password was changed on another device…", number remembered |
| B7 | Kill and relaunch while signed in; airplane mode then log in | Session restored; offline: a readable message, no crash, no raw error |

## C. Forgot password and recovery

| # | Check | Expected |
| --- | --- | --- |
| C1 | Log in → "Forgot password?" for Amal and for an account without email | Amal: "Email me a link" with a masked address; otherwise "No verified email on this account" and "Neither of these works for me"; choosing email changes the button to "Send reset link" |
| C2 | SMS reset | Code from the console; new password; lands on Log in; old password fails; 5 wrong codes → limited |
| C3 | Email reset | Console link opened in Chrome (`adb shell am start -a android.intent.action.VIEW -d "<link>"`): set the password; opening the link again: "Link no longer valid" with no form |
| C4 | Recovery | "Neither of these works for me" → NIC, birthdate, legal name of a seeded account → "Request received…"; reopen the app: still pending; `node prisma/review-recovery.js list`, then `approve` → "Your account has been recovered. Set a new password to finish." → set it → log in; a second request with `reject` → rejected state; another install cannot see the outcome |

## D. Settings (Home → Profile tab → Settings)

| # | Check | Expected |
| --- | --- | --- |
| D1 | Rows per role | SECURITY Change password; CONTACT Phone, NIC "•••• 1234", Email or "Add email", Display name, and for employers Business name & bio (Business only) and Posting as; NOTIFICATIONS; SUPPORT Help; ACCOUNT Sign out, Delete account in red. Rows whose screen is in another module show "This isn't available in this version of the app yet." |
| D2 | Sign out | Dialog "Sign out of YouthLink?" with Cancel / Sign out, whole screen dimmed (status bar too); afterwards Log in with the number remembered; other devices stay signed in |
| D3 | Change password | Wrong current: "That password doesn't match your account. Please try again." under the field (not a sign-out); success keeps this device signed in and ends other sessions; "Forgotten your current password?" → reset by email (1.11r1–r4): sent screen reads "We've sent a reset link to" then the address and full stop on the next line (E2E-49); without a verified email it offers "Add an email" |
| D4 | Phone change to 0092 | Wrong password → field error; a registered number refused; success → "Phone number updated" in-app card with "Done" |
| D5 | NIC | Save disabled until typed; bad shape refused; another account's NIC → "This NIC is already registered to another account. Check the number for a typo."; own new NIC → Settings shows the new last four |
| D6 | Email | Pending screen with "Cancel this change"; old address stays active; console link → Settings shows the new address on return; an address on another account → "This email is already on another account. Try a different address."; a cancelled link stops working |
| D7 | Display name | 100-character cap with counter; Settings and profile show the new name at once |
| D8 | Business name & bio, Posting as (employer) | Business needs a name; back to Individual clears name and bio; the profile shows the business name for Business |
| D9 | Font scale 2.0 | Settings labels readable, values end with "…", chevrons visible |

## E. Own profile

| # | Check | Expected |
| --- | --- | --- |
| E1 | Worker without history (a new account) | "New to YouthLink", add-bio link, ENDORSEMENTS with the empty note, "My endorsement code" and "Settings" rows |
| E2 | Amal | Stars, "N% completion · M jobs" equal to the database (average over revealed, unremoved ratings; completion weighted, late cancellation 2.0) |
| E3 | Employers | Business name for Kamal; "1 engagement completed" singular / "N engagements completed", counting COMPLETED and ENDED |
| E4 | Sunil | "Community Verifier", "Vouching since <month year> · N endorsed" |
| E5 | Every profile | "Phone verified"; nothing implying the NIC was verified; the tab bar for the role with Profile active |

## F. Deletion (last; reseed afterwards)

| # | Check | Expected |
| --- | --- | --- |
| F1 | Amal (active engagement) | The screen names the engagement; the button is disabled |
| F2 | A throwaway account | Password step with the red "Delete my account" pinned in a bar, 24 dp above the keyboard, disabled until typed; wrong password → field error; success → "Account deleted" with no header and only "Back to the start"; hardware Back does nothing; reopen → role selection |
| F3 | Database after F2 | Phone, email, NIC, legal name, birthdate and password overwritten, `accountStatus` DELETED, ratings and engagements still present; the old token rejected; the number can register again |

## G. Launch states (force-stop before each relaunch)

| # | Starting situation | Expected |
| --- | --- | --- |
| G1 | Fresh install, never signed in | Splash → onboarding card 1 |
| G2 | Skipped onboarding, reopen | Splash → role selection |
| G3 | Signed in | Splash → home shell |
| G4 | Signed out from Settings | Log in with the number filled in ("Log in to pick up where you left off.") |
| G5 | Changed phone, then signed out | Log in shows the new number |
| G6 | Session ended by the server | Log in with the number; the notice only the first time |
| G7 | Account deleted | Role selection, not Log in and not the cards |
| G8 | Account A signs out, then B signs in and out | Log in shows B's number |
| G9 | Log in → hardware Back | Leaves the app, never a blank screen |

## H. Cross-cutting and security (API, from a terminal)

| # | Check | Expected |
| --- | --- | --- |
| H1 | Every signed-in route without a token (`/api/account/me`, `/api/profiles/me`, every `requireAuth` route in `account.routes.js`) | 401 |
| H2 | Any response | Never contains `passwordHash` or `nicEncrypted` |
| H3 | `POST /api/account/check-availability` 31 times in a minute | 30 succeed, then 429 "Too many checks. Wait a minute and try again." |
| H4 | `node scripts/check-docs.mjs`, reseed twice | Both clean |

## Not covered by this checklist

SMS autofill and TalkBack (need a real phone; E2E-45 is still open for that reason); iOS; anything on the Admin dashboard.
