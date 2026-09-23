# M10 — Moderation

**Thirty-nine frames on this page; forty-one screens by id.** Three M10 screens live on [M11](M11-dashboard.md) (`10.6n`, `10.6nb`, `10.7`) and one frame here (`11.3g`) belongs to M11 by number — each sits where its click-through is a *same-page* edge, because a Figma prototype link cannot cross pages. The README's module table carries both counts for that reason.

This is the staff side of the product: the web dashboard where a case stops being a notification and becomes a decision. The module's organising idea is stated inside it, on `10.8` — **Moderator handles volume** (triage, warnings, escalation), **Admin handles consequence** (rulings, suspension, removal). Twenty-six frames are Moderator and thirteen are Admin, and the boundary between them is enforced by which buttons *exist* rather than by which are disabled.

**Four threads share the queue** — two disputes, a flagged listing, and a promotion. They are tabulated at the end, under *Four threads through one queue*; read that first if you are working out why the same composer appears three times.

Read `README.md` first for the notation, and `design-system.md` for the tokens and components. **`design-system.md` §6 collapses the dashboard sidebar and header**, so those lines read `[standard, see header]` throughout — see *What the collapsed header hides* before treating two identical trees as the same screen.

---

### `10.1` — Case review

**Reached from** [M11](M11-dashboard.md) case queue  ·  **Leads to** nothing  ·  **Advances to** `10.1r` after 2s †

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator, Active=Case queue} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator} · [standard, see header]
  FRAME content 1200x580 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 404x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Dispute — arrival could not be confirmed · Awaiting response"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Shop assistant — weekend · Raised by Kavindu Perera (worker) · Respondent: Saman Stores (employer)"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Response window closes 2 Sep 2026 — Saman Stores has 48 hours from case open."
    INSTANCE Desktop/SectionCard 1152x74 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 102x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Evidence so far"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "No party statements yet — the response window is open."
    INSTANCE Desktop/SectionCard 1152x126 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 156x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Code-exchange history"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Arrival — no code entered"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Completion — not reached"
      TEXT row3 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Payment — not reached"
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 47x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Parties"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Kavindu Perera — Verified · New to YouthLink · Endorsed (Sunil Bandara)"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Saman Stores — Employer (Business) · 12 completed engagements · no prior warnings"
    FRAME actions 610x48 [HUG/HUG] · horizontal pad 0 gap 12
      INSTANCE Action/Button 205x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/border/default 1.5 · r8 · {Style=Secondary, State=Disabled}
        TEXT label 157x24 [HUG/HUG] · fill color/text/secondary · mobile/body-medium · "Request clarification"
      INSTANCE Action/Button 195x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/border/default 1.5 · r8 · {Style=Secondary, State=Disabled}
        TEXT label 147x24 [HUG/HUG] · fill color/text/secondary · mobile/body-medium · "Close with warning"
      INSTANCE Action/Button 186x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/subtle · stroke color/border/default 1 · r8 · {Style=Primary, State=Disabled}
        TEXT label 138x24 [HUG/HUG] · fill color/text/secondary · mobile/body-medium · "Escalate to Admin"
    TEXT disabledReason 1100x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Actions unlock when the response window closes or a response arrives."
  [frame reaction] AFTER_TIMEOUT 2s
```

**All three actions are `{State=Disabled}`,** and `disabledReason` says why: *"Actions unlock when
the response window closes or a response arrives."* `FR-MOD-01` gives the Moderator both parties' evidence
before a decision, so the decision is withheld until there is evidence to weigh — the respondent's 48
hours are `FR-DISPUTE-04`'s window seen from the other side of the desk.

The `Evidence so far` card is **74 tall** here and carries one row. It grows to 100 when a response
arrives and 126 when a clarification is answered — the card height is the case's progress.

### `10.1a` — Case review · clarification answered

**Reached from** `10.1c`  ·  **Leads to** `10.3s`  ·  **Opens** `10.1e`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator, Active=Case queue} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator} · [standard, see header]
  FRAME content 1200x632 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 394x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Dispute — arrival could not be confirmed · Ready for review"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Shop assistant — weekend · Raised by Kavindu Perera (worker) · Respondent: Saman Stores (employer)"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Clarification answered 2 Sep 2026 — ready for review."
    INSTANCE Desktop/SectionCard 1152x126 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 102x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Evidence so far"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Kavindu Perera (raiser), 31 Aug 2026: “I arrived just before 8 AM — the shop was closed and no one answered.”"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Saman Stores (respondent), 1 Sep 2026: “I was away from the shop that morning, but my brother was there and the worker did arrive.” · 2 photos attached"
      TEXT row3 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Clarification — Kavindu Perera answered: “I arrived just before 8 AM. The shop was closed; the stall holder next door saw me waiting.”"
    INSTANCE Desktop/SectionCard 1152x126 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 156x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Code-exchange history"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Arrival — no code entered"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Completion — not reached"
      TEXT row3 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Payment — not reached"
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 47x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Parties"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Kavindu Perera — Verified · New to YouthLink · Endorsed (Sunil Bandara)"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Saman Stores — Employer (Business) · 12 completed engagements · no prior warnings"
    FRAME actions 610x48 [HUG/HUG] · horizontal pad 0 gap 12
      INSTANCE Action/Button 205x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/border/default 1.5 · r8 · {Style=Secondary, State=Disabled}
        TEXT label 157x24 [HUG/HUG] · fill color/text/secondary · mobile/body-medium · "Request clarification"
      INSTANCE Action/Button 195x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 147x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Close with warning"
      INSTANCE Action/Button 186x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
        TEXT label 138x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Escalate to Admin"
    TEXT clarifyLock 1100x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Clarification is unavailable — a case allows one request, and this one has been answered."
```

**Unlocked, but not completely.** `disabledReason` is gone entirely rather than emptied —
compare `10.1` — and `Close with warning` and `Escalate to Admin` are both `{State=Default}`. `Evidence so
far` is now **126** and holds three rows: the raiser, the respondent, and the clarification answer.

**`Request clarification` stays `{State=Disabled}`,** because `FR-MOD-03` allows one request per case and
this case has spent it. `clarifyLock` says so in the screen. This is the `promoteLock` idiom from `10.6` —
a note explaining why *one* control is dead while its neighbours work — rather than `10.1`'s
`disabledReason`, which explains why *all three* are. **A disabled control carries no reaction anywhere in
this module**, so there is no edge from here to `10.2`.

### `10.1c` — Case review · clarification pending

**Reached from** `10.2b`  ·  **Leads to** nothing  ·  **Advances to** `10.1a` after 2s †

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator, Active=Case queue} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator} · [standard, see header]
  FRAME content 1200x632 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 433x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Dispute — arrival could not be confirmed · Clarification requested"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Shop assistant — weekend · Raised by Kavindu Perera (worker) · Respondent: Saman Stores (employer)"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Clarification sent to Kavindu Perera 2 Sep 2026 — answer due 3 Sep 2026 (24-hour window)."
    INSTANCE Desktop/SectionCard 1152x126 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 102x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Evidence so far"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Kavindu Perera (raiser), 31 Aug 2026: “I arrived just before 8 AM — the shop was closed and no one answered.”"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Saman Stores (respondent), 1 Sep 2026: “I was away from the shop that morning, but my brother was there and the worker did arrive.” · 2 photos attached"
      TEXT row3 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Clarification — awaiting Kavindu Perera’s answer."
    INSTANCE Desktop/SectionCard 1152x126 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 156x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Code-exchange history"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Arrival — no code entered"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Completion — not reached"
      TEXT row3 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Payment — not reached"
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 47x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Parties"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Kavindu Perera — Verified · New to YouthLink · Endorsed (Sunil Bandara)"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Saman Stores — Employer (Business) · 12 completed engagements · no prior warnings"
    FRAME actions 610x48 [HUG/HUG] · horizontal pad 0 gap 12
      INSTANCE Action/Button 205x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/border/default 1.5 · r8 · {Style=Secondary, State=Disabled}
        TEXT label 157x24 [HUG/HUG] · fill color/text/secondary · mobile/body-medium · "Request clarification"
      INSTANCE Action/Button 195x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/border/default 1.5 · r8 · {Style=Secondary, State=Disabled}
        TEXT label 147x24 [HUG/HUG] · fill color/text/secondary · mobile/body-medium · "Close with warning"
      INSTANCE Action/Button 186x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/subtle · stroke color/border/default 1 · r8 · {Style=Primary, State=Disabled}
        TEXT label 138x24 [HUG/HUG] · fill color/text/secondary · mobile/body-medium · "Escalate to Admin"
    TEXT disabledReason 1100x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Actions unlock when the answer arrives or the 24-hour window expires."
  [frame reaction] AFTER_TIMEOUT 2s
```

**The lock comes back.** Requesting a clarification re-disables all three actions, because
`FR-MOD-03` gives that request its own 24-hour window and the decision waits on it exactly as it waited on
the response. The third evidence row reads *"awaiting Kavindu Perera's answer"* — the row is created when
the question is sent, not when it is answered.

### `10.1e` — Case review · escalate to Admin? (dialog)

**Opens over** `10.1a`  ·  **Cancel returns to** `10.1a`  ·  **Confirm** → `10.5`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator, Active=Case queue} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator} · [standard, see header]
  FRAME content 1200x632 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 394x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Dispute — arrival could not be confirmed · Ready for review"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Shop assistant — weekend · Raised by Kavindu Perera (worker) · Respondent: Saman Stores (employer)"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Clarification answered 2 Sep 2026 — ready for review."
    INSTANCE Desktop/SectionCard 1152x126 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 102x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Evidence so far"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Kavindu Perera (raiser), 31 Aug 2026: “I arrived just before 8 AM — the shop was closed and no one answered.”"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Saman Stores (respondent), 1 Sep 2026: “I was away from the shop that morning, but my brother was there and the worker did arrive.” · 2 photos attached"
      TEXT row3 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Clarification — Kavindu Perera answered: “I arrived just before 8 AM. The shop was closed; the stall holder next door saw me waiting.”"
    INSTANCE Desktop/SectionCard 1152x126 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 156x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Code-exchange history"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Arrival — no code entered"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Completion — not reached"
      TEXT row3 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Payment — not reached"
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 47x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Parties"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Kavindu Perera — Verified · New to YouthLink · Endorsed (Sunil Bandara)"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Saman Stores — Employer (Business) · 12 completed engagements · no prior warnings"
    FRAME actions 610x48 [HUG/HUG] · horizontal pad 0 gap 12
      INSTANCE Action/Button 205x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/border/default 1.5 · r8 · {Style=Secondary, State=Disabled}
        TEXT label 157x24 [HUG/HUG] · fill color/text/secondary · mobile/body-medium · "Request clarification"
      INSTANCE Action/Button 195x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 147x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Close with warning"
      INSTANCE Action/Button 186x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
        TEXT label 138x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Escalate to Admin"
    TEXT clarifyLock 1100x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Clarification is unavailable — a case allows one request, and this one has been answered."
  FRAME scrim 1440x900 [FIXED/FIXED] @0,0 · fill color/overlay/scrim · opacity 40%
  INSTANCE Desktop/DashDialog 440x198 [FIXED/HUG] @500,351 · vertical pad 20/24/20/24 gap 12 · fill color/bg/default · r12
    TEXT title 167x26 [HUG/HUG] · fill color/text/primary · desktop/title · "Escalate to Admin?"
    TEXT body 392x60 [FIXED/HUG] · fill color/text/secondary · desktop/body · "This case leaves Moderator authority — an Admin issues the final ruling and you can no longer act on it. The escalation is recorded in the audit log under your account."
    FRAME actions 392x48 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Action/Button 101x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 53x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Cancel"
      INSTANCE Action/Button 113x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
        TEXT label 65x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Escalate"
```

The dialog over `10.1a`. **Nothing behind the scrim is clickable** — the three buttons carry no
reactions, which is what `scrim` at `opacity 40%` means. The body names the consequence that makes this
irreversible for the Moderator: *"you can no longer act on it."*

### `10.1er` — Case review · escalate to Admin? (dialog), before clarification

**Opens over** `10.1r`  ·  **Cancel returns to** `10.1r`  ·  **Confirm** → `10.5`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator, Active=Case queue} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator} · [standard, see header]
  FRAME content 1200x574 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 394x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Dispute — arrival could not be confirmed · Ready for review"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Shop assistant — weekend · Raised by Kavindu Perera (worker) · Respondent: Saman Stores (employer)"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Response received 1 Sep 2026 — the window has closed; both sides are on record."
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 102x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Evidence so far"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Kavindu Perera (raiser), 31 Aug 2026: “I arrived just before 8 AM — the shop was closed and no one answered.”"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Saman Stores (respondent), 1 Sep 2026: “I was away from the shop that morning, but my brother was there and the worker did arrive.” · 2 photos attached"
    INSTANCE Desktop/SectionCard 1152x126 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 156x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Code-exchange history"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Arrival — no code entered"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Completion — not reached"
      TEXT row3 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Payment — not reached"
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 47x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Parties"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Kavindu Perera — Verified · New to YouthLink · Endorsed (Sunil Bandara)"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Saman Stores — Employer (Business) · 12 completed engagements · no prior warnings"
    FRAME actions 610x48 [HUG/HUG] · horizontal pad 0 gap 12
      INSTANCE Action/Button 205x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 157x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Request clarification"
      INSTANCE Action/Button 195x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 147x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Close with warning"
      INSTANCE Action/Button 186x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
        TEXT label 138x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Escalate to Admin"
  FRAME scrim 1440x900 [FIXED/FIXED] @0,0 · fill color/overlay/scrim · opacity 40%
  INSTANCE Desktop/DashDialog 440x198 [FIXED/HUG] @500,351 · vertical pad 20/24/20/24 gap 12 · fill color/bg/default · r12
    TEXT title 167x26 [HUG/HUG] · fill color/text/primary · desktop/title · "Escalate to Admin?"
    TEXT body 392x60 [FIXED/HUG] · fill color/text/secondary · desktop/body · "This case leaves Moderator authority — an Admin issues the final ruling and you can no longer act on it. The escalation is recorded in the audit log under your account."
    FRAME actions 392x48 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Action/Button 101x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 53x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Cancel"
      INSTANCE Action/Button 113x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
        TEXT label 65x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Escalate"
```

The same dialog over `10.1r` rather than `10.1a`. The two base screens differ by one card
height — `10.1r`'s `Evidence so far` is **100** (two rows, no clarification) against `10.1a`'s **126** — so
escalating before and after a clarification are separate frames rather than one.

### `10.1p` — Case review · payment dispute, under review

**Reached from** [M11](M11-dashboard.md) case queue  ·  **Leads to** `10.2p`, `10.3p`  ·  **Opens** `10.1pe`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator, Active=Case queue} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator} · [standard, see header]
  FRAME content 1200x574 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 316x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Dispute — payment not released · Under review"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Warehouse packing — night shift · Raised by Tharindu Silva (worker) · Respondent: Ceylon Logistics (employer)"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Response received 29 Aug 2026 — both statements in · 1 photo of evidence."
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 102x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Evidence so far"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Tharindu Silva (raiser), 28 Aug 2026: “I finished the night shift on 27 Aug 2026. The supervisor said pay would follow by bank transfer — nothing has arrived.”"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Ceylon Logistics (respondent), 29 Aug 2026: “Payment was queued on 28 Aug 2026 but the worker's bank details were wrong. Re-sent on 29 Aug 2026.” · 1 photo attached"
    INSTANCE Desktop/SectionCard 1152x126 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 156x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Code-exchange history"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Arrival — code entered 27 Aug 2026, 9:58 PM"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Completion — code entered 28 Aug 2026, 6:05 AM"
      TEXT row3 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Payment — no code entered"
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 47x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Parties"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Tharindu Silva — Verified · New to YouthLink · not endorsed"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Ceylon Logistics — Employer (Business) · 4 completed engagements · no prior warnings"
    FRAME actions 610x48 [HUG/HUG] · horizontal pad 0 gap 12
      INSTANCE Action/Button 205x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 157x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Request clarification"
      INSTANCE Action/Button 195x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 147x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Close with warning"
      INSTANCE Action/Button 186x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
        TEXT label 138x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Escalate to Admin"
```

**The second dispute, and the reason there are two.** `FR-ADM-02` limits an Admin's ruling on a
*payment* dispute to a reputational outcome, because no money moves inside YouthLink. Carrying a payment
case alongside the arrival case is what lets that limit be shown rather than asserted — see `10.5p`.

The code-exchange history is the tell: arrival and completion codes were both entered, and only the payment
code was not. Compare `10.1`, where no code was entered at all.

### `10.1pa` — Case review · payment dispute, Admin view (under Moderator review)

**Reached from** [M11](M11-dashboard.md) case queue, signed in as Admin  ·  **Leads to** nothing

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin, Active=Case queue} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin} · [standard, see header]
  FRAME content 1200x544 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 316x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Dispute — payment not released · Under review"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Warehouse packing — night shift · Raised by Tharindu Silva (worker) · Respondent: Ceylon Logistics (employer)"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Response received 29 Aug 2026 — both statements in · 1 photo of evidence."
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 102x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Evidence so far"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Tharindu Silva (raiser), 28 Aug 2026: “I finished the night shift on 27 Aug 2026. The supervisor said pay would follow by bank transfer — nothing has arrived.”"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Ceylon Logistics (respondent), 29 Aug 2026: “Payment was queued on 28 Aug 2026 but the worker's bank details were wrong. Re-sent on 29 Aug 2026.” · 1 photo attached"
    INSTANCE Desktop/SectionCard 1152x126 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 156x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Code-exchange history"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Arrival — code entered 27 Aug 2026, 9:58 PM"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Completion — code entered 28 Aug 2026, 6:05 AM"
      TEXT row3 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Payment — no code entered"
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 47x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Parties"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Tharindu Silva — Verified · New to YouthLink · not endorsed"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Ceylon Logistics — Employer (Business) · 4 completed engagements · no prior warnings"
    FRAME actions 1100x18 [HUG/HUG] · horizontal pad 0 gap 12
      TEXT disabledReason 1100x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Under Moderator review — an Admin acts only once the case is escalated."
```

**The `actions` frame holds no buttons — only `disabledReason`.** This is an Admin looking at a
case still under Moderator review, and the line reads *"an Admin acts only once the case is escalated."*

It is the one screen in the module where authority runs backwards from what the role hierarchy suggests. An
Admin outranks a Moderator throughout `FR-ADM-01`–`FR-ADM-07`, and still cannot act here, because
`FR-MOD-01` scopes the decision to the case's **state** rather than to the viewer's rank.

### `10.1pc` — Case review · payment dispute, clarification pending

**Reached from** `10.2pb`  ·  **Leads to** nothing  ·  **Advances to** `10.1pca` after 2s †

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator, Active=Case queue} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator} · [standard, see header]
  FRAME content 1200x632 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 378x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Dispute — payment not released · Clarification requested"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Warehouse packing — night shift · Raised by Tharindu Silva (worker) · Respondent: Ceylon Logistics (employer)"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Clarification sent to Ceylon Logistics 4 Sep 2026 — answer due 5 Sep 2026 (24-hour window)."
    INSTANCE Desktop/SectionCard 1152x126 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 102x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Evidence so far"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Tharindu Silva (raiser), 28 Aug 2026: “I finished the night shift on 27 Aug 2026. The supervisor said pay would follow by bank transfer — nothing has arrived.”"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Ceylon Logistics (respondent), 29 Aug 2026: “Payment was queued on 28 Aug 2026 but the worker's bank details were wrong. Re-sent on 29 Aug 2026.” · 1 photo attached"
      TEXT row3 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Clarification — awaiting Ceylon Logistics’ answer."
    INSTANCE Desktop/SectionCard 1152x126 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 156x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Code-exchange history"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Arrival — code entered 27 Aug 2026, 9:58 PM"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Completion — code entered 28 Aug 2026, 6:05 AM"
      TEXT row3 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Payment — no code entered"
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 47x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Parties"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Tharindu Silva — Verified · New to YouthLink · not endorsed"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Ceylon Logistics — Employer (Business) · 4 completed engagements · no prior warnings"
    FRAME actions 610x48 [HUG/HUG] · horizontal pad 0 gap 12
      INSTANCE Action/Button 205x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/border/default 1.5 · r8 · {Style=Secondary, State=Disabled}
        TEXT label 157x24 [HUG/HUG] · fill color/text/secondary · mobile/body-medium · "Request clarification"
      INSTANCE Action/Button 195x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/border/default 1.5 · r8 · {Style=Secondary, State=Disabled}
        TEXT label 147x24 [HUG/HUG] · fill color/text/secondary · mobile/body-medium · "Close with warning"
      INSTANCE Action/Button 186x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/subtle · stroke color/border/default 1 · r8 · {Style=Primary, State=Disabled}
        TEXT label 138x24 [HUG/HUG] · fill color/text/secondary · mobile/body-medium · "Escalate to Admin"
    TEXT disabledReason 1100x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Actions unlock when the answer arrives or the 24-hour window expires."
  [frame reaction] AFTER_TIMEOUT 2s
```

The payment case's clarification-pending state. Unlike `10.2`, the question went to the
**respondent** — `FR-MOD-03` says *either* party, and the two cases exercise both directions.

### `10.1pca` — Case review · payment dispute, clarification answered

**Reached from** `10.1pc`  ·  **Leads to** `10.3p`  ·  **Opens** `10.1pce`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator, Active=Case queue} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator} · [standard, see header]
  FRAME content 1200x632 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 339x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Dispute — payment not released · Ready for review"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Warehouse packing — night shift · Raised by Tharindu Silva (worker) · Respondent: Ceylon Logistics (employer)"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Clarification answered 5 Sep 2026 — ready for review."
    INSTANCE Desktop/SectionCard 1152x126 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 102x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Evidence so far"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Tharindu Silva (raiser), 28 Aug 2026: “I finished the night shift on 27 Aug 2026. The supervisor said pay would follow by bank transfer — nothing has arrived.”"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Ceylon Logistics (respondent), 29 Aug 2026: “Payment was queued on 28 Aug 2026 but the worker's bank details were wrong. Re-sent on 29 Aug 2026.” · 1 photo attached"
      TEXT row3 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Clarification — Ceylon Logistics answered: “Receipt attached. It shows the transfer left our account on 29 Aug 2026; we cannot see which account it reached.” · 1 photo attached"
    INSTANCE Desktop/SectionCard 1152x126 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 156x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Code-exchange history"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Arrival — code entered 27 Aug 2026, 9:58 PM"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Completion — code entered 28 Aug 2026, 6:05 AM"
      TEXT row3 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Payment — no code entered"
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 47x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Parties"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Tharindu Silva — Verified · New to YouthLink · not endorsed"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Ceylon Logistics — Employer (Business) · 4 completed engagements · no prior warnings"
    FRAME actions 610x48 [HUG/HUG] · horizontal pad 0 gap 12
      INSTANCE Action/Button 205x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/border/default 1.5 · r8 · {Style=Secondary, State=Disabled}
        TEXT label 157x24 [HUG/HUG] · fill color/text/secondary · mobile/body-medium · "Request clarification"
      INSTANCE Action/Button 195x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 147x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Close with warning"
      INSTANCE Action/Button 186x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
        TEXT label 138x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Escalate to Admin"
    TEXT clarifyLock 1100x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Clarification is unavailable — a case allows one request, and this one has been answered."
```

**Added 2026-09-22.** The payment thread had no clarification-answered state, so `10.1pc` was
a dead end while the arrival thread ran on to `10.1a`. This is that missing state, and the delta from
`10.1pc` is exactly the delta from `10.1c` to `10.1a`: status to *Ready for review*, the answered line, the
answer itself in the third evidence row, `disabledReason` swapped for `clarifyLock`, and the two acting
buttons to `{State=Default}` while `Request clarification` stays disabled on `FR-MOD-03`'s one-per-case
rule. `content` lands at **632**, matching `10.1a` to the pixel.

The answer is deliberately **inconclusive** — the receipt shows money leaving Ceylon Logistics' account but
not the account it reached. That is what makes `10.5p` able to demonstrate `FR-ADM-01`'s third outcome.

### `10.1pce` — Case review · escalate to Admin? (dialog), payment dispute after clarification

**Opens over** `10.1pca`  ·  **Cancel returns to** `10.1pca`  ·  **Confirm** → `10.5p`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator, Active=Case queue} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator} · [standard, see header]
  FRAME content 1200x632 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 339x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Dispute — payment not released · Ready for review"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Warehouse packing — night shift · Raised by Tharindu Silva (worker) · Respondent: Ceylon Logistics (employer)"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Clarification answered 5 Sep 2026 — ready for review."
    INSTANCE Desktop/SectionCard 1152x126 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 102x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Evidence so far"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Tharindu Silva (raiser), 28 Aug 2026: “I finished the night shift on 27 Aug 2026. The supervisor said pay would follow by bank transfer — nothing has arrived.”"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Ceylon Logistics (respondent), 29 Aug 2026: “Payment was queued on 28 Aug 2026 but the worker's bank details were wrong. Re-sent on 29 Aug 2026.” · 1 photo attached"
      TEXT row3 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Clarification — Ceylon Logistics answered: “Receipt attached. It shows the transfer left our account on 29 Aug 2026; we cannot see which account it reached.” · 1 photo attached"
    INSTANCE Desktop/SectionCard 1152x126 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 156x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Code-exchange history"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Arrival — code entered 27 Aug 2026, 9:58 PM"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Completion — code entered 28 Aug 2026, 6:05 AM"
      TEXT row3 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Payment — no code entered"
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 47x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Parties"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Tharindu Silva — Verified · New to YouthLink · not endorsed"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Ceylon Logistics — Employer (Business) · 4 completed engagements · no prior warnings"
    FRAME actions 610x48 [HUG/HUG] · horizontal pad 0 gap 12
      INSTANCE Action/Button 205x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/border/default 1.5 · r8 · {Style=Secondary, State=Disabled}
        TEXT label 157x24 [HUG/HUG] · fill color/text/secondary · mobile/body-medium · "Request clarification"
      INSTANCE Action/Button 195x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 147x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Close with warning"
      INSTANCE Action/Button 186x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
        TEXT label 138x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Escalate to Admin"
    TEXT clarifyLock 1100x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Clarification is unavailable — a case allows one request, and this one has been answered."
  FRAME scrim 1440x900 [FIXED/FIXED] @0,0 · fill color/overlay/scrim · opacity 40%
  INSTANCE Desktop/DashDialog 440x198 [FIXED/HUG] @500,351 · vertical pad 20/24/20/24 gap 12 · fill color/bg/default · r12
    TEXT title 167x26 [HUG/HUG] · fill color/text/primary · desktop/title · "Escalate to Admin?"
    TEXT body 392x60 [FIXED/HUG] · fill color/text/secondary · desktop/body · "This case leaves Moderator authority — an Admin issues the final ruling and you can no longer act on it. The escalation is recorded in the audit log under your account."
    FRAME actions 392x48 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Action/Button 101x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 53x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Cancel"
      INSTANCE Action/Button 113x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
        TEXT label 65x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Escalate"
```

**Added 2026-09-22**, so that `10.1pca`'s Escalate has a dialog drawn over the right base.
Reusing `10.1pe` would have put the dialog over a 574-tall background instead of this 600-tall one.

### `10.1pe` — Case review · escalate to Admin? (dialog), payment dispute

**Opens over** `10.1p`  ·  **Cancel returns to** `10.1p`  ·  **Confirm** → `10.5p`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator, Active=Case queue} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator} · [standard, see header]
  FRAME content 1200x574 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 316x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Dispute — payment not released · Under review"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Warehouse packing — night shift · Raised by Tharindu Silva (worker) · Respondent: Ceylon Logistics (employer)"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Response received 29 Aug 2026 — both statements in · 1 photo of evidence."
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 102x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Evidence so far"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Tharindu Silva (raiser), 28 Aug 2026: “I finished the night shift on 27 Aug 2026. The supervisor said pay would follow by bank transfer — nothing has arrived.”"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Ceylon Logistics (respondent), 29 Aug 2026: “Payment was queued on 28 Aug 2026 but the worker's bank details were wrong. Re-sent on 29 Aug 2026.” · 1 photo attached"
    INSTANCE Desktop/SectionCard 1152x126 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 156x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Code-exchange history"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Arrival — code entered 27 Aug 2026, 9:58 PM"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Completion — code entered 28 Aug 2026, 6:05 AM"
      TEXT row3 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Payment — no code entered"
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 47x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Parties"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Tharindu Silva — Verified · New to YouthLink · not endorsed"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Ceylon Logistics — Employer (Business) · 4 completed engagements · no prior warnings"
    FRAME actions 610x48 [HUG/HUG] · horizontal pad 0 gap 12
      INSTANCE Action/Button 205x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 157x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Request clarification"
      INSTANCE Action/Button 195x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 147x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Close with warning"
      INSTANCE Action/Button 186x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
        TEXT label 138x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Escalate to Admin"
  FRAME scrim 1440x900 [FIXED/FIXED] @0,0 · fill color/overlay/scrim · opacity 40%
  INSTANCE Desktop/DashDialog 440x198 [FIXED/HUG] @500,351 · vertical pad 20/24/20/24 gap 12 · fill color/bg/default · r12
    TEXT title 167x26 [HUG/HUG] · fill color/text/primary · desktop/title · "Escalate to Admin?"
    TEXT body 392x60 [FIXED/HUG] · fill color/text/secondary · desktop/body · "This case leaves Moderator authority — an Admin issues the final ruling and you can no longer act on it. The escalation is recorded in the audit log under your account."
    FRAME actions 392x48 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Action/Button 101x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 53x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Cancel"
      INSTANCE Action/Button 113x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
        TEXT label 65x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Escalate"
```

The escalate dialog over `10.1p`.

**Repaired 2026-09-22.** The three buttons behind the scrim were still wired, and pointed at the *arrival*
case's screens (`10.2`, `10.3s`, `10.1er`) rather than the payment case's — the frame had been duplicated
from `10.1e` and its background edges never re-pointed. They are now inert, matching the module's other
dialog frames. The demo-page clone was already correct, so this was the source drifting from the demo.

### `10.1r` — Case review · ready for review

**Reached from** `10.1`  ·  **Leads to** `10.2`, `10.3s`  ·  **Opens** `10.1er`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator, Active=Case queue} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator} · [standard, see header]
  FRAME content 1200x574 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 394x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Dispute — arrival could not be confirmed · Ready for review"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Shop assistant — weekend · Raised by Kavindu Perera (worker) · Respondent: Saman Stores (employer)"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Response received 1 Sep 2026 — the window has closed; both sides are on record."
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 102x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Evidence so far"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Kavindu Perera (raiser), 31 Aug 2026: “I arrived just before 8 AM — the shop was closed and no one answered.”"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Saman Stores (respondent), 1 Sep 2026: “I was away from the shop that morning, but my brother was there and the worker did arrive.” · 2 photos attached"
    INSTANCE Desktop/SectionCard 1152x126 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 156x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Code-exchange history"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Arrival — no code entered"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Completion — not reached"
      TEXT row3 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Payment — not reached"
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 47x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Parties"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Kavindu Perera — Verified · New to YouthLink · Endorsed (Sunil Bandara)"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Saman Stores — Employer (Business) · 12 completed engagements · no prior warnings"
    FRAME actions 610x48 [HUG/HUG] · horizontal pad 0 gap 12
      INSTANCE Action/Button 205x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 157x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Request clarification"
      INSTANCE Action/Button 195x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 147x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Close with warning"
      INSTANCE Action/Button 186x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
        TEXT label 138x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Escalate to Admin"
```

`Evidence so far` is **100** — two rows, both parties on record, no clarification requested.
This is the shortest path to a decision: response received, window closed, act.

### `10.1t` — Case review · awaiting response, T. Abeysekera's session

**Reached from** [M11](M11-dashboard.md) case queue, signed in as T. Abeysekera  ·  **Leads to** nothing

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator, Active=Case queue} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator} · [standard, see header]
  FRAME content 1200x580 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 404x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Dispute — arrival could not be confirmed · Awaiting response"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Shop assistant — weekend · Raised by Kavindu Perera (worker) · Respondent: Saman Stores (employer)"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Response window closes 2 Sep 2026 — Saman Stores has 48 hours from case open."
    INSTANCE Desktop/SectionCard 1152x74 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 102x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Evidence so far"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "No party statements yet — the response window is open."
    INSTANCE Desktop/SectionCard 1152x126 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 156x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Code-exchange history"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Arrival — no code entered"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Completion — not reached"
      TEXT row3 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Payment — not reached"
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 47x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Parties"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Kavindu Perera — Verified · New to YouthLink · Endorsed (Sunil Bandara)"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Saman Stores — Employer (Business) · 12 completed engagements · no prior warnings"
    FRAME actions 610x48 [HUG/HUG] · horizontal pad 0 gap 12
      INSTANCE Action/Button 205x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/border/default 1.5 · r8 · {Style=Secondary, State=Disabled}
        TEXT label 157x24 [HUG/HUG] · fill color/text/secondary · mobile/body-medium · "Request clarification"
      INSTANCE Action/Button 195x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/border/default 1.5 · r8 · {Style=Secondary, State=Disabled}
        TEXT label 147x24 [HUG/HUG] · fill color/text/secondary · mobile/body-medium · "Close with warning"
      INSTANCE Action/Button 186x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/subtle · stroke color/border/default 1 · r8 · {Style=Primary, State=Disabled}
        TEXT label 138x24 [HUG/HUG] · fill color/text/secondary · mobile/body-medium · "Escalate to Admin"
    TEXT disabledReason 1100x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Actions unlock when the response window closes or a response arrives."
```

**This tree is identical to `10.1`, line for line.** The difference is invisible here and it is
the point of the screen: the collapsed `Desktop/DashHeader` carries `staffName`, and on this frame it reads
**T. Abeysekera** where `10.1` reads **Shalini Weerasinghe**.

T. Abeysekera is the user promoted in `10.8` / `10.8b`. The frame exists to close `FR-ADM-06`'s second phase
end to end — promote an existing user, and they can work the queue — which no other screen shows. Because
`design-system.md` §6 collapses the dashboard chrome, **do not read these two frames as duplicates.**

### `10.2` — Request clarification

**Reached from** `10.1r`  ·  **Leads to** `10.2b`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator, Active=Case queue} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator} · [standard, see header]
  FRAME content 1200x300 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    INSTANCE Desktop/SectionCard 1152x74 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 431x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Case: arrival could not be confirmed · Shop assistant — weekend"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "To: Kavindu Perera (raiser)"
    INSTANCE Desktop/SectionCard 1152x74 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 242x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Your question · up to 300 characters"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "What time did you arrive on Saturday, and did anyone see you at the shop?"
    TEXT windowNote 1100x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "They have 24 hours to answer. If the request expires, your decision proceeds."
    INSTANCE Action/Button 151x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 103x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Send request"
```

The clarification composer, addressed to the **raiser**. `windowNote` states the 24-hour rule and
what happens if it lapses: *"If the request expires, your decision proceeds."* The case is never stalled by
silence — the same principle as `FR-DISPUTE-07` one level down.

### `10.2b` — Request clarification · sent

**Reached from** `10.2`  ·  **Leads to** `10.1c`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator, Active=Case queue} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator} · [standard, see header]
  FRAME content 1200x302 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    INSTANCE Desktop/SectionCard 1152x74 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 431x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Case: arrival could not be confirmed · Shop assistant — weekend"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "To: Kavindu Perera (raiser)"
    INSTANCE Desktop/SectionCard 1152x74 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 242x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Your question · up to 300 characters"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "What time did you arrive on Saturday, and did anyone see you at the shop?"
    TEXT sentLine 1100x20 [FIXED/HUG] · fill color/text/primary · desktop/body · "Sent to Kavindu Perera — they have until 3 Sep 2026, 2:55 PM to answer. If it expires, your decision proceeds without it."
    INSTANCE Action/Button 146x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
      TEXT label 98x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Back to case"
```

Sent. The composer's `windowNote` (`desktop/table`, secondary) is replaced by `sentLine`
(`desktop/body`, primary) carrying a concrete deadline — **3 Sep 2026, 2:55 PM** — and the primary
`Send request` becomes a secondary `Back to case`. Three changes, one state.

### `10.2p` — Request clarification · payment dispute

**Reached from** `10.1p`  ·  **Leads to** `10.2pb`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator, Active=Case queue} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator} · [standard, see header]
  FRAME content 1200x300 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    INSTANCE Desktop/SectionCard 1152x74 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 415x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Case: payment not released · Warehouse packing — night shift"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "To: Ceylon Logistics (respondent)"
    INSTANCE Desktop/SectionCard 1152x74 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 242x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Your question · up to 300 characters"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Please attach the 29 Aug 2026 transfer receipt showing the account it was sent to."
    TEXT windowNote 1100x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "They have 24 hours to answer. If the request expires, your decision proceeds."
    INSTANCE Action/Button 151x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 103x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Send request"
```

The same composer for the payment case, addressed to the **respondent**, asking for the transfer
receipt.

### `10.2pb` — Request clarification · sent, payment dispute

**Reached from** `10.2p`  ·  **Leads to** `10.1pc`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator, Active=Case queue} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator} · [standard, see header]
  FRAME content 1200x302 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    INSTANCE Desktop/SectionCard 1152x74 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 415x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Case: payment not released · Warehouse packing — night shift"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "To: Ceylon Logistics (respondent)"
    INSTANCE Desktop/SectionCard 1152x74 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 242x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Your question · up to 300 characters"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Please attach the 29 Aug 2026 transfer receipt showing the account it was sent to."
    TEXT sentLine 1100x20 [FIXED/HUG] · fill color/text/primary · desktop/body · "Sent to Ceylon Logistics — they have until 5 Sep 2026, 11:10 AM to answer. If it expires, your decision proceeds without it."
    INSTANCE Action/Button 146x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
      TEXT label 98x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Back to case"
```

Sent, payment case. Deadline **5 Sep 2026, 11:10 AM**.

### `10.3` — Close with warning

**Reached from** `10.4`  ·  **Leads to** `10.3c`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator, Active=Case queue} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator} · [standard, see header]
  FRAME content 1200x300 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    INSTANCE Desktop/SectionCard 1152x74 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 560x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Case: flagged listing — Data entry — work from home · auto-hidden by three reports"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Warning to: R. Gunasekara (employer) · 2 warnings in the last 90 days"
    INSTANCE Desktop/SectionCard 1152x74 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 269x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Reason (required) · up to 300 characters"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Listing asks applicants for an upfront registration fee and gives no verifiable address — prohibited under the posting rules."
    TEXT recordNote 1100x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "This will be their third warning inside a rolling 90 days — recording it auto-escalates the account to Admin for suspension review."
    INSTANCE Action/Button 168x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 120x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Record warning"
```

**The warning composer, and the only one of the three that escalates.** `recordNote` reads *"This
will be their third warning inside a rolling 90 days — recording it auto-escalates the account to Admin for
suspension review"* — `FR-MOD-02` stated before the Moderator commits, not after.

Reached from `10.4`, not from a dispute: this warning is about a **flagged listing**, so the owner is
`R. Gunasekara` and the case line names the listing rather than two parties.

### `10.3c` — Close with warning · recorded, third in 90 days

**Reached from** `10.3`  ·  **Leads to** nothing

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator, Active=Case queue} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator} · [standard, see header]
  FRAME content 1200x374 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    INSTANCE Desktop/SectionCard 1152x74 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 560x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Case: flagged listing — Data entry — work from home · auto-hidden by three reports"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Warning to: R. Gunasekara (employer) · 2 warnings in the last 90 days"
    INSTANCE Desktop/SectionCard 1152x74 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 269x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Reason (required) · up to 300 characters"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Listing asks applicants for an upfront registration fee and gives no verifiable address — prohibited under the posting rules."
    INSTANCE Desktop/SectionCard 1152x92 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 219x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Warning recorded — case closed"
      TEXT row1 1120x36 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Recorded — and this is their third warning inside a rolling 90 days, so the account has been auto-escalated to Admin for suspension review. Your action triggered that consequence; the Admin sees all three warnings."
    INSTANCE Action/Button 158x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
      TEXT label 110x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Back to queue"
```

**The outcome card is 92 tall here and 74 on `10.3pb` / `10.3sb`** — the third-warning
consequence needs the extra row. The text does something the other two do not: it attributes the consequence
to the Moderator who caused it (*"Your action triggered that consequence"*) and states that the Admin
inherits all three warnings.

This card is where `FR-MOD-02` becomes `FR-ADM-03`: the suspension review it opens is what `11.3g` and `10.6`
resolve.

### `10.3p` — Close with warning · payment dispute

**Reached from** `10.1p`, `10.1pca`  ·  **Leads to** `10.3pb`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator, Active=Case queue} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator} · [standard, see header]
  FRAME content 1200x300 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    INSTANCE Desktop/SectionCard 1152x74 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 415x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Case: payment not released · Warehouse packing — night shift"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Warning to: Ceylon Logistics (employer) · no prior warnings"
    INSTANCE Desktop/SectionCard 1152x74 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 269x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Reason (required) · up to 300 characters"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Payment was not released within the agreed window and the worker's payment code was never entered."
    TEXT recordNote 1100x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "The warning is recorded on their account and closes this case in the worker's favour — no Admin ruling is needed."
    INSTANCE Action/Button 168x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 120x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Record warning"
```

The payment case's warning — first for Ceylon Logistics, so `recordNote` says the opposite of
`10.3`: *"no Admin ruling is needed."*

### `10.3pb` — Close with warning · recorded, payment dispute

**Reached from** `10.3p`  ·  **Leads to** nothing

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator, Active=Case queue} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator} · [standard, see header]
  FRAME content 1200x356 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    INSTANCE Desktop/SectionCard 1152x74 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 415x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Case: payment not released · Warehouse packing — night shift"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Warning to: Ceylon Logistics (employer) · no prior warnings"
    INSTANCE Desktop/SectionCard 1152x74 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 269x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Reason (required) · up to 300 characters"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Payment was not released within the agreed window and the worker's payment code was never entered."
    INSTANCE Desktop/SectionCard 1152x74 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 219x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Warning recorded — case closed"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Recorded on Ceylon Logistics’ account and this case is closed in the worker's favour. It appears in their history on any future case."
    INSTANCE Action/Button 158x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
      TEXT label 110x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Back to queue"
```

Recorded, 74-tall outcome card. Closing with a warning ends the case **in the worker's favour**
without an Admin ever seeing it — the volume/consequence split working as intended.

### `10.3s` — Close with warning · Saman case

**Reached from** `10.1a`, `10.1r`  ·  **Leads to** `10.3sb`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator, Active=Case queue} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator} · [standard, see header]
  FRAME content 1200x300 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    INSTANCE Desktop/SectionCard 1152x74 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 431x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Case: arrival could not be confirmed · Shop assistant — weekend"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Warning to: Saman Stores (employer) · no prior warnings"
    INSTANCE Desktop/SectionCard 1152x74 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 269x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Reason (required) · up to 300 characters"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Nobody was present to confirm the worker's arrival with the check-in code, and the response window was missed."
    TEXT recordNote 1100x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "The warning is recorded on their account and closes this case in the worker's favour — no Admin ruling is needed."
    INSTANCE Action/Button 168x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 120x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Record warning"
```

The arrival case's warning — first for Saman Stores.

### `10.3sb` — Close with warning · recorded, Saman case

**Reached from** `10.3s`  ·  **Leads to** nothing

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator, Active=Case queue} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator} · [standard, see header]
  FRAME content 1200x356 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    INSTANCE Desktop/SectionCard 1152x74 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 431x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Case: arrival could not be confirmed · Shop assistant — weekend"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Warning to: Saman Stores (employer) · no prior warnings"
    INSTANCE Desktop/SectionCard 1152x74 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 269x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Reason (required) · up to 300 characters"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Nobody was present to confirm the worker's arrival with the check-in code, and the response window was missed."
    INSTANCE Desktop/SectionCard 1152x74 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 219x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Warning recorded — case closed"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Recorded on Saman Stores' account and this case is closed in the worker's favour. It appears in their history on any future case."
    INSTANCE Action/Button 158x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
      TEXT label 110x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Back to queue"
```

Recorded, arrival case.

### `10.4` — Flagged content

**Reached from** [M11](M11-dashboard.md) flagged content  ·  **Leads to** `10.3`  ·  **Opens** `10.4e`, `10.4r`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator, Active=Case queue} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator} · [standard, see header]
  FRAME content 1200x440 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    INSTANCE Desktop/SectionCard 1152x74 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 397x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Data entry — work from home · auto-hidden pending review"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Listing · third report received 31 Aug 2026 — hidden from browse by the three-report threshold"
    INSTANCE Desktop/SectionCard 1152x126 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 75x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Reports (3)"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Fraud or scam — “Asks for a registration fee up front and gives no real address.”"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Fraud or scam — no detail given"
      TEXT row3 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Safety concern — no detail given"
    INSTANCE Desktop/SectionCard 1152x74 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 94x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Owner history"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "R. Gunasekara — Employer (Individual) · third posting · 2 warnings in the last 90 days"
    FRAME actions 526x48 [HUG/HUG] · horizontal pad 0 gap 12
      INSTANCE Action/Button 158x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 110x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Restore listing"
      INSTANCE Action/Button 140x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 92x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Warn owner"
      INSTANCE Action/Button 204x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
        TEXT label 156x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Escalate for removal"
    TEXT authorityNote 1100x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Removal itself is an Admin action — escalating hands this listing to the Admin queue."
```

**`FR-MOD-04`'s action set, exactly: restore, warn, escalate.** The absence is the specification —
there is no *Remove* button on this screen and there must never be one, because `NFR-SEC-05` reserves removal
to Admin. `authorityNote` says so in the screen rather than leaving it to the backend.

The listing is auto-hidden by `FR-DISPUTE-02`'s three-report threshold, and the `Reports (3)` card is **126**
tall because it lists all three — one with detail, two without.

### `10.4e` — Flagged content · escalate for removal? (dialog)

**Opens over** `10.4`  ·  **Cancel returns to** `10.4`  ·  **Confirm** → *not wired — see below*

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator, Active=Case queue} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator} · [standard, see header]
  FRAME content 1200x440 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    INSTANCE Desktop/SectionCard 1152x74 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 397x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Data entry — work from home · auto-hidden pending review"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Listing · third report received 31 Aug 2026 — hidden from browse by the three-report threshold"
    INSTANCE Desktop/SectionCard 1152x126 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 75x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Reports (3)"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Fraud or scam — “Asks for a registration fee up front and gives no real address.”"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Fraud or scam — no detail given"
      TEXT row3 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Safety concern — no detail given"
    INSTANCE Desktop/SectionCard 1152x74 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 94x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Owner history"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "R. Gunasekara — Employer (Individual) · third posting · 2 warnings in the last 90 days"
    FRAME actions 526x48 [HUG/HUG] · horizontal pad 0 gap 12
      INSTANCE Action/Button 158x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 110x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Restore listing"
      INSTANCE Action/Button 140x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 92x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Warn owner"
      INSTANCE Action/Button 204x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
        TEXT label 156x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Escalate for removal"
    TEXT authorityNote 1100x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Removal itself is an Admin action — escalating hands this listing to the Admin queue."
  FRAME scrim 1440x900 [FIXED/FIXED] @0,0 · fill color/overlay/scrim · opacity 40%
  INSTANCE Desktop/DashDialog 440x198 [FIXED/HUG] @500,351 · vertical pad 20/24/20/24 gap 12 · fill color/bg/default · r12
    TEXT title 187x26 [HUG/HUG] · fill color/text/primary · desktop/title · "Escalate for removal?"
    TEXT body 392x60 [FIXED/HUG] · fill color/text/secondary · desktop/body · "Removal is an Admin action — this hands the listing to the Admin queue and keeps it hidden meanwhile. The escalation is recorded in the audit log under your account."
    FRAME actions 392x48 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Action/Button 101x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 53x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Cancel"
      INSTANCE Action/Button 113x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
        TEXT label 65x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Escalate"
```

Escalate for removal. The body carries the consequence a Moderator most needs to know: the listing
**stays hidden** while the Admin queue has it, so escalating is not a reprieve for the owner.

**Its Confirm has no destination, and cannot have one.** Removal is decided on [M11](M11-dashboard.md) at
`11.2ad` → `10.7` → `11.2x`, and Figma's prototype links cannot cross pages — see *Transitions that are not
clicks*.

### `10.4r` — Flagged content · restore listing? (dialog)

**Opens over** `10.4`  ·  **Cancel returns to** `10.4`  ·  **Confirm** → `10.4rb`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator, Active=Case queue} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator} · [standard, see header]
  FRAME content 1200x440 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    INSTANCE Desktop/SectionCard 1152x74 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 397x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Data entry — work from home · auto-hidden pending review"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Listing · third report received 31 Aug 2026 — hidden from browse by the three-report threshold"
    INSTANCE Desktop/SectionCard 1152x126 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 75x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Reports (3)"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Fraud or scam — “Asks for a registration fee up front and gives no real address.”"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Fraud or scam — no detail given"
      TEXT row3 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Safety concern — no detail given"
    INSTANCE Desktop/SectionCard 1152x74 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 94x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Owner history"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "R. Gunasekara — Employer (Individual) · third posting · 2 warnings in the last 90 days"
    FRAME actions 526x48 [HUG/HUG] · horizontal pad 0 gap 12
      INSTANCE Action/Button 158x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 110x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Restore listing"
      INSTANCE Action/Button 140x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 92x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Warn owner"
      INSTANCE Action/Button 204x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
        TEXT label 156x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Escalate for removal"
    TEXT authorityNote 1100x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Removal itself is an Admin action — escalating hands this listing to the Admin queue."
  FRAME scrim 1440x900 [FIXED/FIXED] @0,0 · fill color/overlay/scrim · opacity 40%
  INSTANCE Desktop/DashDialog 440x218 [FIXED/HUG] @500,351 · vertical pad 20/24/20/24 gap 12 · fill color/bg/default · r12
    TEXT title 135x26 [HUG/HUG] · fill color/text/primary · desktop/title · "Restore listing?"
    TEXT body 392x80 [FIXED/HUG] · fill color/text/secondary · desktop/body · "The listing returns to browse for everyone. The three reports stay on record and nobody learns who reported. The restore is recorded in the audit log under your account."
    FRAME actions 392x48 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Action/Button 101x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 53x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Cancel"
      INSTANCE Action/Button 107x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
        TEXT label 59x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Restore"
```

Restore. The body is **218** against `10.4e`'s **198** because it carries one more clause —
*"nobody learns who reported"* — which is the reporter-anonymity guarantee surviving a decision that goes
against the reporters.

### `10.4rb` — Flagged content · listing restored

**Reached from** `10.4r`  ·  **Leads to** nothing

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator, Active=Case queue} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator} · [standard, see header]
  FRAME content 1200x496 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    INSTANCE Desktop/SectionCard 1152x74 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 321x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Data entry — work from home · visible in browse"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Listing · the three reports stay on record; the auto-hide was dismissed on review 4 Sep 2026"
    INSTANCE Desktop/SectionCard 1152x126 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 75x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Reports (3)"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Fraud or scam — “Asks for a registration fee up front and gives no real address.”"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Fraud or scam — no detail given"
      TEXT row3 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Safety concern — no detail given"
    INSTANCE Desktop/SectionCard 1152x74 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 94x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Owner history"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "R. Gunasekara — Employer (Individual) · third posting · 2 warnings in the last 90 days"
    INSTANCE Desktop/SectionCard 1152x74 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 104x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Listing restored"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Back in browse for everyone. The three reports stay on record and nobody learns who reported. Recorded in the audit log under your account."
    INSTANCE Action/Button 158x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
      TEXT label 110x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Back to queue"
```

**Added 2026-09-22.** Restoring had no outcome screen, so `10.4r`'s Confirm was a dead end while
`10.3`'s and `10.4e`'s paths both continued.

The status line is the part worth reading: it says **"visible in browse"**, not `10.4`'s *"auto-hidden pending
review"*. Cloning the base screen carried a status the outcome invalidates, and leaving it would have
described a restored listing as still hidden. The `Reports (3)` and `Owner history` cards are unchanged,
because the reports do stay on record — that is exactly what `10.4r`'s dialog promises.

### `10.5` — Admin ruling

**Reached from** `10.1e`, `10.1er`  ·  **Leads to** nothing  ·  **Opens** `10.5e`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin, Active=Case queue} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin} · [standard, see header]
  FRAME content 1200x652 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    INSTANCE Desktop/SectionCard 1152x74 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 504x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Dispute — arrival could not be confirmed · escalated by Shalini Weerasinghe"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Shop assistant — weekend · Kavindu Perera (worker, raiser) vs Saman Stores (employer)"
    INSTANCE Desktop/SectionCard 1152x126 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 83x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Case history"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Code exchange: Arrival — no code entered · Completion — not reached · Payment — not reached"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Saman Stores responded: “I was away from the shop that morning, but my brother was there and the worker did arrive. Happy to clarify.” · 2 photos attached"
      TEXT row3 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Clarification — Kavindu Perera answered: “I arrived just before 8 AM. The shop was closed; the stall holder next door saw me waiting.”"
    INSTANCE Desktop/OptionGroup 1152x198 [FILL/HUG] · vertical pad 14/16/14/16 gap 10 · fill color/bg/default · r10
      TEXT groupTitle 169x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Outcome (three possible)"
      INSTANCE option1 1120x40 [FILL/HUG] · horizontal pad 10/14/10/14 gap 10 · fill color/bg/default · stroke color/brand/primary 2 · r8 · of Desktop/OptionRow · {State=Selected}
        ELLIPSE Ellipse 16x16 [FIXED/FIXED] · stroke color/brand/primary 1.5
        TEXT optLabel 1060x20 [FIXED/HUG] · fill color/text/primary · desktop/body · "For the raiser — Kavindu Perera"
      INSTANCE option2 1120x40 [FILL/HUG] · horizontal pad 10/14/10/14 gap 10 · fill color/bg/default · stroke color/border/default 1 · r8 · of Desktop/OptionRow · {State=Default}
        ELLIPSE Ellipse 16x16 [FIXED/FIXED] · stroke color/border/default 1.5
        TEXT optLabel 1060x20 [FIXED/HUG] · fill color/text/primary · desktop/body · "For the other party — Saman Stores"
      INSTANCE option3 1120x40 [FILL/HUG] · horizontal pad 10/14/10/14 gap 10 · fill color/bg/default · stroke color/border/default 1 · r8 · of Desktop/OptionRow · {State=Default}
        ELLIPSE Ellipse 16x16 [FIXED/FIXED] · stroke color/border/default 1.5
        TEXT optLabel 1060x20 [FIXED/HUG] · fill color/text/primary · desktop/body · "Inconclusive — the evidence doesn't support a determination"
    INSTANCE Desktop/SectionCard 1152x74 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 324x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Resolution notes (internal) · up to 300 characters"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Respondent’s own statement confirms the worker arrived; the code wasn’t entered because no one was present to enter it. Ruling for the raiser."
    TEXT notesNote 1100x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Resolution notes are internal — parties see the outcome only."
    INSTANCE Action/Button 179x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 131x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Choose outcome"
```

**`FR-ADM-01`'s three outcomes, as a `Desktop/OptionGroup` with exactly three `Desktop/OptionRow`
children.** Not two, not four: *for the raiser*, *for the other party*, *inconclusive*. An Admin who cannot
decide still has to record that, which is what makes `inconclusive` an outcome rather than an absence.

`option1` is `{State=Selected}` and carries the 2px `color/brand/primary` stroke; the other two are
`{State=Default}` at 1px. **Read the variant, not just the label** — that pair is what says which outcome
this screen depicts.

`Resolution notes` are internal — `notesNote` says the parties see the outcome only. The case card names the
Moderator who escalated it (**Shalini Weerasinghe**), so the chain of custody is on the screen.

### `10.5e` — Admin ruling · confirm final (dialog)

**Opens over** `10.5`  ·  **Cancel returns to** `10.5`  ·  **Confirm** → `10.5r`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin, Active=Case queue} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin} · [standard, see header]
  FRAME content 1200x652 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    INSTANCE Desktop/SectionCard 1152x74 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 504x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Dispute — arrival could not be confirmed · escalated by Shalini Weerasinghe"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Shop assistant — weekend · Kavindu Perera (worker, raiser) vs Saman Stores (employer)"
    INSTANCE Desktop/SectionCard 1152x126 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 83x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Case history"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Code exchange: Arrival — no code entered · Completion — not reached · Payment — not reached"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Saman Stores responded: “I was away from the shop that morning, but my brother was there and the worker did arrive. Happy to clarify.” · 2 photos attached"
      TEXT row3 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Clarification — Kavindu Perera answered: “I arrived just before 8 AM. The shop was closed; the stall holder next door saw me waiting.”"
    INSTANCE Desktop/OptionGroup 1152x198 [FILL/HUG] · vertical pad 14/16/14/16 gap 10 · fill color/bg/default · r10
      TEXT groupTitle 169x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Outcome (three possible)"
      INSTANCE option1 1120x40 [FILL/HUG] · horizontal pad 10/14/10/14 gap 10 · fill color/bg/default · stroke color/brand/primary 2 · r8 · of Desktop/OptionRow · {State=Selected}
        ELLIPSE Ellipse 16x16 [FIXED/FIXED] · stroke color/brand/primary 1.5
        TEXT optLabel 1060x20 [FIXED/HUG] · fill color/text/primary · desktop/body · "For the raiser — Kavindu Perera"
      INSTANCE option2 1120x40 [FILL/HUG] · horizontal pad 10/14/10/14 gap 10 · fill color/bg/default · stroke color/border/default 1 · r8 · of Desktop/OptionRow · {State=Default}
        ELLIPSE Ellipse 16x16 [FIXED/FIXED] · stroke color/border/default 1.5
        TEXT optLabel 1060x20 [FIXED/HUG] · fill color/text/primary · desktop/body · "For the other party — Saman Stores"
      INSTANCE option3 1120x40 [FILL/HUG] · horizontal pad 10/14/10/14 gap 10 · fill color/bg/default · stroke color/border/default 1 · r8 · of Desktop/OptionRow · {State=Default}
        ELLIPSE Ellipse 16x16 [FIXED/FIXED] · stroke color/border/default 1.5
        TEXT optLabel 1060x20 [FIXED/HUG] · fill color/text/primary · desktop/body · "Inconclusive — the evidence doesn't support a determination"
    INSTANCE Desktop/SectionCard 1152x74 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 324x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Resolution notes (internal) · up to 300 characters"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Respondent’s own statement confirms the worker arrived; the code wasn’t entered because no one was present to enter it. Ruling for the raiser."
    TEXT notesNote 1100x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Resolution notes are internal — parties see the outcome only."
    INSTANCE Action/Button 179x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 131x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Choose outcome"
  FRAME scrim 1440x900 [FIXED/FIXED] @0,0 · fill color/overlay/scrim · opacity 40%
  INSTANCE Desktop/DashDialog 440x198 [FIXED/HUG] @500,351 · vertical pad 20/24/20/24 gap 12 · fill color/bg/default · r12
    TEXT title 311x26 [HUG/HUG] · fill color/text/primary · desktop/title · "Confirm ruling: in the raiser's favour"
    TEXT body 392x60 [FIXED/HUG] · fill color/text/secondary · desktop/body · "This ruling is final — there is no appeals process. Both parties will be notified of the outcome, and the action will be recorded in the audit log under your account."
    FRAME actions 392x48 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Action/Button 101x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 53x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Cancel"
      INSTANCE Action/Button 157x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
        TEXT label 109x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Confirm ruling"
```

*"This ruling is final — there is no appeals process."* `NFR-*` states that absence deliberately,
and the dialog is where a user of the dashboard is made to read it before committing.

### `10.5p` — Admin ruling · payment dispute

**Reached from** `10.1pce`, `10.1pe`  ·  **Leads to** nothing  ·  **Opens** `10.5pe`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin, Active=Case queue} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin} · [standard, see header]
  FRAME content 1200x720 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    INSTANCE Desktop/SectionCard 1152x74 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 450x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Dispute — payment not released · escalated by Shalini Weerasinghe"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Warehouse packing — night shift · Tharindu Silva (worker, raiser) vs Ceylon Logistics (employer)"
    INSTANCE Desktop/SectionCard 1152x126 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 83x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Case history"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Code exchange: Arrival — entered 27 Aug 2026, 9:58 PM · Completion — entered 28 Aug 2026, 6:05 AM · Payment — no code entered"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Ceylon Logistics responded: “Payment was queued on 28 Aug 2026 but the worker's bank details were wrong. Re-sent on 29 Aug 2026.” · 1 photo attached"
      TEXT row3 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Clarification — Ceylon Logistics answered: “Receipt attached. It shows the transfer left our account on 29 Aug 2026; we cannot see which account it reached.” · 1 photo attached"
    INSTANCE Desktop/OptionGroup 1152x198 [FILL/HUG] · vertical pad 14/16/14/16 gap 10 · fill color/bg/default · r10
      TEXT groupTitle 169x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Outcome (three possible)"
      INSTANCE option1 1120x40 [FILL/HUG] · horizontal pad 10/14/10/14 gap 10 · fill color/bg/default · stroke color/border/default 1 · r8 · of Desktop/OptionRow · {State=Default}
        ELLIPSE Ellipse 16x16 [FIXED/FIXED] · stroke color/border/default 1.5
        TEXT optLabel 1060x20 [FIXED/HUG] · fill color/text/primary · desktop/body · "For the raiser — Tharindu Silva"
      INSTANCE option2 1120x40 [FILL/HUG] · horizontal pad 10/14/10/14 gap 10 · fill color/bg/default · stroke color/border/default 1 · r8 · of Desktop/OptionRow · {State=Default}
        ELLIPSE Ellipse 16x16 [FIXED/FIXED] · stroke color/border/default 1.5
        TEXT optLabel 1060x20 [FIXED/HUG] · fill color/text/primary · desktop/body · "For the other party — Ceylon Logistics"
      INSTANCE option3 1120x40 [FILL/HUG] · horizontal pad 10/14/10/14 gap 10 · fill color/bg/default · stroke color/brand/primary 2 · r8 · of Desktop/OptionRow · {State=Selected}
        ELLIPSE Ellipse 16x16 [FIXED/FIXED] · stroke color/brand/primary 1.5
        TEXT optLabel 1060x20 [FIXED/HUG] · fill color/text/primary · desktop/body · "Inconclusive — the evidence doesn't support a determination"
    INSTANCE Desktop/SectionCard 1152x92 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 324x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Resolution notes (internal) · up to 300 characters"
      TEXT row1 1120x36 [FIXED/HUG] · fill color/text/primary · desktop/table · "The receipt shows a transfer leaving the employer's account but not the account it reached, and the payment code was never entered. Neither account is contradicted by the evidence. Ruling inconclusive."
    TEXT scopeNote 1100x36 [FIXED/HUG] · fill color/text/secondary · desktop/table · "No payment moves through YouthLink, so this ruling cannot order a refund or force a transfer — it is reputational and record-keeping only, updating the responsible party's completion-rate record."
    TEXT notesNote 1100x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Resolution notes are internal — parties see the outcome only."
    INSTANCE Action/Button 179x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 131x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Choose outcome"
```

**Added 2026-09-22, and the first screen anywhere in the prototype to show `FR-ADM-02`.** The
requirement — that a payment ruling is reputational and record-keeping only, because no money moves through
YouthLink — had no visual until this frame. `scopeNote` states it in the screen:

> *No payment moves through YouthLink, so this ruling cannot order a refund or force a transfer — it is
> reputational and record-keeping only, updating the responsible party's completion-rate record.*

It is also the only screen that depicts `FR-ADM-01`'s **third** outcome. `option3` is `{State=Selected}`
here where `10.5` selects `option1`, and the resolution notes explain why: the receipt shows a transfer
leaving the employer's account but not the account it reached, so neither party's account is contradicted.

`content` is **720** against `10.5`'s 652 — `scopeNote` is a second note line and the resolution notes run
to 92.

### `10.5pe` — Admin ruling · confirm final (dialog), payment dispute

**Opens over** `10.5p`  ·  **Cancel returns to** `10.5p`  ·  **Confirm** → `10.5pr`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin, Active=Case queue} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin} · [standard, see header]
  FRAME content 1200x720 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    INSTANCE Desktop/SectionCard 1152x74 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 450x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Dispute — payment not released · escalated by Shalini Weerasinghe"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Warehouse packing — night shift · Tharindu Silva (worker, raiser) vs Ceylon Logistics (employer)"
    INSTANCE Desktop/SectionCard 1152x126 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 83x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Case history"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Code exchange: Arrival — entered 27 Aug 2026, 9:58 PM · Completion — entered 28 Aug 2026, 6:05 AM · Payment — no code entered"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Ceylon Logistics responded: “Payment was queued on 28 Aug 2026 but the worker's bank details were wrong. Re-sent on 29 Aug 2026.” · 1 photo attached"
      TEXT row3 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Clarification — Ceylon Logistics answered: “Receipt attached. It shows the transfer left our account on 29 Aug 2026; we cannot see which account it reached.” · 1 photo attached"
    INSTANCE Desktop/OptionGroup 1152x198 [FILL/HUG] · vertical pad 14/16/14/16 gap 10 · fill color/bg/default · r10
      TEXT groupTitle 169x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Outcome (three possible)"
      INSTANCE option1 1120x40 [FILL/HUG] · horizontal pad 10/14/10/14 gap 10 · fill color/bg/default · stroke color/border/default 1 · r8 · of Desktop/OptionRow · {State=Default}
        ELLIPSE Ellipse 16x16 [FIXED/FIXED] · stroke color/border/default 1.5
        TEXT optLabel 1060x20 [FIXED/HUG] · fill color/text/primary · desktop/body · "For the raiser — Tharindu Silva"
      INSTANCE option2 1120x40 [FILL/HUG] · horizontal pad 10/14/10/14 gap 10 · fill color/bg/default · stroke color/border/default 1 · r8 · of Desktop/OptionRow · {State=Default}
        ELLIPSE Ellipse 16x16 [FIXED/FIXED] · stroke color/border/default 1.5
        TEXT optLabel 1060x20 [FIXED/HUG] · fill color/text/primary · desktop/body · "For the other party — Ceylon Logistics"
      INSTANCE option3 1120x40 [FILL/HUG] · horizontal pad 10/14/10/14 gap 10 · fill color/bg/default · stroke color/brand/primary 2 · r8 · of Desktop/OptionRow · {State=Selected}
        ELLIPSE Ellipse 16x16 [FIXED/FIXED] · stroke color/brand/primary 1.5
        TEXT optLabel 1060x20 [FIXED/HUG] · fill color/text/primary · desktop/body · "Inconclusive — the evidence doesn't support a determination"
    INSTANCE Desktop/SectionCard 1152x92 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 324x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Resolution notes (internal) · up to 300 characters"
      TEXT row1 1120x36 [FIXED/HUG] · fill color/text/primary · desktop/table · "The receipt shows a transfer leaving the employer's account but not the account it reached, and the payment code was never entered. Neither account is contradicted by the evidence. Ruling inconclusive."
    TEXT scopeNote 1100x36 [FIXED/HUG] · fill color/text/secondary · desktop/table · "No payment moves through YouthLink, so this ruling cannot order a refund or force a transfer — it is reputational and record-keeping only, updating the responsible party's completion-rate record."
    TEXT notesNote 1100x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Resolution notes are internal — parties see the outcome only."
    INSTANCE Action/Button 179x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 131x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Choose outcome"
  FRAME scrim 1440x900 [FIXED/FIXED] @0,0 · fill color/overlay/scrim · opacity 40%
  INSTANCE Desktop/DashDialog 440x198 [FIXED/HUG] @500,351 · vertical pad 20/24/20/24 gap 12 · fill color/bg/default · r12
    TEXT title 244x26 [HUG/HUG] · fill color/text/primary · desktop/title · "Confirm ruling: inconclusive"
    TEXT body 392x60 [FIXED/HUG] · fill color/text/secondary · desktop/body · "This ruling is final — there is no appeals process. Both parties will be notified of the outcome, and the action will be recorded in the audit log under your account."
    FRAME actions 392x48 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Action/Button 101x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 53x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Cancel"
      INSTANCE Action/Button 157x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
        TEXT label 109x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Confirm ruling"
```

The confirm dialog for the payment ruling. The title names the outcome — *"Confirm ruling:
inconclusive"* — where `10.5e` says *"in the raiser's favour"*. The body is identical in both, because
finality does not depend on which way the ruling went.

### `10.5pr` — Admin ruling · recorded, payment dispute

**Reached from** `10.5pe`  ·  **Leads to** nothing

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin, Active=Case queue} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin} · [standard, see header]
  FRAME content 1200x820 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    INSTANCE Desktop/SectionCard 1152x74 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 450x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Dispute — payment not released · escalated by Shalini Weerasinghe"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Warehouse packing — night shift · Tharindu Silva (worker, raiser) vs Ceylon Logistics (employer)"
    INSTANCE Desktop/SectionCard 1152x126 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 83x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Case history"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Code exchange: Arrival — entered 27 Aug 2026, 9:58 PM · Completion — entered 28 Aug 2026, 6:05 AM · Payment — no code entered"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Ceylon Logistics responded: “Payment was queued on 28 Aug 2026 but the worker's bank details were wrong. Re-sent on 29 Aug 2026.” · 1 photo attached"
      TEXT row3 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Clarification — Ceylon Logistics answered: “Receipt attached. It shows the transfer left our account on 29 Aug 2026; we cannot see which account it reached.” · 1 photo attached"
    INSTANCE Desktop/OptionGroup 1152x198 [FILL/HUG] · vertical pad 14/16/14/16 gap 10 · fill color/bg/default · r10
      TEXT groupTitle 169x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Outcome (three possible)"
      INSTANCE option1 1120x40 [FILL/HUG] · horizontal pad 10/14/10/14 gap 10 · fill color/bg/default · stroke color/border/default 1 · r8 · of Desktop/OptionRow · {State=Default}
        ELLIPSE Ellipse 16x16 [FIXED/FIXED] · stroke color/border/default 1.5
        TEXT optLabel 1060x20 [FIXED/HUG] · fill color/text/primary · desktop/body · "For the raiser — Tharindu Silva"
      INSTANCE option2 1120x40 [FILL/HUG] · horizontal pad 10/14/10/14 gap 10 · fill color/bg/default · stroke color/border/default 1 · r8 · of Desktop/OptionRow · {State=Default}
        ELLIPSE Ellipse 16x16 [FIXED/FIXED] · stroke color/border/default 1.5
        TEXT optLabel 1060x20 [FIXED/HUG] · fill color/text/primary · desktop/body · "For the other party — Ceylon Logistics"
      INSTANCE option3 1120x40 [FILL/HUG] · horizontal pad 10/14/10/14 gap 10 · fill color/bg/default · stroke color/brand/primary 2 · r8 · of Desktop/OptionRow · {State=Selected}
        ELLIPSE Ellipse 16x16 [FIXED/FIXED] · stroke color/brand/primary 1.5
        TEXT optLabel 1060x20 [FIXED/HUG] · fill color/text/primary · desktop/body · "Inconclusive — the evidence doesn't support a determination"
    INSTANCE Desktop/SectionCard 1152x92 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 324x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Resolution notes (internal) · up to 300 characters"
      TEXT row1 1120x36 [FIXED/HUG] · fill color/text/primary · desktop/table · "The receipt shows a transfer leaving the employer's account but not the account it reached, and the payment code was never entered. Neither account is contradicted by the evidence. Ruling inconclusive."
    TEXT notesNote 1100x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Resolution notes are internal — parties see the outcome only."
    INSTANCE Desktop/SectionCard 1152x74 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 208x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Ruling recorded — inconclusive"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Both parties notified. No completion-rate record changes, since no party was found responsible. Audit log entry written under your account."
    INSTANCE Action/Button 122x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/subtle · stroke color/border/default 1 · r8 · {Style=Primary, State=Disabled}
      TEXT label 74x24 [HUG/HUG] · fill color/text/secondary · mobile/body-medium · "Recorded"
    INSTANCE Action/Button 158x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
      TEXT label 110x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Back to queue"
```

Recorded. **`scopeNote` is deliberately absent here** — it guides the decision, and by this
screen the decision is made; the outcome card carries the consequence instead. Dropping it is also what
keeps `content` inside the 900px frame: with it the block reached 944 and overflowed, which no other frame
in the module does.

*"No completion-rate record changes, since no party was found responsible"* is `FR-ADM-02` followed through
to an inconclusive ruling — the reputational effect the requirement describes has nothing to attach to.

### `10.5r` — Admin ruling · recorded

**Reached from** `10.5e`  ·  **Leads to** nothing

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin, Active=Case queue} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin} · [standard, see header]
  FRAME content 1200x770 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    INSTANCE Desktop/SectionCard 1152x74 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 553x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Dispute — arrival could not be confirmed · ruled 4 Sep 2026 by Kasun Jayawardena"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Shop assistant — weekend · Kavindu Perera (worker, raiser) vs Saman Stores (employer)"
    INSTANCE Desktop/SectionCard 1152x126 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 83x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Case history"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Code exchange: Arrival — no code entered · Completion — not reached · Payment — not reached"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Saman Stores responded: “I was away from the shop that morning, but my brother was there and the worker did arrive. Happy to clarify.” · 2 photos attached"
      TEXT row3 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Clarification — Kavindu Perera answered: “I arrived just before 8 AM. The shop was closed; the stall holder next door saw me waiting.”"
    INSTANCE Desktop/OptionGroup 1152x198 [FILL/HUG] · vertical pad 14/16/14/16 gap 10 · fill color/bg/default · r10
      TEXT groupTitle 169x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Outcome (three possible)"
      INSTANCE option1 1120x40 [FILL/HUG] · horizontal pad 10/14/10/14 gap 10 · fill color/bg/default · stroke color/brand/primary 2 · r8 · of Desktop/OptionRow · {State=Selected}
        ELLIPSE Ellipse 16x16 [FIXED/FIXED] · stroke color/brand/primary 1.5
        TEXT optLabel 1060x20 [FIXED/HUG] · fill color/text/primary · desktop/body · "For the raiser — Kavindu Perera"
      INSTANCE option2 1120x40 [FILL/HUG] · horizontal pad 10/14/10/14 gap 10 · fill color/bg/default · stroke color/border/default 1 · r8 · of Desktop/OptionRow · {State=Default}
        ELLIPSE Ellipse 16x16 [FIXED/FIXED] · stroke color/border/default 1.5
        TEXT optLabel 1060x20 [FIXED/HUG] · fill color/text/primary · desktop/body · "For the other party — Saman Stores"
      INSTANCE option3 1120x40 [FILL/HUG] · horizontal pad 10/14/10/14 gap 10 · fill color/bg/default · stroke color/border/default 1 · r8 · of Desktop/OptionRow · {State=Default}
        ELLIPSE Ellipse 16x16 [FIXED/FIXED] · stroke color/border/default 1.5
        TEXT optLabel 1060x20 [FIXED/HUG] · fill color/text/primary · desktop/body · "Inconclusive — the evidence doesn't support a determination"
    INSTANCE Desktop/SectionCard 1152x74 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 324x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Resolution notes (internal) · up to 300 characters"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Respondent’s own statement confirms the worker arrived; the code wasn’t entered because no one was present to enter it. Ruling for the raiser."
    INSTANCE Desktop/SectionCard 1152x74 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 105x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Ruling recorded"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Recorded — both parties have been notified of the outcome (final, no appeals). Audit log entry written under your account."
    INSTANCE Action/Button 122x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/subtle · stroke color/border/default 1 · r8 · {Style=Primary, State=Disabled}
      TEXT label 74x24 [HUG/HUG] · fill color/text/secondary · mobile/body-medium · "Recorded"
    INSTANCE Action/Button 158x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
      TEXT label 110x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Back to queue"
```

**A terminal state that keeps its button.** The primary becomes `{State=Disabled}` reading
*"Recorded"* rather than disappearing, with a secondary `Back to queue` beside it.

### `10.6` — Suspend account? (dialog)

**Opens over** `11.3g`  ·  **Cancel** back → `11.3g`  ·  **Confirm** → `10.6b`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin, Active=Users} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin} · [standard, see header]
  FRAME content 1200x580 [FIXED/FIXED] @240,56 · vertical pad 20/24/24/24 gap 14
    TEXT searchContext 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Search: “+94 71 987 6543” — 1 match · reached from the flagged listing's owner"
    INSTANCE Desktop/DetailPane 420x344 [FIXED/HUG] · vertical pad 20 gap 10 · fill color/bg/default · r8 · {Role=Admin}
      FRAME nameRow 380x26 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT userName 295x26 [FILL/HUG] · fill color/text/primary · desktop/title · "R. Gunasekara"
        INSTANCE Display/Badge 77x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
          VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
          TEXT label 44x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Verified"
      FRAME field-Phone 380x20 [FILL/HUG] · horizontal pad 0 gap 12
        TEXT fieldLabel 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Phone"
        TEXT fieldValue 248x20 [FILL/HUG] · fill color/text/primary · desktop/body · "+94 71 987 6543"
      FRAME field-Role 380x20 [FILL/HUG] · horizontal pad 0 gap 12
        TEXT fieldLabel 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Role"
        TEXT fieldValue 248x20 [FILL/HUG] · fill color/text/primary · desktop/body · "Employer (Individual)"
      FRAME field-NIC 380x20 [FILL/HUG] · horizontal pad 0 gap 12
        TEXT fieldLabel 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "NIC"
        TEXT fieldValue 248x20 [FILL/HUG] · fill color/text/primary · desktop/body · "198712345678"
      FRAME field-Rating 380x20 [FILL/HUG] · horizontal pad 0 gap 12
        TEXT fieldLabel 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Rating"
        TEXT fieldValue 248x20 [FILL/HUG] · fill color/text/primary · desktop/body · "No completed engagements"
      FRAME field-Endorsements 380x20 [FILL/HUG] · horizontal pad 0 gap 12
        TEXT fieldLabel 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Endorsements"
        TEXT fieldValue 248x20 [FILL/HUG] · fill color/text/primary · desktop/body · "0 received · 0 given"
      FRAME field-Case history 380x60 [FILL/HUG] · horizontal pad 0 gap 12
        TEXT fieldLabel 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Case history"
        TEXT fieldValue 248x60 [FILL/HUG] · fill color/text/primary · desktop/body · "3 reports on current posting · 3 warnings in 90 days — auto-escalated"
      FRAME actions 303x48 [HUG/HUG] · horizontal pad 0 gap 8
        INSTANCE Action/Button 182x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/state/danger · r8 · {Style=Destructive, State=Default}
          TEXT label 134x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Suspend account"
        INSTANCE Action/Button 113x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/border/default 1.5 · r8 · {Style=Secondary, State=Disabled}
          TEXT label 65x24 [HUG/HUG] · fill color/text/secondary · mobile/body-medium · "Promote"
    TEXT promoteLock 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Promotion is unavailable while a suspension review is open."
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 463x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Case history — the aggregate-only rule's stated exception (staff only)"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "3 open reports on “Data entry — work from home” · escalated for removal 31 Aug 2026"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "No resolved disputes · third warning recorded 3 Sep 2026 by Shalini Weerasinghe (Moderator) — auto-escalated for suspension review"
  FRAME scrim 1440x900 [FIXED/FIXED] @0,0 · fill color/overlay/scrim · opacity 40%
  INSTANCE Desktop/DashDialog 440x198 [FIXED/HUG] @500,351 · vertical pad 20/24/20/24 gap 12 · fill color/bg/default · r12
    TEXT title 306x26 [HUG/HUG] · fill color/text/primary · desktop/title · "Suspend R. Gunasekara's account?"
    TEXT body 392x60 [FIXED/HUG] · fill color/text/secondary · desktop/body · "Suspension takes effect on their next request. Existing engagements with uninvolved parties are untouched. The action is recorded in the audit log under your account."
    FRAME actions 392x48 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Action/Button 101x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 53x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Cancel"
      INSTANCE Action/Button 182x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
        TEXT label 134x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Suspend account"
```

The suspension dialog over `11.3g`. `FR-ADM-03` requires immediate effect, and the body states the
mechanism precisely — *"takes effect on their next request"* — rather than "immediately", which would be
ambiguous about in-progress sessions.

*"Existing engagements with uninvolved parties are untouched"* is the proportionality rule: suspending an
employer must not punish workers who did nothing.

The `Suspend account` button in the `DetailPane` is `{Style=Destructive}` on `fill color/state/danger` — the
only destructive variant used anywhere in this module.

### `10.6b` — Suspend account · suspended

**Reached from** `10.6`  ·  **Leads to** nothing

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin, Active=Users} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin} · [standard, see header]
  FRAME content 1200x654 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    INSTANCE Desktop/SectionCard 1152x74 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 388x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Account suspended — 4 Sep 2026 by Kasun Jayawardena"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Takes effect on their next request. Existing engagements with uninvolved parties are untouched. Recorded in the audit log."
    TEXT searchContext 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Search: “+94 71 987 6543” — 1 match · reached from the flagged listing's owner"
    INSTANCE Desktop/DetailPane 420x344 [FIXED/HUG] · vertical pad 20 gap 10 · fill color/bg/default · r8 · {Role=Admin}
      FRAME nameRow 380x26 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT userName 295x26 [FILL/HUG] · fill color/text/primary · desktop/title · "R. Gunasekara"
        INSTANCE Display/Badge 77x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
          VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
          TEXT label 44x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Verified"
      FRAME field-Phone 380x20 [FILL/HUG] · horizontal pad 0 gap 12
        TEXT fieldLabel 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Phone"
        TEXT fieldValue 248x20 [FILL/HUG] · fill color/text/primary · desktop/body · "+94 71 987 6543"
      FRAME field-Role 380x20 [FILL/HUG] · horizontal pad 0 gap 12
        TEXT fieldLabel 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Role"
        TEXT fieldValue 248x20 [FILL/HUG] · fill color/text/primary · desktop/body · "Employer (Individual)"
      FRAME field-NIC 380x20 [FILL/HUG] · horizontal pad 0 gap 12
        TEXT fieldLabel 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "NIC"
        TEXT fieldValue 248x20 [FILL/HUG] · fill color/text/primary · desktop/body · "198712345678"
      FRAME field-Rating 380x20 [FILL/HUG] · horizontal pad 0 gap 12
        TEXT fieldLabel 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Rating"
        TEXT fieldValue 248x20 [FILL/HUG] · fill color/text/primary · desktop/body · "No completed engagements"
      FRAME field-Endorsements 380x20 [FILL/HUG] · horizontal pad 0 gap 12
        TEXT fieldLabel 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Endorsements"
        TEXT fieldValue 248x20 [FILL/HUG] · fill color/text/primary · desktop/body · "0 received · 0 given"
      FRAME field-Case history 380x60 [FILL/HUG] · horizontal pad 0 gap 12
        TEXT fieldLabel 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Case history"
        TEXT fieldValue 248x60 [FILL/HUG] · fill color/text/primary · desktop/body · "3 reports on current posting · 3 warnings in 90 days — auto-escalated"
      FRAME actions 256x48 [HUG/HUG] · horizontal pad 0 gap 8
        INSTANCE Action/Button 135x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/subtle · stroke color/border/default 1 · r8 · {Style=Destructive, State=Disabled}
          TEXT label 87x24 [HUG/HUG] · fill color/text/secondary · mobile/body-medium · "Suspended"
        INSTANCE Action/Button 113x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/border/default 1.5 · r8 · {Style=Secondary, State=Disabled}
          TEXT label 65x24 [HUG/HUG] · fill color/text/secondary · mobile/body-medium · "Promote"
    TEXT promoteLock 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Promotion is unavailable while the account is suspended."
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 463x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Case history — the aggregate-only rule's stated exception (staff only)"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "3 open reports on “Data entry — work from home” · escalated for removal 31 Aug 2026"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "No resolved disputes · third warning recorded 3 Sep 2026 by Shalini Weerasinghe (Moderator) — auto-escalated for suspension review"
```

Suspended. `Suspend account` becomes a `{Style=Destructive, State=Disabled}` *"Suspended"*,
`promoteLock`'s reason changes from *"while a suspension review is open"* to *"while the account is
suspended"*, and a 74-tall outcome card is inserted **above** `searchContext` — the only card in the module
placed above the search-context line.

### `10.7b` — Remove posting · removed

**Reached from** [M11](M11-dashboard.md) all postings  ·  **Leads to** nothing

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin, Active=All postings} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin} · [standard, see header]
  FRAME content 1200x718 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    FRAME tableBlock 1152x554 [FILL/HUG] · vertical pad 0 gap 0 · fill color/bg/default · r8
      INSTANCE Desktop/DataTable 1152x510 [FILL/HUG] · vertical pad 0 gap 0 · {Show row 4=true}
        FRAME filterRow 1152x56 [FILL/HUG] · horizontal pad 12/16/12/16 gap 8
          INSTANCE Input/Chip 64x32 [HUG/HUG] · horizontal pad 6/14/6/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
            TEXT label 36x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Open"
          INSTANCE Input/Chip 64x32 [HUG/HUG] · horizontal pad 6/14/6/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
            TEXT label 36x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Filled"
          INSTANCE Input/Chip 100x32 [HUG/HUG] · horizontal pad 6/14/6/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
            TEXT label 72x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Withdrawn"
          INSTANCE Input/Chip 78x32 [HUG/HUG] · horizontal pad 6/14/6/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
            TEXT label 50x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Expired"
        FRAME headerRow 1152x34 [FILL/HUG] · horizontal pad 8/16/8/16 gap 16 · fill bg/brand-tint
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Title"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Employer"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Category"
          TEXT cell 140x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Status"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Moderation"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Posted ↓"
        FRAME dataRow 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Data entry — work from home"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "R. Gunasekara"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Retail"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 93x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Withdrawn}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 67x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Withdrawn"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Removed"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "30 Aug 2026"
        FRAME dataRow 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Event setup crew (3 needed)"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Lanka Events (Pvt) Ltd"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Event setup"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "27 Aug 2026"
        FRAME dataRow 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Shop assistant — weekend"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Saman Stores"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Retail"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Filled}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/brand/primary
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Filled"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "25 Aug 2026"
        FRAME dataRow4 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "House move helpers"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Dilrukshi Herath"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Moving"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "12 Aug 2026"
        FRAME dataRow05 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Café service crew — evenings"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Green Leaf Café"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Hospitality"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Filled}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/brand/primary
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Filled"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "10 Aug 2026"
        FRAME dataRow06 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Maths tutoring — O/L"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Dilrukshi Herath"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Tutoring"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Filled}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/brand/primary
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Filled"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "8 Aug 2026"
        FRAME dataRow07 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Office cleaning — weekly"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "A. Wijeratne"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Cleaning"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 93x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Withdrawn}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 67x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Withdrawn"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "6 Aug 2026"
        FRAME dataRow08 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Delivery rider — weekends"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "FreshCart"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Delivery"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Filled}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/brand/primary
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Filled"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "4 Aug 2026"
        FRAME dataRow09 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Stage crew — Friday setup"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Lanka Events (Pvt) Ltd"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Event setup"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "2 Aug 2026"
        FRAME dataRow10 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Event teardown — Sunday"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Kottawa Business Centre"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Event setup"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Filled}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/brand/primary
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Filled"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "30 Jul 2026"
      INSTANCE pagination 1152x44 [FILL/FIXED] · horizontal pad 12/16/12/16 gap 0 · fill color/bg/default · stroke color/border/default mixed · of Desktop/Pagination · {Page=First}
        TEXT countText 128x20 [HUG/HUG] · fill color/text/secondary · desktop/body · "Showing 1–10 of 85"
        FRAME pager 131x20 [HUG/HUG] · horizontal pad 0 gap 16
          TEXT position 74x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Page 1 of 9"
          TEXT nextLink 41x20 [HUG/HUG] · fill color/brand/primary · desktop/body-medium · "Next ›"
    INSTANCE Desktop/SectionCard 1152x74 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 112x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Posting removed"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Removed “Data entry — work from home” — new applications stopped immediately; engagements already in progress continue. Recorded in the audit log under your account."
    TEXT scopeNote 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Every posting on the platform, regardless of report status — including content hidden pending review. Sorted newest first."
```

**The only `Desktop/DataTable` in this module**, and the widest surface in the specification.

Each row's status is a `Desktop/DashBadge` whose `{Value=…}` drives the dot colour: `Open` →
`color/state/success`, `Filled` → `color/brand/primary`, `Withdrawn` and `Expired` → `color/text/secondary`.
**Five rows had a `Value` that disagreed with their own label** and were corrected on 2026-09-22; four of
them rendered a "Filled" row with the grey Expired dot. Build from the variant, not the label text.

`scopeNote` is the requirement: every posting **regardless of report status**, including content hidden
pending review. An Admin who could only see un-reported postings could not find the one to remove.
`Desktop/Pagination {Page=First}` reports **85** postings across 9 pages while the table draws 10.

### `10.8` — Promote a user

**Reached from** [M11](M11-dashboard.md) users  ·  **Leads to** `10.8b`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin, Active=Users} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin} · [standard, see header]
  FRAME content 1200x400 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 80x20 [HUG/HUG] · fill color/text/primary · desktop/body · "User search"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "+94 71 234 5678 — 1 match"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "T. Abeysekera — registered user · Verified"
    INSTANCE Desktop/OptionGroup 1152x148 [FILL/HUG] · vertical pad 14/16/14/16 gap 10 · fill color/bg/default · r10
      TEXT groupTitle 61x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Staff role"
      INSTANCE option1 1120x40 [FILL/HUG] · horizontal pad 10/14/10/14 gap 10 · fill color/bg/default · stroke color/brand/primary 2 · r8 · of Desktop/OptionRow · {State=Selected}
        ELLIPSE Ellipse 16x16 [FIXED/FIXED] · stroke color/brand/primary 1.5
        TEXT optLabel 1060x20 [FIXED/HUG] · fill color/text/primary · desktop/body · "Moderator — handles volume: triage, warnings, escalation"
      INSTANCE option2 1120x40 [FILL/HUG] · horizontal pad 10/14/10/14 gap 10 · fill color/bg/default · stroke color/border/default 1 · r8 · of Desktop/OptionRow · {State=Default}
        ELLIPSE Ellipse 16x16 [FIXED/FIXED] · stroke color/border/default 1.5
        TEXT optLabel 1060x20 [FIXED/HUG] · fill color/text/primary · desktop/body · "Admin — handles consequence: rulings, suspension, removal"
    TEXT a34note 1100x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "This creates a separate staff account. First login: one-time code to their phone, then they set a dashboard password."
    INSTANCE Action/Button 113x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 65x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Promote"
```

`FR-ADM-06` phase 2 — promote an already-registered user. The `Desktop/OptionGroup` offers the two
staff roles and describes them by what they handle: *"Moderator — handles volume"*, *"Admin — handles
consequence."* That phrasing is the module's organising idea stated in one place.

`a34note` carries the A34 amendment: a **separate** staff account (`FR-ADM-07`), first login by one-time code
to their phone, then set a dashboard password.

### `10.8b` — Promote a user · promoted

**Reached from** `10.8`  ·  **Leads to** nothing

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin, Active=Users} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin} · [standard, see header]
  FRAME content 1200x250 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 80x20 [HUG/HUG] · fill color/text/primary · desktop/body · "User search"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "+94 71 234 5678 — 1 match"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "T. Abeysekera — registered user · Verified"
    INSTANCE Desktop/SectionCard 1152x92 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 144x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Staff account created"
      TEXT row1 1120x36 [FIXED/HUG] · fill color/text/secondary · desktop/table · "T. Abeysekera is now a Moderator. A separate staff account was created — first login is a one-time code to their phone, then they set a dashboard password. Recorded in the audit log under your account."
```

Promoted. The two cards remain and the `OptionGroup` is gone — the choice is spent. `content`
drops from 400 to **250**.

### `11.3g` — User detail · Admin (R. Gunasekara)

**Reached from** [M11](M11-dashboard.md) users, searched by phone  ·  **Leads to** nothing  ·  **Opens** `10.6`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin, Active=Users} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin} · [standard, see header]
  FRAME content 1200x580 [FIXED/FIXED] @240,56 · vertical pad 20/24/24/24 gap 14
    TEXT searchContext 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Search: “+94 71 987 6543” — 1 match · reached from the flagged listing's owner"
    INSTANCE Desktop/DetailPane 420x344 [FIXED/HUG] · vertical pad 20 gap 10 · fill color/bg/default · r8 · {Role=Admin}
      FRAME nameRow 380x26 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT userName 295x26 [FILL/HUG] · fill color/text/primary · desktop/title · "R. Gunasekara"
        INSTANCE Display/Badge 77x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
          VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
          TEXT label 44x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Verified"
      FRAME field-Phone 380x20 [FILL/HUG] · horizontal pad 0 gap 12
        TEXT fieldLabel 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Phone"
        TEXT fieldValue 248x20 [FILL/HUG] · fill color/text/primary · desktop/body · "+94 71 987 6543"
      FRAME field-Role 380x20 [FILL/HUG] · horizontal pad 0 gap 12
        TEXT fieldLabel 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Role"
        TEXT fieldValue 248x20 [FILL/HUG] · fill color/text/primary · desktop/body · "Employer (Individual)"
      FRAME field-NIC 380x20 [FILL/HUG] · horizontal pad 0 gap 12
        TEXT fieldLabel 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "NIC"
        TEXT fieldValue 248x20 [FILL/HUG] · fill color/text/primary · desktop/body · "198712345678"
      FRAME field-Rating 380x20 [FILL/HUG] · horizontal pad 0 gap 12
        TEXT fieldLabel 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Rating"
        TEXT fieldValue 248x20 [FILL/HUG] · fill color/text/primary · desktop/body · "No completed engagements"
      FRAME field-Endorsements 380x20 [FILL/HUG] · horizontal pad 0 gap 12
        TEXT fieldLabel 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Endorsements"
        TEXT fieldValue 248x20 [FILL/HUG] · fill color/text/primary · desktop/body · "0 received · 0 given"
      FRAME field-Case history 380x60 [FILL/HUG] · horizontal pad 0 gap 12
        TEXT fieldLabel 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Case history"
        TEXT fieldValue 248x60 [FILL/HUG] · fill color/text/primary · desktop/body · "3 reports on current posting · 3 warnings in 90 days — auto-escalated"
      FRAME actions 303x48 [HUG/HUG] · horizontal pad 0 gap 8
        INSTANCE Action/Button 182x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/state/danger · r8 · {Style=Destructive, State=Default}
          TEXT label 134x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Suspend account"
        INSTANCE Action/Button 113x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/border/default 1.5 · r8 · {Style=Secondary, State=Disabled}
          TEXT label 65x24 [HUG/HUG] · fill color/text/secondary · mobile/body-medium · "Promote"
    TEXT promoteLock 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Promotion is unavailable while a suspension review is open."
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 463x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Case history — the aggregate-only rule's stated exception (staff only)"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "3 open reports on “Data entry — work from home” · escalated for removal 31 Aug 2026"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "No resolved disputes · third warning recorded 3 Sep 2026 by Shalini Weerasinghe (Moderator) — auto-escalated for suspension review"
```

**Numbered `11.x` but drawn on this page.** It belongs to M11's user-detail flow; it sits here so
that `11.3g → 10.6` is a same-page edge rather than a cross-page one, which Figma cannot express. The frame
name records that reason.

It is the base `10.6` and `10.6b` are drawn over, and is now byte-identical to `10.6` minus the scrim and
dialog — `promoteLock` had drifted to `1152 [FILL]` on `10.6`/`10.6b` against this frame's `1120 [FIXED]`
and was corrected on 2026-09-22.

`Case history` on the `Desktop/DetailPane`, and the `SectionCard` beneath it, are the **stated exception to
the aggregate-only rule** — staff see individual case detail that no ordinary user can. The card title says
so out loud.

---

## What the collapsed header hides

`design-system.md` §6 collapses `Desktop/DashSidebar` and `Desktop/DashHeader` to one line each, because they
are identical on all 39 frames and specifying them per screen would triple the file. One thing is lost in
that collapse and it matters here: **the header carries `staffName`, and it is not the same on every frame.**

| Frame(s) | `staffName` | `roleLabel` |
| --- | --- | --- |
| all Moderator frames except `10.1t` | Shalini Weerasinghe | Moderator |
| `10.1t` | T. Abeysekera | Moderator |
| all Admin frames | Kasun Jayawardena | Admin |

This is why `10.1` and `10.1t` render as identical trees while being different screens, and it is the only
place in the module where two frames cannot be told apart from what is written here. The names are consistent
with the case text — `10.5` is *"escalated by Shalini Weerasinghe"*, `10.5r` is *"ruled … by Kasun
Jayawardena"*, `10.3c` is *"recorded … by Shalini Weerasinghe (Moderator)"* — so the cast is load-bearing,
not decoration.

## Transitions that are not clicks

Three screens advance on a **frame-level `AFTER_TIMEOUT` of 2s** rather than on a button, because what moves
them is time passing, not a Moderator acting. They appear in the trees as `[frame reaction] AFTER_TIMEOUT 2s`.

| From | To | What moves it |
| --- | --- | --- |
| `10.1` | `10.1r` | the respondent answers, or their 48-hour window closes — `FR-DISPUTE-04` |
| `10.1c` | `10.1a` | the clarification is answered, or its 24-hour window closes — `FR-MOD-03` |
| `10.1pc` | `10.1pca` | the same, on the payment case |

Build these as server-driven state, not as navigation. **The 2s timeout is a demo device** — it exists so the
prototype can be walked end to end, and carries no product meaning.

Two further transitions are real but **cannot be drawn at all**, because a Figma prototype link must target a
top-level frame **on the same page**:

| From | To | Why it is not wired |
| --- | --- | --- |
| `10.4e` Confirm | [M11](M11-dashboard.md) `11.2ad` → `10.7` → `11.2x` | removal is an Admin action on another page (`NFR-SEC-05`) |
| `Back to queue` on `10.3c`, `10.3pb`, `10.3sb`, `10.4rb`, `10.5pr`, `10.5r` | the case list on [M11](M11-dashboard.md) | the queue lives on another page |

`Back to case` on `10.2b` and `10.2pb` stays inside this module, which is why those two *are* wired and the
six are not. That same constraint is why `11.3g` — an M11 screen by number — is drawn on this page at all.

## Reading the DataTable

`10.7b`'s table is the one place in the module where the **variant carries information the text does not**.
Each `dataRow` holds five `TEXT cell` children plus a `statusCell` wrapping a `Desktop/DashBadge`, and the
badge's `{Value=…}` sets its dot colour independently of the label:

| `Value` | dot |
| --- | --- |
| `Open` | `color/state/success` |
| `Filled` | `color/brand/primary` |
| `Withdrawn`, `Expired` | `color/text/secondary` |

Read a row as `cell, cell, cell, statusCell, cell, cell` — title, employer, category, *status badge*,
moderation, date. `{Show row 4=true}` on the `DataTable` is the component's tenth-row toggle, not a filter.

## Four threads through one queue

The module is not one flow but four, sharing a queue and a chrome. Three of the four end in a consequence
that a different role delivers.

| Thread | Screens | Ends at |
| --- | --- | --- |
| **Arrival dispute** — Kavindu Perera vs Saman Stores | `10.1`, `10.1t`, `10.1r`, `10.1a`, `10.1c`, `10.1e`, `10.1er`, `10.2`, `10.2b`, `10.3s`, `10.3sb` | a Moderator warning, **or** escalation to `10.5` → `10.5e` → `10.5r` |
| **Payment dispute** — Tharindu Silva vs Ceylon Logistics | `10.1p`, `10.1pa`, `10.1pc`, `10.1pca`, `10.1pce`, `10.1pe`, `10.2p`, `10.2pb`, `10.3p`, `10.3pb` | the same two exits, but the ruling at `10.5p` is bounded by `FR-ADM-02` |
| **Flagged listing** — R. Gunasekara's posting | `10.4`, `10.4e`, `10.4r`, `10.4rb`, `10.3`, `10.3c` | restored at `10.4rb`, warned at `10.3c`, or escalated for removal |
| **Promotion** — T. Abeysekera | `10.8`, `10.8b` | `10.1t`, the promoted account working the queue |

The flagged-listing thread is the one that demonstrates `FR-MOD-02` end to end: a Moderator records a warning
(`10.3`), the third in 90 days auto-escalates (`10.3c`), an Admin reviews the account (`11.3g`) and suspends
it (`10.6` → `10.6b`), and separately removes the posting (`10.7b`). **No single role performs that
sequence** — which is the split `10.8`'s option labels describe.

## States not drawn in this module

| State | Build it as |
| --- | --- |
| A ruling *for the other party* | `10.5r` or `10.5pr` with `option2` selected and the outcome sentence changed. The `OptionGroup`, the notes card and the finality line are identical — `FR-ADM-01`'s three outcomes share one screen |
| A clarification window that expired unanswered | `10.1r` / `10.1pca` — the actions unlock on expiry exactly as they unlock on an answer, which is what `disabledReason` promises |
| A second clarification | not built, and not buildable — `FR-MOD-03` allows **one** request per case, so a second is a requirement change rather than a screen. The interface enforces it: `Request clarification` is `{State=Disabled}` with a `clarifyLock` note on `10.1a` and `10.1pca`, the two screens where a clarification has already been answered |
| Reactivating a suspended account | not drawn. `FR-ADM-03` covers suspension; the reverse is in `FR-ADM-07`'s staff-account surface (O6), which lands in [M11](M11-dashboard.md) |
| Verification-document approval | deliberately absent — `FR-ADM-04` is future-contingent and not built in this version |
| An Admin acting on an un-escalated case | `10.1pa`, which is exactly that state, and carries no buttons |
