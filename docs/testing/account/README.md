# Testing — Account Management and own profile

Owner: M. I. M. Afham · Module: `account` (FR-ACC-01 to FR-ACC-19) and the own-profile slice of `profile` (FR-PROF-01, FR-PROF-02, FR-PROF-06).

This folder records how the Account module was tested and what each test found. The first part covers the six manual end-to-end rounds that were run while the module was being finished (1 to 3 October 2026). Those rounds are what the Definition of Done's clause 3 asks for: "it runs end to end in the actual app" ([`CONTRIBUTING.md`](../../../CONTRIBUTING.md#definition-of-done)).

The repository's position is that automated test coverage is out of scope at this stage and that running the app end to end does that job (`CONTRIBUTING.md`, Definition of Done). The rounds below are that end-to-end evidence. Until 4 October 2026 the reports existed only in the developer's git-ignored `.worklog/`; they were added here unchanged so the evidence sits next to the code it tested.

| File | What it is |
| --- | --- |
| [`tester-prompts.md`](tester-prompts.md) | The six instructions given to the tester, verbatim, one per round |
| [`e2e-reports/`](e2e-reports/) | The six reports the tester returned, unchanged except for line endings |
| [`traceability.md`](traceability.md) | Every acceptance criterion of FR-ACC-01 to FR-ACC-19 and the three FR-PROF requirements, and the end-to-end item and automated test that covers it, with the gaps |
| [`manual-test-checklist.md`](manual-test-checklist.md) | A repeatable checklist for running the module on an emulator or phone, combining the six rounds, with the expected results the last rounds confirmed |

## 1. What kind of testing this was

**Manual, black-box, system-level acceptance testing on an Android emulator, against the real backend and a real PostgreSQL database.** The whole stack ran as it does for a user: the React Native development build on the emulator, the Express API, the seeded database, and Firebase Phone Authentication using Firebase's configured test numbers (no real SMS is sent to a test number).

- **Tester.** A Claude agent running on the developer's Windows machine, given the role of tester only. Every prompt forbids it from changing source code, committing or pushing; it reports, it does not fix. The developer ran the setup on their machine and decided what to fix; the reports are the tester's own text.
- **Driving the app.** The tester operated the app on the emulator through `adb`: taps and text input, screenshots (`adb exec-out screencap`), screen recordings for timing checks (splash, transitions), UI-hierarchy dumps (`uiautomator dump`) to measure exact pixel positions of fields, bars and the keyboard, and `wm density` to switch between 411 dp and 360 dp widths.
- **Checking behind the screen.** Each flow was also checked at the API with `curl` (status codes, error bodies, rate limits, that no response contains `passwordHash` or `nicEncrypted`) and in the database with SQL (for example: the NIC stored as ciphertext, an anonymised row after deletion, the lockout timestamp cleared after a code login).
- **Against what.** The acceptance criteria in [`docs/requirements.md`](../../requirements.md) and the screen specification in [`docs/prototype/M1-account.md`](../../prototype/M1-account.md), including exact copy, field order and error placement; in rounds 3 and 4 also the Figma frames, measured in dp.
- **Result per item.** PASS / FAIL / PARTIAL / BLOCKED / NOT TESTED, with evidence (screenshot name, log line, query and result). Defects were numbered **E2E-01 to E2E-50** across all rounds, each with a severity (BLOCKER, MAJOR, MINOR, LOW, COSMETIC, TOOLING, OBSERVATION), steps to reproduce, expected (quoting the requirement or prototype) and actual.

The rounds form a **fix and retest cycle**: round 1 was a full scripted pass over every feature area; each later round retested the previous round's findings after the fixes were merged, ran whatever had been blocked, and added a regression pass. Round 5 ended with a full smoke pass of the module, and round 6 confirmed the last three fixes before they were merged.

## 2. Environment

From the reports' environment sections:

| Item | Value |
| --- | --- |
| Emulator | AVD `Pixel_8`, Android 17 preview (API 37, Google Play image), 1080 × 2400 px. Widths tested: 411 dp (default) and 360 dp (`adb shell wm density 480`; Figma frames are 360 dp wide) |
| Second emulator | Round 3 only: Android 15 (API 35, `google_apis` image), for the keyboard checks on a stable Android version |
| App | Expo SDK 57 development build (`lk.youthlink.app`), React Native 0.86, rebuilt natively in rounds 3, 4 and 5 when native configuration changed |
| Backend | Node.js 24, npm 11, Express 5, Prisma 7, local PostgreSQL, reseeded with `npx prisma db seed` at the start of every round |
| Phone verification | Firebase test numbers +94 77 000 0091 (code 111222) and +94 77 000 0092 (code 333444), not held by any seeded account; seeded accounts for password login (password `Password123!`, see `backend/prisma/seed.js`) |
| SMS and email in development | Printed to the API console as `[Mock SMS]` / `[Mock Email]` lines; the tester read codes and links from there |

## 3. The six rounds

| Round | Date (Asia/Colombo) | Code under test | Scope | Report | New findings |
| --- | --- | --- | --- | --- | --- |
| 1 | 2026-10-01 23:39 to 10-02 01:10 | `develop` `4179d0c` (PR #43) | Full pass: registration, login and lockout, forgot password and recovery, Settings and its screens, own profile, shared foundation, cross-cutting (font scale, interrupted flows, API security smoke) | [`e2e-report-2026-10-02.md`](e2e-reports/e2e-report-2026-10-02.md) | E2E-01 to E2E-18 |
| 2 | 2026-10-02 03:55 to 06:20 | `develop` `3a1ace8` (PR #44, round 1 fixes) | The flows blocked in round 1 (registration, phone change, deletion with the Firebase test numbers), retest of E2E-01 to E2E-18, the developer's by-eye claims, reset by email from Settings | [`e2e-report-2026-10-02-round2.md`](e2e-reports/e2e-report-2026-10-02-round2.md) | E2E-19 to E2E-30 |
| 3 | 2026-10-02 to 10-03 | `develop` `013503b` (PR #45, round 2 fixes) | Retest of E2E-19 to E2E-30, launch splash, icon, dialogs, code input, keyboard on Android 17 and Android 15, Figma comparison of ten frames, data for the open items | [`e2e-report-2026-10-02-round3.md`](e2e-reports/e2e-report-2026-10-02-round3.md) | E2E-31 to E2E-41 |
| 4 | 2026-10-03 | `develop` `0e1a29a` (PRs #46 and #47, round 3 fixes) | Retest of E2E-31 to E2E-41, the 11 launch states, header and onboarding positions against Figma, splash timing, keyboard on registration, regression pass | [`e2e-report-2026-10-03-round4.md`](e2e-reports/e2e-report-2026-10-03-round4.md) | E2E-42 to E2E-47 |
| 5 | 2026-10-03 | `develop` `83867fd` (PR #48, round 4 fixes) | Final run: Part A the six fixes since round 4, Part B a full smoke pass of the module (B1 to B10) | [`e2e-report-2026-10-03-final.md`](e2e-reports/e2e-report-2026-10-03-final.md) | E2E-48 to E2E-50 |
| 6 | 2026-10-03 | branch `feature/account-management-afham` `b46a1cf`, before its merge as PR #52 | Last check of E2E-48, E2E-49, E2E-50 and a regression run on the touched screens | [`e2e-report-2026-10-03-lastcheck.md`](e2e-reports/e2e-report-2026-10-03-lastcheck.md) | none; verdict "Ready to merge" |

Round 1 found one BLOCKER (E2E-01, an account recovery request could not be submitted from the app) and three MAJOR defects; the backend checks (authentication, lockout, rate limits, single-use links, anonymising delete, no secret in any response) behaved to specification. In round 5 all ten areas of the Part B smoke pass passed (registration with the one keyboard failure counted under Part A, launch states as a spot check); round 6 closed the remaining three findings.

## 4. What happened to each finding

Final state of all 50 findings, taken from the retest tables of the following rounds (round 2 §2, round 3 §2, round 4 §11, round 5 Part A, round 6).

| Finding | Severity | Final state |
| --- | --- | --- |
| E2E-01 recovery request cannot be submitted | BLOCKER | Fixed, verified in round 2 |
| E2E-02 session end strands the user | MAJOR | Fixed, verified in round 2 |
| E2E-03 double headers on five screens | MAJOR | Fixed, verified in round 2 |
| E2E-04 keyboard covers the pinned button | MAJOR | Fixed, verified in round 2 (Android 17) and round 3 (Android 15); the related field-visibility issue continued as E2E-24, E2E-34, E2E-42 and E2E-48 |
| E2E-05 Settings stale after an email confirmation | MINOR | Fixed, round 2 |
| E2E-06 long email row, truncated tab labels | MINOR | Fixed, round 2 (residual clipping at 200 % became E2E-27, fixed) |
| E2E-07 login states differ from three frames | MINOR | Fixed, round 2 |
| E2E-08 employer engagement count wording and ENDED engagements | MINOR | Fixed, round 2 |
| E2E-09 editing a typed code | MINOR | Partly fixed in round 2, fixed in round 3 (Backspace, paste) |
| E2E-10 suspended login: stale banner, no way back | MINOR | Partly fixed in round 2; the remainder became E2E-26, fixed in round 3 |
| E2E-11 NIC correction copy and counter | MINOR | Fixed, round 2 |
| E2E-12 forgot-password button wording | MINOR | Fixed, round 2 |
| E2E-13 spent reset link still shows the form | MINOR | Fixed, round 2 |
| E2E-14 display name over 100 characters | MINOR | Withdrawn by the tester in round 2: the round 1 request sent the wrong field |
| E2E-15 straight quotes in a help article | COSMETIC | Fixed, round 2 |
| E2E-16 availability check unthrottled | LOW | Fixed, round 2 (30 per minute, then 429) |
| E2E-17 `pg` deprecation warning | LOW | Not reproduced in round 3 after the round 2 change |
| E2E-18 `npm install` rewrites the backend lockfile | TOOLING | Accepted: npm 11 behaviour; `npm ci` leaves the lockfile unchanged |
| E2E-19 code boxes cannot be tapped | BLOCKER | Fixed, round 3 |
| E2E-20 sign-out dialog without a scrim | MINOR | Fixed, round 3 |
| E2E-21 loading spinner clipped | MINOR | Fixed, round 3 |
| E2E-22 "Account deleted" never shown | MAJOR | Fixed, round 3 |
| E2E-23 onboarding art off-centre | MINOR | Fixed in round 3; vertical positions continued as E2E-33, fixed |
| E2E-24 focused last field half hidden | MINOR | Partly fixed in round 3; continued as E2E-34, E2E-42, E2E-48 |
| E2E-25 stale errors after editing | MINOR | Fixed, round 3 |
| E2E-26 no way back after a session end | MINOR | Fixed, round 3 |
| E2E-27 clipped first character at 200 % text | LOW | Fixed, round 3 |
| E2E-28 buttons named "busy" | LOW | Label fixed in round 3; "busy" sticking became E2E-31, fixed |
| E2E-29 display-size or font change restarts the app | LOW | Accepted, observation: the Android activity restarts on that configuration change (cause recorded in round 3 §7B) |
| E2E-30 registration and Settings use different email copy | LOW | Fixed, round 3 |
| E2E-31 "busy" stays after loading | MINOR | Fixed, round 4 |
| E2E-32 header 44 dp instead of 56 dp | MINOR | Fixed, round 4 |
| E2E-33 onboarding positions | MINOR | Fixed, round 4 |
| E2E-34 last field flush with the bar; code-login error clipped | MINOR | Continued as E2E-42 and E2E-43 |
| E2E-35 launcher label "mobile" | LOW | Fixed, round 4 |
| E2E-36 splash handoff in the development build | LOW | Continued as E2E-44 |
| E2E-37 ghost digits in the first code box | LOW | Fixed, round 4 |
| E2E-38 delete-password button floats above the keyboard | LOW | Fixed by a recorded design decision (button pinned like the other password screens, [`docs/decisions.md`](../../decisions.md)); verified in round 5 (A6: 24 dp above the keyboard at both widths) |
| E2E-39 mobile lockfile out of sync | TOOLING | Fixed, round 4 (`npm ci` succeeds) |
| E2E-40 parts of the app are not drawn in the prototype | OBSERVATION | No action: recorded as an observation (the undrawn parts are listed in the round 3 report) |
| E2E-41 Firebase fails on an image without Google Play | OBSERVATION | Environment only: a Play Store image is required |
| E2E-42 Legal name flush with the bar, counter hidden | MINOR | Continued as E2E-48 |
| E2E-43 code-login error line cut by the bar | LOW | Fixed, round 5 (A2) |
| E2E-44 splash black frame in the development build | LOW | Accepted: development build only, not reproduced in a release build (0 of 6 launches, round 4 §13) |
| E2E-45 resend countdown not in the accessibility tree | LOW | **Open.** Not fixed and not re-checked; the tester could not confirm it without TalkBack on a real phone |
| E2E-46 full stop alone on a line | COSMETIC | Continued as E2E-49 |
| E2E-47 brand-blue sliver during a transition | COSMETIC | Fixed, round 5 (A3) |
| E2E-48 Birthdate and Legal name under the bar at 360 dp | MINOR | Fixed, round 6 (C1) |
| E2E-49 full stop starts a line at 360 dp | LOW | Fixed, round 6 (C2) |
| E2E-50 Log in disabled after the third wrong password | LOW | Fixed, round 6 (C3) |

## 5. Limits of this testing

These are stated in the reports and are worth saying plainly:

- **Emulators only.** No physical phone was used. SMS autofill, TalkBack and real-phone keyboards were never tested; E2E-45 stays open for that reason.
- **Android only.** The app is Android-only at this stage; iOS was not tested.
- **One tester, one machine.** The level recorded in the pull requests is "self" in `CONTRIBUTING.md`'s terms, not "integration".
- **Evidence kept outside the repository.** The screenshots, screen recordings, UI dumps and logs named in the reports are on the developer's machine, not in this repository; the reports quote the measured values.
- **Manual, not automated.** Rerunning the end-to-end checks means following [`manual-test-checklist.md`](manual-test-checklist.md) (or a round's prompt) on an emulator.

## 6. Automated unit tests (added 4 October 2026)

After the module was closed, the business rules the rounds exercised by hand were also written down as automated Jest tests, so they can be rerun in seconds and show exactly which rule each one checks. They were written after the end-to-end rounds, not during development.

They are **unit tests**: each one runs one piece of the backend with the database, Firebase and the environment configuration replaced by stand-ins, so they need no database, no `.env` and no network. Run them from `backend/`:

```bash
npm ci
npx prisma generate
npm test
```

| File | What it checks |
| --- | --- |
| `backend/src/modules/account/test/account.nicCrypto.test.js` | NIC encryption is deterministic (the condition FR-ACC-05's unique index depends on), case and spaces do not create a second NIC, the stored value is ciphertext, tampered or malformed values are refused, last four |
| `backend/src/modules/account/test/account.passwordHash.test.js` | bcrypt at cost 12, salted, spaces kept, right and wrong passwords |
| `backend/src/modules/account/test/account.attemptLimiter.test.js` | The in-memory limits: block after the allowed attempts, release at the end of the window, clear, independent keys |
| `backend/src/modules/account/test/account.session.test.js` | Tokens (30 days, forged and expired refused), what counts as suspended, and `requireAuth`: missing or bad token, deleted account, suspension on the next request, tokens older than a password change refused, a password lockout does not end open sessions |
| `backend/src/modules/account/test/account.register.test.js` | Registration: every field check and its boundaries (password 8 to 64, NIC shapes, name 100, email), 18 and over from the birthdate, terms, the phone taken only from a verified Firebase token, duplicate phone, NIC and email, what is stored (NIC encrypted, email lower-cased, password hashed), the confirmation link stored as a hash, signed in afterwards |
| `backend/src/modules/account/test/account.login.test.js` | Password login: same message for a wrong password and an unknown number, the remaining-attempts warning only at 2 and 1 left, the pause on the 5th (423, 15 minutes), the right password refused while paused, a fresh count after the pause, the row lock; suspension messages on both paths; code login works during a lockout and lifts it |
| `backend/src/modules/account/test/account.reset.test.js` | Reset channels (masked email, unknown number answered like a number with no email), reset requests by SMS and email (codes and links, link stored as a hash, 15-minute expiry, 3 requests per 15 minutes, no enumeration), the server's own codes (6 digits, 5 minutes, supersede, Firebase-only purposes refused, single use), HTML escaping of the reset pages |
| `backend/src/modules/profile/test/profile.ownProfile.test.js` | Completion rate with the prototype's own example (1.18n 92% to 1.18nc 80% after a late cancellation weighted 2.0), star average over revealed ratings only, Phone verified and nothing about the NIC, business name for a Business employer, endorsements, employer and verifier counts |

**Checking that the tests can fail.** A test that passes whatever the code does proves nothing, so each of these rules was broken on purpose, one at a time, and the matching suite was run; every change was caught, and the code was then restored:

| Deliberate break | Suite that caught it |
| --- | --- |
| NIC encrypted with a random IV (duplicates would pass the unique index) | `account.nicCrypto` (3 failures) |
| NIC no longer upper-cased before encrypting | `account.nicCrypto`, `account.register` (5 failures) |
| Tokens older than a password change accepted | `account.session` (1) |
| `requireAuth` ends sessions while the password path is paused | `account.session` (1) |
| Lockout after 6 wrong passwords instead of 5 | `account.login` (2) |
| Remaining-attempts warning from 4 left instead of 2 | `account.login` (3) |
| Minimum age 17 instead of 18 | `account.register` (1) |
| Reset channels return the full email address | `account.reset` (2) |
| A late cancellation counted as a completion | `profile.ownProfile` (1) |

**What the unit tests do not show.** Anything that depends on the real database: the partial unique indexes refusing a duplicate, the row lock under concurrent requests, single use of codes and links, the anonymising delete. Nor do they show anything about the app's screens, which only the end-to-end rounds above cover.

## 7. Automated API tests against a real database (added 4 October 2026)

`backend/src/modules/account/test/account.api.integration.test.js` runs the real Express app over HTTP against a real PostgreSQL database: 34 tests across registration, login and the lockout, password change, password reset by SMS and by email, account recovery, the Settings screens, the own profile, deletion and a set of security checks.

**One thing is replaced: Firebase's token check.** A genuine Firebase ID token can only be produced by a phone completing an SMS check, which no test can do on its own. The suite replaces `firebaseAuth.js` with a stand-in that accepts tokens like `test-verified:+94770000091` and returns that number, the same thing the real check returns after Firebase has verified the phone. Everything the server does with the verified number runs for real. The real token check was exercised in the end-to-end rounds, with Firebase's test phone numbers.

**Running it.** It needs a separate, disposable database: before the tests it applies the migrations and runs the seed, and the seed empties every table. From `backend/`, after `npm ci` and `npx prisma generate`:

```bash
# once: create the test database (psql, or pgAdmin)
psql -U postgres -c "CREATE DATABASE youthlink_test;"

# then, on macOS / Linux / Git Bash
TEST_DATABASE_URL="postgresql://postgres:PASSWORD@localhost:5432/youthlink_test" npm test

# or in Windows PowerShell
$env:TEST_DATABASE_URL="postgresql://postgres:PASSWORD@localhost:5432/youthlink_test"; npm test
```

Without `TEST_DATABASE_URL`, `npm test` skips this suite and runs only the unit tests, so nobody needs a database to run `npm test`. The suite refuses to start unless the database is on this machine and its name contains "test", so it cannot wipe the development database by mistake. It sets its own keys and secrets for the run; it does not read or need `backend/.env`.

**Last run.** 34 of 34 passed, twice in a row, on 4 October 2026, in the cloud development container against PostgreSQL 18 (the `embedded-postgres` package); about 50 seconds per run. It has not yet been run on the developer's own machine.

**Checking that it can fail.** As with the unit tests, two rules that only a real database can show were broken on purpose:

| Deliberate break | Result |
| --- | --- |
| `SELECT ... FOR UPDATE` removed from the password login's transaction | "a login decides under a row lock" failed: the login no longer waited for the locked row |
| Deletion no longer overwrites the birthdate | the deletion test failed |

One test did **not** catch the missing row lock: ten wrong passwords sent at the same moment still ended in a lockout without it, because bcrypt spreads the requests out enough that they rarely overlap. That test is kept as a behaviour check and says so in its comment; the row-lock test above is the one that proves the lock.

**Coverage by area** (each test names its requirement in its title):

| Area | What is checked against the database |
| --- | --- |
| Registration | ACTIVE account, signed in, NIC stored only as ciphertext, bcrypt hash, email lower-cased; signup email link confirms once and is then dead; duplicate phone, NIC (including a lower-case `v`) and verified email refused; the partial unique index refuses a duplicate NIC even when the service is bypassed; under 18 and an unverified phone leave no row |
| Login | no secret in the answer; same message for a wrong password and an unknown number; 5 wrong passwords pause the path for 15 minutes, a session opened before keeps working, code login lifts the pause; a login waits on the row lock; suspension ends an open session on its next request and both login paths name the other |
| Password change | wrong current password is a field error, not a sign-out; success keeps this device and ends every other session; 6 wrong attempts are limited |
| Password reset | SMS code single use, wrong code refused, 5 wrong codes then 429 even for the right one, reset token single use, old sessions ended; email channel masked, link stored only as a hash, form shown once then "Link no longer valid" |
| Recovery | pending, approved (as `review-recovery.js approve` does), only the requesting device can see or use it, once; rejected; unmatched details look the same; a guessable device id refused |
| Settings | display name 100 characters and shown on the profile; NIC change needs the password and refuses another person's NIC; email change waits for its link, old address kept until then, cancel kills the link, an address on another account refused; posting as Business needs a name, Individual clears it, workers refused; phone change needs the password and a verified new number, old number stops working |
| Own profile | rating average, count and completion rate compared with values computed by SQL straight from the tables; employer and verifier counts compared with the tables; no NIC field |
| Deletion | blocked by an active engagement; wrong password refused; the person anonymised (phone, email, NIC, name, birthdate, password) while their ratings and engagements stay; the old token rejected; the same phone and NIC can register again |
| Security | every signed-in route answers 401 without a token; availability check limited to 30 a minute; no response in the whole run contained a password hash or an encrypted NIC |
