/**
 * Design tokens for the Applying & Selection module's screens — Naveenkhan.
 *
 * Scoped to this module only, same reasoning as the Account module's
 * theme.js: there's no approved shared design system yet, so each module
 * keeps its own small token file rather than one screen inventing a
 * top-level theme for everyone. Functional, not pixel-matched to a
 * wireframe — see CONTRIBUTING.md's Definition of Done on what "matches
 * the wireframe" requires here (functionally, not pixel-perfectly).
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

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
};

export const typography = {
  title: { fontSize: 22, fontWeight: "700", lineHeight: 28 },
  subtitle: { fontSize: 17, fontWeight: "600", lineHeight: 22 },
  body: { fontSize: 15, fontWeight: "400", lineHeight: 21 },
  button: { fontSize: 16, fontWeight: "700" },
  caption: { fontSize: 13, fontWeight: "500" },
};
