/**
 * The app's neutral entry point (docs/module-ownership.md Sprint 3, shared prerequisite item 1).
 *
 * There is no designed "generic Home" screen in docs/prototype/ — MNAV-shells.md defines three
 * role-specific tab shells instead ("this frame is a definition, not a step"), each landing on
 * that role's first hub tab. So this screen's job is routing:
 *   - signed in   → that role's TabBar over the shell's host region, with the exact shell copy
 *     MNAV-shells.md wrote for it (SHELL_COPY_BY_ROLE in ../components/TabBar.js)
 *   - signed out  → depends on what the device remembers (auth/launchState.js): Log in with the
 *     last number filled in if someone signed in here before; otherwise role selection (1.1) once the
 *     first-run cards (M0 0.2–0.4; the splash is BrandSplash) have been seen; otherwise the cards.
 *
 * The hub screens (Browse, My Postings, My Endorsements) belong to other modules and are not on
 * `develop` yet, so the host region shows the prototype's own shell copy until they land
 * (docs/workflow/agent-protocol.md §4.4's "clearly marked no-op"). Sign out lives in Settings.
 */
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "../auth/AuthContext";
import TabBar, { SHELL_COPY_BY_ROLE } from "../components/TabBar";
import { colors, spacing, typography } from "../theme/tokens";
import FirstRun from "./firstrun/FirstRun";
import { readLaunchState, markOnboardingSeen } from "../auth/launchState";
import { toLocalDigits } from "./account/phoneFormat";

const ROLE_TO_TABBAR_ROLE = {
  YOUTH_JOB_SEEKER: "worker",
  EMPLOYER: "employer",
  COMMUNITY_ENDORSER: "verifier",
};

const FIRST_TAB_BY_ROLE = {
  worker: "browse",
  employer: "postings",
  verifier: "endorsements",
};

/**
 * Signed out. Where the launch begins depends on what this device remembers (auth/launchState.js):
 *   - someone signed in here before (a remembered phone) → Log in with the number filled in;
 *   - otherwise, onboarding already seen → role selection (1.1);
 *   - otherwise → the three first-run cards, then role selection.
 */
function SignedOutEntry({ navigation }) {
  // null while the saved state is being read; false = show the first-run cards.
  const [showCards, setShowCards] = useState(null);

  function goToRoleSelection() {
    navigation.reset({ index: 0, routes: [{ name: "AccountRegister" }] });
  }

  useEffect(() => {
    let cancelled = false;
    readLaunchState().then(({ onboardingSeen, lastPhone }) => {
      if (cancelled) return;
      // Home sits at the bottom of the stack, so it is also re-rendered as "signed out" while a
      // screen above it (the account-deleted screen, Settings signing out) is still doing its own
      // leaving. Only move the person when Home is the screen they are looking at.
      const atHome = navigation.isFocused();
      if (lastPhone) {
        if (atHome) {
          navigation.reset({
            index: 0,
            routes: [{ name: "AccountLogin", params: { phone: toLocalDigits(lastPhone) } }],
          });
        }
      } else if (onboardingSeen) {
        if (atHome) goToRoleSelection();
      } else {
        setShowCards(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  async function finish() {
    await markOnboardingSeen();
    goToRoleSelection();
  }

  // Brand-blue while the saved state is read, so nothing white flashes between the splash and the screen.
  if (!showCards) return <View style={styles.entryBlank} />;
  return <FirstRun onDone={finish} />;
}

function SignedInShell({ user, navigation }) {
  const tabBarRole = ROLE_TO_TABBAR_ROLE[user.role];
  const [activeTab, setActiveTab] = useState(FIRST_TAB_BY_ROLE[tabBarRole]);
  const shellCopy = SHELL_COPY_BY_ROLE[tabBarRole];

  return (
    <View style={styles.flex}>
      <View style={styles.hubContent}>
        <Text style={styles.title}>{shellCopy.title}</Text>
        <Text style={styles.subtitle}>{shellCopy.hosts}</Text>
      </View>
      <TabBar
        role={tabBarRole}
        activeTab={activeTab}
        onTabPress={(key) => {
          // Profile (1.18) is built; the other hubs are other modules' and stay placeholders here.
          if (key === "profile") navigation.navigate("ProfileOwn");
          else setActiveTab(key);
        }}
      />
      <StatusBar style="dark" />
    </View>
  );
}

export default function HomeScreen({ navigation }) {
  const { status, user } = useAuth();

  if (status === "loading") {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.brand.primary} />
      </View>
    );
  }

  if (status === "signedIn") {
    return <SignedInShell user={user} navigation={navigation} />;
  }

  return <SignedOutEntry navigation={navigation} />;
}

const styles = StyleSheet.create({
  // MNAV shells draw the host region on bg/subtle.
  flex: {
    flex: 1,
    backgroundColor: colors.bg.subtle,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
    backgroundColor: colors.bg.default,
  },
  hubContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  title: {
    ...typography.title,
    color: colors.text.primary,
    textAlign: "center",
  },
  subtitle: {
    ...typography.secondary,
    color: colors.text.secondary,
    textAlign: "center",
  },
  entryBlank: {
    flex: 1,
    backgroundColor: colors.brand.primary,
  },
});
