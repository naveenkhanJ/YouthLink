/**
 * DEMO-ONLY hub screen — integration showcase branch. NOT part of any epic.
 *
 * ===========================================================================
 * Only exists on `demo/integration-showcase`. Never merge into develop.
 * ===========================================================================
 *
 * The problem this solves: nothing in the app navigates anywhere. HomeScreen
 * is a placeholder with no links, so reaching any screen meant hand-editing
 * RootNavigator's initialRouteName and reloading — fine for one developer
 * testing one screen, useless for a demo where four slices get shown in an
 * order nobody has fixed in advance.
 *
 * So this is the launcher: every registered screen, grouped by whose slice it
 * belongs to, reachable in one tap from a screen that is always the stack root.
 * Screens come from moduleRegistry, which reads the same manifests
 * RootNavigator does — so a teammate pushing a screen gets it listed here
 * automatically, without editing anything of mine.
 *
 * Deliberately plain. It is scaffolding around four people's real work, and it
 * should look like scaffolding rather than pass for anyone's finished UI.
 */
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ACTIVE_MODULES, DEFERRED_MODULES } from "./moduleRegistry";
import {
  SEEDED_ACCOUNTS,
  getSession,
  signIn,
  signOut,
  subscribe,
} from "./demoSession";

/** ActorRole -> the wording used in docs/requirements.md, for the header. */
const ROLE_LABELS = {
  YOUTH_JOB_SEEKER: "Youth Job-Seeker",
  EMPLOYER: "Employer",
  COMMUNITY_ENDORSER: "Community Endorser",
};

export default function DemoHubScreen({ navigation }) {
  const [session, setSession] = useState(getSession);
  const [busyPhone, setBusyPhone] = useState(null);
  const [error, setError] = useState(null);

  // The session lives outside React (a plain module), so the hub subscribes
  // rather than owning it — any other demo screen can sign out and this
  // header stays correct.
  useEffect(() => subscribe(setSession), []);

  async function handleSignIn(phone) {
    setBusyPhone(phone);
    setError(null);
    try {
      await signIn(phone);
    } catch (err) {
      // Almost always "backend not running" or "seed not run" during a demo,
      // so say that rather than only echoing the raw message.
      setError(
        `${err.message}\n\nIs the backend running on port 3000, and has ` +
          "backend/src/demo/seed.demo.js been run?",
      );
    } finally {
      setBusyPhone(null);
    }
  }

  const user = session?.user;

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.banner}>
          Integration demo build — scaffolding, not production UI
        </Text>

        {/* ---- Who is signed in --------------------------------------- */}
        <View style={styles.sessionCard}>
          {user ? (
            <>
              <Text style={styles.sessionName}>{user.legalName}</Text>
              <Text style={styles.sessionRole}>
                {ROLE_LABELS[user.role] ?? user.role} · {user.phone}
              </Text>
              <Pressable style={styles.signOut} onPress={signOut}>
                <Text style={styles.signOutText}>Sign out</Text>
              </Pressable>
            </>
          ) : (
            <Text style={styles.sessionEmpty}>Not signed in</Text>
          )}
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {/* ---- One-tap role switching --------------------------------- */}
        <Section
          title="Switch role"
          note="Seeded accounts, for moving between slices quickly. Account Management's own Log in and Create account screens are listed below."
        >
          {SEEDED_ACCOUNTS.map((account) => {
            const active = user?.phone === account.phone;
            return (
              <Pressable
                key={account.phone}
                style={[styles.row, active && styles.rowActive]}
                disabled={busyPhone !== null || active}
                onPress={() => handleSignIn(account.phone)}
              >
                <View style={styles.rowMain}>
                  <Text style={[styles.rowTitle, active && styles.rowTitleActive]}>
                    {account.label}
                  </Text>
                  <Text style={styles.rowDetail}>
                    {account.name} · {account.detail}
                  </Text>
                </View>
                {busyPhone === account.phone ? (
                  <ActivityIndicator size="small" />
                ) : (
                  <Text style={styles.rowMark}>{active ? "current" : "→"}</Text>
                )}
              </Pressable>
            );
          })}
        </Section>

        {/* ---- Demo-only screens -------------------------------------- */}
        <Section
          title="Demo scaffolding"
          note="Not anyone's slice. Browse stands in for Discovery so a worker can reach a posting; Notifications makes FR-APPLY-08/09 visible."
        >
          <ScreenRows
            navigation={navigation}
            screens={[
              { name: "DemoBrowse", options: { title: "Browse postings" } },
              { name: "DemoNotifications", options: { title: "Notifications" } },
            ]}
            enabled={Boolean(user)}
          />
        </Section>

        {/* ---- The four Sprint 1-2 slices ----------------------------- */}
        {ACTIVE_MODULES.map((module) => (
          <Section
            key={module.key}
            title={module.title}
            note={`${module.epic} · ${module.owner}`}
          >
            {module.screens.length === 0 ? (
              <Text style={styles.emptyNote}>
                No screens pushed yet. Any screen added to{" "}
                {module.key}.screens.js appears here automatically.
              </Text>
            ) : (
              <ScreenRows
                navigation={navigation}
                screens={module.screens}
                // Account Management's screens are how you sign in, so they
                // must stay reachable while signed out.
                enabled={module.key === "account" ? true : Boolean(user)}
              />
            )}
          </Section>
        ))}

        {/* ---- Deferred, listed so the demo can say what is out of scope */}
        <Section
          title="Deferred slices"
          note="No owner, no sprint assigned — docs/module-ownership.md"
        >
          <Text style={styles.emptyNote}>
            {DEFERRED_MODULES.map((m) => m.title).join(" · ")}
          </Text>
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

/** A titled group with an explanatory note. */
function Section({ title, note, children }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {note ? <Text style={styles.sectionNote}>{note}</Text> : null}
      {children}
    </View>
  );
}

/** One tappable row per screen, using each manifest entry's own title. */
function ScreenRows({ navigation, screens, enabled }) {
  return screens.map((screen) => (
    <Pressable
      key={screen.name}
      style={[styles.row, !enabled && styles.rowDisabled]}
      disabled={!enabled}
      onPress={() => navigation.navigate(screen.name)}
    >
      <View style={styles.rowMain}>
        <Text style={styles.rowTitle}>
          {screen.options?.title ?? screen.name}
        </Text>
        <Text style={styles.rowDetail}>{screen.name}</Text>
      </View>
      <Text style={styles.rowMark}>{enabled ? "→" : "sign in first"}</Text>
    </Pressable>
  ));
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F3F4F6" },
  content: { padding: 16, paddingBottom: 40 },

  banner: {
    fontSize: 12,
    fontWeight: "600",
    color: "#92400E",
    backgroundColor: "#FEF3C7",
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginBottom: 16,
    textAlign: "center",
  },

  sessionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  sessionName: { fontSize: 18, fontWeight: "700", color: "#111827" },
  sessionRole: { fontSize: 13, color: "#6B7280", marginTop: 2 },
  sessionEmpty: { fontSize: 15, color: "#6B7280" },
  signOut: { marginTop: 12, alignSelf: "flex-start" },
  signOutText: { fontSize: 14, fontWeight: "600", color: "#DC2626" },

  error: {
    fontSize: 13,
    color: "#991B1B",
    backgroundColor: "#FEE2E2",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    lineHeight: 19,
  },

  section: { marginBottom: 22 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#111827" },
  sectionNote: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
    marginBottom: 8,
    lineHeight: 17,
  },
  emptyNote: {
    fontSize: 13,
    color: "#9CA3AF",
    fontStyle: "italic",
    lineHeight: 18,
    paddingVertical: 6,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  rowActive: { borderColor: "#5B4FE0", backgroundColor: "#EEF2FF" },
  rowDisabled: { opacity: 0.45 },
  rowMain: { flex: 1 },
  rowTitle: { fontSize: 15, fontWeight: "600", color: "#111827" },
  rowTitleActive: { color: "#5B4FE0" },
  rowDetail: { fontSize: 12, color: "#6B7280", marginTop: 2 },
  rowMark: { fontSize: 12, color: "#9CA3AF", marginLeft: 10 },
});
