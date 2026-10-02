/**
 * The app's neutral entry point (docs/module-ownership.md Sprint 3, shared prerequisite item 1).
 *
 * There is no designed "generic Home" screen in docs/prototype/ — MNAV-shells.md defines three
 * role-specific tab shells instead ("this frame is a definition, not a step"), each landing on
 * that role's first hub tab. So this screen's job is routing:
 *   - signed in   → that role's TabBar over the shell's host region, with the exact shell copy
 *     MNAV-shells.md wrote for it (SHELL_COPY_BY_ROLE in ../components/TabBar.js)
 *   - signed out  → first run (M0: the three cards; the splash is BrandSplash) the first time the app opens, then
 *     straight to 1.1 role selection (the first step of AccountRegister) on every later launch,
 *     per M0's "onboarding already seen" rule.
 *
 * The hub screens (Browse, My Postings, My Endorsements) belong to other modules and are not on
 * `develop` yet, so the host region shows the prototype's own shell copy until they land
 * (docs/workflow/agent-protocol.md §4.4's "clearly marked no-op"). Sign out lives in Settings.
 */
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "../auth/AuthContext";
import TabBar, { SHELL_COPY_BY_ROLE } from "../components/TabBar";
import { colors, spacing, typography } from "../theme/tokens";
import FirstRun from "./firstrun/FirstRun";

const ONBOARDING_KEY = "youthlink.onboardingSeen";

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

/** Signed out: the first-run cards once (the splash before them is BrandSplash), then 1.1 (role selection). */
function SignedOutEntry({ navigation }) {
  // null while the stored flag is being read.
  const [seen, setSeen] = useState(null);

  function goToRoleSelection() {
    navigation.reset({ index: 0, routes: [{ name: "AccountRegister" }] });
  }

  // Home sits at the bottom of the stack, so it is also re-rendered as "signed out" while a screen
  // above it (the account-deleted screen, Settings signing out) is still doing its own leaving.
  // Only move the person when Home is the screen they are looking at.

  useEffect(() => {
    let cancelled = false;
    SecureStore.getItemAsync(ONBOARDING_KEY)
      .then((value) => {
        if (cancelled) return;
        if (value) {
          if (navigation.isFocused()) goToRoleSelection();
        }
        else setSeen(false);
      })
      // An unreadable flag only means the cards are shown once more; never block the app on it.
      .catch(() => !cancelled && setSeen(false));
    return () => {
      cancelled = true;
    };
  }, []);

  async function finish() {
    try {
      await SecureStore.setItemAsync(ONBOARDING_KEY, "1");
    } catch (err) {
      console.warn("Could not remember that onboarding was seen:", err);
    }
    goToRoleSelection();
  }

  // Brand-blue while reading the flag, so the splash does not flash white first.
  if (seen === null) return <View style={styles.entryBlank} />;
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
