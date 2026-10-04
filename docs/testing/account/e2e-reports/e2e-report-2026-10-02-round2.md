# E2E retest, round 2 — Account module (report only; nothing fixed, committed or pushed)

Run: Fri 2026-10-02, ~03:55 → 06:20 (Asia/Colombo). Continues `e2e-report-2026-10-02.md` (E2E-01…E2E-18). New findings are numbered **E2E-19** onward.
Screenshots: `C:\Users\Afham\e2e-screens\` (245 files; round 2 files are `R2-*`, Figma references `Figma-*`, help articles `MHF-*`). Logs: `C:\Users\Afham\e2e-logs\r2\`.

## 0. Environment and what I did

| Item | Value |
|---|---|
| Code | `develop` @ `3a1ace841c4eaca581aeae0f3358fe9e1d416e48` (`git pull` from `4179d0c`; PR #44) |
| Emulator | AVD `Pixel_8`, **Android 17 preview (API 37, `google_apis_playstore_ps16k`, build `CP31.260623.012`)**, 1080×2400. **No stable-Android image or physical phone was available.** |
| Screen widths | **411 dp** (density 420, default) and **360 dp** (`wm density 480`, = Figma frame width). Every observation below says which; unlabeled = 360 dp. Almost all UI testing was at 360 dp; at 411 dp I checked onboarding card 1, the phone step, the code step. |
| Backend | `npm install`, `prisma generate`, `migrate deploy` (nothing pending), reseed (clean), API on :3000. Later restarted with `--trace-deprecation` (E2E-17). Final reseed restored all test data. |
| Mobile | `npm install` (inter present), Metro `--clear`, app data cleared. **Inter loaded without a native rebuild** (text visibly Inter, not Roboto). |
| Firebase | Only `+94 77 000 0091`/`111222` and `+94 77 000 0092`/`333444` used for SMS. Seeded `+…0001/2` used for login only. |
| Emulator health | After ~hours of uptime UiAutomation/`/sdcard` broke; I **cold-rebooted the emulator** once at the start (not an app issue). Chrome crashes with SIGILL on this image occasionally; the app did not crash. |
| Git | `git checkout develop && git pull` as instructed. Nothing committed. `git status` = ` M backend/package-lock.json` (leftover from my **round 1** `npm install`; see E2E-18). |

Registration numbers: worker A used `0091`; account A was **deleted from Settings** (D), then the employer was registered with `0091` again and later changed to `0092` (C), then deleted. No other number received an SMS.

## 1. Results — section 3 (previously BLOCKED)

| ID | Item | Result | Evidence / note |
|---|---|---|---|
| 3A | Worker registration `+94 77 000 0091` / `111222`: role → phone → code step (1.3) → wrong code → resend → details (1.4) validations → Terms (1.20) → account created; DB | **PASS** (+E2E-19, E2E-24, E2E-25) | Code step copy exact; wrong code → "That code doesn't match…" (`R2-1.3err2-*`). 1.4: empty submit shows per-field errors; password < 8 and > 64 → "Password must be 8 to 64 characters."; confirm mismatch → "Passwords do not match."; bad email → "Enter a valid email address."; NIC shape → "A NIC is 12 digits, or 9 digits followed by V or X."; impossible date (30 Feb) → "Enter your birthdate as YYYY-MM-DD."; under-18 (2012-01-01) → exact 1.4err2 copy; NIC of Nimali → exact 1.4err1 copy; email of Amal → "This email address is already in use."; terms unticked → "Please accept the Terms of Service and Privacy Policy to continue." (button stays enabled); legal name counter appears at 90 and caps at 100 (NIC shows none). Terms link opens 1.20 with a normal-height header, Back returns with all values intact. DB after create: role `YOUTH_JOB_SEEKER`, phone `+94770000091`, `phoneVerifiedAt` set, NIC length 65 and not plaintext, `accountStatus ACTIVE`, `tosAcceptedAt` set, email null, bcrypt hash. Lands on the Worker shell (no raw "Sign out"). |
| 3B | Employer registration + step 5 | **PASS** (Business path); Individual **partly** | "Step 1 of 5"… "Step 5 of 5", "How will you post gigs?", both descriptions and change-later note exact. Business reveals name + bio, Continue disabled until a name is entered, name capped at 100. I finished as **Business** (name "Test Biz (Pvt) Ltd"): DB `postingAsType BUSINESS`, businessName saved, email lower-cased, **[Mock Email] link printed**, link confirms (`emailVerifiedAt` set). Individual was the default selected state (screenshot) but I did not complete an Individual registration. Bio cap/counter at 300 not exercised at registration. |
| 3C | Phone change 1.12/1.12b to `+94 77 000 0092` / `333444` | **PASS** | Registered number → "This number is already registered to another account." Wrong password → code sent, then on confirm **"That password doesn't match your account. Please try again."** under Password; DB phone unchanged (`…0091`), `…0092` still free. Correct password → pending screen ("Pending — confirm +94 77 000 0092 …"), old number still taken while pending, then "Phone number updated / Your new number is now active." Old number released only after confirm. Code login with `0091`+`111222` → "No account found for this phone number."; `0092`+`111222` → "That code doesn't match…"; `0092`+`333444` → signs in. |
| 3D | Delete a throwaway account; number reusable | **PASS** (+E2E-22) | Worker A and the test employer deleted from Settings (password step, DB anonymised: name "Deleted user", phone `deleted-<id>`, NIC placeholder, `DELETED`). `check-availability` for the number → `phoneTaken:false`; the employer then registered with the same number. **The "Account deleted" screen never appeared** (E2E-22). |

## 2. Results — section 4 (retest of earlier findings)

| Earlier ID | Result | How verified |
|---|---|---|
| E2E-01 Recovery can't submit | **FIXED** | Login → Forgot password → "Neither of these works for me" → "Recover my account" → form submits ("Request received…"); DB row, 64-char server-issued device id. Status survives a force-stop (pending). `review-recovery.js list` → `approve` → status screen changed by itself to "Your account has been recovered. Set a new password to finish." within ~18 s; set new password (screen "Reset password") → login with the new password works, old one 401. `reject` path → "We couldn't match these details to the account, so the request wasn't approved." After **clear-data** the same number opens the empty form (no outcome); API status for an unknown device → 404. The recovery request body's `deviceId` is now ignored; the API returns it. |
| E2E-02 Session end strands the user | **FIXED** | Password reset elsewhere (web page) while signed in → on returning to the app it went to Log in with the "signed out" notice, no chevron. Suspended while on Settings: nothing until a request is made, then Back→Settings → Log in with the notice. (See E2E-26 for what remains.) |
| E2E-03 Double headers | **FIXED** | Forgot password, code step, Recover account, Recovery status, Reset password each show one header (`R2-12-*`, `R2-1-recovery-*`, `R2-9-reset-*`). |
| E2E-04 Keyboard covers CTA | **FIXED on this image** | With the keyboard open the pinned button sits ~12 px above it on: register phone step (411 dp and 360 dp), register code step, register details (focused last field), login, change password (3 fields), NIC, email, display name, delete password (`R2-4-kb-*`, `R2-1.2-phone-typed-411dp`). **Same Android 17 preview image where it failed in round 1; still no stable image/real phone.** Side effect: E2E-24. |
| E2E-05 Settings stale after email confirm | **FIXED** | Sent link for a 57-char address, confirmed in Chrome, returned via recents: Email row updated with no navigation (`R2-5-settings-after-return-360dp`). Profile not separately checked. |
| E2E-06 Long email row | **FIXED** | 57-char email at 100% and 200%: "Email" label readable, value middle-ellipsised, row tidy. New small clipping at 200%: E2E-27. |
| E2E-07 Login states | **FIXED** (a, b, c) | (a) empty subtitle "Enter your phone number and password to log in."; filled "Log in to pick up where you left off.". (b) submitting (login held with a DB row lock): subtitle "Signing you in… fields are locked while we check.", both fields disabled, links hidden, button loading. (c) 5 wrong passwords → "Too many attempts…", Log in disabled; editing the password keeps it disabled; **editing the number enables it**. |
| E2E-08 Employer count | **FIXED** | API `completedEngagements` = 2 for Kamal (COMPLETED + ENDED, ACTIVE excluded); UI "2 engagements completed". Singular verified by code only (`=== 1`); no seed employer shows the count with exactly 1. |
| E2E-09 Code input | **PARTIAL** | **Paste works**: `Ctrl+V` of `333444` filled all six, and a six-digit burst (`adb input text`) also landed fully. Select-all+delete clears. Plain Backspace and SMS autofill not tested. **But the boxes cannot be tapped to open the keyboard (E2E-19).** |
| E2E-10 Suspended login | **PARTIAL** | The stale "You were signed out…" banner is gone: only the suspended banner shows. But after a session-end redirect the login is the stack root, so there is **no back chevron, fields are disabled, and hardware Back exits the app** (E2E-26). |
| E2E-11 NIC screen | **FIXED** | Duplicate → "This NIC is already registered to another account. Check the number for a typo."; no "12 / 12" counter at 12 characters. |
| E2E-12 Forgot-password CTA | **FIXED** | Selecting "Email me a link" changes the button to "Send reset link". |
| E2E-13 Spent reset link | **FIXED** | Chrome: "Link no longer valid / This reset link has expired or was already used. Request a new one from the app." with no form (`R2-spent-link-chrome-360dp`). Second POST → 401. |
| E2E-14 Display name over 100 | **WITHDRAWN — tester error** | In round 1 I sent `{"displayName": …}`. The API reads **`legalName`**. Exact request now: `PATCH /api/account/display-name` body `{"legalName":"<101×A>"}` → `400 {"error":"Display name must be 100 characters or fewer.","fields":{"legalName":"Must be 100 characters or fewer"}}`; 100 chars → 200; blank → "Display name is required."; `{"displayName":…}` → "Display name is required." (unknown key). Server behaves correctly; my round-1 repro was wrong. |
| E2E-15 Curly quotes in HF.5 | **FIXED** | “Log in with a code instead” / “Forgot password?” use U+201C/U+201D. |
| E2E-16 Availability throttle | **FIXED** | 45 sequential requests: 30 × 200, then 429 from #31: `{"error":"Too many checks. Wait a minute and try again."}`. |
| E2E-17 pg DeprecationWarning | **NOT FIXED — now attributed** | Appeared again in the normal run and reproduces on demand: **the first `POST /api/account/delete` after a backend start prints it.** Trace (`~/e2e-logs/r2/backend-trace.log:18-28`): `Client.query (pg/lib/client.js:762)` ← `PgTransaction.performIO` ← `PgTransaction.queryRaw (@prisma/adapter-pg)` ← `interpretNode … Array.map`. Cause: `account.service.js:1249` `findBlockingEngagement(tx, user.id)` (defined at `:1190`) does `engagement.findFirst({ include: { gigPosting, worker, employer } })` inside `$transaction`; with the pg adapter the three relation loads run in parallel on the single transaction connection. Not triggered by: availability, login (right/wrong), `/me`, `/profiles/me`, password/email/NIC/display-name changes, deletion status, reset request/verify, recovery request/status/**confirm**. The 20 log lines before it (normal run) are just `API listening…` and, in the traced run, `[Mock Email]`/`[Mock SMS]` lines; there are **no request log lines** in this backend. |
| E2E-18 lockfile | **NOT FIXED** | `git status` shows ` M backend/package-lock.json`, but that is my round-1 leftover (diff hash identical before/after round 2's install). To test properly I replayed `npm install --package-lock-only` on the **committed** `HEAD` lockfile in a scratch directory: it still adds `"peer": true` flags and drops `@emnapi/*` (6 → 8 `peer` entries). So any developer with npm 11 will get the same diff. |

## 3. Results — section 5 (the developer's by-eye claims)

| Claim | Result | Note |
|---|---|---|
| Loading buttons keep full width and position | **PARTIAL** | Width/position stable on Send code, Log in, Delete. **The spinner is not centred: it sits at the bottom edge of the button, half clipped** (E2E-21). |
| Phone field shows "77 123 4567" grouping | **PASS** | Typed `770000091` → `77 000 0091` (411 and 360 dp). |
| Inter loaded; spacing matches Figma; 4-item verifier tab bar even | **PASS** | Inter visible. Figma `1.1` (68:96) and `1.10` (73:140) vs app at 360 dp: card/row sizes, rhythm, CTA position and bottom margin identical; app content sits ~44 dp lower = status-bar inset on this device. Verifier tabs are four × 270 px = full width. Figma frames used: `Figma-1.1-role-selection.png`, `Figma-1.10-settings.png`. |
| Counters (legal name, display name from 90; none on NIC) | **PASS** | Legal name 90/100, display name 90/100 and cap 100; NIC none. (Business name/bio counters not seen at registration.) |
| Sign out dialog dims the whole screen incl. status bar | **FAIL** | No scrim at all (E2E-20). |
| "Password must be 8 to 64 characters." | **PASS** | Registration details, change password. Help line unchanged. |
| After deleting: "Account deleted", no header, only "Back to the start", hardware Back inert | **FAIL** | Screen never shown (E2E-22). |
| Terms header at normal height | **PASS** | |
| First run: splash ~2 s/tap, three cards, dots, Skip on first two, Create account on last, then role selection; second launch straight to role selection | **PASS** (+E2E-23) | Splash seen as a full-screen brand-blue frame (pixel sampling; no clean screenshot of it), tapping it advances; cards 1–3 copy exact, dots, Skip on 1–2, "Create account" on 3 → role selection; Skip → role selection; relaunch → role selection. Art is off-centre (E2E-23). |
| Signed-in home is a plain shell, tab bar, no "Sign out" | **PASS** | |
| Rows without a screen show the toast for ~2.5 s | **PASS** | Notification preferences → "This isn't available in this version of the app yet."; visible at ~1.5 s, gone by ~3 s. |

## 4. Results — section 6 (reset by email from Settings)

| Item | Result |
|---|---|
| Account with verified email: Change password → "Forgotten your current password?" (link where 1.11r1 puts it) → 1.11r2 shows the address and "Send reset link" (copy exact) → 1.11r3 Info banner, "Done" returns to Settings | **PASS** |
| Link from console opens in Chrome; new password set; old password fails; other sessions signed out; link single-use | **PASS** (the page submit was done by API after my typing misfired in Chrome — setup slip, not an app defect; second use → 401 and Chrome shows "Link no longer valid") |
| No verified email (Nimali): 1.11r4 copy exact; "Add an email" opens the Email screen; Back → r4 → Back → Settings | **PASS** |

## 5. Findings (new)

### E2E-19 — BLOCKER — The six code boxes can't be tapped: tapping them never opens the keyboard
- **Screens:** registration code step (1.3), code login (1.7), phone change pending (1.12b), any `CodeInputNumeric`. 411 dp and 360 dp.
- **Steps:** reach the code step and tap any of the six boxes.
- **Expected:** keyboard opens; the component's own comment says "Tapping anywhere on the row focuses it."
- **Actual:** nothing. `mInputShown=false`. The real input is an invisible ~8 dp-wide strip at the far right edge of the row (UI tree: `EditText '6-digit code' (1008,678)-(1032,834)`); only tapping that sliver opens the keyboard. A first-time user cannot enter the SMS code except by finding the sliver. Related: the boxes no longer span the full row at 411 dp (right ~35 dp gap), and the typed digits show through as faint ghost text to the right of the boxes (`R2-9-after-paste-login-360dp.png`).
- **Cause (confirmed):** `CodeInputNumeric.js:98` spreads `StyleSheet.absoluteFillObject`, which **does not exist in React Native 0.86** (`StyleSheetExports.js` exports only `absoluteFill`), so the hidden `TextInput` is an ordinary flex child instead of overlaying the row. Same root cause: E2E-20, E2E-21.
- **Evidence:** `R2-1.3-code-boxes-360dp.png`, `R2-1.3-code-filled-411dp.png`.
- **File:** `mobile/src/components/CodeInputNumeric.js:98`.

### E2E-20 — MINOR — Sign out dialog has no scrim
- **Steps:** Settings → Sign out. **Expected:** `color/overlay/scrim` at 40 % over the whole screen incl. status bar. **Actual:** nothing dims; header, status bar and page are unchanged (pixels at status bar, header and page background identical before/after).
- **Cause:** `AccountSettingsScreen.js:183` `...StyleSheet.absoluteFillObject` (see E2E-19). **Evidence:** `R2-1.10s-signout-dialog-scrim-360dp.png`.

### E2E-21 — MINOR — Loading spinner sits at the bottom edge of the button, clipped
- **Steps:** any loading primary button (Send code, Log in with the row lock held, Delete my account). **Expected:** spinner centred. **Actual:** spinner half-clipped at the bottom edge; button width/position are correct.
- **Cause:** `Button.js:136` `...StyleSheet.absoluteFillObject` (see E2E-19). **Evidence:** `R2-1.2-sending-411dp.png`, `R2-7-submitting-360dp.png`, `R2-24-deleted-t2.png`.

### E2E-22 — MAJOR — "Account deleted" (1.17d) is never shown; deleting jumps straight to role selection
- **Steps:** Settings → Delete account → password → "Delete my account".
- **Expected:** "Account deleted" with only "Back to the start"; hardware Back inert.
- **Actual:** the red loading button is shown for ~1 s, then the app is on "Create account / Step 1 of 4". Six timed screenshots (`R2-24-deleted-t1…t6.png`): t1–t2 loading, t3–t6 role selection. The person gets no confirmation. (Seen on both throwaway deletions.)
- **Likely cause:** the delete flow signs out, and the new global signed-out handling (E2E-02 fix) resets the stack before `step="deleted"` renders. **File:** `AccountDeleteAccountScreen.js` (`signOut()` then `setStep("deleted")`), `AuthContext.js`/navigation reset.

### E2E-23 — MINOR — Onboarding artwork is off-centre; title wraps
- **Steps:** first run, card 1. **Expected (0.2):** `art` 200×200 at `@80,150`, i.e. centred on a 360 dp frame; title `312×32` on one line. **Actual (360 dp):** the disc centre is ~124 dp instead of 180 dp (≈56 dp too far left; the art frame starts at ~24 dp, not 80); at 411 dp it is likewise left of centre. "Local work, verified people" wraps to two lines, pushing the body down.
- **Evidence:** `R2-0.2-card1-after-splash-360dp.png`, `R2-firstrun-splash-411dp.png`. **File:** `mobile/src/screens/firstrun/FirstRun.js`, `OnboardingArt.js`.

### E2E-24 — MINOR — With the keyboard open, the focused last field of registration step 4 is half hidden behind the pinned button
- **Steps (360 dp):** details step → tap Legal name. **Actual:** the field's lower half is under the pinned "Create account" bar and the counter beneath it (shown from 90 chars) is not visible while typing. (A side effect of fixing E2E-04: the bar rides up but the scroll doesn't keep the field and its helper line above it.) **Evidence:** `R2-1.4cnt-legal-name-360dp.png`.

### E2E-25 — MINOR — Stale error/banner state after the user edits
- Registration email field: after "This email address is already in use." the field stays red with the message after I cleared the text. Login: after the paused banner ("Too many attempts…") the banner stays when the phone number is changed to another account (Log in re-enables correctly). **Evidence:** `R2-1.4cnt-legal-name-360dp.png` (top), `R2-7c-after-number-edit-360dp.png`.

### E2E-26 — MINOR — After a session-end redirect the login screen has no way back except exiting the app; the generic notice is misleading for a suspension
- **Steps:** signed-in user is suspended (DB), tap something that makes a request → app goes to Log in with "You were signed out — your session ended, or your password was changed on another device… If that change wasn't you, reset your password now." (generic, and wrong for a suspension). Attempt login → the suspended banner replaces it (good), fields are disabled, **no back chevron, hardware Back leaves the app**; the screen keeps the suspended state until force-stop even after the account is restored. 1.6sus draws a chevron to 1.1.
- **Evidence:** `R2-2-suspended-redirect-360dp.png`, `R2-10-suspended-login-360dp.png`. **File:** `LoginScreen.js` (chevron hidden while `sessionEndReason`; fields `editable={!suspended}`).

### E2E-27 — LOW — At 200 % text the first character of truncated Settings values is clipped
- "\ery.lon…ple.com", "\mal…rera"; the right chevron of the longest rows ("Notification preferences", "Help — how YouthLink works") is partly cut. **Evidence:** `R2-6-settings-font2-360dp.png`. (Tab-bar labels now fit at 2.0.)

### E2E-28 — LOW (accessibility, unverified with TalkBack) — Primary buttons expose "busy" as their accessibility name
- The UI tree reports `content-desc="busy"` for the primary buttons on many screens (Continue disabled, Log in enabled on the code step, Verify, Delete…), not their label. `Button.js` sets `accessibilityState={{ disabled, busy: loading }}`; uiautomator folds the state into the name. Needs a TalkBack check; if it reads "busy" for idle buttons it is a defect.

### E2E-29 — LOW (observation) — Changing display size or font scale restarts the app
- `adb shell wm density 480` mid-registration returned to step 1 (code step lost); changing `font_scale` returned to the Home shell. The manifest `configChanges` omits `density`/`fontScale`, so the activity is recreated and navigation state is lost. Rare for users; noted because it affects the "interrupted flow" check.

### E2E-30 — LOW (copy) — Registration says "This email address is already in use." while Settings says "This email is already on another account. Try a different address."
- Neither registration string is drawn; consider one wording.

## 6. Still NOT tested, and why
| Item | Why |
|---|---|
| SMS autofill into the code input (E2E-09) | Needs a real phone/SIM; emulator cannot receive SMS. Paste and burst entry were tested. |
| Plain Backspace in the new single-input code field | Not exercised after the rework (only select-all+delete). |
| E2E-04 on a **stable** Android image or a physical phone | Only the Android 17 preview AVD was available. |
| TalkBack behaviour (E2E-28) | Not run. |
| Individual-employer registration to completion; Business bio at registration (300 cap/counter); verifier registration beyond the role/step counter | Time; Business path and the shared code/details steps were covered. |
| Worker-role Settings delete success on a *registered* account with ratings | Throwaway accounts have no ratings; seeded Dilrukshi was deleted via API only (and re-seeded). |
| "1 engagement completed" (singular) in the UI | No seeded employer has exactly one; code inspected only. |
| Splash screenshot | The 2 s splash was detected by colour sampling; no clean screenshot saved. |
| Figma comparison of every screen | Compared 1.1, 1.10 and the deleted showcase frame (1.17d); the rest were checked against the written prototype. |
| 411 dp coverage of most screens | Almost all UI work was at 360 dp; at 411 dp: onboarding card 1, phone step, code step, first-run, role selection. |
