/**
 * Temporary launch screen.
 *
 * Exists so the app runs before any real screen is built — react-navigation
 * throws if a navigator has no screens at all. Replace the initial route in
 * RootNavigator once a real entry screen exists, then delete this file.
 *
 * The buttons below are temporary manual-testing scaffolding (added while
 * verifying the dev-client build and Firebase on-device) — there's no real
 * app-wide navigation flow decided yet for where a user lands after each of
 * these. Remove once real navigation exists or an actual entry flow is
 * decided; every route name here must already exist in some module's
 * <module>.screens.js or this will crash at startup.
 *
 * Merge note (demo/integration-showcase): Applying & Selection and Discovery
 * each added their own links to this list independently and conflicted here.
 * Resolved as the union — nobody's links were dropped. On the demo branch
 * this screen is no longer the entry point anyway (RootNavigator starts on
 * DemoHub, which lists every module's screens from their manifests), but it
 * stays reachable and working. Both owners will hit this same conflict when
 * their branches merge to develop; the union is the resolution.
 */
import { StyleSheet, Text, View, Pressable } from "react-native";
import { StatusBar } from "expo-status-bar";

const TEST_LINKS = [
  { label: "Log in", route: "AccountLogin" },
  { label: "Create account", route: "AccountRegister" },
  { label: "Explore Gigs (FR-DISC)", route: "DiscoveryBrowse" },
  { label: "Notification preferences (FR-NOTIF)", route: "NotificationPreferences" },
  { label: "Listing detail (FR-APPLY)", route: "ApplicationListingDetail" },
  { label: "My applications (FR-APPLY)", route: "ApplicationMine" },
  { label: "Applicant pool (FR-APPLY)", route: "ApplicationApplicantPool" },
];

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>YouthLink</Text>
      <Text style={styles.subtitle}>
        Navigation is wired up. Explore gigs or test features below:
      </Text>

      <View style={styles.links}>
        {TEST_LINKS.map(({ label, route }) => (
          <Pressable
            key={route}
            style={styles.linkButton}
            onPress={() => navigation.navigate(route)}
          >
            <Text style={styles.linkLabel}>{label}</Text>
          </Pressable>
        ))}
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  title: { fontSize: 28, fontWeight: "600", marginBottom: 12 },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    color: "#555",
  },
  links: { marginTop: 32, width: "100%", gap: 12 },
  linkButton: {
    borderWidth: 1,
    borderColor: "#5B4FE0",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  linkLabel: { color: "#5B4FE0", fontWeight: "600" },
});
