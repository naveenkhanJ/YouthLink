# M5 — Engagement lifecycle

**Fifty-seven screens.** Everything after a selection: the engagements list for both parties, the check-in codes, cancellation under both regimes, re-confirming a changed gig, the stalled-engagement prompt, and the path into a dispute and back out of it after the ruling.

**Read *Every screen shows one moment* at the end first.** Kavindu Perera's Shop assistant engagement with Saman Stores follows one story — no code exchanged, an arrival dispute on Monday 31 Aug, the ruling on Friday 4 Sep — and the code-exchange path is a labelled branch beside it. Lanka Events' engagements (Nethmi Jayasinghe, Tharindu Silva) and Dilrukshi Herath's part-time tutoring job run alongside.

Read `README.md` for the notation and `design-system.md` for the tokens and components. **The tab bar repeats on every list, so it reads `[standard, see header]`**; *What the collapsed tab bar hides*, at the end, spells out what varies under it.

---

### `5.1w` — My engagements · Saturday, re-confirmation owed

**Reached from** the Engagements tab on the weekend journeys  ·  **Leads to** `5.2` (Saman Stores row), `5.11` (Dilrukshi Herath row)

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    TEXT screenTitle 201x32 [HUG/HUG] · fill color/text/primary · mobile/display · "My engagements"
    INSTANCE Display/EngagementRow 328x116 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Action=Required}
      FRAME topRow 183x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT counterparty 107x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Saman Stores"
        INSTANCE Display/Badge 68x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Engagement, Value=Active}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 36x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Active"
      TEXT posting 180x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Shop assistant — weekend"
      TEXT nextAction 296x24 [FILL/HUG] · fill color/brand/primary · mobile/body-medium · "Enter arrival code"
    INSTANCE Display/EngagementRow 328x140 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Action=Required}
      FRAME topRow 199x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT counterparty 123x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Dilrukshi Herath"
        INSTANCE Display/Badge 68x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Engagement, Value=Active}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 36x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Active"
      TEXT posting 154x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Grade 8 maths tutoring"
      TEXT nextAction 296x48 [FILL/HUG] · fill color/brand/primary · mobile/body-medium · "Re-confirm the new start — by Mon 31 Aug 2026, 6:00 PM"
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Worker} · [standard, see header]
```

**Saturday 29 Aug.** Two engagements, both selected on Friday afternoon (M4). The Saman Stores row is
*Active* and owes **"Enter arrival code"** — the shift started at 8:00 AM. The Dilrukshi Herath row is *Active*
and owes **"Re-confirm the new start — by Mon 31 Aug 2026, 6:00 PM"**: she moved the tutoring start that day
(M3's *Grade 8 maths tutoring changed*). FR-ENG-09's window is the shorter of 48 hours and half the time left
before the start; with the start nine days away, that is 48 hours. `Display/EngagementRow {Action=Required}`
shows the owed action as a separate line under the status (FR-ENG-14 as amended 2026-09-24).

### `5.2` — Engagement detail · Shop assistant, arrival not yet confirmed

**Reached from** the Saman Stores row on `5.1w`, `5.1v`, `5.1tx`; `5.14` ("Still running")  ·  **Leads to** `5.5a` ("Enter arrival code"), [MHF](MHF-help.md) `HF.2` ("How check-in codes work")  ·  **Exits** back → history

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Engagement"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 10
    FRAME topRow 328x28 [FILL/HUG] · horizontal pad 0 gap 8
      TEXT counterparty 167x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Saman Stores"
      INSTANCE Display/Badge 77x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
        VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
        TEXT label 44x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Verified"
      INSTANCE Display/Badge 68x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Engagement, Value=Active}
        ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
        TEXT label 36x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Active"
    TEXT posting 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Shop assistant — weekend · Rs 7,000 for the job"
    TEXT cpHeader 66x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "CHECK-INS"
    FRAME cp-Arrival 328x52 [FILL/HUG] · horizontal pad 10/12/10/12 gap 10 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Arrival"
      TEXT cpState 204x32 [FILL/HUG] · fill color/brand/primary · mobile/caption · "Enter the code Saman Stores shows you"
    FRAME cp-Completion 328x44 [FILL/HUG] · horizontal pad 10/12/10/12 gap 10 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Completion"
      TEXT cpState 204x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "Not reached"
    FRAME cp-Payment 328x44 [FILL/HUG] · horizontal pad 10/12/10/12 gap 12 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Payment"
      FRAME cpPayRight 202x16 [FILL/HUG] · vertical pad 0 gap 4
        TEXT cpState 202x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "Not reached"
    INSTANCE Action/Link 196x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
      TEXT label 196x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "How check-in codes work"
    FRAME spacer-grow 8x328 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 135x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Enter arrival code"
```

**The canonical Saturday.** Arrival is the only live checkpoint: *"Enter the code Saman Stores shows you"*
in `color/brand/primary`, with completion and payment *Not reached* — the checkpoints run in order (FR-ENG-01
as amended 2026-09-24). No code is ever exchanged on this engagement in the story that follows: this state holds
from 8:00 AM Saturday until Kavindu opens a dispute on Monday. Rs 7,000 is the fixed total for the one-off job
(M4 ruling). There is no *End engagement* here: End Engagement is part-time only (FR-ENG-12).

### `5.5a` — Confirm arrival · entering Saman Stores' code

**Reached from** `5.2`, `5.14` ("Update status")  ·  **Leads to** `5.2h` ("Confirm arrival" — the code-exchange branch), `5.6` ("Unable to confirm?")  ·  **Exits** back → history

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Confirm arrival"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 12
    TEXT context 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Shop assistant — weekend · Saman Stores"
    INSTANCE Display/CodePanel 328x136 [FIXED/HUG] · vertical pad 16 gap 12 · fill color/bg/default · r8 · {View=Enterer}
      TEXT instruction 296x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Enter the code Saman Stores shows you when you arrive."
      INSTANCE Input/CodeInputNumeric 296x52 [FILL/HUG] · vertical pad 0 gap 8 · {State=Filled}
        FRAME digits 296x52 [FILL/HUG] · horizontal pad 0 gap 8
          FRAME d0 43x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
            TEXT 3 14x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "3"
          FRAME d1 43x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
            TEXT 5 13x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "5"
          FRAME d2 43x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
            TEXT 8 13x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "8"
          FRAME d3 43x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
            TEXT 1 10x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "1"
          FRAME d4 43x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
            TEXT 7 12x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "7"
          FRAME d5 43x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
            TEXT 6 13x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "6"
    FRAME spacer-grow 8x412 [FIXED/FILL]
    INSTANCE Action/Link 143x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
      TEXT label 143x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Unable to confirm?"
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 113x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Confirm arrival"
```

Added 2026-09-24. `Display/CodePanel {View=Enterer}` with `Input/CodeInputNumeric {State=Filled}` —
**3 5 8 1 7 6**, Saman Stores' arrival code. Every code in this module is distinct: Saman's arrival 358176 and
completion 274065, Kavindu's payment code 731942, and Lanka Events' completion code for Nethmi 482913
(FR-ENG-01, FR-ENG-04). *"Unable to confirm?"* is the fallback at every checkpoint (FR-ENG-03).

**Two stories leave this screen.** In the canonical one Kavindu cannot get a code confirmed and taps
*Unable to confirm?* (`5.6`). *Confirm arrival* starts the **code-exchange branch** (`5.2h` onward) — the
same Saturday as it would have gone had the code been exchanged.

### `5.6` — Unable to confirm · opening a dispute

**Reached from** `5.5a`, `5.5` ("Unable to confirm?")  ·  **Leads to** [M9](M9-disputes.md) `9.2` ("Open dispute", from arrival) — or `9.2k` from the branch's completion — and [MHF](MHF-help.md) `HF.4` ("How disputes are resolved")  ·  **Exits** back → history

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Unable to confirm"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 12
    TEXT what 328x48 [FIXED/HUG] · fill color/text/primary · mobile/body · "This opens a dispute case for this engagement."
    TEXT p1 328x40 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "• Saman Stores will be notified and asked to respond"
    TEXT p2 328x20 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "• A moderator reviews both sides"
    TEXT p3 328x40 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "• You can follow the case status from this engagement"
    TEXT p4 328x20 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "• Once submitted, it can't be withdrawn"
    INSTANCE Action/Link 201x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
      TEXT label 201x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "How disputes are resolved"
    FRAME spacer-grow 8x360 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/state/danger · r8 · {Style=Destructive, State=Default}
      TEXT label 103x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Open dispute"
```

The pre-dispute explanation. It names who is told (Saman Stores), that a moderator reviews both sides,
where the case can be followed, and that it cannot be withdrawn; *Open dispute* is `{Style=Destructive}`
because it cannot be undone. The copy no longer promises a review time — no requirement sets one, and the
committed case took Monday to Friday. The screen is the same from arrival and from completion; which case
it opens depends on the checkpoint the viewer came from (`9.2` from arrival, `9.2k` from the branch's
completion).

### `5.14` — Stalled prompt · Sunday morning (dialog)

**Opens over** `5.2`  ·  **Still running** → `5.2`  ·  **Update status** → `5.5a`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Engagement"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 10
    FRAME topRow 328x28 [FILL/HUG] · horizontal pad 0 gap 8
      TEXT counterparty 167x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Saman Stores"
      INSTANCE Display/Badge 77x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
        VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
        TEXT label 44x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Verified"
      INSTANCE Display/Badge 68x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Engagement, Value=Active}
        ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
        TEXT label 36x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Active"
    TEXT posting 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Shop assistant — weekend · Rs 7,000 for the job"
    TEXT cpHeader 66x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "CHECK-INS"
    FRAME cp-Arrival 328x52 [FILL/HUG] · horizontal pad 10/12/10/12 gap 10 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Arrival"
      TEXT cpState 204x32 [FILL/HUG] · fill color/brand/primary · mobile/caption · "Enter the code Saman Stores shows you"
    FRAME cp-Completion 328x44 [FILL/HUG] · horizontal pad 10/12/10/12 gap 10 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Completion"
      TEXT cpState 204x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "Not reached"
    FRAME cp-Payment 328x44 [FILL/HUG] · horizontal pad 10/12/10/12 gap 12 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Payment"
      FRAME cpPayRight 202x16 [FILL/HUG] · vertical pad 0 gap 4
        TEXT cpState 202x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "Not reached"
    INSTANCE Action/Link 196x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
      TEXT label 196x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "How check-in codes work"
    FRAME spacer-grow 8x328 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 135x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Enter arrival code"
  RECTANGLE scrim 360x800 [FIXED/FIXED] @0,0 · fill color/overlay/scrim · opacity 40%
  FRAME promptCard 328x196 [FIXED/HUG] @16,302 · vertical pad 20/20/16/20 gap 12 · fill color/bg/default · r12
    TEXT promptTitle 288x28 [FIXED/HUG] · fill color/text/primary · mobile/title · "Did this happen?"
    TEXT promptBody 288x60 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Shop assistant — weekend started more than a day ago. If it's still running, just dismiss this — nothing changes."
    FRAME actions 288x48 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Action/Button 140x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 91x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Still running"
      INSTANCE Action/Button 140x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
        TEXT label 108x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Update status"
```

**Sunday 30 Aug, 8:00 AM** — 24 hours after the start with the completion checkpoint unresolved, so
FR-ENG-13's prompt fires. `promptCard` over `5.2` (the backdrop is exactly `5.2`), titled *"Did this
happen?"*. **Still running** dismisses it and changes nothing; **Update status** opens the earliest
unresolved checkpoint — arrival, `5.5a` — where the code can still be entered or *Unable to confirm?* opens a
dispute (FR-ENG-13 as amended 2026-09-24). Until that pass *Update status* led to End Engagement, a
part-time mechanism this one-off gig does not have.

### `5.2h` — Engagement detail · arrival confirmed (code-exchange branch)

**Reached from** `5.5a` ("Confirm arrival")  ·  **Leads to** `5.5` ("Enter completion code"), [MHF](MHF-help.md) `HF.2` ("How check-in codes work")  ·  **Exits** back → history

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Engagement"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 10
    FRAME topRow 328x28 [FILL/HUG] · horizontal pad 0 gap 8
      TEXT counterparty 167x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Saman Stores"
      INSTANCE Display/Badge 77x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
        VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
        TEXT label 44x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Verified"
      INSTANCE Display/Badge 68x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Engagement, Value=Active}
        ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
        TEXT label 36x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Active"
    TEXT posting 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Shop assistant — weekend · Rs 7,000 for the job"
    TEXT cpHeader 66x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "CHECK-INS"
    FRAME cp-Arrival 328x44 [FILL/HUG] · horizontal pad 10/12/10/12 gap 10 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Arrival"
      TEXT cpState 204x16 [FILL/HUG] · fill color/state/success · mobile/caption · "Confirmed ✓"
    FRAME cp-Completion 328x44 [FILL/HUG] · horizontal pad 10/12/10/12 gap 10 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Completion"
      TEXT cpState 204x16 [FILL/HUG] · fill color/brand/primary · mobile/caption · "Enter the employer's code"
    FRAME cp-Payment 328x44 [FILL/HUG] · horizontal pad 10/12/10/12 gap 12 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Payment"
      FRAME cpPayRight 202x16 [FILL/HUG] · vertical pad 0 gap 4
        TEXT cpState 202x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "Not reached"
    INSTANCE Action/Link 196x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
      TEXT label 196x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "How check-in codes work"
    FRAME spacer-grow 8x336 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 173x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Enter completion code"
```

**Branch — arrival confirmed.** *Confirmed ✓* in `color/state/success`; completion is now the live step,
*"Enter the employer's code"*.

### `5.5` — Confirm completion · entering Saman Stores' code (branch)

**Reached from** `5.2h`  ·  **Leads to** `5.5b` ("Confirm completion"), `5.6` ("Unable to confirm?")  ·  **Exits** back → `5.2h`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Confirm completion"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 12
    TEXT context 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Shop assistant — weekend · Saman Stores"
    INSTANCE Display/CodePanel 328x136 [FIXED/HUG] · vertical pad 16 gap 12 · fill color/bg/default · r8 · {View=Enterer}
      TEXT instruction 296x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Enter the code Saman Stores shows you when the work is done."
      INSTANCE Input/CodeInputNumeric 296x52 [FILL/HUG] · vertical pad 0 gap 8 · {State=Filled}
        FRAME digits 296x52 [FILL/HUG] · horizontal pad 0 gap 8
          FRAME d0 43x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
            TEXT 2 13x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "2"
          FRAME d1 43x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
            TEXT 7 12x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "7"
          FRAME d2 43x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
            TEXT 4 14x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "4"
          FRAME d3 43x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
            TEXT 0 14x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "0"
          FRAME d4 43x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
            TEXT 6 13x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "6"
          FRAME d5 43x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
            TEXT 5 13x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "5"
    FRAME spacer-grow 8x412 [FIXED/FILL]
    INSTANCE Action/Link 143x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
      TEXT label 143x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Unable to confirm?"
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 151x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Confirm completion"
```

**Branch.** The completion code, **2 7 4 0 6 5**. It was 482913 until 2026-09-24 — Lanka Events'
completion code for Nethmi — which broke FR-ENG-04's per-engagement scoping.

### `5.5b` — Completion confirmed (branch)

**Reached from** `5.5`  ·  **Leads to** `5.4b` ("Show my payment code"), `5.2p` ("Not now")  ·  **Exits** back → `5.2p`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Confirm completion"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 12
    TEXT context 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Shop assistant — weekend · Saman Stores"
    FRAME successGlyph 48x48 [FIXED/FIXED]
      ELLIPSE Ellipse 48x48 [FIXED/FIXED] @0,0 · stroke color/state/success 2.5
      VECTOR Vector 22x16 [FIXED/FIXED] @13,16 · stroke color/state/success 3
    TEXT confTitle 328x32 [FIXED/HUG] · fill color/text/primary · mobile/display · "Completion confirmed"
    TEXT confBody 328x96 [FIXED/HUG] · fill color/text/secondary · mobile/body · "Both of you can see the work is done. Next: payment — once the money is in your hand, Saman Stores enters your payment code."
    FRAME spacer-grow 8x344 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 183x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Show my payment code"
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
      TEXT label 64x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Not now"
```

**Branch — completion confirmed.** The next step is payment: once the money is in Kavindu's hand,
Saman Stores enters *his* code — the holder flips at payment (FR-ENG-01). Rating does not open here: a gig
completes via check-in codes only when all of them are confirmed (FR-RATE-05), so this screen no longer
offers *Rate Saman Stores*, and *Not now* lands on `5.2p`, not on a completed engagement.

### `5.2p` — Engagement detail · completion confirmed, payment next (branch)

**Reached from** `5.5b`  ·  **Leads to** `5.4b` ("Show my payment code"), [MHF](MHF-help.md) `HF.2` ("How check-in codes work")  ·  **Exits** back → history

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Engagement"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 10
    FRAME topRow 328x28 [FILL/HUG] · horizontal pad 0 gap 8
      TEXT counterparty 167x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Saman Stores"
      INSTANCE Display/Badge 77x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
        VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
        TEXT label 44x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Verified"
      INSTANCE Display/Badge 68x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Engagement, Value=Active}
        ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
        TEXT label 36x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Active"
    TEXT posting 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Shop assistant — weekend · Rs 7,000 for the job"
    TEXT cpHeader 66x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "CHECK-INS"
    FRAME cp-Arrival 328x44 [FILL/HUG] · horizontal pad 10/12/10/12 gap 10 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Arrival"
      TEXT cpState 204x16 [FILL/HUG] · fill color/state/success · mobile/caption · "Confirmed ✓"
    FRAME cp-Completion 328x44 [FILL/HUG] · horizontal pad 10/12/10/12 gap 10 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Completion"
      TEXT cpState 204x16 [FILL/HUG] · fill color/state/success · mobile/caption · "Confirmed ✓"
    FRAME cp-Payment 328x52 [FILL/HUG] · horizontal pad 10/12/10/12 gap 12 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Payment"
      FRAME cpPayRight 202x32 [FILL/HUG] · vertical pad 0 gap 4
        TEXT cpState 202x32 [FILL/HUG] · fill color/text/secondary · mobile/caption · "Your code — share it once you're paid"
    INSTANCE Action/Link 196x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
      TEXT label 196x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "How check-in codes work"
    FRAME spacer-grow 8x328 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 183x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Show my payment code"
```

**Branch — the last checkpoint.** Arrival and completion *Confirmed ✓*; payment reads *"Your code — share
it once you're paid"*. **The branch ends here, at the payment code**, as ruled: the payment confirmation, the
completed state and the rating that would follow are the same screens the canonical story reaches after the
ruling (`5.2b` onward) and are not drawn twice.

### `5.4b` — Payment code · have you been paid?

**Reached from** `5.2p`, `5.5b`, and "Show my code" on `5.2b`, `5.2c`, `5.2d`  ·  **Leads to** `5.4c` ("Yes — show my code")  ·  **Exits** back → history

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Payment code"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 10
    TEXT context 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Shop assistant — weekend · Saman Stores"
    INSTANCE Display/CodePanel 328x192 [FIXED/HUG] · vertical pad 16 gap 12 · fill color/bg/default · r8 · {View=PaymentGate}
      TEXT gateQuestion 201x28 [HUG/HUG] · fill color/text/primary · mobile/title · "Have you been paid?"
      TEXT protection 296x60 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Share your code only after you have the money. It is your proof — it stops anyone later claiming you were never paid."
      INSTANCE Action/Button 211x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
        TEXT label 163x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Yes — show my code"
    TEXT why 328x60 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Entering it on their phone is what confirms payment. Only share it once the money is in your hand."
```

`Display/CodePanel {View=PaymentGate}` — the gate before the code is shown: *"Have you been paid?"*,
and why it matters: the code is the worker's proof against a later *never paid* claim.

### `5.4c` — Payment code · shown

**Reached from** `5.4b`  ·  **Leads to** nothing  ·  **Exits** back → history

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Payment code"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 10
    TEXT context 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Shop assistant — weekend · Saman Stores"
    INSTANCE Display/CodePanel 328x152 [FIXED/HUG] · vertical pad 16 gap 12 · fill color/bg/default · r8 · {View=Holder}
      FRAME codeBox 130x48 [HUG/HUG] · horizontal pad 10/16/10/16 gap 0 · fill color/bg/subtle · r8
        TEXT code 98x28 [HUG/HUG] · fill color/text/primary · mobile/title · "7 3 1 9 4 2"
      TEXT instruction 296x60 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Give this code to Saman Stores once you have been paid — they enter it to close the engagement."
    TEXT why 328x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Entering it on their phone confirms payment — the last checkpoint on this engagement."
```

`{View=Holder}`: **7 3 1 9 4 2**, Kavindu's payment code for this engagement, with the instruction to
give it to Saman Stores once paid. The same screen serves the branch and the post-ruling engagement: the
payment checkpoint is open in both (FR-ADM-08 as amended).

### `5.1` — My engagements · Monday: dispute open, cancellation request owed

**Reached from** the Engagements tab in the Monday–Wednesday journeys  ·  **Leads to** `5.2s` (Saman Stores row), `5.9` (Dilrukshi Herath row)

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    TEXT screenTitle 201x32 [HUG/HUG] · fill color/text/primary · mobile/display · "My engagements"
    INSTANCE Display/EngagementRow 328x84 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Action=None}
      FRAME topRow 198x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT counterparty 107x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Saman Stores"
        INSTANCE Display/Badge 83x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Engagement, Value=Disputed}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/state/urgent
          TEXT label 51x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Disputed"
      TEXT posting 180x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Shop assistant — weekend"
    INSTANCE Display/EngagementRow 328x140 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Action=Required}
      FRAME topRow 199x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT counterparty 123x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Dilrukshi Herath"
        INSTANCE Display/Badge 68x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Engagement, Value=Active}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 36x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Active"
      TEXT posting 154x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Grade 8 maths tutoring"
      TEXT nextAction 296x48 [FILL/HUG] · fill color/brand/primary · mobile/body-medium · "Asked to cancel — respond by Wed 2 Sep 2026"
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Worker} · [standard, see header]
```

**Monday 31 Aug – Wednesday 2 Sep.** Saman Stores is *Disputed* with **no action line** — Kavindu owes
nothing; Saman Stores does (FR-ENG-14 as amended: the action line names only what the viewer owes). Dilrukshi
is *Active* and owes **"Asked to cancel — respond by Wed 2 Sep 2026"**. Until 2026-09-24 this row put *Needs
response* inside an Active badge, and the Saman row owed a completion code on a day the case held the
engagement.

### `5.2s` — Engagement detail · Shop assistant, dispute open

**Reached from** the Saman Stores row on `5.1`, `5.1a`, `5.1r`; [M4](M4-applying.md) `4.3r` (Shop assistant row); back from [M9](M9-disputes.md) `9.2` after opening the case  ·  **Leads to** [M9](M9-disputes.md) `9.2` ("Open the dispute case"), [MHF](MHF-help.md) `HF.2` ("How check-in codes work")  ·  **Exits** back → history

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Engagement"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 10
    FRAME topRow 328x28 [FILL/HUG] · horizontal pad 0 gap 8
      TEXT counterparty 152x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Saman Stores"
      INSTANCE Display/Badge 77x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
        VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
        TEXT label 44x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Verified"
      INSTANCE Display/Badge 83x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Engagement, Value=Disputed}
        ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/state/urgent
        TEXT label 51x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Disputed"
    TEXT posting 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Shop assistant — weekend · Rs 7,000 for the job"
    TEXT cpHeader 66x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "CHECK-INS"
    FRAME cp-Arrival 328x44 [FILL/HUG] · horizontal pad 10/12/10/12 gap 10 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Arrival"
      TEXT cpState 204x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "Not confirmed — dispute open"
    FRAME cp-Completion 328x44 [FILL/HUG] · horizontal pad 10/12/10/12 gap 10 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Completion"
      TEXT cpState 204x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "Not reached"
    FRAME cp-Payment 328x44 [FILL/HUG] · horizontal pad 10/12/10/12 gap 12 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Payment"
      FRAME cpPayRight 202x16 [FILL/HUG] · vertical pad 0 gap 4
        TEXT cpState 202x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "Not reached"
    INSTANCE Action/Link 196x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
      TEXT label 196x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "How check-in codes work"
    TEXT cancelNote 328x96 [FILL/HUG] · fill color/text/primary · mobile/body · "You opened a dispute on 31 Aug 2026: arrival could not be confirmed. Saman Stores has until Wed 2 Sep 2026 to respond."
    FRAME spacer-grow 8x230 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 173x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Open the dispute case"
```

Added 2026-09-24. **The engagement while the case is open.** `{Family=Engagement, Value=Disputed}`;
arrival *"Not confirmed — dispute open"*; completion and payment *Not reached*. `cancelNote` gives the case
in one line — opened on 31 Aug, arrival could not be confirmed, Saman Stores has until Wed 2 Sep to respond
(FR-DISPUTE-04's 48 hours) — and *Open the dispute case* follows it (FR-DISPUTE-07).

### `5.9` — Cancellation request · respond by Wed 2 Sep

**Reached from** the Dilrukshi Herath row on `5.1`; [M4](M4-applying.md) `4.3r` (tutoring row); [M3](M3-discovery.md) `3.10q` (both tutoring rows)  ·  **Leads to** `5.9b` ("Accept"), `5.9r` ("Don't agree")  ·  **Exits** back → history

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Cancellation request"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 12
    TEXT who 328x48 [FIXED/HUG] · fill color/text/primary · mobile/body · "Dilrukshi Herath asked to cancel this engagement."
    TEXT context 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Grade 8 maths tutoring · Part-time"
    FRAME reasonBox 328x60 [FILL/HUG] · vertical pad 10/12/10/12 gap 4 · fill color/bg/subtle · r8
      TEXT reasonLabel 49x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "REASON"
      TEXT reason 296x20 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Schedule conflict"
    INSTANCE Display/CountdownText 255x20 [HUG/HUG] · horizontal pad 0 gap 0 · {Format=Deadline}
      TEXT countdown 255x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Respond by Wed 2 Sep 2026, 6:00 PM"
    TEXT regime 328x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Regular-gig rules apply — fixed when the request was made, even if the posting changes."
    TEXT silent 328x80 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Accept — the engagement is cancelled, with no penalty to you. Don't agree — it stands as agreed. If you don't respond by then, the request resolves against you."
    FRAME spacer-grow 8x308 [FIXED/FILL]
    FRAME actions 328x48 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Action/Button 160x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
        TEXT label 55x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Accept"
      INSTANCE Action/Button 160x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 89x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Don't agree"
```

**Dilrukshi's request, dated Mon 31 Aug** (M3 `3.10q`'s *Cancellation requested*, "2d ago" on Wednesday).
The tutoring start is Mon 7 Sep, more than 48 hours away, so FR-ENG-05's regular rules apply — decided at
the moment of the request (FR-ENG-05 as amended). The window closes **Wed 2 Sep 2026, 6:00 PM**, 48 hours
after the request; it read *Tue 1 Sep* until 2026-09-24. `silent` states what each answer does, and what
silence does: the request resolves against whoever does not respond.

### `5.9b` — Cancellation request · accepted

**Reached from** `5.9` ("Accept")  ·  **Leads to** `5.1a` ("Back to engagements")  ·  **Exits** back → `5.1a`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Cancellation request"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 12
    TEXT who 328x48 [FIXED/HUG] · fill color/text/primary · mobile/body · "Dilrukshi Herath asked to cancel this engagement."
    TEXT context 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Grade 8 maths tutoring · Part-time"
    TEXT outcome 328x72 [FIXED/HUG] · fill color/text/primary · mobile/body · "You accepted — this engagement is cancelled, with no penalty to you. Either of you can still rate it."
    FRAME spacer-grow 8x472 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 167x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Back to engagements"
```

Accepted: cancelled with no penalty to Kavindu, and either party may still rate it (FR-RATE-05).

### `5.1a` — My engagements · cancellation accepted

**Reached from** `5.9b`  ·  **Leads to** `5.2s` (Saman Stores row), `5.2tc` (Dilrukshi Herath row)

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    TEXT screenTitle 201x32 [HUG/HUG] · fill color/text/primary · mobile/display · "My engagements"
    INSTANCE Display/EngagementRow 328x84 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Action=None}
      FRAME topRow 198x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT counterparty 107x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Saman Stores"
        INSTANCE Display/Badge 83x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Engagement, Value=Disputed}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/state/urgent
          TEXT label 51x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Disputed"
      TEXT posting 180x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Shop assistant — weekend"
    INSTANCE Display/EngagementRow 328x84 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Action=None}
      FRAME topRow 220x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT counterparty 123x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Dilrukshi Herath"
        INSTANCE Display/Badge 89x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Engagement, Value=Cancelled}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/text/secondary
          TEXT label 57x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Cancelled"
      TEXT posting 154x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Grade 8 maths tutoring"
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Worker} · [standard, see header]
```

Saman Stores still *Disputed* (no action for Kavindu); tutoring *Cancelled*.

### `5.9r` — Cancellation request · not agreed

**Reached from** `5.9` ("Don't agree")  ·  **Leads to** `5.1r` ("Back to engagements")  ·  **Exits** back → `5.1r`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Cancellation request"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 12
    TEXT who 328x48 [FIXED/HUG] · fill color/text/primary · mobile/body · "Dilrukshi Herath asked to cancel this engagement."
    TEXT context 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Grade 8 maths tutoring · Part-time"
    TEXT outcome 328x96 [FIXED/HUG] · fill color/text/primary · mobile/body · "You didn't agree — the engagement stands as agreed, and Dilrukshi Herath has been told. You can still discuss changes with them directly."
    FRAME spacer-grow 8x448 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 167x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Back to engagements"
```

Not agreed: the engagement stands, and Dilrukshi has been told.

### `5.1r` — My engagements · cancellation refused, tutoring stands

**Reached from** `5.9r`  ·  **Leads to** `5.2s` (Saman Stores row), `5.2t` (Dilrukshi Herath row)

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    TEXT screenTitle 201x32 [HUG/HUG] · fill color/text/primary · mobile/display · "My engagements"
    INSTANCE Display/EngagementRow 328x84 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Action=None}
      FRAME topRow 198x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT counterparty 107x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Saman Stores"
        INSTANCE Display/Badge 83x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Engagement, Value=Disputed}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/state/urgent
          TEXT label 51x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Disputed"
      TEXT posting 180x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Shop assistant — weekend"
    INSTANCE Display/EngagementRow 328x84 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Action=None}
      FRAME topRow 199x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT counterparty 123x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Dilrukshi Herath"
        INSTANCE Display/Badge 68x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Engagement, Value=Active}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 36x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Active"
      TEXT posting 154x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Grade 8 maths tutoring"
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Worker} · [standard, see header]
```

The alternative answer: tutoring stays *Active*, no action owed.

### `5.1c` — My engagements · Friday 4 Sep, after the ruling

**Reached from** the Engagements tab in the Friday journeys; back from `5.2b`  ·  **Leads to** `5.2b` (Saman Stores row), `5.2tc` (Dilrukshi Herath row)

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    TEXT screenTitle 201x32 [HUG/HUG] · fill color/text/primary · mobile/display · "My engagements"
    INSTANCE Display/EngagementRow 328x116 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Action=Required}
      FRAME topRow 210x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT counterparty 107x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Saman Stores"
        INSTANCE Display/Badge 95x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Engagement, Value=Completed}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/state/success
          TEXT label 63x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Completed"
      TEXT posting 180x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Shop assistant — weekend"
      TEXT nextAction 296x24 [FILL/HUG] · fill color/brand/primary · mobile/body-medium · "Rate Saman Stores"
    INSTANCE Display/EngagementRow 328x84 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Action=None}
      FRAME topRow 220x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT counterparty 123x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Dilrukshi Herath"
        INSTANCE Display/Badge 89x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Engagement, Value=Cancelled}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/text/secondary
          TEXT label 57x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Cancelled"
      TEXT posting 154x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Grade 8 maths tutoring"
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Worker} · [standard, see header]
```

**Friday 4 Sep, after the ruling** (M9 `9.2f`, M10). Saman Stores *Completed* and owes **"Rate Saman
Stores"** — FR-ADM-08 opens rating when a ruling establishes the engagement happened. Tutoring *Cancelled*
(Dilrukshi's request was accepted, or resolved against a non-responder, by Wednesday).

### `5.2b` — Engagement detail · completed by the ruling

**Reached from** `5.1c`  ·  **Leads to** [M6](M6-ratings.md) `6.1` ("Rate now"), `5.4b` ("Show my code")  ·  **Exits** back → `5.1c`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Engagement"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 10
    FRAME topRow 328x28 [FILL/HUG] · horizontal pad 0 gap 8
      TEXT counterparty 140x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Saman Stores"
      INSTANCE Display/Badge 77x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
        VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
        TEXT label 44x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Verified"
      INSTANCE Display/Badge 95x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Engagement, Value=Completed}
        ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/state/success
        TEXT label 63x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Completed"
    TEXT posting 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Shop assistant — weekend · Rs 7,000 for the job"
    TEXT cpHeader 66x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "CHECK-INS"
    FRAME cp-Arrival 328x44 [FILL/HUG] · horizontal pad 10/12/10/12 gap 10 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Arrival"
      TEXT cpState 204x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "Settled by ruling · 4 Sep 2026"
    FRAME cp-Completion 328x44 [FILL/HUG] · horizontal pad 10/12/10/12 gap 10 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Completion"
      TEXT cpState 204x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "Settled by ruling · 4 Sep 2026"
    FRAME cp-Payment 328x100 [FILL/HUG] · horizontal pad 10/12/10/12 gap 12 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Payment"
      FRAME cpPayRight 202x80 [FILL/HUG] · vertical pad 0 gap 4
        TEXT cpState 202x32 [FILL/HUG] · fill color/text/secondary · mobile/caption · "Your code — share it once you're paid"
        INSTANCE Action/Link 112x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
          TEXT label 112x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Show my code"
    FRAME cp-Rating 328x84 [FILL/HUG] · horizontal pad 10/12/10/12 gap 12 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Rating"
      FRAME cpRatingRight 202x64 [FILL/HUG] · vertical pad 0 gap 4
        TEXT cpState 202x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "Not yet rated"
        INSTANCE Action/Link 71x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
          TEXT label 71x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Rate now"
    FRAME spacer-grow 8x298 [FIXED/FILL]
```

**Completed by the ruling.** Arrival and completion read **"Settled by ruling · 4 Sep 2026"** —
FR-ADM-08 as amended 2026-09-24 settles the checkpoints no code ever confirmed, marks the engagement
Completed and opens rating. **Payment stays open**: *"Your code — share it once you're paid"* with *Show my
code* — a ruling says the work happened, not that it was paid, and codes do not expire (FR-ENG-01). The
schema needs `CheckpointStatus.SETTLED_BY_RULING` for this (documented in `database-schema.md`; the schema
change is batched on its own branch). Until 2026-09-24 these screens showed all three checkpoints confirmed
by code, contradicting the dispute, and offered *End engagement*.

### `5.2c` — Engagement detail · completed by the ruling, rated

**Reached from** [M6](M6-ratings.md) `6.2` ("Back to engagement")  ·  **Leads to** [M6](M6-ratings.md) `6.2` ("View status"), `5.4b` ("Show my code")  ·  **Exits** back → `5.1cr`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Engagement"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 10
    FRAME topRow 328x28 [FILL/HUG] · horizontal pad 0 gap 8
      TEXT counterparty 140x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Saman Stores"
      INSTANCE Display/Badge 77x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
        VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
        TEXT label 44x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Verified"
      INSTANCE Display/Badge 95x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Engagement, Value=Completed}
        ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/state/success
        TEXT label 63x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Completed"
    TEXT posting 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Shop assistant — weekend · Rs 7,000 for the job"
    TEXT cpHeader 66x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "CHECK-INS"
    FRAME cp-Arrival 328x44 [FILL/HUG] · horizontal pad 10/12/10/12 gap 10 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Arrival"
      TEXT cpState 204x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "Settled by ruling · 4 Sep 2026"
    FRAME cp-Completion 328x44 [FILL/HUG] · horizontal pad 10/12/10/12 gap 10 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Completion"
      TEXT cpState 204x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "Settled by ruling · 4 Sep 2026"
    FRAME cp-Payment 328x100 [FILL/HUG] · horizontal pad 10/12/10/12 gap 12 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Payment"
      FRAME cpPayRight 202x80 [FILL/HUG] · vertical pad 0 gap 4
        TEXT cpState 202x32 [FILL/HUG] · fill color/text/secondary · mobile/caption · "Your code — share it once you're paid"
        INSTANCE Action/Link 112x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
          TEXT label 112x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Show my code"
    FRAME cp-Rating 328x84 [FILL/HUG] · horizontal pad 10/12/10/12 gap 12 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Rating"
      FRAME cpRatingRight 202x64 [FILL/HUG] · vertical pad 0 gap 4
        TEXT cpState 202x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "Submitted — awaiting reveal"
        INSTANCE Action/Link 89x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
          TEXT label 89x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "View status"
    FRAME spacer-grow 8x298 [FIXED/FILL]
```

Rated: *"Submitted — awaiting reveal"*, *View status* opening M6's `6.2` (unlock 18 Sep 2026 — 14 days
from the ruling). The back lands on the list in its rated state (`5.1cr`), not on the list Kavindu came from.

### `5.1cr` — My engagements · after rating

**Reached from** back on `5.2c`  ·  **Leads to** `5.2c` (Saman Stores row), `5.2tc` (Dilrukshi Herath row)

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    TEXT screenTitle 201x32 [HUG/HUG] · fill color/text/primary · mobile/display · "My engagements"
    INSTANCE Display/EngagementRow 328x84 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Action=None}
      FRAME topRow 210x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT counterparty 107x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Saman Stores"
        INSTANCE Display/Badge 95x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Engagement, Value=Completed}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/state/success
          TEXT label 63x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Completed"
      TEXT posting 180x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Shop assistant — weekend"
    INSTANCE Display/EngagementRow 328x84 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Action=None}
      FRAME topRow 220x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT counterparty 123x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Dilrukshi Herath"
        INSTANCE Display/Badge 89x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Engagement, Value=Cancelled}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/text/secondary
          TEXT label 57x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Cancelled"
      TEXT posting 154x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Grade 8 maths tutoring"
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Worker} · [standard, see header]
```

Saman Stores *Completed* with nothing owed; tutoring *Cancelled*.

### `5.1cv` — My engagements · Saturday 5 Sep, ratings revealed

**Reached from** the Engagements tab in the reveal journey  ·  **Leads to** `5.2d` (Saman Stores row), `5.2tc` (Dilrukshi Herath row)

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    TEXT screenTitle 201x32 [HUG/HUG] · fill color/text/primary · mobile/display · "My engagements"
    INSTANCE Display/EngagementRow 328x84 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Action=None}
      FRAME topRow 210x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT counterparty 107x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Saman Stores"
        INSTANCE Display/Badge 95x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Engagement, Value=Completed}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/state/success
          TEXT label 63x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Completed"
      TEXT posting 180x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Shop assistant — weekend"
    INSTANCE Display/EngagementRow 328x84 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Action=None}
      FRAME topRow 220x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT counterparty 123x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Dilrukshi Herath"
        INSTANCE Display/Badge 89x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Engagement, Value=Cancelled}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/text/secondary
          TEXT label 57x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Cancelled"
      TEXT posting 154x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Grade 8 maths tutoring"
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Worker} · [standard, see header]
```

**Saturday 5 Sep — both have rated, so the ratings are revealed** (FR-RATE-02; M3 `3.10`'s *Ratings are
in*). The list reads exactly like `5.1cr` — nothing is owed and no status changed — so the two frames are
identical; the difference is where the rows lead.

### `5.2d` — Engagement detail · ratings revealed

**Reached from** `5.1cv`; [M3](M3-discovery.md) `3.10` ("Rate your engagement" row, read after the reveal)  ·  **Leads to** [M6](M6-ratings.md) `6.3` ("See ratings"), `5.4b` ("Show my code")  ·  **Exits** back → history

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Engagement"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 10
    FRAME topRow 328x28 [FILL/HUG] · horizontal pad 0 gap 8
      TEXT counterparty 140x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Saman Stores"
      INSTANCE Display/Badge 77x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
        VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
        TEXT label 44x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Verified"
      INSTANCE Display/Badge 95x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Engagement, Value=Completed}
        ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/state/success
        TEXT label 63x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Completed"
    TEXT posting 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Shop assistant — weekend · Rs 7,000 for the job"
    TEXT cpHeader 66x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "CHECK-INS"
    FRAME cp-Arrival 328x44 [FILL/HUG] · horizontal pad 10/12/10/12 gap 10 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Arrival"
      TEXT cpState 204x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "Settled by ruling · 4 Sep 2026"
    FRAME cp-Completion 328x44 [FILL/HUG] · horizontal pad 10/12/10/12 gap 10 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Completion"
      TEXT cpState 204x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "Settled by ruling · 4 Sep 2026"
    FRAME cp-Payment 328x100 [FILL/HUG] · horizontal pad 10/12/10/12 gap 12 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Payment"
      FRAME cpPayRight 202x80 [FILL/HUG] · vertical pad 0 gap 4
        TEXT cpState 202x32 [FILL/HUG] · fill color/text/secondary · mobile/caption · "Your code — share it once you're paid"
        INSTANCE Action/Link 112x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
          TEXT label 112x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Show my code"
    FRAME cp-Rating 328x84 [FILL/HUG] · horizontal pad 10/12/10/12 gap 12 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Rating"
      FRAME cpRatingRight 202x64 [FILL/HUG] · vertical pad 0 gap 4
        TEXT cpState 202x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "Ratings revealed"
        INSTANCE Action/Link 86x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
          TEXT label 86x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "See ratings"
    FRAME spacer-grow 8x298 [FIXED/FILL]
```

Revealed: *See ratings* opens M6 `6.3`. The checkpoints still read *Settled by ruling*, and the payment
code is still available. M3 `3.10`'s *Rate your engagement* row opens this screen after the reveal, since
the rating it announced has already been given.

### `5.11` — Posting changed · re-confirm the new start

**Reached from** the Dilrukshi Herath row on `5.1w`  ·  **Leads to** `5.2t` ("Accept change"), `5.11d` ("Can't make it")  ·  **Exits** back → history

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Posting changed"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 12
    TEXT who 328x72 [FIXED/HUG] · fill color/text/primary · mobile/body · "Dilrukshi Herath moved the start of Grade 8 maths tutoring. Check the change and re-confirm."
    FRAME changeBox 328x92 [FILL/HUG] · vertical pad 10/12/10/12 gap 6 · fill color/bg/subtle · r8
      TEXT changeLabel 70x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "START TIME"
      TEXT oldVal 296x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Was: Mon 7 Sep 2026, 4:00 PM"
      TEXT newVal 296x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Now: Mon 7 Sep 2026, 6:00 PM"
    INSTANCE Display/CountdownText 262x20 [HUG/HUG] · horizontal pad 0 gap 0 · {Format=Deadline}
      TEXT countdown 262x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Respond by Mon 31 Aug 2026, 6:00 PM"
    TEXT window 328x60 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "If you don't accept by then, or you can't make it, the engagement is cancelled — recorded as Dilrukshi's change, not against you."
    FRAME spacer-grow 8x352 [FIXED/FILL]
    FRAME actions 328x48 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Action/Button 160x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
        TEXT label 116x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Accept change"
      INSTANCE Action/Button 160x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 100x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Can't make it"
```

**Saturday 29 Aug** — Dilrukshi moved the tutoring start from 4:00 to 6:00 PM on Mon 7 Sep. FR-ENG-09's
window is 48 hours: **"Respond by Mon 31 Aug 2026, 6:00 PM"** (it read *Fri 4 Sep* until 2026-09-24). `window`
states rules 4 and 5 as amended: not accepting in time, or saying *Can't make it*, cancels the engagement —
recorded as Dilrukshi's change, not against Kavindu.

### `5.2t` — Engagement detail · tutoring, change accepted, not started

**Reached from** `5.11` ("Accept change"), the Dilrukshi Herath row on `5.1v`, `5.1r`  ·  **Leads to** `5.7t` ("Cancel engagement"), [MHF](MHF-help.md) `HF.2` ("How check-in codes work")  ·  **Exits** back → history (after accepting the change, → `5.1v`)

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Engagement"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 10
    FRAME topRow 328x28 [FILL/HUG] · horizontal pad 0 gap 8
      TEXT counterparty 167x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Dilrukshi Herath"
      INSTANCE Display/Badge 77x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
        VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
        TEXT label 44x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Verified"
      INSTANCE Display/Badge 68x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Engagement, Value=Active}
        ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
        TEXT label 36x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Active"
    TEXT posting 328x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Grade 8 maths tutoring · Rs 1,800 per day · Mon, Wed, Fri 6–8 pm"
    TEXT cpHeader 66x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "CHECK-INS"
    FRAME cp-Arrival 328x52 [FILL/HUG] · horizontal pad 10/12/10/12 gap 10 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Arrival"
      TEXT cpState 204x32 [FILL/HUG] · fill color/text/secondary · mobile/caption · "Starts Mon 7 Sep 2026, 6:00 PM — Dilrukshi shows you a code then"
    FRAME cp-Completion 328x44 [FILL/HUG] · horizontal pad 10/12/10/12 gap 10 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Completion"
      TEXT cpState 204x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "Not reached"
    FRAME cp-Payment 328x44 [FILL/HUG] · horizontal pad 10/12/10/12 gap 12 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Payment"
      FRAME cpPayRight 202x16 [FILL/HUG] · vertical pad 0 gap 4
        TEXT cpState 202x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "Not reached"
    INSTANCE Action/Link 196x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
      TEXT label 196x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "How check-in codes work"
    FRAME spacer-grow 8x312 [FIXED/FILL]
    INSTANCE Action/Link 152x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
      TEXT label 152x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Cancel engagement"
```

**The tutoring job at its new time**: *"Mon, Wed, Fri 6–8 pm"*, arrival *"Starts Mon 7 Sep 2026, 6:00
PM — Dilrukshi shows you a code then"*. One set of codes covers the whole part-time engagement (FR-ENG-01 as
amended). *Cancel engagement* is offered because the engagement has not started (FR-ENG-05); End Engagement
would only appear after the first session (FR-ENG-12, not drawn — see below).

### `5.1v` — My engagements · change accepted (Sunday)

**Reached from** back on `5.2t` after accepting  ·  **Leads to** `5.2` (Saman Stores row), `5.2t` (Dilrukshi Herath row)

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    TEXT screenTitle 201x32 [HUG/HUG] · fill color/text/primary · mobile/display · "My engagements"
    INSTANCE Display/EngagementRow 328x116 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Action=Required}
      FRAME topRow 183x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT counterparty 107x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Saman Stores"
        INSTANCE Display/Badge 68x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Engagement, Value=Active}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 36x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Active"
      TEXT posting 180x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Shop assistant — weekend"
      TEXT nextAction 296x24 [FILL/HUG] · fill color/brand/primary · mobile/body-medium · "Enter arrival code"
    INSTANCE Display/EngagementRow 328x84 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Action=None}
      FRAME topRow 199x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT counterparty 123x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Dilrukshi Herath"
        INSTANCE Display/Badge 68x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Engagement, Value=Active}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 36x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Active"
      TEXT posting 154x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Grade 8 maths tutoring"
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Worker} · [standard, see header]
```

Sunday 30 Aug, after accepting: Saman Stores still owes the arrival code; tutoring *Active* with nothing
owed. Identical to `5.1tx` — Kavindu's own pending request, on that frame, owes him nothing either.

### `5.11d` — Engagement detail · tutoring cancelled, change declined

**Reached from** `5.11` ("Can't make it")  ·  **Leads to** [M6](M6-ratings.md) `6.6` ("Rate now")  ·  **Exits** back → history

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Engagement"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 10
    FRAME topRow 328x56 [FILL/HUG] · horizontal pad 0 gap 8
      TEXT counterparty 146x56 [FILL/HUG] · fill color/text/primary · mobile/title · "Dilrukshi Herath"
      INSTANCE Display/Badge 77x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
        VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
        TEXT label 44x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Verified"
      INSTANCE Display/Badge 89x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Engagement, Value=Cancelled}
        ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/text/secondary
        TEXT label 57x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Cancelled"
    TEXT posting 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Grade 8 maths tutoring · Rs 1,800 per day"
    TEXT cpHeader 66x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "CHECK-INS"
    FRAME cp-Arrival 328x44 [FILL/HUG] · horizontal pad 10/12/10/12 gap 10 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Arrival"
      TEXT cpState 204x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "—"
    FRAME cp-Completion 328x44 [FILL/HUG] · horizontal pad 10/12/10/12 gap 10 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Completion"
      TEXT cpState 204x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "—"
    FRAME cp-Payment 328x44 [FILL/HUG] · horizontal pad 10/12/10/12 gap 10 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Payment"
      TEXT cpState 204x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "—"
    TEXT cancelNote 328x144 [FILL/HUG] · fill color/text/primary · mobile/body · "Cancelled on 30 Aug 2026 — you declined the change Dilrukshi Herath made to the start time. It is recorded as her change, not your cancellation, so your completion rate is unaffected. Either of you can still rate this engagement."
    FRAME cp-Rating 328x84 [FILL/HUG] · horizontal pad 10/12/10/12 gap 12 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Rating"
      FRAME cpRatingRight 202x64 [FILL/HUG] · vertical pad 0 gap 4
        TEXT cpState 202x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "Not yet rated"
        INSTANCE Action/Link 71x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
          TEXT label 71x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Rate now"
    FRAME spacer-grow 8x172 [FIXED/FILL]
```

Added 2026-09-24 — **FR-ENG-09 rule 5**: *Can't make it* cancels at once. `cancelNote`: *"Cancelled on
30 Aug 2026 — you declined the change Dilrukshi Herath made to the start time. It is recorded as her change,
not your cancellation, so your completion rate is unaffected. Either of you can still rate this
engagement."* Rating is optional (FR-RATE-05) and opens M6 `6.6`.

### `5.11dr` — Engagement detail · change declined, rated

**Reached from** [M6](M6-ratings.md) `6.6d` ("Back to engagement")  ·  **Leads to** [M6](M6-ratings.md) `6.6d` ("View status")  ·  **Exits** back → `5.1a`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Engagement"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 10
    FRAME topRow 328x56 [FILL/HUG] · horizontal pad 0 gap 8
      TEXT counterparty 146x56 [FILL/HUG] · fill color/text/primary · mobile/title · "Dilrukshi Herath"
      INSTANCE Display/Badge 77x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
        VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
        TEXT label 44x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Verified"
      INSTANCE Display/Badge 89x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Engagement, Value=Cancelled}
        ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/text/secondary
        TEXT label 57x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Cancelled"
    TEXT posting 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Grade 8 maths tutoring · Rs 1,800 per day"
    TEXT cpHeader 66x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "CHECK-INS"
    FRAME cp-Arrival 328x44 [FILL/HUG] · horizontal pad 10/12/10/12 gap 10 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Arrival"
      TEXT cpState 204x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "—"
    FRAME cp-Completion 328x44 [FILL/HUG] · horizontal pad 10/12/10/12 gap 10 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Completion"
      TEXT cpState 204x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "—"
    FRAME cp-Payment 328x44 [FILL/HUG] · horizontal pad 10/12/10/12 gap 10 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Payment"
      TEXT cpState 204x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "—"
    TEXT cancelNote 328x144 [FILL/HUG] · fill color/text/primary · mobile/body · "Cancelled on 30 Aug 2026 — you declined the change Dilrukshi Herath made to the start time. It is recorded as her change, not your cancellation, so your completion rate is unaffected. Either of you can still rate this engagement."
    FRAME cp-Rating 328x84 [FILL/HUG] · horizontal pad 10/12/10/12 gap 12 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Rating"
      FRAME cpRatingRight 202x64 [FILL/HUG] · vertical pad 0 gap 4
        TEXT cpState 202x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "Submitted — awaiting reveal"
        INSTANCE Action/Link 89x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
          TEXT label 89x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "View status"
    FRAME spacer-grow 8x172 [FIXED/FILL]
```

Added 2026-09-24. Rated — *"Submitted — awaiting reveal"*, *View status* opening M6 `6.6d` (unlock
13 Sep 2026, 14 days from the cancellation on 30 Aug).

### `5.7t` — Cancel engagement · reason, regular rules (tutoring)

**Reached from** `5.2t` ("Cancel engagement")  ·  **Leads to** `5.8t` ("Send cancellation request")  ·  **Exits** back → `5.2t`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Cancel engagement"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 10
    TEXT context 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Grade 8 maths tutoring · Dilrukshi Herath"
    TEXT q 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Why are you cancelling?"
    FRAME reason-Schedule conflict 328x48 [FILL/HUG] · horizontal pad 12 gap 0 · fill color/bg/subtle · r8
      TEXT reasonLabel 131x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Schedule conflict"
    FRAME reason-Gig details no longer suitable 328x48 [FILL/HUG] · horizontal pad 12 gap 0 · r8
      TEXT reasonLabel 220x24 [HUG/HUG] · fill color/text/primary · mobile/body · "Gig details no longer suitable"
    FRAME reason-Found other work 328x48 [FILL/HUG] · horizontal pad 12 gap 0 · r8
      TEXT reasonLabel 134x24 [HUG/HUG] · fill color/text/primary · mobile/body · "Found other work"
    FRAME reason-Personal or family emergency 328x48 [FILL/HUG] · horizontal pad 12 gap 0 · r8
      TEXT reasonLabel 224x24 [HUG/HUG] · fill color/text/primary · mobile/body · "Personal or family emergency"
    FRAME reason-Other 328x48 [FILL/HUG] · horizontal pad 12 gap 0 · r8
      TEXT reasonLabel 43x24 [HUG/HUG] · fill color/text/primary · mobile/body · "Other"
    TEXT regimeNote 328x60 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "This is a regular gig: Dilrukshi Herath gets 48 hours to respond before the cancellation takes effect."
    FRAME spacer-grow 8x230 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 199x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Send cancellation request"
```

Kavindu asks to cancel the tutoring job (the accept-change branch, before 7 Sep). The fixed reasons
(FR-ENG-05), and `regimeNote`: regular rules — Dilrukshi gets 48 hours.

### `5.8t` — Cancellation request sent

**Reached from** `5.7t`  ·  **Leads to** `5.2tx` ("Back to engagement")

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x800 [FILL/FILL] · vertical pad 24 gap 12
    FRAME sentGlyph 56x56 [FIXED/FIXED]
      ELLIPSE Ellipse 56x56 [FIXED/FIXED] @0,0 · stroke color/state/success 2.5
      VECTOR Vector 25x18 [FIXED/FIXED] @16,20 · stroke color/state/success 3
    TEXT title 128x28 [HUG/HUG] · fill color/text/primary · mobile/title · "Request sent"
    TEXT line1 280x60 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · align center · "Dilrukshi Herath has 48 hours to respond. If she doesn't, the cancellation takes effect."
    TEXT regime 280x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · align center · "This request runs under regular-gig rules, fixed when you sent it."
    INSTANCE Action/Button 206x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 158x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Back to engagement"
```

*"This request runs under regular-gig rules, fixed when you sent it."* — the regime is decided at the moment of the request (FR-ENG-05 as amended).

### `5.2tx` — Engagement detail · tutoring, cancellation requested by you

**Reached from** `5.8t`, the Dilrukshi Herath row on `5.1tx`  ·  **Leads to** [MHF](MHF-help.md) `HF.2` ("How check-in codes work")  ·  **Exits** back → `5.1tx`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Engagement"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 10
    FRAME topRow 328x28 [FILL/HUG] · horizontal pad 0 gap 8
      TEXT counterparty 167x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Dilrukshi Herath"
      INSTANCE Display/Badge 77x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
        VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
        TEXT label 44x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Verified"
      INSTANCE Display/Badge 68x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Engagement, Value=Active}
        ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
        TEXT label 36x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Active"
    TEXT posting 328x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Grade 8 maths tutoring · Rs 1,800 per day · Mon, Wed, Fri 6–8 pm"
    TEXT cpHeader 66x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "CHECK-INS"
    FRAME cp-Arrival 328x52 [FILL/HUG] · horizontal pad 10/12/10/12 gap 10 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Arrival"
      TEXT cpState 204x32 [FILL/HUG] · fill color/text/secondary · mobile/caption · "Starts Mon 7 Sep 2026, 6:00 PM — Dilrukshi shows you a code then"
    FRAME cp-Completion 328x44 [FILL/HUG] · horizontal pad 10/12/10/12 gap 10 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Completion"
      TEXT cpState 204x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "Not reached"
    FRAME cp-Payment 328x44 [FILL/HUG] · horizontal pad 10/12/10/12 gap 12 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Payment"
      FRAME cpPayRight 202x16 [FILL/HUG] · vertical pad 0 gap 4
        TEXT cpState 202x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "Not reached"
    INSTANCE Action/Link 196x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
      TEXT label 196x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "How check-in codes work"
    TEXT cancelNote 328x120 [FILL/HUG] · fill color/text/primary · mobile/body · "Cancellation requested — Dilrukshi Herath has 48 hours to accept or reject. If she doesn't respond, the cancellation takes effect. Until then the engagement stays as agreed."
    FRAME spacer-grow 8x236 [FIXED/FILL]
```

The engagement stays as agreed while the request is open; if Dilrukshi does not respond, the cancellation takes effect.

### `5.1tx` — My engagements · your cancellation request pending

**Reached from** back on `5.2tx`  ·  **Leads to** `5.2` (Saman Stores row), `5.2tx` (Dilrukshi Herath row)

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    TEXT screenTitle 201x32 [HUG/HUG] · fill color/text/primary · mobile/display · "My engagements"
    INSTANCE Display/EngagementRow 328x116 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Action=Required}
      FRAME topRow 183x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT counterparty 107x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Saman Stores"
        INSTANCE Display/Badge 68x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Engagement, Value=Active}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 36x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Active"
      TEXT posting 180x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Shop assistant — weekend"
      TEXT nextAction 296x24 [FILL/HUG] · fill color/brand/primary · mobile/body-medium · "Enter arrival code"
    INSTANCE Display/EngagementRow 328x84 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Action=None}
      FRAME topRow 199x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT counterparty 123x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Dilrukshi Herath"
        INSTANCE Display/Badge 68x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Engagement, Value=Active}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 36x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Active"
      TEXT posting 154x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Grade 8 maths tutoring"
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Worker} · [standard, see header]
```

Tutoring *Active* with no action for Kavindu — the response is Dilrukshi's to give.

### `5.2tc` — Engagement detail · tutoring cancelled at Dilrukshi's request

**Reached from** the Dilrukshi Herath row on `5.1a`, `5.1c`, `5.1cr`, `5.1cv`; [M3](M3-discovery.md) `3.10`, `3.10r` (both tutoring rows)  ·  **Leads to** [M6](M6-ratings.md) `6.6` ("Rate now")  ·  **Exits** back → history

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Engagement"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 10
    FRAME topRow 328x56 [FILL/HUG] · horizontal pad 0 gap 8
      TEXT counterparty 146x56 [FILL/HUG] · fill color/text/primary · mobile/title · "Dilrukshi Herath"
      INSTANCE Display/Badge 77x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
        VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
        TEXT label 44x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Verified"
      INSTANCE Display/Badge 89x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Engagement, Value=Cancelled}
        ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/text/secondary
        TEXT label 57x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Cancelled"
    TEXT posting 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Grade 8 maths tutoring · Rs 1,800 per day"
    TEXT cpHeader 66x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "CHECK-INS"
    FRAME cp-Arrival 328x44 [FILL/HUG] · horizontal pad 10/12/10/12 gap 10 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Arrival"
      TEXT cpState 204x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "—"
    FRAME cp-Completion 328x44 [FILL/HUG] · horizontal pad 10/12/10/12 gap 10 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Completion"
      TEXT cpState 204x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "—"
    FRAME cp-Payment 328x44 [FILL/HUG] · horizontal pad 10/12/10/12 gap 10 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Payment"
      TEXT cpState 204x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "—"
    TEXT cancelNote 328x96 [FILL/HUG] · fill color/text/primary · mobile/body · "Cancelled — Dilrukshi Herath asked to cancel and you accepted. No penalty to you; either of you can still rate this engagement."
    FRAME cp-Rating 328x84 [FILL/HUG] · horizontal pad 10/12/10/12 gap 12 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Rating"
      FRAME cpRatingRight 202x64 [FILL/HUG] · vertical pad 0 gap 4
        TEXT cpState 202x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "Not yet rated"
        INSTANCE Action/Link 71x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
          TEXT label 71x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Rate now"
    FRAME spacer-grow 8x220 [FIXED/FILL]
```

Cancelled at Dilrukshi's request, accepted by Kavindu. *Rate now* opens M6 `6.6`; rating a cancelled
engagement is available but not chased (FR-RATE-05). The copy was reworded on 2026-09-24 to say rating is
optional.

### `5.2tcr` — Engagement detail · tutoring cancelled, rated

**Reached from** [M6](M6-ratings.md) `6.6b` ("Back to engagement")  ·  **Leads to** [M6](M6-ratings.md) `6.6b` ("View status")  ·  **Exits** back → `5.1a`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Engagement"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 10
    FRAME topRow 328x56 [FILL/HUG] · horizontal pad 0 gap 8
      TEXT counterparty 146x56 [FILL/HUG] · fill color/text/primary · mobile/title · "Dilrukshi Herath"
      INSTANCE Display/Badge 77x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
        VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
        TEXT label 44x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Verified"
      INSTANCE Display/Badge 89x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Engagement, Value=Cancelled}
        ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/text/secondary
        TEXT label 57x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Cancelled"
    TEXT posting 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Grade 8 maths tutoring · Rs 1,800 per day"
    TEXT cpHeader 66x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "CHECK-INS"
    FRAME cp-Arrival 328x44 [FILL/HUG] · horizontal pad 10/12/10/12 gap 10 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Arrival"
      TEXT cpState 204x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "—"
    FRAME cp-Completion 328x44 [FILL/HUG] · horizontal pad 10/12/10/12 gap 10 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Completion"
      TEXT cpState 204x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "—"
    FRAME cp-Payment 328x44 [FILL/HUG] · horizontal pad 10/12/10/12 gap 10 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Payment"
      TEXT cpState 204x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "—"
    TEXT cancelNote 328x96 [FILL/HUG] · fill color/text/primary · mobile/body · "Cancelled — Dilrukshi Herath asked to cancel and you accepted. No penalty to you; either of you can still rate this engagement."
    FRAME cp-Rating 328x84 [FILL/HUG] · horizontal pad 10/12/10/12 gap 12 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Rating"
      FRAME cpRatingRight 202x64 [FILL/HUG] · vertical pad 0 gap 4
        TEXT cpState 202x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "Submitted — awaiting reveal"
        INSTANCE Action/Link 89x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
          TEXT label 89x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "View status"
    FRAME spacer-grow 8x220 [FIXED/FILL]
```

Rated — *View status* opens M6 `6.6b` (unlock 14 Sep 2026, 14 days from the cancellation on 31 Aug).

### `5.1nw` — My engagements · Nethmi, before the start

**Reached from** the Engagements tab on Nethmi's screens  ·  **Leads to** `5.2n` (Lanka Events row)

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    TEXT screenTitle 201x32 [HUG/HUG] · fill color/text/primary · mobile/display · "My engagements"
    INSTANCE Display/EngagementRow 328x84 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Action=None}
      FRAME topRow 249x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT counterparty 173x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Lanka Events (Pvt) Ltd"
        INSTANCE Display/Badge 68x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Engagement, Value=Active}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 36x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Active"
      TEXT posting 192x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Event setup crew (3 needed)"
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Worker} · [standard, see header]
```

**Nethmi Jayasinghe, Saturday 29 Aug, about 2:00 AM.** Her one engagement: Lanka Events' Event setup crew, *Active*.

### `5.2n` — Engagement detail · Nethmi, five hours before the start

**Reached from** `5.1nw`  ·  **Leads to** `5.10` ("Cancel engagement"), [MHF](MHF-help.md) `HF.2` ("How check-in codes work")  ·  **Exits** back → `5.1nw`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Engagement"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 10
    FRAME topRow 328x56 [FILL/HUG] · horizontal pad 0 gap 8
      TEXT counterparty 167x56 [FILL/HUG] · fill color/text/primary · mobile/title · "Lanka Events (Pvt) Ltd"
      INSTANCE Display/Badge 77x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
        VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
        TEXT label 44x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Verified"
      INSTANCE Display/Badge 68x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Engagement, Value=Active}
        ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
        TEXT label 36x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Active"
    TEXT posting 328x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Event setup crew (3 needed) · Rs 6,000 for the job · Urgent"
    TEXT cpHeader 66x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "CHECK-INS"
    FRAME cp-Arrival 328x52 [FILL/HUG] · horizontal pad 10/12/10/12 gap 10 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Arrival"
      TEXT cpState 204x32 [FILL/HUG] · fill color/text/secondary · mobile/caption · "Starts Sat 29 Aug 2026, 7:00 AM — in 5 hours"
    FRAME cp-Completion 328x44 [FILL/HUG] · horizontal pad 10/12/10/12 gap 10 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Completion"
      TEXT cpState 204x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "Not reached"
    FRAME cp-Payment 328x44 [FILL/HUG] · horizontal pad 10/12/10/12 gap 12 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Payment"
      FRAME cpPayRight 202x16 [FILL/HUG] · vertical pad 0 gap 4
        TEXT cpState 202x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "Not reached"
    INSTANCE Action/Link 196x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
      TEXT label 196x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "How check-in codes work"
    FRAME spacer-grow 8x284 [FIXED/FILL]
    INSTANCE Action/Link 152x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
      TEXT label 152x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Cancel engagement"
```

**An alternative branch of Nethmi's Saturday.** The start is **7:00 AM** — it moved on Thursday and she
re-confirmed by Friday 1:00 PM (M2) — so *"in 5 hours"* places this at 2:00 AM. It read *5:00 AM* until
2026-09-24.

### `5.10` — Cancel engagement · urgent, immediate, late (Nethmi)

**Reached from** `5.2n`  ·  **Leads to** `5.1n` ("Cancel now")  ·  **Exits** back → `5.2n`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Cancel engagement"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 12
    FRAME urgentRow 247x24 [HUG/HUG] · horizontal pad 0 gap 8
      INSTANCE Display/Badge 74x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/state/urgent 1 · r999 · {Family=Urgent, Value=Default}
        VECTOR triangle 10x9 [FIXED/FIXED] · fill color/state/urgent
        TEXT label 39x16 [HUG/HUG] · fill color/state/urgent · mobile/caption · "Urgent"
      TEXT context 165x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Event setup crew (3 needed)"
    TEXT imm 328x72 [FIXED/HUG] · fill color/text/primary · mobile/body · "This gig is urgent, so cancelling takes effect immediately — there is no approval step. Lanka Events is told now."
    TEXT late 328x60 [FIXED/HUG] · fill color/state/urgent · mobile/secondary · "It starts in under 6 hours, so this is a late cancellation: it weighs twice on your completion rate."
    TEXT q 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Why are you cancelling?"
    FRAME reason-Schedule conflict 328x48 [FILL/HUG] · horizontal pad 12 gap 0 · fill color/bg/subtle · r8
      TEXT reasonLabel 131x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Schedule conflict"
    FRAME reason-Gig details no longer suitable 328x48 [FILL/HUG] · horizontal pad 12 gap 0 · r8
      TEXT reasonLabel 220x24 [HUG/HUG] · fill color/text/primary · mobile/body · "Gig details no longer suitable"
    FRAME reason-Found other work 328x48 [FILL/HUG] · horizontal pad 12 gap 0 · r8
      TEXT reasonLabel 134x24 [HUG/HUG] · fill color/text/primary · mobile/body · "Found other work"
    FRAME reason-Personal or family emergency 328x48 [FILL/HUG] · horizontal pad 12 gap 0 · r8
      TEXT reasonLabel 224x24 [HUG/HUG] · fill color/text/primary · mobile/body · "Personal or family emergency"
    FRAME reason-Other 328x48 [FILL/HUG] · horizontal pad 12 gap 0 · r8
      TEXT reasonLabel 43x24 [HUG/HUG] · fill color/text/primary · mobile/body · "Other"
    FRAME spacer-grow 8x120 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/state/danger · r8 · {Style=Destructive, State=Default}
      TEXT label 90x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Cancel now"
```

**FR-ENG-06, immediate and late.** The start is under 48 hours away, so cancelling takes effect at once
(the regime is decided at the moment of cancelling); under 6 hours before the start, it is Late and weighs
twice on her completion rate (FR-ENG-07). The fixed reasons (FR-ENG-05) were added to this screen on
2026-09-24; it had none.

### `5.1n` — My engagements · Nethmi, after cancelling

**Reached from** `5.10`  ·  **Leads to** `5.2nc` (Lanka Events row)

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    TEXT screenTitle 201x32 [HUG/HUG] · fill color/text/primary · mobile/display · "My engagements"
    INSTANCE Display/EngagementRow 328x84 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Action=None}
      FRAME topRow 270x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT counterparty 173x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Lanka Events (Pvt) Ltd"
        INSTANCE Display/Badge 89x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Engagement, Value=Cancelled}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/text/secondary
          TEXT label 57x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Cancelled"
      TEXT posting 192x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Event setup crew (3 needed)"
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Worker} · [standard, see header]
```

Her list after cancelling: *Cancelled*.

### `5.2nc` — Engagement detail · Nethmi's cancelled engagement

**Reached from** `5.1n`  ·  **Leads to** nothing  ·  **Exits** back → `5.1n`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Engagement"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 10
    FRAME topRow 328x56 [FILL/HUG] · horizontal pad 0 gap 8
      TEXT counterparty 146x56 [FILL/HUG] · fill color/text/primary · mobile/title · "Lanka Events (Pvt) Ltd"
      INSTANCE Display/Badge 77x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
        VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
        TEXT label 44x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Verified"
      INSTANCE Display/Badge 89x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Engagement, Value=Cancelled}
        ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/text/secondary
        TEXT label 57x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Cancelled"
    TEXT posting 328x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Event setup crew (3 needed) · Rs 6,000 for the job"
    TEXT cpHeader 66x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "CHECK-INS"
    FRAME cp-Arrival 328x44 [FILL/HUG] · horizontal pad 10/12/10/12 gap 10 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Arrival"
      TEXT cpState 204x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "—"
    FRAME cp-Completion 328x44 [FILL/HUG] · horizontal pad 10/12/10/12 gap 10 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Completion"
      TEXT cpState 204x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "—"
    FRAME cp-Payment 328x44 [FILL/HUG] · horizontal pad 10/12/10/12 gap 10 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Payment"
      TEXT cpState 204x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "—"
    TEXT cancelNote 328x120 [FILL/HUG] · fill color/text/primary · mobile/body · "Cancelled by you on 29 Aug 2026, under 6 hours before the start — a late cancellation. It weighs twice on your completion rate, and Lanka Events has been told."
    FRAME spacer-grow 8x270 [FIXED/FILL]
```

*"Cancelled by you on 29 Aug 2026, under 6 hours before the start — a late cancellation."* It was
dated 28 Aug until 2026-09-24, and `5.1n` used to call it Lanka Events' late cancellation.

### `5.1e` — My engagements · Lanka Events, Thursday evening

**Reached from** the employer Engagements tab  ·  **Leads to** `5.12` (Nethmi Jayasinghe row), `5.3t` (Tharindu Silva row)

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    TEXT screenTitle 201x32 [HUG/HUG] · fill color/text/primary · mobile/display · "My engagements"
    INSTANCE Display/EngagementRow 328x84 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Action=None}
      FRAME topRow 223x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT counterparty 147x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Nethmi Jayasinghe"
        INSTANCE Display/Badge 68x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Engagement, Value=Active}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 36x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Active"
      TEXT posting 192x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Event setup crew (3 needed)"
    INSTANCE Display/EngagementRow 328x84 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Action=None}
      FRAME topRow 185x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT counterparty 109x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Tharindu Silva"
        INSTANCE Display/Badge 68x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Engagement, Value=Active}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 36x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Active"
      TEXT posting 179x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Stage crew — Friday setup"
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Employer} · [standard, see header]
```

**Lanka Events, Thursday 27 Aug, evening.** Nethmi (Event setup crew) and Tharindu (Stage crew, starting
Fri 28 Aug 8:00 AM), both *Active* with nothing owed by the employer — Nethmi's re-confirmation is hers to
give. The same screen is the employer Engagements tab everywhere on Thursday.

### `5.12` — Change responses · Nethmi's re-confirmation

**Reached from** the Nethmi Jayasinghe row on `5.1e`, `5.1ex`; [M2](M2-posting.md) `2.11c` ("Start time changed to 7:00 AM")  ·  **Leads to** nothing  ·  **Exits** back → history

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Change responses"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 12
    TEXT context 328x32 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Event setup crew (3 needed) · start time changed to 7:00 AM"
    TEXT note 328x80 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Each worker responds separately. If a worker doesn't accept in time, their engagement is cancelled — recorded as your change, not against them."
    FRAME slot-Nethmi 328x72 [FILL/HUG] · horizontal pad 12 gap 10 · fill color/bg/default · r8
      TEXT slotName 174x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Nethmi Jayasinghe"
      TEXT slotState 120x48 [FIXED/HUG] · fill color/brand/primary · mobile/caption · "Waiting — until Fri 28 Aug 2026, 1:00 PM"
```

The employer's side of FR-ENG-11: each worker answers separately. Nethmi is *"Waiting — until Fri 28 Aug
2026, 1:00 PM"* — the change was saved at 7:00 PM Thursday with 36 hours to the start, so the window is 18
hours. The note states FR-ENG-09 rule 4. Only one place is filled, so one row.

### `5.3t` — Engagement detail, employer · Stage crew before the start

**Reached from** the Tharindu Silva row on `5.1e`; [M2](M2-posting.md) `2.11f` ("See engagement")  ·  **Leads to** `5.7e` ("Cancel engagement"), [MHF](MHF-help.md) `HF.2` ("How check-in codes work")  ·  **Exits** back → history

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Engagement"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 10
    FRAME topRow 328x28 [FILL/HUG] · horizontal pad 0 gap 8
      TEXT counterparty 167x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Tharindu Silva"
      INSTANCE Display/Badge 77x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
        VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
        TEXT label 44x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Verified"
      INSTANCE Display/Badge 68x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Engagement, Value=Active}
        ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
        TEXT label 36x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Active"
    TEXT posting 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Stage crew — Friday setup · Rs 4,000 for the job"
    TEXT cpHeader 66x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "CHECK-INS"
    FRAME cp-Arrival 328x52 [FILL/HUG] · horizontal pad 10/12/10/12 gap 10 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Arrival"
      TEXT cpState 204x32 [FILL/HUG] · fill color/text/secondary · mobile/caption · "Code issued at the start — Fri 28 Aug 2026, 8:00 AM"
    FRAME cp-Completion 328x44 [FILL/HUG] · horizontal pad 10/12/10/12 gap 10 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Completion"
      TEXT cpState 204x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "Not reached"
    FRAME cp-Payment 328x44 [FILL/HUG] · horizontal pad 10/12/10/12 gap 10 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Payment"
      TEXT cpState 204x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "Not reached"
    INSTANCE Action/Link 196x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
      TEXT label 196x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "How check-in codes work"
    FRAME spacer-grow 8x332 [FIXED/FILL]
    INSTANCE Action/Link 152x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
      TEXT label 152x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Cancel engagement"
```

**Thursday, before the start.** *"Code issued at the start — Fri 28 Aug 2026, 8:00 AM"*. M2's `2.11f` opens
this screen on Thursday; until 2026-09-24 it showed Friday's arrival already confirmed (carried from M2,
now closed). *Cancel engagement* is live because the engagement has not started.

### `5.7e` — Cancel engagement · employer, urgent and late (Stage crew)

**Reached from** `5.3t`  ·  **Leads to** `5.1ex` ("Cancel now")  ·  **Exits** back → `5.3t`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Cancel engagement"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 10
    TEXT context 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Stage crew — Friday setup · Tharindu Silva"
    TEXT q 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Why are you cancelling?"
    FRAME reason-Schedule conflict 328x48 [FILL/HUG] · horizontal pad 12 gap 0 · fill color/bg/subtle · r8
      TEXT reasonLabel 131x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Schedule conflict"
    FRAME reason-Gig details no longer suitable 328x48 [FILL/HUG] · horizontal pad 12 gap 0 · r8
      TEXT reasonLabel 220x24 [HUG/HUG] · fill color/text/primary · mobile/body · "Gig details no longer suitable"
    FRAME reason-Found other work 328x48 [FILL/HUG] · horizontal pad 12 gap 0 · r8
      TEXT reasonLabel 134x24 [HUG/HUG] · fill color/text/primary · mobile/body · "Found other work"
    FRAME reason-Personal or family emergency 328x48 [FILL/HUG] · horizontal pad 12 gap 0 · r8
      TEXT reasonLabel 224x24 [HUG/HUG] · fill color/text/primary · mobile/body · "Personal or family emergency"
    FRAME reason-Other 328x48 [FILL/HUG] · horizontal pad 12 gap 0 · r8
      TEXT reasonLabel 43x24 [HUG/HUG] · fill color/text/primary · mobile/body · "Other"
    TEXT regimeNote 328x80 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Stage crew starts in 12 hours, so cancelling takes effect immediately and Tharindu Silva is told now. It was booked well ahead and the start is under 24 hours away, so this is a late cancellation."
    FRAME spacer-grow 8x210 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/state/danger · r8 · {Style=Destructive, State=Default}
      TEXT label 90x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Cancel now"
```

**Lanka Events cancels Tharindu, Thursday 8:00 PM — 12 hours before the start.** The start is under 48
hours away, so FR-ENG-06 applies: immediate, no approval step. Stage crew was booked well ahead (more than
48 hours before the start), so a cancellation inside the last 24 hours is Late (FR-ENG-06 as amended). *Cancel
now* is `{Style=Destructive}`.

### `5.1ex` — My engagements · Lanka Events, Stage crew cancelled

**Reached from** `5.7e`  ·  **Leads to** `5.12` (Nethmi Jayasinghe row), `5.3x` (Tharindu Silva row)

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    TEXT screenTitle 201x32 [HUG/HUG] · fill color/text/primary · mobile/display · "My engagements"
    INSTANCE Display/EngagementRow 328x84 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Action=None}
      FRAME topRow 223x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT counterparty 147x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Nethmi Jayasinghe"
        INSTANCE Display/Badge 68x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Engagement, Value=Active}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 36x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Active"
      TEXT posting 192x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Event setup crew (3 needed)"
    INSTANCE Display/EngagementRow 328x84 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Action=None}
      FRAME topRow 206x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT counterparty 109x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Tharindu Silva"
        INSTANCE Display/Badge 89x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Engagement, Value=Cancelled}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/text/secondary
          TEXT label 57x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Cancelled"
      TEXT posting 179x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Stage crew — Friday setup"
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Employer} · [standard, see header]
```

Stage crew *Cancelled*; Nethmi unchanged.

### `5.3x` — Engagement detail, employer · Stage crew cancelled

**Reached from** the Tharindu Silva row on `5.1ex`, `5.1eu`, `5.1ec`, `5.1ecr`  ·  **Leads to** [MHF](MHF-help.md) `HF.2` ("How check-in codes work")  ·  **Exits** back → history

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Engagement"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 10
    FRAME topRow 328x28 [FILL/HUG] · horizontal pad 0 gap 8
      TEXT counterparty 146x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Tharindu Silva"
      INSTANCE Display/Badge 77x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
        VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
        TEXT label 44x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Verified"
      INSTANCE Display/Badge 89x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Engagement, Value=Cancelled}
        ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/text/secondary
        TEXT label 57x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Cancelled"
    TEXT posting 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Stage crew — Friday setup · Rs 4,000 for the job"
    TEXT cpHeader 66x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "CHECK-INS"
    FRAME cp-Arrival 328x44 [FILL/HUG] · horizontal pad 10/12/10/12 gap 10 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Arrival"
      TEXT cpState 204x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "—"
    FRAME cp-Completion 328x44 [FILL/HUG] · horizontal pad 10/12/10/12 gap 10 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Completion"
      TEXT cpState 204x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "—"
    FRAME cp-Payment 328x44 [FILL/HUG] · horizontal pad 10/12/10/12 gap 10 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Payment"
      TEXT cpState 204x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "—"
    INSTANCE Action/Link 196x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
      TEXT label 196x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "How check-in codes work"
    TEXT cancelNote 328x144 [FILL/HUG] · fill color/text/primary · mobile/body · "Cancelled by you on Thu 27 Aug 2026, 8:00 PM. The start was 12 hours away on an engagement booked well ahead, so it is a late cancellation. Tharindu Silva has been told, and the place on Stage crew reopened."
    FRAME spacer-grow 8x240 [FIXED/FILL]
```

*"Cancelled by you on Thu 27 Aug 2026, 8:00 PM. The start was 12 hours away on an engagement booked
well ahead, so it is a late cancellation. Tharindu Silva has been told, and the place on Stage crew reopened."*
— FR-ENG-08: one slot reopens. The staff postings table (M10 `10.7b`) shows Stage crew *Expired*: nobody
filled the reopened place before its start.

### `5.1eu` — My engagements · Lanka Events, Saturday morning

**Reached from** the employer Engagements tab in the Saturday-morning journey  ·  **Leads to** `5.3` (Nethmi Jayasinghe row), `5.3x` (Tharindu Silva row)

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    TEXT screenTitle 201x32 [HUG/HUG] · fill color/text/primary · mobile/display · "My engagements"
    INSTANCE Display/EngagementRow 328x116 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Action=Required}
      FRAME topRow 223x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT counterparty 147x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Nethmi Jayasinghe"
        INSTANCE Display/Badge 68x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Engagement, Value=Active}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 36x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Active"
      TEXT posting 192x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Event setup crew (3 needed)"
      TEXT nextAction 296x24 [FILL/HUG] · fill color/brand/primary · mobile/body-medium · "Show completion code"
    INSTANCE Display/EngagementRow 328x84 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Action=None}
      FRAME topRow 206x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT counterparty 109x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Tharindu Silva"
        INSTANCE Display/Badge 89x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Engagement, Value=Cancelled}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/text/secondary
          TEXT label 57x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Cancelled"
      TEXT posting 179x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Stage crew — Friday setup"
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Employer} · [standard, see header]
```

**Saturday morning.** Nethmi *Active*, owing the employer's step: **"Show completion code"**. Stage crew *Cancelled*.

### `5.3` — Engagement detail, employer · Nethmi arrived

**Reached from** `5.1eu`  ·  **Leads to** `5.4` ("Show completion code"), [MHF](MHF-help.md) `HF.2` ("How check-in codes work")  ·  **Exits** back → `5.1eu`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Engagement"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 10
    FRAME topRow 328x56 [FILL/HUG] · horizontal pad 0 gap 8
      TEXT counterparty 167x56 [FILL/HUG] · fill color/text/primary · mobile/title · "Nethmi Jayasinghe"
      INSTANCE Display/Badge 77x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
        VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
        TEXT label 44x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Verified"
      INSTANCE Display/Badge 68x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Engagement, Value=Active}
        ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
        TEXT label 36x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Active"
    TEXT posting 328x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Event setup crew (3 needed) · Rs 6,000 for the job"
    TEXT cpHeader 66x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "CHECK-INS"
    FRAME cp-Arrival 328x44 [FILL/HUG] · horizontal pad 10/12/10/12 gap 10 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Arrival"
      TEXT cpState 204x16 [FILL/HUG] · fill color/state/success · mobile/caption · "Confirmed ✓"
    FRAME cp-Completion 328x52 [FILL/HUG] · horizontal pad 10/12/10/12 gap 10 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Completion"
      TEXT cpState 204x32 [FILL/HUG] · fill color/brand/primary · mobile/caption · "Show your code when the work is done"
    FRAME cp-Payment 328x44 [FILL/HUG] · horizontal pad 10/12/10/12 gap 10 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Payment"
      TEXT cpState 204x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "Not reached"
    INSTANCE Action/Link 196x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
      TEXT label 196x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "How check-in codes work"
    FRAME spacer-grow 8x280 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 175x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Show completion code"
```

Nethmi arrived: *Confirmed ✓*. Completion is the employer's live step — *"Show your code when the work is
done"* — and payment *Not reached*. The fixed total is *Rs 6,000 for the job*, as on the worker's side (it
read *per worker* until 2026-09-24).

### `5.4` — Completion code · employer holds

**Reached from** `5.3`  ·  **Leads to** nothing  ·  **Exits** back → `5.3`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Completion code"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 10
    TEXT context 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Event setup crew (3 needed) · Nethmi Jayasinghe"
    INSTANCE Display/CodePanel 328x132 [FIXED/HUG] · vertical pad 16 gap 12 · fill color/bg/default · r8 · {View=Holder}
      FRAME codeBox 132x48 [HUG/HUG] · horizontal pad 10/16/10/16 gap 0 · fill color/bg/subtle · r8
        TEXT code 100x28 [HUG/HUG] · fill color/text/primary · mobile/title · "4 8 2 9 1 3"
      TEXT instruction 296x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Show this code to the worker when the work is done."
    TEXT why 328x60 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Entering it on their phone is what confirms completion. Only share it when the work is actually finished."
```

`{View=Holder}`: **4 8 2 9 1 3**, Lanka Events' completion code for Nethmi. The employer holds arrival and completion; the worker holds payment (FR-ENG-01).

### `5.1ec` — My engagements · Lanka Events, Nethmi completed

**Reached from** the employer Engagements tab in the rating journey  ·  **Leads to** `5.3b` (Nethmi Jayasinghe row), `5.3x` (Tharindu Silva row)

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    TEXT screenTitle 201x32 [HUG/HUG] · fill color/text/primary · mobile/display · "My engagements"
    INSTANCE Display/EngagementRow 328x116 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Action=Required}
      FRAME topRow 250x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT counterparty 147x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Nethmi Jayasinghe"
        INSTANCE Display/Badge 95x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Engagement, Value=Completed}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/state/success
          TEXT label 63x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Completed"
      TEXT posting 192x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Event setup crew (3 needed)"
      TEXT nextAction 296x24 [FILL/HUG] · fill color/brand/primary · mobile/body-medium · "Rate Nethmi Jayasinghe"
    INSTANCE Display/EngagementRow 328x84 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Action=None}
      FRAME topRow 206x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT counterparty 109x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Tharindu Silva"
        INSTANCE Display/Badge 89x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Engagement, Value=Cancelled}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/text/secondary
          TEXT label 57x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Cancelled"
      TEXT posting 179x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Stage crew — Friday setup"
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Employer} · [standard, see header]
```

Nethmi *Completed*, owing **"Rate Nethmi Jayasinghe"** — every checkpoint confirmed by code, so rating opens (FR-RATE-05).

### `5.3b` — Engagement detail, employer · completed by codes

**Reached from** `5.1ec`  ·  **Leads to** [M6](M6-ratings.md) `6.1e` ("Rate now")  ·  **Exits** back → `5.1ec`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Engagement"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 10
    FRAME topRow 328x56 [FILL/HUG] · horizontal pad 0 gap 8
      TEXT counterparty 140x56 [FILL/HUG] · fill color/text/primary · mobile/title · "Nethmi Jayasinghe"
      INSTANCE Display/Badge 77x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
        VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
        TEXT label 44x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Verified"
      INSTANCE Display/Badge 95x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Engagement, Value=Completed}
        ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/state/success
        TEXT label 63x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Completed"
    TEXT posting 328x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Event setup crew (3 needed) · Rs 6,000 for the job"
    TEXT cpHeader 66x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "CHECK-INS"
    FRAME cp-Arrival 328x44 [FILL/HUG] · horizontal pad 10/12/10/12 gap 10 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Arrival"
      TEXT cpState 204x16 [FILL/HUG] · fill color/state/success · mobile/caption · "Confirmed ✓"
    FRAME cp-Completion 328x44 [FILL/HUG] · horizontal pad 10/12/10/12 gap 10 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Completion"
      TEXT cpState 204x16 [FILL/HUG] · fill color/state/success · mobile/caption · "Confirmed ✓"
    FRAME cp-Payment 328x44 [FILL/HUG] · horizontal pad 10/12/10/12 gap 10 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Payment"
      TEXT cpState 204x16 [FILL/HUG] · fill color/state/success · mobile/caption · "Confirmed ✓ · paid in hand"
    FRAME cp-Rating 328x84 [FILL/HUG] · horizontal pad 10/12/10/12 gap 12 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Rating"
      FRAME cpRatingRight 202x64 [FILL/HUG] · vertical pad 0 gap 4
        TEXT cpState 202x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "Not yet rated"
        INSTANCE Action/Link 71x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
          TEXT label 71x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Rate now"
    FRAME spacer-grow 8x306 [FIXED/FILL]
```

**The story's one engagement completed entirely by codes.** Arrival, completion, and payment *"Confirmed
✓ · paid in hand"*, all `color/state/success`. *Rate now* opens M6 `6.1e`. No *End engagement*: a one-off
gig completes through its checkpoints.

### `5.3c` — Engagement detail, employer · completed, rated

**Reached from** [M6](M6-ratings.md) `6.2e` ("Back to engagement")  ·  **Leads to** [M6](M6-ratings.md) `6.2e` ("View status")  ·  **Exits** back → `5.1ecr`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Engagement"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 10
    FRAME topRow 328x56 [FILL/HUG] · horizontal pad 0 gap 8
      TEXT counterparty 140x56 [FILL/HUG] · fill color/text/primary · mobile/title · "Nethmi Jayasinghe"
      INSTANCE Display/Badge 77x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
        VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
        TEXT label 44x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Verified"
      INSTANCE Display/Badge 95x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Engagement, Value=Completed}
        ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/state/success
        TEXT label 63x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Completed"
    TEXT posting 328x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Event setup crew (3 needed) · Rs 6,000 for the job"
    TEXT cpHeader 66x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "CHECK-INS"
    FRAME cp-Arrival 328x44 [FILL/HUG] · horizontal pad 10/12/10/12 gap 10 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Arrival"
      TEXT cpState 204x16 [FILL/HUG] · fill color/state/success · mobile/caption · "Confirmed ✓"
    FRAME cp-Completion 328x44 [FILL/HUG] · horizontal pad 10/12/10/12 gap 10 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Completion"
      TEXT cpState 204x16 [FILL/HUG] · fill color/state/success · mobile/caption · "Confirmed ✓"
    FRAME cp-Payment 328x44 [FILL/HUG] · horizontal pad 10/12/10/12 gap 10 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Payment"
      TEXT cpState 204x16 [FILL/HUG] · fill color/state/success · mobile/caption · "Confirmed ✓ · paid in hand"
    FRAME cp-Rating 328x84 [FILL/HUG] · horizontal pad 10/12/10/12 gap 12 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Rating"
      FRAME cpRatingRight 202x64 [FILL/HUG] · vertical pad 0 gap 4
        TEXT cpState 202x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "Submitted — awaiting reveal"
        INSTANCE Action/Link 89x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
          TEXT label 89x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "View status"
    FRAME spacer-grow 8x306 [FIXED/FILL]
```

Rated — *View status* opens M6 `6.2e` (unlock 12 Sep 2026, 14 days from Saturday).

### `5.1ecr` — My engagements · Lanka Events, after rating

**Reached from** back on `5.3c`  ·  **Leads to** `5.3c` (Nethmi Jayasinghe row), `5.3x` (Tharindu Silva row)

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    TEXT screenTitle 201x32 [HUG/HUG] · fill color/text/primary · mobile/display · "My engagements"
    INSTANCE Display/EngagementRow 328x84 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Action=None}
      FRAME topRow 250x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT counterparty 147x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Nethmi Jayasinghe"
        INSTANCE Display/Badge 95x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Engagement, Value=Completed}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/state/success
          TEXT label 63x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Completed"
      TEXT posting 192x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Event setup crew (3 needed)"
    INSTANCE Display/EngagementRow 328x84 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Action=None}
      FRAME topRow 206x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT counterparty 109x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Tharindu Silva"
        INSTANCE Display/Badge 89x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Engagement, Value=Cancelled}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/text/secondary
          TEXT label 57x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Cancelled"
      TEXT posting 179x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Stage crew — Friday setup"
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Employer} · [standard, see header]
```

Nethmi *Completed* with nothing owed.

### `5.1es` — My engagements · Saman Stores, dispute to answer

**Reached from** Saman Stores' Engagements tab  ·  **Leads to** `5.3s` (Kavindu Perera row)

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    TEXT screenTitle 201x32 [HUG/HUG] · fill color/text/primary · mobile/display · "My engagements"
    INSTANCE Display/EngagementRow 328x140 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Action=Required}
      FRAME topRow 207x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT counterparty 116x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Kavindu Perera"
        INSTANCE Display/Badge 83x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Engagement, Value=Disputed}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/state/urgent
          TEXT label 51x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Disputed"
      TEXT posting 180x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Shop assistant — weekend"
      TEXT nextAction 296x48 [FILL/HUG] · fill color/brand/primary · mobile/body-medium · "Respond to the dispute — by Wed 2 Sep 2026"
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Employer} · [standard, see header]
```

**Saman Stores, Monday 31 Aug.** Kavindu's row is *Disputed* and owes **"Respond to the dispute — by
Wed 2 Sep 2026"** — the respondent's side of the row Kavindu sees without an action (FR-ENG-14 as amended:
the status is shared, the owed action is per party).

### `5.3s` — Engagement detail, employer · dispute open

**Reached from** `5.1es`  ·  **Leads to** [M9](M9-disputes.md) `9.2r` ("Open the dispute case"), [MHF](MHF-help.md) `HF.2` ("How check-in codes work")  ·  **Exits** back → `5.1es`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Engagement"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 10
    FRAME topRow 328x28 [FILL/HUG] · horizontal pad 0 gap 8
      TEXT counterparty 152x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Kavindu Perera"
      INSTANCE Display/Badge 77x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
        VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
        TEXT label 44x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Verified"
      INSTANCE Display/Badge 83x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Engagement, Value=Disputed}
        ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/state/urgent
        TEXT label 51x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Disputed"
    TEXT posting 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Shop assistant — weekend · Rs 7,000 for the job"
    TEXT cpHeader 66x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "CHECK-INS"
    FRAME cp-Arrival 328x44 [FILL/HUG] · horizontal pad 10/12/10/12 gap 10 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Arrival"
      TEXT cpState 204x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "Not confirmed — dispute open"
    FRAME cp-Completion 328x44 [FILL/HUG] · horizontal pad 10/12/10/12 gap 10 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Completion"
      TEXT cpState 204x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "Not reached"
    FRAME cp-Payment 328x44 [FILL/HUG] · horizontal pad 10/12/10/12 gap 10 · fill color/bg/subtle · r8
      TEXT cpLabel 90x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Payment"
      TEXT cpState 204x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "Not reached"
    INSTANCE Action/Link 196x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
      TEXT label 196x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "How check-in codes work"
    TEXT cancelNote 328x96 [FILL/HUG] · fill color/text/primary · mobile/body · "Kavindu Perera opened a dispute on 31 Aug 2026: arrival could not be confirmed. Respond by Wed 2 Sep 2026 — after that, review goes ahead without your side."
    FRAME spacer-grow 8x230 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 173x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Open the dispute case"
```

The respondent's engagement view: *Disputed*; arrival *Not confirmed — dispute open* in
`color/text/secondary` (it was success-green until 2026-09-24); completion and payment *Not reached* rather
than live steps, because the case holds the engagement. *Open the dispute case* opens M9 `9.2r`.

### `5.1z` — My engagements · worker, first run

**Reached from** the Engagements tab on a new worker's screens (first run, and Thursday 27 Aug before anyone selects Kavindu)  ·  **Leads to** [M3](M3-discovery.md) `3.2` / `3.1` ("Browse gigs", first run / Thursday)

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    TEXT screenTitle 201x32 [HUG/HUG] · fill color/text/primary · mobile/display · "My engagements"
    INSTANCE Feedback/EmptyState 328x216 [FILL/HUG] · vertical pad 32/24/32/24 gap 8 · fill color/bg/default · r10 · {Cause=NoneExist}
      TEXT title 201x28 [HUG/HUG] · fill color/text/primary · mobile/title · "No engagements yet"
      TEXT body 280x60 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · align center · "When an employer selects you the gig moves here, with its check-in steps and the codes you need to enter."
      INSTANCE Action/Button 142x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 94x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Browse gigs"
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=false, Role=Worker} · [standard, see header]
```

FR-ENG-14's empty state for a worker: `Feedback/EmptyState {Cause=NoneExist}`, *Browse gigs*, and
`Notification badge=false`. It is also Kavindu's Engagements tab on Thursday 27 Aug — nobody has selected him
yet.

### `5.1ez` — My engagements · employer, first run

**Reached from** the Engagements tab on a new employer's screens, and on Dilrukshi Herath's and R. Gunasekara's  ·  **Leads to** [M2](M2-posting.md) `2.1n` ("Post a gig")

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    TEXT screenTitle 201x32 [HUG/HUG] · fill color/text/primary · mobile/display · "My engagements"
    INSTANCE Feedback/EmptyState 328x216 [FILL/HUG] · vertical pad 32/24/32/24 gap 8 · fill color/bg/default · r10 · {Cause=NoneExist}
      TEXT title 201x28 [HUG/HUG] · fill color/text/primary · mobile/title · "No engagements yet"
      TEXT body 280x60 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · align center · "When you select an applicant the engagement starts here, and you can share the check-in codes."
      INSTANCE Action/Button 124x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 76x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Post a gig"
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=false, Role=Employer} · [standard, see header]
```

The employer's empty state, *Post a gig*. It is also what Dilrukshi Herath's (Thursday evening, before
she selects anyone) and R. Gunasekara's Engagements tab opens; until 2026-09-24 both opened Lanka Events'
list.

## Every screen shows one moment

Each screen is one moment, and within each journey time only moves forward. Alternative branches of one
decision sit side by side, and every frame on a branch is true on its own.

| When | Screens | What is true then |
| --- | --- | --- |
| **Thu 27 Aug** | `5.1z` (Kavindu) · `5.1e`, `5.12`, `5.3t`, `5.7e`, `5.1ex`, `5.3x` (Lanka Events, evening) | Nobody has selected Kavindu yet. Lanka Events moved the Event setup start at 7:00 PM (Nethmi re-confirms by Fri 1:00 PM) and cancels Tharindu's Stage crew at 8:00 PM |
| **Fri 28 Aug, afternoon** | — (M4) | Saman Stores and Dilrukshi select Kavindu |
| **Sat 29 Aug, ~2:00 AM** | `5.1nw`, `5.2n`, `5.10`, `5.1n`, `5.2nc` | *Branch:* Nethmi cancels, late |
| **Sat 29 Aug, from 7:00 AM** | `5.1eu`, `5.3`, `5.4`, then `5.1ec`, `5.3b`, `5.3c`, `5.1ecr` | Nethmi works the Event setup shift; every code is exchanged; Lanka Events rates her |
| **Sat 29 Aug, from 8:00 AM** | `5.1w`, `5.2`, `5.5a`, `5.11` | Kavindu's Shop assistant shift starts; the arrival code is never confirmed. Dilrukshi moves the tutoring start |
| **Sat 29 – Sun 30 Aug** | `5.2h`, `5.5`, `5.5b`, `5.2p`, `5.4b`, `5.4c` | *Branch:* the codes are exchanged — ends at the payment code |
| **Sat 29 – Sun 30 Aug** | `5.2t`, `5.1v`, `5.7t`, `5.8t`, `5.2tx`, `5.1tx` · `5.11d`, `5.11dr` | Kavindu accepts the tutoring change (and, on a further branch, asks to cancel) · *or* declines it (30 Aug) |
| **Sun 30 Aug, 8:00 AM** | `5.14` | The stalled prompt, over `5.2` |
| **Mon 31 Aug – Wed 2 Sep** | `5.6`, `5.1`, `5.2s`, `5.9`, `5.9b`, `5.1a`, `5.9r`, `5.1r` · `5.1es`, `5.3s` | Kavindu opens the arrival dispute (31 Aug); Saman Stores must respond by Wed 2 Sep. Dilrukshi asks to cancel the tutoring job (31 Aug, respond by Wed 2 Sep 6:00 PM) |
| **Fri 4 Sep** | `5.1c`, `5.2b`, `5.2c`, `5.1cr`, `5.2tc`, `5.2tcr` | The ruling: the engagement happened. Arrival and completion settled by ruling; rating opens; payment still open |
| **Sat 5 Sep** | `5.1cv`, `5.2d` | Both have rated: revealed |
| **No date** | `5.1ez`, `5.4b` / `5.4c` (whenever shown) | First run; the payment code |

**Ratings unlock** 14 days after rating opened, unless both rate first (FR-RATE-02): Saman Stores 18 Sep ·
Nethmi 12 Sep · tutoring, cancelled on request, 14 Sep · tutoring, change declined, 13 Sep (M6).

## Engagement rules this module follows

| Rule | Where it shows |
| --- | --- |
| **Three codes; the employer holds arrival and completion, the worker holds payment** (FR-ENG-01) | `5.4`, `5.5a`, `5.5`, `5.4b`, `5.4c` |
| **The checkpoints run in order; one code set per engagement** (FR-ENG-01 as amended 2026-09-24) | *Not reached* on every later checkpoint; `5.2t` for part-time |
| **Codes are per engagement** (FR-ENG-04) | four distinct codes across the module |
| **Unable to confirm opens a dispute** (FR-ENG-03, FR-DISPUTE-03) | `5.5a`, `5.5` → `5.6` → M9 |
| **More than 48 hours out: a request with a 48-hour window** (FR-ENG-05 as amended) | `5.9`, `5.7t`, `5.8t`, `5.2tx` |
| **48 hours or less: immediate; Late within 6 hours, or within 24 hours if booked more than 48 hours ahead** (FR-ENG-06 as amended) | `5.10`, `5.2nc` · `5.7e`, `5.3x` |
| **One cancellation reopens one slot** (FR-ENG-08) | `5.3x` |
| **Material change: re-confirm within the shorter of 48 hours and half the time left; declining cancels at once, as the employer's change** (FR-ENG-09 rules 1, 4, 5) | `5.11`, `5.11d`, `5.12` |
| **Each worker re-confirms separately** (FR-ENG-11) | `5.12` |
| **The stalled prompt: dismiss, or go to the unresolved checkpoint** (FR-ENG-13 as amended) | `5.14` |
| **Status and owed action are separate; the action is the viewer's** (FR-ENG-14 as amended) | every list; `5.1` beside `5.1es` |
| **A ruling that it happened settles unreached checkpoints and opens rating; payment stays open** (FR-ADM-08 as amended) | `5.2b`, `5.2c`, `5.2d` |
| **Rating opens when a gig completes by codes; available but not chased after a cancellation** (FR-RATE-05) | `5.1ec`, `5.3b` · `5.2tc`, `5.11d` |

## Rulings this module follows

Ruled on 2026-09-24, after the findings were checked by an independent review.

- **End Engagement is part-time only.** FR-ENG-12, FR-ENG-13 and FR-RATE-05 all scope it that way, and
  FR-POST-13's 30-day close is posting expiry, not a way of ending an engagement. The End-engagement screens
  drawn on the two one-off gigs were deleted — `5.13`, `5.13b`, `5.13br`, `5.13r`, `5.13e`, `5.13eb`,
  `5.13ebr`, `5.13er`, `5.2ce`, `5.3ce` — and FR-ENG-12 is recorded as not drawn (below).
- **The Saman Stores engagement follows one story.** No code is exchanged; Kavindu opens an arrival dispute
  on Mon 31 Aug; the ruling on Fri 4 Sep settles it. The code-exchange path is kept as a labelled Saturday–
  Sunday branch that ends at the payment code.
- **Lanka Events cancels Tharindu's Stage crew on Thursday evening, before its Friday start** — urgent,
  immediate and late. The branch where Lanka Events cancelled Nethmi was deleted: it had nothing to add
  beside Nethmi's own urgent cancellation.
- **The requirements were amended to match:** FR-ENG-01 (order, one code set), FR-ENG-05/06 (regime decided
  at the moment of cancellation), FR-ENG-09 rule 5 (declining cancels at once), FR-ENG-13 (what the prompt
  offers), FR-ENG-14 (status versus owed action), FR-ADM-08 (settled by ruling, payment left open).
- **Seven more frames were deleted because no moment could show them:** Kavindu's regular 48-hour
  cancellation request on the Shop assistant engagement after it had started (`5.7`, `5.8`, `5.1x`), Lanka
  Events' request on Stage crew after its arrival and its completion code (`5.8e`, `5.4t`), and Lanka
  Events cancelling Nethmi (`5.10e`, `5.3nc`). `5.2x` became `5.2p`. Eight frames were added: `5.1w`,
  `5.1v`, `5.1nw`, `5.2h`, `5.2s`, `5.5a`, `5.11d`, `5.11dr` — 66 frames became 57.

## What the collapsed tab bar hides

`Chrome/TabBar` reads `[standard, see header]` on every list. Under it, **`Role`** is Worker or Employer as
the screen belongs, and **`Notification badge`** is `true` everywhere except the two first-run lists.
Engagement details, code screens and cancellation screens carry a `Chrome/ScreenHeader` instead.

**Tab destinations are not drawn on this page.** The demo routes the Engagements tab per journey, so it
opens the list of the same moment: `5.1z` on Thursday, `5.1w` on the weekend, `5.1v` after accepting the
change, `5.1` Monday to Wednesday, `5.1a` in the rating-a-cancellation journey, `5.1c` on Friday, `5.1cv` on
Saturday 5 Sep; Nethmi's `5.1nw` / `5.1n` either side of her cancellation; and for employers `5.1e`
(Thursday), `5.1eu` (Saturday morning), `5.1ec` (after completion), `5.1es` (Saman Stores) and `5.1ez`
(employers with none).

## States not drawn in this module

| Not drawn | Build it from |
| --- | --- |
| **End Engagement** (FR-ENG-12) — the only part-time engagement is cancelled or not yet started in every branch of the story | `5.2t` after the first session with an *End engagement* link → a `Feedback/ConfirmDialog` asking *"Did something go wrong?"* (Yes → `5.6`'s pattern; No → M6 `6.1`), then the detail with `{Family=Engagement, Value=Ended}` |
| The **employer's arrival code** | `5.4` with the title and instruction for arrival — *"Show this code to the worker when they arrive"* |
| The **employer entering the worker's payment code** | `5.5`'s pattern (`{View=Enterer}`) on the employer's side, instruction *"Enter the code the worker shows you once you've paid them"* |
| The **employer's stalled prompt** (FR-ENG-13 prompts both parties) | `5.14`'s `promptCard` over `5.3` |
| A **wrong code** (recorded, never locked — FR-ENG-01 batch A17) | `5.5a` with `Feedback/FieldError` under the code input; the attempt is counted for the moderator's history |
| An **unpaid internship's** engagement (FR-ENG-02) | any detail with the `cp-Payment` row removed |
| The **completion dispute's later states** on the branch | M9's `9.2u` → `9.2f` pattern, with `9.2k`'s trigger line |
| **Nethmi's re-confirmation** of the Event setup start (the worker's side of `5.12`) | `5.11` with Lanka Events' change — *Was: Sat 29 Aug 2026, 5:00 AM · Now: 7:00 AM*, respond by Fri 28 Aug 2026, 1:00 PM |
| A **multi-worker** change-responses list (FR-ENG-11) | `5.12` with a `slot-` row per selected worker, each with its own state |
| A cancellation request **resolved by silence** (FR-ENG-05) | `5.9b` / `5.9r`'s outcome line reworded for the auto-resolution, on the non-responder's and the requester's side |
| **Dilrukshi's employer screens** for the tutoring engagement | `5.1e`, `5.3t` and `5.12`'s patterns with her engagement; her incoming side of Kavindu's request is `5.9` with the roles swapped |

## Open, and carried to the modules that own them

- **M1, M3: Dilrukshi's and R. Gunasekara's Notifications and Profile tabs** still open Lanka Events'
  screens. Their Engagements tab now opens the empty employer list (`5.1ez`), which is true for both.
