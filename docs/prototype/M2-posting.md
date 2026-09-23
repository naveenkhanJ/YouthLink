# M2 — Posting

**Forty-eight screens.** This is where work is offered: the posting form in its two shapes — a one-off gig in seven steps, a part-time job in eight — the confirmation, and each employer's postings with their edit, withdrawal, expiry, filled and hidden states. Three employers carry it: Lanka Events (the urgent Event setup crew), Dilrukshi Herath (a part-time tutoring job) and R. Gunasekara (a posting hidden pending review).

**Read *Every screen shows one moment* at the end first.** Lanka Events' screens are one Thursday, from the form to the evening's edit, and every count and deadline below is consistent with it.

Read `README.md` for the notation and `design-system.md` for the tokens and components. **Two pieces of chrome repeat on nearly every screen, so they read `[standard, see header]`** — the tab bar and the form's top bar. *What the collapsed chrome hides*, at the end, spells both out.

---

### `2.1` — Post a gig, title & description

**Reached from** the kept form — the Post a Gig tab on `2.10b`, and back from `2.2`  ·  **Leads to** `2.2` ("Continue"), `2.10b` (Postings tab)

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  FRAME content 360x736 [FILL/FILL] · vertical pad 6/16/16/16 gap 16
    FRAME topBarGhost 44x44 [FIXED/FIXED] · [standard, see header]
    TEXT screenTitle 115x32 [HUG/HUG] · fill color/text/primary · mobile/display · "Post a gig"
    TEXT step 61x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Step 1 of 7"
    INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Text}
      TEXT label 30x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Title"
      FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT value 304x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Event setup crew (3 needed)"
    FRAME description 328x122 [FILL/HUG] · vertical pad 0 gap 4
      TEXT descLabel 76x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Description"
      INSTANCE descField 328x98 [FILL/HUG] · vertical pad 12 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8 · of Input/TextArea · {State=Filled}
        TEXT value 302x72 [FILL/HUG] · fill color/text/primary · mobile/body · "Help set up staging and seating for a weekend event at a Colombo 04 venue. Gloves provided."
    FRAME spacer-grow 8x284 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 70x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Continue"
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Employer} · [standard, see header]
```

**Lanka Events, Thursday 27 Aug, a little before 7:00 AM.** Step 1 of the posting form (FR-POST-01's
sequence: title and description, category, arrangement, pay, location, workers needed, start). The fields
are shown **filled** — this is the moment after typing. The total says 7 because nothing yet says this is
anything but a one-off gig; the part-time path grows to 8 at step 3 (`2.3t`).

### `2.2` — Category picker

**Reached from** `2.1`, `2.1rst`  ·  **Leads to** `2.3`  ·  **Exits** back → `2.1`, ✕ → `2.10b`

```
FRAME 360x800 · vertical pad 6/16/24/16 gap 16 · fill color/bg/default
  FRAME topBar 328x44 [FILL/HUG] · horizontal pad 0 gap 0 · [standard, see header]
  TEXT screenTitle 109x32 [HUG/HUG] · fill color/text/primary · mobile/display · "Category"
  TEXT step 62x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Step 2 of 7"
  FRAME cat-Retail 328x48 [FILL/HUG] · horizontal pad 12 gap 0 · r8
    TEXT catLabel 42x24 [HUG/HUG] · fill color/text/primary · mobile/body · "Retail"
  FRAME cat-Delivery 328x48 [FILL/HUG] · horizontal pad 12 gap 0 · r8
    TEXT catLabel 62x24 [HUG/HUG] · fill color/text/primary · mobile/body · "Delivery"
  FRAME cat-Event setup 328x48 [FILL/HUG] · horizontal pad 12 gap 0 · fill color/bg/subtle · r8
    TEXT catLabel 90x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Event setup"
  FRAME cat-Moving 328x48 [FILL/HUG] · horizontal pad 12 gap 0 · r8
    TEXT catLabel 56x24 [HUG/HUG] · fill color/text/primary · mobile/body · "Moving"
  FRAME cat-Food service 328x48 [FILL/HUG] · horizontal pad 12 gap 0 · r8
    TEXT catLabel 98x24 [HUG/HUG] · fill color/text/primary · mobile/body · "Food service"
  FRAME cat-Tutoring 328x48 [FILL/HUG] · horizontal pad 12 gap 0 · r8
    TEXT catLabel 63x24 [HUG/HUG] · fill color/text/primary · mobile/body · "Tutoring"
  FRAME cat-Cleaning 328x48 [FILL/HUG] · horizontal pad 12 gap 0 · r8
    TEXT catLabel 67x24 [HUG/HUG] · fill color/text/primary · mobile/body · "Cleaning"
  FRAME spacer-grow 8x118 [FIXED/FILL]
  INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
    TEXT label 70x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Continue"
```

The seven allow-listed categories of FR-POST-02, and nothing else — there is no "Other". Event setup is selected.

### `2.3` — Arrangement type

**Reached from** `2.2`  ·  **Leads to** `2.4`  ·  **Exits** back → `2.2`, ✕ → `2.10b`

```
FRAME 360x800 · vertical pad 6/16/24/16 gap 16 · fill color/bg/default
  FRAME topBar 328x44 [FILL/HUG] · horizontal pad 0 gap 0 · [standard, see header]
  TEXT screenTitle 154x32 [HUG/HUG] · fill color/text/primary · mobile/display · "Arrangement"
  TEXT step 63x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Step 3 of 7"
  FRAME arr-One-off gig 328x48 [FILL/HUG] · horizontal pad 12 gap 0 · fill color/bg/subtle · r8
    TEXT arrLabel 88x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "One-off gig"
  FRAME arr-Part-time job 328x48 [FILL/HUG] · horizontal pad 12 gap 0 · r8
    TEXT arrLabel 100x24 [HUG/HUG] · fill color/text/primary · mobile/body · "Part-time job"
  FRAME arr-Internship 328x48 [FILL/HUG] · horizontal pad 12 gap 0 · r8
    TEXT arrLabel 76x24 [HUG/HUG] · fill color/text/primary · mobile/body · "Internship"
  FRAME spacer-grow 8x374 [FIXED/FILL]
  INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
    TEXT label 70x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Continue"
```

Gig, part-time job or internship (FR-POST-01). The choice decides the pay format on the next step (FR-POST-04) and whether a Schedule step follows (FR-POST-03).

### `2.4` — Pay entry

**Reached from** `2.3`  ·  **Leads to** `2.6` — a gig has no Schedule step  ·  **Exits** back → `2.3`, ✕ → `2.10b`

```
FRAME 360x800 · vertical pad 6/16/24/16 gap 16 · fill color/bg/default
  FRAME topBar 328x44 [FILL/HUG] · horizontal pad 0 gap 0 · [standard, see header]
  TEXT screenTitle 43x32 [HUG/HUG] · fill color/text/primary · mobile/display · "Pay"
  TEXT step 63x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Step 4 of 7"
  INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Text}
    TEXT label 175x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Fixed total per worker (Rs)"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
      TEXT value 304x24 [FILL/HUG] · fill color/text/primary · mobile/body · "6,000"
  TEXT perWorkerHelper 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Each selected worker earns this amount."
  FRAME spacer-grow 8x442 [FIXED/FILL]
  INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
    TEXT label 70x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Continue"
```

**A gig accepts a fixed total and nothing else** (FR-POST-04). One field, labelled for what it is — a
fixed total per worker — and the helper saying each selected worker earns it (the per-worker rule of the
same requirement). Until 2026-09-23 this step offered Rate, Unpaid, Stipend and Paid as well; those belong
to part-time jobs and internships.

### `2.6` — Location picker

**Reached from** `2.4`  ·  **Leads to** `2.7`  ·  **Exits** back → `2.4`, ✕ → `2.10b`

```
FRAME 360x800 · vertical pad 6/16/24/16 gap 16 · fill color/bg/default
  FRAME topBar 328x44 [FILL/HUG] · horizontal pad 0 gap 0 · [standard, see header]
  TEXT screenTitle 101x32 [HUG/HUG] · fill color/text/primary · mobile/display · "Location"
  TEXT step 63x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Step 5 of 7"
  INSTANCE Display/MapArea 328x160 [FIXED/FIXED] · fill color/bg/subtle · stroke color/border/default 1 · r8 · {Kind=PrecisePin}
    LINE grid-h1 328x0 [FIXED/FIXED] @0,40 · stroke color/border/default 1
    LINE grid-h2 328x0 [FIXED/FIXED] @0,80 · stroke color/border/default 1
    LINE grid-h3 328x0 [FIXED/FIXED] @0,120 · stroke color/border/default 1
    LINE grid-v1 160x0 [FIXED/FIXED] @66,0 · stroke color/border/default 1
    LINE grid-v2 160x0 [FIXED/FIXED] @132,0 · stroke color/border/default 1
    LINE grid-v3 160x0 [FIXED/FIXED] @198,0 · stroke color/border/default 1
    LINE grid-v4 160x0 [FIXED/FIXED] @264,0 · stroke color/border/default 1
    VECTOR pin 24x32 [FIXED/FIXED] @152,48 · fill color/brand/primary
    ELLIPSE pinDot 8x8 [FIXED/FIXED] @160,56 · fill color/bg/subtle
  INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Text}
    TEXT label 55x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Address"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
      TEXT value 304x24 [FILL/HUG] · fill color/text/primary · mobile/body · "23 Temple Road, Colombo 04"
  TEXT areaNote 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Shown to workers as: Colombo 04 area"
  FRAME spacer-grow 8x270 [FIXED/FILL]
  INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
    TEXT label 70x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Continue"
```

`Display/MapArea {Kind=PrecisePin}` over the address field: the employer enters the precise address, and
`areaNote` says what workers will see instead — "Colombo 04 area" (FR-POST-08).

### `2.7` — Workers needed

**Reached from** `2.6`  ·  **Leads to** `2.8`  ·  **Exits** back → `2.6`, ✕ → `2.10b`

```
FRAME 360x800 · vertical pad 6/16/24/16 gap 16 · fill color/bg/default
  FRAME topBar 328x44 [FILL/HUG] · horizontal pad 0 gap 0 · [standard, see header]
  TEXT screenTitle 191x32 [HUG/HUG] · fill color/text/primary · mobile/display · "Workers needed"
  TEXT step 63x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Step 6 of 7"
  INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Text}
    TEXT label 109x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Workers needed"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
      TEXT value 304x24 [FILL/HUG] · fill color/text/primary · mobile/body · "3"
  TEXT rangeNote 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "A whole number between 1 and 20."
  FRAME spacer-grow 8x446 [FIXED/FILL]
  INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
    TEXT label 70x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Continue"
```

FR-POST-06: a whole number from 1 to 20, the range stated under the field.

### `2.8` — Start date & time

**Reached from** `2.7`, `2.8err` (a later time chosen)  ·  **Leads to** `2.9` ("Review posting")  ·  **Exits** back → `2.7`, ✕ → `2.10b`

```
FRAME 360x800 · vertical pad 6/16/24/16 gap 16 · fill color/bg/default
  FRAME topBar 328x44 [FILL/HUG] · horizontal pad 0 gap 0 · [standard, see header]
  TEXT screenTitle 58x32 [HUG/HUG] · fill color/text/primary · mobile/display · "Start"
  TEXT step 62x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Step 7 of 7"
  INSTANCE Input/DateTimeField 328x74 [FIXED/HUG] · vertical pad 0 gap 6 · {State=Filled}
    TEXT label 112x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Start date & time"
    FRAME field 328x48 [FILL/HUG] · horizontal pad 12 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
      TEXT value 292x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Sat 29 Aug 2026, 5:00 AM"
      VECTOR calendar 12x12 [FIXED/FIXED] · stroke color/text/secondary 1.5
  TEXT leadNote 328x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "At least 2 hours from now, so workers have time to apply."
  FRAME spacer-grow 8x420 [FIXED/FILL]
  INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
    TEXT label 117x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Review posting"
```

The start is **Sat 29 Aug 2026, 5:00 AM**, about 46 hours after the gig goes live at 7:00 AM on
Thursday — inside the 48 hours that make it urgent (FR-POST-07). `leadNote` states the 2-hour minimum of
FR-POST-05 before anyone breaks it; `2.8err` is what happens if they do.

### `2.9` — Review before submit

**Reached from** `2.8`  ·  **Leads to** `2.9e` ("Post gig")  ·  **Exits** back → `2.8`, ✕ → `2.10b`

```
FRAME 360x800 · vertical pad 6/16/24/16 gap 10 · fill color/bg/default
  FRAME topBar 328x50 [FILL/HUG] · horizontal pad 0/0/6/0 gap 0 · [standard, see header]
  TEXT screenTitle 236x32 [HUG/HUG] · fill color/text/primary · mobile/display · "Review your posting"
  TEXT reviewNote 328x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "This is the only place the whole posting is visible before it goes live."
  FRAME rev-Title 328x20 [FILL/HUG] · horizontal pad 0 gap 12
    TEXT revLabel 96x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Title"
    TEXT revValue 220x20 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Event setup crew (3 needed)"
  FRAME rev-Description 328x80 [FILL/HUG] · horizontal pad 0 gap 12
    TEXT revLabel 96x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Description"
    TEXT revValue 220x80 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Help set up staging and seating for a weekend event at a Colombo 04 venue. Gloves provided."
  FRAME rev-Category 328x20 [FILL/HUG] · horizontal pad 0 gap 12
    TEXT revLabel 96x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Category"
    TEXT revValue 220x20 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Event setup"
  FRAME rev-Type 328x20 [FILL/HUG] · horizontal pad 0 gap 12
    TEXT revLabel 96x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Type"
    TEXT revValue 220x20 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "One-off gig"
  FRAME rev-Pay 328x20 [FILL/HUG] · horizontal pad 0 gap 12
    TEXT revLabel 96x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Pay"
    TEXT revValue 220x20 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Rs 6,000 per worker"
  FRAME rev-Total 328x20 [FILL/HUG] · horizontal pad 0 gap 12
    TEXT revLabel 96x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Total"
    TEXT revValue 220x20 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Rs 18,000 for 3 workers"
  FRAME rev-Address 328x20 [FILL/HUG] · horizontal pad 0 gap 12
    TEXT revLabel 96x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Address"
    TEXT revValue 220x20 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "23 Temple Road, Colombo 04"
  FRAME rev-Area 328x20 [FILL/HUG] · horizontal pad 0 gap 12
    TEXT revLabel 96x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Area shown"
    TEXT revValue 220x20 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Colombo 04 area"
  FRAME rev-Start 328x20 [FILL/HUG] · horizontal pad 0 gap 12
    TEXT revLabel 96x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Start"
    TEXT revValue 220x20 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Sat 29 Aug 2026, 5:00 AM"
  FRAME rev-Urgency 328x40 [FILL/HUG] · horizontal pad 0 gap 12
    TEXT revLabel 96x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Urgency"
    TEXT revValue 220x40 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Urgent — starts within 48 hours (set automatically)"
  FRAME rev-Workers 328x20 [FILL/HUG] · horizontal pad 0 gap 12
    TEXT revLabel 96x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Workers"
    TEXT revValue 220x20 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "3"
  FRAME rev-Posting as 328x40 [FILL/HUG] · horizontal pad 0 gap 12
    TEXT revLabel 96x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Posting as"
    TEXT revValue 220x40 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Lanka Events (Pvt) Ltd — Business"
  FRAME spacer-grow 8x100 [FIXED/FILL]
  INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
    TEXT label 63x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Post gig"
```

**Every entered field, plus the two computed previews** FR-POST-09 asks for: the precise address with
the area workers will be shown ("Area shown"), and the urgency, marked *set automatically* because no one
can toggle it (FR-POST-07). The description and the address rows were added on 2026-09-23 — `reviewNote`
promised "the whole posting" and the screen had not shown it. Total = Rs 6,000 × 3 workers = Rs 18,000.

### `2.1t` — Post a gig, title & description · tutoring (part-time)

**Reached from** the kept form — the Post a Gig tab on `2.10db`, and back from `2.2t`  ·  **Leads to** `2.2t`, `2.10db` (Postings tab)

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  FRAME content 360x736 [FILL/FILL] · vertical pad 6/16/16/16 gap 16
    FRAME topBarGhost 44x44 [FIXED/FIXED] · [standard, see header]
    TEXT screenTitle 115x32 [HUG/HUG] · fill color/text/primary · mobile/display · "Post a gig"
    TEXT step 61x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Step 1 of 7"
    INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Text}
      TEXT label 30x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Title"
      FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT value 304x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Grade 8 maths tutoring"
    FRAME description 328x122 [FILL/HUG] · vertical pad 0 gap 4
      TEXT descLabel 76x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Description"
      INSTANCE descField 328x98 [FILL/HUG] · vertical pad 12 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8 · of Input/TextArea · {State=Filled}
        TEXT value 302x72 [FILL/HUG] · fill color/text/primary · mobile/body · "Weekday afternoon maths tutoring for my daughter (Grade 8), at our home in Dehiwala."
    FRAME spacer-grow 8x284 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 70x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Continue"
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Employer} · [standard, see header]
```

**Dilrukshi Herath, Thursday 27 Aug, a little before 6:00 PM** — the part-time tutoring job Kavindu
applies for that evening (its new-gig row in his 8 PM history, M3 `3.10x`, reads "2h ago"). "Step 1 of 7", like every posting at this point: the arrangement is chosen on step 3.

### `2.2t` — Category picker · tutoring

**Reached from** `2.1t`  ·  **Leads to** `2.3t`  ·  **Exits** back → `2.1t`, ✕ → `2.10db`

```
FRAME 360x800 · vertical pad 6/16/24/16 gap 16 · fill color/bg/default
  FRAME topBar 328x44 [FILL/HUG] · horizontal pad 0 gap 0 · [standard, see header]
  TEXT screenTitle 109x32 [HUG/HUG] · fill color/text/primary · mobile/display · "Category"
  TEXT step 62x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Step 2 of 7"
  FRAME cat-Retail 328x48 [FILL/HUG] · horizontal pad 12 gap 0 · r8
    TEXT catLabel 42x24 [HUG/HUG] · fill color/text/primary · mobile/body · "Retail"
  FRAME cat-Delivery 328x48 [FILL/HUG] · horizontal pad 12 gap 0 · r8
    TEXT catLabel 62x24 [HUG/HUG] · fill color/text/primary · mobile/body · "Delivery"
  FRAME cat-Event setup 328x48 [FILL/HUG] · horizontal pad 12 gap 0 · r8
    TEXT catLabel 90x24 [HUG/HUG] · fill color/text/primary · mobile/body · "Event setup"
  FRAME cat-Moving 328x48 [FILL/HUG] · horizontal pad 12 gap 0 · r8
    TEXT catLabel 56x24 [HUG/HUG] · fill color/text/primary · mobile/body · "Moving"
  FRAME cat-Food service 328x48 [FILL/HUG] · horizontal pad 12 gap 0 · r8
    TEXT catLabel 98x24 [HUG/HUG] · fill color/text/primary · mobile/body · "Food service"
  FRAME cat-Tutoring 328x48 [FILL/HUG] · horizontal pad 12 gap 0 · fill color/bg/subtle · r8
    TEXT catLabel 63x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Tutoring"
  FRAME cat-Cleaning 328x48 [FILL/HUG] · horizontal pad 12 gap 0 · r8
    TEXT catLabel 67x24 [HUG/HUG] · fill color/text/primary · mobile/body · "Cleaning"
  FRAME spacer-grow 8x118 [FIXED/FILL]
  INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
    TEXT label 70x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Continue"
```

Tutoring is selected. Still "of 7" — see `2.1t`.

### `2.3t` — Arrangement type · part-time

**Reached from** `2.2t`  ·  **Leads to** `2.4t`  ·  **Exits** back → `2.2t`, ✕ → `2.10db`

```
FRAME 360x800 · vertical pad 6/16/24/16 gap 16 · fill color/bg/default
  FRAME topBar 328x44 [FILL/HUG] · horizontal pad 0 gap 0 · [standard, see header]
  TEXT screenTitle 154x32 [HUG/HUG] · fill color/text/primary · mobile/display · "Arrangement"
  TEXT step 63x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Step 3 of 8"
  FRAME arr-One-off gig 328x48 [FILL/HUG] · horizontal pad 12 gap 0 · r8
    TEXT arrLabel 88x24 [HUG/HUG] · fill color/text/primary · mobile/body · "One-off gig"
  FRAME arr-Part-time job 328x48 [FILL/HUG] · horizontal pad 12 gap 0 · fill color/bg/subtle · r8
    TEXT arrLabel 100x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Part-time job"
  FRAME arr-Internship 328x48 [FILL/HUG] · horizontal pad 12 gap 0 · r8
    TEXT arrLabel 76x24 [HUG/HUG] · fill color/text/primary · mobile/body · "Internship"
  FRAME spacer-grow 8x374 [FIXED/FILL]
  INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
    TEXT label 70x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Continue"
```

Part-time job is chosen **on this screen**, and the total becomes 8 here: the part-time path carries the Schedule step (FR-POST-03).

### `2.4t` — Pay entry · rate

**Reached from** `2.3t`  ·  **Leads to** `2.5`  ·  **Exits** back → `2.3t`, ✕ → `2.10db`

```
FRAME 360x800 · vertical pad 6/16/24/16 gap 16 · fill color/bg/default
  FRAME topBar 328x44 [FILL/HUG] · horizontal pad 0 gap 0 · [standard, see header]
  TEXT screenTitle 43x32 [HUG/HUG] · fill color/text/primary · mobile/display · "Pay"
  TEXT step 63x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Step 4 of 8"
  INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Text}
    TEXT label 136x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Rate per worker (Rs)"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
      TEXT value 304x24 [FILL/HUG] · fill color/text/primary · mobile/body · "1,800"
  FRAME rateUnit 328x48 [FIXED/HUG] · horizontal pad 0 gap 8
    INSTANCE Input/Chip 86x48 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · fill color/brand/primary · r999 · {Kind=Select, State=Selected}
      TEXT label 58x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Per day"
    INSTANCE Input/Chip 90x40 [HUG/HUG] · horizontal pad 10/14/10/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
      TEXT label 62x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Per week"
    INSTANCE Input/Chip 97x40 [HUG/HUG] · horizontal pad 10/14/10/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
      TEXT label 69x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Per month"
  TEXT perWorkerHelper 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Each selected worker earns this rate."
  FRAME spacer-grow 8x378 [FIXED/FILL]
  INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
    TEXT label 70x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Continue"
```

**A part-time job takes a rate with a day, week or month unit** (FR-POST-04) — `rateUnit` is three
`Input/Chip {Kind=Select}` with *Per day* selected, placed under the amount. The selected chip is 48 px
tall and the others 40 px: that is the component's two variants, not a layout choice. No internship
options (Unpaid, Stipend, Paid) and no promise about when payment happens — pay changes hands outside the
app, and no field records it.

### `2.5` — Schedule

**Reached from** `2.4t`  ·  **Leads to** `2.6t`  ·  **Exits** back → `2.4t`, ✕ → `2.10db`

```
FRAME 360x800 · vertical pad 6/16/24/16 gap 16 · fill color/bg/default
  FRAME topBar 328x44 [FILL/HUG] · horizontal pad 0 gap 0 · [standard, see header]
  TEXT screenTitle 109x32 [HUG/HUG] · fill color/text/primary · mobile/display · "Schedule"
  TEXT step 63x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Step 5 of 8"
  TEXT kNote 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Part-time jobs and internships only."
  INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Text}
    TEXT label 62x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Schedule"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
      TEXT value 304x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Mon, Wed, Fri — 4 to 6 pm"
  FRAME spacer-grow 8x446 [FIXED/FILL]
  INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
    TEXT label 70x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Continue"
```

The Schedule step (FR-POST-03): free text up to 200 characters, required for part-time jobs and internships only, as `kNote` says.

### `2.6t` — Location picker · Dehiwala

**Reached from** `2.5`  ·  **Leads to** `2.7t`  ·  **Exits** back → `2.5`, ✕ → `2.10db`

```
FRAME 360x800 · vertical pad 6/16/24/16 gap 16 · fill color/bg/default
  FRAME topBar 328x44 [FILL/HUG] · horizontal pad 0 gap 0 · [standard, see header]
  TEXT screenTitle 101x32 [HUG/HUG] · fill color/text/primary · mobile/display · "Location"
  TEXT step 63x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Step 6 of 8"
  INSTANCE Display/MapArea 328x160 [FIXED/FIXED] · fill color/bg/subtle · stroke color/border/default 1 · r8 · {Kind=PrecisePin}
    LINE grid-h1 328x0 [FIXED/FIXED] @0,40 · stroke color/border/default 1
    LINE grid-h2 328x0 [FIXED/FIXED] @0,80 · stroke color/border/default 1
    LINE grid-h3 328x0 [FIXED/FIXED] @0,120 · stroke color/border/default 1
    LINE grid-v1 160x0 [FIXED/FIXED] @66,0 · stroke color/border/default 1
    LINE grid-v2 160x0 [FIXED/FIXED] @132,0 · stroke color/border/default 1
    LINE grid-v3 160x0 [FIXED/FIXED] @198,0 · stroke color/border/default 1
    LINE grid-v4 160x0 [FIXED/FIXED] @264,0 · stroke color/border/default 1
    VECTOR pin 24x32 [FIXED/FIXED] @152,48 · fill color/brand/primary
    ELLIPSE pinDot 8x8 [FIXED/FIXED] @160,56 · fill color/bg/subtle
  INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Text}
    TEXT label 55x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Address"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
      TEXT value 304x24 [FILL/HUG] · fill color/text/primary · mobile/body · "12 Hill Street, Dehiwala"
  TEXT areaNote 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Shown to workers as: Dehiwala area"
  FRAME spacer-grow 8x270 [FIXED/FILL]
  INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
    TEXT label 70x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Continue"
```

The same picker; workers will see "Dehiwala area".

### `2.7t` — Workers needed · 1

**Reached from** `2.6t`  ·  **Leads to** `2.8t`  ·  **Exits** back → `2.6t`, ✕ → `2.10db`

```
FRAME 360x800 · vertical pad 6/16/24/16 gap 16 · fill color/bg/default
  FRAME topBar 328x44 [FILL/HUG] · horizontal pad 0 gap 0 · [standard, see header]
  TEXT screenTitle 191x32 [HUG/HUG] · fill color/text/primary · mobile/display · "Workers needed"
  TEXT step 63x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Step 7 of 8"
  INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Text}
    TEXT label 109x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Workers needed"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
      TEXT value 304x24 [FILL/HUG] · fill color/text/primary · mobile/body · "1"
  TEXT rangeNote 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "A whole number between 1 and 20."
  FRAME spacer-grow 8x446 [FIXED/FILL]
  INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
    TEXT label 70x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Continue"
```

### `2.8t` — Start date & time · tutoring

**Reached from** `2.7t`  ·  **Leads to** `2.9t`  ·  **Exits** back → `2.7t`, ✕ → `2.10db`

```
FRAME 360x800 · vertical pad 6/16/24/16 gap 16 · fill color/bg/default
  FRAME topBar 328x44 [FILL/HUG] · horizontal pad 0 gap 0 · [standard, see header]
  TEXT screenTitle 58x32 [HUG/HUG] · fill color/text/primary · mobile/display · "Start"
  TEXT step 63x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Step 8 of 8"
  INSTANCE Input/DateTimeField 328x74 [FIXED/HUG] · vertical pad 0 gap 6 · {State=Filled}
    TEXT label 112x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Start date & time"
    FRAME field 328x48 [FILL/HUG] · horizontal pad 12 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
      TEXT value 292x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Mon 7 Sep 2026, 4:00 PM"
      VECTOR calendar 12x12 [FIXED/FIXED] · stroke color/text/secondary 1.5
  TEXT leadNote 328x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "At least 2 hours from now, so workers have time to apply."
  FRAME spacer-grow 8x420 [FIXED/FILL]
  INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
    TEXT label 117x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Review posting"
```

### `2.9t` — Review before submit · tutoring

**Reached from** `2.8t`  ·  **Leads to** `2.9et` ("Post gig")  ·  **Exits** back → `2.8t`, ✕ → `2.10db`

```
FRAME 360x800 · vertical pad 6/16/24/16 gap 10 · fill color/bg/default
  FRAME topBar 328x50 [FILL/HUG] · horizontal pad 0/0/6/0 gap 0 · [standard, see header]
  TEXT screenTitle 236x32 [HUG/HUG] · fill color/text/primary · mobile/display · "Review your posting"
  TEXT reviewNote 328x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "This is the only place the whole posting is visible before it goes live."
  FRAME rev-Title 328x20 [FILL/HUG] · horizontal pad 0 gap 12
    TEXT revLabel 96x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Title"
    TEXT revValue 220x20 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Grade 8 maths tutoring"
  FRAME rev-Description 328x60 [FILL/HUG] · horizontal pad 0 gap 12
    TEXT revLabel 96x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Description"
    TEXT revValue 220x60 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Weekday afternoon maths tutoring for my daughter (Grade 8), at our home in Dehiwala."
  FRAME rev-Category 328x20 [FILL/HUG] · horizontal pad 0 gap 12
    TEXT revLabel 96x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Category"
    TEXT revValue 220x20 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Tutoring"
  FRAME rev-Type 328x40 [FILL/HUG] · horizontal pad 0 gap 12
    TEXT revLabel 96x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Type"
    TEXT revValue 220x40 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Part-time job · Mon, Wed, Fri — 4 to 6 pm"
  FRAME rev-Pay 328x20 [FILL/HUG] · horizontal pad 0 gap 12
    TEXT revLabel 96x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Pay"
    TEXT revValue 220x20 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Rs 1,800 per day"
  FRAME rev-Total 328x20 [FILL/HUG] · horizontal pad 0 gap 12
    TEXT revLabel 96x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Total"
    TEXT revValue 220x20 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Rs 1,800 per day · ongoing"
  FRAME rev-Address 328x20 [FILL/HUG] · horizontal pad 0 gap 12
    TEXT revLabel 96x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Address"
    TEXT revValue 220x20 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "12 Hill Street, Dehiwala"
  FRAME rev-Area 328x20 [FILL/HUG] · horizontal pad 0 gap 12
    TEXT revLabel 96x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Area shown"
    TEXT revValue 220x20 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Dehiwala area"
  FRAME rev-Start 328x20 [FILL/HUG] · horizontal pad 0 gap 12
    TEXT revLabel 96x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Start"
    TEXT revValue 220x20 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Mon 7 Sep 2026, 4:00 PM"
  FRAME rev-Urgency 328x40 [FILL/HUG] · horizontal pad 0 gap 12
    TEXT revLabel 96x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Urgency"
    TEXT revValue 220x40 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Not urgent — starts in more than 48 hours (set automatically)"
  FRAME rev-Workers 328x20 [FILL/HUG] · horizontal pad 0 gap 12
    TEXT revLabel 96x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Workers"
    TEXT revValue 220x20 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "1"
  FRAME rev-Posting as 328x40 [FILL/HUG] · horizontal pad 0 gap 12
    TEXT revLabel 96x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Posting as"
    TEXT revValue 220x40 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Dilrukshi Herath — Individual/Household"
  FRAME spacer-grow 8x100 [FIXED/FILL]
  INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
    TEXT label 63x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Post gig"
```

The part-time review. Type carries the schedule; Total reads "per day · ongoing" because a
part-time job has no end date; urgency is **Not urgent** — Mon 7 Sep is well over 48 hours away.

### `2.1n` — Post a gig, title & description · blank

**Reached from** the Post a Gig tab on every list whose gig is already posted (`2.10`, `2.10p`, `2.10w`, `2.10d`, `2.10dw`, `2.10g`, `2.10z`), `2.10z` ("Post a gig"), `2.11ex` ("Post a new gig"), [M1](M1-account.md) `1.5`/`1.5b` ("Continue", a new business account), [M3](M3-discovery.md) `3.10ez` and [M5](M5-engagement.md) `5.1ez` ("Post a gig")  ·  **Leads to** nothing until a title and description are entered — Continue is disabled  ·  `2.10` (Postings tab)

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  FRAME content 360x736 [FILL/FILL] · vertical pad 6/16/16/16 gap 16
    FRAME topBarGhost 44x44 [FIXED/FIXED] · [standard, see header]
    TEXT screenTitle 115x32 [HUG/HUG] · fill color/text/primary · mobile/display · "Post a gig"
    TEXT step 61x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Step 1 of 7"
    INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Default, Type=Text}
      TEXT label 30x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Title"
      FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT value 304x24 [FILL/HUG] · fill color/text/secondary · mobile/body · "e.g. Event setup crew (3 needed)"
    FRAME description 328x120 [FILL/HUG] · vertical pad 0 gap 4
      TEXT descLabel 76x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Description"
      INSTANCE descField 328x96 [FILL/HUG] · vertical pad 12 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8 · of Input/TextArea · {State=Default}
        TEXT placeholder 302x48 [FILL/HUG] · fill color/text/secondary · mobile/body · "What the work involves, and anything to bring"
    TEXT fillHint 328x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "Fill in a title and a description to continue."
    FRAME spacer-grow 8x254 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/subtle · stroke color/border/default 1 · r8 · {Style=Primary, State=Disabled}
      TEXT label 70x24 [HUG/HUG] · fill color/text/secondary · mobile/body-medium · "Continue"
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Employer} · [standard, see header]
```

**The blank form** — added 2026-09-23. It is where Post a Gig goes from any list whose gig already
exists, so the form never reopens with a posting the employer has just published. Placeholders are
`color/text/secondary`; Continue is `{State=Disabled}` and `fillHint` says why (the Action/Button rule that
a disabled button states its reason on screen). A brand-new business account (M1) lands here too.

### `2.10b` — My postings · before posting the Event setup crew

**Reached from** ✕ on `2.2`–`2.9`, `2.8err`, `2.9bnr`, and the Postings tab on `2.1`, `2.1rst`  ·  **Leads to** `2.11f`, `2.11ex` (cards), `2.1` (Post a Gig tab — the kept form)

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    TEXT screenTitle 143x32 [HUG/HUG] · fill color/text/primary · mobile/display · "My postings"
    FRAME posting-Filled 328x70 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 229x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Stage crew — Friday setup"
        INSTANCE Display/Badge 63x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Posting, Value=Filled}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 31x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Filled"
      TEXT meta 174x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "1 of 1 filled · Starts Fri 8:00 AM"
    FRAME posting-Expired 328x70 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 217x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Event teardown — Sunday"
        INSTANCE Display/Badge 75x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/text/secondary
          TEXT label 43x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Expired"
      TEXT meta 192x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "0 of 2 filled · Expired 16 Aug 2026"
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Employer} · [standard, see header]
```

**Lanka Events' list before the Event setup crew exists** — added 2026-09-23. Leaving the form with ✕
or the Postings tab used to land on `2.10`, which already listed the unposted gig with applicants. The
form is kept on the device (FR-POST-15 as amended for E9), so this list's Post a Gig tab returns to it.

### `2.10db` — My postings · Dilrukshi Herath, before posting

**Reached from** ✕ on `2.2t`–`2.9t`, and the Postings tab on `2.1t`  ·  **Leads to** `2.11hx` (card), `2.1t` (Post a Gig tab — the kept form)

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    TEXT screenTitle 143x32 [HUG/HUG] · fill color/text/primary · mobile/display · "My postings"
    FRAME posting-Expired 328x70 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 217x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "House move helpers"
        INSTANCE Display/Badge 75x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/text/secondary
          TEXT label 43x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Expired"
      TEXT meta 190x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "0 of 1 filled · Expired 12 Aug 2026"
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Employer} · [standard, see header]
```

Dilrukshi's list before the tutoring posting exists: only her expired House move helpers. Post a Gig returns to her kept form.

### `2.9e` — Review before submit · posting published

**Reached from** `2.9` and `2.9bnr` ("Post gig")  ·  **Leads to** `2.10p` ("View my postings")

```
FRAME 360x800 · absolute · fill color/bg/subtle
  FRAME content 360x800 [FIXED/FIXED] @0,0 · vertical pad 0/24/0/24 gap 14
    FRAME successGlyph 56x56 [FIXED/FIXED]
      ELLIPSE Ellipse 56x56 [FIXED/FIXED] @0,0 · stroke color/state/success 3
      VECTOR Vector 26x19 [FIXED/FIXED] @15,19 · stroke color/state/success 3.5
    TEXT cTitle 300x32 [FIXED/HUG] · fill color/text/primary · mobile/display · align center · "Your gig is live"
    TEXT cBody 300x96 [FIXED/HUG] · fill color/text/secondary · mobile/body · align center · "It starts within 48 hours, so it was marked urgent — an urgent push went out to opted-in youth nearby, and it's flagged in Browse."
    INSTANCE Action/Button 184x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 136x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "View my postings"
```

**Thursday, about 7:00 AM.** Absolute-positioned confirmation. Urgent because the start is 46 hours
away, so the urgent push goes out to opted-in youth nearby (FR-POST-10, FR-NOTIF-01) — the push Kavindu
finds in his Thursday history (M3 `3.10x`).

### `2.9et` — Review before submit · posting published, not urgent

**Reached from** `2.9t` ("Post gig")  ·  **Leads to** `2.10d` ("View my postings")

```
FRAME 360x800 · absolute · fill color/bg/subtle
  FRAME content 360x800 [FIXED/FIXED] @0,0 · vertical pad 0/24/0/24 gap 14
    FRAME successGlyph 56x56 [FIXED/FIXED]
      ELLIPSE Ellipse 56x56 [FIXED/FIXED] @0,0 · stroke color/state/success 3
      VECTOR Vector 26x19 [FIXED/FIXED] @15,19 · stroke color/state/success 3.5
    TEXT cTitle 300x32 [FIXED/HUG] · fill color/text/primary · mobile/display · align center · "Your gig is live"
    TEXT cBody 300x96 [FIXED/HUG] · fill color/text/secondary · mobile/body · align center · "It starts in more than 48 hours, so it's listed normally — youth nearby see it in Browse, and a new-gig alert goes to those who haven't turned them off."
    INSTANCE Action/Button 184x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 136x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "View my postings"
```

The not-urgent confirmation: listed normally, with the new-gig alert for youth who have not turned it off (FR-POST-10, FR-NOTIF-02).

### `2.10p` — My postings · just posted, no applicants yet

**Reached from** `2.9e`  ·  **Leads to** `2.11p`, `2.11f`, `2.11ex` (cards), `2.1n` (Post a Gig tab)

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    TEXT screenTitle 143x32 [HUG/HUG] · fill color/text/primary · mobile/display · "My postings"
    FRAME posting-Open 328x70 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 229x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Event setup crew (3 needed)"
        INSTANCE Display/Badge 63x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/state/success
          TEXT label 31x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Open"
      TEXT meta 289x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "0 of 3 filled · Starts Sat 5:00 AM · no applicants yet"
    FRAME posting-Filled 328x70 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 229x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Stage crew — Friday setup"
        INSTANCE Display/Badge 63x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Posting, Value=Filled}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 31x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Filled"
      TEXT meta 174x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "1 of 1 filled · Starts Fri 8:00 AM"
    FRAME posting-Expired 328x70 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 217x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Event teardown — Sunday"
        INSTANCE Display/Badge 75x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/text/secondary
          TEXT label 43x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Expired"
      TEXT meta 192x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "0 of 2 filled · Expired 16 Aug 2026"
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Employer} · [standard, see header]
```

**Just posted.** The Event setup crew at 0 of 3, no applicants yet. The other two cards are
Lanka Events' history: Stage crew (Filled, Fri 28 Aug) and Event teardown (Expired 16 Aug).

### `2.11p` — Posting detail, owner view · just posted, no applicants

**Reached from** `2.10p`, and back from [M4](M4-applying.md) `4.5b`  ·  **Leads to** [M4](M4-applying.md) `4.5b` ("No applicants yet — view pool"), `2.11pe` ("Edit posting"), `2.11pw` ("Withdraw")  ·  **Exits** back → `2.10p`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Posting"
  FRAME content 360x744 [FILL/FILL] · vertical pad 20/16/24/16 gap 12
    FRAME titleRow 328x24 [FILL/HUG] · horizontal pad 0 gap 8
      TEXT title 257x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Event setup crew (3 needed)"
      INSTANCE Display/Badge 63x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
        ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/state/success
        TEXT label 31x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Open"
    TEXT meta 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Event setup · One-off gig · Colombo 04 area"
    TEXT pay 328x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Rs 6,000 for the job · per worker"
    TEXT fill 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "0 of 3 filled · Starts Sat 29 Aug 2026, 5:00 AM"
    TEXT applicantsLink 328x24 [FIXED/HUG] · fill color/brand/primary · mobile/body-medium · "No applicants yet — view pool"
    FRAME spacer-grow 8x472 [FIXED/FILL]
    FRAME actions 328x48 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Action/Button 160x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 92x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Edit posting"
      INSTANCE Action/Button 160x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/state/danger · r8 · {Style=Destructive, State=Default}
        TEXT label 74x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Withdraw"
```

**0 of 3 filled, no applicants.** Both actions are live, because nothing is filled: Edit applies
immediately (FR-POST-11) and Withdraw is allowed (FR-POST-12).

### `2.11pe` — Posting detail, owner view · edit, no one engaged yet

**Reached from** `2.11p` ("Edit posting"), [M4](M4-applying.md) `4.5b` ("Edit pay or details")  ·  **Leads to** nothing until a field changes — Save changes is disabled  ·  **Exits** back → history

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Edit posting"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 12
    INSTANCE Input/TextField 328x72 [FILL/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Text}
      TEXT label 30x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Title"
      FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT value 304x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Event setup crew (3 needed)"
    INSTANCE Input/TextField 328x72 [FILL/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Text}
      TEXT label 134x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Pay (Rs, per worker)"
      FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT value 304x24 [FILL/HUG] · fill color/text/primary · mobile/body · "6,000"
    INSTANCE Input/TextField 328x72 [FILL/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Text}
      TEXT label 109x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Workers needed"
      FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT value 304x24 [FILL/HUG] · fill color/text/primary · mobile/body · "3"
    INSTANCE Input/TextField 328x72 [FILL/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Text}
      TEXT label 112x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Start date & time"
      FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT value 304x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Sat 29 Aug 2026, 5:00 AM"
    TEXT applyNote 328x80 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "No one is engaged yet, so changes apply as soon as you save. Save stays off until you change something; anyone who has applied is told what changed."
    FRAME spacer-grow 8x216 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/subtle · stroke color/border/default 1 · r8 · {Style=Primary, State=Disabled}
      TEXT label 107x24 [HUG/HUG] · fill color/text/secondary · mobile/body-medium · "Save changes"
```

**The edit when nobody is engaged** — added 2026-09-23; `2.11p` and M4's empty pool used to open the
engaged-worker edit. There is no warning box: FR-POST-11 applies changes immediately before any slot fills.
It shows the current values, unchanged, so Save changes is `{State=Disabled}` and `applyNote` says it
stays off until something changes. Anyone who has applied is told of a material change (FR-APPLY-10).

### `2.11pw` — Posting detail, owner view · withdraw? (dialog, just posted)

**Opens over** `2.11p`  ·  **Keep posting** → `2.11p`  ·  **Withdraw** → `2.10w`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Posting"
  FRAME content 360x744 [FILL/FILL] · vertical pad 20/16/24/16 gap 12
    FRAME titleRow 328x24 [FILL/HUG] · horizontal pad 0 gap 8
      TEXT title 257x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Event setup crew (3 needed)"
      INSTANCE Display/Badge 63x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
        ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/state/success
        TEXT label 31x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Open"
    TEXT meta 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Event setup · One-off gig · Colombo 04 area"
    TEXT pay 328x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Rs 6,000 for the job · per worker"
    TEXT fill 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "0 of 3 filled · Starts Sat 29 Aug 2026, 5:00 AM"
    TEXT applicantsLink 328x24 [FIXED/HUG] · fill color/brand/primary · mobile/body-medium · "No applicants yet — view pool"
    FRAME spacer-grow 8x472 [FIXED/FILL]
    FRAME actions 328x48 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Action/Button 160x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 92x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Edit posting"
      INSTANCE Action/Button 160x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/state/danger · r8 · {Style=Destructive, State=Default}
        TEXT label 74x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Withdraw"
  FRAME scrim 360x800 [FIXED/FIXED] @0,0 · fill color/overlay/scrim · opacity 40%
  INSTANCE Feedback/ConfirmDialog 328x200 [FIXED/HUG] @16,300 · vertical pad 20 gap 12 · fill color/bg/default · r12
    TEXT title 225x28 [HUG/HUG] · fill color/text/primary · mobile/title · "Withdraw this posting?"
    TEXT body 288x60 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "It comes out of Browse straight away. No one has applied yet, so there's no one to tell. This can't be undone."
    FRAME actions 288x48 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Action/Button 149x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 101x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Keep posting"
      INSTANCE Action/Button 122x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/state/danger · r8 · {Style=Destructive, State=Default}
        TEXT label 74x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Withdraw"
```

The dialog over `2.11p`. Its body is written for this moment — nobody has applied, so there is no
one to tell — and says the one thing that matters: it cannot be undone. Centred on the frame.

### `2.10w` — My postings · posting withdrawn

**Reached from** `2.11pw` ("Withdraw")  ·  **Leads to** `2.11x`, `2.11f`, `2.11ex` (cards), `2.1n` (Post a Gig tab)

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    TEXT screenTitle 143x32 [HUG/HUG] · fill color/text/primary · mobile/display · "My postings"
    FRAME posting-Open 328x94 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x48 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 198x48 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Event setup crew (3 needed)"
        INSTANCE Display/Badge 94x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Posting, Value=Withdrawn}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/text/secondary
          TEXT label 62x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Withdrawn"
      TEXT meta 295x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "0 of 3 filled · Withdrawn by you · no one had applied"
    FRAME posting-Filled 328x70 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 229x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Stage crew — Friday setup"
        INSTANCE Display/Badge 63x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Posting, Value=Filled}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 31x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Filled"
      TEXT meta 174x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "1 of 1 filled · Starts Fri 8:00 AM"
    FRAME posting-Expired 328x70 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 217x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Event teardown — Sunday"
        INSTANCE Display/Badge 75x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/text/secondary
          TEXT label 43x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Expired"
      TEXT meta 192x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "0 of 2 filled · Expired 16 Aug 2026"
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Employer} · [standard, see header]
```

**Withdrawn before anyone applied.** The card keeps its fill count (FR-POST-14): "0 of 3 filled ·
Withdrawn by you · no one had applied".

### `2.11x` — Posting detail, owner view · withdrawn

**Reached from** `2.10w`  ·  **Leads to** nothing — a withdrawn posting has no actions  ·  **Exits** back → `2.10w`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Posting"
  FRAME content 360x744 [FILL/FILL] · vertical pad 20/16/24/16 gap 12
    FRAME titleRow 328x24 [FILL/HUG] · horizontal pad 0 gap 8
      TEXT title 226x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Event setup crew (3 needed)"
      INSTANCE Display/Badge 94x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Posting, Value=Withdrawn}
        ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/text/secondary
        TEXT label 62x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Withdrawn"
    TEXT meta 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Event setup · One-off gig · Colombo 04 area"
    TEXT pay 328x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Rs 6,000 for the job · per worker"
    TEXT fill 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "0 of 3 filled · Withdrawn by you — no one had applied"
    FRAME spacer-grow 8x568 [FIXED/FILL]
```

The withdrawn detail: no actions, and the fill line says why nothing else happened.

### `2.10` — My postings

**Reached from** the employer's Postings tab, and back from `2.11` and `2.11c`  ·  **Leads to** `2.11`, `2.11f`, `2.11ex` (cards), `2.1n` (Post a Gig tab)

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    TEXT screenTitle 143x32 [HUG/HUG] · fill color/text/primary · mobile/display · "My postings"
    FRAME posting-Open 328x70 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 229x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Event setup crew (3 needed)"
        INSTANCE Display/Badge 63x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/state/success
          TEXT label 31x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Open"
      TEXT meta 186x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "1 of 3 filled · 2 applicants waiting"
    FRAME posting-Filled 328x70 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 229x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Stage crew — Friday setup"
        INSTANCE Display/Badge 63x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Posting, Value=Filled}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
          TEXT label 31x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Filled"
      TEXT meta 174x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "1 of 1 filled · Starts Fri 8:00 AM"
    FRAME posting-Expired 328x70 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 217x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Event teardown — Sunday"
        INSTANCE Display/Badge 75x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/text/secondary
          TEXT label 43x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Expired"
      TEXT meta 192x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "0 of 2 filled · Expired 16 Aug 2026"
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Employer} · [standard, see header]
```

**Thursday morning, after Nethmi Jayasinghe is selected.** The Event setup card reads "1 of 3 filled ·
2 applicants waiting" — true both before and after the evening's edit, which is why it carries no start
time: `2.11c`'s back returns here.

### `2.11` — Posting detail, owner view

**Reached from** `2.10`, and back from [M4](M4-applying.md) `4.5s`, `2.11e`  ·  **Leads to** [M4](M4-applying.md) `4.5s` ("3 applicants — view pool"), `2.11e` ("Edit posting") — Withdraw is disabled  ·  **Exits** back → `2.10`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Posting"
  FRAME content 360x744 [FILL/FILL] · vertical pad 20/16/24/16 gap 12
    FRAME titleRow 328x24 [FILL/HUG] · horizontal pad 0 gap 8
      TEXT title 257x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Event setup crew (3 needed)"
      INSTANCE Display/Badge 63x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
        ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/state/success
        TEXT label 31x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Open"
    TEXT meta 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Event setup · One-off gig · Colombo 04 area"
    TEXT pay 328x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Rs 6,000 for the job · per worker"
    TEXT fill 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "1 of 3 filled · Starts Sat 29 Aug 2026, 5:00 AM"
    TEXT applicantsLink 328x24 [FIXED/HUG] · fill color/brand/primary · mobile/body-medium · "3 applicants — view pool"
    TEXT withdrawNote 328x80 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Withdraw isn't available once a place is filled. To stop hiring, lower Workers needed in Edit posting; to end an engagement, cancel it from Engagements."
    FRAME spacer-grow 8x380 [FIXED/FILL]
    FRAME actions 328x48 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Action/Button 160x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 92x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Edit posting"
      INSTANCE Action/Button 160x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/subtle · stroke color/border/default 1 · r8 · {Style=Destructive, State=Disabled}
        TEXT label 74x24 [HUG/HUG] · fill color/text/secondary · mobile/body-medium · "Withdraw"
```

**One of three places filled.** The pool link opens the pool as it now stands (M4 `4.5s`: Nethmi
selected, Kavindu and Tharindu pending). **Withdraw is `{State=Disabled}`** — FR-POST-12 allows it only
before any slot fills — and `withdrawNote` names the two actions that do apply: lowering Workers needed
through Edit (a material change, so Nethmi re-confirms) or cancelling an engagement.

### `2.11e` — Posting detail, owner view · edit

**Reached from** `2.11` ("Edit posting"), `2.11e2` ("Keep editing")  ·  **Leads to** `2.11e2` ("Review changes")  ·  **Exits** back → `2.11`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Edit posting"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 12
    FRAME materialChangeWarning 328x148 [FILL/HUG] · vertical pad 10/14/10/14 gap 4 · stroke color/state/urgent 1 · r10
      TEXT wTitle 296x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "1 worker is already engaged"
      TEXT wBody 296x100 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Changing pay, the start date or time, the location, the number of workers or the category asks each engaged worker to re-confirm. If they don't accept in time, that engagement moves into cancellation."
    INSTANCE Input/TextField 328x72 [FILL/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Text}
      TEXT label 30x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Title"
      FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT value 304x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Event setup crew (3 needed)"
    INSTANCE Input/TextField 328x72 [FILL/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Text}
      TEXT label 134x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Pay (Rs, per worker)"
      FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT value 304x24 [FILL/HUG] · fill color/text/primary · mobile/body · "6,000"
    INSTANCE Input/TextField 328x72 [FILL/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Text}
      TEXT label 109x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Workers needed"
      FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT value 304x24 [FILL/HUG] · fill color/text/primary · mobile/body · "3"
    INSTANCE Input/TextField 328x72 [FILL/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Text}
      TEXT label 112x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Start date & time"
      FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT value 304x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Sat 29 Aug 2026, 7:00 AM"
    TEXT editedNote 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Start time changed from 5:00 AM."
    FRAME spacer-grow 8x120 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 125x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Review changes"
```

**Thursday evening, about 7:00 PM.** The engaged-worker edit, with the start moved from 5:00 to 7:00 AM.
`materialChangeWarning` lists the material fields as the glossary defines them — pay, start date or time,
location, workers needed, category.

### `2.11e2` — Posting detail, owner view · edit, confirm changes

**Opens over** `2.11e`  ·  **Keep editing** → `2.11e`  ·  **Save changes** → `2.11c`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Edit posting"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 12
    FRAME materialChangeWarning 328x148 [FILL/HUG] · vertical pad 10/14/10/14 gap 4 · stroke color/state/urgent 1 · r10
      TEXT wTitle 296x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "1 worker is already engaged"
      TEXT wBody 296x100 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Changing pay, the start date or time, the location, the number of workers or the category asks each engaged worker to re-confirm. If they don't accept in time, that engagement moves into cancellation."
    INSTANCE Input/TextField 328x72 [FILL/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Text}
      TEXT label 30x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Title"
      FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT value 304x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Event setup crew (3 needed)"
    INSTANCE Input/TextField 328x72 [FILL/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Text}
      TEXT label 134x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Pay (Rs, per worker)"
      FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT value 304x24 [FILL/HUG] · fill color/text/primary · mobile/body · "6,000"
    INSTANCE Input/TextField 328x72 [FILL/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Text}
      TEXT label 109x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Workers needed"
      FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT value 304x24 [FILL/HUG] · fill color/text/primary · mobile/body · "3"
    INSTANCE Input/TextField 328x72 [FILL/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Text}
      TEXT label 112x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Start date & time"
      FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT value 304x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Sat 29 Aug 2026, 7:00 AM"
    TEXT editedNote 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Start time changed from 5:00 AM."
    FRAME spacer-grow 8x120 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 125x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Review changes"
  FRAME scrim 360x800 [FIXED/FIXED] @0,0 · fill color/overlay/scrim · opacity 40%
  INSTANCE Feedback/ConfirmDialog 328x260 [FIXED/HUG] @16,270 · vertical pad 20 gap 12 · fill color/bg/default · r12
    TEXT title 206x28 [HUG/HUG] · fill color/text/primary · mobile/title · "Save these changes?"
    TEXT body 288x120 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "The start time moves to 7:00 AM and urgency is re-checked. Nethmi has until Fri 28 Aug 2026, 1:00 PM to re-confirm — if she doesn't accept by then, that engagement moves into cancellation. The 2 pending applicants are told the new time."
    FRAME actions 288x48 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Action/Button 144x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 96x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Keep editing"
      INSTANCE Action/Button 155x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
        TEXT label 107x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Save changes"
```

The save confirmation. The start moves to 7:00 AM, urgency is re-checked (FR-ENG-10), and **Nethmi has
until Fri 28 Aug 2026, 1:00 PM** to re-confirm: FR-ENG-09's window is 48 hours or half the time left before
the start, whichever is shorter — 36 hours are left, so 18. The two pending applicants are told the new
time (FR-APPLY-10). Centred on the frame.

### `2.11c` — Posting detail, owner view · edited, re-confirmation pending

**Reached from** `2.11e2` ("Save changes"), and back from [M5](M5-engagement.md) `5.12`  ·  **Leads to** [M5](M5-engagement.md) `5.12` (the change note), [M4](M4-applying.md) `4.5s` ("3 applicants — view pool") — Edit and Withdraw are disabled  ·  **Exits** back → `2.10`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Posting"
  FRAME content 360x744 [FILL/FILL] · vertical pad 20/16/24/16 gap 12
    FRAME titleRow 328x24 [FILL/HUG] · horizontal pad 0 gap 8
      TEXT title 257x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Event setup crew (3 needed)"
      INSTANCE Display/Badge 63x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
        ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/state/success
        TEXT label 31x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Open"
    TEXT meta 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Event setup · One-off gig · Colombo 04 area"
    TEXT pay 328x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Rs 6,000 for the job · per worker"
    TEXT fill 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "1 of 3 filled · Starts Sat 29 Aug 2026, 7:00 AM"
    TEXT applicantsLink 328x24 [FIXED/HUG] · fill color/brand/primary · mobile/body-medium · "3 applicants — view pool"
    TEXT changeNote 328x72 [FIXED/HUG] · fill color/brand/primary · mobile/body-medium · "Start time changed to 7:00 AM · Nethmi has until Fri 28 Aug 2026, 1:00 PM to re-confirm — see responses"
    TEXT pausedNote 328x80 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Editing is paused until the re-confirmation is answered. Withdraw isn't available once a place is filled — to end an engagement, cancel it from Engagements."
    FRAME spacer-grow 8x296 [FIXED/FILL]
    FRAME actions 328x48 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Action/Button 160x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/border/default 1.5 · r8 · {Style=Secondary, State=Disabled}
        TEXT label 92x24 [HUG/HUG] · fill color/text/secondary · mobile/body-medium · "Edit posting"
      INSTANCE Action/Button 160x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/subtle · stroke color/border/default 1 · r8 · {Style=Destructive, State=Disabled}
        TEXT label 74x24 [HUG/HUG] · fill color/text/secondary · mobile/body-medium · "Withdraw"
```

**The edit is saved; Nethmi's answer is pending.** `changeNote` gives her deadline and opens the
responses (M5 `5.12`). **Edit and Withdraw are both disabled**: one re-confirmation at a time (FR-ENG-09),
and no Withdraw once a place is filled (FR-POST-12). `pausedNote` says both.

### `2.11f` — Posting detail, owner view · filled (Stage crew)

**Reached from** `2.10`, `2.10p`, `2.10w`, `2.10b`  ·  **Leads to** [M5](M5-engagement.md) `5.3t` ("See engagement")  ·  **Exits** back → history

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Posting"
  FRAME content 360x744 [FILL/FILL] · vertical pad 20/16/24/16 gap 12
    FRAME titleRow 328x24 [FILL/HUG] · horizontal pad 0 gap 8
      TEXT title 257x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Stage crew — Friday setup"
      INSTANCE Display/Badge 63x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Posting, Value=Filled}
        ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
        TEXT label 31x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Filled"
    TEXT meta 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Event setup · One-off gig · Colombo 04 area"
    TEXT pay 328x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Rs 4,000 for the job"
    TEXT fill 328x32 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "1 of 1 filled · Tharindu Silva · Starts Fri 28 Aug 2026, 8:00 AM"
    TEXT filledNote 328x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "This posting is filled. Manage the work from Engagements."
    FRAME spacer-grow 8x440 [FIXED/FILL]
    FRAME actions 328x48 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 130x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "See engagement"
```

Stage crew, filled by Tharindu Silva for Fri 28 Aug 2026, 8:00 AM. A filled posting is managed from
Engagements; "See engagement" is a real button, where it used to be a grey-text hotspot.

### `2.11ex` — Posting detail, owner view · expired (Event teardown)

**Reached from** `2.10`, `2.10p`, `2.10w`, `2.10b`  ·  **Leads to** `2.1n` ("Post a new gig")  ·  **Exits** back → history

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Posting"
  FRAME content 360x744 [FILL/FILL] · vertical pad 20/16/24/16 gap 12
    FRAME titleRow 328x24 [FILL/HUG] · horizontal pad 0 gap 8
      TEXT title 245x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Event teardown — Sunday"
      INSTANCE Display/Badge 75x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
        ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/text/secondary
        TEXT label 43x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Expired"
    TEXT meta 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Event setup · One-off gig · Colombo 04 area"
    TEXT pay 328x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Rs 3,500 for the job · per worker"
    TEXT fill 328x32 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "0 of 2 filled · Expired 16 Aug 2026 — no one was selected before the start"
    TEXT expiredNote 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Expired postings can't be reopened."
    FRAME spacer-grow 8x460 [FIXED/FILL]
    FRAME actions 328x48 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 112x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Post a new gig"
```

Event teardown, expired on 16 Aug with nobody selected (FR-POST-13). An expired posting cannot be
reopened, so the one action is "Post a new gig" — the blank form. No copy-a-posting feature is implied;
none is specified.

### `2.10d` — My postings · Dilrukshi Herath

**Reached from** `2.9et`, Dilrukshi's Postings tab  ·  **Leads to** `2.11d`, `2.11hx` (cards), `2.1n` (Post a Gig tab)

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    TEXT screenTitle 143x32 [HUG/HUG] · fill color/text/primary · mobile/display · "My postings"
    FRAME posting-Open 328x86 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 229x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Grade 8 maths tutoring"
        INSTANCE Display/Badge 63x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/state/success
          TEXT label 31x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Open"
      TEXT meta 300x32 [FILL/HUG] · fill color/text/secondary · mobile/caption · "0 of 1 filled · Starts Mon 7 Sep 2026, 4:00 PM · no applicants yet"
    FRAME posting-Expired 328x70 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 217x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "House move helpers"
        INSTANCE Display/Badge 75x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/text/secondary
          TEXT label 43x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Expired"
      TEXT meta 190x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "0 of 1 filled · Expired 12 Aug 2026"
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Employer} · [standard, see header]
```

**Dilrukshi, Thursday about 6:00 PM, just after posting.** The tutoring job at 0 of 1 with no applicants,
and her expired House move helpers.

### `2.11d` — Posting detail, owner view · tutoring (Dilrukshi)

**Reached from** `2.10d`, and back from `2.11de`, `2.11dw`  ·  **Leads to** `2.11de` ("Edit posting"), `2.11dw` ("Withdraw")  ·  **Exits** back → `2.10d`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Posting"
  FRAME content 360x744 [FILL/FILL] · vertical pad 20/16/24/16 gap 12
    FRAME titleRow 328x24 [FILL/HUG] · horizontal pad 0 gap 8
      TEXT title 257x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Grade 8 maths tutoring"
      INSTANCE Display/Badge 63x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
        ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/state/success
        TEXT label 31x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Open"
    TEXT meta 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Tutoring · Part-time job · Dehiwala area"
    TEXT pay 328x48 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Rs 1,800 per day · Mon, Wed, Fri — 4 to 6 pm"
    TEXT fill 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "0 of 1 filled · Starts Mon 7 Sep 2026, 4:00 PM"
    TEXT applicantsNote 328x24 [FIXED/HUG] · fill color/text/secondary · mobile/body-medium · "No applicants yet"
    FRAME spacer-grow 8x448 [FIXED/FILL]
    FRAME actions 328x48 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Action/Button 160x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 92x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Edit posting"
      INSTANCE Action/Button 160x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/state/danger · r8 · {Style=Destructive, State=Default}
        TEXT label 74x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Withdraw"
```

Every open posting offers Edit and Withdraw while nothing is filled. Until 2026-09-23 this one had
Withdraw alone.

### `2.11de` — Posting detail, owner view · edit, tutoring (Dilrukshi)

**Reached from** `2.11d`  ·  **Leads to** nothing until a field changes — Save changes is disabled  ·  **Exits** back → `2.11d`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Edit posting"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 12
    INSTANCE Input/TextField 328x72 [FILL/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Text}
      TEXT label 30x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Title"
      FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT value 304x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Grade 8 maths tutoring"
    INSTANCE Input/TextField 328x72 [FILL/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Text}
      TEXT label 113x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Pay (Rs, per day)"
      FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT value 304x24 [FILL/HUG] · fill color/text/primary · mobile/body · "1,800"
    INSTANCE Input/TextField 328x72 [FILL/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Text}
      TEXT label 109x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Workers needed"
      FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT value 304x24 [FILL/HUG] · fill color/text/primary · mobile/body · "1"
    INSTANCE Input/TextField 328x72 [FILL/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Text}
      TEXT label 62x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Schedule"
      FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT value 304x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Mon, Wed, Fri — 4 to 6 pm"
    INSTANCE Input/TextField 328x72 [FILL/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Text}
      TEXT label 112x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Start date & time"
      FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT value 304x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Mon 7 Sep 2026, 4:00 PM"
    TEXT applyNote 328x80 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "No one is engaged yet, so changes apply as soon as you save. Save stays off until you change something; anyone who has applied is told what changed."
    FRAME spacer-grow 8x132 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/subtle · stroke color/border/default 1 · r8 · {Style=Primary, State=Disabled}
      TEXT label 107x24 [HUG/HUG] · fill color/text/secondary · mobile/body-medium · "Save changes"
```

The tutoring edit, same rules as `2.11pe`, with the Schedule field a part-time job carries and pay
labelled per day.

### `2.11dw` — Posting detail, owner view · withdraw? (dialog, tutoring)

**Opens over** `2.11d`  ·  **Keep posting** → `2.11d`  ·  **Withdraw** → `2.10dw`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Posting"
  FRAME content 360x744 [FILL/FILL] · vertical pad 20/16/24/16 gap 12
    FRAME titleRow 328x24 [FILL/HUG] · horizontal pad 0 gap 8
      TEXT title 257x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Grade 8 maths tutoring"
      INSTANCE Display/Badge 63x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
        ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/state/success
        TEXT label 31x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Open"
    TEXT meta 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Tutoring · Part-time job · Dehiwala area"
    TEXT pay 328x48 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Rs 1,800 per day · Mon, Wed, Fri — 4 to 6 pm"
    TEXT fill 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "0 of 1 filled · Starts Mon 7 Sep 2026, 4:00 PM"
    TEXT applicantsNote 328x24 [FIXED/HUG] · fill color/text/secondary · mobile/body-medium · "No applicants yet"
    FRAME spacer-grow 8x448 [FIXED/FILL]
    FRAME actions 328x48 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Action/Button 160x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 92x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Edit posting"
      INSTANCE Action/Button 160x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/state/danger · r8 · {Style=Destructive, State=Default}
        TEXT label 74x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Withdraw"
  FRAME scrim 360x800 [FIXED/FIXED] @0,0 · fill color/overlay/scrim · opacity 40%
  INSTANCE Feedback/ConfirmDialog 328x200 [FIXED/HUG] @16,300 · vertical pad 20 gap 12 · fill color/bg/default · r12
    TEXT title 225x28 [HUG/HUG] · fill color/text/primary · mobile/title · "Withdraw this posting?"
    TEXT body 288x60 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "It comes out of Browse straight away. No one has applied yet, so there's no one to tell. This can't be undone."
    FRAME actions 288x48 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Action/Button 149x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 101x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Keep posting"
      INSTANCE Action/Button 122x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/state/danger · r8 · {Style=Destructive, State=Default}
        TEXT label 74x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Withdraw"
```

The same no-applicants withdrawal dialog as `2.11pw`, over the tutoring posting.

### `2.10dw` — My postings · Dilrukshi Herath, tutoring withdrawn

**Reached from** `2.11dw` ("Withdraw")  ·  **Leads to** `2.11dx`, `2.11hx` (cards), `2.1n` (Post a Gig tab)

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    TEXT screenTitle 143x32 [HUG/HUG] · fill color/text/primary · mobile/display · "My postings"
    FRAME posting-Open 328x70 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 198x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Grade 8 maths tutoring"
        INSTANCE Display/Badge 94x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Posting, Value=Withdrawn}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/text/secondary
          TEXT label 62x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Withdrawn"
      TEXT meta 293x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "0 of 1 filled · Withdrawn by you · no one had applied"
    FRAME posting-Expired 328x70 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 217x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "House move helpers"
        INSTANCE Display/Badge 75x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/text/secondary
          TEXT label 43x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Expired"
      TEXT meta 190x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "0 of 1 filled · Expired 12 Aug 2026"
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Employer} · [standard, see header]
```

**A branch the worker story does not take.** In the main story Kavindu applies for this job that
evening (M3, M4) and Dilrukshi keeps it; here she withdraws it first, before anyone has applied.

### `2.11dx` — Posting detail, owner view · withdrawn (tutoring)

**Reached from** `2.10dw`  ·  **Leads to** nothing  ·  **Exits** back → `2.10dw`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Posting"
  FRAME content 360x744 [FILL/FILL] · vertical pad 20/16/24/16 gap 12
    FRAME titleRow 328x24 [FILL/HUG] · horizontal pad 0 gap 8
      TEXT title 226x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Grade 8 maths tutoring"
      INSTANCE Display/Badge 94x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Posting, Value=Withdrawn}
        ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/text/secondary
        TEXT label 62x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Withdrawn"
    TEXT meta 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Tutoring · Part-time job · Dehiwala area"
    TEXT pay 328x48 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Rs 1,800 per day · Mon, Wed, Fri — 4 to 6 pm"
    TEXT fill 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "0 of 1 filled · Withdrawn by you — no one had applied"
    FRAME spacer-grow 8x544 [FIXED/FILL]
```

The withdrawn tutoring detail.

### `2.11hx` — Posting detail, owner view · expired (House move helpers)

**Reached from** `2.10d`, `2.10dw`, `2.10db`  ·  **Leads to** nothing  ·  **Exits** back → history

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Posting"
  FRAME content 360x744 [FILL/FILL] · vertical pad 20/16/24/16 gap 12
    FRAME titleRow 328x24 [FILL/HUG] · horizontal pad 0 gap 8
      TEXT title 245x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "House move helpers"
      INSTANCE Display/Badge 75x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
        ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/text/secondary
        TEXT label 43x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Expired"
    TEXT meta 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Moving · One-off gig · Dehiwala area"
    TEXT pay 328x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Rs 5,000 for the job"
    TEXT fill 328x32 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "0 of 1 filled · Expired 12 Aug 2026 — no one was selected before the start"
    FRAME spacer-grow 8x552 [FIXED/FILL]
```

House move helpers, expired on 12 Aug with nobody selected.

### `2.10g` — My postings · hidden pending review, owner view [against Y3/A25]

**Reached from** R. Gunasekara's Postings tab  ·  **Leads to** `2.11g` (card), `2.1n` (Post a Gig tab)

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    TEXT screenTitle 143x32 [HUG/HUG] · fill color/text/primary · mobile/display · "My postings"
    FRAME posting-Open 328x94 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      FRAME topRow 300x48 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 229x48 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Data entry — work from home"
        INSTANCE Display/Badge 63x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/state/success
          TEXT label 31x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Open"
      TEXT meta 131x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Hidden pending review"
    TEXT hiddenNote 328x100 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "This posting was hidden from browse after reports and is being reviewed by YouthLink. You'll be notified of the outcome — restored or removed. Nothing else on your account is affected."
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Employer} · [standard, see header]
```

**R. Gunasekara, after three reports hid his posting.** The status reads only *Hidden pending review*
— never a report count, which would reveal when the threshold fired (FR-DISPUTE-02's A25 reasoning). The
badge stays Open because that is the posting's status; hiding is a moderation state beside it.

### `2.11g` — Posting detail, owner view · hidden pending review

**Reached from** `2.10g`  ·  **Leads to** nothing — editing and withdrawal are paused  ·  **Exits** back → `2.10g`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Posting"
  FRAME content 360x744 [FILL/FILL] · vertical pad 20/16/24/16 gap 12
    FRAME titleRow 328x24 [FILL/HUG] · horizontal pad 0 gap 8
      TEXT title 257x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Data entry — work from home"
      INSTANCE Display/Badge 63x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
        ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/state/success
        TEXT label 31x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Open"
    TEXT meta 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Retail · One-off gig · Maharagama area"
    TEXT pay 328x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Rs 4,500 for the job"
    TEXT fill 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "0 of 1 filled · Hidden from browse pending review"
    TEXT hiddenNote 328x60 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "YouthLink is reviewing this posting. Editing and withdrawal are paused until the review ends — you'll be told whether it is restored or removed."
    FRAME spacer-grow 8x496 [FIXED/FILL]
```

The owner's detail. The posting is written as the form would have accepted it — Retail, Maharagama,
Rs 4,500 for the job — and the scam is in its description, which only the worker's view (M3 `3.12g`)
shows. Editing and withdrawal are paused until the review ends (FR-DISPUTE-02 as amended 2026-09-23), so
there are no actions.

### `2.10z` — My postings · first run

**Reached from** the Postings tab on a brand-new employer account  ·  **Leads to** `2.1n` ("Post a gig", and the Post a Gig tab)

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    TEXT screenTitle 143x32 [HUG/HUG] · fill color/text/primary · mobile/display · "My postings"
    INSTANCE Feedback/EmptyState 328x196 [FILL/HUG] · vertical pad 32/24/32/24 gap 8 · fill color/bg/default · r10 · {Cause=NoneExist}
      TEXT title 152x28 [HUG/HUG] · fill color/text/primary · mobile/title · "No postings yet"
      TEXT body 280x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · align center · "Post a gig and it will appear here, with its applicants as they arrive."
      INSTANCE Action/Button 124x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 76x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Post a gig"
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=false, Role=Employer} · [standard, see header]
```

A new employer's empty list: `Feedback/EmptyState {Cause=NoneExist}` with "Post a gig" → the blank form.

### `2.8err` — Start date & time · under the 2-hour minimum

**Reached from** entering a start less than 2 hours away on `2.8` — drawn as its own starting point  ·  **Leads to** `2.8` (the date field — a later time) — Review posting is disabled  ·  **Exits** back → `2.7`, ✕ → `2.10b`

```
FRAME 360x800 · vertical pad 6/16/24/16 gap 16 · fill color/bg/default
  FRAME topBar 328x44 [FILL/HUG] · horizontal pad 0 gap 0 · [standard, see header]
  TEXT screenTitle 58x32 [HUG/HUG] · fill color/text/primary · mobile/display · "Start"
  TEXT step 62x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Step 7 of 7"
  INSTANCE Input/DateTimeField 328x74 [FIXED/HUG] · vertical pad 0 gap 6 · {State=Filled}
    TEXT label 112x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Start date & time"
    FRAME field 328x48 [FILL/HUG] · horizontal pad 12 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
      TEXT value 292x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Today, 5:40 PM — in 40 minutes"
      VECTOR calendar 12x12 [FIXED/FIXED] · stroke color/text/secondary 1.5
  INSTANCE fieldError 296x40 [HUG/HUG] · horizontal pad 0 gap 0 · of Feedback/FieldError
    TEXT error 296x40 [FIXED/HUG] · fill color/state/danger · mobile/secondary · "Gigs need at least 2 hours' notice. Please choose a later start time."
  TEXT leadNote 328x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "At least 2 hours from now, so workers have time to apply."
  FRAME spacer-grow 8x364 [FIXED/FILL]
  INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/subtle · stroke color/border/default 1 · r8 · {Style=Primary, State=Disabled}
    TEXT label 117x24 [HUG/HUG] · fill color/text/secondary · mobile/body-medium · "Review posting"
```

The start is 40 minutes away. FR-POST-05 **blocks** rather than warns, so Review posting is
`{State=Disabled}` and the `Feedback/FieldError` states the rule and the fix. Choosing a later time (the
date field) is the way out. The moment is undated on purpose — a failure has no calendar position.

### `2.9bnr` — Review before submit · offline at publish [against E9]

**Reached from** "Post gig" on `2.9` with no connection  ·  **Leads to** `2.9e` ("Post gig", once reconnected)  ·  **Exits** back → `2.8`, ✕ → `2.10b`

```
FRAME 360x800 · vertical pad 6/16/24/16 gap 10 · fill color/bg/default
  FRAME topBar 328x50 [FILL/HUG] · horizontal pad 0/0/6/0 gap 0 · [standard, see header]
  TEXT screenTitle 236x32 [HUG/HUG] · fill color/text/primary · mobile/display · "Review your posting"
  TEXT reviewNote 328x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "This is the only place the whole posting is visible before it goes live."
  INSTANCE formBanner 328x80 [FILL/HUG] · horizontal pad 10/12/10/12 gap 0 · stroke color/border/error 1 · r8 · of Feedback/FormBanner · {Kind=Error}
    TEXT message 296x60 [FIXED/HUG] · fill color/state/danger · mobile/secondary · "You're offline, so this couldn't be posted. Your details are still here — try again once you reconnect."
  FRAME rev-Title 328x20 [FILL/HUG] · horizontal pad 0 gap 12
    TEXT revLabel 96x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Title"
    TEXT revValue 220x20 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Event setup crew (3 needed)"
  FRAME rev-Description 328x80 [FILL/HUG] · horizontal pad 0 gap 12
    TEXT revLabel 96x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Description"
    TEXT revValue 220x80 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Help set up staging and seating for a weekend event at a Colombo 04 venue. Gloves provided."
  FRAME rev-Category 328x20 [FILL/HUG] · horizontal pad 0 gap 12
    TEXT revLabel 96x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Category"
    TEXT revValue 220x20 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Event setup"
  FRAME rev-Type 328x20 [FILL/HUG] · horizontal pad 0 gap 12
    TEXT revLabel 96x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Type"
    TEXT revValue 220x20 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "One-off gig"
  FRAME rev-Pay 328x20 [FILL/HUG] · horizontal pad 0 gap 12
    TEXT revLabel 96x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Pay"
    TEXT revValue 220x20 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Rs 6,000 per worker"
  FRAME rev-Total 328x20 [FILL/HUG] · horizontal pad 0 gap 12
    TEXT revLabel 96x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Total"
    TEXT revValue 220x20 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Rs 18,000 for 3 workers"
  FRAME rev-Address 328x20 [FILL/HUG] · horizontal pad 0 gap 12
    TEXT revLabel 96x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Address"
    TEXT revValue 220x20 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "23 Temple Road, Colombo 04"
  FRAME rev-Area 328x20 [FILL/HUG] · horizontal pad 0 gap 12
    TEXT revLabel 96x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Area shown"
    TEXT revValue 220x20 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Colombo 04 area"
  FRAME rev-Start 328x20 [FILL/HUG] · horizontal pad 0 gap 12
    TEXT revLabel 96x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Start"
    TEXT revValue 220x20 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Sat 29 Aug 2026, 5:00 AM"
  FRAME rev-Urgency 328x40 [FILL/HUG] · horizontal pad 0 gap 12
    TEXT revLabel 96x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Urgency"
    TEXT revValue 220x40 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Urgent — starts within 48 hours (set automatically)"
  FRAME rev-Workers 328x20 [FILL/HUG] · horizontal pad 0 gap 12
    TEXT revLabel 96x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Workers"
    TEXT revValue 220x20 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "3"
  FRAME rev-Posting as 328x40 [FILL/HUG] · horizontal pad 0 gap 12
    TEXT revLabel 96x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Posting as"
    TEXT revValue 220x40 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Lanka Events (Pvt) Ltd — Business"
  FRAME spacer-grow 8x10 [FIXED/FILL]
  INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
    TEXT label 63x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Post gig"
```

Offline at the moment of posting. `Feedback/FormBanner {Kind=Error}` says the details are still
here; nothing was sent. Once the connection is back, Post gig goes through (`2.9e`).

### `2.1rst` — Post a gig, title & description · restored after reconnect [against E9]

**Reached from** reopening Post a Gig after the connection returns — drawn as its own starting point  ·  **Leads to** `2.2` ("Continue"), `2.10b` (Postings tab)

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  FRAME content 360x736 [FILL/FILL] · vertical pad 6/16/16/16 gap 16
    FRAME topBarGhost 44x44 [FIXED/FIXED] · [standard, see header]
    TEXT screenTitle 115x32 [HUG/HUG] · fill color/text/primary · mobile/display · "Post a gig"
    TEXT step 61x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Step 1 of 7"
    TEXT restoredNote 328x20 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "Your details were kept while you were offline."
    INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Text}
      TEXT label 30x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Title"
      FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT value 304x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Event setup crew (3 needed)"
    FRAME description 328x122 [FILL/HUG] · vertical pad 0 gap 4
      TEXT descLabel 76x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Description"
      INSTANCE descField 328x98 [FILL/HUG] · vertical pad 12 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8 · of Input/TextArea · {State=Filled}
        TEXT value 302x72 [FILL/HUG] · fill color/text/primary · mobile/body · "Help set up staging and seating for a weekend event at a Colombo 04 venue. Gloves provided."
    FRAME spacer-grow 8x248 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 70x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Continue"
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Employer} · [standard, see header]
```

The form the employer left while offline, still on the device (FR-POST-15 as amended for E9: kept
locally until submitted or discarded, with no server draft and no draft list). `restoredNote` says so.

## Every screen shows one moment

Each screen is one moment. The three employers' journeys sit on their own dates, and within each one time
only moves forward.

| When | Screens | What is true then |
| --- | --- | --- |
| **Thu 27 Aug, before 7:00 AM** | `2.1`–`2.9`, `2.10b` | Lanka Events fills in the form |
| **Thu 27 Aug, ~7:00 AM** | `2.9e`, `2.10p`, `2.11p`, `2.11pe`, `2.11pw`, `2.10w`, `2.11x` | Posted, urgent, nobody has applied. `2.11pw` → `2.10w` → `2.11x` is the branch where it is withdrawn at once |
| **Thu 27 Aug, 7:50–8:40 AM** | — (M3 `3.10ea`, M4 `4.5`) | Nethmi, Kavindu and Tharindu apply; the employer opens the pool from the notifications |
| **Thu 27 Aug, after Nethmi is selected** | `2.10`, `2.11`, `2.11f`, `2.11ex` | 1 of 3 filled; Kavindu and Tharindu pending |
| **Thu 27 Aug, ~6:00 PM** | `2.1t`–`2.9t`, `2.10db`, `2.9et`, `2.10d`, `2.11d`, `2.11de`, `2.11dw`, `2.10dw`, `2.11dx`, `2.11hx` | Dilrukshi posts the tutoring job; the withdrawal is a branch the worker story does not take |
| **Thu 27 Aug, ~7:00 PM** | `2.11e`, `2.11e2`, `2.11c` | The start moves to 7:00 AM; Nethmi has until Fri 28 Aug, 1:00 PM, and the two pending applicants are told |
| **31 Aug – 4 Sep** | `2.10g`, `2.11g` | R. Gunasekara's posting, hidden after three reports and under review |
| **No date** | `2.10z`, `2.1n`, `2.8err`, `2.9bnr`, `2.1rst` | A new account, a blank form, and the failure states |

**Gig start times.** Event setup crew Sat 29 Aug 2026, 5:00 AM (7:00 AM after the edit) · Stage crew Fri
28 Aug 2026, 8:00 AM · Grade 8 maths tutoring Mon 7 Sep 2026, 4:00 PM. A card gives a weekday alone for a
start inside the coming week and writes the date out for anything later.

## Posting rules this module follows

| Rule | Where it shows |
| --- | --- |
| **Pay format by arrangement** (FR-POST-04) | `2.4`: a gig takes a fixed total only · `2.4t`: a part-time job takes a rate with a Per day / week / month unit. Internship options are not drawn |
| **The review shows everything, plus two computed previews** (FR-POST-09) | `2.9`, `2.9t`, `2.9bnr`: every field, the precise address and the area workers see, and urgency marked *set automatically* |
| **Step totals follow the arrangement** | Steps 1–2 say "of 7" on both paths; `2.3t` makes it "of 8" when Part-time is chosen |
| **Edits before any slot fills apply immediately** (FR-POST-11) | `2.11pe`, `2.11de` — no warning, Save off until something changes |
| **Withdraw only while nothing is filled** (FR-POST-12, redirect amended 2026-09-23) | Live on `2.11p` and `2.11d`; disabled on `2.11` and `2.11c` with the note that says what to do instead |
| **Re-confirmation window** (FR-ENG-09, amended 2026-09-23) | 48 hours or half the time left before the start, whichever is shorter — `2.11e2` and `2.11c` state Nethmi's deadline. One pending re-confirmation at a time, so `2.11c` disables Edit |
| **The minimum lead time blocks** (FR-POST-05) | `2.8err`: Review posting disabled until the start is 2 hours away or more |
| **A hidden posting's owner sees the status, not the count** (FR-DISPUTE-02, A25) | `2.10g`, `2.11g` |
| **A form is kept on the device, never on the server** (FR-POST-15 as amended for E9) | `2.9bnr`, `2.1rst`, and the Post a Gig tab on `2.10b` / `2.10db` returning to the kept form |

## What the collapsed chrome hides

**The form's top bar.** `topBar` is a 328 × 44 horizontal frame at `@16,6` holding three children: `backHit`
(44 × 44, the back chevron — an 8 × 16 vector at `@6,14`, stroke `color/text/primary`), `topSpacer`
(240 × 8) and `closeHit` (44 × 44, the ✕ — a 12 × 12 vector at `@26,16`). On the three review screens it
carries 6 px of bottom padding (328 × 50). **`topBarGhost`** on step 1 (`2.1`, `2.1t`, `2.1n`, `2.1rst`) is
an empty 44 × 44 frame in the same place: step 1 has nothing to go back to and uses the tab bar to leave,
but the title has to sit at the same height as on every other step.

**The tab bar.** `Chrome/TabBar` reads `[standard, see header]` throughout. Under it, **`Role` is Employer**
on every screen here, and **`Notification badge`** is `true` everywhere except `2.10z`, a brand-new account.

**This page wires two tabs**, the two whose destinations are on this page: Postings (the form → `2.10b` /
`2.10db`; `2.1n` → `2.10`) and Post a Gig (a list whose gig is posted → `2.1n`; the lists before posting →
the kept form). The demo routes the other three tabs per role and per journey.

## States not drawn in this module

| Not drawn | Build it from |
| --- | --- |
| The **posting detail before a selection, with applicants waiting** | The pool is opened from the applicants' notifications instead (M3 `3.10ea` → M4 `4.5`). The detail would be `2.11` at "0 of 3 filled", with Withdraw live and a withdrawal dialog telling the pending applicants they will be notified (FR-APPLY-09) |
| An **internship's pay step** | `2.4t`'s layout with Unpaid, Stipend and Paid as the choices (FR-POST-04) |
| **Lowering Workers needed to the number filled** | `2.11e` with Workers needed at 1; the save makes the posting Filled (FR-POST-18), resolves the pending applicants and asks the engaged worker to re-confirm |
| A **material change inside the last 2 hours** | `2.11e` with the start field in `{State=Error}` and a `Feedback/FieldError` stating the 2-hour rule (FR-ENG-09 as amended) |
| **Discarding the kept form** | A `Feedback/ConfirmDialog` over any step — the explicit discard FR-POST-15 (E9) refers to |
| The **Event setup crew after it starts** | It expires at its start with Nethmi engaged (FR-POST-13 closes only the unfilled slots); drawn as `2.11ex`'s layout at "1 of 3 filled" |

## Open, and carried to the modules that own them

- **M5: `2.11f` (Thursday) opens `5.3t`, which shows Friday's arrival already confirmed.** The engagement
  detail needs its Thursday state, or the link a Friday source.
- **M1, M3, M5: Dilrukshi's and R. Gunasekara's Notifications, Engagements and Profile tabs** still open
  Lanka Events' screens, because neither has hub screens of their own. Their Postings and Post a Gig tabs
  are correct.
- **M5: `5.12` states the amended window** ("until Fri 28 Aug 2026, 1:00 PM"); the worker's side of the same
  change, and the requirement's other three rules, are specified there.
