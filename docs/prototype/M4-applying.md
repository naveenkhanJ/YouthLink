# M4 — Applying and selection

**Sixty-eight screens.** Both sides of an application: the worker applying, following and withdrawing (Kavindu Perera, across Thursday 27 Aug, Friday and the weekend), and the employer choosing from the pool (Lanka Events' Event setup crew, 3 needed) — select, contact reveal, decline, and the pool after the posting closes.

**Read *Every screen shows one moment* at the end first.** Every application list is the same list at a later minute, and every date, count and state on it follows from the ones before.

Read `README.md` for the notation and `design-system.md` for the tokens and components. **The tab bar repeats on every list, so it reads `[standard, see header]`**; *What the collapsed tab bar hides*, at the end, spells out what varies under it.

---

### `4.1s` — Apply · Shop assistant

**Reached from** [M3](M3-discovery.md) `3.12s` (Apply)  ·  **Leads to** `4.2s` ("Submit application")  ·  **Exits** back → [M3](M3-discovery.md) `3.12s`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Apply"
  FRAME content 360x660 [FILL/FILL] · vertical pad 20/16/0/16 gap 12
    TEXT context 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Shop assistant — weekend · Saman Stores"
    TEXT noteLabel 141x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Note to the employer"
    INSTANCE noteField 328x98 [FILL/HUG] · vertical pad 12 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8 · of Input/TextArea · {State=Filled}
      TEXT value 302x72 [FILL/HUG] · fill color/text/primary · mobile/body · "I've helped run my family's shop — comfortable with sales, stock and customers."
    TEXT prefillNote 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Optional — the employer sees it with your profile."
    FRAME spacer-grow 8x434 [FIXED/FILL]
  FRAME ctaBar 360x84 [FILL/HUG] · vertical pad 12/16/24/16 gap 8 · fill color/bg/default
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 143x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Submit application"
```

**Kavindu, Thursday 27 Aug, a little before 8:00 AM** — his first application, minutes after his first
Browse (M3 `3.1`). One screen, as FR-APPLY-02 asks: an optional note of up to 300 characters and Submit.
`prefillNote` says only what is true — *"Optional — the employer sees it with your profile."* FR-APPLY-02
pre-fills the note from the profile bio (FR-PROF-04), and Kavindu has no bio on Thursday, so there is
nothing to pre-fill; each of his notes is written for its gig. Until 2026-09-23 this line claimed the note
had been filled from his bio.

### `4.2s` — Application sent · Shop assistant

**Reached from** `4.1s`  ·  **Leads to** `4.3s` ("View my applications")

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x800 [FILL/FILL] · vertical pad 24 gap 12
    FRAME successGlyph 56x56 [FIXED/FIXED]
      ELLIPSE Ellipse 56x56 [FIXED/FIXED] @0,0 · stroke color/state/success 2.5
      VECTOR Vector 25x18 [FIXED/FIXED] @16,20 · stroke color/state/success 3
    TEXT successTitle 158x28 [HUG/HUG] · fill color/text/primary · mobile/title · "Application sent"
    TEXT line 280x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · align center · "Saman Stores will see your note and profile."
    FRAME actions 210x48 [HUG/HUG] · vertical pad 0 gap 0
      INSTANCE Action/Button 210x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
        TEXT label 162x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "View my applications"
```

The confirmation. It names who will see the application and offers the one next step.

### `4.3s` — My applications · after the first application

**Reached from** `4.2s`  ·  **Leads to** **Withdraw** on each pending row → `4.4s`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    TEXT screenTitle 184x32 [HUG/HUG] · fill color/text/primary · mobile/display · "My applications"
    FRAME app-Pending-S 328x120 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 213x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Shop assistant — weekend"
        INSTANCE Display/Badge 79x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Pending}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 47x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Pending"
      TEXT meta 192x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Closes Sat 29 Aug 2026, 8:00 AM"
      INSTANCE Action/Link 73x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 73x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Withdraw"
    TEXT orderNote 328x32 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Pending first, soonest closing first. Decided and withdrawn applications show for 30 days."
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Worker} · [standard, see header]
```

**The list after one application.** FR-APPLY-12's three facts for a pending application: the posting,
the state, and the date the posting expires — a one-off gig expires at its start (FR-POST-13), so
"Closes Sat 29 Aug 2026, 8:00 AM". A one-slot posting carries no fill count; multi-slot ones do.
`orderNote` states the order, which is the requirement's: pending first, soonest closing first, resolved
applications after — and how long a resolved one stays: **30 days after it was decided or withdrawn**
(`FR-APPLY-12` as amended 2026-09-24). A pending application never leaves the list.

**Every application list in this module is the same list at a later minute.** Each submission adds a row,
and nothing already on it changes unless something happened to it. Until 2026-09-23 each application had
its own list showing only itself plus a fixed base, so a withdrawal vanished from the next screen.

### `4.4s` — Withdraw dialog · Shop assistant

**Opens over** `4.3s`; reached from the Shop assistant row's Withdraw on every list where it is pending  ·  **Keep it** → back  ·  **Withdraw** → `4.3sw`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    TEXT screenTitle 184x32 [HUG/HUG] · fill color/text/primary · mobile/display · "My applications"
    FRAME app-Pending-S 328x120 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 213x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Shop assistant — weekend"
        INSTANCE Display/Badge 79x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Pending}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 47x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Pending"
      TEXT meta 192x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Closes Sat 29 Aug 2026, 8:00 AM"
      INSTANCE Action/Link 73x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 73x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Withdraw"
    TEXT orderNote 328x32 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Pending first, soonest closing first. Decided and withdrawn applications show for 30 days."
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Worker} · [standard, see header]
  RECTANGLE scrim 360x800 [FIXED/FIXED] @0,0 · fill color/overlay/scrim · opacity 40%
  INSTANCE Feedback/ConfirmDialog 328x180 [FIXED/HUG] @16,310 · vertical pad 20 gap 12 · fill color/bg/default · r12
    TEXT title 259x28 [HUG/HUG] · fill color/text/primary · mobile/title · "Withdraw this application?"
    TEXT body 288x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Saman Stores will no longer see it. You can apply again while the posting stays open."
    FRAME actions 288x48 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Action/Button 101x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 53x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Keep it"
      INSTANCE Action/Button 122x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/state/danger · r8 · {Style=Destructive, State=Default}
        TEXT label 74x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Withdraw"
```

`Feedback/ConfirmDialog` over the list, centred on the frame. The body is FR-APPLY-03 in the employer's
name: they stop seeing it, and Kavindu can apply again while the posting stays open.

### `4.3sw` — My applications · Shop assistant withdrawn (branch)

**Reached from** `4.4s`  ·  **Leads to** nothing — no row is pending

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    TEXT screenTitle 184x32 [HUG/HUG] · fill color/text/primary · mobile/display · "My applications"
    FRAME app-Withdrawn-S 328x94 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x48 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 198x48 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Shop assistant — weekend"
        INSTANCE Display/Badge 94x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Withdrawn}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/text/secondary
          TEXT label 62x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Withdrawn"
      TEXT meta 277x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Withdrawn by you — the employer has been told"
    TEXT orderNote 328x32 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Pending first, soonest closing first. Decided and withdrawn applications show for 30 days."
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Worker} · [standard, see header]
```

**A branch the story does not take** — Kavindu keeps his Shop assistant application. The row reads *Withdrawn by you — the employer has been told*.

### `4.1c` — Apply · Café service crew

**Reached from** [M3](M3-discovery.md) `3.12c` (Apply)  ·  **Leads to** `4.2c`  ·  **Exits** back → [M3](M3-discovery.md) `3.12c`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Apply"
  FRAME content 360x660 [FILL/FILL] · vertical pad 20/16/0/16 gap 12
    TEXT context 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Café service crew — evenings · Green Leaf Café"
    TEXT noteLabel 141x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Note to the employer"
    INSTANCE noteField 328x98 [FILL/HUG] · vertical pad 12 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8 · of Input/TextArea · {State=Filled}
      TEXT value 302x72 [FILL/HUG] · fill color/text/primary · mobile/body · "I've done evening café shifts before — quick on my feet and fine with a late finish."
    TEXT prefillNote 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Optional — the employer sees it with your profile."
    FRAME spacer-grow 8x434 [FIXED/FILL]
  FRAME ctaBar 360x84 [FILL/HUG] · vertical pad 12/16/24/16 gap 8 · fill color/bg/default
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 143x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Submit application"
```

The Café application: two Friday evenings, one-off.

### `4.2c` — Application sent · Café service crew

**Reached from** `4.1c`  ·  **Leads to** `4.3c`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x800 [FILL/FILL] · vertical pad 24 gap 12
    FRAME successGlyph 56x56 [FIXED/FIXED]
      ELLIPSE Ellipse 56x56 [FIXED/FIXED] @0,0 · stroke color/state/success 2.5
      VECTOR Vector 25x18 [FIXED/FIXED] @16,20 · stroke color/state/success 3
    TEXT successTitle 158x28 [HUG/HUG] · fill color/text/primary · mobile/title · "Application sent"
    TEXT line 280x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · align center · "Green Leaf Café will see your note and profile."
    FRAME actions 210x48 [HUG/HUG] · vertical pad 0 gap 0
      INSTANCE Action/Button 210x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
        TEXT label 162x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "View my applications"
```

### `4.3c` — My applications · Shop assistant and Café pending

**Reached from** `4.2c`  ·  **Leads to** **Withdraw** on each pending row → `4.4s`, `4.4c`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    TEXT screenTitle 184x32 [HUG/HUG] · fill color/text/primary · mobile/display · "My applications"
    FRAME app-Pending-S 328x120 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 213x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Shop assistant — weekend"
        INSTANCE Display/Badge 79x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Pending}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 47x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Pending"
      TEXT meta 192x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Closes Sat 29 Aug 2026, 8:00 AM"
      INSTANCE Action/Link 73x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 73x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Withdraw"
    FRAME app-Pending-C 328x144 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x48 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 213x48 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Café service crew — evenings"
        INSTANCE Display/Badge 79x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Pending}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 47x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Pending"
      TEXT meta 253x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Closes Fri 4 Sep 2026, 6:00 PM · 0 of 2 filled"
      INSTANCE Action/Link 73x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 73x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Withdraw"
    TEXT orderNote 328x32 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Pending first, soonest closing first. Decided and withdrawn applications show for 30 days."
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Worker} · [standard, see header]
```

Two pending rows, soonest closing first. Café is a two-slot posting, so its row adds *0 of 2 filled* (FR-APPLY-12, FR-POST-14).

### `4.4c` — Withdraw dialog · Café service crew

**Opens over** `4.3c` (the Café row's Withdraw)  ·  **Keep it** → back  ·  **Withdraw** → `4.3cw`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    TEXT screenTitle 184x32 [HUG/HUG] · fill color/text/primary · mobile/display · "My applications"
    FRAME app-Pending-S 328x120 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 213x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Shop assistant — weekend"
        INSTANCE Display/Badge 79x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Pending}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 47x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Pending"
      TEXT meta 192x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Closes Sat 29 Aug 2026, 8:00 AM"
      INSTANCE Action/Link 73x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 73x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Withdraw"
    FRAME app-Pending-C 328x144 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x48 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 213x48 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Café service crew — evenings"
        INSTANCE Display/Badge 79x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Pending}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 47x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Pending"
      TEXT meta 253x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Closes Fri 4 Sep 2026, 6:00 PM · 0 of 2 filled"
      INSTANCE Action/Link 73x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 73x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Withdraw"
    TEXT orderNote 328x32 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Pending first, soonest closing first. Decided and withdrawn applications show for 30 days."
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Worker} · [standard, see header]
  RECTANGLE scrim 360x800 [FIXED/FIXED] @0,0 · fill color/overlay/scrim · opacity 40%
  INSTANCE Feedback/ConfirmDialog 328x200 [FIXED/HUG] @16,300 · vertical pad 20 gap 12 · fill color/bg/default · r12
    TEXT title 259x28 [HUG/HUG] · fill color/text/primary · mobile/title · "Withdraw this application?"
    TEXT body 288x60 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Green Leaf Café will no longer see it. You can apply again while the posting stays open."
    FRAME actions 288x48 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Action/Button 101x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 53x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Keep it"
      INSTANCE Action/Button 122x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/state/danger · r8 · {Style=Destructive, State=Default}
        TEXT label 74x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Withdraw"
```

The same dialog, naming Green Leaf Café.

### `4.3cw` — My applications · Café withdrawn

**Reached from** `4.4c`  ·  **Leads to** **Withdraw** on each pending row → `4.4s`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    TEXT screenTitle 184x32 [HUG/HUG] · fill color/text/primary · mobile/display · "My applications"
    FRAME app-Pending-S 328x120 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 213x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Shop assistant — weekend"
        INSTANCE Display/Badge 79x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Pending}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 47x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Pending"
      TEXT meta 192x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Closes Sat 29 Aug 2026, 8:00 AM"
      INSTANCE Action/Link 73x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 73x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Withdraw"
    FRAME app-Withdrawn-C 328x94 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x48 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 198x48 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Café service crew — evenings"
        INSTANCE Display/Badge 94x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Withdrawn}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/text/secondary
          TEXT label 62x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Withdrawn"
      TEXT meta 277x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Withdrawn by you — the employer has been told"
    TEXT orderNote 328x32 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Pending first, soonest closing first. Decided and withdrawn applications show for 30 days."
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Worker} · [standard, see header]
```

**The withdrawal the story takes.** Café stays on the list as Withdrawn — FR-APPLY-12 lists every
application with its state, withdrawn ones included — below the pending row. This is the FR-APPLY-03
demonstration; every other withdrawal in the module is a branch.

### `4.1h` — Apply · House cleaning

**Reached from** [M3](M3-discovery.md) `3.12h` (Apply)  ·  **Leads to** `4.2h`  ·  **Exits** back → [M3](M3-discovery.md) `3.12h`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Apply"
  FRAME content 360x660 [FILL/FILL] · vertical pad 20/16/0/16 gap 12
    TEXT context 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "House cleaning — Saturday · A. Wijeratne"
    TEXT noteLabel 141x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Note to the employer"
    INSTANCE noteField 328x98 [FILL/HUG] · vertical pad 12 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8 · of Input/TextArea · {State=Filled}
      TEXT value 302x72 [FILL/HUG] · fill color/text/primary · mobile/body · "I've cleaned for two households in Nugegoda — thorough and I bring references."
    TEXT prefillNote 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Optional — the employer sees it with your profile."
    FRAME spacer-grow 8x434 [FIXED/FILL]
  FRAME ctaBar 360x84 [FILL/HUG] · vertical pad 12/16/24/16 gap 8 · fill color/bg/default
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 143x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Submit application"
```

House cleaning, Sat 5 Sep.

### `4.2h` — Application sent · House cleaning

**Reached from** `4.1h`  ·  **Leads to** `4.3h`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x800 [FILL/FILL] · vertical pad 24 gap 12
    FRAME successGlyph 56x56 [FIXED/FIXED]
      ELLIPSE Ellipse 56x56 [FIXED/FIXED] @0,0 · stroke color/state/success 2.5
      VECTOR Vector 25x18 [FIXED/FIXED] @16,20 · stroke color/state/success 3
    TEXT successTitle 158x28 [HUG/HUG] · fill color/text/primary · mobile/title · "Application sent"
    TEXT line 280x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · align center · "A. Wijeratne will see your note and profile."
    FRAME actions 210x48 [HUG/HUG] · vertical pad 0 gap 0
      INSTANCE Action/Button 210x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
        TEXT label 162x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "View my applications"
```

### `4.3h` — My applications · after House cleaning

**Reached from** `4.2h`  ·  **Leads to** **Withdraw** on each pending row → `4.4s`, `4.4h`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    TEXT screenTitle 184x32 [HUG/HUG] · fill color/text/primary · mobile/display · "My applications"
    FRAME app-Pending-S 328x120 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 213x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Shop assistant — weekend"
        INSTANCE Display/Badge 79x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Pending}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 47x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Pending"
      TEXT meta 192x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Closes Sat 29 Aug 2026, 8:00 AM"
      INSTANCE Action/Link 73x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 73x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Withdraw"
    FRAME app-Pending-H 328x120 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 213x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "House cleaning — Saturday"
        INSTANCE Display/Badge 79x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Pending}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 47x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Pending"
      TEXT meta 184x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Closes Sat 5 Sep 2026, 8:00 AM"
      INSTANCE Action/Link 73x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 73x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Withdraw"
    FRAME app-Withdrawn-C 328x94 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x48 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 198x48 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Café service crew — evenings"
        INSTANCE Display/Badge 94x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Withdrawn}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/text/secondary
          TEXT label 62x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Withdrawn"
      TEXT meta 277x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Withdrawn by you — the employer has been told"
    TEXT orderNote 328x32 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Pending first, soonest closing first. Decided and withdrawn applications show for 30 days."
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Worker} · [standard, see header]
```

Three rows: two pending by closing date, then the withdrawn Café.

### `4.4h` — Withdraw dialog · House cleaning

**Opens over** `4.3h`; reached from the House cleaning row's Withdraw on every list where it is pending  ·  **Keep it** → back  ·  **Withdraw** → `4.3hw`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    TEXT screenTitle 184x32 [HUG/HUG] · fill color/text/primary · mobile/display · "My applications"
    FRAME app-Pending-S 328x120 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 213x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Shop assistant — weekend"
        INSTANCE Display/Badge 79x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Pending}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 47x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Pending"
      TEXT meta 192x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Closes Sat 29 Aug 2026, 8:00 AM"
      INSTANCE Action/Link 73x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 73x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Withdraw"
    FRAME app-Pending-H 328x120 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 213x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "House cleaning — Saturday"
        INSTANCE Display/Badge 79x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Pending}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 47x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Pending"
      TEXT meta 184x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Closes Sat 5 Sep 2026, 8:00 AM"
      INSTANCE Action/Link 73x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 73x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Withdraw"
    FRAME app-Withdrawn-C 328x94 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x48 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 198x48 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Café service crew — evenings"
        INSTANCE Display/Badge 94x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Withdrawn}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/text/secondary
          TEXT label 62x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Withdrawn"
      TEXT meta 277x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Withdrawn by you — the employer has been told"
    TEXT orderNote 328x32 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Pending first, soonest closing first. Decided and withdrawn applications show for 30 days."
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Worker} · [standard, see header]
  RECTANGLE scrim 360x800 [FIXED/FIXED] @0,0 · fill color/overlay/scrim · opacity 40%
  INSTANCE Feedback/ConfirmDialog 328x180 [FIXED/HUG] @16,310 · vertical pad 20 gap 12 · fill color/bg/default · r12
    TEXT title 259x28 [HUG/HUG] · fill color/text/primary · mobile/title · "Withdraw this application?"
    TEXT body 288x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "A. Wijeratne will no longer see it. You can apply again while the posting stays open."
    FRAME actions 288x48 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Action/Button 101x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 53x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Keep it"
      INSTANCE Action/Button 122x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/state/danger · r8 · {Style=Destructive, State=Default}
        TEXT label 74x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Withdraw"
```

The same dialog, naming A. Wijeratne. It is 20 px shorter than the others because the name is short enough for the body to take two lines, and it re-centres (`@16,310`).

### `4.3hw` — My applications · House cleaning withdrawn (branch)

**Reached from** `4.4h`  ·  **Leads to** **Withdraw** on each pending row → `4.4s`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    TEXT screenTitle 184x32 [HUG/HUG] · fill color/text/primary · mobile/display · "My applications"
    FRAME app-Pending-S 328x120 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 213x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Shop assistant — weekend"
        INSTANCE Display/Badge 79x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Pending}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 47x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Pending"
      TEXT meta 192x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Closes Sat 29 Aug 2026, 8:00 AM"
      INSTANCE Action/Link 73x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 73x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Withdraw"
    FRAME app-Withdrawn-H 328x94 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x48 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 198x48 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "House cleaning — Saturday"
        INSTANCE Display/Badge 94x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Withdrawn}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/text/secondary
          TEXT label 62x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Withdrawn"
      TEXT meta 277x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Withdrawn by you — the employer has been told"
    FRAME app-Withdrawn-C 328x94 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x48 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 198x48 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Café service crew — evenings"
        INSTANCE Display/Badge 94x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Withdrawn}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/text/secondary
          TEXT label 62x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Withdrawn"
      TEXT meta 277x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Withdrawn by you — the employer has been told"
    TEXT orderNote 328x32 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Pending first, soonest closing first. Decided and withdrawn applications show for 30 days."
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Worker} · [standard, see header]
```

A branch: House cleaning withdrawn, below the pending Shop assistant.

### `4.1` — Apply · Event setup crew

**Reached from** [M3](M3-discovery.md) `3.12` (Apply)  ·  **Leads to** `4.2` ("Submit application") — or, offline, `4.1bnr`  ·  **Exits** back → [M3](M3-discovery.md) `3.12`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Apply"
  FRAME content 360x660 [FILL/FILL] · vertical pad 20/16/0/16 gap 12
    TEXT context 328x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Event setup crew (3 needed) · Lanka Events (Pvt) Ltd"
    TEXT noteLabel 141x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Note to the employer"
    INSTANCE noteField 328x96 [FILL/HUG] · vertical pad 12 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8 · of Input/TextArea · {State=Filled}
      TEXT value 302x48 [FILL/HUG] · fill color/text/primary · mobile/body · "Available all weekend — I've done two event setups."
    TEXT prefillNote 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Optional — the employer sees it with your profile."
    FRAME spacer-grow 8x416 [FIXED/FILL]
  FRAME ctaBar 360x84 [FILL/HUG] · vertical pad 12/16/24/16 gap 8 · fill color/bg/default
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 143x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Submit application"
```

**8:15 AM.** Kavindu found the Event setup crew through search (M3 `3.7`). Lanka Events sees this
application arrive as the second of three (M3 `3.10ea`).

### `4.2` — Application sent · Event setup crew

**Reached from** `4.1`, `4.1rst`  ·  **Leads to** `4.3`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x800 [FILL/FILL] · vertical pad 24 gap 12
    FRAME successGlyph 56x56 [FIXED/FIXED]
      ELLIPSE Ellipse 56x56 [FIXED/FIXED] @0,0 · stroke color/state/success 2.5
      VECTOR Vector 25x18 [FIXED/FIXED] @16,20 · stroke color/state/success 3
    TEXT successTitle 158x28 [HUG/HUG] · fill color/text/primary · mobile/title · "Application sent"
    TEXT line 280x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · align center · "Lanka Events (Pvt) Ltd will see your note and profile."
    FRAME actions 210x48 [HUG/HUG] · vertical pad 0 gap 0
      INSTANCE Action/Button 210x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
        TEXT label 162x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "View my applications"
```

The confirmation, naming Lanka Events (Pvt) Ltd.

### `4.3` — My applications · after the Event setup crew (8:15 AM)

**Reached from** `4.2`, and the Applications tab on Thursday-morning screens  ·  **Leads to** **Withdraw** on each pending row → `4.4`, `4.4s`, `4.4h`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    TEXT screenTitle 184x32 [HUG/HUG] · fill color/text/primary · mobile/display · "My applications"
    FRAME app-Pending-E 328x144 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x48 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 213x48 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Event setup crew (3 needed)"
        INSTANCE Display/Badge 79x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Pending}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 47x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Pending"
      TEXT meta 266x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Closes Sat 29 Aug 2026, 5:00 AM · 0 of 3 filled"
      INSTANCE Action/Link 73x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 73x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Withdraw"
    FRAME app-Pending-S 328x120 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 213x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Shop assistant — weekend"
        INSTANCE Display/Badge 79x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Pending}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 47x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Pending"
      TEXT meta 192x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Closes Sat 29 Aug 2026, 8:00 AM"
      INSTANCE Action/Link 73x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 73x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Withdraw"
    FRAME app-Pending-H 328x120 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 213x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "House cleaning — Saturday"
        INSTANCE Display/Badge 79x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Pending}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 47x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Pending"
      TEXT meta 184x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Closes Sat 5 Sep 2026, 8:00 AM"
      INSTANCE Action/Link 73x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 73x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Withdraw"
    FRAME app-Withdrawn-C 328x94 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x48 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 198x48 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Café service crew — evenings"
        INSTANCE Display/Badge 94x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Withdrawn}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/text/secondary
          TEXT label 62x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Withdrawn"
      TEXT meta 277x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Withdrawn by you — the employer has been told"
    TEXT orderNote 328x32 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Pending first, soonest closing first. Decided and withdrawn applications show for 30 days."
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Worker} · [standard, see header]
```

**The morning list, complete.** Event setup leads: it closes soonest (Sat 29 Aug 2026, 5:00 AM) and, as
a three-slot posting, carries *0 of 3 filled* — nobody had been selected at 8:15. Then Shop assistant, House
cleaning, and the withdrawn Café. It is also the list the Applications tab opens on Thursday morning.

### `4.4` — Withdraw dialog · Event setup crew

**Opens over** `4.3`; reached from the Event setup row's Withdraw on every list where it is pending  ·  **Keep it** → back  ·  **Withdraw** → `4.3w`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    TEXT screenTitle 184x32 [HUG/HUG] · fill color/text/primary · mobile/display · "My applications"
    FRAME app-Pending-E 328x144 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x48 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 213x48 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Event setup crew (3 needed)"
        INSTANCE Display/Badge 79x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Pending}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 47x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Pending"
      TEXT meta 266x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Closes Sat 29 Aug 2026, 5:00 AM · 0 of 3 filled"
      INSTANCE Action/Link 73x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 73x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Withdraw"
    FRAME app-Pending-S 328x120 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 213x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Shop assistant — weekend"
        INSTANCE Display/Badge 79x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Pending}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 47x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Pending"
      TEXT meta 192x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Closes Sat 29 Aug 2026, 8:00 AM"
      INSTANCE Action/Link 73x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 73x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Withdraw"
    FRAME app-Pending-H 328x120 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 213x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "House cleaning — Saturday"
        INSTANCE Display/Badge 79x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Pending}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 47x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Pending"
      TEXT meta 184x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Closes Sat 5 Sep 2026, 8:00 AM"
      INSTANCE Action/Link 73x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 73x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Withdraw"
    FRAME app-Withdrawn-C 328x94 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x48 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 198x48 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Café service crew — evenings"
        INSTANCE Display/Badge 94x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Withdrawn}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/text/secondary
          TEXT label 62x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Withdrawn"
      TEXT meta 277x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Withdrawn by you — the employer has been told"
    TEXT orderNote 328x32 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Pending first, soonest closing first. Decided and withdrawn applications show for 30 days."
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Worker} · [standard, see header]
  RECTANGLE scrim 360x800 [FIXED/FIXED] @0,0 · fill color/overlay/scrim · opacity 40%
  INSTANCE Feedback/ConfirmDialog 328x200 [FIXED/HUG] @16,300 · vertical pad 20 gap 12 · fill color/bg/default · r12
    TEXT title 259x28 [HUG/HUG] · fill color/text/primary · mobile/title · "Withdraw this application?"
    TEXT body 288x60 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Lanka Events (Pvt) Ltd will no longer see it. You can apply again while the posting stays open."
    FRAME actions 288x48 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Action/Button 101x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 53x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Keep it"
      INSTANCE Action/Button 122x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/state/danger · r8 · {Style=Destructive, State=Default}
        TEXT label 74x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Withdraw"
```

The same dialog, naming Lanka Events (Pvt) Ltd.

### `4.3w` — My applications · Event setup withdrawn (branch)

**Reached from** `4.4`  ·  **Leads to** **Withdraw** on each pending row → `4.4s`, `4.4h`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    TEXT screenTitle 184x32 [HUG/HUG] · fill color/text/primary · mobile/display · "My applications"
    FRAME app-Pending-S 328x120 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 213x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Shop assistant — weekend"
        INSTANCE Display/Badge 79x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Pending}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 47x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Pending"
      TEXT meta 192x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Closes Sat 29 Aug 2026, 8:00 AM"
      INSTANCE Action/Link 73x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 73x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Withdraw"
    FRAME app-Pending-H 328x120 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 213x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "House cleaning — Saturday"
        INSTANCE Display/Badge 79x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Pending}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 47x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Pending"
      TEXT meta 184x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Closes Sat 5 Sep 2026, 8:00 AM"
      INSTANCE Action/Link 73x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 73x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Withdraw"
    FRAME app-Withdrawn-E 328x94 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x48 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 198x48 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Event setup crew (3 needed)"
        INSTANCE Display/Badge 94x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Withdrawn}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/text/secondary
          TEXT label 62x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Withdrawn"
      TEXT meta 277x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Withdrawn by you — the employer has been told"
    FRAME app-Withdrawn-C 328x94 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x48 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 198x48 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Café service crew — evenings"
        INSTANCE Display/Badge 94x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Withdrawn}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/text/secondary
          TEXT label 62x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Withdrawn"
      TEXT meta 277x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Withdrawn by you — the employer has been told"
    TEXT orderNote 328x32 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Pending first, soonest closing first. Decided and withdrawn applications show for 30 days."
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Worker} · [standard, see header]
```

A branch: the Event setup application withdrawn. It sits below the two pending rows and above Café, the older withdrawal.

### `4.1bnr` — Apply · offline, not sent

**Reached from** `4.1` ("Submit application" with no connection)  ·  **Leads to** `4.1rst` once the connection is back  ·  **Exits** back → history

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Apply"
  FRAME content 360x660 [FILL/FILL] · vertical pad 20/16/0/16 gap 12
    INSTANCE formBanner 328x80 [FILL/HUG] · horizontal pad 10/12/10/12 gap 0 · stroke color/border/error 1 · r8 · of Feedback/FormBanner · {Kind=Error}
      TEXT message 296x60 [FIXED/HUG] · fill color/state/danger · mobile/secondary · "You're offline, so your application couldn't be sent. Your note is still here — try again once you reconnect."
    TEXT context 328x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Event setup crew (3 needed) · Lanka Events (Pvt) Ltd"
    TEXT noteLabel 141x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Note to the employer"
    INSTANCE noteField 328x96 [FILL/HUG] · vertical pad 12 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8 · of Input/TextArea · {State=Filled}
      TEXT value 302x48 [FILL/HUG] · fill color/text/primary · mobile/body · "Available all weekend — I've done two event setups."
    TEXT prefillNote 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Optional — the employer sees it with your profile."
    FRAME spacer-grow 8x324 [FIXED/FILL]
  FRAME ctaBar 360x84 [FILL/HUG] · vertical pad 12/16/24/16 gap 8 · fill color/bg/default
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 143x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Submit application"
```

Offline at the moment of submitting. `Feedback/FormBanner {Kind=Error}` says nothing was sent and the
note is still here (NFR-USE-01: applying needs a connection, browsing does not). Undated, like every failure
state.

### `4.1rst` — Apply · the note kept while offline

**Reached from** `4.1bnr`  ·  **Leads to** `4.2` ("Submit application")  ·  **Exits** back → history

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Apply"
  FRAME content 360x660 [FILL/FILL] · vertical pad 20/16/0/16 gap 12
    TEXT restoredNote 328x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "Your note was kept while you were offline."
    TEXT context 328x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Event setup crew (3 needed) · Lanka Events (Pvt) Ltd"
    TEXT noteLabel 141x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Note to the employer"
    INSTANCE noteField 328x96 [FILL/HUG] · vertical pad 12 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8 · of Input/TextArea · {State=Filled}
      TEXT value 302x48 [FILL/HUG] · fill color/text/primary · mobile/body · "Available all weekend — I've done two event setups."
    TEXT prefillNote 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Optional — the employer sees it with your profile."
    FRAME spacer-grow 8x388 [FIXED/FILL]
  FRAME ctaBar 360x84 [FILL/HUG] · vertical pad 12/16/24/16 gap 8 · fill color/bg/default
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 143x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Submit application"
```

Back online, the form as it was left — `restoredNote` says the note was kept. Submit goes through to `4.2`.

### `4.3e` — My applications · the Event setup crew changed (8 PM)

**Reached from** [M3](M3-discovery.md) `3.10x`, `3.10pd` (the "Event setup crew (3 needed) changed" row), `4.3ldg` (after 1.5 s) †  ·  **Leads to** **Withdraw** on each pending row → `4.4`, `4.4s`, `4.4h`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    TEXT screenTitle 184x32 [HUG/HUG] · fill color/text/primary · mobile/display · "My applications"
    FRAME app-Pending-E 328x144 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x48 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 213x48 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Event setup crew (3 needed)"
        INSTANCE Display/Badge 79x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Pending}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 47x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Pending"
      TEXT meta 263x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Closes Sat 29 Aug 2026, 7:00 AM · 1 of 3 filled"
      INSTANCE Action/Link 73x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 73x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Withdraw"
    FRAME app-Pending-S 328x120 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 213x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Shop assistant — weekend"
        INSTANCE Display/Badge 79x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Pending}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 47x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Pending"
      TEXT meta 192x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Closes Sat 29 Aug 2026, 8:00 AM"
      INSTANCE Action/Link 73x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 73x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Withdraw"
    FRAME app-Pending-H 328x120 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 213x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "House cleaning — Saturday"
        INSTANCE Display/Badge 79x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Pending}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 47x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Pending"
      TEXT meta 184x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Closes Sat 5 Sep 2026, 8:00 AM"
      INSTANCE Action/Link 73x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 73x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Withdraw"
    FRAME app-Withdrawn-C 328x94 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x48 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 198x48 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Café service crew — evenings"
        INSTANCE Display/Badge 94x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Withdrawn}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/text/secondary
          TEXT label 62x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Withdrawn"
      TEXT meta 277x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Withdrawn by you — the employer has been told"
    TEXT orderNote 328x32 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Pending first, soonest closing first. Decided and withdrawn applications show for 30 days."
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Worker} · [standard, see header]
```

**Thursday, 8 PM.** At about 7 PM Lanka Events moved the Event setup start from 5:00 to 7:00 AM (M2
`2.11e2`). Kavindu's application is still pending, so he is told — the *"Event setup crew (3 needed)
changed"* row in his history (M3 `3.10x`), which opens this list. The row now reads *Closes Sat 29 Aug 2026,
7:00 AM · 1 of 3 filled*: the closing time followed the start, and Nethmi's selection that morning filled
one place.

The notification is FR-APPLY-10's, which had no type until 2026-09-23: it is **`APPLICATION_TERMS_CHANGED`**,
distinct from `MATERIAL_CHANGE` — a pending applicant is informed and may withdraw, whereas an engaged worker
is asked to re-confirm (FR-ENG-09).

### `4.1t` — Apply · Grade 8 maths tutoring

**Reached from** [M3](M3-discovery.md) `3.12t` (Apply)  ·  **Leads to** `4.2t`  ·  **Exits** back → [M3](M3-discovery.md) `3.12t`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Apply"
  FRAME content 360x660 [FILL/FILL] · vertical pad 20/16/0/16 gap 12
    TEXT context 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Grade 8 maths tutoring · Dilrukshi Herath"
    TEXT noteLabel 141x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Note to the employer"
    INSTANCE noteField 328x98 [FILL/HUG] · vertical pad 12 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8 · of Input/TextArea · {State=Filled}
      TEXT value 302x72 [FILL/HUG] · fill color/text/primary · mobile/body · "I got an A in O/L maths and tutor my cousins — patient and clear with explanations."
    TEXT prefillNote 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Optional — the employer sees it with your profile."
    FRAME spacer-grow 8x434 [FIXED/FILL]
  FRAME ctaBar 360x84 [FILL/HUG] · vertical pad 12/16/24/16 gap 8 · fill color/bg/default
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 143x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Submit application"
```

The tutoring application, from the evening's history (M3 `3.12t`). Dilrukshi posted it at about 6 PM.

### `4.2t` — Application sent · tutoring

**Reached from** `4.1t`  ·  **Leads to** `4.3t`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x800 [FILL/FILL] · vertical pad 24 gap 12
    FRAME successGlyph 56x56 [FIXED/FIXED]
      ELLIPSE Ellipse 56x56 [FIXED/FIXED] @0,0 · stroke color/state/success 2.5
      VECTOR Vector 25x18 [FIXED/FIXED] @16,20 · stroke color/state/success 3
    TEXT successTitle 158x28 [HUG/HUG] · fill color/text/primary · mobile/title · "Application sent"
    TEXT line 280x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · align center · "Dilrukshi Herath will see your note and profile."
    FRAME actions 210x48 [HUG/HUG] · vertical pad 0 gap 0
      INSTANCE Action/Button 210x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
        TEXT label 162x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "View my applications"
```

### `4.3t` — My applications · after tutoring

**Reached from** `4.2t`  ·  **Leads to** **Withdraw** on each pending row → `4.4`, `4.4s`, `4.4h`, `4.4t`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    TEXT screenTitle 184x32 [HUG/HUG] · fill color/text/primary · mobile/display · "My applications"
    FRAME app-Pending-E 328x144 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x48 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 213x48 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Event setup crew (3 needed)"
        INSTANCE Display/Badge 79x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Pending}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 47x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Pending"
      TEXT meta 263x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Closes Sat 29 Aug 2026, 7:00 AM · 1 of 3 filled"
      INSTANCE Action/Link 73x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 73x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Withdraw"
    FRAME app-Pending-S 328x120 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 213x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Shop assistant — weekend"
        INSTANCE Display/Badge 79x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Pending}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 47x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Pending"
      TEXT meta 192x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Closes Sat 29 Aug 2026, 8:00 AM"
      INSTANCE Action/Link 73x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 73x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Withdraw"
    FRAME app-Pending-H 328x120 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 213x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "House cleaning — Saturday"
        INSTANCE Display/Badge 79x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Pending}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 47x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Pending"
      TEXT meta 184x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Closes Sat 5 Sep 2026, 8:00 AM"
      INSTANCE Action/Link 73x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 73x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Withdraw"
    FRAME app-Pending-T 328x120 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 213x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Grade 8 maths tutoring"
        INSTANCE Display/Badge 79x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Pending}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 47x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Pending"
      TEXT meta 137x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Closes Sat 26 Sep 2026"
      INSTANCE Action/Link 73x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 73x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Withdraw"
    FRAME app-Withdrawn-C 328x94 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x48 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 198x48 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Café service crew — evenings"
        INSTANCE Display/Badge 94x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Withdrawn}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/text/secondary
          TEXT label 62x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Withdrawn"
      TEXT meta 277x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Withdrawn by you — the employer has been told"
    TEXT orderNote 328x32 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Pending first, soonest closing first. Decided and withdrawn applications show for 30 days."
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Worker} · [standard, see header]
```

Five rows. Tutoring is a part-time job, so it expires 30 days after posting, not at a start:
*Closes Sat 26 Sep 2026*, with no time and no fill count (one place).

### `4.4t` — Withdraw dialog · tutoring

**Opens over** `4.3t`; reached from the tutoring row's Withdraw on every list where it is pending  ·  **Keep it** → back  ·  **Withdraw** → `4.3tw`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    TEXT screenTitle 184x32 [HUG/HUG] · fill color/text/primary · mobile/display · "My applications"
    FRAME app-Pending-E 328x144 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x48 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 213x48 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Event setup crew (3 needed)"
        INSTANCE Display/Badge 79x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Pending}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 47x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Pending"
      TEXT meta 263x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Closes Sat 29 Aug 2026, 7:00 AM · 1 of 3 filled"
      INSTANCE Action/Link 73x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 73x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Withdraw"
    FRAME app-Pending-S 328x120 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 213x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Shop assistant — weekend"
        INSTANCE Display/Badge 79x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Pending}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 47x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Pending"
      TEXT meta 192x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Closes Sat 29 Aug 2026, 8:00 AM"
      INSTANCE Action/Link 73x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 73x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Withdraw"
    FRAME app-Pending-H 328x120 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 213x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "House cleaning — Saturday"
        INSTANCE Display/Badge 79x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Pending}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 47x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Pending"
      TEXT meta 184x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Closes Sat 5 Sep 2026, 8:00 AM"
      INSTANCE Action/Link 73x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 73x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Withdraw"
    FRAME app-Pending-T 328x120 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 213x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Grade 8 maths tutoring"
        INSTANCE Display/Badge 79x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Pending}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 47x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Pending"
      TEXT meta 137x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Closes Sat 26 Sep 2026"
      INSTANCE Action/Link 73x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 73x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Withdraw"
    FRAME app-Withdrawn-C 328x94 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x48 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 198x48 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Café service crew — evenings"
        INSTANCE Display/Badge 94x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Withdrawn}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/text/secondary
          TEXT label 62x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Withdrawn"
      TEXT meta 277x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Withdrawn by you — the employer has been told"
    TEXT orderNote 328x32 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Pending first, soonest closing first. Decided and withdrawn applications show for 30 days."
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Worker} · [standard, see header]
  RECTANGLE scrim 360x800 [FIXED/FIXED] @0,0 · fill color/overlay/scrim · opacity 40%
  INSTANCE Feedback/ConfirmDialog 328x200 [FIXED/HUG] @16,300 · vertical pad 20 gap 12 · fill color/bg/default · r12
    TEXT title 259x28 [HUG/HUG] · fill color/text/primary · mobile/title · "Withdraw this application?"
    TEXT body 288x60 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Dilrukshi Herath will no longer see it. You can apply again while the posting stays open."
    FRAME actions 288x48 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Action/Button 101x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 53x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Keep it"
      INSTANCE Action/Button 122x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/state/danger · r8 · {Style=Destructive, State=Default}
        TEXT label 74x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Withdraw"
```

The same dialog, naming Dilrukshi Herath.

### `4.3tw` — My applications · tutoring withdrawn (branch)

**Reached from** `4.4t`  ·  **Leads to** **Withdraw** on each pending row → `4.4`, `4.4s`, `4.4h`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    TEXT screenTitle 184x32 [HUG/HUG] · fill color/text/primary · mobile/display · "My applications"
    FRAME app-Pending-E 328x144 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x48 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 213x48 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Event setup crew (3 needed)"
        INSTANCE Display/Badge 79x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Pending}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 47x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Pending"
      TEXT meta 263x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Closes Sat 29 Aug 2026, 7:00 AM · 1 of 3 filled"
      INSTANCE Action/Link 73x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 73x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Withdraw"
    FRAME app-Pending-S 328x120 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 213x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Shop assistant — weekend"
        INSTANCE Display/Badge 79x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Pending}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 47x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Pending"
      TEXT meta 192x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Closes Sat 29 Aug 2026, 8:00 AM"
      INSTANCE Action/Link 73x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 73x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Withdraw"
    FRAME app-Pending-H 328x120 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 213x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "House cleaning — Saturday"
        INSTANCE Display/Badge 79x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Pending}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 47x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Pending"
      TEXT meta 184x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Closes Sat 5 Sep 2026, 8:00 AM"
      INSTANCE Action/Link 73x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 73x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Withdraw"
    FRAME app-Withdrawn-T 328x70 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 198x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Grade 8 maths tutoring"
        INSTANCE Display/Badge 94x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Withdrawn}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/text/secondary
          TEXT label 62x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Withdrawn"
      TEXT meta 277x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Withdrawn by you — the employer has been told"
    FRAME app-Withdrawn-C 328x94 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x48 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 198x48 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Café service crew — evenings"
        INSTANCE Display/Badge 94x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Withdrawn}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/text/secondary
          TEXT label 62x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Withdrawn"
      TEXT meta 277x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Withdrawn by you — the employer has been told"
    TEXT orderNote 328x32 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Pending first, soonest closing first. Decided and withdrawn applications show for 30 days."
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Worker} · [standard, see header]
```

A branch — the main story's tutoring application becomes an engagement (M5), so it is never withdrawn.

### `4.1d` — Apply · Delivery rider

**Reached from** [M3](M3-discovery.md) `3.12d` (Apply)  ·  **Leads to** `4.2d`  ·  **Exits** back → [M3](M3-discovery.md) `3.12d`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Apply"
  FRAME content 360x660 [FILL/FILL] · vertical pad 20/16/0/16 gap 12
    TEXT context 328x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Delivery rider — mornings · FreshCart Maharagama"
    TEXT noteLabel 141x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Note to the employer"
    INSTANCE noteField 328x96 [FILL/HUG] · vertical pad 12 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8 · of Input/TextArea · {State=Filled}
      TEXT value 302x48 [FILL/HUG] · fill color/text/primary · mobile/body · "Licensed rider with my own helmet — I know Maharagama's lanes well."
    TEXT prefillNote 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Optional — the employer sees it with your profile."
    FRAME spacer-grow 8x416 [FIXED/FILL]
  FRAME ctaBar 360x84 [FILL/HUG] · vertical pad 12/16/24/16 gap 8 · fill color/bg/default
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 143x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Submit application"
```

Delivery rider, from Browse: it was posted before Kavindu registered, so no notification brought it.

### `4.2d` — Application sent · Delivery rider

**Reached from** `4.1d`  ·  **Leads to** `4.3d`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x800 [FILL/FILL] · vertical pad 24 gap 12
    FRAME successGlyph 56x56 [FIXED/FIXED]
      ELLIPSE Ellipse 56x56 [FIXED/FIXED] @0,0 · stroke color/state/success 2.5
      VECTOR Vector 25x18 [FIXED/FIXED] @16,20 · stroke color/state/success 3
    TEXT successTitle 158x28 [HUG/HUG] · fill color/text/primary · mobile/title · "Application sent"
    TEXT line 280x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · align center · "FreshCart Maharagama will see your note and profile."
    FRAME actions 210x48 [HUG/HUG] · vertical pad 0 gap 0
      INSTANCE Action/Button 210x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
        TEXT label 162x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "View my applications"
```

### `4.3d` — My applications · after Delivery rider

**Reached from** `4.2d`  ·  **Leads to** **Withdraw** on each pending row → `4.4`, `4.4s`, `4.4h`, `4.4d`, `4.4t`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    TEXT screenTitle 184x32 [HUG/HUG] · fill color/text/primary · mobile/display · "My applications"
    FRAME app-Pending-E 328x144 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x48 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 213x48 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Event setup crew (3 needed)"
        INSTANCE Display/Badge 79x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Pending}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 47x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Pending"
      TEXT meta 263x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Closes Sat 29 Aug 2026, 7:00 AM · 1 of 3 filled"
      INSTANCE Action/Link 73x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 73x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Withdraw"
    FRAME app-Pending-S 328x120 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 213x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Shop assistant — weekend"
        INSTANCE Display/Badge 79x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Pending}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 47x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Pending"
      TEXT meta 192x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Closes Sat 29 Aug 2026, 8:00 AM"
      INSTANCE Action/Link 73x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 73x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Withdraw"
    FRAME app-Pending-H 328x120 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 213x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "House cleaning — Saturday"
        INSTANCE Display/Badge 79x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Pending}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 47x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Pending"
      TEXT meta 184x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Closes Sat 5 Sep 2026, 8:00 AM"
      INSTANCE Action/Link 73x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 73x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Withdraw"
    FRAME app-Pending-D 328x120 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 213x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Delivery rider — mornings"
        INSTANCE Display/Badge 79x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Pending}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 47x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Pending"
      TEXT meta 214x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Closes Thu 24 Sep 2026 · 0 of 2 filled"
      INSTANCE Action/Link 73x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 73x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Withdraw"
    FRAME app-Pending-T 328x120 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 213x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Grade 8 maths tutoring"
        INSTANCE Display/Badge 79x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Pending}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 47x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Pending"
      TEXT meta 137x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Closes Sat 26 Sep 2026"
      INSTANCE Action/Link 73x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 73x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Withdraw"
    FRAME app-Withdrawn-C 328x94 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x48 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 198x48 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Café service crew — evenings"
        INSTANCE Display/Badge 94x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Withdrawn}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/text/secondary
          TEXT label 62x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Withdrawn"
      TEXT meta 277x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Withdrawn by you — the employer has been told"
    TEXT orderNote 328x32 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Pending first, soonest closing first. Decided and withdrawn applications show for 30 days."
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Worker} · [standard, see header]
```

Six rows. Delivery rider is part-time with two places, posted on Tue 25 Aug, so it closes on Thu 24
Sep 2026 and shows *0 of 2 filled*. It sits between House cleaning (5 Sep) and tutoring (26 Sep) — order by
closing date, not by when he applied.

### `4.4d` — Withdraw dialog · Delivery rider

**Opens over** `4.3d`; reached from the Delivery rider row's Withdraw on `4.3d`, `4.3o`, `4.3ow`  ·  **Keep it** → back  ·  **Withdraw** → `4.3dw`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    TEXT screenTitle 184x32 [HUG/HUG] · fill color/text/primary · mobile/display · "My applications"
    FRAME app-Pending-E 328x144 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x48 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 213x48 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Event setup crew (3 needed)"
        INSTANCE Display/Badge 79x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Pending}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 47x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Pending"
      TEXT meta 263x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Closes Sat 29 Aug 2026, 7:00 AM · 1 of 3 filled"
      INSTANCE Action/Link 73x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 73x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Withdraw"
    FRAME app-Pending-S 328x120 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 213x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Shop assistant — weekend"
        INSTANCE Display/Badge 79x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Pending}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 47x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Pending"
      TEXT meta 192x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Closes Sat 29 Aug 2026, 8:00 AM"
      INSTANCE Action/Link 73x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 73x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Withdraw"
    FRAME app-Pending-H 328x120 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 213x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "House cleaning — Saturday"
        INSTANCE Display/Badge 79x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Pending}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 47x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Pending"
      TEXT meta 184x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Closes Sat 5 Sep 2026, 8:00 AM"
      INSTANCE Action/Link 73x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 73x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Withdraw"
    FRAME app-Pending-D 328x120 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 213x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Delivery rider — mornings"
        INSTANCE Display/Badge 79x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Pending}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 47x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Pending"
      TEXT meta 214x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Closes Thu 24 Sep 2026 · 0 of 2 filled"
      INSTANCE Action/Link 73x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 73x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Withdraw"
    FRAME app-Pending-T 328x120 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 213x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Grade 8 maths tutoring"
        INSTANCE Display/Badge 79x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Pending}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 47x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Pending"
      TEXT meta 137x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Closes Sat 26 Sep 2026"
      INSTANCE Action/Link 73x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 73x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Withdraw"
    FRAME app-Withdrawn-C 328x94 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x48 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 198x48 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Café service crew — evenings"
        INSTANCE Display/Badge 94x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Withdrawn}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/text/secondary
          TEXT label 62x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Withdrawn"
      TEXT meta 277x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Withdrawn by you — the employer has been told"
    TEXT orderNote 328x32 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Pending first, soonest closing first. Decided and withdrawn applications show for 30 days."
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Worker} · [standard, see header]
  RECTANGLE scrim 360x800 [FIXED/FIXED] @0,0 · fill color/overlay/scrim · opacity 40%
  INSTANCE Feedback/ConfirmDialog 328x200 [FIXED/HUG] @16,300 · vertical pad 20 gap 12 · fill color/bg/default · r12
    TEXT title 259x28 [HUG/HUG] · fill color/text/primary · mobile/title · "Withdraw this application?"
    TEXT body 288x60 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "FreshCart Maharagama will no longer see it. You can apply again while the posting stays open."
    FRAME actions 288x48 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Action/Button 101x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 53x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Keep it"
      INSTANCE Action/Button 122x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/state/danger · r8 · {Style=Destructive, State=Default}
        TEXT label 74x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Withdraw"
```

The same dialog, naming FreshCart Maharagama.

### `4.3dw` — My applications · Delivery rider withdrawn (branch)

**Reached from** `4.4d`  ·  **Leads to** **Withdraw** on each pending row → `4.4`, `4.4s`, `4.4h`, `4.4t`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    TEXT screenTitle 184x32 [HUG/HUG] · fill color/text/primary · mobile/display · "My applications"
    FRAME app-Pending-E 328x144 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x48 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 213x48 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Event setup crew (3 needed)"
        INSTANCE Display/Badge 79x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Pending}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 47x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Pending"
      TEXT meta 263x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Closes Sat 29 Aug 2026, 7:00 AM · 1 of 3 filled"
      INSTANCE Action/Link 73x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 73x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Withdraw"
    FRAME app-Pending-S 328x120 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 213x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Shop assistant — weekend"
        INSTANCE Display/Badge 79x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Pending}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 47x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Pending"
      TEXT meta 192x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Closes Sat 29 Aug 2026, 8:00 AM"
      INSTANCE Action/Link 73x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 73x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Withdraw"
    FRAME app-Pending-H 328x120 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 213x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "House cleaning — Saturday"
        INSTANCE Display/Badge 79x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Pending}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 47x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Pending"
      TEXT meta 184x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Closes Sat 5 Sep 2026, 8:00 AM"
      INSTANCE Action/Link 73x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 73x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Withdraw"
    FRAME app-Pending-T 328x120 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 213x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Grade 8 maths tutoring"
        INSTANCE Display/Badge 79x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Pending}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 47x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Pending"
      TEXT meta 137x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Closes Sat 26 Sep 2026"
      INSTANCE Action/Link 73x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 73x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Withdraw"
    FRAME app-Withdrawn-D 328x94 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x48 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 198x48 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Delivery rider — mornings"
        INSTANCE Display/Badge 94x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Withdrawn}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/text/secondary
          TEXT label 62x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Withdrawn"
      TEXT meta 277x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Withdrawn by you — the employer has been told"
    FRAME app-Withdrawn-C 328x94 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x48 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 198x48 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Café service crew — evenings"
        INSTANCE Display/Badge 94x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Withdrawn}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/text/secondary
          TEXT label 62x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Withdrawn"
      TEXT meta 277x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Withdrawn by you — the employer has been told"
    TEXT orderNote 328x32 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Pending first, soonest closing first. Decided and withdrawn applications show for 30 days."
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Worker} · [standard, see header]
```

A branch.

### `4.1o` — Apply · Office cleaning

**Reached from** [M3](M3-discovery.md) `3.12o` (Apply)  ·  **Leads to** `4.2o`  ·  **Exits** back → [M3](M3-discovery.md) `3.12o`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Apply"
  FRAME content 360x660 [FILL/FILL] · vertical pad 20/16/0/16 gap 12
    TEXT context 328x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Office cleaning — Kirulapone · Kottawa Business Centre"
    TEXT noteLabel 141x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Note to the employer"
    INSTANCE noteField 328x98 [FILL/HUG] · vertical pad 12 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8 · of Input/TextArea · {State=Filled}
      TEXT value 302x72 [FILL/HUG] · fill color/text/primary · mobile/body · "Available Sunday from 7 AM — I've done office cleaning through a family contact."
    TEXT prefillNote 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Optional — the employer sees it with your profile."
    FRAME spacer-grow 8x414 [FIXED/FILL]
  FRAME ctaBar 360x84 [FILL/HUG] · vertical pad 12/16/24/16 gap 8 · fill color/bg/default
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 143x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Submit application"
```

Office cleaning in Kirulapone, from the evening's history (M3 `3.12o`).

### `4.2o` — Application sent · Office cleaning

**Reached from** `4.1o`  ·  **Leads to** `4.3o`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x800 [FILL/FILL] · vertical pad 24 gap 12
    FRAME successGlyph 56x56 [FIXED/FIXED]
      ELLIPSE Ellipse 56x56 [FIXED/FIXED] @0,0 · stroke color/state/success 2.5
      VECTOR Vector 25x18 [FIXED/FIXED] @16,20 · stroke color/state/success 3
    TEXT successTitle 158x28 [HUG/HUG] · fill color/text/primary · mobile/title · "Application sent"
    TEXT line 280x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · align center · "Kottawa Business Centre will see your note and profile."
    FRAME actions 210x48 [HUG/HUG] · vertical pad 0 gap 0
      INSTANCE Action/Button 210x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
        TEXT label 162x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "View my applications"
```

### `4.3o` — My applications · Thursday night, seven applications

**Reached from** `4.2o`, and the Applications tab on Thursday-evening screens  ·  **Leads to** **Withdraw** on each pending row → `4.4`, `4.4s`, `4.4o`, `4.4h`, `4.4d`, `4.4t`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    TEXT screenTitle 184x32 [HUG/HUG] · fill color/text/primary · mobile/display · "My applications"
    FRAME app-Pending-E 328x144 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x48 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 213x48 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Event setup crew (3 needed)"
        INSTANCE Display/Badge 79x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Pending}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 47x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Pending"
      TEXT meta 263x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Closes Sat 29 Aug 2026, 7:00 AM · 1 of 3 filled"
      INSTANCE Action/Link 73x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 73x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Withdraw"
    FRAME app-Pending-S 328x120 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 213x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Shop assistant — weekend"
        INSTANCE Display/Badge 79x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Pending}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 47x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Pending"
      TEXT meta 192x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Closes Sat 29 Aug 2026, 8:00 AM"
      INSTANCE Action/Link 73x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 73x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Withdraw"
    FRAME app-Pending-O 328x144 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x48 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 213x48 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Office cleaning — Kirulapone"
        INSTANCE Display/Badge 79x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Pending}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 47x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Pending"
      TEXT meta 268x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Closes Sun 30 Aug 2026, 7:00 AM · 0 of 2 filled"
      INSTANCE Action/Link 73x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 73x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Withdraw"
    FRAME app-Pending-H 328x120 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 213x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "House cleaning — Saturday"
        INSTANCE Display/Badge 79x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Pending}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 47x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Pending"
      TEXT meta 184x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Closes Sat 5 Sep 2026, 8:00 AM"
      INSTANCE Action/Link 73x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 73x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Withdraw"
    FRAME app-Pending-D 328x120 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 213x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Delivery rider — mornings"
        INSTANCE Display/Badge 79x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Pending}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 47x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Pending"
      TEXT meta 214x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Closes Thu 24 Sep 2026 · 0 of 2 filled"
      INSTANCE Action/Link 73x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 73x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Withdraw"
    FRAME app-Pending-T 328x120 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 213x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Grade 8 maths tutoring"
        INSTANCE Display/Badge 79x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Pending}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 47x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Pending"
      TEXT meta 137x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Closes Sat 26 Sep 2026"
      INSTANCE Action/Link 73x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 73x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Withdraw"
    FRAME app-Withdrawn-C 328x94 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x48 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 198x48 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Café service crew — evenings"
        INSTANCE Display/Badge 94x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Withdrawn}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/text/secondary
          TEXT label 62x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Withdrawn"
      TEXT meta 277x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Withdrawn by you — the employer has been told"
    TEXT orderNote 328x32 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Pending first, soonest closing first. Decided and withdrawn applications show for 30 days."
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Worker} · [standard, see header]
```

**Thursday night: seven applications, six pending.** Office cleaning closes Sun 30 Aug 2026, 7:00 AM,
so it slots in third. This is the list the Applications tab opens on Thursday-evening screens. FR-APPLY-11
sets no cap, and nothing on the screen suggests one.

### `4.4o` — Withdraw dialog · Office cleaning

**Opens over** `4.3o` (the Office cleaning row's Withdraw)  ·  **Keep it** → back  ·  **Withdraw** → `4.3ow`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    TEXT screenTitle 184x32 [HUG/HUG] · fill color/text/primary · mobile/display · "My applications"
    FRAME app-Pending-E 328x144 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x48 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 213x48 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Event setup crew (3 needed)"
        INSTANCE Display/Badge 79x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Pending}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 47x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Pending"
      TEXT meta 263x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Closes Sat 29 Aug 2026, 7:00 AM · 1 of 3 filled"
      INSTANCE Action/Link 73x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 73x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Withdraw"
    FRAME app-Pending-S 328x120 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 213x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Shop assistant — weekend"
        INSTANCE Display/Badge 79x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Pending}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 47x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Pending"
      TEXT meta 192x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Closes Sat 29 Aug 2026, 8:00 AM"
      INSTANCE Action/Link 73x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 73x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Withdraw"
    FRAME app-Pending-O 328x144 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x48 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 213x48 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Office cleaning — Kirulapone"
        INSTANCE Display/Badge 79x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Pending}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 47x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Pending"
      TEXT meta 268x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Closes Sun 30 Aug 2026, 7:00 AM · 0 of 2 filled"
      INSTANCE Action/Link 73x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 73x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Withdraw"
    FRAME app-Pending-H 328x120 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 213x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "House cleaning — Saturday"
        INSTANCE Display/Badge 79x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Pending}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 47x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Pending"
      TEXT meta 184x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Closes Sat 5 Sep 2026, 8:00 AM"
      INSTANCE Action/Link 73x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 73x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Withdraw"
    FRAME app-Pending-D 328x120 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 213x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Delivery rider — mornings"
        INSTANCE Display/Badge 79x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Pending}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 47x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Pending"
      TEXT meta 214x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Closes Thu 24 Sep 2026 · 0 of 2 filled"
      INSTANCE Action/Link 73x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 73x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Withdraw"
    FRAME app-Pending-T 328x120 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 213x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Grade 8 maths tutoring"
        INSTANCE Display/Badge 79x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Pending}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 47x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Pending"
      TEXT meta 137x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Closes Sat 26 Sep 2026"
      INSTANCE Action/Link 73x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 73x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Withdraw"
    FRAME app-Withdrawn-C 328x94 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x48 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 198x48 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Café service crew — evenings"
        INSTANCE Display/Badge 94x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Withdrawn}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/text/secondary
          TEXT label 62x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Withdrawn"
      TEXT meta 277x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Withdrawn by you — the employer has been told"
    TEXT orderNote 328x32 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Pending first, soonest closing first. Decided and withdrawn applications show for 30 days."
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Worker} · [standard, see header]
  RECTANGLE scrim 360x800 [FIXED/FIXED] @0,0 · fill color/overlay/scrim · opacity 40%
  INSTANCE Feedback/ConfirmDialog 328x200 [FIXED/HUG] @16,300 · vertical pad 20 gap 12 · fill color/bg/default · r12
    TEXT title 259x28 [HUG/HUG] · fill color/text/primary · mobile/title · "Withdraw this application?"
    TEXT body 288x60 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Kottawa Business Centre will no longer see it. You can apply again while the posting stays open."
    FRAME actions 288x48 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Action/Button 101x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 53x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Keep it"
      INSTANCE Action/Button 122x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/state/danger · r8 · {Style=Destructive, State=Default}
        TEXT label 74x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Withdraw"
```

The same dialog, naming Kottawa Business Centre.

### `4.3ow` — My applications · Office cleaning withdrawn (branch)

**Reached from** `4.4o`  ·  **Leads to** **Withdraw** on each pending row → `4.4`, `4.4s`, `4.4h`, `4.4d`, `4.4t`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    TEXT screenTitle 184x32 [HUG/HUG] · fill color/text/primary · mobile/display · "My applications"
    FRAME app-Pending-E 328x144 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x48 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 213x48 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Event setup crew (3 needed)"
        INSTANCE Display/Badge 79x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Pending}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 47x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Pending"
      TEXT meta 263x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Closes Sat 29 Aug 2026, 7:00 AM · 1 of 3 filled"
      INSTANCE Action/Link 73x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 73x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Withdraw"
    FRAME app-Pending-S 328x120 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 213x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Shop assistant — weekend"
        INSTANCE Display/Badge 79x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Pending}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 47x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Pending"
      TEXT meta 192x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Closes Sat 29 Aug 2026, 8:00 AM"
      INSTANCE Action/Link 73x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 73x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Withdraw"
    FRAME app-Pending-H 328x120 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 213x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "House cleaning — Saturday"
        INSTANCE Display/Badge 79x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Pending}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 47x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Pending"
      TEXT meta 184x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Closes Sat 5 Sep 2026, 8:00 AM"
      INSTANCE Action/Link 73x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 73x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Withdraw"
    FRAME app-Pending-D 328x120 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 213x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Delivery rider — mornings"
        INSTANCE Display/Badge 79x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Pending}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 47x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Pending"
      TEXT meta 214x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Closes Thu 24 Sep 2026 · 0 of 2 filled"
      INSTANCE Action/Link 73x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 73x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Withdraw"
    FRAME app-Pending-T 328x120 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 213x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Grade 8 maths tutoring"
        INSTANCE Display/Badge 79x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Pending}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 47x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Pending"
      TEXT meta 137x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Closes Sat 26 Sep 2026"
      INSTANCE Action/Link 73x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 73x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Withdraw"
    FRAME app-Withdrawn-O 328x94 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x48 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 198x48 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Office cleaning — Kirulapone"
        INSTANCE Display/Badge 94x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Withdrawn}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/text/secondary
          TEXT label 62x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Withdrawn"
      TEXT meta 277x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Withdrawn by you — the employer has been told"
    FRAME app-Withdrawn-C 328x94 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x48 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 198x48 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Café service crew — evenings"
        INSTANCE Display/Badge 94x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Withdrawn}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/text/secondary
          TEXT label 62x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Withdrawn"
      TEXT meta 277x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Withdrawn by you — the employer has been told"
    TEXT orderNote 328x32 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Pending first, soonest closing first. Decided and withdrawn applications show for 30 days."
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Worker} · [standard, see header]
```

A branch.

### `4.3n` — My applications · Friday morning, three declined

**Reached from** [M8](M8-endorsement.md) `8.7` ("Not now" — the suggestion opens over this list) and [M8](M8-endorsement.md) `8.1`'s back  ·  **Leads to** **Withdraw** on each pending row → `4.4`, `4.4s`, `4.4t`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    TEXT screenTitle 184x32 [HUG/HUG] · fill color/text/primary · mobile/display · "My applications"
    FRAME app-Pending-E 328x144 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x48 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 213x48 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Event setup crew (3 needed)"
        INSTANCE Display/Badge 79x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Pending}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 47x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Pending"
      TEXT meta 263x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Closes Sat 29 Aug 2026, 7:00 AM · 1 of 3 filled"
      INSTANCE Action/Link 73x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 73x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Withdraw"
    FRAME app-Pending-S 328x120 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 213x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Shop assistant — weekend"
        INSTANCE Display/Badge 79x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Pending}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 47x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Pending"
      TEXT meta 192x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Closes Sat 29 Aug 2026, 8:00 AM"
      INSTANCE Action/Link 73x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 73x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Withdraw"
    FRAME app-Pending-T 328x120 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 213x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Grade 8 maths tutoring"
        INSTANCE Display/Badge 79x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Pending}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 47x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Pending"
      TEXT meta 137x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Closes Sat 26 Sep 2026"
      INSTANCE Action/Link 73x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 73x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Withdraw"
    FRAME app-Declined-H 328x94 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x48 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 210x48 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "House cleaning — Saturday"
        INSTANCE Display/Badge 82x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Declined}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/text/secondary
          TEXT label 50x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Declined"
      TEXT meta 145x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Declined by the employer"
    FRAME app-Declined-D 328x70 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 210x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Delivery rider — mornings"
        INSTANCE Display/Badge 82x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Declined}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/text/secondary
          TEXT label 50x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Declined"
      TEXT meta 145x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Declined by the employer"
    FRAME app-Declined-O 328x94 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x48 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 210x48 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Office cleaning — Kirulapone"
        INSTANCE Display/Badge 82x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Declined}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/text/secondary
          TEXT label 50x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Declined"
      TEXT meta 145x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Declined by the employer"
    FRAME app-Withdrawn-C 328x94 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x48 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 198x48 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Café service crew — evenings"
        INSTANCE Display/Badge 94x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Withdrawn}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/text/secondary
          TEXT label 62x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Withdrawn"
      TEXT meta 277x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Withdrawn by you — the employer has been told"
    TEXT orderNote 328x32 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Pending first, soonest closing first. Decided and withdrawn applications show for 30 days."
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Worker} · [standard, see header]
```

**Friday 28 Aug, morning.** House cleaning, Delivery rider and Office cleaning have declined him —
*Declined by the employer* (FR-APPLY-08). With no rating history and no endorsement, that third unselected
outcome is what FR-ENDORSE-14 waits for, so the endorsement suggestion opens over this list ({M8} `8.7`). The
three pending rows are unchanged. Declined rows sit below the pending ones and above the withdrawn Café.

The requirement now says what counts (amended 2026-09-23): Declined and Not selected do; his own withdrawal
of Café does not, and pending applications never did. Until that pass this list was *all pending*, and the
suggestion fired over three applications that had not ended at all.

The frame became vertical auto layout on 2026-09-23 like its siblings; its `content` had been a fixed 744
running 8 px under the tab bar.

### `4.3r` — My applications · from Saturday 29 Aug

**Reached from** the Applications tab on every established worker screen  ·  **Leads to** [M5](M5-engagement.md) `5.2s` (Shop assistant row), [M5](M5-engagement.md) `5.9` (tutoring row)

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    TEXT screenTitle 184x32 [HUG/HUG] · fill color/text/primary · mobile/display · "My applications"
    FRAME app-Selected-S 328x70 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 210x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Shop assistant — weekend"
        INSTANCE Display/Badge 82x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Selected}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/state/success
          TEXT label 50x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Selected"
      TEXT meta 201x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Contact shared — see engagement"
    FRAME app-Selected-T 328x70 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 210x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Grade 8 maths tutoring"
        INSTANCE Display/Badge 82x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Selected}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/state/success
          TEXT label 50x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Selected"
      TEXT meta 201x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Contact shared — see engagement"
    FRAME app-NotSelected-E 328x94 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x48 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 187x48 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Event setup crew (3 needed)"
        INSTANCE Display/Badge 105x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=NotSelected}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/text/secondary
          TEXT label 73x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Not selected"
      TEXT meta 258x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Not selected — the posting closed at its start"
    FRAME app-Declined-H 328x94 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x48 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 210x48 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "House cleaning — Saturday"
        INSTANCE Display/Badge 82x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Declined}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/text/secondary
          TEXT label 50x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Declined"
      TEXT meta 145x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Declined by the employer"
    FRAME app-Declined-D 328x70 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 210x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Delivery rider — mornings"
        INSTANCE Display/Badge 82x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Declined}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/text/secondary
          TEXT label 50x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Declined"
      TEXT meta 145x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Declined by the employer"
    FRAME app-Declined-O 328x94 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x48 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 210x48 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Office cleaning — Kirulapone"
        INSTANCE Display/Badge 82x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Declined}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/text/secondary
          TEXT label 50x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Declined"
      TEXT meta 145x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Declined by the employer"
    FRAME app-Withdrawn-C 328x94 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x48 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 198x48 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Café service crew — evenings"
        INSTANCE Display/Badge 94x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Withdrawn}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/text/secondary
          TEXT label 62x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Withdrawn"
      TEXT meta 277x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Withdrawn by you — the employer has been told"
    TEXT orderNote 328x32 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Pending first, soonest closing first. Decided and withdrawn applications show for 30 days."
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Worker} · [standard, see header]
```

**From Saturday 29 Aug, after 7:00 AM.** Seven rows, every one resolved:
- **Selected** — Shop assistant and tutoring. Saman Stores and Dilrukshi selected him on Friday afternoon,
  after Sunil Bandara vouched for him that day. *Contact shared — see engagement*: each row opens its
  engagement ({M5} `5.2s`, `5.9`), because a selected application's life continues there. The demo opens
  this list in the Monday–Wednesday journey, so the rows open the engagements as they stand that week — the
  Shop assistant dispute and Dilrukshi's pending cancellation request (M5 pass, 2026-09-24).
- **Not selected** — the Event setup crew. It started at 7:00 AM with one place filled, and FR-APPLY-09
  resolved every application still pending the moment it closed: *Not selected — the posting closed at its
  start*.
- **Declined** ×3, and **Withdrawn** (Café).

No row is pending, which is FR-APPLY-12's closing criterion. This is where the worker Applications tab goes
from every established screen.

### `4.3nj` — My applications · Nethmi Jayasinghe (Sat 29 Aug, before she cancels)

**Reached from** the Applications tab on Nethmi's screens, Sat 29 Aug about 2 AM  ·  **Leads to** [M5](M5-engagement.md) `5.2n` (the row) in the demo

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    TEXT screenTitle 184x32 [HUG/HUG] · fill color/text/primary · mobile/display · "My applications"
    FRAME app-Selected-E 328x94 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x48 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 210x48 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Event setup crew (3 needed)"
        INSTANCE Display/Badge 82x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Selected}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/state/success
          TEXT label 50x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Selected"
      TEXT meta 201x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Contact shared — see engagement"
    TEXT orderNote 328x32 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Pending first, soonest closing first. Decided and withdrawn applications show for 30 days."
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Worker} · [standard, see header]
```

**Nethmi's side of Thursday's selection.** Lanka Events selected her at about 8:40 AM on Thursday (`4.5s`),
so her Event setup application is **Selected**, and like Kavindu's selected rows on `4.3r` it says
*Contact shared — see engagement* and opens the engagement (`5.2n`), where a selected application's life
continues. Nothing is pending, so there is no closing date to show.

**One row is the whole list.** Nethmi has twelve completed jobs, each of which began as an application, but
all of them — and the earlier cancellation behind her completion rate — resolved before the end of July,
more than 30 days ago, so they have left the list (`FR-APPLY-12` as amended 2026-09-24; the footer says
so). Their record is on her profile (M1 `1.18n`).

### `4.3njc` — My applications · Nethmi Jayasinghe, just after she cancels

**Reached from** the Applications tab on Nethmi's screens just after she cancels  ·  **Leads to** [M5](M5-engagement.md) `5.2nc` (the row) in the demo

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    TEXT screenTitle 184x32 [HUG/HUG] · fill color/text/primary · mobile/display · "My applications"
    FRAME app-Selected-E 328x94 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x48 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 210x48 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Event setup crew (3 needed)"
        INSTANCE Display/Badge 82x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Application, Value=Selected}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/state/success
          TEXT label 50x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Selected"
      TEXT meta 284x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Engagement cancelled by you — see engagement"
    TEXT orderNote 328x32 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Pending first, soonest closing first. Decided and withdrawn applications show for 30 days."
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Worker} · [standard, see header]
```

**The application stays Selected** — she was selected; what she cancelled is the engagement that followed,
and the application states (`FR-APPLY-12`) have no *cancelled*. The meta line says so and points to where the
cancellation lives: *Engagement cancelled by you — see engagement* (`5.2nc`).

### `4.3ldg` — My applications · loading

**Reached from** the Applications tab while the list loads  ·  **Advances to** `4.3e` after 1.5 s †

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    TEXT screenTitle 184x32 [HUG/HUG] · fill color/text/primary · mobile/display · "My applications"
    INSTANCE loading1 328x114 [FIXED/HUG] · vertical pad 16 gap 10 · stroke color/border/default 1 · r8 · of Feedback/LoadingState
      RECTANGLE skeleton1 200x16 [FIXED/FIXED] · fill color/bg/subtle · r4
      RECTANGLE skeleton2 296x12 [FIXED/FIXED] · fill color/bg/subtle · r4
      RECTANGLE skeleton3 296x12 [FIXED/FIXED] · fill color/bg/subtle · r4
      RECTANGLE skeleton4 140x12 [FIXED/FIXED] · fill color/bg/subtle · r4
    INSTANCE loading2 328x114 [FIXED/HUG] · vertical pad 16 gap 10 · stroke color/border/default 1 · r8 · of Feedback/LoadingState
      RECTANGLE skeleton1 200x16 [FIXED/FIXED] · fill color/bg/subtle · r4
      RECTANGLE skeleton2 296x12 [FIXED/FIXED] · fill color/bg/subtle · r4
      RECTANGLE skeleton3 296x12 [FIXED/FIXED] · fill color/bg/subtle · r4
      RECTANGLE skeleton4 140x12 [FIXED/FIXED] · fill color/bg/subtle · r4
    INSTANCE loading3 328x114 [FIXED/HUG] · vertical pad 16 gap 10 · stroke color/border/default 1 · r8 · of Feedback/LoadingState
      RECTANGLE skeleton1 200x16 [FIXED/FIXED] · fill color/bg/subtle · r4
      RECTANGLE skeleton2 296x12 [FIXED/FIXED] · fill color/bg/subtle · r4
      RECTANGLE skeleton3 296x12 [FIXED/FIXED] · fill color/bg/subtle · r4
      RECTANGLE skeleton4 140x12 [FIXED/FIXED] · fill color/bg/subtle · r4
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Worker} · [standard, see header]
  [frame reaction] AFTER_TIMEOUT 1500s
```

The list's skeleton — three `Feedback/LoadingState` cards. **Advances after 1.5 s to `4.3e`**, the evening list: the demo reaches it from Thursday evening's history.

### `4.3z` — My applications · first run

**Reached from** the Applications tab on a brand-new worker account  ·  **Leads to** [M3](M3-discovery.md) "Browse gigs" (the new user's Browse, `3.2`)

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    TEXT screenTitle 184x32 [HUG/HUG] · fill color/text/primary · mobile/display · "My applications"
    INSTANCE Feedback/EmptyState 328x196 [FILL/HUG] · vertical pad 32/24/32/24 gap 8 · fill color/bg/default · r10 · {Cause=NoneExist}
      TEXT title 186x28 [HUG/HUG] · fill color/text/primary · mobile/title · "No applications yet"
      TEXT body 280x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · align center · "Apply to a gig from Browse and it will appear here, with its status."
      INSTANCE Action/Button 142x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 94x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Browse gigs"
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=false, Role=Worker} · [standard, see header]
```

A brand-new worker's list: FR-APPLY-12's empty state, `Feedback/EmptyState {Cause=NoneExist}`, with "Browse gigs" as its action and `Notification badge=false` on the tab bar.

### `4.5b` — Applicant pool · empty

**Reached from** [M2](M2-posting.md) `2.11p` ("No applicants yet — view pool")  ·  **Leads to** [M2](M2-posting.md) `2.11pe` ("Edit pay or details")  ·  **Exits** back → [M2](M2-posting.md) `2.11p`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Applicants"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 12
    TEXT context 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "0 of 3 filled · posted today"
    INSTANCE Feedback/EmptyState 328x196 [FIXED/HUG] · vertical pad 32/24/32/24 gap 8 · fill color/bg/default · r10 · {Cause=NoneExist}
      TEXT title 169x28 [HUG/HUG] · fill color/text/primary · mobile/title · "No applicants yet"
      TEXT body 280x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · align center · "Your posting is live in Browse. Applications appear here as youth apply."
      INSTANCE Action/Button 185x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 137x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Edit pay or details"
```

**Lanka Events, just after posting (~7:00 AM).** Nobody has applied. The empty state's action is FR-POST-17's
own wording for the no-applicant nudge — review pay or details — and opens the edit (M2 `2.11pe`).

### `4.5` — Applicant pool · three applicants, 0 of 3 filled

**Reached from** [M3](M3-discovery.md) `3.10ea` (each "New applicant" row), and back from `4.6k`, `4.6t`  ·  **Leads to** `4.6` / `4.6t` / `4.6k` (rows), `4.7` / `4.7t` / `4.7k` (Select), `4.9p` / `4.9pt` / `4.9pk` (Decline)  ·  **Exits** back → history

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Applicants"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 12
    TEXT context 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Event setup crew (3 needed) · 0 of 3 filled"
    TEXT tierNote 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Sorted by trust tier — history, endorsed, new."
    INSTANCE Display/ApplicantRow 328x218 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show endorsed=true, Tier=History}
      FRAME nameRow 270x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT displayName 147x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Nethmi Jayasinghe"
        INSTANCE Display/Badge 115x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
          VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
          TEXT label 82x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Phone verified"
      FRAME trustRow 296x50 [FILL/HUG] · vertical pad 0 gap 6
        TEXT trust 296x20 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "4.6 from 12 ratings · 92% completion"
        INSTANCE endorsedBadge 108x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/endorsed 1 · r999 · of Display/Badge · {Family=Endorsed, Value=Default}
          VECTOR diamond 10x10 [FIXED/FIXED] · fill color/badge/endorsed
          TEXT label 73x16 [HUG/HUG] · fill color/badge/endorsed · mobile/caption · "Endorsed ×2"
      TEXT note 296x40 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Free all weekend — I've run event setups for two agencies and can lead a crew."
      INSTANCE Action/ListRowAction 168x48 [HUG/HUG] · horizontal pad 0 gap 12
        FRAME select 74x48 [HUG/FIXED] · horizontal pad 0/16/0/16 gap 0 · fill color/brand/primary · r8
          TEXT label 42x20 [HUG/HUG] · fill color/text/inverse · mobile/secondary · "Select"
        FRAME decline 82x48 [HUG/FIXED] · horizontal pad 0/16/0/16 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
          TEXT label 50x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Decline"
    INSTANCE Display/ApplicantRow 328x192 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show endorsed=false, Tier=EndorsedNew}
      FRAME nameRow 232x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT displayName 109x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Tharindu Silva"
        INSTANCE Display/Badge 115x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
          VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
          TEXT label 82x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Phone verified"
      FRAME trustRow 214x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT trust 117x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "New to YouthLink"
        INSTANCE Display/Badge 89x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/endorsed 1 · r999 · {Family=Endorsed, Value=Default}
          VECTOR diamond 10x10 [FIXED/FIXED] · fill color/badge/endorsed
          TEXT label 54x16 [HUG/HUG] · fill color/badge/endorsed · mobile/caption · "Endorsed"
      TEXT note 296x40 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Free from Saturday 4 AM. Strong, punctual — this would be my first gig on YouthLink."
      INSTANCE Action/ListRowAction 168x48 [HUG/HUG] · horizontal pad 0 gap 12
        FRAME select 74x48 [HUG/FIXED] · horizontal pad 0/16/0/16 gap 0 · fill color/brand/primary · r8
          TEXT label 42x20 [HUG/HUG] · fill color/text/inverse · mobile/secondary · "Select"
        FRAME decline 82x48 [HUG/FIXED] · horizontal pad 0/16/0/16 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
          TEXT label 50x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Decline"
    INSTANCE Display/ApplicantRow 328x188 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show endorsed=false, Tier=New}
      FRAME nameRow 239x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT displayName 116x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Kavindu Perera"
        INSTANCE Display/Badge 115x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
          VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
          TEXT label 82x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Phone verified"
      FRAME trustRow 117x20 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT trust 117x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "New to YouthLink"
      TEXT note 296x40 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Available all weekend — I've done two event setups."
      INSTANCE Action/ListRowAction 168x48 [HUG/HUG] · horizontal pad 0 gap 12
        FRAME select 74x48 [HUG/FIXED] · horizontal pad 0/16/0/16 gap 0 · fill color/brand/primary · r8
          TEXT label 42x20 [HUG/HUG] · fill color/text/inverse · mobile/secondary · "Select"
        FRAME decline 82x48 [HUG/FIXED] · horizontal pad 0/16/0/16 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
          TEXT label 50x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Decline"
```

**Thursday, about 8:40 AM** — the pool as the employer opens it from the three *New applicant* rows
(M3 `3.10ea`). 0 of 3 filled, three pending applicants, sorted by FR-APPLY-04's tiers:
1. **Nethmi Jayasinghe — rating history.** 4.6 from 12 ratings, 92% completion, endorsed twice.
2. **Tharindu Silva — zero history, endorsed.** "New to YouthLink" with the endorsement badge (FR-APPLY-05):
   Roshan Dias vouched for him.
3. **Kavindu Perera — zero history, not endorsed.** "New to YouthLink" alone. On Thursday nobody has vouched
   for him yet; Sunil Bandara does on Friday.

Within a tier the earlier application ranks first (FR-APPLY-04 as amended 2026-09-23); with one applicant
per tier here, that rule is stated rather than shown. Each row shows the applicant's note and
phone-verified badge, and carries Select and Decline.

**The rows were corrected on 2026-09-23.** The two zero-history rows had their names swapped — the row
labelled "Tharindu Silva" carried Kavindu's note and tier, and the other way round — and the endorsed
applicant sat below the unendorsed one. Every pool frame and its three dialog backdrops were fixed.

**92%, not 96%.** Twelve jobs completed at 96% would need 12.5 jobs; 12 of 13 is 92%.

### `4.6` — Applicant detail · Nethmi Jayasinghe

**Reached from** Nethmi's row on `4.5`, `4.5sk`, `4.5dk`, `4.5st`, `4.5dt`; back from [M1](M1-account.md) `1.19`  ·  **Leads to** `4.7` (Select), `4.9` (Decline), [M1](M1-account.md) `1.19` (her name)  ·  **Exits** back → history

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Applicant"
  FRAME content 360x660 [FILL/FILL] · vertical pad 16/16/0/16 gap 12
    TEXT context 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Applied to: Event setup crew (3 needed)"
    FRAME nameRow 308x28 [HUG/HUG] · horizontal pad 0 gap 8
      TEXT displayName 185x28 [HUG/HUG] · fill color/text/primary · mobile/title · "Nethmi Jayasinghe"
      INSTANCE Display/Badge 115x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
        VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
        TEXT label 82x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Phone verified"
    TEXT endorsersNote 328x40 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "Endorsed by K. Rathnayake (Reliability) and M. Perera (Punctuality, Honesty)."
    INSTANCE Display/ProfileTrustBlock 328x84 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Tier=History}
      INSTANCE Display/StarsDisplay 152x24 [HUG/HUG] · horizontal pad 0 gap 6
        STAR star 16x16 [FIXED/FIXED] · fill color/badge/rating
        TEXT avg 25x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "4.6"
        TEXT count 99x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "from 12 ratings"
      TEXT completion 165x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "92% completion · 12 jobs"
    TEXT noteLabel 115x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "APPLICATION NOTE"
    TEXT note 328x40 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Free all weekend — I've run event setups for two agencies and can lead a crew."
    FRAME spacer-grow 8x348 [FIXED/FILL]
  FRAME ctaBar 360x84 [FILL/HUG] · vertical pad 12/16/24/16 gap 8 · fill color/bg/subtle
    FRAME actions 328x48 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Action/Button 160x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
        TEXT label 49x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Select"
      INSTANCE Action/Button 160x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 57x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Decline"
```

Nethmi's detail: the endorsers by name and what they vouched for, `Display/ProfileTrustBlock {Tier=History}`
(4.6 from 12 ratings; 92% completion · 12 jobs), and her note. No dispute or case history is shown — only
aggregate stats (FR-APPLY-05). Her name opens her public profile ({M1} `1.19`).

### `4.7` — Confirm selection · Nethmi

**Reached from** `4.6`, and Nethmi's Select on every pool where she is pending  ·  **Leads to** `4.8` ("Select Nethmi")  ·  **Exits** back → history

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Confirm selection"
  FRAME content 360x660 [FILL/FILL] · vertical pad 20/16/0/16 gap 12
    TEXT who 328x28 [FIXED/HUG] · fill color/text/primary · mobile/title · "Select Nethmi Jayasinghe?"
    TEXT fx1 328x20 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "• An engagement is created for this gig"
    TEXT fx2 328x20 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "• You'll each see the other's contact details"
    TEXT fx3 328x20 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "• Takes one of the 3 places on this posting"
    TEXT note 328x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Anyone else who applied stays in the pool until the posting fills, expires or is withdrawn."
    FRAME spacer-grow 8x452 [FIXED/FILL]
  FRAME ctaBar 360x84 [FILL/HUG] · vertical pad 12/16/24/16 gap 8 · fill color/bg/default
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 108x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Select Nethmi"
```

The selection confirmation, stating what selection does: an engagement is created (FR-APPLY-06),
contacts are shared both ways (FR-APPLY-07), and it takes one of the 3 places. `note` says what happens to
everyone else: they stay in the pool until the posting fills, expires or is withdrawn (FR-APPLY-09).
"Takes one of the 3 places" is true from any pool, which is why the confirmations can be reached from a
pool where a place is already filled.

### `4.8` — Contact details · Nethmi

**Reached from** `4.7`, and Nethmi's row on `4.5s`  ·  **Leads to** `4.5s` ("Back to applicants", and ‹)

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Contact details"
  FRAME content 360x660 [FILL/FILL] · vertical pad 20/16/0/16 gap 12
    TEXT context 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Event setup crew (3 needed) · engagement active"
    TEXT phoneLabel 42x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "PHONE"
    TEXT phone 132x24 [HUG/HUG] · fill color/text/primary · mobile/body · "+94 76 234 5678"
    TEXT note 328x32 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Your number is now shared with them too, with the venue address."
    FRAME spacer-grow 328x504 [FILL/FILL]
  FRAME ctaBar 360x84 [FILL/HUG] · vertical pad 12/16/24/16 gap 8 · fill color/bg/subtle
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 141x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Back to applicants"
```

**Contact details, Nethmi.** Her phone number, and `note`: *"Your number is now shared with them too, with
the venue address."* FR-APPLY-07 reveals both numbers to both parties and the precise address to the
selected worker only — so the employer's screen shows her number and says what she has received; there is
nothing for the employer to see about the location they entered themselves. Until 2026-09-23 this screen
showed the address and a map, and was titled *Contact & location*.

### `4.5s` — Applicant pool · Nethmi selected, 1 of 3 filled

**Reached from** `4.8`, [M2](M2-posting.md) `2.11` and `2.11c` ("… applicants — view pool")  ·  **Leads to** `4.8` (Nethmi's row), and Tharindu's and Kavindu's row, Select and Decline  ·  **Exits** back → history

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Applicants"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 12
    TEXT context 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Event setup crew (3 needed) · 1 of 3 filled"
    TEXT tierNote 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Sorted by trust tier — history, endorsed, new."
    INSTANCE Display/ApplicantRow 328x162 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show endorsed=true, Tier=History}
      FRAME nameRow 270x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT displayName 147x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Nethmi Jayasinghe"
        INSTANCE Display/Badge 115x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
          VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
          TEXT label 82x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Phone verified"
      FRAME trustRow 296x50 [FILL/HUG] · vertical pad 0 gap 6
        TEXT trust 296x20 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "4.6 from 12 ratings · 92% completion"
        INSTANCE endorsedBadge 108x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/endorsed 1 · r999 · of Display/Badge · {Family=Endorsed, Value=Default}
          VECTOR diamond 10x10 [FIXED/FIXED] · fill color/badge/endorsed
          TEXT label 73x16 [HUG/HUG] · fill color/badge/endorsed · mobile/caption · "Endorsed ×2"
      TEXT note 296x40 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Selected — an engagement is created; contact shared both ways."
    INSTANCE Display/ApplicantRow 328x192 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show endorsed=false, Tier=EndorsedNew}
      FRAME nameRow 232x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT displayName 109x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Tharindu Silva"
        INSTANCE Display/Badge 115x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
          VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
          TEXT label 82x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Phone verified"
      FRAME trustRow 214x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT trust 117x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "New to YouthLink"
        INSTANCE Display/Badge 89x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/endorsed 1 · r999 · {Family=Endorsed, Value=Default}
          VECTOR diamond 10x10 [FIXED/FIXED] · fill color/badge/endorsed
          TEXT label 54x16 [HUG/HUG] · fill color/badge/endorsed · mobile/caption · "Endorsed"
      TEXT note 296x40 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Free from Saturday 4 AM. Strong, punctual — this would be my first gig on YouthLink."
      INSTANCE Action/ListRowAction 168x48 [HUG/HUG] · horizontal pad 0 gap 12
        FRAME select 74x48 [HUG/FIXED] · horizontal pad 0/16/0/16 gap 0 · fill color/brand/primary · r8
          TEXT label 42x20 [HUG/HUG] · fill color/text/inverse · mobile/secondary · "Select"
        FRAME decline 82x48 [HUG/FIXED] · horizontal pad 0/16/0/16 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
          TEXT label 50x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Decline"
    INSTANCE Display/ApplicantRow 328x188 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show endorsed=false, Tier=New}
      FRAME nameRow 239x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT displayName 116x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Kavindu Perera"
        INSTANCE Display/Badge 115x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
          VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
          TEXT label 82x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Phone verified"
      FRAME trustRow 117x20 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT trust 117x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "New to YouthLink"
      TEXT note 296x40 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Available all weekend — I've done two event setups."
      INSTANCE Action/ListRowAction 168x48 [HUG/HUG] · horizontal pad 0 gap 12
        FRAME select 74x48 [HUG/FIXED] · horizontal pad 0/16/0/16 gap 0 · fill color/brand/primary · r8
          TEXT label 42x20 [HUG/HUG] · fill color/text/inverse · mobile/secondary · "Select"
        FRAME decline 82x48 [HUG/FIXED] · horizontal pad 0/16/0/16 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
          TEXT label 50x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Decline"
```

**1 of 3 filled** — Nethmi selected (*"Selected — an engagement is created; contact shared both ways"*),
her row now opening her contact details. Tharindu and Kavindu are still pending and fully actionable:
FR-APPLY-06 lets the employer select across several sessions. This is the pool M2's `2.11` and `2.11c`
open.

### `4.9` — Decline dialog · over Nethmi's detail

**Opens over** `4.6` (Decline)  ·  **Keep in pool** → back  ·  **Decline** → `4.5d`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Applicant"
  FRAME content 360x660 [FILL/FILL] · vertical pad 16/16/0/16 gap 12
    TEXT context 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Applied to: Event setup crew (3 needed)"
    FRAME nameRow 308x28 [HUG/HUG] · horizontal pad 0 gap 8
      TEXT displayName 185x28 [HUG/HUG] · fill color/text/primary · mobile/title · "Nethmi Jayasinghe"
      INSTANCE Display/Badge 115x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
        VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
        TEXT label 82x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Phone verified"
    TEXT endorsersNote 328x40 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "Endorsed by K. Rathnayake (Reliability) and M. Perera (Punctuality, Honesty)."
    INSTANCE Display/ProfileTrustBlock 328x84 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Tier=History}
      INSTANCE Display/StarsDisplay 152x24 [HUG/HUG] · horizontal pad 0 gap 6
        STAR star 16x16 [FIXED/FIXED] · fill color/badge/rating
        TEXT avg 25x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "4.6"
        TEXT count 99x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "from 12 ratings"
      TEXT completion 165x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "92% completion · 12 jobs"
    TEXT noteLabel 115x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "APPLICATION NOTE"
    TEXT note 328x40 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Free all weekend — I've run event setups for two agencies and can lead a crew."
    FRAME spacer-grow 8x348 [FIXED/FILL]
  FRAME ctaBar 360x84 [FILL/HUG] · vertical pad 12/16/24/16 gap 8 · fill color/bg/subtle
    FRAME actions 328x48 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Action/Button 160x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
        TEXT label 49x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Select"
      INSTANCE Action/Button 160x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 57x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Decline"
  RECTANGLE scrim 360x800 [FIXED/FIXED] @0,0 · fill color/overlay/scrim · opacity 40%
  INSTANCE Feedback/ConfirmDialog 328x180 [FIXED/HUG] @16,310 · vertical pad 20 gap 12 · fill color/bg/default · r12
    TEXT title 274x28 [HUG/HUG] · fill color/text/primary · mobile/title · "Decline Nethmi Jayasinghe?"
    TEXT body 288x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "She'll be notified, and this can't be undone for this posting."
    FRAME actions 288x48 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Action/Button 142x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 94x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Keep in pool"
      INSTANCE Action/Button 105x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/state/danger · r8 · {Style=Destructive, State=Default}
        TEXT label 57x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Decline"
```

The decline confirmation over Nethmi's detail. FR-APPLY-08: she is notified immediately, whatever places
remain; "can't be undone for this posting" is the consequence worth stating. Keep in pool returns.

### `4.5d` — Applicant pool · Nethmi declined

**Reached from** `4.9`, `4.9p`  ·  **Leads to** Tharindu's and Kavindu's row, Select and Decline  ·  **Exits** back → history

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Applicants"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 12
    TEXT context 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Event setup crew (3 needed) · 0 of 3 filled"
    TEXT tierNote 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Sorted by trust tier — history, endorsed, new."
    INSTANCE Display/ApplicantRow 328x162 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show endorsed=true, Tier=History}
      FRAME nameRow 270x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT displayName 147x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Nethmi Jayasinghe"
        INSTANCE Display/Badge 115x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
          VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
          TEXT label 82x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Phone verified"
      FRAME trustRow 296x50 [FILL/HUG] · vertical pad 0 gap 6
        TEXT trust 296x20 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "4.6 from 12 ratings · 92% completion"
        INSTANCE endorsedBadge 108x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/endorsed 1 · r999 · of Display/Badge · {Family=Endorsed, Value=Default}
          VECTOR diamond 10x10 [FIXED/FIXED] · fill color/badge/endorsed
          TEXT label 73x16 [HUG/HUG] · fill color/badge/endorsed · mobile/caption · "Endorsed ×2"
      TEXT note 296x40 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Declined — she has been told; kept here for your records."
    INSTANCE Display/ApplicantRow 328x192 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show endorsed=false, Tier=EndorsedNew}
      FRAME nameRow 232x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT displayName 109x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Tharindu Silva"
        INSTANCE Display/Badge 115x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
          VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
          TEXT label 82x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Phone verified"
      FRAME trustRow 214x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT trust 117x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "New to YouthLink"
        INSTANCE Display/Badge 89x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/endorsed 1 · r999 · {Family=Endorsed, Value=Default}
          VECTOR diamond 10x10 [FIXED/FIXED] · fill color/badge/endorsed
          TEXT label 54x16 [HUG/HUG] · fill color/badge/endorsed · mobile/caption · "Endorsed"
      TEXT note 296x40 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Free from Saturday 4 AM. Strong, punctual — this would be my first gig on YouthLink."
      INSTANCE Action/ListRowAction 168x48 [HUG/HUG] · horizontal pad 0 gap 12
        FRAME select 74x48 [HUG/FIXED] · horizontal pad 0/16/0/16 gap 0 · fill color/brand/primary · r8
          TEXT label 42x20 [HUG/HUG] · fill color/text/inverse · mobile/secondary · "Select"
        FRAME decline 82x48 [HUG/FIXED] · horizontal pad 0/16/0/16 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
          TEXT label 50x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Decline"
    INSTANCE Display/ApplicantRow 328x188 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show endorsed=false, Tier=New}
      FRAME nameRow 239x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT displayName 116x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Kavindu Perera"
        INSTANCE Display/Badge 115x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
          VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
          TEXT label 82x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Phone verified"
      FRAME trustRow 117x20 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT trust 117x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "New to YouthLink"
      TEXT note 296x40 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Available all weekend — I've done two event setups."
      INSTANCE Action/ListRowAction 168x48 [HUG/HUG] · horizontal pad 0 gap 12
        FRAME select 74x48 [HUG/FIXED] · horizontal pad 0/16/0/16 gap 0 · fill color/brand/primary · r8
          TEXT label 42x20 [HUG/HUG] · fill color/text/inverse · mobile/secondary · "Select"
        FRAME decline 82x48 [HUG/FIXED] · horizontal pad 0/16/0/16 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
          TEXT label 50x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Decline"
```

Nethmi declined — her row stays, with no actions, *kept here for your records*. 0 of 3 filled.

### `4.9p` — Decline dialog · Nethmi, from the pool

**Opens over** `4.5`; reached from Nethmi's Decline on every pool where she is pending  ·  **Keep in pool** → back  ·  **Decline** → `4.5d`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Applicants"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 12
    TEXT context 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Event setup crew (3 needed) · 0 of 3 filled"
    TEXT tierNote 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Sorted by trust tier — history, endorsed, new."
    INSTANCE Display/ApplicantRow 328x218 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show endorsed=true, Tier=History}
      FRAME nameRow 270x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT displayName 147x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Nethmi Jayasinghe"
        INSTANCE Display/Badge 115x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
          VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
          TEXT label 82x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Phone verified"
      FRAME trustRow 296x50 [FILL/HUG] · vertical pad 0 gap 6
        TEXT trust 296x20 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "4.6 from 12 ratings · 92% completion"
        INSTANCE endorsedBadge 108x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/endorsed 1 · r999 · of Display/Badge · {Family=Endorsed, Value=Default}
          VECTOR diamond 10x10 [FIXED/FIXED] · fill color/badge/endorsed
          TEXT label 73x16 [HUG/HUG] · fill color/badge/endorsed · mobile/caption · "Endorsed ×2"
      TEXT note 296x40 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Free all weekend — I've run event setups for two agencies and can lead a crew."
      INSTANCE Action/ListRowAction 168x48 [HUG/HUG] · horizontal pad 0 gap 12
        FRAME select 74x48 [HUG/FIXED] · horizontal pad 0/16/0/16 gap 0 · fill color/brand/primary · r8
          TEXT label 42x20 [HUG/HUG] · fill color/text/inverse · mobile/secondary · "Select"
        FRAME decline 82x48 [HUG/FIXED] · horizontal pad 0/16/0/16 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
          TEXT label 50x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Decline"
    INSTANCE Display/ApplicantRow 328x192 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show endorsed=false, Tier=EndorsedNew}
      FRAME nameRow 232x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT displayName 109x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Tharindu Silva"
        INSTANCE Display/Badge 115x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
          VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
          TEXT label 82x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Phone verified"
      FRAME trustRow 214x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT trust 117x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "New to YouthLink"
        INSTANCE Display/Badge 89x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/endorsed 1 · r999 · {Family=Endorsed, Value=Default}
          VECTOR diamond 10x10 [FIXED/FIXED] · fill color/badge/endorsed
          TEXT label 54x16 [HUG/HUG] · fill color/badge/endorsed · mobile/caption · "Endorsed"
      TEXT note 296x40 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Free from Saturday 4 AM. Strong, punctual — this would be my first gig on YouthLink."
      INSTANCE Action/ListRowAction 168x48 [HUG/HUG] · horizontal pad 0 gap 12
        FRAME select 74x48 [HUG/FIXED] · horizontal pad 0/16/0/16 gap 0 · fill color/brand/primary · r8
          TEXT label 42x20 [HUG/HUG] · fill color/text/inverse · mobile/secondary · "Select"
        FRAME decline 82x48 [HUG/FIXED] · horizontal pad 0/16/0/16 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
          TEXT label 50x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Decline"
    INSTANCE Display/ApplicantRow 328x188 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show endorsed=false, Tier=New}
      FRAME nameRow 239x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT displayName 116x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Kavindu Perera"
        INSTANCE Display/Badge 115x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
          VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
          TEXT label 82x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Phone verified"
      FRAME trustRow 117x20 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT trust 117x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "New to YouthLink"
      TEXT note 296x40 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Available all weekend — I've done two event setups."
      INSTANCE Action/ListRowAction 168x48 [HUG/HUG] · horizontal pad 0 gap 12
        FRAME select 74x48 [HUG/FIXED] · horizontal pad 0/16/0/16 gap 0 · fill color/brand/primary · r8
          TEXT label 42x20 [HUG/HUG] · fill color/text/inverse · mobile/secondary · "Select"
        FRAME decline 82x48 [HUG/FIXED] · horizontal pad 0/16/0/16 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
          TEXT label 50x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Decline"
  RECTANGLE scrim 360x800 [FIXED/FIXED] @0,0 · fill color/overlay/scrim · opacity 40%
  INSTANCE Feedback/ConfirmDialog 328x180 [FIXED/HUG] @16,310 · vertical pad 20 gap 12 · fill color/bg/default · r12
    TEXT title 274x28 [HUG/HUG] · fill color/text/primary · mobile/title · "Decline Nethmi Jayasinghe?"
    TEXT body 288x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "She'll be notified, and this can't be undone for this posting."
    FRAME actions 288x48 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Action/Button 142x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 94x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Keep in pool"
      INSTANCE Action/Button 105x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/state/danger · r8 · {Style=Destructive, State=Default}
        TEXT label 57x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Decline"
```

The same decline confirmation, opened from the pool rather than the detail — so its backdrop is the pool (`4.5`).

### `4.6k` — Applicant detail · Kavindu Perera

**Reached from** Kavindu's row on `4.5`, `4.5s`, `4.5d`, `4.5st`, `4.5dt`  ·  **Leads to** `4.7k`, `4.9k`  ·  **Exits** back → history

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Applicant"
  FRAME content 360x660 [FILL/FILL] · vertical pad 16/16/0/16 gap 12
    TEXT context 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Applied to: Event setup crew (3 needed)"
    FRAME nameRow 270x28 [HUG/HUG] · horizontal pad 0 gap 8
      TEXT displayName 147x28 [HUG/HUG] · fill color/text/primary · mobile/title · "Kavindu Perera"
      INSTANCE Display/Badge 115x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
        VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
        TEXT label 82x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Phone verified"
    TEXT endorsersNote 328x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "Not endorsed yet — new to YouthLink."
    INSTANCE Display/ProfileTrustBlock 328x84 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Tier=ZeroHistory}
      FRAME headline 135x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT headline 135x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "New to YouthLink"
      TEXT endorsedBy 143x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "No endorsements yet"
    TEXT noteLabel 115x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "APPLICATION NOTE"
    TEXT note 328x40 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Available all weekend — I've done two event setups."
    FRAME spacer-grow 8x372 [FIXED/FILL]
  FRAME ctaBar 360x84 [FILL/HUG] · vertical pad 12/16/24/16 gap 8 · fill color/bg/subtle
    FRAME actions 328x48 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Action/Button 160x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
        TEXT label 49x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Select"
      INSTANCE Action/Button 160x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 57x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Decline"
```

Kavindu's detail on Thursday morning: *"Not endorsed yet — new to YouthLink."*, `ProfileTrustBlock
{Tier=ZeroHistory}` reading *No endorsements yet*, and his note.

### `4.7k` — Confirm selection · Kavindu

**Reached from** `4.6k`, and Kavindu's Select on every pool where he is pending  ·  **Leads to** `4.8k`  ·  **Exits** back → history

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Confirm selection"
  FRAME content 360x660 [FILL/FILL] · vertical pad 20/16/0/16 gap 12
    TEXT who 328x28 [FIXED/HUG] · fill color/text/primary · mobile/title · "Select Kavindu Perera?"
    TEXT fx1 328x20 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "• An engagement is created for this gig"
    TEXT fx2 328x20 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "• You'll each see the other's contact details"
    TEXT fx3 328x20 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "• Takes one of the 3 places on this posting"
    TEXT note 328x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Anyone else who applied stays in the pool until the posting fills, expires or is withdrawn."
    FRAME spacer-grow 8x452 [FIXED/FILL]
  FRAME ctaBar 360x84 [FILL/HUG] · vertical pad 12/16/24/16 gap 8 · fill color/bg/default
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 114x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Select Kavindu"
```

Kavindu's selection confirmation — the branch where Lanka Events picks him.

### `4.8k` — Contact details · Kavindu

**Reached from** `4.7k`, and Kavindu's row on `4.5sk`  ·  **Leads to** `4.5sk`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Contact details"
  FRAME content 360x660 [FILL/FILL] · vertical pad 20/16/0/16 gap 12
    TEXT context 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Event setup crew (3 needed) · engagement active"
    TEXT phoneLabel 42x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "PHONE"
    TEXT phone 130x24 [HUG/HUG] · fill color/text/primary · mobile/body · "+94 77 123 4567"
    TEXT note 328x32 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Your number is now shared with them too, with the venue address."
    FRAME spacer-grow 328x504 [FILL/FILL]
  FRAME ctaBar 360x84 [FILL/HUG] · vertical pad 12/16/24/16 gap 8 · fill color/bg/subtle
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 141x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Back to applicants"
```

Kavindu's number. The same note as `4.8`.

### `4.5sk` — Applicant pool · Kavindu selected

**Reached from** `4.8k`  ·  **Leads to** `4.8k` (Kavindu's row), and Nethmi's and Tharindu's row, Select and Decline  ·  **Exits** back → history

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Applicants"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 12
    TEXT context 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Event setup crew (3 needed) · 1 of 3 filled"
    TEXT tierNote 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Sorted by trust tier — history, endorsed, new."
    INSTANCE Display/ApplicantRow 328x218 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show endorsed=true, Tier=History}
      FRAME nameRow 270x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT displayName 147x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Nethmi Jayasinghe"
        INSTANCE Display/Badge 115x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
          VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
          TEXT label 82x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Phone verified"
      FRAME trustRow 296x50 [FILL/HUG] · vertical pad 0 gap 6
        TEXT trust 296x20 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "4.6 from 12 ratings · 92% completion"
        INSTANCE endorsedBadge 108x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/endorsed 1 · r999 · of Display/Badge · {Family=Endorsed, Value=Default}
          VECTOR diamond 10x10 [FIXED/FIXED] · fill color/badge/endorsed
          TEXT label 73x16 [HUG/HUG] · fill color/badge/endorsed · mobile/caption · "Endorsed ×2"
      TEXT note 296x40 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Free all weekend — I've run event setups for two agencies and can lead a crew."
      INSTANCE Action/ListRowAction 168x48 [HUG/HUG] · horizontal pad 0 gap 12
        FRAME select 74x48 [HUG/FIXED] · horizontal pad 0/16/0/16 gap 0 · fill color/brand/primary · r8
          TEXT label 42x20 [HUG/HUG] · fill color/text/inverse · mobile/secondary · "Select"
        FRAME decline 82x48 [HUG/FIXED] · horizontal pad 0/16/0/16 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
          TEXT label 50x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Decline"
    INSTANCE Display/ApplicantRow 328x192 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show endorsed=false, Tier=EndorsedNew}
      FRAME nameRow 232x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT displayName 109x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Tharindu Silva"
        INSTANCE Display/Badge 115x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
          VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
          TEXT label 82x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Phone verified"
      FRAME trustRow 214x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT trust 117x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "New to YouthLink"
        INSTANCE Display/Badge 89x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/endorsed 1 · r999 · {Family=Endorsed, Value=Default}
          VECTOR diamond 10x10 [FIXED/FIXED] · fill color/badge/endorsed
          TEXT label 54x16 [HUG/HUG] · fill color/badge/endorsed · mobile/caption · "Endorsed"
      TEXT note 296x40 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Free from Saturday 4 AM. Strong, punctual — this would be my first gig on YouthLink."
      INSTANCE Action/ListRowAction 168x48 [HUG/HUG] · horizontal pad 0 gap 12
        FRAME select 74x48 [HUG/FIXED] · horizontal pad 0/16/0/16 gap 0 · fill color/brand/primary · r8
          TEXT label 42x20 [HUG/HUG] · fill color/text/inverse · mobile/secondary · "Select"
        FRAME decline 82x48 [HUG/FIXED] · horizontal pad 0/16/0/16 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
          TEXT label 50x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Decline"
    INSTANCE Display/ApplicantRow 328x132 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show endorsed=false, Tier=New}
      FRAME nameRow 239x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT displayName 116x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Kavindu Perera"
        INSTANCE Display/Badge 115x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
          VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
          TEXT label 82x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Phone verified"
      FRAME trustRow 117x20 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT trust 117x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "New to YouthLink"
      TEXT note 296x40 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Selected — an engagement is created; contact shared both ways."
```

The pool after selecting Kavindu instead: his row selected and opening his contact details; Nethmi and Tharindu pending.

### `4.9k` — Decline dialog · over Kavindu's detail

**Opens over** `4.6k`  ·  **Keep in pool** → back  ·  **Decline** → `4.5dk`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Applicant"
  FRAME content 360x660 [FILL/FILL] · vertical pad 16/16/0/16 gap 12
    TEXT context 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Applied to: Event setup crew (3 needed)"
    FRAME nameRow 270x28 [HUG/HUG] · horizontal pad 0 gap 8
      TEXT displayName 147x28 [HUG/HUG] · fill color/text/primary · mobile/title · "Kavindu Perera"
      INSTANCE Display/Badge 115x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
        VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
        TEXT label 82x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Phone verified"
    TEXT endorsersNote 328x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "Not endorsed yet — new to YouthLink."
    INSTANCE Display/ProfileTrustBlock 328x84 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Tier=ZeroHistory}
      FRAME headline 135x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT headline 135x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "New to YouthLink"
      TEXT endorsedBy 143x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "No endorsements yet"
    TEXT noteLabel 115x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "APPLICATION NOTE"
    TEXT note 328x40 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Available all weekend — I've done two event setups."
    FRAME spacer-grow 8x372 [FIXED/FILL]
  FRAME ctaBar 360x84 [FILL/HUG] · vertical pad 12/16/24/16 gap 8 · fill color/bg/subtle
    FRAME actions 328x48 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Action/Button 160x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
        TEXT label 49x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Select"
      INSTANCE Action/Button 160x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 57x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Decline"
  RECTANGLE scrim 360x800 [FIXED/FIXED] @0,0 · fill color/overlay/scrim · opacity 40%
  INSTANCE Feedback/ConfirmDialog 328x180 [FIXED/HUG] @16,310 · vertical pad 20 gap 12 · fill color/bg/default · r12
    TEXT title 235x28 [HUG/HUG] · fill color/text/primary · mobile/title · "Decline Kavindu Perera?"
    TEXT body 288x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "He'll be notified, and this can't be undone for this posting."
    FRAME actions 288x48 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Action/Button 142x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 94x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Keep in pool"
      INSTANCE Action/Button 105x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/state/danger · r8 · {Style=Destructive, State=Default}
        TEXT label 57x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Decline"
```

Declining Kavindu from his detail.

### `4.5dk` — Applicant pool · Kavindu declined

**Reached from** `4.9k`, `4.9pk`  ·  **Leads to** Nethmi's and Tharindu's row, Select and Decline  ·  **Exits** back → history

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Applicants"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 12
    TEXT context 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Event setup crew (3 needed) · 0 of 3 filled"
    TEXT tierNote 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Sorted by trust tier — history, endorsed, new."
    INSTANCE Display/ApplicantRow 328x218 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show endorsed=true, Tier=History}
      FRAME nameRow 270x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT displayName 147x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Nethmi Jayasinghe"
        INSTANCE Display/Badge 115x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
          VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
          TEXT label 82x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Phone verified"
      FRAME trustRow 296x50 [FILL/HUG] · vertical pad 0 gap 6
        TEXT trust 296x20 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "4.6 from 12 ratings · 92% completion"
        INSTANCE endorsedBadge 108x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/endorsed 1 · r999 · of Display/Badge · {Family=Endorsed, Value=Default}
          VECTOR diamond 10x10 [FIXED/FIXED] · fill color/badge/endorsed
          TEXT label 73x16 [HUG/HUG] · fill color/badge/endorsed · mobile/caption · "Endorsed ×2"
      TEXT note 296x40 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Free all weekend — I've run event setups for two agencies and can lead a crew."
      INSTANCE Action/ListRowAction 168x48 [HUG/HUG] · horizontal pad 0 gap 12
        FRAME select 74x48 [HUG/FIXED] · horizontal pad 0/16/0/16 gap 0 · fill color/brand/primary · r8
          TEXT label 42x20 [HUG/HUG] · fill color/text/inverse · mobile/secondary · "Select"
        FRAME decline 82x48 [HUG/FIXED] · horizontal pad 0/16/0/16 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
          TEXT label 50x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Decline"
    INSTANCE Display/ApplicantRow 328x192 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show endorsed=false, Tier=EndorsedNew}
      FRAME nameRow 232x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT displayName 109x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Tharindu Silva"
        INSTANCE Display/Badge 115x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
          VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
          TEXT label 82x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Phone verified"
      FRAME trustRow 214x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT trust 117x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "New to YouthLink"
        INSTANCE Display/Badge 89x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/endorsed 1 · r999 · {Family=Endorsed, Value=Default}
          VECTOR diamond 10x10 [FIXED/FIXED] · fill color/badge/endorsed
          TEXT label 54x16 [HUG/HUG] · fill color/badge/endorsed · mobile/caption · "Endorsed"
      TEXT note 296x40 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Free from Saturday 4 AM. Strong, punctual — this would be my first gig on YouthLink."
      INSTANCE Action/ListRowAction 168x48 [HUG/HUG] · horizontal pad 0 gap 12
        FRAME select 74x48 [HUG/FIXED] · horizontal pad 0/16/0/16 gap 0 · fill color/brand/primary · r8
          TEXT label 42x20 [HUG/HUG] · fill color/text/inverse · mobile/secondary · "Select"
        FRAME decline 82x48 [HUG/FIXED] · horizontal pad 0/16/0/16 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
          TEXT label 50x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Decline"
    INSTANCE Display/ApplicantRow 328x132 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show endorsed=false, Tier=New}
      FRAME nameRow 239x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT displayName 116x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Kavindu Perera"
        INSTANCE Display/Badge 115x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
          VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
          TEXT label 82x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Phone verified"
      FRAME trustRow 117x20 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT trust 117x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "New to YouthLink"
      TEXT note 296x40 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Declined — he has been told; kept here for your records."
```

Kavindu declined; Nethmi and Tharindu pending.

### `4.9pk` — Decline dialog · Kavindu, from the pool

**Opens over** `4.5`; reached from Kavindu's Decline on every pool where he is pending  ·  **Keep in pool** → back  ·  **Decline** → `4.5dk`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Applicants"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 12
    TEXT context 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Event setup crew (3 needed) · 0 of 3 filled"
    TEXT tierNote 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Sorted by trust tier — history, endorsed, new."
    INSTANCE Display/ApplicantRow 328x218 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show endorsed=true, Tier=History}
      FRAME nameRow 270x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT displayName 147x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Nethmi Jayasinghe"
        INSTANCE Display/Badge 115x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
          VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
          TEXT label 82x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Phone verified"
      FRAME trustRow 296x50 [FILL/HUG] · vertical pad 0 gap 6
        TEXT trust 296x20 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "4.6 from 12 ratings · 92% completion"
        INSTANCE endorsedBadge 108x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/endorsed 1 · r999 · of Display/Badge · {Family=Endorsed, Value=Default}
          VECTOR diamond 10x10 [FIXED/FIXED] · fill color/badge/endorsed
          TEXT label 73x16 [HUG/HUG] · fill color/badge/endorsed · mobile/caption · "Endorsed ×2"
      TEXT note 296x40 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Free all weekend — I've run event setups for two agencies and can lead a crew."
      INSTANCE Action/ListRowAction 168x48 [HUG/HUG] · horizontal pad 0 gap 12
        FRAME select 74x48 [HUG/FIXED] · horizontal pad 0/16/0/16 gap 0 · fill color/brand/primary · r8
          TEXT label 42x20 [HUG/HUG] · fill color/text/inverse · mobile/secondary · "Select"
        FRAME decline 82x48 [HUG/FIXED] · horizontal pad 0/16/0/16 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
          TEXT label 50x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Decline"
    INSTANCE Display/ApplicantRow 328x192 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show endorsed=false, Tier=EndorsedNew}
      FRAME nameRow 232x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT displayName 109x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Tharindu Silva"
        INSTANCE Display/Badge 115x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
          VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
          TEXT label 82x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Phone verified"
      FRAME trustRow 214x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT trust 117x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "New to YouthLink"
        INSTANCE Display/Badge 89x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/endorsed 1 · r999 · {Family=Endorsed, Value=Default}
          VECTOR diamond 10x10 [FIXED/FIXED] · fill color/badge/endorsed
          TEXT label 54x16 [HUG/HUG] · fill color/badge/endorsed · mobile/caption · "Endorsed"
      TEXT note 296x40 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Free from Saturday 4 AM. Strong, punctual — this would be my first gig on YouthLink."
      INSTANCE Action/ListRowAction 168x48 [HUG/HUG] · horizontal pad 0 gap 12
        FRAME select 74x48 [HUG/FIXED] · horizontal pad 0/16/0/16 gap 0 · fill color/brand/primary · r8
          TEXT label 42x20 [HUG/HUG] · fill color/text/inverse · mobile/secondary · "Select"
        FRAME decline 82x48 [HUG/FIXED] · horizontal pad 0/16/0/16 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
          TEXT label 50x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Decline"
    INSTANCE Display/ApplicantRow 328x188 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show endorsed=false, Tier=New}
      FRAME nameRow 239x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT displayName 116x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Kavindu Perera"
        INSTANCE Display/Badge 115x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
          VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
          TEXT label 82x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Phone verified"
      FRAME trustRow 117x20 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT trust 117x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "New to YouthLink"
      TEXT note 296x40 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Available all weekend — I've done two event setups."
      INSTANCE Action/ListRowAction 168x48 [HUG/HUG] · horizontal pad 0 gap 12
        FRAME select 74x48 [HUG/FIXED] · horizontal pad 0/16/0/16 gap 0 · fill color/brand/primary · r8
          TEXT label 42x20 [HUG/HUG] · fill color/text/inverse · mobile/secondary · "Select"
        FRAME decline 82x48 [HUG/FIXED] · horizontal pad 0/16/0/16 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
          TEXT label 50x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Decline"
  RECTANGLE scrim 360x800 [FIXED/FIXED] @0,0 · fill color/overlay/scrim · opacity 40%
  INSTANCE Feedback/ConfirmDialog 328x180 [FIXED/HUG] @16,310 · vertical pad 20 gap 12 · fill color/bg/default · r12
    TEXT title 235x28 [HUG/HUG] · fill color/text/primary · mobile/title · "Decline Kavindu Perera?"
    TEXT body 288x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "He'll be notified, and this can't be undone for this posting."
    FRAME actions 288x48 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Action/Button 142x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 94x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Keep in pool"
      INSTANCE Action/Button 105x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/state/danger · r8 · {Style=Destructive, State=Default}
        TEXT label 57x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Decline"
```

Declining Kavindu from the pool.

### `4.6t` — Applicant detail · Tharindu Silva

**Reached from** Tharindu's row on `4.5`, `4.5s`, `4.5d`, `4.5sk`, `4.5dk`  ·  **Leads to** `4.7t`, `4.9t`  ·  **Exits** back → history

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Applicant"
  FRAME content 360x660 [FILL/FILL] · vertical pad 16/16/0/16 gap 12
    TEXT context 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Applied to: Event setup crew (3 needed)"
    FRAME nameRow 262x28 [HUG/HUG] · horizontal pad 0 gap 8
      TEXT displayName 139x28 [HUG/HUG] · fill color/text/primary · mobile/title · "Tharindu Silva"
      INSTANCE Display/Badge 115x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
        VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
        TEXT label 82x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Phone verified"
    TEXT endorsersNote 328x40 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "Endorsed by Roshan Dias (Reliability, Punctuality)."
    INSTANCE Display/ProfileTrustBlock 328x84 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Tier=ZeroHistory}
      FRAME headline 232x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT headline 135x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "New to YouthLink"
        INSTANCE Display/Badge 89x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/endorsed 1 · r999 · {Family=Endorsed, Value=Default}
          VECTOR diamond 10x10 [FIXED/FIXED] · fill color/badge/endorsed
          TEXT label 54x16 [HUG/HUG] · fill color/badge/endorsed · mobile/caption · "Endorsed"
      TEXT endorsedBy 99x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "1 endorsement"
    TEXT noteLabel 115x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "APPLICATION NOTE"
    TEXT note 328x40 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Free from Saturday 4 AM. Strong, punctual — this would be my first gig on YouthLink."
    FRAME spacer-grow 8x348 [FIXED/FILL]
  FRAME ctaBar 360x84 [FILL/HUG] · vertical pad 12/16/24/16 gap 8 · fill color/bg/subtle
    FRAME actions 328x48 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Action/Button 160x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
        TEXT label 49x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Select"
      INSTANCE Action/Button 160x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 57x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Decline"
```

Tharindu's detail: *"Endorsed by Roshan Dias (Reliability, Punctuality)."*, the endorsement badge in his
trust block, *1 endorsement*, and his note. An endorsement covers every application he makes
(FR-ENDORSE-06), which is why it shows here without being tied to this posting.

### `4.7t` — Confirm selection · Tharindu

**Reached from** `4.6t`, and Tharindu's Select on every pool where he is pending  ·  **Leads to** `4.8t`  ·  **Exits** back → history

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Confirm selection"
  FRAME content 360x660 [FILL/FILL] · vertical pad 20/16/0/16 gap 12
    TEXT who 328x28 [FIXED/HUG] · fill color/text/primary · mobile/title · "Select Tharindu Silva?"
    TEXT fx1 328x20 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "• An engagement is created for this gig"
    TEXT fx2 328x20 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "• You'll each see the other's contact details"
    TEXT fx3 328x20 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "• Takes one of the 3 places on this posting"
    TEXT note 328x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Anyone else who applied stays in the pool until the posting fills, expires or is withdrawn."
    FRAME spacer-grow 8x452 [FIXED/FILL]
  FRAME ctaBar 360x84 [FILL/HUG] · vertical pad 12/16/24/16 gap 8 · fill color/bg/default
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 121x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Select Tharindu"
```

Tharindu's selection confirmation.

### `4.8t` — Contact details · Tharindu

**Reached from** `4.7t`, and Tharindu's row on `4.5st`  ·  **Leads to** `4.5st`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Contact details"
  FRAME content 360x660 [FILL/FILL] · vertical pad 20/16/0/16 gap 12
    TEXT context 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Event setup crew (3 needed) · engagement active"
    TEXT phoneLabel 42x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "PHONE"
    TEXT phone 132x24 [HUG/HUG] · fill color/text/primary · mobile/body · "+94 75 345 6789"
    TEXT note 328x32 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Your number is now shared with them too, with the venue address."
    FRAME spacer-grow 328x504 [FILL/FILL]
  FRAME ctaBar 360x84 [FILL/HUG] · vertical pad 12/16/24/16 gap 8 · fill color/bg/subtle
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 141x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Back to applicants"
```

Tharindu's number.

### `4.5st` — Applicant pool · Tharindu selected

**Reached from** `4.8t`  ·  **Leads to** `4.8t` (Tharindu's row), and Nethmi's and Kavindu's row, Select and Decline  ·  **Exits** back → history

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Applicants"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 12
    TEXT context 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Event setup crew (3 needed) · 1 of 3 filled"
    TEXT tierNote 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Sorted by trust tier — history, endorsed, new."
    INSTANCE Display/ApplicantRow 328x218 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show endorsed=true, Tier=History}
      FRAME nameRow 270x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT displayName 147x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Nethmi Jayasinghe"
        INSTANCE Display/Badge 115x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
          VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
          TEXT label 82x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Phone verified"
      FRAME trustRow 296x50 [FILL/HUG] · vertical pad 0 gap 6
        TEXT trust 296x20 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "4.6 from 12 ratings · 92% completion"
        INSTANCE endorsedBadge 108x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/endorsed 1 · r999 · of Display/Badge · {Family=Endorsed, Value=Default}
          VECTOR diamond 10x10 [FIXED/FIXED] · fill color/badge/endorsed
          TEXT label 73x16 [HUG/HUG] · fill color/badge/endorsed · mobile/caption · "Endorsed ×2"
      TEXT note 296x40 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Free all weekend — I've run event setups for two agencies and can lead a crew."
      INSTANCE Action/ListRowAction 168x48 [HUG/HUG] · horizontal pad 0 gap 12
        FRAME select 74x48 [HUG/FIXED] · horizontal pad 0/16/0/16 gap 0 · fill color/brand/primary · r8
          TEXT label 42x20 [HUG/HUG] · fill color/text/inverse · mobile/secondary · "Select"
        FRAME decline 82x48 [HUG/FIXED] · horizontal pad 0/16/0/16 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
          TEXT label 50x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Decline"
    INSTANCE Display/ApplicantRow 328x136 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show endorsed=false, Tier=EndorsedNew}
      FRAME nameRow 232x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT displayName 109x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Tharindu Silva"
        INSTANCE Display/Badge 115x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
          VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
          TEXT label 82x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Phone verified"
      FRAME trustRow 214x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT trust 117x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "New to YouthLink"
        INSTANCE Display/Badge 89x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/endorsed 1 · r999 · {Family=Endorsed, Value=Default}
          VECTOR diamond 10x10 [FIXED/FIXED] · fill color/badge/endorsed
          TEXT label 54x16 [HUG/HUG] · fill color/badge/endorsed · mobile/caption · "Endorsed"
      TEXT note 296x40 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Selected — an engagement is created; contact shared both ways."
    INSTANCE Display/ApplicantRow 328x188 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show endorsed=false, Tier=New}
      FRAME nameRow 239x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT displayName 116x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Kavindu Perera"
        INSTANCE Display/Badge 115x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
          VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
          TEXT label 82x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Phone verified"
      FRAME trustRow 117x20 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT trust 117x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "New to YouthLink"
      TEXT note 296x40 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Available all weekend — I've done two event setups."
      INSTANCE Action/ListRowAction 168x48 [HUG/HUG] · horizontal pad 0 gap 12
        FRAME select 74x48 [HUG/FIXED] · horizontal pad 0/16/0/16 gap 0 · fill color/brand/primary · r8
          TEXT label 42x20 [HUG/HUG] · fill color/text/inverse · mobile/secondary · "Select"
        FRAME decline 82x48 [HUG/FIXED] · horizontal pad 0/16/0/16 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
          TEXT label 50x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Decline"
```

The pool after selecting Tharindu: his row selected; Nethmi and Kavindu pending.

### `4.9t` — Decline dialog · over Tharindu's detail

**Opens over** `4.6t`  ·  **Keep in pool** → back  ·  **Decline** → `4.5dt`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Applicant"
  FRAME content 360x660 [FILL/FILL] · vertical pad 16/16/0/16 gap 12
    TEXT context 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Applied to: Event setup crew (3 needed)"
    FRAME nameRow 262x28 [HUG/HUG] · horizontal pad 0 gap 8
      TEXT displayName 139x28 [HUG/HUG] · fill color/text/primary · mobile/title · "Tharindu Silva"
      INSTANCE Display/Badge 115x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
        VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
        TEXT label 82x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Phone verified"
    TEXT endorsersNote 328x40 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "Endorsed by Roshan Dias (Reliability, Punctuality)."
    INSTANCE Display/ProfileTrustBlock 328x84 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Tier=ZeroHistory}
      FRAME headline 232x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT headline 135x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "New to YouthLink"
        INSTANCE Display/Badge 89x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/endorsed 1 · r999 · {Family=Endorsed, Value=Default}
          VECTOR diamond 10x10 [FIXED/FIXED] · fill color/badge/endorsed
          TEXT label 54x16 [HUG/HUG] · fill color/badge/endorsed · mobile/caption · "Endorsed"
      TEXT endorsedBy 99x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "1 endorsement"
    TEXT noteLabel 115x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "APPLICATION NOTE"
    TEXT note 328x40 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Free from Saturday 4 AM. Strong, punctual — this would be my first gig on YouthLink."
    FRAME spacer-grow 8x348 [FIXED/FILL]
  FRAME ctaBar 360x84 [FILL/HUG] · vertical pad 12/16/24/16 gap 8 · fill color/bg/subtle
    FRAME actions 328x48 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Action/Button 160x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
        TEXT label 49x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Select"
      INSTANCE Action/Button 160x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 57x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Decline"
  RECTANGLE scrim 360x800 [FIXED/FIXED] @0,0 · fill color/overlay/scrim · opacity 40%
  INSTANCE Feedback/ConfirmDialog 328x180 [FIXED/HUG] @16,310 · vertical pad 20 gap 12 · fill color/bg/default · r12
    TEXT title 227x28 [HUG/HUG] · fill color/text/primary · mobile/title · "Decline Tharindu Silva?"
    TEXT body 288x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "He'll be notified, and this can't be undone for this posting."
    FRAME actions 288x48 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Action/Button 142x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 94x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Keep in pool"
      INSTANCE Action/Button 105x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/state/danger · r8 · {Style=Destructive, State=Default}
        TEXT label 57x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Decline"
```

Declining Tharindu from his detail.

### `4.5dt` — Applicant pool · Tharindu declined

**Reached from** `4.9t`, `4.9pt`  ·  **Leads to** Nethmi's and Kavindu's row, Select and Decline  ·  **Exits** back → history

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Applicants"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 12
    TEXT context 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Event setup crew (3 needed) · 0 of 3 filled"
    TEXT tierNote 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Sorted by trust tier — history, endorsed, new."
    INSTANCE Display/ApplicantRow 328x218 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show endorsed=true, Tier=History}
      FRAME nameRow 270x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT displayName 147x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Nethmi Jayasinghe"
        INSTANCE Display/Badge 115x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
          VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
          TEXT label 82x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Phone verified"
      FRAME trustRow 296x50 [FILL/HUG] · vertical pad 0 gap 6
        TEXT trust 296x20 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "4.6 from 12 ratings · 92% completion"
        INSTANCE endorsedBadge 108x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/endorsed 1 · r999 · of Display/Badge · {Family=Endorsed, Value=Default}
          VECTOR diamond 10x10 [FIXED/FIXED] · fill color/badge/endorsed
          TEXT label 73x16 [HUG/HUG] · fill color/badge/endorsed · mobile/caption · "Endorsed ×2"
      TEXT note 296x40 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Free all weekend — I've run event setups for two agencies and can lead a crew."
      INSTANCE Action/ListRowAction 168x48 [HUG/HUG] · horizontal pad 0 gap 12
        FRAME select 74x48 [HUG/FIXED] · horizontal pad 0/16/0/16 gap 0 · fill color/brand/primary · r8
          TEXT label 42x20 [HUG/HUG] · fill color/text/inverse · mobile/secondary · "Select"
        FRAME decline 82x48 [HUG/FIXED] · horizontal pad 0/16/0/16 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
          TEXT label 50x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Decline"
    INSTANCE Display/ApplicantRow 328x136 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show endorsed=false, Tier=EndorsedNew}
      FRAME nameRow 232x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT displayName 109x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Tharindu Silva"
        INSTANCE Display/Badge 115x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
          VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
          TEXT label 82x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Phone verified"
      FRAME trustRow 214x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT trust 117x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "New to YouthLink"
        INSTANCE Display/Badge 89x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/endorsed 1 · r999 · {Family=Endorsed, Value=Default}
          VECTOR diamond 10x10 [FIXED/FIXED] · fill color/badge/endorsed
          TEXT label 54x16 [HUG/HUG] · fill color/badge/endorsed · mobile/caption · "Endorsed"
      TEXT note 296x40 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Declined — he has been told; kept here for your records."
    INSTANCE Display/ApplicantRow 328x188 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show endorsed=false, Tier=New}
      FRAME nameRow 239x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT displayName 116x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Kavindu Perera"
        INSTANCE Display/Badge 115x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
          VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
          TEXT label 82x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Phone verified"
      FRAME trustRow 117x20 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT trust 117x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "New to YouthLink"
      TEXT note 296x40 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Available all weekend — I've done two event setups."
      INSTANCE Action/ListRowAction 168x48 [HUG/HUG] · horizontal pad 0 gap 12
        FRAME select 74x48 [HUG/FIXED] · horizontal pad 0/16/0/16 gap 0 · fill color/brand/primary · r8
          TEXT label 42x20 [HUG/HUG] · fill color/text/inverse · mobile/secondary · "Select"
        FRAME decline 82x48 [HUG/FIXED] · horizontal pad 0/16/0/16 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
          TEXT label 50x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Decline"
```

Tharindu declined; Nethmi and Kavindu pending.

### `4.9pt` — Decline dialog · Tharindu, from the pool

**Opens over** `4.5`; reached from Tharindu's Decline on every pool where he is pending  ·  **Keep in pool** → back  ·  **Decline** → `4.5dt`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Applicants"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 12
    TEXT context 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Event setup crew (3 needed) · 0 of 3 filled"
    TEXT tierNote 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Sorted by trust tier — history, endorsed, new."
    INSTANCE Display/ApplicantRow 328x218 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show endorsed=true, Tier=History}
      FRAME nameRow 270x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT displayName 147x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Nethmi Jayasinghe"
        INSTANCE Display/Badge 115x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
          VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
          TEXT label 82x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Phone verified"
      FRAME trustRow 296x50 [FILL/HUG] · vertical pad 0 gap 6
        TEXT trust 296x20 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "4.6 from 12 ratings · 92% completion"
        INSTANCE endorsedBadge 108x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/endorsed 1 · r999 · of Display/Badge · {Family=Endorsed, Value=Default}
          VECTOR diamond 10x10 [FIXED/FIXED] · fill color/badge/endorsed
          TEXT label 73x16 [HUG/HUG] · fill color/badge/endorsed · mobile/caption · "Endorsed ×2"
      TEXT note 296x40 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Free all weekend — I've run event setups for two agencies and can lead a crew."
      INSTANCE Action/ListRowAction 168x48 [HUG/HUG] · horizontal pad 0 gap 12
        FRAME select 74x48 [HUG/FIXED] · horizontal pad 0/16/0/16 gap 0 · fill color/brand/primary · r8
          TEXT label 42x20 [HUG/HUG] · fill color/text/inverse · mobile/secondary · "Select"
        FRAME decline 82x48 [HUG/FIXED] · horizontal pad 0/16/0/16 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
          TEXT label 50x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Decline"
    INSTANCE Display/ApplicantRow 328x192 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show endorsed=false, Tier=EndorsedNew}
      FRAME nameRow 232x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT displayName 109x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Tharindu Silva"
        INSTANCE Display/Badge 115x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
          VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
          TEXT label 82x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Phone verified"
      FRAME trustRow 214x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT trust 117x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "New to YouthLink"
        INSTANCE Display/Badge 89x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/endorsed 1 · r999 · {Family=Endorsed, Value=Default}
          VECTOR diamond 10x10 [FIXED/FIXED] · fill color/badge/endorsed
          TEXT label 54x16 [HUG/HUG] · fill color/badge/endorsed · mobile/caption · "Endorsed"
      TEXT note 296x40 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Free from Saturday 4 AM. Strong, punctual — this would be my first gig on YouthLink."
      INSTANCE Action/ListRowAction 168x48 [HUG/HUG] · horizontal pad 0 gap 12
        FRAME select 74x48 [HUG/FIXED] · horizontal pad 0/16/0/16 gap 0 · fill color/brand/primary · r8
          TEXT label 42x20 [HUG/HUG] · fill color/text/inverse · mobile/secondary · "Select"
        FRAME decline 82x48 [HUG/FIXED] · horizontal pad 0/16/0/16 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
          TEXT label 50x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Decline"
    INSTANCE Display/ApplicantRow 328x188 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show endorsed=false, Tier=New}
      FRAME nameRow 239x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT displayName 116x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Kavindu Perera"
        INSTANCE Display/Badge 115x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
          VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
          TEXT label 82x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Phone verified"
      FRAME trustRow 117x20 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT trust 117x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "New to YouthLink"
      TEXT note 296x40 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Available all weekend — I've done two event setups."
      INSTANCE Action/ListRowAction 168x48 [HUG/HUG] · horizontal pad 0 gap 12
        FRAME select 74x48 [HUG/FIXED] · horizontal pad 0/16/0/16 gap 0 · fill color/brand/primary · r8
          TEXT label 42x20 [HUG/HUG] · fill color/text/inverse · mobile/secondary · "Select"
        FRAME decline 82x48 [HUG/FIXED] · horizontal pad 0/16/0/16 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
          TEXT label 50x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Decline"
  RECTANGLE scrim 360x800 [FIXED/FIXED] @0,0 · fill color/overlay/scrim · opacity 40%
  INSTANCE Feedback/ConfirmDialog 328x180 [FIXED/HUG] @16,310 · vertical pad 20 gap 12 · fill color/bg/default · r12
    TEXT title 227x28 [HUG/HUG] · fill color/text/primary · mobile/title · "Decline Tharindu Silva?"
    TEXT body 288x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "He'll be notified, and this can't be undone for this posting."
    FRAME actions 288x48 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Action/Button 142x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 94x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Keep in pool"
      INSTANCE Action/Button 105x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/state/danger · r8 · {Style=Destructive, State=Default}
        TEXT label 57x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Decline"
```

Declining Tharindu from the pool.

### `4.5x` — Applicant pool · closed at its start

**Reached from** [M3](M3-discovery.md) `3.10e` (the three "New applicant" rows, read on Saturday)  ·  **Leads to** nothing — every row is resolved  ·  **Exits** back → history

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Applicants"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 12
    TEXT context 328x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Event setup crew (3 needed) · 1 of 3 filled · closed at its start, Sat 29 Aug 2026, 7:00 AM"
    TEXT tierNote 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Sorted by trust tier — history, endorsed, new."
    INSTANCE Display/ApplicantRow 328x162 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show endorsed=true, Tier=History}
      FRAME nameRow 270x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT displayName 147x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Nethmi Jayasinghe"
        INSTANCE Display/Badge 115x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
          VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
          TEXT label 82x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Phone verified"
      FRAME trustRow 296x50 [FILL/HUG] · vertical pad 0 gap 6
        TEXT trust 296x20 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "4.6 from 12 ratings · 92% completion"
        INSTANCE endorsedBadge 108x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/endorsed 1 · r999 · of Display/Badge · {Family=Endorsed, Value=Default}
          VECTOR diamond 10x10 [FIXED/FIXED] · fill color/badge/endorsed
          TEXT label 73x16 [HUG/HUG] · fill color/badge/endorsed · mobile/caption · "Endorsed ×2"
      TEXT note 296x40 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Selected — an engagement is created; contact shared both ways."
    INSTANCE Display/ApplicantRow 328x136 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show endorsed=false, Tier=EndorsedNew}
      FRAME nameRow 232x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT displayName 109x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Tharindu Silva"
        INSTANCE Display/Badge 115x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
          VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
          TEXT label 82x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Phone verified"
      FRAME trustRow 214x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT trust 117x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "New to YouthLink"
        INSTANCE Display/Badge 89x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/endorsed 1 · r999 · {Family=Endorsed, Value=Default}
          VECTOR diamond 10x10 [FIXED/FIXED] · fill color/badge/endorsed
          TEXT label 54x16 [HUG/HUG] · fill color/badge/endorsed · mobile/caption · "Endorsed"
      TEXT note 296x40 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Not selected — the posting closed at its start; they have been told."
    INSTANCE Display/ApplicantRow 328x132 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show endorsed=false, Tier=New}
      FRAME nameRow 239x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT displayName 116x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Kavindu Perera"
        INSTANCE Display/Badge 115x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
          VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
          TEXT label 82x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Phone verified"
      FRAME trustRow 117x20 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT trust 117x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "New to YouthLink"
      TEXT note 296x40 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Not selected — the posting closed at its start; they have been told."
```

**Saturday 29 Aug, after 7:00 AM — the pool as it closed.** Added 2026-09-23. `context` says it: *1 of 3
filled · closed at its start, Sat 29 Aug 2026, 7:00 AM*. Nethmi selected; Tharindu and Kavindu *Not
selected — the posting closed at its start; they have been told* (FR-POST-13, FR-APPLY-09). Every row is
inert: nothing is left to decide. M3's `3.10e` is read that day, so its applicant rows open this — they used
to open `4.5s`, where the two were still pending hours after the posting had closed.

## Every screen shows one moment

Each screen is one moment, and within each journey time only moves forward.

| When | Screens | What is true then |
| --- | --- | --- |
| **Thu 27 Aug, before 8:00 AM** | `4.1s`–`4.3s`, `4.1c`–`4.3cw`, `4.1h`–`4.3h` (and the branches `4.4s`/`4.3sw`, `4.4h`/`4.3hw`) | Kavindu applies for Shop assistant, Café and House cleaning, and withdraws Café |
| **Thu 27 Aug, ~7:00 AM** | `4.5b` | Lanka Events has just posted; nobody has applied |
| **Thu 27 Aug, 8:15 AM** | `4.1`–`4.3` (branch `4.4`/`4.3w`) | He applies for the Event setup crew, found through search |
| **Thu 27 Aug, ~8:40 AM onwards** | `4.5`, `4.6`–`4.9`, `4.5s`, `4.5d`, `4.9p`, and the `k` / `t` alternatives | Lanka Events opens the pool and selects Nethmi (the other selections and declines are alternative branches of the same decision) |
| **Thu 27 Aug, 8 PM** | `4.3e`, then `4.1t`–`4.3t`, `4.1d`–`4.3d`, `4.1o`–`4.3o` (branches `4.4t`/`4.3tw`, `4.4d`/`4.3dw`, `4.4o`/`4.3ow`) | The start has moved to 7:00 AM; from the evening's history he applies for tutoring, Delivery rider and Office cleaning |
| **Fri 28 Aug, morning** | `4.3n` | Three employers have declined him; the endorsement suggestion opens over the list |
| **Sat 29 Aug, about 2 AM** | `4.3nj`, then `4.3njc` | Nethmi, selected for the Event setup crew, before and just after she cancels (a branch: on the main line she works the shift) |
| **Sat 29 Aug, from 7:00 AM** | `4.3r`, `4.5x` | The Event setup crew has started and closed; every application is resolved |
| **No date** | `4.1bnr`, `4.1rst`, `4.3ldg`, `4.3z` | The failure, loading and first-run states |

**Closing dates.** A one-off gig closes at its start (FR-POST-13): Event setup crew Sat 29 Aug 2026, 5:00 AM
(7:00 AM after the edit) · Shop assistant Sat 29 Aug 2026, 8:00 AM · Office cleaning Sun 30 Aug 2026,
7:00 AM · Café service crew Fri 4 Sep 2026, 6:00 PM · House cleaning Sat 5 Sep 2026, 8:00 AM. A part-time job
closes 30 days after posting: Delivery rider (posted Tue 25 Aug) Thu 24 Sep 2026 · Grade 8 maths tutoring
(posted Thu 27 Aug) Sat 26 Sep 2026. Pay on one-off gigs is a fixed total — Shop assistant Rs 7,000 and Café
Rs 6,000 for the job — since 2026-09-23; both used to quote a daily rate.

## Application rules this module follows

| Rule | Where it shows |
| --- | --- |
| **One confirmation screen, optional note** (FR-APPLY-02) | Every `4.1*`; the note is pre-filled from the bio when there is one (FR-PROF-04) — Kavindu has none on Thursday |
| **The list shows every pending application, and every decided or withdrawn one for 30 days, with its state; pending ones with their closing date, and fill status on multi-slot postings** (FR-APPLY-12, as amended 2026-09-24) | Every `4.3*`; the window is stated in `orderNote` |
| **Pending first, soonest closing first** (FR-APPLY-12) | `orderNote` on every list; resolved rows follow |
| **Withdraw any pending application** (FR-APPLY-03) | Every pending row's Withdraw; `4.3cw` is the one taken |
| **Pool tiers: history, endorsed, new** (FR-APPLY-04, earliest application first within tiers 2 and 3 as amended 2026-09-23) | `4.5` and every pool after it |
| **What the employer sees of an applicant** (FR-APPLY-05) | Rows on `4.5*`; details `4.6`, `4.6k`, `4.6t` — aggregate stats, no case history |
| **Selection across sessions, one engagement each** (FR-APPLY-06) | `4.7*`, and the pools after one selection keeping the others actionable |
| **Contact reveal both ways; precise address to the selected worker only** (FR-APPLY-07) | `4.8`, `4.8k`, `4.8t` |
| **Explicit decline, notified at once** (FR-APPLY-08) | `4.9*`; `4.3n` on the worker's side |
| **Everything still pending resolves when the posting closes** (FR-APPLY-09) | `4.3r`, `4.5x` |
| **Pending applicants are told of a material change** (FR-APPLY-10, `APPLICATION_TERMS_CHANGED` as amended 2026-09-23) | `4.3e`, reached from M3 `3.10x` |
| **One-time endorsement suggestion after three unselected outcomes** (FR-ENDORSE-14, as amended 2026-09-23) | `4.3n` with M8 `8.7` over it |

## Rulings this module follows

- **A second action from a pool, and Withdraw on every pending row, stay wired with truthful labels even
  where the screen they land on cannot show the earlier action** (ruled on 2026-09-07, reaffirmed for this
  module on 2026-09-23). Selecting Kavindu from `4.5s` opens `4.7k`, whose next screen is `4.5sk` — the pool
  as if he were the first selection. Withdrawing Shop assistant from `4.3o` opens `4.4s`, whose backdrop is
  `4.3s`. The alternative was a frame for every combination of prior actions; the labels are never false,
  only the aftermath is simplified.
- **One accumulating list, one withdrawal.** The story withdraws Café and nothing else. Every other
  withdraw dialog and withdrawn list is a branch, kept so each pending row's Withdraw has a destination.
- **Kavindu is endorsed on Friday, not before.** Unendorsed on Thursday (`4.5`, `4.6k`); three declines
  Friday morning (`4.3n`) bring the suggestion; he shares his code; Sunil Bandara vouches; Saman Stores and
  Dilrukshi select him that afternoon. Tharindu is the endorsed newcomer, through a different verifier.
- **Shop assistant and Café stay one-off gigs with fixed totals.** The engagement screens that treat Shop
  assistant as part-time were settled in M5: End Engagement is part-time only, so those screens were deleted.

## Transitions that are not clicks

| Frame | Fires | After | To |
| --- | --- | --- | --- |
| `4.3ldg` | frame `AFTER_TIMEOUT` | 1.5 s | `4.3e` |

Marked † in the navigation lines above. The timeout is in seconds.

## What the collapsed tab bar hides

`Chrome/TabBar` reads `[standard, see header]` on every list (design-system §6). Under it, **`Role` is
Worker**, and **`Notification badge`** is `true` everywhere except `4.3z`, a brand-new account. The pool,
detail, confirmation and contact screens are the employer's and carry a `Chrome/ScreenHeader` instead.

**Tab destinations are not drawn on this page.** The demo routes the Applications tab per journey, so it
always opens the list of the same moment: `4.3` on Thursday-morning screens, `4.3o` on Thursday-evening
screens, `4.3n` on Friday's, `4.3r` everywhere after, and `4.3ldg` → `4.3e` in the loading journey. Nethmi's
screens open her own list, `4.3nj` or `4.3njc`.

## States not drawn in this module

| Not drawn | Build it from |
| --- | --- |
| The **note pre-filled from a bio** (FR-APPLY-02, FR-PROF-04) | `4.1` with `noteField`'s value set to the worker's bio, still editable, capped at 300 characters |
| A **duplicate application** blocked (FR-APPLY-02) | The listing's Apply as `{State=Disabled}` with a caption saying the worker has already applied — M3 `3.12ofl`'s disabled-with-reason pattern |
| **Reapplying after a withdrawal** (FR-APPLY-03) | `4.1` again from the listing while it is open; the list then shows the new Pending row |
| A **not-selected outcome because the posting filled or was withdrawn** | `4.3r`'s Not selected row with the reason changed — *the posting filled* / *the employer withdrew the posting* (FR-APPLY-09) |
| **Selecting the last place** | `4.7` then a pool at "3 of 3 filled", with every remaining pending applicant resolved as Not selected (FR-POST-18, FR-APPLY-09) |
| A **long pool** | `4.5`'s rows repeated; the content scrolls. FR-APPLY-11 sets no cap |
| The **worker's side of a selection** | The Selected row on `4.3r` and the engagement it opens (M5) |

## Open, and carried to the modules that own them

- *Closed 2026-09-24:* Nethmi's one-row list is true — `FR-APPLY-12` now keeps a decided or withdrawn
  application for 30 days, and every list's footer says so.

- *Closed in the M5 pass (2026-09-24):* the Shop assistant engagement no longer offers End Engagement, and
  `5.3t`, which M2's `2.11f` opens on Thursday, now shows the engagement before its start.
- *Closed in the M1 pass (2026-09-24):* Dilrukshi's and R. Gunasekara's Notifications and Profile tabs open
  their own screens ([M3](M3-discovery.md) `3.10ed`/`3.10eg`, [M1](M1-account.md) `1.18ed`/`1.18eg`).
