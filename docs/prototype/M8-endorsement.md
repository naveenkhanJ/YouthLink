# M8 — Endorsement

Nineteen screens for the mechanism that solves the cold start. Someone new has no ratings, and no ratings
means no work, which is how they stay new. An endorsement lends them somebody else's standing until they
have their own — see [MHF](MHF-help.md) `HF.3` for the product's own explanation of it.

**The module has two halves that never meet.** `8.1` and `8.1b` are the *endorsed* person's view — their
code, and what happens when the window closes. Everything from `8.2` onward is the *Verifier's* view:
entering a code, searching by phone, vouching, and managing what they have vouched for. They are different
roles with different tab bars, so do not build them as one screen set.

**`Chrome/TabBar` is collapsed to one line** in every tree here, as `[standard, see header]`. It is
identical on all four tabbed screens and is specified once in [MNAV](MNAV-shells.md) `NAV.3`, the Verifier
shell. Its variant properties still appear on the collapsed line, because which tab is active differs by
screen.

Read `README.md` first for the notation, and `design-system.md` for the tokens and components.

---

### `8.1` — My endorsement code

**Reached from** [M4](M4-applying.md) `4.3n`, `8.7`  ·  **Leads to** `8.1s`  ·  **Exits** back → history

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "My endorsement code"
  FRAME content 360x744 [FILL/FILL] · vertical pad 20/16/24/16 gap 14
    TEXT explainer 328x60 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Share this code with someone who knows your work. If they vouch for you, employers see you higher in the list."
    FRAME codeBox 328x56 [FILL/HUG] · horizontal pad 14/20/14/20 gap 0 · fill color/bg/subtle · r8
      TEXT code 104x28 [HUG/HUG] · fill color/badge/endorsed · mobile/title · "K 7 X A 2 B"
    TEXT format 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Letters and numbers — not like an SMS code."
    TEXT eligibility 328x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Yours until your first rating arrives — then it closes for good."
    INSTANCE Action/Link 189x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
      TEXT label 189x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "How endorsement works"
    FRAME spacer-grow 8x352 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 87x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Share code"
```

**The code is spaced — `"K 7 X A 2 B"` — and that is display formatting, not the value.** The value is
`K7XA2B`, which is what `8.1s`'s share text and `8.2`'s entered code both use. Render the spacing; store
and compare the unspaced string.

**`format` exists because the other code in this product is numeric.** A user who has just typed a
six-digit SMS code will read six characters and assume digits. The line is one sentence of prevention.

**`eligibility` states the closing rule where it will be read**, not only in the help page: the code dies
at the first rating and does not come back.

### `8.1b` — My endorsement code · window closed

**Reached from** [M1](M1-account.md) `1.18b`  ·  **Leads to** nothing  ·  **Exits** back → history

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "My endorsement code"
  FRAME content 360x744 [FILL/FILL] · vertical pad 20/16/24/16 gap 14
    TEXT closedNote 328x96 [FIXED/HUG] · fill color/text/secondary · mobile/body · "Your endorsement window has closed — it ended when your first rating arrived, and it doesn't reopen. Endorsements you already received stay on your profile."
    FRAME spacer-grow 8x590 [FIXED/FILL]
```

**No code, no button, and that is the whole design.** The screen keeps its title and its route so the
entry point does not vanish from the settings list, but there is nothing to do here. **Do not show a
greyed-out code** — a disabled control implies it might become enabled, and this one never will.

**"Endorsements you already received stay on your profile"** answers the question the closure raises. The
window closing is not the endorsements expiring.

### `8.1s` — My endorsement code · share sheet (OS)

**Reached from** `8.1`  ·  **Leads to** `8.1` from every control  ·  **Exits** scrim → `8.1`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "My endorsement code"
  FRAME content 360x744 [FILL/FILL] · vertical pad 20/16/24/16 gap 14
    TEXT explainer 328x60 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Share this code with someone who knows your work. If they vouch for you, employers see you higher in the list."
    FRAME codeBox 328x56 [FILL/HUG] · horizontal pad 14/20/14/20 gap 0 · fill color/bg/subtle · r8
      TEXT code 104x28 [HUG/HUG] · fill color/badge/endorsed · mobile/title · "K 7 X A 2 B"
    TEXT format 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Letters and numbers — not like an SMS code."
    TEXT eligibility 328x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Yours until your first rating arrives — then it closes for good."
    INSTANCE Action/Link 189x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
      TEXT label 189x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "How endorsement works"
    FRAME spacer-grow 8x352 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 87x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Share code"
  RECTANGLE scrim 360x800 [FIXED/FIXED] @0,0 · fill color/overlay/scrim · opacity 40%
  INSTANCE OS/ShareSheet 360x314 [FIXED/HUG] @0,486 · vertical pad 8/16/24/16 gap 16 · fill color/bg/default
    RECTANGLE handle 36x4 [FIXED/FIXED] · fill #c7ccd4 · r2
    TEXT Share 45x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Share"
    FRAME preview 328x64 [FILL/HUG] · horizontal pad 12 gap 0 · fill color/bg/subtle · r10
      TEXT My YouthLink endorsement code: K7XA2B — enter it in the app to vouch for me. 304x40 [FILL/HUG] · fill color/text/primary · mobile/secondary · "My YouthLink endorsement code: K7XA2B — enter it in the app to vouch for me."
    FRAME apps 328x78 [FILL/HUG] · horizontal pad 0 gap 0
      FRAME app-Messages 58x78 [HUG/HUG] · vertical pad 0 gap 6
        ELLIPSE icon 56x56 [FIXED/FIXED] · fill color/bg/subtle
        TEXT Messages 58x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Messages"
      FRAME app-WhatsApp 59x78 [HUG/HUG] · vertical pad 0 gap 6
        ELLIPSE icon 56x56 [FIXED/FIXED] · fill color/bg/subtle
        TEXT WhatsApp 59x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "WhatsApp"
      FRAME app-Copy 56x78 [HUG/HUG] · vertical pad 0 gap 6
        ELLIPSE icon 56x56 [FIXED/FIXED] · fill color/bg/subtle
        TEXT Copy 30x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Copy"
      FRAME app-More 56x78 [HUG/HUG] · vertical pad 0 gap 6
        ELLIPSE icon 56x56 [FIXED/FIXED] · fill color/bg/subtle
        TEXT More 30x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "More"
    INSTANCE cancel 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · of Action/Button · {Style=Secondary, State=Default}
      TEXT label 53x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · align center · "Cancel"
```

**`OS/ShareSheet` imitates the platform, not this product** — that is why its `handle` is a literal
`#c7ccd4` rather than a token, and it is the only unbound colour left in the file. See `design-system.md`
§5, OS mocks. **Do not build this sheet**; call the platform share intent and let the OS draw it.

**The share text is the deliverable:** `"My YouthLink endorsement code: K7XA2B — enter it in the app to
vouch for me."` It names the product, gives the code unspaced, and says what to do with it, because it
will arrive in a WhatsApp thread with no other context.

### `8.2` — Enter a code

**Reached from** [MNAV](MNAV-shells.md) Vouch tab, `8.5`, `8.5d`, `8.5dI`, `8.5dK`, `8.5z`  ·
**Leads to** `8.3` (search by phone), `8.4` (check code)  ·  **Exits** tab bar

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 14
    TEXT screenTitle 328x32 [FIXED/HUG] · fill color/text/primary · mobile/display · "Have a code to enter?"
    TEXT explainer 328x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "If someone shared their YouthLink code with you, enter it to vouch for them."
    INSTANCE Input/CodeInputAlpha 328x100 [FILL/HUG] · vertical pad 0 gap 4 · {State=Filled}
      TEXT Endorsement code 328x20 [FILL/HUG] · fill color/text/secondary · mobile/secondary · "Endorsement code"
      FRAME input 328x56 [FILL/FIXED] · horizontal pad 0/16/0/16 gap 0 · fill color/bg/default · stroke color/badge/endorsed 2 · r8
        TEXT K7XA2B 110x26 [HUG/HUG] · fill color/text/primary · mobile/code · "K7XA2B"
      TEXT Letters and numbers — not like an SMS code. 328x16 [FILL/HUG] · fill color/text/secondary · mobile/caption · "Letters and numbers — not like an SMS code."
    FRAME linkGroup 189x88 [HUG/HUG] · vertical pad 0 gap 0
      INSTANCE Action/Link 188x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 188x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Search by phone instead"
      INSTANCE Action/Link 189x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
        TEXT label 189x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "How endorsement works"
    FRAME spacer-grow 8x276 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 92x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Check code"
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Verifier} · [standard, see header]
```

**This is the only screen using `mobile/code`** — Inter Semi Bold 20 with 6px letter-spacing. The tracking
is the point: an entered code is read back character by character, and normal spacing makes `K7XA2B` a
word rather than six symbols.

**The field's focus border is `color/badge/endorsed`, not `color/brand/primary`.** Endorsement purple runs
through this module — the code in `8.1`, this border, the attribute chips in `8.5` — and it is the one
place a non-brand colour leads a control.

**`content` starts at `pad 66` top** because this screen has no `Chrome/ScreenHeader`. It is a tab
destination, so the title is part of the content and 66 is what clears the status bar.

### `8.3` — Find someone to vouch for

**Reached from** `8.2`  ·  **Leads to** `8.3m`  ·  **Exits** back → history

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Vouch for someone"
  FRAME content 360x744 [FILL/FILL] · vertical pad 20/16/24/16 gap 14
    TEXT explainer 328x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Know their number? Search for someone you can vouch for."
    INSTANCE Input/PhoneField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Default}
      TEXT Phone number 97x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Phone number"
      FRAME input 328x48 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
        FRAME prefix 56x48 [HUG/FILL] · horizontal pad 0/12/0/12 gap 0 · fill color/bg/subtle
          TEXT +94 32x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "+94"
        FRAME val 107x48 [HUG/FILL] · horizontal pad 0/0/0/12 gap 0
          TEXT 7X XXX XXXX 95x24 [HUG/HUG] · fill color/text/primary · mobile/body · "77 123 4567"
    FRAME spacer-grow 8x498 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 54x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Search"
```

**A phone search returns one person or none — never a list.** `NFR-PRIV-04` forbids a general user
directory, so this is a lookup by an identifier the Verifier already knows, not a way to browse people.
That constraint is why `8.3m` shows a single card and `8.3d` shows nothing at all.

### `8.3d` — Find someone to vouch for · no match

**Reached from** `8.3n`  ·  **Leads to** nothing  ·  **Exits** back → `8.3`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Vouch for someone"
  FRAME content 360x744 [FILL/FILL] · vertical pad 20/16/24/16 gap 14
    INSTANCE Input/PhoneField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Default}
      TEXT Phone number 97x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Phone number"
      FRAME input 328x48 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
        FRAME prefix 56x48 [HUG/FILL] · horizontal pad 0/12/0/12 gap 0 · fill color/bg/subtle
          TEXT +94 32x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "+94"
        FRAME val 108x48 [HUG/FILL] · horizontal pad 0/0/0/12 gap 0
          TEXT 7X XXX XXXX 96x24 [HUG/HUG] · fill color/text/secondary · mobile/body · "71 999 0000"
    TEXT noMatch 328x24 [FIXED/HUG] · fill color/text/primary · mobile/body · "No one to show for that number."
    TEXT noMatchSub 328x24 [FIXED/HUG] · fill color/text/secondary · mobile/body · "Check the number and try again."
    FRAME spacer-grow 8x538 [FIXED/FILL]
```

**"No one to show for that number" does not say whether an account exists.** That wording is deliberate
and `NFR-PRIV-04` is why: a message distinguishing "no account" from "account not eligible" would turn
this field into a membership oracle anyone could query.

**The searched number renders in `color/text/secondary`, not primary** — the only screen where the phone
value is greyed. It reads as a failed query rather than a value you entered.

### `8.3m` — Find someone to vouch for · match found

**Reached from** `8.3`  ·  **Leads to** `8.3n` (search again), `8.4` (vouch)  ·  **Exits** back → `8.3`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Vouch for someone"
  FRAME content 360x744 [FILL/FILL] · vertical pad 20/16/24/16 gap 14
    TEXT explainer 328x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Know their number? Search for someone you can vouch for."
    INSTANCE Input/PhoneField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Default}
      TEXT Phone number 97x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Phone number"
      FRAME input 328x48 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
        FRAME prefix 56x48 [HUG/FILL] · horizontal pad 0/12/0/12 gap 0 · fill color/bg/subtle
          TEXT +94 32x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "+94"
        FRAME val 107x48 [HUG/FILL] · horizontal pad 0/0/0/12 gap 0
          TEXT 7X XXX XXXX 95x24 [HUG/HUG] · fill color/text/primary · mobile/body · "77 123 4567"
    FRAME resultCard 328x68 [FILL/HUG] · vertical pad 12/14/12/14 gap 4 · fill color/bg/default · r8
      TEXT Kavindu Perera 116x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Kavindu Perera"
      TEXT Matches +94 77 123 4567 150x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Matches +94 77 123 4567"
    INSTANCE Action/Link 264x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
      TEXT label 264x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Not the right person? Search again"
    FRAME spacer-grow 8x358 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 194x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Vouch for Kavindu Perera"
```

**The card shows a name and the matched number, and nothing else** — no photo, no rating, no history.
Again `NFR-PRIV-04`: enough to confirm you found the right person, not enough to browse them.

**"Not the right person? Search again" is placed before the commit button**, not after, so the escape is
read before the action. The button naming the person — *"Vouch for Kavindu Perera"* — is the second
confirmation.

### `8.3n` — Find someone to vouch for · unmatched number typed

**Reached from** `8.3m`  ·  **Leads to** `8.3d`  ·  **Exits** back → `8.2`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Vouch for someone"
  FRAME content 360x744 [FILL/FILL] · vertical pad 20/16/24/16 gap 14
    TEXT explainer 328x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Know their number? Search for someone you can vouch for."
    INSTANCE Input/PhoneField 328x72 [FIXED/HUG] · vertical pad 0 gap 4 · {State=Default}
      TEXT Phone number 97x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Phone number"
      FRAME input 328x48 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8
        FRAME prefix 56x48 [HUG/FILL] · horizontal pad 0/12/0/12 gap 0 · fill color/bg/subtle
          TEXT +94 32x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "+94"
        FRAME val 108x48 [HUG/FILL] · horizontal pad 0/0/0/12 gap 0
          TEXT 7X XXX XXXX 96x24 [HUG/HUG] · fill color/text/primary · mobile/body · "71 999 0000"
    FRAME spacer-grow 8x498 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 54x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Search"
```

**This is `8.3` with a different number typed and the result card gone** — the state between abandoning
one match and searching again. Its back arrow goes to `8.2` rather than `8.3`, because arriving here means
the Verifier rejected the previous match and going "back" to it would be a loop.

### `8.4` — Give an endorsement

**Reached from** `8.2`, `8.3m`  ·  **Leads to** `8.4e`  ·  **Exits** back → history

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Vouch"
  FRAME scopeStatement 360x80 [FILL/HUG] · vertical pad 10/16/10/16 gap 0 · fill color/bg/subtle
    TEXT scopeText 328x60 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "Vouching says you know this person and consider them reliable — it doesn't guarantee their work, and employers see it with your name."
  FRAME content 360x664 [FILL/FILL] · vertical pad 16/16/24/16 gap 12
    FRAME whoRow 147x28 [HUG/HUG] · horizontal pad 0 gap 8
      TEXT whoName 147x28 [HUG/HUG] · fill color/text/primary · mobile/title · "Kavindu Perera"
    TEXT attrLabel 195x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "WHAT STANDS OUT? (OPTIONAL)"
    FRAME attributeChips 328x96 [FIXED/HUG] · horizontal pad 0 gap 8
      INSTANCE Input/Chip 114x44 [HUG/HUG] · horizontal pad 10/14/10/14 gap 0 · fill color/brand/primary · r999 · {Kind=Select, State=Selected}
        TEXT label 86x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Punctuality"
      INSTANCE Input/Chip 84x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
        TEXT label 56x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Honesty"
      INSTANCE Input/Chip 102x44 [HUG/HUG] · horizontal pad 10/14/10/14 gap 0 · fill color/brand/primary · r999 · {Kind=Select, State=Selected}
        TEXT label 74x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Reliability"
      INSTANCE Input/Chip 110x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
        TEXT label 82x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Specific skill"
      INSTANCE Input/Chip 154x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · fill color/bg/default · stroke color/border/default 1 · r999 · {Kind=Select, State=Default}
        TEXT label 126x20 [HUG/HUG] · fill color/text/primary · mobile/secondary · "Long acquaintance"
    TEXT reasonLabel 203x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "How do you know this person?"
    INSTANCE reasonField 328x96 [FILL/HUG] · vertical pad 12 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8 · of Input/TextArea · {State=Default}
      TEXT placeholder 302x24 [FILL/HUG] · fill color/text/secondary · mobile/body · "My neighbour — known him 8 years"
    FRAME spacer-grow 8x248 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 194x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Vouch for Kavindu Perera"
```

**`scopeStatement` is a full-bleed band between the header and `content`** — 360 wide, `bg/subtle`, its own
frame. No other screen in this product has one, and it exists because this is the only action where a user
puts their own name behind someone else's. **"employers see it with your name"** is the sentence that
makes the endorsement meaningful and the one people would otherwise skip.

**A chip's selected state changes its text style, not just its colour** — `mobile/body-medium` at
`color/text/inverse` on brand, against `mobile/secondary` at `color/text/primary` when unselected. That is
why selected chips are taller inside the same 44px row.

**`attrLabel` is the only upper-case label in the module** and is `mobile/caption`, not
`mobile/section-label`. Reproduce the case from the string; do not add letter-spacing.

### `8.4e` — Give an endorsement · live

**Reached from** `8.4`  ·  **Leads to** `8.5`  ·  **Exits** back → `8.5`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Vouch"
  FRAME content 360x744 [FILL/FILL] · vertical pad 16/16/24/16 gap 12
    FRAME whoRow 147x28 [HUG/HUG] · horizontal pad 0 gap 8
      TEXT whoName 147x28 [HUG/HUG] · fill color/text/primary · mobile/title · "Kavindu Perera"
    FRAME successGlyph 48x48 [FIXED/FIXED]
      ELLIPSE Ellipse 48x48 [FIXED/FIXED] @0,0 · stroke color/state/success 2.5
      VECTOR Vector 22x16 [FIXED/FIXED] @13,16 · stroke color/state/success 3
    TEXT liveTitle 328x32 [FIXED/HUG] · fill color/text/primary · mobile/display · "Your endorsement is live"
    TEXT liveBody 328x72 [FIXED/HUG] · fill color/text/secondary · mobile/body · "It shows on their profile immediately — there's no review step. You can revoke it any time from My endorsements."
    FRAME spacer-grow 8x416 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 138x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "My endorsements"
```

**"There's no review step" is a product decision stated to the user.** An endorsement is live on submit —
no moderation queue, no delay — and the balancing control is that it can be revoked, which the same
sentence points at. Build both halves or neither.

### `8.5` — My endorsements

**Reached from** [MNAV](MNAV-shells.md) Endorsements tab, `8.4e`  ·
**Leads to** `8.5c`, `8.5cI`, `8.5cK`  ·  **Exits** tab bar → `8.2`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    TEXT screenTitle 210x32 [HUG/HUG] · fill color/text/primary · mobile/display · "My endorsements"
    TEXT trackRecord 328x20 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "3 endorsed, 1 went on to build a good rating"
    TEXT privacyNote 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Only you can see this."
    INSTANCE Display/EndorsementRow 328x188 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show revoke=true, State=Default}
      FRAME nameRow 116x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT endorserName 116x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Kavindu Perera"
      TEXT relationship 237x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "My neighbour — known him 8 years"
      FRAME attributes 202x44 [HUG/HUG] · horizontal pad 0 gap 8
        INSTANCE Input/Chip 92x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · stroke color/badge/endorsed 1 · r999 · {Kind=Display, State=Default}
          TEXT label 64x20 [HUG/HUG] · fill color/badge/endorsed · mobile/secondary · "Reliability"
        INSTANCE Input/Chip 102x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · stroke color/badge/endorsed 1 · r999 · {Kind=Display, State=Default}
          TEXT label 74x20 [HUG/HUG] · fill color/badge/endorsed · mobile/secondary · "Punctuality"
      FRAME revokeAction 296x44 [FILL/HUG] · horizontal pad 0 gap 0
        INSTANCE Action/Link 55x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
          TEXT label 55x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Revoke"
    INSTANCE Display/EndorsementRow 328x188 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show revoke=true, State=Default}
      FRAME nameRow 124x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT endorserName 124x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Ishara Fernando"
      TEXT relationship 235x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Worked in my shop for two seasons"
      FRAME attributes 202x44 [HUG/HUG] · horizontal pad 0 gap 8
        INSTANCE Input/Chip 92x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · stroke color/badge/endorsed 1 · r999 · {Kind=Display, State=Default}
          TEXT label 64x20 [HUG/HUG] · fill color/badge/endorsed · mobile/secondary · "Reliability"
        INSTANCE Input/Chip 102x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · stroke color/badge/endorsed 1 · r999 · {Kind=Display, State=Default}
          TEXT label 74x20 [HUG/HUG] · fill color/badge/endorsed · mobile/secondary · "Punctuality"
      FRAME revokeAction 296x44 [FILL/HUG] · horizontal pad 0 gap 0
        INSTANCE Action/Link 55x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
          TEXT label 55x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Revoke"
    INSTANCE Display/EndorsementRow 328x136 [FILL/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show revoke=true, State=Default}
      FRAME nameRow 201x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT endorserName 201x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Chamara Wickramasinghe"
      TEXT relationship 201x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Former colleague — two years"
      FRAME revokeAction 296x44 [FILL/HUG] · horizontal pad 0 gap 0
        INSTANCE Action/Link 55x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
          TEXT label 55x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Revoke"
    INSTANCE Display/EndorsementRow 328x84 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show revoke=false, State=Revoked}
      FRAME nameRow 137x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT endorserName 80x24 [HUG/HUG] · fill color/text/secondary · mobile/body-medium · "W. Dilshan"
        TEXT revokedLabel 49x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Revoked"
      TEXT relationship 118x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Former classmate"
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Verifier} · [standard, see header]
```

**`trackRecord` is the Verifier's own record, and `privacyNote` limits it.** *"3 endorsed, 1 went on to
build a good rating"* is how `FR-ENDORSE-11` makes vouching consequential — a Verifier who vouches
carelessly can see it — and *"Only you can see this"* stops it becoming a public reputation score.

**A row's height is driven by its content, not a fixed size:** 188 with attribute chips, 136 without, 84
when revoked. `Display/EndorsementRow` hugs, so do not size these rows.

**A revoked row keeps the name and relationship but drops the chips and the action**, and every text moves
to `color/text/secondary`. The entry stays visible because the Verifier needs to know they revoked it.

### `8.5c` — My endorsements · revoke? (dialog)

**Reached from** `8.5`, `8.5dI`, `8.5dK`  ·  **Leads to** `8.5` (Keep), `8.5d` (Revoke)

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    TEXT screenTitle 210x32 [HUG/HUG] · fill color/text/primary · mobile/display · "My endorsements"
    TEXT trackRecord 328x20 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "3 endorsed, 1 went on to build a good rating"
    TEXT privacyNote 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Only you can see this."
    INSTANCE Display/EndorsementRow 328x188 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show revoke=true, State=Default}
      FRAME nameRow 116x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT endorserName 116x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Kavindu Perera"
      TEXT relationship 237x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "My neighbour — known him 8 years"
      FRAME attributes 202x44 [HUG/HUG] · horizontal pad 0 gap 8
        INSTANCE Input/Chip 92x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · stroke color/badge/endorsed 1 · r999 · {Kind=Display, State=Default}
          TEXT label 64x20 [HUG/HUG] · fill color/badge/endorsed · mobile/secondary · "Reliability"
        INSTANCE Input/Chip 102x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · stroke color/badge/endorsed 1 · r999 · {Kind=Display, State=Default}
          TEXT label 74x20 [HUG/HUG] · fill color/badge/endorsed · mobile/secondary · "Punctuality"
      FRAME revokeAction 296x44 [FILL/HUG] · horizontal pad 0 gap 0
        INSTANCE Action/Link 55x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
          TEXT label 55x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Revoke"
    INSTANCE Display/EndorsementRow 328x188 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show revoke=true, State=Default}
      FRAME nameRow 124x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT endorserName 124x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Ishara Fernando"
      TEXT relationship 235x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Worked in my shop for two seasons"
      FRAME attributes 202x44 [HUG/HUG] · horizontal pad 0 gap 8
        INSTANCE Input/Chip 92x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · stroke color/badge/endorsed 1 · r999 · {Kind=Display, State=Default}
          TEXT label 64x20 [HUG/HUG] · fill color/badge/endorsed · mobile/secondary · "Reliability"
        INSTANCE Input/Chip 102x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · stroke color/badge/endorsed 1 · r999 · {Kind=Display, State=Default}
          TEXT label 74x20 [HUG/HUG] · fill color/badge/endorsed · mobile/secondary · "Punctuality"
      FRAME revokeAction 296x44 [FILL/HUG] · horizontal pad 0 gap 0
        INSTANCE Action/Link 55x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
          TEXT label 55x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Revoke"
    INSTANCE Display/EndorsementRow 328x136 [FILL/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show revoke=true, State=Default}
      FRAME nameRow 201x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT endorserName 201x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Chamara Wickramasinghe"
      TEXT relationship 201x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Former colleague — two years"
      FRAME revokeAction 296x44 [FILL/HUG] · horizontal pad 0 gap 0
        INSTANCE Action/Link 55x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
          TEXT label 55x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Revoke"
    INSTANCE Display/EndorsementRow 328x84 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show revoke=false, State=Revoked}
      FRAME nameRow 137x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT endorserName 80x24 [HUG/HUG] · fill color/text/secondary · mobile/body-medium · "W. Dilshan"
        TEXT revokedLabel 49x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Revoked"
      TEXT relationship 118x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Former classmate"
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Verifier} · [standard, see header]
  RECTANGLE scrim 360x800 [FIXED/FIXED] @0,0 · fill color/overlay/scrim · opacity 40%
  INSTANCE Feedback/ConfirmDialog 328x180 [FIXED/HUG] @16,310 · vertical pad 20 gap 12 · fill color/bg/default · r12
    TEXT title 257x28 [HUG/HUG] · fill color/text/primary · mobile/title · "Revoke this endorsement?"
    TEXT body 288x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Revoking stops future display but doesn't undo a hire that already happened."
    FRAME actions 288x48 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Action/Button 87x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 39x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Keep"
      INSTANCE Action/Button 104x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/state/danger · r8 · {Style=Destructive, State=Default}
        TEXT label 56x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Revoke"
```

**The safe escape is `Style=Secondary`, not `Style=Text`.** `design-system.md` §5 states the rule and this
is where it matters: giving "Keep" the weakest affordance beside a destructive button is the defect the
distinction exists to prevent.

**"Doesn't undo a hire that already happened"** is the consequence a Verifier is most likely to
misunderstand. Revocation is forward-looking only.

### `8.5cI` — My endorsements · revoke? (dialog, Ishara)

**Reached from** `8.5`, `8.5d`, `8.5dK`  ·  **Leads to** `8.5` (Keep), `8.5dI` (Revoke)

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    TEXT screenTitle 210x32 [HUG/HUG] · fill color/text/primary · mobile/display · "My endorsements"
    TEXT trackRecord 328x20 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "3 endorsed, 1 went on to build a good rating"
    TEXT privacyNote 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Only you can see this."
    INSTANCE Display/EndorsementRow 328x188 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show revoke=true, State=Default}
      FRAME nameRow 116x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT endorserName 116x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Kavindu Perera"
      TEXT relationship 237x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "My neighbour — known him 8 years"
      FRAME attributes 202x44 [HUG/HUG] · horizontal pad 0 gap 8
        INSTANCE Input/Chip 92x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · stroke color/badge/endorsed 1 · r999 · {Kind=Display, State=Default}
          TEXT label 64x20 [HUG/HUG] · fill color/badge/endorsed · mobile/secondary · "Reliability"
        INSTANCE Input/Chip 102x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · stroke color/badge/endorsed 1 · r999 · {Kind=Display, State=Default}
          TEXT label 74x20 [HUG/HUG] · fill color/badge/endorsed · mobile/secondary · "Punctuality"
      FRAME revokeAction 296x44 [FILL/HUG] · horizontal pad 0 gap 0
        INSTANCE Action/Link 55x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
          TEXT label 55x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Revoke"
    INSTANCE Display/EndorsementRow 328x188 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show revoke=true, State=Default}
      FRAME nameRow 124x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT endorserName 124x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Ishara Fernando"
      TEXT relationship 235x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Worked in my shop for two seasons"
      FRAME attributes 202x44 [HUG/HUG] · horizontal pad 0 gap 8
        INSTANCE Input/Chip 92x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · stroke color/badge/endorsed 1 · r999 · {Kind=Display, State=Default}
          TEXT label 64x20 [HUG/HUG] · fill color/badge/endorsed · mobile/secondary · "Reliability"
        INSTANCE Input/Chip 102x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · stroke color/badge/endorsed 1 · r999 · {Kind=Display, State=Default}
          TEXT label 74x20 [HUG/HUG] · fill color/badge/endorsed · mobile/secondary · "Punctuality"
      FRAME revokeAction 296x44 [FILL/HUG] · horizontal pad 0 gap 0
        INSTANCE Action/Link 55x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
          TEXT label 55x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Revoke"
    INSTANCE Display/EndorsementRow 328x136 [FILL/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show revoke=true, State=Default}
      FRAME nameRow 201x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT endorserName 201x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Chamara Wickramasinghe"
      TEXT relationship 201x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Former colleague — two years"
      FRAME revokeAction 296x44 [FILL/HUG] · horizontal pad 0 gap 0
        INSTANCE Action/Link 55x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
          TEXT label 55x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Revoke"
    INSTANCE Display/EndorsementRow 328x84 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show revoke=false, State=Revoked}
      FRAME nameRow 137x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT endorserName 80x24 [HUG/HUG] · fill color/text/secondary · mobile/body-medium · "W. Dilshan"
        TEXT revokedLabel 49x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Revoked"
      TEXT relationship 118x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Former classmate"
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Verifier} · [standard, see header]
  RECTANGLE scrim 360x800 [FIXED/FIXED] @0,0 · fill color/overlay/scrim · opacity 40%
  INSTANCE Feedback/ConfirmDialog 328x208 [FIXED/HUG] @16,296 · vertical pad 20 gap 12 · fill color/bg/default · r12
    TEXT title 288x56 [FILL/HUG] · fill color/text/primary · mobile/title · "Revoke your endorsement of Ishara Fernando?"
    TEXT body 288x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Revoking stops future display but doesn't undo a hire that already happened."
    FRAME actions 288x48 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Action/Button 87x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 39x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Keep"
      INSTANCE Action/Button 104x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/state/danger · r8 · {Style=Destructive, State=Default}
        TEXT label 56x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Revoke"
```

**Naming the person makes the dialog 28px taller** — 208 against `8.5c`'s 180 — because the title wraps to
two lines. The dialog hugs, so this is automatic; it is called out because a longer name wraps further and
the dialog must be allowed to grow rather than clip.

### `8.5cK` — My endorsements · revoke? (dialog, Kavindu)

**Reached from** `8.5`, `8.5d`, `8.5dI`  ·  **Leads to** `8.5` (Keep), `8.5dK` (Revoke)

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    TEXT screenTitle 210x32 [HUG/HUG] · fill color/text/primary · mobile/display · "My endorsements"
    TEXT trackRecord 328x20 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "3 endorsed, 1 went on to build a good rating"
    TEXT privacyNote 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Only you can see this."
    INSTANCE Display/EndorsementRow 328x188 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show revoke=true, State=Default}
      FRAME nameRow 116x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT endorserName 116x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Kavindu Perera"
      TEXT relationship 237x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "My neighbour — known him 8 years"
      FRAME attributes 202x44 [HUG/HUG] · horizontal pad 0 gap 8
        INSTANCE Input/Chip 92x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · stroke color/badge/endorsed 1 · r999 · {Kind=Display, State=Default}
          TEXT label 64x20 [HUG/HUG] · fill color/badge/endorsed · mobile/secondary · "Reliability"
        INSTANCE Input/Chip 102x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · stroke color/badge/endorsed 1 · r999 · {Kind=Display, State=Default}
          TEXT label 74x20 [HUG/HUG] · fill color/badge/endorsed · mobile/secondary · "Punctuality"
      FRAME revokeAction 296x44 [FILL/HUG] · horizontal pad 0 gap 0
        INSTANCE Action/Link 55x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
          TEXT label 55x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Revoke"
    INSTANCE Display/EndorsementRow 328x188 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show revoke=true, State=Default}
      FRAME nameRow 124x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT endorserName 124x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Ishara Fernando"
      TEXT relationship 235x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Worked in my shop for two seasons"
      FRAME attributes 202x44 [HUG/HUG] · horizontal pad 0 gap 8
        INSTANCE Input/Chip 92x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · stroke color/badge/endorsed 1 · r999 · {Kind=Display, State=Default}
          TEXT label 64x20 [HUG/HUG] · fill color/badge/endorsed · mobile/secondary · "Reliability"
        INSTANCE Input/Chip 102x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · stroke color/badge/endorsed 1 · r999 · {Kind=Display, State=Default}
          TEXT label 74x20 [HUG/HUG] · fill color/badge/endorsed · mobile/secondary · "Punctuality"
      FRAME revokeAction 296x44 [FILL/HUG] · horizontal pad 0 gap 0
        INSTANCE Action/Link 55x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
          TEXT label 55x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Revoke"
    INSTANCE Display/EndorsementRow 328x136 [FILL/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show revoke=true, State=Default}
      FRAME nameRow 201x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT endorserName 201x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Chamara Wickramasinghe"
      TEXT relationship 201x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Former colleague — two years"
      FRAME revokeAction 296x44 [FILL/HUG] · horizontal pad 0 gap 0
        INSTANCE Action/Link 55x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
          TEXT label 55x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Revoke"
    INSTANCE Display/EndorsementRow 328x84 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show revoke=false, State=Revoked}
      FRAME nameRow 137x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT endorserName 80x24 [HUG/HUG] · fill color/text/secondary · mobile/body-medium · "W. Dilshan"
        TEXT revokedLabel 49x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Revoked"
      TEXT relationship 118x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Former classmate"
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Verifier} · [standard, see header]
  RECTANGLE scrim 360x800 [FIXED/FIXED] @0,0 · fill color/overlay/scrim · opacity 40%
  INSTANCE Feedback/ConfirmDialog 328x208 [FIXED/HUG] @16,296 · vertical pad 20 gap 12 · fill color/bg/default · r12
    TEXT title 288x56 [FILL/HUG] · fill color/text/primary · mobile/title · "Revoke your endorsement of Kavindu Perera?"
    TEXT body 288x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Revoking stops future display but doesn't undo a hire that already happened."
    FRAME actions 288x48 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Action/Button 87x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 39x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Keep"
      INSTANCE Action/Button 104x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/state/danger · r8 · {Style=Destructive, State=Default}
        TEXT label 56x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Revoke"
```

**Three dialog frames exist because the prototype cannot compute a name** — `8.5c` is the generic form and
`8.5cI` / `8.5cK` are the two named ones the demo walks through. **Build one dialog** whose title
interpolates the person; the three frames are showing the same component with different content.

### `8.5d` — My endorsements · one revoked

**Reached from** `8.5c`  ·  **Leads to** `8.5cI`, `8.5cK`  ·  **Exits** tab bar → `8.2`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    TEXT screenTitle 210x32 [HUG/HUG] · fill color/text/primary · mobile/display · "My endorsements"
    TEXT trackRecord 328x20 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "2 endorsed, 1 went on to build a good rating"
    TEXT privacyNote 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Only you can see this."
    INSTANCE Display/EndorsementRow 328x188 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show revoke=true, State=Default}
      FRAME nameRow 116x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT endorserName 116x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Kavindu Perera"
      TEXT relationship 237x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "My neighbour — known him 8 years"
      FRAME attributes 202x44 [HUG/HUG] · horizontal pad 0 gap 8
        INSTANCE Input/Chip 92x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · stroke color/badge/endorsed 1 · r999 · {Kind=Display, State=Default}
          TEXT label 64x20 [HUG/HUG] · fill color/badge/endorsed · mobile/secondary · "Reliability"
        INSTANCE Input/Chip 102x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · stroke color/badge/endorsed 1 · r999 · {Kind=Display, State=Default}
          TEXT label 74x20 [HUG/HUG] · fill color/badge/endorsed · mobile/secondary · "Punctuality"
      FRAME revokeAction 296x44 [FILL/HUG] · horizontal pad 0 gap 0
        INSTANCE Action/Link 55x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
          TEXT label 55x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Revoke"
    INSTANCE Display/EndorsementRow 328x188 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show revoke=true, State=Default}
      FRAME nameRow 124x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT endorserName 124x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Ishara Fernando"
      TEXT relationship 235x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Worked in my shop for two seasons"
      FRAME attributes 202x44 [HUG/HUG] · horizontal pad 0 gap 8
        INSTANCE Input/Chip 92x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · stroke color/badge/endorsed 1 · r999 · {Kind=Display, State=Default}
          TEXT label 64x20 [HUG/HUG] · fill color/badge/endorsed · mobile/secondary · "Reliability"
        INSTANCE Input/Chip 102x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · stroke color/badge/endorsed 1 · r999 · {Kind=Display, State=Default}
          TEXT label 74x20 [HUG/HUG] · fill color/badge/endorsed · mobile/secondary · "Punctuality"
      FRAME revokeAction 296x44 [FILL/HUG] · horizontal pad 0 gap 0
        INSTANCE Action/Link 55x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
          TEXT label 55x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Revoke"
    INSTANCE Display/EndorsementRow 328x84 [FILL/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show revoke=false, State=Revoked}
      FRAME nameRow 258x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT endorserName 201x24 [HUG/HUG] · fill color/text/secondary · mobile/body-medium · "Chamara Wickramasinghe"
        TEXT revokedLabel 49x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Revoked"
      TEXT relationship 201x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Former colleague — two years"
    INSTANCE Display/EndorsementRow 328x84 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show revoke=false, State=Revoked}
      FRAME nameRow 137x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT endorserName 80x24 [HUG/HUG] · fill color/text/secondary · mobile/body-medium · "W. Dilshan"
        TEXT revokedLabel 49x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Revoked"
      TEXT relationship 118x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Former classmate"
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Verifier} · [standard, see header]
```

**`trackRecord` drops from 3 to 2 but keeps "1 went on to build a good rating".** Revoking Chamara does
not change who succeeded, and the three revoked-variants are consistent about this: `8.5dI` reads
*"2 endorsed, 0 went on"* because Ishara is the one who built the rating, and `8.5dK` reads *"1 went on"*
because Kavindu is not. **The counter is derived; compute it, do not copy it.**

**A revoked row stays in place rather than moving to the bottom.** Chamara sits third here, where they sat
third before, so the list does not reorder under the user's finger after a destructive action.

### `8.5dI` — My endorsements · Ishara revoked

**Reached from** `8.5cI`  ·  **Leads to** `8.5c`, `8.5cK`  ·  **Exits** tab bar → `8.2`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    TEXT screenTitle 210x32 [HUG/HUG] · fill color/text/primary · mobile/display · "My endorsements"
    TEXT trackRecord 328x20 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "2 endorsed, 0 went on to build a good rating"
    TEXT privacyNote 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Only you can see this."
    INSTANCE Display/EndorsementRow 328x188 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show revoke=true, State=Default}
      FRAME nameRow 116x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT endorserName 116x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Kavindu Perera"
      TEXT relationship 237x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "My neighbour — known him 8 years"
      FRAME attributes 202x44 [HUG/HUG] · horizontal pad 0 gap 8
        INSTANCE Input/Chip 92x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · stroke color/badge/endorsed 1 · r999 · {Kind=Display, State=Default}
          TEXT label 64x20 [HUG/HUG] · fill color/badge/endorsed · mobile/secondary · "Reliability"
        INSTANCE Input/Chip 102x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · stroke color/badge/endorsed 1 · r999 · {Kind=Display, State=Default}
          TEXT label 74x20 [HUG/HUG] · fill color/badge/endorsed · mobile/secondary · "Punctuality"
      FRAME revokeAction 296x44 [FILL/HUG] · horizontal pad 0 gap 0
        INSTANCE Action/Link 55x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
          TEXT label 55x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Revoke"
    INSTANCE Display/EndorsementRow 328x84 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show revoke=false, State=Revoked}
      FRAME nameRow 181x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT endorserName 124x24 [HUG/HUG] · fill color/text/secondary · mobile/body-medium · "Ishara Fernando"
        TEXT revokedLabel 49x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Revoked"
      TEXT relationship 235x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Worked in my shop for two seasons"
    INSTANCE Display/EndorsementRow 328x136 [FILL/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show revoke=true, State=Default}
      FRAME nameRow 201x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT endorserName 201x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Chamara Wickramasinghe"
      TEXT relationship 201x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Former colleague — two years"
      FRAME revokeAction 296x44 [FILL/HUG] · horizontal pad 0 gap 0
        INSTANCE Action/Link 55x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
          TEXT label 55x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Revoke"
    INSTANCE Display/EndorsementRow 328x84 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show revoke=false, State=Revoked}
      FRAME nameRow 137x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT endorserName 80x24 [HUG/HUG] · fill color/text/secondary · mobile/body-medium · "W. Dilshan"
        TEXT revokedLabel 49x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Revoked"
      TEXT relationship 118x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Former classmate"
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Verifier} · [standard, see header]
```

### `8.5dK` — My endorsements · Kavindu revoked

**Reached from** `8.5cK`  ·  **Leads to** `8.5c`, `8.5cI`  ·  **Exits** tab bar → `8.2`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    TEXT screenTitle 210x32 [HUG/HUG] · fill color/text/primary · mobile/display · "My endorsements"
    TEXT trackRecord 328x20 [FIXED/HUG] · fill color/text/primary · mobile/secondary · "2 endorsed, 1 went on to build a good rating"
    TEXT privacyNote 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Only you can see this."
    INSTANCE Display/EndorsementRow 328x84 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show revoke=false, State=Revoked}
      FRAME nameRow 173x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT endorserName 116x24 [HUG/HUG] · fill color/text/secondary · mobile/body-medium · "Kavindu Perera"
        TEXT revokedLabel 49x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Revoked"
      TEXT relationship 237x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "My neighbour — known him 8 years"
    INSTANCE Display/EndorsementRow 328x188 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show revoke=true, State=Default}
      FRAME nameRow 124x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT endorserName 124x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Ishara Fernando"
      TEXT relationship 235x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Worked in my shop for two seasons"
      FRAME attributes 202x44 [HUG/HUG] · horizontal pad 0 gap 8
        INSTANCE Input/Chip 92x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · stroke color/badge/endorsed 1 · r999 · {Kind=Display, State=Default}
          TEXT label 64x20 [HUG/HUG] · fill color/badge/endorsed · mobile/secondary · "Reliability"
        INSTANCE Input/Chip 102x44 [HUG/HUG] · horizontal pad 12/14/12/14 gap 0 · stroke color/badge/endorsed 1 · r999 · {Kind=Display, State=Default}
          TEXT label 74x20 [HUG/HUG] · fill color/badge/endorsed · mobile/secondary · "Punctuality"
      FRAME revokeAction 296x44 [FILL/HUG] · horizontal pad 0 gap 0
        INSTANCE Action/Link 55x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
          TEXT label 55x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Revoke"
    INSTANCE Display/EndorsementRow 328x136 [FILL/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show revoke=true, State=Default}
      FRAME nameRow 201x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT endorserName 201x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Chamara Wickramasinghe"
      TEXT relationship 201x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Former colleague — two years"
      FRAME revokeAction 296x44 [FILL/HUG] · horizontal pad 0 gap 0
        INSTANCE Action/Link 55x44 [HUG/HUG] · horizontal pad 10/0/10/0 gap 0
          TEXT label 55x24 [HUG/HUG] · fill color/brand/primary · mobile/body · "Revoke"
    INSTANCE Display/EndorsementRow 328x84 [FIXED/HUG] · vertical pad 16 gap 8 · fill color/bg/default · r8 · {Show revoke=false, State=Revoked}
      FRAME nameRow 137x24 [HUG/HUG] · horizontal pad 0 gap 8
        TEXT endorserName 80x24 [HUG/HUG] · fill color/text/secondary · mobile/body-medium · "W. Dilshan"
        TEXT revokedLabel 49x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "Revoked"
      TEXT relationship 118x20 [HUG/HUG] · fill color/text/secondary · mobile/secondary · "Former classmate"
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Verifier} · [standard, see header]
```

### `8.5z` — My endorsements · first run

**Reached from** [M1](M1-account.md) `1.18vz`, [MNAV](MNAV-shells.md) Endorsements tab  ·
**Leads to** `8.2`  ·  **Exits** tab bar → `8.2`

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME content 360x736 [FILL/FILL] · vertical pad 66/16/16/16 gap 12
    TEXT screenTitle 210x32 [HUG/HUG] · fill color/text/primary · mobile/display · "My endorsements"
    TEXT privacyNote 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Only you can see this."
    INSTANCE Feedback/EmptyState 328x216 [FILL/HUG] · vertical pad 32/24/32/24 gap 8 · fill color/bg/default · r10 · {Cause=NoneExist}
      TEXT title 208x28 [HUG/HUG] · fill color/text/primary · mobile/title · "No endorsements yet"
      TEXT body 280x60 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · align center · "Vouch for someone you know and they will appear here, with how they went on to fare."
      INSTANCE Action/Button 197x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 149x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Vouch for someone"
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=false, Role=Verifier} · [standard, see header]
```

**`Cause=NoneExist`, not `FiltersExclude`** — there is genuinely nothing, so the empty state offers the
action that would create something rather than offering to clear a filter. **`trackRecord` is absent**
here, because a record of nothing is not a record.

**The tab bar carries `Notification badge=false`** on this screen alone — a day-one account has no
notifications, and the badge would be the first thing promising otherwise.

### `8.7` — Endorsement suggestion (dialog)

**Opens over** [M4](M4-applying.md) `4.3n` on Friday 28 Aug, when the third employer declines  ·  **Leads to** `8.1` (See my code), [M4](M4-applying.md) `4.3n` (Not now)

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
    TEXT orderNote 328x16 [FIXED/HUG] · fill color/text/secondary · mobile/caption · "Pending first, soonest closing first."
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Worker} · [standard, see header]
  RECTANGLE scrim 360x800 [FIXED/FIXED] @0,0 · fill color/overlay/scrim · opacity 40%
  FRAME promptCard 328x196 [HUG/HUG] @16,302 · vertical pad 20/20/16/20 gap 12 · fill color/bg/default · r12
    TEXT promptTitle 288x28 [FIXED/HUG] · fill color/text/primary · mobile/title · "No luck yet?"
    TEXT promptBody 288x60 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "An endorsement from someone who knows you moves you up the list. Your code takes a minute to share."
    FRAME actions 288x48 [FILL/HUG] · horizontal pad 0 gap 8
      INSTANCE Action/Button 112x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/bg/default · stroke color/brand/primary 1.5 · r8 · {Style=Secondary, State=Default}
        TEXT label 64x24 [HUG/HUG] · fill color/brand/primary · mobile/body-medium · "Not now"
      INSTANCE Action/Button 147x48 [HUG/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
        TEXT label 99x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "See my code"
```

**This is the only M8 screen with a Worker tab bar**, because it is the *endorsed* person's screen, not the
Verifier's. It is an M4 applications list with a prompt over it, filed here because the prompt is what the
screen is for: **FR-ENDORSE-14** suggests an endorsement to a worker with no history and no endorsement
once three of their applications have ended unselected. The backdrop is Kavindu's list on Friday morning
(M4's `4.3n`): House cleaning, Delivery rider and Office cleaning have just declined him — the third
unselected outcome — while Event setup, Shop assistant and tutoring are still pending and Café is the one he
withdrew. His own withdrawal does not count towards the three, and pending applications never did (the
requirement's acceptance criteria, amended 2026-09-23). Until that pass the backdrop was an all-pending
list, and the suggestion fired over three applications that had not ended at all.

**`promptCard` is a hand-built frame, not `Feedback/ConfirmDialog`** — pad 20/20/16/20 against the
component's 20 all round, and 196 tall against 160. It is a prompt rather than a confirmation: two
different actions, neither destructive, so the component's title-body-actions shape fits but its
proportions do not. **Recorded rather than changed**, because adopting the component would alter a
released screen for consistency alone.

**The frame is vertical auto layout, with the scrim and the card absolutely positioned over it** — the
same structure as every other list in M4, which it was not until 2026-09-23 (its `content` was a fixed 744
and ran 8 px under the tab bar). The card sits at `@16,302`; at 196 tall its centre is the frame's centre.

---

## Two things about the frames themselves

**1. `Show revoke` on a revoked row — fixed at source 2026-09-22.** `8.5dI` and `8.5dK` set it `true` on
the row they had just revoked, while the rows revoked earlier had it `false`. Both render identically,
because the `Revoked` variant carries no revoke action either way — so nothing looked wrong.

**It mattered because this file records variant properties verbatim.** A developer reading `8.5dI` would
have seen `Show revoke=true` on a row showing no Revoke link and reasonably concluded that revoked rows
should offer one. **An instance that contradicts itself is worse than one that is merely wrong**, because
the variant name is what gets read. All twenty revoked rows across the module and the demo now read
`false`, and every row stayed 328×84 — the correction is to the meaning, not the pixels.

**2. Three dialog frames for one dialog — deliberate, not a defect.** `8.5c`, `8.5cI` and `8.5cK` differ
only in the title string, because a prototype cannot interpolate a name and the demo has to walk through
the two named cases. **Build one dialog with the name interpolated**; do not build three.

## States not drawn in this module

| State | Build it as |
| --- | --- |
| A code that does not match | `Input/CodeInputAlpha {State=Error}` on `8.2`, whose helper becomes *"That code didn't work. Check it with the person who shared it."* — the string is in the component |
| A code whose window has closed | the same error state. **Do not say the window closed**: that would confirm the account exists, which `NFR-PRIV-04` forbids on an unauthenticated lookup |
| Vouching for someone who already has your endorsement | not drawn. `FR-ENDORSE-05` allows one endorsement per pair, so the second attempt must be refused — decide whether at `8.3m` or at `8.4` |
| The endorsed person's view of a revocation | not drawn. `HF.3` promises *"the person is told"*, so a notification exists; its row belongs to [M3](M3-discovery.md)'s notification list |
| Offline vouching | not drawn, and it should fail rather than queue: an endorsement is live on submit, so an optimistic local one would show on a profile it had never reached |
