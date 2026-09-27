/**
 * The app's neutral entry point (docs/module-ownership.md Sprint 3, shared
 * prerequisite item 1) — replaces the placeholder that used to live here.
 *
 * There is no designed "generic Home" screen in docs/prototype/ (MNAV-shells.md
 * defines three role-specific tab shells instead, each landing on that role's
 * first hub tab), so this screen's job is routing, not its own UI:
 *   - signed out  → the existing login/register screens (docs/prototype/'s
 *     M0 onboarding + 1.1 role-selection aren't built yet; this is a
 *     deliberately minimal stand-in, not a UI-conformance screen)
 *   - signed in   → that role's TabBar, on its first hub tab
 *
 * The real hub screens (Browse, My Postings, My Endorsements) aren't on
 * develop yet — they're on other modules' unmerged Sprint 3 branches — so
 * each one is a clearly-marked placeholder here (docs/workflow/agent-protocol.md
 * §4.4's "clearly marked no-op") until those PRs land. Swapping a placeholder
 * for the real screen at that point is a one-line change to HUB_SCREEN_BY_TAB
 * below, not a rebuild of this file.
 */
import { useState } from "react";
import { ActivityIndicator, Button as RNButton, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "../auth/AuthContext";
import TabBar from "../components/TabBar";
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

const HUB_LABEL_BY_TAB = {
  browse: "Browse",
  postings: "My Postings",
  endorsements: "My Endorsements",
};

function SignedOutEntry({ navigation }) {
  return (
    <View style={styles.centered}>
      <Text style={styles.title}>YouthLink</Text>
      <Text style={styles.subtitle}>Find part-time work, hire for a gig, or vouch for someone you know.</Text>
      <View style={styles.buttonStack}>
        <RNButton title="Log in" onPress={() => navigation.navigate("AccountLogin")} />
        <RNButton title="Create account" onPress={() => navigation.navigate("AccountRegister")} />
      </View>
      <StatusBar style="dark" />
    </View>
  );
}

function SignedInShell({ user, signOut }) {
  const tabBarRole = ROLE_TO_TABBAR_ROLE[user.role];
  const [activeTab, setActiveTab] = useState(FIRST_TAB_BY_ROLE[tabBarRole]);

  return (
    <View style={styles.flex}>
      <View style={styles.hubContent}>
        <Text style={styles.title}>{HUB_LABEL_BY_TAB[activeTab] ?? activeTab}</Text>
        <Text style={styles.subtitle}>
          Signed in as {user.legalName} ({user.role}). This module's real screen isn't merged
          into develop yet — placeholder content until it lands.
        </Text>
        <View style={styles.buttonStack}>
          <RNButton title="Sign out" onPress={signOut} />
        </View>
      </View>
      <TabBar role={tabBarRole} activeTab={activeTab} onTabPress={setActiveTab} />
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
    return <SignedInShell user={user} signOut={signOut} />;
  }

  return <SignedOutEntry navigation={navigation} />;
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
    ...typography.display,
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
