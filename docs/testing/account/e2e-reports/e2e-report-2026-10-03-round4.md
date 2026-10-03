# E2E retest, round 4 — Account module (report only; nothing fixed, committed or pushed)

Tester: Claude (agent), Asia/Colombo, 2026-10-03. `develop` @ `0e1a29a` ("Merge pull request #47 …"). I changed no source file and made no commit, push or branch change. `git status --short` at the end shows **one** modified file, `backend/package-lock.json`, caused by `npm install` under npm 11.6.2 (known npm-version effect, see §1); I did not restore it because this round gave no authorisation for `git checkout`. Restore with `git checkout -- backend/package-lock.json` if you want it clean.

Evidence: screenshots `C:\Users\Afham\e2e-screens\R4-*` (64 files), raw data `C:\Users\Afham\e2e\r4\` (UI-tree dumps with bounds `6a_*/6b_*`, recordings `*.mp4`, segment analyses `*_seg.txt`, logcat `6c_*`), scratch tools `C:\Users\Afham\e2e\` (`launch4.sh`, `seg4.py`, `allnodes.py`, `cap6c.sh`, …). Notes: `C:\Users\Afham\e2e\NOTES-r4.md`.

Method notes. (1) App screenshots are 1080×2400; Figma frames 360×800 fetched with `get_screenshot`; "ink bands" compared per frame as in round 3, status-bar inset (44 dp at 360 dp, 50.3 dp at 411 dp) removed for top-anchored content. (2) **`uiautomator dump` lags and is sometimes stale on this emulator** (it kept reporting the "Resend code" link while the screen showed the countdown, and the previous screen for ~10 s after navigations), so every visual claim is from a screenshot; bounds quoted from dumps were taken on idle screens. (3) Splash recordings: `screenrecord` 540×1200, ≈ 10 fps variable frame rate, decoded frame by frame with OpenCV; a frame lasts until the next frame's timestamp, so durations are exact to the frame (≈ ±16–100 ms). All recordings are of the **development build** with Metro (`npx expo start --dev-client --clear`) unless marked release.

---

## 1. Setup (as run)

| Step | Result |
|---|---|
| `git checkout develop && git pull` | already on `develop`, "Already up to date". `git log --oneline -1` → `0e1a29a Merge pull request #47 from naveenkhanJ/feature/account-management-afham` (previous: `04de936 chore(mobile): remove the adaptive round icon plugin…`) |
| `node -v` / `npm -v` | `v24.13.0` / `11.6.2` |
| `git status --short` before installs | clean |
| **`cd mobile && npm ci`** | **SUCCESS** (exit 0): "added 581 packages, and audited 582 packages in 39s". `git status --short` afterwards: **clean**. → **E2E-39 fixed.** |
| backend: `npm install`, `prisma generate`, `prisma migrate deploy`, `prisma db seed` | all OK ("No pending migrations to apply", seed clean). `npm install` (npm 11.6.2) rewrote `backend/package-lock.json` again: 8 insertions, 29 deletions (adds `"peer": true`, removes `@emnapi/core` / `@emnapi/runtime`), identical to round 3 (E2E-18, npm-version effect; `r4_backend_lock_npm11.diff`). |
| API | `node --trace-deprecation --experimental-strip-types index.js` (log `~/e2e-logs/r4/backend.log`). **No DeprecationWarning** and no unhandled error during the whole run. |
| Native rebuild | `adb uninstall lk.youthlink.app` ✓; `npx expo prebuild --clean --platform android` exit 0 (only warning: `android: userInterfaceStyle: Install expo-system-ui…`); `npx expo run:android` **BUILD SUCCESSFUL in 2m 19s** (JDK 21), installed on Pixel_8. |
| `app_name` in `android/app/src/main/res/values/strings.xml` | `<string name="app_name">YouthLink</string>` ✓ |
| `<application …>` line of `AndroidManifest.xml` | `<application android:name=".MainApplication" android:label="@string/app_name" android:icon="@mipmap/ic_launcher" android:roundIcon="@mipmap/ic_launcher_round" android:allowBackup="true" android:theme="@style/AppTheme" android:supportsRtl="true" android:enableOnBackInvokedCallback="false" android:fullBackupContent="@xml/secure_store_backup_rules" android:dataExtractionRules="@xml/secure_store_data_extraction_rules">` |
| Emulator | AVD `Pixel_8`, `google/sdk_gphone16k_x86_64/emu64xa16k:17/CP31.260623.012/16064790:user/dev-keys` = Android 17 preview, **Play Store image**, 1080×2400; **411 dp** = density 420 (default), **360 dp** = `wm density 480`. No physical phone. |
| Firebase numbers | only +94 77 000 0091 (111222) and +94 77 000 0092 (333444) for SMS (registration code step, phone change). Seeded +94 77 000 0001 (code 123456) for code login. Amal's number is +94 77 000 0091 after launch-state row 6. |
| DB writes (local, scratch) | row locks for the loading states, one password reset by API, deletion of Sunil (row 8). Not restored: run `npx prisma db seed` to reset. |
| First launch after install | black screen for ≈ 21 s until Metro finished its cold bundle ("Android Bundled 21211ms"), then splash → onboarding. Not representative; all timings below are with Metro warm. |

---

## 2. Results — A. App name and icon (411 dp)

| Place | Result | Evidence |
|---|---|---|
| App drawer | label **"YouthLink"** under the brand mark | `R4-icon-appdrawer-411dp.png`, `R4-icon-zoom-appdrawer-411dp.png` |
| Recents | task title "YouthLink" | `R4-icon-recents-411dp.png` |
| Settings → Apps → App info | title "YouthLink"; entry "YouthLink" in the All apps list | `R4-icon-appinfo-411dp.png`, `R4-icon-settings-apps-list-411dp.png` |
| Icon | white arcs + dot on `#0F3D91`, circular mask, mark within the circle with a margin (not cropped) | zoom image |

PASS. (**E2E-35 fixed.** I judged the icon from the drawer, as instructed; I did not add a home-screen shortcut.)

## 3. Results — B. Launch states (411 dp, each from a force-stop, recordings `r4\row*.mp4`)

| # | Starting situation | Result | Evidence |
|---|---|---|---|
| 1 | cleared data, never signed in | splash → onboarding card 1 "Local work, verified people" | `R4-row1-after-cleardata-411dp.png`, `row1_cleardata.mp4` |
| 2 | Skip on card 1, force-stop, reopen | splash → role selection ("Create account", Step 1 of 4), no cards | `R4-row2-*` |
| 3 | stop on card 2, reopen | splash → card 1 again | `R4-row3-reopen-411dp.png` |
| 4 | signed in (Amal), force-stop, reopen | splash → Worker shell, no Log in | `R4-row4-reopen-411dp.png` |
| 5 | Settings → Sign out, force-stop, reopen | splash → **Log in with "77 000 0001" filled in**, subtitle "Log in to pick up where you left off." | `R4-row5-reopen-411dp.png` |
| 5b | the sign-out transition itself | straight from Settings to Log in; I inspected every frame of the handoff (nine consecutive frames, 1694–1845 ms): **no role-selection frame, no flicker**. Cosmetic: for ≈ 70 ms a brand-blue vertical sliver is visible at the screen edge while Log in slides in (window background showing) → E2E-47 | `R4-row5-signout-transition-frames-411dp.png`, `row5_signout_flow.mp4` |
| 6 | changed phone before signing out (0001 → 0091, code 111222), then Sign out | Log in shows **"77 000 0091"** immediately and after force-stop + reopen | `R4-row6-reopen-new-number-411dp.png` |
| 7 | password reset via API while signed in; tap Profile | Log in with the **"You were signed out — your session ended…" notice** and the number (+94 77 000 0091); after force-stop + reopen: Log in with the number, notice no longer shown | `R4-row7-notice-411dp.png`, `R4-row7-reopen-411dp.png` |
| 7b (extra) | session ended server-side **while the app was closed**; reopen | splash → Worker shell (stale token); the first tap (Profile) shows Log in + the "signed out" notice | `R4-extra-reopen-session-ended-411dp.png` |
| 8 | delete Sunil (throwaway), "Back to the start", force-stop, reopen | **role selection** (not Log in, not the cards) | `R4-row8-account-deleted-411dp.png`, `R4-row8-reopen-411dp.png` |
| 9 | Amal signs out; Kamal signs in and out; reopen | Log in shows Kamal's number "77 000 0002" | `R4-row9-reopen-B-number-411dp.png` |
| 10 | code login (+94 77 000 0001, 123456), sign out, reopen | Log in with "77 000 0001" | `R4-row10-reopen-411dp.png` |
| 11 | back chevron / hardware Back on the cold-started Log in | **chevron → role selection** (Create account, Step 1 of 4); **hardware Back → leaves the app** (launcher). Never a blank screen. The two differ, which is fine per your note ("role selection or app exit"). | `R4-row11-after-chevron-411dp.png`, `R4-row11-after-hwback-411dp.png` |

All 11 rows PASS (plus 5b and 7b).

## 4. Results — C. Header position (360 dp, Figma frames 1.10 `73:140`, 1.11 `74:149`, 1.17 `75:225`, plus 1.8 `72:114`, 1.11r2 `2862:48`, 1.11r3 `2862:64`)

| Frame | App screen | Offsets (app − Figma, dp) |
|---|---|---|
| 1.10 Settings | Settings | all 15 element rows **0 or ±1 dp**, x offsets 0 |
| 1.11 Change password | Change password | rows ±1 (+2 at one 4 px band edge), button 0 |
| 1.17 Account deletion | Delete account intro | rows **−1…+1**, button 0 |
| 1.8 Forgot password | Forgot password (channels) | rows 0/±1, button 0 |
| 1.11r2 / 1.11r3 Reset by email | "Reset your password" confirm / link sent | rows ±1 (r2 email text is shorter because the address differs), button 0 |

Direct measurement of the header: **divider at 99.3–99.7 dp** on Settings, Change password and Delete account (expected 44 + 55 = 99 dp); title bbox 63.7–82.7 dp (Figma 20–38 + 44 = 64–82), back chevron 62.7–80.3 dp (Figma 63–80). **PASS — the −11/−12 dp offset is gone (E2E-32 fixed).** Screenshots: `R4-1.10-settings-360dp.png`, `R4-1.11-changepw-360dp.png`, `R4-1.17-delete-intro-360dp.png`, `R4-1.8-forgot-360dp.png`, `R4-I-1.11r2-confirm-360dp.png`, `R4-I-1.11r3-linksent-360dp.png`.

## 5. Results — D. Onboarding positions (spec: art @150, disc @20 inside the art, title @392, body @440 on card 1 / @472 on cards 2–3, Skip @284,24 right-aligned, dots @160,676, button @16,728; all plus the status-bar inset)

| Width | Element | Card 1 | Card 2 | Card 3 | Expected |
|---|---|---|---|---|---|
| **360 dp** (inset 44) | disc top / diameter / centre x | 214.0 / 159.7 / 179.8 | 214.0 / 159.7 / 179.8 | 214.0 / 159.7 / 179.8 | 150 + 20 + 44 = **214** / 160 / 180 ✓ |
| | title top | 436 | 436 | 436 | 392 + 44 = **436** ✓ |
| | body top | 484 | 516 | 516 | 440 + 44 = **484** (card 1), 472 + 44 = **516** ✓ |
| | Skip box | x 284–344, y 68–88 | same | — | right edge 344, top 24 + 44 = **68** ✓ |
| | active dot | x 160, y 676 | x 176 | x 192 | (160, 676) ✓ |
| | button | 16–344 × 728–776 | same | same ✓ |
| **411 dp** (inset 50.3) | disc top / diameter / centre x | 220.9 / 159.2 / 205.9 | same | same | 170 + 50.3 = 220.3 ✓; screen centre 205.7 ✓ |
| | title top | 442.3 | 442.3 | 442.3 | 392 + 50.3 = 442.3 ✓ |
| | body top | 490.3 | 490.3 | 490.3 | card 1 ✓ (440 + 50.3); on cards 2–3 the title is **one line** at 411 dp (32 dp instead of 64) so the body follows it ("follows the title's height", M0) |
| | Skip | x 335.6–395.4, y 74.3–94.5 | | | right margin 15.6 dp, top 24 + 50.3 ✓ |

**PASS at both widths: identical on all three cards, the art does not move when paging (E2E-33 fixed).** Screenshots `R4-onboarding-card{1,2,3}-{360,411}dp.png`.

## 6. Results — E. Code input (registration code step, 360 dp)

| Check | Result |
|---|---|
| Ghost digits over box 1 with six digits typed | **gone.** Box-1 interior: 18 103 pure white pixels, 560 ink, **60 near-white anti-alias pixels — the same 60 as the control box 3**; no `#FAFAFA` ghost (round 3: ghost "111222"). Zoom `R4-1.3-code-ghost-zoom-360dp.png`. → **E2E-37 fixed** |
| Last box colour once six digits are in | all six borders `#E5E7EB` (neutral), **no brand-colour box** → fixed |
| Wrong code (`000000`) | all six borders red, **3 px (1 dp) on left/top/bottom of every box including the last** (measured per box); error "That code doesn't match. Check the 6 digits and try again." fully visible with the keyboard open on this step. `R4-1.3-code-wrong-red-keyboard-360dp.png` |
| Box geometry | 6 × 48×52 dp, gap 8, x 16–344, y 226–278 (360 dp) |

## 7. Results — F. Button accessibility

| Moment | Content-desc of the primary button |
|---|---|
| fresh screen | "Log in" |
| **while loading** (Log in under a 4.6 s row lock; spinner visible in the screenshot) | **"Log in, busy"**, button disabled |
| **after** the wrong-password result (red banner shown) | **"Log in"**, enabled — **no "busy"** |
| Verify on the registration code step after a failed verification | **"Verify"** — no "busy" |
| Create account on the details step (reached after Verify) | **"Create account"** — no "busy" |

PASS (**E2E-31 fixed**). `R4-F-login-loading-360dp.png`, `R4-F-login-after-wrong-360dp.png`. (One of my first dumps taken a few hundred ms too late showed the plain label while the spinner was still on screen; the repeat with several dumps shows "busy" during loading.)

## 8. Results — G. Splash handoff (411 dp, recordings with frame analysis; dev build)

Per run (ms): native splash = blue + mark until the handoff; "handoff dark" = frames between the native and the app splash; "app splash" = from the first app-splash frame to the first UI frame; "plain before UI" = blue **without** the mark just before the UI; "mark y0" = the mark's top edge as a fraction of the screen height in the first app-splash frames (native splash = 0.461).

| Run | native | handoff dark (RGB) | app splash | plain before UI | mark y0 at app-splash start |
|---|---|---|---|---|---|
| warm 2 (force-stop) | 3572 | **24** (0,0,0) | 2239 | 402 | 0.461 |
| warm 3 | 3261 | **32** (0,0,0) | 2223 | 312 | 0.461 |
| warm 4 | 3260 | **33** (0,0,0) | 2277 | 363 | 0.461 |
| warm 5 | 3250 | **13** (0,0,0) | 2234 | 289 | 0.461 |
| warm 6 | 3177 | **35** (0,0,0) | 2212 | 283 | 0.461 |
| (warm 1: disturbed by the density reset, native splash 6.4 s, not counted) | | | | | |
| clear-data 1 | 3752 | **266** (3,16,38) + ≈ 200 ms fade | 1931 | 70 | 0.461 |
| clear-data 2 | 3271 | **14** (0,0,0) | 1932 | 49 | 0.461 |
| 6c A clear-data | 3092 | **13** | 1917 | 66 | 0.461 |
| 6c B clear-data | 3470 | **15** | 1907 | 74 | **0.472** (jump) |
| 6c C clear-data | 3248 | **21** | 1908 | 48 | 0.461 |
| 6c D clear-data | 3469 | **16** | 1897 | 49 | **0.483** (jump) |
| row 2 (force-stop after Skip) | 3450 | 18 | 2133 | 216 | **0.483** (jump) |
| row 4 (signed in) | 3435 | **101** (3,16,38) | 1965 | 0 | 0.461 |
| first clear-data (row 1, right after Metro's cold bundle) | 3780 | **≈ 2999** (0,4,12)/(3,16,38) | ≈ 1900 | | 0.461 |

Findings from the table:
- **Pure-black frame at the native → app handoff: still there in 12 of 13 runs, 13–35 ms (one or two 60 Hz frames), RGB (0,0,0).** Expected "none". (E2E-44)
- **Dark gap after clear-data:** the very first clear-data launch after the cold Metro bundle stayed dark for **≈ 3.0 s**, one later run for 266 ms, the other 11 runs ≤ 35 ms. Round 3 measured ≈ 1.2 s every time. So the gap is no longer constant but is still intermittent and, when it happens, is longer. (E2E-44; see 6c)
- **Mark jump between native and app splash:** none in 10 of 13 runs, but **3 of 13 runs** (6c B, 6c D, row 2) start the app-splash mark **0.011–0.022 of the height lower (≈ 9–18 dp)** and settle up in ≈ 100 ms. Expected none. (E2E-44)
- **Total time on the app splash:** **1.90–1.93 s on clear-data runs** (below the 2 s of round 3's spec), **2.13–2.28 s on warm runs**. The wordmark + tagline are visible for ≈ 1.4–1.5 s in every run. On warm launches the screen is blank blue (mark gone) for **283–402 ms** before the UI appears (round 3: ≈ 50 ms); on clear-data runs 48–74 ms.
- Native splash is **3.1–3.8 s** in the dev build (it waits for the JS root: logcat "Displayed lk.youthlink.app/.MainActivity for user 0: +3s413ms").
- No white flash in any recording.

## 9. Results — H. Keyboard on registration details (360 dp, font 1.0, +94 77 000 0092)

Pixel bounds with the keyboard open (IME inset 909 px → keyboard top y = 1491 px):

| Focused field | Field | Scroll view | Pinned bar (button) | Result |
|---|---|---|---|---|
| **Legal name** (empty) | 90,1121 – 990,1239 | 0,132 – 1080,1239 | 48,1275 – 1032,1419 | field's bottom edge = scroll view's bottom (1239): **flush, bottom border clipped** — **NOT fixed** |
| **Legal name** (≥ 90 characters so the counter should appear) | 90,1119 – 990,1239 | 0,132 – 1080,1239 | same | **counter row is below the scroll view's edge and not visible** — NOT fixed |
| NIC | 90,489 – 990,609 | same | same | field and the helper line "12 digits, or 9 digits + V or X — only the shape is checked." fully visible |
| Email (optional) | 90,249 – 990,369 | same | same | fully visible |

The bar itself rides 72 px (24 dp) above the keyboard. `R4-H-legalname-empty-kb-360dp.png`, `R4-H-legalname-counter-kb-360dp.png`, `R4-H-nic-kb-360dp.png`, `R4-H-email-kb-360dp.png`, `kb_r4_H_*.txt` in `~\e2e\r3\`. → **E2E-42 (E2E-34 unchanged).**

## 10. Results — I. Quick regression pass

| Check | Result |
|---|---|
| Sign out dialog dims everything | status bar and header (160,163,169), nav-bar area (153,156,164), scrim `#111827` at 40 % over the whole screen ✓ (`R4-I-signout-dialog-360dp.png`) |
| "Phone number updated" is an in-app card | ✓ with a single "Done" (`R4-row6-updated-411dp.png`) |
| Account deleted: no header, only "Back to the start" | ✓ (`R4-row8-account-deleted-411dp.png`) |
| Loading spinners centred | Log in (spinner at the button's centre, fields locked, subtitle "Signing you in… fields are locked while we check.") ✓ |
| Code boxes tappable | ✓ (tapping a box opened the keyboard on registration, code login and phone change) |
| Forgot password → **"Send reset link"** with the email option | ✓: Amal (verified email) → options "Text me a code / SMS to +94 77 000 0091" and "Email me a link / To a***@example.com"; selecting Email changes the button to **"Send reset link"**; after sending: "We sent a reset link to a***@example.com. Open it to choose a new password." (**E2E-12 fixed**) |
| 1.11r1 (Change password → "Forgotten your current password?") | ✓ link present, opens r2 |
| 1.11r2 "Reset your password" | ✓ copy exact: "We'll email a reset link to the address on your account. You'll set a new password from there." / the account email / "Resetting your password signs you out on any other device." / button "Send reset link"; layout ±1 dp vs Figma |
| 1.11r3 link sent | ✓ "We've sent a reset link to amal@example.com. Check your inbox, and your spam folder if it isn't there." / "You can keep using the app. The link opens in your browser." / "Done" (returns to Settings); layout ±1 dp. Cosmetic: the sentence's full stop wraps onto the next line by itself (E2E-46) |
| 1.11r4 no verified email (Nimali) | ✓ "There's no verified email on this account, so we can't send a reset link." / "Add an email address — no password needed — then reset your password by email." / button "Add an email" |
| Round 3 E2E-39 (`npm ci`) | fixed (§1) |

---

## 11. Round 3 findings, status

| ID | Round 3 finding | Round 4 |
|---|---|---|
| E2E-31 | buttons keep "busy" | **FIXED** (§7) |
| E2E-32 | ScreenHeader 44 dp instead of 56 dp | **FIXED** (§4) |
| E2E-33 | onboarding positions off spec and moving | **FIXED** (§5) |
| E2E-34 | Legal name flush with the bar; code-login error clipped | **NOT FIXED** (§9; the clipped error line is E2E-43 below) |
| E2E-35 | launcher label "mobile" | **FIXED** (§2) |
| E2E-36 | splash handoff: black frame, long dark gap, mark jump | **dev build: NOT FIXED / intermittent** (black frame 12 of 13 runs, mark jump 3 of 13, dark gap 3.0 s once and 266 ms once, §8); **release build: not reproduced (0 of 6)** (§13 6c) — now E2E-44 |
| E2E-37 | ghost digits across code box 1 | **FIXED** (§6) |
| E2E-38 | delete-password CTA floats far above the keyboard | not re-checked this round |
| E2E-39 | `mobile/package-lock.json` out of sync, `npm ci` fails | **FIXED** (§1) |
| E2E-40 | undrawn additions (1.12b code UI, success card; 1.17d header) | unchanged (observation) |
| E2E-41 | Firebase phone auth fails on a Play-less image | not applicable (Play Store image used) |
| Round 3 §5: 1.3 "Resend in" 12 dp lower than Figma | **FIXED**: Figma 1.3 vs app, countdown ink y 255–265 vs 254–265 (±1 dp); all other rows ±1 dp (`R4-1.3-code-step-countdown-360dp.png`) |

---

## 12. New findings (E2E-42 onwards)

### E2E-42 — MINOR — Registration Step 4: the focused Legal name field still ends flush with the pinned bar; its counter is out of view (E2E-34 unchanged)
- **Steps:** registration → details step at 360 dp, tap Legal name, keyboard open (type ≥ 90 characters to make the counter appear).
- **Expected (round 4 brief H):** the focused field **and its counter/helper line** fully visible above the pinned "Create account" bar.
- **Actual:** field 1121–1239 px, scroll view bottom 1239 px, bar 1275–1419 px: the field's bottom border is cut and the "N / 100" row below it is outside the scroll view and invisible. NIC and Email are fine (§9).
- **Evidence:** `R4-H-legalname-empty-kb-360dp.png`, `R4-H-legalname-counter-kb-360dp.png`, `r3\kb_r4_H_legalname_empty.txt`. **Files:** `RegisterScreen.js` (`KeyboardAwareScrollView` bottom offset), `CtaBar`.

### E2E-43 — LOW — On code login the second line of the wrong-code error is cut by the pinned bar (still open from E2E-34)
- **Steps:** Log in → "Log in with a code instead" → +94 77 000 0091 → type `999999` → Log in; keyboard stays open (360 dp).
- **Actual (bounds in dp):** scroll view y 44–413; the error text starts at 378 and is 40 dp tall (ends 418), so its last 5 dp (the descenders of "try again.") are clipped under the bar; the "Resend code" link (434–478) and the links below are out of view. **After scrolling the content up by hand the error is fully visible** (178.3–218.3). The same error on the registration code step is fully visible (less content above it).
- **Evidence:** `R4-6b-codelogin-wrong-keyboard-360dp.png`, `…-scrolled-360dp.png`, `r4\6b_codelogin_wrong_nodes.txt`. See §13 (6b).

### E2E-44 — LOW (development build only) — Splash: a black frame at the handoff, an occasional dark gap, an occasional mark jump (E2E-36 not fixed in the dev client; not reproduced in a release build)
- **Dev build + Metro (13 recordings):** 12 runs have one (0,0,0) frame of 13–35 ms between the native and the app splash; the first clear-data launch after a cold bundle stayed dark ≈ **3.0 s**, one other run **266 ms**; **3 of 13 runs** the app-splash mark starts 9–18 dp lower than the native one and moves up in ≈ 100 ms; on warm launches the screen is blank blue for 283–402 ms before the UI; the app splash lasts 1.90–1.93 s on clear-data runs (below 2 s) and 2.13–2.28 s warm.
- **Release build (6 recordings, Metro stopped):** **none of these happens** — one continuous splash of 2.46–2.93 s, no black frame, no dark gap, mark fixed at y0 = 0.461 (§13, 6c).
- **Cause (from logcat):** in the dev build the system splash is held until `Running "main"` + first frame (`Displayed … +3s413ms`), and when the JS side is slower the dark interval grows; the release build is ready ≈ 1.0 s after START. If the splash must also look right in the shared dev APK, the black frame at the handoff (13–35 ms) is what to look at; for the release APK nothing is left to fix.
- **Evidence:** `r4\warm*_seg.txt`, `cleardata*_seg.txt`, `6c_*_seg.txt`, `*.mp4`, frames `r4\frames\`.

### E2E-45 — LOW (accessibility) — During the resend countdown the accessibility tree still offers a clickable "Resend code" button and does not contain the countdown
- **Steps:** registration code step (360 dp): tap "Resend code" (or wait for the first countdown); screen shows "Resend in 0:29" and counts down; `uiautomator dump` (three dumps in 30 s) reports `Button 'Resend code' [16,294][344,338] clickable` + `TextView 'Resend code'` and **no** "Resend in 0:xx" node.
- **Expected:** the countdown text is what the screen shows (TalkBack would otherwise announce an action that is not available and never the time left); the link appears only when the countdown is over.
- **Notes:** tapping that area during the countdown does nothing visible (countdown 0:05 → 0:03 just continued). I cannot tell whether the node is stale or really present (the dump lag, §Method), so this is reported as observed; it needs a TalkBack pass on a real phone.
- **Evidence:** `r4\6a_registration_countdown_360dp.xml`, `R4-1.3-countdown-before-tap-360dp.png`, `R4-1.3-countdown-after-tap-360dp.png`.

### E2E-46 — COSMETIC — On the "link sent" screens the sentence's full stop lands on a line by itself
- 1.11r3 at 360 dp: "We've sent a reset link to amal@example.com" / ". Check your inbox, and your spam folder if it isn't there." — the unbreakable address fills line 1, so the full stop starts line 2. Copy equals the prototype; only wrapping. **Evidence:** `R4-I-1.11r3-linksent-360dp.png`.

### E2E-47 — COSMETIC — A brand-blue sliver appears at the screen edge while Log in slides in after Sign out
- `row5_signout_flow.mp4`, frames at 1727–1795 ms: for ≈ 70 ms the window background (`#0F3D91`) shows as a thin vertical band at the screen edge during the Settings → Log in transition. Not visible in a still screenshot. **Evidence:** `R4-row5-signout-transition-frames-411dp.png`.

---

## 12b. Still NOT tested, and why

| Not tested | Why |
|---|---|
| SMS autofill of the code | needs a real phone with a SIM / real SMS; none available |
| What TalkBack actually says (incl. E2E-45) | no physical phone; on the emulator TalkBack speaks but the spoken text is not exposed over adb (round 3) |
| A home-screen shortcut icon | I judged the icon from the drawer, as the brief allows |
| Re-check of E2E-38 (delete-password CTA floating above the keyboard) | not part of this round's list |
| Reset-by-email web pages (the browser pages behind the emailed link) | exercised via the API in round 3; only the in-app screens 1.11r1–r4 were re-run |
| Release build on Android 15 / another device | only the Pixel_8 Android 17 preview image was used |

---

## 13. Section 6 — information for the three open items

### 6a. "Resend in 0:xx" line vs Figma 1.3 — bounds (dp, 360 dp; px in the raw dumps `r4\6a_*_nodes.txt`)

**Registration code step** (idle = after the countdown, "Resend code" link shown):

| Node | x | y | h |
|---|---|---|---|
| "We sent a 6-digit code to +94 77 000 0092." (TextView) | 16–344 | 190–210 | 20 |
| code row: six `ViewGroup` boxes (no separate container node and **no EditText in the tree**) | 16–64, 72–120, 128–176, 184–232, 240–288, 296–344 | **226–278** | 52 each |
| "Resend code" `Button` (clickable) | 16–344 | **294–338** | 44 |
| its text `TextView` | 16–344 | 304–328 | 24 |
| empty views between the row and the link | none | | |
| "Change number" `Button` / text | 16–137.3 | 624–668 / 634–658 | 44 / 24 |
| "Go to log in" `Button` / text | 16–102.3 | 668–712 / 678–702 | 44 / 24 |
| bar `ViewGroup` / "Verify" button | 0–360 / 16–344 | 716–800 / 728–776 | 84 / 48 |

- **Gap from the bottom of the code row (278) to the top of the "Resend code" link box: 16 dp** (to the link's text: 26 dp). This equals the content gap of 16 in the prototype (1.3: content `gap 16`, then `CountdownText 99×20`).
- **Countdown state** (screenshot pixel measurement, since the tree does not list it): ink of "Resend in 0:29" y **299–309** dp, x 17.3–114 dp → a 20 dp line box at ≈ **294–314**, i.e. **16 dp below the code row** (Figma: 16). Figma-vs-app band comparison: Figma y254–265, app y255–265 (in frame coordinates) → **the 12 dp offset of round 3 is gone.**
- The hidden `EditText` (`6-digit code`) appears in the tree only while the keyboard is open (`x 16–344, y 226–278`, same bounds as the row).

**Code login screen** (idle, code just sent): row **y 310–362** (6 boxes, same x as above); "Resend code" `Button` **378–422** (gap **16 dp** from the row); its text 388–412; "Use password instead" 624–668; "Trouble getting in? Get help" 668–712; Log in button 728–776. **Same 16 dp gap as registration.** The Resend link is shown immediately after "Send code" on this screen (no countdown was shown in my runs).

**Phone-change code step** (card inside Change phone number): code boxes **y 429–481** (52 dp, measured on the screenshot; x 26–274 inside the card), "Resend code" `Button` **487–531** (gap **6 dp** from the boxes; text 497–521 = 16 dp), countdown ink 492–502 → text box ≈ 487–507, i.e. **6 dp** below the boxes; "Cancel this change" 537–581. The gap here is **6 dp, not 16 dp**: it follows the card's own spacing (`pendingChangeRow` gap 6 in the prototype), so the two contexts differ by design.

### 6b. Code-login wrong-code error cut by the pinned bar (keyboard open, 360 dp)

| Item | Code login | Registration code step |
|---|---|---|
| IME inset / keyboard top | 909 px / 1491 px | same |
| Scroll view | y 44–413 dp (132–1239 px) | y 44–413 dp |
| Error text node | 378–413 (visible 35 of 40 dp; natural bottom 418) | fits (3 lines of content less above it): fully visible |
| Pinned bar | 413–497 dp; "Log in" button 425–473 (1275–1419 px), 24 dp above the keyboard | same, "Verify" |
| "Resend code" link | 434–478 dp = **below the scroll view's bottom (413)**, not visible | visible |

Screenshots: `R4-6b-codelogin-wrong-keyboard-360dp.png` (error's second line cut), `R4-6b-codelogin-wrong-keyboard-scrolled-360dp.png` (**after dragging the content up the error line is fully visible at 178.3–218.3 dp and "Resend code" at 234–278**), `R4-1.3-code-wrong-red-keyboard-360dp.png` (registration: fully visible). Dumps: `r4\6b_*_nodes.txt`. So the content is reachable by scrolling but the screen does not scroll the error into view by itself.

### 6c. Dark gap after clear-data at launch

**Debug build + Metro (data from 12 recordings, §8).** Timeline of a normal clear-data launch from logcat (`r4\6c_A_clear_first_logcat_filtered.txt`, device clock): `ActivityTaskManager START … MainActivity` 02:39:37.644 → native splash window created 37.658 → process started 37.667 → Firebase init 38.25 → `MainActivity onCreate` 38.526, `onResume` 38.533 → Hermes libs loaded **39.90** (1.4 s after onResume) → `ReactNativeJS: Running "main"` **40.647** → `ActivityTaskManager: Displayed lk.youthlink.app/.MainActivity … +3s413ms` **41.047** → one black frame (13 ms) → app splash. In the video: native splash 3092 ms, black frame 13 ms, app splash 1917 ms. **The system splash is held until JS has produced the first frame (`Displayed` +3.4 s in dev).** Whenever the JS side is slower the dark stretch grows: in the one run with ≈ 3.0 s the same pattern occurred (dev bundle just rebuilt by Metro); in the 266 ms run likewise. I did not capture logcat for those two runs (they happened before I added the logcat capture) and could not reproduce them in six further runs.

| Case (dev build) | Dark time between native and app splash |
|---|---|
| first clear-data after Metro's cold bundle | ≈ 3.0 s |
| clear-data (6 later runs: clear-data 1, 2, A, B, C, D) | 266 ms, 14, 13, 15, 21, 16 ms |
| **force-stop then launch again without clearing** (the "not the first launch of the process" case; also all "warm" runs) | 13–35 ms in 5/5; 101 ms once (row 4, signed in) |
| plain force-stop (warm) | same as above |

**Release build (`npx expo run:android --variant release`)** — built and installed (BUILD SUCCESSFUL; package not debuggable: `flags=[ HAS_CODE ALLOW_CLEAR_USER_DATA ALLOW_BACKUP KILL_AFTER_RESTORE ]`; signed with the debug keystore as Expo's default), **Metro stopped** (port 8081 closed) so the bundle comes from the APK. Six recordings at 411 dp with logcat (`r4\6c_R*_rel_*`):

| Run (release) | first blue frame → UI | dark / black frames at the handoff | mark y0 | `Displayed lk.youthlink.app/.MainActivity` |
|---|---|---|---|---|
| R1 clear-data | 4557 → 7378 ms = **2.82 s** | **none** | 0.461 constant | +1 s 319 ms |
| R2 clear-data | 4405 → 6869 ms = **2.46 s** | **none** | 0.461 | +1 s 5 ms |
| R3 clear-data | 5306 → 8237 ms = **2.93 s** | **none** | 0.461 | +1 s 918 ms |
| R4 force-stop after a clear-data launch (not the first process start, nothing cleared) | 4836 → 7490 ms = **2.65 s** | **none** | 0.461 | +1 s 413 ms |
| R5 force-stop (warm) | 4642 → 7340 ms = **2.70 s** | **none** (a 63 ms plain-blue frame without the mark before the UI) | 0.461 | +1 s 315 ms |
| R6 force-stop (warm) | 4227 → 6714 ms = **2.49 s** | **none** | 0.461 | +1 s 29 ms |

- In the release build the native splash and the app splash form **one continuous blue + mark segment** (1.1–1.75 s mark only, then 1.2–1.35 s with the wordmark and tagline): **no black frame, no jump, no dark gap in 6 of 6 runs**; the wordmark phase is 1.18–1.35 s. Timeline of R1 (device clock): `START … MainActivity` 03:00:11.118 → process start 11.174 → `ReactNativeJS: Running "main"` **12.135** (≈ 1.0 s after START) → `Displayed … +1s319ms` 12.424. So JS is ready ≈ 2.3 s earlier than in the dev build, which is why the system splash does not outlast the app.
- **Answers to 6c:** (a) the dark gap is **dev-build / Metro-dependent**: it was ≈ 3.0 s once, 266 ms once and ≤ 35 ms in 11 of 13 dev runs; it **does not occur in the release build (0 of 6)**. (b) It also occurs on a launch after clear-data that is **not** the first process start (force-stop, then launch without clearing) **in the dev build** only as the same ≤ 35 ms black frame (13–35 ms, 5/5 plus 101 ms once). (c) After a plain force-stop (warm) the dev build shows the 13–35 ms black frame, the release build nothing. Logcat files: `r4\6c_*_logcat_filtered.txt` (full: `6c_*_logcat_full.txt`).
