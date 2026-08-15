# Contributing to YouthLink

How we branch, commit, review, and decide something is finished. Read this before your first pull request.

**Related documents:** [`README.md`](README.md) covers stack and local setup · [`docs/requirements.md`](docs/requirements.md) is the requirements baseline every commit references · [`docs/module-ownership.md`](docs/module-ownership.md) says who owns which module · [`docs/database-schema.md`](docs/database-schema.md) is the schema everyone builds against.

---

## Branching model

Two permanent branches.

| Branch    | Purpose                                                                                                                          |
| --------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `main`    | Updated **only at sprint boundaries**, after the team has verified the demo actually works. It should never show a broken state. |
| `develop` | The active integration branch. All work branches off it and merges back into it.                                                 |

Everything else branches off `develop` and merges back into it. Epic branches are long-lived too — see below — but unlike these two they don't last the whole project.

**Never commit directly to `main` or `develop`.** Both are integration branches — work reaches them through a pull request, never through a local commit pushed straight up.

### Branch naming

```
<type>/<epic>-<yourname>                    # work on an epic
<type>/shared-<area>-<yourname>             # work outside any epic
```

```
feature/account-management-afham
feature/gig-posting-lahiru
feature/discovery-search-pawan
feature/applying-selection-naveenkhan

chore/shared-tooling-afham
docs/shared-documentation-afham
```

| Segment    | Values                                                                               |
| ---------- | ------------------------------------------------------------------------------------ |
| `type`     | `feature`, `fix`, `chore`, `refactor`, `docs`, `test` — spelled out, never shortened |
| `epic`     | The epic your card belongs to, written out in full. See the table below              |
| `area`     | **Only for `shared` branches.** The lasting area of work, not a single change        |
| `yourname` | **Always included**, not only when it would otherwise clash                          |

**The middle of a branch name names a lasting area of work, never a single change.** Every branch here is long-lived and gets reused, so a name that describes one change is spent the moment that change merges.

For epic work the epic name already does the job — `feature/account-management-afham` is complete on its own, and adding more is wrong: `feature/account-management-registration-afham` names one piece of an epic the branch will cover for the whole project.

For work outside any epic, `shared` describes nothing by itself, so an area is required — but it must be an area you'll return to, not today's task:

| Good — you'll come back to it     | Bad — spent after one merge             |
| --------------------------------- | --------------------------------------- |
| `docs/shared-documentation-afham` | `docs/shared-fix-readme-typo-afham`     |
| `chore/shared-tooling-lahiru`     | `chore/shared-add-gitignore-lahiru`     |
| `chore/shared-ci-pawan`           | `chore/shared-conventions-update-pawan` |

If you can't name an area you'd plausibly revisit, the work probably belongs on an epic branch instead.

**The thirteen epics**, matching the modules in [`docs/requirements.md`](docs/requirements.md):

| Module       | Epic                            | Branch segment             |
| ------------ | ------------------------------- | -------------------------- |
| `FR-ACC`     | Account Management              | `account-management`       |
| `FR-PROF`    | Profile & Trust Signals         | `profile-trust-signals`    |
| `FR-POST`    | Gig Posting                     | `gig-posting`              |
| `FR-DISC`    | Discovery & Search              | `discovery-search`         |
| `FR-APPLY`   | Applying & Selection            | `applying-selection`       |
| `FR-ENG`     | Engagement Lifecycle            | `engagement-lifecycle`     |
| `FR-RATE`    | Ratings & Reputation            | `ratings-reputation`       |
| `FR-ENDORSE` | Community Endorsement           | `community-endorsement`    |
| `FR-DISPUTE` | Disputes & Reporting            | `disputes-reporting`       |
| `FR-MOD`     | Moderator Functions             | `moderator-functions`      |
| `FR-ADM`     | Admin Functions                 | `admin-functions`          |
| `FR-DASH`    | Shared Dashboard Infrastructure | `dashboard-infrastructure` |
| `FR-NOTIF`   | Notifications                   | `notifications`            |
| —            | Anything outside an epic        | `shared-<area>`            |

**One branch per epic, per developer — and it stays alive.** Sprint 1 gives you some of your epic's cards, Sprint 2 or 3 may give you more. You return to the same branch rather than creating a new one. Because slices are assigned so that no two people hold the same epic in a sprint, and because your name is in the branch anyway, collisions don't arise.

This is a deliberate choice to keep the rule trivial: **the epic is written on your card, so there is never a judgement call about what to name a branch or which cards belong together.**

**Three things follow from branches being long-lived.**

**Do not delete the branch after a pull request merges.** GitHub offers a "Delete branch" button on the merged PR — don't press it. You will come back to this branch.

**Pull `develop` into your branch regularly**, at least whenever someone else merges:

```
git checkout feature/account-management-afham
git merge develop
```

A branch that lives for weeks drifts from `develop`, and the longer you leave it the more painful the eventual merge. Merging `develop` in early and often keeps each one small.

**Open several pull requests from the same branch over time.** A branch is not one pull request. When a coherent chunk of your epic is finished and working, open a PR, get it reviewed, merge it, and carry on committing to the same branch. This matters: the Definition of Done requires work to be merged into `develop`, so a card cannot be Done while it sits unmerged. Merging a few times per sprint is what lets cards close as you finish them instead of all at once at the end.

**A `feature/` branch holds fixes to its own epic too.** Don't open `fix/account-management-afham` alongside it — the type reflects what the branch is for, not what every commit does. Use `fix/` only for a correction outside your own epic work — a bug in someone else's epic goes on `fix/<their-epic>-<yourname>`, which your name keeps distinct from their branch, and a repo-wide fix goes on `fix/shared-<area>-<yourname>`.

> **Watch the one asymmetry:** branches spell the type out — `feature/…` — while commits use the Conventional Commits abbreviation, `feat(…)`. Two conventions sitting next to each other, deliberately kept as they read best in each place.

---

## Commit messages

[Conventional Commits](https://www.conventionalcommits.org/), with the requirement IDs appended:

```
<type>(<surface>): <description> [<FR-ID>, <FR-ID>]
```

```
feat(backend): add posting creation endpoint [FR-POST-01]
feat(backend): add NIC storage and duplicate checks [FR-ACC-04, FR-ACC-05]
fix(mobile): correct radius auto-expansion step size [FR-DISC-01]
refactor(shared): extract OTP validation helper [FR-ACC-08]
chore(backend): add prisma seed script
```

**`surface` lives here, not in the branch name.** Branches are named by epic; the commit's scope segment is what tells you which surface a change touched when you scan `git log`. Values: `backend`, `mobile`, `dashboard`, `shared`.

**List every requirement the commit touches**, comma-separated. Several requirements are validation rules living inside another requirement's flow — the age gate, NIC handling, duplicate prevention and ToS acceptance all sit inside registration — so one commit legitimately closes several cards.

**The commit message is where traceability lives.** `git log --grep "FR-ACC-03"` searches commit messages, not branch names, so this is the layer that answers "where is this implemented?" It is the one part of the convention that must not be skipped.

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `chore`, `revert`.

Drop the `[FR-ID]` tag when a commit genuinely has no requirement behind it — tooling setup, dependency bumps, config. Don't invent a tenuous link just to satisfy the format.

### When to write a body

Conventional Commits allows an optional body after the subject, separated by a blank line:

```
<type>(<surface>): <description> [<FR-ID>]

Body explaining why, wrapped at around 72 characters.
```

Most commits don't need one. If the subject and the diff together tell the whole story, stop at the subject.

Write a body when the **why** isn't visible in the diff:

- A decision or trade-off you'd otherwise have to explain in review
- A workaround, and what it works around
- Something that looks wrong but is deliberate
- A reason that lives outside the code — a requirement, a tool's behaviour, an external constraint

_"Fix login redirect"_ needs no body. _"Anchor the stalled-engagement timer to start time"_ does — nothing in the diff explains that no end time is collected anywhere in the posting flow.

In GitHub Desktop, the field below **Summary** is the body.

---

## Pull requests and merging

**Work reaches `develop` only through a pull request**, and at least one teammate reviews it before it merges. The review doesn't need to be exhaustive — a second pair of eyes catching an obvious problem is the point.

**A branch produces several pull requests over its life**, not one. Because epic branches stay alive across sprints, you open a PR each time a coherent chunk is finished and working, then keep committing to the same branch afterwards.

**Check the base branch before you click Create.** GitHub shows `base: … ← compare: your-branch` at the top of the PR page. The repository default is `main`, so that dropdown pre-selects `main` — change it to `develop`. A feature branch merged into `main` breaks the sprint-boundary rule below, and it's an easy click to miss.

**Use regular merge commits. Never squash.** Squashing collapses a branch's commits into one, which erases the individual per-author history along the way. That history is the record of who actually built what, and it can't be reconstructed afterwards. This applies at both levels: `feature → develop` and `develop → main`.

**`develop → main` happens at sprint boundaries**, once the team has confirmed the increment demos correctly. Treat it as a deliberate step rather than a routine merge.

### Writing the pull request

**Title: same format as a commit subject** — `<type>(<surface>): <description>`. GitHub puts the PR title into the merge commit, so a good one keeps `develop`'s history readable. The auto-filled branch name does not.

**Description: three things, briefly.**

- **What and why** — one or two sentences. Link the FR IDs it implements.
- **How to check it** — the command to run, the screen to open, the endpoint to hit.
- **Anything to watch** — a deliberate trade-off, something that looks odd but isn't, a follow-up you've left for later.

If a PR needs more explanation than that, it's probably too big — consider splitting it.

---

## Commit attribution

**Every commit must be authored under your own GitHub account.** Check yours is configured correctly before your first commit:

```bash
git config user.name   "Your Name"
git config user.email  "the-email-on-your-github-account"
```

If the email doesn't match a verified address on your GitHub account, your commits won't be attributed to you — they'll show as an unlinked author, and no amount of correct branch naming fixes that afterwards.

You can check what the history currently shows:

```bash
git shortlog -sn          # commits per author
git shortlog -sn develop  # ...on develop specifically
```

`develop`'s history matters as much as `main`'s. Most day-to-day work lands there between sprint boundaries, so that's where contribution actually shows up.

---

## Definition of Done

A story is Done when **all** of the following hold:

1. **It meets its documented acceptance criteria.** Every requirement in [`docs/requirements.md`](docs/requirements.md) has Given/When/Then criteria. Those are the specification — check against them explicitly rather than against your own idea of finished.
2. **It's merged into `develop`** — not sitting on your machine, not waiting in an unmerged pull request.
3. **It runs end to end in the actual app** — not verified in isolation, not only through Postman or a unit test.
4. **It has no known critical or blocking bugs.**
5. **For UI work, it functionally matches the relevant wireframe.** Functionally, not pixel-perfect — the flow and elements should be right, the visual polish doesn't have to be.
6. **It's committed with a descriptive message**, per the format above.
7. **If it changed the database schema, every affected teammate was told first** — see below.

**Automated test coverage is deliberately not part of this.** That's a conscious scope decision for this stage, not an oversight. Point 3 — actually running the thing end to end — is doing that job for now.

---

## Changing the database schema

The full schema is designed up front and lands in **one migration before feature work starts**, so that nobody is blocked waiting on someone else's tables. [`docs/database-schema.md`](docs/database-schema.md) is the reference.

**After that first migration, altering an existing table requires telling people first.** Specifically: notify every teammate whose in-progress or planned work touches the affected table(s) _before_ you make the change. Not a silent local migration, not a heads-up after the fact.

This matters more than it might look. The modules interlock heavily. `Engagement` alone is touched by four of the eight slices — Applying & Selection creates it, Engagement Lifecycle drives it through its checkpoints, Ratings hangs off its completion, and Notifications fires on its state changes. An unannounced column rename can therefore break work in four places at once, and the person who broke it won't be the one who finds out.

Adding a genuinely new table that nothing else references is lower risk, but still worth a message.

---

## Estimation

Story points, Fibonacci-like scale: **1, 2, 3, 5, 8**.

Points estimate relative effort and uncertainty, not hours. Current per-story estimates are in [`docs/module-ownership.md`](docs/module-ownership.md). They were set at planning time, before anyone had written the code — if you pick up a story and the estimate looks wrong, say so at the next planning session rather than silently absorbing it.

---

## Quick reference

```bash
# first time on your epic — create the branch
git checkout develop && git pull
git checkout -b feature/gig-posting-yourname

# every time after that — the branch already exists, just go back to it
git checkout feature/gig-posting-yourname
git merge develop                 # stay current with everyone else's merges

# commit
git commit -m "feat(backend): add posting creation endpoint [FR-POST-01]"

# open a PR into develop, get one review, merge with a merge commit (not squash)
# DO NOT delete the branch after merging — you will come back to it

# check your commits are attributed to you
git shortlog -sn develop
```
