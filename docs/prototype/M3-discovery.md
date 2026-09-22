# M3 — Discovery

**Forty screens.** This is where work is found. It is found two ways — **pulled** (Browse, filters, sort, search, saved gigs, the listing detail) and **pushed** (the notification history and its preferences). Both obey the same radius and the same urgency rule: 5 km by default, widening in 5 km steps when fewer than five gigs are found (FR-DISC-01); urgent means starting 48 hours or less away (FR-POST-07).

**Read *Every screen shows one moment* at the end first.** The histories are four snapshots of one worker's week (`3.10x` Thursday 27 Aug, `3.10q` 2 Sep, `3.10r` 4 Sep, `3.10` 5 Sep), and every date and relative time below is consistent with that table.

Read `README.md` for the notation and `design-system.md` for the tokens and components. **`design-system.md` §6 collapses the tab bar**, so it reads `[standard, see header]` throughout — see *What the collapsed tab bar hides*.

---

### `3.9` — Notification permission request (dialog)

**Opens over** the Browse shell, right after registration — [M1](M1-account.md) `1.4` "Create account"  ·  **Allow** → `3.3`  ·  **Don't allow** → `3.3`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/80/16 gap 12
    TEXT screenTitle 87x32 [HUG/HUG] · fill color/text/primary · mobile/display · "Browse"
    TEXT contextLine 328x32 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Turn on notifications to hear about urgent gigs near you, and about anything that needs your answer."
    FRAME searchBar 328x44 [FILL/FIXED] · fill color/bg/default · stroke color/border/default 1 · r12
      ELLIPSE Ellipse 12x12 [FIXED/FIXED] @14,14 · stroke color/text/secondary 1.8
      VECTOR Vector 4x4 [FIXED/FIXED] @25,25 · stroke color/text/secondary 1.8
      TEXT Search gigs 78x20 [FIXED/FIXED] @36,14 · fill color/text/secondary · mobile/secondary · "Search gigs"
    FRAME controls 328x44 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Input/Chip 69x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
        TEXT label 41x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Filters"
      INSTANCE Input/Chip 140x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
        TEXT label 112x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Sort: Urgent first"
      INSTANCE Input/Chip 69x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
        TEXT label 41x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Saved"
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Worker} · [standard, see header]
  RECTANGLE scrim 360x800 [FIXED/FIXED] @0,0 · fill color/overlay/scrim · opacity 40%
  INSTANCE OS/PermissionDialog 280x232 [FIXED/HUG] @40,284 · vertical pad 20/20/16/20 gap 12 · fill color/bg/default · r12 · {Context=Notifications}
    FRAME icon-bell 24x24 [FIXED/FIXED]
      VECTOR Vector 14x17 [FIXED/FIXED] @5,4 · stroke color/text/secondary 1.8
    TEXT question 240x48 [FIXED/HUG] · fill color/text/primary · mobile/body · align center · "Allow YouthLink to send you notifications?"
    FRAME option 240x44 [FILL/HUG] · horizontal pad 10/0/10/0 gap 0 · fill color/bg/subtle · r999
      TEXT optionLabel 42x24 [FIXED/FIXED] · fill color/brand/primary · mobile/body-medium · "Allow"
    FRAME option 240x44 [FILL/HUG] · horizontal pad 10/0/10/0 gap 0 · fill color/bg/subtle · r999
      TEXT optionLabel 85x24 [FIXED/FIXED] · fill color/brand/primary · mobile/body-medium · "Don’t allow"
```

**The prompt fires right after registration, not when the Notifications tab is first opened**
(amendment A10 to FR-NOTIF-09). One line of context sits behind it — `contextLine` — saying what
notifications are for, so the OS dialog is never the first thing that explains itself. The backdrop is the
Browse shell with no results yet: location is asked next, on `3.3`, so nothing below it could be true yet.

**Both answers go on to `3.3`.** Denying is a working state, not a detour: the history still records
everything (FR-NOTIF-09) and `3.10pd` is what it looks like that evening.

### `3.3` — Location permission request (dialog)

**Opens over** the Browse shell, after `3.9`  ·  **While using the app** / **Only this time** → `3.1`  ·  **Don't allow** → `3.4`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/80/16 gap 12
    TEXT screenTitle 87x32 [HUG/HUG] · fill color/text/primary · mobile/display · "Browse"
    TEXT contextLine 328x32 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "YouthLink asks for your location so it can show gigs within 5 km of you."
    FRAME searchBar 328x44 [FILL/FIXED] · fill color/bg/default · stroke color/border/default 1 · r12
      ELLIPSE Ellipse 12x12 [FIXED/FIXED] @14,14 · stroke color/text/secondary 1.8
      VECTOR Vector 4x4 [FIXED/FIXED] @25,25 · stroke color/text/secondary 1.8
      TEXT Search gigs 78x20 [FIXED/FIXED] @36,14 · fill color/text/secondary · mobile/secondary · "Search gigs"
    FRAME controls 328x44 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Input/Chip 69x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
        TEXT label 41x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Filters"
      INSTANCE Input/Chip 140x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
        TEXT label 112x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Sort: Urgent first"
      INSTANCE Input/Chip 69x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
        TEXT label 41x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Saved"
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Worker} · [standard, see header]
  RECTANGLE scrim 360x800 [FIXED/FIXED] @0,0 · fill color/overlay/scrim · opacity 40%
  INSTANCE OS/PermissionDialog 280x288 [FIXED/HUG] @40,256 · vertical pad 20/20/16/20 gap 12 · fill color/bg/default · r12 · {Context=Location}
    FRAME icon-location 24x24 [FIXED/FIXED]
      VECTOR Vector 16x19 [FIXED/FIXED] @4,3 · stroke color/text/secondary 1.8
      ELLIPSE Ellipse 5x5 [FIXED/FIXED] @10,8 · stroke color/text/secondary 1.8
    TEXT question 240x48 [FIXED/HUG] · fill color/text/primary · mobile/body · align center · "Allow YouthLink to access this device's location?"
    FRAME option 240x44 [FILL/HUG] · horizontal pad 10/0/10/0 gap 0 · fill color/bg/subtle · r999
      TEXT optionLabel 151x24 [FIXED/FIXED] · fill color/brand/primary · mobile/body-medium · "While using the app"
    FRAME option 240x44 [FILL/HUG] · horizontal pad 10/0/10/0 gap 0 · fill color/bg/subtle · r999
      TEXT optionLabel 106x24 [FIXED/FIXED] · fill color/brand/primary · mobile/body-medium · "Only this time"
    FRAME option 240x44 [FILL/HUG] · horizontal pad 10/0/10/0 gap 0 · fill color/bg/subtle · r999
      TEXT optionLabel 85x24 [FIXED/FIXED] · fill color/brand/primary · mobile/body-medium · "Don’t allow"
```

**The location prompt fires on first entry to Browse** (FR-DISC-02, A10), over the same shell as
`3.9`, with its own line of context: *"YouthLink asks for your location so it can show gigs within 5 km of
you."* The two prompts are sequential on purpose — one question per screen, each with its reason.

**Why the backdrop has no results.** Until the answer, the app has no location to search from. The
permission backdrops are the only two in the file that match no other frame, and they are the only two
allowed to.

### `3.4` — Manual location fallback

**Reached from** `3.3` (Don't allow)  ·  **Leads to** `3.2` ("Show gigs")  ·  **Exits** back → `3.1`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Set your location"
  FRAME content 360x744 [FILL/FILL] · vertical pad 24/16/24/16 gap 16
    TEXT note 328x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Location is off. Pick your area to see gigs near you."
    INSTANCE Input/Select 328x74 [FIXED/HUG] · vertical pad 0 gap 6 · {State=Selected}
      TEXT label 31x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Area"
      FRAME field 328x48 [FILL/HUG] · horizontal pad 12 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT value 294x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Homagama"
        VECTOR chevron 10x5 [FIXED/FIXED] · stroke color/text/secondary 1.8
    FRAME spacer-grow 8x486 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 80x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Show gigs"
```

The manual fallback FR-DISC-02 requires. **This user picks Homagama** — the demo's first-run user, not
Kavindu. Homagama is chosen because it is sparse: fewer than five gigs lie within 5 km of it, which is the
condition `3.2` shows.

Not drawn: the *permanently denied* case, where the OS no longer shows the dialogue. A10 routes it
straight here, with a hint that permission can be restored in system settings — see *States not drawn*.

### `3.2` — Browse · search widened automatically (Homagama)

**Reached from** `3.4`  ·  **Leads to** `3.12`, `3.12d`, `3.12c`, `3.12s`, `3.12h` (one per card)

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    TEXT screenTitle 87x32 [HUG/HUG] · fill color/text/primary · mobile/display · "Browse"
    TEXT radiusLine 328x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Fewer than 5 gigs within 5 km of Homagama — widened to 20 km. 5 found."
    INSTANCE Display/ListingCard 328x164 [FILL/HUG] · vertical pad 16 gap 6 · fill color/bg/default · r8 · {State=Urgent}
      INSTANCE Display/Badge 74x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/state/urgent 1 · r999 · {Family=Urgent, Value=Default}
        VECTOR triangle 10x9 [FIXED/FIXED] · fill color/state/urgent
        TEXT label 39x16 [HUG/HUG] · fill color/state/urgent · mobile/caption · "Urgent"
      TEXT title 296x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Event setup crew (3 needed)"
      TEXT meta 296x20 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "Event setup · Colombo 04 · 17.1 km away"
      TEXT pay 296x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Rs 6,000 for the job · per worker"
      TEXT fill 296x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "1 of 3 filled · Starts Sat 5:00 AM"
    INSTANCE Display/ListingCard 328x134 [FILL/HUG] · vertical pad 16 gap 6 · fill color/bg/default · r8 · {State=Default}
      TEXT title 296x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Delivery rider — mornings"
      TEXT meta 296x20 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "Delivery · Maharagama · 8.6 km away"
      TEXT pay 296x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Rs 2,500 per day"
      TEXT fill 296x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "2 of 2 open · Starts Mon 7 Sep 2026, 6:00 AM"
    INSTANCE Display/ListingCard 328x134 [FILL/HUG] · vertical pad 16 gap 6 · fill color/bg/default · r8 · {State=Default}
      TEXT title 296x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Café service crew — evenings"
      TEXT meta 296x20 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "Food service · Nugegoda · 12.4 km away"
      TEXT pay 296x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Rs 3,000 per day"
      TEXT fill 296x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "2 of 2 open · Starts Fri 4 Sep 2026, 6:00 PM"
    INSTANCE Display/ListingCard 328x134 [FILL/HUG] · vertical pad 16 gap 6 · fill color/bg/default · r8 · {State=Default}
      TEXT title 296x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Shop assistant — weekend"
      TEXT meta 296x20 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "Retail · Nugegoda · 12.9 km away"
      TEXT pay 296x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Rs 3,500 per day"
      TEXT fill 296x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "1 of 1 open · Starts Sat 8:00 AM"
    INSTANCE Display/ListingCard 328x134 [FILL/HUG] · vertical pad 16 gap 6 · fill color/bg/default · r8 · {State=Default}
      TEXT title 296x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "House cleaning — Saturday"
      TEXT meta 296x20 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "Cleaning · Colombo 05 · 15.7 km away"
      TEXT pay 296x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Rs 4,500 for the job"
      TEXT fill 296x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "1 of 1 open · Starts Sat 5 Sep 2026, 8:00 AM"
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Worker} · [standard, see header]
```

**FR-DISC-01's auto-expansion, drawn as its result.** Fewer than 5 gigs were within 5 km of
Homagama, so the search widened in 5 km steps and stopped at 20 km, the first radius with five or more:
Delivery rider at 8.6 km is the only gig within 10 km, and 15 km still holds only three. Five cards, sorted
urgent first, then nearest.

`radiusLine` says so in one sentence. NFR-PERF-03 asks for the widening to *run* as one continuous
loading state; the skeleton for that is `3.1ldg`, and this screen is what it resolves to.

### `3.1` — Browse, radius results

**Reached from** `3.3`, `3.1ldg` (after 1.5 s), `3.5c`, `3.6`, `3.10z`, `3.4`'s back, and the Browse tab on every worker screen  ·  **Leads to** `3.7` (search), `3.5` (Filters), `3.6` (Sort), `3.8` (Saved), `3.12`, `3.12c`, `3.12h`, `3.12s`, `3.12d` (cards), `3.10x` (Notifications tab)

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/80/16 gap 12
    TEXT screenTitle 87x32 [HUG/HUG] · fill color/text/primary · mobile/display · "Browse"
    TEXT radiusLine 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Showing gigs within 5 km of Nugegoda"
    FRAME searchBar 328x44 [FILL/FIXED] · fill color/bg/default · stroke color/border/default 1 · r12
      ELLIPSE Ellipse 12x12 [FIXED/FIXED] @14,14 · stroke color/text/secondary 1.8
      VECTOR Vector 4x4 [FIXED/FIXED] @25,25 · stroke color/text/secondary 1.8
      TEXT Search gigs 78x20 [FIXED/FIXED] @36,14 · fill color/text/secondary · mobile/secondary · "Search gigs"
    FRAME controls 328x44 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Input/Chip 69x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
        TEXT label 41x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Filters"
      INSTANCE Input/Chip 140x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
        TEXT label 112x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Sort: Urgent first"
      INSTANCE Input/Chip 69x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
        TEXT label 41x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Saved"
    INSTANCE Display/ListingCard 328x164 [FILL/HUG] · vertical pad 16 gap 6 · fill color/bg/default · r8 · {State=Urgent}
      INSTANCE Display/Badge 74x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/state/urgent 1 · r999 · {Family=Urgent, Value=Default}
        VECTOR triangle 10x9 [FIXED/FIXED] · fill color/state/urgent
        TEXT label 39x16 [HUG/HUG] · fill color/state/urgent · mobile/caption · "Urgent"
      TEXT title 296x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Event setup crew (3 needed)"
      TEXT meta 296x20 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "Event setup · Colombo 04 · 4.5 km away"
      TEXT pay 296x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Rs 6,000 for the job · per worker"
      TEXT fill 296x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "1 of 3 filled · Starts Sat 5:00 AM"
    INSTANCE Display/ListingCard 328x134 [FILL/HUG] · vertical pad 16 gap 6 · fill color/bg/default · r8 · {State=Default}
      TEXT title 296x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Café service crew — evenings"
      TEXT meta 296x20 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "Food service · Nugegoda · 1.9 km away"
      TEXT pay 296x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Rs 3,000 per day"
      TEXT fill 296x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "2 of 2 open · Starts Fri 4 Sep 2026, 6:00 PM"
    INSTANCE Display/ListingCard 328x134 [FILL/HUG] · vertical pad 16 gap 6 · fill color/bg/default · r8 · {State=Default}
      TEXT title 296x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "House cleaning — Saturday"
      TEXT meta 296x20 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "Cleaning · Colombo 05 · 3.1 km away"
      TEXT pay 296x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Rs 4,500 for the job"
      TEXT fill 296x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "1 of 1 open · Starts Sat 5 Sep 2026, 8:00 AM"
    INSTANCE Display/ListingCard 328x134 [FILL/HUG] · vertical pad 16 gap 6 · fill color/bg/default · r8 · {State=Default}
      TEXT title 296x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Shop assistant — weekend"
      TEXT meta 296x20 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "Retail · Nugegoda · 3.4 km away"
      TEXT pay 296x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Rs 3,500 per day"
      TEXT fill 296x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "1 of 1 open · Starts Sat 8:00 AM"
    INSTANCE Display/ListingCard 328x134 [FILL/HUG] · vertical pad 16 gap 6 · fill color/bg/default · r8 · {State=Default}
      TEXT title 296x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Delivery rider — mornings"
      TEXT meta 296x20 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "Delivery · Maharagama · 4.6 km away"
      TEXT pay 296x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Rs 2,500 per day"
      TEXT fill 296x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "2 of 2 open · Starts Mon 7 Sep 2026, 6:00 AM"
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Worker} · [standard, see header]
```

**Kavindu's Browse on Thursday 27 Aug, about 7:45 AM** — five gigs within 5 km of Nugegoda, so no
widening. Sorted by FR-DISC-05's default: urgent first, then nearest first (Café 1.9 km, House cleaning
3.1 km, Shop assistant 3.4 km, Delivery rider 4.6 km).

**Only Event setup is urgent**, and that is arithmetic rather than styling: FR-POST-07 makes a posting
urgent when it starts 48 hours or less away, and Event setup starts Sat 29 Aug 5:00 AM. Shop assistant
(Sat 8:00 AM) is just outside the window; Café and House cleaning are the following weekend, which is why
their cards carry a date rather than a weekday.

**The chip row wraps.** `controls` is FILL with wrap on, so at 130% `Saved` drops to a second line — see
`3.1x130`. At 100% nothing about that is visible.

### `3.1ldg` — Browse, radius results · loading [against E10]

**Reached from** the Browse tab while results load  ·  **Advances to** `3.1` after 1.5s †  ·  **Leads to** `3.10x` (Notifications tab)

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/80/16 gap 12
    TEXT screenTitle 87x32 [HUG/HUG] · fill color/text/primary · mobile/display · "Browse"
    TEXT radiusLine 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Showing gigs within 5 km of Nugegoda"
    FRAME searchBar 328x44 [FILL/FIXED] · fill color/bg/default · stroke color/border/default 1 · r12
      ELLIPSE Ellipse 12x12 [FIXED/FIXED] @14,14 · stroke color/text/secondary 1.8
      VECTOR Vector 4x4 [FIXED/FIXED] @25,25 · stroke color/text/secondary 1.8
      TEXT Search gigs 78x20 [FIXED/FIXED] @36,14 · fill color/text/secondary · mobile/secondary · "Search gigs"
    FRAME controls 328x44 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Input/Chip 69x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
        TEXT label 41x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Filters"
      INSTANCE Input/Chip 140x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
        TEXT label 112x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Sort: Urgent first"
      INSTANCE Input/Chip 69x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
        TEXT label 41x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Saved"
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
  [frame reaction] AFTER_TIMEOUT 1.5s
```

The loading skeleton — `Feedback/LoadingState` ×3 below the real header, search and chips, so
the page's shape arrives before its data. **Advances by itself after 1.5 s** (a frame reaction, not a
tap). The E10 note in the name records that no requirement yet governs loading states; amendment E10
proposes one.

### `3.1ofl` — Browse, radius results · offline, cached

**Reached from** the Browse tab with no connection  ·  **Leads to** `3.12ofl` (the card), `3.10x` (Notifications tab)

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/80/16 gap 12
    INSTANCE offlineBar 328x36 [FIXED/FIXED] · horizontal pad 8/12/8/12 gap 0 · fill color/bg/subtle · stroke color/border/default 1 · r8 · of Feedback/OfflineBar
      TEXT message 302x20 [FILL/HUG] · fill color/text/primary · mobile/secondary · "Offline — showing gigs saved on your phone"
    TEXT screenTitle 87x32 [HUG/HUG] · fill color/text/primary · mobile/display · "Browse"
    TEXT radiusLine 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "1 gig saved on this phone · within 5 km of Nugegoda"
    FRAME searchBar 328x44 [FILL/FIXED] · fill color/bg/default · stroke color/border/default 1 · r12
      ELLIPSE Ellipse 12x12 [FIXED/FIXED] @14,14 · stroke color/text/secondary 1.8
      VECTOR Vector 4x4 [FIXED/FIXED] @25,25 · stroke color/text/secondary 1.8
      TEXT Search gigs 78x20 [FIXED/FIXED] @36,14 · fill color/text/secondary · mobile/secondary · "Search gigs"
    FRAME controls 328x44 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Input/Chip 69x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
        TEXT label 41x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Filters"
      INSTANCE Input/Chip 140x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
        TEXT label 112x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Sort: Urgent first"
      INSTANCE Input/Chip 69x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
        TEXT label 41x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Saved"
    INSTANCE Display/ListingCard 328x164 [FILL/HUG] · vertical pad 16 gap 6 · fill color/bg/default · r8 · {State=Urgent}
      INSTANCE Display/Badge 74x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/state/urgent 1 · r999 · {Family=Urgent, Value=Default}
        VECTOR triangle 10x9 [FIXED/FIXED] · fill color/state/urgent
        TEXT label 39x16 [HUG/HUG] · fill color/state/urgent · mobile/caption · "Urgent"
      TEXT title 296x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Event setup crew (3 needed)"
      TEXT meta 296x20 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "Event setup · Colombo 04 · 4.5 km away"
      TEXT pay 296x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Rs 6,000 for the job · per worker"
      TEXT fill 296x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "1 of 3 filled · Starts Sat 5:00 AM"
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Worker} · [standard, see header]
```

**Offline, from cache** (NFR-USE-01: already-loaded listings stay viewable). `Feedback/OfflineBar`
leads, and the list holds the one listing whose detail is cached, `3.12ofl`. The chips and search carry no
reactions: filtering and searching need the server.

### `3.1x130` — Browse, radius results · 130% text expansion (specimen, not in the demo)

**Reached from** nothing — a specimen  ·  **Leads to** the same destinations as `3.1`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/80/16 gap 12
    TEXT screenTitle 112x42 [HUG/HUG] · fill color/text/primary · (no style) · "Browse"
    TEXT radiusLine 328x21 [FIXED/HUG] · fill color/text/secondary · (no style) · "Showing gigs within 5 km of Nugegoda"
    FRAME searchBar 328x44 [FILL/FIXED] · fill color/bg/default · stroke color/border/default 1 · r12
      ELLIPSE Ellipse 12x12 [FIXED/FIXED] @14,14 · stroke color/text/secondary 1.8
      VECTOR Vector 4x4 [FIXED/FIXED] @25,25 · stroke color/text/secondary 1.8
      TEXT Search gigs 100x26 [FIXED/FIXED] @36,14 · fill color/text/secondary · (no style) · "Search gigs"
    FRAME controls 328x108 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Input/Chip 81x50 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
        TEXT label 53x26 [HUG/HUG] · fill color/text/primary · (no style) · "Filters"
      INSTANCE Input/Chip 171x50 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
        TEXT label 143x26 [HUG/HUG] · fill color/text/primary · (no style) · "Sort: Urgent first"
      INSTANCE Input/Chip 81x50 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
        TEXT label 53x26 [HUG/HUG] · fill color/text/primary · (no style) · "Saved"
    INSTANCE Display/ListingCard 328x251 [FILL/HUG] · vertical pad 16 gap 6 · fill color/bg/default · r8 · {State=Urgent}
      INSTANCE Display/Badge 87x29 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/state/urgent 1 · r999 · {Family=Urgent, Value=Default}
        VECTOR triangle 10x9 [FIXED/FIXED] · fill color/state/urgent
        TEXT label 52x21 [HUG/HUG] · fill color/state/urgent · (no style) · "Urgent"
      TEXT title 296x31 [FILL/HUG] · fill color/text/primary · (no style) · "Event setup crew (3 needed)"
      TEXT meta 296x52 [FILL/HUG] · fill color/text/secondary · (no style) · "Event setup · Colombo 04 · 4.5 km away"
      TEXT pay 296x62 [FILL/HUG] · fill color/text/primary · (no style) · "Rs 6,000 for the job · per worker"
      TEXT fill 296x21 [FILL/HUG] · fill color/text/secondary · (no style) · "1 of 3 filled · Starts Sat 5:00 AM"
    INSTANCE Display/ListingCard 328x237 [FILL/HUG] · vertical pad 16 gap 6 · fill color/bg/default · r8 · {State=Default}
      TEXT title 296x62 [FILL/HUG] · fill color/text/primary · (no style) · "Café service crew — evenings"
      TEXT meta 296x52 [FILL/HUG] · fill color/text/secondary · (no style) · "Food service · Nugegoda · 1.9 km away"
      TEXT pay 296x31 [FILL/HUG] · fill color/text/primary · (no style) · "Rs 3,000 per day"
      TEXT fill 296x42 [FILL/HUG] · fill color/text/secondary · (no style) · "2 of 2 open · Starts Fri 4 Sep 2026, 6:00 PM"
    INSTANCE Display/ListingCard 328x206 [FILL/HUG] · vertical pad 16 gap 6 · fill color/bg/default · r8 · {State=Default}
      TEXT title 296x31 [FILL/HUG] · fill color/text/primary · (no style) · "House cleaning — Saturday"
      TEXT meta 296x52 [FILL/HUG] · fill color/text/secondary · (no style) · "Cleaning · Colombo 05 · 3.1 km away"
      TEXT pay 296x31 [FILL/HUG] · fill color/text/primary · (no style) · "Rs 4,500 for the job"
      TEXT fill 296x42 [FILL/HUG] · fill color/text/secondary · (no style) · "1 of 1 open · Starts Sat 5 Sep 2026, 8:00 AM"
    INSTANCE Display/ListingCard 328x159 [FILL/HUG] · vertical pad 16 gap 6 · fill color/bg/default · r8 · {State=Default}
      TEXT title 296x31 [FILL/HUG] · fill color/text/primary · (no style) · "Shop assistant — weekend"
      TEXT meta 296x26 [FILL/HUG] · fill color/text/secondary · (no style) · "Retail · Nugegoda · 3.4 km away"
      TEXT pay 296x31 [FILL/HUG] · fill color/text/primary · (no style) · "Rs 3,500 per day"
      TEXT fill 296x21 [FILL/HUG] · fill color/text/secondary · (no style) · "1 of 1 open · Starts Sat 8:00 AM"
    INSTANCE Display/ListingCard 328x206 [FILL/HUG] · vertical pad 16 gap 6 · fill color/bg/default · r8 · {State=Default}
      TEXT title 296x31 [FILL/HUG] · fill color/text/primary · (no style) · "Delivery rider — mornings"
      TEXT meta 296x52 [FILL/HUG] · fill color/text/secondary · (no style) · "Delivery · Maharagama · 4.6 km away"
      TEXT pay 296x31 [FILL/HUG] · fill color/text/primary · (no style) · "Rs 2,500 per day"
      TEXT fill 296x42 [FILL/HUG] · fill color/text/secondary · (no style) · "2 of 2 open · Starts Mon 7 Sep 2026, 6:00 AM"
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Worker} · [standard, see header]
```

The 130% text-expansion specimen. Every text is scaled ×1.3 and carries **no text style**
(design-system §8 explains why a style would destroy the demonstration). What it proves: card text wraps
inside the card (the café title takes two lines), the chip row wraps (`controls` 328×108), and the tab
labels truncate rather than collide. **Any bulk edit must skip a frame whose id ends `x130`.**

### `3.5` — Filters

**Reached from** `3.1`, `3.1f`, `3.1x130` (Filters)  ·  **Leads to** `3.1f` ("Show results"), `3.5c` ("Clear all")  ·  **Exits** back → history

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Filters"
  FRAME content 360x744 [FILL/FILL] · vertical pad 20/16/24/16 gap 14
    TEXT groupCat 65x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "CATEGORY"
    FRAME categoryChips 328x148 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Input/Chip 65x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
        TEXT label 37x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Retail"
      INSTANCE Input/Chip 82x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
        TEXT label 54x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Delivery"
      INSTANCE Input/Chip 119x44 [HUG/HUG] · horizontal pad 10/14/10/14 gap 0 · fill color/brand/primary · r999 · {Kind=Select, State=Selected}
        TEXT label 91x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Event setup"
      INSTANCE Input/Chip 77x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
        TEXT label 49x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Moving"
      INSTANCE Input/Chip 113x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
        TEXT label 85x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Food service"
      INSTANCE Input/Chip 83x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
        TEXT label 55x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Tutoring"
      INSTANCE Input/Chip 86x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
        TEXT label 58x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Cleaning"
    TEXT groupArr 92x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "ARRANGEMENT"
    FRAME arrangementChips 328x96 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Input/Chip 117x44 [HUG/HUG] · horizontal pad 10/14/10/14 gap 0 · fill color/brand/primary · r999 · {Kind=Select, State=Selected}
        TEXT label 89x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "One-off gig"
      INSTANCE Input/Chip 115x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
        TEXT label 87x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Part-time job"
      INSTANCE Input/Chip 94x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
        TEXT label 66x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Internship"
    TEXT sessionNote 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Filters reset when you close the app."
    INSTANCE Action/Link 61x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
      TEXT label 61x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Clear all"
    FRAME spacer-grow 8x218 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 99x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Show results"
```

Category and arrangement chips (FR-DISC-03), with `sessionNote` stating FR-DISC-07's rule —
*"Filters reset when you close the app."* Two are selected here: Event setup, One-off gig.

### `3.5c` — Filters · cleared

**Reached from** `3.5`  ·  **Leads to** `3.1` ("Show results")  ·  **Exits** back → `3.1`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Filters"
  FRAME content 360x744 [FILL/FILL] · vertical pad 20/16/24/16 gap 14
    TEXT groupCat 65x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "CATEGORY"
    FRAME categoryChips 328x148 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Input/Chip 65x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
        TEXT label 37x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Retail"
      INSTANCE Input/Chip 82x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
        TEXT label 54x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Delivery"
      INSTANCE Input/Chip 107x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
        TEXT label 79x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Event setup"
      INSTANCE Input/Chip 77x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
        TEXT label 49x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Moving"
      INSTANCE Input/Chip 113x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
        TEXT label 85x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Food service"
      INSTANCE Input/Chip 83x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
        TEXT label 55x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Tutoring"
      INSTANCE Input/Chip 86x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
        TEXT label 58x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Cleaning"
    TEXT groupArr 92x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "ARRANGEMENT"
    FRAME arrangementChips 328x96 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Input/Chip 105x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
        TEXT label 77x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "One-off gig"
      INSTANCE Input/Chip 115x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
        TEXT label 87x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Part-time job"
      INSTANCE Input/Chip 94x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
        TEXT label 66x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Internship"
    TEXT sessionNote 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Filters reset when you close the app."
    FRAME spacer-grow 8x276 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 99x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Show results"
```

The same sheet after "Clear all": every chip back to `State=Default`, and the Clear link gone
because there is nothing left to clear.

### `3.1f` — Browse, radius results · filtered (Event setup · One-off)

**Reached from** `3.5`, `3.6f`  ·  **Leads to** `3.7`, `3.5`, `3.6f` (Sort), `3.8`, `3.12`, `3.10x` (Notifications tab)

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    TEXT screenTitle 87x32 [HUG/HUG] · fill color/text/primary · mobile/display · "Browse"
    TEXT radiusLine 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "1 gig within 5 km of Nugegoda · 2 filters on"
    FRAME searchBar 328x44 [FILL/FIXED] · fill color/bg/default · stroke color/border/default 1 · r12
      ELLIPSE Ellipse 12x12 [FIXED/FIXED] @14,14 · stroke color/text/secondary 1.8
      VECTOR Vector 4x4 [FIXED/FIXED] @25,25 · stroke color/text/secondary 1.8
      TEXT Search gigs 78x20 [FIXED/FIXED] @36,14 · fill color/text/secondary · mobile/secondary · "Search gigs"
    FRAME controls 328x44 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Input/Chip 99x44 [HUG/HUG] · horizontal pad 10/14/10/14 gap 0 · fill color/brand/primary · r999 · {Kind=Select, State=Selected}
        TEXT label 71x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Filters · 2"
      INSTANCE Input/Chip 140x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
        TEXT label 112x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Sort: Urgent first"
      INSTANCE Input/Chip 69x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
        TEXT label 41x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Saved"
    INSTANCE Display/ListingCard 328x164 [FILL/HUG] · vertical pad 16 gap 6 · fill color/bg/default · r8 · {State=Urgent}
      INSTANCE Display/Badge 74x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/state/urgent 1 · r999 · {Family=Urgent, Value=Default}
        VECTOR triangle 10x9 [FIXED/FIXED] · fill color/state/urgent
        TEXT label 39x16 [HUG/HUG] · fill color/state/urgent · mobile/caption · "Urgent"
      TEXT title 296x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Event setup crew (3 needed)"
      TEXT meta 296x20 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "Event setup · Colombo 04 · 4.5 km away"
      TEXT pay 296x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Rs 6,000 for the job · per worker"
      TEXT fill 296x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "1 of 3 filled · Starts Sat 5:00 AM"
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Worker} · [standard, see header]
```

Browse under the two filters from `3.5`: one result, and `radiusLine` counts the filters in
play — *"1 gig within 5 km of Nugegoda · 2 filters on"*. The Filters chip turns `State=Selected` and shows
its count.

### `3.6` — Sort options

**Opens over** `3.1` (the Sort chip)  ·  **Every option, and the scrim** → `3.1`

```
FRAME 360x800 · absolute · fill color/bg/subtle
  FRAME content 360x736 [FIXED/FIXED] @0,0 · vertical pad 66/16/80/16 gap 12
    TEXT screenTitle 87x32 [HUG/HUG] · fill color/text/primary · mobile/display · "Browse"
    TEXT radiusLine 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Showing gigs within 5 km of Nugegoda"
    FRAME searchBar 328x44 [FILL/FIXED] · fill color/bg/default · stroke color/border/default 1 · r12
      ELLIPSE Ellipse 12x12 [FIXED/FIXED] @14,14 · stroke color/text/secondary 1.8
      VECTOR Vector 4x4 [FIXED/FIXED] @25,25 · stroke color/text/secondary 1.8
      TEXT Search gigs 78x20 [FIXED/FIXED] @36,14 · fill color/text/secondary · mobile/secondary · "Search gigs"
    FRAME controls 328x44 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Input/Chip 69x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
        TEXT label 41x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Filters"
      INSTANCE Input/Chip 140x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
        TEXT label 112x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Sort: Urgent first"
      INSTANCE Input/Chip 69x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
        TEXT label 41x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Saved"
    INSTANCE Display/ListingCard 328x164 [FILL/HUG] · vertical pad 16 gap 6 · fill color/bg/default · r8 · {State=Urgent}
      INSTANCE Display/Badge 74x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/state/urgent 1 · r999 · {Family=Urgent, Value=Default}
        VECTOR triangle 10x9 [FIXED/FIXED] · fill color/state/urgent
        TEXT label 39x16 [HUG/HUG] · fill color/state/urgent · mobile/caption · "Urgent"
      TEXT title 296x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Event setup crew (3 needed)"
      TEXT meta 296x20 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "Event setup · Colombo 04 · 4.5 km away"
      TEXT pay 296x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Rs 6,000 for the job · per worker"
      TEXT fill 296x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "1 of 3 filled · Starts Sat 5:00 AM"
    INSTANCE Display/ListingCard 328x134 [FILL/HUG] · vertical pad 16 gap 6 · fill color/bg/default · r8 · {State=Default}
      TEXT title 296x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Café service crew — evenings"
      TEXT meta 296x20 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "Food service · Nugegoda · 1.9 km away"
      TEXT pay 296x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Rs 3,000 per day"
      TEXT fill 296x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "2 of 2 open · Starts Fri 4 Sep 2026, 6:00 PM"
    INSTANCE Display/ListingCard 328x134 [FILL/HUG] · vertical pad 16 gap 6 · fill color/bg/default · r8 · {State=Default}
      TEXT title 296x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "House cleaning — Saturday"
      TEXT meta 296x20 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "Cleaning · Colombo 05 · 3.1 km away"
      TEXT pay 296x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Rs 4,500 for the job"
      TEXT fill 296x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "1 of 1 open · Starts Sat 5 Sep 2026, 8:00 AM"
    INSTANCE Display/ListingCard 328x134 [FILL/HUG] · vertical pad 16 gap 6 · fill color/bg/default · r8 · {State=Default}
      TEXT title 296x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Shop assistant — weekend"
      TEXT meta 296x20 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "Retail · Nugegoda · 3.4 km away"
      TEXT pay 296x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Rs 3,500 per day"
      TEXT fill 296x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "1 of 1 open · Starts Sat 8:00 AM"
    INSTANCE Display/ListingCard 328x134 [FILL/HUG] · vertical pad 16 gap 6 · fill color/bg/default · r8 · {State=Default}
      TEXT title 296x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Delivery rider — mornings"
      TEXT meta 296x20 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "Delivery · Maharagama · 4.6 km away"
      TEXT pay 296x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Rs 2,500 per day"
      TEXT fill 296x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "2 of 2 open · Starts Mon 7 Sep 2026, 6:00 AM"
  INSTANCE Chrome/TabBar 360x64 [FIXED/FIXED] @0,736 · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Worker} · [standard, see header]
  RECTANGLE scrim 360x800 [FIXED/FIXED] @0,0 · fill color/overlay/scrim · opacity 40%
  INSTANCE Display/BottomSheet 360x274 [FIXED/HUG] @0,526 · vertical pad 10/16/20/16 gap 4 · fill color/bg/default
    RECTANGLE handle 36x4 [FIXED/FIXED] · fill color/border/default · r999
    TEXT sheetTitle 328x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Sort by"
    FRAME option-Urgent first 328x48 [FILL/HUG] · horizontal pad 12 gap 0 · fill color/bg/subtle · r8
      TEXT optionLabel 86x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Urgent first"
    FRAME option-Closest first 328x48 [FILL/HUG] · horizontal pad 12 gap 0 · r8
      TEXT optionLabel 92x24 [HUG/HUG] · fill color/text/primary · mobile/body · "Closest first"
    FRAME option-Newest first 328x48 [FILL/HUG] · horizontal pad 12 gap 0 · r8
      TEXT optionLabel 92x24 [HUG/HUG] · fill color/text/primary · mobile/body · "Newest first"
    FRAME option-Highest pay first 328x48 [FILL/HUG] · horizontal pad 12 gap 0 · r8
      TEXT optionLabel 125x24 [HUG/HUG] · fill color/text/primary · mobile/body · "Highest pay first"
```

A `Display/BottomSheet` over `3.1`. The first option is highlighted because it is the current
sort. **The scrim dismisses** (a sheet's scrim does; a dialog's does not — design-system §4). The frame is
the one absolutely-positioned screen in the Browse family, which is why its `content` and tab bar carry
coordinates.

### `3.6f` — Sort options · over the filtered Browse

**Opens over** `3.1f`  ·  **Every option, and the scrim** → `3.1f`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    TEXT screenTitle 87x32 [HUG/HUG] · fill color/text/primary · mobile/display · "Browse"
    TEXT radiusLine 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "1 gig within 5 km of Nugegoda · 2 filters on"
    FRAME searchBar 328x44 [FILL/FIXED] · fill color/bg/default · stroke color/border/default 1 · r12
      ELLIPSE Ellipse 12x12 [FIXED/FIXED] @14,14 · stroke color/text/secondary 1.8
      VECTOR Vector 4x4 [FIXED/FIXED] @25,25 · stroke color/text/secondary 1.8
      TEXT Search gigs 78x20 [FIXED/FIXED] @36,14 · fill color/text/secondary · mobile/secondary · "Search gigs"
    FRAME controls 328x44 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Input/Chip 99x44 [HUG/HUG] · horizontal pad 10/14/10/14 gap 0 · fill color/brand/primary · r999 · {Kind=Select, State=Selected}
        TEXT label 71x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Filters · 2"
      INSTANCE Input/Chip 140x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
        TEXT label 112x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Sort: Urgent first"
      INSTANCE Input/Chip 69x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
        TEXT label 41x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Saved"
    INSTANCE Display/ListingCard 328x164 [FILL/HUG] · vertical pad 16 gap 6 · fill color/bg/default · r8 · {State=Urgent}
      INSTANCE Display/Badge 74x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/state/urgent 1 · r999 · {Family=Urgent, Value=Default}
        VECTOR triangle 10x9 [FIXED/FIXED] · fill color/state/urgent
        TEXT label 39x16 [HUG/HUG] · fill color/state/urgent · mobile/caption · "Urgent"
      TEXT title 296x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Event setup crew (3 needed)"
      TEXT meta 296x20 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "Event setup · Colombo 04 · 4.5 km away"
      TEXT pay 296x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Rs 6,000 for the job · per worker"
      TEXT fill 296x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "1 of 3 filled · Starts Sat 5:00 AM"
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Worker} · [standard, see header]
  RECTANGLE scrim 360x800 [FIXED/FIXED] @0,0 · fill color/overlay/scrim · opacity 40%
  INSTANCE Display/BottomSheet 360x274 [FIXED/HUG] @0,526 · vertical pad 10/16/20/16 gap 4 · fill color/bg/default
    RECTANGLE handle 36x4 [FIXED/FIXED] · fill color/border/default · r999
    TEXT sheetTitle 328x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Sort by"
    FRAME option-Urgent first 328x48 [FILL/HUG] · horizontal pad 12 gap 0 · fill color/bg/subtle · r8
      TEXT optionLabel 86x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Urgent first"
    FRAME option-Closest first 328x48 [FILL/HUG] · horizontal pad 12 gap 0 · r8
      TEXT optionLabel 92x24 [HUG/HUG] · fill color/text/primary · mobile/body · "Closest first"
    FRAME option-Newest first 328x48 [FILL/HUG] · horizontal pad 12 gap 0 · r8
      TEXT optionLabel 92x24 [HUG/HUG] · fill color/text/primary · mobile/body · "Newest first"
    FRAME option-Highest pay first 328x48 [FILL/HUG] · horizontal pad 12 gap 0 · r8
      TEXT optionLabel 125x24 [HUG/HUG] · fill color/text/primary · mobile/body · "Highest pay first"
```

The same sheet over the filtered Browse, so choosing a sort keeps the filters.

### `3.7` — Keyword search

**Reached from** `3.1`, `3.1f`, `3.1x130` (the search bar)  ·  **Leads to** `3.12`  ·  **Exits** back → history

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Search"
  FRAME content 360x744 [FILL/FILL] · vertical pad 20/16/24/16 gap 14
    FRAME searchField 328x48 [FILL/HUG] · horizontal pad 12 gap 8 · fill color/bg/subtle · r8
      TEXT query 90x24 [HUG/HUG] · fill color/text/primary · mobile/body · "event setup"
    TEXT resultCount 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "1 result within 5 km"
    INSTANCE Display/ListingCard 328x164 [FILL/HUG] · vertical pad 16 gap 6 · fill color/bg/default · r8 · {State=Urgent}
      INSTANCE Display/Badge 74x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/state/urgent 1 · r999 · {Family=Urgent, Value=Default}
        VECTOR triangle 10x9 [FIXED/FIXED] · fill color/state/urgent
        TEXT label 39x16 [HUG/HUG] · fill color/state/urgent · mobile/caption · "Urgent"
      TEXT title 296x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Event setup crew (3 needed)"
      TEXT meta 296x20 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "Event setup · Colombo 04 · 4.5 km away"
      TEXT pay 296x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Rs 6,000 for the job · per worker"
      TEXT fill 296x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "1 of 3 filled · Starts Sat 5:00 AM"
```

Keyword search (FR-DISC-04) is scoped by the radius, as the result count says: *"1 result within
5 km"*.

### `3.8` — Saved gigs

**Reached from** `3.1`, `3.1f`, `3.1x130` (Saved)  ·  **Leads to** `3.12h`, `3.12g`  ·  **Exits** back → history

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Saved gigs"
  FRAME content 360x744 [FILL/FILL] · vertical pad 20/16/24/16 gap 12
    FRAME savedDead 328x94 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/subtle · stroke color/border/default 1 · r8
      FRAME topRow 300x48 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 217x48 [FILL/HUG] · fill color/text/secondary · mobile/body-medium · "Event setup crew (3 needed)"
        INSTANCE Display/Badge 75x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/text/secondary
          TEXT label 43x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Expired"
      TEXT meta 187x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "No longer accepting applications"
    FRAME savedDead 328x70 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/subtle · stroke color/border/default 1 · r8
      FRAME topRow 300x24 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT title 217x24 [FILL/HUG] · fill color/text/secondary · mobile/body-medium · "House move helpers"
        INSTANCE Display/Badge 75x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
          ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/text/secondary
          TEXT label 43x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Expired"
      TEXT meta 187x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "No longer accepting applications"
    INSTANCE Display/ListingCard 328x134 [FILL/HUG] · vertical pad 16 gap 6 · fill color/bg/default · r8 · {State=Default}
      TEXT title 296x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "House cleaning — Saturday"
      TEXT meta 296x20 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "Cleaning · Colombo 05 · 3.1 km away"
      TEXT pay 296x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Rs 4,500 for the job"
      TEXT fill 296x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "1 of 1 open · Starts Sat 5 Sep 2026, 8:00 AM"
    INSTANCE Display/ListingCard 328x134 [FILL/HUG] · vertical pad 16 gap 6 · fill color/bg/default · r8 · {State=Default}
      TEXT title 296x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Data entry — work from home"
      TEXT meta 296x20 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "Other · Remote · no distance given"
      TEXT pay 296x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Rs 4,500 per day"
      TEXT fill 296x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "1 of 1 open · Start date not given"
```

**Saved gigs, read on or after Mon 31 Aug** — the day the scam posting appeared, which is why it is
here at all. By then Event setup has run (29 Aug), so it shows as an expired row, like House move helpers;
House cleaning (5 Sep) is still open. Expired rows are not links: there is nothing left to apply for.

### `3.12` — Listing detail, job-seeker view

**Reached from** `3.1`, `3.1f`, `3.1x130`, `3.2`, `3.7`, `3.10x`, `3.10pd`  ·  **Leads to** [M4](M4-applying.md) `4.1` (Apply)  ·  **Exits** back → history

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Gig"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 10
    TEXT title 328x28 [FIXED/HUG] · fill color/text/primary · mobile/title · "Event setup crew (3 needed)"
    FRAME badges 74x24 [HUG/HUG] · horizontal pad 0 gap 8
      INSTANCE Display/Badge 74x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/state/urgent 1 · r999 · {Family=Urgent, Value=Default}
        VECTOR triangle 10x9 [FIXED/FIXED] · fill color/state/urgent
        TEXT label 39x16 [HUG/HUG] · fill color/state/urgent · mobile/caption · "Urgent"
    TEXT meta 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Event setup · One-off gig"
    FRAME factsCard 328x98 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r10
      TEXT pay 300x26 [FIXED/HUG] · fill color/text/primary · mobile/display-number · "Rs 6,000 for the job"
      TEXT payBasis 72x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "per worker"
      TEXT fillStart 300x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "1 of 3 filled · Starts Sat 29 Aug 2026, 5:00 AM"
    TEXT description 328x40 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Help set up staging and seating for a weekend event at a Colombo 04 venue. Gloves provided."
    INSTANCE Display/MapArea 328x160 [FIXED/FIXED] · fill color/bg/subtle · stroke color/border/default 1 · r8 · {Kind=Area}
      LINE grid-h1 328x0 [FIXED/FIXED] @0,40 · stroke color/border/default 1
      LINE grid-h2 328x0 [FIXED/FIXED] @0,80 · stroke color/border/default 1
      LINE grid-h3 328x0 [FIXED/FIXED] @0,120 · stroke color/border/default 1
      LINE grid-v1 160x0 [FIXED/FIXED] @66,0 · stroke color/border/default 1
      LINE grid-v2 160x0 [FIXED/FIXED] @132,0 · stroke color/border/default 1
      LINE grid-v3 160x0 [FIXED/FIXED] @198,0 · stroke color/border/default 1
      LINE grid-v4 160x0 [FIXED/FIXED] @264,0 · stroke color/border/default 1
      ELLIPSE areaShape 180x110 [FIXED/FIXED] @74,25 · fill color/brand/primary · opacity 15%
      TEXT areaLabel 328x24 [FIXED/FIXED] @0,68 · fill color/text/primary · mobile/body-medium · align center · "Colombo 04 area"
    FRAME employer 328x44 [HUG/HUG] · vertical pad 0 gap 4
      FRAME employerRow 258x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT employerName 173x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Lanka Events (Pvt) Ltd"
        INSTANCE Display/Badge 77x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
          VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
          TEXT label 44x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Verified"
      TEXT businessBio 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Business · Event staffing across Colombo."
    FRAME spacer-grow 8x162 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 44x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Apply"
```

The listing detail. `factsCard` holds pay, basis and slots; `fillStart` is FILL and wraps (it was
a fixed 328 box inside a 300-wide card and ran 14 px past its edge). `Display/MapArea {Kind=Area}` shows
the area, never the pin — FR-POST-08's location precision before selection.

### `3.12s` — Listing detail, job-seeker view · Shop assistant sample

**Reached from** `3.1`, `3.1x130`, `3.2`  ·  **Leads to** [M4](M4-applying.md) `4.1s` (Apply)  ·  **Exits** back → history

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Gig"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 10
    TEXT title 328x28 [FIXED/HUG] · fill color/text/primary · mobile/title · "Shop assistant — weekend"
    TEXT meta 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Retail · One-off gig"
    FRAME factsCard 328x72 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r10
      TEXT pay 300x26 [FIXED/HUG] · fill color/text/primary · mobile/display-number · "Rs 3,500 per day"
      TEXT fillStart 300x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "1 of 1 open · Starts Sat 8:00 AM"
    TEXT description 328x40 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Help at the counter, restock shelves and keep the shop tidy through the weekend rush."
    INSTANCE Display/MapArea 328x160 [FIXED/FIXED] · fill color/bg/subtle · stroke color/border/default 1 · r8 · {Kind=Area}
      LINE grid-h1 328x0 [FIXED/FIXED] @0,40 · stroke color/border/default 1
      LINE grid-h2 328x0 [FIXED/FIXED] @0,80 · stroke color/border/default 1
      LINE grid-h3 328x0 [FIXED/FIXED] @0,120 · stroke color/border/default 1
      LINE grid-v1 160x0 [FIXED/FIXED] @66,0 · stroke color/border/default 1
      LINE grid-v2 160x0 [FIXED/FIXED] @132,0 · stroke color/border/default 1
      LINE grid-v3 160x0 [FIXED/FIXED] @198,0 · stroke color/border/default 1
      LINE grid-v4 160x0 [FIXED/FIXED] @264,0 · stroke color/border/default 1
      ELLIPSE areaShape 180x110 [FIXED/FIXED] @74,25 · fill color/brand/primary · opacity 15%
      TEXT areaLabel 328x24 [FIXED/FIXED] @0,68 · fill color/text/primary · mobile/body-medium · align center · "Nugegoda area"
    FRAME employer 328x44 [HUG/HUG] · vertical pad 0 gap 4
      FRAME employerRow 192x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT employerName 107x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Saman Stores"
        INSTANCE Display/Badge 77x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
          VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
          TEXT label 44x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Verified"
      TEXT businessBio 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Business · Retail, Nugegoda."
    FRAME spacer-grow 8x222 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 44x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Apply"
```

The Shop assistant detail — Kavindu's first application.

### `3.12c` — Listing detail, job-seeker view · Café service crew

**Reached from** `3.1`, `3.1x130`, `3.2`  ·  **Leads to** [M4](M4-applying.md) `4.1c` (Apply)  ·  **Exits** back → history

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Gig"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 10
    TEXT title 328x28 [FIXED/HUG] · fill color/text/primary · mobile/title · "Café service crew — evenings"
    TEXT meta 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Food service · One-off gig"
    FRAME factsCard 328x72 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r10
      TEXT pay 300x26 [FIXED/HUG] · fill color/text/primary · mobile/display-number · "Rs 3,000 per day"
      TEXT fillStart 300x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "2 of 2 open · Starts Fri 4 Sep 2026, 6:00 PM"
    TEXT description 328x60 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Serve tables and clear up during the Friday evening rush. Two evenings, 6 to 11 pm. Meal included."
    INSTANCE Display/MapArea 328x160 [FIXED/FIXED] · fill color/bg/subtle · stroke color/border/default 1 · r8 · {Kind=Area}
      LINE grid-h1 328x0 [FIXED/FIXED] @0,40 · stroke color/border/default 1
      LINE grid-h2 328x0 [FIXED/FIXED] @0,80 · stroke color/border/default 1
      LINE grid-h3 328x0 [FIXED/FIXED] @0,120 · stroke color/border/default 1
      LINE grid-v1 160x0 [FIXED/FIXED] @66,0 · stroke color/border/default 1
      LINE grid-v2 160x0 [FIXED/FIXED] @132,0 · stroke color/border/default 1
      LINE grid-v3 160x0 [FIXED/FIXED] @198,0 · stroke color/border/default 1
      LINE grid-v4 160x0 [FIXED/FIXED] @264,0 · stroke color/border/default 1
      ELLIPSE areaShape 180x110 [FIXED/FIXED] @74,25 · fill color/brand/primary · opacity 15%
      TEXT areaLabel 328x24 [FIXED/FIXED] @0,68 · fill color/text/primary · mobile/body-medium · align center · "Nugegoda area"
    FRAME employer 328x44 [HUG/HUG] · vertical pad 0 gap 4
      FRAME employerRow 209x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT employerName 124x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Green Leaf Café"
        INSTANCE Display/Badge 77x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
          VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
          TEXT label 44x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Verified"
      TEXT businessBio 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Business · Food service, Nugegoda."
    FRAME spacer-grow 8x202 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 44x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Apply"
```

The Café detail. It starts Fri 4 Sep, so the date is written out.

### `3.12h` — Listing detail, job-seeker view · House cleaning

**Reached from** `3.1`, `3.1x130`, `3.2`, `3.8`  ·  **Leads to** [M4](M4-applying.md) `4.1h` (Apply)  ·  **Exits** back → history

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Gig"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 10
    TEXT title 328x28 [FIXED/HUG] · fill color/text/primary · mobile/title · "House cleaning — Saturday"
    TEXT meta 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Cleaning · One-off gig"
    FRAME factsCard 328x72 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r10
      TEXT pay 300x26 [FIXED/HUG] · fill color/text/primary · mobile/display-number · "Rs 4,500 for the job"
      TEXT fillStart 300x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "1 of 1 open · Starts Sat 5 Sep 2026, 8:00 AM"
    TEXT description 328x60 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Deep-clean a three-bedroom house before guests arrive — floors, kitchen and two bathrooms. Supplies provided."
    INSTANCE Display/MapArea 328x160 [FIXED/FIXED] · fill color/bg/subtle · stroke color/border/default 1 · r8 · {Kind=Area}
      LINE grid-h1 328x0 [FIXED/FIXED] @0,40 · stroke color/border/default 1
      LINE grid-h2 328x0 [FIXED/FIXED] @0,80 · stroke color/border/default 1
      LINE grid-h3 328x0 [FIXED/FIXED] @0,120 · stroke color/border/default 1
      LINE grid-v1 160x0 [FIXED/FIXED] @66,0 · stroke color/border/default 1
      LINE grid-v2 160x0 [FIXED/FIXED] @132,0 · stroke color/border/default 1
      LINE grid-v3 160x0 [FIXED/FIXED] @198,0 · stroke color/border/default 1
      LINE grid-v4 160x0 [FIXED/FIXED] @264,0 · stroke color/border/default 1
      ELLIPSE areaShape 180x110 [FIXED/FIXED] @74,25 · fill color/brand/primary · opacity 15%
      TEXT areaLabel 328x24 [FIXED/FIXED] @0,68 · fill color/text/primary · mobile/body-medium · align center · "Colombo 05 area"
    FRAME employer 328x44 [HUG/HUG] · vertical pad 0 gap 4
      FRAME employerRow 178x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT employerName 93x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "A. Wijeratne"
        INSTANCE Display/Badge 77x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
          VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
          TEXT label 44x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Verified"
      TEXT businessBio 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Individual/Household · Colombo 05."
    FRAME spacer-grow 8x202 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 44x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Apply"
```

The House cleaning detail, Sat 5 Sep.

### `3.12d` — Listing detail, job-seeker view · Delivery rider

**Reached from** `3.1`, `3.1x130`, `3.2`  ·  **Leads to** [M4](M4-applying.md) `4.1d` (Apply)  ·  **Exits** back → history

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Gig"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 10
    TEXT title 328x28 [FIXED/HUG] · fill color/text/primary · mobile/title · "Delivery rider — mornings"
    TEXT meta 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Delivery · Part-time job"
    FRAME factsCard 328x88 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r10
      TEXT pay 300x26 [FIXED/HUG] · fill color/text/primary · mobile/display-number · "Rs 2,500 per day"
      TEXT fillStart 300x32 [FILL/HUG] · fill color/text/secondary · mobile/caption · "2 of 2 open · Mon–Sat 6–10 am · Starts Mon 7 Sep 2026"
    TEXT description 328x40 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Morning grocery deliveries within Maharagama on a company scooter. Licence required."
    INSTANCE Display/MapArea 328x160 [FIXED/FIXED] · fill color/bg/subtle · stroke color/border/default 1 · r8 · {Kind=Area}
      LINE grid-h1 328x0 [FIXED/FIXED] @0,40 · stroke color/border/default 1
      LINE grid-h2 328x0 [FIXED/FIXED] @0,80 · stroke color/border/default 1
      LINE grid-h3 328x0 [FIXED/FIXED] @0,120 · stroke color/border/default 1
      LINE grid-v1 160x0 [FIXED/FIXED] @66,0 · stroke color/border/default 1
      LINE grid-v2 160x0 [FIXED/FIXED] @132,0 · stroke color/border/default 1
      LINE grid-v3 160x0 [FIXED/FIXED] @198,0 · stroke color/border/default 1
      LINE grid-v4 160x0 [FIXED/FIXED] @264,0 · stroke color/border/default 1
      ELLIPSE areaShape 180x110 [FIXED/FIXED] @74,25 · fill color/brand/primary · opacity 15%
      TEXT areaLabel 328x24 [FIXED/FIXED] @0,68 · fill color/text/primary · mobile/body-medium · align center · "Maharagama area"
    FRAME employer 328x44 [HUG/HUG] · vertical pad 0 gap 4
      FRAME employerRow 266x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT employerName 181x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "FreshCart Maharagama"
        INSTANCE Display/Badge 77x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
          VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
          TEXT label 44x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Verified"
      TEXT businessBio 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Business · Delivery, Maharagama."
    FRAME spacer-grow 8x206 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 44x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Apply"
```

The Delivery rider detail. Posted before Kavindu registered, so it reaches him through Browse, not a notification.

### `3.12t` — Listing detail, job-seeker view · Grade 8 maths tutoring

**Reached from** `3.10x`, `3.10pd`  ·  **Leads to** [M4](M4-applying.md) `4.1t` (Apply)  ·  **Exits** back → history

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Gig"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 10
    TEXT title 328x28 [FIXED/HUG] · fill color/text/primary · mobile/title · "Grade 8 maths tutoring"
    TEXT meta 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Tutoring · Part-time job"
    FRAME factsCard 328x88 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r10
      TEXT pay 300x26 [FIXED/HUG] · fill color/text/primary · mobile/display-number · "Rs 1,800 per day"
      TEXT fillStart 300x32 [FILL/HUG] · fill color/text/secondary · mobile/caption · "1 of 1 open · Mon, Wed, Fri 4–6 pm · Starts Mon 7 Sep 2026"
    TEXT description 328x40 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Weekday afternoon maths tutoring for my daughter (Grade 8), at our home in Dehiwala."
    INSTANCE Display/MapArea 328x160 [FIXED/FIXED] · fill color/bg/subtle · stroke color/border/default 1 · r8 · {Kind=Area}
      LINE grid-h1 328x0 [FIXED/FIXED] @0,40 · stroke color/border/default 1
      LINE grid-h2 328x0 [FIXED/FIXED] @0,80 · stroke color/border/default 1
      LINE grid-h3 328x0 [FIXED/FIXED] @0,120 · stroke color/border/default 1
      LINE grid-v1 160x0 [FIXED/FIXED] @66,0 · stroke color/border/default 1
      LINE grid-v2 160x0 [FIXED/FIXED] @132,0 · stroke color/border/default 1
      LINE grid-v3 160x0 [FIXED/FIXED] @198,0 · stroke color/border/default 1
      LINE grid-v4 160x0 [FIXED/FIXED] @264,0 · stroke color/border/default 1
      ELLIPSE areaShape 180x110 [FIXED/FIXED] @74,25 · fill color/brand/primary · opacity 15%
      TEXT areaLabel 328x24 [FIXED/FIXED] @0,68 · fill color/text/primary · mobile/body-medium · align center · "Dehiwala area"
    FRAME employer 328x44 [HUG/HUG] · vertical pad 0 gap 4
      FRAME employerRow 208x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT employerName 123x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Dilrukshi Herath"
        INSTANCE Display/Badge 77x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
          VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
          TEXT label 44x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Verified"
      TEXT businessBio 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Individual/Household · Dehiwala."
    FRAME spacer-grow 8x206 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 44x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Apply"
```

The Grade 8 maths tutoring detail — the posting Kavindu applies for on Thursday evening and is engaged on by the weekend (M5).

### `3.12o` — Listing detail, job-seeker view · Office cleaning

**Reached from** `3.10x`, `3.10pd`  ·  **Leads to** [M4](M4-applying.md) `4.1o` (Apply)  ·  **Exits** back → history

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Gig"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 10
    TEXT title 328x28 [FIXED/HUG] · fill color/text/primary · mobile/title · "Office cleaning — Kirulapone"
    TEXT meta 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Cleaning · One-off gig"
    FRAME factsCard 328x72 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r10
      TEXT pay 300x26 [FIXED/HUG] · fill color/text/primary · mobile/display-number · "Rs 4,000 for the job"
      TEXT fillStart 300x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "2 of 2 open · Starts Sun 7:00 AM"
    TEXT description 328x40 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Sunday clean of a two-floor office in Kirulapone before Monday opening. Equipment on site."
    INSTANCE Display/MapArea 328x160 [FIXED/FIXED] · fill color/bg/subtle · stroke color/border/default 1 · r8 · {Kind=Area}
      LINE grid-h1 328x0 [FIXED/FIXED] @0,40 · stroke color/border/default 1
      LINE grid-h2 328x0 [FIXED/FIXED] @0,80 · stroke color/border/default 1
      LINE grid-h3 328x0 [FIXED/FIXED] @0,120 · stroke color/border/default 1
      LINE grid-v1 160x0 [FIXED/FIXED] @66,0 · stroke color/border/default 1
      LINE grid-v2 160x0 [FIXED/FIXED] @132,0 · stroke color/border/default 1
      LINE grid-v3 160x0 [FIXED/FIXED] @198,0 · stroke color/border/default 1
      LINE grid-v4 160x0 [FIXED/FIXED] @264,0 · stroke color/border/default 1
      ELLIPSE areaShape 180x110 [FIXED/FIXED] @74,25 · fill color/brand/primary · opacity 15%
      TEXT areaLabel 328x24 [FIXED/FIXED] @0,68 · fill color/text/primary · mobile/body-medium · align center · "Kirulapone area"
    FRAME employer 328x44 [HUG/HUG] · vertical pad 0 gap 4
      FRAME employerRow 277x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT employerName 192x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Kottawa Business Centre"
        INSTANCE Display/Badge 77x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
          VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
          TEXT label 44x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Verified"
      TEXT businessBio 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Business · Property management, based in Kottawa."
    FRAME spacer-grow 8x222 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 44x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Apply"
```

Office cleaning, now in **Kirulapone** (1.4 km). It was in Kottawa, 8.8 km away — outside any
radius a Nugegoda worker searches or is notified within — so the history row that led here could not have
existed. The employer is still Kottawa Business Centre.

### `3.12g` — Gig detail · flagged posting (Data entry, R. Gunasekara)

**Reached from** `3.8`  ·  **Leads to** [M9](M9-disputes.md) `9.1` ("Report this listing")  ·  **Exits** back → `3.8`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Gig"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 10
    TEXT title 328x28 [FIXED/HUG] · fill color/text/primary · mobile/title · "Data entry — work from home"
    FRAME badges 108x24 [HUG/HUG] · horizontal pad 0 gap 8
      INSTANCE Display/Badge 108x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 6 · fill color/bg/subtle · r999 · {Family=Case, Value=UnderReview}
        ELLIPSE dot 6x6 [FIXED/FIXED] · fill color/brand/primary
        TEXT label 76x16 [HUG/HUG] · fill color/text/primary · mobile/caption · "Under review"
    TEXT meta 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Other · One-off gig"
    FRAME factsCard 328x98 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r10
      TEXT pay 300x26 [FIXED/HUG] · fill color/text/primary · mobile/display-number · "Rs 4,500 per day"
      TEXT payBasis 79x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "paid weekly"
      TEXT fillStart 300x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "Open · Posted 30 Aug 2026"
    TEXT description 328x60 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Simple typing work from home. Registration fee Rs 1,000, refundable after your first payout. Message on WhatsApp to start today."
    FRAME employer 328x60 [HUG/HUG] · vertical pad 0 gap 4
      FRAME employerRow 111x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT employerName 111x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "R. Gunasekara"
      TEXT businessBio 328x32 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Individual · joined 30 Aug 2026 · no completed engagements"
    TEXT reportLink 328x16 [FILL/HUG] · fill color/brand/primary · mobile/caption · "Report this listing"
    FRAME spacer-grow 8x220 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/subtle · stroke color/border/default 1 · r8 · {Style=Primary, State=Disabled}
      TEXT label 44x24 [HUG/HUG] · fill color/text/secondary · mobile/body-medium · "Apply"
    TEXT applyCaption 328x40 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "Applications are paused while this posting is reviewed."
```

**The flagged posting, as a worker sees it.** The badge is `{Family=Case, Value=UnderReview}` —
the posting is under a moderation case. `Action/Button {State=Disabled}` with `applyCaption` saying why.
The report link is how Kavindu's report reaches M9.

*Open question, recorded rather than resolved:* whether a posting should carry a Case-family badge or a
Posting-family `UnderReview` value of its own.

### `3.12ofl` — Listing detail, job-seeker view · offline, from cache

**Reached from** `3.1ofl`  ·  **Leads to** nothing — Apply is disabled  ·  **Exits** back → `3.1ofl`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Gig"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 10
    INSTANCE offlineBar 328x36 [FIXED/FIXED] · horizontal pad 8/12/8/12 gap 0 · fill color/bg/subtle · stroke color/border/default 1 · r8 · of Feedback/OfflineBar
      TEXT message 302x20 [FILL/HUG] · fill color/text/primary · mobile/secondary · "Offline — showing gigs saved on your phone"
    TEXT title 328x28 [FIXED/HUG] · fill color/text/primary · mobile/title · "Event setup crew (3 needed)"
    FRAME badges 74x24 [HUG/HUG] · horizontal pad 0 gap 8
      INSTANCE Display/Badge 74x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/state/urgent 1 · r999 · {Family=Urgent, Value=Default}
        VECTOR triangle 10x9 [FIXED/FIXED] · fill color/state/urgent
        TEXT label 39x16 [HUG/HUG] · fill color/state/urgent · mobile/caption · "Urgent"
    TEXT meta 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Event setup · One-off gig"
    FRAME factsCard 328x98 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r10
      TEXT pay 300x26 [FIXED/HUG] · fill color/text/primary · mobile/display-number · "Rs 6,000 for the job"
      TEXT payBasis 72x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "per worker"
      TEXT fillStart 300x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "1 of 3 filled · Starts Sat 29 Aug 2026, 5:00 AM"
    TEXT description 328x40 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Help set up staging and seating for a weekend event at a Colombo 04 venue. Gloves provided."
    INSTANCE Display/MapArea 328x160 [FIXED/FIXED] · fill color/bg/subtle · stroke color/border/default 1 · r8 · {Kind=Area}
      LINE grid-h1 328x0 [FIXED/FIXED] @0,40 · stroke color/border/default 1
      LINE grid-h2 328x0 [FIXED/FIXED] @0,80 · stroke color/border/default 1
      LINE grid-h3 328x0 [FIXED/FIXED] @0,120 · stroke color/border/default 1
      LINE grid-v1 160x0 [FIXED/FIXED] @66,0 · stroke color/border/default 1
      LINE grid-v2 160x0 [FIXED/FIXED] @132,0 · stroke color/border/default 1
      LINE grid-v3 160x0 [FIXED/FIXED] @198,0 · stroke color/border/default 1
      LINE grid-v4 160x0 [FIXED/FIXED] @264,0 · stroke color/border/default 1
      ELLIPSE areaShape 180x110 [FIXED/FIXED] @74,25 · fill color/brand/primary · opacity 15%
      TEXT areaLabel 328x24 [FIXED/FIXED] @0,68 · fill color/text/primary · mobile/body-medium · align center · "Colombo 04 area"
    FRAME employer 328x44 [HUG/HUG] · vertical pad 0 gap 4
      FRAME employerRow 258x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT employerName 173x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Lanka Events (Pvt) Ltd"
        INSTANCE Display/Badge 77x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
          VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
          TEXT label 44x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Verified"
      TEXT businessBio 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Business · Event staffing across Colombo."
    FRAME spacer-grow 8x116 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/subtle · stroke color/border/default 1 · r8 · {Style=Primary, State=Disabled}
      TEXT label 219x24 [HUG/HUG] · fill color/text/secondary · mobile/body-medium · "Apply — needs a connection"
```

The cached detail. Apply is `{State=Disabled}` and says why in its own label — *"Apply — needs
a connection"* — because applying writes to the server.

### `3.10x` — Notification history · the first evening (27 Aug)

**Reached from** the Notifications tab on Thursday's Browse screens (`3.1`, `3.1f`, `3.1ldg`, `3.1ofl`, `3.1x130`), `3.10ldg` (after 1.5 s)  ·  **Leads to** `3.12t`, `3.12o`, `3.12` (rows), `3.11` (Preferences), `3.1` (Browse tab)

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/80/16 gap 12
    FRAME titleRow 328x44 [FILL/HUG] · horizontal pad 0 gap 12
      TEXT screenTitle 225x32 [FILL/HUG] · fill color/text/primary · mobile/display · "Notifications"
      TEXT prefsLink 91x44 [FIXED/FIXED] · fill color/brand/primary · mobile/body · align right · "Preferences"
    INSTANCE Display/NotificationRow 328x108 [FILL/HUG] · horizontal pad 12 gap 10 · fill color/bg/default · r8 · {Type=Standard}
      ELLIPSE unreadDot 8x8 [FIXED/FIXED] · fill color/brand/primary
      FRAME content 286x84 [FILL/HUG] · vertical pad 0 gap 2
        TEXT title 286x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "New gig near you"
        TEXT body 286x40 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "Grade 8 maths tutoring · Rs 1,800 per day · 3.6 km · starts Mon 7 Sep 2026, 4:00 PM"
        TEXT time 39x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "2h ago"
    INSTANCE Display/NotificationRow 328x128 [FILL/HUG] · horizontal pad 12 gap 10 · fill color/bg/default · r8 · {Type=Standard}
      ELLIPSE unreadDot 8x8 [FIXED/FIXED] · fill color/brand/primary
      FRAME content 286x104 [FILL/HUG] · vertical pad 0 gap 2
        TEXT title 286x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "New gig near you"
        TEXT body 286x60 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "Office cleaning — Kirulapone · Rs 4,000 for the job · 1.4 km · starts Sun 30 Aug 2026, 7:00 AM"
        TEXT time 39x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "5h ago"
    INSTANCE Display/NotificationRow 328x108 [FILL/HUG] · horizontal pad 12 gap 10 · fill color/bg/default · r8 · {Type=Standard}
      ELLIPSE unreadDot 8x8 [FIXED/FIXED] · fill color/brand/primary
      FRAME content 286x84 [FILL/HUG] · vertical pad 0 gap 2
        TEXT title 286x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Urgent gig near you"
        TEXT body 286x40 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "Event setup crew (3 needed) · Rs 6,000 for the job · 4.5 km · starts Sat 5:00 AM"
        TEXT time 45x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "12h ago"
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=false, Role=Worker} · [standard, see header]
```

**Thursday 27 Aug, 8 PM — the same day as `3.1`.** Three rows, newest first:
- **New gig near you** — the tutoring job, posted two hours earlier.
- **New gig near you** — Office cleaning in Kirulapone.
- **Urgent gig near you** — the morning's Event setup push.

Café, House cleaning, Shop assistant and Delivery rider are absent, because they were posted before
Kavindu registered. The bodies follow A11 (*title · pay + basis · distance · starts*).

**Why there is no "3 more new gigs" row.** This screen used to expand a new-gig digest, but the only digest
the system has is URGENT_DIGEST, created after five urgent pushes in a day (FR-NOTIF-01). New-gig
notifications are never batched.

### `3.10pd` — Notification history · push notifications denied

**Reached from** the Notifications tab when push is denied  ·  **Leads to** `3.12t`, `3.12o`, `3.12` (rows), `3.11pd` (Preferences), `3.1` (Browse tab)

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/80/16 gap 12
    INSTANCE pdBanner 328x100 [FILL/HUG] · horizontal pad 10/12/10/12 gap 0 · fill color/bg/subtle · stroke color/border/default 1 · r8 · of Feedback/FormBanner · {Kind=Info}
      TEXT message 296x80 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Push notifications are off, so we can't alert you. Everything still appears here — check back, or turn notifications on in your phone's settings."
    FRAME titleRow 328x44 [FILL/HUG] · horizontal pad 0 gap 12
      TEXT screenTitle 225x32 [FILL/HUG] · fill color/text/primary · mobile/display · "Notifications"
      TEXT prefsLink 91x44 [FIXED/FIXED] · fill color/brand/primary · mobile/body · align right · "Preferences"
    INSTANCE Display/NotificationRow 328x108 [FILL/HUG] · horizontal pad 12 gap 10 · fill color/bg/default · r8 · {Type=Standard}
      ELLIPSE unreadDot 8x8 [FIXED/FIXED] · fill color/brand/primary
      FRAME content 286x84 [FILL/HUG] · vertical pad 0 gap 2
        TEXT title 286x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "New gig near you"
        TEXT body 286x40 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "Grade 8 maths tutoring · Rs 1,800 per day · 3.6 km · starts Mon 7 Sep 2026, 4:00 PM"
        TEXT time 39x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "2h ago"
    INSTANCE Display/NotificationRow 328x128 [FILL/HUG] · horizontal pad 12 gap 10 · fill color/bg/default · r8 · {Type=Standard}
      ELLIPSE unreadDot 8x8 [FIXED/FIXED] · fill color/brand/primary
      FRAME content 286x104 [FILL/HUG] · vertical pad 0 gap 2
        TEXT title 286x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "New gig near you"
        TEXT body 286x60 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "Office cleaning — Kirulapone · Rs 4,000 for the job · 1.4 km · starts Sun 30 Aug 2026, 7:00 AM"
        TEXT time 39x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "5h ago"
    INSTANCE Display/NotificationRow 328x108 [FILL/HUG] · horizontal pad 12 gap 10 · fill color/bg/default · r8 · {Type=Standard}
      ELLIPSE unreadDot 8x8 [FIXED/FIXED] · fill color/brand/primary
      FRAME content 286x84 [FILL/HUG] · vertical pad 0 gap 2
        TEXT title 286x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Urgent gig near you"
        TEXT body 286x40 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "Event setup crew (3 needed) · Rs 6,000 for the job · 4.5 km · starts Sat 5:00 AM"
        TEXT time 45x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "12h ago"
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=false, Role=Worker} · [standard, see header]
```

The same evening with push permission denied. `pdBanner` (`FormBanner {Kind=Info}`, not Error —
nothing failed, the user chose) says the list still works, and it does: every row is live. That is
FR-NOTIF-09 satisfied, not a courtesy. Its Preferences link goes to `3.11pd`.

### `3.10q` — Notification history · the moderator's question (2 Sep)

**Reached from** the Notifications tab on 2 Sep  ·  **Leads to** [M9](M9-disputes.md) `9.2c`, [M5](M5-engagement.md) `5.9`, `5.11` (rows) · `3.11` (Preferences) · `3.1` (Browse tab)

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/80/16 gap 12
    FRAME titleRow 328x44 [FILL/HUG] · horizontal pad 0 gap 12
      TEXT screenTitle 225x32 [FILL/HUG] · fill color/text/primary · mobile/display · "Notifications"
      TEXT prefsLink 91x44 [FIXED/FIXED] · fill color/brand/primary · mobile/body · align right · "Preferences"
    INSTANCE Display/NotificationRow 328x128 [FILL/HUG] · horizontal pad 12 gap 10 · fill color/bg/default · r8 · {Type=Standard}
      ELLIPSE unreadDot 8x8 [FIXED/FIXED] · fill color/brand/primary
      FRAME content 286x104 [FILL/HUG] · vertical pad 0 gap 2
        TEXT title 286x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Question about your case"
        TEXT body 286x60 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "“What time did you arrive on Saturday, and did anyone see you at the shop?” · answer by 3 Sep 2026, 2:55 PM"
        TEXT time 43x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "5m ago"
    INSTANCE Display/NotificationRow 328x108 [FILL/HUG] · horizontal pad 12 gap 10 · fill color/bg/default · r8 · {Type=Standard}
      ELLIPSE unreadDot 8x8 [FIXED/FIXED] · fill color/brand/primary
      FRAME content 286x84 [FILL/HUG] · vertical pad 0 gap 2
        TEXT title 286x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Cancellation requested"
        TEXT body 286x40 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "Grade 8 maths tutoring · Dilrukshi Herath: schedule conflict · respond within 48 hours"
        TEXT time 40x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "2d ago"
    INSTANCE Display/NotificationRow 328x108 [FILL/HUG] · horizontal pad 12 gap 10 · fill color/bg/default · r8 · {Type=Standard}
      ELLIPSE unreadDot 8x8 [FIXED/FIXED] · fill color/brand/primary
      FRAME content 286x84 [FILL/HUG] · vertical pad 0 gap 2
        TEXT title 286x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Grade 8 maths tutoring changed"
        TEXT body 286x40 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "Dilrukshi Herath moved the start time · re-confirm within 48 hours"
        TEXT time 40x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "4d ago"
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=false, Role=Worker} · [standard, see header]
```

**Wed 2 Sep, minutes after the moderator's question.** Newest first: the question (with its
text and its 24-hour deadline, as A11 asks), then the cancellation request (30 Aug), then the change to
the tutoring start (29 Aug). The dispute's later rows do not exist yet — which is why the demo's clarification
journey opens here and not on `3.10`.

### `3.10r` — Notification history · the ruling (4 Sep)

**Reached from** the Notifications tab on 4 Sep  ·  **Leads to** [M6](M6-ratings.md) `6.1`, [M9](M9-disputes.md) `9.2f`, `9.2c`, [M5](M5-engagement.md) `5.9`, `5.11` (rows) · `3.11` · `3.1`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/80/16 gap 12
    FRAME titleRow 328x44 [FILL/HUG] · horizontal pad 0 gap 12
      TEXT screenTitle 225x32 [FILL/HUG] · fill color/text/primary · mobile/display · "Notifications"
      TEXT prefsLink 91x44 [FIXED/FIXED] · fill color/brand/primary · mobile/body · align right · "Preferences"
    INSTANCE Display/NotificationRow 328x108 [FILL/HUG] · horizontal pad 12 gap 10 · fill color/bg/default · r8 · {Type=Standard}
      ELLIPSE unreadDot 8x8 [FIXED/FIXED] · fill color/brand/primary
      FRAME content 286x84 [FILL/HUG] · vertical pad 0 gap 2
        TEXT title 286x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Rate your engagement"
        TEXT body 286x40 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "Saman Stores · Shop assistant — weekend · closes in 14 days"
        TEXT time 43x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "2m ago"
    INSTANCE Display/NotificationRow 328x108 [FILL/HUG] · horizontal pad 12 gap 10 · fill color/bg/default · r8 · {Type=Standard}
      ELLIPSE unreadDot 8x8 [FIXED/FIXED] · fill color/brand/primary
      FRAME content 286x84 [FILL/HUG] · vertical pad 0 gap 2
        TEXT title 286x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Your case is resolved"
        TEXT body 286x40 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "Arrival dispute — Shop assistant — weekend: decided in your favour."
        TEXT time 43x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "2m ago"
    INSTANCE Display/NotificationRow 328x128 [FILL/HUG] · horizontal pad 12 gap 10 · fill color/bg/default · r8 · {Type=Standard}
      ELLIPSE unreadDot 8x8 [FIXED/FIXED] · fill color/brand/primary
      FRAME content 286x104 [FILL/HUG] · vertical pad 0 gap 2
        TEXT title 286x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Question about your case"
        TEXT body 286x60 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "“What time did you arrive on Saturday, and did anyone see you at the shop?” · answer by 3 Sep 2026, 2:55 PM"
        TEXT time 38x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "1d ago"
    INSTANCE Display/NotificationRow 328x108 [FILL/HUG] · horizontal pad 12 gap 10 · fill color/bg/default · r8 · {Type=Standard}
      ELLIPSE unreadDot 8x8 [FIXED/FIXED] · fill color/brand/primary
      FRAME content 286x84 [FILL/HUG] · vertical pad 0 gap 2
        TEXT title 286x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Cancellation requested"
        TEXT body 286x40 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "Grade 8 maths tutoring · Dilrukshi Herath: schedule conflict · respond within 48 hours"
        TEXT time 40x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "4d ago"
    INSTANCE Display/NotificationRow 328x108 [FILL/HUG] · horizontal pad 12 gap 10 · fill color/bg/default · r8 · {Type=Standard}
      ELLIPSE unreadDot 8x8 [FIXED/FIXED] · fill color/brand/primary
      FRAME content 286x84 [FILL/HUG] · vertical pad 0 gap 2
        TEXT title 286x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Grade 8 maths tutoring changed"
        TEXT body 286x40 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "Dilrukshi Herath moved the start time · re-confirm within 48 hours"
        TEXT time 40x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "6d ago"
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=false, Role=Worker} · [standard, see header]
```

**Fri 4 Sep, as the Admin's ruling lands.** Two rows arrive together: *Your case is resolved*
and *Rate your engagement* — because FR-ADM-08 opens rating when a ruling establishes that the engagement
happened. There is no *case escalated* row between 2 and 4 Sep: FR-NOTIF-12 notifies the parties when a
case opens, when a clarification is asked of them, and when the outcome is recorded — not on escalation.
The case view shows escalation instead ([M9](M9-disputes.md) `9.2e`).

### `3.10` — Notification history · after the reveal (5 Sep)

**Reached from** the Notifications tab on 5 Sep, and back from [M6](M6-ratings.md) `6.3s` and [M5](M5-engagement.md) `5.11`  ·  **Leads to** [M6](M6-ratings.md) `6.3`, `6.1`, [M9](M9-disputes.md) `9.2f`, `9.2c`, [M5](M5-engagement.md) `5.9`, `5.11` (rows) · `3.11` · `3.1`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/80/16 gap 12
    FRAME titleRow 328x44 [FILL/HUG] · horizontal pad 0 gap 12
      TEXT screenTitle 225x32 [FILL/HUG] · fill color/text/primary · mobile/display · "Notifications"
      TEXT prefsLink 91x44 [FIXED/FIXED] · fill color/brand/primary · mobile/body · align right · "Preferences"
    INSTANCE Display/NotificationRow 328x108 [FILL/HUG] · horizontal pad 12 gap 10 · fill color/bg/default · r8 · {Type=Standard}
      ELLIPSE unreadDot 8x8 [FIXED/FIXED] · fill color/brand/primary
      FRAME content 286x84 [FILL/HUG] · vertical pad 0 gap 2
        TEXT title 286x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Ratings are in"
        TEXT body 286x40 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "You and Saman Stores have both rated — see the pair."
        TEXT time 39x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "2h ago"
    INSTANCE Display/NotificationRow 328x108 [FILL/HUG] · horizontal pad 12 gap 10 · fill color/bg/default · r8 · {Type=Standard}
      ELLIPSE unreadDot 8x8 [FIXED/FIXED] · fill color/brand/primary
      FRAME content 286x84 [FILL/HUG] · vertical pad 0 gap 2
        TEXT title 286x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Rate your engagement"
        TEXT body 286x40 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "Saman Stores · Shop assistant — weekend · closes in 14 days"
        TEXT time 38x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "1d ago"
    INSTANCE Display/NotificationRow 328x108 [FILL/HUG] · horizontal pad 12 gap 10 · fill color/bg/default · r8 · {Type=Standard}
      ELLIPSE unreadDot 8x8 [FIXED/FIXED] · fill color/brand/primary
      FRAME content 286x84 [FILL/HUG] · vertical pad 0 gap 2
        TEXT title 286x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Your case is resolved"
        TEXT body 286x40 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "Arrival dispute — Shop assistant — weekend: decided in your favour."
        TEXT time 38x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "1d ago"
    INSTANCE Display/NotificationRow 328x128 [FILL/HUG] · horizontal pad 12 gap 10 · fill color/bg/default · r8 · {Type=Standard}
      ELLIPSE unreadDot 8x8 [FIXED/FIXED] · fill color/brand/primary
      FRAME content 286x104 [FILL/HUG] · vertical pad 0 gap 2
        TEXT title 286x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Question about your case"
        TEXT body 286x60 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "“What time did you arrive on Saturday, and did anyone see you at the shop?” · answer by 3 Sep 2026, 2:55 PM"
        TEXT time 40x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "3d ago"
    INSTANCE Display/NotificationRow 328x108 [FILL/HUG] · horizontal pad 12 gap 10 · fill color/bg/default · r8 · {Type=Standard}
      ELLIPSE unreadDot 8x8 [FIXED/FIXED] · fill color/brand/primary
      FRAME content 286x84 [FILL/HUG] · vertical pad 0 gap 2
        TEXT title 286x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Cancellation requested"
        TEXT body 286x40 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "Grade 8 maths tutoring · Dilrukshi Herath: schedule conflict · respond within 48 hours"
        TEXT time 40x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "6d ago"
    INSTANCE Display/NotificationRow 328x108 [FILL/HUG] · horizontal pad 12 gap 10 · fill color/bg/default · r8 · {Type=Standard}
      ELLIPSE unreadDot 8x8 [FIXED/FIXED] · fill color/brand/primary
      FRAME content 286x84 [FILL/HUG] · vertical pad 0 gap 2
        TEXT title 286x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Grade 8 maths tutoring changed"
        TEXT body 286x40 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "Dilrukshi Herath moved the start time · re-confirm within 48 hours"
        TEXT time 39x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "7d ago"
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=false, Role=Worker} · [standard, see header]
```

**Sat 5 Sep, 6 PM.** Six rows, titles literal from requirements.md's A11 table:
- **Ratings are in** — both parties rated that afternoon.
- **Rate your engagement** (4 Sep).
- **Your case is resolved** (4 Sep).
- **Question about your case** (2 Sep).
- **Cancellation requested**, with its reason (30 Aug).
- **Grade 8 maths tutoring changed** (29 Aug).

Thursday's gig rows are further down the history, off the bottom of this frame.

### `3.10ldg` — Notification history · loading [against E10]

**Reached from** the Notifications tab while the history loads  ·  **Advances to** `3.10x` after 1.5s †  ·  **Leads to** `3.1` (Browse tab)

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/80/16 gap 12
    FRAME titleRow 328x32 [FILL/HUG] · horizontal pad 0 gap 12
      TEXT screenTitle 225x32 [FILL/HUG] · fill color/text/primary · mobile/display · "Notifications"
      TEXT prefsLink 91x24 [HUG/HUG] · fill color/brand/primary · mobile/body · align right · "Preferences"
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
    INSTANCE loading4 328x114 [FIXED/HUG] · vertical pad 16 gap 10 · stroke color/border/default 1 · r8 · of Feedback/LoadingState
      RECTANGLE skeleton1 200x16 [FIXED/FIXED] · fill color/bg/subtle · r4
      RECTANGLE skeleton2 296x12 [FIXED/FIXED] · fill color/bg/subtle · r4
      RECTANGLE skeleton3 296x12 [FIXED/FIXED] · fill color/bg/subtle · r4
      RECTANGLE skeleton4 140x12 [FIXED/FIXED] · fill color/bg/subtle · r4
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=false, Role=Worker} · [standard, see header]
  [frame reaction] AFTER_TIMEOUT 1.5s
```

The history's skeleton. **Advances after 1.5 s to `3.10x`**, Thursday's history — the demo's
loading journey is set on Thursday, like the Browse it starts from.

### `3.10z` — Notification history · first run

**Reached from** the Notifications tab on a brand-new worker account  ·  **Leads to** `3.1` ("Browse gigs", and the Browse tab)

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/80/16 gap 12
    FRAME titleRow 328x32 [FILL/HUG] · horizontal pad 0 gap 12
      TEXT screenTitle 225x32 [FILL/HUG] · fill color/text/primary · mobile/display · "Notifications"
      TEXT prefsLink 91x24 [HUG/HUG] · fill color/brand/primary · mobile/body · align right · "Preferences"
    INSTANCE Feedback/EmptyState 328x216 [FILL/HUG] · vertical pad 32/24/32/24 gap 8 · fill color/bg/default · r10 · {Cause=NoneExist}
      TEXT title 189x28 [HUG/HUG] · fill color/text/primary · mobile/title · "No notifications yet"
      TEXT body 280x60 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · align center · "We'll tell you about gigs near you, and about anything that needs an answer from you."
      INSTANCE Action/Button 142x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 94x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Browse gigs"
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=false, Role=Worker} · [standard, see header]
```

A brand-new worker's history: `Feedback/EmptyState {Cause=NoneExist}` with a primary action. In the demo's first-run flow, "Browse gigs" goes to that user's own Browse (`3.2`); on this page it goes to `3.1`.

### `3.10e` — Notification history · employer (Lanka Events)

**Reached from** the employer's Notifications tab  ·  **Leads to** [M6](M6-ratings.md) `6.1e`, [M4](M4-applying.md) `4.5` ×3 (rows) · `3.11e` (Preferences)

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    FRAME titleRow 328x44 [FILL/HUG] · horizontal pad 0 gap 12
      TEXT screenTitle 225x32 [FILL/HUG] · fill color/text/primary · mobile/display · "Notifications"
      TEXT prefsLink 91x44 [FIXED/FIXED] · fill color/brand/primary · mobile/body · align right · "Preferences"
    INSTANCE Display/NotificationRow 328x148 [FILL/HUG] · horizontal pad 12 gap 10 · fill color/bg/default · r8 · {Type=Standard}
      ELLIPSE unreadDot 8x8 [FIXED/FIXED] · fill color/brand/primary
      FRAME content 286x124 [FILL/HUG] · vertical pad 0 gap 2
        TEXT title 286x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Rate your engagement"
        TEXT body 286x80 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "Event setup crew (3 needed) with Nethmi Jayasinghe is complete. Ratings unlock when you have both rated, or after 14 days."
        TEXT time 39x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "2h ago"
    INSTANCE Display/NotificationRow 328x112 [FILL/HUG] · horizontal pad 12 gap 10 · fill color/bg/default · r8 · {Type=Standard}
      ELLIPSE unreadDot 8x8 [FIXED/FIXED] · fill color/brand/primary
      FRAME content 286x88 [FILL/HUG] · vertical pad 0 gap 2
        TEXT title 286x48 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "New applicant for Event setup crew (3 needed)"
        TEXT body 286x20 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "Nethmi Jayasinghe"
        TEXT time 40x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "2d ago"
    INSTANCE Display/NotificationRow 328x112 [FILL/HUG] · horizontal pad 12 gap 10 · fill color/bg/default · r8 · {Type=Standard}
      ELLIPSE unreadDot 8x8 [FIXED/FIXED] · fill color/brand/primary
      FRAME content 286x88 [FILL/HUG] · vertical pad 0 gap 2
        TEXT title 286x48 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "New applicant for Event setup crew (3 needed)"
        TEXT body 286x20 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "Kavindu Perera"
        TEXT time 40x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "2d ago"
    INSTANCE Display/NotificationRow 328x112 [FILL/HUG] · horizontal pad 12 gap 10 · fill color/bg/default · r8 · {Type=Standard}
      ELLIPSE unreadDot 8x8 [FIXED/FIXED] · fill color/brand/primary
      FRAME content 286x88 [FILL/HUG] · vertical pad 0 gap 2
        TEXT title 286x48 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "New applicant for Event setup crew (3 needed)"
        TEXT body 286x20 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "Tharindu Silva"
        TEXT time 40x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "2d ago"
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=false, Role=Employer} · [standard, see header]
```

**Lanka Events, Sat 29 Aug around noon.** The rating-window row is first, then **one
APPLICATION_RECEIVED row per applicant** — FR-NOTIF-04 notifies the employer of each application, and A11
gives the row the applicant's name. Three rows replaced the old *"3 people applied"* summary. Three rows
with no NotificationType and no requirement behind them were dropped: *Engagement completed* (completion
is what opens the rating window, already the top row), *Re-confirmation received*, and *Your gig is
live*.

### `3.10ez` — Notification history · employer, first run

**Reached from** the Notifications tab on a brand-new employer account  ·  **Leads to** [M2](M2-posting.md) `2.1` ("Post a gig") · `3.11e` (Preferences) — both wired in the demo

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    FRAME titleRow 328x32 [FILL/HUG] · horizontal pad 0 gap 12
      TEXT screenTitle 225x32 [FILL/HUG] · fill color/text/primary · mobile/display · "Notifications"
      TEXT prefsLink 91x24 [HUG/HUG] · fill color/brand/primary · mobile/body · align right · "Preferences"
    INSTANCE Feedback/EmptyState 328x216 [FILL/HUG] · vertical pad 32/24/32/24 gap 8 · fill color/bg/default · r10 · {Cause=NoneExist}
      TEXT title 189x28 [HUG/HUG] · fill color/text/primary · mobile/title · "No notifications yet"
      TEXT body 280x60 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · align center · "We'll tell you when someone applies to a posting, and when an engagement needs you."
      INSTANCE Action/Button 124x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 76x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Post a gig"
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=false, Role=Employer} · [standard, see header]
```

A new employer's empty history, with "Post a gig" as its action.

### `3.10v` — Notification history · verifier (Sunil Bandara)

**Reached from** the verifier's Notifications tab  ·  **Leads to** [M8](M8-endorsement.md) `8.5` ×2 (rows) · `3.11v` (Preferences)

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    FRAME titleRow 328x44 [FILL/HUG] · horizontal pad 0 gap 12
      TEXT screenTitle 225x32 [FILL/HUG] · fill color/text/primary · mobile/display · "Notifications"
      TEXT prefsLink 91x44 [FIXED/FIXED] · fill color/brand/primary · mobile/body · align right · "Preferences"
    INSTANCE Display/NotificationRow 328x108 [FILL/HUG] · horizontal pad 12 gap 10 · fill color/bg/default · r8 · {Type=Standard}
      ELLIPSE unreadDot 8x8 [FIXED/FIXED] · fill color/brand/primary
      FRAME content 286x84 [FILL/HUG] · vertical pad 0 gap 2
        TEXT title 286x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Your endorsement paid off"
        TEXT body 286x40 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "Kavindu Perera went on to build a good rating."
        TEXT time 38x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "1d ago"
    INSTANCE Display/NotificationRow 328x108 [FILL/HUG] · horizontal pad 12 gap 10 · fill color/bg/default · r8 · {Type=Standard}
      ELLIPSE unreadDot 8x8 [FIXED/FIXED] · fill color/brand/primary
      FRAME content 286x84 [FILL/HUG] · vertical pad 0 gap 2
        TEXT title 286x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Your endorsement paid off"
        TEXT body 286x40 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "Ishara Fernando went on to build a good rating."
        TEXT time 40x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "6d ago"
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=false, Role=Verifier} · [standard, see header]
```

Sunil Bandara's history: two ENDORSEMENT_PAYOFF rows (FR-ENDORSE-12, FR-NOTIF-07), each in
A11's form — *"{name} went on to build a good rating."* The second was titled *"Endorsement history"*
before; it is the same notification type, so it carries the same title.

### `3.10vz` — Notification history · verifier, first run

**Reached from** the Notifications tab on a brand-new verifier account  ·  **Leads to** [M8](M8-endorsement.md) `8.2` ("Vouch for someone") · `3.11v` (Preferences) — both wired in the demo

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    FRAME titleRow 328x32 [FILL/HUG] · horizontal pad 0 gap 12
      TEXT screenTitle 225x32 [FILL/HUG] · fill color/text/primary · mobile/display · "Notifications"
      TEXT prefsLink 91x24 [HUG/HUG] · fill color/brand/primary · mobile/body · align right · "Preferences"
    INSTANCE Feedback/EmptyState 328x196 [FILL/HUG] · vertical pad 32/24/32/24 gap 8 · fill color/bg/default · r10 · {Cause=NoneExist}
      TEXT title 189x28 [HUG/HUG] · fill color/text/primary · mobile/title · "No notifications yet"
      TEXT body 280x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · align center · "We'll tell you when someone you vouched for gets their first rating."
      INSTANCE Action/Button 197x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 149x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Vouch for someone"
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=false, Role=Verifier} · [standard, see header]
```

A new verifier's empty history, with "Vouch for someone" as its action.

### `3.11` — Notification preferences

**Reached from** `3.10`, `3.10x`, `3.10q`, `3.10r` (Preferences)  ·  **Leads to** `3.13`  ·  **Exits** back → history

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Notification preferences"
  FRAME content 360x744 [FILL/FILL] · vertical pad 24/16/24/16 gap 16
    INSTANCE Input/Toggle 328x64 [FILL/HUG] · horizontal pad 8/0/8/0 gap 16 · {State=On}
      TEXT label 268x48 [FILL/HUG] · fill color/text/primary · mobile/body · "Notify me about urgent gigs nearby"
      FRAME track 44x24 [FIXED/FIXED] · fill color/brand/primary · r999
        ELLIPSE knob 20x20 [FIXED/FIXED] @22,2 · fill color/bg/default
    INSTANCE Input/Toggle 328x40 [FILL/HUG] · horizontal pad 8/0/8/0 gap 16 · {State=On}
      TEXT label 268x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Notify me about new gigs nearby"
      FRAME track 44x24 [FIXED/FIXED] · fill color/brand/primary · r999
        ELLIPSE knob 20x20 [FIXED/FIXED] @22,2 · fill color/bg/default
    TEXT capNote 328x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Urgent alerts are capped at 5 a day — extras arrive as one digest."
    FRAME row-NotifAppearance 328x52 [FILL/HUG] · horizontal pad 14 gap 8 · fill color/bg/default · stroke color/border/default 1 · r10
      TEXT How notifications look 286x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "How notifications look"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
```

FR-NOTIF-03's two toggles: urgent-gig alerts (opt-in) and new-gig alerts (opt-out).
**Urgent is On** because the same worker's history already holds an urgent push, and FR-NOTIF-01 sends
those only to opted-in users. `capNote` states the cap and the digest rule. FR-NOTIF-03 places this
section inside Settings (FR-ACC-18); M1's `1.10` holds the same two toggles, and the two are reconciled in
the M1 pass.

### `3.11pd` — Notification preferences · push notifications denied

**Reached from** `3.10pd`  ·  **Leads to** `3.13`  ·  **Exits** back → `3.10pd`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Notification preferences"
  FRAME content 360x744 [FILL/FILL] · vertical pad 24/16/24/16 gap 16
    INSTANCE pdBanner 328x100 [FILL/HUG] · horizontal pad 10/12/10/12 gap 0 · fill color/bg/subtle · stroke color/border/default 1 · r8 · of Feedback/FormBanner · {Kind=Info}
      TEXT message 296x80 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Notifications are turned off for YouthLink on this phone, so these can't alert you. Your choices are kept — turn notifications on in your phone's settings to use them."
    INSTANCE Input/Toggle 328x64 [FILL/HUG] · horizontal pad 8/0/8/0 gap 16 · {State=On}
      TEXT label 268x48 [FILL/HUG] · fill color/text/primary · mobile/body · "Notify me about urgent gigs nearby"
      FRAME track 44x24 [FIXED/FIXED] · fill color/brand/primary · r999
        ELLIPSE knob 20x20 [FIXED/FIXED] @22,2 · fill color/bg/default
    INSTANCE Input/Toggle 328x40 [FILL/HUG] · horizontal pad 8/0/8/0 gap 16 · {State=On}
      TEXT label 268x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Notify me about new gigs nearby"
      FRAME track 44x24 [FIXED/FIXED] · fill color/brand/primary · r999
        ELLIPSE knob 20x20 [FIXED/FIXED] @22,2 · fill color/bg/default
    TEXT capNote 328x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Urgent alerts are capped at 5 a day — extras arrive as one digest."
    FRAME row-NotifAppearance 328x52 [FILL/HUG] · horizontal pad 14 gap 8 · fill color/bg/default · stroke color/border/default 1 · r10
      TEXT How notifications look 286x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "How notifications look"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
```

**The toggles show what the user chose — both On — and the banner says none of them can alert
until the phone allows it.** Stored preferences are separate from the OS permission (FR-NOTIF-09); drawing
them Off would contradict `3.10pd`, where an urgent row proves the opt-in.

### `3.11e` — Notification preferences · employer

**Reached from** `3.10e`, `3.10ez`  ·  **Leads to** nothing  ·  **Exits** back → `3.10e`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Notification preferences"
  FRAME content 360x744 [FILL/FILL] · vertical pad 24/16/24/16 gap 16
    TEXT roleNote 328x120 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "You're told about new applicants, postings with no applicants yet, cancellation requests and their outcomes, ended or stalled engagements, ratings, and dispute updates. There's nothing to switch here — to silence YouthLink, use your phone's notification settings."
```

**No toggles.** FR-NOTIF-03 defines two preferences, both for job-seekers. FR-ACC-18 still gives
every role a notification-preferences section in Settings, so the screen stays: `roleNote` says what an
employer is told about and how to silence YouthLink at the OS level. The "How notifications look" row is
gone too — it explains the urgent and regular gig channels (FR-NOTIF-10), which employers never receive.

### `3.11v` — Notification preferences · verifier

**Reached from** `3.10v`, `3.10vz`  ·  **Leads to** nothing  ·  **Exits** back → `3.10v`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Notification preferences"
  FRAME content 360x744 [FILL/FILL] · vertical pad 24/16/24/16 gap 16
    TEXT roleNote 328x80 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "You're told when someone you vouched for goes on to build a good rating. There's nothing to switch here — to silence YouthLink, use your phone's notification settings."
```

The verifier's version of `3.11e`: one sentence on what a verifier is told about — payoffs — and the OS route to silence it.

### `3.13` — OS-level notification appearance

**Reached from** `3.11`, `3.11pd` ("How notifications look")  ·  **Exits** back → history

```
FRAME 360x800 · vertical pad 66/16/24/16 gap 12 · fill color/bg/default
  TEXT screenTitle 210x32 [HUG/HUG] · fill color/text/primary · mobile/display · "At the lock screen"
  TEXT capReg 91x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Regular channel"
  INSTANCE OS/PushNotification 328x104 [FIXED/HUG] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r12 · {Channel=Regular}
    FRAME content 328x104 [FILL/HUG] · vertical pad 10/12/10/12 gap 2
      FRAME appRow 108x16 [HUG/HUG] · horizontal pad 0 gap 6
        RECTANGLE appIcon 12x12 [FIXED/FIXED] · fill color/brand/primary · r3
        TEXT appName 90x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "YouthLink · now"
      FRAME titleRow 134x24 [HUG/HUG] · horizontal pad 0 gap 6
        TEXT title 134x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "New gig near you"
      TEXT body 288x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Grade 8 maths tutoring · Rs 1,800 per day · 3.6 km · starts Mon 7 Sep 2026, 4:00 PM"
  TEXT capUrg 250x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Urgent — dedicated channel, time-sensitive"
  INSTANCE OS/PushNotification 328x104 [FIXED/HUG] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r12 · {Channel=Urgent}
    FRAME channelAccent 4x104 [FIXED/FILL] · fill color/state/urgent
    FRAME content 324x104 [FILL/HUG] · vertical pad 10/12/10/12 gap 2
      FRAME appRow 108x16 [HUG/HUG] · horizontal pad 0 gap 6
        RECTANGLE appIcon 12x12 [FIXED/FIXED] · fill color/brand/primary · r3
        TEXT appName 90x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "YouthLink · now"
      FRAME titleRow 167x24 [HUG/HUG] · horizontal pad 0 gap 6
        VECTOR urgentGlyph 10x9 [FIXED/FIXED] · fill color/state/urgent
        TEXT title 151x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Urgent gig near you"
      TEXT body 288x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Event setup crew (3 needed) · Rs 6,000 for the job · 4.5 km · starts Sat 5:00 AM"
  TEXT note 328x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "The two feel different at the moment they arrive — not only once opened."
  FRAME backHit 44x44 [FIXED/FIXED] @16,6
    VECTOR Vector 8x16 [FIXED/FIXED] @6,14 · stroke color/text/primary 2
```

**FR-NOTIF-10: urgent and regular gig notifications feel different on arrival**, not only once
opened. The regular example is the tutoring job (non-urgent, starts Mon 7 Sep); the urgent one is Event
setup, on its dedicated channel with `channelAccent` and `urgentGlyph`.

## Every screen shows one moment

A notification history is a record of one moment. So is every other screen. Different demo journeys sit
on different dates; within a journey, time only moves forward.

| When | Screens | What is true then |
| --- | --- | --- |
| **Thu 27 Aug, early** | `3.9`, `3.3` | Kavindu registers; the two prompts follow (A10) |
| **Thu 27 Aug, ~7:45 AM** | `3.1` family, `3.5`–`3.8`\*, `3.12` family | Five gigs within 5 km; only Event setup is urgent. The first-run user, in Homagama, sees `3.4` → `3.2` the same morning |
| **Thu 27 Aug, 8 PM** | `3.10x`, `3.10pd`, `3.11`, `3.11pd` | Tutoring and office cleaning posted that afternoon; the morning's urgent push |
| **Mon 31 Aug on** | `3.8`, `3.12g` | The scam posting has appeared and been reported; Event setup has run |
| **Wed 2 Sep** | `3.10q` | The moderator's question |
| **Fri 4 Sep** | `3.10r` | The ruling, and the rating window it opens |
| **Sat 5 Sep, 6 PM** | `3.10` | The reveal |

\* `3.8` is the exception in that row: the saved list is dated after the scam posting appeared.

**Gig start times, and why only one is urgent on Thursday morning.** Event setup crew Sat 29 Aug 5:00 AM ·
Shop assistant Sat 29 Aug 8:00 AM · Office cleaning Sun 30 Aug 7:00 AM · Café service crew Fri 4 Sep
6:00 PM · House cleaning Sat 5 Sep 8:00 AM · Delivery rider and Grade 8 maths tutoring Mon 7 Sep. A card
gives a weekday alone for a start inside the coming week and writes the date out for anything later.

## Notification rows and the types behind them

Every history row in this module is one `NotificationType`, and its title is the one requirements.md's A11
table gives that type. Bodies carry the content A11 names in whatever words fit.

| Row title | Type | Where | Opens |
| --- | --- | --- | --- |
| Urgent gig near you | `URGENT_GIG` | `3.10x`, `3.10pd` | the listing |
| New gig near you | `NEW_GIG` | `3.10x`, `3.10pd` | the listing |
| Question about your case | `CLARIFICATION_REQUEST` | `3.10`, `3.10q`, `3.10r` | [M9](M9-disputes.md) `9.2c` |
| Your case is resolved | `DISPUTE_RESOLVED` | `3.10`, `3.10r` | [M9](M9-disputes.md) `9.2f` |
| Rate your engagement | `RATING_WINDOW_OPEN` | `3.10`, `3.10r`, `3.10e` | [M6](M6-ratings.md) `6.1` / `6.1e` |
| Ratings are in | `RATING_REVEALED` | `3.10` | [M6](M6-ratings.md) `6.3` |
| Cancellation requested | `CANCELLATION_REQUEST` | `3.10`, `3.10q`, `3.10r` | [M5](M5-engagement.md) `5.9` |
| Grade 8 maths tutoring changed | `MATERIAL_CHANGE` | `3.10`, `3.10q`, `3.10r` | [M5](M5-engagement.md) `5.11` |
| New applicant for Event setup crew (3 needed) | `APPLICATION_RECEIVED` | `3.10e` ×3 | [M4](M4-applying.md) `4.5` |
| Your endorsement paid off | `ENDORSEMENT_PAYOFF` | `3.10v` ×2 | [M8](M8-endorsement.md) `8.5` |

Row links into other modules cross pages, so they are wired in the demo rather than on this page.

## Transitions that are not clicks

| Frame | Fires | After | To |
| --- | --- | --- | --- |
| `3.1ldg` | frame `AFTER_TIMEOUT` | 1.5 s | `3.1` |
| `3.10ldg` | frame `AFTER_TIMEOUT` | 1.5 s | `3.10x` |

Marked † in the navigation lines above. The timeout is in seconds.

## What the collapsed tab bar hides

`Chrome/TabBar` reads `[standard, see header]` throughout (design-system §6). Two things vary under it:
- **`Notification badge`** is `true` on the Browse screens and `false` on the history screens you are
  already looking at.
- **`Role`** is Worker, Employer or Verifier. That property alone says which history (`3.10*`,
  `3.10e`/`3.10ez`, `3.10v`/`3.10vz`) a screen belongs to.

**Tab destinations are not drawn on this page.** The demo routes them per role and per journey, so from
Thursday's Browse the Notifications tab opens Thursday's history. Where this page does wire a tab — the
Browse screens' Notifications tab (→ `3.10x`) and the histories' Browse tab (→ `3.1`) — it follows the
same rule.

## States not drawn in this module

| Not drawn | Build it from |
| --- | --- |
| The **urgent digest** (`URGENT_DIGEST`) | `Display/NotificationRow {Type=Digest}`. Title *"{n} more urgent gigs today"*, body *top title + count*; it expands in place to its batched children. It fires on the sixth urgent push in a day (FR-NOTIF-01). Nothing in this story reaches five |
| **Permanently denied** location | A10: skip the dialog and go straight to `3.4`, with a hint that location can be turned back on in system settings |
| **Permanently denied** notifications | A10: a settings hint on the history, never a blocking prompt. `3.10pd`'s banner is that hint |
| Other listings' **cached details** | `3.12ofl`'s composition — `Feedback/OfflineBar` over the detail, Apply `{State=Disabled}` with "needs a connection" |
| Filters and search **offline** | Inert, as on `3.1ofl`: both need the server |
| **Application decision** rows (selected, declined, not selected) | A11 rows `APPLICATION_SELECTED` / `_DECLINED` / `_NOT_SELECTED`. They belong to 28 Aug–1 Sep, below the fold of every history drawn here |
| **Endorsement received** (`ENDORSEMENT_RECEIVED`) | A11's row: *"{name} vouched for you"*, opening the worker's own profile |

## Open, and carried to the modules that own them

- **M4's application lists still count "Closes in N days" from Tue 1 Sep.** But
  Kavindu's browsing and applying sit on Thu 27 Aug: he has to have applied for the tutoring job before Dilrukshi changed
  it on 29 Aug. Those counts are re-dated when M4 is specified.
- **M1's Settings (`1.10`) holds the same two toggles as `3.11`, drawn Off.** FR-NOTIF-03 puts them in
  Settings; one of the two screens has to go or defer to the other. This is settled when M1 is specified.
- **Two notifications have no type.** FR-APPLY-10 notifies pending applicants of a material change, and
  M8's revocation promises "the person is told". Neither has a `NotificationType` or an A11 row. They are
  requirements gaps, not prototype ones.
