# YouthLink — Module Ownership & Sprint Scope

Who builds what, and exactly which requirements each slice covers. Every module is a **vertical slice**: one person owns it end to end, backend and frontend together, rather than the work being split into a backend team and a frontend team.

## About this document

**Jira remains the system of record for status.** This document is the stable reference for _scope and ownership_ — what a slice contains and who owns it. Day-to-day progress, status transitions, and assignment changes live on the board, and cards still get moved as work progresses. If the two ever disagree about status, Jira is right.

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

| Sprint | Slice | Module                                            | Stories | Points | Owner          |
| ------ | ----- | ------------------------------------------------- | ------- | ------ | -------------- |
| 1      | A     | Account Management                                | 8       | 17     | **Afham**      |
| 1      | B     | Gig Posting                                       | 8       | 18     | **Lahiru**     |
| 1      | C     | Discovery & Search + core Notifications           | 7       | 15     | **Pawan**      |
| 1      | D     | Applying & Selection                              | 10      | 20     | **Naveenkhan** |
| 2      | A     | Engagement Lifecycle                              | 5       | 13     | _TBD_          |
| 2      | B     | Ratings & Reputation                              | 5       | 9      | _TBD_          |
| 2      | C     | Profile & Trust Signals + remaining Notifications | 5       | 9      | _TBD_          |
| 2      | D     | Community Endorsement                             | 5       | 10     | _TBD_          |

**Sprint 1 owners are confirmed. Sprint 2 is not yet assigned** — update this table and the per-slice headings once the team decides.

Use the same short name as your branch-name segment, so ownership and git history line up: `afham`, `lahiru`, `pawan`, `naveenkhan` (see [`CONTRIBUTING.md`](../CONTRIBUTING.md)).

### What these slices do and don't cover

The eight slices below schedule **53 of the 129 functional requirements**. The remaining 76 are real, specified requirements — they simply aren't scheduled into these two sprints. They cover disputes and reporting, Moderator and Admin functions, the shared dashboard, and the lower-priority remainder of each module, and they're elaborated closer to the sprint that picks them up rather than up front.

So: if a requirement isn't listed here, it hasn't been dropped. Check [`requirements.md`](requirements.md) — everything is specified there regardless of when it's scheduled.

---

## Sprint 1 — the core loop: post → discover → apply → select

Together these four slices make the first increment demoable end to end: an Employer posts a gig, a Youth Job-Seeker discovers it, applies, and gets selected.

**33 stories, 70 points.**

### Slice A — Account Management

**Owner:** **Afham** · **8 stories, 17 points** · Epic: `FR-ACC`

Registration, OTP verification, both login paths, the 18+ age gate, duplicate-account prevention, password security, and ToS acceptance. Auth flows, form validation, session handling.

| Requirement                                                                                                                             | Priority | Pts | Implementation tasks                                                                                                                                                |
| --------------------------------------------------------------------------------------------------------------------------------------- | -------- | --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [FR-ACC-01 — Account registration](requirements.md#fr-acc-01--account-registration)                                                     | Must     | 5   | – Build registration API endpoint with field validation<br>– Wire OTP verification into the signup flow<br>– Build multi-field registration screen (Expo)           |
| [FR-ACC-03 — Age gate](requirements.md#fr-acc-03--age-gate)                                                                             | Must     | 1   | – Add age-gate validation to registration API<br>– Add under-18 error state to registration screen                                                                  |
| [FR-ACC-04 — NIC field handling](requirements.md#fr-acc-04--nic-field-handling)                                                         | Must     | 1   | – Wire NIC field into the registration form (no external verification call)<br>– Confirm age-gate logic reads only birthdate, never NIC                             |
| [FR-ACC-05 — Duplicate account prevention](requirements.md#fr-acc-05--duplicate-account-prevention)                                     | Must     | 2   | – Add duplicate-value check to registration API with field-level error messaging                                                                                    |
| [FR-ACC-07 — Login](requirements.md#fr-acc-07--login)                                                                                   | Must     | 3   | – Build password-login API endpoint<br>– Build OTP-login API endpoint<br>– Build login screen offering both paths                                                   |
| [FR-ACC-08 — OTP mechanism](requirements.md#fr-acc-08--otp-mechanism)                                                                   | Must     | 2   | – Build shared OTP generation/expiry service (6-digit, 5-minute validity)<br>– Wire the OTP service into signup, login, phone-change, and password-reset call sites |
| [FR-ACC-09 — Password security](requirements.md#fr-acc-09--password-security)                                                           | Must     | 2   | – Add bcrypt/argon2 hashing to password storage<br>– Add failed-attempt counter and 15-minute lockout logic                                                         |
| [FR-ACC-19 — Terms of Service and Privacy Policy acceptance](requirements.md#fr-acc-19--terms-of-service-and-privacy-policy-acceptance) | Must     | 1   | – Add ToS/Privacy Policy checkbox and linked pages to the signup flow<br>– Add submit-blocking validation when the checkbox is unchecked                            |

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

| Requirement                                                                                                             | Priority | Pts | Implementation tasks                                                                                                                |
| ----------------------------------------------------------------------------------------------------------------------- | -------- | --- | ----------------------------------------------------------------------------------------------------------------------------------- |
| [FR-DISC-01 — Radius-based browsing](requirements.md#fr-disc-01--radius-based-browsing)                                 | Must     | 3   | – Build radius-based browse query (geospatial)<br>– Add auto-expansion logic (5km steps to 50km)<br>– Build browse results screen   |
| [FR-DISC-02 — Manual location fallback](requirements.md#fr-disc-02--manual-location-fallback)                           | Must     | 2   | – Build manual area/city selector UI<br>– Wire fallback path when location permission is denied                                     |
| [FR-DISC-03 — Category and arrangement-type filters](requirements.md#fr-disc-03--category-and-arrangement-type-filters) | Should   | 2   | – Add category/arrangement-type filter UI<br>– Wire filters into the browse query, combinable with radius                           |
| [FR-DISC-05 — Sort order](requirements.md#fr-disc-05--sort-order)                                                       | Must     | 2   | – Build default sort logic (urgent-first, then nearest-first)<br>– Add alternate sort options (recency, pay high-to-low)            |
| [FR-NOTIF-01 — Urgent gig push notifications](requirements.md#fr-notif-01--urgent-gig-push-notifications)               | Must     | 3   | – Build urgent-push trigger on posting submission<br>– Add 5/day rate limit with digest batching beyond that<br>– Wire opt-in check |
| [FR-NOTIF-02 — Non-urgent gig notifications](requirements.md#fr-notif-02--non-urgent-gig-notifications)                 | Must     | 2   | – Build non-urgent notification trigger on posting submission<br>– Wire opt-out check                                               |
| [FR-NOTIF-03 — Notification preferences](requirements.md#fr-notif-03--notification-preferences)                         | Must     | 1   | – Build Notification Preferences UI (both toggles)<br>– Wire toggles to user-preference storage                                     |

### Slice D — Applying & Selection

**Owner:** **Naveenkhan** · **10 stories, 20 points** · Epic: `FR-APPLY`

The apply flow, the three-tier applicant sort, Employer selection, bidirectional contact reveal, decline and automatic not-selected. A multi-actor state machine plus the sort that gives endorsement its value.

| Requirement                                                                                                                                       | Priority | Pts | Implementation tasks                                                                                                                     |
| ------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | --- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| [FR-APPLY-01 — Listing detail view](requirements.md#fr-apply-01--listing-detail-view)                                                             | Must     | 2   | – Build listing detail screen<br>– Wire Employer trust-signal display (badges, business name)                                            |
| [FR-APPLY-02 — Apply action](requirements.md#fr-apply-02--apply-action)                                                                           | Must     | 3   | – Build apply-confirmation screen with pre-filled, editable note<br>– Build apply API with duplicate-application block and Pending state |
| [FR-APPLY-03 — Application withdrawal](requirements.md#fr-apply-03--application-withdrawal)                                                       | Should   | 2   | – Add withdraw action to the application API<br>– Add withdraw UI and reapply path                                                       |
| [FR-APPLY-04 — Applicant pool sort order](requirements.md#fr-apply-04--applicant-pool-sort-order)                                                 | Must     | 3   | – Build three-tier applicant-pool sort algorithm<br>– Add completion-rate tiebreaker logic                                               |
| [FR-APPLY-05 — Employer applicant view](requirements.md#fr-apply-05--employer-applicant-view)                                                     | Must     | 2   | – Build Employer applicant-list view<br>– Wire trust-signal and note display, excluding individual case history                          |
| [FR-APPLY-06 — Selection and Engagement creation](requirements.md#fr-apply-06--selection-and-engagement-creation)                                 | Must     | 3   | – Build Select action and Engagement-creation logic<br>– Support multi-session selection up to workers-needed                            |
| [FR-APPLY-07 — Contact reveal on selection](requirements.md#fr-apply-07--contact-reveal-on-selection)                                             | Must     | 2   | – Build contact-reveal logic on selection (bidirectional phone numbers)<br>– Wire precise-address reveal to the selected worker only     |
| [FR-APPLY-08 — Explicit decline](requirements.md#fr-apply-08--explicit-decline)                                                                   | Should   | 1   | – Add Decline action with immediate applicant notification                                                                               |
| [FR-APPLY-09 — Automatic not-selected notification](requirements.md#fr-apply-09--automatic-not-selected-notification)                             | Must     | 1   | – Add auto-notify-on-Filled logic for remaining Pending applicants                                                                       |
| [FR-APPLY-10 — Pending-applicant notification on material change](requirements.md#fr-apply-10--pending-applicant-notification-on-material-change) | Should   | 1   | – Add material-change notification trigger for Pending applicants                                                                        |

---

## Sprint 2 — extending the loop through to completion

These four extend the loop past selection to a completed, rated engagement — including the endorsement mechanism that differentiates the product.

**20 stories, 41 points.**

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

**Owner:** _TBD_ · **5 stories, 10 points** · Epic: `FR-ENDORSE`

The Community Verifier/Endorser role, both endorsement entry points (shareable code and phone search), the vouch action, and the permanently-closing eligibility window. (The requirements call this actor _Community Verifier/Endorser_; the schema calls the same role `COMMUNITY_ENDORSER`.) Two entry flows and careful eligibility checks.

| Requirement                                                                                                                             | Priority | Pts | Implementation tasks                                                                                                                                                                     |
| --------------------------------------------------------------------------------------------------------------------------------------- | -------- | --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [FR-ENDORSE-01 — Verifier role selection](requirements.md#fr-endorse-01--verifier-role-selection)                                       | Must     | 1   | – Add Verifier role option to signup role selection                                                                                                                                      |
| [FR-ENDORSE-02 — Worker-initiated endorsement entry point](requirements.md#fr-endorse-02--worker-initiated-endorsement-entry-point)     | Must     | 3   | – Build endorsement-code generation (6-character, persistent)<br>– Build code display + OS share-sheet integration<br>– Build code-entry and eligibility validation on the Verifier side |
| [FR-ENDORSE-03 — Verifier-initiated endorsement entry point](requirements.md#fr-endorse-03--verifier-initiated-endorsement-entry-point) | Must     | 3   | – Build Verifier phone-search API<br>– Build the generic "no eligible match" response (no info leak)<br>– Build search UI for the Verifier                                               |
| [FR-ENDORSE-04 — Vouch action](requirements.md#fr-endorse-04--vouch-action)                                                             | Must     | 2   | – Build vouch-submission action with optional reason field<br>– Wire immediate live display, no pending-review state                                                                     |
| [FR-ENDORSE-05 — Eligibility window](requirements.md#fr-endorse-05--eligibility-window)                                                 | Must     | 1   | – Wire eligibility-close trigger to the first-rating event (FR-RATE-02)                                                                                                                  |

---

## How the slices relate across sprints

**There is exactly one hard technical dependency.** Sprint 2's **Engagement Lifecycle** (Slice A) is built directly on the Engagement record that Sprint 1's **Applying & Selection** (Slice D) creates — the Employer's Select action is what spawns it. Whoever builds Apply in Sprint 1 carries the most context into Engagement in Sprint 2, so that pairing is a sensible default, but it isn't mandatory.

Beyond that, the couplings are weaker and don't map one Sprint 1 slice onto one Sprint 2 slice:

- **Ratings** (Sprint 2 B) depends on engagement completion — Sprint 2's own Slice A, not anything from Sprint 1.
- **Profile & Trust Signals** (Sprint 2 C) reads from both Account data (Sprint 1 A) and Rating data (Sprint 2 B).
- **Community Endorsement** (Sprint 2 D) touches Account signup (Sprint 1 A) and the applicant-pool sort built in Apply (Sprint 1 D).

**Practical guidance:** pick Sprint 1 slices freely. For Sprint 2, the only pairing worth protecting is Engagement (A) following Apply (D); everything else can be chosen independently.

## Choosing a slice

Rough character of each, if you're deciding on interest rather than continuity:

- **Heaviest on state machines:** Applying & Selection (S1 D), Engagement Lifecycle (S2 A).
- **Heaviest on forms and validation:** Account Management (S1 A), Gig Posting (S1 B).
- **Heaviest on queries and algorithms:** Discovery & Search (S1 C) — geospatial radius queries and sort order.
- **Heaviest on timing/lifecycle logic:** Ratings & Reputation (S2 B) — the double-blind reveal has more edge cases than its point count suggests.
- **Mostly additive, least rework of Sprint 1 code:** Community Endorsement (S2 D) — the three-tier applicant sort that gives an endorsement its effect is already built in Sprint 1 Slice D, so this slice mainly adds its own flows on top. Profile & Trust Signals (S2 C) is similar in shape: largely display logic over data other slices produce.
