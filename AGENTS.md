# AGENTS.md — YouthLink

Context for any AI coding agent working in this repository. Written to be tool-neutral: the four of us use different agents.

**This file points; it does not copy.** Everything here has a source of truth elsewhere in the repository. If this file and a linked document ever disagree, the linked document wins and this one is out of date.

---

## Session protocol — read first

The block below is copied verbatim into the instruction files of tools that cannot import this one (`mobile/AGENTS.md`, `.github/copilot-instructions.md`, `.cursor/rules/`, `.windsurf/rules/`). Change it here, then copy it; `node scripts/check-docs.mjs` fails while any copy differs.

<!-- agent-core:start -->
**Mandatory at the start of every chat, and again after any compaction or summary. Protocol version 1.**

1. **Code first.** Before any work, establish what the code actually implements: run `node scripts/state-report.mjs --save` (no shell: ask the developer to run it and paste the output), then check each acceptance criterion of the current cards against the code. Code on `develop` outranks Jira, progress notes, documents, chat summaries and what anyone says. Write no code until this is done.
2. **Identity and branch.** `git config user.email` must be listed in `docs/workflow/team.json`, and the branch must be the developer's own and follow `CONTRIBUTING.md`. If not, stop and give the exact branch name.
3. **Full procedure:** read `docs/workflow/agent-protocol.md` in full. For each card, read the output of `node scripts/card-context.mjs <FR-ID>` in full.
4. **The developer runs git.** Never run `git commit`, `git push`, `git checkout` or `git merge` yourself. Give the exact commands, the commit message (`<type>(<surface>): <description> [<FR-ID>]`), and say when a pull request is due (`node scripts/pr-check.mjs`; base `develop`, merge commit, never squash, never delete the branch).
5. **Refuse** anything that breaks `AGENTS.md` or `CONTRIBUTING.md`: commits to `develop`/`main`, squash, force-push, `--no-verify`, schema or dependency changes by a member, another member's module or a shared file, secrets, excluded features, invented behaviour.
6. **Escalate** schema needs, unclear or contradictory requirements and missing shared pieces with the `ESCALATE TO AFHAM (Scrum Master)` block in the protocol, park the card, and continue with the next one.
7. **UI is exact per `docs/prototype/`:** design tokens, components, copy, structure, and every drawn state.
8. **Record progress** in the developer's git-ignored `.worklog/` (templates in `docs/workflow/templates/`), dated from `date` in Asia/Colombo time. It is the developer's own record; never report on them.
9. **Stop only** for a commit, a pull request, an end-to-end run, a command only the developer should run, a refusal, or an escalation. Otherwise keep going.
<!-- agent-core:end -->

---

## What this is

**YouthLink** — a mobile platform connecting Sri Lankan youth job-seekers with verified local gigs and part-time work. Aligned to UN SDG 1 (No Poverty) and SDG 8 (Decent Work and Economic Growth). Built by four students as a university group project; every contributor must be able to explain their own code in a live viva.

**Write clear, conventional, well-commented code over clever code**, and state your reasoning when a real choice was made. Code nobody can defend is worse than no code.

Three surfaces: `backend/` (Node.js + Express, **ES modules**), `mobile/` (React Native via Expo, Android only for now), `dashboard/` (React + Vite). JavaScript throughout, not TypeScript. PostgreSQL via Prisma.

---

## Read before writing code

| Document                                               | What it's for                                                                                                                                                                                                                                                            |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [`docs/requirements.md`](docs/requirements.md)         | **The specification.** 134 functional + 32 non-functional requirements, each with Given/When/Then acceptance criteria. Read the full entry for a requirement before implementing it — including any dated amendment note beneath it                                      |
| [`docs/product-overview.md`](docs/product-overview.md) | How the system works and _why_. Four mechanisms are not guessable from the UI or the schema — the check-in code exchange (custody flips to the worker at the payment step), the endorsement bootstrap, the three-tier applicant sort, and the double-blind rating reveal |
| [`docs/decisions.md`](docs/decisions.md)               | **Why things are the way they are.** Read it when something looks arbitrary, wrong, or like an oversight. Mostly pointers to reasoning that lives next to what it governs. Add to it when a decision turns out not to be written down                                    |
| [`docs/database-schema.md`](docs/database-schema.md)   | 22 tables, every field, and a "Deliberately Not Modeled" section. Consult it whenever you touch data                                                                                                                                                                     |
| [`docs/prototype/`](docs/prototype/README.md)          | **The interface specification.** Every screen's node tree, components, tokens and exact copy, plus [`design-system.md`](docs/prototype/design-system.md) and a requirement → screen index. UI is built to match it exactly                                              |
| [`docs/module-ownership.md`](docs/module-ownership.md) | Who owns which module, per-story tasks, the Sprint 3 carry-over, and the cross-cutting authentication contract                                                                                                                                                           |
| [`docs/workflow/`](docs/workflow/agent-protocol.md)    | **How to work here.** The agent protocol, [`team.json`](docs/workflow/team.json) (who owns which paths), the progress-file templates, and the session-start prompt                                                                                                       |
| [`CONTRIBUTING.md`](CONTRIBUTING.md)                   | Branching, commit format, pull requests, local checks, Definition of Done                                                                                                                                                                                                |

**This table is a map, not a substitute for the documents it points to.** Read the linked document before writing code against it — not this table's one-line summary, not what a schema column seems to imply, not what you read earlier in a long session. For a card, `node scripts/card-context.mjs <FR-ID>` prints the exact parts of the requirements, prototype and schema it needs, verbatim; read that in full, and open whole documents when it points outside itself. Re-read rather than recall; a document doesn't drift, your memory of it does. If the answer isn't written down anywhere, ask rather than fill the gap with something reasonable-sounding.

**Acceptance criteria are the specification.** Check your work against the documented Given/When/Then, explicitly, not against your own sense of finished. That is clause 1 of the Definition of Done.

**Each developer keeps a `.worklog/`** — `progress.md` (the index and NEXT block), one file per epic, and saved State Reports — because chat sessions lose context and Jira/git don't hold everything (what's actually verified, decisions made mid-implementation, where to pick up). It's git-ignored, so it isn't visible in this repo history and isn't shared between us. Templates and rules: [`docs/workflow/agent-protocol.md`](docs/workflow/agent-protocol.md) §9. Read your own at the start of a session; update it at every stop.

---

## Non-negotiable

1. **Never modify `backend/prisma/schema.prisma` or create a migration** without being asked. The full schema was designed up front and migrated deliberately so nobody blocks anyone. If a change looks genuinely necessary, stop and say so — it requires notifying every affected teammate first (`CONTRIBUTING.md` → Changing the database schema).
2. **Stay inside the current owner's module.** Each person owns one epic end to end, backend and mobile. Work touching someone else's epic is their work, not yours. See [`docs/module-ownership.md`](docs/module-ownership.md).
3. **Never write real secrets into a tracked file.** `backend/.env` is git-ignored and holds real values; `backend/.env.example` is committed and holds placeholders. A new environment variable goes in **both**.
4. **Don't run `git commit`, `git push`, `git checkout` or `git merge`** unless explicitly asked. `git status`, `git diff`, `git log` and `git fetch` are fine, as are the read-only scripts in `scripts/`.
5. **Don't build what the requirements deliberately exclude.** `docs/requirements.md` §5 and `docs/product-overview.md` §13 list what was considered and rejected — in-app messaging, profile photos, block-user, draft postings, an appeals process. Those are decisions, not gaps.
6. **Don't invent behaviour when a requirement is unclear.** Ask. Almost everything here was decided deliberately and written down somewhere.

---

## Things that will bite you

**The Prisma client is not at `@prisma/client`.** `schema.prisma` sets `output = "../generated/prisma"`, so import from `backend/generated/prisma/client`, not the bare `backend/generated/prisma` directory. The folder is git-ignored — run `npx prisma generate` in `backend/` if it's missing. Use one shared client instance, not one per file.

**The database URL lives in `backend/prisma.config.ts`, not in `schema.prisma`.** Prisma 7 moved it. The datasource block having no `url` line is correct.

**Four partial unique indexes exist only as raw SQL** — `User.phone`, `User.email` and `User.nicEncrypted` in the initial migration, and `Endorsement(endorserId, workerId)` where `revokedAt` is null (one active endorsement per endorser per worker) in `20260925001500_prototype_spec_batch`. Prisma's schema syntax can't express them. Do not "fix" this by adding `@unique` or `@@unique`; that would be wrong and would change the semantics.

**`User.nicEncrypted` requires deterministic encryption.** The unique index enforcing FR-ACC-05 only fires when identical NIC values produce identical ciphertext. Random-IV AES-GCM — the normal correct default — would let duplicate accounts through with no visible symptom. See the note in [`docs/database-schema.md`](docs/database-schema.md) under the User indexes.

**Phone verification goes through Firebase Phone Authentication**, not the `OtpCode` table, for signup and OTP login. `OtpCode` covers password reset, phone change and dashboard admin login. Its `SIGNUP` and `LOGIN` enum values are vestigial. See FR-ACC-08 and its amendment note.

**Authentication is stateless JWT with a live per-request status check** — no session table. Every request re-reads `accountStatus` and `suspendedAt`, which is what delivers NFR-REL-02's "a suspension takes effect on the very next request." One shared middleware, owned by the Account Management epic. Don't write a second one.

**`lockedUntil` (the FR-ACC-09/NFR-SEC-02 password lockout) is NOT part of that live check.** Corrected 2026-08-18: an earlier version of this file and of `requireAuth.js` itself listed `lockedUntil` alongside `accountStatus`/`suspendedAt` as re-read on every request, attributing all three to NFR-REL-02 — but NFR-REL-02 only concerns suspension, and product-overview.md is explicit that OTP login (and, by the same logic, an already-authenticated session) is unaffected by a password lockout. Enforcing it globally meant a caller with no credentials could fail someone's password 5 times and log every one of that account's devices out — multiple simultaneous logins are an explicit product decision — until they specifically re-authenticated via OTP. `lockedUntil` is enforced only at the password-login endpoint itself. Full reasoning: [`docs/decisions.md`](docs/decisions.md).

**Prisma's `$transaction` alone does not give you row-level locking.** Under Postgres's default isolation level, two concurrent requests inside separate `$transaction` calls can still both read the same row before either writes — an atomic single-statement update (`increment`, a conditional `updateMany`) prevents _that write_ from being lost, but not a multi-step decision built from an earlier read going stale. If you need "no one else touches this row until I'm done deciding what to do with it," that requires an explicit `SELECT ... FOR UPDATE` inside the transaction, via `$queryRaw` — Prisma's query API has no equivalent. See `account.service.js`'s `loginWithPassword`/`clearLockout` for a real example, and [`docs/decisions.md`](docs/decisions.md) for why it was needed there.

**`backend/` is ES modules (ESM), not CommonJS** — `import`/`export`, never `require`/`module.exports`. Converted 2026-08-17: CommonJS was never a deliberate choice, just `npm init`'s default that ended up written into this file as though it were a rule. `mobile/` and `dashboard/` were ESM already, and Prisma 7 is ESM-first — the mismatch caused a real, hours-long problem (a Prisma generator misconfiguration nobody caught until code actually queried the database). Three things that catch people out under ESM: **relative imports need the file extension** — `./foo.js`, never bare `./foo` — the single most common failure, and it breaks the whole import chain at once; `__dirname`/`__filename` don't exist; JSON imports need import attributes.

**Both `backend/src/` and `mobile/src/` are organised by module, not by layer.** Four people build four modules simultaneously; layer-first would put all of them in the same three directories on every pull request. Your work goes in `backend/src/modules/<epic>/` and `mobile/src/screens/<module>/`. Each surface has a `src/README.md` explaining its structure.

**Mobile navigation is React Navigation, and you add screens through your module's manifest** — `src/screens/<module>/<module>.screens.js`. `RootNavigator.js` collects every manifest automatically and should not be edited. Screen names are global, so prefix them with the module: `AccountRegister`, not `Register`.

**Mobile is Android-only for now.** Firebase and the navigation packages are native modules, so Expo Go cannot run the app — a development build is required, started with `npx expo start --dev-client`. A shared development build (an APK) removes the need to compile it yourself; see the README. The backend address comes from `EXPO_PUBLIC_API_URL` in `mobile/.env`, never from code.

**The git hooks are local checks, not security.** They block the common mistakes (wrong branch, bad commit subject, secrets, another person's module) and can be bypassed with `--no-verify`. Never suggest bypassing them: fix what they report.

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

A story is Done when it meets its documented acceptance criteria, is merged into `develop`, **runs end to end in the actual app** (not only through Postman or a unit test), has no known blocking bugs, **matches the prototype specification exactly** for UI work, is committed with a descriptive message, and — if it changed the schema — every affected teammate was told first. Full wording, and how the end-to-end run is recorded while not everyone can build the app, in [`CONTRIBUTING.md`](CONTRIBUTING.md#definition-of-done).

Automated test coverage is deliberately out of scope at this stage. Running the thing end to end is doing that job.
