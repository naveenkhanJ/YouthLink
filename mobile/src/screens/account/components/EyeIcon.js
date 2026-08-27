/**
 * Password-visibility eye icon — Account Management module only. No icon
 * library is installed (checked before adding one — see TextField.js's
 * note); built from plain Views instead, same avoid-the-dependency
 * precedent as Checkbox.js's Unicode "✓". Two states: a plain eye (tap to
 * reveal) and an eye with a diagonal slash through it (tap to hide).
 */
import { View, StyleSheet } from "react-native";
import { colors } from "../theme";

const SIZE = 22;

/**
 * @param {boolean} revealed - true renders the "hide" (slashed) state.
 */
export default function EyeIcon({ revealed }) {
  return (
    <View style={styles.container}>
      <View style={styles.lid} />
      <View style={styles.pupil} />
      {revealed ? <View style={styles.slash} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SIZE,
    height: SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  lid: {
    width: SIZE - 4,
    height: 13,
    borderRadius: 7,
    borderWidth: 1.6,
    borderColor: colors.textSecondary,
  },
  pupil: {
    position: "absolute",
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.textSecondary,
  },
  slash: {
    position: "absolute",
    width: SIZE - 3,
    height: 1.6,
    backgroundColor: colors.textSecondary,
    transform: [{ rotate: "45deg" }],
  },
});
