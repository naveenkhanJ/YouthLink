# M0 — First run

Four screens: a splash and three onboarding cards, shown once before the account screens.

**Requirements:** `NFR-PERF-01` (`0.1`) · `FR-POST-08`, `FR-MOD-01`, `FR-ADM-03`, `FR-ADM-05` are the rules
the third card summarises. The onboarding cards themselves implement no requirement — they explain the
product, and the copy is a promise the rest of it has to keep.

**These four are the only absolutely-positioned screens in the product.** Everything else is auto-layout.
Positions are given as `@x,y` from the parent's top-left and are part of the specification here.

**The three cards share one layout**, which is why they read almost identically below:

| Element | Position | Notes |
| --- | --- | --- |
| `skipLink` | `@284,24`, right-aligned | on `0.2` and `0.3` only |
| `art` | `@80,150`, 200×200 | a different illustration per card |
| `cardTitle` | `@24,392` | height varies with the line count: 32 on `0.2`, 64 on `0.3` and `0.4` |
| `cardBody` | `@24,440` on `0.2`, `@24,472` on `0.3` and `0.4` | follows the title's height |
| `dots` | `@160,676` | the three-step pager |
| `Action/Button` | `@16,728`, 328×48 | *Next* on `0.2` and `0.3`, *Create account* on `0.4` |

---

### `0.1` — Splash

**Leads to** `0.2`

**Auto-advances after 2 seconds, and also accepts a tap.** Both reactions live on the frame itself, not on
a child — a walker that starts at `frame.children` will miss them entirely.

```
FRAME 360x800 · absolute · fill color/brand/primary
  INSTANCE mark 76x76 [FIXED/FIXED] @142,290 · of Brand/Mark · {Tone=OnBrand}
    ELLIPSE arc-topLeft 56x56 [FIXED/FIXED] @10,10 · fill white
    ELLIPSE arc-bottomRight 56x56 [FIXED/FIXED] @10,10 · fill white
    ELLIPSE dot 11x11 [FIXED/FIXED] @32,32 · fill white
  TEXT YouthLink 360x40 [FIXED/FIXED] @0,404 · fill white · (no style) · align center · "YouthLink"
  TEXT Verified local work for young people 360x20 [FIXED/FIXED] @0,446 · fill color/text/inverse · opacity 82% · mobile/secondary · align center · "Verified local work for young people"
  [frame reaction] AFTER_TIMEOUT 2s
  [frame reaction] ON_CLICK
```

**`YouthLink` carries no text style on purpose** — it is the wordmark, Archivo Bold, and the only place in
the product that is not Inter. Everywhere else, `(no style)` on a text node is a defect.

### `0.2` — Onboarding, gigs near you

**Reached from** `0.1`  ·  **Leads to** `0.3`  ·  **Exits** "Skip" → `1.1`

```
FRAME 360x800 · absolute · fill color/bg/default
  TEXT skipLink 60x20 [FIXED/FIXED] @284,24 · fill color/text/secondary · mobile/secondary · align right · "Skip"
  FRAME art 200x200 [FIXED/FIXED] @80,150
    ELLIPSE disc 160x160 [FIXED/FIXED] @20,20 · fill bg/brand-tint
    FRAME person 32x32 [FIXED/FIXED] @36,82
      ELLIPSE Ellipse 11x11 [FIXED/FIXED] @11,4 · stroke blue/700 2.67
      VECTOR Vector 21x11 [FIXED/FIXED] @5,17 · stroke blue/700 2.67
    FRAME verified 16x16 [FIXED/FIXED] @50,102 · fill blue/700 · stroke bg/brand-tint 2 · r8
      VECTOR check 8x6 [FIXED/FIXED] @4,5 · stroke white 1.8
    FRAME person 32x32 [FIXED/FIXED] @84,82
      ELLIPSE Ellipse 11x11 [FIXED/FIXED] @11,4 · stroke blue/700 2.67
      VECTOR Vector 21x11 [FIXED/FIXED] @5,17 · stroke blue/700 2.67
    FRAME verified 16x16 [FIXED/FIXED] @98,102 · fill blue/700 · stroke bg/brand-tint 2 · r8
      VECTOR check 8x6 [FIXED/FIXED] @4,5 · stroke white 1.8
    FRAME person 32x32 [FIXED/FIXED] @132,82
      ELLIPSE Ellipse 11x11 [FIXED/FIXED] @11,4 · stroke blue/700 2.67
      VECTOR Vector 21x11 [FIXED/FIXED] @5,17 · stroke blue/700 2.67
    FRAME verified 16x16 [FIXED/FIXED] @146,102 · fill blue/700 · stroke bg/brand-tint 2 · r8
      VECTOR check 8x6 [FIXED/FIXED] @4,5 · stroke white 1.8
  TEXT cardTitle 312x32 [FIXED/FIXED] @24,392 · fill color/text/primary · mobile/display · "Local work, verified people"
  TEXT cardBody 312x120 [FIXED/FIXED] @24,440 · fill color/text/secondary · mobile/body · "Young people looking for work, employers posting gigs nearby, and community members who vouch for someone they know. Every identity is checked before anyone can take part."
  INSTANCE dots 40x8 [HUG/HUG] @160,676 · horizontal pad 0 gap 8 · of Chrome/PagerDots · {Active=1}
    ELLIPSE dot1 8x8 [FIXED/FIXED] · fill color/brand/primary
    ELLIPSE dot2 8x8 [FIXED/FIXED] · fill color/brand/primary · opacity 30%
    ELLIPSE dot3 8x8 [FIXED/FIXED] · fill color/brand/primary · opacity 30%
  INSTANCE Action/Button 328x48 [FIXED/FIXED] @16,728 · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
    TEXT label 36x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Next"
```

**"Every identity is checked" is the strongest promise in the product**, and `FR-ACC-04` is narrower than
it sounds — an NIC is *collected*, not verified against any registry. The onboarding copy and the
requirement are in tension; the requirement is what the system does.

### `0.3` — Onboarding, endorsement

**Reached from** `0.2`  ·  **Leads to** `0.4`  ·  **Exits** "Skip" → `1.1`

```
FRAME 360x800 · absolute · fill color/bg/default
  TEXT skipLink 60x20 [FIXED/FIXED] @284,24 · fill color/text/secondary · mobile/secondary · align right · "Skip"
  FRAME art 200x200 [FIXED/FIXED] @80,150
    ELLIPSE disc 160x160 [FIXED/FIXED] @20,20 · fill bg/brand-tint
    FRAME person 32x32 [FIXED/FIXED] @36,84
      ELLIPSE Ellipse 11x11 [FIXED/FIXED] @11,4 · stroke blue/700 2.67
      VECTOR Vector 21x11 [FIXED/FIXED] @5,17 · stroke blue/700 2.67
    VECTOR diamond 32x32 [FIXED/FIXED] @84,84 · fill blue/700
    FRAME person 32x32 [FIXED/FIXED] @132,84
      ELLIPSE Ellipse 11x11 [FIXED/FIXED] @11,4 · stroke blue/700 2.67
      VECTOR Vector 21x11 [FIXED/FIXED] @5,17 · stroke blue/700 2.67
  TEXT cardTitle 312x64 [FIXED/FIXED] @24,392 · fill color/text/primary · mobile/display · "A good word gets you started"
  TEXT cardBody 312x120 [FIXED/FIXED] @24,472 · fill color/text/secondary · mobile/body · "Nobody has ratings on day one. Someone who already knows a young worker can vouch for them, and employers see that vouch beside their name."
  INSTANCE dots 40x8 [HUG/HUG] @160,676 · horizontal pad 0 gap 8 · of Chrome/PagerDots · {Active=2}
    ELLIPSE dot1 8x8 [FIXED/FIXED] · fill color/brand/primary · opacity 30%
    ELLIPSE dot2 8x8 [FIXED/FIXED] · fill color/brand/primary
    ELLIPSE dot3 8x8 [FIXED/FIXED] · fill color/brand/primary · opacity 30%
  INSTANCE Action/Button 328x48 [FIXED/FIXED] @16,728 · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
    TEXT label 36x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Next"
```

**This card exists because of the cold-start problem**, which is the product's hardest one: a worker with
no ratings is indistinguishable from a bad one. Community endorsement is the answer, and saying so here
is what makes the endorsement flow legible later.

### `0.4` — Onboarding, check-in codes

**No Skip link** — this is the last card, and its button is the entry to registration rather than a
*Next*.

**Reached from** `0.3`  ·  **Leads to** `1.1`  ·  **Exits** "Create account" → `1.1`

```
FRAME 360x800 · absolute · fill color/bg/default
  FRAME art 200x200 [FIXED/FIXED] @80,150
    ELLIPSE disc 160x160 [FIXED/FIXED] @20,20 · fill bg/brand-tint
    FRAME person 32x32 [FIXED/FIXED] @36,84
      ELLIPSE Ellipse 11x11 [FIXED/FIXED] @11,4 · stroke blue/700 2.67
      VECTOR Vector 21x11 [FIXED/FIXED] @5,17 · stroke blue/700 2.67
    RECTANGLE codeBox 8x20 [FIXED/FIXED] @84,90 · fill blue/700 · r2 · opacity 22%
    RECTANGLE codeBox 8x20 [FIXED/FIXED] @96,90 · fill blue/700 · r2
    RECTANGLE codeBox 8x20 [FIXED/FIXED] @108,90 · fill blue/700 · r2 · opacity 22%
    FRAME person 32x32 [FIXED/FIXED] @132,84
      ELLIPSE Ellipse 11x11 [FIXED/FIXED] @11,4 · stroke blue/700 2.67
      VECTOR Vector 21x11 [FIXED/FIXED] @5,17 · stroke blue/700 2.67
  TEXT cardTitle 312x64 [FIXED/FIXED] @24,392 · fill color/text/primary · mobile/display · "Both sides confirm, every step"
  TEXT cardBody 312x96 [FIXED/FIXED] @24,472 · fill color/text/secondary · mobile/body · "Each step of a gig is confirmed by a short code — one person shows it, the other types it in. Neither side can mark something done on their own."
  INSTANCE dots 40x8 [HUG/HUG] @160,676 · horizontal pad 0 gap 8 · of Chrome/PagerDots · {Active=3}
    ELLIPSE dot1 8x8 [FIXED/FIXED] · fill color/brand/primary · opacity 30%
    ELLIPSE dot2 8x8 [FIXED/FIXED] · fill color/brand/primary · opacity 30%
    ELLIPSE dot3 8x8 [FIXED/FIXED] · fill color/brand/primary
  INSTANCE Action/Button 328x48 [FIXED/FIXED] @16,728 · horizontal pad 0/24/0/24 gap 8 · fill color/brand/primary · r8 · {Style=Primary, State=Default}
    TEXT label 118x24 [HUG/HUG] · fill color/text/inverse · mobile/body-medium · "Create account"
```

**"Neither side can mark something done on their own"** is the check-in code mechanism in one sentence,
and it is the claim the whole engagement lifecycle rests on. `FR-MOD-01` records every code exchange;
`FR-ENG-01` is where the counters live.

---

## Two prototype defects, fixed at the source on 2026-09-22

**Both are recorded because the trees above no longer show them, and a fix nobody can see is a fix
nobody can check.** Build from the trees; this section is the history, not an instruction.

**1. The pager dots showed no position.** All three `dots` ellipses were `fill blue/700` at full strength,
on all three cards — so the pager indicated nothing about which step you were on, and was *identical*
across the three screens it was meant to distinguish. The row is now `Chrome/PagerDots`, one component
with `Active` stepping 1 → 2 → 3, the active dot at full strength and the other two at 30% node opacity.
Hand-drawing the same row on three screens is what let all three drift to the same state.

**2. This module used raw hex where the rest of the product uses tokens.** `skipLink` and `cardBody` were
`#6b7280`, `cardTitle` `#111827`, the frame fills `#ffffff` and `#0f3d91` — all literals, while the same
module's `disc`, `verified` and `Action/Button` already bound their tokens. Every one is now bound to the
token that resolves to the identical hex, so nothing changed colour; only its provenance did. **The hex
values matching today is exactly why this was easy to miss** — a literal and a token look the same until
the token moves.

The illustration keeps its primitives — `blue/700`, `white`, `bg/brand-tint` — deliberately. See §1 of
`design-system.md`: decorative art carries no semantic role, and binding it to `color/brand/primary`
would assert the art is brand-coloured *because* it is brand.

## States not drawn in this module

| State | Build it as |
| --- | --- |
| Onboarding already seen | These four are shown once. On any later launch the app opens at `1.1` and none of `0.1`–`0.4` appears |
| Splash while the app is still loading | `0.1` is the loading state — it holds for its 2-second timeout or until tapped, whichever comes first |
