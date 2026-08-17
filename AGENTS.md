# AGENTS.md — YouthLink

Context for any AI coding agent working in this repository. Written to be tool-neutral: the four of us use different agents.

**This file points; it does not copy.** Everything here has a source of truth elsewhere in the repository. If this file and a linked document ever disagree, the linked document wins and this one is out of date.

---

## What this is

**YouthLink** — a mobile platform connecting Sri Lankan youth job-seekers with verified local gigs and part-time work. Aligned to UN SDG 1 (No Poverty) and SDG 8 (Decent Work and Economic Growth). Built by four students as a university group project; every contributor must be able to explain their own code in a live viva.

**Write clear, conventional, well-commented code over clever code**, and state your reasoning when a real choice was made. Code nobody can defend is worse than no code.

Three surfaces: `backend/` (Node.js + Express, **ES modules**), `mobile/` (React Native via Expo, Android only for now), `dashboard/` (React + Vite). JavaScript throughout, not TypeScript. PostgreSQL via Prisma.

---

## Read before writing code

| Document                                               | What it's for                                                                                                                                                                                                                                                            |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [`docs/requirements.md`](docs/requirements.md)         | **The specification.** 129 functional + 32 non-functional requirements, each with Given/When/Then acceptance criteria. Read the full entry for a requirement before implementing it                                                                                      |
| [`docs/product-overview.md`](docs/product-overview.md) | How the system works and _why_. Four mechanisms are not guessable from the UI or the schema — the check-in code exchange (custody flips to the worker at the payment step), the endorsement bootstrap, the three-tier applicant sort, and the double-blind rating reveal |
| [`docs/decisions.md`](docs/decisions.md)               | **Why things are the way they are.** Read it when something looks arbitrary, wrong, or like an oversight. Mostly pointers to reasoning that lives next to what it governs. Add to it when a decision turns out not to be written down                                    |
| [`docs/database-schema.md`](docs/database-schema.md)   | 20 tables, every field, and a "Deliberately Not Modeled" section. Consult it whenever you touch data                                                                                                                                                                     |
| [`docs/module-ownership.md`](docs/module-ownership.md) | Who owns which module, per-story tasks, and the cross-cutting authentication contract                                                                                                                                                                                    |
| [`CONTRIBUTING.md`](CONTRIBUTING.md)                   | Branching, commit format, pull requests, Definition of Done                                                                                                                                                                                                              |

**Acceptance criteria are the specification.** Check your work against the documented Given/When/Then, explicitly, not against your own sense of finished. That is clause 1 of the Definition of Done.

**Each developer keeps a `.worklog/progress.md`** — per-developer working state, since chat sessions lose context and Jira/git don't hold everything (what's actually verified, decisions made mid-implementation, where to pick up). It's git-ignored, so it isn't visible in this repo history and isn't shared between us. Read your own at the start of a session; update it at the end.

---

## Non-negotiable

1. **Never modify `backend/prisma/schema.prisma` or create a migration** without being asked. The full schema was designed up front and migrated deliberately so nobody blocks anyone. If a change looks genuinely necessary, stop and say so — it requires notifying every affected teammate first (`CONTRIBUTING.md` → Changing the database schema).
2. **Stay inside the current owner's module.** Each person owns one epic end to end, backend and mobile. Work touching someone else's epic is their work, not yours. See [`docs/module-ownership.md`](docs/module-ownership.md).
3. **Never write real secrets into a tracked file.** `backend/.env` is git-ignored and holds real values; `backend/.env.example` is committed and holds placeholders. A new environment variable goes in **both**.
4. **Don't run `git commit`, `git push`, or `git checkout`** unless explicitly asked. `git status` and `git diff` are fine.
5. **Don't build what the requirements deliberately exclude.** `docs/requirements.md` §5 and `docs/product-overview.md` §13 list what was considered and rejected — in-app messaging, profile photos, block-user, draft postings, an appeals process. Those are decisions, not gaps.
6. **Don't invent behaviour when a requirement is unclear.** Ask. Almost everything here was decided deliberately and written down somewhere.

---

## Things that will bite you

**The Prisma client is not at `@prisma/client`.** `schema.prisma` sets `output = "../generated/prisma"`, so import from `backend/generated/prisma/client`, not the bare `backend/generated/prisma` directory. The folder is git-ignored — run `npx prisma generate` in `backend/` if it's missing. Use one shared client instance, not one per file.

**The database URL lives in `backend/prisma.config.ts`, not in `schema.prisma`.** Prisma 7 moved it. The datasource block having no `url` line is correct.

**Three partial unique indexes exist only as raw SQL** in the initial migration — `User.phone`, `User.email`, `User.nicEncrypted`. Prisma's schema syntax can't express them. Do not "fix" this by adding `@unique`; that would be wrong and would change the semantics.

**`User.nicEncrypted` requires deterministic encryption.** The unique index enforcing FR-ACC-05 only fires when identical NIC values produce identical ciphertext. Random-IV AES-GCM — the normal correct default — would let duplicate accounts through with no visible symptom. See the note in [`docs/database-schema.md`](docs/database-schema.md) under the User indexes.

**Phone verification goes through Firebase Phone Authentication**, not the `OtpCode` table, for signup and OTP login. `OtpCode` covers password reset, phone change and dashboard admin login. Its `SIGNUP` and `LOGIN` enum values are vestigial. See FR-ACC-08 and its amendment note.

**Authentication is stateless JWT with a live per-request status check** — no session table. Every request re-reads `accountStatus`, `suspendedAt` and `lockedUntil`, which is what delivers NFR-REL-02's "a suspension takes effect on the very next request." One shared middleware, owned by the Account Management epic. Don't write a second one.

**`backend/` is ES modules (ESM), not CommonJS** — `import`/`export`, never `require`/`module.exports`. Converted 2026-08-17: CommonJS was never a deliberate choice, just `npm init`'s default that ended up written into this file as though it were a rule. `mobile/` and `dashboard/` were ESM already, and Prisma 7 is ESM-first — the mismatch caused a real, hours-long problem (a Prisma generator misconfiguration nobody caught until code actually queried the database). Three things that catch people out under ESM: **relative imports need the file extension** — `./foo.js`, never bare `./foo` — the single most common failure, and it breaks the whole import chain at once; `__dirname`/`__filename` don't exist; JSON imports need import attributes.

**Both `backend/src/` and `mobile/src/` are organised by module, not by layer.** Four people build four modules simultaneously; layer-first would put all of them in the same three directories on every pull request. Your work goes in `backend/src/modules/<epic>/` and `mobile/src/screens/<module>/`. Each surface has a `src/README.md` explaining its structure.

**Mobile navigation is React Navigation, and you add screens through your module's manifest** — `src/screens/<module>/<module>.screens.js`. `RootNavigator.js` collects every manifest automatically and should not be edited. Screen names are global, so prefix them with the module: `AccountRegister`, not `Register`.

**Mobile is Android-only for Sprints 1–2.** Firebase and the navigation packages are native modules, so Expo Go cannot run the app — a development build is required, started with `npx expo start --dev-client`.

---

## Conventions

Full detail in [`CONTRIBUTING.md`](CONTRIBUTING.md). The parts that affect what you write:

```
Branch:  <type>/<epic>-<yourname>              feature/account-management-afham
         <type>/shared-<area>-<yourname>       docs/shared-documentation-afham
Commit:  <type>(<surface>): <description> [<FR-ID>, <FR-ID>]
```

**Branches are long-lived** — one per epic per developer, reused across sprints, never deleted after a merge, with `develop` merged in regularly. Several pull requests come off one branch over a sprint.

**Commit messages are where requirement traceability lives.** List every requirement a commit touches, comma-separated; `git log --grep "FR-ACC-03"` is what makes "where is this implemented?" answerable. Drop the brackets when a commit genuinely has no requirement behind it.

**Never commit to `main` or `develop` directly.**

---

## Definition of Done

A story is Done when it meets its documented acceptance criteria, is merged into `develop`, **runs end to end in the actual app** (not only through Postman or a unit test), has no known blocking bugs, functionally matches the wireframe for UI work, is committed with a descriptive message, and — if it changed the schema — every affected teammate was told first.

Automated test coverage is deliberately out of scope at this stage. Running the thing end to end is doing that job.
