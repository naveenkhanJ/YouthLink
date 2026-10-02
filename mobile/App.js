/**
 * App entry point. Routing lives in src/navigation/RootNavigator.js, and screens live in
 * src/screens/<module>/.
 *
 * Launch sequence, every time the app opens:
 *   1. The native splash (brand blue with the mark, configured in app.json) is held on screen.
 *   2. Inter and Archivo load; the saved session is read.
 *   3. BrandSplash (M0 0.1) takes over the same blue and the same mark, adds the wordmark and the
 *      tagline, and stays for at least two seconds (a tap moves on early once the app is ready).
 *   4. The navigator appears.
 *
 * Fonts: Inter (400/500/600, the UI type ramp) and Archivo Bold (the wordmark, the only place
 * Archivo appears; `Wordmark.js` assumes it is already loaded by the time anything renders).
 */
import { useEffect, useState } from "react";
import { useFonts, Archivo_700Bold } from "@expo-google-fonts/archivo";
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from "@expo-google-fonts/inter";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "./src/auth/AuthContext";
import BrandSplash from "./src/components/BrandSplash";
import RootNavigator from "./src/navigation/RootNavigator";

// Keep the native splash up until BrandSplash has drawn its first frame.
SplashScreen.preventAutoHideAsync().catch(() => {});

const SPLASH_MIN_MS = 2000;

// BrandSplash's first layout is not its first painted frame, and its position settles a moment
// later (system insets arrive). Hiding the native splash on the layout event let a black frame and a
// small jump of the mark show through, so wait until it has painted and settled.
let nativeSplashHidden = false;
function hideNativeSplash() {
  if (nativeSplashHidden) return;
  nativeSplashHidden = true;
  setTimeout(() => SplashScreen.hideAsync().catch(() => {}), 200);
}

function Launcher({ fontsLoaded }) {
  const { status } = useAuth();
  const [minElapsed, setMinElapsed] = useState(false);
  const [tapped, setTapped] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMinElapsed(true), SPLASH_MIN_MS);
    return () => clearTimeout(timer);
  }, []);

  const ready = fontsLoaded && status !== "loading";
  if (ready && (minElapsed || tapped)) return <RootNavigator />;

  return (
    <BrandSplash
      showText={fontsLoaded}
      onPress={ready ? () => setTapped(true) : undefined}
      onLayout={hideNativeSplash}
    />
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Archivo_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <Launcher fontsLoaded={fontsLoaded} />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
