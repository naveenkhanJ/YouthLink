# YouthLink — Module Ownership & Sprint Scope

Who builds what, and exactly which requirements each slice covers. Every module is a **vertical slice**: one person owns it end to end, backend and frontend together, rather than the work being split into a backend team and a frontend team.

## About this document

**Jira is where status is tracked; the code is what status means.** This document is the stable reference for _scope and ownership_ — what a slice contains and who owns it. Day-to-day progress, status transitions, and assignment changes live on the board, and cards get moved as work progresses. But what is actually built is whatever the code on `develop` contains: if a card's status and the code disagree, the code is right, and the work goes on from what the code shows (see [`workflow/agent-protocol.md`](workflow/agent-protocol.md) §2). This document and Jira agree with each other about scope and ownership; where they differ, raise it with the team.

**Every requirement links to its full specification.** Story titles below link into [`requirements.md`](requirements.md), where each requirement has its normative statement and Given/When/Then acceptance criteria. Those acceptance criteria are the first clause of the Definition of Done — a story isn't Done until they're met. They're deliberately not duplicated here, so there's only ever one copy to keep correct.

**Tasks are a starting checklist, not a contract.** The implementation tasks listed per story came from sprint planning. They're a reasonable opening breakdown, not a fixed scope — expect to adjust them once you're actually in the code, and track the adjustments in Jira.

**Related documents:** [`product-overview.md`](product-overview.md) explains how the mechanisms work and why; [`database-schema.md`](database-schema.md) covers the tables every slice builds against; [`CONTRIBUTING.md`](../CONTRIBUTING.md) has the branching, commit, and Definition-of-Done rules.

> **Canonical source.** Slice composition and estimates are maintained outside the repository. Don't rebalance a slice by editing this file alone — raise it with the team.

---

## How the work is divided

Four members, one slice each per sprint, each slice a whole module. The rule that keeps this coherent: **a module is never split across two people.** Splitting one module's stories between developers is what makes it impossible for either to explain the whole mechanism afterwards, and these mechanisms interlock enough that partial ownership causes real integration pain.

Point totals are close but not identical across slices, because the underlying modules genuinely aren't the same size. Rebalancing further would mean breaking whole-module ownership, which costs more than it saves.

**Two exceptions to per-module ownership:** the initial project scaffolding and the full database schema. Both are done once, by one person, before feature work starts — see [`database-schema.md`](database-schema.md).

### Owners

| Sprint | Slice | Module                                  | Stories | Points | Owner          |
| ------ | ----- | --------------------------------------- | ------- | ------ | -------------- |
| 1–2    | A     | Account Management                      | 8       | 17     | **Afham**      |
| 1–2    | B     | Gig Posting                             | 8       | 18     | **Lahiru**     |
| 1–2    | C     | Discovery & Search + core Notifications | 7       | 15     | **Pawan**      |
| 1–2    | D     | Applying & Selection                    | 10      | 20     | **Naveenkhan** |

**Sprint 2 (19–22 August) is not a new set of epics — it's these same four
slices, same owners, continuing.** Decided by the team with the client
present: Sprint 1 (14–18 August) ended without completing its scope (two
setup days lost, three infrastructure interruptions), so its own 33
stories carry into Sprint 2 rather than starting the four epics originally
planned for it. No new stories were added. Full detail lives in the SPM
project's own Scrum Events Log, outside this repo; the short version is in
[`decisions.md`](decisions.md). The four epics originally scheduled for
Sprint 2 — Engagement Lifecycle, Ratings & Reputation, Profile & Trust
Signals, Community Endorsement — are deferred, not owned by anyone yet;
see the deferred-scope section below.

Use the same short name as your branch-name segment, so ownership and git history line up: `afham`, `lahiru`, `pawan`, `naveenkhan` (see [`CONTRIBUTING.md`](../CONTRIBUTING.md)). Each person's git addresses, accepted branch names and module folders are in [`workflow/team.json`](workflow/team.json), which the local git hooks read. **Afham also owns every shared component** — the UI kit and design tokens, navigation shells, Help/FAQ, shared middleware, the seed script, the schema and the shared development build.

### What these slices do and don't cover

The four slices above schedule the same functional requirements originally
planned for Sprint 1 alone — carrying the work into Sprint 2 didn't add
scope, it recovered lost time. The four epics originally planned for
Sprint 2 (below) are real, specified requirements that are now deferred
along with everything else not yet scheduled — disputes and reporting,
Moderator and Admin functions, the shared dashboard, and the
lower-priority remainder of each module. They're elaborated closer to
whichever sprint actually picks them up.

So: if a requirement isn't listed here, it hasn't been dropped. Check [`requirements.md`](requirements.md) — everything is specified there regardless of when it's scheduled.

---

## Cross-cutting: authentication

**Every slice's endpoints are protected by shared middleware built in Sprint 1 Slice A. Do not write your own auth check.**

The system uses **stateless JWTs** — there is no `Session` or `RefreshToken` table, a deliberate simplification recorded in [`database-schema.md`](database-schema.md) under Design Decisions. The middleware validates the token and re-reads `accountStatus` and `suspendedAt` from the database on **every** request, which is what delivers NFR-REL-02's "a suspension takes effect on the account's very next request" without a session store.

**`lockedUntil` is checked only at the password-login endpoint, not by this middleware.** Corrected 2026-08-18 — NFR-SEC-02 locks "the password-login path" specifically, and product-overview.md is explicit that the OTP login path — and, by the same logic, an already-authenticated session — is unaffected by that lock. An earlier draft of this contract listed `lockedUntil` alongside `accountStatus`/`suspendedAt` as something the middleware enforces on every request, and `requireAuth.js` was briefly built that way; that was wrong and caused a real bug (see [`decisions.md`](decisions.md)) — it let a caller with no credentials at all knock out a legitimate user's sessions on every device just by failing their password 5 times, since multiple simultaneous logins are allowed. Don't reintroduce a `lockedUntil` check into this middleware.

Phone verification at signup and OTP login goes through **Firebase Phone Authentication**; the backend trusts a phone number only after validating the Firebase ID token server-side. The system's own `OtpCode` mechanism covers password reset, phone change, and dashboard admin login (see FR-ACC-08).

The middleware is on `develop` at `backend/src/middleware/requireAuth.js`. Apply it in your module's routes file to every endpoint that needs a signed-in user, and read the user from `req.user`.

**Which endpoints need it — ruled 2026-09-25.** Every endpoint requires sign-in, **except** the ones that exist to get a person signed in — registration, both login paths, password reset (`FR-ACC-10`) and the account-recovery request, whose requester is unauthenticated by definition — and the `/health` check, which carries no data. There is no signed-out use of the app: first run leads only to account creation (`M0` → `1.1`), and Browse first appears right after registration (`3.9`). So Browse and every other Discovery endpoint require sign-in, which is also what lets `FR-POST-08` decide how precisely to show a location.

**Role checks follow the actor table.** Where a requirement's *Actor(s)* names who may act, the endpoint refuses every other role with 403 — for example, only a Local Business/Employer creates a posting (`FR-POST-01`), and only a Youth Job-Seeker applies (`FR-APPLY-02`). A route that checks the token but not the role lets anyone signed in do everything.

---

## Sprint 1–2 — the core loop: post → discover → apply → select

Together these four slices make the first increment demoable end to end: an Employer posts a gig, a Youth Job-Seeker discovers it, applies, and gets selected.

**33 stories, 70 points. This is the whole of Sprint 2's scope too** —
Sprint 2 continues this same set of stories under the same owners rather
than starting new epics; see the Owners section above for why. Nothing
below describes two different sets of work, just one that took two
sprints.

### Slice A — Account Management

**Owner:** **Afham** · **8 stories, 17 points** · Epic: `FR-ACC`

Registration, OTP verification, both login paths, the 18+ age gate, duplicate-account prevention, password security, and ToS acceptance. Auth flows, form validation, session handling.

| Requirement                                                                                                                             | Priority | Pts | Implementation tasks                                                                                                                                                                                                                                                                                                                                                                    |
| --------------------------------------------------------------------------------------------------------------------------------------- | -------- | --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [FR-ACC-01 — Account registration](requirements.md#fr-acc-01--account-registration)                                                     | Must     | 5   | – Build registration API endpoint with field validation<br>– Wire OTP verification into the signup flow<br>– Build multi-field registration screen (Expo)                                                                                                                                                                                                                               |
| [FR-ACC-03 — Age gate](requirements.md#fr-acc-03--age-gate)                                                                             | Must     | 1   | – Add age-gate validation to registration API<br>– Add under-18 error state to registration screen                                                                                                                                                                                                                                                                                      |
| [FR-ACC-04 — NIC field handling](requirements.md#fr-acc-04--nic-field-handling)                                                         | Must     | 1   | – Wire NIC field into the registration form (no external verification call)<br>– Confirm age-gate logic reads only birthdate, never NIC                                                                                                                                                                                                                                                 |
| [FR-ACC-05 — Duplicate account prevention](requirements.md#fr-acc-05--duplicate-account-prevention)                                     | Must     | 2   | – Add duplicate-value check to registration API with field-level error messaging                                                                                                                                                                                                                                                                                                        |
| [FR-ACC-07 — Login](requirements.md#fr-acc-07--login)                                                                                   | Must     | 3   | – Build password-login API endpoint<br>– Build OTP-login API endpoint<br>– Build login screen offering both paths                                                                                                                                                                                                                                                                       |
| [FR-ACC-08 — OTP mechanism](requirements.md#fr-acc-08--otp-mechanism)                                                                   | Must     | 2   | – Build Firebase ID token verification for signup and OTP-login phone verification<br>– Build the shared `OtpCode` service (6-digit, 5-minute, single-use) for password reset, phone change and admin login<br>_Note: the `OtpCode` service has no calling requirement in Sprint 1 — FR-ACC-10 and FR-ACC-12 are scheduled later. See FR-ACC-08's amendment note in `requirements.md`._ |
| [FR-ACC-09 — Password security](requirements.md#fr-acc-09--password-security)                                                           | Must     | 2   | – Add bcrypt/argon2 hashing to password storage<br>– Add failed-attempt counter and 15-minute lockout logic                                                                                                                                                                                                                                                                             |
| [FR-ACC-19 — Terms of Service and Privacy Policy acceptance](requirements.md#fr-acc-19--terms-of-service-and-privacy-policy-acceptance) | Must     | 1   | – Add ToS/Privacy Policy checkbox and linked pages to the signup flow<br>– Add submit-blocking validation when the checkbox is unchecked                                                                                                                                                                                                                                                |

### Slice B — Gig Posting

**Owner:** **Lahiru** · **8 stories, 18 points** · Epic: `FR-POST`

The Employer posting flow end to end: field sequencing and caps, the category allow-list, pay format driven by arrangement type, computed urgency, and the review screen. Multi-step forms, derived fields, business rules.

| Requirement                                                                                                 | Priority | Pts | Implementation tasks                                                                                                                                                            |
| ----------------------------------------------------------------------------------------------------------- | -------- | --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [FR-POST-01 — Posting field sequence](requirements.md#fr-post-01--posting-field-sequence)                   | Must     | 5   | – Build multi-step posting form screens<br>– Build posting-creation API with field validation<br>– Wire character-length caps (title 80 / description 1000)                     |
| [FR-POST-02 — Task category allow-list](requirements.md#fr-post-02--task-category-allow-list)               | Must     | 1   | – Add category allow-list constant and dropdown UI<br>– Add server-side category validation on submit                                                                           |
| [FR-POST-04 — Pay format by arrangement type](requirements.md#fr-post-04--pay-format-by-arrangement-type)   | Must     | 3   | – Build conditional pay-field UI per arrangement type<br>– Add pay-field validation logic per type<br>– Confirm per-worker (not split) pay semantics in schema/logic            |
| [FR-POST-05 — Minimum lead time](requirements.md#fr-post-05--minimum-lead-time)                             | Must     | 1   | – Add 2-hour minimum lead-time validation to the posting API<br>– Add explanatory error message in posting UI                                                                   |
| [FR-POST-06 — Workers needed field](requirements.md#fr-post-06--workers-needed-field)                       | Must     | 1   | – Add workers-needed field (1-20, default 1) to the posting form<br>– Add min/max validation                                                                                    |
| [FR-POST-07 — Urgency computation](requirements.md#fr-post-07--urgency-computation)                         | Must     | 2   | – Build urgency-computation function (24-48h window)<br>– Wire computed urgency into posting creation with no manual override                                                   |
| [FR-POST-08 — Location precision display](requirements.md#fr-post-08--location-precision-display)           | Must     | 3   | – Build coarse-area vs. precise-address display logic<br>– Build map-pin display component for both states<br>– Wire precise-address release on selection (ties to FR-APPLY-07) |
| [FR-POST-09 — Review screen before submission](requirements.md#fr-post-09--review-screen-before-submission) | Must     | 2   | – Build review screen showing all entered fields<br>– Add computed urgency and area preview, non-editable                                                                       |

### Slice C — Discovery & Search + core Notifications

**Owner:** **Pawan** · **7 stories, 15 points** · Epics: `FR-DISC`, `FR-NOTIF`

Radius browsing with auto-expansion, manual location fallback, filters, keyword search, sort order — plus the two notification triggers that fire when a posting goes live. Geolocation queries, sorting, push wiring.

| Requirement                                                                                                             | Priority | Pts | Implementation tasks                                                                                                                                                                                    |
| ----------------------------------------------------------------------------------------------------------------------- | -------- | --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [FR-DISC-01 — Radius-based browsing](requirements.md#fr-disc-01--radius-based-browsing)                                 | Must     | 3   | – Build radius-based browse query (geospatial)<br>– Add auto-expansion logic (5km steps to 50km)<br>– Build browse results screen<br>– Show pay figure and basis on each result card (added 2026-08-27) |
| [FR-DISC-02 — Manual location fallback](requirements.md#fr-disc-02--manual-location-fallback)                           | Must     | 2   | – Build manual area/city selector UI<br>– Wire fallback path when location permission is denied                                                                                                         |
| [FR-DISC-03 — Category and arrangement-type filters](requirements.md#fr-disc-03--category-and-arrangement-type-filters) | Should   | 2   | – Add category/arrangement-type filter UI<br>– Wire filters into the browse query, combinable with radius                                                                                               |
| [FR-DISC-05 — Sort order](requirements.md#fr-disc-05--sort-order)                                                       | Must     | 2   | – Build default sort logic (urgent-first, then nearest-first)<br>– Add alternate sort options (recency, pay high-to-low)                                                                                |
| [FR-NOTIF-01 — Urgent gig push notifications](requirements.md#fr-notif-01--urgent-gig-push-notifications)               | Must     | 3   | – Build urgent-push trigger on posting submission<br>– Add 5/day rate limit with digest batching beyond that<br>– Wire opt-in check                                                                     |
| [FR-NOTIF-02 — Non-urgent gig notifications](requirements.md#fr-notif-02--non-urgent-gig-notifications)                 | Must     | 2   | – Build non-urgent notification trigger on posting submission<br>– Wire opt-out check                                                                                                                   |
| [FR-NOTIF-03 — Notification preferences](requirements.md#fr-notif-03--notification-preferences)                         | Must     | 1   | – Build Notification Preferences UI (both toggles)<br>– Wire toggles to user-preference storage                                                                                                         |

### Slice D — Applying & Selection

**Owner:** **Naveenkhan** · **10 stories, 21 points** · Epic: `FR-APPLY`

_(Was 20 points. FR-APPLY-09 re-estimated from 1 to 2 on 2026-08-27 when its trigger was broadened from Filled-only to every way a posting stops accepting applications — see its amendment note in `requirements.md`.)_

The apply flow, the three-tier applicant sort, Employer selection, bidirectional contact reveal, decline and automatic not-selected. A multi-actor state machine plus the sort that gives endorsement its value.

| Requirement                                                                                                                                       | Priority | Pts | Implementation tasks                                                                                                                                                                          |
| ------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [FR-APPLY-01 — Listing detail view](requirements.md#fr-apply-01--listing-detail-view)                                                             | Must     | 2   | – Build listing detail screen<br>– Wire Employer trust-signal display (badges, business name)                                                                                                 |
| [FR-APPLY-02 — Apply action](requirements.md#fr-apply-02--apply-action)                                                                           | Must     | 3   | – Build apply-confirmation screen with pre-filled, editable note<br>– Build apply API with duplicate-application block and Pending state                                                      |
| [FR-APPLY-03 — Application withdrawal](requirements.md#fr-apply-03--application-withdrawal)                                                       | Should   | 2   | – Add withdraw action to the application API<br>– Add withdraw UI and reapply path                                                                                                            |
| [FR-APPLY-04 — Applicant pool sort order](requirements.md#fr-apply-04--applicant-pool-sort-order)                                                 | Must     | 3   | – Build three-tier applicant-pool sort algorithm<br>– Add completion-rate tiebreaker logic                                                                                                    |
| [FR-APPLY-05 — Employer applicant view](requirements.md#fr-apply-05--employer-applicant-view)                                                     | Must     | 2   | – Build Employer applicant-list view<br>– Wire trust-signal and note display, excluding individual case history                                                                               |
| [FR-APPLY-06 — Selection and Engagement creation](requirements.md#fr-apply-06--selection-and-engagement-creation)                                 | Must     | 3   | – Build Select action and Engagement-creation logic<br>– Support multi-session selection up to workers-needed                                                                                 |
| [FR-APPLY-07 — Contact reveal on selection](requirements.md#fr-apply-07--contact-reveal-on-selection)                                             | Must     | 2   | – Build contact-reveal logic on selection (bidirectional phone numbers)<br>– Wire precise-address reveal to the selected worker only                                                          |
| [FR-APPLY-08 — Explicit decline](requirements.md#fr-apply-08--explicit-decline)                                                                   | Should   | 1   | – Add Decline action with immediate applicant notification                                                                                                                                    |
| [FR-APPLY-09 — Automatic not-selected notification](requirements.md#fr-apply-09--automatic-not-selected-notification)                             | Must     | 2   | – Resolve Pending applicants whenever a posting stops accepting applications — Filled, expired, or withdrawn (broadened 2026-08-27, was Filled-only)<br>– Set each to Not selected and notify |
| [FR-APPLY-10 — Pending-applicant notification on material change](requirements.md#fr-apply-10--pending-applicant-notification-on-material-change) | Should   | 1   | – Add material-change notification trigger for Pending applicants                                                                                                                             |

---

## Sprint 3 — carry-over first

**Sprint 3's own slices are not assigned yet.** They will be added here, with the sprint dates, and in [`workflow/team.json`](workflow/team.json). Until then, this carry-over is each owner's whole queue, in this order ([`workflow/agent-protocol.md`](workflow/agent-protocol.md) §4.1). **Nobody waits on another member:** each item below can be done by its owner alone, and the only shared dependency is on the shared components.

### 1. Sprint 1 work onto `develop`

Any Sprint 1 slice code that is not yet merged into `develop` comes first: merge `origin/develop` into your branch, adapt the code to the current schema and shared code, run it, and open a pull request. No card is Done while its code is unmerged (DoD clause 2). `node scripts/state-report.mjs` shows whether one of your branches carries module code that `develop` lacks. The cards' status in Jira is left as it is.

Edits your branch made to shared files — `mobile/src/screens/HomeScreen.js` above all, since three branches each rewrote it — come out before the pull request: restore `develop`'s copy (`git checkout origin/develop -- <file>`). Reaching your screens is then the job of the shared home entry (item 4, first in Afham's queue); until it lands, record end to end as pending with that reason.

**Slice C is one slice across two modules**, so Discovery and core Notifications share one branch, `feature/discovery-search-pawan` (`moduleBranches` in [`workflow/team.json`](workflow/team.json)).

### 2. Follow-on cards

Requirements amended after Sprint 1 closed changed stories that were already Done. Those Done cards are left as they are; each amendment is its own follow-on card, owned by the Sprint 1 owner of that slice. The requirement entry — including the dated amendment note — is the specification; `node scripts/card-context.mjs <FR-ID>` prints it with its screens.

| Owner | Card | Follow-on to | Requirement | What the amendment adds |
| --- | --- | --- | --- | --- |
| Afham | YL-163 | YL-29 | [FR-ACC-01](requirements.md#fr-acc-01--account-registration) | Legal-name counter at the 100-character cap |
| Afham | YL-164 | YL-31 | [FR-ACC-04](requirements.md#fr-acc-04--nic-field-handling) | NIC format validation |
| Afham | YL-165 | YL-32 | [FR-ACC-05](requirements.md#fr-acc-05--duplicate-account-prevention) | Phone and email availability checked at entry |
| Afham | YL-166 | YL-33 | [FR-ACC-07](requirements.md#fr-acc-07--login) | One return-to-login for every ended session |
| Afham | YL-167 | YL-34 | [FR-ACC-08](requirements.md#fr-acc-08--otp-mechanism) | App-enforced 5-minute window on Firebase codes |
| Afham | YL-168 | YL-35 | [FR-ACC-09](requirements.md#fr-acc-09--password-security) | Password length rule, remaining attempts, the lockout's way out |
| Lahiru | YL-169 | YL-39 | [FR-POST-04](requirements.md#fr-post-04--pay-format-by-arrangement-type) | Pay amount and rate unit conditional on pay kind |
| Lahiru | YL-170 | YL-42 | [FR-POST-07](requirements.md#fr-post-07--urgency-computation) | Urgent means 48 hours or less, with no lower bound |
| Pawan | YL-171 | YL-45 | [FR-DISC-01](requirements.md#fr-disc-01--radius-based-browsing) | Pay figure and basis on every browse result |
| Pawan | YL-172 | YL-46 | [FR-DISC-02](requirements.md#fr-disc-02--manual-location-fallback) | The location permission ask, and permanent denial |
| Pawan | YL-178 | YL-45 | [FR-DISC-01](requirements.md#fr-disc-01--radius-based-browsing) | Record each browse's centre as the worker's last browse location (needs the schema change of 2026-09-25) |
| Naveenkhan | YL-173 | YL-55 | [FR-APPLY-04](requirements.md#fr-apply-04--applicant-pool-sort-order) | Earliest application first within tiers 2 and 3 |
| Naveenkhan | YL-174 | YL-60 | [FR-APPLY-09](requirements.md#fr-apply-09--automatic-not-selected-notification) | Resolve Pending applicants on expiry and withdrawal |
| Naveenkhan | YL-175 | YL-61 | [FR-APPLY-10](requirements.md#fr-apply-10--pending-applicant-notification-on-material-change) | Send `APPLICATION_TERMS_CHANGED` to Pending applicants |

**YL-174 and YL-175 cross into Gig Posting without waiting on it.** Applying & Selection exposes the functions — resolve a posting's Pending applicants with a reason; notify them of a material change — and builds and verifies them against seeded data. Gig Posting calls them from its own flows (withdrawal and expiry, `FR-POST-12`/`FR-POST-13`; material changes) when those are built. Until then the calls don't exist, and nothing is blocked.

### 3. UI conformance for Sprint 1 screens

Every Sprint 1 screen was built before the prototype specification existed. Each owner brings their own screens to it — DoD clause 5 — using the shared UI kit and tokens once they are on `develop`. The screens are the ones the prototype's [requirement index](prototype/README.md#requirement-index) maps to each requirement, **limited to the screens your module builds** — by screen number, with the listing detail `3.12` belonging to Applying & Selection (see *Who builds a screen* in the prototype README). Where another module's screen shows your requirement, you supply the data through your API; you don't edit their screen.

| Owner | Requirements whose screens to bring to the specification |
| --- | --- |
| Afham | FR-ACC-01, FR-ACC-03, FR-ACC-04, FR-ACC-05, FR-ACC-07, FR-ACC-08, FR-ACC-09, FR-ACC-19 |
| Lahiru | FR-POST-01, FR-POST-02, FR-POST-04, FR-POST-05, FR-POST-06, FR-POST-07, FR-POST-08, FR-POST-09 |
| Pawan | FR-DISC-01, FR-DISC-02, FR-DISC-03, FR-DISC-05, FR-NOTIF-01, FR-NOTIF-02, FR-NOTIF-03 |
| Naveenkhan | FR-APPLY-01 through FR-APPLY-10 |

### 4. Shared prerequisites — Afham

The pieces everyone else builds on, first in Afham's queue so nobody is held up by them, in this order:

- **A neutral home entry** that reaches every module's screens through the manifests, so no module branch needs to touch `HomeScreen.js` — the first thing each member's Sprint 1 pull request depends on.
- **Design tokens and the core UI kit** — the components `design-system.md` §5 names (buttons, text fields, the app bar, the pinned action bar, skeletons, empty and error states), bound to the §1–§4 tokens. They replace the module-local `theme.js` files; until they land, module code uses the token names exactly, so switching is a rename.
- **The navigation shells** (`NAV.1`–`NAV.3`), replacing the neutral entry; Help/FAQ (`HF.1`–`HF.4`) follows.
- **A shared seed script**, so each module runs against realistic data from the others without waiting for them.
- **The shared development build** — an Android APK sent to the team, rebuilt whenever a native dependency changes.

---

## Deferred scope — extending the loop through to completion

**Not what Sprint 2 is doing — see the Owners section above.** This
section was the original plan for Sprint 2 before the team decided to
carry Sprint 1's own scope forward instead. It's kept in full, not
deleted, because this work still needs doing eventually and the
breakdown below remains valid whenever a future sprint picks it up —
treat everything below as unscheduled, not as current assignments.

These four extend the loop past selection to a completed, rated engagement — including the endorsement mechanism that differentiates the product.

**20 stories, 41 points. Deferred — no owner, no sprint assigned.**

### Slice A — Engagement Lifecycle

**Owner:** _TBD_ · **5 stories, 13 points** · Epic: `FR-ENG`

The three check-in code checkpoints and who holds each, the unpaid-internship exception, the unable-to-confirm fallback into disputes, and End Engagement for part-time work. Checkpoint state machine, code generation and validation.

| Requirement                                                                                                             | Priority | Pts | Implementation tasks                                                                                                                                                              |
| ----------------------------------------------------------------------------------------------------------------------- | -------- | --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [FR-ENG-01 — Check-in code checkpoints](requirements.md#fr-eng-01--check-in-code-checkpoints)                           | Must     | 5   | – Build code-generation and validation API<br>– Build checkpoint entry screens (Employer + Worker views)<br>– Wire cross-checkpoint code rejection                                |
| [FR-ENG-02 — Unpaid internship checkpoint exception](requirements.md#fr-eng-02--unpaid-internship-checkpoint-exception) | Must     | 1   | – Add Unpaid-internship exception to the checkpoint flow                                                                                                                          |
| [FR-ENG-03 — Unable-to-confirm fallback](requirements.md#fr-eng-03--unable-to-confirm-fallback)                         | Must     | 2   | – Add "unable to confirm" action to checkpoint screens<br>– Wire dispute-case creation on trigger                                                                                 |
| [FR-ENG-04 — Per-Engagement checkpoint scoping](requirements.md#fr-eng-04--per-engagement-checkpoint-scoping)           | Must     | 2   | – Verify multi-slot isolation against the existing schema (one worker's failure doesn't affect others)                                                                            |
| [FR-ENG-12 — Part-time End Engagement](requirements.md#fr-eng-12--part-time-end-engagement)                             | Must     | 3   | – Build End Engagement action with "did something go wrong?" prompt<br>– Wire yes→dispute / no→rating routing<br>– Add multi-slot independence and pre-start→cancellation routing |

### Slice B — Ratings & Reputation

**Owner:** _TBD_ · **5 stories, 9 points** · Epic: `FR-RATE`

1–5 star ratings, the double-blind reveal (both submit or 14 days), per-engagement independence, and completion rate as a separate statistic. Reveal-timing logic and careful separation of two different signals.

| Requirement                                                                                                                       | Priority | Pts | Implementation tasks                                                                                              |
| --------------------------------------------------------------------------------------------------------------------------------- | -------- | --- | ----------------------------------------------------------------------------------------------------------------- |
| [FR-RATE-01 — Rating scale and submission](requirements.md#fr-rate-01--rating-scale-and-submission)                               | Must     | 1   | – Build 1-5 star rating submission UI (no free text)<br>– Add rating-value validation to the API                  |
| [FR-RATE-02 — Double-blind submission](requirements.md#fr-rate-02--double-blind-submission)                                       | Must     | 3   | – Build double-blind reveal logic (both-submitted or 14-day timer)<br>– Wire reveal notification to both parties  |
| [FR-RATE-03 — Completion-rate as a distinct stat](requirements.md#fr-rate-03--completion-rate-as-a-distinct-stat)                 | Must     | 2   | – Build completion-rate calculation, kept separate from star rating<br>– Display both stats separately on profile |
| [FR-RATE-04 — Per-Engagement independent ratings](requirements.md#fr-rate-04--per-engagement-independent-ratings)                 | Must     | 2   | – Scope rating pairs per-Engagement, not per-posting<br>– Confirm independent reveal timelines per Engagement     |
| [FR-RATE-05 — Rating applicability by Engagement outcome](requirements.md#fr-rate-05--rating-applicability-by-engagement-outcome) | Must     | 1   | – Wire identical rating flow for completed Gigs and ended Part-time Engagements                                   |

### Slice C — Profile & Trust Signals + remaining Notifications

**Owner:** _TBD_ · **5 stories, 9 points** · Epics: `FR-PROF`, `FR-NOTIF`

Profile identity display, verification badges, trust-signal display — plus the application- and engagement-related notification triggers. Profile UI, badge components, notification wiring.

| Requirement                                                                                                       | Priority | Pts | Implementation tasks                                                                                                                                        |
| ----------------------------------------------------------------------------------------------------------------- | -------- | --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [FR-PROF-01 — Profile display identity](requirements.md#fr-prof-01--profile-display-identity)                     | Must     | 1   | – Wire full legal-name display across identity surfaces                                                                                                     |
| [FR-PROF-02 — Verification badges](requirements.md#fr-prof-02--verification-badges)                               | Must     | 2   | – Add "Phone verified" badge component<br>– Wire business-name display for Business-type Employers<br>– Confirm no NIC/PCC-verification badge is ever shown |
| [FR-PROF-06 — Trust-signal display on profile](requirements.md#fr-prof-06--trust-signal-display-on-profile)       | Must     | 2   | – Build rating/completion-rate profile display<br>– Build "New to YouthLink" + endorsement-badge fallback state                                             |
| [FR-NOTIF-04 — Application-related notifications](requirements.md#fr-notif-04--application-related-notifications) | Must     | 2   | – Add application-notification trigger (new application → Employer)<br>– Add selection/decline/not-selected triggers → worker                               |
| [FR-NOTIF-05 — Engagement-related notifications](requirements.md#fr-notif-05--engagement-related-notifications)   | Must     | 2   | – Add material-change, End Engagement, and stalled-engagement notification triggers                                                                         |

### Slice D — Community Endorsement

**Owner:** _TBD_ · **5 stories, 11 points** · Epic: `FR-ENDORSE`

_(Was 10 points. FR-ENDORSE-04 re-estimated from 2 to 3 on 2026-08-27 when the scope statement, attribute chips and relationship prompt were added — see its amendment note in `requirements.md`.)_

The Community Verifier/Endorser role, both endorsement entry points (shareable code and phone search), the vouch action, and the permanently-closing eligibility window. (The requirements call this actor _Community Verifier/Endorser_; the schema calls the same role `COMMUNITY_ENDORSER`.) Two entry flows and careful eligibility checks.

| Requirement                                                                                                                             | Priority | Pts | Implementation tasks                                                                                                                                                                                                                                                                                                                                                                                                    |
| --------------------------------------------------------------------------------------------------------------------------------------- | -------- | --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [FR-ENDORSE-01 — Verifier role selection](requirements.md#fr-endorse-01--verifier-role-selection)                                       | Must     | 1   | – Add Verifier role option to signup role selection                                                                                                                                                                                                                                                                                                                                                                     |
| [FR-ENDORSE-02 — Worker-initiated endorsement entry point](requirements.md#fr-endorse-02--worker-initiated-endorsement-entry-point)     | Must     | 3   | – Build endorsement-code generation (6-character, persistent)<br>– Build code display + OS share-sheet integration<br>– Build code-entry and eligibility validation on the Verifier side                                                                                                                                                                                                                                |
| [FR-ENDORSE-03 — Verifier-initiated endorsement entry point](requirements.md#fr-endorse-03--verifier-initiated-endorsement-entry-point) | Must     | 3   | – Build Verifier phone-search API<br>– Build the generic "no eligible match" response (no info leak)<br>– Build search UI for the Verifier                                                                                                                                                                                                                                                                              |
| [FR-ENDORSE-04 — Vouch action](requirements.md#fr-endorse-04--vouch-action)                                                             | Must     | 3   | – Build vouch-submission action with optional reason field, prompted "How do you know this person?"<br>– Add the non-dismissible plain-language scope statement shown before commitment<br>– Add optional multi-select attribute chips (`EndorsementAttribute`), empty selection valid<br>– Ensure only selected attributes render, never the unselected ones<br>– Wire immediate live display, no pending-review state |
| [FR-ENDORSE-05 — Eligibility window](requirements.md#fr-endorse-05--eligibility-window)                                                 | Must     | 1   | – Wire eligibility-close trigger to the first-rating event (FR-RATE-02)                                                                                                                                                                                                                                                                                                                                                 |

---

## Ownership audit — 2026-08-27 amendment batch

**Fifteen requirements had no story in any slice**, found while writing the prototype screen specifications; three more were added by the batch itself. Recorded here so slice assignment inherits the full picture — **rows below are unpointed; estimate at slice assignment.**

| Requirement | Belongs to | Note |
|---|---|---|
| FR-RATE-06 — rating disputes | Deferred Slice B | Public response, Admin removal path, `RatingRemovalRequest` |
| FR-PROF-03 / FR-PROF-04 / FR-PROF-05 | Deferred Slice C | Bio + edit surface; note pre-fill; interaction-context-only rule |
| FR-ENDORSE-06 through FR-ENDORSE-15 | Deferred Slice D | Coverage, revocation, uncapped, both notifications, named badge, track record, three nudges — nearly half the epic was invisible to its slice |
| FR-ENG-14 — engagements list *(new)* | Deferred Slice A | The container every engagement screen hangs off |
| FR-NOTIF-11 *(new)* | Deferred Slice B trigger · Slice C wiring | Rating notifications |
| FR-NOTIF-12 *(new)* | Disputes (no slice yet) · Slice C wiring | Dispute-lifecycle notifications to parties |
| NFR-USE-03 — Help/FAQ | **Shared: Afham** (shell, assembly) | Mechanism paragraphs authored by Slice A/D owners and the disputes owner at slice assignment; screens `HF.1–HF.4` in the prototype spec |

**Navigation shells (`NAV.1–NAV.3` in the prototype spec)** are shared work alongside Help/FAQ — no epic owns the front door.

## Added scope — new requirements from the user-research validation (2026-08-27)

Two requirements were added to the baseline after the parallel UX module's research was validated against it. Neither was part of Sprint 1–2's committed 33 stories, and neither belongs to a deferred slice above — they are new work, listed here so they are scheduled deliberately rather than discovered later.

| Requirement                                                                                              | Epic         | Priority | Pts | Implementation tasks                                                                                                                                                                                                                                       |
| -------------------------------------------------------------------------------------------------------- | ------------ | -------- | --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [FR-APPLY-12 — Worker's own application list](requirements.md#fr-apply-12--workers-own-application-list) | `FR-APPLY`   | Must     | 3   | – Build the worker-facing application list API (own applications only)<br>– Surface each application's current state<br>– Join the parent posting's expiry date for Pending rows<br>– Order Pending by soonest expiry<br>– Build list + empty-state screen |
| [FR-DISPUTE-07 — Case status visibility](requirements.md#fr-dispute-07--case-status-visibility)          | `FR-DISPUTE` | Must     | 3   | – Expose case status to both parties, not just the raising party<br>– Surface the 48-hour response window and its remaining time to both<br>– Surface the recorded outcome to both<br>– Ensure under-review status states no completion date               |

**Ownership.** FR-APPLY-12 belongs to the Applying & Selection epic (Naveenkhan). FR-DISPUTE-07 belongs to Disputes & Reporting, which has no owner yet — it sits in the unscheduled tail alongside the rest of `FR-DISPUTE`.

**Two unscheduled requirements were also amended and carry extra work when they are eventually picked up.** Both belong to Gig Posting (Lahiru's epic) and neither is in the Sprint 1–2 table above:

- **FR-POST-13 — Posting expiry.** Priority raised **Should → Must**. Now expires any Open posting regardless of fill state, anchors one-off Gigs to their own start date/time rather than a flat 30 days, and must resolve remaining Pending applicants. Materially larger than the original one-line rule.
- **FR-POST-12 — Posting withdrawal.** The action is unchanged; it gains an acceptance criterion covering what withdrawal does to Pending applicants.

These three — FR-APPLY-09, FR-POST-12 and FR-POST-13 — implement one invariant together: **a posting that stops accepting applications resolves its applicants, however it stopped.** They should be scheduled together rather than piecemeal, since implementing any one alone leaves the guarantee in `FR-APPLY-12` only partly true.

**Scheduling.** Both are Sprint 3 candidates. FR-APPLY-12 has no dependency on deferred scope and could be pulled forward. FR-DISPUTE-07 sensibly waits until the dispute pipeline itself is being built, since it is a view onto states that don't exist yet.

## Added scope — the error and offline pass (2026-09-16) and openings O5/O6 (2026-09-20)

Two amendments create work that no slice's story table covered. Recorded the same way as the 2026-08-27 audit above, so neither ends up unowned by default.

| Requirement | Work | Slice |
|---|---|---|
| `FR-ACC-10` (E8) | **Account recovery, worker side** — the request form, its submitted state, and the approved outcome that leads into setting a new password. Four screens, and the device-binding identifier the request carries | **Slice A — Account Management** |
| `FR-ACC-10` (E8) | **Account recovery, dashboard side** — the request in the Admin case queue, the review surface showing the NIC match against engagement and rating history, and the approve/reject actions with their audit entries. **Admin only**; it must not be reachable by a Moderator | **Slice A**, with the dashboard's case-queue owner — coordinate, as it adds a card type to a shared surface |
| `FR-ACC-12` (E5) | Password reset by verified email while logged in — reuses `FR-ACC-10`'s existing channel | **Slice A — Account Management** |
| `FR-ACC-05` (E1, E2) · `FR-ACC-09` (E6, E7) · `FR-ACC-01` (E3) | Pre-verification availability checks, the remaining-attempts warning, and the lockout naming the OTP path | **Slice A — Account Management** |
| `FR-ADM-06` (O5, O6) | **The staff-account surface** — the Admin-only list, admin-assisted password reset, and removal of staff access | **Slice A**, dashboard side |
| `FR-POST-15` · `NFR-USE-01` (E9) | Device-only retention of an in-progress posting form | **Slice B — Gig Posting** |
| `NFR-PERF-01` (E10) | Loading and skeleton states on every operation that can exceed the perceptible threshold | **cross-cutting** — the component exists; each slice applies it to its own network calls |

**Most of this lands on Slice A**, which is the expected shape: eight of the ten E-rows and both O-rows are account-access concerns, and that is the area the error pass examined.

---

## How the deferred slices relate to Sprint 1–2's

_(This section describes the deferred scope above, not the current sprint
— relevant again once that scope is actually picked up. There is nothing
to plan here for Sprint 1–2 itself: same four owners, same four slices,
no relationship to work out.)_

**There is exactly one hard technical dependency.** The deferred **Engagement Lifecycle** (Slice A) is built directly on the Engagement record that **Applying & Selection** (Slice D, Sprint 1–2) creates — the Employer's Select action is what spawns it. Whoever builds Apply carries the most context into Engagement, so that pairing will be a sensible default when Engagement is eventually scheduled, but it isn't mandatory.

Beyond that, the couplings are weaker and don't map one Sprint 1–2 slice onto one deferred slice:

- **Ratings** (deferred B) depends on engagement completion — the deferred Slice A, not anything from Sprint 1–2.
- **Profile & Trust Signals** (deferred C) reads from both Account data (Sprint 1–2 A) and Rating data (deferred B).
- **Community Endorsement** (deferred D) touches Account signup (Sprint 1–2 A) and the applicant-pool sort built in Apply (Sprint 1–2 D).

**Practical guidance for whenever this scope is picked up:** the only pairing worth protecting is Engagement (A) following whoever built Apply; everything else can be chosen independently.

## Choosing a slice

_(Sprint 1–2's four slices already have owners — this is for whenever the
deferred scope above gets picked up.)_

Rough character of each, if you're deciding on interest rather than continuity:

- **Heaviest on state machines:** Applying & Selection (Sprint 1–2 D), Engagement Lifecycle (deferred A).
- **Heaviest on forms and validation:** Account Management (Sprint 1–2 A), Gig Posting (Sprint 1–2 B).
- **Heaviest on queries and algorithms:** Discovery & Search (Sprint 1–2 C) — geospatial radius queries and sort order.
- **Heaviest on timing/lifecycle logic:** Ratings & Reputation (deferred B) — the double-blind reveal has more edge cases than its point count suggests.
- **Mostly additive, least rework of existing code:** Community Endorsement (deferred D) — the three-tier applicant sort that gives an endorsement its effect is already built in Applying & Selection, so this slice mainly adds its own flows on top. Profile & Trust Signals (deferred C) is similar in shape: largely display logic over data other slices produce.
