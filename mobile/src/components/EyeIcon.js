/**
 * Password-visibility eye icon, shared version — ported from
 * mobile/src/screens/account/components/EyeIcon.js onto the real design
 * tokens. No icon library is installed (an established precedent, checked
 * before this project ever added one); plain Views instead, same as
 * TabBar.js's tab glyphs.
 */
import { View, StyleSheet } from "react-native";
import { colors } from "../theme/tokens";

const SIZE = 24;

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
    borderColor: colors.text.secondary,
  },
  pupil: {
    position: "absolute",
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.text.secondary,
  },
  slash: {
    position: "absolute",
    width: SIZE - 3,
    height: 1.6,
    backgroundColor: colors.text.secondary,
    transform: [{ rotate: "45deg" }],
  },
});
