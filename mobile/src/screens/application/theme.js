/**
 * Design tokens for the Applying & Selection module's screens — Naveenkhan.
 *
 * Mapped to the shared design system tokens (mobile/src/theme/tokens.js)
 * per Sprint 3 UI conformance.
 */
import {
  colors as sharedColors,
  spacing as sharedSpacing,
  radius as sharedRadius,
  typography as sharedTypography,
} from "../../theme/tokens";

export const colors = {
  primary: sharedColors.brand.primary,
  textPrimary: sharedColors.text.primary,
  textSecondary: sharedColors.text.secondary,
  textPlaceholder: sharedColors.text.secondary,
  surface: sharedColors.bg.default,
  surfaceMuted: sharedColors.bg.subtle,
  border: sharedColors.border.default,
  danger: sharedColors.state.danger,
  success: sharedColors.state.success,
  warning: sharedColors.state.urgent,
};

export const spacing = {
  xs: sharedSpacing.xs,
  sm: sharedSpacing.sm,
  md: sharedSpacing.md,
  lg: sharedSpacing.lg,
  xl: sharedSpacing.xl,
  xxl: sharedSpacing.xxl,
};

export const radius = {
  sm: sharedRadius.sm,
  md: sharedRadius.input,
  lg: sharedRadius.card,
};

export const typography = {
  title: sharedTypography.title,
  subtitle: sharedTypography.bodyMedium,
  body: sharedTypography.body,
  button: sharedTypography.bodyMedium,
  caption: sharedTypography.caption,
};
