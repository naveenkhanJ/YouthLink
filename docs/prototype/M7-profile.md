# M7 — Profile

Two screens, and they are the whole of the bio. Everything else a profile shows — the name, the trust
block, the rating history, the endorsements — is drawn in [M1](M1-account.md) `1.18` and its variants,
because the profile screen belongs to the account module. **This module is only the editor.**

The bio matters more than its size suggests. `FR-PROF-04` makes it pre-fill the note on every application,
so what a worker writes once here is what employers read every time they apply. A worker with no ratings
has the bio and an endorsement and nothing else, which is why `FR-ENDORSE-13` prompts zero-history workers
to write one.

Read `README.md` first for the notation, and `design-system.md` for the tokens and components.

---

### `7.1` — Edit bio

**Reached from** [M1](M1-account.md) `1.18`, `1.18bio`, `1.18z`  ·  **Leads to** `7.1d`  ·
**Exits** back → history

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Edit bio"
  FRAME content 360x744 [FILL/FILL] · vertical pad 20/16/24/16 gap 10
    TEXT label 63x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Your bio"
    INSTANCE bioField 328x218 [FILL/HUG] · vertical pad 12 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8 · of Input/TextArea · {State=Filled}
      TEXT value 302x192 [FILL/HUG] · fill color/text/primary · mobile/body · "Second-year IT student in Colombo, free on weekends and most evenings. I've helped run my family's shop for years, so I'm comfortable handling sales, stock and customers. Reliable with time, quick to learn new tasks, and happy to take on setup, delivery or tutoring work."
    TEXT counter 54x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "271 / 300"
    TEXT helper 328x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Shown on your profile. It also pre-fills the note on your applications, which you can edit each time."
    FRAME spacer-grow 8x304 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 38x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Save"
```

**300 characters is the schema's cap** on the bio, not a copy suggestion. The counter reads `271 / 300`
against copy that is genuinely 271 characters long — enforce the limit in the field and on the server.

**`helper` states the consequence, and that is deliberate.** A bio that quietly pre-fills every application
note is a surprise the first time a worker notices it in an employer's inbox. The sentence is there so the
behaviour is understood before it happens rather than discovered afterwards.

### `7.1d` — Edit bio · saved

**Reached from** `7.1`  ·  **Leads to** nothing — "Done" returns to the profile  ·  **Exits** back → history

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/default
  INSTANCE Chrome/ScreenHeader 360x56 [FILL/FIXED] · horizontal pad 0/4/0/4 gap 4 · fill color/bg/default · stroke color/border/default mixed · {Action=None}
    FRAME backHit 44x44 [FIXED/FIXED]
      VECTOR back 8x16 [FIXED/FIXED] @18,14 · stroke color/text/primary 2
    TEXT title 304x28 [FILL/HUG] · fill color/text/primary · mobile/title · "Edit bio"
  FRAME content 360x744 [FILL/FILL] · vertical pad 20/16/24/16 gap 10
    TEXT label 63x24 [HUG/HUG] · fill color/text/primary · mobile/body-medium · "Your bio"
    INSTANCE bioField 328x218 [FILL/HUG] · vertical pad 12 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8 · of Input/TextArea · {State=Filled}
      TEXT value 302x192 [FILL/HUG] · fill color/text/primary · mobile/body · "Second-year IT student in Colombo, free on weekends and most evenings. I've helped run my family's shop for years, so I'm comfortable handling sales, stock and customers. Reliable with time, quick to learn new tasks, and happy to take on setup, delivery or tutoring work."
    TEXT counter 54x16 [HUG/HUG] · fill color/text/secondary · mobile/caption · "271 / 300"
    TEXT helper 328x40 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · "Shown on your profile. It also pre-fills the note on your applications, which you can edit each time."
    TEXT savedNote 328x40 [FIXED/HUG] · fill color/state/success · mobile/secondary · "Saved — your bio now shows on your profile and pre-fills your application notes."
    FRAME spacer-grow 8x254 [FIXED/FILL]
    INSTANCE Action/Button 328x48 [FILL/FIXED] · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
      TEXT label 41x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Done"
```

**The confirmation is a line on the same screen, not a new one.** `savedNote` appears in
`color/state/success` between the helper and the button, the field stays editable, and the button becomes
`Done`. The alternative — bouncing to the profile on save — would take the worker away from the thing they
were editing to prove it worked.

**The saved screen is 40px taller in content than `7.1`**, because `savedNote` is inserted rather than
swapped in. `spacer-grow` absorbs the difference, which is why the button stays on the bottom edge in both.

---

## States not drawn in this module

| State | Build it as |
| --- | --- |
| Empty bio, first visit | `Input/TextArea {State=Default}`, whose placeholder is `color/text/secondary`, with the counter reading `0 / 300` |
| Over the 300-character limit | `Input/TextArea {State=Error}` — border `color/border/error` — with `Feedback/FieldError` beneath it and the Save button `Action/Button {State=Disabled}` and genuinely inert |
| Saving in flight | `Action/Button {State=Loading}`, by the sixth composition rule in `design-system.md` §8 |
| Save failed | the same screen with `Feedback/FormBanner {Kind=Error}` at the top of `content`, by the second rule |

**There is no separate "view your own bio" screen.** The bio is read on the profile, in
[M1](M1-account.md) `1.18`; this module is reached from the edit action there and returns to it.
