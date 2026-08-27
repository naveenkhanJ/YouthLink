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
