/**
 * Input/Checkbox — real Figma component (node 23:16, "Components /
 * Inputs" page, found 2026-09-28). New in the shared kit — the only
 * existing checkbox was a one-off in `screens/account/components/`, built
 * against that module's own (confirmed-wrong) `theme.js` before this kit
 * or real Figma access existed. Per its own description, ToS/Privacy
 * acceptance (FR-ACC-19) is the only drawn usage — the `label` prop stays
 * a ReactNode (not a plain string) so a caller can compose the two linked
 * spans ("Terms of Service"/"Privacy Policy") the real component shows,
 * same shape the old local version already got right.
 *
 * State: Unchecked | Checked | Error. Error adds a caption-sized message
 * below the row, not just a red box — callers pass it as `errorMessage`.
 */
import { Pressable, Text, View, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";
import { colors, spacing, radius, typography } from "../theme/tokens";

/**
 * @param {boolean} checked
 * @param {() => void} onToggle
 * @param {import("react").ReactNode} label
 * @param {string} [errorMessage] - Shown below the row when set; also reddens the box.
 */
export default function Checkbox({ checked, onToggle, label, errorMessage }) {
  return (
    <View style={styles.container}>
      <Pressable
        style={styles.row}
        onPress={onToggle}
        accessibilityRole="checkbox"
        accessibilityState={{ checked }}
      >
        <View
          style={[
            styles.box,
            checked && styles.boxChecked,
            errorMessage && styles.boxError,
          ]}
        >
          {checked ? (
            // The exact vector from Figma node 23:9 (12 x 9.5, drawn at 6,7.5
            // inside the 24px box): stroke text/inverse 2.5, round caps/joins.
            <Svg width={12} height={9.5} viewBox="0 0 12 9.5" fill="none">
              <Path
                d="M0 5L4.5 9.5L12 0"
                stroke={colors.text.inverse}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          ) : null}
        </View>
        <Text style={styles.label}>{label}</Text>
      </Pressable>
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    paddingVertical: 2, // Figma: row pad 2/0/2/0
  },
  box: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: colors.border.default,
    backgroundColor: colors.bg.default,
    alignItems: "center",
    justifyContent: "center",
  },
  // Checked: solid brand fill, no stroke (Figma 23:8 has fill only). The border
  // is kept at the same width in the same colour so the 24px box does not
  // change size between states.
  boxChecked: {
    backgroundColor: colors.brand.primary,
    borderColor: colors.brand.primary,
  },
  boxError: {
    borderColor: colors.border.error,
  },
  label: {
    flex: 1,
    ...typography.secondary,
    color: colors.text.primary,
  },
  errorText: {
    ...typography.caption,
    color: colors.state.danger,
  },
});
