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

import { ACTIVE_MODULES } from "./moduleRegistry";
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

/** Initials for the signed-in avatar, e.g. "Dilani Fernando" -> "DF". */
function initials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

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
        {/* ---- Branded header carrying the session --------------------- */}
        <View style={styles.hero}>
          <View style={styles.heroTop}>
            <Text style={styles.heroTitle}>YouthLink</Text>
            <Text style={styles.heroTag}>DEMO BUILD</Text>
          </View>

          {user ? (
            <View style={styles.identity}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials(user.legalName)}</Text>
              </View>
              <View style={styles.identityMain}>
                <Text style={styles.identityName}>{user.legalName}</Text>
                <Text style={styles.identityMeta}>
                  {ROLE_LABELS[user.role] ?? user.role} · {user.phone}
                </Text>
              </View>
              <Pressable style={styles.signOut} onPress={signOut} hitSlop={8}>
                <Text style={styles.signOutText}>Sign out</Text>
              </Pressable>
            </View>
          ) : (
            <Text style={styles.identityEmpty}>
              Not signed in — pick a role below to begin
            </Text>
          )}
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {/* ---- One-tap role switching --------------------------------- */}
        <Section
          title="Switch role"
          note="A fixed list of seeded fixtures, for moving between slices quickly. An account you register in the app won't appear here — sign in to it through Log in, under Account Management below."
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

  hero: {
    backgroundColor: "#1D4ED8",
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
  },
  heroTop: { flexDirection: "row", alignItems: "center" },
  heroTitle: { flex: 1, fontSize: 20, fontWeight: "800", color: "#FFFFFF" },
  heroTag: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.6,
    color: "#BFDBFE",
    borderColor: "#60A5FA",
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
    overflow: "hidden",
  },

  identity: { flexDirection: "row", alignItems: "center", marginTop: 16 },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#3B82F6",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#FFFFFF", fontWeight: "800", fontSize: 15 },
  identityMain: { flex: 1, marginLeft: 12 },
  identityName: { fontSize: 16, fontWeight: "700", color: "#FFFFFF" },
  identityMeta: { fontSize: 12, color: "#BFDBFE", marginTop: 2 },
  identityEmpty: { fontSize: 14, color: "#DBEAFE", marginTop: 14 },
  signOut: {
    borderWidth: 1,
    borderColor: "#93C5FD",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  signOutText: { fontSize: 12, fontWeight: "700", color: "#FFFFFF" },

  error: {
    fontSize: 13,
    color: "#991B1B",
    backgroundColor: "#FEE2E2",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    lineHeight: 19,
  },

  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: "#1D4ED8",
  },
  sectionNote: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
    marginBottom: 10,
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
    borderRadius: 10,
    paddingVertical: 13,
    paddingHorizontal: 14,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    // Subtle lift so the cards read as tappable against the grey ground.
    shadowColor: "#0F172A",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  rowActive: { borderColor: "#1D4ED8", borderWidth: 2, backgroundColor: "#EFF6FF" },
  rowDisabled: { opacity: 0.45 },
  rowMain: { flex: 1 },
  rowTitle: { fontSize: 15, fontWeight: "600", color: "#111827" },
  rowTitleActive: { color: "#1D4ED8" },
  rowDetail: { fontSize: 12, color: "#6B7280", marginTop: 3, lineHeight: 16 },
  rowMark: { fontSize: 12, color: "#9CA3AF", marginLeft: 10, fontWeight: "600" },
});
