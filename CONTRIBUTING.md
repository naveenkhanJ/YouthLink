# Contributing to YouthLink

How we branch, commit, review, and decide something is finished. Read this before your first pull request.

**Related documents:** [`README.md`](README.md) covers stack and local setup · [`docs/requirements.md`](docs/requirements.md) is the requirements baseline every branch name and commit references · [`docs/module-ownership.md`](docs/module-ownership.md) says who owns which module · [`docs/database-schema.md`](docs/database-schema.md) is the schema everyone builds against.

---

## Branching model

Two long-lived branches.

| Branch    | Purpose                                                                                                                          |
| --------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `main`    | Updated **only at sprint boundaries**, after the team has verified the demo actually works. It should never show a broken state. |
| `develop` | The active integration branch. All work branches off it and merges back into it.                                                 |

Everything else is a short-lived branch off `develop`.

**Never commit directly to `main` or `develop`.** Both are integration branches — work reaches them through a pull request, never through a local commit pushed straight up.

### Branch naming

```
<type>/<surface>/<fr-id>-<short-description>-<yourname>
```

```
feature/backend/fr-post-01-posting-endpoint-naveenkhan
feature/mobile/fr-disc-01-radius-browse-lahiru
fix/dashboard/fr-dash-03-case-queue-sort-afham
```

| Segment    | Values                                                               |
| ---------- | -------------------------------------------------------------------- |
| `type`     | `feature`, `fix`, `chore`, `refactor`, `docs`, `test`                |
| `surface`  | `backend`, `mobile`, `dashboard`, `shared`                           |
| `fr-id`    | The requirement this work implements, lowercased — e.g. `fr-post-01` |
| `yourname` | **Always included**, not only when it would otherwise clash          |

Two segments earn their place. **`surface`** means two people can build the backend and mobile halves of the same requirement in parallel without colliding. **`fr-id`** makes "where is FR-POST-01 implemented?" answerable with a single `git branch --all | grep fr-post-01` instead of archaeology.

Your name is always included rather than only when ambiguous — one unconditional rule is easier to follow than a conditional one.

**Repo-wide changes use `shared`.** Documentation, `.gitignore`, CI config and anything else at the repository root isn't specific to one surface. Tag it `shared` rather than inventing a new value — that applies to the commit's surface segment too, so `docs(shared): …`.

> **Watch the one asymmetry:** branches use `feature/…`, commits use `feat(…)`. They're different conventions that happen to sit next to each other — Conventional Commits specifies `feat`, and the branch prefix reads better in full.

---

## Commit messages

[Conventional Commits](https://www.conventionalcommits.org/), with the requirement ID appended:

```
<type>(<surface>): <description> [<FR-ID>]
```

```
feat(backend): add posting creation endpoint [FR-POST-01]
fix(mobile): correct radius auto-expansion step size [FR-DISC-01]
refactor(shared): extract OTP validation helper [FR-ACC-08]
chore(backend): add prisma seed script
```

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

**Every feature branch goes to `develop` through a pull request**, and at least one teammate reviews it before it merges. The review doesn't need to be exhaustive — a second pair of eyes catching an obvious problem is the point.

**Check the base branch before you click Create.** GitHub shows `base: … ← compare: your-branch` at the top of the PR page. The repository default is `main`, so that dropdown pre-selects `main` — change it to `develop`. A feature branch merged into `main` breaks the sprint-boundary rule below, and it's an easy click to miss.

**Use regular merge commits. Never squash.** Squashing collapses a branch's commits into one, which erases the individual per-author history along the way. That history is the record of who actually built what, and it can't be reconstructed afterwards. This applies at both levels: `feature → develop` and `develop → main`.

**`develop → main` happens at sprint boundaries**, once the team has confirmed the increment demos correctly. Treat it as a deliberate step rather than a routine merge.

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
# start work
git checkout develop && git pull
git checkout -b feature/backend/fr-post-01-posting-endpoint-yourname

# commit
git commit -m "feat(backend): add posting creation endpoint [FR-POST-01]"

# open a PR into develop, get one review, merge with a merge commit (not squash)

# check your commits are attributed to you
git shortlog -sn develop
```
