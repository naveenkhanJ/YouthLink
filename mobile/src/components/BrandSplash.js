/**
 * The branded launch screen (prototype M0 0.1): brand-blue ground, the mark, the wordmark and the
 * tagline. It is shown on every launch while the app loads its fonts and restores the saved
 * session, for at least two seconds, or until it is tapped once the app is ready.
 *
 * The native Android splash is set to the same blue with the same mark at the same size, dead
 * centre (see app.json), so the handoff to this screen does not visibly change: the mark stays
 * put and the wordmark and tagline appear under it. The wordmark is Archivo, which is not loaded
 * for the first few frames, so the text waits for `showText`.
 */
import { View, Text, Pressable, StyleSheet } from "react-native";
import { colors, typography } from "../theme/tokens";
import Mark from "./Mark";

const MARK_SIZE = 76;

/**
 * @param {boolean} showText - false until Archivo is loaded (the mark alone matches the native splash).
 * @param {() => void} [onPress] - Tap to move on; omit while the app is still loading.
 * @param {() => void} [onLayout] - Called once the screen is on screen (hides the native splash).
 */
export default function BrandSplash({ showText, onPress, onLayout }) {
  return (
    <Pressable style={styles.root} onPress={onPress} onLayout={onLayout} accessibilityLabel="YouthLink">
      {/* The mark is centred on the screen; the text hangs below it, so the mark never moves. */}
      <View style={styles.markWrap}>
        <Mark tone="onBrand" size={MARK_SIZE} />
        {showText ? (
          <View style={styles.text}>
            <Text style={styles.name}>YouthLink</Text>
            <Text style={styles.tagline}>Verified local work for young people</Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.brand.primary,
  },
  markWrap: {
    width: MARK_SIZE,
    height: MARK_SIZE,
    alignItems: "center",
  },
  // M0 0.1: wordmark 38px under the mark, tagline right under it.
  text: {
    position: "absolute",
    top: MARK_SIZE + 38,
    width: 320,
    alignItems: "center",
  },
  // The wordmark has no text style on purpose: it is Archivo Bold, the only non-Inter text.
  name: {
    fontFamily: "Archivo_700Bold",
    fontSize: 32,
    lineHeight: 40,
    color: colors.text.inverse,
    textAlign: "center",
  },
  tagline: {
    marginTop: 2,
    ...typography.secondary,
    color: colors.text.inverse,
    opacity: 0.82,
    textAlign: "center",
  },
});
