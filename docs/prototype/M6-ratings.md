# M6 — Ratings

Thirteen screens. Read [`design-system.md`](design-system.md) first — this file names components and text
styles rather than describing them, and that file is what the names mean.

**Requirements this module serves:** `FR-RATE-01` · `FR-RATE-02` · `FR-RATE-03` · `FR-RATE-04` ·
`FR-RATE-05` · `FR-RATE-06`, with `FR-ADM-08` (a no-show ruling skips rating entirely) and
`FR-DISPUTE-07` reached from here.

**The mechanism this module exists to protect.** Ratings are double-blind: neither party sees the other's
until both have submitted, or fourteen days pass from when rating opened. That is not a delay for its own
sake — it is what stops a rating being written in reply to one already received. Two consequences run
through every screen below: submission **closes permanently** at reveal, and a rating is **per
engagement**, never an average carried between them.

| Screen | Requirements |
| --- | --- |
| `6.1` | `FR-ADM-08`, `FR-RATE-01`, `FR-RATE-02`, `FR-RATE-03`, `FR-RATE-04`, `FR-RATE-05`, `FR-RATE-06` |
| `6.1e` | `FR-ENDORSE-07`, `FR-ENDORSE-11` |
| `6.1f` | `FR-ADM-01`, `FR-ENDORSE-03`, `FR-ENDORSE-05`, `FR-MOD-02` |
| `6.2` | `FR-ENDORSE-13`, `FR-RATE-02`, `FR-RATE-03`, `FR-RATE-04`, `FR-RATE-05`, `FR-RATE-06` |
| `6.2e` | `FR-ENDORSE-07`, `FR-ENDORSE-11` |
| `6.3` | `FR-ACC-15`, `FR-POST-16`, `FR-PROF-01`, `FR-RATE-01`, `FR-RATE-02`, `FR-RATE-04`, `FR-RATE-05`, `FR-RATE-06` |
| `6.3p` | state of `6.3` — a public response has been posted |
| `6.3s` | `FR-DISPUTE-07` |
| `6.4` | `FR-PROF-04`, `FR-RATE-03`, `FR-RATE-04`, `FR-RATE-05`, `FR-RATE-06` |
| `6.5` | `FR-RATE-04`, `FR-RATE-05`, `FR-RATE-06` |
| `6.5b` | `FR-MOD-02`, `FR-RATE-04` |
| `6.6` | `FR-RATE-03`, `FR-RATE-04`, `FR-RATE-05`, `FR-RATE-06` |
| `6.6b` | `FR-RATE-04`, `FR-RATE-05` |

**Sample content is Sri Lankan and consistent across the prototype.** *Saman Stores*, *Nethmi Jayasinghe*,
*R. Gunasekara* and *Dilrukshi Herath* are the same people on every screen that names them. Keep the names
when reproducing a screen for review; replace them with real data in the product.

---

### `6.1` — Rate this engagement

**Reached from** `3.10`, `3.10r`, `5.2b`, `5.5b`, `5.13b`  ·  **Leads to** `6.2`  ·
**Exits** back → `5.5b` / `5.13b`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Rate"
  FRAME content 360x744 [FILL/FILL] · vertical pad 20/16/24/16 gap 14
    TEXT context 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Shop assistant — weekend · Saman Stores"
    TEXT q 328x56 [FIXED/HUG] · fill color/text/primary · mobile/title · "How was working with Saman Stores?"
    INSTANCE Input/StarInput 172x56 [HUG/HUG] · vertical pad 0 gap 8 · {State=Selected}
      FRAME stars 172x28 [HUG/HUG] · horizontal pad 0 gap 8
        STAR star1 28x28 [FIXED/FIXED] · fill color/badge/rating
        STAR star2 28x28 [FIXED/FIXED] · fill color/badge/rating
        STAR star3 28x28 [FIXED/FIXED] · fill color/badge/rating
        STAR star4 28x28 [FIXED/FIXED] · fill color/border/default
        STAR star5 28x28 [FIXED/FIXED] · fill color/border/default
      TEXT echo 76x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "3 of 5 stars"
    TEXT blindNote 328x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "They won't see your rating until you've both rated, or 14 days pass from when rating opened."
    FRAME spacer-grow 8x414 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 103x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Submit rating"
```

`spacer-grow` is a zero-content frame at `[FIXED/FILL]` — it absorbs the remaining height so the button
sits at the bottom of a vertical stack without absolute positioning. **The same pattern appears on almost
every mobile screen in this product.**

### `6.1e` — Rate this engagement · employer

The employer's side of `6.1`. **Identical structure, different cast** — the rating mechanism does not vary
by role, which is why there is no separate component.

**Reached from** `3.10e`, `5.3b`, `5.13eb`  ·  **Leads to** `6.2e`  ·  **Exits** back → `5.3b` / `5.13eb`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Rate"
  FRAME content 360x744 [FILL/FILL] · vertical pad 20/16/24/16 gap 14
    TEXT context 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Event setup crew (3 needed) · Nethmi Jayasinghe"
    TEXT q 328x56 [FIXED/HUG] · fill color/text/primary · mobile/title · "How was working with Nethmi Jayasinghe?"
    INSTANCE Input/StarInput 172x56 [HUG/HUG] · vertical pad 0 gap 8 · {State=Selected}
      FRAME stars 172x28 [HUG/HUG] · horizontal pad 0 gap 8
        STAR star1 28x28 [FIXED/FIXED] · fill color/badge/rating
        STAR star2 28x28 [FIXED/FIXED] · fill color/badge/rating
        STAR star3 28x28 [FIXED/FIXED] · fill color/badge/rating
        STAR star4 28x28 [FIXED/FIXED] · fill color/border/default
        STAR star5 28x28 [FIXED/FIXED] · fill color/border/default
      TEXT echo 76x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "3 of 5 stars"
    TEXT blindNote 328x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "They won't see your rating until you've both rated, or 14 days pass from when rating opened."
    FRAME spacer-grow 8x414 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 103x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Submit rating"
```

### `6.1f` — Rate this engagement · closed at reveal

**The mechanism screen for `FR-RATE-02`.** Submission closes permanently at reveal, and the copy says why
rather than just that it is closed: once you can see their rating, submitting yours is no longer blind.
**There is no submit control** — the button is absent, not disabled, because there is nothing to submit.

**Reached from** `6.5b`  ·  **Exits** back → `6.3s`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Rate"
  FRAME content 360x744 [FILL/FILL] · vertical pad 20/16/24/16 gap 14
    TEXT context 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Shop assistant — weekend · Saman Stores"
    TEXT q 328x28 [FIXED/HUG] · fill color/text/primary · mobile/title · "Rating is closed"
    TEXT closedBody 328x96 [FIXED/HUG] · fill color/text/secondary · mobile/body · "The reveal date passed, so ratings for this engagement are final. Submitting now — after you can see their rating — wouldn't be fair to either of you."
    FRAME spacer-grow 8x518 [FIXED/FILL]
```

### `6.2` — Awaiting reveal

**Reached from** `5.2c`, `5.2ce`, `6.1`  ·  **Leads to** `5.2c`, `5.2ce`  ·
**Exits** "Back to engagement" → `5.2c` / `5.2ce` · back → `5.2c` / `5.2ce`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Rating"
  FRAME content 360x744 [FILL/FILL] · vertical pad 20/16/24/16 gap 14
    TEXT context 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Shop assistant — weekend · Saman Stores"
    FRAME sentGlyph 48x48 [FIXED/FIXED]
      ELLIPSE Ellipse 48x48 [FIXED/FIXED] @0,0 · stroke color/state/success 2.5
      VECTOR Vector 22x16 [FIXED/FIXED] @13,17 · stroke color/state/success 3
    TEXT selfState 328x32 [FIXED/HUG] · fill color/text/primary · mobile/display · "Your rating is in"
    TEXT unlockLine 328x48 [FIXED/HUG] · fill color/text/secondary · mobile/body · "Ratings unlock when both of you have rated, or on 16 Sep 2026."
    FRAME spacer-grow 328x438 [FILL/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 158x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Back to engagement"
```

**The date is computed, not stored per rating.** It is `Engagement.ratingOpenedAt` + 14 days, which is why
the line can be shown before the other party has done anything.

### `6.2e` — Awaiting reveal · employer

**Reached from** `5.3c`, `5.3ce`, `6.1e`  ·  **Leads to** `5.3c`  ·
**Exits** "Back to engagement" → `5.3c` / `5.3ce` · back → `5.3c` / `5.3ce`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Rating"
  FRAME content 360x744 [FILL/FILL] · vertical pad 20/16/24/16 gap 14
    TEXT context 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Event setup crew (3 needed) · Nethmi Jayasinghe"
    FRAME sentGlyph 48x48 [FIXED/FIXED]
      ELLIPSE Ellipse 48x48 [FIXED/FIXED] @0,0 · stroke color/state/success 2.5
      VECTOR Vector 22x16 [FIXED/FIXED] @13,17 · stroke color/state/success 3
    TEXT selfState 328x32 [FIXED/HUG] · fill color/text/primary · mobile/display · "Your rating is in"
    TEXT unlockLine 328x48 [FIXED/HUG] · fill color/text/secondary · mobile/body · "Ratings unlock when both of you have rated, or on 16 Sep 2026."
    FRAME spacer-grow 328x438 [FILL/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 158x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Back to engagement"
```

### `6.3` — Revealed ratings

Both ratings, side by side, each in its own card. **Neither card is a component** — they are plain frames,
because the two differ only in content and a component would add a variant axis that carries nothing.

**Reached from** `3.10`, `5.2d`  ·  **Leads to** `6.4`  ·  **Exits** back → `5.2d`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Ratings"
  FRAME content 360x744 [FILL/FILL] · vertical pad 20/16/24/16 gap 12
    TEXT context 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Shop assistant — weekend"
    FRAME rating-You rated Saman Stores 328x96 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      TEXT who 184x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "You rated Saman Stores"
      FRAME stars 124x20 [HUG/HUG] · horizontal pad 0 gap 6
        STAR star1 20x20 [FIXED/FIXED] · fill color/badge/rating
        STAR star2 20x20 [FIXED/FIXED] · fill color/badge/rating
        STAR star3 20x20 [FIXED/FIXED] · fill color/badge/rating
        STAR star4 20x20 [FIXED/FIXED] · fill color/border/default
        STAR star5 20x20 [FIXED/FIXED] · fill color/border/default
      TEXT echo 65x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "3 of 5 stars"
    FRAME rating-Saman Stores rated you 328x96 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      TEXT who 183x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Saman Stores rated you"
      FRAME stars 124x20 [HUG/HUG] · horizontal pad 0 gap 6
        STAR star1 20x20 [FIXED/FIXED] · fill color/badge/rating
        STAR star2 20x20 [FIXED/FIXED] · fill color/badge/rating
        STAR star3 20x20 [FIXED/FIXED] · fill color/badge/rating
        STAR star4 20x20 [FIXED/FIXED] · fill color/badge/rating
        STAR star5 20x20 [FIXED/FIXED] · fill color/badge/rating
      TEXT echo 65x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "5 of 5 stars"
    TEXT independence 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Each engagement is rated on its own."
    FRAME spacer-grow 8x368 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 180x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Write a public response"
```

### `6.3p` — Revealed ratings · public response posted

`6.3` after a response exists. **The button changes label rather than disappearing**, because editing a
response is always available once one is posted.

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Ratings"
  FRAME content 360x744 [FILL/FILL] · vertical pad 20/16/24/16 gap 12
    TEXT context 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Shop assistant — weekend"
    FRAME rating-You rated Saman Stores 328x96 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      TEXT who 184x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "You rated Saman Stores"
      FRAME stars 124x20 [HUG/HUG] · horizontal pad 0 gap 6
        STAR star1 20x20 [FIXED/FIXED] · fill color/badge/rating
        STAR star2 20x20 [FIXED/FIXED] · fill color/badge/rating
        STAR star3 20x20 [FIXED/FIXED] · fill color/badge/rating
        STAR star4 20x20 [FIXED/FIXED] · fill color/border/default
        STAR star5 20x20 [FIXED/FIXED] · fill color/border/default
      TEXT echo 65x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "3 of 5 stars"
    FRAME rating-Saman Stores rated you 328x96 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      TEXT who 183x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Saman Stores rated you"
      FRAME stars 124x20 [HUG/HUG] · horizontal pad 0 gap 6
        STAR star1 20x20 [FIXED/FIXED] · fill color/badge/rating
        STAR star2 20x20 [FIXED/FIXED] · fill color/badge/rating
        STAR star3 20x20 [FIXED/FIXED] · fill color/badge/rating
        STAR star4 20x20 [FIXED/FIXED] · fill color/badge/rating
        STAR star5 20x20 [FIXED/FIXED] · fill color/badge/rating
      TEXT echo 65x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "5 of 5 stars"
    TEXT responseText 328x60 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "Your public response — “Thanks — glad the weekend went smoothly.” Shown next to this rating."
    TEXT independence 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Each engagement is rated on its own."
    FRAME spacer-grow 8x296 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 143x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Edit your response"
```

### `6.3s` — Revealed ratings · scam engagement, one-sided reveal

**The case `FR-RATE-02` and `FR-RATE-06` exist for.** One party never rated, the window closed, and the
other party's rating stands — on an engagement that never happened. The first card shows *no stars at
all*, not zero stars, because "didn't rate" and "rated badly" must not look alike.

The removal route is an `Action/Link`, **not a button**: it is an exceptional path to an Admin, and giving
it a primary button's weight would invite it as an ordinary disagreement route, which `FR-RATE-06`
forbids.

**Reached from** `6.1f`  ·  **Leads to** `6.5`  ·  **Exits** back → `3.10`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Ratings"
  FRAME content 360x744 [FILL/FILL] · vertical pad 20/16/24/16 gap 12
    TEXT context 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Data entry — work from home · R. Gunasekara"
    FRAME rating-you-none 328x70 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      TEXT who 244x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "You didn't rate this engagement"
      TEXT echo 158x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Submission closed at reveal"
    FRAME rating-R. Gunasekara rated you 328x96 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · r8
      TEXT who 188x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "R. Gunasekara rated you"
      FRAME stars 124x20 [HUG/HUG] · horizontal pad 0 gap 6
        STAR star1 20x20 [FIXED/FIXED] · fill color/badge/rating
        STAR star2 20x20 [FIXED/FIXED] · fill color/border/default
        STAR star3 20x20 [FIXED/FIXED] · fill color/border/default
        STAR star4 20x20 [FIXED/FIXED] · fill color/border/default
        STAR star5 20x20 [FIXED/FIXED] · fill color/border/default
      TEXT echo 63x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "1 of 5 stars"
    TEXT independence 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Each engagement is rated on its own."
    FRAME spacer-grow 8x398 [FIXED/FILL]
    INSTANCE Action/Link 264x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
      TEXT label 264x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Request removal — policy violation"
```

### `6.4` — Write a public response

**Reached from** `6.3`  ·  **Leads to** `6.3p`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Public response"
  FRAME content 360x744 [FILL/FILL] · vertical pad 20/16/24/16 gap 12
    TEXT context 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Responding to: Saman Stores rated you 5 of 5"
    INSTANCE responseField 328x96 [FILL/HUG] · vertical pad 12 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8 · of Input/TextArea · {State=Filled}
      TEXT value 302x48 [FILL/HUG] · fill color/text/primary · mobile/body · "Thanks — glad the weekend went smoothly."
    TEXT visNote 328x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Shown alongside the rating you received. Up to 300 characters."
    FRAME spacer-grow 8x452 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 110x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Post response"
```

**300 characters is the schema's cap** on `Rating.publicResponse`, not a copy suggestion. Enforce it in
the field and on the server.

`responseField` and `6.5`'s `groundsField` are both `Input/TextArea`, added 2026-09-22. They had been
hand-built as bare frames at two different heights — 72 here, 96 there — for the same shape. They are now
one component that hugs its content and never drops below 96, so this field grew 24px. **An empty box has
to look like somewhere you can type**, which a two-line box stops doing the moment the copy is short.

### `6.5` — Request rating removal

**Reached from** `6.3s`  ·  **Leads to** `6.5b`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Request removal"
  FRAME content 360x744 [FILL/FILL] · vertical pad 20/16/24/16 gap 14
    TEXT context 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "About: R. Gunasekara rated you 1 of 5"
    TEXT explainer 328x120 [FIXED/HUG] · fill color/text/primary · mobile/body · "If a rating breaks the rules — for example it rates an engagement that never happened — you can ask for it to be removed. Your request goes straight to a YouthLink admin."
    INSTANCE groundsField 328x98 [FILL/HUG] · vertical pad 12 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8 · of Input/TextArea · {State=Filled}
      TEXT value 302x72 [FILL/HUG] · fill color/text/primary · mobile/body · "This engagement never took place — the posting was a scam, which I reported. The rating is fabricated."
    TEXT capNote 328x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "Up to 300 characters."
    FRAME spacer-grow 8x332 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 111x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Send to admin"
```

**"Straight to a YouthLink admin" is load-bearing copy.** `FR-RATE-06` requires this path to bypass
Moderator triage entirely, and the screen says so because a user who expects a moderator queue will read
silence as being ignored. It writes an `AccountRecoveryRequest`'s sibling, `RatingRemovalRequest` — one
per rating, enforced by a unique key.

### `6.5b` — Request rating removal · sent

**Reached from** `6.5`  ·  **Leads to** `6.1f`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Request removal"
  FRAME content 360x744 [FILL/FILL] · vertical pad 20/16/24/16 gap 14
    TEXT context 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "About: R. Gunasekara rated you 1 of 5"
    TEXT explainer 328x72 [FIXED/HUG] · fill color/text/primary · mobile/body · "Sent — a YouthLink admin will review your request. The rating stays visible until they decide, and you'll see any change here."
    FRAME spacer-grow 8x522 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 136x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Back to the rating"
```

**"The rating stays visible until they decide"** — the removal is not optimistic. Nothing about the
rating changes on submission.

### `6.6` — Rate cancelled engagement

**`FR-RATE-05`'s cancelled case.** Rating stays available but is not enforced the same way — there is less
to rate when the work never happened, but how a cancellation was handled is still worth recording. The
screen is drawn mid-entry, with three stars chosen, so the submit button is live; the empty state before
any star is tapped is the first Layer-3 rule at the end of this file.

**Reached from** `5.2tc`  ·  **Leads to** `6.6b`  ·  **Exits** back → `5.2tc`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Rate"
  FRAME content 360x744 [FILL/FILL] · vertical pad 20/16/24/16 gap 14
    TEXT context 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Grade 8 maths tutoring · Cancelled"
    TEXT survivalNote 328x48 [FIXED/HUG] · fill color/text/secondary · mobile/body · "This engagement was cancelled, but you can still rate how it was handled."
    TEXT q 328x56 [FIXED/HUG] · fill color/text/primary · mobile/title · "How was working with Dilrukshi Herath?"
    INSTANCE Input/StarInput 172x56 [HUG/HUG] · vertical pad 0 gap 8 · {State=Selected}
      FRAME stars 172x28 [HUG/HUG] · horizontal pad 0 gap 8
        STAR star1 28x28 [FIXED/FIXED] · fill color/badge/rating
        STAR star2 28x28 [FIXED/FIXED] · fill color/badge/rating
        STAR star3 28x28 [FIXED/FIXED] · fill color/badge/rating
        STAR star4 28x28 [FIXED/FIXED] · fill color/border/default
        STAR star5 28x28 [FIXED/FIXED] · fill color/border/default
      TEXT echo 76x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "3 of 5 stars"
    TEXT blindNote 328x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "They won't see your rating until you've both rated, or 14 days pass from when rating opened."
    FRAME spacer-grow 8x352 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 103x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Submit rating"
```

> **Fixed in the prototype on 2026-09-22, recorded because the shape of the defect is instructive.** The
> instance read `State=Empty` while three stars were hand-painted gold, and a second `echo` reading
> *"3 of 5 stars"* had been placed in `content` beside the instance rather than inside it — the
> component's own echo was hidden. Every symptom came from one cause: the variant was left on `Empty` and
> then patched by hand instead of switched to `Selected`. **When a component already has the state you
> want, switch the variant; overriding its internals to imitate a state leaves the instance lying about
> itself, and the variant name is what a developer reads.**

### `6.6b` — Rate cancelled engagement · submitted, awaiting reveal

**Reached from** `5.2tcr`, `6.6`  ·  **Leads to** `5.2tcr`  ·
**Exits** "Back to engagement" → `5.2tcr` · back → `5.2tcr`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Rating"
  FRAME content 360x744 [FILL/FILL] · vertical pad 20/16/24/16 gap 14
    TEXT context 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Grade 8 maths tutoring · Dilrukshi Herath"
    FRAME sentGlyph 48x48 [FIXED/FIXED]
      ELLIPSE Ellipse 48x48 [FIXED/FIXED] @0,0 · stroke color/state/success 2.5
      VECTOR Vector 22x16 [FIXED/FIXED] @13,17 · stroke color/state/success 3
    TEXT selfState 328x32 [FIXED/HUG] · fill color/text/primary · mobile/display · "Your rating is in"
    TEXT unlockLine 328x48 [FIXED/HUG] · fill color/text/secondary · mobile/body · "Ratings unlock when both of you have rated, or on 21 Sep 2026."
    FRAME spacer-grow 328x438 [FILL/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 158x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Back to engagement"
```

---

## States not drawn in this module

Per [`design-system.md`](design-system.md) §8 — build these, they are specified rather than missing.

| State | Build it as |
| --- | --- |
| No stars selected on `6.1` / `6.1e` | `Input/StarInput {State=Empty}`, with the submit button `Action/Button {State=Disabled}` and genuinely inert |
| Submission in flight | `Action/Button {State=Loading}` |
| A public response over 300 characters | the field at its cap with the counter showing, per `Input/TextField`'s counter behaviour — over-length is blocked at entry, not reported after |
| The rating list while loading | `Feedback/LoadingState` in place of the two rating cards on `6.3` |
