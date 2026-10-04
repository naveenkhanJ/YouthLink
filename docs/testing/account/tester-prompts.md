# Tester prompts — Account module end-to-end rounds

These are the six instructions given to the tester agent, one per round, in the order they were sent. Each round's report is in [`e2e-reports/`](e2e-reports/); [`README.md`](README.md) explains the method and maps rounds to reports.

The text below is verbatim as sent. The only edit is the six round headings: the original file marked the rounds `# 1` to `# 6`; they are now named and dated so the file reads on its own. File names mentioned inside the prompts (for example `11648293-e2e-report-2026-10-02.md`) are the names the reports had on the developer's machine at the time; the same reports are stored here without the upload prefix.

## Round 1 — first full end-to-end run (2026-10-01/02)

You are testing a university group project end to end, on a real Android emulator, and reporting what is broken. You are a TESTER, not a developer: do not fix bugs, do not refactor, do not "tidy up". Find problems, prove them, and write them down precisely so another engineer can fix them.

## Hard rules

- Read /AGENTS.md and /CONTRIBUTING.md first and obey them. Specifically: do NOT run `git commit`, `git push`, `git checkout`, `git merge`, `git reset` or any state-changing git command. Read-only git (`status`, `diff`, `log`) is fine.
- Do NOT change source files. The only files you may create are: scratch scripts outside the repo, screenshots, and the final report file named below. If an environment problem blocks you (missing .env value, emulator not booting, a dev build that needs rebuilding), fix the ENVIRONMENT and say so in the report; do not edit tracked code to get past it. If it truly cannot be solved without a code or dependency change, record it as a blocker and move on to what you can test.
- `backend/prisma/seed.js` is DESTRUCTIVE (it empties every table). Run it only against the local database on this machine. Never point it at a remote database.
- Never put real secrets into a tracked file. Never paste secrets into your report.
- Ask the developer a question only if you are completely blocked. Otherwise keep going and note assumptions.

## What the project is

YouthLink: a mobile platform connecting Sri Lankan youth job-seekers with verified local gigs. Three surfaces: `backend/` (Node.js + Express, ES modules, PostgreSQL via Prisma 7), `mobile/` (React Native / Expo, Android only, needs a development build, started with `npx expo start --dev-client`), `dashboard/` (React + Vite, NOT in scope). Four students own four modules; you are testing ONE person's work only: the Account Management module plus the shared foundation and the minimal own-profile slice. Other modules (posting, discovery, applying, engagement, rating, endorsement, notification) are mostly stubs on this branch: do NOT report their absence as bugs.

Read these before testing (they are the specification):

- docs/requirements.md (FR-ACC-01..19, FR-PROF-01/02/06, with Given/When/Then acceptance criteria and dated amendment notes under each)
- docs/prototype/M1-account.md (every account screen: structure, exact copy, states). docs/prototype/design-system.md (tokens/components). docs/prototype/README.md (how to read a screen).
- docs/decisions.md (why odd-looking things are the way they are)
- mobile/README.md and backend/README.md (how to run things)
  The Figma file (if you have Figma MCP access) is fileKey 9gIi2H8L0QDQps3T8oinPC, page "Screens / M1 Account" (node 9:12). NEVER open the frozen V1 file (Qc7GxrGETFPSnW94J0Zhzo). The written prototype in docs/prototype/ is derived from Figma and is the primary reference for copy and layout.

## Setup (do this first, and record exactly what you did)

1. Check you are on the `develop` branch up to date with origin (read-only: `git status`, `git log -3`). Note the commit hash in your report.
2. Backend: `cd backend`, ensure `.env` exists (copy from `.env.example` if not; the NIC encryption keys, JWT secret and Firebase service-account path must be set; PUBLIC_BASE_URL must be reachable from the emulator, i.e. use http://10.0.2.2:<port> for the emulator's view of your machine), `npm install`, `npx prisma generate`, `npx prisma migrate deploy`, then `npx prisma db seed` (local DB only). Start the server and KEEP ITS CONSOLE VISIBLE and logged to a file: in development, SMS codes and email links are NOT delivered anywhere; they are printed to the server console as `[Mock SMS] for <phone>: <code>` and `[Mock Email] for <address>: <link>`.
3. Mobile: `cd mobile`, `npm install`, set `mobile/.env` `EXPO_PUBLIC_API_URL=http://10.0.2.2:<backend port>`, make sure the development build APK is installed on the emulator (see mobile/README.md), start `npx expo start --dev-client`, and launch the app. After every code reload, force-stop and relaunch the app so you are really testing current code.
4. Firebase phone auth: signup, code login and phone change use Firebase Phone Authentication, which cannot deliver a real SMS to an emulator. Check whether Firebase "test phone numbers" are configured (look in the Firebase console notes in mobile/README.md or ask the developer ONCE which numbers/codes are configured). If none are, you cannot complete those three flows: test everything else, and report the three as BLOCKED (environment), with exactly what is missing.
5. Seeded accounts (password for all: `Password123!`): +94770000001 Amal Perera (worker), +94770000002 Kamal Silva (employer), +94770000003 Sunil Teacher (verifier), +94770000005 Nimali Fernando (worker), +94770000006 Dilrukshi Herath (employer). Read backend/prisma/seed.js for their data: it includes one ACTIVE engagement (which must block account deletion) and ended engagements with revealed ratings.
   Take a screenshot of every screen you visit (adb exec-out screencap), name files like `M1-1.4-details-empty.png`, and keep them in a folder outside the repo (e.g. ~/e2e-screens).

## What to test

For EVERY item: perform it in the app on the emulator (not only with curl), compare what you see with the spec, and also check the backend console/logs and, where useful, the database (psql or `npx prisma studio`). Record PASS / FAIL / BLOCKED with evidence. Also check UI conformance for every screen against docs/prototype/M1-account.md: exact copy (typos, wording), field order, button labels and enabled/disabled states, error text and where it appears (a failed field is drawn as a red-bordered field with its message in a separate line beneath it), spacing and colours looking like the design (brand blue #0f3d91, grey backgrounds, 8px radii), nothing clipped, keyboard not covering the focused field or the button, back button and Android hardware back behaving sensibly, long text not overflowing, no raw error strings like "[auth/invalid-verification-code]" or "Network request failed" or stack traces shown to the user, loading states present while waiting.

### A. Registration (FR-ACC-01/03/04/05/08/19) — screens 1.1 to 1.4, 1.20, error frames

- Worker, employer and verifier paths. Step counter reads "Step N of 4" (employer "of 5"). Back chevron goes one step back; the close (X) returns to role selection; the hardware back key does the same as the chevron.
- Phone step: only 9 digits accepted, +94 fixed. An already-registered number (use +94770000001) shows "This number is already registered. Log in instead — you can reset your password from there." under the field.
- Code step (Firebase): wrong code shows "That code doesn't match. Check the 6 digits and try again."; resend countdown (30s) then "Resend code"; "Change number" returns to phone entry; an old code must not work after changing the number.
- Details step: password 8–64 characters (spaces allowed), confirm must match; email optional, format checked, a verified-elsewhere address is refused; NIC shape check (12 digits, or 9 digits + V/X), NIC already registered shows "This NIC is already registered. You can log in instead, or check the number for a typo."; birthdate must be a real date and 18+ ("YouthLink is for people aged 18 and over. Please check your birthdate is right."); legal name up to 100 characters with an "N / 100" counter from 90; the Terms/Privacy checkbox: "Create account" stays enabled when unticked and then shows "Please accept the Terms of Service and Privacy Policy to continue."; the underlined "Terms of Service"/"Privacy Policy" open the Terms & Privacy screen (1.20) and back returns with the form intact.
- After "Create account" the person is signed in and lands in the app's home shell (not a login screen). Employer then sees step 5 (1.5/1.5b): Individual/Household vs Business, Business reveals business name (required, ≤100) and optional bio (≤300), "Continue" saves and enters the app.
- Check the database after registration: phone verified timestamp set, NIC stored encrypted (never plaintext), email stored lower-cased, an email-confirmation link printed in the server console if an email was given.

### B. Login, session, lockout (FR-ACC-07/08/09) — screens 1.6 family, 1.7 family

- Password login success → home shell. Wrong password → "We couldn't log you in with those details. Check your number and password, or reset your password." Same message for an unregistered number (no enumeration).
- Lockout: 5 consecutive wrong passwords on one account → "Too many attempts — password login is paused for 15 minutes. You can log in with a code instead." The warning "N attempts left before password login is paused for 15 minutes." appears only when 2 or fewer remain. A correct password during lockout is still refused; code login (Firebase) still works and clears the lockout.
- Code login (needs Firebase test numbers): success, wrong/expired code messages.
- Suspended account: in the DB set `accountStatus='SUSPENDED'` (and `suspendedAt=now()`) for a seeded user → login on both paths shows the suspended message naming the other path; a suspended person already signed in is rejected on their very next request and sent to the login screen. Restore the account afterwards.
- Session end: sign in on the emulator, then change that account's password (via Settings flow, or via the reset flow from a second client such as curl) → the emulator app must be signed out on its next request and show the login screen with the "You were signed out — your session ended, or your password was changed on another device…" notice, and no back chevron.
- Kill and relaunch the app while signed in: the session must be restored. Turn off the emulator's network (airplane mode) and attempt a login: a readable offline message, no crash, no raw error.

### C. Forgot password and account recovery (FR-ACC-10) — screens 1.8 family, 1.9, 1.8rec1–4

- From login "Forgot password?": options "Text me a code" / "Email me a link". An account with a verified email shows the email option (the address is shown MASKED, e.g. k**\***@example.com, a deliberate deviation); one without shows "No verified email on this account" and the link "Neither of these works for me".
- SMS path: take the code from the server console, enter it, set a new password (8–64), you land on login; the old password no longer works; wrong code = "That code doesn't match…"; after 5 wrong codes in 15 minutes it is rate limited.
- Email path: the link printed in the console opens a minimal web page in the emulator's browser (use `adb shell am start -a android.intent.action.VIEW -d "<link with 10.0.2.2>"` or paste it in Chrome). Set a new password there; reusing the same link must fail; it must be single-use.
- Setting a new password signs out every other session.
- Account recovery (neither channel works): submit NIC + birthdate + legal name matching a seeded account → "Request received…" screen; close and reopen the app: the status screen still shows pending. From `backend/` run `node prisma/review-recovery.js list`, then `approve`: within ~30 s (or on app foreground) the screen changes to "Your account has been recovered. Set a new password to finish.", set a password, log in. A second run of `reject` on another request shows the rejected state. Recovery from a different device id must not reveal any outcome.

### D. Settings and the five settings screens (FR-ACC-11/12/13/14/15/16/17/18) — reached from Home → Profile tab → "Settings"

- Settings rows: SECURITY (Change password), CONTACT (Phone, NIC as "•••• 1234" last four, Email or "Add email", Display name, and for employers Business name & bio (Business only) and Posting as), NOTIFICATIONS (Notification preferences — inert, another module), SUPPORT (Help — how YouthLink works → the Help index), ACCOUNT (Sign out, Delete account in red). Verify each variant: worker, employer (individual and business), verifier.
- Sign out: confirm dialog "Sign out of YouthLink?" with Cancel / Sign out; afterwards you are on the login screen with the phone number remembered; other devices stay signed in (log in on a second account/emulator or curl to verify).
- Change password (1.11): wrong current password → "That password doesn't match your account. Please try again." under the field (NOT a sign-out); mismatch/length errors; after success THIS device stays signed in and any other session is rejected on its next request; 6 wrong attempts in 15 minutes are rate limited.
- Phone change (1.12): password + new number → Firebase code → new number active; wrong password → field error; number already registered → refused; old number keeps working until confirmed. (Firebase-dependent; BLOCKED if no test numbers.) Note: this screen may have no entry point from Settings if it was not linked: if Phone row does nothing, report it.
- NIC (1.13): "Correct NIC": password + NIC; Save disabled until typed; bad shape rejected; a NIC belonging to another account → the "already registered" message; your own NIC is accepted; Settings then shows the new last four.
- Email (1.14/1.14b/1.14err): enter an address → pending screen "Pending — confirm …" with "Cancel this change"; the old email stays active meanwhile; open the console link → Settings shows the new address (return to Settings or foreground the app); an address verified on another account → "This email is already on another account. Try a different address."; the replaced/cancelled link stops working.
- Display name (1.15): edit; 100-character cap with counter; Settings and the profile show the new name immediately.
- Business name & bio (1.15eb) and Posting as (1.16/1.16b) as an employer: Business needs a name; switching back to Individual clears name and bio; Settings and the profile reflect it; the profile shows the business name for a Business employer.
- Delete account (1.17…): for the seeded user with the ACTIVE engagement the screen names the engagement and the button is disabled/blocked; for a user with none: the password step (wrong password = field error), then "Account deleted" with no back chevron and "Back to the start"; afterwards in the database the person's phone/email/NIC/legal name/birthdate/password are overwritten, the account is DELETED, but their ratings and engagements still exist; the old token is rejected; the phone number can register again. Do this LAST, on a throwaway account you registered yourself plus on a seeded account only after everything else.

### E. Own profile (FR-PROF-01/02/06) — screen 1.18 family

- Worker with no history: "New to YouthLink", bio prompt link, "ENDORSEMENTS" with the empty note, "My endorsement code" and "Settings" rows. Worker with revealed ratings: stars + "N% completion · M jobs". Employer: business name when Business (the "Phone verified" badge wraps under a long name), "N engagements completed" when it has history. Verifier: "Community Verifier" and "Vouching since <month year> · N endorsed". The tab bar at the bottom with Profile active and the correct tabs per role. A "Phone verified" badge on every profile and NO badge or text implying the NIC is verified. The values must match the database (compute the average rating over REVEALED, non-removed ratings and the completion rate yourself and compare). The bio-editor and endorsement-code rows are other modules' screens and are expected to do nothing.

### F. Shared foundation and UI kit

- Help/FAQ screens (reachable from Settings and the login "Trouble getting in? Get help"): content readable, back works.
- The home shell shows a tab bar per role; check the bar's icons, active tab styling, label text and that nothing overlaps the Android gesture bar.
- Run `node scripts/check-docs.mjs` and `node scripts/state-report.mjs` (read-only scripts) and report failures.
- Reseeding: `npx prisma db seed` runs cleanly twice in a row.

### G. Cross-cutting

- Dark/large-text: set the emulator font scale to the largest setting and re-check registration step 4, Settings and the profile: report clipping or overlap.
- Rotation is not required. Try an interrupted flow: background the app mid-registration and mid-recovery and return.
- Security smoke tests with curl against the running backend (base URL http://localhost:<port>): protected routes (`/api/account/me`, `/api/profiles/me`, every route in backend/src/modules/account/account.routes.js marked requireAuth) answer 401 without a token; a deleted/suspended account's token is rejected; responses never contain `passwordHash` or `nicEncrypted`; the email-change and password-reset links cannot be reused; rate limits trigger.

## How to report

Write ONE markdown report to `.worklog/e2e-report-<today>.md` (that folder is git-ignored; create it if absent) AND print it in your final message. Structure:

1. Environment: commit hash, backend/Node/emulator/Android versions, what you had to set up, what was BLOCKED and exactly why.
2. A results table: one row per test item above (A1…G…) with PASS / FAIL / BLOCKED / NOT TESTED and a one-line note.
3. Findings, most severe first. For each: ID, severity (BLOCKER = cannot demo / data loss / security; MAJOR = wrong behaviour; MINOR = cosmetic or copy), the feature and screen ID, exact steps to reproduce, expected (quote the requirement or prototype line) vs actual, evidence (screenshot filenames, relevant server log lines, DB query and result), and your best guess at the file(s) responsible (read the code to help, but do not change it).
4. Deviations from the prototype that look intentional and documented (do not count them as bugs): registration signs the person in and enters the app; employer step 5 back/close leave for the app; masked email on the forgot-password screen; no success banner after password/display-name changes (the screen just returns); undrawn copy for a few error strings.
5. Things you could not verify and what would be needed.
   Be concrete and honest: if you did not run something, say NOT TESTED. Do not report a pass for anything you did not actually perform on the emulator. Do not pad the report with praise.

## Round 2 — retest of E2E-01 to E2E-18 and the blocked flows (2026-10-02)

RETEST ROUND 2 — YouthLink Account module (report-only; do not fix, commit or push anything)

CONTEXT
This continues the earlier end-to-end run (your report 11648293-e2e-report-2026-10-02.md, findings E2E-01 to E2E-18). The fixes were merged into `develop` (PR from `feature/account-management-afham`). Your job now: (1) confirm each fix on the emulator, (2) run everything that was BLOCKED last time, (3) look for anything new. Report, do not repair. Number new findings E2E-19 onward in the same format (severity, steps, expected, actual, evidence, file).

1. SETUP

- `git checkout develop && git pull`. Do not commit anything; do not touch backend/package-lock.json.
- backend: `npm install`, `npx prisma generate`, `npx prisma migrate deploy` (nothing should be pending), then reseed `npx prisma db seed` so earlier test mutations are cleared. Start the API. Watch the backend console for the whole run: it prints "[Mock SMS]" and "[Mock Email]" lines with codes and links.
- mobile: `npm install` (a new package, @expo-google-fonts/inter, was added). It is loaded the same way Archivo already is, so a native rebuild should NOT be needed. Restart Metro with `npx expo start --dev-client --clear`, force-stop and relaunch the app. If text still looks like the system font (Roboto) after that, rebuild the development build and say so in the report.
- Clear the app's data (or reinstall) so the first-run screens show.
- Test both screen sizes: the emulator's default (about 411 dp wide) and a 360 dp-wide setting (`adb shell wm density 480` on a 1080 px-wide screen; reset with `adb shell wm density reset`). Figma frames are 360 dp wide; say which one each observation was made on.

2. FIREBASE TEST NUMBERS (both are NOT held by any seeded account)

- +94 77 000 0091, code 111222
- +94 77 000 0092, code 333444
  Use ONLY these for anything that sends a Firebase SMS (registration, phone change, OTP login). Any other number would send a real SMS to a real subscriber: do not do that.
  Seeded numbers +94770000001 and +94770000002 still work for login (their Firebase codes are in the developer's .worklog: 123456 and 654321).

3. NOW UNBLOCKED — run these first (they could not be run last time)
   A. Registration, worker, with +94 77 000 0091 / 111222: role selection → phone → code step (1.3, wrong code, resend) → details (1.4: every validation, under-18, NIC shape, NIC already registered, email optional, terms unticked, legal-name counter at 90+ characters) → Terms link (1.20) → account created. Check the database: User row, phone verified, NIC stored as ciphertext, accountStatus ACTIVE.
   B. Registration, employer: register a second account the same way (after A, delete account A from Settings first, or use the other number only if you must; say which you did) and walk the extra step 5 (1.5 Individual, 1.5b Business with name and bio).
   C. Successful phone change (1.12 / 1.12b): from an account created in A or B, change to +94 77 000 0092 / 333444. Wrong password, a number already registered, success. Check the old number is released only when the new one is confirmed, and that the old code no longer works.
   D. Delete a throwaway account you created in A/B (1.17 → 1.17p → 1.17d). Confirm the number can be registered again.

4. RETEST THE FIXES (each maps to your earlier findings)

- E2E-01 Recovery: Log in → Forgot password → "Neither of these works for me" → submit the form. It must now submit. Then approve with `node prisma/review-recovery.js list` / `approve <id>`, return to the status screen (approved), set a new password, log in. Also: reject path, and that a different install/clear-data cannot see the outcome.
- E2E-02 / E2E-10 Session end: while signed in, make the server end the session (reset the password from another token, or suspend the account in the database). The app must go to Log in on its own, with the "signed out" notice; for a suspended account only the suspended banner shows, with a way back.
- E2E-03 Double titles: Forgot password, Verify code, Recover account, Recovery status, Reset password must each show ONE title (the in-screen header), no native header above it.
- E2E-04 Keyboard: on every form with a pinned button (login, register, change password, NIC, email, display name, delete password), open the keyboard and confirm the button stays visible above it. Report device/emulator image and Android version. This was only a best-effort fix and has never run on a device.
- E2E-05 Open Settings, send an email link, open it in Chrome, return to the app: the Email row must update on its own. Same for the profile.
- E2E-06 Settings with a 57-character email: label must stay readable, row tidy. Also at font scale 2.0.
- E2E-07 Login states: empty (new subtitle), submitting (fields locked, "Signing you in…"), paused after 5 wrong passwords (Log in disabled until the number is edited).
- E2E-08 Employer profile: "1 engagement completed" singular; the count includes ENDED engagements.
- E2E-09 Code input: type, paste a 6-digit code, backspace, and (if you can) SMS autofill.
- E2E-11 NIC screen: duplicate message no longer says "log in instead"; no "12 / 12" counter.
- E2E-12 Forgot password: choosing "Email me a link" changes the button to "Send reset link".
- E2E-13 Open a spent/expired reset link in Chrome: it must say "Link no longer valid" with no form.
- E2E-14 Display name over 100 characters through the API: expect "Display name must be 100 characters or fewer." (it could not be reproduced locally, so please re-run it exactly as before and send the request/response if it still says "required").
- E2E-15 Help article HF.5 uses curly quotes around the link names.
- E2E-16 `POST /api/account/check-availability`: about 30 requests in a minute succeed, then HTTP 429 "Too many checks…".
- E2E-17 Say whether the pg DeprecationWarning appears again; if so, paste the 20 backend log lines before it and the request that caused it.
- E2E-18 Confirm `git status` shows no change to backend/package-lock.json.

5. THINGS REPORTED BY THE DEVELOPER BY EYE (verify each, with screenshots)

- Loading buttons keep their full width and position (Log in, Send code, Change password, Save, Delete).
- Phone field: typed digits show grouped as "77 123 4567", matching the placeholder.
- Text and spacing now match Figma more closely (Inter loaded); the 4-item verifier tab bar fills the width evenly. Compare against Figma frames at 360 dp.
- Character counters: legal name and display name show "N / 100" below the field from 90 characters; the NIC field shows none.
- Modal scrim: Sign out dialog dims the whole screen, status bar included.
- Password length errors read "Password must be 8 to 64 characters." (help line still says "spaces allowed", which is correct).
- Delete account: after deleting, the "Account deleted" screen has NO header bar (deliberate deviation from Figma 1.17d); the only exit is "Back to the start" and hardware Back does nothing.
- Terms screen (1.20): header sits at the normal height (a doubled top gap was fixed).
- First run: splash (about 2 s or tap), three cards with pager dots, Skip on the first two, "Create account" on the last, landing on role selection. Second launch goes straight to role selection.
- Signed-in home: plain shell with the tab bar and no raw "Sign out" button.
- Settings and Profile rows whose screen is not in this build (Notification preferences, My endorsement code, Add a short bio) show the toast "This isn't available in this version of the app yet." for about 2.5 s.

6. NEW SCREENS — reset by email from Settings (1.11r1–r4)
   Settings → Change password → "Forgotten your current password?":

- Account with a verified email: 1.11r2 shows the email and "Send reset link"; after sending, 1.11r3 shows the Info banner and "Done" (returns to Settings). Open the link from the backend console in Chrome, set a new password, confirm the old one fails and other sessions are signed out.
- Account with NO verified email (e.g. the seeded worker without one): 1.11r4 "Add an email" opens the Email screen.
- Back returns to Settings.

7. EVIDENCE AND REPORT

- Screenshot every visual check (name them like M1-<frame id>-<what>.png).
- Return one report file: a results table by section (3, 4, 5, 6), then a findings list with new E2E-19+ numbers, then "still NOT tested and why". Be explicit about anything you could not run.
- State the emulator image, Android version and screen width in dp for each group of observations.

## Round 3 — retest of E2E-19 to E2E-30, splash, icon, dialogs (2026-10-02/03)

RETEST ROUND 3 — YouthLink Account module (report-only; do not fix, commit or push anything)

CONTEXT
This continues round 2 (your report e2e-report-2026-10-02-round2.md, findings E2E-19 to E2E-30). The fixes were merged into `develop`. Round 3 does three things: (1) confirms each round 2 fix on a device, (2) runs the new items (launch splash, brand icon, native splash, dialogs), and (3) collects the information the developer needs to fix the three things that could not be fixed without a device (section 7). Number new findings E2E-31 onward in the same format as before.

1. SETUP — run these before testing

- `git checkout develop && git pull`. First clean your own leftovers so they are not mistaken for ours: `git checkout -- backend/package-lock.json mobile/package-lock.json` (do not commit anything, ever).
- Record `node -v`, `npm -v` and `git status --short` (before and after the installs below). The `npm -v` and any lockfile change are evidence for section 7C.
- backend: `npm install`, `npx prisma generate`, `npx prisma migrate deploy` (nothing should be pending), `npx prisma db seed` (clean reseed). Start the API; start it once with `node --trace-deprecation` so any pg warning prints a stack.
- mobile: `npm install` (new native package: expo-splash-screen). The app.json changed (splash plugin, adaptive icon, new asset files), so the native project must be regenerated and the development build REBUILT:
  1. Uninstall the old app from the emulator/phone first (`adb uninstall lk.youthlink.app`) so the old launcher icon is not cached.
  2. From mobile/: `npx expo prebuild --clean --platform android` then `npx expo run:android` (a compile of native code; the first one can be slow). If the team's shared build route is used instead, say so — but note it will NOT contain the new splash/icon unless it was built from this commit.
  3. Start Metro: `npx expo start --dev-client --clear`, open the app.
     Say in the report if any of these steps failed and exactly how (paste the error).
- Clear the app data after the first launch so first run shows.
- Test at 411 dp (default) and 360 dp (`adb shell wm density 480`; reset with `adb shell wm density reset`). Name the width on every observation. Record the emulator image, Android version/API level, and — if you can — repeat the keyboard checks (section 4) on a physical phone or a STABLE Android image (not the Android 17 preview).

2. FIREBASE TEST NUMBERS (not held by any seeded account)

- +94 77 000 0091, code 111222
- +94 77 000 0092, code 333444
  Use ONLY these for anything that sends a Firebase SMS. Seeded +94770000001 / +94770000002 work for login (codes in the developer's .worklog).

3. NEW THINGS TO VERIFY (screenshots for each)

- Launch splash (E: new): force-stop the app and launch it five times, with `adb shell screenrecord` or rapid `adb exec-out screencap -p` (about every 150 ms for 4 seconds). Expected: brand-blue screen with the white mark dead centre, then the wordmark "YouthLink" and the tagline appear UNDER the mark while the mark does not move, for at least 2 seconds in total, then the app. Report: how long the splash really stays, whether the mark jumps or changes size at the handoff between the Android system splash and the app's splash, whether any white flash or white screen appears, and whether a tap ends it early.
- Native Android splash: note exactly what the system splash looks like (colour, icon, size) in the first frames after launch, on the Android version you are testing.
- App icon: screenshot the launcher/app drawer: the icon must be the brand mark (white arcs and dot on brand blue #0F3D91). Also the recents screen and Settings → Apps entry. If the adaptive icon is cropped badly on a round/squircle mask, say so.
- Dialogs: (a) Settings → Sign out: the WHOLE screen including the status bar and navigation bar is dimmed (40 %), the card is centred, nothing behind it reacts; hardware Back closes it. (b) Phone change success ("Phone number updated"): it must be an in-app card on the same scrim with a single "Done" button — NOT a system alert; Done returns to Settings. Check for any other dialog or alert anywhere in the app that looks like a system one.
- Code input (every place it appears: registration code step, code login, phone change, forgot-password code): tapping ANY of the six boxes opens the keyboard; the boxes span the full row width at 360 and 411 dp and do NOT change width as digits are typed; the active box has a coloured border but the same thickness as the others; on a wrong code ALL six borders turn red at the same thickness (zoom in on the last box); paste of six digits works; plain Backspace removes one digit at a time; select-all + delete clears. Try SMS autofill if you have a real phone and SIM (say if you could not).
- Loading buttons: spinner centred in the button, not clipped, width and position unchanged (Send code, Log in under the row lock, Delete my account).
- Account deleted (E2E-22): Settings → Delete account → password → "Delete my account" must show the "Account deleted" screen with NO header bar and only "Back to the start"; hardware Back does nothing; the button goes to role selection. Do it twice. Also confirm that normal Sign out still lands on Log in with the number remembered (Home must not hijack it).
- Onboarding cards: art horizontally centred (disc centre at screen centre) at 360 and 411 dp; card 1 title "Local work, verified people" on ONE line; dots and button positions.
- Login after a suspension (E2E-26): suspended account shows the suspended banner, fields disabled, and a back chevron that goes to role selection; the paused/suspended banner clears when the phone number is changed.
- Registration (E2E-25/30): after "This email is already on another account. Try a different address." the error disappears as soon as the email is edited; same for NIC, birthdate, passwords, legal name. Also confirm the wording now matches Settings.
- Settings at font scale 2.0 (E2E-27): labels readable, values end with "…" (tail), no clipped first character, chevrons fully visible on "Notification preferences" and "Help — how YouthLink works".
- Button accessibility (E2E-28): in the UI tree each primary button's content-desc is its label (e.g. "Log in"), and "busy" only appears while loading. If you can run TalkBack, say what it reads.
- Everything from section 4 of round 2 that was FIXED: re-run a quick pass on E2E-01, 02, 05, 06, 07, 12, 13, 15, 16 to make sure nothing regressed (these should not need long).

4. KEYBOARD (E2E-04 / E2E-24) — needs the most evidence, see section 7A
5. STILL UNTESTED LAST TIME — do these if you can

- Individual-employer registration to completion and the Business bio counter at registration (300 cap).
- Verifier registration to completion.
- "1 engagement completed" singular on an employer profile: create the situation in the database (one COMPLETED engagement only) and look at the profile.
- A delete of a registered account that has ratings (use a seeded account, then reseed).
- Plain Backspace (above), SMS autofill (needs a real phone), TalkBack (needs a real phone or TalkBack enabled).
- Figma comparison: capture app screenshots at 360 dp and compare against the matching Figma frames for 1.1, 1.3 (code boxes), 1.6, 1.10, 1.10s (dialog), 1.12b, 1.17d, 0.2, 0.3, 0.4. State what differs in measurable terms (px offsets, colours).

6. EVIDENCE AND REPORT

- Screenshot every visual check (R3-<frame id>-<what>-<width>dp.png); keep screen recordings or burst captures for the splash.
- One report file: results tables per section, then findings E2E-31+, then "still NOT tested and why", and a section "7. Information requested by the developer".
- State emulator image, Android version and width in dp for each group of observations.

7. INFORMATION THE DEVELOPER NEEDS (these three could not be fixed without it — please collect everything listed, even if the problem does not reproduce)

A. Keyboard covers or half-hides fields (E2E-24, and E2E-04 on stable Android)
Reproduce on: registration details step (tap Legal name, the LAST field above the pinned "Create account" bar; also Email and NIC), login, change password, delete-account password, and the code step. For EACH:

1.  Screenshot with the keyboard open and the focused field visible/hidden.
2.  `adb shell dumpsys window | grep -i -E "mInputMethod|InputMethod|imeInsets|mCurrentFocus"` and `adb shell dumpsys input_method | grep -E "mInputShown|mImeWindowVis|mCurrentInputMethodInfo"` while the keyboard is open.
3.  A UI hierarchy dump (`adb shell uiautomator dump /sdcard/ui.xml`, then pull it) with the keyboard open: I need the pixel bounds of the scroll view, the pinned button bar, and the focused field, and the keyboard's top edge.
4.  The windowSoftInputMode the app is running with: `adb shell dumpsys activity activities | grep -i -E "softInputMode|windowSoftInputMode"`, and the line `android:windowSoftInputMode` from `mobile/android/app/src/main/AndroidManifest.xml` (it exists after prebuild).
5.  Whether it also happens on a stable Android image (API 34 or 35) or a physical phone, and which Android version. If you cannot, say so.
6.  The same test with the font scale at 1.0 and 1.3 (`adb shell settings put system font_scale 1.3`; reset to 1.0 afterwards).

B. Display-size / font-scale change restarts the app and loses the flow (E2E-29)

1.  Paste the whole `<activity …>` element for MainActivity from `mobile/android/app/src/main/AndroidManifest.xml` (specifically `android:configChanges`, `android:windowSoftInputMode`, `android:launchMode`).
2.  Paste the output of `adb shell dumpsys activity activities | grep -A3 -i "mainactivity"` before and after changing density (`adb shell wm density 480`) in the middle of the registration code step, and say what the user saw each time.
3.  Whether the same restart happens when only the system font size is changed in Settings (not via adb), and when the device is rotated (the app is portrait-only; say what happened).

C. npm lockfile churn (E2E-18)

1.  `node -v`, `npm -v`.
2.  On a CLEAN checkout of develop (before any install), run `cd backend && npm install` and paste `git diff --stat` and the first 60 lines of `git diff backend/package-lock.json`. Then `git checkout -- backend/package-lock.json`.
3.  Repeat with `npm ci` (which must not change the lockfile) and say whether `npm ci` succeeds.
4.  Same two steps for `mobile/`.
5.  If a second npm version is available (for example via `npx npm@10 install`), repeat step 2 with it and say whether the diff differs. This tells the developer whether the churn depends on the npm version.
    Do NOT commit the lockfiles.

D. Splash / icon details the developer needs to tune (if anything looks wrong in section 3)
If the handoff from the system splash to the app splash jumps, send the burst of frames, the Android version, and the output of `adb shell dumpsys window | grep -i splash`. If the icon is cropped or looks off, send the launcher screenshot and `adb shell dumpsys package lk.youthlink.app | grep -i -E "icon|roundIcon"`.

## Round 4 — retest of E2E-31 to E2E-41, launch states (2026-10-03)

RETEST ROUND 4 — YouthLink Account module (report-only; do not fix, commit or push anything)

CONTEXT
This continues round 3 (your report e2e-report-2026-10-02-round3.md, findings E2E-31 to E2E-41). The fixes were merged into `develop`. Round 4 does three things: (1) confirms the round 3 fixes, (2) tests the new launch-state rules end to end, and (3) collects the information needed for the three items that are still open (section 6). New findings are numbered E2E-42 onward, in the same format.

1. SETUP — run these before testing

- `git checkout develop && git pull`. Record `git log --oneline -1`. Do not commit anything.
- Record `node -v`, `npm -v`, `git status --short` (it must be clean before installs).
- mobile lockfile check: from `mobile/` run `npm ci`. It FAILED in round 3; it must now succeed and leave `git status` clean. Paste the result. (If it fails, paste the full error and stop that step; fall back to `npm install` and say so.)
- backend: `npm install`, `npx prisma generate`, `npx prisma migrate deploy` (nothing pending), `npx prisma db seed`. Start the API with `node --trace-deprecation`.
- mobile native rebuild (app.json changed: the app name):
  1. `adb uninstall lk.youthlink.app`.
  2. From mobile/: `npx expo prebuild --clean --platform android`, then `npx expo run:android` (JDK 21, as in round 3).
  3. After prebuild, paste the `app_name` from `android/app/src/main/res/values/strings.xml` (it must be YouthLink) and the `<application ...>` line of AndroidManifest.xml.
  4. Metro: `npx expo start --dev-client --clear`.
- Use the Play Store emulator image (Android 17 preview, as before) for everything that needs SMS; a Play-less image cannot complete Firebase phone verification (E2E-41). Test at 411 dp and 360 dp (`wm density 480` / `wm density reset`); name the width on every observation.
- Firebase test numbers (not in the seed): +94 77 000 0091 code 111222; +94 77 000 0092 code 333444. Use ONLY these for SMS. Seeded +94770000001 / 0002 work for login with the codes in the developer's .worklog.

2. WHAT CHANGED SINCE ROUND 3 — verify each, with screenshots
   A. App name and icon

- Launcher, app drawer, recents and Settings → Apps all read "YouthLink" under the brand-mark icon.
- NOTE: the app's icon in the launcher's "last opened app" area can look different (a light ring) from the same icon in the drawer or when added to the home screen on its own. That is Android's own last-opened display and is NOT a finding. Judge the icon from the drawer or from a home-screen shortcut.
  B. Launch states (NEW RULES; test every row, each from a force-stop):
  | # | Starting situation | Expected launch result |
  | 1 | Fresh install / cleared data, never signed in | splash → onboarding card 1 → (Next, Next, Create account) role selection |
  | 2 | Same, but Skip on card 1, then force-stop and reopen | splash → role selection (no cards) |
  | 3 | Same as 1, but force-stop on card 2, reopen | splash → onboarding card 1 again |
  | 4 | Signed in (any seeded user), force-stop, reopen | splash → home shell (no Log in) |
  | 5 | Settings → Sign out, force-stop, reopen | splash → LOG IN with the phone number already filled in ("Log in to pick up where you left off.") |
  | 6 | Same as 5 but the person changed their phone number (Settings → Change phone) before signing out | Log in shows the NEW number |
  | 7 | Session ended by the server (reset the password via API, or suspend the account) while signed in; tap something; then force-stop and reopen | Log in with the number; the first time (without force-stop) it also shows the "signed out" notice |
  | 8 | Delete a throwaway account (Settings → Delete account → password), tap "Back to the start", force-stop, reopen | role selection (NOT Log in, NOT the cards) |
  | 9 | Account A signs out; account B (other seeded user) signs in, signs out; reopen | Log in shows B's number |
  | 10 | Sign in via code login (not password), sign out, reopen | Log in with that number |
  | 11 | Sign out, then on Log in tap the back chevron (if shown) / hardware Back | role selection or app exit, never a blank screen; say which |
  Also check: signing out from Settings still lands on Log in directly with the number remembered (no flicker through role selection), and hardware Back from Log in (stack root) leaves the app.
  C. Header position: open Settings, Change password, Delete account (intro), Forgot password at 360 dp and compare with Figma frames 1.10 (73:140), 1.11 (74:149) and 1.17 (75:225) using the same method as round 3 (ink bands, status-bar inset removed). The −11/−12 dp offset must now be ≈ 0 (±1 dp). Report the numbers.
  D. Onboarding: at 360 and 411 dp the disc top / title top / body top must be identical on all three cards (spec art @150, title @392, body @440 on card 1 and @472 on cards 2 and 3, all plus the status-bar inset); the art must not move when paging; Skip right edge at 344 dp, top at 24 dp (+ inset). Report the numbers.
  E. Code input: no ghost digits across box 1 with six digits typed (zoom), and the LAST box is NOT in the active (brand) colour once all six digits are in. Wrong-code red state still 1 dp on all six boxes.
  F. Button accessibility: after a loading cycle (wrong password login, then dump) the primary button's content-desc is its label, WITHOUT "busy"; and "busy" appears only while a spinner is showing.
  G. Splash handoff: record five warm launches and two launches after clear-data (`screenrecord`, decode frame by frame as in round 3). Report: any pure-black frame at the native → app handoff (expected: none now), any jump of the mark between the native splash and the app splash (expected: none), total time on the splash, and how long the screen between the native splash and the app splash stays dark after clear-data (round 3: about 1.2 s).
  H. Keyboard on registration details: with the keyboard open, focus Legal name, NIC and Email; the focused field AND its counter/helper line must be fully visible above the pinned "Create account" bar (round 3: Legal name ended flush with the bar). Report the pixel bounds of the field, the scroll view and the bar, like round 3.
  I. Quick regression pass (only confirm nothing broke): Sign out dialog dims everything; Phone number updated is an in-app card; Account deleted screen (no header, only "Back to the start"); loading spinners centred; code boxes tappable; Forgot password → "Send reset link" for email; reset-by-email 1.11r1–r4.

3. STILL UNTESTED LAST TIME — do if you can
   SMS autofill and TalkBack need a real phone: say if you have one. Individual-employer, Business and verifier registration already pass; no need to repeat.

4. EVIDENCE AND REPORT

- Screenshot every check (R4-<what>-<width>dp.png); screen recordings for the splash and the launch states.
- One report file: results tables per section, findings E2E-42+, "still NOT tested and why", and section 6.

6. INFORMATION THE DEVELOPER NEEDS FOR THE THREE OPEN ITEMS (collect even if the problem does not reproduce)
   a) 1.3 "Resend in 0:xx" line sits 12 dp lower than Figma (round 3 §5). On the registration code step at 360 dp: `adb shell uiautomator dump` (wait for the screen to be idle before dumping) and paste the bounds of every node from the "We sent a 6-digit code…" text down to the "Change number" link: the code row container, the hidden EditText, each of the six boxes, the "Resend in" text, and any empty views in between. State the vertical gap in dp between the bottom of the code row container and the top of the "Resend in" text. Do the same on the code login screen and the phone-change code step and say whether the gap is the same there.
   b) Code-login wrong-code error line cut by the pinned bar with the keyboard open. Screenshot with the keyboard open, plus the bounds (scroll view, error text, bar, keyboard top) at 360 dp, and the same on the registration code step. Say whether the error line is fully visible if you scroll the screen.
   c) The dark gap after clear-data at launch (G above): `adb logcat -b all -v time` from the launch command until the app splash is on screen, filtered for lk.youthlink.app / ReactNativeJS / ActivityTaskManager / SplashScreen / Firebase, and the video with frame numbers. Say whether the gap also happens on a launch after clear-data that is NOT the first launch of the process (force-stop, then launch again WITHOUT clearing), and whether it happens after a plain force-stop (warm). If you have a release build option (`npx expo run:android --variant release`), repeat one clear-data launch with it and report the gap; if not, say so.

## Round 5 — final run: six fixes plus a full smoke pass (2026-10-03)

FINAL TEST RUN — YouthLink Account module (report-only; do not fix, commit or push anything)

CONTEXT
This is the last run before the module is closed. It has two parts: (A) retest the six fixes made since round 4, and (B) a full smoke pass over everything the Account module and own-profile screen do, so that the final state is on record. Report PASS or FAIL per item; collect evidence (screenshots) for every FAIL and for the items marked (shot). New findings are numbered E2E-48 onward.

1. SETUP — run these before testing

- `git checkout develop && git pull`. Record `git log --oneline -1`. Do not commit anything. Record `node -v`, `npm -v`.
- mobile: `cd mobile && npm ci` (must succeed and leave `git status` clean). backend: `npm install`, `npx prisma generate`, `npx prisma migrate deploy`, `npx prisma db seed`. If `npm install` changes `backend/package-lock.json`, restore it with `git checkout -- backend/package-lock.json` at the end.
- Start the API with `node --trace-deprecation`; watch its console for the whole run (mock SMS and email lines appear there).
- Native rebuild (app.json changed again): `adb uninstall lk.youthlink.app`, `npx expo prebuild --clean --platform android`, `npx expo run:android` (JDK 21), then `npx expo start --dev-client --clear`.
- Play Store emulator image; test at 360 dp (`wm density 480`, reset after) and 411 dp; name the width on every result.
- Firebase test numbers: +94 77 000 0091 code 111222; +94 77 000 0092 code 333444. Use ONLY these for SMS. Seeded +94770000001 / 0002 for login (codes in the developer's .worklog).

2. PART A — the six fixes since round 4 (shot each)
   A1. Registration step 4 at 360 dp with the keyboard open: focus Password, Email, NIC, Birthdate and Legal name in turn. Each focused field AND its counter/helper/error line must be fully visible above the pinned "Create account" bar (round 4: Legal name was flush with the bar, counter hidden). For Legal name type 90+ characters and confirm the "N / 100" counter is visible. Report pixel bounds of the field, the scroll view and the bar for Legal name, as in round 4.
   A2. Code login at 360 dp: Log in → "Log in with a code instead" → +94 77 000 0091 → send code → type a wrong code (999999) → Log in, keyboard open. The whole error line ("That code doesn't match…") must be fully visible above the bar (round 4: its last line was cut). Also confirm the screen still lets you reach "Resend code" and the links by scrolling.
   A3. Settings → Sign out dialog → Sign out: record the transition (`screenrecord`) and confirm there is no brand-blue band at the screen edge while Log in slides in (round 4: about 70 ms blue sliver). Also check other screen transitions (Settings → Change password, back) for any coloured band, and, with the phone's dark theme ON, that no dark band appears either.
   A4. Reset by email (Settings → Change password → "Forgotten your current password?" → Send reset link) on an account with a verified email: on the "link sent" screen the full stop must not start a line by itself. Check there is no visible odd character (box or blank gap) where the full stop follows the address.
   A5. Window background: launch the app 5 times from force-stop; confirm the splash still looks right (blue with the mark, wordmark appears under it, about 2 s), with no white flash between the native splash and the app splash.
   A6. Delete account, password step (frame 1.17p; NEW deliberate deviation from Figma): Settings → Delete account → Delete account (intro) → password step. The red "Delete my account" button must now be PINNED at the bottom in a bar (like Log in on the login screen), disabled until a password is typed. With the keyboard open, report the distance in dp from the bottom of the button to the top of the keyboard on BOTH widths (expected 24 dp, the same as on Login and Change password; round 3 measured 51 dp at 360 dp and 180 dp at 411 dp). Also check: the button is not hidden by the keyboard, the Password field and the "Re-enter your password…" note are visible above it, wrong password shows the field error, the success path still ends on "Account deleted". The first delete step (intro, no keyboard) is unchanged: button at the foot of the content.

3. PART B — full smoke pass (PASS/FAIL, screenshot at least one per row)
   B1 First run: clear data → splash → three cards (art centred, same positions on each card) → Skip on card 1 and "Create account" on card 3 both reach role selection. Force-stop mid-cards → cards again.
   B2 Registration: worker (0091/111222), employer Individual and Business (0092/333444 after deleting the first account), verifier; wrong code, resend, every details validation, terms link (1.20), duplicate NIC/email, under-18.
   B3 Login: password (right, wrong with remaining attempts, 5 wrong = paused with Log in disabled), code login, suspended account (banner, disabled fields, back chevron), "signed out" notice after a session end.
   B4 Forgot password: SMS reset (code from the API console), email reset (link from the console opens the browser page, sets the password, a second use shows "Link no longer valid"), "Neither of these works for me" → recovery request → approve with `node prisma/review-recovery.js` → set a new password → log in.
   B5 Settings: every row (Change password, Phone, NIC, Email, Display name, Business name & bio, Posting as per role), phone change to 0092 with the success card, email add + confirm link, display name 100-character cap and counter, NIC correction, rows with no screen show the toast, Help opens.
   B6 Delete account: blocked with an active engagement; throwaway account: wrong password on the (pinned-button) password step, success → "Account deleted" (no header) → Back to the start → role selection; kill and reopen → role selection.
   B7 Launch states, force-stop each time: signed in → home shell; signed out → Log in with the number; session ended → Log in with the number (+ notice the first time); account deleted → role selection; two accounts signing in and out in turn → the last number.
   B8 Own profile: worker (new, with history, with endorsement), employer (Business, Individual, count "1 engagement completed" singular and 2 or more), verifier; tab bars per role; "Phone verified"; no NIC badge.
   B9 Dialogs and states: Sign out dialog dims everything (status bar too), Phone updated is an in-app card, loading buttons keep size with a centred spinner, code boxes tappable at both widths, ghost digits absent, button accessibility name = label with no "busy" after loading.
   B10 Fonts and layout: Inter visible, header position equals Figma (divider about 99 dp at 360 dp), Settings at font scale 2.0 readable.

4. IF YOU HAVE A REAL PHONE (optional but valuable; say if not): repeat A1, A2, A6, B2 (registration code step with real SMS autofill if the Firebase test numbers allow it, otherwise just the keyboard), and a TalkBack pass on Log in and the code step; report what TalkBack says for the code boxes and for a loading button.

5. REPORT

- One file: setup log (commands run, versions, git state), Part A and Part B tables (PASS/FAIL), findings E2E-48+ with steps / expected / actual / evidence, and a final "still NOT tested and why". End with a one-paragraph verdict: is there any FAIL that would be visible in a demo of the Account module?

## Round 6 — last check of E2E-48 to E2E-50 on the branch (2026-10-03)

LAST CHECK — YouthLink Account module (report-only; do not fix, commit or push anything)

CONTEXT
Three items from the final run were fixed on the branch `feature/account-management-afham` (E2E-48, E2E-49, E2E-50). Test THIS BRANCH, not develop. Report PASS or FAIL per item, with a screenshot each. Anything else you notice goes in as E2E-51 onward, but do not run a full pass again.

1. SETUP

- `git fetch && git checkout feature/account-management-afham && git pull`. Record `git log --oneline -3` (the top commit must be "fix(mobile): start the email address on its own line on the link-sent screen"). Do not commit anything. Record `node -v`, `npm -v`.
- mobile: `cd mobile && npm ci` (must leave `git status` clean). backend: `npm install`, `npx prisma generate`, `npx prisma migrate deploy`, `npx prisma db seed`; restore `backend/package-lock.json` with `git checkout -- backend/package-lock.json` at the end if npm 11 changed it. Start the API with `node --trace-deprecation`.
- No native rebuild is needed (only JavaScript and docs changed since the last build). If the app on the emulator is the build from the final run, just restart Metro: `npx expo start --dev-client --clear`, force-stop and reopen the app.
- Play Store emulator image, 360 dp (`wm density 480`; reset after). Firebase test numbers: +94 77 000 0091 code 111222; +94 77 000 0092 code 333444. Use ONLY these for SMS.

2. CHECKS (screenshot each; 360 dp)
   C1 (E2E-48) Registration step 4 with the keyboard open: focus Birthdate, then Legal name, in turn, and type 99 characters in Legal name. In each case the focused field (including its bottom border) AND its counter ("99 / 100") must be fully visible above the pinned "Create account" bar. Report the pixel bounds of the field, the scroll view and the bar for Birthdate and for Legal name, as in the final run (field 1119–1239 px flush with the scroll view bottom was the FAIL). Also confirm Password, Email and NIC are still fine, and that dismissing the keyboard (back) leaves the screen scrolled sensibly with nothing jumping.
   C2 (E2E-49) Settings → Change password → "Forgotten your current password?" → Send reset link (account with a verified email, for example Amal): the link-sent message must read "We've sent a reset link to" on the first line and the address plus the full stop on the second ("amal@example.com. Check your inbox, …"). The full stop must NOT start a line. Check at 411 dp too (`wm density reset`), where the address also starts its own line now.
   C3 (E2E-50) Log in with a seeded account and 3 wrong passwords in a row without editing the phone number: after the 3rd the warning "2 attempts left before password login is paused for 15 minutes." appears and Log in must STAY ACTIVE (not grey) when a password is typed. Then make the 4th and 5th wrong attempts: the 5th must show "Too many attempts — password login is paused for 15 minutes. You can log in with a code instead." and Log in must be disabled; editing the phone number re-enables it. Also confirm a correct password on the 3rd or 4th attempt logs in. Restore the account (code login clears the lock, or reseed).
   C4 Quick regression on the files touched: registration end to end once (worker 0091/111222: details → Create account → lands on the home shell), and a code login with the wrong code (error fully visible above the bar).

3. REPORT

- One short file: setup log, C1–C4 PASS/FAIL with the numbers above, any E2E-51+ findings, and a one-line verdict: "ready to merge" or what blocks it.
