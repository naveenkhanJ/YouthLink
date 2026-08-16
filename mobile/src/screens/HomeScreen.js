/**
 * Temporary launch screen.
 */
import { StyleSheet, Text, View, Pressable } from "react-native";
import { StatusBar } from "expo-status-bar";

const TEST_LINKS = [
  { label: "Explore Gigs (FR-DISC)", route: "DiscoveryBrowse" },
  { label: "Log in", route: "AccountLogin" },
  { label: "Create account", route: "AccountRegister" },
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
