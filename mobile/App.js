/**
 * App entry point. Deliberately trivial — all routing lives in
 * src/navigation/RootNavigator.js, and screens live in src/screens/<module>/.
 */
import { SafeAreaProvider } from "react-native-safe-area-context";
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
  return (
    <SafeAreaProvider>
      <RootNavigator />
    </SafeAreaProvider>
  );
}
