# E2E retest, round 3 — Account module (report only; nothing fixed, committed or pushed)

Tester: Claude (agent), Asia/Colombo, 2026-10-02 → 2026-10-03. `develop` @ `013503b` (merge of PR #45). I changed no source file, made no commit, push or checkout of a branch. The only git command that changed state was the authorised `git checkout -- backend/package-lock.json mobile/package-lock.json` (at setup, and again at the end). `git status --short` is **clean** at the end.

Evidence: screenshots `C:\Users\Afham\e2e-screens\R3-<frame>-<what>-<width>dp.png` (119 files), raw data `C:\Users\Afham\e2e\r3\` (keyboard dumps `kb_*.txt/.xml`, lockfile diffs, npm logs, splash videos `splash_*.mp4`, dumpsys output `7B_*`, `7D_*`), scratch tools `C:\Users\Afham\e2e\`.

---

## 0. Environment and what I did

| Item | Value |
|---|---|
| Host | Windows 11, `node v24.13.0`, `npm 11.6.2` (also `npm 10.9.9` via `npx` for 7C) |
| Emulator A (main) | AVD `Pixel_8`, image `google/sdk_gphone16k_x86_64/emu64xa16k:17/CP31.260623.012` = **Android 17 preview (API 37.x, 16 KB pages, Play Store image)**. 1080×2400. **411 dp** = density 420 (default); **360 dp** = `wm density 480`. |
| Emulator B (stable) | AVD `E2E_API35` (I created it: `system-images;android-35;google_apis;x86_64`), `google/sdk_gphone64_x86_64/emu64xa:15/AE3A.240806.043` = **Android 15, API 35**, Pixel 6 profile, 1080×2400 @420 = 411 dp. **No Play Store**, see E2E-41. |
| Physical phone | none available |
| Backend | `npm install`, `prisma generate`, `migrate deploy` (nothing pending), `db seed` clean; API started with `--trace-deprecation` |
| Mobile build | `adb uninstall lk.youthlink.app`; `npx expo prebuild --clean --platform android` exit 0 (only warning: `android: userInterfaceStyle: Install expo-system-ui`); `npx expo run:android` **BUILD SUCCESSFUL in 2m3s** (needed `JAVA_HOME` = JDK 21; the default JDK on this machine is not usable). `debug.keystore` fingerprint unchanged by prebuild. Metro `--dev-client --clear`. |
| Firebase numbers used | +94 77 000 0091 (111222) and +94 77 000 0092 (333444) for every SMS I triggered (registration, phone change). Seeded +94 77 000 0001 (123456) was used for code login and as the target of one phone change back. Nothing else was sent to Firebase. |
| `git status --short` | before installs: clean. after installs: `M backend/package-lock.json`, `M mobile/package-lock.json`. end of run: clean again. |
| Local-DB writes (scratch, local only; `db seed` run at the end restores everything) | suspend/unsuspend and lock/unlock of seeded users; 1 inserted `Rating` row for the singular-count check; row locks (`SELECT … FOR UPDATE`) to slow login/delete; registrations (+94770000091, …92) and 3 deletions of seeded/new accounts; one `AccountRecoveryRequest`. |
| Display state restored | font scale 1.0, `wm density reset`, TalkBack switched off (it was on for ~3 min). |

Method note: `uiautomator dump` lags after screen transitions on this setup, so every "looks like" claim below is from a screenshot (pixel measurements with OpenCV where I give numbers), and the UI-tree dump is used for labels/bounds.

---

## 1. Results — the new items (task section 3)

| # | Item | Width / image | Result | Evidence |
|---|---|---|---|---|
| 1 | **Launch splash** (5 warm launches + 2 tap runs, `screenrecord` decoded frame by frame; plus after clear-data) | 411 dp, A; 360 dp after clear-data | **Mostly OK, 3 deviations.** Native splash = brand-blue `#0F3D91`, white mark ≈ 50 dp wide dead centre (centre x = 49.4 %). App splash: same mark, same size/position; wordmark + tagline fade in ≈ 0.4–0.5 s after the app splash starts; visible ≈ 1.7 s with text, **≈ 2.1 s total** for the app splash (spec ≥ 2 s ✓). No white flash anywhere. A tap during the app splash ends it early (tap runs: ≈ 0.5 s sooner). Deviations: (a) **one pure-black frame (27–55 ms) at the native → app handoff in 5/5 warm launches**; after clear-data the native splash fades to near-black (mean RGB 3,4,8) for **≈ 1.2 s** before the app splash appears; (b) in 3/7 runs the mark starts ≈ 12–24 dp lower and settles up in ≈ 100 ms (a visible jump); (c) one plain-blue frame without the mark ≈ 50 ms before the first UI. Dev build only: first blue native splash lasts 3.5–4 s while JS loads. | `splash_run1..5.mp4`, `splash_tap1/2.mp4`, `splash_s360.mp4`, frames `r3\frames\`, `7D_splash_dump_*.txt` → **E2E-36** |
| 2 | **Native Android splash** | A (Android 17) | Solid `#0F3D91` background (`windowSplashScreenBackground`), the brand mark (white arcs + dot) centred, ≈ 50 dp; opens ≈ 0.6 s after the launch command; `dumpsys window` shows `Splash Screen lk.youthlink.app`. Theme `Theme.App.SplashScreen`, `windowSplashScreenBehavior=icon_preferred`; `AppTheme` `windowBackground=@color/activityBackground` = `#0f3d91`. | `7D_splash_dump_1..8.txt` |
| 3 | **App icon** | A | Launcher, recents and Settings → Apps all show the brand mark (white arcs + dot on `#0F3D91`), round mask, ≈ 15 % safe margin, **not cropped**. **The label under it reads "mobile"**, not "YouthLink" (`app.json` `expo.name`, `strings.xml app_name`). | `R3-icon-appdrawer-411dp.png`, `R3-icon-recents-411dp.png`, `R3-icon-settings-apps-411dp.png`, `R3-icon-zoom-411dp.png` → **E2E-35** |
| 4a | **Dialog: Settings → Sign out** | 360 dp, A | **PASS.** Scrim covers the **whole screen including status bar and nav-bar area**: colour = `#111827` at 40 % (measured: white header → (160,163,169); `#F3F4F6` body → (153,156,164); status-bar strip identical to header). Card is centred (y 300–500 dp, x 16–344). Taps on rows/back chevron behind the scrim do nothing; tapping the scrim does **not** dismiss (Cancel/Sign out/hardware Back do). Hardware Back closes it. Sign out → Log in, number remembered, subtitle "Log in to pick up where you left off.". | `R3-1.10d-signout-dialog-360dp.png` |
| 4b | **Dialog: "Phone number updated"** | 360 dp, A | **PASS.** In-app card on the same scrim, text "Phone number updated / Your new number is now active.", **one "Done" button**, no system alert. Hardware Back closes it and also leaves the screen (acts like Done). Settings then shows the new number. | `R3-1.12b-phone-updated-card-360dp.png` |
| 4c | Any other system-looking alert | code + app | None. `grep -rn "Alert\.\|ToastAndroid" mobile/src` finds nothing; I saw no system alert in any flow. | |
| 5 | **Code input** (registration code step, code login, phone change, forgot-password code) | 360 and 411 dp, A | **PASS.** Coverage: registration code step (360 + 411 dp: tap, width at 0/3/6 digits, wrong code, paste, select-all + delete, 7th digit ignored), **code login (360 dp: tap, wrong code, Backspace)**, phone change (360 dp: tap on a box, typing, in-card layout) and forgot-password code (360 dp: layout, typing, ghost text) — wrong-code red state was only exercised on registration and code login. Results: tapping any of the six boxes opens the keyboard; boxes span the full row (x 16–344 dp at 360 dp; each 48×52 dp, gap 8 dp) and do **not** change width at 0/3/6 digits; active box has a brand-colour border of the same thickness; **wrong code → all six borders red, every border measured 3 px (1 dp) on all sides including the last box**; paste of `111222` works; **plain Backspace removes one digit at a time** (6 → 0 with 6 presses); select-all + delete clears; a 7th digit is ignored. SMS autofill: not possible (no SIM/SMS), see §7. New cosmetic issue: ghost digits **E2E-37**; error line clipped under the bar with the keyboard open **E2E-34**. | `R3-1.3-code-entry-360dp.png`, `R3-1.3-code-login-wrong-360dp.png`, `R3-1.3-code-login-backspace-360dp.png`, `R3-1.12-phonechange-code-*` |
| 6 | **Loading buttons** (spinner centred, not clipped, width/position unchanged) | 360 and 411 dp | **PASS.** Send code (411 dp), **Log in under a 3 s row lock** (the button keeps its size, label replaced by a centred spinner, both fields disabled, subtitle "Signing you in… fields are locked while we check."), **Delete my account under a 5 s lock** (red button, centred spinner). | `R3-1.6l-login-loading-360dp.png`, `R3-1.17-delete-busy-360dp.png` |
| 7 | **Account deleted** (E2E-22), done 3×: Dilrukshi (1 rating given, 1 received), Nimali, and a freshly registered verifier | 360 dp, A | **PASS ×3.** Screen shows no header bar, title "Account deleted", body copy exact, only "Back to the start" (pinned, brand blue). **Hardware Back does nothing.** The button goes to role selection (Step 1 of 4). Hardware Back from role selection leaves the app (it is the root). Logging in with the deleted number → generic "We couldn't log you in with those details…". Normal Sign out still lands on Log in with the number remembered (Home does not hijack it). | `R3-1.17d-account-deleted-*-360dp.png` |
| 8 | **Onboarding cards** | 360 and 411 dp, A | **Centring PASS:** disc 160 dp, centre at **50.0 %** of the width on all three cards at 360 and 411 dp. Card-1 title "Local work, verified people" is **one line** (box 32 dp) at both widths; cards 2/3 titles two lines (64 dp). Dots and button positions match M0 (dots @160,≈676–684; button @16,728, 48 dp). **But vertical positions are off-spec and differ per card** → **E2E-33.** | `R3-0.2/0.3/0.4-onboarding-*`, `disc.py` output in §5 |
| 9 | **Login after suspension** (E2E-26) | 360 dp | **PASS.** Suspended banner "This account has been suspended. Staff make that decision…", both fields disabled, Log in disabled, link "What suspension means", **back chevron present and goes to role selection**; no stale "You were signed out" banner. After a session-end redirect the 1.6s notice shows without back chevron (spec) and, on the next attempt with a suspended account, is replaced by the suspended banner. The **paused banner clears as soon as the phone number is edited** (digit removed). | `R3-1.6sus-*`, `R3-1.6bnr3-paused-*` |
| 10 | **Registration error clearing** (E2E-25/30) | 411 dp | **PASS.** After "This email is already on another account. Try a different address." the error disappears on the first edit; same for NIC (duplicate), birthdate (under 18), password mismatch, empty legal name. Wording now equals Settings. | `R3-1.4-*` |
| 11 | **Settings at font scale 2.0** (E2E-27) | 360 dp | **PASS.** Labels stay readable and wrap, values truncate with a tail "…", no clipped first character, chevrons fully visible on "Notification preferences" and "Help — how YouthLink works" (checked with a 49-character verified email). Note: the phone value truncates to "+94 77 000 000…" so a person at 200 % cannot read their own full number in the row. Tab bar at 2.0: all five labels fit ("Browse / Applications / Engagements / Notifications / Profile") but the labels of neighbouring tabs nearly touch (≈ 1–2 dp gap). | `R3-1.10e-settings-font2.0-360dp.png`, `…-bottom-font2.0…`, `…-longemail-…`, `R3-1.18-profile-tabbar-font2.0-360dp.png` |
| 12 | **Button accessibility** (E2E-28) | A, B | Accessible name = label ("Log in", "Create account", "Continue", "Delete account", …) ✓. **But "busy" is exposed when the button is not loading** → **E2E-31.** TalkBack: switched on (`com.google.android.marvin.talkback` is on this image); it spoke (TTS synthesis requests in logcat) but the spoken text is not visible over adb, so I cannot quote what it read; the node labels above are what it would use. | `E2E31_dump_suspended_busy.txt` |

---

## 2. Results — round 2 findings (E2E-19 … E2E-30)

| ID | What it was | Round 3 result |
|---|---|---|
| E2E-19 | six code boxes can't be tapped | **FIXED** (verified on 4 screens, 360 + 411 dp) |
| E2E-20 | sign-out dialog without scrim | **FIXED** (§1 row 4a) |
| E2E-21 | spinner clipped at button bottom | **FIXED** (Send code, Log in, Delete my account) |
| E2E-22 | "Account deleted" never shown | **FIXED** (3×; header-less by decision; Figma 1.17d showcase draws a header, see §5) |
| E2E-23 | onboarding art off-centre, title wraps | **FIXED** for centring and title; vertical position is a new finding E2E-33 |
| E2E-24 | focused last field half hidden behind pinned bar | **PARTLY FIXED**: the bar now rides up (24 dp above the keyboard on every screen but one) and the focused field is no longer *behind* the bar, but Legal name still ends flush with the bar → **E2E-34** |
| E2E-25 | stale errors after editing | **FIXED** |
| E2E-26 | no way back after session-end/suspension | **FIXED** |
| E2E-27 | clipped first character at 200 % | **FIXED** |
| E2E-28 | buttons expose "busy" as name | label fixed; **"busy" now sticks** → E2E-31 |
| E2E-29 | display size/font change restarts app | **unchanged** (observation; cause found, §7B) |
| E2E-30 | copy mismatch registration vs Settings | **FIXED** |

---

## 3. Results — round 1 regression pass

| ID | Check | Result |
|---|---|---|
| E2E-01 | recovery request from the app (Sunil, NIC `197012345678`, 1970-01-01, "Sunil Teacher") | **FIXED.** "Request received. An admin will review it…" and an `AccountRecoveryRequest` row (`AWAITING_REVIEW`); after force-stop + relaunch the same flow reopens the "Request received" status screen. |
| E2E-02 | session ended while a screen is open | **FIXED.** Suspended Amal on Settings → Back → straight to Log in with the 1.6s notice, no chevron. Also happened (correctly) after my API password reset signed the app out. |
| E2E-03 | two headers on 5 account screens | **FIXED** (single header on forgot password, code, recovery). |
| E2E-04 | keyboard covers pinned bar | **FIXED** on A and on stable Android 15 (B): bar rides up, 24 dp gap (§7A). |
| E2E-05 | Settings refresh on foreground | **FIXED.** With Settings visible, confirm the link, HOME + relaunch → row shows the new address. |
| E2E-06 | long email row / tab-bar labels | **FIXED** (§1 row 11). |
| E2E-07 | login frames (a) subtitle, (b) locked fields, (c) disabled when paused | **FIXED** (a, b, c). |
| E2E-08 | "1 engagements completed", ENDED not counted | **FIXED.** Kamal shows "2 engagements completed" (COMPLETED + ENDED); with one engagement + one revealed rating, Dilrukshi shows "**1 engagement completed**". (A profile with an engagement but no revealed rating shows "New to YouthLink" with no count, as coded.) |
| E2E-09 | code input editing | **FIXED** (Backspace, paste). |
| E2E-10 | stale banner on suspended login | **FIXED.** |
| E2E-11 | NIC correction copy / counter | not re-run. |
| E2E-12 | forgot-password button text | code now reads "Send reset link" for the email option (`AccountForgotPasswordScreen.js:171`); not exercised on screen (no seeded account has a verified email path I used). |
| E2E-13 | used reset link page | **FIXED.** Spent token → page "Link no longer valid / This reset link has expired or was already used." (no form). |
| E2E-15 | straight quotes in help | **FIXED** (curly “ ” in `HelpAccountAccessScreen.js`). |
| E2E-16 | `check-availability` unthrottled | **FIXED/decided:** 70 requests in a burst → 30 × 200, then 40 × **429** "Too many checks. Wait a minute and try again." |
| E2E-17 | pg DeprecationWarning | **not reproduced** with `--trace-deprecation` over the whole run (including the blocked-delete screens that call `findBlockingEngagement`). The log has 0 DeprecationWarning lines. |
| E2E-18 | lockfile churn | see §7C. |

---

## 4. Results — previously untested items (task section 5)

| Item | Result |
|---|---|
| **Individual-employer registration to completion** (+94 77 000 0092 / 333444) | **PASS.** Role → phone → code → details (password, NIC `199512345679`, 1995-05-05, "Ruwan Test", terms) → Step 5 of 5 "How will you post gigs?" → Individual/Household → employer shell; profile shows "Ruwan Test", Phone verified, "New to YouthLink". Submitting with the terms box unticked shows the red "Please accept the Terms of Service and Privacy Policy to continue." (the box is below the fold of Step 4). |
| **Business bio at registration (300 cap)** | **PASS.** Business → fields "Business name" and "Business bio (optional)"; typing 280 then 60 more characters stops at **exactly 300**. **No counter is drawn** (the prototype's 1.5 draws none; the "N / 300" counter exists only on the Settings frame 1.15eb, and `TextField` only shows it where `showCounter` is set). Bio is a single-line field (it scrolls sideways). Switched back to Individual and completed. |
| **Verifier registration to completion** (+94 77 000 0091 / 111222) | **PASS.** 4 steps; lands in the Verifier shell; profile "Community Verifier", "Vouching since today · nobody yet" (= 1.18vz). |
| **Worker registration to completion** (0091 again after deleting the verifier) | **PASS** (Step 4 of 4 → Worker shell). |
| **"1 engagement completed" singular** | **PASS** (see E2E-08 above; set up with one inserted revealed rating for Dilrukshi, whose only engagement is `ENDED`). |
| **Delete of a registered account with ratings** (Dilrukshi: 1 given, 1 received; Nimali) | **PASS.** User row becomes `legalName 'Deleted user'`, `phone 'deleted-<uuid>'`, `email null`, `nicEncrypted 'deleted:<uuid>'`, `accountStatus DELETED`, `deletedAt` set. **Both `Rating` rows remain** (raterId/rateeId unchanged, score 4). Accounts with an active engagement (Kamal, Amal) are blocked with the engagement named and the button disabled. |
| **Plain Backspace** | **PASS** (§1 row 5). |
| **SMS autofill** | NOT TESTED (no SIM/real phone). |
| **TalkBack** | partly (§1 row 12). |
| **Phone change end to end** (Amal 0001 → 0091 → back to 0001) | **PASS**, incl. in-card code boxes, "Resend in 0:14" timer, success card. |
| **Figma comparison at 360 dp** | §5. |

---

## 5. Figma comparison (file `9gIi2H8L0QDQps3T8oinPC`, page `Screens / M1 Account` = `9:12`)

Method: Figma frames fetched with `get_screenshot` (360×800); app screenshots at 360 dp are 1080×2400 (scale 3). Frames have no status bar, so **top-anchored app content sits +44 dp lower by design** (status-bar inset = 132 px = 44 dp, `dumpsys window`). I removed those 44 dp and compared "ink bands" (text lines, boxes, buttons) per frame; bottom-anchored items need no correction. Offsets are in dp (app minus Figma).

| Frame (Figma id) | App screenshot | Result |
|---|---|---|
| **1.1** Role selection (`68:96`) | `R3-1.1-role-selection-360dp.png` | **Identical to ±0 dp** for title (y73–91), step line, all three option cards (y146–223 / 240–317 / 334–411, x16–343), "Go to log in" (−1), Continue (728–775). |
| **1.3** Code entry (`69:26`) | `R3-1.3-code-entry-360dp.png` | Title, step, explainer (+1), code row (y182–233 ×16–343; boxes 48×52 gap 8) identical; "Change number" / "Go to log in" / Verify identical (±1). **One difference: the "Resend in 0:xx" line is 12 dp lower than drawn** (app y266–277, Figma y254–265) — the gap under the code boxes is 32 dp instead of 20 dp. The last box is also drawn in its focus colour once six digits are in (Figma draws all six plain). |
| **1.6** Login (`70:88`) | `R3-1.6-login-filled-360dp.png` | **All elements within ±1 dp** (title, subtitle, both fields, three links, Log in). |
| **1.10** Settings (`73:140`) | `R3-1.10-settings-amal-360dp.png` | Every element is **−11…−12 dp (higher)** than drawn below the header, **0 dp horizontally** (rows x17–343, 48 dp tall). Single cause: **E2E-32** (header 44 dp instead of 56). |
| **1.10s** Sign out dialog (`2253:491`) | `R3-1.10s-signout-dialog-amal-360dp.png` | Dialog card y300–500 / x16–344 in both (±1), scrim equal; rows behind carry the same −11/−12 dp header offset. |
| **1.12b** Change phone, pending (`2047:397`) | `R3-1.12-phonechange-code-360dp.png` | Prototype 1.12b draws only the pending card with the "Cancel this change" link and **no code boxes, no Resend line, no pinned Verify button**; the app adds all three, and the "Phone number updated" card (not drawn anywhere in the prototype) → **E2E-40**. Elements that exist in both carry the −12 dp header offset. |
| **1.17d** Account deleted (`2343:1151`) | `R3-1.17d-account-deleted-run3-360dp.png` | Title/body text positions are exactly what a header-less layout gives (Figma showcase minus its 56 dp header bar = −12 dp); body wraps in the same lines (x16–324 / 16–297 / 17–240); button identical (y728–775). The **Figma showcase draws a "Delete account" header bar, the app deliberately has none** (per the task) → E2E-40. |
| **0.2 / 0.3 / 0.4** Onboarding (M0 page — I could not locate its Figma page id; pages `9:8`–`9:13` checked) | `R3-0.2-…card1`, `R3-0.3`, `R3-0.4` | Compared against the numbers in `docs/prototype/M0-first-run.md` instead. Disc centre x = 180 dp ✓ (50.0 %), diameter 160 dp ✓, dots (160, 676) ✓, button (16, 728, 328×48) ✓. **Vertical: disc top / title top / body top are +27 / +27 / +27 dp (card 1), +11 / +11 / +11 (card 2), +23 / +23 / +23 (card 3) vs the spec's 170 / 392 / 440 or 472.** Skip: spec `@284,24` right-aligned (60 wide → right edge 344, top 24); app text spans x307–336, y56–76 (right edge 8 dp short, 32 dp lower). → **E2E-33** |

Frame-level conclusion: 1.1, 1.3 (except the Resend gap), 1.6, 1.10s match the drawings to ≤ 1 dp; everything under a `ScreenHeader` is uniformly 11–12 dp too high.

---

## 6. Findings (new), E2E-31 onwards

### E2E-31 — MINOR (accessibility) — Buttons keep announcing "busy" after loading ends
- **Steps:** Log in with a wrong password (or any action that shows a spinner), wait for the result, dump the UI tree; or simply go through registration (the "Create account" button shares the instance that was busy on "Verify").
- **Expected:** content-desc = label ("Log in"); "busy" only while `loading`.
- **Actual:** `Log in, busy` on an idle, **disabled** button after the suspended/paused/500 result (screenshot shows no spinner); `Create account, busy` on an idle enabled button on Step 4; `Delete account, busy` on the blocked-deletion screen; `Send reset code, busy`; `Continue, busy`. A fresh screen shows the plain label ("Log in" on first open). The pattern is "after any loading cycle the flag stays".
- **Cause (from code):** `Button.js:92` `accessibilityState={{ disabled: isDisabled, ...(loading ? { busy: true } : null) }}` — when `loading` turns false the `busy` key is simply omitted, so the native view keeps the earlier `busy: true` (RN only applies keys it is given). It would need `busy: Boolean(loading)`.
- **Evidence:** `E2E31_dump_suspended_busy.txt`, `R3-1.6sus-suspended-360dp.png` (button grey, no spinner). TalkBack would read "Log in, busy, button" for an idle control. **File:** `mobile/src/components/Button.js:92`.

### E2E-32 — MINOR — `ScreenHeader` is 44 dp tall instead of 56 dp, so every headed screen sits 11–12 dp too high
- **Steps:** open Settings (or Delete account / Change password / Forgot password …) at 360 dp and compare with Figma 1.10.
- **Expected (design-system `Chrome/ScreenHeader` 360×56, back target 44×44 centred):** divider at y = 44 (status bar) + 56 − 1 = 99 dp; title centre at 72 dp.
- **Actual:** divider measured at **88.3 dp**, title centre 66 dp, the 44 dp back target starts flush at 44 dp (6 dp above its drawn position). Everything below is −11…−12 dp (table in §5).
- **Cause:** `ScreenHeader.js` sets `minHeight: 56` **and** `paddingTop: insets.top` (44 dp) on the same view, so the 56 includes the status-bar padding; the header's own content is only 12 dp + the 44 dp back target = 44 dp. Likely fix: `minHeight: 56 + insets.top`. Registration/login/role screens use their own top bar and are exact.
- **Evidence:** `R3-1.10-settings-amal-360dp.png` vs `figma\f_1.10.png` (my diff), `R3-1.17-delete-busy-360dp.png`. **File:** `mobile/src/components/ScreenHeader.js:37,72`.

### E2E-33 — MINOR — Onboarding art, title and body are not at the M0 positions and move between cards
- **Steps:** clear data, launch, page through the cards at 360 dp (and 411 dp).
- **Expected (M0):** art `@80,150`, title `@24,392`, body `@24,440` (card 1) / `@24,472` (cards 2, 3) — identical vertical position on every card; Skip `@284,24` right-aligned.
- **Actual:** disc/title/body are +27 dp (card 1), +11 dp (card 2), +23 dp (card 3) from spec, so **the art jumps by up to 16 dp when paging**; dots and button are exact. Skip text spans x307–336 / y56–76 (spec right edge 344, top 24).
- **Cause (from code):** the card content block is `flex: 1; justifyContent: "center"` (`FirstRun.js:97-99`), so its position depends on each card's text height; the spec says these four screens are the only absolutely-positioned ones.
- **Evidence:** `R3-0.2-onboarding-card1-360dp.png`, `R3-0.3…`, `R3-0.4-onboarding-card3-360dp.png`; numbers in §5. **File:** `mobile/src/screens/firstrun/FirstRun.js`.

### E2E-34 — MINOR — Residual keyboard problem (E2E-24 partly fixed): last field flush with the bar, and an error line clipped under the bar
- **Registration Step 4, Legal name focused (keyboard open):** the field's bottom edge coincides with the scroll view's bottom (411 dp: field 1194–1297, scroll bottom 1297, bar top 1329; 360 dp: 1121–1239 / 1239 / 1275) so its 1–2 px bottom border is clipped and the character counter row underneath is out of view. Same at font 1.3, and at 1.3 the **NIC** field also ends flush (1111–1239).
- **Code login screen, wrong code, keyboard open:** the second line of "That code doesn't match. Check the 6 digits and try again." is cut by the bar (`R3-1.3-code-login-backspace-360dp.png`).
- **Expected:** the focused field and its helper/error text fully visible above the bar.
- **Evidence:** `kb_details-legalname*.txt`, `kb_details-nic-f1.3.txt`, `R3-1.4-details-legalname-keyboard-360dp.png`. **Files:** `RegisterScreen.js` (`KeyboardAwareScrollView`, bottom offset), the shared `CtaBar`.

### E2E-35 — LOW — The launcher label is "mobile"
- Home screen, app drawer, recents and Settings → Apps show **mobile** under the (correct) brand icon. `app.json` `expo.name` is `"mobile"` (and `strings.xml app_name`). **File:** `mobile/app.json:3`.

### E2E-36 — LOW — Splash handoff: black frame, long dark gap on first run, mark jump
- Details in §1 row 1: one black frame (27–55 ms) between the native and the app splash in 5/5 warm launches; after clear-data ≈ 1.2 s of near-black; in 3/7 runs the mark starts 12–24 dp lower and moves up ≈ 100 ms. Android 17 preview; Android 15 not checked (Firebase blocks the first-run path there). **Evidence:** `splash_run1..5.mp4`, `splash_s360.mp4`, `r3\frames\`.

### E2E-37 — LOW (cosmetic) — Typed digits show through as faint ghost text across the first code box
- With 6 digits entered, a very light copy of the whole string ("111222", "999999") is visible across box 1 (colour `#FAFAFA` on white, contrast ≈ 1.04, visible in zoom, faintly at normal size). It is the hidden `TextInput` (`opacity: 0.02`, `color: "transparent"`) being rendered. **Evidence:** `R3-1.9-code-ghost-text-zoom-360dp.png`, `R3-1.3-code-entry-360dp.png`. **File:** `mobile/src/components/CodeInputNumeric.js:98-101`.

### E2E-38 — LOW — On Delete account → password the pinned button floats mid-screen instead of sitting 24 dp above the keyboard
- Keyboard open: CTA bottom to keyboard top = **51 dp** (360 dp, A) and **180 dp** (411 dp, B/API 35) vs **24 dp** on login/change-password/code screens. Not harmful, but inconsistent. **Evidence:** `kb_delpw_360_f1.0.txt`, `kb_api35_delpw_411_f1.0.txt`.

### E2E-39 — TOOLING — `mobile/package-lock.json` is out of sync with `package.json`
- `npm ci` in `mobile/` **fails (EUSAGE)** with npm 11.6.2 **and** 10.9.9: "lock file's @expo/config-plugins@57.0.7 does not satisfy 57.0.9", "@expo/image-utils@0.11.4 … 0.11.5", "@expo/require-utils@57.0.4 … 57.0.5". `npm install` then bumps exactly these three. Details §7C. The backend lockfile problem (E2E-18) is a separate npm-version effect.

### E2E-40 — OBSERVATION — Parts of the app are not drawn in the prototype
- **1.12b** has no code boxes, no Resend line, no pinned Verify, and there is no "Phone number updated" frame at all; the app has all four (they work and look consistent with the other dialogs). **1.17d**: the Figma showcase frame has a "Delete account" header bar; the app has none (the task says none). **1.3**: "Resend in" 12 dp lower than drawn (§5). Flagging because the team rule is "UI is exact per docs/prototype"; the developer may want to add a frame or note the decision.

### E2E-41 — OBSERVATION (environment) — Firebase phone verification fails on an Android image without Google Play
- On the stable AVD (`google_apis` image, **no Play Store**) the first "Send code" opened **Chrome** at `youthlink-48cdb.firebaseapp.com` (reCAPTCHA fallback), Chrome hung ("isn't responding" on the software-rendered emulator), and after "Verify" the page ended with "Unable to process request due to missing initial state. This may happen if browser sessionStorage is inaccessible…". So registration, code login and phone change **cannot be completed on such a device/emulator**; the preview Play Store image works. Teammates testing on a Play-less emulator will hit this. (Not an app bug as such; worth a line in the README.)

---

## 6b. Still NOT tested, and why

| Not tested | Why |
|---|---|
| Registration details step and code step keyboard on the **stable** image | Firebase phone auth cannot complete on the Play-less stable image (E2E-41); login, change-password and delete-password were done there. A Play Store API 35 image (~1.7 GB) started downloading but would have taken > 1 h; I cancelled and removed it. |
| Keyboard checks on a **physical phone** | none available |
| Font 1.3 on the stable image | same blocker; font 1.0 only |
| SMS autofill | no SIM / real device |
| What TalkBack actually says | spoken text is not exposed over adb on this image (see §1 row 12) |
| Figma comparison for 0.2/0.3/0.4 against Figma pixels | could not find the M0 page node; compared with the M0 spec numbers |
| Figma comparison for 1.12b at element level | the prototype frame has a different content set (E2E-40) |
| Splash on Android 15 | first-run path blocked by E2E-41 on that image |
| E2E-11 (NIC correction copy) and the email-channel button label on screen (E2E-12) | not re-run |

---

## 7. Information requested by the developer

### 7A. Keyboard covers / half-hides fields

All numbers are px of the 1080×2400 screen; dp in brackets. IME top = 2400 − IME bottom inset. `windowSoftInputMode` is `adjustResize` in the manifest, but `dumpsys activity activities | grep -i softInputMode` printed **nothing** ("(no matching lines)") on either image, and the window is edge-to-edge (RN log on A: "StatusBarModule: Ignored status bar change, current activity is edge-to-edge"). `dumpsys window | grep 'sim='` listed only system windows (nav bar `adjust=nothing`/`pan`, status bar `pan`); the app window's own value is not in the captured output. The IME is `com.google.android.inputmethod.latin` (Gboard); `dumpsys input_method` shows `mInputShown=true` while open.

| Screen | Image | Width | Font | IME inset / top | Focused field | Scroll view | Pinned bar | Result |
|---|---|---|---|---|---|---|---|---|
| Registration details, **Legal name** | A (Android 17) | 411 | 1.0 | 883 / 1517 | 1194–1297 | 132–1297 | 1329–1455 (button) | field ends **flush** with scroll bottom, 32 px above bar; bar 62 px (24 dp) above IME |
| same | A | 360 | 1.0 | 909 / 1491 | 1121–1239 | 132–1239 | 1275–1419 | flush; bar 72 px (24 dp) above IME |
| same | A | 360 | 1.3 | 909 / 1491 | 1121–1239 | 132–1239 | 1275–1419 | flush (same) |
| Registration details, **NIC** | A | 411 / 360 | 1.0 | | 640–745 / 490–610 | | | fully visible |
| same | A | 360 | **1.3** | 909 / 1491 | **1111–1239** | 132–1239 | 1275–1419 | flush |
| **Email** | A | 411 / 360 | 1.0 | | 429–534 / 250–370 | | | fully visible |
| **Code step** | A | 360 | 1.0 | 909 / 1491 | 678–834 | 132–1239 | 1275–1419 | fully visible |
| same | A | 360 | 1.3 | 909 / 1491 | 773–929 | 132–1239 | 1275–1419 | fully visible |
| **Login** (password) | A | 360 | 1.0 | 996 / 1404 | 918–1038 | 132–1152 | 1188–1332 | visible, 72 px (24 dp) above IME |
| **Login** | **B (Android 15)** | 411 | 1.0 | 883 / 1517 | 817–922 | 128–1297 | 1329–1455 | visible, 62 px (24 dp) |
| **Change password** (confirm) | A | 360 | 1.0 and **1.3** | 996 / 1404 | 699–819 / 691–819 | 267–1152 | 1188–1332 | visible, 24 dp |
| same | **B** | 411 | 1.0 | 883 / 1517 | 846–951 | 246–1297 | 1329–1455 | visible, 24 dp |
| **Delete account password** | A | 360 | 1.0 | 996 / 1404 | 423–543 | 267–1404 | 1107–1251 | visible; bar **153 px (51 dp)** above IME |
| same | **B** | 411 | 1.0 | 883 / 1517 | (not focused in my dump) | 246–1517 | 919–1045 | bar **472 px (180 dp)** above IME |

Files: `kb_*.txt/.xml` (names above), screenshots `R3-1.4-details-legalname-keyboard-360dp.png`, `R3-1.6-login-keyboard-360dp.png`, `R3-1.6-login-keyboard-typed-411dp-api35.png`, `R3-1.11-changepw-keyboard-*`, `R3-1.17-delete-password-keyboard-*`. Stable Android 15 behaves **identically** to the preview for the screens I could reach, so E2E-04 (bar hidden) is fixed on stable Android; the remaining issues are E2E-34 and E2E-38. Physical phone: not available.

### 7B. Display-size / font-scale change restarts the app (E2E-29)

1. `MainActivity` as generated by prebuild (`mobile/android/app/src/main/AndroidManifest.xml`):
   `<activity android:name=".MainActivity" android:configChanges="keyboard|keyboardHidden|orientation|screenSize|screenLayout|uiMode|smallestScreenSize|assetsPaths" android:launchMode="singleTask" android:windowSoftInputMode="adjustResize" android:theme="@style/Theme.App.SplashScreen" android:exported="true" android:screenOrientation="portrait">`
   **`configChanges` contains neither `density` nor `fontScale`** (nor `locale`/`layoutDirection`), so a density or font-scale change makes Android recreate the activity.
2. `dumpsys activity activities | grep -A3 -i mainactivity` before and after `wm density 480` in the middle of the registration code step: **same task #118, same ActivityRecord, same process (pid 29883)**; logcat shows "finishDrawing of relaunch". What the user saw: before = code step with typed digits; after = **Step 1 of 4 (role selection)**, all entered data gone, the app splash did not replay. (`7B_before.txt`, `7B_after.txt`)
3. Changing only the system font size in Settings → Display size and text (+ twice → `font_scale 1.3`) in the middle of step 2 with a typed phone number: same restart to Step 1, phone lost. **Rotation:** the app is portrait-only (`requestedOrientation=PORTRAIT`); `mRotation` stays 0 and nothing restarts. Signed-in sessions survive the restart (token restored; the app lands on the home shell).

### 7C. npm lockfile churn (E2E-18 / E2E-39)

1. `node -v` = `v24.13.0`; `npm -v` = `11.6.2` (and `10.9.9` via `npx npm@10`).
2. Clean checkout of `develop` (done on `git archive HEAD` copies with `--ignore-scripts`, so my real tree stayed clean):
   - **backend, npm 11.6.2 `npm install`:** the lockfile changes (≈ 37–39 changed lines): adds `"peer": true` flags and removes the `@emnapi/core` / `@emnapi/runtime` nodes. **npm 10.9.9: no diff.** → the churn depends on the npm version.
   - **mobile, npm 11.6.2:** ≈ 24 changed lines (`@expo/config-plugins` 57.0.7 → 57.0.9, `@expo/image-utils` 0.11.4 → 0.11.5, `@expo/require-utils` 57.0.4 → 57.0.5); **npm 10.9.9:** ≈ 44 changed lines, same three packages → the mobile diff is **not** an npm-version effect (the lockfile is stale).
   - Full diffs: `lock-backend-npm11-install.diff`, `lock-backend-npm10-install.diff`, `lock-mobile-npm11-install.diff`, `lock-mobile-npm10-install.diff`.
3. `npm ci`: **backend succeeds under both npm versions and leaves the lockfile unchanged.** **mobile fails under both** with `EUSAGE … package.json and package-lock.json … are not in sync` (the three packages above). (`npmci-*.log`, `npm10-ci-*.log`)
4. Lockfiles restored with `git checkout -- backend/package-lock.json mobile/package-lock.json`; nothing committed.

### 7D. Splash / icon details

- Handoff data: §1 row 1 and E2E-36; burst frames in `r3\frames\`, recordings `splash_run*.mp4`.
- `adb shell dumpsys window | grep -i splash` (8 captures during launches, `7D_splash_dump_1..8.txt`): `Window{… u0 Splash Screen lk.youthlink.app}` present during the native splash.
- Icon: brand mark correct, not cropped on the round mask (launcher, recents, App info); the only problem is the **label "mobile"** (E2E-35).
