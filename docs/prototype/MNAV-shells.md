# MNAV — Navigation shells

Three frames that are not screens. Each one draws a role's tab bar against an empty host region and names
the five hub screens that live behind it. **They exist so the chrome has a single definition**, because the
tab bar appears on 89 frames and the thing you must not do is redraw it on each.

No flow visits them and they are deliberately excluded from the demo. If you are looking for what a tab
actually opens, follow the ids in `hosts` to the module that owns that screen.

**The tab bar is `Chrome/TabBar`, 360×64, five tabs of 72×58** — four on the Verifier shell, which has no
Postings tab, so its tabs are 90 wide. The active tab is the one whose `pillWrap` carries a
`bg/brand-tint` fill and an `iconFill` child; every inactive tab has an `iconStroke` child and no pill
fill. **That difference is the only thing marking the active tab** — there is no underline, no weight
change, no colour on the label beyond `color/brand/primary` against `color/text/secondary`.

Read `README.md` first for the notation, and `design-system.md` §5 for `Chrome/TabBar`.

---

### `NAV.1` — Worker shell

**Reached from** nothing  ·  **Leads to** nothing — this frame is a definition, not a step

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME hostRegion 360x736 [FILL/FILL] · vertical pad 0/24/0/24 gap 8 · fill color/bg/subtle
    TEXT shellTitle 121x28 [HUG/HUG] · fill color/text/primary · mobile/title · "Worker shell"
    TEXT hosts 280x100 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · align center · "Hosts Browse (3.1), My Applications (4.3), Engagements (5.1), Notifications (3.10), Profile (1.18). Hub screens live on their module pages; this shell defines the chrome."
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Worker}
    FRAME tab-Browse 72x58 [FILL/HUG] · vertical pad 6/0/6/0 gap 2
      FRAME pillWrap 56x30 [FIXED/FIXED] · fill bg/brand-tint · r15
        FRAME iconFill 24x24 [FIXED/FIXED] @16,3
          ELLIPSE Ellipse 14x14 [FIXED/FIXED] @3,3 · stroke color/brand/primary 2.5
          VECTOR Vector 5x5 [FIXED/FIXED] @16,16 · stroke color/brand/primary 2.5
      TEXT label 36x14 [HUG/HUG] · fill color/brand/primary · mobile/tab-label · "Browse"
    FRAME tab-Applications 72x58 [FILL/HUG] · vertical pad 6/0/6/0 gap 2
      FRAME pillWrap 56x30 [FIXED/FIXED] · r15
        FRAME iconStroke 24x24 [FIXED/FIXED] @16,3
          VECTOR Vector 18x17 [FIXED/FIXED] @3,4 · stroke color/text/secondary 2
      TEXT label 58x14 [HUG/HUG] · fill color/text/secondary · mobile/tab-label · "Applications"
    FRAME tab-Engagements 72x58 [FILL/HUG] · vertical pad 6/0/6/0 gap 2
      FRAME pillWrap 56x30 [FIXED/FIXED] · r15
        FRAME iconStroke 24x24 [FIXED/FIXED] @16,3
          ELLIPSE Ellipse 18x18 [FIXED/FIXED] @3,3 · stroke color/text/secondary 2
          VECTOR Vector 3x6 [FIXED/FIXED] @12,8 · stroke color/text/secondary 2
      TEXT label 65x14 [HUG/HUG] · fill color/text/secondary · mobile/tab-label · "Engagements"
    FRAME tab-Notifications 72x58 [FILL/HUG] · vertical pad 6/0/6/0 gap 2
      FRAME pillWrap 56x30 [FIXED/FIXED] · r15
        FRAME iconStroke 24x24 [FIXED/FIXED] @16,3
          VECTOR Vector 16x13 [FIXED/FIXED] @3,3 · stroke color/text/secondary 2
          VECTOR Vector 5x2 [FIXED/FIXED] @10,19 · stroke color/text/secondary 2
        ELLIPSE urgentDot 6x6 [FIXED/FIXED] @38,4 · fill color/state/urgent
      TEXT label 60x14 [HUG/HUG] · fill color/text/secondary · mobile/tab-label · "Notifications"
    FRAME tab-Profile 72x58 [FILL/HUG] · vertical pad 6/0/6/0 gap 2
      FRAME pillWrap 56x30 [FIXED/FIXED] · r15
        FRAME iconStroke 24x24 [FIXED/FIXED] @16,3
          ELLIPSE Ellipse 8x8 [FIXED/FIXED] @8,3 · stroke color/text/secondary 2
          VECTOR Vector 16x8 [FIXED/FIXED] @4,13 · stroke color/text/secondary 2
      TEXT label 31x14 [HUG/HUG] · fill color/text/secondary · mobile/tab-label · "Profile"
```

**`urgentDot` is the notification badge**, 6×6 in `color/state/urgent`, sitting at `@38,4` inside the
icon's pill — not on the label. It is a variant property (`Notification badge`), not a hand-placed dot, so
switch the property rather than adding a circle.

### `NAV.2` — Employer shell

**Reached from** nothing  ·  **Leads to** nothing

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME hostRegion 360x736 [FILL/FILL] · vertical pad 0/24/0/24 gap 8 · fill color/bg/subtle
    TEXT shellTitle 142x28 [HUG/HUG] · fill color/text/primary · mobile/title · "Employer shell"
    TEXT hosts 280x100 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · align center · "Hosts My Postings (2.10), Post a Gig (2.1), Engagements (5.1e), Notifications (3.10e), Profile (1.18e). Hub screens live on their module pages; this shell defines the chrome."
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Employer}
    FRAME tab-Postings 72x58 [FILL/HUG] · vertical pad 6/0/6/0 gap 2
      FRAME pillWrap 56x30 [FIXED/FIXED] · fill bg/brand-tint · r15
        FRAME iconFill 24x24 [FIXED/FIXED] @16,3
          VECTOR Vector 14x16 [FIXED/FIXED] @5,2 · fill color/brand/primary
          VECTOR Vector 7x0 [FIXED/FIXED] @9,8 · stroke color/bg/default 1.6
          VECTOR Vector 7x0 [FIXED/FIXED] @9,12 · stroke color/bg/default 1.6
          VECTOR Vector 5x0 [FIXED/FIXED] @9,16 · stroke color/bg/default 1.6
      TEXT label 41x14 [HUG/HUG] · fill color/brand/primary · mobile/tab-label · "Postings"
    FRAME tab-Post a Gig 72x58 [FILL/HUG] · vertical pad 6/0/6/0 gap 2
      FRAME pillWrap 56x30 [FIXED/FIXED] · r15
        FRAME iconStroke 24x24 [FIXED/FIXED] @16,3
          ELLIPSE Ellipse 18x18 [FIXED/FIXED] @3,3 · stroke color/text/secondary 2
          VECTOR Vector 8x8 [FIXED/FIXED] @8,8 · stroke color/text/secondary 2
      TEXT label 49x14 [HUG/HUG] · fill color/text/secondary · mobile/tab-label · "Post a Gig"
    FRAME tab-Engagements 72x58 [FILL/HUG] · vertical pad 6/0/6/0 gap 2
      FRAME pillWrap 56x30 [FIXED/FIXED] · r15
        FRAME iconStroke 24x24 [FIXED/FIXED] @16,3
          ELLIPSE Ellipse 18x18 [FIXED/FIXED] @3,3 · stroke color/text/secondary 2
          VECTOR Vector 3x6 [FIXED/FIXED] @12,8 · stroke color/text/secondary 2
      TEXT label 65x14 [HUG/HUG] · fill color/text/secondary · mobile/tab-label · "Engagements"
    FRAME tab-Notifications 72x58 [FILL/HUG] · vertical pad 6/0/6/0 gap 2
      FRAME pillWrap 56x30 [FIXED/FIXED] · r15
        FRAME iconStroke 24x24 [FIXED/FIXED] @16,3
          VECTOR Vector 16x13 [FIXED/FIXED] @3,3 · stroke color/text/secondary 2
          VECTOR Vector 5x2 [FIXED/FIXED] @10,19 · stroke color/text/secondary 2
        ELLIPSE urgentDot 6x6 [FIXED/FIXED] @38,4 · fill color/state/urgent
      TEXT label 60x14 [HUG/HUG] · fill color/text/secondary · mobile/tab-label · "Notifications"
    FRAME tab-Profile 72x58 [FILL/HUG] · vertical pad 6/0/6/0 gap 2
      FRAME pillWrap 56x30 [FIXED/FIXED] · r15
        FRAME iconStroke 24x24 [FIXED/FIXED] @16,3
          ELLIPSE Ellipse 8x8 [FIXED/FIXED] @8,3 · stroke color/text/secondary 2
          VECTOR Vector 16x8 [FIXED/FIXED] @4,13 · stroke color/text/secondary 2
      TEXT label 31x14 [HUG/HUG] · fill color/text/secondary · mobile/tab-label · "Profile"
```

**"Post a Gig" is a tab, not a floating button.** Posting is the employer's primary action and it sits in
the bar with the others, which is why the Employer shell has five tabs where the Verifier has four.

### `NAV.3` — Verifier shell

**Reached from** nothing  ·  **Leads to** nothing

```
FRAME 360x800 · vertical pad 0 gap 0 · fill color/bg/subtle
  FRAME hostRegion 360x736 [FILL/FILL] · vertical pad 0/24/0/24 gap 8 · fill color/bg/subtle
    TEXT shellTitle 122x28 [HUG/HUG] · fill color/text/primary · mobile/title · "Verifier shell"
    TEXT hosts 280x80 [FIXED/HUG] · fill color/text/secondary · mobile/secondary · align center · "Hosts My Endorsements (8.5), Vouch (8.2), Notifications (3.10v), Profile (1.18v). Hub screens live on their module pages; this shell defines the chrome."
  INSTANCE Chrome/TabBar 360x64 [FILL/FIXED] · horizontal pad 0 gap 0 · fill color/bg/default · {Notification badge=true, Role=Verifier}
    FRAME tab-Endorsements 90x58 [FILL/HUG] · vertical pad 6/0/6/0 gap 2
      FRAME pillWrap 56x30 [FIXED/FIXED] · fill bg/brand-tint · r15
        FRAME iconFill 24x24 [FIXED/FIXED] @16,3
          VECTOR Vector 18x18 [FIXED/FIXED] @3,3 · fill color/brand/primary
      TEXT label 68x14 [HUG/HUG] · fill color/brand/primary · mobile/tab-label · "Endorsements"
    FRAME tab-Vouch 90x58 [FILL/HUG] · vertical pad 6/0/6/0 gap 2
      FRAME pillWrap 56x30 [FIXED/FIXED] · r15
        FRAME iconStroke 24x24 [FIXED/FIXED] @16,3
          ELLIPSE Ellipse 7x7 [FIXED/FIXED] @6,3 · stroke color/text/secondary 2
          VECTOR Vector 14x7 [FIXED/FIXED] @3,13 · stroke color/text/secondary 2
          VECTOR Vector 5x5 [FIXED/FIXED] @17,5 · stroke color/text/secondary 2
      TEXT label 30x14 [HUG/HUG] · fill color/text/secondary · mobile/tab-label · "Vouch"
    FRAME tab-Notifications 90x58 [FILL/HUG] · vertical pad 6/0/6/0 gap 2
      FRAME pillWrap 56x30 [FIXED/FIXED] · r15
        FRAME iconStroke 24x24 [FIXED/FIXED] @16,3
          VECTOR Vector 16x13 [FIXED/FIXED] @3,3 · stroke color/text/secondary 2
          VECTOR Vector 5x2 [FIXED/FIXED] @10,19 · stroke color/text/secondary 2
        ELLIPSE urgentDot 6x6 [FIXED/FIXED] @38,4 · fill color/state/urgent
      TEXT label 60x14 [HUG/HUG] · fill color/text/secondary · mobile/tab-label · "Notifications"
    FRAME tab-Profile 90x58 [FILL/HUG] · vertical pad 6/0/6/0 gap 2
      FRAME pillWrap 56x30 [FIXED/FIXED] · r15
        FRAME iconStroke 24x24 [FIXED/FIXED] @16,3
          ELLIPSE Ellipse 8x8 [FIXED/FIXED] @8,3 · stroke color/text/secondary 2
          VECTOR Vector 16x8 [FIXED/FIXED] @4,13 · stroke color/text/secondary 2
      TEXT label 31x14 [HUG/HUG] · fill color/text/secondary · mobile/tab-label · "Profile"
```

**Four tabs at 90 wide, not five at 72.** The tabs divide the 360 between them, so the count sets the
width; do not hard-code 72.

---

## What these shells do not define

| Not here | Where it is |
| --- | --- |
| Which tab is active on a given screen | the screen's own file — every tabbed frame carries its own `Chrome/TabBar` instance with its own active tab |
| Where a tab goes | the prototype wiring, not the frame. A tab's destination depends on the flow: the first-run flow routes the tabs to the zero-state screens, because a day-one account has no data to show |
| The Admin and Moderator chrome | `design-system.md` §6 — the dashboard uses `Desktop/DashSidebar` and `Desktop/DashHeader`, and has no tab bar at all |
| An Admin or Moderator shell frame | not drawn. The dashboard chrome is identical on all 70 dashboard screens and is described once in §6, so a shell frame would add nothing |
