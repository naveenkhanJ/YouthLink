/**
 * App entry point. Deliberately trivial — all routing lives in
 * src/navigation/RootNavigator.js, and screens live in src/screens/<module>/.
 */
import { SafeAreaProvider } from "react-native-safe-area-context";
import RootNavigator from "./src/navigation/RootNavigator";

export default function App() {
  return (
    <SafeAreaProvider>
      <RootNavigator />
    </SafeAreaProvider>
  );
}
