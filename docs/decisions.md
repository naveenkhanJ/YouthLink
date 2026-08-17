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

## Code organisation

**Both `backend/src/` and `mobile/src/` are organised by module, not by layer** —
no top-level `routes/`, `controllers/` or `services/`. Reasoning:
[`../backend/src/README.md`](../backend/src/README.md), "Why modules, not layers".

**The backend uses ES modules, not CommonJS.** Converted 2026-08-17. Reasoning:
[`../AGENTS.md`](../AGENTS.md), under "Things that will bite you".

**Mobile navigation is React Navigation, not `expo-router`**, with per-module
screen manifests instead of a shared navigator file. Reasoning:
[`../mobile/src/navigation/README.md`](../mobile/src/navigation/README.md).
