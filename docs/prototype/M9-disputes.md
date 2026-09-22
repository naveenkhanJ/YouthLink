# M9 — Disputes

Thirteen screens covering two different things that both end at a moderator: **reporting a posting**
(`9.1`, `9.1d`) and **a dispute over a checkpoint** (everything else). They are separate mechanisms.
A report is anonymous and about content; a dispute is between two named people about whether something
happened, and both sides can see it.

**Six of the thirteen are the same screen in different states.** `9.2` and its variants are one case
detail, and which one you draw depends on the case's status and on who is looking. Four are the reporter's
view, two are the respondent's — the `context` line always names *the other party*, which is how you tell
them apart at a glance.

| Screen | Status badge | Whose view |
| --- | --- | --- |
| `9.2` | `AwaitingResponse` | the person who opened it |
| `9.2r` | `AwaitingResponse` | the person who must respond |
| `9.2c` | `UnderReview` | opener, with a question to answer |
| `9.2u` | `UnderReview` | opener, nothing to do |
| `9.2ur` | `UnderReview` | respondent, after responding |
| `9.2e` | `Escalated` | opener |
| `9.2f` | `Resolved` | opener |

Read `README.md` first for the notation, and `design-system.md` for the tokens and components.

---

### `9.1` — Report

**Reached from** [M3](M3-discovery.md) `3.8`, `3.12g`  ·  **Leads to** `9.1d`  ·  **Exits** back → history

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Report"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 10
    TEXT context 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Reporting: Data entry — work from home"
    TEXT prompt 211x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Why are you reporting this?"
    INSTANCE Input/RoleOption 328x78 [FIXED/HUG] · horizontal pad 16 gap 12 · fill color/bg/default · stroke color/brand/primary 2 · r8 · {State=Selected}
      FRAME radio 20x20 [FIXED/FIXED]
        ELLIPSE ring 20x20 [FIXED/FIXED] @0,0 · stroke color/brand/primary 2
        ELLIPSE dot 10x10 [FIXED/FIXED] @5,5 · fill color/brand/primary
      FRAME copy 245x46 [HUG/HUG] · vertical pad 0 gap 2
        TEXT title 110x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Fraud or scam"
        TEXT description 245x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Fake gig, fake pay, or identity misuse"
    INSTANCE Input/RoleOption 328x78 [FIXED/HUG] · horizontal pad 16 gap 12 · fill color/bg/default · stroke color/border/default 1.5 · r8 · {State=Default}
      FRAME radio 20x20 [FIXED/FIXED]
        ELLIPSE ring 20x20 [FIXED/FIXED] @0,0 · stroke color/border/default 1.5
      FRAME copy 189x46 [HUG/HUG] · vertical pad 0 gap 2
        TEXT title 166x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Inappropriate content"
        TEXT description 189x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Offensive or explicit material"
    INSTANCE Input/RoleOption 328x78 [FIXED/HUG] · horizontal pad 16 gap 12 · fill color/bg/default · stroke color/border/default 1.5 · r8 · {State=Default}
      FRAME radio 20x20 [FIXED/FIXED]
        ELLIPSE ring 20x20 [FIXED/FIXED] @0,0 · stroke color/border/default 1.5
      FRAME copy 208x46 [HUG/HUG] · vertical pad 0 gap 2
        TEXT title 117x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Safety concern"
        TEXT description 208x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Something feels unsafe or risky"
    INSTANCE Input/RoleOption 328x78 [FIXED/HUG] · horizontal pad 16 gap 12 · fill color/bg/default · stroke color/border/default 1.5 · r8 · {State=Default}
      FRAME radio 20x20 [FIXED/FIXED]
        ELLIPSE ring 20x20 [FIXED/FIXED] @0,0 · stroke color/border/default 1.5
      FRAME copy 192x46 [HUG/HUG] · vertical pad 0 gap 2
        TEXT title 93x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Harassment"
        TEXT description 192x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Threats or unwanted contact"
    INSTANCE Input/RoleOption 328x78 [FIXED/HUG] · horizontal pad 16 gap 12 · fill color/bg/default · stroke color/border/default 1.5 · r8 · {State=Default}
      FRAME radio 20x20 [FIXED/FIXED]
        ELLIPSE ring 20x20 [FIXED/FIXED] @0,0 · stroke color/border/default 1.5
      FRAME copy 103x46 [HUG/HUG] · vertical pad 0 gap 2
        TEXT title 44x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Other"
        TEXT description 103x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Something else"
    TEXT detailLabel 305x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Details (optional · up to 300 characters)"
    FRAME detailField 328x68 [FILL/HUG] · vertical pad 10/12/10/12 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
      TEXT detailValue 296x48 [FIXED/HUG] · fill color/text/primary · mobile/body · "Asks for a registration fee up front and gives no real address."
    TEXT anonNote 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "They won't learn who reported them."
    FRAME spacer-grow 8x8 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 106x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Submit report"
```

**Five reasons, and `Input/RoleOption` is doing duty as a radio group.** The component was built for role
selection on sign-up; it is the same control — a radio, a title and a description in a bordered row — so
it is reused rather than duplicated. The selected row carries a 2px `color/brand/primary` stroke where the
others carry 1.5px `color/border/default`, and only the selected row has a `dot` inside its `radio`.

**`spacer-grow` is 8 tall here**, which means this screen has no slack: five options plus a detail box
fills it. Adding a sixth reason would push the button off the screen, so it is a scope question rather
than a layout one.

**"They won't learn who reported them"** is the product promise that makes reporting usable at all, and
`FR-DISPUTE-02` depends on it — reports accumulate against a posting and auto-hide it at threshold, which
only works if people are willing to file them.

### `9.1d` — Report · submitted

**Reached from** `9.1`  ·  **Leads to** nothing — "Done" returns  ·  **Exits** back → history

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Report"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 10
    TEXT context 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Reporting: Data entry — work from home"
    TEXT prompt 203x32 [HUG/HUG] · fill color/text/primary · mobile/display · "Report submitted"
    TEXT anonNote 328x72 [FIXED/HUG] · fill color/text/secondary · mobile/body · "It's queued for a moderator to review. They will never learn who reported them — reports stay anonymous, permanently."
    FRAME spacer-grow 8x496 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 41x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Done"
```

**"Permanently" is the word doing the work.** The anonymity is not "until the case closes" or "unless a
moderator needs to ask" — it is unconditional, and the confirmation says so a second time because this is
the moment a reporter is deciding whether they regret it.

### `9.2` — Dispute case

**Reached from** [M5](M5-engagement.md) `5.6`  ·  **Leads to** nothing  ·  **Exits** back → history

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Dispute case"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 10
    INSTANCE Display/Badge 136x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Case, Value=AwaitingResponse}
      ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/state/urgent
      TEXT label 104x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Awaiting response"
    TEXT context 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Shop assistant — weekend · Saman Stores"
    TEXT trigger 328x48 [FIXED/HUG] · fill color/text/primary · mobile/body · "Opened from: arrival could not be confirmed."
    INSTANCE Display/CountdownText 247x20 [HUG/HUG] · horizontal pad 0 gap 0 · {Format=Deadline}
      TEXT countdown 247x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Response window closes 2 Sep 2026"
    TEXT windowNote 328x72 [FIXED/HUG] · fill color/text/secondary · mobile/body · "Saman Stores has 48 hours to respond. If they don't, review goes ahead without their side."
    TEXT visibilityNote 328x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "You'll see the outcome here when the case is decided."
    INSTANCE Action/Link 201x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
      TEXT label 201x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "How disputes are resolved"
```

**This screen has no button and no `spacer-grow`**, because the opener has nothing to do. The only control
is a link to [MHF](MHF-help.md) `HF.2`–`HF.4`, and the content simply stops where it stops. Compare `9.2r`,
which is the same case from the other side and *does* carry a pinned button.

**"If they don't, review goes ahead without their side"** is `FR-DISPUTE-07` made visible. A silent
respondent does not stall the case; the 48-hour window expires and the moderator decides on what exists.

### `9.2r` — Dispute case · awaiting your response, respondent view

**Reached from** [M5](M5-engagement.md) `5.3s`  ·  **Leads to** `9.3`  ·  **Exits** back → history

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Dispute case"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 10
    INSTANCE Display/Badge 136x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Case, Value=AwaitingResponse}
      ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/state/urgent
      TEXT label 104x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Awaiting response"
    TEXT context 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Shop assistant — weekend · Kavindu Perera"
    TEXT trigger 328x48 [FIXED/HUG] · fill color/text/primary · mobile/body · "Opened from: arrival could not be confirmed."
    INSTANCE Display/CountdownText 247x20 [HUG/HUG] · horizontal pad 0 gap 0 · {Format=Deadline}
      TEXT countdown 247x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Response window closes 2 Sep 2026"
    TEXT windowNote 328x48 [FIXED/HUG] · fill color/text/secondary · mobile/body · "You have 48 hours to respond. If you don't, review goes ahead without your side."
    TEXT visibilityNote 328x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "You'll see the outcome here when the case is decided."
    INSTANCE Action/Link 201x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
      TEXT label 201x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "How disputes are resolved"
    FRAME spacer-grow 328x336 [FILL/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 68x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Respond"
```

**Same case, same badge, different second person.** `9.2` says *"Saman Stores has 48 hours"*; this says
*"You have 48 hours"*, and `context` names Kavindu Perera rather than Saman Stores. **Build one screen and
pick the copy and the button from whether the viewer is the opener or the respondent** — do not build two.

### `9.2c` — Dispute case · clarification requested

**Reached from** [M10](M10-moderation.md) `10.2b`  ·  **Leads to** `9.4`  ·  **Exits** back → history

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Dispute case"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 10
    INSTANCE Display/Badge 108x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Case, Value=UnderReview}
      ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
      TEXT label 76x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Under review"
    TEXT context 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Shop assistant — weekend · Saman Stores"
    TEXT trigger 328x48 [FIXED/HUG] · fill color/text/primary · mobile/body · "Opened from: arrival could not be confirmed."
    INSTANCE Display/CountdownText 151x20 [HUG/HUG] · horizontal pad 0 gap 0 · {Format=Deadline}
      TEXT countdown 151x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Answer by 3 Sep 2026"
    TEXT windowNote 328x96 [FIXED/HUG] · fill color/text/secondary · mobile/body · "The moderator has a question for you. Answering helps your case — unanswered questions can leave the outcome inconclusive."
    TEXT visibilityNote 328x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "You'll see the outcome here when the case is decided."
    FRAME spacer-grow 328x342 [FILL/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 158x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Answer the question"
```

**The badge is `UnderReview`, not a fifth value.** A clarification request does not change the case's
status — it adds a task for one party while the case stays under review. The 24-hour pause `HF.4`
describes is a moderator-side timer; this screen shows only the answer deadline.

### `9.2u` — Dispute case · under review

**Reached from** `9.4d`  ·  **Leads to** nothing  ·  **Exits** back → history

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Dispute case"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 10
    INSTANCE Display/Badge 108x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Case, Value=UnderReview}
      ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
      TEXT label 76x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Under review"
    TEXT context 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Shop assistant — weekend · Saman Stores"
    TEXT trigger 328x48 [FIXED/HUG] · fill color/text/primary · mobile/body · "Opened from: arrival could not be confirmed."
    TEXT windowNote 328x72 [FIXED/HUG] · fill color/text/secondary · mobile/body · "A YouthLink moderator is reviewing both sides. Nothing more is needed from you right now."
    TEXT visibilityNote 328x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "You'll see the outcome here as soon as the case is decided."
```

**No countdown, because nothing is owed.** Once both sides are in, there is no deadline the user can act
on, and showing one would invent a promise about moderator turnaround that the product does not make.

### `9.2ur` — Dispute case · under review, respondent view

**Reached from** `9.3e`  ·  **Leads to** nothing  ·  **Exits** back → history

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Dispute case"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 10
    INSTANCE Display/Badge 108x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Case, Value=UnderReview}
      ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
      TEXT label 76x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Under review"
    TEXT context 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Shop assistant — weekend · Kavindu Perera"
    TEXT trigger 328x48 [FIXED/HUG] · fill color/text/primary · mobile/body · "Opened from: arrival could not be confirmed."
    TEXT windowNote 328x96 [FIXED/HUG] · fill color/text/secondary · mobile/body · "A YouthLink moderator is reviewing both sides. Your response is on record — nothing more is needed from you right now."
    TEXT visibilityNote 328x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "You'll see the outcome here as soon as the case is decided."
```

**One clause different from `9.2u`:** *"Your response is on record"*. Someone who has just written a
defence needs to know it landed, and that reassurance is the only thing separating these two frames.

### `9.2e` — Dispute case · escalated

**Reached from** [M10](M10-moderation.md) `10.1e`  ·  **Leads to** nothing  ·  **Exits** back → history

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Dispute case"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 10
    INSTANCE Display/Badge 88x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Case, Value=Escalated}
      ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/state/urgent
      TEXT label 56x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Escalated"
    TEXT context 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Shop assistant — weekend"
    TEXT trigger 328x48 [FIXED/HUG] · fill color/text/primary · mobile/body · "Opened from: arrival could not be confirmed."
    TEXT windowNote 328x72 [FIXED/HUG] · fill color/text/secondary · mobile/body · "Escalated to a YouthLink admin for a ruling — this happens when a case needs a decision the moderator can't make alone."
    TEXT visibilityNote 328x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "You'll see the outcome here as soon as the case is decided."
```

**`context` drops the other party's name here**, alone among the case screens. Once a case is with an
admin it is about the incident rather than the two people, and the copy follows.

### `9.2f` — Dispute case · resolved

**Reached from** [M10](M10-moderation.md) `10.5r`  ·  **Leads to** nothing  ·  **Exits** back → history

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Dispute case"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 10
    INSTANCE Display/Badge 84x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Case, Value=Resolved}
      ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/state/success
      TEXT label 52x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Resolved"
    TEXT context 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Shop assistant — weekend · Saman Stores"
    TEXT trigger 328x48 [FIXED/HUG] · fill color/text/primary · mobile/body · "Opened from: arrival could not be confirmed."
    TEXT windowNote 328x72 [FIXED/HUG] · fill color/text/secondary · mobile/body · "Outcome: in your favour — the arrival dispute was upheld. This decision is final; there is no appeals process."
    TEXT visibilityNote 328x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Resolved 4 Sep 2026 by a YouthLink admin ruling."
```

**"This decision is final; there is no appeals process"** is `FR-ADM-01`. Saying it on the outcome screen
rather than only in the help page is deliberate — this is the moment a losing party looks for the appeal
button, and the absence of one has to be stated rather than implied by a missing control.

**The dot colour carries the status** and nothing else does: `color/state/urgent` for Awaiting and
Escalated, `color/brand/primary` for Under review, `color/state/success` for Resolved. The badge's
`bg/subtle` fill and `color/text/primary` label are identical across all four.

### `9.3` — Respond to dispute

**Reached from** `9.2r`  ·  **Leads to** `9.3e`  ·  **Exits** back → `9.2r`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Respond"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 12
    TEXT context 328x32 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Dispute: arrival not confirmed · Shop assistant — weekend"
    TEXT prompt 214x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Your side of what happened"
    INSTANCE responseField 328x98 [FILL/HUG] · vertical pad 12 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8 · of Input/TextArea · {State=Filled}
      TEXT value 302x72 [FILL/HUG] · fill color/text/primary · mobile/body · "I was away from the shop that morning, but my brother was there and the worker did arrive. Happy to clarify."
    TEXT capNote 328x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "Up to 300 characters."
    TEXT evidenceLabel 167x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Add photos (optional)"
    INSTANCE Display/PhotoPicker 232x96 [HUG/HUG] · vertical pad 0 gap 8 · {State=Filled}
      FRAME tiles 232x72 [HUG/HUG] · horizontal pad 0 gap 8
        FRAME thumb 72x72 [FIXED/FIXED] · fill color/bg/subtle · r8
          FRAME icon-image 24x24 [FIXED/FIXED] @24,24
            VECTOR Vector 20x10 [FIXED/FIXED] @2,8 · stroke color/text/secondary 1.5
            ELLIPSE Ellipse 5x5 [FIXED/FIXED] @15,3 · stroke color/text/secondary 1.5
        FRAME thumb 72x72 [FIXED/FIXED] · fill color/bg/subtle · r8
          FRAME icon-image 24x24 [FIXED/FIXED] @24,24
            VECTOR Vector 20x10 [FIXED/FIXED] @2,8 · stroke color/text/secondary 1.5
            ELLIPSE Ellipse 5x5 [FIXED/FIXED] @15,3 · stroke color/text/secondary 1.5
        FRAME addTile 72x72 [FIXED/FIXED] · stroke color/border/default 1.5 · r8
          VECTOR Vector 16x16 [FIXED/FIXED] @28,28 · stroke color/brand/primary 2
      TEXT capsNote 133x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "2 of 3 · up to 5MB each"
    TEXT optionalNote 328x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Evidence is optional — not adding any never blocks review."
    FRAME spacer-grow 8x230 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 129x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Submit response"
```

**Three photos, 5MB each, and the limits are on screen.** `FR-DISPUTE-05` asks for evidence upload;
`capsNote` states the caps where they are needed rather than discovering them at the failure. **"Evidence
is optional — not adding any never blocks review"** exists so nobody concludes they cannot respond because
they have no photograph.

**The back arrow goes to `9.2r`, not history.** This screen is reachable from exactly one place, so an
explicit wire is truthful and stays statically checkable.

### `9.3e` — Respond to dispute · submitted

**Reached from** `9.3`  ·  **Leads to** `9.2ur`  ·  **Exits** "Back to case" → `9.2ur`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Respond"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 12
    TEXT context 328x32 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Dispute: arrival not confirmed · Shop assistant — weekend"
    TEXT subTitle 328x32 [FIXED/HUG] · fill color/text/primary · mobile/display · "Response submitted"
    TEXT subBody 328x72 [FIXED/HUG] · fill color/text/secondary · mobile/body · "A moderator now has both sides. You'll see the outcome on the case when it's decided."
    FRAME spacer-grow 8x472 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 98x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Back to case"
```

### `9.4` — Answer clarification

**Reached from** `9.2c`  ·  **Leads to** `9.4d`  ·  **Exits** back → `9.2c`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Clarification"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 12
    TEXT context 328x32 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Dispute: arrival not confirmed · Shop assistant — weekend"
    TEXT qLabel 169x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "The moderator asked:"
    FRAME questionCard 328x68 [FILL/HUG] · vertical pad 10/12/10/12 gap 0 · fill color/bg/subtle · r8
      TEXT questionText 296x48 [FIXED/HUG] · fill color/text/primary · mobile/body · "What time did you arrive on Saturday, and did anyone see you at the shop?"
    INSTANCE Display/CountdownText 151x20 [HUG/HUG] · horizontal pad 0 gap 0 · {Format=Deadline}
      TEXT countdown 151x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Answer by 3 Sep 2026"
    INSTANCE answerField 328x98 [FILL/HUG] · vertical pad 12 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8 · of Input/TextArea · {State=Filled}
      TEXT value 302x72 [FILL/HUG] · fill color/text/primary · mobile/body · "I arrived just before 8 AM. The shop was closed; the stall holder next door saw me waiting."
    TEXT capNote 328x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "Up to 300 characters."
    TEXT helpNote 328x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Answering helps your case — unanswered questions can leave the outcome inconclusive."
    FRAME spacer-grow 8x262 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 100x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Send answer"
```

**`questionCard` is `bg/subtle` with no border; `answerField` is `bg/default` with one.** The filled-and-
borderless card reads as something received, the bordered box as something to fill in. That contrast is
the only thing distinguishing them, and it is worth preserving.

### `9.4d` — Answer clarification · sent

**Reached from** `9.4`  ·  **Leads to** `9.2u`  ·  **Exits** "Back to case" → `9.2u` · back → `9.2u`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Clarification"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 12
    TEXT context 328x32 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Dispute: arrival not confirmed · Shop assistant — weekend"
    TEXT subTitle 328x32 [FIXED/HUG] · fill color/text/primary · mobile/display · "Answer sent"
    TEXT subBody 328x72 [FIXED/HUG] · fill color/text/secondary · mobile/body · "The moderator has your answer. You'll see the outcome on the case when it's decided."
    FRAME spacer-grow 8x472 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 98x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Back to case"
```

**Both the button and the back arrow go to `9.2u`.** After answering, there is nowhere else to be, and a
back arrow returning to the form you just submitted would invite a second submission.

---

## Two boxes adopted the component; two deliberately did not

Four multi-line boxes in this module were drawn before `Input/TextArea` existed, all at `pad 10/12`
rather than the component's `pad 12`. Two now use the component and two do not, and the split is the
point rather than an oversight.

| Box | Outcome |
| --- | --- |
| `9.3` `responseField` | **`Input/TextArea`** — 92 → 98 tall, absorbed by 230px of remaining slack |
| `9.4` `answerField` | **`Input/TextArea`** — 92 → 98 tall, absorbed by 262px |
| `9.1` `detailField` | **left at `pad 10/12`** — the component's 96 minimum does not fit |
| `9.4` `questionCard` | **left at `pad 10/12`** — it is not an input |

**`9.1` is full.** Five reason options, a details box and a pinned button leave its `spacer-grow` at
**8px** — that is all the slack on the screen. The component would take the box from 68 to 96, needing 28
more pixels than exist, and the submit button would leave the screen. **Widening the reason list or
adopting the component there needs a layout decision first**, not a swap.

**`questionCard` is not a text field at all.** It carries the moderator's question: `bg/subtle` fill, no
border, read-only. The bordered white box beside it is where you type. Making them the same component
would erase the only thing distinguishing what you were asked from what you are answering.

## States not drawn in this module

| State | Build it as |
| --- | --- |
| A response or answer submitted while offline | the same screen with `Feedback/FormBanner {Kind=Error}` at the top of `content`, the text preserved — the pattern is drawn on [M4](M4-applying.md) `4.1bnr` |
| The response window expired without a reply | `9.2u` for both parties — the case simply moves to review, which is what "review goes ahead without their side" means |
| An outcome against you | `9.2f` with the `windowNote` outcome sentence changed. The badge, the date line and the finality sentence are identical; nothing about the screen softens a loss |
| A second clarification | not built. `HF.4` and `FR-MOD-01` allow the moderator **one** question, so a second would be a requirement change rather than a screen |
| Report reasons beyond the five | a scope question — `9.1` has 8px of slack, so a sixth option needs a layout decision first |
