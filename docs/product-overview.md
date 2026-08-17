# YouthLink — Product Overview

How YouthLink actually works, end to end. This document explains the mechanisms and the reasoning behind them; [`requirements.md`](requirements.md) states them normatively with acceptance criteria, and [`database-schema.md`](database-schema.md) maps them onto tables.

**Read this first if you're new to the project.** Several mechanisms here — the check-in code exchange, the endorsement bootstrap, the three-tier applicant sort, the double-blind rating reveal — are not things you'd guess from the UI or infer from the schema. Building against them without understanding why they exist is how they get quietly broken.

Requirement IDs are cited throughout in the form `FR-POST-07`. Look them up in [`requirements.md`](requirements.md) for the normative statement and acceptance criteria.

> **Canonical source.** This file is derived from the team's product decisions, maintained outside the repository. Don't change a mechanism by editing this file alone — raise it with the team so both stay in step.

---

## 1. The problem

A first-time worker with no track record can't get hired, because nobody has a reason to trust them. An employer can't safely hire a stranger for a few hours' work, because there's no reliable signal to go on. Existing options don't close that gap: word of mouth doesn't scale, unmoderated community groups carry no accountability, and corporate job portals are built for permanent hiring, not casual local work.

YouthLink's answer is a layered trust system — phone verification, real legal names, bidirectional ratings tied to genuinely completed engagements, and, for someone with no history at all, a vouch from a community member who actually knows them. Nothing here claims certainty it doesn't have. Each signal does one specific, limited job, and the product is deliberately honest about what isn't verified.

## 2. Who uses it

Five actors. Three are consumer-facing and self-selected at signup; two are internal.

| Actor                       | Surface       | What they do                                                                                                                                                                                     |
| --------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Youth Job-Seeker**        | Mobile        | Browses, applies to, and completes gigs, part-time jobs, and internships. Builds a rating history.                                                                                               |
| **Local Business/Employer** | Mobile        | Posts listings, reviews and selects applicants, manages engagements. Posts as an Individual/Household or as a Business.                                                                          |
| **Community Endorser**      | Mobile        | Vouches for a specific zero-history worker they personally know. Self-selected, no additional vetting. Called **Community Verifier/Endorser** in the requirements; `COMMUNITY_ENDORSER` in code. |
| **Moderator**               | Web dashboard | High-volume, lower-stakes work: triaging incoming disputes, reviewing flagged content, issuing warnings.                                                                                         |
| **Admin**                   | Web dashboard | Lower-volume, higher-stakes, harder-to-reverse actions: final dispute rulings, account suspension, posting removal.                                                                              |

Two structural points that catch people out:

**Admin and Moderator are not a signup role.** They're a separate permission tier on a separate surface, with separate accounts — see §10. A person who is both an Admin and a job-seeker has two distinct accounts (`FR-ADM-07`).

**Everyone must be 18 or over** (`FR-ACC-03`). This is enforced as a hard gate at signup against a self-declared birthdate. There is no guardian-consent path and no under-18 accommodation anywhere in the product — minors are excluded outright rather than partially supported.

---

## 3. Accounts and identity

### Signing up

Everything is collected in one sitting (`FR-ACC-01`). There is no partial-save.

| Field                | Rule                                                                                                                |
| -------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Role                 | One of the three consumer actors, chosen at signup                                                                  |
| Phone number         | Verified by a 6-digit OTP delivered through Firebase Phone Authentication (`FR-ACC-08`)                             |
| Password             | Hashed with bcrypt or argon2, never plaintext or reversibly encrypted (`FR-ACC-09`, `NFR-SEC-01`)                   |
| Email                | **Optional.** If given, verified once by a confirmation link. Registration isn't blocked if the link goes unclicked |
| NIC number           | Required. Stored as entered, **never verified** and never parsed — including for age (`FR-ACC-04`)                  |
| Birthdate            | Self-declared. Used solely for the 18+ gate                                                                         |
| Full legal name      | Required, 100 characters. Not a username or handle                                                                  |
| ToS / Privacy Policy | Single required checkbox, blocks registration until checked (`FR-ACC-19`)                                           |

An Employer additionally chooses, once, whether the account posts as **Individual/Household** or **Business** (`FR-ACC-02`). Choosing Business unlocks a business name (100 chars) and optional business bio (300 chars), both shown automatically on every posting from that account, never re-entered per listing (`FR-POST-16`).

**Nothing is collected speculatively.** Each field earns its place: the phone number is simultaneously the login credential, the contact revealed on selection, and a duplicate-account defence. The NIC exists so the data model already supports real identity verification if it's ever added, and so database uniqueness can stop one claimed identity registering twice. Email exists for exactly one scenario phone alone can't cover — a forgotten password during an SMS delivery failure.

### Why the NIC has no badge

The NIC is collected but never checked against anything. Accordingly, **no badge, label, or UI element anywhere may imply NIC verification has occurred** (`FR-PROF-02`). A verification signal that isn't real is worse than showing nothing. Only two things earn a visible badge: phone verification (a real OTP check, so every user has it) and business-name presence for Business-type employers.

### Logging in

Two **fully independent** paths (`FR-ACC-07`): phone + password, or phone + a freshly requested OTP (delivered through Firebase Phone Authentication). Neither is a fallback for the other. This matters because the two failure modes — a forgotten password and an SMS delivery problem — are largely uncorrelated, so keeping both first-class is what actually buys resilience. Don't implement one as a degraded path off the other.

Five consecutive failed password attempts locks the password path for 15 minutes (`NFR-SEC-02`). The OTP path is unaffected by that lock.

Multiple simultaneous logins are allowed with no session-invalidation logic. A user may be signed in on several devices at once.

### Changing account details

| Change                     | Gate                                                                                                               |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Password                   | Current password + new password. No OTP, no email — the user is already authenticated (`FR-ACC-11`)                |
| Password reset (forgotten) | OTP to phone is primary; an email reset link is available only if an email was provided and verified (`FR-ACC-10`) |
| Phone number               | Password re-entry, then OTP verification **on the new number** before it takes effect (`FR-ACC-12`)                |
| NIC                        | Password re-entry only. No verification step — the field was never verified to begin with (`FR-ACC-13`)            |
| Email                      | New address must be confirmed by link **before** it replaces the old one (`FR-ACC-14`)                             |
| Display name               | Editable freely, no special gate (`FR-ACC-15`)                                                                     |
| Posting-as type            | Switchable in Settings; adds or removes the business fields accordingly (`FR-ACC-16`)                              |

Two details that are easy to implement wrongly:

**The phone swap is atomic.** The old number stays under the uniqueness constraint until the new number's OTP is confirmed. There must be no window where both are valid, or neither is.

**A changed posting-as type does not rewrite history.** Existing postings keep the poster-type they were published under (`FR-ACC-16`). Only future postings reflect the change.

**If neither phone nor a verified email is reachable, self-service password reset is a genuine dead end.** This is a named limitation, not something quietly handled. Don't build an automated workaround.

All of the above lives on **one Settings screen** (`FR-ACC-18`), together with notification preferences and account deletion — not scattered across separate places.

### Abandoned signups

Registration is a single atomic submission (`FR-ACC-01`): the phone is verified through Firebase on the device, then every field is submitted together and one complete account is created. **Because nothing is persisted before that, there is no such thing as a half-finished signup holding a phone number hostage.**

This was not always the design. Signup was originally staged, with phone verification persisted first — which is why `FR-ACC-06`, `PENDING_SIGNUP` and the partial index on phone still exist. See [`decisions.md`](decisions.md).

### Deleting an account

Gated behind password re-entry, and **blocked entirely while any Engagement is still active** (`FR-ACC-17`, `NFR-REL-04`). Someone disappearing mid-engagement would strand the other party with no route to resolution.

On deletion, the user's own identifying data is removed, but **engagement history is preserved under an anonymised reference** (`NFR-PRIV-03`). Ratings that person gave and received stay intact. One person leaving must never corrupt someone else's earned reputation.

### Duplicate accounts

One account per NIC, one per verified phone, one per verified email (`FR-ACC-05`). This closes off the laziest form of duplicate-account creation. It does not stop a determined actor with a second SIM and a different real NIC, and it isn't claimed to.

### Profiles

A profile is visible **only in the context of a specific interaction** (`FR-PROF-05`) — an applicant's profile while an employer reviews applications, an employer's profile while a worker views their listing. There is deliberately **no browsable directory of users**, because one would enable targeted harassment for no functional gain.

A profile shows: legal name (`FR-PROF-01`), verification badges (`FR-PROF-02`), the free-text bio (300 chars, `FR-PROF-03`), and trust signals — average rating and completion rate where history exists, or "New to YouthLink" plus an endorsement badge if endorsed (`FR-PROF-06`).

The bio does double duty: it **pre-fills the note on every application** the worker submits, editable per application without changing the stored bio (`FR-PROF-04`). Both caps are 300 characters precisely so the bio can never overflow the note it populates.

---

## 4. Posting work

### The posting form

Fields, in order (`FR-POST-01`):

1. **Title** — 80 characters
2. **Description** — 1000 characters
3. **Task category** — dropdown from a fixed allow-list, never free text (`FR-POST-02`)
4. **Arrangement type** — Gig (one-off), Part-time job (ongoing), or Internship
5. **Pay** — format determined by arrangement type (below)
6. **Location** — precise address, entered as a map pin
7. **Workers needed** — 1 to 20, defaults to 1 (`FR-POST-06`)
8. **Start date/time** — must be **at least 2 hours out**; submission is blocked, not warned, if violated (`FR-POST-05`)

Part-time and Internship postings additionally require a **Schedule** field — free text, 200 characters, e.g. "Mon–Fri, 4–8pm" (`FR-POST-03`). A single start time says nothing about a recurring pattern. Gig postings don't need it.

### The category allow-list, and why it's closed

Allowed: retail/shop assistant, delivery and errands, event setup, moving and manual labour, food service, tutoring, cleaning.

Excluded outright: childcare, eldercare, or any work involving unsupervised access to someone who can't protect or consent for themselves; professionally licensed work (medical, legal, financial advice); anything matching a known scam pattern or anything illegal.

The reasoning matters, because it explains why free-text categories are not an option: a system-level constraint on what's postable is enforceable by a very small team, whereas after-the-fact moderation of open posting is not. The childcare exclusion specifically exists because real background verification doesn't exist in this build.

Note what is deliberately **not** excluded: cash-handling retail work. That's a property-trust risk between two consenting adults, which the rating and endorsement systems exist to manage — categorically different from risk to an unsupervised vulnerable third party.

### Pay

Format follows arrangement type (`FR-POST-04`):

- **Gig** → a fixed total
- **Part-time job** → a rate, per day/week/month
- **Internship** → Unpaid, Stipend, or Paid

Pay is always stated — there are no "negotiable" postings. Currency is always LKR, with no selector anywhere (`NFR-LOC-04`).

**The stated figure is per worker, not split across slots.** On a 3-worker posting at Rs 3000, each selected worker earns Rs 3000.

### What the system computes, and the employer cannot set

**Urgency** (`FR-POST-07`) is derived purely from whether the start time falls within 24–48 hours of posting. There is no employer-facing toggle, and there must never be one — a self-declared urgency flag would be gamed for visibility until it meant nothing. Urgency is recomputed whenever the start time is edited (`FR-ENG-10`).

**Public location precision** (`FR-POST-08`). The precise address is stored but never shown publicly. Browsing and applying workers see a coarse, suburb-level area on a map. Full precision is released only to a worker who has actually been selected, and only to them.

A **review screen** before submission shows every entered field plus these two computed values as non-editable previews (`FR-POST-09`).

### After submission

The posting goes live as **Open**, and notification fan-out fires immediately (`FR-POST-10`) — see §11.

Lifecycle:

| State         | Meaning                                                            |
| ------------- | ------------------------------------------------------------------ |
| **Open**      | Filled slots < workers needed; still accepting applications        |
| **Filled**    | Every slot has a selected worker; no longer accepting applications |
| **Withdrawn** | Employer closed it before any slot filled (`FR-POST-12`)           |
| **Expired**   | 30 days elapsed with zero filled slots (`FR-POST-13`)              |

Status is computed from the fill count, not set manually (`FR-POST-18`). If a filled slot's Engagement is later cancelled or ended early, **that one slot reopens** and the posting returns to Open for it — every other Engagement on the posting is untouched.

**Admin-removed postings** (`FR-ADM-05`) also take the Withdrawn state. The requirements don't name a status for removal; this is an implementation choice, made so the dashboard keeps filtering on four states rather than five. What distinguishes an Admin removal from an employer's own withdrawal is the audit-log entry, not the posting row — see [`database-schema.md`](database-schema.md).

Fill status displays plainly throughout — "2 of 3 filled" (`FR-POST-14`).

**Editing** (`FR-POST-11`): unrestricted before any slot fills. After a slot fills, a _material_ change requires the affected worker's re-confirmation; a _minor_ change doesn't. See §6.

**No drafts.** A posting is completed in one sitting or not submitted (`FR-POST-15`).

**No-applicant nudge** (`FR-POST-17`): an employer whose posting has zero applicants is nudged at 24 hours for a regular gig, or at the halfway point between posting and start time for an urgent one.

---

## 5. Finding work

**Radius browsing** (`FR-DISC-01`) starts at 5km and auto-expands in 5km steps up to 50km if fewer than 5 results come back. The expansion presents as one continuous loading operation, not a visible sequence of separate waits (`NFR-PERF-03`).

**Location permission can be denied**, so a manual area/city selector is required, not optional (`FR-DISC-02`).

**Filters:** task category and arrangement type, alongside radius (`FR-DISC-03`). **Keyword search** does simple matching against title and description (`FR-DISC-04`).

**Sort order** (`FR-DISC-05`): urgent postings first, then nearest first. Recency and pay (high to low) are alternate options the user can switch to. Proximity beats recency by default because this is a local platform and transport is a real constraint for the target user.

**Saved gigs** (`FR-DISC-06`) must stay retrievable even after the posting drops out of active browse results.

**Filters are session-only** (`FR-DISC-07`). Radius, category, and sort reset on app restart. Don't persist them.

---

## 6. Applying, selection, and the engagement lifecycle

### Applying

A worker viewing a listing sees title, description, category, arrangement type, pay, general area, start time, urgency, fill status, and the employer's trust signals (`FR-APPLY-01`).

Tapping Apply opens a single confirmation screen (`FR-APPLY-02`) showing the note that will be sent — pre-filled from the profile bio, editable for this application, capped at 300 characters, and entirely skippable. One application per worker per posting.

A Pending application can be **withdrawn** any time before selection or decline, and the worker can **reapply** while the posting is still Open (`FR-APPLY-03`).

### The applicant pool sort — three tiers, not one ranked list

This is the mechanism that gives endorsement its actual value, so it's worth getting exactly right (`FR-APPLY-04`):

1. **Applicants with rating history** — sorted by average rating descending, completion rate as tiebreaker
2. **Zero-history applicants with an active endorsement** — grouped together beneath tier 1
3. **Zero-history applicants with no endorsement** — at the bottom

An endorsed newcomer does not out-rank someone with a genuine track record, but does out-rank an unendorsed newcomer. That's precisely the gap the endorsement bootstrap exists to close.

There is **no cap** on applicants per posting (`FR-APPLY-11`).

### What the employer sees — and deliberately doesn't

Per applicant (`FR-APPLY-05`): display name, rating average and completion rate if they have history, or "New to YouthLink" plus the endorsement badge if endorsed, their note, and phone-verified status. Actions are Select and Decline.

**Individual dispute or case history is never shown.** It stays aggregate-only, folded into the rating and completion-rate figures. Some disputes resolve inconclusively, and a visible incident count would stigmatise someone over something never proven. The foreign keys make this join trivial — don't do it. Full case history is visible to Admin and Moderator only (`FR-DASH-02`).

### Selection

An employer can select multiple applicants across one or more sessions, up to the number of workers needed. **Each selection spawns one independent Engagement** (`FR-APPLY-06`).

Selection triggers **contact reveal** (`FR-APPLY-07`), which is bidirectional: both phone numbers become mutually visible, since both parties need to coordinate arrival and payment. The precise address becomes visible to that one selected worker alone. On a multi-slot posting, reveal happens per Engagement at each worker's own selection moment — not once for everyone.

An employer may **decline** an applicant explicitly at any point, even with slots still open, which notifies them immediately (`FR-APPLY-08`). Any applicant still Pending when the posting reaches Filled gets an automatic not-selected notification (`FR-APPLY-09`). No reason or feedback is attached to a decline.

If the employer makes a material change while applications are still Pending, those applicants are notified so they can withdraw if the new terms don't suit (`FR-APPLY-10`).

### The Engagement is the unit of work

An **Engagement** is one specific worker's relationship to one posting. A 3-slot posting supports three simultaneous, fully independent Engagements. Every per-worker mechanism — check-in codes, contact reveal, cancellation, material-change re-confirmation, End Engagement, rating — is scoped to the Engagement, never to the posting (`FR-ENG-04`). One worker's dispute, cancellation, or failed code exchange has **no effect** on the others.

### Check-in codes

Three checkpoints, each with its own 6-digit, single-use code that is not valid at any other checkpoint (`FR-ENG-01`):

| Checkpoint     | Who holds the code | Who enters it | What it protects against                        |
| -------------- | ------------------ | ------------- | ----------------------------------------------- |
| **Arrival**    | Employer           | Worker        | A false no-show claim against the worker        |
| **Completion** | Employer           | Worker        | A false "work not completed" claim              |
| **Payment**    | **Worker**         | **Employer**  | A false "never paid" claim against the employer |

The holder deliberately **flips** at the payment step. The party best positioned to falsely deny something holds the code the other party needs. Getting this backwards defeats the entire mechanism.

**Unpaid internships skip the payment checkpoint entirely** (`FR-ENG-02`) — there is nothing to confirm payment of. Stipend and Paid internships keep all three.

This confirms payment _occurred_, not that the _amount_ was right — the stated pay figure is the reference point for an amount dispute. And it's cooperative, so it's not bulletproof: either party can refuse to share or enter a code. That's what the fallback is for.

**"Unable to confirm"** is available at any checkpoint and routes into dispute resolution rather than leaving the engagement stuck (`FR-ENG-03`).

### Cancelling before work starts

**Regular engagements** (`FR-ENG-05`): cancellation is a _request_ to the other party, not a unilateral action. It requires a reason from a fixed list — schedule conflict, details no longer suitable, found other work, personal or family emergency, other. The other party has **48 hours** to accept or reject; no response auto-resolves against whoever didn't respond. A cancellation inside 24 hours of start is classified **Late**.

**Urgent engagements** (`FR-ENG-06`): immediate effect, **no approval window** — a 48-hour window is meaningless on a gig starting in 24. Still requires a reason. Late threshold scales down to 6 hours.

Late cancellations weigh more heavily against the completion-rate stat than early ones (`FR-ENG-07`).

Cancellation is scoped to one Engagement: it reopens that one slot and leaves every other Engagement untouched (`FR-ENG-08`).

### Changing an engagement's terms

**Material** — pay, start date/time, location, workers needed, or task category. Requires the selected worker's **active re-confirmation**; if they don't accept, that Engagement routes into the cancellation flow (`FR-ENG-09`).

**Minor** — title or description text only. No re-confirmation; nothing the worker committed to has changed.

On a multi-slot posting, **every currently-selected worker re-confirms independently** (`FR-ENG-11`). One worker declining routes only their own Engagement to cancellation. Unfilled slots simply show the updated terms to new applicants.

### Ending a part-time engagement

A part-time job has no fixed end date to trigger completion, so either party can trigger **End Engagement** once the arrangement has actually started (`FR-ENG-12`). Before it starts, it's a cancellation instead.

The sequence: End Engagement → "did something go wrong?" → **yes** opens a dispute before anything else happens; **no** proceeds straight to rating. The other party is notified immediately either way. No minimum duration is enforced — ending very soon after starting is simply a visible data point in the completion stats.

### Stalled engagements

For **one-off Gigs only** (`FR-ENG-13`, `NFR-REL-01`): if the completion checkpoint is still unresolved 24 hours after the posting's start time, both parties get an automatic "Did this happen?" prompt. After a further 7 days of total silence, the engagement is auto-flagged to Admin.

The trigger is anchored to **start** time because no end time or duration is collected anywhere in the posting flow. The accepted trade-off is that a Gig genuinely running longer than 24 hours gets a slightly early prompt — harmless, since neither party is obliged to act.

Part-time and Internship engagements are excluded; they close through End Engagement instead.

---

## 7. Ratings and reputation

**Scale:** 1 to 5 whole stars. No half-stars, and no free-text review attached to the rating itself (`FR-RATE-01`).

**Double-blind reveal** (`FR-RATE-02`): neither party sees the other's rating until both have submitted, or 14 days pass from the moment rating became eligible — whichever comes first. This removes the incentive to wait and retaliate after seeing a bad rating. The 14-day timer runs from eligibility, not from submission, so it still resolves when one party never submits at all.

**One independent rating pair per Engagement** (`FR-RATE-04`). A 3-slot gig produces three separate exchanges, each revealed on its own timeline.

**Completion rate is a separate statistic** (`FR-RATE-03`, `FR-ENG-07`), never folded into the star rating. Rating captures quality — was the work good. Completion rate captures reliability — did they show up and follow through. Conflating them destroys both signals.

**Cancelled engagements** can still be rated, but rating is not enforced or prompted the same way (`FR-RATE-05`) — there's less to meaningfully assess when work never happened.

**Disputing a rating** (`FR-RATE-06`) is deliberately lightweight and **entirely separate from the dispute pipeline in §9**. The rated party can attach a **public response** shown alongside the rating — self-service, no Admin involvement. Outright removal is reserved for clear policy violations (a rating on an engagement that never happened, for instance) and goes **directly to Admin**, never through Moderator triage. Ordinary disagreement with a negative-but-accurate rating is not grounds for removal.

---

## 8. Community endorsement

The mechanism that lets a worker with zero history be trusted at all.

**Eligibility is exact and permanent** (`FR-ENDORSE-05`): zero completed, rated Engagements. The window closes the moment a worker's first rating lands and **never reopens**, even if their history somehow returns to zero. This is a one-time newcomer bootstrap, not a recurring benefit.

**Becoming an endorser** requires only selecting that role at signup — no vetting beyond the standard 18+ rule (`FR-ENDORSE-01`).

### Two entry points — neither is stranger-matching

The entire justification for endorsement is that the endorser _personally knows_ the worker. The app must never introduce two people who've never met.

**Worker-initiated** (`FR-ENDORSE-02`) — for someone not yet on the app. The eligible worker has one persistent 6-character code, visible on their own profile, shareable through the phone's native share sheet. The recipient installs the app through the ordinary app-store link — no deferred deep-linking, no tracked links — signs up, selects the endorser role, and enters the code. The system re-checks the worker is still eligible before accepting the vouch.

**Endorser-initiated** (`FR-ENDORSE-03`) — for someone already on the app. A registered endorser searches by phone number. If an eligible zero-history worker matches, they vouch directly, no code needed.

**The failed-search response must be generic.** "No eligible match found" is returned identically whether no account exists or an account exists but isn't eligible (`FR-ENDORSE-03`). Distinguishing them would let anyone confirm whether a given phone number has an account. Don't leak that difference through response shape, error code, or timing.

### The vouch itself

A single action — "I vouch for this person" — plus an optional reason capped at 300 characters (`FR-ENDORSE-04`). It goes **live immediately**, with no Admin pre-review; the reporting mechanism is the backstop if one is abused.

**Revocable but not retroactive** (`FR-ENDORSE-07`): revoking stops future display but doesn't undo a hire that already happened while it was live.

**Uncapped** (`FR-ENDORSE-08`) — any number of endorsers may vouch for the same worker.

**One endorsement covers every application** the worker makes while still zero-history (`FR-ENDORSE-06`). It is not per-gig.

**Always displayed as a named badge** (`FR-ENDORSE-10`) with the endorser's real name attached. An anonymous vouch carries no social weight and would be meaningless.

### Endorser track record

Displayed as "N endorsed, M went on to build a good rating" (`FR-ENDORSE-11`), where **N** is the endorser's currently-active, non-revoked endorsements and **M** is the subset whose worker now has at least one completed rated Engagement and a current average of **4.0 or higher**.

This figure is **live and recalculated, never a stored snapshot.** If an endorsed worker's average later drops below 4.0, they drop out of M. A freshly-endorsed worker who hasn't earned a rating yet simply doesn't count toward M. A cached value would quietly become misleading, which defeats its purpose as a trust signal.

### Nudges

Three one-time prompts, aimed at the people least likely to discover these mechanisms unaided:

- **Bio prompt** (`FR-ENDORSE-13`) — shown once to a zero-history worker with no bio, after signup or before their first application. Not shown again once the bio is filled or they have rating history.
- **Endorsement suggestion** (`FR-ENDORSE-14`) — shown once after 3 applications with no selection, with a direct link into the endorsement flow.
- **Code-entry prompt** (`FR-ENDORSE-15`) — a newly-registered endorser is asked "Have a code to enter?" during or immediately after signup, rather than having to find it in a menu.

---

## 9. Reports, disputes, and moderation

### Reporting

A Report action is available on listings, profiles, and within an active engagement (`FR-DISPUTE-01`). It requires a reason from a fixed list — fraud/scam, inappropriate content, safety concern, harassment, other — plus optional detail.

**The reporter is anonymous to the reported party, permanently** (`NFR-PRIV-05`).

**Thresholds** (`FR-DISPUTE-02`): one report queues for Moderator review and hides nothing — a single report is far too easy a vector for taking down a rival's listing. **Three independent reports** (three distinct reporters) auto-hide the content pending review.

A discovered false birthdate is filed as an ordinary report and routed to Admin, resulting in suspension — there's no correction path, because the person isn't eligible for the platform at all (`FR-DISPUTE-06`).

### The four ways a dispute case opens

1. **"Unable to confirm"** at any check-in checkpoint (`FR-ENG-03`)
2. **"Yes"** to "did something go wrong?" during End Engagement (`FR-ENG-12`)
3. **Auto-flagged stalled engagement** — system-initiated, no party raises it (`FR-ENG-13`)
4. **A Report** reaching the Moderator queue — may not be tied to any Engagement (`FR-DISPUTE-03`)

### Before review

Whichever party didn't raise the issue gets **48 hours** to respond and attach evidence (`FR-DISPUTE-04`). If they don't, review proceeds on whatever exists — the window gates progression, it doesn't block resolution.

**Evidence** (`FR-DISPUTE-05`): up to 3 images, 5MB each, from either party. Entirely optional — a no-show has nothing to photograph — and its absence never blocks review.

### Stage 1 — Moderator triage

The Moderator sees case type, both parties' evidence, the engagement's code-exchange history (itself evidence: which codes were entered, by whom, and when), and both parties' verification badges and history (`FR-MOD-01`).

Two outcomes: **close with a warning** for a minor or first-time issue, or **escalate to Admin** for anything needing real authority.

Separately from any specific case, a Moderator can review flagged listings and profiles as **routine triage** (`FR-MOD-04`) — content auto-hidden by the three-report threshold lands in the queue to be reviewed and acted on directly, without a dispute case existing.

**Warnings have teeth** (`FR-MOD-02`): three warnings against the same party within a **rolling 90 days** auto-escalates to Admin for suspension review. It's a trailing window, not a lifetime count.

Either role may **request clarification** mid-review from either party, with its own 24-hour window, before deciding (`FR-MOD-03`). This exists to rescue cases that would otherwise land as "inconclusive" for want of one obvious follow-up question.

### Stage 2 — Admin ruling

Three outcomes, not two (`FR-ADM-01`): ruled for the party who raised it, ruled for the other party, or **inconclusive**. Forcing a decision the evidence doesn't support would be worse than an honest "can't determine."

**A ruling is final. There is no appeals mechanism** (`NFR-OPS-04`).

**What a ruling can actually change** (`FR-ADM-02`): since no money ever moves through the app, a payment-dispute ruling is a **reputational and record-keeping outcome only**. Admin cannot issue a refund or force a transaction. It affects the responsible party's completion-rate stat, and repeat or severe cases can lead to suspension.

**Effect on rating** (`FR-ADM-08`): if the ruling establishes the engagement genuinely happened and was completed, the normal double-blind rating step opens. If it establishes a confirmed no-show — it didn't happen at all — the rating step is **skipped entirely**; the reliable party gets a positive completion-rate credit, the unreliable party a negative mark, and the case closes.

Admin aims to resolve escalated cases within **3–5 business days** — an operational target, not a system-enforced rule (`NFR-OPS-03`).

### Suspension and removal

**Suspension takes effect immediately** (`FR-ADM-03`, `NFR-REL-02`) — on the account's very next request, not at next login. A suspended account can't apply, post, or endorse.

**Suspension does not cascade.** Existing, already-agreed Engagements with uninvolved parties are **not** auto-cancelled — they resolve normally through completion, cancellation, or dispute. Voiding them would punish someone who did nothing wrong.

**Posting removal** (`FR-ADM-05`) stops new applications but does **not** void Engagements already in progress on that posting. Those continue to normal resolution unless the violation is severe enough to warrant reviewing them individually through the normal dispute process.

---

## 10. Admin and Moderator operations

### Why two tiers

Moderator handles volume; Admin handles consequence. Splitting them costs nothing when the same people hold both roles, but means the permission model doesn't need retrofitting when junior moderation help arrives without full account-termination power.

Moderator **cannot** remove a posting, suspend an account, or issue a final ruling. Those are Admin-only, with Moderator escalating (`NFR-SEC-05`).

### Accounts

Admin/Moderator accounts are **entirely separate** from any consumer account for the same person (`FR-ADM-07`) — not a flag on a `User` row. This avoids edge cases like an Admin account applying to its own posting.

**Bootstrapping** (`FR-ADM-06`) is two-phase, because of a genuine chicken-and-egg problem: the first Admin accounts are created by **direct backend assignment**, since no in-app "grant admin" feature can exist before an Admin does. Once one exists, an Admin can promote an already-registered user from the dashboard.

### The dashboard

All case _handling_ is web-dashboard-only. All case _creation_ stays on mobile (`FR-DASH-05`) — reporting, "unable to confirm", and "did something go wrong?" are ordinary user actions. There is no admin functionality in the mobile app at all.

**Dashboard login requires password AND OTP together** (`FR-DASH-06`, `NFR-SEC-04`) — not the either-or choice mobile users get. One dashboard account carries access to every user's NIC and every dispute's evidence, which is a materially higher-value target.

What both roles can see:

- **Every posting on the platform** (`FR-DASH-01`), searchable and filterable by status, category, arrangement type, employer, and date — regardless of whether it was ever reported. This is what lets a problem be spotted before someone reports it.
- **Any user account** (`FR-DASH-02`) — verification status, rating and completion history, endorsement activity given or received, and **full case history** including resolved disputes and accumulated warnings. This is an explicit, stated exception to the no-directory rule, justified by the oversight function.
- **The case queue** (`FR-DASH-03`) — case type, parties, evidence from each side, timestamps, and status. A new case notifies Admin/Moderator.
- **Metrics** (`FR-DASH-04`) — active users by actor type, postings by status, completed engagements, open queue depth, average dispute resolution time, platform-wide average rating and completion rate, endorsement activity, and a category breakdown. Exportable in a basic format (`NFR-OPS-02`).

### Audit logging — note the asymmetry

Every Admin **and Moderator** action is logged (`NFR-SEC-06`). The full log is visible to **every Admin account**, not just the one who acted — the point is internal accountability, not personal record-keeping.

**Moderators cannot access the audit log at all** (`NFR-OPS-01`). This is deliberate and differs from the shared read access they have to postings and user records. This breadth of visibility is only defensible _because_ it's paired with that accountability.

**Known accepted limitation:** there is no case-locking, so two Admins could review the same case simultaneously (`NFR-REL-03`). At founding-team scale with low case volume this is handled by talking to each other, not by engineering.

---

## 11. Notifications

| Trigger                                                                                       | Recipient         | Default     |
| --------------------------------------------------------------------------------------------- | ----------------- | ----------- |
| Urgent gig posted within radius (`FR-NOTIF-01`)                                               | Youth Job-Seeker  | **Opt-in**  |
| Non-urgent gig posted within radius (`FR-NOTIF-02`)                                           | Youth Job-Seeker  | **Opt-out** |
| New application received (`FR-NOTIF-04`)                                                      | Employer          | Always      |
| Selected / declined / not-selected (`FR-NOTIF-04`)                                            | Youth Job-Seeker  | Always      |
| Material change, End Engagement, stalled prompt (`FR-NOTIF-05`)                               | Affected party    | Always      |
| New dispute case (`FR-NOTIF-06`)                                                              | Admin / Moderator | Always      |
| Endorsement received (`FR-ENDORSE-09`); endorsement paid off (`FR-ENDORSE-12`, `FR-NOTIF-07`) | Worker; Endorser  | Always      |
| No-applicant nudge (`FR-POST-17`)                                                             | Employer          | Always      |

**Urgent pushes are rate-limited to 5 per user per day** (`FR-NOTIF-01`). Beyond that, further matching urgent gigs are batched into a single digest. An unthrottled burst risks someone disabling notifications entirely, which loses the feature permanently rather than just for that day.

Both toggles live in a Notification Preferences section of Settings (`FR-NOTIF-03`).

**Urgent and regular notifications use distinct platform channels or priority levels** (`FR-NOTIF-10`) — a dedicated Android channel, iOS time-sensitive delivery — so they _feel_ different on arrival, not merely once opened.

**In-app notification history** (`FR-NOTIF-08`) keeps a chronological log so nothing is lost to a dismissed push.

**Denying OS notification permission must not break anything** (`FR-NOTIF-09`). No push is delivered, but the event still appears in the history screen — the user checks manually instead of being told proactively.

---

## 12. Privacy and data handling

- **NIC numbers are encrypted at rest, visible to Admin only, and masked back to the entering user** as the last 4 digits after initial entry (`NFR-SEC-03`).
- **PDPA-aligned baseline protections** are implemented; full PDPA compliance is a stated future commitment, not built (`NFR-PRIV-01`).
- **No general user directory** (`NFR-PRIV-04`), with the stated Admin/Moderator exception.
- **Reporter identity is never disclosed** (`NFR-PRIV-05`).
- **Deletion preserves engagement history anonymised** (`NFR-PRIV-03`).
- **Usage analytics must be aggregate and anonymised only** (`NFR-PRIV-06`). Nothing may be collected that allows re-identifying an individual user's behaviour. This is a prohibition, not merely an absence of a requirement — do not add per-user behavioural event tracking. It is entirely distinct from the operational metrics dashboard, which is platform-operations data.
- **Data retention** is a documented intention only; no automated retention policy is built (`NFR-PRIV-02`).

---

## 13. Deliberate constraints and exclusions

Each of the following was considered and excluded on purpose. Re-adding one is a product decision, not a gap to fill.

| Not built                                                     | Why                                                                                                                                      |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| In-app payment, escrow, commission                            | Money changes hands entirely outside the app                                                                                             |
| Permanent/full-time job postings                              | The trust loop needs a bounded engagement with a completion moment to rate                                                               |
| Users under 18                                                | Excluded outright rather than accommodated with guardian consent                                                                         |
| Real KYC / Police Clearance verification                      | Requires an external paid vendor relationship                                                                                            |
| Admin review of identity/verification documents (`FR-ADM-04`) | Has nothing to review — there is no KYC/PCC layer in this build. The NIC field exists so this can be added later without a schema change |
| Skill-matching taxonomy                                       | The category allow-list plus free-text bio already do this job                                                                           |
| Draft/save-for-later postings                                 | Adds state-management complexity most employers won't need                                                                               |
| In-app messaging                                              | Contact happens via revealed phone number                                                                                                |
| Profile photos                                                | Adds moderation surface for marginal trust gain                                                                                          |
| Reason attached to a decline                                  | Real complexity, marginal benefit                                                                                                        |
| Block-user feature                                            | The interaction surface is narrow enough that reporting covers it                                                                        |
| Application cap                                               | Trust-tier sort and notes make a large pool manageable                                                                                   |
| Appeals process                                               | Not warranted for a three-outcome ruling system at this scale                                                                            |
| Formal accessibility compliance (WCAG, screen readers)        | Acknowledged limitation                                                                                                                  |
| Sinhala/Tamil localisation                                    | Real planned scope for a later phase, not merely aspirational; English-only currently (`NFR-LOC-01`, `NFR-LOC-02`)                       |

**Two accommodations that _are_ built,** chosen as a better fit for the target population than formal accessibility compliance:

- **Offline tolerance** (`NFR-USE-01`) — already-loaded listings stay viewable without connectivity, even though posting and applying need a live connection.
- **Low data usage** (`NFR-USE-02`) — small images, minimal heavy assets.

A static **Help/FAQ** section explains check-in codes, endorsement, and dispute resolution (`NFR-USE-03`) — the three mechanisms a first-time user will not intuit from the interface.

The **internal dashboard stays English-only permanently** (`NFR-LOC-03`); it's staff tooling.

---

## 14. Performance targets

| Target                                                              | Threshold                                                                  |
| ------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Direct-manipulation feedback, no network round-trip (`NFR-PERF-01`) | 0.1s                                                                       |
| Common actions with a round-trip (`NFR-PERF-02`)                    | 1s target, loading indicator past 1s, 3s ceiling                           |
| Radius auto-expansion (`NFR-PERF-03`)                               | One continuous operation, 10s, then progress indicator with option to stop |
| Uptime (`NFR-PERF-04`)                                              | 99.9% stated target                                                        |

The system is built to scale horizontally with **no hard-coded concurrent-user ceiling** (`NFR-PERF-05`).
