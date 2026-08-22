/**
 * 3.13 — At the lock screen: how the two gig notifications look (FR-NOTIF-10) — Pawan.
 *
 * Reached from "How notifications look" on Notification preferences (3.11). A static explanation:
 * the regular new-gig alert and the urgent one, drawn as they would arrive, so a job-seeker can see
 * that urgent alerts come on their own channel — `channelAccent` and `urgentGlyph` in
 * `color/state/urgent`. The two cards are pictures of the OS (OS/PushNotification), not controls.
 *
 * The frame has no Chrome/ScreenHeader: a bare 44×44 back target sits at 16,6 and the title starts at
 * y 66. The frame draws no status bar, so on a device both are measured from below it (insets.top);
 * the title therefore sits 60 below the back target's top, as drawn, and never under it.
 */
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import Svg, { Path } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, radius, spacing, typography } from "../../theme/tokens";

/** One OS/PushNotification card. `urgent` adds the channel accent strip and the warning glyph. */
function PushPreview({ title, body, urgent = false }) {
  return (
    <View style={styles.push}>
      {urgent ? <View style={styles.channelAccent} /> : null}
      <View style={styles.pushContent}>
        <View style={styles.appRow}>
          <View style={styles.appIcon} />
          <Text style={styles.caption}>YouthLink · now</Text>
        </View>
        <View style={styles.titleRow}>
          {urgent ? (
            <Svg width={10} height={9} viewBox="0 0 10 9">
              <Path d="M5 0L10 9L0 9L5 0Z" fill={colors.state.urgent} />
            </Svg>
          ) : null}
          <Text style={styles.pushTitle}>{title}</Text>
        </View>
        <Text style={styles.secondary}>{body}</Text>
      </View>
    </View>
  );
}

export default function NotificationAppearanceScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + 66 }]}>
        <Text style={styles.screenTitle}>At the lock screen</Text>

        <Text style={styles.caption}>Regular channel</Text>
        <PushPreview
          title="New gig near you"
          body="Grade 8 maths tutoring · Rs 1,800 per day · 3.6 km · starts Mon 7 Sep 2026, 4:00 PM"
        />

        <Text style={styles.caption}>Urgent — dedicated channel, time-sensitive</Text>
        <PushPreview
          urgent
          title="Urgent gig near you"
          body="Event setup crew (3 needed) · Rs 6,000 for the job · 4.5 km · starts Sat 5:00 AM"
        />

        <Text style={styles.secondary}>The two feel different at the moment they arrive — not only once opened.</Text>
      </ScrollView>

      {/* backHit 44×44 at 16,6 below the status bar, with the 8×16 back chevron. */}
      <Pressable
        onPress={() => navigation.goBack()}
        style={[styles.backHit, { top: insets.top + 6 }]}
        accessibilityRole="button"
        accessibilityLabel="Back"
      >
        <Svg width={44} height={44} viewBox="0 0 44 44">
          <Path
            d="M14 14L6 22L14 30"
            stroke={colors.text.primary}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </Svg>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg.default,
  },
  // Frame: vertical, pad 66/16/24/16, gap 12.
  content: {
    paddingHorizontal: spacing.gutter,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  screenTitle: {
    ...typography.display,
    color: colors.text.primary,
  },
  caption: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  secondary: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  // OS/PushNotification: 328 wide, horizontal, r12, 1px border, color/bg/default.
  push: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: radius.sheet,
    backgroundColor: colors.bg.default,
    overflow: "hidden", // keeps the accent strip inside the rounded corners
  },
  channelAccent: {
    width: 4,
    backgroundColor: colors.state.urgent,
  },
  // content: vertical, pad 10/12/10/12, gap 2.
  pushContent: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
    gap: 2,
  },
  appRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  appIcon: {
    width: 12,
    height: 12,
    borderRadius: 3,
    backgroundColor: colors.brand.primary,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  pushTitle: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  backHit: {
    position: "absolute",
    left: spacing.gutter,
    width: 44,
    height: 44,
  },
});
