# YouthLink

A mobile platform connecting youth job-seekers in Sri Lanka with verified local gigs, part-time jobs, and internships posted by nearby businesses and individuals.

The problem it exists to solve: a first-time worker with no track record can't get hired, because nobody has a reason to trust them — and a local employer has no safe, efficient channel for finding reliable short-term help. YouthLink answers that with a layered trust system: phone verification, real names, bidirectional double-blind ratings tied to genuinely completed engagements, and — for someone with no history at all — a vouch from a community member who personally knows them.

Aligned to **SDG 1** (No Poverty) and **SDG 8** (Decent Work and Economic Growth).

---

## Documentation

Read these before writing code. They're short, and most of the mechanisms here aren't guessable from the UI.

| Document                                               | What it's for                                                                                                                                 |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| [`docs/product-overview.md`](docs/product-overview.md) | **Start here.** How the whole system works and why — check-in codes, the endorsement bootstrap, the applicant sort, the dispute pipeline.     |
| [`docs/requirements.md`](docs/requirements.md)         | The normative baseline: 129 functional and 32 non-functional requirements, each with acceptance criteria. Your work is checked against these. |
| [`docs/database-schema.md`](docs/database-schema.md)   | All 20 tables and 49 foreign keys, plus why each looks the way it does and what deliberately isn't modelled.                                  |
| [`docs/module-ownership.md`](docs/module-ownership.md) | Who owns which module this sprint, and exactly which requirements each covers.                                                                |
| [`CONTRIBUTING.md`](CONTRIBUTING.md)                   | Branching, commit format, pull requests, and the Definition of Done.                                                                          |

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
├── backend/                Node.js + Express API (CommonJS)
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
- Access to the team's Firebase project (Phone Auth + FCM)
- The Expo tooling, plus the team's Android **development build** — Expo Go cannot run this app

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

**Mobile**

```bash
cd mobile
npm install
npx expo start --dev-client
```

> **Expo Go will not run this app.** Firebase phone authentication and push notifications are native modules, as are the navigation packages, so a **development build** is required. Ask whoever produced the current APK for it rather than making your own.

If `npm install` doesn't already bring in the navigation packages, install them with Expo so the versions match the SDK:

```bash
npx expo install @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context
```

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
