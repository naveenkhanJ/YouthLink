# M1 — Account

**A hundred and one frames on this page; a hundred M1 screens and one from M8.** `8.6`, the bio prompt, is an M8 dialog drawn here because it opens over this page's profile and a Figma prototype link cannot cross pages.

This is everything about the account itself: registering for each of the three self-serve roles, logging in by password or by code, getting back in when the password is forgotten — and, when neither the phone nor an email can reach the person, recovery by an Admin — the person's own profile, one Settings screen, the contact-detail forms and account deletion. **A contact change is pending until confirmed; deletion is blocked while an engagement runs; a suspended account is refused on every path.**

**Read *Who is who* and *Every screen shows one moment* at the end first.** Kavindu Perera (worker), Lanka Events (employer, Business) and Sunil Bandara (verifier) each have their own copy of every screen that shows personal data; so do Dilrukshi Herath, R. Gunasekara and Nethmi Jayasinghe for their profile, Settings, sign-out and display name. The contact forms behind Settings are shared and show nobody's data. The recovery is Nethmi's, the suspended account R. Gunasekara's.

Read `README.md` for the notation and `design-system.md` for the tokens and components. **Two pieces of chrome repeat, so they read `[standard, see header]`** — the registration top bar and the tab bar. *What the collapsed chrome hides*, at the end, spells both out.

---

## Registration — the worker

Four steps: role, phone, code, details (`FR-ACC-01`). The phone is the
account's identity and the only thing verified (`FR-ACC-08`); the NIC is checked for **shape only**, never
against a registry (`FR-ACC-04`), and the birthdate enforces the 18+ gate (`FR-ACC-03`). The details step
is also where the Terms and Privacy Policy are accepted (`FR-ACC-19`). Every step after the first carries
**Go to log in**, for someone who realises part-way through that they already have an account.

### `1.1` — Role selection

**Reached from** `1.17d` · [M0](M0-first-run.md) `0.2`/`0.3` (Skip) and `0.4` (Create account)  ·  **Leads to** `1.6` ("Go to log in"), `1.2` ("Continue")

```
FRAME 360x800 · vertical pad 6/16/24/16 gap 16 · fill color/bg/default
  FRAME topBarGhost 44x44 [FIXED/FIXED] · [standard, see header]
  TEXT screenTitle 179x32 [HUG/HUG] · fill color/text/primary · mobile/display · "Create account"
  TEXT step 62x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Step 1 of 4"
  INSTANCE Input/RoleOption 328x78 [FIXED/HUG] · horizontal pad 16 gap 12 · fill color/bg/default · stroke color/brand/primary 2 · r8 · {State=Selected}
    FRAME radio 20x20 [FIXED/FIXED]
      ELLIPSE ring 20x20 [FIXED/FIXED] @0,0 · stroke color/brand/primary 2
      ELLIPSE dot 10x10 [FIXED/FIXED] @5,5 · fill color/brand/primary
    FRAME copy 192x46 [HUG/HUG] · vertical pad 0 gap 2
      TEXT title 138x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Youth Job-Seeker"
      TEXT description 192x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Find part-time work and gigs"
  INSTANCE Input/RoleOption 328x78 [FIXED/HUG] · horizontal pad 16 gap 12 · fill color/bg/default · stroke color/border/default 1.5 · r8 · {State=Default}
    FRAME radio 20x20 [FIXED/FIXED]
      ELLIPSE ring 20x20 [FIXED/FIXED] @0,0 · stroke color/border/default 1.5
    FRAME copy 191x46 [HUG/HUG] · vertical pad 0 gap 2
      TEXT title 191x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Local Business/Employer"
      TEXT description 176x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Post gigs and hire workers"
  INSTANCE Input/RoleOption 328x78 [FIXED/HUG] · horizontal pad 16 gap 12 · fill color/bg/default · stroke color/border/default 1.5 · r8 · {State=Default}
    FRAME radio 20x20 [FIXED/FIXED]
      ELLIPSE ring 20x20 [FIXED/FIXED] @0,0 · stroke color/border/default 1.5
    FRAME copy 180x46 [HUG/HUG] · vertical pad 0 gap 2
      TEXT title 148x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Community Verifier"
      TEXT description 180x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Vouch for people you know"
  FRAME spacer-grow 8x224 [FIXED/FILL]
  INSTANCE Action/Link 87x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
    TEXT label 87x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Go to log in"
  INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
    TEXT label 70x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Continue"
```

**Step 1 of 4**, and the step counter already knows the path: the employer's copy (`1.1e`) reads *Step 1
of 5*. Three `Input/RoleOption` cards, one `{State=Selected}`. There is no back chevron — `topBarGhost` holds
the title at the height every later step uses. *Go to log in* sits above Continue on every registration
step.

### `1.2` — Registration, phone entry

**Reached from** `1.1`, `1.3`, `1.3err1`, `1.3err2`, `1.3rs2`  ·  **Leads to** `1.6` ("Go to log in"), `1.3` ("Send code")  ·  **Exits** back → `1.1`, ✕ → `1.1`

*In the demo:* the error walk: Send code → `1.2err`.

```
FRAME 360x800 · vertical pad 6/16/24/16 gap 16 · fill color/bg/default
  FRAME topBar 328x44 [FILL/HUG] · horizontal pad 0 gap 0 · [standard, see header]
  TEXT screenTitle 179x32 [HUG/HUG] · fill color/text/primary · mobile/display · "Create account"
  TEXT step 63x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Step 2 of 4"
  INSTANCE Input/PhoneField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Default}
    TEXT Phone number 97x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Phone number"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
      FRAME prefix 56x48 [HUG/FILL] · horizontal pad 0/12/0/12 gap 0 · fill color/bg/subtle
        TEXT +94 32x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "+94"
      FRAME val 107x48 [HUG/FILL] · horizontal pad 0/0/0/12 gap 0
        TEXT 7X XXX XXXX 95x24 [HUG/HUG] · fill color/text/primary · mobile/body · "77 123 4567"
  FRAME spacer-grow 8x418 [FIXED/FILL]
  INSTANCE loginLink 87x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0 · of Action/Link
    TEXT label 87x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Go to log in"
  INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
    TEXT label 82x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Send code"
```

Kavindu Perera's number, typed: the value is drawn in `color/text/primary`. `Input/PhoneField` has no
`Filled` variant, so an entered number is the `Default` variant with its value recoloured — the placeholder
`7X XXX XXXX` is `color/text/secondary` (compare `1.6emp`). The `+94` prefix is fixed; Sri Lankan numbers
only.

### `1.3` — Registration, code entry

**Reached from** `1.2`, `1.3err1`, `1.3rs2` · in the demo `1.2err`  ·  **Leads to** `1.2` ("Change number"), `1.6` ("Go to log in"), `1.4` ("Verify")  ·  **Exits** back → `1.2`, ✕ → `1.1`

*In the demo:* the error walk: Verify → `1.3err2`.

```
FRAME 360x800 · vertical pad 6/16/24/16 gap 16 · fill color/bg/default
  FRAME topBar 328x44 [FILL/HUG] · horizontal pad 0 gap 0 · [standard, see header]
  TEXT screenTitle 179x32 [HUG/HUG] · fill color/text/primary · mobile/display · "Create account"
  TEXT step 64x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Step 3 of 4"
  TEXT sentTo 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "We sent a 6-digit code to +94 77 123 4567."
  INSTANCE Input/CodeInputNumeric 328x52 [FILL/HUG] · vertical pad 0 gap 8 · {State=Filled}
    FRAME digits 328x52 [FILL/HUG] · horizontal pad 0 gap 8
      FRAME d0 48x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT 3 14x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "3"
      FRAME d1 48x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT 7 12x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "7"
      FRAME d2 48x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT 1 10x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "1"
      FRAME d3 48x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT 5 13x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "5"
      FRAME d4 48x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT 8 13x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "8"
      FRAME d5 48x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT 2 13x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "2"
  INSTANCE Display/CountdownText 99x20 [HUG/HUG] · horizontal pad 0 gap 0 · {Format=Cooldown}
    TEXT countdown 99x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Resend in 0:47"
  FRAME spacer-grow 8x322 [FIXED/FILL]
  FRAME linkGroup 121x88 [HUG/HUG] · vertical pad 0 gap 0
    INSTANCE Action/Link 121x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
      TEXT label 121x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Change number"
    INSTANCE loginLink 87x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0 · of Action/Link
      TEXT label 87x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Go to log in"
  INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
    TEXT label 45x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Verify"
```

The code is **3 7 1 5 8 2**. Sample codes are distinct across the prototype so that no screen can be
mistaken for another's step: registration uses `371582` (Kavindu), `506294` (Lanka Events) and `813706`
(Sunil Bandara); code login `904627`, `268153`, `740931` and `639208`. The resend countdown reads 0:47;
when it runs out, *Resend code* takes its place (`1.3rs2`).

### `1.4` — Registration, details

**Reached from** `1.3`, `1.3rs2`  ·  **Leads to** `1.20` ("Terms of Service / Privacy Policy"), [M3](M3-discovery.md) `3.9` ("Create account")  ·  **Exits** back → `1.3`, ✕ → `1.1`

*In the demo:* the error walk: Create account → `1.4err1`.

```
FRAME 360x800 · vertical pad 6/16/16/16 gap 8 · fill color/bg/default
  FRAME topBar 328x52 [FILL/HUG] · horizontal pad 0/0/8/0 gap 0 · [standard, see header]
  TEXT screenTitle 179x32 [HUG/HUG] · fill color/text/primary · mobile/display · "Create account"
  TEXT step 64x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Step 4 of 4"
  INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Secure}
    TEXT label 65x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Password"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
      TEXT value 272x24 [FILL/HUG] · fill color/text/primary · mobile/body · "••••••••••"
      FRAME eye 24x24 [FIXED/FIXED]
        ELLIPSE Ellipse 20x12 [FIXED/FIXED] @2,6 · stroke color/text/secondary 1.5
        ELLIPSE Ellipse 7x7 [FIXED/FIXED] @9,9 · fill color/text/secondary
  INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Secure}
    TEXT label 121x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Confirm password"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
      TEXT value 272x24 [FILL/HUG] · fill color/text/primary · mobile/body · "••••••••••"
      FRAME eye 24x24 [FIXED/FIXED]
        ELLIPSE Ellipse 20x12 [FIXED/FIXED] @2,6 · stroke color/text/secondary 1.5
        ELLIPSE Ellipse 7x7 [FIXED/FIXED] @9,9 · fill color/text/secondary
  TEXT pwHelp 328x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "8–64 characters, spaces allowed."
  INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Default, Type=Text}
    TEXT label 103x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Email (optional)"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
      TEXT value 304x24 [FILL/HUG] · fill color/text/secondary · mobile/body · "you@example.com"
  INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Text}
    TEXT label 25x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "NIC"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
      TEXT value 304x24 [FILL/HUG] · fill color/text/primary · mobile/body · "200412345678"
  TEXT nicHelp 328x40 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "12 digits, or 9 digits + V or X — only the shape is checked."
  INSTANCE Input/DateTimeField 328x74 [FIXED/HUG] · vertical pad 0 gap 6 · {State=Filled}
    TEXT label 62x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Birthdate"
    FRAME field 328x48 [FILL/HUG] · horizontal pad 12 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
      TEXT value 292x24 [FILL/HUG] · fill color/text/primary · mobile/body · "2004-03-14"
      VECTOR calendar 12x12 [FIXED/FIXED] · stroke color/text/secondary 1.5
  INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Text}
    TEXT label 77x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Legal name"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
      TEXT value 304x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Kavindu Perera"
  INSTANCE Input/Checkbox 316x44 [HUG/HUG] · vertical pad 0 gap 6 · {State=Checked}
    FRAME row 316x44 [HUG/HUG] · horizontal pad 2/0/2/0 gap 12
      FRAME box 24x24 [FIXED/FIXED] · fill color/brand/primary · r4
        VECTOR check 12x10 [FIXED/FIXED] @6,8 · stroke color/text/inverse 2.5
      TEXT label 280x40 [FIXED/FIXED] · mobile/secondary · "I accept the Terms of Service and Privacy Policy"
        · run mobile/secondary "I accept the "
        · run mobile/secondary underline "Terms of Service"
        · run mobile/secondary " and "
        · run mobile/secondary underline "Privacy Policy"
  FRAME spacer-grow 8x1 [FIXED/FILL]
  INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
    TEXT label 118x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Create account"
```

**Email is optional** and Kavindu leaves it empty — the placeholder `you@example.com` is secondary
text. He adds `kavindu@example.com` later, from Settings; `1.10`, `1.8` and `1.11r2` show it. The NIC help
line promises *only the shape is checked*, and no copy on any screen implies a registry check. The birthdate
is 2004-03-14 — he is 22.

### `1.20` — Terms of Service and Privacy Policy

**Reached from** `1.4`, `1.4cnt`, `1.4e`, `1.4err1`, `1.4err2`, `1.4err3`, `1.4v`, `1.4x130`  ·  **Leads to** nothing  ·  **Exits** back → `1.4`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Terms & Privacy"
  FRAME content 360x744 [FILL/FILL] · vertical pad 24/16/24/16 gap 16
    TEXT version 162x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Version 1.0 — 1 August 2026"
    TEXT para1 328x120 [FIXED/HUG] · fill color/text/primary · mobile/body · "1. Using YouthLink / YouthLink connects youth job-seekers with verified local gigs. You must be 18 or older to register, and the details you provide must be your own."
    TEXT para2 328x120 [FIXED/HUG] · fill color/text/primary · mobile/body · "2. Your data / Your NIC is stored encrypted and never shown publicly. Phone numbers are shared only when an employer selects a worker for a gig — then the two of them can see each other's number."
    TEXT privTitle 328x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "3. Privacy Policy"
    TEXT privBody 328x192 [FIXED/HUG] · fill color/text/secondary · mobile/body · "Your NIC is encrypted and never shown publicly. There is no public directory — your profile is visible only to people you interact with through an application, listing, engagement or rating. Reports you file stay anonymous, permanently. Platform statistics are aggregates; we don't publish per-person activity."
```

Version and date, then the terms and the privacy policy in plain language. **Phone numbers are shared
both ways** once an employer selects a worker (`FR-APPLY-07`); the text used to say only the worker's number
was revealed. Reached from the underlined links in the details step's checkbox; the back chevron returns to
`1.4`.

## Registration — what can go wrong

One frame per failure the registration path can meet. Each shows
the field in its `Error` state **and** a `Feedback/FieldError` beneath it carrying the message; the
component's own built-in error line is hidden, because the message belongs to the situation, not to the
component. The two text-expansion and keyboard frames are specimens, not steps.

### `1.2err` — Registration, phone entry · number already registered

**Reached from** in the demo `1.2`  ·  **Leads to** `1.6` ("Go to log in")  ·  **Exits** back → `1.1`, ✕ → `1.1`

*In the demo:* the error walk: Send code → `1.3` (the number corrected).

```
FRAME 360x800 · vertical pad 6/16/24/16 gap 16 · fill color/bg/default
  FRAME topBar 328x44 [FILL/HUG] · horizontal pad 0 gap 0 · [standard, see header]
  TEXT screenTitle 179x32 [HUG/HUG] · fill color/text/primary · mobile/display · "Create account"
  TEXT step 63x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Step 2 of 4"
  INSTANCE Input/PhoneField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Error}
    TEXT Phone number 97x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Phone number"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/error 1 · r8
      FRAME prefix 56x48 [HUG/FILL] · horizontal pad 0/12/0/12 gap 0 · fill color/bg/subtle
        TEXT +94 32x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "+94"
      FRAME val 107x48 [HUG/FILL] · horizontal pad 0/0/0/12 gap 0
        TEXT 77 123 4567 95x24 [HUG/HUG] · fill color/text/primary · mobile/body · "77 123 4567"
  INSTANCE fieldError 296x60 [HUG/HUG] · horizontal pad 0 gap 0 · of Feedback/FieldError
    TEXT error 296x60 [FIXED/HUG] · fill color/state/danger · mobile/secondary · "This number is already registered. Log in instead — you can reset your password from there."
  FRAME spacer-grow 8x342 [FIXED/FILL]
  INSTANCE loginLink 87x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0 · of Action/Link
    TEXT label 87x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Go to log in"
  INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
    TEXT label 82x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Send code"
```

`FR-ACC-05`: one account per phone. The field is `{State=Error}` with a red border; the message says
what to do instead — log in, and reset the password from there if it is forgotten.

### `1.3err2` — Registration, code entry · code doesn't match

**Reached from** in the demo `1.3`  ·  **Leads to** `1.2` ("Change number"), `1.6` ("Go to log in")  ·  **Exits** back → `1.2`, ✕ → `1.1`

*In the demo:* the error walk: Verify → `1.3err1`.

```
FRAME 360x800 · vertical pad 6/16/24/16 gap 16 · fill color/bg/default
  FRAME topBar 328x44 [FILL/HUG] · horizontal pad 0 gap 0 · [standard, see header]
  TEXT screenTitle 179x32 [HUG/HUG] · fill color/text/primary · mobile/display · "Create account"
  TEXT step 64x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Step 3 of 4"
  TEXT sentTo 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "We sent a 6-digit code to +94 77 123 4567."
  INSTANCE Input/CodeInputNumeric 328x52 [FILL/HUG] · vertical pad 0 gap 8 · {State=Error}
    FRAME digits 328x52 [FILL/HUG] · horizontal pad 0 gap 8
      FRAME d0 48x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/error 1 · r8
        TEXT 3 14x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "3"
      FRAME d1 48x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/error 1 · r8
        TEXT 7 12x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "7"
      FRAME d2 48x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/error 1 · r8
        TEXT 1 10x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "1"
      FRAME d3 48x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/error 1 · r8
        TEXT 5 13x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "5"
      FRAME d4 48x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/error 1 · r8
        TEXT 2 13x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "2"
      FRAME d5 48x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/error 1 · r8
        TEXT 8 13x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "8"
  INSTANCE fieldError 296x40 [HUG/HUG] · horizontal pad 0 gap 0 · of Feedback/FieldError
    TEXT error 296x40 [FIXED/HUG] · fill color/state/danger · mobile/secondary · "That code doesn't match. Check the 6 digits and try again."
  INSTANCE Display/CountdownText 99x20 [HUG/HUG] · horizontal pad 0 gap 0 · {Format=Cooldown}
    TEXT countdown 99x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Resend in 0:47"
  FRAME spacer-grow 8x266 [FIXED/FILL]
  FRAME linkGroup 121x88 [HUG/HUG] · vertical pad 0 gap 0
    INSTANCE Action/Link 121x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
      TEXT label 121x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Change number"
    INSTANCE loginLink 87x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0 · of Action/Link
      TEXT label 87x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Go to log in"
  INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
    TEXT label 45x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Verify"
```

A mistyped code: **3 7 1 5 2 8**, the last two digits swapped. Verify stays enabled — the next
attempt may be right.

### `1.3err1` — Registration, code entry · code no longer valid

**Reached from** in the demo `1.3err2`  ·  **Leads to** `1.3` ("Resend code"), `1.2` ("Change number"), `1.6` ("Go to log in")  ·  **Exits** back → `1.2`, ✕ → `1.1`

*In the demo:* the error walk: Resend code → `1.3rs2`.

```
FRAME 360x800 · vertical pad 6/16/24/16 gap 16 · fill color/bg/default
  FRAME topBar 328x44 [FILL/HUG] · horizontal pad 0 gap 0 · [standard, see header]
  TEXT screenTitle 179x32 [HUG/HUG] · fill color/text/primary · mobile/display · "Create account"
  TEXT step 64x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Step 3 of 4"
  TEXT sentTo 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "We sent a 6-digit code to +94 77 123 4567."
  INSTANCE Input/CodeInputNumeric 328x52 [FILL/HUG] · vertical pad 0 gap 8 · {State=Error}
    FRAME digits 328x52 [FILL/HUG] · horizontal pad 0 gap 8
      FRAME d0 48x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/error 1 · r8
        TEXT 3 14x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "3"
      FRAME d1 48x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/error 1 · r8
        TEXT 7 12x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "7"
      FRAME d2 48x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/error 1 · r8
        TEXT 1 10x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "1"
      FRAME d3 48x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/error 1 · r8
        TEXT 5 13x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "5"
      FRAME d4 48x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/error 1 · r8
        TEXT 8 13x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "8"
      FRAME d5 48x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/error 1 · r8
        TEXT 2 13x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "2"
  INSTANCE fieldError 296x40 [HUG/HUG] · horizontal pad 0 gap 0 · of Feedback/FieldError
    TEXT error 296x40 [FIXED/HUG] · fill color/state/danger · mobile/secondary · "This code is no longer valid. Tap Resend for a new one."
  INSTANCE resendLink 99x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0 · of Action/Link
    TEXT label 99x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Resend code"
  FRAME spacer-grow 8x242 [FIXED/FILL]
  FRAME linkGroup 121x88 [HUG/HUG] · vertical pad 0 gap 0
    INSTANCE Action/Link 121x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
      TEXT label 121x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Change number"
    INSTANCE loginLink 87x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0 · of Action/Link
      TEXT label 87x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Go to log in"
  INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/subtle · stroke color/border/default 1 · r8 · {Style=Primary, State=Disabled}
    TEXT label 45x24 [HUG/HUG] · fill color/text/secondary · mobile/body-medium · "Verify"
```

The same code as `1.3`, correct but **expired**. Verify is `{State=Disabled}` and the message says why
and what to do: *Tap Resend for a new one*. The countdown is replaced by the Resend link because the
cooldown has passed.

### `1.3rs2` — Registration, code entry · resend available

**Reached from** in the demo `1.3err1`  ·  **Leads to** `1.3` ("Resend code"), `1.2` ("Change number"), `1.6` ("Go to log in"), `1.4` ("Verify")  ·  **Exits** back → `1.2`, ✕ → `1.1`

```
FRAME 360x800 · vertical pad 6/16/24/16 gap 16 · fill color/bg/default
  FRAME topBar 328x44 [FILL/HUG] · horizontal pad 0 gap 0 · [standard, see header]
  TEXT screenTitle 179x32 [HUG/HUG] · fill color/text/primary · mobile/display · "Create account"
  TEXT step 64x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Step 3 of 4"
  TEXT sentTo 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "We sent a 6-digit code to +94 77 123 4567."
  INSTANCE Input/CodeInputNumeric 328x52 [FILL/HUG] · vertical pad 0 gap 8 · {State=Filled}
    FRAME digits 328x52 [FILL/HUG] · horizontal pad 0 gap 8
      FRAME d0 48x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT 3 14x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "3"
      FRAME d1 48x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT 7 12x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "7"
      FRAME d2 48x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT 1 10x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "1"
      FRAME d3 48x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT 5 13x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "5"
      FRAME d4 48x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT 8 13x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "8"
      FRAME d5 48x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT 2 13x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "2"
  INSTANCE resendLink 99x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0 · of Action/Link
    TEXT label 99x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Resend code"
  FRAME spacer-grow 8x298 [FIXED/FILL]
  FRAME linkGroup 121x88 [HUG/HUG] · vertical pad 0 gap 0
    INSTANCE Action/Link 121x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
      TEXT label 121x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Change number"
    INSTANCE loginLink 87x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0 · of Action/Link
      TEXT label 87x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Go to log in"
  INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
    TEXT label 45x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Verify"
```

The cooldown has elapsed and nothing has gone wrong: `Resend code` replaces the countdown, and the
code field is still filled.

### `1.4err1` — Registration, details · NIC already registered

**Reached from** in the demo `1.4`  ·  **Leads to** `1.20` ("Terms of Service / Privacy Policy"), `1.6` ("Go to log in")  ·  **Exits** back → `1.3`, ✕ → `1.1`

*In the demo:* the error walk: Create account → `1.4err2`.

```
FRAME 360x800 · vertical pad 6/16/24/16 gap 8 · fill color/bg/default
  FRAME topBar 328x44 [FILL/HUG] · horizontal pad 0 gap 0 · [standard, see header]
  INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Default, Type=Text}
    TEXT label 103x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Email (optional)"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
      TEXT value 304x24 [FILL/HUG] · fill color/text/secondary · mobile/body · "you@example.com"
  INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Error, Type=Text}
    TEXT label 25x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "NIC"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/error 1 · r8
      TEXT value 304x24 [FILL/HUG] · fill color/text/primary · mobile/body · "200412345678"
  INSTANCE fieldError 296x40 [HUG/HUG] · horizontal pad 0 gap 0 · of Feedback/FieldError
    TEXT error 296x40 [FIXED/HUG] · fill color/state/danger · mobile/secondary · "This NIC is already registered. You can log in instead, or check the number for a typo."
  INSTANCE Input/DateTimeField 328x74 [FIXED/HUG] · vertical pad 0 gap 6 · {State=Filled}
    TEXT label 62x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Birthdate"
    FRAME field 328x48 [FILL/HUG] · horizontal pad 12 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
      TEXT value 292x24 [FILL/HUG] · fill color/text/primary · mobile/body · "2004-03-14"
      VECTOR calendar 12x12 [FIXED/FIXED] · stroke color/text/secondary 1.5
  INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Text}
    TEXT label 77x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Legal name"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
      TEXT value 304x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Kavindu Perera"
  INSTANCE Input/Checkbox 316x44 [HUG/HUG] · vertical pad 0 gap 6 · {State=Checked}
    FRAME row 316x44 [HUG/HUG] · horizontal pad 2/0/2/0 gap 12
      FRAME box 24x24 [FIXED/FIXED] · fill color/brand/primary · r4
        VECTOR check 12x10 [FIXED/FIXED] @6,8 · stroke color/text/inverse 2.5
      TEXT label 280x40 [FIXED/FIXED] · mobile/secondary · "I accept the Terms of Service and Privacy Policy"
        · run mobile/secondary "I accept the "
        · run mobile/secondary underline "Terms of Service"
        · run mobile/secondary " and "
        · run mobile/secondary underline "Privacy Policy"
  FRAME spacer-grow 8x188 [FIXED/FILL]
  INSTANCE loginLink 87x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0 · of Action/Link
    TEXT label 87x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Go to log in"
  INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
    TEXT label 118x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Create account"
```

`FR-ACC-05` again, for the NIC. The message does not say whose account holds the number, and offers
the log-in link in case it is the person's own.

### `1.4err2` — Registration, details · under 18 (scrolled)

**Reached from** in the demo `1.4err1`  ·  **Leads to** `1.20` ("Terms of Service / Privacy Policy")  ·  **Exits** back → `1.3`, ✕ → `1.1`

*In the demo:* the error walk: Create account → `1.4err3`.

```
FRAME 360x800 · vertical pad 6/16/24/16 gap 8 · fill color/bg/default
  FRAME topBar 328x44 [FILL/HUG] · horizontal pad 0 gap 0 · [standard, see header]
  INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Default, Type=Text}
    TEXT label 103x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Email (optional)"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
      TEXT value 304x24 [FILL/HUG] · fill color/text/secondary · mobile/body · "you@example.com"
  INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Text}
    TEXT label 25x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "NIC"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
      TEXT value 304x24 [FILL/HUG] · fill color/text/primary · mobile/body · "200412345678"
  TEXT nicHelp 328x40 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "12 digits, or 9 digits + V or X — only the shape is checked."
  INSTANCE Input/DateTimeField 328x74 [FIXED/HUG] · vertical pad 0 gap 6 · {State=Error}
    TEXT label 62x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Birthdate"
    FRAME field 328x48 [FILL/HUG] · horizontal pad 12 gap 0 · fill color/bg/default · stroke color/border/error 1.5 · r8
      TEXT value 292x24 [FILL/HUG] · fill color/text/primary · mobile/body · "2010-03-14"
      VECTOR calendar 12x12 [FIXED/FIXED] · stroke color/text/secondary 1.5
  INSTANCE fieldError 296x40 [HUG/HUG] · horizontal pad 0 gap 0 · of Feedback/FieldError
    TEXT error 296x40 [FIXED/HUG] · fill color/state/danger · mobile/secondary · "YouthLink is for people aged 18 and over. Please check your birthdate is right."
  INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Text}
    TEXT label 77x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Legal name"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
      TEXT value 304x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Kavindu Perera"
  INSTANCE Input/Checkbox 316x44 [HUG/HUG] · vertical pad 0 gap 6 · {State=Checked}
    FRAME row 316x44 [HUG/HUG] · horizontal pad 2/0/2/0 gap 12
      FRAME box 24x24 [FIXED/FIXED] · fill color/brand/primary · r4
        VECTOR check 12x10 [FIXED/FIXED] @6,8 · stroke color/text/inverse 2.5
      TEXT label 280x40 [FIXED/FIXED] · mobile/secondary · "I accept the Terms of Service and Privacy Policy"
        · run mobile/secondary "I accept the "
        · run mobile/secondary underline "Terms of Service"
        · run mobile/secondary " and "
        · run mobile/secondary underline "Privacy Policy"
  FRAME spacer-grow 8x192 [FIXED/FILL]
  INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
    TEXT label 118x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Create account"
```

**The age gate** (`FR-ACC-03`): 2010-03-14 makes the applicant 16. The typed date stays in
`color/text/primary` — it is an entered value, not a placeholder — inside the `Error` border. Scrolled, so
the password fields above are off screen.

### `1.4err3` — Registration, details · terms not accepted (scrolled)

**Reached from** in the demo `1.4err2`  ·  **Leads to** `1.20` ("Terms of Service / Privacy Policy")  ·  **Exits** back → `1.3`, ✕ → `1.1`

*In the demo:* the error walk: Create account → `1.4cnt`.

```
FRAME 360x800 · vertical pad 6/16/24/16 gap 8 · fill color/bg/default
  FRAME topBar 328x44 [FILL/HUG] · horizontal pad 0 gap 0 · [standard, see header]
  INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Default, Type=Text}
    TEXT label 103x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Email (optional)"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
      TEXT value 304x24 [FILL/HUG] · fill color/text/secondary · mobile/body · "you@example.com"
  INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Text}
    TEXT label 25x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "NIC"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
      TEXT value 304x24 [FILL/HUG] · fill color/text/primary · mobile/body · "200412345678"
  TEXT nicHelp 328x40 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "12 digits, or 9 digits + V or X — only the shape is checked."
  INSTANCE Input/DateTimeField 328x74 [FIXED/HUG] · vertical pad 0 gap 6 · {State=Filled}
    TEXT label 62x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Birthdate"
    FRAME field 328x48 [FILL/HUG] · horizontal pad 12 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
      TEXT value 292x24 [FILL/HUG] · fill color/text/primary · mobile/body · "2004-03-14"
      VECTOR calendar 12x12 [FIXED/FIXED] · stroke color/text/secondary 1.5
  INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Text}
    TEXT label 77x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Legal name"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
      TEXT value 304x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Kavindu Perera"
  INSTANCE Input/Checkbox 316x44 [HUG/HUG] · vertical pad 0 gap 6 · {State=Unchecked}
    FRAME row 316x44 [HUG/HUG] · horizontal pad 2/0/2/0 gap 12
      FRAME box 24x24 [FIXED/FIXED] · fill color/bg/default · stroke color/border/default 1.5 · r4
      TEXT label 280x40 [FIXED/FIXED] · mobile/secondary · "I accept the Terms of Service and Privacy Policy"
        · run mobile/secondary "I accept the "
        · run mobile/secondary underline "Terms of Service"
        · run mobile/secondary " and "
        · run mobile/secondary underline "Privacy Policy"
  INSTANCE fieldError 296x40 [HUG/HUG] · horizontal pad 0 gap 0 · of Feedback/FieldError
    TEXT error 296x40 [FIXED/HUG] · fill color/state/danger · mobile/secondary · "Please accept the Terms of Service and Privacy Policy to continue."
  FRAME spacer-grow 8x192 [FIXED/FILL]
  INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
    TEXT label 118x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Create account"
```

Terms not accepted: the checkbox is `{State=Unchecked}` and the message sits directly beneath it.
Create account stays enabled so that the attempt can produce this explanation.

### `1.4cnt` — Registration, details · legal name near cap (scrolled)

**Reached from** in the demo `1.4err3`  ·  **Leads to** `1.20` ("Terms of Service / Privacy Policy")  ·  **Exits** back → `1.3`, ✕ → `1.1`

*In the demo:* the error walk: Create account → `1.6`.

```
FRAME 360x800 · vertical pad 6/16/24/16 gap 8 · fill color/bg/default
  FRAME topBar 328x44 [FILL/HUG] · horizontal pad 0 gap 0 · [standard, see header]
  INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Default, Type=Text}
    TEXT label 103x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Email (optional)"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
      TEXT value 304x24 [FILL/HUG] · fill color/text/secondary · mobile/body · "you@example.com"
  INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Text}
    TEXT label 25x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "NIC"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
      TEXT value 304x24 [FILL/HUG] · fill color/text/primary · mobile/body · "200412345678"
  TEXT nicHelp 328x40 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "12 digits, or 9 digits + V or X — only the shape is checked."
  INSTANCE Input/DateTimeField 328x74 [FIXED/HUG] · vertical pad 0 gap 6 · {State=Filled}
    TEXT label 62x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Birthdate"
    FRAME field 328x48 [FILL/HUG] · horizontal pad 12 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
      TEXT value 292x24 [FILL/HUG] · fill color/text/primary · mobile/body · "2004-03-14"
      VECTOR calendar 12x12 [FIXED/FIXED] · stroke color/text/secondary 1.5
  INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Text}
    TEXT label 77x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Legal name"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
      TEXT nameValue 304x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Kavindu Anuruddha Bandara Perera Wickramasinghe Jayasuriya Abeywardena Senanayake Silva Jr"
  TEXT charCounter 328x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · align right · "90 / 100"
  INSTANCE Input/Checkbox 316x44 [HUG/HUG] · vertical pad 0 gap 6 · {State=Checked}
    FRAME row 316x44 [HUG/HUG] · horizontal pad 2/0/2/0 gap 12
      FRAME box 24x24 [FIXED/FIXED] · fill color/brand/primary · r4
        VECTOR check 12x10 [FIXED/FIXED] @6,8 · stroke color/text/inverse 2.5
      TEXT label 280x40 [FIXED/FIXED] · mobile/secondary · "I accept the Terms of Service and Privacy Policy"
        · run mobile/secondary "I accept the "
        · run mobile/secondary underline "Terms of Service"
        · run mobile/secondary " and "
        · run mobile/secondary underline "Privacy Policy"
  FRAME spacer-grow 8x216 [FIXED/FILL]
  INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
    TEXT label 118x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Create account"
```

The legal-name field **counts** as the 100-character cap approaches (*90 / 100*). Input is blocked at
the cap rather than rejected after it, so there is no error state for an over-long name (`FR-ACC-01` as
amended 2026-09-16).

### `1.4k` — Registration, details · keyboard-open specimen (not in any flow)

**Reached from** nowhere — a specimen  ·  **Leads to** nothing  ·  **Exits** back → `1.3`

```
FRAME 360x800 · vertical pad 6/16/0/16 gap 12 · fill color/bg/default
  FRAME topBar 328x48 [FILL/HUG] · horizontal pad 0/0/4/0 gap 0 · [standard, see header]
  TEXT screenTitle 179x32 [HUG/HUG] · fill color/text/primary · mobile/display · "Create account"
  TEXT step 64x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Step 4 of 4"
  INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Secure}
    TEXT label 65x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Password"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/brand/primary 2 · r8
      TEXT value 272x24 [FILL/HUG] · fill color/text/primary · mobile/body · "••••••••••"
      FRAME eye 24x24 [FIXED/FIXED]
        ELLIPSE Ellipse 20x12 [FIXED/FIXED] @2,6 · stroke color/text/secondary 1.5
        ELLIPSE Ellipse 7x7 [FIXED/FIXED] @9,9 · fill color/text/secondary
  INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Secure}
    TEXT label 121x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Confirm password"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
      TEXT value 272x24 [FILL/HUG] · fill color/text/primary · mobile/body · "••••••••••"
      FRAME eye 24x24 [FIXED/FIXED]
        ELLIPSE Ellipse 20x12 [FIXED/FIXED] @2,6 · stroke color/text/secondary 1.5
        ELLIPSE Ellipse 7x7 [FIXED/FIXED] @9,9 · fill color/text/secondary
  INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Default, Type=Text}
    TEXT label 103x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Email (optional)"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
      TEXT value 304x24 [FILL/HUG] · fill color/text/secondary · mobile/body · "you@example.com"
  INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Text}
    TEXT label 25x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "NIC"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
      TEXT value 304x24 [FILL/HUG] · fill color/text/primary · mobile/body · "200412345678"
  FRAME spacer-grow 8x326 [FIXED/FILL]
  INSTANCE Action/Button 328x48 [FIXED/FIXED] @16,480 · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
    TEXT label 118x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Create account"
  INSTANCE OS/Keyboard 360x260 [FIXED/FIXED] @0,540 · fill gray/200
    FRAME key 30x42 [FIXED/FIXED] @12,14 · fill color/bg/default · r5
      TEXT q 10x19 [FIXED/FIXED] @10,12 · fill color/text/primary · (no style) · "q"
    FRAME key 30x42 [FIXED/FIXED] @46,14 · fill color/bg/default · r5
      TEXT w 13x19 [FIXED/FIXED] @9,12 · fill color/text/primary · (no style) · "w"
    FRAME key 30x42 [FIXED/FIXED] @80,14 · fill color/bg/default · r5
      TEXT e 10x19 [FIXED/FIXED] @10,12 · fill color/text/primary · (no style) · "e"
    FRAME key 30x42 [FIXED/FIXED] @114,14 · fill color/bg/default · r5
      TEXT r 6x19 [FIXED/FIXED] @12,12 · fill color/text/primary · (no style) · "r"
    FRAME key 30x42 [FIXED/FIXED] @148,14 · fill color/bg/default · r5
      TEXT t 6x19 [FIXED/FIXED] @12,12 · fill color/text/primary · (no style) · "t"
    FRAME key 30x42 [FIXED/FIXED] @182,14 · fill color/bg/default · r5
      TEXT y 9x19 [FIXED/FIXED] @11,12 · fill color/text/primary · (no style) · "y"
    FRAME key 30x42 [FIXED/FIXED] @216,14 · fill color/bg/default · r5
      TEXT u 10x19 [FIXED/FIXED] @10,12 · fill color/text/primary · (no style) · "u"
    FRAME key 30x42 [FIXED/FIXED] @250,14 · fill color/bg/default · r5
      TEXT i 4x19 [FIXED/FIXED] @13,12 · fill color/text/primary · (no style) · "i"
    FRAME key 30x42 [FIXED/FIXED] @284,14 · fill color/bg/default · r5
      TEXT o 10x19 [FIXED/FIXED] @10,12 · fill color/text/primary · (no style) · "o"
    FRAME key 30x42 [FIXED/FIXED] @318,14 · fill color/bg/default · r5
      TEXT p 10x19 [FIXED/FIXED] @10,12 · fill color/text/primary · (no style) · "p"
    FRAME key 30x42 [FIXED/FIXED] @29,64 · fill color/bg/default · r5
      TEXT a 10x19 [FIXED/FIXED] @10,12 · fill color/text/primary · (no style) · "a"
    FRAME key 30x42 [FIXED/FIXED] @63,64 · fill color/bg/default · r5
      TEXT s 9x19 [FIXED/FIXED] @11,12 · fill color/text/primary · (no style) · "s"
    FRAME key 30x42 [FIXED/FIXED] @97,64 · fill color/bg/default · r5
      TEXT d 10x19 [FIXED/FIXED] @10,12 · fill color/text/primary · (no style) · "d"
    FRAME key 30x42 [FIXED/FIXED] @131,64 · fill color/bg/default · r5
      TEXT f 6x19 [FIXED/FIXED] @12,12 · fill color/text/primary · (no style) · "f"
    FRAME key 30x42 [FIXED/FIXED] @165,64 · fill color/bg/default · r5
      TEXT g 10x19 [FIXED/FIXED] @10,12 · fill color/text/primary · (no style) · "g"
    FRAME key 30x42 [FIXED/FIXED] @199,64 · fill color/bg/default · r5
      TEXT h 10x19 [FIXED/FIXED] @10,12 · fill color/text/primary · (no style) · "h"
    FRAME key 30x42 [FIXED/FIXED] @233,64 · fill color/bg/default · r5
      TEXT j 4x19 [FIXED/FIXED] @13,12 · fill color/text/primary · (no style) · "j"
    FRAME key 30x42 [FIXED/FIXED] @267,64 · fill color/bg/default · r5
      TEXT k 9x19 [FIXED/FIXED] @11,12 · fill color/text/primary · (no style) · "k"
    FRAME key 30x42 [FIXED/FIXED] @301,64 · fill color/bg/default · r5
      TEXT l 4x19 [FIXED/FIXED] @13,12 · fill color/text/primary · (no style) · "l"
    FRAME key 30x42 [FIXED/FIXED] @63,114 · fill color/bg/default · r5
      TEXT z 9x19 [FIXED/FIXED] @11,12 · fill color/text/primary · (no style) · "z"
    FRAME key 30x42 [FIXED/FIXED] @97,114 · fill color/bg/default · r5
      TEXT x 9x19 [FIXED/FIXED] @11,12 · fill color/text/primary · (no style) · "x"
    FRAME key 30x42 [FIXED/FIXED] @131,114 · fill color/bg/default · r5
      TEXT c 9x19 [FIXED/FIXED] @11,12 · fill color/text/primary · (no style) · "c"
    FRAME key 30x42 [FIXED/FIXED] @165,114 · fill color/bg/default · r5
      TEXT v 9x19 [FIXED/FIXED] @11,12 · fill color/text/primary · (no style) · "v"
    FRAME key 30x42 [FIXED/FIXED] @199,114 · fill color/bg/default · r5
      TEXT b 10x19 [FIXED/FIXED] @10,12 · fill color/text/primary · (no style) · "b"
    FRAME key 30x42 [FIXED/FIXED] @233,114 · fill color/bg/default · r5
      TEXT n 10x19 [FIXED/FIXED] @10,12 · fill color/text/primary · (no style) · "n"
    FRAME key 30x42 [FIXED/FIXED] @267,114 · fill color/bg/default · r5
      TEXT m 14x19 [FIXED/FIXED] @8,12 · fill color/text/primary · (no style) · "m"
    FRAME key-space 180x42 [FIXED/FIXED] @90,164 · fill color/bg/default · r5
```

**A specimen, not a step.** The same form with the system keyboard open, to show that the Create
account button stays above it (`@16,480`) rather than being hidden. It is in no flow.

### `1.4x130` — Registration, details · 130% text expansion (specimen, not in the demo)

**Reached from** nowhere — a specimen  ·  **Leads to** `1.20` ("Terms of Service / Privacy Policy")  ·  **Exits** back → `1.3`, ✕ → `1.1`

```
FRAME 360x800 · vertical pad 6/16/16/16 gap 8 · fill color/bg/default
  FRAME topBar 328x52 [FILL/HUG] · horizontal pad 0/0/8/0 gap 0 · [standard, see header]
  TEXT screenTitle 231x42 [HUG/HUG] · fill color/text/primary · (no style) · "Create account"
  TEXT step 85x21 [HUG/HUG] · fill color/text/secondary · (no style) · "Step 4 of 4"
  INSTANCE Input/TextField 328x74 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Secure}
    TEXT label 83x22 [HUG/HUG] · fill color/text/secondary · (no style) · "Password"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
      TEXT value 272x25 [FILL/HUG] · fill color/text/primary · (no style) · "••••••••••"
      FRAME eye 24x24 [FIXED/FIXED]
        ELLIPSE Ellipse 20x12 [FIXED/FIXED] @2,6 · stroke color/text/secondary 1.5
        ELLIPSE Ellipse 7x7 [FIXED/FIXED] @9,9 · fill color/text/secondary
  INSTANCE Input/TextField 328x74 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Secure}
    TEXT label 156x22 [HUG/HUG] · fill color/text/secondary · (no style) · "Confirm password"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
      TEXT value 272x25 [FILL/HUG] · fill color/text/primary · (no style) · "••••••••••"
      FRAME eye 24x24 [FIXED/FIXED]
        ELLIPSE Ellipse 20x12 [FIXED/FIXED] @2,6 · stroke color/text/secondary 1.5
        ELLIPSE Ellipse 7x7 [FIXED/FIXED] @9,9 · fill color/text/secondary
  TEXT pwHelp 328x21 [FILL/HUG] · fill color/text/secondary · (no style) · "8–64 characters, spaces allowed."
  INSTANCE Input/TextField 328x74 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Default, Type=Text}
    TEXT label 132x22 [HUG/HUG] · fill color/text/secondary · (no style) · "Email (optional)"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
      TEXT value 304x25 [FILL/HUG] · fill color/text/secondary · (no style) · "you@example.com"
  INSTANCE Input/TextField 328x74 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Text}
    TEXT label 32x22 [HUG/HUG] · fill color/text/secondary · (no style) · "NIC"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
      TEXT value 304x25 [FILL/HUG] · fill color/text/primary · (no style) · "200412345678"
  TEXT nicHelp 328x52 [FILL/HUG] · fill color/text/secondary · (no style) · "12 digits, or 9 digits + V or X — only the shape is checked."
  INSTANCE Input/DateTimeField 328x87 [FIXED/HUG] · vertical pad 0 gap 6 · {State=Filled}
    TEXT label 79x26 [HUG/HUG] · fill color/text/secondary · (no style) · "Birthdate"
    FRAME field 328x55 [FILL/HUG] · horizontal pad 12 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
      TEXT value 292x31 [FILL/HUG] · fill color/text/primary · (no style) · "2004-03-14"
      VECTOR calendar 12x12 [FIXED/FIXED] · stroke color/text/secondary 1.5
  INSTANCE Input/TextField 328x74 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Text}
    TEXT label 98x22 [HUG/HUG] · fill color/text/secondary · (no style) · "Legal name"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
      TEXT value 304x25 [FILL/HUG] · fill color/text/primary · (no style) · "Kavindu Perera"
  INSTANCE Input/Checkbox 316x44 [HUG/HUG] · vertical pad 0 gap 6 · {State=Checked}
    FRAME row 316x44 [HUG/HUG] · horizontal pad 2/0/2/0 gap 12
      FRAME box 24x24 [FIXED/FIXED] · fill color/brand/primary · r4
        VECTOR check 12x10 [FIXED/FIXED] @6,8 · stroke color/text/inverse 2.5
      TEXT label 280x40 [FIXED/FIXED] · (no style) · "I accept the Terms of Service and Privacy Policy"
        · run Inter Regular "I accept the "
        · run Inter Regular underline "Terms of Service"
        · run Inter Regular " and "
        · run Inter Regular underline "Privacy Policy"
  FRAME spacer-grow 8x1 [FIXED/FILL]
  INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
    TEXT label 155x31 [HUG/HUG] · fill color/text/inverse · (no style) · "Create account"
```

**A specimen, not a step.** `1.4` with every text size at 130%, the text-expansion check. The content runs to 848 px, so the frame scrolls and the button is below the fold — which is what
130% does to a form already this full, and the reason the specimen exists.

## Registration — employer and verifier

The employer path has **five** steps: the fifth asks how the
account will post (`FR-ACC-02`) — as an individual or household, or as a business with a name and an
optional bio. The verifier path has four, like the worker's; what makes a verifier is what they do after
signing up (M8), not an extra step.

### `1.1e` — Role selection · Employer selected

**Reached from** role selection with Local Business/Employer chosen — the employer path starts here  ·  **Leads to** `1.6e` ("Go to log in"), `1.2e` ("Continue")

```
FRAME 360x800 · vertical pad 6/16/24/16 gap 16 · fill color/bg/default
  FRAME topBarGhost 44x44 [FIXED/FIXED] · [standard, see header]
  TEXT screenTitle 179x32 [HUG/HUG] · fill color/text/primary · mobile/display · "Create account"
  TEXT step 61x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Step 1 of 5"
  INSTANCE Input/RoleOption 328x78 [FIXED/HUG] · horizontal pad 16 gap 12 · fill color/bg/default · stroke color/border/default 1.5 · r8 · {State=Default}
    FRAME radio 20x20 [FIXED/FIXED]
      ELLIPSE ring 20x20 [FIXED/FIXED] @0,0 · stroke color/border/default 1.5
    FRAME copy 192x46 [HUG/HUG] · vertical pad 0 gap 2
      TEXT title 138x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Youth Job-Seeker"
      TEXT description 192x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Find part-time work and gigs"
  INSTANCE Input/RoleOption 328x78 [FIXED/HUG] · horizontal pad 16 gap 12 · fill color/bg/default · stroke color/brand/primary 2 · r8 · {State=Selected}
    FRAME radio 20x20 [FIXED/FIXED]
      ELLIPSE ring 20x20 [FIXED/FIXED] @0,0 · stroke color/brand/primary 2
      ELLIPSE dot 10x10 [FIXED/FIXED] @5,5 · fill color/brand/primary
    FRAME copy 191x46 [HUG/HUG] · vertical pad 0 gap 2
      TEXT title 191x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Local Business/Employer"
      TEXT description 176x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Post gigs and hire workers"
  INSTANCE Input/RoleOption 328x78 [FIXED/HUG] · horizontal pad 16 gap 12 · fill color/bg/default · stroke color/border/default 1.5 · r8 · {State=Default}
    FRAME radio 20x20 [FIXED/FIXED]
      ELLIPSE ring 20x20 [FIXED/FIXED] @0,0 · stroke color/border/default 1.5
    FRAME copy 180x46 [HUG/HUG] · vertical pad 0 gap 2
      TEXT title 148x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Community Verifier"
      TEXT description 180x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Vouch for people you know"
  FRAME spacer-grow 8x224 [FIXED/FILL]
  INSTANCE Action/Link 87x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
    TEXT label 87x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Go to log in"
  INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
    TEXT label 70x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Continue"
```

The employer path: *Step 1 of 5*, with `Local Business/Employer` selected.

### `1.2e` — Registration, phone entry · employer

**Reached from** `1.1e`, `1.3e`  ·  **Leads to** `1.6e` ("Go to log in"), `1.3e` ("Send code")  ·  **Exits** back → `1.1e`, ✕ → `1.1e`

```
FRAME 360x800 · vertical pad 6/16/24/16 gap 16 · fill color/bg/default
  FRAME topBar 328x44 [FILL/HUG] · horizontal pad 0 gap 0 · [standard, see header]
  TEXT screenTitle 179x32 [HUG/HUG] · fill color/text/primary · mobile/display · "Create account"
  TEXT step 63x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Step 2 of 5"
  INSTANCE Input/PhoneField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Default}
    TEXT Phone number 97x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Phone number"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
      FRAME prefix 56x48 [HUG/FILL] · horizontal pad 0/12/0/12 gap 0 · fill color/bg/subtle
        TEXT +94 32x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "+94"
      FRAME val 105x48 [HUG/FILL] · horizontal pad 0/0/0/12 gap 0
        TEXT 7X XXX XXXX 93x24 [HUG/HUG] · fill color/text/primary · mobile/body · "11 234 5678"
  FRAME spacer-grow 8x418 [FIXED/FILL]
  INSTANCE loginLink 87x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0 · of Action/Link
    TEXT label 87x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Go to log in"
  INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
    TEXT label 82x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Send code"
```

Lanka Events' number, **+94 11 234 5678** — a Colombo number.

### `1.3e` — Registration, code entry · employer

**Reached from** `1.2e`  ·  **Leads to** `1.2e` ("Change number"), `1.6e` ("Go to log in"), `1.4e` ("Verify")  ·  **Exits** back → `1.2e`, ✕ → `1.1e`

```
FRAME 360x800 · vertical pad 6/16/24/16 gap 16 · fill color/bg/default
  FRAME topBar 328x44 [FILL/HUG] · horizontal pad 0 gap 0 · [standard, see header]
  TEXT screenTitle 179x32 [HUG/HUG] · fill color/text/primary · mobile/display · "Create account"
  TEXT step 63x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Step 3 of 5"
  TEXT sentTo 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "We sent a 6-digit code to +94 11 234 5678."
  INSTANCE Input/CodeInputNumeric 328x52 [FILL/HUG] · vertical pad 0 gap 8 · {State=Filled}
    FRAME digits 328x52 [FILL/HUG] · horizontal pad 0 gap 8
      FRAME d0 48x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT 5 13x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "5"
      FRAME d1 48x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT 0 14x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "0"
      FRAME d2 48x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT 6 13x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "6"
      FRAME d3 48x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT 2 13x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "2"
      FRAME d4 48x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT 9 13x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "9"
      FRAME d5 48x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT 4 14x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "4"
  INSTANCE Display/CountdownText 99x20 [HUG/HUG] · horizontal pad 0 gap 0 · {Format=Cooldown}
    TEXT countdown 99x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Resend in 0:47"
  FRAME spacer-grow 8x322 [FIXED/FILL]
  FRAME linkGroup 121x88 [HUG/HUG] · vertical pad 0 gap 0
    INSTANCE Action/Link 121x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
      TEXT label 121x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Change number"
    INSTANCE loginLink 87x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0 · of Action/Link
      TEXT label 87x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Go to log in"
  INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
    TEXT label 45x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Verify"
```

Code **5 0 6 2 9 4**.

### `1.4e` — Registration, details · employer

**Reached from** `1.3e`  ·  **Leads to** `1.20` ("Terms of Service / Privacy Policy"), `1.5` ("Create account")  ·  **Exits** back → `1.3e`, ✕ → `1.1e`

```
FRAME 360x800 · vertical pad 6/16/16/16 gap 8 · fill color/bg/default
  FRAME topBar 328x52 [FILL/HUG] · horizontal pad 0/0/8/0 gap 0 · [standard, see header]
  TEXT screenTitle 179x32 [HUG/HUG] · fill color/text/primary · mobile/display · "Create account"
  TEXT step 63x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Step 4 of 5"
  INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Secure}
    TEXT label 65x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Password"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
      TEXT value 272x24 [FILL/HUG] · fill color/text/primary · mobile/body · "••••••••••"
      FRAME eye 24x24 [FIXED/FIXED]
        ELLIPSE Ellipse 20x12 [FIXED/FIXED] @2,6 · stroke color/text/secondary 1.5
        ELLIPSE Ellipse 7x7 [FIXED/FIXED] @9,9 · fill color/text/secondary
  INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Secure}
    TEXT label 121x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Confirm password"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
      TEXT value 272x24 [FILL/HUG] · fill color/text/primary · mobile/body · "••••••••••"
      FRAME eye 24x24 [FIXED/FIXED]
        ELLIPSE Ellipse 20x12 [FIXED/FIXED] @2,6 · stroke color/text/secondary 1.5
        ELLIPSE Ellipse 7x7 [FIXED/FIXED] @9,9 · fill color/text/secondary
  TEXT pwHelp 328x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "8–64 characters, spaces allowed."
  INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Text}
    TEXT label 103x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Email (optional)"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
      TEXT value 304x24 [FILL/HUG] · fill color/text/primary · mobile/body · "hello@lankaevents.lk"
  INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Text}
    TEXT label 25x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "NIC"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
      TEXT value 304x24 [FILL/HUG] · fill color/text/primary · mobile/body · "198512345678"
  TEXT nicHelp 328x40 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "12 digits, or 9 digits + V or X — only the shape is checked."
  INSTANCE Input/DateTimeField 328x74 [FIXED/HUG] · vertical pad 0 gap 6 · {State=Filled}
    TEXT label 62x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Birthdate"
    FRAME field 328x48 [FILL/HUG] · horizontal pad 12 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
      TEXT value 292x24 [FILL/HUG] · fill color/text/primary · mobile/body · "1985-06-20"
      VECTOR calendar 12x12 [FIXED/FIXED] · stroke color/text/secondary 1.5
  INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Text}
    TEXT label 77x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Legal name"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
      TEXT value 304x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Ruwan Jayasuriya"
  INSTANCE Input/Checkbox 316x44 [HUG/HUG] · vertical pad 0 gap 6 · {State=Checked}
    FRAME row 316x44 [HUG/HUG] · horizontal pad 2/0/2/0 gap 12
      FRAME box 24x24 [FIXED/FIXED] · fill color/brand/primary · r4
        VECTOR check 12x10 [FIXED/FIXED] @6,8 · stroke color/text/inverse 2.5
      TEXT label 280x40 [FIXED/FIXED] · mobile/secondary · "I accept the Terms of Service and Privacy Policy"
        · run mobile/secondary "I accept the "
        · run mobile/secondary underline "Terms of Service"
        · run mobile/secondary " and "
        · run mobile/secondary underline "Privacy Policy"
  FRAME spacer-grow 8x1 [FIXED/FILL]
  INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
    TEXT label 118x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Create account"
```

The details of the **person** behind the business: Ruwan Jayasuriya, born 1985-06-20, NIC
198512345678, and the business address `hello@lankaevents.lk` in the optional email. The business name comes
on the next step.

### `1.5` — Registration, employer posting-as

**Reached from** `1.4e`, `1.5b`  ·  **Leads to** `1.5b` ("Business (the segmented control)"), `1.18ez` ("Continue")  ·  **Exits** back → `1.4e`, ✕ → `1.1e`

*In the demo:* Continue → [M2](M2-posting.md) `2.1n`, the blank posting form — a new employer's first step.

```
FRAME 360x800 · vertical pad 6/16/24/16 gap 16 · fill color/bg/default
  FRAME topBar 328x44 [FILL/HUG] · horizontal pad 0 gap 0 · [standard, see header]
  TEXT screenTitle 179x32 [HUG/HUG] · fill color/text/primary · mobile/display · "Create account"
  TEXT step 63x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Step 5 of 5"
  TEXT question 156x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "How will you post gigs?"
  INSTANCE Input/SegmentedControl 328x44 [FILL/HUG] · horizontal pad 2 gap 2 · fill color/bg/subtle · r8 · {Selected=Individual}
    FRAME segment 208x40 [FIXED/HUG] · horizontal pad 8/16/8/16 gap 0 · fill color/brand/primary · r6
      TEXT label 162x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Individual/Household"
    FRAME segment 115x40 [FIXED/HUG] · horizontal pad 8/16/8/16 gap 0 · r6
      TEXT label 69x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Business"
  TEXT descIndividual 328x72 [FIXED/HUG] · fill color/text/secondary · mobile/body · "Individual/Household — post occasional gigs as yourself: a house move, tutoring, help at an event."
  TEXT descBusiness 328x72 [FIXED/HUG] · fill color/text/secondary · mobile/body · "Business — you'll add a business name, and it appears on every posting you publish."
  TEXT changeLater 328x60 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "You can change this later in Settings. Postings you've already published keep the name they were posted under."
  FRAME spacer-grow 8x218 [FIXED/FILL]
  INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
    TEXT label 70x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Continue"
```

*How will you post gigs?* — `Individual/Household` selected. Both descriptions are shown so the choice
is made knowing the other, and *You can change this later in Settings* says it is not permanent
(`FR-ACC-16`).

### `1.5b` — Registration, employer posting-as · Business fields revealed

**Reached from** `1.5`  ·  **Leads to** `1.5` ("Individual/Household (the segmented control)"), `1.18ez` ("Continue")  ·  **Exits** back → `1.4e`, ✕ → `1.1e`

*In the demo:* Continue → [M2](M2-posting.md) `2.1n`, the blank posting form — a new employer's first step.

```
FRAME 360x800 · vertical pad 6/16/24/16 gap 16 · fill color/bg/default
  FRAME topBar 328x44 [FILL/HUG] · horizontal pad 0 gap 0 · [standard, see header]
  TEXT screenTitle 179x32 [HUG/HUG] · fill color/text/primary · mobile/display · "Create account"
  TEXT step 63x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Step 5 of 5"
  TEXT question 156x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "How will you post gigs?"
  INSTANCE Input/SegmentedControl 328x44 [FILL/HUG] · horizontal pad 2 gap 2 · fill color/bg/subtle · r8 · {Selected=Business}
    FRAME segment 208x40 [FIXED/HUG] · horizontal pad 8/16/8/16 gap 0 · r6
      TEXT label 162x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Individual/Household"
    FRAME segment 115x40 [FIXED/HUG] · horizontal pad 8/16/8/16 gap 0 · fill color/brand/primary · r6
      TEXT label 69x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Business"
  TEXT descIndividual 328x72 [FIXED/HUG] · fill color/text/secondary · mobile/body · "Individual/Household — post occasional gigs as yourself: a house move, tutoring, help at an event."
  TEXT descBusiness 328x72 [FIXED/HUG] · fill color/text/secondary · mobile/body · "Business — you'll add a business name, and it appears on every posting you publish."
  TEXT changeLater 328x60 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "You can change this later in Settings. Postings you've already published keep the name they were posted under."
  INSTANCE Input/TextField 328x72 [FILL/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Text}
    TEXT label 100x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Business name"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
      TEXT value 304x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Lanka Events (Pvt) Ltd"
  INSTANCE Input/TextField 328x72 [FILL/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Text}
    TEXT label 151x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Business bio (optional)"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
      TEXT businessBio 304x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Event staffing across Colombo — weddings, corporate events and concerts."
  FRAME spacer-grow 8x42 [FIXED/FILL]
  INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
    TEXT label 70x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Continue"
```

`Business` selected, and the two fields it unlocks: **Business name** (required) and **Business bio
(optional)**, capped at 100 and 300 characters (`FR-ACC-02`). The bio entered here is exactly what the
first-run profile `1.18ez` shows.

### `1.1v` — Role selection · Community Verifier selected

**Reached from** role selection with Community Verifier chosen — the verifier path starts here  ·  **Leads to** `1.6v` ("Go to log in"), `1.2v` ("Continue")

```
FRAME 360x800 · vertical pad 6/16/24/16 gap 16 · fill color/bg/default
  FRAME topBarGhost 44x44 [FIXED/FIXED] · [standard, see header]
  TEXT screenTitle 179x32 [HUG/HUG] · fill color/text/primary · mobile/display · "Create account"
  TEXT step 62x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Step 1 of 4"
  INSTANCE Input/RoleOption 328x78 [FIXED/HUG] · horizontal pad 16 gap 12 · fill color/bg/default · stroke color/border/default 1.5 · r8 · {State=Default}
    FRAME radio 20x20 [FIXED/FIXED]
      ELLIPSE ring 20x20 [FIXED/FIXED] @0,0 · stroke color/border/default 1.5
    FRAME copy 192x46 [HUG/HUG] · vertical pad 0 gap 2
      TEXT title 138x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Youth Job-Seeker"
      TEXT description 192x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Find part-time work and gigs"
  INSTANCE Input/RoleOption 328x78 [FIXED/HUG] · horizontal pad 16 gap 12 · fill color/bg/default · stroke color/border/default 1.5 · r8 · {State=Default}
    FRAME radio 20x20 [FIXED/FIXED]
      ELLIPSE ring 20x20 [FIXED/FIXED] @0,0 · stroke color/border/default 1.5
    FRAME copy 191x46 [HUG/HUG] · vertical pad 0 gap 2
      TEXT title 191x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Local Business/Employer"
      TEXT description 176x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Post gigs and hire workers"
  INSTANCE Input/RoleOption 328x78 [FIXED/HUG] · horizontal pad 16 gap 12 · fill color/bg/default · stroke color/brand/primary 2 · r8 · {State=Selected}
    FRAME radio 20x20 [FIXED/FIXED]
      ELLIPSE ring 20x20 [FIXED/FIXED] @0,0 · stroke color/brand/primary 2
      ELLIPSE dot 10x10 [FIXED/FIXED] @5,5 · fill color/brand/primary
    FRAME copy 180x46 [HUG/HUG] · vertical pad 0 gap 2
      TEXT title 148x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Community Verifier"
      TEXT description 180x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Vouch for people you know"
  FRAME spacer-grow 8x224 [FIXED/FILL]
  INSTANCE Action/Link 87x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
    TEXT label 87x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Go to log in"
  INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
    TEXT label 70x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Continue"
```

`Community Verifier` selected. Four steps, like the worker's.

### `1.2v` — Registration, phone entry · verifier

**Reached from** `1.1v`, `1.3v`  ·  **Leads to** `1.6v` ("Go to log in"), `1.3v` ("Send code")  ·  **Exits** back → `1.1v`, ✕ → `1.1v`

```
FRAME 360x800 · vertical pad 6/16/24/16 gap 16 · fill color/bg/default
  FRAME topBar 328x44 [FILL/HUG] · horizontal pad 0 gap 0 · [standard, see header]
  TEXT screenTitle 179x32 [HUG/HUG] · fill color/text/primary · mobile/display · "Create account"
  TEXT step 63x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Step 2 of 4"
  INSTANCE Input/PhoneField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Default}
    TEXT Phone number 97x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Phone number"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
      FRAME prefix 56x48 [HUG/FILL] · horizontal pad 0/12/0/12 gap 0 · fill color/bg/subtle
        TEXT +94 32x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "+94"
      FRAME val 107x48 [HUG/FILL] · horizontal pad 0/0/0/12 gap 0
        TEXT 7X XXX XXXX 95x24 [HUG/HUG] · fill color/text/primary · mobile/body · "71 456 7890"
  FRAME spacer-grow 8x418 [FIXED/FILL]
  INSTANCE loginLink 87x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0 · of Action/Link
    TEXT label 87x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Go to log in"
  INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
    TEXT label 82x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Send code"
```

Sunil Bandara's number, **+94 71 456 7890**.

### `1.3v` — Registration, code entry · verifier

**Reached from** `1.2v`  ·  **Leads to** `1.2v` ("Change number"), `1.6v` ("Go to log in"), `1.4v` ("Verify")  ·  **Exits** back → `1.2v`, ✕ → `1.1v`

```
FRAME 360x800 · vertical pad 6/16/24/16 gap 16 · fill color/bg/default
  FRAME topBar 328x44 [FILL/HUG] · horizontal pad 0 gap 0 · [standard, see header]
  TEXT screenTitle 179x32 [HUG/HUG] · fill color/text/primary · mobile/display · "Create account"
  TEXT step 64x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Step 3 of 4"
  TEXT sentTo 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "We sent a 6-digit code to +94 71 456 7890."
  INSTANCE Input/CodeInputNumeric 328x52 [FILL/HUG] · vertical pad 0 gap 8 · {State=Filled}
    FRAME digits 328x52 [FILL/HUG] · horizontal pad 0 gap 8
      FRAME d0 48x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT 8 13x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "8"
      FRAME d1 48x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT 1 10x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "1"
      FRAME d2 48x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT 3 14x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "3"
      FRAME d3 48x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT 7 12x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "7"
      FRAME d4 48x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT 0 14x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "0"
      FRAME d5 48x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT 6 13x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "6"
  INSTANCE Display/CountdownText 99x20 [HUG/HUG] · horizontal pad 0 gap 0 · {Format=Cooldown}
    TEXT countdown 99x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Resend in 0:47"
  FRAME spacer-grow 8x322 [FIXED/FILL]
  FRAME linkGroup 121x88 [HUG/HUG] · vertical pad 0 gap 0
    INSTANCE Action/Link 121x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
      TEXT label 121x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Change number"
    INSTANCE loginLink 87x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0 · of Action/Link
      TEXT label 87x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Go to log in"
  INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
    TEXT label 45x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Verify"
```

Code **8 1 3 7 0 6**.

### `1.4v` — Registration, details · verifier

**Reached from** `1.3v`  ·  **Leads to** `1.20` ("Terms of Service / Privacy Policy"), [M8](M8-endorsement.md) `8.2` ("Create account")  ·  **Exits** back → `1.3v`, ✕ → `1.1v`

```
FRAME 360x800 · vertical pad 6/16/16/16 gap 8 · fill color/bg/default
  FRAME topBar 328x52 [FILL/HUG] · horizontal pad 0/0/8/0 gap 0 · [standard, see header]
  TEXT screenTitle 179x32 [HUG/HUG] · fill color/text/primary · mobile/display · "Create account"
  TEXT step 64x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Step 4 of 4"
  INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Secure}
    TEXT label 65x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Password"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
      TEXT value 272x24 [FILL/HUG] · fill color/text/primary · mobile/body · "••••••••••"
      FRAME eye 24x24 [FIXED/FIXED]
        ELLIPSE Ellipse 20x12 [FIXED/FIXED] @2,6 · stroke color/text/secondary 1.5
        ELLIPSE Ellipse 7x7 [FIXED/FIXED] @9,9 · fill color/text/secondary
  INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Secure}
    TEXT label 121x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Confirm password"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
      TEXT value 272x24 [FILL/HUG] · fill color/text/primary · mobile/body · "••••••••••"
      FRAME eye 24x24 [FIXED/FIXED]
        ELLIPSE Ellipse 20x12 [FIXED/FIXED] @2,6 · stroke color/text/secondary 1.5
        ELLIPSE Ellipse 7x7 [FIXED/FIXED] @9,9 · fill color/text/secondary
  TEXT pwHelp 328x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "8–64 characters, spaces allowed."
  INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Default, Type=Text}
    TEXT label 103x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Email (optional)"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
      TEXT value 304x24 [FILL/HUG] · fill color/text/secondary · mobile/body · "you@example.com"
  INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Text}
    TEXT label 25x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "NIC"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
      TEXT value 304x24 [FILL/HUG] · fill color/text/primary · mobile/body · "195512349012"
  TEXT nicHelp 328x40 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "12 digits, or 9 digits + V or X — only the shape is checked."
  INSTANCE Input/DateTimeField 328x74 [FIXED/HUG] · vertical pad 0 gap 6 · {State=Filled}
    TEXT label 62x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Birthdate"
    FRAME field 328x48 [FILL/HUG] · horizontal pad 12 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
      TEXT value 292x24 [FILL/HUG] · fill color/text/primary · mobile/body · "1955-05-03"
      VECTOR calendar 12x12 [FIXED/FIXED] · stroke color/text/secondary 1.5
  INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Text}
    TEXT label 77x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Legal name"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
      TEXT value 304x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Sunil Bandara"
  INSTANCE Input/Checkbox 316x44 [HUG/HUG] · vertical pad 0 gap 6 · {State=Checked}
    FRAME row 316x44 [HUG/HUG] · horizontal pad 2/0/2/0 gap 12
      FRAME box 24x24 [FIXED/FIXED] · fill color/brand/primary · r4
        VECTOR check 12x10 [FIXED/FIXED] @6,8 · stroke color/text/inverse 2.5
      TEXT label 280x40 [FIXED/HUG] · mobile/secondary · "I accept the Terms of Service and Privacy Policy"
        · run mobile/secondary "I accept the "
        · run mobile/secondary underline "Terms of Service"
        · run mobile/secondary " and "
        · run mobile/secondary underline "Privacy Policy"
  FRAME spacer-grow 8x1 [FIXED/FILL]
  INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
    TEXT label 118x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Create account"
```

Sunil Bandara, born 1955-05-03, NIC 195512349012, no email at this point. The verifier's first screen
after this is M8 `8.2` (vouch), not Browse.

## Logging in

Two paths to the same account (`FR-ACC-07`): phone and password, or phone and a one-time
code. Five wrong passwords pause the password path for 15 minutes and leave the code path open
(`FR-ACC-09`). A suspended account is refused on **both** paths with the same message, and the recovery
links disappear, because neither would get the person in (`FR-ADM-03`).

### `1.6emp` — Login, password path · empty

**Reached from** `1.10sed`, `1.10seg`, `1.10sn` · in the demo `1.9`  ·  **Leads to** `1.6` (the phone field (typing)), `1.7` ("Log in with a code instead"), `1.8` ("Forgot password?"), [HF](MHF-help.md) `HF.5` ("Trouble getting in? Get help")  ·  **Exits** back → `1.1`

```
FRAME 360x800 · vertical pad 6/16/24/16 gap 16 · fill color/bg/default
  FRAME backHit 44x44 [FIXED/FIXED]
    VECTOR back 8x16 [FIXED/FIXED] @6,14 · stroke color/text/primary 2
  TEXT screenTitle 170x32 [HUG/HUG] · fill color/text/primary · mobile/display · "Welcome back"
  TEXT welcomeSub 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Enter your phone number and password to log in."
  INSTANCE Input/PhoneField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Default}
    TEXT Phone number 97x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Phone number"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
      FRAME prefix 56x48 [HUG/FILL] · horizontal pad 0/12/0/12 gap 0 · fill color/bg/subtle
        TEXT +94 32x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "+94"
      FRAME val 113x48 [HUG/FILL] · horizontal pad 0/0/0/12 gap 0
        TEXT 7X XXX XXXX 101x24 [HUG/HUG] · fill color/text/secondary · mobile/body · "7X XXX XXXX"
  INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Default, Type=Secure}
    TEXT label 65x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Password"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
      TEXT value 272x24 [FILL/HUG] · fill color/text/secondary · mobile/body · "8–64 characters"
      FRAME eye 24x24 [FIXED/FIXED]
        ELLIPSE Ellipse 20x12 [FIXED/FIXED] @2,6 · stroke color/text/secondary 1.5
        ELLIPSE Ellipse 7x7 [FIXED/FIXED] @9,9 · fill color/text/secondary
  FRAME spacer-grow 8x242 [FIXED/FILL]
  FRAME linkGroup 210x132 [HUG/HUG] · vertical pad 0 gap 0
    INSTANCE Action/Link 199x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
      TEXT label 199x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Log in with a code instead"
    INSTANCE Action/Link 136x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
      TEXT label 136x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Forgot password?"
    INSTANCE helpLink 210x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0 · of Action/Link
      TEXT label 210x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Trouble getting in? Get help"
  INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/subtle · stroke color/border/default 1 · r8 · {Style=Primary, State=Disabled}
    TEXT label 47x24 [HUG/HUG] · fill color/text/secondary · mobile/body-medium · "Log in"
```

**Before anything is typed.** Placeholders in `color/text/secondary` (`7X XXX XXXX`, *8–64
characters*), and Log in `{State=Disabled}` until both fields have content. This is also where Nethmi's
recovery and R. Gunasekara's refusal lead back to — it belongs to nobody in particular.

### `1.6` — Login, password path

**Reached from** `1.1`, `1.10s`, `1.2`, `1.2err`, `1.3`, `1.3err1`, `1.3err2`, `1.3rs2`, `1.4err1`, `1.6emp`, `1.7`, `1.9` · in the demo `1.4cnt`  ·  **Leads to** `1.7` ("Log in with a code instead"), `1.8` ("Forgot password?"), `1.6sub` ("Log in"), [HF](MHF-help.md) `HF.5` ("Trouble getting in? Get help")  ·  **Exits** back → `1.1`

*In the demo:* the error walk: Log in → `1.6bnr1`.

```
FRAME 360x800 · vertical pad 6/16/24/16 gap 16 · fill color/bg/default
  FRAME backHit 44x44 [FIXED/FIXED]
    VECTOR back 8x16 [FIXED/FIXED] @6,14 · stroke color/text/primary 2
  TEXT screenTitle 170x32 [HUG/HUG] · fill color/text/primary · mobile/display · "Welcome back"
  TEXT welcomeSub 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Log in to pick up where you left off."
  INSTANCE Input/PhoneField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Default}
    TEXT Phone number 97x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Phone number"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
      FRAME prefix 56x48 [HUG/FILL] · horizontal pad 0/12/0/12 gap 0 · fill color/bg/subtle
        TEXT +94 32x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "+94"
      FRAME val 107x48 [HUG/FILL] · horizontal pad 0/0/0/12 gap 0
        TEXT 7X XXX XXXX 95x24 [HUG/HUG] · fill color/text/primary · mobile/body · "77 123 4567"
  INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Secure}
    TEXT label 65x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Password"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
      TEXT value 272x24 [FILL/HUG] · fill color/text/primary · mobile/body · "••••••••••"
      FRAME eye 24x24 [FIXED/FIXED]
        ELLIPSE Ellipse 20x12 [FIXED/FIXED] @2,6 · stroke color/text/secondary 1.5
        ELLIPSE Ellipse 7x7 [FIXED/FIXED] @9,9 · fill color/text/secondary
  FRAME spacer-grow 8x242 [FIXED/FILL]
  FRAME linkGroup 210x132 [HUG/HUG] · vertical pad 0 gap 0
    INSTANCE Action/Link 199x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
      TEXT label 199x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Log in with a code instead"
    INSTANCE Action/Link 136x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
      TEXT label 136x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Forgot password?"
    INSTANCE helpLink 210x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0 · of Action/Link
      TEXT label 210x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Trouble getting in? Get help"
  INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
    TEXT label 47x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Log in"
```

Kavindu's number and a masked password, both filled. *Log in with a code instead*, *Forgot password?*
and *Trouble getting in? Get help* sit above the button in one link group.

### `1.6sub` — Login, password path · submitting

**Reached from** `1.6`  ·  **Leads to** `1.18` (after 1.2 s †)  ·  **Exits** back → `1.6`

*In the demo:* in the returning worker's journey the timeout lands on `8.6` (the bio prompt over `1.18`).

```
FRAME 360x800 · vertical pad 6/16/24/16 gap 16 · fill color/bg/default
  FRAME backHit 44x44 [FIXED/FIXED]
    VECTOR back 8x16 [FIXED/FIXED] @6,14 · stroke color/text/primary 2
  TEXT screenTitle 170x32 [HUG/HUG] · fill color/text/primary · mobile/display · "Welcome back"
  TEXT welcomeSub 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Signing you in… fields are locked while we check."
  INSTANCE Input/PhoneField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Disabled}
    TEXT Phone number 97x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Phone number"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/subtle · stroke color/border/default 1 · r8
      FRAME prefix 56x48 [HUG/FILL] · horizontal pad 0/12/0/12 gap 0 · fill color/bg/subtle
        TEXT +94 32x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "+94"
      FRAME val 107x48 [HUG/FILL] · horizontal pad 0/0/0/12 gap 0
        TEXT 77 123 4567 95x24 [HUG/HUG] · fill color/text/primary · mobile/body · "77 123 4567"
  INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Disabled, Type=Secure}
    TEXT label 65x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Password"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/subtle · stroke color/border/default 1 · r8
      TEXT value 272x24 [FILL/HUG] · fill color/text/secondary · mobile/body · "••••••••••"
      FRAME eye 24x24 [FIXED/FIXED]
        ELLIPSE Ellipse 20x12 [FIXED/FIXED] @2,6 · stroke color/text/secondary 1.5
        ELLIPSE Ellipse 7x7 [FIXED/FIXED] @9,9 · fill color/text/secondary
  FRAME spacer-grow 8x390 [FIXED/FILL]
  INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Loading}
    ELLIPSE spinner 20x20 [FIXED/FIXED] · fill color/text/inverse
```

**Submitting.** Both fields `{State=Disabled}` and the button `{State=Loading}` with a spinner; the
subtitle says the fields are locked while the server checks. It advances by itself after 1.2 s (†).

### `1.6bnr1` — Login, password path · incorrect details

**Reached from** in the demo `1.6`  ·  **Leads to** `1.6bnr2` ("Log in"), [HF](MHF-help.md) `HF.5` ("Trouble getting in? Get help")  ·  **Exits** back → `1.1`

*In the demo:* Log in with a code instead → `1.7`, Forgot password? → `1.8`.

```
FRAME 360x800 · vertical pad 6/16/24/16 gap 16 · fill color/bg/default
  FRAME backHit 44x44 [FIXED/FIXED]
    VECTOR back 8x16 [FIXED/FIXED] @6,14 · stroke color/text/primary 2
  TEXT screenTitle 170x32 [HUG/HUG] · fill color/text/primary · mobile/display · "Welcome back"
  TEXT welcomeSub 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Log in to pick up where you left off."
  INSTANCE formBanner 328x80 [FILL/HUG] · horizontal pad 10/12/10/12 gap 0 · stroke color/border/error 1 · r8 · of Feedback/FormBanner · {Kind=Error}
    TEXT message 296x60 [FIXED/HUG] · fill color/state/danger · mobile/secondary · "We couldn't log you in with those details. Check your number and password, or reset your password."
  INSTANCE Input/PhoneField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Default}
    TEXT Phone number 97x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Phone number"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
      FRAME prefix 56x48 [HUG/FILL] · horizontal pad 0/12/0/12 gap 0 · fill color/bg/subtle
        TEXT +94 32x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "+94"
      FRAME val 107x48 [HUG/FILL] · horizontal pad 0/0/0/12 gap 0
        TEXT 7X XXX XXXX 95x24 [HUG/HUG] · fill color/text/primary · mobile/body · "77 123 4567"
  INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Secure}
    TEXT label 65x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Password"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
      TEXT value 272x24 [FILL/HUG] · fill color/text/primary · mobile/body · "••••••••••"
      FRAME eye 24x24 [FIXED/FIXED]
        ELLIPSE Ellipse 20x12 [FIXED/FIXED] @2,6 · stroke color/text/secondary 1.5
        ELLIPSE Ellipse 7x7 [FIXED/FIXED] @9,9 · fill color/text/secondary
  FRAME spacer-grow 8x146 [FIXED/FILL]
  FRAME linkGroup 210x132 [HUG/HUG] · vertical pad 0 gap 0
    INSTANCE Action/Link 199x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
      TEXT label 199x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Log in with a code instead"
    INSTANCE Action/Link 136x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
      TEXT label 136x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Forgot password?"
    INSTANCE helpLink 210x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0 · of Action/Link
      TEXT label 210x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Trouble getting in? Get help"
  INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
    TEXT label 47x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Log in"
```

A generic refusal — *We couldn't log you in with those details* — that does not say which of the
two was wrong, so the screen cannot be used to discover which numbers are registered.

### `1.6bnr2` — Login, password path · 2 attempts left

**Reached from** `1.6bnr1`  ·  **Leads to** `1.6bnr3` ("Log in"), [HF](MHF-help.md) `HF.5` ("Trouble getting in? Get help")  ·  **Exits** back → `1.1`

*In the demo:* Log in with a code instead → `1.7`, Forgot password? → `1.8`.

```
FRAME 360x800 · vertical pad 6/16/24/16 gap 16 · fill color/bg/default
  FRAME backHit 44x44 [FIXED/FIXED]
    VECTOR back 8x16 [FIXED/FIXED] @6,14 · stroke color/text/primary 2
  TEXT screenTitle 170x32 [HUG/HUG] · fill color/text/primary · mobile/display · "Welcome back"
  TEXT welcomeSub 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Log in to pick up where you left off."
  INSTANCE formBanner 328x80 [FILL/HUG] · horizontal pad 10/12/10/12 gap 0 · stroke color/border/error 1 · r8 · of Feedback/FormBanner · {Kind=Error}
    TEXT message 296x60 [FIXED/HUG] · fill color/state/danger · mobile/secondary · "We couldn't log you in with those details. 2 attempts left before password login is paused for 15 minutes."
  INSTANCE Input/PhoneField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Default}
    TEXT Phone number 97x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Phone number"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
      FRAME prefix 56x48 [HUG/FILL] · horizontal pad 0/12/0/12 gap 0 · fill color/bg/subtle
        TEXT +94 32x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "+94"
      FRAME val 107x48 [HUG/FILL] · horizontal pad 0/0/0/12 gap 0
        TEXT 7X XXX XXXX 95x24 [HUG/HUG] · fill color/text/primary · mobile/body · "77 123 4567"
  INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Secure}
    TEXT label 65x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Password"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
      TEXT value 272x24 [FILL/HUG] · fill color/text/primary · mobile/body · "••••••••••"
      FRAME eye 24x24 [FIXED/FIXED]
        ELLIPSE Ellipse 20x12 [FIXED/FIXED] @2,6 · stroke color/text/secondary 1.5
        ELLIPSE Ellipse 7x7 [FIXED/FIXED] @9,9 · fill color/text/secondary
  FRAME spacer-grow 8x146 [FIXED/FILL]
  FRAME linkGroup 210x132 [HUG/HUG] · vertical pad 0 gap 0
    INSTANCE Action/Link 199x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
      TEXT label 199x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Log in with a code instead"
    INSTANCE Action/Link 136x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
      TEXT label 136x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Forgot password?"
    INSTANCE helpLink 210x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0 · of Action/Link
      TEXT label 210x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Trouble getting in? Get help"
  INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
    TEXT label 47x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Log in"
```

After the third failure: **2 attempts left** before the password path is paused for 15 minutes
(`FR-ACC-09`: five failures).

### `1.6bnr3` — Login, password path · paused for 15 minutes

**Reached from** `1.6bnr2`  ·  **Leads to** `1.7` ("Log in with a code instead"), [HF](MHF-help.md) `HF.5` ("Trouble getting in? Get help")  ·  **Exits** back → `1.1`

*In the demo:* Forgot password? → `1.8`.

```
FRAME 360x800 · vertical pad 6/16/24/16 gap 16 · fill color/bg/default
  FRAME backHit 44x44 [FIXED/FIXED]
    VECTOR back 8x16 [FIXED/FIXED] @6,14 · stroke color/text/primary 2
  TEXT screenTitle 170x32 [HUG/HUG] · fill color/text/primary · mobile/display · "Welcome back"
  TEXT welcomeSub 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Log in to pick up where you left off."
  INSTANCE formBanner 328x80 [FILL/HUG] · horizontal pad 10/12/10/12 gap 0 · stroke color/border/error 1 · r8 · of Feedback/FormBanner · {Kind=Error}
    TEXT message 296x60 [FIXED/HUG] · fill color/state/danger · mobile/secondary · "Too many attempts — password login is paused for 15 minutes. You can log in with a code instead."
  INSTANCE Input/PhoneField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Default}
    TEXT Phone number 97x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Phone number"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
      FRAME prefix 56x48 [HUG/FILL] · horizontal pad 0/12/0/12 gap 0 · fill color/bg/subtle
        TEXT +94 32x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "+94"
      FRAME val 107x48 [HUG/FILL] · horizontal pad 0/0/0/12 gap 0
        TEXT 7X XXX XXXX 95x24 [HUG/HUG] · fill color/text/primary · mobile/body · "77 123 4567"
  INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Secure}
    TEXT label 65x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Password"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
      TEXT value 272x24 [FILL/HUG] · fill color/text/primary · mobile/body · "••••••••••"
      FRAME eye 24x24 [FIXED/FIXED]
        ELLIPSE Ellipse 20x12 [FIXED/FIXED] @2,6 · stroke color/text/secondary 1.5
        ELLIPSE Ellipse 7x7 [FIXED/FIXED] @9,9 · fill color/text/secondary
  FRAME spacer-grow 8x146 [FIXED/FILL]
  FRAME linkGroup 210x132 [HUG/HUG] · vertical pad 0 gap 0
    INSTANCE Action/Link 199x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
      TEXT label 199x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Log in with a code instead"
    INSTANCE Action/Link 136x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
      TEXT label 136x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Forgot password?"
    INSTANCE helpLink 210x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0 · of Action/Link
      TEXT label 210x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Trouble getting in? Get help"
  INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/subtle · stroke color/border/default 1 · r8 · {Style=Primary, State=Disabled}
    TEXT label 47x24 [HUG/HUG] · fill color/text/secondary · mobile/body-medium · "Log in"
```

**Paused.** Log in is `{State=Disabled}`; the banner gives the length of the pause and the way round
it — log in with a code instead, which stays available.

### `1.6s` — Login, password path · signed out for security

**Reached from** the app itself, when the session has ended or the password was changed on another device  ·  **Leads to** `1.7` ("Log in with a code instead"), `1.8` ("Forgot password?"), `1.18` ("Log in"), [HF](MHF-help.md) `HF.5` ("Trouble getting in? Get help")

```
FRAME 360x800 · vertical pad 66/16/24/16 gap 16 · fill color/bg/default
  TEXT screenTitle 170x32 [HUG/HUG] · fill color/text/primary · mobile/display · "Welcome back"
  TEXT welcomeSub 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Log in to pick up where you left off."
  TEXT sessionBanner 328x80 [FILL/HUG] · fill color/text/primary · mobile/secondary · "You were signed out — your session ended, or your password was changed on another device. Sign in again to continue. If that change wasn't you, reset your password now."
  INSTANCE Input/PhoneField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Default}
    TEXT Phone number 97x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Phone number"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
      FRAME prefix 56x48 [HUG/FILL] · horizontal pad 0/12/0/12 gap 0 · fill color/bg/subtle
        TEXT +94 32x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "+94"
      FRAME val 107x48 [HUG/FILL] · horizontal pad 0/0/0/12 gap 0
        TEXT 7X XXX XXXX 95x24 [HUG/HUG] · fill color/text/primary · mobile/body · "77 123 4567"
  INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Secure}
    TEXT label 65x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Password"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
      TEXT value 272x24 [FILL/HUG] · fill color/text/primary · mobile/body · "••••••••••"
      FRAME eye 24x24 [FIXED/FIXED]
        ELLIPSE Ellipse 20x12 [FIXED/FIXED] @2,6 · stroke color/text/secondary 1.5
        ELLIPSE Ellipse 7x7 [FIXED/FIXED] @9,9 · fill color/text/secondary
  FRAME spacer-grow 8x146 [FIXED/FILL]
  FRAME linkGroup 210x132 [HUG/HUG] · vertical pad 0 gap 0
    INSTANCE Action/Link 199x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
      TEXT label 199x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Log in with a code instead"
    INSTANCE Action/Link 136x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
      TEXT label 136x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Forgot password?"
    INSTANCE helpLink 210x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0 · of Action/Link
      TEXT label 210x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Trouble getting in? Get help"
  INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
    TEXT label 47x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Log in"
```

**Signed out for security** — the session ended, or the password was changed on another device.
There is no back chevron: the person arrived here because they were signed out, so there is nothing behind
it. The banner ends with the one thing to do if the change was not theirs.

### `1.6sus` — Login, password path · account suspended

**Reached from** an attempt to sign in to a suspended account (the refusal is the first thing seen)  ·  **Leads to** [HF](MHF-help.md) `HF.5` ("What suspension means")  ·  **Exits** back → `1.1`

*In the demo:* ‹ back → `1.6emp`.

```
FRAME 360x800 · vertical pad 6/16/24/16 gap 16 · fill color/bg/default
  FRAME backHit 44x44 [FIXED/FIXED]
    VECTOR back 8x16 [FIXED/FIXED] @6,14 · stroke color/text/primary 2
  TEXT screenTitle 170x32 [HUG/HUG] · fill color/text/primary · mobile/display · "Welcome back"
  TEXT welcomeSub 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Log in to pick up where you left off."
  INSTANCE formBanner 328x120 [FILL/HUG] · horizontal pad 10/12/10/12 gap 0 · stroke color/border/error 1 · r8 · of Feedback/FormBanner · {Kind=Error}
    TEXT message 296x100 [FIXED/HUG] · fill color/state/danger · mobile/secondary · "This account has been suspended. Staff make that decision and it takes effect immediately. Logging in with a code will not work either, and YouthLink has no appeals process."
  INSTANCE Input/PhoneField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Disabled}
    TEXT Phone number 97x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Phone number"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/subtle · stroke color/border/default 1 · r8
      FRAME prefix 56x48 [HUG/FILL] · horizontal pad 0/12/0/12 gap 0 · fill color/bg/subtle
        TEXT +94 32x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "+94"
      FRAME val 107x48 [HUG/FILL] · horizontal pad 0/0/0/12 gap 0
        TEXT 7X XXX XXXX 95x24 [HUG/HUG] · fill color/text/primary · mobile/body · "71 987 6543"
  INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Disabled, Type=Secure}
    TEXT label 65x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Password"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/subtle · stroke color/border/default 1 · r8
      TEXT value 272x24 [FILL/HUG] · fill color/text/secondary · mobile/body · "••••••••••"
      FRAME eye 24x24 [FIXED/FIXED]
        ELLIPSE Ellipse 20x12 [FIXED/FIXED] @2,6 · stroke color/text/secondary 1.5
        ELLIPSE Ellipse 7x7 [FIXED/FIXED] @9,9 · fill color/text/secondary
  FRAME spacer-grow 8x194 [FIXED/FILL]
  FRAME linkGroup 184x44 [HUG/HUG] · vertical pad 0 gap 0
    INSTANCE helpLink 184x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0 · of Action/Link
      TEXT label 184x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "What suspension means"
  INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/subtle · stroke color/border/default 1 · r8 · {Style=Primary, State=Disabled}
    TEXT label 47x24 [HUG/HUG] · fill color/text/secondary · mobile/body-medium · "Log in"
```

**R. Gunasekara, after his account was suspended on Fri 4 Sep** (M11 `10.6n`, recorded 3:38 PM). His
number, **+94 71 987 6543**, fields and button disabled; the banner gives the server's words and says that
the code path will not work either and that YouthLink has no appeals process. The forgot-password and code
links are gone — neither would get him in. *What suspension means* opens the help article.

### `1.6e` — Login, password path · employer

**Reached from** `1.10se`, `1.1e`, `1.2e`, `1.3e`, `1.7e` · in the demo `1.9`  ·  **Leads to** `1.7e` ("Log in with a code instead"), `1.8e` ("Forgot password?"), `1.18e` ("Log in"), [HF](MHF-help.md) `HF.5` ("Trouble getting in? Get help")  ·  **Exits** back → `1.1e`

```
FRAME 360x800 · vertical pad 6/16/24/16 gap 16 · fill color/bg/default
  FRAME backHit 44x44 [FIXED/FIXED]
    VECTOR back 8x16 [FIXED/FIXED] @6,14 · stroke color/text/primary 2
  TEXT screenTitle 170x32 [HUG/HUG] · fill color/text/primary · mobile/display · "Welcome back"
  TEXT welcomeSub 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Log in to pick up where you left off."
  INSTANCE Input/PhoneField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Default}
    TEXT Phone number 97x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Phone number"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
      FRAME prefix 56x48 [HUG/FILL] · horizontal pad 0/12/0/12 gap 0 · fill color/bg/subtle
        TEXT +94 32x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "+94"
      FRAME val 105x48 [HUG/FILL] · horizontal pad 0/0/0/12 gap 0
        TEXT 7X XXX XXXX 93x24 [HUG/HUG] · fill color/text/primary · mobile/body · "11 234 5678"
  INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Secure}
    TEXT label 65x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Password"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
      TEXT value 272x24 [FILL/HUG] · fill color/text/primary · mobile/body · "••••••••••"
      FRAME eye 24x24 [FIXED/FIXED]
        ELLIPSE Ellipse 20x12 [FIXED/FIXED] @2,6 · stroke color/text/secondary 1.5
        ELLIPSE Ellipse 7x7 [FIXED/FIXED] @9,9 · fill color/text/secondary
  FRAME spacer-grow 8x242 [FIXED/FILL]
  FRAME linkGroup 210x132 [HUG/HUG] · vertical pad 0 gap 0
    INSTANCE Action/Link 199x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
      TEXT label 199x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Log in with a code instead"
    INSTANCE Action/Link 136x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
      TEXT label 136x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Forgot password?"
    INSTANCE helpLink 210x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0 · of Action/Link
      TEXT label 210x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Trouble getting in? Get help"
  INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
    TEXT label 47x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Log in"
```

Lanka Events' copy: the landline number, and Log in leads to the employer's profile `1.18e`.

### `1.6v` — Login, password path · verifier

**Reached from** `1.10sv`, `1.1v`, `1.2v`, `1.3v`, `1.7v` · in the demo `1.9`  ·  **Leads to** `1.7v` ("Log in with a code instead"), `1.8v` ("Forgot password?"), `1.18v` ("Log in"), [HF](MHF-help.md) `HF.5` ("Trouble getting in? Get help")  ·  **Exits** back → `1.1v`

```
FRAME 360x800 · vertical pad 6/16/24/16 gap 16 · fill color/bg/default
  FRAME backHit 44x44 [FIXED/FIXED]
    VECTOR back 8x16 [FIXED/FIXED] @6,14 · stroke color/text/primary 2
  TEXT screenTitle 170x32 [HUG/HUG] · fill color/text/primary · mobile/display · "Welcome back"
  TEXT welcomeSub 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Log in to pick up where you left off."
  INSTANCE Input/PhoneField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Default}
    TEXT Phone number 97x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Phone number"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
      FRAME prefix 56x48 [HUG/FILL] · horizontal pad 0/12/0/12 gap 0 · fill color/bg/subtle
        TEXT +94 32x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "+94"
      FRAME val 107x48 [HUG/FILL] · horizontal pad 0/0/0/12 gap 0
        TEXT 7X XXX XXXX 95x24 [HUG/HUG] · fill color/text/primary · mobile/body · "71 456 7890"
  INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Secure}
    TEXT label 65x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Password"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
      TEXT value 272x24 [FILL/HUG] · fill color/text/primary · mobile/body · "••••••••••"
      FRAME eye 24x24 [FIXED/FIXED]
        ELLIPSE Ellipse 20x12 [FIXED/FIXED] @2,6 · stroke color/text/secondary 1.5
        ELLIPSE Ellipse 7x7 [FIXED/FIXED] @9,9 · fill color/text/secondary
  FRAME spacer-grow 8x242 [FIXED/FILL]
  FRAME linkGroup 210x132 [HUG/HUG] · vertical pad 0 gap 0
    INSTANCE Action/Link 199x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
      TEXT label 199x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Log in with a code instead"
    INSTANCE Action/Link 136x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
      TEXT label 136x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Forgot password?"
    INSTANCE helpLink 210x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0 · of Action/Link
      TEXT label 210x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Trouble getting in? Get help"
  INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
    TEXT label 47x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Log in"
```

Sunil Bandara's copy.

### `1.7` — Login, OTP path

**Reached from** `1.6`, `1.6bnr3`, `1.6emp`, `1.6s` · in the demo `1.6bnr1`, `1.6bnr2`  ·  **Leads to** `1.6` ("Use password instead"), `1.18` ("Log in"), [HF](MHF-help.md) `HF.5` ("Trouble getting in? Get help")  ·  **Exits** back → `1.6`

*In the demo:* in the returning worker's journey Log in lands on `8.6`.

```
FRAME 360x800 · vertical pad 6/16/24/16 gap 16 · fill color/bg/default
  FRAME backHit 44x44 [FIXED/FIXED]
    VECTOR back 8x16 [FIXED/FIXED] @6,14 · stroke color/text/primary 2
  TEXT screenTitle 170x32 [HUG/HUG] · fill color/text/primary · mobile/display · "Welcome back"
  TEXT welcomeSub 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "We'll text you a one-time code to log in."
  TEXT sub 61x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Code login"
  INSTANCE Input/PhoneField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Default}
    TEXT Phone number 97x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Phone number"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
      FRAME prefix 56x48 [HUG/FILL] · horizontal pad 0/12/0/12 gap 0 · fill color/bg/subtle
        TEXT +94 32x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "+94"
      FRAME val 107x48 [HUG/FILL] · horizontal pad 0/0/0/12 gap 0
        TEXT 7X XXX XXXX 95x24 [HUG/HUG] · fill color/text/primary · mobile/body · "77 123 4567"
  INSTANCE Input/CodeInputNumeric 328x52 [FILL/HUG] · vertical pad 0 gap 8 · {State=Filled}
    FRAME digits 328x52 [FILL/HUG] · horizontal pad 0 gap 8
      FRAME d0 48x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT 9 13x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "9"
      FRAME d1 48x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT 0 14x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "0"
      FRAME d2 48x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT 4 14x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "4"
      FRAME d3 48x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT 6 13x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "6"
      FRAME d4 48x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT 2 13x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "2"
      FRAME d5 48x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT 7 12x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "7"
  INSTANCE Display/CountdownText 99x20 [HUG/HUG] · horizontal pad 0 gap 0 · {Format=Cooldown}
    TEXT countdown 99x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Resend in 0:47"
  FRAME spacer-grow 8x238 [FIXED/FILL]
  FRAME linkGroup 210x88 [HUG/HUG] · vertical pad 0 gap 0
    INSTANCE Action/Link 168x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
      TEXT label 168x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Use password instead"
    INSTANCE helpLink 210x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0 · of Action/Link
      TEXT label 210x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Trouble getting in? Get help"
  INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
    TEXT label 47x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Log in"
```

The code path, with Kavindu's number and code **9 0 4 6 2 7** filled. *Use password instead* returns to
`1.6`.

### `1.7e` — Login, OTP path · employer

**Reached from** `1.6e`  ·  **Leads to** `1.6e` ("Use password instead"), `1.18e` ("Log in"), [HF](MHF-help.md) `HF.5` ("Trouble getting in? Get help")  ·  **Exits** back → `1.6e`

```
FRAME 360x800 · vertical pad 6/16/24/16 gap 16 · fill color/bg/default
  FRAME backHit 44x44 [FIXED/FIXED]
    VECTOR back 8x16 [FIXED/FIXED] @6,14 · stroke color/text/primary 2
  TEXT screenTitle 170x32 [HUG/HUG] · fill color/text/primary · mobile/display · "Welcome back"
  TEXT welcomeSub 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "We'll text you a one-time code to log in."
  TEXT sub 61x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Code login"
  INSTANCE Input/PhoneField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Default}
    TEXT Phone number 97x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Phone number"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
      FRAME prefix 56x48 [HUG/FILL] · horizontal pad 0/12/0/12 gap 0 · fill color/bg/subtle
        TEXT +94 32x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "+94"
      FRAME val 105x48 [HUG/FILL] · horizontal pad 0/0/0/12 gap 0
        TEXT 7X XXX XXXX 93x24 [HUG/HUG] · fill color/text/primary · mobile/body · "11 234 5678"
  INSTANCE Input/CodeInputNumeric 328x52 [FILL/HUG] · vertical pad 0 gap 8 · {State=Filled}
    FRAME digits 328x52 [FILL/HUG] · horizontal pad 0 gap 8
      FRAME d0 48x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT 2 13x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "2"
      FRAME d1 48x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT 6 13x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "6"
      FRAME d2 48x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT 8 13x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "8"
      FRAME d3 48x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT 1 10x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "1"
      FRAME d4 48x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT 5 13x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "5"
      FRAME d5 48x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT 3 14x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "3"
  INSTANCE Display/CountdownText 99x20 [HUG/HUG] · horizontal pad 0 gap 0 · {Format=Cooldown}
    TEXT countdown 99x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Resend in 0:47"
  FRAME spacer-grow 8x238 [FIXED/FILL]
  FRAME linkGroup 210x88 [HUG/HUG] · vertical pad 0 gap 0
    INSTANCE Action/Link 168x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
      TEXT label 168x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Use password instead"
    INSTANCE helpLink 210x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0 · of Action/Link
      TEXT label 210x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Trouble getting in? Get help"
  INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
    TEXT label 47x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Log in"
```

Code **2 6 8 1 5 3**.

### `1.7v` — Login, OTP path · verifier

**Reached from** `1.6v`  ·  **Leads to** `1.6v` ("Use password instead"), `1.18v` ("Log in"), [HF](MHF-help.md) `HF.5` ("Trouble getting in? Get help")  ·  **Exits** back → `1.6v`

```
FRAME 360x800 · vertical pad 6/16/24/16 gap 16 · fill color/bg/default
  FRAME backHit 44x44 [FIXED/FIXED]
    VECTOR back 8x16 [FIXED/FIXED] @6,14 · stroke color/text/primary 2
  TEXT screenTitle 170x32 [HUG/HUG] · fill color/text/primary · mobile/display · "Welcome back"
  TEXT welcomeSub 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "We'll text you a one-time code to log in."
  TEXT sub 61x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Code login"
  INSTANCE Input/PhoneField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Default}
    TEXT Phone number 97x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Phone number"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
      FRAME prefix 56x48 [HUG/FILL] · horizontal pad 0/12/0/12 gap 0 · fill color/bg/subtle
        TEXT +94 32x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "+94"
      FRAME val 107x48 [HUG/FILL] · horizontal pad 0/0/0/12 gap 0
        TEXT 7X XXX XXXX 95x24 [HUG/HUG] · fill color/text/primary · mobile/body · "71 456 7890"
  INSTANCE Input/CodeInputNumeric 328x52 [FILL/HUG] · vertical pad 0 gap 8 · {State=Filled}
    FRAME digits 328x52 [FILL/HUG] · horizontal pad 0 gap 8
      FRAME d0 48x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT 7 12x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "7"
      FRAME d1 48x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT 4 14x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "4"
      FRAME d2 48x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT 0 14x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "0"
      FRAME d3 48x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT 9 13x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "9"
      FRAME d4 48x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT 3 14x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "3"
      FRAME d5 48x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT 1 10x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "1"
  INSTANCE Display/CountdownText 99x20 [HUG/HUG] · horizontal pad 0 gap 0 · {Format=Cooldown}
    TEXT countdown 99x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Resend in 0:47"
  FRAME spacer-grow 8x238 [FIXED/FILL]
  FRAME linkGroup 210x88 [HUG/HUG] · vertical pad 0 gap 0
    INSTANCE Action/Link 168x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
      TEXT label 168x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Use password instead"
    INSTANCE helpLink 210x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0 · of Action/Link
      TEXT label 210x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Trouble getting in? Get help"
  INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
    TEXT label 47x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Log in"
```

Code **7 4 0 9 3 1**.

### `1.7sus` — Login, OTP path · account suspended

**Reached from** an attempt to sign in with a code to a suspended account  ·  **Leads to** [HF](MHF-help.md) `HF.5` ("What suspension means")  ·  **Exits** back → `1.6emp`

```
FRAME 360x800 · vertical pad 6/16/24/16 gap 16 · fill color/bg/default
  FRAME backHit 44x44 [FIXED/FIXED]
    VECTOR back 8x16 [FIXED/FIXED] @6,14 · stroke color/text/primary 2
  TEXT screenTitle 170x32 [HUG/HUG] · fill color/text/primary · mobile/display · "Welcome back"
  TEXT welcomeSub 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "We'll text you a one-time code to log in."
  TEXT sub 61x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Code login"
  INSTANCE formBanner 328x120 [FILL/HUG] · horizontal pad 10/12/10/12 gap 0 · stroke color/border/error 1 · r8 · of Feedback/FormBanner · {Kind=Error}
    TEXT message 296x100 [FIXED/HUG] · fill color/state/danger · mobile/secondary · "This account has been suspended. Staff make that decision and it takes effect immediately. Trying the password instead will not work either, and YouthLink has no appeals process."
  INSTANCE Input/PhoneField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Disabled}
    TEXT Phone number 97x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Phone number"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/subtle · stroke color/border/default 1 · r8
      FRAME prefix 56x48 [HUG/FILL] · horizontal pad 0/12/0/12 gap 0 · fill color/bg/subtle
        TEXT +94 32x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "+94"
      FRAME val 107x48 [HUG/FILL] · horizontal pad 0/0/0/12 gap 0
        TEXT 7X XXX XXXX 95x24 [HUG/HUG] · fill color/text/primary · mobile/body · "71 987 6543"
  INSTANCE Input/CodeInputNumeric 328x52 [FILL/HUG] · vertical pad 0 gap 8 · {State=Filled}
    FRAME digits 328x52 [FILL/HUG] · horizontal pad 0 gap 8
      FRAME d0 48x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT 6 13x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "6"
      FRAME d1 48x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT 3 14x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "3"
      FRAME d2 48x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT 9 13x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "9"
      FRAME d3 48x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT 2 13x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "2"
      FRAME d4 48x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT 0 14x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "0"
      FRAME d5 48x52 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT 8 13x26 [HUG/HUG] · fill color/text/primary · mobile/display-number · "8"
  FRAME spacer-grow 8x182 [FIXED/FILL]
  FRAME linkGroup 184x44 [HUG/HUG] · vertical pad 0 gap 0
    INSTANCE helpLink 184x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0 · of Action/Link
      TEXT label 184x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "What suspension means"
  INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/subtle · stroke color/border/default 1 · r8 · {Style=Primary, State=Disabled}
    TEXT label 47x24 [HUG/HUG] · fill color/text/secondary · mobile/body-medium · "Log in"
```

The same refusal on the code path, with Gunasekara's number and a code he did receive — **6 3 9 2 0
8** — so the screen shows that verifying the phone does not get a suspended account in.

## Forgotten password and account recovery

A reset code goes to the verified phone, or a link to the
verified email (`FR-ACC-10`). When **neither** can reach the person, the account is recovered by a person:
the request confirms the details on the account and an Admin approves it on the dashboard (M11
`11.8rec1`–`11.8rec3`). These four screens are **Nethmi Jayasinghe's** request of Sat 5 Sep — her phone
was lost and she never added an email.

### `1.8` — Forgot password, request

**Reached from** `1.6`, `1.6emp`, `1.6s` · in the demo `1.6bnr1`, `1.6bnr2`, `1.6bnr3`  ·  **Leads to** `1.9` ("Send reset code"), [HF](MHF-help.md) `HF.5` ("Trouble getting in? Get help")  ·  **Exits** back → `1.6`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Forgot password"
  FRAME content 360x744 [FILL/FILL] · vertical pad 24/16/24/16 gap 16
    TEXT explainer 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Choose where we should send your reset code."
    INSTANCE Input/RoleOption 328x78 [FILL/HUG] · horizontal pad 16 gap 12 · fill color/bg/default · stroke color/brand/primary 2 · r8 · {State=Selected}
      FRAME radio 20x20 [FIXED/FIXED]
        ELLIPSE ring 20x20 [FIXED/FIXED] @0,0 · stroke color/brand/primary 2
        ELLIPSE dot 10x10 [FIXED/FIXED] @5,5 · fill color/brand/primary
      FRAME copy 165x46 [HUG/HUG] · vertical pad 0 gap 2
        TEXT title 117x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Text me a code"
        TEXT description 165x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "SMS to +94 77 123 4567"
    INSTANCE Input/RoleOption 328x78 [FILL/HUG] · horizontal pad 16 gap 12 · fill color/bg/default · stroke color/border/default 1.5 · r8 · {State=Default}
      FRAME radio 20x20 [FIXED/FIXED]
        ELLIPSE ring 20x20 [FIXED/FIXED] @0,0 · stroke color/border/default 1.5
      FRAME copy 173x46 [HUG/HUG] · vertical pad 0 gap 2
        TEXT title 113x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Email me a link"
        TEXT description 173x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "To kavindu@example.com"
    INSTANCE helpLink 210x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0 · of Action/Link
      TEXT label 210x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Trouble getting in? Get help"
    FRAME spacer-grow 8x348 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 125x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Send reset code"
```

**Kavindu has both channels**: SMS to his phone, or a link to `kavindu@example.com` (added after he
registered). The selected option decides the button.

### `1.8e` — Forgot password, request · employer

**Reached from** `1.6e`  ·  **Leads to** `1.9` ("Send reset code"), [HF](MHF-help.md) `HF.5` ("Trouble getting in? Get help")  ·  **Exits** back → `1.6e`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Forgot password"
  FRAME content 360x744 [FILL/FILL] · vertical pad 24/16/24/16 gap 16
    TEXT explainer 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Choose where we should send your reset code."
    INSTANCE Input/RoleOption 328x78 [FILL/HUG] · horizontal pad 16 gap 12 · fill color/bg/default · stroke color/brand/primary 2 · r8 · {State=Selected}
      FRAME radio 20x20 [FIXED/FIXED]
        ELLIPSE ring 20x20 [FIXED/FIXED] @0,0 · stroke color/brand/primary 2
        ELLIPSE dot 10x10 [FIXED/FIXED] @5,5 · fill color/brand/primary
      FRAME copy 164x46 [HUG/HUG] · vertical pad 0 gap 2
        TEXT title 117x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Text me a code"
        TEXT description 164x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "SMS to +94 11 234 5678"
    INSTANCE Input/RoleOption 328x78 [FILL/HUG] · horizontal pad 16 gap 12 · fill color/bg/default · stroke color/border/default 1.5 · r8 · {State=Default}
      FRAME radio 20x20 [FIXED/FIXED]
        ELLIPSE ring 20x20 [FIXED/FIXED] @0,0 · stroke color/border/default 1.5
      FRAME copy 159x46 [HUG/HUG] · vertical pad 0 gap 2
        TEXT title 113x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Email me a link"
        TEXT description 159x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "To hello@lankaevents.lk"
    INSTANCE helpLink 210x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0 · of Action/Link
      TEXT label 210x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Trouble getting in? Get help"
    FRAME spacer-grow 8x348 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 125x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Send reset code"
```

Lanka Events: SMS to the landline, or a link to `hello@lankaevents.lk`.

### `1.8v` — Forgot password, request · verifier

**Reached from** `1.6v`  ·  **Leads to** `1.9` ("Send reset code"), [HF](MHF-help.md) `HF.5` ("Trouble getting in? Get help")  ·  **Exits** back → `1.6v`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Forgot password"
  FRAME content 360x744 [FILL/FILL] · vertical pad 24/16/24/16 gap 16
    TEXT explainer 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Choose where we should send your reset code."
    INSTANCE Input/RoleOption 328x78 [FILL/HUG] · horizontal pad 16 gap 12 · fill color/bg/default · stroke color/brand/primary 2 · r8 · {State=Selected}
      FRAME radio 20x20 [FIXED/FIXED]
        ELLIPSE ring 20x20 [FIXED/FIXED] @0,0 · stroke color/brand/primary 2
        ELLIPSE dot 10x10 [FIXED/FIXED] @5,5 · fill color/brand/primary
      FRAME copy 165x46 [HUG/HUG] · vertical pad 0 gap 2
        TEXT title 117x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Text me a code"
        TEXT description 165x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "SMS to +94 71 456 7890"
    INSTANCE Input/RoleOption 328x78 [FILL/HUG] · horizontal pad 16 gap 12 · fill color/bg/default · stroke color/border/default 1.5 · r8 · {State=Default}
      FRAME radio 20x20 [FIXED/FIXED]
        ELLIPSE ring 20x20 [FIXED/FIXED] @0,0 · stroke color/border/default 1.5
      FRAME copy 164x46 [HUG/HUG] · vertical pad 0 gap 2
        TEXT title 113x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Email me a link"
        TEXT description 164x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "To sunil.b@example.com"
    INSTANCE helpLink 210x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0 · of Action/Link
      TEXT label 210x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Trouble getting in? Get help"
    FRAME spacer-grow 8x348 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 125x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Send reset code"
```

Sunil Bandara: SMS, or a link to `sunil.b@example.com`.

### `1.9` — Password reset, new password

**Reached from** `1.8`, `1.8e`, `1.8rec1`, `1.8rec4`, `1.8v`  ·  **Leads to** `1.6` ("Set new password")  ·  **Exits** back → `1.8`

*In the demo:* each role's reset returns to its own login — `1.6e`, `1.6v`; Nethmi's recovery backs out to `1.8rec4` and finishes on `1.6emp`.

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Reset password"
  FRAME content 360x744 [FILL/FILL] · vertical pad 24/16/24/16 gap 16
    INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Default, Type=Secure}
      TEXT label 99x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "New password"
      FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT value 272x24 [FILL/HUG] · fill color/text/secondary · mobile/body · "••••••••••"
        FRAME eye 24x24 [FIXED/FIXED]
          ELLIPSE Ellipse 20x12 [FIXED/FIXED] @2,6 · stroke color/text/secondary 1.5
          ELLIPSE Ellipse 7x7 [FIXED/FIXED] @9,9 · fill color/text/secondary
    INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Default, Type=Secure}
      TEXT label 153x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Confirm new password"
      FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT value 272x24 [FILL/HUG] · fill color/text/secondary · mobile/body · "••••••••••"
        FRAME eye 24x24 [FIXED/FIXED]
          ELLIPSE Ellipse 20x12 [FIXED/FIXED] @2,6 · stroke color/text/secondary 1.5
          ELLIPSE Ellipse 7x7 [FIXED/FIXED] @9,9 · fill color/text/secondary
    TEXT pwHelp 328x40 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "8 to 64 characters — spaces allowed, no other rules."
    TEXT signOutLine 328x40 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "Changing your password signs you out on any other device."
    FRAME spacer-grow 8x344 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 141x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Set new password"
```

**Shared by every role** — it shows no personal data. New password twice, the 8–64 rule, and the fact
that setting it signs out other devices (`FR-ACC-11`).

### `1.8rec1` — Forgot password, request · neither channel works

**Reached from** the login screen's Forgot password?, when the account has no working channel  ·  **Leads to** `1.8bnr` ("Neither of these works for me"), `1.9` ("Send reset code"), [HF](MHF-help.md) `HF.5` ("Trouble getting in? Get help")  ·  **Exits** back → `1.6emp`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Forgot password"
  FRAME content 360x744 [FILL/FILL] · vertical pad 24/16/24/16 gap 16
    TEXT explainer 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Choose where we should send your reset code."
    INSTANCE Input/RoleOption 328x78 [FILL/HUG] · horizontal pad 16 gap 12 · fill color/bg/default · stroke color/brand/primary 2 · r8 · {State=Selected}
      FRAME radio 20x20 [FIXED/FIXED]
        ELLIPSE ring 20x20 [FIXED/FIXED] @0,0 · stroke color/brand/primary 2
        ELLIPSE dot 10x10 [FIXED/FIXED] @5,5 · fill color/brand/primary
      FRAME copy 167x46 [HUG/HUG] · vertical pad 0 gap 2
        TEXT title 117x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Text me a code"
        TEXT description 167x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "SMS to +94 76 234 5678"
    INSTANCE Input/RoleOption 328x78 [FILL/HUG] · horizontal pad 16 gap 12 · fill color/bg/default · stroke color/border/default 1.5 · r8 · {State=Default}
      FRAME radio 20x20 [FIXED/FIXED]
        ELLIPSE ring 20x20 [FIXED/FIXED] @0,0 · stroke color/border/default 1.5
      FRAME copy 217x46 [HUG/HUG] · vertical pad 0 gap 2
        TEXT title 113x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Email me a link"
        TEXT description 217x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "No verified email on this account"
    FRAME linkGroup 226x88 [HUG/HUG] · vertical pad 0 gap 0
      INSTANCE recoverLink 226x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0 · of Action/Link
        TEXT label 226x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Neither of these works for me"
      INSTANCE helpLink 210x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0 · of Action/Link
        TEXT label 210x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Trouble getting in? Get help"
    FRAME spacer-grow 8x304 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 125x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Send reset code"
```

**Nethmi Jayasinghe, Sat 5 Sep.** Her only phone, +94 76 234 5678, has been lost, and the email option
says *No verified email on this account*. The third link, *Neither of these works for me*, is the way into
recovery.

### `1.8bnr` — Forgot password, request · neither channel reachable

**Reached from** `1.8rec1`  ·  **Leads to** `1.8rec2` ("Recover my account"), [HF](MHF-help.md) `HF.5` ("Trouble getting in? Get help")  ·  **Exits** back → `1.8rec1`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Forgot password"
  FRAME content 360x744 [FILL/FILL] · vertical pad 24/16/24/16 gap 16
    INSTANCE formBanner 328x60 [FILL/HUG] · horizontal pad 10/12/10/12 gap 0 · stroke color/border/error 1 · r8 · of Feedback/FormBanner · {Kind=Error}
      TEXT message 296x40 [FIXED/HUG] · fill color/state/danger · mobile/secondary · "We can't reach you by phone or email, so we can't reset your password automatically."
    TEXT explainer 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Choose where we should send your reset code."
    INSTANCE Input/RoleOption 328x78 [FILL/HUG] · horizontal pad 16 gap 12 · fill color/bg/default · stroke color/brand/primary 2 · r8 · {State=Selected}
      FRAME radio 20x20 [FIXED/FIXED]
        ELLIPSE ring 20x20 [FIXED/FIXED] @0,0 · stroke color/brand/primary 2
        ELLIPSE dot 10x10 [FIXED/FIXED] @5,5 · fill color/brand/primary
      FRAME copy 228x46 [HUG/HUG] · vertical pad 0 gap 2
        TEXT title 117x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Text me a code"
        TEXT description 228x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "+94 76 234 5678 — not reachable"
    INSTANCE Input/RoleOption 328x78 [FILL/HUG] · horizontal pad 16 gap 12 · fill color/bg/default · stroke color/border/default 1.5 · r8 · {State=Default}
      FRAME radio 20x20 [FIXED/FIXED]
        ELLIPSE ring 20x20 [FIXED/FIXED] @0,0 · stroke color/border/default 1.5
      FRAME copy 217x46 [HUG/HUG] · vertical pad 0 gap 2
        TEXT title 113x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Email me a link"
        TEXT description 217x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "No verified email on this account"
    INSTANCE helpLink 210x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0 · of Action/Link
      TEXT label 210x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Trouble getting in? Get help"
    FRAME spacer-grow 8x272 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 156x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Recover my account"
```

Both options, now marked as unreachable — *+94 76 234 5678 — not reachable* — under an error banner
that explains why the reset cannot be automatic. The button becomes **Recover my account**.

### `1.8rec2` — Account recovery · confirm your identity

**Reached from** `1.8bnr`  ·  **Leads to** `1.8rec3` ("Submit request")  ·  **Exits** back → history, ✕ → `1.6emp`

```
FRAME 360x800 · vertical pad 6/16/24/16 gap 8 · fill color/bg/default
  FRAME topBar 328x52 [FILL/HUG] · horizontal pad 0/0/8/0 gap 0 · [standard, see header]
  TEXT screenTitle 254x32 [HUG/HUG] · fill color/text/primary · mobile/display · "Recover your account"
  TEXT explainer 328x40 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "Confirm the details on the account. An admin reviews every request — this isn't instant."
  INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Text}
    TEXT label 25x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "NIC"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
      TEXT value 304x24 [FILL/HUG] · fill color/text/primary · mobile/body · "200156789012"
  TEXT nicHelp 328x40 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "12 digits, or 9 digits + V or X — only the shape is checked."
  INSTANCE Input/DateTimeField 328x74 [FIXED/HUG] · vertical pad 0 gap 6 · {State=Filled}
    TEXT label 62x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Birthdate"
    FRAME field 328x48 [FILL/HUG] · horizontal pad 12 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
      TEXT value 292x24 [FILL/HUG] · fill color/text/primary · mobile/body · "2001-03-08"
      VECTOR calendar 12x12 [FIXED/FIXED] · stroke color/text/secondary 1.5
  INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Text}
    TEXT label 77x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Legal name"
    FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
      TEXT value 304x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Nethmi Jayasinghe"
  TEXT outcomeNote 328x40 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "We'll show the outcome here when it's been reviewed. Keep the app installed on this device."
  FRAME spacer-grow 8x228 [FIXED/FILL]
  INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
    TEXT label 117x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Submit request"
```

**The request.** Nethmi confirms the details on the account — NIC 200156789012, birthdate
2001-03-08, legal name — and the screen says an Admin reviews every request and that it is not instant.
These are exactly the details the Admin compares on M11 `11.8rec1`.

### `1.8rec3` — Account recovery · request submitted

**Reached from** `1.8rec2`  ·  **Leads to** nothing  ·  **Exits** back → `1.6emp`

*In the demo:* Done → `1.8rec4`, once the Admin has approved (M11 `11.8rec2`).

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Recover your account"
  FRAME content 360x744 [FILL/FILL] · vertical pad 24/16/24/16 gap 16
    INSTANCE formBanner 328x60 [FILL/HUG] · horizontal pad 10/12/10/12 gap 0 · fill color/bg/subtle · stroke color/border/default 1 · r8 · of Feedback/FormBanner · {Kind=Info}
      TEXT message 296x40 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Request received. An admin will review it, and the outcome will appear here."
    TEXT note 328x60 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "You don't need to do anything else. Keep the app installed on this device so we can show you the result."
    FRAME spacer-grow 8x480 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 41x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Done"
```

Request received; the outcome will appear here. Nothing else is asked of her.

### `1.8rec4` — Account recovery · approved, set a new password

**Reached from** in the demo `1.8rec3`  ·  **Leads to** `1.9` ("Set new password")  ·  **Exits** back → `1.6emp`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Recover your account"
  FRAME content 360x744 [FILL/FILL] · vertical pad 24/16/24/16 gap 16
    INSTANCE formBanner 328x60 [FILL/HUG] · horizontal pad 10/12/10/12 gap 0 · fill color/bg/subtle · stroke color/border/default 1 · r8 · of Feedback/FormBanner · {Kind=Info}
      TEXT message 296x40 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Your account has been recovered. Set a new password to finish."
    TEXT note 328x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Your ratings, completed gigs and endorsements are unchanged."
    FRAME spacer-grow 8x500 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 141x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Set new password"
```

**Approved** — the Admin approved it at 10:15 AM (M11 `11.8rec2`, `11.6rec`). She sets a new password;
her ratings, completed gigs and endorsements are unchanged.

## Own profile

What a person sees of themselves on the Profile tab (`FR-PROF-01`, `FR-PROF-06`). A
worker's profile carries the endorsement section and the code they share to be vouched for (M8); an
employer's carries its display name and bio; a verifier's, the people they have vouched for. **A Business
employer is shown by its business name** (`FR-PROF-01` as amended 2026-09-24); the person behind it is
named in Settings. `1.19` is the other direction — a profile seen by someone the person has dealt with.

### `1.18z` — Own profile · first run

**Reached from** the Profile tab on a brand-new worker account  ·  **Leads to** [M8](M8-endorsement.md) `8.1` ("My endorsement code")

*In the demo:* Settings → `1.10`.

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 16
    FRAME nameRow 270x28 [HUG/HUG] · horizontal pad 0 gap 8
      TEXT displayName 147x28 [HUG/HUG] · fill color/text/primary · mobile/title · "Kavindu Perera"
      INSTANCE Display/Badge 115x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
        VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
        TEXT label 82x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Phone verified"
    INSTANCE Display/ProfileTrustBlock 328x56 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Tier=ZeroHistory}
      FRAME headline 135x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT headline 135x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "New to YouthLink"
    TEXT bioPrompt 328x48 [FIXED/HUG] · fill color/brand/primary · mobile/body · "Add a short bio to help employers know you."
    TEXT sectionEndorsements 99x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "ENDORSEMENTS"
    TEXT emptyNote 328x40 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "No endorsements yet. Share your code and someone who knows you can vouch for you."
    FRAME row-EndorsementCode 328x52 [FILL/HUG] · horizontal pad 14 gap 8 · fill color/bg/default · r10
      TEXT EndorsementCode 286x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "My endorsement code"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    FRAME row-Settings 328x52 [FILL/HUG] · horizontal pad 14 gap 8 · fill color/bg/default · r10
      TEXT Settings 286x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Settings"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=false, Role=Worker} · [standard, see header]
```

**Kavindu on day one**: *New to YouthLink*, no endorsement, and the bio prompt as a link. The
endorsement section says what to do about being empty — share the code.

### `1.18` — Own profile

**Reached from** `1.6s`, `1.6sub`, `1.7`, `8.6` · the worker's Profile tab, and back from [M7](M7-profile.md) `7.1`  ·  **Leads to** `1.10` ("Settings"), [M7](M7-profile.md) `7.1` ("Add a short bio…"), [M8](M8-endorsement.md) `8.1` ("My endorsement code")

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 16
    FRAME nameRow 270x28 [HUG/HUG] · horizontal pad 0 gap 8
      TEXT displayName 147x28 [HUG/HUG] · fill color/text/primary · mobile/title · "Kavindu Perera"
      INSTANCE Display/Badge 115x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
        VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
        TEXT label 82x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Phone verified"
    INSTANCE Display/ProfileTrustBlock 328x84 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Tier=ZeroHistory}
      FRAME headline 232x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT headline 135x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "New to YouthLink"
        INSTANCE Display/Badge 89x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/endorsed 1 · r999 · {Family=Endorsed, Value=Default}
          VECTOR diamond 10x10 [FIXED/FIXED] · fill color/badge/endorsed
          TEXT label 54x16 [HUG/HUG] · fill color/badge/endorsed · mobile/caption · "Endorsed"
      TEXT endorsedBy 178x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Endorsed by Sunil Bandara"
    TEXT bioPrompt 328x48 [FIXED/HUG] · fill color/brand/primary · mobile/body · "Add a short bio to help employers know you."
    TEXT sectionEndorsements 99x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "ENDORSEMENTS"
    INSTANCE Display/EndorsementRow 328x136 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show revoke=false, State=Default}
      FRAME nameRow 106x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT endorserName 106x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Sunil Bandara"
      TEXT relationship 237x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "My neighbour — known him 8 years"
      FRAME attributes 202x44 [HUG/HUG] · horizontal pad 0 gap 8
        INSTANCE Input/Chip 92x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · stroke color/badge/endorsed 1 · r999 · {Kind=Display, State=Default}
          TEXT label 64x20 [HUG/HUG] · fill color/badge/endorsed · mobile/secondary · "Reliability"
        INSTANCE Input/Chip 102x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · stroke color/badge/endorsed 1 · r999 · {Kind=Display, State=Default}
          TEXT label 74x20 [HUG/HUG] · fill color/badge/endorsed · mobile/secondary · "Punctuality"
    FRAME row-EndorsementCode 328x52 [FILL/HUG] · horizontal pad 14 gap 8 · fill color/bg/default · r10
      TEXT EndorsementCode 286x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "My endorsement code"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    FRAME row-Settings 328x52 [FILL/HUG] · horizontal pad 14 gap 8 · fill color/bg/default · r10
      TEXT Settings 286x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Settings"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Worker} · [standard, see header]
```

**Endorsed, still zero history** (Fri 28 Aug, after Sunil Bandara vouched). The `Endorsed` badge sits
beside *New to YouthLink*, and the endorsement row quotes Sunil's relationship line exactly as M8 records it:
*My neighbour — known him 8 years*. No bio yet.

### `8.6` — Bio prompt (dialog)

**Opens over** `1.18` (in the demo, after logging in)  ·  **Not now returns to** `1.18`  ·  **Confirm** → [M7](M7-profile.md) `7.1` ("Add bio")

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 16
    FRAME nameRow 270x28 [HUG/HUG] · horizontal pad 0 gap 8
      TEXT displayName 147x28 [HUG/HUG] · fill color/text/primary · mobile/title · "Kavindu Perera"
      INSTANCE Display/Badge 115x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
        VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
        TEXT label 82x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Phone verified"
    INSTANCE Display/ProfileTrustBlock 328x84 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Tier=ZeroHistory}
      FRAME headline 232x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT headline 135x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "New to YouthLink"
        INSTANCE Display/Badge 89x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/endorsed 1 · r999 · {Family=Endorsed, Value=Default}
          VECTOR diamond 10x10 [FIXED/FIXED] · fill color/badge/endorsed
          TEXT label 54x16 [HUG/HUG] · fill color/badge/endorsed · mobile/caption · "Endorsed"
      TEXT endorsedBy 178x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Endorsed by Sunil Bandara"
    TEXT bioPrompt 328x48 [FIXED/HUG] · fill color/brand/primary · mobile/body · "Add a short bio to help employers know you."
    TEXT sectionEndorsements 99x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "ENDORSEMENTS"
    INSTANCE Display/EndorsementRow 328x136 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show revoke=false, State=Default}
      FRAME nameRow 106x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT endorserName 106x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Sunil Bandara"
      TEXT relationship 237x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "My neighbour — known him 8 years"
      FRAME attributes 202x44 [HUG/HUG] · horizontal pad 0 gap 8
        INSTANCE Input/Chip 92x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · stroke color/badge/endorsed 1 · r999 · {Kind=Display, State=Default}
          TEXT label 64x20 [HUG/HUG] · fill color/badge/endorsed · mobile/secondary · "Reliability"
        INSTANCE Input/Chip 102x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · stroke color/badge/endorsed 1 · r999 · {Kind=Display, State=Default}
          TEXT label 74x20 [HUG/HUG] · fill color/badge/endorsed · mobile/secondary · "Punctuality"
    FRAME row-EndorsementCode 328x52 [FILL/HUG] · horizontal pad 14 gap 8 · fill color/bg/default · r10
      TEXT EndorsementCode 286x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "My endorsement code"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    FRAME row-Settings 328x52 [FILL/HUG] · horizontal pad 14 gap 8 · fill color/bg/default · r10
      TEXT Settings 286x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Settings"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Worker} · [standard, see header]
  RECTANGLE scrim 360x800 [FIXED/FIXED] @0,0 · fill color/overlay/scrim · opacity 40%
  FRAME promptCard 328x176 [HUG/HUG] @16,312 · vertical pad 20/20/16/20 gap 12 · fill color/bg/default · r12
    TEXT promptTitle 288x28 [FIXED/HUG] · fill color/text/primary · mobile/title · "Add a short bio?"
    TEXT promptBody 288x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "A line about yourself helps employers pick you. It takes a minute."
    FRAME actions 288x48 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Action/Button 112x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 64x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Not now"
      INSTANCE Action/Button 107x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
        TEXT label 59x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Add bio"
```

**The one-time bio prompt** (`FR-ENDORSE-13`), over `1.18`, for a zero-history worker with no bio.
*Not now* returns to the profile; *Add bio* opens the editor (M7 `7.1`). Once a bio is saved, or the worker
has rating history, it does not appear again. An M8 screen, drawn here because it
opens over this page's profile.

### `1.18bio` — Own profile · bio added

**Reached from** [M7](M7-profile.md) `7.1d` (Done)  ·  **Leads to** `1.10` ("Settings"), [M7](M7-profile.md) `7.1` (the bio), [M8](M8-endorsement.md) `8.1` ("My endorsement code")

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 16
    FRAME nameRow 270x28 [HUG/HUG] · horizontal pad 0 gap 8
      TEXT displayName 147x28 [HUG/HUG] · fill color/text/primary · mobile/title · "Kavindu Perera"
      INSTANCE Display/Badge 115x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
        VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
        TEXT label 82x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Phone verified"
    INSTANCE Display/ProfileTrustBlock 328x84 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Tier=ZeroHistory}
      FRAME headline 232x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT headline 135x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "New to YouthLink"
        INSTANCE Display/Badge 89x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/endorsed 1 · r999 · {Family=Endorsed, Value=Default}
          VECTOR diamond 10x10 [FIXED/FIXED] · fill color/badge/endorsed
          TEXT label 54x16 [HUG/HUG] · fill color/badge/endorsed · mobile/caption · "Endorsed"
      TEXT endorsedBy 178x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Endorsed by Sunil Bandara"
    TEXT bioText 328x168 [FILL/HUG] · fill color/text/secondary · mobile/body · "Second-year IT student in Colombo, free on weekends and most evenings. I've helped run my family's shop for years, so I'm comfortable handling sales, stock and customers. Reliable with time, quick to learn new tasks, and happy to take on setup, delivery or tutoring work."
    TEXT sectionEndorsements 99x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "ENDORSEMENTS"
    INSTANCE Display/EndorsementRow 328x136 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show revoke=false, State=Default}
      FRAME nameRow 106x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT endorserName 106x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Sunil Bandara"
      TEXT relationship 237x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "My neighbour — known him 8 years"
      FRAME attributes 202x44 [HUG/HUG] · horizontal pad 0 gap 8
        INSTANCE Input/Chip 92x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · stroke color/badge/endorsed 1 · r999 · {Kind=Display, State=Default}
          TEXT label 64x20 [HUG/HUG] · fill color/badge/endorsed · mobile/secondary · "Reliability"
        INSTANCE Input/Chip 102x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · stroke color/badge/endorsed 1 · r999 · {Kind=Display, State=Default}
          TEXT label 74x20 [HUG/HUG] · fill color/badge/endorsed · mobile/secondary · "Punctuality"
    FRAME row-EndorsementCode 328x52 [FILL/HUG] · horizontal pad 14 gap 8 · fill color/bg/default · r10
      TEXT EndorsementCode 286x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "My endorsement code"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    FRAME row-Settings 328x52 [FILL/HUG] · horizontal pad 14 gap 8 · fill color/bg/default · r10
      TEXT Settings 286x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Settings"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Worker} · [standard, see header]
```

The same day, after the bio is saved: the 271-character bio from M7 `7.1`, word for word, replaces the
prompt.

### `1.18b` — Own profile · history earned

**Reached from** the Profile tab on Sat 5 Sep, and back from [M8](M8-endorsement.md) `8.1b`  ·  **Leads to** `1.10` ("Settings"), [M7](M7-profile.md) `7.1` (the bio), [M8](M8-endorsement.md) `8.1b` ("My endorsement code · closed")

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 16
    FRAME nameRow 270x28 [HUG/HUG] · horizontal pad 0 gap 8
      TEXT displayName 147x28 [HUG/HUG] · fill color/text/primary · mobile/title · "Kavindu Perera"
      INSTANCE Display/Badge 115x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
        VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
        TEXT label 82x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Phone verified"
    INSTANCE Display/ProfileTrustBlock 328x84 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Tier=History}
      INSTANCE Display/StarsDisplay 136x24 [HUG/HUG] · horizontal pad 0 gap 6
        STAR star 16x16 [FIXED/FIXED] · fill color/badge/rating
        TEXT avg 24x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "5.0"
        TEXT count 84x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "from 1 rating"
      TEXT completion 156x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "100% completion · 1 job"
    TEXT bioText 328x168 [FIXED/HUG] · fill color/text/secondary · mobile/body · "Second-year IT student in Colombo, free on weekends and most evenings. I've helped run my family's shop for years, so I'm comfortable handling sales, stock and customers. Reliable with time, quick to learn new tasks, and happy to take on setup, delivery or tutoring work."
    TEXT sectionEndorsements 99x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "ENDORSEMENTS"
    INSTANCE Display/EndorsementRow 328x136 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show revoke=false, State=Default}
      FRAME nameRow 106x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT endorserName 106x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Sunil Bandara"
      TEXT relationship 237x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "My neighbour — known him 8 years"
      FRAME attributes 202x44 [HUG/HUG] · horizontal pad 0 gap 8
        INSTANCE Input/Chip 92x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · stroke color/badge/endorsed 1 · r999 · {Kind=Display, State=Default}
          TEXT label 64x20 [HUG/HUG] · fill color/badge/endorsed · mobile/secondary · "Reliability"
        INSTANCE Input/Chip 102x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · stroke color/badge/endorsed 1 · r999 · {Kind=Display, State=Default}
          TEXT label 74x20 [HUG/HUG] · fill color/badge/endorsed · mobile/secondary · "Punctuality"
    FRAME row-EndorsementCode 328x52 [FILL/HUG] · horizontal pad 14 gap 8 · fill color/bg/default · r10
      TEXT EndorsementCode 286x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "My endorsement code · closed"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    FRAME row-Settings 328x52 [FILL/HUG] · horizontal pad 14 gap 8 · fill color/bg/default · r10
      TEXT Settings 286x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Settings"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Worker} · [standard, see header]
```

**Sat 5 Sep, after the reveal**: *5.0 from 1 rating · 100% completion · 1 job* — the Saman Stores
engagement, settled by the 4 Sep ruling and rated. The endorsement code row now reads *closed* (M8 `8.1b`):
eligibility for endorsement closed permanently when his first rating landed (`FR-ENDORSE-05`).

### `1.18ez` — Own profile · employer, first run

**Reached from** `1.5`, `1.5b` · the Profile tab on a brand-new employer account  ·  **Leads to** nothing

*In the demo:* Settings → `1.10e`.

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 16
    FRAME nameRow 328x56 [FILL/HUG] · horizontal pad 0 gap 8
      TEXT displayName 218x28 [HUG/HUG] · fill color/text/primary · mobile/title · "Lanka Events (Pvt) Ltd"
      INSTANCE Display/Badge 115x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
        VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
        TEXT label 82x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Phone verified"
    INSTANCE Display/ProfileTrustBlock 328x56 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Tier=ZeroHistory}
      FRAME headline 135x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT headline 135x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "New to YouthLink"
    TEXT bioStatic 328x48 [FIXED/HUG] · fill color/text/secondary · mobile/body · "Event staffing across Colombo — weddings, corporate events and concerts."
    FRAME row-Settings 328x52 [FILL/HUG] · horizontal pad 14 gap 8 · fill color/bg/default · r10
      TEXT Settings 286x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Settings"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=false, Role=Employer} · [standard, see header]
```

**Lanka Events on the day it registered.** The display name is the business name; the bio is exactly
what `1.5b` entered. *New to YouthLink*, no location line and no history.

### `1.18e` — Own profile · employer (Lanka Events)

**Reached from** `1.6e`, `1.7e` · the Profile tab on Lanka Events' screens  ·  **Leads to** `1.10e` ("Settings")

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 16
    FRAME nameRow 328x56 [FILL/HUG] · horizontal pad 0 gap 8
      TEXT displayName 218x28 [HUG/HUG] · fill color/text/primary · mobile/title · "Lanka Events (Pvt) Ltd"
      INSTANCE Display/Badge 115x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
        VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
        TEXT label 82x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Phone verified"
    INSTANCE Display/ProfileTrustBlock 328x84 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Tier=History}
      INSTANCE Display/StarsDisplay 155x24 [HUG/HUG] · horizontal pad 0 gap 6
        STAR star 16x16 [FIXED/FIXED] · fill color/badge/rating
        TEXT avg 25x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "4.8"
        TEXT count 102x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "from 23 ratings"
      TEXT completion 186x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "23 engagements completed"
    TEXT bioStatic 328x48 [FIXED/HUG] · fill color/text/secondary · mobile/body · "Event staffing across Colombo — weddings, corporate events and concerts."
    FRAME row-Settings 328x52 [FILL/HUG] · horizontal pad 14 gap 8 · fill color/bg/default · r10
      TEXT Settings 286x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Settings"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Employer} · [standard, see header]
```

**Lanka Events, established**: *4.8 from 23 ratings · 23 engagements completed*, shown under its
business name (`FR-PROF-01` as amended). Its bio is the one it registered with. **The name row wraps**: the
business name and the *Phone verified* badge do not fit on one 328 px line, so `nameRow` fills the width
with wrapping on (4 px between lines) and the badge sits beneath the name — hence 328 × 56.

### `1.18ed` — Own profile · employer (Dilrukshi Herath)

**Reached from** the Profile tab on Dilrukshi Herath's screens (Thu 27 Aug)  ·  **Leads to** `1.10ed` ("Settings")

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 16
    FRAME nameRow 279x28 [HUG/HUG] · horizontal pad 0 gap 8
      TEXT displayName 156x28 [HUG/HUG] · fill color/text/primary · mobile/title · "Dilrukshi Herath"
      INSTANCE Display/Badge 115x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
        VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
        TEXT label 82x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Phone verified"
    INSTANCE Display/ProfileTrustBlock 328x56 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Tier=ZeroHistory}
      FRAME headline 135x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT headline 135x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "New to YouthLink"
    FRAME row-Settings 328x52 [FILL/HUG] · horizontal pad 14 gap 8 · fill color/bg/default · r10
      TEXT Settings 286x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Settings"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=false, Role=Employer} · [standard, see header]
```

**Dilrukshi Herath, Thu 27 Aug** — an individual employer, so her profile shows her legal name. *New
to YouthLink*: her only posting before Thursday, House move helpers, expired unfilled on 12 Aug. No bio.
*Settings* opens her own `1.10ed`.

### `1.18eg` — Own profile · employer (R. Gunasekara)

**Reached from** the Profile tab on R. Gunasekara's screens (31 Aug – 3 Sep)  ·  **Leads to** `1.10eg` ("Settings")

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 16
    FRAME nameRow 263x28 [HUG/HUG] · horizontal pad 0 gap 8
      TEXT displayName 140x28 [HUG/HUG] · fill color/text/primary · mobile/title · "R. Gunasekara"
      INSTANCE Display/Badge 115x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
        VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
        TEXT label 82x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Phone verified"
    INSTANCE Display/ProfileTrustBlock 328x56 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Tier=ZeroHistory}
      FRAME headline 135x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT headline 135x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "New to YouthLink"
    FRAME row-Settings 328x52 [FILL/HUG] · horizontal pad 14 gap 8 · fill color/bg/default · r10
      TEXT Settings 286x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Settings"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=false, Role=Employer} · [standard, see header]
```

**R. Gunasekara, 31 Aug – 3 Sep** — the same shape as `1.18ed`. His warnings are not on his own
profile: moderation records are staff-facing (M10, M11), and he is told about each warning by notification
(M3 `3.10eg`). *Settings* opens his own `1.10eg`.

### `1.18n` — Own profile · worker (Nethmi Jayasinghe)

**Reached from** the Profile tab on Nethmi Jayasinghe's screens, Sat 29 Aug about 2 AM, before she cancels  ·  **Leads to** `1.10n` ("Settings"), [M8](M8-endorsement.md) `8.1b` ("My endorsement code · closed")

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 16
    FRAME nameRow 308x28 [HUG/HUG] · horizontal pad 0 gap 8
      TEXT displayName 185x28 [HUG/HUG] · fill color/text/primary · mobile/title · "Nethmi Jayasinghe"
      INSTANCE Display/Badge 115x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
        VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
        TEXT label 82x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Phone verified"
    INSTANCE Display/ProfileTrustBlock 328x84 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Tier=History}
      INSTANCE Display/StarsDisplay 152x24 [HUG/HUG] · horizontal pad 0 gap 6
        STAR star 16x16 [FIXED/FIXED] · fill color/badge/rating
        TEXT avg 25x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "4.6"
        TEXT count 99x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "from 12 ratings"
      TEXT completion 165x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "92% completion · 12 jobs"
    TEXT sectionEndorsements 99x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "ENDORSEMENTS"
    INSTANCE Display/EndorsementRow 328x136 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show revoke=false, State=Default}
      FRAME nameRow 109x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT endorserName 109x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "K. Rathnayake"
      TEXT relationship 294x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Worked together at a Kandy hotel — 3 years"
      FRAME attributes 92x44 [HUG/HUG] · horizontal pad 0 gap 8
        INSTANCE Input/Chip 92x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · stroke color/badge/endorsed 1 · r999 · {Kind=Display, State=Default}
          TEXT label 64x20 [HUG/HUG] · fill color/badge/endorsed · mobile/secondary · "Reliability"
    INSTANCE Display/EndorsementRow 328x136 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show revoke=false, State=Default}
      FRAME nameRow 73x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT endorserName 73x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "M. Perera"
      TEXT relationship 157x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Neighbour for ten years"
      FRAME attributes 194x44 [HUG/HUG] · horizontal pad 0 gap 8
        INSTANCE Input/Chip 102x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · stroke color/badge/endorsed 1 · r999 · {Kind=Display, State=Default}
          TEXT label 74x20 [HUG/HUG] · fill color/badge/endorsed · mobile/secondary · "Punctuality"
        INSTANCE Input/Chip 84x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · stroke color/badge/endorsed 1 · r999 · {Kind=Display, State=Default}
          TEXT label 56x20 [HUG/HUG] · fill color/badge/endorsed · mobile/secondary · "Honesty"
    FRAME row-EndorsementCode 328x52 [FILL/HUG] · horizontal pad 14 gap 8 · fill color/bg/default · r10
      TEXT EndorsementCode 286x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "My endorsement code · closed"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    FRAME row-Settings 328x52 [FILL/HUG] · horizontal pad 14 gap 8 · fill color/bg/default · r10
      TEXT Settings 286x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Settings"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Worker} · [standard, see header]
```

**Nethmi Jayasinghe's own profile, Sat 29 Aug about 2 AM**, before she cancels (M5 `5.2n`). The same
record Lanka Events saw on Thursday in `1.19` — *4.6 from 12 ratings · 92% completion · 12 jobs*, K.
Rathnayake's and M. Perera's endorsements, no bio — because nothing has completed since. *My endorsement
code · closed*: she has rating history, so eligibility closed long ago (`FR-ENDORSE-05`); it opens M8
`8.1b`. *Settings* opens `1.10n`.

### `1.18nc` — Own profile · worker (Nethmi Jayasinghe), after her late cancellation

**Reached from** the Profile tab on Nethmi Jayasinghe's screens just after she cancels  ·  **Leads to** `1.10n` ("Settings"), [M8](M8-endorsement.md) `8.1b` ("My endorsement code · closed")

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 16
    FRAME nameRow 308x28 [HUG/HUG] · horizontal pad 0 gap 8
      TEXT displayName 185x28 [HUG/HUG] · fill color/text/primary · mobile/title · "Nethmi Jayasinghe"
      INSTANCE Display/Badge 115x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
        VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
        TEXT label 82x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Phone verified"
    INSTANCE Display/ProfileTrustBlock 328x84 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Tier=History}
      INSTANCE Display/StarsDisplay 152x24 [HUG/HUG] · horizontal pad 0 gap 6
        STAR star 16x16 [FIXED/FIXED] · fill color/badge/rating
        TEXT avg 25x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "4.6"
        TEXT count 99x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "from 12 ratings"
      TEXT completion 165x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "80% completion · 12 jobs"
    TEXT sectionEndorsements 99x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "ENDORSEMENTS"
    INSTANCE Display/EndorsementRow 328x136 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show revoke=false, State=Default}
      FRAME nameRow 109x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT endorserName 109x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "K. Rathnayake"
      TEXT relationship 294x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Worked together at a Kandy hotel — 3 years"
      FRAME attributes 92x44 [HUG/HUG] · horizontal pad 0 gap 8
        INSTANCE Input/Chip 92x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · stroke color/badge/endorsed 1 · r999 · {Kind=Display, State=Default}
          TEXT label 64x20 [HUG/HUG] · fill color/badge/endorsed · mobile/secondary · "Reliability"
    INSTANCE Display/EndorsementRow 328x136 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show revoke=false, State=Default}
      FRAME nameRow 73x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT endorserName 73x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "M. Perera"
      TEXT relationship 157x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Neighbour for ten years"
      FRAME attributes 194x44 [HUG/HUG] · horizontal pad 0 gap 8
        INSTANCE Input/Chip 102x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · stroke color/badge/endorsed 1 · r999 · {Kind=Display, State=Default}
          TEXT label 74x20 [HUG/HUG] · fill color/badge/endorsed · mobile/secondary · "Punctuality"
        INSTANCE Input/Chip 84x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · stroke color/badge/endorsed 1 · r999 · {Kind=Display, State=Default}
          TEXT label 56x20 [HUG/HUG] · fill color/badge/endorsed · mobile/secondary · "Honesty"
    FRAME row-EndorsementCode 328x52 [FILL/HUG] · horizontal pad 14 gap 8 · fill color/bg/default · r10
      TEXT EndorsementCode 286x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "My endorsement code · closed"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    FRAME row-Settings 328x52 [FILL/HUG] · horizontal pad 14 gap 8 · fill color/bg/default · r10
      TEXT Settings 286x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Settings"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Worker} · [standard, see header]
```

**Minutes later, after she cancels** (M5 `5.2nc`): *80% completion*. The cancellation came under 6
hours before the start, so it is late and weighs twice — 12 completed out of 15 counted, where it was 12
out of 13. Ratings and jobs are unchanged. The rest is `1.18n`.

### `1.18vz` — Own profile · verifier, first run

**Reached from** the Profile tab on a brand-new verifier account  ·  **Leads to** [M8](M8-endorsement.md) `8.5z` ("My endorsements")

*In the demo:* Settings → `1.10v`.

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 16
    FRAME nameRow 256x28 [HUG/HUG] · horizontal pad 0 gap 8
      TEXT displayName 133x28 [HUG/HUG] · fill color/text/primary · mobile/title · "Sunil Bandara"
      INSTANCE Display/Badge 115x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
        VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
        TEXT label 82x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Phone verified"
    INSTANCE Display/ProfileTrustBlock 328x84 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Tier=ZeroHistory}
      FRAME headline 148x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT headline 148x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Community Verifier"
      TEXT endorsedBy 229x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Vouching since today · nobody yet"
    FRAME row-MyEndorsements 328x52 [FILL/HUG] · horizontal pad 14 gap 8 · fill color/bg/default · r10
      TEXT EndorsementCode 286x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "My endorsements"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    FRAME row-Settings 328x52 [FILL/HUG] · horizontal pad 14 gap 8 · fill color/bg/default · r10
      TEXT Settings 286x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Settings"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=false, Role=Verifier} · [standard, see header]
```

Sunil Bandara on the day he registered: *Vouching since today · nobody yet*.

### `1.18v` — Own profile · verifier (Sunil Bandara)

**Reached from** `1.6v`, `1.7v` · the verifier's Profile tab  ·  **Leads to** `1.10v` ("Settings"), [M8](M8-endorsement.md) `8.5` ("My endorsements")

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 16
    FRAME nameRow 256x28 [HUG/HUG] · horizontal pad 0 gap 8
      TEXT displayName 133x28 [HUG/HUG] · fill color/text/primary · mobile/title · "Sunil Bandara"
      INSTANCE Display/Badge 115x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
        VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
        TEXT label 82x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Phone verified"
    INSTANCE Display/ProfileTrustBlock 328x84 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Tier=ZeroHistory}
      FRAME headline 148x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT headline 148x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Community Verifier"
      TEXT endorsedBy 258x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Vouching since May 2026 · 3 endorsed"
    TEXT bioStatic 328x72 [FIXED/HUG] · fill color/text/secondary · mobile/body · "Retired schoolteacher in Nugegoda. I vouch for young people I've known for years."
    FRAME row-MyEndorsements 328x52 [FILL/HUG] · horizontal pad 14 gap 8 · fill color/bg/default · r10
      TEXT EndorsementCode 286x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "My endorsements"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    FRAME row-Settings 328x52 [FILL/HUG] · horizontal pad 14 gap 8 · fill color/bg/default · r10
      TEXT Settings 286x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "Settings"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Verifier} · [standard, see header]
```

Sunil Bandara, established: *Vouching since May 2026 · 3 endorsed*, and **My endorsements** in place of
an endorsement code (a verifier vouches; they are not vouched for).

### `1.19` — Other user's profile

**Reached from** [M4](M4-applying.md) `4.6` (the applicant's name)  ·  **Leads to** nothing  ·  **Exits** back → history

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Profile"
  FRAME content 360x744 [FILL/FILL] · vertical pad 24/16/24/16 gap 16
    FRAME interactionContext 328x36 [FILL/HUG] · horizontal pad 8/12/8/12 gap 0 · fill color/bg/subtle · r8
      TEXT contextLine 267x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Applied to: Event setup crew (3 needed)"
    FRAME nameRow 308x28 [HUG/HUG] · horizontal pad 0 gap 8
      TEXT displayName 185x28 [HUG/HUG] · fill color/text/primary · mobile/title · "Nethmi Jayasinghe"
      INSTANCE Display/Badge 115x24 [HUG/HUG] · horizontal pad 4/10/4/10 gap 5 · stroke color/badge/verified 1 · r999 · {Family=Verified, Value=Default}
        VECTOR check 8x6 [FIXED/FIXED] · stroke color/badge/verified 1.8
        TEXT label 82x16 [HUG/HUG] · fill color/badge/verified · mobile/caption · "Phone verified"
    INSTANCE Display/ProfileTrustBlock 328x84 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Tier=History}
      INSTANCE Display/StarsDisplay 152x24 [HUG/HUG] · horizontal pad 0 gap 6
        STAR star 16x16 [FIXED/FIXED] · fill color/badge/rating
        TEXT avg 25x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "4.6"
        TEXT count 99x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "from 12 ratings"
      TEXT completion 165x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "92% completion · 12 jobs"
    TEXT sectionEndorsements 99x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "ENDORSEMENTS"
    INSTANCE Display/EndorsementRow 328x136 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show revoke=false, State=Default}
      FRAME nameRow 109x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT endorserName 109x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "K. Rathnayake"
      TEXT relationship 294x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Worked together at a Kandy hotel — 3 years"
      FRAME attributes 92x44 [HUG/HUG] · horizontal pad 0 gap 8
        INSTANCE Input/Chip 92x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · stroke color/badge/endorsed 1 · r999 · {Kind=Display, State=Default}
          TEXT label 64x20 [HUG/HUG] · fill color/badge/endorsed · mobile/secondary · "Reliability"
    INSTANCE Display/EndorsementRow 328x136 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show revoke=false, State=Default}
      FRAME nameRow 73x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT endorserName 73x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "M. Perera"
      TEXT relationship 157x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Neighbour for ten years"
      FRAME attributes 194x44 [HUG/HUG] · horizontal pad 0 gap 8
        INSTANCE Input/Chip 102x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · stroke color/badge/endorsed 1 · r999 · {Kind=Display, State=Default}
          TEXT label 74x20 [HUG/HUG] · fill color/badge/endorsed · mobile/secondary · "Punctuality"
        INSTANCE Input/Chip 84x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · stroke color/badge/endorsed 1 · r999 · {Kind=Display, State=Default}
          TEXT label 56x20 [HUG/HUG] · fill color/badge/endorsed · mobile/secondary · "Honesty"
```

**Nethmi Jayasinghe as Lanka Events sees her, Thu 27 Aug**, from the applicant pool: the line at the top
says why this profile is visible at all — *Applied to: Event setup crew (3 needed)* — because there is no
public directory (`FR-PROF-05`). *4.6 from 12 ratings · 92% completion · 12 jobs*, two endorsements. The
back chevron uses history, since the profile can be opened from more than one pool.

## Settings

**One screen** for everything about the account (`FR-ACC-18`): security, contact details,
display name, posting-as for an employer, notification preferences, help, sign-out and deletion. **Each
person who has a profile has their own copy**, because it shows their own contact details, and so does the
sign-out dialog over it: Kavindu, Lanka Events, Sunil Bandara, Dilrukshi Herath, R. Gunasekara and Nethmi
Jayasinghe. The forms the contact rows open are shared (next section).

### `1.10` — Settings, unified

**Reached from** `1.10s`, `1.11`, `1.11r1`, `1.12b`, `1.14b`, `1.15`, `1.18`, `1.18b`, `1.18bio` · back from [HF](MHF-help.md) `HF.1` · in the demo `1.18z`  ·  **Leads to** `1.11` ("Change password"), `1.12` ("Phone"), `1.13` ("NIC"), `1.14` ("Email"), `1.15` ("Display name"), `1.10s` ("Sign out"), `1.17` ("Delete account"), [M3](M3-discovery.md) `3.11` ("Notification preferences"), [HF](MHF-help.md) `HF.1` ("Help — how YouthLink works")  ·  **Exits** back → `1.18`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Settings"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 4
    TEXT group-SECURITY 59x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "SECURITY"
    FRAME row-Change password 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 310x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Change password"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    TEXT group-CONTACT 58x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "CONTACT"
    FRAME row-Phone 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 184x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Phone"
      TEXT rowValue 114x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "+94 77 123 4567"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    FRAME row-NIC 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 228x24 [FILL/HUG] · fill color/text/primary · mobile/body · "NIC"
      TEXT rowValue 70x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "•••• 5678"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    FRAME row-Email 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 145x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Email"
      TEXT rowValue 153x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "kavindu@example.com"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    FRAME row-DisplayName 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 198x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Display name"
      TEXT rowValue 100x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Kavindu Perera"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    TEXT group-NOTIFICATIONS 92x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "NOTIFICATIONS"
    FRAME row-NotifPrefs 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 310x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Notification preferences"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    TEXT group-SUPPORT 57x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "SUPPORT"
    FRAME row-Help 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 310x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Help — how YouthLink works"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    TEXT group-ACCOUNT 60x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "ACCOUNT"
    FRAME row-Sign out 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 310x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Sign out"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    FRAME row-Delete account 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 310x24 [FILL/HUG] · fill color/state/danger · mobile/body · "Delete account"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
```

**Kavindu's Settings.** Contact rows show the current values — phone, NIC masked to its last four,
email, display name. **Notification preferences** is a row that opens M3 `3.11`, where the two job-seeker
preferences live (`FR-NOTIF-03`); the toggles are not repeated here.

### `1.10s` — Settings, unified · Sign out? (dialog)

**Opens over** `1.10`  ·  **Cancel returns to** `1.10`  ·  **Confirm** → `1.6` ("Sign out")

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Settings"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 4
    TEXT group-SECURITY 59x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "SECURITY"
    FRAME row-Change password 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 310x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Change password"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    TEXT group-CONTACT 58x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "CONTACT"
    FRAME row-Phone 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 184x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Phone"
      TEXT rowValue 114x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "+94 77 123 4567"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    FRAME row-NIC 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 228x24 [FILL/HUG] · fill color/text/primary · mobile/body · "NIC"
      TEXT rowValue 70x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "•••• 5678"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    FRAME row-Email 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 145x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Email"
      TEXT rowValue 153x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "kavindu@example.com"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    FRAME row-DisplayName 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 198x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Display name"
      TEXT rowValue 100x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Kavindu Perera"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    TEXT group-NOTIFICATIONS 92x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "NOTIFICATIONS"
    FRAME row-NotifPrefs 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 310x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Notification preferences"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    TEXT group-SUPPORT 57x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "SUPPORT"
    FRAME row-Help 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 310x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Help — how YouthLink works"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    TEXT group-ACCOUNT 60x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "ACCOUNT"
    FRAME row-Sign out 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 310x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Sign out"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    FRAME row-Delete account 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 310x24 [FILL/HUG] · fill color/state/danger · mobile/body · "Delete account"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
  RECTANGLE scrim 360x800 [FIXED/FIXED] @0,0 · fill color/overlay/scrim · opacity 40%
  INSTANCE Feedback/ConfirmDialog 328x200 [FIXED/HUG] @16,300 · vertical pad 20 gap 12 · fill color/bg/default · r12
    TEXT title 217x28 [HUG/HUG] · fill color/text/primary · mobile/title · "Sign out of YouthLink?"
    TEXT body 288x60 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Other devices stay signed in. Sign back in any time with your phone and password, or a one-time code."
    FRAME actions 288x48 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Action/Button 101x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 53x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Cancel"
      INSTANCE Action/Button 112x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
        TEXT label 64x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Sign out"
```

Sign out, confirmed: other devices stay signed in, and the way back in is named. Cancel returns to
`1.10`; Sign out lands on the login screen with the number remembered.

### `1.10e` — Settings, unified · employer (Lanka Events)

**Reached from** `1.10se`, `1.15e`, `1.15eb`, `1.16`, `1.18e` · in the demo `1.18ez`, `1.11`, `1.12b`, `1.14b`  ·  **Leads to** `1.11` ("Change password"), `1.12` ("Phone"), `1.13` ("NIC"), `1.14` ("Email"), `1.15e` ("Display name"), `1.15eb` ("Business name & bio"), `1.16` ("Posting as"), `1.10se` ("Sign out"), `1.17` ("Delete account"), [M3](M3-discovery.md) `3.11e` ("Notification preferences"), [HF](MHF-help.md) `HF.1` ("Help — how YouthLink works")  ·  **Exits** back → `1.18e`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Settings"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 4
    TEXT group-SECURITY 59x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "SECURITY"
    FRAME row-Change password 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 310x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Change password"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    TEXT group-CONTACT 58x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "CONTACT"
    FRAME row-Phone 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 186x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Phone"
      TEXT rowValue 112x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "+94 11 234 5678"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    FRAME row-NIC 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 228x24 [FILL/HUG] · fill color/text/primary · mobile/body · "NIC"
      TEXT rowValue 70x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "•••• 5678"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    FRAME row-Email 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 159x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Email"
      TEXT rowValue 139x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "hello@lankaevents.lk"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    FRAME row-DisplayName 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 179x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Display name"
      TEXT rowValue 119x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Ruwan Jayasuriya"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    FRAME row-Business 328x72 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 149x48 [FILL/HUG] · fill color/text/primary · mobile/body · "Business name & bio"
      TEXT rowValue 149x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Lanka Events (Pvt) Ltd"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    FRAME row-PostingAs 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 239x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Posting as"
      TEXT rowValue 59x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Business"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    TEXT group-NOTIFICATIONS 92x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "NOTIFICATIONS"
    FRAME row-NotifPrefs 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 310x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Notification preferences"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    TEXT group-SUPPORT 57x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "SUPPORT"
    FRAME row-Help 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 310x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Help — how YouthLink works"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    TEXT group-ACCOUNT 60x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "ACCOUNT"
    FRAME row-Sign out 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 310x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Sign out"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    FRAME row-Delete account 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 310x24 [FILL/HUG] · fill color/state/danger · mobile/body · "Delete account"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
```

**Lanka Events' Settings.** *Display name* is the account holder's **legal name**, Ruwan Jayasuriya;
the business is shown by **Business name & bio** (*Lanka Events (Pvt) Ltd*), a separate row that opens
`1.15eb`. *Posting as · Business* opens `1.16`. Notification preferences opens M3 `3.11e`, the employer's
role note.

### `1.10se` — Settings · Sign out? (dialog, employer)

**Opens over** `1.10e`  ·  **Cancel returns to** `1.10e`  ·  **Confirm** → `1.6e` ("Sign out")

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Settings"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 4
    TEXT group-SECURITY 59x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "SECURITY"
    FRAME row-Change password 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 310x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Change password"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    TEXT group-CONTACT 58x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "CONTACT"
    FRAME row-Phone 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 186x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Phone"
      TEXT rowValue 112x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "+94 11 234 5678"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    FRAME row-NIC 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 228x24 [FILL/HUG] · fill color/text/primary · mobile/body · "NIC"
      TEXT rowValue 70x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "•••• 5678"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    FRAME row-Email 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 159x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Email"
      TEXT rowValue 139x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "hello@lankaevents.lk"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    FRAME row-DisplayName 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 179x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Display name"
      TEXT rowValue 119x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Ruwan Jayasuriya"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    FRAME row-Business 328x72 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 149x48 [FILL/HUG] · fill color/text/primary · mobile/body · "Business name & bio"
      TEXT rowValue 149x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Lanka Events (Pvt) Ltd"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    FRAME row-PostingAs 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 239x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Posting as"
      TEXT rowValue 59x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Business"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    TEXT group-NOTIFICATIONS 92x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "NOTIFICATIONS"
    FRAME row-NotifPrefs 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 310x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Notification preferences"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    TEXT group-SUPPORT 57x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "SUPPORT"
    FRAME row-Help 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 310x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Help — how YouthLink works"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    TEXT group-ACCOUNT 60x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "ACCOUNT"
    FRAME row-Sign out 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 310x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Sign out"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    FRAME row-Delete account 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 310x24 [FILL/HUG] · fill color/state/danger · mobile/body · "Delete account"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
  RECTANGLE scrim 360x800 [FIXED/FIXED] @0,0 · fill color/overlay/scrim · opacity 40%
  INSTANCE Feedback/ConfirmDialog 328x200 [FIXED/HUG] @16,300 · vertical pad 20 gap 12 · fill color/bg/default · r12
    TEXT title 217x28 [HUG/HUG] · fill color/text/primary · mobile/title · "Sign out of YouthLink?"
    TEXT body 288x60 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Other devices stay signed in. Sign back in any time with your phone and password, or a one-time code."
    FRAME actions 288x48 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Action/Button 101x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 53x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Cancel"
      INSTANCE Action/Button 112x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
        TEXT label 64x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Sign out"
```

The employer's sign-out confirmation, over `1.10e`.

### `1.10ed` — Settings, unified · employer (Dilrukshi Herath)

**Reached from** `1.10sed`, `1.15ed`, `1.18ed` · in the demo `1.11`, `1.12b`, `1.14b`  ·  **Leads to** `1.11` ("Change password"), `1.12` ("Phone"), `1.13` ("NIC"), `1.14` ("Email"), `1.15ed` ("Display name"), `1.16b` ("Posting as"), `1.10sed` ("Sign out"), `1.17` ("Delete account"), [M3](M3-discovery.md) `3.11e` ("Notification preferences"), [HF](MHF-help.md) `HF.1` ("Help — how YouthLink works")  ·  **Exits** back → `1.18ed`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Settings"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 4
    TEXT group-SECURITY 59x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "SECURITY"
    FRAME row-Change password 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 310x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Change password"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    TEXT group-CONTACT 58x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "CONTACT"
    FRAME row-Phone 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 183x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Phone"
      TEXT rowValue 115x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "+94 77 318 2046"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    FRAME row-NIC 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 230x24 [FILL/HUG] · fill color/text/primary · mobile/body · "NIC"
      TEXT rowValue 68x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "•••• 2231"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    FRAME row-Email 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 95x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Email"
      TEXT rowValue 203x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "dilrukshi.herath@example.com"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    FRAME row-DisplayName 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 192x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Display name"
      TEXT rowValue 106x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Dilrukshi Herath"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    FRAME row-PostingAs 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 234x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Posting as"
      TEXT rowValue 64x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Individual"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    TEXT group-NOTIFICATIONS 92x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "NOTIFICATIONS"
    FRAME row-NotifPrefs 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 310x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Notification preferences"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    TEXT group-SUPPORT 57x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "SUPPORT"
    FRAME row-Help 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 310x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Help — how YouthLink works"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    TEXT group-ACCOUNT 60x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "ACCOUNT"
    FRAME row-Sign out 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 310x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Sign out"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    FRAME row-Delete account 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 310x24 [FILL/HUG] · fill color/state/danger · mobile/body · "Delete account"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
```

**Dilrukshi Herath's Settings, Thu 27 Aug.** Her own contact details — +94 77 318 2046, NIC ending
2231, `dilrukshi.herath@example.com` — and her legal name as display name. She posts as
**Individual/Household**, so there is no *Business name & bio* row, and *Posting as · Individual* opens
`1.16b`, the switch in the other direction.

### `1.10sed` — Settings · Sign out? (dialog, Dilrukshi Herath)

**Opens over** `1.10ed`  ·  **Cancel returns to** `1.10ed`  ·  **Confirm** → `1.6emp` ("Sign out")

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Settings"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 4
    TEXT group-SECURITY 59x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "SECURITY"
    FRAME row-Change password 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 310x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Change password"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    TEXT group-CONTACT 58x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "CONTACT"
    FRAME row-Phone 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 183x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Phone"
      TEXT rowValue 115x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "+94 77 318 2046"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    FRAME row-NIC 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 230x24 [FILL/HUG] · fill color/text/primary · mobile/body · "NIC"
      TEXT rowValue 68x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "•••• 2231"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    FRAME row-Email 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 95x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Email"
      TEXT rowValue 203x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "dilrukshi.herath@example.com"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    FRAME row-DisplayName 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 192x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Display name"
      TEXT rowValue 106x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Dilrukshi Herath"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    FRAME row-PostingAs 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 234x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Posting as"
      TEXT rowValue 64x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Individual"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    TEXT group-NOTIFICATIONS 92x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "NOTIFICATIONS"
    FRAME row-NotifPrefs 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 310x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Notification preferences"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    TEXT group-SUPPORT 57x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "SUPPORT"
    FRAME row-Help 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 310x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Help — how YouthLink works"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    TEXT group-ACCOUNT 60x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "ACCOUNT"
    FRAME row-Sign out 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 310x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Sign out"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    FRAME row-Delete account 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 310x24 [FILL/HUG] · fill color/state/danger · mobile/body · "Delete account"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
  RECTANGLE scrim 360x800 [FIXED/FIXED] @0,0 · fill color/overlay/scrim · opacity 40%
  INSTANCE Feedback/ConfirmDialog 328x200 [FIXED/HUG] @16,300 · vertical pad 20 gap 12 · fill color/bg/default · r12
    TEXT title 217x28 [HUG/HUG] · fill color/text/primary · mobile/title · "Sign out of YouthLink?"
    TEXT body 288x60 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Other devices stay signed in. Sign back in any time with your phone and password, or a one-time code."
    FRAME actions 288x48 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Action/Button 101x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 53x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Cancel"
      INSTANCE Action/Button 112x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
        TEXT label 64x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Sign out"
```

Her sign-out confirmation, over `1.10ed`. Sign out lands on the empty login `1.6emp`: a login
screen with her number filled in is not drawn.

### `1.10eg` — Settings, unified · employer (R. Gunasekara)

**Reached from** `1.10seg`, `1.15eg`, `1.18eg` · in the demo `1.11`, `1.12b`, `1.14b`  ·  **Leads to** `1.11` ("Change password"), `1.12` ("Phone"), `1.13` ("NIC"), `1.14` ("Email"), `1.15eg` ("Display name"), `1.16b` ("Posting as"), `1.10seg` ("Sign out"), `1.17` ("Delete account"), [M3](M3-discovery.md) `3.11e` ("Notification preferences"), [HF](MHF-help.md) `HF.1` ("Help — how YouthLink works")  ·  **Exits** back → `1.18eg`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Settings"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 4
    TEXT group-SECURITY 59x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "SECURITY"
    FRAME row-Change password 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 310x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Change password"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    TEXT group-CONTACT 58x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "CONTACT"
    FRAME row-Phone 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 184x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Phone"
      TEXT rowValue 114x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "+94 71 987 6543"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    FRAME row-NIC 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 228x24 [FILL/HUG] · fill color/text/primary · mobile/body · "NIC"
      TEXT rowValue 70x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "•••• 5678"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    FRAME row-Email 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 232x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Email"
      TEXT rowValue 66x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Add email"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    FRAME row-DisplayName 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 202x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Display name"
      TEXT rowValue 96x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "R. Gunasekara"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    FRAME row-PostingAs 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 234x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Posting as"
      TEXT rowValue 64x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Individual"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    TEXT group-NOTIFICATIONS 92x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "NOTIFICATIONS"
    FRAME row-NotifPrefs 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 310x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Notification preferences"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    TEXT group-SUPPORT 57x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "SUPPORT"
    FRAME row-Help 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 310x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Help — how YouthLink works"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    TEXT group-ACCOUNT 60x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "ACCOUNT"
    FRAME row-Sign out 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 310x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Sign out"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    FRAME row-Delete account 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 310x24 [FILL/HUG] · fill color/state/danger · mobile/body · "Delete account"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
```

**R. Gunasekara's Settings, 31 Aug – 3 Sep**: +94 71 987 6543, NIC ending 5678 (the number the
dashboard shows in full, M10 `10.6`), and **no email** — the row reads *Add email*. Individual/Household, as
`1.10ed`. Settings shows nothing of his warnings or the review; those reach him by notification.

### `1.10seg` — Settings · Sign out? (dialog, R. Gunasekara)

**Opens over** `1.10eg`  ·  **Cancel returns to** `1.10eg`  ·  **Confirm** → `1.6emp` ("Sign out")

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Settings"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 4
    TEXT group-SECURITY 59x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "SECURITY"
    FRAME row-Change password 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 310x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Change password"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    TEXT group-CONTACT 58x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "CONTACT"
    FRAME row-Phone 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 184x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Phone"
      TEXT rowValue 114x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "+94 71 987 6543"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    FRAME row-NIC 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 228x24 [FILL/HUG] · fill color/text/primary · mobile/body · "NIC"
      TEXT rowValue 70x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "•••• 5678"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    FRAME row-Email 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 232x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Email"
      TEXT rowValue 66x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Add email"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    FRAME row-DisplayName 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 202x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Display name"
      TEXT rowValue 96x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "R. Gunasekara"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    FRAME row-PostingAs 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 234x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Posting as"
      TEXT rowValue 64x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Individual"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    TEXT group-NOTIFICATIONS 92x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "NOTIFICATIONS"
    FRAME row-NotifPrefs 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 310x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Notification preferences"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    TEXT group-SUPPORT 57x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "SUPPORT"
    FRAME row-Help 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 310x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Help — how YouthLink works"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    TEXT group-ACCOUNT 60x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "ACCOUNT"
    FRAME row-Sign out 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 310x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Sign out"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    FRAME row-Delete account 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 310x24 [FILL/HUG] · fill color/state/danger · mobile/body · "Delete account"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
  RECTANGLE scrim 360x800 [FIXED/FIXED] @0,0 · fill color/overlay/scrim · opacity 40%
  INSTANCE Feedback/ConfirmDialog 328x200 [FIXED/HUG] @16,300 · vertical pad 20 gap 12 · fill color/bg/default · r12
    TEXT title 217x28 [HUG/HUG] · fill color/text/primary · mobile/title · "Sign out of YouthLink?"
    TEXT body 288x60 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Other devices stay signed in. Sign back in any time with your phone and password, or a one-time code."
    FRAME actions 288x48 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Action/Button 101x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 53x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Cancel"
      INSTANCE Action/Button 112x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
        TEXT label 64x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Sign out"
```

His sign-out confirmation, over `1.10eg`; Sign out → `1.6emp`.

### `1.10n` — Settings, unified · worker (Nethmi Jayasinghe)

**Reached from** `1.10sn`, `1.15n`, `1.18n`, `1.18nc` · in the demo `1.12b`, `1.14b`, `1.11r1`, `1.11`  ·  **Leads to** `1.11` ("Change password"), `1.12` ("Phone"), `1.13` ("NIC"), `1.14` ("Email"), `1.15n` ("Display name"), `1.10sn` ("Sign out"), `1.17` ("Delete account"), [M3](M3-discovery.md) `3.11n` ("Notification preferences"), [HF](MHF-help.md) `HF.1` ("Help — how YouthLink works")  ·  **Exits** back → `1.18n`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Settings"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 4
    TEXT group-SECURITY 59x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "SECURITY"
    FRAME row-Change password 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 310x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Change password"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    TEXT group-CONTACT 58x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "CONTACT"
    FRAME row-Phone 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 182x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Phone"
      TEXT rowValue 116x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "+94 76 234 5678"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    FRAME row-NIC 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 230x24 [FILL/HUG] · fill color/text/primary · mobile/body · "NIC"
      TEXT rowValue 68x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "•••• 9012"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    FRAME row-Email 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 232x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Email"
      TEXT rowValue 66x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Add email"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    FRAME row-DisplayName 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 171x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Display name"
      TEXT rowValue 127x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Nethmi Jayasinghe"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    TEXT group-NOTIFICATIONS 92x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "NOTIFICATIONS"
    FRAME row-NotifPrefs 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 310x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Notification preferences"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    TEXT group-SUPPORT 57x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "SUPPORT"
    FRAME row-Help 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 310x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Help — how YouthLink works"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    TEXT group-ACCOUNT 60x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "ACCOUNT"
    FRAME row-Sign out 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 310x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Sign out"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    FRAME row-Delete account 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 310x24 [FILL/HUG] · fill color/state/danger · mobile/body · "Delete account"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
```

**Nethmi Jayasinghe's Settings, Sat 29 Aug about 2 AM** — the same before and after she cancels,
since cancelling changes nothing here. +94 76 234 5678, NIC ending 9012, and **no email**: the row reads
*Add email*, which is why her signed-in reset ends on `1.11r4` and why, a week later with her phone lost, she
needs account recovery (`1.8rec1`). A worker, so no posting-as row.

### `1.10sn` — Settings · Sign out? (dialog, Nethmi Jayasinghe)

**Opens over** `1.10n`  ·  **Cancel returns to** `1.10n`  ·  **Confirm** → `1.6emp` ("Sign out")

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Settings"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 4
    TEXT group-SECURITY 59x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "SECURITY"
    FRAME row-Change password 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 310x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Change password"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    TEXT group-CONTACT 58x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "CONTACT"
    FRAME row-Phone 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 182x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Phone"
      TEXT rowValue 116x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "+94 76 234 5678"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    FRAME row-NIC 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 230x24 [FILL/HUG] · fill color/text/primary · mobile/body · "NIC"
      TEXT rowValue 68x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "•••• 9012"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    FRAME row-Email 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 232x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Email"
      TEXT rowValue 66x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Add email"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    FRAME row-DisplayName 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 171x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Display name"
      TEXT rowValue 127x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Nethmi Jayasinghe"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    TEXT group-NOTIFICATIONS 92x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "NOTIFICATIONS"
    FRAME row-NotifPrefs 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 310x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Notification preferences"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    TEXT group-SUPPORT 57x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "SUPPORT"
    FRAME row-Help 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 310x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Help — how YouthLink works"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    TEXT group-ACCOUNT 60x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "ACCOUNT"
    FRAME row-Sign out 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 310x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Sign out"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    FRAME row-Delete account 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 310x24 [FILL/HUG] · fill color/state/danger · mobile/body · "Delete account"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
  RECTANGLE scrim 360x800 [FIXED/FIXED] @0,0 · fill color/overlay/scrim · opacity 40%
  INSTANCE Feedback/ConfirmDialog 328x200 [FIXED/HUG] @16,300 · vertical pad 20 gap 12 · fill color/bg/default · r12
    TEXT title 217x28 [HUG/HUG] · fill color/text/primary · mobile/title · "Sign out of YouthLink?"
    TEXT body 288x60 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Other devices stay signed in. Sign back in any time with your phone and password, or a one-time code."
    FRAME actions 288x48 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Action/Button 101x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 53x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Cancel"
      INSTANCE Action/Button 112x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
        TEXT label 64x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Sign out"
```

Her sign-out confirmation, over `1.10n`; Sign out → `1.6emp`.

### `1.10v` — Settings, unified · verifier (Sunil Bandara)

**Reached from** `1.10sv`, `1.15v`, `1.18v` · in the demo `1.18vz`, `1.11`, `1.12b`, `1.14b`  ·  **Leads to** `1.11` ("Change password"), `1.12` ("Phone"), `1.13` ("NIC"), `1.14` ("Email"), `1.15v` ("Display name"), `1.10sv` ("Sign out"), `1.17` ("Delete account"), [M3](M3-discovery.md) `3.11v` ("Notification preferences"), [HF](MHF-help.md) `HF.1` ("Help — how YouthLink works")  ·  **Exits** back → `1.18v`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Settings"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 4
    TEXT group-SECURITY 59x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "SECURITY"
    FRAME row-Change password 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 310x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Change password"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    TEXT group-CONTACT 58x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "CONTACT"
    FRAME row-Phone 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 184x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Phone"
      TEXT rowValue 114x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "+94 71 456 7890"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    FRAME row-NIC 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 230x24 [FILL/HUG] · fill color/text/primary · mobile/body · "NIC"
      TEXT rowValue 68x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "•••• 9012"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    FRAME row-Email 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 154x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Email"
      TEXT rowValue 144x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "sunil.b@example.com"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    FRAME row-DisplayName 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 207x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Display name"
      TEXT rowValue 91x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Sunil Bandara"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    TEXT group-NOTIFICATIONS 92x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "NOTIFICATIONS"
    FRAME row-NotifPrefs 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 310x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Notification preferences"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    TEXT group-SUPPORT 57x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "SUPPORT"
    FRAME row-Help 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 310x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Help — how YouthLink works"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    TEXT group-ACCOUNT 60x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "ACCOUNT"
    FRAME row-Sign out 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 310x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Sign out"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    FRAME row-Delete account 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 310x24 [FILL/HUG] · fill color/state/danger · mobile/body · "Delete account"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
```

**Sunil Bandara's Settings.** Notification preferences opens M3 `3.11v`.

### `1.10sv` — Settings · Sign out? (dialog, verifier)

**Opens over** `1.10v`  ·  **Cancel returns to** `1.10v`  ·  **Confirm** → `1.6v` ("Sign out")

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Settings"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 4
    TEXT group-SECURITY 59x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "SECURITY"
    FRAME row-Change password 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 310x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Change password"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    TEXT group-CONTACT 58x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "CONTACT"
    FRAME row-Phone 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 184x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Phone"
      TEXT rowValue 114x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "+94 71 456 7890"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    FRAME row-NIC 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 230x24 [FILL/HUG] · fill color/text/primary · mobile/body · "NIC"
      TEXT rowValue 68x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "•••• 9012"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    FRAME row-Email 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 154x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Email"
      TEXT rowValue 144x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "sunil.b@example.com"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    FRAME row-DisplayName 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 207x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Display name"
      TEXT rowValue 91x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Sunil Bandara"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    TEXT group-NOTIFICATIONS 92x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "NOTIFICATIONS"
    FRAME row-NotifPrefs 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 310x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Notification preferences"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    TEXT group-SUPPORT 57x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "SUPPORT"
    FRAME row-Help 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 310x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Help — how YouthLink works"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    TEXT group-ACCOUNT 60x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "ACCOUNT"
    FRAME row-Sign out 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 310x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Sign out"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
    FRAME row-Delete account 328x48 [FILL/HUG] · horizontal pad 12/0/12/0 gap 12
      TEXT rowLabel 310x24 [FILL/HUG] · fill color/state/danger · mobile/body · "Delete account"
      VECTOR Vector 6x12 [FIXED/FIXED] · stroke color/text/secondary 1.8
  RECTANGLE scrim 360x800 [FIXED/FIXED] @0,0 · fill color/overlay/scrim · opacity 40%
  INSTANCE Feedback/ConfirmDialog 328x200 [FIXED/HUG] @16,300 · vertical pad 20 gap 12 · fill color/bg/default · r12
    TEXT title 217x28 [HUG/HUG] · fill color/text/primary · mobile/title · "Sign out of YouthLink?"
    TEXT body 288x60 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Other devices stay signed in. Sign back in any time with your phone and password, or a one-time code."
    FRAME actions 288x48 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Action/Button 101x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 53x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Cancel"
      INSTANCE Action/Button 112x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
        TEXT label 64x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Sign out"
```

The verifier's sign-out confirmation, over `1.10v`.

## Changing the password

Current password, then the new one twice (`FR-ACC-11`). Forgetting the
current one while signed in is a reset, not a change: it goes by email when there is a verified address.
When there is not, the person is still signed in and can add one, so the screen offers that rather than
account recovery, which is for someone who cannot get in at all.

### `1.11` — Change password

**Reached from** `1.10`, `1.10e`, `1.10ed`, `1.10eg`, `1.10n`, `1.10v`  ·  **Leads to** `1.10` ("Change password")  ·  **Exits** back → `1.10`

*In the demo:* every person's copy returns to their own Settings; Kavindu's and Nethmi's walks continue to `1.11r1`.

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Change password"
  FRAME content 360x744 [FILL/FILL] · vertical pad 24/16/24/16 gap 16
    INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Secure}
      TEXT label 119x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Current password"
      FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT value 272x24 [FILL/HUG] · fill color/text/primary · mobile/body · "••••••••••"
        FRAME eye 24x24 [FIXED/FIXED]
          ELLIPSE Ellipse 20x12 [FIXED/FIXED] @2,6 · stroke color/text/secondary 1.5
          ELLIPSE Ellipse 7x7 [FIXED/FIXED] @9,9 · fill color/text/secondary
    INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Default, Type=Secure}
      TEXT label 99x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "New password"
      FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT value 272x24 [FILL/HUG] · fill color/text/secondary · mobile/body · "••••••••••"
        FRAME eye 24x24 [FIXED/FIXED]
          ELLIPSE Ellipse 20x12 [FIXED/FIXED] @2,6 · stroke color/text/secondary 1.5
          ELLIPSE Ellipse 7x7 [FIXED/FIXED] @9,9 · fill color/text/secondary
    INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Default, Type=Secure}
      TEXT label 153x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Confirm new password"
      FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT value 272x24 [FILL/HUG] · fill color/text/secondary · mobile/body · "••••••••••"
        FRAME eye 24x24 [FIXED/FIXED]
          ELLIPSE Ellipse 20x12 [FIXED/FIXED] @2,6 · stroke color/text/secondary 1.5
          ELLIPSE Ellipse 7x7 [FIXED/FIXED] @9,9 · fill color/text/secondary
    TEXT pwHelp 328x40 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "8 to 64 characters — spaces allowed, no other rules."
    TEXT signOutLine 328x40 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "Changing your password signs you out on any other device."
    FRAME spacer-grow 8x256 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 139x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Change password"
```

Three secure fields: current password filled, the new two empty. The signed-out-elsewhere line is
stated before the button, not after.

### `1.11r1` — Change password · forgotten current password

**Reached from** in the demo `1.11`  ·  **Leads to** `1.11r2` ("Forgotten your current password?"), `1.10` ("Change password")  ·  **Exits** back → `1.10`

*In the demo:* in Nethmi's Settings, *Forgotten your current password?* → `1.11r4` — she has no email to reset by.

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Change password"
  FRAME content 360x744 [FILL/FILL] · vertical pad 24/16/24/16 gap 16
    INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Secure}
      TEXT label 119x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Current password"
      FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT value 272x24 [FILL/HUG] · fill color/text/primary · mobile/body · "••••••••••"
        FRAME eye 24x24 [FIXED/FIXED]
          ELLIPSE Ellipse 20x12 [FIXED/FIXED] @2,6 · stroke color/text/secondary 1.5
          ELLIPSE Ellipse 7x7 [FIXED/FIXED] @9,9 · fill color/text/secondary
    INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Default, Type=Secure}
      TEXT label 99x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "New password"
      FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT value 272x24 [FILL/HUG] · fill color/text/secondary · mobile/body · "••••••••••"
        FRAME eye 24x24 [FIXED/FIXED]
          ELLIPSE Ellipse 20x12 [FIXED/FIXED] @2,6 · stroke color/text/secondary 1.5
          ELLIPSE Ellipse 7x7 [FIXED/FIXED] @9,9 · fill color/text/secondary
    INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Default, Type=Secure}
      TEXT label 153x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Confirm new password"
      FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT value 272x24 [FILL/HUG] · fill color/text/secondary · mobile/body · "••••••••••"
        FRAME eye 24x24 [FIXED/FIXED]
          ELLIPSE Ellipse 20x12 [FIXED/FIXED] @2,6 · stroke color/text/secondary 1.5
          ELLIPSE Ellipse 7x7 [FIXED/FIXED] @9,9 · fill color/text/secondary
    TEXT pwHelp 328x40 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "8 to 64 characters — spaces allowed, no other rules."
    INSTANCE forgotLink 257x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0 · of Action/Link
      TEXT label 257x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Forgotten your current password?"
    TEXT signOutLine 328x40 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "Changing your password signs you out on any other device."
    FRAME spacer-grow 8x196 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 139x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Change password"
```

The same form with a **Forgotten your current password?** link beneath the rule line.

### `1.11r2` — Reset by email · confirm

**Reached from** `1.11r1`  ·  **Leads to** `1.11r3` ("Send reset link")  ·  **Exits** back → `1.10`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Reset your password"
  FRAME content 360x744 [FILL/FILL] · vertical pad 24/16/24/16 gap 16
    TEXT explainer 328x40 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "We'll email a reset link to the address on your account. You'll set a new password from there."
    TEXT targetEmail 328x24 [FILL/HUG] · fill color/text/primary · mobile/body-medium · "kavindu@example.com"
    TEXT note 328x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Resetting your password signs you out on any other device."
    FRAME spacer-grow 8x480 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 114x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Send reset link"
```

Kavindu has a verified email, so the reset goes there: *kavindu@example.com*.

### `1.11r3` — Reset by email · link sent

**Reached from** `1.11r2`  ·  **Leads to** nothing  ·  **Exits** back → `1.10`

*In the demo:* Done → Kavindu's Settings `1.10`.

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Reset your password"
  FRAME content 360x744 [FILL/FILL] · vertical pad 24/16/24/16 gap 16
    INSTANCE formBanner 328x80 [FILL/HUG] · horizontal pad 10/12/10/12 gap 0 · fill color/bg/subtle · stroke color/border/default 1 · r8 · of Feedback/FormBanner · {Kind=Info}
      TEXT message 296x60 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "We've sent a reset link to kavindu@example.com. Check your inbox, and your spam folder if it isn't there."
    TEXT note 328x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "You can keep using the app. The link opens in your browser."
    FRAME spacer-grow 8x480 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 41x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Done"
```

Sent — an `Info` banner naming the address and where to look. The person can keep using the app.

### `1.11r4` — Reset by email · no verified email on file

**Reached from** in the demo `1.11r1`  ·  **Leads to** `1.14` ("Add an email")  ·  **Exits** back → `1.10`

*In the demo:* Add an email → `1.14` inside Nethmi's Settings walk, and back → `1.10n`.

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Reset your password"
  FRAME content 360x744 [FILL/FILL] · vertical pad 24/16/24/16 gap 16
    INSTANCE formBanner 328x60 [FILL/HUG] · horizontal pad 10/12/10/12 gap 0 · fill color/bg/subtle · stroke color/border/default 1 · r8 · of Feedback/FormBanner · {Kind=Info}
      TEXT message 296x40 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "There's no verified email on this account, so we can't send a reset link."
    TEXT note 328x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Add an email address — no password needed — then reset your password by email."
    FRAME spacer-grow 8x500 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 99x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Add an email"
```

**The branch for an account with no verified email** — in the demo, Nethmi on Sat 29 Aug, signed in
and never having added one. The email reset is impossible, so the screen offers the way that works while
signed in: **Add an email** opens `1.14` — no password needed — and the reset can go there once the address
is confirmed. Account recovery (`1.8rec2`) is for someone who cannot get in at all, so it is not offered
here.

## Contact details and name

Phone, NIC, email and display name, each on its own short form
(`FR-ACC-12` to `FR-ACC-15`). **A contact change is pending until it is confirmed** — the old phone or
address stays active until the new one proves itself — so the forms land on a pending state with a way to
cancel, not on a success message.

**The phone, NIC and email forms are shared by everyone and show nobody's data** (ruled on 2026-09-24): the
pending phone change does not name the number it replaces, the NIC form opens empty, and adding an email and
changing one are the same screen with a sample address that belongs to no one. A person's current values are
on their own Settings. The display-name form, which does show the name, has a copy per person; so does the
business name and bio.

### `1.12` — Change phone number

**Reached from** `1.10`, `1.10e`, `1.10ed`, `1.10eg`, `1.10n`, `1.10v`  ·  **Leads to** `1.12b` ("Send code to new number")  ·  **Exits** back → `1.10`

*In the demo:* every person's walk continues to `1.12b` and returns to their own Settings; the error walk goes to `1.12err`.

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Change phone number"
  FRAME content 360x744 [FILL/FILL] · vertical pad 24/16/24/16 gap 16
    INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Secure}
      TEXT label 65x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Password"
      FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT value 272x24 [FILL/HUG] · fill color/text/primary · mobile/body · "••••••••••"
        FRAME eye 24x24 [FIXED/FIXED]
          ELLIPSE Ellipse 20x12 [FIXED/FIXED] @2,6 · stroke color/text/secondary 1.5
          ELLIPSE Ellipse 7x7 [FIXED/FIXED] @9,9 · fill color/text/secondary
    INSTANCE Input/PhoneField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Default}
      TEXT Phone number 130x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "New phone number"
      FRAME input 328x48 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
        FRAME prefix 56x48 [HUG/FILL] · horizontal pad 0/12/0/12 gap 0 · fill color/bg/subtle
          TEXT +94 32x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "+94"
        FRAME val 107x48 [HUG/FILL] · horizontal pad 0/0/0/12 gap 0
          TEXT 7X XXX XXXX 95x24 [HUG/HUG] · fill color/text/primary · mobile/body · "76 555 0199"
    TEXT note 328x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Your current number stays active until the new one is verified."
    FRAME spacer-grow 8x400 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 201x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Send code to new number"
```

Password first, then the new number — **+94 76 555 0199**, the same sample for everyone, because
this input screen is shared. The note says the current number stays active until the new one is
verified.

### `1.12b` — Change phone number · pending confirmation

**Reached from** `1.12`  ·  **Leads to** `1.10` ("Cancel this change")  ·  **Exits** back → `1.10`

*In the demo:* back and Cancel this change → the Settings of whoever is walking it.

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Change phone number"
  FRAME content 360x744 [FILL/FILL] · vertical pad 24/16/24/16 gap 16
    INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Secure}
      TEXT label 65x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Password"
      FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT value 272x24 [FILL/HUG] · fill color/text/primary · mobile/body · "••••••••••"
        FRAME eye 24x24 [FIXED/FIXED]
          ELLIPSE Ellipse 20x12 [FIXED/FIXED] @2,6 · stroke color/text/secondary 1.5
          ELLIPSE Ellipse 7x7 [FIXED/FIXED] @9,9 · fill color/text/secondary
    INSTANCE Input/PhoneField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Default}
      TEXT Phone number 130x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "New phone number"
      FRAME input 328x48 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
        FRAME prefix 56x48 [HUG/FILL] · horizontal pad 0/12/0/12 gap 0 · fill color/bg/subtle
          TEXT +94 32x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "+94"
        FRAME val 107x48 [HUG/FILL] · horizontal pad 0/0/0/12 gap 0
          TEXT 7X XXX XXXX 95x24 [HUG/HUG] · fill color/text/primary · mobile/body · "76 555 0199"
    FRAME pendingChangeRow 328x184 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · stroke color/border/default 1 · r10
      TEXT prTitle 296x24 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Pending — confirm +94 76 555 0199"
      TEXT prBody 296x80 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Your current number stays active until the new one is confirmed by SMS code. If the code expires or you cancel, nothing changes."
      INSTANCE Action/Link 145x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 145x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Cancel this change"
    TEXT note 328x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Your current number stays active until the new one is verified."
    FRAME spacer-grow 8x264 [FIXED/FILL]
```

**Pending**: *confirm +94 76 555 0199*. The body says the **current** number stays active until the
SMS code is entered, without naming it — the screen is shared, and the number in force differs per person.
*Cancel this change* abandons it and nothing changes.

### `1.12err` — Change phone number · password doesn't match

**Reached from** in the demo `1.12`  ·  **Leads to** nothing  ·  **Exits** back → `1.10`

*In the demo:* the error walk: Send code to new number → `1.14`.

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Change phone number"
  FRAME content 360x744 [FILL/FILL] · vertical pad 24/16/24/16 gap 16
    INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Error, Type=Secure}
      TEXT label 65x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Password"
      FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/error 1 · r8
        TEXT value 272x24 [FILL/HUG] · fill color/text/primary · mobile/body · "••••••••••"
        FRAME eye 24x24 [FIXED/FIXED]
          ELLIPSE Ellipse 20x12 [FIXED/FIXED] @2,6 · stroke color/text/secondary 1.5
          ELLIPSE Ellipse 7x7 [FIXED/FIXED] @9,9 · fill color/text/secondary
    INSTANCE fieldError 296x40 [HUG/HUG] · horizontal pad 0 gap 0 · of Feedback/FieldError
      TEXT error 296x40 [FIXED/HUG] · fill color/state/danger · mobile/secondary · "That password doesn't match your account. Please try again."
    INSTANCE Input/PhoneField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Default}
      TEXT Phone number 130x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "New phone number"
      FRAME input 328x48 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
        FRAME prefix 56x48 [HUG/FILL] · horizontal pad 0/12/0/12 gap 0 · fill color/bg/subtle
          TEXT +94 32x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "+94"
        FRAME val 107x48 [HUG/FILL] · horizontal pad 0/0/0/12 gap 0
          TEXT 7X XXX XXXX 95x24 [HUG/HUG] · fill color/text/primary · mobile/body · "76 555 0199"
    TEXT note 328x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Your current number stays active until the new one is verified."
    FRAME spacer-grow 8x344 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 201x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Send code to new number"
```

The password does not match the account. The field is `{State=Error}`; the message says which field
and invites another try.

### `1.13` — NIC correction

**Reached from** `1.10`, `1.10e`, `1.10ed`, `1.10eg`, `1.10n`, `1.10v`  ·  **Leads to** nothing  ·  **Exits** back → `1.10`

*In the demo:* back → the Settings of whoever is walking it.

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Correct NIC"
  FRAME content 360x744 [FILL/FILL] · vertical pad 24/16/24/16 gap 16
    INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Secure}
      TEXT label 65x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Password"
      FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT value 272x24 [FILL/HUG] · fill color/text/primary · mobile/body · "••••••••••"
        FRAME eye 24x24 [FIXED/FIXED]
          ELLIPSE Ellipse 20x12 [FIXED/FIXED] @2,6 · stroke color/text/secondary 1.5
          ELLIPSE Ellipse 7x7 [FIXED/FIXED] @9,9 · fill color/text/secondary
    INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Default, Type=Text}
      TEXT label 25x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "NIC"
      FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT value 304x24 [FILL/HUG] · fill color/text/secondary · mobile/body · "Enter your NIC"
    TEXT nicHelp 328x60 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "12 digits, or 9 digits followed by V or X. Stored as entered — only the shape is checked, never a registry."
    FRAME spacer-grow 8x380 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/subtle · stroke color/border/default 1 · r8 · {Style=Primary, State=Disabled}
      TEXT label 70x24 [HUG/HUG] · fill color/text/secondary · mobile/body-medium · "Save NIC"
```

**Opens empty**: the field shows its placeholder, *Enter your NIC*, and *Save NIC* is
`{State=Disabled}` until something is typed. The current NIC is on the person's Settings, masked to its
last four; the form is shared, so it shows nobody's. Correctable with the same low ceremony as registration
(`FR-ACC-13`), and the same shape-only rule.

### `1.14` — Email add or change

**Reached from** `1.10`, `1.10e`, `1.10ed`, `1.10eg`, `1.10n`, `1.10v`, `1.11r4` · in the demo `1.12err`, `1.14err`  ·  **Leads to** `1.14b` ("Send confirmation link")  ·  **Exits** back → `1.10`

*In the demo:* the error walk: Send confirmation link → `1.14err`; in every other walk back → the walker's own Settings.

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Email"
  FRAME content 360x744 [FILL/FILL] · vertical pad 24/16/24/16 gap 16
    INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Text}
      TEXT label 93x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Email address"
      FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT value 304x24 [FILL/HUG] · fill color/text/primary · mobile/body · "new.address@example.com"
    TEXT note 328x60 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "We'll send a confirmation link. Nothing on your account changes until the new address is confirmed."
    FRAME spacer-grow 8x468 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 171x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Send confirmation link"
```

**One screen for adding an email and for changing one**, shared by everyone: the sample
`new.address@example.com` belongs to no one. *Nothing on your account changes until the new address is
confirmed* holds either way — whether there was an address before or not.

### `1.14b` — Email add or change · pending confirmation

**Reached from** `1.14`  ·  **Leads to** `1.10` ("Cancel this change")  ·  **Exits** back → `1.10`

*In the demo:* back and Cancel this change → the Settings of whoever is walking it.

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Email"
  FRAME content 360x744 [FILL/FILL] · vertical pad 24/16/24/16 gap 16
    INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Text}
      TEXT label 93x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Email address"
      FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT value 304x24 [FILL/HUG] · fill color/text/primary · mobile/body · "new.address@example.com"
    FRAME pendingChangeRow 328x188 [FILL/HUG] · vertical pad 12/14/12/14 gap 6 · fill color/bg/default · stroke color/border/default 1 · r10
      TEXT prTitle 296x48 [FIXED/HUG] · fill color/text/primary · mobile/body-medium · "Pending — confirm new.address@example.com"
      TEXT prBody 296x60 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "We sent a confirmation link. Nothing on your account changes until the new address is confirmed."
      INSTANCE Action/Link 145x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 145x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Cancel this change"
    FRAME spacer-grow 8x404 [FIXED/FILL]
```

Pending, with the new address in the title and a cancel link.

### `1.14err` — Email add or change · already on another account

**Reached from** in the demo `1.14`  ·  **Leads to** nothing  ·  **Exits** back → `1.10`

*In the demo:* Send confirmation link → `1.14` (the address has to be edited first).

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Email"
  FRAME content 360x744 [FILL/FILL] · vertical pad 24/16/24/16 gap 16
    INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Error, Type=Text}
      TEXT label 93x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Email address"
      FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/error 1 · r8
        TEXT value 304x24 [FILL/HUG] · fill color/text/primary · mobile/body · "new.address@example.com"
    INSTANCE fieldError 296x40 [HUG/HUG] · horizontal pad 0 gap 0 · of Feedback/FieldError
      TEXT error 296x40 [FIXED/HUG] · fill color/state/danger · mobile/secondary · "This email is already on another account. Try a different address."
    TEXT note 328x60 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "We'll send a confirmation link. Nothing on your account changes until the new address is confirmed."
    FRAME spacer-grow 8x412 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 171x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Send confirmation link"
```

The new address is already on another account (`FR-ACC-05`). The message does not say whose. The
field keeps the address typed on `1.14` — the same shared sample — so the error reads as the result of that
screen's Send.

### `1.15` — Display name

**Reached from** `1.10`  ·  **Leads to** `1.10` ("Save")  ·  **Exits** back → `1.10`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Display name"
  FRAME content 360x744 [FILL/FILL] · vertical pad 24/16/24/16 gap 16
    INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Text}
      TEXT label 89x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Display name"
      FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT value 304x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Kavindu Perera"
    FRAME spacer-grow 8x544 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 38x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Save"
```

Kavindu's display name — his legal name (`FR-PROF-01`).

### `1.15e` — Display name · employer (Lanka Events)

**Reached from** `1.10e`  ·  **Leads to** `1.10e` ("Save")  ·  **Exits** back → `1.10e`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Display name"
  FRAME content 360x744 [FILL/FILL] · vertical pad 24/16/24/16 gap 16
    INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Text}
      TEXT label 89x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Display name"
      FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT value 304x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Ruwan Jayasuriya"
    FRAME spacer-grow 8x544 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 38x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Save"
```

**Ruwan Jayasuriya**, the legal name of the person behind Lanka Events. Changing the business name is
the separate *Business name & bio* row on `1.10e`, which opens `1.15eb`.

### `1.15eb` — Business name & bio · employer (Lanka Events)

**Reached from** `1.10e`  ·  **Leads to** `1.10e` ("Save")  ·  **Exits** back → `1.10e`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Business name & bio"
  FRAME content 360x744 [FILL/FILL] · vertical pad 24/16/24/16 gap 16
    INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Text}
      TEXT label 100x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Business name"
      FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT value 304x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Lanka Events (Pvt) Ltd"
    TEXT label 151x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Business bio (optional)"
    INSTANCE bioField 328x98 [FILL/HUG] · vertical pad 12 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8 · of Input/TextArea · {State=Filled}
      TEXT value 302x72 [FILL/HUG] · fill color/text/primary · mobile/body · "Event staffing across Colombo — weddings, corporate events and concerts."
    TEXT counter 48x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "72 / 300"
    TEXT helper 328x20 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Shown on your profile and on your postings."
    FRAME spacer-grow 8x326 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 38x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Save"
```

**Lanka Events' business name and bio**, the row on `1.10e`. The two fields registration asked for
(`1.5b`, `FR-ACC-02`): the name, required, 100 characters; the bio, optional, now in a text area with its
count (*72 / 300*). The helper says where they appear. Save returns to `1.10e`.

### `1.15ed` — Display name · employer (Dilrukshi Herath)

**Reached from** `1.10ed`  ·  **Leads to** `1.10ed` ("Save")  ·  **Exits** back → `1.10ed`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Display name"
  FRAME content 360x744 [FILL/FILL] · vertical pad 24/16/24/16 gap 16
    INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Text}
      TEXT label 89x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Display name"
      FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT value 304x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Dilrukshi Herath"
    FRAME spacer-grow 8x544 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 38x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Save"
```

Dilrukshi Herath — her legal name, as for every Individual employer.

### `1.15eg` — Display name · employer (R. Gunasekara)

**Reached from** `1.10eg`  ·  **Leads to** `1.10eg` ("Save")  ·  **Exits** back → `1.10eg`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Display name"
  FRAME content 360x744 [FILL/FILL] · vertical pad 24/16/24/16 gap 16
    INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Text}
      TEXT label 89x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Display name"
      FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT value 304x24 [FILL/HUG] · fill color/text/primary · mobile/body · "R. Gunasekara"
    FRAME spacer-grow 8x544 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 38x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Save"
```

R. Gunasekara.

### `1.15n` — Display name · worker (Nethmi Jayasinghe)

**Reached from** `1.10n`  ·  **Leads to** `1.10n` ("Save")  ·  **Exits** back → `1.10n`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Display name"
  FRAME content 360x744 [FILL/FILL] · vertical pad 24/16/24/16 gap 16
    INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Text}
      TEXT label 89x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Display name"
      FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT value 304x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Nethmi Jayasinghe"
    FRAME spacer-grow 8x544 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 38x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Save"
```

Nethmi Jayasinghe.

### `1.15v` — Display name · verifier

**Reached from** `1.10v`  ·  **Leads to** `1.10v` ("Save")  ·  **Exits** back → `1.10v`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Display name"
  FRAME content 360x744 [FILL/FILL] · vertical pad 24/16/24/16 gap 16
    INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Text}
      TEXT label 89x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Display name"
      FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT value 304x24 [FILL/HUG] · fill color/text/primary · mobile/body · "Sunil Bandara"
    FRAME spacer-grow 8x544 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 38x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Save"
```

Sunil Bandara.

### `1.16` — Posting-as change

**Reached from** `1.10e`  ·  **Leads to** `1.10e` ("Save")  ·  **Exits** back → `1.10e`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Posting as"
  FRAME content 360x744 [FILL/FILL] · vertical pad 24/16/24/16 gap 16
    INSTANCE Input/SegmentedControl 328x44 [FILL/HUG] · horizontal pad 2 gap 2 · fill color/bg/subtle · r8 · {Selected=Individual}
      FRAME segment 208x40 [FIXED/HUG] · horizontal pad 8/16/8/16 gap 0 · fill color/brand/primary · r6
        TEXT label 162x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Individual/Household"
      FRAME segment 115x40 [FIXED/HUG] · horizontal pad 8/16/8/16 gap 0 · r6
        TEXT label 69x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Business"
    TEXT note 328x60 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Switching from Business clears your business name and bio. Past postings keep the details they were posted with."
    FRAME spacer-grow 8x496 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 38x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Save"
```

The posting-as switch (`FR-ACC-16`), shown mid-change to `Individual/Household`. The note states the
consequence before Save: switching from Business clears the business name and bio, and past postings keep
the details they were posted with.

### `1.16b` — Posting-as change · switching to Business

**Reached from** `1.10ed`, `1.10eg`  ·  **Leads to** nothing  ·  **Exits** back → `1.10ed`

*In the demo:* back → `1.10ed` or `1.10eg`, whichever employer opened it.

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Posting as"
  FRAME content 360x744 [FILL/FILL] · vertical pad 24/16/24/16 gap 16
    INSTANCE Input/SegmentedControl 328x44 [FILL/HUG] · horizontal pad 2 gap 2 · fill color/bg/subtle · r8 · {Selected=Business}
      FRAME segment 208x40 [FIXED/HUG] · horizontal pad 8/16/8/16 gap 0 · r6
        TEXT label 162x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Individual/Household"
      FRAME segment 115x40 [FIXED/HUG] · horizontal pad 8/16/8/16 gap 0 · fill color/brand/primary · r6
        TEXT label 69x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Business"
    INSTANCE Input/TextField 328x72 [FILL/HUG] · vertical pad 0 gap 4 · {State=Default, Type=Text}
      TEXT label 100x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Business name"
      FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT value 304x24 [FILL/HUG] · fill color/text/secondary · mobile/body · "Enter your business name"
    INSTANCE Input/TextField 328x72 [FILL/HUG] · vertical pad 0 gap 4 · {State=Default, Type=Text}
      TEXT label 151x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Business bio (optional)"
      FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT businessBio 304x24 [FILL/HUG] · fill color/text/secondary · mobile/body · "What your business does (optional)"
    TEXT note 328x80 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Switching to Business shows the business name and bio on your profile and your postings. Postings you've already published keep the name they were posted under."
    FRAME spacer-grow 8x300 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/subtle · stroke color/border/default 1 · r8 · {Style=Primary, State=Disabled}
      TEXT label 38x24 [HUG/HUG] · fill color/text/secondary · mobile/body-medium · "Save"
```

**The switch the other way**, for an Individual employer — Dilrukshi's or R. Gunasekara's *Posting as ·
Individual*. `Business` selected, and the two fields it unlocks, empty (*Enter your business name*, *What
your business does (optional)*); Save stays `{State=Disabled}` until a business name is entered. The note says
the name and bio will show on the profile and postings, and that postings already published keep the name
they were posted under. It shows nobody's data, so one copy serves both.

## Account deletion

Permanent removal of the identifying details; ratings stay, attributed to an
anonymised reference, so other people's history stays honest (`FR-ACC-17`). It is **blocked while an
engagement is active**, and it takes two steps: a warning, then the password.

### `1.17` — Account deletion

**Reached from** `1.10`, `1.10e`, `1.10ed`, `1.10eg`, `1.10n`, `1.10v`  ·  **Leads to** `1.17b` ("Delete account")  ·  **Exits** back → `1.10`

*In the demo:* Delete account → `1.17be` (blocked) for Lanka Events and `1.17bn` for Nethmi before she cancels, `1.17p` for everyone else; back → each person's own Settings.

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Delete account"
  FRAME content 360x744 [FILL/FILL] · vertical pad 24/16/24/16 gap 16
    TEXT whatIsRemoved 328x72 [FIXED/HUG] · fill color/text/primary · mobile/body · "Deleting your account permanently removes your NIC, phone number, email and password. This cannot be undone."
    TEXT whatIsKept 328x60 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Ratings you have given and received stay, shown without your name — so the people you worked with keep the reputation they earned."
    TEXT twoStepNote 328x40 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "You'll be asked to confirm and re-enter your password."
    FRAME spacer-grow 8x412 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/state/danger · r8 · {Style=Destructive, State=Default}
      TEXT label 116x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Delete account"
```

What is removed and what is kept, then the two-step note. The button is `Destructive`.

### `1.17b` — Account deletion · blocked by an active engagement

**Reached from** `1.17`  ·  **Leads to** nothing  ·  **Exits** back → `1.10`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Delete account"
  FRAME content 360x744 [FILL/FILL] · vertical pad 24/16/24/16 gap 16
    TEXT whatIsRemoved 328x96 [FIXED/HUG] · fill color/text/primary · mobile/body · "You can't delete your account while an engagement is active — Shop assistant — weekend with Saman Stores is still running. It has to be completed or cancelled first."
    TEXT whatIsKept 328x80 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Deletion is available again after that. It removes your NIC, phone, email and password permanently; ratings you gave and received stay under an anonymised reference."
    TEXT twoStepNote 328x40 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "You'll be asked to confirm and re-enter your password."
    FRAME spacer-grow 8x368 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/subtle · stroke color/border/default 1 · r8 · {Style=Destructive, State=Disabled}
      TEXT label 116x24 [HUG/HUG] · fill color/text/secondary · mobile/body-medium · "Delete account"
```

**Blocked** while Kavindu's *Shop assistant — weekend* with Saman Stores is still running (Fri 28 – Sun
30 Aug, from his selection until the dispute). The button is `{State=Disabled}` and the text names the engagement and the
way to unblock it: *It has to be completed or cancelled first.* (One-off gigs cannot be *ended*; only a
part-time engagement can.)

### `1.17be` — Account deletion · blocked by an active engagement (employer)

**Reached from** in the demo `1.17`  ·  **Leads to** nothing  ·  **Exits** back → `1.10e`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Delete account"
  FRAME content 360x744 [FILL/FILL] · vertical pad 24/16/24/16 gap 16
    TEXT whatIsRemoved 328x120 [FIXED/HUG] · fill color/text/primary · mobile/body · "You can't delete your account while an engagement is active — Event setup crew (3 needed) with Nethmi Jayasinghe is still running. It has to be completed or cancelled first."
    TEXT whatIsKept 328x80 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Deletion is available again after that. It removes your NIC, phone, email and password permanently; ratings you gave and received stay under an anonymised reference."
    TEXT twoStepNote 328x40 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "You'll be asked to confirm and re-enter your password."
    FRAME spacer-grow 8x344 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/subtle · stroke color/border/default 1 · r8 · {Style=Destructive, State=Disabled}
      TEXT label 116x24 [HUG/HUG] · fill color/text/secondary · mobile/body-medium · "Delete account"
```

Lanka Events, blocked by Event setup crew (3 needed) with Nethmi Jayasinghe — true from her selection on
Thursday until the engagement completes on Saturday.

### `1.17bn` — Account deletion · blocked by an active engagement (Nethmi Jayasinghe)

**Reached from** in the demo `1.17`  ·  **Leads to** nothing  ·  **Exits** back → `1.10n`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Delete account"
  FRAME content 360x744 [FILL/FILL] · vertical pad 24/16/24/16 gap 16
    TEXT whatIsRemoved 328x120 [FIXED/HUG] · fill color/text/primary · mobile/body · "You can't delete your account while an engagement is active — Event setup crew (3 needed) with Lanka Events (Pvt) Ltd is still running. It has to be completed or cancelled first."
    TEXT whatIsKept 328x80 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Deletion is available again after that. It removes your NIC, phone, email and password permanently; ratings you gave and received stay under an anonymised reference."
    TEXT twoStepNote 328x40 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "You'll be asked to confirm and re-enter your password."
    FRAME spacer-grow 8x344 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/subtle · stroke color/border/default 1 · r8 · {Style=Destructive, State=Disabled}
      TEXT label 116x24 [HUG/HUG] · fill color/text/secondary · mobile/body-medium · "Delete account"
```

**The same engagement from Nethmi's side**, Sat 29 Aug about 2 AM: blocked by Event setup crew (3
needed) with Lanka Events (Pvt) Ltd. Once she cancels, nothing is running, and her Delete account goes on to
`1.17p` in the demo.

### `1.17p` — Account deletion · confirm with your password

**Reached from** in the demo `1.17`  ·  **Leads to** `1.17d` ("Delete my account")  ·  **Exits** back → `1.17`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Delete account"
  FRAME content 360x744 [FILL/FILL] · vertical pad 24/16/24/16 gap 16
    INSTANCE Input/TextField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Filled, Type=Secure}
      TEXT label 65x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Password"
      FRAME input 328x48 [FILL/FIXED] · horizontal pad 0/12/0/12 gap 8 · fill color/bg/default · stroke color/border/default 1 · r8
        TEXT value 272x24 [FILL/HUG] · fill color/text/primary · mobile/body · "••••••••••"
        FRAME eye 24x24 [FIXED/FIXED]
          ELLIPSE Ellipse 20x12 [FIXED/FIXED] @2,6 · stroke color/text/secondary 1.5
          ELLIPSE Ellipse 7x7 [FIXED/FIXED] @9,9 · fill color/text/secondary
    TEXT deleteNote 328x120 [FILL/HUG] · fill color/text/secondary · mobile/body · "Re-enter your password to confirm. Your NIC, phone, email and password are removed permanently. Ratings you gave and received stay, attributed to an anonymised reference."
    FRAME spacer-grow 8x408 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/state/danger · r8 · {Style=Destructive, State=Default}
      TEXT label 143x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Delete my account"
```

**The second step**: the password, and a last restatement of what goes and what stays. The button reads
*Delete my account*.

### `1.17d` — Account deletion · deleted

**Reached from** `1.17p`  ·  **Leads to** `1.1` ("Back to the start")

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    TEXT title 352x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Delete account"
  FRAME content 360x744 [FILL/FILL] · vertical pad 24/16/24/16 gap 16
    TEXT title 328x32 [FILL/HUG] · fill color/text/primary · mobile/display · "Account deleted"
    TEXT body 328x96 [FILL/HUG] · fill color/text/primary · mobile/body · "Your identifying details are gone. Ratings you gave and received remain, attributed to an anonymised reference, so other people's history stays honest."
    FRAME spacer-grow 8x472 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 128x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Back to the start"
```

Done. There is no back chevron — there is nothing to go back to — and the only action returns to the
start.

## Who is who, and the sample data

The same people on every screen that names them. Keep the names when reproducing a screen for review;
replace them with real data in the product.

| Person | Role | Phone | NIC | Born | Email |
| --- | --- | --- | --- | --- | --- |
| **Kavindu Perera** | worker | +94 77 123 4567 | 200412345678 | 2004-03-14 | `kavindu@example.com` (added after registering) |
| **Lanka Events (Pvt) Ltd** — Ruwan Jayasuriya | employer, Business | +94 11 234 5678 | 198512345678 | 1985-06-20 | `hello@lankaevents.lk` |
| **Sunil Bandara** | Community Verifier | +94 71 456 7890 | 195512349012 | 1955-05-03 | `sunil.b@example.com` |
| **Nethmi Jayasinghe** | worker | +94 76 234 5678 (lost on 5 Sep) | 200156789012 | 2001-03-08 | none |
| **R. Gunasekara** | employer, Individual | +94 71 987 6543 | 198712345678 | — | none |
| **Dilrukshi Herath** | employer, Individual | +94 77 318 2046 | ends 2231 | — | `dilrukshi.herath@example.com` |

Settings shows a NIC masked to its last four; the full number appears only where staff see it (M10, M11)
or where the person typed it. A dash means no screen shows the value.

**Sample one-time codes are distinct**, so no screen can be mistaken for another's step: registration
`371582` (Kavindu), `506294` (Lanka Events), `813706` (Sunil); code login `904627` (Kavindu), `268153`
(Lanka Events), `740931` (Sunil), `639208` (Gunasekara). The shared contact forms use samples that belong to
nobody — the new number `+94 76 555 0199` and the address `new.address@example.com`.

## Every screen shows one moment

Each screen is one moment, and within each journey time only moves forward. Registration and the settings
forms are timeless — they show a person's own details, which do not change inside the story — so the table
dates only the screens that could be wrong on another day.

| When | Screens | What is true then |
| --- | --- | --- |
| **Thu 27 Aug, before 7:00 AM** | `1.1`–`1.4`, `1.18z` | Kavindu registers, no endorsement yet |
| **Thu 27 Aug** | `1.19` | Nethmi as Lanka Events sees her in the pool |
| **Thu 27 Aug, about 6 PM** | `1.18ed`, `1.10ed`, `1.10sed` | Dilrukshi posts the tutoring job; nobody has applied |
| **Thu 27 – Sat 29 Aug** | `1.17be` | Lanka Events' Event setup crew with Nethmi is running |
| **Fri 28 Aug** | `1.18`, `8.6`, `1.18bio` | Kavindu has been vouched for, has no history, and adds his bio |
| **Fri 28 – Sun 30 Aug** | `1.17b` | The Shop assistant engagement is running, before the dispute |
| **Sat 29 Aug, about 2 AM** | `1.18n`, `1.10n`, `1.10sn`, `1.17bn` | Nethmi is engaged on Event setup crew and about to cancel |
| **Sat 29 Aug, just after** | `1.18nc` | She has cancelled, late; her Settings are unchanged |
| **Mon 31 Aug – Thu 3 Sep** | `1.18eg`, `1.10eg`, `1.10seg` | R. Gunasekara's posting is hidden pending review; two warnings so far |
| **Fri 4 Sep, after 3:38 PM** | `1.6sus`, `1.7sus` | Gunasekara's account is suspended |
| **Sat 5 Sep, morning** | `1.8rec1`, `1.8bnr`, `1.8rec2`, `1.8rec3` | Nethmi asks for her account back |
| **Sat 5 Sep, after 10:15 AM** | `1.8rec4` | The Admin has approved it |
| **Sat 5 Sep, 6 PM** | `1.18b` | After the reveal |

## Transitions that are not clicks

| Frame | Fires | After | To |
| --- | --- | --- | --- |
| `1.6sub` | the button's `AFTER_TIMEOUT` | 1.2 s | `1.18` |

Marked † in the screen notes. The timeout is in seconds.

## What the collapsed chrome hides

**The registration top bar.** `topBar` is a 328 × 44 horizontal frame at `@16,6` holding `backHit` (44 × 44,
the back chevron — an 8 × 16 vector at `@6,14`), `topSpacer` (240 × 8) and `closeHit` (44 × 44, the ✕ — a
12 × 12 vector at `@26,16`). The ✕ abandons registration and returns to role selection. On the details step
and the recovery form it carries 8 px of bottom padding (328 × 52), and on `1.4k` 4 px (328 × 48).
**`topBarGhost`** on role selection is an empty 44 × 44 frame in the same place: step 1 has nothing to go
back to, but the title must sit at the height every later step uses.

**The tab bar** appears only on the profiles. Under it, **`Role`** is Worker, Employer or Verifier, and
**`Notification badge`** is `true` on the established profiles and `false` on the first-run profiles and on
Dilrukshi Herath's and R. Gunasekara's.

**Tab destinations are not drawn on this page.** The demo routes them per role and per journey — which is
how Dilrukshi's and Gunasekara's Profile tabs reach `1.18ed` and `1.18eg`, and their Notifications tabs M3
`3.10ed` and `3.10eg`, rather than Lanka Events' screens; and how Nethmi's four tabs reach her own Browse,
Applications, Notifications and Profile (M3 `3.1n`, M4 `4.3nj`, M3 `3.10n`, `1.18n`, and their after-cancel
copies).

**The badge is labelled *Phone verified*** (`FR-PROF-02`): it states the one thing that was checked. Where a
name and the badge do not fit on one line, the row wraps and the badge goes beneath the name (`1.18e`).

## States not drawn in this module

| Not drawn | Build it from |
| --- | --- |
| A **rejected** recovery request | `1.8rec3`'s layout with an `Info` banner saying the details did not match and naming the next step (contact support); the staff side is M11's |
| **Confirming** a phone or email change (the SMS code, the link landing) | the code step is `1.3`'s layout with the new number; the link lands on the person's Settings with the new address and a success banner |
| The **deletion refused by a wrong password** | `1.17p` with the field `{State=Error}` and `1.12err`'s message |
| A **code-login** code that is wrong or expired | `1.3err2` / `1.3err1` on the `1.7` layout |
| A **login screen with the number remembered** for Dilrukshi, Gunasekara or Nethmi | `1.6` with their number; their sign-outs land on the empty `1.6emp` instead |
| **Ratings received, listed** — opened from the rating summary on the own profile (`FR-ENG-14` as amended 2026-09-24: a rating stays reachable after its engagement leaves the Engagements list) | M6 `6.3`'s rating cards for every engagement, newest first, each with *Write a public response* / *Request removal* as on `6.3` and `6.3s`; the summary line (`avg` · `count`) becomes the link |

## Open, and carried to the modules that own them

Nothing is open in this module.
