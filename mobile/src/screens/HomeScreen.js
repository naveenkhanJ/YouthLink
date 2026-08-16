/**
 * Temporary launch screen.
 *
 * Exists so the app runs before any real screen is built — react-navigation
 * throws if a navigator has no screens at all. Replace the initial route in
 * RootNavigator once a real entry screen exists, then delete this file.
 */
import { StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>YouthLink</Text>
      <Text style={styles.subtitle}>
        Navigation is wired up. Add your screens in{"\n"}
        src/screens/&lt;module&gt;/&lt;module&gt;.screens.js
      </Text>
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
});
