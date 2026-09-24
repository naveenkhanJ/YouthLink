# YouthLink — Prototype specification

**The hi-fi prototype, written down.** Every screen, its content, its components, its layout and where it
leads — enough to build the interface exactly, without opening Figma.

**Start with [`design-system.md`](design-system.md).** The screen files name components and styles rather
than describing them, and that file is what the names mean. The two together are the specification.

> **This replaces guessing.** `mobile/src/screens/account/theme.js` was derived from screenshots before
> this existed and has the brand colour wrong. Build against `design-system.md`.

---

## The modules

| Module | Screens | Frames on its page | File |
| --- | --- | --- | --- |
| **M0** First run | 4 | 4 | [`M0-first-run.md`](M0-first-run.md) |
| **M1** Account | 94 | **95** | [`M1-account.md`](M1-account.md) |
| **M2** Posting | 48 | 48 | [`M2-posting.md`](M2-posting.md) |
| **M3** Discovery | 43 | 43 | [`M3-discovery.md`](M3-discovery.md) |
| **M4** Applying and selection | 66 | 66 | [`M4-applying.md`](M4-applying.md) |
| **M5** Engagement lifecycle | 57 | 57 | [`M5-engagement.md`](M5-engagement.md) |
| **M6** Ratings | 14 | 14 | [`M6-ratings.md`](M6-ratings.md) |
| **M7** Profile | 2 | 2 | [`M7-profile.md`](M7-profile.md) |
| **M8** Endorsement | 20 | **19** | [`M8-endorsement.md`](M8-endorsement.md) |
| **M9** Disputes | 14 | 14 | [`M9-disputes.md`](M9-disputes.md) |
| **M10** Moderation | 40 | **39** | [`M10-moderation.md`](M10-moderation.md) |
| **M11** Staff dashboard | 67 | **68** | [`M11-dashboard.md`](M11-dashboard.md) |
| **MHF** Help and FAQ | 5 | 5 | [`MHF-help.md`](MHF-help.md) |
| **MNAV** Navigation shells | 3 | 3 | [`MNAV-shells.md`](MNAV-shells.md) |
| **Total** | **477** | **477** | |

**The two columns differ for four modules because a Figma prototype link must target a frame on the same
page**, so four screens are drawn on a neighbour's page to keep their click-through same-page. A screen is
counted under the module its **number** belongs to, and documented in the file for the **page** it sits on.

| Screen | Numbered | Drawn on | Documented in | Why it sits there |
| --- | --- | --- | --- | --- |
| `8.6` | M8 | M1 Account | [`M1-account.md`](M1-account.md) | opens over the M1 account screen it belongs to |
| `10.7` | M10 | M11 Dashboard | [`M11-dashboard.md`](M11-dashboard.md) | the removal dialog over `11.2ad` |
| `10.6n` | M10 | M11 Dashboard | [`M11-dashboard.md`](M11-dashboard.md) | the suspend dialog reached from `11.3` |
| `11.3g` | M11 | M10 Moderation | [`M10-moderation.md`](M10-moderation.md) | the base `10.6` is drawn over |

## How to read a screen

Each screen is a tree, indented by nesting, in the order elements appear. One line per node:

```
INSTANCE groundsField 328x98 [FILL/HUG] · vertical pad 12 gap 0 · fill color/bg/default · stroke color/border/default 1 · r8 · of Input/TextArea · {State=Filled}
  TEXT value 302x72 [FILL/HUG] · fill color/text/primary · mobile/body · "This engagement never took place …"
```

| Part | Meaning |
| --- | --- |
| `INSTANCE` / `FRAME` / `TEXT` | node kind. `INSTANCE` is a component from `design-system.md` |
| `groundsField` | the layer name — **for an instance this is the role it plays on this screen, not the component** |
| `of Input/TextArea` | the component the instance is of, shown whenever the layer was renamed. Without it you cannot tell that `pagination`, `helpLink` and `userRow03` are instances at all |
| `328x48` | rendered size in the prototype |
| `[FILL/FIXED]` | sizing mode, horizontal/vertical — `FILL` stretches to the parent, `HUG` shrinks to content, `FIXED` is absolute |
| `@16,728` | position from the parent's top-left. **Appears only where the parent does not lay the child out** — either the parent is not auto-layout, or the child is set to *absolute position* inside an auto-layout parent, which is how every scrim, dialog and bottom sheet floats over a screen. If it is absent, the parent positions the child and you must not place it yourself |
| `horizontal pad … gap …` | auto-layout: direction, padding `top/right/bottom/left` (a single number means all four), and the gap between children |
| `fill color/brand/primary` | the fill. **A token name means bind the token.** Since 2026-09-22 no tree in this folder contains a raw hex — every one was traced to the token that resolves to it — so **a literal appearing here is a defect to raise, not a value to copy** |
| `stroke blue/700 2` | stroke colour and weight |
| `r8` | corner radius |
| `{Style=Primary}` | the component's variant properties for this instance |
| `opacity 30%` | node opacity, shown only below 100%. It is how the inactive pager dots and the dimmed code bars are drawn, and it is invisible in a screenshot at a glance |
| `mobile/body-medium` | the text style, from `design-system.md` §3 |
| `align center` | text alignment, shown only when it is not the default left |
| `"Send to admin"` | the exact copy. **Strings are specification, not placeholder** |
| `· run mobile/secondary-medium "Arrival"` | one styled run inside a text node, listed under it whenever a single string carries more than one. A bold lead-in before an em-dash is a run, and printing only the whole string loses it |
| `[frame reaction]` | a prototype interaction on the frame itself rather than on a child — an auto-advance, usually |

**Sizes are what the prototype renders, not what to hard-code.** Rebuild the layout from the auto-layout
properties and the components; the pixel figures are there so you can check your result against it.

**Mobile is 360×800, the dashboard 1440×900.** Dashboard screens omit the sidebar and header, which are
identical everywhere — see `design-system.md` §6.

## What is not here

**The drawn screens are not the complete state set.** `design-system.md` §8 sets out the three layers —
drawn frames, component variants, and composed states — and names the states that are deliberately not
drawn with what to build instead. **Read it before assuming a state is missing by accident.**

Also absent by design: anything about behaviour beyond navigation, which lives in
[`requirements.md`](../requirements.md); and the reasoning behind a screen's design, which lives in
[`product-overview.md`](../product-overview.md).

---

## Requirement index

Which screens demonstrate each requirement. **Use this to find your starting point** — open the
requirement in `requirements.md` for the rule, then the screens here for the interface.

| Requirement | Priority | Title | Screens |
| --- | --- | --- | --- |
| `FR-ACC-01` | Must | Account registration | [M1](M1-account.md) `1.1`, `1.2`, `1.4`, `1.4err2`, `1.4err3` |
| `FR-ACC-02` | Must | Employer posting-as type | [M1](M1-account.md) `1.5`, `1.5b`, `1.10e` |
| `FR-ACC-03` | Must | Age gate | [M1](M1-account.md) `1.4`, `1.4err2` |
| `FR-ACC-04` | Must | NIC field handling | [M1](M1-account.md) `1.13`, `1.4`, `1.4err1` |
| `FR-ACC-05` | Must | Duplicate account prevention | [M1](M1-account.md) `1.12`, `1.4err1`, `1.8rec2` |
| `FR-ACC-07` | Must | Login | [M1](M1-account.md) `1.6`, `1.6bnr3`, `1.6sus`, `1.7`, `1.7sus` · [M11](M11-dashboard.md) `11.1` |
| `FR-ACC-08` | Must | OTP mechanism | [M1](M1-account.md) `1.2`, `1.3`, `1.3err1`, `1.3err2`, `1.6sus`, `1.7`, `1.7sus` |
| `FR-ACC-09` | Must | Password security | [M1](M1-account.md) `1.6bnr1`, `1.6bnr3` · [M11](M11-dashboard.md) `11.1w`, `11.1L`, `11.1p` |
| `FR-ACC-10` | Must | Password reset | [M1](M1-account.md) `1.11`, `1.8`, `1.8bnr`, `1.8rec2`, `1.8rec3`, `1.9` · [M11](M11-dashboard.md) `11.4rec`, `11.8rec1`, `11.8rec2`, `11.8rec3`, `11.6rec` |
| `FR-ACC-11` | Must | Password change | [M1](M1-account.md) `1.11` |
| `FR-ACC-12` | Must | Phone number change | [M1](M1-account.md) `1.12`, `1.12err` |
| `FR-ACC-13` | Must | NIC correction | [M1](M1-account.md) `1.13`, `1.4` |
| `FR-ACC-14` | Must | Email add/change | [M1](M1-account.md) `1.14`, `1.9` |
| `FR-ACC-15` | Should | Display name editing | [M1](M1-account.md) `1.15`, `1.18`, `1.19` · [M6](M6-ratings.md) `6.3` |
| `FR-ACC-16` | Should | Posting-as type change | [M1](M1-account.md) `1.16`, `1.5` · [M2](M2-posting.md) `2.9` |
| `FR-ACC-17` | Must | Account deletion | [M1](M1-account.md) `1.17`, `1.17b`, `1.17be`, `1.17d`, `1.17p` |
| `FR-ACC-18` | Must | Unified Settings screen | [M1](M1-account.md) `1.10`, `1.10e`, `1.10v` |
| `FR-ACC-19` | Must | Terms of Service and Privacy Policy acceptance | [M1](M1-account.md) `1.20` |
| `FR-ADM-01` | Must | Final dispute ruling | [M10](M10-moderation.md) `10.1`, `10.1a`, `10.1c`, `10.1e`, `10.1r`, `10.2`, `10.2b`, `10.3`, `10.3c`, `10.4`, `10.4e`, `10.5`, `10.5e`, `10.5p`, `10.5pe`, `10.5pr`, `10.5r`, `10.6`, `10.6b`, `10.7`, `10.7b` · [M6](M6-ratings.md) `6.1f` · [M9](M9-disputes.md) `9.2`, `9.2f` |
| `FR-ADM-02` | Must | Payment-dispute ruling scope | [M10](M10-moderation.md) `10.5`, `10.5p`, `10.5pe`, `10.5pr` · [M9](M9-disputes.md) `9.2` |
| `FR-ADM-03` | Must | Account suspension | [M0](M0-first-run.md) `0.4` · [M1](M1-account.md) `1.18`, `1.6bnr3`, `1.6sus`, `1.7sus` · [M10](M10-moderation.md) `10.1`, `10.2`, `10.3`, `10.4`, `10.5`, `10.6`, `10.7`, `10.8` · [M11](M11-dashboard.md) `11.4a`, `11.3`, `10.6n` · [M9](M9-disputes.md) `9.1`, `9.3`, `9.4` |
| `FR-ADM-05` | Must | Posting removal | [M0](M0-first-run.md) `0.4` · [M1](M1-account.md) `1.18` · [M10](M10-moderation.md) `10.1`, `10.1a`, `10.1c`, `10.1r`, `10.2`, `10.3`, `10.4`, `10.5`, `10.5r`, `10.6`, `10.6b`, `10.7`, `10.7b`, `10.8` · [M11](M11-dashboard.md) `11.2ad`, `10.7`, `11.2adx` · [M9](M9-disputes.md) `9.1`, `9.3`, `9.4` |
| `FR-ADM-06` | Must | Admin/Moderator account bootstrapping | [M10](M10-moderation.md) `10.8` · [M11](M11-dashboard.md) `11.7`, `11.1f`, `11.1fb`, `11.1p`, `11.4t` |
| `FR-ADM-07` | Must | Separate Admin/Moderator accounts | [M10](M10-moderation.md) `10.8` · [M11](M11-dashboard.md) `11.1`, `11.3L`, `11.3Lm`, `11.7`, `11.7r`, `11.7rs`, `11.7rd`, `11.7rds`, `11.7d`, `11.7ds` |
| `FR-ADM-08` | Must | Dispute ruling's effect on the rating step | [M10](M10-moderation.md) `10.5` · [M5](M5-engagement.md) `5.1c`, `5.2b`, `5.2c`, `5.2d` · [M6](M6-ratings.md) `6.1` · [M9](M9-disputes.md) `9.2` |
| `FR-APPLY-01` | Must | Listing detail view | [M3](M3-discovery.md) `3.1`, `3.10`, `3.11`, `3.12`, `3.13`, `3.2`, `3.3`, `3.4`, `3.5`, `3.6`, `3.7`, `3.8`, `3.9` |
| `FR-APPLY-02` | Must | Apply action | [M4](M4-applying.md) `4.1`, `4.1c`, `4.1d`, `4.1h`, `4.1o`, `4.1s`, `4.1t`, `4.2`, `4.2c`, `4.2d`, `4.2h`, `4.2o`, `4.2s`, `4.2t` |
| `FR-APPLY-03` | Should | Application withdrawal | [M4](M4-applying.md) `4.4`, `4.4c`, `4.4d`, `4.4h`, `4.4o`, `4.4s`, `4.4t`, `4.3cw`, `4.3dw`, `4.3hw`, `4.3ow`, `4.3sw`, `4.3tw`, `4.3w` |
| `FR-APPLY-04` | Must | Applicant pool sort order | [M4](M4-applying.md) `4.5`, `4.5d`, `4.5dk`, `4.5dt`, `4.5s`, `4.5sk`, `4.5st`, `4.5x` |
| `FR-APPLY-05` | Must | Employer applicant view | [M4](M4-applying.md) `4.5`, `4.6`, `4.6k`, `4.6t` |
| `FR-APPLY-06` | Must | Selection and Engagement creation | [M4](M4-applying.md) `4.7`, `4.7k`, `4.7t`, `4.5s`, `4.5sk`, `4.5st` |
| `FR-APPLY-07` | Must | Contact reveal on selection | [M4](M4-applying.md) `4.8`, `4.8k`, `4.8t` |
| `FR-APPLY-08` | Should | Explicit decline | [M4](M4-applying.md) `4.9`, `4.9k`, `4.9t`, `4.9p`, `4.9pk`, `4.9pt`, `4.5d`, `4.5dk`, `4.5dt`, `4.3n` |
| `FR-APPLY-09` | Must | Automatic not-selected notification | [M2](M2-posting.md) `2.11pw`, `2.11dw`, `2.11ex`, `2.11hx` · [M3](M3-discovery.md) `3.10` · [M4](M4-applying.md) `4.3r`, `4.5x` |
| `FR-APPLY-10` | Should | Pending-applicant notification on material change | [M2](M2-posting.md) `2.11pe`, `2.11e2` · [M3](M3-discovery.md) `3.10x`, `3.10pd` · [M4](M4-applying.md) `4.3e` |
| `FR-APPLY-12` | Must | Worker's own application list | [M4](M4-applying.md) `4.3`, `4.3c`, `4.3cw`, `4.3d`, `4.3dw`, `4.3e`, `4.3h`, `4.3hw`, `4.3ldg`, `4.3n`, `4.3o`, `4.3ow`, `4.3r`, `4.3s`, `4.3sw`, `4.3t`, `4.3tw`, `4.3w`, `4.3z` |
| `FR-DASH-01` | Must | Full postings visibility | [M11](M11-dashboard.md) `11.2`, `11.2f`, `11.2ff`, `11.2fw`, `11.2fe`, `11.2d`, `11.2d2`, `11.2d3`, `11.2d4`, `11.2a`, `11.2af`, `11.2aff`, `11.2afw`, `11.2afe`, `11.2ad`, `11.2ad2`, `11.2ad3`, `11.2ad4`, `11.2adx`, `11.2afx`, `11.2affx`, `11.2afwx`, `11.2afex` · [M3](M3-discovery.md) `3.12`, `3.13` |
| `FR-DASH-02` | Must | Full user-account visibility | [M10](M10-moderation.md) `10.1`, `10.8` · [M11](M11-dashboard.md) `11.3L`, `11.3Ls`, `11.3`, `11.3Lm`, `11.3Lms`, `11.3m`, `11.7` |
| `FR-DASH-03` | Must | Case queue | [M11](M11-dashboard.md) `11.4`, `11.4t`, `11.4x`, `11.4rr`, `11.4w`, `11.4e`, `11.4c`, `11.4r`, `11.4pe`, `11.4pw`, `11.4pce`, `11.4a`, `11.4ar`, `11.4rec` |
| `FR-DASH-04` | Should | Metrics dashboard | [M11](M11-dashboard.md) `11.5`, `11.5x`, `11.5m`, `11.5xm` |
| `FR-DASH-05` | Must | Mobile/dashboard case-surface split | [M11](M11-dashboard.md) `11.4`, `11.2d` |
| `FR-DASH-06` | Must | Dashboard authentication | [M11](M11-dashboard.md) `11.1`, `11.1b`, `11.1w`, `11.1L`, `11.1f`, `11.1fb`, `11.1p` |
| `FR-DISC-01` | Must | Radius-based browsing | [M3](M3-discovery.md) `3.1`, `3.12`, `3.2` |
| `FR-DISC-02` | Must | Manual location fallback | [M3](M3-discovery.md) `3.3`, `3.4`, `3.9` |
| `FR-DISC-03` | Should | Category and arrangement-type filters | [M3](M3-discovery.md) `3.5` |
| `FR-DISC-04` | Could | Keyword search | [M3](M3-discovery.md) `3.7` |
| `FR-DISC-05` | Must | Sort order | [M3](M3-discovery.md) `3.1`, `3.10`, `3.11`, `3.12`, `3.13`, `3.2`, `3.3`, `3.4`, `3.5`, `3.6`, `3.7`, `3.8`, `3.9` |
| `FR-DISC-06` | Could | Saved/favorited gigs | [M3](M3-discovery.md) `3.8` |
| `FR-DISC-07` | Could | Filter and sort persistence | [M3](M3-discovery.md) `3.5`, `3.5c` |
| `FR-DISPUTE-01` | Must | Report action | [M9](M9-disputes.md) `9.1`, `9.2` |
| `FR-DISPUTE-02` | Must | Report threshold and auto-hide | [M1](M1-account.md) `1.19` · [M2](M2-posting.md) `2.10g`, `2.11g` · [M3](M3-discovery.md) `3.12` · [M9](M9-disputes.md) `9.1`, `9.1d`, `9.2c`, `9.2e`, `9.2f`, `9.2r`, `9.2u`, `9.3`, `9.4d` · [MHF](MHF-help.md) `HF.4` |
| `FR-DISPUTE-03` | Must | Dispute entry points | [M5](M5-engagement.md) `5.14`, `5.5`, `5.5a`, `5.6` · [M9](M9-disputes.md) `9.1`, `9.2k` |
| `FR-DISPUTE-04` | Must | Response window and evidence | [M5](M5-engagement.md) `5.1es`, `5.2s`, `5.3s` · [M9](M9-disputes.md) `9.3` |
| `FR-DISPUTE-05` | Should | Evidence upload | [M10](M10-moderation.md) `10.2` · [M3](M3-discovery.md) `3.12` · [M9](M9-disputes.md) `9.1`, `9.2`, `9.3`, `9.4` · [MHF](MHF-help.md) `HF.4` |
| `FR-DISPUTE-06` | Must | Discovered false birthdate | [M10](M10-moderation.md) `10.1`, `10.1a`, `10.2`, `10.4`, `10.5`, `10.6`, `10.7` · [M9](M9-disputes.md) `9.1` |
| `FR-DISPUTE-07` | Must | Case status visibility | [M3](M3-discovery.md) `3.12` · [M5](M5-engagement.md) `5.2s`, `5.3s` · [M6](M6-ratings.md) `6.3s` · [M9](M9-disputes.md) `9.1`, `9.1d`, `9.2`, `9.2c`, `9.2e`, `9.2f`, `9.2r`, `9.2u`, `9.3`, `9.3e`, `9.4`, `9.4d`, `9.2k` · [MHF](MHF-help.md) `HF.4` |
| `FR-ENDORSE-01` | Must | Verifier role selection | [M1](M1-account.md) `1.1v` |
| `FR-ENDORSE-02` | Must | Worker-initiated endorsement entry point | [M8](M8-endorsement.md) `8.1`, `8.2`, `8.4` |
| `FR-ENDORSE-03` | Must | Verifier-initiated endorsement entry point | [M1](M1-account.md) `1.12b` · [M10](M10-moderation.md) `10.3c`, `10.5`, `10.5e` · [M6](M6-ratings.md) `6.1f` · [M8](M8-endorsement.md) `8.1b`, `8.3`, `8.3d`, `8.4` · [M9](M9-disputes.md) `9.2f` |
| `FR-ENDORSE-04` | Must | Vouch action | [M8](M8-endorsement.md) `8.4` |
| `FR-ENDORSE-05` | Must | Eligibility window | [M1](M1-account.md) `1.12b` · [M10](M10-moderation.md) `10.3c`, `10.5`, `10.5e` · [M6](M6-ratings.md) `6.1f` · [M8](M8-endorsement.md) `8.1`, `8.1b`, `8.2`, `8.3d` · [M9](M9-disputes.md) `9.2f` |
| `FR-ENDORSE-06` | Must | Endorsement coverage across applications | [M4](M4-applying.md) `4.5`, `4.6t` |
| `FR-ENDORSE-07` | Should | Endorsement revocation | [M10](M10-moderation.md) `10.3s`, `10.3sb` · [M1](M1-account.md) `1.18`, `1.19` · [M3](M3-discovery.md) `3.5c` · [M6](M6-ratings.md) `6.1e`, `6.2e` · [M8](M8-endorsement.md) `8.1`, `8.1b`, `8.1s`, `8.2`, `8.3`, `8.3d`, `8.3m`, `8.4`, `8.4e`, `8.5`, `8.5c`, `8.5cI`, `8.5cK`, `8.5d`, `8.5dI`, `8.5dK`, `8.7` |
| `FR-ENDORSE-08` | Should | Uncapped endorsements per worker | [M4](M4-applying.md) `4.5`, `4.6` |
| `FR-ENDORSE-09` | Should | Endorsement notification to worker | [M3](M3-discovery.md) `3.10` · [M8](M8-endorsement.md) `8.4` |
| `FR-ENDORSE-10` | Must | Endorsement display | [M1](M1-account.md) `1.18`, `1.19` · [M4](M4-applying.md) `4.5`, `4.6`, `4.6t` · [M11](M11-dashboard.md) `11.3`, `11.3m`, `11.8rec1` · [M8](M8-endorsement.md) `8.5` |
| `FR-ENDORSE-11` | Must | Verifier track record | [M10](M10-moderation.md) `10.3s`, `10.3sb` · [M3](M3-discovery.md) `3.5c` · [M6](M6-ratings.md) `6.1e`, `6.2e` · [M8](M8-endorsement.md) `8.5`, `8.5cI`, `8.5cK`, `8.5d`, `8.5dI`, `8.5dK` |
| `FR-ENDORSE-12` | Should | Endorsement payoff notification | [M3](M3-discovery.md) `3.10v` |
| `FR-ENDORSE-13` | Could | Bio prompt for zero-history workers | [M1](M1-account.md) `1.11`, `1.16`, `1.18`, `1.4` · [M6](M6-ratings.md) `6.2` · [M7](M7-profile.md) `7.1`, `7.1d` · [M8](M8-endorsement.md) `8.6` |
| `FR-ENDORSE-14` | Could | Endorsement-seeking suggestion | [M4](M4-applying.md) `4.3n` · [M8](M8-endorsement.md) `8.7` |
| `FR-ENDORSE-15` | Should | Verifier code-entry prompt | [M8](M8-endorsement.md) `8.2`, `8.3`, `8.4` |
| `FR-ENG-01` | Must | Check-in code checkpoints | [M5](M5-engagement.md) `5.2`, `5.2h`, `5.2p`, `5.3`, `5.3b`, `5.4`, `5.4b`, `5.4c`, `5.5`, `5.5a` |
| `FR-ENG-02` | Must | Unpaid internship checkpoint exception | [MHF](MHF-help.md) `HF.2` (copy only) · *no unpaid-internship engagement is drawn — see [M5](M5-engagement.md), States not drawn* |
| `FR-ENG-03` | Must | Unable-to-confirm fallback | [M5](M5-engagement.md) `5.5`, `5.5a`, `5.6` |
| `FR-ENG-04` | Must | Per-Engagement checkpoint scoping | [M5](M5-engagement.md) `5.12`, `5.4`, `5.4c`, `5.5`, `5.5a` |
| `FR-ENG-05` | Must | Cancellation (regular gig) | [M5](M5-engagement.md) `5.1tx`, `5.2tc`, `5.2tx`, `5.7t`, `5.8t`, `5.9`, `5.9b`, `5.9r` |
| `FR-ENG-06` | Must | Cancellation (urgent gig) | [M5](M5-engagement.md) `5.10`, `5.2nc`, `5.3x`, `5.7e` |
| `FR-ENG-07` | Must | Completion-rate tracking | [M1](M1-account.md) `1.18`, `1.19` · [M4](M4-applying.md) `4.5`, `4.6` · [M5](M5-engagement.md) `5.10`, `5.11d`, `5.2nc`, `5.3x` |
| `FR-ENG-08` | Must | Per-Engagement cancellation scope | [M2](M2-posting.md) `2.11` · [M5](M5-engagement.md) `5.3x` |
| `FR-ENG-09` | Must | Material change re-confirmation | [M2](M2-posting.md) `2.11`, `2.11e`, `2.11e2`, `2.11c` · [M3](M3-discovery.md) `3.1`, `3.10` · [M5](M5-engagement.md) `5.11`, `5.11d`, `5.12`, `5.1w` · [M8](M8-endorsement.md) `8.2`, `8.5` |
| `FR-ENG-10` | Should | Urgency recomputation on time change | [M2](M2-posting.md) `2.11e2` |
| `FR-ENG-11` | Must | Multi-slot material change re-confirmation | [M2](M2-posting.md) `2.11e2`, `2.11c` · [M5](M5-engagement.md) `5.12` |
| `FR-ENG-12` | Must | Part-time End Engagement | *not drawn — End Engagement is part-time only, and the story's one part-time engagement never starts; see [M5](M5-engagement.md), States not drawn* |
| `FR-ENG-13` | Must | Stalled engagement handling | [M5](M5-engagement.md) `5.14` |
| `FR-ENG-14` | Must | Engagements list | [M5](M5-engagement.md) `5.1`, `5.1a`, `5.1c`, `5.1cr`, `5.1cv`, `5.1e`, `5.1ec`, `5.1ecr`, `5.1es`, `5.1eu`, `5.1ex`, `5.1ez`, `5.1n`, `5.1nw`, `5.1r`, `5.1tx`, `5.1v`, `5.1w`, `5.1z` |
| `NFR-LOC-03` | Must | Dashboard remains English-only permanently | [M11](M11-dashboard.md) `11.3` |
| `FR-MOD-01` | Must | Dispute case triage | [M0](M0-first-run.md) `0.4` · [M1](M1-account.md) `1.18` · [M10](M10-moderation.md) `10.1`, `10.2`, `10.3`, `10.4`, `10.5`, `10.6`, `10.7`, `10.8` · [M9](M9-disputes.md) `9.1`, `9.3`, `9.4` |
| `FR-MOD-02` | Must | Warning threshold and auto-escalation | [M10](M10-moderation.md) `10.2b`, `10.3`, `10.3c`, `10.5`, `10.5e`, `10.8b` · [M1](M1-account.md) `1.1`, `1.12b`, `1.17`, `1.18`, `1.6`, `1.8`, `1.9` · [M3](M3-discovery.md) `3.1`, `3.4`, `3.5`, `3.7` · [M6](M6-ratings.md) `6.1f`, `6.5b` · [M7](M7-profile.md) `7.1d` · [M8](M8-endorsement.md) `8.1b`, `8.3d`, `8.4e`, `8.5` · [M9](M9-disputes.md) `9.1d`, `9.2f`, `9.3e`, `9.4` |
| `FR-MOD-03` | Should | Mid-review clarification request | [M10](M10-moderation.md) `10.1pca`, `10.1pce`, `10.2` · [M9](M9-disputes.md) `9.2`, `9.4` |
| `FR-MOD-04` | Must | Flagged content review | [M10](M10-moderation.md) `10.4`, `10.4e`, `10.4r`, `10.4rb` |
| `FR-NOTIF-01` | Must | Urgent gig push notifications | [M2](M2-posting.md) `2.9e` · [M3](M3-discovery.md) `3.1`, `3.10`, `3.11`, `3.12`, `3.13`, `3.2`, `3.3`, `3.4`, `3.5`, `3.6`, `3.7`, `3.8`, `3.9` |
| `FR-NOTIF-02` | Must | Non-urgent gig notifications | [M2](M2-posting.md) `2.9et` · [M3](M3-discovery.md) `3.10` |
| `FR-NOTIF-03` | Must | Notification preferences | [M3](M3-discovery.md) `3.11`, `3.11e`, `3.11v` · [M1](M1-account.md) `1.10` |
| `FR-NOTIF-04` | Must | Application-related notifications | [M3](M3-discovery.md) `3.10`, `3.10ea` · [M4](M4-applying.md) `4.3e`, `4.5`, `4.7`, `4.9` |
| `FR-NOTIF-05` | Must | Engagement-related notifications | [M3](M3-discovery.md) `3.10`, `3.10q`, `3.10r` · [M5](M5-engagement.md) `5.11`, `5.14`, `5.9` |
| `FR-NOTIF-06` | Must | Dispute/case notifications | [M3](M3-discovery.md) `3.10`, `3.13` · [M9](M9-disputes.md) `9.2` |
| `FR-NOTIF-07` | Should | Endorsement notifications | [M3](M3-discovery.md) `3.10v` |
| `FR-NOTIF-08` | Could | In-app notification history | [M3](M3-discovery.md) `3.10`, `3.10q`, `3.10r`, `3.10x` |
| `FR-NOTIF-09` | Must | Notification permission handling | [M3](M3-discovery.md) `3.10`, `3.10pd`, `3.11pd`, `3.3`, `3.4`, `3.9` |
| `FR-NOTIF-10` | Should | Distinct treatment for urgent vs. regular notifications | [M3](M3-discovery.md) `3.10`, `3.13` |
| `FR-NOTIF-11` | Should | Rating notifications | [M3](M3-discovery.md) `3.10`, `3.10r` |
| `FR-NOTIF-12` | Must | Dispute-lifecycle notifications to the parties | [M3](M3-discovery.md) `3.10`, `3.10q`, `3.10r`, `3.10eg` |
| `NFR-OPS-01` | Must | Audit log visibility | [M11](M11-dashboard.md) `11.6`, `11.6rec`, `11.4` |
| `NFR-OPS-02` | Should | Metrics dashboard export | [M11](M11-dashboard.md) `11.5`, `11.5x`, `11.5m`, `11.5xm` |
| `NFR-PERF-01` | Must | Direct-manipulation response time | [M0](M0-first-run.md) `0.1` · [M3](M3-discovery.md) `3.5` |
| `NFR-PERF-02` | Must | Common-action response time | [M1](M1-account.md) `1.12` · [M3](M3-discovery.md) `3.5` · [MHF](MHF-help.md) `HF.3` |
| `NFR-PERF-03` | Should | Search-radius auto-expansion as one continuous operation | [M3](M3-discovery.md) `3.13`, `3.2`, `3.5` |
| `FR-POST-01` | Must | Posting field sequence | [M2](M2-posting.md) `2.1`, `2.2`, `2.3`, `2.4`, `2.6`, `2.7`, `2.8`, `2.9` |
| `FR-POST-02` | Must | Task category allow-list | [M10](M10-moderation.md) `10.6`, `10.7` · [M2](M2-posting.md) `2.2` |
| `FR-POST-03` | Must | Schedule field for recurring arrangements | [M2](M2-posting.md) `2.5`, `2.11de` |
| `FR-POST-04` | Must | Pay format by arrangement type | [M2](M2-posting.md) `2.4`, `2.4t` |
| `FR-POST-05` | Must | Minimum lead time | [M2](M2-posting.md) `2.8`, `2.8err` |
| `FR-POST-06` | Must | Workers needed field | [M2](M2-posting.md) `2.7` |
| `FR-POST-07` | Must | Urgency computation | [M2](M2-posting.md) `2.9`, `2.9t`, `2.9e`, `2.9et` · [M3](M3-discovery.md) `3.1` |
| `FR-POST-08` | Must | Location precision display | [M0](M0-first-run.md) `0.4` · [M2](M2-posting.md) `2.6` · [M3](M3-discovery.md) `3.12`, `3.13`, `3.7` · [M4](M4-applying.md) `4.8` |
| `FR-POST-09` | Must | Review screen before submission | [M2](M2-posting.md) `2.9`, `2.9t`, `2.9bnr` |
| `FR-POST-10` | Must | Notification fan-out on submission | [M2](M2-posting.md) `2.9e`, `2.9et` |
| `FR-POST-11` | Must | Posting editing | [M2](M2-posting.md) `2.11pe`, `2.11de`, `2.11e`, `2.11e2`, `2.11c` |
| `FR-POST-12` | Must | Posting withdrawal | [M2](M2-posting.md) `2.11p`, `2.11pw`, `2.10w`, `2.11x`, `2.11d`, `2.11dw`, `2.10dw`, `2.11dx`, `2.11`, `2.11c` |
| `FR-POST-13` | Must | Posting expiry | [M2](M2-posting.md) `2.11ex`, `2.11hx` · [M4](M4-applying.md) `4.3r`, `4.5x` |
| `FR-POST-14` | Must | Slot-fill status display | [M2](M2-posting.md) `2.10`, `2.10p`, `2.10w`, `2.10dw`, `2.11` · [M3](M3-discovery.md) `3.1`, `3.12`, `3.13` · [M4](M4-applying.md) `4.3`, `4.3d`, `4.5`, `4.5s` |
| `FR-POST-15` | Must | No draft state | [M2](M2-posting.md) `2.1rst`, `2.9bnr`, `2.10b`, `2.10db` |
| `FR-POST-16` | Must | Posted-as auto-population | [M1](M1-account.md) `1.16`, `1.18`, `1.4`, `1.5` · [M2](M2-posting.md) `2.11`, `2.9` · [M6](M6-ratings.md) `6.3` · [M8](M8-endorsement.md) `8.2`, `8.4`, `8.4e` |
| `FR-POST-17` | Could | No-applicant nudge | [M4](M4-applying.md) `4.5b` · [M3](M3-discovery.md) `3.10ed` |
| `FR-POST-18` | Must | Posting status computation (Open/Filled) | [M2](M2-posting.md) `2.10`, `2.11f` |
| `NFR-PRIV-04` | Must | No general user directory | [M10](M10-moderation.md) `10.1` · [M11](M11-dashboard.md) `11.2`, `11.3`, `11.4`, `11.6` · [M1](M1-account.md) `1.4k`, `1.6`, `1.7` · [M3](M3-discovery.md) `3.1`, `3.12`, `3.7`, `3.8` · [M8](M8-endorsement.md) `8.2`, `8.3` · [MHF](MHF-help.md) `HF.3` |
| `NFR-PRIV-05` | Must | Report anonymity | [M1](M1-account.md) `1.19` · [M2](M2-posting.md) `2.10g`, `2.11g` · [M3](M3-discovery.md) `3.12` · [M9](M9-disputes.md) `9.1`, `9.2` |
| `NFR-PRIV-06` | Could | Anonymized usage analytics | [M11](M11-dashboard.md) `11.5`, `11.5x`, `11.5m`, `11.5xm` |
| `FR-PROF-01` | Must | Profile display identity | [M1](M1-account.md) `1.15`, `1.15e`, `1.18`, `1.18e`, `1.18ed`, `1.18eg`, `1.19` · [M4](M4-applying.md) `4.6`, `4.6k`, `4.6t` · [M6](M6-ratings.md) `6.3` |
| `FR-PROF-02` | Must | Verification badges | [M1](M1-account.md) `1.18`, `1.19` |
| `FR-PROF-03` | Should | Profile bio | [M1](M1-account.md) `1.11`, `1.16`, `1.18` · [M7](M7-profile.md) `7.1` |
| `FR-PROF-04` | Should | Bio-to-application-note integration | [M1](M1-account.md) `1.11`, `1.16`, `1.18`, `1.4` · [M4](M4-applying.md) `4.1` · [M6](M6-ratings.md) `6.4` · [M7](M7-profile.md) `7.1` |
| `FR-PROF-05` | Must | Contextual profile visibility | [M1](M1-account.md) `1.10`, `1.17`, `1.18`, `1.19`, `1.2`, `1.20`, `1.4k`, `1.6`, `1.7`, `1.8`, `1.9` · [M3](M3-discovery.md) `3.1`, `3.12`, `3.7`, `3.8` · [M4](M4-applying.md) `4.6` · [M8](M8-endorsement.md) `8.2`, `8.3` |
| `FR-PROF-06` | Must | Trust-signal display on profile | [M1](M1-account.md) `1.18`, `1.19` · [M4](M4-applying.md) `4.6`, `4.6t` |
| `FR-RATE-01` | Must | Rating scale and submission | [M6](M6-ratings.md) `6.1`, `6.3` |
| `FR-RATE-02` | Must | Double-blind submission | [M5](M5-engagement.md) `5.1cv`, `5.2c`, `5.2d` · [M6](M6-ratings.md) `6.1`, `6.2`, `6.3`, `6.6d` |
| `FR-RATE-03` | Must | Completion-rate as a distinct stat | [M1](M1-account.md) `1.18`, `1.19` · [M4](M4-applying.md) `4.5`, `4.6` · [M6](M6-ratings.md) `6.1`, `6.2`, `6.4`, `6.6` |
| `FR-RATE-04` | Must | Per-Engagement independent ratings | [M5](M5-engagement.md) `5.2b`, `5.3b` · [M6](M6-ratings.md) `6.1`, `6.2`, `6.3`, `6.4`, `6.5`, `6.5b`, `6.6`, `6.6b` |
| `FR-RATE-05` | Must | Rating applicability by Engagement outcome | [M5](M5-engagement.md) `5.11d`, `5.1c`, `5.1ec`, `5.2b`, `5.2tc`, `5.3b`, `5.5b`, `5.9b` · [M6](M6-ratings.md) `6.1`, `6.2`, `6.3`, `6.4`, `6.5`, `6.6`, `6.6b`, `6.6d` |
| `FR-RATE-06` | Should | Rating disputes | [M6](M6-ratings.md) `6.1`, `6.2`, `6.3`, `6.4`, `6.5`, `6.6` |
| `NFR-REL-01` | Must | Stalled-engagement resolution integrity | [M5](M5-engagement.md) `5.14` |
| `NFR-REL-02` | Must | Immediate suspension effect | [M10](M10-moderation.md) `10.6` |
| `NFR-SEC-02` | Must | Login rate-limiting | [M3](M3-discovery.md) `3.12` |
| `NFR-SEC-03` | Must | NIC data protection | [M10](M10-moderation.md) `10.1` · [M11](M11-dashboard.md) `11.3`, `11.3m`, `11.8rec1` |
| `NFR-SEC-04` | Must | Dashboard two-factor authentication | [M11](M11-dashboard.md) `11.1`, `11.1b`, `11.1fb` |
| `NFR-SEC-05` | Must | Role-based access control | [M10](M10-moderation.md) `10.1`, `10.1a`, `10.1c`, `10.1e`, `10.1er`, `10.1r`, `10.4`, `10.4e`, `10.4r`, `10.5`, `10.5e`, `10.5r`, `10.6`, `10.6b`, `10.7`, `10.7b`, `10.8`, `10.8b` · [M11](M11-dashboard.md) `11.2d`, `11.3m`, `11.3Lm`, `11.4a` |
| `NFR-SEC-06` | Must | Audit logging of privileged actions | [M11](M11-dashboard.md) `11.6`, `11.6rec` |
| `NFR-USE-01` | Should | Offline tolerance | [M1](M1-account.md) `1.3err1` · [M2](M2-posting.md) `2.9bnr`, `2.1rst` · [M3](M3-discovery.md) `3.1`, `3.12`, `3.12ofl`, `3.1ofl` · [M4](M4-applying.md) `4.1bnr` |
| `NFR-USE-03` | Should | Static Help/FAQ content | [M1](M1-account.md) `1.18` · [M5](M5-engagement.md) `5.2`, `5.6` · [M8](M8-endorsement.md) `8.4` · [M9](M9-disputes.md) `9.1` · [MHF](MHF-help.md) `HF.1`, `HF.2`, `HF.3`, `HF.4` |

## Requirements with no interface

Ruled as having nothing to draw, with the reason. **Not gaps.**

| Requirement | Why there is nothing to draw |
| --- | --- |
| `FR-ACC-06` | incomplete signup expiry — the requirement's own note says it 'has no trigger under the current design' since FR-ACC-08's amendment made registration a single atomic submission |
| `NFR-LOC-01` | English-only in this build — the ABSENCE of any Sinhala/Tamil UI is the artefact, and its acceptance criterion is literally that none is present |
| `NFR-LOC-02` | Sinhala/Tamil scoped for a later phase — backlog, not this build |
| `NFR-LOC-03` | dashboard English-only permanently — same shape as NFR-LOC-01 |
| `NFR-LOC-04` | currency and timezone — satisfied everywhere at once (Rs in 48 strings, day-first dates, zero ambiguous numeric dates) rather than by one screen |
| `NFR-PERF-04` | uptime target — operational |
| `NFR-PERF-05` | no concurrent-user ceiling — operational |
| `NFR-PRIV-01` | PDPA baseline posture — policy, not a screen |
| `NFR-PRIV-02` | data retention posture — policy |
| `NFR-PRIV-03` | anonymised deletion — the outcome is drawn on 1.17d; the anonymisation is server-side |
| `NFR-PRIV-06` | anonymised analytics — server-side |
| `NFR-REL-04` | engagement-deletion integrity — server-side |
| `NFR-SEC-01` | password hashing — server-side, nothing to draw |
| `NFR-SEC-02` | login rate-limiting — the USER-facing half is drawn (1.6bnr2/1.6bnr3, 11.1w/11.1L); the limit itself is server-side |
| `NFR-USE-02` | low data usage — satisfied by CONSTRUCTION across the whole file rather than by one screen: zero IMAGE fills in 462 frames (every visual is drawn vector), MD2's flat-vector map ruling ('no imagery, honest about not being a real map'), and a 25-glyph drawn icon set. Same shape as NFR-LOC-04 — there is no screen that could show it, because every screen shows it |
| `FR-ADM-01` | 10.3b |
| `FR-ENDORSE-03` | 5.5c |
| `FR-ENDORSE-05` | 5.5c |
| `FR-MOD-02` | 10.3b, 3.7b, 5.5c |
| `NFR-OPS-04` | 5.5c |
