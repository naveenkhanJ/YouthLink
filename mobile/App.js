/**
 * App entry point. Deliberately trivial — all routing lives in
 * src/navigation/RootNavigator.js, and screens live in src/screens/<module>/.
 *
 * Inter (400/500/600, the UI type ramp) and Archivo Bold are loaded here, once, at the root.
 * Archivo Bold is loaded here, once, at the root — it's the ONLY place
 * Archivo appears in the app (the UI type ramp stays Inter throughout);
 * `Wordmark.js` assumes it's already loaded by the time anything renders.
 * New native-ish dependency: `expo-font` (added its own config plugin to
 * app.json) + `@expo-google-fonts/archivo` — needs a dev-client rebuild,
 * same as `expo-secure-store`/`react-native-svg` did.
 */
import { useFonts, Archivo_700Bold } from "@expo-google-fonts/archivo";
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from "@expo-google-fonts/inter";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "./src/auth/AuthContext";
import RootNavigator from "./src/navigation/RootNavigator";
import { colors } from "./src/theme/tokens";

export default function App() {
  const [fontsLoaded] = useFonts({ Archivo_700Bold, Inter_400Regular, Inter_500Medium, Inter_600SemiBold });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.bg.default }}>
        <ActivityIndicator size="large" color={colors.brand.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
