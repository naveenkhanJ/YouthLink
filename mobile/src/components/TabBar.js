/**
 * Chrome/TabBar — docs/prototype/design-system.md §5, MNAV-shells.md.
 *
 * Three role variants (the only difference is which tabs exist and how many):
 *   worker    — Browse, Applications, Engagements, Notifications, Profile (5, 72w each)
 *   employer  — Postings, Post a Gig, Engagements, Notifications, Profile (5, 72w each)
 *   verifier  — Endorsements, Vouch, Notifications, Profile (4, 90w each — width is
 *               360 / tab count, not a hard-coded 72)
 *
 * Active-state rule, per MNAV-shells.md (the *entire* active-state spec — no
 * underline, no weight change): the active tab's icon sits in a 56x30 pill
 * filled colors.bg.brandTint, its icon and label are colors.brand.primary;
 * an inactive tab has no pill and its icon/label are colors.text.secondary.
 *
 * Icons are built directly from MNAV-shells.md's own node tree — every
 * ELLIPSE/VECTOR's exact size and @x,y position inside the 24x24 icon frame,
 * not a prose paraphrase of it (a paraphrase is what produced the wrong
 * Browse icon the first time — the raw tree unambiguously specifies a
 * magnifying glass: a 14x14 circle plus a short diagonal handle at the
 * bottom-right corner). Positions below are copied from the spec's own
 * coordinates. Two icons (Applications, Endorsements) are a single VECTOR
 * with only a bounding box in the text spec, no path data — those two are
 * still a best-effort shape at the right size/position, flagged individually
 * below, not a claim of exactness the source doesn't support.
 */
import { View, Pressable, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing, radius, typography } from "../theme/tokens";

const TABS_BY_ROLE = {
  worker: [
    { key: "browse", label: "Browse", icon: "browse" },
    { key: "applications", label: "Applications", icon: "applications" },
    { key: "engagements", label: "Engagements", icon: "engagements" },
    { key: "notifications", label: "Notifications", icon: "notifications" },
    { key: "profile", label: "Profile", icon: "profile" },
  ],
  employer: [
    { key: "postings", label: "Postings", icon: "postings" },
    { key: "postGig", label: "Post a Gig", icon: "postGig" },
    { key: "engagements", label: "Engagements", icon: "engagements" },
    { key: "notifications", label: "Notifications", icon: "notifications" },
    { key: "profile", label: "Profile", icon: "profile" },
  ],
  verifier: [
    { key: "endorsements", label: "Endorsements", icon: "endorsements" },
    { key: "vouch", label: "Vouch", icon: "vouch" },
    { key: "notifications", label: "Notifications", icon: "notifications" },
    { key: "profile", label: "Profile", icon: "profile" },
  ],
};

// Per-role shell copy, verbatim from MNAV-shells.md's NAV.1/NAV.2/NAV.3 —
// the exact shellTitle/hosts text the spec already wrote for "this tab's
// real screen isn't here yet, this frame only defines the chrome" (not
// invented copy — see docs/decisions.md and .worklog for why an earlier
// version of this screen wrote its own text instead of using this).
const SHELL_COPY_BY_ROLE = {
  worker: {
    title: "Worker shell",
    hosts:
      "Hosts Browse (3.1), My Applications (4.3), Engagements (5.1), Notifications (3.10), Profile (1.18). Hub screens live on their module pages; this shell defines the chrome.",
  },
  employer: {
    title: "Employer shell",
    hosts:
      "Hosts My Postings (2.10), Post a Gig (2.1), Engagements (5.1e), Notifications (3.10e), Profile (1.18e). Hub screens live on their module pages; this shell defines the chrome.",
  },
  verifier: {
    title: "Verifier shell",
    hosts:
      "Hosts My Endorsements (8.5), Vouch (8.2), Notifications (3.10v), Profile (1.18v). Hub screens live on their module pages; this shell defines the chrome.",
  },
};

/** Icons are laid out on a fixed 24x24 grid, absolutely positioned exactly
 * as MNAV-shells.md's own @x,y coordinates specify, at the icon's real
 * size (24x24, unscaled — the tab's pillWrap around it is what's centered). */
function TabIcon({ shape, active }) {
  const stroke = active ? colors.brand.primary : colors.text.secondary;
  const fill = active ? colors.brand.primary : "transparent";

  switch (shape) {
    // ELLIPSE 14x14 @3,3 + VECTOR 5x5 @16,16 — a magnifying glass: circle
    // plus a short diagonal handle at the bottom-right corner.
    case "browse":
      return (
        <View style={styles.iconBox}>
          <View style={[styles.abs, { left: 3, top: 3, width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: stroke }]} />
          <View style={[styles.abs, { left: 17, top: 17, width: 6, height: 2, backgroundColor: stroke, borderRadius: 1, transform: [{ rotate: "45deg" }] }]} />
        </View>
      );
    // VECTOR 18x17 @3,4 — a single path, no shape data in the text spec.
    // Best-effort: a document/list outline at the spec's exact size/position.
    case "applications":
      return (
        <View style={styles.iconBox}>
          <View style={[styles.abs, { left: 3, top: 4, width: 18, height: 17, borderRadius: 2, borderWidth: 2, borderColor: stroke }]} />
        </View>
      );
    // ELLIPSE 18x18 @3,3 + VECTOR 3x6 @12,8 — a clock: circle plus a hand
    // from the centre toward the upper-right.
    case "engagements":
      return (
        <View style={styles.iconBox}>
          <View style={[styles.abs, { left: 3, top: 3, width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: stroke }]} />
          <View style={[styles.abs, { left: 12, top: 8, width: 2, height: 6, backgroundColor: stroke, borderRadius: 1 }]} />
        </View>
      );
    // VECTOR 16x13 @3,3 (bell body) + VECTOR 5x2 @10,19 (base).
    case "notifications":
      return (
        <View style={styles.iconBox}>
          <View
            style={[
              styles.abs,
              {
                left: 3, top: 3, width: 16, height: 13, borderWidth: 2, borderColor: stroke,
                borderTopLeftRadius: 8, borderTopRightRadius: 8, borderBottomLeftRadius: 2, borderBottomRightRadius: 2,
              },
            ]}
          />
          <View style={[styles.abs, { left: 10, top: 19, width: 5, height: 2, backgroundColor: stroke, borderRadius: 1 }]} />
        </View>
      );
    // ELLIPSE 8x8 @8,3 (head) + VECTOR 16x8 @4,13 (shoulders).
    case "profile":
      return (
        <View style={styles.iconBox}>
          <View style={[styles.abs, { left: 8, top: 3, width: 8, height: 8, borderRadius: 4, borderWidth: 2, borderColor: stroke }]} />
          <View
            style={[
              styles.abs,
              { left: 4, top: 13, width: 16, height: 8, borderWidth: 2, borderColor: stroke, backgroundColor: fill, borderTopLeftRadius: 8, borderTopRightRadius: 8 },
            ]}
          />
        </View>
      );
    // VECTOR 14x16 @5,2 filled (briefcase body) + three thin bg-coloured
    // lines at 9,8 / 9,12 / 9,16 cut through it.
    case "postings":
      return (
        <View style={styles.iconBox}>
          <View style={[styles.abs, { left: 5, top: 2, width: 14, height: 16, borderRadius: 2, backgroundColor: stroke }]} />
          <View style={[styles.abs, { left: 9, top: 8, width: 7, height: 2, backgroundColor: colors.bg.default }]} />
          <View style={[styles.abs, { left: 9, top: 12, width: 7, height: 2, backgroundColor: colors.bg.default }]} />
          <View style={[styles.abs, { left: 9, top: 16, width: 5, height: 2, backgroundColor: colors.bg.default }]} />
        </View>
      );
    // ELLIPSE 18x18 @3,3 (circle) + VECTOR 8x8 @8,8 (a plus, centred).
    case "postGig":
      return (
        <View style={styles.iconBox}>
          <View style={[styles.abs, { left: 3, top: 3, width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: stroke }]} />
          <View style={[styles.abs, { left: 8, top: 11, width: 8, height: 2, backgroundColor: stroke }]} />
          <View style={[styles.abs, { left: 11, top: 8, width: 2, height: 8, backgroundColor: stroke }]} />
        </View>
      );
    // VECTOR 18x18 @3,3, filled — a single path, no shape data in the text
    // spec. Best-effort placeholder at the spec's exact size/position.
    case "endorsements":
      return (
        <View style={styles.iconBox}>
          <View style={[styles.abs, { left: 3, top: 3, width: 18, height: 18, borderRadius: 9, backgroundColor: stroke }]} />
        </View>
      );
    // ELLIPSE 7x7 @6,3 (small head) + VECTOR 14x7 @3,13 (body) +
    // VECTOR 5x5 @17,5 (a mark near the head — best-effort as a small badge).
    case "vouch":
      return (
        <View style={styles.iconBox}>
          <View style={[styles.abs, { left: 6, top: 3, width: 7, height: 7, borderRadius: 3.5, borderWidth: 2, borderColor: stroke }]} />
          <View
            style={[
              styles.abs,
              { left: 3, top: 13, width: 14, height: 7, borderWidth: 2, borderColor: stroke, borderTopLeftRadius: 7, borderTopRightRadius: 7 },
            ]}
          />
          <View style={[styles.abs, { left: 17, top: 5, width: 5, height: 5, borderRadius: 2.5, borderWidth: 2, borderColor: stroke }]} />
        </View>
      );
    default:
      return null;
  }
}

/**
 * @param {object} props
 * @param {"worker"|"employer"|"verifier"} props.role
 * @param {string} props.activeTab - key of the tab currently shown, per TABS_BY_ROLE
 * @param {boolean} [props.notificationBadge] - shows the urgent dot on the Notifications tab
 * @param {(key: string) => void} props.onTabPress
 */
export default function TabBar({ role, activeTab, notificationBadge = false, onTabPress }) {
  const tabs = TABS_BY_ROLE[role];
  if (!tabs) {
    throw new Error(`TabBar: unknown role "${role}" (expected worker, employer, or verifier)`);
  }
  const tabWidth = 360 / tabs.length;
  // The 64-tall band is the design spec; insets.bottom is extra padding
  // below it so a gesture-nav home indicator doesn't sit across the labels
  // (found live on a real device — the bar was flush with the screen edge).
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingBottom: insets.bottom }]}>
      {tabs.map((tab) => {
        const active = tab.key === activeTab;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onTabPress(tab.key)}
            style={[styles.tab, { width: tabWidth }]}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={tab.label}
          >
            <View style={[styles.iconFrame, active && styles.iconFrameActive]}>
              <TabIcon shape={tab.icon} active={active} />
              {tab.key === "notifications" && notificationBadge && (
                <View style={styles.badge} />
              )}
            </View>
            <Text
              style={[
                styles.label,
                { color: active ? colors.brand.primary : colors.text.secondary },
              ]}
              numberOfLines={1}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    height: 64,
    backgroundColor: colors.bg.default,
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
  },
  tab: {
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
  },
  iconFrame: {
    width: 56,
    height: 30,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  iconFrameActive: {
    backgroundColor: colors.bg.brandTint,
  },
  label: {
    ...typography.tabLabel,
    width: "100%",
    textAlign: "center",
  },
  badge: {
    position: "absolute",
    top: 2,
    right: 14,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.state.urgent,
  },
  // The icon's own frame is 24x24, per MNAV-shells.md's iconFill/iconStroke
  // frames — every icon's children are absolutely positioned inside this.
  iconBox: {
    width: 24,
    height: 24,
  },
  abs: {
    position: "absolute",
  },
});

export { TABS_BY_ROLE, SHELL_COPY_BY_ROLE };
