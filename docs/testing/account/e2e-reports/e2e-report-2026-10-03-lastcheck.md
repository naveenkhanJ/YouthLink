# Last check — branch `feature/account-management-afham` (report only; nothing fixed, committed or pushed)

Tester: Claude (agent), 2026-10-03. Evidence: `C:\Users\Afham\e2e-screens\R6-*`, data `~\e2e\r6\`, logs `~\e2e-logs\r6\`.

## Setup log
- `git log --oneline -3`: `b46a1cf fix(mobile): start the email address on its own line on the link-sent screen [FR-ACC-10, FR-ACC-11]` / `f9ab9cd fix(mobile): scroll the focused field after the keyboard resizes the list; pause Log in only on a real lockout [FR-ACC-01, FR-ACC-09]` / `83867fd Merge pull request #48 …`. Top commit is the expected one. `node v24.13.0`, `npm 11.6.2`.
- `mobile: npm ci` succeeded and left `git status` clean (first attempt failed with EPERM on `fb-dotslash/…/dotslash.exe` because Metro was still running; after stopping Metro and the API it passed). Backend `npm install / generate / migrate deploy (nothing pending) / seed` OK; `npm install` changed `backend/package-lock.json` → restored at the end; `git status` clean now. API started with `--trace-deprecation`: 0 deprecation warnings, 0 unhandled errors. No native rebuild; Metro `--dev-client --clear` (fresh bundle served), app force-stopped and reopened. Pixel_8, Android 17 preview, Play Store image, 360 dp (reset to 411 dp afterwards), numbers 0091/111222 and 0092 used for SMS only.

## Results (360 dp unless stated)

| # | Item | Result | Numbers / evidence |
|---|---|---|---|
| C1 | E2E-48 Step 4, keyboard open | **PASS** | Keyboard top 1491 px, scroll view 132–1239 px, bar 1275–1419 px. **Birthdate** field 606–678 px (was 1167–1239, cut). **Legal name** (99 chars) field **576–696 px** (was 1119–1239 flush), label 492–552, **"99 / 100" counter 720–772 px**, terms box below also visible. Password 576–696 px (keyboard top 1404), Email 576–696, NIC 576–696 — all fine. After dismissing the keyboard (Back) the form stays where it is, nothing jumps (Password, Confirm, Email, NIC, Birthdate, Legal name all visible above the bar). `R6-C1-birthdate-kb-360dp.png`, `R6-C1-legalname-kb-360dp.png`, `R6-C1-password-kb-360dp.png`, `R6-C1-after-dismiss-360dp.png`, `kb_r6_C1_*.txt` |
| C2 | E2E-49 link-sent text | **PASS** at 360 and 411 dp | Text is `We've sent a reset link to\namal@example.com. Check your inbox, and your spam folder if it isn't there.` — line 1 "We've sent a reset link to", line 2 "amal@example.com. Check your inbox, and" (360 dp) / "amal@example.com. Check your inbox, and your" (411 dp); the full stop never starts a line; no odd character. `R6-C2-linksent-360dp.png`, `R6-C2-linksent-411dp.png` |
| C3 | E2E-50 lockout | **PASS** | Kamal, phone not edited: attempts 1–2 plain message; after the 3rd "…2 attempts left before password login is paused for 15 minutes." and with a new password typed **Log in is brand blue (15,61,145), active** (DB: 3 failures, no lock); 4th "1 attempt left…"; **5th: "Too many attempts — password login is paused for 15 minutes. You can log in with a code instead." and Log in grey/disabled even with a password typed; editing the phone number clears the banner and re-enables Log in (blue)**. After a reset of the counter, 2 wrong + correct password on the 3rd attempt logs in (Employer shell, DB counters 0). `R6-C3-after3-typed-360dp.png`, `R6-C3-attempt5-paused-360dp.png`, `R6-C3-phone-edited-360dp.png`, `R6-C3-correct-after-3-360dp.png` |
| C4 | Regression | **PASS** | Worker registration 0091/111222: details → Create account → Worker shell (`R6-C4-home-shell-360dp.png`). Code login with wrong code 999999, keyboard open: error text 197–237 dp, "Resend code"/countdown and links visible, scroll view bottom 413 dp, Log in 425–473 dp; all six boxes red; the error is fully visible above the bar. `R6-C4-codelogin-wrong-kb-360dp.png` |

## New findings
None (E2E-51+ not needed).

## Verdict
**Ready to merge.** All three fixes (E2E-48, E2E-49, E2E-50) pass and the touched screens did not regress. State left: git clean, DB reseeded, density reset to 411 dp.
