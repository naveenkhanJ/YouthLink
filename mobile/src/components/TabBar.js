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
 * Icons are plain View-based shapes, not an icon library — matches this
 * project's existing precedent (Checkbox.js's Unicode check, EyeIcon.js's
 * plain Views) rather than adding a new dependency for this. They are a
 * best-effort reading of the spec's prose description of each glyph
 * ("outline circle + small vector", "bell + clapper", etc.), not a traced
 * vector — flag for a design pass once real icon assets exist.
 */
import { Pressable, Text, View, StyleSheet } from "react-native";
import { colors, spacing, radius, typography } from "../theme/tokens";

const TABS_BY_ROLE = {
  worker: [
    { key: "browse", label: "Browse", icon: "circle" },
    { key: "applications", label: "Applications", icon: "list" },
    { key: "engagements", label: "Engagements", icon: "arc" },
    { key: "notifications", label: "Notifications", icon: "bell" },
    { key: "profile", label: "Profile", icon: "person" },
  ],
  employer: [
    { key: "postings", label: "Postings", icon: "briefcase" },
    { key: "postGig", label: "Post a Gig", icon: "plus" },
    { key: "engagements", label: "Engagements", icon: "arc" },
    { key: "notifications", label: "Notifications", icon: "bell" },
    { key: "profile", label: "Profile", icon: "person" },
  ],
  verifier: [
    { key: "endorsements", label: "Endorsements", icon: "handHeart" },
    { key: "vouch", label: "Vouch", icon: "check" },
    { key: "notifications", label: "Notifications", icon: "bell" },
    { key: "profile", label: "Profile", icon: "person" },
  ],
};

function TabIcon({ shape, active }) {
  const stroke = active ? colors.brand.primary : colors.text.secondary;
  const fill = active ? colors.brand.primary : "transparent";

  switch (shape) {
    case "circle":
      return <View style={[styles.iconCircle, { borderColor: stroke }]} />;
    case "list":
      return (
        <View style={styles.iconStack}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={[styles.iconBar, { backgroundColor: stroke }]} />
          ))}
        </View>
      );
    case "arc":
      return (
        <View
          style={[
            styles.iconCircle,
            { borderColor: stroke, borderBottomColor: "transparent", borderRightColor: "transparent" },
          ]}
        />
      );
    case "bell":
      return (
        <View style={styles.iconBellWrap}>
          <View style={[styles.iconBell, { borderColor: stroke }]} />
          <View style={[styles.iconBellClapper, { backgroundColor: stroke }]} />
        </View>
      );
    case "person":
      return (
        <View style={styles.iconPersonWrap}>
          <View style={[styles.iconPersonHead, { borderColor: stroke }]} />
          <View style={[styles.iconPersonBody, { borderColor: stroke, backgroundColor: fill }]} />
        </View>
      );
    case "briefcase":
      return (
        <View style={[styles.iconBriefcase, { borderColor: stroke }]}>
          <View style={[styles.iconBriefcaseHandle, { borderColor: stroke }]} />
        </View>
      );
    case "plus":
      return (
        <View style={styles.iconPlusWrap}>
          <View style={[styles.iconPlusBarH, { backgroundColor: stroke }]} />
          <View style={[styles.iconPlusBarV, { backgroundColor: stroke }]} />
        </View>
      );
    case "handHeart":
      return <View style={[styles.iconDiamond, { borderColor: stroke }]} />;
    case "check":
      return <View style={[styles.iconCheck, { borderColor: stroke }]} />;
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

  return (
    <View style={styles.bar}>
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

const ICON_SIZE = 20;

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
  iconCircle: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    borderWidth: 2,
  },
  iconStack: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  iconBar: {
    height: 2,
    borderRadius: 1,
  },
  iconBellWrap: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBell: {
    width: ICON_SIZE - 6,
    height: ICON_SIZE - 6,
    borderWidth: 2,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  iconBellClapper: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    marginTop: 1,
  },
  iconPersonWrap: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    alignItems: "center",
  },
  iconPersonHead: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    borderWidth: 2,
  },
  iconPersonBody: {
    marginTop: 2,
    width: 15,
    height: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderWidth: 2,
  },
  iconBriefcase: {
    width: ICON_SIZE - 2,
    height: ICON_SIZE - 6,
    borderWidth: 2,
    borderRadius: 2,
    alignItems: "center",
  },
  iconBriefcaseHandle: {
    position: "absolute",
    top: -5,
    width: 8,
    height: 5,
    borderWidth: 2,
    borderBottomWidth: 0,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  iconPlusWrap: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  iconPlusBarH: {
    position: "absolute",
    width: ICON_SIZE - 4,
    height: 2,
    borderRadius: 1,
  },
  iconPlusBarV: {
    position: "absolute",
    width: 2,
    height: ICON_SIZE - 4,
    borderRadius: 1,
  },
  iconDiamond: {
    width: ICON_SIZE - 4,
    height: ICON_SIZE - 4,
    borderWidth: 2,
    transform: [{ rotate: "45deg" }],
  },
  iconCheck: {
    width: ICON_SIZE - 6,
    height: (ICON_SIZE - 6) / 2,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    transform: [{ rotate: "-45deg" }],
  },
});

export { TABS_BY_ROLE };
