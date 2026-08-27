# YouthLink

A mobile platform connecting youth job-seekers in Sri Lanka with verified local gigs, part-time jobs, and internships posted by nearby businesses and individuals.

The problem it exists to solve: a first-time worker with no track record can't get hired, because nobody has a reason to trust them — and a local employer has no safe, efficient channel for finding reliable short-term help. YouthLink answers that with a layered trust system: phone verification, real names, bidirectional double-blind ratings tied to genuinely completed engagements, and — for someone with no history at all — a vouch from a community member who personally knows them.

Aligned to **SDG 1** (No Poverty) and **SDG 8** (Decent Work and Economic Growth).

---

## Documentation

Read these before writing code. They're short, and most of the mechanisms here aren't guessable from the UI.

| Document                                               | What it's for                                                                                                                                                       |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`docs/product-overview.md`](docs/product-overview.md) | **Start here.** How the whole system works and why — check-in codes, the endorsement bootstrap, the applicant sort, the dispute pipeline.                           |
| [`docs/requirements.md`](docs/requirements.md)         | The normative baseline: 131 functional and 32 non-functional requirements, each with acceptance criteria. Your work is checked against these.                       |
| [`docs/database-schema.md`](docs/database-schema.md)   | All 20 tables and 49 foreign keys, plus why each looks the way it does and what deliberately isn't modelled.                                                        |
| [`docs/module-ownership.md`](docs/module-ownership.md) | Who owns which module this sprint, and exactly which requirements each covers.                                                                                      |
| [`docs/decisions.md`](docs/decisions.md)               | Why things are the way they are — read it when something looks arbitrary, wrong, or like an oversight. Includes sprint-planning decisions, not just technical ones. |
| [`CONTRIBUTING.md`](CONTRIBUTING.md)                   | Branching, commit format, pull requests, and the Definition of Done.                                                                                                |

---

## Tech stack

| Layer            | Choice                          | Notes                                                                                                                                                     |
| ---------------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mobile app       | **React Native** via **Expo**   | The consumer-facing product — job-seekers, employers, endorsers                                                                                           |
| Web dashboard    | **React + Vite**                | Internal Admin/Moderator tooling only. Not Next.js — no SSR or SEO need for a staff tool                                                                  |
| Backend          | **Node.js + Express**           | Shared by both frontends                                                                                                                                  |
| Database         | **PostgreSQL + Prisma**         | The domain is deeply relational — users, postings, engagements, ratings, endorsements, disputes — with real uniqueness constraints and multi-entity joins |
| OTP / SMS + push | **Firebase** (Phone Auth + FCM) | One project covers both                                                                                                                                   |
| Maps             | **react-native-maps**           | Location is central: radius search, coarse public area, precise pin after selection                                                                       |
| Language         | **JavaScript**                  | Not TypeScript — a deliberate call given the team's current familiarity                                                                                   |

---

## Repository layout

```
YouthLink/
├── backend/                Node.js + Express API (ES modules)
│   ├── prisma/             schema.prisma and migrations
│   ├── index.js            Server bootstrap — starts the listener, nothing else
│   └── src/
│       ├── app.js          Express assembly and route mounting
│       ├── config/         Environment variables, read here and nowhere else
│       ├── lib/            Shared infrastructure — the Prisma client
│       ├── middleware/     Auth, error handling, 404
│       ├── modules/        One folder per epic — account, posting, discovery,
│       │                   application, notification. Your work lives here
│       └── utils/          AppError, asyncHandler
├── mobile/                 React Native via Expo — the consumer app
│   └── src/
│       ├── api/            One file per backend module, plus client.js
│       ├── components/     Shared UI
│       ├── config/         API base URL, Firebase config
│       ├── navigation/     RootNavigator — collects every module's screens
│       ├── screens/        One folder per module
│       └── utils/
├── dashboard/              React + Vite — internal Admin/Moderator tooling
│   └── src/                api, components, lib, pages (Sprint 3/4)
├── shared/                 Code used by more than one surface — currently empty
├── docs/                   Requirements, schema, product overview, ownership
├── AGENTS.md               Context for AI coding agents
├── README.md
└── CONTRIBUTING.md
```

**Both `backend/src/` and `mobile/src/` are organised by module, not by layer.** The obvious structure would be `routes/`, `controllers/`, `services/` with every module mixed together inside each — but four people build four modules simultaneously, so that puts all four of us in the same three directories on every pull request. Module-first means each person works almost entirely inside one folder.

Each surface has a `src/README.md` explaining its structure and the rules worth not learning the hard way. Read yours before your first commit.

---

## Getting started

### Prerequisites

- Node.js and npm
- A PostgreSQL instance you can connect to
- Access to the team's Firebase project (Phone Auth + FCM) — ask in the team channel, you need both Console access and two downloaded config files, see Mobile below
- A way to run a **development build** of the mobile app — Expo Go cannot run it, the navigation packages and Firebase are native modules. See "Running the mobile app" below for what device/emulator options this actually requires

### First-time setup

```bash
git clone https://github.com/naveenkhanJ/YouthLink.git
cd YouthLink
git checkout develop        # all work branches off develop, never main
```

Then set up whichever surfaces you're working on. **Each block starts from the repository root**, so open a fresh terminal per surface rather than running them in sequence.

**Backend**

```bash
cd backend
npm install
cp .env.example .env      # then fill in your local values
npx prisma migrate dev    # applies the schema to your database
npx prisma generate       # creates the Prisma client — it is git-ignored,
                          # so it is never present in a fresh clone
npm run dev
```

Then check `http://localhost:3000/health` returns `{"status":"ok","database":"configured"}`.

> **Known temporary blocker (as of 2026-08-19):** `npm run dev` currently fails
> to boot at all — `src/modules/posting/` (Gig Posting) is still CommonJS while
> the rest of the backend is ES modules, and that's a link-time failure, not a
> routing one: Node fails resolving `app.js`'s imports before a single request
> could be handled, on every branch, regardless of whether you'd ever call a
> posting endpoint. The real fix is Lahiru's ESM conversion on
> `feature/gig-posting` merging into `develop` — check whether that's landed
> before assuming this still applies. Until it does, if you need a working
> server locally: copy `src/app.js` to `src/app.local.js`, remove the posting
> import and its `app.use("/api/postings", ...)` line from that copy, then
> copy `index.js` to `index.local.js` **and change its `import app from
"./src/app.js"` to `"./src/app.local.js"`** — easy to miss, and if you
> don't, `index.local.js` still loads the original, still-broken `app.js`
> and you're back to the same crash. Run `node index.local.js` instead of
> `npm run dev`. Never commit either copy — already covered by the root
> `.gitignore`'s `*.local.js` pattern.

**Mobile**

```bash
cd mobile
npm install
```

**Firebase, before anything else runs.** The mobile app needs its own client
setup, separate from the backend's Firebase Admin SDK credentials above —
having one configured doesn't mean the other is. From Firebase Console
(ask in the team channel for access):

1. **Project Settings → your Android app → `google-services.json`** → download it, save as `mobile/google-services.json`.
2. **Project Settings → your iOS app → `GoogleService-Info.plist`** → download it, save as `mobile/GoogleService-Info.plist`.

Both are git-ignored (not secrets by Google's own design, but treated with the same care as the backend's Firebase key — not committed regardless).

**Check `mobile/app.json` has these, and add them if it doesn't** — this depends on whether Account Management's Firebase setup has merged into your copy of `develop` yet:

```json
{
  "expo": {
    "android": {
      "package": "lk.youthlink.app",
      "googleServicesFile": "./google-services.json"
    },
    "ios": {
      "bundleIdentifier": "lk.youthlink.app",
      "googleServicesFile": "./GoogleService-Info.plist"
    },
    "plugins": [
      "@react-native-firebase/app",
      "@react-native-firebase/auth",
      ["expo-build-properties", { "ios": { "useFrameworks": "dynamic" } }]
    ]
  }
}
```

`lk.youthlink.app` is the team's actual registered identifier in Firebase Console — verified against the downloaded config files' own `package_name`/`BUNDLE_ID` fields, not just asserted. If your `app.json` is missing these, add them rather than guessing a different identifier.

> **Expo Go will not run this app.** Firebase phone authentication and the navigation packages are native modules, so a **development build** is required — see "Running the mobile app" below for what that actually takes on your platform.

If `npm install` doesn't already bring in the native packages, install them with Expo so the versions match the SDK:

```bash
npx expo install @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context @react-native-firebase/app @react-native-firebase/auth expo-build-properties
```

### Running the mobile app

**Android only for Sprints 1–2** (see `AGENTS.md`) — Options A and B below are the actual current choices. A development build is required either way; neither requires anyone else's pre-built APK, each produces your own.

**Option A — Android emulator (no Android device needed, free, no subscription).**

1. Install [Android Studio](https://developer.android.com/studio). In its Device Manager, create a virtual device using a system image tagged **"Google Play"** specifically, not just "Google APIs" — Firebase phone-auth verification needs real Play Services, which only the Google-Play-tagged images include.
2. **Hardware virtualization must be enabled in your BIOS/UEFI** (Intel VT-x / AMD-V), or the emulator will be unusably slow or refuse to start. Check Task Manager → Performance → CPU → "Virtualization" first; only reboot into BIOS if it says Disabled.
3. **JDK version matters and the default may be wrong.** Gradle needs JDK 17+, but Android Studio's own bundled JDK can be _too new_ — a JDK past what the Android Gradle Plugin's native/CMake tooling has caught up with will fail every native module's build with `WARNING: A restricted method in java.lang.System has been called`, not an obviously JDK-related error. **JDK 21 (LTS) is the safe, well-tested choice.** If you hit that error, install/point at a JDK 21 instead of whatever Android Studio bundled, and retry — the fix is just the JDK, nothing else needs to change.
4. From `mobile/`, with the emulator running: `npx expo run:android`. First run compiles native code (including Firebase) and can genuinely take over an hour depending on your connection — it downloads the Android NDK (700MB+) and CMake. Subsequent runs are fast; `npx expo start --dev-client` after that gives normal fast-refresh for JS/UI changes. A rebuild via `expo run:android` is only needed again when a _native_ dependency changes.

**Option B — a real Android device.** Same `npx expo run:android` command, with the device connected via USB and USB debugging enabled in Developer Options, instead of an emulator running. No Android Studio strictly required if you already have the Android SDK platform-tools (`adb`) — Android Studio remains the easiest way to get them. No emulator-specific setup (virtualization, system images) applies; the JDK-version note above still does.

**iOS — not needed for Sprints 1–2, kept here so this doesn't read as "Android because that's the only path we documented."** It's a real choice the team made (Android-only), not a limitation of the tooling. For when it becomes relevant: iOS needs either a Mac, or [EAS Build](https://docs.expo.dev/build/introduction/) (Expo's cloud build service, which itself needs no Mac — every build runs in a macOS VM on Expo's infrastructure). What you'd need beyond that depends on where you're running the result:

- **iOS Simulator:** free, no Apple Developer account needed — but the simulator itself only runs on macOS, so Mac access is needed regardless of who builds it.
- **A physical iPhone:** needs a paid Apple Developer Program membership ($99/year) for the device provisioning, whether built locally on a Mac or via EAS Build. There's no free path to installing a custom dev-client build on a physical iPhone.

**Dashboard**

```bash
cd dashboard
npm install
npm run dev
```

### Secrets

**Never commit `.env` or any credential.** Database URLs, Firebase keys, and API secrets stay local. `.env.example` is the committed template — when you add a new variable, add it there with a placeholder value so nobody else's setup silently breaks.

### The database schema is already designed

Don't design tables as you go. The complete schema — every entity the requirements imply, not just the ones your slice touches — is specified in [`docs/database-schema.md`](docs/database-schema.md) and lands in a single migration before feature work starts. That's deliberate: it means nobody waits on someone else's tables.

If you later need to change an existing table, **tell the affected teammates before you do it**. `Engagement` alone is touched by four of the eight modules, so a silent migration can break work in several places at once. This is part of the Definition of Done — see [`CONTRIBUTING.md`](CONTRIBUTING.md).

---

## How the work is split

Four developers, one module each per sprint. A module is a **vertical slice** — you own its backend and its frontend together, rather than the team splitting into backend and frontend halves. Current assignments are in [`docs/module-ownership.md`](docs/module-ownership.md).

Two things sit outside that split, done once by one person before feature work begins: the initial project scaffolding and the full database schema.

---

## Scope

**In scope:** gigs, part-time jobs, and internships; the full post → discover → apply → select → complete → rate loop; community endorsement for zero-history workers; disputes and moderation; an internal Admin/Moderator dashboard.

**Deliberately not built** — each considered and excluded on purpose, not overlooked:

- No in-app payment, escrow, or commission — money changes hands outside the app
- No permanent or full-time job postings — the trust loop needs a bounded engagement with a completion moment
- No users under 18
- No real KYC or Police Clearance verification
- No in-app messaging, profile photos, draft postings, or block-user feature

The full list, with the reasoning behind each, is in [`docs/requirements.md`](docs/requirements.md) §5 and [`docs/product-overview.md`](docs/product-overview.md) §13. **Check there before adding something that seems missing** — several apparent gaps are decisions.

---

## Team

| Name                         | Role                      |
| ---------------------------- | ------------------------- |
| J. Naveenkhan                | Product Owner · Developer |
| M. I. M. Afham               | Scrum Master · Developer  |
| P. M. L. Lakmal _(Lahiru)_   | Developer                 |
| H. P. Weliwitigoda _(Pawan)_ | Developer                 |

All four write code regardless of Scrum role.
