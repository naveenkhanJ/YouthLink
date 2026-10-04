# Design decisions

**Why things are the way they are.** Read this when something in the code, the
schema or the requirements looks arbitrary, wrong, or like an oversight — it is
usually none of the three, and the reasoning is here.

**This is a reference, not a narrative.** Look things up; don't read it front to
back. [`product-overview.md`](product-overview.md) is the one to read in full.

**Most entries are pointers.** Where a decision's reasoning already lives next to
the thing it governs, this file says where rather than repeating it — a second
copy would drift. Reasoning is inline only when it has no other home.

**Add to this file when a decision turns out not to be written down anywhere.**
That is exactly how it came to exist: implementation work hit a schema design that
only made sense under an assumption recorded outside this repository.

---

## Accounts and registration

**Registration is a single atomic submission** — one endpoint, one screen. The
client completes Firebase phone verification, then submits every field together
with the resulting ID token. The backend creates one `User` row with
`accountStatus = ACTIVE`. Decided 2026-08-17. See FR-ACC-01.

**Signup was originally designed as multiple persisted steps, and no longer is.**
The original scope decision assumed phone verification was persisted before the
remaining fields were submitted, which created a real problem: an abandoned signup
would hold a phone number hostage under the uniqueness rule. That is why
`PENDING_SIGNUP`, `signupExpiresAt`, FR-ACC-06 and the partial index on
`User.phone` exist.

Once phone verification moved to Firebase (FR-ACC-08, amended 2026-08-15) and
registration became atomic, no row is created before the account is complete — so
nothing can be abandoned and nothing needs expiring. Those four artifacts are
retained rather than removed, because they become live again if signup is ever
split into stages. See FR-ACC-06's amendment note.

**Phone verification uses Firebase Phone Authentication, not our own OTP table**,
for signup and OTP login. `OtpCode` covers password reset, phone change and
dashboard admin login. Reasoning: FR-ACC-08's amendment note in
[`requirements.md`](requirements.md).

**NIC values are encrypted deterministically, not with a random IV.** This looks
wrong to anyone who knows cryptography and is deliberate — the unique index that
enforces FR-ACC-05 only fires if identical NICs produce identical ciphertext.
Reasoning: [`database-schema.md`](database-schema.md), under the `User` indexes.

**Authentication is a stateless JWT with a live per-request status check, and there
is no session table.** Reasoning: [`database-schema.md`](database-schema.md),
under Design Decisions.

**The password-lockout window (`lockedUntil`, FR-ACC-09/NFR-SEC-02) is enforced
only at the `/login/password` endpoint — never by the shared `requireAuth`
middleware.** An earlier draft of the cross-cutting auth contract in
[`module-ownership.md`](module-ownership.md) listed `lockedUntil` alongside
`accountStatus`/`suspendedAt` as something checked on every request, and the
middleware was briefly built that way. That was wrong: NFR-REL-02 (the
requirement the "check on every request" rule actually exists for) only concerns
suspension, and product-overview.md is explicit that "the OTP path is unaffected
by that lock." Enforcing `lockedUntil` globally meant a caller with **no
credentials at all** could fail someone's password 5 times and knock out that
user's already-authenticated sessions on every device — multiple simultaneous
logins are an explicit product decision (product-overview.md) — until they
specifically logged back in via OTP. Caught 2026-08-18, during self-review of
the first login implementation, and fixed on `feature/account-management-afham`
before that branch's login work was ever proposed for merge — the bug never
shipped to `develop`. **As of this entry, that fix is still only on that
branch, not yet in `develop`** — check whether it's landed before trusting
`requireAuth.js`'s current file content on whatever branch you're reading;
until it has, the file still carries the old, wrong doc comment this entry
just described. Full reasoning and the corrected contract:
[`module-ownership.md`](module-ownership.md)'s cross-cutting authentication
section.

**The password-lockout counter and lock state are read and written inside a
database transaction holding a row lock (`SELECT ... FOR UPDATE`), not
through Prisma's normal query methods alone.** This looks like an
unexplained departure from the rest of the codebase's pure-Prisma style,
and it is deliberate. An atomic single-statement update (Prisma's
`increment` operator, a conditional `updateMany`) makes *one write* safe
under concurrency, but not the *decision* that leads to it — "is this
account currently locked?", decided from a value read moments earlier,
can still go stale if a different, concurrent request changes the same
row in between. Caught via a `/code-review` pass on an earlier fix, then
confirmed live: a successful login's own lockout-clearing step could land
in the same instant as a different request's 5th failed attempt and
erase the lock that request had just set, bypassing the entire
15-minute lockout (FR-ACC-09/NFR-SEC-02) for free. `FOR UPDATE` forces
concurrent requests against the same account row to run one at a time
for the decide-and-write step, closing the gap structurally. Prisma's
query API has no equivalent to `FOR UPDATE`, which is why this drops to
raw SQL — the same justification as the migration's hand-written partial
indexes (see the `User` indexes note above): the abstraction genuinely
can't express this, not a style choice. See
`backend/src/modules/account/account.service.js`'s `loginWithPassword`
and `clearLockout` for the actual implementation.

## Requirements changed by user research (2026-08-27)

**Six requirements changed after the parallel UX module's user research was validated against this baseline.** Two added, four amended. Each carries a dated amendment note in [`requirements.md`](requirements.md) with the finding behind it; this entry records the ones whose reasoning is easy to mistake for an oversight.

**The endorser track record (FR-ENDORSE-11) is now private to the endorser.** It reads as a trust signal that ought to be public, and it is not. Research measured reputational risk as one of the top three reasons community members hesitate to vouch. A public score tying an endorser's standing to how their endorsed workers later behave makes that risk concrete and outside their control — and because the applicant-pool sort (FR-APPLY-04) only rewards endorsement when endorsements are plentiful, discouraging endorsers weakens the mechanic the trust model rests on. Same reasoning that keeps disputes away from endorsers. **The endorser's name is still public on each endorsement (FR-ENDORSE-10)** — that was never the deterrent. Since the figure is computed rather than stored, nothing in the schema enforces this; it is an API-layer constraint and therefore easy to leak by accident. See the note in [`database-schema.md`](database-schema.md) under `Endorsement`.

**FR-APPLY-12 deliberately has no "viewed" or "shortlisted" state**, even though the research recommended both. Neither has an employer action behind it in this system, so both would be states inferred from nothing — worse than silence, because they look like information.

**Application resolution was wired to one branch of four, and was rewired 2026-08-27. Don't put it back.** FR-APPLY-09 used to fire only when a posting reached Filled. That made it the sole automatic resolution path in the system, while the other three ways a posting can end — expiry, employer withdrawal, and a partially-filled posting that simply stalls — did nothing to Pending applications at all. Since complete fill is the least likely outcome for the population this product serves, the practical result was that most applications had no defined end.

Found while drafting FR-APPLY-12, whose first draft claimed a guarantee the lifecycle could not deliver. Rather than narrowing that requirement to describe the gap, three existing requirements were amended so the guarantee became true:

- **FR-APPLY-09** now fires whenever a posting stops accepting applications, by any route, not just Filled.
- **FR-POST-13** dropped its "zero filled slots" condition, so a stalled partially-filled posting can expire — closing only its unfilled slots, leaving existing Engagements running. It also now anchors one-off **Gigs** to the posting's own start date/time rather than a flat 30 days, because FR-POST-05 only requires a start 2 hours out, so a Gig posted Monday for Tuesday previously stayed live and applicable-to for another month after the work had happened. Part-time and Internship keep the 30-day window, since their start date opens an ongoing arrangement rather than setting a deadline — the same Gig-only scoping FR-ENG-13 already uses. **Priority raised Should → Must**, since it is now load-bearing for the guarantee rather than housekeeping.
- **FR-POST-12** gained an acceptance criterion making explicit that withdrawal resolves applicants, which it inherits from the above.

**The invariant to preserve:** a posting that stops accepting applications resolves its applicants, however it stopped. Any new posting end-state must satisfy it.

**`Endorsement.attributes` is optional and only selected values may ever be displayed.** Rendering unselected attributes — greyed out, or as a "not attested" list — would convert an optional field into a negative signal about the worker, which is the opposite of what an endorsement is for.

**An employer-set urgency flag was proposed by the research and rejected.** FR-POST-07 already states urgency is computed and "shall never be a manually set employer toggle"; the reasoning (a self-declared flag gets gamed for visibility until it means nothing) is in [`product-overview.md`](product-overview.md). The real finding behind the proposal — employers struggle to hire at short notice — is already served by automatic urgency plus the proactive push in FR-NOTIF-01. Recorded here because the same proposal will otherwise be made again.

**Several research recommendations described behaviour that already existed** and produced no change: reporting a listing before any engagement (FR-DISPUTE-01, FR-DISPUTE-03), endorsement withdrawal (FR-ENDORSE-07), the pre-submission listing preview (FR-POST-09), and saved listings (FR-DISC-06). Full per-item reasoning lives in the SPM project's reconciliation register, outside this repo.

## Amendment batch of 2026-08-27 — decisions with no other home

**Thirty-four amendments landed as one batch**, raised while writing screen specifications for every module. Most reasoning lives beside the amended requirement; the entries below are the ones that would otherwise look arbitrary.

**User-facing error messages are full sentences with terminal periods.** Two registers had shipped — Account/Posting's `Title is required.` versus Application's `Posting not found` — and the prototype cannot show both. The sentence register won: it is the majority of shipped strings and the warmer voice for a consumer product. The Application module's eight terse fragments change to match, with its owner's sign-off.

**Session lifetime is 30 days, and one behaviour covers every dead session.** `EXPIRES_IN = "30d"` was previously a fact only `jwt.js` knew. Expiry, `passwordChangedAt` rejection, and suspension all produce the same redirect-to-login with a neutral message — three triggers, one symptom, one screen.

**Checkpoint codes record failed attempts and never lock.** A worker mistyping at the kerb must not brick an arrival; a guesser must not be invisible. Per-checkpoint counters render in the Moderator's code-exchange history, turning brute-force attempts into evidence instead of prevention theatre. Codes deliberately never expire — an expiring arrival code strands a legitimately delayed worker.

**Email links land on minimal web pages, never mobile deep links.** The email-verification link (FR-ACC-14) opens a one-line confirmation page; the email password-reset link (FR-ACC-10) opens the reset form served on the web, token in the URL. Deferred deep-linking was already rejected once (FR-ENDORSE-02), app-link verification is real setup cost, and email is the fallback channel — the path used precisely when something already went wrong, which should have the fewest moving parts.

### Staff accounts — named limitation and runbook

> **Narrowed 2026-09-20 (openings O5, O6).** **Two of these four are no longer runbook items.** Deactivating a staff account and resetting a staff password now have flows on the Admin staff surface (`FR-ADM-06`, amended the same date), and a flow can do what SQL cannot: write an audit entry. The entry below is narrowed rather than deleted, because the limitation it names is still real for what remains, and because the reasoning is the record.

**No role-change or early-unlock flow exists, and no super-admin outranks another Admin.** Accepted deliberately at founding-team scale, the same treatment `NFR-REL-03` gives concurrent case review. The mitigations are direct database access plus the audit log — with the caveat that **SQL interventions are invisible to the audit log by construction**, which is why each one below must be recorded by hand as a dated line appended to this entry.

**Deactivation and password reset are no longer on this list.** Both are performed from the staff surface by an Admin, and both are recorded as `STAFF_ACCESS_REMOVED` and `STAFF_PASSWORD_RESET` in the audit log. Do **not** perform either by SQL now that a flow exists: doing so would lose the attribution the flow provides, which is the whole reason it was built.

The sanctioned procedures that remain (the only approved shapes — do not improvise variants):

- **Change a role:** `UPDATE "AdminAccount" SET role = 'ADMIN' /* or 'MODERATOR' */ WHERE phone = '<phone>';`
- **Unlock early:** `UPDATE "AdminAccount" SET "lockedUntil" = NULL, "failedLoginAttempts" = 0 WHERE phone = '<phone>';`

*Manual intervention log (append below, dated, with who ran it and why):*


## Amendment batch of 2026-09-16 — the error and offline pass (E1–E10)

Four decisions from that batch that are not requirement text and would otherwise live nowhere.

### The OTP validity window is ours, not Firebase's (E4)

`FR-ACC-01` promised a code *"valid for 5 minutes"* while `FR-ACC-08` recorded that Firebase's window is not configurable by us. **Three options were considered and two rejected.** Deleting the five minutes tells the user nothing. Quoting an *observed* Firebase value couples the product's copy to an undocumented third-party internal that can change without notice — the slower-acting version of simply inventing a number.

**Firebase does not publish a code's validity.** The figures commonly quoted — 30 seconds to 2 minutes — are `timeout_milliseconds` on `PhoneAuthOptions`, the Android **auto-retrieval** window, which is how long the SDK waits to read the SMS automatically. That is not the code's lifetime. The `auth/code-expired` error exists, so codes do expire, but the duration is a server-side detail Firebase does not document.

**So the application enforces its own, stricter window on top.** The client starts a timer when the code is sent; when it lapses the app invalidates the entry itself and offers Resend. *"Codes last 5 minutes"* becomes true because we make it true.

**The risk, stated so it is validated rather than assumed:** if our window is *longer* than Firebase's, the interface shows a live countdown for a code Firebase has already killed. **Ours must sit safely inside theirs**, and since theirs is undocumented that must be established by observation during Sprint work. The design degrades gracefully either way — if Firebase rejects first, the generic *"this code is no longer valid"* response still fires correctly.

### An in-progress posting is kept on the device, and that is not a draft feature (E9)

`NFR-USE-01` requires tolerance of connectivity loss; `FR-POST-15` says a posting is completed in one sitting. Both stand. What `FR-POST-15` rules out is **draft-and-save as a feature** — a server-side draft the user manages, returns to and lists. Keeping what someone just typed on their own device until they submit or discard it is not that: no server state, no draft list, no lifecycle, and nothing for another surface to read. The distinction is the decision; recording it here is what stops the two requirements reading as a contradiction again.

### Account recovery is bound to the requesting device (E8, ruling R1)

The approval of an account recovery grants a password reset **on the device that submitted the request**, identified by an install-scoped identifier the app generates on first run. It is not a hardware identifier and needs no permission.

**This is the security mechanism, not a convenience.** Without it an approved recovery is a bearer grant: anyone who reached the screen could set the password on an account an Admin had just judged recoverable. It is also the only delivery channel available — the path is defined by phone and email both being unreachable — and it is what lets the flow tell the requester an outcome without confirming to an unauthenticated stranger that an account with those details exists.

### Recovery submissions are purged after 90 days (E8, ruling R2)

A recovery request stores the NIC, legal name and birthdate the requester submitted, because the Admin adjudicates that claim and a **partial** match is the case that matters — a single "matched/did not match" flag cannot express it. The cost is that identity data about a person who may hold no account sits in the table. **Rejected and completed requests are therefore purged of those details after 90 days**, which bounds the exposure without removing what the Admin needs while the request is live.

---

## Code organisation

**Both `backend/src/` and `mobile/src/` are organised by module, not by layer** —
no top-level `routes/`, `controllers/` or `services/`. Reasoning:
[`../backend/src/README.md`](../backend/src/README.md), "Why modules, not layers".

**The backend uses ES modules, not CommonJS.** Converted 2026-08-17. Reasoning:
[`../AGENTS.md`](../AGENTS.md), under "Things that will bite you".

**Mobile navigation is React Navigation, not `expo-router`**, with per-module
screen manifests instead of a shared navigator file. Reasoning:
[`../mobile/src/navigation/README.md`](../mobile/src/navigation/README.md).

## Sprint planning

**Sprint 2 (19–22 August) continues Sprint 1's own four slices under the
same owners, rather than starting the four epics originally scheduled for
it.** Decided by the whole team with the client present. Sprint 1
(14–18 August) ended without completing its 33-story scope — two setup
days were lost and three infrastructure interruptions ate most of the
rest, leaving 3 of 33 stories Done (Lahiru's Gig Posting cards; 2 of
those 3 without frontend, kept as Done by a separate deliberate team
decision). No new stories were added for Sprint 2. The four epics
originally planned for Sprint 2 — Engagement Lifecycle, Ratings &
Reputation, Profile & Trust Signals, Community Endorsement — are
deferred, not dropped; see [`module-ownership.md`](module-ownership.md)'s
deferred-scope section, which is kept in full for whenever a future
sprint picks it up. Full detail — the specific infrastructure
interruptions, the Lahiru Gig Posting Done-without-frontend call — is in
the SPM project's own Scrum Events Log, outside this repo; this entry is
the short version so the reasoning has at least one record inside it.

## How we work from Sprint 3 (2026-09-25)

**The code is the ground truth for what is built.** Jira, progress notes, documents
and people's recollections all drift; the code on `develop` does not. So work
starts by establishing what the code contains, and where a card's status and the
code disagree, the code wins. This replaced the earlier line in
[`module-ownership.md`](module-ownership.md) that made Jira authoritative on
status. The evidence order is in [`workflow/agent-protocol.md`](workflow/agent-protocol.md) §2.

**UI must match the prototype specification exactly** (DoD clause 5, changed from
"functionally matches the wireframe"). The wireframes were approximate; the
prototype specification in [`prototype/`](prototype/README.md) now gives every
screen's components, tokens and copy, so there is nothing left to approximate.

**The end-to-end clause stays, and is recorded rather than enforced by blocking.**
Not everyone can build and run the app yet, so each pull request states its
end-to-end level (self, integration, pending) and a card reaches Done once it has
actually been run. See [`CONTRIBUTING.md`](../CONTRIBUTING.md#definition-of-done).

**No member's work waits on another member's.** Cross-module needs go through a
function the called module exposes, a no-op on the caller's side until it lands,
and a shared seed script. Only shared components come from one person. See
[`workflow/agent-protocol.md`](workflow/agent-protocol.md) §4.4.

**Enforcement is local, because server-side branch protection isn't available.**
Git hooks installed by `npm install`, agent refusals, and review. The hooks can be
bypassed on purpose; they exist to catch slips. See [`CONTRIBUTING.md`](../CONTRIBUTING.md#local-checks).

**Every endpoint requires sign-in unless it exists to sign someone in**, and role
checks follow each requirement's actor table. See the cross-cutting authentication
section of [`module-ownership.md`](module-ownership.md#cross-cutting-authentication).

**The workflow serves the person using it.** An agent following the protocol
declines to break the team's rules, but it records progress only in the
developer's own git-ignored `.worklog/` and never reports on them.

## Sprint 3 and 4 planning (2026-09-26)

**Checking the code before planning changed the plan.** Before scheduling Sprint 3, the actual content of every Sprint 1 branch was read directly — not assumed from Jira, from branch names, or from what anyone said. Result: Discovery+Notifications (Pawan) and Applying & Selection (Naveenkhan) are not unfinished, they are substantially complete and simply unmerged (`develop` had only the scaffold stub for both); Gig Posting's backend was already merged, and Lahiru's unmerged branch turned out to be almost entirely finished mobile screens. This reframed Sprint 3 from "build the core loop" to "merge and finish it" — a materially easier problem, and the plan changed because of what the check found, not despite it.

**The team will not close every remaining card, and said so rather than padding the backlog.** Of thirteen epics, one (Account) is solid, one (Gig Posting) is partial, two (Discovery+Notifications, Applying & Selection) have real code stuck unmerged, and eight have no code at all — Engagement Lifecycle, Ratings & Reputation, Profile & Trust Signals (beyond Account), Community Endorsement, Disputes & Reporting, Moderator Functions, Admin Functions, Dashboard Infrastructure. With the deadline at 8am on 4 October, spreading effort across all thirteen was rejected in favour of finishing what's closest to working. This is a deliberate scope cut, not a discovered shortfall — see `module-ownership.md`'s Sprint 3 and Sprint 4 sections for exactly what's in and what's explicitly left for a later release.

**Sprint 4 extends the loop rather than only polishing.** `Engagement` and `Rating` are already fully modelled in the schema, so completing the loop through to a rated engagement (a deliberately limited six-story subset of Engagement Lifecycle, plus all of Ratings & Reputation) was chosen over touching more epics thinly. The remaining eight Engagement stories (cancellation flows, re-confirmation, stalled handling) stay in the backlog on purpose.

**Scrum roles for Sprint 3–4: Lahiru (Scrum Master), Pawan (Product Owner)** — the two who had not yet held either role in Sprint 1–2 (Afham SM, Naveenkhan PO). Recorded in `workflow/team.json`'s `sprintRoles`. Module ownership is unaffected by Scrum role — who codes what stays as in the Owners table; SM/PO is a ceremony/backlog-facilitation role layered on top, not a substitute developer assignment.

## Sprint 4 role rotation — kept, not completed (2026-10-01)

**Flagged 2026-09-27, decided 2026-10-01.** The assignment requires every student to experience both Scrum Master and Product Owner at least once. With Sprint 3 closed and Sprint 4 starting, this was the last sprint where roles could still rotate. Two pairings would have completed the requirement for two of the four members — swapping to Lahiru (Product Owner) / Pawan (Scrum Master), which would have completed both roles for each of them since they held the opposite role in Sprint 3, or to Naveenkhan (Scrum Master) / Afham (Product Owner), which would have done the same for that pair since they held the opposite role in Sprint 1–2. The team chose instead to **keep the Sprint 3 pairing unchanged — Lahiru (Scrum Master), Pawan (Product Owner)** for Sprint 4.

**Recorded honestly: this means Afham (Scrum Master only, Sprint 1–2) and Naveenkhan (Product Owner only, Sprint 1–2) will not hold the other Scrum role at any point in this assignment.** This is a known gap against Component 2's "Role Rotation & Collaboration" rubric criterion (15% weight), not an oversight — it was raised explicitly before the decision was made. Worth having a ready, honest explanation for the presentation and at viva rather than letting it surface unexplained.

## Sprint 4 allocation — 6 points each, visible in the app (2026-10-01)

**Sprint 3 closed with every card complete and UI conformance done for all four members**, so no one could be left without Sprint 4 work, and Sprint 4 is only three days (1–3 October) before the 8am 4 October deadline. The allocation was planned twice the same day. The first pass gave each member 12 points; it was cut to **6 points each (24 in total)** as too high for three days, given Sprint 1 delivered 8 points for the whole team. Constraints: equal points for every member, every card something that shows up on screen rather than a backend-only change, and every card inside its owner's existing module so the git hooks need no `team.json` changes. The table is in `module-ownership.md`'s Sprint 4 section.

**What went back to the backlog, and why.** Engagement: YL-62/63 (check-in checkpoints) and YL-64 (needs a Disputes pipeline that doesn't exist) and YL-65 (verification-only). Ratings: YL-70/71, refinements of the core flow. Notifications: YL-157/161. Posting: YL-98 and YL-100. Account: YL-91, YL-82 and YL-90. The demo loop becomes engagements list, then End Engagement, then rating and reveal; Ratings is built against seeded data rather than waiting for Engagement, the same approach used for YL-174/175. **A known consequence:** YL-100 (posting expiry) is out, so the "a posting that stops accepting applications resolves its applicants" invariant is only partly true at the demo. YL-66's "something went wrong" route opens a dispute, which has no pipeline behind it, so that route is a marked stub.

## Agent protocol: explicit requests are the approval (2026-10-01)

**Two rules were stricter in practice than intended.** The intent was that the agent doesn't run commands like `git commit` or `git merge` on its own initiative, not that it refuses when the developer explicitly asks. `AGENTS.md` item 4 (and its copies), `docs/workflow/agent-protocol.md` §6, and related wording now say: don't run state-changing commands unprompted, but run them when the developer explicitly asks. The refusals in protocol §8.1 (commits or pushes to `develop`/`main`, force-push, `--no-verify`, and the rest) still apply whatever is asked.

**A Jira card may be moved to Done before its code is merged, on the developer's explicit request** (protocol §4.3). The request waives only Definition of Done clause 2 (the merge). Every other clause must still hold, and the card is recorded as "Done in Jira, not yet merged" so the merge still happens. `CONTRIBUTING.md`'s Definition of Done clauses themselves are unchanged.

## Account deleted screen has no header bar; unbuilt Settings rows say so (2026-10-02)

**Figma 1.17d draws the `Delete account` header bar above "Account deleted". The app does not.** The header is navigation chrome, and this screen is a dead end: the account no longer exists, the hardware back is swallowed, and the only way out is the "Back to the start" button. The bar's title also repeats what "Account deleted" says directly below it. Everything else in 1.17d (content padding, title, body, ctaBar) is built as drawn, with the status-bar inset added to the top padding. The Figma file was not changed. Decided with Afham after the first device run; the reasoning is also in the header comment of `AccountDeleteAccountScreen.js`.

**A Settings or Profile row whose screen is not in the build shows a short message instead of doing nothing.** "This isn't available in this version of the app yet." appears for 2.5 seconds (`components/Toast.js`, built from tokens; not drawn in Figma). The rows themselves stay, so the screens show the full drawn layout. A silent tap reads as a bug during a demo; hiding the rows would make the screens differ from the prototype.

## Found while running the Account module end to end (2026-10-02)

**The recovery device id is issued by the server, not generated by the app.** `FR-ACC-10`'s account recovery binds the outcome to the device that asked, using an unguessable identifier. The app first generated it with the platform's secure random source, which the development build did not provide, so no request could be submitted at all. The server now generates it (32 random bytes) when the request is received and returns it; the app keeps it in secure storage. The response is the same whether or not the details matched an account, so it still reveals nothing. A client-side fallback to a weaker random source was refused: a predictable id would let anyone read an outcome and set a new password once an Admin approves.

**`check-availability` is limited to 30 calls a minute per address.** The registration form needs the answer while it is filled in (`FR-ACC-05`), but unthrottled it lets anyone list registered phone numbers and emails in bulk. The limit is in process memory like the other account limiters (the API runs as one instance).

**An employer's "engagements completed" counts ended engagements too.** An engagement that ends (a part-time arrangement running its course) opens rating exactly like a completed one (`FR-ENG-12`), so excluding it made the count disagree with the ratings shown beside it. The line is singular for one ("1 engagement completed").

**First run is shown once.** The splash and three cards (`M0`) appear on the first launch only; the app remembers that they were seen in secure storage and every later signed-out launch opens at role selection (`1.1`), as `M0` says.

**Built after Sprint 4 for the demo, in addition to the Sprint 4 cards:** account deletion (YL-91), email change (YL-88), NIC correction (YL-87), employer posting-as at signup (YL-82) and its later change (YL-90), the user side of account recovery (YL-176, with a developer script standing in for the Admin screen) and the own-profile screen (YL-72, YL-73, YL-74). Reset by email from Change password (`1.11r1`–`1.11r4`) is carried by YL-85 as an amendment rather than a new card. The Account list above under "left in the backlog" is superseded by this.

## Launch splash on every launch; the Android system splash is styled, not removed (2026-10-02)

**The branded splash (`M0` `0.1`) is shown every time the app opens, not only on first run.** `M0` said the four first-run screens appear once, but the first device runs showed that on later launches the person saw only a split second of blue before role selection or the home shell, which read as a glitch. The splash now appears on every launch for at least two seconds (while the fonts load and the saved session is read; a tap moves on once the app is ready). The three onboarding cards are still shown once.

**The Android system splash cannot be switched off, so it is made to match instead.** From Android 12 the system always draws its own splash (the launcher icon on the window background, white by default) before any app code runs; an app cannot opt out. It is configured to the brand blue with the mark at the same size, dead centre, and held until the app's own splash has drawn its first frame, so the handoff looks like one screen: the mark stays still and the wordmark and tagline appear under it. This needs `expo-splash-screen` (a new dependency) and a new development build.

**The app icon is the brand mark.** Launcher icon, adaptive icon (white mark on the brand blue), monochrome icon and favicon are drawn from the same `Brand/Mark` vector as the in-app mark.

## Where a signed-out launch begins (2026-10-02)

**The first device runs showed a person who signed out and reopened the app landing on role selection, as if they had no account.** A signed-out launch now depends on what the device remembers (kept in secure storage, `auth/launchState.js`):

| Onboarding seen | Someone signed in here | A signed-out launch opens at |
| --- | --- | --- |
| no | no | the three onboarding cards, then role selection (`1.1`) |
| yes | no | role selection (`1.1`): nobody has signed in on this device, or their account was deleted |
| any | yes | **Log in (`1.6`) with the last number filled in**, whether they signed out themselves or the app ended their session |

A signed-in launch never reads this: the saved session opens the home shell, and a session the server has since ended is caught on the first request and sent to Log in with the notice. Signing in marks the onboarding as seen, because someone with an account has no use for the cards. **Deleting an account forgets the remembered number**, so the next launch starts at role selection, not at a Log in for an account that no longer exists. The splash is shown on every launch before any of this (see the entry above).

## Delete account: the password step's button is pinned (2026-10-03)

**Figma 1.17p draws "Delete my account" at the foot of the content, under a flexible spacer. The app pins it in a bottom action bar, like the other password and form screens.** With the keyboard open, the content-bound button ended 51 dp to 180 dp above the keyboard depending on the device, while every pinned bar in the app sits 24 dp above it. The inconsistency was visible on the test devices, so consistency won over the drawn position. Only this step changes: the first step (1.17, 1.17b and variants) has no keyboard and stays as drawn, and the account-deleted screen (1.17d) keeps its own deviation recorded above. Figma is unchanged.


## The tab bar is wired once, in `ShellTabBar`; an employer opens on My postings (2026-10-03)

**Each role's bottom tab bar navigates through one shared component, `mobile/src/components/ShellTabBar.js`, instead of every screen writing its own `onTabPress`.** A screen that sits on a tab (My postings, the Post a Gig form's first step, Profile) draws `<ShellTabBar active="…" />` as its last child. A tab whose module has registered a screen opens it; any other tab opens the Home shell on that tab with the prototype's own shell copy, until its module lands. The map from tab to route is the one object `ROUTE_BY_TAB`, so a module makes its hub reachable with one line and never edits `HomeScreen.js` or the navigator. A route that no module registered in the build is never navigated to.

**Home forwards an employer to My postings with `replace`.** My postings and the Post a Gig form draw `ShellTabBar`, so the employer lands on a screen with a working tab bar (Profile, Settings, Sign out), and Back leaves the app instead of returning to a placeholder. An earlier version forwarded before those screens drew the bar and left a dead end; it was withdrawn on 2026-10-03 and restored once they did. A tab bar elsewhere that opens the shell with a `tab` param other than `postings` is not forwarded. Forwarding applies only while `PostingList` is registered.
