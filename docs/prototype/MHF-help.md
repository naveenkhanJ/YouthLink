# MHF — Help and FAQ

Five screens: an index and four explanations. They satisfy `NFR-USE-03`, which asks for static help content
rather than a support channel — **nothing here is interactive beyond navigating to a page and back.**

The four pages exist because four mechanisms in this product are not guessable from the interface that
uses them. A check-in code, an endorsement, a dispute and a lockout all behave in ways a user would
otherwise have to infer from a failure. Each page is the same shape: a title, a lead paragraph, three
steps, and a footnote carrying the thing people get wrong.

**Every step is one text node with two styled runs** — a `mobile/secondary-medium` lead-in, then an
em-dash and the explanation in `mobile/secondary`. The node itself has no text style, because the style
lives on each run; that is what the `· run` lines under each `step` record. Setting `characters` on such a
node collapses the whole string to the first run's style, which turns a paragraph into a solid block of
Medium — it happened once on `HF.5` and once already on `HF.2`, so **edit the runs, never the whole
string.**

Read `README.md` first for the notation, and `design-system.md` for the tokens and components.

---

### `HF.1` — Help index

**Reached from** [M1](M1-account.md) `1.10`, and the logged-out screens  ·
**Leads to** `HF.2`, `HF.3`, `HF.4`, `HF.5`  ·  **Exits** back → history

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Help"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 12
    TEXT intro 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "How YouthLink's key mechanisms work."
    FRAME row-How check-in cod 328x52 [FILL/HUG] · horizontal pad 14 gap 8 · fill color/bg/default · r8
      TEXT rowLabel 285x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "How check-in codes work"
      VECTOR Vector 7x14 [FIXED/FIXED] · stroke color/text/secondary 1.8
    FRAME row-How endorsement  328x52 [FILL/HUG] · horizontal pad 14 gap 8 · fill color/bg/default · r8
      TEXT rowLabel 285x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "How endorsement works"
      VECTOR Vector 7x14 [FIXED/FIXED] · stroke color/text/secondary 1.8
    FRAME row-How disputes are 328x52 [FILL/HUG] · horizontal pad 14 gap 8 · fill color/bg/default · r8
      TEXT rowLabel 285x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "How disputes are resolved"
      VECTOR Vector 7x14 [FIXED/FIXED] · stroke color/text/secondary 1.8
    FRAME row-How to get back in 328x52 [FILL/HUG] · horizontal pad 14 gap 8 · fill color/bg/default · r8
      TEXT rowLabel 285x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "How to get back into your account"
      VECTOR Vector 7x14 [FIXED/FIXED] · stroke color/text/secondary 1.8
```

**The rows are plain frames, not a component**, because a 52-tall label-and-chevron row appears nowhere
else in the product. Their layer names are truncated in Figma — `row-How endorsement ` keeps its trailing
space and `row-How check-in cod` is cut mid-word. **Reproduce the names exactly**: the prototype's wiring
resolves controls by layer name, so a tidied name is a broken link.

**Help is reachable while signed out.** That is the point of `HF.5` — someone locked out of their account
cannot read a help page that requires being in it.

### `HF.2` — How check-in codes work

**Reached from** `HF.1`  ·  **Leads to** nothing  ·  **Exits** back → history

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Check-in codes"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 12
    TEXT pageTitle 328x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "How check-in codes work"
    TEXT lead 328x100 [FILL/HUG] · fill color/text/primary · mobile/secondary · "A gig has three checkpoints — an unpaid internship has two, with no payment step. Each one is confirmed by a short code — one person shows it, the other types it in. Nothing is marked done because someone simply said so."
    TEXT step 328x60 [FILL/HUG] · fill color/text/primary · (no style) · "Arrival — the employer shows a code when the worker gets there, and the worker enters it. That is what records that they turned up."
      · run mobile/secondary-medium "Arrival"
      · run mobile/secondary " — the employer shows a code when the worker gets there, and the worker enters it. That is what records that they turned up."
    TEXT step 328x80 [FILL/HUG] · fill color/text/primary · (no style) · "Completion — the employer shows a second code once the work is finished, and the worker enters that one too. It should only be shared when the work is genuinely done."
      · run mobile/secondary-medium "Completion"
      · run mobile/secondary " — the employer shows a second code once the work is finished, and the worker enters that one too. It should only be shared when the work is genuinely done."
    TEXT step 328x80 [FILL/HUG] · fill color/text/primary · (no style) · "Payment — this code belongs to the worker. It appears once completion has been confirmed, and they share it only after they have been paid. The employer entering it is the receipt."
      · run mobile/secondary-medium "Payment"
      · run mobile/secondary " — this code belongs to the worker. It appears once completion has been confirmed, and they share it only after they have been paid. The employer entering it is the receipt."
    TEXT footnote 328x140 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "The code is always held by whoever can honestly say the thing happened, so confirming a checkpoint takes both people. If one cannot be confirmed, either side can open a dispute from the engagement, and the record of which codes were entered — and when — goes to the moderator with it."
```

**Who holds each code is the whole mechanism.** Arrival and completion are the employer's to show; payment
is the worker's, and only appears after completion. A design that let one party hold all three would let
them mark the gig complete alone, which is exactly what `FR-MOD-01` exists to prevent.

**"An unpaid internship has two"** is not an aside — the payment checkpoint is absent, not skipped, when
there is no payment. Build the checkpoint count from the engagement type.

### `HF.3` — How endorsement works

**Reached from** `HF.1`  ·  **Leads to** nothing  ·  **Exits** back → history

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Endorsement"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 12
    TEXT pageTitle 328x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "How endorsement works"
    TEXT lead 328x80 [FILL/HUG] · fill color/text/primary · mobile/secondary · "Someone new has no ratings, and no ratings means no work — which is how they stay new. An endorsement lends them somebody else's standing until they have their own."
    TEXT step 328x120 [FILL/HUG] · fill color/text/primary · (no style) · "Who can vouch — someone registered as a Community Verifier who actually knows the person — a former teacher, a neighbour, someone they have worked for. They vouch using the person's endorsement code, or by searching their phone number."
      · run mobile/secondary-medium "Who can vouch"
      · run mobile/secondary " — someone registered as a Community Verifier who actually knows the person — a former teacher, a neighbour, someone they have worked for. They vouch using the person's endorsement code, or by searching their phone number."
    TEXT step 328x120 [FILL/HUG] · fill color/text/primary · (no style) · "What it shows — the endorsement appears on the profile and beside the name in an employer's applicant list, naming the voucher and the traits they vouched for. Employers see applicants ordered by trust: rating history first, then endorsed, then new."
      · run mobile/secondary-medium "What it shows"
      · run mobile/secondary " — the endorsement appears on the profile and beside the name in an employer's applicant list, naming the voucher and the traits they vouched for. Employers see applicants ordered by trust: rating history first, then endorsed, then new."
    TEXT step 328x120 [FILL/HUG] · fill color/text/primary · (no style) · "When it ends — the chance to be vouched for closes the moment the person receives their first rating: no one new can vouch for them, by code or by phone search, and their own record comes first from then on. Endorsements they already have stay on their profile."
      · run mobile/secondary-medium "When it ends"
      · run mobile/secondary " — the chance to be vouched for closes the moment the person receives their first rating: no one new can vouch for them, by code or by phone search, and their own record comes first from then on. Endorsements they already have stay on their profile."
    TEXT footnote 328x80 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "A voucher can revoke an endorsement at any time, and the person is told. An endorsement is a starting push, not a guarantee — it never overrides what someone's own ratings say."
```

**"No ratings means no work — which is how they stay new"** is the cold-start problem stated plainly, and
it is the reason the whole endorsement mechanism exists. The lead is the product's argument, not filler.

**The chance to be vouched for closes on the first rating — not the endorsements already given.** That is
a state transition to build, not a policy to remember: `FR-ENDORSE-05`'s eligibility window ends at the first
rating, so the code and the phone search must both refuse new vouches after it, while existing endorsements
keep showing (`FR-ENDORSE-10`, as amended 2026-09-24 — M1 `1.18n` shows Nethmi's two beside her twelve
ratings). Until 2026-09-24 the page said the endorsement itself closed, and that a voucher could withdraw
only *before it closes*; neither was true.

**Who can vouch** is *someone registered as a Community Verifier*, not "a verified member of the community":
`FR-ENDORSE-01` puts no vetting on the role beyond the 18+ gate, so "verified" promised a check that does not
exist. **Revoking** uses the product's one verb, and *the person is told* is now backed by `ENDORSEMENT_REVOKED`.

### `HF.4` — How disputes are resolved

**Reached from** `HF.1`  ·  **Leads to** nothing  ·  **Exits** back → history

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Disputes"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 12
    TEXT pageTitle 328x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "How disputes are resolved"
    TEXT lead 328x100 [FILL/HUG] · fill color/text/primary · mobile/secondary · "A dispute is for when a checkpoint cannot be agreed — an arrival that was never confirmed, or a payment code that was never entered. It is a review of the record rather than an argument between two people."
    TEXT step 328x80 [FILL/HUG] · fill color/text/primary · (no style) · "Opening one — either side can open a dispute from the engagement. The other side has 48 hours to give their account; if they do not, the review goes ahead without it."
      · run mobile/secondary-medium "Opening one"
      · run mobile/secondary " — either side can open a dispute from the engagement. The other side has 48 hours to give their account; if they do not, the review goes ahead without it."
    TEXT step 328x100 [FILL/HUG] · fill color/text/primary · (no style) · "What the moderator sees — both statements, any photo attached as evidence, and the code-exchange history — which codes were entered and at what time. A code that was never entered is evidence in itself."
      · run mobile/secondary-medium "What the moderator sees"
      · run mobile/secondary " — both statements, any photo attached as evidence, and the code-exchange history — which codes were entered and at what time. A code that was never entered is evidence in itself."
    TEXT step 328x140 [FILL/HUG] · fill color/text/primary · (no style) · "The decision — a moderator may ask one clarifying question, which pauses the case for 24 hours, and can then close it with a warning on the account at fault or escalate it to an Admin. Once escalated the moderator can no longer act, the Admin's ruling is final, and both sides are told the outcome."
      · run mobile/secondary-medium "The decision"
      · run mobile/secondary " — a moderator may ask one clarifying question, which pauses the case for 24 hours, and can then close it with a warning on the account at fault or escalate it to an Admin. Once escalated the moderator can no longer act, the Admin's ruling is final, and both sides are told the outcome."
    TEXT footnote 328x80 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "Every action is written to the audit log under the name of the person who took it. Three warnings on one account within 90 days escalate automatically for a suspension review."
```

**Four numbers here are requirements, not copy:** 48 hours to respond, one clarifying question, a 24-hour
pause, and three warnings in 90 days. They appear again in [M9](M9-disputes.md) and
[M10](M10-moderation.md), and they must agree.

**"Once escalated the moderator can no longer act"** is an authorisation rule. `FR-ADM-01` makes the
Admin's ruling final, and the moderator's controls are genuinely inert afterwards rather than merely
styled as such.

### `HF.5` — How to get back into your account

**Reached from** `HF.1`, and the logged-out screens  ·  **Leads to** nothing  ·  **Exits** back → history

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Account access"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 12
    TEXT pageTitle 328x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "How to get back into your account"
    TEXT lead 328x60 [FILL/HUG] · fill color/text/primary · mobile/secondary · "Four different things stop you signing in, and they have different ways out. This page is the difference between them."
    TEXT step 328x100 [FILL/HUG] · fill color/text/primary · (no style) · "Too many password attempts — your password is paused for 15 minutes. Sign-in locks after 5 wrong passwords in a row. Only the password is paused: “Log in with a code instead” still works, and it is the fastest way back in."
      · run mobile/secondary-medium "Too many password attempts"
      · run mobile/secondary " — your password is paused for 15 minutes. Sign-in locks after 5 wrong passwords in a row. Only the password is paused: “Log in with a code instead” still works, and it is the fastest way back in."
    TEXT step 328x80 [FILL/HUG] · fill color/text/primary · (no style) · "You've forgotten your password — tap “Forgot password?”. We send a reset code to your phone, or a reset link to your email if you added and confirmed one."
      · run mobile/secondary-medium "You've forgotten your password"
      · run mobile/secondary " — tap “Forgot password?”. We send a reset code to your phone, or a reset link to your email if you added and confirmed one."
    TEXT step 328x140 [FILL/HUG] · fill color/text/primary · (no style) · "Your phone and email no longer reach you — tell us on the Forgot password screen. We will ask for your NIC, legal name and birthdate, and a YouthLink Admin checks them against the account before restoring your access. The outcome appears in the app on this device, so keep it installed."
      · run mobile/secondary-medium "Your phone and email no longer reach you"
      · run mobile/secondary " — tell us on the Forgot password screen. We will ask for your NIC, legal name and birthdate, and a YouthLink Admin checks them against the account before restoring your access. The outcome appears in the app on this device, so keep it installed."
    TEXT step 328x120 [FILL/HUG] · fill color/text/primary · (no style) · "Your account was suspended — this is not a lockout. Suspension is a decision made by YouthLink staff after reports or warnings, it takes effect straight away, and it cannot be lifted by signing in again. Any engagements you had already agreed are not cancelled by it."
      · run mobile/secondary-medium "Your account was suspended"
      · run mobile/secondary " — this is not a lockout. Suspension is a decision made by YouthLink staff after reports or warnings, it takes effect straight away, and it cannot be lifted by signing in again. Any engagements you had already agreed are not cancelled by it."
    TEXT footnote 328x80 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "The first two assume your phone or email still reaches you. Changing your number in Settings while you can still sign in is far easier than recovering the account afterwards."
```

**This page carries four steps where the others carry three**, because there are four distinct causes and
conflating any two of them strands someone. A suspended account and a locked one look identical from the
sign-in screen and have nothing in common underneath: one is a 15-minute pause a code login walks straight
past, the other is a staff decision no amount of signing in will change.

**"The outcome appears in the app on this device"** is why `AccountRecoveryRequest` binds a device. There
is no reachable phone or email by definition in that case, so the device is the only delivery channel the
product has — see [M1](M1-account.md) `1.8rec1`–`1.8rec4`.

---

## States not drawn in this module

| State | Build it as |
| --- | --- |
| A help page while offline | not drawn, and not needed: this content is static and should be bundled with the app rather than fetched |
| A search across help | not built. Four pages do not need search, and `NFR-PRIV-04` has no bearing here |
| Any fifth topic | a scope question rather than a drawing one — these four are the mechanisms `NFR-USE-03` names |
