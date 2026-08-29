/**
 * Design tokens for the Gig Posting module's screens — FR-POST.
 *
 * Scoped to this module, matching the pattern the Account Management and
 * Applying & Selection modules already follow: there is no approved shared
 * design system yet, so each module keeps its own small token file rather
 * than one screen inventing a top-level theme for everyone.
 *
 * Values are deliberately identical to the other two modules' token files so
 * the app reads as one product across slices. `primary` is the corporate blue
 * set 2026-08-30 — keep it in step with account/theme.js and
 * application/theme.js by hand, since nothing shares it yet.
 */

export const colors = {
  primary: "#1D4ED8",
  primaryDark: "#1E40AF",
  primaryTint: "#EFF6FF",
  textPrimary: "#111827",
  textSecondary: "#6B7280",
  textPlaceholder: "#9CA3AF",
  surface: "#FFFFFF",
  surfaceMuted: "#F3F4F6",
  border: "#E5E7EB",
  danger: "#DC2626",
  success: "#16A34A",
  warning: "#D97706",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = { sm: 8, md: 12, lg: 16, full: 999 };

export const typography = {
  title: { fontSize: 22, fontWeight: "700", lineHeight: 28 },
  heading: { fontSize: 17, fontWeight: "700", lineHeight: 22 },
  body: { fontSize: 15, fontWeight: "400", lineHeight: 21 },
  button: { fontSize: 16, fontWeight: "700" },
  caption: { fontSize: 13, fontWeight: "400", lineHeight: 18 },
  label: { fontSize: 13, fontWeight: "600" },
};
