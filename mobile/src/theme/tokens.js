/**
 * Shared design tokens — docs/prototype/design-system.md §1-4.
 *
 * These replace every module's local theme.js (module-ownership.md's Sprint 3
 * shared-prerequisite queue, item 2). mobile/src/screens/account/theme.js
 * predates this file and disagrees with it — most visibly, its
 * colors.primary (#5B4FE0, purple) is not color/brand/primary (#0f3d91, dark
 * blue). design-system.md calls that out by name as the thing to fix.
 *
 * Naming mirrors the Figma token paths (color/brand/primary → colors.brand.primary)
 * so a value here can be traced back to the spec.
 */

export const colors = {
  bg: {
    default: "#ffffff",
    subtle: "#f3f4f6",
    brandTint: "#e7ebf4",
  },
  text: {
    primary: "#111827",
    secondary: "#6b7280",
    inverse: "#ffffff",
  },
  brand: {
    primary: "#0f3d91",
  },
  border: {
    default: "#e5e7eb",
    error: "#dc2626",
  },
  state: {
    danger: "#dc2626",
    urgent: "#c2410c",
    success: "#15803d",
  },
  badge: {
    verified: "#0f766e",
    endorsed: "#7e22ce",
    rating: "#b45309",
  },
  overlay: {
    scrim: "#111827", // used at 40% node opacity, not a translucent hex
  },
};

// spacing/gutter (16) is spacing/lg under another name — kept separate
// because design-system.md documents it as the screen-edge padding
// specifically, not just "the 16 value".
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  gutter: 16,
};

export const radius = {
  input: 8,
  card: 10,
  sheet: 12,
  pill: 999,
};

// Every style sets an explicit lineHeight — Inter's own default at these
// sizes doesn't match the spec's values, so omitting it is a defect, not a
// simplification (design-system.md §3 says this outright).
export const typography = {
  display: { fontSize: 24, fontWeight: "600", lineHeight: 32 },
  title: { fontSize: 20, fontWeight: "600", lineHeight: 28 },
  body: { fontSize: 16, fontWeight: "400", lineHeight: 24 },
  bodyMedium: { fontSize: 16, fontWeight: "500", lineHeight: 24 },
  secondary: { fontSize: 14, fontWeight: "400", lineHeight: 20 },
  secondaryMedium: { fontSize: 14, fontWeight: "500", lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: "400", lineHeight: 16 },
  tabLabel: { fontSize: 10, fontWeight: "400", lineHeight: 14 },
  displayNumber: { fontSize: 20, fontWeight: "600", lineHeight: 26 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "600",
    lineHeight: 16,
    letterSpacing: 0.8,
  },
  code: { fontSize: 20, fontWeight: "600", lineHeight: 26, letterSpacing: 6 },
};

// React Native has no single cross-platform shadow API — iOS reads the
// shadow* properties, Android reads elevation. Both are set so the same
// token looks right on both.
export const elevation = {
  card: {
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  sheet: {
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 8,
  },
  // Casts upward (negative height) — this is the pinned ctaBar/TabBar's
  // shadow, and it only applies when content actually scrolls under the bar.
  bar: {
    shadowColor: "#0f1729",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
};
