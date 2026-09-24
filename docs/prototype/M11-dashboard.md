# M11 — Staff dashboard

**Sixty-eight frames on this page; sixty-six M11 screens and two from M10.** `10.7` and `10.6n` are M10 dialogs drawn here, over the M11 screens that open them, because a Figma prototype link cannot cross pages; `11.3g` is an M11 screen drawn on [M10](M10-moderation.md)'s page for the same reason.

This is the web dashboard's own surface: signing in, the case queue, the full postings and users tables, metrics, the audit log, staff accounts and account recovery. The case screens themselves — review, clarification, warning, escalation, ruling, suspension, removal, promotion — are M10. **Moderator and Admin differ by which controls exist, not by which are disabled**: an Admin-only action is not offered to a Moderator, and the server refuses it if it arrives anyway (`NFR-SEC-05`).

Read `README.md` for the notation and `design-system.md` for the tokens and components. **The sidebar and header read `[standard, see header]`**; *What the collapsed header and sidebar hide*, at the end, says what varies under them. *Every screen shows one moment* dates each frame.

---

## Sign-in

Password **and** a one-time code, every time (`FR-DASH-06`, `NFR-SEC-04`). A promoted account's
first sign-in sets its own password from a code sent to the staff phone the promoting Admin registered, so
no secret ever passes through another person (`FR-ADM-06`). These seven frames carry no dashboard chrome.

### `11.1` — Dashboard login, step 1 of 2

**Reached from** `11.1L`  ·  **Leads to** `11.1b`, `11.1f`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  FRAME brandPanel 560x900 [FIXED/FIXED] @0,0 · fill color/brand/primary
    INSTANCE Brand/Wordmark 314x77 [FIXED/FIXED] @64,352 · {Tone=OnBrand, Size=Hero}
      FRAME mark 64x64 [FIXED/FIXED] @0,6
        ELLIPSE arc-topLeft 47x47 [FIXED/FIXED] @8,8 · fill white
        ELLIPSE arc-bottomRight 47x47 [FIXED/FIXED] @8,8 · fill white
        ELLIPSE dot 10x10 [FIXED/FIXED] @27,27 · fill white
      TEXT wordmark 217x52 [FIXED/FIXED] @77,13 · fill white · (no style) · "YouthLink"
    TEXT brandSub 107x20 [FIXED/FIXED] @64,452 · fill color/text/inverse · desktop/body · "Staff dashboard"
    TEXT tagline 300x36 [FIXED/FIXED] @64,484 · fill color/text/inverse · opacity 75% · desktop/table · "Moderation, disputes and platform operations for verified local gigs."
  FRAME loginCard 396x348 [HUG/HUG] @802,304 · vertical pad 24/28/24/28 gap 12 · fill color/bg/default · r8
    FRAME field-Staff phone 340x62 [HUG/HUG] · vertical pad 0 gap 4
      TEXT fLabel 72x18 [HUG/HUG] · fill color/text/secondary · desktop/table · "Staff phone"
      FRAME box 340x40 [FIXED/FIXED] · horizontal pad 10/12/10/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT prefix 27x20 [HUG/HUG] · fill color/text/secondary · desktop/body · "+94"
        FRAME prefixSep 1x20 [FIXED/FIXED] · fill color/border/default
        TEXT fValue 81x20 [HUG/HUG] · fill color/text/primary · desktop/body · "71 555 0100"
    FRAME field-Password 340x62 [HUG/HUG] · vertical pad 0 gap 4
      TEXT fLabel 60x18 [HUG/HUG] · fill color/text/secondary · desktop/table · "Password"
      FRAME box 340x40 [FIXED/HUG] · vertical pad 10/12/10/12 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT fValue 79x20 [HUG/HUG] · fill color/text/primary · desktop/body · "••••••••••"
    TEXT bothNote 340x36 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Step 1 of 2 — next, we'll text a one-time code to your staff phone — both steps are required to sign in."
    INSTANCE Action/Button 340x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 70x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Continue"
    INSTANCE Action/Link 265x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
      TEXT label 265x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "First time here? Sign in with a code"
  TEXT loginFooter 213x18 [FIXED/FIXED] @894,860 · fill color/text/secondary · desktop/table · "Staff access only · YouthLink 2026"
```

**Step 1 of 2, and the note says so before anything is sent** — *"both steps are required to sign in"*.
The staff phone field carries a fixed `+94` prefix, the same national format as the app's. *First time here?
Sign in with a code* is the promoted account's route (`11.1f`).

### `11.1b` — Dashboard login · code challenge

**Reached from** `11.1`  ·  **Leads to** `11.4rr`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  FRAME brandPanel 560x900 [FIXED/FIXED] @0,0 · fill color/brand/primary
    INSTANCE Brand/Wordmark 314x77 [FIXED/FIXED] @64,352 · {Tone=OnBrand, Size=Hero}
      FRAME mark 64x64 [FIXED/FIXED] @0,6
        ELLIPSE arc-topLeft 47x47 [FIXED/FIXED] @8,8 · fill white
        ELLIPSE arc-bottomRight 47x47 [FIXED/FIXED] @8,8 · fill white
        ELLIPSE dot 10x10 [FIXED/FIXED] @27,27 · fill white
      TEXT wordmark 217x52 [FIXED/FIXED] @77,13 · fill white · (no style) · "YouthLink"
    TEXT brandSub 107x20 [FIXED/FIXED] @64,452 · fill color/text/inverse · desktop/body · "Staff dashboard"
    TEXT tagline 300x36 [FIXED/FIXED] @64,484 · fill color/text/inverse · opacity 75% · desktop/table · "Moderation, disputes and platform operations for verified local gigs."
  FRAME challengeCard 396x228 [HUG/HUG] @802,336 · vertical pad 24/28/24/28 gap 12 · fill color/bg/default · r8
    TEXT title2 201x26 [HUG/HUG] · fill color/text/primary · desktop/title · "Enter the code we sent"
    TEXT sentTo 340x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Texted to +94 71 ••• ••00 — step 2 of 2"
    INSTANCE Input/CodeInputNumeric 340x52 [FILL/HUG] · vertical pad 0 gap 8 · {State=Filled}
      FRAME digits 340x52 [FILL/HUG] · horizontal pad 0 gap 8
        FRAME d0 50x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
          TEXT 6 13x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "6"
        FRAME d1 50x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
          TEXT 1 10x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "1"
        FRAME d2 50x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
          TEXT 7 12x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "7"
        FRAME d3 50x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
          TEXT 3 14x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "3"
        FRAME d4 50x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
          TEXT 0 14x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "0"
        FRAME d5 50x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
          TEXT 5 13x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "5"
    INSTANCE Action/Button 340x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 52x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Sign in"
  TEXT loginFooter 213x18 [FIXED/FIXED] @894,860 · fill color/text/secondary · desktop/table · "Staff access only · YouthLink 2026"
```

The code is **6 1 7 3 0 5**, and it is used nowhere else in the prototype — sample codes are distinct
so that no screen can be mistaken for another's step. `sentTo` masks the staff phone to its last two digits.

### `11.1w` — Dashboard login · wrong password (1 attempt left)

**Reached from** the sidebar  ·  **Leads to** `11.1L`, `11.1f`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  FRAME brandPanel 560x900 [FIXED/FIXED] @0,0 · fill color/brand/primary
    INSTANCE Brand/Wordmark 314x77 [FIXED/FIXED] @64,352 · {Tone=OnBrand, Size=Hero}
      FRAME mark 64x64 [FIXED/FIXED] @0,6
        ELLIPSE arc-topLeft 47x47 [FIXED/FIXED] @8,8 · fill white
        ELLIPSE arc-bottomRight 47x47 [FIXED/FIXED] @8,8 · fill white
        ELLIPSE dot 10x10 [FIXED/FIXED] @27,27 · fill white
      TEXT wordmark 217x52 [FIXED/FIXED] @77,13 · fill white · (no style) · "YouthLink"
    TEXT brandSub 107x20 [FIXED/FIXED] @64,452 · fill color/text/inverse · desktop/body · "Staff dashboard"
    TEXT tagline 300x36 [FIXED/FIXED] @64,484 · fill color/text/inverse · opacity 75% · desktop/table · "Moderation, disputes and platform operations for verified local gigs."
  FRAME loginCard 396x396 [HUG/HUG] @802,304 · vertical pad 24/28/24/28 gap 12 · fill color/bg/default · r8
    FRAME field-Staff phone 340x62 [HUG/HUG] · vertical pad 0 gap 4
      TEXT fLabel 72x18 [HUG/HUG] · fill color/text/secondary · desktop/table · "Staff phone"
      FRAME box 340x40 [FIXED/FIXED] · horizontal pad 10/12/10/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT prefix 27x20 [HUG/HUG] · fill color/text/secondary · desktop/body · "+94"
        FRAME prefixSep 1x20 [FIXED/FIXED] · fill color/border/default
        TEXT fValue 81x20 [HUG/HUG] · fill color/text/primary · desktop/body · "71 555 0100"
    FRAME field-Password 340x62 [HUG/HUG] · vertical pad 0 gap 4
      TEXT fLabel 60x18 [HUG/HUG] · fill color/text/secondary · desktop/table · "Password"
      FRAME box 340x40 [FIXED/HUG] · vertical pad 10/12/10/12 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT fValue 79x20 [HUG/HUG] · fill color/text/primary · desktop/body · "••••••••••"
    TEXT bothNote 340x36 [FILL/HUG] · fill color/text/primary · desktop/table · "That password doesn't match this staff phone — 1 attempt left before the account locks."
    TEXT bothNote 340x36 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Step 1 of 2 — next, we'll text a one-time code to your staff phone — both steps are required to sign in."
    INSTANCE Action/Button 340x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 70x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Continue"
    INSTANCE Action/Link 265x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
      TEXT label 265x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "First time here? Sign in with a code"
  TEXT loginFooter 213x18 [FIXED/FIXED] @894,860 · fill color/text/secondary · desktop/table · "Staff access only · YouthLink 2026"
```

**One attempt left** is the count after four failures of five (`FR-DASH-06`: five failed attempts lock the
account for 15 minutes). The error line sits *above* the unchanged step note, in `text/primary`, so the
explanation and the instruction are read in that order.

### `11.1L` — Dashboard login · account locked

**Reached from** `11.1w`  ·  **Leads to** `11.1`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  FRAME brandPanel 560x900 [FIXED/FIXED] @0,0 · fill color/brand/primary
    INSTANCE Brand/Wordmark 314x77 [FIXED/FIXED] @64,352 · {Tone=OnBrand, Size=Hero}
      FRAME mark 64x64 [FIXED/FIXED] @0,6
        ELLIPSE arc-topLeft 47x47 [FIXED/FIXED] @8,8 · fill white
        ELLIPSE arc-bottomRight 47x47 [FIXED/FIXED] @8,8 · fill white
        ELLIPSE dot 10x10 [FIXED/FIXED] @27,27 · fill white
      TEXT wordmark 217x52 [FIXED/FIXED] @77,13 · fill white · (no style) · "YouthLink"
    TEXT brandSub 107x20 [FIXED/FIXED] @64,452 · fill color/text/inverse · desktop/body · "Staff dashboard"
    TEXT tagline 300x36 [FIXED/FIXED] @64,484 · fill color/text/inverse · opacity 75% · desktop/table · "Moderation, disputes and platform operations for verified local gigs."
  FRAME loginCard 396x366 [HUG/HUG] @802,304 · vertical pad 24/28/24/28 gap 12 · fill color/bg/default · r8
    FRAME field-Staff phone 340x62 [HUG/HUG] · vertical pad 0 gap 4
      TEXT fLabel 72x18 [HUG/HUG] · fill color/text/secondary · desktop/table · "Staff phone"
      FRAME box 340x40 [FIXED/FIXED] · horizontal pad 10/12/10/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT prefix 27x20 [HUG/HUG] · fill color/text/secondary · desktop/body · "+94"
        FRAME prefixSep 1x20 [FIXED/FIXED] · fill color/border/default
        TEXT fValue 81x20 [HUG/HUG] · fill color/text/primary · desktop/body · "71 555 0100"
    FRAME field-Password 340x62 [HUG/HUG] · vertical pad 0 gap 4
      TEXT fLabel 60x18 [HUG/HUG] · fill color/text/secondary · desktop/table · "Password"
      FRAME box 340x40 [FIXED/HUG] · vertical pad 10/12/10/12 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT fValue 79x20 [HUG/HUG] · fill color/text/primary · desktop/body · "••••••••••"
    TEXT bothNote 340x54 [FIXED/HUG] · fill color/text/primary · desktop/table · "Too many sign-in attempts — this account is locked for 15 minutes. Sign-in locks after 5 failed attempts. Ask an Admin if you need it unlocked sooner."
    INSTANCE Action/Button 340x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/subtle · stroke color/border/default 1 · r8 · {Style=Primary, State=Disabled}
      TEXT label 70x24 [HUG/HUG] · fill color/text/secondary · mobile/body-medium · "Continue"
    INSTANCE backToSignIn 114x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0 · of Action/Link
      TEXT label 114x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Back to sign-in"
  TEXT loginFooter 213x18 [FIXED/FIXED] @894,860 · fill color/text/secondary · desktop/table · "Staff access only · YouthLink 2026"
```

Locked: `Continue` is `{State=Disabled}` and the note gives the rule and the only way round it — ask an
Admin. Unlocking early is backend-only (see `decisions.md`'s runbook), so there is no in-app control to draw.

### `11.1f` — First sign-in · phone only (step 1 of 3)

**Reached from** `11.1`, `11.1w`  ·  **Leads to** `11.1fb`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  FRAME brandPanel 560x900 [FIXED/FIXED] @0,0 · fill color/brand/primary
    INSTANCE Brand/Wordmark 314x77 [FIXED/FIXED] @64,352 · {Tone=OnBrand, Size=Hero}
      FRAME mark 64x64 [FIXED/FIXED] @0,6
        ELLIPSE arc-topLeft 47x47 [FIXED/FIXED] @8,8 · fill white
        ELLIPSE arc-bottomRight 47x47 [FIXED/FIXED] @8,8 · fill white
        ELLIPSE dot 10x10 [FIXED/FIXED] @27,27 · fill white
      TEXT wordmark 217x52 [FIXED/FIXED] @77,13 · fill white · (no style) · "YouthLink"
    TEXT brandSub 107x20 [FIXED/FIXED] @64,452 · fill color/text/inverse · desktop/body · "Staff dashboard"
    TEXT tagline 300x36 [FIXED/FIXED] @64,484 · fill color/text/inverse · opacity 75% · desktop/table · "Moderation, disputes and platform operations for verified local gigs."
  FRAME loginCard 396x236 [HUG/HUG] @802,304 · vertical pad 24/28/24/28 gap 12 · fill color/bg/default · r8
    FRAME field-Staff phone 340x62 [HUG/HUG] · vertical pad 0 gap 4
      TEXT fLabel 72x18 [HUG/HUG] · fill color/text/secondary · desktop/table · "Staff phone"
      FRAME box 340x40 [FIXED/FIXED] · horizontal pad 10/12/10/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT prefix 27x20 [HUG/HUG] · fill color/text/secondary · desktop/body · "+94"
        FRAME prefixSep 1x20 [FIXED/FIXED] · fill color/border/default
        TEXT fValue 83x20 [HUG/HUG] · fill color/text/primary · desktop/body · "71 234 5678"
    TEXT bothNote 340x54 [FIXED/HUG] · fill color/text/secondary · desktop/table · "First sign-in — step 1 of 3. We'll text a one-time code to the staff phone your Admin registered, then you'll set a dashboard password."
    INSTANCE Action/Button 340x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 117x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Text me a code"
  TEXT loginFooter 213x18 [FIXED/FIXED] @894,860 · fill color/text/secondary · desktop/table · "Staff access only · YouthLink 2026"
```

**Phone only.** A promoted account has no dashboard password yet, so step 1 of 3 asks for nothing else.
The phone is the staff phone the promoting Admin registered — T. Abeysekera's, `+94 71 234 5678`.

### `11.1fb` — First sign-in · code (step 2 of 3)

**Reached from** `11.1f`  ·  **Leads to** `11.1p`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  FRAME brandPanel 560x900 [FIXED/FIXED] @0,0 · fill color/brand/primary
    INSTANCE Brand/Wordmark 314x77 [FIXED/FIXED] @64,352 · {Tone=OnBrand, Size=Hero}
      FRAME mark 64x64 [FIXED/FIXED] @0,6
        ELLIPSE arc-topLeft 47x47 [FIXED/FIXED] @8,8 · fill white
        ELLIPSE arc-bottomRight 47x47 [FIXED/FIXED] @8,8 · fill white
        ELLIPSE dot 10x10 [FIXED/FIXED] @27,27 · fill white
      TEXT wordmark 217x52 [FIXED/FIXED] @77,13 · fill white · (no style) · "YouthLink"
    TEXT brandSub 107x20 [FIXED/FIXED] @64,452 · fill color/text/inverse · desktop/body · "Staff dashboard"
    TEXT tagline 300x36 [FIXED/FIXED] @64,484 · fill color/text/inverse · opacity 75% · desktop/table · "Moderation, disputes and platform operations for verified local gigs."
  FRAME challengeCard 396x228 [HUG/HUG] @802,336 · vertical pad 24/28/24/28 gap 12 · fill color/bg/default · r8
    TEXT title2 201x26 [HUG/HUG] · fill color/text/primary · desktop/title · "Enter the code we sent"
    TEXT sentTo 340x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Texted to +94 71 ••• ••78 — step 2 of 3"
    INSTANCE Input/CodeInputNumeric 340x52 [FILL/HUG] · vertical pad 0 gap 8 · {State=Filled}
      FRAME digits 340x52 [FILL/HUG] · horizontal pad 0 gap 8
        FRAME d0 50x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
          TEXT 2 13x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "2"
        FRAME d1 50x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
          TEXT 9 13x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "9"
        FRAME d2 50x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
          TEXT 4 14x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "4"
        FRAME d3 50x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
          TEXT 8 13x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "8"
        FRAME d4 50x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
          TEXT 6 13x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "6"
        FRAME d5 50x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
          TEXT 1 10x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "1"
    INSTANCE Action/Button 340x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 70x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Continue"
  TEXT loginFooter 213x18 [FIXED/FIXED] @894,860 · fill color/text/secondary · desktop/table · "Staff access only · YouthLink 2026"
```

Code **2 9 4 8 6 1**, texted to the staff phone ending `78`.

### `11.1p` — First sign-in · set password (step 3 of 3)

**Reached from** `11.1fb`  ·  **Leads to** `11.4t`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  FRAME brandPanel 560x900 [FIXED/FIXED] @0,0 · fill color/brand/primary
    INSTANCE Brand/Wordmark 314x77 [FIXED/FIXED] @64,352 · {Tone=OnBrand, Size=Hero}
      FRAME mark 64x64 [FIXED/FIXED] @0,6
        ELLIPSE arc-topLeft 47x47 [FIXED/FIXED] @8,8 · fill white
        ELLIPSE arc-bottomRight 47x47 [FIXED/FIXED] @8,8 · fill white
        ELLIPSE dot 10x10 [FIXED/FIXED] @27,27 · fill white
      TEXT wordmark 217x52 [FIXED/FIXED] @77,13 · fill white · (no style) · "YouthLink"
    TEXT brandSub 107x20 [FIXED/FIXED] @64,452 · fill color/text/inverse · desktop/body · "Staff dashboard"
    TEXT tagline 300x36 [FIXED/FIXED] @64,484 · fill color/text/inverse · opacity 75% · desktop/table · "Moderation, disputes and platform operations for verified local gigs."
  FRAME loginCard 396x310 [HUG/HUG] @802,304 · vertical pad 24/28/24/28 gap 12 · fill color/bg/default · r8
    FRAME field-Staff phone 340x62 [HUG/HUG] · vertical pad 0 gap 4
      TEXT fLabel 161x18 [HUG/HUG] · fill color/text/secondary · desktop/table · "New dashboard password"
      FRAME box 340x40 [FIXED/FIXED] · horizontal pad 10/12/10/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
        FRAME prefixSep 1x20 [FIXED/FIXED] · fill color/border/default
        TEXT fValue 79x20 [HUG/HUG] · fill color/text/primary · desktop/body · "••••••••••"
    FRAME field-Password 340x62 [HUG/HUG] · vertical pad 0 gap 4
      TEXT fLabel 112x18 [HUG/HUG] · fill color/text/secondary · desktop/table · "Confirm password"
      FRAME box 340x40 [FIXED/HUG] · vertical pad 10/12/10/12 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT fValue 79x20 [HUG/HUG] · fill color/text/primary · desktop/body · "••••••••••"
    TEXT bothNote 340x54 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Step 3 of 3 — 8 to 64 characters, spaces allowed, no other rules. From now on you sign in with this password plus a one-time code."
    INSTANCE Action/Button 340x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 192x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Set password and sign in"
  TEXT loginFooter 213x18 [FIXED/FIXED] @894,860 · fill color/text/secondary · desktop/table · "Staff access only · YouthLink 2026"
```

**8 to 64 characters, spaces allowed, no other rules** — the same password rule as the app
(`FR-ACC-09`). After this, the account signs in the ordinary way: password plus code.

## Case queue

**Oldest first** — the longest-waiting case is the most urgent (`FR-DASH-03`). A queue is a list of
cards, not a table, so it carries **no pager**: the count sits in the caption, *"Showing N of N in the queue"*.
Each frame is one moment in the case story (table at the end). **The cards open the case screens in
[M10](M10-moderation.md)**; a Figma link cannot cross pages, so those links live in the demo, not on this
page — the two on-page exceptions are the report card on `11.4a`/`11.4ar` (→ `11.2ad`) and the recovery card
on `11.4rec` (→ `11.8rec1`).

### `11.4` — Case queue · Moderator

**Reached from** the Moderator's sidebar  ·  **Leads to** the sidebar only

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator, Active=Case queue} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator} · [standard, see header]
  FRAME content 1200x402 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 316x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Dispute — payment not released · Under review"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Warehouse packing — night shift · Tharindu Silva (worker, raiser) vs Ceylon Logistics (employer)"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Opened 28 Aug 2026 · both statements in · 1 photo of evidence"
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 404x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Dispute — arrival could not be confirmed · Awaiting response"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Shop assistant — weekend · Kavindu Perera (worker, raiser) vs Saman Stores (employer)"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Opened 31 Aug 2026 · raiser's statement in · Saman Stores has until 2 Sep 2026 to respond"
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 253x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Report — fraud or scam · Auto-hidden"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Listing: Data entry — work from home · owner R. Gunasekara · 3 reports"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Auto-hidden 31 Aug 2026 by the three-report threshold · awaiting triage"
    TEXT queueOrder 1152x16 [FILL/HUG] · fill color/text/secondary · desktop/caption · "Showing 3 of 3 in the queue · oldest first — the longest-waiting case is the most urgent."
```

**Mon 31 Aug, before 2:55 PM.** Three cases: the payment dispute (opened 28 Aug, both statements in), Kavindu
Perera's arrival dispute (opened that day with his statement; Saman Stores has until 2 Sep to respond), and the scam
report, auto-hidden by the three-report threshold and awaiting triage.

### `11.4t` — Case queue · Moderator, T. Abeysekera's first sign-in

**Reached from** `11.1p`  ·  **Leads to** the sidebar only

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator, Active=Case queue} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator} · [standard, see header]
  FRAME content 1200x402 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 316x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Dispute — payment not released · Under review"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Warehouse packing — night shift · Tharindu Silva (worker, raiser) vs Ceylon Logistics (employer)"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Opened 28 Aug 2026 · both statements in · 1 photo of evidence"
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 404x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Dispute — arrival could not be confirmed · Awaiting response"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Shop assistant — weekend · Kavindu Perera (worker, raiser) vs Saman Stores (employer)"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Opened 31 Aug 2026 · raiser's statement in · Saman Stores has until 2 Sep 2026 to respond"
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 313x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Report — fraud or scam · Escalated for removal"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Listing: Data entry — work from home · owner R. Gunasekara · 3 reports"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Auto-hidden 31 Aug 2026 · escalated for removal 31 Aug 2026 by Shalini Weerasinghe"
    TEXT queueOrder 1152x16 [FILL/HUG] · fill color/text/secondary · desktop/caption · "Showing 3 of 3 in the queue · oldest first — the longest-waiting case is the most urgent."
```

**T. Abeysekera's first session, Mon 31 Aug after 2:55 PM** — promoted 29 Aug, signed in for the first time
through `11.1f`–`11.1p`. The report has been escalated for removal by Shalini Weerasinghe at 2:55 PM, which is
why this queue already differs from `11.4`. The header carries T. Abeysekera's name.

### `11.4x` — Case queue · Moderator, report escalated for removal

**Reached from** [M10](M10-moderation.md) `10.4e` (escalate for removal)  ·  **Leads to** the sidebar only

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator, Active=Case queue} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator} · [standard, see header]
  FRAME content 1200x402 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 316x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Dispute — payment not released · Under review"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Warehouse packing — night shift · Tharindu Silva (worker, raiser) vs Ceylon Logistics (employer)"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Opened 28 Aug 2026 · both statements in · 1 photo of evidence"
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 404x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Dispute — arrival could not be confirmed · Awaiting response"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Shop assistant — weekend · Kavindu Perera (worker, raiser) vs Saman Stores (employer)"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Opened 31 Aug 2026 · raiser's statement in · Saman Stores has until 2 Sep 2026 to respond"
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 313x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Report — fraud or scam · Escalated for removal"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Listing: Data entry — work from home · owner R. Gunasekara · 3 reports"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Auto-hidden 31 Aug 2026 · escalated for removal 31 Aug 2026 by Shalini Weerasinghe"
    TEXT queueOrder 1152x16 [FILL/HUG] · fill color/text/secondary · desktop/caption · "Showing 3 of 3 in the queue · oldest first — the longest-waiting case is the most urgent."
```

The same moment as `11.4t`, in Shalini Weerasinghe's session: she has just escalated the report
([M10](M10-moderation.md) `10.4e`).

### `11.4rr` — Case queue · Moderator, dispute ready for review

**Reached from** `11.1b`  ·  **Leads to** the sidebar only

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator, Active=Case queue} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator} · [standard, see header]
  FRAME content 1200x402 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 316x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Dispute — payment not released · Under review"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Warehouse packing — night shift · Tharindu Silva (worker, raiser) vs Ceylon Logistics (employer)"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Opened 28 Aug 2026 · both statements in · 1 photo of evidence"
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 394x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Dispute — arrival could not be confirmed · Ready for review"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Shop assistant — weekend · Kavindu Perera (worker, raiser) vs Saman Stores (employer)"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Opened 31 Aug 2026 · response received 1 Sep 2026 — both sides on record"
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 313x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Report — fraud or scam · Escalated for removal"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Listing: Data entry — work from home · owner R. Gunasekara · 3 reports"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Auto-hidden 31 Aug 2026 · escalated for removal 31 Aug 2026 by Shalini Weerasinghe"
    TEXT queueOrder 1152x16 [FILL/HUG] · fill color/text/secondary · desktop/caption · "Showing 3 of 3 in the queue · oldest first — the longest-waiting case is the most urgent."
```

**Tue 1 Sep.** Saman Stores' response arrived, so the arrival dispute is ready for review. The
account-recovery request that used to sit here was removed: recovery is Admin-only and happens on 5 Sep.

### `11.4w` — Case queue · Moderator, dispute closed with warning

**Reached from** [M10](M10-moderation.md) `10.3sb` (warning recorded)  ·  **Leads to** the sidebar only

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator, Active=Case queue} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator} · [standard, see header]
  FRAME content 1200x402 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 316x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Dispute — payment not released · Under review"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Warehouse packing — night shift · Tharindu Silva (worker, raiser) vs Ceylon Logistics (employer)"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Opened 28 Aug 2026 · both statements in · 1 photo of evidence"
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 417x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Dispute — arrival could not be confirmed · Closed with warning"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Shop assistant — weekend · Kavindu Perera (worker, raiser) vs Saman Stores (employer)"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Closed 2 Sep 2026 in the worker's favour · warning recorded on Saman Stores"
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 313x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Report — fraud or scam · Escalated for removal"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Listing: Data entry — work from home · owner R. Gunasekara · 3 reports"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Auto-hidden 31 Aug 2026 · escalated for removal 31 Aug 2026 by Shalini Weerasinghe"
    TEXT queueOrder 1152x16 [FILL/HUG] · fill color/text/secondary · desktop/caption · "Showing 3 of 3 in the queue · oldest first — the longest-waiting case is the most urgent."
```

**Wed 2 Sep, one branch of the arrival case:** closed with a warning on Saman Stores.

### `11.4e` — Case queue · Moderator, dispute escalated to Admin

**Reached from** [M10](M10-moderation.md) `10.1er` / `10.1e` (escalate)  ·  **Leads to** the sidebar only

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator, Active=Case queue} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator} · [standard, see header]
  FRAME content 1200x402 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 316x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Dispute — payment not released · Under review"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Warehouse packing — night shift · Tharindu Silva (worker, raiser) vs Ceylon Logistics (employer)"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Opened 28 Aug 2026 · both statements in · 1 photo of evidence"
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 410x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Dispute — arrival could not be confirmed · Escalated to Admin"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Shop assistant — weekend · Kavindu Perera (worker, raiser) vs Saman Stores (employer)"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Escalated 2 Sep 2026 by Shalini Weerasinghe — awaiting the Admin ruling"
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 313x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Report — fraud or scam · Escalated for removal"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Listing: Data entry — work from home · owner R. Gunasekara · 3 reports"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Auto-hidden 31 Aug 2026 · escalated for removal 31 Aug 2026 by Shalini Weerasinghe"
    TEXT queueOrder 1152x16 [FILL/HUG] · fill color/text/secondary · desktop/caption · "Showing 3 of 3 in the queue · oldest first — the longest-waiting case is the most urgent."
```

**Wed 2 Sep, the other branch:** escalated to Admin at 5:30 PM (audit log), awaiting the ruling.

### `11.4c` — Case queue · Moderator, third warning recorded

**Reached from** [M10](M10-moderation.md) `10.3c` (third warning recorded)  ·  **Leads to** the sidebar only

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator, Active=Case queue} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator} · [standard, see header]
  FRAME content 1200x402 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 316x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Dispute — payment not released · Under review"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Warehouse packing — night shift · Tharindu Silva (worker, raiser) vs Ceylon Logistics (employer)"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Opened 28 Aug 2026 · both statements in · 1 photo of evidence"
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 410x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Dispute — arrival could not be confirmed · Escalated to Admin"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Shop assistant — weekend · Kavindu Perera (worker, raiser) vs Saman Stores (employer)"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Escalated 2 Sep 2026 by Shalini Weerasinghe — awaiting the Admin ruling"
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 410x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Report — fraud or scam · Warning recorded — auto-escalated"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Listing: Data entry — work from home · owner R. Gunasekara · 3 reports"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Third warning in 90 days recorded 3 Sep 2026 · account escalated to Admin for suspension review"
    TEXT queueOrder 1152x16 [FILL/HUG] · fill color/text/secondary · desktop/caption · "Showing 3 of 3 in the queue · oldest first — the longest-waiting case is the most urgent."
```

**Thu 3 Sep, 4:10 PM.** The report branch where the owner is warned instead of the listing being removed —
the third warning in 90 days, which auto-escalates R. Gunasekara to Admin for suspension review (`FR-MOD-02`).

### `11.4r` — Case queue · Moderator, listing restored

**Reached from** [M10](M10-moderation.md) `10.4rb` (listing restored)  ·  **Leads to** the sidebar only

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator, Active=Case queue} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator} · [standard, see header]
  FRAME content 1200x402 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 316x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Dispute — payment not released · Under review"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Warehouse packing — night shift · Tharindu Silva (worker, raiser) vs Ceylon Logistics (employer)"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Opened 28 Aug 2026 · both statements in · 1 photo of evidence"
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 410x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Dispute — arrival could not be confirmed · Escalated to Admin"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Shop assistant — weekend · Kavindu Perera (worker, raiser) vs Saman Stores (employer)"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Escalated 2 Sep 2026 by Shalini Weerasinghe — awaiting the Admin ruling"
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 230x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Report — fraud or scam · Restored"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Listing: Data entry — work from home · owner R. Gunasekara · 3 reports"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Restored to browse 4 Sep 2026 by Shalini Weerasinghe · the three reports stay on record"
    TEXT queueOrder 1152x16 [FILL/HUG] · fill color/text/secondary · desktop/caption · "Showing 3 of 3 in the queue · oldest first — the longest-waiting case is the most urgent."
```

**Fri 4 Sep, morning, a branch:** the listing restored to browse; the three reports stay on record.

### `11.4pe` — Case queue · Moderator, payment dispute escalated before the clarification

**Reached from** [M10](M10-moderation.md) `10.1pe` (escalate before the clarification)  ·  **Leads to** the sidebar only

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator, Active=Case queue} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator} · [standard, see header]
  FRAME content 1200x402 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 356x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Dispute — payment not released · Escalated to Admin"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Warehouse packing — night shift · Tharindu Silva (worker, raiser) vs Ceylon Logistics (employer)"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Escalated 4 Sep 2026 by Shalini Weerasinghe — awaiting the Admin ruling"
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 427x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Dispute — arrival could not be confirmed · Ruled — for the raiser"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Shop assistant — weekend · Kavindu Perera (worker, raiser) vs Saman Stores (employer)"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Ruled 4 Sep 2026 by Kasun Jayawardena · final, both parties told"
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 313x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Report — fraud or scam · Escalated for removal"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Listing: Data entry — work from home · owner R. Gunasekara · 3 reports"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Auto-hidden 31 Aug 2026 · escalated for removal 31 Aug 2026 by Shalini Weerasinghe"
    TEXT queueOrder 1152x16 [FILL/HUG] · fill color/text/secondary · desktop/caption · "Showing 3 of 3 in the queue · oldest first — the longest-waiting case is the most urgent."
```

**Fri 4 Sep, about 11:10 AM, a branch:** the payment dispute escalated **before** asking Ceylon Logistics
for the transfer receipt. By then Kavindu Perera's dispute had been ruled (11:05 AM), so its card reads
*Ruled — for the raiser*; the report is still escalated (the removal is at 3:40 PM).

### `11.4pw` — Case queue · Moderator, payment dispute closed with warning

**Reached from** [M10](M10-moderation.md) `10.3pb` (warning recorded, payment dispute)  ·  **Leads to** the sidebar only

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator, Active=Case queue} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator} · [standard, see header]
  FRAME content 1200x174 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 363x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Dispute — payment not released · Closed with warning"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Warehouse packing — night shift · Tharindu Silva (worker, raiser) vs Ceylon Logistics (employer)"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Closed 5 Sep 2026 in the worker's favour · warning recorded on Ceylon Logistics"
    TEXT queueOrder 1152x16 [FILL/HUG] · fill color/text/secondary · desktop/caption · "Showing 1 of 1 in the queue · oldest first — the longest-waiting case is the most urgent."
```

**Sat 5 Sep, after the clarification answer.** Closed with a warning on Ceylon Logistics. **One card:** the
arrival dispute was ruled on 4 Sep and the scam posting removed that afternoon, so neither is on the queue
any more — which is also what the Admin's `11.4rec` shows on the same day.

### `11.4pce` — Case queue · Moderator, payment dispute escalated after the clarification

**Reached from** [M10](M10-moderation.md) `10.1pce` (escalate after the clarification)  ·  **Leads to** the sidebar only

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator, Active=Case queue} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator} · [standard, see header]
  FRAME content 1200x174 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 356x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Dispute — payment not released · Escalated to Admin"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Warehouse packing — night shift · Tharindu Silva (worker, raiser) vs Ceylon Logistics (employer)"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Escalated 5 Sep 2026 by Shalini Weerasinghe, after the clarification — awaiting the Admin ruling"
    TEXT queueOrder 1152x16 [FILL/HUG] · fill color/text/secondary · desktop/caption · "Showing 1 of 1 in the queue · oldest first — the longest-waiting case is the most urgent."
```

**Added 2026-09-24.** The escalation *after* the clarification, on Sat 5 Sep — the moment
[M10](M10-moderation.md) `10.1pce`'s Escalate lands on. It exists because `11.4pe` is a 4 Sep screen and this
escalation cannot happen before the 5 Sep answer; one frame could not be both.

### `11.4a` — Case queue · Admin

**Reached from** the Admin's sidebar  ·  **Leads to** `11.2ad`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin, Active=Case queue} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin} · [standard, see header]
  FRAME content 1200x516 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 316x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Dispute — payment not released · Under review"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Warehouse packing — night shift · Tharindu Silva (worker, raiser) vs Ceylon Logistics (employer)"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Opened 28 Aug 2026 · both statements in · 1 photo of evidence"
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 469x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Dispute — arrival could not be confirmed · Escalated — ready for ruling"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Shop assistant — weekend · Kavindu Perera (worker, raiser) vs Saman Stores (employer)"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Escalated 2 Sep 2026 by Shalini Weerasinghe · both statements and the clarification are on record"
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 235x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Report — fraud or scam · Escalated"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Listing: Data entry — work from home · owner R. Gunasekara · 3 reports"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Auto-hidden 31 Aug 2026 · escalated for removal 31 Aug 2026 by Shalini Weerasinghe"
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 313x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Account — suspension review · Auto-escalated"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "R. Gunasekara (employer, individual) · 3 warnings in 90 days · owner of the reported listing"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Auto-escalated 3 Sep 2026 by the third warning, recorded by Shalini Weerasinghe · awaiting an Admin decision"
    TEXT queueOrder 1152x16 [FILL/HUG] · fill color/text/secondary · desktop/caption · "Showing 4 of 4 in the queue · oldest first — the longest-waiting case is the most urgent."
```

**Fri 4 Sep, before 11:05 AM** — the Admin's queue: the payment dispute, still under Moderator review; the
arrival dispute, escalated and ready for a ruling; the report, escalated for removal; and **R. Gunasekara's
suspension review**, auto-escalated by the third warning on 3 Sep. The report card opens the listing (`11.2ad`).

### `11.4ar` — Case queue · Admin, dispute ruled

**Reached from** [M10](M10-moderation.md) `10.5r` (ruling recorded)  ·  **Leads to** `11.2ad`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin, Active=Case queue} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin} · [standard, see header]
  FRAME content 1200x516 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 316x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Dispute — payment not released · Under review"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Warehouse packing — night shift · Tharindu Silva (worker, raiser) vs Ceylon Logistics (employer)"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Opened 28 Aug 2026 · both statements in · 1 photo of evidence"
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 427x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Dispute — arrival could not be confirmed · Ruled — for the raiser"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Shop assistant — weekend · Kavindu Perera (worker, raiser) vs Saman Stores (employer)"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Ruled 4 Sep 2026 by Kasun Jayawardena · final, both parties told"
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 235x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Report — fraud or scam · Escalated"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Listing: Data entry — work from home · owner R. Gunasekara · 3 reports"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Auto-hidden 31 Aug 2026 · escalated for removal 31 Aug 2026 by Shalini Weerasinghe"
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 313x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Account — suspension review · Auto-escalated"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "R. Gunasekara (employer, individual) · 3 warnings in 90 days · owner of the reported listing"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Auto-escalated 3 Sep 2026 by the third warning, recorded by Shalini Weerasinghe · awaiting an Admin decision"
    TEXT queueOrder 1152x16 [FILL/HUG] · fill color/text/secondary · desktop/caption · "Showing 4 of 4 in the queue · oldest first — the longest-waiting case is the most urgent."
```

**Fri 4 Sep, after the 11:05 AM ruling and before the 3:38 PM suspension.** The ruled case stays on the queue
for the rest of the day, marked *Ruled — for the raiser*.

### `11.4rec` — Case queue · Admin, account-recovery request

**Reached from** `11.8rec1`  ·  **Leads to** `11.8rec1`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin, Active=Case queue} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin} · [standard, see header]
  FRAME content 1200x288 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 339x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Dispute — payment not released · Ready for review"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Warehouse packing — night shift · Tharindu Silva (worker, raiser) vs Ceylon Logistics (employer)"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Opened 28 Aug 2026 · clarification answered 5 Sep 2026 — ready for review"
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 442x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Account recovery — no reachable phone or email · Awaiting review"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Nethmi Jayasinghe (worker) · 13 completed gigs · 4.6 from 12 ratings · 2 endorsements"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Requested 5 Sep 2026 · +94 76 234 5678 unreachable · no verified email on file"
    TEXT queueOrder 1152x16 [FILL/HUG] · fill color/text/secondary · desktop/caption · "Showing 2 of 2 in the queue · oldest first — the longest-waiting case is the most urgent."
```

**Sat 5 Sep.** The payment dispute's clarification has been answered, so it is ready for the Moderator
again; beside it, Nethmi Jayasinghe's recovery request (13 completed gigs, 4.6 from 12 ratings, 2
endorsements). Yesterday's ruled and removed cases are gone.

## All postings

Every posting on the platform, whatever its report status — including content hidden pending review
(`FR-DASH-01`). One dataset drives all twenty-five frames (see *The postings table* at the end): the
unfiltered view is newest first, the status chips filter it, and a row opens its detail card beneath the
table with the row highlighted. **The Moderator's detail has no Remove button** — removal is an Admin action
and is not offered to a Moderator (`FR-DASH-01` as amended). The `…x` frames are the table after the Admin's
3:40 PM removal on Fri 4 Sep.

### `11.2` — All postings · Moderator

**Reached from** `11.2f`, `11.2ff`, `11.2fw`, `11.2fe`, `11.2d4`  ·  **Leads to** `11.2f`, `11.2ff`, `11.2fw`, `11.2fe`, `11.2d`, `11.2d2`, `11.2d3`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator, Active=All postings} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator} · [standard, see header]
  FRAME content 1200x630 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
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
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Under review"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "30 Aug 2026"
        FRAME dataRow 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Grade 8 maths tutoring"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Dilrukshi Herath"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Tutoring"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "27 Aug 2026"
        FRAME dataRow 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Office cleaning — Kirulapone"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Kottawa Business Centre"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Cleaning"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Filled}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/brand/primary
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Filled"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "27 Aug 2026"
        FRAME dataRow4 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Event setup crew (3 needed)"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Lanka Events (Pvt) Ltd"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Event setup"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "27 Aug 2026"
        FRAME dataRow05 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Warehouse packing — night shift"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Ceylon Logistics"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Delivery"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Filled}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/brand/primary
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Filled"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "26 Aug 2026"
        FRAME dataRow06 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "House cleaning — Saturday"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "A. Wijeratne"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Cleaning"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "26 Aug 2026"
        FRAME dataRow07 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Shop assistant — weekend"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Saman Stores"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Retail"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Filled}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/brand/primary
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Filled"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "25 Aug 2026"
        FRAME dataRow08 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Delivery rider — mornings"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "FreshCart Maharagama"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Delivery"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "25 Aug 2026"
        FRAME dataRow09 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Café service crew — evenings"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Green Leaf Café"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Food service"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "24 Aug 2026"
        FRAME dataRow10 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Stage crew — Friday setup"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Lanka Events (Pvt) Ltd"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Event setup"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "20 Aug 2026"
      INSTANCE pagination 1152x44 [FILL/FIXED] · horizontal pad 12/16/12/16 gap 0 · fill color/bg/default · stroke color/border/default mixed · of Desktop/Pagination · {Page=First}
        TEXT countText 128x20 [HUG/HUG] · fill color/text/secondary · desktop/body · "Showing 1–10 of 85"
        FRAME pager 131x20 [HUG/HUG] · horizontal pad 0 gap 16
          TEXT position 74x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Page 1 of 9"
          TEXT nextLink 41x20 [HUG/HUG] · fill color/brand/primary · desktop/body-medium · "Next ›"
    TEXT scopeNote 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Every posting on the platform, regardless of report status — including content hidden pending review. Sorted newest first."
```

**Newest first**, the posted date sorting the table (`Posted ↓`). `Moderation` carries the report state —
*Under review* on the hidden listing, `—` elsewhere. The footer reads *"Showing 1–10 of 85"*, *Page 1 of 9*;
`Next ›` is inert by design (see *Pagination*).

### `11.2f` — All postings · Moderator, filtered Open

**Reached from** `11.2`, `11.2ff`, `11.2fw`, `11.2fe`, `11.2d`, `11.2d2`, `11.2d3`, `11.2d4`  ·  **Leads to** `11.2`, `11.2ff`, `11.2fw`, `11.2fe`, `11.2d`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator, Active=All postings} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator} · [standard, see header]
  FRAME content 1200x634 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    FRAME tableBlock 1152x558 [FILL/HUG] · vertical pad 0 gap 0 · fill color/bg/default · r8
      INSTANCE Desktop/DataTable 1152x514 [FILL/HUG] · vertical pad 0 gap 0 · {Show row 4=true}
        FRAME filterRow 1152x60 [FILL/HUG] · horizontal pad 12/16/12/16 gap 8
          INSTANCE Input/Chip 70x36 [HUG/HUG] · horizontal pad 6/14/6/14 gap 0 · fill color/brand/primary · r999 · {Kind=Select, State=Selected}
            TEXT label 42x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Open"
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
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Under review"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "30 Aug 2026"
        FRAME dataRow 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Grade 8 maths tutoring"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Dilrukshi Herath"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Tutoring"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "27 Aug 2026"
        FRAME dataRow 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "House cleaning — Saturday"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "A. Wijeratne"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Cleaning"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "26 Aug 2026"
        FRAME dataRow4 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Delivery rider — mornings"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "FreshCart Maharagama"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Delivery"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "25 Aug 2026"
        FRAME dataRow05 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Café service crew — evenings"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Green Leaf Café"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Food service"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "24 Aug 2026"
        FRAME dataRow06 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Stock count — weekend"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Kandy Road Pharmacy"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Retail"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "22 Aug 2026"
        FRAME dataRow07 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Home tuition — A/L Physics"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "M. Senanayake"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Tutoring"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "21 Aug 2026"
        FRAME dataRow08 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Banquet waiter — weddings"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Galle Face Events"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Food service"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "19 Aug 2026"
        FRAME dataRow09 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Garden clean-up"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "S. Karunaratne"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Cleaning"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "18 Aug 2026"
        FRAME dataRow10 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Parcel sorting — evenings"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "QuickDrop Couriers"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Delivery"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "15 Aug 2026"
      INSTANCE pagination 1152x44 [FILL/FIXED] · horizontal pad 12/16/12/16 gap 0 · fill color/bg/default · stroke color/border/default mixed · of Desktop/Pagination · {Page=First}
        TEXT countText 168x20 [HUG/HUG] · fill color/text/secondary · desktop/body · "Showing 1–10 of 23 Open"
        FRAME pager 132x20 [HUG/HUG] · horizontal pad 0 gap 16
          TEXT position 75x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Page 1 of 3"
          TEXT nextLink 41x20 [HUG/HUG] · fill color/brand/primary · desktop/body-medium · "Next ›"
    TEXT scopeNote 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Every posting on the platform, regardless of report status — including content hidden pending review. Sorted newest first."
```

**23 Open, first page of 3.** The selected chip is the `{State=Selected}` variant, which is taller and set in
`mobile/body-medium` — the component's own treatment, not an override.

### `11.2ff` — All postings · Moderator, filtered Filled

**Reached from** `11.2`, `11.2f`, `11.2fw`, `11.2fe`, `11.2d`, `11.2d2`, `11.2d3`, `11.2d4`  ·  **Leads to** `11.2f`, `11.2`, `11.2fw`, `11.2fe`, `11.2d3`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator, Active=All postings} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator} · [standard, see header]
  FRAME content 1200x634 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    FRAME tableBlock 1152x558 [FILL/HUG] · vertical pad 0 gap 0 · fill color/bg/default · r8
      INSTANCE Desktop/DataTable 1152x514 [FILL/HUG] · vertical pad 0 gap 0 · {Show row 4=true}
        FRAME filterRow 1152x60 [FILL/HUG] · horizontal pad 12/16/12/16 gap 8
          INSTANCE Input/Chip 64x32 [HUG/HUG] · horizontal pad 6/14/6/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
            TEXT label 36x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Open"
          INSTANCE Input/Chip 69x36 [HUG/HUG] · horizontal pad 6/14/6/14 gap 0 · fill color/brand/primary · r999 · {Kind=Select, State=Selected}
            TEXT label 41x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Filled"
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
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Office cleaning — Kirulapone"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Kottawa Business Centre"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Cleaning"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Filled}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/brand/primary
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Filled"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "27 Aug 2026"
        FRAME dataRow 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Warehouse packing — night shift"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Ceylon Logistics"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Delivery"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Filled}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/brand/primary
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Filled"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "26 Aug 2026"
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
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Sales assistant — Saturday"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Majestic Mobiles"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Retail"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Filled}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/brand/primary
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Filled"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "23 Aug 2026"
        FRAME dataRow05 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Furniture move"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "T. Samarasinghe"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Moving"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Filled}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/brand/primary
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Filled"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "21 Aug 2026"
        FRAME dataRow06 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Kitchen helper — lunch rush"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Spice Route Café"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Food service"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Filled}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/brand/primary
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Filled"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "20 Aug 2026"
        FRAME dataRow07 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Flyer distribution"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Nugegoda Fitness Hub"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Delivery"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Filled}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/brand/primary
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Filled"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "18 Aug 2026"
        FRAME dataRow08 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Maths tutoring — Grade 10"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "H. Peiris"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Tutoring"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Filled}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/brand/primary
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Filled"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "16 Aug 2026"
        FRAME dataRow09 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Stall setup — trade fair"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Colombo Expo Crew"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Event setup"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Filled}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/brand/primary
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Filled"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "14 Aug 2026"
        FRAME dataRow10 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Office deep clean"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Havelock Accounting"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Cleaning"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Filled}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/brand/primary
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Filled"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "11 Aug 2026"
      INSTANCE pagination 1152x44 [FILL/FIXED] · horizontal pad 12/16/12/16 gap 0 · fill color/bg/default · stroke color/border/default mixed · of Desktop/Pagination · {Page=First}
        TEXT countText 166x20 [HUG/HUG] · fill color/text/secondary · desktop/body · "Showing 1–10 of 41 Filled"
        FRAME pager 131x20 [HUG/HUG] · horizontal pad 0 gap 16
          TEXT position 74x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Page 1 of 5"
          TEXT nextLink 41x20 [HUG/HUG] · fill color/brand/primary · desktop/body-medium · "Next ›"
    TEXT scopeNote 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Every posting on the platform, regardless of report status — including content hidden pending review. Sorted newest first."
```

**41 Filled, first page of 5.**

### `11.2fw` — All postings · Moderator, filtered Withdrawn

**Reached from** `11.2`, `11.2f`, `11.2ff`, `11.2fe`, `11.2d`, `11.2d2`, `11.2d3`, `11.2d4`  ·  **Leads to** `11.2f`, `11.2ff`, `11.2`, `11.2fe`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator, Active=All postings} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator} · [standard, see header]
  FRAME content 1200x592 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    FRAME tableBlock 1152x516 [FILL/HUG] · vertical pad 0 gap 0 · fill color/bg/default · r8
      INSTANCE Desktop/DataTable 1152x472 [FILL/HUG] · vertical pad 0 gap 0 · {Show row 4=true}
        FRAME filterRow 1152x60 [FILL/HUG] · horizontal pad 12/16/12/16 gap 8
          INSTANCE Input/Chip 64x32 [HUG/HUG] · horizontal pad 6/14/6/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
            TEXT label 36x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Open"
          INSTANCE Input/Chip 64x32 [HUG/HUG] · horizontal pad 6/14/6/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
            TEXT label 36x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Filled"
          INSTANCE Input/Chip 112x36 [HUG/HUG] · horizontal pad 6/14/6/14 gap 0 · fill color/brand/primary · r999 · {Kind=Select, State=Selected}
            TEXT label 84x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Withdrawn"
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
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Cashier — festival week"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Pettah Traders"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Retail"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 93x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Withdrawn}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 67x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Withdrawn"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "24 Aug 2026"
        FRAME dataRow 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Grocery delivery — weekdays"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Green Basket"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Delivery"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 93x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Withdrawn}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 67x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Withdrawn"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "22 Aug 2026"
        FRAME dataRow4 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Tuition assistant"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Sipsala Academy"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Tutoring"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 93x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Withdrawn}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 67x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Withdrawn"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "19 Aug 2026"
        FRAME dataRow05 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Catering server"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Lotus Catering"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Food service"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 93x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Withdrawn}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 67x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Withdrawn"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "16 Aug 2026"
        FRAME dataRow06 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Moving boxes — apartment"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "D. Fernando"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Moving"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 93x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Withdrawn}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 67x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Withdrawn"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "14 Aug 2026"
        FRAME dataRow07 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Event ushers"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Colombo Arts Circle"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Event setup"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 93x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Withdrawn}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 67x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Withdrawn"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "10 Aug 2026"
        FRAME dataRow08 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Shop cleaning"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Wellawatte Textiles"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Cleaning"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 93x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Withdrawn}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 67x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Withdrawn"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "7 Aug 2026"
        FRAME dataRow09 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Inventory helper"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Dehiwala Hardware"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Retail"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 93x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Withdrawn}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 67x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Withdrawn"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "3 Aug 2026"
        FRAME dataRow10 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Office cleaning — weekly"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "A. Wijeratne"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Cleaning"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 93x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Withdrawn}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 67x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Withdrawn"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "30 Jul 2026"
      INSTANCE pagination 1152x44 [FILL/FIXED] · horizontal pad 12/16/12/16 gap 0 · fill color/bg/default · stroke color/border/default mixed · of Desktop/Pagination · {Page=Single}
        TEXT countText 175x20 [HUG/HUG] · fill color/text/secondary · desktop/body · "Showing 9 of 9 Withdrawn"
    TEXT scopeNote 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Every posting on the platform, regardless of report status — including content hidden pending review. Sorted newest first."
```

**All 9 Withdrawn fit one page**, so the footer is `{Page=Single}` — *"Showing 9 of 9 Withdrawn"*, with no
position and no links.

### `11.2fe` — All postings · Moderator, filtered Expired

**Reached from** `11.2`, `11.2f`, `11.2ff`, `11.2fw`, `11.2d`, `11.2d2`, `11.2d3`  ·  **Leads to** `11.2f`, `11.2ff`, `11.2fw`, `11.2`, `11.2d2`, `11.2d4`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator, Active=All postings} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator} · [standard, see header]
  FRAME content 1200x634 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    FRAME tableBlock 1152x558 [FILL/HUG] · vertical pad 0 gap 0 · fill color/bg/default · r8
      INSTANCE Desktop/DataTable 1152x514 [FILL/HUG] · vertical pad 0 gap 0 · {Show row 4=true}
        FRAME filterRow 1152x60 [FILL/HUG] · horizontal pad 12/16/12/16 gap 8
          INSTANCE Input/Chip 64x32 [HUG/HUG] · horizontal pad 6/14/6/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
            TEXT label 36x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Open"
          INSTANCE Input/Chip 64x32 [HUG/HUG] · horizontal pad 6/14/6/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
            TEXT label 36x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Filled"
          INSTANCE Input/Chip 100x32 [HUG/HUG] · horizontal pad 6/14/6/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
            TEXT label 72x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Withdrawn"
          INSTANCE Input/Chip 86x36 [HUG/HUG] · horizontal pad 6/14/6/14 gap 0 · fill color/brand/primary · r999 · {Kind=Select, State=Selected}
            TEXT label 58x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Expired"
        FRAME headerRow 1152x34 [FILL/HUG] · horizontal pad 8/16/8/16 gap 16 · fill bg/brand-tint
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Title"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Employer"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Category"
          TEXT cell 140x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Status"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Moderation"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Posted ↓"
        FRAME dataRow 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Event setup crew (3 needed)"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Lanka Events (Pvt) Ltd"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Event setup"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "27 Aug 2026"
        FRAME dataRow 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Promoter — shopping mall"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Liberty Retail"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Retail"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "23 Aug 2026"
        FRAME dataRow 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Stage crew — Friday setup"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Lanka Events (Pvt) Ltd"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Event setup"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "20 Aug 2026"
        FRAME dataRow4 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Van loader — house move"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "K. Mendis"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Moving"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "17 Aug 2026"
        FRAME dataRow05 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Tea stall helper — fair"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Maharagama Pola Traders"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Food service"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "13 Aug 2026"
        FRAME dataRow06 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Chair setup — school concert"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Colombo Arts Circle"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Event setup"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "11 Aug 2026"
        FRAME dataRow07 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Event teardown — Sunday"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Lanka Events (Pvt) Ltd"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Event setup"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "9 Aug 2026"
        FRAME dataRow08 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Leaflet drop"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Home Solar Lanka"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Delivery"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "6 Aug 2026"
        FRAME dataRow09 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "House move helpers"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Dilrukshi Herath"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Moving"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "1 Aug 2026"
        FRAME dataRow10 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Window cleaning"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Crescent Apartments"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Cleaning"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "28 Jul 2026"
      INSTANCE pagination 1152x44 [FILL/FIXED] · horizontal pad 12/16/12/16 gap 0 · fill color/bg/default · stroke color/border/default mixed · of Desktop/Pagination · {Page=First}
        TEXT countText 180x20 [HUG/HUG] · fill color/text/secondary · desktop/body · "Showing 1–10 of 12 Expired"
        FRAME pager 131x20 [HUG/HUG] · horizontal pad 0 gap 16
          TEXT position 74x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Page 1 of 2"
          TEXT nextLink 41x20 [HUG/HUG] · fill color/brand/primary · desktop/body-medium · "Next ›"
    TEXT scopeNote 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Every posting on the platform, regardless of report status — including content hidden pending review. Sorted newest first."
```

**12 Expired, first page of 2.** *Event setup crew* is here, not under Open: it closed at its start on
Sat 29 Aug with 1 of 3 places filled (M4).

### `11.2d` — All postings · Moderator, hidden listing detail

**Reached from** `11.2`, `11.2f`, `11.2d2`, `11.2d3`  ·  **Leads to** `11.2f`, `11.2ff`, `11.2fw`, `11.2fe`, `11.2d2`, `11.2d3`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator, Active=All postings} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator} · [standard, see header]
  FRAME content 1200x744 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
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
        FRAME dataRow 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · fill color/bg/subtle · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Data entry — work from home"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "R. Gunasekara"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Retail"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Under review"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "30 Aug 2026"
        FRAME dataRow 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Grade 8 maths tutoring"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Dilrukshi Herath"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Tutoring"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "27 Aug 2026"
        FRAME dataRow 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Office cleaning — Kirulapone"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Kottawa Business Centre"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Cleaning"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Filled}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/brand/primary
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Filled"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "27 Aug 2026"
        FRAME dataRow4 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Event setup crew (3 needed)"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Lanka Events (Pvt) Ltd"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Event setup"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "27 Aug 2026"
        FRAME dataRow05 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Warehouse packing — night shift"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Ceylon Logistics"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Delivery"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Filled}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/brand/primary
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Filled"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "26 Aug 2026"
        FRAME dataRow06 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "House cleaning — Saturday"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "A. Wijeratne"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Cleaning"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "26 Aug 2026"
        FRAME dataRow07 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Shop assistant — weekend"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Saman Stores"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Retail"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Filled}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/brand/primary
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Filled"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "25 Aug 2026"
        FRAME dataRow08 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Delivery rider — mornings"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "FreshCart Maharagama"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Delivery"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "25 Aug 2026"
        FRAME dataRow09 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Café service crew — evenings"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Green Leaf Café"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Food service"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "24 Aug 2026"
        FRAME dataRow10 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Stage crew — Friday setup"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Lanka Events (Pvt) Ltd"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Event setup"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "20 Aug 2026"
      INSTANCE pagination 1152x44 [FILL/FIXED] · horizontal pad 12/16/12/16 gap 0 · fill color/bg/default · stroke color/border/default mixed · of Desktop/Pagination · {Page=First}
        TEXT countText 128x20 [HUG/HUG] · fill color/text/secondary · desktop/body · "Showing 1–10 of 85"
        FRAME pager 131x20 [HUG/HUG] · horizontal pad 0 gap 16
          TEXT position 74x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Page 1 of 9"
          TEXT nextLink 41x20 [HUG/HUG] · fill color/brand/primary · desktop/body-medium · "Next ›"
    TEXT scopeNote 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Every posting on the platform, regardless of report status — including content hidden pending review. Sorted newest first."
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 496x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Data entry — work from home · Open · hidden from browse pending review"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Owner: R. Gunasekara (Employer, Individual) · posted 30 Aug 2026 · Retail · 3 reports (fraud or scam ×2, safety concern) — auto-hidden 31 Aug 2026 by the three-report threshold"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Hidden content stays visible here so a problem can be spotted before anyone else reports it. Escalated for removal 31 Aug 2026; removal is an Admin action."
```

**The hidden listing, Moderator's view.** The card names the three reports, the auto-hide and the 31 Aug
escalation, and says in so many words that *"removal is an Admin action"*. **There is no Remove button** —
not a disabled one: the action is not offered to a Moderator at all.

### `11.2d2` — All postings · Moderator, posting detail (Event setup crew)

**Reached from** `11.2`, `11.2fe`, `11.2d`, `11.2d3`, `11.2d4`  ·  **Leads to** `11.2f`, `11.2ff`, `11.2fw`, `11.2fe`, `11.2d`, `11.2d3`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator, Active=All postings} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator} · [standard, see header]
  FRAME content 1200x744 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
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
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Under review"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "30 Aug 2026"
        FRAME dataRow 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Grade 8 maths tutoring"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Dilrukshi Herath"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Tutoring"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "27 Aug 2026"
        FRAME dataRow 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Office cleaning — Kirulapone"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Kottawa Business Centre"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Cleaning"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Filled}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/brand/primary
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Filled"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "27 Aug 2026"
        FRAME dataRow4 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · fill color/bg/subtle · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Event setup crew (3 needed)"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Lanka Events (Pvt) Ltd"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Event setup"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "27 Aug 2026"
        FRAME dataRow05 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Warehouse packing — night shift"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Ceylon Logistics"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Delivery"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Filled}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/brand/primary
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Filled"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "26 Aug 2026"
        FRAME dataRow06 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "House cleaning — Saturday"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "A. Wijeratne"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Cleaning"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "26 Aug 2026"
        FRAME dataRow07 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Shop assistant — weekend"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Saman Stores"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Retail"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Filled}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/brand/primary
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Filled"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "25 Aug 2026"
        FRAME dataRow08 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Delivery rider — mornings"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "FreshCart Maharagama"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Delivery"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "25 Aug 2026"
        FRAME dataRow09 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Café service crew — evenings"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Green Leaf Café"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Food service"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "24 Aug 2026"
        FRAME dataRow10 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Stage crew — Friday setup"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Lanka Events (Pvt) Ltd"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Event setup"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "20 Aug 2026"
      INSTANCE pagination 1152x44 [FILL/FIXED] · horizontal pad 12/16/12/16 gap 0 · fill color/bg/default · stroke color/border/default mixed · of Desktop/Pagination · {Page=First}
        TEXT countText 128x20 [HUG/HUG] · fill color/text/secondary · desktop/body · "Showing 1–10 of 85"
        FRAME pager 131x20 [HUG/HUG] · horizontal pad 0 gap 16
          TEXT position 74x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Page 1 of 9"
          TEXT nextLink 41x20 [HUG/HUG] · fill color/brand/primary · desktop/body-medium · "Next ›"
    TEXT scopeNote 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Every posting on the platform, regardless of report status — including content hidden pending review. Sorted newest first."
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 380x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Event setup crew (3 needed) · Expired · closed at its start"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Owner: Lanka Events (Pvt) Ltd (Employer, Business) · posted 27 Aug 2026 · Event setup · no reports"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "1 of 3 places filled when it closed at its start, Sat 29 Aug 2026, 7:00 AM. Nothing to action — reports and disputes on a posting appear here if they arrive."
```

### `11.2d3` — All postings · Moderator, posting detail (Shop assistant — weekend)

**Reached from** `11.2`, `11.2ff`, `11.2d`, `11.2d2`  ·  **Leads to** `11.2f`, `11.2ff`, `11.2fw`, `11.2fe`, `11.2d`, `11.2d2`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator, Active=All postings} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator} · [standard, see header]
  FRAME content 1200x744 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
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
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Under review"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "30 Aug 2026"
        FRAME dataRow 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Grade 8 maths tutoring"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Dilrukshi Herath"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Tutoring"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "27 Aug 2026"
        FRAME dataRow 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Office cleaning — Kirulapone"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Kottawa Business Centre"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Cleaning"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Filled}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/brand/primary
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Filled"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "27 Aug 2026"
        FRAME dataRow4 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Event setup crew (3 needed)"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Lanka Events (Pvt) Ltd"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Event setup"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "27 Aug 2026"
        FRAME dataRow05 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Warehouse packing — night shift"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Ceylon Logistics"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Delivery"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Filled}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/brand/primary
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Filled"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "26 Aug 2026"
        FRAME dataRow06 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "House cleaning — Saturday"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "A. Wijeratne"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Cleaning"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "26 Aug 2026"
        FRAME dataRow07 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · fill color/bg/subtle · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Shop assistant — weekend"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Saman Stores"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Retail"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Filled}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/brand/primary
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Filled"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "25 Aug 2026"
        FRAME dataRow08 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Delivery rider — mornings"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "FreshCart Maharagama"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Delivery"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "25 Aug 2026"
        FRAME dataRow09 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Café service crew — evenings"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Green Leaf Café"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Food service"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "24 Aug 2026"
        FRAME dataRow10 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Stage crew — Friday setup"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Lanka Events (Pvt) Ltd"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Event setup"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "20 Aug 2026"
      INSTANCE pagination 1152x44 [FILL/FIXED] · horizontal pad 12/16/12/16 gap 0 · fill color/bg/default · stroke color/border/default mixed · of Desktop/Pagination · {Page=First}
        TEXT countText 128x20 [HUG/HUG] · fill color/text/secondary · desktop/body · "Showing 1–10 of 85"
        FRAME pager 131x20 [HUG/HUG] · horizontal pad 0 gap 16
          TEXT position 74x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Page 1 of 9"
          TEXT nextLink 41x20 [HUG/HUG] · fill color/brand/primary · desktop/body-medium · "Next ›"
    TEXT scopeNote 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Every posting on the platform, regardless of report status — including content hidden pending review. Sorted newest first."
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 226x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Shop assistant — weekend · Filled"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Owner: Saman Stores (Employer, Business) · posted 25 Aug 2026 · Retail · no reports on the posting"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "1 of 1 filled by Kavindu Perera — the arrival dispute on this engagement is on the case queue, not on the posting."
```

### `11.2d4` — All postings · Moderator, posting detail (House move helpers)

**Reached from** `11.2fe`  ·  **Leads to** `11.2f`, `11.2ff`, `11.2fw`, `11.2`, `11.2d2`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator, Active=All postings} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator} · [standard, see header]
  FRAME content 1200x748 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    FRAME tableBlock 1152x558 [FILL/HUG] · vertical pad 0 gap 0 · fill color/bg/default · r8
      INSTANCE Desktop/DataTable 1152x514 [FILL/HUG] · vertical pad 0 gap 0 · {Show row 4=true}
        FRAME filterRow 1152x60 [FILL/HUG] · horizontal pad 12/16/12/16 gap 8
          INSTANCE Input/Chip 64x32 [HUG/HUG] · horizontal pad 6/14/6/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
            TEXT label 36x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Open"
          INSTANCE Input/Chip 64x32 [HUG/HUG] · horizontal pad 6/14/6/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
            TEXT label 36x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Filled"
          INSTANCE Input/Chip 100x32 [HUG/HUG] · horizontal pad 6/14/6/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
            TEXT label 72x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Withdrawn"
          INSTANCE Input/Chip 86x36 [HUG/HUG] · horizontal pad 6/14/6/14 gap 0 · fill color/brand/primary · r999 · {Kind=Select, State=Selected}
            TEXT label 58x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Expired"
        FRAME headerRow 1152x34 [FILL/HUG] · horizontal pad 8/16/8/16 gap 16 · fill bg/brand-tint
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Title"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Employer"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Category"
          TEXT cell 140x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Status"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Moderation"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Posted ↓"
        FRAME dataRow 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Event setup crew (3 needed)"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Lanka Events (Pvt) Ltd"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Event setup"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "27 Aug 2026"
        FRAME dataRow 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Promoter — shopping mall"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Liberty Retail"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Retail"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "23 Aug 2026"
        FRAME dataRow 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Stage crew — Friday setup"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Lanka Events (Pvt) Ltd"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Event setup"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "20 Aug 2026"
        FRAME dataRow4 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Van loader — house move"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "K. Mendis"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Moving"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "17 Aug 2026"
        FRAME dataRow05 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Tea stall helper — fair"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Maharagama Pola Traders"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Food service"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "13 Aug 2026"
        FRAME dataRow06 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Chair setup — school concert"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Colombo Arts Circle"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Event setup"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "11 Aug 2026"
        FRAME dataRow07 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Event teardown — Sunday"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Lanka Events (Pvt) Ltd"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Event setup"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "9 Aug 2026"
        FRAME dataRow08 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Leaflet drop"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Home Solar Lanka"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Delivery"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "6 Aug 2026"
        FRAME dataRow09 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · fill color/bg/subtle · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "House move helpers"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Dilrukshi Herath"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Moving"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "1 Aug 2026"
        FRAME dataRow10 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Window cleaning"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Crescent Apartments"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Cleaning"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "28 Jul 2026"
      INSTANCE pagination 1152x44 [FILL/FIXED] · horizontal pad 12/16/12/16 gap 0 · fill color/bg/default · stroke color/border/default mixed · of Desktop/Pagination · {Page=First}
        TEXT countText 180x20 [HUG/HUG] · fill color/text/secondary · desktop/body · "Showing 1–10 of 12 Expired"
        FRAME pager 131x20 [HUG/HUG] · horizontal pad 0 gap 16
          TEXT position 74x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Page 1 of 2"
          TEXT nextLink 41x20 [HUG/HUG] · fill color/brand/primary · desktop/body-medium · "Next ›"
    TEXT scopeNote 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Every posting on the platform, regardless of report status — including content hidden pending review. Sorted newest first."
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 197x20 [HUG/HUG] · fill color/text/primary · desktop/body · "House move helpers · Expired"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Owner: Dilrukshi Herath (Employer, Individual) · posted 1 Aug 2026 · Moving · expired 12 Aug 2026 with 0 of 1 filled"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Expired postings stay listed for staff; nothing to action."
```

### `11.2a` — All postings · Admin

**Reached from** `11.2af`, `11.2aff`, `11.2afw`, `11.2afe`, `11.2ad4`  ·  **Leads to** `11.2af`, `11.2aff`, `11.2afw`, `11.2afe`, `11.2ad`, `11.2ad2`, `11.2ad3`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin, Active=All postings} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin} · [standard, see header]
  FRAME content 1200x630 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
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
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Under review"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "30 Aug 2026"
        FRAME dataRow 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Grade 8 maths tutoring"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Dilrukshi Herath"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Tutoring"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "27 Aug 2026"
        FRAME dataRow 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Office cleaning — Kirulapone"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Kottawa Business Centre"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Cleaning"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Filled}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/brand/primary
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Filled"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "27 Aug 2026"
        FRAME dataRow4 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Event setup crew (3 needed)"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Lanka Events (Pvt) Ltd"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Event setup"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "27 Aug 2026"
        FRAME dataRow05 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Warehouse packing — night shift"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Ceylon Logistics"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Delivery"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Filled}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/brand/primary
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Filled"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "26 Aug 2026"
        FRAME dataRow06 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "House cleaning — Saturday"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "A. Wijeratne"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Cleaning"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "26 Aug 2026"
        FRAME dataRow07 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Shop assistant — weekend"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Saman Stores"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Retail"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Filled}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/brand/primary
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Filled"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "25 Aug 2026"
        FRAME dataRow08 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Delivery rider — mornings"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "FreshCart Maharagama"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Delivery"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "25 Aug 2026"
        FRAME dataRow09 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Café service crew — evenings"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Green Leaf Café"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Food service"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "24 Aug 2026"
        FRAME dataRow10 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Stage crew — Friday setup"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Lanka Events (Pvt) Ltd"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Event setup"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "20 Aug 2026"
      INSTANCE pagination 1152x44 [FILL/FIXED] · horizontal pad 12/16/12/16 gap 0 · fill color/bg/default · stroke color/border/default mixed · of Desktop/Pagination · {Page=First}
        TEXT countText 128x20 [HUG/HUG] · fill color/text/secondary · desktop/body · "Showing 1–10 of 85"
        FRAME pager 131x20 [HUG/HUG] · horizontal pad 0 gap 16
          TEXT position 74x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Page 1 of 9"
          TEXT nextLink 41x20 [HUG/HUG] · fill color/brand/primary · desktop/body-medium · "Next ›"
    TEXT scopeNote 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Every posting on the platform, regardless of report status — including content hidden pending review. Sorted newest first."
```

### `11.2af` — All postings · Admin, filtered Open

**Reached from** `11.2a`, `11.2aff`, `11.2afw`, `11.2afe`, `11.2ad`, `11.2ad2`, `11.2ad3`, `11.2ad4`  ·  **Leads to** `11.2a`, `11.2aff`, `11.2afw`, `11.2afe`, `11.2ad`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin, Active=All postings} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin} · [standard, see header]
  FRAME content 1200x634 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    FRAME tableBlock 1152x558 [FILL/HUG] · vertical pad 0 gap 0 · fill color/bg/default · r8
      INSTANCE Desktop/DataTable 1152x514 [FILL/HUG] · vertical pad 0 gap 0 · {Show row 4=true}
        FRAME filterRow 1152x60 [FILL/HUG] · horizontal pad 12/16/12/16 gap 8
          INSTANCE Input/Chip 70x36 [HUG/HUG] · horizontal pad 6/14/6/14 gap 0 · fill color/brand/primary · r999 · {Kind=Select, State=Selected}
            TEXT label 42x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Open"
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
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Under review"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "30 Aug 2026"
        FRAME dataRow 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Grade 8 maths tutoring"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Dilrukshi Herath"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Tutoring"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "27 Aug 2026"
        FRAME dataRow 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "House cleaning — Saturday"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "A. Wijeratne"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Cleaning"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "26 Aug 2026"
        FRAME dataRow4 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Delivery rider — mornings"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "FreshCart Maharagama"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Delivery"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "25 Aug 2026"
        FRAME dataRow05 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Café service crew — evenings"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Green Leaf Café"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Food service"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "24 Aug 2026"
        FRAME dataRow06 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Stock count — weekend"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Kandy Road Pharmacy"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Retail"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "22 Aug 2026"
        FRAME dataRow07 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Home tuition — A/L Physics"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "M. Senanayake"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Tutoring"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "21 Aug 2026"
        FRAME dataRow08 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Banquet waiter — weddings"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Galle Face Events"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Food service"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "19 Aug 2026"
        FRAME dataRow09 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Garden clean-up"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "S. Karunaratne"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Cleaning"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "18 Aug 2026"
        FRAME dataRow10 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Parcel sorting — evenings"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "QuickDrop Couriers"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Delivery"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "15 Aug 2026"
      INSTANCE pagination 1152x44 [FILL/FIXED] · horizontal pad 12/16/12/16 gap 0 · fill color/bg/default · stroke color/border/default mixed · of Desktop/Pagination · {Page=First}
        TEXT countText 168x20 [HUG/HUG] · fill color/text/secondary · desktop/body · "Showing 1–10 of 23 Open"
        FRAME pager 132x20 [HUG/HUG] · horizontal pad 0 gap 16
          TEXT position 75x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Page 1 of 3"
          TEXT nextLink 41x20 [HUG/HUG] · fill color/brand/primary · desktop/body-medium · "Next ›"
    TEXT scopeNote 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Every posting on the platform, regardless of report status — including content hidden pending review. Sorted newest first."
```

### `11.2aff` — All postings · Admin, filtered Filled

**Reached from** `11.2a`, `11.2af`, `11.2afw`, `11.2afe`, `11.2ad`, `11.2ad2`, `11.2ad3`, `11.2ad4`  ·  **Leads to** `11.2af`, `11.2a`, `11.2afw`, `11.2afe`, `11.2ad3`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin, Active=All postings} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin} · [standard, see header]
  FRAME content 1200x634 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    FRAME tableBlock 1152x558 [FILL/HUG] · vertical pad 0 gap 0 · fill color/bg/default · r8
      INSTANCE Desktop/DataTable 1152x514 [FILL/HUG] · vertical pad 0 gap 0 · {Show row 4=true}
        FRAME filterRow 1152x60 [FILL/HUG] · horizontal pad 12/16/12/16 gap 8
          INSTANCE Input/Chip 64x32 [HUG/HUG] · horizontal pad 6/14/6/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
            TEXT label 36x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Open"
          INSTANCE Input/Chip 69x36 [HUG/HUG] · horizontal pad 6/14/6/14 gap 0 · fill color/brand/primary · r999 · {Kind=Select, State=Selected}
            TEXT label 41x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Filled"
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
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Office cleaning — Kirulapone"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Kottawa Business Centre"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Cleaning"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Filled}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/brand/primary
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Filled"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "27 Aug 2026"
        FRAME dataRow 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Warehouse packing — night shift"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Ceylon Logistics"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Delivery"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Filled}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/brand/primary
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Filled"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "26 Aug 2026"
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
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Sales assistant — Saturday"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Majestic Mobiles"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Retail"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Filled}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/brand/primary
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Filled"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "23 Aug 2026"
        FRAME dataRow05 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Furniture move"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "T. Samarasinghe"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Moving"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Filled}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/brand/primary
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Filled"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "21 Aug 2026"
        FRAME dataRow06 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Kitchen helper — lunch rush"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Spice Route Café"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Food service"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Filled}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/brand/primary
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Filled"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "20 Aug 2026"
        FRAME dataRow07 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Flyer distribution"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Nugegoda Fitness Hub"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Delivery"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Filled}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/brand/primary
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Filled"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "18 Aug 2026"
        FRAME dataRow08 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Maths tutoring — Grade 10"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "H. Peiris"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Tutoring"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Filled}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/brand/primary
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Filled"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "16 Aug 2026"
        FRAME dataRow09 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Stall setup — trade fair"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Colombo Expo Crew"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Event setup"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Filled}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/brand/primary
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Filled"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "14 Aug 2026"
        FRAME dataRow10 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Office deep clean"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Havelock Accounting"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Cleaning"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Filled}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/brand/primary
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Filled"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "11 Aug 2026"
      INSTANCE pagination 1152x44 [FILL/FIXED] · horizontal pad 12/16/12/16 gap 0 · fill color/bg/default · stroke color/border/default mixed · of Desktop/Pagination · {Page=First}
        TEXT countText 166x20 [HUG/HUG] · fill color/text/secondary · desktop/body · "Showing 1–10 of 41 Filled"
        FRAME pager 131x20 [HUG/HUG] · horizontal pad 0 gap 16
          TEXT position 74x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Page 1 of 5"
          TEXT nextLink 41x20 [HUG/HUG] · fill color/brand/primary · desktop/body-medium · "Next ›"
    TEXT scopeNote 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Every posting on the platform, regardless of report status — including content hidden pending review. Sorted newest first."
```

### `11.2afw` — All postings · Admin, filtered Withdrawn

**Reached from** `11.2a`, `11.2af`, `11.2aff`, `11.2afe`, `11.2ad`, `11.2ad2`, `11.2ad3`, `11.2ad4`  ·  **Leads to** `11.2af`, `11.2aff`, `11.2a`, `11.2afe`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin, Active=All postings} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin} · [standard, see header]
  FRAME content 1200x592 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    FRAME tableBlock 1152x516 [FILL/HUG] · vertical pad 0 gap 0 · fill color/bg/default · r8
      INSTANCE Desktop/DataTable 1152x472 [FILL/HUG] · vertical pad 0 gap 0 · {Show row 4=true}
        FRAME filterRow 1152x60 [FILL/HUG] · horizontal pad 12/16/12/16 gap 8
          INSTANCE Input/Chip 64x32 [HUG/HUG] · horizontal pad 6/14/6/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
            TEXT label 36x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Open"
          INSTANCE Input/Chip 64x32 [HUG/HUG] · horizontal pad 6/14/6/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
            TEXT label 36x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Filled"
          INSTANCE Input/Chip 112x36 [HUG/HUG] · horizontal pad 6/14/6/14 gap 0 · fill color/brand/primary · r999 · {Kind=Select, State=Selected}
            TEXT label 84x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Withdrawn"
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
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Cashier — festival week"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Pettah Traders"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Retail"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 93x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Withdrawn}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 67x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Withdrawn"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "24 Aug 2026"
        FRAME dataRow 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Grocery delivery — weekdays"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Green Basket"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Delivery"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 93x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Withdrawn}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 67x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Withdrawn"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "22 Aug 2026"
        FRAME dataRow4 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Tuition assistant"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Sipsala Academy"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Tutoring"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 93x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Withdrawn}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 67x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Withdrawn"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "19 Aug 2026"
        FRAME dataRow05 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Catering server"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Lotus Catering"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Food service"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 93x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Withdrawn}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 67x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Withdrawn"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "16 Aug 2026"
        FRAME dataRow06 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Moving boxes — apartment"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "D. Fernando"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Moving"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 93x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Withdrawn}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 67x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Withdrawn"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "14 Aug 2026"
        FRAME dataRow07 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Event ushers"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Colombo Arts Circle"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Event setup"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 93x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Withdrawn}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 67x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Withdrawn"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "10 Aug 2026"
        FRAME dataRow08 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Shop cleaning"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Wellawatte Textiles"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Cleaning"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 93x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Withdrawn}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 67x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Withdrawn"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "7 Aug 2026"
        FRAME dataRow09 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Inventory helper"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Dehiwala Hardware"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Retail"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 93x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Withdrawn}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 67x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Withdrawn"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "3 Aug 2026"
        FRAME dataRow10 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Office cleaning — weekly"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "A. Wijeratne"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Cleaning"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 93x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Withdrawn}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 67x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Withdrawn"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "30 Jul 2026"
      INSTANCE pagination 1152x44 [FILL/FIXED] · horizontal pad 12/16/12/16 gap 0 · fill color/bg/default · stroke color/border/default mixed · of Desktop/Pagination · {Page=Single}
        TEXT countText 175x20 [HUG/HUG] · fill color/text/secondary · desktop/body · "Showing 9 of 9 Withdrawn"
    TEXT scopeNote 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Every posting on the platform, regardless of report status — including content hidden pending review. Sorted newest first."
```

### `11.2afe` — All postings · Admin, filtered Expired

**Reached from** `11.2a`, `11.2af`, `11.2aff`, `11.2afw`, `11.2ad`, `11.2ad2`, `11.2ad3`  ·  **Leads to** `11.2af`, `11.2aff`, `11.2afw`, `11.2a`, `11.2ad2`, `11.2ad4`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin, Active=All postings} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin} · [standard, see header]
  FRAME content 1200x634 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    FRAME tableBlock 1152x558 [FILL/HUG] · vertical pad 0 gap 0 · fill color/bg/default · r8
      INSTANCE Desktop/DataTable 1152x514 [FILL/HUG] · vertical pad 0 gap 0 · {Show row 4=true}
        FRAME filterRow 1152x60 [FILL/HUG] · horizontal pad 12/16/12/16 gap 8
          INSTANCE Input/Chip 64x32 [HUG/HUG] · horizontal pad 6/14/6/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
            TEXT label 36x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Open"
          INSTANCE Input/Chip 64x32 [HUG/HUG] · horizontal pad 6/14/6/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
            TEXT label 36x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Filled"
          INSTANCE Input/Chip 100x32 [HUG/HUG] · horizontal pad 6/14/6/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
            TEXT label 72x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Withdrawn"
          INSTANCE Input/Chip 86x36 [HUG/HUG] · horizontal pad 6/14/6/14 gap 0 · fill color/brand/primary · r999 · {Kind=Select, State=Selected}
            TEXT label 58x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Expired"
        FRAME headerRow 1152x34 [FILL/HUG] · horizontal pad 8/16/8/16 gap 16 · fill bg/brand-tint
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Title"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Employer"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Category"
          TEXT cell 140x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Status"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Moderation"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Posted ↓"
        FRAME dataRow 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Event setup crew (3 needed)"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Lanka Events (Pvt) Ltd"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Event setup"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "27 Aug 2026"
        FRAME dataRow 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Promoter — shopping mall"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Liberty Retail"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Retail"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "23 Aug 2026"
        FRAME dataRow 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Stage crew — Friday setup"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Lanka Events (Pvt) Ltd"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Event setup"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "20 Aug 2026"
        FRAME dataRow4 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Van loader — house move"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "K. Mendis"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Moving"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "17 Aug 2026"
        FRAME dataRow05 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Tea stall helper — fair"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Maharagama Pola Traders"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Food service"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "13 Aug 2026"
        FRAME dataRow06 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Chair setup — school concert"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Colombo Arts Circle"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Event setup"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "11 Aug 2026"
        FRAME dataRow07 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Event teardown — Sunday"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Lanka Events (Pvt) Ltd"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Event setup"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "9 Aug 2026"
        FRAME dataRow08 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Leaflet drop"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Home Solar Lanka"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Delivery"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "6 Aug 2026"
        FRAME dataRow09 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "House move helpers"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Dilrukshi Herath"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Moving"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "1 Aug 2026"
        FRAME dataRow10 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Window cleaning"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Crescent Apartments"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Cleaning"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "28 Jul 2026"
      INSTANCE pagination 1152x44 [FILL/FIXED] · horizontal pad 12/16/12/16 gap 0 · fill color/bg/default · stroke color/border/default mixed · of Desktop/Pagination · {Page=First}
        TEXT countText 180x20 [HUG/HUG] · fill color/text/secondary · desktop/body · "Showing 1–10 of 12 Expired"
        FRAME pager 131x20 [HUG/HUG] · horizontal pad 0 gap 16
          TEXT position 74x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Page 1 of 2"
          TEXT nextLink 41x20 [HUG/HUG] · fill color/brand/primary · desktop/body-medium · "Next ›"
    TEXT scopeNote 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Every posting on the platform, regardless of report status — including content hidden pending review. Sorted newest first."
```

### `11.2ad` — All postings · Admin, hidden listing detail

**Reached from** `11.4a`, `11.4ar`, `11.2a`, `11.2af`, `11.2ad2`, `11.2ad3`  ·  **Leads to** `11.2af`, `11.2aff`, `11.2afw`, `11.2afe`, `11.2ad2`, `11.2ad3`  ·  **Opens** `10.7`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin, Active=All postings} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin} · [standard, see header]
  FRAME content 1200x806 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
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
        FRAME dataRow 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · fill color/bg/subtle · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Data entry — work from home"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "R. Gunasekara"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Retail"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Under review"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "30 Aug 2026"
        FRAME dataRow 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Grade 8 maths tutoring"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Dilrukshi Herath"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Tutoring"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "27 Aug 2026"
        FRAME dataRow 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Office cleaning — Kirulapone"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Kottawa Business Centre"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Cleaning"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Filled}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/brand/primary
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Filled"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "27 Aug 2026"
        FRAME dataRow4 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Event setup crew (3 needed)"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Lanka Events (Pvt) Ltd"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Event setup"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "27 Aug 2026"
        FRAME dataRow05 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Warehouse packing — night shift"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Ceylon Logistics"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Delivery"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Filled}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/brand/primary
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Filled"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "26 Aug 2026"
        FRAME dataRow06 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "House cleaning — Saturday"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "A. Wijeratne"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Cleaning"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "26 Aug 2026"
        FRAME dataRow07 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Shop assistant — weekend"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Saman Stores"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Retail"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Filled}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/brand/primary
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Filled"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "25 Aug 2026"
        FRAME dataRow08 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Delivery rider — mornings"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "FreshCart Maharagama"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Delivery"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "25 Aug 2026"
        FRAME dataRow09 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Café service crew — evenings"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Green Leaf Café"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Food service"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "24 Aug 2026"
        FRAME dataRow10 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Stage crew — Friday setup"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Lanka Events (Pvt) Ltd"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Event setup"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "20 Aug 2026"
      INSTANCE pagination 1152x44 [FILL/FIXED] · horizontal pad 12/16/12/16 gap 0 · fill color/bg/default · stroke color/border/default mixed · of Desktop/Pagination · {Page=First}
        TEXT countText 128x20 [HUG/HUG] · fill color/text/secondary · desktop/body · "Showing 1–10 of 85"
        FRAME pager 131x20 [HUG/HUG] · horizontal pad 0 gap 16
          TEXT position 74x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Page 1 of 9"
          TEXT nextLink 41x20 [HUG/HUG] · fill color/brand/primary · desktop/body-medium · "Next ›"
    TEXT scopeNote 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Every posting on the platform, regardless of report status — including content hidden pending review. Sorted newest first."
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 496x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Data entry — work from home · Open · hidden from browse pending review"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Owner: R. Gunasekara (Employer, Individual) · posted 30 Aug 2026 · Retail · 3 reports (fraud or scam ×2, safety concern) — auto-hidden 31 Aug 2026 by the three-report threshold"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Escalated for removal by Shalini Weerasinghe on 31 Aug 2026. Removal stops new applications immediately; engagements already in progress continue."
    INSTANCE Action/Button 171x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
      TEXT label 123x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Remove posting"
```

The Admin's view of the same listing, with **Remove posting**, which opens `10.7`.

### `11.2ad2` — All postings · Admin, posting detail (Event setup crew)

**Reached from** `11.2a`, `11.2afe`, `11.2ad`, `11.2ad3`, `11.2ad4`  ·  **Leads to** `11.2af`, `11.2aff`, `11.2afw`, `11.2afe`, `11.2ad`, `11.2ad3`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin, Active=All postings} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin} · [standard, see header]
  FRAME content 1200x744 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
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
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Under review"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "30 Aug 2026"
        FRAME dataRow 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Grade 8 maths tutoring"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Dilrukshi Herath"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Tutoring"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "27 Aug 2026"
        FRAME dataRow 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Office cleaning — Kirulapone"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Kottawa Business Centre"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Cleaning"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Filled}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/brand/primary
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Filled"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "27 Aug 2026"
        FRAME dataRow4 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · fill color/bg/subtle · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Event setup crew (3 needed)"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Lanka Events (Pvt) Ltd"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Event setup"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "27 Aug 2026"
        FRAME dataRow05 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Warehouse packing — night shift"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Ceylon Logistics"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Delivery"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Filled}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/brand/primary
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Filled"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "26 Aug 2026"
        FRAME dataRow06 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "House cleaning — Saturday"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "A. Wijeratne"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Cleaning"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "26 Aug 2026"
        FRAME dataRow07 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Shop assistant — weekend"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Saman Stores"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Retail"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Filled}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/brand/primary
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Filled"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "25 Aug 2026"
        FRAME dataRow08 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Delivery rider — mornings"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "FreshCart Maharagama"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Delivery"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "25 Aug 2026"
        FRAME dataRow09 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Café service crew — evenings"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Green Leaf Café"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Food service"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "24 Aug 2026"
        FRAME dataRow10 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Stage crew — Friday setup"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Lanka Events (Pvt) Ltd"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Event setup"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "20 Aug 2026"
      INSTANCE pagination 1152x44 [FILL/FIXED] · horizontal pad 12/16/12/16 gap 0 · fill color/bg/default · stroke color/border/default mixed · of Desktop/Pagination · {Page=First}
        TEXT countText 128x20 [HUG/HUG] · fill color/text/secondary · desktop/body · "Showing 1–10 of 85"
        FRAME pager 131x20 [HUG/HUG] · horizontal pad 0 gap 16
          TEXT position 74x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Page 1 of 9"
          TEXT nextLink 41x20 [HUG/HUG] · fill color/brand/primary · desktop/body-medium · "Next ›"
    TEXT scopeNote 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Every posting on the platform, regardless of report status — including content hidden pending review. Sorted newest first."
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 380x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Event setup crew (3 needed) · Expired · closed at its start"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Owner: Lanka Events (Pvt) Ltd (Employer, Business) · posted 27 Aug 2026 · Event setup · no reports"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "1 of 3 places filled when it closed at its start, Sat 29 Aug 2026, 7:00 AM. Nothing to action — reports and disputes on a posting appear here if they arrive."
```

### `11.2ad3` — All postings · Admin, posting detail (Shop assistant — weekend)

**Reached from** `11.2a`, `11.2aff`, `11.2ad`, `11.2ad2`  ·  **Leads to** `11.2af`, `11.2aff`, `11.2afw`, `11.2afe`, `11.2ad`, `11.2ad2`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin, Active=All postings} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin} · [standard, see header]
  FRAME content 1200x744 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
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
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Under review"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "30 Aug 2026"
        FRAME dataRow 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Grade 8 maths tutoring"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Dilrukshi Herath"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Tutoring"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "27 Aug 2026"
        FRAME dataRow 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Office cleaning — Kirulapone"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Kottawa Business Centre"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Cleaning"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Filled}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/brand/primary
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Filled"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "27 Aug 2026"
        FRAME dataRow4 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Event setup crew (3 needed)"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Lanka Events (Pvt) Ltd"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Event setup"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "27 Aug 2026"
        FRAME dataRow05 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Warehouse packing — night shift"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Ceylon Logistics"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Delivery"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Filled}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/brand/primary
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Filled"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "26 Aug 2026"
        FRAME dataRow06 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "House cleaning — Saturday"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "A. Wijeratne"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Cleaning"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "26 Aug 2026"
        FRAME dataRow07 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · fill color/bg/subtle · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Shop assistant — weekend"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Saman Stores"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Retail"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Filled}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/brand/primary
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Filled"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "25 Aug 2026"
        FRAME dataRow08 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Delivery rider — mornings"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "FreshCart Maharagama"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Delivery"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "25 Aug 2026"
        FRAME dataRow09 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Café service crew — evenings"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Green Leaf Café"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Food service"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "24 Aug 2026"
        FRAME dataRow10 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Stage crew — Friday setup"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Lanka Events (Pvt) Ltd"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Event setup"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "20 Aug 2026"
      INSTANCE pagination 1152x44 [FILL/FIXED] · horizontal pad 12/16/12/16 gap 0 · fill color/bg/default · stroke color/border/default mixed · of Desktop/Pagination · {Page=First}
        TEXT countText 128x20 [HUG/HUG] · fill color/text/secondary · desktop/body · "Showing 1–10 of 85"
        FRAME pager 131x20 [HUG/HUG] · horizontal pad 0 gap 16
          TEXT position 74x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Page 1 of 9"
          TEXT nextLink 41x20 [HUG/HUG] · fill color/brand/primary · desktop/body-medium · "Next ›"
    TEXT scopeNote 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Every posting on the platform, regardless of report status — including content hidden pending review. Sorted newest first."
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 226x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Shop assistant — weekend · Filled"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Owner: Saman Stores (Employer, Business) · posted 25 Aug 2026 · Retail · no reports on the posting"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "1 of 1 filled by Kavindu Perera — the arrival dispute on this engagement was ruled on 4 Sep 2026; it lives on the case, not on the posting."
```

### `11.2ad4` — All postings · Admin, posting detail (House move helpers)

**Reached from** `11.2afe`  ·  **Leads to** `11.2af`, `11.2aff`, `11.2afw`, `11.2a`, `11.2ad2`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin, Active=All postings} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin} · [standard, see header]
  FRAME content 1200x748 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    FRAME tableBlock 1152x558 [FILL/HUG] · vertical pad 0 gap 0 · fill color/bg/default · r8
      INSTANCE Desktop/DataTable 1152x514 [FILL/HUG] · vertical pad 0 gap 0 · {Show row 4=true}
        FRAME filterRow 1152x60 [FILL/HUG] · horizontal pad 12/16/12/16 gap 8
          INSTANCE Input/Chip 64x32 [HUG/HUG] · horizontal pad 6/14/6/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
            TEXT label 36x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Open"
          INSTANCE Input/Chip 64x32 [HUG/HUG] · horizontal pad 6/14/6/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
            TEXT label 36x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Filled"
          INSTANCE Input/Chip 100x32 [HUG/HUG] · horizontal pad 6/14/6/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
            TEXT label 72x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Withdrawn"
          INSTANCE Input/Chip 86x36 [HUG/HUG] · horizontal pad 6/14/6/14 gap 0 · fill color/brand/primary · r999 · {Kind=Select, State=Selected}
            TEXT label 58x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Expired"
        FRAME headerRow 1152x34 [FILL/HUG] · horizontal pad 8/16/8/16 gap 16 · fill bg/brand-tint
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Title"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Employer"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Category"
          TEXT cell 140x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Status"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Moderation"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Posted ↓"
        FRAME dataRow 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Event setup crew (3 needed)"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Lanka Events (Pvt) Ltd"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Event setup"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "27 Aug 2026"
        FRAME dataRow 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Promoter — shopping mall"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Liberty Retail"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Retail"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "23 Aug 2026"
        FRAME dataRow 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Stage crew — Friday setup"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Lanka Events (Pvt) Ltd"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Event setup"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "20 Aug 2026"
        FRAME dataRow4 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Van loader — house move"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "K. Mendis"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Moving"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "17 Aug 2026"
        FRAME dataRow05 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Tea stall helper — fair"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Maharagama Pola Traders"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Food service"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "13 Aug 2026"
        FRAME dataRow06 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Chair setup — school concert"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Colombo Arts Circle"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Event setup"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "11 Aug 2026"
        FRAME dataRow07 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Event teardown — Sunday"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Lanka Events (Pvt) Ltd"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Event setup"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "9 Aug 2026"
        FRAME dataRow08 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Leaflet drop"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Home Solar Lanka"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Delivery"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "6 Aug 2026"
        FRAME dataRow09 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · fill color/bg/subtle · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "House move helpers"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Dilrukshi Herath"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Moving"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "1 Aug 2026"
        FRAME dataRow10 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Window cleaning"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Crescent Apartments"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Cleaning"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "28 Jul 2026"
      INSTANCE pagination 1152x44 [FILL/FIXED] · horizontal pad 12/16/12/16 gap 0 · fill color/bg/default · stroke color/border/default mixed · of Desktop/Pagination · {Page=First}
        TEXT countText 180x20 [HUG/HUG] · fill color/text/secondary · desktop/body · "Showing 1–10 of 12 Expired"
        FRAME pager 131x20 [HUG/HUG] · horizontal pad 0 gap 16
          TEXT position 74x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Page 1 of 2"
          TEXT nextLink 41x20 [HUG/HUG] · fill color/brand/primary · desktop/body-medium · "Next ›"
    TEXT scopeNote 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Every posting on the platform, regardless of report status — including content hidden pending review. Sorted newest first."
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 197x20 [HUG/HUG] · fill color/text/primary · desktop/body · "House move helpers · Expired"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Owner: Dilrukshi Herath (Employer, Individual) · posted 1 Aug 2026 · Moving · expired 12 Aug 2026 with 0 of 1 filled"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Expired postings stay listed for staff; nothing to action."
```

### `10.7` — Remove posting? (dialog) — an M10 screen, drawn here over `11.2ad`

**Opens over** `11.2ad`  ·  **Cancel returns to** `11.2ad`  ·  **Confirm** → *disabled — see below*

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin, Active=All postings} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin} · [standard, see header]
  FRAME content 1200x806 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
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
        FRAME dataRow 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · fill color/bg/subtle · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Data entry — work from home"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "R. Gunasekara"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Retail"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Under review"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "30 Aug 2026"
        FRAME dataRow 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Grade 8 maths tutoring"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Dilrukshi Herath"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Tutoring"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "27 Aug 2026"
        FRAME dataRow 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Office cleaning — Kirulapone"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Kottawa Business Centre"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Cleaning"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Filled}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/brand/primary
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Filled"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "27 Aug 2026"
        FRAME dataRow4 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Event setup crew (3 needed)"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Lanka Events (Pvt) Ltd"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Event setup"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "27 Aug 2026"
        FRAME dataRow05 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Warehouse packing — night shift"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Ceylon Logistics"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Delivery"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Filled}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/brand/primary
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Filled"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "26 Aug 2026"
        FRAME dataRow06 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "House cleaning — Saturday"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "A. Wijeratne"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Cleaning"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "26 Aug 2026"
        FRAME dataRow07 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Shop assistant — weekend"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Saman Stores"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Retail"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Filled}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/brand/primary
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Filled"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "25 Aug 2026"
        FRAME dataRow08 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Delivery rider — mornings"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "FreshCart Maharagama"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Delivery"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "25 Aug 2026"
        FRAME dataRow09 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Café service crew — evenings"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Green Leaf Café"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Food service"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "24 Aug 2026"
        FRAME dataRow10 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Stage crew — Friday setup"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Lanka Events (Pvt) Ltd"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Event setup"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "20 Aug 2026"
      INSTANCE pagination 1152x44 [FILL/FIXED] · horizontal pad 12/16/12/16 gap 0 · fill color/bg/default · stroke color/border/default mixed · of Desktop/Pagination · {Page=First}
        TEXT countText 128x20 [HUG/HUG] · fill color/text/secondary · desktop/body · "Showing 1–10 of 85"
        FRAME pager 131x20 [HUG/HUG] · horizontal pad 0 gap 16
          TEXT position 74x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Page 1 of 9"
          TEXT nextLink 41x20 [HUG/HUG] · fill color/brand/primary · desktop/body-medium · "Next ›"
    TEXT scopeNote 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Every posting on the platform, regardless of report status — including content hidden pending review. Sorted newest first."
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 496x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Data entry — work from home · Open · hidden from browse pending review"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Owner: R. Gunasekara (Employer, Individual) · posted 30 Aug 2026 · Retail · 3 reports (fraud or scam ×2, safety concern) — auto-hidden 31 Aug 2026 by the three-report threshold"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Escalated for removal by Shalini Weerasinghe on 31 Aug 2026. Removal stops new applications immediately; engagements already in progress continue."
    INSTANCE Action/Button 171x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
      TEXT label 123x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Remove posting"
  FRAME scrim 1440x900 [FIXED/FIXED] @0,0 · fill color/overlay/scrim · opacity 40%
  INSTANCE Desktop/DashDialog 440x198 [FIXED/HUG] @500,351 · vertical pad 20/24/20/24 gap 12 · fill color/bg/default · r12
    TEXT title 359x26 [HUG/HUG] · fill color/text/primary · desktop/title · "Remove “Data entry — work from home”?"
    TEXT body 392x60 [FIXED/HUG] · fill color/text/secondary · desktop/body · "New applications stop immediately. Engagements already in progress are not voided and continue to completion. The removal is recorded in the audit log under your account."
    FRAME actions 392x48 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Action/Button 101x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 53x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Cancel"
      INSTANCE Action/Button 171x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
        TEXT label 123x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Remove posting"
```

**An M10 screen drawn on this page** so that its Cancel and the click that opens it are same-page links. The
body gives the two consequences that matter: new applications stop at once, and engagements already in
progress are **not** voided (`FR-ADM-05`).

### `11.2adx` — All postings · Admin, removed listing detail

**Reached from** `11.2afwx`  ·  **Leads to** `11.2afx`, `11.2affx`, `11.2afwx`, `11.2afex`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin, Active=All postings} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin} · [standard, see header]
  FRAME content 1200x744 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
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
        FRAME dataRow 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · fill color/bg/subtle · stroke color/border/default mixed
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
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Grade 8 maths tutoring"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Dilrukshi Herath"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Tutoring"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "27 Aug 2026"
        FRAME dataRow 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Office cleaning — Kirulapone"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Kottawa Business Centre"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Cleaning"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Filled}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/brand/primary
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Filled"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "27 Aug 2026"
        FRAME dataRow4 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Event setup crew (3 needed)"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Lanka Events (Pvt) Ltd"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Event setup"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "27 Aug 2026"
        FRAME dataRow05 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Warehouse packing — night shift"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Ceylon Logistics"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Delivery"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Filled}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/brand/primary
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Filled"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "26 Aug 2026"
        FRAME dataRow06 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "House cleaning — Saturday"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "A. Wijeratne"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Cleaning"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "26 Aug 2026"
        FRAME dataRow07 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Shop assistant — weekend"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Saman Stores"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Retail"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Filled}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/brand/primary
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Filled"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "25 Aug 2026"
        FRAME dataRow08 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Delivery rider — mornings"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "FreshCart Maharagama"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Delivery"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "25 Aug 2026"
        FRAME dataRow09 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Café service crew — evenings"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Green Leaf Café"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Food service"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "24 Aug 2026"
        FRAME dataRow10 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Stage crew — Friday setup"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Lanka Events (Pvt) Ltd"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Event setup"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "20 Aug 2026"
      INSTANCE pagination 1152x44 [FILL/FIXED] · horizontal pad 12/16/12/16 gap 0 · fill color/bg/default · stroke color/border/default mixed · of Desktop/Pagination · {Page=First}
        TEXT countText 128x20 [HUG/HUG] · fill color/text/secondary · desktop/body · "Showing 1–10 of 85"
        FRAME pager 131x20 [HUG/HUG] · horizontal pad 0 gap 16
          TEXT position 74x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Page 1 of 9"
          TEXT nextLink 41x20 [HUG/HUG] · fill color/brand/primary · desktop/body-medium · "Next ›"
    TEXT scopeNote 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Every posting on the platform, regardless of report status — including content hidden pending review. Sorted newest first."
    INSTANCE Desktop/SectionCard 1152x100 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 273x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Data entry — work from home · Removed"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Removed 4 Sep 2026 by Kasun Jayawardena · new applications stopped immediately · engagements in progress continue"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "The three reports stay on record against R. Gunasekara; the removal is in the audit log."
```

**After 3:40 PM on Fri 4 Sep.** The listing is *Withdrawn* with *Removed* in the Moderation column, and the
card says what the removal did and did not do. The table's total is still 85 — a removed posting is still a
posting.

### `11.2afx` — All postings · Admin, filtered Open (after removal)

**Reached from** `11.2adx`, `11.2affx`, `11.2afwx`, `11.2afex`  ·  **Leads to** `11.2affx`, `11.2afwx`, `11.2afex`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin, Active=All postings} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin} · [standard, see header]
  FRAME content 1200x634 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    FRAME tableBlock 1152x558 [FILL/HUG] · vertical pad 0 gap 0 · fill color/bg/default · r8
      INSTANCE Desktop/DataTable 1152x514 [FILL/HUG] · vertical pad 0 gap 0 · {Show row 4=true}
        FRAME filterRow 1152x60 [FILL/HUG] · horizontal pad 12/16/12/16 gap 8
          INSTANCE Input/Chip 70x36 [HUG/HUG] · horizontal pad 6/14/6/14 gap 0 · fill color/brand/primary · r999 · {Kind=Select, State=Selected}
            TEXT label 42x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Open"
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
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Grade 8 maths tutoring"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Dilrukshi Herath"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Tutoring"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "27 Aug 2026"
        FRAME dataRow 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "House cleaning — Saturday"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "A. Wijeratne"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Cleaning"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "26 Aug 2026"
        FRAME dataRow 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Delivery rider — mornings"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "FreshCart Maharagama"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Delivery"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "25 Aug 2026"
        FRAME dataRow4 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Café service crew — evenings"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Green Leaf Café"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Food service"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "24 Aug 2026"
        FRAME dataRow05 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Stock count — weekend"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Kandy Road Pharmacy"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Retail"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "22 Aug 2026"
        FRAME dataRow06 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Home tuition — A/L Physics"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "M. Senanayake"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Tutoring"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "21 Aug 2026"
        FRAME dataRow07 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Banquet waiter — weddings"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Galle Face Events"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Food service"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "19 Aug 2026"
        FRAME dataRow08 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Garden clean-up"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "S. Karunaratne"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Cleaning"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "18 Aug 2026"
        FRAME dataRow09 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Parcel sorting — evenings"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "QuickDrop Couriers"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Delivery"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "15 Aug 2026"
        FRAME dataRow10 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "English tutoring — Grade 6"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "R. Dissanayake"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Tutoring"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Open}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/state/success
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Open"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "12 Aug 2026"
      INSTANCE pagination 1152x44 [FILL/FIXED] · horizontal pad 12/16/12/16 gap 0 · fill color/bg/default · stroke color/border/default mixed · of Desktop/Pagination · {Page=First}
        TEXT countText 168x20 [HUG/HUG] · fill color/text/secondary · desktop/body · "Showing 1–10 of 22 Open"
        FRAME pager 132x20 [HUG/HUG] · horizontal pad 0 gap 16
          TEXT position 75x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Page 1 of 3"
          TEXT nextLink 41x20 [HUG/HUG] · fill color/brand/primary · desktop/body-medium · "Next ›"
    TEXT scopeNote 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Every posting on the platform, regardless of report status — including content hidden pending review. Sorted newest first."
```

**22 Open** — one fewer than `11.2af`, because the removal moved *Data entry* from Open to Withdrawn.

### `11.2affx` — All postings · Admin, filtered Filled (after removal)

**Reached from** `11.2adx`, `11.2afx`, `11.2afwx`, `11.2afex`  ·  **Leads to** `11.2afx`, `11.2afwx`, `11.2afex`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin, Active=All postings} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin} · [standard, see header]
  FRAME content 1200x634 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    FRAME tableBlock 1152x558 [FILL/HUG] · vertical pad 0 gap 0 · fill color/bg/default · r8
      INSTANCE Desktop/DataTable 1152x514 [FILL/HUG] · vertical pad 0 gap 0 · {Show row 4=true}
        FRAME filterRow 1152x60 [FILL/HUG] · horizontal pad 12/16/12/16 gap 8
          INSTANCE Input/Chip 64x32 [HUG/HUG] · horizontal pad 6/14/6/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
            TEXT label 36x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Open"
          INSTANCE Input/Chip 69x36 [HUG/HUG] · horizontal pad 6/14/6/14 gap 0 · fill color/brand/primary · r999 · {Kind=Select, State=Selected}
            TEXT label 41x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Filled"
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
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Office cleaning — Kirulapone"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Kottawa Business Centre"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Cleaning"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Filled}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/brand/primary
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Filled"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "27 Aug 2026"
        FRAME dataRow 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Warehouse packing — night shift"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Ceylon Logistics"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Delivery"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Filled}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/brand/primary
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Filled"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "26 Aug 2026"
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
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Sales assistant — Saturday"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Majestic Mobiles"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Retail"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Filled}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/brand/primary
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Filled"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "23 Aug 2026"
        FRAME dataRow05 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Furniture move"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "T. Samarasinghe"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Moving"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Filled}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/brand/primary
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Filled"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "21 Aug 2026"
        FRAME dataRow06 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Kitchen helper — lunch rush"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Spice Route Café"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Food service"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Filled}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/brand/primary
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Filled"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "20 Aug 2026"
        FRAME dataRow07 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Flyer distribution"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Nugegoda Fitness Hub"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Delivery"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Filled}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/brand/primary
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Filled"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "18 Aug 2026"
        FRAME dataRow08 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Maths tutoring — Grade 10"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "H. Peiris"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Tutoring"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Filled}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/brand/primary
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Filled"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "16 Aug 2026"
        FRAME dataRow09 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Stall setup — trade fair"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Colombo Expo Crew"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Event setup"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Filled}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/brand/primary
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Filled"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "14 Aug 2026"
        FRAME dataRow10 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Office deep clean"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Havelock Accounting"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Cleaning"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 59x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Filled}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/brand/primary
              TEXT label 33x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Filled"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "11 Aug 2026"
      INSTANCE pagination 1152x44 [FILL/FIXED] · horizontal pad 12/16/12/16 gap 0 · fill color/bg/default · stroke color/border/default mixed · of Desktop/Pagination · {Page=First}
        TEXT countText 166x20 [HUG/HUG] · fill color/text/secondary · desktop/body · "Showing 1–10 of 41 Filled"
        FRAME pager 131x20 [HUG/HUG] · horizontal pad 0 gap 16
          TEXT position 74x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Page 1 of 5"
          TEXT nextLink 41x20 [HUG/HUG] · fill color/brand/primary · desktop/body-medium · "Next ›"
    TEXT scopeNote 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Every posting on the platform, regardless of report status — including content hidden pending review. Sorted newest first."
```

### `11.2afwx` — All postings · Admin, filtered Withdrawn (after removal)

**Reached from** `11.2adx`, `11.2afx`, `11.2affx`, `11.2afex`  ·  **Leads to** `11.2afx`, `11.2affx`, `11.2afex`, `11.2adx`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin, Active=All postings} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin} · [standard, see header]
  FRAME content 1200x634 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    FRAME tableBlock 1152x558 [FILL/HUG] · vertical pad 0 gap 0 · fill color/bg/default · r8
      INSTANCE Desktop/DataTable 1152x514 [FILL/HUG] · vertical pad 0 gap 0 · {Show row 4=true}
        FRAME filterRow 1152x60 [FILL/HUG] · horizontal pad 12/16/12/16 gap 8
          INSTANCE Input/Chip 64x32 [HUG/HUG] · horizontal pad 6/14/6/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
            TEXT label 36x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Open"
          INSTANCE Input/Chip 64x32 [HUG/HUG] · horizontal pad 6/14/6/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
            TEXT label 36x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Filled"
          INSTANCE Input/Chip 112x36 [HUG/HUG] · horizontal pad 6/14/6/14 gap 0 · fill color/brand/primary · r999 · {Kind=Select, State=Selected}
            TEXT label 84x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Withdrawn"
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
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Cashier — festival week"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Pettah Traders"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Retail"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 93x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Withdrawn}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 67x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Withdrawn"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "24 Aug 2026"
        FRAME dataRow 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Grocery delivery — weekdays"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Green Basket"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Delivery"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 93x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Withdrawn}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 67x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Withdrawn"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "22 Aug 2026"
        FRAME dataRow4 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Tuition assistant"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Sipsala Academy"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Tutoring"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 93x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Withdrawn}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 67x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Withdrawn"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "19 Aug 2026"
        FRAME dataRow05 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Catering server"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Lotus Catering"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Food service"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 93x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Withdrawn}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 67x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Withdrawn"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "16 Aug 2026"
        FRAME dataRow06 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Moving boxes — apartment"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "D. Fernando"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Moving"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 93x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Withdrawn}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 67x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Withdrawn"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "14 Aug 2026"
        FRAME dataRow07 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Event ushers"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Colombo Arts Circle"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Event setup"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 93x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Withdrawn}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 67x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Withdrawn"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "10 Aug 2026"
        FRAME dataRow08 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Shop cleaning"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Wellawatte Textiles"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Cleaning"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 93x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Withdrawn}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 67x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Withdrawn"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "7 Aug 2026"
        FRAME dataRow09 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Inventory helper"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Dehiwala Hardware"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Retail"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 93x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Withdrawn}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 67x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Withdrawn"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "3 Aug 2026"
        FRAME dataRow10 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Office cleaning — weekly"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "A. Wijeratne"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Cleaning"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 93x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Withdrawn}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 67x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Withdrawn"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "30 Jul 2026"
      INSTANCE pagination 1152x44 [FILL/FIXED] · horizontal pad 12/16/12/16 gap 0 · fill color/bg/default · stroke color/border/default mixed · of Desktop/Pagination · {Page=Single}
        TEXT countText 188x20 [HUG/HUG] · fill color/text/secondary · desktop/body · "Showing 10 of 10 Withdrawn"
    TEXT scopeNote 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Every posting on the platform, regardless of report status — including content hidden pending review. Sorted newest first."
```

**10 Withdrawn**, one more than `11.2afw`, with *Data entry* at the top (posted 30 Aug, the newest). Its row
opens `11.2adx`; the other rows are inert on the post-removal frames.

### `11.2afex` — All postings · Admin, filtered Expired (after removal)

**Reached from** `11.2adx`, `11.2afx`, `11.2affx`, `11.2afwx`  ·  **Leads to** `11.2afx`, `11.2affx`, `11.2afwx`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin, Active=All postings} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin} · [standard, see header]
  FRAME content 1200x634 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    FRAME tableBlock 1152x558 [FILL/HUG] · vertical pad 0 gap 0 · fill color/bg/default · r8
      INSTANCE Desktop/DataTable 1152x514 [FILL/HUG] · vertical pad 0 gap 0 · {Show row 4=true}
        FRAME filterRow 1152x60 [FILL/HUG] · horizontal pad 12/16/12/16 gap 8
          INSTANCE Input/Chip 64x32 [HUG/HUG] · horizontal pad 6/14/6/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
            TEXT label 36x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Open"
          INSTANCE Input/Chip 64x32 [HUG/HUG] · horizontal pad 6/14/6/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
            TEXT label 36x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Filled"
          INSTANCE Input/Chip 100x32 [HUG/HUG] · horizontal pad 6/14/6/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
            TEXT label 72x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Withdrawn"
          INSTANCE Input/Chip 86x36 [HUG/HUG] · horizontal pad 6/14/6/14 gap 0 · fill color/brand/primary · r999 · {Kind=Select, State=Selected}
            TEXT label 58x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Expired"
        FRAME headerRow 1152x34 [FILL/HUG] · horizontal pad 8/16/8/16 gap 16 · fill bg/brand-tint
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Title"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Employer"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Category"
          TEXT cell 140x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Status"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Moderation"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Posted ↓"
        FRAME dataRow 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Event setup crew (3 needed)"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Lanka Events (Pvt) Ltd"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Event setup"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "27 Aug 2026"
        FRAME dataRow 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Promoter — shopping mall"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Liberty Retail"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Retail"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "23 Aug 2026"
        FRAME dataRow 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Stage crew — Friday setup"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Lanka Events (Pvt) Ltd"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Event setup"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "20 Aug 2026"
        FRAME dataRow4 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Van loader — house move"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "K. Mendis"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Moving"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "17 Aug 2026"
        FRAME dataRow05 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Tea stall helper — fair"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Maharagama Pola Traders"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Food service"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "13 Aug 2026"
        FRAME dataRow06 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Chair setup — school concert"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Colombo Arts Circle"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Event setup"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "11 Aug 2026"
        FRAME dataRow07 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Event teardown — Sunday"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Lanka Events (Pvt) Ltd"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Event setup"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "9 Aug 2026"
        FRAME dataRow08 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Leaflet drop"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Home Solar Lanka"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Delivery"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "6 Aug 2026"
        FRAME dataRow09 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "House move helpers"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Dilrukshi Herath"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Moving"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "1 Aug 2026"
        FRAME dataRow10 1152x42 [FILL/HUG] · horizontal pad 10/16/10/16 gap 16 · stroke color/border/default mixed
          TEXT cell 300x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Window cleaning"
          TEXT cell 210x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Crescent Apartments"
          TEXT cell 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Cleaning"
          FRAME statusCell 140x22 [FIXED/FIXED]
            INSTANCE Desktop/DashBadge 73x22 [HUG/HUG] @0,0 · horizontal pad 2/8/2/8 gap 5 · fill color/bg/subtle · r999 · {Family=Posting, Value=Expired}
              ELLIPSE dot 5x5 [FIXED/FIXED] · fill color/text/secondary
              TEXT label 47x18 [HUG/HUG] · fill color/text/primary · desktop/table · "Expired"
          TEXT cell 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "—"
          TEXT cell 90x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "28 Jul 2026"
      INSTANCE pagination 1152x44 [FILL/FIXED] · horizontal pad 12/16/12/16 gap 0 · fill color/bg/default · stroke color/border/default mixed · of Desktop/Pagination · {Page=First}
        TEXT countText 180x20 [HUG/HUG] · fill color/text/secondary · desktop/body · "Showing 1–10 of 12 Expired"
        FRAME pager 131x20 [HUG/HUG] · horizontal pad 0 gap 16
          TEXT position 74x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Page 1 of 2"
          TEXT nextLink 41x20 [HUG/HUG] · fill color/brand/primary · desktop/body-medium · "Next ›"
    TEXT scopeNote 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Every posting on the platform, regardless of report status — including content hidden pending review. Sorted newest first."
```

## Users

App accounts only — workers, employers and community verifiers; staff accounts are managed under Staff
(`FR-DASH-02`, `FR-ADM-07`). The list's first page is **alphabetical**, and the search field returns the
searched account. **The Moderator's record shows no NIC and offers no action**; suspension is an Admin
action and is not offered to a Moderator. **Promotion is not on a user record** — it starts from the Staff
page (`FR-ADM-06` as amended).

### `11.3L` — Users · all accounts, Admin

**Reached from** `11.3Ls`  ·  **Leads to** `11.3Ls`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin, Active=Users} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin} · [standard, see header]
  FRAME content 1200x614 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    TEXT searchContext 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "App accounts only — 214 in all: workers, employers and community verifiers. Staff accounts (Moderator, Admin) are managed under Staff. Sorted by name."
    FRAME accountSearch 360x40 [FIXED/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/subtle · r8
      FRAME icon-search 16x16 [FIXED/FIXED]
        ELLIPSE lens 10x10 [FIXED/FIXED] @2,2 · stroke color/text/secondary 1.5
        VECTOR handle 4x4 [FIXED/FIXED] @11,11 · stroke color/text/secondary 1.5
      TEXT searchValue 232x20 [HUG/HUG] · fill color/text/secondary · desktop/body · "Search accounts — name or phone"
    FRAME usersTable 1152x484 [FILL/HUG] · vertical pad 0 gap 0 · fill color/bg/default · r8
      INSTANCE Desktop/TableRow 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill bg/brand-tint · stroke color/border/default mixed · {Kind=Header, Cols=4}
        TEXT colTime 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Account ↑"
        TEXT colActor 250x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Role"
        TEXT colAction 260x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Verification"
        TEXT colTarget 382x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Status"
      INSTANCE userRow01 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · of Desktop/TableRow · {Kind=Row, Cols=4}
        TEXT colTime 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "A. Wijeratne"
        TEXT colActor 250x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Employer (Individual)"
        TEXT colAction 260x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Verified"
        TEXT colTarget 382x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Active"
      INSTANCE userRow02 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · of Desktop/TableRow · {Kind=Row, Cols=4}
        TEXT colTime 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Ceylon Logistics"
        TEXT colActor 250x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Employer (Business)"
        TEXT colAction 260x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Verified"
        TEXT colTarget 382x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Active"
      INSTANCE userRow03 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · of Desktop/TableRow · {Kind=Row, Cols=4}
        TEXT colTime 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Chamara Wickramasinghe"
        TEXT colActor 250x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Worker"
        TEXT colAction 260x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Verified"
        TEXT colTarget 382x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Active"
      INSTANCE userRow04 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · of Desktop/TableRow · {Kind=Row, Cols=4}
        TEXT colTime 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Colombo Arts Circle"
        TEXT colActor 250x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Employer (Business)"
        TEXT colAction 260x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Verified"
        TEXT colTarget 382x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Active"
      INSTANCE userRow05 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · of Desktop/TableRow · {Kind=Row, Cols=4}
        TEXT colTime 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Colombo Expo Crew"
        TEXT colActor 250x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Employer (Business)"
        TEXT colAction 260x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Verified"
        TEXT colTarget 382x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Active"
      INSTANCE userRow06 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · of Desktop/TableRow · {Kind=Row, Cols=4}
        TEXT colTime 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Crescent Apartments"
        TEXT colActor 250x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Employer (Business)"
        TEXT colAction 260x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Verified"
        TEXT colTarget 382x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Active"
      INSTANCE userRow07 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · of Desktop/TableRow · {Kind=Row, Cols=4}
        TEXT colTime 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "D. Fernando"
        TEXT colActor 250x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Employer (Individual)"
        TEXT colAction 260x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Verified"
        TEXT colTarget 382x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Active"
      INSTANCE userRow08 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · of Desktop/TableRow · {Kind=Row, Cols=4}
        TEXT colTime 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Dehiwala Hardware"
        TEXT colActor 250x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Employer (Business)"
        TEXT colAction 260x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Verified"
        TEXT colTarget 382x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Active"
      INSTANCE userRow09 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · of Desktop/TableRow · {Kind=Row, Cols=4}
        TEXT colTime 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Dilrukshi Herath"
        TEXT colActor 250x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Employer (Individual)"
        TEXT colAction 260x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Verified"
        TEXT colTarget 382x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Active"
      INSTANCE userRow10 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · of Desktop/TableRow · {Kind=Row, Cols=4}
        TEXT colTime 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "FreshCart Maharagama"
        TEXT colActor 250x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Employer (Business)"
        TEXT colAction 260x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Verified"
        TEXT colTarget 382x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Active"
      INSTANCE pagination 1152x44 [FILL/FIXED] · horizontal pad 12/16/12/16 gap 0 · fill color/bg/default · stroke color/border/default mixed · of Desktop/Pagination · {Page=First}
        TEXT countText 135x20 [HUG/HUG] · fill color/text/secondary · desktop/body · "Showing 1–10 of 214"
        FRAME pager 140x20 [HUG/HUG] · horizontal pad 0 gap 16
          TEXT position 83x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Page 1 of 22"
          TEXT nextLink 41x20 [HUG/HUG] · fill color/brand/primary · desktop/body-medium · "Next ›"
```

**Truly alphabetical** — the first ten accounts of 214, A to F. The intro says what the list is *not*: staff
accounts live under Staff. The search field opens the result state (`11.3Ls`).

### `11.3Ls` — Users · search results for “Nethmi”, Admin

**Reached from** `11.3L`  ·  **Leads to** `11.3L`, `11.3`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin, Active=Users} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin} · [standard, see header]
  FRAME content 1200x286 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    TEXT searchContext 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Search results for “Nethmi” — 1 account. App accounts only; staff accounts are managed under Staff."
    FRAME accountSearch 360x40 [FIXED/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/subtle · r8
      FRAME icon-search 16x16 [FIXED/FIXED]
        ELLIPSE lens 10x10 [FIXED/FIXED] @2,2 · stroke color/text/secondary 1.5
        VECTOR handle 4x4 [FIXED/FIXED] @11,11 · stroke color/text/secondary 1.5
      TEXT searchValue 48x20 [HUG/HUG] · fill color/text/secondary · desktop/body · "Nethmi"
    TEXT clearLink 78x18 [HUG/HUG] · fill color/text/secondary · desktop/table · "Clear search"
    FRAME usersTable 1152x124 [FILL/HUG] · vertical pad 0 gap 0 · fill color/bg/default · r8
      INSTANCE Desktop/TableRow 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill bg/brand-tint · stroke color/border/default mixed · {Kind=Header, Cols=4}
        TEXT colTime 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Account ↑"
        TEXT colActor 250x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Role"
        TEXT colAction 260x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Verification"
        TEXT colTarget 382x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Status"
      INSTANCE userRow01 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · of Desktop/TableRow · {Kind=Row, Cols=4}
        TEXT colTime 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Nethmi Jayasinghe"
        TEXT colActor 250x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Worker"
        TEXT colAction 260x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Verified"
        TEXT colTarget 382x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Active"
      INSTANCE pagination 1152x44 [FILL/FIXED] · horizontal pad 12/16/12/16 gap 0 · fill color/bg/default · stroke color/border/default mixed · of Desktop/Pagination · {Page=Single}
        TEXT countText 95x20 [HUG/HUG] · fill color/text/secondary · desktop/body · "Showing 1 of 1"
```

Search for *"Nethmi"* → one account. The row opens her record; the field and *Clear search* return to the
list.

### `11.3` — User detail · Admin (Nethmi Jayasinghe)

**Reached from** `11.3Ls`  ·  **Leads to** the sidebar only  ·  **Opens** `10.6n`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin, Active=Users} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin} · [standard, see header]
  FRAME content 1200x540 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    TEXT searchContext 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Nethmi Jayasinghe — opened from Users. Also reachable from a case's parties, a posting's employer, or a name or phone search."
    INSTANCE Desktop/DetailPane 420x324 [FIXED/HUG] · vertical pad 20 gap 10 · fill color/bg/default · r8 · {Role=Admin}
      FRAME nameRow 380x26 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT userName 295x26 [FILL/HUG] · fill color/text/primary · desktop/title · "Nethmi Jayasinghe"
        INSTANCE Display/Badge 77x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
          VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
          TEXT label 44x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Verified"
      FRAME field-Phone 380x20 [FILL/HUG] · horizontal pad 0 gap 12
        TEXT fieldLabel 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Phone"
        TEXT fieldValue 248x20 [FILL/HUG] · fill color/text/primary · desktop/body · "+94 76 234 5678"
      FRAME field-Role 380x20 [FILL/HUG] · horizontal pad 0 gap 12
        TEXT fieldLabel 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Role"
        TEXT fieldValue 248x20 [FILL/HUG] · fill color/text/primary · desktop/body · "Worker"
      FRAME field-NIC 380x20 [FILL/HUG] · horizontal pad 0 gap 12
        TEXT fieldLabel 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "NIC"
        TEXT fieldValue 248x20 [FILL/HUG] · fill color/text/primary · desktop/body · "200156789012"
      FRAME field-Rating 380x20 [FILL/HUG] · horizontal pad 0 gap 12
        TEXT fieldLabel 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Rating"
        TEXT fieldValue 248x20 [FILL/HUG] · fill color/text/primary · desktop/body · "4.6 from 12 ratings · 93% completion"
      FRAME field-Endorsements 380x40 [FILL/HUG] · horizontal pad 0 gap 12
        TEXT fieldLabel 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Endorsements"
        TEXT fieldValue 248x40 [FILL/HUG] · fill color/text/primary · desktop/body · "2 received (K. Rathnayake, M. Perera) · 0 given"
      FRAME field-Case history 380x20 [FILL/HUG] · horizontal pad 0 gap 12
        TEXT fieldLabel 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Case history"
        TEXT fieldValue 248x20 [FILL/HUG] · fill color/text/primary · desktop/body · "2 resolved disputes · 1 warning"
      FRAME actions 182x48 [HUG/HUG] · horizontal pad 0 gap 8
        INSTANCE Action/Button 182x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/state/danger · r8 · {Style=Destructive, State=Default}
          TEXT label 134x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Suspend account"
    INSTANCE Desktop/SectionCard 1152x126 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 463x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Case history — the aggregate-only rule's stated exception (staff only)"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Dispute resolved 12 Jul 2026 — engagement completion contested · outcome: for Nethmi Jayasinghe"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Dispute resolved 3 May 2026 — schedule disagreement · outcome: inconclusive"
      TEXT row3 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Warning 3 May 2026 — late cancellation without notice (Moderator: N. Fernando)"
```

**Nethmi Jayasinghe's record, Admin.** Rating *4.6 from 12 ratings · 93% completion*, endorsed by
K. Rathnayake and M. Perera (M4), two resolved disputes and one warning, and the case-history card that is
the aggregate-only rule's stated exception. **One action, Suspend account** — Promote was removed from user
records (promotion starts from Staff).

### `10.6n` — Suspend account? (dialog) — an M10 screen, drawn here over `11.3`: no grounds to record

**Opens over** `11.3`  ·  **Cancel returns to** `11.3`  ·  **Confirm** → *disabled — see below*

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin, Active=Users} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin} · [standard, see header]
  FRAME content 1200x540 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    TEXT searchContext 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Nethmi Jayasinghe — opened from Users. Also reachable from a case's parties, a posting's employer, or a name or phone search."
    INSTANCE Desktop/DetailPane 420x324 [FIXED/HUG] · vertical pad 20 gap 10 · fill color/bg/default · r8 · {Role=Admin}
      FRAME nameRow 380x26 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT userName 295x26 [FILL/HUG] · fill color/text/primary · desktop/title · "Nethmi Jayasinghe"
        INSTANCE Display/Badge 77x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
          VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
          TEXT label 44x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Verified"
      FRAME field-Phone 380x20 [FILL/HUG] · horizontal pad 0 gap 12
        TEXT fieldLabel 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Phone"
        TEXT fieldValue 248x20 [FILL/HUG] · fill color/text/primary · desktop/body · "+94 76 234 5678"
      FRAME field-Role 380x20 [FILL/HUG] · horizontal pad 0 gap 12
        TEXT fieldLabel 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Role"
        TEXT fieldValue 248x20 [FILL/HUG] · fill color/text/primary · desktop/body · "Worker"
      FRAME field-NIC 380x20 [FILL/HUG] · horizontal pad 0 gap 12
        TEXT fieldLabel 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "NIC"
        TEXT fieldValue 248x20 [FILL/HUG] · fill color/text/primary · desktop/body · "200156789012"
      FRAME field-Rating 380x20 [FILL/HUG] · horizontal pad 0 gap 12
        TEXT fieldLabel 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Rating"
        TEXT fieldValue 248x20 [FILL/HUG] · fill color/text/primary · desktop/body · "4.6 from 12 ratings · 93% completion"
      FRAME field-Endorsements 380x40 [FILL/HUG] · horizontal pad 0 gap 12
        TEXT fieldLabel 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Endorsements"
        TEXT fieldValue 248x40 [FILL/HUG] · fill color/text/primary · desktop/body · "2 received (K. Rathnayake, M. Perera) · 0 given"
      FRAME field-Case history 380x20 [FILL/HUG] · horizontal pad 0 gap 12
        TEXT fieldLabel 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Case history"
        TEXT fieldValue 248x20 [FILL/HUG] · fill color/text/primary · desktop/body · "2 resolved disputes · 1 warning"
      FRAME actions 182x48 [HUG/HUG] · horizontal pad 0 gap 8
        INSTANCE Action/Button 182x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/state/danger · r8 · {Style=Destructive, State=Default}
          TEXT label 134x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Suspend account"
    INSTANCE Desktop/SectionCard 1152x126 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 463x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Case history — the aggregate-only rule's stated exception (staff only)"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Dispute resolved 12 Jul 2026 — engagement completion contested · outcome: for Nethmi Jayasinghe"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Dispute resolved 3 May 2026 — schedule disagreement · outcome: inconclusive"
      TEXT row3 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Warning 3 May 2026 — late cancellation without notice (Moderator: N. Fernando)"
  FRAME scrim 1440x900 [FIXED/FIXED] @0,0 · fill color/overlay/scrim · opacity 40%
  INSTANCE Desktop/DashDialog 440x218 [FIXED/HUG] @500,341 · vertical pad 20/24/20/24 gap 12 · fill color/bg/default · r12
    TEXT title 347x26 [HUG/HUG] · fill color/text/primary · desktop/title · "Suspend Nethmi Jayasinghe's account?"
    TEXT body 392x80 [FIXED/HUG] · fill color/text/secondary · desktop/body · "Suspension is for a policy violation, and it records its grounds. There are none to record here — her one warning (3 May 2026) is closed and both disputes were resolved — so the suspension can't be confirmed."
    FRAME actions 392x48 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Action/Button 101x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 53x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Cancel"
      INSTANCE Action/Button 182x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/subtle · stroke color/border/default 1 · r8 · {Style=Primary, State=Disabled}
        TEXT label 134x24 [HUG/HUG] · fill color/text/secondary · mobile/body-medium · "Suspend account"
```

**The grounds check (FR-ADM-03 as amended).** A suspension records its grounds, and this account has none
to record: the one warning is closed and both disputes were resolved. So `Suspend account` is
`{State=Disabled}` and the body says why. Compare [M10](M10-moderation.md) `10.6`, where R. Gunasekara's
three warnings are the grounds and the button is live.

### `11.3Lm` — Users · all accounts, Moderator

**Reached from** `11.3Lms`  ·  **Leads to** `11.3Lms`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator, Active=Users} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator} · [standard, see header]
  FRAME content 1200x614 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    TEXT searchContext 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "App accounts only — 214 in all: workers, employers and community verifiers. Staff accounts (Moderator, Admin) are managed under Staff. Sorted by name."
    FRAME accountSearch 360x40 [FIXED/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/subtle · r8
      FRAME icon-search 16x16 [FIXED/FIXED]
        ELLIPSE lens 10x10 [FIXED/FIXED] @2,2 · stroke color/text/secondary 1.5
        VECTOR handle 4x4 [FIXED/FIXED] @11,11 · stroke color/text/secondary 1.5
      TEXT searchValue 232x20 [HUG/HUG] · fill color/text/secondary · desktop/body · "Search accounts — name or phone"
    FRAME usersTable 1152x484 [FILL/HUG] · vertical pad 0 gap 0 · fill color/bg/default · r8
      INSTANCE Desktop/TableRow 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill bg/brand-tint · stroke color/border/default mixed · {Kind=Header, Cols=4}
        TEXT colTime 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Account ↑"
        TEXT colActor 250x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Role"
        TEXT colAction 260x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Verification"
        TEXT colTarget 382x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Status"
      INSTANCE userRow01 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · of Desktop/TableRow · {Kind=Row, Cols=4}
        TEXT colTime 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "A. Wijeratne"
        TEXT colActor 250x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Employer (Individual)"
        TEXT colAction 260x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Verified"
        TEXT colTarget 382x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Active"
      INSTANCE userRow02 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · of Desktop/TableRow · {Kind=Row, Cols=4}
        TEXT colTime 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Ceylon Logistics"
        TEXT colActor 250x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Employer (Business)"
        TEXT colAction 260x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Verified"
        TEXT colTarget 382x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Active"
      INSTANCE userRow03 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · of Desktop/TableRow · {Kind=Row, Cols=4}
        TEXT colTime 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Chamara Wickramasinghe"
        TEXT colActor 250x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Worker"
        TEXT colAction 260x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Verified"
        TEXT colTarget 382x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Active"
      INSTANCE userRow04 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · of Desktop/TableRow · {Kind=Row, Cols=4}
        TEXT colTime 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Colombo Arts Circle"
        TEXT colActor 250x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Employer (Business)"
        TEXT colAction 260x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Verified"
        TEXT colTarget 382x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Active"
      INSTANCE userRow05 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · of Desktop/TableRow · {Kind=Row, Cols=4}
        TEXT colTime 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Colombo Expo Crew"
        TEXT colActor 250x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Employer (Business)"
        TEXT colAction 260x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Verified"
        TEXT colTarget 382x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Active"
      INSTANCE userRow06 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · of Desktop/TableRow · {Kind=Row, Cols=4}
        TEXT colTime 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Crescent Apartments"
        TEXT colActor 250x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Employer (Business)"
        TEXT colAction 260x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Verified"
        TEXT colTarget 382x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Active"
      INSTANCE userRow07 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · of Desktop/TableRow · {Kind=Row, Cols=4}
        TEXT colTime 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "D. Fernando"
        TEXT colActor 250x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Employer (Individual)"
        TEXT colAction 260x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Verified"
        TEXT colTarget 382x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Active"
      INSTANCE userRow08 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · of Desktop/TableRow · {Kind=Row, Cols=4}
        TEXT colTime 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Dehiwala Hardware"
        TEXT colActor 250x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Employer (Business)"
        TEXT colAction 260x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Verified"
        TEXT colTarget 382x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Active"
      INSTANCE userRow09 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · of Desktop/TableRow · {Kind=Row, Cols=4}
        TEXT colTime 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Dilrukshi Herath"
        TEXT colActor 250x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Employer (Individual)"
        TEXT colAction 260x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Verified"
        TEXT colTarget 382x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Active"
      INSTANCE userRow10 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · of Desktop/TableRow · {Kind=Row, Cols=4}
        TEXT colTime 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "FreshCart Maharagama"
        TEXT colActor 250x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Employer (Business)"
        TEXT colAction 260x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Verified"
        TEXT colTarget 382x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Active"
      INSTANCE pagination 1152x44 [FILL/FIXED] · horizontal pad 12/16/12/16 gap 0 · fill color/bg/default · stroke color/border/default mixed · of Desktop/Pagination · {Page=First}
        TEXT countText 135x20 [HUG/HUG] · fill color/text/secondary · desktop/body · "Showing 1–10 of 214"
        FRAME pager 140x20 [HUG/HUG] · horizontal pad 0 gap 16
          TEXT position 83x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Page 1 of 22"
          TEXT nextLink 41x20 [HUG/HUG] · fill color/brand/primary · desktop/body-medium · "Next ›"
```

### `11.3Lms` — Users · search results for “Nethmi”, Moderator

**Reached from** `11.3Lm`  ·  **Leads to** `11.3Lm`, `11.3m`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator, Active=Users} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator} · [standard, see header]
  FRAME content 1200x286 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    TEXT searchContext 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Search results for “Nethmi” — 1 account. App accounts only; staff accounts are managed under Staff."
    FRAME accountSearch 360x40 [FIXED/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/subtle · r8
      FRAME icon-search 16x16 [FIXED/FIXED]
        ELLIPSE lens 10x10 [FIXED/FIXED] @2,2 · stroke color/text/secondary 1.5
        VECTOR handle 4x4 [FIXED/FIXED] @11,11 · stroke color/text/secondary 1.5
      TEXT searchValue 48x20 [HUG/HUG] · fill color/text/secondary · desktop/body · "Nethmi"
    TEXT clearLink 78x18 [HUG/HUG] · fill color/text/secondary · desktop/table · "Clear search"
    FRAME usersTable 1152x124 [FILL/HUG] · vertical pad 0 gap 0 · fill color/bg/default · r8
      INSTANCE Desktop/TableRow 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill bg/brand-tint · stroke color/border/default mixed · {Kind=Header, Cols=4}
        TEXT colTime 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Account ↑"
        TEXT colActor 250x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Role"
        TEXT colAction 260x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Verification"
        TEXT colTarget 382x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Status"
      INSTANCE userRow01 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · of Desktop/TableRow · {Kind=Row, Cols=4}
        TEXT colTime 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Nethmi Jayasinghe"
        TEXT colActor 250x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Worker"
        TEXT colAction 260x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Verified"
        TEXT colTarget 382x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Active"
      INSTANCE pagination 1152x44 [FILL/FIXED] · horizontal pad 12/16/12/16 gap 0 · fill color/bg/default · stroke color/border/default mixed · of Desktop/Pagination · {Page=Single}
        TEXT countText 95x20 [HUG/HUG] · fill color/text/secondary · desktop/body · "Showing 1 of 1"
```

### `11.3m` — User detail · Moderator (Nethmi Jayasinghe)

**Reached from** `11.3Lms`  ·  **Leads to** the sidebar only

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator, Active=Users} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator} · [standard, see header]
  FRAME content 1200x498 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    TEXT searchContext 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Nethmi Jayasinghe — opened from Users. Also reachable from a case's parties, a posting's employer, or a name or phone search."
    INSTANCE Desktop/DetailPane 420x282 [FIXED/HUG] · vertical pad 20 gap 10 · fill color/bg/default · r8 · {Role=Moderator}
      FRAME nameRow 380x26 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT userName 295x26 [FILL/HUG] · fill color/text/primary · desktop/title · "Nethmi Jayasinghe"
        INSTANCE Display/Badge 77x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
          VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
          TEXT label 44x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Verified"
      FRAME field-Phone 380x20 [FILL/HUG] · horizontal pad 0 gap 12
        TEXT fieldLabel 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Phone"
        TEXT fieldValue 248x20 [FILL/HUG] · fill color/text/primary · desktop/body · "+94 76 234 5678"
      FRAME field-Role 380x20 [FILL/HUG] · horizontal pad 0 gap 12
        TEXT fieldLabel 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Role"
        TEXT fieldValue 248x20 [FILL/HUG] · fill color/text/primary · desktop/body · "Worker"
      FRAME field-Rating 380x20 [FILL/HUG] · horizontal pad 0 gap 12
        TEXT fieldLabel 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Rating"
        TEXT fieldValue 248x20 [FILL/HUG] · fill color/text/primary · desktop/body · "4.6 from 12 ratings · 93% completion"
      FRAME field-Endorsements 380x40 [FILL/HUG] · horizontal pad 0 gap 12
        TEXT fieldLabel 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Endorsements"
        TEXT fieldValue 248x40 [FILL/HUG] · fill color/text/primary · desktop/body · "2 received (K. Rathnayake, M. Perera) · 0 given"
      FRAME field-Case history 380x20 [FILL/HUG] · horizontal pad 0 gap 12
        TEXT fieldLabel 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Case history"
        TEXT fieldValue 248x20 [FILL/HUG] · fill color/text/primary · desktop/body · "2 resolved disputes · 1 warning"
      TEXT routedNote 262x36 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Suspension is an Admin action — a case reaches it by escalation."
    INSTANCE Desktop/SectionCard 1152x126 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 463x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Case history — the aggregate-only rule's stated exception (staff only)"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Dispute resolved 12 Jul 2026 — engagement completion contested · outcome: for Nethmi Jayasinghe"
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Dispute resolved 3 May 2026 — schedule disagreement · outcome: inconclusive"
      TEXT row3 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Warning 3 May 2026 — late cancellation without notice (Moderator: N. Fernando)"
```

**The Moderator's record: no NIC, no actions.** It uses the `{Role=Moderator}` variant of
`Desktop/DetailPane`, whose `routedNote` reads *"Suspension is an Admin action — a case reaches it by
escalation."*

## Metrics

Operations aggregates only (`FR-DASH-04`, `NFR-PRIV`): no per-user activity figure appears on the screen
or in the export. **11.5 is the source of truth for every platform figure** quoted elsewhere — the pagers'
totals are checked against it.

### `11.5` — Metrics · Admin

**Reached from** the sidebar  ·  **Leads to** `11.5x`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin, Active=Metrics} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin} · [standard, see header]
  FRAME content 1200x472 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    FRAME statRow 1151x116 [HUG/HUG] · horizontal pad 0 gap 21
      INSTANCE Desktop/StatCard 272x116 [FIXED/FIXED] · vertical pad 14/16/14/16 gap 4 · fill color/bg/default · r8
        TEXT statValue 43x32 [HUG/HUG] · fill color/text/primary · desktop/display-number · "214"
        TEXT statLabel 240x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Active users"
        TEXT statSub 240x36 [FIXED/HUG] · fill color/text/secondary · desktop/table · "168 workers · 39 employers · 7 verifiers"
      INSTANCE Desktop/StatCard 272x116 [FIXED/FIXED] · vertical pad 14/16/14/16 gap 4 · fill color/bg/default · r8
        TEXT statValue 31x32 [HUG/HUG] · fill color/text/primary · desktop/display-number · "85"
        TEXT statLabel 240x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Postings"
        TEXT statSub 240x36 [FIXED/HUG] · fill color/text/secondary · desktop/table · "23 open · 41 filled · 9 withdrawn · 12 expired"
      INSTANCE Desktop/StatCard 272x116 [FIXED/FIXED] · vertical pad 14/16/14/16 gap 4 · fill color/bg/default · r8
        TEXT statValue 30x32 [HUG/HUG] · fill color/text/primary · desktop/display-number · "87"
        TEXT statLabel 240x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Completed engagements"
      INSTANCE Desktop/StatCard 272x116 [FIXED/FIXED] · vertical pad 14/16/14/16 gap 4 · fill color/bg/default · r8
        TEXT statValue 16x32 [HUG/HUG] · fill color/text/primary · desktop/display-number · "4"
        TEXT statLabel 240x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Open case queue"
    FRAME statRow 1151x116 [HUG/HUG] · horizontal pad 0 gap 21
      INSTANCE Desktop/StatCard 272x116 [FIXED/FIXED] · vertical pad 14/16/14/16 gap 4 · fill color/bg/default · r8
        TEXT statValue 99x32 [HUG/HUG] · fill color/text/primary · desktop/display-number · "3.2 days"
        TEXT statLabel 240x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Avg dispute resolution"
        TEXT statSub 240x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "resolved cases · target 3–5 days"
      INSTANCE Desktop/StatCard 272x116 [FIXED/FIXED] · vertical pad 14/16/14/16 gap 4 · fill color/bg/default · r8
        TEXT statValue 38x32 [HUG/HUG] · fill color/text/primary · desktop/display-number · "4.3"
        TEXT statLabel 240x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Platform average rating"
      INSTANCE Desktop/StatCard 272x116 [FIXED/FIXED] · vertical pad 14/16/14/16 gap 4 · fill color/bg/default · r8
        TEXT statValue 48x32 [HUG/HUG] · fill color/text/primary · desktop/display-number · "91%"
        TEXT statLabel 240x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Avg completion rate"
      INSTANCE Desktop/StatCard 272x116 [FIXED/FIXED] · vertical pad 14/16/14/16 gap 4 · fill color/bg/default · r8
        TEXT statValue 32x32 [HUG/HUG] · fill color/text/primary · desktop/display-number · "34"
        TEXT statLabel 240x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Endorsements"
        TEXT statSub 240x36 [FIXED/HUG] · fill color/text/secondary · desktop/table · "platform-wide · 11 endorsed workers now rated 4.0 or higher"
    INSTANCE Desktop/SectionCard 1152x74 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 294x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Category breakdown — share of all postings"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Retail — 21%   ·   Event setup — 18%   ·   Tutoring — 16%   ·   all others — 45%"
    INSTANCE Action/Button 137x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
      TEXT label 89x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Export CSV"
    TEXT o4note 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Operations aggregates only — no per-user activity figure appears here or in the export."
```

**Fri 4 Sep, 9:15 AM** — the moment of the export on `11.5x`. The figures are the registry every other screen
is checked against: **214** active users (168 + 39 + 7), **85** postings (23 + 41 + 9 + 12), an open case
queue of **4** (the Admin's queue that morning, `11.4a`). The average dispute resolution sits inside the
3–5 day target (`NFR-OPS-03`).

### `11.5x` — Metrics · Admin, export ready

**Reached from** `11.5`  ·  **Leads to** the sidebar only

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin, Active=Metrics} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin} · [standard, see header]
  FRAME content 1200x472 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    FRAME statRow 1151x116 [HUG/HUG] · horizontal pad 0 gap 21
      INSTANCE Desktop/StatCard 272x116 [FIXED/FIXED] · vertical pad 14/16/14/16 gap 4 · fill color/bg/default · r8
        TEXT statValue 43x32 [HUG/HUG] · fill color/text/primary · desktop/display-number · "214"
        TEXT statLabel 240x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Active users"
        TEXT statSub 240x36 [FIXED/HUG] · fill color/text/secondary · desktop/table · "168 workers · 39 employers · 7 verifiers"
      INSTANCE Desktop/StatCard 272x116 [FIXED/FIXED] · vertical pad 14/16/14/16 gap 4 · fill color/bg/default · r8
        TEXT statValue 31x32 [HUG/HUG] · fill color/text/primary · desktop/display-number · "85"
        TEXT statLabel 240x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Postings"
        TEXT statSub 240x36 [FIXED/HUG] · fill color/text/secondary · desktop/table · "23 open · 41 filled · 9 withdrawn · 12 expired"
      INSTANCE Desktop/StatCard 272x116 [FIXED/FIXED] · vertical pad 14/16/14/16 gap 4 · fill color/bg/default · r8
        TEXT statValue 30x32 [HUG/HUG] · fill color/text/primary · desktop/display-number · "87"
        TEXT statLabel 240x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Completed engagements"
      INSTANCE Desktop/StatCard 272x116 [FIXED/FIXED] · vertical pad 14/16/14/16 gap 4 · fill color/bg/default · r8
        TEXT statValue 16x32 [HUG/HUG] · fill color/text/primary · desktop/display-number · "4"
        TEXT statLabel 240x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Open case queue"
    FRAME statRow 1151x116 [HUG/HUG] · horizontal pad 0 gap 21
      INSTANCE Desktop/StatCard 272x116 [FIXED/FIXED] · vertical pad 14/16/14/16 gap 4 · fill color/bg/default · r8
        TEXT statValue 99x32 [HUG/HUG] · fill color/text/primary · desktop/display-number · "3.2 days"
        TEXT statLabel 240x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Avg dispute resolution"
        TEXT statSub 240x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "resolved cases · target 3–5 days"
      INSTANCE Desktop/StatCard 272x116 [FIXED/FIXED] · vertical pad 14/16/14/16 gap 4 · fill color/bg/default · r8
        TEXT statValue 38x32 [HUG/HUG] · fill color/text/primary · desktop/display-number · "4.3"
        TEXT statLabel 240x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Platform average rating"
      INSTANCE Desktop/StatCard 272x116 [FIXED/FIXED] · vertical pad 14/16/14/16 gap 4 · fill color/bg/default · r8
        TEXT statValue 48x32 [HUG/HUG] · fill color/text/primary · desktop/display-number · "91%"
        TEXT statLabel 240x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Avg completion rate"
      INSTANCE Desktop/StatCard 272x116 [FIXED/FIXED] · vertical pad 14/16/14/16 gap 4 · fill color/bg/default · r8
        TEXT statValue 32x32 [HUG/HUG] · fill color/text/primary · desktop/display-number · "34"
        TEXT statLabel 240x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Endorsements"
        TEXT statSub 240x36 [FIXED/HUG] · fill color/text/secondary · desktop/table · "platform-wide · 11 endorsed workers now rated 4.0 or higher"
    INSTANCE Desktop/SectionCard 1152x74 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 294x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Category breakdown — share of all postings"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Retail — 21%   ·   Event setup — 18%   ·   Tutoring — 16%   ·   all others — 45%"
    INSTANCE Action/Button 118x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/border/default 1.5 · r8 · {Style=Secondary, State=Disabled}
      TEXT label 70x24 [HUG/HUG] · fill color/text/secondary · mobile/body-medium · "Exported"
    TEXT o4note 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Export ready — youthlink-metrics-2026-09-04.csv · operations aggregates only, no per-user rows, matching the figures above."
```

`Exported` is `{State=Disabled}` and the note names the file — `youthlink-metrics-2026-09-04.csv` — and
repeats the aggregate-only promise.

### `11.5m` — Metrics · Moderator

**Reached from** the sidebar  ·  **Leads to** `11.5xm`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator, Active=Metrics} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator} · [standard, see header]
  FRAME content 1200x472 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    FRAME statRow 1151x116 [HUG/HUG] · horizontal pad 0 gap 21
      INSTANCE Desktop/StatCard 272x116 [FIXED/FIXED] · vertical pad 14/16/14/16 gap 4 · fill color/bg/default · r8
        TEXT statValue 43x32 [HUG/HUG] · fill color/text/primary · desktop/display-number · "214"
        TEXT statLabel 240x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Active users"
        TEXT statSub 240x36 [FIXED/HUG] · fill color/text/secondary · desktop/table · "168 workers · 39 employers · 7 verifiers"
      INSTANCE Desktop/StatCard 272x116 [FIXED/FIXED] · vertical pad 14/16/14/16 gap 4 · fill color/bg/default · r8
        TEXT statValue 31x32 [HUG/HUG] · fill color/text/primary · desktop/display-number · "85"
        TEXT statLabel 240x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Postings"
        TEXT statSub 240x36 [FIXED/HUG] · fill color/text/secondary · desktop/table · "23 open · 41 filled · 9 withdrawn · 12 expired"
      INSTANCE Desktop/StatCard 272x116 [FIXED/FIXED] · vertical pad 14/16/14/16 gap 4 · fill color/bg/default · r8
        TEXT statValue 30x32 [HUG/HUG] · fill color/text/primary · desktop/display-number · "87"
        TEXT statLabel 240x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Completed engagements"
      INSTANCE Desktop/StatCard 272x116 [FIXED/FIXED] · vertical pad 14/16/14/16 gap 4 · fill color/bg/default · r8
        TEXT statValue 16x32 [HUG/HUG] · fill color/text/primary · desktop/display-number · "4"
        TEXT statLabel 240x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Open case queue"
    FRAME statRow 1151x116 [HUG/HUG] · horizontal pad 0 gap 21
      INSTANCE Desktop/StatCard 272x116 [FIXED/FIXED] · vertical pad 14/16/14/16 gap 4 · fill color/bg/default · r8
        TEXT statValue 99x32 [HUG/HUG] · fill color/text/primary · desktop/display-number · "3.2 days"
        TEXT statLabel 240x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Avg dispute resolution"
        TEXT statSub 240x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "resolved cases · target 3–5 days"
      INSTANCE Desktop/StatCard 272x116 [FIXED/FIXED] · vertical pad 14/16/14/16 gap 4 · fill color/bg/default · r8
        TEXT statValue 38x32 [HUG/HUG] · fill color/text/primary · desktop/display-number · "4.3"
        TEXT statLabel 240x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Platform average rating"
      INSTANCE Desktop/StatCard 272x116 [FIXED/FIXED] · vertical pad 14/16/14/16 gap 4 · fill color/bg/default · r8
        TEXT statValue 48x32 [HUG/HUG] · fill color/text/primary · desktop/display-number · "91%"
        TEXT statLabel 240x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Avg completion rate"
      INSTANCE Desktop/StatCard 272x116 [FIXED/FIXED] · vertical pad 14/16/14/16 gap 4 · fill color/bg/default · r8
        TEXT statValue 32x32 [HUG/HUG] · fill color/text/primary · desktop/display-number · "34"
        TEXT statLabel 240x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Endorsements"
        TEXT statSub 240x36 [FIXED/HUG] · fill color/text/secondary · desktop/table · "platform-wide · 11 endorsed workers now rated 4.0 or higher"
    INSTANCE Desktop/SectionCard 1152x74 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 294x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Category breakdown — share of all postings"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Retail — 21%   ·   Event setup — 18%   ·   Tutoring — 16%   ·   all others — 45%"
    INSTANCE Action/Button 137x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
      TEXT label 89x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Export CSV"
    TEXT o4note 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Operations aggregates only — no per-user activity figure appears here or in the export."
```

The Moderator sees the same figures. The metrics are operations aggregates, which both roles may read.

### `11.5xm` — Metrics · Moderator, export ready

**Reached from** `11.5m`  ·  **Leads to** the sidebar only

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator, Active=Metrics} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Moderator} · [standard, see header]
  FRAME content 1200x472 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    FRAME statRow 1151x116 [HUG/HUG] · horizontal pad 0 gap 21
      INSTANCE Desktop/StatCard 272x116 [FIXED/FIXED] · vertical pad 14/16/14/16 gap 4 · fill color/bg/default · r8
        TEXT statValue 43x32 [HUG/HUG] · fill color/text/primary · desktop/display-number · "214"
        TEXT statLabel 240x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Active users"
        TEXT statSub 240x36 [FIXED/HUG] · fill color/text/secondary · desktop/table · "168 workers · 39 employers · 7 verifiers"
      INSTANCE Desktop/StatCard 272x116 [FIXED/FIXED] · vertical pad 14/16/14/16 gap 4 · fill color/bg/default · r8
        TEXT statValue 31x32 [HUG/HUG] · fill color/text/primary · desktop/display-number · "85"
        TEXT statLabel 240x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Postings"
        TEXT statSub 240x36 [FIXED/HUG] · fill color/text/secondary · desktop/table · "23 open · 41 filled · 9 withdrawn · 12 expired"
      INSTANCE Desktop/StatCard 272x116 [FIXED/FIXED] · vertical pad 14/16/14/16 gap 4 · fill color/bg/default · r8
        TEXT statValue 30x32 [HUG/HUG] · fill color/text/primary · desktop/display-number · "87"
        TEXT statLabel 240x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Completed engagements"
      INSTANCE Desktop/StatCard 272x116 [FIXED/FIXED] · vertical pad 14/16/14/16 gap 4 · fill color/bg/default · r8
        TEXT statValue 16x32 [HUG/HUG] · fill color/text/primary · desktop/display-number · "4"
        TEXT statLabel 240x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Open case queue"
    FRAME statRow 1151x116 [HUG/HUG] · horizontal pad 0 gap 21
      INSTANCE Desktop/StatCard 272x116 [FIXED/FIXED] · vertical pad 14/16/14/16 gap 4 · fill color/bg/default · r8
        TEXT statValue 99x32 [HUG/HUG] · fill color/text/primary · desktop/display-number · "3.2 days"
        TEXT statLabel 240x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Avg dispute resolution"
        TEXT statSub 240x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "resolved cases · target 3–5 days"
      INSTANCE Desktop/StatCard 272x116 [FIXED/FIXED] · vertical pad 14/16/14/16 gap 4 · fill color/bg/default · r8
        TEXT statValue 38x32 [HUG/HUG] · fill color/text/primary · desktop/display-number · "4.3"
        TEXT statLabel 240x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Platform average rating"
      INSTANCE Desktop/StatCard 272x116 [FIXED/FIXED] · vertical pad 14/16/14/16 gap 4 · fill color/bg/default · r8
        TEXT statValue 48x32 [HUG/HUG] · fill color/text/primary · desktop/display-number · "91%"
        TEXT statLabel 240x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Avg completion rate"
      INSTANCE Desktop/StatCard 272x116 [FIXED/FIXED] · vertical pad 14/16/14/16 gap 4 · fill color/bg/default · r8
        TEXT statValue 32x32 [HUG/HUG] · fill color/text/primary · desktop/display-number · "34"
        TEXT statLabel 240x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Endorsements"
        TEXT statSub 240x36 [FIXED/HUG] · fill color/text/secondary · desktop/table · "platform-wide · 11 endorsed workers now rated 4.0 or higher"
    INSTANCE Desktop/SectionCard 1152x74 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 294x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Category breakdown — share of all postings"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Retail — 21%   ·   Event setup — 18%   ·   Tutoring — 16%   ·   all others — 45%"
    INSTANCE Action/Button 118x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/border/default 1.5 · r8 · {Style=Secondary, State=Disabled}
      TEXT label 70x24 [HUG/HUG] · fill color/text/secondary · mobile/body-medium · "Exported"
    TEXT o4note 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Export ready — youthlink-metrics-2026-09-04.csv · operations aggregates only, no per-user rows, matching the figures above."
```

## Audit log

Every Admin and Moderator action, visible to every Admin (`NFR-SEC-06`, `NFR-OPS-01`). **Not offered
to a Moderator**: the Moderator's navigation has no Audit log item, and a request from a Moderator account
is rejected (amended 2026-09-24).

### `11.6` — Audit log · Admin

**Reached from** the sidebar  ·  **Leads to** the sidebar only

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin, Active=Audit log} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin} · [standard, see header]
  FRAME content 1200x760 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    FRAME auditTable 1152x684 [HUG/HUG] · vertical pad 0 gap 0 · fill color/bg/default · r8
      INSTANCE Desktop/TableRow 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill bg/brand-tint · stroke color/border/default mixed · {Kind=Header, Cols=4}
        TEXT colTime 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Time ↓"
        TEXT colActor 250x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Staff account"
        TEXT colAction 260x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Action"
        TEXT colTarget 382x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Target"
      INSTANCE Desktop/TableRow 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Kind=Row, Cols=4}
        TEXT colTime 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "4 Sep 2026, 3:40 PM"
        TEXT colActor 250x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Kasun Jayawardena · Admin"
        TEXT colAction 260x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Removed posting"
        TEXT colTarget 382x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "“Data entry — work from home”"
      INSTANCE Desktop/TableRow 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Kind=Row, Cols=4}
        TEXT colTime 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "4 Sep 2026, 3:38 PM"
        TEXT colActor 250x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Kasun Jayawardena · Admin"
        TEXT colAction 260x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Suspended account"
        TEXT colTarget 382x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "R. Gunasekara"
      INSTANCE Desktop/TableRow 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Kind=Row, Cols=4}
        TEXT colTime 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "4 Sep 2026, 11:10 AM"
        TEXT colActor 250x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Shalini Weerasinghe · Moderator"
        TEXT colAction 260x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Requested clarification"
        TEXT colTarget 382x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Tharindu Silva vs Ceylon Logistics"
      INSTANCE Desktop/TableRow 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Kind=Row, Cols=4}
        TEXT colTime 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "4 Sep 2026, 11:05 AM"
        TEXT colActor 250x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Kasun Jayawardena · Admin"
        TEXT colAction 260x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Ruled dispute — for the raiser"
        TEXT colTarget 382x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Kavindu Perera vs Saman Stores"
      INSTANCE Desktop/TableRow 1152x40 [FILL/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Kind=Row, Cols=4}
        TEXT colTime 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "4 Sep 2026, 9:42 AM"
        TEXT colActor 250x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Kasun Jayawardena · Admin"
        TEXT colAction 260x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Removed staff access"
        TEXT colTarget 382x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "N. Fernando"
      INSTANCE Desktop/TableRow 1152x40 [FILL/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Kind=Row, Cols=4}
        TEXT colTime 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "4 Sep 2026, 9:40 AM"
        TEXT colActor 250x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Kasun Jayawardena · Admin"
        TEXT colAction 260x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Reset staff password"
        TEXT colTarget 382x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "N. Fernando"
      INSTANCE auditExtra01 1152x40 [FILL/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · of Desktop/TableRow · {Kind=Row, Cols=4}
        TEXT colTime 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "4 Sep 2026, 9:15 AM"
        TEXT colActor 250x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Kasun Jayawardena · Admin"
        TEXT colAction 260x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Exported metrics CSV"
        TEXT colTarget 382x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Platform metrics"
      INSTANCE auditExtra02 1152x40 [FILL/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · of Desktop/TableRow · {Kind=Row, Cols=4}
        TEXT colTime 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "3 Sep 2026, 4:10 PM"
        TEXT colActor 250x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Shalini Weerasinghe · Moderator"
        TEXT colAction 260x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Recorded warning (third)"
        TEXT colTarget 382x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "R. Gunasekara"
      INSTANCE auditExtra03 1152x40 [FILL/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · of Desktop/TableRow · {Kind=Row, Cols=4}
        TEXT colTime 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "2 Sep 2026, 5:30 PM"
        TEXT colActor 250x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Shalini Weerasinghe · Moderator"
        TEXT colAction 260x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Escalated case to Admin"
        TEXT colTarget 382x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Kavindu Perera vs Saman Stores"
      INSTANCE auditExtra04 1152x40 [FILL/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · of Desktop/TableRow · {Kind=Row, Cols=4}
        TEXT colTime 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "2 Sep 2026, 2:55 PM"
        TEXT colActor 250x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Shalini Weerasinghe · Moderator"
        TEXT colAction 260x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Requested clarification"
        TEXT colTarget 382x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Kavindu Perera vs Saman Stores"
      INSTANCE auditExtra05 1152x40 [FILL/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · of Desktop/TableRow · {Kind=Row, Cols=4}
        TEXT colTime 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "1 Sep 2026, 10:20 AM"
        TEXT colActor 250x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Shalini Weerasinghe · Moderator"
        TEXT colAction 260x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Opened case review"
        TEXT colTarget 382x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Kavindu Perera vs Saman Stores"
      INSTANCE auditExtra06 1152x40 [FILL/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · of Desktop/TableRow · {Kind=Row, Cols=4}
        TEXT colTime 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "31 Aug 2026, 2:55 PM"
        TEXT colActor 250x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Shalini Weerasinghe · Moderator"
        TEXT colAction 260x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Escalated for removal"
        TEXT colTarget 382x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "“Data entry — work from home”"
      INSTANCE auditExtra07 1152x40 [FILL/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · of Desktop/TableRow · {Kind=Row, Cols=4}
        TEXT colTime 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "30 Aug 2026, 11:00 AM"
        TEXT colActor 250x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Shalini Weerasinghe · Moderator"
        TEXT colAction 260x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Opened case review"
        TEXT colTarget 382x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Tharindu Silva vs Ceylon Logistics"
      INSTANCE auditExtra08 1152x40 [FILL/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · of Desktop/TableRow · {Kind=Row, Cols=4}
        TEXT colTime 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "29 Aug 2026, 10:15 AM"
        TEXT colActor 250x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Kasun Jayawardena · Admin"
        TEXT colAction 260x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Promoted account to Moderator"
        TEXT colTarget 382x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "T. Abeysekera"
      INSTANCE auditExtra09 1152x40 [FILL/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · of Desktop/TableRow · {Kind=Row, Cols=4}
        TEXT colTime 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "28 Aug 2026, 6:05 PM"
        TEXT colActor 250x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Shalini Weerasinghe · Moderator"
        TEXT colAction 260x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Recorded warning (second)"
        TEXT colTarget 382x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "R. Gunasekara"
      INSTANCE pagination 1152x44 [FILL/FIXED] · horizontal pad 12/16/12/16 gap 0 · fill color/bg/default · stroke color/border/default mixed · of Desktop/Pagination · {Page=First}
        TEXT countText 128x20 [HUG/HUG] · fill color/text/secondary · desktop/body · "Showing 1–15 of 58"
        FRAME pager 132x20 [HUG/HUG] · horizontal pad 0 gap 16
          TEXT position 75x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Page 1 of 4"
          TEXT nextLink 41x20 [HUG/HUG] · fill color/brand/primary · desktop/body-medium · "Next ›"
    TEXT accountability 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Internal accountability, not personal record-keeping. Moderators cannot open this surface. Sorted most recent first."
```

**The end of Fri 4 Sep**, most recent first: the 3:40 PM removal and the 3:38 PM suspension, the payment
clarification (11:10 AM) and the ruling (11:05 AM), the staff reset and removal of access, the export, and back
through the week to T. Abeysekera's promotion on 29 Aug. *"Showing 1–15 of 58"*, page 1 of 4.

### `11.6rec` — Audit log · Admin, account-recovery entry

**Reached from** `11.8rec3`  ·  **Leads to** the sidebar only

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin, Active=Audit log} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin} · [standard, see header]
  FRAME content 1200x760 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    FRAME auditTable 1152x684 [HUG/HUG] · vertical pad 0 gap 0 · fill color/bg/default · r8
      INSTANCE Desktop/TableRow 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill bg/brand-tint · stroke color/border/default mixed · {Kind=Header, Cols=4}
        TEXT colTime 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Time ↓"
        TEXT colActor 250x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Staff account"
        TEXT colAction 260x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Action"
        TEXT colTarget 382x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Target"
      INSTANCE Desktop/TableRow 1152x40 [FILL/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Kind=Row, Cols=4}
        TEXT colTime 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "5 Sep 2026, 10:15 AM"
        TEXT colActor 250x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Kasun Jayawardena · Admin"
        TEXT colAction 260x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Approved account recovery"
        TEXT colTarget 382x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Nethmi Jayasinghe"
      INSTANCE Desktop/TableRow 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Kind=Row, Cols=4}
        TEXT colTime 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "4 Sep 2026, 3:40 PM"
        TEXT colActor 250x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Kasun Jayawardena · Admin"
        TEXT colAction 260x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Removed posting"
        TEXT colTarget 382x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "“Data entry — work from home”"
      INSTANCE Desktop/TableRow 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Kind=Row, Cols=4}
        TEXT colTime 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "4 Sep 2026, 3:38 PM"
        TEXT colActor 250x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Kasun Jayawardena · Admin"
        TEXT colAction 260x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Suspended account"
        TEXT colTarget 382x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "R. Gunasekara"
      INSTANCE Desktop/TableRow 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Kind=Row, Cols=4}
        TEXT colTime 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "4 Sep 2026, 11:10 AM"
        TEXT colActor 250x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Shalini Weerasinghe · Moderator"
        TEXT colAction 260x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Requested clarification"
        TEXT colTarget 382x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Tharindu Silva vs Ceylon Logistics"
      INSTANCE Desktop/TableRow 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Kind=Row, Cols=4}
        TEXT colTime 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "4 Sep 2026, 11:05 AM"
        TEXT colActor 250x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Kasun Jayawardena · Admin"
        TEXT colAction 260x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Ruled dispute — for the raiser"
        TEXT colTarget 382x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Kavindu Perera vs Saman Stores"
      INSTANCE Desktop/TableRow 1152x40 [FILL/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Kind=Row, Cols=4}
        TEXT colTime 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "4 Sep 2026, 9:42 AM"
        TEXT colActor 250x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Kasun Jayawardena · Admin"
        TEXT colAction 260x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Removed staff access"
        TEXT colTarget 382x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "N. Fernando"
      INSTANCE Desktop/TableRow 1152x40 [FILL/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Kind=Row, Cols=4}
        TEXT colTime 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "4 Sep 2026, 9:40 AM"
        TEXT colActor 250x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Kasun Jayawardena · Admin"
        TEXT colAction 260x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Reset staff password"
        TEXT colTarget 382x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "N. Fernando"
      INSTANCE auditExtra01 1152x40 [FILL/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · of Desktop/TableRow · {Kind=Row, Cols=4}
        TEXT colTime 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "4 Sep 2026, 9:15 AM"
        TEXT colActor 250x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Kasun Jayawardena · Admin"
        TEXT colAction 260x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Exported metrics CSV"
        TEXT colTarget 382x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Platform metrics"
      INSTANCE auditExtra02 1152x40 [FILL/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · of Desktop/TableRow · {Kind=Row, Cols=4}
        TEXT colTime 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "3 Sep 2026, 4:10 PM"
        TEXT colActor 250x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Shalini Weerasinghe · Moderator"
        TEXT colAction 260x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Recorded warning (third)"
        TEXT colTarget 382x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "R. Gunasekara"
      INSTANCE auditExtra03 1152x40 [FILL/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · of Desktop/TableRow · {Kind=Row, Cols=4}
        TEXT colTime 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "2 Sep 2026, 5:30 PM"
        TEXT colActor 250x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Shalini Weerasinghe · Moderator"
        TEXT colAction 260x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Escalated case to Admin"
        TEXT colTarget 382x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Kavindu Perera vs Saman Stores"
      INSTANCE auditExtra04 1152x40 [FILL/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · of Desktop/TableRow · {Kind=Row, Cols=4}
        TEXT colTime 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "2 Sep 2026, 2:55 PM"
        TEXT colActor 250x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Shalini Weerasinghe · Moderator"
        TEXT colAction 260x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Requested clarification"
        TEXT colTarget 382x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Kavindu Perera vs Saman Stores"
      INSTANCE auditExtra05 1152x40 [FILL/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · of Desktop/TableRow · {Kind=Row, Cols=4}
        TEXT colTime 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "1 Sep 2026, 10:20 AM"
        TEXT colActor 250x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Shalini Weerasinghe · Moderator"
        TEXT colAction 260x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Opened case review"
        TEXT colTarget 382x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Kavindu Perera vs Saman Stores"
      INSTANCE auditExtra06 1152x40 [FILL/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · of Desktop/TableRow · {Kind=Row, Cols=4}
        TEXT colTime 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "31 Aug 2026, 2:55 PM"
        TEXT colActor 250x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Shalini Weerasinghe · Moderator"
        TEXT colAction 260x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Escalated for removal"
        TEXT colTarget 382x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "“Data entry — work from home”"
      INSTANCE auditExtra07 1152x40 [FILL/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · of Desktop/TableRow · {Kind=Row, Cols=4}
        TEXT colTime 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "30 Aug 2026, 11:00 AM"
        TEXT colActor 250x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Shalini Weerasinghe · Moderator"
        TEXT colAction 260x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Opened case review"
        TEXT colTarget 382x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Tharindu Silva vs Ceylon Logistics"
      INSTANCE auditExtra08 1152x40 [FILL/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · of Desktop/TableRow · {Kind=Row, Cols=4}
        TEXT colTime 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "29 Aug 2026, 10:15 AM"
        TEXT colActor 250x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Kasun Jayawardena · Admin"
        TEXT colAction 260x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Promoted account to Moderator"
        TEXT colTarget 382x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "T. Abeysekera"
      INSTANCE pagination 1152x44 [FILL/FIXED] · horizontal pad 12/16/12/16 gap 0 · fill color/bg/default · stroke color/border/default mixed · of Desktop/Pagination · {Page=First}
        TEXT countText 128x20 [HUG/HUG] · fill color/text/secondary · desktop/body · "Showing 1–15 of 59"
        FRAME pager 132x20 [HUG/HUG] · horizontal pad 0 gap 16
          TEXT position 75x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Page 1 of 4"
          TEXT nextLink 41x20 [HUG/HUG] · fill color/brand/primary · desktop/body-medium · "Next ›"
    TEXT accountability 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Internal accountability, not personal record-keeping. Moderators cannot open this surface. Sorted most recent first."
```

**Sat 5 Sep, 10:15 AM.** One new row at the top — *Approved account recovery · Nethmi Jayasinghe* — and the
total is 59.

## Staff accounts

Admin-only (`FR-ADM-06`, `FR-ADM-07`, openings O5/O6). Lists each staff account with its role, staff phone,
who promoted it and when, and its **sign-in state**. Two actions — reset password, remove staff access —
and the one entry point for promotion, *Promote user*, which opens [M10](M10-moderation.md) `10.8` (a
cross-page link, so it lives in the demo).

### `11.7` — Staff accounts · Admin

**Reached from** the sidebar  ·  **Leads to** the sidebar only  ·  **Opens** `11.7d`, `11.7r`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin, Active=Staff} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin} · [standard, see header]
  FRAME content 1200x550 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    FRAME auditTable 1152x244 [HUG/HUG] · vertical pad 0 gap 0 · fill color/bg/default · r8
      INSTANCE Desktop/TableRow 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill bg/brand-tint · stroke color/border/default mixed · {Kind=Header, Cols=5}
        TEXT colTime 190x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Staff account"
        TEXT colActor 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Role"
        TEXT colExtra 170x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Status"
        TEXT colAction 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Staff phone"
        TEXT colTarget 396x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Promoted ↓"
      INSTANCE Desktop/TableRow 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Kind=Row, Cols=5}
        TEXT colTime 190x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "T. Abeysekera"
        TEXT colActor 120x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Moderator"
        TEXT colExtra 170x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Active"
        TEXT colAction 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "+94 71 234 5678"
        TEXT colTarget 396x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "29 Aug 2026 by Kasun Jayawardena"
      INSTANCE Desktop/TableRow 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Kind=Row, Cols=5}
        TEXT colTime 190x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Shalini Weerasinghe"
        TEXT colActor 120x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Moderator"
        TEXT colExtra 170x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Active"
        TEXT colAction 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "+94 71 555 0100"
        TEXT colTarget 396x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "12 Jul 2026 by Kasun Jayawardena"
      INSTANCE Desktop/TableRow 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/subtle · stroke color/border/default mixed · {Kind=Row, Cols=5}
        TEXT colTime 190x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "N. Fernando"
        TEXT colActor 120x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Moderator"
        TEXT colExtra 170x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Inactive — 41 days"
        TEXT colAction 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "+94 71 555 0300"
        TEXT colTarget 396x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "2 May 2026 by Kasun Jayawardena"
      INSTANCE Desktop/TableRow 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Kind=Row, Cols=5}
        TEXT colTime 190x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Kasun Jayawardena"
        TEXT colActor 120x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Admin"
        TEXT colExtra 170x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Active"
        TEXT colAction 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "+94 71 555 0200"
        TEXT colTarget 396x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Founding account — set up on the backend"
      INSTANCE pagination 1152x44 [FILL/FIXED] · horizontal pad 12/16/12/16 gap 0 · fill color/bg/default · stroke color/border/default mixed · of Desktop/Pagination · {Page=Single}
        TEXT countText 199x20 [HUG/HUG] · fill color/text/secondary · desktop/body · "Showing 4 of 4 staff accounts"
    TEXT accountability 1120x54 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Staff accounts are separate from consumer accounts: a promoted person keeps their app account, which stays under Users, and gets a separate staff account here. Promotion creates a staff account; changing its role is done on the backend. Status is the sign-in state of the staff account, separate from its role. Sorted by promotion date, most recent first; the founding account last."
    INSTANCE Desktop/SectionCard 1152x118 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 228x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Selected: N. Fernando · Moderator"
      TEXT row1 1120x36 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Reset password — texts a one-time code to their staff phone; they set a new dashboard password at next sign-in, the same way a first sign-in works. Their current password stops working immediately."
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Remove staff access — deactivates the staff account; their consumer account, if any, is untouched. Case history and audit entries stay."
    FRAME staffActions 553x48 [HUG/HUG] · horizontal pad 0 gap 12
      INSTANCE Action/Button 171x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 123x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Reset password"
      INSTANCE Action/Button 207x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 159x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Remove staff access"
      INSTANCE Action/Button 151x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
        TEXT label 103x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Promote user"
```

**Sorted by promotion date, most recent first; the founding account last.** N. Fernando's row is the
selected one (highlighted), and the card beneath it explains both actions before either is taken.
*Promote user* is the only way into promotion.

### `11.7r` — Staff accounts · reset password? (dialog)

**Opens over** `11.7`  ·  **Cancel returns to** `11.7`  ·  **Confirm** → `11.7rs`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin, Active=Staff} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin} · [standard, see header]
  FRAME content 1200x550 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    FRAME auditTable 1152x244 [HUG/HUG] · vertical pad 0 gap 0 · fill color/bg/default · r8
      INSTANCE Desktop/TableRow 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill bg/brand-tint · stroke color/border/default mixed · {Kind=Header, Cols=5}
        TEXT colTime 190x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Staff account"
        TEXT colActor 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Role"
        TEXT colExtra 170x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Status"
        TEXT colAction 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Staff phone"
        TEXT colTarget 396x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Promoted ↓"
      INSTANCE Desktop/TableRow 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Kind=Row, Cols=5}
        TEXT colTime 190x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "T. Abeysekera"
        TEXT colActor 120x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Moderator"
        TEXT colExtra 170x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Active"
        TEXT colAction 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "+94 71 234 5678"
        TEXT colTarget 396x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "29 Aug 2026 by Kasun Jayawardena"
      INSTANCE Desktop/TableRow 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Kind=Row, Cols=5}
        TEXT colTime 190x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Shalini Weerasinghe"
        TEXT colActor 120x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Moderator"
        TEXT colExtra 170x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Active"
        TEXT colAction 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "+94 71 555 0100"
        TEXT colTarget 396x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "12 Jul 2026 by Kasun Jayawardena"
      INSTANCE Desktop/TableRow 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/subtle · stroke color/border/default mixed · {Kind=Row, Cols=5}
        TEXT colTime 190x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "N. Fernando"
        TEXT colActor 120x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Moderator"
        TEXT colExtra 170x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Inactive — 41 days"
        TEXT colAction 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "+94 71 555 0300"
        TEXT colTarget 396x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "2 May 2026 by Kasun Jayawardena"
      INSTANCE Desktop/TableRow 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Kind=Row, Cols=5}
        TEXT colTime 190x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Kasun Jayawardena"
        TEXT colActor 120x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Admin"
        TEXT colExtra 170x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Active"
        TEXT colAction 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "+94 71 555 0200"
        TEXT colTarget 396x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Founding account — set up on the backend"
      INSTANCE pagination 1152x44 [FILL/FIXED] · horizontal pad 12/16/12/16 gap 0 · fill color/bg/default · stroke color/border/default mixed · of Desktop/Pagination · {Page=Single}
        TEXT countText 199x20 [HUG/HUG] · fill color/text/secondary · desktop/body · "Showing 4 of 4 staff accounts"
    TEXT accountability 1120x54 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Staff accounts are separate from consumer accounts: a promoted person keeps their app account, which stays under Users, and gets a separate staff account here. Promotion creates a staff account; changing its role is done on the backend. Status is the sign-in state of the staff account, separate from its role. Sorted by promotion date, most recent first; the founding account last."
    INSTANCE Desktop/SectionCard 1152x118 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 228x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Selected: N. Fernando · Moderator"
      TEXT row1 1120x36 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Reset password — texts a one-time code to their staff phone; they set a new dashboard password at next sign-in, the same way a first sign-in works. Their current password stops working immediately."
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Remove staff access — deactivates the staff account; their consumer account, if any, is untouched. Case history and audit entries stay."
    FRAME staffActions 553x48 [HUG/HUG] · horizontal pad 0 gap 12
      INSTANCE Action/Button 171x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 123x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Reset password"
      INSTANCE Action/Button 207x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 159x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Remove staff access"
      INSTANCE Action/Button 151x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
        TEXT label 103x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Promote user"
  FRAME scrim 1440x900 [FIXED/FIXED] @0,0 · fill color/overlay/scrim · opacity 40%
  INSTANCE Desktop/DashDialog 440x218 [FIXED/HUG] @500,341 · vertical pad 20/24/20/24 gap 12 · fill color/bg/default · r12
    TEXT title 273x26 [HUG/HUG] · fill color/text/primary · desktop/title · "Reset N. Fernando's password?"
    TEXT body 392x80 [FIXED/HUG] · fill color/text/secondary · desktop/body · "They'll get a one-time code by text and set a new dashboard password at their next sign-in. Their current password stops working immediately. Recorded in the audit log under your account."
    FRAME actions 392x48 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Action/Button 101x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 53x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Cancel"
      INSTANCE Action/Button 173x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
        TEXT label 125x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Send reset code"
```

**Fri 4 Sep, 9:40 AM.** The reset uses the same mechanism as a first sign-in — a code to the staff phone,
a new password at next sign-in — so no secret passes through the acting Admin.

### `11.7rs` — Staff accounts · reset code sent

**Reached from** `11.7r`  ·  **Leads to** the sidebar only  ·  **Opens** `11.7rd`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin, Active=Staff} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin} · [standard, see header]
  FRAME content 1200x524 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    FRAME auditTable 1152x244 [HUG/HUG] · vertical pad 0 gap 0 · fill color/bg/default · r8
      INSTANCE Desktop/TableRow 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill bg/brand-tint · stroke color/border/default mixed · {Kind=Header, Cols=5}
        TEXT colTime 190x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Staff account"
        TEXT colActor 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Role"
        TEXT colExtra 170x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Status"
        TEXT colAction 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Staff phone"
        TEXT colTarget 396x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Promoted ↓"
      INSTANCE Desktop/TableRow 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Kind=Row, Cols=5}
        TEXT colTime 190x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "T. Abeysekera"
        TEXT colActor 120x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Moderator"
        TEXT colExtra 170x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Active"
        TEXT colAction 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "+94 71 234 5678"
        TEXT colTarget 396x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "29 Aug 2026 by Kasun Jayawardena"
      INSTANCE Desktop/TableRow 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Kind=Row, Cols=5}
        TEXT colTime 190x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Shalini Weerasinghe"
        TEXT colActor 120x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Moderator"
        TEXT colExtra 170x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Active"
        TEXT colAction 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "+94 71 555 0100"
        TEXT colTarget 396x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "12 Jul 2026 by Kasun Jayawardena"
      INSTANCE Desktop/TableRow 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/subtle · stroke color/border/default mixed · {Kind=Row, Cols=5}
        TEXT colTime 190x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "N. Fernando"
        TEXT colActor 120x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Moderator"
        TEXT colExtra 170x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Inactive — 41 days"
        TEXT colAction 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "+94 71 555 0300"
        TEXT colTarget 396x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "2 May 2026 by Kasun Jayawardena"
      INSTANCE Desktop/TableRow 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Kind=Row, Cols=5}
        TEXT colTime 190x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Kasun Jayawardena"
        TEXT colActor 120x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Admin"
        TEXT colExtra 170x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Active"
        TEXT colAction 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "+94 71 555 0200"
        TEXT colTarget 396x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Founding account — set up on the backend"
      INSTANCE pagination 1152x44 [FILL/FIXED] · horizontal pad 12/16/12/16 gap 0 · fill color/bg/default · stroke color/border/default mixed · of Desktop/Pagination · {Page=Single}
        TEXT countText 199x20 [HUG/HUG] · fill color/text/secondary · desktop/body · "Showing 4 of 4 staff accounts"
    TEXT accountability 1120x54 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Staff accounts are separate from consumer accounts: a promoted person keeps their app account, which stays under Users, and gets a separate staff account here. Promotion creates a staff account; changing its role is done on the backend. Status is the sign-in state of the staff account, separate from its role. Sorted by promotion date, most recent first; the founding account last."
    INSTANCE Desktop/SectionCard 1152x92 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 399x20 [HUG/HUG] · fill color/text/primary · desktop/body · "N. Fernando · Moderator — password reset sent 4 Sep 2026"
      TEXT row1 1120x36 [FIXED/HUG] · fill color/text/secondary · desktop/table · "A one-time code was texted to +94 71 555 0300. Their current password no longer works; at next sign-in they enter the code and set a new dashboard password. Recorded in the audit log under your account."
    FRAME staffActions 512x48 [HUG/HUG] · horizontal pad 0 gap 12
      INSTANCE Action/Button 130x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/border/default 1.5 · r8 · {Style=Secondary, State=Disabled}
        TEXT label 82x24 [HUG/HUG] · fill color/text/secondary · mobile/body-medium · "Reset sent"
      INSTANCE Action/Button 207x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 159x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Remove staff access"
      INSTANCE Action/Button 151x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
        TEXT label 103x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Promote user"
```

Reset sent: the button becomes `Reset sent`, `{State=Disabled}`; *Remove staff access* stays available.

### `11.7rd` — Staff accounts · remove access? (dialog, after the reset)

**Opens over** `11.7rs`  ·  **Cancel returns to** `11.7rs`  ·  **Confirm** → `11.7rds`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin, Active=Staff} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin} · [standard, see header]
  FRAME content 1200x524 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    FRAME auditTable 1152x244 [HUG/HUG] · vertical pad 0 gap 0 · fill color/bg/default · r8
      INSTANCE Desktop/TableRow 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill bg/brand-tint · stroke color/border/default mixed · {Kind=Header, Cols=5}
        TEXT colTime 190x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Staff account"
        TEXT colActor 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Role"
        TEXT colExtra 170x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Status"
        TEXT colAction 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Staff phone"
        TEXT colTarget 396x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Promoted ↓"
      INSTANCE Desktop/TableRow 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Kind=Row, Cols=5}
        TEXT colTime 190x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "T. Abeysekera"
        TEXT colActor 120x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Moderator"
        TEXT colExtra 170x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Active"
        TEXT colAction 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "+94 71 234 5678"
        TEXT colTarget 396x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "29 Aug 2026 by Kasun Jayawardena"
      INSTANCE Desktop/TableRow 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Kind=Row, Cols=5}
        TEXT colTime 190x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Shalini Weerasinghe"
        TEXT colActor 120x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Moderator"
        TEXT colExtra 170x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Active"
        TEXT colAction 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "+94 71 555 0100"
        TEXT colTarget 396x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "12 Jul 2026 by Kasun Jayawardena"
      INSTANCE Desktop/TableRow 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/subtle · stroke color/border/default mixed · {Kind=Row, Cols=5}
        TEXT colTime 190x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "N. Fernando"
        TEXT colActor 120x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Moderator"
        TEXT colExtra 170x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Inactive — 41 days"
        TEXT colAction 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "+94 71 555 0300"
        TEXT colTarget 396x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "2 May 2026 by Kasun Jayawardena"
      INSTANCE Desktop/TableRow 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Kind=Row, Cols=5}
        TEXT colTime 190x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Kasun Jayawardena"
        TEXT colActor 120x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Admin"
        TEXT colExtra 170x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Active"
        TEXT colAction 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "+94 71 555 0200"
        TEXT colTarget 396x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Founding account — set up on the backend"
      INSTANCE pagination 1152x44 [FILL/FIXED] · horizontal pad 12/16/12/16 gap 0 · fill color/bg/default · stroke color/border/default mixed · of Desktop/Pagination · {Page=Single}
        TEXT countText 199x20 [HUG/HUG] · fill color/text/secondary · desktop/body · "Showing 4 of 4 staff accounts"
    TEXT accountability 1120x54 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Staff accounts are separate from consumer accounts: a promoted person keeps their app account, which stays under Users, and gets a separate staff account here. Promotion creates a staff account; changing its role is done on the backend. Status is the sign-in state of the staff account, separate from its role. Sorted by promotion date, most recent first; the founding account last."
    INSTANCE Desktop/SectionCard 1152x92 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 399x20 [HUG/HUG] · fill color/text/primary · desktop/body · "N. Fernando · Moderator — password reset sent 4 Sep 2026"
      TEXT row1 1120x36 [FIXED/HUG] · fill color/text/secondary · desktop/table · "A one-time code was texted to +94 71 555 0300. Their current password no longer works; at next sign-in they enter the code and set a new dashboard password. Recorded in the audit log under your account."
    FRAME staffActions 512x48 [HUG/HUG] · horizontal pad 0 gap 12
      INSTANCE Action/Button 130x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/border/default 1.5 · r8 · {Style=Secondary, State=Disabled}
        TEXT label 82x24 [HUG/HUG] · fill color/text/secondary · mobile/body-medium · "Reset sent"
      INSTANCE Action/Button 207x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 159x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Remove staff access"
      INSTANCE Action/Button 151x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
        TEXT label 103x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Promote user"
  FRAME scrim 1440x900 [FIXED/FIXED] @0,0 · fill color/overlay/scrim · opacity 40%
  INSTANCE Desktop/DashDialog 440x218 [FIXED/HUG] @500,341 · vertical pad 20/24/20/24 gap 12 · fill color/bg/default · r12
    TEXT title 314x26 [HUG/HUG] · fill color/text/primary · desktop/title · "Remove N. Fernando's staff access?"
    TEXT body 392x80 [FIXED/HUG] · fill color/text/secondary · desktop/body · "Their staff account is deactivated on the next request and can't sign in to the dashboard. Case history and audit entries stay; any consumer account is untouched. Recorded in the audit log under your account."
    FRAME actions 392x48 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Action/Button 101x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 53x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Cancel"
      INSTANCE Action/Button 168x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/state/danger · r8 · {Style=Destructive, State=Default}
        TEXT label 120x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Remove access"
```

**9:42 AM**, the removal after the reset.

### `11.7rds` — Staff accounts · reset sent, access removed

**Reached from** `11.7rd`  ·  **Leads to** the sidebar only

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin, Active=Staff} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin} · [standard, see header]
  FRAME content 1200x524 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    FRAME auditTable 1152x244 [HUG/HUG] · vertical pad 0 gap 0 · fill color/bg/default · r8
      INSTANCE Desktop/TableRow 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill bg/brand-tint · stroke color/border/default mixed · {Kind=Header, Cols=5}
        TEXT colTime 190x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Staff account"
        TEXT colActor 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Role"
        TEXT colExtra 170x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Status"
        TEXT colAction 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Staff phone"
        TEXT colTarget 396x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Promoted ↓"
      INSTANCE Desktop/TableRow 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Kind=Row, Cols=5}
        TEXT colTime 190x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "T. Abeysekera"
        TEXT colActor 120x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Moderator"
        TEXT colExtra 170x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Active"
        TEXT colAction 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "+94 71 234 5678"
        TEXT colTarget 396x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "29 Aug 2026 by Kasun Jayawardena"
      INSTANCE Desktop/TableRow 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Kind=Row, Cols=5}
        TEXT colTime 190x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Shalini Weerasinghe"
        TEXT colActor 120x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Moderator"
        TEXT colExtra 170x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Active"
        TEXT colAction 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "+94 71 555 0100"
        TEXT colTarget 396x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "12 Jul 2026 by Kasun Jayawardena"
      INSTANCE Desktop/TableRow 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/subtle · stroke color/border/default mixed · {Kind=Row, Cols=5}
        TEXT colTime 190x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "N. Fernando"
        TEXT colActor 120x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Moderator"
        TEXT colExtra 170x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Access removed"
        TEXT colAction 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "+94 71 555 0300"
        TEXT colTarget 396x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "2 May 2026 by Kasun Jayawardena"
      INSTANCE Desktop/TableRow 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Kind=Row, Cols=5}
        TEXT colTime 190x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Kasun Jayawardena"
        TEXT colActor 120x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Admin"
        TEXT colExtra 170x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Active"
        TEXT colAction 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "+94 71 555 0200"
        TEXT colTarget 396x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Founding account — set up on the backend"
      INSTANCE pagination 1152x44 [FILL/FIXED] · horizontal pad 12/16/12/16 gap 0 · fill color/bg/default · stroke color/border/default mixed · of Desktop/Pagination · {Page=Single}
        TEXT countText 199x20 [HUG/HUG] · fill color/text/secondary · desktop/body · "Showing 4 of 4 staff accounts"
    TEXT accountability 1120x54 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Staff accounts are separate from consumer accounts: a promoted person keeps their app account, which stays under Users, and gets a separate staff account here. Promotion creates a staff account; changing its role is done on the backend. Status is the sign-in state of the staff account, separate from its role. Sorted by promotion date, most recent first; the founding account last."
    INSTANCE Desktop/SectionCard 1152x92 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 326x20 [HUG/HUG] · fill color/text/primary · desktop/body · "N. Fernando — staff access removed 4 Sep 2026"
      TEXT row1 1120x36 [FIXED/HUG] · fill color/text/secondary · desktop/table · "The reset code sent earlier no longer works: the staff account is deactivated and can't sign in. Case history and audit-log entries stay; any consumer account is untouched. Recorded in the audit log under your account."
    FRAME staffActions 553x48 [HUG/HUG] · horizontal pad 0 gap 12
      INSTANCE Action/Button 171x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/border/default 1.5 · r8 · {Style=Secondary, State=Disabled}
        TEXT label 123x24 [HUG/HUG] · fill color/text/secondary · mobile/body-medium · "Reset password"
      INSTANCE Action/Button 207x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/border/default 1.5 · r8 · {Style=Secondary, State=Disabled}
        TEXT label 159x24 [HUG/HUG] · fill color/text/secondary · mobile/body-medium · "Remove staff access"
      INSTANCE Action/Button 151x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
        TEXT label 103x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Promote user"
```

Both actions taken. The card adds the one consequence the order creates: the code sent at 9:40 no longer
works, because the account is deactivated.

### `11.7d` — Staff accounts · remove access? (dialog)

**Opens over** `11.7`  ·  **Cancel returns to** `11.7`  ·  **Confirm** → `11.7ds`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin, Active=Staff} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin} · [standard, see header]
  FRAME content 1200x550 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    FRAME auditTable 1152x244 [HUG/HUG] · vertical pad 0 gap 0 · fill color/bg/default · r8
      INSTANCE Desktop/TableRow 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill bg/brand-tint · stroke color/border/default mixed · {Kind=Header, Cols=5}
        TEXT colTime 190x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Staff account"
        TEXT colActor 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Role"
        TEXT colExtra 170x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Status"
        TEXT colAction 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Staff phone"
        TEXT colTarget 396x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Promoted ↓"
      INSTANCE Desktop/TableRow 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Kind=Row, Cols=5}
        TEXT colTime 190x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "T. Abeysekera"
        TEXT colActor 120x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Moderator"
        TEXT colExtra 170x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Active"
        TEXT colAction 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "+94 71 234 5678"
        TEXT colTarget 396x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "29 Aug 2026 by Kasun Jayawardena"
      INSTANCE Desktop/TableRow 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Kind=Row, Cols=5}
        TEXT colTime 190x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Shalini Weerasinghe"
        TEXT colActor 120x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Moderator"
        TEXT colExtra 170x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Active"
        TEXT colAction 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "+94 71 555 0100"
        TEXT colTarget 396x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "12 Jul 2026 by Kasun Jayawardena"
      INSTANCE Desktop/TableRow 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/subtle · stroke color/border/default mixed · {Kind=Row, Cols=5}
        TEXT colTime 190x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "N. Fernando"
        TEXT colActor 120x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Moderator"
        TEXT colExtra 170x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Inactive — 41 days"
        TEXT colAction 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "+94 71 555 0300"
        TEXT colTarget 396x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "2 May 2026 by Kasun Jayawardena"
      INSTANCE Desktop/TableRow 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Kind=Row, Cols=5}
        TEXT colTime 190x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Kasun Jayawardena"
        TEXT colActor 120x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Admin"
        TEXT colExtra 170x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Active"
        TEXT colAction 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "+94 71 555 0200"
        TEXT colTarget 396x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Founding account — set up on the backend"
      INSTANCE pagination 1152x44 [FILL/FIXED] · horizontal pad 12/16/12/16 gap 0 · fill color/bg/default · stroke color/border/default mixed · of Desktop/Pagination · {Page=Single}
        TEXT countText 199x20 [HUG/HUG] · fill color/text/secondary · desktop/body · "Showing 4 of 4 staff accounts"
    TEXT accountability 1120x54 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Staff accounts are separate from consumer accounts: a promoted person keeps their app account, which stays under Users, and gets a separate staff account here. Promotion creates a staff account; changing its role is done on the backend. Status is the sign-in state of the staff account, separate from its role. Sorted by promotion date, most recent first; the founding account last."
    INSTANCE Desktop/SectionCard 1152x118 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 228x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Selected: N. Fernando · Moderator"
      TEXT row1 1120x36 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Reset password — texts a one-time code to their staff phone; they set a new dashboard password at next sign-in, the same way a first sign-in works. Their current password stops working immediately."
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Remove staff access — deactivates the staff account; their consumer account, if any, is untouched. Case history and audit entries stay."
    FRAME staffActions 553x48 [HUG/HUG] · horizontal pad 0 gap 12
      INSTANCE Action/Button 171x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 123x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Reset password"
      INSTANCE Action/Button 207x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 159x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Remove staff access"
      INSTANCE Action/Button 151x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
        TEXT label 103x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Promote user"
  FRAME scrim 1440x900 [FIXED/FIXED] @0,0 · fill color/overlay/scrim · opacity 40%
  INSTANCE Desktop/DashDialog 440x218 [FIXED/HUG] @500,341 · vertical pad 20/24/20/24 gap 12 · fill color/bg/default · r12
    TEXT title 314x26 [HUG/HUG] · fill color/text/primary · desktop/title · "Remove N. Fernando's staff access?"
    TEXT body 392x80 [FIXED/HUG] · fill color/text/secondary · desktop/body · "Their staff account is deactivated on the next request and can't sign in to the dashboard. Case history and audit entries stay; any consumer account is untouched. Recorded in the audit log under your account."
    FRAME actions 392x48 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Action/Button 101x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 53x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Cancel"
      INSTANCE Action/Button 168x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/state/danger · r8 · {Style=Destructive, State=Default}
        TEXT label 120x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Remove access"
```

The removal without a prior reset — the other branch.

### `11.7ds` — Staff accounts · access removed

**Reached from** `11.7d`  ·  **Leads to** the sidebar only

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin, Active=Staff} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin} · [standard, see header]
  FRAME content 1200x524 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    FRAME auditTable 1152x244 [HUG/HUG] · vertical pad 0 gap 0 · fill color/bg/default · r8
      INSTANCE Desktop/TableRow 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill bg/brand-tint · stroke color/border/default mixed · {Kind=Header, Cols=5}
        TEXT colTime 190x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Staff account"
        TEXT colActor 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Role"
        TEXT colExtra 170x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Status"
        TEXT colAction 180x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Staff phone"
        TEXT colTarget 396x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Promoted ↓"
      INSTANCE Desktop/TableRow 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Kind=Row, Cols=5}
        TEXT colTime 190x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "T. Abeysekera"
        TEXT colActor 120x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Moderator"
        TEXT colExtra 170x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Active"
        TEXT colAction 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "+94 71 234 5678"
        TEXT colTarget 396x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "29 Aug 2026 by Kasun Jayawardena"
      INSTANCE Desktop/TableRow 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Kind=Row, Cols=5}
        TEXT colTime 190x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Shalini Weerasinghe"
        TEXT colActor 120x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Moderator"
        TEXT colExtra 170x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Active"
        TEXT colAction 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "+94 71 555 0100"
        TEXT colTarget 396x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "12 Jul 2026 by Kasun Jayawardena"
      INSTANCE Desktop/TableRow 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/subtle · stroke color/border/default mixed · {Kind=Row, Cols=5}
        TEXT colTime 190x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "N. Fernando"
        TEXT colActor 120x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Moderator"
        TEXT colExtra 170x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Access removed"
        TEXT colAction 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "+94 71 555 0300"
        TEXT colTarget 396x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "2 May 2026 by Kasun Jayawardena"
      INSTANCE Desktop/TableRow 1152x40 [FIXED/FIXED] · horizontal pad 0/16/0/16 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Kind=Row, Cols=5}
        TEXT colTime 190x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Kasun Jayawardena"
        TEXT colActor 120x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Admin"
        TEXT colExtra 170x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Active"
        TEXT colAction 180x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "+94 71 555 0200"
        TEXT colTarget 396x18 [FIXED/HUG] · fill color/text/primary · desktop/table · "Founding account — set up on the backend"
      INSTANCE pagination 1152x44 [FILL/FIXED] · horizontal pad 12/16/12/16 gap 0 · fill color/bg/default · stroke color/border/default mixed · of Desktop/Pagination · {Page=Single}
        TEXT countText 199x20 [HUG/HUG] · fill color/text/secondary · desktop/body · "Showing 4 of 4 staff accounts"
    TEXT accountability 1120x54 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Staff accounts are separate from consumer accounts: a promoted person keeps their app account, which stays under Users, and gets a separate staff account here. Promotion creates a staff account; changing its role is done on the backend. Status is the sign-in state of the staff account, separate from its role. Sorted by promotion date, most recent first; the founding account last."
    INSTANCE Desktop/SectionCard 1152x92 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 326x20 [HUG/HUG] · fill color/text/primary · desktop/body · "N. Fernando — staff access removed 4 Sep 2026"
      TEXT row1 1120x36 [FIXED/HUG] · fill color/text/secondary · desktop/table · "The staff account is deactivated and can't sign in to the dashboard. Case history and audit-log entries stay for accountability; any consumer account is untouched. Recorded in the audit log under your account."
    FRAME staffActions 553x48 [HUG/HUG] · horizontal pad 0 gap 12
      INSTANCE Action/Button 171x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/border/default 1.5 · r8 · {Style=Secondary, State=Disabled}
        TEXT label 123x24 [HUG/HUG] · fill color/text/secondary · mobile/body-medium · "Reset password"
      INSTANCE Action/Button 207x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/border/default 1.5 · r8 · {Style=Secondary, State=Disabled}
        TEXT label 159x24 [HUG/HUG] · fill color/text/secondary · mobile/body-medium · "Remove staff access"
      INSTANCE Action/Button 151x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
        TEXT label 103x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Promote user"
```

Access removed: `Reset password` and `Remove staff access` are both `{State=Disabled}`; the status column
reads *Access removed*. Case history and audit entries stay.

## Account recovery

The Admin-adjudicated path for a user with no reachable phone and no verified email (`FR-ACC-10` as
amended, requirements *Account recovery*): the NIC, legal name and birthdate the user submitted are matched
against the record, and **an Admin — never a Moderator — approves or rejects**. The request is Nethmi
Jayasinghe's, on Sat 5 Sep; the worker's side of it is [M1](M1-account.md) `1.8rec*`.

### `11.8rec1` — Account recovery · review

**Reached from** `11.4rec`  ·  **Leads to** `11.4rec`  ·  **Opens** `11.8rec2`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin, Active=Users} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin} · [standard, see header]
  FRAME content 1200x580 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    TEXT searchContext 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Account recovery request — Nethmi Jayasinghe · submitted 5 Sep 2026 · reviewed by an Admin only"
    INSTANCE Desktop/DetailPane 420x364 [FIXED/HUG] · vertical pad 20 gap 10 · fill color/bg/default · r8 · {Role=Admin}
      FRAME nameRow 380x26 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT userName 295x26 [FILL/HUG] · fill color/text/primary · desktop/title · "Nethmi Jayasinghe"
        INSTANCE Display/Badge 77x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
          VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
          TEXT label 44x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Verified"
      FRAME field-Phone 380x40 [FILL/HUG] · horizontal pad 0 gap 12
        TEXT fieldLabel 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Phone"
        TEXT fieldValue 248x40 [FILL/HUG] · fill color/text/primary · desktop/body · "+94 76 234 5678 · unreachable, reported lost"
      FRAME field-Role 380x20 [FILL/HUG] · horizontal pad 0 gap 12
        TEXT fieldLabel 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Role"
        TEXT fieldValue 248x20 [FILL/HUG] · fill color/text/primary · desktop/body · "Worker"
      FRAME field-NIC 380x40 [FILL/HUG] · horizontal pad 0 gap 12
        TEXT fieldLabel 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "NIC"
        TEXT fieldValue 248x40 [FILL/HUG] · fill color/text/primary · desktop/body · "200156789012 · matches the details submitted"
      FRAME field-Rating 380x20 [FILL/HUG] · horizontal pad 0 gap 12
        TEXT fieldLabel 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Rating"
        TEXT fieldValue 248x20 [FILL/HUG] · fill color/text/primary · desktop/body · "4.6 from 12 ratings · 93% completion"
      FRAME field-Endorsements 380x40 [FILL/HUG] · horizontal pad 0 gap 12
        TEXT fieldLabel 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Endorsements"
        TEXT fieldValue 248x40 [FILL/HUG] · fill color/text/primary · desktop/body · "2 received (K. Rathnayake, M. Perera) · 0 given"
      FRAME field-Case history 380x20 [FILL/HUG] · horizontal pad 0 gap 12
        TEXT fieldLabel 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Case history"
        TEXT fieldValue 248x20 [FILL/HUG] · fill color/text/primary · desktop/body · "2 resolved disputes · 1 warning"
      FRAME actions 351x48 [HUG/HUG] · horizontal pad 0 gap 8
        INSTANCE Action/Button 184x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/state/danger · r8 · {Style=Destructive, State=Default}
          TEXT label 136x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Approve recovery"
        INSTANCE Action/Button 159x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
          TEXT label 111x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Reject request"
    INSTANCE Desktop/SectionCard 1152x126 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 254x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Why this account cannot recover itself"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "No reachable phone and no verified email, so both automated recovery channels fail."
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "NIC, legal name and birthdate submitted on 5 Sep 2026 all match the account record."
      TEXT row3 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Reputation at stake: 13 completed gigs, 12 ratings and 2 endorsements — the account's whole value to this worker."
```

**Sat 5 Sep.** The request is matched field by field — the NIC *"matches the details submitted"* — and the
card beneath says why the account cannot recover itself and what is at stake: 13 completed gigs, 12 ratings
and 2 endorsements. *Approve recovery* is `{Style=Destructive}` because it hands the account to whoever made
the request.

### `11.8rec2` — Account recovery · approve recovery? (dialog)

**Opens over** `11.8rec1`  ·  **Cancel returns to** `11.8rec1`  ·  **Confirm** → `11.8rec3`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin, Active=Users} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin} · [standard, see header]
  FRAME content 1200x580 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    TEXT searchContext 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Account recovery request — Nethmi Jayasinghe · submitted 5 Sep 2026 · reviewed by an Admin only"
    INSTANCE Desktop/DetailPane 420x364 [FIXED/HUG] · vertical pad 20 gap 10 · fill color/bg/default · r8 · {Role=Admin}
      FRAME nameRow 380x26 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT userName 295x26 [FILL/HUG] · fill color/text/primary · desktop/title · "Nethmi Jayasinghe"
        INSTANCE Display/Badge 77x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
          VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
          TEXT label 44x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Verified"
      FRAME field-Phone 380x40 [FILL/HUG] · horizontal pad 0 gap 12
        TEXT fieldLabel 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Phone"
        TEXT fieldValue 248x40 [FILL/HUG] · fill color/text/primary · desktop/body · "+94 76 234 5678 · unreachable, reported lost"
      FRAME field-Role 380x20 [FILL/HUG] · horizontal pad 0 gap 12
        TEXT fieldLabel 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Role"
        TEXT fieldValue 248x20 [FILL/HUG] · fill color/text/primary · desktop/body · "Worker"
      FRAME field-NIC 380x40 [FILL/HUG] · horizontal pad 0 gap 12
        TEXT fieldLabel 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "NIC"
        TEXT fieldValue 248x40 [FILL/HUG] · fill color/text/primary · desktop/body · "200156789012 · matches the details submitted"
      FRAME field-Rating 380x20 [FILL/HUG] · horizontal pad 0 gap 12
        TEXT fieldLabel 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Rating"
        TEXT fieldValue 248x20 [FILL/HUG] · fill color/text/primary · desktop/body · "4.6 from 12 ratings · 93% completion"
      FRAME field-Endorsements 380x40 [FILL/HUG] · horizontal pad 0 gap 12
        TEXT fieldLabel 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Endorsements"
        TEXT fieldValue 248x40 [FILL/HUG] · fill color/text/primary · desktop/body · "2 received (K. Rathnayake, M. Perera) · 0 given"
      FRAME field-Case history 380x20 [FILL/HUG] · horizontal pad 0 gap 12
        TEXT fieldLabel 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Case history"
        TEXT fieldValue 248x20 [FILL/HUG] · fill color/text/primary · desktop/body · "2 resolved disputes · 1 warning"
      FRAME actions 351x48 [HUG/HUG] · horizontal pad 0 gap 8
        INSTANCE Action/Button 184x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/state/danger · r8 · {Style=Destructive, State=Default}
          TEXT label 136x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Approve recovery"
        INSTANCE Action/Button 159x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
          TEXT label 111x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Reject request"
    INSTANCE Desktop/SectionCard 1152x126 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 254x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Why this account cannot recover itself"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "No reachable phone and no verified email, so both automated recovery channels fail."
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "NIC, legal name and birthdate submitted on 5 Sep 2026 all match the account record."
      TEXT row3 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Reputation at stake: 13 completed gigs, 12 ratings and 2 endorsements — the account's whole value to this worker."
  FRAME scrim 1440x900 [FIXED/FIXED] @0,0 · fill color/overlay/scrim · opacity 40%
  INSTANCE Desktop/DashDialog 440x218 [FIXED/HUG] @500,341 · vertical pad 20/24/20/24 gap 12 · fill color/bg/default · r12
    TEXT title 241x26 [HUG/HUG] · fill color/text/primary · desktop/title · "Approve account recovery?"
    TEXT body 392x80 [FIXED/HUG] · fill color/text/secondary · desktop/body · "Nethmi Jayasinghe will be able to set a new password on the device that made the request. Ratings, completed gigs and endorsements are unchanged. This is recorded in the audit log against your account."
    FRAME actions 392x48 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Action/Button 101x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 53x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Cancel"
      INSTANCE Action/Button 184x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
        TEXT label 136x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Approve recovery"
```

The confirmation names what changes (a new password, on the requesting device) and what does not
(ratings, gigs, endorsements).

### `11.8rec3` — Account recovery · approved and recorded

**Reached from** `11.8rec2`  ·  **Leads to** `11.6rec`

```
FRAME 1440x900 · absolute · fill color/bg/subtle
  INSTANCE Desktop/DashSidebar 240x900 [FIXED/FIXED] @0,0 · vertical pad 20/12/20/12 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin, Active=Users} · [standard, see header]
  INSTANCE Desktop/DashHeader 1200x56 [FIXED/FIXED] @240,0 · horizontal pad 0/24/0/24 gap 16 · fill color/bg/default · stroke color/border/default mixed · {Role=Admin} · [standard, see header]
  FRAME content 1200x580 [FIXED/HUG] @240,56 · vertical pad 20/24/24/24 gap 14
    TEXT searchContext 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Account recovery — Nethmi Jayasinghe · approved 5 Sep 2026, recorded in the audit log"
    INSTANCE Desktop/DetailPane 420x364 [FIXED/HUG] · vertical pad 20 gap 10 · fill color/bg/default · r8 · {Role=Admin}
      FRAME nameRow 380x26 [FILL/HUG] · horizontal pad 0 gap 8
        TEXT userName 295x26 [FILL/HUG] · fill color/text/primary · desktop/title · "Nethmi Jayasinghe"
        INSTANCE Display/Badge 77x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
          VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
          TEXT label 44x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Verified"
      FRAME field-Phone 380x40 [FILL/HUG] · horizontal pad 0 gap 12
        TEXT fieldLabel 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Phone"
        TEXT fieldValue 248x40 [FILL/HUG] · fill color/text/primary · desktop/body · "+94 76 234 5678 · unreachable, reported lost"
      FRAME field-Role 380x20 [FILL/HUG] · horizontal pad 0 gap 12
        TEXT fieldLabel 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Role"
        TEXT fieldValue 248x20 [FILL/HUG] · fill color/text/primary · desktop/body · "Worker"
      FRAME field-NIC 380x40 [FILL/HUG] · horizontal pad 0 gap 12
        TEXT fieldLabel 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "NIC"
        TEXT fieldValue 248x40 [FILL/HUG] · fill color/text/primary · desktop/body · "200156789012 · matches the details submitted"
      FRAME field-Rating 380x20 [FILL/HUG] · horizontal pad 0 gap 12
        TEXT fieldLabel 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Rating"
        TEXT fieldValue 248x20 [FILL/HUG] · fill color/text/primary · desktop/body · "4.6 from 12 ratings · 93% completion"
      FRAME field-Endorsements 380x40 [FILL/HUG] · horizontal pad 0 gap 12
        TEXT fieldLabel 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Endorsements"
        TEXT fieldValue 248x40 [FILL/HUG] · fill color/text/primary · desktop/body · "2 received (K. Rathnayake, M. Perera) · 0 given"
      FRAME field-Case history 380x20 [FILL/HUG] · horizontal pad 0 gap 12
        TEXT fieldLabel 120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Case history"
        TEXT fieldValue 248x20 [FILL/HUG] · fill color/text/primary · desktop/body · "2 resolved disputes · 1 warning"
      FRAME actions 379x48 [HUG/HUG] · horizontal pad 0 gap 8
        INSTANCE Action/Button 197x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/subtle · stroke color/border/default 1 · r8 · {Style=Destructive, State=Disabled}
          TEXT label 149x24 [HUG/HUG] · fill color/text/secondary · mobile/body-medium · "Recovery approved"
        INSTANCE Action/Button 174x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
          TEXT label 126x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "View audit entry"
    INSTANCE Desktop/SectionCard 1152x126 [FILL/HUG] · vertical pad 14/16/14/16 gap 8 · fill color/bg/default · r8
      TEXT cardTitle 230x20 [HUG/HUG] · fill color/text/primary · desktop/body · "Recorded — what the approval did"
      TEXT row1 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Password reset issued to the device that made the request. The account's ratings, completed gigs and endorsements are untouched."
      TEXT row2 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "Logged as “Approved account recovery” against Nethmi Jayasinghe, attributable to the acting Admin."
      TEXT row3 1120x18 [FIXED/HUG] · fill color/text/secondary · desktop/table · "No identifying data was revealed to the requester at any point."
```

Approved and recorded. *View audit entry* opens `11.6rec`.

---

## What the collapsed header and sidebar hide

`design-system.md` §6 collapses `Desktop/DashSidebar` and `Desktop/DashHeader` to one line each. Three things
vary under them.

| | Moderator frames | Admin frames |
| --- | --- | --- |
| `staffName` | Shalini Weerasinghe — except `11.4t`, T. Abeysekera | Kasun Jayawardena |
| Sidebar items | **four**: Case queue · All postings · Users · Metrics | six: those four, then Audit log · Staff |
| Sidebar links on this page | Case queue → `11.4` · All postings → `11.2` · Users → `11.3Lm` · Metrics → `11.5m` | Case queue → `11.4a` · All postings → `11.2a` · Users → `11.3L` · Metrics → `11.5` · Audit log → `11.6` · Staff → `11.7` |

`Sign out` → `11.1` on every frame. The active item and every item under a dialog's scrim carry no link.
**The Moderator's sidebar has no Audit log or Staff item** (ruled 2026-09-24): those surfaces are not
offered to the role at all, rather than offered and refused.

## Every screen shows one moment

| When | Frames |
| --- | --- |
| Sat 29 Aug | T. Abeysekera promoted (audit log) |
| Mon 31 Aug, before 2:55 PM | `11.1`, `11.1b`, `11.4` |
| Mon 31 Aug, after 2:55 PM | `11.1f`–`11.1p`, `11.4t`, `11.4x` |
| Tue 1 Sep | `11.4rr` |
| Wed 2 Sep | `11.4w`, `11.4e` (two branches of one decision) |
| Thu 3 Sep, after 4:10 PM | `11.4c` |
| Fri 4 Sep, before 11:05 AM | `11.4a`, `11.4r` (branch) |
| Fri 4 Sep, about 11:10 AM | `11.4pe` (branch) |
| Fri 4 Sep, before 3:38 PM | `11.4ar` |
| Fri 4 Sep, 9:15 AM | `11.5`, `11.5x`, `11.5m`, `11.5xm` |
| Fri 4 Sep, 9:40–9:42 AM | `11.7`, `11.7r`, `11.7rs`, `11.7rd`, `11.7rds`, `11.7d`, `11.7ds` |
| Fri 4 Sep, before 3:40 PM | every postings frame not ending in `x`; the users frames; `10.6n` |
| Fri 4 Sep, after 3:40 PM | `11.2adx`, `11.2afx`, `11.2affx`, `11.2afwx`, `11.2afex`; `11.6` (end of day) |
| Sat 5 Sep | `11.4pw`, `11.4pce`, `11.4rec`, `11.8rec1`–`11.8rec3`, `11.6rec` (10:15 AM) |
| Any time | `11.1w`, `11.1L` |

## The postings table

One dataset, as of 1–4 Sep 2026. The platform holds **85 postings: 23 Open, 41 Filled, 9 Withdrawn, 12
Expired** (`11.5`). The first page, newest first:

| Posted | Title | Employer | Status | Moderation |
| --- | --- | --- | --- | --- |
| 30 Aug | Data entry — work from home | R. Gunasekara | Open | Under review |
| 27 Aug | Grade 8 maths tutoring | Dilrukshi Herath | Open | — |
| 27 Aug | Office cleaning — Kirulapone | Kottawa Business Centre | Filled | — |
| 27 Aug | Event setup crew (3 needed) | Lanka Events (Pvt) Ltd | Expired | — |
| 26 Aug | Warehouse packing — night shift | Ceylon Logistics | Filled | — |
| 26 Aug | House cleaning — Saturday | A. Wijeratne | Open | — |
| 25 Aug | Shop assistant — weekend | Saman Stores | Filled | — |
| 25 Aug | Delivery rider — mornings | FreshCart Maharagama | Open | — |
| 24 Aug | Café service crew — evenings | Green Leaf Café | Open | — |
| 20 Aug | Stage crew — Friday setup | Lanka Events (Pvt) Ltd | Expired | — |

These are the postings the other modules establish, with the statuses they hold on these dates. **The rows
that appear only on the filtered pages** — *Stock count — weekend*, *Promoter — shopping mall*, *Cashier —
festival week* and the rest — are the platform's background population: invented, dated before the story's
week, and never referenced outside this module. After the removal, *Data entry* moves from Open to Withdrawn:
Open 22, Withdrawn 10, the total unchanged.

## Pagination

**The pager is a table footer.** `Desktop/Pagination` has radius 0, no effect and a top border only; inside a
table it sits at the bottom of a container that has radius 8, clips its content and carries the table's
drop shadow, which is why it reads as part of a rounded, raised card. That is not clipping — standing alone,
the component has nothing to give it a card. **The case queues therefore have no pager** (ruled 2026-09-24):
they are lists of cards, not tables, and the count lives in the caption.

**"Page x of y" appears only where there is a further page.** `{Page=First}` shows the position and
`Next ›`; `{Page=Single}` hides both when everything fits — the 9 or 10 withdrawn postings, the 4 staff
accounts, a one-account search result. Every **filtered** table shows its real first page: ten rows and the
position (*Page 1 of 3* for 23 Open), or every row where they fit.

**`Next ›` is inert everywhere** — ruled 2026-09-19: a further page is drawn only when it would show
something the first does not, and none would.

## Rulings this module follows

Ruled on 2026-09-24, after the findings were checked by an independent review.

- **Admin-only actions are not offered to a Moderator.** The blocked-action screens `11.2x` and `11.3x` were
  deleted; `11.2d` has no Remove, `11.3m` no Suspend or Promote. FR-DASH-01/02 were amended to *"not offered;
  the server rejects the call"*.
- **The Moderator's sidebar has no Audit log or Staff item**; `11.6m` and `11.7m`, the access-denied pages,
  were deleted, and the audit-log criterion (NFR-OPS-01) amended the same way.
- **Queues have no pager**; the count is in the caption.
- **The recovery request is Nethmi Jayasinghe's** — her figures were already on the screen under another name.
- **A suspension records its grounds** (FR-ADM-03 as amended). The Admin tour's suspension of Nethmi became
  the grounds check `10.6n`; its "suspended" result `10.6nb` was deleted.
- **Promotion starts from the Staff page only**; Promote was removed from user records.
- **The Users list is truly alphabetical**, with a search-result state for each role.
- **The payment dispute's close and later escalation happen on Sat 5 Sep**, after the clarification answer:
  `11.4pw` moved to that day and `11.4pce` was added; `11.4pe` stays the 4 Sep escalate-before-asking branch.

## States not drawn in this module

| Not drawn | Build it from |
| --- | --- |
| A Moderator's read-only view of an escalated or ruled case | [M10](M10-moderation.md) `10.1a`'s layout with the action row removed and a status line — the queue cards on `11.4e`/`11.4pe` route to the Moderator's last view of the case instead |
| A queue long enough to page | the queue caption plus `Desktop/Pagination` in its table-footer treatment inside a card container |
| Further pages of any table | not drawn by ruling — `Next ›` is inert |
| Filters beyond status (category, date, report state) | `FR-DASH-01` names status only; add chips to `filterRow` if the requirement grows |
| A search with no result | `11.3Ls` with the table replaced by a single row *"No accounts match “…”"* and `{Page=Single}` removed |
| A **rejected** recovery request | `11.8rec3`'s pattern — *Recovery rejected*, disabled, and the audit row *Rejected account recovery* on `11.6rec`'s pattern |
| Unlocking a locked staff account early, or changing a staff role | backend-only, in `decisions.md`'s runbook |
| Reactivating removed staff access | not offered — a new promotion creates a new staff account |

## Open, and carried to the module that owns it

- **M1: the worker's side of the recovery** (`1.8rec*`) still shows the old requester; it becomes Nethmi
  Jayasinghe's request of Sat 5 Sep, matching `11.8rec1`–`11.8rec3`.
