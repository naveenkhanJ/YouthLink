# YouthLink — Design System

Every token, text style, effect and component in the hi-fi prototype, extracted from the Figma file on
2026-09-22. **This is the source for UI work.** Build against these values, not against a screenshot.

**Read this before any screen file.** The screen files in this folder name components and styles rather
than describing them — `Action/Button {Style=Primary}`, `mobile/body` — and this document is what those
names mean. Between the two, a screen can be built to the pixel without opening Figma.

> **`mobile/src/screens/account/theme.js` disagrees with this document and is wrong.** It was derived
> from three screenshots before the design file existed, says so in its own comment, and its
> `colors.primary` is **`#5B4FE0`** against the real **`#0f3d91`**. Ten files import it. Replacing it is
> tracked separately; until then, treat this document as correct and that file as an interim.

---

## 1. Colour

Two layers. **Use the semantic name, never the primitive** — the primitive is what the semantic resolves
to today, and the indirection is what lets a colour change in one place.

### Semantic tokens — the ones to use

| Token | Resolves to | Hex | Use for |
| --- | --- | --- | --- |
| `color/bg/default` | `white` | `#ffffff` | screen and card backgrounds |
| `color/bg/subtle` | `gray/100` | `#f3f4f6` | inset areas, disabled fills, skeletons |
| `bg/brand-tint` | `blue-tint` | `#e7ebf4` | table header rows, selected states, brand-tinted panels |
| `color/text/primary` | `gray/900` | `#111827` | body and headings |
| `color/text/secondary` | `gray/500` | `#6b7280` | captions, meta lines, placeholder text |
| `color/text/inverse` | `white` | `#ffffff` | text on a brand or dark fill |
| `color/brand/primary` | `blue/700` | `#0f3d91` | primary buttons, links, active states, the brand mark |
| `color/border/default` | `gray/200` | `#e5e7eb` | input borders, dividers, card outlines |
| `color/border/error` | `red/600` | `#dc2626` | input border in an error state |
| `color/state/danger` | `red/600` | `#dc2626` | destructive actions, error text |
| `color/state/urgent` | `orange/700` | `#c2410c` | the urgency badge and urgent-gig accents |
| `color/state/success` | `green/700` | `#15803d` | confirmed checkpoints, success states |
| `color/badge/verified` | `teal/700` | `#0f766e` | the Verified badge |
| `color/badge/endorsed` | `purple/700` | `#7e22ce` | the Endorsed badge |
| `color/badge/rating` | `amber/700` | `#b45309` | stars and rating figures |
| `color/overlay/scrim` | `gray/900` | `#111827` | modal backdrop — **at reduced opacity**, see §4 |

### Primitives — the palette behind them

`blue/700` `#0f3d91` · `teal/700` `#0f766e` · `purple/700` `#7e22ce` · `amber/700` `#b45309` ·
`orange/700` `#c2410c` · `red/600` `#dc2626` · `green/700` `#15803d` · `gray/900` `#111827` ·
`gray/500` `#6b7280` · `gray/200` `#e5e7eb` · `gray/100` `#f3f4f6` · `white` `#ffffff` ·
`blue-tint` `#e7ebf4`

**One brand colour, deliberately.** Everything else is a neutral or a state. If a design needs a colour
that is not here, that is a design decision, not an implementation one.

**The one exception: decorative illustration may bind primitives directly.** The onboarding artwork on
`0.2`–`0.4` uses `blue/700`, `white` and `bg/brand-tint` on its discs, figures and code bars. There is no
semantic role for illustration ink — it is not text, not a border, not a state — and inventing
`color/illustration/*` would grow the semantic layer for three screens. Binding it to
`color/brand/primary` instead would assert the art is brand-coloured *because* it is brand, so a future
brand change would repaint the illustrations too. Everything that does carry a role uses its semantic
name; **this exception covers illustration only, and does not extend to any control, surface or text.**

## 2. Spacing and radius

| Token | Value | | Token | Value |
| --- | --- | --- | --- | --- |
| `spacing/xs` | 4 | | `radius/input` | 8 |
| `spacing/sm` | 8 | | `radius/sheet` | 12 |
| `spacing/md` | 12 | | `radius/pill` | 999 |
| `spacing/lg` | 16 | | | |
| `spacing/xl` | 24 | | | |
| `spacing/2xl` | 32 | | | |
| `spacing/gutter` | 16 | | | |

`spacing/gutter` is 16 and equals `spacing/lg` — it is named separately because it means *screen edge
padding*, and if the gutter ever changes it should not drag every 16px gap with it.

## 3. Type

**Inter throughout.** The single exception is the wordmark, which is Archivo Bold and lives inside
`Brand/Wordmark` — never set Archivo anywhere else.

| Style | Font | Size | Line height | Notes |
| --- | --- | --- | --- | --- |
| `mobile/display` | Inter Semi Bold | 24 | 32 | screen titles on tall screens |
| `mobile/title` | Inter Semi Bold | 20 | 28 | the standard mobile screen header |
| `mobile/body` | Inter Regular | 16 | 24 | body copy, input text |
| `mobile/body-medium` | Inter Medium | 16 | 24 | button labels, emphasised body |
| `mobile/secondary` | Inter Regular | 14 | 20 | supporting lines |
| `mobile/caption` | Inter Regular | 12 | 16 | captions, helper text, caps notes |
| `mobile/tab-label` | Inter Regular | 10 | 14 | tab bar only |
| `mobile/display-number` | Inter Semi Bold | 20 | 26 | large figures |
| `mobile/section-label` | Inter Semi Bold | 11 | 16 | section labels · letter-spacing **0.8px** |
| `mobile/secondary-medium` | Inter Medium | 14 | 20 | the bold lead-in before an em-dash in an explanation step |
| `mobile/code` | Inter Semi Bold | 20 | 26 | an entered code · letter-spacing **6px** |
| `desktop/title` | Inter Semi Bold | 18 | 26 | dashboard page title |
| `desktop/body` | Inter Regular | 14 | 20 | dashboard body |
| `desktop/body-medium` | Inter Medium | 14 | 20 | dashboard links and emphasised dashboard body |
| `desktop/table` | Inter Regular | 13 | 18 | dashboard tables and dense rows |
| `desktop/caption` | Inter Regular | 12 | 16 | dashboard captions and queue ordinals |
| `desktop/display-number` | Inter Semi Bold | 24 | 32 | the large figure on a stat card |

**The `mobile/` and `desktop/` prefixes are a hard boundary.** `desktop/table` at 13px on a phone screen
is a defect, not a choice — the prototype is checked for it. Four pairs are metrically identical across
that boundary — `mobile/secondary` / `desktop/body`, `mobile/secondary-medium` / `desktop/body-medium`,
`mobile/caption` / `desktop/caption`, `mobile/display` / `desktop/display-number`. **They are separate
styles on purpose**: the boundary is about which surface a style belongs to, so either side can move
without dragging the other with it. Picking one by how it looks today defeats the point.

**Every line height here is explicit, and that is the whole contract.** Inter's own default at 16px is
about 19px; this scale says 24. Until 2026-09-22 the component library used the default, so body copy
rendered 5px tighter than the table claimed and nothing noticed, because no component referenced a style
at all. Setting a size and weight without a line height is not using the scale.

## 4. Effects

| Style | Effect |
| --- | --- |
| `elevation/card` | drop shadow · blur 12 · offset (0, 3) · spread 0 · `#111827` at 12% |
| `elevation/sheet` | drop shadow · blur 24 · offset (0, 8) · spread 0 · `#111827` at 16% |
| `elevation/bar` | drop shadow · blur 8 · offset (0, **−2**) · spread 0 · `#0f1729` at 10% |

`elevation/bar` casts **upward** — it is for the tab bar and bottom-anchored bars, which throw their
shadow onto the content above them.

**The scrim.** Every dialog, bottom sheet and OS prompt sits over a `scrim`: a 360×800 (or 1440×900)
rectangle, full-bleed, absolutely positioned at `@0,0`, filled with `color/overlay/scrim` at **40% node
opacity**. It is node opacity, not paint opacity, because a paint opacity on a variable-bound fill does not
carry into instances. Two rules go with it:
- **Nothing drawn behind a scrim is interactive.** The screen under a dialog is a picture of where you
  were, not a live screen.
- **The scrim's own tap and the overlay's controls are the only exits.** A sheet's scrim dismisses it
  (`Display/BottomSheet`, `OS/ShareSheet`); a dialog's does not (`Feedback/ConfirmDialog`,
  `Desktop/DashDialog`, the `promptCard` prompts, `OS/PermissionDialog`), because dismissing by accident is
  the thing a dialog's Cancel exists to make deliberate — and an OS prompt must be answered.

---

## 5. Components

Fifty-six component sets — fifty product components in the six groups below, plus four OS mocks. Each row
gives the frame size of the first variant, its auto-layout, and its children. **Padding is listed `top/right/bottom/left`**; a single number means all four are equal.
Sizing modes appear in screen files as `[horizontal/vertical]` — `FILL`, `HUG` or `FIXED`.

### Inputs

| Component | Variants | Size · layout | Children |
| --- | --- | --- | --- |
| `Input/TextField` | `State`: Default · Focused · Filled · Error · Disabled<br>`Type`: Text · Secure | 328×69 · vertical, gap 4 | label text · `input` frame 328×48, horizontal, pad 0/12/0/12, gap 8, centred |
| `Input/PhoneField` | `State`: Default · Error · Disabled | 328×69 · vertical, gap 4 | label text · `input` frame 328×48, horizontal, centred |
| `Input/CodeInputNumeric` | `State`: Empty · Filled · Error | 304×52 · vertical, gap 8 | `digits` frame 304×52, horizontal, gap 8 |
| `Input/CodeInputAlpha` | `State`: Empty · Filled · Error | 296×96 · vertical, gap 4 | label · `input` 296×56, pad 0/16/0/16 · helper text |
| `Input/Checkbox` | `State`: Unchecked · Checked · Error | 316×44 · vertical, gap 6 | `row` 316×44, horizontal, pad 2/0/2/0, gap 12 |
| `Input/RoleOption` | `State`: Default · Selected | 328×78 · horizontal, pad 16, gap 12, centred · r8 | `radio` 20×20 · `copy` frame, vertical, gap 2 |
| `Input/SegmentedControl` | `Selected`: Individual · Business | 328×44 · horizontal, pad 2, gap 2 · r8 | two `segment` frames, pad 8/16/8/16 |
| `Input/Select` | `State`: Closed · Selected · Open | 328×74 · vertical, gap 6 | label · `field` 328×48, pad 12 |
| `Input/Chip` | `Kind`: Select · Display<br>`State`: Default · Selected | 92×32 · horizontal, pad 6/14/6/14 · r999 | label text |
| `Input/Toggle` | `State`: Off · On | 328×64 · horizontal, pad 8/0/8/0, gap 16, centred | label · `track` 44×24 |
| `Input/StarInput` | `State`: Empty · Selected | 172×28 · vertical, gap 8 | `stars` frame, horizontal, gap 8 |
| `Input/DateTimeField` | `State`: Default · Filled · Error | 328×74 · vertical, gap 6 | label · `field` 328×48, pad 12 |
| `Input/TextArea` | `State`: Default · Filled · Error | 328×96 · vertical, pad 12 · r8 · hug height, **minimum 96** | one text, `mobile/body`, width FILL |

**Every input is 328 wide on a 360 screen** — that is `spacing/gutter` of 16 on each side. **Every field
row is 48 tall.** Those two numbers hold across the whole mobile surface.

`Input/TextArea` is the one input that is not 48 tall, because it holds a paragraph rather than a line.
It hugs its content but never drops below 96 — an empty box still has to read as somewhere you can type.
Screens 6.4 and 6.5 hand-built this shape twice, at two different heights, before it was a component.

### Actions

| Component | Variants | Size · layout | Children |
| --- | --- | --- | --- |
| `Action/Button` | `Style`: Primary · Secondary · Destructive · Text<br>`State`: Default · Loading · Disabled | 166×48 · horizontal, pad 0/24, gap 8, centred both axes · r8 | `label` text, `mobile/body-medium` |
| `Action/Link` | — | 87×44 · horizontal, pad 10/0/10/0 | `label` text |
| `Action/ListRowAction` | — | 168×48 · horizontal, gap 12 | `select` 74×48 · `decline` 82×48, both pad 0/16 |

**`Style=Text` is not a button that looks lighter — it is a link.** A destructive dialog's safe escape
must be `Secondary`, not `Text`: giving the safe option the weakest affordance is the defect this
distinction exists to prevent.

### Display

| Component | Variants | Size · layout | Children |
| --- | --- | --- | --- |
| `Display/Badge` | `Family`: Verified · Endorsed · Urgent · Posting · Application · Engagement · Case<br>`Value`: 19 values — Default, Count, Open, Filled, Withdrawn, Expired, Pending, Selected, Declined, NotSelected, Active, Completed, Cancelled, Ended, Disputed, AwaitingResponse, UnderReview, Escalated, Resolved | 77×24 · horizontal, pad 4/10, gap 5, centred · r999 | `check` vector 8×6 · `label` |
| `Display/StarsDisplay` | — | 152×24 · horizontal, gap 6, centred | `star` 16×16 · `avg` · `count` |
| `Display/CountdownText` | `Format`: Cooldown · Deadline | 99×20 | `countdown` text |
| `Display/ListingCard` | `State`: Default · Urgent | 328×134 · vertical, pad 16, gap 6 · r8 | `title` · `meta` · `pay` · `fill` — all four **FILL width and wrap** (296 at 100%) |
| `Display/ApplicantRow` | `Tier`: History · EndorsedNew · New<br>`Show endorsed`: boolean | 328×188 · vertical, pad 16, gap 8 · r8 | `nameRow` · `trustRow` · `note` · `Action/ListRowAction` |
| `Display/EngagementRow` | `Action`: Required · None | 328×116 · vertical, pad 16, gap 8 · r8 | `topRow` · `posting` · `nextAction` |
| `Display/NotificationRow` | `Type`: Standard · Digest | 328×108 · horizontal, pad 12, gap 10 · r8 | `unreadDot` 8×8 · `content` frame, **FILL**, vertical, gap 2 — `title` and `body` wrap at 286; `time` hugs |
| `Display/EndorsementRow` | `State`: Default · Revoked<br>`Show revoke`: boolean | 328×124 · vertical, pad 16, gap 8 · r8 | `nameRow` · `relationship` · `attributes` · `revokeAction` |
| `Display/ProfileTrustBlock` | `Tier`: ZeroHistory · History | 328×84 · vertical, pad 16, gap 8 · r8 | `headline` · `endorsedBy` |
| `Display/CodePanel` | `View`: Holder · Enterer · PaymentGate | 328×132 · vertical, pad 16, gap 12 · r8 | `codeBox` 132×48 · `instruction` |
| `Display/MapArea` | `Kind`: Area · PrecisePin | 328×160 · absolute · r8 | 7 grid lines · `areaShape` ellipse 180×110 · `areaLabel` |
| `Display/BottomSheet` | — | 360×274 · vertical, pad 10/16/20/16, gap 4 | `handle` 36×4 · `sheetTitle` · four 328×48 option rows |
| `Display/PhotoPicker` | `State`: Empty · Filled | 150×96 · vertical, gap 8 | `tiles` 72×72, horizontal, gap 8 · `capsNote` |
| `Brand/Mark` | `Tone`: OnBrand · OnLight | 48×48 · absolute | two 36×36 arc ellipses · `dot` 7×7 |
| `Brand/Wordmark` | `Tone`: OnBrand · OnLight<br>`Size`: Display · Compact · Hero | 196×48 · absolute | `mark` 40×40 · `wordmark` text, **Archivo Bold** |

`Display/MapArea` is the **only** absolutely-positioned component, because a map is a picture rather than
a stack. Everything else is auto-layout.

**Text that must survive 130% expansion wraps; it does not hug.** Three components used to size their
text to its content (`WIDTH_AND_HEIGHT`), which is invisible at 100% and breaks at 130%: a ListingCard line
ran past the card's edge, and two tab labels collided. `3.1x130` is the specimen that shows the fixed
behaviour — card text wraps inside the card, the Browse chip row (`controls`, FILL, wrap, 8 row gap)
drops `Saved` to a second line, and tab labels truncate rather than overlap. A notification row's title
and body wrap for the same reason: A11's titles include a posting title, so their length is not bounded.

**The urgent digest (`Type=Digest`) is specified but not drawn on any screen.** Its sample text is the A11
form — title *"{n} more urgent gigs today"*, body *the top title plus a count* — and it expands in place to
its batched children. Nothing in the prototype's story reaches five urgent pushes in a day, so no history
shows one; build it from this row and FR-NOTIF-01.

### Feedback

| Component | Variants | Size · layout | Children |
| --- | --- | --- | --- |
| `Feedback/FieldError` | — | 296×20 | `error` text |
| `Feedback/FormBanner` | `Kind`: Error · Info | 328×40 · horizontal, pad 10/12 · r8 | `message` text |
| `Feedback/EmptyState` | `Cause`: NoneExist · FiltersExclude | 328×196 · vertical, pad 32/24, gap 8, centred · r10 | `title` · `body` · `Action/Button` |
| `Feedback/LoadingState` | — | 328×114 · vertical, pad 16, gap 10 · r8 | four skeleton rectangles: 200×16, 296×12, 296×12, 140×12 |
| `Feedback/ConfirmDialog` | — | 328×160 · vertical, pad 20, gap 12 · r12 | `title` · `body` · `actions` frame, horizontal, gap 8, right-aligned |
| `Feedback/OfflineBar` | — | 328×36 · horizontal, pad 8/12 · r8 | `message` text |

### Chrome

| Component | Variants | Size · layout | Children |
| --- | --- | --- | --- |
| `Chrome/ScreenHeader` | `Action`: None · Slot | 360×56 · horizontal, pad 0/4, gap 4, centred | `backHit` 44×44 · `title`, `mobile/title` |
| `Chrome/TabBar` | `Role`: Worker · Employer · Verifier<br>`Notification badge`: boolean | 360×64 · horizontal | five 72×58 tabs, vertical, pad 6/0, gap 2, centred — each `label` FILLs its tab, **one line, truncates with an ellipsis** |
| `Chrome/PagerDots` | `Active`: 1 · 2 · 3 | 40×8 · horizontal, gap 8 | three 8×8 `dot` ellipses |

**`Chrome/PagerDots` carries the active dot at full strength and the other two at 30% node opacity**, both
bound to `color/brand/primary`. The inactive weight is opacity rather than a second token because a pager
has one colour and two strengths, not two colours. Until 2026-09-22 the three onboarding screens drew the
row by hand with all three dots identical and *the same on all three screens*, so the pager showed no
position at all — which is the only thing a pager is for.

`backHit` is 44×44 whether or not an arrow is drawn in it — that is the minimum touch target, and it stays
that size so the header's layout does not shift between screens that have a back arrow and screens that
do not.

### Desktop

| Component | Variants | Size · layout | Children |
| --- | --- | --- | --- |
| `Desktop/DashSidebar` | `Role`: Admin · Moderator<br>`Active`: Case queue · All postings · Users · Metrics · Audit log · Staff (the last two Admin only) | 240×640 · vertical, pad 20/12, gap 4 | `Brand/Wordmark` · `surface` · `roleChip` · spacer · 216×36 nav rows, pad 8/10 — six for Admin, four for Moderator (`nav-Audit log` and `nav-Staff` hidden: those surfaces are not offered to a Moderator) |
| `Desktop/DashHeader` | `Role`: Admin · Moderator | 1200×56 · horizontal, pad 0/24, gap 16, centred | `pageTitle` · `userSearch` 256×32 · `identity` · `signOut` |
| `Desktop/DataTable` | — | 1152×220 · vertical | `filterRow` 1152×60 · `headerRow` 1152×34 on `bg/brand-tint` · data rows 1152×42, pad 10/16, gap 16 |
| `Desktop/TableRow` | `Kind`: Header · Row<br>`Cols`: 5 · 4 | 1152×40 · horizontal, pad 0/16, gap 16, centred | up to five column texts, `desktop/table` |
| `Desktop/DetailPane` | `Role`: Admin · Moderator | 420×304 · vertical, pad 20, gap 10 · r8 | `nameRow` · six `field-*` rows 380×20 · `actions` (Admin) — the Moderator variant has no `field-NIC` and no `actions`, and ends in `routedNote` |
| `Desktop/DashDialog` | — | 440×198 · vertical, pad 20/24, gap 12 · r12 | `title` · `body` · `actions`, right-aligned |
| `Desktop/SectionCard` | — | 1152×152 · vertical, pad 14/16, gap 8 · r8 | `cardTitle` · `row1`–`row4` |
| `Desktop/OptionRow` | `State`: Default · Selected | 1120×40 · horizontal, pad 10/14, gap 10, centred · r8 | radio ellipse 16×16 · `optLabel` |
| `Desktop/OptionGroup` | — | 1152×198 · vertical, pad 14/16, gap 10 · r10 | `groupTitle` · three `Desktop/OptionRow` |
| `Desktop/StatCard` | — | 272×116 · vertical, pad 14/16, gap 4 · r8 | `statValue` · `statLabel` · `statSub` |
| `Desktop/DashBadge` | `Family`: Case · Posting<br>`Value`: AwaitingResponse · UnderReview · Escalated · Resolved · Open · Filled · Withdrawn · Expired | 139×22 · horizontal, pad 2/8, gap 5, centred · r999 | `dot` ellipse 5×5 · `label` |
| `Desktop/Pagination` | `Page`: First · Middle · Last · Single | 1152×44 · horizontal, pad 12/16, space-between · `color/bg/default`, border `color/border/default` | `countText` `desktop/body` · `pager` frame, gap 16, with `prevLink` / `position` / `nextLink`; the live link is `color/brand/primary`, the dead one `color/text/secondary`. A **table footer**: radius 0, no effect, top border only — the rounded, raised look comes from the table container it sits in, so it is not used under a list of cards |

**`Desktop/SectionCard` and `Desktop/TableRow` carry more slots than most uses need**, and the unused ones
are switched off rather than emptied. A hidden `row3` still reads `"Row 3 text"` in the file — that is the
component default sitting behind a disabled slot, not content anyone forgot to replace. **Check
visibility before treating a default string as a defect**; 159 of 184 apparent cases were exactly this.

### OS mocks

| Component | Variants | Size · layout | Children |
| --- | --- | --- | --- |
| `OS/PermissionDialog` | `Context`: Location · Notifications · Camera | 280×288 · vertical, pad 20/20/16/20, gap 12 · r12 | `icon-*` 24×24 · `question` 240×48 · three 240×44 `option` rows |
| `OS/PushNotification` | `Channel`: Regular · Urgent | 328×104 · horizontal · r12 | `content` 328×104 |
| `OS/Keyboard` | — | 360×260 · absolute | 26 `key` 30×42 plus the modifier row |
| `OS/ShareSheet` | — | 360×306 · vertical, pad 8/16/24/16, gap 16 | `handle` 36×4 · `preview` 328×56 · `apps` 328×78 · `cancel` 328×48 |

Used on `3.3` and `3.9` (permission), `3.13` (push), `1.4k` (keyboard) and `8.1s` (share).

**These four imitate the operating system, not this product, and are deliberately exempt from §1 and §3.**
A platform keyboard is not drawn in the product's type scale and a system sheet's grab handle is not a
brand colour, so their text carries no text style and `OS/ShareSheet`'s handle stays on a literal
`#c7ccd4`. The keyboard's 26 letter keys are 26 of the 40 unstyled texts left in the file, and that handle
is the *only* unbound colour left anywhere — both on purpose.
**Do not build product UI out of them** — they exist to show what the OS puts on top of a screen.

---

## 6. Surfaces

| Surface | Frame | Chrome |
| --- | --- | --- |
| Mobile | **360 × 800** | `Chrome/ScreenHeader` 56 tall at the top; `Chrome/TabBar` 64 tall at the bottom on the four tabbed screens only |
| Dashboard | **1440 × 900** | `Desktop/DashSidebar` 240 wide on the left, full height; `Desktop/DashHeader` 1200 × 56 across the remaining width; content below it, pad 20/24/24/24, gap 14 |

**Dashboard screens have no footer, deliberately** — an internal authenticated tool uses sidebar and
header chrome only. The login pages are the exception and carry a split brand panel.

The sidebar and header are identical on every dashboard screen, so the screen files in this folder **do
not repeat them.** A dashboard screen file starts at the content area; assume the chrome above and to the
left, with `Active` set to that screen's nav item.

## 7. Icons

**Twenty-five glyphs, drawn as 24px geometric vectors. No image assets anywhere in the product.**

`back` · `close` · `search` · `filter` · `sort` · `location-pin` · `bell` (and `bell` with dot) ·
`eye` / `eye-off` · `share` · `star` (filled and outline) · `check` · `warning` · `info` · `camera` ·
`calendar` · `clock` · `phone` · `chevron` (up, down, left, right) · `plus` · `person` · `briefcase` ·
`shield-check` (verified) · `hand-heart` (endorsed) · `flag` (report) · `logout`

The SVG for each is in `icons/` beside this file. **Anything outside this list is a scope question, not a
drawing decision** — raise it rather than inventing a glyph.

---

## 8. State coverage — what is drawn, and what you still have to build

**The screens in this folder are not the complete state set, and assuming they are is the mistake this
section exists to prevent.** The prototype draws decision-carrying states and lets the component library
plus composition rules carry the rest. That was a deliberate ruling, and coverage sits in three layers.

**Layer 1 — drawn.** 464 frames. Every screen's typical state, every flow-completion confirmation, and
one showcase per mechanism a reader could not guess at.

**Layer 2 — the component variants above.** `Input/TextField` has five `State` values; a screen normally
draws one. **The other four are still part of the product and still have to be built.** An error state of
a form is that form with one variant swapped — the information is in §5, not in a frame. The same holds
for badge statuses, banners, dialogs, and the empty and loading surfaces.

**Layer 3 — composed, not drawn.** Most remaining states are the same few compositions applied to a
different screen, so they are stated here as rules rather than enumerated:

| State | Compose it as |
| --- | --- |
| A field is invalid | the same screen with that `Input/*` at `State=Error`, and `Feedback/FieldError` directly beneath it |
| The whole submission fails | as above, plus `Feedback/FormBanner {Kind=Error}` at the top of the content area |
| A list has nothing to show | `Feedback/EmptyState` replacing the list — `Cause=NoneExist` when there is genuinely nothing, `Cause=FiltersExclude` when filters are hiding it. The two differ: one offers to widen the search, the other to clear filters |
| Content is being fetched | `Feedback/LoadingState` in place of the content, for any operation that can exceed the perceptible threshold (`NFR-PERF-01`) |
| The device is offline | `Feedback/OfflineBar` above content that remains viewable from cache (`NFR-USE-01`) |
| An action is in flight or unavailable | `Action/Button {State=Loading}` or `{State=Disabled}` — a disabled control must also be genuinely inert, not merely styled as such |

**The exceptions — states that are specified, deliberately not drawn, and not covered by a rule above.**
Each was ruled with a reason; none is an oversight.

| Not drawn | Why, and what to build |
| --- | --- |
| The field-invalid state of the login screen | The pattern is drawn on the registration screen's three error frames and carried by `Feedback/FieldError`. Build it by the first rule above |
| Offline variants of the three non-Browse tabs | `NFR-USE-01` requires only that **already-loaded listings** stay viewable. The other tabs need live data, so an offline variant would be promising something the requirement does not |
| A second page on any table | Pagination controls are drawn and the counts are real, but no table's page 2 is drawn — a further page would show the same component with different rows. Build pagination normally |
| Interactive column re-sorting | The sorted column is marked in every header and the order is stated. Re-sorting is behaviour to implement; every alternative order was not drawn |
| The **rejected** outcome of an account recovery | The approved outcome is drawn; rejection follows the same screen with the outcome text changed. `AccountRecoveryStatus.REJECTED` exists in the schema |
| Any Sinhala or Tamil interface | `NFR-LOC-01`'s acceptance criterion is that none is present. Building one would breach the requirement |

**Four frames and one text node are deliberately off-system.** They are listed here because every one of
them looks like a defect to a checker, and each has been ruled once already.

| Off-system | Why, and what not to "fix" |
| --- | --- |
| `1.4x130`, `3.1x130` | 130% text-expansion specimens. Every text is scaled ×1.3 and carries **no** text style, because a style would force its own size and destroy the demonstration. On 2026-09-22 a library-wide style binding did exactly that to `1.4x130` and had to be reverted — **any bulk edit must skip a frame whose id ends `x130`** |
| `1.4k` | Keyboard-open specimen. Normal scale, so it takes library changes like any other screen; it is a specimen only in that no flow visits it |
| `3.2` | Not a specimen. It shows *radius* auto-expansion (FR-DISC-01) — the search widened for a user in Homagama — and is a real step in F0. It used to match `/expansion/` by name, which is why it was listed here; renamed 2026-09-23 to say what it shows, it is kept here so the ruling is not repeated |
| `0.1`'s `YouthLink` text | The splash sets Archivo Bold 30 directly rather than using `Brand/Wordmark`. The component is a **horizontal** lockup, 196×48 with a 40×40 mark; the splash is a **vertical** one, a 76×76 mark above the name. They are different compositions, and §3's "never set Archivo anywhere else" yields here rather than restructuring a released splash |

**If a state you need is in none of the three layers, it is a gap — raise it.** The layers are meant to be
exhaustive, and a state that falls through them is a finding rather than something to improvise.
