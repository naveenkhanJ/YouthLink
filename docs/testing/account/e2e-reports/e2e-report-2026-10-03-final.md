# Final test run — Account module (report only; nothing fixed, committed or pushed)

Tester: Claude (agent), Asia/Colombo, 2026-10-03. `develop` @ `83867fd` ("Merge pull request #48 …", includes `4f26fdd` focus-scroll fix, `881282d` window background + unbroken address, `10d959a` pinned delete button). No source file changed, no commit/push. `git status --short` at the end: **clean** (`backend/package-lock.json` restored with `git checkout --`, as authorised).

Evidence: screenshots `C:\Users\Afham\e2e-screens\R5-*` (89 files), raw data `C:\Users\Afham\e2e\r5\` (recordings `A3_*.mp4`, `A5_warm*`, node dumps, keyboard dumps `~\e2e\r3\kb_r5_*`), logs `~\e2e-logs\r5\`.

## 1. Setup log

| Step | Result |
|---|---|
| `git checkout develop && git pull`; `git log --oneline -1` | already up to date; `83867fd Merge pull request #48 from naveenkhanJ/feature/account-management-afham` |
| `node -v` / `npm -v` | `v24.13.0` / `11.6.2` |
| `cd mobile && npm ci` | **success**, `git status` clean afterwards |
| backend `npm install`, `prisma generate`, `migrate deploy`, `db seed` | OK, "No pending migrations"; `npm install` rewrote `backend/package-lock.json` (npm 11 effect) → restored at the end |
| API | `node --trace-deprecation --experimental-strip-types index.js`; whole run: **0 deprecation warnings, 0 "Unhandled error"** lines |
| Native rebuild | uninstall ✓; first `prebuild --clean` failed with `EBUSY` (a Gradle daemon from the earlier release build held `android/app/build`) — killed the daemons, re-ran: exit 0. `strings.xml app_name` = YouthLink; `colors.xml activityBackground` = `#ffffff` (was brand blue). `expo run:android` BUILD SUCCESSFUL 1m39s; Metro `--dev-client --clear` (cold bundle 12 s). |
| Emulator | AVD Pixel_8, Android 17 preview, Play Store image, 1080×2400; 411 dp = density 420, 360 dp = `wm density 480`. No physical phone. |
| Firebase numbers | only +94 77 000 0091 (111222) / 0092 (333444) for SMS; +94770000001/0002 for code login (123456 / 654321) |

## 2. Part A — the six fixes

| # | Check | Width | Result | Evidence |
|---|---|---|---|---|
| A1 | Step 4, keyboard open, each focused field and its helper/counter fully visible | 360 | **FAIL** (partly) — Password (field 576–696 px), Email (576–696), NIC (576–696, helper line visible) are fine. **Birthdate** (field 1167–1239 px, scroll view bottom 1239) is **cut by the bar** (bottom border and nothing below it visible). **Legal name** (99 characters typed): field 1119–1239 px, scroll view 132–1239 px, bar 1275–1419 px, keyboard top 1491 px → field ends **flush with the scroll view's bottom, bottom border clipped, "99 / 100" counter (y 1263–1239 → below the scroll edge) not visible**. Identical to round 4. A manual drag of the content with the keyboard open does reveal it (field 665–785 px, counter 809–861 px, terms box below), so the screen has the room; the automatic scroll just doesn't take it there for the last two fields. | `R5-A1-birthdate-kb-360dp.png`, `R5-A1-legalname-kb-360dp.png`, `R5-A1-legalname-kb-scrolled-360dp.png`, `kb_r5_A1_*.txt` |
| A2 | Code login, wrong code `999999`, keyboard open: whole error line visible; Resend and links reachable | 360 | **PASS** — error text 173–213 dp, "Resend code" 229–273 dp, all above the scroll edge (413 dp) with the keyboard open; "Use password instead" (321–365) and "Trouble getting in?" (365–409) are in view too; scrolling still works. | `R5-A2-codelogin-wrong-kb-360dp.png`, `r5\A2_nodes.txt` |
| A3 | No coloured band in transitions (sign-out slide-in; Settings → Change password → back; dark theme) | 360 | **PASS** — recorded the transitions (`screenrecord`, 27 and 49 frames) and checked the 6-px edge columns of every frame: **0 brand-blue pixels**; longest continuous dark run 1–2 px (text sliding in) in light theme and with `cmd uimode night yes` (the app stays light; no dark band). | `r5\A3_signout_light.mp4`, `A3_dark_changepw_signout.mp4`, `R5-A3-dark-theme-settings-360dp.png` |
| A4 | Link-sent screen: full stop not alone at the start of a line; no odd character | 360 / 411 | **FAIL at 360 dp, PASS at 411 dp.** The text now contains a word-joiner (`\u2060`) after the address. 411 dp: "…amal@example.com." stays on one line ✓. **360 dp: the address fills line 1 and "." still starts line 2** (". Check your inbox, …"). No visible box/blank character in either. | `R5-A4-linksent-360dp.png`, `R5-A4-linksent-411dp.png` |
| A5 | Splash from force-stop ×5 | 411 | **PASS** — all five: native splash 3.1–3.3 s (dev build, Metro), then app splash blue + mark, wordmark/tagline appearing after 0.39 s and staying ≈ 1.5 s, app splash total ≈ 2.0 s (UI after 1.9–2.2 s); **no white frame at the handoff** (the only non-blue frame is the known 7–35 ms black frame, as in round 4 for the dev build; none of the frames is white); the mark stays at y0 = 0.461. | `r5\A5_warm1..5_seg.txt` |
| A6 | Delete password step: pinned red button, disabled until typed, 24 dp above the keyboard on both widths, field + note visible, wrong password error, success → "Account deleted" | 360 / 411 | **PASS** — intro: button at the foot of the content (unchanged). Password step: red "Delete my account" in a bar (360 dp: 728–776 dp; 411 dp: 842.7–890.7 dp), **grey/disabled while empty**; keyboard open: **CTA bottom → keyboard top = 72 px = 24 dp at 360 dp and 62 px = 24 dp at 411 dp** (round 3: 51 / 180 dp); Password field (456–576 px) and the "Re-enter your password to confirm…" note are visible above the bar; wrong password: red field + "That password doesn't match your account. Please try again."; correct password → "Account deleted" (no header, only "Back to the start") → role selection; reopen after force-stop → role selection. | `R5-A6-*-360dp.png`, `R5-A6-*-411dp.png`, `kb_r5_A6_pw_360/411.txt` |

## 3. Part B — smoke pass

| # | Area | Result |
|---|---|---|
| B1 | First run | **PASS** — clear data → splash → card 1; 360 dp: disc top **214.0**, title **436**, body **484 / 516 / 516**, Skip right edge 344, identical on all three cards; 411 dp: disc 220.9 identical; "Next ×2 → Create account" and "Skip" both reach role selection; force-stop on card 2 → card 1 again. |
| B2 | Registration | **PASS** (one FAIL via A1) — worker (0091/111222 ✓), employer Individual (0092/333444 ✓), employer Business with name + bio (✓, profile shows business name + bio), verifier (✓ "Vouching since today · nobody yet"); wrong code → six red 1 dp boxes + message; Resend → countdown; every details validation: empty required fields (password / NIC / birthdate errors), password mismatch "Passwords do not match.", under-18 birthdate "YouthLink is for people aged 18 and over…", duplicate NIC "This NIC is already registered. You can log in instead…", duplicate email "This email is already on another account. Try a different address."; Terms link opens "Terms & Privacy" (1.20) and returns to the (now expired-code) flow — navigating back from Terms lands on the code step with "This code is no longer valid. Tap Resend for a new one." (the form values are kept; re-verifying returns to Step 4). |
| B3 | Login | **PASS** — right password; wrong → plain message (1–2), "2 attempts left…" (3), "Too many attempts — password login is paused for 15 minutes. You can log in with a code instead." with **Log in disabled** (5); code login on the paused account works and clears `lockedUntil`; suspended account: banner, both fields disabled, Log in disabled, back chevron present; "You were signed out…" notice shown after a session end (checked in round 4's flow, re-seen here after the API password reset). Observation: Log in turns grey (disabled) from the **third** failed attempt on (banner "2 attempts left") — see E2E-49. |
| B4 | Forgot password | **PASS** — SMS reset (code from the console `[Mock SMS]`, new password, log in); email reset (link from the console opens Chrome, "Reset password" page sets the password, success text "You can now log in to YouthLink with your new password."; second use → "Link no longer valid"); "Neither of these works for me" → recovery form → "Request received…" → `node prisma/review-recovery.js approve` → status "Your account has been recovered. Set a new password to finish." → new password → log in as Nimali ✓. |
| B5 | Settings | **PASS** — all rows present with values (Business: Change password, Phone, NIC "•••• 5679", Email, Display name, Business name & bio, Posting as, Notification preferences, Help, Sign out, Delete account); Notification preferences → toast "This isn't available in this version of the app yet."; Help opens; Display name cap/counter "100 / 100"; NIC correction: duplicate → "This NIC is already registered to another account. Check the number for a typo." (signed-in wording), valid → "•••• 5681"; Email add → "Pending" → console link "Email confirmed" → Settings shows the new address; Business name & bio edit with "44 / 300"; Posting as Business → Individual; phone change (round 4) and the success card re-seen via the earlier runs. |
| B6 | Delete | **PASS** — Amal (active engagement) blocked with the engagement named and the button disabled; throwaway accounts (worker, individual employer, verifier): wrong password error, success → "Account deleted" (no header) → Back to the start → role selection; kill and reopen → role selection. |
| B7 | Launch states (force-stop) | **PASS (spot check)** — signed in → home shell; signed out → Log in with "77 000 0006"; the full 11-row matrix was run in round 4 and nothing in this build touched that logic. |
| B8 | Own profile | **PASS** — worker new (Worker Test: "New to YouthLink", add-bio link, ENDORSEMENTS empty, "My endorsement code", Settings), worker with history + endorsement (Amal: 5.0 / "from 1 rating" / "100% completion · 2 jobs" / bio / endorsement by Sunil Teacher), employer Business (Silva Events + bio), employer Individual (legal/display name), count **"1 engagement completed"** (Dilrukshi) and **"2 engagements completed"** (Kamal), verifier; tab bars per role (Browse/Applications/Engagements/Notifications/Profile; Postings/Post a Gig/…; Endorsements/Vouch/…); "Phone verified" badge; no NIC badge. |
| B9 | Dialogs and states | **PASS** — scrim 40 % over status bar/nav bar (160,163,169), phone-updated in-app card (round 4), spinners centred (Log in locked state), code boxes tappable at 360 and 411 dp, no ghost digits, button label without "busy" after loading (round 4 data; this build touched none of it). |
| B10 | Fonts and layout | **PASS** — Inter visible everywhere; header divider 99.3–99.7 dp at 360 dp; Settings at font 2.0: labels wrap, "Dilrukshi Her…" truncates with a tail ellipsis, chevrons visible (`R5-B10-settings-font2.0-411dp.png`). |

## 4. Findings (new)

### E2E-48 — MINOR — Registration Step 4 (360 dp): Birthdate and Legal name are still cut by the pinned bar with the keyboard open (A1 not fixed)
- **Steps:** registration → Step 4 → tap Birthdate, then Legal name (type ≥ 90 characters).
- **Expected:** focused field and its counter fully visible above the bar.
- **Actual:** Birthdate 1167–1239 px (bottom cut at the scroll edge 1239); Legal name 1119–1239 px, border cut, "99 / 100" at 1263 px (below the scroll view). Password, Email and NIC are right (they land at 576 px). Dragging the content by hand with the keyboard open brings both fully into view, so the scrollable room exists.
- **Evidence:** `R5-A1-birthdate-kb-360dp.png`, `R5-A1-legalname-kb-360dp.png`, `R5-A1-legalname-kb-scrolled-360dp.png`. **Files:** `mobile/src/screens/account/hooks/useFocusScroll.js` (`scrollTo` with `margin = 120` → for the last fields the target offset is larger than the scroll range at the moment it runs, i.e. before the keyboard has shrunk the view / content padding is added), `RegisterScreen.js` details `ScrollView` `paddingBottom`.

### E2E-49 — LOW (A4 not fixed at 360 dp) — The full stop still starts a line on the "link sent" screen at 360 dp
- Text now has a word-joiner but the line breaks before the full stop anyway at 360 dp (`R5-A4-linksent-360dp.png`); 411 dp is fine. Suggestion for the developer: allow the break inside the address instead (put the sentence's full stop in the same unbreakable token as the last domain segment, or shorten "to" so the address wraps), or accept it.

### E2E-50 — LOW (observation) — "Log in" turns disabled after the third failed attempt, before the account is paused
- After 3 wrong passwords the banner reads "2 attempts left before password login is paused…" and Log in is grey even with a new, correct password typed (the button stayed grey; the DB shows `failedLoginAttempts` 3 and no lock yet). Re-typing the phone number re-enables it. The brief says "5 wrong = paused with Log in disabled"; I could only get the 4th and 5th attempts by re-entering the phone number each time. `LoginScreen.js:77` (`setPaused(/paused/i.test(formError))` — the "2 attempts left … paused for 15 minutes" banner contains the word "paused", so the 3rd failure flips the screen into the paused state). **Evidence:** `R5-B3-attempt5-411dp.png`, `R5-B3-correct-pw-after-3-failures-411dp.png`.

(No other new findings. The pre-existing LOW items from earlier rounds — dev-build splash black frame E2E-44, resend-countdown accessibility node E2E-45 — were not re-checked beyond A5.)

## 5. Still NOT tested, and why

| Not tested | Why |
|---|---|
| Real phone (A1/A2/A6/B2 on a device, SMS autofill, TalkBack for Log in, code step and loading button) | no physical phone |
| A1 on a stable-Android image | Play-Store API 35 image not installed (download ≈ 1.7 GB was abandoned in round 3) |
| A1/A2 at 411 dp | the brief asks for 360 dp; round 4 numbers for 411 dp are in the earlier report |
| Full launch-state matrix B7 rows 1–11 again | done in round 4 on the same logic; only a spot check here |
| Phone change success card re-run | covered in rounds 3–4 (nothing in this diff touches it) |
| TalkBack speech text | not exposed over adb |

## 6. Verdict

**Not clean yet, but nothing blocking.** The Account module works end to end — registration for all four roles, every login path, both reset paths, account recovery, Settings, deletion (blocked and real), own-profile screens, launch states, dialogs and fonts all pass, A2, A3, A5 and A6 are fixed. Two items from the fix list are **not** fully fixed and would be visible in a demo **at 360 dp**: (1) on registration Step 4 the **Legal name and Birthdate fields still sit under the pinned "Create account" bar with the keyboard open, and the "N / 100" counter is hidden** (E2E-48, the most noticeable one — it is the last field everyone types into); (2) on "Reset your password → link sent" the **full stop still starts the second line** at 360 dp (E2E-49; fine at 411 dp). A smaller surprise a demo could hit: after the third wrong password the Log in button greys out before the 5-attempt pause (E2E-50). Nothing crashes, no screen is blank, and no data-loss path was found.
