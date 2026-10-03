/**
 * Chrome/TabBar — real component pulled from Figma (fileKey 9gIi2H8L0QDQps3T8oinPC,
 * node 48:141, "Components / Chrome" page), not the text-only docs/prototype/
 * spec this was first built from. Every icon below is the exact `iconStroke`
 * path Figma exports for that tab, downloaded and inlined via react-native-svg
 * — not an approximation. See .worklog/epics/shared-ui-kit.md's 2026-09-27
 * entry for how the first version (from a paraphrase, then from hand-measured
 * bounding boxes) got several of these wrong.
 *
 * Three role variants (the only difference is which tabs exist and how many):
 *   worker    — Browse, Applications, Engagements, Notifications, Profile (5)
 *   employer  — Postings, Post a Gig, Engagements, Notifications, Profile (5)
 *   verifier  — Endorsements, Vouch, Notifications, Profile (4)
 * Each tab is flex:1 — the 360dp frame width in Figma is that reference
 * screen's width, not a hard constraint, so tabs fill whatever the real
 * device's width is. A previous version hard-coded `360 / tabs.length` as a
 * pixel width, which left a blank, easy-to-miss gap at the bar's right edge
 * on any device wider than 360dp (found live on the Pixel_8 emulator, whose
 * screen is ~411dp wide — a 135px strip of the bar simply had no tabs in it).
 *
 * Active-state rule, per the component's own Figma description ("Active tab =
 * brand tone, first tab active in each variant") and MNAV-shells.md: the
 * active tab's icon sits in a 56x30 pill filled colors.bg.brandTint, its icon
 * and label are colors.brand.primary; an inactive tab has no pill and its
 * icon/label are colors.text.secondary — no underline, no weight change.
 * iconFrame needs `overflow: "hidden"` alongside `borderRadius` — without it,
 * Android renders the conditionally-applied backgroundColor as a plain
 * square and silently ignores the radius (found live: a plain View with
 * borderRadius set unconditionally but backgroundColor applied only when
 * active rendered with square corners on Android — overflow:"hidden" forces
 * the clip; borderRadius alone was not enough).
 */
import { View, Pressable, Text, StyleSheet } from "react-native";
import Svg, { Path, Circle, Line, G } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing, radius, typography, elevation } from "../theme/tokens";

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
// real screen isn't here yet, this frame only defines the chrome."
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

/**
 * The `iconFill` (active) variant of each tab icon, read straight from the
 * Figma component (Components / Chrome, node 48:141) — shapes filled with
 * brand.primary, detail strokes in text.inverse (on the filled body) or
 * brand.primary (free-standing). Each <G> places the Figma layer at its own
 * (x, y) inside the 24x24 frame; paths are the layers' own vectorPaths.
 */
function FilledTabIcon({ shape }) {
  const fill = colors.brand.primary;
  const onFill = colors.text.inverse;
  const round = { strokeLinecap: "round", strokeLinejoin: "round" };
  switch (shape) {
    case "applications":
      return (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <G transform="translate(3 7)">
            <Path d="M0 2C0 .9.9 0 2 0H16C17.1 0 18 .9 18 2V11C18 12.1 17.1 13 16 13H2C.9 13 0 12.1 0 11V2Z" fill={fill} />
          </G>
          <G transform="translate(8 4)">
            <Path d="M0 3V2C0 .9.9 0 2 0H6C7.1 0 8 .9 8 2V3" stroke={fill} strokeWidth={2} strokeLinecap="round" />
          </G>
        </Svg>
      );
    case "engagements":
      return (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Circle cx={12} cy={12} r={9} fill={fill} />
          <G transform="translate(12 8)">
            <Path d="M0 0L0 4L3 6" stroke={onFill} strokeWidth={2} {...round} />
          </G>
        </Svg>
      );
    case "notifications":
      return (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <G transform="translate(3 3)">
            <Path d="M8 0C4.7 0 2 2.7 2 6L2 10L0 13L16 13L14 10L14 6C14 2.7 11.3 0 8 0Z" fill={fill} />
          </G>
          <G transform="translate(9.5 19)">
            <Path d="M0 0C.3 1.2 1.3 2 2.5 2C3.7 2 4.7 1.2 5 0" stroke={fill} strokeWidth={2} strokeLinecap="round" />
          </G>
        </Svg>
      );
    case "profile":
      return (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Circle cx={12} cy={7} r={4} fill={fill} />
          <G transform="translate(4 13)">
            <Path d="M0 8C0 3.6 3.6 0 8 0C12.4 0 16 3.6 16 8L0 8Z" fill={fill} />
          </G>
        </Svg>
      );
    case "postings":
      return (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <G transform="translate(5 2)">
            <Path d="M2 0C.9 0 0 .9 0 2L0 14C0 15.1.9 16 2 16L12 16C13.1 16 14 15.1 14 14L14 2C14 .9 13.1 0 12 0L2 0Z" fill={fill} />
          </G>
          <Path d="M8.5 8H15.5M8.5 12H15.5M8.5 16H13" stroke={onFill} strokeWidth={1.6} strokeLinecap="round" />
        </Svg>
      );
    case "postGig":
      return (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Circle cx={12} cy={12} r={9} fill={fill} />
          <G transform="translate(8 8)">
            <Path d="M4 0L4 8M0 4L8 4" stroke={onFill} strokeWidth={2} strokeLinecap="round" />
          </G>
        </Svg>
      );
    case "endorsements":
      return (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <G transform="translate(3 3)">
            <Path d="M9 0L18 9L9 18L0 9L9 0Z" fill={fill} />
          </G>
        </Svg>
      );
    case "vouch":
      return (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Circle cx={9.5} cy={6.5} r={3.5} fill={fill} />
          <G transform="translate(2.5 13)">
            <Path d="M0 7C0 3.1 3.1 0 7 0C10.9 0 14 3.1 14 7L0 7Z" fill={fill} />
          </G>
          <G transform="translate(17 5)">
            <Path d="M2.5 0L2.5 5M0 2.5L5 2.5" stroke={fill} strokeWidth={2} strokeLinecap="round" />
          </G>
        </Svg>
      );
    default:
      return null;
  }
}

/** Every icon is a real Figma-exported path/shape at its native 24x24
 * viewBox, colour supplied at render time (text.secondary inactive,
 * brand.primary active) rather than baked in, so one set of assets serves
 * both states. */
function TabIcon({ shape, active }) {
  // Active state (docs/prototype/MNAV-shells.md: "an `iconFill` child" on the
  // active tab, `iconStroke` on the rest). Browse is the one tab whose iconFill
  // really is the same outline recoloured (stroke 2.5 in brand.primary), so it
  // falls through to the stroke drawing below. Every other tab has a distinct
  // FILLED icon in Figma, drawn by FilledTabIcon. An earlier version applied the
  // Browse rule to every tab, which is why those active icons stayed outlines.
  if (active && shape !== "browse") {
    return <FilledTabIcon shape={shape} />;
  }
  const color = active ? colors.brand.primary : colors.text.secondary;
  const w = active ? 2.5 : 2;
  const common = { stroke: color, strokeWidth: w, fill: "none" };
  switch (shape) {
    case "browse":
      return (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Circle cx={10} cy={10} r={6} {...common} />
          <Line x1={16} y1={16} x2={21} y2={21} stroke={color} strokeWidth={w} strokeLinecap="round" />
        </Svg>
      );
    case "applications":
      return (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Path
            d="M9 7V5.5C9 4.4 9.9 3.5 11 3.5H13C14.1 3.5 15 4.4 15 5.5V7"
            stroke={color}
            strokeWidth={w}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M3 9C3 7.9 3.9 7 5 7H19C20.1 7 21 7.9 21 9V18C21 19.1 20.1 20 19 20H5C3.9 20 3 19.1 3 18V9Z"
            stroke={color}
            strokeWidth={w}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    case "engagements":
      return (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Circle cx={12} cy={12} r={8} {...common} />
          <Path d="M12 8V12L15 14" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    case "notifications":
      // Bell path is the real pillWrap export's iconStroke group, translated
      // from its 56x30-box coordinates into this 24x24 box (offset -16,-3 —
      // the same left/top the other icons sit at within their own pillWrap).
      return (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Path
            d="M5 9C5 5.7 7.7 3 11 3C14.3 3 17 5.7 17 9V13L19 16H3L5 13V9Z"
            stroke={color}
            strokeWidth={w}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path d="M9.5 19C9.8 20.2 10.8 21 12 21C13.2 21 14.2 20.2 14.5 19" stroke={color} strokeWidth={w} strokeLinecap="round" />
        </Svg>
      );
    case "profile":
      return (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Circle cx={12} cy={7} r={3} {...common} />
          <Path
            d="M4 21C4 16.6 7.6 13 12 13C16.4 13 20 16.6 20 21"
            stroke={color}
            strokeWidth={w}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    case "postings":
      return (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Path
            d="M5 4C5 2.9 5.9 2 7 2H17C18.1 2 19 2.9 19 4V16C19 17.1 18.1 18 17 18H7C5.9 18 5 17.1 5 16V4Z"
            stroke={color}
            strokeWidth={w}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path d="M8.5 8H15.5" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
          <Path d="M8.5 12H15.5" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
          <Path d="M8.5 16H13" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
        </Svg>
      );
    case "postGig":
      return (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Circle cx={12} cy={12} r={8} {...common} />
          <Path d="M12 8V16M8 12H16" stroke={color} strokeWidth={w} strokeLinecap="round" />
        </Svg>
      );
    case "endorsements":
      return (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Path
            d="M21 12L12 3L3 12L12 21L21 12Z"
            stroke={color}
            strokeWidth={w}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    case "vouch":
      return (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Circle cx={9.5} cy={6.5} r={2.5} {...common} />
          <Path
            d="M2.5 20C2.5 16.1 5.6 13 9.5 13C13.4 13 16.5 16.1 16.5 20"
            stroke={color}
            strokeWidth={w}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path d="M19.5 5V10M17 7.5H22" stroke={color} strokeWidth={w} strokeLinecap="round" />
        </Svg>
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
  // The 64-tall band is the design spec, fixed and untouched by the device —
  // insets.bottom (a gesture-nav home indicator, so the bar isn't flush with
  // the screen edge) is a separate spacer view below it, not padding inside
  // it. Padding inside the same box that centers the icon/label competes
  // with them for room: `paddingBottom` there shrinks the available content
  // area by insets.bottom (found live: content overlapped the top border on
  // a device with a 24dp inset). Switching that box to `minHeight` stopped
  // the overlap but not the underlying problem — the box merely grew to fit
  // content-plus-padding exactly, with zero margin left above the icon,
  // because insets.bottom was still competing with content for the same
  // box rather than being genuinely additional space. A sibling spacer
  // view is the only way the 64dp band's own internal spacing stays
  // exactly what the design specifies regardless of the device's inset.
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.wrapper}>
      <View style={[styles.bar, elevation.bar]}>
        {tabs.map((tab) => {
          const active = tab.key === activeTab;
          const color = active ? colors.brand.primary : colors.text.secondary;
          return (
            <Pressable
              key={tab.key}
              onPress={() => onTabPress(tab.key)}
              style={styles.tab}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              accessibilityLabel={tab.label}
            >
              <View style={[styles.iconFrame, active && styles.iconFrameActive]}>
                <TabIcon shape={tab.icon} active={active} />
                {tab.key === "notifications" && notificationBadge && (
                  <View style={styles.badge} />
                )}
              </View>
              <Text style={[styles.label, { color }]} numberOfLines={1} maxFontSizeMultiplier={1.1}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <View style={[styles.insetSpacer, { height: insets.bottom }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.bg.default,
  },
  bar: {
    flexDirection: "row",
    height: 64,
    backgroundColor: colors.bg.default,
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
  },
  insetSpacer: {
    backgroundColor: colors.bg.default,
  },
  // Figma 48:15: each tab is a column with pad 6/0/6/0 and gap 2, starting at
  // the top of the bar — not vertically centred, and a 2px gap rather than 4.
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 6 - 1, // the bar's 1px top border pushes content down; Figma has none
    gap: 2,
  },
  iconFrame: {
    width: 56,
    height: 30,
    borderRadius: radius.pill,
    overflow: "hidden",
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
    // Figma `urgentDot`: 6x6 at (38, 4) inside the 56x30 pill.
    position: "absolute",
    top: 4,
    left: 38,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.state.urgent,
  },
});

export { TABS_BY_ROLE, SHELL_COPY_BY_ROLE };
