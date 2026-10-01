/**
 * Own profile (prototype 1.18 and its variants 1.18z / 1.18bio / 1.18b, 1.18ez / 1.18e / 1.18ed /
 * 1.18eg, 1.18n / 1.18nc, 1.18vz / 1.18v; FR-PROF-01, FR-PROF-02, FR-PROF-06) — Afham.
 *
 * What a person sees of themselves on the Profile tab. The frames are one layout whose parts depend
 * on the role and on what exists, so this is one screen reading the server's own-profile answer:
 *
 *   nameRow        the display name (a Business employer's business name, FR-PROF-01) beside the
 *                  "Phone verified" badge (FR-PROF-02 — never a badge implying NIC verification);
 *                  it wraps when the two do not fit one line (1.18e, 4 px between the lines)
 *   trust block    history: stars + "N% completion · M jobs" (an employer: "N engagements
 *                  completed"); zero history: "New to YouthLink", with the Endorsed badge and
 *                  "Endorsed by …" when an endorsement exists; a verifier: "Community Verifier" and
 *                  "Vouching since May 2026 · 3 endorsed"
 *   bio            the bio when there is one; for a zero-history worker without one, the link
 *                  "Add a short bio to help employers know you." (the editor is M7 7.1)
 *   worker only    ENDORSEMENTS with the endorsements received, or the empty note
 *   rows           "My endorsement code" (· closed once a rating has landed) / "My endorsements" /
 *                  "Settings", which opens the unified Settings screen
 *
 * Rows whose target belongs to another module (the endorsement code, M8; the bio editor, M7) do
 * nothing until that screen is registered, the same way Settings treats its rows.
 */
import { useCallback, useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable, ActivityIndicator, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import useForegroundRefresh from "../../auth/useForegroundRefresh";
import Svg, { Path } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../auth/AuthContext";
import { getOwnProfile } from "../../api/profile";
import { colors, spacing, elevation, typography } from "../../theme/tokens";
import Badge from "../../components/Badge";
import ProfileTrustBlock from "../../components/ProfileTrustBlock";
import EndorsementRow from "../../components/EndorsementRow";
import FormBanner from "../../components/FormBanner";
import Link from "../../components/Link";
import TabBar from "../../components/TabBar";

const TAB_ROLE = { YOUTH_JOB_SEEKER: "worker", EMPLOYER: "employer", COMMUNITY_ENDORSER: "verifier" };
const BIO_PROMPT = "Add a short bio to help employers know you.";
const EMPTY_ENDORSEMENTS = "No endorsements yet. Share your code and someone who knows you can vouch for you.";

// Destinations owned by other modules; opened only once a module has registered them.
const ENDORSEMENT_CODE = "EndorsementCode"; // M8 8.1 / 8.1b
const MY_ENDORSEMENTS = "EndorsementList"; // M8 8.5 / 8.5z
const BIO_EDITOR = "ProfileBio"; // M7 7.1

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** "Vouching since May 2026 · 3 endorsed" (1.18v) / "Vouching since today · nobody yet" (1.18vz). */
function verifierLine(verifier) {
  const since = new Date(verifier.since);
  const now = new Date();
  const today =
    since.getFullYear() === now.getFullYear() && since.getMonth() === now.getMonth() && since.getDate() === now.getDate();
  const when = today ? "today" : `${MONTHS[since.getMonth()]} ${since.getFullYear()}`;
  return `Vouching since ${when} · ${verifier.endorsedCount > 0 ? `${verifier.endorsedCount} endorsed` : "nobody yet"}`;
}

/** A white row with a chevron: 328×52, pad 14, radius 10, the card shadow (Figma row-*). */
function ProfileRow({ label, onPress }) {
  return (
    <Pressable onPress={onPress} style={[styles.row, elevation.card]} accessibilityRole="button">
      <Text style={styles.rowLabel}>{label}</Text>
      <Svg width={6} height={12} viewBox="0 0 6 12" fill="none" overflow="visible">
        <Path
          d="M0 0L6 6L0 12"
          stroke={colors.text.secondary}
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="miter"
        />
      </Svg>
    </Pressable>
  );
}

export default function ProfileOwnScreen({ navigation }) {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setProfile(await getOwnProfile());
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  // Every time the profile comes into view: a rating revealed, an endorsement given, a name edited.
  useEffect(() => {
    load();
    return navigation.addListener("focus", load);
  }, [navigation, load]);
  useForegroundRefresh(load);

  /** Opens `name` if some module has registered it; a not-yet-built screen is a no-op. */
  function open(name, params) {
    if (navigation.getState().routeNames.includes(name)) navigation.navigate(name, params);
  }

  const tabRole = TAB_ROLE[user?.role];
  const tabBar = tabRole ? (
    <TabBar
      role={tabRole}
      activeTab="profile"
      onTabPress={(key) => {
        if (key !== "profile") navigation.navigate("Home"); // the other hubs are other modules'
      }}
    />
  ) : null;

  if (!profile) {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <StatusBar style="dark" />
        <View style={styles.centered}>
          {error ? (
            <>
              <FormBanner kind="error" message={error} />
              <Link title="Try again" onPress={load} />
            </>
          ) : (
            <ActivityIndicator size="large" color={colors.brand.primary} />
          )}
        </View>
        {tabBar}
      </View>
    );
  }

  const { trust } = profile;
  const isWorker = profile.role === "YOUTH_JOB_SEEKER";
  const isVerifier = profile.role === "COMMUNITY_ENDORSER";
  const isEmployer = profile.role === "EMPLOYER";
  const history = trust.tier === "history";

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.nameRow}>
          <Text style={styles.displayName}>{profile.displayName}</Text>
          {profile.phoneVerified ? <Badge family="verified" /> : null}
        </View>

        {history ? (
          <ProfileTrustBlock
            tier="history"
            ratingAverage={trust.ratingAverage}
            ratingCount={trust.ratingCount}
            completionRate={trust.completionRate}
            jobCount={trust.jobCount}
            subtext={isEmployer ? `${profile.employer.completedEngagements} ${profile.employer.completedEngagements === 1 ? "engagement" : "engagements"} completed` : undefined}
          />
        ) : isVerifier ? (
          <ProfileTrustBlock tier="zeroHistory" headline="Community Verifier" subtext={verifierLine(profile.verifier)} />
        ) : (
          <ProfileTrustBlock tier="zeroHistory" endorserName={profile.endorsedBy ?? undefined} />
        )}

        {profile.bio ? (
          <Text style={styles.bio}>{profile.bio}</Text>
        ) : isWorker && !history ? (
          <Text style={styles.bioPrompt} onPress={() => open(BIO_EDITOR)}>
            {BIO_PROMPT}
          </Text>
        ) : null}

        {isWorker ? (
          <>
            <Text style={styles.section}>ENDORSEMENTS</Text>
            {profile.endorsements.length > 0 ? (
              profile.endorsements.map((e, i) => (
                <EndorsementRow
                  key={`${e.endorserName}-${i}`}
                  endorserName={e.endorserName}
                  reason={e.reason}
                  attributes={e.attributes}
                />
              ))
            ) : (
              <Text style={styles.emptyNote}>{EMPTY_ENDORSEMENTS}</Text>
            )}
            <ProfileRow
              label={profile.endorsementCodeClosed ? "My endorsement code · closed" : "My endorsement code"}
              onPress={() => open(ENDORSEMENT_CODE)}
            />
          </>
        ) : null}
        {isVerifier ? <ProfileRow label="My endorsements" onPress={() => open(MY_ENDORSEMENTS)} /> : null}

        <ProfileRow label="Settings" onPress={() => navigation.navigate("AccountSettings")} />
      </ScrollView>
      {tabBar}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg.subtle,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    padding: spacing.lg,
    gap: spacing.lg,
  },
  // Figma 1.18: content pad 66/16/16/16, gap 16 (the 66 is 6 + the 44 top bar the other pages
  // draw + 16; the frame excludes the OS status bar, which the root's inset covers).
  content: {
    flexGrow: 1,
    paddingTop: 66,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.lg,
  },
  // nameRow fills the width and wraps: the name and the badge sit on one line when they fit, and
  // the badge drops beneath a long business name with 4px between the lines (1.18e).
  nameRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    columnGap: spacing.sm,
    rowGap: spacing.xs,
  },
  displayName: {
    ...typography.title,
    color: colors.text.primary,
  },
  bio: {
    ...typography.body,
    color: colors.text.secondary,
  },
  bioPrompt: {
    ...typography.body,
    color: colors.brand.primary,
  },
  section: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  emptyNote: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    padding: 14,
    borderRadius: 10, // Figma row-*: r10 (not one of the named radii)
    backgroundColor: colors.bg.default,
  },
  rowLabel: {
    flex: 1,
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
});
