# YouthLink — Requirements

Functional and non-functional requirements for YouthLink, a mobile platform connecting youth job-seekers with verified local gigs, part-time jobs, and internships.

## About this document

This is the normative requirements baseline the codebase is built against: **129 Functional Requirements** across 13 modules and **32 Non-Functional Requirements** across 7 categories, each with a stable ID and Given/When/Then acceptance criteria.

**Referencing requirements in your work.** Every requirement has a permanent ID (`FR-POST-01`, `NFR-SEC-03`). Use them in commit messages, per [`CONTRIBUTING.md`](../CONTRIBUTING.md) — list every requirement a commit touches:

```
feat(backend): add posting creation endpoint [FR-POST-01]
feat(backend): add NIC storage and duplicate checks [FR-ACC-04, FR-ACC-05]
```

Branch names are based on the **epic**, not on individual requirement IDs — `feature/gig-posting-yourname`. The commit message is where requirement traceability lives, which is what makes `git log --grep "FR-POST-01"` work.

**Priority tags.** `Must` / `Should` / `Could` / `Won't (this build)` reflect how load-bearing a requirement is to the product, not which sprint it lands in. Sprint and ownership allocation lives in [`module-ownership.md`](module-ownership.md).

**Acceptance criteria are the first clause of the Definition of Done.** A story is not Done until its documented Given/When/Then criteria are met.

**Related documents:** [`product-overview.md`](product-overview.md) explains how the system works as a whole and why these mechanisms exist; [`database-schema.md`](database-schema.md) maps every entity and field back to the requirements below.

> **Canonical source.** This file is derived from the team's requirements baseline, which is maintained outside the repository. Do not change a requirement by editing this file alone — raise it with the team so the baseline and this copy stay in step.

---

## 1. Introduction

### 1.1 Purpose

This document specifies the complete set of Functional Requirements (FR) and Non-Functional Requirements (NFR) for YouthLink, a mobile-first local gig board and youth employment platform aligned to SDG 1 (No Poverty) and SDG 8 (Decent Work and Economic Growth). It is the single reference for what the system must do and how well it must do it.

### 1.2 Scope

> YouthLink is a mobile platform that connects unemployed youth, students, and local workers with verified local gigs, part-time jobs, and internships posted by nearby businesses and individuals. Employers post job or gig listings directly through the app, while job seekers build a profile, apply instantly, and earn ratings after each completed gig — creating a trusted, location-based hiring pool that gives local youth a verifiable track record to build employability on.

The consumer-facing product (Youth Job-Seeker, Local Business/Employer, Community Verifier/Endorser) is mobile-only. Admin/Moderator functions run on a separate, internal web dashboard — genuinely desktop-shaped work, not a scope exception. Section 5 states what YouthLink deliberately excludes.

### 1.3 Definitions

| Term                | Meaning                                                                                                                                                   |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Gig Posting         | The listing an Employer creates — category, arrangement type, pay, location, time, workers needed.                                                        |
| Engagement          | One specific worker's relationship to a Gig Posting, from selection to close. A multi-slot posting spawns one independent Engagement per selected worker. |
| Arrangement type    | Gig (one-off), Part-time job (ongoing), or Internship — a separate dimension from task category.                                                          |
| Zero-history worker | A Youth Job-Seeker with zero completed, rated engagements — the population the endorsement bootstrap exists for.                                          |
| Material change     | A change to pay, start date/time, location, workers needed, or task category after selection — requires re-confirmation.                                  |
| Minor change        | A change to title or description text only — no re-confirmation needed.                                                                                   |
| OTP                 | One-time password — 6-digit numeric code, 5-minute validity.                                                                                              |
| NIC                 | National Identity Card number — collected at signup, never verified in this build.                                                                        |
| PCC                 | Police Clearance Certificate — a viable Sri Lankan verification layer, not implemented in this build.                                                     |
| PDPA                | Sri Lanka's Personal Data Protection Act.                                                                                                                 |

---

## 2. Actors

| Actor                       | Type                    | Summary                                                                                                                                                                                                                                           |
| --------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Youth Job-Seeker            | Consumer, mobile        | Browses, applies to, and completes gigs, part-time jobs, and internships. Covers both the school-leaver and undergraduate user types.                                                                                                             |
| Local Business/Employer     | Consumer, mobile        | Posts listings, reviews and selects applicants, manages engagements. Posts as Individual/Household or Business.                                                                                                                                   |
| Community Verifier/Endorser | Consumer, mobile        | Vouches for a zero-history worker they personally know. Self-selected role, no additional vetting.                                                                                                                                                |
| Moderator                   | Internal, web dashboard | High-volume, lower-stakes work: case triage, warnings, flagged-content review.                                                                                                                                                                    |
| Admin                       | Internal, web dashboard | Lower-volume, higher-stakes, harder-to-reverse actions: final dispute rulings, account suspension, posting removal. Identity-document verification approval belongs to this tier but is future-contingent, not built in this version (FR-ADM-04). |

A fourth consumer actor (Parent/Guardian) was considered and rejected — YouthLink excludes users under 18 entirely rather than building guardian-consent handling.

---

## 3. Functional Requirements

### 3.1 FR-ACC — Account Management

#### FR-ACC-01 — Account registration

| Actor(s)                                                               | Priority |
| ---------------------------------------------------------------------- | -------- |
| Youth Job-Seeker, Local Business/Employer, Community Verifier/Endorser | Must     |

**Requirement:** The system shall allow a new user to register by selecting one actor role (Youth Job-Seeker, Local Business/Employer, or Community Verifier/Endorser) and providing, in one sitting: a phone number verified via a 6-digit OTP valid for 5 minutes; a password; an optional email verified once via a confirmation link if provided; an NIC number (collected, not verified); a self-declared birthdate; a full legal name (capped at 100 characters); and acceptance of Terms of Service and Privacy Policy via a single checkbox.

**Acceptance Criteria:**

- Given a new user submits the signup form, when the phone OTP is not yet verified, then the account cannot be created.
- Given a self-declared birthdate indicates the user is under 18, when they attempt to submit, then registration is declined outright.
- Given the ToS/Privacy Policy checkbox is unchecked, when the user attempts to submit, then registration is blocked.
- Given the user provides an email, when they do not click the confirmation link, then the email remains unverified but registration is not blocked by this alone.

#### FR-ACC-02 — Employer posting-as type

| Actor(s)                | Priority |
| ----------------------- | -------- |
| Local Business/Employer | Must     |

**Requirement:** The system shall require an Employer to choose, once at signup, whether the account posts as Individual/Household or Business. Choosing Business shall unlock a business name field (capped at 100 characters) and an optional business bio field (capped at 300 characters), both displayed automatically on every posting from that account.

**Acceptance Criteria:**

- Given an Employer selects Business, when they proceed, then the business name field becomes required and the business bio field becomes available.
- Given an Employer selects Individual/Household, when they proceed, then neither field is shown or required.
- Given an existing Employer switches posting-as type later in Settings, when they switch to Business, then the business name/bio fields are added to the account; when they switch back, then those fields are removed from display rather than left stale.

#### FR-ACC-03 — Age gate

| Actor(s)        | Priority |
| --------------- | -------- |
| All actor types | Must     |

**Requirement:** The system shall block registration for any user whose self-declared birthdate indicates an age under 18, as a simple, unconditional gate.

**Acceptance Criteria:**

- Given a birthdate is entered indicating age under 18, when the user submits, then registration is declined with no exceptions or override path.

#### FR-ACC-04 — NIC field handling

| Actor(s)        | Priority |
| --------------- | -------- |
| All actor types | Must     |

**Requirement:** The system shall collect an NIC number as a required signup field, store it as entered, and not run it through any verification service or derive any data (including age) from it.

**Acceptance Criteria:**

- Given a user enters an NIC number, when the account is created, then no external verification call is made against it.
- Given the NIC field is populated, when the age gate (FR-ACC-03) evaluates eligibility, then it uses only the self-declared birthdate, never the NIC.

#### FR-ACC-05 — Duplicate account prevention

| Actor(s)        | Priority |
| --------------- | -------- |
| All actor types | Must     |

**Requirement:** The system shall enforce database-level uniqueness on NIC number, verified phone number, and verified email (where provided), preventing more than one account per value.

**Acceptance Criteria:**

- Given an NIC, verified phone, or verified email already exists on an account, when a new signup attempts to use the same value, then registration is blocked for that field.

#### FR-ACC-06 — Incomplete signup expiry

| Actor(s)        | Priority |
| --------------- | -------- |
| All actor types | Should   |

**Requirement:** The system shall auto-expire an incomplete signup (phone verified, remaining steps unfinished) after 24 hours, releasing the phone number for a fresh signup attempt.

**Acceptance Criteria:**

- Given a phone number is OTP-verified but the account is not completed, when 24 hours pass, then the phone number is released from the uniqueness constraint (FR-ACC-05) and available for reuse.

#### FR-ACC-07 — Login

| Actor(s)        | Priority |
| --------------- | -------- |
| All actor types | Must     |

**Requirement:** The system shall provide two fully independent login paths for a registered user: phone plus password, or phone plus a freshly requested OTP.

**Acceptance Criteria:**

- Given a user has forgotten their password, when they choose the OTP login path, then they can log in without needing the password.
- Given SMS delivery is failing, when a user has a working password, then they can log in via the password path regardless of OTP availability.

#### FR-ACC-08 — OTP mechanism

| Actor(s)        | Priority |
| --------------- | -------- |
| All actor types | Must     |

**Requirement:** The system shall provide 6-digit numeric OTP verification for signup verification, the OTP login path, phone number changes, and password reset, split across two mechanisms. **Signup and OTP-login phone verification are delivered by Firebase Phone Authentication**, which generates and verifies its own 6-digit code; its validity window is set by Firebase and is not configurable by this system. **Phone number changes, password reset, and dashboard admin login use the system's own OTP mechanism**, generating a 6-digit code valid for 5 minutes, single-use. Both are distinct in purpose from the per-engagement check-in codes and the endorsement invite code.

**Acceptance Criteria:**

- Given a system-generated OTP (phone change, password reset, or admin login) is created, when 5 minutes elapse without use, then it expires and a new one must be requested.
- Given a system-generated OTP has been used once, when it is submitted again, then it is rejected.
- Given a user completes Firebase phone verification at signup or OTP login, when the backend receives the resulting Firebase ID token, then the phone number is treated as verified only after that token is validated server-side.

> **Amended 2026-08-15.** As originally written, this requirement described a single self-implemented OTP covering all four purposes, and the schema's `OtpPurpose` enum still carries `SIGNUP` and `LOGIN` values from that version. The Sprint 0 tech-stack decision of 2026-08-13 selected Firebase for OTP delivery, and Firebase Phone Authentication generates and verifies its own code — an application cannot inject its own into it. The two decisions were never reconciled at the time; the conflict surfaced on the first day of Sprint 1 implementation and was resolved by the Product Owner in favour of Firebase for the two user-facing paths. The `OtpCode` table is retained for the three purposes above, including dashboard admin login, where no Firebase client exists.

#### FR-ACC-09 — Password security

| Actor(s)        | Priority |
| --------------- | -------- |
| All actor types | Must     |

**Requirement:** The system shall hash passwords using bcrypt or argon2 (never plaintext or reversibly encrypted) and lock an account for 15 minutes after 5 consecutive failed password attempts.

**Acceptance Criteria:**

- Given 5 consecutive failed login attempts on the password path, when the 5th failure occurs, then further password attempts are blocked for 15 minutes.
- Given a password is stored, when the database is inspected, then no plaintext or reversibly-encrypted password value is present.

#### FR-ACC-10 — Password reset

| Actor(s)        | Priority |
| --------------- | -------- |
| All actor types | Must     |

**Requirement:** The system shall support password reset via OTP to phone as the primary channel, and via a confirmation-link email reset as a secondary channel if the user provided and verified an email.

**Acceptance Criteria:**

- Given a user requests a password reset, when they have a working phone number, then an OTP-based reset is available.
- Given a user has a verified email on file and SMS delivery is failing, when they request a reset, then an email-based reset link is available as an alternative.
- Given neither phone nor a verified email is reachable, when a user attempts self-service reset, then no automated path succeeds — this is a named limitation, not silently masked as solved.

#### FR-ACC-11 — Password change

| Actor(s)        | Priority |
| --------------- | -------- |
| All actor types | Must     |

**Requirement:** The system shall allow a logged-in user to change their password by providing their current password and a new password, without requiring OTP or email.

**Acceptance Criteria:**

- Given a logged-in user submits their current and new password, when the current password is correct, then the password is updated immediately.

#### FR-ACC-12 — Phone number change

| Actor(s)        | Priority |
| --------------- | -------- |
| All actor types | Must     |

**Requirement:** The system shall allow a logged-in user to change their phone number, gated behind password re-entry, with the new number requiring OTP verification before it takes effect and the old number remaining locked under the uniqueness constraint (FR-ACC-05) until the new number is confirmed.

**Acceptance Criteria:**

- Given a user requests a phone number change, when they have not re-entered their password, then the change is blocked.
- Given the new number has not yet completed OTP verification, when checked, then the old number still satisfies the uniqueness constraint.
- Given the new number completes OTP verification, when the swap finalizes, then the old number is released from the uniqueness constraint atomically with the new number taking effect.

#### FR-ACC-13 — NIC correction

| Actor(s)        | Priority |
| --------------- | -------- |
| All actor types | Must     |

**Requirement:** The system shall allow a logged-in user to edit their NIC number in Settings, gated behind password re-entry only, with no OTP-equivalent verification step.

**Acceptance Criteria:**

- Given a user edits their NIC field and re-enters their password, when submitted, then the NIC value updates immediately with no further verification.

#### FR-ACC-14 — Email add/change

| Actor(s)        | Priority |
| --------------- | -------- |
| All actor types | Must     |

**Requirement:** The system shall allow a user to add or change their email in Settings, requiring confirmation-link verification of the new address before it replaces the old value or becomes the account's recovery channel.

**Acceptance Criteria:**

- Given a user submits a new email, when they have not clicked the confirmation link, then the old email (if any) remains the account's active recovery channel.
- Given the confirmation link is clicked, when verification completes, then the new email replaces the old as the active, verified address.

#### FR-ACC-15 — Display name editing

| Actor(s)        | Priority |
| --------------- | -------- |
| All actor types | Should   |

**Requirement:** The system shall allow a user to edit their display (legal) name after signup, with the same low-ceremony pattern as NIC correction (FR-ACC-13) — no special gating beyond standard account access.

**Acceptance Criteria:**

- Given a logged-in user edits their display name field within the 100-character cap, when submitted, then the new name is reflected everywhere it is shown.

#### FR-ACC-16 — Posting-as type change

| Actor(s)                | Priority |
| ----------------------- | -------- |
| Local Business/Employer | Should   |

**Requirement:** The system shall allow an Employer to change their posting-as type (Individual/Household ↔ Business) in Settings at any time — see FR-ACC-02 for the resulting field behavior.

**Acceptance Criteria:**

- Given an Employer changes posting-as type, when the change is saved, then future postings reflect the new type; existing postings' displayed poster-type is unaffected retroactively.

#### FR-ACC-17 — Account deletion

| Actor(s)        | Priority |
| --------------- | -------- |
| All actor types | Must     |

**Requirement:** The system shall allow a user to delete their account via a Settings action gated behind password re-entry, blocked while any Engagement is active. On deletion, the system shall remove the user's own identifying data (NIC, phone, email, password) while preserving engagement history (ratings given and received) attributed to an anonymized reference.

**Acceptance Criteria:**

- Given a user has at least one active (not completed, ended, or cancelled) Engagement, when they attempt deletion, then the system blocks it and requires resolving every active Engagement first.
- Given a user with no active Engagements confirms deletion with their password, when deletion completes, then their identifying data is removed but past ratings and engagement records remain, attributed to an anonymized reference rather than deleted.

#### FR-ACC-18 — Unified Settings screen

| Actor(s)        | Priority |
| --------------- | -------- |
| All actor types | Must     |

**Requirement:** The system shall provide one Settings screen housing password change, contact-detail editing (phone/NIC/email), notification preferences, posting-as type (Employer), and account deletion — not scattered across separate screens.

**Acceptance Criteria:**

- Given a user navigates to Settings, when the screen loads, then password, contact details, notification preferences, posting-as type (if Employer), and account deletion are all reachable from that one screen.

#### FR-ACC-19 — Terms of Service and Privacy Policy acceptance

| Actor(s)        | Priority |
| --------------- | -------- |
| All actor types | Must     |

**Requirement:** The system shall require a single checkbox acceptance of the Terms of Service and Privacy Policy (both linked) at the final signup step, blocking registration until checked.

**Acceptance Criteria:**

- Given the checkbox is unchecked, when the user attempts to submit signup, then registration is blocked with the checkbox highlighted.

### 3.2 FR-PROF — Profile & Trust Signals

#### FR-PROF-01 — Profile display identity

| Actor(s)        | Priority |
| --------------- | -------- |
| All actor types | Must     |

**Requirement:** The system shall display each user's full legal name (not a username or handle) wherever their identity is shown to another party — applicant lists, contact reveal, ratings.

**Acceptance Criteria:**

- Given any user-facing surface displays a person's identity, when rendered, then it shows their full legal name as entered at signup or subsequently edited (FR-ACC-15), never a chosen handle.

#### FR-PROF-02 — Verification badges

| Actor(s)        | Priority |
| --------------- | -------- |
| All actor types | Must     |

**Requirement:** The system shall display a "Phone verified" badge on every user's profile (since all users complete phone OTP verification) and a business-name display for Business-type Employers. The system shall not display any badge implying NIC or PCC verification, since neither is actually verified in this build.

**Acceptance Criteria:**

- Given any registered user's profile is viewed, when rendered, then a "Phone verified" badge is shown.
- Given an Employer is posting-as Business, when their profile or listing is viewed, then the business name is displayed alongside it.
- Given NIC is collected but unverified, when a profile is rendered, then no badge or label implies NIC verification has occurred.

#### FR-PROF-03 — Profile bio

| Actor(s)                                  | Priority |
| ----------------------------------------- | -------- |
| Youth Job-Seeker, Local Business/Employer | Should   |

**Requirement:** The system shall provide a free-text bio field on every profile, capped at 300 characters, covering relevant experience and language abilities (for Youth Job-Seekers) or a business description (for Business-type Employers, alongside the business name field).

**Acceptance Criteria:**

- Given a user edits their bio, when they attempt to exceed 300 characters, then input is blocked or truncated at the cap.

#### FR-PROF-04 — Bio-to-application-note integration

| Actor(s)         | Priority |
| ---------------- | -------- |
| Youth Job-Seeker | Should   |

**Requirement:** The system shall pre-fill a worker's application note (FR-APPLY-02) automatically from their profile bio, editable per-application without altering the stored bio.

**Acceptance Criteria:**

- Given a worker with a populated bio applies to a gig, when the application confirmation screen opens, then the note field is pre-filled with the bio text, editable for that application only.

#### FR-PROF-05 — Contextual profile visibility

| Actor(s)        | Priority |
| --------------- | -------- |
| All actor types | Must     |

**Requirement:** The system shall make a user's profile visible to another party only in the context of a specific interaction (an applicant's profile while an Employer reviews applications; an Employer's profile while a worker views their listing) — never as a general, searchable directory of every user on the platform.

**Acceptance Criteria:**

- Given a user attempts to browse or search for other users outside an active interaction context, when they try, then no general people-directory is available.
- Given an Employer is reviewing applications to their own posting, when they open an applicant's profile, then it is visible for that context.

#### FR-PROF-06 — Trust-signal display on profile

| Actor(s)         | Priority |
| ---------------- | -------- |
| Youth Job-Seeker | Must     |

**Requirement:** The system shall display average rating and completion rate on a worker's profile where rating history exists; for a zero-history worker, the system shall display "New to YouthLink" plus an endorsement badge if an active endorsement exists (FR-ENDORSE-10).

**Acceptance Criteria:**

- Given a worker has at least one completed, rated engagement, when their profile is viewed, then average rating and completion rate are shown.
- Given a worker has zero rating history and an active endorsement, when their profile is viewed, then "New to YouthLink" and the endorsement badge are both shown.

### 3.3 FR-POST — Gig Posting

#### FR-POST-01 — Posting field sequence

| Actor(s)                | Priority |
| ----------------------- | -------- |
| Local Business/Employer | Must     |

**Requirement:** The system shall require a logged-in Employer to complete, in sequence, when creating a posting: title (80 characters), description (1000 characters), task category (dropdown from the allow-list, FR-POST-02), arrangement type (Gig / Part-time job / Internship), pay (format per FR-POST-04), location (precise address, map pin), workers needed (FR-POST-06), and start date/time (subject to FR-POST-05).

**Acceptance Criteria:**

- Given any required field is left empty, when the Employer attempts to submit, then submission is blocked with the missing field indicated.
- Given title exceeds 80 characters or description exceeds 1000, when entered, then input is blocked or truncated at the cap.

#### FR-POST-02 — Task category allow-list

| Actor(s)                | Priority |
| ----------------------- | -------- |
| Local Business/Employer | Must     |

**Requirement:** The system shall restrict task category selection to a curated allow-list: retail/shop assistant, delivery and errands, event setup, moving and manual labor, food service, tutoring, cleaning. The system shall not permit free-text category entry, and shall exclude childcare, eldercare, or any work involving unsupervised access to a vulnerable person, professionally-licensed work, and any scam-pattern or illegal activity.

**Acceptance Criteria:**

- Given the category field, when an Employer opens it, then only the seven allow-listed categories are selectable, with no free-text option.
- Given a posting attempts a category outside the allow-list, when submitted, then it is rejected.

#### FR-POST-03 — Schedule field for recurring arrangements

| Actor(s)                | Priority |
| ----------------------- | -------- |
| Local Business/Employer | Must     |

**Requirement:** The system shall require a free-text Schedule field, capped at 200 characters, for postings with arrangement type Part-time job or Internship — not required for Gig, where a single start time suffices.

**Acceptance Criteria:**

- Given arrangement type is Part-time job or Internship, when the Employer proceeds without entering a Schedule value, then submission is blocked.
- Given arrangement type is Gig, when the Employer proceeds without a Schedule value, then submission is not blocked on this basis.

#### FR-POST-04 — Pay format by arrangement type

| Actor(s)                | Priority |
| ----------------------- | -------- |
| Local Business/Employer | Must     |

**Requirement:** The system shall present a pay-entry format determined by arrangement type: a fixed total for a Gig, a rate (per day/week/month) for a Part-time job, or a choice of Unpaid/Stipend/Paid (with rate or total, as applicable) for an Internship. The stated figure shall apply per worker, not split across slots, when workers needed exceeds 1.

**Acceptance Criteria:**

- Given arrangement type is Gig, when the pay field renders, then it accepts a single fixed total only.
- Given arrangement type is Part-time job, when the pay field renders, then it accepts a rate with a day/week/month unit selector.
- Given arrangement type is Internship, when the pay field renders, then Unpaid, Stipend, and Paid are all selectable options.
- Given workers needed is 3 and pay is stated as Rs 3000, when three workers are selected, then each of the three earns Rs 3000, not a divided share.

#### FR-POST-05 — Minimum lead time

| Actor(s)                | Priority |
| ----------------------- | -------- |
| Local Business/Employer | Must     |

**Requirement:** The system shall require a posting's start date/time to be at least 2 hours from the moment of posting, blocking submission with an error if violated.

**Acceptance Criteria:**

- Given a start time less than 2 hours from the current moment, when the Employer attempts to submit, then submission is blocked with an explanatory error, not merely a warning.

#### FR-POST-06 — Workers needed field

| Actor(s)                | Priority |
| ----------------------- | -------- |
| Local Business/Employer | Must     |

**Requirement:** The system shall require a numeric "workers needed" field on every posting, defaulting to 1, with a minimum of 1 and a maximum of 20, available uniformly regardless of category or arrangement type.

**Acceptance Criteria:**

- Given the workers-needed field, when left at default, then it is 1.
- Given a value of 0 or greater than 20 is entered, when the Employer attempts to submit, then submission is blocked.

#### FR-POST-07 — Urgency computation

| Actor(s) | Priority |
| -------- | -------- |
| System   | Must     |

**Requirement:** The system shall compute a posting's urgency status automatically from whether its start time falls within 24–48 hours of the posting time. Urgency shall never be a manually set employer toggle.

**Acceptance Criteria:**

- Given a start time 30 hours after posting, when the posting is created, then it is automatically flagged Urgent.
- Given a start time 5 days after posting, when created, then it is not flagged Urgent.
- Given no UI control exists for the Employer to set urgency directly, when the posting form is inspected, then this holds true.

#### FR-POST-08 — Location precision display

| Actor(s) | Priority |
| -------- | -------- |
| System   | Must     |

**Requirement:** The system shall display only a coarse, suburb-level area to workers browsing or applying, and shall release the precise address (as a map pin, not raw text) only to the one worker actually selected for that Engagement.

**Acceptance Criteria:**

- Given a posting has not yet had a worker selected, when any worker browses or applies, then only the coarse area is visible, shown on a map.
- Given a specific worker is selected for an Engagement, when that worker views the listing, then the precise address becomes visible to them, and only them.

#### FR-POST-09 — Review screen before submission

| Actor(s)                | Priority |
| ----------------------- | -------- |
| Local Business/Employer | Must     |

**Requirement:** The system shall present a review screen before final submission, showing every entered field plus two computed, non-editable previews: urgency status and the general-area display.

**Acceptance Criteria:**

- Given the Employer reaches the review screen, when it renders, then all entered fields are shown alongside computed urgency and the general-area preview, with the latter two not directly editable.

#### FR-POST-10 — Notification fan-out on submission

| Actor(s)                 | Priority |
| ------------------------ | -------- |
| System, Youth Job-Seeker | Must     |

**Requirement:** The system shall, immediately on posting submission, send an opt-in proactive push to matching opted-in youth within the search radius if the posting is urgent (FR-NOTIF-01), or the opt-out-by-default "new gig posted" notification within radius if not urgent (FR-NOTIF-02).

**Acceptance Criteria:**

- Given an urgent posting is submitted, when fan-out triggers, then only opted-in youth within radius receive a proactive push.
- Given a non-urgent posting is submitted, when fan-out triggers, then all non-opted-out youth within radius receive the standard notification.

#### FR-POST-11 — Posting editing

| Actor(s)                | Priority |
| ----------------------- | -------- |
| Local Business/Employer | Must     |

**Requirement:** The system shall allow an Employer to edit a posting without restriction before any slot fills. After a slot fills, a material change (pay, timing, location, workers needed, category) shall require the affected worker's re-confirmation (FR-ENG-09); a minor change (title/description) shall not.

**Acceptance Criteria:**

- Given no slot has filled, when the Employer edits any field, then the change applies immediately with no re-confirmation required.
- Given at least one slot has filled and the Employer edits pay, when saved, then the affected worker(s) receive a re-confirmation request rather than a silent update.

#### FR-POST-12 — Posting withdrawal

| Actor(s)                | Priority |
| ----------------------- | -------- |
| Local Business/Employer | Must     |

**Requirement:** The system shall provide a Withdraw action, available any time before the first slot is filled, distinct from cancellation (which applies only after selection).

**Acceptance Criteria:**

- Given a posting has zero filled slots, when the Employer withdraws it, then it is removed from active browse/search results.
- Given at least one slot has filled, when the Employer attempts Withdraw, then the system directs them to the cancellation flow (FR-ENG-05/06) instead.

#### FR-POST-13 — Posting expiry

| Actor(s) | Priority |
| -------- | -------- |
| System   | Should   |

**Requirement:** The system shall auto-expire and archive an open posting with zero filled slots after 30 days of no engagement.

**Acceptance Criteria:**

- Given a posting has zero filled slots, when 30 days pass since posting, then it auto-archives and drops out of active browse/search results.

#### FR-POST-14 — Slot-fill status display

| Actor(s) | Priority |
| -------- | -------- |
| System   | Must     |

**Requirement:** The system shall display multi-slot posting fill status plainly (e.g., "2 of 3 filled") in both browse/search results and the listing's detail view, throughout the posting's life.

**Acceptance Criteria:**

- Given a posting has workers-needed of 3 and 2 filled slots, when displayed anywhere, then "2 of 3 filled" or equivalent is shown.

#### FR-POST-15 — No draft state

| Actor(s) | Priority                 |
| -------- | ------------------------ |
| System   | Must (design constraint) |

**Requirement:** The system shall not provide a partial-save or draft state for postings — a posting is completed in one sitting or not submitted.

**Acceptance Criteria:**

- Given an Employer exits the posting flow before submitting, when they return, then no partially-completed posting is recoverable.

#### FR-POST-16 — Posted-as auto-population

| Actor(s) | Priority |
| -------- | -------- |
| System   | Must     |

**Requirement:** The system shall automatically display the account's business name and bio (where posting-as Business, FR-ACC-02) on every posting from that account, without re-entry per listing.

**Acceptance Criteria:**

- Given a Business-type Employer creates a new posting, when it goes live, then the business name and bio are shown automatically without being entered as part of that posting's flow.

#### FR-POST-17 — No-applicant nudge

| Actor(s)                | Priority |
| ----------------------- | -------- |
| Local Business/Employer | Could    |

**Requirement:** The system shall nudge an Employer whose posting has zero applicants — at 24 hours live for a regular gig, or at the halfway point between posting and stated start time for an urgent gig — suggesting they review pay or details.

**Acceptance Criteria:**

- Given a regular gig has zero applicants at 24 hours live, when that threshold passes, then the Employer receives a nudge notification.
- Given an urgent gig reaches the halfway point between posting and start time with zero applicants, when that point passes, then the Employer receives a nudge notification.

#### FR-POST-18 — Posting status computation (Open/Filled)

| Actor(s) | Priority |
| -------- | -------- |
| System   | Must     |

**Requirement:** The system shall compute a posting's status as Open whenever its filled-slot count is below workers needed (still accepting applications for the remaining slots) and as Filled once every slot has a selected worker (no longer accepting new applications). If a filled slot's Engagement is cancelled or ended early before genuine completion, that one slot shall reopen and the posting shall return to Open for that slot specifically, with every other Engagement on the posting unaffected.

**Acceptance Criteria:**

- Given a posting goes live with workers needed greater than 0 filled, when created, then its status is Open.
- Given every slot on a posting becomes filled, when the last selection completes, then the posting's status becomes Filled and it stops accepting new applications.
- Given a Filled posting has one Engagement cancelled or ended early before completion, when that happens, then the posting's status reverts to Open for that one slot specifically, and the other Engagements are unaffected.

### 3.4 FR-DISC — Discovery & Search

#### FR-DISC-01 — Radius-based browsing

| Actor(s)         | Priority |
| ---------------- | -------- |
| Youth Job-Seeker | Must     |

**Requirement:** The system shall let a Youth Job-Seeker browse gigs filtered by location radius, defaulting to 5km, auto-expanding in 5km increments up to a maximum of 50km if fewer than 5 results are returned.

**Acceptance Criteria:**

- Given fewer than 5 postings exist within 5km, when the browse screen loads, then the radius auto-expands in 5km steps until either 5+ results appear or 50km is reached.

#### FR-DISC-02 — Manual location fallback

| Actor(s)         | Priority |
| ---------------- | -------- |
| Youth Job-Seeker | Must     |

**Requirement:** The system shall provide a manual location-entry fallback (area/city selection) when location permission is denied.

**Acceptance Criteria:**

- Given a user denies location permission, when they open browse, then a manual area/city selector is available instead of a blocked or empty screen.

#### FR-DISC-03 — Category and arrangement-type filters

| Actor(s)         | Priority |
| ---------------- | -------- |
| Youth Job-Seeker | Should   |

**Requirement:** The system shall allow filtering browse results by task category (FR-POST-02) and arrangement type, alongside the radius filter.

**Acceptance Criteria:**

- Given a user selects a category filter, when applied, then only postings matching that category are shown, combinable with radius and arrangement-type filters.

#### FR-DISC-04 — Keyword search

| Actor(s)         | Priority |
| ---------------- | -------- |
| Youth Job-Seeker | Could    |

**Requirement:** The system shall provide a basic keyword search matching against posting title and description, complementing (not replacing) the radius, category, and arrangement-type filters.

**Acceptance Criteria:**

- Given a keyword matches text in a posting's title or description, when searched, then that posting appears in results.

#### FR-DISC-05 — Sort order

| Actor(s)         | Priority |
| ---------------- | -------- |
| Youth Job-Seeker | Must     |

**Requirement:** The system shall sort browse results with urgent postings first, then by distance (closest first) as the default secondary sort, with recency and pay (high-to-low) available as alternate sort options.

**Acceptance Criteria:**

- Given a mix of urgent and non-urgent postings within radius, when browse loads with default sort, then urgent postings appear first, followed by non-urgent postings ordered nearest-first.
- Given the user switches sort to "Pay," when applied, then results reorder high-to-low by stated pay.

#### FR-DISC-06 — Saved/favorited gigs

| Actor(s)         | Priority |
| ---------------- | -------- |
| Youth Job-Seeker | Could    |

**Requirement:** The system shall allow a Youth Job-Seeker to bookmark a listing to a saved list, revisitable without re-searching.

**Acceptance Criteria:**

- Given a user bookmarks a posting, when they open their saved list later, then that posting appears there regardless of whether it still appears in default browse results.

#### FR-DISC-07 — Filter and sort persistence

| Actor(s) | Priority |
| -------- | -------- |
| System   | Could    |

**Requirement:** The system shall treat radius, category, and sort selections as session-only, resetting to defaults on app restart rather than persisting permanently.

**Acceptance Criteria:**

- Given a user sets a custom radius and sort order, when they fully close and reopen the app, then filters revert to default values.

### 3.5 FR-APPLY — Applying & Selection

#### FR-APPLY-01 — Listing detail view

| Actor(s)         | Priority |
| ---------------- | -------- |
| Youth Job-Seeker | Must     |

**Requirement:** The system shall show a worker viewing a listing: title, description, category, arrangement type, pay, general area, start time and urgency status, slot-fill status, and the Employer's trust signals (display name, business name/bio if applicable, verification badges).

**Acceptance Criteria:**

- Given a worker opens a listing detail view, when it renders, then all of the above fields are present, with location shown at general-area precision only (FR-POST-08).

#### FR-APPLY-02 — Apply action

| Actor(s)         | Priority |
| ---------------- | -------- |
| Youth Job-Seeker | Must     |

**Requirement:** The system shall present a single confirmation screen when a worker taps Apply, showing an optional note (pre-filled from profile bio per FR-PROF-04, editable, capped at 300 characters) and a Submit action. The system shall permit one application per worker per posting. On submission, the worker's application state shall become Pending.

**Acceptance Criteria:**

- Given a worker has already applied to a posting and not withdrawn, when they attempt to apply again, then the system blocks the duplicate application.
- Given the note field is left empty, when submitted, then the application still succeeds — the note is optional.
- Given a worker submits an application, when submission completes, then the application's state becomes Pending, matching the state that FR-APPLY-03 and FR-APPLY-09 assume it enters.

#### FR-APPLY-03 — Application withdrawal

| Actor(s)         | Priority |
| ---------------- | -------- |
| Youth Job-Seeker | Should   |

**Requirement:** The system shall allow a worker to withdraw their own Pending application at any time before selection or decline. A worker who withdraws shall be able to reapply while the posting remains Open.

**Acceptance Criteria:**

- Given a worker's application is still Pending, when they withdraw it, then the application is retracted and the slot pool no longer counts them.
- Given the posting is still Open after withdrawal, when the same worker applies again, then a new application is accepted.

#### FR-APPLY-04 — Applicant pool sort order

| Actor(s) | Priority |
| -------- | -------- |
| System   | Must     |

**Requirement:** The system shall sort the applicant pool for a posting into three tiers: (1) applicants with rating history, sorted by average rating descending then completion rate as tiebreaker; (2) zero-history applicants with an active endorsement, grouped; (3) zero-history applicants with no endorsement, at the bottom.

**Acceptance Criteria:**

- Given a pool with rated, endorsed-unrated, and unendorsed-unrated applicants, when displayed, then tier 1 (by rating) appears first, tier 2 (endorsed) next, tier 3 (unendorsed) last.
- Given two tier-1 applicants share the same average rating, when sorted, then the one with the higher completion rate ranks first.

#### FR-APPLY-05 — Employer applicant view

| Actor(s)                | Priority |
| ----------------------- | -------- |
| Local Business/Employer | Must     |

**Requirement:** The system shall show, for each applicant: display name, rating average and completion rate (or "New to YouthLink" plus endorsement badge if endorsed and zero-history), the applicant's note, and phone-verified status, with Select and Decline actions available.

**Acceptance Criteria:**

- Given an applicant has rating history, when the Employer views the pool, then average rating and completion rate are shown for that applicant.
- Given an applicant is zero-history and endorsed, when viewed, then "New to YouthLink" and the endorsement badge are shown instead.
- Given the Employer views any applicant, when displayed, then no individual dispute or case history is shown — only aggregate rating/completion stats.

#### FR-APPLY-06 — Selection and Engagement creation

| Actor(s)                | Priority |
| ----------------------- | -------- |
| Local Business/Employer | Must     |

**Requirement:** The system shall allow an Employer to select multiple applicants across one or more sessions, up to the number of workers needed. Each selection shall spawn one independent Engagement.

**Acceptance Criteria:**

- Given a posting with workers-needed of 3 and 0 selected, when the Employer selects 2 applicants in one session and 1 more later, then 3 independent Engagements exist, and the posting status updates accordingly.

#### FR-APPLY-07 — Contact reveal on selection

| Actor(s) | Priority |
| -------- | -------- |
| System   | Must     |

**Requirement:** The system shall, upon selection, reveal the Employer's and the selected worker's phone numbers to each other (bidirectional), and reveal the precise address (FR-POST-08) to that one selected worker only.

**Acceptance Criteria:**

- Given a worker is selected, when selection completes, then both parties' phone numbers become mutually visible and the precise address becomes visible to that worker alone — not to other applicants or browsers.
- Given a multi-slot posting has workers selected at different times, when each selection occurs, then contact reveal happens independently at that worker's own selection moment.

#### FR-APPLY-08 — Explicit decline

| Actor(s)                | Priority |
| ----------------------- | -------- |
| Local Business/Employer | Should   |

**Requirement:** The system shall allow an Employer to explicitly decline an applicant at any point, even with slots still open, triggering an immediate notification to that applicant.

**Acceptance Criteria:**

- Given an Employer declines an applicant, when the decline is submitted, then that applicant is notified immediately, regardless of remaining open slots.

#### FR-APPLY-09 — Automatic not-selected notification

| Actor(s) | Priority |
| -------- | -------- |
| System   | Must     |

**Requirement:** The system shall automatically notify any applicant still Pending once the posting reaches Filled status, without requiring an explicit Employer decline.

**Acceptance Criteria:**

- Given a posting reaches Filled status with Pending applicants remaining, when that status change occurs, then all remaining Pending applicants receive an automatic not-selected notification.

#### FR-APPLY-10 — Pending-applicant notification on material change

| Actor(s) | Priority |
| -------- | -------- |
| System   | Should   |

**Requirement:** The system shall notify any Pending applicant when the Employer edits the posting's material details, allowing the applicant to withdraw if the new terms no longer suit them.

**Acceptance Criteria:**

- Given a Pending applicant exists and the Employer changes pay or start time before selection, when the change is saved, then that applicant receives a notification of the change.

#### FR-APPLY-11 — No application cap

| Actor(s) | Priority                 |
| -------- | ------------------------ |
| System   | Must (design constraint) |

**Requirement:** The system shall impose no hard limit on the number of applicants a single posting can receive.

**Acceptance Criteria:**

- Given a posting has received a large number of applications, when a new worker applies, then the application is accepted regardless of pool size.

### 3.6 FR-ENG — Engagement Lifecycle

#### FR-ENG-01 — Check-in code checkpoints

| Actor(s)                                  | Priority |
| ----------------------------------------- | -------- |
| Local Business/Employer, Youth Job-Seeker | Must     |

**Requirement:** The system shall generate a distinct 6-digit numeric code for each of the arrival, completion, and payment checkpoints, each single-use and not interchangeable across checkpoints. The Employer shall hold and share the arrival and completion codes; the worker shall hold and share the payment code.

**Acceptance Criteria:**

- Given an Engagement reaches the arrival checkpoint, when the code is generated, then it is issued to the Employer, who provides it to the worker for entry.
- Given the completion checkpoint, when reached, then the same code-holder pattern applies (Employer holds, worker enters).
- Given the payment checkpoint, when reached, then the pattern flips (worker holds, Employer enters).
- Given a code from one checkpoint, when entry is attempted at a different checkpoint, then it is rejected as invalid.

#### FR-ENG-02 — Unpaid internship checkpoint exception

| Actor(s) | Priority |
| -------- | -------- |
| System   | Must     |

**Requirement:** The system shall omit the payment-confirmation checkpoint for Unpaid internships, applying only arrival and completion checkpoints.

**Acceptance Criteria:**

- Given an Engagement's arrangement type is Internship with pay type Unpaid, when the Engagement progresses, then no payment-confirmation checkpoint is presented.

#### FR-ENG-03 — Unable-to-confirm fallback

| Actor(s) | Priority |
| -------- | -------- |
| System   | Must     |

**Requirement:** The system shall provide an "unable to confirm" option at any checkpoint that routes the Engagement into dispute resolution (FR-DISPUTE-03) rather than leaving it stuck.

**Acceptance Criteria:**

- Given a code cannot be successfully exchanged at a checkpoint, when either party selects "unable to confirm," then a dispute case opens.

#### FR-ENG-04 — Per-Engagement checkpoint scoping

| Actor(s) | Priority |
| -------- | -------- |
| System   | Must     |

**Requirement:** The system shall scope all three checkpoint codes to the individual Engagement, not the Gig Posting — each selected worker on a multi-slot posting uses their own independent set of codes.

**Acceptance Criteria:**

- Given a multi-slot posting with 3 selected workers, when one worker's code exchange fails or escalates to dispute, then the other two workers' checkpoint progress is unaffected.

#### FR-ENG-05 — Cancellation (regular gig)

| Actor(s)                                  | Priority |
| ----------------------------------------- | -------- |
| Local Business/Employer, Youth Job-Seeker | Must     |

**Requirement:** The system shall let either party request cancellation of a not-yet-started regular Engagement, requiring a reason from a fixed list (Schedule conflict, Gig details no longer suitable, Found other work, Personal or family emergency, Other), with a 48-hour response window for the other party to accept or reject. No response within 48 hours shall auto-resolve against the non-responder. A cancellation submitted within 24 hours of start shall be classified Late.

**Acceptance Criteria:**

- Given a cancellation request is submitted with a reason from the fixed list, when sent, then the other party has 48 hours to accept or reject.
- Given no response arrives within 48 hours, when the window closes, then the request auto-resolves against whoever did not respond.
- Given a cancellation is submitted less than 24 hours before start, when classified, then it is marked Late.

#### FR-ENG-06 — Cancellation (urgent gig)

| Actor(s)                                  | Priority |
| ----------------------------------------- | -------- |
| Local Business/Employer, Youth Job-Seeker | Must     |

**Requirement:** The system shall apply cancellation on an urgent Engagement immediately, with no approval window, still requiring a reason from the fixed list. A cancellation submitted within 6 hours of start shall be classified Late.

**Acceptance Criteria:**

- Given a cancellation is submitted on an urgent Engagement, when sent, then it takes effect immediately without awaiting the other party's response.
- Given the cancellation is submitted less than 6 hours before start, when classified, then it is marked Late.

#### FR-ENG-07 — Completion-rate tracking

| Actor(s) | Priority |
| -------- | -------- |
| System   | Must     |

**Requirement:** The system shall track a completion-rate statistic separately from the star rating, reflecting reliability (cancellations, no-shows) as distinct from work quality. Late cancellations shall weigh more heavily against this stat than early ones.

**Acceptance Criteria:**

- Given a Late cancellation occurs, when the completion-rate stat recalculates, then it is weighted more heavily against the responsible party than an early cancellation would be.

#### FR-ENG-08 — Per-Engagement cancellation scope

| Actor(s) | Priority |
| -------- | -------- |
| System   | Must     |

**Requirement:** The system shall scope a cancellation to one Engagement only. On a multi-slot posting, one worker cancelling shall reopen that one slot and leave every other selected worker's Engagement untouched.

**Acceptance Criteria:**

- Given a 3-slot posting with 3 filled Engagements, when one is cancelled, then that slot reopens to Open status while the other 2 Engagements remain unaffected.

#### FR-ENG-09 — Material change re-confirmation

| Actor(s)                                  | Priority |
| ----------------------------------------- | -------- |
| Local Business/Employer, Youth Job-Seeker | Must     |

**Requirement:** The system shall classify a post-selection change as material (pay, start date/time, location, workers needed, or task category) or minor (title/description only). A material change shall require the affected worker's active re-confirmation, routing to cancellation (FR-ENG-05/06) if not accepted; a minor change shall require no re-confirmation.

**Acceptance Criteria:**

- Given the Employer changes pay on a posting with a selected worker, when saved, then that worker receives a re-confirmation request rather than a silent update.
- Given the worker does not accept the re-confirmation, when the response window closes, then the Engagement routes into the cancellation flow.
- Given the Employer edits only the description text, when saved, then no re-confirmation is triggered.

#### FR-ENG-10 — Urgency recomputation on time change

| Actor(s) | Priority |
| -------- | -------- |
| System   | Should   |

**Requirement:** The system shall recompute a posting's urgency status (FR-POST-07) whenever its start date/time is edited.

**Acceptance Criteria:**

- Given a posting's start time is edited such that it now falls within 24–48 hours of the original posting time, when saved, then urgency status updates to Urgent, and vice versa.

#### FR-ENG-11 — Multi-slot material change re-confirmation

| Actor(s) | Priority |
| -------- | -------- |
| System   | Must     |

**Requirement:** On a multi-slot posting, the system shall require independent re-confirmation from every currently-selected worker for a material change — each Engagement decides separately, and a worker who does not accept shall have only their own Engagement routed to cancellation. Slots not yet filled shall simply show the updated terms to new applicants, with nothing to re-confirm there.

**Acceptance Criteria:**

- Given a 3-slot posting with 3 selected workers and a material change is made, when saved, then each of the 3 workers independently receives a re-confirmation request.
- Given one worker declines re-confirmation, when their window closes, then only that worker's Engagement routes to cancellation — the other 2 remain active.
- Given a posting has unfilled slots when a material change is saved, when a new applicant views the posting, then they see the updated terms directly, with no re-confirmation step involved since they were never committed to the old terms.

#### FR-ENG-12 — Part-time End Engagement

| Actor(s)                                  | Priority |
| ----------------------------------------- | -------- |
| Local Business/Employer, Youth Job-Seeker | Must     |

**Requirement:** The system shall provide an End Engagement action, available to either party once a Part-time job Engagement is active (after the first day/shift has started). Triggering it shall prompt "did something go wrong?" — a "yes" answer shall route to dispute resolution (FR-DISPUTE-03) before anything else happens; a "no" answer shall proceed straight to the rating step (FR-RATE-01). The other party shall be notified immediately regardless of answer. No minimum duration shall be enforced before End Engagement can be used; an Engagement ended very soon after starting remains a visible data point in the completion-rate stats rather than being blocked outright. On a multi-slot Part-time posting, End Engagement shall act on one Engagement only, leaving every other selected worker's Engagement untouched.

**Acceptance Criteria:**

- Given a Part-time Engagement has started, when either party triggers End Engagement, then the "did something go wrong?" prompt is shown.
- Given the answer is "yes," when submitted, then a dispute case opens before rating becomes available.
- Given the answer is "no," when submitted, then the double-blind rating step opens for both parties.
- Given End Engagement is triggered before the arrangement has actually started, when attempted, then the system routes it to cancellation (FR-ENG-05/06) instead.
- Given an Engagement is ended shortly after it started, when checked, then the system does not block the action — it is simply reflected in the completion-rate stats.
- Given a multi-slot Part-time posting with 3 selected workers, when one worker's Engagement is ended, then the other 2 workers' Engagements continue on their own, independent timelines.

#### FR-ENG-13 — Stalled engagement handling

| Actor(s) | Priority |
| -------- | -------- |
| System   | Must     |

_Design note: this trigger is anchored to the posting's **start** time, not its end. No end time or duration is collected anywhere in the posting flow (FR-POST-01 ends at start date/time), so an end-anchored timer would reference a value the system never captures. One-off Gigs in the allow-listed categories are short by nature, which makes start-anchoring a safe proxy. The accepted trade-off is stated in the fourth acceptance criterion below._

**Requirement:** For Engagements on one-off Gig postings, the system shall issue an automatic prompt to both parties 24 hours after the posting's start date/time passes with the completion checkpoint still unresolved. If unresolved after a further 7 days of total silence from both sides, the system shall auto-flag the Engagement to Admin. This requirement does not apply to Part-time or Internship arrangements, which reach closure through End Engagement (FR-ENG-12) instead.

**Acceptance Criteria:**

- Given a Gig's start date/time passes with the completion checkpoint unresolved, when 24 hours elapse, then both parties receive an automatic "Did this happen?" prompt.
- Given no action is taken by either party for 7 days after that prompt, when that threshold passes, then the Engagement is auto-flagged to Admin as stalled.
- Given an Engagement on a Part-time or Internship posting, when its start date/time passes, then this mechanism does not apply to it.
- Given a one-off Gig that genuinely runs longer than 24 hours from its start, when the prompt fires while work is still in progress, then neither party is obliged to act and the Engagement continues normally — an accepted edge case of anchoring to start rather than end.

### 3.7 FR-RATE — Ratings & Reputation

#### FR-RATE-01 — Rating scale and submission

| Actor(s)                                  | Priority |
| ----------------------------------------- | -------- |
| Local Business/Employer, Youth Job-Seeker | Must     |

**Requirement:** The system shall accept ratings as 1 to 5 whole stars only, with no accompanying free-text review field.

**Acceptance Criteria:**

- Given a rating is submitted, when validated, then only integer values 1 through 5 are accepted, and no free-text field is presented as part of the rating itself.

#### FR-RATE-02 — Double-blind submission

| Actor(s) | Priority |
| -------- | -------- |
| System   | Must     |

**Requirement:** The system shall withhold each party's rating from the other until both have submitted, or until 14 days pass since eligibility, whichever comes first.

**Acceptance Criteria:**

- Given only one party has submitted a rating, when the other party views it, then it remains hidden until they also submit or 14 days elapse.
- Given both parties have submitted, when the second submission completes, then both ratings become visible to both parties simultaneously.
- Given 14 days pass with only one rating submitted, when the window closes, then whatever rating(s) exist become visible.

#### FR-RATE-03 — Completion-rate as a distinct stat

| Actor(s) | Priority |
| -------- | -------- |
| System   | Must     |

**Requirement:** The system shall maintain completion rate as a statistic distinct from the star rating, capturing reliability separately from work quality.

**Acceptance Criteria:**

- Given a user's profile is viewed, when displayed, then average star rating and completion rate appear as two separate figures, not combined into one.

#### FR-RATE-04 — Per-Engagement independent ratings

| Actor(s) | Priority |
| -------- | -------- |
| System   | Must     |

**Requirement:** The system shall produce one independent double-blind rating pair per Engagement — a multi-slot posting generates one separate rating exchange per selected worker, not one combined rating for the posting.

**Acceptance Criteria:**

- Given a 3-slot Gig with 3 completed Engagements, when ratings are submitted, then 3 separate double-blind rating exchanges occur, each revealed on its own timeline.

#### FR-RATE-05 — Rating applicability by Engagement outcome

| Actor(s) | Priority |
| -------- | -------- |
| System   | Must     |

**Requirement:** The system shall apply the same rating mechanism identically to completed Gigs and ended Part-time Engagements. For cancelled (not completed) Engagements, rating shall remain available but not enforced the same way.

**Acceptance Criteria:**

- Given a Gig completes via check-in codes or a Part-time Engagement ends via End Engagement with no issue, when either occurs, then the standard double-blind rating step opens identically.
- Given an Engagement is cancelled before completion, when checked, then rating is optionally available but the system does not enforce or prompt for it the same way.

#### FR-RATE-06 — Rating disputes

| Actor(s)                                                    | Priority |
| ----------------------------------------------------------- | -------- |
| Local Business/Employer, Youth Job-Seeker, Moderator, Admin | Should   |

**Requirement:** The system shall allow a rated party to post a public response visible alongside a revealed rating they consider unfair. Outright removal of a rating shall be reserved for Admin-adjudicated clear policy violations, not ordinary disagreement. This path shall be entirely separate from the Moderator-triage dispute pipeline (FR-DISPUTE-03 onward) — a rating-fairness dispute never routes through it; only a clear-policy-violation removal reaches Admin, and it does so directly, not via Moderator escalation.

**Acceptance Criteria:**

- Given a rating is revealed, when the rated party disagrees, then they can attach a public response visible alongside it, without needing Admin involvement.
- Given a rating is reported as a clear policy violation (e.g., on an engagement that never happened), when Admin reviews it, then Admin can remove it; ordinary "unfair but accurate" disagreement is not grounds for removal.
- Given a rating-fairness disagreement, when it occurs, then it never creates a case in the Moderator dispute queue (FR-DASH-03) — only a policy-violation removal request reaches Admin, and directly rather than via Moderator escalation.

### 3.8 FR-ENDORSE — Community Endorsement

#### FR-ENDORSE-01 — Verifier role selection

| Actor(s)                    | Priority |
| --------------------------- | -------- |
| Community Verifier/Endorser | Must     |

**Requirement:** The system shall allow a user to select Community Verifier/Endorser as their role at signup, with no eligibility gate beyond the standard 18-plus rule (FR-ACC-03).

**Acceptance Criteria:**

- Given a new user selects Community Verifier/Endorser at signup, when they meet the age gate, then no additional vetting step is required before the role is active.

#### FR-ENDORSE-02 — Worker-initiated endorsement entry point

| Actor(s)                                      | Priority |
| --------------------------------------------- | -------- |
| Youth Job-Seeker, Community Verifier/Endorser | Must     |

**Requirement:** The system shall generate a persistent, shareable 6-character code for each zero-history worker, visible on their own profile while eligible, shareable via the phone's native share sheet. A recipient shall install the app through the standard app-store link, sign up, select Community Verifier as their role, and enter the code; the system shall validate the worker's continued eligibility before accepting the vouch.

**Acceptance Criteria:**

- Given a zero-history worker's profile, when viewed by that worker, then their 6-character endorsement code is visible and shareable via the OS share sheet.
- Given a recipient enters a valid code after registering as Verifier, when the worker is still eligible (zero rating history), then the vouch is accepted.
- Given the worker has since acquired a rating (no longer eligible), when the code is entered, then the vouch is rejected.

#### FR-ENDORSE-03 — Verifier-initiated endorsement entry point

| Actor(s)                    | Priority |
| --------------------------- | -------- |
| Community Verifier/Endorser | Must     |

**Requirement:** The system shall allow an already-registered Verifier to search for a specific youth by phone number. If a matching, currently-eligible Youth Job-Seeker account exists, the Verifier may submit the vouch directly. If no eligible match is found, the system shall return a deliberately generic "no eligible match found" response, without distinguishing "no such account" from "an account exists but isn't eligible."

**Acceptance Criteria:**

- Given a Verifier searches a phone number matching an eligible zero-history worker, when found, then the Verifier can submit a vouch directly, no code required.
- Given a Verifier searches a phone number with no account, or an account that is not eligible, when searched, then the same generic "no eligible match found" message is returned in both cases.

#### FR-ENDORSE-04 — Vouch action

| Actor(s)                    | Priority |
| --------------------------- | -------- |
| Community Verifier/Endorser | Must     |

**Requirement:** The system shall accept a vouch as a single "I vouch for this person" action plus an optional reason, capped at 300 characters, live immediately upon submission with no Admin pre-review.

**Acceptance Criteria:**

- Given a Verifier submits a vouch via either entry point (FR-ENDORSE-02 or FR-ENDORSE-03), when submitted, then it becomes visible immediately, with no pending-review state.

#### FR-ENDORSE-05 — Eligibility window

| Actor(s) | Priority |
| -------- | -------- |
| System   | Must     |

**Requirement:** The system shall define endorsement eligibility as zero completed, rated Engagements, closing permanently — not reopening — the moment the worker's first rating lands.

**Acceptance Criteria:**

- Given a worker receives their first rating, when it is recorded, then their endorsement eligibility closes permanently, even if their history later returns to zero engagements through account changes.

#### FR-ENDORSE-06 — Endorsement coverage across applications

| Actor(s) | Priority |
| -------- | -------- |
| System   | Must     |

**Requirement:** The system shall apply one active endorsement to every application a zero-history worker submits while still zero-history, rather than requiring a fresh endorsement per gig.

**Acceptance Criteria:**

- Given an endorsed zero-history worker applies to multiple postings, when their applicant-pool tier is computed (FR-APPLY-04), then all applications place them in tier 2 without needing a separate endorsement per posting.

#### FR-ENDORSE-07 — Endorsement revocation

| Actor(s)                    | Priority |
| --------------------------- | -------- |
| Community Verifier/Endorser | Should   |

**Requirement:** The system shall allow a Verifier to revoke their own endorsement, stopping it from displaying going forward without undoing effects that already occurred while it was live.

**Acceptance Criteria:**

- Given a Verifier revokes an endorsement, when the revocation is submitted, then the endorsement badge no longer displays on the worker's profile going forward; any hire that already occurred while it was active is unaffected.

#### FR-ENDORSE-08 — Uncapped endorsements per worker

| Actor(s) | Priority |
| -------- | -------- |
| System   | Should   |

**Requirement:** The system shall not limit the number of Verifiers who can endorse the same worker.

**Acceptance Criteria:**

- Given a worker already has one active endorsement, when a second Verifier submits a vouch for the same worker, then it is accepted alongside the first.

#### FR-ENDORSE-09 — Endorsement notification to worker

| Actor(s) | Priority |
| -------- | -------- |
| System   | Should   |

**Requirement:** The system shall notify the endorsed worker whenever an endorsement is submitted for them, regardless of which entry point produced it.

**Acceptance Criteria:**

- Given a vouch is submitted via either FR-ENDORSE-02 or FR-ENDORSE-03, when it completes, then the endorsed worker receives a notification.

#### FR-ENDORSE-10 — Endorsement display

| Actor(s) | Priority |
| -------- | -------- |
| System   | Must     |

**Requirement:** The system shall display an active endorsement as a real, named badge — the Verifier's actual name attached — never anonymous.

**Acceptance Criteria:**

- Given an active endorsement is displayed on a worker's profile or applicant card, when rendered, then the endorsing Verifier's real name is shown alongside it.

#### FR-ENDORSE-11 — Verifier track record

| Actor(s)                    | Priority |
| --------------------------- | -------- |
| Community Verifier/Endorser | Must     |

**Requirement:** The system shall display a Verifier's track record as "N endorsed, M went on to build a good rating," where N is the count of the Verifier's currently-active (non-revoked) endorsements, and M is the count of those N whose endorsed worker currently has at least one completed rated Engagement and a current average rating of 4.0 or higher. This figure shall be live and recalculated, not a one-time snapshot.

**Acceptance Criteria:**

- Given a Verifier's endorsed worker's average rating later drops below 4.0, when recalculated, then that worker no longer counts toward M.
- Given a freshly-endorsed worker has not yet earned a rating, when M is computed, then they do not count toward M yet.
- Given a Verifier revokes an endorsement, when N recalculates, then that endorsement no longer counts toward N.

#### FR-ENDORSE-12 — Endorsement payoff notification

| Actor(s)                    | Priority |
| --------------------------- | -------- |
| Community Verifier/Endorser | Should   |

**Requirement:** The system shall notify a Verifier when someone they endorsed completes their first rated Engagement with an average rating of 4.0 or higher.

**Acceptance Criteria:**

- Given an endorsed worker's first rated Engagement completes at or above a 4.0 average, when that rating is finalized, then the endorsing Verifier(s) receive a notification.

#### FR-ENDORSE-13 — Bio prompt for zero-history workers

| Actor(s)         | Priority |
| ---------------- | -------- |
| Youth Job-Seeker | Could    |

**Requirement:** The system shall show a one-time prompt, after signup or before a zero-history worker's first application, suggesting they add a bio. The prompt shall not recur once the bio is filled in or the worker has rating history.

**Acceptance Criteria:**

- Given a zero-history worker with no bio approaches their first application, when the application flow starts, then the one-time bio prompt is shown.
- Given the bio is subsequently filled in, when the worker returns, then the prompt does not show again.

#### FR-ENDORSE-14 — Endorsement-seeking suggestion

| Actor(s)         | Priority |
| ---------------- | -------- |
| Youth Job-Seeker | Could    |

**Requirement:** The system shall show a zero-history worker a one-time suggestion to seek an endorsement, with a direct link into the endorsement flow, after 3 applications with no selection.

**Acceptance Criteria:**

- Given a zero-history, unendorsed worker has submitted 3 applications with no selection, when the 3rd unselected outcome is reached, then the one-time suggestion with a direct link is shown.

#### FR-ENDORSE-15 — Verifier code-entry prompt

| Actor(s)                    | Priority |
| --------------------------- | -------- |
| Community Verifier/Endorser | Should   |

**Requirement:** The system shall show a newly-registered Verifier a direct "Have a code to enter?" prompt during or immediately after signup.

**Acceptance Criteria:**

- Given a user completes signup with role Community Verifier/Endorser, when signup finishes, then the code-entry prompt is shown directly, not buried in a settings menu.

### 3.9 FR-DISPUTE — Disputes & Reporting

#### FR-DISPUTE-01 — Report action

| Actor(s)        | Priority |
| --------------- | -------- |
| All actor types | Must     |

**Requirement:** The system shall provide a Report action on listings, profiles, and within an active Engagement, requiring a reason from a fixed list (fraud/scam, inappropriate content, safety concern, harassment, other) plus optional detail. The reporter shall remain anonymous to the reported party.

**Acceptance Criteria:**

- Given a user submits a report, when submitted, then a reason from the fixed list is required and the reported party cannot see who reported them.

#### FR-DISPUTE-02 — Report threshold and auto-hide

| Actor(s) | Priority |
| -------- | -------- |
| System   | Must     |

**Requirement:** The system shall queue a single report for Moderator review without auto-hiding the reported content. Three independent reports on the same content shall auto-hide it pending review.

**Acceptance Criteria:**

- Given one report is filed against a listing, when submitted, then the listing remains visible and the report queues for review.
- Given a third independent report is filed against the same content, when submitted, then the content is automatically hidden pending Moderator review.

#### FR-DISPUTE-03 — Dispute entry points

| Actor(s) | Priority |
| -------- | -------- |
| System   | Must     |

**Requirement:** The system shall open a dispute case from any of four entry points: an "unable to confirm" during a checkpoint code exchange (FR-ENG-03); a "yes" to "did something go wrong?" during End Engagement (FR-ENG-12); an auto-flagged stalled Engagement (FR-ENG-13); or a Report reaching Moderator's queue (FR-DISPUTE-01), which may not be tied to a specific Engagement.

**Acceptance Criteria:**

- Given any of the four trigger conditions occurs, when it fires, then a dispute case is created and enters the review pipeline.

#### FR-DISPUTE-04 — Response window and evidence

| Actor(s)                                  | Priority |
| ----------------------------------------- | -------- |
| Local Business/Employer, Youth Job-Seeker | Must     |

**Requirement:** The system shall give whichever party did not raise the dispute a 48-hour window to respond and attach evidence (FR-DISPUTE-05). If no response arrives within the window, review shall proceed on whatever evidence is available.

**Acceptance Criteria:**

- Given a dispute is opened, when the non-raising party has not responded after 48 hours, then Moderator review proceeds using only the evidence submitted so far.

#### FR-DISPUTE-05 — Evidence upload

| Actor(s)                                  | Priority |
| ----------------------------------------- | -------- |
| Local Business/Employer, Youth Job-Seeker | Should   |

**Requirement:** The system shall allow either party in a dispute to optionally attach up to 3 images, 5MB each, as supporting evidence, visible to Admin/Moderator during review.

**Acceptance Criteria:**

- Given a party attempts to attach a 4th image or a file exceeding 5MB, when attempted, then the system blocks it.
- Given no evidence is attached, when the dispute proceeds, then this does not block review — evidence is optional.

#### FR-DISPUTE-06 — Discovered false birthdate

| Actor(s) | Priority |
| -------- | -------- |
| Admin    | Must     |

**Requirement:** The system shall treat a discovered false birthdate (a user under 18 who lied past the age gate, FR-ACC-03) as a Report routed to Admin, resulting in account suspension — with no correction path, since the person is not eligible for the platform at all.

**Acceptance Criteria:**

- Given a report alleges a user is under 18 despite passing the age gate, when Admin confirms this, then the account is suspended rather than offered a correction option.

### 3.10 FR-MOD — Moderator Functions

_Moderator handles high-volume, lower-stakes work. Every requirement below is Moderator-exclusive; shared dashboard infrastructure is in FR-DASH (§3.12), and Admin's higher-stakes actions are in FR-ADM (§3.11)._

#### FR-MOD-01 — Dispute case triage

| Actor(s)  | Priority |
| --------- | -------- |
| Moderator | Must     |

**Requirement:** The system shall allow a Moderator to review an opened dispute case — case type, both parties' evidence, the Engagement's code-exchange history, and both parties' verification badges and history — and either close it with a warning or escalate it to Admin.

**Acceptance Criteria:**

- Given a new dispute case is opened, when it reaches the queue, then the Moderator can view case type, submitted evidence, code-exchange history, and both parties' verification/history in one place.
- Given the Moderator judges the issue minor or first-time, when they close it, then a warning is recorded against the responsible party.
- Given the Moderator judges the issue requires real authority, when reviewed, then they escalate it to Admin rather than ruling themselves.

#### FR-MOD-02 — Warning threshold and auto-escalation

| Actor(s) | Priority |
| -------- | -------- |
| System   | Must     |

**Requirement:** The system shall auto-escalate to Admin for a suspension review when the same party accumulates 3 warnings within a rolling 90-day period.

**Acceptance Criteria:**

- Given a party's 3rd warning is recorded within the same rolling 90-day window as the prior two, when recorded, then the account is automatically escalated to Admin for suspension review.

#### FR-MOD-03 — Mid-review clarification request

| Actor(s)  | Priority |
| --------- | -------- |
| Moderator | Should   |

**Requirement:** The system shall allow a Moderator to request specific additional information from either party during dispute review, with its own 24-hour response window, before proceeding to a decision.

**Acceptance Criteria:**

- Given a Moderator requests clarification, when submitted, then the requested party has 24 hours to respond before the Moderator's decision proceeds.

#### FR-MOD-04 — Flagged content review

| Actor(s)  | Priority |
| --------- | -------- |
| Moderator | Must     |

**Requirement:** The system shall allow a Moderator to review flagged listings and profiles as part of routine triage, independent of a specific dispute case.

**Acceptance Criteria:**

- Given content is auto-hidden by the 3-report threshold (FR-DISPUTE-02), when it appears in Moderator's queue, then the Moderator can review and act on it directly.

### 3.11 FR-ADM — Admin Functions

_Admin handles lower-volume, higher-stakes, harder-to-reverse actions. Every requirement below is Admin-exclusive._

#### FR-ADM-01 — Final dispute ruling

| Actor(s) | Priority |
| -------- | -------- |
| Admin    | Must     |

**Requirement:** The system shall allow Admin to close an escalated dispute case with exactly one of three outcomes: ruled for the party who raised the issue, ruled for the other party, or ruled inconclusive.

**Acceptance Criteria:**

- Given a case has been escalated to Admin, when Admin submits a ruling, then exactly one of the three outcomes is recorded and the case status changes to Resolved.
- Given a ruling has been recorded, when any user attempts to appeal it, then the system provides no appeal mechanism — the ruling stays final.

#### FR-ADM-02 — Payment-dispute ruling scope

| Actor(s) | Priority |
| -------- | -------- |
| Admin    | Must     |

**Requirement:** For a payment dispute, the system shall limit Admin's ruling to a reputational and record-keeping outcome — updating the responsible party's completion-rate stat — since no in-app payment exists and Admin cannot issue a refund or force a transaction.

**Acceptance Criteria:**

- Given Admin rules on a payment dispute, when the ruling is recorded, then only the completion-rate stat changes — no refund, transfer, or financial action is triggered by the system.

#### FR-ADM-03 — Account suspension

| Actor(s) | Priority |
| -------- | -------- |
| Admin    | Must     |

**Requirement:** The system shall allow Admin to suspend or restrict an account for policy violations, with the suspension taking effect immediately — rejecting the account's next action or in-progress session on its next request, not waiting for next login.

**Acceptance Criteria:**

- Given Admin suspends an account, when that account's current session makes its next request, then the request is rejected.
- Given a suspended account attempts to apply to a gig, post a gig, or submit an endorsement, when attempted, then the action is blocked.
- Given a suspended account has existing, already-agreed Engagements with uninvolved parties, when checked, then those Engagements are not automatically cancelled — they proceed through normal resolution mechanisms.

#### FR-ADM-04 — Verification-document review (future-contingent)

| Actor(s) | Priority           |
| -------- | ------------------ |
| Admin    | Won't (this build) |

**Requirement:** The system shall support Admin review and confirmation of submitted identity/verification documents once a fuller PCC/NIC-KYC verification layer is built — not present, and not assumed present, in this MVP build.

**Acceptance Criteria:**

- Given the current build has no real KYC/PCC verification service integrated, when Admin's dashboard is reviewed, then no document-review function is expected to exist for this phase.

#### FR-ADM-05 — Posting removal

| Actor(s) | Priority |
| -------- | -------- |
| Admin    | Must     |

**Requirement:** The system shall allow Admin to remove a policy-violating posting. Removal shall stop new applications; Engagements already in progress on that posting shall not be automatically voided unless the violation is severe enough to warrant reviewing those specific Engagements through the normal dispute process.

**Acceptance Criteria:**

- Given Admin removes a posting, when removal completes, then it disappears from active browse/search and can no longer receive new applications.
- Given the removed posting has active Engagements, when checked, then those Engagements continue toward normal completion, cancellation, or dispute — not automatically voided.

#### FR-ADM-06 — Admin/Moderator account bootstrapping

| Actor(s) | Priority |
| -------- | -------- |
| Admin    | Must     |

**Requirement:** The system shall create the first Admin/Moderator accounts via direct backend assignment (Phase 1). Once at least one Admin account exists, the system shall allow an existing Admin to promote an already-registered user to Admin or Moderator directly from the web dashboard (Phase 2), with no separate onboarding flow needed.

**Acceptance Criteria:**

- Given no Admin account yet exists, when the system is first deployed, then the first Admin account(s) are created by direct backend assignment, not an in-app flow.
- Given at least one Admin account exists, when that Admin promotes a registered user, then the promoted user gains Admin or Moderator access without a separate onboarding sequence.

#### FR-ADM-07 — Separate Admin/Moderator accounts

| Actor(s) | Priority |
| -------- | -------- |
| System   | Must     |

**Requirement:** The system shall treat Admin/Moderator accounts as distinct from any normal actor-type account for the same person, rather than a flag layered onto an existing Youth Job-Seeker/Employer/Verifier account.

**Acceptance Criteria:**

- Given a founding team member wants to use the app both as Admin and as a Youth Job-Seeker for testing, when both roles are needed, then two separate accounts are required — the same login credentials cannot carry both permission sets on one account.

#### FR-ADM-08 — Dispute ruling's effect on the rating step

| Actor(s) | Priority |
| -------- | -------- |
| System   | Must     |

**Requirement:** Following an Admin ruling, if the ruling establishes that the Engagement genuinely happened and was completed, the system shall proceed to the standard double-blind rating step (FR-RATE-02) as normal. If the ruling establishes that it did not happen at all (a confirmed genuine no-show), the system shall skip the standard bilateral rating entirely — the reliable party shall receive a positive completion-rate credit, the unreliable party a negative mark, and the case shall close without a rating exchange.

**Acceptance Criteria:**

- Given Admin's ruling confirms the Engagement happened and was completed, when the ruling is recorded, then the standard double-blind rating step opens for both parties as normal.
- Given Admin's ruling confirms a genuine no-show (the Engagement did not happen at all), when the ruling is recorded, then no rating step opens — the reliable party's completion-rate stat receives a positive credit, the unreliable party's a negative mark, and the case closes.

### 3.12 FR-DASH — Shared Dashboard Infrastructure

_Read access below is shared by Moderator and Admin; write and action privileges stay split exactly as FR-MOD and FR-ADM describe._

#### FR-DASH-01 — Full postings visibility

| Actor(s)         | Priority |
| ---------------- | -------- |
| Moderator, Admin | Must     |

**Requirement:** The system shall give both Moderator and Admin full, searchable, filterable visibility into every posting on the platform (status, category, arrangement type, employer, date), independent of whether an active case exists — but restrict direct removal to Admin (FR-ADM-05).

**Acceptance Criteria:**

- Given a Moderator or Admin is on the dashboard, when they search or filter postings by status, category, arrangement type, employer, or date, then matching results return regardless of report status.
- Given a Moderator attempts to remove a posting directly from this view, when they act, then the system blocks the action and requires escalation to Admin instead.

#### FR-DASH-02 — Full user-account visibility

| Actor(s)         | Priority |
| ---------------- | -------- |
| Moderator, Admin | Must     |

**Requirement:** The system shall give both Moderator and Admin full visibility into any user account — verification status, rating/completion history, endorsement activity (given or received), and full case history including past resolved disputes and accumulated warnings — as an explicit, stated exception to the no-general-directory rule (FR-PROF-05), justified by Admin/Moderator's oversight function.

**Acceptance Criteria:**

- Given either role opens a user account from the dashboard, when viewed, then verification status, rating/completion history, endorsement activity, and full case history (not just currently active cases) are all visible.
- Given a Moderator attempts to suspend an account or approve verification directly from this view, when they act, then the system blocks the action and requires Admin instead.

#### FR-DASH-03 — Case queue

| Actor(s)         | Priority |
| ---------------- | -------- |
| Moderator, Admin | Must     |

**Requirement:** The system shall present a case queue showing case type, involved parties, evidence submitted by each side, timestamps, and current status (awaiting response / under review / resolved). The system shall notify Admin/Moderator when a new case is created.

**Acceptance Criteria:**

- Given a dispute case exists, when the queue is viewed, then case type, parties, evidence, timestamps, and status are all shown without needing to reconstruct context elsewhere.
- Given a new case is created, when it enters the queue, then Admin/Moderator receive a notification — the same pattern as a new application notifying an Employer.

#### FR-DASH-04 — Metrics dashboard

| Actor(s)         | Priority |
| ---------------- | -------- |
| Moderator, Admin | Should   |

**Requirement:** The system shall provide a metrics view, viewable and exportable in basic form, showing: counts of active users by actor type, postings by status, completed Engagements, open case-queue depth, average dispute resolution time (measured against the 3–5 day soft target, NFR-OPS-03), platform-wide average rating and completion rate, endorsement activity (how many endorsements have been given, and how many endorsed workers went on to build a genuinely good rating), and a category breakdown of postings.

**Acceptance Criteria:**

- Given the metrics view is opened, when it loads, then all of the listed figures are present and reflect current platform state.
- Given a basic export is requested, when triggered, then the current metrics are exportable in a basic format (e.g., CSV).

#### FR-DASH-05 — Mobile/dashboard case-surface split

| Actor(s) | Priority |
| -------- | -------- |
| System   | Must     |

**Requirement:** The system shall keep case-creation actions (Report, unable-to-confirm, "did something go wrong?") on the mobile app as ordinary user actions, while restricting all case-handling actions (queue access, evidence review, warnings, rulings) to the web dashboard exclusively.

**Acceptance Criteria:**

- Given a user wants to report content or flag a checkpoint issue, when they act, then they do so from the mobile app.
- Given Admin or Moderator wants to review or act on a case, when they attempt to do so from the mobile app, then no such function exists there — only on the web dashboard.

#### FR-DASH-06 — Dashboard authentication

| Actor(s)         | Priority |
| ---------------- | -------- |
| Moderator, Admin | Must     |

**Requirement:** The system shall require both password and OTP together for dashboard login (not either-or, unlike the mobile app's two independent paths per FR-ACC-07), reusing the same backend and account credentials as the mobile app.

**Acceptance Criteria:**

- Given an Admin or Moderator attempts dashboard login with only a password or only an OTP, when submitted, then login is rejected — both are required together.
- Given both password and OTP are correctly provided, when submitted, then dashboard login succeeds using the same account credentials as the mobile app.

### 3.13 FR-NOTIF — Notifications

#### FR-NOTIF-01 — Urgent gig push notifications

| Actor(s)         | Priority |
| ---------------- | -------- |
| Youth Job-Seeker | Must     |

**Requirement:** The system shall send a proactive push notification to opted-in youth within the search radius when a matching gig is urgent (FR-POST-07), rate-limited to 5 pushes per user per day, with anything beyond that batched into a single digest.

**Acceptance Criteria:**

- Given an opted-in youth is within radius of a newly-posted urgent gig, when it goes live, then they receive a proactive push.
- Given a youth has already received 5 urgent pushes that day, when a 6th matching urgent gig is posted, then it is queued into a batched digest rather than sent individually.
- Given a youth has not opted in, when an urgent gig matches them, then they see the urgent label in-app but receive no proactive push.

#### FR-NOTIF-02 — Non-urgent gig notifications

| Actor(s)         | Priority |
| ---------------- | -------- |
| Youth Job-Seeker | Must     |

**Requirement:** The system shall send an opt-out-by-default "new gig posted" notification to youth within radius for non-urgent postings, filtered by the same radius mechanism as urgent notifications.

**Acceptance Criteria:**

- Given a youth has not opted out, when a non-urgent posting matches their radius, then they receive the standard notification.
- Given a youth has opted out, when a non-urgent posting matches, then no notification is sent.

#### FR-NOTIF-03 — Notification preferences

| Actor(s)         | Priority |
| ---------------- | -------- |
| Youth Job-Seeker | Must     |

**Requirement:** The system shall house both notification toggles — opt-in to urgent-gig alerts, opt-out of general new-gig notifications — in a Notification Preferences section within Settings (FR-ACC-18).

**Acceptance Criteria:**

- Given a user opens Notification Preferences, when it loads, then both the urgent opt-in toggle and the general opt-out toggle are present and independently controllable.

#### FR-NOTIF-04 — Application-related notifications

| Actor(s)                                  | Priority |
| ----------------------------------------- | -------- |
| Local Business/Employer, Youth Job-Seeker | Must     |

**Requirement:** The system shall notify an Employer when a new application arrives, and notify a worker on selection, decline, or automatic not-selected status (FR-APPLY-06, FR-APPLY-08, FR-APPLY-09).

**Acceptance Criteria:**

- Given a worker submits an application, when submitted, then the Employer receives a notification.
- Given a worker is selected, declined, or reaches automatic not-selected status, when that state change occurs, then the worker is notified accordingly.

#### FR-NOTIF-05 — Engagement-related notifications

| Actor(s)                                  | Priority |
| ----------------------------------------- | -------- |
| Local Business/Employer, Youth Job-Seeker | Must     |

**Requirement:** The system shall notify the relevant party for material-change proposals (FR-ENG-09), End Engagement triggers (FR-ENG-12), and stalled-engagement prompts (FR-ENG-13).

**Acceptance Criteria:**

- Given a material change is proposed, when saved, then the affected worker is notified.
- Given End Engagement is triggered, when submitted, then the other party is notified immediately regardless of the "did something go wrong?" answer.
- Given a stalled-engagement prompt fires, when triggered, then both parties are notified.

#### FR-NOTIF-06 — Dispute/case notifications

| Actor(s)         | Priority |
| ---------------- | -------- |
| Moderator, Admin | Must     |

**Requirement:** The system shall notify Admin/Moderator when a new dispute case is created (FR-DASH-03).

**Acceptance Criteria:**

- Given a new dispute case is created via any of the four entry points (FR-DISPUTE-03), when created, then Admin/Moderator receive a notification.

#### FR-NOTIF-07 — Endorsement notifications

| Actor(s)                                      | Priority |
| --------------------------------------------- | -------- |
| Youth Job-Seeker, Community Verifier/Endorser | Should   |

**Requirement:** The system shall notify a worker when they receive an endorsement (FR-ENDORSE-09) and notify a Verifier when their endorsement "pays off" (FR-ENDORSE-12).

**Acceptance Criteria:**

- Given an endorsement is submitted, when it completes, then the worker is notified.
- Given an endorsed worker's first rated Engagement reaches ≥4.0, when finalized, then the Verifier is notified.

#### FR-NOTIF-08 — In-app notification history

| Actor(s)        | Priority |
| --------------- | -------- |
| All actor types | Could    |

**Requirement:** The system shall provide a dedicated notifications screen showing a chronological log of past pushes (urgent alerts, application updates, dispute activity), so nothing meaningful is lost if a push is dismissed or missed.

**Acceptance Criteria:**

- Given a user dismisses or misses a push notification, when they open the notification history screen, then that notification's content is still retrievable there.

#### FR-NOTIF-09 — Notification permission handling

| Actor(s) | Priority |
| -------- | -------- |
| System   | Must     |

**Requirement:** The system shall function without breaking core functionality when a user denies OS-level push notification permission — the in-app notification history (FR-NOTIF-08) shall still function, so the user checks manually instead of being notified proactively.

**Acceptance Criteria:**

- Given a user denies push notification permission, when a notifiable event occurs, then no push is delivered, but the event still appears in the in-app notification history.

#### FR-NOTIF-10 — Distinct treatment for urgent vs. regular notifications

| Actor(s)         | Priority |
| ---------------- | -------- |
| Youth Job-Seeker | Should   |

**Requirement:** The system shall deliver urgent and regular gig notifications through a distinct notification channel or priority level (e.g., a dedicated Android notification channel, iOS time-sensitive notifications) so the two feel different at the moment they arrive, not only once opened and read.

**Acceptance Criteria:**

- Given an urgent gig notification and a regular gig notification are both delivered, when either arrives, then they use different platform-level notification channels or priority settings, not merely different label text inside the same channel.

---

## 4. Non-Functional Requirements

_For NFRs, the Metric/Acceptance Criteria field is combined into one — where the source document gives an exact number, that number is the acceptance criterion, so a separate metric column would only repeat it. Left unstated rather than invented wherever the source doesn't specify one._

### 4.1 NFR-SEC — Security

#### NFR-SEC-01 — Password hashing

| Priority |
| -------- |
| Must     |

**Requirement:** The system shall hash all passwords using bcrypt or argon2. Passwords shall never be stored in plaintext or in a reversibly-encrypted form.

**Acceptance Criteria:** Given the password database is inspected, when checked, then no plaintext or reversibly-encrypted password value is present — only bcrypt or argon2 hashes.

#### NFR-SEC-02 — Login rate-limiting

| Priority |
| -------- |
| Must     |

**Requirement:** The system shall lock an account's password-login path for 15 minutes after 5 consecutive failed attempts.

**Acceptance Criteria:** Given 5 consecutive failed password attempts, when the 5th occurs, then the password path is locked for exactly 15 minutes before another attempt is permitted.

#### NFR-SEC-03 — NIC data protection

| Priority |
| -------- |
| Must     |

**Requirement:** The system shall encrypt NIC numbers at rest, restrict visibility to Admin only, and mask the value back to the entering user after initial entry (last 4 digits only).

**Acceptance Criteria:** Given an NIC value is stored, when the database is inspected, then it is encrypted at rest. Given a user views their own submitted NIC afterward, when displayed, then only the last 4 digits are shown unmasked.

#### NFR-SEC-04 — Dashboard two-factor authentication

| Priority |
| -------- |
| Must     |

**Requirement:** The system shall require both password and OTP together for any Admin/Moderator dashboard login, given the dashboard is a higher-value target with simultaneous access to every user's NIC and every dispute's evidence.

**Acceptance Criteria:** See FR-DASH-06.

#### NFR-SEC-05 — Role-based access control

| Priority |
| -------- |
| Must     |

**Requirement:** The system shall enforce role-based access control distinguishing ordinary users from Admin/Moderator, and Admin from Moderator, such that Moderator cannot perform Admin-exclusive actions (FR-ADM-01 through FR-ADM-07).

**Acceptance Criteria:** Given a Moderator account attempts an Admin-exclusive action (final ruling, suspension, posting removal, verification approval), when attempted, then the system blocks it.

#### NFR-SEC-06 — Audit logging of privileged actions

| Priority |
| -------- |
| Must     |

**Requirement:** The system shall log every Admin and Moderator action, with the full log visible to every Admin account (not just the acting individual). Moderator accounts shall not have access to the audit log — an asymmetry distinct from the shared read access described in FR-DASH-01/02.

**Acceptance Criteria:** See NFR-OPS-01.

### 4.2 NFR-PRIV — Privacy & Compliance

#### NFR-PRIV-01 — PDPA-aligned baseline protections

| Priority |
| -------- |
| Must     |

**Requirement:** The system shall implement baseline data-protection measures consistent with Sri Lanka's PDPA — NIC encryption at rest, Admin-only visibility, masking (NFR-SEC-03) — even though full PDPA compliance (data subject access/correction/erasure rights, retention limits, breach procedures) is not fully built in the current scope.

**Acceptance Criteria:** Given NFR-SEC-03 is implemented, when reviewed, then the cheap, high-value baseline protections are in place, distinct from and not dependent on the full PDPA compliance program.

#### NFR-PRIV-02 — Data retention posture

| Priority |
| -------- |
| Should   |

**Requirement:** The system's data retention intention — accounts inactive for an extended period eventually flagged for data review, consistent with PDPA's data-minimization principle — shall be documented as a stated intention. No automated retention policy is built in the current scope.

**Acceptance Criteria:** Given this is a documentation-level requirement, when the documentation is reviewed, then this intention is stated explicitly rather than silently omitted or falsely implied as already built.

#### NFR-PRIV-03 — Anonymized deletion

| Priority |
| -------- |
| Must     |

**Requirement:** The system shall preserve engagement history under an anonymized reference when a user deletes their account, rather than deleting or corrupting the other party's reputation record.

**Acceptance Criteria:** See FR-ACC-17.

#### NFR-PRIV-04 — No general user directory

| Priority |
| -------- |
| Must     |

**Requirement:** The system shall not expose a browsable directory of all users, to protect against stalking or targeted harassment — with an explicit, stated exception for Admin/Moderator's oversight function (FR-DASH-02).

**Acceptance Criteria:** See FR-PROF-05.

#### NFR-PRIV-05 — Report anonymity

| Priority |
| -------- |
| Must     |

**Requirement:** The system shall withhold a reporter's identity from the reported party at all times.

**Acceptance Criteria:** See FR-DISPUTE-01.

#### NFR-PRIV-06 — Anonymized usage analytics

| Priority |
| -------- |
| Could    |

**Requirement:** The system shall collect only aggregate, anonymized feature-usage analytics (which screens get used, how often), never data that could re-identify a specific user's individual behavior. This is distinct from the operational metrics dashboard (FR-DASH-04), which is platform-operations data, not usage analytics.

**Acceptance Criteria:** Given usage analytics are collected, when reviewed, then no individual user can be re-identified from the aggregate data.

### 4.3 NFR-REL — Reliability

#### NFR-REL-01 — Stalled-engagement resolution integrity

| Priority |
| -------- |
| Must     |

**Requirement:** The system shall ensure no one-off Gig Engagement can remain open indefinitely without resolution, via the 24-hour prompt and 7-day auto-flag mechanism anchored to the posting's start date/time (FR-ENG-13).

**Acceptance Criteria:** See FR-ENG-13.

#### NFR-REL-02 — Immediate suspension effect

| Priority |
| -------- |
| Must     |

**Requirement:** The system shall apply an account suspension to the account's very next action or in-progress session's next request, not delay it to the account's next login.

**Acceptance Criteria:** See FR-ADM-03.

#### NFR-REL-03 — Concurrent case handling (named limitation)

| Priority           |
| ------------------ |
| Won't (this build) |

**Requirement:** The system is not required to implement formal case-locking to prevent two Admins from simultaneously reviewing the same case. Given the founding team is realistically 2–4 people at MVP scale with low case volume, this is accepted as a known, named limitation handled by informal team communication, not an unconsidered gap.

**Acceptance Criteria:** N/A — explicitly not built; documented here so it reads as a considered scope boundary in any review.

#### NFR-REL-04 — Engagement-deletion integrity

| Priority |
| -------- |
| Must     |

**Requirement:** The system shall block account deletion while any Engagement remains active, preventing an unresolved, unrated, orphaned Engagement.

**Acceptance Criteria:** See FR-ACC-17.

### 4.4 NFR-USE — Usability & Accessibility

#### NFR-USE-01 — Offline tolerance

| Priority |
| -------- |
| Should   |

**Requirement:** The system shall keep already-loaded listings viewable without a live network connection, even though posting and applying require connectivity.

**Acceptance Criteria:** Given a user has loaded a listing and then loses connectivity, when they view that listing again, then it remains viewable from local cache.

#### NFR-USE-02 — Low data usage

| Priority |
| -------- |
| Should   |

**Requirement:** The system shall keep the app generally light on data use — small image sizes, minimal heavy assets — fitting the target population's realistic mobile-data patterns.

**Acceptance Criteria:** Given the app is used on a constrained data connection, when core flows (browse, apply, post) are used, then no unnecessarily large assets (e.g., unoptimized images) are loaded.

#### NFR-USE-03 — Static Help/FAQ content

| Priority |
| -------- |
| Should   |

**Requirement:** The system shall provide a simple, static Help/FAQ section explaining check-in codes, the endorsement mechanism, and how dispute resolution works — mechanisms a first-time user would not intuit from the UI alone.

**Acceptance Criteria:** See FR module cross-references; a user unfamiliar with the app can find a written explanation of check-in codes, endorsement, and disputes within the Help section without external help.

### 4.5 NFR-LOC — Localization

#### NFR-LOC-01 — English-only in the current build

| Priority          |
| ----------------- |
| Must (this build) |

**Requirement:** The consumer-facing mobile app shall be English-only in the current build, named explicitly as a known limitation — the target population includes older and less digitally fluent users whom an English-only interface underserves.

**Acceptance Criteria:** Given the app is reviewed in its current state, when checked, then no Sinhala/Tamil UI is present or claimed as built.

#### NFR-LOC-02 — Sinhala/Tamil support scoped

| Priority |
| -------- |
| Should   |

**Requirement:** Sinhala and Tamil localization shall be treated as real, planned scope for a later phase, not merely described as an aspiration.

**Acceptance Criteria:** N/A for the current build — tracked as planned scope, not implemented now.

#### NFR-LOC-03 — Dashboard remains English-only permanently

| Priority |
| -------- |
| Must     |

**Requirement:** The Admin/Moderator web dashboard shall remain English-only permanently, since it is internal, staff-only tooling with no reason to extend localization to it.

**Acceptance Criteria:** Given the dashboard is reviewed at any point, when checked, then no localization beyond English is expected or planned for it.

#### NFR-LOC-04 — Currency and timezone

| Priority |
| -------- |
| Must     |

**Requirement:** The system shall use LKR as the only currency, with no currency selector, and a single timezone throughout, with no conversion logic — consistent with a single-country app.

**Acceptance Criteria:** Given any pay-related field is displayed, when rendered, then it shows LKR with no alternate-currency option present.

### 4.6 NFR-OPS — Operability

#### NFR-OPS-01 — Audit log visibility

| Priority |
| -------- |
| Must     |

**Requirement:** The system shall make the full Admin/Moderator action audit log visible to every Admin account, not only the account that performed a given action. Moderator accounts shall not have access to this log.

**Acceptance Criteria:**

- Given any Admin or Moderator performs a logged action, when any Admin account opens the audit log, then that action appears regardless of which account performed it.
- Given a Moderator account attempts to open the audit log, when they navigate to it, then access is denied.

#### NFR-OPS-02 — Metrics dashboard export

| Priority |
| -------- |
| Should   |

**Requirement:** The system shall make the metrics dashboard (FR-DASH-04) viewable and exportable in a basic format — genuinely useful for the team's own sprint reporting, not just platform oversight.

**Acceptance Criteria:** See FR-DASH-04.

#### NFR-OPS-03 — Dispute resolution soft target

| Priority                                  |
| ----------------------------------------- |
| Should (operational target, not enforced) |

**Requirement:** Admin shall aim to resolve escalated dispute cases within 3–5 business days — a stated operational expectation, reasonable given Phase 1's founding-team staffing, not a hard technical constraint the system enforces mechanically.

**Acceptance Criteria:** N/A — this is a documented team target, not a system-enforced rule; the system does not block or auto-escalate based on it beyond what FR-DASH-04's metrics already surface.

#### NFR-OPS-04 — No appeals mechanism

| Priority                 |
| ------------------------ |
| Must (design constraint) |

**Requirement:** The system shall provide no appeals process for a final Admin ruling (FR-ADM-01), stated explicitly rather than left ambiguous — a real feature with real complexity, not warranted for a two-outcome-plus-inconclusive ruling system at this scale.

**Acceptance Criteria:** See FR-ADM-01.

### 4.7 NFR-PERF — Performance & Scalability

_The response-time thresholds below follow Nielsen Norman Group's interaction-design research; the uptime target follows standard early-stage SaaS practice; the connectivity assumptions follow Google's guidance for designing against constrained mobile networks._

#### NFR-PERF-01 — Direct-manipulation response time

| Priority |
| -------- |
| Must     |

**Requirement:** The system shall respond to any direct-manipulation interaction with no network round-trip (filter toggles, category selection, opening a menu) within 0.1 seconds, the threshold for a user to feel they're directly manipulating the interface rather than issuing a command to it.

**Acceptance Criteria:** Given a user taps a filter, toggle, or menu that requires no server round-trip, when tapped, then visible feedback appears within 0.1 seconds.

#### NFR-PERF-02 — Common-action response time

| Priority |
| -------- |
| Must     |

**Requirement:** The system shall target 1 second for common actions requiring a server round-trip (submitting an application, submitting a posting, submitting a vouch, opening a listing detail view, browsing at the default radius), treating 3 seconds as the ceiling before a visible loading indicator becomes required.

**Acceptance Criteria:**

- Given a common round-trip action is triggered, when it completes within 1 second, then no loading indicator is required.
- Given the same action is still in progress after 1 second, when that threshold passes, then a loading indicator is shown.
- Given the action has not completed after 3 seconds, when that threshold passes, then this is treated as exceeding the design target, not merely as a slow instance.

#### NFR-PERF-03 — Search-radius auto-expansion as one continuous operation

| Priority |
| -------- |
| Should   |

**Requirement:** The system shall present the search-radius auto-expansion (FR-DISC-01) as a single continuous loading operation to the user, not a sequence of separate waits per radius step, completing within 10 seconds on a typical connection. If still running at 10 seconds, the system shall show a progress indicator and allow the user to stop expanding and view partial results.

**Acceptance Criteria:**

- Given radius auto-expansion is triggered by a sparse-results condition, when it runs, then the user sees one continuous loading state, not repeated distinct pauses per 5km step.
- Given auto-expansion is still running at 10 seconds, when that threshold passes, then a progress indicator appears with an option to stop and view whatever results have been found so far.

#### NFR-PERF-04 — Uptime target

| Priority |
| -------- |
| Should   |

**Requirement:** The system shall target 99.9% uptime (approximately 43.8 minutes of downtime per month) as a stated design commitment, consistent with standard early-stage SaaS practice and achievable without dedicated redundant infrastructure. As with full PDPA compliance (NFR-PRIV-02) and the dispute-resolution soft target (NFR-OPS-03), this is a stated design target rather than something instrumented or enforced in the current build, since no production infrastructure is deployed yet.

**Acceptance Criteria:** N/A — a stated design target, not a build-time or grading-time enforced constraint.

#### NFR-PERF-05 — No hard-coded concurrent-user ceiling

| Priority |
| -------- |
| Should   |

**Requirement:** The system shall not be architected around any hard-coded concurrent-user limit, built to scale horizontally as demand grows rather than sized to a specific projected user count. A specific numeric concurrent-user target is intentionally not stated here, since no user-acquisition projection or market-sizing estimate exists to ground one, and inventing a figure would be false precision. Should real demand data emerge, this requirement should be revisited with an actual number at that point.

**Acceptance Criteria:** N/A — an architectural principle, not a number to test against. Recommend revisiting once real demand/market-sizing data exists.

---

## 5. Explicitly Out of Scope

Stated together, since a requirements document needs its edges as much as its content. Each of these was considered and deliberately excluded — not an oversight.

| Excluded                                                                                     | Reason                                                                                                                                                                                                                                                                                 |
| -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| In-app payment, escrow, or commission                                                        | Money changes hands entirely outside the app; commission is future monetization, not built here                                                                                                                                                                                        |
| Permanent/full-time employment postings                                                      | The trust loop mechanically assumes a bounded engagement with a completion moment; permanent employment has no natural "completed" state                                                                                                                                               |
| Users under 18                                                                               | Considered and rejected in favor of full exclusion over guardian-consent handling                                                                                                                                                                                                      |
| Real-time KYC or Police Clearance Certificate verification                                   | Feasible in Sri Lanka but requires an external paid vendor relationship, disproportionate to this build                                                                                                                                                                                |
| Skill-matching taxonomy                                                                      | The category allow-list plus free-text bio already do this job at the grain this population needs                                                                                                                                                                                      |
| Draft/save-for-later postings                                                                | Real nice-to-have, but adds state-management complexity most single-gig employers won't need                                                                                                                                                                                           |
| In-app messaging                                                                             | Contact happens via revealed phone number instead, consistent with payment already being coordinated outside the app                                                                                                                                                                   |
| Profile photos                                                                               | The trust system already has real load-bearing signals (NIC, name, phone verification, ratings); a photo adds moderation surface for marginal gain                                                                                                                                     |
| Reason attached to a declined application                                                    | Real added complexity for a marginal benefit; not load-bearing                                                                                                                                                                                                                         |
| Block-user feature                                                                           | The app's interaction surface is narrow enough (Employer never contacts a worker unsolicited) that reporting already covers genuine bad actors                                                                                                                                         |
| Category options narrowing by poster type                                                    | The category allow-list already does the safety-relevant work; further restriction adds only cosmetic polish                                                                                                                                                                           |
| Appeals process for Admin rulings                                                            | Real feature complexity not warranted for a two-outcome-plus-inconclusive ruling system at this scale                                                                                                                                                                                  |
| Formal accessibility compliance (WCAG, screen-reader support)                                | Acknowledged limitation; low-connectivity tolerance and light data use are a better fit for this specific population                                                                                                                                                                   |
| Full PDPA compliance (access/correction/erasure rights, retention limits, breach procedures) | A real, known-to-apply-once-live commitment; only baseline protections (NFR-PRIV-01) are built now                                                                                                                                                                                     |
| Application cap per posting                                                                  | The sort-by-trust-signal and optional-note mechanisms already make a large pool manageable                                                                                                                                                                                             |
| A new mechanism for false/malicious reports                                                  | The existing 3-report auto-hide threshold and Admin's dispute authority already handle this pattern                                                                                                                                                                                    |
| A community-endorsement bootstrap for Employers                                              | Initially considered, then explicitly rejected — endorsement's entire justification is protecting the weaker party in a transaction, which doesn't transfer to a business; employer legitimacy is better served by the business-name field and objective facts than by social vouching |

---

## 6. Assumptions & Constraints

| Assumption/Constraint           | Detail                                                                                                                                                                                                                                        |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Founding-team staffing          | Admin/Moderator duties are absorbed by the founding team at Phase 1 (MVP stage); a dedicated, paid role is a Phase 2 cost                                                                                                                     |
| Single-country deployment       | LKR-only currency, single timezone, no conversion logic anywhere in the system                                                                                                                                                                |
| Multiple simultaneous logins    | Allowed without restriction — a user may be logged in on more than one device at once, with no session-invalidation logic                                                                                                                     |
| "Mobile-only" scope boundary    | Refers to the consumer-facing product (Youth Job-Seeker, Employer, Verifier) only; the Admin/Moderator dashboard is a separate, internal web surface, consistent with how real companies (e.g., Uber, Airbnb) draw this line                  |
| Priority semantics              | Must/Should/Could/Won't tags reflect functional centrality to the product, not sprint assignment. Sprint and ownership allocation is a separate planning decision — see [`module-ownership.md`](module-ownership.md)                          |
| No external vendor integrations | No real KYC vendor (Shufti/Didit/Checkr-style), no PCC integration, and no payment processor are integrated in this build — the same category of dependency (external cost and compliance surface), independent of available engineering time |
| Verifier role eligibility       | Self-selected at signup with no additional vetting beyond the 18-plus rule; Admin has no capacity to vet this at MVP scale                                                                                                                    |

---

## 7. Requirement Index

_Every requirement ID and title in one place, for navigation. Use these IDs in branch names and commit messages._

### 7.1 Functional Requirements

| ID            | Title                                                   |
| ------------- | ------------------------------------------------------- |
| FR-ACC-01     | Account registration                                    |
| FR-ACC-02     | Employer posting-as type                                |
| FR-ACC-03     | Age gate                                                |
| FR-ACC-04     | NIC field handling                                      |
| FR-ACC-05     | Duplicate account prevention                            |
| FR-ACC-06     | Incomplete signup expiry                                |
| FR-ACC-07     | Login                                                   |
| FR-ACC-08     | OTP mechanism                                           |
| FR-ACC-09     | Password security                                       |
| FR-ACC-10     | Password reset                                          |
| FR-ACC-11     | Password change                                         |
| FR-ACC-12     | Phone number change                                     |
| FR-ACC-13     | NIC correction                                          |
| FR-ACC-14     | Email add/change                                        |
| FR-ACC-15     | Display name editing                                    |
| FR-ACC-16     | Posting-as type change                                  |
| FR-ACC-17     | Account deletion                                        |
| FR-ACC-18     | Unified Settings screen                                 |
| FR-ACC-19     | Terms of Service and Privacy Policy acceptance          |
| FR-PROF-01    | Profile display identity                                |
| FR-PROF-02    | Verification badges                                     |
| FR-PROF-03    | Profile bio                                             |
| FR-PROF-04    | Bio-to-application-note integration                     |
| FR-PROF-05    | Contextual profile visibility                           |
| FR-PROF-06    | Trust-signal display on profile                         |
| FR-POST-01    | Posting field sequence                                  |
| FR-POST-02    | Task category allow-list                                |
| FR-POST-03    | Schedule field for recurring arrangements               |
| FR-POST-04    | Pay format by arrangement type                          |
| FR-POST-05    | Minimum lead time                                       |
| FR-POST-06    | Workers needed field                                    |
| FR-POST-07    | Urgency computation                                     |
| FR-POST-08    | Location precision display                              |
| FR-POST-09    | Review screen before submission                         |
| FR-POST-10    | Notification fan-out on submission                      |
| FR-POST-11    | Posting editing                                         |
| FR-POST-12    | Posting withdrawal                                      |
| FR-POST-13    | Posting expiry                                          |
| FR-POST-14    | Slot-fill status display                                |
| FR-POST-15    | No draft state                                          |
| FR-POST-16    | Posted-as auto-population                               |
| FR-POST-17    | No-applicant nudge                                      |
| FR-POST-18    | Posting status computation (Open/Filled)                |
| FR-DISC-01    | Radius-based browsing                                   |
| FR-DISC-02    | Manual location fallback                                |
| FR-DISC-03    | Category and arrangement-type filters                   |
| FR-DISC-04    | Keyword search                                          |
| FR-DISC-05    | Sort order                                              |
| FR-DISC-06    | Saved/favorited gigs                                    |
| FR-DISC-07    | Filter and sort persistence                             |
| FR-APPLY-01   | Listing detail view                                     |
| FR-APPLY-02   | Apply action                                            |
| FR-APPLY-03   | Application withdrawal                                  |
| FR-APPLY-04   | Applicant pool sort order                               |
| FR-APPLY-05   | Employer applicant view                                 |
| FR-APPLY-06   | Selection and Engagement creation                       |
| FR-APPLY-07   | Contact reveal on selection                             |
| FR-APPLY-08   | Explicit decline                                        |
| FR-APPLY-09   | Automatic not-selected notification                     |
| FR-APPLY-10   | Pending-applicant notification on material change       |
| FR-APPLY-11   | No application cap                                      |
| FR-ENG-01     | Check-in code checkpoints                               |
| FR-ENG-02     | Unpaid internship checkpoint exception                  |
| FR-ENG-03     | Unable-to-confirm fallback                              |
| FR-ENG-04     | Per-Engagement checkpoint scoping                       |
| FR-ENG-05     | Cancellation (regular gig)                              |
| FR-ENG-06     | Cancellation (urgent gig)                               |
| FR-ENG-07     | Completion-rate tracking                                |
| FR-ENG-08     | Per-Engagement cancellation scope                       |
| FR-ENG-09     | Material change re-confirmation                         |
| FR-ENG-10     | Urgency recomputation on time change                    |
| FR-ENG-11     | Multi-slot material change re-confirmation              |
| FR-ENG-12     | Part-time End Engagement                                |
| FR-ENG-13     | Stalled engagement handling                             |
| FR-RATE-01    | Rating scale and submission                             |
| FR-RATE-02    | Double-blind submission                                 |
| FR-RATE-03    | Completion-rate as a distinct stat                      |
| FR-RATE-04    | Per-Engagement independent ratings                      |
| FR-RATE-05    | Rating applicability by Engagement outcome              |
| FR-RATE-06    | Rating disputes                                         |
| FR-ENDORSE-01 | Verifier role selection                                 |
| FR-ENDORSE-02 | Worker-initiated endorsement entry point                |
| FR-ENDORSE-03 | Verifier-initiated endorsement entry point              |
| FR-ENDORSE-04 | Vouch action                                            |
| FR-ENDORSE-05 | Eligibility window                                      |
| FR-ENDORSE-06 | Endorsement coverage across applications                |
| FR-ENDORSE-07 | Endorsement revocation                                  |
| FR-ENDORSE-08 | Uncapped endorsements per worker                        |
| FR-ENDORSE-09 | Endorsement notification to worker                      |
| FR-ENDORSE-10 | Endorsement display                                     |
| FR-ENDORSE-11 | Verifier track record                                   |
| FR-ENDORSE-12 | Endorsement payoff notification                         |
| FR-ENDORSE-13 | Bio prompt for zero-history workers                     |
| FR-ENDORSE-14 | Endorsement-seeking suggestion                          |
| FR-ENDORSE-15 | Verifier code-entry prompt                              |
| FR-DISPUTE-01 | Report action                                           |
| FR-DISPUTE-02 | Report threshold and auto-hide                          |
| FR-DISPUTE-03 | Dispute entry points                                    |
| FR-DISPUTE-04 | Response window and evidence                            |
| FR-DISPUTE-05 | Evidence upload                                         |
| FR-DISPUTE-06 | Discovered false birthdate                              |
| FR-MOD-01     | Dispute case triage                                     |
| FR-MOD-02     | Warning threshold and auto-escalation                   |
| FR-MOD-03     | Mid-review clarification request                        |
| FR-MOD-04     | Flagged content review                                  |
| FR-ADM-01     | Final dispute ruling                                    |
| FR-ADM-02     | Payment-dispute ruling scope                            |
| FR-ADM-03     | Account suspension                                      |
| FR-ADM-04     | Verification-document review (future-contingent)        |
| FR-ADM-05     | Posting removal                                         |
| FR-ADM-06     | Admin/Moderator account bootstrapping                   |
| FR-ADM-07     | Separate Admin/Moderator accounts                       |
| FR-ADM-08     | Dispute ruling's effect on the rating step              |
| FR-DASH-01    | Full postings visibility                                |
| FR-DASH-02    | Full user-account visibility                            |
| FR-DASH-03    | Case queue                                              |
| FR-DASH-04    | Metrics dashboard                                       |
| FR-DASH-05    | Mobile/dashboard case-surface split                     |
| FR-DASH-06    | Dashboard authentication                                |
| FR-NOTIF-01   | Urgent gig push notifications                           |
| FR-NOTIF-02   | Non-urgent gig notifications                            |
| FR-NOTIF-03   | Notification preferences                                |
| FR-NOTIF-04   | Application-related notifications                       |
| FR-NOTIF-05   | Engagement-related notifications                        |
| FR-NOTIF-06   | Dispute/case notifications                              |
| FR-NOTIF-07   | Endorsement notifications                               |
| FR-NOTIF-08   | In-app notification history                             |
| FR-NOTIF-09   | Notification permission handling                        |
| FR-NOTIF-10   | Distinct treatment for urgent vs. regular notifications |

### 7.2 Non-Functional Requirements

| ID          | Title                                                    |
| ----------- | -------------------------------------------------------- |
| NFR-SEC-01  | Password hashing                                         |
| NFR-SEC-02  | Login rate-limiting                                      |
| NFR-SEC-03  | NIC data protection                                      |
| NFR-SEC-04  | Dashboard two-factor authentication                      |
| NFR-SEC-05  | Role-based access control                                |
| NFR-SEC-06  | Audit logging of privileged actions                      |
| NFR-PRIV-01 | PDPA-aligned baseline protections                        |
| NFR-PRIV-02 | Data retention posture                                   |
| NFR-PRIV-03 | Anonymized deletion                                      |
| NFR-PRIV-04 | No general user directory                                |
| NFR-PRIV-05 | Report anonymity                                         |
| NFR-PRIV-06 | Anonymized usage analytics                               |
| NFR-REL-01  | Stalled-engagement resolution integrity                  |
| NFR-REL-02  | Immediate suspension effect                              |
| NFR-REL-03  | Concurrent case handling (named limitation)              |
| NFR-REL-04  | Engagement-deletion integrity                            |
| NFR-USE-01  | Offline tolerance                                        |
| NFR-USE-02  | Low data usage                                           |
| NFR-USE-03  | Static Help/FAQ content                                  |
| NFR-LOC-01  | English-only in the current build                        |
| NFR-LOC-02  | Sinhala/Tamil support scoped                             |
| NFR-LOC-03  | Dashboard remains English-only permanently               |
| NFR-LOC-04  | Currency and timezone                                    |
| NFR-OPS-01  | Audit log visibility                                     |
| NFR-OPS-02  | Metrics dashboard export                                 |
| NFR-OPS-03  | Dispute resolution soft target                           |
| NFR-OPS-04  | No appeals mechanism                                     |
| NFR-PERF-01 | Direct-manipulation response time                        |
| NFR-PERF-02 | Common-action response time                              |
| NFR-PERF-03 | Search-radius auto-expansion as one continuous operation |
| NFR-PERF-04 | Uptime target                                            |
| NFR-PERF-05 | No hard-coded concurrent-user ceiling                    |
