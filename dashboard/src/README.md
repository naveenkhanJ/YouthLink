# dashboard/src

The internal web dashboard for Moderator and Admin work (`FR-DASH`, `FR-MOD`, `FR-ADM`).

```
src/
  api/         Calls to the backend, one file per module
  components/  Shared UI
  lib/         Helpers and configuration
  pages/       One folder per area
```

**Not scheduled until Sprint 3/4.** The structure exists so nobody has to invent it later; nothing here is built yet.

Dashboard login is deliberately stricter than the mobile app: it requires a password **and** a fresh OTP together, never either-or (`FR-DASH-06`, `NFR-SEC-04`).
