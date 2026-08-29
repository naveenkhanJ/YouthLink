# DEMO.md — running and presenting the integration demo

This file exists only on the `demo/integration-showcase` branch. It explains
how to run the whole app from a cold machine, what to show, what is real
work versus scaffolding, and exactly what to delete when this branch has
served its purpose.

**This branch must never be merged into `develop`.** It crosses module
boundaries on purpose so that four separately-built slices can be shown in
one app. Everything in it is either a teammate's own work, a fix to a
teammate's work, or clearly-marked scaffolding — see
[What is real and what is scaffolding](#what-is-real-and-what-is-scaffolding).

---

## 1. What this branch is

Four people built four vertical slices against an agreed contract, but
nothing connected them and three of the four had no way to be reached in the
app. This branch merges all of them, fixes what stopped them working
together, and adds a launcher so any slice can be demonstrated in any order.

| Slice | Epic | Owner | State on this branch |
| --- | --- | --- | --- |
| Account Management | `FR-ACC` | Afham | The owner's own work, merged from `develop`. Untouched apart from the brand colour. |
| Gig Posting | `FR-POST` | Lahiru | Backend is the owner's. **Screens were lost and have been rebuilt here** — see §7. |
| Discovery & Search + Notifications | `FR-DISC`, `FR-NOTIF` | Pawan | The owner's own work, merged from his branch, plus the fixes in §7. |
| Applying & Selection | `FR-APPLY` | Naveenkhan | The owner's own work, merged from his branch, plus the fixes in §7. |

---

## 2. Running it from a cold machine

### 2.1 Prerequisites

| Tool | Version used | Notes |
| --- | --- | --- |
| Node.js | v24.13.0 | `node --version` |
| npm | 11.6.2 | ships with Node |
| PostgreSQL | any recent | must be running, with the database named in `backend/.env` |
| Android Studio | any recent | for the emulator and the Android SDK |
| **JDK 21** | `C:\Program Files\Java\jdk-21.0.10` | **see §2.5 — this one matters** |

You do **not** need a Mac, an Apple Developer account, or a physical phone.
Mobile is Android-only for these sprints.

### 2.2 Install dependencies

Run each once, from the repository root:

```bash
cd backend  && npm install
cd ../mobile && npm install
```

### 2.3 Backend environment

`backend/.env` is git-ignored and holds real values; `backend/.env.example`
lists every variable that must exist. If you don't have a `.env`, copy the
example and fill it in:

```bash
cd backend
cp .env.example .env
```

Then generate the Prisma client and apply migrations:

```bash
cd backend
npx prisma generate
npx prisma migrate deploy
```

`backend/generated/` is git-ignored, so `npx prisma generate` is required on
every fresh clone — the server will not start without it.

### 2.4 Firebase credentials (needed only for the phone-verification paths)

Registration and OTP login go through Firebase Phone Authentication. Password
login, and every other slice, work without any of this.

- **Backend:** the Admin SDK service-account JSON, path set in
  `FIREBASE_SERVICE_ACCOUNT_PATH` in `backend/.env`.
- **Mobile:** `mobile/google-services.json`. Git-ignored; download it from
  Firebase Console → Project Settings → your Android app.

Firebase test numbers (no real SMS is sent):

| Phone | Code |
| --- | --- |
| `+94770000001` | `123456` |
| `+94770000002` | `654321` |

### 2.5 The JDK trap — read this before building

Android builds on this project need **JDK 21**. Neither of the obvious
choices works:

- **JDK 11** — too old; Gradle refuses to start.
- **Android Studio's bundled JBR (Java 25)** — too new; every
  `configureCMakeDebug` task fails with *"a restricted method in
  java.lang.System has been called"*. This looks like a code problem and is
  not one.

Point `JAVA_HOME` at JDK 21 for the build command only, rather than changing
it system-wide.

---

## 3. Starting the demo — the four things that must be running

Open these in **separate terminals**, in this order.

### Terminal 1 — PostgreSQL

However you normally run it. The backend will not start without it.

### Terminal 2 — backend API

```bash
cd backend
npm run dev
```

Expect `API listening on http://localhost:3000`.

**Port 3000 must be free.** If something else is on it, the backend appears
to start but the app talks to the wrong server. To check and clear it on
Windows:

```powershell
Get-NetTCPConnection -LocalPort 3000 -State Listen |
  ForEach-Object { Get-Process -Id $_.OwningProcess }
# then, if it is not something you need:
Stop-Process -Id <PID> -Force
```

### Terminal 3 — seed the demo data

```bash
cd backend
node src/demo/seed.demo.js
```

Safe to re-run at any time: it wipes its own accounts first, so it never
stacks duplicates. **Run it again between rehearsals** to reset selections.

To clear it entirely: `node src/demo/seed.demo.js --wipe`

### Terminal 4 — the emulator and the app

Start the emulator first:

```bash
# adjust the AVD name if yours differs
"$ANDROID_HOME/emulator/emulator" -avd Pixel_8
```

Then, **if the app is already installed** on that emulator (the usual case):

```bash
cd mobile
npx expo start --dev-client
```

Press `a`, or launch YouthLink from the emulator's app drawer.

If the app opens to a "could not connect" screen, run
`adb reverse tcp:8081 tcp:8081` and reload.

---

## 4. When do you need a native rebuild?

Most of the time you do **not**. A rebuild takes minutes and can fail; JS
changes do not need one.

**No rebuild needed** — just `npx expo start --dev-client`:

- any change to JavaScript, screens, styles or business logic
- pulling this branch onto a machine that already has the app installed
- changing anything in `backend/`

**Rebuild required** when the native layer changes:

- a new native dependency is installed
- `mobile/app.json`'s native config changes
- `google-services.json` is added or replaced
- the app is not installed on this emulator yet

To rebuild:

```bash
cd mobile
JAVA_HOME="C:\Program Files\Java\jdk-21.0.10" npx expo run:android
```

In PowerShell:

```powershell
cd mobile
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21.0.10"
npx expo run:android
```

The first build downloads the Android NDK (~2.3 GB) and can take well over an
hour on a slow connection. Later builds reuse it and take a couple of minutes.
If a teammate has already built, copying their
`AppData\Local\Android\Sdk\ndk\27.1.12297006` folder is much faster than
downloading it again.

---

## 5. The demo accounts

Every seeded account uses the password **`Demo1234`**. The hub's **Switch
role** section signs in to any of them in one tap.

| Role | Phone | Name | Why this one exists |
| --- | --- | --- | --- |
| Employer | `+9477999001` | Nimal Perera | Owns the postings; does the selecting |
| Worker — tier 1 | `+9477999011` | Dilani Fernando | 5-star history, 100% completion |
| Worker — tier 2 | `+9477999012` | Ruwan Jayasuriya | Endorsed, no rating history |
| Worker — tier 3 | `+9477999013` | Sanduni Bandara | New to YouthLink |
| Community endorser | `+9477999002` | Kamala Silva | Vouched for Ruwan |

The three workers exist to make the **three-tier applicant sort** visible.
Nothing else in the system can currently produce rating history, so without
this seed that sort renders as a flat list.

**An account you register in the app will not appear under Switch role.** That
list is fixed, and one-tap sign-in only works because the seeded accounts
share one known password. Sign in to a self-registered account through the
real **Log in** screen instead, under Account Management in the hub.

---

## 6. Suggested demo run — the core loop in about ten minutes

The hub is the launcher: it lists every screen grouped by whose slice it
belongs to, and every screen has a **Demo hub** button in its header, so you
can jump between slices in any order. This script follows
post → discover → apply → select.

**1. Account Management — Afham (FR-ACC)**
Hub → Account Management → **Create account**. Register with `+94770000002`,
code `654321`. Show the ToS checkbox blocking submission, the password
visibility toggle, and the confirm-password field. Then **Log in** with the
account you just made.
*Or, faster:* show **Log in** with both the Password and OTP paths.

**2. Gig Posting — Lahiru (FR-POST)**
Switch role → **Employer**. Hub → Gig Posting → **Post a gig**.
- Step 1 — title and description caps count down; the category list is the
  seven allow-listed options with no free-text box (FR-POST-02).
- Step 2 — pick **Gig** on step 1 and pay is a single fixed total; go back and
  pick **Part-time job** and it becomes a rate with a unit selector, and a
  Schedule field appears (FR-POST-04, FR-POST-03).
- Step 3 — choose **In 1 hour** and press Continue: blocked, with the reason
  (FR-POST-05). Change to **In 30 hours**.
- Step 4 — the review. Every field, then **URGENT** and the general-area map,
  both under "Computed — not editable" (FR-POST-09). Point out that there is
  no urgency switch anywhere on the form — it is derived (FR-POST-07).
- Post it, then open **My postings** → the new posting. As its owner you see
  the **exact** address.

**3. Discovery — Pawan (FR-DISC)**
Switch role → **Worker — tier 1**. Hub → Discovery → **Explore Gigs**.
Show the area chips, category and arrangement-type filters, the four sort
orders, and the "Auto-expanded search to 50km" banner. Open the gig you just
posted: the address is now only the **general area** — same posting, different
viewer (FR-POST-08).

**4. Applying — Naveenkhan (FR-APPLY)**
From that listing tap **Apply**, add a note, submit. Switch role to **tier 2**
and **tier 3** and apply with each.

**5. Selection — the payoff**
Switch role → **Employer**. Hub → Applying & Selection → **Applicants** → the
posting. The pool is sorted **tier 1, tier 2, tier 3** — rating history first,
then endorsed, then new — even though they applied in the opposite order
(FR-APPLY-04). Select two.

**6. What selection sets off**
- The posting flips to **FILLED**, and the third applicant is resolved to
  **Not selected** automatically (FR-APPLY-09).
- Switch role → **tier 3** → Hub → Notifications: the not-selected message.
- Switch role → **tier 1** → **My applications**: selected, with the
  employer's phone number and the **precise address** now released — the same
  posting that showed only an area a minute ago (FR-APPLY-07, FR-POST-08).

**7. Notifications — Pawan (FR-NOTIF)**
Hub → Notifications → **Notification Preferences**, turn on urgent alerts.
Post another urgent gig as the Employer, then come back: the alert is there.
Post more than five in a day and the rest roll up into one **"N more urgent
gigs today"** digest rather than five more notifications (FR-NOTIF-01).

---

## 7. What is real and what is scaffolding

### Written by the slice owners

Everything under `backend/src/modules/` and `mobile/src/screens/` belongs to
its epic's owner, **except** the Gig Posting screens (below). The three-tier
sort, the radius search with auto-expansion, the notification fan-out and
digest, the registration and login flows, and the location-privacy rule are
all their authors' work.

### Rebuilt here because the originals were lost

`mobile/src/screens/posting/` — the Gig Posting screens. Built on this branch
against the existing FR-POST backend and requirements, in the same style as
the other modules. **This is the one place where a slice's UI was not written
by its owner**, and the owner should review and take it over.

### Fixes made to other people's modules

Each of these was a real defect that stopped the slices working together. All
were verified by running them, and all still need making on the owners' own
branches — **fixing them here does not fix them on `develop`**.

**Gig Posting**
- `posting.routes.js` never applied `requireAuth`, so every authenticated
  route returned 401 unconditionally — the module was unreachable, not broken.
- Error responses used a shape the mobile client does not read, so every
  validation message rendered as "Request failed (400)".
- `posting.location.js` — the whole FR-POST-08 rule — was written but imported
  by nothing except its own tests.
- No role check on create: once the routes worked, any signed-in worker could
  post a gig and apply to it.
- The validators demanded a rate unit for every pay kind, which made an Unpaid
  internship and a fixed-total Gig impossible to submit; schedule was optional
  for all arrangement types; and pay kind was never checked against
  arrangement type (FR-POST-03, FR-POST-04).

**Applying & Selection**
- `select()` could overfill a posting under concurrent selections; now decided
  under a row lock.
- `select()` never re-checked the posting was still open.
- `apply()` could create two live applications for one worker.
- `withdraw()` and `decline()` acted twice on a double tap — two "declined"
  notifications for one decision.
- The applicant pool's average rating counted admin-removed ratings.
- FR-APPLY-07's contact reveal was one-directional: the employer never got the
  selected worker's number.
- `API_BASE_URL` was committed as a developer's own LAN IP, so the app could
  not reach the backend from any other machine.

**Discovery & Notifications**
- `notifyNewGigPosted` had no caller anywhere — FR-NOTIF-01 and FR-NOTIF-02
  were dead code.
- Over-limit urgent notifications created one standalone "digest" per posting,
  which is not a digest; now one parent per day with the rest rolled into it.
- `sortBy=recency` sorted by start time, so FR-DISC-05's recency option was
  unavailable.
- The arrangement-type filter was in state and sent to the API but no chips
  were ever rendered — half of FR-DISC-03 was unreachable.
- An unparseable `lat`/`lng` returned 200 with an empty list instead of 400.
- `markAsRead` reported success for a nonexistent notification.
- The "Current / Auto GPS" chip carried hardcoded Colombo coordinates and made
  no geolocation call.

### Scaffolding — belongs to nobody, delete when done

| Path | What it is |
| --- | --- |
| `backend/src/demo/demo.routes.js` | A browse-all endpoint (Discovery's job) and a current-user lookup the hub needs |
| `backend/src/demo/seed.demo.js` | The demo fixtures |
| `mobile/src/demo/` | The hub, the session store, and the browse and notifications screens |
| One import + one mount in `backend/src/app.js` | Mounts `/api/demo` |
| Three edits in `mobile/src/navigation/RootNavigator.js` | The demo manifest, the initial route, and the header button |

---

## 8. Known limitations

- **Notification fan-out has no radius filter.** FR-NOTIF-01/02 scope alerts
  to workers "within the search radius", but `User` has no location field to
  compare against, so every active job-seeker is notified. Fixing it needs a
  schema change and was deliberately left alone.
- **No real map or device location.** Both need native modules that would
  force a rebuild. Areas are picked from a list; the coarse-vs-precise
  behaviour that list feeds is real.
- **No session persistence.** Closing the app signs you out. Persisting the
  token needs `expo-secure-store`, another native module.
- **Deferred slices are absent by design.** Engagement Lifecycle, Ratings &
  Reputation, Profile & Trust Signals and Community Endorsement have no owner
  and no sprint assigned, so the hub does not list them.

---

## 9. Undoing all of this

When the demo is over, or when the owners have taken their fixes back onto
their own branches:

1. Delete `backend/src/demo/` and `mobile/src/demo/`.
2. Remove the `demoRoutes` import and the `/api/demo` mount from
   `backend/src/app.js`.
3. Revert `mobile/src/navigation/RootNavigator.js` — remove the demo manifest
   import and entry, set `initialRouteName` back to `"Home"`, and drop the
   `screenOptions` header button.
4. Delete `DEMO.md`.

Everything left is either a slice owner's own work or a fix to it, and each
fix is described in §7 so it can be raised with the right person rather than
carried over wholesale.
