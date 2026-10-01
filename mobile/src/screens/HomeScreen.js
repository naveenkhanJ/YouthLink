/**
 * The app's neutral entry point (docs/module-ownership.md Sprint 3, shared
 * prerequisite item 1) — replaces the placeholder that used to live here.
 *
 * There is no designed "generic Home" screen in docs/prototype/ — MNAV-shells.md
 * defines three role-specific tab shells instead ("this frame is a definition,
 * not a step... no flow visits them"), each landing on that role's first hub
 * tab. So this screen's job is routing, not its own UI:
 *   - signed in   → that role's TabBar + the exact shell copy MNAV-shells.md
 *     already wrote for it (SHELL_COPY_BY_ROLE in ../components/TabBar.js)
 *   - signed out  → held off entirely, on Afham's explicit instruction
 *     (2026-09-27): docs/prototype/'s M0 onboarding + 1.1 role-selection are
 *     what actually belongs here, and neither is in scope yet. What's below
 *     is deliberately NOT designed UI — no tokens, no brand styling, same
 *     plain-scaffold spirit as this file's original placeholder — just
 *     enough to keep reaching the existing Login/Register screens for
 *     testing until M0 is actually built. Do not "improve" its look; that
 *     was the mistake the first time (a full YouthLink-branded screen that
 *     doesn't exist anywhere in the prototype).
 *
 * The real hub screens (Browse, My Postings, My Endorsements) aren't on
 * develop yet — they're on other modules' unmerged Sprint 3 branches — so
 * each one is a clearly-marked placeholder here (docs/workflow/agent-protocol.md
 * §4.4's "clearly marked no-op") until those PRs land.
 */
import { useState } from "react";
import { ActivityIndicator, Button as RNButton, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "../auth/AuthContext";
import TabBar, { SHELL_COPY_BY_ROLE } from "../components/TabBar";
import { colors, spacing, typography } from "../theme/tokens";

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

// Deliberately plain — not a designed screen, see the file header.
function SignedOutScaffold({ navigation }) {
  return (
    <View style={scaffoldStyles.container}>
      <Text style={scaffoldStyles.note}>
        Not signed in. M0 onboarding / 1.1 role selection aren't built yet — this is
        engineering scaffolding to reach Login/Register, not app UI.
      </Text>
      <RNButton title="Log in" onPress={() => navigation.navigate("AccountLogin")} />
      <RNButton title="Create account" onPress={() => navigation.navigate("AccountRegister")} />
    </View>
  );
}

function SignedInShell({ user, signOut, navigation }) {
  const tabBarRole = ROLE_TO_TABBAR_ROLE[user.role];
  const [activeTab, setActiveTab] = useState(FIRST_TAB_BY_ROLE[tabBarRole]);
  const shellCopy = SHELL_COPY_BY_ROLE[tabBarRole];

  return (
    <View style={styles.flex}>
      <View style={styles.hubContent}>
        <Text style={styles.title}>{shellCopy.title}</Text>
        <Text style={styles.subtitle}>{shellCopy.hosts}</Text>
        <View style={styles.buttonStack}>
          <RNButton title="Sign out" onPress={signOut} />
        </View>
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
  const { status, user, signOut } = useAuth();

  if (status === "loading") {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.brand.primary} />
      </View>
    );
  }

  if (status === "signedIn") {
    return <SignedInShell user={user} signOut={signOut} navigation={navigation} />;
  }

  return <SignedOutScaffold navigation={navigation} />;
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.bg.default,
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
    padding: spacing.xl,
  },
  title: {
    ...typography.title,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  subtitle: {
    ...typography.secondary,
    color: colors.text.secondary,
    textAlign: "center",
  },
  buttonStack: {
    marginTop: spacing.xl,
    gap: spacing.md,
    width: "100%",
  },
});

// Intentionally not using theme tokens here — see the file header on why
// this stays a plain scaffold rather than designed UI.
const scaffoldStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 12,
    backgroundColor: "#fff",
  },
  note: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 12,
  },
});
