# Agent protocol

Protocol version 1 · 2026-09-25

**How an AI coding agent works in this repository, from the first message of a chat to the pull request.** Written for any agent: Claude, Codex, Cursor, Windsurf, Copilot, Gemini, or a plain chat. [`AGENTS.md`](../../AGENTS.md) carries the short mandatory core; this is the full procedure it points to.

**The agent's goal:** carry the developer's cards to Done, correctly, without needing to be steered, and stop only where a person has to act. The developer stays the author: they run the commits, they open the pull requests, and they must be able to explain every line at the viva.

---

## 1. Principles

1. **The code is the ground truth.** Before doing anything, find out what the code actually implements, whatever Jira, a progress file, a document, a chat summary or a person says. Continue only after that. Never build on something that isn't there, and never rebuild something that is.
2. **This workflow serves the developer using it.** The agent works for them. It never reports on them, never sends anything anywhere, and keeps its records in their git-ignored `.worklog/`. Nothing leaves their machine unless they choose to send it.
3. **Declining is not reporting.** The agent declines to break the team's rules (§8) and says why. That is the agent's own conduct, not something recorded against anyone.
4. **The documents are the specification; the agent's memory is not.** Re-read rather than recall. A chat that has been compacted or summarised has lost detail, so treat anything you "remember" from earlier in the session as a claim to re-check.
5. **Nobody waits for anyone except the shared-components owner.** Members' modules are built independently (§4.4). Only shared code — the UI kit, navigation shells, middleware, the seed script, the schema — comes from the shared-components owner named in [`team.json`](team.json).
6. **Stop only where a person must act** (§6). Everywhere else, keep going.

---

## 2. Evidence order

When two sources disagree, the higher one wins.

**What is built:**

1. Code on `develop` (`origin/develop`, freshly fetched)
2. Code on the developer's own branch (built, but not Done — DoD clause 2 needs `develop`)
3. Code on any other branch — reference only, never a source to copy from
4. The developer's `.worklog/` files
5. Jira
6. What a person says, including the developer

**What should be built:**

1. [`docs/requirements.md`](../requirements.md) — the full entry, including every dated amendment note beneath it
2. [`docs/prototype/`](../prototype/README.md) — the screens, components, tokens and exact copy
3. [`docs/database-schema.md`](../database-schema.md) and `backend/prisma/schema.prisma`
4. The Jira card — its tasks and estimate help plan; where its text differs from the requirement, the requirement wins

Documents that describe the state of the code ("X has not merged yet", "Y is still a stub") are claims about what is built, and rank below the code. When one is wrong, note it in the developer's discrepancies table and tell them; the shared-components owner fixes shared documents.

A Jira card marked Done whose code is not on `develop` is treated as open work for its owner. That is recorded in the owner's own `.worklog/`, not reported to anyone.

---

## 3. Every session

A session is every new chat, and every time the conversation has been compacted or summarised, or the developer types **`resync`**.

### 3.1 Start

1. **Date.** Run `date` (or ask the developer for today's date if you have no shell). Every progress entry uses this date, in the team's timezone (`Asia/Colombo`). Never guess the date.
2. **Who.** Run `git config user.email` and find the developer in [`team.json`](team.json). If the email is not listed, say so: their commits will be blocked by the hooks and may not be credited to them on GitHub.
3. **Read, in this order:** `AGENTS.md` (in full), this protocol (in full, and note its version), the developer's `.worklog/progress.md` NEXT block, and their latest State Report in `.worklog/state/`. Do not read the whole progress history; read what NEXT points to.
4. **Branch.** Check the current branch (`git branch --show-current`). It must be the developer's branch for the active epic: `<type>/<epic>-<name>`, or a name listed for them in `team.json`. If it is `develop`, `main`, someone else's branch, or off-convention, **stop** and give the exact branch name and the commands to switch (below). Do not run them yourself.

   ```bash
   git fetch
   git checkout feature/<epic>-<name>          # the branch already exists
   git checkout -b feature/<epic>-<name> origin/develop   # first time only
   ```

5. **Hooks.** If `git config --get core.hooksPath` is not `.githooks`, ask the developer to run `node scripts/install-hooks.mjs` (or `npm install` in any surface).
6. **Ground truth.** Run `node scripts/state-report.mjs --save`. If you cannot run commands, ask the developer to run it and paste the output, and **do not write code until you have it**. Then do the reconciliation in §3.2.
7. **Report** in a few lines: where the branch stands against `develop`, what the code shows, any discrepancy that changes the plan, and the next card. Then carry on without waiting, unless §6 says stop.

### 3.2 Reconciliation — the gate before any code

The State Report lists facts: files, routes, screens, requirement IDs in the code, unmerged branches, what changed on `develop`. It does not say whether acceptance criteria are met. You do:

1. For each requirement on the current and next cards, open the files the report points to and check **each acceptance criterion** against the code. Record status as `absent`, `stub`, `partial`, `implemented-unverified`, or `implemented-verified-E2E`, with the location (`develop`, this branch, another branch) and evidence (`file:line`, route, screen name).
2. For UI, check the screens against the prototype (§5.4) and record which screen IDs conform.
3. Fill the report's **Discrepancies** table: every place where Jira, the progress file, a document or a person claims something the code does not show.
4. Save the completed report (it is already in `.worklog/state/`). **No implementation starts before this exists for the current `develop` and branch commits.**

If the report's section 3 says `develop` changed the developer's modules, shared contracts, the schema, dependencies, or the workflow rules, the developer merges `develop` in first (`git merge origin/develop`), and you re-run the report. Otherwise note it and continue.

### 3.3 Rescan during the session

Re-run `state-report.mjs` (targeted re-reading is enough when nothing moved) at each of these points:

- after each commit the developer makes, and after they merge `develop`
- before proposing a commit message or a pull request
- when switching to a new card
- whenever you are working from a summary of earlier conversation, or the developer types `resync`

---

## 4. The work queue

### 4.1 Order

1. **Bring the developer's own unmerged work onto `develop`.** If the State Report shows their branch (or an older branch of theirs) carrying module code that `develop` lacks, that comes first: merge `develop` into it, fix what no longer fits the current schema and shared code, run it, and open a pull request. Nothing it covers is Done until it lands.
2. **Carry-over:** the follow-on cards for amended Done stories, then UI conformance for the developer's earlier screens — listed per owner in [`module-ownership.md`](../module-ownership.md#sprint-3--carry-over-first).
3. **The developer's cards for the current sprint**, from `module-ownership.md` and Jira: Must, then Should, then Could. Where a requirement says to implement it together with another, keep them together.
4. **If the current sprint's cards are not in `module-ownership.md` yet**, stop after the carry-over and say so. Do not pick unassigned work.

### 4.2 One card at a time

Finish, commit and record one card before starting the next. A card may span several commits.

### 4.3 Jira

- **Connected:** move the card yourself — In Progress when you start it, In Review when its pull request is open, Done when it is merged into `develop` and has been run end to end (§5.6).
- **Not connected:** tell the developer which move to make, at the moment it is due, and add it to "Pending Jira moves" in their NEXT block until they confirm.

### 4.4 Independence between modules

No member waits for another member's work.

- **Data another module creates** (postings for Applying, ratings for the applicant sort): build against `develop`'s schema and the shared seed script, never against another member's branch.
- **A call into another module** (posting creation should trigger a notification): the called module exposes a function; the calling module calls it. If the function is not on `develop` yet, the caller ships a clearly marked no-op in its own module and the card notes the dependency. Neither side waits.
- **A missing contract, seed data, or shared component:** escalate (§8.3) to the shared-components owner, park the card, and move to the next one.

---

## 5. Per card

### 5.1 Read

Run `node scripts/card-context.mjs <FR-ID>` for every requirement on the card. The card's title names them (`[FR-POST-04] …`). Read the whole pack: the requirement with its amendments, every mapped screen, the design-system components and tokens, the schema models. Open full documents only when the pack points outside itself (a named related requirement, a design-system section, `product-overview.md` for a mechanism). Also read the module's `src/README.md` on each surface you touch.

### 5.2 Restate before coding

Quote every acceptance criterion back, state which the code already meets (from the reconciliation), list the screen IDs and states you will build, and name the files you will touch. All files must be inside the developer's module ([`team.json`](team.json)); `backend/src/app.js` only for the module's own import and mount line.

### 5.3 Build

- Conventions in [`AGENTS.md`](../../AGENTS.md), [`CONTRIBUTING.md`](../../CONTRIBUTING.md) and each `src/README.md`: routes → controller → service; `AppError` and `asyncHandler`; the shared Prisma client; the shared `requireAuth`; screens added only through the module manifest.
- Clear, commented code the developer can explain. Explain real choices in the chat as you make them.
- Every error, empty, loading and offline state the requirement or the prototype names (`NFR-PERF-01` loading states, `NFR-USE-01` offline tolerance where drawn).

### 5.4 UI conformance — "exact per the prototype"

Check every screen against its block in the card pack:

| Check | What exact means |
| --- | --- |
| Tokens | Every colour, spacing, radius, elevation and text style is the named token from `design-system.md`. No raw hex, no ad-hoc sizes |
| Components | Each `INSTANCE` is the named component with the listed variant (`{Style=Primary}`), from the shared UI kit once it exists |
| Copy | Every string exactly as written in the block. Strings are specification, not placeholder |
| Structure | Elements in the same order and hierarchy; auto-layout direction, padding and gap as listed |
| States | Every drawn variant for the requirement (each screen ID) is built, plus the composed states `design-system.md` §8 says to build |
| Pinned actions | A `ctaBar` stays pinned above the scrolling content, per `design-system.md` §5 |
| Navigation | "Reached from", "Leads to" and "Exits" behave as the block says |

Pixel sizes are what the prototype renders: rebuild from the layout properties and components, then compare. Where the developer can run the app, ask for a screenshot and compare it with the block. A literal value in the spec where a token is expected is a spec defect: escalate it rather than copy it.

Until the shared UI kit and tokens are on `develop`, a module may keep local components, but they must use the token names exactly, so moving to the kit is a rename, not a redesign.

### 5.5 Commit stop

Show `git status` and a summary of the diff, list the acceptance criteria this commit meets, and give the commit message:

```
<type>(<surface>): <description> [<FR-ID>, <FR-ID>]
```

Add a short body only when the why is not visible in the diff (`CONTRIBUTING.md` → When to write a body). The developer commits. If the hooks reject it, fix the cause; never suggest `--no-verify`.

### 5.6 End to end

Ask the developer to run the flow in the app. Record the level in the progress entry and, later, the pull request:

- **self** — they ran it on their own device or emulator (a screenshot or recording helps)
- **integration** — it was run on the shared development build or a teammate's working setup
- **pending** — not run yet, with the reason

Pending does not block the next card or the pull request. The card moves to Done only once it has been run at self or integration level. Never write "run end to end" for something that has not been run.

### 5.7 Pull request stop

When a coherent chunk is finished and committed:

1. The developer merges `develop` in (`git merge origin/develop`) and runs the app again.
2. Run `node scripts/pr-check.mjs` and fix every FAIL line.
3. Give the pull request title and body in the format `pr-check` prints ([`CONTRIBUTING.md`](../../CONTRIBUTING.md) → Writing the pull request), including the end-to-end level.
4. Remind: base `develop` (GitHub pre-selects `main`), merge with **Create a merge commit**, never squash, never delete the branch.

---

## 6. When to stop

Stop and wait for the developer only at these points:

1. **Commit due** (§5.5)
2. **Pull request due** (§5.7)
3. **End-to-end run needed** (§5.6)
4. **A command only they should run:** switching branch, merging `develop`, installing hooks, pasting script output you cannot produce yourself
5. **A refusal** (§8.1)
6. **An escalation** (§8.3) — then park the card and continue with the next unblocked one
7. **Context nearly full** — update the progress file first (§9), then say a new chat should start

Everywhere else, don't ask "shall I continue?" — continue, and report at the next stop.

---

## 7. Warnings — corner-cutting

Say plainly, once, and carry on only if the developer still wants to after hearing the consequence:

- skipping an acceptance criterion, a drawn state, or a loading/empty/error state
- "we'll fix it later" for anything a requirement asks for now; `TODO`/`FIXME` in place of behaviour
- hard-coded values where configuration or a token belongs; raw hex colours; copy that differs from the prototype
- copying another module's code, or code from a branch that isn't the developer's, instead of building it
- calling something done that has not been run, or marking Done without the merge
- a commit or pull request much larger than one coherent piece of work
- working from a summary instead of the document

---

## 8. Refusals, escalations

### 8.1 Refuse outright

State the rule and its source in one line, then offer the correct route. Refuse to:

- commit or push to `develop` or `main`, squash, force-push, rebase shared history, or delete a branch
- suggest or use `--no-verify`, or disable the hooks
- change `backend/prisma/schema.prisma` or migrations (members) — escalate instead
- add or change a dependency (members) — escalate instead
- edit another member's module, or a shared file (members) — escalate or tell the owner
- write a secret into a tracked file
- build what [`requirements.md`](../requirements.md) §5 or [`product-overview.md`](../product-overview.md) §13 excludes
- invent behaviour a requirement does not specify
- write a branch name, commit message or pull request that breaks the convention
- state that something ran, passed or was verified when it did not

The shared-components owner (`role: "shared-owner"` in `team.json`) may change the schema, dependencies and shared files; for them these become reminders (tell affected teammates first — DoD clause 7; a native dependency means rebuilding the shared development build).

### 8.2 The developer's own choices

What the developer commits, what they write in a pull request, and how they describe their work are their decisions. The agent gives its honest view once and does not repeat, record or report it.

### 8.3 Escalate to the shared-components owner

For: a needed schema change (draft the proposal, change nothing); a missing or contradictory requirement; a Jira card that contradicts `requirements.md` in a way that changes what gets built; a needed shared component, contract, seed data or dependency; a spec defect in the prototype. Give the developer this, ready to paste into the team chat the same day:

```
ESCALATE TO AFHAM (Scrum Master) — <YYYY-MM-DD>
From: <name> · Branch: <branch> · Card: <YL-key> / <FR-ID>
What: <one or two sentences>
Why it blocks: <what cannot be built correctly without it>
Needed: decision | schema change | shared component | dependency | spec fix
Options: <the alternatives, and which you'd suggest>
Meanwhile: <the card parked; what you are doing next>
```

Where a requirement and a Jira card differ but the requirement is clear, build to the requirement and send the escalation without blocking. When the owner is unavailable, the card stays parked and the escalation is repeated in the next stand-up.

---

## 9. Progress documents — `.worklog/`

Git-ignored, one set per developer. They exist because chats lose context; they are the developer's own record.

| File | What it holds |
| --- | --- |
| `.worklog/progress.md` | The index: NEXT block, active epic and branch, open escalations, pending Jira moves, standing rules, and a session index. Template: [`templates/progress.md`](templates/progress.md) |
| `.worklog/epics/<epic>.md` | One per epic: the card table and dated entries. Template: [`templates/epic.md`](templates/epic.md) |
| `.worklog/state/*.md` | The saved State Reports with their reconciliation (§3.2) |
| `.worklog/archive/` | Older entries moved out at each sprint end, so the live files stay short |

Rules:

- **Dates come from `date`**, in `Asia/Colombo` time, written `YYYY-MM-DD (Ddd)`. Add the sprint and day when `module-ownership.md` gives the sprint dates.
- **NEXT is overwritten, not appended**, and stays under about 40 lines. A new session reads NEXT and the latest State Report, not the history.
- **Update at every stop in §6**, not only at the end of a session.
- **Each epic entry** records: cards worked, what was done, how it was verified (with the end-to-end level), commits and pull requests, blockers and escalations, Jira moves, discrepancies found, a stand-up block, and a line on how AI was used — for the developer's own AI-use declaration.
- **First session under this protocol:** if an older `progress.md` exists in another shape, move it to `.worklog/archive/` and start the new files from the templates, carrying over only what is still true — checked against the code, not copied.

### 9.1 Stand-up block

Drafted at the end of each working day, for the developer to send to the team's stand-up if they choose:

```
Stand-up — <name> — <YYYY-MM-DD (Ddd)>
Done: <cards / pieces finished since the last stand-up>
Next: <what comes next>
Blockers: none | <short description — escalated to Afham on <date>>
```

---

## 10. Tools

- **No shell** (a chat that cannot run commands): ask the developer to run `state-report.mjs` and `card-context.mjs` and paste the output. Do not implement without them. A tool that cannot read repository files at all is not suitable for implementation work here; use it for explanation only.
- **Small context:** read the card pack, not whole documents. Update the progress file before context runs out.
- **No Jira access:** §4.3.
- **Tools that do not load `AGENTS.md` automatically:** paste [`session-start.md`](session-start.md) as the first message of every chat.

---

## 11. Keeping this current

- One source per rule: this protocol for procedure, [`team.json`](team.json) for people and paths, `CONTRIBUTING.md` for conventions, `module-ownership.md` for scope. Copies of the agent core block exist only for tools that cannot import `AGENTS.md`, and `node scripts/check-docs.mjs` fails if any copy differs.
- The protocol version appears here and in `AGENTS.md`. When the State Report shows `docs/workflow/`, `AGENTS.md` or `CONTRIBUTING.md` changed on `develop`, re-read them before continuing.
- `team.json` changes when a sprint assigns new modules; until it does, a member's hooks block commits to unassigned modules.
