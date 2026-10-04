/**
 * Design tokens for the Account Management module's screens — Afham.
 *
 * Interim, not final: derived from 3 onboarding prototype screenshots
 * (2026-08-18), not an approved brand palette or Figma file. Scoped to this
 * module only — see .worklog/progress.md's "Mobile design system" section
 * for the full reasoning, what's directly observed vs. extrapolated, and
 * why this deliberately isn't a shared/top-level theme file.
 *
 * `colors.primary` is a screenshot estimate, not color-picked from a source
 * file. Kept as a single constant so replacing it with an exact hex later
 * (once final brand colors land) is a one-line change, not a find-and-replace
 * across every screen — that's the actual mechanism for minimizing rework,
 * not pixel-perfect guessing today.
 */

export const colors = {
  primary: "#5B4FE0",
  textPrimary: "#111827",
  textSecondary: "#6B7280",
  textPlaceholder: "#9CA3AF",
  surface: "#FFFFFF",
  surfaceMuted: "#F3F4F6",
  border: "#E5E7EB",
  danger: "#DC2626",
  dotInactive: "#D1D5DB",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 40,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 999,
};

export const typography = {
  headline: { fontSize: 28, fontWeight: "700", lineHeight: 34 },
  title: { fontSize: 22, fontWeight: "700", lineHeight: 28 },
  body: { fontSize: 15, fontWeight: "400", lineHeight: 21 },
  button: { fontSize: 16, fontWeight: "700" },
  caption: { fontSize: 14, fontWeight: "500" },
  label: { fontSize: 13, fontWeight: "600" },
};
